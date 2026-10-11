/* Cave — outils globaux : clavier de désarmement (window.__cavePad) et fiche décompte (window.__caveSheet),
   utilisés par le plan 3D (Accueil / Ma Maison) et par les boutons cc_push des dashboards Sécurité et Ma Maison. */
const CV = { a: 'alarm_control_panel.buanderie_centrale_alarme_ajax_cave', d: 'binary_sensor.cave_sous_sol_cave_porte', t: 'timer.cave_rearmement' };
const cvH = () => { const e = document.querySelector('home-assistant'); return e && e.hass; };
const cvLeft = (h) => { const t = h && h.states[CV.t]; if (!t || t.state !== 'active' || !t.attributes.finishes_at) return null; return Math.max(0, Math.round((new Date(t.attributes.finishes_at) - Date.now()) / 1000)); };
const cvFmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const cvCss = `
  .cvo{position:fixed;inset:0;z-index:9999;background:rgba(8,5,16,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;font-family:var(--paper-font-body1_-_font-family,system-ui,Roboto,sans-serif)}
  .cvb{width:min(330px,92vw);background:linear-gradient(180deg,rgba(78,60,112,.97) 0%,rgba(40,29,62,.97) 100%);border:1px solid rgba(246,214,138,.35);border-radius:20px;box-shadow:0 6px 0 #120b1e,0 18px 40px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.18);color:#f3eee6;padding:18px;text-align:center}
  .cvh{display:flex;align-items:center;gap:12px;text-align:left;margin-bottom:10px}
  .cvi{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;background:radial-gradient(circle at 35% 30%,#9b78e0 0%,#5b3f99 65%);box-shadow:inset 0 1px 0 rgba(255,255,255,.3)}
  .cvi.off{background:radial-gradient(circle at 35% 30%,#f6d68a 0%,#b07a2a 70%)}
  .cvt{font-weight:700;font-size:16px}.cvs{font-size:12px;color:rgba(243,238,230,.7)}
  .cvd{font-weight:300;font-size:30px;letter-spacing:8px;margin:6px 0 2px;min-height:40px}
  .cvn{font-weight:200;font-size:52px;font-variant-numeric:tabular-nums;color:#f6d68a;margin:4px 0}
  .cvm{min-height:18px;font-size:12px}
  .cvk{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}
  .cvo button{appearance:none;border:1px solid rgba(246,214,138,.25);background:rgba(255,255,255,.07);color:#f3eee6;border-radius:14px;font:600 18px inherit;font-family:inherit;padding:13px 0;cursor:pointer;box-shadow:0 3px 0 #120b1e;transition:transform .08s,box-shadow .08s}
  .cvo button:active{transform:translateY(3px);box-shadow:0 0 0 #120b1e}
  .cvo .cvr{display:flex;gap:8px;margin-top:12px}.cvo .cvr button{flex:1;font-size:13px;font-weight:700;padding:12px 6px}
  .cvo button.p{background:linear-gradient(180deg,#f6d68a,#d9ad55);color:#2a1d40;border-color:#f6d68a}`;
