// Estado e interacción de la interfaz (Alpine.js).
// Todo se guarda en localStorage de este navegador; el MVP no tiene cuentas de usuario.
const KEYS = { theme: 'ic-theme', session: 'ic-session', history: 'ic-history', participant: 'ic-participant' };

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) { /* Sin almacenamiento disponible: la sesión sigue funcionando en memoria. */ }
}

function app() {
  return {
    view: 'home',
    companies: [],
    bank: [],
    loadError: false,
    selectedCompany: 'google',
    session: null,
    history: [],
    attempt: null,
    openProblem: null,
    evaluating: false,
    running: false,
    runResult: null,
    now: Date.now(),
    ticker: null,
    lastTick: null,
    hoverIndex: null,
    participant: '',

    async init() {
      const theme = readJSON(KEYS.theme, null);
      if (theme) document.documentElement.setAttribute('data-theme', theme);
      this.history = readJSON(KEYS.history, []);
      this.participant = readJSON(KEYS.participant, '');
      try {
        const res = await fetch('/api/problems');
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        this.companies = data.companies;
        this.bank = data.problems;
      } catch (e) {
        this.loadError = true;
        return;
      }
      this.resumeSession();
    },

    toggleTheme() {
      const root = document.documentElement;
      const current = root.getAttribute('data-theme');
      const isDark = current === 'dark' || (!current && matchMedia('(prefers-color-scheme: dark)').matches);
      const next = isDark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      writeJSON(KEYS.theme, next);
    },

    // --- Datos derivados ---
    get company() { return this.companies.find((c) => c.id === this.selectedCompany) || null; },
    companyName(id) { const c = this.companies.find((x) => x.id === id); return c ? c.name : id; },
    problemById(id) { return this.bank.find((p) => p.id === id) || null; },
    get mockProblems() { return this.session ? this.session.problemIds.map((id) => this.problemById(id)) : []; },
    get current() { return this.session ? this.problemById(this.session.problemIds[this.session.activeIndex]) : null; },
    get remaining() { return this.session ? Math.max(0, Math.ceil((this.session.deadline - this.now) / 1000)) : 0; },
    get clock() { return ICCore.formatClock(this.remaining); },
    get ringOffset() { return this.session ? 226 * (1 - this.remaining / this.session.durationSec) : 0; },
    get lowTime() { return this.session && this.remaining <= 300; },
    get hintsUsed() { return this.current ? this.session.hints[this.current.id] : 0; },
    get visibleCases() { return this.runResult ? this.runResult.cases.filter((c) => !c.hidden) : []; },
    get hiddenCases() { return this.runResult ? this.runResult.cases.filter((c) => c.hidden) : []; },
    get runError() {
      if (!this.runResult) return '';
      const failed = this.runResult.cases.find((c) => c.error);
      return failed ? failed.error : '';
    },
    get runLogs() {
      if (!this.runResult) return [];
      const withLogs = this.runResult.cases.find((c) => c.logs.length);
      return withLogs ? withLogs.logs : [];
    },
    get mocks() { return this.history.filter((a) => a.mode === 'simulacro'); },
    get topics() { return ICCore.topicStats(this.history); },
    get avgTime() { return ICCore.formatClock(ICCore.avgTimePerProblem(this.history)); },
    get bestScore() { return this.mocks.length ? Math.max(...this.mocks.map((a) => a.score)) : 0; },
    get lastScore() { return this.mocks.length ? this.mocks[this.mocks.length - 1].score : 0; },
    get recommendation() { return ICCore.recommend(this.history, this.bank); },
    get historyDesc() { return [...this.history].reverse(); },
    formatDate(iso) { return new Date(iso).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }); },
    clockOf(seconds) { return ICCore.formatClock(seconds); },
    show(value) { return value === undefined ? 'undefined' : JSON.stringify(value); },
    showArgs(args) { return args.map((a) => JSON.stringify(a)).join(', '); },

    // --- Simulacro ---
    start(mode, companyId, problems, minutes) {
      const durationSec = minutes * 60;
      const codes = {};
      const hints = {};
      const timeSpent = {};
      problems.forEach((p) => { codes[p.id] = p.starterCode; hints[p.id] = 0; timeSpent[p.id] = 0; });
      this.session = {
        mode,
        companyId,
        problemIds: problems.map((p) => p.id),
        activeIndex: 0,
        durationSec,
        deadline: Date.now() + durationSec * 1000,
        codes,
        hints,
        timeSpent
      };
      this.now = Date.now();
      this.runResult = null;
      this.attempt = null;
      this.view = 'sim';
      this.persist();
      this.startTicker();
    },

    startMock() {
      const c = this.company;
      this.start('simulacro', c.id, ICCore.pickProblems(this.bank, c.id, c.problemsPerMock, this.history), c.minutes);
    },

    // Práctica dirigida de un problema: tiempo proporcional al del simulacro de su empresa.
    startPractice(problemId) {
      if (this.session) { this.view = 'sim'; return; }
      const p = this.problemById(problemId);
      const c = this.companies.find((x) => x.id === p.company);
      this.start('practica', c.id, [p], Math.round(c.minutes / c.problemsPerMock));
    },

    resumeSession() {
      const saved = readJSON(KEYS.session, null);
      if (!saved || !saved.problemIds.every((id) => this.problemById(id))) return;
      this.session = saved;
      this.selectedCompany = saved.companyId;
      this.view = 'sim';
      this.now = Date.now();
      if (this.remaining <= 0) this.submit();
      else this.startTicker();
    },

    startTicker() {
      clearInterval(this.ticker);
      this.lastTick = Date.now();
      this.ticker = setInterval(() => this.tick(), 1000);
    },

    tick() {
      if (!this.session || this.evaluating) return;
      const now = Date.now();
      this.now = now;
      if (this.current) this.session.timeSpent[this.current.id] += Math.round((now - this.lastTick) / 1000);
      this.lastTick = now;
      if (this.remaining <= 0) { this.submit(); return; }
      this.persist();
    },

    persist() { if (this.session) writeJSON(KEYS.session, this.session); },

    goToProblem(index) {
      this.session.activeIndex = index;
      this.runResult = null;
      this.persist();
    },

    revealHint() {
      const id = this.current.id;
      if (this.session.hints[id] < this.current.hints.length) {
        this.session.hints[id]++;
        this.persist();
      }
    },

    // La tecla Tab inserta sangría en lugar de salir del editor; Esc la libera para el teclado.
    onEditorTab(event) {
      const el = event.target;
      const { selectionStart: s, selectionEnd: e, value } = el;
      el.value = value.slice(0, s) + '  ' + value.slice(e);
      el.selectionStart = el.selectionEnd = s + 2;
      el.dispatchEvent(new Event('input'));
    },

    async runTests() {
      if (this.running || this.evaluating) return;
      this.running = true;
      const id = this.current.id;
      const result = await ICRunner.runProblem(this.current, this.session.codes[id]);
      this.running = false;
      if (this.current && this.current.id === id) this.runResult = result;
    },

    confirmSubmit() {
      if (confirm('¿Enviar el simulacro? Ya no podrás cambiar tu código.')) this.submit();
    },

    // Se usa al enviar y al llegar a cero: evalúa el último código guardado de cada problema.
    async submit() {
      if (this.evaluating || !this.session) return;
      this.evaluating = true;
      clearInterval(this.ticker);
      const s = this.session;
      const usedSec = Math.min(s.durationSec, s.durationSec - Math.max(0, Math.ceil((s.deadline - Date.now()) / 1000)));
      const timedOut = Date.now() >= s.deadline;
      const results = [];
      for (const id of s.problemIds) {
        const p = this.problemById(id);
        const run = await ICRunner.runProblem(p, s.codes[id]);
        results.push({
          id,
          title: p.title,
          topic: p.topic,
          passed: run.passed,
          total: run.total,
          hintsUsed: s.hints[id],
          score: ICCore.scoreProblem(run.passed, run.total, s.hints[id]),
          timeSec: s.timeSpent[id],
          code: s.codes[id]
        });
      }
      const attempt = {
        id: String(Date.now()),
        date: new Date().toISOString(),
        mode: s.mode,
        companyId: s.companyId,
        companyName: this.companyName(s.companyId),
        level: 'Junior',
        durationSec: s.durationSec,
        usedSec,
        timedOut,
        score: ICCore.scoreAttempt(results.map((r) => r.score)),
        problems: results
      };
      this.history.push(attempt);
      writeJSON(KEYS.history, this.history);
      this.session = null;
      try { localStorage.removeItem(KEYS.session); } catch (e) { /* Sin almacenamiento. */ }
      this.evaluating = false;
      this.runResult = null;
      this.attempt = attempt;
      this.openProblem = null;
      this.view = 'results';
    },

    abandon() {
      if (!confirm('¿Abandonar el simulacro? Se perderá tu código y no se guardará el intento.')) return;
      clearInterval(this.ticker);
      this.session = null;
      this.runResult = null;
      try { localStorage.removeItem(KEYS.session); } catch (e) { /* Sin almacenamiento. */ }
      this.view = 'setup';
    },

    viewAttempt(attempt) {
      this.attempt = attempt;
      this.openProblem = null;
      this.view = 'results';
    },

    // --- Gráfica de evolución. Se genera como texto porque Alpine no admite x-for dentro de <svg>. ---
    get chartPoints() {
      const W = 600, H = 200, L = 36, R = 16, T = 16, B = 28;
      const n = this.mocks.length;
      return this.mocks.map((a, i) => ({
        x: n === 1 ? (L + W - R) / 2 : L + (i * (W - L - R)) / (n - 1),
        y: T + ((100 - a.score) / 100) * (H - T - B),
        score: a.score,
        label: 'Simulacro ' + (i + 1) + ' · ' + a.companyName + ' · ' + this.formatDate(a.date)
      }));
    },

    get chartSvg() {
      const W = 600, H = 200, L = 36, R = 16, T = 16, B = 28;
      const pts = this.chartPoints;
      const grid = [0, 50, 100].map((v) => {
        const y = T + ((100 - v) / 100) * (H - T - B);
        return `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="1"/>` +
          `<text x="${L - 8}" y="${y + 4}" text-anchor="end" font-size="12" fill="var(--mute)">${v}</text>`;
      }).join('');
      const line = pts.length > 1
        ? `<polyline fill="none" stroke="var(--acc)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points="${pts.map((p) => p.x + ',' + p.y).join(' ')}"/>`
        : '';
      const marks = pts.map((p, i) =>
        `<circle cx="${p.x}" cy="${p.y}" r="5" fill="var(--acc)" stroke="var(--panel)" stroke-width="2"/>` +
        `<text x="${p.x}" y="${H - 8}" text-anchor="middle" font-size="12" fill="var(--mute)">${i + 1}</text>` +
        `<circle data-i="${i}" cx="${p.x}" cy="${p.y}" r="16" fill="transparent"/>`
      ).join('');
      return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Evolución del puntaje por simulacro; el detalle está en el historial">${grid}${line}${marks}</svg>`;
    },

    get hoverPoint() { return this.hoverIndex === null ? null : this.chartPoints[this.hoverIndex] || null; },
    onChartHover(event) {
      const i = event.target.getAttribute && event.target.getAttribute('data-i');
      this.hoverIndex = i === null || i === undefined ? null : Number(i);
    },

    // --- Exportación para la prueba con usuarios (#26) ---
    saveParticipant() { writeJSON(KEYS.participant, this.participant); },
    exportResults() {
      const payload = {
        participant: this.participant.trim() || 'sin-id',
        exportedAt: new Date().toISOString(),
        attempts: this.history.map(({ problems, ...rest }) => ({
          ...rest,
          problems: problems.map(({ code, ...p }) => p)
        }))
      };
      const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'interviewcoach-' + payload.participant + '.json';
      link.click();
      URL.revokeObjectURL(url);
    },

    clearHistory() {
      if (!confirm('¿Borrar todo el historial de este navegador? No se puede deshacer.')) return;
      this.history = [];
      writeJSON(KEYS.history, []);
    }
  };
}
