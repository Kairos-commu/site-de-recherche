/**
 * KAIROS Demo — CanvasManager (wrapper class)
 */

import { createNode as _createNode, createNodeFromData as _createNodeFromData, renderNode as _renderNode, updateNodeElement as _updateNodeElement, deleteNode as _deleteNode, cycleNodeStatus as _cycleNodeStatus } from './canvas/nodes.js';
import { createConnection as _createConnection, createConnectionFromData as _createConnectionFromData, renderAllConnections as _renderAllConnections, updateNodeConnections as _updateNodeConnections, deleteConnection as _deleteConnection, getNodeCenter as _getNodeCenter } from './canvas/connections.js';
import { setupViewport } from './canvas/viewport.js';
import { setupNodeInteractions } from './canvas/interactions.js';
import { toggleNodeSelection as _toggleNodeSelection, clearSelection as _clearSelection, getSelectedNodes as _getSelectedNodes, deleteSelectedNodes as _deleteSelectedNodes } from './canvas/selection.js';
import { showNodeMenu as _showNodeMenu, showConnectionMenu as _showConnectionMenu, showConnectionTypeMenu as _showConnectionTypeMenu, showEditModal as _showEditModal } from './canvas/menus.js';
import { getData as _getData, loadData as _loadData, clearCanvas as _clearCanvas } from './canvas/persistence.js';
import { findFreePosition as _findFreePosition, getCanvasCenter as _getCanvasCenter } from './canvas/layout.js';

export class CanvasManager {
  constructor() {
    // DOM references
    this.canvasArea = document.querySelector('.canvas-area');
    this.polesContainer = document.getElementById('poles-container');
    this.svgConnections = document.getElementById('connections');
    this.connectionIndicator = document.getElementById('connection-mode-indicator');

    // State
    this.state = {
      nodes: [],
      connections: [],
      zoom: 1,
      panX: 0,
      panY: 0,
    };

    // Interaction state
    this.interaction = {
      isPanning: false,
      isDragging: false,
      draggedNode: null,
      dragStartX: 0,
      dragStartY: 0,
      selectedNodes: new Set(),
      connectionMode: false,
      connectionSource: null,
    };

    // Initialize viewport (pan & zoom)
    setupViewport(this);

    // Initialize node interactions (drag & drop)
    setupNodeInteractions(this);

    // Keyboard shortcuts for connection mode
    document.addEventListener('keydown', (e) => {
      if (e.key === 'l' || e.key === 'L') {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          if (this.interaction.connectionMode) {
            this.exitConnectionMode();
          } else {
            this.enterConnectionMode();
          }
        }
      }
      if (e.key === 'Escape') {
        if (this.interaction.connectionMode) {
          this.exitConnectionMode();
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (this.interaction.selectedNodes.size > 0 && !e.target.closest('input, textarea, select')) {
          e.preventDefault();
          this.deleteSelectedNodes();
        }
      }
    });
  }

  // ── Nodes ──

  createNode(x, y, text = '', status = 'neutral', tags = [], skipAutoPosition = false) {
    return _createNode(this, x, y, text, status, tags, skipAutoPosition);
  }

  createNodeFromData(data) {
    return _createNodeFromData(this, data);
  }

  renderNode(node) {
    return _renderNode(this, node);
  }

  updateNodeElement(node) {
    return _updateNodeElement(this, node);
  }

  deleteNode(node) {
    return _deleteNode(this, node);
  }

  cycleNodeStatus(node) {
    return _cycleNodeStatus(this, node);
  }

  // ── Connections ──

  createConnection(fromNode, toNode, type = 'implies', mechanism = null) {
    return _createConnection(this, fromNode, toNode, type, mechanism);
  }

  renderAllConnections() {
    return _renderAllConnections(this);
  }

  updateNodeConnections(nodeId) {
    return _updateNodeConnections(this, nodeId);
  }

  deleteConnection(conn) {
    return _deleteConnection(this, conn);
  }

  getNodeCenter(node) {
    return _getNodeCenter(this, node);
  }

  // ── Connection mode ──

  enterConnectionMode(sourceNode = null) {
    this.interaction.connectionMode = true;
    this.interaction.connectionSource = sourceNode || null;
    this.polesContainer.classList.add('connection-mode-waiting');

    if (this.connectionIndicator) {
      this.connectionIndicator.textContent = sourceNode
        ? `Connexion depuis "${sourceNode.text.substring(0, 30)}..." — cliquez sur la cible`
        : 'Mode connexion — cliquez sur la source';
      this.connectionIndicator.classList.add('active');
    }

    if (sourceNode) {
      const el = document.getElementById(sourceNode.id);
      if (el) el.classList.add('connection-source');
    }
  }

  exitConnectionMode() {
    if (this.interaction.connectionSource) {
      const el = document.getElementById(this.interaction.connectionSource.id);
      if (el) el.classList.remove('connection-source');
    }
    this.interaction.connectionMode = false;
    this.interaction.connectionSource = null;
    this.polesContainer.classList.remove('connection-mode-waiting');

    if (this.connectionIndicator) {
      this.connectionIndicator.classList.remove('active');
    }
  }

  handleConnectionClick(node) {
    if (!this.interaction.connectionSource) {
      // First click: select source
      this.interaction.connectionSource = node;
      const el = document.getElementById(node.id);
      if (el) el.classList.add('connection-source');

      if (this.connectionIndicator) {
        this.connectionIndicator.textContent = `Connexion depuis "${node.text.substring(0, 30)}..." — cliquez sur la cible`;
      }
    } else if (this.interaction.connectionSource.id === node.id) {
      // Clicked same node: cancel
      this.exitConnectionMode();
    } else {
      // Second click: show type menu
      const el = document.getElementById(node.id);
      const rect = el ? el.getBoundingClientRect() : { left: 0, top: 0 };
      _showConnectionTypeMenu(this, this.interaction.connectionSource, node, rect.left, rect.top);
    }
  }

  // ── Selection ──

  toggleNodeSelection(node, isSelected) {
    return _toggleNodeSelection(this, node, isSelected);
  }

  clearSelection() {
    return _clearSelection(this);
  }

  getSelectedNodes() {
    return _getSelectedNodes(this);
  }

  deleteSelectedNodes() {
    return _deleteSelectedNodes(this);
  }

  // ── Menus ──

  showNodeMenu(node, x, y) {
    return _showNodeMenu(this, node, x, y);
  }

  showConnectionMenu(conn, x, y) {
    return _showConnectionMenu(this, conn, x, y);
  }

  showEditModal(node) {
    return _showEditModal(this, node);
  }

  // ── Persistence ──

  getData() {
    return _getData(this);
  }

  loadData(data) {
    return _loadData(this, data);
  }

  clear() {
    return _clearCanvas(this);
  }

  // ── Layout ──

  findFreePosition(x, y) {
    return _findFreePosition(this, x, y);
  }

  getCanvasCenter() {
    return _getCanvasCenter(this);
  }
}
