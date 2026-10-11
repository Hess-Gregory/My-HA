/* Streaming — salle de cinéma : écran « en cours » adaptatif (Orange TV, YouTube, Spotify, radio), ambilight, radios, ampli, télécommandes en popup. */
const E = {
  box: 'media_player.orange_tv_box', rem: 'remote.orange_tv_box', tv: 'media_player.televiseur_du_salon',
  sp: 'media_player.spotifyplus_gregory_hess', amp: 'media_player.ampli_cine', sel: 'input_select.telecommande_active',
};
const ORANGE_APP = 'com.orange.be.nexx4.tv.android';
const RADIOS = [
  ['NRJ Belgique', 'presets:1', 'NRJ', ['#e2001a', '#7a0010']],
  ['Fun Radio', 'list:net_radio:3:3', 'FUN', ['#ff2d87', '#7b1fa2']],
  ['LFM Liège', 'list:net_radio:3:5', 'LFM', ['#00a3e0', '#004a8f']],
  ['GalaxieFM', 'list:net_radio:3:4', 'GXY', ['#8e5cff', '#2b1a6b']],
  ['Contact FM', 'list:net_radio:3:7', 'CTC', ['#ffb400', '#c4501b']],
];
const SOURCES = [['ORANGE BOX', '📺 Box'], ['Spotify', '🎵 Spotify'], ['NET RADIO', '📻 Radio'], ['TV', '🖥️ TV'], ['Bluetooth', 'ᛒ Bluetooth']];
const MODES = { tv: ['📺', 'Orange TV', '#ff7a1a'], youtube: ['▶', 'YouTube', '#ff3040'], spotify: ['🎵', 'Spotify', '#1ed760'], radio: ['📻', 'Radio', '#8e5cff'] };
const OFF = ['off', 'unavailable', 'unknown', 'standby'];

