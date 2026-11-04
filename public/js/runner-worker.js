// Evalúa el código del usuario contra un caso. En el navegador corre dentro de un Web Worker,
// para que un bucle infinito no congele la página: runner.js lo termina al superar el tiempo límite.
const MAX_LOGS = 50;

function describeError(err) {
  if (err && err.name) return err.name + ': ' + err.message;
  return 'Error: ' + String(err);
}

function evaluate(code, fnName, args) {
  const logs = [];
  const log = (...values) => {
    if (logs.length >= MAX_LOGS) return;
    logs.push(values.map((v) => {
      if (typeof v === 'string') return v;
      try { return JSON.stringify(v); } catch (e) { return String(v); }
    }).join(' '));
  };
  const fakeConsole = { log, info: log, warn: log, error: log, debug: log };

  // Sin acceso a red ni al canal del worker desde el código del usuario.
  const blocked = ['fetch', 'XMLHttpRequest', 'WebSocket', 'importScripts', 'postMessage', 'self', 'globalThis'];
  let factory;
  try {
    factory = new Function(...blocked, 'console', '"use strict";\n' + code + '\n;return (typeof ' + fnName + ' === "function") ? ' + fnName + ' : undefined;');
  } catch (err) {
    return { status: 'syntax', error: describeError(err), logs };
  }

  try {
    const fn = factory(...blocked.map(() => undefined), fakeConsole);
    if (!fn) return { status: 'error', error: 'No se encontró la función ' + fnName + '. Conserva su nombre.', logs };
    const output = fn(...args);
    if (output && typeof output.then === 'function') {
      return { status: 'error', error: 'La función debe devolver un valor directamente, no una promesa.', logs };
    }
    return { status: 'ok', output: structuredClone(output), logs };
  } catch (err) {
    return { status: 'error', error: describeError(err), logs };
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = { evaluate };
} else {
  const send = self.postMessage.bind(self);
  self.onmessage = (event) => {
    const { code, fn, args } = event.data;
    send(evaluate(code, fn, args));
  };
}
