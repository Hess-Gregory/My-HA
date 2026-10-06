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
  ['light.salle_de_bain_salle_de_bain', 75, 160, 2.15, 50], ['light.chambre_matteo', 255, 300, 2.15, 60], ['light.cuisine_evier', 344, 300, 1.43, 20],
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
      const m = new THREE.Mesh(new THREE.BoxGeometry(len + WT * S, WH, WT * S), MAT.wall); m.position.set((a + c) / 2, WH / 2, (b + d) / 2); m.rotation.y = ang; add(m); this._wall(m);
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
    floor([[10,210],[200,210],[200,370],[10,370]], MAT.oak); floor([[200,210],[330,210],[330,370],[200,370]], MAT.oak);
    floor([[330,210],[435,210],[435,255],[455,255],[455,370],[330,370]], MAT.tileGrey);
    floor([[435,10],[680,10],[680,130],[772,150],[745,355],[685,335],[685,370],[455,370],[455,255],[435,255]], MAT.tileGrey);
    /* ---- murs ---- */
    wall(10, 105, 235, 105); wall(235, 10, 235, 105, [[18, 58]]); wall(235, 10, 680, 10); wall(680, 10, 680, 130);
    const wB1 = wallAny(680, 130, 772, 150, 0.7), wB2 = wallAny(772, 150, 745, 355, 0); wallAny(745, 355, 685, 335, 0);
    wall(685, 335, 685, 370); wall(10, 370, 685, 370); wall(10, 105, 10, 370);
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
    /* ---- chambre enfant ---- */
    box(205, 270, 240, 335, 0.25, 0.38, MAT.white);
    for (const [a0, b0, a1, b1] of [[205, 270, 240, 272], [205, 333, 240, 335], [205, 272, 207, 333], [238, 272, 240, 333]]) box(a0, b0, a1, b1, 0, 0.9, MAT.white);
    box(209, 275, 236, 330, 0.38, 0.48, M('#c9d6c4'));
    for (const [x, y] of [[279, 221], [325, 221], [279, 320], [325, 320]]) box(x - 2, y - 2, x + 2, y + 2, 0, 1.75, MAT.white);
    box(277, 219, 327, 322, 1.35, 1.45, MAT.white); box(281, 223, 323, 318, 1.45, 1.6, MAT.fabric2); box(277, 219, 327, 222, 1.45, 1.75, MAT.white); box(277, 319, 327, 322, 1.45, 1.75, MAT.white);
    box(286, 270, 322, 316, 0, 0.75, M('#efe9df')); disc(250, 345, 24, 0.006, MAT.rug);
    clickable(sphere(255, 300, 5, 2.2, L('light.chambre_matteo', '#fff1d6', [255, 300, 2.1], 2.2, 4)), 'light.chambre_matteo');
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
    { const [a, b] = P(395, 354); const g = new THREE.CylinderGeometry(6 * S, 24 * S, 0.3, 4, 1); g.rotateY(Math.PI / 4); g.scale(1, 1, 0.7); const hood = new THREE.Mesh(g, MAT.white); hood.position.set(a, 1.72, b); hood.castShadow = true; scene.add(hood);
      const rim = new THREE.Mesh(new THREE.BoxGeometry(32 * S, 0.03, 20 * S), MAT.steel); rim.position.set(a, 1.57, b); scene.add(rim); }
    box(389, 358, 401, 366, 1.86, 2.3, MAT.white);
    box(411, 342, 424, 362, 0.9, 1.22, MAT.black);
    box(425, 292, 447, 366, 0, 0.9, MAT.greige); box(423, 290, 452, 366, 0.9, 0.94, MAT.worktop); box(440, 294, 457, 362, 1.06, 1.09, MAT.worktop); box(447, 296, 452, 360, 0.94, 1.06, M('#d8d5cf'));
    for (const y of [312, 344]) { cyl(468, y, 2, 0, 0.72, MAT.black, 10); cyl(468, y, 8, 0.72, 0.78, M('#2b2b2e'), 20); box(462, y - 7, 464, y + 7, 0.78, 1.15, M('#2b2b2e')); }
    box(371, 280, 375, 350, 2.25, 2.29, MAT.black, false);
    [287, 306, 326, 344].forEach((y, i) => { const e = 'light.cuisine_s_cuisine_' + (i + 1); cyl(373, y, 1, 2.16, 2.25, MAT.black, 8); clickable(cyl(373, y, 3, 2.05, 2.17, MAT.black), e); clickable(cyl(373, y, 2.4, 2.035, 2.05, L(e, '#fff4e0', [373, y, 1.95], 1.1, 3)), e); });
    /* ---- salon ---- */
    box(440, 14, 466, 32, 0, 0.75, MAT.oakDark); box(442, 16, 464, 30, 0.75, 1.0, MAT.white); box(444, 12, 462, 13.5, 1.25, 1.55, MAT.black, false);
    box(474, 11, 490, 13.5, 0.4, 2.25, MAT.oakLight, false); for (let x = 475; x < 490; x += 2.2) box(x, 13.5, x + 1, 14.2, 0.4, 2.25, M('#b8955f'), false);
    clickable(box(496, 9.2, 612, 12.4, 0.55, 2.05, L('light.salon_panneau_mural', '#ffd27a', [554, 30, 1.3], 2.4, 3.4), false), 'light.salon_panneau_mural');
    clickable(box(500, 12.5, 608, 14.6, 0.65, 1.95, MAT.white), 'light.salon_panneau_mural');
    clickable(box(526, 14.6, 582, 15.8, 0.95, 1.55, L('light.salon_ambilight_tv', '#7f6bff', [554, 26, 1.2], 1.6, 2.4), false), 'light.salon_ambilight_tv');
    this.tvMat = M('#101012', { roughness: 0.25, emissive: '#2a3b6a', emissiveIntensity: 0 }); box(530, 15.8, 578, 17.2, 1.0, 1.5, this.tvMat, false);
    { const cv = document.createElement('canvas'); cv.width = 320; cv.height = 180; this.tvCv = cv; this.tvTex = new THREE.CanvasTexture(cv); this.tvTex.colorSpace = THREE.SRGBColorSpace;
      this.tvScr = new THREE.Mesh(new THREE.PlaneGeometry(46 * S, 0.47), new THREE.MeshBasicMaterial({ map: this.tvTex, toneMapped: false })); const [a, b] = P(554, 17.3);
      this.tvScr.position.set(a, 1.25, b); this.tvScr.visible = false; scene.add(this.tvScr); clickable(this.tvScr, 'media_player.televiseur_du_salon'); }
    box(470, 13, 640, 33, 0, 0.5, MAT.white); box(585, 13, 630, 31, 0.5, 0.78, MAT.oakLight);
    box(640, 13, 676, 30, 0, 2.2, MAT.oakLight); for (const z of [0.5, 0.95, 1.4, 1.85]) box(641, 14, 675, 29, z, z + 0.03, M('#b8955f'), false);
    box(640, 29.5, 676, 30.2, 0.1, 2.15, decor('#ffcf88', 0.6, { transparent: true, opacity: 0.35 }), false);
    box(510, 52, 640, 140, 0, 0.01, MAT.rug2, false); box(545, 75, 612, 112, 0, 0.36, MAT.white); box(560, 82, 600, 105, 0.36, 0.4, MAT.oakLight);
    box(500, 140, 676, 182, 0, 0.42, MAT.sofa); box(500, 172, 676, 182, 0.42, 0.88, MAT.sofa2); box(634, 55, 676, 140, 0, 0.42, MAT.sofa); box(634, 55, 676, 62, 0.42, 0.62, MAT.sofa2); box(668, 62, 676, 172, 0.42, 0.88, MAT.sofa2);
    box(500, 140, 507, 182, 0.42, 0.6, MAT.sofa2); for (const x of [515, 555, 595]) box(x, 160, x + 26, 172, 0.42, 0.75, MAT.sofa2);
    { const [a, b] = P(575, 95); const hat = new THREE.Mesh(new THREE.ConeGeometry(30 * S, 0.1, 48, 1, true), M('#c8a55e', { transparent: true, opacity: 0.3, side: THREE.DoubleSide, roughness: 1 })); hat.position.set(a, 2.05, b); scene.add(hat); clickable(hat, 'light.salon_l_salon'); }
    clickable(sphere(575, 95, 4, 1.98, L('light.salon_l_salon', '#ffcf8a', [575, 95, 1.9], 2.6, 5)), 'light.salon_l_salon');
    // radiateurs (cliquables → thermostat)
    this.rads = [];
    [[673, 22, 677, 75, 0.15, 0.75, 'climate.living'], [440, 206, 444, 240, 0.15, 0.75, 'climate.living'], [645, 362, 670, 366, 0.15, 0.75, 'climate.living'],
     [70, 362, 130, 366, 0.15, 0.7, 'climate.chambre_adulte'], [250, 362, 295, 366, 0.15, 0.7, 'climate.chambre_enfants'], [131, 140, 134, 172, 0.4, 1.6, 'climate.salle_de_bain'], [365, 13, 405, 17, 0.15, 0.75, 'climate.couloir']]
      .forEach(([a0, b0, a1, b1, z0, z1, e]) => { const m = M('#f4f3ef', { roughness: 0.5, emissive: '#ff5a1f', emissiveIntensity: 0 }); clickable(box(a0, b0, a1, b1, z0, z1, m), e); this.rads.push({ m, e }); });
    // tablette murale (écran simulé selon son état)
    box(439.5, 215, 441, 233, 1.28, 1.52, MAT.black, false);
    { const cv = document.createElement('canvas'); cv.width = 256; cv.height = 160; this.tabCv = cv; this.tabTex = new THREE.CanvasTexture(cv); this.tabTex.colorSpace = THREE.SRGBColorSpace;
      this.tabMat = new THREE.MeshBasicMaterial({ map: this.tabTex, toneMapped: false }); const [a, b] = P(441.1, 224);
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(16 * S, 0.2), this.tabMat); scr.position.set(a, 1.4, b); scr.rotation.y = Math.PI / 2; scene.add(scr); clickable(scr, 'switch.salon_sam_tablette_ecran'); }
    { const [a, b] = P(676.5, 102); const c = new THREE.Mesh(new THREE.CircleGeometry(13 * S, 40), M('#efe9df')); c.position.set(a, 1.75, b); c.rotation.y = -Math.PI / 2; scene.add(c); }
    along(wB1, 0.15, 0.85, 1, 18, 0, 0.95, MAT.white);
    along(wB2, 0.12, 0.88, 1, 22, 0, 0.92, MAT.patine); along(wB2, 0.15, 0.85, 3, 17, 0.92, 1.0, MAT.white);
    for (const t of [0.2, 0.33, 0.5, 0.67, 0.8]) along(wB2, t - 0.055, t + 0.055, 5, 13, 1.0, 1.05, MAT.black, false);
    along(wB2, 0.02, 0.1, 2, 13, 0, 1.15, MAT.white); along(wB2, 0.9, 0.98, 2, 13, 0, 1.15, MAT.white);
    clickable(along(wB2, 0.285, 0.375, 1.2, 2.5, 1.0, 1.22, L('light.coin_dj_sono_gauche', '#ff2a3a', [758, 205, 1.15], 1.8, 2.4), false), 'light.coin_dj_sono_gauche');
    clickable(along(wB2, 0.625, 0.715, 1.2, 2.5, 1.0, 1.22, L('light.coin_dj_sono_droite', '#ff2a3a', [751, 275, 1.15], 1.8, 2.4), false), 'light.coin_dj_sono_droite');
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
      const dw = this.wallTarget - this.wallF; if (Math.abs(dw) > 0.002) { this.wallF += dw * 0.1; if (Math.abs(dw) < 0.003) this.wallF = this.wallTarget; const f = this.wallF; this.walls.forEach((m) => { m.scale.y = f; m.position.y = m.userData.y0 * f; }); if (this.frontDoor) this.frontDoor.scale.y = f; anim = true; this.renderer.shadowMap.needsUpdate = true; }
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
