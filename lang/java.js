// CodeLab Java extension — CheerpJ (requires compiled .jar)
window.CodeLabLanguages = window.CodeLabLanguages || {};

window.CodeLabLanguages.java = {
  id: 'java',
  name: 'Java',

  _ready: false,
  _loading: null,

  async init() {
    if (this._ready) return;
    if (this._loading) return this._loading;
    this._loading = (async () => {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cjrtnc.leaningtech.com/4.3/loader.js';
        s.onload = resolve;
        s.onerror = () => reject(new Error('CheerpJ CDN failed'));
        document.head.appendChild(s);
      });
      await window.cheerpjInit({ version: 17 });
      this._ready = true;
    })();
    return this._loading;
  },

  async run(code, consoleEl, project) {
    appendLine(consoleEl, 'ℹ️ Java requires a compiled .jar file.', 'info');
    appendLine(consoleEl, 'Browser cannot compile .java source at runtime.', 'warn');
    appendLine(consoleEl, '', 'info');
    appendLine(consoleEl, 'How to use Java in CodeLab:', 'info');
    appendLine(consoleEl, '  1. Compile locally:  javac Main.java && jar cfe app.jar Main Main.class', 'log');
    appendLine(consoleEl, '  2. Upload app.jar via 📤 Upload', 'log');
    appendLine(consoleEl, '  3. Or host it on a server with Range support', 'log');
    appendLine(consoleEl, '', 'info');

    // If a .jar was uploaded in the project, try to run it
    const jar = project?.files?.find(f => f.name.endsWith('.jar'));
    if (!jar) {
      appendLine(consoleEl, '⚠️ No .jar found in project.', 'error');
      return;
    }
    try {
      await this.init();
      appendLine(consoleEl, '▶ Loading CheerpJ...', 'info');
      // CheerpJ needs a real URL — for demo we just report
      appendLine(consoleEl, '⚠️ Runtime .jar must be served over HTTP (Range support required).', 'warn');
      appendLine(consoleEl, 'Example: await cheerpjRunJar("/yourpath/app.jar")', 'log');
    } catch (e) {
      appendLine(consoleEl, '❌ ' + e.message, 'error');
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