class StreamingCard extends HTMLElement {
  setConfig(c) { this.cfg = c || {}; }
  getCardSize() { return 12; }
  set hass(h) { this._h = h; if (this._ftr) this._ftr.hass = h; if (!this._b) this._build(); if (!this._raf) this._raf = requestAnimationFrame(() => { this._raf = null; this._upd(); }); (this._pops || []).forEach((el) => { el.hass = h; }); }
  _s(e) { return this._h && this._h.states[e]; }
  _a(e, k) { const s = this._s(e); return s ? s.attributes[k] : undefined; }
  _txt(e) { const s = this._s(e); return s && !['unknown', 'unavailable', ''].includes(s.state) ? s.state : ''; }
  _call(d, s, data) { return this._h.callService(d, s, data || {}); }
  _more(e) { this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: e }, bubbles: true, composed: true })); }

  _build() {
    this._b = true; const r = this.attachShadow({ mode: 'open' });
    r.innerHTML = `<style>
      :host{container-type:inline-size;display:block;--g:rgba(255,255,255,.06);--b:rgba(255,255,255,.09);--t:#f3eee6;--m:rgba(243,238,230,.6);--a:#ffd27a;--amb:#ff7a1a;color:var(--t);font:500 14px system-ui,Roboto,sans-serif}
      *{box-sizing:border-box} button{appearance:none;font:700 12px system-ui,Roboto,sans-serif;color:var(--t);cursor:pointer;border:1px solid var(--b);background:rgba(255,255,255,.06);border-radius:14px;-webkit-tap-highlight-color:transparent;transition:background .2s,border-color .2s,transform .1s}
      button:active{transform:scale(.95)}
      .w{position:relative;isolation:isolate;overflow:hidden;display:grid;gap:12px;padding:10px;border-radius:22px;grid-template-columns:minmax(0,1.65fr) minmax(300px,1fr);grid-template-rows:auto minmax(0,1fr) auto;height:calc(100vh - var(--top,56px) - var(--fh,0px) - 1px);min-height:600px;background:radial-gradient(140% 90% at 50% 0%,#121426 0%,#07080f 70%)}
      .w>*{position:relative;z-index:1}
      .bgfx{position:absolute;inset:-20%;z-index:0!important;pointer-events:none;filter:blur(80px) saturate(140%);opacity:.5}
      .bgfx i{position:absolute;border-radius:50%;mix-blend-mode:screen;animation:drift 40s ease-in-out infinite alternate;transition:background 1.5s}
      .bgfx i:nth-child(1){width:60%;height:65%;left:0;top:10%;background:radial-gradient(circle,#ff9a5a,transparent 65%)}
      .bgfx i:nth-child(2){width:50%;height:55%;right:2%;top:5%;background:radial-gradient(circle,#7b5cff,transparent 65%);animation-duration:48s;animation-delay:-14s}
      .bgfx i:nth-child(3){width:45%;height:50%;left:35%;bottom:0;background:radial-gradient(circle,#1fb6c9,transparent 65%);animation-duration:55s;animation-delay:-25s}
      @keyframes drift{from{transform:translate(0,0) scale(1)}to{transform:translate(6%,5%) scale(1.08)}}
      .vig{position:absolute;inset:0;z-index:0!important;pointer-events:none;background:radial-gradient(120% 100% at 50% 40%,transparent 55%,rgba(0,0,0,.6) 100%)}
      .p{background:var(--g);border:1px solid var(--b);border-radius:20px;padding:12px 14px;min-height:0;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
      .h{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--m);margin:0 0 9px;display:flex;justify-content:space-between;align-items:center;gap:8px}
      .top{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 14px}
      .tt{font:300 26px/1 system-ui,Roboto,sans-serif;letter-spacing:-.02em} .clk{font:300 22px system-ui;color:var(--m);margin:0 6px 0 auto;font-variant-numeric:tabular-nums}
      .pills{display:flex;gap:6px;flex-wrap:wrap;margin-left:14px}
      .pill{height:38px;padding:0 14px;border-radius:999px;display:flex;align-items:center;gap:7px;font-size:13px}
      .pill i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.18);font-style:normal}
      .pill.live i{background:var(--c);box-shadow:0 0 10px var(--c);animation:pulse 1.6s infinite}
      .pill.foc{background:rgba(255,210,122,.14);border-color:rgba(255,210,122,.6);color:var(--a)}
      @keyframes pulse{50%{opacity:.35}}
      /* scène */
      .stage{display:flex;flex-direction:column;gap:12px;min-height:0}
      .scr-w{position:relative;flex:1;min-height:0;display:flex;align-items:center;justify-content:center}
      .amb{position:absolute;inset:8% 6%;border-radius:40px;background:var(--amb);filter:blur(60px);opacity:.3;transition:background 1.5s,opacity 1s;animation:breathe 6s ease-in-out infinite}
      @keyframes breathe{50%{opacity:.18;transform:scale(.97)}}
      .scr{position:relative;width:100%;max-height:100%;aspect-ratio:16/9;border-radius:22px;overflow:hidden;background:#05060b;border:1px solid rgba(255,255,255,.12);box-shadow:0 30px 80px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,255,255,.04);cursor:pointer}
      @supports (height:100cqh){.scr-w{container-type:size}.scr{width:min(100%,calc(100cqh*16/9))}}
      .art{position:absolute;inset:-30px;background-size:cover;background-position:center;filter:blur(30px) brightness(.55) saturate(1.3);transform:scale(1.1);transition:background-image .6s}
      .lay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
      .lay>*{transition:opacity .5s}
      /* mode TV */
      .tvv{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:radial-gradient(80% 70% at 50% 45%,color-mix(in srgb,var(--amb) 35%,#000) 0%,#05060b 75%)}
      .tvv::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 1px,transparent 1px 3px);animation:scan 8s linear infinite;pointer-events:none}
      @keyframes scan{to{background-position:0 120px}}
      .chn{font:800 clamp(54px,9cqw,120px)/1 system-ui;letter-spacing:-.04em;color:#fff;text-shadow:0 0 40px var(--amb)}
      .chl{font:300 clamp(18px,2.6cqw,30px)/1.1 system-ui;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.85)}
      /* mode musique : vinyle */
      .mus{position:absolute;inset:0 0 24% 0;display:flex;align-items:center;justify-content:center;gap:0}
      .vid{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(80% 70% at 50% 45%,color-mix(in srgb,var(--amb) 30%,#000),#05060b 75%)}
      .vimg{position:absolute;inset:0;background:center/cover no-repeat} .vlogo{width:110px;height:76px;border-radius:22px;background:#ff1f33;color:#fff;display:flex;align-items:center;justify-content:center;font-size:38px;box-shadow:0 0 60px rgba(255,31,51,.6)}
      .slv{position:relative;height:80%;aspect-ratio:1;border-radius:10px;background:#222 center/cover;box-shadow:0 20px 50px rgba(0,0,0,.7);z-index:2}
      .vin{height:76%;aspect-ratio:1;border-radius:50%;margin-left:-26%;z-index:1;background:repeating-radial-gradient(circle,#0c0c0e 0 2px,#17171b 2px 4px);box-shadow:0 18px 40px rgba(0,0,0,.7),inset 0 0 0 2px #000;display:flex;align-items:center;justify-content:center;animation:spin 5s linear infinite;animation-play-state:paused;transition:margin .8s cubic-bezier(.2,.8,.2,1)}
      .vin.go{animation-play-state:running;margin-left:-8%}
      .vin::before{content:'';position:absolute;width:100%;height:100%;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 20%,rgba(255,255,255,.08) 25%,transparent 30% 70%,rgba(255,255,255,.06) 75%,transparent 80%)}
      .lbl{width:36%;aspect-ratio:1;border-radius:50%;background:#333 center/cover;border:3px solid #0c0c0e}
      @keyframes spin{to{transform:rotate(360deg)}}
      /* idle */
      .idl{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--m);text-align:center}
      .idl b{font:300 clamp(22px,3cqw,34px) system-ui;color:var(--t)}
      .beam{position:absolute;top:-10%;left:50%;width:70%;height:120%;transform:translateX(-50%);background:conic-gradient(from 165deg at 50% 0%,transparent 0deg,rgba(255,220,160,.10) 12deg,rgba(255,220,160,.02) 24deg,transparent 30deg);animation:beam 7s ease-in-out infinite alternate;pointer-events:none}
      @keyframes beam{to{transform:translateX(-50%) rotate(6deg)}}
      .meta{position:absolute;left:0;right:0;bottom:0;padding:22px 24px 18px;background:linear-gradient(transparent,rgba(0,0,0,.82));display:flex;flex-direction:column;gap:4px}
      .bdg{display:flex;gap:8px;align-items:center;font:800 11px system-ui;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.75)}
      .bdg .lv{background:#e53935;color:#fff;padding:3px 9px;border-radius:999px} .bdg .df{background:#ffb74d;color:#2a1a00;padding:3px 9px;border-radius:999px}
      .ttl{font:800 clamp(20px,2.8cqw,34px)/1.15 system-ui;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 2px 12px rgba(0,0,0,.6)}
      .sub{font-size:clamp(13px,1.5cqw,16px);color:rgba(255,255,255,.75);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .pg{height:5px;border-radius:5px;background:rgba(255,255,255,.15);overflow:hidden;margin-top:8px} .pg i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--a),var(--amb));transition:width 1s linear}
      .tm{display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,.6);font-variant-numeric:tabular-nums;margin-top:3px}
      .ctl{display:flex;align-items:center;gap:10px;padding:10px 14px}
      .ctl .tb{width:48px;height:48px;border-radius:50%;font-size:18px;padding:0}
      .ctl .pp{width:62px;height:62px;font-size:24px;background:var(--a);color:#1c1826;border-color:var(--a);box-shadow:0 0 24px rgba(255,210,122,.3)}
      .vol{flex:1;display:flex;align-items:center;gap:10px;margin-left:10px;min-width:0}
      .vol .mu{width:42px;height:42px;border-radius:50%;padding:0;font-size:17px}
      .vol b{font:300 22px system-ui;min-width:52px;text-align:right;font-variant-numeric:tabular-nums}
      input[type=range]{flex:1;min-width:0;accent-color:var(--a);height:22px;margin:0}
      .lnk{display:flex;gap:6px;margin-left:6px} .lnk button{height:42px;padding:0 12px;font-size:12px}
      /* colonne droite */
      .side{display:flex;flex-direction:column;gap:12px;min-height:0;overflow:auto;scrollbar-width:thin}
      .rad{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
      .rd{display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 2px;border-radius:16px;background:transparent;border-color:transparent}
      .rd .lg{width:100%;max-width:60px;aspect-ratio:1;border-radius:16px;display:flex;align-items:center;justify-content:center;font:900 14px system-ui;letter-spacing:.04em;background:rgba(255,255,255,.06);border:1px solid var(--b);border-bottom:3px solid var(--rc);position:relative}
      .rd span{font:600 11px system-ui;color:var(--m);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
      .rd.on .lg{outline:2px solid var(--a);outline-offset:3px} .rd.on span{color:var(--a)}
      .rd.on .lg{background:rgba(255,210,122,.1)} .rd.on .lg::after{content:'';position:absolute;bottom:6px;left:50%;transform:translateX(-50%);width:22px;height:8px;background:repeating-linear-gradient(90deg,var(--a) 0 3px,transparent 3px 5px);animation:eq .8s ease-in-out infinite alternate;border-radius:2px}
      @keyframes eq{to{height:3px}}
      .ql{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .ql button{height:52px;display:flex;align-items:center;justify-content:center;gap:8px;font-size:13px;border-radius:16px}
      .ap{display:flex;flex-direction:column;gap:10px}
      .ah{display:flex;align-items:center;gap:10px} .ah .an{flex:1;font:300 18px system-ui} .ah .as{font-size:12px;color:var(--m)}
      .sw{width:46px;height:26px;border-radius:13px;padding:0;position:relative;background:rgba(255,255,255,.1)} .sw::after{content:'';position:absolute;top:4px;left:4px;width:16px;height:16px;border-radius:50%;background:rgba(243,238,230,.6);transition:.2s}
      .sw.on{background:var(--a);border-color:var(--a)} .sw.on::after{left:24px;background:#1c1826}
      .chips{display:flex;flex-wrap:wrap;gap:6px} .chips button{height:32px;padding:0 12px;border-radius:999px;font:600 12px system-ui}
      .chips button.on{background:rgba(255,210,122,.16);border-color:rgba(255,210,122,.6);color:var(--a)}
      select{height:38px;flex:1;min-width:0;background:rgba(255,255,255,.06);color:var(--t);border:1px solid var(--b);border-radius:14px;padding:0 10px;font:500 13px system-ui} select option{background:#14162a}
      .dock{grid-column:1/-1;display:grid;grid-template-columns:repeat(8,1fr);gap:8px;padding:8px;border-radius:20px;background:var(--g);border:1px solid var(--b);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
      .dock button{border-radius:14px;padding:10px 4px;font:700 12px system-ui;display:flex;flex-direction:column;align-items:center;gap:4px;white-space:nowrap;overflow:hidden}
      .dock button i{font-style:normal;font-size:20px} .dock button small{font:500 10px system-ui;color:var(--m);text-align:center;line-height:1.15}
      .dock button.on{background:#ffd27a;color:#1c1826;border-color:#ffd27a} .dock button.on small{color:#1c1826}
      .row{display:flex;gap:8px;align-items:center} .scn{gap:6px;flex-wrap:wrap} .scn button{width:34px;height:32px;padding:0;border-radius:10px} .chips button i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.18);display:inline-block;margin-right:6px;font-style:normal} .chips button.on i{background:#1c1826} .row button{height:38px;padding:0 12px;white-space:nowrap}
      @container (max-width:1100px){.pills .pill span{display:none}.dock{grid-template-columns:repeat(4,1fr)}}
      @container (max-width:820px){.w{grid-template-columns:1fr;grid-template-rows:auto;height:auto}.scr-w{flex:none;container-type:inline-size!important}.scr{width:100%!important}.side{overflow:visible}.clk{display:none}}
    </style>
    <div class="w"><div class="bgfx"><i></i><i></i><i></i></div><div class="vig"></div>
      <div class="p top"><span class="tt">Streaming</span><div class="pills"></div><span class="clk"></span></div>
      <div class="stage">
        <div class="scr-w"><div class="amb"></div><div class="scr">
          <div class="art"></div>
          <div class="lay">
            <div class="tvv"><div class="chn"></div><div class="chl"></div></div>
            <div class="vid"><div class="vimg"></div><div class="vlogo">▶</div></div><div class="mus"><div class="slv"></div><div class="vin"><div class="lbl"></div></div></div>
            <div class="idl"><div class="beam"></div><b>La salle est prête</b><span>Choisis une source : la TV, une radio ou Spotify</span></div>
          </div>
          <div class="meta"><div class="bdg"></div><div class="ttl"></div><div class="sub"></div><div class="pg"><i></i></div><div class="tm"><span class="t1"></span><span class="t2"></span></div></div>
        </div></div>
        <div class="p ctl"><button class="tb pv">⏮</button><button class="tb pp">▶</button><button class="tb nx">⏭</button>
          <div class="vol"><button class="mu">🔊</button><input class="vr" type="range" min="0" max="100" step="1"><b class="vv">–</b></div></div>
      </div>
      <div class="side">
        <div class="p"><div class="h"><span>📻 Radios</span><span class="rnow"></span></div><div class="rad"></div></div>
        <div class="p ap"><div class="ah"><span class="an">🔈 Ampli ciné</span><span class="as"></span><button class="sw apw"></button></div>
          <div class="chips src"></div>
          <div class="h" style="margin:4px 0 0"><span>🎚️ Son</span></div><div class="chips snd"></div><div class="chips tog"></div><div class="row scn"><span style="font-size:11px;color:var(--m);margin-right:4px">Scènes</span></div><div class="row"><button class="adv">⚙️ Réglages avancés</button></div></div>
      </div>
      <div class="dock"><button class="rmb"><i>🎛️</i>Télécommande<small>TV · Ampli</small></button><button class="otv"><i>📺</i>Orange TV<small>Live TV</small></button><button class="yt"><i>▶️</i>YouTube<small>Box Orange</small></button><button class="nf"><i>🎬</i>Netflix<small>Box Orange</small></button><button class="spb"><i>🎵</i>Spotify<small>Bibliothèque</small></button><button class="srch"><i>🔍</i>Rechercher<small>Box Orange</small></button><button class="adv2"><i>🎚️</i>Réglages son<small>Ampli ciné</small></button><button class="apw2"><i>⏻</i>Ampli<small class="aps">—</small></button></div>
    </div>`;
    const $ = (s) => r.querySelector(s); this.$ = $;
    // pastilles sources
    const pills = $('.pills'); this._pills = {};
    Object.entries(MODES).forEach(([k, [ic, n, c]]) => { const b = document.createElement('button'); b.className = 'pill'; b.style.setProperty('--c', c); b.innerHTML = `<i></i>${ic} <span>${n}</span>`; b.onclick = () => this._pick(k); pills.appendChild(b); this._pills[k] = b; });
    // radios
    this._rads = []; this._radList = []; this._radKey = '';
    // sources ampli
    const src = $('.src'); this._srcs = SOURCES.map(([v, l]) => { const b = document.createElement('button'); b.textContent = l; b.onclick = () => this._call('media_player', 'select_source', { entity_id: E.amp, source: v }); src.appendChild(b); return [v, b]; });
    const SND = [['straight', null, 'Direct'], ['2ch_stereo', null, '2ch Stéréo'], ['all_ch_stereo', null, 'All-ch Stéréo'], ['surr_decoder', 'auto', 'Surround Auto'], ['surr_decoder', 'dolby_surround', 'Dolby Surround'], ['surr_decoder', 'dts_neural_x', 'DTS Neural:X'], ['surr_decoder', 'auro_3d', 'Auro-3D']];
    this._snd = SND.map(([m, d, l]) => { const b = document.createElement('button'); b.innerHTML = `<i></i>${l}`; b.onclick = async () => { if (d) await this._call('select', 'select_option', { entity_id: 'select.ampli_cine_surround_decoder_device', option: d }); this._call('media_player', 'select_sound_mode', { entity_id: E.amp, sound_mode: m }); }; $('.snd').appendChild(b); return [m, d, b]; });
    const TOG = [['ai', 'Surround AI'], ['switch.ampli_cine_enhancer', 'Enhancer'], ['switch.ampli_cine_extra_bass', 'Extra Bass'], ['switch.ampli_cine_party_mode', 'Party'], ['switch.ampli_cine_pure_direct', 'Pure Direct'], ['hdmi1', 'HDMI Out 1'], ['hdmi2', 'HDMI Out 2']];
    this._tog = TOG.map(([k, l]) => { const b = document.createElement('button'); b.innerHTML = `<i></i>${l}`; b.onclick = () => { const Y = this._yxc(); if (k === 'ai') return this._yx('main/setSurroundAI?enable=' + !Y.surround_ai); if (k.startsWith('hdmi')) { const n = k.slice(4); return this._yx('main/setHdmiOut' + n + '?enable=' + !Y['hdmi_out_' + n]); } this._call('switch', 'toggle', { entity_id: k }); }; $('.tog').appendChild(b); return [k, b]; });
    for (let n = 1; n <= 8; n++) { const b = document.createElement('button'); b.textContent = n; b.title = 'Scène ' + n; b.onclick = () => this._yx('main/recallScene?num=' + n); $('.scn').appendChild(b); }
    $('.apw').onclick = () => this._call('media_player', this._on(E.amp) ? 'turn_off' : 'turn_on', { entity_id: E.amp });
    $('.adv2').onclick = () => $('.adv').onclick(); $('.apw2').onclick = () => $('.apw').onclick();
    $('.adv').onclick = () => this._popCards('⚙️ Réglages son — Ampli ciné', this.cfg.amp_settings || []);
    $('.spb').onclick = () => this.cfg.spotify ? this._popCards('🎵 Spotify', [this.cfg.spotify]) : this._more(E.sp);
    $('.nf').onclick = () => this._call('remote', 'turn_on', { entity_id: E.rem, activity: 'com.netflix.ninja' });
    $('.yt').onclick = () => { this._focus = 'youtube'; this._call('remote', 'turn_on', { entity_id: E.rem, activity: 'com.google.android.youtube.tv' }); };
    $('.otv').onclick = () => this._pick('tv', true);
    $('.srch').onclick = () => this._call('remote', 'send_command', { entity_id: E.rem, command: 'SEARCH' });
    $('.rmb').onclick = () => this._remotePop();
    $('.pv').onclick = () => this._tr('prev'); $('.pp').onclick = () => this._tr('pp'); $('.nx').onclick = () => this._tr('next');
    $('.scr').onclick = () => { const m = this._mode; this._more(m === 'spotify' ? E.sp : m === 'youtube' ? E.tv : m === 'tv' ? E.box : E.amp); };
    const vr = $('.vr'); vr.oninput = () => { $('.vv').textContent = vr.value + '%'; this._vdrag = Date.now(); clearTimeout(this._vt); this._vt = setTimeout(() => this._call('media_player', 'volume_set', { entity_id: E.amp, volume_level: vr.value / 100 }), 250); };
    $('.mu').onclick = () => this._call('media_player', 'volume_mute', { entity_id: E.amp, is_volume_muted: !this._a(E.amp, 'is_volume_muted') });
    const fit = () => { const t = Math.max(0, Math.round(this.getBoundingClientRect().top + window.scrollY)); this.style.setProperty('--top', t + 'px'); const ft = this.shadowRoot && this.shadowRoot.querySelector('.ftr'); this.style.setProperty('--fh', (ft ? ft.offsetHeight : 0) + 'px'); };
    this._fit = fit; if (this.cfg && this.cfg.footer && !this._fd) { const fd = document.createElement('div'); fd.className = 'ftr'; fd.style.cssText = 'padding-top:4px'; this.shadowRoot.appendChild(fd); this._fd = fd; window.loadCardHelpers().then((hp) => { const el = hp.createCardElement(this.cfg.footer); el.hass = this._h; this._ftr = el; fd.appendChild(el); setTimeout(fit, 300); setTimeout(fit, 1500); }); } window.addEventListener('resize', fit); requestAnimationFrame(fit); setTimeout(fit, 600); setTimeout(fit, 2000);
    this._tick = setInterval(() => this._prog(), 1000);
  }
  connectedCallback() { if (this._b && !this._tick) this._tick = setInterval(() => this._prog(), 1000); }
  disconnectedCallback() { if (this._fit) window.removeEventListener('resize', this._fit); clearInterval(this._tick); this._tick = null; }
  _on(e) { const s = this._s(e); return !!s && !OFF.includes(s.state); }

  // quelle source est à l'écran
  _auto() {
    const sp = this._s(E.sp), tv = this._s(E.tv), amp = this._s(E.amp), box = this._s(E.box);
    if (sp && sp.state === 'playing') return 'spotify';
    if (tv && ['playing', 'paused', 'buffering'].includes(tv.state) && tv.attributes.media_title) return 'youtube';
    if (amp && amp.state === 'playing' && amp.attributes.source === 'NET RADIO') return 'radio';
    if (box && box.state === 'on' && box.attributes.app_id === ORANGE_APP) return 'tv';
    if (sp && sp.state === 'paused' && sp.attributes.media_title) return 'spotify';
    return 'idle';
  }
  _live(k) {
    const sp = this._s(E.sp), tv = this._s(E.tv), amp = this._s(E.amp), box = this._s(E.box);
    if (k === 'spotify') return !!sp && sp.state === 'playing';
    if (k === 'youtube') return !!tv && tv.state === 'playing';
    if (k === 'radio') return !!amp && amp.state === 'playing' && amp.attributes.source === 'NET RADIO';
    if (k === 'tv') return !!box && box.state === 'on' && box.attributes.app_id === ORANGE_APP;
    return false;
  }
  _pick(k, launch) {
    this._focus = this._focus === k && !launch ? null : k; this._focusT = Date.now();
    if (k === 'tv' && (launch || !this._live('tv'))) { this._call('remote', 'turn_on', { entity_id: E.rem, activity: ORANGE_APP }); }
    if (k === 'youtube' && !this._live('youtube')) this._call('remote', 'turn_on', { entity_id: E.rem, activity: 'com.google.android.youtube.tv' });
    if (k === 'spotify' && !this._a(E.sp, 'media_title') && this.cfg.spotify) this._popCards('🎵 Spotify', [this.cfg.spotify]);
    this._upd();
  }
  _radio(x) { this._focus = 'radio'; this._focusT = Date.now(); if (typeof x === 'object' && !x.p) return this._call('media_player', 'play_media', { entity_id: E.amp, media_content_id: x.id, media_content_type: 'music' }); this._yx(typeof x === 'object' ? x.p : x); }
  _yx(path) { return this._call('rest_command', 'ampli_yxc', { path }).then(() => setTimeout(() => this._call('homeassistant', 'update_entity', { entity_id: 'sensor.ampli_yxc_statut' }), 1000)); }
  _yxc() { const s = this._s('sensor.ampli_yxc_statut'); return s ? s.attributes : {}; }
  _radRender() {
    const g = (e) => { const s = this._s(e); return (s && s.attributes.preset_info) || []; };
    if (!this._favT || Date.now() - this._favT > 1800000) { this._favT = Date.now(); const B = (id) => this._h.callWS({ type: 'media_player/browse_media', entity_id: 'media_player.ampli_cine', media_content_id: id, media_content_type: 'directory' }); B('input:net_radio').then(() => B('list:net_radio:1:0')).then(() => B('list:net_radio:2:0')).then((r) => { const f = (r.children || []).filter((c) => c.can_play).map((c) => ({ n: c.title, id: c.media_content_id, p: null })); if (f.length) { this._fav = f; this._radKey = null; this._radRender(); } }).catch(() => {}); }
    let list = (this._fav || []).slice(); if (!list.length) g('sensor.ampli_presets_net').forEach((p, i) => { if (p.text && p.input === 'net_radio') list.push({ n: p.text, p: 'netusb/recallPreset?zone=main&num=' + (i + 1) }); });
    if (!list.length) g('sensor.ampli_presets_dab').forEach((p, i) => { if (p.text) list.push({ n: p.text, p: 'tuner/recallPreset?zone=main&band=dab&num=' + (i + 1) }); });
    if (!list.length) g('sensor.ampli_presets_fm').forEach((p, i) => { if (p.number) list.push({ n: p.text || ((p.number / 1000).toFixed(1) + ' FM'), p: 'tuner/recallPreset?zone=main&band=fm&num=' + (i + 1) }); });
    if (!list.length) list = RADIOS.map(([n, id]) => ({ n, id, p: null }));
    list = list.slice(0, 16); const key = list.map((x) => x.n).join('|'); if (key === this._radKey) return; this._radKey = key; this._radList = list;
    const rad = this.$('.rad'); rad.innerHTML = ''; const COLS = ['#ff5a5f', '#ff2d87', '#00a3e0', '#8e5cff', '#ffb400', '#1fb6c9', '#7fe0a8', '#ff8a65'];
    this._rads = list.map((r, i) => { const b = document.createElement('button'); b.className = 'rd'; const c = COLS[i % COLS.length]; const ab = (r.n.replace(/[^A-Za-z0-9À-ÿ ]/g, '').trim().split(/\s+/)[0] || r.n).slice(0, 4).toUpperCase(); b.innerHTML = `<div class="lg" style="color:${c};--rc:${c}">${ab}</div><span>${r.n}</span>`; b.onclick = () => this._radio(r); rad.appendChild(b); return [r, b]; });
  }
  _tr(a) {
    const m = this._mode;
    if (m === 'tv') return this._call('remote', 'send_command', { entity_id: E.rem, command: a === 'prev' ? 'CHANNEL_DOWN' : a === 'next' ? 'CHANNEL_UP' : 'MEDIA_PLAY_PAUSE' });
    if (m === 'radio') {
      if (a === 'pp') return this._call('media_player', 'media_play_pause', { entity_id: E.amp });
      const L = this._radList || []; if (!L.length) return; const i = this._radIdx >= 0 ? this._radIdx : 0, n = L.length; return this._radio(L[(i + (a === 'next' ? 1 : n - 1)) % n]);
    }
    const e = m === 'youtube' ? E.tv : m === 'spotify' ? E.sp : E.amp;
    this._call('media_player', a === 'prev' ? 'media_previous_track' : a === 'next' ? 'media_next_track' : 'media_play_pause', { entity_id: e });
  }

  _orange() {
    const c = this._txt('input_text.orange_tv_chaine'), t = this._txt('input_text.orange_tv_titre'), hr = this._txt('input_text.orange_tv_horaire'), lv = this._txt('input_text.orange_tv_lecture') || 'Direct';
    const m = hr.match(/(\d\d):(\d\d)\D+(\d\d):(\d\d)/); let ok = !!t, pc = -1, a = 0, b = 0;
    if (m) { const d = new Date(); let n = d.getHours() * 60 + d.getMinutes(); a = +m[1] * 60 + +m[2]; b = +m[3] * 60 + +m[4]; if (b < a) { b += 1440; if (n < a) n += 1440; } ok = ok && n >= a - 5 && n < b + 5; pc = Math.max(0, Math.min(100, ((n + d.getSeconds() / 60) - a) / (b - a) * 100)); }
    const mm = c.match(/^(\d+)\s*·\s*(.*)$/);
    return { num: mm ? mm[1] : '', name: mm ? mm[2] : (c || 'Orange TV'), chan: c, title: ok ? t : '', hr: ok ? hr : '', lv, pc: ok ? pc : -1 };
  }
  _fmt(s) { s = Math.max(0, Math.floor(s || 0)); const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); }
  _pos(e) {
    const s = this._s(e); if (!s) return null; const d = s.attributes.media_duration, p = s.attributes.media_position; if (!d || p == null) return null;
    let pos = p; if (s.state === 'playing' && s.attributes.media_position_updated_at) pos += (Date.now() - new Date(s.attributes.media_position_updated_at).getTime()) / 1000;
    return [Math.min(pos, d), d];
  }
  _prog() {
    if (!this._b || !this._h) return; const $ = this.$, m = this._mode;
    const clk = new Date(); $('.clk').textContent = clk.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
    let pc = -1, t1 = '', t2 = '';
    if (m === 'tv') { const o = this._orange(); pc = o.pc; if (o.hr) { [t1, t2] = o.hr.split('–'); } }
    else if (m === 'youtube' || m === 'spotify') { const p = this._pos(m === 'youtube' ? E.tv : E.sp); if (p) { pc = p[0] / p[1] * 100; t1 = this._fmt(p[0]); t2 = this._fmt(p[1]); } }
    $('.pg').style.display = pc >= 0 ? '' : 'none'; $('.tm').style.display = pc >= 0 && t1 ? '' : 'none';
    if (pc >= 0) { $('.pg i').style.width = pc.toFixed(2) + '%'; $('.t1').textContent = t1; $('.t2').textContent = t2; }
  }
  _ambi(url, fb) {
    if (url === this._artUrl) return; this._artUrl = url;
    if (!url) { this._setAmb(fb); return; }
    const im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = () => { try { const c = document.createElement('canvas'); c.width = c.height = 12; const g = c.getContext('2d'); g.drawImage(im, 0, 0, 12, 12); const d = g.getImageData(0, 0, 12, 12).data; let r = 0, gg = 0, b = 0, w = 0;
      for (let i = 0; i < d.length; i += 4) { const mx = Math.max(d[i], d[i + 1], d[i + 2]), mn = Math.min(d[i], d[i + 1], d[i + 2]), s = mx - mn + 8; r += d[i] * s; gg += d[i + 1] * s; b += d[i + 2] * s; w += s; }
      const k = 1.25; this._setAmb(`rgb(${Math.min(255, r / w * k) | 0},${Math.min(255, gg / w * k) | 0},${Math.min(255, b / w * k) | 0})`); } catch (e) { this._setAmb(fb); } };
    im.onerror = () => this._setAmb(fb); im.src = url;
  }
  _setAmb(c) { this.style.setProperty('--amb', c); }

  _upd() {
    if (!this._h) return; const $ = this.$;
    if (this._focus && Date.now() - (this._focusT || 0) > 15 * 60000 && !this._live(this._focus)) this._focus = null;
    const mode = this._focus || this._auto(); this._mode = mode;
    Object.entries(this._pills).forEach(([k, b]) => { b.classList.toggle('live', this._live(k)); b.classList.toggle('foc', k === mode); });
    const scr = $('.scr'), tvv = $('.tvv'), mus = $('.mus'), idl = $('.idl'), vid = $('.vid');
    let title = '', sub = '', bdg = '', art = null, ambFb = mode in MODES ? MODES[mode][2] : '#ffb15a';
    tvv.style.opacity = mode === 'tv' ? 1 : 0; mus.style.opacity = ['spotify', 'radio'].includes(mode) ? 1 : 0; vid.style.opacity = mode === 'youtube' ? 1 : 0; idl.style.opacity = mode === 'idle' ? 1 : 0;
    if (mode === 'tv') {
      const o = this._orange(); $('.chn').textContent = o.num || '📺'; $('.chl').textContent = o.name;
      title = o.title || o.name; sub = [o.chan, o.hr].filter(Boolean).join('  ·  ');
      bdg = /^Direct/.test(o.lv) ? '<span class="lv">● Direct</span>' : `<span class="df">⏪ ${o.lv}</span>`; bdg += '<span>Orange TV</span>';
    } else if (mode === 'idle') {
      title = ''; sub = '';
    } else {
      const e = mode === 'spotify' ? E.sp : mode === 'youtube' ? E.tv : E.amp, s = this._s(e) || { attributes: {}, state: 'off' }, A = s.attributes;
      art = A.entity_picture ? (/^https?:/.test(A.entity_picture) ? A.entity_picture : (this._h.hassUrl ? this._h.hassUrl(A.entity_picture) : A.entity_picture)) : null;
      title = A.media_title || (mode === 'radio' ? 'Radio' : MODES[mode][1]);
      sub = [A.media_artist, A.media_album_name || A.media_channel].filter(Boolean).join('  ·  ') || (mode === 'radio' ? (A.source || '') : (A.app_name || ''));
      const st = s.state === 'playing' ? '● Lecture' : s.state === 'paused' ? '❚❚ Pause' : s.state;
      bdg = `<span>${MODES[mode][0]} ${MODES[mode][1]}</span><span style="opacity:.7">${st}</span>`;
      $('.slv').style.backgroundImage = art ? `url("${art}")` : `linear-gradient(135deg,${ambFb},#111)`;
      $('.lbl').style.backgroundImage = art ? `url("${art}")` : 'none';
      $('.vin').classList.toggle('go', s.state === 'playing');
      $('.vimg').style.backgroundImage = mode === 'youtube' && art ? `url("${art}")` : 'none'; $('.vlogo').style.display = mode === 'youtube' && art ? 'none' : '';
    }
    $('.art').style.backgroundImage = art ? `url("${art}")` : 'none';
    this._ambi(art, ambFb);
    $('.meta').style.display = mode === 'idle' ? 'none' : '';
    $('.bdg').innerHTML = bdg; $('.ttl').textContent = title; $('.sub').textContent = sub;
    scr.title = title;
    // transport
    const playing = mode === 'tv' ? true : mode === 'idle' ? false : (this._s(mode === 'spotify' ? E.sp : mode === 'youtube' ? E.tv : E.amp) || {}).state === 'playing';
    $('.pp').textContent = playing ? '❚❚' : '▶';
    $('.pv').textContent = mode === 'tv' ? 'CH−' : '⏮'; $('.nx').textContent = mode === 'tv' ? 'CH+' : '⏭';
    ['.pv', '.pp', '.nx'].forEach((q) => { $(q).disabled = mode === 'idle'; $(q).style.opacity = mode === 'idle' ? .35 : 1; });
    // volume ampli
    const amp = this._s(E.amp) || { attributes: {}, state: 'off' }, ampOn = !OFF.includes(amp.state), vol = Math.round((amp.attributes.volume_level || 0) * 100);
    if (!this._vdrag || Date.now() - this._vdrag > 1500) { $('.vr').value = vol; $('.vv').textContent = ampOn ? vol + '%' : 'off'; }
    $('.vr').disabled = !ampOn; $('.mu').textContent = amp.attributes.is_volume_muted ? '🔇' : '🔊';
    // radios
    this._radRender(); this._radIdx = -1; const isRad = ['NET RADIO', 'TUNER'].includes(amp.attributes.source) && amp.state === 'playing';
    const hay = [amp.attributes.media_title, amp.attributes.media_artist, amp.attributes.media_album_name, amp.attributes.media_channel].filter(Boolean).join(' ').toLowerCase().replace(/\s/g, '');
    (this._rads || []).forEach(([r, b], i) => { const k = r.n.toLowerCase().replace(/\s|belgique/g, '').slice(0, 6); const on = isRad && k.length > 2 && hay.includes(k); if (on && this._radIdx < 0) this._radIdx = i; b.classList.toggle('on', on); });
    $('.rnow').textContent = isRad ? (this._radIdx >= 0 ? this._radList[this._radIdx].n : (amp.attributes.media_title || 'En écoute')) : '';
    // ampli
    $('.apw').classList.toggle('on', ampOn); $('.apw2').classList.toggle('on', ampOn); $('.aps').textContent = ampOn ? 'Allumé · ' + vol + '%' : 'Éteint'; $('.as').textContent = ampOn ? (amp.attributes.source || '') : 'éteint';
    this._srcs.forEach(([v, b]) => { b.classList.toggle('on', ampOn && amp.attributes.source === v); b.disabled = !ampOn; b.style.opacity = ampOn ? 1 : .4; });
    const Y = this._yxc(), dec = (this._s('select.ampli_cine_surround_decoder_device') || {}).state;
    (this._snd || []).forEach(([m, d, b]) => { b.classList.toggle('on', ampOn && amp.attributes.sound_mode === m && (!d || d === dec)); b.disabled = !ampOn; });
    (this._tog || []).forEach(([k, b]) => { let on, na; if (k === 'ai') { on = !!Y.surround_ai; na = Y.surround_ai == null; } else if (k.startsWith('hdmi')) { const v = Y['hdmi_out_' + k.slice(4)]; on = !!v; na = v == null; } else { on = this._on(k); na = !this._s(k); } b.classList.toggle('on', ampOn && on); b.style.display = na ? 'none' : ''; b.disabled = !ampOn; });
    this._prog();
  }

  // ---------- popups (au niveau du document pour passer au-dessus de tout) ----------
  _overlay(title) {
    const old = document.querySelector('.stpop'); if (old) old.remove();
    const o = document.createElement('div'); o.className = 'stpop';
    o.style.cssText = 'position:fixed;inset:0;z-index:997;background:rgba(5,6,12,.66);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center';
    o.innerHTML = `<div class="pb" style="background:linear-gradient(160deg,#1f1c30,#12111c);color:#f3eee6;border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:14px;width:min(460px,94vw);max-height:92vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,.7);font-family:system-ui,Roboto,sans-serif"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><b style="flex:1;font-size:17px;font-weight:600">${title}</b><button class="x" style="border:none;border-radius:12px;background:rgba(255,255,255,.08);color:#fff;padding:9px 13px;font-size:15px;cursor:pointer">✕</button></div><div class="tabs"></div><div class="bd"></div></div>`;
    const close = () => { o.remove(); this._pops = []; };
    o.onclick = (ev) => { if (ev.target === o) close(); }; o.querySelector('.x').onclick = close;
    o.style.pointerEvents = 'none'; setTimeout(() => { o.style.pointerEvents = ''; }, 450);
    document.body.appendChild(o); this._pops = []; return o;
  }
  async _mk(cfg) { const hp = await window.loadCardHelpers(); const c = { ...cfg }; delete c.visibility; const el = hp.createCardElement(c); el.hass = this._h; this._pops.push(el); return el; }
  async _popCards(title, cfgs) {
    const o = this._overlay(title), bd = o.querySelector('.bd'); bd.style.cssText = 'display:flex;flex-direction:column;gap:10px';
    if (cfgs.length > 1 || (cfgs[0] && cfgs[0].type === 'entities')) o.querySelector('.pb').style.width = 'min(560px,94vw)';
    try { for (const c of cfgs) bd.appendChild(await this._mk(c)); } catch (e) { bd.textContent = 'Indisponible : ' + e.message; }
  }
  async _remotePop() {
    const o = this._overlay('🎛 Télécommande'), tabs = o.querySelector('.tabs'), bd = o.querySelector('.bd');
    const pick = (k) => (this.cfg.remotes || []).find((x) => { const v = JSON.stringify(x.visibility || []); return v.includes(E.sel) && v.includes('"' + k + '"'); });
    const ks = ['TV', 'Ampli'].filter((k) => pick(k)); const els = {};
    tabs.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px';
    const sel = this._txt(E.sel); let cur = ks.includes(sel) ? sel : ks[0];
    const btns = ks.map((k) => { const b = document.createElement('button'); b.textContent = k === 'TV' ? '📺 TV Orange' : '🔈 Ampli'; b.style.cssText = 'height:42px;border-radius:14px;border:1px solid rgba(255,255,255,.12);color:#f3eee6;font:700 13px system-ui;cursor:pointer;background:rgba(255,255,255,.06)';
      b.onclick = () => { cur = k; show(); if (this._txt(E.sel) !== k) this._call('input_select', 'select_option', { entity_id: E.sel, option: k }); }; tabs.appendChild(b); return [k, b]; });
    const show = () => { btns.forEach(([k, b]) => { const on = k === cur; b.style.background = on ? 'linear-gradient(135deg,#ffd27a,#ff9a5a)' : 'rgba(255,255,255,.06)'; b.style.color = on ? '#1c1826' : '#f3eee6'; }); Object.entries(els).forEach(([k, el]) => { el.style.display = k === cur ? '' : 'none'; }); };
    try { for (const k of ks) { els[k] = await this._mk(pick(k)); bd.appendChild(els[k]); } show(); } catch (e) { bd.textContent = 'Télécommande indisponible : ' + e.message; }
  }
}
if (!customElements.get('streaming-card')) customElements.define('streaming-card', StreamingCard);
window.customCards = window.customCards || []; window.customCards.push({ type: 'streaming-card', name: 'Streaming — salle de cinéma' });
