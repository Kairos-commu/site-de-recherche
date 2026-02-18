/**
 * KAIROS Demo — Menus (context menu, edit modal, connection type)
 */

let activeMenu = null;

function closeActiveMenu() {
  if (activeMenu) {
    activeMenu.remove();
    activeMenu = null;
  }
}

// Close menus on outside click
document.addEventListener('click', (e) => {
  if (activeMenu && !activeMenu.contains(e.target)) {
    closeActiveMenu();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeActiveMenu();
    closeActiveModal();
  }
});

// ── Node context menu (⋮) ──

export function showNodeMenu(cm, node, x, y) {
  closeActiveMenu();

  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;

  const items = [
    { label: '\u270F\uFE0F Editer', action: () => { closeActiveMenu(); cm.showEditModal(node); } },
    { label: '\uD83D\uDD17 Connecter (L)', action: () => { closeActiveMenu(); cm.enterConnectionMode(node); } },
    { label: node.status === 'priority' ? '\u25CB Retirer ancre' : '\uD83C\uDFAF Definir comme ancre',
      action: () => { closeActiveMenu(); cm.cycleNodeStatus(node); } },
    { separator: true },
    { label: '\uD83D\uDDD1\uFE0F Supprimer', danger: true, action: () => { closeActiveMenu(); cm.deleteNode(node); } },
  ];

  items.forEach(item => {
    if (item.separator) {
      const sep = document.createElement('div');
      sep.className = 'context-menu-separator';
      menu.appendChild(sep);
      return;
    }

    const btn = document.createElement('button');
    btn.className = 'context-menu-item' + (item.danger ? ' danger' : '');
    btn.textContent = item.label;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      item.action();
    });
    menu.appendChild(btn);
  });

  document.body.appendChild(menu);
  activeMenu = menu;

  // Adjust if overflows viewport
  requestAnimationFrame(() => {
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      menu.style.left = `${window.innerWidth - rect.width - 8}px`;
    }
    if (rect.bottom > window.innerHeight) {
      menu.style.top = `${window.innerHeight - rect.height - 8}px`;
    }
  });
}

// ── Connection context menu ──

export function showConnectionMenu(cm, conn, x, y) {
  closeActiveMenu();

  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;

  const typeLabel = conn.type === 'implies' ? 'implies \u2192' : 'resonance \u2194';
  const otherType = conn.type === 'implies' ? 'resonance' : 'implies';
  const otherLabel = otherType === 'implies' ? 'implies \u2192' : 'resonance \u2194';

  const items = [
    { label: `Type: ${typeLabel}`, disabled: true },
    { label: `Changer en ${otherLabel}`, action: () => {
      closeActiveMenu();
      conn.type = otherType;
      cm.renderAllConnections();
    }},
    { separator: true },
    { label: '\uD83D\uDDD1\uFE0F Supprimer', danger: true, action: () => {
      closeActiveMenu();
      cm.deleteConnection(conn);
    }},
  ];

  items.forEach(item => {
    if (item.separator) {
      const sep = document.createElement('div');
      sep.className = 'context-menu-separator';
      menu.appendChild(sep);
      return;
    }

    const btn = document.createElement('button');
    btn.className = 'context-menu-item' + (item.danger ? ' danger' : '');
    if (item.disabled) {
      btn.style.opacity = '0.5';
      btn.style.cursor = 'default';
      btn.style.fontStyle = 'italic';
    }
    btn.textContent = item.label;
    if (!item.disabled) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        item.action();
      });
    }
    menu.appendChild(btn);
  });

  document.body.appendChild(menu);
  activeMenu = menu;
}

// ── Connection type picker ──

export function showConnectionTypeMenu(cm, fromNode, toNode, x, y) {
  closeActiveMenu();

  const menu = document.createElement('div');
  menu.className = 'connection-type-menu';
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;

  const types = [
    { type: 'implies', symbol: '\u2192', label: 'Implique', desc: 'A entraine B' },
    { type: 'resonance', symbol: '\u2194', label: 'Resonance', desc: 'A et B se font echo' },
  ];

  types.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'connection-type-option';
    btn.innerHTML = `
      <span class="connection-type-symbol">${t.symbol}</span>
      <div>
        <strong>${t.label}</strong><br>
        <small style="color: var(--text-muted)">${t.desc}</small>
      </div>
    `;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeActiveMenu();
      cm.createConnection(fromNode, toNode, t.type);
      cm.exitConnectionMode();
    });
    menu.appendChild(btn);
  });

  document.body.appendChild(menu);
  activeMenu = menu;
}

// ── Edit modal ──

let activeModal = null;

function closeActiveModal() {
  if (activeModal) {
    activeModal.remove();
    activeModal = null;
  }
}

export function showEditModal(cm, node) {
  closeActiveModal();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal';

  modal.innerHTML = `
    <div class="modal-title">Editer la vignette</div>
    <div class="modal-field">
      <label class="modal-label">Contenu</label>
      <textarea class="modal-textarea" id="edit-text" rows="4">${node.text || ''}</textarea>
    </div>
    <div class="modal-field">
      <label class="modal-label">Tags (separes par des virgules)</label>
      <input class="modal-input" id="edit-tags" type="text"
             value="${(node.tags || []).join(', ')}"
             placeholder="#concept, #idee">
    </div>
    <div class="modal-actions">
      <button class="modal-btn" id="edit-cancel">Annuler</button>
      <button class="modal-btn primary" id="edit-save">Sauvegarder</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  activeModal = overlay;

  const textarea = modal.querySelector('#edit-text');
  textarea.focus();
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);

  const save = () => {
    const text = modal.querySelector('#edit-text').value.trim();
    const tagsRaw = modal.querySelector('#edit-tags').value;
    const tags = tagsRaw
      .split(',')
      .map(t => t.trim())
      .filter(t => t)
      .map(t => t.startsWith('#') ? t : `#${t}`);

    node.text = text;
    node.tags = tags;
    cm.updateNodeElement(node);
    closeActiveModal();
  };

  modal.querySelector('#edit-save').addEventListener('click', save);
  modal.querySelector('#edit-cancel').addEventListener('click', closeActiveModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeActiveModal();
  });

  // Ctrl+Enter to save
  textarea.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      save();
    }
  });
}
