// ==========================================
// Pemsun RD - University Beta Module
// - No localStorage
// - Backend-first persistence (Apps Script)
// - Multi university/career selector
// ==========================================

const APP_CONFIG = {
  apiBaseUrl: (window.PEMSUN_RD_API_BASE_URL || '').trim(),
  fallbackStatePath: 'universidad.json'
};

const ALLOWED_SUBJECT_STATES = new Set(['pending', 'current', 'passed']);
const ALLOWED_EVENT_TYPES = new Set(['examen', 'entrega', 'exposicion']);
const DEFAULT_STATE_KEY = (window.PEMSUN_RD_STATE_KEY || 'pemsun-rd').trim() || 'pemsun-rd';

const APP_UNIVERSITY_CATALOG = Array.isArray(window.UNIVERSITY_CATALOG) ? window.UNIVERSITY_CATALOG : [];
const UNIVERSITY_INDEX = new Map();
const CAREER_INDEX = new Map();

let state = { uni: createDefaultUniState() };
let currentStudentId = '';
let pendingGradeSubjectId = null;

let currentUniversityId = '';
let currentCareerId = '';
let currentCareer = null;
let currentCurriculum = [];
let currentSubjectIndex = new Map();

buildCatalogIndexes();

function buildCatalogIndexes() {
  UNIVERSITY_INDEX.clear();
  CAREER_INDEX.clear();

  APP_UNIVERSITY_CATALOG.forEach((university) => {
    if (!university || !university.id || !Array.isArray(university.careers)) {
      return;
    }

    UNIVERSITY_INDEX.set(university.id, university);

    university.careers.forEach((career) => {
      if (!career || !career.id || !Array.isArray(career.curriculum)) {
        return;
      }

      const subjectIndex = new Map();
      career.curriculum.forEach((semester) => {
        (semester.subjects || []).forEach((subject) => {
          subjectIndex.set(subject.id, subject);
        });
      });

      CAREER_INDEX.set(career.id, {
        ...career,
        universityId: university.id,
        universityName: university.name,
        subjectIndex
      });
    });
  });
}

function getDefaultUniversityId() {
  return APP_UNIVERSITY_CATALOG.length > 0 ? APP_UNIVERSITY_CATALOG[0].id : '';
}

function getDefaultCareerId(universityId) {
  const university = UNIVERSITY_INDEX.get(universityId);
  if (!university || !Array.isArray(university.careers) || university.careers.length === 0) {
    return '';
  }

  return university.careers[0].id;
}

function createDefaultUniState() {
  return {
    selectedUniversityId: '',
    selectedCareerId: '',
    careers: {}
  };
}

function cloneDefaultCareerState() {
  return { subjects: {}, agenda: [] };
}

function normalizeCareerState(rawCareerState, careerId) {
  const source = rawCareerState && typeof rawCareerState === 'object' ? rawCareerState : {};
  const normalized = cloneDefaultCareerState();

  const career = CAREER_INDEX.get(careerId);
  const subjectIndex = career ? career.subjectIndex : new Map();

  const inputSubjects = source.subjects && typeof source.subjects === 'object' ? source.subjects : {};
  Object.keys(inputSubjects).forEach((subjectId) => {
    if (!subjectIndex.has(subjectId)) {
      return;
    }

    const row = inputSubjects[subjectId];
    if (!row || typeof row !== 'object') {
      return;
    }

    let rowState = ALLOWED_SUBJECT_STATES.has(row.state) ? row.state : 'pending';
    let rowGrade = clampInt(row.grade, 0, 100);

    if (rowState !== 'passed') {
      rowGrade = 0;
    }

    if (rowState === 'passed' && rowGrade < 70) {
      rowState = 'pending';
      rowGrade = 0;
    }

    normalized.subjects[subjectId] = {
      state: rowState,
      grade: rowGrade
    };
  });

  const inputAgenda = Array.isArray(source.agenda) ? source.agenda : [];
  inputAgenda.forEach((eventRow) => {
    if (!eventRow || typeof eventRow !== 'object') {
      return;
    }

    const title = String(eventRow.title || '').trim().slice(0, 120);
    const date = String(eventRow.date || '').trim();
    const type = ALLOWED_EVENT_TYPES.has(eventRow.type) ? eventRow.type : 'examen';
    const subjectId = String(eventRow.subjectId || '').trim();

    if (!title || !isIsoDate(date) || !subjectIndex.has(subjectId)) {
      return;
    }

    normalized.agenda.push({
      id: String(eventRow.id || createId()),
      title,
      date,
      type,
      subjectId
    });
  });

  normalized.agenda.sort((a, b) => toMiddayDate(a.date) - toMiddayDate(b.date));

  return normalized;
}

