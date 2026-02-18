/**
 * KAIROS Demo — HistoryManager (undo/redo)
 */

export class HistoryManager {
  constructor(app) {
    this.app = app;
    this.undoStack = [];
    this.redoStack = [];
    this.isRestoring = false;
    this.maxSize = 50;
    this.setupKeyboardShortcuts();
  }

  saveState(action = '') {
    if (this.isRestoring) return;

    const snapshot = this.app.canvas.getData();
    this.undoStack.push({
      action,
      data: structuredClone(snapshot),
    });

    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }

    this.redoStack = [];
    this.updateButtons();
  }

  undo() {
    if (this.undoStack.length === 0) return;

    const current = this.app.canvas.getData();
    this.redoStack.push({
      action: 'redo',
      data: structuredClone(current),
    });

    const previous = this.undoStack.pop();
    this.isRestoring = true;
    this.app.canvas.clear();
    this.app.canvas.loadData(previous.data);
    this.isRestoring = false;
    this.updateButtons();
    this.app.updateMetrics();
  }

  redo() {
    if (this.redoStack.length === 0) return;

    const current = this.app.canvas.getData();
    this.undoStack.push({
      action: 'undo',
      data: structuredClone(current),
    });

    const next = this.redoStack.pop();
    this.isRestoring = true;
    this.app.canvas.clear();
    this.app.canvas.loadData(next.data);
    this.isRestoring = false;
    this.updateButtons();
    this.app.updateMetrics();
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.updateButtons();
  }

  updateButtons() {
    const undoBtn = document.getElementById('btn-undo');
    const redoBtn = document.getElementById('btn-redo');
    if (undoBtn) undoBtn.disabled = this.undoStack.length === 0;
    if (redoBtn) redoBtn.disabled = this.redoStack.length === 0;
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea, select')) return;

      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        this.undo();
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        this.redo();
      }
    });
  }
}
