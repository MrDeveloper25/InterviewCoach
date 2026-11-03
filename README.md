# InterviewCoach

Plataforma web para practicar entrevistas técnicas. Node.js (funciones serverless) + HTML con Tailwind y Alpine.js, desplegada en Vercel.

## Estructura
- `public/index.html`: interfaz (inicio, simulacro, progreso).
- `api/problems.js` y `api/progress.js`: endpoints Node.js.
- `data/problems.js`: banco de problemas de ejemplo.

## Ejecutar en local
```
npm run dev
```
Abre la URL que muestra Vercel CLI (normalmente http://localhost:3000).

## Desplegar en Vercel
1. Sube el repo a GitHub.
2. En vercel.com: Add New > Project > importa el repo.
3. Framework Preset: **Other**. Deploy.
Cada push a `main` se despliega solo; cada Pull Request genera una URL de vista previa.
