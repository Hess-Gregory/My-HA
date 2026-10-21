/* « Je pars » — carte du compte à rebours (popup tablette) + décompte vocal des 10 dernières secondes.
   - custom:jp-countdown-card : grand compte à rebours lisible + petits boutons Pause/Reprendre et Annuler.
   - Décompte sonore (tablette, compte « Sam ») : « dix … un » une fois par seconde puis un bip prolongé,
     calé sur l'heure de fin réelle du timer ; tout s'arrête immédiatement si le décompte est annulé ou mis en pause.
   Le volume suit celui de la tablette (25 % en mode nuit, volume mémorisé sinon). */
(() => {
  const T = 'timer.compte_a_rebours_depart';
  const SND = '/local/sons/decompte/';
  const hass = () => { const e = document.querySelector('home-assistant'); return e && e.hass; };
  const leftOf = (t) => {
    if (!t) return null;
    if (t.state === 'paused') { const p = String(t.attributes.remaining || '0:0:0').split(':').map(Number); return (p[0] || 0) * 3600 + (p[1] || 0) * 60 + (p[2] || 0); }
    if (t.state === 'active' && t.attributes.finishes_at) return Math.max(0, (new Date(t.attributes.finishes_at) - Date.now()) / 1000);
    return null;
  };

  /* ---------- décompte sonore ---------- */
  if (!window.__jpAudio) {
    window.__jpAudio = true;
    const clips = {}; const load = (n) => { if (!clips[n]) { const a = new Audio(SND + n); a.preload = 'auto'; clips[n] = a; } return clips[n]; };
    let key = null, timers = [], playing = [];
    const stop = () => { timers.forEach(clearTimeout); timers = []; playing.forEach((a) => { try { a.pause(); a.currentTime = 0; } catch (e) {} }); playing = []; };
    const play = (n) => { const a = load(n); try { a.currentTime = 0; const p = a.play(); playing.push(a); if (p && p.catch) p.catch(() => {}); } catch (e) {} };
    const tick = () => {
      const h = hass(); if (!h || !h.user || !/^sam/i.test(h.user.name || '')) return;
      const t = h.states[T]; const k = t && t.state === 'active' ? t.attributes.finishes_at : null;
      if (k === key) return; key = k; stop(); if (!k) return;
      const end = new Date(k).getTime();
      for (let n = 10; n >= 1; n--) { const at = end - n * 1000 - Date.now(); if (at > -400) timers.push(setTimeout(() => play(n + '.mp3'), Math.max(0, at))); }
      timers.push(setTimeout(() => play('bip.wav'), Math.max(0, end - Date.now())));
      for (let n = 1; n <= 10; n++) load(n + '.mp3'); load('bip.wav');
    };
    setInterval(tick, 300);
  }

  /* ---------- carte popup ---------- */
  class JpCountdownCard extends HTMLElement {
    setConfig(c) { this.cfg = c || {}; }
    getCardSize() { return 4; }
    set hass(h) { this._h = h; if (!this._b) this._build(); this._upd(); }
    connectedCallback() { if (!this._iv) this._iv = setInterval(() => this._upd(), 250); }
    disconnectedCallback() { clearInterval(this._iv); this._iv = null; }
    _build() {
      this._b = true; const r = this.attachShadow({ mode: 'open' });
      r.innerHTML = `<style>
        :host{display:block}
        .c{background:rgba(38,28,58,.75);border-radius:16px;padding:14px 16px 12px;text-align:center;color:#f3eee6;font-family:var(--paper-font-body1_-_font-family,system-ui,Roboto,sans-serif)}
        .n{font-weight:200;font-size:clamp(84px,22vw,150px);line-height:1;color:#f6d68a;font-variant-numeric:tabular-nums;text-shadow:0 2px 14px rgba(0,0,0,.6)}
        .n.w{color:#ff8a65}
        .s{font-size:13px;color:#d9c4f0;margin:6px 0 10px;min-height:16px}
        .b{display:flex;gap:8px;justify-content:center}
        button{appearance:none;border:1px solid rgba(246,214,138,.3);background:rgba(255,255,255,.06);color:#f3eee6;border-radius:10px;padding:7px 14px;font:600 12px inherit;font-family:inherit;cursor:pointer}
        button.x{border-color:rgba(255,138,128,.45);color:#ffb4ab}
      </style><div class="c"><div class="n">–</div><div class="s"></div><div class="b"><button class="p"></button><button class="x">↩️ Annuler le départ</button></div></div>`;
      const run = (s) => this._h && this._h.callService('script', 'turn_on', { entity_id: 'script.' + s });
      r.querySelector('.p').onclick = () => run('je_pars_pause');
      r.querySelector('.x').onclick = () => run('je_pars_annuler');
      this.$ = (s) => r.querySelector(s);
    }
    _upd() {
      if (!this._b) return; const h = this._h || hass(); const t = h && h.states[T]; const left = leftOf(t);
      const P = t && t.state === 'paused';
      const n = left == null ? '–' : String(Math.ceil(left));
      this.$('.n').textContent = n; this.$('.n').classList.toggle('w', left != null && left <= 10 && !P);
      this.$('.s').textContent = P ? 'Décompte en pause — l’alarme ne s’armera pas' : left == null ? '' : 'secondes avant l’armement total de l’alarme';
      this.$('.p').textContent = P ? '▶️ Reprendre' : '⏸ Pause';
    }
  }
  if (!customElements.get('jp-countdown-card')) customElements.define('jp-countdown-card', JpCountdownCard);
})();
