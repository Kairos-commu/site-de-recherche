// ============================================
// PARTAGE.JS — Partager un article (27/10)
// ============================================
// Chargé par layouts/article.njk (extraJs). Ouvre le dialogue #partage
// (partials/partage.njk) : copier le lien, dessiner une story Instagram
// (canvas 1080 × 1920, téléchargée — rien n'est publié d'ici), montrer et
// copier la carte HTML à intégrer sur un autre site.

(function () {
  'use strict';

  var dlg = document.getElementById('partage');
  if (!dlg || typeof dlg.showModal !== 'function') return;

  var statut = dlg.querySelector('.partage__statut');
  var d = dlg.dataset;

  // Sans JS, les boutons restent cachés : ils n'apparaissent qu'ici.
  document.querySelectorAll('[data-partage-ouvrir]').forEach(function (b) {
    b.hidden = false;
    var bloc = b.closest('.art-partage');
    if (bloc) bloc.hidden = false;
    b.addEventListener('click', function () {
      statut.textContent = '';
      dlg.showModal();
    });
  });

  dlg.querySelector('[data-partage-fermer]').addEventListener('click', function () { dlg.close(); });
  // Un clic sur le fond (hors de la boîte) ferme.
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  // ─────────────────────────────────────────
  // ONGLETS (flèches, Début, Fin)
  // ─────────────────────────────────────────

  var onglets = Array.prototype.slice.call(dlg.querySelectorAll('[role="tab"]'));

  function choisir(onglet, focus) {
    onglets.forEach(function (o) {
      var actif = o === onglet;
      o.setAttribute('aria-selected', actif ? 'true' : 'false');
      o.tabIndex = actif ? 0 : -1;
      document.getElementById(o.getAttribute('aria-controls')).hidden = !actif;
    });
    if (focus) onglet.focus();
    statut.textContent = '';
    if (onglet.id === 'pOngletStory') dessinerStory();
    if (onglet.id === 'pOngletCarte') montrerCarte();
  }

  onglets.forEach(function (o, i) {
    o.addEventListener('click', function () { choisir(o, false); });
    o.addEventListener('keydown', function (e) {
      var n = onglets.length, j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % n;
      else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = n - 1;
      if (j === null) return;
      e.preventDefault();
      choisir(onglets[j], true);
    });
  });

  // ─────────────────────────────────────────
  // COPIER (lien, code de la carte)
  // ─────────────────────────────────────────

  function copier(champ, message) {
    function repli() {
      champ.focus();
      champ.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      statut.textContent = ok ? message : 'Copie impossible ici : le texte est sélectionné, Ctrl+C (ou ⌘C) le copie.';
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(champ.value).then(function () { statut.textContent = message; }, repli);
    } else {
      repli();
    }
  }

  dlg.querySelectorAll('[data-partage-copier]').forEach(function (b) {
    b.addEventListener('click', function () {
      var id = b.getAttribute('data-partage-copier');
      copier(document.getElementById(id), id === 'pCarteCode' ? 'Code copié.' : 'Lien copié.');
    });
  });

  // ─────────────────────────────────────────
  // CARTE À INTÉGRER — aperçu
  // ─────────────────────────────────────────
  // Le modèle est le même HTML que le code copié. Dans l'aperçu, l'image passe
  // par son chemin local : la CSP (img-src 'self') bloquerait l'URL absolue
  // hors du domaine de production.

  var carteMontree = false;
  function montrerCarte() {
    if (carteMontree) return;
    carteMontree = true;
    var modele = document.getElementById('pCarteModele');
    var apercu = document.getElementById('pCarteApercu');
    var copie = modele.content.cloneNode(true);
    var img = copie.querySelector('img');
    if (img) img.src = d.image;
    apercu.appendChild(copie);
  }

  // ─────────────────────────────────────────
  // STORY INSTAGRAM — canvas 1080 × 1920
  // ─────────────────────────────────────────
  // Haut et bas (≈ 250 px) laissés à l'interface d'Instagram ; le titre se pose
  // sous l'image, en Cormorant comme sur le site.

  var canvas = document.getElementById('pStoryCanvas');
  var btnTelecharger = document.getElementById('pStoryTelecharger');
  var btnEnvoyer = document.getElementById('pStoryEnvoyer');
  var W = 1080, H = 1920, MARGE = 96;
  var storyBlob = null;
  var storyEnCours = null;

  function chargerImage(src) {
    return new Promise(function (ok) {
      var img = new Image();
      img.onload = function () { ok(img); };
      img.onerror = function () { ok(null); };
      img.src = src;
    });
  }

  function chargerPolices() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    return Promise.all([
      document.fonts.load('400 100px "Cormorant Garamond"'),
      document.fonts.load('400 30px "IBM Plex Mono"'),
      document.fonts.load('400 34px "Instrument Sans"')
    ]).catch(function () {});
  }

  function couper(ctx, texte, largeur) {
    var mots = texte.split(/\s+/), lignes = [], ligne = '';
    mots.forEach(function (m) {
      var essai = ligne ? ligne + ' ' + m : m;
      if (ligne && ctx.measureText(essai).width > largeur) { lignes.push(ligne); ligne = m; }
      else ligne = essai;
    });
    if (ligne) lignes.push(ligne);
    return lignes;
  }

  function espacer(ctx, px) { if ('letterSpacing' in ctx) ctx.letterSpacing = px + 'px'; }

  function dessiner(img) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#05070B';
    ctx.fillRect(0, 0, W, H);

    // Image en haut, recadrée pour couvrir 1080 × 1240, fondue dans le noir.
    var hImg = 1240;
    if (img) {
      var s = Math.max(W / img.naturalWidth, hImg / img.naturalHeight);
      var w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (W - w) / 2, (hImg - h) / 2, w, h);
    } else {
      var halo = ctx.createRadialGradient(W * 0.62, 560, 20, W * 0.62, 560, 620);
      halo.addColorStop(0, 'rgba(111, 201, 228, .35)');
      halo.addColorStop(1, 'rgba(5, 7, 11, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, W, hImg);
    }
    var voile = ctx.createLinearGradient(0, 0, 0, hImg);
    voile.addColorStop(0, 'rgba(5, 7, 11, .55)');
    voile.addColorStop(0.22, 'rgba(5, 7, 11, .05)');
    voile.addColorStop(0.6, 'rgba(5, 7, 11, .2)');
    voile.addColorStop(1, '#05070B');
    ctx.fillStyle = voile;
    ctx.fillRect(0, 0, W, hImg);

    ctx.textBaseline = 'alphabetic';

    // Titre : la taille descend jusqu'à tenir en cinq lignes.
    var taille = 112, lignes;
    do {
      ctx.font = '400 ' + taille + 'px "Cormorant Garamond", Georgia, serif';
      lignes = couper(ctx, d.titre, W - 2 * MARGE);
      taille -= 6;
    } while (lignes.length > 5 && taille > 60);
    taille += 6;
    var interligne = Math.round(taille * 1.04);
    var bas = 1500;
    var y = Math.max(1120, bas - (lignes.length - 1) * interligne);
    // Nom du site au-dessus du titre, dans le noir : les illustrations portent
    // parfois leur propre texte en haut.
    ctx.fillStyle = '#E9A544';
    ctx.font = '400 30px "IBM Plex Mono", ui-monospace, monospace';
    espacer(ctx, 5);
    ctx.fillText(d.site.toUpperCase(), MARGE, y - taille - 36);
    espacer(ctx, 0);
    ctx.font = '400 ' + taille + 'px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#EEF2F8';
    lignes.forEach(function (l, i) { ctx.fillText(l, MARGE, y + i * interligne); });
    y += (lignes.length - 1) * interligne;

    // Filet ambre et auteur ; le bas reste libre pour le sticker « Lien ».
    ctx.fillStyle = '#E9A544';
    ctx.fillRect(MARGE, y + 56, 120, 3);
    ctx.fillStyle = '#C2CCDA';
    ctx.font = '400 36px "Instrument Sans", system-ui, sans-serif';
    ctx.fillText(d.auteur, MARGE, y + 124);
  }

  function dessinerStory() {
    if (storyEnCours) return storyEnCours;
    storyEnCours = Promise.all([chargerImage(d.image), chargerPolices()]).then(function (r) {
      dessiner(r[0]);
      return new Promise(function (ok) { canvas.toBlob(ok, 'image/jpeg', 0.92); });
    }).then(function (blob) {
      storyBlob = blob;
      if (!blob) { statut.textContent = 'Le visuel n’a pas pu être préparé dans ce navigateur.'; return; }
      btnTelecharger.disabled = false;
      var f = fichier();
      if (navigator.canShare && navigator.canShare({ files: [f] })) btnEnvoyer.hidden = false;
    });
    return storyEnCours;
  }

  function fichier() {
    return new File([storyBlob], 'story-' + d.slug + '.jpg', { type: 'image/jpeg' });
  }

  btnTelecharger.addEventListener('click', function () {
    if (!storyBlob) return;
    var url = URL.createObjectURL(storyBlob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'story-' + d.slug + '.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    statut.textContent = 'Image téléchargée.';
  });

  // Feuille de partage du téléphone (si elle accepte les fichiers) : c'est
  // l'utilisateur qui choisit l'app et qui publie.
  btnEnvoyer.addEventListener('click', function () {
    if (!storyBlob) return;
    navigator.share({ files: [fichier()], title: d.titre }).catch(function () {});
  });
})();
