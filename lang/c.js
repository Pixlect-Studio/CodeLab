// CodeLab C extension — runs pre-compiled .wasm
window.CodeLabLanguages = window.CodeLabLanguages || {};

window.CodeLabLanguages.c = {
  id: 'c',
  name: 'C (Wasm)',

  async run(code, consoleEl, project) {
    appendLine(consoleEl, 'ℹ️ C cannot be compiled in the browser.', 'info');
    appendLine(consoleEl, 'CodeLab can run pre-compiled .wasm modules.', 'info');
    appendLine(consoleEl, '', 'info');
    appendLine(consoleEl, 'How to use C in CodeLab:', 'info');
    appendLine(consoleEl, '  1. Compile locally:  emcc main.c -o main.wasm -sSTANDALONE_WASM', 'log');
    appendLine(consoleEl, '  2. Upload main.wasm via 📤 Upload', 'log');
    appendLine(consoleEl, '  3. CodeLab loads and runs it via WebAssembly.instantiate', 'log');
    appendLine(consoleEl, '', 'info');

    const wasm = project?.files?.find(f => f.name.endsWith('.wasm'));
    if (!wasm) {
      appendLine(consoleEl, '⚠️ No .wasm found in project.', 'error');
      return;
    }
    try {
      appendLine(consoleEl, '▶ Running Wasm...', 'info');
      // In a real setup you'd fetch the binary and instantiate it
      appendLine(consoleEl, '⚠️ Wasm execution stub — wire up WebAssembly.instantiate here.', 'warn');
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