function ensureUniStateShape(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const normalized = createDefaultUniState();

  const sourceCareers = source.careers && typeof source.careers === 'object' ? source.careers : {};
  Object.keys(sourceCareers).forEach((careerId) => {
    if (!CAREER_INDEX.has(careerId)) {
      return;
    }

    normalized.careers[careerId] = normalizeCareerState(sourceCareers[careerId], careerId);
  });

  const hasLegacyShape = Boolean(source.subjects || source.agenda);
  if (hasLegacyShape) {
    const defaultUniversityId = getDefaultUniversityId();
    const defaultCareerId = getDefaultCareerId(defaultUniversityId);
    if (defaultCareerId) {
      normalized.careers[defaultCareerId] = normalizeCareerState(
        { subjects: source.subjects, agenda: source.agenda },
        defaultCareerId
      );
    }
  }

  let selectedUniversityId = String(source.selectedUniversityId || '').trim();
  if (!UNIVERSITY_INDEX.has(selectedUniversityId)) {
    selectedUniversityId = getDefaultUniversityId();
  }

  let selectedCareerId = String(source.selectedCareerId || '').trim();
  const selectedCareer = CAREER_INDEX.get(selectedCareerId);
  if (!selectedCareer || selectedCareer.universityId !== selectedUniversityId) {
    selectedCareerId = getDefaultCareerId(selectedUniversityId);
  }

  if (selectedCareerId && !normalized.careers[selectedCareerId]) {
    normalized.careers[selectedCareerId] = cloneDefaultCareerState();
  }

  normalized.selectedUniversityId = selectedUniversityId;
  normalized.selectedCareerId = selectedCareerId;

  return normalized;
}

function getCurrentCareerState() {
  if (!state.uni || typeof state.uni !== 'object') {
    state.uni = createDefaultUniState();
  }

  if (!state.uni.careers || typeof state.uni.careers !== 'object') {
    state.uni.careers = {};
  }

  if (!currentCareerId) {
    return cloneDefaultCareerState();
  }

  if (!state.uni.careers[currentCareerId]) {
    state.uni.careers[currentCareerId] = cloneDefaultCareerState();
  }

  return state.uni.careers[currentCareerId];
}

function isSubjectPassed(subjectState) {
  return Boolean(subjectState && subjectState.state === 'passed' && Number(subjectState.grade) >= 70);
}

function getMissingPrereqs(subjectId) {
  const subject = currentSubjectIndex.get(subjectId);
  if (!subject || !Array.isArray(subject.prereqs)) {
    return [];
  }

  const careerState = getCurrentCareerState();
  return subject.prereqs.filter((prereqId) => !isSubjectPassed(careerState.subjects[prereqId]));
}

function resolveStudentId() {
  return DEFAULT_STATE_KEY;
}

