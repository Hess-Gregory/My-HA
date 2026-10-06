/* Plan 3D interactif de la maison — lumières, températures, portes et mouvements en direct */
import * as THREE from '/local/plan3d/three.module.min.js';
import { OrbitControls } from '/local/plan3d/OrbitControls.js';

const ROOM_TEMPS = [
  ['Salon', 560, 205, 'sensor.temp_piece_de_vie_sonoff_a480146b56_temperature'],
  ['Salle à manger', 598, 330, 'sensor.vanne_living_salle_a_manger_temperature'],
  ['Cuisine', 395, 250, 'sensor.vanne_living_cuisine_temperature'],
  ['Chambre adulte', 90, 357, 'sensor.temp_chambre_adulte_sonoff_a480146b5b_temperature'],
  ['Chambre enfant', 262, 232, 'sensor.temp_chambre_enfants_sonoff_a480146b58_temperature'],
  ['Salle de bain', 75, 175, 'sensor.temp_salle_de_bain_sonoff_a480146b5d_temperature'],
  ['Hall d’entrée', 330, 75, 'sensor.temp_couloir_sonoff_a480146b60_temperature'],
  ['Buanderie', 380, 180, 'sensor.buanderie_local_tech_detecteur_incendie_temperature'],
  ['WC', 185, 140, null],
];
const MOTION = [['binary_sensor.hall_dentree_mouvement_couloir_mouvement', 300, 130], ['binary_sensor.piece_de_vie_detecteur_living_mouvement', 600, 230]];
const VIEWS = {
  'Vue générale': { pos: [0.4, 26, 9.5], tgt: [0.4, 0, 0.3] },
  'Salon': { pos: [6.0, 9.5, 6.5], tgt: [3.3, 0.6, -2.4] },
  'Salle à manger': { pos: [1.6, 9, 7.5], tgt: [4.2, 0.6, 1.4] },
  'Cuisine': { pos: [4.6, 6.5, 3.6], tgt: [0.4, 0.7, 1.9] },
  'Chambres': { pos: [-3.5, 13, 9], tgt: [-4.2, 0, 2.2] },
};

const k2rgb = (k) => { const t = k / 100; let r, g, b; if (t <= 66) { r = 255; g = 99.47 * Math.log(t) - 161.12; b = t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04; } else { r = 329.7 * Math.pow(t - 60, -0.1332); g = 288.12 * Math.pow(t - 60, -0.0755); b = 255; } const c = (v) => Math.max(0, Math.min(255, Math.round(v))); return [c(r), c(g), c(b)]; };
const hsv2rgb = (h, s) => { const f = (n) => { const k = (n + h / 60) % 6; return Math.round(255 * (1 - s * Math.max(0, Math.min(k, 4 - k, 1)))); }; return [f(5), f(3), f(1)]; };
const RGBM = ['hs', 'rgb', 'rgbw', 'rgbww', 'xy'];
const SWATCH = [['ct', 2700], ['rgb', [255, 40, 40]], ['rgb', [255, 140, 20]], ['rgb', [255, 0, 150]], ['rgb', [140, 40, 255]], ['rgb', [0, 110, 255]], ['rgb', [0, 220, 130]], ['ct', 6000]];
const BEAMS = [['light.salon_l_salon', 575, 95, 1.95, 70], ['light.salle_a_manger_lg', 568, 269.5, 1.62, 34], ['light.salle_a_manger_lc', 598, 269.5, 1.62, 34], ['light.salle_a_manger_ld', 628, 269.5, 1.62, 34],
  ['light.salle_de_bain_salle_de_bain', 75, 160, 2.15, 50], ['light.chambre_matteo', 262, 292, 2.15, 60], ['light.cuisine_evier', 344, 300, 1.43, 20],
  ...[287, 306, 326, 344].map((y, i) => ['light.cuisine_s_cuisine_' + (i + 1), 373, y, 2.02, 24])];

class Floorplan3DCard extends HTMLElement {
  setConfig(c) { this.cfg = c || {}; }
  getCardSize() { return 12; }
  set hass(h) {
    this._h = h;
    if (!this._ready) { if (!this._building) { this._building = true; requestAnimationFrame(() => this._setup()); } return; }
    this._sync();
  }
  connectedCallback() { this._alive = true; if (this._ready) this._loop(); }
  disconnectedCallback() { this._alive = false; }

