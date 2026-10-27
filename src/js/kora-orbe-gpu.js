/* ============================================================
   kora-orbe-gpu.js — l'orbe de Kora en WebGPU brut (WGSL, sans
   bibliothèque), au plus près du rendu de Choragos.

   Ce qui est repris de l'application (dépôt choragos, version
   commitée) :
   - le VOLUME raymarché : lab/kora-webgpu/volume.wgsl.ts (traduction
     ligne à ligne de orb-volume-material.ts) — même champ (fbm tuilé,
     warp de domaine, crêtes en veines, cœur), même émission par
     composante, même absorption Beer-Lambert, même lumière interne
     ombrée par un échantillon ; la surface est une sphère (silhouette 0
     dans DEFAULT_LOOK), sans foyers ni cristaux (ce sont des états) ;
   - le BRUIT 3D : orb-volume-noise.ts (Perlin tuilé, fbm 4 + 3 octaves,
     étiré ×2,2), calculé ici par un compute shader au lieu du CPU ;
   - les GRAINS : lab/kora-webgpu/particles.wgsl.ts (curl du même
     champ, accroche aux crêtes, renaissance) — 32 768 grains ;
   - la SPHÈRE ARMILLAIRE : kora-armillary-node.ts (44 arcs × 96
     segments, 300 points en rotation, liens entre voisins < 0,27,
     même tirage mulberry32 à graine 0x4b0a) ;
   - le VERRE : orb-volume-glass.ts (IOR 1,45, environnement noir à
     trois lueurs aux mêmes positions) — approché analytiquement, pas
     un MeshPhysicalMaterial ;
   - la PALETTE : orb-look.ts DEFAULT_LOOK (« lumière chaude » du
     10/10) ; le mode recherche : kora-mode.ts tint #a88bfa, dérivé
     comme orb.ts::refreshVolumePalette ;
   - la SORTIE : constellation-renderer.ts (bloom en chaîne de mips,
     seuil 0,6, force 0,4, rayon 0,5 ; ACES × exposition 0,85 ; alpha =
     luminance de la couleur affichée, canvas en alpha prémultiplié).

   API : window.KoraOrbeGPU = { disponible(), creer(canvas, { dpr }) }.
   Démo : la page qui porte [data-orbe-demo] (maquettes/orbe-gpu).
   ============================================================ */
