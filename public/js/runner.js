// Ejecuta los casos de un problema: un Web Worker por caso, con tiempo límite.
window.ICRunner = (function () {
  const TIME_LIMIT_MS = 2000;

  function runOne(code, fn, args) {
    return new Promise((resolve) => {
      const worker = new Worker('js/runner-worker.js');
      const finish = (result) => {
        clearTimeout(timer);
        worker.terminate();
        resolve(result);
      };
      const timer = setTimeout(() => {
        finish({ status: 'timeout', error: 'Se detuvo la ejecución: superó el límite de ' + TIME_LIMIT_MS / 1000 + ' segundos. Revisa si hay un bucle infinito.', logs: [] });
      }, TIME_LIMIT_MS);
      worker.onmessage = (event) => finish(event.data);
      worker.onerror = (event) => {
        event.preventDefault();
        finish({ status: 'error', error: event.message || 'Error al ejecutar el código.', logs: [] });
      };
      // Los datos llegan como proxies reactivos de Alpine, que un worker no puede recibir.
      worker.postMessage({ code, fn, args: JSON.parse(JSON.stringify(args)) });
    });
  }

  function toCaseResult(test, hidden, index, run) {
    const passed = run.status === 'ok' && window.ICCore.deepEqual(run.output, test.expected);
    return { index, hidden, passed, status: run.status, error: run.error || '', logs: run.logs || [], args: test.args, expected: test.expected, output: run.output };
  }

  // Devuelve { cases, passed, total }.
  async function runProblem(problem, code) {
    const tests = problem.visibleTests.map((t) => ({ t, hidden: false }))
      .concat(problem.hiddenTests.map((t) => ({ t, hidden: true })));
    // En paralelo: un bucle infinito tarda el límite de un caso, no el de todos.
    const runs = await Promise.all(tests.map(({ t }) => runOne(code, problem.fn, t.args)));
    const cases = runs.map((run, i) => toCaseResult(tests[i].t, tests[i].hidden, i, run));
    return { cases, passed: cases.filter((c) => c.passed).length, total: cases.length };
  }

  return { TIME_LIMIT_MS, runProblem };
})();
