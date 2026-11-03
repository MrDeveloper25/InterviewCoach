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

## Alcance del MVP

Para poder terminar el proyecto en el tiempo disponible, la primera versión se limita a lo siguiente:

| Elemento | Alcance fijado |
| --- | --- |
| Empresas | Google y Amazon |
| Rama | Algoritmos y estructuras de datos |
| Nivel | Junior |
| Lenguaje | JavaScript (único lenguaje) |

### Fuera del alcance del MVP

* Otras empresas (Oracle, Microsoft, Meta, etc.).
* Otras ramas (backend, frontend, datos, DevOps, ciberseguridad, etc.).
* Niveles intermedio y senior.
* Otros lenguajes de programación.
* Diseño de sistemas y entrevistas conductuales.

Cualquier ampliación requiere la aprobación del equipo y debe registrarse en este README.

### Aprobación del alcance

Cada integrante aprueba el alcance escribiendo su nombre y la fecha en su fila (mediante un commit en el Pull Request de esta issue).

| Integrante | Estado | Fecha |
| --- | --- | --- |
| Arturo Said González Mercado | Pendiente | |
| José Eduardo González Hernández | Pendiente | |
| Leonardo Axel Luna Nochebuena | Pendiente | |

## Funcionalidades

La versión actual incluye la interfaz de usuario y una API de demostración:

1. **Inicio:** propuesta de valor, pregunta de muestra con su retroalimentación y empresas objetivo (Google y Amazon).
2. **Simulacro:** selección de empresa (Google o Amazon) con rama, nivel y lenguaje fijos según el alcance; temporizador de 45 minutos, enunciado, pistas progresivas, editor de código en JavaScript y ejecución de pruebas de ejemplo.
3. **Reporte del simulacro:** puntaje, tiempo usado y recomendaciones.
4. **Mi progreso:** racha, nivel de preparación, dominio por tema y plan semanal.
5. **Tema claro y oscuro,** con diseño adaptable a celular.

### Próximas funcionalidades

* Ejecución real de código en un entorno aislado, con casos de prueba.
* Más problemas de algoritmos y estructuras de datos por empresa.
* Ampliar el alcance (más empresas, ramas, niveles y lenguajes) después de terminar el MVP.
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
