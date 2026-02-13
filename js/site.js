// ============================================
// SITE.JS — Scripts partages
// ============================================
// Fichier unique charge par toutes les pages du site.
// Chaque feature auto-detecte ses elements DOM :
// si un element manque, la feature est ignoree (pas d'erreur).

(function () {
  'use strict';

  // ─────────────────────────────────────────
  // THEME TOGGLE
  // ─────────────────────────────────────────
  // Fonctionne avec .theme-toggle (home) et .theme-toggle-article (articles).
  // Lit/ecrit localStorage('theme'), applique data-theme sur <html>.

  function initTheme() {
    var html = document.documentElement;
    var savedTheme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      html.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      html.setAttribute('data-theme', 'dark');
    }

    // Cherche le bouton theme (home ou article)
    var themeToggle = document.querySelector('.theme-toggle')
      || document.querySelector('.theme-toggle-article');

    if (!themeToggle) return;

    themeToggle.addEventListener('click', function () {
      var currentTheme = html.getAttribute('data-theme');
      var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // ─────────────────────────────────────────
  // MOBILE NAVIGATION
  // ─────────────────────────────────────────
  // Fonctionne avec #siteNav (home, about, contact)
  // et #nav (articles avec sidebar).
  // Bouton toggle : #navToggle

  function initMobileNav() {
    var navToggle = document.getElementById('navToggle');
    if (!navToggle) return;

    // Detecte quel element de navigation est present
    var nav = document.getElementById('siteNav')
      || document.getElementById('nav');
    if (!nav) return;

    navToggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });

    // Retourne la reference nav pour les autres features
    return nav;
  }

  // ─────────────────────────────────────────
  // SMOOTH SCROLL & CLOSE NAV ON CLICK
  // ─────────────────────────────────────────
  // Pour les liens ancres dans la navigation.
  // Ferme le menu mobile quand on clique un lien.

  function initNavLinkBehavior(nav) {
    if (!nav) return;

    // Detecte les liens de nav selon le type de page
    var navLinks = document.querySelectorAll('.site-nav a')
      || document.querySelectorAll('.nav-list a');

    // Fallback : si .site-nav a est vide, essayer .nav-list a
    if (!navLinks || navLinks.length === 0) {
      navLinks = document.querySelectorAll('.nav-list a');
    }
    if (!navLinks || navLinks.length === 0) return;

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        // Ferme le menu mobile
        // - Sur la home : ferme si c'est un lien ancre
        // - Sur les articles : ferme toujours (surtout en mobile)
        var href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          nav.classList.remove('open');
        } else if (window.innerWidth <= 900) {
          nav.classList.remove('open');
        }
      });
    });
  }

  // ─────────────────────────────────────────
  // SCROLL-BASED ACTIVE NAV
  // ─────────────────────────────────────────
  // Met en surbrillance la section courante dans la nav.
  // Fonctionne pour les sections home et les sections article.

  function initActiveNav() {
    // Detecte les sections avec id (inclut .chapter-divider[id] pour les longs articles)
    var sections = document.querySelectorAll('section[id], .chapter-divider[id]');
    if (!sections || sections.length === 0) return;

    // Detecte les liens de nav selon le type de page
    var navLinks = document.querySelectorAll('.site-nav a');
    if (!navLinks || navLinks.length === 0) {
      navLinks = document.querySelectorAll('.nav-list a');
    }
    if (!navLinks || navLinks.length === 0) return;

    // Determine l'offset selon le type de page
    // Articles avec sidebar : 200px d'offset pour mecanique-invisible
    // Autres pages : 100px
    var hasArticleSidebar = !!document.getElementById('nav');
    var scrollOffset = hasArticleSidebar ? 200 : 100;

    window.addEventListener('scroll', function () {
      var current = '';

      sections.forEach(function (section) {
        var sectionTop = section.offsetTop - scrollOffset;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  }

  // ─────────────────────────────────────────
  // PROGRESS BAR (articles uniquement)
  // ─────────────────────────────────────────
  // Auto-detecte .progress-bar-fill (#progress).
  // Met a jour la largeur au scroll.

  function initProgressBar() {
    var progressBar = document.getElementById('progress');
    if (!progressBar) return;

    window.addEventListener('scroll', function () {
      var scrollTop = document.documentElement.scrollTop;
      var scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      var progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = progress + '%';
    });
  }

  // ─────────────────────────────────────────
  // INITIALISATION
  // ─────────────────────────────────────────

  initTheme();
  var nav = initMobileNav();
  initNavLinkBehavior(nav);
  initActiveNav();
  initProgressBar();
})();
