# Pruebas internas (#24)

## Pruebas automáticas

`npm test` verifica:

- El banco: 2 empresas, 4 problemas por empresa, contenido completo, 3 pistas y al menos 3 casos visibles y 3 ocultos.
- Que cada solución apruebe todos sus casos, y que el código inicial no apruebe ninguno.
- La comparación de resultados, el puntaje, la selección de problemas, las estadísticas y la recomendación.
- El reporte de errores del evaluador y el análisis de la prueba con usuarios.

## Pruebas manuales realizadas

Ejecutadas el 4 de noviembre de 2026 en el navegador integrado basado en Chromium, con el servidor local.

| Área | Prueba | Resultado |
| --- | --- | --- |
| Temporizador | Comienza con la duración de la empresa | Correcto, tras corregir un inicio en 45:01 |
| Temporizador | Al llegar a cero, envía solo y conserva el código | Correcto |
| Guardado | Al recargar, retoma problema, código, pistas y reloj | Correcto |
| Casos de prueba | Código inicial: 0 de 6; solución: 6 de 6 | Correcto |
| Casos de prueba | Los ocultos no muestran entrada ni salida | Correcto |
| Errores | Sintaxis y excepción con mensaje claro | Correcto |
| Errores | Un bucle infinito se detiene en unos 2 segundos | Correcto, tras ejecutar en paralelo (antes 12 segundos) |
| Puntaje | 6 de 6 con 2 pistas = 80; 3 de 6 = 50; total = 65 | Correcto |
| Selección | El segundo simulacro no repite problemas y mantiene la dificultad | Correcto, tras equilibrar el banco |
| Progreso | Temas, evolución, historial y recomendación | Correcto |
| Práctica | **Practicar** abre un problema con 45 minutos en Amazon | Correcto |
| Exportación | El JSON incluye ID e intentos, sin código | Correcto |
| Pantallas | Celular de 375 px sin desbordes y tema claro y oscuro | Correcto, tras corregir un desborde en Inicio |

## Errores encontrados y corregidos

1. **Ejecutar pruebas fallaba siempre:** los proxies de Alpine no se pueden enviar a un worker.
2. **Reloj inicial en 45:01:** la hora de referencia estaba desactualizada al comenzar.
3. **Un bucle infinito tardaba 12 segundos:** los casos corrían uno por uno.
4. **Errores en consola al terminar un simulacro:** una plantilla leía la sesión ya cerrada.
5. **Desborde horizontal en Inicio en celular:** el bloque de código ensanchaba la cuadrícula.
6. **Simulacros de dificultad desigual:** el segundo salía más difícil que el primero, lo que habría distorsionado la medición de mejora.

## Pendiente

- **Probar en Firefox y Safari.** Solo se ha probado en Chromium, y el issue pide distintos navegadores.
- **Probar el despliegue en Vercel.** Solo se ha probado con el servidor local.
