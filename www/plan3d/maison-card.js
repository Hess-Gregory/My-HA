/* Ma Maison — vue pièce par pièce, design Accueil : liste des pièces + panneau détaillé + accès aux commandes complètes. */
const ROOMS = [
  { id: 'vie', n: 'Pièce de vie', ic: '🛋️', view: 'piece-de-vie', clim: ['climate.living', 'piece_de_vie_sonoff_a480146b56'],
    l: [['light.salon_salon', 'Salon'], ['light.salle_a_manger_salle_a_manger', 'Salle à manger'], ['light.cuisine_cuisine', 'Cuisine'], ['light.coin_dj_coin_dj', 'Coin DJ'], ['light.salon_ambilight_tv', 'Ambilight']],
    med: ['media_player.ampli_cine', 'media_player.televiseur_du_salon'], mo: ['binary_sensor.piece_de_vie_detecteur_living_mouvement'], cam: ['camera.salon_fluide'] },
  { id: 'entree', n: 'Entrée & accès', ic: '🚪', view: 'entree', clim: ['climate.couloir', 'couloir_sonoff_a480146b60'],
    l: [['light.hall_dentree_bticino_intercom_greg_et_sandrine_eclairage_exterieur', 'Éclairage ext.'], ['light.e1_outdoor_se_poe_projecteur', 'Projecteur']],
    d: [['binary_sensor.hall_dentree_porte_entree_porte', "Porte d'entrée"]], lock: 'lock.hall_dentree_bticino_intercom_greg_et_sandrine_serrure',
    mo: ['binary_sensor.hall_dentree_mouvement_couloir_mouvement'], cam: ['camera.hall_dentree_bticino_intercom_greg_et_sandrine_platine_de_rue', 'camera.couloir'] },
  { id: 'enfants', n: 'Chambre enfants', ic: '🧸', view: 'chambre-enfants', clim: ['climate.chambre_enfants', 'chambre_enfants_sonoff_a480146b58'],
    l: [['switch.plafonnier_chambre_enfants', 'Plafonnier'], ['light.chambre_matteo', 'Lampe']], mo: ['binary_sensor.chambre_enfants_mouvement'], cam: ['camera.chambre_enfant'] },
  { id: 'parents', n: 'Chambre parents', ic: '🛏️', view: 'chambre-parents', clim: ['climate.chambre_adulte', 'chambre_adulte_sonoff_a480146b5b'], l: [] },
  { id: 'sdb', n: 'Salle de bain', ic: '🛁', view: 'salle-de-bain', clim: ['climate.salle_de_bain', 'salle_de_bain_sonoff_a480146b5d'],
    l: [['light.salle_de_bain_salle_de_bain', 'Plafond'], ['light.salle_de_bain_sdb_evier', 'Évier'], ['light.salle_de_bain_sdb_douche', 'Douche'], ['light.salle_de_bain_sdb_langer', 'Langer']] },
  { id: 'tech', n: 'Buanderie & technique', ic: '🧺', view: 'buanderie-tech', l: [],
    d: [['binary_sensor.buanderie_local_tech_ouverture_rack_porte', 'Rack réseau'], ['binary_sensor.cave_sous_sol_cave_porte', 'Porte de la cave']] },
  { id: 'ext', n: 'Extérieur', ic: '🌳', view: null, l: [['light.rue_projecteur', 'Projecteur rue'], ['light.rlc_843a_projecteur', 'Projecteur balcon']],
    mo: ['binary_sensor.rue_mouvement', 'binary_sensor.balcon_mouvement'], cam: ['camera.rue_fluide', 'camera.rlc_843a_fluide'] },
];
const OFF = ['off', 'unavailable', 'unknown', 'standby', 'idle'];
const HV = { heat: 'Chauffe', off: 'Arrêt', auto: 'Auto', cool: 'Froid', heat_cool: 'Auto' };

