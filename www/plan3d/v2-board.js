/* V2 Board — moteur générique au design Accueil : en-tête + KPI, onglets, tuiles (stats, interrupteurs, listes, graphes, caméras, cartes HA intégrées), dock d'actions, pied de page. */
const OFFS = ['off', 'unavailable', 'unknown', 'standby', 'idle', 'closed', 'locked', 'not_home', 'disarmed'];
const fmtNum = (v, d) => { const n = parseFloat(v); if (isNaN(n)) return v; return n.toLocaleString('fr-BE', { maximumFractionDigits: d == null ? (Math.abs(n) >= 100 ? 0 : 1) : d }); };
const TR = { on: 'Allumé', off: 'Éteint', open: 'Ouvert', closed: 'Fermé', locked: 'Verrouillé', unlocked: 'Déverrouillé', home: 'Maison', not_home: 'Absent', unavailable: 'Indispo.', unknown: '–', armed_away: 'Armée (absent)', armed_home: 'Armée (présent)', armed_night: 'Armée (nuit)', disarmed: 'Désarmée', triggered: '⚠️ Déclenchée', heat: 'Chauffe', idle: 'Repos', playing: 'Lecture', paused: 'Pause', above_horizon: 'Jour', below_horizon: 'Nuit' };

class V2Board extends HTMLElement {
  setConfig(c) { this.cfg = c || {}; this._page = 0; }
  getCardSize() { return 12; }
  set hass(h) { const first = !this._h; this._h = h; if (this._ftr) this._ftr.hass = h; (this._cards || []).forEach((el) => { el.hass = h; }); (this._pops || []).forEach((el) => { el.hass = h; }); if (!this._b) this._build(); if (!this._raf) this._raf = requestAnimationFrame(() => { this._raf = null; this._upd(); }); if (first) this._hist(); }
  _s(e) { return this._h && this._h.states[e]; }
  _call(d, s, data) { return this._h.callService(d, s, data || {}); }
  _more(e) { this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: e }, bubbles: true, composed: true })); }
  _val(it) {
    const s = this._s(it.e); if (!s) return '–'; let v = it.attr ? s.attributes[it.attr] : s.state; if (v == null) return '–';
    if (it.map && it.map[v] != null) return it.map[v];
    const n = parseFloat(v); if (!isNaN(n) && /^-?[\d.]+$/.test(String(v))) return fmtNum(n, it.d) + (it.u != null ? it.u : (it.attr ? '' : (s.attributes.unit_of_measurement ? ' ' + s.attributes.unit_of_measurement : '')));
    if (s.attributes.device_class === 'timestamp' && !it.attr) { const m = Math.round((new Date(v) - Date.now()) / 60000); return Math.abs(m) < 60 ? (m >= 0 ? `dans ${m} min` : `il y a ${-m} min`) : new Date(v).toLocaleString('fr-BE', { weekday: 'short', hour: '2-digit', minute: '2-digit' }); }
    return TR[v] || v;
  }
  _name(it) { const s = this._s(it.e); return it.n || (s && s.attributes.friendly_name) || it.e; }
  _isOn(e) { const s = this._s(e); return !!s && !OFFS.includes(s.state); }

  _build() {
    this._b = true; const r = this.attachShadow({ mode: 'open' });
    r.innerHTML = `<style>
      :host{container-type:inline-size;display:block;--g:rgba(255,255,255,.06);--b:rgba(255,255,255,.09);--t:#f3eee6;--m:rgba(243,238,230,.6);--a:#ffd27a;color:var(--t);font:500 14px system-ui,Roboto,sans-serif}
      *{box-sizing:border-box} button{appearance:none;font:700 12px system-ui,Roboto,sans-serif;color:var(--t);cursor:pointer;border:1px solid var(--b);background:rgba(255,255,255,.06);border-radius:14px;-webkit-tap-highlight-color:transparent;transition:background .2s,border-color .2s,transform .1s}
      button:active{transform:scale(.96)}
      .w{position:relative;isolation:isolate;overflow:hidden;display:grid;gap:12px;padding:10px;border-radius:22px;grid-template-rows:auto minmax(0,1fr) auto;height:calc(100vh - var(--top,56px) - var(--fh,0px) - 1px);min-height:600px;background:radial-gradient(140% 90% at 50% 0%,#121426 0%,#07080f 70%)}
      .w>*{position:relative;z-index:1}
      .bgfx{position:absolute;inset:-20%;z-index:0!important;pointer-events:none;filter:blur(70px) saturate(130%);opacity:.55}
      .bgfx i{position:absolute;border-radius:50%;mix-blend-mode:screen;animation:drift 38s ease-in-out infinite alternate}
      .bgfx i:nth-child(1){width:55%;height:60%;left:2%;top:4%;background:radial-gradient(circle,#ff9a5a,transparent 65%)}
      .bgfx i:nth-child(2){width:52%;height:58%;right:4%;top:18%;background:radial-gradient(circle,#7b5cff,transparent 65%);animation-duration:46s;animation-delay:-12s}
      .bgfx i:nth-child(3){width:44%;height:48%;left:30%;bottom:2%;background:radial-gradient(circle,#1fb6c9,transparent 65%);animation-duration:52s;animation-delay:-24s}
      @keyframes drift{from{transform:translate(0,0) scale(1)}to{transform:translate(6%,5%) scale(1.08)}}
      .vig{position:absolute;inset:0;z-index:0!important;pointer-events:none;background:radial-gradient(120% 100% at 50% 40%,transparent 55%,rgba(0,0,0,.55) 100%)}
      .p{background:var(--g);border:1px solid var(--b);border-radius:20px;padding:12px 14px;min-width:0;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
      .h{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--m);margin:0 0 10px;display:flex;justify-content:space-between;align-items:center;gap:8px}
      .h .hx{cursor:pointer;letter-spacing:0;text-transform:none;color:var(--a);font-weight:700}
      .top{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:10px 14px}
      .tt{font:300 26px/1 system-ui,Roboto,sans-serif;letter-spacing:-.02em;margin-right:6px;display:flex;align-items:center;gap:10px} .tt i{font-style:normal;font-size:24px}
      .kpi{display:flex;gap:6px;flex-wrap:wrap} .kpi span{height:34px;padding:0 12px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid var(--b);display:flex;align-items:center;gap:6px;font-size:12px;color:var(--m);cursor:pointer} .kpi b{color:var(--t);font-weight:700}
      .kpi span.warn{border-color:rgba(255,183,77,.55);color:#ffcf8a} .kpi span.warn b{color:#ffcf8a} .kpi span.ok b{color:#7fe0a8}
      .tabs{display:flex;gap:6px;margin-left:auto;flex-wrap:wrap} .tabs button{height:36px;padding:0 14px;border-radius:999px;font-size:12px} .tabs button.on{background:rgba(255,210,122,.14);border-color:rgba(255,210,122,.6);color:var(--a)}
      .clk{font:300 22px system-ui;color:var(--m);font-variant-numeric:tabular-nums}
      .main{min-height:0;overflow:auto;scrollbar-width:thin;display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--col,340px),1fr));grid-auto-flow:row dense;gap:12px;align-content:start;padding-bottom:4px}
      .t{display:flex;flex-direction:column;min-height:0} .t.s2{grid-column:span 2} .t.s3{grid-column:span 3} .t.full{grid-column:1/-1} .t.r2{grid-row:span 2}
      .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}
      .st{padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.04);cursor:pointer;min-width:0} .st b{display:block;font:300 26px/1.1 system-ui;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .st span{font-size:11px;color:var(--m);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px}
      .st.big b{font-size:40px} .st.warn b{color:#ffcf8a} .st.ok b{color:#7fe0a8} .st.hot b{color:#ff8a65}
      .chips{display:flex;flex-wrap:wrap;gap:6px} .chips button{height:34px;padding:0 12px;border-radius:999px;display:flex;align-items:center;gap:7px;font:600 12px system-ui}
      .chips button i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.18);font-style:normal} .chips button.on{border-color:rgba(255,210,122,.5);background:rgba(255,210,122,.12)} .chips button.on i{background:var(--a);box-shadow:0 0 8px var(--a)} .chips button.na{opacity:.35}
      .list{display:flex;flex-direction:column;gap:5px} .row{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.04);cursor:pointer;min-width:0}
      .row .ic{width:22px;text-align:center} .row .rl{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .row .rv{font:700 13px system-ui;white-space:nowrap;font-variant-numeric:tabular-nums} .row .rv.on{color:var(--a)} .row .rv.warn{color:#ffcf8a} .row .rv.ok{color:#7fe0a8}
      .graph svg{width:100%;height:120px;display:block} .gleg{display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:var(--m);margin-top:6px} .gleg i{display:inline-block;width:10px;height:3px;border-radius:2px;margin-right:5px;vertical-align:middle}
      .cams{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px} .cm{position:relative;aspect-ratio:16/9;border-radius:14px;overflow:hidden;background:#000 center/cover;cursor:pointer;border:1px solid var(--b)} .cm span{position:absolute;left:8px;bottom:6px;font:700 11px system-ui;text-shadow:0 1px 4px #000}
      .btns{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px} .btns button,.dock button{border-radius:14px;padding:10px 4px;font:700 12px system-ui;display:flex;flex-direction:column;align-items:center;gap:4px;white-space:nowrap;overflow:hidden;min-width:0} .btns button i,.dock button i{font-style:normal;font-size:20px} .btns button small,.dock button small{font:500 10px system-ui;color:var(--m);text-align:center;line-height:1.15;white-space:normal}
      .btns button.on,.dock button.on{background:#ffd27a;color:#1c1826;border-color:#ffd27a} .btns button.on small,.dock button.on small{color:#1c1826}
      .dock{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:8px;padding:8px;border-radius:20px;background:var(--g);border:1px solid var(--b);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
      .embed{display:flex;flex-direction:column;gap:8px;--ha-card-background:rgba(255,255,255,.03);--card-background-color:rgba(255,255,255,.03);--ha-card-box-shadow:none;--ha-card-border-width:0;--ha-card-border-radius:14px;--primary-text-color:#f3eee6;--secondary-text-color:rgba(243,238,230,.6);--divider-color:rgba(255,255,255,.08)}
      .t.scroll .bd{overflow:auto;scrollbar-width:thin;max-height:var(--mh,520px)}
      .empty{color:var(--m);font-size:13px}
      .clim{display:grid;grid-template-columns:1fr auto auto auto;gap:8px;align-items:center;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.04)} .clim b{font:300 20px system-ui} .clim button{width:34px;height:34px;border-radius:50%;padding:0;font-size:16px} .clim small{color:var(--m)}
      @container (max-width:900px){.t.s2,.t.s3{grid-column:auto}.w{height:auto}.main{overflow:visible}}
    </style>
    <div class="w"><div class="bgfx"><i></i><i></i><i></i></div><div class="vig"></div>
      <div class="p top"><span class="tt"></span><div class="kpi"></div><div class="tabs"></div><span class="clk"></span></div>
      <div class="main"></div><div class="dock"></div></div>`;
    const $ = (s) => r.querySelector(s); this.$ = $;
    const c = this.cfg; $('.tt').innerHTML = `<i>${c.icon || '🏠'}</i>${c.title || ''}`;
    if (c.col) this.style.setProperty('--col', c.col);
    const pages = c.pages || [{ name: '', tiles: c.tiles || [] }];
    if (pages.length > 1) pages.forEach((p, i) => { const b = document.createElement('button'); b.textContent = (p.icon ? p.icon + ' ' : '') + p.name; b.onclick = () => { this._page = i; this._render(); }; $('.tabs').appendChild(b); });
    this._renderDock(); this._render();
    const fit = () => { const t = Math.max(0, Math.round(this.getBoundingClientRect().top + window.scrollY)); this.style.setProperty('--top', t + 'px'); const ft = this.shadowRoot && this.shadowRoot.querySelector('.ftr'); this.style.setProperty('--fh', (ft ? ft.offsetHeight : 0) + 'px'); };
    this._fit = fit; if (c.footer && !this._fd) { const fd = document.createElement('div'); fd.className = 'ftr'; fd.style.cssText = 'padding-top:4px'; this.shadowRoot.appendChild(fd); this._fd = fd; window.loadCardHelpers().then((hp) => { const el = hp.createCardElement(c.footer); el.hass = this._h; this._ftr = el; fd.appendChild(el); setTimeout(fit, 300); setTimeout(fit, 1500); }); }
    window.addEventListener('resize', fit); requestAnimationFrame(fit); setTimeout(fit, 600); setTimeout(fit, 2000);
    this._tk = setInterval(() => { this._clock(); this._camRefresh(); }, 10000); this._clock();
    this._ht = setInterval(() => this._hist(), 300000);
  }
  disconnectedCallback() { if (this._fit) window.removeEventListener('resize', this._fit); clearInterval(this._tk); clearInterval(this._ht); this._tk = null; }
  connectedCallback() { if (this._b && !this._tk) { this._tk = setInterval(() => { this._clock(); this._camRefresh(); }, 10000); this._ht = setInterval(() => this._hist(), 300000); } }
  _clock() { this.$('.clk').textContent = new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }); }
  _act(a) {
    if (!a) return; if (a.more) return this._more(a.more); if (a.nav) { history.pushState(null, '', a.nav); window.dispatchEvent(new CustomEvent('location-changed')); return; }
    if (a.url) return window.open(a.url, '_blank'); if (a.toggle) return this._call(a.toggle.split('.')[0], 'toggle', { entity_id: a.toggle });
    if (a.service) { const [d, s] = a.service.split('.'); return this._call(d, s, a.data || {}); } if (a.view) return this._viewPop(a.view, a.title);
  }
  _btn(b, el) {
    el.innerHTML = `<i>${b.i || '•'}</i>${b.n || ''}<small>${b.sub || ''}</small>`;
    el.onclick = () => { if (b.confirm && !el._arm) { el._arm = true; el.classList.add('on'); el.querySelector('small').textContent = 'Toucher pour confirmer'; clearTimeout(el._t); el._t = setTimeout(() => { el._arm = false; this._upd(); }, 3000); return; } el._arm = false; this._act(b.a); };
  }
  _renderDock() { const d = this.$('.dock'); const L = this.cfg.dock || []; d.style.display = L.length ? '' : 'none'; this._dockEls = L.map((b) => { const el = document.createElement('button'); this._btn(b, el); d.appendChild(el); return [b, el]; }); }

  _render() {
    const $ = this.$, main = $('.main'); main.innerHTML = ''; this._cards = []; this._els = []; this._graphs = [];
    Array.from($('.tabs').children).forEach((b, i) => b.classList.toggle('on', i === this._page));
    const pages = this.cfg.pages || [{ tiles: this.cfg.tiles || [] }]; const P = pages[this._page] || pages[0];
    (P.tiles || []).forEach((t) => this._tile(t, main)); this._upd(); this._hist(); this._camRefresh();
  }
  _tile(t, main) {
    const d = document.createElement('div'); d.className = 'p t ' + (t.span ? 's' + t.span : '') + (t.full ? ' full' : '') + (t.rows ? ' r' + t.rows : '') + (t.scroll ? ' scroll' : '');
    if (t.mh) d.style.setProperty('--mh', t.mh);
    d.innerHTML = (t.title ? `<div class="h"><span>${t.title}</span>${t.view ? '<span class="hx">Détails ⤢</span>' : ''}</div>` : '') + '<div class="bd"></div>';
    main.appendChild(d); const bd = d.querySelector('.bd');
    if (t.view) d.querySelector('.hx').onclick = () => this._viewPop(t.view, t.title);
    const T = t.type || 'stats';
    if (T === 'stats') { bd.className = 'bd stats'; (t.items || []).forEach((it) => { const e = document.createElement('div'); e.className = 'st' + (t.big ? ' big' : ''); e.innerHTML = '<b></b><span></span>'; e.onclick = () => it.a ? this._act(it.a) : this._more(it.e); bd.appendChild(e); this._els.push(['stat', it, e]); }); }
    else if (T === 'chips') { bd.className = 'bd chips'; (t.items || []).forEach((it) => { const e = document.createElement('button'); e.innerHTML = `<i></i>${it.n || ''}`; e.onclick = () => this._call(it.e.split('.')[0], it.e.startsWith('script.') || it.e.startsWith('scene.') ? 'turn_on' : 'toggle', { entity_id: it.e }); e.oncontextmenu = (ev) => { ev.preventDefault(); this._more(it.e); }; bd.appendChild(e); this._els.push(['chip', it, e]); }); }
    else if (T === 'list') { bd.className = 'bd list'; (t.items || []).forEach((it) => { const e = document.createElement('div'); e.className = 'row'; e.innerHTML = `<span class="ic">${it.i || ''}</span><span class="rl"></span><span class="rv"></span>`; e.onclick = () => it.a ? this._act(it.a) : this._more(it.e); bd.appendChild(e); this._els.push(['row', it, e]); }); }
    else if (T === 'climates') { bd.className = 'bd list'; (t.items || []).forEach((it) => { const e = document.createElement('div'); e.className = 'clim'; e.innerHTML = `<div style="min-width:0"><div class="cn"></div><small class="cs"></small></div><b class="cc"></b><button class="mn">−</button><button class="pl">+</button>`; const st = (dl) => { const s = this._s(it.e); this._call('climate', 'set_temperature', { entity_id: it.e, temperature: Math.round(((s.attributes.temperature || 19) + dl) * 2) / 2 }); }; e.querySelector('.mn').onclick = () => st(-0.5); e.querySelector('.pl').onclick = () => st(0.5); e.querySelector('.cn').onclick = () => this._more(it.e); bd.appendChild(e); this._els.push(['clim', it, e]); }); }
    else if (T === 'buttons') { bd.className = 'bd btns'; (t.items || []).forEach((b) => { const e = document.createElement('button'); this._btn(b, e); bd.appendChild(e); this._els.push(['btn', b, e]); }); }
    else if (T === 'cams') { bd.className = 'bd cams'; (t.items || []).forEach((it) => { const e = document.createElement('div'); e.className = 'cm'; e.innerHTML = '<span></span>'; e.onclick = () => this._more(it.e || it); bd.appendChild(e); this._els.push(['cam', typeof it === 'string' ? { e: it } : it, e]); }); }
    else if (T === 'graph') { bd.className = 'bd graph'; bd.innerHTML = '<svg viewBox="0 0 300 120" preserveAspectRatio="none"></svg><div class="gleg"></div>'; this._graphs.push([t, bd]); }
    else if (T === 'cards') { bd.className = 'bd embed'; window.loadCardHelpers().then((hp) => { (t.cards || []).forEach((cfg) => { const c = { ...cfg }; delete c.visibility; try { const el = hp.createCardElement(c); el.hass = this._h; this._cards.push(el); bd.appendChild(el); } catch (err) { /* ignore */ } }); }); }
  }
  _upd() {
    if (!this._h || !this._b) return; const $ = this.$;
    // KPI
    const kp = $('.kpi'); const K = this.cfg.kpi || []; if (kp.children.length !== K.length) { kp.innerHTML = ''; K.forEach((k) => { const s = document.createElement('span'); s.onclick = () => k.a ? this._act(k.a) : this._more(k.e); kp.appendChild(s); }); }
    K.forEach((k, i) => { const el = kp.children[i]; const s = this._s(k.e); el.innerHTML = `${k.i || ''} <b>${this._val(k)}</b> ${k.n || ''}`; el.className = this._cls(k, s); });
    (this._els || []).forEach(([type, it, e]) => {
      const s = this._s(it.e);
      if (type === 'stat') { e.querySelector('b').textContent = this._val(it); e.querySelector('span').textContent = this._name(it); e.className = 'st' + (e.classList.contains('big') ? ' big' : '') + ' ' + this._cls(it, s); }
      else if (type === 'chip') { e.classList.toggle('on', !!s && s.state === 'on'); e.classList.toggle('na', !s || s.state === 'unavailable'); if (!it.n) e.lastChild.textContent = this._name(it); }
      else if (type === 'row') { e.querySelector('.rl').textContent = this._name(it); const v = e.querySelector('.rv'); v.textContent = this._val(it); v.className = 'rv ' + this._cls(it, s) + (it.hl !== false && s && ['on', 'open', 'unlocked', 'playing', 'home'].includes(s.state) ? ' on' : ''); }
      else if (type === 'clim' && s) { const A = s.attributes; e.querySelector('.cn').textContent = this._name(it); e.querySelector('.cs').textContent = `${A.current_temperature != null ? fmtNum(A.current_temperature) + '° · ' : ''}${TR[s.state] || s.state}${A.preset_mode ? ' · ' + A.preset_mode : ''}${A.hvac_action === 'heating' ? ' · 🔥' : ''}`; e.querySelector('.cc').textContent = (A.temperature ?? '–') + '°'; }
      else if (type === 'btn' && it.on && !e._arm) { e.classList.toggle('on', this._isOn(it.on)); }
    });
    (this._dockEls || []).forEach(([b, el]) => { if (b.on && !el._arm) el.classList.toggle('on', this._isOn(b.on)); if (b.subE && !el._arm) el.querySelector('small').textContent = this._val({ e: b.subE }); });
  }
  _cls(k, s) { if (!s) return ''; const v = parseFloat(s.state); if (k.warn != null) { if (typeof k.warn === 'number' ? v >= k.warn : String(k.warn).split('|').includes(s.state)) return 'warn'; } if (k.ok != null && String(k.ok).split('|').includes(s.state)) return 'ok'; if (k.hot != null && v >= k.hot) return 'hot'; return ''; }
  _camRefresh() { (this._els || []).filter(([t]) => t === 'cam').forEach(([, it, e]) => { const s = this._s(it.e); if (!s || !s.attributes.entity_picture) return; e.style.backgroundImage = `url("${s.attributes.entity_picture}&t=${Date.now()}")`; e.querySelector('span').textContent = it.n || s.attributes.friendly_name || ''; }); }
  async _hist() {
    if (!this._h || !(this._graphs || []).length) return;
    const COL = ['#ffd27a', '#7b5cff', '#1fb6c9', '#ff8a65', '#7fe0a8'];
    for (const [t, bd] of this._graphs) {
      const ents = t.items.map((x) => x.e || x); const hrs = t.hours || 24; const start = new Date(Date.now() - hrs * 3600000).toISOString();
      try {
        const res = await this._h.callWS({ type: 'history/history_during_period', start_time: start, entity_ids: ents, minimal_response: true, no_attributes: true });
        let mn = Infinity, mx = -Infinity; const series = ents.map((e) => (res[e] || []).map((p) => [p.lu != null ? p.lu * 1000 : (p.lc != null ? p.lc * 1000 : new Date(p.last_updated || p.last_changed).getTime()), parseFloat(p.s ?? p.state)]).filter((p) => !isNaN(p[1])));
        series.forEach((sr) => sr.forEach((p) => { mn = Math.min(mn, p[1]); mx = Math.max(mx, p[1]); })); if (!isFinite(mn)) { bd.querySelector('svg').innerHTML = ''; continue; }
        if (t.zero) mn = Math.min(0, mn); const pad = (mx - mn) * 0.1 || 1; mn -= pad; mx += pad; const t0 = Date.now() - hrs * 3600000;
        const X = (x) => ((x - t0) / (hrs * 3600000)) * 300, Y = (y) => 115 - ((y - mn) / (mx - mn)) * 110;
        let svg = ''; series.forEach((sr, i) => { if (!sr.length) return; const pts = sr.map((p) => `${X(Math.max(p[0], t0)).toFixed(1)},${Y(p[1]).toFixed(1)}`); pts.push(`300,${Y(sr[sr.length - 1][1]).toFixed(1)}`);
          if (i === 0) svg += `<path d="M${pts[0].split(',')[0]},120 L${pts.join(' L')} L300,120 Z" fill="${COL[i]}" opacity=".12"/>`; svg += `<polyline points="${pts.join(' ')}" fill="none" stroke="${COL[i]}" stroke-width="1.8" vector-effect="non-scaling-stroke"/>`; });
        bd.querySelector('svg').innerHTML = svg;
        bd.querySelector('.gleg').innerHTML = t.items.map((x, i) => { const e = x.e || x; const s = this._s(e); return `<span><i style="background:${COL[i]}"></i>${x.n || (s && s.attributes.friendly_name) || e} · <b style="color:var(--t)">${this._val({ e, u: x.u })}</b></span>`; }).join('') + `<span style="margin-left:auto">${hrs} h · min ${fmtNum(mn + pad)} · max ${fmtNum(mx - pad)}</span>`;
      } catch (e) { bd.querySelector('.gleg').textContent = 'Historique indisponible'; }
    }
  }
  async _viewPop(path, title) {
    const old = document.querySelector('.v2pop'); if (old) old.remove();
    const o = document.createElement('div'); o.className = 'v2pop';
    o.style.cssText = 'position:fixed;inset:0;z-index:997;background:rgba(5,6,12,.66);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center';
    o.innerHTML = `<div style="background:linear-gradient(160deg,#1f1c30,#12111c);color:#f3eee6;border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:14px;width:min(1300px,96vw);height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.7);font-family:system-ui,Roboto,sans-serif"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><b style="flex:1;font-size:18px;font-weight:500">${title || 'Détails'}</b><button class="x" style="border:none;border-radius:12px;background:rgba(255,255,255,.08);color:#fff;padding:9px 13px;font-size:15px;cursor:pointer">✕</button></div><div class="bd" style="flex:1;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:12px;align-items:start">Chargement…</div></div>`;
    const close = () => { o.remove(); this._pops = []; }; o.onclick = (ev) => { if (ev.target === o) close(); }; o.querySelector('.x').onclick = close;
    o.style.pointerEvents = 'none'; setTimeout(() => { o.style.pointerEvents = ''; }, 450); document.body.appendChild(o); this._pops = [];
    const bd = o.querySelector('.bd');
    try {
      const [dash, vp] = path.split('/'); const cfg = await this._h.callWS({ type: 'lovelace/config', url_path: dash }); const v = cfg.views.find((x) => x.path === vp) || cfg.views[+vp] || cfg.views[0];
      const hp = await window.loadCardHelpers(); bd.innerHTML = '';
      const secs = v.sections ? v.sections.map((s) => ({ type: 'vertical-stack', cards: s.cards || [] })) : (v.cards || []);
      if (v.type === 'panel' && secs.length === 1) bd.style.gridTemplateColumns = '1fr';
      for (const s of secs) { const el = hp.createCardElement(s); el.hass = this._h; this._pops.push(el); bd.appendChild(el); }
    } catch (e) { bd.textContent = 'Indisponible : ' + e.message; }
  }
}
if (!customElements.get('v2-board')) customElements.define('v2-board', V2Board);
window.customCards = window.customCards || []; window.customCards.push({ type: 'v2-board', name: 'V2 Board (design Accueil)' });
