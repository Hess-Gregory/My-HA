window.__kbPick = function (btn, name, value) { const f = btn.closest("form"); if (!f) { return; } const i = f.querySelector('[name="' + name + '"]'); if (i) { i.value = value; } btn.parentNode.querySelectorAll(".chip").forEach(b => b.classList.toggle("on", b === btn)); };
window.__kbDate = function (btn, mode) { const f = btn.closest("form"); if (!f) { return; } const i = f.querySelector('[name="due_date"]'); const d = new Date(); if (mode === "tomorrow") { d.setDate(d.getDate() + 1); } if (mode === "weekend") { const w = d.getDay(); d.setDate(d.getDate() + (w === 6 || w === 0 ? 0 : 6 - w)); } const z = n => String(n).padStart(2, "0"); if (i) { i.value = mode === "clear" ? "" : d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()); } if (mode === "clear") { const t = f.querySelector('[name="due_time"]'); if (t) { t.value = ""; } } btn.parentNode.querySelectorAll(".chip").forEach(b => b.classList.toggle("on", b === btn)); };

const CARD_VERSION = "105";
const CARD_RELEASE_DATE = "15/09/2026";


class TodoistKanbanFamilialCard extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.config = {};
    this._hass = null;
    this._lastSignature = null;
    this._busy = false;

    this._modalMode = null;
    this._modalTask = null;
    this._modalColumn = null;

    this._boundClickHandler =
      this._handleClick.bind(this);
  }


  setConfig(config) {

    if (!config || !config.entity) {
      throw new Error(
        "L'entité (sensor.kanban_familial) est obligatoire."
      );
    }

    this.config = {
      entity: config.entity,

      show_header: config.show_header !== false,
      show_item_add: config.show_item_add !== false,
      show_item_delete: config.show_item_delete !== false,
      show_item_edit: config.show_item_edit !== false,
      show_item_complete: config.show_item_complete !== false,
      show_item_move: config.show_item_move !== false,
      show_item_view: config.show_item_view !== false,
    };

    this._lastSignature = null;
    this._render();
  }


  set hass(hass) {

    this._hass = hass;

    const state = this._getState();

    const signature = state
      ? [
          state.state,
          state.last_updated,
          JSON.stringify(
            state.attributes?.tasks || []
          )
        ].join("|")
      : "none";

    if (signature !== this._lastSignature) {
      this._lastSignature = signature;
      this._render();
    }
  }


  get hass() {
    return this._hass;
  }


  getCardSize() {
    return 12;
  }


  static getStubConfig() {

    return {
      entity: "sensor.kanban_familial",
      show_header: true,
      show_item_add: true,
      show_item_delete: true,
      show_item_edit: true,
      show_item_complete: true,
      show_item_move: true,
      show_item_view: true,
    };
  }


  _getState() {

    if (!this._hass || !this.config.entity) {
      return null;
    }

    return this._hass.states[this.config.entity] || null;
  }


  _getTasks() {

    const state = this._getState();

    if (!state?.attributes) {
      return [];
    }

    return Array.isArray(state.attributes.tasks)
      ? state.attributes.tasks
      : [];
  }


  _getSections(projectKey) {

    const state = this._getState();

    if (!state?.attributes || !projectKey) {
      return [];
    }

    const sections =
      state.attributes[`sections_${projectKey}`];

    return Array.isArray(sections)
      ? sections
      : [];
  }


  _getProjectInfo(projectId) {

    const projects = {

      "6hJq6cQ4hX7Q8jQF": {
        key: "gregory",
        name: "Grégory",
        color: "#7dd3fc",
      },

      "6hJq6gmCgJCC38R4": {
        key: "matteo",
        name: "Matteo",
        color: "#86efac",
      },

      "6hJq6fXqpFc5ppCC": {
        key: "sandrine",
        name: "Sandrine",
        color: "#f9a8d4",
      },

      "6hW4vXG7V9GffH67": {
        key: "famille",
        name: "Famille",
        color: "#f6d68a",
      },
    };

    return projects[projectId] || {
      key: null,
      name: "Famille",
      color: "#f6d68a",
    };
  }


  _getProjectId(projectKey) {

    const projects = {

      gregory: "6hJq6cQ4hX7Q8jQF",
      matteo: "6hJq6gmCgJCC38R4",
      sandrine: "6hJq6fXqpFc5ppCC",
      famille: "6hW4vXG7V9GffH67",
    };

    return projects[projectKey] || null;
  }


  _getSectionName(sectionId, projectKey) {

    if (!sectionId || !projectKey) {
      return "";
    }

    const section =
      this._getSections(projectKey).find(
        item =>
          String(item.id) === String(sectionId)
      );

    return section?.name || "";
  }


  _findSectionForColumn(projectKey, column) {

    const sections =
      this._getSections(projectKey);

    if (!sections.length) {
      return null;
    }

    const normalized =
      sections.map(section => ({
        ...section,

        normalized:
          String(section.name || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
      }));


    if (column === "doing") {

      const section =
        normalized.find(
          item =>
            item.normalized.includes("cours")
        );

      return section?.id || null;
    }


    if (column === "done") {

      const section =
        normalized.find(
          item =>
            item.normalized.includes("termin")
        );

      return section?.id || null;
    }


    const section =
      normalized.find(
        item =>
          !item.normalized.includes("cours") &&
          !item.normalized.includes("termin")
      );

    return section?.id || null;
  }


  _priorityRank(task) {

    return typeof task?.priority === "number"
      ? task.priority
      : 1;
  }


  _priorityLabel(task) {

    if (
      typeof task?.priority !== "number"
    ) {
      return "";
    }

    const labels = {
      4: "🔴 Très urgent", 3: "🟠 Important", 2: "🟡 Bientôt", 1: "🟢 Pas urgent",
    };

    return labels[task.priority] || "";
  }


  _priorityColor(task) {

    const priority =
      this._priorityRank(task);

    if (priority === 4) {
      return "#f87171";
    }

    if (priority === 3) {
      return "#fb923c";
    }

    if (priority === 2) {
      return "#60a5fa";
    }

    return "transparent";
  }


  _priorityHtml(task) {

    if (
      typeof task?.priority !== "number" ||
      task.priority === 1
    ) {
      return "";
    }

    const label =
      this._priorityLabel(task);

    const color =
      this._priorityColor(task);

    return `
      <span
        class="task-priority"
        style="
          color:${color};
          border-color:${color}66;
          background:${color}18;
        "
      >
        🚩 ${this._escapeHtml(label)}
      </span>
    `;
  }


  _formatDate(dateValue) {

    if (!dateValue) {
      return "";
    }

    try {

      const date =
        new Date(dateValue);

      if (Number.isNaN(date.getTime())) {
        return "";
      }

      return date.toLocaleDateString(
        "fr-FR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );

    } catch {
      return "";
    }
  }


  _formatDateTime(dateValue) {

    if (!dateValue) {
      return "";
    }

    try {

      const date =
        new Date(dateValue);

      if (Number.isNaN(date.getTime())) {
        return "";
      }

      return date.toLocaleString(
        "fr-FR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    } catch {
      return "";
    }
  }


  _formatDue(task) {

    const due =
      task?.due;

    if (!due) {
      return null;
    }

    let label = "";

    if (
      typeof due.string === "string" &&
      due.string.trim()
    ) {
      label = due.string.trim();
    }

    if (!label && due.date) {

      const raw =
        String(due.date);

      const datePart =
        raw.slice(0, 10);

      const parts =
        datePart
          .split("-")
          .map(Number);

      if (
        parts.length === 3 &&
        parts.every(
          value => !Number.isNaN(value)
        )
      ) {

        const date =
          new Date(
            parts[0],
            parts[1] - 1,
            parts[2]
          );

        label =
          date.toLocaleDateString(
            "fr-FR",
            {
              day: "numeric",
              month: "short",
              year:
                date.getFullYear() !==
                new Date().getFullYear()
                  ? "numeric"
                  : undefined,
            }
          );

        const timeMatch =
          raw.match(
            /T(\d{2}):(\d{2})/
          );

        if (timeMatch) {

          label +=
            ` à ${timeMatch[1]}:${timeMatch[2]}`;
        }
      }
    }

    if (!label) {
      return null;
    }

    const rawDate =
      String(due.date || "");

    const datePart =
      rawDate.slice(0, 10);

    const parts =
      datePart
        .split("-")
        .map(Number);

    let overdue = false;

    if (
      parts.length === 3 &&
      parts.every(
        value => !Number.isNaN(value)
      )
    ) {

      const now =
        new Date();

      const today =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

      const dueDay =
        new Date(
          parts[0],
          parts[1] - 1,
          parts[2]
        );

      overdue =
        dueDay < today;
    }

    return {
      label,
      overdue,
      recurring:
        due.is_recurring === true,
      timezone:
        due.timezone || "",
    };
  }


  _formatDeadline(task) {

    if (!task?.deadline?.date) {
      return "";
    }

    return this._formatDate(
      task.deadline.date
    );
  }


  _formatDuration(task) {

    if (!task?.duration) {
      return "";
    }

    const amount =
      task.duration.amount;

    const unit =
      task.duration.unit;

    if (
      amount == null ||
      !unit
    ) {
      return "";
    }

    const numeric =
      Number(amount);

    if (Number.isNaN(numeric)) {
      return "";
    }

    if (unit === "minute") {

      if (numeric === 1) {
        return "1 min";
      }

      if (numeric < 60) {
        return `${numeric} min`;
      }

      const hours =
        Math.floor(numeric / 60);

      const minutes =
        numeric % 60;

      if (!minutes) {
        return hours === 1
          ? "1 h"
          : `${hours} h`;
      }

      return `${hours} h ${minutes} min`;
    }


    if (unit === "day") {

      return numeric === 1
        ? "1 jour"
        : `${numeric} jours`;
    }


    return `${numeric} ${unit}`;
  }


  _formatLabels(task) {

    if (
      !Array.isArray(task?.labels) ||
      !task.labels.length
    ) {
      return "";
    }

    return task.labels
      .filter(
        label =>
          label != null &&
          String(label).trim()
      )
      .map(
        label =>
          String(label).trim()
      )
      .join(", ");
  }


  _taskUrl(task) {

    if (!task?.id) {
      return "";
    }

    if (
      typeof task.url === "string" &&
      task.url.trim()
    ) {
      return task.url;
    }

    return `https://app.todoist.com/app/task/${encodeURIComponent(task.id)}`;
  }


  _isTaskDone(task) {

    const project =
      this._getProjectInfo(
        task.project_id
      );

    const section =
      this._getSectionName(
        task.section_id,
        project.key
      )
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    return section.includes("termin");
  }


  _groupByColumn(tasks) {

    const columns = {
      todo: [],
      doing: [],
      done: [],
    };


    tasks.forEach(task => {

      const project =
        this._getProjectInfo(
          task.project_id
        );

      const section =
        this._getSectionName(
          task.section_id,
          project.key
        )
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");


      if (section.includes("termin")) {
        columns.done.push(task);

      } else if (section.includes("cours")) {
        columns.doing.push(task);

      } else {
        columns.todo.push(task);
      }
    });


    const dueTimestamp = task => {

      if (task?.due?.date) {

        const timestamp =
          Date.parse(
            String(task.due.date)
          );

        if (!Number.isNaN(timestamp)) {
          return timestamp;
        }
      }

      return Infinity;
    };


    const sorter = (a, b) => {

      const priority =
        this._priorityRank(b) -
        this._priorityRank(a);

      if (priority !== 0) {
        return priority;
      }


      const due =
        dueTimestamp(a) -
        dueTimestamp(b);

      if (due !== 0) {
        return due;
      }


      return (
        (typeof a.child_order === "number"
          ? a.child_order
          : 0) -
        (typeof b.child_order === "number"
          ? b.child_order
          : 0)
      );
    };


    columns.todo.sort(sorter);
    columns.doing.sort(sorter);
    columns.done.sort(sorter);

    return columns;
  }


  _escapeHtml(value) {

    const div =
      document.createElement("div");

    div.textContent =
      value == null
        ? ""
        : String(value);

    return div.innerHTML;
  }


  _getDueInputs(task) {

    const raw =
      String(task?.due?.date || "");

    if (!raw) {
      return {
        date: "",
        time: "",
      };
    }

    const date =
      raw.slice(0, 10);

    const timeMatch =
      raw.match(
        /T(\d{2}):(\d{2})/
      );

    return {
      date,
      time:
        timeMatch
          ? `${timeMatch[1]}:${timeMatch[2]}`
          : "",
    };
  }


  _kbPrio(task) {
    const rank = typeof task?.priority === "number" ? task.priority : 1;
    const map = { 4: ["#ef5350", "Très urgent", "🔴"], 3: ["#ffa726", "Important", "🟠"], 2: ["#ffca28", "Bientôt", "🟡"], 1: ["#66bb6a", "Pas urgent", "🟢"] };
    return { rank, color: (map[rank] || map[1])[0], label: (map[rank] || map[1])[1], icon: (map[rank] || map[1])[2] };
  }

  _kbWho(project) {
    return { gregory: "👨", matteo: "👦", sandrine: "👩", famille: "👨‍👩‍👦" }[project?.key] || "👨‍👩‍👦";
  }

  _kbDue(task) {
    const d = task?.due;
    if (!d || !d.date) { return null; }
    const raw = String(d.datetime || d.date);
    const p = raw.slice(0, 10).split("-").map(Number);
    if (p.length !== 3 || p.some(v => Number.isNaN(v))) { return null; }
    const day = new Date(p[0], p[1] - 1, p[2]);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = Math.round((day - today) / 864e5);
    let label = diff === 0 ? "Aujourd’hui" : diff === 1 ? "Demain" : diff === -1 ? "Hier"
      : day.toLocaleDateString("fr-BE", { weekday: "short", day: "numeric", month: "short", year: day.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
    let tm = "";
    const m = raw.match(/T(\d{2}):(\d{2})/);
    if (m) {
      if (/(Z|[+-]\d{2}:?\d{2})$/.test(raw)) {
        tm = new Date(raw).toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" });
      } else {
        tm = m[1] + ":" + m[2];
      }
    }
    if (tm) { label += " · " + tm; }
    let overdue = diff < 0;
    if (!overdue && diff === 0 && m) { overdue = new Date(raw) < now; }
    const full = day.toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + (tm ? " à " + tm : "");
    return { label, overdue, recurring: !!d.is_recurring, full };
  }

  _renderTaskHtml(task) {
    const esc = v => this._escapeHtml(v);
    const project = this._getProjectInfo(task.project_id);
    const done = this._isTaskDone(task);
    const pr = this._kbPrio(task);
    const due = this._kbDue(task);
    const duration = this._formatDuration(task);
    const labels = Array.isArray(task.labels) ? task.labels : [];
    const noteCount = Number(task.note_count);
    const description = typeof task.description === "string" ? task.description.trim() : "";
    const id = esc(task.id);
    const btn = (action, icon, title, cls) => `<button type="button" class="tb ${cls || ""}" data-action="${action}" data-task-id="${id}" title="${title}" aria-label="${title}">${icon}</button>`;
    const actions = [
      this.config.show_item_view ? btn("view", "👁", "Voir le détail") : "",
      this.config.show_item_edit ? btn("edit", "✏️", "Modifier") : "",
      this.config.show_item_move ? btn("move", "↔", "Déplacer") : "",
      this.config.show_item_delete ? btn("delete", "🗑", "Supprimer", "danger") : "",
      this.config.show_item_complete ? btn(done ? "reopen" : "complete", done ? "↩" : "✓", done ? "Rouvrir" : "C’est fait !", "primary") : "",
    ].join("");
    const chips = [
      pr.rank > 1 ? `<span class="kc" style="color:${pr.color};border-color:${pr.color}66;background:${pr.color}1f">${pr.icon} ${pr.label}</span>` : "",
      due ? `<span class="kc ${due.overdue && !done ? "late" : ""}">📅 ${esc(due.label)}${due.recurring ? " ↻" : ""}</span>` : "",
      duration ? `<span class="kc">⏱️ ${esc(duration)}</span>` : "",
      ...labels.slice(0, 3).map(l => `<span class="kc">🏷️ ${esc(l)}</span>`),
      Number.isFinite(noteCount) && noteCount > 0 ? `<span class="kc">💬 ${noteCount}</span>` : "",
    ].join("");
    return `
      <div class="task ${done ? "is-done" : ""}" data-task-id="${id}" style="--pc:${pr.color};--uc:${project.color}">
        <div class="t-head">
          <span class="t-who">${this._kbWho(project)} <b>${esc(project.name)}</b></span>
          <span class="t-grip" aria-hidden="true" title="Glisser pour déplacer">⠿</span>
        </div>
        <div class="t-title">${esc(task.content)}</div>
        ${description ? `<div class="t-desc">${esc(description)}</div>` : ""}
        ${chips ? `<div class="t-chips">${chips}</div>` : ""}
        ${actions ? `<div class="t-actions">${actions}</div>` : ""}
      </div>`;
  }

  
_renderColumnHtml(
    columnKey,
    emoji,
    title,
    tasks
  ) {

    const addButton =
      this.config.show_item_add
        ? `
          <button
            type="button"
            class="add-button"
            data-action="add"
            data-column="${columnKey}"
            title="Ajouter une tâche"
          >
            ＋
          </button>
        `
        : "";


    const content =
      tasks.length === 0
        ? `
          <div class="empty">${ ({ todo: "🎉 Rien à faire pour l’instant", doing: "Glisse ici une tâche commencée", done: "Rien de terminé pour l’instant" })[columnKey] || "Aucune tâche" }</div>
        `
        : tasks
            .map(task =>
              this._renderTaskHtml(task)
            )
            .join("");


    return `
      <div class="column" data-col="${columnKey}">

        <div class="column-header">

          <span>
            ${emoji} ${title}
          </span>

          <div class="column-header-right">

            <span class="count">
              ${tasks.length}
            </span>

            ${addButton}

          </div>

        </div>

        <div class="column-body">
          ${content}
        </div>

      </div>
    `;
  }


  _getModalSections(projectKey) {

    return this._getSections(projectKey);
  }


  _getFormValue(name) {

    const element =
      this.shadowRoot?.querySelector(
        `[name="${name}"]`
      );

    return element
      ? element.value
      : "";
  }


  _setFormValue(name, value) {

    const element =
      this.shadowRoot?.querySelector(
        `[name="${name}"]`
      );

    if (element) {
      element.value =
        value == null
          ? ""
          : String(value);
    }
  }


  _openTaskForm(
    mode,
    task = null,
    column = "todo"
  ) {

    this._modalMode = mode;
    this._modalTask = task;
    this._modalColumn = column;

    const isEdit =
      mode === "edit";

    let projectKey =
      task
        ? this._getProjectInfo(
            task.project_id
          ).key
        : "famille";


    if (!projectKey) {
      projectKey = "famille";
    }


    const sections =
      this._getModalSections(
        projectKey
      );


    const currentSection =
      task?.section_id || "";


    const sectionOptions =
      sections
        .map(section => `
          <option
            value="${this._escapeHtml(section.id)}"
            ${
              String(section.id) ===
              String(currentSection)
                ? "selected"
                : ""
            }
          >
            ${this._escapeHtml(section.name || "Section")}
          </option>
        `)
        .join("");


    const priority =
      typeof task?.priority === "number"
        ? task.priority
        : 1;


    const dueString =
      task?.due?.is_recurring
        ? task?.due?.string || ""
        : "";


    const dueInputs =
      this._getDueInputs(task);


    const deadlineDate =
      task?.deadline?.date ||
      "";


    const durationAmount =
      task?.duration?.amount ??
      "";


    const durationUnit =
      task?.duration?.unit ||
      "minute";


    const labels =
      Array.isArray(task?.labels)
        ? task.labels.join(", ")
        : "";


    const responsible =
      task?.responsible_uid ||
      task?.assignee_id ||
      "";


    const description =
      task?.description ||
      "";


    const parentId =
      task?.parent_id ||
      "";


    const modal =
      document.createElement("div");


    modal.className =
      "modal-overlay";


    modal.innerHTML = `
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
      >

        <div class="modal-header">

          <div class="modal-title">
            ${
              isEdit
                ? "✏️ Modifier la tâche"
                : "✨ Nouvelle tâche"
            }
          </div>

          <button
            type="button"
            class="modal-close"
            data-action="cancel-form"
            title="Fermer"
          >
            ×
          </button>

        </div>


        <form
          class="task-form"
          data-form="task"
        >

          <div class="form-grid">
            ${ !isEdit ? `
            <div class="form-field full">
              <span class="q">👤 Pour qui ?</span>
              <input type="hidden" name="project_key" value="${this._escapeHtml(projectKey)}">
              <div class="chips">
                ${[["famille","👨‍👩‍👦","Tout le monde"],["gregory","👨","Grégory"],["matteo","👦","Matteo"],["sandrine","👩","Sandrine"]].map(([k, e, n]) => `<button type="button" class="chip who ${projectKey === k ? "on" : ""}" onclick="window.__kbPick(this,'project_key','${k}')"><span class="ce">${e}</span>${n}</button>`).join("")}
              </div>
            </div>
            ` : `
            <div class="form-info full">👤 Pour : <strong>${this._escapeHtml(this._getProjectInfo(task?.project_id).name)}</strong></div>
            ` }
            <label class="form-field full">
              <span class="q">📝 Qu’y a-t-il à faire ?</span>
              <input type="text" name="content" value="${this._escapeHtml(task?.content || "")}" required autocomplete="off" placeholder="Ex. Sortir les poubelles, ranger sa chambre…">
            </label>
            <div class="form-field full">
              <span class="q">⚡ C’est pressé ?</span>
              <input type="hidden" name="priority" value="${priority}">
              <div class="chips">
                ${[[1,"🟢","Pas urgent","p1"],[2,"🟡","Bientôt","p2"],[3,"🟠","Important","p3"],[4,"🔴","Très urgent","p4"]].map(([v, e, n, c]) => `<button type="button" class="chip prio ${c} ${priority === v ? "on" : ""}" onclick="window.__kbPick(this,'priority','${v}')">${e} ${n}</button>`).join("")}
              </div>
            </div>
            <div class="form-field full">
              <span class="q">📅 Pour quand ?</span>
              <div class="chips">
                <button type="button" class="chip" onclick="window.__kbDate(this,'today')">Aujourd’hui</button>
                <button type="button" class="chip" onclick="window.__kbDate(this,'tomorrow')">Demain</button>
                <button type="button" class="chip" onclick="window.__kbDate(this,'weekend')">Ce week-end</button>
                <button type="button" class="chip ghost" onclick="window.__kbDate(this,'clear')">Pas de date</button>
              </div>
              <div class="date-row">
                <input type="date" name="due_date" value="${this._escapeHtml(dueInputs.date)}" aria-label="Date">
                <input type="time" name="due_time" value="${this._escapeHtml(dueInputs.time)}" aria-label="Heure (facultatif)">
              </div>
              <small>Choisis un raccourci ou une date précise. L’heure est facultative.</small>
            </div>
            <label class="form-field full">
              <span class="q">💬 Un petit mot ? <em>(facultatif)</em></span>
              <textarea name="description" rows="2" placeholder="Une précision, où trouver le matériel…">${this._escapeHtml(description)}</textarea>
            </label>
            <details class="more full">
              <summary>⚙️ Plus d’options</summary>
              <div class="form-grid inner">
                <div class="form-field">
                  <span>⏱️ Temps estimé</span>
                  <div class="duration-row">
                    <input type="number" name="duration" min="1" step="1" value="${this._escapeHtml(durationAmount)}" placeholder="30">
                    <select name="duration_unit">
                      <option value="minute" ${durationUnit === "minute" ? "selected" : ""}>minutes</option>
                      <option value="day" ${durationUnit === "day" ? "selected" : ""}>jours</option>
                    </select>
                  </div>
                </div>
                <label class="form-field">
                  <span>🏷️ Étiquettes</span>
                  <input type="text" name="labels" value="${this._escapeHtml(labels)}" placeholder="maison, courses…" autocomplete="off">
                  <small>Séparées par des virgules</small>
                </label>
              </div>
            </details>
            <input type="hidden" name="due_string" value="${this._escapeHtml(dueString)}">
            <input type="hidden" name="deadline_date" value="${this._escapeHtml(deadlineDate)}">
            <input type="hidden" name="assignee_id" value="${this._escapeHtml(responsible)}">
            <input type="hidden" name="section_id" value="">
            ${ !isEdit ? `<input type="hidden" name="parent_id" value="${this._escapeHtml(parentId)}">` : "" }
          </div>
          <div class="form-actions">
            <button type="button" class="modal-button secondary" data-action="cancel-form">Annuler</button>
            <button type="button" class="modal-button primary" data-action="save-form">${ isEdit ? "💾 Enregistrer" : "✅ Ajouter la tâche" }</button>
          </div>
        </form>

      </div>
    `;


    this.shadowRoot.appendChild(modal);


    const projectSelect =
      modal.querySelector(
        '[name="project_key"]'
      );


    if (projectSelect) {

      projectSelect.addEventListener(
        "change",
        () => {

          this._refreshModalSections(
            projectSelect.value
          );

        }
      );
    }


    const firstInput =
      modal.querySelector(
        '[name="content"]'
      );


    if (firstInput) {
      setTimeout(
        () => firstInput.focus(),
        50
      );
    }
  }


  _refreshModalSections(projectKey) {

    const select =
      this.shadowRoot?.querySelector(
        '.modal [name="section_id"]'
      );

    if (!select) {
      return;
    }


    const sections =
      this._getSections(projectKey);


    const current =
      select.value;


    select.innerHTML = `
      <option value="">
        Choisir une section
      </option>
    `;


    sections.forEach(section => {

      const option =
        document.createElement("option");

      option.value =
        section.id;

      option.textContent =
        section.name || "Section";

      if (
        String(section.id) ===
        String(current)
      ) {
        option.selected = true;
      }

      select.appendChild(option);
    });
  }


  _closeTaskForm() {

    const modal =
      this.shadowRoot?.querySelector(
        ".modal-overlay"
      );


    if (modal) {
      modal.remove();
    }


    this._modalMode = null;
    this._modalTask = null;
    this._modalColumn = null;
  }


  _openTaskView(task) {
    if (!task) { return; }
    const esc = v => this._escapeHtml(v);
    const project = this._getProjectInfo(task.project_id);
    const done = this._isTaskDone(task);
    const pr = this._kbPrio(task);
    const due = this._kbDue(task);
    const deadline = this._formatDeadline(task);
    const duration = this._formatDuration(task);
    const labels = Array.isArray(task.labels) ? task.labels : [];
    const description = typeof task.description === "string" ? task.description.trim() : "";
    const noteCount = Number(task.note_count);
    const taskUrl = this._taskUrl(task);
    const created = this._formatDateTime(task.added_at || task.created_at || "");
    const updated = this._formatDateTime(task.updated_at || "");
    const row = (icon, label, value) => value ? `<div class="v-row"><span class="v-ic">${icon}</span><div><div class="v-lb">${label}</div><div class="v-val">${value}</div></div></div>` : "";
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal view-modal" role="dialog" aria-modal="true" style="--pc:${pr.color};--uc:${project.color}">
        <div class="modal-header">
          <div class="modal-title">📋 Détail de la tâche</div>
          <button type="button" class="modal-close" data-action="close-view" title="Fermer">×</button>
        </div>
        <div class="view-content v2">
          <div class="v-hero">
            <div class="v-title">${esc(task.content || "")}</div>
            <div class="v-tags">
              <span class="v-tag who">${this._kbWho(project)} Pour ${esc(project.name)}</span>
              <span class="v-tag" style="color:${pr.color};border-color:${pr.color}66;background:${pr.color}1f">${pr.icon} ${pr.label}</span>
              <span class="v-tag ${done ? "ok" : ""}">${done ? "✅ Terminée" : "⏳ À faire"}</span>
            </div>
          </div>
          ${description ? `<div class="v-note">💬 ${esc(description)}</div>` : ""}
          <div class="v-rows">
            ${row("📅", "Pour quand", due ? esc(due.full) + (due.overdue && !done ? ` <span class="late-tag">en retard</span>` : "") + (due.recurring ? " ↻" : "") : "Pas de date")}
            ${row("⏳", "Date limite", deadline ? esc(deadline) : "")}
            ${row("⏱️", "Temps estimé", duration ? esc(duration) : "")}
            ${row("🏷️", "Étiquettes", labels.length ? labels.map(l => `<span class="kc">${esc(l)}</span>`).join(" ") : "")}
            ${row("💬", "Commentaires", Number.isFinite(noteCount) && noteCount > 0 ? String(noteCount) : "")}
          </div>
          <div class="v-meta">${created ? "Créée le " + esc(created) : ""}${updated && updated !== created ? " · modifiée le " + esc(updated) : ""}</div>
          <div class="view-actions">
            <button type="button" class="modal-button secondary" data-action="close-view">Fermer</button>
            ${this.config.show_item_edit ? `<button type="button" class="modal-button secondary" data-action="edit" data-task-id="${esc(task.id)}">✏️ Modifier</button>` : ""}
            ${this.config.show_item_complete ? `<button type="button" class="modal-button primary" data-action="${done ? "reopen" : "complete"}" data-task-id="${esc(task.id)}">${done ? "↩ Rouvrir" : "✓ C’est fait !"}</button>` : ""}
            ${taskUrl ? `<a class="v-link" href="${esc(taskUrl)}" target="_blank" rel="noopener noreferrer">Ouvrir dans Todoist ↗</a>` : ""}
          </div>
        </div>
      </div>`;
    this.shadowRoot.appendChild(modal);
  }

  
_closeTaskView() {

    const modal =
      this.shadowRoot?.querySelector(
        ".view-modal"
      )?.closest(".modal-overlay");

    if (modal) {
      modal.remove();
    }
  }


  async _saveTaskForm() {

    if (this._busy) {
      console.warn(
        "[Kanban] Enregistrement déjà en cours."
      );
      return;
    }


    const content =
      this._getFormValue("content")
        .trim();


    if (!content) {

      alert(
        "Le contenu de la tâche est obligatoire."
      );

      return;
    }


    const description =
      this._getFormValue("description")
        .trim();


    const priority =
      Number(
        this._getFormValue("priority")
      );


    const dueString =
      this._getFormValue("due_string")
        .trim();


    const dueDate =
      this._getFormValue("due_date")
        .trim();


    const dueTime =
      this._getFormValue("due_time")
        .trim();


    const deadlineDate =
      this._getFormValue("deadline_date")
        .trim();


    const durationValue =
      this._getFormValue("duration")
        .trim();


    const durationUnit =
      this._getFormValue("duration_unit")
        .trim();


    const labelsText =
      this._getFormValue("labels")
        .trim();


    const assigneeId =
      this._getFormValue("assignee_id")
        .trim();


    const sectionId =
      this._getFormValue("section_id")
        .trim();


    const labels =
      labelsText
        ? labelsText
            .split(",")
            .map(label => label.trim())
            .filter(Boolean)
        : [];


    const duration =
      durationValue
        ? Number(durationValue)
        : null;


    if (
      durationValue &&
      (
        Number.isNaN(duration) ||
        duration <= 0
      )
    ) {

      alert(
        "La durée doit être un nombre positif."
      );

      return;
    }


    if (
      priority < 1 ||
      priority > 4
    ) {

      alert(
        "La priorité doit être comprise entre 1 et 4."
      );

      return;
    }


    let numericAssigneeId = null;

    if (assigneeId) {

      if (!/^\d+$/.test(assigneeId)) {

        alert(
          "Le responsable doit être un ID utilisateur Todoist numérique."
        );

        return;
      }

      numericAssigneeId =
        Number(assigneeId);
    }


    /*
     * Construction propre des informations
     * d'échéance.
     *
     * Une échéance avancée (ex. chaque lundi)
     * est prioritaire sur date + heure.
     */
    const duePayload = {};


    if (dueString) {

      duePayload.due_string =
        dueString;

    } else if (dueDate) {

      if (dueTime) {

        duePayload.due_datetime =
          `${dueDate}T${dueTime}:00`;

      } else {

        duePayload.due_date =
          dueDate;
      }
    }


    const isEdit =
      this._modalMode === "edit";


    if (isEdit) {

      const task =
        this._modalTask;


      if (!task) {
        this._closeTaskForm();
        return;
      }


      /*
       * IMPORTANT :
       * On n'envoie plus de chaînes vides
       * pour les champs numériques.
       */
      const data = {
        task_id: String(task.id),
        content,
        description,
        labels,
        priority,
        deadline_date: deadlineDate || null,
      };


      if (numericAssigneeId !== null) {

        data.assignee_id =
          numericAssigneeId;

      } else {

        /*
         * L'API Todoist accepte null pour retirer
         * un responsable.
         */
        data.assignee_id = null;
      }


      if (duration !== null) {

        data.duration =
          duration;

        data.duration_unit =
          durationUnit || "minute";

      } else if (task?.duration) {

        /*
         * Si une durée existait et que
         * l'utilisateur la vide, on demande
         * explicitement à Todoist de la retirer.
         */
        data.duration = null;
        data.duration_unit = null;
      }


      Object.assign(
        data,
        duePayload
      );


      console.log(
        "[Kanban] MODIFICATION tâche :",
        data
      );


      this._closeTaskForm();


      const updateSuccess =
        await this._callScript(
          "kanban_todoist_update_task",
          data
        );


      if (!updateSuccess) {
        console.warn(
          "[Kanban] Modification échouée : déplacement annulé."
        );
        return;
      }


      if (
        sectionId &&
        String(sectionId) !==
        String(task.section_id || "")
      ) {

        console.log(
          "[Kanban] Modification réussie, déplacement de la section :",
          {
            task_id: task.id,
            ancienne_section: task.section_id,
            nouvelle_section: sectionId,
          }
        );


        await this._callScript(
          "kanban_todoist_move_task",
          {
            task_id: String(task.id),
            section_id: String(sectionId),
          }
        );
      }


      return;
    }


    const projectKey =
      this._getFormValue(
        "project_key"
      ) || "famille";


    const projectId =
      this._getProjectId(
        projectKey
      );


    if (!projectId) {

      alert(
        "Projet Todoist introuvable."
      );

      return;
    }


    let finalSectionId =
      sectionId;


    if (!finalSectionId) {

      finalSectionId =
        this._findSectionForColumn(
          projectKey,
          this._modalColumn || "todo"
        );
    }


    const parentId =
      this._getFormValue("parent_id")
        .trim();


    const data = {
      project_id: projectId,
      section_id: finalSectionId || "",
      parent_id: parentId,
      content,
      description,
      labels,
      priority,
      deadline_date: deadlineDate || null,
    };


    if (numericAssigneeId !== null) {

      data.assignee_id =
        numericAssigneeId;
    }


    if (duration !== null) {

      data.duration =
        duration;

      data.duration_unit =
        durationUnit || "minute";
    }


    Object.assign(
      data,
      duePayload
    );


    console.log(
      "[Kanban] CREATION tâche :",
      data
    );


    this._closeTaskForm();


    await this._callScript(
      "kanban_todoist_add_task",
      data
    );
  }


  async _callScript(
    scriptName,
    data = {}
  ) {

    if (!this._hass) {

      console.error(
        "[Kanban] Home Assistant n'est pas disponible."
      );

      alert(
        "Home Assistant n'est pas disponible."
      );

      return false;
    }


    const scriptServices =
      this._hass.services?.script;


    if (
      !scriptServices ||
      !scriptServices[scriptName]
    ) {

      console.error(
        "[Kanban] Script Home Assistant introuvable :",
        scriptName
      );


      console.error(
        "[Kanban] Scripts disponibles :",
        Object.keys(scriptServices || {})
      );


      alert(
        `Le script Home Assistant "${scriptName}" est introuvable.`
      );


      return false;
    }


    if (this._busy) {

      console.warn(
        "[Kanban] Une autre action est déjà en cours."
      );

      return false;
    }


    this._busy = true;


    console.log(
      `[Kanban] >>> Appel ${scriptName}`,
      data
    );


    try {

      await this._hass.callService(
        "script",
        scriptName,
        {
          ...data,
        }
      );


      console.log(
        `[Kanban] <<< ${scriptName} envoyé avec succès`
      );


      await new Promise(
        resolve =>
          setTimeout(resolve, 1000)
      );


      return true;


    } catch (error) {

      console.error(
        `[Kanban] ERREUR ${scriptName} :`,
        error
      );


      console.error(
        "[Kanban] Données envoyées :",
        data
      );


      const message =
        error?.message ||
        error?.toString() ||
        "Erreur inconnue";


      alert(
        `Erreur lors de l'action Todoist :\n\n${message}`
      );


      return false;


    } finally {

      this._busy = false;
    }
  }


  async _addTask(column) {

    this._openTaskForm(
      "add",
      null,
      column
    );
  }


  async _editTask(task) {

    console.log(
      "[Kanban] OUVERTURE MODIFICATION :",
      task
    );


    this._openTaskForm(
      "edit",
      task,
      "todo"
    );
  }


  async _deleteTask(task) {

    if (this._busy) {
      console.warn(
        "[Kanban] Suppression refusée : une action est déjà en cours."
      );
      return;
    }


    const confirmed =
      confirm(
        `Supprimer définitivement cette tâche ?\n\n"${task.content}"`
      );


    if (!confirmed) {
      return;
    }


    console.log(
      "[Kanban] SUPPRESSION tâche :",
      {
        task_id: task.id,
        content: task.content,
      }
    );


    await this._callScript(
      "kanban_todoist_delete_task",
      {
        task_id: String(task.id),
      }
    );
  }


  async _completeTask(task) {

    console.log(
      "[Kanban] TERMINER tâche :",
      task.id
    );


    await this._callScript(
      "kanban_todoist_close_task",
      {
        task_id: String(task.id),
      }
    );
  }


  async _reopenTask(task) {

    console.log(
      "[Kanban] ROUVRIR tâche :",
      task.id
    );


    await this._callScript(
      "kanban_todoist_reopen_task",
      {
        task_id: String(task.id),
      }
    );
  }


  async _moveTask(task) {

    if (this._busy) {
      console.warn(
        "[Kanban] Déplacement refusé : une action est déjà en cours."
      );
      return;
    }


    const project =
      this._getProjectInfo(
        task.project_id
      );


    const choice =
      prompt(
        "Déplacer la tâche vers :\n\n" +
        "1 — À faire\n" +
        "2 — En cours\n" +
        "3 — Terminé\n\n" +
        "Choisis 1, 2 ou 3 :"
      );


    if (choice === null) {
      return;
    }


    const targets = {
      "1": "todo",
      "2": "doing",
      "3": "done",
    };


    const target =
      targets[String(choice).trim()];


    if (!target) {

      alert("Choix invalide.");

      return;
    }


    const sectionId =
      this._findSectionForColumn(
        project.key,
        target
      );


    if (!sectionId) {

      alert(
        `Impossible de trouver la section correspondant à "${target}" dans le projet ${project.name}.`
      );

      return;
    }


    if (
      String(sectionId) ===
      String(task.section_id || "")
    ) {

      alert(
        "La tâche est déjà dans cette colonne."
      );

      return;
    }


    const moveData = {
      task_id: String(task.id),
      section_id: String(sectionId),
    };


    console.log(
      "[Kanban] DÉPLACEMENT tâche :",
      {
        ...moveData,
        projet: project.name,
        ancienne_section: task.section_id,
        cible: target,
      }
    );


    await this._callScript(
      "kanban_todoist_move_task",
      moveData
    );
  }


  async _moveTaskTo(task, target) {
    if (!task || !target) { return; }
    const project = this._getProjectInfo(task.project_id);
    const sectionId = this._findSectionForColumn(project.key, target);
    if (!sectionId) { alert(`Impossible de trouver la colonne « ${target} » dans le projet ${project.name}.`); return; }
    if (String(sectionId) === String(task.section_id || "")) { return; }
    console.log("[Kanban] GLISSER-DÉPOSER :", { task_id: task.id, cible: target });
    await this._callScript("kanban_todoist_move_task", { task_id: String(task.id), section_id: String(sectionId) });
  }

  _setupDnd() {
    if (this._dndReady || !this.shadowRoot) { return; }
    this._dndReady = true;
    const root = this.shadowRoot;
    const isAction = (path) => path.some(el => el && el.dataset && el.dataset.action);
    const findTask = (path) => path.find(el => el && el.classList && el.classList.contains("task") && el.dataset && el.dataset.taskId);
    const colAt = (x, y) => { const el = root.elementFromPoint ? root.elementFromPoint(x, y) : null; return el && el.closest ? el.closest(".column[data-col]") : null; };
    const clear = () => { root.querySelectorAll(".column.drop-target").forEach(c => c.classList.remove("drop-target")); };
    const start = (st) => {
      if (st.active || !st.el.isConnected) { return; }
      st.active = true;
      const r = st.el.getBoundingClientRect();
      st.dx = st.x - r.left; st.dy = st.y - r.top; st.lx = st.x; st.ly = st.y;
      const g = st.el.cloneNode(true);
      g.classList.add("drag-ghost");
      g.style.width = r.width + "px"; g.style.left = r.left + "px"; g.style.top = r.top + "px";
      root.appendChild(g); st.ghost = g;
      st.el.classList.add("dragging");
      const fc = st.el.closest(".column[data-col]"); st.from = fc ? fc.dataset.col : "";
      if (navigator.vibrate) { try { navigator.vibrate(15); } catch (err) { /* ignore */ } }
    };
    const move = (st, x, y) => {
      st.lx = x; st.ly = y;
      if (!st.ghost) { return; }
      st.ghost.style.left = (x - st.dx) + "px"; st.ghost.style.top = (y - st.dy) + "px";
      clear();
      const c = colAt(x, y);
      if (c && c.dataset.col !== st.from) { c.classList.add("drop-target"); }
    };
    const end = (st, drop) => {
      clearTimeout(st.timer);
      if (st.active) {
        const c = drop ? colAt(st.lx, st.ly) : null;
        if (st.ghost) { st.ghost.remove(); }
        st.el.classList.remove("dragging");
        clear();
        this._dragEndAt = Date.now();
        if (c && c.dataset.col && c.dataset.col !== st.from) {
          const task = (this._getTasks() || []).find(t => String(t.id) === String(st.id));
          if (task) { this._moveTaskTo(task, c.dataset.col); }
        }
      }
      this._dnd = null;
    };
    /* Souris, pavé tactile, stylet : cliquer-glisser */
    root.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch" || e.button !== 0) { return; }
      const path = e.composedPath();
      if (isAction(path)) { return; }
      const el = findTask(path);
      if (!el) { return; }
      const st = { el, id: el.dataset.taskId, x: e.clientX, y: e.clientY, active: false };
      this._dnd = st;
      const onMove = (ev) => {
        if (!st.active && Math.hypot(ev.clientX - st.x, ev.clientY - st.y) > 6) { start(st); }
        if (st.active) { ev.preventDefault(); move(st, ev.clientX, ev.clientY); }
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        end(st, true);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    });
    /* Écran tactile : appui long (0,35 s) puis glisser */
    root.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) { return; }
      const path = e.composedPath();
      if (isAction(path)) { return; }
      const el = findTask(path);
      if (!el) { return; }
      const t = e.touches[0];
      const st = { el, id: el.dataset.taskId, x: t.clientX, y: t.clientY, active: false };
      st.timer = setTimeout(() => start(st), 350);
      this._dnd = st;
    }, { passive: true });
    root.addEventListener("touchmove", (e) => {
      const st = this._dnd;
      if (!st || !e.touches.length) { return; }
      const t = e.touches[0];
      if (!st.active) {
        if (Math.hypot(t.clientX - st.x, t.clientY - st.y) > 10) { clearTimeout(st.timer); this._dnd = null; }
        return;
      }
      e.preventDefault();
      move(st, t.clientX, t.clientY);
    }, { passive: false });
    root.addEventListener("touchend", (e) => {
      const st = this._dnd;
      if (!st) { return; }
      if (st.active) { e.preventDefault(); }
      end(st, true);
    }, { passive: false });
    root.addEventListener("touchcancel", () => { const st = this._dnd; if (st) { end(st, false); } });
    root.addEventListener("contextmenu", (e) => { if (this._dnd) { e.preventDefault(); } });
  }

  
