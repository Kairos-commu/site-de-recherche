/**
 * KAIROS Demo — Layout (collision detection & positioning)
 */

const NODE_WIDTH = 300;
const NODE_HEIGHT = 120;
const PADDING = 20;

export function checkCollision(cm, x, y, excludeId = null) {
  for (const node of cm.state.nodes) {
    if (excludeId && node.id === excludeId) continue;
    const dx = Math.abs(node.x - x);
    const dy = Math.abs(node.y - y);
    if (dx < NODE_WIDTH + PADDING && dy < NODE_HEIGHT + PADDING) {
      return true;
    }
  }
  return false;
}

export function findFreePosition(cm, startX, startY) {
  if (!checkCollision(cm, startX, startY)) {
    return { x: startX, y: startY };
  }

  // Spiral search for free position
  const step = NODE_HEIGHT + PADDING;
  for (let radius = 1; radius <= 10; radius++) {
    for (let angle = 0; angle < 360; angle += 45) {
      const rad = (angle * Math.PI) / 180;
      const x = startX + Math.cos(rad) * radius * step;
      const y = startY + Math.sin(rad) * radius * step;
      if (!checkCollision(cm, x, y)) {
        return { x: Math.round(x), y: Math.round(y) };
      }
    }
  }

  // Fallback: offset below
  return {
    x: startX + Math.random() * 100,
    y: startY + cm.state.nodes.length * (NODE_HEIGHT + PADDING),
  };
}

export function getCanvasCenter(cm) {
  const rect = cm.canvasArea.getBoundingClientRect();
  return {
    x: (rect.width / 2 - cm.state.panX) / cm.state.zoom,
    y: (rect.height / 2 - cm.state.panY) / cm.state.zoom,
  };
}
