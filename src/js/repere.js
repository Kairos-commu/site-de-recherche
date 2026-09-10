(() => {
  const cv = document.querySelector('.repere-cosmos');
  if (!cv) return;               // le décor ne vit que sur l'accueil
  const ctx = cv.getContext('2d', { alpha: false });
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- états de Kora, repris de l'application ---------- */
  const MOODS = {
    rest:   { r:111, g:201, b:228, flow:1.00, beat:3.4, amp:0.26, glow:1.00, orb:0.30 },
    search: { r:233, g:165, b: 68, flow:2.30, beat:1.4, amp:0.40, glow:1.35, orb:1.00 },
    cold:   { r:120, g:140, b:170, flow:0.35, beat:5.0, amp:0.13, glow:0.60, orb:0.10 },
    speak:  { r:169, g:143, b:201, flow:1.70, beat:2.0, amp:0.46, glow:1.20, orb:0.45 }
  };
  let mood = { ...MOODS.rest };
  let target = MOODS.rest;

  /* les trois sommets, en orbite — rayons géométriques, périodes selon Kepler (T ∝ r^1.5) */
  const ORBITS = [
    { k:1.58, col:'233,165,68',  ph:0.4 },   // recherche
    { k:2.06, col:'111,201,228', ph:2.3 },   // quotidien
    { k:2.62, col:'169,143,201', ph:4.6 }    // jeu
  ];
  const TILT = 0.30;

  let W=0, H=0, DPR=1, COUNT=0, pts=null, seed=null, stars=null;

  function build() {
    DPR = Math.min(devicePixelRatio || 1, 1.75);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W*DPR); cv.height = Math.round(H*DPR);
    cv.style.width = W+'px'; cv.style.height = H+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);

    COUNT = Math.max(900, Math.min(3400, Math.round(W*H/620)));

    // Fibonacci : aucune couture, aucun pôle dense
    pts = new Float32Array(COUNT*3);
    seed = new Float32Array(COUNT*3);
    const phi = Math.PI*(3-Math.sqrt(5));
    for (let i=0;i<COUNT;i++){
      const y = 1-(i/(COUNT-1))*2, rad = Math.sqrt(Math.max(0,1-y*y)), th = phi*i;
      pts[i*3]=Math.cos(th)*rad; pts[i*3+1]=y; pts[i*3+2]=Math.sin(th)*rad;
      // d'où chaque point arrive pendant la condensation
      seed[i*3]   = 1.9 + Math.random()*2.1;        // distance de départ
      seed[i*3+1] = (Math.random()-0.5)*2.6;        // enroulement
      seed[i*3+2] = Math.random()*0.42;             // décalage d'arrivée
    }

    const sc = Math.round(W*H/5200);
    stars = new Float32Array(sc*4);
    for (let i=0;i<sc;i++){
      stars[i*4]=Math.random()*W; stars[i*4+1]=Math.random()*H;
      stars[i*4+2]=Math.random()*0.75+0.25; stars[i*4+3]=Math.random()*Math.PI*2;
    }
  }

  /* bruit coulant : trois sinus croisés — de grandes nappes lentes */
  const swell = (x,y,z,t) =>
    Math.sin(x*2.1+t)*0.5 + Math.sin(y*1.7-t*0.83)*0.32 + Math.sin(z*2.6+t*1.21)*0.18;

  /* double battement « lub-dub » */
  function pulse(t, period){
    const p = (t % period)/period;
    if (p<0.10) return Math.sin(p/0.10*Math.PI);
    if (p<0.17) return 0;
    if (p<0.29) return Math.sin((p-0.17)/0.12*Math.PI)*0.55;
    return 0;
  }

  const lerp=(a,b,k)=>a+(b-a)*k;
  const easeOut=x=>1-Math.pow(1-x,3);

  const BIRTH = 2.6;          // durée de la condensation
  let t0 = performance.now();
  let scroll = 0;

  function frame(now){
    const t = (now-t0)/1000;

    // naissance : la matière arrive, puis la lumière monte (jamais les deux ensemble)
    const born = still ? 1 : Math.min(1, t/BIRTH);
    const gather = easeOut(born);
    const lit = still ? 1 : easeOut(Math.max(0, (born-0.30)/0.70));

    const k = still ? 1 : 0.022;
    for (const key in mood) mood[key] = lerp(mood[key], target[key], k);

    ctx.fillStyle='#05070B'; ctx.fillRect(0,0,W,H);
    ctx.globalCompositeOperation='lighter';

    for (let i=0;i<stars.length;i+=4){
      const tw = 0.55+0.45*Math.sin(t*0.6+stars[i+3]);
      ctx.fillStyle='rgba(190,210,240,'+(stars[i+2]*tw*0.5*lit).toFixed(3)+')';
      ctx.fillRect(stars[i],stars[i+1],1.15,1.15);
    }

    // la caméra glisse en descendant : on traverse l'espace
    const wide = W>900;
    const cx = (wide ? W*0.70 : W*0.5) - scroll*(wide ? W*0.16 : 0);
    const cy = (wide ? H*0.48 : H*0.32) - scroll*H*0.10;
    const R  = Math.min(W,H)*(wide?0.30:0.26)*(1-scroll*0.24);

    const beat = still?0:pulse(t,mood.beat);
    const spin = still?0.6:t*0.11;
    const flow = still?0:t*mood.flow;
    const cos=Math.cos(spin), sin=Math.sin(spin);
    const col = mood.r.toFixed(0)+','+mood.g.toFixed(0)+','+mood.b.toFixed(0);

    // ---- les trois orbites : le plan du site, dessiné ----
    const oa = mood.orb*lit*gather;
    if (oa > 0.02) {
      for (let i=0;i<ORBITS.length;i++){
        const o = ORBITS[i], rx = R*o.k, ry = rx*Math.sin(TILT);
        ctx.strokeStyle='rgba('+o.col+','+(oa*0.16).toFixed(3)+')';
        ctx.lineWidth=1;
        ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); ctx.stroke();
        // corps en révolution — période dérivée du rayon, 3ᵉ loi de Kepler
        const ang = still ? o.ph : o.ph + t*(0.30/Math.pow(o.k,1.5));
        const bx = cx+Math.cos(ang)*rx, by = cy+Math.sin(ang)*ry;
        const front = (Math.sin(ang)+1)*0.5;             // devant / derrière Kora
        const br = (1.6+front*1.7);
        const g2 = ctx.createRadialGradient(bx,by,0,bx,by,br*5);
        g2.addColorStop(0,'rgba('+o.col+','+(oa*(0.35+front*0.5)).toFixed(3)+')');
        g2.addColorStop(1,'rgba('+o.col+',0)');
        ctx.fillStyle=g2; ctx.fillRect(bx-br*5,by-br*5,br*10,br*10);
        ctx.fillStyle='rgba('+o.col+','+(oa*(0.45+front*0.5)).toFixed(3)+')';
        ctx.fillRect(bx-br/2,by-br/2,br,br);
      }
    }

    // ---- la lueur du cœur ----
    const gr = ctx.createRadialGradient(cx,cy,0,cx,cy,R*(1.5+beat*0.5));
    gr.addColorStop(0,  'rgba('+col+','+(0.30*mood.glow*lit*(1+beat*0.7)).toFixed(3)+')');
    gr.addColorStop(0.4,'rgba('+col+','+(0.07*mood.glow*lit).toFixed(3)+')');
    gr.addColorStop(1,  'rgba('+col+',0)');
    ctx.fillStyle=gr; ctx.fillRect(cx-R*2,cy-R*2,R*4,R*4);

    // ---- la peau ----
    const amp = mood.amp*(1+beat*0.55);
    for (let i=0;i<COUNT;i++){
      const x=pts[i*3], y=pts[i*3+1], z=pts[i*3+2];
      let xr = x*cos-z*sin, zr = x*sin+z*cos;
      let yr = y;
      const d = 1 + swell(xr,yr,zr,flow)*amp;

      // condensation : le point arrive de loin en s'enroulant
      let rr = d;
      if (born < 1) {
        const g = easeOut(Math.max(0, (born - seed[i*3+2]) / (1-seed[i*3+2] || 1)));
        rr = d*g + seed[i*3]*(1-g);
        const w = (1-g)*seed[i*3+1];
        const cw=Math.cos(w), sw=Math.sin(w);
        const nx = xr*cw - zr*sw; zr = xr*sw + zr*cw; xr = nx;
      }

      const px = cx + xr*R*rr, py = cy + yr*R*rr;
      const depth = (zr+1)*0.5;
      const a = (0.10+depth*depth*0.62)*mood.glow*lit;
      const sz = 0.75+depth*1.5;
      ctx.fillStyle='rgba('+col+','+a.toFixed(3)+')';
      ctx.fillRect(px-sz/2,py-sz/2,sz,sz);
    }
    ctx.globalCompositeOperation='source-over';

    if (!still) requestAnimationFrame(frame);
  }

  /* l'orbe suit la lecture */
  const io = new IntersectionObserver((entries)=>{
    let best=null;
    for (const e of entries) if (e.isIntersecting && (!best||e.intersectionRatio>best.intersectionRatio)) best=e;
    if (best) target = MOODS[best.target.dataset.mood] || MOODS.rest;
  }, { threshold:[0.25,0.5,0.75], rootMargin:'-18% 0px -30% 0px' });
  document.querySelectorAll('[data-mood]').forEach(s=>io.observe(s));

  let ticking=false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      scroll = Math.min(1, scrollY/max);
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive:true });

  let rt;
  addEventListener('resize', ()=>{ clearTimeout(rt); rt=setTimeout(()=>{ build(); if(still) frame(performance.now()); },140); });

  build(); onScroll();
  requestAnimationFrame(frame);
})();