_handleClick(event) {
    if (this._dragEndAt && Date.now() - this._dragEndAt < 450) { return; }

    if (!event) {
      return;
    }


    const path =
      typeof event.composedPath === "function"
        ? event.composedPath()
        : [];


    let button = null;


    for (const element of path) {

      if (
        element &&
        element.nodeType === Node.ELEMENT_NODE &&
        element.dataset &&
        element.dataset.action
      ) {
        button = element;
        break;
      }
    }


    if (!button) {

      const target =
        event.target;


      if (
        target &&
        target.nodeType === Node.ELEMENT_NODE &&
        typeof target.closest === "function"
      ) {

        button =
          target.closest(
            "[data-action]"
          );
      }
    }


    if (!button) {
      return;
    }


    event.preventDefault();
    event.stopPropagation();


    const action =
      button.dataset.action; if (button.closest && button.closest(".view-modal") && ["edit", "complete", "reopen"].includes(action)) { this._closeTaskView(); }


    console.log(
      "[Kanban] CLICK action :",
      action,
      button.dataset.taskId || ""
    );


    if (action === "cancel-form") {

      this._closeTaskForm();

      return;
    }


    if (action === "close-view") {

      this._closeTaskView();

      return;
    }


    if (action === "save-form") {

      this._saveTaskForm();

      return;
    }


    if (action === "add") {

      this._addTask(
        button.dataset.column
      );

      return;
    }


    const taskId =
      button.dataset.taskId;


    if (!taskId) {
      return;
    }


    const task =
      this._getTasks().find(
        item =>
          String(item.id) ===
          String(taskId)
      );


    if (!task) {

      console.warn(
        "[Kanban] Tâche introuvable :",
        taskId
      );

      return;
    }


    switch (action) {

      case "view":
        this._openTaskView(task);
        break;

      case "edit":
        this._editTask(task);
        break;

      case "delete":
        this._deleteTask(task);
        break;

      case "complete":
        this._completeTask(task);
        break;

      case "reopen":
        this._reopenTask(task);
        break;

      case "move":
        this._moveTask(task);
        break;

      default:
        console.warn(
          "[Kanban] Action inconnue :",
          action
        );
    }
  }


  _attachEvents() {

    if (!this.shadowRoot) {
      return;
    }


    this.shadowRoot.removeEventListener(
      "click",
      this._boundClickHandler
    );


    this.shadowRoot.addEventListener(
      "click",
      this._boundClickHandler
    ); this._setupDnd();
  }


  _formatUpdateTime(state) {

    if (!state?.last_updated) {
      return "";
    }


    try {

      return new Date(
        state.last_updated
      ).toLocaleTimeString(
        "fr-FR",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );


    } catch {
      return "";
    }
  }


  _render() {

    if (!this.shadowRoot) {
      return;
    }


    const state =
      this._getState();


    const tasks =
      this._getTasks();


    const columns =
      this._groupByColumn(tasks);


    const header =
      this.config.show_header
        ? `
          <div class="card-header">

            <div>
              🗂️ Kanban Familial
            </div>

            <span class="total">
              ${tasks.length} tâche(s)
            </span>

          </div>
        `
        : "";


    const unavailable =
      state
        ? ""
        : `
          <div class="unavailable">
            Entité «
            ${this._escapeHtml(
              this.config.entity || ""
            )}
            » indisponible.
          </div>
        `;


    const updateTime =
      this._formatUpdateTime(state);


    this.shadowRoot.innerHTML = `

      <style>

        :host {
          display: block;
        }


        ha-card {
          background:
            rgba(25, 18, 38, 0.72);

          backdrop-filter:
            blur(16px);

          -webkit-backdrop-filter:
            blur(16px);

          border-radius:
            16px;

          box-shadow:
            none;

          padding:
            14px 18px 10px;

          font-family:
            var(
              --paper-font-body1_-_font-family,
              "Roboto",
              sans-serif
            );
        }


        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          color: #f6d68a;

          font-size: 1.15em;
          font-weight: 600;

          margin-bottom: 14px;
        }


        .total {
          font-size: .65em;
          font-weight: 400;
          opacity: .75;
        }


        .board {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 14px;
        }


        @media (max-width: 900px) {

          .board {
            grid-template-columns: 1fr;
          }
        }


        .task { cursor: grab; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; } .task.dragging { opacity: .35; } .column.drop-target { outline: 2px dashed rgba(246,214,138,.85); outline-offset: -3px; background: rgba(246,214,138,.09); } .drag-ghost { position: fixed !important; z-index: 100000; pointer-events: none; margin: 0 !important; opacity: .95; transform: rotate(2deg) scale(1.03); box-shadow: 0 18px 40px rgba(0,0,0,.55); background: #2a2236 !important; cursor: grabbing; }
        .task-form .q { font-size: 1em; font-weight: 700; color: #fff; } .task-form .q em { font-weight: 400; opacity: .6; font-style: normal; font-size: .85em; } .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 2px; } .chip { border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.06); color: #fff; border-radius: 999px; padding: 9px 14px; font: inherit; font-size: .95em; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; min-height: 40px; transition: background .15s, border-color .15s; } .chip:hover { background: rgba(255,255,255,.12); } .chip.on { background: rgba(246,214,138,.22); border-color: #f6d68a; box-shadow: 0 0 0 2px rgba(246,214,138,.22); } .chip.who .ce { font-size: 1.3em; } .chip.prio.p1.on { background: rgba(76,175,80,.25); border-color: #66bb6a; box-shadow: none; } .chip.prio.p2.on { background: rgba(255,202,40,.22); border-color: #ffca28; box-shadow: none; } .chip.prio.p3.on { background: rgba(255,152,0,.25); border-color: #ffa726; box-shadow: none; } .chip.prio.p4.on { background: rgba(244,67,54,.28); border-color: #ef5350; box-shadow: none; } .chip.ghost { opacity: .7; } .date-row { display: grid; grid-template-columns: 1fr 130px; gap: 8px; margin-top: 8px; } .date-row input, .task-form input[type="text"], .task-form textarea { width: 100%; box-sizing: border-box; } .task-form input[type="date"], .task-form input[type="time"] { color-scheme: dark; } details.more { grid-column: 1 / -1; border: 1px solid rgba(255,255,255,.08); border-radius: 12px; padding: 8px 12px; background: rgba(255,255,255,.03); } details.more summary { cursor: pointer; font-weight: 600; opacity: .85; padding: 4px 0; } details.more .inner { margin-top: 10px; } .task-form .form-grid { gap: 16px; } .task-form .form-info { font-size: 1em; padding: 10px 12px; border-radius: 10px; background: rgba(255,255,255,.05); }
        
.column {
          min-width: 0;

          background:
            rgba(255,255,255,.035);

          border:
            1px solid rgba(255,255,255,.07);

          border-radius: 14px;

          overflow: hidden;
        }


        .column-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 10px 12px;

          color: #f6d68a;
          font-weight: 600;

          background:
            rgba(0,0,0,.18);

          border-bottom:
            1px solid rgba(255,255,255,.06);
        }


        .column-header-right {
          display: flex;
          align-items: center;
          gap: 7px;
        }


        .count {
          min-width: 24px;

          text-align: center;

          padding: 2px 7px;

          border-radius: 999px;

          background:
            rgba(255,255,255,.08);

          font-size: .78em;
        }


        .add-button,
        .task-button,
        .modal-button,
        .modal-close {
          appearance: none;
          -webkit-appearance: none;

          pointer-events: auto;

          touch-action: manipulation;

          user-select: none;
        }


        .add-button {
          width: 30px;
          height: 30px;

          border:
            1px solid rgba(246,214,138,.35);

          border-radius: 8px;

          background:
            rgba(246,214,138,.10);

          color: #f6d68a;

          font-size: 20px;

          cursor: pointer;
        }


        .add-button:hover {
          background:
            rgba(246,214,138,.22);
        }


        .column-body {
          display: flex;
          flex-direction: column;

          gap: 8px;

          padding: 10px;
        }


        .task {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 8px;

          padding: 10px;

          border:
            1px solid rgba(255,255,255,.07);

          border-left:
            4px solid transparent;

          border-right:
            4px solid transparent;

          border-radius: 10px;

          background:
            rgba(255,255,255,.045);
        }


        .task-main {
          min-width: 0;
          flex: 1;
        }


        .task-content-row {
          display: flex;
          align-items: flex-start;
          gap: 5px;
        }


        .task-content {
          color:
            rgba(255,255,255,.94);

          line-height: 1.35;

          word-break: break-word;
        }


        .task-link {
          flex-shrink: 0;

          color:
            rgba(255,255,255,.45);

          text-decoration: none;

          font-size: 15px;
        }


        .task-link:hover {
          color: #f6d68a;
        }


        .task-description {
          margin-top: 6px;

          color:
            rgba(255,255,255,.55);

          font-size: .78em;

          line-height: 1.4;

          white-space: pre-wrap;

          word-break: break-word;
        }


        .task-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          gap: 5px;

          margin-top: 8px;

          font-size: .69em;
        }


        .task-owner,
        .task-priority,
        .task-due,
        .task-deadline,
        .task-duration,
        .task-labels,
        .task-responsible,
        .task-parent,
        .task-notes,
        .task-timestamps {
          padding: 3px 7px;

          border-radius: 999px;

          white-space: normal;
        }


        .task-owner {
          white-space: nowrap;
        }


        .task-priority {
          border: 1px solid transparent;
        }


        .task-due {
          background:
            rgba(255,255,255,.07);

          color:
            rgba(255,255,255,.72);
        }


        .task-due.overdue {
          background:
            rgba(248,113,113,.15);

          color: #f87171;
        }


        .task-deadline {
          background:
            rgba(251,146,60,.12);

          color: #fb923c;
        }


        .task-duration {
          background:
            rgba(96,165,250,.10);

          color: #93c5fd;
        }


        .task-labels {
          background:
            rgba(167,139,250,.12);

          color: #c4b5fd;
        }


        .task-responsible {
          background:
            rgba(52,211,153,.10);

          color: #6ee7b7;
        }


        .task-parent {
          background:
            rgba(255,255,255,.06);

          color:
            rgba(255,255,255,.65);
        }


        .task-notes {
          background:
            rgba(244,114,182,.10);

          color: #f9a8d4;
        }


        .task-timestamps {
          background:
            rgba(255,255,255,.04);

          color:
            rgba(255,255,255,.38);

          font-size: .9em;
        }


        .recurring {
          font-size: 1.1em;
        }


        .task-actions {
          display: flex;
          flex-shrink: 0;

          gap: 4px;
        }


        .task-button {
          width: 30px;
          height: 30px;

          padding: 0;

          border:
            1px solid rgba(255,255,255,.10);

          border-radius: 7px;

          background:
            rgba(255,255,255,.08);

          color:
            rgba(255,255,255,.85);

          cursor: pointer;

          font-size: 15px;

          position: relative;
          z-index: 5;
        }


        .task-button:hover {
          background:
            rgba(255,255,255,.16);

          color: white;
        }


        .delete-button:hover {
          background:
            rgba(248,113,113,.20);

          color: #f87171;
        }


        .empty {
          padding: 24px 10px;

          text-align: center;

          color:
            rgba(255,255,255,.35);

          font-size: .85em;
        }


        .unavailable {
          padding: 12px;

          margin-bottom: 10px;

          color: #f87171;

          background:
            rgba(248,113,113,.10);

          border-radius: 8px;
        }


        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 10px;
          padding: 2px 2px 0;

          color:
            rgba(255,255,255,.30);

          font-size: .62em;
        }


        .release {
          color:
            rgba(255,255,255,.25);

          letter-spacing: .02em;
        }


        .modal-overlay {
          position: fixed;

          inset: 0;

          z-index: 99999;

          display: flex;

          align-items: center;
          justify-content: center;

          padding: 20px;

          background:
            rgba(0,0,0,.68);

          backdrop-filter:
            blur(5px);

          -webkit-backdrop-filter:
            blur(5px);
        }


        .modal {
          width: min(
            760px,
            100%
          );

          max-height: calc(100vh - 40px); max-height: calc(100dvh - 40px);

          overflow-y: auto;

          background:
            #211a2b;

          border:
            1px solid rgba(255,255,255,.12);

          border-radius:
            16px;

          box-shadow:
            0 25px 80px rgba(0,0,0,.55);
        }


        .modal-header {
          display: flex;

          align-items: center;
          justify-content: space-between;

          padding: 16px 18px;

          border-bottom:
            1px solid rgba(255,255,255,.08);

          position: sticky;

          top: 0;

          background:
            #211a2b;

          z-index: 2;
        }


        .modal-title {
          color: #f6d68a;

          font-size: 1.1em;

          font-weight: 600;
        }


        .modal-close {
          width: 32px;
          height: 32px;

          border:
            1px solid rgba(255,255,255,.10);

          border-radius: 8px;

          background:
            rgba(255,255,255,.06);

          color:
            rgba(255,255,255,.75);

          cursor: pointer;

          font-size: 22px;

          line-height: 1;
        }


        .task-form {
          padding: 18px;
        }


        .form-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 14px;
        }


        @media (max-width: 650px) {

          .form-grid {
            grid-template-columns: 1fr;
          }
        }


        .form-field {
          display: flex;

          flex-direction: column;

          gap: 6px;

          min-width: 0;
        }


        .form-field.full,
        .form-info.full {
          grid-column:
            1 / -1;
        }


        .form-field > span {
          color:
            rgba(255,255,255,.78);

          font-size: .82em;

          font-weight: 500;
        }


        .form-field small {
          color:
            rgba(255,255,255,.35);

          font-size: .7em;
        }


        .form-field input,
        .form-field textarea,
        .form-field select {
          width: 100%;

          box-sizing: border-box;

          border:
            1px solid rgba(255,255,255,.12);

          border-radius: 8px;

          background:
            rgba(255,255,255,.06);

          color:
            rgba(255,255,255,.92);

          padding: 9px 10px;

          font: inherit;

          outline: none;
        }


        .form-field textarea {
          resize: vertical;

          min-height: 70px;
        }


        .form-field input:focus,
        .form-field textarea:focus,
        .form-field select:focus {
          border-color:
            rgba(246,214,138,.55);

          background:
            rgba(255,255,255,.08);
        }


        .form-field option {
          background:
            #211a2b;

          color: white;
        }


        .duration-row {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 6px;
        }


        .form-info {
          padding: 10px;

          border:
            1px solid rgba(255,255,255,.07);

          border-radius: 8px;

          background:
            rgba(255,255,255,.035);

          color:
            rgba(255,255,255,.55);

          font-size: .82em;
        }


        .form-actions {
          display: flex;

          justify-content: flex-end;

          gap: 8px;

          margin-top: 20px;

          padding-top: 14px;

          border-top:
            1px solid rgba(255,255,255,.07);
        }


        .modal-button {
          padding:
            9px 15px;

          border-radius: 8px;

          cursor: pointer;

          font: inherit;

          text-decoration: none;

          display: inline-flex;

          align-items: center;

          justify-content: center;
        }


        .modal-button.secondary {
          border:
            1px solid rgba(255,255,255,.12);

          background:
            rgba(255,255,255,.06);

          color:
            rgba(255,255,255,.78);
        }


        .modal-button.primary {
          border:
            1px solid rgba(246,214,138,.35);

          background:
            rgba(246,214,138,.14);

          color:
            #f6d68a;
        }


        .modal-button:hover {
          filter:
            brightness(1.2);
        }


        .view-content {
          padding: 18px;
        }


        .view-title {
          color:
            rgba(255,255,255,.95);

          font-size: 1.25em;

          font-weight: 600;

          line-height: 1.35;

          word-break: break-word;

          margin-bottom: 12px;
        }


        .view-badges {
          display: flex;

          flex-wrap: wrap;

          gap: 6px;

          margin-bottom: 18px;
        }


        .view-badge {
          display: inline-flex;

          align-items: center;

          padding: 4px 9px;

          border:
            1px solid rgba(255,255,255,.12);

          border-radius: 999px;

          background:
            rgba(255,255,255,.06);

          color:
            rgba(255,255,255,.70);

          font-size: .75em;
        }


        .view-badge.done {
          color: #86efac;

          border-color:
            rgba(134,239,172,.35);

          background:
            rgba(134,239,172,.10);
        }


        .view-section {
          margin-bottom: 18px;

          padding: 12px;

          border:
            1px solid rgba(255,255,255,.07);

          border-radius: 10px;

          background:
            rgba(255,255,255,.035);
        }


        .view-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 9px;

          margin-bottom: 18px;
        }


        @media (max-width: 650px) {

          .view-grid {
            grid-template-columns: 1fr;
          }
        }


        .view-item {
          min-width: 0;

          padding: 10px;

          border:
            1px solid rgba(255,255,255,.06);

          border-radius: 9px;

          background:
            rgba(255,255,255,.025);
        }


        .view-label {
          margin-bottom: 5px;

          color:
            rgba(255,255,255,.42);

          font-size: .70em;

          text-transform: uppercase;

          letter-spacing: .04em;
        }


        .view-value {
          color:
            rgba(255,255,255,.82);

          font-size: .84em;

          line-height: 1.4;

          word-break: break-word;
        }


        .description-value {
          white-space: pre-wrap;
        }


        .view-technical {
          padding: 12px;

          border:
            1px solid rgba(255,255,255,.06);

          border-radius: 10px;

          background:
            rgba(0,0,0,.12);

          margin-bottom: 18px;
        }


        .technical-row {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 12px;

          padding: 5px 0;

          color:
            rgba(255,255,255,.45);

          font-size: .72em;

          border-bottom:
            1px solid rgba(255,255,255,.04);
        }


        .technical-row:last-child {
          border-bottom: none;
        }


        .technical-row code {
          color:
            rgba(255,255,255,.62);

          font-family:
            monospace;

          word-break: break-all;
        }


        .view-actions {
          display: flex;

          justify-content: flex-end;

          flex-wrap: wrap;

          gap: 8px;

          padding-top: 14px;

          border-top:
            1px solid rgba(255,255,255,.07);
        }

      
        /* ===== Refonte UI (cartes, colonnes, détail) ===== */
        .board { gap: 16px; }
        .column { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); border-radius: 16px; }
        .column-header { padding: 12px 14px; font-weight: 700; }
        .column-body { padding: 10px; display: flex; flex-direction: column; gap: 10px; min-height: 80px; }
        .empty { padding: 22px 10px; text-align: center; opacity: .6; font-size: .92em; border: 1.5px dashed rgba(255,255,255,.14); border-radius: 12px; }
        .task { display: block !important; position: relative; padding: 12px 12px 10px 14px !important; border: 1px solid rgba(255,255,255,.08) !important; border-left: 4px solid var(--pc) !important; border-radius: 14px !important; background: linear-gradient(180deg, rgba(255,255,255,.075), rgba(255,255,255,.035)) !important; box-shadow: 0 4px 14px rgba(0,0,0,.25); transition: transform .12s, box-shadow .12s; }
        .task:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(0,0,0,.35); }
        .task.is-done { opacity: .6; }
        .task.is-done .t-title { text-decoration: line-through; }
        .t-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .t-who { display: inline-flex; align-items: center; gap: 5px; font-size: .78em; padding: 3px 10px 3px 7px; border-radius: 999px; background: color-mix(in srgb, var(--uc) 18%, transparent); color: var(--uc); border: 1px solid color-mix(in srgb, var(--uc) 40%, transparent); }
        .t-who b { font-weight: 600; }
        .t-grip { opacity: .3; font-size: 1.1em; }
        .t-title { font-size: 1.02em; font-weight: 650; line-height: 1.35; color: #fff; word-break: break-word; }
        .t-desc { margin-top: 4px; font-size: .86em; opacity: .72; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .t-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .kc { display: inline-flex; align-items: center; gap: 4px; font-size: .78em; padding: 3px 9px; border-radius: 999px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06); color: rgba(255,255,255,.9); white-space: nowrap; }
        .kc.late { color: #ff8a80; border-color: rgba(255,82,82,.45); background: rgba(255,82,82,.14); }
        .t-actions { display: flex; justify-content: flex-end; gap: 6px; margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,.06); }
        .tb { width: 36px; height: 36px; border-radius: 10px; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.05); color: #fff; cursor: pointer; font-size: .95em; display: inline-flex; align-items: center; justify-content: center; transition: background .12s; padding: 0; }
        .tb:hover { background: rgba(255,255,255,.14); }
        .tb.primary { background: rgba(102,187,106,.22); border-color: rgba(102,187,106,.5); }
        .tb.danger:hover { background: rgba(239,83,80,.25); }
        .view-content.v2 { padding: 18px; }
        .v-hero { padding: 2px 0 12px; border-bottom: 1px solid rgba(255,255,255,.08); margin-bottom: 12px; }
        .v-title { font-size: 1.3em; font-weight: 700; line-height: 1.3; color: #fff; }
        .v-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .v-tag { font-size: .85em; padding: 5px 11px; border-radius: 999px; border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.06); }
        .v-tag.who { color: var(--uc); border-color: color-mix(in srgb, var(--uc) 45%, transparent); background: color-mix(in srgb, var(--uc) 16%, transparent); }
        .v-tag.ok { color: #a5d6a7; border-color: rgba(102,187,106,.5); }
        .v-note { background: rgba(246,214,138,.08); border-left: 3px solid #f6d68a; padding: 10px 12px; border-radius: 10px; line-height: 1.5; margin-bottom: 12px; white-space: pre-wrap; }
        .v-rows { display: flex; flex-direction: column; }
        .v-row { display: flex; gap: 12px; align-items: flex-start; padding: 9px 4px; border-bottom: 1px solid rgba(255,255,255,.05); }
        .v-ic { font-size: 1.15em; width: 26px; text-align: center; }
        .v-lb { font-size: .78em; opacity: .6; }
        .v-val { font-size: .98em; }
        .late-tag { font-size: .75em; color: #ff8a80; border: 1px solid rgba(255,82,82,.45); border-radius: 999px; padding: 1px 7px; margin-left: 6px; }
        .v-meta { font-size: .78em; opacity: .5; margin: 12px 0 4px; }
        .view-actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 12px; }
        .v-link { margin-left: auto; font-size: .85em; color: #f6d68a; text-decoration: none; opacity: .85; }
        .modal-button { min-height: 42px; }
      
</style>


      <ha-card>

        ${header}

        ${unavailable}

        <div class="board">

          ${this._renderColumnHtml(
            "todo",
            "📋",
            "À faire",
            columns.todo
          )}

          ${this._renderColumnHtml(
            "doing",
            "⚡",
            "En cours",
            columns.doing
          )}

          ${this._renderColumnHtml(
            "done",
            "✅",
            "Terminé",
            columns.done
          )}

        </div>


        <div class="footer">

          <span>
            ${
              updateTime
                ? `Mis à jour à ${updateTime}`
                : ""
            }
          </span>

          <span class="release">
            v${this._escapeHtml(CARD_VERSION)}
            •
            ${this._escapeHtml(CARD_RELEASE_DATE)}
          </span>

        </div>

      </ha-card>
    `;


    this._attachEvents();
  }
}


if (!customElements.get("todoist-kanban-familial-card")) {
  customElements.define(
    "todoist-kanban-familial-card",
    TodoistKanbanFamilialCard
  );
}