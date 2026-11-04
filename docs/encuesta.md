# Encuesta de evaluación (#25)

Escala para las preguntas numéricas: 1 = nada, 2 = poco, 3 = regular, 4 = bastante, 5 = totalmente.

## Antes del primer simulacro

- **P0.** ID de participante (lo asigna el equipo, por ejemplo P01).
- **P1.** ¿Cuánta confianza sientes para resolver una entrevista técnica de programación? (1 a 5)

## Después del segundo simulacro

- **P2.** ¿Cuánta confianza sientes ahora para resolver una entrevista técnica de programación? (1 a 5)
- **P3.** ¿Qué tan útil fue la retroalimentación (casos de prueba, pistas, soluciones)? (1 a 5)
- **P4.** ¿Qué mejorarías de InterviewCoach? (respuesta abierta)

## Registro de respuestas

Guardar las respuestas en `encuesta.csv`, con esta cabecera exacta, para usar `npm run analizar`:

```
participante,confianza_antes,confianza_despues,utilidad,mejoras
```

No se piden nombres ni correos: el ID de participante basta para relacionar la encuesta con los puntajes.
