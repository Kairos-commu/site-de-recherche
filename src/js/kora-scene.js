// ============================================
// KORA-SCENE.JS — Kora, peau et structure ; l'étincelle actrice ; la page calme
// ============================================
// 1. Kora (figure[data-kr-kora]) : un canvas alterne deux corps.
//    - peau, d'après la Kora « seule » de Choragos (palette du rendu de production,
//      orb-look.ts DEFAULT_LOOK du 10/10) : un globe de verre ambré éclairé de
//      l'intérieur, une constellation de points dorés reliés par des traits fins, un
//      reflet en haut à gauche, des arcs d'orbite inclinés (pleins ou pointillés), des
//      filaments ramifiés roses et turquoise, de la poussière dorée ;
//    - structure : la même Kora en glyphes ambrés ; le texte de sa matière (un extrait
//      Rust réel de Choragos, écrit dans la page en <pre class="kr-matiere">) remplit
//      la sphère dans l'ordre de lecture et défile lentement ; les filaments deviennent
//      des traînées de caractères.
//    Passage par un balayage (ligne de scan), cycle d'environ 13 s ; survol ou toucher
//    forcent la structure. Une seule boucle rAF, en pause hors écran ou onglet caché.
//    Le décor fixe (halo, poussière, filaments) est dessiné une fois par taille ; les
//    glyphes viennent d'un atlas : pas de rendu de texte par image.
// 2. Mise au point au défilement et comptes de 0 à la vraie valeur (data-compte).
// Sans JS : l'orbe de repli en CSS. Mouvement réduit : une image fixe mi-peau
// mi-structure, dessinée une fois ; ni cycle, ni mise au point, ni comptes.

