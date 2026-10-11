/* Cave — état de la zone, désarmement par code, décompte du réarmement automatique (design Accueil). */
const CV = { a: 'alarm_control_panel.buanderie_centrale_alarme_ajax_cave', d: 'binary_sensor.cave_sous_sol_cave_porte', t: 'timer.cave_rearmement' };
class CaveAlarmCard extends HTMLElement {
  setConfig(c) { this.cfg = c || {}; }
  getCardSize() { return 3; }
  set hass(h) { this._h = h; if (!this._b) this._build(); this._upd(); }
  connectedCallback() { if (!this._tk) this._tk = setInterval(() => this._upd(), 1000); }
  disconnectedCallback() { clearInterval(this._tk); this._tk = null; }
  _build() {
    this._b = true; const r = this.attachShadow({ mode: 'open' });
    r.innerHTML = `<style>
      :host{display:block}*{box-sizing:border-box}
      .c{border-radius:20px;padding:14px 16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09);color:#f3eee6;font:500 14px system-ui,Roboto,sans-serif;display:grid;grid-template-columns:auto 1fr auto;gap:6px 14px;align-items:center;transition:border-color .3s,background .3s}
      .c.off{border-color:rgba(255,183,77,.55);background:rgba(255,183,77,.08)} .c.arm{border-color:rgba(127,224,168,.4)}
      .i{font-size:30px;grid-row:1/3} .t{font:300 20px system-ui} .s{font-size:12px;color:rgba(243,238,230,.65)}
      .n{grid-row:1/3;font:200 34px system-ui;font-variant-numeric:tabular-nums;color:#ffd27a}
      .b{grid-column:1/-1;display:flex;gap:8px;margin-top:6px}
      button{flex:1;appearance:none;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);color:#f3eee6;border-radius:14px;padding:11px 8px;font:700 13px system-ui;cursor:pointer}
      button.p{background:#ffd27a;color:#1c1826;border-color:#ffd27a} button:active{transform:scale(.97)}
    </style><div class="c"><div class="i">🛡️</div><div class="t"></div><div class="n"></div><div class="s"></div><div class="b"></div></div>`;
    this.$ = (s) => r.querySelector(s);
  }
  _left() { const t = this._h.states[CV.t]; if (!t || t.state !== 'active' || !t.attributes.finishes_at) return null; return Math.max(0, Math.round((new Date(t.attributes.finishes_at) - Date.now()) / 1000)); }
  _upd() {
    if (!this._h || !this._b) return; const a = this._h.states[CV.a], d = this._h.states[CV.d]; if (!a) return;
    const armed = a.state.startsWith('armed'), dis = a.state === 'disarmed', open = d && d.state === 'on', left = this._left();
    const c = this.$('.c'); c.classList.toggle('off', dis); c.classList.toggle('arm', armed);
    this.$('.i').textContent = armed ? '🛡️' : open ? '🚪' : '🔓';
    this.$('.t').textContent = 'Cave · ' + (armed ? 'protégée' : dis ? 'désactivée' : a.state === 'triggered' ? '⚠️ ALARME' : a.state);
    this.$('.s').textContent = armed ? 'Zone armée' : dis ? (open ? 'Porte ouverte — réarmement suspendu' : left != null ? 'Réarmement automatique en cours' : 'Porte fermée') : '';
    this.$('.n').textContent = dis && left != null ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}` : '';
    const key = armed ? 'A' : dis ? 'D' + (left != null ? 1 : 0) : 'X'; if (this._k === key) return; this._k = key;
    const b = this.$('.b'); b.innerHTML = '';
    const mk = (txt, cls, fn) => { const e = document.createElement('button'); e.textContent = txt; if (cls) e.className = cls; e.onclick = fn; b.appendChild(e); };
    if (armed) mk('🔓 Désarmer la cave', 'p', () => this._pad());
    else if (dis) { mk('🛡️ Réarmer maintenant', 'p', () => this._h.callService('script', 'turn_on', { entity_id: 'script.cave_rearmer_maintenant' })); if (left != null) mk('⏱️ +10 min', '', () => this._h.callService('script', 'turn_on', { entity_id: 'script.cave_prolonger' })); }
  }
  _pad() {
    const old = document.querySelector('.cvpad'); if (old) old.remove();
    const o = document.createElement('div'); o.className = 'cvpad';
    o.style.cssText = 'position:fixed;inset:0;z-index:999;background:rgba(5,6,12,.66);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center';
    o.innerHTML = '<div style="background:linear-gradient(160deg,#1f1c30,#12111c);color:#f3eee6;border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:20px;width:300px;text-align:center;font-family:system-ui,Roboto,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.7)"><div style="font:600 17px system-ui">🔓 Désarmer la cave</div><div class="dots" style="font:300 30px system-ui;letter-spacing:8px;margin:12px 0 4px">····</div><div class="msg" style="height:18px;font-size:12px"></div><div class="k" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px"></div><button class="ok" style="margin-top:12px;width:100%;padding:13px;border:none;border-radius:14px;background:#ffd27a;color:#1c1826;font:700 15px system-ui;cursor:pointer">Valider</button></div>';
    let code = ''; const dots = o.querySelector('.dots'), msg = o.querySelector('.msg'); const up = () => { dots.textContent = code ? '●'.repeat(code.length) : '····'; };
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '✕', '0', '⌫'].forEach((k) => { const e = document.createElement('button'); e.textContent = k; e.style.cssText = 'padding:14px 0;border:none;border-radius:14px;background:rgba(255,255,255,.08);color:#fff;font:600 20px system-ui;cursor:pointer';
      e.onclick = (ev) => { ev.stopPropagation(); if (k === '✕') return o.remove(); if (k === '⌫') code = code.slice(0, -1); else if (code.length < 12) code += k; msg.textContent = ''; up(); }; o.querySelector('.k').appendChild(e); });
    o.onclick = (ev) => { if (ev.target === o) o.remove(); };
    o.querySelector('.ok').onclick = async (ev) => { ev.stopPropagation(); if (!code) return; msg.style.color = '#ffd27a'; msg.textContent = 'Vérification…';
      try { const r = await this._h.callWS({ type: 'call_service', domain: 'script', service: 'cave_desarmer_code', service_data: { code }, return_response: true }); if (r && r.response && r.response.ok) { o.remove(); return; } msg.style.color = '#ff8a80'; msg.textContent = 'Code refusé'; }
      catch (e) { msg.style.color = '#ff8a80'; msg.textContent = 'Erreur : ' + (e.message || e.code || ''); } code = ''; up(); };
    document.body.appendChild(o);
  }
}
if (!customElements.get('cave-alarm-card')) customElements.define('cave-alarm-card', CaveAlarmCard);
window.customCards = window.customCards || []; window.customCards.push({ type: 'cave-alarm-card', name: 'Cave — alarme' });
