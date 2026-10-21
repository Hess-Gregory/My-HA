/* Barre de raccourcis vers les dashboards principaux (style Accueil : verre violet, accents or).
   Config : type: custom:raccourcis-card ; position: top|bottom (marge) ; liens optionnels [{n, i, p}] */
(() => {
  const DEF = [
    { n: 'Éclairage', i: '💡', p: '/maison-eclairage' },
    { n: 'Streaming', i: '🎬', p: '/maison-streaming' },
    { n: 'Ma maison', i: '🏠', p: '/ma-maison' },
    { n: 'Calendrier', i: '📅', p: '/dashboard-calendrier' },
    { n: 'Sécurité', i: '🛡️', p: '/maison-securite' },
    { n: 'Mon confort', i: '🌡️', p: '/mon-confort' },
  ];
  class RaccourcisCard extends HTMLElement {
    setConfig(c) { this.cfg = c || {}; this._b = false; }
    getCardSize() { return 1; }
    set hass(h) { this._h = h; if (!this._b) this._build(); this._act(); }
    _build() {
      this._b = true; const r = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const L = this.cfg.liens || DEF; const pos = this.cfg.position === 'bottom' ? 'margin-top:8px' : 'margin-bottom:8px';
      r.innerHTML = `<style>
        :host{display:block;${pos}}
        .bar{display:grid;grid-template-columns:repeat(${L.length},minmax(0,1fr));gap:8px;padding:8px;border-radius:20px;background:rgba(25,18,38,.62);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(246,214,138,.18);box-shadow:0 6px 24px rgba(0,0,0,.35)}
        a{display:flex;align-items:center;justify-content:center;gap:8px;padding:10px 6px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#f3eee6;text-decoration:none;font:600 14px var(--paper-font-body1_-_font-family,system-ui,Roboto,sans-serif);white-space:nowrap;overflow:hidden;transition:background .15s,transform .08s;cursor:pointer}
        a:active{transform:scale(.97)} a i{font-style:normal;font-size:18px} a span{overflow:hidden;text-overflow:ellipsis}
        a.on{background:rgba(246,214,138,.16);border-color:rgba(246,214,138,.55);color:#f6d68a}
        @media (max-width:700px){a span{display:none} a i{font-size:22px}}
      </style><nav class="bar">${L.map((l) => `<a data-p="${l.p}"><i>${l.i}</i><span>${l.n}</span></a>`).join('')}</nav>`;
      if (!this._ro) { this._ro = new ResizeObserver(() => document.documentElement.style.setProperty('--rc', (this.offsetHeight + 16) + 'px')); this._ro.observe(this); }
      r.querySelectorAll('a').forEach((a) => (a.onclick = () => { history.pushState(null, '', a.dataset.p); window.dispatchEvent(new CustomEvent('location-changed')); }));
    }
    disconnectedCallback() { if (this._ro) { this._ro.disconnect(); this._ro = null; } document.documentElement.style.removeProperty('--rc'); }
    connectedCallback() { if (this._b && !this._ro) { this._ro = new ResizeObserver(() => document.documentElement.style.setProperty('--rc', (this.offsetHeight + 16) + 'px')); this._ro.observe(this); } }
    _act() { (this.shadowRoot ? this.shadowRoot.querySelectorAll('a') : []).forEach((a) => a.classList.toggle('on', location.pathname.startsWith(a.dataset.p))); }
  }
  if (!customElements.get('raccourcis-card')) customElements.define('raccourcis-card', RaccourcisCard);
  window.customCards = window.customCards || []; window.customCards.push({ type: 'raccourcis-card', name: 'Raccourcis dashboards' });
})();
