/**
 * KAIROS Demo — Orchestrator
 *
 * Initializes the canvas, wires up history hooks,
 * loads demo data, binds toolbar + operations buttons,
 * and runs simulated DÉVELOPPER / RELIER.
 */

import { CanvasManager } from './canvas.js';
import { HistoryManager } from './history.js';
import { DEMO_DATA } from './types.js';
import { simulateDevelopper, simulateRelier, calculateConvergence } from './simulation.js';

class DemoApp {
  constructor() {
    this.canvas = new CanvasManager();
    this.history = new HistoryManager(this);
    this.isOperationRunning = false;

    this.setupMetricsHooks();
    this.setupToolbar();
    this.setupOperations();
    this.loadDemoData();

    this.updateMetrics();
  }

  // ── Hook pattern: wrap canvas methods for auto undo + metrics ──

  setupMetricsHooks() {
    // Keep originals for use during batch operations (DÉVELOPPER/RELIER)
    this._rawCreateConnection = this.canvas.createConnection.bind(this.canvas);

    const originalCreateNode = this.canvas.createNode.bind(this.canvas);
    this.canvas.createNode = (...args) => {
      this.history.saveState('creation vignette');
      const result = originalCreateNode(...args);
      this.updateMetrics();
      return result;
    };

    const originalDeleteNode = this.canvas.deleteNode.bind(this.canvas);
    this.canvas.deleteNode = (...args) => {
      this.history.saveState('suppression vignette');
      originalDeleteNode(...args);
      this.updateMetrics();
    };

    const originalCreateConnection = this.canvas.createConnection.bind(this.canvas);
    this.canvas.createConnection = (...args) => {
      this.history.saveState('creation connexion');
      const result = originalCreateConnection(...args);
      this.updateMetrics();
      return result;
    };

    const originalDeleteConnection = this.canvas.deleteConnection.bind(this.canvas);
    this.canvas.deleteConnection = (...args) => {
      this.history.saveState('suppression connexion');
      originalDeleteConnection(...args);
      this.updateMetrics();
    };

    const originalCycleNodeStatus = this.canvas.cycleNodeStatus.bind(this.canvas);
    this.canvas.cycleNodeStatus = (...args) => {
      this.history.saveState('changement statut');
      originalCycleNodeStatus(...args);
      this.updateMetrics();
    };

    const originalDeleteSelectedNodes = this.canvas.deleteSelectedNodes.bind(this.canvas);
    this.canvas.deleteSelectedNodes = (...args) => {
      this.history.saveState('suppression selection');
      originalDeleteSelectedNodes(...args);
      this.updateMetrics();
    };

    // Drag: save state before move
    let dragSaved = false;
    document.addEventListener('nodeDragStart', () => {
      if (!dragSaved) {
        this.history.saveState('deplacement vignette');
        dragSaved = true;
      }
    });
    document.addEventListener('nodeDragEnd', () => {
      dragSaved = false;
    });
  }

  // ── Simple metrics for bandeau ──

  updateMetrics() {
    const nodes = this.canvas.state.nodes;
    const connections = this.canvas.state.connections;
    const texte = document.getElementById('suggestion-texte');
    if (!texte) return;

    const total = nodes.length;
    const connected = nodes.filter(n =>
      connections.some(c => c.from === n.id || c.to === n.id)
    ).length;
    const isolated = total - connected;

    if (total === 0) {
      texte.textContent = 'Canvas vide — creez votre premiere vignette avec + Vignette.';
    } else if (total < 3) {
      texte.textContent = `${total} vignette(s) — ajoutez des idees puis lancez DEVELOPPER.`;
    } else if (isolated > total * 0.3) {
      texte.textContent = `${total} vignettes, ${isolated} isolee(s) — lancez RELIER pour les connecter.`;
    } else {
      texte.textContent = `${total} vignettes, ${connections.length} connexions`;
    }

    this.updateO2(nodes, connections);
  }

  // ── O₂ gauge ──

  updateO2(nodes, connections) {
    const fill = document.getElementById('o2-fill');
    const value = document.getElementById('o2-value');
    const gauge = fill && fill.closest('.o2-gauge');
    if (!fill || !value) return;

    const convergence = calculateConvergence(nodes, connections);
    const o2 = Math.round((1 - convergence) * 100);

    // Update bar
    fill.style.width = o2 + '%';

    // Update value
    value.textContent = o2;

    // Color class
    const level = o2 > 60 ? 'high' : o2 > 30 ? 'medium' : 'low';
    fill.className = 'o2-fill ' + level;
    value.className = 'o2-value ' + level;

    // Critical pulse when O₂ is very low
    if (gauge) {
      gauge.classList.toggle('critical', o2 <= 20);
    }
  }

  // ── Toolbar bindings ──

