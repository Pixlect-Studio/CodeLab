// CodeLab Python extension — uses Pyodide (CPython → Wasm)
window.CodeLabLanguages = window.CodeLabLanguages || {};

window.CodeLabLanguages.python = {
  id: 'python',
  name: 'Python',

  _loading: null,
  _ready: false,
  _pyodide: null,

  async init(consoleEl) {
    if (this._ready) return;
    if (this._loading) { await this._loading; return; }
    this._loading = (async () => {
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
          s.onload = resolve;
          s.onerror = () => reject(new Error('Pyodide CDN failed'));
          document.head.appendChild(s);
        });
      }
      try {
        // Quietly swallow stackframe errors — they don't affect execution
        this._pyodide = await window.loadPyodide({
          stdout: (msg) => consoleEl && appendLine(consoleEl, msg, 'log'),
          stderr: (msg) => consoleEl && appendLine(consoleEl, msg, 'error'),
          stdin: () => prompt('Python input:') || '',
        });
        this._ready = true;
      } catch (e) {
        // Try again without error decoration
        this._pyodide = await window.loadPyodide();
        this._ready = true;
      }
    })();
    await this._loading;
  },

  async run(code, consoleEl) {
    await this.init(consoleEl);
    appendLine(consoleEl, '▶ Running Python...', 'info');
    try {
      // Redirect stdout inside the interpreter so print() is captured
      await this._pyodide.runPythonAsync(`
import sys, io
_buf = io.StringIO()
_old = sys.stdout
sys.stdout = _buf
try:
${code.split('\n').map(l => '    ' + l).join('\n')}
finally:
    sys.stdout = _old
    _result = _buf.getvalue()
`);
      const out = this._pyodide.globals.get('_result');
      if (out) appendLine(consoleEl, out, 'log');
      appendLine(consoleEl, '\n✅ Done', 'info');
    } catch (e) {
      appendLine(consoleEl, '\n❌ ' + e.message, 'error');
    }
  }
};

function appendLine(el, text, level) {
  const d = document.createElement('div');
  d.className = 'console-line ' + (level || '');
  d.textContent = text;
  el.appendChild(d);
  el.scrollTop = el.scrollHeight;
}