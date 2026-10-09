/* Éclairage — vue d'ensemble de la maison : plan vu de dessus (repris du plan 3D), pièces, scènes. */
const ROOMS = [
  { id: 'salon', n: 'Salon', ic: '🛋️', g: 'light.salon_salon', l: [['light.salon_l_salon', 'Lustre'], ['light.salon_panneau_mural', 'Panneau mural'], ['light.salon_ambilight_tv', 'Ambilight TV']] },
  { id: 'sam', n: 'Salle à manger', ic: '🍽️', g: 'light.salle_a_manger_salle_a_manger', l: [['light.salle_a_manger_lg', 'Lustre 1'], ['light.salle_a_manger_lc', 'Lustre 2'], ['light.salle_a_manger_ld', 'Lustre 3'], ['light.salle_a_manger_vit_d', 'Vitrine D'], ['light.salle_a_manger_vit_g', 'Vitrine G'], ['light.salle_a_manger_chevet', 'Chevet']] },
  { id: 'dj', n: 'Coin DJ', ic: '🎧', g: 'light.coin_dj_coin_dj', l: [['light.coin_dj_sono_gauche', 'Sono G'], ['light.coin_dj_sono_droite', 'Sono D'], ['light.coin_dj_sono_adams', 'Adams'], ['light.coin_dj_sono_mixeur', 'Mixeur'], ['light.coin_dj_sono_lecteurs', 'Lecteurs']] },
  { id: 'cuisine', n: 'Cuisine', ic: '🍳', g: 'light.cuisine_cuisine', l: [['light.cuisine_s_cuisine_1', 'Spot 1'], ['light.cuisine_s_cuisine_2', 'Spot 2'], ['light.cuisine_s_cuisine_3', 'Spot 3'], ['light.cuisine_s_cuisine_4', 'Spot 4'], ['light.cuisine_evier', 'Évier'], ['light.cuisine_etagere_cafe', 'Étagère café']] },
  { id: 'enfant', n: 'Chambre enfant', ic: '🧸', g: null, l: [['switch.plafonnier_chambre_enfants', 'Plafonnier'], ['light.chambre_matteo', 'Lampe']], ir: true },
  { id: 'sdb', n: 'Salle de bain', ic: '🛁', g: 'light.salle_de_bain_salle_de_bain', l: [['light.salle_de_bain_sdb_evier', 'Évier'], ['light.salle_de_bain_sdb_douche', 'Douche'], ['light.salle_de_bain_sdb_langer', 'Langer']] },
];
// plan (mêmes coordonnées que le plan 3D)
const WALLS = [[235, 10, 680, 10], [680, 10, 680, 130], [680, 130, 775, 130], [775, 130, 775, 335], [775, 335, 685, 335], [685, 335, 685, 370], [10, 370, 685, 370], [10, 105, 10, 370], [10, 105, 235, 105], [235, 10, 235, 105],
  [135, 105, 135, 210], [135, 155, 235, 155], [235, 105, 235, 155], [325, 107, 435, 107], [325, 107, 325, 210], [10, 210, 435, 210], [435, 10, 435, 255], [200, 210, 200, 370], [330, 210, 330, 370]];
const ZONES = [
  ['sdb', 'M10 105H135V210H10Z', 72, 190], ['enfant', 'M200 210H330V370H200Z', 265, 355], ['cuisine', 'M330 210H435V370H330Z', 382, 355],
  ['salon', 'M435 10H680V200H435Z', 520, 185], ['sam', 'M435 200H690V370H435Z', 520, 355], ['dj', 'M680 130H775V335H690V200H680Z', 728, 320],
  [null, 'M10 210H200V370H10Z', 105, 300, 'Chambre adulte'], [null, 'M325 107H435V210H325Z', 380, 162, 'Buanderie'], [null, 'M135 105H235V155H135Z', 185, 134, 'WC'], [null, 'M235 10H435V107H325V210H135V155H235Z', 335, 60, 'Hall']];
