/**
 * KAIROS Demo — Persistence (serialize / deserialize canvas state)
 */

import { createNodeFromData } from './nodes.js';
import { createConnectionFromData, renderAllConnections } from './connections.js';
import { applyTransform } from './viewport.js';

export function getData(cm) {
  return {
    version: 1,
    mode: 'explorer',
    zoom: cm.state.zoom,
    panX: cm.state.panX,
    panY: cm.state.panY,
    vignettes: cm.state.nodes.map(n => ({ ...n })),
    connections: cm.state.connections.map(c => ({ ...c })),
  };
}

export function loadData(cm, data) {
  if (!data) return;

  cm.state.zoom = data.zoom || 1;
  cm.state.panX = data.panX || 0;
  cm.state.panY = data.panY || 0;

  // Load nodes
  if (data.vignettes) {
    data.vignettes.forEach(v => createNodeFromData(cm, v));
  }

  // Load connections
  if (data.connections) {
    data.connections.forEach(c => createConnectionFromData(cm, c));
  }

  applyTransform(cm);
  requestAnimationFrame(() => renderAllConnections(cm));
}

export function clearCanvas(cm) {
  cm.state.nodes = [];
  cm.state.connections = [];
  cm.interaction.selectedNodes.clear();

  // Clear DOM
  while (cm.polesContainer.firstChild) {
    cm.polesContainer.firstChild.remove();
  }

  // Clear SVG (keep defs)
  const defs = cm.svgConnections.querySelector('defs');
  while (cm.svgConnections.lastChild && cm.svgConnections.lastChild !== defs) {
    cm.svgConnections.lastChild.remove();
  }
}
