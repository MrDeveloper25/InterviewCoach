
# InterviewCoach - Plataforma de Entrenamiento para Entrevistas Técnicas

## Integrantes

* Arturo Said González Mercado
* José Eduardo González Hernández
* Leonardo Axel Luna Nochebuena

## Repositorio de GitHub y Tablero

* URL del Repositorio: https://github.com/MrDeveloper25/InterviewCoach
* URL del Tablero (GitHub Project): *(agregar el enlace del tablero del equipo)*

## Descripción

`InterviewCoach` es una plataforma web interactiva diseñada para practicar entrevistas técnicas de programación en condiciones similares a las reales. Combina simulacros con temporizador, un editor de código, pistas progresivas, retroalimentación inmediata y un panel de progreso con un plan de estudio, organizados por empresa y por rama de la programación.

## Objetivo

Diseñar y desarrollar una plataforma web interactiva de entrenamiento para entrevistas técnicas de programación, que ofrezca simulacros con temporizador, retroalimentación inmediata y rutas de estudio personalizadas por empresa y por rama de la programación, con el fin de que estudiantes y profesionales practiquen en condiciones realistas, midan su progreso y mejoren su desempeño en procesos de selección.

## Funcionalidades

La versión actual incluye la interfaz de usuario y una API de demostración:

1. **Inicio:** propuesta de valor, pregunta de muestra con su retroalimentación y empresas objetivo (Google, Amazon, Oracle, Microsoft y Meta).
2. **Simulacro:** configuración de empresa, rama (Backend, Datos y Frontend) y nivel; temporizador de 45 minutos, enunciado, pistas progresivas, editor de código y ejecución de pruebas de ejemplo.
3. **Reporte del simulacro:** puntaje, tiempo usado y recomendaciones.
4. **Mi progreso:** racha, nivel de preparación, dominio por tema y plan semanal.
5. **Tema claro y oscuro,** con diseño adaptable a celular.

### Próximas funcionalidades

* Ejecución real de código en un entorno aislado, con casos de prueba.
* Más ramas, problemas y simulacros por empresa.
* Entrevista con un entrevistador virtual y práctica de preguntas conductuales.
* Cuentas de usuario, historial de simulacros y plan de estudio personalizado.

## Tecnologías utilizadas

* **Backend:** Node.js (funciones serverless en la carpeta `api/`).
* **Interfaz:** HTML, Tailwind CSS y Alpine.js, con variables CSS para el tema claro y oscuro.
* **Tipografías:** Bricolage Grotesque y JetBrains Mono.
* **Control de versiones y despliegue:** Git, GitHub y Vercel (despliegue automático con cada cambio fusionado en `main`).

## Estructura del proyecto

```
InterviewCoach/
  public/index.html     Interfaz (inicio, simulacro y progreso)
  api/problems.js       Endpoint con el banco de problemas
  api/progress.js       Endpoint con datos de progreso de demostración
  data/problems.js      Banco de problemas de ejemplo
  package.json
```

## Cómo ejecutar el proyecto

Requisitos: [Node.js](https://nodejs.org) (versión 18 o superior) y Git.

Sigue estos pasos para levantar el entorno de desarrollo localmente:

1. Clona el repositorio:

```
git clone https://github.com/MrDeveloper25/InterviewCoach.git
cd InterviewCoach
```

2. Inicia el entorno de desarrollo:

```
npm run dev
```

La primera vez, Vercel CLI pide iniciar sesión y confirmar la configuración; acepta las opciones por defecto. Después abre la dirección que se muestra en la terminal (normalmente `http://localhost:3000`).

## Despliegue

El proyecto se publica en Vercel con el preset **Other**. Cada cambio fusionado en `main` genera un nuevo despliegue, y cada Pull Request genera una URL de vista previa.
=======
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

