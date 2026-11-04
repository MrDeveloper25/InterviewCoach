// Los datos de estas pruebas son inventados y solo verifican los cálculos del script.
const test = require('node:test');
const assert = require('node:assert');
const { parseCsv, analyzeScores, analyzeSurvey, renderReport } = require('../scripts/analizar-resultados');

const mock = (date, score, mode = 'simulacro') => ({ date, score, mode });

test('calcula la mejora entre el primer y el segundo simulacro, en orden de fecha', () => {
  const result = analyzeScores([
    { participant: 'A', attempts: [mock('2026-01-02', 80), mock('2026-01-01', 50), mock('2026-01-01T12', 100, 'practica')] },
    { participant: 'B', attempts: [mock('2026-01-01', 70), mock('2026-01-02', 60)] },
    { participant: 'C', attempts: [mock('2026-01-01', 90)] }
  ]);
  assert.strictEqual(result.participants[0].improvement, 30);
  assert.strictEqual(result.participants[2].improvement, null);
  assert.strictEqual(result.completeCount, 2);
  assert.strictEqual(result.meanImprovement, 10);
  assert.strictEqual(result.meanFirst, 60);
  assert.strictEqual(result.improvedCount, 1);
});

test('lee CSV con comillas y promedia la encuesta ignorando valores fuera de escala', () => {
  const rows = parseCsv('participante,confianza_antes,confianza_despues,utilidad,mejoras\r\nA,2,4,5,"Más temas, por favor"\nB,3,4,9,\n');
  assert.strictEqual(rows[0].mejoras, 'Más temas, por favor');
  const survey = analyzeSurvey(rows);
  assert.strictEqual(survey.confidenceBefore, 2.5);
  assert.strictEqual(survey.confidenceChange, 1.5);
  assert.strictEqual(survey.usefulness, 5);
  assert.deepStrictEqual(survey.suggestions, ['Más temas, por favor']);
});

test('el reporte no falla sin datos', () => {
  assert.match(renderReport(analyzeScores([]), null), /Mejora promedio: sin datos/);
});
