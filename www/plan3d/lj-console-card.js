/* Console Light Jockey — une seule vue, sans défilement : scène, sélection des projecteurs,
   couleur (palette + mélange rouge / jaune / bleu), faders, effets, banques de sets, sortie. */
const FIX = [
  ['dmx_lg', 'light.salle_a_manger_lg', 'LUS 1'], ['dmx_lc', 'light.salle_a_manger_lc', 'LUS 2'], ['dmx_ld', 'light.salle_a_manger_ld', 'LUS 3'],
  ['dmx_vit_g', 'light.salle_a_manger_vit_g', 'VIT G'], ['dmx_vit_d', 'light.salle_a_manger_vit_d', 'VIT D'],
  ['dmx_panneau', 'light.salon_panneau_mural', 'PANNEAU'], ['dmx_ambilight', 'light.salon_ambilight_tv', 'AMBI TV'],
  ['dmx_dj_g', 'light.coin_dj_sono_gauche', 'DJ G'], ['dmx_dj_d', 'light.coin_dj_sono_droite', 'DJ D'],
];
const PAL = [['Blanc', '#ffffff'], ['Rouge', '#ff2020'], ['Orange', '#ff7a10'], ['Ambre', '#ffb020'], ['Jaune', '#ffe81a'], ['Vert', '#20ff40'],
  ['Turquoise', '#10b8ff'], ['Bleu', '#2038ff'], ['Violet', '#ff20ff'], ['UV', '#5a20ff'], ['Magenta', '#ff1a8c'], ['Rose', '#ff9a9a']];
const SEL = 'input_select.sono_lumieres', FXS = 'input_select.sono_effet', EFS = 'input_select.strobe_mode';
const SETS = [
  ['🔊 Hard techno', 'HARD TECHNO', '#ff0000', '#ffffff'], ['🎛️ Tech house', 'TECH HOUSE', '#003cff', '#00dcc8'], ['🥁 Afro house', 'AFRO HOUSE', '#ff8c00', '#ff4600'],
  ['🌙 Ambiance chill', 'CHILL', '#00b4c8', '#643cff'], ['📼 Rétro techno', 'RÉTRO TECHNO', '#78ff00', '#fff000'], ['💜 RnB', 'RNB', '#8c00ff', '#ff008c'], ['🕹️ Années 80', 'ANNÉES 80', '#ff1496', '#0078ff'],
  ['⚡ Universel · Strobe blanc', 'STROBE BLANC', '#ffffff', '#888888'], ['🔴 Universel · Bleu nuit & rouge', 'BLEU / ROUGE', '#0000aa', '#ff0000'], ['🟡 Universel · Jaune & bleu ciel', 'JAUNE / CIEL', '#ffc800', '#50c8ff'],
  ['🟣 Universel · Magenta & cyan', 'MAGENTA / CYAN', '#ff00aa', '#00e6ff'], ['🟢 Universel · Laser vert & UV', 'LASER / UV', '#3cff00', '#4600ff'], ['🟠 Universel · Ambre & violet', 'AMBRE / VIOLET', '#ff6e00', '#6e00ff'],
  ['❤️ Universel · Pulse rouge', 'PULSE ROUGE', '#ff0000', '#590000'], ['❄️ Universel · Flash blanc & bleu', 'FLASH BLEU', '#ffffff', '#0028ff'], ['🌈 Universel · Chase arc-en-ciel', 'ARC-EN-CIEL', '#ff0000', '#00a0ff'],
  ['🔥 Universel · Feu & or', 'FEU & OR', '#ff1900', '#ff8c00'], ['🌊 Universel · Océan profond', 'OCÉAN', '#0019be', '#00aaff'], ['🏰 Show · Tomorrowland main stage', 'TOMORROWLAND', '#ffaa1e', '#e600c8'],
  ['🖤 Show · Afterlife (blanc glacial & rouge)', 'AFTERLIFE', '#dcebff', '#c80000'], ['🧊 Show · Anyma cyber néon', 'ANYMA', '#00f0ff', '#ff00aa'], ['🔺 Show · Daft Punk pyramide', 'DAFT PUNK', '#ff0000', '#003cff'],
  ['💙 Show · Swedish House Mafia', 'SHM', '#005aff', '#ffffff'], ['🦇 Show · Berghain (rouge sombre)', 'BERGHAIN', '#c80000', '#2a0000'], ['🟥 Show · Hardstyle Defqon (rouge & blanc)', 'DEFQON', '#ff0000', '#ffffff'],
  ['🎆 Show · Coldplay bracelets', 'COLDPLAY', '#ff005a', '#ffc800'], ['🌅 Show · Ibiza sunset', 'IBIZA', '#ff5a00', '#ff2878'],
];
const FX = [['Aucun', 'AUCUN'], ['⚡ Strobe blanc', 'STROBE'], ['🟣 Black light (UV)', 'BLACK LIGHT'], ['💥 Blinder (flash chaud toutes les 4)', 'BLINDER'], ['⬛ Blackout (coupures sur le temps)', 'BLACKOUT /T']];
const EFF = [['Aucun (couleur + flash)', 'FIXE'], ['🫁 Pulse (respiration)', 'PULSE'], ['🏃 Chase (de projecteur en projecteur)', 'CHASE'], ['🌈 Arc-en-ciel', 'RAINBOW'],
  ['💥 Rafales', 'RAFALES'], ['🌩️ Éclairs', 'ÉCLAIRS'], ['🥁 Strobe sync tempo', 'SYNC BPM']];
