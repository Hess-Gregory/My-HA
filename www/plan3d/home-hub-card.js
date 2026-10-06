/* Accueil 3D — tableau de bord plein écran (sans défilement) autour du plan 3D interactif */
const WX = { 'clear-night': ['🌙', 'Nuit claire'], cloudy: ['☁️', 'Nuageux'], exceptional: ['⚠️', 'Exceptionnel'], fog: ['🌫️', 'Brouillard'], hail: ['🌨️', 'Grêle'], lightning: ['🌩️', 'Orage'],
  'lightning-rainy': ['⛈️', 'Orage pluvieux'], partlycloudy: ['⛅', 'Éclaircies'], pouring: ['🌧️', 'Averses'], rainy: ['🌦️', 'Pluie'], snowy: ['❄️', 'Neige'], 'snowy-rainy': ['🌨️', 'Neige fondue'], sunny: ['☀️', 'Ensoleillé'], windy: ['💨', 'Venteux'], 'windy-variant': ['💨', 'Venteux'] };
const ROOMS = [['Pièce de vie', 'piece_de_vie_sonoff_a480146b56', 'climate.living', 'piece_de_vie', 'piece-de-vie'], ['Couloir & entrée', 'couloir_sonoff_a480146b60', 'climate.couloir', 'couloir', 'couloir-entree'],
  ['Chambre enfants', 'chambre_enfants_sonoff_a480146b58', 'climate.chambre_enfants', 'chambre_enfants', 'chambre-enfants'], ['Chambre parents', 'chambre_adulte_sonoff_a480146b5b', 'climate.chambre_adulte', 'chambre_adulte', 'chambre-parents'],
  ['Salle de bain', 'salle_de_bain_sonoff_a480146b5d', 'climate.salle_de_bain', 'salle_de_bain', 'salle-de-bain']];
const ACTIONS = [['bonne_nuit', '🌙', 'Bonne nuit', 'Éteint tout', null], ['je_pars', '🚪', 'Je pars', 'Alarme + éco', 'L’alarme passera en TOTAL dans 60 s'], ['retour', '🏡', 'Retour', 'Chauffage confort', null],
  ['sieste_calme', '🤫', 'Sieste / Calme', 'Coupe le coin DJ', null], ['tout_eteindre', '⚫', 'Tout éteindre', 'Toutes les lumières', 'Éteindre toutes les lumières ?']];
const PEOPLE = [['person.greg', 'Greg'], ['person.sandrine', 'Sandrine'], ['person.matteo', 'Matteo']];
const ALARM = 'alarm_control_panel.buanderie_local_tech_centrale_alarme_ajax_maison';
const MP_CAL = 'calendar.matteo', MP_PATH = '/matteo-planning/planning';
const SAS = 'lock.hall_dentree_bticino_intercom_greg_et_sandrine_serrure';
const POWER = 'sensor.buanderie_local_tech_compteur_general_maison_puissance', TODAY = 'sensor.buanderie_local_tech_compteur_general_maison_aujourd_hui';

class HomeHubCard extends HTMLElement {
  setConfig(c) { this.cfg = c || {}; }
  getCardSize() { return 20; }
  set hass(h) { this._h = h; if (!this._built) this._build(); if (this.plan) this.plan.hass = h; this._render(); }
  connectedCallback() { this._tick = setInterval(() => this._clock(), 1000); }
  disconnectedCallback() { clearInterval(this._tick); clearInterval(this._calT); if (this._unsub) { this._unsub.then((u) => u()).catch(() => {}); this._unsub = null; } }

