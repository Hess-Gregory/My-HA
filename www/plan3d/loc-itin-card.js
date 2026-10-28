/* Itinéraires & arrêts par personne (style Accueil : verre violet, accents or).
   Arrêt = immobile ≥ 5 min dans une zone connue (magasin, travail…) ou ≥ 10 min hors zone (évite bouchons / feux).
   Config : type: custom:loc-itin-card ; persons (optionnel) : [{id, n, c}] */
(() => {
  const DEF = [
    { id: 'person.sandrine', n: 'Sandrine', c: '#f472b6' },
    { id: 'person.greg', n: 'Greg', c: '#38bdf8' },
    { id: 'person.matteo', n: 'Matteo', c: '#4ade80' },
  ];
  const MODES = [['arrets', '📍 Arrêts visités'], ['dernier', '🧭 Dernier itinéraire'], ['2h', '⏱️ 2 dernières heures'], ['jour', '📅 Itinéraire du jour']];
  const MIN_ZONE = 5, MIN_HORS = 10, R_HORS = 100, ACC_MAX = 200;
  const rad = (x) => (x * Math.PI) / 180;
  const dist = (a, b, c, d) => { const q = Math.sin(rad(c - a) / 2) ** 2 + Math.cos(rad(a)) * Math.cos(rad(c)) * Math.sin(rad(d - b) / 2) ** 2; return 12742000 * Math.asin(Math.sqrt(q)); };
  const hm = (t) => new Date(t).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
  const dur = (ms) => { const m = Math.round(ms / 60000); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0'); };
  const km = (m) => (m < 1000 ? Math.round(m) + ' m' : (m / 1000).toFixed(m < 10000 ? 1 : 0).replace('.', ',') + ' km');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  class LocItinCard extends HTMLElement {
    setConfig(c) { this.cfg = c || {}; this.P = this.cfg.persons || DEF; this.sel = 0; this.mode = 'arrets'; this.day = 0; this._b = false; }
    getCardSize() { return 12; }
    set hass(h) { this._h = h; if (!this._b) { this._b = true; this._build(); this._load(); } }

    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: 'open' });
      r.innerHTML = `<style>
        :host{display:block}
        .w{padding:14px;border-radius:22px;background:rgba(25,18,38,.62);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(246,214,138,.18);box-shadow:0 6px 24px rgba(0,0,0,.35);color:#f3eee6;font-family:var(--paper-font-body1_-_font-family,system-ui,Roboto,sans-serif)}
        h2{margin:0 0 10px;font-size:20px;color:#f6d68a;font-weight:800}
        .row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}
        button{font:600 14px inherit;font-family:inherit;color:#f3eee6;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:9px 14px;cursor:pointer}
        button.on{background:rgba(246,214,138,.16);border-color:rgba(246,214,138,.6);color:#f6d68a}
        button.pp.on{border-color:var(--pc);color:#fff;background:color-mix(in srgb,var(--pc) 30%,transparent)}
        .sum{display:flex;flex-wrap:wrap;gap:8px;margin:2px 0 10px}
        .chip{padding:4px 11px;border-radius:99px;background:rgba(255,255,255,.08);font-size:13px;font-weight:700}
        .map{height:430px;border-radius:16px;overflow:hidden;border:1px solid rgba(246,214,138,.2);margin-bottom:10px;position:relative;background:#15101f}
        .map ha-map{height:100%;display:block}
        .ld{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:14px;opacity:.7}
        .list{display:flex;flex-direction:column;gap:7px}
        .it{display:flex;gap:10px;align-items:center;padding:9px 11px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);cursor:pointer}
        .it:active{transform:scale(.99)}
        .nb{flex:0 0 28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#0b1020;background:var(--pc)}
        .it b{display:block;font-size:15px}
        .it small{font-size:12.5px;opacity:.75}
        .it .hz{color:#f6d68a}
        .it a{margin-left:auto;color:#f6d68a;text-decoration:none;font-size:13px;font-weight:700}
        .vide{padding:14px;text-align:center;opacity:.7}
        .lg{font-size:12px;opacity:.6;margin-top:8px}
      </style>
      <div class="w"><h2>🗺️ Itinéraires & arrêts${this.P.length < 2 ? ' · ' + esc(this.P[0].n) : ''}</h2>
        <div class="row ppl"${this.P.length < 2 ? ' style="display:none"' : ''}>${this.P.map((p, i) => `<button class="pp" data-i="${i}" style="--pc:${p.c}">${esc(p.n)}</button>`).join('')}</div>
        <div class="row md">${MODES.map(([k, l]) => `<button class="m" data-k="${k}">${l}</button>`).join('')}</div>
        <div class="row dy"><button class="d" data-d="0">Aujourd’hui</button><button class="d" data-d="1">Hier</button></div>
        <div class="sum"></div><div class="map"><div class="ld">Chargement…</div></div><div class="list"></div>
        <div class="lg">Arrêt = immobile au moins ${MIN_ZONE} min dans une zone connue, ou ${MIN_HORS} min ailleurs (les bouchons et feux ne comptent pas).</div>
      </div>`;
      r.querySelectorAll('.pp').forEach((b) => (b.onclick = () => { this.sel = +b.dataset.i; this._load(); }));
      r.querySelectorAll('.m').forEach((b) => (b.onclick = () => { this.mode = b.dataset.k; this._load(); }));
      r.querySelectorAll('.d').forEach((b) => (b.onclick = () => { this.day = +b.dataset.d; this._load(); }));
    }

    _zones() {
      return Object.values(this._h.states).filter((s) => s.entity_id.startsWith('zone.') && s.attributes.latitude != null && !s.attributes.passive)
        .map((z) => ({ n: z.entity_id === 'zone.home' ? 'Maison' : z.attributes.friendly_name, lat: z.attributes.latitude, lon: z.attributes.longitude, r: z.attributes.radius || 100, home: z.entity_id === 'zone.home' }));
    }

    async _points(id, t0, t1) {
      const res = await this._h.callWS({ type: 'history/history_during_period', start_time: new Date(t0).toISOString(), end_time: new Date(t1).toISOString(), entity_ids: [id], minimal_response: false, no_attributes: false, significant_changes_only: false });
      const rows = res[id] || []; let a = {}; const pts = [];
      for (const s of rows) {
        if (s.a) a = s.a;
        const t = ((s.lu || s.lc) * 1000) || 0;
        if (a.latitude == null || !t) continue;
        if ((a.gps_accuracy || 0) > ACC_MAX) continue;
        const p = { t: Math.max(t, t0), lat: a.latitude, lon: a.longitude };
        const l = pts[pts.length - 1];
        if (l && l.lat === p.lat && l.lon === p.lon) continue;
        pts.push(p);
      }
      return pts;
    }

    _stops(pts, tEndRange, endsNow) {
      const Z = this._zones();
      const zoneOf = (lat, lon) => { let b = null; for (const z of Z) { const d = dist(z.lat, z.lon, lat, lon); if (d <= z.r + 30 && (!b || d < b.d)) b = { ...z, d }; } return b; };
      const out = []; let i = 0;
      while (i < pts.length) {
        const a = pts[i], z = zoneOf(a.lat, a.lon);
        const cLat = z ? z.lat : a.lat, cLon = z ? z.lon : a.lon, R = z ? z.r + 30 : R_HORS;
        let j = i, sLat = a.lat, sLon = a.lon;
        while (j + 1 < pts.length && dist(cLat, cLon, pts[j + 1].lat, pts[j + 1].lon) <= R) { j++; sLat += pts[j].lat; sLon += pts[j].lon; }
        const last = j + 1 >= pts.length, t1 = last ? tEndRange : pts[j + 1].t;
        // positions espacées : arrivée estimée à mi-chemin entre le dernier point hors du lieu et le premier point sur place
        const lastT1 = out.length ? out[out.length - 1].t1 : 0, t0 = Math.max(i > 0 ? Math.round((pts[i - 1].t + a.t) / 2) : a.t, lastT1), d = t1 - t0, single = j === i;
        // un seul point GPS sur place : il faut que le téléphone y reste au moins 4 min (8 hors zone) pour ne pas compter un simple passage
        if (d >= (z ? MIN_ZONE : MIN_HORS) * 60000 && (!single || t1 - a.t >= (z ? 4 : 8) * 60000)) {
          const n = j - i + 1;
          out.push({ t0, t1, d, z, lat: z ? z.lat : sLat / n, lon: z ? z.lon : sLon / n, now: last && endsNow, i0: i, i1: j });
        }
        i = j + 1;
      }
      const m = [];
      for (const s of out) {
        const p = m[m.length - 1];
        if (p && dist(p.lat, p.lon, s.lat, s.lon) < 150 && s.t0 - p.t1 < 5 * 60000 && (p.z || {}).n === (s.z || {}).n) { p.t1 = s.t1; p.d = p.t1 - p.t0; p.now = s.now; p.i1 = s.i1; } else m.push({ ...s });
      }
      return m;
    }

    async _ensureMap() {
      if (customElements.get('ha-map')) return true;
      try { const hp = await window.loadCardHelpers(); hp.createCardElement({ type: 'map', entities: ['zone.home'] }); } catch (e) {}
      await Promise.race([customElements.whenDefined('ha-map'), new Promise((r) => setTimeout(r, 6000))]);
      return !!customElements.get('ha-map');
    }

    async _load() {
      const r = this.shadowRoot, p = this.P[this.sel], tok = (this._tok = Math.random());
      r.querySelectorAll('.pp').forEach((b) => b.classList.toggle('on', +b.dataset.i === this.sel));
      r.querySelectorAll('.m').forEach((b) => b.classList.toggle('on', b.dataset.k === this.mode));
      r.querySelector('.dy').style.display = this.mode === 'arrets' || this.mode === 'jour' ? '' : 'none';
      r.querySelectorAll('.d').forEach((b) => b.classList.toggle('on', +b.dataset.d === this.day));
      const mapBox = r.querySelector('.map'), list = r.querySelector('.list'), sum = r.querySelector('.sum');
      mapBox.innerHTML = '<div class="ld">Chargement…</div>'; list.innerHTML = ''; sum.innerHTML = ''; if (this.mode === 'arrets') mapBox.before(list); else mapBox.after(list);
      const now = Date.now(), d0 = new Date(); d0.setHours(0, 0, 0, 0);
      let t0, t1, endsNow = true;
      if (this.mode === '2h') { t0 = now - 2 * 3600e3; t1 = now; }
      else if (this.mode === 'dernier') { t0 = now - 36 * 3600e3; t1 = now; }
      else if (this.day === 1) { t0 = d0.getTime() - 86400e3; t1 = d0.getTime(); endsNow = false; }
      else { t0 = d0.getTime(); t1 = now; }
      let pts;
      try { pts = await this._points(p.id, t0, t1); } catch (e) { mapBox.innerHTML = '<div class="ld">❌ Historique indisponible</div>'; return; }
      if (tok !== this._tok) return;
      const stops = this._stops(pts, t1, endsNow);
      let seg = pts, segStops = stops, titre = '';
      if (this.mode === 'dernier') {
        const L = stops[stops.length - 1];
        if (L && L.now) { const P2 = stops[stops.length - 2]; seg = P2 ? pts.slice(P2.i1, L.i0 + 1) : pts.slice(0, L.i0 + 1); segStops = P2 ? [P2, L] : [L]; titre = P2 ? `De ${this._nom(P2)} à ${this._nom(L)}` : `Jusqu’à ${this._nom(L)}`; }
        else if (L) { seg = pts.slice(L.i1); segStops = [L]; titre = `En route depuis ${this._nom(L)} (${hm(L.t1)})`; }
        else titre = 'Aucun arrêt sur les dernières 36 h';
      }
      let tot = 0; for (let k = 1; k < seg.length; k++) tot += dist(seg[k - 1].lat, seg[k - 1].lon, seg[k].lat, seg[k].lon);
      const chips = [];
      if (titre) chips.push(`<span class="chip">${esc(titre)}</span>`);
      chips.push(`<span class="chip">📏 ${km(tot)}</span>`, `<span class="chip">📍 ${segStops.length} arrêt${segStops.length > 1 ? 's' : ''}</span>`);
      if (seg.length) chips.push(`<span class="chip">🕒 ${hm(seg[0].t)} → ${this.mode === 'jour' && this.day === 1 ? hm(seg[seg.length - 1].t) : (endsNow ? 'maintenant' : hm(t1))}</span>`);
      sum.innerHTML = chips.join('');
      list.innerHTML = segStops.length ? segStops.map((s, k) => `<div class="it" data-k="${k}" style="--pc:${p.c}"><div class="nb">${k + 1}</div><div><b>${s.z ? (s.z.home ? '🏠 ' : '🏬 ') + esc(s.z.n) : '<span class="hz">📌 Arrêt hors zone</span>'}</b><small>${hm(s.t0)} → ${s.now ? 'en cours' : hm(s.t1)} · ${dur(s.d)}</small></div><a href="https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lon}" target="_blank" rel="noopener">Carte ↗</a></div>`).join('') : '<div class="vide">Aucun arrêt sur cette période.</div>';
      if (!(await this._ensureMap()) || tok !== this._tok) { mapBox.innerHTML = '<div class="ld">Carte indisponible</div>'; return; }
      const m = document.createElement('ha-map');
      m.hass = this._h; m.autoFit = true; m.zoom = 14; m.themeMode = 'dark';
      m.paths = seg.length > 1 ? [{ points: seg.map((q) => ({ point: [q.lat, q.lon], timestamp: new Date(q.t) })), color: p.c, gradualOpacity: 0.85, fullDatetime: true }] : [];
      m.entities = endsNow ? [{ entity_id: p.id, color: p.c }] : [];
      m.editableLocations = segStops.map((st, k) => ({ id: 'arret' + k, latitude: st.lat, longitude: st.lon, radius: st.z ? Math.min(st.z.r, 60) : 40, radius_color: p.c, icon: k < 9 ? 'mdi:numeric-' + (k + 1) + '-circle' : 'mdi:map-marker', name: (k + 1) + '. ' + this._nom(st) + ' · ' + hm(st.t0) + ' · ' + dur(st.d), location_editable: false, radius_editable: false }));
      mapBox.innerHTML = ''; mapBox.appendChild(m);
      const ll = seg.map((q) => [q.lat, q.lon]).concat(segStops.map((st) => [st.lat, st.lon]));
      if (ll.length) {
        const la = ll.map((x) => x[0]), lo = ll.map((x) => x[1]);
        const bb = [[Math.min(...la), Math.min(...lo)], [Math.max(...la), Math.max(...lo)]];
        setTimeout(() => { try { m.fitBounds(bb, { zoom: 16, padding: 30 }); } catch (e) {} }, 600);
      }
      list.querySelectorAll('.it').forEach((el) => (el.onclick = (e) => { if (e.target.tagName === 'A') return; const st = segStops[+el.dataset.k]; try { m.setView([st.lat, st.lon], 17); } catch (er) {} }));
    }

    _nom(s) { return s.z ? s.z.n : 'un arrêt hors zone'; }
  }
  if (!customElements.get('loc-itin-card')) customElements.define('loc-itin-card', LocItinCard);
  window.customCards = window.customCards || []; window.customCards.push({ type: 'loc-itin-card', name: 'Itinéraires & arrêts' });
})();
