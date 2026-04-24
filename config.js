// Pega aqui tu URL del Web App de Google Apps Script.
// Ejemplo: https://script.google.com/macros/s/AKfycb.../exec
window.PENSUM_RD_API_BASE_URL = 'https://script.google.com/macros/s/AKfycbzThZqVSD2Ur37IO8Sez2DYHpExwoStpJ1-QwsR_Pb5oJSZXjqBeM7rimtCypeepw3h/exec';
// Clave unica para guardar el estado global de la app (sin matricula por usuario).
window.PENSUM_RD_STATE_KEY = 'pensum-rd';
// Compatibilidad con nombre anterior.
window.PEMSUN_RD_API_BASE_URL = window.PEMSUN_RD_API_BASE_URL || window.PENSUM_RD_API_BASE_URL;
window.PEMSUN_RD_STATE_KEY = window.PEMSUN_RD_STATE_KEY || window.PENSUM_RD_STATE_KEY;
