import{ag as i,aI as e,at as o,am as r,aP as t,aQ as s,aR as a,aG as n}from"./card-builder-shared-DHPamekk.js";import{aD as c,aB as d,aE as l,aC as p,aH as h}from"./card-builder-shared-MgdMk8WF.js";import"./card-builder-shared-CNfdQpSP.js";import"./card-builder-shared-D9W2hmOT.js";var g=Object.defineProperty,v=(i,e,o,r)=>{for(var t,s=void 0,a=i.length-1;a>=0;a--)(t=i[a])&&(s=t(e,o,s)||s);return s&&g(e,o,s),s};const u={tap:"Tap",double_tap:"Double Tap",hold:"Hold"},_=class extends c{constructor(){super(...arguments),this._cards=[],this._loading=!0,this._slots=[],this._actionSlots=[],this._cardPickerOpen=!1,this._documentModel=new i,this._handleFrontendVersionRecheck=()=>{this.hass&&this._ensureFrontendVersionValid()},this._toggleCardPicker=()=>{this._cardPickerOpen=!this._cardPickerOpen}}async connectedCallback(){super.connectedCallback(),window.addEventListener(e,this._handleFrontendVersionRecheck),this._ensureFrontendVersionValid()&&this.hass&&(await this._loadCards(),await this._subscribeToCardsUpdates())}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(e,this._handleFrontendVersionRecheck),this.unsubscribe&&this.unsubscribe()}setConfig(i){this._config=i,this._ensureFrontendVersionValid()&&((null==i?void 0:i.card_id)?this._loadCardData(i.card_id):(this._slots=[],this._actionSlots=[]))}async updated(i){this._ensureFrontendVersionValid()&&i.has("hass")&&this.hass&&!this._cardsService&&(await this._loadCards(),await this._subscribeToCardsUpdates())}render(){if(this._versionCheck&&!this._versionCheck.ok)return this._renderVersionBlocked(this._versionCheck);if(!this._config)return l``;const i=this._config.slot_entities||{},e=this._config.slot_actions||{};return l`
            <div class="card-config">
                ${this._loading?l`
                <div class="loading">
                    <ha-circular-progress active></ha-circular-progress>
                    <p>Loading cards...</p>
                </div>
            `:l`
                            <label class="select-label">
                                Select Card
                                ${0===this._cards.length?l`
                                            <p class="no-cards">
                                                No cards available. Create a card in the Card Builder panel first.
                                            </p>
                                        `:l`
                                            ${this._renderCardPicker()}
                                        `}
                            </label>
                        `}

                ${this._config.card_id?l`
                            <p class="info">
                                Selected card ID: <code>${this._config.card_id}</code>
                            </p>
                        `:l``}

                ${this._config.card_id&&this._slots.length?l`
                            <div class="slots-config">
                                <div class="slots-title">Slot entities</div>
                                ${this._slots.map(e=>{var o;const r=[e.description||"",e.domains&&e.domains.length>0?`Domains: ${e.domains.join(", ")}`:"",(null==(o=e.entityId)?void 0:o.trim())?`Default: ${e.entityId}`:""].filter(Boolean).join(" • ");return l`
                        <div class="slot-row">
                            <div class="slot-label">
                                <div class="slot-name">${e.name||e.id}</div>
                                <div class="slot-id">${e.id}</div>
                            </div>
                            <ha-selector
                                .hass=${this.hass}
                                .selector=${{entity:{multiple:!1,domain:e.domains&&e.domains.length>0?e.domains:void 0}}}
                                .value=${i[e.id]??""}
                                @value-changed=${i=>this._slotEntityChanged(i,e)}
                                allow-custom-entity
                            ></ha-selector>
                            ${r?l`<div class="slot-helper">${r}</div>`:l``}
                        </div>
                    `})}
                            </div>
                        `:l``}

                ${this._config.card_id&&this._actionSlots.length?l`
                            <div class="slots-config">
                                <div class="slots-title">Action slots</div>
                                ${this._actionSlots.map(i=>{const o=[i.description||"",`Trigger: ${u[i.trigger]??i.trigger}`,i.action?`Default: ${this._formatActionSummary(i.action)}`:""].filter(Boolean).join(" • ");return l`
                        <div class="slot-row">
                            <div class="slot-label">
                                <div class="slot-name">${i.name||i.id}</div>
                                <div class="slot-id">${i.id}</div>
                            </div>
                            <ha-selector
                                .hass=${this.hass}
                                .selector=${{ui_action:{default_action:"none"}}}
                                .value=${e[i.id]??i.action??{action:"none"}}
                                @value-changed=${e=>this._slotActionChanged(e,i)}
                            ></ha-selector>
                            ${o?l`<div class="slot-helper">${o}</div>`:l``}
                        </div>
                    `})}
                            </div>
                        `:l``}
            </div>
        `}async _loadCards(){var i;if(this.hass&&this._ensureFrontendVersionValid()){this._cardsService=o(this.hass),this._loading=!0;try{this._cards=await this._cardsService.listCards(),(null==(i=this._config)?void 0:i.card_id)&&await this._loadCardData(this._config.card_id)}catch(e){console.error("Failed to load cards:",e)}finally{this._loading=!1}}}async _subscribeToCardsUpdates(){if(this._cardsService&&this._ensureFrontendVersionValid())try{this.unsubscribe=await this._cardsService.subscribeToUpdates(()=>{this._loadCards()})}catch(i){console.error("Failed to subscribe to cards updates:",i)}}async _loadCardData(i){var e;if(!this._ensureFrontendVersionValid())return;const o=null==(e=this._cards)?void 0:e.find(e=>e.id===i);if(!o)return void(this._slots=[]);const{config:t}=r(o.config);this._documentModel.loadFromConfig(t),this._slots=this._documentModel.getSlotEntities(),this._actionSlots=this._documentModel.getSlotActions()}_renderCardPicker(){var i,e,o,r;const t=this._getSelectedCard(),s=(null==t?void 0:t.name)??((null==(i=this._config)?void 0:i.card_id)?"Selected card unavailable":"-- Select a card --"),a=(null==t?void 0:t.description)||((null==(e=this._config)?void 0:e.card_id)?this._config.card_id:"Choose a Card Builder card to render.");return l`
            <div
                class="card-picker"
                role="combobox"
                aria-expanded=${this._cardPickerOpen?"true":"false"}
            >
                <button
                    class="card-picker-trigger"
                    type="button"
                    @click=${this._toggleCardPicker}
                >
                    <span>
                        <span class="card-picker-title">${s}</span>
                        <span class="card-picker-description">${a}</span>
                    </span>
                    <ha-icon
                        class="card-picker-chevron"
                        icon=${this._cardPickerOpen?"mdi:chevron-up":"mdi:chevron-down"}
                    ></ha-icon>
                </button>
                ${this._cardPickerOpen?l`
                    <div class="card-picker-menu" role="listbox">
                        <button
                            class="card-picker-option ${(null==(o=this._config)?void 0:o.card_id)?"":"selected"}"
                            type="button"
                            role="option"
                            aria-selected=${(null==(r=this._config)?void 0:r.card_id)?"false":"true"}
                            @click=${()=>this._selectCard("")}
                        >
                            <span class="card-picker-title">-- Select a card --</span>
                            <span class="card-picker-description">No card selected.</span>
                        </button>
                        ${this._cards.map(i=>{var e,o;return l`
                            <button
                                class="card-picker-option ${(null==(e=this._config)?void 0:e.card_id)===i.id?"selected":""}"
                                type="button"
                                role="option"
                                aria-selected=${(null==(o=this._config)?void 0:o.card_id)===i.id?"true":"false"}
                                @click=${()=>this._selectCard(i.id)}
                            >
                                <span class="card-picker-title">${i.name}</span>
                                <span class="card-picker-description">${i.description||"No description"}</span>
                            </button>
                        `})}
                    </div>
                `:l``}
            </div>
        `}_getSelectedCard(){var i;const e=null==(i=this._config)?void 0:i.card_id;if(e)return this._cards.find(i=>i.id===e)}_selectCard(i){if(!this._config||!this.hass)return;if(this._config.card_id===i)return void(this._cardPickerOpen=!1);const e={...this._config,card_id:i,slot_entities:{},slot_actions:{}},o=new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0});this.dispatchEvent(o),this._cardPickerOpen=!1}_slotEntityChanged(i,e){var o;if(!this._config||!this.hass)return;let r=(null==(o=i.detail)?void 0:o.value)??"";r="string"==typeof r?r.trim():"";const t={...this._config.slot_entities||{}};r?t[e.id]=r:delete t[e.id];const s={...this._config,slot_entities:t},a=new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0});this.dispatchEvent(a)}_slotActionChanged(i,e){var o;if(!this._config||!this.hass)return;const r=(null==(o=i.detail)?void 0:o.value)||null,t={...this._config.slot_actions||{}};r&&"none"!==r.action?t[e.id]=r:delete t[e.id];const s={...this._config,slot_actions:t},a=new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0});this.dispatchEvent(a)}_formatActionSummary(i){const e=this._getActionLabel(i.action);if("call-service"===i.action||"perform-action"===i.action){const o=this._getServiceValue(i);return`${e}${o?`: ${o}`:""}`}return"navigate"===i.action&&"navigation_path"in i?`${e}: ${i.navigation_path||""}`:"url"===i.action&&"url_path"in i?`${e}: ${i.url_path||""}`:e}_getActionLabel(i){return{none:"None",toggle:"Toggle","call-service":"Call Service","perform-action":"Perform Action",navigate:"Navigate","more-info":"More Info",url:"Open URL","fire-dom-event":"Fire Event","toggle-menu":"Toggle Menu"}[i]??i}_ensureFrontendVersionValid(){if(!this.hass)return!0;const i=t(this.hass);return this._isSameVersionCheck(i)||(this._versionCheck=i),i.ok}_isSameVersionCheck(i){const e=this._versionCheck;return Boolean(e&&e.ok===i.ok&&e.jsVersion===i.jsVersion&&e.runtimeVersion===i.runtimeVersion)}_renderVersionBlocked(i){const e=s(i);return l`
            <div class="version-error">
                <h2 class="version-title">${e.title}</h2>
                <p class="version-message">${e.message}</p>
                <div class="version-grid">
                    <span class="version-label">Cached JS</span>
                    <span class="version-value">${e.jsVersion}</span>
                    <span class="version-label">Runtime</span>
                    <span class="version-value">${e.runtimeVersion}</span>
                </div>
            </div>
        `}_getServiceValue(i){return"perform_action"in i&&"string"==typeof i.perform_action&&i.perform_action?i.perform_action:"service"in i&&"string"==typeof i.service&&i.service?i.service:"domain"in i&&"string"==typeof i.domain&&"service"in i&&"string"==typeof i.service?`${i.domain}.${i.service}`:void 0}};_.styles=d`
        .card-config {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 24px;
        }

        .loading p {
            margin: 0;
            color: var(--secondary-text-color);
        }

        .select-label {
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-weight: 500;
            color: var(--primary-text-color);
        }

        .no-cards {
            margin: 0;
            padding: 16px;
            background-color: var(--warning-color);
            color: var(--text-primary-color);
            border-radius: 4px;
            font-size: 0.9em;
        }

        .card-picker {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .card-picker-trigger {
            width: 100%;
            min-height: 54px;
            padding: 8px 12px;
            border: 1px solid var(--divider-color);
            border-radius: 6px;
            background: var(--card-background-color);
            color: var(--primary-text-color);
            cursor: pointer;
            font-family: inherit;
            text-align: left;
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 10px;
            align-items: center;
        }

        .card-picker-trigger:focus {
            outline: none;
            border-color: var(--primary-color);
        }

        .card-picker-chevron {
            color: var(--secondary-text-color);
            --mdc-icon-size: 20px;
        }

        .card-picker-menu {
            display: flex;
            flex-direction: column;
            max-height: 280px;
            overflow: auto;
            border: 1px solid var(--divider-color);
            border-radius: 6px;
            background: var(--card-background-color);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.16);
        }

        .card-picker-option {
            padding: 9px 12px;
            border: none;
            border-bottom: 1px solid var(--divider-color);
            background: transparent;
            color: var(--primary-text-color);
            cursor: pointer;
            font-family: inherit;
            text-align: left;
        }

        .card-picker-option:last-child {
            border-bottom: none;
        }

        .card-picker-option:hover,
        .card-picker-option.selected {
            background: var(--secondary-background-color);
        }

        .card-picker-title {
            font-size: 14px;
            font-weight: 600;
            line-height: 1.3;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            word-break: break-word;
        }

        .card-picker-description {
            margin-top: 3px;
            color: var(--secondary-text-color);
            font-size: 12px;
            font-weight: 400;
            line-height: 1.35;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            word-break: break-word;
        }

        .info {
            margin: 0;
            padding: 12px;
            background-color: var(--secondary-background-color);
            border-radius: 4px;
            color: var(--secondary-text-color);
            font-size: 0.9em;
        }

        .info code {
            padding: 2px 6px;
            background-color: var(--primary-background-color);
            border-radius: 3px;
            font-family: monospace;
            font-size: 0.95em;
        }

        .slots-config {
            display: flex;
            flex-direction: column;
            gap: 12px;
            border-top: 1px solid var(--divider-color);
            padding-top: 12px;
        }

        .slots-title {
            font-weight: 600;
            color: var(--primary-text-color);
        }

        .slot-row {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 10px;
            border: 1px solid var(--divider-color);
            border-radius: 6px;
            background: var(--secondary-background-color);
        }

        .slot-label {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .slot-name {
            font-weight: 600;
        }

        .slot-id {
            font-size: 12px;
            color: var(--secondary-text-color);
        }

        .slot-helper {
            font-size: 12px;
            color: var(--secondary-text-color);
        }

        .version-error {
            padding: 16px;
            color: var(--primary-text-color);
        }

        .version-title {
            margin: 0 0 8px;
            font-size: 16px;
            line-height: 1.35;
            font-weight: 600;
        }

        .version-message {
            margin: 0;
            font-size: 14px;
            line-height: 1.45;
            color: var(--secondary-text-color);
        }

        .version-grid {
            display: grid;
            grid-template-columns: auto minmax(0, 1fr);
            gap: 6px 10px;
            margin-top: 14px;
            font-size: 13px;
            line-height: 1.35;
        }

        .version-label {
            color: var(--secondary-text-color);
        }

        .version-value {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            overflow-wrap: anywhere;
        }
    `;let f=_;v([p({attribute:!1})],f.prototype,"hass"),v([h()],f.prototype,"_config"),v([h()],f.prototype,"_cards"),v([h()],f.prototype,"_loading"),v([h()],f.prototype,"_slots"),v([h()],f.prototype,"_actionSlots"),v([h()],f.prototype,"_cardPickerOpen"),v([h()],f.prototype,"_versionCheck"),a.define("card-builder-renderer-card-editor",f);const m="CARD-BUILDER-RENDERER",b="#1976d2",x="#FFFFFF",k="#ff7043",y="#FFFFFF";console.info(`%c ${m} %c v${n}`,`background: ${b}; color: ${x}; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;`,`background: ${k}; color: ${y}; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;`),a.boot();