  /* ------------------------------------------------------------------ */
  _setup() {
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>
      :host{display:block}
      .wrap{position:relative;width:100%;height:${this.cfg.height || 'calc(100vh - 112px)'};min-height:420px;border-radius:22px;overflow:hidden;background:#17151f;box-shadow:0 10px 30px rgba(0,0,0,.35)}
      canvas{display:block;width:100%;height:100%;touch-action:none}
      .ov{position:absolute;inset:0;pointer-events:none}
      .lb{position:absolute;transform:translate(-50%,-50%);padding:5px 12px;border-radius:999px;font:600 13px/1.2 system-ui,Roboto,sans-serif;white-space:nowrap;background:rgba(24,20,34,.72);color:#f3eee6;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.12);box-shadow:0 4px 12px rgba(0,0,0,.3);transition:opacity .2s}
      .lb b{font-weight:800;color:#ffd27a;margin-left:6px}
      .lb.alert{background:rgba(220,40,60,.85);border-color:rgba(255,255,255,.3)}
      .bar{position:absolute;left:12px;right:12px;top:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;pointer-events:none}
      .bar>*{pointer-events:auto}
      .t{font:800 18px system-ui,Roboto,sans-serif;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.6);margin-right:auto}
      .t small{display:block;font-weight:500;font-size:12px;opacity:.75}
      button{appearance:none;border:1px solid rgba(255,255,255,.18);background:rgba(24,20,34,.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#f3eee6;border-radius:999px;padding:8px 14px;font:700 13px system-ui,Roboto,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}
      button.on{background:#ffd27a;color:#1c1826;border-color:#ffd27a}
      .views{position:absolute;left:12px;bottom:12px;display:flex;flex-wrap:wrap;gap:6px}
      .info{position:absolute;right:12px;bottom:12px;padding:8px 12px;border-radius:14px;background:rgba(24,20,34,.72);color:#f3eee6;font:600 12px system-ui,Roboto,sans-serif;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.12)}
      .toast{position:absolute;left:50%;top:64px;transform:translateX(-50%);padding:8px 16px;border-radius:999px;background:rgba(24,20,34,.9);color:#fff;font:700 13px system-ui,Roboto,sans-serif;opacity:0;transition:opacity .25s;pointer-events:none}
      .toast.show{opacity:1}
      .amb{position:absolute;right:12px;top:64px;display:flex;flex-direction:column;gap:6px;align-items:flex-end}
      .pn{position:absolute;left:0;top:0;width:300px;box-sizing:border-box;padding:14px;border-radius:24px;background:rgba(26,22,36,.84);backdrop-filter:blur(18px) saturate(1.4);-webkit-backdrop-filter:blur(18px) saturate(1.4);border:1px solid rgba(255,255,255,.14);box-shadow:0 22px 50px rgba(0,0,0,.55),0 0 46px -8px var(--c,transparent);color:#f3eee6;font:600 13px system-ui,Roboto,sans-serif;opacity:0;transform:scale(.9) translateY(10px);transform-origin:top left;transition:opacity .2s,transform .3s cubic-bezier(.2,.9,.3,1.25),box-shadow .4s;pointer-events:none;z-index:5}
      .pn.show{opacity:1;transform:none;pointer-events:auto}
      .ph{display:flex;align-items:center;gap:10px}
      .pdot{width:40px;height:40px;border-radius:50%;flex:none;background:var(--c,#444);box-shadow:0 0 20px var(--c,transparent);display:grid;place-items:center;font-size:19px;transition:background .3s,box-shadow .3s}
      .pt{flex:1;min-width:0;font-weight:800;font-size:15px;line-height:1.2}.pt div{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pt small{display:block;font-weight:500;font-size:12px;opacity:.7;margin-top:2px}
      .pw{position:relative;width:54px;height:32px;padding:0;border-radius:999px;background:#3b3846;flex:none;transition:background .25s}
      .pw::after{content:'';position:absolute;left:3px;top:3px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.4);transition:transform .25s cubic-bezier(.3,1.4,.5,1)}
      .pw.on{background:var(--c,#ffd27a)}.pw.on::after{transform:translateX(22px)}
      .px{width:32px;height:32px;padding:0;flex:none}
      .row{display:flex;align-items:center;gap:10px;margin-top:14px}.row>span{width:20px;text-align:center;font-size:16px}.row b{width:42px;text-align:right}
      input[type=range]{-webkit-appearance:none;appearance:none;flex:1;height:34px;border-radius:12px;background:var(--trk,#333);outline:none;margin:0;border:1px solid rgba(255,255,255,.1)}
      input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:10px;height:42px;border-radius:6px;background:#fff;box-shadow:0 0 0 2px rgba(0,0,0,.25),0 2px 10px rgba(0,0,0,.5)}
      input[type=range]::-moz-range-thumb{width:10px;height:42px;border-radius:6px;background:#fff;border:none}
      .wh{display:flex;gap:12px;align-items:center;margin-top:14px}.hw{width:148px;height:148px;border-radius:50%;touch-action:none;cursor:crosshair;flex:none;box-shadow:0 6px 20px rgba(0,0,0,.4)}
      .sws{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;flex:1}.sws i{display:block;height:30px;border-radius:10px;cursor:pointer;border:2px solid rgba(255,255,255,.18);transition:transform .15s}.sws i:active{transform:scale(.9)}
      .more{width:100%;margin-top:14px}
      .hide{display:none!important}
      @media (max-width:600px){.t{font-size:15px}.views button{padding:6px 10px;font-size:12px}.info{display:none}.amb{top:auto;bottom:56px}
        .pn{left:8px!important;right:8px;top:auto!important;bottom:8px;width:auto;transform-origin:bottom center}}
    </style>
    <div class="wrap"><canvas></canvas><div class="ov"></div>
      <div class="bar"><div class="t">🏠 Ma maison en 3D<small>Touchez une lampe ou un radiateur · glissez pour tourner · pincez pour zoomer</small></div>
        <button class="walls">🧱 Murs bas</button><button class="mode">🌓 Auto</button><button class="alarm">🛡️ …</button></div>
      <div class="amb"><button data-a="cine">🎬 Cinéma</button><button data-a="diner">🍽️ Dîner</button><button data-a="off">⚫ Tout éteindre</button></div>
      <div class="views"></div><div class="info"></div><div class="toast"></div>
      <div class="pn"><div class="ph"><div class="pdot">💡</div><div class="pt"><div class="pname"></div><small class="pst"></small></div><button class="pw"></button><button class="px">✕</button></div>
        <div class="row rb"><span>☀️</span><input type="range" class="sb" min="1" max="100"><b class="bv"></b></div>
        <div class="wh rc"><canvas class="hw" width="296" height="296"></canvas><div class="sws"></div></div>
        <div class="row rt"><span>🔥</span><input type="range" class="sc" step="50"><span>❄️</span></div>
        <button class="more">⚙️ Plus d’options</button></div></div>`;
    this.$ = (s) => root.querySelector(s);
    const canvas = this.$('canvas'), wrap = this.$('.wrap');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer = renderer;
    const scene = new THREE.Scene(); this.scene = scene;
    const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 120); this.cam = cam;
    cam.position.set(-16, 34, 30);
    const ctl = new OrbitControls(cam, canvas); this.ctl = ctl;
    ctl.target.set(0.4, 0, 0.3); ctl.enableDamping = true; ctl.dampingFactor = 0.08; ctl.maxPolarAngle = 1.35; ctl.minDistance = 4; ctl.maxDistance = 45; ctl.autoRotateSpeed = 0.6;
    ctl.addEventListener('change', () => this._dirty = true);
    this.lights = {}; this.clickables = []; this.decor = []; this.pulses = []; this.walls = []; this.wallF = 1; this.wallTarget = 1; this._lastAct = Date.now();
    this._build();
    this._roomMask();
    this._goTo('Vue générale', 3500); // vol d'introduction
    // faisceaux lumineux (cônes volumétriques)
    BEAMS.forEach(([e, x, y, z, r]) => { const rec = this.lights[e]; if (!rec) return;
      const mat = new THREE.ShaderMaterial({ uniforms: { c: { value: new THREE.Color() }, o: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        vertexShader: 'varying float vy;void main(){vy=uv.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
        fragmentShader: 'uniform vec3 c;uniform float o;varying float vy;void main(){gl_FragColor=vec4(c*o*pow(vy,1.5),1.);}' });
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.04, r / 50, z, 40, 1, true), mat); const [a, b] = this.P(x, y); m.position.set(a, z / 2, b); m.renderOrder = 2; this.scene.add(m); (rec.beams = rec.beams || []).push(mat); });
    // anneau de sélection
    this.selRing = new THREE.Mesh(new THREE.RingGeometry(0.26, 0.31, 64), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9, depthTest: false })); this.selRing.rotation.x = -Math.PI / 2; this.selRing.visible = false; this.selRing.renderOrder = 3; scene.add(this.selRing);
    // éclairage d'ambiance (jour / nuit)
    this.hemi = new THREE.HemisphereLight('#ffffff', '#b8ab98', 1); scene.add(this.hemi);
    const sun = new THREE.DirectionalLight('#fff4e6', 1.8); sun.position.set(-6, 14, 7); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -11, right: 11, top: 8, bottom: -8, near: 1, far: 40 }); sun.shadow.bias = -0.0005;
    scene.add(sun); this.sun = sun;
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.18 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    this.night = 0; this.nightTarget = 0; this.mode = 'auto';
    // UI
    const views = this.$('.views');
    Object.keys(VIEWS).forEach((k) => { const b = document.createElement('button'); b.textContent = k; b.onclick = () => this._goTo(k); views.appendChild(b); });
    this.$('.mode').onclick = () => { this.mode = { auto: 'jour', jour: 'nuit', nuit: 'auto' }[this.mode]; this._sync(); };
    this.$('.walls').onclick = () => { this.wallTarget = this.wallTarget === 1 ? 0.28 : 1; this.$('.walls').textContent = this.wallTarget === 1 ? '🧱 Murs bas' : '🧱 Murs hauts'; this.$('.walls').classList.toggle('on', this.wallTarget !== 1); };
    root.querySelectorAll('.amb button').forEach((b) => (b.onclick = () => this._ambiance(b.dataset.a)));
    this._setupPanel();
    // labels
    const ov = this.$('.ov'); this.labels = ROOM_TEMPS.map(([n, x, y, e]) => { const d = document.createElement('div'); d.className = 'lb'; ov.appendChild(d); return { n, x, y, e, d }; });
    // interactions (tap = basculer la lumière)
    const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null;
    canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY, Date.now()]; this._lastAct = Date.now(); ctl.autoRotate = false; this.anim = null; });
    canvas.addEventListener('pointerup', (e) => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 8) return;
      const r = canvas.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ptr, cam); const hit = ray.intersectObjects(this.clickables, false)[0];
      if (!hit) return this._closePanel();
      const ent = hit.object.userData.entity, st = this._h.states[ent];
      if (!st || st.state === 'unavailable') return this._toast('Lampe indisponible');
      if (Date.now() - down[2] > 550 || !ent.startsWith('light.')) return this._more(ent);
      this._openPanel(ent, e.clientX - r.left, e.clientY - r.top, hit.object);
    });
    canvas.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ptr, cam); canvas.style.cursor = ray.intersectObjects(this.clickables, false).length ? 'pointer' : 'grab';
    });
    new ResizeObserver(() => { const w = wrap.clientWidth, h = wrap.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); this._dirty = true; }).observe(wrap);
    this._ready = true; this._alive = true; this._sync(); this._loop();
  }

  /* ------------------------------------------------------------------ */
  _build() {
    const scene = this.scene, S = 1 / 50, X0 = 390, Z0 = 190;
    const P = (x, y) => [(x - X0) * S, (y - Z0) * S];
    const M = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.75, metalness: 0 }, o));
    const decor = (c, i, o = {}) => { const m = new THREE.MeshStandardMaterial(Object.assign({ color: c, emissive: c, emissiveIntensity: i, roughness: 1 }, o)); m.userData.base = i; this.decor.push(m); return m; };
    const MAT = {
      wallTop: M('#3d3d42'), wall: M('#f3f1ed', { roughness: 0.9 }), oak: M('#c9a57a'), oakDark: M('#9c7752'), oakLight: M('#d8c09a'),
      tile: M('#d9d7d2', { roughness: 0.6 }), tileGrey: M('#c6c7c6', { roughness: 0.55 }), white: M('#fbfbfa', { roughness: 0.4 }),
      greige: M('#cfcbc3', { roughness: 0.6 }), worktop: M('#e8e6e1', { roughness: 0.35 }), black: M('#18181a', { roughness: 0.3 }), steel: M('#b9bcc0', { metalness: 0.6, roughness: 0.3 }),
      fabric: M('#d8d4cc', { roughness: 1 }), fabric2: M('#cfc9be', { roughness: 1 }), green: M('#7d8f74', { roughness: 1 }), sofa: M('#45464b', { roughness: 0.95 }), sofa2: M('#3a3b40', { roughness: 0.95 }),
      velvet: M('#d9cfc0', { roughness: 1 }), walnut: M('#6b4a32'), mirror: M('#cfe2ea', { roughness: 0.05, metalness: 0.4 }), rug: M('#b9b39f', { roughness: 1 }), rug2: M('#e6dccb', { roughness: 1 }), patine: M('#e9e3d8', { roughness: 0.7 }),
      window: M('#a9cfe3', { transparent: true, opacity: 0.55, roughness: 0.1 }),
    };
    const add = (m, cast = true) => { m.castShadow = cast; m.receiveShadow = true; scene.add(m); return m; };
    const box = (x0, y0, x1, y1, z0, z1, mat, cast = true) => { const [a, b] = P(Math.min(x0, x1), Math.min(y0, y1)), [c, d] = P(Math.max(x0, x1), Math.max(y0, y1)); const m = new THREE.Mesh(new THREE.BoxGeometry(c - a, z1 - z0, d - b), mat); m.position.set((a + c) / 2, (z0 + z1) / 2, (b + d) / 2); if (mat === MAT.wall || mat === MAT.wallTop || mat === MAT.window) this._wall(m); return add(m, cast); };
    const cyl = (x, y, r, z0, z1, mat, seg = 24) => { const [a, b] = P(x, y); const m = new THREE.Mesh(new THREE.CylinderGeometry(r * S, r * S, z1 - z0, seg), mat); m.position.set(a, (z0 + z1) / 2, b); return add(m); };
    const sphere = (x, y, r, z, mat) => { const [a, b] = P(x, y); const m = new THREE.Mesh(new THREE.SphereGeometry(r * S, 18, 14), mat); m.position.set(a, z, b); return add(m, false); };
    const disc = (x, y, r, z, mat) => { const [a, b] = P(x, y); const m = new THREE.Mesh(new THREE.CircleGeometry(r * S, 40), mat); m.rotation.x = -Math.PI / 2; m.position.set(a, z, b); return add(m, false); };
    const floor = (pts, mat) => { const sh = new THREE.Shape(); pts.forEach(([x, y], i) => { const [a, b] = P(x, y); i ? sh.lineTo(a, -b) : sh.moveTo(a, -b); }); const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), mat); m.rotation.x = -Math.PI / 2; m.position.y = 0.002; m.receiveShadow = true; scene.add(m); };
    const WH = 2.3, WT = 9;
    const wall = (x0, y0, x1, y1, gaps = []) => {
      const hor = y0 === y1, a = hor ? Math.min(x0, x1) : Math.min(y0, y1), b = hor ? Math.max(x0, x1) : Math.max(y0, y1);
      const segs = []; let cur = a; [...gaps].sort((p, q) => p[0] - q[0]).forEach(([g0, g1]) => { if (g0 > cur) segs.push([cur, g0]); cur = Math.max(cur, g1); }); if (cur < b) segs.push([cur, b]);
      segs.forEach(([s0, s1]) => { if (hor) { box(s0 - WT / 2, y0 - WT / 2, s1 + WT / 2, y0 + WT / 2, 0, WH, MAT.wall); box(s0 - WT / 2, y0 - WT / 2, s1 + WT / 2, y0 + WT / 2, WH, WH + 0.03, MAT.wallTop, false); }
        else { box(x0 - WT / 2, s0 - WT / 2, x0 + WT / 2, s1 + WT / 2, 0, WH, MAT.wall); box(x0 - WT / 2, s0 - WT / 2, x0 + WT / 2, s1 + WT / 2, WH, WH + 0.03, MAT.wallTop, false); } });
    };
    const wallAny = (x0, y0, x1, y1, win) => {
      const [a, b] = P(x0, y0), [c, d] = P(x1, y1); const len = Math.hypot(c - a, d - b), ang = -Math.atan2(d - b, c - a);
      const L0 = len + WT * S, ux = (c - a) / len, uz = (d - b) / len; const piece = (f0, f1, z0, z1) => { const cx = ((f0 + f1) / 2 - 0.5) * L0; const m = new THREE.Mesh(new THREE.BoxGeometry((f1 - f0) * L0, z1 - z0, WT * S), MAT.wall); m.position.set((a + c) / 2 + ux * cx, (z0 + z1) / 2, (b + d) / 2 + uz * cx); m.rotation.y = ang; add(m); this._wall(m); };
      if (win) { const f = (1 - win) / 2; piece(0, f, 0, WH); piece(1 - f, 1, 0, WH); piece(f, 1 - f, 0, 0.9); piece(f, 1 - f, 2.15, WH); } else piece(0, 1, 0, WH);
      const t = new THREE.Mesh(new THREE.BoxGeometry(len + WT * S, 0.03, WT * S), MAT.wallTop); t.position.set((a + c) / 2, WH + 0.015, (b + d) / 2); t.rotation.y = ang; scene.add(t); this._wall(t);
      if (win) { const w = new THREE.Mesh(new THREE.BoxGeometry(len * win, 1.25, WT * S + 0.03), MAT.window); w.position.set((a + c) / 2, 1.5, (b + d) / 2); w.rotation.y = ang; scene.add(w); this._wall(w); }
      return { a, b, c, d, ang, len };
    };
    const along = (wl, t0, t1, off, dp, z0, z1, mat, cast = true) => {
      const ux = (wl.c - wl.a) / wl.len, uz = (wl.d - wl.b) / wl.len, nx = -uz, nz = ux, tm = (t0 + t1) / 2 * wl.len;
      const m = new THREE.Mesh(new THREE.BoxGeometry((t1 - t0) * wl.len, z1 - z0, dp * S), mat);
      m.position.set(wl.a + ux * tm + nx * (off + dp / 2) * S, (z0 + z1) / 2, wl.b + uz * tm + nz * (off + dp / 2) * S); m.rotation.y = wl.ang; return add(m, cast);
    };
    const windowOn = (x0, y0, x1, y1, z0 = 0.9, z1 = 2.15) => (y0 === y1 ? box(x0, y0 - WT / 2 - 1, x1, y0 + WT / 2 + 1, z0, z1, MAT.window, false) : box(x0 - WT / 2 - 1, y0, x0 + WT / 2 + 1, y1, z0, z1, MAT.window, false));
    // registre des lumières pilotées par Home Assistant
    const L = (entity, color, plPos, base, dist = 4) => {
      if (!this.lights[entity]) this.lights[entity] = { color: new THREE.Color(color), mats: [], pls: [], base };
      const rec = this.lights[entity];
      if (plPos) { const pl = new THREE.PointLight(color, 0, dist, 1.6); pl.shadow.mapSize.set(512, 512); pl.shadow.bias = -0.004; pl.shadow.camera.near = 0.04; pl.shadow.camera.far = dist + 0.5; const [a, b] = P(plPos[0], plPos[1]); pl.position.set(a, plPos[2], b); scene.add(pl); rec.pls.push(pl); (this.plEnts = this.plEnts || []).push(entity); }
      const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0, roughness: 0.9 }); rec.mats.push(mat); return mat;
    };
    const clickable = (mesh, entity) => { mesh.userData.entity = entity; this.clickables.push(mesh); return mesh; };

    /* ---- sols ---- */
    floor([[10,105],[135,105],[135,210],[10,210]], MAT.tile); floor([[135,105],[235,105],[235,155],[135,155]], MAT.tile);
    floor([[235,10],[435,10],[435,107],[325,107],[325,210],[135,210],[135,155],[235,155]], MAT.tileGrey); floor([[325,107],[435,107],[435,210],[325,210]], MAT.tileGrey);
    floor([[10,210],[200,210],[200,370],[10,370]], MAT.oak); floor([[200,210],[330,210],[330,370],[200,370]], M('#bdb6ab', { roughness: 0.8 }));
    floor([[330,210],[435,210],[435,255],[455,255],[455,370],[330,370]], MAT.tileGrey);
    floor([[435,10],[680,10],[680,130],[772,150],[745,355],[685,335],[685,370],[455,370],[455,255],[435,255]], MAT.tileGrey);
    /* ---- murs ---- */
    wall(10, 105, 235, 105); wall(235, 10, 235, 105, [[18, 58]]); wall(235, 10, 680, 10); wall(680, 10, 680, 130, [[22, 75]]); box(675.5, 22, 684.5, 75, 0, 0.9, MAT.wall); box(675.5, 22, 684.5, 75, 2.15, WH, MAT.wall); box(675.5, 22, 684.5, 75, WH, WH + 0.03, MAT.wallTop, false);
    const wB1 = wallAny(680, 130, 772, 150, 0.7), wB2 = wallAny(772, 150, 745, 355, 0); wallAny(745, 355, 685, 335, 0);
    wall(685, 335, 685, 370); wall(10, 370, 685, 370, [[50, 150], [245, 300], [470, 640]]); for (const [a0, a1, z0] of [[50, 150, 0.9], [245, 300, 0.9], [470, 640, 0.02]]) { box(a0, 365.5, a1, 374.5, 0, z0, MAT.wall); box(a0, 365.5, a1, 374.5, 2.15, WH, MAT.wall); box(a0, 365.5, a1, 374.5, WH, WH + 0.03, MAT.wallTop, false); } wall(10, 105, 10, 370);
    { const occ = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }); const [a, b] = P(10, 10), [c, d] = P(775, 372); const ce = new THREE.Mesh(new THREE.BoxGeometry(c - a, 0.04, d - b), occ); ce.position.set((a + c) / 2, 2.36, (b + d) / 2); ce.castShadow = true; scene.add(ce); this.ceiling = ce; }
    // stores à lamelles verticales (chambre enfant : beige, salon côté TV : blanc)
    { const beige = M('#d9d2c4', { roughness: 0.9 }), whiteB = M('#efeeea', { roughness: 0.9 });
      for (let x = 245.5; x < 299; x += 3.6) box(x, 363.6, x + 3, 364.1, 0.92, 2.12, beige, false); box(245, 363.3, 300, 364.4, 2.12, 2.16, beige, false);
      for (let y = 22.5; y < 74; y += 3.6) box(673.6, y, 674.1, y + 3, 0.92, 2.12, whiteB, false); box(673.3, 22, 674.4, 75, 2.12, 2.16, whiteB, false); }
    windowOn(50, 370, 150, 370); windowOn(245, 370, 300, 370); windowOn(680, 22, 680, 75); windowOn(470, 370, 640, 370, 0.02, 2.15);
    wall(135, 105, 135, 210, [[160, 200]]); wall(135, 155, 235, 155); wall(235, 105, 235, 155, [[116, 152]]);
    wall(325, 107, 435, 107); wall(325, 107, 325, 210); wall(10, 210, 330, 210, [[150, 195], [215, 260]]);
    wall(330, 210, 435, 210, [[365, 410]]); wall(435, 10, 435, 255, [[40, 90]]); wall(200, 210, 200, 370); wall(330, 210, 330, 370);
    box(140, 112, 160, 152, 0, WH, M('#cfd3c9')); box(298, 112, 322, 132, 0, WH, M('#cfd3c9'));
    // porte d'entrée (animée selon le capteur)
    { const [a, b] = P(235, 18); const piv = new THREE.Group(); piv.position.set(a + 2 * S, 0, b); scene.add(piv);
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(5 * S, 2.05, 40 * S), M('#6b5a48')); leaf.position.set(0, 1.025, 20 * S); leaf.castShadow = true; piv.add(leaf); this.frontDoor = piv; }
    /* ---- salle de bain / WC ---- */
    box(14, 111, 52, 200, 0, 0.58, MAT.white); box(19, 116, 47, 195, 0.58, 0.6, M('#dfeaf0', { roughness: 0.1 }), false);
    box(68, 109, 112, 131, 0, 0.82, MAT.oakDark); box(67, 109, 113, 132, 0.82, 0.86, MAT.white); cyl(90, 120, 8, 0.86, 0.9, M('#eef2f4', { roughness: 0.15 }));
    box(72, 108, 108, 110.5, 1.1, 1.75, MAT.mirror, false); box(195, 109, 215, 117, 0.35, 0.85, MAT.white); cyl(205, 129, 9, 0, 0.42, MAT.white);
    clickable(sphere(75, 160, 5, 2.2, L('light.salle_de_bain_salle_de_bain', '#fff1d6', [75, 160, 2.1], 2.2, 3.5)), 'light.salle_de_bain_salle_de_bain');
    /* ---- hall ---- */
    box(300, 14, 350, 26, 0, 0.5, MAT.oakDark);
    /* ---- buanderie ---- */
    box(400, 112, 432, 144, 0, 0.85, MAT.white); box(400, 112, 432, 144, 0.85, 1.7, MAT.white);
    for (const z of [0.42, 1.27]) { const [a, b] = P(416, 144.6); const d = new THREE.Mesh(new THREE.CircleGeometry(10 * S, 28), MAT.black); d.position.set(a, z, b); scene.add(d); }
    box(360, 109, 392, 125, 0.95, 1.75, MAT.white); box(330, 109, 358, 128, 0, 0.95, M('#e5e3de')); box(330, 109, 358, 132, 0.95, 0.98, MAT.oakLight);
    box(327, 150, 340, 190, 1.55, 2.05, M('#c9cbcd')); box(327, 150, 333, 185, 0.85, 1.35, MAT.white);
    /* ---- chambre adulte ---- */
    box(14, 213, 132, 243, 0, 2.1, MAT.white); box(166, 250, 196, 366, 0, 2.1, MAT.white);
    box(14, 258, 22, 346, 0, 1.0, MAT.oakDark); box(22, 262, 122, 342, 0, 0.42, MAT.fabric); box(48, 260, 124, 344, 0.42, 0.5, MAT.green);
    box(25, 268, 44, 298, 0.42, 0.56, MAT.white); box(25, 306, 44, 336, 0.42, 0.56, MAT.white); box(14, 247, 32, 257, 0, 0.5, MAT.oakDark); box(14, 348, 32, 364, 0, 0.5, MAT.oakDark);
    /* ---- chambre enfant : lit mezzanine blanc + bureau à l'est, lit bébé + mur montagnes + caméra à l'ouest, vitrine + ventilateur colonne au sud-ouest ---- */
    { const blue = M('#a9cfe8', { roughness: 0.95 }), greyOak = M('#8d877d', { roughness: 0.8 }), mint = M('#bfe0d6'), white = MAT.white;
      const bw = (x0, y0, x1, y1, z0, z1) => this._wall(box(x0, y0, x1, y1, z0, z1, blue, false));
      bw(204.5, 214.6, 215, 214.9, 0, WH); bw(260, 214.6, 325.5, 214.9, 0, WH); bw(325.1, 214.5, 325.4, 365.5, 0, WH);
      bw(204.5, 365.1, 245, 365.4, 0, WH); bw(300, 365.1, 325.5, 365.4, 0, WH); bw(245, 365.1, 300, 365.4, 0, 0.9); bw(245, 365.1, 300, 365.4, 2.15, WH);
      { const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 320; const g = cv.getContext('2d'); g.fillStyle = '#a9cfe8'; g.fillRect(0, 0, 1024, 320); g.fillStyle = '#5f7486'; g.beginPath(); g.moveTo(0, 0);
        [[0, 150], [90, 190], [170, 95], [230, 175], [300, 70], [380, 160], [440, 110], [520, 185], [600, 80], [660, 150], [720, 120], [800, 190], [870, 100], [940, 170], [1024, 130]].forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(1024, 0); g.closePath(); g.fill();
        const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const mural = new THREE.Mesh(new THREE.PlaneGeometry(151 * S, WH), new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 }));
        const [a, b] = P(204.6, 290); mural.position.set(a, WH / 2, b); mural.rotation.y = Math.PI / 2; mural.receiveShadow = true; scene.add(mural); this._wall(mural); }
      // lit mezzanine (est) + échelle + bureau, caisson menthe et étagère dessous
      const lx0 = 284, lx1 = 328, ly0 = 216, ly1 = 316;
      for (const [x, y] of [[lx0, ly0], [lx0, ly1 - 3], [lx1 - 3, ly0], [lx1 - 3, ly1 - 3]]) box(x, y, x + 3, y + 3, 0, 1.95, white);
      box(lx0, ly0, lx1, ly1, 1.3, 1.4, white); box(lx0 + 3, ly0 + 3, lx1 - 3, ly1 - 3, 1.4, 1.56, M('#aab6c2')); box(lx0 + 6, ly0 + 4, lx1 - 6, ly0 + 18, 1.56, 1.64, M('#bfe0cf'));
      box(lx0 - 0.5, ly0, lx0 + 1.5, ly1 - 22, 1.32, 1.86, white); box(lx0, ly0, lx1, ly0 + 2, 1.3, 1.9, white); box(lx0, ly1 - 2, lx1, ly1, 1.3, 1.9, white);
      box(lx0 - 1, 258, lx0 - 0.5, 278, 1.45, 1.75, M('#1d2233'), false); box(lx0 - 1.1, 260, lx0 - 1, 276, 1.48, 1.72, M('#e9c86a'), false);
      box(lx0 - 5, ly1 - 22, lx0 - 1, ly1 - 20, 0, 1.95, white); box(lx0 - 5, ly1 - 2, lx0 - 1, ly1, 0, 1.95, white); for (let z = 0.3; z < 1.5; z += 0.27) box(lx0 - 5, ly1 - 20, lx0 - 1, ly1 - 2, z, z + 0.035, white);
      box(lx0 + 3, ly0 + 3, lx1 - 1, ly1 - 28, 0.72, 0.75, white);
      box(lx0 + 2, ly0 + 3, lx0 + 22, ly0 + 26, 0, 0.72, mint); for (const z of [0.24, 0.48]) box(lx0 + 1.6, ly0 + 3, lx0 + 2, ly0 + 26, z, z + 0.01, M('#9fc4b8'), false);
      for (const z of [0.15, 0.39, 0.62]) box(lx0 + 1.4, ly0 + 10, lx0 + 2, ly0 + 19, z, z + 0.015, M('#222'), false);
      box(lx0 + 3, ly1 - 27, lx1 - 1, ly1 - 26, 0, 1.28, white); for (const z of [0, 0.42, 0.85, 1.25]) box(lx0 + 3, ly1 - 26, lx1 - 1, ly1 - 4, z, z + 0.03, white);
      cyl(272, 262, 7, 0, 0.04, white, 5); cyl(272, 262, 1.2, 0.04, 0.45, white, 8); cyl(272, 262, 6, 0.45, 0.5, M('#bcd6cf'), 24); box(266, 267, 278, 268.5, 0.52, 0.85, M('#bcd6cf'));
      // lit bébé (ouest) + posters + caméra Reolink
      box(206, 222, 241, 224, 0, 0.92, greyOak); box(206, 290, 241, 292, 0, 0.92, greyOak);
      for (const x0 of [206, 239]) { box(x0, 224, x0 + 2, 290, 0.84, 0.9, greyOak); box(x0, 224, x0 + 2, 290, 0.22, 0.27, greyOak); for (let y = 226; y < 289; y += 3.2) box(x0 + 0.5, y, x0 + 1.5, y + 1, 0.27, 0.84, greyOak, false); }
      box(208, 224, 239, 290, 0.27, 0.4, M('#c9ced8'));
      box(204.8, 236, 205.3, 250, 0.95, 1.5, M('#d9534f'), false); box(204.8, 251, 205.3, 266, 0.92, 1.52, M('#a6cf3a'), false); box(204.8, 270, 205.3, 284, 1.0, 1.45, M('#c3cbdb'), false);
      box(204.8, 291, 206.6, 297, 1.84, 1.96, white); box(204.8, 293.5, 205.6, 294.5, 1.96, WH, white, false);
      clickable(sphere(209, 294, 3.6, 1.9, white), 'camera.chambre_enfant'); clickable(sphere(211.8, 294, 1.5, 1.88, M('#111')), 'camera.chambre_enfant');
      // coin sud-ouest : vitrine blanche (maquettes), tableau, ventilateur colonne ; commode sous la fenêtre
      for (const [z0, z1] of [[0, 0.78], [0.78, 1.56]]) { box(207, 347, 236, 364.5, z0, z0 + 0.03, white); box(207, 347, 236, 364.5, z1 - 0.03, z1, white); box(207, 347, 208.5, 364.5, z0, z1, white); box(234.5, 347, 236, 364.5, z0, z1, white); box(208.5, 363.5, 234.5, 364.5, z0, z1, white);
        box(208.5, 347, 234.5, 347.6, z0 + 0.03, z1 - 0.03, M('#e6f2f4', { transparent: true, opacity: 0.25, roughness: 0.05 }), false); box(208.5, 348, 234.5, 363.5, (z0 + z1) / 2, (z0 + z1) / 2 + 0.01, M('#dfeef0', { transparent: true, opacity: 0.5 }), false); }
      { const cv = document.createElement('canvas'); cv.width = 200; cv.height = 150; const g = cv.getContext('2d'); g.fillStyle = '#1e2240'; g.fillRect(0, 0, 200, 150);
        [['#3fb6a8', 45, 75, 30], ['#c23b3b', 55, 65, 11], ['#6aa9e0', 145, 80, 34], ['#e8d24a', 100, 35, 10], ['#9fd36a', 20, 125, 14]].forEach(([c, x, y, r]) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); });
        g.strokeStyle = '#8fd0ff'; g.lineWidth = 4; g.beginPath(); for (let x = 0; x <= 200; x += 12) g.lineTo(x, 12 + ((x / 12) % 2) * 10); g.stroke();
        const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; box(207, 364, 236, 365, 1.62, 2.22, new THREE.MeshStandardMaterial({ map: t, roughness: 0.8 }), false); }
      cyl(241, 357, 7, 0, 0.03, M('#2b2d31'), 24); cyl(241, 357, 4.5, 0.03, 1.02, M('#2b2d31', { roughness: 0.5 }), 24);
      box(246, 341, 296, 365, 0.05, 0.92, greyOak); box(245, 340, 297, 365, 0.92, 0.95, greyOak); box(272, 340.6, 294, 341.2, 0.12, 0.86, M('#5e5a53'), false); box(271, 340.4, 295, 341.3, 0.48, 0.5, greyOak, false); box(258, 340.6, 258.5, 341.1, 0.1, 0.88, M('#6f6a62'), false);
      // ventilateur de plafond avec anneau lumineux (lumière « chambre matteo »)
      { const [a, b] = P(262, 292); const g = new THREE.Group(); g.position.set(a, 2.22, b); scene.add(g);
        const housing = new THREE.Mesh(new THREE.CylinderGeometry(13 * S, 13 * S, 0.07, 48), M('#6b6e74', { roughness: 0.5 })); housing.castShadow = true; g.add(housing); clickable(housing, 'light.chambre_matteo');
        const ring = new THREE.Mesh(new THREE.RingGeometry(8.5 * S, 12.6 * S, 48), L('light.chambre_matteo', '#f4f8ff', [262, 292, 2.05], 2.2, 4)); ring.rotation.x = Math.PI / 2; ring.position.y = -0.036; g.add(ring); clickable(ring, 'light.chambre_matteo');
        const grille = new THREE.Mesh(new THREE.CircleGeometry(8.4 * S, 40), M('#4a4d52')); grille.rotation.x = Math.PI / 2; grille.position.y = -0.037; g.add(grille);
        for (let k = 0; k < 7; k++) { const piv = new THREE.Group(); piv.rotation.y = (k * Math.PI * 2) / 7; piv.position.y = -0.03; const bl = new THREE.Mesh(new THREE.BoxGeometry(7 * S, 0.006, 2 * S), M('#d9dbde')); bl.position.x = 3.6 * S; piv.add(bl); g.add(piv); } }
    }
    /* ---- cuisine (en U : évier + colonnes à l'ouest, hotte au sud, péninsule à l'est) ---- */
    const greyWall = M('#5c5f64', { roughness: 0.95 }), tiles = M('#e8e0d1', { roughness: 0.5 }), sinkM = M('#232325', { roughness: 0.4 });
    box(335, 214.5, 365, 238, 0, 2.2, MAT.greige); box(335, 238, 365, 262, 0, 2.2, MAT.greige); box(365, 241, 365.8, 260, 0.85, 1.45, MAT.black, false); box(365, 241, 365.6, 260, 1.48, 1.52, MAT.steel, false);
    box(335, 262, 365, 366, 0, 0.86, MAT.greige); box(334.5, 262, 366, 366, 0.86, 0.9, MAT.worktop); box(340, 290, 360, 322, 0.86, 0.905, sinkM, false);
    box(335, 314, 337, 318, 0.9, 1.25, MAT.steel, false);
    box(334.6, 262, 335.4, 336, 0.9, 1.43, tiles, false); box(334.6, 336, 335.4, 366, 0.9, 1.45, tiles, false);
    box(335, 266, 352, 330, 1.45, 2.2, MAT.greige);
    clickable(box(335, 266, 352, 330, 1.43, 1.45, L('light.cuisine_evier', '#ffd9a0', [348, 298, 1.35], 1.8, 2.4), false), 'light.cuisine_evier');
    box(339, 340, 356, 358, 0.9, 1.3, MAT.black); box(341, 341, 354, 352, 1.3, 1.42, M('#d9dee0', { transparent: true, opacity: 0.6 }), false);
    box(365, 336, 425, 366, 0, 0.86, MAT.greige); box(365, 334, 425, 366, 0.86, 0.9, MAT.worktop);
    box(335, 365.2, 425, 365.8, 0.9, 1.5, tiles, false); box(335, 365.2, 425, 365.8, 1.5, 2.3, greyWall, false);
    // étagères ouvertes éclairées : mur ouest, coin sud, au-dessus de la machine à café (ouvertes vers l'est)
    for (const [y0, y1] of [[331, 348], [349, 366]]) { box(335, y0, 352, y1, 1.45, 1.47, MAT.white); box(335, y0, 352, y1, 2.18, 2.2, MAT.white); box(335, y0, 352, y0 + 1, 1.45, 2.2, MAT.white); box(335, y1 - 1, 352, y1, 1.45, 2.2, MAT.white);
      box(336, y0 + 1, 351, y1 - 1, 1.82, 1.83, M('#cfe6ea', { transparent: true, opacity: 0.45 }), false);
      clickable(box(335.2, y0 + 1, 336.4, y1 - 1, 1.47, 2.18, L('light.cuisine_etagere_cafe', '#ffd9a0', y0 === 331 ? [345, 348, 1.95] : null, 1.0, 1.8), false), 'light.cuisine_etagere_cafe');
      cyl(343, (y0 + y1) / 2, 3, 2.16, 2.18, L('light.cuisine_etagere_cafe', '#fff1d6', null, 1, 1)); }
    // taque + hotte cheminée (mur sud)
    box(381, 342, 409, 362, 0.9, 0.905, MAT.black, false);
    { const [a, b] = P(395, 354); const g = new THREE.BoxGeometry(34 * S, 0.3, 24 * S); { const pa = g.attributes.position; for (let k = 0; k < pa.count; k++) if (pa.getY(k) > 0) { pa.setX(k, pa.getX(k) * 12 / 34); pa.setZ(k, pa.getZ(k) > 0 ? 12 * S : 4 * S); } g.computeVertexNormals(); } const hood = new THREE.Mesh(g, MAT.white); hood.position.set(a, 1.72, b); hood.castShadow = true; scene.add(hood);
      const rim = new THREE.Mesh(new THREE.BoxGeometry(34.6 * S, 0.03, 24 * S), MAT.steel); rim.position.set(a, 1.57, b); scene.add(rim); }
    box(389, 358, 401, 366, 1.86, 2.3, MAT.white);
    box(411, 342, 424, 362, 0.9, 1.22, MAT.black);
    box(425, 292, 447, 366, 0, 0.9, MAT.greige); box(423, 290, 452, 366, 0.9, 0.94, MAT.worktop); box(440, 294, 457, 362, 1.06, 1.09, MAT.worktop); box(447, 296, 452, 360, 0.94, 1.06, M('#d8d5cf'));
    for (const y of [312, 344]) { cyl(468, y, 2, 0, 0.72, MAT.black, 10); cyl(468, y, 8, 0.72, 0.78, M('#2b2b2e'), 20); box(462, y - 7, 464, y + 7, 0.78, 1.15, M('#2b2b2e')); }
    box(371, 280, 375, 350, 2.25, 2.29, MAT.black, false);
    [287, 306, 326, 344].forEach((y, i) => { const e = 'light.cuisine_s_cuisine_' + (i + 1); cyl(373, y, 1, 2.16, 2.25, MAT.black, 8); clickable(cyl(373, y, 3, 2.05, 2.17, MAT.black), e); clickable(cyl(373, y, 2.4, 2.035, 2.05, L(e, '#fff4e0', [373, y, 1.95], 1.1, 3)), e); });
    /* ---- salon ---- */
    box(440, 14, 466, 32, 0, 0.75, MAT.oakDark); box(442, 16, 464, 30, 0.75, 1.0, MAT.white); box(444, 14.6, 462, 16, 1.25, 1.55, MAT.black, false);
    { const cv = document.createElement('canvas'); cv.width = 320; cv.height = 180; this.nvrCv = cv; this.nvrTex = new THREE.CanvasTexture(cv); this.nvrTex.colorSpace = THREE.SRGBColorSpace;
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(17 * S, 0.27), new THREE.MeshBasicMaterial({ map: this.nvrTex, toneMapped: false })); const [a, b] = P(453, 16.1); scr.position.set(a, 1.4, b); scene.add(scr); clickable(scr, 'camera.rue_fluide'); };
    // mur TV : lattes chêne, grand panneau blanc (ruban LED derrière), TV centrée + Ambilight, 2 enceintes colonnes
    box(474, 14.5, 495, 16.0, 0, 2.28, MAT.oakLight, false); for (let x = 475; x < 494; x += 2.3) box(x, 16.0, x + 1.2, 17.2, 0, 2.28, M('#b8955f'), false);
    clickable(box(504.5, 13.4, 627.5, 14.6, 0.765, 1.995, L('light.salon_panneau_mural', '#ffd27a', [566, 30, 1.4], 2.4, 3.6), false), 'light.salon_panneau_mural');
    clickable(box(506, 14.6, 626, 17.2, 0.78, 1.98, MAT.white), 'light.salon_panneau_mural');
    clickable(box(527, 17.2, 605, 18.2, 0.97, 1.79, L('light.salon_ambilight_tv', '#7f6bff', [566, 24, 1.38], 1.6, 2.6), false), 'light.salon_ambilight_tv');
    this.tvMat = M('#101012', { roughness: 0.25, emissive: '#2a3b6a', emissiveIntensity: 0 }); box(530, 18.2, 602, 19.4, 1.0, 1.76, this.tvMat, false);
    box(512, 17.2, 518, 19.6, 1.05, 1.72, MAT.white); box(614, 17.2, 620, 19.6, 1.05, 1.72, MAT.white);
    { const cv = document.createElement('canvas'); cv.width = 320; cv.height = 180; this.tvCv = cv; this.tvTex = new THREE.CanvasTexture(cv); this.tvTex.colorSpace = THREE.SRGBColorSpace;
      this.tvScr = new THREE.Mesh(new THREE.PlaneGeometry(70 * S, 0.74), new THREE.MeshBasicMaterial({ map: this.tvTex, toneMapped: false })); const [a, b] = P(566, 19.5);
      this.tvScr.position.set(a, 1.38, b); this.tvScr.visible = false; scene.add(this.tvScr); clickable(this.tvScr, 'media_player.televiseur_du_salon'); }
    // meuble TV suspendu blanc (LED dessous) + caisson chêne ouvert pour l'ampli, colonne chêne à droite
    { const groove = M('#dcdcd8'); box(472, 14.5, 640, 34.0, 0.16, 0.56, MAT.white); box(474, 16.0, 638, 32.0, 0.145, 0.16, decor('#ffcf88', 0.9), false);
      for (const x of [514, 556, 598]) box(x - 0.3, 34.0, x + 0.3, 34.3, 0.18, 0.54, groove, false);
      box(586, 15.0, 588, 33.0, 0.56, 0.86, MAT.oakLight); box(634, 15.0, 636, 33.0, 0.56, 0.86, MAT.oakLight); box(586, 15.0, 636, 33.0, 0.84, 0.86, MAT.oakLight); box(588, 15.0, 634, 33.0, 0.7, 0.715, MAT.oakLight);
      box(594, 17.0, 628, 30.0, 0.56, 0.645, MAT.black); box(596, 17.0, 626, 30.0, 0.715, 0.8, MAT.black);
      box(640, 15.0, 676, 34.0, 0, 0.56, MAT.white); box(640, 15.0, 642, 34.0, 0.56, 2.22, MAT.oakLight); box(674, 15.0, 676, 34.0, 0.56, 2.22, MAT.oakLight); box(642, 14.5, 674, 16.0, 0.56, 2.22, MAT.oakLight); box(640, 15.0, 676, 34.0, 2.2, 2.22, MAT.oakLight);
      for (const z of [0.98, 1.4, 1.8]) box(642, 16.0, 674, 33.0, z, z + 0.03, M('#b8955f'), false);
      box(636.5, 15.0, 638.5, 17.0, 0.6, 2.2, decor('#ffcf88', 1.2), false); }
    box(510, 52, 640, 140, 0, 0.01, MAT.rug2, false); box(545, 75, 612, 112, 0, 0.36, MAT.white); box(560, 82, 600, 105, 0.36, 0.4, MAT.oakLight);
    box(500, 140, 676, 182, 0, 0.42, MAT.sofa); box(500, 172, 676, 182, 0.42, 0.88, MAT.sofa2); box(634, 55, 676, 140, 0, 0.42, MAT.sofa); box(634, 55, 676, 62, 0.42, 0.62, MAT.sofa2); box(668, 62, 676, 172, 0.42, 0.88, MAT.sofa2);
    box(500, 140, 507, 182, 0.42, 0.6, MAT.sofa2); for (const x of [515, 555, 595]) box(x, 160, x + 26, 172, 0.42, 0.75, MAT.sofa2);
    { const [a, b] = P(575, 95); const hat = new THREE.Mesh(new THREE.ConeGeometry(30 * S, 0.1, 48, 1, true), M('#c8a55e', { transparent: true, opacity: 0.3, side: THREE.DoubleSide, roughness: 1 })); hat.position.set(a, 2.05, b); scene.add(hat); clickable(hat, 'light.salon_l_salon'); }
    clickable(sphere(575, 95, 4, 1.98, L('light.salon_l_salon', '#ffcf8a', [575, 95, 1.9], 2.6, 5)), 'light.salon_l_salon');
    // radiateurs (cliquables → thermostat)
    this.rads = [];
    [[673, 22, 677, 75, 0.15, 0.75, 'climate.living'], [440, 206, 444, 240, 0.15, 0.75, 'climate.living'], [645, 362, 670, 366, 0.15, 0.75, 'climate.living'],
     [70, 362, 130, 366, 0.15, 0.7, 'climate.chambre_adulte'], [263, 214.6, 279, 218.6, 0.12, 0.72, 'climate.chambre_enfants'], [131, 140, 134, 172, 0.4, 1.6, 'climate.salle_de_bain'], [365, 13, 405, 17, 0.15, 0.75, 'climate.couloir']]
      .forEach(([a0, b0, a1, b1, z0, z1, e]) => { const m = M('#f4f3ef', { roughness: 0.5, emissive: '#ff5a1f', emissiveIntensity: 0 }); clickable(box(a0, b0, a1, b1, z0, z1, m), e); this.rads.push({ m, e }); });
    // tablette murale (écran simulé selon son état)
    box(439.5, 215, 441, 233, 1.28, 1.52, MAT.black, false);
    { const cv = document.createElement('canvas'); cv.width = 256; cv.height = 160; this.tabCv = cv; this.tabTex = new THREE.CanvasTexture(cv); this.tabTex.colorSpace = THREE.SRGBColorSpace;
      this.tabMat = new THREE.MeshBasicMaterial({ map: this.tabTex, toneMapped: false }); const [a, b] = P(441.1, 224);
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(16 * S, 0.2), this.tabMat); scr.position.set(a, 1.4, b); scr.rotation.y = Math.PI / 2; scene.add(scr); clickable(scr, 'switch.salon_sam_tablette_ecran'); }
    { const [a, b] = P(676.5, 102); const c = new THREE.Mesh(new THREE.CircleGeometry(13 * S, 40), M('#efe9df')); c.position.set(a, 1.75, b); c.rotation.y = -Math.PI / 2; scene.add(c); }
    // meubles à vinyles blancs (3 colonnes x 2) sous la fenêtre de la baie + clavier rouge, stores blancs
    { const wh = M('#f4f4f2', { roughness: 0.4 }), sleeve = M('#2a2a2e', { roughness: 0.5 }), whiteB = M('#efeeea', { roughness: 0.9 });
      along(wB1, 0.42, 0.98, 4.6, 17, 0, 0.82, wh);
      for (let k = 0; k < 3; k++) { const t0 = 0.42 + k * 0.1867, t1 = t0 + 0.1867; for (const z of [0.04, 0.43]) { along(wB1, t0 + 0.012, t1 - 0.012, 21.4, 0.4, z + 0.12, z + 0.36, sleeve, false); along(wB1, t0 + 0.012, t1 - 0.012, 21.6, 0.5, z, z + 0.12, wh, false); } along(wB1, t1 - 0.003, t1 + 0.003, 21.6, 0.4, 0, 0.82, M('#dcdcd8'), false); }
      along(wB1, 0.56, 0.84, 7, 13, 0.82, 0.86, M('#c62f2f', { roughness: 0.4 })); along(wB1, 0.6, 0.83, 15, 5, 0.86, 0.865, M('#f2f2f2'), false); along(wB1, 0.57, 0.66, 8, 6, 0.86, 0.866, M('#ff9a2f'), false);
      for (let t = 0.155; t < 0.85; t += 0.022) along(wB1, t, t + 0.017, 5, 0.6, 0.92, 2.12, whiteB, false); along(wB1, 0.15, 0.85, 4.8, 1.2, 2.12, 2.16, whiteB, false); }
    // coin DJ (d'après photos) : buffet blanc cérusé à lambris + plateau chêne gris, caisson DJ blanc laqué, Adam A7V aux extrémités, KEF muraux, Hue Play rouges, cadres
    { const cream = M('#e6e0d4', { roughness: 0.75 }), cream2 = M('#d9d2c4', { roughness: 0.8 }), groove = M('#c9c1b2'), woodTop = M('#8f877b', { roughness: 0.7 }), handle = M('#2a2a2a', { roughness: 0.4, metalness: 0.4 }), gloss = M('#f7f7f5', { roughness: 0.15, metalness: 0.05 });
      along(wB2, 0.022, 0.668, 5, 23, 0, 0.06, cream2); along(wB2, 0.022, 0.668, 4.5, 24, 0.06, 0.85, cream); along(wB2, 0.018, 0.672, 4.5, 26, 0.85, 0.89, woodTop);
      const fr = (t0, t1, z0, z1) => { along(wB2, t0, t0 + 0.0025, 28.5, 0.4, z0, z1, groove, false); along(wB2, t1 - 0.0025, t1, 28.5, 0.4, z0, z1, groove, false); along(wB2, t0, t1, 28.5, 0.4, z0, z0 + 0.012, groove, false); along(wB2, t0, t1, 28.5, 0.4, z1 - 0.012, z1, groove, false); };
      const door = (t0, t1, z0, z1, hx) => { fr(t0, t1, z0, z1); for (let t = t0 + 0.012; t < t1 - 0.006; t += 0.012) along(wB2, t, t + 0.0012, 28.5, 0.3, z0 + 0.04, z1 - 0.04, groove, false); along(wB2, hx - 0.003, hx + 0.003, 28.6, 1, z1 - 0.12, z1 - 0.07, handle, false); };
      door(0.026, 0.15, 0.1, 0.82, 0.142); door(0.54, 0.664, 0.1, 0.82, 0.548);
      for (let k = 0; k < 3; k++) { const t0 = 0.15 + k * 0.13; fr(t0, t0 + 0.13, 0.64, 0.82); along(wB2, t0 + 0.055, t0 + 0.075, 28.6, 1.2, 0.71, 0.75, handle, false); }
      along(wB2, 0.15, 0.54, 28.5, 0.5, 0.615, 0.64, woodTop, false);
      for (let k = 0; k < 4; k++) { const t0 = 0.15 + k * 0.0975; door(t0, t0 + 0.0975, 0.1, 0.61, k % 2 ? t0 + 0.008 : t0 + 0.0895); }
      // caisson DJ blanc laqué : 5 compartiments
      along(wB2, 0.075, 0.615, 6, 22, 0.89, 0.99, gloss); along(wB2, 0.075, 0.615, 6, 1.2, 0.99, 1.065, gloss); along(wB2, 0.075, 0.615, 26.8, 1.2, 0.99, 1.065, gloss);
      for (const t of [0.075, 0.1948, 0.2905, 0.3958, 0.4915, 0.6112]) along(wB2, t, t + 0.0039, 6, 22, 0.99, 1.065, gloss);
      const ux = (wB2.c - wB2.a) / wB2.len, uz = (wB2.d - wB2.b) / wB2.len;
      const at = (t, off, z) => { const g = new THREE.Group(); g.position.set(wB2.a + ux * t * wB2.len - uz * off * S, z, wB2.b + uz * t * wB2.len + ux * off * S); g.rotation.y = wB2.ang; scene.add(g); return g; };
      const bx = (g, w, h, d, x, y, z, mat) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; g.add(m); return m; };
      const cy = (g, r, h, x, y, z, mat, seg = 32) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; };
      const body = M('#1a1a1c', { roughness: 0.35, metalness: 0.3 }), plate = M('#232326', { roughness: 0.3, metalness: 0.5 }), silver = M('#c8cbcf', { metalness: 0.8, roughness: 0.25 }), vinyl = M('#0b0b0c', { roughness: 0.2 }), rubber = M('#111111');
      this.djLit = [];
      const lit = (color, ent, base = 1) => { const m = new THREE.MeshStandardMaterial({ color: '#111111', emissive: color, emissiveIntensity: 0, roughness: 0.4 }); this.djLit.push({ m, ent, base }); return m; };
      if (!this.djTex) { const cv = document.createElement('canvas'); cv.width = 256; cv.height = 150; const g2 = cv.getContext('2d'); g2.fillStyle = '#05070c'; g2.fillRect(0, 0, 256, 150);
        const wave = (y, h, c1, c2, k) => { for (let x = 0; x < 256; x += 2) { const a = Math.abs(Math.sin(x * 0.21 + k) * 0.55 + Math.sin(x * 0.047 + k) * 0.35 + Math.sin(x * 0.9) * 0.15) * h; g2.fillStyle = x % 6 ? c1 : c2; g2.fillRect(x, y - a, 2, a * 2); } };
        wave(36, 16, '#2f8cff', '#ff9a2f', 0); wave(76, 12, '#4cd4ff', '#9dff6a', 2); g2.fillStyle = '#ff3b3b'; g2.fillRect(127, 16, 2, 80);
        g2.fillStyle = '#d7e3ff'; g2.font = 'bold 15px sans-serif'; g2.fillText('122.00', 8, 120); g2.font = '11px sans-serif'; g2.fillText('Engine DJ', 8, 140); g2.fillStyle = '#2b5cff'; g2.fillRect(150, 112, 60, 12);
        this.djTex = new THREE.CanvasTexture(cv); this.djTex.colorSpace = THREE.SRGBColorSpace; }
      const deck = (t, label) => { const g = at(t, 16.9, 0.99);
        clickable(bx(g, 0.47, 0.06, 0.405, 0, 0.03, 0, body), 'light.coin_dj_sono_lecteurs');
        cy(g, 0.155, 0.02, -0.05, 0.07, 0.005, silver, 48); cy(g, 0.152, 0.004, -0.05, 0.082, 0.005, vinyl, 48); cy(g, 0.045, 0.002, -0.05, 0.085, 0.005, M(label), 24); cy(g, 0.004, 0.02, -0.05, 0.09, 0.005, silver, 8);
        cy(g, 0.03, 0.03, 0.18, 0.075, -0.13, plate, 20); const arm = bx(g, 0.012, 0.012, 0.25, 0.165, 0.098, -0.02, silver); arm.rotation.y = 0.3; bx(g, 0.03, 0.01, 0.045, 0.125, 0.096, 0.1, silver);
        bx(g, 0.014, 0.004, 0.13, 0.2, 0.062, 0.09, rubber); bx(g, 0.024, 0.012, 0.022, 0.2, 0.068, 0.08, silver); cy(g, 0.022, 0.012, -0.2, 0.066, 0.165, silver, 24);
        bx(g, 0.02, 0.006, 0.012, 0.2, 0.063, 0.16, lit('#2f7bff', 'light.coin_dj_sono_lecteurs', 1.6)); bx(g, 0.012, 0.006, 0.012, -0.2, 0.063, -0.13, lit('#2f7bff', 'light.coin_dj_sono_lecteurs', 1.6)); };
      const player = (t) => { const g = at(t, 16.9, 0.99);
        clickable(bx(g, 0.36, 0.055, 0.40, 0, 0.0275, 0, body), 'light.coin_dj_sono_lecteurs');
        const sg = new THREE.Group(); sg.position.set(0, 0.13, -0.15); sg.rotation.x = -0.5; g.add(sg);
        const hs = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.2, 0.025), body); hs.castShadow = true; sg.add(hs); clickable(hs, 'light.coin_dj_sono_lecteurs');
        const sm = new THREE.MeshBasicMaterial({ map: this.djTex, color: '#000000', toneMapped: false }); this.djLit.push({ m: sm, ent: 'light.coin_dj_sono_lecteurs', screen: true });
        const sp = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.17), sm); sp.position.z = 0.0131; sg.add(sp); bx(g, 0.2, 0.06, 0.06, 0, 0.07, -0.17, body);
        cy(g, 0.112, 0.01, 0, 0.06, 0.03, lit('#2f7bff', 'light.coin_dj_sono_lecteurs', 1.8), 48); cy(g, 0.104, 0.024, 0, 0.068, 0.03, plate, 48); cy(g, 0.035, 0.002, 0, 0.081, 0.03, lit('#cfe0ff', 'light.coin_dj_sono_lecteurs', 1), 32);
        ['#ff3b3b', '#ffb02f', '#ffe14a', '#4cd964', '#3bc8ff', '#3b6bff', '#b04bff', '#ff4fb8'].forEach((c, k) => bx(g, 0.04, 0.006, 0.026, -0.09 + (k % 4) * 0.046, 0.058, 0.155 + Math.floor(k / 4) * 0.032, lit(c, 'light.coin_dj_sono_lecteurs', 1.1)));
        bx(g, 0.012, 0.004, 0.16, 0.155, 0.056, 0.03, rubber); bx(g, 0.03, 0.014, 0.02, 0.155, 0.063, 0.04, silver);
        cy(g, 0.016, 0.006, -0.155, 0.057, 0.18, lit('#4cd964', 'light.coin_dj_sono_lecteurs', 1.4), 20); cy(g, 0.016, 0.006, -0.155, 0.057, 0.14, lit('#ffb02f', 'light.coin_dj_sono_lecteurs', 1.4), 20); };
      const mixer = (t) => { const g = at(t, 16.9, 0.99); clickable(bx(g, 0.4, 0.06, 0.40, 0, 0.03, 0, body), 'light.coin_dj_sono_mixeur');
        for (const x of [-0.13, -0.045, 0.045, 0.13]) { for (const z of [-0.16, -0.12, -0.08, -0.04, 0]) cy(g, 0.011, 0.02, x, 0.07, z, M('#2b2b2e'), 16); bx(g, 0.01, 0.004, 0.1, x, 0.061, 0.1, rubber); bx(g, 0.03, 0.016, 0.02, x, 0.068, 0.11, silver); }
        for (const x of [-0.0875, 0, 0.0875]) { bx(g, 0.012, 0.004, 0.08, x, 0.0605, 0.02, lit('#3dff6a', 'light.coin_dj_sono_mixeur', 1.4)); bx(g, 0.012, 0.0042, 0.016, x, 0.061, -0.03, lit('#ff3b3b', 'light.coin_dj_sono_mixeur', 1.4)); }
        bx(g, 0.14, 0.004, 0.012, 0, 0.061, 0.175, rubber); bx(g, 0.02, 0.016, 0.03, 0, 0.068, 0.175, silver); };
      const adam = (t) => { const g = at(t, 13, 0.89); clickable(bx(g, 0.205, 0.34, 0.28, 0, 0.17, 0, gloss), 'light.coin_dj_sono_adams'); bx(g, 0.195, 0.33, 0.004, 0, 0.17, 0.141, M('#f2f2f0', { roughness: 0.12 }));
        const w = cy(g, 0.078, 0.01, 0, 0.12, 0.145, M('#151517'), 40); w.rotation.x = Math.PI / 2; const d2 = cy(g, 0.062, 0.012, 0, 0.12, 0.146, M('#222225'), 40); d2.rotation.x = Math.PI / 2;
        bx(g, 0.07, 0.055, 0.006, 0, 0.265, 0.144, M('#151517')); bx(g, 0.03, 0.04, 0.007, 0, 0.265, 0.146, M('#3a3220', { metalness: 0.6, roughness: 0.4 })); bx(g, 0.008, 0.008, 0.004, 0, 0.226, 0.146, lit('#5dff7a', 'light.coin_dj_sono_adams', 1.2)); };
      const kef = (t) => { const g = at(t, 5.6, 1.18); bx(g, 0.16, 0.3, 0.035, 0, 0.15, 0, M('#f2f2f0', { roughness: 0.6 })); };
      const hue = (t, ent, pos) => clickable(along(wB2, t - 0.03, t + 0.03, 7, 2.5, 1.065, 1.11, L(ent, '#ff2a3a', pos, 1.8, 2.4), false), ent);
      adam(0.05); adam(0.64); kef(0.055); kef(0.635);
      deck(0.1368, '#e6c22e'); player(0.2446); mixer(0.3451); player(0.4456); deck(0.5533, '#c8323a');
      hue(0.2446, 'light.coin_dj_sono_gauche', [755, 199, 1.15]); hue(0.4456, 'light.coin_dj_sono_droite', [750, 240, 1.15]);
      for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) { const t0 = 0.315 + k * 0.022; along(wB2, t0, t0 + 0.019, 4.6, 0.8, 1.45 + r * 0.27, 1.69 + r * 0.27, MAT.white, false); along(wB2, t0 + 0.003, t0 + 0.016, 5.4, 0.2, 1.48 + r * 0.27, 1.66 + r * 0.27, M(['#dfe6df', '#e9ece6', '#d4ddd6'][k]), false); } }
    // vitrine : bas 3 portes, haut 2 vitrines vitrées éclairées + niche centrale ouverte, corniche
    { const glass = M('#eaf3f5', { transparent: true, opacity: 0.22, roughness: 0.05 }), groove = M('#cfc7b8'), shelfG = M('#dfeef0', { transparent: true, opacity: 0.5, roughness: 0.1 });
      box(437, 104, 458, 201, 0, 0.86, MAT.patine); box(436.5, 103, 459, 202, 0.86, 0.9, MAT.patine); box(437, 104, 458.5, 201, 0, 0.06, groove);
      for (const y of [136.3, 168.7]) box(458, y - 0.5, 458.5, y + 0.5, 0.1, 0.82, groove, false);
      for (const [y0, y1] of [[106, 135], [138, 167], [170, 199]]) { box(458, y0, 458.3, y1, 0.14, 0.16, groove, false); box(458, y0, 458.3, y1, 0.76, 0.78, groove, false); }
      box(437, 105, 440, 200, 0.9, 2.08, MAT.patine); box(436.5, 103.5, 455.5, 201.5, 2.08, 2.16, MAT.patine);
      for (const [y0, y1] of [[105, 107.5], [139.5, 142], [163, 165.5], [197.5, 200]]) box(440, y0, 453.5, y1, 0.9, 2.08, MAT.patine);
      for (const z of [1.33, 1.72]) box(440, 142, 452, 163, z, z + 0.025, MAT.patine);
      [['light.salle_a_manger_vit_d', 107.5, 139.5, 124], ['light.salle_a_manger_vit_g', 165.5, 197.5, 181]].forEach(([e, y0, y1, yc]) => {
        clickable(box(440, y0, 441, y1, 0.92, 2.06, L(e, '#ff2050', [456, yc, 1.5], 1.4, 2.2), false), e);
        for (const z of [1.33, 1.72]) box(441, y0, 452, y1, z, z + 0.012, shelfG, false);
        clickable(box(452.6, y0, 453.4, y1, 0.92, 2.06, glass, false), e);
        box(452.5, yc - 0.6, 453.5, yc + 0.6, 0.92, 2.06, MAT.patine, false); for (const z of [1.25, 1.6, 1.9]) box(452.5, y0, 453.5, y1, z, z + 0.015, MAT.patine, false); });
    }
    /* ---- salle à manger ---- */
    box(548, 247, 648, 292, 0.72, 0.77, MAT.oakLight); box(593, 262, 603, 277, 0, 0.72, MAT.black);
    for (const x of [575, 621]) { box(x - 9, 228, x + 9, 241, 0, 0.47, MAT.velvet); box(x - 9, 226, x + 9, 230, 0.47, 0.88, MAT.velvet); box(x - 9, 298, x + 9, 311, 0, 0.47, MAT.velvet); box(x - 9, 308, x + 9, 312, 0.47, 0.88, MAT.velvet); }
    box(528, 261, 541, 278, 0, 0.47, MAT.velvet); box(526, 261, 530, 278, 0.47, 0.88, MAT.velvet); box(655, 261, 668, 278, 0, 0.47, MAT.velvet); box(665, 261, 669, 278, 0.47, 0.88, MAT.velvet);
    box(560, 268, 636, 271, 2.28, 2.3, MAT.black, false);
    [['light.salle_a_manger_lg', 568], ['light.salle_a_manger_lc', 598], ['light.salle_a_manger_ld', 628]].forEach(([e, x]) => {
      cyl(x, 269.5, 0.6, 1.95, 2.28, MAT.black, 6); clickable(cyl(x, 269.5, 7, 1.62, 1.95, M('#222226', { roughness: 0.8 })), e);
      clickable(cyl(x, 269.5, 7.2, 1.75, 1.8, L(e, '#ffcf8a', [x, 269.5, 1.5], 1.8, 3.4)), e);
    });
    // anneaux de mouvement
    MOTION.forEach(([e, x, y]) => { const [a, b] = P(x, y); const r = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.32, 48), new THREE.MeshBasicMaterial({ color: '#4fd1ff', transparent: true, opacity: 0 })); r.rotation.x = -Math.PI / 2; r.position.set(a, 0.02, b); scene.add(r); this.pulses.push({ e, r }); });
    this.P = P;
  }

  /* ------------------------------------------------------------------ */
  _sync() {
    if (!this._ready || !this._h) return;
    const H = this._h.states;
    for (const [ent, rec] of Object.entries(this.lights)) {
      const st = H[ent], on = st && st.state === 'on';
      let col = rec.color.clone(); const A = on ? st.attributes : {};
      if (A.color_mode === 'color_temp' && A.color_temp_kelvin) col = this._rgb(k2rgb(A.color_temp_kelvin));
      else if (A.rgb_color) col = this._rgb(A.rgb_color);
      else if (A.color_temp_kelvin) col = this._rgb(k2rgb(A.color_temp_kelvin));
      let bri = on ? Math.max(0.12, (A.brightness ?? 255) / 255) : 0;
      if (rec.ov && Date.now() < rec.ov.until) { if (rec.ov.col) col = rec.ov.col; if (rec.ov.bri !== undefined) bri = rec.ov.bri; }
      rec.target = { col, bri, on: bri > 0 };
    }
    const sa = H['sun.sun'] && H['sun.sun'].attributes;
    if (sa && sa.azimuth !== undefined && this.sun) { const az = (sa.azimuth + (this.cfg.north ?? 180)) * Math.PI / 180, el = Math.max(6, sa.elevation) * Math.PI / 180;
      const sp = new THREE.Vector3(Math.sin(az) * Math.cos(el) * 20, Math.sin(el) * 20, -Math.cos(az) * Math.cos(el) * 20); if (sp.distanceTo(this.sun.position) > 0.02) { this.sun.position.copy(sp); this._shadowDirty = true; } this.sun.color.set(sa.elevation < 15 ? '#ffc48a' : '#fff4e6'); this.sunEl = sa.elevation; }
    this._renderPanel();
    (this.rads || []).forEach((r) => { const c = H[r.e]; r.m.emissiveIntensity = c && c.attributes.hvac_action === 'heating' ? 0.22 : 0; });
    this._drawTablet(H);
    (this.djLit || []).forEach((d) => { const on = H[d.ent] && H[d.ent].state === 'on'; if (d.screen) d.m.color.set(on ? '#ffffff' : '#000000'); else d.m.emissiveIntensity = on ? d.base : 0; });
    this._nvr(H);
    if (this.tvMat) { const tv = H['media_player.televiseur_du_salon']; this.tvOn = !!tv && !['off', 'unavailable', 'standby', 'unknown'].includes(tv.state); this.tvMat.emissiveIntensity = this.tvOn ? 0.9 : 0;
      if (this.tvScr) this.tvScr.visible = this.tvOn; const pic = this.tvOn ? tv.attributes.entity_picture : null;
      if (pic !== this._tvPic) { this._tvPic = pic; this._tvImg = null; if (pic) { const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => (this._tvImg = im); im.src = /^https?:/.test(pic) ? pic : (this._h.hassUrl ? this._h.hassUrl(pic) : pic); } }
      this._tvTitle = this.tvOn ? (tv.attributes.media_title || tv.attributes.app_name || tv.attributes.source || '') : ''; }
    const door = H['binary_sensor.hall_dentree_porte_entree_porte']; this.doorTarget = door && door.state === 'on' ? -1.25 : 0;
    const sunSt = H['sun.sun']; const autoNight = sunSt ? sunSt.state === 'below_horizon' : false;
    this.nightTarget = this.mode === 'nuit' ? 1 : this.mode === 'jour' ? 0 : autoNight ? 1 : 0;
    this.$('.mode').textContent = { auto: '🌓 Auto', jour: '☀️ Jour', nuit: '🌙 Nuit' }[this.mode];
    const al = Object.keys(H).find((k) => k.startsWith('alarm_control_panel.')); const as = al ? H[al].state : null;
    const alTxt = { disarmed: 'Désarmée', armed_away: 'Armée', armed_home: 'Armée (maison)', armed_night: 'Armée (nuit)', triggered: 'ALARME !', arming: 'Armement…', pending: 'En attente' }[as] || '—';
    const ab = this.$('.alarm'); ab.textContent = '🛡️ ' + alTxt; ab.classList.toggle('on', !!as && (as.startsWith('armed') || as === 'triggered' || as === 'arming' || as === 'pending')); ab.classList.toggle('hide', !al);
    const nOn = Object.values(this.lights).filter((r) => r.target && r.target.on).length;
    this.$('.info').textContent = `💡 ${nOn} lumière${nOn > 1 ? 's' : ''} allumée${nOn > 1 ? 's' : ''}${this.sunEl > 0 ? ` · ☀️ soleil à ${Math.round(this.sunEl)}°` : ''} · ${new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })}`;
    this.labels.forEach((l) => {
      const t = l.e && H[l.e] ? parseFloat(H[l.e].state) : NaN;
      let extra = ''; let alert = false;
      if (l.n === 'Hall d’entrée' && door && door.state === 'on') { extra = ' · 🚪 ouverte'; alert = true; }
      l.d.innerHTML = l.n + (isNaN(t) ? '' : `<b>${t.toFixed(1).replace('.', ',')}°</b>`) + extra; l.d.classList.toggle('alert', alert);
    });
    this._dirty = true;
  }

  _goTo(name, dur = 1200) { const v = VIEWS[name]; this._lastAct = Date.now(); this.ctl.autoRotate = false; this.anim = { p0: this.cam.position.clone(), t0: this.ctl.target.clone(), p1: new THREE.Vector3(...v.pos), t1: new THREE.Vector3(...v.tgt), k: 0, t: performance.now(), dur }; }
  /* moniteur du NVR Reolink : mosaïque des vraies caméras, rafraîchie toutes les 15 s */
  _nvr(H) {
    if (!this.nvrCv) return; const now = Date.now(); if (this._nvrT && now - this._nvrT < 15000) return; this._nvrT = now;
    const cams = ['camera.rue_fluide', 'camera.rlc_843a_fluide', 'camera.couloir', 'camera.salon_fluide', 'camera.chambre_enfant', 'camera.papillon_fluide'];
    this._nvrImgs = this._nvrImgs || {}; let pending = 0;
    cams.forEach((e) => { const st = H[e]; if (!st || st.state === 'unavailable' || !st.attributes.entity_picture) { this._nvrImgs[e] = null; return; } pending++;
      const im = new Image(); im.onload = () => { this._nvrImgs[e] = im; if (--pending === 0) this._drawNvr(cams, H); }; im.onerror = () => { if (--pending === 0) this._drawNvr(cams, H); };
      const u = st.attributes.entity_picture; im.src = (this._h.hassUrl ? this._h.hassUrl(u) : u) + (u.includes('?') ? '&' : '?') + '_t=' + now; });
    if (!pending) this._drawNvr(cams, H);
  }
  _drawNvr(cams, H) {
    const g = this.nvrCv.getContext('2d'), W = 320, Hh = 180, tw = W / 3, th = Hh / 2; g.fillStyle = '#000'; g.fillRect(0, 0, W, Hh);
    cams.forEach((e, i) => { const x = (i % 3) * tw, y = Math.floor(i / 3) * th, im = this._nvrImgs[e];
      if (im) { const sc = Math.max(tw / im.width, th / im.height), w = im.width * sc, h = im.height * sc; g.save(); g.beginPath(); g.rect(x, y, tw, th); g.clip(); g.drawImage(im, x + (tw - w) / 2, y + (th - h) / 2, w, h); g.restore(); }
      else { g.fillStyle = '#16181c'; g.fillRect(x, y, tw, th); g.fillStyle = '#6b7280'; g.font = '11px system-ui,sans-serif'; g.textAlign = 'center'; g.fillText('Pas de signal', x + tw / 2, y + th / 2 + 4); }
      g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(x, y + th - 15, tw, 15); g.fillStyle = '#fff'; g.font = '10px system-ui,sans-serif'; g.textAlign = 'left';
      g.fillText(((H[e] && H[e].attributes.friendly_name) || e).replace(' Fluide', '').replace('Rlc 843a', 'Balcon').slice(0, 18), x + 4, y + th - 4);
      g.strokeStyle = '#000'; g.lineWidth = 2; g.strokeRect(x, y, tw, th); });
    g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(W - 92, 0, 92, 14); g.fillStyle = '#fff'; g.font = '10px system-ui,sans-serif'; g.textAlign = 'right';
    g.fillText(new Date().toLocaleTimeString('fr-BE'), W - 4, 10); this.nvrTex.needsUpdate = true; this._dirty = true;
  }
  _drawTablet(H) {
    if (!this.tabCv) return; const on = H['switch.salon_sam_tablette_ecran'], ss = H['switch.salon_sam_tablette_economiseur_d_ecran'];
    const mode = !on || on.state !== 'on' ? 'off' : ss && ss.state === 'on' ? 'dim' : 'on', now = new Date(), key = mode + now.getHours() + ':' + now.getMinutes();
    if (key === this._tabKey) return; this._tabKey = key; const g = this.tabCv.getContext('2d'), W = 256, Hh = 160;
    if (mode === 'off') { g.fillStyle = '#050507'; g.fillRect(0, 0, W, Hh); g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(0, 0, W, 40); }
    else { const gr = g.createLinearGradient(0, 0, W, Hh); gr.addColorStop(0, '#2b2250'); gr.addColorStop(1, '#14324a'); g.fillStyle = gr; g.fillRect(0, 0, W, Hh);
      g.fillStyle = '#fff'; g.font = 'bold 54px system-ui,sans-serif'; g.textAlign = 'center'; g.fillText(now.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }), W / 2, 78);
      g.font = '18px system-ui,sans-serif'; g.fillStyle = 'rgba(255,255,255,.75)'; g.fillText(now.toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' }), W / 2, 106);
      g.fillStyle = 'rgba(255,255,255,.18)'; for (let i = 0; i < 4; i++) g.fillRect(22 + i * 56, 122, 46, 24);
      if (mode === 'dim') { g.fillStyle = 'rgba(0,0,0,.72)'; g.fillRect(0, 0, W, Hh); } }
    this.tabTex.needsUpdate = true; this._dirty = true;
  }
  _drawTV(t) {
    const g = this.tvCv.getContext('2d'), W = 320, H = 180;
    if (this._tvImg) { const im = this._tvImg, z = 1.08 + 0.05 * Math.sin(t * 0.15), sc = Math.max(W / im.width, H / im.height) * z, w = im.width * sc, h = im.height * sc;
      g.drawImage(im, (W - w) / 2 + Math.sin(t * 0.11) * 8, (H - h) / 2 + Math.cos(t * 0.13) * 5, w, h); }
    else { const hue = (t * 12) % 360, gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, `hsl(${hue},70%,22%)`); gr.addColorStop(1, `hsl(${(hue + 80) % 360},70%,14%)`); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 4; i++) { const x = W / 2 + Math.sin(t * (0.4 + i * 0.13) + i * 2) * W * 0.38, y = H / 2 + Math.cos(t * (0.33 + i * 0.11) + i) * H * 0.34, r = 50 + 25 * Math.sin(t + i);
        const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `hsla(${(hue + i * 70) % 360},90%,60%,.55)`); rg.addColorStop(1, 'hsla(0,0%,0%,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H); }
      g.globalCompositeOperation = 'source-over'; }
    if (this._tvTitle) { const gr = g.createLinearGradient(0, H - 46, 0, H); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.75)'); g.fillStyle = gr; g.fillRect(0, H - 46, W, 46);
      g.fillStyle = '#fff'; g.font = 'bold 15px system-ui,sans-serif'; g.textAlign = 'left'; g.fillText(String(this._tvTitle).slice(0, 34), 12, H - 12); }
    this.tvTex.needsUpdate = true; this._dirty = true;
  }
  /* chaque lampe n'éclaire que sa pièce (les murs arrêtent la lumière) */
  _roomMask() {
    const Z = { liv: [435, 10, 775, 370], livK: [380, 255, 455, 370], kit: [330, 210, 455, 370], kitD: [435, 255, 560, 370], bath: [10, 105, 135, 210], mat: [200, 210, 330, 370] };
    const v = (z) => new THREE.Vector4((z[0] - 390) / 50, (z[1] - 190) / 50, (z[2] - 390) / 50, (z[3] - 190) / 50);
    const zones = (e) => e.includes('cuisine_') ? ['kit', 'kitD'] : e.includes('salle_de_bain') ? ['bath', 'bath'] : e.includes('chambre_matteo') ? ['mat', 'mat'] : ['liv', 'livK'];
    const A = [], B = []; (this.plEnts || []).forEach((e) => { const [a, b] = zones(e); A.push(v(Z[a])); B.push(v(Z[b])); });
    if (!A.length) return;
    const frag = THREE.ShaderChunk.lights_fragment_begin.replace('getPointLightInfo( pointLight, geometryPosition, directLight );', `getPointLightInfo( pointLight, geometryPosition, directLight );
      { vec3 wp = transpose( mat3( viewMatrix ) ) * ( geometryPosition - viewMatrix[ 3 ].xyz ); vec4 ba = plBoxA[ i ]; vec4 bb = plBoxB[ i ];
        bool inA = wp.x >= ba.x && wp.x <= ba.z && wp.z >= ba.y && wp.z <= ba.w; bool inB = wp.x >= bb.x && wp.x <= bb.z && wp.z >= bb.y && wp.z <= bb.w;
        if ( ! ( inA || inB ) ) directLight.color = vec3( 0.0 ); }`);
    const hook = (sh) => { sh.uniforms.plBoxA = { value: A }; sh.uniforms.plBoxB = { value: B };
      sh.fragmentShader = sh.fragmentShader.replace('#include <lights_pars_begin>', '#include <lights_pars_begin>\n#if NUM_POINT_LIGHTS > 0\nuniform vec4 plBoxA[ NUM_POINT_LIGHTS ];\nuniform vec4 plBoxB[ NUM_POINT_LIGHTS ];\n#endif').replace('#include <lights_fragment_begin>', frag); };
    this.scene.traverse((o) => { const m = o.material; if (m && m.isMeshStandardMaterial) { m.onBeforeCompile = hook; m.customProgramCacheKey = () => 'roommask'; } });
  }
  _rgb(a) { return new THREE.Color(`rgb(${a[0]},${a[1]},${a[2]})`); }
  _wall(m) { m.userData.y0 = m.position.y; this.walls.push(m); }
  _more(ent) { this.dispatchEvent(new CustomEvent('hass-more-info', { bubbles: true, composed: true, detail: { entityId: ent } })); }

  /* ---------------- panneau de contrôle d'une lampe ---------------- */
  _setupPanel() {
    const $ = this.$, pn = $('.pn');
    $('.px').onclick = () => this._closePanel();
    $('.more').onclick = () => this.sel && this._more(this.sel);
    $('.pw').onclick = () => { const st = this._h.states[this.sel]; if (!st) return; const on = st.state === 'on';
      this._preview(on ? { bri: 0 } : { bri: (st.attributes.brightness ?? 255) / 255 }); this._h.callService('light', on ? 'turn_off' : 'turn_on', { entity_id: this.sel }); };
    const busy = (el) => { el.addEventListener('pointerdown', () => (this._busy = true)); const end = () => { clearTimeout(this._bt); this._bt = setTimeout(() => (this._busy = false), 1500); }; el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end); el.addEventListener('change', end); };
    const sb = $('.sb'), sc = $('.sc'); busy(sb); busy(sc);
    sb.oninput = () => { const v = +sb.value; $('.bv').textContent = v + '%'; this._preview({ bri: Math.max(0.12, v / 100) }); this._send({ brightness_pct: v }); };
    sc.oninput = () => { const k = +sc.value; this._preview({ col: this._rgb(k2rgb(k)) }); this._send({ color_temp_kelvin: k }); };
    // roue chromatique
    const hw = $('.hw'), ctx = hw.getContext('2d'), R = hw.width / 2, img = ctx.createImageData(hw.width, hw.height);
    for (let y = 0; y < hw.height; y++) for (let x = 0; x < hw.width; x++) { const dx = x - R, dy = y - R, d = Math.hypot(dx, dy) / R, i = (y * hw.width + x) * 4; if (d > 1) continue;
      const [r, g, b] = hsv2rgb((Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360, d); img.data.set([r, g, b, d > 0.985 ? (1 - d) / 0.015 * 255 : 255], i); }
    this._wheelImg = img; this._wheelCtx = ctx;
    const pick = (e) => { const r = hw.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width * 2 - 1, dy = (e.clientY - r.top) / r.height * 2 - 1;
      const h = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360, s = Math.min(1, Math.hypot(dx, dy)); this._wheelHS = [h, s]; this._drawWheel();
      this._preview({ col: this._rgb(hsv2rgb(h, s)) }); this._send({ hs_color: [Math.round(h), Math.round(s * 100)] }); };
    hw.addEventListener('pointerdown', (e) => { hw.setPointerCapture(e.pointerId); this._busy = true; pick(e); });
    hw.addEventListener('pointermove', (e) => { if (hw.hasPointerCapture(e.pointerId)) pick(e); });
    const endW = () => { clearTimeout(this._bt); this._bt = setTimeout(() => (this._busy = false), 1500); }; hw.addEventListener('pointerup', endW); hw.addEventListener('pointercancel', endW);
    // pastilles
    const sws = $('.sws'); SWATCH.forEach(([t, v]) => { const i = document.createElement('i'); const rgb = t === 'ct' ? k2rgb(v) : v; i.style.background = `rgb(${rgb})`; i.title = t === 'ct' ? v + ' K' : '';
      i.onclick = () => { const st = this._h.states[this.sel]; if (!st) return; const m = st.attributes.supported_color_modes || [];
        if (t === 'ct' && m.includes('color_temp')) { this._preview({ col: this._rgb(rgb) }); this._send({ color_temp_kelvin: v }, true); }
        else { this._preview({ col: this._rgb(rgb) }); this._send({ rgb_color: rgb }, true); } }; sws.appendChild(i); });
  }
  _drawWheel() { const c = this._wheelCtx, R = c.canvas.width / 2; c.putImageData(this._wheelImg, 0, 0); if (!this._wheelHS) return; const [h, s] = this._wheelHS, a = h * Math.PI / 180;
    const x = R + Math.cos(a) * s * R * 0.97, y = R + Math.sin(a) * s * R * 0.97; c.beginPath(); c.arc(x, y, 15, 0, 7); c.lineWidth = 5; c.strokeStyle = '#fff'; c.stroke(); c.beginPath(); c.arc(x, y, 18, 0, 7); c.lineWidth = 2; c.strokeStyle = 'rgba(0,0,0,.35)'; c.stroke(); }
  _preview(o) { const rec = this.lights[this.sel]; if (!rec) return; rec.ov = Object.assign(rec.ov && Date.now() < rec.ov.until ? rec.ov : {}, o, { until: Date.now() + 3000 }); if (o.col && (!rec.target || !rec.target.on) && o.bri === undefined) rec.ov.bri = 0.8; this._sync(); }
  _send(data, now) { const ent = this.sel; this._pend = { entity_id: ent, ...data }; const go = () => { this._h.callService('light', 'turn_on', this._pend); this._lastSend = Date.now(); this._pend = null; };
    clearTimeout(this._st); const wait = 280 - (Date.now() - (this._lastSend || 0)); if (now || wait <= 0) go(); else this._st = setTimeout(go, wait); }
  _openPanel(ent, x, y, obj) {
    const changed = this.sel !== ent; this.sel = ent; this._busy = false; if (changed) this._wheelHS = null;
    const p = new THREE.Vector3(); obj.getWorldPosition(p); this.selRing.position.set(p.x, 0.03, p.z); this.selRing.visible = true;
    this._renderPanel(true); const pn = this.$('.pn'), wrap = this.$('.wrap');
    const w = wrap.clientWidth, h = wrap.clientHeight; pn.style.left = Math.max(8, Math.min(w - 308, x + 18)) + 'px'; pn.style.top = Math.max(60, Math.min(h - pn.offsetHeight - 8, y - 80)) + 'px';
    pn.classList.remove('show'); void pn.offsetWidth; pn.classList.add('show'); this._dirty = true;
  }
  _closePanel() { this.sel = null; this.$('.pn').classList.remove('show'); this.selRing.visible = false; this._dirty = true; }
  _renderPanel(force) {
    if (!this.sel || !this.$) return; const st = this._h.states[this.sel]; if (!st) return; const A = st.attributes, on = st.state === 'on', $ = this.$;
    const modes = A.supported_color_modes || [], dim = modes.some((m) => m !== 'onoff'), rgbOk = modes.some((m) => RGBM.includes(m)), ctOk = modes.includes('color_temp');
    const rec = this.lights[this.sel], col = rec && rec.target ? rec.target.col : new THREE.Color('#ffd27a'), lit = rec && rec.target && rec.target.on, css = '#' + col.getHexString();
    const pn = $('.pn'); pn.style.setProperty('--c', lit ? css : '#3b3846');
    $('.pname').textContent = A.friendly_name || this.sel; $('.pdot').textContent = lit ? '💡' : '⚫';
    const pct = on ? Math.round((A.brightness ?? 255) / 2.55) : 0;
    $('.pst').textContent = on ? `Allumée · ${pct}%${A.color_mode === 'color_temp' && A.color_temp_kelvin ? ` · ${A.color_temp_kelvin} K` : ''}` : 'Éteinte';
    $('.pw').classList.toggle('on', on);
    $('.rb').classList.toggle('hide', !dim); $('.rc').classList.toggle('hide', !rgbOk); $('.rt').classList.toggle('hide', !ctOk);
    const sb = $('.sb'), sc = $('.sc'); sb.style.setProperty('--trk', `linear-gradient(90deg,#1d1b24,${css})`);
    if (this._busy && !force) return;
    sb.value = on ? Math.max(1, pct) : 1; $('.bv').textContent = on ? pct + '%' : '—';
    if (ctOk) { const lo = A.min_color_temp_kelvin || 2000, hi = A.max_color_temp_kelvin || 6500; sc.min = lo; sc.max = hi; sc.value = A.color_temp_kelvin || lo;
      sc.style.setProperty('--trk', `linear-gradient(90deg,rgb(${k2rgb(lo)}),rgb(${k2rgb((lo + hi) / 2)}),rgb(${k2rgb(hi)}))`); }
    if (rgbOk) { if (on && A.hs_color && A.color_mode !== 'color_temp') this._wheelHS = [A.hs_color[0], A.hs_color[1] / 100]; this._drawWheel(); }
  }
  _ambiance(a) {
    const all = Object.keys(this.lights).filter((e) => this._h.states[e] && this._h.states[e].state !== 'unavailable'), call = (s, e, d = {}) => e.length && this._h.callService('light', s, { entity_id: e, ...d });
    const ct = (e) => e.filter((x) => (this._h.states[x].attributes.supported_color_modes || []).includes('color_temp')), has = (e) => e.filter((x) => all.includes(x));
    const din = has(['light.salle_a_manger_lg', 'light.salle_a_manger_lc', 'light.salle_a_manger_ld']), spots = has([1, 2, 3, 4].map((i) => 'light.cuisine_s_cuisine_' + i));
    if (a === 'off') { call('turn_off', all); this._toast('⚫ Toutes les lumières s’éteignent'); }
    if (a === 'cine') { call('turn_off', has(['light.salon_l_salon', ...din, ...spots, 'light.cuisine_evier', 'light.cuisine_etagere_cafe', 'light.salle_a_manger_vit_g', 'light.salle_a_manger_vit_d']));
      call('turn_on', has(['light.salon_panneau_mural']), { brightness_pct: 20 }); call('turn_on', has(['light.salon_ambilight_tv'])); this._goTo('Salon', 1800); this._toast('🎬 Ambiance cinéma'); }
    if (a === 'diner') { call('turn_on', din.filter((e) => !ct(din).includes(e)), { brightness_pct: 70 }); call('turn_on', ct(din), { brightness_pct: 70, color_temp_kelvin: 2700 });
      call('turn_on', has(['light.salon_panneau_mural']), { brightness_pct: 35 }); call('turn_on', spots, { brightness_pct: 25 }); call('turn_off', has(['light.salon_l_salon'])); this._goTo('Salle à manger', 1800); this._toast('🍽️ Ambiance dîner'); }
  }
  _toast(m) { const t = this.$('.toast'); t.textContent = m; t.classList.add('show'); clearTimeout(this._tt); this._tt = setTimeout(() => t.classList.remove('show'), 1600); }

  _loop() {
    if (this._looping) return; this._looping = true;
    const tick = () => {
      if (!this._alive) { this._looping = false; return; }
      requestAnimationFrame(tick);
      let anim = false;
      // transitions douces des lumières
      for (const rec of Object.values(this.lights)) {
        const tg = rec.target; if (!tg) continue; rec.cur = rec.cur || { col: tg.col.clone(), bri: 0 };
        const c = rec.cur; const db = tg.bri - c.bri; if (Math.abs(db) > 0.004 || !c.col.equals(tg.col)) { c.bri += db * 0.15; c.col.lerp(tg.col, 0.15); if (Math.abs(db) < 0.004) c.bri = tg.bri; anim = true; }
        const n = 0.35 + 0.65 * this.night;
        rec.mats.forEach((m) => { m.emissive.copy(c.col); m.color.copy(c.col).multiplyScalar(c.bri > 0.01 ? 1 : 0.35); m.emissiveIntensity = c.bri * 2.6; });
        rec.pls.forEach((pl) => { pl.color.copy(c.col); pl.intensity = c.bri * rec.base * n; });
        (rec.beams || []).forEach((m) => { m.uniforms.c.value.copy(c.col); m.uniforms.o.value = c.bri * 0.2 * (0.2 + 0.8 * this.night); });
      }
      if (this.tvOn && this.tvScr) { const t = performance.now(); if (!this._tvT || t - this._tvT > 80) { this._tvT = t; this._drawTV(t / 1000); } }
      // jour / nuit
      const dn = this.nightTarget - this.night; if (Math.abs(dn) > 0.002) { this.night += dn * 0.06; anim = true; }
      const n = this.night;
      this.hemi.intensity = 1.05 - 0.85 * n; this.hemi.color.set(n > 0.5 ? '#8a8fb8' : '#ffffff'); this.sun.intensity = 1.8 * (1 - n) + 0.15 * n;
      this.renderer.toneMappingExposure = 1.05 + 0.2 * n; this.scene.background = new THREE.Color('#f1ede6').lerp(new THREE.Color('#15131c'), n);
      this.decor.forEach((m) => (m.emissiveIntensity = m.userData.base * (0.2 + 0.8 * n)));
      // ombres des lampes : les murs bloquent la lumière (8 lampes allumées max, carte d'ombre recalculée seulement si nécessaire)
      { const lit = []; for (const rec of Object.values(this.lights)) if (rec.cur && rec.cur.bri > 0.03) rec.pls.forEach((pl) => lit.push([pl, rec.base * rec.cur.bri])); lit.sort((a, b) => b[1] - a[1]);
        const want = new Set(lit.slice(0, 0).map((x) => x[0])); let sig = ''; for (const rec of Object.values(this.lights)) rec.pls.forEach((pl) => { const on = want.has(pl); if (pl.castShadow !== on) pl.castShadow = on; sig += on ? 1 : 0; });
        if (sig !== this._shSig) { this._shSig = sig; this.renderer.shadowMap.needsUpdate = true; } }
      if (this._shadowDirty) { this._shadowDirty = false; this.renderer.shadowMap.needsUpdate = true; }
      // murs bas / hauts
      const dw = this.wallTarget - this.wallF; if (Math.abs(dw) > 0.002) { this.wallF += dw * 0.1; if (Math.abs(dw) < 0.003) this.wallF = this.wallTarget; const f = this.wallF; this.walls.forEach((m) => { m.scale.y = f; m.position.y = m.userData.y0 * f; }); if (this.frontDoor) this.frontDoor.scale.y = f; if (this.ceiling) this.ceiling.visible = f > 0.95; anim = true; this.renderer.shadowMap.needsUpdate = true; }
      // sélection
      if (this.selRing.visible) { const k = (performance.now() / 900) % 1; this.selRing.scale.setScalar(1 + 0.25 * Math.sin(k * Math.PI * 2)); this.selRing.material.opacity = 0.6 + 0.35 * Math.cos(k * Math.PI * 2); anim = true; }
      // rotation vitrine après 60 s d'inactivité
      if (!this.sel && !this.anim && this.cfg.idle_rotate !== false && Date.now() - this._lastAct > 60000) this.ctl.autoRotate = true;
      // porte d'entrée
      if (this.frontDoor && this.doorTarget !== undefined) { const d = this.doorTarget - this.frontDoor.rotation.y; if (Math.abs(d) > 0.002) { this.frontDoor.rotation.y += d * 0.12; anim = true; this.renderer.shadowMap.needsUpdate = true; } }
      // mouvements détectés
      const now = performance.now() / 1000;
      this.pulses.forEach((p) => { const st = this._h.states[p.e]; const on = st && st.state === 'on'; if (on) { const k = (now % 1.6) / 1.6; p.r.scale.setScalar(1 + k * 2.2); p.r.material.opacity = 0.75 * (1 - k); anim = true; } else if (p.r.material.opacity > 0) { p.r.material.opacity = 0; anim = true; } });
      // caméra animée
      if (this.anim) { const a = this.anim; a.k = Math.min(1, (performance.now() - a.t) / a.dur); const e = 1 - Math.pow(1 - a.k, 3); this.cam.position.lerpVectors(a.p0, a.p1, e); this.ctl.target.lerpVectors(a.t0, a.t1, e); if (a.k >= 1) this.anim = null; anim = true; }
      const moved = this.ctl.update();
      if (!(anim || moved || this._dirty)) return;
      this._dirty = false; this.renderer.render(this.scene, this.cam);
      // étiquettes
      const w = this.renderer.domElement.clientWidth, h = this.renderer.domElement.clientHeight, v = new THREE.Vector3();
      this.labels.forEach((l) => { const [a, b] = this.P(l.x, l.y); v.set(a, 0.1, b).project(this.cam); const vis = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1; l.d.style.opacity = vis ? 1 : 0; l.d.style.left = ((v.x + 1) / 2) * w + 'px'; l.d.style.top = ((1 - v.y) / 2) * h + 'px'; });
    };
    tick();
  }
}
if (!customElements.get('floorplan-3d-card')) customElements.define('floorplan-3d-card', Floorplan3DCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'floorplan-3d-card', name: 'Plan 3D de la maison', description: 'Plan 3D interactif : lumières, températures, portes en direct' });