function setSyncStatus(text, isError) {
  const statusEl = document.getElementById('sync-status');
  if (!statusEl) {
    return;
  }

  statusEl.textContent = text;
  statusEl.style.color = isError ? '#ef4444' : 'var(--text-muted)';
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) {
    return;
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

function setCurrentCareer(careerId, options = {}) {
  const { updateSelectors = true, persistSelection = false, showMessage = '' } = options;

  const career = CAREER_INDEX.get(careerId);
  if (!career) {
    return false;
  }

  currentCareerId = career.id;
  currentUniversityId = career.universityId;
  currentCareer = career;
  currentCurriculum = Array.isArray(career.curriculum) ? career.curriculum : [];
  currentSubjectIndex = career.subjectIndex || new Map();

  state.uni.selectedUniversityId = currentUniversityId;
  state.uni.selectedCareerId = currentCareerId;
  if (!state.uni.careers[currentCareerId]) {
    state.uni.careers[currentCareerId] = cloneDefaultCareerState();
  }

  if (updateSelectors) {
    syncSelectorsToCurrentCareer();
  }

  updateCareerHeader();
  updateCareerMeta();
  renderAll();

  if (persistSelection) {
    void saveState(false);
  }

  if (showMessage) {
    showToast(showMessage);
  }

  return true;
}

function syncSelectorsToCurrentCareer() {
  const universitySelect = document.getElementById('university-select');
  const careerSelect = document.getElementById('career-select');

  if (universitySelect instanceof HTMLSelectElement) {
    universitySelect.value = currentUniversityId;
  }

  if (careerSelect instanceof HTMLSelectElement) {
    careerSelect.value = currentCareerId;
  }
}

function updateCareerHeader() {
  const subtitle = document.getElementById('career-subtitle');
  if (!subtitle) {
    return;
  }

  if (!currentCareer) {
    subtitle.textContent = 'Carrera no seleccionada';
    return;
  }

  const plan = currentCareer.plan ? ` - ${currentCareer.plan}` : '';
  subtitle.textContent = `${currentCareer.name} (${currentCareer.universityName})${plan}`;
}

function updateCareerMeta() {
  const meta = document.getElementById('career-meta');
  if (!meta) {
    return;
  }

  if (!currentCareer) {
    meta.textContent = 'Selecciona universidad y carrera';
    return;
  }

  const totalSubjects = currentCurriculum.reduce((acc, semester) => acc + (semester.subjects || []).length, 0);
  meta.textContent = `${currentCareer.universityName} - ${currentCareer.name} (${totalSubjects} materias)`;
}

function populateUniversitySelect(preferredUniversityId) {
  const select = document.getElementById('university-select');
  if (!(select instanceof HTMLSelectElement)) {
    return '';
  }

  select.innerHTML = '';

  APP_UNIVERSITY_CATALOG.forEach((university) => {
    const option = document.createElement('option');
    option.value = university.id;
    option.textContent = university.name;
    select.appendChild(option);
  });

  const defaultUniversityId = getDefaultUniversityId();
  const selectedUniversityId = UNIVERSITY_INDEX.has(preferredUniversityId) ? preferredUniversityId : defaultUniversityId;

  if (selectedUniversityId) {
    select.value = selectedUniversityId;
  }

  return selectedUniversityId;
}

function populateCareerSelect(universityId, filterText, preferredCareerId) {
  const select = document.getElementById('career-select');
  if (!(select instanceof HTMLSelectElement)) {
    return '';
  }

  select.innerHTML = '';

  const university = UNIVERSITY_INDEX.get(universityId);
  if (!university || !Array.isArray(university.careers)) {
    return '';
  }

  const normalizedFilter = String(filterText || '').trim().toLowerCase();
  const careers = university.careers.filter((career) => {
    if (!normalizedFilter) {
      return true;
    }

    const needle = `${career.name} ${career.code || ''}`.toLowerCase();
    return needle.includes(normalizedFilter);
  });

  if (careers.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'No hay resultados para esa busqueda';
    select.appendChild(option);
    return '';
  }

  careers.forEach((career) => {
    const option = document.createElement('option');
    option.value = career.id;
    option.textContent = career.code ? `${career.name} (${career.code})` : career.name;
    select.appendChild(option);
  });

  const preferredExists = preferredCareerId && careers.some((career) => career.id === preferredCareerId);
  const selectedCareerId = preferredExists ? preferredCareerId : careers[0].id;
  select.value = selectedCareerId;

  return selectedCareerId;
}

function applyStateSelectionToUiAndContext() {
  const selectedUniversityId = state.uni.selectedUniversityId || getDefaultUniversityId();
  const finalUniversityId = populateUniversitySelect(selectedUniversityId);

  const selectedCareerId = state.uni.selectedCareerId || getDefaultCareerId(finalUniversityId);
  const finalCareerId = populateCareerSelect(finalUniversityId, '', selectedCareerId);

  if (finalCareerId) {
    setCurrentCareer(finalCareerId, { updateSelectors: false, persistSelection: false });
  }
}

function switchUniTab(tabId) {
  document.querySelectorAll('.uni-tab').forEach((button) => {
    button.classList.toggle('active', button.dataset.tab === tabId);
  });

  document.querySelectorAll('.uni-tab-content').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `uni-tab-${tabId}`);
  });
}

