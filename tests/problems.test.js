const test = require('node:test');
const assert = require('node:assert');
const { companies, problems } = require('../data/problems');
const { deepEqual, pickProblems } = require('../public/js/core');
const { evaluate } = require('../public/js/runner-worker');

const allTests = (p) => p.visibleTests.concat(p.hiddenTests);

test('el alcance es Google y Amazon, con 4 problemas cada una (#2, #7)', () => {
  assert.deepStrictEqual(companies.map((c) => c.id), ['google', 'amazon']);
  companies.forEach((c) => assert.strictEqual(problems.filter((p) => p.company === c.id).length, 4));
});

test('cada simulacro tiene duración y problemas suficientes (#11)', () => {
  companies.forEach((c) => {
    assert.ok(c.minutes > 0);
    assert.ok(c.problemsPerMock >= 1 && c.problemsPerMock <= 4);
  });
});

for (const p of problems) {
  test(p.id + ': contenido completo (#7)', () => {
    ['id', 'title', 'topic', 'difficulty', 'fn', 'statement', 'starterCode', 'solution', 'explanation'].forEach((field) => {
      assert.ok(p[field], 'falta ' + field);
    });
    assert.ok(p.examples.length >= 1);
    assert.strictEqual(p.hints.length, 3);
    assert.ok(p.complexity.time && p.complexity.space);
  });

  test(p.id + ': al menos 3 casos visibles y 3 ocultos (#8)', () => {
    assert.ok(p.visibleTests.length >= 3);
    assert.ok(p.hiddenTests.length >= 3);
  });

  test(p.id + ': la solución aprueba todos los casos', () => {
    allTests(p).forEach((c) => {
      const run = evaluate(p.solution, p.fn, structuredClone(c.args));
      assert.strictEqual(run.status, 'ok', run.error);
      assert.ok(deepEqual(run.output, c.expected), JSON.stringify(c.args) + ' devolvió ' + JSON.stringify(run.output));
    });
  });

  test(p.id + ': el código inicial no aprueba ningún caso', () => {
    allTests(p).forEach((c) => {
      const run = evaluate(p.starterCode, p.fn, structuredClone(c.args));
      assert.strictEqual(run.status, 'ok');
      assert.strictEqual(deepEqual(run.output, c.expected), false);
    });
  });
}

test('el primer y el segundo simulacro tienen la misma dificultad (#26)', () => {
  companies.forEach((c) => {
    const first = pickProblems(problems, c.id, c.problemsPerMock, []);
    const second = pickProblems(problems, c.id, c.problemsPerMock, [{ problems: first }]);
    const mix = (list) => list.map((p) => p.difficulty).sort();
    assert.deepStrictEqual(mix(first), ['Fácil', 'Media']);
    assert.deepStrictEqual(mix(second), ['Fácil', 'Media']);
  });
});

test('los ids de problema no se repiten', () => {
  assert.strictEqual(new Set(problems.map((p) => p.id)).size, problems.length);
});