const FADERS = [
  ['input_number.dmx_rouge', 'R', '#ff3b3b'], ['input_number.dmx_jaune', 'J', '#ffd21a'], ['input_number.dmx_bleu', 'B', '#3b6bff'],
  ['input_number.strobe_intensite', 'DIM', '#f3ead8'], ['input_number.dmx_flash', 'FLASH', '#ffffff'],
  ['input_number.sono_intensite', 'MASTER', '#ff9d2e'], ['input_number.sono_tempo', 'BPM', '#5dff8a'],
];

class LjConsoleCard extends HTMLElement {
  setConfig(c) { this.cfg = c || {}; }
  getCardSize() { return 12; }
  getGridOptions() { return { columns: 'full', rows: 'auto' }; }
  set hass(h) {
    this._h = h;
    if (!this._built) this._build();
    if (!this._raf) this._raf = requestAnimationFrame(() => { this._raf = null; this._update(); });
  }
  _st(e) { return this._h && this._h.states[e]; }
  _call(d, s, data, target) { return this._h.callService(d, s, data || {}, target); }
  _sel(ent, opt) { this._call('input_select', 'select_option', { option: opt }, { entity_id: ent }); }
  _build() {
    this._built = true;
    const r = this.attachShadow({ mode: 'open' });
    r.innerHTML = `<style>
      :host{--bg:#07080c;--pn:#10121a;--pn2:#171a25;--ln:#262a38;--tx:#e9e6df;--mu:#8b8fa3;--ac:#ff9d2e;--ok:#3ddc6e;--ko:#ff4d4d;display:block}
      .c{box-sizing:border-box;height:calc(100vh - var(--header-height,56px) - 8px);min-height:520px;background:var(--bg);color:var(--tx);font:500 12px/1.2 'Rajdhani','Barlow Condensed','Roboto Condensed',system-ui,sans-serif;
        display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr) minmax(0,1.05fr);grid-template-rows:minmax(0,1fr) auto;gap:8px;padding:8px;overflow:hidden;letter-spacing:.03em}
      .p{background:var(--pn);border:1px solid var(--ln);border-radius:10px;padding:8px;display:flex;flex-direction:column;gap:6px;min-height:0;min-width:0;overflow:hidden}
      .h{display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.14em}
      .h b{color:var(--ac)}
      button{font:inherit;color:inherit;cursor:pointer;border:1px solid var(--ln);background:var(--pn2);border-radius:7px;padding:0;min-width:0;transition:transform .06s,box-shadow .15s,background .15s}
      button:active{transform:scale(.96)} button:focus-visible{outline:2px solid var(--ac)}
      .stage{flex:1;min-height:0;position:relative;border-radius:8px;background:radial-gradient(ellipse at 50% 120%,#1a1d2b,#05060a 70%);border:1px solid var(--ln)}
      .fx{position:absolute;display:flex;flex-direction:column;align-items:center;gap:3px;transform:translate(-50%,-50%);background:none;border:0}
      .fx .l{width:clamp(22px,3.2vw,40px);height:clamp(22px,3.2vw,40px);border-radius:50%;background:#222;border:2px solid #333;transition:background .25s,box-shadow .25s}
      .fx.bar .l{width:clamp(70px,11vw,150px);height:12px;border-radius:6px} .fx.tall .l{width:14px;height:clamp(34px,5vw,60px);border-radius:5px}
      .fx .n{font-size:10px;color:var(--mu);font-weight:700} .fx.sel .l{border-color:var(--ac);outline:2px solid var(--ac);outline-offset:3px} .fx.sel .n{color:var(--ac)}
      .row{display:grid;gap:5px} .fix{grid-template-columns:repeat(9,minmax(0,1fr))} .fix button{height:34px;font-size:10px;font-weight:700;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
      .fix button i{width:10px;height:10px;border-radius:50%;background:#333;display:block} .fix button{position:relative} .fix button[data-tag]:not([data-tag=''])::after{content:attr(data-tag);position:absolute;top:1px;right:3px;font-size:8px;color:#7fd8ff} .fix button.on{border-color:var(--ac);background:#2a1d0d;color:var(--ac)}
      .two{grid-template-columns:1fr 1fr} .two button{height:28px;font-weight:700}
      .pal{grid-template-columns:repeat(6,minmax(0,1fr))} .pal button{height:30px;border-radius:50px;border:2px solid #000;box-shadow:inset 0 -6px 10px rgba(0,0,0,.35)}
      .pal button.on{outline:2px solid #fff;outline-offset:2px}
      .mix{display:flex;gap:8px;align-items:stretch;flex:1;min-height:0}
      .fd{flex:1;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;min-height:0}
      .f{display:flex;flex-direction:column;align-items:center;gap:4px;min-height:0;background:var(--pn2);border:1px solid var(--ln);border-radius:7px;padding:5px 2px}
      .f .v{font-size:12px;font-weight:700;font-variant-numeric:tabular-nums} .f .k{font-size:10px;font-weight:700;color:var(--mu)}
      .f input{writing-mode:vertical-lr;direction:rtl;flex:1;min-height:40px;width:22px;margin:0;accent-color:var(--c)}
      .prev{width:clamp(48px,6vw,80px);border-radius:8px;border:1px solid var(--ln);display:flex;align-items:flex-end;justify-content:center;font-size:10px;font-weight:700;color:#000;padding-bottom:4px}
      .eff{grid-template-columns:repeat(7,minmax(0,1fr))} .eff button,.fxr button{height:30px;font-size:10px;font-weight:700}
      .eff button.on,.fxr button.on{background:#0f2a3a;border-color:#2ab8ff;color:#7fd8ff}
      .fxr{grid-template-columns:repeat(5,minmax(0,1fr))}
      .out{grid-template-columns:1.2fr 1.2fr 1fr} .out button{height:46px;font-size:15px;font-weight:800;letter-spacing:.12em}
      .go{background:#0d2a17;border-color:#1f8f45;color:#6dffa0} .go.on{background:#1fae4a;color:#04170a;box-shadow:0 0 18px #1fae4a}
      .bo{background:#1a1a1f;border-color:#555;color:#ccc} .bo.on{background:#000;color:#fff;box-shadow:0 0 0 2px #fff inset}
      .rel{color:var(--mu)}
      .bank{grid-column:1/-1;display:flex;flex-direction:column;gap:6px}
      .sets{display:grid;grid-template-columns:repeat(14,minmax(0,1fr));gap:4px}
      .sets button{height:42px;font-size:10px;font-weight:700;line-height:1.05;padding:2px;position:relative;overflow:hidden;background:linear-gradient(135deg,var(--a) 0 50%,var(--b) 50% 100%);color:#fff;text-shadow:0 1px 3px #000,0 0 6px #000;border-color:#000}
      .sets button::after{content:'';position:absolute;inset:0;background:rgba(0,0,0,.45);transition:background .2s} .sets button span{position:relative;z-index:1}
      .sets button.on{outline:2px solid #fff;outline-offset:1px} .sets button.on::after{background:rgba(0,0,0,.05)}
      .sets button.stop{background:#26272e} .sets button.stop::after{display:none}
      .stat{display:flex;gap:12px;align-items:center;font-size:11px;color:var(--mu);font-weight:700;white-space:nowrap;overflow:hidden}
      .stat b{color:var(--tx)} .live{color:var(--ko)} .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--ko);margin-right:4px;animation:bl 1s infinite}
      @keyframes bl{50%{opacity:.2}} @media (prefers-reduced-motion:reduce){.dot{animation:none}}
      @media (max-width:900px){.c{height:auto;grid-template-columns:1fr;overflow:visible}.sets{grid-template-columns:repeat(7,minmax(0,1fr))}}
    </style>
    <div class="c">
      <div class="p"><div class="h">Scène · projecteurs <b class="nsel">0 sélectionné</b></div>
        <div class="stage"></div>
        <div class="row fix"></div>
        <div class="row two"><button class="all">TOUT SÉLECTIONNER</button><button class="none">AUCUN</button></div>
      </div>
      <div class="p"><div class="h">Couleur <b>palette ou mélange R · J · B</b></div>
        <div class="row pal"></div>
        <div class="mix"><div class="fd"></div><div class="prev">MIX</div></div>
      </div>
      <div class="p"><div class="h">Programmeur · effet</div>
        <div class="row eff"></div>
        <div class="h">FX sur le set musical</div>
        <div class="row fxr"></div>
        <div class="h">Sortie programmeur <b class="ost">LIBRE</b></div>
        <div class="row out"><button class="go">● ALLUMÉ</button><button class="bo">■ BLACKOUT</button><button class="rel">↩ LIBÉRER</button></div>
      </div>
      <div class="p bank"><div class="h"><span>Banque de sets musicaux</span><span class="stat"></span></div><div class="sets"></div></div>
    </div>`;
    this.$ = (s) => r.querySelector(s);
    // scène : positions en % (plan de la pièce de vie vue de dessus)
    const POS = { dmx_dj_g: [8, 30, ''], dmx_dj_d: [20, 30, ''], dmx_ambilight: [52, 14, 'bar'], dmx_panneau: [52, 34, 'bar'],
      dmx_vit_g: [82, 22, 'tall'], dmx_vit_d: [92, 22, 'tall'], dmx_lg: [38, 72, ''], dmx_lc: [52, 72, ''], dmx_ld: [66, 72, ''] };
    const stage = this.$('.stage'), fix = this.$('.fix');
    FIX.forEach(([k, e, n]) => {
      const [x, y, cls] = POS[k]; const b = document.createElement('button'); b.className = 'fx ' + cls; b.style.left = x + '%'; b.style.top = y + '%';
      b.innerHTML = `<span class="l"></span><span class="n">${n}</span>`; b.onclick = () => this._call('input_boolean', 'toggle', {}, { entity_id: 'input_boolean.' + k }); b.dataset.k = k; stage.appendChild(b);
      const p = document.createElement('button'); p.innerHTML = `<i></i>${n}`; p.dataset.k = k; p.onclick = b.onclick; fix.appendChild(p);
    });
    const FE = FIX.map((f) => 'input_boolean.' + f[0]);
    this.$('.all').onclick = () => this._call('input_boolean', 'turn_on', {}, { entity_id: FE });
    this.$('.none').onclick = () => this._call('input_boolean', 'turn_off', {}, { entity_id: FE });
    const pal = this.$('.pal');
    PAL.forEach(([n, c]) => { const b = document.createElement('button'); b.style.background = c; b.title = n; b.setAttribute('aria-label', n); b.dataset.n = n;
      b.onclick = () => { this._pal = n; this._call('script', 'turn_on', { variables: { nom: n } }, { entity_id: 'script.dmx_couleur' }); }; pal.appendChild(b); });
    const fd = this.$('.fd');
    FADERS.forEach(([e, k, c]) => { const d = document.createElement('div'); d.className = 'f'; d.style.setProperty('--c', c);
      d.innerHTML = `<span class="v">–</span><input type="range" aria-label="${k}"><span class="k" style="color:${c}">${k}</span>`; const i = d.querySelector('input');
      i.oninput = () => { d.querySelector('.v').textContent = i.value; i._busy = true; };
      i.onchange = () => { i._busy = false; this._call('input_number', 'set_value', { value: +i.value }, { entity_id: e }); };
      d.dataset.e = e; fd.appendChild(d); });
    const eff = this.$('.eff'); EFF.forEach(([o, l]) => { const b = document.createElement('button'); b.textContent = l; b.dataset.o = o; b.onclick = () => this._sel(EFS, o); eff.appendChild(b); });
    const fxr = this.$('.fxr'); FX.forEach(([o, l]) => { const b = document.createElement('button'); b.textContent = l; b.dataset.o = o; b.onclick = () => this._sel(FXS, o); fxr.appendChild(b); });
    const dm = (m) => this._call('script', 'turn_on', { variables: { mode: m } }, { entity_id: 'script.dmx_mode' });
    this.$('.go').onclick = () => dm('allume'); this.$('.bo').onclick = () => dm('blackout'); this.$('.rel').onclick = () => dm('liberer');
    const sets = this.$('.sets');
    const stop = document.createElement('button'); stop.className = 'stop'; stop.innerHTML = '<span>■ STOP<br>SET</span>'; stop.onclick = () => this._call('script', 'turn_on', {}, { entity_id: 'script.sono_stop_eteindre' }); sets.appendChild(stop);
    SETS.forEach(([o, l, a, b2]) => { const b = document.createElement('button'); b.style.setProperty('--a', a); b.style.setProperty('--b', b2); b.innerHTML = `<span>${l}</span>`; b.dataset.o = o;
      b.onclick = () => this._sel(SEL, o); sets.appendChild(b); });
  }
  _rgb(e) { const s = this._st(e); if (!s || s.state !== 'on') return null; const c = s.attributes.rgb_color || [255, 220, 170]; const b = (s.attributes.brightness || 255) / 255; return [c, b]; }
  _update() {
    if (!this.$) return;
    let n = 0;
    FIX.forEach(([k, e]) => {
      const on = (this._st('input_boolean.' + k) || {}).state === 'on'; if (on) n++;
      const v = this._rgb(e); const col = v ? `rgb(${v[0].join(',')})` : '#1c1e26';
      const glow = v ? `0 0 ${Math.round(8 + 22 * v[1])}px rgba(${v[0].join(',')},${(0.35 + 0.6 * v[1]).toFixed(2)})` : 'none';
      this.shadowRoot.querySelectorAll(`[data-k="${k}"]`).forEach((b) => {
        b.classList.toggle('sel', on); b.classList.toggle('on', on);
        const l = b.querySelector('.l, i'); if (l) { l.style.background = col; l.style.boxShadow = glow; l.style.opacity = v ? (0.35 + 0.65 * v[1]) : 1; }
      });
    });
    this.$('.nsel').textContent = n + (n > 1 ? ' sélectionnés' : ' sélectionné');
    this.shadowRoot.querySelectorAll('.f').forEach((d) => { const s = this._st(d.dataset.e); if (!s) return; const i = d.querySelector('input');
      if (!i._busy) { i.min = s.attributes.min; i.max = s.attributes.max; i.step = s.attributes.step; i.value = s.state; d.querySelector('.v').textContent = Math.round(+s.state); } });
    const mix = this._st('sensor.console_dmx_couleur'); if (mix) { const p = this.$('.prev'); p.style.background = `rgb(${mix.state})`; p.style.boxShadow = `0 0 20px rgb(${mix.state})`; }
    const eS = (this._st(EFS) || {}).state, fS = (this._st(FXS) || {}).state, sS = (this._st(SEL) || {}).state || '';
    this.shadowRoot.querySelectorAll('.eff button').forEach((b) => b.classList.toggle('on', b.dataset.o === eS));
    this.shadowRoot.querySelectorAll('.fxr button').forEach((b) => b.classList.toggle('on', b.dataset.o === fS));
    this.shadowRoot.querySelectorAll('.sets button[data-o]').forEach((b) => b.classList.toggle('on', b.dataset.o === sS));
    let nOn = 0, nOff = 0;
    FIX.forEach(([k]) => { const t = (this._st('input_text.' + k) || {}).state || ''; let p = null; try { p = t ? JSON.parse(t) : null; } catch (e) {}
      const tag = p ? (p.m === 'off' ? 'BO' : (p.f > 0 || p.e !== 'fixe' ? 'FX' : 'ON')) : '';
      if (p && p.m === 'off') nOff++; else if (p) nOn++;
      this.shadowRoot.querySelectorAll(`.fix [data-k="${k}"]`).forEach((b) => { b.dataset.tag = tag; }); });
    this.$('.go').classList.toggle('on', nOn > 0); this.$('.bo').classList.toggle('on', nOff > 0);
    this.$('.ost').textContent = (nOn || nOff) ? `${nOn} allumé${nOn > 1 ? 's' : ''} · ${nOff} blackout` : 'TOUT RENDU AU SET';
    const live = !sS.startsWith('—'); const bpm = Math.round(+((this._st('input_number.sono_tempo') || {}).state || 0));
    this.$('.stat').innerHTML = (live ? `<span class="live"><span class="dot"></span>LIVE</span> <b>${sS.replace(/^\S+\s/, '')}</b>` : '<span>AUCUN SET</span>')
      + ` · <b>${bpm}</b> BPM · FX <b>${(fS || 'Aucun').replace(/ \(.*\)/, '')}</b>`;
  }
}
customElements.define('lj-console-card', LjConsoleCard);
window.customCards = window.customCards || []; window.customCards.push({ type: 'lj-console-card', name: 'Console Light Jockey' });
