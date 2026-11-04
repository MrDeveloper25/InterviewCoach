const test = require('node:test');
const assert = require('node:assert');
const core = require('../public/js/core');
const { evaluate } = require('../public/js/runner-worker');
const { problems } = require('../data/problems');

test('deepEqual compara por valor', () => {
  assert.ok(core.deepEqual([1, [2, { a: 3 }]], [1, [2, { a: 3 }]]));
  assert.ok(core.deepEqual(NaN, NaN));
  assert.ok(!core.deepEqual([1, 2], [2, 1]));
  assert.ok(!core.deepEqual([], {}));
  assert.ok(!core.deepEqual(null, undefined));
  assert.ok(!core.deepEqual(0, false));
  assert.ok(!core.deepEqual({ a: undefined }, { b: undefined }));
});

test('el puntaje descuenta 10 puntos por pista y no baja de 0 (#17, #18)', () => {
  assert.strictEqual(core.scoreProblem(6, 6, 0), 100);
  assert.strictEqual(core.scoreProblem(6, 6, 3), 70);
  assert.strictEqual(core.scoreProblem(3, 6, 1), 40);
  assert.strictEqual(core.scoreProblem(1, 6, 3), 0);
  assert.strictEqual(core.scoreProblem(0, 0, 0), 0);
  assert.strictEqual(core.scoreAttempt([100, 50]), 75);
  assert.strictEqual(core.scoreAttempt([]), 0);
});

const attempt = (...items) => ({ problems: items.map(([id, topic, score, timeSec]) => ({ id, topic, score, timeSec })) });

test('el segundo simulacro no repite problemas del primero', () => {
  const first = core.pickProblems(problems, 'google', 2, []);
  const second = core.pickProblems(problems, 'google', 2, [{ problems: first }]);
  assert.strictEqual(first.length, 2);
  assert.strictEqual(new Set(first.concat(second).map((p) => p.id)).size, 4);
  assert.ok(second.every((p) => p.company === 'google'));
});

test('estadísticas por tema y tiempo promedio (#21)', () => {
  const history = [attempt(['a', 'Grafos', 40, 100], ['b', 'Árboles', 90, 300]), attempt(['c', 'Grafos', 60, 200])];
  assert.deepStrictEqual(core.topicStats(history), [
    { topic: 'Grafos', score: 50, count: 2 },
    { topic: 'Árboles', score: 90, count: 1 }
  ]);
  assert.strictEqual(core.avgTimePerProblem(history), 200);
  assert.strictEqual(core.avgTimePerProblem([]), 0);
});

test('recomienda el tema más débil y sus problemas (#22)', () => {
  assert.strictEqual(core.recommend([], problems), null);
  const rec = core.recommend([attempt(['contar-islas', 'Grafos', 20, 60], ['dos-suma', 'Tablas hash', 100, 60])], problems);
  assert.strictEqual(rec.topic, 'Grafos');
  assert.deepStrictEqual(rec.problems.map((p) => p.id), ['contar-islas']);
  assert.strictEqual(rec.problems[0].lastScore, 20);
});

test('formato del reloj', () => {
  assert.strictEqual(core.formatClock(2700), '45:00');
  assert.strictEqual(core.formatClock(61), '01:01');
  assert.strictEqual(core.formatClock(-5), '00:00');
});

test('el evaluador reporta errores con claridad (#15)', () => {
  assert.strictEqual(evaluate('function f( {', 'f', []).status, 'syntax');
  const thrown = evaluate('function f(){ throw new TypeError("mal"); }', 'f', []);
  assert.strictEqual(thrown.status, 'error');
  assert.match(thrown.error, /TypeError: mal/);
  assert.match(evaluate('function g(){}', 'f', []).error, /No se encontró la función f/);
  assert.strictEqual(evaluate('function f(){ return () => 1; }', 'f', []).status, 'error');
  assert.match(evaluate('async function f(){ return 1; }', 'f', []).error, /promesa/);
});

test('el evaluador captura console.log y bloquea la red', () => {
  const run = evaluate('function f(){ console.log("hola", [1]); return typeof fetch; }', 'f', []);
  assert.deepStrictEqual(run.logs, ['hola [1]']);
  assert.strictEqual(run.output, 'undefined');
});