function bindUIEvents() {
  document.querySelectorAll('.uni-tab').forEach((button) => {
    button.addEventListener('click', () => switchUniTab(button.dataset.tab));
  });

  const universitySelect = document.getElementById('university-select');
  if (universitySelect instanceof HTMLSelectElement) {
    universitySelect.addEventListener('change', () => {
      const nextUniversityId = universitySelect.value;
      const searchInput = document.getElementById('career-search-input');
      const filterText = searchInput instanceof HTMLInputElement ? searchInput.value : '';
      const nextCareerId = populateCareerSelect(nextUniversityId, filterText, getDefaultCareerId(nextUniversityId));

      if (nextCareerId) {
        setCurrentCareer(nextCareerId, {
          updateSelectors: false,
          persistSelection: true,
          showMessage: 'Carrera cargada'
        });
      }
    });
  }

  const careerSearch = document.getElementById('career-search-input');
  if (careerSearch instanceof HTMLInputElement) {
    careerSearch.addEventListener('input', () => {
      const universitySelectEl = document.getElementById('university-select');
      const selectedUniversityId = universitySelectEl instanceof HTMLSelectElement ? universitySelectEl.value : getDefaultUniversityId();
      const selectedCareerId = populateCareerSelect(selectedUniversityId, careerSearch.value, currentCareerId);

      if (!selectedCareerId) {
        return;
      }

      if (selectedCareerId !== currentCareerId) {
        setCurrentCareer(selectedCareerId, {
          updateSelectors: false,
          persistSelection: false
        });
      }
    });
  }

  const careerSelect = document.getElementById('career-select');
  if (careerSelect instanceof HTMLSelectElement) {
    careerSelect.addEventListener('change', () => {
      if (!careerSelect.value) {
        return;
      }

      setCurrentCareer(careerSelect.value, {
        updateSelectors: false,
        persistSelection: true,
        showMessage: 'Carrera cargada'
      });
    });
  }

  const semestersContainer = document.getElementById('uni-semesters-container');
  if (semestersContainer) {
    semestersContainer.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement) || !target.classList.contains('uni-select-state')) {
        return;
      }

      const subjectId = target.dataset.subjectId || '';
      if (!subjectId) {
        return;
      }

      handleUniStateChange(subjectId, target.value, target);
    });
  }

  const agendaList = document.getElementById('uni-agenda-list');
  if (agendaList) {
    agendaList.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const deleteButton = target.closest('.uni-delete-event');
      if (!deleteButton) {
        return;
      }

      const eventId = deleteButton.getAttribute('data-event-id');
      if (eventId) {
        deleteUniAgendaEvent(decodeURIComponent(eventId));
      }
    });
  }

  const gradeSlider = document.getElementById('uni-grade-slider');
  if (gradeSlider) {
    gradeSlider.addEventListener('input', (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement) {
        onGradeSliderChange(target.value);
      }
    });
  }

  const gradeConfirm = document.getElementById('confirm-grade-btn');
  if (gradeConfirm) {
    gradeConfirm.addEventListener('click', confirmGrade);
  }

  const gradeCancel = document.getElementById('cancel-grade-btn');
  if (gradeCancel) {
    gradeCancel.addEventListener('click', closeGradeModal);
  }

  const openAgenda = document.getElementById('open-uni-agenda-modal');
  if (openAgenda) {
    openAgenda.addEventListener('click', openUniAgendaModal);
  }

  const saveAgenda = document.getElementById('save-agenda-btn');
  if (saveAgenda) {
    saveAgenda.addEventListener('click', saveUniAgendaEvent);
  }

  const cancelAgenda = document.getElementById('cancel-agenda-btn');
  if (cancelAgenda) {
    cancelAgenda.addEventListener('click', closeUniAgendaModal);
  }

  const saveStateButton = document.getElementById('save-state-btn');
  if (saveStateButton) {
    saveStateButton.addEventListener('click', () => {
      void saveState(true);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeGradeModal();
      closeUniAgendaModal();
    }
  });

  const gradeModal = document.getElementById('uni-grade-modal');
  if (gradeModal) {
    gradeModal.addEventListener('click', (event) => {
      if (event.target === gradeModal) {
        closeGradeModal();
      }
    });
  }

  const agendaModal = document.getElementById('uni-agenda-modal');
  if (agendaModal) {
    agendaModal.addEventListener('click', (event) => {
      if (event.target === agendaModal) {
        closeUniAgendaModal();
      }
    });
  }
}