  _build() {
    this._built = true; const r = this.attachShadow({ mode: 'open' });
    r.innerHTML = `<style>
      :host{display:block;--g:rgba(255,255,255,.06);--b:rgba(255,255,255,.09);--t:#f3eee6;--m:rgba(243,238,230,.6);--a:#ffd27a}
      .hub{height:calc(100vh - var(--header-height,56px) - 16px);min-height:560px;display:grid;grid-template-columns:minmax(250px,22%) 1fr minmax(260px,23%);gap:12px;padding:10px;box-sizing:border-box;isolation:isolate;
        --o1:#ff9a5a;--o2:#7b5cff;--o3:#1fb6c9;--bg0:#121426;--bg1:#07080f;
        background:radial-gradient(140% 90% at 50% 0%,var(--bg0) 0%,var(--bg1) 70%);transition:background 2s;color:var(--t);font:500 14px system-ui,Roboto,sans-serif;border-radius:22px;overflow:hidden}
      .col{display:flex;flex-direction:column;gap:12px;min-height:0;overflow:hidden}
      .tile{background:var(--g);border:1px solid var(--b);border-radius:20px;padding:14px 16px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);min-height:0}
      .h{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--m);margin:0 0 8px;display:flex;justify-content:space-between;align-items:center}
      .clock{font:200 clamp(54px,6.2vw,92px)/0.95 system-ui,Roboto,sans-serif;letter-spacing:-.03em}.clock small{font-size:.32em;font-weight:300;color:var(--m);margin-left:4px}
      .date{font-size:15px;color:var(--m);margin-top:6px;text-transform:capitalize}.hello{font-size:17px;margin-top:10px}
      .wnow{display:flex;align-items:center;gap:12px}.wico{font-size:46px;line-height:1}.wt{font:300 40px/1 system-ui}.wt small{font-size:15px;color:var(--m);display:block;margin-top:4px}
      .wmeta{display:flex;gap:12px;color:var(--m);font-size:12px;margin-top:8px;white-space:nowrap}.wind i{display:inline-block;font-style:normal;color:#9fd3ff;transform-origin:50% 50%;margin-right:2px;transition:transform .8s}
      .fc{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:10px;text-align:center;font-size:12px}.fc div{background:rgba(255,255,255,.04);border-radius:12px;padding:6px 0}.fc b{display:block;font-size:18px;margin:2px 0}.fc i{font-style:normal;color:var(--m)}
      .ppl{display:flex;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid var(--b)}.p{flex:1;text-align:center;font-size:11px;color:var(--m)}.p small{display:none}.av{width:34px;height:34px;margin:0 auto 4px;font-size:14px!important;border-radius:50%;display:grid;place-items:center;font:700 17px system-ui;color:#1c1826;background:#5b5d6b;transition:.3s;box-shadow:0 0 0 3px rgba(255,255,255,.06)}
      .p.on .av{background:linear-gradient(135deg,#8be3a5,#3fbf7f);box-shadow:0 0 0 3px rgba(63,191,127,.35),0 0 18px rgba(63,191,127,.45)}.p.on{color:var(--t)}
      .alarm{display:flex;align-items:center;gap:12px;cursor:pointer}.al-i{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;font-size:22px;background:rgba(255,255,255,.08)}
      .alarm.armed .al-i{background:linear-gradient(135deg,#ff8a7a,#e0452f);box-shadow:0 0 20px rgba(224,69,47,.5)}.alarm.off .al-i{background:linear-gradient(135deg,#8be3a5,#3fbf7f)}
      .al-t{font-size:17px;font-weight:700}.al-s{font-size:12px;color:var(--m)}
      .plan{position:relative;min-height:0;border-radius:22px;overflow:hidden}
      .rooms{display:flex;flex-direction:column;gap:6px}.rm{display:grid;grid-template-columns:1fr auto;align-items:center;gap:0 8px;padding:5px 10px;border-radius:12px;background:rgba(255,255,255,.04);cursor:pointer}
      .rm b{font:300 20px/1 system-ui}.rm span{font-size:12px;color:var(--m)}.rm em{font-style:normal;font-size:11px;color:var(--m);grid-column:1/3;display:flex;gap:10px}.rm.heat em .fl{color:#ff9d5c}
      .en{display:flex;align-items:flex-end;gap:16px}.en b{font:300 34px/1 system-ui}.en small{color:var(--m);font-size:12px;display:block}
      .bar{height:6px;border-radius:6px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:10px}.bar i{display:block;height:100%;background:linear-gradient(90deg,#3fbf7f,#ffd27a,#ff7a5c);border-radius:6px;transition:width .8s}
      .media{position:relative;overflow:hidden;cursor:pointer}.media .bg{position:absolute;inset:0;background-size:cover;background-position:center;filter:blur(18px) brightness(.45);transform:scale(1.2)}.media>*:not(.bg){position:relative}
      .mt{font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ms{font-size:12px;color:var(--m)}
      .ag{display:flex;flex-direction:column;gap:6px;overflow:hidden}.mp .ag{gap:4px}.mp .ev{cursor:pointer;padding:5px 10px;border-radius:12px;background:rgba(255,255,255,.04);grid-template-columns:auto 1fr;gap:8px;align-items:baseline;border-left:3px solid #8aa0ff}.mp .ev i{white-space:nowrap}.mp .ev.pa{border-left-color:#3fbf7f}.mp .ev span{font-size:12px;color:var(--m)}.mp .h{cursor:pointer}.mp .ev:active{transform:scale(.98)}.ev{display:grid;grid-template-columns:74px 1fr;gap:8px;font-size:13px;align-items:center}.ev i{font-style:normal;color:var(--a);font-weight:700;font-size:12px}.ev span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .dock{display:grid;grid-template-columns:repeat(8,1fr);gap:8px;padding:8px;border-radius:20px;background:var(--g);border:1px solid var(--b);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}.dock button{appearance:none;border:1px solid var(--b);background:rgba(255,255,255,.06);color:var(--t);border-radius:14px;padding:10px 4px;font:700 12px system-ui;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px}
      .dock button i{font-style:normal;font-size:20px}.dock button:active{transform:scale(.95)}.dock button small{font:500 10px system-ui;color:var(--m);text-align:center;line-height:1.15}
      .dock button.arm{background:#ffd27a;color:#1c1826;border-color:#ffd27a}.dock button.arm small{color:#1c1826}.dock button.sim.on{background:linear-gradient(135deg,#b48cff,#7a4fe0);border-color:transparent}
      .toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);padding:10px 18px;border-radius:999px;background:rgba(20,18,30,.92);color:#fff;font-weight:700;opacity:0;transition:opacity .25s;pointer-events:none;z-index:5}.toast.show{opacity:1}
      .hub{position:relative}.hub>*{position:relative;z-index:1}
      .hub[data-ph=day]{--o1:#ffc46b;--o2:#4f8dff;--o3:#25c7b5;--bg0:#1c2b4a;--bg1:#0b1222}
      .hub[data-ph=dawn]{--o1:#ff8a65;--o2:#c86bff;--o3:#ffd27a;--bg0:#2c2140;--bg1:#0e0b18}
      .hub[data-ph=dusk]{--o1:#ff6f61;--o2:#8a4dff;--o3:#ffb35c;--bg0:#2a1a36;--bg1:#0c0914}
      .hub[data-ph=night]{--o1:#3b5bff;--o2:#7b3cff;--o3:#12a7b8;--bg0:#10142a;--bg1:#05060c}
      .bgfx{position:absolute;inset:-20%;z-index:0!important;pointer-events:none;filter:blur(70px) saturate(130%);opacity:.55}
      .bgfx i{position:absolute;border-radius:50%;mix-blend-mode:screen;animation:drift 38s ease-in-out infinite alternate}
      .bgfx i:nth-child(1){width:46%;height:52%;left:6%;top:4%;background:radial-gradient(circle,var(--o1),transparent 65%)}
      .bgfx i:nth-child(2){width:52%;height:58%;right:4%;top:18%;background:radial-gradient(circle,var(--o2),transparent 65%);animation-duration:46s;animation-delay:-12s}
      .bgfx i:nth-child(3){width:44%;height:48%;left:30%;bottom:2%;background:radial-gradient(circle,var(--o3),transparent 65%);animation-duration:52s;animation-delay:-24s}
      @keyframes drift{0%{transform:translate(0,0) scale(1)}50%{transform:translate(6%,-5%) scale(1.12)}100%{transform:translate(-5%,6%) scale(.95)}}
      .grain{position:absolute;inset:0;z-index:0!important;pointer-events:none;opacity:.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
      .vig{position:absolute;inset:0;z-index:0!important;pointer-events:none;background:radial-gradient(120% 100% at 50% 40%,transparent 55%,rgba(0,0,0,.55) 100%)}
      @media (prefers-reduced-motion:reduce){.bgfx i{animation:none}}
      .tile{background:linear-gradient(160deg,rgba(255,255,255,.085),rgba(255,255,255,.035));box-shadow:0 1px 0 rgba(255,255,255,.07) inset,0 10px 30px -12px rgba(0,0,0,.6)}
      .grow{flex:1;min-height:0}
      .mid{display:flex;flex-direction:column;gap:10px;min-height:0}.mid .plan{flex:1}
      .sun{display:block;width:100%;height:auto;aspect-ratio:200/64;max-height:78px;margin-top:8px;overflow:visible}.sun text{font:600 9px system-ui;fill:rgba(243,238,230,.55)}.sun .sel{fill:#ffd27a;font-size:9.5px}
      .sas{display:flex;flex-direction:column;justify-content:center}.sasb{flex:1;min-height:40px;max-height:58px;appearance:none;border:1px solid var(--b);border-radius:16px;background:rgba(255,255,255,.06);color:var(--t);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;font:700 15px system-ui}.sasb i{font-style:normal;font-size:16px;line-height:1}.sasb small{font:500 11px system-ui;color:var(--m)}.sas .h{margin-bottom:6px}
      .sasb.arm{background:#ffd27a;color:#1c1826;border-color:#ffd27a}.sasb.arm small{color:#1c1826}.sasb.ok{background:linear-gradient(135deg,#8be3a5,#3fbf7f);color:#10261a}
      @media (max-height:820px){.media .ms{display:none}.hello{margin-top:4px;font-size:15px}.ppl{margin-top:6px;padding-top:6px}.sasb small{display:none}.clock{font-size:clamp(48px,5.2vw,76px)}.date{margin-top:2px}.fc{margin-top:6px}.fc div{padding:3px 0}.fc b{font-size:15px;margin:0}.sun{max-height:50px;margin-top:4px}}
      @media (max-width:1400px){.wmeta .uv{display:none}}
      .hero{display:flex;flex-direction:column;}.hero .ppl{margin-top:auto}.hero .sun{margin:10px auto 8px}.hero{background:linear-gradient(160deg,rgba(255,210,122,.10),rgba(255,255,255,.04) 45%)}
      @media (max-width:1100px){.hub{grid-template-columns:1fr 1fr;grid-template-rows:auto minmax(0,1fr);gap:8px}.mid{grid-column:1/3;grid-row:2}.c1{grid-row:1;grid-column:1;gap:8px}.c3{grid-row:1;grid-column:2}.hide-s,.fc,.sun,.hello,.wmeta,.rm em,.dock button small{display:none!important}
        .tile{padding:10px 12px;border-radius:16px}.clock{font-size:44px}.date{font-size:12px;margin-top:2px}.ppl{margin-top:6px;padding-top:6px}.av{width:28px;height:28px}.wico{font-size:30px}.wt{font-size:26px}.wt small{font-size:12px}
        .rooms{gap:3px}.rm{padding:3px 8px}.rm b{font-size:16px}.rm span{font-size:11px}.h{margin-bottom:4px}.mid .plan{min-height:44vh}.dock{grid-template-columns:repeat(8,1fr);gap:4px;padding:6px}.dock button{padding:6px 2px;font-size:10px;border-radius:12px}.dock button i{font-size:18px}}
    </style>
    <div class="hub"><div class="bgfx"><i></i><i></i><i></i></div><div class="grain"></div><div class="vig"></div>
      <div class="col c1">
        <div class="tile hero grow"><div class="clock"></div><div class="date"></div><div class="hello"></div><svg class="sun" viewBox="0 0 200 64"><path d="M10 58 Q100 -18 190 58" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="2" stroke-dasharray="3 5"/><path class="arcp" d="M10 58 Q100 -18 190 58" fill="none" stroke="url(#sg)" stroke-width="3" stroke-linecap="round"/><defs><linearGradient id="sg"><stop offset="0" stop-color="#ffb86b"/><stop offset="1" stop-color="#ffd27a"/></linearGradient></defs><circle class="sdot" r="6" fill="#ffd27a"/><text class="sr" x="8" y="63">—</text><text class="ss" x="192" y="63" text-anchor="end">—</text><text class="sel" x="100" y="63" text-anchor="middle">—</text></svg><div class="ppl"></div></div>
        <div class="tile"><div class="h">Météo · Engis</div><div class="wnow"><div class="wico"></div><div class="wt"></div></div><div class="wmeta"></div><div class="fc"></div></div>
        <div class="tile alarm hide-s"><div class="al-i">🛡️</div><div><div class="al-t"></div><div class="al-s">Alarme Ajax · maison</div></div></div>
        <div class="tile sas hide-s"><div class="h">Porte du SAS · BTicino</div><button class="sasb"><i>🔓</i><b>Ouvrir le SAS</b><small>Touchez puis confirmez</small></button></div>
      </div>
      <div class="mid"><div class="plan"></div><div class="dock"></div></div>
      <div class="col c3">
        <div class="tile"><div class="h">Climat <span class="lights"></span></div><div class="rooms"></div></div>
        <div class="tile hide-s"><div class="h">Énergie maison</div><div class="en"><div><b class="pw"></b><small>en ce moment</small></div><div><b class="td" style="font-size:22px"></b><small>aujourd’hui</small></div></div><div class="bar"><i></i></div></div>
        <div class="tile media hide-s"><div class="bg"></div><div class="h">Salon · TV</div><div class="mt"></div><div class="ms"></div></div>
        <div class="tile grow hide-s mp"><div class="h">Planning Matteo <span>›</span></div><div class="ag"></div></div>
      </div>
    </div>`;
    this.$ = (s) => r.querySelector(s);
    // plan 3D embarqué (même carte que la vue « Plan 3D »)
    const p = document.createElement('floorplan-3d-card'); p.setConfig({ height: '100%', compact: true }); p.style.height = '100%'; this.$('.plan').appendChild(p); this.plan = p;
    // actions rapides (mêmes scripts que le dashboard Accueil) ; celles qui ont une confirmation demandent un 2e tap
    const amb = this.$('.dock'); ACTIONS.forEach(([sc, ic, n, sub, conf]) => { const b = document.createElement('button'); b.innerHTML = `<i>${ic}</i>${n}<small>${sub}</small>`;
      b.onclick = () => { if (conf && !b.classList.contains('arm')) { amb.querySelectorAll('.arm').forEach((x) => { x.classList.remove('arm'); x.querySelector('small').textContent = x._sub; }); b.classList.add('arm'); b.querySelector('small').textContent = 'Retouchez pour confirmer'; b.title = conf; clearTimeout(b._t); b._t = setTimeout(() => { b.classList.remove('arm'); b.querySelector('small').textContent = sub; }, 4000); return; }
        b.classList.remove('arm'); b.querySelector('small').textContent = sub; this._h.callService('script', 'turn_on', { entity_id: 'script.' + sc }); this._toast(`${ic} ${n} lancé`); }; b._sub = sub; amb.appendChild(b); });
    for (const [a, ic, n, sub] of [['cine', '🎬', 'Cinéma', 'Ambiance TV'], ['diner', '🍽️', 'Dîner', 'Table + cuisine']]) { const b = document.createElement('button'); b.innerHTML = `<i>${ic}</i>${n}<small>${sub}</small>`; b._sub = sub; b.onclick = () => { if (this.plan && this.plan._ambiance) this.plan._ambiance(a); this._toast(`${ic} ${n}`); }; amb.appendChild(b); }
    { const b = document.createElement('button'); b.className = 'sim'; b.innerHTML = '<i>🎭</i>Simulation<small>présence</small>'; b.onclick = () => this._h.callService('input_boolean', 'toggle', { entity_id: 'input_boolean.simulation_presence' }); amb.appendChild(b); this._sim = b; }
    this.$('.alarm').onclick = () => this._more(ALARM);
    this.$('.media').onclick = () => this._more('media_player.televiseur_du_salon');
    this.$('.mp .h').onclick = () => this._go(MP_PATH);
    { const b = this.$('.sasb'), sm = b.querySelector('small'); b.onclick = () => { if (!b.classList.contains('arm')) { b.classList.add('arm'); sm.textContent = 'Retouchez pour ouvrir'; clearTimeout(b._t); b._t = setTimeout(() => { b.classList.remove('arm'); sm.textContent = 'Touchez puis confirmez'; }, 4000); return; }
      clearTimeout(b._t); b.classList.remove('arm'); const d = SAS.split('.')[0]; this._h.callService(d, d === 'lock' ? 'unlock' : d === 'button' ? 'press' : d === 'script' ? 'turn_on' : 'turn_on', { entity_id: SAS });
      b.classList.add('ok'); sm.textContent = 'Porte ouverte'; this._toast('🔓 Porte du SAS ouverte'); b._t = setTimeout(() => { b.classList.remove('ok'); sm.textContent = 'Touchez puis confirmez'; }, 3000); }; }
    this._clock(); this._forecast(); this._cal(); this._calT = setInterval(() => this._cal(), 15 * 60000);
  }
  _phase(el, rising) { const hub = this.$ && this.$('.hub'); if (!hub || el == null) return; const ph = el > 8 ? 'day' : el > -6 ? (rising ? 'dawn' : 'dusk') : 'night'; if (hub.dataset.ph !== ph) hub.dataset.ph = ph; }
  _toast(t) { let el = this.$('.toast'); if (!el) { el = document.createElement('div'); el.className = 'toast'; this.$('.hub').appendChild(el); } el.textContent = t; el.classList.add('show'); clearTimeout(this._tt); this._tt = setTimeout(() => el.classList.remove('show'), 2500); }
  _go(path) { history.pushState(null, '', path); window.dispatchEvent(new CustomEvent('location-changed')); }
  _more(e) { this.dispatchEvent(new CustomEvent('hass-more-info', { bubbles: true, composed: true, detail: { entityId: e } })); }
  _clock() {
    if (!this.$) return; const d = new Date(), hh = d.getHours();
    this.$('.clock').innerHTML = `${String(hh).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}<small>${String(d.getSeconds()).padStart(2, '0')}</small>`;
    this.$('.date').textContent = d.toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' });
    const sa = this._h && this._h.states['sun.sun']; if (sa && sa.attributes.next_rising) { const r = new Date(sa.attributes.next_rising), st = new Date(sa.attributes.next_setting), f = (x) => x.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
      let rise = new Date(r), set = new Date(st); if (rise > set) rise = new Date(rise - 86400000); const up = sa.state === 'above_horizon', t = up ? Math.min(1, Math.max(0, (d - rise) / (set - rise))) : (d > set ? 1 : 0);
      const pth = this.shadowRoot.querySelector('.arcp'), L = pth.getTotalLength ? pth.getTotalLength() : 0; if (L) { const pt = pth.getPointAtLength(L * t); const dot = this.shadowRoot.querySelector('.sdot'); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); dot.style.opacity = up ? 1 : 0.35; pth.style.strokeDasharray = `${L * t} ${L}`; }
      const el = sa.attributes.elevation, az = sa.attributes.azimuth; this.shadowRoot.querySelector('.sel').textContent = el != null ? `${sa.attributes.rising ? '↗' : '↘'} ${Math.round(el)}° · az ${Math.round(az ?? 0)}°` : ''; this._phase(el, sa.attributes.rising);
      this.shadowRoot.querySelector('.sr').textContent = '☀ ' + f(rise); this.shadowRoot.querySelector('.ss').textContent = f(set) + ' ☾'; }
    let n = (this._h && this._h.user && this._h.user.name) || ''; if (/admin|pc /i.test(n)) n = ''; this.$('.hello').textContent = `${hh < 6 ? 'Bonne nuit' : hh < 12 ? 'Bonjour' : hh < 18 ? 'Bon après-midi' : 'Bonsoir'}${n ? ', ' + n.split(' ')[0] : ''} 👋`;
  }
  _forecast() {
    try { this._unsub = this._h.connection.subscribeMessage((m) => { this._fc = (m.forecast || []).slice(0, 5); this._render(); }, { type: 'weather/subscribe_forecast', entity_id: 'weather.maison', forecast_type: 'daily' }); } catch (e) {}
  }
  async _cal() {
    if (!this._h) return; const s = new Date(), e = new Date(Date.now() + 90 * 86400000), out = [];
    try { (await this._h.callApi('GET', `calendars/${MP_CAL}?start=${s.toISOString()}&end=${e.toISOString()}`)).forEach((x) => out.push(x)); } catch (err) {}
    const t = (x) => new Date(x.start.dateTime || x.start.date); out.sort((a, b) => t(a) - t(b)); this._ev = out.slice(0, 4); this._render();
  }
  _render() {
    const H = this._h && this._h.states; if (!H || !this.$) return; const $ = this.$, num = (e) => { const v = parseFloat(H[e] && H[e].state); return isNaN(v) ? null : v; };
    // météo
    const w = H['weather.maison']; if (w) { const [ic, lb] = WX[w.state] || ['🌡️', w.state]; $('.wico').textContent = ic; $('.wt').innerHTML = `${Math.round(w.attributes.temperature)}°<small>${lb}</small>`;
      $('.wmeta').innerHTML = `${w.attributes.humidity != null ? `<span>💧 ${w.attributes.humidity} %</span>` : ''}<span class="wind"><i style="transform:rotate(${(w.attributes.wind_bearing ?? 0) + 180}deg)">➤</i> ${Math.round(w.attributes.wind_speed ?? 0)} km/h ${w.attributes.wind_bearing != null ? ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'][Math.round(w.attributes.wind_bearing / 45) % 8] : ''}${w.attributes.wind_gust_speed ? ` · raf. ${Math.round(w.attributes.wind_gust_speed)}` : ''}</span><span class="uv">☀️ UV ${w.attributes.uv_index ?? '—'}</span>`; }
    if (this._fc) $('.fc').innerHTML = this._fc.map((f) => { const d = new Date(f.datetime); return `<div><i>${d.toLocaleDateString('fr-BE', { weekday: 'short' }).replace('.', '')}</i><b>${(WX[f.condition] || ['·'])[0]}</b>${Math.round(f.temperature)}°<i> ${f.templow != null ? Math.round(f.templow) + '°' : ''}</i></div>`; }).join('');
    // présence
    $('.ppl').innerHTML = PEOPLE.filter(([e]) => H[e]).map(([e, n]) => `<div class="p ${H[e].state === 'home' ? 'on' : ''}"><div class="av">${n[0]}</div>${n}<br><small>${H[e].state === 'home' ? 'À la maison' : 'Absent'}</small></div>`).join('');
    // alarme
    const a = H[ALARM], as = a ? a.state : 'unknown', armed = as.startsWith('armed') || as === 'triggered', AT = { disarmed: 'Désarmée', armed_away: 'Armée · totale', armed_home: 'Armée · maison', armed_night: 'Armée · nuit', armed_custom_bypass: 'Armée · partielle', triggered: 'ALARME !', arming: 'Armement…', pending: 'En attente' };
    const al = $('.alarm'); al.classList.toggle('armed', armed); al.classList.toggle('off', as === 'disarmed'); $('.al-t').textContent = AT[as] || as;
    // climat
    $('.rooms').innerHTML = ROOMS.map(([n, id, cl, k, path]) => { const t = num(`sensor.temp_${id}_temperature`), hu = num(`sensor.temp_${id}_humidity`), c = H[cl], heat = c && c.attributes.hvac_action === 'heating';
      const cons = H['sensor.consigne_' + k] ? H['sensor.consigne_' + k].state : (c ? c.attributes.temperature : null), mode = H['input_select.mode_' + k] ? H['input_select.mode_' + k].state : '';
      return `<div class="rm ${heat ? 'heat' : ''}" data-p="/1-mon-confort/${path}"><span>${n}</span><b>${t != null ? t.toFixed(1).replace('.', ',') + '°' : '—'}</b><em>${hu != null ? `<span>💧 ${Math.round(hu)} %</span>` : ''}<span class="fl">${heat ? '🔥' : '🎯'} ${cons ?? '—'}°${mode ? ' · ' + mode : ''}</span></em></div>`; }).join('');
    this.shadowRoot.querySelectorAll('.rm').forEach((el) => (el.onclick = () => this._go(el.dataset.p)));
    if (this._sim) this._sim.classList.toggle('on', H['input_boolean.simulation_presence'] && H['input_boolean.simulation_presence'].state === 'on');
    const nOn = Object.keys(H).filter((k) => k.startsWith('light.') && H[k].state === 'on' && !(H[k].attributes.entity_id)).length; $('.lights').textContent = `💡 ${nOn} allumée${nOn > 1 ? 's' : ''}`;
    // énergie
    const pw = num(POWER), td = num(TODAY); $('.pw').textContent = pw != null ? (pw < 1 ? Math.round(pw * 1000) + ' W' : pw.toFixed(2).replace('.', ',') + ' kW') : '—'; $('.td').textContent = td != null ? td.toFixed(1).replace('.', ',') + ' kWh' : '—';
    $('.bar i').style.width = Math.min(100, ((pw || 0) / 6) * 100) + '%';
    // média
    const tv = H['media_player.televiseur_du_salon'], on = tv && !['off', 'unavailable', 'standby', 'unknown'].includes(tv.state);
    $('.mt').textContent = on ? (tv.attributes.media_title || tv.attributes.app_name || tv.attributes.source || 'En lecture') : 'Éteinte';
    $('.ms').textContent = on ? [tv.attributes.media_series_title, tv.attributes.app_name, tv.state === 'paused' ? 'en pause' : ''].filter(Boolean).join(' · ') : 'Touchez pour allumer';
    const pic = on ? tv.attributes.entity_picture : null; $('.media .bg').style.backgroundImage = pic ? `url("${pic}")` : 'none';
    // agenda
    if (this._ev) $('.ag').innerHTML = this._ev.length ? this._ev.map((x) => { const st = new Date(x.start.dateTime || x.start.date), today = st.toDateString() === new Date().toDateString();
      const en = new Date(x.end ? (x.end.dateTime || x.end.date) : st); if (!x.start.dateTime) en.setDate(en.getDate() - 1); const f = (d, o) => d.toLocaleDateString('fr-BE', o).replace(/\./g, '');
      const multi = en > st && en.toDateString() !== st.toDateString(), lab = (today ? 'Auj.' : f(st, { weekday: 'short', day: 'numeric' })) + (multi ? '–' + f(en, { day: 'numeric' }) : '') + ' ' + f(multi ? en : st, { month: 'short' });
      const sm = (x.summary || '').replace(/^Matteo\s*/i, '').replace(/\s*—\s*[^()]*\(([^)]+)\)/, ' · $1').replace(/\s*—\s*Vacances d[e'’]\s*/i, ' · '), papa = /papa/i.test(sm);
      return `<div class="ev ${papa ? 'pa' : ''}"><i>${lab}</i><span>${sm.charAt(0).toUpperCase() + sm.slice(1)}</span></div>`; }).join('') : '<div class="ev"><i>—</i><span>Aucune date prévue</span></div>';
    this.shadowRoot.querySelectorAll('.mp .ev').forEach((el) => (el.onclick = () => this._go(MP_PATH)));
  }
}
customElements.define('home-hub-card', HomeHubCard);
window.customCards = window.customCards || []; window.customCards.push({ type: 'home-hub-card', name: 'Accueil 3D', description: 'Tableau de bord plein écran autour du plan 3D' });
