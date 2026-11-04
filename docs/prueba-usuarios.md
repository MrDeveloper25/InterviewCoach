# Protocolo de la prueba con usuarios (#26, #27)

**Estado: pendiente. Los resultados deben venir de personas reales; este repositorio no contiene ninguno.**

## Participantes

De 8 a 10 personas con conocimientos básicos de JavaScript. A cada una se le asigna un ID (P01, P02...).

## Pasos por participante

1. Abrir InterviewCoach en un navegador sin historial previo, o usar **Borrar historial**.
2. Responder la parte inicial de la [encuesta](encuesta.md).
3. Hacer el primer simulacro. Usar la misma empresa en ambos simulacros.
4. Revisar los resultados y las soluciones.
5. Hacer el segundo simulacro. La plataforma presenta 2 problemas distintos de la misma empresa.
6. Responder la parte final de la encuesta.
7. En **Mi progreso**, escribir el ID y pulsar **Exportar resultados**. Guardar el JSON.

Avisa del tiempo necesario: cada simulacro de Google dura hasta 45 minutos, y cada uno de Amazon hasta 90.

## Análisis

Reunir los JSON y el `encuesta.csv` en una carpeta fuera del repositorio y ejecutar:

```
npm run analizar -- ruta/a/la/carpeta
```

El script calcula la mejora de puntaje entre simulacros, la confianza promedio antes y después, la utilidad promedio y la lista de mejoras sugeridas.

## Precauciones al interpretar

- Sin grupo de control, no se puede atribuir la mejora solo a la plataforma.
- Cada simulacro tiene un problema fácil y uno medio, pero el segundo usa problemas distintos a los del primero. Su dificultad es parecida, no idéntica. Conviene reportar esta limitación.
- Con 8 a 10 personas, los resultados son exploratorios y no generalizables.