function renderUniPensum() {
  const container = document.getElementById('uni-semesters-container');
  if (!container) {
    return;
  }

  if (!Array.isArray(currentCurriculum) || currentCurriculum.length === 0) {
    container.innerHTML = '<div class=\"empty-state\">No hay pensum disponible para esta carrera.</div>';
    updateUniDashboard();
    return;
  }

  const careerState = getCurrentCareerState();

  let html = '';
  currentCurriculum.forEach((semester) => {
    html += `
      <div class=\"uni-semester-block\">
        <div class=\"uni-semester-title\">Semestre ${escapeHtml(String(semester.semester))}${semester.name ? ` - ${escapeHtml(semester.name)}` : ''}</div>
        <div class=\"uni-subjects-grid\">
    `;

    (semester.subjects || []).forEach((subject) => {
      const subjectId = subject.id;
      const subjectState = careerState.subjects[subjectId] || { state: 'pending', grade: 0 };
      const missingPrereqs = getMissingPrereqs(subjectId);
      const prereqText = Array.isArray(subject.prereqs) && subject.prereqs.length
        ? `Pre: ${escapeHtml(subject.prereqs.join(', '))}`
        : 'Sin prerequisitos';

      const gradeColor = subjectState.grade >= 90
        ? '#10b981'
        : subjectState.grade >= 80
          ? '#3b82f6'
          : '#f59e0b';

      html += `
        <div class=\"uni-subject-card state-${escapeAttr(subjectState.state)}\">
          <div class=\"uni-subject-header\">
            <span class=\"uni-subject-name\">${escapeHtml(subject.name)}</span>
            <span class=\"uni-subject-cr\">${escapeHtml(String(subject.cr))} CR</span>
          </div>
          <div class=\"uni-subject-meta\">${escapeHtml(subject.id)} - ${prereqText}</div>
          ${missingPrereqs.length ? `<div class=\"uni-subject-meta\" style=\"color:#ef4444;\">Bloqueada por: ${escapeHtml(missingPrereqs.join(', '))}</div>` : ''}
          <div class=\"uni-subject-actions\">
            <select class=\"uni-select-state\" data-subject-id=\"${escapeAttr(subject.id)}\">
              <option value=\"pending\" ${subjectState.state === 'pending' ? 'selected' : ''}>Pendiente</option>
              <option value=\"current\" ${subjectState.state === 'current' ? 'selected' : ''}>Cursando</option>
              <option value=\"passed\" ${subjectState.state === 'passed' ? 'selected' : ''}>Aprobada</option>
            </select>
            ${subjectState.state === 'passed' && subjectState.grade >= 70
              ? `<span class=\"grade-pill\"><span class=\"grade-value\" style=\"color:${gradeColor};\">${escapeHtml(String(subjectState.grade))}</span> pts</span>`
              : ''}
          </div>
        </div>
      `;
    });

    html += '</div></div>';
  });

  container.innerHTML = html;
  updateUniDashboard();
}

function updateUniDashboard() {
  const careerState = getCurrentCareerState();

  let totalCredits = 0;
  let passedCredits = 0;
  let totalGrades = 0;
  let gradeCount = 0;

  currentCurriculum.forEach((semester) => {
    (semester.subjects || []).forEach((subject) => {
      totalCredits += Number(subject.cr || 0);

      const row = careerState.subjects[subject.id];
      if (isSubjectPassed(row)) {
        passedCredits += Number(subject.cr || 0);
        totalGrades += Number(row.grade || 0);
        gradeCount += 1;
      }
    });
  });

  const avgGrade = gradeCount > 0 ? Math.round(totalGrades / gradeCount) : 0;
  const progressPct = totalCredits > 0 ? Math.round((passedCredits / totalCredits) * 100) : 0;

  const gpaEl = document.getElementById('uni-gpa-val');
  const creditsEl = document.getElementById('uni-cr-approved');
  const pctEl = document.getElementById('uni-progress-pct');
  const barEl = document.getElementById('uni-progress-bar');

  if (gpaEl) {
    gpaEl.textContent = String(avgGrade);
    gpaEl.style.color = avgGrade < 70 && gradeCount > 0 ? '#ef4444' : '#5e6ad2';
  }

  if (creditsEl) {
    creditsEl.textContent = String(passedCredits);
  }

  if (pctEl) {
    pctEl.textContent = `${progressPct}%`;
  }

  if (barEl) {
    barEl.style.width = `${progressPct}%`;
  }
}

function handleUniStateChange(subjectId, newState, selectEl) {
  const careerState = getCurrentCareerState();
  const current = careerState.subjects[subjectId] || { state: 'pending', grade: 0 };

  if (!ALLOWED_SUBJECT_STATES.has(newState)) {
    selectEl.value = current.state;
    return;
  }

  if (newState === 'current' || newState === 'passed') {
    const missingPrereqs = getMissingPrereqs(subjectId);
    if (missingPrereqs.length > 0) {
      selectEl.value = current.state;
      showToast(`No puedes tomarla aun. Falta: ${missingPrereqs.join(', ')}`);
      return;
    }
  }

  if (newState === 'passed') {
    pendingGradeSubjectId = subjectId;
    openGradeModal(subjectId);
    selectEl.value = current.state;
    return;
  }

  careerState.subjects[subjectId] = { state: newState, grade: 0 };
  renderUniPensum();
  void saveState(false);
}

function openGradeModal(subjectId) {
  pendingGradeSubjectId = subjectId;

  const subject = currentSubjectIndex.get(subjectId);
  const label = `${subjectId} - ${subject ? subject.name : ''}`;

  const modal = document.getElementById('uni-grade-modal');
  const subjectEl = document.getElementById('uni-grade-modal-subject');
  const sliderEl = document.getElementById('uni-grade-slider');

  if (!modal || !subjectEl || !(sliderEl instanceof HTMLInputElement)) {
    return;
  }

  const careerState = getCurrentCareerState();
  const prev = careerState.subjects[subjectId];
  const defaultGrade = prev && prev.grade >= 70 ? prev.grade : 80;

  subjectEl.textContent = label;
  sliderEl.value = String(defaultGrade);
  onGradeSliderChange(defaultGrade);
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeGradeModal() {
  const modal = document.getElementById('uni-grade-modal');
  if (!modal) {
    return;
  }

  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  pendingGradeSubjectId = null;
}

function onGradeSliderChange(nextValue) {
  const grade = clampInt(nextValue, 0, 100);

  const display = document.getElementById('uni-grade-display');
  const warning = document.getElementById('uni-grade-warning');

  if (display) {
    display.textContent = String(grade);
    if (grade >= 90) {
      display.style.color = '#10b981';
    } else if (grade >= 80) {
      display.style.color = '#3b82f6';
    } else if (grade >= 70) {
      display.style.color = '#f59e0b';
    } else {
      display.style.color = '#ef4444';
    }
  }

  if (warning) {
    warning.classList.toggle('hidden', grade >= 70);
  }
}

function confirmGrade() {
  if (!pendingGradeSubjectId) {
    return;
  }

  const slider = document.getElementById('uni-grade-slider');
  if (!(slider instanceof HTMLInputElement)) {
    return;
  }

  const grade = clampInt(slider.value, 0, 100);
  if (grade < 70) {
    showToast('Para aprobar debes registrar 70 o mas.');
    return;
  }

  const careerState = getCurrentCareerState();
  careerState.subjects[pendingGradeSubjectId] = {
    state: 'passed',
    grade
  };

  closeGradeModal();
  renderUniPensum();
  void saveState(false);
  showToast(`Materia aprobada con ${grade} puntos.`);
}

function openUniAgendaModal() {
  const modal = document.getElementById('uni-agenda-modal');
  const subjectSelect = document.getElementById('uni-agenda-subject');
  const titleInput = document.getElementById('uni-agenda-title');
  const dateInput = document.getElementById('uni-agenda-date');
  const typeInput = document.getElementById('uni-agenda-type');

  if (!modal || !(subjectSelect instanceof HTMLSelectElement)) {
    return;
  }

  subjectSelect.innerHTML = '';

  const careerState = getCurrentCareerState();
  const activeSubjects = [];

  currentCurriculum.forEach((semester) => {
    (semester.subjects || []).forEach((subject) => {
      const row = careerState.subjects[subject.id];
      if (row && row.state === 'current') {
        activeSubjects.push(subject);
      }
    });
  });

  if (activeSubjects.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'No hay materias cursando';
    subjectSelect.appendChild(option);
  } else {
    activeSubjects.forEach((subject) => {
      const option = document.createElement('option');
      option.value = subject.id;
      option.textContent = `${subject.id} - ${subject.name}`;
      subjectSelect.appendChild(option);
    });
  }

  if (titleInput instanceof HTMLInputElement) {
    titleInput.value = '';
  }

  if (dateInput instanceof HTMLInputElement) {
    dateInput.value = '';
  }

  if (typeInput instanceof HTMLSelectElement) {
    typeInput.value = 'examen';
  }

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeUniAgendaModal() {
  const modal = document.getElementById('uni-agenda-modal');
  if (!modal) {
    return;
  }

  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function saveUniAgendaEvent() {
  const titleInput = document.getElementById('uni-agenda-title');
  const dateInput = document.getElementById('uni-agenda-date');
  const typeInput = document.getElementById('uni-agenda-type');
  const subjectInput = document.getElementById('uni-agenda-subject');

  if (!(titleInput instanceof HTMLInputElement)
    || !(dateInput instanceof HTMLInputElement)
    || !(typeInput instanceof HTMLSelectElement)
    || !(subjectInput instanceof HTMLSelectElement)) {
    return;
  }

  const title = titleInput.value.trim().slice(0, 120);
  const date = dateInput.value;
  const type = typeInput.value;
  const subjectId = subjectInput.value;

  if (!title || !date || !subjectId) {
    showToast('Completa todos los campos obligatorios.');
    return;
  }

  if (!isIsoDate(date)) {
    showToast('Fecha invalida.');
    return;
  }

  if (!ALLOWED_EVENT_TYPES.has(type)) {
    showToast('Tipo de evento invalido.');
    return;
  }

  if (!currentSubjectIndex.has(subjectId)) {
    showToast('Materia invalida.');
    return;
  }

  const careerState = getCurrentCareerState();
  careerState.agenda.push({
    id: createId(),
    title,
    date,
    type,
    subjectId
  });

  careerState.agenda.sort((a, b) => toMiddayDate(a.date) - toMiddayDate(b.date));

  closeUniAgendaModal();
  renderUniAgenda();
  void saveState(false);
  showToast('Evento agregado.');
}

function deleteUniAgendaEvent(eventId) {
  const careerState = getCurrentCareerState();
  const beforeCount = careerState.agenda.length;
  careerState.agenda = careerState.agenda.filter((eventRow) => eventRow.id !== eventId);
  if (careerState.agenda.length === beforeCount) {
    return;
  }

  renderUniAgenda();
  void saveState(false);
  showToast('Evento eliminado.');
}

function renderUniAgenda() {
  const list = document.getElementById('uni-agenda-list');
  if (!list) {
    return;
  }

  const careerState = getCurrentCareerState();
  if (!Array.isArray(careerState.agenda) || careerState.agenda.length === 0) {
    list.innerHTML = '<div class="empty-state">No hay examenes ni entregas proximas.</div>';
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = [...careerState.agenda].sort((a, b) => toMiddayDate(a.date) - toMiddayDate(b.date));

  const html = events.map((eventRow) => {
    const evDate = toMiddayDate(eventRow.date);
    const diffDays = Math.ceil((evDate - today) / (1000 * 60 * 60 * 24));

    const badge = buildDaysBadge(diffDays);
    const subjectName = currentSubjectIndex.get(eventRow.subjectId)?.name || eventRow.subjectId;
    const emoji = eventRow.type === 'entrega' ? '📝' : eventRow.type === 'exposicion' ? '🗣️' : '✍️';

    return `
      <div class="activity-item">
        <div class="activity-meta">
          <div>${emoji}</div>
          <div>
            <div class="activity-title">${escapeHtml(eventRow.title)}</div>
            <div class="activity-subject">${escapeHtml(subjectName)} - ${escapeHtml(eventRow.date)}</div>
          </div>
        </div>
        <div class="row">
          <span class="activity-badge" style="color:${badge.color};">${escapeHtml(badge.text)}</span>
          <button class="icon-btn uni-delete-event" type="button" data-event-id="${encodeURIComponent(eventRow.id)}">✕</button>
        </div>
      </div>
    `;
  }).join('');

  list.innerHTML = html;
}

function buildDaysBadge(diffDays) {
  if (diffDays < 0) {
    return { text: 'Expirado', color: '#9ca3af' };
  }

  if (diffDays === 0) {
    return { text: 'Hoy', color: '#ef4444' };
  }

  if (diffDays <= 3) {
    return { text: `En ${diffDays} dias`, color: '#f59e0b' };
  }

  return { text: `En ${diffDays} dias`, color: '#10b981' };
}

async function loadStudentState() {
  const stateKey = String(currentStudentId || DEFAULT_STATE_KEY).trim();
  currentStudentId = stateKey;
  setSyncStatus('Cargando datos...', false);

  try {
    const remoteState = await fetchStateFromApi(stateKey);
    if (remoteState) {
      state.uni = ensureUniStateShape(remoteState);
      applyStateSelectionToUiAndContext();
      renderAll();
      setSyncStatus('Sincronizado', false);
      return;
    }

    const fallback = await fetchFallbackState();
    state.uni = ensureUniStateShape(fallback);
    applyStateSelectionToUiAndContext();
    renderAll();
    setSyncStatus('Modo demo (sin API)', false);
    showToast('API no configurada. Estas usando datos locales de muestra.');
  } catch (error) {
    console.error(error);

    const fallback = await fetchFallbackState();
    state.uni = ensureUniStateShape(fallback);
    applyStateSelectionToUiAndContext();
    renderAll();
    setSyncStatus('Error API. Modo demo activo.', true);
    showToast('No pude leer la API. Cargando modo demo.');
  }
}

async function fetchFallbackState() {
  try {
    const response = await fetch(APP_CONFIG.fallbackStatePath, { cache: 'no-store' });
    if (!response.ok) {
      return createDefaultUniState();
    }

    const payload = await response.json();
    return payload && typeof payload === 'object' ? payload : createDefaultUniState();
  } catch (_error) {
    return createDefaultUniState();
  }
}

async function fetchStateFromApi(studentId) {
  if (!APP_CONFIG.apiBaseUrl) {
    return null;
  }

  const url = withQuery(APP_CONFIG.apiBaseUrl, {
    action: 'get_state',
    studentId
  });

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`API get_state failed: ${response.status}`);
  }

  const payload = await parseJsonResponse(response);
  if (!payload || payload.ok !== true) {
    throw new Error('API get_state returned invalid payload');
  }

  return payload.data || createDefaultUniState();
}

async function saveState(showSuccessToast) {
  if (!currentStudentId) {
    currentStudentId = DEFAULT_STATE_KEY;
  }

  if (!APP_CONFIG.apiBaseUrl) {
    setSyncStatus('Modo demo (sin API)', false);
    if (showSuccessToast) {
      showToast('Guardado local de demo. Configura API para persistencia real.');
    }
    return false;
  }

  state.uni.selectedUniversityId = currentUniversityId;
  state.uni.selectedCareerId = currentCareerId;

  const sanitized = ensureUniStateShape(state.uni);
  state.uni = sanitized;

  setSyncStatus('Guardando...', false);

  const formData = new URLSearchParams({
    action: 'save_state',
    studentId: currentStudentId,
    payload: JSON.stringify(sanitized)
  });

  try {
    const response = await fetch(APP_CONFIG.apiBaseUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`API save_state failed: ${response.status}`);
    }

    const payload = await parseJsonResponse(response);
    if (!payload || payload.ok !== true) {
      throw new Error('API save_state returned invalid payload');
    }

    setSyncStatus('Cambios guardados', false);
    if (showSuccessToast) {
      showToast('Cambios guardados correctamente.');
    }

    return true;
  } catch (error) {
    console.error(error);
    setSyncStatus('Error al guardar. Revisa la API.', true);
    showToast('No pude guardar. Verifica la API.');
    return false;
  }
}

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (_error) {
    return null;
  }
}

function withQuery(baseUrl, params) {
  const url = new URL(baseUrl);
  Object.keys(params).forEach((key) => {
    url.searchParams.set(key, params[key]);
  });
  return url.toString();
}

function renderAll() {
  renderUniPensum();
  renderUniAgenda();
}

function clampInt(value, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return min;
  }

  return Math.min(max, Math.max(min, parsed));
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toMiddayDate(isoDate) {
  return new Date(`${isoDate}T12:00:00`);
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#96;');
}

function boot() {
  bindUIEvents();

  if (APP_UNIVERSITY_CATALOG.length === 0) {
    setSyncStatus('No hay catalogo de universidades cargado.', true);
    showToast('Falta UNIVERSITY_CATALOG en university_data.js');
    return;
  }

  const defaultUniversityId = populateUniversitySelect(getDefaultUniversityId());
  const defaultCareerId = populateCareerSelect(defaultUniversityId, '', getDefaultCareerId(defaultUniversityId));
  if (defaultCareerId) {
    setCurrentCareer(defaultCareerId, { updateSelectors: false, persistSelection: false });
  }

  currentStudentId = resolveStudentId();

  setSyncStatus(APP_CONFIG.apiBaseUrl ? 'API configurada. Listo para sincronizar.' : 'Modo demo (sin API)', false);
  void loadStudentState();
}

document.addEventListener('DOMContentLoaded', boot);
