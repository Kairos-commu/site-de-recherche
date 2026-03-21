/**
 * KAIROS Demo — Selection (multi-select with Ctrl+Click)
 */

export function toggleNodeSelection(cm, node, isSelected) {
  if (isSelected) {
    cm.interaction.selectedNodes.add(node.id);
  } else {
    cm.interaction.selectedNodes.delete(node.id);
  }

  const el = document.getElementById(node.id);
  if (el) {
    el.classList.toggle('selected', isSelected);
    const checkbox = el.querySelector('.node-checkbox');
    if (checkbox) checkbox.checked = isSelected;
  }
}

export function clearSelection(cm) {
  cm.interaction.selectedNodes.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('selected');
      const checkbox = el.querySelector('.node-checkbox');
      if (checkbox) checkbox.checked = false;
    }
  });
  cm.interaction.selectedNodes.clear();
}

export function getSelectedNodes(cm) {
  return cm.state.nodes.filter(n => cm.interaction.selectedNodes.has(n.id));
}

export function deleteSelectedNodes(cm) {
  const selected = getSelectedNodes(cm);
  selected.forEach(node => cm.deleteNode(node));
  cm.interaction.selectedNodes.clear();
}
