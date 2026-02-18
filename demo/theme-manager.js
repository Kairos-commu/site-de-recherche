/**
 * KAIROS Demo — Theme manager
 */

const THEMES = {
  obsidian: { label: 'Obsidian', swatch: '#0f1117' },
  porcelain: { label: 'Porcelain', swatch: '#e8e6e0' },
};

export function initTheme() {
  const saved = localStorage.getItem('kairos_theme') || 'obsidian';
  setTheme(saved);
}

export function setTheme(theme) {
  if (!THEMES[theme]) theme = 'obsidian';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('kairos_theme', theme);

  const label = document.getElementById('theme-label');
  const swatch = document.getElementById('theme-btn-swatch');
  if (label) label.textContent = THEMES[theme].label;
  if (swatch) swatch.style.background = THEMES[theme].swatch;
}

export function setupThemeSelector() {
  const btn = document.getElementById('btn-theme');
  const menu = document.getElementById('theme-menu');
  if (!btn || !menu) return;

  // Start hidden
  menu.style.display = 'none';

  function openMenu() {
    menu.style.display = 'block';
  }

  function closeMenu() {
    menu.style.display = 'none';
  }

  function isOpen() {
    return menu.style.display !== 'none';
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const theme = option.getAttribute('data-theme');
      if (theme) setTheme(theme);
      closeMenu();
    });
  });

  // Close on any click outside
  document.addEventListener('pointerdown', (e) => {
    if (isOpen() && !btn.contains(e.target) && !menu.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      closeMenu();
    }
  });
}
