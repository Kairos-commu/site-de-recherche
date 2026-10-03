// ============================================
// SITE.JS — Scripts partages
// ============================================
// Fichier unique charge par toutes les pages du site.
// Chaque feature auto-detecte ses elements DOM :
// si un element manque, la feature est ignoree (pas d'erreur).

(function () {
  'use strict';

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
  // SOMMAIRE D'ARTICLE (petit écran)
  // ─────────────────────────────────────────
  // #tocToggle ouvre/ferme #nav (le sommaire latéral). Le burger #navToggle
  // du header commun, lui, ouvre #siteNav — les deux coexistent sur un
  // article depuis que le header est le même partout (11/09).

  function initTocToggle() {
    var toggle = document.getElementById('tocToggle');
    var toc = document.getElementById('nav');
    if (!toggle || !toc) return;
    toggle.addEventListener('click', function () {
      toc.classList.toggle('open');
    });
    toc.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { toc.classList.remove('open'); });
    });
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

    // Detecte les liens de nav selon le type de page : le sommaire d'article
    // d'abord (il coexiste avec le header commun depuis le 11/09), sinon la nav du site
    // 03/10 : plus jamais .site-nav — le header garde son lien actif (la page),
    // il ne suit pas les sections.
    var navLinks = document.querySelectorAll('.nav-list a');
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
  // SCROLL REVEAL (IntersectionObserver)
  // ─────────────────────────────────────────
  // Observe les elements avec [data-reveal].
  // Ajoute .is-visible quand ils entrent dans le viewport.
  // Respecte prefers-reduced-motion.

  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var elements = document.querySelectorAll('[data-reveal]');
    if (!elements || elements.length === 0) return;

    var isMobile = window.innerWidth <= 768;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: isMobile ? 0.02 : 0.15,
      rootMargin: isMobile ? '0px' : '0px 0px -40px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ─────────────────────────────────────────
  // DATA-VIZ ANIMATION (articles)
  // ─────────────────────────────────────────
  // Anime les barres des graphiques a leur entree dans le viewport.

  function initDataVizAnimation() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var vizContainers = document.querySelectorAll('.data-viz');
    if (!vizContainers || vizContainers.length === 0) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    vizContainers.forEach(function (viz) {
      observer.observe(viz);
    });
  }

  // ─────────────────────────────────────────
  // HERO PARALLAX (index.html)
  // ─────────────────────────────────────────
  // Leger parallax sur l'image hero au scroll.

  function initHeroParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var heroImage = document.querySelector('.hero__image');
    if (!heroImage) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            heroImage.style.transform = 'translateY(' + (scrollY * 0.12) + 'px)';
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ─────────────────────────────────────────
  // IMAGE ZOOM (lightbox)
  // ─────────────────────────────────────────
  // Clic sur une image d'article → overlay plein ecran.
  // Fermeture : clic overlay, bouton ×, touche Escape.

  function initImageZoom() {
    var images = document.querySelectorAll('.hero-image, .content-wrapper img');
    if (!images || images.length === 0) return;

    function closeLightbox(overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      overlay.addEventListener('transitionend', function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, { once: true });
    }

    images.forEach(function (img) {
      img.addEventListener('click', function () {
        var overlay = document.createElement('div');
        overlay.className = 'image-lightbox';

        var closeBtn = document.createElement('button');
        closeBtn.className = 'image-lightbox__close';
        closeBtn.setAttribute('aria-label', 'Fermer');
        closeBtn.textContent = '\u00D7';

        var zoomedImg = document.createElement('img');
        zoomedImg.src = img.src;
        zoomedImg.alt = img.alt || '';

        overlay.appendChild(closeBtn);
        overlay.appendChild(zoomedImg);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(function () {
          overlay.classList.add('active');
        });

        overlay.addEventListener('click', function (e) {
          if (e.target === overlay || e.target === zoomedImg) {
            closeLightbox(overlay);
          }
        });

        closeBtn.addEventListener('click', function () {
          closeLightbox(overlay);
        });

        function onEscape(e) {
          if (e.key === 'Escape') {
            closeLightbox(overlay);
            document.removeEventListener('keydown', onEscape);
          }
        }
        document.addEventListener('keydown', onEscape);
      });
    });
  }

  // ─────────────────────────────────────────
  // OBSERVATOIRE — LA SCÈNE (accueil)
  // ─────────────────────────────────────────
  // La scène vit dans un repère fixe de 1280×960 (les astres doivent tomber
  // sur les orbites du canvas) : on la met à l'échelle min(vw/1280, 1.3) et la
  // hauteur du parent suit. Sous 700 px elle est masquée (CSS) au profit de la liste.

  function initStage() {
    var stage = document.getElementById('obsStage');
    if (!stage) return;
    var scene = stage.parentNode;
    function fit() {
      var vw = document.documentElement.clientWidth || 1280;
      var s = Math.min(vw / 1280, 1.3);
      var left = Math.round((vw - 1280 * s) / 2);
      stage.classList.add('is-scaled');
      stage.style.transform = 'translateX(' + left + 'px) scale(' + s.toFixed(4) + ')';
      scene.style.height = Math.round(960 * s) + 'px';
    }
    var t;
    window.addEventListener('resize', function () { cancelAnimationFrame(t); t = requestAnimationFrame(fit); });
    fit();
  }

  // L'astre actif : survol (ou focus) d'un astre ou d'une graduation de la frise.
  // La fiche se met à jour par textContent. Actif par défaut : Choragos & Kora.
  // Sans JS, la fiche montre le texte le plus récent (rendu au build).

  function initAstres() {
    var fiche = document.getElementById('obsFiche');
    if (!fiche) return;
    var astres = {};
    document.querySelectorAll('.astre[data-slug]').forEach(function (a) { astres[a.dataset.slug] = a; });
    var champs = {};
    fiche.querySelectorAll('[data-f]').forEach(function (el) { champs[el.dataset.f] = el; });

    function activer(slug) {
      var a = astres[slug];
      if (!a) return;
      document.querySelectorAll('.astre.is-active, .tick.is-active').forEach(function (el) { el.classList.remove('is-active'); });
      a.classList.add('is-active');
      var tick = document.getElementById('tick-' + slug);
      if (tick) tick.classList.add('is-active');
      fiche.className = 'obs-fiche o' + a.dataset.orbit;
      champs.label.textContent = a.dataset.label;
      champs.min.textContent = a.dataset.min;
      champs.titre.textContent = a.dataset.titre;
      champs.desc.textContent = a.dataset.desc;
      champs.date.textContent = a.dataset.date;
      champs.href.setAttribute('href', a.getAttribute('href'));
    }

    document.querySelectorAll('.astre[data-slug], .tick[data-slug]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { activer(el.dataset.slug); });
      el.addEventListener('focus', function () { activer(el.dataset.slug); });
    });
    activer(astres['choragos-kora'] ? 'choragos-kora' : Object.keys(astres)[0]);
  }

  // ─────────────────────────────────────────
  // LIRE — filtre par orbite (onglets texte)
  // ─────────────────────────────────────────

  function initFiltreOrbites() {
    var bar = document.getElementById('onglets');
    if (!bar) return;
    var tabs = bar.querySelectorAll('.onglet');
    var lignes = document.querySelectorAll('#lignes .ligne');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var o = tab.dataset.orbit;
        tabs.forEach(function (t) { t.setAttribute('aria-pressed', t === tab ? 'true' : 'false'); });
        lignes.forEach(function (l) { l.hidden = !(o === 'all' || l.dataset.orbit === o); });
      });
    });
  }

  // ─────────────────────────────────────────
  // ARTICLE — taille du texte (A− / A+)
  // ─────────────────────────────────────────
  // 16 → 23 px, pas de 1 ; enregistrée dans localStorage.readingSize et
  // appliquée en variable CSS --reading-size.

  function initTailleLecture() {
    var moins = document.getElementById('fsMoins');
    var plus = document.getElementById('fsPlus');
    var valeur = document.getElementById('fsValeur');
    if (!moins || !plus) return;
    var taille = 19;
    try {
      var lu = parseInt(localStorage.getItem('readingSize'), 10);
      if (lu >= 16 && lu <= 23) taille = lu;
    } catch (e) { /* stockage indisponible : 19 px */ }
    function appliquer() {
      document.documentElement.style.setProperty('--reading-size', taille + 'px');
      if (valeur) valeur.textContent = taille + ' px';
      moins.disabled = taille <= 16;
      plus.disabled = taille >= 23;
    }
    function changer(d) {
      taille = Math.max(16, Math.min(23, taille + d));
      try { localStorage.setItem('readingSize', String(taille)); } catch (e) { /* rien */ }
      appliquer();
    }
    moins.addEventListener('click', function () { changer(-1); });
    plus.addEventListener('click', function () { changer(1); });
    appliquer();
  }

  // ─────────────────────────────────────────
  // ARTICLE — intertitres de partie et barre d'instrument
  // ─────────────────────────────────────────
  // Chaque .chapter-divider reçoit une orbe en fond (cx .78, r .26). Son humeur :
  // data-mood si le texte la pose, sinon une rotation. La barre d'instrument dit la
  // section courante (les `sections` du front matter, par leur id), le temps de
  // lecture restant (minutes × part non lue) et prend l'humeur de la partie.

  var HUMEURS = ['search', 'rest', 'speak', 'cold'];

  function initIntertitres() {
    var dividers = document.querySelectorAll('.art-texte .chapter-divider');
    dividers.forEach(function (d, i) {
      var mood = d.getAttribute('data-mood') || HUMEURS[i % HUMEURS.length];
      d.setAttribute('data-orb-mood', mood);
      var cv = document.createElement('canvas');
      cv.setAttribute('data-orb', '1');
      cv.setAttribute('data-cx', '.78');
      cv.setAttribute('data-cy', '.5');
      cv.setAttribute('data-r', '.26');
      cv.setAttribute('data-mood', mood);
      cv.setAttribute('data-count', '1600');
      cv.setAttribute('aria-hidden', 'true');
      d.insertBefore(cv, d.firstChild);
    });
    if (dividers.length && window.KoraOrb) window.KoraOrb.mount(document);
  }

  function initInstrument() {
    var texte = document.getElementById('artTexte');
    var section = document.getElementById('instSection');
    var reste = document.getElementById('instReste');
    var orbe = document.getElementById('instOrbe');
    if (!texte || !section || !reste) return;
    var minutes = parseInt(texte.getAttribute('data-minutes'), 10) || 0;
    var titre = texte.getAttribute('data-titre') || '';
    var reperes = [];
    texte.querySelectorAll('section[id], .chapter-divider[id]').forEach(function (el) {
      var h = el.querySelector('h2');
      reperes.push({ el: el, nom: h ? h.textContent.trim() : '' });
    });
    var dividers = texte.querySelectorAll('.chapter-divider');
    var moodCourant = 'rest';
    var ticking = false;

    function maj() {
      ticking = false;
      var r = texte.getBoundingClientRect();
      var lu = Math.min(1, Math.max(0, (window.innerHeight * 0.4 - r.top) / Math.max(1, r.height)));
      var n = Math.ceil(minutes * (1 - lu));
      reste.textContent = n > 0 ? n + ' min' : 'fin';
      var nom = titre;
      reperes.forEach(function (p) { if (p.nom && p.el.getBoundingClientRect().top <= 120) nom = p.nom; });
      if (section.textContent !== nom) section.textContent = nom;
      var mood = 'rest';
      dividers.forEach(function (d) { if (d.getBoundingClientRect().top <= window.innerHeight * 0.5) mood = d.getAttribute('data-orb-mood') || mood; });
      if (mood !== moodCourant && orbe && window.KoraOrb) { moodCourant = mood; window.KoraOrb.setMood(orbe, mood); }
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(maj); }
    }, { passive: true });
    maj();
  }

  // stat-shift en barres : largeur proportionnelle à la plus grande valeur
  function initStatShift() {
    document.querySelectorAll('.art-texte .stat-shift').forEach(function (bloc) {
      var vals = [];
      bloc.querySelectorAll('.stat-shift__value').forEach(function (v) {
        var n = parseFloat(v.textContent.replace(/[\s  ]/g, '').replace(',', '.').replace(/[^0-9.\-]/g, ''));
        vals.push({ el: v, n: isNaN(n) ? 0 : n });
      });
      var max = vals.reduce(function (m, x) { return Math.max(m, x.n); }, 0);
      if (!max) return;
      vals.forEach(function (x) { x.el.style.setProperty('--w', (x.n / max * 100).toFixed(1) + '%'); });
    });
  }

  // ─────────────────────────────────────────
  // PAGE RAIL (accueil)
  // ─────────────────────────────────────────
  // Ancres sticky + barre de progression. Auto-détecte .page-rail.

  function initPageRail() {
    var rail = document.querySelector('.page-rail');
    if (!rail) return;

    var links = rail.querySelectorAll('a[href^="#"]');
    var bar = document.getElementById('pageRailProgress');
    var ids = [];
    links.forEach(function (link) {
      var id = (link.getAttribute('href') || '').slice(1);
      if (id) ids.push(id);
    });

    var ticking = false;
    function update() {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      if (bar && max > 0) {
        bar.style.width = Math.min(100, (window.scrollY / max) * 100) + '%';
      }

      var current = ids[0] || '';
      var offset = 140;
      ids.forEach(function (id) {
        var section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= offset) {
          current = id;
        }
      });

      links.forEach(function (link) {
        var on = link.getAttribute('href') === '#' + current;
        if (on) link.classList.add('is-active');
        else link.classList.remove('is-active');
      });
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  // ─────────────────────────────────────────
  // KATEX (accueil — bloc équation)
  // ─────────────────────────────────────────

  function initKatex() {
    var el = document.getElementById('eq-katex');
    if (!el) return;

    function render() {
      if (typeof katex === 'undefined') return;
      katex.render('E_{T} = \\dfrac{O(S) \\cdot \\Delta(S)}{P(S) + R(S)}', el, {
        displayMode: true,
        throwOnError: false
      });
    }

    if (typeof katex !== 'undefined') render();
    else window.addEventListener('load', render);
  }

  // ─────────────────────────────────────────
  // VIDEO EMBED (thumbnail → lecture)
  // ─────────────────────────────────────────

  function initMediaEmbed() {
    var wrap = document.querySelector('.media-embed[data-video-src]');
    if (!wrap) return;
    var btn = wrap.querySelector('.media-embed__play');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var src = wrap.getAttribute('data-video-src');
      if (!src) return;
      var video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute('preload', 'metadata');
      wrap.replaceChildren(video);
    });
  }

  // ─────────────────────────────────────────
  // INITIALISATION
  // ─────────────────────────────────────────

  var nav = initMobileNav();
  initTocToggle();
  initNavLinkBehavior(nav);
  initActiveNav();
  initProgressBar();
  initPageRail();
  initKatex();
  initMediaEmbed();
  initScrollReveal();
  initDataVizAnimation();
  initHeroParallax();
  initImageZoom();
  initStage();
  initAstres();
  initFiltreOrbites();
  initTailleLecture();
  initIntertitres();
  initInstrument();
  initStatShift();
})();
