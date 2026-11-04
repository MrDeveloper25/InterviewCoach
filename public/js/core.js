// Lógica pura de InterviewCoach: comparación, puntaje, selección y estadísticas.
// Funciona en el navegador (window.ICCore) y en Node (para las pruebas automáticas).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ICCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const HINT_PENALTY = 10;

  function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a === 'number' && typeof b === 'number') return Number.isNaN(a) && Number.isNaN(b);
    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]));
  }

  // Puntaje de un problema: porcentaje de casos aprobados menos 10 puntos por pista, mínimo 0.
  function scoreProblem(passed, total, hintsUsed) {
    if (!total) return 0;
    return Math.max(0, Math.round((100 * passed) / total) - HINT_PENALTY * hintsUsed);
  }

  // Puntaje del simulacro: promedio de los puntajes de sus problemas.
  function scoreAttempt(problemScores) {
    if (!problemScores.length) return 0;
    return Math.round(problemScores.reduce((sum, s) => sum + s, 0) / problemScores.length);
  }

  // Elige primero los problemas de la empresa que menos veces se han presentado,
  // para que el primer y el segundo simulacro no repitan problemas.
  function pickProblems(bank, companyId, count, history) {
    const seen = {};
    (history || []).forEach((attempt) => attempt.problems.forEach((p) => { seen[p.id] = (seen[p.id] || 0) + 1; }));
    return bank
      .filter((p) => p.company === companyId)
      .map((p, index) => ({ p, index }))
      .sort((x, y) => (seen[x.p.id] || 0) - (seen[y.p.id] || 0) || x.index - y.index)
      .slice(0, count)
      .map((x) => x.p);
  }

  function allAttemptProblems(history) {
    return history.reduce((list, attempt) => list.concat(attempt.problems), []);
  }

  // Puntaje promedio por tema, del más débil al más fuerte.
  function topicStats(history) {
    const byTopic = {};
    allAttemptProblems(history).forEach((p) => {
      (byTopic[p.topic] = byTopic[p.topic] || []).push(p.score);
    });
    return Object.keys(byTopic)
      .map((topic) => ({ topic, score: scoreAttempt(byTopic[topic]), count: byTopic[topic].length }))
      .sort((a, b) => a.score - b.score || a.topic.localeCompare(b.topic));
  }

  function avgTimePerProblem(history) {
    const list = allAttemptProblems(history);
    if (!list.length) return 0;
    return Math.round(list.reduce((sum, p) => sum + p.timeSec, 0) / list.length);
  }

  // Señala el tema con menor puntaje y los problemas a repetir, empezando por los de peor resultado.
  function recommend(history, bank) {
    const stats = topicStats(history);
    if (!stats.length) return null;
    const weakest = stats[0];
    const latest = {};
    allAttemptProblems(history).forEach((p) => { latest[p.id] = p.score; });
    const problems = bank
      .filter((p) => p.topic === weakest.topic)
      .map((p) => ({ id: p.id, title: p.title, company: p.company, lastScore: p.id in latest ? latest[p.id] : null }))
      .sort((a, b) => (a.lastScore === null ? 101 : a.lastScore) - (b.lastScore === null ? 101 : b.lastScore));
    return { topic: weakest.topic, score: weakest.score, problems };
  }

  function formatClock(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  return { HINT_PENALTY, deepEqual, scoreProblem, scoreAttempt, pickProblems, topicStats, avgTimePerProblem, recommend, formatClock };
});
