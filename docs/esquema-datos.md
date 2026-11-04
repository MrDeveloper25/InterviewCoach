# Esquema de datos (#5)

El MVP no tiene base de datos ni cuentas de usuario. El contenido vive en `data/problems.js` y se entrega por `GET /api/problems`. Los datos del usuario se guardan en `localStorage` de su navegador.

```
Empresa 1 ── N Problema 1 ── N Caso de prueba
   │                │
   │ 1              │ 1
   │ N              │ N
Simulacro (intento) 1 ── N Resultado por problema
```

## Contenido (`data/problems.js`)

### Empresa

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | texto | `google` o `amazon` |
| `name` | texto | Nombre visible |
| `minutes` | número | Duración del simulacro |
| `problemsPerMock` | número | Problemas por simulacro |
| `format` | texto | Descripción mostrada antes de comenzar |

### Problema

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | texto | Identificador único |
| `company` | texto | `id` de la empresa |
| `title`, `statement` | texto | Título y enunciado |
| `topic` | texto | Tema, usado en el progreso y la recomendación |
| `difficulty` | texto | `Fácil` o `Media` |
| `fn` | texto | Nombre de la función que escribe el usuario |
| `examples` | lista | `{ input, output, explanation }` |
| `hints` | lista | 3 pistas de la más general a la más específica |
| `starterCode` | texto | Código inicial del editor |
| `solution`, `explanation` | texto | Solución y su explicación |
| `complexity` | objeto | `{ time, space }` |
| `visibleTests`, `hiddenTests` | lista | Casos de prueba; al menos 3 de cada tipo |

### Caso de prueba

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `args` | lista | Argumentos de la función |
| `expected` | JSON | Resultado esperado; se compara por valor |

## Datos del usuario (`localStorage`)

### Simulacro en curso (`ic-session`)

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `mode` | texto | `simulacro` o `practica` |
| `companyId` | texto | Empresa |
| `problemIds`, `activeIndex` | lista, número | Problemas y problema abierto |
| `durationSec`, `deadline` | número | Duración y hora de término; permiten retomar tras recargar |
| `codes`, `hints`, `timeSpent` | objetos por problema | Código, pistas usadas y segundos de trabajo |

### Intento (`ic-history`, lista)

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id`, `date` | texto | Identificador y fecha ISO |
| `mode`, `companyId`, `companyName`, `level` | texto | Tipo, empresa y nivel |
| `durationSec`, `usedSec` | número | Tiempo disponible y tiempo usado |
| `timedOut` | booleano | Si se envió automáticamente |
| `score` | número | Puntaje total, de 0 a 100 |
| `problems` | lista | Resultado por problema |

### Resultado por problema

`{ id, title, topic, passed, total, hintsUsed, score, timeSec, code }`

## Fórmula de puntaje (#17, #18)

```
puntaje del problema = máximo(0, redondear(100 × aprobados / total) − 10 × pistas usadas)
puntaje del simulacro = redondear(promedio de los puntajes de sus problemas)
```

Los casos visibles y ocultos valen lo mismo.
