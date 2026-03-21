/**
 * KAIROS Demo — Connections (SVG Bezier curves)
 */

import { generateId } from '../types.js';

let renderTimer = null;

export function createConnection(cm, fromNode, toNode, type = 'implies', mechanism = null) {
  if (fromNode.id === toNode.id) return null;

  const exists = cm.state.connections.some(
    conn => (conn.from === fromNode.id && conn.to === toNode.id) ||
            (conn.from === toNode.id && conn.to === fromNode.id)
  );
  if (exists) return null;

  const connection = {
    id: generateId('c'),
    from: fromNode.id,
    to: toNode.id,
    type: type,
    mechanism: mechanism,
    created: new Date().toISOString(),
  };

  cm.state.connections.push(connection);
  scheduleConnectionRender(cm);
  return connection;
}

export function createConnectionFromData(cm, data) {
  cm.state.connections.push({ ...data });
}

function calculatePathD(from, to) {
  const dy = to.y - from.y;
  const curvature = Math.min(Math.abs(dy) * 0.4, 80);
  return `M ${from.x} ${from.y} C ${from.x} ${from.y + curvature}, ${to.x} ${to.y - curvature}, ${to.x} ${to.y}`;
}

export function getNodeCenter(cm, node) {
  const element = document.getElementById(node.id);
  const width = element ? element.offsetWidth : 300;
  const height = element ? element.offsetHeight : 120;
  return { x: node.x + width / 2, y: node.y + height / 2 };
}

function renderSingleConnection(cm, conn) {
  const fromNode = cm.state.nodes.find(n => n.id === conn.from);
  const toNode = cm.state.nodes.find(n => n.id === conn.to);
  if (!fromNode || !toNode) return;

  const fromCenter = getNodeCenter(cm, fromNode);
  const toCenter = getNodeCenter(cm, toNode);
  const pathD = calculatePathD(fromCenter, toCenter);

  // Hitbox (invisible, wide for click)
  const hitbox = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  hitbox.classList.add('connection-hitbox');
  hitbox.setAttribute('data-connection-id', `hitbox-${conn.id}`);
  hitbox.setAttribute('d', pathD);
  hitbox.addEventListener('click', (e) => {
    e.stopPropagation();
    cm.showConnectionMenu(conn, e.clientX, e.clientY);
  });

  // Visible line
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.classList.add('connection-line', `connection-${conn.type}`);
  path.setAttribute('data-connection-id', conn.id);
  path.setAttribute('d', pathD);

  if (conn.type === 'implies') {
    path.setAttribute('stroke', 'url(#grad-implies)');
    path.setAttribute('marker-end', 'url(#arrow-implies)');
  } else if (conn.type === 'resonance') {
    path.setAttribute('stroke', 'url(#grad-resonance)');
    path.setAttribute('marker-end', 'url(#arrow-resonance)');
  }

  path.setAttribute('filter', 'url(#connection-glow)');

  if (conn.mechanism) {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = conn.mechanism;
    path.appendChild(title);
  }

  // Hover sync between hitbox and line
  hitbox.addEventListener('mouseenter', () => path.classList.add('hovered'));
  hitbox.addEventListener('mouseleave', () => path.classList.remove('hovered'));

  cm.svgConnections.appendChild(hitbox);
  cm.svgConnections.appendChild(path);
}

export function renderAllConnections(cm) {
  const lineMap = new Map();
  const hitboxMap = new Map();

  cm.svgConnections.querySelectorAll('.connection-line').forEach(path => {
    lineMap.set(path.getAttribute('data-connection-id'), path);
  });
  cm.svgConnections.querySelectorAll('.connection-hitbox').forEach(path => {
    const id = path.getAttribute('data-connection-id');
    if (id) hitboxMap.set(id, path);
  });

  const currentIds = new Set(cm.state.connections.map(c => c.id));

  // Remove orphans
  lineMap.forEach((path, id) => {
    if (!currentIds.has(id)) {
      path.remove();
      const hitbox = hitboxMap.get(`hitbox-${id}`);
      if (hitbox) hitbox.remove();
    }
  });

  // Update or create
  cm.state.connections.forEach(conn => {
    const fromNode = cm.state.nodes.find(n => n.id === conn.from);
    const toNode = cm.state.nodes.find(n => n.id === conn.to);
    if (!fromNode || !toNode) return;

    const newD = calculatePathD(getNodeCenter(cm, fromNode), getNodeCenter(cm, toNode));

    if (lineMap.has(conn.id)) {
      lineMap.get(conn.id).setAttribute('d', newD);
      const hitbox = hitboxMap.get(`hitbox-${conn.id}`);
      if (hitbox) hitbox.setAttribute('d', newD);
    } else {
      renderSingleConnection(cm, conn);
    }
  });
}

export function updateNodeConnections(cm, nodeId) {
  cm.state.connections.forEach(conn => {
    if (conn.from !== nodeId && conn.to !== nodeId) return;

    const fromNode = cm.state.nodes.find(n => n.id === conn.from);
    const toNode = cm.state.nodes.find(n => n.id === conn.to);
    if (!fromNode || !toNode) return;

    const newD = calculatePathD(getNodeCenter(cm, fromNode), getNodeCenter(cm, toNode));

    const line = cm.svgConnections.querySelector(`[data-connection-id="${conn.id}"]`);
    if (line) line.setAttribute('d', newD);

    const hitbox = cm.svgConnections.querySelector(`[data-connection-id="hitbox-${conn.id}"]`);
    if (hitbox) hitbox.setAttribute('d', newD);
  });
}

export function deleteConnection(cm, conn) {
  cm.state.connections = cm.state.connections.filter(c => c.id !== conn.id);

  const line = cm.svgConnections.querySelector(`[data-connection-id="${conn.id}"]`);
  if (line) line.remove();

  const hitbox = cm.svgConnections.querySelector(`[data-connection-id="hitbox-${conn.id}"]`);
  if (hitbox) hitbox.remove();
}

function scheduleConnectionRender(cm) {
  if (renderTimer) clearTimeout(renderTimer);
  renderTimer = setTimeout(() => renderAllConnections(cm), 50);
}