const cvOpen = (inner) => {
  document.querySelectorAll('.cvo').forEach((e) => e.remove());
  const o = document.createElement('div'); o.className = 'cvo'; o.innerHTML = `<style>${cvCss}</style><div class="cvb">${inner}</div>`;
  const t0 = Date.now(); o.addEventListener('click', (ev) => { if (ev.target === o && Date.now() - t0 > 450) o.remove(); });
  document.body.appendChild(o); return o;
};
window.__cavePad = (hh) => {
  const o = cvOpen(`<div class="cvh"><div class="cvi">🛡️</div><div><div class="cvt">Désarmer la cave</div><div class="cvs">Réarmement auto 10 min après fermeture de la porte</div></div></div>
    <div class="cvd">····</div><div class="cvm"></div><div class="cvk"></div><div class="cvr"><button class="x">Annuler</button><button class="p ok">Valider</button></div>`);
  let code = ''; const dots = o.querySelector('.cvd'), msg = o.querySelector('.cvm'), up = () => { dots.textContent = code ? '●'.repeat(code.length) : '····'; };
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].forEach((k) => {
    const e = document.createElement('button'); e.textContent = k; if (!k) e.style.visibility = 'hidden';
    e.onclick = (ev) => { ev.stopPropagation(); if (k === '⌫') code = code.slice(0, -1); else if (code.length < 12) code += k; msg.textContent = ''; up(); };
    o.querySelector('.cvk').appendChild(e);
  });
  o.querySelector('.x').onclick = () => o.remove();
  o.querySelector('.ok').onclick = async (ev) => {
    ev.stopPropagation(); if (!code) return; msg.style.color = '#f6d68a'; msg.textContent = 'Vérification…';
    try {
      const r = await (hh || cvH()).callWS({ type: 'call_service', domain: 'script', service: 'cave_desarmer_code', service_data: { code }, return_response: true });
      if (r && r.response && r.response.ok) { o.remove(); window.__caveSheet(); return; }
      msg.style.color = '#ff8a80'; msg.textContent = 'Code refusé';
    } catch (e) { msg.style.color = '#ff8a80'; msg.textContent = 'Erreur : ' + (e.message || e.code || ''); }
    code = ''; up();
  };
};
window.__caveSheet = () => {
  const o = cvOpen(`<div class="cvh"><div class="cvi off">🔓</div><div><div class="cvt">Cave désactivée</div><div class="cvs st"></div></div></div>
    <div class="cvn">—</div><div class="cvm">Ouvrir la porte suspend le décompte.</div>
    <div class="cvr"><button class="p re">🛡️ Réarmer</button><button class="pl">⏱️ +10 min</button><button class="x">Fermer</button></div>`);
  const call = (s) => cvH().callService('script', 'turn_on', { entity_id: 'script.' + s });
  o.querySelector('.re').onclick = () => call('cave_rearmer_maintenant');
  o.querySelector('.pl').onclick = () => call('cave_prolonger');
  o.querySelector('.x').onclick = () => o.remove();
  const tick = () => {
    if (!o.isConnected) return clearInterval(iv); const h = cvH(); if (!h) return; const a = h.states[CV.a], d = h.states[CV.d];
    if (a && a.state.startsWith('armed')) { o.querySelector('.cvt').textContent = 'Cave protégée'; o.querySelector('.cvi').textContent = '🛡️'; o.querySelector('.cvi').classList.remove('off'); o.querySelector('.cvn').textContent = '✓'; o.querySelector('.st').textContent = 'Zone réarmée'; setTimeout(() => o.remove(), 2500); return clearInterval(iv); }
    const open = d && d.state === 'on', left = cvLeft(h);
    o.querySelector('.cvn').textContent = open ? '🚪' : left != null ? cvFmt(left) : '—';
    o.querySelector('.st').textContent = open ? 'Porte ouverte — réarmement suspendu' : left != null ? 'Réarmement automatique dans' : 'Porte fermée';
  };
  const iv = setInterval(tick, 1000); tick();
};
/* Ouvre le bon écran selon l'état de la zone */
window.__caveTap = (hh) => { const h = hh || cvH(); const a = h && h.states[CV.a]; if (a && a.state.startsWith('armed')) window.__cavePad(h); else window.__caveSheet(); };
window.__caveLabel = (h) => { const a = h && h.states[CV.a]; if (!a) return '🛡️ Cave'; if (a.state.startsWith('armed')) return '🛡️ Désarmer cave'; const d = h.states[CV.d]; if (d && d.state === 'on') return '🚪 Cave · ouverte'; const l = cvLeft(h); return l != null ? '🔓 Cave · ' + cvFmt(l) : '🔓 Cave désarmée'; };
