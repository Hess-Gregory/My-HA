/* Matteo — Mes missions : kanban lecture seule + glisser-déposer (souris / doigt) */
const MM_PR = {
  4: { e: "🔥", l: "Urgent !", c: "#FF3D8B", t: "C'est urgent : à faire en premier !" },
  3: { e: "⭐", l: "Important", c: "#FF9F1C", t: "C'est important, ne traîne pas trop." },
  2: { e: "🙂", l: "Bientôt", c: "#FFD23F", t: "À faire bientôt, sans stress." },
  1: { e: "😎", l: "Tranquille", c: "#2EE6D6", t: "Pas pressé, quand tu as un moment." },
};
const MM_COLS = {
  todo: { e: "📋", l: "À faire", c: "#2EE6D6", empty: "Rien à faire pour l'instant… profite ! 😎", cheer: "Allez champion, une mission à la fois 💪" },
  doing: { e: "⚡", l: "En cours", c: "#FFD23F", empty: "Aucune mission en cours. Choisis-en une dans « À faire » 👈", cheer: "Tu y es presque, lâche rien ! 🚀" },
  done: { e: "🏆", l: "Fini !", c: "#7CFF6B", empty: "Pas encore de mission finie. Tu vas gérer 💪", cheer: "Bien joué, on est fiers de toi ! 🏆" },
};
const MM_BTN = {
  todo: { to: "doing", l: "💪 Je m'y mets" },
  doing: { to: "done", l: "✅ Mission accomplie !" },
  done: { to: "todo", l: "↩️ Oups, à refaire" },
};
const mmEsc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