// points lumineux : [entité, x, y, forme]
const PTS = [['light.salon_l_salon', 575, 95], ['light.salon_panneau_mural', 551, 17, 'bar', 112], ['light.salon_ambilight_tv', 551, 27, 'bar', 60],
  ['light.salle_a_manger_lg', 568, 269.5], ['light.salle_a_manger_lc', 598, 269.5], ['light.salle_a_manger_ld', 628, 269.5],
  ['light.salle_a_manger_vit_d', 441, 124, 'vbar', 32], ['light.salle_a_manger_vit_g', 441, 181, 'vbar', 32],
  ['light.coin_dj_sono_gauche', 751, 226], ['light.coin_dj_sono_droite', 747, 267],
  ['light.cuisine_s_cuisine_4', 373, 287, 's'], ['light.cuisine_s_cuisine_2', 373, 306, 's'], ['light.cuisine_s_cuisine_3', 373, 326, 's'], ['light.cuisine_s_cuisine_1', 373, 344, 's'], ['light.cuisine_evier', 344, 300, 's'],
  ['light.salle_de_bain_sdb_evier', 75, 150, 's'], ['light.salle_de_bain_sdb_douche', 60, 168, 's'], ['light.salle_de_bain_sdb_langer', 90, 168, 's'],
  ['light.chambre_matteo', 262, 292], ['switch.plafonnier_chambre_enfants', 265, 255]];
const SCENES = [['🌙', 'Soirée', 'scene.soiree'], ['📖', 'Lecture', 'scene.lecture'], ['🎉', 'Fête DJ', 'scene.fete_coin_dj'], ['🌃', 'Nuit', 'scene.nuit'],
  ['❄️', 'Bleu polaire', 'scene.toute_lumieres_bleu_polaire_relax'], ['💜', 'Lavande', 'scene.toute_lumieres_detente_lavande'], ['🎨', 'Lavonier', 'scene.toute_lumieres_lavonier'], ['🍋', 'Lemon', 'scene.toute_lumieres_lemon_esquisse'],
  ['🛌', 'Repos R/B', 'scene.toute_lumieres_repos_rouge_et_blanc_chaud_2_3'], ['🔥', 'R/B chaud 1', 'scene.toute_lumieres_rouge_et_blanc_chaud_1_3'], ['🔥', 'R/B chaud 2', 'scene.toute_lumieres_rouge_et_blanc_chaud_2_3'], ['🔥', 'R/B chaud 3', 'scene.toute_lumieres_rouge_et_blanc_chaud_3_3']];
const IR = [['☀️', 'Chaud', 'Lumiere Blanc chaud'], ['❄️', 'Froid', 'Lumiere Blanc Froid'], ['＋', '', 'Lumiere Blanc +'], ['－', '', 'Lumiere Blanc -'], ['🌈', 'RGB', 'Lumiere RGB ON/OFF']];
const AMB = 'input_select.ambiance_piece_de_vie';

