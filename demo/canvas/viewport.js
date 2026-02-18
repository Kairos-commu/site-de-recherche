/**
 * KAIROS Demo — Viewport (pan & zoom)
 */

export function handleZoom(cm, e) {
  e.preventDefault();
  const zoomSpeed = 0.05;
  const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
  const newZoom = Math.max(0.1, Math.min(5, cm.state.zoom + delta));

  const rect = cm.canvasArea.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const zoomRatio = newZoom / cm.state.zoom;
  cm.state.panX = mouseX - zoomRatio * (mouseX - cm.state.panX);
  cm.state.panY = mouseY - zoomRatio * (mouseY - cm.state.panY);
  cm.state.zoom = newZoom;

  applyTransform(cm);
}

export function applyTransform(cm) {
  const transform = `translate(${cm.state.panX}px, ${cm.state.panY}px) scale(${cm.state.zoom})`;
  cm.polesContainer.style.transform = transform;
  cm.svgConnections.style.transform = transform;

  const nodeScale = 1 / cm.state.zoom;
  cm.polesContainer.style.setProperty('--node-scale', nodeScale);

  const zoomDisplay = document.getElementById('current-zoom');
  if (zoomDisplay) {
    zoomDisplay.textContent = `${Math.round(cm.state.zoom * 100)}%`;
  }
}

export function startPan(cm, e) {
  cm.interaction.isPanning = true;
  cm.interaction.dragStartX = e.clientX - cm.state.panX;
  cm.interaction.dragStartY = e.clientY - cm.state.panY;
  cm.canvasArea.style.cursor = 'grabbing';
}

export function updatePan(cm, e) {
  if (!cm.interaction.isPanning) return;
  cm.state.panX = e.clientX - cm.interaction.dragStartX;
  cm.state.panY = e.clientY - cm.interaction.dragStartY;
  applyTransform(cm);
}

export function stopPan(cm) {
  cm.interaction.isPanning = false;
  cm.canvasArea.style.cursor = '';
}

export function setupViewport(cm) {
  cm.canvasArea.addEventListener('wheel', (e) => handleZoom(cm, e), { passive: false });

  cm.canvasArea.addEventListener('pointerdown', (e) => {
    if (e.target === cm.canvasArea || e.target === cm.polesContainer) {
      if (e.button === 0 && !cm.interaction.connectionMode) {
        startPan(cm, e);
      } else if (e.button === 1) {
        e.preventDefault();
        startPan(cm, e);
      }
    }
  });

  cm.canvasArea.addEventListener('pointermove', (e) => {
    if (cm.interaction.isPanning) {
      updatePan(cm, e);
    }
  });

  cm.canvasArea.addEventListener('pointerup', () => {
    if (cm.interaction.isPanning) {
      stopPan(cm);
    }
  });

  // Touch: 2-finger pan
  let lastTouchDist = 0;
  let lastTouchCenter = null;

  cm.canvasArea.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist = Math.hypot(dx, dy);
      lastTouchCenter = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    }
  }, { passive: false });

  cm.canvasArea.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && lastTouchCenter) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const center = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };

      // Pinch zoom
      const scale = dist / lastTouchDist;
      const newZoom = Math.max(0.1, Math.min(5, cm.state.zoom * scale));
      const rect = cm.canvasArea.getBoundingClientRect();
      const mx = center.x - rect.left;
      const my = center.y - rect.top;
      const zoomRatio = newZoom / cm.state.zoom;
      cm.state.panX = mx - zoomRatio * (mx - cm.state.panX);
      cm.state.panY = my - zoomRatio * (my - cm.state.panY);
      cm.state.zoom = newZoom;

      // 2-finger pan
      cm.state.panX += center.x - lastTouchCenter.x;
      cm.state.panY += center.y - lastTouchCenter.y;

      lastTouchDist = dist;
      lastTouchCenter = center;
      applyTransform(cm);
    }
  }, { passive: false });

  cm.canvasArea.addEventListener('touchend', () => {
    lastTouchDist = 0;
    lastTouchCenter = null;
  });
}
