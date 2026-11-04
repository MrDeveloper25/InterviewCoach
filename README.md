# InterviewCoach - Plataforma de Entrenamiento para Entrevistas Técnicas

## Integrantes

* Arturo Said González Mercado
* José Eduardo González Hernández
* Leonardo Axel Luna Nochebuena

## Repositorio de GitHub y Tablero

* URL del Repositorio: https://github.com/MrDeveloper25/InterviewCoach
* URL del Tablero (GitHub Project): https://github.com/users/MrDeveloper25/projects/12

## Descripción

`InterviewCoach` es una plataforma web interactiva para practicar entrevistas técnicas de algoritmos y estructuras de datos en condiciones similares a las reales. Combina simulacros con temporizador, un editor de código, ejecución real contra casos de prueba, pistas progresivas, retroalimentación inmediata y un panel de progreso.

## Objetivo general

Diseñar y desarrollar una plataforma web de entrenamiento para entrevistas técnicas de programación de nivel junior, que ofrezca simulacros cronometrados con el formato aproximado de Google y Amazon, retroalimentación inmediata y una recomendación de qué practicar, con el fin de que los estudiantes practiquen en condiciones realistas y midan su progreso.

## Objetivos particulares

1. Analizar y documentar el formato de entrevista de Google y Amazon a partir de fuentes citadas.
2. Construir un banco de 8 problemas con enunciado, pistas, solución explicada, complejidad y casos de prueba.
3. Implementar un simulacro con temporizador, editor con guardado automático y ejecución segura frente a errores y bucles infinitos.
4. Calcular un puntaje con base en los casos aprobados y las pistas usadas, y mostrar resultados por problema.
5. Registrar el historial y mostrar el puntaje por tema, el tiempo promedio, la evolución y una recomendación.
6. Evaluar con 8 a 10 usuarios la mejora de puntaje y de confianza entre el primer y el segundo simulacro. *(Pendiente de realizarse; ver [el protocolo](docs/prueba-usuarios.md).)*

El objetivo original incluía rutas de estudio personalizadas por empresa y por rama. Se ajustó al alcance del MVP: una sola rama y una recomendación sencilla en lugar de un plan de estudio.

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

1. **Selección de simulacro:** Google (45 minutos) o Amazon (90 minutos), con 2 problemas cada uno.
2. **Simulacro:** temporizador con envío automático, editor con guardado automático y navegación entre problemas.
3. **Ejecutor de pruebas:** ejecuta el código contra casos visibles y ocultos, reporta errores y detiene los bucles infinitos.
4. **Pistas progresivas:** cada pista descuenta 10 puntos y queda registrada.
5. **Resultados:** puntaje, casos aprobados, tiempo, solución explicada y complejidad.
6. **Mi progreso:** historial, puntaje por tema, tiempo promedio, evolución y recomendación de qué practicar.
7. **Exportación de resultados** para la prueba con usuarios.
8. **Tema claro y oscuro,** con diseño adaptable a celular.

Consulta el [manual de uso](docs/manual-usuario.md).

## Limitaciones conocidas

* Los datos se guardan solo en el navegador: no hay cuentas ni sincronización entre dispositivos.
* El código, los casos ocultos y las soluciones llegan al navegador. Quien inspeccione la página puede verlos, por lo que el puntaje no sirve como certificación.
* El ejecutor corre el código de cada usuario en un Web Worker de su propio navegador. Evita que un bucle congele la página y bloquea la red, pero no es un entorno aislado para código de terceros.
* El editor es un área de texto, sin resaltado de sintaxis ni autocompletado.
* La duración y el número de problemas son una aproximación basada en reportes de candidatos; consulta [el análisis](docs/analisis-formato-entrevistas.md).
* El banco tiene 8 problemas, así que se repiten a partir del tercer simulacro por empresa.

## Trabajo futuro

* Cuentas de usuario y plan de estudio personalizado.
* Calificación en el servidor, para proteger los casos ocultos.
* Editor con resaltado de sintaxis y un banco más amplio.
* Ampliar el alcance (más empresas, ramas, niveles y lenguajes).
* Entrevistador virtual y práctica de preguntas conductuales.

## Tecnologías utilizadas

* **Backend:** Node.js (funciones serverless en la carpeta `api/`).
* **Interfaz:** HTML, Tailwind CSS y Alpine.js, con variables CSS para el tema claro y oscuro.
* **Ejecución de código:** Web Workers.
* **Pruebas:** ejecutor de pruebas integrado de Node.js.
* **Tipografías:** Bricolage Grotesque y JetBrains Mono.
* **Control de versiones y despliegue:** Git, GitHub y Vercel (despliegue automático con cada cambio fusionado en `main`).

## Estructura del proyecto

```
InterviewCoach/
  public/index.html              Interfaz
  public/js/app.js               Estado e interacción de la interfaz
  public/js/core.js              Puntaje, selección de problemas y estadísticas
  public/js/runner.js            Ejecución de casos y tiempo límite
  public/js/runner-worker.js     Evaluación del código del usuario
  api/problems.js                Endpoint con el banco de problemas
  data/problems.js               Banco de problemas y formato por empresa
  scripts/dev-server.js          Servidor local
  scripts/analizar-resultados.js Análisis de la prueba con usuarios
  tests/                         Pruebas automáticas
  docs/                          Análisis, esquema, bocetos, encuesta, manual, pruebas y demo
```

## Flujo de trabajo

Una rama por tarea y un pull request con revisión de un compañero. Consulta [CONTRIBUTING.md](CONTRIBUTING.md).

## Cómo ejecutar el proyecto

Requisitos: [Node.js](https://nodejs.org) (versión 18 o superior) y Git.

Sigue estos pasos para levantar el entorno de desarrollo localmente:

1. Clona el repositorio:

```
git clone https://github.com/MrDeveloper25/InterviewCoach.git
cd InterviewCoach
```

2. Inicia el servidor local (no requiere instalar dependencias ni una cuenta):

```
npm run dev
```

3. Abre `http://localhost:3000`.

La interfaz carga Tailwind, Alpine.js y las tipografías desde internet, así que necesitas conexión.

Otros comandos:

```
npm test                  # Ejecuta las pruebas automáticas
npm run dev:vercel        # Usa Vercel CLI, que pide iniciar sesión
npm run analizar -- ruta  # Analiza los resultados de la prueba con usuarios
```

## Despliegue

El proyecto se publica en Vercel con el preset **Other**. Cada cambio fusionado en `main` genera un nuevo despliegue, y cada Pull Request genera una URL de vista previa.