class EclairageCard extends HTMLElement {
  setConfig(c) { this.cfg = c || {}; }
  getCardSize() { return 12; }
  set hass(h) { this._h = h; if (!this._b) this._build(); if (!this._raf) this._raf = requestAnimationFrame(() => { this._raf = null; this._upd(); }); }
  _s(e) { return this._h.states[e]; }
  _on(e) { const s = this._s(e); return !!s && s.state === 'on'; }
  _call(d, s, data, t) { return this._h.callService(d, s, data || {}, t); }
  _col(e) { const s = this._s(e); if (!s || s.state !== 'on') return null; const a = s.attributes; const c = a.rgb_color || (e.startsWith('switch.') ? [255, 214, 150] : [255, 205, 140]); return [c, (a.brightness == null ? 255 : a.brightness) / 255]; }
  _more(e) { this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: e }, bubbles: true, composed: true })); }
  _press(el, tap, hold) { let t = null, held = false;
    el.addEventListener('pointerdown', () => { held = false; t = setTimeout(() => { held = true; hold(); }, 550); });
    const end = () => clearTimeout(t); el.addEventListener('pointerup', end); el.addEventListener('pointerleave', end);
    el.addEventListener('click', (ev) => { ev.preventDefault(); if (!held) tap(); }); el.addEventListener('contextmenu', (ev) => { ev.preventDefault(); }); }
  _tog(e) { const d = e.split('.')[0]; this._call(d, 'toggle', {}, { entity_id: e }); }
  _build() {
    this._b = true; const r = this.attachShadow({ mode: 'open' });
    r.innerHTML = `<style>
      :host{container-type:inline-size;display:block;--g:rgba(255,255,255,.06);--b:rgba(255,255,255,.09);--t:#f3eee6;--m:rgba(243,238,230,.6);--a:#ffd27a;--o1:#ff9a5a;--o2:#7b5cff;--o3:#1fb6c9;color:var(--t);font:500 14px system-ui,Roboto,sans-serif}
      *{box-sizing:border-box} button{appearance:none;font:700 12px system-ui,Roboto,sans-serif;color:var(--t);cursor:pointer;border:1px solid var(--b);background:rgba(255,255,255,.06);border-radius:14px;-webkit-tap-highlight-color:transparent;transition:background .2s,border-color .2s}
      button:active{transform:scale(.96)}
      .w{position:relative;isolation:isolate;overflow:hidden;display:grid;gap:12px;padding:10px;border-radius:22px;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;height:calc(100vh - var(--top,56px) - 1px);min-height:560px;
        background:radial-gradient(140% 90% at 50% 0%,#121426 0%,#07080f 70%)}
      .w>*{position:relative;z-index:1}
      .bgfx{position:absolute;inset:-20%;z-index:0!important;pointer-events:none;filter:blur(70px) saturate(130%);opacity:.55}
      .bgfx i{position:absolute;border-radius:50%;mix-blend-mode:screen;animation:drift 38s ease-in-out infinite alternate}
      .bgfx i:nth-child(1){width:55%;height:60%;left:2%;top:4%;background:radial-gradient(circle,var(--o1),transparent 65%)}
      .bgfx i:nth-child(2){width:52%;height:58%;right:4%;top:18%;background:radial-gradient(circle,var(--o2),transparent 65%);animation-duration:46s;animation-delay:-12s}
      .bgfx i:nth-child(3){width:44%;height:48%;left:30%;bottom:2%;background:radial-gradient(circle,var(--o3),transparent 65%);animation-duration:52s;animation-delay:-24s}
      @keyframes drift{from{transform:translate(0,0) scale(1)}to{transform:translate(6%,5%) scale(1.08)}}
      .vig{position:absolute;inset:0;z-index:0!important;pointer-events:none;background:radial-gradient(120% 100% at 50% 40%,transparent 55%,rgba(0,0,0,.55) 100%)}
      .p{background:var(--g);border:1px solid var(--b);border-radius:20px;padding:12px 14px;min-height:0;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
      .top{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 14px}
      .tt{font:300 26px/1 system-ui,Roboto,sans-serif;letter-spacing:-.02em;margin-right:6px} .cnt{font-size:12px;color:var(--m);margin-right:auto} .cnt b{color:var(--a);font:300 22px system-ui;margin-right:3px}
      .top button{height:38px;padding:0 14px} .on1{background:var(--a);color:#1c1826;border-color:var(--a)} .off1{}
      .amb{display:flex;gap:6px;align-items:center} select{height:38px;max-width:250px;background:rgba(255,255,255,.06);color:var(--t);border:1px solid var(--b);border-radius:14px;padding:0 10px;font:500 13px system-ui}
      select option{background:#14162a}
      .ap,.ae{width:38px;padding:0!important} .lj{background:linear-gradient(135deg,#b48cff,#7a4fe0)!important;border-color:transparent!important}
      .plan{display:flex;flex-direction:column;border-radius:22px} .plan svg{flex:1;min-height:0;width:100%;height:100%}
      .h{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--m);margin:0 0 8px;display:flex;justify-content:space-between;align-items:center;gap:8px}
      .zone{fill:rgba(255,255,255,.02);stroke:none;cursor:pointer;transition:fill .3s} .zone:hover{fill:rgba(255,255,255,.06)} .zone.sel{fill:rgba(255,210,122,.1)}
      .zl{fill:rgba(243,238,230,.6);font:500 13px system-ui;pointer-events:none;text-anchor:middle} .zl.mute{fill:rgba(243,238,230,.28);font-size:11px}
      .wl{stroke:rgba(243,238,230,.55);stroke-width:3.5;stroke-linecap:round}
      .pt{cursor:pointer} .pt .c{stroke:rgba(0,0,0,.6);stroke-width:1.5;transition:fill .3s}
      .rooms{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;overflow:auto;align-content:start;scrollbar-width:thin}
      .rm{min-width:0;background:rgba(255,255,255,.04);border:1px solid transparent;border-radius:16px;padding:10px 12px;display:flex;flex-direction:column;gap:8px;transition:border-color .3s,background .3s}
      .rm.sel{border-color:rgba(255,210,122,.6)} .rm.lit{background:rgba(255,210,122,.06)}
      .rh{display:flex;align-items:center;gap:8px} .rn{font:300 16px/1.1 system-ui,Roboto,sans-serif;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .rc{font-size:12px;color:var(--m)}
      .sw{width:42px;height:24px;border-radius:12px;padding:0;position:relative;background:rgba(255,255,255,.1)} .sw::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:rgba(243,238,230,.6);transition:.2s}
      .sw.on{background:var(--a);border-color:var(--a)} .sw.on::after{left:21px;background:#1c1826}
      input[type=range]{width:100%;accent-color:var(--a);height:16px;margin:0}
      .ls{display:flex;flex-wrap:wrap;gap:5px} .ls button{height:28px;padding:0 10px;font:600 12px system-ui;border-radius:999px;display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.05)}
      .ls button i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.18);display:block;flex:none} .ls button.on{border-color:rgba(255,210,122,.45);background:rgba(255,210,122,.1)} .ls button.na{opacity:.35}
      .ir{display:flex;gap:5px;flex-wrap:wrap} .ir button{height:26px;padding:0 9px;font:600 11px system-ui;border-radius:999px} .ir .gx{background:linear-gradient(135deg,#b48cff,#7a4fe0);border-color:transparent}
      .dock{grid-column:1/-1;display:grid;grid-template-columns:repeat(auto-fit,minmax(78px,1fr));gap:8px;padding:8px;border-radius:20px;background:var(--g);border:1px solid var(--b);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
      .dock button{border-radius:14px;padding:8px 4px;font:700 11px system-ui;display:flex;flex-direction:column;align-items:center;gap:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .dock button i{font-style:normal;font-size:20px}
      @container (max-width:1050px){.rooms{grid-template-columns:minmax(0,1fr)}.w{grid-template-columns:minmax(0,1.5fr) minmax(0,1fr)}.hint{display:none}.lj span{display:none}}
      @container (max-width:680px){.w{grid-template-columns:1fr;grid-template-rows:auto;height:auto}.plan svg{height:240px}.rooms{overflow:visible}}
    </style>
    <div class="w"><div class="bgfx"><i></i><i></i><i></i></div><div class="vig"></div>
      <div class="p top"><span class="tt">💡 Éclairage</span><span class="cnt"><b class="n">0</b> allumée(s)</span>
        <button class="on1 all">Tout allumer</button><button class="off1 none">Tout éteindre</button>
        <span class="amb"><select class="as" aria-label="Ambiance pièce de vie"></select><button class="ap" title="Rejouer l'ambiance">▶</button><button class="ae" title="Éteindre la pièce de vie">⏹</button></span>
        <button class="lj">🎛️<span> Light Jockey</span></button></div>
      <div class="p plan"><div class="h"><span>Plan de la maison</span><span class="hint">appui = allumer / éteindre · appui long = réglages</span></div><svg viewBox="0 0 800 380" preserveAspectRatio="xMidYMid meet"></svg></div>
      <div class="p rooms"></div>
      <div class="dock"></div>
    </div>`;
    this.$ = (q) => r.querySelector(q);
    const NS = 'http://www.w3.org/2000/svg', svg = this.$('svg'), mk = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
    const defs = mk('defs', {}); const blur = mk('filter', { id: 'gl', x: '-100%', y: '-100%', width: '300%', height: '300%' }, defs); mk('feGaussianBlur', { stdDeviation: '14' }, blur);
    const gz = mk('g', {}), gg = mk('g', {}), gw = mk('g', {}), gp = mk('g', {}), gt = mk('g', {});
    this._zones = {};
    ZONES.forEach(([id, d, x, y, lab]) => { const z = mk('path', { d, class: 'zone' }, gz); if (id) { this._zones[id] = z; z.addEventListener('click', () => this._pick(id)); }
      const R = ROOMS.find((q) => q.id === id); const t = mk('text', { x, y, class: 'zl' + (id ? '' : ' mute') }, gt); t.textContent = id ? R.n : lab; });
    WALLS.forEach(([a, b, c, d]) => mk('line', { x1: a, y1: b, x2: c, y2: d, class: 'wl' }, gw));
    this._pts = PTS.map(([e, x, y, f, len]) => {
      const glow = mk('circle', { cx: x, cy: y, r: f === 's' ? 22 : 34, filter: 'url(#gl)', opacity: 0 }, gg);
      const g = mk('g', { class: 'pt' }, gp); let c;
      if (f === 'bar') c = mk('rect', { x: x - len / 2, y: y - 3, width: len, height: 6, rx: 3, class: 'c' }, g);
      else if (f === 'vbar') c = mk('rect', { x: x - 3, y: y - len / 2, width: 6, height: len, rx: 3, class: 'c' }, g);
      else c = mk('circle', { cx: x, cy: y, r: f === 's' ? 5.5 : 9, class: 'c' }, g);
      mk('circle', { cx: x, cy: y, r: 16, fill: 'transparent' }, g);
      const tt = mk('title', {}, g); this._press(g, () => this._tog(e), () => this._more(e)); return { e, glow, c, tt };
    });
    const rooms = this.$('.rooms'); this._rm = {};
    ROOMS.forEach((R) => {
      const d = document.createElement('div'); d.className = 'rm'; d.innerHTML = `<div class="rh"><span>${R.ic}</span><span class="rn">${R.n}</span><span class="rc"></span><button class="sw" aria-label="${R.n}"></button></div>`
        + (R.g ? '<input type="range" min="1" max="100" aria-label="Luminosité">' : '') + '<div class="ls"></div>' + (R.ir ? '<div class="ir"></div>' : '');
      const sw = d.querySelector('.sw'); sw.onclick = () => { const any = R.l.some(([e]) => this._on(e)); R.l.forEach(([e]) => { if (this._s(e) && this._on(e) === any) this._tog(e); }); };
      const rg = d.querySelector('input'); if (rg) { rg.oninput = () => { rg._busy = true; }; rg.onchange = () => { rg._busy = false; this._call('light', 'turn_on', { brightness_pct: +rg.value }, { entity_id: R.g }); }; }
      const ls = d.querySelector('.ls'); const btns = R.l.map(([e, n]) => { const b = document.createElement('button'); b.innerHTML = `<i></i>${n}`; this._press(b, () => this._tog(e), () => this._more(e)); ls.appendChild(b); return [e, b]; });
      if (R.ir) { const ir = d.querySelector('.ir'); IR.forEach(([i, n, cmd]) => { const b = document.createElement('button'); b.textContent = i + (n ? ' ' + n : ''); b.title = 'Ventilateur : ' + cmd;
          b.onclick = () => this._call('remote', 'send_command', { device: 'ventillateur_plafond_chambre', command: cmd }, { entity_id: 'remote.cellule_remonte_salon' }); ir.appendChild(b); });
        const gx = document.createElement('button'); gx.className = 'gx'; gx.textContent = '✨ Galaxie'; gx.onclick = () => this._nav('/ma-maison/chambre-enfants'); ir.appendChild(gx); }
      rooms.appendChild(d); this._rm[R.id] = { d, sw, rg, btns, R };
    });
    const dk = this.$('.dock'); SCENES.forEach(([i, n, e]) => { const b = document.createElement('button'); b.innerHTML = `<i>${i}</i>${n}`; b.onclick = () => this._call('scene', 'turn_on', {}, { entity_id: e }); dk.appendChild(b); });
    this.$('.all').onclick = () => this._call('light', 'turn_on', {}, { entity_id: 'light.toute_lumieres' });
    this.$('.none').onclick = () => { this._call('light', 'turn_off', {}, { entity_id: 'light.toute_lumieres' }); };
    this.$('.as').onchange = (ev) => this._call('input_select', 'select_option', { option: ev.target.value }, { entity_id: AMB });
    this.$('.ap').onclick = () => this._call('script', 'turn_on', {}, { entity_id: 'script.ambiance_appliquer' });
    this.$('.ae').onclick = () => this._call('script', 'turn_on', {}, { entity_id: 'script.ambiance_eteindre' });
    this.$('.lj').onclick = () => this._nav('/maison-eclairage/light-jockey');
  }
  connectedCallback() { const fit = () => { const t = Math.max(0, Math.round(this.getBoundingClientRect().top + window.scrollY)); this.style.setProperty('--top', t + 'px'); };
    this._fit = fit; window.addEventListener('resize', fit); requestAnimationFrame(fit); setTimeout(fit, 600); setTimeout(fit, 2000); }
  disconnectedCallback() { if (this._fit) window.removeEventListener('resize', this._fit); }
  _nav(p) { history.pushState(null, '', p); window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } })); }
  _pick(id) { this._sel = this._sel === id ? null : id; Object.entries(this._rm).forEach(([k, o]) => o.d.classList.toggle('sel', k === this._sel)); Object.entries(this._zones).forEach(([k, z]) => z.classList.toggle('sel', k === this._sel));
    if (this._sel) this._rm[id].d.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  _upd() {
    let n = 0; const all = new Set();
    this._pts.forEach(({ e, glow, c, tt }) => { const v = this._col(e), s = this._s(e); const rgb = v ? `rgb(${v[0].join(',')})` : (s && s.state !== 'unavailable' ? '#3a3f52' : '#22252f');
      c.setAttribute('fill', rgb); glow.setAttribute('fill', rgb); glow.setAttribute('opacity', v ? (0.25 + 0.6 * v[1]).toFixed(2) : 0);
      tt.textContent = ((s && s.attributes.friendly_name) || e) + (s ? ' — ' + (s.state === 'on' ? 'allumée' : s.state === 'off' ? 'éteinte' : 'indisponible') : ''); });
    Object.values(this._rm).forEach(({ d, sw, rg, btns, R }) => { let k = 0, t = 0;
      btns.forEach(([e, b]) => { const s = this._s(e); const v = this._col(e); if (s) t++; if (v) { k++; all.add(e); }
        b.classList.toggle('on', !!v); b.classList.toggle('na', !s || s.state === 'unavailable'); b.querySelector('i').style.background = v ? `rgb(${v[0].join(',')})` : '';
        b.querySelector('i').style.boxShadow = v ? `0 0 8px rgb(${v[0].join(',')})` : ''; });
      d.querySelector('.rc').textContent = k + '/' + t; sw.classList.toggle('on', k > 0); d.classList.toggle('lit', k > 0);
      if (rg && !rg._busy) { const g = this._s(R.g); rg.value = g && g.state === 'on' ? Math.round((g.attributes.brightness || 255) / 2.55) : 1; rg.disabled = !g || g.state !== 'on'; } });
    n = all.size; this.$('.n').textContent = n;
    const a = this._s(AMB), sel = this.$('.as'); if (a && !sel.matches(':focus')) { const o = a.attributes.options || []; if (sel.options.length !== o.length) sel.innerHTML = o.map((x) => `<option>${x.replace(/</g, '')}</option>`).join(''); sel.value = a.state; }
  }
}
customElements.define('eclairage-card', EclairageCard);
window.customCards = window.customCards || []; window.customCards.push({ type: 'eclairage-card', name: 'Éclairage maison' });