(function () {
  'use strict';

  var calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IO = 'IntersectionObserver' in window;
  var TAU = Math.PI * 2;
  var koras = [];

  // tirage à graine fixe : la même Kora à chaque chargement
  function graine(s) {
    return function () {
      s |= 0; s = s + 0x6D2B79F5 | 0;
      var t = Math.imul(s ^ s >>> 15, 1 | s);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function creerKora(fig) {
    // l'étincelle (data-compagne) n'a ni corps 2D ni matière : elle est dessinée à part (1 bis)
    if (fig.hasAttribute('data-compagne')) {
      return { fig: fig, cv: fig.querySelector('canvas'), compagne: true, enScene: false, visible: false, W: 0, boost: 0 };
    }
    var cv = fig.querySelector('.kr-kora__canvas');
    var ctx = cv && cv.getContext('2d');
    if (!ctx) return null;
    // la compagne n'a pas de matière propre : elle emprunte celle de la page
    var pre = fig.querySelector('.kr-matiere') || document.querySelector('.kr-matiere');
    var texte = (pre ? pre.textContent : '').replace(/\s+/g, ' ').trim();
    if (!texte) return null;

    var k = {
      fig: fig, cv: cv, ctx: ctx, texte: texte,
      compagne: fig.hasAttribute('data-compagne'), enScene: false,
      temps: 0, boost: 0,
      W: 0, H: 0, dpr: 1, R: 0, cx: 0, cy: 0,
      atlas: null, cw: 0, chH: 0, uniques: '', indexDe: {},
      decorPeau: null, decorStructure: null, traines: [],
      visible: true, force: false,
      mode: 'peau', depuis: 0, scan: null,
      couts: []
    };
    cv.koraCouts = k.couts; // lu par le banc de mesure

    var alea = graine(10101);
    // la constellation intérieure : des points dans la boule, reliés à leurs voisins
    var N = 320, pts = new Float32Array(N * 3);
    for (var i = 0; i < N; i++) {
      var u = alea() * 2 - 1, th = alea() * TAU, rr = Math.cbrt(alea()) * 0.9, s = Math.sqrt(1 - u * u);
      pts[i * 3] = Math.cos(th) * s * rr; pts[i * 3 + 1] = u * rr; pts[i * 3 + 2] = Math.sin(th) * s * rr;
    }
    var liens = [], deg = new Uint8Array(N);
    for (var a = 0; a < N; a++) {
      for (var b = a + 1; b < N; b++) {
        if (deg[a] > 2 || deg[b] > 2) continue;
        var dx = pts[a * 3] - pts[b * 3], dy = pts[a * 3 + 1] - pts[b * 3 + 1], dz = pts[a * 3 + 2] - pts[b * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < 0.05) { liens.push(a, b); deg[a]++; deg[b]++; }
      }
    }
    k.pts = pts; k.liens = liens;

    // les arcs d'orbite : des grands cercles inclinés, partiels, certains pointillés
    k.arcs = [];
    for (var j = 0; j < 19; j++) {
      var nx = alea() * 2 - 1, ny = alea() * 2 - 1, nz = alea() * 2 - 1, nn = Math.hypot(nx, ny, nz) || 1;
      nx /= nn; ny /= nn; nz /= nn;
      var ux = -ny, uy = nx, uz = 0, un = Math.hypot(ux, uy) || 1; ux /= un; uy /= un;
      k.arcs.push({
        u: [ux, uy, uz], v: [ny * uz - nz * uy, nz * ux - nx * uz, nx * uy - ny * ux],
        r: 1.01 + alea() * 0.2, a0: alea() * TAU, long: Math.PI * (0.4 + alea() * 1.2),
        vit: (alea() < 0.5 ? -1 : 1) * (0.05 + alea() * 0.12), pointille: alea() < 0.3, epais: 0.7 + alea() * alea() * 2.2
      });
    }
    k.alea = graine(4242);

    // caractères distincts de la matière (l'espace compris, jamais dessinée)
    var vus = {};
    for (var c = 0; c < texte.length; c++) {
      if (!Object.prototype.hasOwnProperty.call(vus, texte[c])) { vus[texte[c]] = k.uniques.length; k.uniques += texte[c]; }
    }
    k.indexDe = vus;

    dimensionner(k);
    if ('ResizeObserver' in window) new ResizeObserver(function () { dimensionner(k); if (calme) dessinerFixe(k); }).observe(cv);

    if (k.compagne) { k.force = true; fig.classList.add('is-vivante'); if (calme) dessinerFixe(k); return k; }

    fig.addEventListener('pointerenter', function (ev) { if (ev.pointerType === 'mouse') { k.force = true; vers(k, 'structure'); } });
    fig.addEventListener('pointerleave', function (ev) { if (ev.pointerType === 'mouse') { k.force = false; k.depuis = performance.now(); } });
    fig.addEventListener('pointerup', function (ev) {
      if (ev.pointerType === 'mouse') return;
      k.force = !k.force;
      vers(k, k.force ? 'structure' : 'peau');
    });

    fig.classList.add('is-vivante');
    if (calme) dessinerFixe(k);
    return k;
  }

  function dimensionner(k) {
    var r = k.cv.getBoundingClientRect();
    if (!r.width) return;
    k.dpr = Math.min(window.devicePixelRatio || 1, 2);
    k.W = k.cv.width = Math.round(r.width * k.dpr);
    k.H = k.cv.height = Math.round(r.height * k.dpr);
    k.cx = k.W / 2; k.cy = k.H / 2;
    k.R = Math.min(k.W, k.H) * (k.compagne ? 0.36 : 0.3);
    var c = k.ctx, R = k.R, cx = k.cx, cy = k.cy;
    // le verre ambré, éclairé de l'intérieur ; le limbe s'assombrit puis le liseré le rallume
    k.verre = c.createRadialGradient(cx - R * 0.18, cy - R * 0.22, R * 0.05, cx, cy, R);
    k.verre.addColorStop(0, 'rgba(250,196,124,0.96)');
    k.verre.addColorStop(0.36, 'rgba(222,138,56,0.94)');
    k.verre.addColorStop(0.72, 'rgba(156,78,24,0.94)');
    k.verre.addColorStop(0.94, 'rgba(84,38,10,0.96)');
    k.verre.addColorStop(1, 'rgba(176,92,34,0.95)');
    k.liserePeau = c.createRadialGradient(cx, cy, R * 0.84, cx, cy, R * 1.03);
    k.liserePeau.addColorStop(0, 'rgba(255,190,110,0)');
    k.liserePeau.addColorStop(0.8, 'rgba(255,196,120,0.32)');
    k.liserePeau.addColorStop(1, 'rgba(255,196,120,0)');
    k.coeur = c.createRadialGradient(cx + R * 0.04, cy + R * 0.06, 0, cx + R * 0.04, cy + R * 0.06, R * 0.6);
    k.coeur.addColorStop(0, 'rgba(255,236,200,0.3)');
    k.coeur.addColorStop(1, 'rgba(255,200,130,0)');
    k.ombreStructure = c.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.05);
    k.ombreStructure.addColorStop(0, 'rgba(60,30,10,0.55)');
    k.ombreStructure.addColorStop(1, 'rgba(14,11,9,0.2)');
    construireAtlas(k);
    construireDecor(k);
    if (k.gpu) k.gpu.redimensionner();
  }

  // l'atlas : chaque caractère à 8 niveaux d'ambre, puis en rose, turquoise et or (les traînées)
  var NIV = 8, RANGS = NIV + 3;
  function construireAtlas(k) {
    // la compagne est petite : ses glyphes descendent sous le seuil de lecture et font texture
    var taille = Math.max(k.compagne ? 5 : 9, Math.round(k.R / 12.5));
    k.cw = Math.round(taille * 0.61);
    k.chH = Math.round(taille * 1.14);
    var a = document.createElement('canvas');
    a.width = k.uniques.length * k.cw;
    a.height = RANGS * k.chH;
    var g = a.getContext('2d');
    g.font = '500 ' + taille + 'px "IBM Plex Mono", ui-monospace, monospace';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    var teintes = [];
    for (var n = 0; n < NIV; n++) {
      var t = (n + 1) / NIV;
      // de l'ambre sombre (#8a5522) à l'ivoire (#ffe9c4) : la lumière fait la densité
      teintes.push('rgba(' + Math.round(120 + 135 * t) + ',' + Math.round(62 + 171 * t * t) + ',' + Math.round(22 + 174 * t * t * t) + ',' + (0.4 + 0.6 * t).toFixed(2) + ')');
    }
    teintes.push('rgba(226,92,164,0.78)', 'rgba(70,196,190,0.78)', 'rgba(232,176,92,0.78)');
    for (var r = 0; r < RANGS; r++) {
      g.fillStyle = teintes[r];
      for (var i = 0; i < k.uniques.length; i++) g.fillText(k.uniques[i], i * k.cw + k.cw / 2, r * k.chH + k.chH / 2);
    }
    k.atlas = a;
  }

  // le décor fixe : halo chaud, poussière dorée, filaments ramifiés (dessinés une fois par taille)
  function construireDecor(k) {
    var W = k.W, H = k.H, R = k.R, cx = k.cx, cy = k.cy, s = k.dpr, alea = graine(777);
    function toile() { var t = document.createElement('canvas'); t.width = W; t.height = H; return t; }
    var p = toile(), st = toile(), gp = p.getContext('2d'), gs = st.getContext('2d');

    var halo = gp.createRadialGradient(cx, cy, R * 0.8, cx, cy, Math.min(W, H) * 0.49);
    halo.addColorStop(0, 'rgba(255,170,80,0.18)');
    halo.addColorStop(0.5, 'rgba(255,150,60,0.05)');
    halo.addColorStop(1, 'rgba(255,150,60,0)');
    gp.fillStyle = halo; gp.fillRect(0, 0, W, H);
    gs.globalAlpha = 0.6; gs.fillStyle = halo; gs.fillRect(0, 0, W, H); gs.globalAlpha = 1;

    // poussière dorée, en nuées
    for (var n = 0; n < 6; n++) {
      var ang = alea() * TAU, d = R * (1.3 + alea() * 0.35), ox = cx + Math.cos(ang) * d, oy = cy + Math.sin(ang) * d;
      for (var m = 0; m < 46; m++) {
        var px = ox + (alea() - 0.5) * R * 0.5, py = oy + (alea() - 0.5) * R * 0.35, a = 0.15 + alea() * 0.45, z = (0.6 + alea()) * s;
        gp.fillStyle = gs.fillStyle = 'rgba(240,190,110,' + a.toFixed(2) + ')';
        gp.fillRect(px, py, z, z); gs.fillRect(px, py, z, z);
      }
    }

    // filaments : un tronc qui part du globe vers le bord, des dendrites au bout et en chemin
    var couleurs = [[226, 92, 164, 8], [70, 196, 190, 9], [226, 92, 164, 8], [232, 176, 92, 10], [70, 196, 190, 9], [226, 92, 164, 8], [70, 196, 190, 9]];
    k.traines = [];
    var pas = k.cw * 1.15;
    function trait(x0, y0, x1, y1, col, alpha, rang, tronc) {
      gp.strokeStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + alpha + ')';
      gp.beginPath(); gp.moveTo(x0, y0); gp.lineTo(x1, y1); gp.stroke();
      // échantillons pour la traînée de caractères de la structure
      if (!tronc) return;
      var l = Math.hypot(x1 - x0, y1 - y0);
      for (var q = 0; q < l; q += pas) k.traines.push(x0 + (x1 - x0) * q / l, y0 + (y1 - y0) * q / l, rang);
    }
    function dendrite(x, y, dir, long, prof, col) {
      var nb = 3 + Math.floor(alea() * 3);
      for (var b = 0; b < nb; b++) {
        var d2 = dir + (alea() - 0.5) * 2.2, l2 = long * (0.4 + alea() * 0.6);
        var x2 = x + Math.cos(d2) * l2, y2 = y + Math.sin(d2) * l2;
        gp.lineWidth = Math.max(0.6, 1.1 - prof * 0.3) * s;
        trait(x, y, x2, y2, col, (0.5 - prof * 0.15).toFixed(2), col[3]);
        if (prof < 2 && alea() < 0.7) dendrite(x2, y2, d2, l2 * 0.6, prof + 1, col);
      }
    }
    for (var f = 0; f < couleurs.length; f++) {
      var col = couleurs[f], dir = f / couleurs.length * TAU + alea() * 0.6;
      var x = cx + Math.cos(dir) * R * 1.02, y = cy + Math.sin(dir) * R * 1.02;
      var but = Math.min(W, H) * (0.4 + alea() * 0.08), segs = 9;
      gp.lineWidth = 1.1 * s;
      for (var g = 0; g < segs; g++) {
        dir += (alea() - 0.5) * 0.35;
        var lg = (but - R) / segs, x2 = x + Math.cos(dir) * lg, y2 = y + Math.sin(dir) * lg;
        trait(x, y, x2, y2, col, 0.5, col[3], true);
        if (g === 4 && alea() < 0.8) dendrite(x2, y2, dir, R * 0.18, 1, col);
        x = x2; y = y2;
      }
      dendrite(x, y, dir, R * 0.28, 0, col);
    }
    k.decorPeau = p; k.decorStructure = st;
  }

  // la rotation commune : lente, autour d'un axe légèrement incliné
  function tourner(t) { var a = t * 0.11; return { ca: Math.cos(a), sa: Math.sin(a), ct: Math.cos(0.3), st: Math.sin(0.3) }; }

  function arcs(k, t, R, structure) {
    var c = k.ctx, cx = k.cx, cy = k.cy, s = k.dpr;
    var nArcs = k.compagne ? 7 : k.arcs.length;
    for (var i = 0; i < nArcs; i++) {
      var A = k.arcs[i], deb = A.a0 + t * A.vit, n = 40, run = -1;
      c.lineWidth = (k.compagne ? Math.max(1.3, A.epais) : A.epais) * s;
      c.setLineDash(A.pointille || structure ? [3 * s, 5 * s] : []);
      var px0 = 0, py0 = 0, devant0 = true;
      for (var q = 0; q <= n; q++) {
        var th = deb + A.long * q / n, co = Math.cos(th), si = Math.sin(th);
        var x = A.r * (A.u[0] * co + A.v[0] * si), y = A.r * (A.u[1] * co + A.v[1] * si), z = A.r * (A.u[2] * co + A.v[2] * si);
        var devant = z > -0.1 || (x * x + y * y > 1);
        if (q > 0) {
          if (run === -1 || devant !== devant0) {
            if (run !== -1) c.stroke();
            c.beginPath(); c.moveTo(px0, py0); run = 1;
            var bord = Math.min(1, Math.min(q, n - q) / 6);
            c.strokeStyle = structure
              ? 'rgba(233,165,68,' + (devant ? 0.45 : 0.12) * bord + ')'
              : 'rgba(255,233,196,' + (devant ? 0.9 : 0.16) * bord + ')';
          }
          c.lineTo(cx + x * R, cy + y * R);
        }
        px0 = cx + x * R; py0 = cy + y * R; devant0 = devant;
      }
      if (run !== -1) c.stroke();
    }
    c.setLineDash([]);
  }

  function peau(k, t) {
    var c = k.ctx, R = k.R * (1 + 0.01 * Math.sin(t * TAU / 5.5)), cx = k.cx, cy = k.cy, s = k.dpr;
    // en petit (l'actrice), les filaments et la poussière deviennent du bruit : un halo seul
    if (k.compagne) {
      var hl = c.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.55);
      hl.addColorStop(0, 'rgba(255,170,80,0.22)'); hl.addColorStop(1, 'rgba(255,150,60,0)');
      c.fillStyle = hl; c.fillRect(0, 0, k.W, k.H);
    } else {
      c.drawImage(k.decorPeau, 0, 0);
    }
    if (k.gpu) return; // le globe, la constellation et les arcs viennent du rendu WebGPU (kora-orbe-gpu.js)
    c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fillStyle = k.verre; c.fill();

    // la constellation intérieure, en lumière additive
    var rt = tourner(t), p = k.pts, n = p.length / 3;
    if (!k.X) { k.X = new Float32Array(n); k.Y = new Float32Array(n); k.Z = new Float32Array(n); }
    var X = k.X, Y = k.Y, Z = k.Z;
    for (var i = 0; i < n; i++) {
      var x = p[i * 3], y = p[i * 3 + 1], z = p[i * 3 + 2];
      var x1 = x * rt.ca + z * rt.sa, z1 = -x * rt.sa + z * rt.ca;
      X[i] = cx + x1 * R; Y[i] = cy + (y * rt.ct - z1 * rt.st) * R; Z[i] = y * rt.st + z1 * rt.ct;
    }
    c.save();
    c.globalCompositeOperation = 'lighter';
    c.fillStyle = k.coeur; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill();
    var L = k.liens;
    for (var pass = 0; pass < 3; pass++) {
      c.beginPath();
      for (var l = 0; l < L.length; l += 2) {
        var zz = (Z[L[l]] + Z[L[l + 1]]) / 2, cl = zz > 0.3 ? 2 : zz > -0.3 ? 1 : 0;
        if (cl !== pass) continue;
        c.moveTo(X[L[l]], Y[L[l]]); c.lineTo(X[L[l + 1]], Y[L[l + 1]]);
      }
      c.strokeStyle = 'rgba(255,226,170,' + (k.compagne ? [0.05, 0.1, 0.22] : [0.1, 0.22, 0.42])[pass] + ')';
      c.lineWidth = 0.7 * s; c.stroke();
    }
    for (var j = 0; j < n; j++) {
      var a = (0.3 + 0.7 * (Z[j] + 1) / 2) * (k.compagne ? 0.55 : 1), z2 = (0.7 + 1.1 * (Z[j] + 1) / 2) * s;
      c.fillStyle = 'rgba(255,240,205,' + a.toFixed(2) + ')';
      c.fillRect(X[j] - z2 / 2, Y[j] - z2 / 2, z2, z2);
    }
    c.restore();

    // liseré, reflets, arcs
    c.fillStyle = k.liserePeau; c.beginPath(); c.arc(cx, cy, R * 1.03, 0, TAU); c.fill();
    reflet(c, cx - R * 0.42, cy - R * 0.5, R * 0.2, R * 0.1, -0.62, 'rgba(236,226,255,0.62)');
    reflet(c, cx + R * 0.4, cy + R * 0.33, R * 0.08, R * 0.05, -0.5, 'rgba(220,210,255,0.22)');
    arcs(k, t, R, false);
  }

  function reflet(c, x, y, rx, ry, rot, couleur) {
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(1, ry / rx);
    var g = c.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, couleur); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, rx, 0, TAU); c.fill(); c.restore();
  }

  function structure(k, t) {
    var c = k.ctx, R = k.R * (1 + 0.01 * Math.sin(t * TAU / 5.5)), cx = k.cx, cy = k.cy;
    var cw = k.cw, chH = k.chH, at = k.atlas, txt = k.texte, idx = k.indexDe, L = txt.length;
    c.drawImage(k.decorStructure, 0, 0);
    c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fillStyle = k.ombreStructure; c.fill();
    // le texte remplit la sphère dans l'ordre de lecture, et défile d'un caractère toutes les 0,3 s
    var pos = Math.floor(t / 0.3) % L;
    var lignes = Math.floor(2 * R / chH), y0 = cy - lignes * chH / 2;
    for (var r = 0; r < lignes; r++) {
      var py = y0 + (r + 0.5) * chH, dy = (py - cy) / R, demi = Math.sqrt(Math.max(0, 1 - dy * dy)) * R;
      var nb = Math.floor(2 * demi / cw), x0 = cx - nb * cw / 2;
      for (var q = 0; q < nb; q++) {
        var ch = txt[pos]; pos = pos + 1 === L ? 0 : pos + 1;
        if (ch === ' ') continue;
        var px = x0 + (q + 0.5) * cw, dx = (px - cx) / R, dz = Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy));
        var b = 0.2 + 0.8 * Math.max(0, dx * -0.42 + dy * -0.5 + dz * 0.76);
        var lvl = Math.min(NIV - 1, Math.floor(b * (0.6 + 0.4 * dz) * NIV * 1.08));
        c.drawImage(at, idx[ch] * cw, lvl * chH, cw, chH, px - cw / 2, py - chH / 2, cw, chH);
      }
    }
    // les filaments, en traînées de caractères
    var T = k.traines, p2 = Math.floor(t / 0.3);
    for (var i = 0; i < T.length; i += 3) {
      var ch2 = txt[(p2 + i / 3) % L];
      if (ch2 === ' ') continue;
      c.drawImage(at, idx[ch2] * cw, T[i + 2] * chH, cw, chH, T[i] - cw / 2, T[i + 1] - chH / 2, cw, chH);
    }
    arcs(k, t, R, true);
  }

  function rendre(k, mode, t) { if (mode === 'peau') peau(k, t); else structure(k, t); }

  // la ligne de scan : au-dessus, le nouveau corps ; en dessous, l'ancien
  function balayage(k, de, a, p, t) {
    var c = k.ctx, h = k.R * 2.9, ys = k.cy - h / 2 + h * p;
    c.save(); c.beginPath(); c.rect(0, 0, k.W, ys); c.clip(); rendre(k, a, t); c.restore();
    c.save(); c.beginPath(); c.rect(0, ys, k.W, k.H - ys); c.clip(); rendre(k, de, t); c.restore();
    var dy = (ys - k.cy) / k.R, demi = dy * dy < 1 ? Math.sqrt(1 - dy * dy) * k.R * 1.15 : k.R * 0.3;
    var g = c.createLinearGradient(0, ys - 26 * k.dpr, 0, ys);
    g.addColorStop(0, 'rgba(255,214,150,0)');
    g.addColorStop(1, 'rgba(255,214,150,0.22)');
    c.fillStyle = g; c.fillRect(k.cx - demi, ys - 26 * k.dpr, demi * 2, 26 * k.dpr);
    c.fillStyle = 'rgba(255,240,215,0.9)'; c.fillRect(k.cx - demi, ys - k.dpr * 0.5, demi * 2, k.dpr);
  }

  function vers(k, mode) {
    if (k.scan) { if (k.scan.vers === mode) return; }
    else if (k.mode === mode) return;
    k.scan = { de: k.scan ? k.scan.vers : k.mode, vers: mode, t0: performance.now() };
    relancer();
  }

  var TIENT = { peau: 5600, structure: 4400 }, SCAN = 1500;
  function avancer(k, now) {
    if (k.scan) {
      if ((now - k.scan.t0) / SCAN >= 1) { k.mode = k.scan.vers; k.scan = null; k.depuis = now; k.fig.setAttribute('data-mode', k.mode); }
      return;
    }
    if (!k.depuis) k.depuis = now;
    if (k.force) return;
    if (now - k.depuis > TIENT[k.mode]) vers(k, k.mode === 'peau' ? 'structure' : 'peau');
  }

  function image(k, now) {
    // t : le temps propre de Kora, qui accélère quand on défile (k.boost)
    var debut = performance.now(), t = k.temps;
    k.ctx.clearRect(0, 0, k.W, k.H);
    if (k.scan) {
      var p = Math.min(1, (now - k.scan.t0) / SCAN);
      p = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      balayage(k, k.scan.de, k.scan.vers, p, t);
    } else {
      rendre(k, k.mode, t);
    }
    gpuImage(k, t);
    k.couts.push(performance.now() - debut);
    if (k.couts.length > 240) k.couts.shift();
  }

  // le rendu WebGPU de la peau : on ne le montre que là où la peau est visible.
  // Pendant un balayage, la ligne de scan le découpe (au-dessus le nouveau corps,
  // en dessous l'ancien) ; en structure, il est masqué.
  function gpuImage(k, t, fixe) {
    if (!k.gpu) return;
    var ys = null, peauEnHaut = false;
    if (fixe) { ys = k.cy; }
    else if (k.scan) {
      var p = Math.min(1, (performance.now() - k.scan.t0) / SCAN);
      p = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      var h = k.R * 2.9; ys = k.cy - h / 2 + h * p; peauEnHaut = k.scan.vers === 'peau';
    }
    var cl;
    if (ys === null) cl = k.mode === 'peau' ? 'none' : 'inset(0 0 100% 0)';
    else {
      var y = (ys / k.dpr).toFixed(1), reste = ((k.H - ys) / k.dpr).toFixed(1);
      cl = peauEnHaut ? 'inset(0 0 ' + reste + 'px 0)' : 'inset(' + y + 'px 0 0 0)';
    }
    if (k.gpuClip !== cl) { k.gpuCv.style.clipPath = cl; k.gpuClip = cl; }
    if (cl === 'inset(0 0 100% 0)') return;
    var h2 = k.compagne ? (k.fig.getAttribute('data-humeur') || 'peau') : 'peau';
    if (h2 === 'structure') h2 = 'peau';
    k.gpu.rendre(t, { humeur: h2, elan: Math.min(1, k.boost / 4), instantane: !!fixe });
  }

  // mouvement réduit : une composition fixe, mi-structure (haut) mi-peau (bas)
  function dessinerFixe(k) {
    if (!k.W) return;
    k.ctx.clearRect(0, 0, k.W, k.H);
    balayage(k, 'peau', 'structure', 0.5, 12);
    gpuImage(k, 12, true);
    k.fig.setAttribute('data-mode', 'fixe');
  }

  // ── Boucle unique ────────────────────────
  var enCours = false;
  // créées ici, une fois toutes les constantes du rendu affectées (NIV, TIENT…)
  document.querySelectorAll('[data-kr-kora]').forEach(function (fig) {
    var k = creerKora(fig);
    if (k) koras.push(k);
  });
  // la peau en WebGPU, si le navigateur l'a : module chargé à la demande (même origine),
  // un canvas GPU glissé sous le canvas 2D de chaque Kora. Sans WebGPU, rien ne change.
  if (navigator.gpu && koras.some(function (k) { return !k.compagne; })) {
    var mod = document.createElement('script');
    mod.src = '/js/kora-orbe-gpu.js';
    mod.onload = function () {
      if (!window.KoraOrbeGPU) return;
      window.KoraOrbeGPU.disponible().then(function (ok) {
        if (!ok) return;
        koras.forEach(function (k) {
          if (k.compagne) return;
          var g = document.createElement('canvas');
          g.className = 'kr-kora__canvas kr-kora__gpu';
          g.setAttribute('aria-hidden', 'true');
          k.cv.parentNode.insertBefore(g, k.cv);
          window.KoraOrbeGPU.creer(g, { dpr: Math.min(window.devicePixelRatio || 1, 2) }).then(function (orbe) {
            k.gpu = orbe; k.gpuCv = g; k.gpuClip = null;
            k.fig.classList.add('a-gpu');
            if (calme) dessinerFixe(k); else relancer();
          }).catch(function () { g.remove(); });
        });
      }).catch(function () {});
    };
    document.head.appendChild(mod);
  }

  function relancer() { if (!calme && !enCours) { enCours = true; requestAnimationFrame(boucle); } }
  var avant = 0;
  function boucle(now) {
    enCours = false;
    if (document.hidden) { avant = 0; return; }
    var dt = avant ? Math.min(0.1, (now - avant) / 1000) : 0;
    avant = now;
    var actif = false;
    koras.forEach(function (k) {
      if (!k.visible || !k.W) return;
      if (k.compagne) return; // l'actrice est une étincelle, dessinée à part (1 bis)
      k.temps += dt * (1 + k.boost);
      k.boost *= Math.pow(0.12, dt); // l'élan retombe en une seconde environ
      avancer(k, now);
      image(k, now);
      actif = true;
    });
    actif = acteurImage(dt) || actif;
    actif = comptesImage(now) || actif;
    if (actif) relancer();
  }
  if (IO) {
    var obsKora = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) {
        koras.forEach(function (k) { if (k.cv === en.target) k.visible = en.isIntersecting; });
      });
      relancer();
    });
    koras.forEach(function (k) { obsKora.observe(k.cv); });
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) relancer(); });

  // ── 1 bis. Kora actrice : l'étincelle qui traverse la page et écrit ses notes ──
  // Une orbe aussi détaillée ne se lit pas en petit. Quand la grande Kora quitte
  // l'écran, son halo se condense en une étincelle : un cœur de lumière, trois arcs
  // fins, une traînée de grains. L'étincelle vole jusqu'à la prochaine note de marge,
  // se pose à côté (jamais sur le contenu) et l'écrit lettre à lettre, un filament
  // tendu vers le curseur ; chaque lettre la fait briller. Son humeur suit la section
  // au centre (data-humeur) : or, violet du mode recherche, ou presque éteinte. Quand
  // on remonte vers la grande Kora, l'étincelle y retourne et s'y dissout.
  // Le texte complet de chaque note reste dans la page pour les lecteurs d'écran
  // (.cp-sr) ; l'écriture se pose sur un fantôme invisible : la mise en page ne bouge
  // pas. Mouvement réduit ou sans IntersectionObserver : rien de tout cela.
  // Une Kora de marge (« Lire ») reste à l'écran : elle n'est pas la grande Kora dont le
  // départ libère l'étincelle, seulement le point d'où elle part.
  var compagne = null, grande = null, marge = null;
  koras.forEach(function (k) {
    if (k.compagne) compagne = k;
    else if (k.fig.classList.contains('kr-kora--marge')) marge = marge || k;
    else if (!grande) grande = k;
  });

  var TEINTES = {
    peau:      { coeur: '255,246,226', halo: '255,170,80', grain: '240,176,92', force: 1 },
    structure: { coeur: '255,246,226', halo: '255,170,80', grain: '240,176,92', force: 1 },
    recherche: { coeur: '244,238,255', halo: '168,139,250', grain: '196,172,255', force: 1 }, // #a88bfa, kora-mode.ts
    eteinte:   { coeur: '230,214,190', halo: '200,140,80', grain: '160,120,80', force: 0.38 }
  };
  var FILAMENTS = ['226,92,164', '70,196,190']; // rose et turquoise de la scène de Choragos

  var acteur = null;
  if (compagne && IO && !calme && (grande || document.querySelector('.kr-note'))) {
    acteur = {
      x: 0, y: 0, vx: 0, vy: 0, etat: 'absente', depuis: 0, temps: 0,
      eclat: 0, histo: [], notes: [], filament: null, cv: null, ctx: null, dpr: 1,
      humeur: 'peau', origine: null
    };

    // les notes : texte complet pour les lecteurs d'écran, fantôme + écriture à l'écran
    document.querySelectorAll('.kr-note').forEach(function (n) {
      if (n.closest('[hidden]')) return;
      var sr = n.querySelector('.cp-sr');
      var texte = n.textContent.replace(sr ? sr.textContent : '', '').trim();
      n.textContent = '';
      var lu = document.createElement('span'); lu.className = 'cp-sr'; lu.textContent = 'Note de Kora : ' + texte;
      var corps = document.createElement('span'); corps.className = 'kr-note__corps'; corps.setAttribute('aria-hidden', 'true');
      var fantome = document.createElement('span'); fantome.className = 'kr-note__fantome'; fantome.textContent = texte;
      var ecrit = document.createElement('span'); ecrit.className = 'kr-note__ecrit';
      var trace = document.createElement('span'); trace.className = 'kr-note__trace';
      var curseur = document.createElement('span'); curseur.className = 'kr-note__curseur';
      ecrit.appendChild(trace); ecrit.appendChild(curseur);
      corps.appendChild(fantome); corps.appendChild(ecrit);
      n.appendChild(lu); n.appendChild(corps);
      acteur.notes.push({ el: n, texte: texte, trace: trace, curseur: curseur, n: 0, finie: false });
    });
    document.body.classList.add('kr-acteur');

    // la scène de l'étincelle : un canvas transparent sur toute la fenêtre
    var cvE = document.createElement('canvas');
    cvE.className = 'kr-sillage'; cvE.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cvE);
    acteur.cv = cvE; acteur.ctx = cvE.getContext('2d');
    var taillerScene = function () {
      acteur.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cvE.width = Math.round(window.innerWidth * acteur.dpr);
      cvE.height = Math.round(window.innerHeight * acteur.dpr);
    };
    taillerScene();
    window.addEventListener('resize', taillerScene);

    // le filament : une courbe de l'étincelle au curseur d'écriture
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'kr-filament'); svg.setAttribute('aria-hidden', 'true');
    var chemin = document.createElementNS(ns, 'path');
    svg.appendChild(chemin); document.body.appendChild(svg);
    acteur.filament = chemin;

    // le centre (à l'écran) de la grande Kora : départ et retour de l'étincelle
    var centreGrande = function () {
      var source = grande || (marge && marge.cv.offsetWidth ? marge : null);
      if (!source) return { x: window.innerWidth - 80, y: window.innerHeight * 0.6, r: 40 };
      var r = source.cv.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: Math.min(r.width, r.height) * 0.3 };
    };
    var montrer = function (oui) {
      var now = performance.now();
      if (oui && acteur.etat !== 'vit' && acteur.etat !== 'condense') {
        var c0 = centreGrande();
        acteur.origine = c0;
        acteur.x = c0.x; acteur.y = Math.max(-40, c0.y); acteur.vx = 0; acteur.vy = 0;
        acteur.histo.length = 0;
        acteur.etat = 'condense'; acteur.depuis = now;
      } else if (!oui && (acteur.etat === 'vit' || acteur.etat === 'condense')) {
        acteur.etat = 'retour'; acteur.depuis = now;
      }
      compagne.enScene = oui;
      compagne.fig.classList.toggle('is-en-scene', oui);
      relancer();
    };
    if (grande) {
      new IntersectionObserver(function (entrees) { montrer(!entrees[0].isIntersecting); }, { threshold: 0.15 }).observe(grande.fig);
    } else {
      montrer(true);
    }

    var obsHumeur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) {
        if (!en.isIntersecting) return;
        var h = en.target.getAttribute('data-humeur') || 'peau';
        var nom = en.target.querySelector('.kr-entete__n');
        acteur.humeur = h;
        compagne.fig.setAttribute('data-humeur', h);
        compagne.fig.querySelector('.kr-compagne__lieu').textContent = nom ? nom.textContent : '';
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    document.querySelectorAll('[data-humeur]').forEach(function (s) { obsHumeur.observe(s); });
  }

  function finir(nt) {
    nt.n = nt.texte.length; nt.trace.textContent = nt.texte; nt.finie = true;
    nt.el.classList.add('is-ecrite');
  }
  function lisseIO(p) { return p < 0 ? 0 : p > 1 ? 1 : p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }

  // dessin de l'étincelle à (x, y) : traînée, halo, arcs, cœur
  function dessinerEtincelle(a, presence, ampleur) {
    var c = a.ctx, s = a.dpr, T = TEINTES[a.humeur] || TEINTES.peau, f = T.force * presence, t = a.temps;
    var x = a.x * s, y = a.y * s;
    c.save();
    c.globalCompositeOperation = 'lighter';

    // la traînée : des grains qui s'éteignent, quelques-uns aux couleurs des filaments
    var H = a.histo, vie = 0.9;
    for (var i = 0; i < H.length; i++) {
      var g = H[i], age = (t - g.t) / vie;
      if (age >= 1) continue;
      var dec = Math.sin(i * 1.7 + t * 3) * 4 * age, al = (1 - age) * (1 - age) * 0.75 * f;
      var col = i % 6 === 0 ? FILAMENTS[(i / 6) % 2 | 0] : T.grain;
      c.fillStyle = 'rgba(' + col + ',' + al.toFixed(3) + ')';
      var rr = (1.7 * (1 - age) + 0.5) * s;
      c.beginPath(); c.arc((g.x + dec * g.nx) * s, (g.y + dec * g.ny) * s, rr, 0, TAU); c.fill();
    }

    // le halo (immense pendant la condensation, puis serré)
    var rh = (26 + ampleur) * s * (a.humeur === 'eteinte' ? 0.6 : 1);
    var hg = c.createRadialGradient(x, y, 0, x, y, rh);
    hg.addColorStop(0, 'rgba(' + T.halo + ',' + (0.55 * f * (1 + a.eclat * 0.7)).toFixed(3) + ')');
    hg.addColorStop(0.35, 'rgba(' + T.halo + ',' + (0.16 * f).toFixed(3) + ')');
    hg.addColorStop(1, 'rgba(' + T.halo + ',0)');
    c.fillStyle = hg; c.beginPath(); c.arc(x, y, rh, 0, TAU); c.fill();

    // trois arcs fins, comme la cage de la grande Kora
    c.lineWidth = 1 * s; c.lineCap = 'round';
    for (var j = 0; j < 3; j++) {
      var rx = (11 + j * 4 + ampleur * 0.3) * s, rot = 0.6 + j * 1.9 + t * (0.9 + j * 0.35) * (1 + a.vitesseNorm);
      c.strokeStyle = 'rgba(255,233,196,' + (0.7 * f).toFixed(3) + ')';
      c.beginPath(); c.ellipse(x, y, rx, rx * 0.36, rot, t * (1.3 + j * 0.4), t * (1.3 + j * 0.4) + 4.2); c.stroke();
    }

    // le cœur
    var rc = (2.6 + a.eclat * 1.6) * s;
    var cg = c.createRadialGradient(x, y, 0, x, y, rc * 2.4);
    cg.addColorStop(0, 'rgba(' + T.coeur + ',' + Math.min(1, f * 1.1).toFixed(3) + ')');
    cg.addColorStop(0.45, 'rgba(' + T.coeur + ',' + (0.8 * f).toFixed(3) + ')');
    cg.addColorStop(1, 'rgba(' + T.halo + ',0)');
    c.fillStyle = cg; c.beginPath(); c.arc(x, y, rc * 2.4, 0, TAU); c.fill();
    c.restore();
  }

  // une image de l'actrice : choisir la note, voler, écrire, tendre le filament, dessiner
  function acteurImage(dt) {
    if (!acteur || acteur.etat === 'absente') return false;
    var now = performance.now(), Hh = window.innerHeight, W = window.innerWidth, etroit = W < 900;
    var a = acteur, pied = 44; // l'empreinte de l'étincelle pour la placer
    a.temps += dt;
    a.eclat *= Math.pow(0.02, dt);
    var svgEl = a.filament.parentNode;

    // la note courante : la première non écrite dans la bande de lecture ; celles déjà
    // dépassées vers le haut sont posées d'un coup, pour qu'aucun texte ne manque
    var cible = null;
    if (a.etat === 'vit' || a.etat === 'condense') {
      for (var i = 0; i < a.notes.length; i++) {
        var nt = a.notes[i];
        if (nt.finie) continue;
        var r = nt.el.getBoundingClientRect();
        if (r.bottom < Hh * 0.08) { finir(nt); continue; }
        if (!cible && r.top < Hh * 0.78 && r.bottom > Hh * 0.1) cible = { nt: nt, r: r };
      }
    }

    // où aller : jamais sur le contenu. À droite de la note s'il y a la place, sinon
    // au-dessus d'elle dans la marge ; au repos, dans la marge droite ; au retour, la grande Kora
    var tx, ty;
    if (a.etat === 'retour') {
      var cg0 = centreGrande(); tx = cg0.x; ty = cg0.y;
    } else if (cible) {
      if (etroit) { tx = W - 22; ty = cible.r.top + 10; }
      else if (W - cible.r.right > pied + 28) { tx = cible.r.right + pied / 2 + 16; ty = cible.r.top + 9; }
      else { tx = cible.r.left + 4; ty = cible.r.top - 18; }
      ty = Math.max(70, Math.min(Hh - 30, ty));
    } else {
      tx = etroit ? W - 22 : W - 70; ty = etroit ? Hh - 40 : Hh * 0.62;
    }

    // le vol : un ressort amorti ; plus lent pendant la condensation
    var raideur = a.etat === 'condense' ? 10 : a.etat === 'retour' ? 14 : 24, amorti = 2 * Math.sqrt(raideur);
    a.vx += ((tx - a.x) * raideur - a.vx * amorti) * dt;
    a.vy += ((ty - a.y) * raideur - a.vy * amorti) * dt;
    a.x += a.vx * dt; a.y += a.vy * dt;
    var vitesse = Math.hypot(a.vx, a.vy);
    a.vitesseNorm = Math.min(2, vitesse / 500);

    // la traînée : une position toutes les images, avec sa normale au mouvement
    var nn = vitesse || 1;
    a.histo.push({ x: a.x, y: a.y, t: a.temps, nx: -a.vy / nn, ny: a.vx / nn });
    while (a.histo.length && a.temps - a.histo[0].t > 0.9) a.histo.shift();

    // présence et ampleur : la condensation part d'un halo de la taille de l'orbe
    var presence = 1, ampleur = 0, ecoule = (now - a.depuis) / 1000;
    if (a.etat === 'condense') {
      var p = lisseIO(ecoule / 0.9);
      ampleur = (1 - p) * (a.origine ? a.origine.r : 60);
      presence = 0.35 + 0.65 * p;
      if (p >= 1) a.etat = 'vit';
    } else if (a.etat === 'retour') {
      var q = Math.min(1, ecoule / 0.8);
      ampleur = q * q * 80; presence = 1 - q;
      if (q >= 1) { a.etat = 'absente'; a.histo.length = 0; }
    }

    // posée : elle écrit (plus vite si la note va sortir de l'écran) ; chaque lettre brille
    var arrivee = Math.hypot(tx - a.x, ty - a.y) < 14 && a.etat === 'vit';
    var ecrit = false;
    if (cible && arrivee) {
      var nt2 = cible.nt, presse = cible.r.top < Hh * 0.2 ? 3 : 1, avantN = Math.floor(nt2.n);
      nt2.n = Math.min(nt2.texte.length, nt2.n + dt * 34 * presse);
      if (Math.floor(nt2.n) > avantN && nt2.texte[Math.floor(nt2.n) - 1] !== ' ') a.eclat = Math.max(a.eclat, 0.6);
      nt2.trace.textContent = nt2.texte.slice(0, Math.floor(nt2.n));
      nt2.el.classList.add('is-en-cours');
      ecrit = true;
      if (nt2.n >= nt2.texte.length) { nt2.el.classList.remove('is-en-cours'); finir(nt2); a.eclat = 1; }
    }

    // le filament, de l'étincelle au curseur d'écriture
    if (ecrit) {
      var cr = cible.nt.curseur.getBoundingClientRect();
      var x1 = cr.left, y1 = cr.top + cr.height / 2, mx = (a.x + x1) / 2, my = Math.min(a.y, y1) - 22;
      a.filament.setAttribute('d', 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ' Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + x1.toFixed(1) + ' ' + y1.toFixed(1));
      svgEl.classList.add('is-tendu');
    } else {
      svgEl.classList.remove('is-tendu');
    }

    // l'étiquette (Kora · section) suit l'étincelle
    compagne.fig.style.transform = 'translate3d(' + a.x.toFixed(1) + 'px,' + a.y.toFixed(1) + 'px,0)';
    compagne.fig.classList.toggle('is-ecrit', ecrit || a.etat !== 'vit');

    a.ctx.clearRect(0, 0, a.cv.width, a.cv.height);
    if (a.etat !== 'absente') dessinerEtincelle(a, presence, ampleur);
    return a.etat !== 'absente';
  }

  // l'élan : la vitesse de défilement accélère le temps propre de chaque Kora
  if (!calme) {
    var yAvant = window.scrollY, tAvant = performance.now();
    window.addEventListener('scroll', function () {
      var t = performance.now(), dy = Math.abs(window.scrollY - yAvant), d = Math.max(16, t - tAvant);
      yAvant = window.scrollY; tAvant = t;
      var elan = Math.min(4, dy / d * 2.2);
      koras.forEach(function (k) { if (elan > k.boost) k.boost = elan; });
      relancer();
    }, { passive: true });
    window.addEventListener('resize', relancer);
  }

  // ── 2. Mise au point et comptes ──────────
  var comptes = [];
  function lisse(t) { return t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3); }
  function milliers(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function comptesImage(now) {
    comptes = comptes.filter(function (c) {
      var p = lisse((now - c.t0) / 1400);
      c.el.textContent = milliers(Math.round(c.cible * p));
      return p < 1;
    });
    return comptes.length > 0;
  }

  if (!calme && IO) {
    var blocs = document.querySelectorAll('.cn-focus');
    var h0 = window.innerHeight;
    blocs.forEach(function (b) {
      var r = b.getBoundingClientRect();
      if (r.top < h0 * 0.92 && r.bottom > 0) b.classList.add('is-net');
    });
    document.body.classList.add('cn-mise-au-point');
    var obsNet = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-net'); obsNet.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
    blocs.forEach(function (b) { if (!b.classList.contains('is-net')) obsNet.observe(b); });

    var obsCompte = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) {
        if (!en.isIntersecting) return;
        obsCompte.unobserve(en.target);
        comptes.push({ el: en.target, cible: Number(en.target.getAttribute('data-compte')), t0: performance.now() });
        relancer();
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-compte]').forEach(function (el) { obsCompte.observe(el); });
  }

  relancer();
})();
