/* Plan 3D interactif de la maison — lumières, températures, portes et mouvements en direct */
import * as THREE from '/local/plan3d/three.module.min.js';
import { OrbitControls } from '/local/plan3d/OrbitControls.js';

const ROOM_TEMPS = [
  ['Pièce de vie', 605, 190, 'sensor.temp_piece_de_vie_sonoff_a480146b56_temperature'],
  ['Cuisine', 392, 300, null],
  ['Chambre adulte', 105, 290, 'sensor.temp_chambre_adulte_sonoff_a480146b5b_temperature'],
  ['Chambre enfant', 265, 290, 'sensor.temp_chambre_enfants_sonoff_a480146b58_temperature'],
  ['Salle de bain', 72, 157, 'sensor.temp_salle_de_bain_sonoff_a480146b5d_temperature'],
  ['Hall d’entrée', 335, 58, 'sensor.temp_couloir_sonoff_a480146b60_temperature'],
  ['Buanderie', 380, 158, null],
  ['WC', 185, 130, null],
];
const MOTION = [['binary_sensor.hall_dentree_mouvement_couloir_mouvement', 400, 45], ['binary_sensor.piece_de_vie_detecteur_living_mouvement', 665, 340]];
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
  ['light.salle_de_bain_sdb_evier', 75, 155.8, 2.1, 15], ['light.salle_de_bain_sdb_douche', 71.4, 162.4, 2.1, 15], ['light.salle_de_bain_sdb_langer', 78.6, 162.4, 2.1, 15], ['light.chambre_matteo', 262, 292, 2.15, 60], ['light.cuisine_evier', 344, 300, 1.43, 20],
  ...[287, 306, 326, 344].map((y, i) => ['light.cuisine_s_cuisine_' + [4, 2, 3, 1][i], 373, y, 2.02, 24])];

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
      :host{display:block}${this.cfg.compact ? ' .t,.amb,.alarm,.info{display:none!important} .wrap{border-radius:22px;box-shadow:none}' : ''}
      .wrap{position:relative;width:100%;height:${this.cfg.height || 'calc(100vh - 112px)'};min-height:420px;border-radius:22px;overflow:hidden;background:linear-gradient(180deg,#6fa8e0 0%,#a9cdef 55%,#eef5fb 100%);transition:background 1.5s;box-shadow:0 10px 30px rgba(0,0,0,.35)}
      canvas{display:block;width:100%;height:100%;touch-action:none}
      .ov{position:absolute;inset:0;pointer-events:none}
      .stars{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity 2s;background-image:radial-gradient(1.6px 1.6px at 0% 7%,#fff 60%,transparent),radial-gradient(1px 1px at 37% 60%,#fff 60%,transparent),radial-gradient(1px 1px at 74% 51%,#fff 60%,transparent),radial-gradient(1.6px 1.6px at 11% 42%,#fff 60%,transparent),radial-gradient(1px 1px at 48% 33%,#fff 60%,transparent),radial-gradient(1px 1px at 85% 24%,#fff 60%,transparent),radial-gradient(1.6px 1.6px at 22% 15%,#fff 60%,transparent),radial-gradient(1px 1px at 59% 6%,#fff 60%,transparent),radial-gradient(1px 1px at 96% 59%,#fff 60%,transparent),radial-gradient(1.6px 1.6px at 33% 50%,#fff 60%,transparent),radial-gradient(1px 1px at 70% 41%,#fff 60%,transparent),radial-gradient(1px 1px at 7% 32%,#fff 60%,transparent),radial-gradient(1.6px 1.6px at 44% 23%,#fff 60%,transparent),radial-gradient(1px 1px at 81% 14%,#fff 60%,transparent),radial-gradient(1px 1px at 18% 5%,#fff 60%,transparent),radial-gradient(1.6px 1.6px at 55% 58%,#fff 60%,transparent),radial-gradient(1px 1px at 92% 49%,#fff 60%,transparent),radial-gradient(1px 1px at 29% 40%,#fff 60%,transparent),radial-gradient(1.6px 1.6px at 66% 31%,#fff 60%,transparent),radial-gradient(1px 1px at 3% 22%,#fff 60%,transparent),radial-gradient(1px 1px at 40% 13%,#fff 60%,transparent),radial-gradient(1.6px 1.6px at 77% 4%,#fff 60%,transparent),radial-gradient(1px 1px at 14% 57%,#fff 60%,transparent),radial-gradient(1px 1px at 51% 48%,#fff 60%,transparent),radial-gradient(1.6px 1.6px at 88% 39%,#fff 60%,transparent),radial-gradient(1px 1px at 25% 30%,#fff 60%,transparent),radial-gradient(1px 1px at 62% 21%,#fff 60%,transparent),radial-gradient(1.6px 1.6px at 99% 12%,#fff 60%,transparent),radial-gradient(1px 1px at 36% 3%,#fff 60%,transparent),radial-gradient(1px 1px at 73% 56%,#fff 60%,transparent),radial-gradient(1.6px 1.6px at 10% 47%,#fff 60%,transparent),radial-gradient(1px 1px at 47% 38%,#fff 60%,transparent),radial-gradient(1px 1px at 84% 29%,#fff 60%,transparent),radial-gradient(1.6px 1.6px at 21% 20%,#fff 60%,transparent),radial-gradient(1px 1px at 58% 11%,#fff 60%,transparent),radial-gradient(1px 1px at 95% 2%,#fff 60%,transparent);animation:tw 5s ease-in-out infinite alternate}
      @keyframes tw{from{filter:brightness(.7)}to{filter:brightness(1.3)}}
      .vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 55%,transparent 55%,rgba(10,12,30,.38) 100%)}
      canvas{position:relative}
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
      .pseg{display:grid;grid-template-columns:1fr 1.3fr;gap:6px;margin-top:12px}.pseg button{padding:8px 6px;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pseg button.on{background:var(--c,#ffd27a);color:#1c1826;border-color:transparent}
      .ovp{width:350px;max-height:calc(100% - 70px);overflow:auto;--c:#ff9d2e;scrollbar-width:none}.ovp::-webkit-scrollbar{display:none}
      .ovp .pdot{background:radial-gradient(circle at 35% 30%,#3a2a1a,#140d05);border:1px solid #ff9d2e55}.ovp.hot .pdot{background:radial-gradient(circle at 40% 35%,#ffb45a,#d2560c);box-shadow:0 0 22px #ff8a2a}
      .ovs{font-size:11px;opacity:.6;text-transform:uppercase;letter-spacing:.08em;margin:14px 2px 6px}
      .opg{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
      .opg button,.ofv button{border-radius:14px;padding:7px 2px 6px;font:600 10px/1.15 system-ui,Roboto,sans-serif;background:linear-gradient(180deg,#18161e,#0f0e13);border:1px solid #2a2832;color:#c9c9d3;display:flex;flex-direction:column;align-items:center;gap:3px}
      .opg button i{font-style:normal;font-size:18px;line-height:1}
      .opg button.on{background:linear-gradient(180deg,#2a1a08,#140d05);border-color:#ff9d2e;box-shadow:0 0 12px rgba(255,157,46,.4);color:#ffd9a8}
      .oset{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .obox{border-radius:16px;padding:10px;background:linear-gradient(180deg,#16141c,#0e0d12);border:1px solid #27252e}
      .obox .ov2{display:flex;align-items:center;justify-content:space-between;margin:2px 0 8px}
      .obox .ov2 b{font:800 20px system-ui,Roboto,sans-serif;color:#fff;white-space:nowrap}.obox .ov2 b small{font-size:12px;color:#ffc98a;margin-left:2px}
      .obox .ov2 button{width:32px;height:32px;padding:0;font-size:18px;line-height:1;background:radial-gradient(circle at 35% 30%,#ffae52,#c25a10);border:none;color:#fff;box-shadow:0 3px 0 #7a3608}
      .opr{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}.opr button{padding:5px 0;font-size:10.5px;border-radius:10px;background:#1d1b24;border-color:#2e2c36}
      .oact{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:8px;margin-top:12px}
      .oact button{padding:11px 4px;border-radius:14px;font-size:13px}
      .oact .ogo{background:linear-gradient(180deg,#ff9d2e,#e0700f);color:#1c1206;border:none;box-shadow:0 0 16px rgba(255,140,40,.45)}
      .oact .ogo.arm,.ofv button.arm{background:#ffd27a;color:#1c1826;border-color:#ffd27a;animation:pz .6s ease-in-out infinite alternate}
      @keyframes pz{to{transform:scale(1.04)}}
      .oprog{height:6px;border-radius:6px;background:#2a2832;margin-top:10px;overflow:hidden}.oprog i{display:block;height:100%;background:linear-gradient(90deg,#ff9d2e,#ffd27a);border-radius:6px;transition:width .6s}
      .ofv{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}.ofv::-webkit-scrollbar{display:none}
      .ofv button{flex:none;width:88px;padding:8px 4px;font-size:10px;white-space:normal}.ofv button i{font-style:normal;font-size:16px}
      .hide{display:none!important}
      @media (max-width:600px){.t{font-size:15px}.views button{padding:6px 10px;font-size:12px}.info{display:none}.amb{top:auto;bottom:56px}
        .pn{left:8px!important;right:8px;top:auto!important;bottom:8px;width:auto;transform-origin:bottom center}}
    </style>
    <div class="wrap"><div class="stars"></div><canvas></canvas><div class="vig"></div><div class="ov"></div>
      <div class="bar"><div class="t">🏠 Ma maison en 3D<small>Touchez une lampe ou un radiateur · glissez pour tourner · pincez pour zoomer</small></div>
        <button class="walls">🧱 Murs bas</button><button class="mode">🌓 Auto</button><button class="alarm">🛡️ …</button></div>
      <div class="amb"><button data-a="cine">🎬 Cinéma</button><button data-a="diner">🍽️ Dîner</button><button data-a="off">⚫ Tout éteindre</button></div>
      <div class="views"></div><div class="info"></div><div class="toast"></div>
      <div class="pn"><div class="ph"><div class="pdot">💡</div><div class="pt"><div class="pname"></div><small class="pst"></small></div><button class="pw"></button><button class="px">✕</button></div>
        <div class="pseg hide"><button data-m="one">💡 Ce spot</button><button data-m="grp">✨ <span class="pgn"></span></button></div>
        <div class="row rb"><span>☀️</span><input type="range" class="sb" min="1" max="100"><b class="bv"></b></div>
        <div class="wh rc"><canvas class="hw" width="296" height="296"></canvas><div class="sws"></div></div>
        <div class="row rt"><span>🔥</span><input type="range" class="sc" step="50"><span>❄️</span></div>
        <button class="more">⚙️ Plus d’options</button></div>
      <div class="pn ovp"><div class="ph"><div class="pdot">🔥</div><div class="pt"><div>Four Siemens</div><small class="ost"></small></div><button class="pw opw"></button><button class="px oclose">✕</button></div>
        <div class="oprog hide"><i></i></div>
        <div class="ovs">Programme</div><div class="opg"></div>
        <div class="ovs">Réglages</div><div class="oset">
          <div class="obox"><small>🌡️ Température</small><div class="ov2"><button data-r="temp" data-d="-5">−</button><b class="otv"></b><button data-r="temp" data-d="5">+</button></div><div class="opr"><button data-r="temp" data-v="160">160°</button><button data-r="temp" data-v="180">180°</button><button data-r="temp" data-v="200">200°</button><button data-r="temp" data-v="220">220°</button></div></div>
          <div class="obox"><small>⏳ Durée</small><div class="ov2"><button data-r="duree" data-d="-300">−</button><b class="odv"></b><button data-r="duree" data-d="300">+</button></div><div class="opr"><button data-r="duree" data-v="900">15m</button><button data-r="duree" data-v="1800">30m</button><button data-r="duree" data-v="2700">45m</button><button data-r="duree" data-v="3600">1h</button></div></div></div>
        <div class="oact"><button class="ogo">▶ Démarrer</button><button class="opause">⏸ Pause</button><button class="ostop">⏹ Arrêter</button></div>
        <div class="ovs">Mes favoris</div><div class="ofv"></div>
        <button class="more omore">⚙️ Toutes les options du four</button></div></div>`;
    this.$ = (s) => root.querySelector(s);
    const canvas = this.$('canvas'), wrap = this.$('.wrap');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); renderer.setClearColor(0x000000, 0);
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
    { const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d'); const gr = g.createRadialGradient(128, 128, 20, 128, 128, 128); gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(0.55, 'rgba(255,255,255,0.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
      const t = new THREE.CanvasTexture(cv); this.plinth = new THREE.Mesh(new THREE.CircleGeometry(14, 64), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, color: '#f3f1ec' })); this.plinth.rotation.x = -Math.PI / 2; this.plinth.position.set(0.4, -0.004, 0.3); this.plinth.renderOrder = -1; scene.add(this.plinth); }
    this.night = 0; this.nightTarget = 0; this.mode = 'auto';
    // UI
    const views = this.$('.views');
    Object.keys(VIEWS).forEach((k) => { const b = document.createElement('button'); b.textContent = k; b.onclick = () => this._goTo(k); views.appendChild(b); });
    this.$('.mode').onclick = () => { this.mode = { auto: 'jour', jour: 'nuit', nuit: 'auto' }[this.mode]; this._sync(); };
    this.$('.walls').onclick = () => { this.wallTarget = this.wallTarget === 1 ? 0.28 : 1; this.$('.walls').textContent = this.wallTarget === 1 ? '🧱 Murs bas' : '🧱 Murs hauts'; this.$('.walls').classList.toggle('on', this.wallTarget !== 1); };
    root.querySelectorAll('.amb button').forEach((b) => (b.onclick = () => this._ambiance(b.dataset.a)));
    this._setupPanel();
    // labels
    const ov = this.$('.ov'); this.labels = ROOM_TEMPS.map(([n, x, y, e, h]) => { const d = document.createElement('div'); d.className = 'lb'; ov.appendChild(d); return { n, x, y, e, d, h: h || 0.1 }; });
    // interactions (tap = basculer la lumière)
    const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null;
    canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY, Date.now()]; this._lastAct = Date.now(); ctl.autoRotate = false; this.anim = null; });
    canvas.addEventListener('pointerup', (e) => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 8) return;
      const r = canvas.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ptr, cam); const hit = ray.intersectObjects(this.clickables, false)[0];
      if (!hit) { this._closeOven(); return this._closePanel(); }
      const ent = hit.object.userData.entity, st = this._h.states[ent];
      if (ent === '@alarm') { const al = Object.keys(this._h.states).find((k) => k.startsWith('alarm_control_panel.')); return al && this._more(al); }
      if (ent === 'sensor.four_etat') { this._closePanel(); return this._openOven(e.clientX - r.left, e.clientY - r.top); }
      if ((!st || st.state === 'unavailable') && !(ent.startsWith('light.') && this._grpOf(ent))) return this._toast('Lampe indisponible');
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
    const wallAny = (x0, y0, x1, y1, win, op) => {
      const [a, b] = P(x0, y0), [c, d] = P(x1, y1); const len = Math.hypot(c - a, d - b), ang = -Math.atan2(d - b, c - a);
      const L0 = len + WT * S, ux = (c - a) / len, uz = (d - b) / len; const piece = (f0, f1, z0, z1) => { const cx = ((f0 + f1) / 2 - 0.5) * L0; const m = new THREE.Mesh(new THREE.BoxGeometry((f1 - f0) * L0, z1 - z0, WT * S), MAT.wall); m.position.set((a + c) / 2 + ux * cx, (z0 + z1) / 2, (b + d) / 2 + uz * cx); m.rotation.y = ang; add(m); this._wall(m); };
      if (win) { const f = (1 - win) / 2; piece(0, f, 0, WH); piece(1 - f, 1, 0, WH); piece(f, 1 - f, 0, 0.9); piece(f, 1 - f, 2.15, WH); } else if (op) { const g = (t) => (t * len + WT * S / 2) / L0, f0 = g(op[0]), f1 = g(op[1]); piece(0, f0, 0, WH); piece(f1, 1, 0, WH); if (op[2] > 0.001) piece(f0, f1, 0, op[2]); piece(f0, f1, op[3], WH); } else piece(0, 1, 0, WH);
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
    wall(10, 105, 235, 105); wall(235, 10, 235, 105, [[18, 58]]); wall(235, 10, 680, 10); wall(680, 10, 680, 130, [[34, 80]]); box(675.5, 34, 684.5, 80, 0, 0.9, MAT.wall); box(675.5, 34, 684.5, 80, 2.15, WH, MAT.wall); box(675.5, 34, 684.5, 80, WH, WH + 0.03, MAT.wallTop, false);
    const wB1 = wallAny(680, 130, 772, 150, 0.7), wB2 = wallAny(772, 150, 745, 355, 0);
    { const wSm = wallAny(745, 355, 685, 335, 0, [0.12, 0.6, 0, 2.15]); const [t0, t1] = [0.12, 0.6], fw = M('#f4f4f2', { roughness: 0.5 });
      this._wall(along(wSm, t0, t1, -WT / 2 - 0.6, WT + 1.2, 0, 2.15, MAT.window, false)); for (const t of [t0, t1 - 0.022]) this._wall(along(wSm, t, t + 0.022, -WT / 2, WT, 0, 2.15, fw, false));
      this._wall(along(wSm, t0, t1, -WT / 2, WT, 2.11, 2.15, fw, false)); this._wall(along(wSm, t0, t1, -WT / 2, WT, 0, 0.04, fw, false)); }
    wall(685, 335, 685, 370); wall(10, 370, 685, 370, [[50, 150], [245, 300], [470, 640]]); for (const [a0, a1, z0] of [[50, 150, 0.9], [245, 300, 0.9], [470, 640, 0.02]]) { box(a0, 365.5, a1, 374.5, 0, z0, MAT.wall); box(a0, 365.5, a1, 374.5, 2.15, WH, MAT.wall); box(a0, 365.5, a1, 374.5, WH, WH + 0.03, MAT.wallTop, false); } wall(10, 105, 10, 370);
    { const occ = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }); const [a, b] = P(10, 10), [c, d] = P(775, 372); const ce = new THREE.Mesh(new THREE.BoxGeometry(c - a, 0.04, d - b), occ); ce.position.set((a + c) / 2, 2.36, (b + d) / 2); ce.castShadow = true; scene.add(ce); this.ceiling = ce; }
    // stores à lamelles verticales (chambre enfant : beige, salon côté TV : blanc)
    { const beige = M('#d9d2c4', { roughness: 0.9 }), whiteB = M('#efeeea', { roughness: 0.9 });
      for (let x = 245.5; x < 299; x += 3.6) box(x, 363.6, x + 3, 364.1, 0.92, 2.12, beige, false); box(245, 363.3, 300, 364.4, 2.12, 2.16, beige, false);
      for (let y = 34.5; y < 79; y += 3.6) box(673.6, y, 674.1, y + 3, 0.92, 2.12, whiteB, false); box(673.3, 34, 674.4, 80, 2.12, 2.16, whiteB, false); }
    { const camW = M('#f2f2f0', { roughness: 0.4 }), camB = M('#151517', { roughness: 0.2 });
      box(626, 14.6, 634, 15.6, 2.18, 2.26, camW, false); box(628.5, 15.6, 631.5, 18, 2.2, 2.24, camW, false); clickable(sphere(630, 19.5, 2.6, 2.19, camB), 'camera.salon_fluide');
      box(474, 364.4, 482, 365.4, 2.18, 2.26, camW, false); box(476.5, 362, 479.5, 364.4, 2.2, 2.24, camW, false); clickable(sphere(478, 360.5, 2.6, 2.19, camB), 'camera.rlc_843a_fluide');
      clickable(box(676.4, 361.6, 680.4, 365.4, 2.12, 2.24, camW, false), 'binary_sensor.piece_de_vie_detecteur_living_mouvement'); box(676.2, 361.4, 678.2, 361.7, 2.15, 2.2, camB, false); }
    // couleurs des murs (gris bleuté clair dans la pièce de vie, gris foncé à gauche du mur TV)
    { const liv = M('#bcc6ce', { roughness: 0.95 }), dark = M('#676c72', { roughness: 0.95 });
      const pw = (x0, y0, x1, y1, z0, z1, m = liv) => this._wall(box(x0, y0, x1, y1, z0, z1, m, false));
      pw(439.5, 14.6, 675.5, 14.9, 0, WH, dark);
      pw(675.1, 14.5, 675.4, 34, 0, WH); pw(675.1, 80, 675.4, 125.5, 0, WH); pw(675.1, 34, 675.4, 80, 0, 0.9); pw(675.1, 34, 675.4, 80, 2.15, WH);
      pw(439.6, 14.5, 439.9, 40, 0, WH); pw(439.6, 90, 439.9, 255, 0, WH);
      pw(455, 365.1, 470, 365.4, 0, WH); pw(640, 365.1, 680.5, 365.4, 0, WH); pw(470, 365.1, 640, 365.4, 2.15, WH);
      const pa = (wl, t0, t1, z0, z1) => this._wall(along(wl, t0, t1, 4.6, 0.3, z0, z1, liv, false));
      pa(wB1, 0, 0.15, 0, WH); pa(wB1, 0.85, 1, 0, WH); pa(wB1, 0.15, 0.85, 0, 0.9); pa(wB1, 0.15, 0.85, 2.15, WH); pa(wB2, 0, 1, 0, WH); }
    windowOn(50, 370, 150, 370); windowOn(245, 370, 300, 370); windowOn(680, 34, 680, 80); windowOn(470, 370, 640, 370, 0.02, 2.15);
    wall(135, 105, 135, 210, [[160, 200]]); wall(135, 155, 235, 155); wall(235, 105, 235, 155, [[116, 152]]);
    wall(325, 107, 435, 107); wall(325, 107, 325, 210); wall(10, 210, 330, 210, [[150, 195], [215, 260]]);
    wall(330, 210, 435, 210, [[365, 410]]); wall(435, 10, 435, 255, [[40, 90]]); wall(200, 210, 200, 370); wall(330, 210, 330, 370);
    
    // porte d'entrée (animée selon le capteur)
    { const [a, b] = P(235, 22.6); const piv = new THREE.Group(); piv.position.set(a, 0, b); scene.add(piv);
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(4.4 * S, 2.06, 30.8 * S), M('#f3f2ee', { roughness: 0.45 })); leaf.position.set(0, 1.03, 15.4 * S); leaf.castShadow = true; piv.add(leaf);
      const hdl = new THREE.Mesh(new THREE.BoxGeometry(1.6 * S, 0.025, 5 * S), M('#a9adb1', { metalness: 0.7, roughness: 0.3 })); hdl.position.set(2.9 * S, 1.02, 26.5 * S); piv.add(hdl); this.frontDoor = piv;
      box(230.5, 22.5, 239.5, 53.5, 2.08, WH, MAT.wall); box(230.5, 22.5, 239.5, 53.5, WH, WH + 0.03, MAT.wallTop, false); }
    /* ---- salle de bain / WC ---- */
    { // salle de bain : faïence blanche toute hauteur, baignoire contre le mur du fond (ouest), pare-bain givré côté sud + douche noire, bande de mosaïque,
      // colonne + meuble vasque blanc laqué + miroir LED au nord, table à langer au sud, panier noir ; plafonnier 3 spots Hue (langer / douche / évier)
      const tileW = M('#f3f4f3', { roughness: 0.22 }), gloss = M('#f7f7f5', { roughness: 0.18 }), blk = M('#1b1b1d', { roughness: 0.35 }), ceram = M('#fbfbfb', { roughness: 0.12 });
      const pw = (x0, y0, x1, y1, m = tileW) => this._wall(box(x0, y0, x1, y1, 0, WH, m, false));
      pw(14.5, 109.5, 14.8, 205.5); pw(14.5, 109.5, 130.5, 109.8); pw(14.5, 205.2, 130.5, 205.5); pw(130.2, 109.5, 130.5, 160); pw(130.2, 200, 130.5, 205.5);
      const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
      const mos = tex(32, 256, (g, w, h) => { const C = ['#ffffff', '#d9d9d9', '#9a9a9a', '#5c5c5e', '#2b2b2d', '#bdbdbd']; for (let y = 0; y < h; y += 8) for (let x = 0; x < w; x += 8) { const r = Math.random(), k = y < 40 ? (r < 0.45 ? 0 : Math.floor(r * 6)) : Math.floor(r * 6); g.fillStyle = C[k]; g.fillRect(x, y, 7, 7); } });
      { const [a, b] = P(14.95, 160); const m = new THREE.Mesh(new THREE.PlaneGeometry(8 * S, 1.72), new THREE.MeshStandardMaterial({ map: mos, roughness: 0.3 })); m.position.set(a, 0.58 + 0.86, b); m.rotation.y = Math.PI / 2; scene.add(m); }
      box(14.8, 109.8, 51, 201, 0, 0.55, tileW); box(14.8, 109.8, 51, 201, 0.55, 0.58, ceram); box(18, 113, 47.5, 197.5, 0.3, 0.581, M('#eef1f2', { roughness: 0.1 }), false);
      { const fr = tex(64, 256, (g, w, h) => { g.fillStyle = 'rgba(235,240,240,0.92)'; g.fillRect(0, 0, w, h); for (let y = 14; y < h; y += 17) g.clearRect(0, y, w, 6); });
        const gl = new THREE.MeshStandardMaterial({ map: fr, transparent: true, opacity: 0.85, roughness: 0.15, side: THREE.DoubleSide, depthWrite: false }); const [a, b] = P(50.6, 186.5);
        const m = new THREE.Mesh(new THREE.PlaneGeometry(37 * S, 1.42), gl); m.position.set(a, 0.6 + 0.71, b); m.rotation.y = Math.PI / 2; scene.add(m); box(50.2, 168, 51, 168.6, 0.6, 2.02, M('#c9cdd0', { metalness: 0.5, roughness: 0.3 }), false); box(50.4, 170, 50.9, 202, 1.05, 1.08, M('#c9cdd0', { metalness: 0.5, roughness: 0.3 }), false); }
      box(14.8, 189, 16.2, 190.4, 0.9, 2.08, blk, false); box(14.8, 189, 30, 190.4, 2.06, 2.09, blk, false); cyl(30, 189.7, 6, 2.0, 2.03, blk); box(14.8, 186, 17, 193, 0.95, 1.02, blk, false);
      box(14.8, 152, 18.5, 166, 0.68, 0.73, blk, false); box(18.5, 158, 22, 160, 0.66, 0.7, blk, false);
      box(52, 109.8, 69, 127, 0.1, 1.86, gloss); box(69, 112, 69.3, 126, 0.3, 1.7, M('#c9cdd0', { metalness: 0.5, roughness: 0.3 }), false);
      box(70, 109.8, 110, 132, 0.38, 0.78, gloss); box(70.5, 131.9, 109.5, 132.2, 0.4, 0.74, M('#e9e9e6', { roughness: 0.3 }), false); box(70, 109.8, 110, 132.5, 0.78, 0.86, ceram); box(76, 113, 104, 129, 0.8, 0.861, M('#edf0f1', { roughness: 0.1 }), false);
      cyl(90, 112, 1, 0.86, 1.02, blk); box(89, 111.5, 91, 116, 0.99, 1.02, blk, false); cyl(97, 122, 3.6, 0, 0.32, ceram);
      box(71, 109.8, 110, 110.5, 1.08, 1.86, MAT.mirror, false); box(80, 109.8, 102, 113.5, 1.88, 1.94, gloss, false); box(81, 113.4, 101, 113.6, 1.885, 1.935, L('light.salle_de_bain_salle_de_bain', '#fff1d6', null, 0.6), false);
      box(112, 111, 129, 128, 0, 0.62, M('#232325', { roughness: 0.8 }));
      box(54, 184, 92, 205, 0.86, 0.9, ceram); box(55, 185, 91, 204, 0.9, 0.98, M('#e7e5e0', { roughness: 0.6 })); for (const z of [0.12, 0.45]) box(54, 184, 92, 205, z, z + 0.025, ceram);
      for (const [x, y] of [[54.5, 184.5], [90.5, 184.5], [54.5, 203.5], [90.5, 203.5]]) box(x, y, x + 1.5, y + 1.5, 0.05, 0.86, ceram); for (const [x, y] of [[55.2, 185.2], [91.2, 185.2], [55.2, 204.2], [91.2, 204.2]]) cyl(x, y, 1, 0, 0.05, M('#9a9a9a'));
      // plafonnier 3 spots Hue : chaque spot est une lampe à part (cliquable seul ou en groupe)
      const nick = M('#a9adb1', { metalness: 0.7, roughness: 0.3 }); cyl(75, 160, 3.6, 2.27, 2.3, nick); clickable(cyl(75, 160, 3.2, 2.265, 2.27, L('light.salle_de_bain_salle_de_bain', '#fff1d6', [75, 160, 2.1], 0.4, 3.5)), 'light.salle_de_bain_salle_de_bain');
      for (const [e, dx, dy] of [['light.salle_de_bain_sdb_evier', 0, -4.2], ['light.salle_de_bain_sdb_douche', -3.6, 2.4], ['light.salle_de_bain_sdb_langer', 3.6, 2.4]]) {
        box(75 + dx * 0.45 - 0.5, 160 + dy * 0.45 - 0.5, 75 + dx * 0.45 + 0.5, 160 + dy * 0.45 + 0.5, 2.2, 2.27, nick, false); clickable(cyl(75 + dx, 160 + dy, 1.9, 2.13, 2.22, nick), e);
        clickable(cyl(75 + dx, 160 + dy, 1.6, 2.115, 2.13, L(e, '#fff1d6', null, 1.0)), e); this.lights[e].grp = 'light.salle_de_bain_salle_de_bain'; }
    }
    { // WC : mur du fond taupe (ouest) avec WC + 2 étagères + VMC, murs latéraux bleu clair, lave-mains blanc + robinetterie noire au nord, poubelle noire au sud
      const blue = M('#d4e3ea', { roughness: 0.95 }), taupe = M('#a99d90', { roughness: 0.95 }), ceram = M('#fbfbfb', { roughness: 0.12 }), blk = M('#1b1b1d', { roughness: 0.35 }), wood = M('#a8865f', { roughness: 0.6 }), shelf = M('#b9b3aa', { roughness: 0.7 });
      const pw = (x0, y0, x1, y1, m) => this._wall(box(x0, y0, x1, y1, 0, WH, m, false));
      pw(139.5, 109.5, 139.8, 150.5, taupe); pw(139.5, 109.5, 230.5, 109.8, blue); pw(139.5, 150.2, 230.5, 150.5, blue);
      box(139.8, 121, 148, 139, 0.36, 0.8, ceram); box(146.5, 127, 147.5, 133, 0.8, 0.82, M('#c9cdd0', { metalness: 0.6, roughness: 0.3 }), false);
      cyl(152, 130, 4, 0, 0.14, ceram); cyl(155, 130, 7, 0.14, 0.4, ceram); cyl(155.5, 130, 7.4, 0.4, 0.43, wood); cyl(155.5, 130, 4.4, 0.4, 0.432, M('#e8eef0'), 20); box(148.2, 123.5, 149.4, 136.5, 0.45, 0.86, wood, false);
      for (const z of [1.5, 1.82]) { box(139.8, 110, 152, 150, z, z + 0.03, shelf); box(139.8, 113, 141.5, 115, z - 0.06, z, blk, false); box(139.8, 145, 141.5, 147, z - 0.06, z, blk, false); }
      { const pap = M('#eef3f6', { roughness: 0.9 }); for (let i = 0; i < 6; i++) { cyl(146, 121 + i * 5, 2.3, 1.53, 1.645, pap, 16); cyl(146, 121 + i * 5, 2.3, 1.645, 1.76, pap, 16); } }
      box(139.8, 128, 140.6, 136, 1.98, 2.14, ceram, false); cyl(140.7, 132, 2.6, 2.04, 2.08, M('#d6d6d4'));
      box(160, 109.8, 183, 117.5, 0.78, 0.86, ceram); box(163, 110.5, 181, 116.5, 0.8, 0.861, M('#edf0f1', { roughness: 0.1 }), false); cyl(178, 112, 0.7, 0.86, 1.0, blk); box(177.5, 112, 178.5, 115, 0.97, 1.0, blk, false);
      cyl(171, 112.5, 1, 0.4, 0.78, blk); cyl(164, 112.5, 1.4, 0.86, 0.99, blk); box(151, 109.8, 154, 111.6, 0.72, 0.76, blk, false); cyl(152.5, 112, 1.6, 0.66, 0.72, M('#f2f2f2'), 14);
      cyl(147, 145, 3.6, 0, 0.36, blk); cyl(158, 115, 1.8, 0, 0.42, blk); cyl(158, 115, 0.4, 0.42, 0.62, M('#c9a57a'));
      const nick = M('#a9adb1', { metalness: 0.7, roughness: 0.3 }); box(183, 128.5, 197, 131.5, 2.27, 2.3, nick, false); cyl(186, 130, 1.5, 2.15, 2.25, nick); cyl(194, 130, 1.5, 2.15, 2.25, nick);
    }
    /* ---- hall ---- */
    box(300, 14, 350, 26, 0, 0.5, MAT.oakDark);
    { // hall d'après photos : mur des portes (entrée + WC) taupe avec BTicino Classe 300 EOS, clavier Ajax, radiateur, sirène au-dessus de la porte ;
      // mur de la porte du séjour taupe, murs latéraux bleu clair ; étagère cubes blanche + meuble bas foncé, chiffonnier, MotionCam dans l'angle, caméra dôme, détecteur incendie au plafond ; armoire blanche + pilier taupe
      const taupe = M('#a99d90', { roughness: 0.95 }), blue = M('#d2dfe6', { roughness: 0.95 }), wh = M('#f6f6f4', { roughness: 0.45 }), blk = M('#151517', { roughness: 0.3 }), dev = M('#f2f2f0', { roughness: 0.4 });
      const pw = (x0, y0, x1, y1, m, z0 = 0, z1 = WH) => this._wall(box(x0, y0, x1, y1, z0, z1, m, false));
      pw(239.5, 14.5, 239.8, 22.5, taupe); pw(239.5, 53.5, 239.8, 120.5, taupe); pw(239.5, 147.5, 239.8, 150.5, taupe); pw(239.5, 22.5, 239.8, 53.5, taupe, 2.08); pw(239.5, 120.5, 239.8, 147.5, taupe, 2.08);
      pw(430.2, 14.5, 430.5, 44.5, taupe); pw(430.2, 85.5, 430.5, 102.5, taupe); pw(430.2, 44.5, 430.5, 85.5, taupe, 2.08); pw(239.5, 14.5, 430.5, 14.8, blue); pw(325, 102.2, 430.5, 102.5, blue);
      for (const [a, b] of [[20.5, 55.5], [118.5, 149.5]]) { box(239.6, a, 240.6, a + 2, 0, 2.13, wh, false); box(239.6, b - 2, 240.6, b, 0, 2.13, wh, false); box(239.6, a, 240.6, b, 2.08, 2.13, wh, false); }
      for (const [a, b] of [[42.5, 87.5]]) { box(429.4, a, 430.4, a + 2, 0, 2.13, wh, false); box(429.4, b - 2, 430.4, b, 0, 2.13, wh, false); box(429.4, a, 430.4, b, 2.08, 2.13, wh, false); }
      const glow = (c) => M('#0b1a3a', { emissive: c, emissiveIntensity: 0.9, roughness: 0.2 });
      clickable(box(239.6, 66.5, 240.5, 72.5, 1.33, 1.6, blk), 'camera.hall_dentree_bticino_intercom_greg_et_sandrine_platine_de_rue'); clickable(box(240.5, 67.5, 240.6, 71.5, 1.37, 1.55, glow('#2f6bff')), 'camera.hall_dentree_bticino_intercom_greg_et_sandrine_platine_de_rue');
      clickable(box(239.6, 61, 240.4, 64.4, 1.38, 1.57, blk), '@alarm'); clickable(box(240.4, 61.5, 240.5, 63.9, 1.41, 1.54, glow('#7fd3ff')), '@alarm');
      box(239.6, 67.5, 240.2, 70.5, 1.1, 1.16, blk, false); box(239.6, 84, 241.8, 92, 1.36, 1.6, wh); box(239.6, 85, 241, 91, 1.6, 1.62, wh, false);
      clickable(box(239.6, 22, 241, 30, 2.13, 2.27, M('#1c1c1e', { roughness: 0.4 })), '@alarm'); box(241, 25, 241.1, 27, 2.16, 2.24, M('#3a0c0c', { emissive: '#ff2a2a', emissiveIntensity: 0.25 }), false);
      // étagère murale en cubes blancs (mur sud) + meuble bas foncé + chiffonnier gris
      const cube = (x, z) => { box(x, 101.6, x + 15, 102.2, z, z + 0.3, wh, false); box(x, 90, x + 0.7, 102.2, z, z + 0.3, wh); box(x + 14.3, 90, x + 15, 102.2, z, z + 0.3, wh); box(x, 90, x + 15, 102.2, z, z + 0.015, wh); box(x, 90, x + 15, 102.2, z + 0.285, z + 0.3, wh); };
      [[364, 1.62], [373, 1.92], [380, 1.62], [388, 1.77], [396, 1.47], [403, 1.62], [384, 1.32], [404, 1.17]].forEach(([x, z]) => cube(x, z));
      box(400, 86, 429.5, 102.2, 0, 0.82, M('#2e2b29', { roughness: 0.7 })); box(400, 86, 429.5, 102.2, 0.82, 0.85, M('#3a3634', { roughness: 0.6 }));
      box(417, 15, 429.5, 28, 0, 0.82, M('#9e978d', { roughness: 0.9 })); box(429.4, 19, 430.4, 34, 1.3, 1.33, wh, false);
      // détecteurs Ajax
      clickable(box(426.5, 14.8, 430.2, 18.5, 2.06, 2.27, dev), 'binary_sensor.hall_dentree_mouvement_couloir_mouvement'); clickable(sphere(427.4, 18.7, 0.9, 2.14, blk), 'camera.hall_dentree_mouvement_couloir');
      box(427.5, 99, 430.2, 102.2, 2.2, 2.3, dev, false); clickable(sphere(427.6, 99.4, 2.6, 2.17, dev), 'camera.couloir'); clickable(sphere(426, 98.4, 1.3, 2.15, blk), 'camera.couloir');
      this.fireMat = M('#f4f4f2', { roughness: 0.4, emissive: '#ff2a1a', emissiveIntensity: 0 }); clickable(box(408, 70, 416, 78, 2.25, 2.3, this.fireMat), 'binary_sensor.hall_dentree_incendie_couloir_fumee');
      // armoire blanche dans la niche + pilier taupe (côté couloir)
      // en face de la porte du WC : pilier taupe puis armoire blanche 2 portes + porte miroir étroite, bandeau foncé ; mur bleu clair jusqu'au fond ; plafonnier 2 spots
      this._wall(box(297, 106, 320.5, 118, 0, WH, taupe)); box(302, 118, 320.4, 205.4, 0, 1.97, wh); box(299, 111.5, 320.5, 205.5, 1.97, 2.03, M('#2a2725'));
      for (const y of [150, 182]) box(301.8, y - 0.15, 302.1, y + 0.15, 0.03, 1.94, M('#bdbdb8'), false); box(301.85, 182.4, 302.05, 204.6, 0.06, 1.92, M('#cfe2ea', { roughness: 0.05, metalness: 0.5 }), false);
      for (const y of [148.8, 151.2, 180.8]) cyl(301.6, y, 0.45, 0.98, 1.02, M('#9a9a9a'), 12);
      { // couloir vers la salle de bain : mur des chambres bleu clair, mur du WC bleu clair, mur de la salle de bain (fond) taupe
        const cw = (x0, y0, x1, y1, m, z0 = 0) => this._wall(box(x0, y0, x1, y1, z0, WH, m, false));
        cw(139.5, 205.2, 154.5, 205.5, blue); cw(190.5, 205.2, 219.5, 205.5, blue); cw(255.5, 205.2, 302, 205.5, blue); cw(154.5, 205.2, 190.5, 205.5, blue, 2.08); cw(219.5, 205.2, 255.5, 205.5, blue, 2.08);
        cw(139.5, 159.5, 239.5, 159.8, blue); cw(139.5, 159.8, 139.8, 164.5, taupe); cw(139.5, 195.5, 139.8, 205.2, taupe); cw(139.5, 164.5, 139.8, 195.5, taupe, 2.08);
        for (const [a, b] of [[154.5, 190.5], [219.5, 255.5]]) { box(a - 2, 204.2, a, 205.2, 0, 2.13, wh, false); box(b, 204.2, b + 2, 205.2, 0, 2.13, wh, false); box(a - 2, 204.2, b + 2, 205.2, 2.08, 2.13, wh, false); }
        box(139.8, 162.5, 140.8, 164.5, 0, 2.13, wh, false); box(139.8, 195.5, 140.8, 197.5, 0, 2.13, wh, false); box(139.8, 162.5, 140.8, 197.5, 2.08, 2.13, wh, false); }
      { const nk = M('#a9adb1', { metalness: 0.7, roughness: 0.3 }); cyl(280, 160, 2.6, 2.27, 2.3, nk); cyl(277.5, 160, 1.3, 2.16, 2.25, nk); cyl(282.5, 160, 1.3, 2.16, 2.25, nk); }
    }
    /* ---- buanderie ---- */
    { // buanderie / local technique d'après photos — en entrant (par le sud) : mur de gauche (ouest) = baie réseau + Ajax Hub 2 + tableau électrique,
      // puis l'armoire à persiennes, puis la chaudière Junkers dans l'angle ; mur d'en face (nord) = colonne lave-linge + sèche-linge AEG ; plafond = borne Omada + détecteur incendie
      const cream = M('#ece7dd', { roughness: 0.95 }), wh = M('#f4f4f1', { roughness: 0.4 }), grey = M('#d9dad6', { roughness: 0.5 }), blk = M('#141416', { roughness: 0.35 }), green = M('#3fae5a', { roughness: 0.5 });
      const pw = (x0, y0, x1, y1) => this._wall(box(x0, y0, x1, y1, 0, WH, cream, false));
      pw(329.5, 111.5, 329.8, 205.5); pw(329.5, 111.5, 430.5, 111.8); pw(430.2, 111.5, 430.5, 205.5); pw(329.5, 205.2, 369.5, 205.5); pw(405.5, 205.2, 430.5, 205.5);
      const LED = (x, y, z, c) => box(x, y, x + 0.3, y + 0.8, z, z + 0.012, M('#111', { emissive: c, emissiveIntensity: 1.2 }), false);
      // 1) baie réseau murale (porte vitrée à liseré vert) : Hue, switch Omada, NVR Reolink, routeur
      const NVR = 'switch.enregistreur_nvr_enregistrer';
      clickable(box(329.8, 170, 351, 198, 1.72, 2.26, grey), NVR); box(350.8, 171, 351.2, 197, 1.75, 2.23, M('#3a444a', { transparent: true, opacity: 0.22, roughness: 0.1, depthWrite: false }), false);
      for (const y of [171, 196.6]) box(350.8, y, 351.4, y + 0.4, 1.74, 2.24, green, false);
      for (const [z, c] of [[2.15, '#3cff6a'], [2.06, '#ffb02e'], [1.98, '#3cff6a'], [1.9, '#3cff6a'], [1.82, '#3cff6a']]) { box(332, 173, 350.4, 195, z - 0.035, z + 0.03, M('#1c1c1e', { roughness: 0.5 }), false); for (let k = 0; k < 4; k++) LED(350.45, 175 + k * 4.5, z, c); }
      box(348, 174, 350.4, 179, 2.17, 2.22, wh, false); box(348, 182, 350.4, 186, 2.17, 2.22, wh, false); LED(350.45, 176, 2.2, '#3a7bff'); LED(350.45, 183.5, 2.2, '#ff3a3a');
      // centrale Ajax Hub 2 sous la baie
      const ALARM = 'alarm_control_panel.buanderie_local_tech_centrale_alarme_ajax_maison';
      clickable(box(329.8, 174, 331.4, 182, 1.44, 1.64, blk, false), ALARM); box(331.4, 176.5, 331.5, 179.5, 1.535, 1.555, M('#111', { emissive: '#e8f2ff', emissiveIntensity: 1 }), false);
      // tableau électrique (porte fumée ouverte vers l'entrée) avec le Shelly Pro EM
      box(329.8, 172, 335.5, 195, 0.82, 1.4, wh); box(335.5, 173, 335.7, 194, 0.88, 1.34, M('#cfcfcb'), false);
      for (const z of [1.18, 0.98]) for (let k = 0; k < 13; k++) box(335.7, 174 + k * 1.4, 336.6, 175.1 + k * 1.4, z, z + 0.09, M(k % 4 === 0 ? '#9aa6c8' : '#f2f2ef'), false);
      clickable(box(335.7, 191.5, 337, 193.5, 0.97, 1.08, M('#f7f7f7', { emissive: '#3cff6a', emissiveIntensity: 0.15 }), false), 'sensor.buanderie_local_tech_compteur_general_maison_puissance');
      box(335.5, 195, 347, 195.4, 0.84, 1.38, M('#4a5258', { transparent: true, opacity: 0.35, depthWrite: false }), false);
      // 2) armoire à persiennes (blanc cassé, montants anthracite) contre le mur de gauche + planche bois au-dessus
      box(329.8, 131, 349.5, 166, 0, 1.72, M('#2e2f31', { roughness: 0.6 })); box(349.5, 132, 350.1, 148.3, 0.05, 1.68, wh, false); box(349.5, 148.7, 350.1, 165, 0.05, 1.68, wh, false);
      for (let z = 0.15; z < 1.62; z += 0.06) box(350.1, 133, 350.3, 164, z, z + 0.012, M('#e2e2de'), false); box(350.1, 132, 350.4, 165, 1.08, 1.11, M('#2e2f31'), false); box(350.4, 145.5, 351.1, 151.5, 1.04, 1.1, blk, false);
      // 3) chaudière murale Junkers dans l'angle nord-ouest (LED bleue, conduits vers le plafond)
      this.boilerLed = M('#111', { emissive: '#2f6bff', emissiveIntensity: 1 });
      clickable(box(329.8, 113, 345, 130.5, 1.18, 1.98, wh), 'sensor.chaudiere_etat'); box(344.9, 113, 345.2, 130.5, 1.18, 1.42, M('#e6e6e2'), false);
      { const [a, b] = P(345.3, 121.75); const led = new THREE.Mesh(new THREE.CircleGeometry(0.8 * S, 16), this.boilerLed); led.position.set(a, 1.27, b); led.rotation.y = Math.PI / 2; scene.add(led); clickable(led, 'sensor.chaudiere_etat'); }
      cyl(336, 118, 2.2, 1.98, 2.06, wh); cyl(336, 125, 2.2, 1.98, 2.04, M('#2a2a2c')); cyl(336, 118, 1.6, 2.06, 2.3, M('#b9bcc0', { metalness: 0.6, roughness: 0.3 }));
      for (const y of [116, 120, 124, 127]) cyl(338, y, 0.5, 0.9, 1.18, M('#b87333', { metalness: 0.6, roughness: 0.35 }));
      // mur d'en face (nord) : colonne lave-linge + sèche-linge AEG (hublots vers l'entrée)
      clickable(box(396, 111.8, 427, 142, 0, 0.85, wh), 'sensor.buanderie_local_tech_compteur_general_maison_puissance'); box(396, 111.8, 427, 142, 0.85, 1.72, wh);
      for (const [z, r] of [[0.42, 10], [1.25, 11]]) { const [a, b] = P(411.5, 142.1); const ring = new THREE.Mesh(new THREE.CircleGeometry(r * S, 32), M('#f0f0ee')); ring.position.set(a, z, b); scene.add(ring); const d = new THREE.Mesh(new THREE.CircleGeometry((r - 2.5) * S, 32), M('#1d2228', { roughness: 0.1 })); d.position.set(a, z, b + 0.002); scene.add(d); }
      box(414, 142, 424, 142.2, 1.58, 1.66, blk, false); box(414, 142, 424, 142.2, 0.74, 0.8, blk, false); cyl(407, 142.1, 1.4, 0.76, 0.78, wh); cyl(407, 142.1, 1.4, 1.6, 1.62, wh);
      // plafond : borne Wi-Fi Omada + détecteur incendie Ajax (près de la baie) + plafonnier 3 spots
      clickable(cyl(345, 160, 5.6, 2.26, 2.3, wh, 32), 'sensor.ap_buanderie_etat_de_l_appareil'); cyl(345, 165, 0.5, 2.255, 2.26, M('#111', { emissive: '#3a7bff', emissiveIntensity: 1.2 }));
      this.fireBMat = M('#f4f4f2', { roughness: 0.5, emissive: '#ff2a2a', emissiveIntensity: 0 }); clickable(box(357, 170, 363, 176, 2.25, 2.3, this.fireBMat, false), 'binary_sensor.buanderie_local_tech_detecteur_incendie_fumee');
      const nick = M('#a9adb1', { metalness: 0.7, roughness: 0.3 }); cyl(385, 165, 3.2, 2.27, 2.3, nick); for (const [dx, dy] of [[0, -3.5], [-3, 2], [3, 2]]) cyl(385 + dx, 165 + dy, 1.4, 2.15, 2.24, nick);
    }
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
      box(206, 259, 241, 261, 0, 0.92, greyOak); box(206, 327, 241, 329, 0, 0.92, greyOak);
      for (const x0 of [206, 239]) { box(x0, 261, x0 + 2, 327, 0.84, 0.9, greyOak); box(x0, 261, x0 + 2, 327, 0.22, 0.27, greyOak); for (let y = 263; y < 326; y += 3.2) box(x0 + 0.5, y, x0 + 1.5, y + 1, 0.27, 0.84, greyOak, false); }
      box(208, 261, 239, 327, 0.27, 0.4, M('#c9ced8'));
      box(204.8, 253, 205.3, 267, 0.95, 1.5, M('#d9534f'), false); box(204.8, 268, 205.3, 283, 0.92, 1.52, M('#a6cf3a'), false); box(204.8, 285, 205.3, 299, 1.0, 1.45, M('#c3cbdb'), false);
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
    box(335, 214.5, 365, 238, 0, 2.2, MAT.greige); box(335, 238, 365, 262, 0, 2.2, MAT.greige); clickable(box(365, 241, 365.8, 260, 0.85, 1.45, M('#0e0e10', { roughness: 0.18, metalness: 0.35 }), false), 'sensor.four_etat'); clickable(box(365, 241, 365.6, 260, 1.45, 1.53, MAT.steel, false), 'sensor.four_etat');
    box(365.8, 241.4, 366.3, 259.6, 1.395, 1.415, MAT.steel, false);
    this.ovenWin = M('#050506', { roughness: 0.1, metalness: 0.3, emissive: '#ff6a10', emissiveIntensity: 0 }); clickable(box(365.8, 243.5, 365.9, 257.5, 0.93, 1.33, this.ovenWin, false), 'sensor.four_etat');
    { const cv = document.createElement('canvas'); cv.width = 160; cv.height = 32; this.ovenCv = cv; this.ovenTex = new THREE.CanvasTexture(cv); this.ovenTex.colorSpace = THREE.SRGBColorSpace;
      const d = new THREE.Mesh(new THREE.PlaneGeometry(9 * S, 0.036), new THREE.MeshBasicMaterial({ map: this.ovenTex, toneMapped: false })); const [a, b] = P(365.63, 250.5); d.position.set(a, 1.49, b); d.rotation.y = Math.PI / 2; scene.add(d); clickable(d, 'sensor.four_etat'); }
    box(335, 262, 365, 366, 0, 0.86, MAT.greige); box(334.5, 262, 366, 366, 0.86, 0.9, MAT.worktop); box(340, 290, 360, 322, 0.86, 0.905, sinkM, false);
    box(335, 314, 337, 318, 0.9, 1.25, MAT.steel, false);
    box(334.6, 262, 335.4, 336, 0.9, 1.43, tiles, false); box(334.6, 336, 335.4, 366, 0.9, 1.45, tiles, false);
    box(335, 266, 352, 330, 1.45, 2.2, MAT.greige);
    clickable(box(335, 266, 352, 330, 1.43, 1.45, L('light.cuisine_evier', '#ffd9a0', [347, 298, 1.25], 2.4, 2.6), false), 'light.cuisine_evier');
    // halos lumineux (éclairage sous meuble de l'évier + étagères café) : dégradés additifs pilotés par l'état réel des lampes
    const gtex = (radial) => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = radial ? g.createRadialGradient(64, 64, 4, 64, 64, 64) : g.createLinearGradient(0, 0, 0, 128);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(radial ? 0.45 : 0.35, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); };
    const glow = (ent, w, h, pos, rot, radial, k) => { const m = new THREE.MeshBasicMaterial({ map: gtex(radial), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
      const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.position.set(...pos); me.rotation.set(...rot); me.visible = false; scene.add(me); const rec = this.lights[ent]; (rec.glows = rec.glows || []).push({ m, mesh: me, k }); };
    { const [a, b] = P(335.5, 298), [c2, d2] = P(343.5, 298);
      glow('light.cuisine_evier', 62 * S, 0.53, [a, 1.165, b], [0, Math.PI / 2, 0], false, 0.85);
      glow('light.cuisine_evier', 64 * S, 17 * S, [c2, 0.905, d2], [-Math.PI / 2, 0, Math.PI / 2], true, 0.55);
      const [e2, f2] = P(350, 298); glow('light.cuisine_evier', 62 * S, 0.25, [e2, 1.3, f2], [0, Math.PI / 2, 0], false, 0.25); }
    box(339, 340, 356, 358, 0.9, 1.3, MAT.black); box(341, 341, 354, 352, 1.3, 1.42, M('#d9dee0', { transparent: true, opacity: 0.6 }), false);
    box(365, 336, 425, 366, 0, 0.86, MAT.greige); box(365, 334, 425, 366, 0.86, 0.9, MAT.worktop);
    box(335, 365.2, 425, 365.8, 0.9, 1.5, tiles, false); box(335, 365.2, 425, 365.8, 1.5, 2.3, greyWall, false);
    // étagères ouvertes éclairées : mur ouest, coin sud, au-dessus de la machine à café (ouvertes vers l'est)
    for (const [y0, y1] of [[331, 348], [349, 366]]) { box(335, y0, 352, y1, 1.45, 1.47, MAT.white); box(335, y0, 352, y1, 2.18, 2.2, MAT.white); box(335, y0, 352, y0 + 1, 1.45, 2.2, MAT.white); box(335, y1 - 1, 352, y1, 1.45, 2.2, MAT.white);
      box(336, y0 + 1, 351, y1 - 1, 1.82, 1.83, M('#cfe6ea', { transparent: true, opacity: 0.45 }), false);
      clickable(box(335.2, y0 + 1, 336.4, y1 - 1, 1.47, 2.18, L('light.cuisine_etagere_cafe', '#ffd9a0', y0 === 331 ? [345, 348, 1.95] : null, 1.0, 1.8), false), 'light.cuisine_etagere_cafe');
      cyl(343, (y0 + y1) / 2, 3, 2.16, 2.18, L('light.cuisine_etagere_cafe', '#fff1d6', null, 1, 1));
      { const [a, b] = P(336.5, (y0 + y1) / 2), [c2, d2] = P(343.5, (y0 + y1) / 2);
        glow('light.cuisine_etagere_cafe', (y1 - y0 - 2) * S, 0.68, [a, 1.81, b], [0, Math.PI / 2, 0], false, 0.4);
        glow('light.cuisine_etagere_cafe', 15 * S, (y1 - y0 - 2) * S, [c2, 1.836, d2], [-Math.PI / 2, 0, 0], true, 0.35);
        glow('light.cuisine_etagere_cafe', 15 * S, (y1 - y0 - 2) * S, [c2, 1.476, d2], [-Math.PI / 2, 0, 0], true, 0.35);
        glow('light.cuisine_etagere_cafe', (y1 - y0 - 2) * S, 0.5, [P(351.8, 0)[0], 1.2, b], [0, Math.PI / 2, 0], false, 0.2); } }
    // taque + hotte cheminée (mur sud)
    box(381, 342, 409, 362, 0.9, 0.905, MAT.black, false);
    { const [a, b] = P(395, 354); const g = new THREE.BoxGeometry(34 * S, 0.3, 24 * S); { const pa = g.attributes.position; for (let k = 0; k < pa.count; k++) if (pa.getY(k) > 0) { pa.setX(k, pa.getX(k) * 12 / 34); pa.setZ(k, pa.getZ(k) > 0 ? 12 * S : 4 * S); } g.computeVertexNormals(); } const hood = new THREE.Mesh(g, MAT.white); hood.position.set(a, 1.72, b); hood.castShadow = true; scene.add(hood);
      const rim = new THREE.Mesh(new THREE.BoxGeometry(34.6 * S, 0.03, 24 * S), MAT.steel); rim.position.set(a, 1.57, b); scene.add(rim); }
    box(389, 358, 401, 366, 1.86, 2.3, MAT.white);
    box(411, 342, 424, 362, 0.9, 1.22, MAT.black);
    box(425, 292, 447, 366, 0, 0.9, MAT.greige); box(423, 290, 452, 366, 0.9, 0.94, MAT.worktop); box(440, 294, 457, 362, 1.06, 1.09, MAT.worktop); box(447, 296, 452, 360, 0.94, 1.06, M('#d8d5cf'));
    for (const y of [312, 344]) { cyl(468, y, 2, 0, 0.72, MAT.black, 10); cyl(468, y, 8, 0.72, 0.78, M('#2b2b2e'), 20); box(472, y - 7, 474, y + 7, 0.78, 1.15, M('#2b2b2e')); }
    box(371, 280, 375, 350, 2.25, 2.29, MAT.black, false);
    [287, 306, 326, 344].forEach((y, i) => { const e = 'light.cuisine_s_cuisine_' + [4, 2, 3, 1][i]; cyl(373, y, 1, 2.16, 2.25, MAT.black, 8); clickable(cyl(373, y, 3, 2.05, 2.17, MAT.black), e); clickable(cyl(373, y, 2.4, 2.035, 2.05, L(e, '#fff4e0', [373, y, 1.95], 1.1, 3)), e); });
    /* ---- salon ---- */
    box(441, 15, 465, 33, 0.56, 0.6, M('#a88b62', { roughness: 0.8 })); for (const [x, y] of [[441.5, 15.5], [463.5, 15.5], [441.5, 31.5], [463.5, 31.5]]) box(x, y, x + 1, y + 1, 0, 0.56, MAT.black); box(444, 17, 462, 31, 0.6, 0.86, MAT.white); box(445, 31, 461, 31.4, 0.66, 0.74, M('#2a2a2c'), false); box(442, 14.6, 462, 24, 1.0, 1.06, MAT.oakLight); box(444, 14.6, 462, 16, 1.25, 1.55, MAT.black, false); box(450.8, 14.6, 455.2, 15.5, 1.64, 1.73, MAT.white, false); box(451.4, 15.5, 454.6, 15.6, 1.665, 1.715, M('#c9d2c8', { roughness: 0.4 }), false);
    { const cv = document.createElement('canvas'); cv.width = 320; cv.height = 180; this.nvrCv = cv; this.nvrTex = new THREE.CanvasTexture(cv); this.nvrTex.colorSpace = THREE.SRGBColorSpace;
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(17 * S, 0.27), new THREE.MeshBasicMaterial({ map: this.nvrTex, toneMapped: false })); const [a, b] = P(453, 16.1); scr.position.set(a, 1.4, b); scene.add(scr); clickable(scr, 'camera.rue_fluide'); };
    // mur TV (d'après photos) : lattes chêne sol-plafond, panneau blanc 2,4 x 1,2 m posé devant la moitié droite des lattes (LED derrière), TV + Ambilight, KEF colonnes + centrale
    { const back = M('#2a2522', { roughness: 0.9 }), slat = M('#cdb08a', { roughness: 0.75 }), kefW = M('#eeeeec', { roughness: 0.5 }), kefG = M('#9a9c9e', { roughness: 0.9 });
      box(476, 14.5, 506, 15.5, 0, WH, back, false); for (let x = 476.3; x < 505.6; x += 1.95) box(x, 15.5, x + 1.35, 16.7, 0, WH, slat, false);
      clickable(box(493.5, 16.8, 608.5, 19.2, 0.74, 1.9, L('light.salon_panneau_mural', '#ffd27a', [551, 34, 1.35], 2.4, 3.6), false), 'light.salon_panneau_mural');
      clickable(box(491, 19.2, 611, 20.4, 0.72, 1.92, MAT.white), 'light.salon_panneau_mural');
      clickable(box(521, 20.4, 581, 21.2, 1.03, 1.72, L('light.salon_ambilight_tv', '#7f6bff', [551, 27, 1.38], 1.6, 2.6), false), 'light.salon_ambilight_tv');
      { // halo Ambilight projeté sur le panneau blanc et les lattes autour du téléviseur (suit la couleur/luminosité réelle)
        const tex = (rr) => { const c = document.createElement('canvas'); c.width = 256; c.height = 160; const g = c.getContext('2d'); g.filter = 'blur(' + rr + 'px)'; g.fillStyle = '#fff'; g.fillRect(64, 44, 128, 72); return new THREE.CanvasTexture(c); };
        const rec = this.lights['light.salon_ambilight_tv'], [a, b] = P(551, 20.5), [a2, b2] = P(551, 19.15);
        for (const [w, h, rr, k, y] of [[2.5, 1.62, 18, 1.0, b], [3.4, 2.2, 34, 0.45, b2]]) { const m = new THREE.MeshBasicMaterial({ map: tex(rr), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
          const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.position.set(a, 1.375, y); me.visible = false; me.renderOrder = 2; scene.add(me); if (rec) (rec.glows = rec.glows || []).push({ m, mesh: me, k }); } }
      this.tvMat = M('#101012', { roughness: 0.25, emissive: '#2a3b6a', emissiveIntensity: 0 }); box(518, 21.2, 584, 22.2, 1.0, 1.75, this.tvMat, false);
      for (const x of [503.5, 593.5]) { box(x, 20.4, x + 5, 21.4, 1.15, 1.62, kefW); box(x + 0.4, 21.4, x + 4.6, 21.5, 1.18, 1.59, kefG, false); }
      box(541, 20.4, 561, 21.4, 0.83, 0.93, kefW); box(541.4, 21.4, 560.6, 21.5, 0.845, 0.915, kefG, false); }
    { const cv = document.createElement('canvas'); cv.width = 320; cv.height = 180; this.tvCv = cv; this.tvTex = new THREE.CanvasTexture(cv); this.tvTex.colorSpace = THREE.SRGBColorSpace;
      this.tvScr = new THREE.Mesh(new THREE.PlaneGeometry(64 * S, 0.71), new THREE.MeshBasicMaterial({ map: this.tvTex, toneMapped: false })); const [a, b] = P(551, 22.3);
      this.tvScr.position.set(a, 1.375, b); this.tvScr.visible = false; scene.add(this.tvScr); clickable(this.tvScr, 'media_player.televiseur_du_salon'); }
    // meuble TV blanc suspendu à portes (socle chêne en retrait), caisson chêne ouvert (décodeur + ampli Yamaha), bibliothèque chêne posée sur le meuble
    { const groove = M('#dcdcd8'); box(478, 15, 670, 28, 0, 0.16, MAT.oakLight); box(472, 14.5, 676, 34, 0.16, 0.56, MAT.white); box(480, 16, 668, 30, 0.145, 0.16, decor('#ffcf88', 0.9), false);
      for (let x = 502; x < 676; x += 30) box(x - 0.3, 34, x + 0.3, 34.3, 0.18, 0.54, groove, false);
      box(551, 16, 553, 33, 0.56, 0.9, MAT.oakLight); box(588, 16, 590, 33, 0.56, 0.88, MAT.oakLight); box(551, 16, 636, 33, 0.88, 0.9, MAT.oakLight); box(553, 16, 588, 33, 0.71, 0.725, MAT.oakLight); box(553, 15, 636, 16, 0.56, 0.88, MAT.oakLight);
      box(557, 18, 584, 30, 0.56, 0.6, MAT.black); box(560, 19, 575, 28, 0.725, 0.76, MAT.black); box(592, 18, 634, 31, 0.56, 0.72, M('#1a1a1c', { roughness: 0.4 })); box(617, 31, 625, 31.3, 0.66, 0.69, decor('#5ab4ff', 1.5), false);
      box(636, 14.5, 638, 33, 0.56, 2.28, MAT.oakLight); box(674, 14.5, 676, 33, 0.56, 2.28, MAT.oakLight); box(638, 14.5, 674, 15.5, 0.56, 2.28, MAT.oakLight); box(636, 14.5, 676, 33, 2.26, 2.28, MAT.oakLight); box(638, 15.5, 674, 33, 0.56, 0.6, MAT.oakLight);
      for (const z of [0.95, 1.28, 1.6, 1.93]) box(638, 15.5, 674, 32.5, z, z + 0.025, MAT.oakLight, false);
      box(634.4, 15, 636, 17, 0.6, 2.2, decor('#ffcf88', 1.2), false); }
    box(510, 52, 640, 140, 0, 0.01, MAT.rug2, false); { const gl = M('#fafaf8', { roughness: 0.12, metalness: 0.05 }), oakT = M('#caa372', { roughness: 0.6 }), gr = M('#d6d6d2');
      box(549, 80.5, 609, 105.5, 0, 0.03, M('#bdbdb9')); box(546, 78, 612, 108, 0.03, 0.4, gl); box(546, 108, 612, 108.3, 0.2, 0.21, gr, false); box(578.8, 108, 579.2, 108.3, 0.04, 0.2, gr, false);
      box(580, 77.5, 614, 105, 0.4, 0.46, oakT); box(612, 77.5, 614, 105, 0.27, 0.4, oakT); }
    box(500, 140, 676, 182, 0, 0.42, MAT.sofa); box(500, 172, 676, 182, 0.42, 0.88, MAT.sofa2); box(634, 55, 676, 140, 0, 0.42, MAT.sofa); box(634, 55, 676, 62, 0.42, 0.62, MAT.sofa2); box(668, 62, 676, 172, 0.42, 0.88, MAT.sofa2);
    box(500, 140, 507, 182, 0.42, 0.6, MAT.sofa2); for (const x of [515, 555, 595]) box(x, 160, x + 26, 172, 0.42, 0.75, MAT.sofa2);
    { const [a, b] = P(575, 95); const hat = new THREE.Mesh(new THREE.ConeGeometry(30 * S, 0.1, 48, 1, true), M('#c8a55e', { transparent: true, opacity: 0.3, side: THREE.DoubleSide, roughness: 1 })); hat.position.set(a, 2.05, b); scene.add(hat); clickable(hat, 'light.salon_l_salon'); }
    clickable(sphere(575, 95, 4, 1.98, L('light.salon_l_salon', '#ffcf8a', [575, 95, 1.9], 2.6, 5)), 'light.salon_l_salon');
    // radiateurs (cliquables → thermostat)
    this.rads = [];
    [[673, 37, 677, 78, 0.15, 0.75, 'climate.living'], [440, 206, 444, 240, 0.15, 0.75, 'climate.living'], [645, 362, 670, 366, 0.15, 0.75, 'climate.living'],
     [70, 362, 130, 366, 0.15, 0.7, 'climate.chambre_adulte'], [263, 214.6, 279, 218.6, 0.12, 0.72, 'climate.chambre_enfants'], [131, 140, 134, 172, 0.4, 1.6, 'climate.salle_de_bain'], [239.6, 81, 243.6, 101, 0.12, 0.84, 'climate.couloir']]
      .forEach(([a0, b0, a1, b1, z0, z1, e]) => { const m = M('#f4f3ef', { roughness: 0.5, emissive: '#ff5a1f', emissiveIntensity: 0 }); clickable(box(a0, b0, a1, b1, z0, z1, m), e); this.rads.push({ m, e }); });
    // tablette murale (écran simulé selon son état)
    box(439.5, 215, 441, 233, 1.28, 1.52, MAT.black, false);
    { const cv = document.createElement('canvas'); cv.width = 256; cv.height = 160; this.tabCv = cv; this.tabTex = new THREE.CanvasTexture(cv); this.tabTex.colorSpace = THREE.SRGBColorSpace;
      this.tabMat = new THREE.MeshBasicMaterial({ map: this.tabTex, toneMapped: false }); const [a, b] = P(441.1, 224);
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(16 * S, 0.2), this.tabMat); scr.position.set(a, 1.4, b); scr.rotation.y = Math.PI / 2; scene.add(scr); clickable(scr, 'switch.salon_sam_tablette_ecran'); }
    { const [a, b] = P(676.5, 102); const c = new THREE.Mesh(new THREE.CircleGeometry(13 * S, 40), M('#efe9df')); c.position.set(a, 1.75, b); c.rotation.y = -Math.PI / 2; scene.add(c); }
    // meubles à vinyles blancs (3 colonnes x 2) sous la fenêtre de la baie + clavier rouge, stores blancs
    { const wh = M('#f4f4f2', { roughness: 0.4 }), sleeve = M('#2a2a2e', { roughness: 0.5 }), whiteB = M('#efeeea', { roughness: 0.9 });
      along(wB1, 0.15, 0.71, 4.6, 17, 0, 0.82, wh);
      for (let k = 0; k < 3; k++) { const t0 = 0.15 + k * 0.1867, t1 = t0 + 0.1867; for (const z of [0.04, 0.43]) { along(wB1, t0 + 0.012, t1 - 0.012, 21.4, 0.4, z + 0.12, z + 0.36, sleeve, false); along(wB1, t0 + 0.012, t1 - 0.012, 21.6, 0.5, z, z + 0.12, wh, false); } along(wB1, t1 - 0.003, t1 + 0.003, 21.6, 0.4, 0, 0.82, M('#dcdcd8'), false); }
      along(wB1, 0.3, 0.58, 7, 13, 0.82, 0.86, M('#c62f2f', { roughness: 0.4 })); along(wB1, 0.34, 0.57, 15, 5, 0.86, 0.865, M('#f2f2f2'), false); along(wB1, 0.31, 0.4, 8, 6, 0.86, 0.866, M('#ff9a2f'), false);
      for (let t = 0.155; t < 0.85; t += 0.022) along(wB1, t, t + 0.017, 5, 0.6, 0.92, 2.12, whiteB, false); along(wB1, 0.15, 0.85, 4.8, 1.2, 2.12, 2.16, whiteB, false); }
    // coin DJ (d'après photos) : buffet blanc cérusé à lambris + plateau chêne gris, caisson DJ blanc laqué, Adam A7V aux extrémités, KEF muraux, Hue Play rouges, cadres
    { const wS = (() => { const dt = 0.13 * wB2.len, ux = (wB2.c - wB2.a) / wB2.len, uz = (wB2.d - wB2.b) / wB2.len; return { a: wB2.a + ux * dt, b: wB2.b + uz * dt, c: wB2.c + ux * dt, d: wB2.d + uz * dt, len: wB2.len, ang: wB2.ang }; })();
      const cream = M('#e6e0d4', { roughness: 0.75 }), cream2 = M('#d9d2c4', { roughness: 0.8 }), groove = M('#c9c1b2'), woodTop = M('#8f877b', { roughness: 0.7 }), handle = M('#2a2a2a', { roughness: 0.4, metalness: 0.4 }), gloss = M('#f7f7f5', { roughness: 0.15, metalness: 0.05 });
      along(wS, 0.022, 0.668, 5, 23, 0, 0.06, cream2); along(wS, 0.022, 0.668, 4.5, 24, 0.06, 0.85, cream); along(wS, 0.018, 0.672, 4.5, 26, 0.85, 0.89, woodTop);
      const fr = (t0, t1, z0, z1) => { along(wS, t0, t0 + 0.0025, 28.5, 0.4, z0, z1, groove, false); along(wS, t1 - 0.0025, t1, 28.5, 0.4, z0, z1, groove, false); along(wS, t0, t1, 28.5, 0.4, z0, z0 + 0.012, groove, false); along(wS, t0, t1, 28.5, 0.4, z1 - 0.012, z1, groove, false); };
      const door = (t0, t1, z0, z1, hx) => { fr(t0, t1, z0, z1); for (let t = t0 + 0.012; t < t1 - 0.006; t += 0.012) along(wS, t, t + 0.0012, 28.5, 0.3, z0 + 0.04, z1 - 0.04, groove, false); along(wS, hx - 0.003, hx + 0.003, 28.6, 1, z1 - 0.12, z1 - 0.07, handle, false); };
      door(0.026, 0.15, 0.1, 0.82, 0.142); door(0.54, 0.664, 0.1, 0.82, 0.548);
      for (let k = 0; k < 3; k++) { const t0 = 0.15 + k * 0.13; fr(t0, t0 + 0.13, 0.64, 0.82); along(wS, t0 + 0.055, t0 + 0.075, 28.6, 1.2, 0.71, 0.75, handle, false); }
      along(wS, 0.15, 0.54, 28.5, 0.5, 0.615, 0.64, woodTop, false);
      for (let k = 0; k < 4; k++) { const t0 = 0.15 + k * 0.0975; door(t0, t0 + 0.0975, 0.1, 0.61, k % 2 ? t0 + 0.008 : t0 + 0.0895); }
      // caisson DJ blanc laqué : 5 compartiments
      along(wS, 0.075, 0.615, 6, 22, 0.89, 0.99, gloss); along(wS, 0.075, 0.615, 6, 1.2, 0.99, 1.065, gloss); along(wS, 0.075, 0.615, 26.8, 1.2, 0.99, 1.065, gloss);
      for (const t of [0.075, 0.1948, 0.2905, 0.3958, 0.4915, 0.6112]) along(wS, t, t + 0.0039, 6, 22, 0.99, 1.065, gloss);
      const ux = (wS.c - wS.a) / wS.len, uz = (wS.d - wS.b) / wS.len;
      const at = (t, off, z) => { const g = new THREE.Group(); g.position.set(wS.a + ux * t * wS.len - uz * off * S, z, wS.b + uz * t * wS.len + ux * off * S); g.rotation.y = wS.ang; scene.add(g); return g; };
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
      const hue = (t, ent, pos) => clickable(along(wS, t - 0.03, t + 0.03, 7, 2.5, 1.065, 1.11, L(ent, '#ff2a3a', pos, 1.8, 2.4), false), ent);
      adam(0.05); adam(0.64); kef(0.055); kef(0.635);
      deck(0.1368, '#e6c22e'); player(0.2446); mixer(0.3451); player(0.4456); deck(0.5533, '#c8323a');
      hue(0.2446, 'light.coin_dj_sono_gauche', [751.5, 225.7, 1.15]); hue(0.4456, 'light.coin_dj_sono_droite', [746.5, 266.7, 1.15]);
      for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) { const t0 = 0.315 + k * 0.022; along(wS, t0, t0 + 0.019, 4.6, 0.8, 1.45 + r * 0.27, 1.69 + r * 0.27, MAT.white, false); along(wS, t0 + 0.003, t0 + 0.016, 5.4, 0.2, 1.48 + r * 0.27, 1.66 + r * 0.27, M(['#dfe6df', '#e9ece6', '#d4ddd6'][k]), false); } }
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
    { const top = M('#c9b591', { roughness: 0.6 }); box(546, 250, 650, 290, 0.71, 0.77, top);
      for (const x of [562, 634]) for (const sg of [1, -1]) { const [a, b] = P(x, 270); const leg = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.98, 0.05), MAT.black); leg.position.set(a, 0.355, b); leg.rotation.x = sg * 0.72; leg.castShadow = true; scene.add(leg); }
      box(562, 268.8, 634, 271.2, 0.06, 0.1, MAT.black); }
    { const velvet = M('#d8cdbb', { roughness: 1 }), [tcx, tcz] = P(598, 270);
      const chair = (x, y) => { const [a, b] = P(x, y); const g = new THREE.Group(); g.position.set(a, 0, b); g.rotation.y = Math.atan2(-(tcx - a), -(tcz - b)); scene.add(g);
        const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.09, 28), velvet); seat.position.y = 0.48; seat.scale.z = 0.92; seat.castShadow = true; g.add(seat);
        const back = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.23, 0.36, 28, 1, true, -Math.PI * 0.62, Math.PI * 1.24), velvet); back.material.side = THREE.DoubleSide; back.position.set(0, 0.7, 0.01); back.castShadow = true; g.add(back);
        for (const [lx, lz] of [[-0.17, -0.15], [0.17, -0.15], [-0.15, 0.16], [0.15, 0.16]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.009, 0.44, 8), MAT.black); l.position.set(lx, 0.22, lz); l.rotation.x = lz > 0 ? -0.12 : 0.12; g.add(l); } };
      for (const x of [575, 621]) { chair(x, 236); chair(x, 304); } chair(530, 270); chair(666, 270); }

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
      let st = H[ent]; if ((!st || st.state === 'unavailable') && rec.grp) st = H[rec.grp] || st; const on = st && st.state === 'on';
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
    this._sky(H);
    if (this.fireBMat) { const f = ['fumee', 'chaleur', 'monoxyde_de_carbone'].some((k) => H['binary_sensor.buanderie_local_tech_detecteur_incendie_' + k] && H['binary_sensor.buanderie_local_tech_detecteur_incendie_' + k].state === 'on'); this.fireBMat.emissiveIntensity = f ? 0.9 : 0; }
    if (this.boilerLed) { const on = H['binary_sensor.boiler_burngas'] && H['binary_sensor.boiler_burngas'].state === 'on'; this.boilerLed.emissive.set(on ? '#ff7a1a' : '#2f6bff'); }
    if (this.fireMat) { const f = ['fumee', 'chaleur', 'vapeur'].some((k) => H['binary_sensor.hall_dentree_incendie_couloir_' + k] && H['binary_sensor.hall_dentree_incendie_couloir_' + k].state === 'on'); this.fireMat.emissiveIntensity = f ? 0.9 : 0; }
    this._ovenSync(H);
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
  /* ciel de fond selon la hauteur réelle du soleil (aube, jour, coucher, heure bleue, nuit étoilée) */
  _sky(H) {
    const sa = H['sun.sun'] && H['sun.sun'].attributes; let el = sa && sa.elevation !== undefined ? sa.elevation : (this.nightTarget ? -12 : 30); const rising = sa ? sa.rising : true;
    if (this.mode === 'nuit') el = -12; if (this.mode === 'jour') el = 35;
    let g, st;
    if (el <= -8) { g = ['#060a1c', '#101833', '#1b2647']; st = 1; }
    else if (el <= -2) { g = rising ? ['#141c3f', '#4a4a86', '#d98a8a'] : ['#101736', '#3b3a72', '#c46a5e']; st = 0.45; }
    else if (el <= 8) { g = rising ? ['#5b86c4', '#f2b39a', '#fbd9b5'] : ['#4e6fae', '#ef9a6a', '#f8c48e']; st = 0; }
    else if (el <= 20) { g = ['#6c9fd8', '#b9d4ee', '#f6ead8']; st = 0; }
    else { g = ['#6fa8e0', '#a9cdef', '#eef5fb']; st = 0; }
    const k = g.join(); if (k !== this._skyKey) { this._skyKey = k; this.$('.wrap').style.background = `linear-gradient(180deg,${g[0]} 0%,${g[1]} 55%,${g[2]} 100%)`; this.$('.stars').style.opacity = st; }
  }
  /* ---------------- four Siemens (Home Connect) ---------------- */
  _openOven(x, y) {
    const pn = this.$('.ovp'), wrap = this.$('.wrap'); this._ovOpen = true; this._ovenSync(this._h.states, true);
    const w = wrap.clientWidth, h = wrap.clientHeight; pn.style.left = Math.max(8, Math.min(w - 358, x + 18)) + 'px'; pn.style.top = Math.max(60, Math.min(h - pn.offsetHeight - 8, y - 120)) + 'px';
    pn.classList.remove('show'); void pn.offsetWidth; pn.classList.add('show');
  }
  _closeOven() { this._ovOpen = false; const pn = this.$ && this.$('.ovp'); if (pn) pn.classList.remove('show'); }
  _ovenSetup() {
    if (this._ovReady) return; this._ovReady = true; const $ = this.$, H = () => this._h.states, call = (d, sv, data) => this._h.callService(d, sv, data);
    const PR = [['steam_modes_steam', '♨️', 'Vapeur'], ['heating_mode_hot_air', '🌀', 'Chaleur tournante'], ['heating_mode_top_bottom_heating', '☰', 'Voûte / sole'], ['heating_mode_top_bottom_heating_eco', '🍃', 'Voûte/sole éco'],
      ['heating_mode_hot_air_grilling', '🔥', 'Gril air pulsé'], ['heating_mode_pizza_setting', '🍕', 'Pizza'], ['heating_mode_frozen_heatup_special', '❄️', 'Surgelés'], ['heating_mode_slow_cook', '🍲', 'Cuisson lente'],
      ['heating_mode_bottom_heating', '▁', 'Sole'], ['heating_mode_keep_warm', '🌡️', 'Maintien au chaud'], ['heating_mode_preheat_ovenware', '🥣', 'Chauffe-plats'], ['heating_mode_pre_heating', '⏫', 'Préchauffage']];
    this._ovPR = PR; const g = $('.opg');
    PR.forEach(([k, ic, n]) => { const b = document.createElement('button'); b.dataset.k = 'cooking_oven_program_' + k; b.innerHTML = `<i>${ic}</i>${n}`; b.onclick = () => call('select', 'select_option', { entity_id: 'select.four_programme_selectionne', option: b.dataset.k }); g.appendChild(b); });
    $('.ovp').querySelectorAll('[data-r]').forEach((b) => (b.onclick = () => call('script', 'four_regler', b.dataset.v ? { cible: b.dataset.r, valeur: +b.dataset.v } : { cible: b.dataset.r, delta: +b.dataset.d })));
    $('.oclose').onclick = () => this._closeOven();
    $('.opw').onclick = () => call('switch', 'toggle', { entity_id: 'switch.four_alimentation' });
    const arm = (el, fn) => { if (el.classList.contains('arm')) { el.classList.remove('arm'); clearTimeout(el._t); fn(); return; } this.$('.ovp').querySelectorAll('.arm').forEach((x) => x.classList.remove('arm')); el.classList.add('arm'); el._t = setTimeout(() => el.classList.remove('arm'), 3500); };
    this._ovArm = arm;
    $('.ogo').onclick = (e) => { const pg = H()['select.four_programme_selectionne']; const opt = pg && pg.state; if (!opt || !opt.startsWith('cooking_')) return this._toast('Choisissez d’abord un programme');
      arm(e.currentTarget, () => { call('select', 'select_option', { entity_id: 'select.four_programme_actif', option: opt }); this._toast('🔥 Four démarré'); }); };
    $('.opause').onclick = () => call('button', 'press', { entity_id: 'button.four_mettre_en_pause_le_programme' });
    $('.ostop').onclick = (e) => arm(e.currentTarget, () => { call('button', 'press', { entity_id: 'button.four_arreter_le_programme' }); this._toast('⏹ Programme arrêté'); });
    $('.omore').onclick = () => { history.pushState(null, '', '/ma-maison/piece-de-vie'); window.dispatchEvent(new CustomEvent('location-changed')); };
  }
  _ovenSync(H, force) {
    const st = H['sensor.four_etat'], es = st ? st.state : 'unavailable', num = (e) => { const v = parseFloat(H[e] && H[e].state); return isNaN(v) ? null : v; };
    const cav = num('sensor.four_temperature_actuelle_de_la_cavite_du_four'), pw = H['switch.four_alimentation'], on = pw && pw.state === 'on';
    const hot = ['run', 'delayedstart', 'pause', 'actionrequired'].includes(es), light = H['binary_sensor.four_eclairage_interieur_actif'] && H['binary_sensor.four_eclairage_interieur_actif'].state === 'on';
    if (this.ovenWin) { this.ovenWin.emissive.set(hot ? '#ff6a10' : '#ffd9a0'); this.ovenWin.emissiveIntensity = es === 'run' ? 0.55 : hot ? 0.3 : light ? 0.3 : 0; }
    const pick = (n, k) => { const a = H[n], b = H[k]; const ok = a && !isNaN(parseFloat(a.state)); return (!ok || (b && new Date(b.last_changed) > new Date(a.last_changed))) ? (b ? +b.state : null) : +a.state; };
    const tset = pick('number.cuisine_four_temperature_de_consigne', 'input_number.four_temp_voulue'), dur = pick('number.cuisine_four_duree', 'input_number.four_duree_voulue');
    const prog = num('sensor.four_progression_du_programme'), fin = H['sensor.four_heure_de_fin_de_programme'], finD = fin && !['unknown', 'unavailable'].includes(fin.state) ? new Date(fin.state) : null;
    const fmtD = (v) => { if (v == null) return '—'; const m = Math.round(v / 60), hh = Math.floor(m / 60), mm = m % 60; return hh ? `${hh} h ${String(mm).padStart(2, '0')}` : `${mm} min`; };
    // afficheur du four
    if (this.ovenCv) { const rem = finD ? Math.max(0, Math.round((finD - Date.now()) / 60000)) : null;
      const txt = hot ? `${cav != null ? Math.round(cav) + '°' : ''}${rem != null ? '  ' + (rem >= 60 ? Math.floor(rem / 60) + 'h' + String(rem % 60).padStart(2, '0') : rem + '′') : ''}` : on ? `${cav != null ? Math.round(cav) + '°' : 'ON'}` : '';
      if (txt !== this._ovTxt) { this._ovTxt = txt; const c = this.ovenCv.getContext('2d'); c.fillStyle = '#050506'; c.fillRect(0, 0, 160, 32); if (txt) { c.fillStyle = hot ? '#ff9d2e' : '#f3eee6'; c.font = 'bold 24px system-ui,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 80, 17); } this.ovenTex.needsUpdate = true; this._dirty = true; } }
    if (!this.$ || !this._ovOpen && !force) return; this._ovenSetup(); const $ = this.$, pn = $('.ovp');
    const ET = { inactive: 'En veille', ready: 'Prêt', delayedstart: 'Départ différé', run: 'En cuisson', pause: 'En pause', actionrequired: 'Action requise', finished: 'Terminé', error: 'Erreur', aborting: 'Arrêt…', unavailable: 'Hors ligne' };
    const door = H['sensor.four_porte'] && H['sensor.four_porte'].state;
    const pa = H['select.four_programme_actif'], act = pa && pa.state && pa.state.startsWith('cooking_') ? (this._ovPR.find((p) => 'cooking_oven_program_' + p[0] === pa.state) || [])[2] : null;
    $('.ost').textContent = [(ET[es] || es) + (hot && act ? ' · ' + act : ''), cav != null ? Math.round(cav) + ' °C dans le four' : null, door === 'open' ? '🚪 porte ouverte' : null, hot && finD ? 'fin ' + finD.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }) : null].filter(Boolean).join(' · ');
    pn.classList.toggle('hot', hot); $('.opw').classList.toggle('on', !!on);
    const pb = $('.oprog'); pb.classList.toggle('hide', !(hot && prog != null)); pb.firstElementChild.style.width = (prog || 0) + '%';
    const sel = H['select.four_programme_selectionne'] && H['select.four_programme_selectionne'].state; pn.querySelectorAll('.opg button').forEach((b) => b.classList.toggle('on', b.dataset.k === sel));
    $('.otv').innerHTML = tset != null ? `${Math.round(tset)}<small>°C</small>` : '—'; $('.odv').textContent = fmtD(dur);
    const favs = []; for (let i = 1; i <= 16; i++) { const f = H['input_text.four_favori_' + i]; if (f && f.state && !['unknown', 'unavailable', ''].includes(f.state)) favs.push(f.state); }
    const key = favs.join('#'); if (key !== this._ovFavKey) { this._ovFavKey = key; const fv = $('.ofv'); fv.innerHTML = '';
      const EM = { 'mdi:pizza': '🍕', 'mdi:fish': '🐟', 'mdi:baguette': '🥖', 'mdi:pasta': '🍝', 'mdi:sausage': '🌭', 'mdi:bread-slice': '🥪', 'mdi:food-croissant': '🥐', 'mdi:food-takeout-box': '🥡', 'mdi:food-variant': '🥔' };
      favs.forEach((s) => { const v = s.split('|'), b = document.createElement('button'); b.innerHTML = `<i>${EM[v[9]] || '🍽️'}</i>${v[0]}<small style="opacity:.6">${v[2]}° · ${v[3]} min</small>`; b.title = (v[8] || '').replace('~', '\n');
        b.onclick = (e) => this._ovArm(e.currentTarget, () => { this._h.callService('script', 'four_favori', { nom: v[0], program: v[1], temperature: Number(v[2]), duree: Number(v[3]), prechauffage: v[4] === '1', program2: v[5] || '', temperature2: Number(v[6] || 0), duree2: Number(v[7] || 0), retourner: /retourn/i.test(v[8] || '') }); this._toast('🍳 ' + v[0] + ' : four en préparation'); });
        fv.appendChild(b); }); }
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
    pn.querySelectorAll('.pseg button').forEach((b) => (b.onclick = () => { const m = b.dataset.m; if (!this.selGrp) return; if (m === 'one') { const s = this._h.states[this.selSpot]; if (!s || s.state === 'unavailable') return this._toast('Ce spot est indisponible pour le moment'); }
      this._gMode = m; this.sel = m === 'one' ? this.selSpot : this.selGrp; this._wheelHS = null; this._busy = false; this._renderPanel(true); }));
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
  _preview(o) { const s = this._h.states[this.sel], ids = [this.sel, ...((s && s.attributes.entity_id) || [])]; let any = false;
    ids.forEach((e) => { const rec = this.lights[e]; if (!rec) return; any = true; rec.ov = Object.assign(rec.ov && Date.now() < rec.ov.until ? rec.ov : {}, o, { until: Date.now() + 3000 }); if (o.col && (!rec.target || !rec.target.on) && o.bri === undefined) rec.ov.bri = 0.8; });
    if (any) this._sync(); }
  /* plus petit groupe de lampes HA contenant ce spot (ex. Spot Cuisine, Lustre salle à manger, Salle de bain) */
  _grpOf(ent) { const H = this._h.states; let best = null, n = 99;
    for (const [k, st] of Object.entries(H)) { const m = st.attributes.entity_id; if (!k.startsWith('light.') || !Array.isArray(m) || m.length < 2 || !m.includes(ent) || !m.every((e) => this.lights[e])) continue;
      if (m.length < n || (m.length === n && this.lights[k] && !this.lights[best])) { best = k; n = m.length; } } return best; }
  _send(data, now) { const ent = this.sel; this._pend = { entity_id: ent, ...data }; const go = () => { this._h.callService('light', 'turn_on', this._pend); this._lastSend = Date.now(); this._pend = null; };
    clearTimeout(this._st); const wait = 280 - (Date.now() - (this._lastSend || 0)); if (now || wait <= 0) go(); else this._st = setTimeout(go, wait); }
  _openPanel(ent, x, y, obj) {
    this.selSpot = ent; this.selGrp = this._grpOf(ent); { const s = this._h.states[ent]; if (this.selGrp && (this._gMode !== 'one' || !s || s.state === 'unavailable')) ent = this.selGrp; }
    const changed = this.sel !== ent; this.sel = ent; this._busy = false; if (changed) this._wheelHS = null;
    const p = new THREE.Vector3(); obj.getWorldPosition(p); this.selRing.position.set(p.x, 0.03, p.z); this.selRing.visible = true;
    this._renderPanel(true); const pn = this.$('.pn'), wrap = this.$('.wrap');
    const w = wrap.clientWidth, h = wrap.clientHeight; pn.style.left = Math.max(8, Math.min(w - 308, x + 18)) + 'px'; pn.style.top = Math.max(60, Math.min(h - pn.offsetHeight - 8, y - 80)) + 'px';
    pn.classList.remove('show'); void pn.offsetWidth; pn.classList.add('show'); this._closeOven(); this._dirty = true;
  }
  _closePanel() { this.sel = null; this.$('.pn').classList.remove('show'); this.selRing.visible = false; this._dirty = true; }
  _renderPanel(force) {
    if (!this.sel || !this.$) return; const st = this._h.states[this.sel]; if (!st) return; const A = st.attributes, on = st.state === 'on', $ = this.$;
    const modes = A.supported_color_modes || [], dim = modes.some((m) => m !== 'onoff'), rgbOk = modes.some((m) => RGBM.includes(m)), ctOk = modes.includes('color_temp');
    const rec = this.lights[this.sel] || (A.entity_id || []).map((e) => this.lights[e]).find((r) => r && r.target && r.target.on) || (A.entity_id || []).map((e) => this.lights[e]).find(Boolean), col = rec && rec.target ? rec.target.col : new THREE.Color('#ffd27a'), lit = rec && rec.target && rec.target.on, css = '#' + col.getHexString();
    const pn = $('.pn'); pn.style.setProperty('--c', lit ? css : '#3b3846');
    $('.pname').textContent = A.friendly_name || this.sel;
    { const sg = $('.pseg'); sg.classList.toggle('hide', !this.selGrp); if (this.selGrp && this._h.states[this.selGrp]) { const G = this._h.states[this.selGrp], sp = this._h.states[this.selSpot];
      sg.querySelector('.pgn').textContent = `${G.attributes.friendly_name} (${(G.attributes.entity_id || []).length})`; sg.children[0].textContent = '💡 ' + ((sp && sp.attributes.friendly_name) || 'Ce spot');
      sg.children[0].classList.toggle('on', this.sel !== this.selGrp); sg.children[1].classList.toggle('on', this.sel === this.selGrp); } } $('.pdot').textContent = lit ? '💡' : '⚫';
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
        rec.pls.forEach((pl) => { pl.color.copy(c.col); pl.intensity = c.bri * rec.base * n; }); (rec.glows || []).forEach((g) => { g.m.color.copy(c.col); g.m.opacity = Math.min(1, c.bri * g.k * (0.55 + 0.45 * n)); g.mesh.visible = c.bri > 0.01; });
        (rec.beams || []).forEach((m) => { m.uniforms.c.value.copy(c.col); m.uniforms.o.value = c.bri * 0.2 * (0.2 + 0.8 * this.night); });
      }
      if (this.tvOn && this.tvScr) { const t = performance.now(); if (!this._tvT || t - this._tvT > 80) { this._tvT = t; this._drawTV(t / 1000); } }
      // jour / nuit
      const dn = this.nightTarget - this.night; if (Math.abs(dn) > 0.002) { this.night += dn * 0.06; anim = true; }
      const n = this.night;
      this.hemi.intensity = 1.05 - 0.85 * n; this.hemi.color.set(n > 0.5 ? '#8a8fb8' : '#ffffff'); this.sun.intensity = 1.8 * (1 - n) + 0.15 * n;
      this.renderer.toneMappingExposure = 1.05 + 0.2 * n; if (this.plinth) { this.plinth.material.opacity = 0.85 - 0.6 * n; }
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
      this.labels.forEach((l) => { const [a, b] = this.P(l.x, l.y); v.set(a, l.h, b).project(this.cam); const vis = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1; l.d.style.opacity = vis ? 1 : 0; l.d.style.left = ((v.x + 1) / 2) * w + 'px'; l.d.style.top = ((1 - v.y) / 2) * h + 'px'; });
    };
    tick();
  }
}
if (!customElements.get('floorplan-3d-card')) customElements.define('floorplan-3d-card', Floorplan3DCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'floorplan-3d-card', name: 'Plan 3D de la maison', description: 'Plan 3D interactif : lumières, températures, portes en direct' });