class MaisonCard extends HTMLElement {
  setConfig(c) { this.cfg = c || {}; }
  getCardSize() { return 12; }
  set hass(h) { this._h = h; if (this._ftr) this._ftr.hass = h; (this._pops || []).forEach((el) => { el.hass = h; }); if (!this._b) this._build(); if (!this._raf) this._raf = requestAnimationFrame(() => { this._raf = null; this._upd(); }); }
  _s(e) { return this._h && this._h.states[e]; }
  _on(e) { const s = this._s(e); return !!s && s.state === 'on'; }
  _call(d, s, data) { return this._h.callService(d, s, data || {}); }
  _more(e) { this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: e }, bubbles: true, composed: true })); }
  _num(e) { const s = this._s(e); const v = s ? parseFloat(s.state) : NaN; return isNaN(v) ? null : v; }
  _temp(r) { if (!r.clim) return null; const t = this._num('sensor.temp_' + r.clim[1] + '_temperature'); if (t != null) return t; const c = this._s(r.clim[0]); return c ? c.attributes.current_temperature : null; }
  _hum(r) { return r.clim ? this._num('sensor.temp_' + r.clim[1] + '_humidity') : null; }
  _ago(e) { const s = this._s(e); if (!s) return ''; const m = Math.round((Date.now() - new Date(s.last_changed).getTime()) / 60000); return m < 1 ? "à l'instant" : m < 60 ? `il y a ${m} min` : m < 1440 ? `il y a ${Math.round(m / 60)} h` : `il y a ${Math.round(m / 1440)} j`; }

  _build() {
    this._b = true; this._sel = (this.cfg.room && ROOMS.find((r) => r.id === this.cfg.room)) ? this.cfg.room : 'vie';
    const r = this.attachShadow({ mode: 'open' });
    r.innerHTML = `<style>
      :host{container-type:inline-size;display:block;--g:rgba(255,255,255,.06);--b:rgba(255,255,255,.09);--t:#f3eee6;--m:rgba(243,238,230,.6);--a:#ffd27a;color:var(--t);font:500 14px system-ui,Roboto,sans-serif}
      *{box-sizing:border-box} button{appearance:none;font:700 12px system-ui,Roboto,sans-serif;color:var(--t);cursor:pointer;border:1px solid var(--b);background:rgba(255,255,255,.06);border-radius:14px;-webkit-tap-highlight-color:transparent;transition:background .2s,border-color .2s,transform .1s}
      button:active{transform:scale(.96)}
      .w{position:relative;isolation:isolate;overflow:hidden;display:grid;gap:12px;padding:10px;border-radius:22px;grid-template-columns:minmax(250px,24%) minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);height:calc(100vh - var(--top,56px) - var(--fh,0px) - 1px);min-height:600px;background:radial-gradient(140% 90% at 50% 0%,#121426 0%,#07080f 70%)}
      .w>*{position:relative;z-index:1}
      .bgfx{position:absolute;inset:-20%;z-index:0!important;pointer-events:none;filter:blur(70px) saturate(130%);opacity:.55}
      .bgfx i{position:absolute;border-radius:50%;mix-blend-mode:screen;animation:drift 38s ease-in-out infinite alternate}
      .bgfx i:nth-child(1){width:55%;height:60%;left:2%;top:4%;background:radial-gradient(circle,#ff9a5a,transparent 65%)}
      .bgfx i:nth-child(2){width:52%;height:58%;right:4%;top:18%;background:radial-gradient(circle,#7b5cff,transparent 65%);animation-duration:46s;animation-delay:-12s}
      .bgfx i:nth-child(3){width:44%;height:48%;left:30%;bottom:2%;background:radial-gradient(circle,#1fb6c9,transparent 65%);animation-duration:52s;animation-delay:-24s}
      @keyframes drift{from{transform:translate(0,0) scale(1)}to{transform:translate(6%,5%) scale(1.08)}}
      .vig{position:absolute;inset:0;z-index:0!important;pointer-events:none;background:radial-gradient(120% 100% at 50% 40%,transparent 55%,rgba(0,0,0,.55) 100%)}
      .p{background:var(--g);border:1px solid var(--b);border-radius:20px;padding:12px 14px;min-height:0;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
      .h{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--m);margin:0 0 9px;display:flex;justify-content:space-between;align-items:center;gap:8px}
      .top{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:10px 14px}
      .tt{font:300 26px/1 system-ui,Roboto,sans-serif;letter-spacing:-.02em;margin-right:8px}
      .kpi{display:flex;gap:6px;flex-wrap:wrap;margin-right:auto} .kpi span{height:34px;padding:0 12px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid var(--b);display:flex;align-items:center;gap:6px;font-size:12px;color:var(--m)} .kpi b{color:var(--t);font-weight:700}
      .kpi span.warn{border-color:rgba(255,183,77,.5);color:#ffcf8a} .kpi span.warn b{color:#ffcf8a}
      .top button{height:38px;padding:0 14px}
      .rooms{display:flex;flex-direction:column;gap:8px;overflow:auto;scrollbar-width:thin;padding:8px}
      .rm{display:grid;grid-template-columns:auto 1fr auto;gap:4px 10px;align-items:center;text-align:left;padding:10px 12px;border-radius:16px;background:rgba(255,255,255,.04);border-color:transparent}
      .rm{grid-template-areas:'i n t' 'i s t'} .rm .ri{font-size:24px;grid-area:i} .rm .rn{grid-area:n;font:500 15px system-ui;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .rm .rt{grid-area:t;font:300 22px system-ui;font-variant-numeric:tabular-nums}
      .rm .rs{grid-area:s;font:500 11px system-ui;color:var(--m);display:flex;gap:8px;white-space:nowrap;overflow:hidden}
      .rm.sel{background:rgba(255,210,122,.1);border-color:rgba(255,210,122,.55)} .rm.sel .rn{color:var(--a)}
      .dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#3fbf7f;box-shadow:0 0 8px #3fbf7f;vertical-align:middle;animation:pulse 1.6s infinite} @keyframes pulse{50%{opacity:.35}}
      .main{display:flex;flex-direction:column;gap:12px;min-height:0}
      .hd{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:14px 18px}
      .hd .hi{font-size:34px} .hd .hn{font:300 30px/1.05 system-ui;letter-spacing:-.02em} .hd .hm{font-size:12px;color:var(--m);margin-top:4px}
      .hd .ht{margin-left:auto;display:flex;align-items:baseline;gap:14px} .hd .ht b{font:200 44px/1 system-ui;font-variant-numeric:tabular-nums} .hd .ht span{color:var(--m);font-size:14px}
      .hd .full{height:40px;padding:0 14px;background:#ffd27a;color:#1c1826;border-color:#ffd27a}
      .grid{flex:1;min-height:0;overflow:auto;scrollbar-width:thin;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;align-content:start} .t.wide{grid-column:span 2} .t.wide .cams{grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}
      .t{display:flex;flex-direction:column;gap:10px}
      .chips{display:flex;flex-wrap:wrap;gap:6px} .chips button{height:34px;padding:0 12px;border-radius:999px;display:flex;align-items:center;gap:7px;font:600 12px system-ui}
      .chips button i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.18);font-style:normal} .chips button.on{border-color:rgba(255,210,122,.5);background:rgba(255,210,122,.12)} .chips button.on i{background:var(--a);box-shadow:0 0 8px var(--a)} .chips button.na{opacity:.35}
      .big{display:flex;align-items:center;gap:12px} .big b{font:200 40px/1 system-ui;font-variant-numeric:tabular-nums} .big small{color:var(--m)}
      .stp{display:flex;align-items:center;gap:8px;margin-left:auto} .stp button{width:40px;height:40px;border-radius:50%;font-size:18px;padding:0} .stp span{font:300 22px system-ui;min-width:62px;text-align:center}
      .row{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.04)} .row .rl{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .row .st{font:700 12px system-ui;color:var(--m)} .row .st.op{color:#ffcf8a} .row .st.ok{color:#7fe0a8}
      .row button{height:32px;padding:0 12px}
      .lk.arm{background:#ffd27a;color:#1c1826;border-color:#ffd27a}
      .mp{display:grid;grid-template-columns:52px 1fr auto;gap:10px;align-items:center;padding:8px;border-radius:14px;background:rgba(255,255,255,.04)} .mp .art{width:52px;height:52px;border-radius:10px;background:rgba(255,255,255,.06) center/cover;display:flex;align-items:center;justify-content:center;font-size:20px}
      .mp .mt{font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .mp .ms{font-size:12px;color:var(--m);white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .mp button{width:40px;height:40px;border-radius:50%;padding:0;font-size:16px}
      .cams{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px} .cm{position:relative;aspect-ratio:16/9;border-radius:14px;overflow:hidden;background:#000 center/cover;cursor:pointer;border:1px solid var(--b)} .cm span{position:absolute;left:8px;bottom:6px;font:700 11px system-ui;text-shadow:0 1px 4px #000}
      .empty{color:var(--m);font-size:13px;padding:6px 2px}
      @container (max-width:860px){.w{grid-template-columns:1fr;grid-template-rows:auto;height:auto}.rooms{flex-direction:row;overflow:auto}.rm{min-width:200px}.grid{overflow:visible}}
    </style>
    <div class="w"><div class="bgfx"><i></i><i></i><i></i></div><div class="vig"></div>
      <div class="p top"><span class="tt">Ma maison</span><div class="kpi"></div><button class="pl3">🧊 Plan 3D</button></div>
      <div class="p rooms"></div>
      <div class="main"><div class="p hd"><span class="hi"></span><div><div class="hn"></div><div class="hm"></div></div><div class="ht"></div><button class="full">⤢ Commandes complètes</button></div><div class="grid"></div></div>
    </div>`;
    const $ = (s) => r.querySelector(s); this.$ = $;
    this._rmBtns = ROOMS.map((rm) => { const b = document.createElement('button'); b.className = 'rm'; b.innerHTML = `<span class="ri">${rm.ic}</span><span class="rn">${rm.n}</span><span class="rt"></span><span class="rs"></span>`; b.onclick = () => { this._sel = rm.id; this._grid = null; this._upd(); }; $('.rooms').appendChild(b); return [rm, b]; });
    $('.full').onclick = () => this._fullPop();
    $('.pl3').onclick = () => { history.pushState(null, '', this.cfg.plan_path || '/ma-maison/plan-3d'); window.dispatchEvent(new CustomEvent('location-changed')); };
    const fit = () => { const t = Math.max(0, Math.round(this.getBoundingClientRect().top + window.scrollY)); this.style.setProperty('--top', t + 'px'); const ft = this.shadowRoot && this.shadowRoot.querySelector('.ftr'); this.style.setProperty('--fh', (ft ? ft.offsetHeight : 0) + 'px'); };
    this._fit = fit; if (this.cfg && this.cfg.footer && !this._fd) { const fd = document.createElement('div'); fd.className = 'ftr'; fd.style.cssText = 'padding-top:4px'; this.shadowRoot.appendChild(fd); this._fd = fd; window.loadCardHelpers().then((hp) => { const el = hp.createCardElement(this.cfg.footer); el.hass = this._h; this._ftr = el; fd.appendChild(el); setTimeout(fit, 300); setTimeout(fit, 1500); }); }
    window.addEventListener('resize', fit); requestAnimationFrame(fit); setTimeout(fit, 600); setTimeout(fit, 2000);
    this._camT = setInterval(() => this._camRefresh(), 10000);
  }
  disconnectedCallback() { if (this._fit) window.removeEventListener('resize', this._fit); clearInterval(this._camT); this._camT = null; }
  connectedCallback() { if (this._b && !this._camT) this._camT = setInterval(() => this._camRefresh(), 10000); }
  _lightsOn(rm) { return (rm.l || []).filter(([e]) => this._on(e)).length; }
  _open(rm) { return (rm.d || []).filter(([e]) => this._on(e)).length; }
  _motion(rm) { return (rm.mo || []).some((e) => this._on(e)); }

  _upd() {
    if (!this._h || !this._b) return; const $ = this.$;
    // KPIs maison
    let lon = 0, op = 0, ts = []; ROOMS.forEach((rm) => { lon += this._lightsOn(rm); op += this._open(rm); const t = this._temp(rm); if (t != null && rm.clim) ts.push(t); });
    const lock = this._s('lock.hall_dentree_bticino_intercom_greg_et_sandrine_serrure');
    const avg = ts.length ? (ts.reduce((a, b) => a + b, 0) / ts.length).toFixed(1) : '–';
    $('.kpi').innerHTML = `<span>🌡️ <b>${avg}°</b> moyenne</span><span>💡 <b>${lon}</b> allumée(s)</span><span class="${op ? 'warn' : ''}">🚪 <b>${op}</b> ouverte(s)</span><span class="${lock && lock.state !== 'locked' ? 'warn' : ''}">🔐 <b>${lock ? (lock.state === 'locked' ? 'Verrouillée' : 'Déverrouillée') : '–'}</b></span>`;
    // liste pièces
    this._rmBtns.forEach(([rm, b]) => {
      b.classList.toggle('sel', rm.id === this._sel); const t = this._temp(rm), n = this._lightsOn(rm), o = this._open(rm);
      b.querySelector('.rt').textContent = t != null ? t.toFixed(1) + '°' : '';
      b.querySelector('.rs').innerHTML = [(rm.l || []).length ? `💡 ${n}/${rm.l.length}` : '', o ? `🚪 ${o} ouverte` : '', this._motion(rm) ? '<span class="dot"></span> présence' : ''].filter(Boolean).join(' · ') || '—';
    });
    // panneau pièce
    const rm = ROOMS.find((x) => x.id === this._sel); const c = rm.clim && this._s(rm.clim[0]);
    $('.hi').textContent = rm.ic; $('.hn').textContent = rm.n;
    const mo = (rm.mo || []).find((e) => this._s(e)); $('.hm').innerHTML = mo ? (this._on(mo) ? '<span class="dot"></span> Présence détectée' : 'Dernier mouvement ' + this._ago(mo)) : '';
    const t = this._temp(rm), hu = this._hum(rm);
    $('.ht').innerHTML = t != null ? `<b>${t.toFixed(1)}°</b>${hu != null ? `<span>💧 ${Math.round(hu)} %</span>` : ''}${c ? `<span>🎯 ${c.attributes.temperature ?? '–'}°</span>` : ''}` : '';
    $('.full').style.display = rm.view ? '' : 'none';
    if (this._grid !== rm.id) this._buildGrid(rm);
    this._updGrid(rm);
  }
  _buildGrid(rm) {
    this._grid = rm.id; const g = this.$('.grid'); g.innerHTML = ''; this._el = {};
    const tile = (title, cls) => { const d = document.createElement('div'); d.className = 'p t ' + (cls || ''); d.innerHTML = `<div class="h"><span>${title}</span><span class="hx"></span></div>`; g.appendChild(d); return d; };
    if ((rm.l || []).length) { const d = tile('💡 Lumières'); const ch = document.createElement('div'); ch.className = 'chips'; d.appendChild(ch);
      this._el.l = rm.l.map(([e, n]) => { const b = document.createElement('button'); b.innerHTML = `<i></i>${n}`; b.onclick = () => this._call(e.split('.')[0], 'toggle', { entity_id: e }); b.oncontextmenu = (ev) => { ev.preventDefault(); this._more(e); }; ch.appendChild(b); return [e, b]; });
      const off = document.createElement('button'); off.textContent = 'Tout éteindre'; off.style.cssText = 'height:30px;padding:0 10px;font-size:11px'; off.onclick = () => rm.l.forEach(([e]) => this._on(e) && this._call(e.split('.')[0], 'turn_off', { entity_id: e })); d.querySelector('.hx').appendChild(off); this._el.lt = d; }
    if (rm.clim && this._s(rm.clim[0])) { const d = tile('🌡️ Chauffage'); d.insertAdjacentHTML('beforeend', `<div class="big"><b class="ct"></b><div class="stp"><button class="mn">−</button><span class="tg"></span><button class="pl">+</button></div></div><div style="font-size:13px;color:var(--m)"><span class="cm2"></span> <span class="cp"></span></div><div class="chips pr"></div>`);
      const e = rm.clim[0]; const step = (dl) => { const s = this._s(e); const v = (s.attributes.temperature || 19) + dl; this._call('climate', 'set_temperature', { entity_id: e, temperature: Math.round(v * 2) / 2 }); };
      d.querySelector('.mn').onclick = () => step(-0.5); d.querySelector('.pl').onclick = () => step(0.5); d.querySelector('.ct').onclick = () => this._more(e); this._el.c = d; }
    if ((rm.d || []).length || rm.lock) { const d = tile('🚪 Accès & ouvertures'); this._el.d = (rm.d || []).map(([e, n]) => { const r = document.createElement('div'); r.className = 'row'; r.innerHTML = `<span class="rl">${n}</span><span class="st"></span>`; r.onclick = () => this._more(e); d.appendChild(r); return [e, r]; });
      if (rm.lock) { const r = document.createElement('div'); r.className = 'row'; r.innerHTML = `<span class="rl">🔐 Serrure</span><span class="st"></span><button class="lk"></button>`; const b = r.querySelector('.lk');
        b.onclick = () => { const s = this._s(rm.lock); if (!s) return; if (!b._arm) { b._arm = true; b.classList.add('arm'); b.textContent = 'Confirmer ?'; clearTimeout(b._t); b._t = setTimeout(() => { b._arm = false; b.classList.remove('arm'); this._updGrid(rm); }, 3000); return; } b._arm = false; b.classList.remove('arm'); this._call('lock', s.state === 'locked' ? 'unlock' : 'lock', { entity_id: rm.lock }); };
        d.appendChild(r); this._el.lk = r; } }
    if ((rm.med || []).length) { const d = tile('🎵 Médias'); this._el.m = rm.med.map((e) => { const r = document.createElement('div'); r.className = 'mp'; r.innerHTML = `<div class="art"></div><div style="min-width:0"><div class="mt"></div><div class="ms"></div></div><button class="pp"></button>`; r.querySelector('.art').onclick = () => this._more(e); r.querySelector('.pp').onclick = () => { const s = this._s(e); this._call('media_player', OFF.includes(s.state) && s.state !== 'idle' ? 'turn_on' : 'media_play_pause', { entity_id: e }); }; d.appendChild(r); return [e, r]; }); }
    if ((rm.cam || []).length) { const d = tile('📹 Caméras'); const w = document.createElement('div'); w.className = 'cams'; d.classList.add('wide'); d.appendChild(w); this._el.cam = rm.cam.map((e) => { const r = document.createElement('div'); r.className = 'cm'; r.innerHTML = '<span></span>'; r.onclick = () => this._more(e); w.appendChild(r); return [e, r]; }); this._camRefresh(); }
    if (!g.children.length) g.innerHTML = '<div class="p empty">Rien à afficher ici : utilise « Commandes complètes » pour tous les réglages de la pièce.</div>';
  }
  _camRefresh() { (this._el && this._el.cam || []).forEach(([e, r]) => { const s = this._s(e); if (!s || !s.attributes.entity_picture) return; r.style.backgroundImage = `url("${s.attributes.entity_picture}&t=${Date.now()}")`; r.querySelector('span').textContent = s.attributes.friendly_name || ''; }); }
  _updGrid(rm) {
    const E = this._el || {};
    (E.l || []).forEach(([e, b]) => { const s = this._s(e); b.classList.toggle('on', !!s && s.state === 'on'); b.classList.toggle('na', !s || s.state === 'unavailable'); });
    if (E.lt) E.lt.querySelector('.h span').textContent = `💡 Lumières · ${this._lightsOn(rm)}/${rm.l.length}`;
    if (E.c) { const s = this._s(rm.clim[0]), A = s.attributes, t = this._temp(rm); E.c.querySelector('.ct').textContent = t != null ? t.toFixed(1) + '°' : '–';
      E.c.querySelector('.tg').textContent = (A.temperature ?? '–') + '°'; E.c.querySelector('.cm2').textContent = (HV[s.state] || s.state) + (A.hvac_action ? ' · ' + (A.hvac_action === 'heating' ? '🔥 en chauffe' : A.hvac_action === 'idle' ? 'au repos' : A.hvac_action) : '');
      E.c.querySelector('.cp').textContent = '';
      const pr = E.c.querySelector('.pr'), pl = A.preset_modes || []; if (pr._k !== pl.join()) { pr._k = pl.join(); pr.innerHTML = ''; pl.forEach((p) => { const b = document.createElement('button'); b.innerHTML = `<i></i>${p}`; b.onclick = () => this._call('climate', 'set_preset_mode', { entity_id: rm.clim[0], preset_mode: p }); pr.appendChild(b); }); }
      Array.from(pr.children).forEach((b, i) => b.classList.toggle('on', pl[i] === A.preset_mode)); }
    (E.d || []).forEach(([e, r]) => { const s = this._s(e), o = s && s.state === 'on'; const st = r.querySelector('.st'); st.textContent = !s ? '–' : o ? 'Ouverte' : 'Fermée'; st.className = 'st ' + (o ? 'op' : 'ok'); });
    if (E.lk) { const s = this._s(rm.lock), b = E.lk.querySelector('.lk'), st = E.lk.querySelector('.st'); const L = s && s.state === 'locked'; st.textContent = s ? (L ? 'Verrouillée' : 'Déverrouillée') : '–'; st.className = 'st ' + (L ? 'ok' : 'op'); if (!b._arm) b.textContent = L ? 'Déverrouiller' : 'Verrouiller'; }
    (E.m || []).forEach(([e, r]) => { const s = this._s(e) || { state: 'off', attributes: {} }, A = s.attributes; const on = !OFF.includes(s.state) || s.state === 'idle';
      r.querySelector('.mt').textContent = A.media_title || A.friendly_name || e; r.querySelector('.ms').textContent = [A.media_artist, A.source, s.state === 'playing' ? '● lecture' : s.state === 'paused' ? 'pause' : s.state].filter(Boolean).join(' · ');
      const art = r.querySelector('.art'); art.style.backgroundImage = A.entity_picture ? `url("${A.entity_picture}")` : 'none'; art.textContent = A.entity_picture ? '' : (e.includes('ampli') ? '🔈' : '📺');
      r.querySelector('.pp').textContent = s.state === 'playing' ? '❚❚' : on ? '▶' : '⏻'; });
  }

  // popup « commandes complètes » : reprend la vue détaillée existante de la pièce
  async _fullPop() {
    const rm = ROOMS.find((x) => x.id === this._sel); if (!rm.view) return;
    const old = document.querySelector('.mmpop'); if (old) old.remove();
    const o = document.createElement('div'); o.className = 'mmpop';
    o.style.cssText = 'position:fixed;inset:0;z-index:997;background:rgba(5,6,12,.66);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center';
    o.innerHTML = `<div style="background:linear-gradient(160deg,#1f1c30,#12111c);color:#f3eee6;border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:14px;width:min(1300px,96vw);height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.7);font-family:system-ui,Roboto,sans-serif"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><b style="flex:1;font-size:18px;font-weight:500">${rm.ic} ${rm.n} — commandes complètes</b><button class="x" style="border:none;border-radius:12px;background:rgba(255,255,255,.08);color:#fff;padding:9px 13px;font-size:15px;cursor:pointer">✕</button></div><div class="bd" style="flex:1;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:12px;align-items:start">Chargement…</div></div>`;
    const close = () => { o.remove(); this._pops = []; }; o.onclick = (ev) => { if (ev.target === o) close(); }; o.querySelector('.x').onclick = close;
    o.style.pointerEvents = 'none'; setTimeout(() => { o.style.pointerEvents = ''; }, 450); document.body.appendChild(o); this._pops = [];
    const bd = o.querySelector('.bd');
    try {
      if (!this._mm) this._mm = await this._h.callWS({ type: 'lovelace/config', url_path: this.cfg.source || 'ma-maison' });
      const v = this._mm.views.find((x) => x.path === rm.view); const hp = await window.loadCardHelpers(); bd.innerHTML = '';
      const secs = v.sections ? v.sections.map((s) => ({ type: 'vertical-stack', cards: s.cards || [] })) : (v.cards || []);
      for (const s of secs) { const el = hp.createCardElement(s); el.hass = this._h; this._pops.push(el); bd.appendChild(el); }
    } catch (e) { bd.textContent = 'Indisponible : ' + e.message; }
  }
}
if (!customElements.get('maison-card')) customElements.define('maison-card', MaisonCard);
window.customCards = window.customCards || []; window.customCards.push({ type: 'maison-card', name: 'Ma Maison — pièces' });