class MatteoMissionsCard extends HTMLElement {
  constructor() {
    super();
    this._pend = {};
    this._tab = "todo";
    this._open = null;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<style>${this._css()}</style><div id="app"></div><div id="fx"></div>`;
    this._bind();
  }
  setConfig(c) {
    this._c = Object.assign({ entity: "sensor.kanban_familial", project: "matteo", project_id: "6hJq6gmCgJCC38R4" }, c || {});
  }
  getCardSize() { return 8; }
  set hass(h) {
    this._h = h;
    if (!document.getElementById("mtkfonts")) {
      const l = document.createElement("link");
      l.id = "mtkfonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Nunito:wght@500;700;800;900&display=swap";
      document.head.appendChild(l);
    }
    const st = h.states[this._c.entity];
    const sig = st ? st.last_updated : "none";
    const now = Date.now();
    for (const id of Object.keys(this._pend)) {
      const t = this._tasks(true).find((x) => String(x.id) === id);
      if (!t || String(t.section_id) === String(this._pend[id].sid) || now - this._pend[id].ts > 30000) delete this._pend[id];
    }
    if (sig !== this._sig) { this._sig = sig; this._render(); }
  }

  /* ---------- données ---------- */
  _attrs() { const st = this._h && this._h.states[this._c.entity]; return (st && st.attributes) || {}; }
  _tasks() {
    return (this._attrs().tasks || []).filter((t) => String(t.project_id) === this._c.project_id && !t.checked && !t.is_deleted);
  }
  _norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  _secs() { return this._attrs()["sections_" + this._c.project] || []; }
  _colOfSec(id) {
    const s = this._secs().find((x) => String(x.id) === String(id));
    const n = this._norm(s && s.name);
    return n.includes("termin") ? "done" : n.includes("cours") ? "doing" : "todo";
  }
  _col(t) { const p = this._pend[String(t.id)]; return this._colOfSec(p ? p.sid : t.section_id); }
  _secFor(col) {
    const S = this._secs().map((s) => ({ id: s.id, n: this._norm(s.name) }));
    const f = col === "doing" ? S.find((s) => s.n.includes("cours")) : col === "done" ? S.find((s) => s.n.includes("termin")) : S.find((s) => !s.n.includes("cours") && !s.n.includes("termin"));
    return f && f.id;
  }
  _pr(t) { return MM_PR[t.priority] || MM_PR[1]; }
  _when(dstr) {
    if (!dstr) return null;
    const hasT = dstr.length > 10;
    const dt = new Date(hasT ? dstr : dstr + "T00:00:00");
    if (isNaN(dt)) return null;
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const day = new Date(dt); day.setHours(0, 0, 0, 0);
    const diff = Math.round((day - t0) / 864e5);
    const fmt = day.toLocaleDateString("fr-BE", { day: "numeric", month: "long" });
    let lab;
    if (diff === -1) lab = "C'était hier";
    else if (diff < 0) lab = "C'était le " + fmt;
    else if (diff === 0) lab = "Aujourd'hui";
    else if (diff === 1) lab = "Demain";
    else if (diff < 7) { const w = day.toLocaleDateString("fr-BE", { weekday: "long" }); lab = w.charAt(0).toUpperCase() + w.slice(1); }
    else lab = "Le " + fmt;
    if (hasT) lab += " à " + dt.getHours() + "h" + (dt.getMinutes() ? String(dt.getMinutes()).padStart(2, "0") : "");
    return { lab, late: hasT ? dt < new Date() : diff < 0 };
  }
  _dur(t) {
    const d = t.duration; if (!d || !d.amount) return null;
    if (d.unit === "day") return "environ " + d.amount + " jour" + (d.amount > 1 ? "s" : "");
    const m = d.amount; if (m < 60) return "environ " + m + " min";
    const h = Math.floor(m / 60), r = m % 60; return "environ " + h + "h" + (r ? String(r).padStart(2, "0") : "");
  }
  _groups() {
    const g = { todo: [], doing: [], done: [] };
    this._tasks().forEach((t) => g[this._col(t)].push(t));
    const due = (t) => (t.due && t.due.date) || "9999";
    g.todo.sort((a, b) => b.priority - a.priority || due(a).localeCompare(due(b)));
    g.doing.sort((a, b) => b.priority - a.priority || due(a).localeCompare(due(b)));
    g.done.sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
    return g;
  }

  /* ---------- rendu ---------- */
  _render() {
    if (!this._h || !this._c) return;
    if (this._drag) { this._dirty = true; return; }
    const g = this._groups();
    const n = { todo: g.todo.length, doing: g.doing.length, done: g.done.length };
    const total = n.todo + n.doing + n.done;
    const pct = total ? Math.round((n.done / total) * 100) : 0;
    const pl = (k, s, p) => (k > 1 ? p : s);
    let msg;
    if (!total) msg = "Aucune mission pour le moment. Profite bien ! 😎";
    else if (!n.todo && !n.doing) msg = "Tout est fini, t'es un chef ! 🏆";
    else if (n.doing) msg = `Tu as ${n.doing} ${pl(n.doing, "mission", "missions")} en cours, courage ! 🚀`;
    else msg = `Tu as ${n.todo} ${pl(n.todo, "mission qui t'attend", "missions qui t'attendent")} 💪`;
    const touch = window.matchMedia && matchMedia("(pointer:coarse)").matches;
    const tip = touch ? "👆 Astuce : appuie longtemps sur une mission, puis glisse-la sur une autre colonne" : "🖱️ Astuce : attrape une mission et glisse-la dans une autre colonne";
    const col = (k) => {
      const C = MM_COLS[k];
      const items = g[k].length ? g[k].map((t) => this._card(t, k)).join("") : `<div class="empty">${C.empty}</div>`;
      return `<section class="col ${this._tab === k ? "on" : ""}" data-col="${k}" data-drop="${k}" style="--cc:${C.c}">
        <div class="ch"><span class="dot"></span>${C.e} ${C.l}<b>${n[k]}</b></div><div class="list">${items}</div></section>`;
    };
    const tabs = Object.keys(MM_COLS).map((k) => `<button class="tab ${this._tab === k ? "on" : ""}" data-tab="${k}" data-drop="${k}" style="--cc:${MM_COLS[k].c}"><span>${MM_COLS[k].e} ${MM_COLS[k].l}</span><b>${n[k]}</b></button>`).join("");
    this.shadowRoot.getElementById("app").innerHTML = `<div class="wrap">
      <header class="hd"><div class="ttl">Mes missions</div>
        <div class="sub">Salut Matteo 👋 ${msg}</div>
        ${total ? `<div class="prog"><div class="bar"><i style="width:${pct}%"></i></div><span>${n.done}/${total} ${pl(n.done, "finie", "finies")}</span></div>` : ""}
        ${n.todo + n.doing ? `<div class="tip">${tip}</div>` : ""}
      </header>
      <nav class="tabs">${tabs}</nav>
      <div class="board">${col("todo")}${col("doing")}${col("done")}</div>
    </div>${this._open ? this._sheet() : ""}`;
  }
  _card(t, k) {
    const p = this._pr(t), w = k !== "done" ? this._when(t.due && t.due.date) : null, b = MM_BTN[k];
    return `<article class="m ${k}" data-id="${mmEsc(t.id)}" style="--pc:${p.c}">
      <div class="m-top"><span class="pill pr">${p.e} ${p.l}</span>${w ? `<span class="pill ${w.late ? "late" : ""}">${w.late ? "⏰ En retard · " : "📅 "}${mmEsc(w.lab)}</span>` : ""}</div>
      <div class="m-t">${k === "done" ? "✔️ " : ""}${mmEsc(t.content)}</div>
      ${t.description ? `<div class="m-d">💬 ${mmEsc(t.description)}</div>` : ""}
      <button class="go go-${k}" data-move="${b.to}" data-id="${mmEsc(t.id)}">${b.l}</button>
    </article>`;
  }
  _sheet() {
    const t = this._tasks().find((x) => String(x.id) === this._open);
    if (!t) { this._open = null; return ""; }
    const k = this._col(t), C = MM_COLS[k], p = this._pr(t), b = MM_BTN[k];
    const w = this._when(t.due && t.due.date), dl = t.deadline && t.deadline.date ? this._when(t.deadline.date) : null, du = this._dur(t);
    const row = (e, q, a) => `<div class="row"><span class="ri">${e}</span><div><small>${q}</small><b>${a}</b></div></div>`;
    const anim = this._anim ? "" : " in"; this._anim = true;
    return `<div class="ov${anim}" data-close="1"><div class="sh" style="--cc:${C.c};--pc:${p.c}" role="dialog">
      <div class="grab"></div>
      <div class="st">${C.e} ${k === "todo" ? "Pas encore commencée" : k === "doing" ? "Tu es dessus" : "Mission accomplie"}</div>
      <h2 class="sh-t">${mmEsc(t.content)}</h2>
      <div class="msg"><div class="msg-h">💬 Le petit mot des parents</div><div>${t.description ? mmEsc(t.description).replace(/\n/g, "<br>") : "Pas de consigne en plus : tu sais ce qu'il te reste à faire 😉"}</div></div>
      <div class="rows">
        ${row(w && w.late && k !== "done" ? "⏰" : "📅", "C'est pour quand ?", w ? mmEsc(w.lab) + (w.late && k !== "done" ? " — on rattrape ça vite ? 😬" : "") : "Pas de date, mais ne laisse pas traîner 😏")}
        ${dl ? row("🚩", "Dernier délai", mmEsc(dl.lab)) : ""}
        ${du ? row("⏱️", "Ça va te prendre", du) : ""}
        ${row(p.e, "C'est pressé ?", p.t)}
      </div>
      <div class="cheer">${C.cheer}</div>
      <div class="acts">
        <button class="sec" data-close="1">Fermer</button>
        ${k === "doing" ? `<button class="sec" data-move="todo" data-id="${mmEsc(t.id)}">⏸️ Pas maintenant</button>` : ""}
        <button class="go go-${k}" data-move="${b.to}" data-id="${mmEsc(t.id)}">${b.l}</button>
      </div></div></div>`;
  }

  /* ---------- actions ---------- */
  async _move(id, to) {
    id = String(id);
    const t = this._tasks().find((x) => String(x.id) === id);
    if (!t) return;
    const from = this._col(t);
    if (from === to) return;
    if (from === "todo" && to === "done") { this._toast("Hop hop hop ! Passe d'abord par « En cours » 😉"); return; }
    const sid = this._secFor(to);
    if (!sid) { this._toast("Oups, colonne introuvable 🤔"); return; }
    this._pend[id] = { sid, ts: Date.now() };
    this._render();
    if (to === "done") this._confetti();
    this._toast(to === "done" ? "Mission accomplie, bravo ! 🎉" : to === "doing" ? "C'est parti ! 💪" : "OK, retour dans « À faire » 👍");
    try {
      await this._h.callService("script", "kanban_todoist_move_task", { task_id: id, section_id: String(sid) });
    } catch (e) {
      delete this._pend[id]; this._render();
      this._toast("Oups, ça n'a pas marché. Réessaie dans un instant 🙏");
    }
  }
  _toast(m) {
    const fx = this.shadowRoot.getElementById("fx");
    const d = document.createElement("div"); d.className = "toast"; d.textContent = m;
    fx.querySelectorAll(".toast").forEach((x) => x.remove());
    fx.appendChild(d); setTimeout(() => d.remove(), 2600);
  }
  _confetti() {
    const fx = this.shadowRoot.getElementById("fx"), E = ["🎉", "⭐", "🏆", "✨", "💪", "🔥"];
    for (let i = 0; i < 22; i++) {
      const s = document.createElement("span"); s.className = "cf"; s.textContent = E[i % E.length];
      s.style.left = Math.random() * 100 + "vw"; s.style.animationDelay = Math.random() * 0.4 + "s";
      s.style.fontSize = 18 + Math.random() * 18 + "px"; fx.appendChild(s); setTimeout(() => s.remove(), 2200);
    }
  }

  /* ---------- événements + glisser-déposer ---------- */
  _bind() {
    const R = this.shadowRoot;
    R.addEventListener("click", (e) => {
      if (Date.now() - (this._dragEnd || 0) < 450) return;
      const path = e.composedPath();
      const el = (sel) => path.find((n) => n.matches && n.matches(sel));
      const mv = el("[data-move]");
      if (mv) { e.stopPropagation(); this._move(mv.dataset.id, mv.dataset.move); return; }
      const tb = el("[data-tab]");
      if (tb) { this._tab = tb.dataset.tab; this._render(); return; }
      const cl = el("[data-close]");
      if (cl && (cl === path[0] || cl.tagName === "BUTTON")) { this._open = null; this._anim = false; this._render(); return; }
      const card = el(".m[data-id]");
      if (card && !el(".sh")) { this._open = String(card.dataset.id); this._anim = false; this._render(); }
    });
    const onBtn = (path) => path.some((n) => n.tagName === "BUTTON");
    const findCard = (path) => path.find((n) => n.classList && n.classList.contains("m") && n.dataset && n.dataset.id && !(n.closest && n.closest(".sh")));
    // souris / stylet
    R.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      const path = e.composedPath(); if (onBtn(path)) return;
      const c = findCard(path); if (!c) return;
      this._pd = { c, x: e.clientX, y: e.clientY };
    });
    window.addEventListener("pointermove", (e) => {
      if (this._pd && !this._drag && Math.hypot(e.clientX - this._pd.x, e.clientY - this._pd.y) > 6) this._dStart(this._pd.c, this._pd.x, this._pd.y);
      if (this._drag && e.pointerType !== "touch") this._dMove(e.clientX, e.clientY);
    });
    window.addEventListener("pointerup", (e) => { if (e.pointerType === "touch") return; this._pd = null; if (this._drag) this._dEnd(); });
    // doigt : appui long
    R.addEventListener("touchstart", (e) => {
      const path = e.composedPath(); if (onBtn(path) || e.touches.length > 1) return;
      const c = findCard(path); if (!c) return;
      const p = e.touches[0];
      this._tp = { c, x: p.clientX, y: p.clientY, lx: p.clientX, ly: p.clientY };
      c.classList.add("press");
      this._tt = setTimeout(() => { if (this._tp) { this._dStart(c, this._tp.lx, this._tp.ly); if (navigator.vibrate) navigator.vibrate(15); } }, 320);
    }, { passive: true });
    window.addEventListener("touchmove", (e) => {
      if (!this._tp) return;
      const p = e.touches[0]; this._tp.lx = p.clientX; this._tp.ly = p.clientY;
      if (this._drag) { e.preventDefault(); this._dMove(p.clientX, p.clientY); }
      else if (Math.hypot(p.clientX - this._tp.x, p.clientY - this._tp.y) > 10) this._tCancel();
    }, { passive: false });
    const tEnd = () => { const was = !!this._drag; this._tCancel(); if (was) this._dEnd(); };
    window.addEventListener("touchend", tEnd);
    window.addEventListener("touchcancel", tEnd);
    R.addEventListener("contextmenu", (e) => { if (this._tp || this._drag) e.preventDefault(); });
  }
  _tCancel() { clearTimeout(this._tt); if (this._tp) this._tp.c.classList.remove("press"); this._tp = null; }
  _dStart(c, x, y) {
    const r = c.getBoundingClientRect();
    const k = c.classList.contains("doing") ? "doing" : c.classList.contains("done") ? "done" : "todo";
    const gh = c.cloneNode(true); gh.classList.add("ghost"); gh.classList.remove("press");
    gh.style.width = r.width + "px";
    this.shadowRoot.getElementById("fx").appendChild(gh);
    this._drag = { id: c.dataset.id, from: k, c, gh, ox: x - r.left, oy: y - r.top, over: null, x, y };
    c.classList.add("lift"); c.classList.remove("press");
    this.shadowRoot.host.classList.add("dragging");
    this._dMove(x, y);
    const tick = () => {
      if (!this._drag) return;
      const H = window.innerHeight, yy = this._drag.y, sc = this._scroller();
      const v = yy < 90 ? -Math.ceil((90 - yy) / 6) : yy > H - 90 ? Math.ceil((yy - (H - 90)) / 6) : 0;
      if (v && sc) { sc.scrollTop += v; this._dMove(this._drag.x, this._drag.y); }
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }
  _dMove(x, y) {
    const d = this._drag; if (!d) return;
    d.x = x; d.y = y;
    d.gh.style.left = x - d.ox + "px"; d.gh.style.top = y - d.oy + "px";
    const R = this.shadowRoot;
    const hit = R.elementFromPoint ? R.elementFromPoint(x, y) : null;
    const tgt = hit && hit.closest ? hit.closest("[data-drop]") : null;
    R.querySelectorAll(".drop-ok,.drop-no").forEach((n) => n.classList.remove("drop-ok", "drop-no"));
    d.over = null;
    if (tgt) {
      const to = tgt.dataset.drop;
      if (to !== d.from) {
        const ok = !(d.from === "todo" && to === "done");
        R.querySelectorAll(`[data-drop="${to}"]`).forEach((n) => n.classList.add(ok ? "drop-ok" : "drop-no"));
        d.over = to;
      }
    }
  }
  _dEnd() {
    const d = this._drag; if (!d) return;
    cancelAnimationFrame(this._raf);
    d.gh.remove(); d.c.classList.remove("lift");
    this.shadowRoot.host.classList.remove("dragging");
    this.shadowRoot.querySelectorAll(".drop-ok,.drop-no").forEach((n) => n.classList.remove("drop-ok", "drop-no"));
    this._drag = null; this._dragEnd = Date.now();
    if (this._dirty) { this._dirty = false; this._render(); }
    if (d.over) this._move(d.id, d.over);
  }
  _scroller() {
    if (this._sc && this._sc.isConnected && this._sc.scrollHeight > this._sc.clientHeight) return this._sc;
    let n = this;
    while (n) {
      n = n.parentNode || n.host;
      if (n && n.nodeType === 1) {
        const o = getComputedStyle(n).overflowY;
        if ((o === "auto" || o === "scroll") && n.scrollHeight > n.clientHeight + 4) return (this._sc = n);
      }
    }
    return (this._sc = document.scrollingElement);
  }

  _css() {
    return `
:host{display:block;container-type:inline-size;font-family:Nunito,Roboto,sans-serif;color:#fff;--glass:rgba(10,12,26,.84)}
*{box-sizing:border-box}
.wrap{max-width:1180px;margin:0 auto;padding:clamp(4px,2vw,14px) clamp(10px,3vw,20px) calc(40px + env(safe-area-inset-bottom))}
.hd{text-align:center;padding:clamp(6px,3vh,26px) 0 4px}
.ttl{font-family:'Permanent Marker',cursive;font-size:clamp(40px,10vw,64px);line-height:1.05;color:#FFD23F;letter-spacing:.5px;text-shadow:3px 3px 0 #FF3D8B,6px 6px 0 rgba(0,0,0,.45),0 0 28px rgba(0,0,0,.7)}
.sub,.prog{background:rgba(10,12,26,.68);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.16);box-shadow:0 6px 18px rgba(0,0,0,.35)}
.sub{display:inline-block;margin-top:12px;padding:9px 16px;border-radius:999px;font-weight:800;font-size:15px;line-height:1.35;max-width:100%}
.prog{display:flex;align-items:center;gap:10px;max-width:380px;margin:10px auto 0;padding:8px 14px;border-radius:999px;font-weight:800;font-size:13px;white-space:nowrap}
.bar{flex:1;height:10px;border-radius:99px;background:rgba(255,255,255,.15);overflow:hidden}
.bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#2EE6D6,#7CFF6B);box-shadow:0 0 12px rgba(124,255,107,.6);transition:width .6s}
.tip{margin:10px auto 0;max-width:520px;font-size:12.5px;font-weight:700;opacity:.9;text-shadow:0 1px 4px #000,0 0 10px #000}
.tabs{position:sticky;top:0;z-index:5;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:14px 0 12px;padding:6px;border-radius:20px;background:rgba(10,12,26,.84);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.14);box-shadow:0 8px 22px rgba(0,0,0,.4)}
.tab{appearance:none;border:0;border-radius:14px;min-height:54px;padding:6px 2px;background:transparent;color:rgba(255,255,255,.8);font:800 14px Nunito,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;transition:background .2s,color .2s;-webkit-tap-highlight-color:transparent}
.tab b{font-size:12px;min-width:24px;padding:1px 8px;border-radius:99px;background:rgba(255,255,255,.15)}
.tab.on{background:var(--cc);color:#0b0d1a;box-shadow:0 0 16px color-mix(in srgb,var(--cc) 55%,transparent)}
.tab.on b{background:rgba(11,13,26,.2)}
.col{display:none;min-height:200px;padding:12px;border-radius:22px;background:rgba(10,12,26,.5);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12);transition:background .2s}
.col.on{display:block}
.ch{display:none;align-items:center;gap:8px;margin:2px 4px 12px;font:900 18px Nunito,sans-serif;text-shadow:0 1px 6px #000}
.ch .dot{width:11px;height:11px;border-radius:50%;background:var(--cc);box-shadow:0 0 12px var(--cc)}
.ch b{margin-left:auto;font-size:12px;padding:2px 10px;border-radius:99px;background:rgba(255,255,255,.15)}
@container (min-width:620px){
  .tabs{display:none}
  .board{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:stretch;margin-top:14px}
  .col{display:block;min-height:260px}
  .ch{display:flex}
}
@media (max-height:500px){ .ttl{font-size:38px} .hd{padding-top:2px} .tip{display:none} }
.list{display:flex;flex-direction:column;gap:12px}
.m{position:relative;padding:14px 14px 12px 19px;border-radius:18px;background:var(--glass);border:1px solid rgba(255,255,255,.13);box-shadow:0 8px 22px rgba(0,0,0,.38);cursor:grab;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;transition:transform .18s,opacity .2s,box-shadow .18s}
.m::before{content:"";position:absolute;left:0;top:12px;bottom:12px;width:5px;border-radius:0 6px 6px 0;background:var(--pc);box-shadow:0 0 10px var(--pc)}
@media (hover:hover){ .m:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(0,0,0,.5)} }
.m.press{transform:scale(.97)}
.m.lift{opacity:.3;transform:scale(.97)}
.m.done{background:rgba(10,12,26,.7)}
.m-top{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:800;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14)}
.pill.pr{color:var(--pc);border-color:color-mix(in srgb,var(--pc) 50%,transparent)}
.pill.late{background:rgba(255,61,139,.25);border-color:rgba(255,61,139,.65);color:#ffd6e6}
.m-t{font-size:17px;font-weight:900;line-height:1.28;word-break:break-word}
.m.done .m-t{opacity:.78}
.m-d{margin-top:6px;font-size:13.5px;font-weight:600;opacity:.8;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.go,.sec{min-height:46px;border-radius:14px;font:900 15px Nunito,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .1s,filter .2s}
.go{margin-top:12px;width:100%;border:0;color:#0b0d1a}
.go:active,.sec:active{transform:scale(.96)}
@media (hover:hover){ .go:hover{filter:brightness(1.08)} }
.go-todo{background:linear-gradient(135deg,#2EE6D6,#5AB8FF)}
.go-doing{background:linear-gradient(135deg,#FFD23F,#7CFF6B)}
.go-done{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.22)}
.empty{padding:26px 12px;text-align:center;font-weight:800;font-size:14.5px;line-height:1.4;opacity:.85;border:2px dashed rgba(255,255,255,.2);border-radius:16px}
.col.drop-ok,.tab.drop-ok{outline:3px dashed var(--cc);outline-offset:-3px;background:color-mix(in srgb,var(--cc) 26%,rgba(10,12,26,.6))}
.tab.drop-ok{color:#fff;transform:scale(1.05)}
.col.drop-no,.tab.drop-no{outline:3px dashed #FF3D8B;outline-offset:-3px;background:rgba(255,61,139,.15)}
:host(.dragging) .tab:not(.on){outline:2px dashed rgba(255,255,255,.35);outline-offset:-4px}
.ghost{position:fixed;z-index:9999;pointer-events:none;margin:0;transform:rotate(3deg) scale(1.04);box-shadow:0 24px 50px rgba(0,0,0,.65);opacity:.97;cursor:grabbing}
.ov{position:fixed;inset:0;z-index:1000;display:flex;align-items:flex-end;justify-content:center;background:rgba(4,6,14,.6);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}
.sh{position:relative;width:min(560px,100%);max-height:92dvh;overflow:auto;-webkit-overflow-scrolling:touch;padding:12px 20px calc(20px + env(safe-area-inset-bottom));border-radius:26px 26px 0 0;background:rgba(14,16,34,.97);border:1px solid rgba(255,255,255,.14);border-top:4px solid var(--cc);box-shadow:0 -10px 40px rgba(0,0,0,.6)}
.ov.in{animation:fade .2s ease}.ov.in .sh{animation:up .28s cubic-bezier(.2,.9,.3,1.2)}
@keyframes fade{from{opacity:0}}@keyframes up{from{transform:translateY(40%)}}
@media (min-width:700px),(max-height:500px){ .ov{align-items:center;padding:16px} .sh{border-radius:26px;max-height:calc(100dvh - 32px)} .grab{display:none} }
.grab{width:44px;height:5px;border-radius:9px;background:rgba(255,255,255,.3);margin:0 auto 12px}
.st{display:inline-block;padding:4px 12px;border-radius:99px;font-weight:900;font-size:13px;color:#0b0d1a;background:var(--cc)}
.sh-t{margin:10px 0 12px;font:900 clamp(22px,6vw,28px)/1.2 Nunito,sans-serif;word-break:break-word}
.msg{padding:12px 14px;border-radius:16px;background:rgba(255,210,63,.1);border:1px solid rgba(255,210,63,.35);font-weight:700;font-size:15px;line-height:1.45}
.msg-h{font-family:'Permanent Marker',cursive;color:#FFD23F;font-size:16px;margin-bottom:4px;letter-spacing:.3px}
.rows{display:grid;gap:8px;margin-top:12px}
.row{display:flex;gap:12px;align-items:center;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.06)}
.ri{font-size:22px;width:28px;text-align:center}
.row small{display:block;font-size:12px;font-weight:800;opacity:.65;text-transform:uppercase;letter-spacing:.4px}
.row b{font-size:15px;font-weight:800}
.cheer{margin:14px 0 4px;text-align:center;font-family:'Permanent Marker',cursive;font-size:19px;color:var(--cc);text-shadow:0 2px 8px rgba(0,0,0,.6)}
.acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.acts .go{margin-top:0;flex:2 1 180px}
.sec{flex:1 1 100px;padding:0 14px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.08);color:#fff}
.toast{position:fixed;left:50%;bottom:calc(26px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:10001;max-width:calc(100vw - 32px);padding:12px 18px;border-radius:16px;background:rgba(10,12,26,.95);border:1px solid rgba(255,255,255,.2);box-shadow:0 10px 30px rgba(0,0,0,.6);font:800 15px Nunito,sans-serif;color:#fff;text-align:center;animation:tin .25s ease}
@keyframes tin{from{opacity:0;transform:translate(-50%,12px)}}
.cf{position:fixed;top:-40px;z-index:10000;pointer-events:none;animation:fall 1.8s ease-in forwards}
@keyframes fall{to{transform:translateY(110vh) rotate(540deg);opacity:.9}}
`;
  }
}
if (!customElements.get("matteo-missions-card")) customElements.define("matteo-missions-card", MatteoMissionsCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: "matteo-missions-card", name: "Matteo — Mes missions", description: "Kanban lecture seule des tâches de Matteo" });
