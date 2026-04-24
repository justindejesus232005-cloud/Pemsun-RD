/**
 * Pemsun RD - Apps Script backend (Beta)
 *
 * Setup:
 * 1) Create a Google Sheet.
 * 2) Put the Sheet ID in SPREADSHEET_ID.
 * 3) Deploy as Web App (Execute as Me, Anyone with link).
 * 4) Use the Web App URL in window.PEMSUN_RD_API_BASE_URL.
 */
const SPREADSHEET_ID = 'PUT_SPREADSHEET_ID_HERE';
const SHEET_STATE = 'State';
const SHEET_AUDIT = 'AuditLog';
const API_KEY = ''; // optional

function doGet(e) {
  return handleRequest_(e, 'GET');
}

function doPost(e) {
  return handleRequest_(e, 'POST');
}

function handleRequest_(e, method) {
  try {
    const params = getParams_(e);

    if (API_KEY && params.apiKey !== API_KEY) {
      return jsonResponse_({ ok: false, error: 'unauthorized' });
    }

    const action = String(params.action || '').trim();
    if (!action) {
      return jsonResponse_({ ok: false, error: 'missing_action' });
    }

    if (action === 'get_state') {
      const studentId = normalizeStudentId_(params.studentId);
      if (!studentId) {
        return jsonResponse_({ ok: false, error: 'invalid_student_id' });
      }

      const data = getState_(studentId);
      appendAudit_(studentId, 'get_state', method);
      return jsonResponse_({ ok: true, data: data });
    }

    if (action === 'save_state') {
      const studentId = normalizeStudentId_(params.studentId);
      if (!studentId) {
        return jsonResponse_({ ok: false, error: 'invalid_student_id' });
      }

      const payloadRaw = String(params.payload || '');
      if (!payloadRaw) {
        return jsonResponse_({ ok: false, error: 'missing_payload' });
      }

      let payload;
      try {
        payload = JSON.parse(payloadRaw);
      } catch (_error) {
        return jsonResponse_({ ok: false, error: 'payload_not_json' });
      }

      const sanitized = sanitizeUniState_(payload);
      upsertState_(studentId, sanitized);
      appendAudit_(studentId, 'save_state', method);
      return jsonResponse_({ ok: true, data: { studentId: studentId, saved: true } });
    }

    return jsonResponse_({ ok: false, error: 'unknown_action' });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function getParams_(e) {
  const base = (e && e.parameter) ? e.parameter : {};

  if (e && e.postData && e.postData.contents) {
    const ct = String(e.postData.type || '').toLowerCase();

    if (ct.indexOf('application/json') >= 0) {
      try {
        const body = JSON.parse(e.postData.contents);
        return Object.assign({}, base, body);
      } catch (_error) {
        return base;
      }
    }
  }

  return base;
}

function normalizeStudentId_(value) {
  const cleaned = String(value || '').trim();
  if (!/^[a-zA-Z0-9_-]{3,64}$/.test(cleaned)) {
    return '';
  }
  return cleaned;
}

function sanitizeUniState_(payload) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const hasMultiCareerShape = source.careers && typeof source.careers === 'object';

  if (hasMultiCareerShape) {
    const outMulti = {
      selectedUniversityId: sanitizeLooseId_(source.selectedUniversityId),
      selectedCareerId: sanitizeLooseId_(source.selectedCareerId),
      careers: {}
    };

    Object.keys(source.careers).forEach(function (careerId) {
      const safeCareerId = sanitizeLooseId_(careerId);
      if (!safeCareerId) {
        return;
      }

      outMulti.careers[safeCareerId] = sanitizeCareerState_(source.careers[careerId]);
    });

    if (!outMulti.careers[outMulti.selectedCareerId]) {
      if (Object.keys(outMulti.careers).length > 0) {
        outMulti.selectedCareerId = Object.keys(outMulti.careers)[0];
      } else {
        outMulti.selectedCareerId = '';
      }
    }

    return outMulti;
  }

  return sanitizeCareerState_(source);
}

function sanitizeCareerState_(source) {
  const out = { subjects: {}, agenda: [] };

  const subjects = source.subjects && typeof source.subjects === 'object' ? source.subjects : {};
  Object.keys(subjects).forEach(function (subjectId) {
    const safeSubjectId = sanitizeLooseId_(subjectId);
    if (!safeSubjectId) {
      return;
    }

    const row = subjects[subjectId];
    if (!row || typeof row !== 'object') {
      return;
    }

    var state = String(row.state || 'pending');
    if (['pending', 'current', 'passed'].indexOf(state) < 0) {
      state = 'pending';
    }

    var grade = Number(row.grade || 0);
    if (!isFinite(grade)) {
      grade = 0;
    }
    grade = Math.max(0, Math.min(100, Math.round(grade)));

    if (state !== 'passed') {
      grade = 0;
    }
    if (state === 'passed' && grade < 70) {
      state = 'pending';
      grade = 0;
    }

    out.subjects[safeSubjectId] = { state: state, grade: grade };
  });

  const agenda = Array.isArray(source.agenda) ? source.agenda : [];
  agenda.forEach(function (item) {
    if (!item || typeof item !== 'object') {
      return;
    }

    const title = String(item.title || '').trim().slice(0, 120);
    const date = String(item.date || '').trim();
    const type = ['examen', 'entrega', 'exposicion'].indexOf(item.type) >= 0 ? item.type : 'examen';
    const subjectId = sanitizeLooseId_(item.subjectId);

    if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !subjectId) {
      return;
    }

    out.agenda.push({
      id: String(item.id || Utilities.getUuid()),
      title: title,
      date: date,
      type: type,
      subjectId: subjectId
    });
  });

  return out;
}

function sanitizeLooseId_(value) {
  const cleaned = String(value || '').trim();
  if (!/^[a-zA-Z0-9_-]{2,80}$/.test(cleaned)) {
    return '';
  }
  return cleaned;
}

function getState_(studentId) {
  const sheet = ensureSheet_(SHEET_STATE, ['student_id', 'state_json', 'updated_at']);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return { selectedUniversityId: '', selectedCareerId: '', careers: {} };
  }

  const values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0]) === studentId) {
      try {
        return JSON.parse(String(values[i][1] || '{}'));
      } catch (_error) {
        return { selectedUniversityId: '', selectedCareerId: '', careers: {} };
      }
    }
  }

  return { selectedUniversityId: '', selectedCareerId: '', careers: {} };
}

function upsertState_(studentId, stateObj) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = ensureSheet_(SHEET_STATE, ['student_id', 'state_json', 'updated_at']);
    const lastRow = sheet.getLastRow();
    const now = new Date();
    const json = JSON.stringify(stateObj);

    if (lastRow < 2) {
      sheet.appendRow([studentId, json, now]);
      return;
    }

    const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = values.length - 1; i >= 0; i--) {
      if (String(values[i][0]) === studentId) {
        const rowIndex = i + 2;
        sheet.getRange(rowIndex, 2, 1, 2).setValues([[json, now]]);
        return;
      }
    }

    sheet.appendRow([studentId, json, now]);
  } finally {
    lock.releaseLock();
  }
}

function appendAudit_(studentId, action, method) {
  const sheet = ensureSheet_(SHEET_AUDIT, ['timestamp', 'student_id', 'action', 'method']);
  sheet.appendRow([new Date(), studentId, action, method]);
}

function ensureSheet_(name, headers) {
  const book = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = book.getSheetByName(name);

  if (!sheet) {
    sheet = book.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }

  return sheet;
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
