# Pensum RD - Beta Setup Rapido

## 1) Frontend
- Archivos principales:
  - `uni.html`
  - `uni.css`
  - `uni.js`
  - `config.js`
  - `university_data.js`

## 1.1) Selector de catalogo
- Ahora puedes seleccionar:
  - Universidad
  - Buscar carrera
- Catalogo cargado:
  - UASD - Licenciatura en Informatica
  - UASD - Licenciatura en Economia (extraido del PDF del proyecto)

## 2) Backend Google Apps Script
1. Crea un nuevo proyecto de Apps Script.
2. Copia el contenido de `apps_script_backend.gs`.
3. Crea una Google Sheet y pega su ID en `SPREADSHEET_ID`.
4. Deploy > New deployment > Web app:
   - Execute as: Me
   - Who has access: Anyone with link
5. Copia la URL `/exec` del Web App.

## 3) Conectar frontend con backend
- Abre `config.js` y coloca:
  - `window.PENSUM_RD_API_BASE_URL = 'TU_URL_EXEC';`

## 4) Uso
- Abre `index.html`.
- Escribe la matricula (ID) de estudiante.
- Selecciona universidad y carrera.
- Carga, edita progreso, y guarda.

## 5) Regla de datos
- Esta beta no usa localStorage.
- La persistencia real se hace via API (Apps Script + Sheets).
