/* Localisation v2 — hub plein écran dans l'esprit de l'Accueil (verre, accents or, tuiles).
   Gauche : la famille (position, distance, batterie, actions). Centre : carte + modes d'itinéraire.
   Droite : journal des arrêts. Arrêt = immobile ≥ 5 min dans une zone connue, ≥ 10 min ailleurs.
   Config : type: custom:loc-hub-card ; version: "2.0.0" (pied de page) */
(() => {
  const PEOPLE = [
    { k: 'sandrine', id: 'person.sandrine', n: 'Sandrine', c: '#f472b6', svc: 'mobile_app_sandrine_smartphone', bat: 'sensor.sandrine_smartphone_battery_level', bst: 'sensor.sandrine_smartphone_battery_state', dt: 'device_tracker.sandrine_smartphone', waze: 'sensor.trajet_sandrine_waze_trajet_sandrine_vers_maison', find: ['🤖', 'https://www.google.com/android/find'] },
    { k: 'greg', id: 'person.greg', n: 'Greg', c: '#38bdf8', svc: 'mobile_app_samsung_greg', bat: 'sensor.samsung_greg_battery_level', bst: 'sensor.samsung_greg_battery_state', dt: 'device_tracker.gsm_greg', waze: 'sensor.trajet_greg_waze_trajet_greg_vers_maison', find: ['🤖', 'https://www.google.com/android/find'] },
    { k: 'matteo', id: 'person.matteo', n: 'Matteo', c: '#4ade80', svc: 'mobile_app_iphone', bat: '', bst: '', dt: 'device_tracker.iphone', waze: '', find: ['🍏', 'https://www.icloud.com/find'] },
  ];
  const MODES = [['famille', 'Tout le monde'], ['arrets', 'Arrêts'], ['dernier', 'Dernier trajet'], ['2h', '2 dernières h'], ['jour', 'Journée'], ['semaine', 'Semaine'], ['zones', 'Zones']];
  const MIN_ZONE = 5, MIN_HORS = 10, R_HORS = 100, ACC_MAX = 200;
  const rad = (x) => (x * Math.PI) / 180;
  const dist = (a, b, c, d) => { const q = Math.sin(rad(c - a) / 2) ** 2 + Math.cos(rad(a)) * Math.cos(rad(c)) * Math.sin(rad(d - b) / 2) ** 2; return 12742000 * Math.asin(Math.sqrt(q)); };
  const hm = (t) => new Date(t).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
  const dur = (ms) => { const m = Math.max(0, Math.round(ms / 60000)); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0'); };
  const km = (m) => (m < 1000 ? Math.round(m) + ' m' : (m / 1000).toFixed(m < 10000 ? 1 : 0).replace('.', ',') + ' km');
  const ago = (t) => { const m = Math.round((Date.now() - new Date(t)) / 60000); return m < 1 ? 'à l’instant' : m < 60 ? 'il y a ' + m + ' min' : m < 1440 ? 'il y a ' + Math.floor(m / 60) + ' h' : 'il y a ' + Math.floor(m / 1440) + ' j'; };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const CSS = `
  :host{display:block;max-width:100%;overflow-x:hidden;--g:rgba(255,255,255,.06);--b:rgba(255,255,255,.09);--t:#f3eee6;--m:rgba(243,238,230,.6);--a:#ffd27a}
  *{box-sizing:border-box}
  .hub{height:calc(100vh - var(--top,56px) - 1px);min-height:600px;display:grid;grid-template-columns:minmax(270px,24%) 1fr minmax(280px,24%);grid-template-rows:auto 1fr auto;gap:12px;padding:12px;
    background:radial-gradient(140% 90% at 50% 0%,#121426 0%,#07080f 70%);color:var(--t);font:500 14px system-ui,Roboto,sans-serif;border-radius:22px;overflow:hidden;position:relative;isolation:isolate}
  .hub:before{content:'';position:absolute;inset:-20%;z-index:-1;background:radial-gradient(40% 30% at 15% 10%,rgba(123,92,255,.18),transparent 70%),radial-gradient(35% 30% at 85% 90%,rgba(31,182,201,.12),transparent 70%),radial-gradient(30% 25% at 60% 15%,rgba(255,154,90,.10),transparent 70%)}
  .top{grid-column:1/-1;display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding:2px 6px 0}
  .ttl b{display:block;font:300 clamp(26px,2.6vw,38px)/1 system-ui;letter-spacing:-.02em}
  .ttl span{color:var(--m);font-size:13px}
  .sumr{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
  .pill{padding:6px 12px;border-radius:99px;background:var(--g);border:1px solid var(--b);font-size:13px;white-space:nowrap}
  .pill b{color:var(--a)}
  .col{display:flex;flex-direction:column;gap:12px;min-height:0;overflow:auto;scrollbar-width:thin}
  .tile{background:var(--g);border:1px solid var(--b);border-radius:20px;padding:14px 16px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
  .h{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--m);margin:0 0 10px;display:flex;justify-content:space-between;align-items:center;gap:8px}
  .h i{font-style:normal;text-transform:none;letter-spacing:0;color:var(--a);font-size:12px}
  /* personnes */
  .pc{position:relative;cursor:pointer;transition:border-color .2s,background .2s,transform .1s;border-left:3px solid var(--pc)}
  .pc:active{transform:scale(.99)}
  .pc.on{background:linear-gradient(135deg,color-mix(in srgb,var(--pc) 16%,transparent),var(--g));border-color:color-mix(in srgb,var(--pc) 55%,transparent);border-left-color:var(--pc)}
  .pt{display:flex;gap:12px;align-items:center}
  .av{position:relative;flex:0 0 52px;height:52px;border-radius:50%;border:2px solid var(--pc);display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--pc) 22%,transparent);font:700 20px system-ui}
  .av img{width:100%;height:100%;border-radius:50%;object-fit:cover}
  .av i{position:absolute;right:-1px;bottom:-1px;width:14px;height:14px;border-radius:50%;border:2px solid #0d0f1c;background:#f59e0b}
  .av i.h{background:#22c55e}
  .pi{min-width:0;flex:1}
  .pi b{display:block;font-size:17px;font-weight:700}
  .zn{display:block;font-size:14px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ds{display:block;font-size:12px;color:var(--m);margin-top:2px}
  .chips{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 0}
  .chip{padding:3px 9px;border-radius:99px;background:rgba(255,255,255,.07);font-size:11.5px;font-weight:600;color:var(--m)}
  .chip.low{background:rgba(239,68,68,.18);color:#fca5a5}
  .acts{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:12px}
  .ab{display:flex;flex-direction:column;align-items:center;gap:3px;padding:7px 2px;border-radius:12px;border:1px solid var(--b);background:rgba(255,255,255,.04);color:var(--t);font:600 10.5px system-ui;cursor:pointer;text-decoration:none;-webkit-tap-highlight-color:transparent}
  .ab span{font-size:17px;line-height:1}
  .ab:active{transform:scale(.95)}
  .ab.ring{border-color:rgba(245,158,11,.5)}
  .ab.stop{background:#ef4444;border-color:#ef4444;animation:pl 1s ease-in-out infinite}
  .ab.urg{border-color:rgba(239,68,68,.5)}
  .ab.ok{background:rgba(34,197,94,.25);border-color:rgba(34,197,94,.6)}
  @keyframes pl{50%{filter:brightness(1.4)}}
  /* centre */
  .mid{display:flex;flex-direction:column;gap:10px;min-height:0}
  .bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .seg{display:flex;background:var(--g);border:1px solid var(--b);border-radius:14px;padding:3px;gap:2px;flex-wrap:wrap}
  .seg button{border:0;background:none;color:var(--m);font:600 13px system-ui;padding:8px 12px;border-radius:11px;cursor:pointer;white-space:nowrap}
  .seg button.on{background:rgba(255,210,122,.16);color:var(--a);box-shadow:inset 0 0 0 1px rgba(255,210,122,.45)}
  .who{margin-left:auto;font-size:13px;color:var(--m)}
  .who b{color:var(--t)}
  .map{flex:1;min-height:320px;border-radius:20px;overflow:hidden;border:1px solid var(--b);position:relative;background:#0b0d18}
  .map ha-map{position:absolute;inset:0;display:block}
  .ld{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--m)}
  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .st{background:var(--g);border:1px solid var(--b);border-radius:16px;padding:10px 12px}
  .st b{display:block;font:300 24px/1.1 system-ui}
  .st span{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--m)}
  /* journal */
  .tl{position:relative;display:flex;flex-direction:column;gap:2px}
  .ev{position:relative;display:flex;gap:12px;padding:8px 6px 8px 0;cursor:pointer;border-radius:12px}
  .ev:hover{background:rgba(255,255,255,.03)}
  .ev .n{position:relative;flex:0 0 28px;display:flex;justify-content:center}
  .ev .n b{position:relative;z-index:1;width:26px;height:26px;border-radius:50%;background:var(--pc);color:#0b1020;font:800 12px system-ui;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px #0d0f1c}
  .ev:not(:last-child) .n:after{content:'';position:absolute;top:28px;bottom:-12px;left:50%;width:2px;transform:translateX(-50%);background:linear-gradient(var(--pc),rgba(255,255,255,.08))}
  .ev .x{min-width:0;flex:1}
  .ev .x b{display:block;font-size:14.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ev .x small{display:block;color:var(--m);font-size:12px;margin-top:2px}
  .ev .x em{font-style:normal;color:var(--a)}
  .ev .d{font:300 15px system-ui;color:var(--t);white-space:nowrap;align-self:center}
  .ev.now .n b{animation:pl 1.6s ease-in-out infinite}
  .hz{color:#fbbf24}
  .vide{color:var(--m);text-align:center;padding:16px 4px}
  .fam{display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid var(--b)}
  .fam:last-child{border:0}
  .fam .dot{width:10px;height:10px;border-radius:50%;background:var(--pc);flex:0 0 10px}
  .fam b{font-size:14px}
  .fam small{display:block;color:var(--m);font-size:12px}
  .rule{font-size:11.5px;color:var(--m);line-height:1.5}
  .dp{background:none;border:0;color:var(--m);font:600 13px system-ui;padding:6px 8px;border-radius:11px;color-scheme:dark;max-width:140px}
  .rps{align-items:center}.rp{color:var(--a)!important}.rpt{font:300 15px system-ui;color:var(--t);padding:0 10px 0 4px;min-width:44px}
  .mz{margin-left:6px;border:1px solid rgba(255,210,122,.45);background:rgba(255,210,122,.1);color:var(--a);border-radius:9px;font:600 11px system-ui;padding:2px 8px;cursor:pointer}
  .mkf{display:flex;gap:8px;width:100%;padding:4px 0}.mkn{flex:1;min-width:0;background:rgba(255,255,255,.06);border:1px solid var(--b);border-radius:10px;color:var(--t);font:500 14px system-ui;padding:8px 10px}
  .mzok{border:0;border-radius:10px;background:var(--a);color:#15101f;font:700 13px system-ui;padding:0 14px;cursor:pointer}
  .wk{grid-column:1/-1;display:grid;grid-template-columns:repeat(7,1fr);gap:8px;background:var(--g);border:1px solid var(--b);border-radius:16px;padding:12px}
  .wb{display:flex;flex-direction:column;align-items:center;gap:3px;text-align:center}
  .bt2{height:80px;width:100%;max-width:34px;display:flex;align-items:flex-end;background:rgba(255,255,255,.04);border-radius:8px;overflow:hidden}
  .bt2 i{display:block;width:100%;background:linear-gradient(180deg,var(--pc),color-mix(in srgb,var(--pc) 35%,transparent));border-radius:8px 8px 0 0}
  .wb b{font:300 13px system-ui}.wb span{font-size:11px;color:var(--m);text-transform:capitalize}.wb small{font-size:10.5px;color:var(--m)}
  .zb{display:flex;gap:4px;align-self:center}.zb button{width:30px;height:30px;border-radius:9px;border:1px solid var(--b);background:rgba(255,255,255,.05);color:var(--t);font:700 16px system-ui;cursor:pointer}
  .leg{margin:-2px 0 4px 26px;padding:3px 0 3px 14px;border-left:2px dashed color-mix(in srgb,var(--pc) 55%,transparent);font:500 11.5px system-ui;color:var(--m)}
  .foot{grid-column:1/-1;text-align:center;font-size:12px;color:var(--m);padding:0 0 2px}
  .foot b{color:var(--t);font-weight:600}
  @media (max-width:1100px){.hub{grid-template-columns:minmax(250px,32%) 1fr;grid-template-rows:auto auto 1fr auto}.right{grid-column:1/-1}}
  @media (max-width:760px){.hub{height:auto;grid-template-columns:1fr;overflow:visible}.col{overflow:visible}.map{min-height:52vh;flex:none;height:52vh}.who{margin-left:0;width:100%}.sumr{justify-content:flex-start}.top{flex-direction:column;align-items:flex-start}}
  `;

  class LocHubCard extends HTMLElement {
    setConfig(c) { this.cfg = c || {}; this.sel = this.cfg.person || 'sandrine'; this.mode = this.cfg.person ? (this.cfg.mode || 'arrets') : 'famille'; this.day = 0; this._b = false; this._hist = {}; }
    getCardSize() { return 14; }
    set hass(h) {
      this._h = h;
      if (!this._b) { this._b = true; this._build(); this._refreshPhones(); this._load(); }
      const now = Date.now();
      if ((!this._pt || now - this._pt > 1500) && !(this._hold > now)) { this._pt = now; this._people(); this._summary(); }
    }

    _p(k) { return PEOPLE.find((p) => p.k === k); }
    _zones() {
      return Object.values(this._h.states).filter((s) => s.entity_id.startsWith('zone.') && s.attributes.latitude != null && !s.attributes.passive)
        .map((z) => ({ n: z.entity_id === 'zone.home' ? 'Maison' : z.attributes.friendly_name, lat: z.attributes.latitude, lon: z.attributes.longitude, r: z.attributes.radius || 100, home: z.entity_id === 'zone.home' }));
    }
    _refreshPhones() { try { if (!window.__locRefresh || Date.now() - window.__locRefresh > 120000) { window.__locRefresh = Date.now(); this._h.callService('script', 'turn_on', { entity_id: 'script.localisation_actualiser' }); } } catch (e) {} }

    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const v = this.cfg.version || '2.1.0';
      r.innerHTML = `<style>${CSS}</style><div class="hub">
        <div class="top"><div class="ttl"><b>📍 Localisation</b><span>Où est tout le monde, et par où sont-ils passés</span></div><div class="sumr"></div></div>
        <div class="col left"><div class="h">La famille <i>👆 itinéraire</i></div><div class="people"></div></div>
        <div class="mid">
          <div class="bar"><div class="seg modes">${MODES.map(([k, l]) => `<button data-act="mode" data-v="${k}">${l}</button>`).join('')}</div>
          <div class="seg days"><button data-act="day" data-v="0">Aujourd’hui</button><button data-act="day" data-v="1">Hier</button><input type="date" class="dp" title="Choisir un jour"></div><div class="seg rps"><button class="rp" data-act="replay">▶ Rejouer</button><span class="rpt"></span></div><div class="who"></div></div>
          <div class="map"><div class="ld">Chargement de la carte…</div></div>
          <div class="stats"></div>
        </div>
        <div class="col right"><div class="tile jr"><div class="h jh">Journal</div><div class="tl"></div></div>
          <div class="tile"><div class="h">Comment sont comptés les arrêts</div><div class="rule">📍 Dans une zone connue (magasin, travail, école…) : immobile au moins <b>${MIN_ZONE} min</b>.<br>📌 Ailleurs : au moins <b>${MIN_HORS} min</b> — les bouchons et les feux ne comptent pas.<br>Les téléphones n’envoient leur position que de temps en temps : les heures sont arrondies à quelques minutes près.</div></div>
        </div>
        <div class="foot">✎ <b>maison_localisation</b> · v${esc(v)} · ${esc(this.cfg.date || new Date().toLocaleDateString('fr-BE'))} · Conçu et maintenu par Gregory via Claude AI</div>
      </div>`;
      r.querySelector('.hub').addEventListener('click', (e) => this._click(e));
      r.querySelector('.dp').addEventListener('change', (e) => { const v = e.target.value; if (!v) return; const d = new Date(v + 'T00:00:00'), t = new Date(); t.setHours(0, 0, 0, 0); this.day = Math.max(0, Math.round((t - d) / 86400e3)); if (this.mode !== 'arrets' && this.mode !== 'jour' && this.mode !== 'famille') this.mode = 'jour'; this._load(); });
    }

    _click(e) {
      if (e.target.tagName === 'INPUT') return;
      const b = e.target.closest('[data-act]'); if (!b) return;
      const a = b.dataset.act, k = b.dataset.k, p = k && this._p(k), hs = this._h;
      if (a !== 'maps' && a !== 'find') { e.preventDefault(); e.stopPropagation(); }
      if (a === 'sel') { this.sel = k; if (this.mode === 'famille') this.mode = 'arrets'; this._people(); this._load(); }
      else if (a === 'mode') { this.mode = b.dataset.v; this._load(); }
      else if (a === 'day') { this.day = +b.dataset.v; this._load(); }
      else if (a === 'replay') { if (this._rpOn) { clearInterval(this._rpT); this._rpOn = false; this._load(); } else this._replay(b); }
      else if (a === 'mkzone') { const row = b.closest('.ev'); const i = b.dataset.i; row.innerHTML = `<div class="mkf"><input class="mkn" placeholder="Nom de la zone (ex. Chez Laura)" maxlength="40"><button class="mzok" data-act="mkok" data-i="${i}">Créer</button></div>`; setTimeout(() => { const x = row.querySelector('.mkn'); if (x) x.focus(); }, 50); }
      else if (a === 'mkok') {
        const s = (this._shown || [])[+b.dataset.i], inp = b.parentNode.querySelector('.mkn'), name = inp && inp.value.trim();
        if (!s || !name) { if (inp) inp.focus(); return; }
        b.textContent = '⏳';
        hs.callWS({ type: 'zone/create', name, icon: 'mdi:map-marker', latitude: +s.lat.toFixed(6), longitude: +s.lon.toFixed(6), radius: 80, passive: false }).then(() => { this._hist = {}; setTimeout(() => this._load(), 1500); }).catch((er) => { b.textContent = '❌ ' + (er.message || 'erreur'); });
      } else if (a === 'zr') {
        const z = (this._zl || []).find((x) => x.id === b.dataset.z); if (!z) return;
        const r2 = Math.max(20, Math.min(1000, (z.radius || 100) + (+b.dataset.d)));
        hs.callWS({ type: 'zone/update', zone_id: z.id, name: z.name, icon: z.icon, latitude: z.latitude, longitude: z.longitude, radius: r2, passive: !!z.passive }).then(() => setTimeout(() => this._load(), 600));
      }
      else if (a === 'ping') { hs.callService('notify', p.svc, { message: 'request_location_update' }); this._flash(b, '✅', 'Demandé'); }
      else if (a === 'ring') {
        const f = 'input_boolean.loc_sonne_' + k;
        if ((hs.states[f] || {}).state === 'on') hs.callService('input_boolean', 'turn_off', { entity_id: f });
        else hs.callService('script', 'turn_on', { entity_id: 'script.localisation_sonner', variables: { qui: k } });
        this._flash(b, '⏳', '…');
      } else if (a === 'urgent' || a === 'rappel') {
        const n = String((hs.user || {}).name || '').toLowerCase();
        const app = n.includes('sandrine') ? 'Sandrine' : (n.includes('greg') || n.includes('admin')) ? 'Gregory' : 'Quelqu’un de la famille';
        hs.callService('script', 'turn_on', { entity_id: 'script.localisation_sonner', variables: { qui: k, mode: a, appelant: app } });
        this._flash(b, '✅', 'Envoyé');
      } else if (a === 'ev') { const s = (this._shown || [])[+b.dataset.i]; if (s && this._map) { try { this._map.setView([s.lat, s.lon], 17); } catch (er) {} } }
    }
    _flash(b, ic, t) { this._hold = Date.now() + 3600; const o = b.innerHTML; b.classList.add('ok'); b.innerHTML = `<span>${ic}</span>${t}`; setTimeout(() => { if (b.isConnected) { b.classList.remove('ok'); b.innerHTML = o; } }, 3500); }

    _people() {
      const r = this.shadowRoot; if (!r) return; const S = this._h.states, H = (S['zone.home'] || {}).attributes || {};
      r.querySelector('.people').innerHTML = PEOPLE.map((p) => {
        const s = S[p.id]; if (!s) return '';
        const a = s.attributes, tr = S[p.dt] || {}, ta = tr.attributes || {};
        const zone = s.state === 'home' ? '🏠 À la maison' : s.state === 'not_home' ? '🚗 En déplacement' : s.state === 'unknown' ? '❔ Position inconnue' : '📍 ' + esc((S['zone.' + s.state] || { attributes: {} }).attributes.friendly_name || s.state);
        const d = a.latitude != null && H.latitude != null ? dist(H.latitude, H.longitude, a.latitude, a.longitude) : null;
        const wz = p.waze && S[p.waze] && !isNaN(parseFloat(S[p.waze].state)) && s.state !== 'home' ? ` · 🚗 ${Math.round(parseFloat(S[p.waze].state))} min de trajet` : '';
        const ds = s.state === 'home' ? 'Pile à la maison' : d == null ? '' : km(d) + ' de la maison' + wz;
        const bv = p.bat && S[p.bat] ? S[p.bat].state : ta.battery_level; const bs = p.bst && S[p.bst] ? S[p.bst].state : ta.battery_state || '';
        const chg = /charg|full/i.test(bs) && !/dis/i.test(bs);
        const chips = [
          bv != null && bv !== '' && !isNaN(bv) ? `<span class="chip ${+bv < 20 && !chg ? 'low' : ''}">${chg ? '⚡' : +bv < 20 ? '🪫' : '🔋'} ${Math.round(bv)} %</span>` : '',
          a.gps_accuracy ? `<span class="chip">🎯 ± ${Math.round(a.gps_accuracy)} m</span>` : '',
          (Date.now() - new Date(tr.last_updated || s.last_updated) > 3600e3 && s.state !== 'home') ? `<span class="chip low">⚠️ position ${ago(tr.last_updated || s.last_updated)}</span>` : `<span class="chip">🕒 ${ago(tr.last_updated || s.last_updated)}</span>`,
          p.k === 'matteo' && S['calendar.matteo'] && S['calendar.matteo'].state === 'on' ? `<span class="chip">📅 ${esc(S['calendar.matteo'].attributes.message)}</span>` : '',
        ].join('');
        const ringing = (S['input_boolean.loc_sonne_' + p.k] || {}).state === 'on';
        const maps = a.latitude != null ? `https://www.google.com/maps/search/?api=1&query=${a.latitude},${a.longitude}` : p.find[1];
        const pic = a.entity_picture ? `<img src="${esc(a.entity_picture)}" alt="">` : esc(p.n[0]);
        return `<div class="tile pc ${this.sel === p.k && this.mode !== 'famille' ? 'on' : ''}" data-act="sel" data-k="${p.k}" style="--pc:${p.c}">
          <div class="pt"><div class="av">${pic}<i class="${s.state === 'home' ? 'h' : ''}"></i></div><div class="pi"><b>${esc(p.n)}</b><span class="zn">${zone}</span><span class="ds">${esc(ds)}</span></div></div>
          <div class="chips">${chips}</div>
          <div class="acts">
            <button class="ab" data-act="ping" data-k="${p.k}"><span>📍</span>Localiser</button>
            <button class="ab ${ringing ? 'stop' : 'ring'}" data-act="ring" data-k="${p.k}"><span>${ringing ? '⏹️' : '🔔'}</span>${ringing ? 'Stop' : 'Sonner'}</button>
            <button class="ab urg" data-act="urgent" data-k="${p.k}"><span>🚨</span>Urgent</button>
            <button class="ab" data-act="rappel" data-k="${p.k}"><span>📵</span>Rappel</button>
            <a class="ab" data-act="maps" href="${maps}" target="_blank" rel="noopener"><span>🧭</span>Maps</a>
          </div></div>`;
      }).join('');
    }

    _summary() {
      const r = this.shadowRoot, S = this._h.states; if (!r) return;
      const st = PEOPLE.map((p) => (S[p.id] || {}).state);
      const home = st.filter((x) => x === 'home').length, away = st.filter((x) => x && x !== 'home').length;
      const t = new Date();
      r.querySelector('.sumr').innerHTML = `<span class="pill">🏠 <b>${home}</b> à la maison</span><span class="pill">🚗 <b>${away}</b> dehors</span><span class="pill">${t.toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' })} · ${hm(t)}</span>`;
    }

    async _points(id, t0, t1) {
      const key = id + t0 + '|' + Math.floor(t1 / 60000);
      if (this._hist[key]) return this._hist[key];
      const res = await this._h.callWS({ type: 'history/history_during_period', start_time: new Date(t0).toISOString(), end_time: new Date(t1).toISOString(), entity_ids: [id], minimal_response: false, no_attributes: false, significant_changes_only: false });
      let a = {}; const pts = [];
      for (const s of res[id] || []) {
        if (s.a) a = s.a; const t = ((s.lu || s.lc) * 1000) || 0;
        if (a.latitude == null || !t || (a.gps_accuracy || 0) > ACC_MAX) continue;
        const p = { t: Math.max(t, t0), lat: a.latitude, lon: a.longitude }, l = pts[pts.length - 1];
        if (l && l.lat === p.lat && l.lon === p.lon) continue; pts.push(p);
      }
      this._hist = { [key]: pts }; return pts;
    }

    _stops(pts, tEnd, endsNow) {
      const Z = this._zones();
      const zoneOf = (lat, lon) => { let b = null; for (const z of Z) { const d = dist(z.lat, z.lon, lat, lon); if (d <= z.r + 30 && (!b || d < b.d)) b = { ...z, d }; } return b; };
      const out = []; let i = 0;
      while (i < pts.length) {
        const a = pts[i], z = zoneOf(a.lat, a.lon), cLat = z ? z.lat : a.lat, cLon = z ? z.lon : a.lon, R = z ? z.r + 30 : R_HORS;
        let j = i, sLat = a.lat, sLon = a.lon;
        while (j + 1 < pts.length && dist(cLat, cLon, pts[j + 1].lat, pts[j + 1].lon) <= R) { j++; sLat += pts[j].lat; sLon += pts[j].lon; }
        const last = j + 1 >= pts.length, t1 = last ? tEnd : pts[j + 1].t;
        const lastT1 = out.length ? out[out.length - 1].t1 : 0, t0 = Math.max(i > 0 ? Math.round((pts[i - 1].t + a.t) / 2) : a.t, lastT1), d = t1 - t0, single = j === i;
        if (d >= (z ? MIN_ZONE : MIN_HORS) * 60000 && (!single || t1 - a.t >= (z ? 4 : 8) * 60000)) { const n = j - i + 1; out.push({ t0, t1, d, z, lat: z ? z.lat : sLat / n, lon: z ? z.lon : sLon / n, now: last && endsNow, i0: i, i1: j }); }
        i = j + 1;
      }
      const m = [];
      for (const s of out) { const p = m[m.length - 1]; if (p && dist(p.lat, p.lon, s.lat, s.lon) < 150 && s.t0 - p.t1 < 5 * 60000 && (p.z || {}).n === (s.z || {}).n) { p.t1 = s.t1; p.d = p.t1 - p.t0; p.now = s.now; p.i1 = s.i1; } else m.push({ ...s }); }
      return m;
    }
    _nom(s) { return s.z ? s.z.n : 'Arrêt hors zone'; }
    _replay(btn) {
      const seg = this._seg, m = this._map; if (!seg || seg.length < 2 || !m) return;
      clearInterval(this._rpT); this._rpOn = true; btn.textContent = '⏹ Stop';
      const N = seg.length, step = Math.max(1, Math.ceil(N / 160)), base = this._locs || [], lab = this.shadowRoot.querySelector('.rpt'); let i = 1;
      this._rpT = setInterval(() => {
        i = Math.min(N, i + step); const sl = seg.slice(0, i), c = sl[sl.length - 1];
        m.paths = [{ points: sl.map((q) => ({ point: [q.lat, q.lon], timestamp: new Date(q.t) })), color: this._pc, gradualOpacity: 0.85, fullDatetime: true }];
        m.editableLocations = base.concat([{ id: 'cur', latitude: c.lat, longitude: c.lon, radius: 30, radius_color: '#ffd27a', icon: 'mdi:car', name: hm(c.t), location_editable: false, radius_editable: false }]);
        lab.textContent = hm(c.t);
        if (i >= N) { clearInterval(this._rpT); this._rpOn = false; btn.textContent = '▶ Rejouer'; }
      }, 120);
    }
    _len(seg) { let t = 0; for (let k = 1; k < seg.length; k++) t += dist(seg[k - 1].lat, seg[k - 1].lon, seg[k].lat, seg[k].lon); return t; }

    async _ensureMap() {
      if (customElements.get('ha-map')) return true;
      try { const hp = await window.loadCardHelpers(); hp.createCardElement({ type: 'map', entities: ['zone.home'] }); } catch (e) {}
      await Promise.race([customElements.whenDefined('ha-map'), new Promise((x) => setTimeout(x, 6000))]);
      return !!customElements.get('ha-map');
    }

    async _load() {
      const r = this.shadowRoot, tok = (this._tok = Math.random()), p = this._p(this.sel), fam = this.mode === 'famille';
      r.querySelectorAll('.modes button').forEach((b) => b.classList.toggle('on', b.dataset.v === this.mode));
      r.querySelector('.days').style.display = this.mode === 'arrets' || this.mode === 'jour' || fam ? '' : 'none';
      r.querySelector('.rps').style.display = ['arrets', 'jour', 'dernier', '2h'].includes(this.mode) ? '' : 'none';
      clearInterval(this._rpT); this._rpOn = false; r.querySelector('.rp').textContent = '▶ Rejouer'; r.querySelector('.rpt').textContent = '';
      { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - this.day); r.querySelector('.dp').value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); r.querySelector('.dp').max = new Date().toISOString().slice(0, 10); }
      r.querySelectorAll('.days button').forEach((b) => b.classList.toggle('on', +b.dataset.v === this.day));
      r.querySelector('.who').innerHTML = fam ? 'Vue <b>famille</b>' : this.mode === 'zones' ? 'Les <b>zones</b> connues' : `Itinéraire de <b style="color:${p.c}">${esc(p.n)}</b>`;
      this._people();
      const mapBox = r.querySelector('.map'), tl = r.querySelector('.tl'), stats = r.querySelector('.stats'), jh = r.querySelector('.jh');
      tl.innerHTML = '<div class="vide">Chargement…</div>';
      const now = Date.now(), d0 = new Date(); d0.setHours(0, 0, 0, 0);
      let t0, t1, endsNow = true;
      if (this.mode === '2h') { t0 = now - 2 * 3600e3; t1 = now; }
      else if (this.mode === 'dernier') { t0 = now - 36 * 3600e3; t1 = now; }
      else if (this.day > 0) { t0 = d0.getTime() - this.day * 86400e3; t1 = t0 + 86400e3; endsNow = false; }
      else { t0 = d0.getTime(); t1 = now; }
      const dayLbl = this.day === 0 ? 'aujourd’hui' : this.day === 1 ? 'hier' : 'le ' + new Date(t0).toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' });
      const admin = !!(this._h.user && this._h.user.is_admin);
      let paths = [], locs = [], shown = [], fit = [];
      try {
        if (fam) {
          const rows = [];
          for (const q of PEOPLE) {
            const pts = await this._points(q.id, t0, t1); if (tok !== this._tok) return;
            const st = this._stops(pts, t1, endsNow), out = st.filter((s) => !(s.z && s.z.home));
            const cur = st[st.length - 1], s = this._h.states[q.id] || {};
            rows.push(`<div class="fam" style="--pc:${q.c}"><span class="dot"></span><div><b>${esc(q.n)}</b><small>${out.length} arrêt${out.length > 1 ? 's' : ''} ${dayLbl} · ${km(this._len(pts))}${cur && cur.now ? ' · ' + esc(this._nom(cur)) + ' depuis ' + hm(cur.t0) : ''}</small></div></div>`);
            const a = s.attributes || {}; if (a.latitude != null) fit.push([a.latitude, a.longitude]);
          }
          jh.innerHTML = `Résumé ${dayLbl}`; tl.innerHTML = rows.join('');
          const H = (this._h.states['zone.home'] || {}).attributes; if (H) fit.push([H.latitude, H.longitude]);
          stats.innerHTML = '';
          stats.style.display = 'none';
        } else if (this.mode === 'semaine') {
          stats.style.display = '';
          const T0 = d0.getTime() - 6 * 86400e3, pts = await this._points(p.id, T0, now); if (tok !== this._tok) return;
          const stops = this._stops(pts, now, true), days = [];
          for (let k = 0; k < 7; k++) { const a = T0 + k * 86400e3, b2 = a + 86400e3; days.push({ a, km: this._len(pts.filter((q) => q.t >= a && q.t < b2)), n: stops.filter((x) => x.t0 >= a && x.t0 < b2 && !(x.z && x.z.home)).length }); }
          const mx = Math.max(1, ...days.map((d) => d.km));
          stats.innerHTML = `<div class="wk">${days.map((d) => `<div class="wb" style="--pc:${p.c}"><div class="bt2"><i style="height:${Math.max(4, Math.round((d.km / mx) * 100))}%"></i></div><b>${km(d.km)}</b><span>${new Date(d.a).toLocaleDateString('fr-BE', { weekday: 'short', day: 'numeric' })}</span><small>${d.n} arrêt${d.n > 1 ? 's' : ''}</small></div>`).join('')}</div>`;
          const agg = {};
          for (const x of stops) { if (x.z && x.z.home) continue; const key = x.z ? x.z.n : x.lat.toFixed(3) + ',' + x.lon.toFixed(3); agg[key] = agg[key] || { n: key, z: x.z, d: 0, c: 0, lat: x.lat, lon: x.lon }; agg[key].d += x.d; agg[key].c++; }
          const top = Object.values(agg).sort((x, y) => y.d - x.d).slice(0, 8);
          const rets = days.map((d) => { const hh = stops.filter((x) => x.z && x.z.home && x.t0 >= d.a + 12 * 3600e3 && x.t0 < d.a + 86400e3); return hh.length ? hh[0].t0 - d.a : null; }).filter((x) => x != null);
          const avg = rets.length ? Math.round(rets.reduce((x, y) => x + y, 0) / rets.length / 60000) : null;
          jh.innerHTML = `Semaine · ${esc(p.n)} <i>${km(days.reduce((x, d) => x + d.km, 0))} · ${days.reduce((x, d) => x + d.n, 0)} arrêts</i>`;
          tl.innerHTML = (avg != null ? `<div class="fam" style="--pc:${p.c}"><span class="dot"></span><div><b>Retour habituel à la maison</b><small>vers ${String(Math.floor(avg / 60)).padStart(2, '0')}h${String(avg % 60).padStart(2, '0')} l’après-midi (moyenne de la semaine)</small></div></div>` : '')
            + (top.length ? top.map((t, k) => `<div class="ev" data-act="ev" data-i="${k}" style="--pc:${p.c}"><div class="n"><b>${k + 1}</b></div><div class="x"><b>${t.z ? '🏬 ' + esc(t.n) : '<span class="hz">📌 Lieu sans zone</span>'}</b><small>${t.c} visite${t.c > 1 ? 's' : ''}${!t.z && t.c >= 2 ? ' · <em>revient souvent</em>' : ''}${!t.z && admin ? ` <button class="mz" data-act="mkzone" data-i="${k}">➕ Créer une zone</button>` : ''}</small></div><div class="d">${dur(t.d)}</div></div>`).join('') : '<div class="vide">Aucun arrêt cette semaine.</div>');
          shown = top;
          locs = top.map((t, k) => ({ id: 'lieu' + k, latitude: t.lat, longitude: t.lon, radius: t.z ? Math.min(t.z.r, 60) : 40, radius_color: p.c, icon: k < 9 ? 'mdi:numeric-' + (k + 1) + '-circle' : 'mdi:map-marker', name: `${k + 1}. ${t.z ? t.n : 'Lieu sans zone'} · ${t.c} visite(s) · ${dur(t.d)}`, location_editable: false, radius_editable: false }));
          fit = top.map((t) => [t.lat, t.lon]);
        } else if (this.mode === 'zones') {
          stats.style.display = 'none';
          try { this._zl = await this._h.callWS({ type: 'zone/list' }); } catch (er) { this._zl = []; }
          if (tok !== this._tok) return;
          const H = (this._h.states['zone.home'] || {}).attributes || {};
          const zl = this._zl.map((z) => ({ ...z, dh: H.latitude != null ? dist(H.latitude, H.longitude, z.latitude, z.longitude) : 0 })).sort((x, y) => x.dh - y.dh);
          jh.innerHTML = `Zones connues <i>${zl.length} zones</i>`;
          tl.innerHTML = zl.map((z, k) => `<div class="ev zr" data-act="ev" data-i="${k}" style="--pc:#ffd27a"><div class="n"><b>${k + 1}</b></div><div class="x"><b>${esc(z.name)}</b><small>rayon ${Math.round(z.radius)} m · ${km(z.dh)} de la maison</small></div>${admin ? `<div class="zb"><button data-act="zr" data-z="${esc(z.id)}" data-d="-10">−</button><button data-act="zr" data-z="${esc(z.id)}" data-d="10">+</button></div>` : ''}</div>`).join('') + '<div class="rule" style="margin-top:8px">Les rayons se règlent par 10 m. Pour en créer une : bouton « ➕ Créer une zone » sur un arrêt hors zone (Arrêts, Journée ou Semaine).</div>';
          shown = zl.map((z) => ({ lat: z.latitude, lon: z.longitude }));
          locs = zl.map((z, k) => ({ id: 'zone' + k, latitude: z.latitude, longitude: z.longitude, radius: z.radius, radius_color: '#ffd27a', icon: z.icon || 'mdi:map-marker', name: `${z.name} · ${Math.round(z.radius)} m`, location_editable: false, radius_editable: false }));
          fit = zl.map((z) => [z.latitude, z.longitude]); if (H.latitude != null) fit.push([H.latitude, H.longitude]);
        } else {
          stats.style.display = '';
          const pts = await this._points(p.id, t0, t1); if (tok !== this._tok) return;
          const stops = this._stops(pts, t1, endsNow);
          let seg = pts, ss = stops, sub = '';
          if (this.mode === 'dernier') {
            const L = stops[stops.length - 1];
            if (L && L.now) { const P2 = stops[stops.length - 2]; seg = P2 ? pts.slice(P2.i1, L.i0 + 1) : pts.slice(0, L.i0 + 1); ss = P2 ? [P2, L] : [L]; sub = P2 ? `${this._nom(P2)} → ${this._nom(L)}` : ''; }
            else if (L) { seg = pts.slice(L.i1); ss = [L]; sub = `En route depuis ${this._nom(L)}`; }
          }
          shown = ss;
          const outStops = ss.filter((s) => !(s.z && s.z.home)), away = ss.filter((s) => s.z && s.z.home).reduce((x, s) => x + s.d, 0);
          const span = seg.length ? (endsNow ? now : t1) - seg[0].t : 0;
          stats.innerHTML = `<div class="st"><b>${km(this._len(seg))}</b><span>Distance</span></div><div class="st"><b>${outStops.length}</b><span>Arrêts hors maison</span></div><div class="st"><b>${seg.length ? dur(Math.max(0, span - away)) : '—'}</b><span>Hors de la maison</span></div>`;
          jh.innerHTML = `Journal · ${esc(p.n)} <i>${esc(sub || (this.mode === '2h' ? '2 dernières heures' : this.mode === 'dernier' ? 'dernier trajet' : dayLbl))}</i>`;
          const leg = (s) => { const j = stops.indexOf(s), pv = j > 0 ? stops[j - 1] : null, a = pv ? pv.i1 : 0; if (s.i0 == null || s.i0 <= a) return ''; const L2 = this._len(pts.slice(a, s.i0 + 1)), T = s.t0 - (pv ? pv.t1 : pts[a].t); return L2 < 100 ? '' : `<div class="leg" style="--pc:${p.c}">🚗 ${km(L2)} · ${dur(T)} de route${pv ? ' depuis ' + esc(this._nom(pv)) : ''}</div>`; };
          tl.innerHTML = ss.length ? ss.map((s, k) => leg(s) + `<div class="ev ${s.now ? 'now' : ''}" data-act="ev" data-i="${k}" style="--pc:${p.c}"><div class="n"><b>${k + 1}</b></div><div class="x"><b>${s.z ? (s.z.home ? '🏠 ' : '🏬 ') + esc(s.z.n) : '<span class="hz">📌 Arrêt hors zone</span>'}</b><small>${hm(s.t0)} → ${s.now ? '<em>en cours</em>' : hm(s.t1)}${!s.z && admin ? ` <button class="mz" data-act="mkzone" data-i="${k}">➕ Créer une zone</button>` : ''}</small></div><div class="d">${dur(s.d)}</div></div>`).join('') : '<div class="vide">Aucun arrêt sur cette période.</div>';
          if (seg.length > 1) paths = [{ points: seg.map((q) => ({ point: [q.lat, q.lon], timestamp: new Date(q.t) })), color: p.c, gradualOpacity: 0.85, fullDatetime: true }];
          locs = ss.map((s, k) => ({ id: 'arret' + k, latitude: s.lat, longitude: s.lon, radius: s.z ? Math.min(s.z.r, 60) : 40, radius_color: p.c, icon: k < 9 ? 'mdi:numeric-' + (k + 1) + '-circle' : 'mdi:map-marker', name: `${k + 1}. ${this._nom(s)} · ${hm(s.t0)} · ${dur(s.d)}`, location_editable: false, radius_editable: false }));
          fit = seg.map((q) => [q.lat, q.lon]).concat(ss.map((s) => [s.lat, s.lon]));
          this._seg = seg; this._pc = p.c;
        }
      } catch (e) { tl.innerHTML = '<div class="vide">❌ Historique indisponible</div>'; }
      this._shown = shown; this._locs = locs; if (fam || this.mode === 'semaine' || this.mode === 'zones') this._seg = null;
      if (!(await this._ensureMap()) || tok !== this._tok) { mapBox.innerHTML = '<div class="ld">Carte indisponible</div>'; return; }
      const m = document.createElement('ha-map');
      m.hass = this._h; m.autoFit = true; m.zoom = 15; m.themeMode = 'dark'; m.paths = paths; m.editableLocations = locs;
      m.entities = this.mode === 'zones' || this.mode === 'semaine' ? [] : fam ? PEOPLE.map((q) => ({ entity_id: q.id, color: q.c })) : endsNow ? [{ entity_id: p.id, color: p.c }] : [];
      m.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'; mapBox.innerHTML = ''; mapBox.appendChild(m); this._map = m;
      if (fit.length) {
        const la = fit.map((x) => x[0]), lo = fit.map((x) => x[1]);
        setTimeout(() => { try { m.fitBounds([[Math.min(...la), Math.min(...lo)], [Math.max(...la), Math.max(...lo)]], { zoom: 16, padding: 40 }); } catch (e) {} }, 700);
      }
    }
  }
  if (!customElements.get('loc-hub-card')) customElements.define('loc-hub-card', LocHubCard);
  window.customCards = window.customCards || []; window.customCards.push({ type: 'loc-hub-card', name: 'Localisation v2 (hub)' });
})();