(function () {
  'use strict';

  var HDR = 'rgba16float';
  var NOISE = 64;
  var GRAINS = 32768;
  var GRAIN_TEXW = 256;
  var ARCS = 44, ARC_SEG = 96, PLEXUS = 300;
  var MIPS = 5;

  // ---------- couleurs : hex sRGB → linéaire (comme THREE.Color) ----------
  function lin(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (c) {
      c /= 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
  }
  function mixc(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }

  // Les humeurs. `peau` = DEFAULT_LOOK ; `recherche` = la teinte du mode (kora-mode.ts) dérivée
  // comme orb.ts::refreshVolumePalette (fond = teinte² × 0,08, chaud = teinte → blanc à 75 %).
  var ROSE = lin('#a88bfa');
  var HUMEURS = {
    peau: {
      deep: lin('#0e0b09'), mid: lin('#8a5522'), hot: lin('#ffe9c4'),
      gA: lin('#fff1d6'), gB: lin('#d9954a'), aA: lin('#fff1d6'), aB: lin('#d9954a'),
      vol: 1, grains: 1, arcs: 1, plexus: 1, verre: 1, vitesse: 1, lumiere: 0.1
    },
    recherche: {
      deep: ROSE.map(function (c) { return c * c * 0.08; }), mid: ROSE, hot: mixc(ROSE, [1, 1, 1], 0.75),
      // Écart assumé : dans l'appli, grains et armillaire gardent leurs couleurs chaudes en mode
      // recherche ; ici ils prennent la teinte, sinon la cage ambre contredit le corps violet.
      gA: mixc(ROSE, [1, 1, 1], 0.8), gB: ROSE, aA: mixc(ROSE, [1, 1, 1], 0.8), aB: mixc(ROSE, lin('#ff8cbe'), 0.35),
      vol: 1, grains: 1, arcs: 1, plexus: 1, verre: 1, vitesse: 1.15, lumiere: 0.1
    },
    eteinte: {
      deep: lin('#0e0b09'), mid: lin('#8a5522'), hot: lin('#ffe9c4'),
      gA: lin('#fff1d6'), gB: lin('#d9954a'), aA: lin('#fff1d6'), aB: lin('#d9954a'),
      vol: 0.16, grains: 0.12, arcs: 0.1, plexus: 0.14, verre: 0.4, vitesse: 0.3, lumiere: 0.04
    }
  };

  // ---------- tirage à graine fixe (mulberry32, comme l'appli) ----------
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randomPlane(r) {
    var z = r() * 2 - 1, a = r() * Math.PI * 2, s = Math.sqrt(1 - z * z);
    var n = [Math.cos(a) * s, Math.sin(a) * s, z];
    var ref = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    var e1 = [n[1] * ref[2] - n[2] * ref[1], n[2] * ref[0] - n[0] * ref[2], n[0] * ref[1] - n[1] * ref[0]];
    var l = Math.hypot(e1[0], e1[1], e1[2]);
    e1 = [e1[0] / l, e1[1] / l, e1[2] / l];
    var e2 = [n[1] * e1[2] - n[2] * e1[1], n[2] * e1[0] - n[0] * e1[2], n[0] * e1[1] - n[1] * e1[0]];
    return [e1, e2];
  }
  // kora-armillary-node.ts : mêmes tirages, dans le même ordre.
  function construireArmillaire() {
    var r = rng(0x4b0a);
    var arcs = new Float32Array(ARCS * 16);
    for (var i = 0; i < ARCS; i++) {
      var pl = randomPlane(r), e1 = pl[0], e2 = pl[1];
      var thick = r() < 0.35, o = i * 16;
      arcs.set([e1[0], e1[1], e1[2], 1.04 + r() * 0.3], o);
      arcs.set([e2[0], e2[1], e2[2], r() * Math.PI * 2], o + 4);
      arcs.set([(0.25 + r() * 0.75) * Math.PI * (thick ? 0.6 : 1), (r() < 0.5 ? -1 : 1) * (0.12 + r() * 0.5),
        thick ? 3 + r() * 3 : 1 + r() * 0.9, thick ? 1 : 0.45 + r() * 0.5], o + 8);
      arcs.set([r(), r() < 0.25 ? 40 + Math.floor(r() * 50) : 0, 0, 0], o + 12);
    }
    var pts = new Float32Array(PLEXUS * 8);
    for (var j = 0; j < PLEXUS; j++) {
      var z = r() * 2 - 1, a = r() * Math.PI * 2, s = Math.sqrt(1 - z * z);
      var rad = 0.35 + Math.cbrt(r()) * 0.62;
      var bright = r() < 0.08 ? 1 : 0.25 + r() * 0.45;
      var ax = randomPlane(r)[0];
      pts.set([Math.cos(a) * s * rad, Math.sin(a) * s * rad, z * rad, bright,
        ax[0], ax[1], ax[2], (r() < 0.5 ? -1 : 1) * (0.05 + r() * 0.18)], j * 8);
    }
    var paires = new Uint32Array(PLEXUS * (PLEXUS - 1));
    var k = 0;
    for (var p = 0; p < PLEXUS; p++) for (var q = p + 1; q < PLEXUS; q++) { paires[k++] = p; paires[k++] = q; }
    return { arcs: arcs, pts: pts, paires: paires };
  }

  // ---------- WGSL ----------
  // Tampon d'uniformes commun (vec4 × 20).
  var U_WGSL = /* wgsl */ `
struct U {
  cam: vec4f,   // projX, projY, distance caméra, pas de marche
  res: vec4f,   // largeur, hauteur (px du tampon), échelle des px de l'appli, frame
  vol0: vec4f,  // phase, densité, absorption, crête
  vol1: vec4f,  // fréquence, warp, cœur, bord
  vol2: vec4f,  // brume, lumière interne, gain des veines, lueur du corps
  vol3: vec4f,  // chaleur, gain du volume, gain du verre, iridescence
  deep: vec4f, mid: vec4f, hot: vec4f, heatC: vec4f,
  arm: vec4f,   // temps armillaire, gain des arcs, voix, gain de la constellation
  colA: vec4f, colB: vec4f,
  grain: vec4f, // dt, alpha, taille px, poussée
  gColA: vec4f, gColB: vec4f,
  misc: vec4f,  // distance max des liens, gain des reflets, seuil du bloom, rayon du bloom
  post: vec4f,  // force du bloom, exposition, -, -
  pad0: vec4f, pad1: vec4f,
};
@group(0) @binding(0) var<uniform> u: U;
fn ss(a: f32, b: f32, x: f32) -> f32 { let t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
// Caméra sur +z, l'orbe au centre en unités de rayon.
fn toClip(p: vec3f) -> vec4f { let w = u.cam.z - p.z; return vec4f(p.x * u.cam.x, p.y * u.cam.y, 0.5 * w, w); }
fn toPx(p: vec3f) -> vec2f { let c = toClip(p); return c.xy / c.w * 0.5 * u.res.xy; }
fn offsetClip(c: vec4f, px: vec2f) -> vec4f { return vec4f(c.xy + px * 2.0 / u.res.xy * c.w, c.zw); }
fn front(z: f32) -> f32 { return clamp(z * 0.5 + 0.5, 0.0, 1.0); }
`;

  // orb-volume-noise.ts sur GPU : R = fbm 4 octaves (graine 7), G = fbm 3 octaves décalé (91).
  var NOISE_WGSL = /* wgsl */ `
@group(0) @binding(0) var dst: texture_storage_3d<rgba8unorm, write>;
fn hash3(x: i32, y: i32, z: i32, seed: i32) -> f32 {
  var h = u32(x) * 374761393u + u32(y) * 668265263u + u32(z) * 2147483647u + u32(seed) * 1013904223u;
  h = (h ^ (h >> 13u)) * 1274126177u;
  return f32(h ^ (h >> 16u)) / 4294967296.0;
}
fn fade(t: f32) -> f32 { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
fn wrapi(c: i32, p: i32) -> i32 { return ((c % p) + p) % p; }
fn grad(cx: i32, cy: i32, cz: i32, d: vec3f, period: i32, seed: i32) -> f32 {
  let px = wrapi(cx, period); let py = wrapi(cy, period); let pz = wrapi(cz, period);
  let theta = hash3(px, py, pz, seed) * 6.28318530718;
  let phi = acos(2.0 * hash3(px + 17, py + 31, pz + 47, seed) - 1.0);
  let g = vec3f(sin(phi) * cos(theta), sin(phi) * sin(theta), cos(phi));
  return dot(g, d);
}
fn perlin(p: vec3f, period: i32, seed: i32) -> f32 {
  let i = vec3i(floor(p)); let f = p - floor(p);
  let w = vec3f(fade(f.x), fade(f.y), fade(f.z));
  let n000 = grad(i.x, i.y, i.z, f, period, seed);
  let n100 = grad(i.x + 1, i.y, i.z, f - vec3f(1.0, 0.0, 0.0), period, seed);
  let n010 = grad(i.x, i.y + 1, i.z, f - vec3f(0.0, 1.0, 0.0), period, seed);
  let n110 = grad(i.x + 1, i.y + 1, i.z, f - vec3f(1.0, 1.0, 0.0), period, seed);
  let n001 = grad(i.x, i.y, i.z + 1, f - vec3f(0.0, 0.0, 1.0), period, seed);
  let n101 = grad(i.x + 1, i.y, i.z + 1, f - vec3f(1.0, 0.0, 1.0), period, seed);
  let n011 = grad(i.x, i.y + 1, i.z + 1, f - vec3f(0.0, 1.0, 1.0), period, seed);
  let n111 = grad(i.x + 1, i.y + 1, i.z + 1, f - vec3f(1.0, 1.0, 1.0), period, seed);
  return mix(mix(mix(n000, n100, w.x), mix(n010, n110, w.x), w.y), mix(mix(n001, n101, w.x), mix(n011, n111, w.x), w.y), w.z);
}
fn fbm(p: vec3f, period: i32, octaves: i32, seed: i32) -> f32 {
  var sum = 0.0; var amp = 0.5; var freq = 1.0; var norm = 0.0;
  for (var o = 0; o < octaves; o++) {
    sum += amp * perlin(p * freq, period * i32(freq), seed + o * 101);
    norm += amp; amp *= 0.5; freq *= 2.0;
  }
  return sum / norm;
}
@compute @workgroup_size(4, 4, 4) fn main(@builtin(global_invocation_id) id: vec3u) {
  if (any(id >= vec3u(${NOISE}u))) { return; }
  let f = vec3f(id) / ${NOISE}.0 * 4.0;
  let a = clamp(fbm(f, 4, 4, 7) * 2.2, -1.0, 1.0);
  let b = clamp(fbm(f + vec3f(1.7, 3.1, 5.3), 4, 3, 91) * 2.2, -1.0, 1.0);
  textureStore(dst, id, vec4f(a * 0.5 + 0.5, b * 0.5 + 0.5, 0.0, 1.0));
}
`;

  var FULLSCREEN_VS = /* wgsl */ `
struct FsOut { @builtin(position) pos: vec4f, @location(0) uv: vec2f };
@vertex fn vsFull(@builtin(vertex_index) i: u32) -> FsOut {
  let xy = vec2f(f32((i << 1u) & 2u), f32(i & 2u));
  var o: FsOut;
  o.pos = vec4f(xy * 2.0 - 1.0, 0.0, 1.0);
  o.uv = vec2f(xy.x, 1.0 - xy.y);
  return o;
}
`;

  // Le volume (lab/kora-webgpu/volume.wgsl.ts, sphère, sans foyers ni cristaux) + la coque.
  var VOLUME_WGSL = U_WGSL + FULLSCREEN_VS + /* wgsl */ `
@group(0) @binding(1) var noiseTex: texture_3d<f32>;
@group(0) @binding(2) var noiseSamp: sampler;
struct Field { d: f32, parts: vec4f };
fn noiseAt(q: vec3f) -> vec2f { return textureSampleLevel(noiseTex, noiseSamp, q, 0.0).rg; }
fn field(p: vec3f) -> Field {
  var f: Field; f.d = 0.0; f.parts = vec4f(0.0);
  let r = length(p);
  let edge = 1.0 - ss(0.72, 1.0, r);
  if (edge <= 0.0) { return f; }
  let q = p * u.vol1.x;
  let t = u.vol0.x;
  let n0 = noiseAt(q * 0.31 + vec3f(0.0, t * 0.021, t * 0.013));
  let warp = vec3f(n0.g, n0.r, n0.g * n0.r * 1.5) - 0.5;
  let n = noiseAt(q + warp * u.vol1.y + vec3f(t * 0.037, -t * 0.011, t * 0.025)).r;
  let ridge = 1.0 - abs(n * 2.0 - 1.0);
  let radial = mix(1.0, u.vol1.w, ss(0.25, 0.95, r));
  let db = ss(0.45, 0.9, n) * u.vol2.x * radial;
  let df = pow(ridge, u.vol0.w) * u.vol0.y * radial;
  let dc = u.vol1.z * exp(-r * r * 9.0);
  f.d = (db + df + dc) * edge;
  f.parts = vec4f(db, df, dc, 0.0) * edge;
  return f;
}
fn ign(px: vec2f) -> f32 { return fract(52.9829189 * fract(0.06711056 * px.x + 0.00583715 * px.y)); }
fn sphere(ro: vec3f, rd: vec3f, R: f32) -> vec2f {
  let b = dot(ro, rd); let c = dot(ro, ro) - R * R; let h = b * b - c;
  if (h < 0.0) { return vec2f(1.0, -1.0); }
  let s = sqrt(h);
  return vec2f(-b - s, -b + s);
}
// orb-volume-glass.ts::createGlassEnvironment : le noir de l'espace et trois lueurs rondes.
fn lueur(R: vec3f, pos: vec3f, rad: f32, col: vec3f) -> vec3f {
  let ang = acos(clamp(dot(R, normalize(pos)), -1.0, 1.0));
  let ar = asin(rad / length(pos));
  return col * (1.0 - ss(ar * 0.6 - 0.06, ar + 0.06, ang));
}
fn env(R: vec3f) -> vec3f {
  return lueur(R, vec3f(-6.0, 8.0, -4.0), 2.2, vec3f(0.74, 0.81, 1.0) * 3.0)
       + lueur(R, vec3f(7.0, -3.0, 5.0), 1.6, vec3f(0.21, 0.45, 1.0) * 1.2)
       + lueur(R, vec3f(2.0, 6.0, 8.0), 0.9, vec3f(1.0, 0.64, 0.35) * 1.0);
}
// Couche mince (iridescence) : une teinte qui tourne avec l'épaisseur optique vue.
fn film(c: f32) -> vec3f {
  let ph = 6.2831853 * (1.35 * mix(0.42, 0.12, c) * 3.2);
  return 0.5 + 0.5 * cos(vec3f(ph, ph + 2.1, ph + 4.2));
}
// Le volume, rendu dans une cible à DEMI-résolution : c'est ainsi que l'appli le montre à travers
// la coque (transmissionResolutionScale 0,5, orb-volume-glass.ts) — la coque l'échantillonne.
@fragment fn fsVolume(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let ndc = vec2f(fc.x / u.pad1.x * 2.0 - 1.0, 1.0 - fc.y / u.pad1.y * 2.0);
  let ro = vec3f(0.0, 0.0, u.cam.z);
  let rd = normalize(vec3f(ndc.x / u.cam.x, ndc.y / u.cam.y, -1.0));
  let hg = sphere(ro, rd, 1.03);
  if (hg.y < 0.0) { return vec4f(0.0, 0.0, 0.0, 1.0); }
  var col = vec3f(0.0);
  let hv = sphere(ro, rd, 1.01);
  if (hv.y > 0.0) {
    let steps = i32(u.cam.w);
    let t0 = hv.x; let t1 = hg.y;
    let dt = max(t1 - t0, 0.0) / f32(steps);
    let jitter = ign(vec2f(fc.x, u.pad1.y - fc.y) + u.res.w * vec2f(5.588238, 3.14159));
    var t = t0 + dt * jitter;
    var T = 1.0;
    let absorb = u.vol0.z; let density = u.vol0.y;
    for (var i = 0; i < 96; i++) {
      if (i >= steps || T < 0.01) { break; }
      let p = ro + rd * t;
      let F = field(p);
      let d = F.d; let parts = F.parts;
      if (d > 0.001) {
        let vk = clamp(parts.y / density, 0.0, 1.0);
        let veinC = mix(u.mid.xyz, u.hot.xyz, ss(0.35, 1.0, vk));
        let dim = 1.0 - 0.35 * u.vol3.x;
        var emis = (parts.x * u.deep.xyz * u.vol2.w + parts.y * veinC * u.vol2.z + parts.z * u.hot.xyz * 1.4) * dim;
        // Lumière interne au centre, ombrée par un échantillon à mi-chemin (piste du 14/09).
        let rl = length(p);
        let Li = u.vol2.y / (0.08 + rl * rl * 9.0);
        let S = field(p * 0.5);
        let shadow = exp(-S.d * rl * absorb * 0.6);
        emis += d * mix(u.deep.xyz, u.mid.xyz, 0.35 * (1.0 - u.vol3.x)) * Li * shadow;
        col += T * emis * dt;
        T *= exp(-d * absorb * dt);
      }
      t += dt;
    }
    col *= u.vol3.y;
  }
  return vec4f(col, 1.0);
}
@group(0) @binding(3) var volTex: texture_2d<f32>;
@group(0) @binding(4) var clampSamp: sampler;
fn uvDe(p: vec3f) -> vec2f { let c = toClip(p); let n = c.xy / c.w; return vec2f(n.x * 0.5 + 0.5, 0.5 - n.y * 0.5); }
// La coque de verre (orb-volume-glass.ts : transmission 1, IOR 1,45, épaisseur 0,35, dispersion
// 0,35, atténuation #9fe4ff sur 12, clearcoat, iridescence) à la manière de MeshPhysicalMaterial :
// le rayon réfracté traverse l'épaisseur (0,35 / 1,35 = 0,26 rayon) et lit le volume là où il
// ressort — c'est ce qui remplit le disque jusqu'au bord, net — puis le reflet de l'environnement.
@fragment fn fsVerre(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let ndc = vec2f(fc.x / u.res.x * 2.0 - 1.0, 1.0 - fc.y / u.res.y * 2.0);
  let ro = vec3f(0.0, 0.0, u.cam.z);
  let rd = normalize(vec3f(ndc.x / u.cam.x, ndc.y / u.cam.y, -1.0));
  let hg = sphere(ro, rd, 1.03);
  if (hg.y < 0.0) { return vec4f(0.0, 0.0, 0.0, 1.0); }
  let P = ro + rd * hg.x;
  let N = normalize(P);
  let halfSpread = (1.45 - 1.0) * 0.025 * 0.35;
  var trans = vec3f(0.0);
  for (var ch = 0; ch < 3; ch++) {
    let ior = 1.45 + (f32(ch) - 1.0) * halfSpread;
    let r = normalize(refract(rd, N, 1.0 / ior));
    let s = textureSampleLevel(volTex, clampSamp, uvDe(P + r * 0.26), 0.0);
    trans[ch] = s[ch];
  }
  trans *= pow(vec3f(0.35, 0.78, 1.0), vec3f(0.35 / 12.0));
  let c = clamp(dot(N, -rd), 0.0, 1.0);
  let fr = pow(1.0 - c, 5.0);
  let F = 0.034 * 0.9 + (1.0 - 0.034 * 0.9) * fr;
  let Fc = 0.04 + 0.96 * fr;
  let R = reflect(rd, N);
  let tint = mix(vec3f(1.0), film(c), u.vol3.w);
  let spec = env(R) * (F * tint + Fc) * u.misc.y;
  return vec4f(trans * (1.0 - max(F, Fc) * u.vol3.z) + spec * u.vol3.z, 1.0);
}
`;

  var GRAINS_COMPUTE_WGSL = U_WGSL + /* wgsl */ `
@group(0) @binding(1) var<storage, read_write> grains: array<vec4f>;
@group(0) @binding(2) var noiseTex: texture_3d<f32>;
@group(0) @binding(3) var noiseSamp: sampler;
fn hash(p: vec2f) -> f32 { return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453); }
fn pot(p: vec3f, off: vec3f) -> f32 {
  let t = u.vol0.x;
  return textureSampleLevel(noiseTex, noiseSamp, p * 0.55 + off + vec3f(t * 0.037, -t * 0.011, t * 0.025), 0.0).r;
}
fn curl(p: vec3f) -> vec3f {
  let e = 0.02;
  let dx = vec3f(e, 0.0, 0.0); let dy = vec3f(0.0, e, 0.0); let dz = vec3f(0.0, 0.0, e);
  let oA = vec3f(0.0); let oB = vec3f(0.31, 0.17, 0.53); let oC = vec3f(0.71, 0.43, 0.13);
  let dPz_dy = (pot(p + dy, oC) - pot(p - dy, oC)) / (2.0 * e);
  let dPy_dz = (pot(p + dz, oB) - pot(p - dz, oB)) / (2.0 * e);
  let dPx_dz = (pot(p + dz, oA) - pot(p - dz, oA)) / (2.0 * e);
  let dPz_dx = (pot(p + dx, oC) - pot(p - dx, oC)) / (2.0 * e);
  let dPy_dx = (pot(p + dx, oB) - pot(p - dx, oB)) / (2.0 * e);
  let dPx_dy = (pot(p + dy, oA) - pot(p - dy, oA)) / (2.0 * e);
  return vec3f(dPz_dy - dPy_dz, dPx_dz - dPz_dx, dPy_dx - dPx_dy);
}
fn ridge(p: vec3f) -> f32 { let n = pot(p, vec3f(0.0)); return 1.0 - abs(n * 2.0 - 1.0); }
fn ridgeGrad(p: vec3f) -> vec3f {
  let e = 0.03;
  return vec3f(
    ridge(p + vec3f(e, 0.0, 0.0)) - ridge(p - vec3f(e, 0.0, 0.0)),
    ridge(p + vec3f(0.0, e, 0.0)) - ridge(p - vec3f(0.0, e, 0.0)),
    ridge(p + vec3f(0.0, 0.0, e)) - ridge(p - vec3f(0.0, 0.0, e))) / (2.0 * e);
}
fn spawn(uv: vec2f, t: f32) -> vec3f {
  let a = hash(uv + t) * 6.2831853;
  let z = hash(uv * 1.7 + t + 3.1) * 2.0 - 1.0;
  let r = pow(hash(uv * 2.3 + t + 7.7), 0.5) * 0.95;
  let s = sqrt(1.0 - z * z);
  return vec3f(cos(a) * s, sin(a) * s, z) * r;
}
@compute @workgroup_size(64) fn simulate(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= ${GRAINS}u) { return; }
  let uv = vec2f((f32(i % ${GRAIN_TEXW}u) + 0.5) / ${GRAIN_TEXW}.0, (f32(i / ${GRAIN_TEXW}u) + 0.5) / ${GRAINS / GRAIN_TEXW}.0);
  let g = grains[i];
  var pos = g.xyz;
  let dt = u.grain.x;
  var life = g.w - dt * 0.12;
  var v = curl(pos) * 0.15 + ridgeGrad(pos) * 0.12;
  v += normalize(pos + 1e-4) * u.grain.w * (0.4 + length(pos));
  pos += v * dt;
  if (life <= 0.0 || length(pos) > 1.0) {
    pos = spawn(uv, floor(u.vol0.x * 3.0));
    life = 0.6 + hash(uv * 5.1 + u.vol0.x) * 0.8;
  }
  grains[i] = vec4f(pos, life);
}
`;

  var CORNERS = 'array(vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0), vec2f(1.0, 1.0))';

  var GRAINS_RENDER_WGSL = U_WGSL + /* wgsl */ `
@group(0) @binding(1) var<storage, read> grains: array<vec4f>;
struct VOut { @builtin(position) pos: vec4f, @location(0) corner: vec2f, @location(1) life: f32, @location(2) depth: f32 };
@vertex fn vs(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> VOut {
  let cs = ${CORNERS};
  let c = cs[vi];
  let g = grains[ii];
  var o: VOut;
  o.pos = offsetClip(toClip(g.xyz), c * u.grain.z * 0.5);
  o.corner = c * 0.5; o.life = g.w; o.depth = length(g.xyz);
  return o;
}
@fragment fn fs(i: VOut) -> @location(0) vec4f {
  let r2 = dot(i.corner, i.corner);
  if (r2 > 0.25) { discard; }
  let g = exp(-r2 * 14.0);
  let fade = ss(0.0, 0.15, i.life) * ss(1.4, 0.6, i.life);
  let col = mix(u.gColA.xyz, u.gColB.xyz, ss(0.2, 0.9, i.depth));
  return vec4f(col * g * u.grain.y * fade, 1.0);
}
`;

  // kora-armillary-node.ts : les arcs (rubans instanciés), la constellation et ses liens.
  var ARMILLAIRE_WGSL = U_WGSL + /* wgsl */ `
@group(0) @binding(1) var<storage, read> arcs: array<vec4f>;
@group(0) @binding(2) var<storage, read> pts: array<vec4f>;
@group(0) @binding(3) var<storage, read> paires: array<u32>;
struct ArcOut {
  @builtin(position) pos: vec4f,
  @location(0) au: f32, @location(1) side: f32, @location(2) fr: f32,
  @location(3) len: f32, @location(4) bright: f32, @location(5) mx: f32, @location(6) dash: f32,
  @location(7) ink: f32
};
@vertex fn vsArc(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> ArcOut {
  let seg = f32(vi / 6u);
  let k = vi % 6u;
  let along = array(0.0, 1.0, 1.0, 0.0, 1.0, 0.0);
  let sides = array(-1.0, -1.0, 1.0, -1.0, 1.0, 1.0);
  let au = (seg + along[k]) / ${ARC_SEG}.0;
  let side = sides[k];
  let a0 = arcs[ii * 4u]; let a1 = arcs[ii * 4u + 1u]; let a2 = arcs[ii * 4u + 2u]; let a3 = arcs[ii * 4u + 3u];
  let th = a1.w + au * a2.x + u.arm.x * a2.y;
  let lp = (a0.xyz * cos(th) + a1.xyz * sin(th)) * a0.w;
  let lt = a1.xyz * cos(th) - a0.xyz * sin(th);
  let s0 = toPx(lp); let s1 = toPx(lp + lt * 0.01);
  let d = s1 - s0;
  let n = normalize(vec2f(-d.y, d.x) + 1e-6);
  let w = a2.z * (1.0 + u.arm.z * 0.6) * u.res.z;
  let we = max(w, 1.2);
  var o: ArcOut;
  o.pos = offsetClip(toClip(lp), n * side * we * 0.5);
  o.ink = w / we;
  o.au = au; o.side = side; o.fr = front(lp.z); o.len = a2.x; o.bright = a2.w; o.mx = a3.x; o.dash = a3.y;
  return o;
}
@fragment fn fsArc(i: ArcOut) -> @location(0) vec4f {
  let ends = ss(0.0, 0.14, i.au) * ss(1.0, 0.86, i.au);
  let across = exp(i.side * i.side * -2.2);
  let dash = mix(1.0, step(0.45, fract(i.au * i.len * i.dash / 6.2831853)), step(0.5, i.dash));
  let fr = mix(0.22, 1.0, i.fr * i.fr);
  let col = mix(u.colA.xyz, u.colB.xyz, i.mx);
  let k = ends * across * dash * fr * i.bright * u.arm.y * (1.0 + u.arm.z * 0.8) * i.ink;
  return vec4f(col * k * 1.1, 1.0);
}
// Rodrigues : chaque point tourne autour de son axe (le compute de l'appli, fait ici au sommet).
fn point(j: u32) -> vec4f {
  let b = pts[j * 2u]; let ax = pts[j * 2u + 1u];
  let k = normalize(ax.xyz);
  let ang = u.arm.x * ax.w;
  let c = cos(ang); let s = sin(ang);
  let v = b.xyz;
  return vec4f(v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c), b.w);
}
struct LinkOut { @builtin(position) pos: vec4f, @location(0) k: f32, @location(1) fr: f32 };
@vertex fn vsLink(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> LinkOut {
  let along = array(0.0, 1.0, 1.0, 0.0, 1.0, 0.0);
  let sides = array(-1.0, -1.0, 1.0, -1.0, 1.0, 1.0);
  let pa = point(paires[ii * 2u]); let pb = point(paires[ii * 2u + 1u]);
  let ld = length(pa.xyz - pb.xyz);
  let lim = u.misc.x;
  let lk = ss(lim, lim * 0.45, ld);
  let p = mix(pa.xyz, pb.xyz, along[vi]);
  let d = toPx(pb.xyz) - toPx(pa.xyz);
  let n = normalize(vec2f(-d.y, d.x) + 1e-6);
  let w = 0.9 * u.res.z;
  let we = step(1e-3, lk) * max(w, 1.0);
  var o: LinkOut;
  o.pos = offsetClip(toClip(p), n * sides[vi] * we * 0.5);
  o.k = lk * max(pa.w, pb.w) * min(w, 1.0); o.fr = front(p.z);
  return o;
}
@fragment fn fsLink(i: LinkOut) -> @location(0) vec4f {
  let fr = mix(0.25, 1.0, i.fr);
  return vec4f(mix(u.colA.xyz, u.colB.xyz, 0.35) * i.k * fr * u.arm.w * 0.4, 1.0);
}
struct PtOut { @builtin(position) pos: vec4f, @location(0) corner: vec2f, @location(1) bright: f32, @location(2) fr: f32, @location(3) tw: f32 };
@vertex fn vsPt(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> PtOut {
  let cs = ${CORNERS};
  let c = cs[vi];
  let p = point(ii);
  let size = mix(2.2, 7.0, p.w * p.w) * (1.0 + u.arm.z * 0.4) * u.res.z;
  let se = max(size, 1.6);
  var o: PtOut;
  o.pos = offsetClip(toClip(p.xyz), c * se * 0.5);
  o.corner = c * 0.5; o.bright = p.w * (size / se) * (size / se); o.fr = front(p.z);
  o.tw = sin(u.arm.x * 1.7 * u.pad0.x + f32(ii) * 12.9898) * 0.25 + 0.75;
  return o;
}
@fragment fn fsPt(i: PtOut) -> @location(0) vec4f {
  let r2 = dot(i.corner, i.corner);
  if (r2 > 0.25) { discard; }
  let g = exp(r2 * -16.0);
  let col = mix(u.colB.xyz, u.colA.xyz, min(i.bright, 1.0));
  let k = g * i.bright * i.tw * mix(0.3, 1.0, i.fr) * u.arm.w;
  return vec4f(col * k, 1.0);
}
`;

  // Bloom en chaîne de mips (le BloomEffect pmndrs de l'appli) puis la sortie.
  var POST_WGSL = U_WGSL + FULLSCREEN_VS + /* wgsl */ `
@group(0) @binding(1) var samp: sampler;
@group(0) @binding(2) var src: texture_2d<f32>;
@group(0) @binding(3) var support: texture_2d<f32>;
fn tap(uv: vec2f) -> vec3f { return textureSampleLevel(src, samp, uv, 0.0).rgb; }
// Sous-échantillonnage à 13 prises (Jimenez 2014).
fn down13(uv: vec2f) -> vec3f {
  let t = 1.0 / vec2f(textureDimensions(src));
  let a = tap(uv + t * vec2f(-2.0, -2.0)); let b = tap(uv + t * vec2f(0.0, -2.0)); let c = tap(uv + t * vec2f(2.0, -2.0));
  let d = tap(uv + t * vec2f(-1.0, -1.0)); let e = tap(uv + t * vec2f(1.0, -1.0));
  let f = tap(uv + t * vec2f(-2.0, 0.0)); let g = tap(uv); let h = tap(uv + t * vec2f(2.0, 0.0));
  let i = tap(uv + t * vec2f(-1.0, 1.0)); let j = tap(uv + t * vec2f(1.0, 1.0));
  let k = tap(uv + t * vec2f(-2.0, 2.0)); let l = tap(uv + t * vec2f(0.0, 2.0)); let m = tap(uv + t * vec2f(2.0, 2.0));
  return (d + e + i + j) * 0.125 + (a + b + f + g) * 0.03125 + (b + c + g + h) * 0.03125
       + (f + g + k + l) * 0.03125 + (g + h + l + m) * 0.03125;
}
@fragment fn fsPrefilter(i: FsOut) -> @location(0) vec4f {
  let c = down13(i.uv);
  let l = dot(c, vec3f(0.2126, 0.7152, 0.0722));
  return vec4f(c * ss(u.misc.z, u.misc.z + 0.03, l), 1.0);
}
@fragment fn fsDown(i: FsOut) -> @location(0) vec4f { return vec4f(down13(i.uv), 1.0); }
@fragment fn fsUp(i: FsOut) -> @location(0) vec4f {
  let t = 1.0 / vec2f(textureDimensions(src));
  var s = tap(i.uv) * 4.0;
  s += (tap(i.uv + vec2f(-t.x, 0.0)) + tap(i.uv + vec2f(t.x, 0.0)) + tap(i.uv + vec2f(0.0, -t.y)) + tap(i.uv + vec2f(0.0, t.y))) * 2.0;
  s += tap(i.uv + vec2f(-t.x, -t.y)) + tap(i.uv + vec2f(t.x, -t.y)) + tap(i.uv + vec2f(-t.x, t.y)) + tap(i.uv + vec2f(t.x, t.y));
  let base = textureSampleLevel(support, samp, i.uv, 0.0).rgb;
  return vec4f(mix(base, s / 16.0, u.misc.w), 1.0);
}
fn aces(x: vec3f) -> vec3f { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), vec3f(0.0), vec3f(1.0)); }
fn srgb(c: vec3f) -> vec3f { return select(1.055 * pow(c, vec3f(1.0 / 2.4)) - 0.055, c * 12.92, c < vec3f(0.0031308)); }
@fragment fn fsOut(i: FsOut) -> @location(0) vec4f {
  let hdr = textureSampleLevel(support, samp, i.uv, 0.0).rgb;
  let bloom = tap(i.uv);
  let mapped = aces((hdr + bloom * u.post.x) * u.post.y);
  let s = srgb(mapped);
  // Alpha = luminance de la couleur affichée (passe de sortie de l'appli) ; la couleur est déjà
  // prémultipliée puisque chaque canal ≤ alpha.
  let a = clamp(max(s.r, max(s.g, s.b)) * 1.15, 0.0, 1.0);
  return vec4f(s, a);
}
`;

  // ---------- disponibilité ----------
  // Un adaptateur logiciel (SwiftShader : Brave sous Linux sans Vulkan, 27/10) rend sur le CPU,
  // dans le processus GPU qui compose aussi la page : tout l'affichage saccade. Le canvas 2D,
  // lui, reste accéléré ; on le garde.
  function logiciel(a) {
    var i = a.info || {};
    return !!(a.isFallbackAdapter || i.isFallbackAdapter || /swiftshader/i.test(i.architecture || ''));
  }
  var adapterPromesse = null;
  function obtenirAdapter() {
    if (!adapterPromesse) {
      adapterPromesse = (async function () {
        try {
          if (typeof navigator === 'undefined' || !navigator.gpu) return null;
          var a = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
          return a && !logiciel(a) ? a : null;
        } catch (e) { return null; }
      })();
    }
    return adapterPromesse;
  }
  async function disponible() {
    try { return !!(await obtenirAdapter()); } catch (e) { return false; }
  }

  // ---------- création ----------
  async function creer(canvas, opts) {
    opts = opts || {};
    // un adaptateur ne crée qu'un device : chaque orbe (grande Kora, actrice…) demande le sien
    var adapter = null;
    try { adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' }); } catch (e) { adapter = null; }
    if (!adapter || logiciel(adapter)) throw new Error('WebGPU indisponible');
    var avecChrono = adapter.features.has('timestamp-query');
    var device = await adapter.requestDevice({ requiredFeatures: avecChrono ? ['timestamp-query'] : [] });
    var perdu = false;
    device.lost.then(function () { perdu = true; });
    var ctx = canvas.getContext('webgpu');
    if (!ctx) throw new Error('contexte webgpu refusé');
    var format = navigator.gpu.getPreferredCanvasFormat();
    ctx.configure({ device: device, format: format, alphaMode: 'premultiplied' });

    function module(code, nom) {
      var m = device.createShaderModule({ code: code, label: nom });
      if (m.getCompilationInfo) {
        m.getCompilationInfo().then(function (info) {
          info.messages.forEach(function (msg) {
            if (msg.type === 'error') console.error('[KoraOrbeGPU] ' + nom + ' ' + msg.lineNum + ':' + msg.linePos + ' ' + msg.message);
          });
        });
      }
      return m;
    }

    // Uniformes
    var uData = new Float32Array(23 * 4);
    var uBuf = device.createBuffer({ size: uData.byteLength, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });

    // Bruit 3D (une fois)
    var noiseTex = device.createTexture({
      size: [NOISE, NOISE, NOISE], dimension: '3d', format: 'rgba8unorm',
      usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
    });
    var noisePipe = device.createComputePipeline({ layout: 'auto', compute: { module: module(NOISE_WGSL, 'bruit'), entryPoint: 'main' } });
    var enc0 = device.createCommandEncoder();
    var cp0 = enc0.beginComputePass();
    cp0.setPipeline(noisePipe);
    cp0.setBindGroup(0, device.createBindGroup({ layout: noisePipe.getBindGroupLayout(0), entries: [{ binding: 0, resource: noiseTex.createView() }] }));
    cp0.dispatchWorkgroups(NOISE / 4, NOISE / 4, NOISE / 4);
    cp0.end();
    device.queue.submit([enc0.finish()]);
    var repeat = device.createSampler({ addressModeU: 'repeat', addressModeV: 'repeat', addressModeW: 'repeat', magFilter: 'linear', minFilter: 'linear' });
    var clampS = device.createSampler({ addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge', magFilter: 'linear', minFilter: 'linear' });
    var noiseView = noiseTex.createView({ dimension: '3d' });

    // Grains (tirage initial comme l'appli)
    var init = new Float32Array(GRAINS * 4);
    for (var i = 0; i < GRAINS; i++) {
      var a = Math.random() * Math.PI * 2, z = Math.random() * 2 - 1, r = Math.sqrt(Math.random()) * 0.95, s = Math.sqrt(1 - z * z);
      init.set([Math.cos(a) * s * r, Math.sin(a) * s * r, z * r, Math.random() * 1.4], i * 4);
    }
    var grainBuf = device.createBuffer({ size: init.byteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
    device.queue.writeBuffer(grainBuf, 0, init);

    var arm = construireArmillaire();
    function stockage(arr) {
      var b = device.createBuffer({ size: arr.byteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
      device.queue.writeBuffer(b, 0, arr);
      return b;
    }
    var arcBuf = stockage(arm.arcs), ptBuf = stockage(arm.pts), paireBuf = stockage(arm.paires);
    var nPaires = arm.paires.length / 2;

    // Pipelines
    var additif = { color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' }, alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' } };
    var volMod = module(VOLUME_WGSL, 'volume');
    var volPipe = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module: volMod, entryPoint: 'vsFull' },
      fragment: { module: volMod, entryPoint: 'fsVolume', targets: [{ format: HDR }] },
      primitive: { topology: 'triangle-list' }
    });
    var verrePipe = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module: volMod, entryPoint: 'vsFull' },
      fragment: { module: volMod, entryPoint: 'fsVerre', targets: [{ format: HDR }] },
      primitive: { topology: 'triangle-list' }
    });
    var gcMod = module(GRAINS_COMPUTE_WGSL, 'grains-calcul');
    var grainSim = device.createComputePipeline({ layout: 'auto', compute: { module: gcMod, entryPoint: 'simulate' } });
    var grMod = module(GRAINS_RENDER_WGSL, 'grains-rendu');
    var grainPipe = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module: grMod, entryPoint: 'vs' },
      fragment: { module: grMod, entryPoint: 'fs', targets: [{ format: HDR, blend: additif }] },
      primitive: { topology: 'triangle-strip' }
    });
    var armMod = module(ARMILLAIRE_WGSL, 'armillaire');
    function armPipe(vs, fs, topo) {
      return device.createRenderPipeline({
        layout: 'auto',
        vertex: { module: armMod, entryPoint: vs },
        fragment: { module: armMod, entryPoint: fs, targets: [{ format: HDR, blend: additif }] },
        primitive: { topology: topo }
      });
    }
    var arcPipe = armPipe('vsArc', 'fsArc', 'triangle-list');
    var linkPipe = armPipe('vsLink', 'fsLink', 'triangle-list');
    var ptPipe = armPipe('vsPt', 'fsPt', 'triangle-strip');
    var postMod = module(POST_WGSL, 'post');
    function postPipe(fs, fmt) {
      return device.createRenderPipeline({
        layout: 'auto',
        vertex: { module: postMod, entryPoint: 'vsFull' },
        fragment: { module: postMod, entryPoint: fs, targets: [{ format: fmt }] },
        primitive: { topology: 'triangle-list' }
      });
    }
    var prePipe = postPipe('fsPrefilter', HDR), downPipe = postPipe('fsDown', HDR), upPipe = postPipe('fsUp', HDR), outPipe = postPipe('fsOut', format);

    var bgGrainSim = device.createBindGroup({ layout: grainSim.getBindGroupLayout(0), entries: [
      { binding: 0, resource: { buffer: uBuf } }, { binding: 1, resource: { buffer: grainBuf } },
      { binding: 2, resource: noiseView }, { binding: 3, resource: repeat }] });
    var bgVol = device.createBindGroup({ layout: volPipe.getBindGroupLayout(0), entries: [
      { binding: 0, resource: { buffer: uBuf } }, { binding: 1, resource: noiseView }, { binding: 2, resource: repeat }] });
    var bgGrain = device.createBindGroup({ layout: grainPipe.getBindGroupLayout(0), entries: [
      { binding: 0, resource: { buffer: uBuf } }, { binding: 1, resource: { buffer: grainBuf } }] });
    function bgArm(p, avecPaires) {
      var e = [{ binding: 0, resource: { buffer: uBuf } }];
      if (p !== ptPipe && p !== linkPipe) e.push({ binding: 1, resource: { buffer: arcBuf } });
      if (p !== arcPipe) e.push({ binding: 2, resource: { buffer: ptBuf } });
      if (avecPaires) e.push({ binding: 3, resource: { buffer: paireBuf } });
      return device.createBindGroup({ layout: p.getBindGroupLayout(0), entries: e });
    }
    var bgArc = bgArm(arcPipe, false), bgLink = bgArm(linkPipe, true), bgPt = bgArm(ptPipe, false);

    // Chronométrage GPU (timestamp-query) si la carte le permet
    var chrono = null;
    if (avecChrono) {
      chrono = {
        set: device.createQuerySet({ type: 'timestamp', count: 2 }),
        res: device.createBuffer({ size: 16, usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC }),
        lit: device.createBuffer({ size: 16, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ }),
        occupe: false
      };
    }
    var mesures = { cpuMs: 0, gpuMs: null, images: 0, adaptateur: (adapter.info && (adapter.info.vendor + ' ' + adapter.info.architecture)) || '' };

    // Cibles (dépendent de la taille)
    var W = 0, H = 0, hdr = null, volT = null, bgVerre = null, downs = [], ups = [], bgPost = null;
    function cible(w, h) {
      return device.createTexture({ size: [Math.max(1, w), Math.max(1, h)], format: HDR, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING });
    }
    // Une disposition « auto » ne garde que les liaisons que la passe lit vraiment.
    var UTILISE = new Map([[prePipe, [0, 1, 2]], [downPipe, [1, 2]], [upPipe, [0, 1, 2, 3]], [outPipe, [0, 1, 2, 3]]]);
    function bgP(pipe, src, support) {
      var toutes = [
        { binding: 0, resource: { buffer: uBuf } }, { binding: 1, resource: clampS },
        { binding: 2, resource: src.createView() }, { binding: 3, resource: (support || src).createView() }];
      var garder = UTILISE.get(pipe);
      return device.createBindGroup({ layout: pipe.getBindGroupLayout(0), entries: toutes.filter(function (e) { return garder.indexOf(e.binding) >= 0; }) });
    }
    function redimensionner() {
      var dpr = opts.dpr || Math.min(window.devicePixelRatio || 1, 2);
      var rect = canvas.getBoundingClientRect();
      var w = Math.max(2, Math.round((rect.width || canvas.width) * dpr));
      var h = Math.max(2, Math.round((rect.height || canvas.height) * dpr));
      if (w === W && h === H && hdr) return;
      W = canvas.width = w; H = canvas.height = h;
      [hdr, volT].concat(downs, ups).forEach(function (t) { if (t) t.destroy(); });
      hdr = cible(W, H);
      volT = cible(Math.ceil(W / 2), Math.ceil(H / 2));
      bgVerre = device.createBindGroup({ layout: verrePipe.getBindGroupLayout(0), entries: [
        { binding: 0, resource: { buffer: uBuf } }, { binding: 3, resource: volT.createView() }, { binding: 4, resource: clampS }] });
      downs = []; ups = [];
      for (var m = 1; m <= MIPS; m++) downs.push(cible(W >> m, H >> m));
      for (var n = 0; n < MIPS - 1; n++) ups.push(cible(W >> (n + 1), H >> (n + 1)));
      // Les liaisons : préfiltre hdr → d0 ; d(m-1) → d(m) ; montée u(n) = mix(d(n), up(u(n+1) ou d(dernier)))
      bgPost = { pre: bgP(prePipe, hdr), down: [], up: [], out: null };
      for (var d = 1; d < MIPS; d++) bgPost.down.push(bgP(downPipe, downs[d - 1]));
      for (var q = MIPS - 2; q >= 0; q--) {
        var plusPetit = q === MIPS - 2 ? downs[MIPS - 1] : ups[q + 1];
        bgPost.up[q] = bgP(upPipe, plusPetit, downs[q]);
      }
      bgPost.out = bgP(outPipe, ups[0], hdr);
    }
    redimensionner();

    // État animé
    var etat = { phase: 0, tArm: 0, frame: 0, dernier: null, cur: null };
    function cloneHumeur(h) {
      var o = {};
      Object.keys(h).forEach(function (k) { o[k] = Array.isArray(h[k]) ? h[k].slice() : h[k]; });
      return o;
    }
    etat.cur = cloneHumeur(HUMEURS.peau);

    function ecrireUniformes(dt, elan) {
      var c = etat.cur, u = uData;
      var D = 6.9; // le cadrage « Kora » de l'appli : fov 40°, corps sur ~40 % de la hauteur
      var tanS = Math.tan(Math.asin(1 / D));
      var f = 0.6 / tanS; // rayon apparent = 0,3 × min(L, H)
      var mn = Math.min(W, H);
      var rPx = 0.3 * mn;
      u.set([f * mn / W, f * mn / H, D, 48], 0);
      // Largeurs de l'appli (px CSS sur un 5K, orbe de ~290 px CSS de rayon) ramenées à notre rayon.
      u.set([W, H, rPx / 210, etat.frame % 64], 4);
      u.set([etat.phase, 3, 8, 7], 8); // densité, absorption, crête (DEFAULT_LOOK)
      u.set([0.42, 1.1, 0.35, 0.25], 12); // fréquence, warp, cœur, bord
      u.set([1.2, c.lumiere * (1 + 0.6 * elan), 6, 0], 16); // brume, lumière, veines, lueur du corps
      u.set([0, c.vol, c.verre, 0.25], 20); // chaleur, gain, verre, iridescence
      u.set(c.deep.concat(0), 24); u.set(c.mid.concat(0), 28); u.set(c.hot.concat(0), 32); u.set(lin('#ff8c3a').concat(0), 36);
      u.set([etat.tArm, c.arcs, 0.35 * elan, c.plexus], 40);
      u.set(c.aA.concat(0), 44); u.set(c.aB.concat(0), 48);
      // Grains : alpha 0,16 de l'appli ; taille ~ 2,8 px pour une orbe de 575 px de diamètre dans
      // l'appli, ramenée à la nôtre (plancher 1,5 px, l'alpha compense la surface perdue).
      var taille = 2.8 * (2 * rPx) / 575, plancher = Math.max(1.5, taille);
      u.set([Math.min(dt, 0.05), 0.16 * c.grains * (taille * taille) / (plancher * plancher) * 2.4, plancher, 0], 52);
      u.set(c.gA.concat(0), 56); u.set(c.gB.concat(0), 60);
      u.set([0.27, 1.0, 0.6, 0.5], 64); // liens, gain des reflets, seuil et rayon du bloom
      u.set([0.4, 0.85, 0, 0], 68); // force du bloom, exposition
      u.set([1 + elan, 0, 0, 0], 72); // scintillement
      u.set([Math.ceil(W / 2), Math.ceil(H / 2), 0, 0], 76); // taille de la cible du volume
      device.queue.writeBuffer(uBuf, 0, u);
    }

    function encoderSimulation(enc) {
      var cp = enc.beginComputePass();
      cp.setPipeline(grainSim);
      cp.setBindGroup(0, bgGrainSim);
      cp.dispatchWorkgroups(Math.ceil(GRAINS / 64));
      cp.end();
    }

    // Les grains naissent en boule uniforme : on laisse le champ les ranger avant la première image
    // (sinon un rendu unique — mouvement réduit — montre une sphère de poussière).
    (function prechauffer() {
      for (var k = 0; k < 90; k++) {
        etat.phase += (1 / 30) * 0.4;
        ecrireUniformes(1 / 30, 0);
        var e = device.createCommandEncoder();
        encoderSimulation(e);
        device.queue.submit([e.finish()]);
      }
    })();

    function passe(enc, view, pipe, bg, ts) {
      var desc = { colorAttachments: [{ view: view, loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 0 } }] };
      if (ts) desc.timestampWrites = ts;
      var p = enc.beginRenderPass(desc);
      p.setPipeline(pipe); p.setBindGroup(0, bg); p.draw(3); p.end();
    }

    function rendre(t, o) {
      if (perdu) return;
      o = o || {};
      var t0 = performance.now();
      var elan = Math.max(0, Math.min(1, +o.elan || 0));
      var visee = HUMEURS[o.humeur] || HUMEURS.peau;
      var dt = etat.dernier === null ? 0 : Math.max(0, Math.min(0.05, t - etat.dernier));
      etat.dernier = t;
      // Transition d'humeur en ~0,5 s (instantanée au premier rendu ou si o.instantane).
      var k = (dt === 0 || o.instantane) ? 1 : 1 - Math.exp(-dt / 0.5);
      Object.keys(visee).forEach(function (key) {
        var v = visee[key], c = etat.cur;
        if (Array.isArray(v)) { for (var n = 0; n < 3; n++) c[key][n] += (v[n] - c[key][n]) * k; } else { c[key] += (v - c[key]) * k; }
      });
      var vit = etat.cur.vitesse;
      // orb.ts : phase += dt × (0,4 repos + 1,0 × chaleur) ; armillaire × (1 + 1,5 × chaleur).
      etat.phase += dt * (0.4 + 1.0 * elan) * vit;
      etat.tArm += dt * (1 + 1.5 * elan) * vit;
      etat.frame++;
      ecrireUniformes(dt * vit * (1 + elan), elan);

      var enc = device.createCommandEncoder();
      if (dt > 0) encoderSimulation(enc);
      passe(enc, volT.createView(), volPipe, bgVol, chrono ? { querySet: chrono.set, beginningOfPassWriteIndex: 0 } : null);
      var rp = enc.beginRenderPass({ colorAttachments: [{ view: hdr.createView(), loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 1 } }] });
      rp.setPipeline(verrePipe); rp.setBindGroup(0, bgVerre); rp.draw(3);
      if (etat.cur.grains > 0.005) { rp.setPipeline(grainPipe); rp.setBindGroup(0, bgGrain); rp.draw(4, GRAINS); }
      if (etat.cur.plexus > 0.005) {
        rp.setPipeline(linkPipe); rp.setBindGroup(0, bgLink); rp.draw(6, nPaires);
        rp.setPipeline(ptPipe); rp.setBindGroup(0, bgPt); rp.draw(4, PLEXUS);
      }
      if (etat.cur.arcs > 0.005) { rp.setPipeline(arcPipe); rp.setBindGroup(0, bgArc); rp.draw(ARC_SEG * 6, ARCS); }
      rp.end();
      passe(enc, downs[0].createView(), prePipe, bgPost.pre);
      for (var d = 1; d < MIPS; d++) passe(enc, downs[d].createView(), downPipe, bgPost.down[d - 1]);
      for (var q = MIPS - 2; q >= 0; q--) passe(enc, ups[q].createView(), upPipe, bgPost.up[q]);
      passe(enc, ctx.getCurrentTexture().createView(), outPipe, bgPost.out,
        chrono ? { querySet: chrono.set, endOfPassWriteIndex: 1 } : null);
      var lire = false;
      if (chrono && !chrono.occupe) {
        enc.resolveQuerySet(chrono.set, 0, 2, chrono.res, 0);
        enc.copyBufferToBuffer(chrono.res, 0, chrono.lit, 0, 16);
        lire = true;
      }
      device.queue.submit([enc.finish()]);
      if (lire) {
        chrono.occupe = true;
        chrono.lit.mapAsync(GPUMapMode.READ).then(function () {
          var v = new BigUint64Array(chrono.lit.getMappedRange());
          var ms = Number(v[1] - v[0]) / 1e6;
          chrono.lit.unmap();
          chrono.occupe = false;
          if (ms > 0 && ms < 1000) mesures.gpuMs = mesures.gpuMs === null ? ms : mesures.gpuMs * 0.9 + ms * 0.1;
        }).catch(function () { chrono.occupe = false; });
      }
      var cpu = performance.now() - t0;
      mesures.cpuMs = mesures.images === 0 ? cpu : mesures.cpuMs * 0.9 + cpu * 0.1;
      mesures.images++;
    }

    return {
      rendre: rendre,
      redimensionner: redimensionner,
      mesures: function () { return { cpuMs: mesures.cpuMs, gpuMs: mesures.gpuMs, images: mesures.images, adaptateur: mesures.adaptateur, largeur: W, hauteur: H }; },
      detruire: function () {
        try { ctx.unconfigure(); } catch (e) { /* déjà parti */ }
        device.destroy();
        perdu = true;
      }
    };
  }

  window.KoraOrbeGPU = { disponible: disponible, creer: creer };

  // ============================================================
  // Démo : la page de banc (maquettes/orbe-gpu), derrière [data-orbe-demo].
  // ============================================================
  function demo(racine) {
    var canvas = racine.querySelector('[data-orbe-canvas]');
    var etatEl = racine.querySelector('[data-orbe-etat]');
    var statsEl = racine.querySelector('[data-orbe-stats]');
    var elanEl = racine.querySelector('[data-orbe-elan]');
    var elanOut = racine.querySelector('[data-orbe-elan-valeur]');
    var capture = racine.querySelector('[data-orbe-capture]');
    var legende = racine.querySelector('[data-orbe-capture-legende]');
    var calme = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var params = new URLSearchParams(location.search);
    var fige = params.has('t') ? parseFloat(params.get('t')) : null;
    var humeur = params.get('humeur') || 'peau';
    var elan = 0;
    var orbe = null, visible = true, rafId = 0, debut = performance.now();

    function dire(texte) { if (etatEl) { etatEl.textContent = texte; etatEl.hidden = false; } }
    function majCapture() {
      if (!capture) return;
      var src = capture.getAttribute(humeur === 'recherche' ? 'data-capture-recherche' : 'data-capture-peau');
      if (src && capture.getAttribute('src') !== src) capture.setAttribute('src', src);
      if (legende) legende.textContent = humeur === 'recherche'
        ? 'Choragos, mode recherche (avec la tenue électrique portée)'
        : 'Choragos, Kora au repos';
      racine.setAttribute('data-humeur', humeur);
    }
    function image(now) {
      rafId = 0;
      if (!orbe) return;
      var t = fige !== null ? fige : (now - debut) / 1000;
      orbe.rendre(t, { humeur: humeur, elan: elan });
      if (statsEl && orbe.mesures().images % 30 === 1) {
        var m = orbe.mesures();
        statsEl.textContent = m.largeur + '×' + m.hauteur + ' px · CPU ' + m.cpuMs.toFixed(2) + ' ms/image · GPU ' +
          (m.gpuMs === null ? 'non mesuré' : m.gpuMs.toFixed(2) + ' ms/image') + (m.adaptateur ? ' · ' + m.adaptateur : '');
      }
      planifier();
    }
    function planifier() {
      if (calme || fige !== null || !visible || document.hidden || rafId) return;
      rafId = requestAnimationFrame(image);
    }
    function uneImage() {
      // Mouvement réduit ou temps figé : un seul rendu (on rend deux fois à un pas d'écart pour
      // que les transitions d'humeur soient atteintes).
      if (!orbe) return;
      var t = fige !== null ? fige : 8;
      orbe.rendre(t, { humeur: humeur, elan: elan, instantane: true });
      orbe.rendre(t + 1 / 60, { humeur: humeur, elan: elan, instantane: true });
      if (statsEl) {
        var m = orbe.mesures();
        statsEl.textContent = m.largeur + '×' + m.hauteur + ' px · image fixe (' + (calme ? 'mouvement réduit' : 't = ' + t + ' s') + ')';
      }
    }

    racine.querySelectorAll('input[name="humeur"]').forEach(function (r) {
      if (r.value === humeur) r.checked = true;
      r.addEventListener('change', function () {
        if (!r.checked) return;
        humeur = r.value; majCapture();
        if (calme || fige !== null) uneImage();
      });
    });
    if (elanEl) {
      elanEl.addEventListener('input', function () {
        elan = (+elanEl.value || 0) / 100;
        if (elanOut) elanOut.textContent = elan.toFixed(2);
        if (calme || fige !== null) uneImage();
      });
    }
    majCapture();

    disponible().then(function (ok) {
      if (!ok) { dire('WebGPU n’est pas disponible dans ce navigateur : l’orbe GPU ne peut pas être montrée ici (la page V4 garde son dessin 2D).'); racine.setAttribute('data-gpu', 'non'); return; }
      return creer(canvas, { dpr: Math.min(window.devicePixelRatio || 1, 2) }).then(function (o) {
        orbe = o;
        racine.setAttribute('data-gpu', 'oui');
        if (calme || fige !== null) { uneImage(); return; }
        planifier();
      });
    }).catch(function (e) {
      dire('L’orbe GPU n’a pas pu démarrer : ' + (e && e.message ? e.message : e));
      racine.setAttribute('data-gpu', 'erreur');
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entrees) {
        visible = entrees[0].isIntersecting;
        planifier();
      }).observe(canvas);
    }
    document.addEventListener('visibilitychange', planifier);
    var attente = 0;
    window.addEventListener('resize', function () {
      clearTimeout(attente);
      attente = setTimeout(function () {
        if (!orbe) return;
        orbe.redimensionner();
        if (calme || fige !== null) uneImage();
      }, 120);
    });
  }

  var racine = document.querySelector('[data-orbe-demo]');
  if (racine) demo(racine);
})();
