/**
 * KAIROS Demo — Nodes (create, render, update, delete)
 */

import { generateId } from '../types.js';
import { findFreePosition } from './layout.js';

export function createNode(cm, x, y, text = '', status = 'neutral', tags = [], skipAutoPosition = false) {
  let finalPos = { x, y };
  if (!skipAutoPosition) {
    finalPos = findFreePosition(cm, x, y);
  }

  const node = {
    id: generateId('n'),
    x: Math.round(finalPos.x),
    y: Math.round(finalPos.y),
    text: text,
    status: status,
    tags: tags,
    created: new Date().toISOString(),
  };

  cm.state.nodes.push(node);
  renderNode(cm, node);
  return node;
}

export function createNodeFromData(cm, data) {
  const node = { ...data };
  cm.state.nodes.push(node);
  renderNode(cm, node);
  return node;
}

export function renderNode(cm, node) {
  const nodeDiv = document.createElement('div');
  nodeDiv.className = `pole status-${node.status}`;
  nodeDiv.id = node.id;
  nodeDiv.style.left = `${node.x}px`;
  nodeDiv.style.top = `${node.y}px`;

  if (node.newlyImported) {
    nodeDiv.classList.add('newly-created');
    setTimeout(() => nodeDiv.classList.remove('newly-created'), 500);
  }

  if (node.isFriction) {
    nodeDiv.classList.add('friction-vignette');
  }

  // Accent bar
  const accentBar = document.createElement('div');
  accentBar.className = 'node-accent-bar';
  nodeDiv.appendChild(accentBar);

  // Connection ports
  ['top', 'bottom', 'left', 'right'].forEach(pos => {
    const port = document.createElement('div');
    port.className = `node-port port-${pos}`;
    nodeDiv.appendChild(port);
  });

  // Header
  const header = document.createElement('div');
  header.className = 'pole-header';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'node-checkbox';
  checkbox.checked = cm.interaction.selectedNodes.has(node.id);
  checkbox.addEventListener('change', (e) => {
    e.stopPropagation();
    cm.toggleNodeSelection(node, checkbox.checked);
  });

  const statusSelect = document.createElement('select');
  statusSelect.className = 'pole-status-select-inline';
  statusSelect.innerHTML = `
    <option value="neutral">\u25CB</option>
    <option value="priority">\uD83C\uDFAF</option>
  `;
  statusSelect.value = node.status;
  statusSelect.addEventListener('change', (e) => {
    e.stopPropagation();
    cm.cycleNodeStatus(node);
    statusSelect.value = node.status;
  });

  const connectBtn = document.createElement('span');
  connectBtn.className = 'pole-connect-btn';
  connectBtn.textContent = '\uD83D\uDD17';
  connectBtn.title = 'Creer une connexion (L)';
  connectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    cm.enterConnectionMode(node);
  });

  const menu = document.createElement('span');
  menu.className = 'pole-menu';
  menu.textContent = '\u22EE';
  menu.addEventListener('click', (e) => {
    e.stopPropagation();
    cm.showNodeMenu(node, e.clientX, e.clientY);
  });

  header.append(checkbox, statusSelect, connectBtn, menu);

  // Content
  const content = document.createElement('div');
  content.className = 'pole-content';
  content.textContent = node.text || 'Nouvelle vignette';

  // Double-click to edit
  content.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    cm.showEditModal(node);
  });

  // Tags
  const tagsContainer = document.createElement('div');
  tagsContainer.className = 'pole-tags';
  if (node.tags && node.tags.length) {
    node.tags.forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'pole-tag';
      tagSpan.textContent = tag;
      tagsContainer.appendChild(tagSpan);
    });
  }

  // Seq badge
  const seqBadge = document.createElement('span');
  seqBadge.className = 'node-seq-badge';
  const idx = cm.state.nodes.indexOf(node);
  seqBadge.textContent = idx >= 0 ? `#${idx + 1}` : '';
  nodeDiv.appendChild(seqBadge);

  nodeDiv.append(header, content, tagsContainer);
  cm.polesContainer.appendChild(nodeDiv);
}

export function updateNodeElement(cm, node) {
  const el = document.getElementById(node.id);
  if (!el) return;

  el.className = `pole status-${node.status}`;
  if (node.isFriction) el.classList.add('friction-vignette');
  if (cm.interaction.selectedNodes.has(node.id)) el.classList.add('selected');

  const content = el.querySelector('.pole-content');
  if (content) content.textContent = node.text || 'Nouvelle vignette';

  const statusSelect = el.querySelector('.pole-status-select-inline');
  if (statusSelect) statusSelect.value = node.status;

  const tagsContainer = el.querySelector('.pole-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = '';
    if (node.tags && node.tags.length) {
      node.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'pole-tag';
        tagSpan.textContent = tag;
        tagsContainer.appendChild(tagSpan);
      });
    }
  }
}

export function deleteNode(cm, node) {
  cm.interaction.selectedNodes.delete(node.id);

  cm.state.connections = cm.state.connections.filter(
    conn => conn.from !== node.id && conn.to !== node.id
  );

  cm.state.nodes = cm.state.nodes.filter(n => n.id !== node.id);

  cm.renderAllConnections();

  const nodeEl = document.getElementById(node.id);
  if (nodeEl) nodeEl.remove();
}

export function cycleNodeStatus(cm, node) {
  const newStatus = node.status === 'neutral' ? 'priority' : 'neutral';

  if (newStatus === 'priority') {
    for (const other of cm.state.nodes) {
      if (other.id !== node.id && other.status === 'priority') {
        other.status = 'neutral';
        updateNodeElement(cm, other);
      }
    }
  }

  node.status = newStatus;
  updateNodeElement(cm, node);
}
