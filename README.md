# Pemsun RD

Proyecto web estático (HTML/CSS/JS) listo para publicar en GitHub Pages.

## Archivos clave
- `index.html` (entrada principal para GitHub Pages)
- `uni.css`
- `uni.js`
- `university_data.js`
- `config.js` (URL de Apps Script + clave global)
- `.nojekyll` (evita procesamiento de Jekyll)
- `.gitignore`

## Subir a GitHub (paso a paso)

1. Abre terminal en esta carpeta.
2. Ejecuta:

```bash
git init
git add .
git commit -m "Beta inicial Pemsun RD"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

## Activar GitHub Pages

1. Ve al repositorio en GitHub.
2. Entra a `Settings > Pages`.
3. En `Source`, elige `Deploy from a branch`.
4. Selecciona:
- Branch: `main`
- Folder: `/ (root)`
5. Guarda y espera 1-2 minutos.
6. Tu web quedará publicada en la URL que muestre GitHub Pages.

## Notas
- No usa `localStorage` para datos de progreso.
- La persistencia se hace con tu Apps Script configurado en `config.js`.
