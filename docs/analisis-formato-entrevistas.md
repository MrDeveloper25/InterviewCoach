# Análisis del formato de entrevista por empresa (#4)

Consulta realizada el 4 de noviembre de 2026. Ninguna de las dos empresas publica un número fijo de problemas ni una duración para su entrevista de código. Por eso se distingue entre lo que viene de fuentes **oficiales** y lo que viene de **reportes de candidatos**, que varían según el puesto, el equipo y el país.

## Resumen

| | Google | Amazon |
| --- | --- | --- |
| Primera etapa técnica | Entrevista técnica por teléfono o Meet (oficial, guía de 2018) | Evaluación en línea con prueba de código (oficial) |
| Tiempo | 45 a 60 minutos (reportes) | Alrededor de 90 minutos (reportes; hay variación) |
| Número de problemas | 1 a 2 (reportes) | 2 a 3 (reportes) |
| Tipo de preguntas | Algoritmos y estructuras de datos; también rondas conductuales | Algoritmos y estructuras de datos; también preguntas conductuales sobre los Leadership Principles |
| Entorno | Documento compartido, sin IDE (oficial, guía de 2018) | Plataforma de evaluación en línea (oficial); recomiendan practicar fuera de un IDE |

## Decisión para el MVP

| Simulacro | Duración | Problemas | Justificación |
| --- | --- | --- | --- |
| Google | 45 min | 2 | Una candidata o candidato reportó 2 preguntas en 45 minutos, sin IDE. Es la versión exigente del rango reportado. |
| Amazon | 90 min | 2 | Reportes de una sección de 90 minutos y de 2 a 3 problemas. Se usa el mínimo por ser nivel junior. |

Cada empresa tiene 4 problemas en el banco. Cada simulacro presenta 2 (uno fácil y uno medio), comenzando por los que menos veces se han presentado, de modo que el primer y el segundo simulacro no repiten problemas. Los valores se configuran en `data/problems.js`.

Quedan fuera del simulacro, por el alcance del MVP, las rondas conductuales y de diseño de sistemas.

## Google

**Fuentes oficiales**

- La guía de Google para entrevistas de prácticas indica que, por teléfono o Meet, se escribe código en tiempo real en un documento compartido. Lista JavaScript entre los lenguajes aceptados y pide conocer tablas hash, árboles, grafos, ordenamiento y complejidad. Es de 2018 y dirigida a prácticas profesionales, por lo que puede estar desactualizada.
- Las vacantes de nivel inicial piden experiencia con estructuras de datos o algoritmos, adquirida en cursos, proyectos, investigación o trabajo.

**Reportes de candidatos**

- Etapas: filtro con reclutamiento, entrevista técnica de 45 a 60 minutos y luego 4 a 5 rondas.
- Un caso de 2 preguntas en 45 minutos, escribiendo en un documento simple.
- Temas frecuentes: árboles, grafos, arreglos, BFS y DFS.

## Amazon

**Fuentes oficiales**

- Amazon indica que la evaluación en línea, con prueba de código, es parte importante de su proceso para SDE, y ofrece un ejemplo de práctica.
- Recomienda repasar fundamentos de ciencias de la computación y practicar fuera de un IDE. Lista como temas lenguaje de programación, estructuras de datos, algoritmos y programación, entre otros.
- El *interview loop* consiste en reuniones individuales con personal de la empresa. Incluye preguntas conductuales basadas en los Leadership Principles.

**Reportes de candidatos y guías de terceros**

- Evaluación en línea en plataforma tipo HackerRank, con 2 a 3 problemas de dificultad fácil a media. Un candidato reportó una sección de 90 minutos con 2 problemas; otro, una evaluación de 3 a 4 horas en total.
- El *loop* tiene de 3 a 5 rondas que combinan código, preguntas conductuales y, a veces, diseño.

## Limitaciones de este análisis

- Las páginas oficiales de proceso de contratación de Google no mostraron su contenido durante la consulta, y su guía oficial se tomó de un resultado de búsqueda sin abrir el PDF completo.
- Los reportes de candidatos son anecdóticos y no forman una muestra representativa. Los números de problemas y de minutos del MVP son una aproximación, no el formato oficial.
- Conviene que el equipo revise estas fuentes antes de cerrar el issue.

## Fuentes

Oficiales:

- Amazon, [Software development interview topics](https://www.amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics)
- Amazon, [Interview loop](https://www.amazon.jobs/content/en/how-we-hire/interview-loop)
- Google, [Preparing for Google technical internship interviews (2018)](https://services.google.com/fh/files/misc/preparing_for_google_technical_internship_interviews.pdf)
- Google, [Software Engineer, Early Career, Campus](https://www.google.com/about/careers/applications/jobs/results/78703249065943750)

Reportes de candidatos y guías de terceros:

- Glassdoor, [Google Software Engineer Early Career](https://static.glassdoor.com.ar/Interview/Google-Software-Engineer-Early-Career-Interview-Questions-EI_IE9079.0,6_KO7,37_IP3.htm)
- Taro, [experiencia de entrevista en Google, junio de 2025](https://www.jointaro.com/interviews/companies/google/experiences/software-engineer-early-career-united-states-june-17-2025-no-offer-positive-3a81a922)
- Exponent, [Amazon software development engineer interview](https://www.tryexponent.com/guides/amazon-software-development-engineer-interview)
- Simplify, [Amazon Software Engineer Interview Guide for New Grads](https://simplify.jobs/blog/amazon-swe-interview-new-grads)
- Taro, [experiencia de entrevista SDE I en Amazon, agosto de 2023](https://www.jointaro.com/interviews/companies/amazon/work-experiences/sde-i-seattle-wa-august-4-2023-3-a30f51c8)
