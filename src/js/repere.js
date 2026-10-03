/* ============================================================
   REPÈRE — Kora dessinée sur chaque canvas[data-orb] de la page (03/10).
   Repris de orb.js (passation « Observatoire »), lui-même porté de
   l'ancien repere.js : mêmes humeurs, mêmes orbites, même peau.
   Options en data-* : cx, cy, r, mood, dim, stars, bg, orbits, count,
   tilt, animate, ink (inutilisé ici).
   - plusieurs canvas par page ; seuls les VISIBLES s'animent, 8 au plus ;
   - ResizeObserver (rappel dans requestAnimationFrame) ; DPR plafonné à 1,25 ;
   - prefers-reduced-motion : un rendu fixe, aucune boucle.
   API pour site.js : window.KoraOrb.setMood(canvas, mood).
   ============================================================ */
(function () {
  'use strict';
  var MOODS = {
    rest:   { r:111, g:201, b:228, flow:1.00, beat:3.4, amp:0.26, glow:1.00, orb:0.30 },
    search: { r:233, g:165, b: 68, flow:2.30, beat:1.4, amp:0.40, glow:1.35, orb:1.00 },
    cold:   { r:120, g:140, b:170, flow:0.35, beat:5.0, amp:0.13, glow:0.60, orb:0.10 },
    speak:  { r:169, g:143, b:201, flow:1.70, beat:2.0, amp:0.46, glow:1.20, orb:0.45 }
  };
  /* les trois sommets, en orbite — périodes selon Kepler (T ∝ r^1.5) */
  var ORBITS = [
    { k:1.58, col:'233,165,68',  ph:0.4 },
    { k:2.06, col:'111,201,228', ph:2.3 },
    { k:2.62, col:'169,143,201', ph:4.6 }
  ];
  var INKO = ['154,91,0', '44,113,137', '110,86,150'];
  var TILT = 0.30;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* bruit coulant : trois sinus croisés — de grandes nappes lentes */
  function swell(x, y, z, t) {
    return Math.sin(x*2.1+t)*0.5 + Math.sin(y*1.7-t*0.83)*0.32 + Math.sin(z*2.6+t*1.21)*0.18;
  }
  /* double battement « lub-dub » */
  function pulse(t, period) {
    var p = (t % period) / period;
    if (p < 0.10) return Math.sin(p/0.10*Math.PI);
    if (p < 0.17) return 0;
    if (p < 0.29) return Math.sin((p-0.17)/0.12*Math.PI)*0.55;
    return 0;
  }

  function setup(cv) {
    var d = cv.dataset;
    function num(v, f) { return v === undefined ? f : parseFloat(v); }
    function bool(v, f) { return v === undefined ? f : v === 'true'; }
    var o = {
      cx: num(d.cx, .5), cy: num(d.cy, .5), r: num(d.r, .3), mood: d.mood || 'rest',
      dim: num(d.dim, 1), stars: bool(d.stars, true), bg: bool(d.bg, true),
      orbits: bool(d.orbits, true), count: num(d.count, 1400), animate: bool(d.animate, true),
      ink: bool(d.ink, false), tilt: num(d.tilt, TILT)
    };
    if (o.ink) o.stars = false;
    var W = cv.clientWidth || 100, H = cv.clientHeight || 100;
    var DPR = Math.min(window.devicePixelRatio || 1, 1.25);
    cv.width = Math.round(W*DPR); cv.height = Math.round(H*DPR);
    var ctx = cv.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // Fibonacci : aucune couture, aucun pôle dense
    var N = o.count, pts = new Float32Array(N*3), phi = Math.PI*(3-Math.sqrt(5));
    for (var i = 0; i < N; i++) {
      var y = 1-(i/(N-1))*2, rad = Math.sqrt(Math.max(0, 1-y*y)), th = phi*i;
      pts[i*3] = Math.cos(th)*rad; pts[i*3+1] = y; pts[i*3+2] = Math.sin(th)*rad;
    }
    var stars = new Float32Array(0);
    if (o.stars) {
      var sc = Math.round(W*H/5200); stars = new Float32Array(sc*4);
      for (var j = 0; j < sc; j++) {
        stars[j*4] = Math.random()*W; stars[j*4+1] = Math.random()*H;
        stars[j*4+2] = Math.random()*0.75+0.25; stars[j*4+3] = Math.random()*6.28;
      }
    }
    return { cv: cv, ctx: ctx, o: o, W: W, H: H, pts: pts, stars: stars, mood: MOODS[o.mood] || MOODS.rest, vis: false };
  }

  function render(s, t) {
    var ctx = s.ctx, o = s.o, W = s.W, H = s.H, pts = s.pts, stars = s.stars, mood = s.mood;
    if (o.bg) { ctx.fillStyle = o.ink ? '#F4F2ED' : '#05070B'; ctx.fillRect(0, 0, W, H); }
    else ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = o.ink ? 'source-over' : 'lighter';
    for (var i = 0; i < stars.length; i += 4) {
      var tw = still ? 1 : 0.55+0.45*Math.sin(t*0.6+stars[i+3]);
      ctx.fillStyle = 'rgba(190,210,240,'+(stars[i+2]*tw*0.5).toFixed(3)+')';
      ctx.fillRect(stars[i], stars[i+1], 1.15, 1.15);
    }
    var cx = W*o.cx, cy = H*o.cy, R = Math.min(W, H)*o.r, dim = o.dim;
    var beat = still ? 0 : pulse(t, mood.beat), spin = still ? 0.6 : t*0.11, flow = still ? 0 : t*mood.flow;
    var cos = Math.cos(spin), sin = Math.sin(spin);
    var col = o.ink ? '22,23,26' : mood.r+','+mood.g+','+mood.b;
    var oa = o.ink ? 1 : mood.orb*dim;
    if (o.orbits && oa > 0.02) {
      for (var oi = 0; oi < ORBITS.length; oi++) {
        var ob = ORBITS[oi], obc = o.ink ? INKO[oi] : ob.col;
        var rx = R*ob.k, ry = rx*Math.sin(o.tilt);
        ctx.strokeStyle = 'rgba('+obc+','+(o.ink ? 0.45 : oa*0.16).toFixed(3)+')'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2); ctx.stroke();
        // corps en révolution — période dérivée du rayon, 3ᵉ loi de Kepler
        var ang = still ? ob.ph : ob.ph + t*(0.30/Math.pow(ob.k, 1.5));
        var bx = cx+Math.cos(ang)*rx, by = cy+Math.sin(ang)*ry;
        var front = (Math.sin(ang)+1)*0.5, br = (1.6+front*1.7);
        var g2 = ctx.createRadialGradient(bx, by, 0, bx, by, br*5);
        g2.addColorStop(0, 'rgba('+obc+','+(oa*(0.35+front*0.5)).toFixed(3)+')');
        g2.addColorStop(1, 'rgba('+obc+',0)');
        ctx.fillStyle = g2; ctx.fillRect(bx-br*5, by-br*5, br*10, br*10);
        ctx.fillStyle = 'rgba('+obc+','+(oa*(0.45+front*0.5)).toFixed(3)+')';
        ctx.fillRect(bx-br/2, by-br/2, br, br);
      }
    }
    if (!o.ink) {
      // la lueur du cœur
      var gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, R*(1.5+beat*0.5));
      gr.addColorStop(0,   'rgba('+col+','+(0.30*mood.glow*dim*(1+beat*0.7)).toFixed(3)+')');
      gr.addColorStop(0.4, 'rgba('+col+','+(0.07*mood.glow*dim).toFixed(3)+')');
      gr.addColorStop(1,   'rgba('+col+',0)');
      ctx.fillStyle = gr; ctx.fillRect(cx-R*2, cy-R*2, R*4, R*4);
    }
    // la peau
    var amp = mood.amp*(1+beat*0.55), N = pts.length/3;
    var scale = Math.max(0.35, Math.min(1, R/120));
    for (var k = 0; k < N; k++) {
      var x = pts[k*3], yy = pts[k*3+1], z = pts[k*3+2];
      var xr = x*cos-z*sin, zr = x*sin+z*cos;
      var dd = 1 + swell(xr, yy, zr, flow)*amp;
      var px = cx + xr*R*dd, py = cy + yy*R*dd, depth = (zr+1)*0.5;
      var a = o.ink ? (0.12+depth*depth*0.75) : (0.10+depth*depth*0.62)*mood.glow*dim;
      var sz = (0.75+depth*1.5)*scale;
      ctx.fillStyle = 'rgba('+col+','+a.toFixed(3)+')';
      ctx.fillRect(px-sz/2, py-sz/2, sz, sz);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  var live = new Set(), seen = new WeakSet(), raf = 0, t0 = performance.now();
  function now() { return (performance.now()-t0)/1000 + 8; }

  var ro = new ResizeObserver(function (es) {
    requestAnimationFrame(function () {
      es.forEach(function (e) {
        var cv = e.target, old = cv.__orb;
        if (!old) return;
        if (Math.abs(cv.clientWidth - old.W) < 1 && Math.abs(cv.clientHeight - old.H) < 1) return;
        var n = setup(cv); n.vis = old.vis; n.mood = old.mood;
        if (live.has(old)) { live.delete(old); live.add(n); }
        cv.__orb = n; render(n, now());
      });
    });
  });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.target.__orb) e.target.__orb.vis = e.isIntersecting; });
  });

  function loop() {
    var t = now(), n = 0;
    live.forEach(function (s) { if (s.vis && n < 8) { render(s, t); n++; } });
    raf = live.size ? requestAnimationFrame(loop) : 0;
  }

  function mount(root) {
    (root || document).querySelectorAll('canvas[data-orb]').forEach(function (cv) {
      if (!cv.__orb) { cv.__orb = setup(cv); render(cv.__orb, now()); }
      if (!seen.has(cv)) { seen.add(cv); io.observe(cv); ro.observe(cv); }
      if (!still && cv.__orb.o.animate) live.add(cv.__orb); else live.delete(cv.__orb);
    });
    if (live.size && !raf) raf = requestAnimationFrame(loop);
  }

  window.KoraOrb = {
    mount: mount,
    setMood: function (cv, mood) {
      if (!cv || !cv.__orb || !MOODS[mood]) return;
      cv.__orb.mood = MOODS[mood]; cv.__orb.o.mood = mood;
      render(cv.__orb, now());
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { mount(document); });
  else mount(document);
})();
