/**
 * KAIROS Demo — Interactions (drag & drop)
 */

export function startDragNode(cm, e, node) {
  // Ignore if clicking on interactive elements
  const tag = e.target.tagName.toLowerCase();
  if (tag === 'input' || tag === 'select' || tag === 'textarea' || tag === 'button') return;
  if (e.target.closest('.pole-menu') || e.target.closest('.pole-connect-btn')) return;

  // Connection mode: select node instead of dragging
  if (cm.interaction.connectionMode) {
    cm.handleConnectionClick(node);
    return;
  }

  cm.interaction.isDragging = true;
  cm.interaction.draggedNode = node;

  const rect = cm.canvasArea.getBoundingClientRect();
  cm.interaction.dragStartX = (e.clientX - rect.left - cm.state.panX) / cm.state.zoom - node.x;
  cm.interaction.dragStartY = (e.clientY - rect.top - cm.state.panY) / cm.state.zoom - node.y;

  const nodeEl = document.getElementById(node.id);
  if (nodeEl) nodeEl.classList.add('dragging');

  // Save state for undo before drag
  document.dispatchEvent(new CustomEvent('nodeDragStart'));

  const onMove = (ev) => {
    const rect = cm.canvasArea.getBoundingClientRect();
    node.x = (ev.clientX - rect.left - cm.state.panX) / cm.state.zoom - cm.interaction.dragStartX;
    node.y = (ev.clientY - rect.top - cm.state.panY) / cm.state.zoom - cm.interaction.dragStartY;

    if (nodeEl) {
      nodeEl.style.left = `${node.x}px`;
      nodeEl.style.top = `${node.y}px`;
    }

    cm.updateNodeConnections(node.id);
  };

  const onUp = () => {
    cm.interaction.isDragging = false;
    cm.interaction.draggedNode = null;
    if (nodeEl) nodeEl.classList.remove('dragging');
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    document.dispatchEvent(new CustomEvent('nodeDragEnd'));
  };

  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
}

export function setupNodeInteractions(cm) {
  cm.polesContainer.addEventListener('pointerdown', (e) => {
    const poleEl = e.target.closest('.pole');
    if (!poleEl) return;

    const node = cm.state.nodes.find(n => n.id === poleEl.id);
    if (!node) return;

    e.stopPropagation();
    startDragNode(cm, e, node);
  });
}