  setupToolbar() {
    const createBtn = document.getElementById('create-pole-btn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        const center = this.canvas.getCanvasCenter();
        this.canvas.createNode(center.x, center.y);
      });
    }

    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (this.canvas.state.nodes.length === 0) return;
        this.history.saveState('effacement canvas');
        this.canvas.clear();
        this.updateMetrics();
      });
    }

    const undoBtn = document.getElementById('btn-undo');
    const redoBtn = document.getElementById('btn-redo');
    if (undoBtn) undoBtn.addEventListener('click', () => this.history.undo());
    if (redoBtn) redoBtn.addEventListener('click', () => this.history.redo());
  }

  // ── Operations (DÉVELOPPER / RELIER) ──

  setupOperations() {
    const devBtn = document.getElementById('btn-developper');
    const relBtn = document.getElementById('btn-relier');

    if (devBtn) {
      devBtn.addEventListener('click', () => this.runDevelopper());
    }
    if (relBtn) {
      relBtn.addEventListener('click', () => this.runRelier());
    }
  }

  async runDevelopper() {
    if (this.isOperationRunning) return;
    if (this.canvas.state.nodes.length === 0) {
      this.showBandeauMessage('Ajoutez au moins une vignette avant de lancer DEVELOPPER.');
      return;
    }

    const btn = document.getElementById('btn-developper');
    this.setOperationLoading(btn, true, 'Reflexion...');

    // Save state for undo
    this.history.saveState('DEVELOPPER');

    // Simulate "thinking" delay (800-1500ms)
    const delay = 800 + Math.random() * 700;
    await this.wait(delay);

    // Generate results
    const result = simulateDevelopper(this.canvas);

    // Apply results progressively (staggered appearance)
    for (let i = 0; i < result.vignettes.length; i++) {
      const v = result.vignettes[i];
      const connInfo = result.connections[i];

      // Create the node using internal method (bypass hooks to avoid double history)
      const node = this.canvas.createNodeFromData({
        id: `n_${crypto.randomUUID()}`,
        text: v.text,
        x: Math.round(v.x),
        y: Math.round(v.y),
        status: 'neutral',
        tags: v.tags,
        isFriction: v.isFriction || false,
        newlyImported: true,
        created: new Date().toISOString(),
      });

      // Create connection to source
      if (connInfo) {
        const source = this.canvas.state.nodes.find(n => n.id === connInfo.sourceId);
        if (source && node) {
          this._rawCreateConnection(source, node, connInfo.type, connInfo.mechanism);
        }
      }

      // Stagger appearance
      if (i < result.vignettes.length - 1) {
        await this.wait(300);
      }
    }

    // Show log messages
    for (const log of result.log) {
      this.showBandeauMessage(log.text);
    }

    this.canvas.renderAllConnections();
    this.updateMetrics();
    this.setOperationLoading(btn, false, 'DEVELOPPER');
  }

  async runRelier() {
    if (this.isOperationRunning) return;
    if (this.canvas.state.nodes.length < 2) {
      this.showBandeauMessage('Il faut au moins 2 vignettes pour lancer RELIER.');
      return;
    }

    const btn = document.getElementById('btn-relier');
    this.setOperationLoading(btn, true, 'Analyse...');

    this.history.saveState('RELIER');

    await this.wait(600 + Math.random() * 400);

    const result = simulateRelier(this.canvas);

    for (let i = 0; i < result.connections.length; i++) {
      const c = result.connections[i];
      this._rawCreateConnection(c.from, c.to, c.type, c.mechanism);

      if (i < result.connections.length - 1) {
        await this.wait(200);
      }
    }

    for (const log of result.log) {
      this.showBandeauMessage(log.text);
    }

    this.canvas.renderAllConnections();
    this.updateMetrics();
    this.setOperationLoading(btn, false, 'RELIER');
  }

  // ── UI helpers ──

  setOperationLoading(btn, loading, text) {
    if (!btn) return;
    this.isOperationRunning = loading;
    btn.disabled = loading;
    btn.textContent = text;
    btn.classList.toggle('loading', loading);

    // Disable the other button too during operation
    const devBtn = document.getElementById('btn-developper');
    const relBtn = document.getElementById('btn-relier');
    if (loading) {
      if (devBtn && devBtn !== btn) devBtn.disabled = true;
      if (relBtn && relBtn !== btn) relBtn.disabled = true;
    } else {
      if (devBtn) devBtn.disabled = false;
      if (relBtn) relBtn.disabled = false;
    }
  }

  showBandeauMessage(text) {
    const el = document.getElementById('suggestion-texte');
    if (el) el.textContent = text;
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ── Load demo data ──

  loadDemoData() {
    this.canvas.loadData(DEMO_DATA);
    this.history.saveState('etat initial');
  }
}

// ── Bootstrap ──
new DemoApp();
