// Análisis de la prueba con usuarios (#27).
// Uso: npm run analizar -- <carpeta>
// La carpeta contiene los JSON exportados desde "Mi progreso" y, opcionalmente, encuesta.csv
// con las columnas: participante,confianza_antes,confianza_despues,utilidad,mejoras
const fs = require('fs');
const path = require('path');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [header, ...data] = rows.filter((r) => r.some((v) => v.trim()));
  return header ? data.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] || '').trim()]))) : [];
}

const mean = (values) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : null);
const fixed = (value) => (value === null ? 'sin datos' : value.toFixed(2));

// Compara el primer y el segundo simulacro de cada participante; las prácticas no cuentan.
function analyzeScores(exports) {
  const participants = exports.map((e) => {
    const mocks = e.attempts.filter((a) => a.mode === 'simulacro').sort((a, b) => a.date.localeCompare(b.date));
    const complete = mocks.length >= 2;
    return {
      participant: e.participant,
      first: mocks[0] ? mocks[0].score : null,
      second: complete ? mocks[1].score : null,
      improvement: complete ? mocks[1].score - mocks[0].score : null
    };
  });
  const complete = participants.filter((p) => p.improvement !== null);
  return {
    participants,
    completeCount: complete.length,
    meanFirst: mean(complete.map((p) => p.first)),
    meanSecond: mean(complete.map((p) => p.second)),
    meanImprovement: mean(complete.map((p) => p.improvement)),
    improvedCount: complete.filter((p) => p.improvement > 0).length
  };
}

function analyzeSurvey(rows) {
  const column = (name) => rows.map((r) => Number(r[name])).filter((n) => n >= 1 && n <= 5);
  const before = mean(column('confianza_antes'));
  const after = mean(column('confianza_despues'));
  return {
    responses: rows.length,
    confidenceBefore: before,
    confidenceAfter: after,
    confidenceChange: before !== null && after !== null ? after - before : null,
    usefulness: mean(column('utilidad')),
    suggestions: rows.map((r) => r.mejoras).filter(Boolean)
  };
}

function renderReport(scores, survey) {
  const lines = ['# Resultados de la prueba con usuarios', '', '## Puntajes', '',
    '| Participante | Simulacro 1 | Simulacro 2 | Mejora |', '| --- | --- | --- | --- |'];
  scores.participants.forEach((p) => {
    lines.push(`| ${p.participant} | ${p.first ?? '-'} | ${p.second ?? '-'} | ${p.improvement ?? '-'} |`);
  });
  lines.push('', `Participantes con dos simulacros: ${scores.completeCount}.`,
    `Promedio del simulacro 1: ${fixed(scores.meanFirst)}. Promedio del simulacro 2: ${fixed(scores.meanSecond)}.`,
    `Mejora promedio: ${fixed(scores.meanImprovement)} puntos. Mejoraron ${scores.improvedCount} de ${scores.completeCount}.`);
  if (survey) {
    lines.push('', '## Encuesta (escala de 1 a 5)', '', `Respuestas: ${survey.responses}.`,
      `Confianza antes: ${fixed(survey.confidenceBefore)}. Confianza después: ${fixed(survey.confidenceAfter)}. Cambio: ${fixed(survey.confidenceChange)}.`,
      `Utilidad de la retroalimentación: ${fixed(survey.usefulness)}.`, '', '## Mejoras sugeridas', '');
    survey.suggestions.forEach((s) => lines.push('- ' + s));
    if (!survey.suggestions.length) lines.push('Sin sugerencias registradas.');
  }
  return lines.join('\n') + '\n';
}

if (require.main === module) {
  const dir = process.argv[2];
  if (!dir || !fs.existsSync(dir)) {
    console.error('Uso: npm run analizar -- <carpeta con los JSON exportados y encuesta.csv>');
    process.exit(1);
  }
  const exports_ = fs.readdirSync(dir).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  const csvPath = path.join(dir, 'encuesta.csv');
  const survey = fs.existsSync(csvPath) ? analyzeSurvey(parseCsv(fs.readFileSync(csvPath, 'utf8'))) : null;
  process.stdout.write(renderReport(analyzeScores(exports_), survey));
}

module.exports = { parseCsv, analyzeScores, analyzeSurvey, renderReport };
