var e;import{i as t,g as i,a as o,b as r,d as a,c as s,e as n,D as l,f as d,l as c,h as p,j as h,n as u,k as g,m as v,C as b,U as m,o as f,p as y,q as x,r as _,s as k,t as w,u as S,v as $,w as C,x as E,y as I,z as M,A as P,B as T,E as B,F as R,G as D,H as O,I as A,J as z,K as L,L as N,M as F,N as V,O as U,P as j,Q as W,R as G,S as H,T as q,V as Y,W as X,X as K,Y as J,Z as Q,_ as Z,$ as ee,a0 as te,a1 as ie,a2 as oe,a3 as re,a4 as ae,a5 as se,a6 as ne,a7 as le,a8 as de,a9 as ce,aa as pe,ab as he,ac as ue,ad as ge,ae as ve,af as be,ag as me,ah as fe,ai as ye,aj as xe,ak as _e,al as ke,am as we,an as Se,ao as $e,ap as Ce,aq as Ee,ar as Ie,as as Me,at as Pe,au as Te,av as Be,aw as Re,ax as De,ay as Oe,az as Ae,aA as ze,aB as Le,aC as Ne,aD as Fe,aE as Ve,aF as Ue,aG as je,aH as We,aI as Ge,aJ as He,aK as qe,aL as Ye,aM as Xe,aN as Ke,aO as Je,aP as Qe,aQ as Ze}from"./card-builder-shared-DHPamekk.js";import{aB as et,aC as tt,aD as it,aE as ot,aF as rt,aG as at,aH as st,aI as nt,aJ as lt,aK as dt,aL as ct,aM as pt,aN as ht,aO as ut,aP as gt,aQ as vt,aR as bt,aS as mt,aT as ft,aU as yt,aV as xt,aW as _t,aX as kt}from"./card-builder-shared-MgdMk8WF.js";import{i as wt}from"./card-builder-shared-CNfdQpSP.js";import{M as St}from"./card-builder-shared-CdxKlK2G.js";import"./card-builder-shared-D9W2hmOT.js";const $t=[{id:"air_quality",label:"Air Quality"},{id:"alarm_control_panel",label:"Alarm Control Panel"},{id:"assist_satellite",label:"Assist Satellite"},{id:"automation",label:"Automation"},{id:"binary_sensor",label:"Binary Sensor"},{id:"button",label:"Button"},{id:"calendar",label:"Calendar"},{id:"camera",label:"Camera"},{id:"climate",label:"Climate"},{id:"conversation",label:"Conversation"},{id:"cover",label:"Cover"},{id:"date",label:"Date"},{id:"datetime",label:"Date/Time"},{id:"device_tracker",label:"Device Tracker"},{id:"event",label:"Event"},{id:"fan",label:"Fan"},{id:"geo_location",label:"Geolocation"},{id:"group",label:"Group"},{id:"humidifier",label:"Humidifier"},{id:"image",label:"Image"},{id:"image_processing",label:"Image Processing"},{id:"input_boolean",label:"Input Boolean"},{id:"input_datetime",label:"Input Date/Time"},{id:"input_number",label:"Input Number"},{id:"input_select",label:"Input Select"},{id:"input_text",label:"Input Text"},{id:"lawn_mower",label:"Lawn Mower"},{id:"light",label:"Light"},{id:"lock",label:"Lock"},{id:"media_player",label:"Media Player"},{id:"number",label:"Number"},{id:"person",label:"Person"},{id:"persistent_notification",label:"Persistent Notification"},{id:"remote",label:"Remote"},{id:"scene",label:"Scene"},{id:"script",label:"Script"},{id:"select",label:"Select"},{id:"sensor",label:"Sensor"},{id:"siren",label:"Siren"},{id:"stt",label:"Speech-to-Text (STT)"},{id:"sun",label:"Sun"},{id:"switch",label:"Switch"},{id:"tag",label:"Tag"},{id:"text",label:"Text"},{id:"time",label:"Time"},{id:"todo",label:"To-Do List"},{id:"tts",label:"Text-to-Speech (TTS)"},{id:"timer",label:"Timer"},{id:"update",label:"Update"},{id:"valve",label:"Valve"},{id:"vacuum",label:"Vacuum"},{id:"wake_word",label:"Wake Word Detection"},{id:"water_heater",label:"Water Heater"},{id:"weather",label:"Weather"},{id:"zone",label:"Zone"}];class Ct{constructor(e){this.hass=e}async browse(e){if(!t(e))throw new Error("Unsupported media source.");const o=i(e);return await this.hass.callWS({type:"card_builder/media/list",path:o})}async resolve(e){return await this.hass.callWS({type:"media_source/resolve_media",media_content_id:e})}async uploadFile(e,o,r){if(!t(o))throw new Error("Upload supported only for Card Builder media.");const a=i(o),s=r||e.name,n=await async function(e){return await new Promise((t,i)=>{const o=new FileReader;o.onload=()=>{const e="string"==typeof o.result?o.result:"",i=e.indexOf(",");t(i>=0?e.slice(i+1):e)},o.onerror=()=>i(o.error??new Error("Failed to read file")),o.readAsDataURL(e)})}(e);return await this.hass.callWS({type:"card_builder/media/upload",path:a,filename:s,content:n})}async deleteFile(e){if(!t(e))throw new Error("Delete supported only for Card Builder media.");const o=i(e);return await this.hass.callWS({type:"card_builder/media/delete",path:o})}}var Et=Object.defineProperty,It=Object.getOwnPropertyDescriptor,Mt=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?It(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Et(t,i,a),a};let Pt=class extends it{constructor(){super(...arguments),this.value="top-left"}render(){return ot`
      ${this.label?ot`<div class="label">${this.label}</div>`:""}
      <div class="anchor-grid">
        ${[{value:"top-left",label:"Top Left"},{value:"top-center",label:"Top Center"},{value:"top-right",label:"Top Right"},{value:"middle-left",label:"Middle Left"},{value:"middle-center",label:"Middle Center"},{value:"middle-right",label:"Middle Right"},{value:"bottom-left",label:"Bottom Left"},{value:"bottom-center",label:"Bottom Center"},{value:"bottom-right",label:"Bottom Right"}].map(e=>ot`
          <div
            class="anchor-point ${this.value===e.value?"active":""}"
            @click=${()=>this.handleSelect(e.value)}
            title="${e.label}"
          ></div>
        `)}
      </div>
    `}handleSelect(e){this.dispatchEvent(new CustomEvent("change",{detail:{value:e},bubbles:!0,composed:!0}))}};Pt.styles=et`
    :host {
      display: block;
    }

    .label {
      display: block;
      margin-bottom: 5px;
      font-size: 10px;
      font-weight: 500;
      color: var(--text-secondary, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .anchor-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
      padding: 8px;
      background: var(--bg-secondary, #f5f5f5);
      border: 1px solid var(--border-color, #d4d4d4);
      border-radius: 3px;
      position: relative;
    }

    .anchor-point {
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: var(--bg-tertiary, #e8e8e8);
      border: 2px solid transparent;
      border-radius: 3px;
      transition: all 0.15s ease;
    }

    .anchor-point:hover {
      background: var(--bg-primary, #fff);
      border-color: var(--accent-color, #0078d4);
    }

    .anchor-point.active {
      background: var(--accent-color, #0078d4);
      border-color: var(--accent-color, #0078d4);
    }

    .anchor-point::before {
      content: '';
      width: 6px;
      height: 6px;
      background: var(--text-secondary, #666);
      border-radius: 50%;
      transition: background 0.15s ease;
    }

    .anchor-point.active::before {
      background: white;
    }
  `,Mt([tt({type:String})],Pt.prototype,"value",2),Mt([tt({type:String})],Pt.prototype,"label",2),Pt=Mt([rt("sm-anchor-selector")],Pt);var Tt=Object.defineProperty,Bt=Object.getOwnPropertyDescriptor,Rt=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Bt(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Tt(t,i,a),a};let Dt=class extends it{constructor(){super(...arguments),this.value="",this.options=[]}render(){return ot`
      <div class="container">
        ${this.label?ot`<div class="label">${this.label}</div>`:""}
        <div class="button-group">
          ${this.options.map(e=>ot`
            <button
              class="button ${this.value===e.value?"active":""}"
              @click=${()=>this.handleSelect(e.value)}
              data-tooltip="${e.tooltip||e.value}"
            >
                ${at(e.icon)}
            </button>
          `)}
        </div>
      </div>
    `}handleSelect(e){this.dispatchEvent(new CustomEvent("change",{detail:{value:e},bubbles:!0,composed:!0}))}};Dt.styles=et`
    :host {
      display: block;
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .label {
      font-size: 10px;
      font-weight: 500;
      color: var(--text-secondary, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .button-group {
      display: flex;
      gap: 4px;
      background: var(--bg-tertiary, #f0f0f0);
      padding: 4px;
      border-radius: 6px;
    }

    .button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px 5px;
      background: transparent;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
      color: var(--text-secondary, #666);
      position: relative;
    }

    .button:hover {
      background: var(--bg-secondary, #e0e0e0);
      color: var(--text-primary, #333);
    }

    .button.active {
      background: var(--accent-color, #0078d4);
      color: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    }

    .button svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    .button::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      font-size: 10px;
      border-radius: 4px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      margin-bottom: 4px;
    }

    .button:hover::after {
      opacity: 1;
    }
  `,Rt([tt({type:String})],Dt.prototype,"value",2),Rt([tt({type:String})],Dt.prototype,"label",2),Rt([tt({type:Array})],Dt.prototype,"options",2),Dt=Rt([rt("sm-button-group-input")],Dt);var Ot=Object.defineProperty,At=(e,t,i,o)=>{for(var r,a=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(t,i,a)||a);return a&&Ot(t,i,a),a};const zt=class extends it{render(){return ot`
            ${this.renderLabel()}
            ${this.renderInput()}
        `}dispatchChange(e){this.dispatchEvent(new CustomEvent("change",{detail:e,bubbles:!0,composed:!0}))}renderLabel(){return this.label?ot`
            <div class="label">${this.label}</div>`:""}};zt.styles=[et`
            :host {
                display: block;
            }

            .label {
                display: block;
                margin-bottom: 5px;
                font-size: 10px;
                font-weight: 500;
                color: var(--text-secondary, #666);
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }

            .input-wrapper {
                display: flex;
                align-items: stretch;
                background: var(--bg-secondary, #f5f5f5);
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 3px;
                transition: border-color 0.15s ease;
                box-sizing: border-box;
            }

            .input-wrapper:focus-within {
                border-color: var(--accent-color, #0078d4);
            }

            input,
            select {
                flex: 1;
                padding: 5px 8px;
                border: none;
                background: transparent;
                color: var(--text-primary, #333);
                font-size: 11px;
                outline: none;
                min-width: 0;
            }

            input::-webkit-inner-spin-button,
            input::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            /* Common button styles */

            .button {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 8px;
                background: var(--bg-tertiary, #e8e8e8);
                border-left: 1px solid var(--border-color, #d4d4d4);
                color: var(--text-secondary, #666);
                font-size: 10px;
                cursor: pointer;
                user-select: none;
                transition: all 0.1s ease;
            }

            .button:hover {
                background: var(--bg-primary, #fff);
                color: var(--accent-color, #0078d4);
            }

            .button:active {
                background: var(--accent-color, #0078d4);
                color: white;
            }
        `];let Lt=zt;At([tt({type:String})],Lt.prototype,"label"),At([tt()],Lt.prototype,"value");var Nt=Object.defineProperty,Ft=Object.getOwnPropertyDescriptor,Vt=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Ft(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Nt(t,i,a),a};let Ut=class extends Lt{constructor(){super(...arguments),this.value="#000000"}renderInput(){return ot`
      <div class="input-wrapper">
        <div class="preview">
          <div class="swatch" style="background: ${this.value}"></div>
          <input
            type="color"
            .value=${this.value}
            @input=${this.handleChange}
          />
        </div>
        <input
          type="text"
          .value=${this.value}
          @input=${this.handleChange}
        />
      </div>
    `}handleChange(e){const t=e.target;this.dispatchChange({value:t.value})}};Ut.styles=[...Lt.styles,et`
      .preview {
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-tertiary, #e8e8e8);
        cursor: pointer;
        position: relative;
        border-right: 1px solid var(--border-color, #d4d4d4);
      }

      .preview::before {
        content: '';
        position: absolute;
        inset: 4px;
        background: linear-gradient(45deg, #ccc 25%, transparent 25%),
                    linear-gradient(-45deg, #ccc 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ccc 75%),
                    linear-gradient(-45deg, transparent 75%, #ccc 75%);
        background-size: 8px 8px;
        background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
        border-radius: 2px;
      }

      .swatch {
        position: absolute;
        inset: 4px;
        border-radius: 2px;
        border: 1px solid rgba(0,0,0,0.1);
      }

      input[type="color"] {
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      input[type="text"] {
        flex: 1;
        padding: 5px 8px;
        border: none;
        background: transparent;
        color: var(--text-primary, #333);
        font-size: 11px;
        font-family: 'Courier New', monospace;
        outline: none;
      }
    `],Vt([tt({type:String})],Ut.prototype,"value",2),Ut=Vt([rt("sm-color-input")],Ut);var jt=Object.defineProperty,Wt=Object.getOwnPropertyDescriptor,Gt=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Wt(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&jt(t,i,a),a};const Ht=[{offset:0,color:"#3b82f6"},{offset:1,color:"#22d3ee"}],qt={type:"linear",x:0,y:0,x2:1,y2:0,colorStops:Ht,global:!1},Yt={type:"radial",x:.5,y:.5,r:.5,colorStops:Ht,global:!1};let Xt=class extends Lt{constructor(){super(...arguments),this.value="#3b82f6"}renderInput(){const e=this.parseValue(this.value),t=e.linear,i=e.radial,o="linear"===e.mode?t:i,r="linear"===e.mode?this.toCssGradient("linear",t):this.toCssGradient("radial",i);return ot`
            <div class="root">
                <div class="field">
                    <span class="field-label">Mode</span>
                    <select
                        .value=${e.mode}
                        @change=${t=>this.handleModeChange(e,t.target.value)}
                    >
                        <option value="solid">Solid</option>
                        <option value="linear">Linear</option>
                        <option value="radial">Radial</option>
                    </select>
                </div>

                ${"solid"===e.mode?ot`
                    <div class="row">
                        <sm-color-input
                            .value=${e.solid}
                            @change=${e=>this.handleSolidColorChange(e)}
                        ></sm-color-input>
                    </div>
                `:ot`
                    <div class="field">
                        <span class="field-label">CSS Gradient</span>
                        <input
                            type="text"
                            .value=${r}
                            @change=${t=>this.handleCssGradientChange("linear"===e.mode?"linear":"radial",t.target.value)}
                        />
                    </div>

                    ${"linear"===e.mode?ot`
                        <div class="row">
                            ${this.renderNumberField("X",t.x,t=>this.updateLinear(e,{x:t}))}
                            ${this.renderNumberField("Y",t.y,t=>this.updateLinear(e,{y:t}))}
                            ${this.renderNumberField("X2",t.x2,t=>this.updateLinear(e,{x2:t}))}
                            ${this.renderNumberField("Y2",t.y2,t=>this.updateLinear(e,{y2:t}))}
                        </div>
                    `:ot`
                        <div class="row">
                            ${this.renderNumberField("Center X",i.x,t=>this.updateRadial(e,{x:t}))}
                            ${this.renderNumberField("Center Y",i.y,t=>this.updateRadial(e,{y:t}))}
                            ${this.renderNumberField("Radius",i.r,t=>this.updateRadial(e,{r:t}))}
                        </div>
                    `}

                    <div class="field">
                        <span class="field-label">Color Stops</span>
                        ${o.colorStops.map((t,i)=>ot`
                            <div class="stop-row">
                                <sm-color-input
                                    .value=${t.color}
                                    @change=${t=>this.handleStopColorChange(e,i,t)}
                                ></sm-color-input>
                                ${this.renderStopOffsetField(e,i,t.offset)}
                                <button
                                    type="button"
                                    class="remove-btn"
                                    title="Remove stop"
                                    ?disabled=${o.colorStops.length<=2}
                                    @click=${()=>this.removeStop(e,i)}
                                >-</button>
                            </div>
                        `)}
                        <button type="button" class="add-btn" @click=${()=>this.addStop(e)}>Add Stop</button>
                    </div>
                `}
            </div>
        `}renderNumberField(e,t,i,o){return ot`
            <div class="field">
                <span class="field-label">${e}</span>
                <input
                    type="number"
                    .value=${String(t)}
                    min=${(null==o?void 0:o.min)??0}
                    max=${(null==o?void 0:o.max)??1}
                    step=${(null==o?void 0:o.step)??.01}
                    @change=${e=>{const t=Number.parseFloat(e.target.value);Number.isFinite(t)&&i(t)}}
                />
            </div>
        `}renderStopOffsetField(e,t,i){return this.renderNumberField("Offset (%)",this.unitToPercent(i),i=>this.updateStop(e,t,{offset:this.percentToUnit(i)}),{min:0,max:100,step:1})}parseValue(e){const t={mode:"solid",solid:"#3b82f6",linear:{...qt,colorStops:Ht.map(e=>({...e}))},radial:{...Yt,colorStops:Ht.map(e=>({...e}))}},i=String(e||"").trim();if(!i)return t;if(i.startsWith("{")&&i.endsWith("}"))try{const e=JSON.parse(i);if("linear"===e.type)return t.mode="linear",t.linear=this.normalizeLinear(e),t;if("radial"===e.type)return t.mode="radial",t.radial=this.normalizeRadial(e),t;if("solid"===e.type&&"string"==typeof e.color)return t.mode="solid",t.solid=e.color||t.solid,t}catch(a){}const o=this.parseCssLinearGradient(i);if(o)return t.mode="linear",t.linear=o,t;const r=this.parseCssRadialGradient(i);return r?(t.mode="radial",t.radial=r,t):(t.mode="solid",t.solid=i,t)}normalizeStops(e){if(!Array.isArray(e))return Ht.map(e=>({...e}));const t=e.map(e=>{const t=e,i=this.clamp01(Number(t.offset)),o="string"==typeof t.color&&t.color.trim()?t.color.trim():"#3b82f6";return Number.isFinite(i)?{offset:i,color:o}:null}).filter(e=>null!==e);return t.length<2?Ht.map(e=>({...e})):t}normalizeLinear(e){return{type:"linear",x:this.normalizeUnit(e.x,qt.x),y:this.normalizeUnit(e.y,qt.y),x2:this.normalizeUnit(e.x2,qt.x2),y2:this.normalizeUnit(e.y2,qt.y2),colorStops:this.normalizeStops(e.colorStops),global:Boolean(e.global)}}normalizeRadial(e){return{type:"radial",x:this.normalizeUnit(e.x,Yt.x),y:this.normalizeUnit(e.y,Yt.y),r:this.normalizeUnit(e.r,Yt.r),colorStops:this.normalizeStops(e.colorStops),global:Boolean(e.global)}}normalizeUnit(e,t){const i=Number(e);return Number.isFinite(i)?i:t}handleModeChange(e,t){if("solid"===t)return void this.dispatchChange({value:e.solid||"#3b82f6"});const i="linear"===t?e.linear:e.radial;this.dispatchChange({value:this.serializeGradient(i)})}handleSolidColorChange(e){e.stopPropagation(),this.dispatchChange({value:String(e.detail.value||"").trim()||"#3b82f6"})}handleStopColorChange(e,t,i){i.stopPropagation(),this.updateStop(e,t,{color:String(i.detail.value||"#3b82f6")})}updateLinear(e,t){const i={...e.linear,...t,colorStops:t.colorStops??e.linear.colorStops};this.dispatchChange({value:this.serializeGradient(i)})}updateRadial(e,t){const i={...e.radial,...t,colorStops:t.colorStops??e.radial.colorStops};this.dispatchChange({value:this.serializeGradient(i)})}updateStop(e,t,i){if("solid"===e.mode)return;const o=("linear"===e.mode?e.linear:e.radial).colorStops.map((e,o)=>o!==t?e:{offset:void 0!==i.offset?this.clamp01(i.offset):e.offset,color:i.color??e.color});"linear"!==e.mode?this.updateRadial(e,{colorStops:o}):this.updateLinear(e,{colorStops:o})}addStop(e){if("solid"===e.mode)return;const t="linear"===e.mode?e.linear:e.radial,i=this.distributeStops([...t.colorStops,{offset:1,color:"#ffffff"}]);"linear"!==e.mode?this.updateRadial(e,{colorStops:i}):this.updateLinear(e,{colorStops:i})}removeStop(e,t){if("solid"===e.mode)return;const i="linear"===e.mode?e.linear:e.radial;if(i.colorStops.length<=2)return;const o=this.distributeStops(i.colorStops.filter((e,i)=>i!==t));"linear"!==e.mode?this.updateRadial(e,{colorStops:o}):this.updateLinear(e,{colorStops:o})}serializeGradient(e){return JSON.stringify({...e,colorStops:e.colorStops.map(e=>({offset:this.clamp01(e.offset),color:String(e.color||"#3b82f6")}))})}distributeStops(e){if(e.length<=1)return e.map(e=>({...e,offset:0}));const t=e.length-1;return e.map((e,i)=>({...e,offset:this.roundUnit(i/t)}))}unitToPercent(e){return Number((100*this.clamp01(e)).toFixed(2))}percentToUnit(e){return this.clamp01(e/100)}roundUnit(e){return Number(this.clamp01(e).toFixed(4))}clamp01(e){return Number.isFinite(e)?e<0?0:e>1?1:e:0}handleCssGradientChange(e,t){const i=t.trim();if(!i)return;const o="linear"===e?this.parseCssLinearGradient(i):this.parseCssRadialGradient(i);o&&this.dispatchChange({value:this.serializeGradient(o)})}toCssGradient(e,t){const i=t.colorStops.map(e=>`${e.color} ${Math.round(100*this.clamp01(e.offset))}%`);if("linear"===e){const e=t;return`linear-gradient(${this.vectorToDirection(e)}, ${i.join(", ")})`}const o=t;return`radial-gradient(circle at ${Math.round(100*o.x)}% ${Math.round(100*o.y)}%, ${i.join(", ")})`}parseCssLinearGradient(e){const t=e.match(/^linear-gradient\(([\s\S]+)\)$/i);if(!t)return null;const i=this.splitTopLevelComma(t[1]);if(i.length<2)return null;const o=i[0].trim().toLowerCase();let r=i,a={x:0,y:0,x2:1,y2:0};(o.startsWith("to ")||o.endsWith("deg"))&&(a=this.directionToVector(i[0].trim()),r=i.slice(1));const s=this.parseGradientStops(r);return s.length<2?null:{type:"linear",...a,colorStops:s,global:!1}}parseCssRadialGradient(e){const t=e.match(/^radial-gradient\(([\s\S]+)\)$/i);if(!t)return null;const i=this.splitTopLevelComma(t[1]);if(i.length<2)return null;let o="",r=i;const a=i[0].trim().toLowerCase();(a.includes("circle")||a.includes("ellipse")||a.includes("at "))&&(o=i[0].trim().toLowerCase(),r=i.slice(1));const s=this.parseGradientStops(r);if(s.length<2)return null;const n=this.parseRadialCenter(o);return{type:"radial",x:n.x,y:n.y,r:.5,colorStops:s,global:!1}}parseRadialCenter(e){if(!e)return{x:.5,y:.5};const t=e.match(/at\s+(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/i);return t?{x:this.clamp01(Number.parseFloat(t[1])/100),y:this.clamp01(Number.parseFloat(t[2])/100)}:{x:.5,y:.5}}parseGradientStops(e){if(0===e.length)return[];const t=e.map(e=>this.parseStopToken(e)).filter(e=>null!==e);if(0===t.length)return[];return t.map((e,i)=>{if("offset"in e&&"number"==typeof e.offset&&Number.isFinite(e.offset))return{color:e.color,offset:this.clamp01(e.offset)};const o=1===t.length?0:i/(t.length-1);return{color:e.color,offset:o}})}parseStopToken(e){const t=e.trim();if(!t)return null;const i=this.findLastTopLevelWhitespace(t);if(i<0)return{color:t};const o=t.slice(0,i).trim(),r=t.slice(i+1).trim(),a=this.parseOffset(r);return null===a?{color:t}:{color:o,offset:a}}parseOffset(e){const t=e.trim().toLowerCase();if(!t)return null;if(t.endsWith("%")){const e=Number.parseFloat(t.slice(0,-1));return Number.isFinite(e)?this.clamp01(e/100):null}const i=Number.parseFloat(t);return Number.isFinite(i)?this.clamp01(i):null}findLastTopLevelWhitespace(e){let t=0;for(let i=e.length-1;i>=0;i-=1){const o=e[i];if(")"!==o)if("("!==o){if(0===t&&/\s/.test(o))return i}else t=Math.max(0,t-1);else t+=1}return-1}splitTopLevelComma(e){const t=[];let i=0,o=0;for(let r=0;r<e.length;r+=1){const a=e[r];"("!==a?")"!==a?","===a&&0===i&&(t.push(e.slice(o,r).trim()),o=r+1):i=Math.max(0,i-1):i+=1}return t.push(e.slice(o).trim()),t.filter(Boolean)}directionToVector(e){const t=e.trim().toLowerCase(),i={"to right":{x:0,y:0,x2:1,y2:0},"to left":{x:1,y:0,x2:0,y2:0},"to bottom":{x:0,y:0,x2:0,y2:1},"to top":{x:0,y:1,x2:0,y2:0},"to bottom right":{x:0,y:0,x2:1,y2:1},"to bottom left":{x:1,y:0,x2:0,y2:1},"to top right":{x:0,y:1,x2:1,y2:0},"to top left":{x:1,y:1,x2:0,y2:0}};return i[t]?i[t]:{x:0,y:0,x2:1,y2:0}}vectorToDirection(e){const t=[{label:"to right",x:0,y:0,x2:1,y2:0},{label:"to left",x:1,y:0,x2:0,y2:0},{label:"to bottom",x:0,y:0,x2:0,y2:1},{label:"to top",x:0,y:1,x2:0,y2:0},{label:"to bottom right",x:0,y:0,x2:1,y2:1},{label:"to bottom left",x:1,y:0,x2:0,y2:1},{label:"to top right",x:0,y:1,x2:1,y2:0},{label:"to top left",x:1,y:1,x2:0,y2:0}].find(t=>Math.abs(e.x-t.x)<1e-4&&Math.abs(e.y-t.y)<1e-4&&Math.abs(e.x2-t.x2)<1e-4&&Math.abs(e.y2-t.y2)<1e-4);return(null==t?void 0:t.label)??"to right"}};Xt.styles=[...Lt.styles,et`
            .root {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .row {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .row > * {
                flex: 1;
                min-width: 0;
            }

            .field {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .field-label {
                font-size: 10px;
                color: var(--text-secondary, #666);
                text-transform: uppercase;
            }

            .field input,
            .field select {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid var(--border-color, #d4d4d4);
                background: var(--bg-secondary, #f5f5f5);
                color: var(--text-primary, #333);
                border-radius: 3px;
                padding: 5px 8px;
                font-size: 11px;
                outline: none;
            }

            .field input:focus,
            .field select:focus {
                border-color: var(--accent-color, #0078d4);
            }

            .stop-row {
                display: grid;
                grid-template-columns: 1fr 1fr auto;
                gap: 8px;
                align-items: end;
            }

            .remove-btn,
            .add-btn {
                border: 1px solid var(--border-color, #d4d4d4);
                background: var(--bg-secondary, #f5f5f5);
                color: var(--text-primary, #333);
                border-radius: 3px;
                cursor: pointer;
                font-size: 11px;
                height: 28px;
                padding: 0 10px;
            }

            .remove-btn {
                width: 32px;
                padding: 0;
            }
        `],Gt([tt({type:String})],Xt.prototype,"value",2),Xt=Gt([rt("sm-echart-color-input")],Xt);var Kt=Object.defineProperty,Jt=Object.getOwnPropertyDescriptor,Qt=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Jt(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Kt(t,i,a),a};let Zt=class extends Lt{constructor(){super(...arguments),this.step=1,this.default=0,this.showUnitSelector=!1}renderInput(){const e=void 0===this.value||Number.isNaN(this.value)?"":String(this.value);return ot`
            <div class="input-wrapper">
                <input
                        type="number"
                        placeholder=${this.placeholder}
                        .value=${e}
                        min=${lt(this.min)}
                        max=${lt(this.max)}
                        step=${this.step}
                        @input=${this.handleInput}
                />
                <div class="arrows">
                    <div class="arrow" @click=${this.increment}>▲</div>
                    <div class="arrow" @click=${this.decrement}>▼</div>
                </div>
                ${this.units&&this.units.length>1?ot`
                    <div class="unit-selector">
                        <div class="unit-button" @click=${this.toggleUnitSelector}>
                            ${this.unit}
                        </div>
                        ${this.showUnitSelector?ot`
                            <div class="unit-options">
                                ${this.units.map(e=>ot`
                                    <div
                                            class="unit-option ${e===this.unit?"active":""}"
                                            @click=${()=>this.selectUnit(e)}
                                    >
                                        ${e}
                                    </div>
                                `)}
                            </div>
                        `:dt}
                    </div>
                `:ot`
                    ${this.unit?ot`
                        <div class="unit-selector">
                            <div class="unit-button">${this.unit}</div>
                        </div>
                    `:dt}
                `}
            </div>
        `}handleInput(e){const t=e.target,i=Number.parseFloat(t.value),o=Number.isFinite(i)?i:0;this.value=o,this.dispatchChange({value:o,unit:this.unit})}getCurrentNumericValue(){var e;const t=(null==(e=this.inputElement)?void 0:e.value)??"",i=Number.parseFloat(t);return Number.isFinite(i)?i:"number"==typeof this.value&&Number.isFinite(this.value)?this.value:this.default}increment(){const e=this.getCurrentNumericValue()+this.step,t=void 0!==this.max?Math.min(e,this.max):e;this.value=t,this.dispatchChange({value:t,unit:this.unit})}decrement(){const e=this.getCurrentNumericValue()-this.step,t=void 0!==this.min?Math.max(e,this.min):e;this.value=t,this.dispatchChange({value:t,unit:this.unit})}toggleUnitSelector(e){e.stopPropagation(),this.showUnitSelector=!this.showUnitSelector}selectUnit(e){this.unit=e,this.showUnitSelector=!1,void 0!==this.value&&this.dispatchChange({value:this.value,unit:e})}};Zt.styles=[...Lt.styles,et`
            .arrows {
                display: flex;
                flex-direction: column;
                background: var(--bg-tertiary, #e8e8e8);
                border-left: 1px solid var(--border-color, #d4d4d4);
            }

            .arrow {
                flex: 1;
                width: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: var(--text-secondary, #666);
                font-size: 8px;
                transition: all 0.1s ease;
                user-select: none;
            }

            .arrow:hover {
                background: var(--bg-primary, #fff);
                color: var(--accent-color, #0078d4);
            }

            .arrow:active {
                background: var(--accent-color, #0078d4);
                color: white;
            }

            .arrow:first-child {
                border-bottom: 1px solid var(--border-color, #d4d4d4);
            }

            .unit-selector {
                position: relative;
            }

            .unit-button {
                padding: 0 8px;
                display: flex;
                align-items: center;
                background: var(--bg-tertiary, #e8e8e8);
                border-left: 1px solid var(--border-color, #d4d4d4);
                color: var(--text-secondary, #666);
                font-size: 10px;
                cursor: pointer;
                user-select: none;
                min-width: 36px;
                height: 100%;
                justify-content: center;
                transition: all 0.1s ease;
            }

            .unit-button:hover {
                background: var(--bg-primary, #fff);
                color: var(--accent-color, #0078d4);
            }

            .unit-options {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--bg-primary, #fff);
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 3px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                min-width: 60px;
                margin-top: 2px;
            }

            .unit-option {
                padding: 6px 12px;
                font-size: 10px;
                cursor: pointer;
                transition: background 0.1s ease;
            }

            .unit-option:hover {
                background: var(--bg-tertiary, #e8e8e8);
            }

            .unit-option.active {
                background: var(--accent-color, #0078d4);
                color: white;
            }
        `],Qt([tt({type:Number})],Zt.prototype,"value",2),Qt([tt({type:Number})],Zt.prototype,"min",2),Qt([tt({type:Number})],Zt.prototype,"max",2),Qt([tt({type:Number})],Zt.prototype,"step",2),Qt([tt({type:String})],Zt.prototype,"unit",2),Qt([tt({type:Array})],Zt.prototype,"units",2),Qt([tt({type:String})],Zt.prototype,"placeholder",2),Qt([tt({type:Number})],Zt.prototype,"default",2),Qt([st()],Zt.prototype,"showUnitSelector",2),Qt([nt("input")],Zt.prototype,"inputElement",2),Zt=Qt([rt("sm-number-input")],Zt);var ei=Object.defineProperty,ti=Object.getOwnPropertyDescriptor,ii=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?ti(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&ei(t,i,a),a};const oi={default:{label:"Default",shortLabel:"Default",color:"#666",bgColor:"#f0f0f0",icon:'<ha-icon icon="mdi:circle-outline"></ha-icon>'},"block-type-default":{label:"Block Default",shortLabel:"Block",color:"#0066cc",bgColor:"#e6f0ff",icon:'<ha-icon icon="mdi:code-brackets"></ha-icon>'},"canvas-default":{label:"Canvas Default",shortLabel:"Canvas",color:"#00a6a6",bgColor:"#e6f7f7",icon:'<ha-icon icon="mdi:card-outline"></ha-icon>'},"parent-inherited":{label:"Inherited",shortLabel:"Parent",color:"#2e8b2e",bgColor:"#e8f5e8",icon:'<ha-icon icon="mdi:arrow-collapse-up"></ha-icon>'},preset:{label:"Preset",shortLabel:"Preset",color:"#7b2d8e",bgColor:"#f5e6f8",icon:'<ha-icon icon="mdi:presentation"></ha-icon>'},"preset-fallback":{label:"Preset (fallback)",shortLabel:"Preset",color:"#9b5dae",bgColor:"#f5e6f8",icon:'<ha-icon icon="mdi:presentation"></ha-icon>'},inline:{label:"Custom",shortLabel:"Custom",color:"#cc6600",bgColor:"#fff5e6",icon:'<ha-icon icon="mdi:location-enter"></ha-icon>'},"inline-fallback":{label:"Custom (fallback)",shortLabel:"Fallback",color:"#cc9966",bgColor:"#fff8f0",icon:'<ha-icon icon="mdi:format-wrap-inline"></ha-icon>'}};let ri=class extends it{constructor(){super(...arguments),this.origin="default",this.compact=!1,this.showTooltip=!0}render(){const e=this._getConfig(),t=this.showTooltip?this._getTooltip():void 0,i=this._getDisplayLabel();return ot`
      <span
        class="badge ${this.compact?"compact":""}"
        style="color: ${e.color}; background: ${e.bgColor};"
        data-tooltip=${t||""}
      >
        <span class="icon">${at(e.icon)}</span>
        <span class="label">${i}</span>
      </span>
    `}_getConfig(){return oi[this.origin]||oi.default}_getTooltip(){let e=this._getConfig().label;return!this.presetName||"preset"!==this.origin&&"preset-fallback"!==this.origin||(e+=`: ${this.presetName}`),!this.originContainer||"inline-fallback"!==this.origin&&"preset-fallback"!==this.origin||(e+=` (from ${this.originContainer})`),e}_getDisplayLabel(){const e=this._getConfig();return!this.presetName||"preset"!==this.origin&&"preset-fallback"!==this.origin?!this.originContainer||"inline-fallback"!==this.origin&&"preset-fallback"!==this.origin?e.shortLabel:this.originContainer:this.presetName}};ri.styles=et`
    :host {
      display: inline-flex;
        --mdc-icon-size: 12px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 9px;
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
      cursor: default;
      transition: opacity 0.15s ease;
    }

    .badge:hover {
      opacity: 0.85;
    }

    .icon {
      font-size: 8px;
    }

    .label {
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .badge.compact {
      padding: 2px 4px;
    }

    .badge.compact .label {
      display: none;
    }

    /* Tooltip */
    .badge[data-tooltip] {
      position: relative;
    }

    .badge[data-tooltip]::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 8px;
      background: #333;
      color: white;
      font-size: 10px;
      font-weight: normal;
      border-radius: 4px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.15s ease, visibility 0.15s ease;
      pointer-events: none;
      z-index: 100;
      margin-bottom: 4px;
    }

    .badge[data-tooltip]::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 4px solid transparent;
      border-top-color: #333;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.15s ease, visibility 0.15s ease;
      pointer-events: none;
      z-index: 100;
    }

    .badge[data-tooltip]:hover::after,
    .badge[data-tooltip]:hover::before {
      opacity: 1;
      visibility: visible;
    }
  `,ii([tt({type:String})],ri.prototype,"origin",2),ii([tt({type:String})],ri.prototype,"presetName",2),ii([tt({type:String})],ri.prototype,"originContainer",2),ii([tt({type:Boolean})],ri.prototype,"compact",2),ii([tt({type:Boolean})],ri.prototype,"showTooltip",2),ri=ii([rt("property-origin-badge")],ri);var ai=Object.defineProperty,si=Object.getOwnPropertyDescriptor,ni=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?si(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&ai(t,i,a),a};let li=class extends Lt{constructor(){super(...arguments),this.value="",this.options=[]}updated(e){e.has("value")&&this.selectElement&&(this.selectElement.value=this.value)}renderInput(){return ot`
            <div class="select-wrapper">
                <select .value=${this.value} @change=${this.handleChange}>
                    ${this.options.map(e=>ot`
                        <option value=${e.value} ?selected=${e.value===this.value}>${e.label}</option>
                    `)}
                </select>
            </div>
        `}handleChange(e){const t=e.target;this.dispatchChange({value:t.value})}};li.styles=[...Lt.styles,et`
            .select-wrapper {
                position: relative;
            }

            select {
                width: 100%;
                padding: 5px 24px 5px 8px;
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 3px;
                background: var(--bg-secondary, #f5f5f5);
                color: var(--text-primary, #333);
                font-size: 11px;
                outline: none;
                cursor: pointer;
                appearance: none;
                transition: border-color 0.15s ease;
            }

            select:focus {
                border-color: var(--accent-color, #0078d4);
            }

            .select-wrapper::after {
                content: '▼';
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 8px;
                color: var(--text-secondary, #666);
                pointer-events: none;
            }
        `],ni([tt({type:String})],li.prototype,"value",2),ni([tt({type:Array})],li.prototype,"options",2),ni([nt("select")],li.prototype,"selectElement",2),li=ni([rt("sm-select-input")],li);var di=Object.defineProperty,ci=Object.getOwnPropertyDescriptor,pi=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?ci(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&di(t,i,a),a};let hi=class extends Lt{constructor(){super(...arguments),this.value=0,this.min=0,this.max=100,this.step=1,this.unit="px",this.units=[],this.showUnitSelector=!1}renderInput(){const e=this.step<1?2:0;return ot`
            <div class="slider-wrapper">
                <input
                        type="range"
                        min=${this.min}
                        max=${this.max}
                        step=${this.step}
                        .value=${String(this.value)}
                        @input=${this.handleInput}
                />
                <span class="value">${this.value.toFixed(e)}</span>
                ${this.units.length>1?ot`
                    <div class="unit-selector">
                        <div class="unit-button" @click=${this.toggleUnitSelector}>
                            ${this.unit}
                        </div>
                        ${this.showUnitSelector?ot`
                            <div class="unit-options">
                                ${this.units.map(e=>ot`
                                    <div
                                            class="unit-option ${e===this.unit?"active":""}"
                                            @click=${()=>this.selectUnit(e)}
                                    >
                                        ${e}
                                    </div>
                                `)}
                            </div>
                        `:""}
                    </div>
                `:1===this.units.length?ot`
                    <div class="unit-button">${this.unit}</div>
                `:""}
            </div>
        `}handleInput(e){const t=e.target,i=parseFloat(t.value);this.dispatchChange({value:i,unit:this.unit})}toggleUnitSelector(e){e.stopPropagation(),this.showUnitSelector=!this.showUnitSelector}selectUnit(e){this.showUnitSelector=!1,this.unit=e,this.dispatchChange({value:this.value,unit:e})}};hi.styles=[...Lt.styles,et`
            .slider-wrapper {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            input[type="range"] {
                flex: 1;
                height: 4px;
                -webkit-appearance: none;
                appearance: none;
                background: var(--bg-tertiary, #e8e8e8);
                border-radius: 2px;
                outline: none;
            }

            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 12px;
                height: 12px;
                background: var(--accent-color, #0078d4);
                border-radius: 50%;
                cursor: pointer;
                transition: transform 0.1s ease;
            }

            input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.2);
            }

            input[type="range"]::-moz-range-thumb {
                width: 12px;
                height: 12px;
                background: var(--accent-color, #0078d4);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                transition: transform 0.1s ease;
            }

            input[type="range"]::-moz-range-thumb:hover {
                transform: scale(1.2);
            }

            .value {
                min-width: 36px;
                text-align: right;
                font-size: 10px;
                color: var(--text-secondary, #666);
                font-weight: 500;
            }

            .unit-selector {
                position: relative;
            }

            .unit-button {
                padding: 0 8px;
                display: flex;
                align-items: center;
                background: var(--bg-tertiary, #e8e8e8);
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 3px;
                color: var(--text-secondary, #666);
                font-size: 10px;
                cursor: pointer;
                user-select: none;
                min-width: 36px;
                height: 100%;
                justify-content: center;
                transition: all 0.1s ease;
            }

            .unit-button:hover {
                background: var(--bg-primary, #fff);
                color: var(--accent-color, #0078d4);
            }

            .unit-options {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--bg-primary, #fff);
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 3px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                min-width: 60px;
                margin-top: 2px;
            }

            .unit-option {
                padding: 6px 12px;
                font-size: 10px;
                cursor: pointer;
                transition: background 0.1s ease;
            }

            .unit-option:hover {
                background: var(--bg-tertiary, #e8e8e8);
            }

            .unit-option.active {
                background: var(--accent-color, #0078d4);
                color: white;
            }
        `],pi([tt({type:Number})],hi.prototype,"value",2),pi([tt({type:Number})],hi.prototype,"min",2),pi([tt({type:Number})],hi.prototype,"max",2),pi([tt({type:Number})],hi.prototype,"step",2),pi([tt({type:String})],hi.prototype,"unit",2),pi([tt({type:Array})],hi.prototype,"units",2),pi([st()],hi.prototype,"showUnitSelector",2),hi=pi([rt("sm-slider-input")],hi);var ui=Object.defineProperty,gi=Object.getOwnPropertyDescriptor,vi=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?gi(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&ui(t,i,a),a};let bi=class extends Lt{constructor(){super(...arguments),this.value=void 0,this.unit="px",this.units=["px"],this.showUnitSelector=!1}renderInput(){var e,t,i,o;return ot`
            <div class="grid">
                <div class="item top">
                    <span class="item-label">Top</span>
                    <input
                        type="number"
                        .value=${String(null==(e=this.value)?void 0:e.top)}
                        @input=${e=>this.handleChange("top",e)}
                    />
                </div>
                <div class="item right">
                    <span class="item-label">Right</span>
                    <input
                        type="number"
                        .value=${String(null==(t=this.value)?void 0:t.right)}
                        @input=${e=>this.handleChange("right",e)}
                    />
                </div>
                <div class="item bottom">
                    <span class="item-label">Bottom</span>
                    <input
                        type="number"
                        .value=${String(null==(i=this.value)?void 0:i.bottom)}
                        @input=${e=>this.handleChange("bottom",e)}
                    />
                </div>
                <div class="item left">
                    <span class="item-label">Left</span>
                    <input
                        type="number"
                        .value=${String(null==(o=this.value)?void 0:o.left)}
                        @input=${e=>this.handleChange("left",e)}
                    />
                </div>
                <div class="item center">
                    ${this.units.length>1?ot`
                        <div class="unit-selector">
                            <div class="unit-button" @click=${this.toggleUnitSelector}>
                                ${this.unit}
                            </div>
                            ${this.showUnitSelector?ot`
                                <div class="unit-options">
                                    ${this.units.map(e=>ot`
                                        <div
                                            class="unit-option ${e===this.unit?"active":""}"
                                            @click=${()=>this.selectUnit(e)}
                                        >
                                            ${e}
                                        </div>
                                    `)}
                                </div>
                            `:""}
                        </div>
                    `:ot`
                        <div class="unit-button">${this.unit}</div>
                    `}
                </div>
            </div>
        `}handleChange(e,t){const i=t.target,o=parseFloat(i.value)||0,r={...this.value||{top:o,right:o,bottom:o,left:o},[e]:o};this.dispatchChange({value:r,unit:this.unit})}toggleUnitSelector(e){e.stopPropagation(),this.showUnitSelector=!this.showUnitSelector}selectUnit(e){this.showUnitSelector=!1,this.unit=e,this.dispatchChange({value:this.value,unit:e})}};bi.styles=[...Lt.styles,et`
            .grid {
                display: grid;
                grid-template-areas:
                  ". top ."
                  "left center right"
                  ". bottom .";
                grid-template-columns: 1fr 1fr 1fr;
                gap: 4px;
            }

            .item {
                position: relative;
            }

            .item.top {
                grid-area: top;
            }

            .item.right {
                grid-area: right;
            }

            .item.bottom {
                grid-area: bottom;
            }

            .item.left {
                grid-area: left;
            }

            .item.center {
                grid-area: center;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .item-label {
                position: absolute;
                top: 2px;
                left: 4px;
                font-size: 8px;
                color: var(--text-secondary, #666);
                text-transform: uppercase;
                pointer-events: none;
                z-index: 1;
            }

            .item input {
                width: 100%;
                padding: 14px 6px 4px;
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 3px;
                box-sizing: border-box;
                background: var(--bg-secondary, #f5f5f5);
                color: var(--text-primary, #333);
                font-size: 12px;
                outline: none;
                text-align: center;
                transition: border-color 0.15s ease;
            }

            .item input:focus {
                border-color: var(--accent-color, #0078d4);
            }

            .unit-selector {
                position: relative;
            }

            .unit-button {
                padding: 4px 8px;
                display: flex;
                align-items: center;
                background: var(--bg-tertiary, #e8e8e8);
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 3px;
                color: var(--text-secondary, #666);
                font-size: 13px;
                cursor: pointer;
                user-select: none;
                min-width: 36px;
                justify-content: center;
                transition: all 0.1s ease;
            }

            .unit-button:hover {
                background: var(--bg-primary, #fff);
                color: var(--accent-color, #0078d4);
            }

            .unit-options {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--bg-primary, #fff);
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 3px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                min-width: 60px;
                margin-top: 2px;
            }

            .unit-option {
                padding: 6px 12px;
                font-size: 10px;
                cursor: pointer;
                transition: background 0.1s ease;
            }

            .unit-option:hover {
                background: var(--bg-tertiary, #e8e8e8);
            }

            .unit-option.active {
                background: var(--accent-color, #0078d4);
                color: white;
            }
        `],vi([tt({type:Object})],bi.prototype,"value",2),vi([tt({type:String})],bi.prototype,"unit",2),vi([tt({type:Array})],bi.prototype,"units",2),vi([st()],bi.prototype,"showUnitSelector",2),bi=vi([rt("sm-spacing-input")],bi);var mi=Object.defineProperty,fi=Object.getOwnPropertyDescriptor,yi=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?fi(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&mi(t,i,a),a};let xi=class extends it{constructor(){super(...arguments),this.value=!1,this.labelOn="On",this.labelOff="Off"}render(){return ot`
      <div class="container">
        ${this.label?ot`<div class="label">${this.label}</div>`:""}
        <div class="toggle-wrapper">
          <div class="toggle-label">${this.value?this.labelOn:this.labelOff}</div>
          <div
            class="toggle ${this.value?"active":""}"
            @click=${this.handleToggle}
          >
            <div class="toggle-handle"></div>
          </div>
        </div>
      </div>
    `}handleToggle(){this.dispatchEvent(new CustomEvent("change",{detail:{value:!this.value},bubbles:!0,composed:!0}))}};function _i(e,t){var i;if(!e)return{};const r=e,a=(null==(i=r.themes)?void 0:i.theme)||"default";return t&&"auto"!==t&&o(e)!==t?{hass:{...e,themes:{...r.themes,darkMode:"dark"===t}},theme:a}:{hass:e,theme:a}}xi.styles=et`
    :host {
      display: block;
    }

    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .label {
      font-size: 10px;
      font-weight: 500;
      color: var(--text-secondary, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .toggle-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toggle-label {
      font-size: 11px;
      color: var(--text-secondary, #666);
      min-width: 45px;
      text-align: right;
    }

    .toggle {
      position: relative;
      width: 40px;
      height: 20px;
      background: var(--bg-tertiary, #e0e0e0);
      border-radius: 10px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .toggle.active {
      background: var(--accent-color, #0078d4);
    }

    .toggle-handle {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      transition: transform 0.2s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .toggle.active .toggle-handle {
      transform: translateX(20px);
    }
  `,yi([tt({type:Boolean})],xi.prototype,"value",2),yi([tt({type:String})],xi.prototype,"label",2),yi([tt({type:String})],xi.prototype,"labelOn",2),yi([tt({type:String})],xi.prototype,"labelOff",2),xi=yi([rt("sm-toggle-input")],xi);const ki=ct("overlay-host");var wi=Object.defineProperty,Si=Object.getOwnPropertyDescriptor,$i=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Si(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&wi(t,i,a),a};let Ci=class extends it{constructor(){super(...arguments),this.tabs=[],this.activeTab=""}render(){return 0===this.tabs.length?ot`<div class="empty-state">No tabs configured</div>`:ot`
      <div class="tabs">
        ${this.tabs.map(e=>ot`
            <button
              class="tab ${this.activeTab===e.id?"active":""}"
              @click=${()=>this._setActiveTab(e.id)}
            >
              ${e.label}
            </button>
          `)}
      </div>
      ${this.tabs.map(e=>ot`
          <div class="tab-content ${this.activeTab===e.id?"active":""}">
            ${this._renderTabContent(e)}
          </div>
        `)}
    `}setActiveTab(e){this._setActiveTab(e)}firstUpdated(e){super.firstUpdated(e),this.tabs.length>0&&!this.activeTab&&(this.activeTab=this.tabs[0].id)}updated(e){if(super.updated(e),e.has("tabs")&&this.tabs.length>0){this.tabs.some(e=>e.id===this.activeTab)||(this.activeTab=this.tabs[0].id)}}_renderTabContent(e){const t=e.props||{};switch(e.component){case"panel-blocks":return ot`<panel-blocks></panel-blocks>`;case"panel-layers":return ot`<panel-layers></panel-layers>`;case"panel-properties":return ot`<panel-properties .hass=${t.hass}></panel-properties>`;case"panel-style":return ot`<panel-styles
                  .hass=${t.hass}      
                  .canvasWidth=${t.canvasWidth}
                  .canvasHeight=${t.canvasHeight}
                  .canvas=${t.canvas}
                ></panel-styles>`;case"panel-actions":return ot`<panel-actions .hass=${t.hass}></panel-actions>`;default:return ot`<div class="empty-state">Unknown component: ${e.component}</div>`}}_setActiveTab(e){this.activeTab=e}};Ci.styles=et`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .tabs {
      display: flex;
      background: var(--cb-sidebar-background);
      border-bottom: 1px solid var(--cb-sidebar-section-border-color);
      height: var(--header-height);
      box-sizing: border-box;
    }
    .tab {
      flex: 1;
      padding: 10px 16px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      border-bottom: 2px solid transparent;
    }
    .tab:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }
    .tab.active {
      color: var(--accent-color);
      border-bottom-color: var(--accent-color);
    }
    .tab-content {
      flex: 1;
      overflow: hidden;
      display: none;
    }
    .tab-content.active {
      display: flex;
      flex-direction: column;
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: var(--text-secondary);
      font-size: 12px;
    }
  `,$i([tt({type:Array})],Ci.prototype,"tabs",2),$i([st()],Ci.prototype,"activeTab",2),Ci=$i([rt("sidebar-tabbed")],Ci);const Ei=class extends it{};Ei.styles=[et`
        :host {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
            font-size: 12px;
        }

        /* Panel structure */

        .panel-header {
            padding: 10px 12px;
            background: var(--bg-tertiary);
            border-bottom: 1px solid var(--border-color);
            font-size: 11px;
            font-weight: 600;
            color: var(--text-primary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .panel-content {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 12px;
        }

        /* Empty state */

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 40px 20px;
            text-align: center;
            color: var(--text-secondary);
            font-size: 13px;
        }

        .empty-state ha-icon {
            --mdc-icon-size: 48px;
            display: block;
            margin-bottom: 16px;
            opacity: 0.3;
        }

        /* Sections */

        .section {
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 8px;
        }

        .section:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }

        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            cursor: pointer;
            user-select: none;
            font-size: 11px;
            font-weight: 600;
            color: var(--text-primary);
            background: var(--bg-secondary);
            transition: background 0.15s ease;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .section-header:hover {
            background: var(--bg-tertiary);
        }

        .section-icon {
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 5px solid var(--text-secondary);
            transition: transform 0.2s ease;
        }

        .section.expanded .section-icon {
            transform: rotate(180deg);
        }

        .section-content {
            display: none;
            padding: 12px;
            background: var(--bg-primary);
            gap: 10px;
        }

        .section.expanded .section-content {
            display: flex;
            flex-direction: column;
        }

        /* Property rows */

        .property-row {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 12px;
        }

        .property-row:last-child {
            margin-bottom: 0;
        }

        .property-label {
            font-size: 10px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .property-input {
            width: 100%;
            padding: 6px 8px;
            font-size: 12px;
            color: var(--text-primary);
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            outline: none;
            transition: all 0.15s ease;
            box-sizing: border-box;
        }

        .property-input:hover {
            border-color: var(--text-secondary);
        }

        .property-input:focus {
            border-color: var(--accent-color);
            background: var(--bg-primary);
        }

        /* Property grid for side-by-side inputs */

        .property-grid {
            display: grid;
            grid-template-columns: 50% 50%;
            gap: 8px;
        }

        /* Info display */

        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: var(--bg-tertiary);
            border-bottom: 1px solid var(--border-color);
            font-size: 10px;
            line-height: 1.6;
        }

        .info-label {
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.3px;
            font-weight: 600;
        }

        .info-value {
            color: var(--text-primary);
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }

        /* Placeholder text */

        .placeholder-text {
            padding: 8px;
            color: var(--text-secondary);
            font-size: 12px;
            text-align: center;
        }
    `];let Ii=Ei;var Mi=Object.defineProperty,Pi=Object.getOwnPropertyDescriptor,Ti=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Pi(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Mi(t,i,a),a};let Bi=class extends it{constructor(){super(...arguments),this.blockType="",this.icon="",this.label=""}render(){return ot`
      <span class="icon">
        ${at(this.icon)}
      </span>
      <span class="label">${this.label}</span>
    `}};Bi.styles=et`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px;
      border: 1px solid var(--border-color);
      border-radius: 2px;
      user-select: none;
      transition: all 0.3s ease;
    }
    :host(:hover) {
      border-color: var(--border-color);
      background: var(--bg-secondary);
      cursor: move;
    }
    .icon {
      font-size: 20px;
      margin-bottom: 4px;
    }
    .label {
      font-size: 12px;
      font-family: var(--cb-font-family), sans-serif;
      color: #515858;
    }
  `,Ti([tt({type:String,attribute:"block-type"})],Bi.prototype,"blockType",2),Ti([tt({type:String})],Bi.prototype,"icon",2),Ti([tt({type:String})],Bi.prototype,"label",2),Bi=Ti([rt("draggable-block")],Bi);var Ri=Object.defineProperty,Di=Object.getOwnPropertyDescriptor,Oi=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Di(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Ri(t,i,a),a};let Ai=class extends Ii{constructor(){super(...arguments),this.panelContent=null,this.sections={basic:{label:"Basic",icon:"mdi:shape-outline",expanded:!1},layout:{label:"Layout",icon:"mdi:view-dashboard-outline",expanded:!1},entities:{label:"Entities",icon:"mdi:home-search-outline",expanded:!1},controls:{label:"Controls",icon:"mdi:tune-variant",expanded:!1},gauges:{label:"Gauges",icon:"mdi:gauge",expanded:!1},charts:{label:"Charts",icon:"mdi:chart-line",expanded:!1},weather:{label:"Weather",icon:"mdi:weather-partly-cloudy",expanded:!1},advanced:{label:"Advanced",icon:"mdi:cog-outline",expanded:!1}}}get sourceId(){return"main-sidebar"}get sourceElement(){return this.panelContent}get sourceAllowedBlockTypes(){return null}async firstUpdated(){await this.updateComplete,this.dragDropManager.registerSourceZone(this)}render(){const e=this.blockRegistry.getAllCategories();return ot`
            <div class="panel-content" ${ht(e=>this.panelContent=e)}>
                ${Object.entries(this.sections).map(([t,i])=>e.includes(t)?ot`
                            <div class="block-section ${i.expanded?"expanded":""}">
                                <div class="block-section-header" @click=${()=>this._toggleSection(t)}>
                                    <div class="block-section-title">
                                        <span class="block-section-label">${i.label}</span>
                                    </div>
                                    <span class="block-section-category-icon">
                                        <ha-icon icon=${i.icon}></ha-icon>
                                    </span>
                                </div>
                                <div class="block-section-content">
                                    ${this.blockRegistry.getByCategory(t).map(e=>ot`
                                                <draggable-block
                                                        block-type="${e.type}"
                                                        icon="${e.icon}"
                                                        label="${e.label}"
                                                        data-block-type="${e.type}"
                                                        data-type="${e.type}"
                                                        data-dnd-draggable="true"
                                                ></draggable-block>
                                            `)}
                                </div>
                            </div>
                        `:dt)}
            </div>
        `}_toggleSection(e){this.sections={...this.sections,[e]:{...this.sections[e],expanded:!this.sections[e].expanded}}}};Ai.styles=[...Ii.styles,et`
            .panel-content {
                padding: 0;
            }

            .block-section {
                padding: 10px;
                border-bottom: 1px solid #ddd;
            }

            .block-section-header {
                display: flex;
                align-items: center;
                padding: 4px;
                cursor: pointer;
                user-select: none;
                font-size: 13px;
                font-weight: 500;
                color: var(--text-primary);
                border-radius: 4px;
            }

            .block-section-header::before {
                content: '';
                display: inline-block;
                width: 0;
                height: 0;
                border-left: 5px solid var(--text-primary);
                border-top: 4px solid transparent;
                border-bottom: 4px solid transparent;
                margin-right: 8px;
                transition: transform 0.2s;
            }

            .block-section.expanded .block-section-header::before {
                transform: rotate(90deg);
            }

            .block-section-title {
                display: flex;
                align-items: center;
                min-width: 0;
                line-height: 20px;
            }

            .block-section-label {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .block-section-category-icon {
                display: flex;
                align-items: center;
                color: var(--text-secondary);
                margin-left: auto;
            }

            .block-section-category-icon ha-icon {
                --mdc-icon-size: 20px;
            }

            .block-section.expanded .block-section-category-icon {
                display: none;
            }

            .block-section-content {
                display: none;
                padding: 8px 0 8px 4px;
            }

            .block-section.expanded .block-section-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }
        `],Oi([pt({context:r})],Ai.prototype,"blockRegistry",2),Oi([pt({context:a})],Ai.prototype,"dragDropManager",2),Oi([st()],Ai.prototype,"sections",2),Ai=Oi([rt("panel-blocks")],Ai);var zi=Object.defineProperty,Li=(e,t,i,o)=>{for(var r,a=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(t,i,a)||a);return a&&zi(t,i,a),a};const Ni=class extends it{constructor(){super(...arguments),this.disabled=!1,this._dropdownOpen=!1,this._searchFilter=""}get showSearch(){return!1}get searchPlaceholder(){return"Search..."}connectedCallback(){super.connectedCallback(),this._handleClickOutside=this._handleClickOutside.bind(this)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._handleClickOutside)}render(){return ot`
      ${this.renderTriggerButton()}
      ${this.renderDropdown()}
    `}_toggleDropdown(){this.disabled||(this._dropdownOpen?this._closeDropdown():this._openDropdown())}_openDropdown(){this._dropdownOpen=!0,this._searchFilter="",setTimeout(()=>{document.addEventListener("click",this._handleClickOutside)},0)}_closeDropdown(){this._dropdownOpen=!1,document.removeEventListener("click",this._handleClickOutside)}_handleSearchInput(e){this._searchFilter=e.target.value.toLowerCase()}renderTriggerIcon(){return dt}renderTriggerButton(){return ot`
      <button
        class="selector-button ${this._dropdownOpen?"open":""}"
        @click=${this._toggleDropdown}
        ?disabled=${this.disabled}
      >
        <span class="icon">${this.renderTriggerIcon()}</span>
        <span class="label">${this.renderTriggerLabel()}</span>
        <span class="arrow">&#9660;</span>
      </button>
    `}renderSearchBox(){return ot`
      <div class="search-box">
        <input
          type="text"
          placeholder=${this.searchPlaceholder}
          .value=${this._searchFilter}
          @input=${this._handleSearchInput}
        />
      </div>
    `}renderDropdown(){return this._dropdownOpen?ot`
      <div class="dropdown" @click=${e=>e.stopPropagation()}>
        ${this.showSearch?this.renderSearchBox():dt}
        ${this.renderDropdownContent()}
      </div>
    `:dt}_handleClickOutside(e){this.contains(e.target)||this._closeDropdown()}};Ni.styles=et`
    :host {
      display: block;
      position: relative;
    }

    .selector-button {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--border-color, #d4d4d4);
      border-radius: 4px;
      background: var(--bg-primary, #fff);
      color: var(--text-primary, #333);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .selector-button:hover:not(:disabled) {
      border-color: var(--accent-color, #0078d4);
    }

    .selector-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .selector-button .icon {
      color: #7b2d8e;
      font-size: 14px;
    }

    .selector-button .label {
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .selector-button .placeholder {
      color: var(--text-secondary, #666);
    }

    .selector-button .arrow {
      color: var(--text-tertiary, #999);
      font-size: 10px;
      transition: transform 0.15s ease;
    }

    .selector-button.open .arrow {
      transform: rotate(180deg);
    }

    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 4px;
      background: var(--bg-primary, #fff);
      border: 1px solid var(--border-color, #d4d4d4);
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      max-height: 300px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .search-box {
      padding: 8px;
      border-bottom: 1px solid var(--border-color, #d4d4d4);
    }

    .search-box input {
      width: 100%;
      padding: 6px 10px;
      border: 1px solid var(--border-color, #d4d4d4);
      border-radius: 3px;
      font-size: 12px;
      outline: none;
    }

    .search-box input:focus {
      border-color: var(--accent-color, #0078d4);
    }

    .option-list {
      flex: 1;
      overflow-y: auto;
      padding: 4px 0;
    }

    .option-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      cursor: pointer;
      transition: background 0.1s ease;
    }

    .option-item:hover {
      background: var(--bg-secondary, #f5f5f5);
    }

    .option-item.selected {
      background: rgba(0, 120, 212, 0.1);
    }

    .option-item .icon {
      color: #7b2d8e;
      font-size: 12px;
      flex-shrink: 0;
    }

    .option-item .info {
      flex: 1;
      min-width: 0;
    }

    .option-item .name {
      font-size: 12px;
      color: var(--text-primary, #333);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .option-item .description {
      font-size: 10px;
      color: var(--text-secondary, #666);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 2px;
    }

    .option-item .meta {
      font-size: 9px;
      color: var(--text-tertiary, #999);
      margin-top: 2px;
    }

    .option-item .check {
      color: var(--accent-color, #0078d4);
      font-size: 14px;
      flex-shrink: 0;
    }

    .divider {
      height: 1px;
      background: var(--border-color, #d4d4d4);
      margin: 4px 0;
    }

    .action-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      cursor: pointer;
      transition: background 0.1s ease;
      color: var(--text-primary, #333);
      font-size: 12px;
    }

    .action-item:hover {
      background: var(--bg-secondary, #f5f5f5);
    }

    .action-item .icon {
      font-size: 14px;
      color: var(--text-secondary, #666);
    }

    .empty-message {
      padding: 16px;
      text-align: center;
      color: var(--text-secondary, #666);
      font-size: 12px;
    }
  `;let Fi=Ni;Li([tt({type:Boolean})],Fi.prototype,"disabled"),Li([st()],Fi.prototype,"_dropdownOpen"),Li([st()],Fi.prototype,"_searchFilter");var Vi=Object.defineProperty,Ui=Object.getOwnPropertyDescriptor,ji=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Ui(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Vi(t,i,a),a};let Wi=class extends Fi{constructor(){super(...arguments),this.slots=[],this.showManagement=!0}get showSearch(){return this.slots.length>5}get searchPlaceholder(){return"Search slots..."}renderTriggerIcon(){return ot`<ha-icon icon="mdi:select-drag"></ha-icon>`}renderTriggerLabel(){const e=this._getSelectedSlot();return ot`
            ${e?ot`${e.name||e.id}`:ot`<span class="placeholder">Select slot</span>`}
        `}renderDropdownContent(){const e=this._getFilteredSlots();return ot`
            <div class="option-list">
                <!-- None option -->
                <div
                    class="option-item ${this.selectedSlotId?"":"selected"}"
                    @click=${()=>this._selectSlot(null)}
                >
                    <span class="icon">
                        <ha-icon icon="mdi:close-circle-outline"></ha-icon>
                    </span>
                    <div class="info">
                        <div class="name">No slot</div>
                        <div class="description">Clear slot selection</div>
                    </div>
                    ${this.selectedSlotId?dt:ot`<span class="check">✓</span>`}
                </div>

                ${e.length>0?ot`
                    <div class="divider"></div>
                    ${e.map(e=>ot`
                        <div
                            class="option-item ${e.id===this.selectedSlotId?"selected":""}"
                            @click=${()=>this._selectSlot(e.id)}
                        >
                            <span class="icon">
                                <ha-icon icon="mdi:select-drag"></ha-icon>
                            </span>
                            <div class="info">
                                <div class="name">${e.name||e.id}</div>
                                ${e.description?ot`
                                    <div class="description">${e.description}</div>
                                `:dt}
                                ${e.entityId?ot`
                                    <div class="meta">Entity: ${e.entityId}</div>
                                `:ot`
                                    <div class="meta">No entity set</div>
                                `}
                            </div>
                            ${e.id===this.selectedSlotId?ot`<span class="check">✓</span>`:dt}
                        </div>
                    `)}
                `:this._searchFilter?ot`
                    <div class="empty-message">No slots match "${this._searchFilter}"</div>
                `:ot`
                    <div class="empty-message">No slots available</div>
                `}
            </div>

            ${this.showManagement?ot`
                <div class="divider"></div>
                <div class="action-item" @click=${this._handleManageSlots}>
                    <span class="icon">
                        <ha-icon icon="mdi:cog"></ha-icon>
                    </span>
                    <span>Manage slots...</span>
                </div>
            `:dt}
        `}_selectSlot(e){this._closeDropdown(),this.dispatchEvent(new CustomEvent("slot-selected",{detail:{slotId:e},bubbles:!0,composed:!0}))}_handleManageSlots(){this._closeDropdown(),this.dispatchEvent(new CustomEvent("manage-entities-slots",{bubbles:!0,composed:!0}))}_getSelectedSlot(){if(this.selectedSlotId)return this.slots.find(e=>e.id===this.selectedSlotId)}_getFilteredSlots(){return this._searchFilter?this.slots.filter(e=>{var t,i,o;return e.id.toLowerCase().includes(this._searchFilter)||(null==(t=e.name)?void 0:t.toLowerCase().includes(this._searchFilter))||(null==(i=e.description)?void 0:i.toLowerCase().includes(this._searchFilter))||(null==(o=e.entityId)?void 0:o.toLowerCase().includes(this._searchFilter))}):this.slots}};ji([tt({attribute:!1})],Wi.prototype,"slots",2),ji([tt({type:String})],Wi.prototype,"selectedSlotId",2),ji([tt({type:Boolean})],Wi.prototype,"showManagement",2),Wi=ji([rt("slot-selector")],Wi);var Gi=Object.defineProperty,Hi=Object.getOwnPropertyDescriptor,qi=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Hi(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Gi(t,i,a),a};let Yi=class extends it{constructor(){super(...arguments),this.slots=[],this.slotError=null,this._handleSlotsChanged=()=>{this._refreshSlots()}}connectedCallback(){super.connectedCallback(),this._refreshSlots(),this.documentModel.addEventListener("slots-changed",this._handleSlotsChanged)}disconnectedCallback(){super.disconnectedCallback(),this.documentModel.removeEventListener("slots-changed",this._handleSlotsChanged)}render(){var e;const t=(null==(e=this.config)?void 0:e.mode)||"inherited";return ot`
            <div class="entity-config-container">
                <!-- Mode Selector -->
                <div class="config-section">
                    <span class="section-label">Entity Mode</span>
                    <div class="mode-selector">
                        <div
                            class="mode-option ${"inherited"===t?"active":""}"
                            @click=${()=>this._setMode("inherited")}
                        >
                            <ha-icon icon="mdi:arrow-down-right-bold"></ha-icon>
                            Inherited
                        </div>
                        <div
                            class="mode-option ${"slot"===t?"active":""}"
                            @click=${()=>this._setMode("slot")}
                        >
                            <ha-icon icon="mdi:select-drag"></ha-icon>
                            Slot
                        </div>
                        <div
                            class="mode-option ${"fixed"===t?"active":""}"
                            @click=${()=>this._setMode("fixed")}
                        >
                            <ha-icon icon="mdi:pin"></ha-icon>
                            Fixed
                        </div>
                    </div>
                </div>

                <!-- Entity Selection / Info based on mode -->
                <div class="config-section">
                    ${"fixed"===t?this._renderFixedEntityPicker():"slot"===t?this._renderSlotConfig():this._renderInheritedInfo()}
                </div>
            </div>
        `}_refreshSlots(){this.slots=this.documentModel.getSlotEntities()}_renderFixedEntityPicker(){var e;const t=(null==(e=this.config)?void 0:e.entityId)||"";return ot`
            <span class="section-label">Entity</span>
            <ha-selector
                    .hass=${this.hass}
                    .selector=${{entity:{multiple:!1}}}
                    .value=${t}
                    @value-changed=${this._onEntityChanged}
                    allow-custom-entity
                    label="Select entity"
            ></ha-selector>
        `}_renderInheritedInfo(){const e=this.resolvedInfo;return e&&"none"!==e.source?ot`
            <div class="inherited-info">
                <div class="inherited-header">
                    <ha-icon icon="mdi:arrow-down-right-bold"></ha-icon>
                    <span>Inherited Entity</span>
                </div>
                <div class="inherited-entity" title="${e.entityId}">
                    ${e.entityId}
                </div>
                ${e.inheritedFromId?ot`
                    <div class="inherited-source">
                        <span>From:</span>
                        <span
                                class="source-link"
                                @click=${()=>this._selectSourceBlock(e.inheritedFromId)}
                        >
                            ${e.inheritedFromDisplayName||e.inheritedFromType}
                        </span>
                    </div>
                `:dt}
            </div>
        `:this.documentModel.isEntityRequired(this.block.id)?ot`
                    <div class="no-entity-warning">
                        <ha-icon icon="mdi:alert"></ha-icon>
                        <span>No parent entity found. Set an entity on a parent block or switch to static mode.</span>
                    </div>
                `:ot`
                <div class="inherited-info">
                    <div class="inherited-header">
                        <ha-icon icon="mdi:arrow-down-right-bold"></ha-icon>
                        <span>Inherited Entity</span>
                    </div>
                    <div class="inherited-entity">
                        No Entity Inherited from Parents
                    </div>
                </div>
            `}_renderSlotConfig(){var e;const t=(null==(e=this.config)?void 0:e.slotId)||"",i=t?this.slots.find(e=>e.id===t):void 0;return ot`
            <div class="slot-config">
                ${t?dt:ot`
                    <div class="no-entity-warning">
                        <ha-icon icon="mdi:alert"></ha-icon>
                        <span>No Slot ID. Please, select a Slot for the entity.</span>
                    </div>
                `}
                ${t&&!i?ot`
                    <div class="no-entity-warning">
                        <ha-icon icon="mdi:alert"></ha-icon>
                        <span>Slot not found. Select a valid slot or create a new one.</span>
                    </div>
                `:dt}
                <span class="section-label">Slot</span>
                <slot-selector
                    .slots=${this.slots}
                    .selectedSlotId=${t||void 0}
                    .showManagement=${!0}
                    @slot-selected=${this._onSlotSelected}
                    @manage-entities-slots=${this._onManageSlots}
                ></slot-selector>
                ${i?ot`
                    <div class="slot-info">
                        <div class="slot-info-entity">
                            <span class="slot-info-entity-label">Slot entity:</span>
                            <span class="slot-info-entity-id">${i.entityId||"not set"}</span>
                        </div>
                        ${i.domains&&i.domains.length>0?ot`
                            <div class="slot-info-entity">
                                <span class="slot-info-entity-label">Allowed domains:</span>
                                <span class="slot-info-entity-id">${i.domains.join(", ")}</span>
                            </div>
                        `:dt}
                        ${i.description?ot`
                            <div class="slot-info-description">${i.description}</div>
                        `:dt}
                    </div>
                `:dt}
                ${this.slotError?ot`<span class="slot-id-hint">${this.slotError}</span>`:dt}
            </div>
        `}_setMode(e){var t,i;const o={mode:e};"fixed"===e?o.entityId=null==(t=this.config)?void 0:t.entityId:"slot"===e&&(o.slotId=null==(i=this.config)?void 0:i.slotId),this._emitConfigChanged(o)}_onEntityChanged(e){const t={mode:"fixed",entityId:e.detail.value||""||void 0};this._emitConfigChanged(t)}_onSlotSelected(e){const t=e.detail.slotId;this.slotError=null;const i={mode:"slot",slotId:t||void 0};this._emitConfigChanged(i)}_onManageSlots(){this.dispatchEvent(new CustomEvent("manage-entities-slots",{bubbles:!0,composed:!0}))}_selectSourceBlock(e){this.dispatchEvent(new CustomEvent("select-source-block",{detail:{blockId:e},bubbles:!0,composed:!0}))}_emitConfigChanged(e){this.dispatchEvent(new CustomEvent("config-changed",{detail:e,bubbles:!0,composed:!0}))}};Yi.styles=et`
        :host {
            display: block;
        }

        .entity-config-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .config-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .section-label {
            font-size: 10px;
            font-weight: 600;
            color: var(--text-secondary, #666);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        /* Mode Selector */

        .mode-selector {
            display: flex;
            background: var(--bg-tertiary, #f5f5f5);
            border-radius: 6px;
            padding: 2px;
            height: 32px;
        }

        .mode-option {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            font-size: 11px;
            font-weight: 500;
            color: var(--text-secondary, #666);
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s ease;
            user-select: none;
        }

        .mode-option ha-icon {
            --mdc-icon-size: 14px;
        }

        .mode-option:hover {
            color: var(--text-primary, #333);
        }

        .mode-option.active {
            background: var(--accent-color, #2196f3);
            color: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        .entity-input {
            width: 100%;
            padding: 8px 10px;
            border: 1px solid var(--border-color, #e0e0e0);
            border-radius: 4px;
            font-size: 12px;
            font-family: monospace;
            background: var(--bg-primary, #fff);
            color: var(--text-primary, #333);
            box-sizing: border-box;
        }

        .entity-input:focus {
            outline: none;
            border-color: var(--accent-color, #2196f3);
        }

        /* Inherited Info */

        .inherited-info {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 10px 12px;
            background: var(--bg-secondary, #f9f9f9);
            border: 1px solid var(--border-color, #e0e0e0);
            border-radius: 6px;
        }

        .inherited-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: var(--text-secondary, #666);
            --mdc-icon-size: 16px;
        }

        .inherited-icon {
            font-size: 14px;
        }

        .inherited-entity {
            font-family: monospace;
            font-size: 12px;
            color: var(--text-primary, #333);
            font-weight: 500;
            text-overflow: ellipsis;
            display: inline-block;
            overflow: hidden;
        }

        .inherited-source {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 10px;
            color: var(--text-secondary, #666);
        }

        .source-link {
            color: var(--accent-color, #2196f3);
            cursor: pointer;
            text-decoration: underline;
            font-weight: 500;
        }

        .source-link:hover {
            color: var(--accent-dark, #1976d2);
        }

        .no-entity-warning {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            background: rgba(255, 152, 0, 0.1);
            border: 1px solid rgba(255, 152, 0, 0.3);
            border-radius: 6px;
            font-size: 13px;
            font-weight: bold;
            color: var(--warning-color, #ff9800);
        }

        .warning-icon {
            font-size: 16px;
        }

        /* Slot Configuration */

        .slot-config {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-top: 8px;
            border-top: 1px solid var(--border-color, #e0e0e0);
        }

        .slot-info {
            padding: 8px 10px;
            background: var(--bg-secondary, #f9f9f9);
            border: 1px solid var(--border-color, #e0e0e0);
            border-radius: 4px;
            font-size: 11px;
        }

        .slot-info-entity {
            font-size: 12px;
            margin-bottom: 4px;
        }

        .slot-info-entity-label {
            color: var(--text-secondary, #666);
        }

        .slot-info-entity-id {
            font-weight: bold;
            font-family: monospace;
            color: var(--text-primary, #333);
        }

        .slot-info-description {
            color: var(--text-secondary, #666);
            font-style: italic;
        }
    `,qi([pt({context:s})],Yi.prototype,"documentModel",2),qi([tt({attribute:!1})],Yi.prototype,"block",2),qi([tt({attribute:!1})],Yi.prototype,"config",2),qi([tt({attribute:!1})],Yi.prototype,"resolvedInfo",2),qi([tt({attribute:!1})],Yi.prototype,"hass",2),qi([st()],Yi.prototype,"slots",2),qi([st()],Yi.prototype,"slotError",2),Yi=qi([rt("entity-config-editor")],Yi);const Xi=1,Ki=12,Ji=1,Qi=12,Zi=100,eo=["#4caf50","#2196f3","#ff9800","#9c27b0","#f44336","#00bcd4","#ff5722","#3f51b5","#8bc34a","#e91e63","#009688","#ffc107","#673ab7","#cddc39","#ff6f00","#03a9f4"];function to(e,t="fr",i,o){return{value:e,unit:t,minValue:i,maxValue:o}}var io=Object.defineProperty,oo=Object.getOwnPropertyDescriptor,ro=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?oo(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&io(t,i,a),a};let ao=class extends it{constructor(){super(...arguments),this.selectedCells=null,this.isDragging=!1,this.dragStart=null}connectedCallback(){super.connectedCallback(),window.addEventListener("mouseup",this._handleMouseUp.bind(this))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mouseup",this._handleMouseUp.bind(this))}clearSelection(){this.selectedCells=null}render(){const e={gridTemplateRows:n(this.config.rowSizes),gridTemplateColumns:n(this.config.columnSizes),gap:`${this.config.gap.row}px ${this.config.gap.column}px`},t=[];for(let i=0;i<this.config.rows;i++)for(let e=0;e<this.config.columns;e++)t.push({row:i,column:e});return ot`
      <div class="canvas-container">
        <div class="grid-preview" style=${ut(e)}>
          ${gt(t,e=>`${e.row}-${e.column}`,e=>{const t=(i=e.row,o=e.column,this.config.areas.find(e=>i>=e.rowStart&&i<e.rowEnd&&o>=e.columnStart&&o<e.columnEnd)||null);var i,o;const r=this._isCellSelected(e.row,e.column),a={"grid-cell":!0,selected:r,"in-area":!!t},s={};if(t&&t.color){const e=(e,t)=>`rgba(${parseInt(e.slice(1,3),16)}, ${parseInt(e.slice(3,5),16)}, ${parseInt(e.slice(5,7),16)}, ${t})`;r?(s.background=e(t.color,.9),s.borderColor=t.color):(s.background=e(t.color,.25),s.borderColor=e(t.color,.6))}return ot`
                <div
                  class=${vt(a)}
                  style=${ut(s)}
                  @mousedown=${()=>this._handleCellMouseDown(e.row,e.column)}
                  @mouseenter=${()=>this._handleCellMouseEnter(e.row,e.column)}
                >
                  ${t&&e.row===t.rowStart&&e.column===t.columnStart?ot`<span class="area-label">${t.name}</span>`:""}
                  <span class="cell-coordinates">${e.row+1},${e.column+1}</span>
                </div>
              `})}
        </div>
      </div>
    `}_isCellSelected(e,t){return!!this.selectedCells&&(e>=this.selectedCells.rowStart&&e<this.selectedCells.rowEnd&&t>=this.selectedCells.columnStart&&t<this.selectedCells.columnEnd)}_handleCellMouseDown(e,t){this.isDragging=!0,this.dragStart={row:e,column:t},this.selectedCells={rowStart:e,rowEnd:e+1,columnStart:t,columnEnd:t+1}}_handleCellMouseEnter(e,t){if(this.isDragging&&this.dragStart){const i=Math.min(this.dragStart.row,e),o=Math.max(this.dragStart.row,e)+1,r=Math.min(this.dragStart.column,t),a=Math.max(this.dragStart.column,t)+1;this.selectedCells={rowStart:i,rowEnd:o,columnStart:r,columnEnd:a}}}_handleMouseUp(){this.isDragging&&this.selectedCells&&this.dispatchEvent(new CustomEvent("cells-selected",{detail:{selection:this.selectedCells},bubbles:!0,composed:!0})),this.isDragging=!1,this.dragStart=null}};ao.styles=et`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: auto;
      background: var(--bg-primary, #fff);
    }

    .canvas-container {
      padding: 20px;
      min-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .grid-preview {
      display: grid;
      border: 2px solid var(--border-color, #ddd);
      background: var(--bg-secondary, #f9f9f9);
      min-width: 400px;
      min-height: 300px;
      position: relative;
    }

    .grid-cell {
      border: 1px solid var(--border-color, #ddd);
      background: var(--bg-primary, #fff);
      position: relative;
      cursor: pointer;
      transition: all 0.15s ease;
      min-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: var(--text-secondary, #999);
      user-select: none;
    }

    .grid-cell:hover {
      background: var(--accent-light, #e3f2fd);
      border-color: var(--accent-color, #2196f3);
    }

    .grid-cell.selected {
      background: var(--accent-color, #2196f3);
      color: white;
      border-color: var(--accent-color, #2196f3);
      z-index: 1;
    }

    .grid-cell.in-area {
      /* Color set via inline style with area-specific color */
      border-width: 2px;
    }

    .grid-cell.in-area.selected {
      /* Darker version when selected, set via inline style */
      color: white;
    }

    .area-label {
      position: absolute;
      top: 2px;
      left: 4px;
      font-size: 9px;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 2px 4px;
      border-radius: 2px;
      pointer-events: none;
      z-index: 1;
    }

    .cell-coordinates {
      opacity: 0.5;
      font-size: 9px;
    }
  `,ro([tt({type:Object})],ao.prototype,"config",2),ro([st()],ao.prototype,"selectedCells",2),ro([st()],ao.prototype,"isDragging",2),ro([st()],ao.prototype,"dragStart",2),ao=ro([rt("grid-visual-canvas")],ao);var so=Object.defineProperty,no=Object.getOwnPropertyDescriptor,lo=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?no(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&so(t,i,a),a};let co=class extends it{render(){const e="auto"!==this.dimension.unit,t="minmax"===this.dimension.unit;return ot`
      <div class="size-input-container">
        <span class="index-label">${this.index+1}</span>
        ${e?ot`
              <input
                type="number"
                class="value-input"
                .value=${this.dimension.value.toString()}
                @input=${this._handleValueChange}
                min="0"
                step=${"fr"===this.dimension.unit?"0.1":"1"}
              />
            `:""}
        <select class="unit-select" .value=${this.dimension.unit} @change=${this._handleUnitChange}>
          <option value="fr">fr</option>
          <option value="px">px</option>
          <option value="%">%</option>
          <option value="auto">auto</option>
          <option value="minmax">minmax</option>
        </select>
      </div>
      ${t?ot`
            <div class="minmax-inputs">
              <span class="minmax-label">min:</span>
              <input
                type="number"
                class="minmax-input"
                .value=${(this.dimension.minValue??100).toString()}
                @input=${e=>this._handleMinMaxChange(e,"min")}
                min="0"
              />
              <span class="minmax-label">max:</span>
              <input
                type="number"
                class="minmax-input"
                .value=${(this.dimension.maxValue??300).toString()}
                @input=${e=>this._handleMinMaxChange(e,"max")}
                min="0"
              />
            </div>
          `:""}
    `}_handleValueChange(e){const t=e.target,i=parseFloat(t.value)||0;this.dispatchEvent(new CustomEvent("dimension-change",{detail:{index:this.index,type:this.type,dimension:{...this.dimension,value:i}},bubbles:!0,composed:!0}))}_handleUnitChange(e){const t=e.target.value,i={...this.dimension,unit:t};"minmax"===t&&(i.minValue=i.minValue??100,i.maxValue=i.maxValue??300),this.dispatchEvent(new CustomEvent("dimension-change",{detail:{index:this.index,type:this.type,dimension:i},bubbles:!0,composed:!0}))}_handleMinMaxChange(e,t){const i=e.target,o=parseFloat(i.value)||0,r={...this.dimension,["min"===t?"minValue":"maxValue"]:o};this.dispatchEvent(new CustomEvent("dimension-change",{detail:{index:this.index,type:this.type,dimension:r},bubbles:!0,composed:!0}))}};co.styles=et`
    :host {
      display: block;
    }

    .size-input-container {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .index-label {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-secondary, #666);
      min-width: 20px;
    }

    .value-input {
      flex: 1;
      padding: 4px 6px;
      font-size: 11px;
      border: 1px solid var(--border-color, #ddd);
      border-radius: 3px;
      background: var(--bg-primary, #fff);
      outline: none;
      transition: border-color 0.15s ease;
    }

    .value-input:focus {
      border-color: var(--accent-color, #2196f3);
    }

    .unit-select {
      padding: 4px 6px;
      font-size: 11px;
      border: 1px solid var(--border-color, #ddd);
      border-radius: 3px;
      background: var(--bg-primary, #fff);
      outline: none;
      cursor: pointer;
      transition: border-color 0.15s ease;
    }

    .unit-select:focus {
      border-color: var(--accent-color, #2196f3);
    }

    .minmax-inputs {
      display: flex;
      gap: 4px;
      margin-top: 4px;
      padding-left: 24px;
    }

    .minmax-label {
      font-size: 9px;
      color: var(--text-secondary, #999);
      min-width: 30px;
      display: flex;
      align-items: center;
    }

    .minmax-input {
      flex: 1;
      padding: 3px 5px;
      font-size: 10px;
      border: 1px solid var(--border-color, #ddd);
      border-radius: 2px;
      background: var(--bg-primary, #fff);
    }
  `,lo([tt({type:Object})],co.prototype,"dimension",2),lo([tt({type:Number})],co.prototype,"index",2),lo([tt({type:String})],co.prototype,"type",2),co=lo([rt("grid-size-input")],co);var po=Object.defineProperty,ho=Object.getOwnPropertyDescriptor,uo=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?ho(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&po(t,i,a),a};let go=class extends it{constructor(){super(...arguments),this.areas=[],this.selectedCells=null}render(){const e=!!this.selectedCells,t=e?{rows:this.selectedCells.rowEnd-this.selectedCells.rowStart,cols:this.selectedCells.columnEnd-this.selectedCells.columnStart}:null,i=this._getSuggestedAreaName();return ot`
      <div class="area-manager">
        <!-- Create area section -->
        <div class="create-area-section">
          <div class="section-title">Create Grid Area</div>
          
          ${e?ot`
                <div class="selection-info">
                  Selected: 
                  <span class="selection-coords">
                    ${t.rows} row${t.rows>1?"s":""} × 
                    ${t.cols} column${t.cols>1?"s":""}
                  </span>
                </div>
                <div class="create-area-form">
                  <div class="form-group">
                    <label class="form-label">Area Name</label>
                    <input
                      id="area-name-input"
                      type="text"
                      class="form-input"
                      .value=${i}
                      placeholder="e.g., header, sidebar"
                    />
                  </div>
                  <button
                    class="btn btn-primary"
                    @click=${this._handleCreateArea}
                  >
                    Create
                  </button>
                </div>
              `:ot`
                <div class="selection-info">
                  Select cells in the grid to create an area
                </div>
              `}
        </div>

        <!-- Areas list -->
        <div>
          <div class="section-title">Defined Areas (${this.areas.length})</div>
          ${this.areas.length>0?ot`
                <div class="areas-list">
                  ${gt(this.areas,e=>e.name,e=>ot`
                      <div class="area-item" style="border-left-color: ${e.color||"#ddd"}">
                        <div 
                          class="area-color-indicator" 
                          style="background-color: ${e.color||"#ddd"}"
                        ></div>
                        <div class="area-info">
                          <div class="area-name">${e.name}</div>
                          <div class="area-coords">${this._formatCoords(e)}</div>
                        </div>
                        <button
                          class="btn btn-danger"
                          @click=${()=>this._handleDeleteArea(e)}
                          title="Delete area"
                        >
                          Delete
                        </button>
                      </div>
                    `)}
                </div>
              `:ot`
                <div class="no-areas">
                  No areas defined yet. Select cells to create one.
                </div>
              `}
        </div>
      </div>
    `}_handleCreateArea(){var e;if(!this.selectedCells)return;const t=null==(e=this.shadowRoot)?void 0:e.querySelector("#area-name-input"),i=(null==t?void 0:t.value.trim())||"";if(!i)return void alert("Please enter an area name");if(this.areas.some(e=>e.name===i))return void alert("An area with this name already exists");const o=(r=this.areas.length,eo[r%eo.length]);var r;const a={id:i.replaceAll(" ","-").toLowerCase(),name:i,rowStart:this.selectedCells.rowStart,rowEnd:this.selectedCells.rowEnd,columnStart:this.selectedCells.columnStart,columnEnd:this.selectedCells.columnEnd,color:o};this.dispatchEvent(new CustomEvent("area-created",{detail:{area:a},bubbles:!0,composed:!0}))}_handleDeleteArea(e){this.dispatchEvent(new CustomEvent("area-deleted",{detail:{area:e},bubbles:!0,composed:!0}))}_formatCoords(e){return`rows ${e.rowStart+1}-${e.rowEnd} / cols ${e.columnStart+1}-${e.columnEnd}`}_getSuggestedAreaName(){let e=1,t=`Area-${e}`;const i=new Set(this.areas.map(e=>e.name));for(;i.has(t);)e++,t=`Area-${e}`;return t}};go.styles=et`
    :host {
      display: block;
    }

    .area-manager {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .section-title {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-secondary, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 4px;
    }

    .create-area-section {
      padding: 12px;
      background: var(--bg-secondary, #f5f5f5);
      border-radius: 4px;
      border: 1px solid var(--border-color, #ddd);
    }

    .selection-info {
      font-size: 11px;
      color: var(--text-secondary, #666);
      margin-bottom: 8px;
      padding: 6px 8px;
      background: var(--bg-primary, #fff);
      border-radius: 3px;
      border: 1px solid var(--border-color, #ddd);
    }

    .selection-coords {
      font-weight: 600;
      color: var(--text-primary, #333);
    }

    .create-area-form {
      display: flex;
      gap: 6px;
      align-items: flex-end;
    }

    .form-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .form-label {
      font-size: 9px;
      font-weight: 600;
      color: var(--text-secondary, #666);
      text-transform: uppercase;
    }

    .form-input {
      padding: 6px 8px;
      font-size: 11px;
      border: 1px solid var(--border-color, #ddd);
      border-radius: 3px;
      background: var(--bg-primary, #fff);
      outline: none;
      transition: border-color 0.15s ease;
    }

    .form-input:focus {
      border-color: var(--accent-color, #2196f3);
    }

    .btn {
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 600;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }

    .btn-primary {
      background: var(--accent-color, #2196f3);
      color: white;
    }

    .btn-primary:hover {
      background: var(--accent-dark, #1976d2);
    }

    .btn-primary:disabled {
      background: var(--border-color, #ddd);
      cursor: not-allowed;
      opacity: 0.6;
    }

    .btn-danger {
      background: var(--error-color, #f44336);
      color: white;
      padding: 4px 8px;
      font-size: 10px;
    }

    .btn-danger:hover {
      background: var(--error-dark, #d32f2f);
    }

    .areas-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .area-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      background: var(--bg-primary, #fff);
      border: 1px solid var(--border-color, #ddd);
      border-radius: 4px;
      gap: 8px;
      border-left-width: 4px;
    }

    .area-color-indicator {
      width: 20px;
      height: 20px;
      border-radius: 3px;
      flex-shrink: 0;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .area-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .area-name {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-primary, #333);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .area-coords {
      font-size: 9px;
      color: var(--text-secondary, #999);
      font-family: monospace;
    }

    .no-areas {
      padding: 16px;
      text-align: center;
      font-size: 11px;
      color: var(--text-secondary, #999);
      background: var(--bg-secondary, #f5f5f5);
      border-radius: 4px;
      border: 1px dashed var(--border-color, #ddd);
    }
  `,uo([tt({type:Array})],go.prototype,"areas",2),uo([tt({type:Object})],go.prototype,"selectedCells",2),go=uo([rt("grid-area-manager")],go);var vo=Object.defineProperty,bo=Object.getOwnPropertyDescriptor,mo=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?bo(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&vo(t,i,a),a};let fo=class extends it{constructor(){super(...arguments),this.config={...l},this.selectedCells=null,this.collapsedTabs=new Set}render(){return ot`
      <div class="editor-container">
        <!-- Header with grid dimensions -->
        <div class="editor-header">
          <h3 class="editor-title">Grid Layout Editor</h3>
          <div class="grid-dimensions">
            <div class="dimension-group">
              <label class="dimension-label">Rows</label>
              <div class="dimension-input">
                <input
                  type="number"
                  .value=${this.config.rows.toString()}
                  @input=${this._handleRowsChange}
                  min=${Xi}
                  max=${Ki}
                />
                <span class="dimension-info">
                  (${Xi}-${Ki})
                </span>
              </div>
            </div>
            <div class="dimension-group">
              <label class="dimension-label">Columns</label>
              <div class="dimension-input">
                <input
                  type="number"
                  .value=${this.config.columns.toString()}
                  @input=${this._handleColumnsChange}
                  min=${Ji}
                  max=${Qi}
                />
                <span class="dimension-info">
                  (${Ji}-${Qi})
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Body with canvas and sidebar -->
        <div class="editor-body">
          <!-- Canvas section -->
          <div class="canvas-section">
            <grid-visual-canvas
              .config=${this.config}
              @cells-selected=${this._handleCellsSelected}
            ></grid-visual-canvas>
          </div>

          <!-- Sidebar section -->
          <div class="sidebar-section">
            <!-- Row sizes tab -->
            <div class="sidebar-tab">
              <div
                class="tab-header ${this.collapsedTabs.has("rows")?"collapsed":""}"
                @click=${()=>this._toggleTab("rows")}
              >
                <span>Row Sizes</span>
                <div class="tab-icon"></div>
              </div>
              <div class="tab-content ${this.collapsedTabs.has("rows")?"hidden":""}">
                <div class="sizes-list">
                  ${gt(this.config.rowSizes,(e,t)=>t,(e,t)=>ot`
                      <grid-size-input
                        .dimension=${e}
                        .index=${t}
                        .type=${"row"}
                        @dimension-change=${this._handleDimensionChange}
                      ></grid-size-input>
                    `)}
                </div>
              </div>
            </div>

            <!-- Column sizes tab -->
            <div class="sidebar-tab">
              <div
                class="tab-header ${this.collapsedTabs.has("columns")?"collapsed":""}"
                @click=${()=>this._toggleTab("columns")}
              >
                <span>Column Sizes</span>
                <div class="tab-icon"></div>
              </div>
              <div class="tab-content ${this.collapsedTabs.has("columns")?"hidden":""}">
                <div class="sizes-list">
                  ${gt(this.config.columnSizes,(e,t)=>t,(e,t)=>ot`
                      <grid-size-input
                        .dimension=${e}
                        .index=${t}
                        .type=${"column"}
                        @dimension-change=${this._handleDimensionChange}
                      ></grid-size-input>
                    `)}
                </div>
              </div>
            </div>

            <!-- Gap tab -->
            <div class="sidebar-tab">
              <div
                class="tab-header ${this.collapsedTabs.has("gap")?"collapsed":""}"
                @click=${()=>this._toggleTab("gap")}
              >
                <span>Gap</span>
                <div class="tab-icon"></div>
              </div>
              <div class="tab-content ${this.collapsedTabs.has("gap")?"hidden":""}">
                <div class="gap-controls">
                  <div class="gap-group">
                    <label class="gap-label">Row Gap (px)</label>
                    <input
                      type="number"
                      class="gap-input"
                      .value=${this.config.gap.row.toString()}
                      @input=${e=>this._handleGapChange(e,"row")}
                      min="0"
                      max=${Zi}
                    />
                  </div>
                  <div class="gap-group">
                    <label class="gap-label">Column Gap (px)</label>
                    <input
                      type="number"
                      class="gap-input"
                      .value=${this.config.gap.column.toString()}
                      @input=${e=>this._handleGapChange(e,"column")}
                      min="0"
                      max=${Zi}
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Areas tab -->
            <div class="sidebar-tab">
              <div
                class="tab-header ${this.collapsedTabs.has("areas")?"collapsed":""}"
                @click=${()=>this._toggleTab("areas")}
              >
                <span>Grid Areas</span>
                <div class="tab-icon"></div>
              </div>
              <div class="tab-content ${this.collapsedTabs.has("areas")?"hidden":""}">
                <grid-area-manager
                  .areas=${this.config.areas}
                  .selectedCells=${this.selectedCells}
                  @area-created=${this._handleAreaCreated}
                  @area-deleted=${this._handleAreaDeleted}
                ></grid-area-manager>
              </div>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="action-buttons">
          <button class="btn btn-cancel" @click=${this._handleCancel}>Cancel</button>
          <button class="btn btn-apply" @click=${this._handleApply}>Apply</button>
        </div>
      </div>
    `}_handleRowsChange(e){const t=e.target;let i=parseInt(t.value)||1;i=Math.max(Xi,Math.min(Ki,i));const o={...this.config,rows:i};if(i>this.config.rowSizes.length){const e=i-this.config.rowSizes.length;o.rowSizes=[...this.config.rowSizes,...Array(e).fill(null).map(()=>to(1,"fr"))]}else i<this.config.rowSizes.length&&(o.rowSizes=this.config.rowSizes.slice(0,i));o.areas=this.config.areas.filter(e=>e.rowEnd<=i&&e.columnEnd<=this.config.columns),this.config=o,this._clearSelection()}_handleColumnsChange(e){const t=e.target;let i=parseInt(t.value)||1;i=Math.max(Ji,Math.min(Qi,i));const o={...this.config,columns:i};if(i>this.config.columnSizes.length){const e=i-this.config.columnSizes.length;o.columnSizes=[...this.config.columnSizes,...Array(e).fill(null).map(()=>to(1,"fr"))]}else i<this.config.columnSizes.length&&(o.columnSizes=this.config.columnSizes.slice(0,i));o.areas=this.config.areas.filter(e=>e.rowEnd<=this.config.rows&&e.columnEnd<=i),this.config=o,this._clearSelection()}_handleDimensionChange(e){const{index:t,type:i,dimension:o}=e.detail,r={...this.config};"row"===i?(r.rowSizes=[...this.config.rowSizes],r.rowSizes[t]=o):(r.columnSizes=[...this.config.columnSizes],r.columnSizes[t]=o),this.config=r}_handleGapChange(e,t){const i=e.target,o=Math.max(0,Math.min(Zi,parseInt(i.value)||0));this.config={...this.config,gap:{...this.config.gap,[t]:o}}}_handleCellsSelected(e){this.selectedCells=e.detail.selection}_handleAreaCreated(e){const{area:t}=e.detail;this.config={...this.config,areas:[...this.config.areas,t]},this._clearSelection()}_handleAreaDeleted(e){const{area:t}=e.detail;this.config={...this.config,areas:this.config.areas.filter(e=>e.name!==t.name)}}_clearSelection(){var e;this.selectedCells=null,null==(e=this.canvas)||e.clearSelection()}_toggleTab(e){this.collapsedTabs.has(e)?this.collapsedTabs.delete(e):this.collapsedTabs.add(e),this.requestUpdate()}_handleCancel(){this.dispatchEvent(new CustomEvent("editor-cancel",{bubbles:!0,composed:!0}))}_handleApply(){this.dispatchEvent(new CustomEvent("editor-apply",{detail:{config:this.config},bubbles:!0,composed:!0}))}};fo.styles=et`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--bg-primary, #fff);
    }

    .editor-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .editor-header {
      padding: 16px;
      border-bottom: 1px solid var(--border-color, #ddd);
      background: var(--bg-secondary, #f5f5f5);
    }

    .editor-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary, #333);
      margin: 0 0 12px 0;
    }

    .grid-dimensions {
      display: flex;
      gap: 16px;
      align-items: flex-end;
    }

    .dimension-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .dimension-label {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-secondary, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .dimension-input {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dimension-input input {
      width: 60px;
      padding: 6px 8px;
      font-size: 12px;
      border: 1px solid var(--border-color, #ddd);
      border-radius: 4px;
      background: var(--bg-primary, #fff);
      outline: none;
      transition: border-color 0.15s ease;
    }

    .dimension-input input:focus {
      border-color: var(--accent-color, #2196f3);
    }

    .dimension-info {
      font-size: 10px;
      color: var(--text-secondary, #999);
    }

    .editor-body {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .canvas-section {
      flex: 1;
      overflow: auto;
      border-right: 1px solid var(--border-color, #ddd);
    }

    .sidebar-section {
      width: 260px;
      overflow-y: auto;
      background: var(--bg-secondary, #f9f9f9);
      display: flex;
      flex-direction: column;
    }

    .sidebar-tab {
      border-bottom: 1px solid var(--border-color, #ddd);
    }

    .tab-header {
      padding: 12px 16px;
      background: var(--bg-tertiary, #e0e0e0);
      font-size: 11px;
      font-weight: 600;
      color: var(--text-primary, #333);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: background 0.15s ease;
    }

    .tab-header:hover {
      background: var(--bg-secondary, #d0d0d0);
    }

    .tab-header.collapsed {
      border-bottom: 1px solid var(--border-color, #ddd);
    }

    .tab-icon {
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid var(--text-secondary, #666);
      transition: transform 0.2s ease;
    }

    .tab-header.collapsed .tab-icon {
      transform: rotate(-90deg);
    }

    .tab-content {
      padding: 12px;
      background: var(--bg-primary, #fff);
    }

    .tab-content.hidden {
      display: none;
    }

    .sizes-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .gap-controls {
      display: flex;
      gap: 12px;
    }

    .gap-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .gap-label {
      font-size: 9px;
      font-weight: 600;
      color: var(--text-secondary, #666);
      text-transform: uppercase;
    }

    .gap-input {
      width: 100%;
      padding: 6px 8px;
      font-size: 11px;
      border: 1px solid var(--border-color, #ddd);
      border-radius: 3px;
      background: var(--bg-primary, #fff);
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid var(--border-color, #ddd);
      background: var(--bg-secondary, #f5f5f5);
    }

    .btn {
      flex: 1;
      padding: 10px 16px;
      font-size: 12px;
      font-weight: 600;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-cancel {
      background: var(--bg-tertiary, #e0e0e0);
      color: var(--text-primary, #333);
    }

    .btn-cancel:hover {
      background: var(--bg-secondary, #d0d0d0);
    }

    .btn-apply {
      background: var(--accent-color, #2196f3);
      color: white;
    }

    .btn-apply:hover {
      background: var(--accent-dark, #1976d2);
    }
  `,mo([tt({type:Object})],fo.prototype,"config",2),mo([st()],fo.prototype,"selectedCells",2),mo([nt("grid-visual-canvas")],fo.prototype,"canvas",2),fo=mo([rt("grid-layout-editor")],fo);var yo=Object.defineProperty,xo=Object.getOwnPropertyDescriptor,_o=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?xo(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&yo(t,i,a),a};let ko=class extends it{constructor(){super(...arguments),this.open=!1,this._escapeHandler=e=>{"Escape"===e.key&&this._handleCancel()}}connectedCallback(){super.connectedCallback(),this.config&&(this.editingConfig=JSON.parse(JSON.stringify(this.config)))}updated(e){super.updated(e),(e.has("open")&&this.open&&this.config||e.has("config")&&this.config&&this.open)&&(this.editingConfig=JSON.parse(JSON.stringify(this.config))),e.has("open")&&(this.open?this._addEscapeListener():this._removeEscapeListener())}disconnectedCallback(){super.disconnectedCallback(),this._removeEscapeListener()}render(){return this.editingConfig?ot`
            <div class="overlay-backdrop" @click=${this._handleBackdropClick}></div>
            <div class="editor-panel">
                <div class="editor-content">
                    <grid-layout-editor
                            .config=${this.editingConfig}
                            @editor-cancel=${this._handleCancel}
                            @editor-apply=${this._handleApply}
                    ></grid-layout-editor>
                </div>
            </div>
        `:ot``}_addEscapeListener(){window.addEventListener("keydown",this._escapeHandler)}_removeEscapeListener(){window.removeEventListener("keydown",this._escapeHandler)}_handleBackdropClick(e){e.target===e.currentTarget&&this._handleCancel()}_handleCancel(){this.dispatchEvent(new CustomEvent("overlay-cancel",{bubbles:!0,composed:!0}))}_handleApply(e){this.dispatchEvent(new CustomEvent("overlay-apply",{detail:e.detail,bubbles:!0,composed:!0}))}};ko.styles=et`
        :host {
            display: block;
            position: fixed;
            width: 100vw;
            top: 0;
            left: 100%;
            bottom: 0;
            z-index: 1000;
            pointer-events: none;
        }

        :host([open]) {
            pointer-events: auto;
            left: 0;
        }

        .overlay-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            opacity: 0;
            transition: opacity 0.8s ease;
            backdrop-filter: blur(3px);
        }

        :host([open]) .overlay-backdrop {
            opacity: 1;
        }


        .editor-panel {
            position: absolute;
            top: 0;
            left: 100%;
            bottom: 0;
            width: min(85vw, 1400px);
            background: var(--bg-primary, #fff);
            box-shadow: 4px 0 24px rgba(0, 0, 0, 0.4);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 1;
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateX(0);
        }

        :host([open]) .editor-panel {
            transform: translateX(-100%);
        }

        .editor-content {
            flex: 1;
            overflow: hidden;
        }
    `,_o([tt({type:Boolean,reflect:!0})],ko.prototype,"open",2),_o([tt({type:Object})],ko.prototype,"config",2),_o([st()],ko.prototype,"editingConfig",2),ko=_o([rt("grid-editor-overlay")],ko);var wo=Object.defineProperty,So=Object.getOwnPropertyDescriptor,$o=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?So(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&wo(t,i,a),a};let Co=class extends it{constructor(){super(...arguments),this.open=!1,this.title="",this.subtitle="",this.escapeHandler=e=>{"Escape"===e.key&&this.handleClose()}}updated(e){super.updated(e),e.has("open")&&(this.open?this.addEscapeListener():this.removeEscapeListener())}disconnectedCallback(){super.disconnectedCallback(),this.removeEscapeListener()}render(){return ot`
      <div class="editor-panel">
        <div class="editor-header">
          <div class="header-text">
            <span class="header-title">${this.title}</span>
            <span class="header-subtitle">${this.subtitle}</span>
          </div>
          <button class="close-button" @click=${this.handleClose}>Close</button>
        </div>
        <div class="editor-content">
          <slot></slot>
        </div>
      </div>
    `}addEscapeListener(){window.addEventListener("keydown",this.escapeHandler)}removeEscapeListener(){window.removeEventListener("keydown",this.escapeHandler)}handleClose(){this.dispatchEvent(new CustomEvent("overlay-close",{bubbles:!0,composed:!0}))}};Co.styles=et`
    :host {
      display: block;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: var(--right-sidebar-width, 260px);
      z-index: 110;
      pointer-events: none;
      transform: translateX(100%);
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    :host([open]) {
      pointer-events: auto;
      transform: translateX(0);
    }

    .editor-panel {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--bg-primary, #fff);
      border-left: 1px solid var(--border-color, #d4d4d4);
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.4);
    }

    .editor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      background: var(--bg-secondary, #f5f5f5);
      border-bottom: 1px solid var(--border-color, #d4d4d4);
      gap: 12px;
    }

    .header-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .header-title {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-secondary, #666);
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .header-subtitle {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary, #333);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .close-button {
      border: 1px solid var(--border-color, #d4d4d4);
      background: var(--bg-primary, #fff);
      color: var(--text-primary, #333);
      border-radius: 4px;
      padding: 6px 10px;
      font-size: 11px;
      cursor: pointer;
    }

    .close-button:hover {
      border-color: var(--accent-color, #0078d4);
      color: var(--accent-color, #0078d4);
    }

    .editor-content {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }
  `,$o([tt({type:Boolean,reflect:!0})],Co.prototype,"open",2),$o([tt({type:String})],Co.prototype,"title",2),$o([tt({type:String})],Co.prototype,"subtitle",2),Co=$o([rt("property-editor-overlay")],Co);var Eo=Object.defineProperty,Io=Object.getOwnPropertyDescriptor,Mo=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Io(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Eo(t,i,a),a};const Po=[{value:"top-left",label:"Top Left"},{value:"top-center",label:"Top Center"},{value:"top-right",label:"Top Right"},{value:"middle-left",label:"Middle Left"},{value:"middle-center",label:"Center"},{value:"middle-right",label:"Middle Right"},{value:"bottom-left",label:"Bottom Left"},{value:"bottom-center",label:"Bottom Center"},{value:"bottom-right",label:"Bottom Right"}];let To=class extends it{constructor(){super(...arguments),this.open=!1,this.linkModeState=null,this.selection=null,this.gridColor="#000000",this._handleLinkModeChanged=e=>{const t=e.detail;this.linkModeState=(null==t?void 0:t.state)??null},this._handleSelectionChanged=e=>{const t=e.detail;this.selection=(null==t?void 0:t.selection)??null},this._handleGridColorChanged=e=>{const t=e.detail;this.gridColor=(null==t?void 0:t.color)||"#000000"},this._handleClose=()=>{this.dispatchEvent(new CustomEvent("overlay-close",{bubbles:!0,composed:!0}))}}connectedCallback(){super.connectedCallback(),this.linkModeState=this.documentModel.getLinkModeState(),this.selection=this.documentModel.getLinkEditorSelection(),this.gridColor=this.documentModel.getLinkGridColor(),this.documentModel.addEventListener("link-mode-changed",this._handleLinkModeChanged),this.documentModel.addEventListener("link-editor-selection-changed",this._handleSelectionChanged),this.documentModel.addEventListener("link-grid-color-changed",this._handleGridColorChanged)}disconnectedCallback(){this.documentModel.removeEventListener("link-mode-changed",this._handleLinkModeChanged),this.documentModel.removeEventListener("link-editor-selection-changed",this._handleSelectionChanged),this.documentModel.removeEventListener("link-grid-color-changed",this._handleGridColorChanged),super.disconnectedCallback()}render(){var e,t,i,o,r,a,s;if(!this.block)return ot``;const n=this._getPoints(),l=p(n,this._getSegments()),d=n.find(e=>{var t;return e.id===(null==(t=this.selection)?void 0:t.pointId)})??null,c=(null==(e=this.selection)?void 0:e.segmentIndex)??null,h=Boolean(this._getPropValue("smoothingEnabled",!1)),u=Number(this._getPropValue("smoothingTension",.15)),g=Boolean(null==(t=this.linkEditorPreferences)?void 0:t.showGrid),v=Boolean(null==(i=this.linkEditorPreferences)?void 0:i.snapToGrid),b=Boolean(null==(o=this.linkEditorPreferences)?void 0:o.snapToPoints),m=Boolean(null==(r=this.linkEditorPreferences)?void 0:r.snapToBlocks),f=Boolean(null==(a=this.linkEditorPreferences)?void 0:a.showPoints),y=this.gridColor,x=(null==(s=this.linkModeState)?void 0:s.mode)??"idle",_="draw"===x?"Drawing":"pick-anchor"===x?"Pick Anchor":"Editing";return ot`
            <property-editor-overlay
                .open=${this.open}
                title="Link Editor"
                .subtitle=${this.block.label||this.block.id}
                @overlay-close=${this._handleClose}
            >
                <div class="section">
                    <div class="section-title">Mode</div>
                    <div class="mode-row">
                        <span class="mode-badge ${"idle"!==x?"active":""}">${_}</span>
                        ${"draw"===x?ot`
                                <div class="mode-actions">
                                    <button class="action-button primary" @click=${()=>this.controller.finishDrawing()}>Finish Path</button>
                                </div>
                                <div class="hint">Click to add points. Right click or use Finish Path to complete.</div>
                              `:dt}
                        ${"pick-anchor"===x?ot`<div class="hint">Click a block on the canvas to anchor the selected point.</div>`:dt}
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Points</div>
                    ${0===n.length?ot`<div class="empty">No points yet. Activate draw mode to add points.</div>`:ot`
                            <div class="list">
                                ${n.map((e,t)=>{var i,o;const r=(null==(i=e.anchor)?void 0:i.blockId)?this.documentModel.getBlock(e.anchor.blockId):null,a=this._getBlockDisplayLabel(r);return ot`
                                        <div
                                            class="list-item ${(null==(o=this.selection)?void 0:o.pointId)===e.id?"selected":""}"
                                            @click=${()=>this.controller.selectPoint(this.block.id,e.id)}
                                        >
                                            <span>P${t+1}</span>
                                            <span class="list-meta">
                                                ${a?ot`<span class="anchor-chip">Anchor: ${a}</span>`:dt}
                                                ${e.x.toFixed(1)}, ${e.y.toFixed(1)}
                                            </span>
                                        </div>
                                    `})}
                            </div>
                          `}

                    ${d?this._renderPointEditor(d,n):dt}
                </div>

                <div class="section">
                    <div class="section-title">Segments</div>
                    ${0===l.length?ot`<div class="empty">Add at least two points to edit segments.</div>`:ot`
                            <div class="list">
                                ${l.map((e,t)=>ot`
                                    <div
                                        class="list-item ${c===t?"selected":""}"
                                        @click=${()=>this.controller.selectSegment(this.block.id,t)}
                                    >
                                        <span>S${t+1}</span>
                                        <span class="list-meta">${e.type}</span>
                                    </div>
                                `)}
                            </div>
                            ${null!==c?this._renderSegmentEditor(c,l[c]):dt}
                          `}
                </div>

                <div class="section">
                    <div class="section-title">Smoothing</div>
                    <sm-toggle-input
                        label="Smoothing"
                        .value=${h}
                        @change=${e=>this.controller.updateProp(this.block.id,"smoothingEnabled",e.detail.value)}
                    ></sm-toggle-input>
                    ${h?ot`
                        <div class="row">
                            <sm-slider-input
                                label="Tension"
                                .value=${u}
                                .min=${0}
                                .max=${1}
                                .step=${.05}
                                @change=${e=>this.controller.updateProp(this.block.id,"smoothingTension",e.detail.value)}
                            ></sm-slider-input>
                        </div>
                    `:dt}
                </div>

                <div class="section">
                    <div class="section-title">Grid & Snap</div>
                    <div class="row">
                        <sm-toggle-input
                            label="Show Points"
                            .value=${f}
                            @change=${e=>this._updatePreferences({showPoints:e.detail.value})}
                        ></sm-toggle-input>
                        <sm-toggle-input
                            label="Show Grid"
                            .value=${g}
                            @change=${e=>this._updatePreferences({showGrid:e.detail.value})}
                        ></sm-toggle-input>
                        ${g?ot`
                            <sm-color-input
                                label="Grid Color"
                                .value=${y}
                                @change=${e=>this.documentModel.setLinkGridColor(e.detail.value)}
                            ></sm-color-input>
                        `:dt}
                        ${g?ot`
                            <sm-toggle-input
                                label="Snap to Grid"
                                .value=${v}
                                @change=${e=>this._updatePreferences({snapToGrid:e.detail.value})}
                            ></sm-toggle-input>
                        `:dt}
                        <sm-toggle-input
                            label="Snap to Points"
                            .value=${b}
                            @change=${e=>this._updatePreferences({snapToPoints:e.detail.value})}
                        ></sm-toggle-input>
                        <sm-toggle-input
                            label="Snap to Blocks"
                            .value=${m}
                            @change=${e=>this._updatePreferences({snapToBlocks:e.detail.value})}
                        ></sm-toggle-input>
                    </div>
                </div>
            </property-editor-overlay>
        `}_renderPointEditor(e,t){var i,o,r,a,s,n,l,d;const c=Boolean(null==(i=e.anchor)?void 0:i.blockId),p="pick-anchor"===(null==(o=this.linkModeState)?void 0:o.mode)&&(null==(r=this.linkModeState)?void 0:r.anchorPickPointId)===e.id,h=c||p,u=(null==(a=e.anchor)?void 0:a.anchor)||"middle-center";return ot`
            <div class="row">
                <div class="section-title">Selected Point</div>
                <div class="inline-grid">
                    <sm-number-input
                        label="X"
                        .value=${Number(e.x.toFixed(2))}
                        .min=${0}
                        .max=${100}
                        .step=${.1}
                        unit="%"
                        @change=${t=>this.controller.updatePointCoordinate(this.block.id,e.id,"x",t.detail.value)}
                    ></sm-number-input>
                    <sm-number-input
                        label="Y"
                        .value=${Number(e.y.toFixed(2))}
                        .min=${0}
                        .max=${100}
                        .step=${.1}
                        unit="%"
                        @change=${t=>this.controller.updatePointCoordinate(this.block.id,e.id,"y",t.detail.value)}
                    ></sm-number-input>
                </div>

                <sm-toggle-input
                    label="Anchor To Block"
                    .value=${h}
                    @change=${t=>this.controller.toggleAnchor(this.block.id,e.id,t.detail.value)}
                ></sm-toggle-input>

                ${h?ot`
                    <div class="row">
                        <div class="anchor-actions">
                            <button class="action-button ${p?"active":""}" @click=${()=>this.controller.enterAnchorPick(this.block.id,e.id)}>
                                ${c?"Change Block":"Pick Block"}
                            </button>
                        </div>
                        <sm-select-input
                            label="Anchor Point"
                            .value=${u}
                            .options=${Po}
                            @change=${t=>this.controller.updateAnchorPoint(this.block.id,e.id,t.detail.value)}
                        ></sm-select-input>
                        ${c?ot`
                            <div class="inline-grid">
                                <sm-number-input
                                    label="Offset X"
                                    .value=${Number((null==(n=null==(s=e.anchor)?void 0:s.offset)?void 0:n.x.toFixed(2))??0)}
                                    .min=${-100}
                                    .max=${100}
                                    .step=${.1}
                                    unit="%"
                                    @change=${t=>this.controller.updateAnchorOffset(this.block.id,e.id,"x",t.detail.value)}
                                ></sm-number-input>
                                <sm-number-input
                                    label="Offset Y"
                                    .value=${Number((null==(d=null==(l=e.anchor)?void 0:l.offset)?void 0:d.y.toFixed(2))??0)}
                                    .min=${-100}
                                    .max=${100}
                                    .step=${.1}
                                    unit="%"
                                    @change=${t=>this.controller.updateAnchorOffset(this.block.id,e.id,"y",t.detail.value)}
                                ></sm-number-input>
                            </div>
                        `:dt}
                    </div>
                `:dt}

                ${t.length>2?ot`
                    <div class="mode-actions">
                        <button class="action-button" @click=${()=>this.controller.deletePoint(this.block.id,e.id)}>Delete Point</button>
                    </div>
                `:dt}
            </div>
        `}_renderSegmentEditor(e,t){const i=t.type||"line",o=t.curvePreset??"manual",r="number"==typeof t.curveBulge?t.curveBulge:.25,a=Boolean(t.curveAutoUpdate??!1);return ot`
            <div class="row">
                <div class="section-title">Selected Segment</div>
                <sm-select-input
                    label="Type"
                    .value=${i}
                    .options=${[{value:"line",label:"Line"},{value:"curve",label:"Curve"}]}
                    @change=${t=>this.controller.setSegmentType(this.block.id,e,t.detail.value)}
                ></sm-select-input>
                ${"curve"===i?ot`
                    <sm-select-input
                        label="Curve Preset"
                        .value=${o}
                        .options=${[{value:"smooth",label:"Smooth (No tension)"},{value:"arc",label:"Arc (Bulge)"},{value:"symmetric",label:"Symmetric"},{value:"manual",label:"Manual"}]}
                        @change=${t=>this.controller.setSegmentCurvePreset(this.block.id,e,t.detail.value)}
                    ></sm-select-input>
                    ${"arc"===o||"symmetric"===o?ot`
                        <sm-slider-input
                            label="Bulge"
                            .value=${r}
                            .min=${-1}
                            .max=${1}
                            .step=${.05}
                            @change=${t=>this.controller.setSegmentCurveBulge(this.block.id,e,t.detail.value)}
                        ></sm-slider-input>
                    `:dt}
                    <sm-toggle-input
                        label="Update on Move"
                        .value=${a}
                        @change=${t=>this.controller.setSegmentCurveAutoUpdate(this.block.id,e,t.detail.value)}
                    ></sm-toggle-input>
                    <div class="hint">Handles remain editable for full control.</div>
                `:ot`<div class="hint">Curve segments expose handles on the canvas.</div>`}
            </div>
        `}_updatePreferences(e){this.eventBus.dispatchEvent("link-editor-preferences-changed",{preferences:e})}_getPoints(){var e,t;const i=null==(t=null==(e=this.block)?void 0:e.props)?void 0:t.points;return Array.isArray(i)?i:[]}_getSegments(){var e,t;const i=null==(t=null==(e=this.block)?void 0:e.props)?void 0:t.segments;return Array.isArray(i)?i:[]}_getBlockDisplayLabel(e){var t;if(!e)return null;if(e.label&&e.label.trim())return e.label.trim();const i=null==(t=this.blockRegistry)?void 0:t.getBlock(e.type);return(null==i?void 0:i.label)??e.type}_getPropValue(e,t){var i,o;const r=null==(o=null==(i=this.block)?void 0:i.props)?void 0:o[e];return r&&"object"==typeof r&&"value"in r?r.value??t:t}};To.styles=et`
        :host {
            display: contents;
        }

        .section {
            padding: 12px 8px;
            border-bottom: 1px solid var(--border-color, #d4d4d4);
        }

        .section-title {
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--text-secondary, #666);
            letter-spacing: 0.3px;
            margin-bottom: 10px;
        }

        .row > .section-title {
            margin-bottom: 0;
            margin-top: 10px;
        }

        .mode-row {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .mode-badge {
            align-self: flex-start;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            background: var(--bg-tertiary, #e8e8e8);
            color: var(--text-secondary, #666);
        }

        .mode-badge.active {
            background: rgba(0, 120, 212, 0.12);
            color: var(--accent-color, #0078d4);
        }

        .mode-actions {
            display: flex;
            gap: 8px;
        }

        .action-button {
            padding: 6px 10px;
            border-radius: 4px;
            border: 1px solid var(--border-color, #d4d4d4);
            background: var(--bg-primary, #fff);
            color: var(--text-primary, #333);
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
        }

        .action-button.primary {
            background: var(--accent-color, #0078d4);
            border-color: var(--accent-color, #0078d4);
            color: #fff;
        }

        .action-button.active {
            background: rgba(255, 193, 7, 0.15);
            border-color: #ffc107;
            color: #946200;
        }

        .hint {
            font-size: 11px;
            color: var(--text-secondary, #666);
        }

        .list {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 10px;
        }

        .list-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 6px 8px;
            border-radius: 4px;
            border: 1px solid transparent;
            background: var(--bg-secondary, #f5f5f5);
            cursor: pointer;
            font-size: 11px;
        }

        .list-item.selected {
            border-color: var(--accent-color, #0078d4);
            background: rgba(0, 120, 212, 0.08);
            color: var(--accent-color, #0078d4);
        }

        .list-meta {
            font-size: 10px;
            color: var(--text-secondary, #666);
        }

        .inline-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
            margin-top: 8px;
        }

        .row {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-top: 8px;
        }

        .anchor-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 12px;
        }

        .anchor-chip {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 999px;
            background: rgba(255, 193, 7, 0.2);
            color: #8a6d00;
            font-weight: 600;
        }

        .empty {
            font-size: 11px;
            color: var(--text-secondary, #666);
            font-style: italic;
        }
    `,Mo([tt({type:Boolean,reflect:!0})],To.prototype,"open",2),Mo([tt({type:Object})],To.prototype,"block",2),Mo([tt({attribute:!1})],To.prototype,"controller",2),Mo([pt({context:s})],To.prototype,"documentModel",2),Mo([pt({context:r})],To.prototype,"blockRegistry",2),Mo([pt({context:d})],To.prototype,"eventBus",2),Mo([pt({context:c,subscribe:!0})],To.prototype,"linkEditorPreferences",2),Mo([st()],To.prototype,"linkModeState",2),Mo([st()],To.prototype,"selection",2),Mo([st()],To.prototype,"gridColor",2),To=Mo([rt("link-editor-overlay")],To);var Bo=Object.defineProperty,Ro=Object.getOwnPropertyDescriptor,Do=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Ro(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Bo(t,i,a),a};let Oo=class extends it{constructor(){super(...arguments),this.open=!1,this.thresholds=[],this.editingThresholds=[],this._onEscape=e=>{"Escape"===e.key&&this._cancel()},this._addThreshold=()=>{this.editingThresholds=[...this.editingThresholds,{id:h(),value:0,label:"",color:"#2196f3"}]},this._cancel=()=>{this.dispatchEvent(new CustomEvent("overlay-cancel",{bubbles:!0,composed:!0}))},this._apply=()=>{const e=u(this.editingThresholds);this.dispatchEvent(new CustomEvent("overlay-apply",{detail:{thresholds:e},bubbles:!0,composed:!0}))}}updated(e){(e.has("open")&&this.open||e.has("thresholds"))&&(this.editingThresholds=u(this.thresholds).map(e=>({...e}))),e.has("open")&&(this.open?window.addEventListener("keydown",this._onEscape):window.removeEventListener("keydown",this._onEscape))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onEscape)}render(){return this.open?ot`
            <div class="overlay-backdrop" @click=${this._cancel}></div>
            <div class="dialog">
                <div class="header">
                    <div class="title">Gauge Thresholds</div>
                    <button class="btn" @click=${this._cancel}>Close</button>
                </div>
                <div class="content">
                    ${0===this.editingThresholds.length?ot`
                        <div class="empty">No thresholds configured.</div>
                    `:this.editingThresholds.map((e,t)=>this.renderThresholdRow(e,t))}
                </div>
                <div class="footer">
                    <button class="btn" @click=${this._addThreshold}>Add Threshold</button>
                    <div class="spacer"></div>
                    <button class="btn" @click=${this._cancel}>Cancel</button>
                    <button class="btn primary" @click=${this._apply}>Apply</button>
                </div>
            </div>
        `:ot``}renderThresholdRow(e,t){return ot`
            <div class="row">
                <input
                    type="number"
                    step="0.1"
                    .value=${String(e.value)}
                    @input=${e=>this._updateNumeric(t,"value",e.target.value)}
                />
                <input
                        type="color"
                        .value=${e.color??"#2196f3"}
                        @input=${e=>this._updateText(t,"color",e.target.value)}
                />
                <input
                    type="text"
                    .value=${e.label??""}
                    placeholder="Optional label"
                    @input=${e=>this._updateText(t,"label",e.target.value)}
                />
                <button @click=${()=>this._removeThreshold(t)}>Remove</button>
            </div>
        `}_removeThreshold(e){this.editingThresholds=this.editingThresholds.filter((t,i)=>i!==e)}_updateText(e,t,i){this.editingThresholds=this.editingThresholds.map((o,r)=>r===e?{...o,[t]:i}:o)}_updateNumeric(e,t,i){const o=parseFloat(i);this.editingThresholds=this.editingThresholds.map((i,r)=>r===e?{...i,[t]:Number.isFinite(o)?o:i.value}:i)}};async function Ao(e,t){const i=(await e.callWS({type:"recorder/get_statistics_metadata",statistic_ids:[t]})).find(e=>e.statistic_id===t);if(!i)return{entityId:t,hasStatistics:!1,statisticTypes:[]};const o=function(e){const t=[];e.has_mean&&t.push("mean","min","max");e.has_sum&&t.push("sum","state","change");return t}(i);return{entityId:t,hasStatistics:o.length>0,statisticTypes:o,defaultStatisticType:zo(o),unit:i.statistics_unit_of_measurement||i.display_unit_of_measurement||void 0,source:i.source}}function zo(e){return e.includes("mean")?"mean":e.includes("change")?"change":e[0]}Oo.styles=et`
        :host {
            display: block;
            position: fixed;
            width: 100vw;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 1000;
            pointer-events: none;
        }

        :host([open]) {
            pointer-events: auto;
        }

        .overlay-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.55);
            opacity: 0;
            transition: opacity 0.25s ease;
        }

        :host([open]) .overlay-backdrop {
            opacity: 1;
        }

        .dialog {
            position: absolute;
            top: 50%;
            left: 50%;
            width: min(92vw, 860px);
            max-height: min(90vh, 760px);
            transform: translate(-50%, -50%);
            background: var(--bg-primary, #fff);
            border-radius: 10px;
            box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px;
            border-bottom: 1px solid var(--border-color, #e0e0e0);
            background: var(--bg-secondary, #f7f7f7);
        }

        .title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary, #333);
        }

        .content {
            padding: 12px 14px;
            overflow: auto;
            display: grid;
            gap: 8px;
        }

        .row {
            display: grid;
            grid-template-columns: 130px 1fr 120px 78px;
            gap: 8px;
            align-items: center;
            padding: 8px;
            border: 1px solid var(--border-color, #e0e0e0);
            border-radius: 6px;
            background: var(--bg-secondary, #fafafa);
        }

        .row input {
            width: 100%;
            box-sizing: border-box;
            min-width: 0;
            padding: 6px 8px;
            border: 1px solid var(--border-color, #d4d4d4);
            border-radius: 4px;
            font-size: 12px;
            background: var(--bg-primary, #fff);
            color: var(--text-primary, #333);
        }

        .row input[type='color'] {
            padding: 2px;
            height: 32px;
        }

        .row button {
            border: 1px solid var(--border-color, #d4d4d4);
            background: var(--bg-primary, #fff);
            border-radius: 4px;
            color: var(--text-primary, #333);
            font-size: 11px;
            padding: 6px 8px;
            cursor: pointer;
            font-weight: 600;
            text-transform: uppercase;
        }

        .row button:hover {
            border-color: var(--error-color, #d32f2f);
            color: var(--error-color, #d32f2f);
        }

        .empty {
            font-size: 12px;
            color: var(--text-secondary, #666);
            padding: 10px 4px;
        }

        .footer {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            border-top: 1px solid var(--border-color, #e0e0e0);
            background: var(--bg-secondary, #f7f7f7);
        }

        .footer .spacer {
            flex: 1;
        }

        .btn {
            border: 1px solid var(--border-color, #d4d4d4);
            background: var(--bg-primary, #fff);
            color: var(--text-primary, #333);
            border-radius: 4px;
            padding: 6px 10px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .btn.primary {
            border: none;
            background: var(--accent-color, #2196f3);
            color: #fff;
        }
    `,Do([tt({type:Boolean,reflect:!0})],Oo.prototype,"open",2),Do([tt({attribute:!1})],Oo.prototype,"thresholds",2),Do([st()],Oo.prototype,"editingThresholds",2),Oo=Do([rt("gauge-thresholds-editor-overlay")],Oo);var Lo=Object.defineProperty,No=Object.getOwnPropertyDescriptor,Fo=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?No(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Lo(t,i,a),a};let Vo=class extends it{constructor(){super(...arguments),this.label="",this.groupId="",this.collapsed=!1,this._isCollapsed=!1,this._hasRestoredState=!1}connectedCallback(){super.connectedCallback(),this._restoreState()}willUpdate(e){e.has("collapsed")&&!this._hasRestoredState&&(this._isCollapsed=this.collapsed)}render(){return ot`
      <div class="property-group">
        <div class="group-header" @click=${this._toggleCollapsed}>
          <span class="group-label">${this.label}</span>
          <span class="collapse-icon ${this._isCollapsed?"":"expanded"}">▶</span>
        </div>
        <div class="group-content ${this._isCollapsed?"collapsed":""}">
          <slot></slot>
        </div>
      </div>
    `}_restoreState(){if(!this.groupId)return;const e=Vo.STORAGE_PREFIX+this.groupId,t=localStorage.getItem(e);null!==t?(this._isCollapsed="true"===t,this._hasRestoredState=!0):this._isCollapsed=this.collapsed}_saveState(){if(!this.groupId)return;const e=Vo.STORAGE_PREFIX+this.groupId;localStorage.setItem(e,String(this._isCollapsed))}_toggleCollapsed(){this._isCollapsed=!this._isCollapsed,this._saveState(),this.dispatchEvent(new CustomEvent("group-toggle",{detail:{groupId:this.groupId,collapsed:this._isCollapsed},bubbles:!0,composed:!0}))}};Vo.styles=et`
    :host {
      display: block;
    }

    .group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: var(--bg-secondary);
      cursor: pointer;
      user-select: none;
      transition: background-color 0.15s ease;
      border-bottom: 1px solid var(--border-color);
    }

    .group-header:hover {
      background: var(--bg-tertiary);
    }

    .collapse-icon {
      font-size: 10px;
      color: var(--secondary-text-color, #666);
      transition: transform 0.2s ease;
      width: 12px;
      text-align: center;
    }

    .collapse-icon.expanded {
      transform: rotate(90deg);
    }

    .group-label {
      flex: 1;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--primary-text-color, #333);
    }

    .group-content {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .group-content.collapsed {
      display: none;
    }

    /* Slot content styling */
    ::slotted(.property-row) {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  `,Vo.STORAGE_PREFIX="card-builder-property-group-",Fo([tt({type:String})],Vo.prototype,"label",2),Fo([tt({type:String})],Vo.prototype,"groupId",2),Fo([tt({type:Boolean})],Vo.prototype,"collapsed",2),Fo([st()],Vo.prototype,"_isCollapsed",2),Vo=Fo([rt("property-group")],Vo);var Uo=Object.defineProperty,jo=(e,t,i,o)=>{for(var r,a=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(t,i,a)||a);return a&&Uo(t,i,a),a};const Wo={"min-max":"Preserve peaks (min/max)","every-nth":"Fast sample",average:"Smooth trend (average)",none:"All data (slow)"},Go={"by-points":"Target point count","by-window":"Time window"},Ho=class extends it{constructor(){super(...arguments),this.open=!1,this.editingConfig=this.getDefaultConfig(),this.previewMessage="",this.entitiesLimitMessage=null,this.unitOptionsByKey={},this.previewBlockStyles={},this.statisticAvailabilityByEntityId={},this.previewRefreshTimer=null,this.previewRefreshInProgress=!1,this.unitOptionRequests=new Set,this.statisticAvailabilityRequests=new Map,this.statisticAvailabilityFailedEntityIds=new Set,this._addEntity=()=>{const e=this._resolvedMaxSeries();void 0!==e&&this.getEditableEntities(this.editingConfig).length>=e?this.entitiesLimitMessage=`This block is limited to ${e} entities. To add more entities, use the Pro version of the integration.`:(this.entitiesLimitMessage=null,this.editingConfig=this.addEditableEntity(this.editingConfig))},this._addYAxis=()=>{var e;const t=this.getEditableEntities(this.editingConfig).length;if(this.editingConfig.components.yAxes.length>=t)return;const i=(null==(e=this.editingConfig.components.grids[0])?void 0:e.id)||"",o=[...this.editingConfig.components.yAxes,g(this.editingConfig.components.yAxes.length,{gridId:i})];this.editingConfig={...this.editingConfig,components:{...this.editingConfig.components,yAxes:o}}},this._onEscape=e=>{"Escape"===e.key&&this._cancel()},this._cancel=()=>{this.dispatchEvent(new CustomEvent("overlay-cancel",{bubbles:!0,composed:!0}))},this._apply=()=>{this.dispatchEvent(new CustomEvent("overlay-apply",{detail:{config:this.normalizeConfig(this.editingConfig,this._resolvedMaxSeries())},bubbles:!0,composed:!0}))}}showAxisSections(){return!0}showSeriesYAxisSelector(){return this.showAxisSections()}getEditableEntities(e){return e.series}updateEditableEntity(e,t,i){return{...e,series:e.series.map((e,o)=>o===t?i(e):e)}}addEditableEntity(e){var t,i,o;const r=null==(t=e.components.grids[0])?void 0:t.id,a=null==(i=e.components.xAxes[0])?void 0:i.id,s=null==(o=e.components.yAxes[0])?void 0:o.id;return{...e,series:[...e.series,v(e.series.length,{gridId:r,xAxisId:a,yAxisId:s})]}}removeEditableEntity(e,t){return{...e,series:e.series.filter((e,i)=>i!==t)}}_resolvedMaxSeries(){if(!this.block)return;const e=this.documentModel.getElement(this.block).getMaxSeriesCount();if(!Number.isFinite(e))return 1;const t=Math.floor(Number(e));return t>0?t:1}updated(e){if(e.has("open")&&this.open||e.has("config")||e.has("block")){const e=this._resolvedMaxSeries(),t=this.normalizeConfig(this.config,e);this.editingConfig=this.cloneConfig(t),this.entitiesLimitMessage=null,this.statisticAvailabilityByEntityId={},this.statisticAvailabilityRequests.clear(),this.statisticAvailabilityFailedEntityIds.clear()}e.has("open")&&(this.open?(window.addEventListener("keydown",this._onEscape),this._ensurePreviewChart()):(window.removeEventListener("keydown",this._onEscape),this._disposePreviewChart())),this.open&&(e.has("editingConfig")||e.has("block")||e.has("hass"))&&(this._ensureStatisticAvailabilityForConfig(),this._validateDataSourcesWithAvailability(),this._schedulePreviewRefresh())}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onEscape),this._disposePreviewChart()}render(){if(!this.open)return ot``;if(!this.block||!this.hass){const e=this.getEditorTitle();return ot`
                <div class="overlay-backdrop" @click=${this._cancel}></div>
                <div class="panel">
                    <div class="header">
                        <div class="title">${e}</div>
                        <div class="header-actions">
                            <button class="btn" @click=${this._cancel}>Close</button>
                        </div>
                    </div>
                    <div class="preview">
                        <div class="preview-placeholder">Chart editor is not ready</div>
                    </div>
                </div>
            `}const e=this.editingConfig,t=this.getEditorTitle(),i=this.getGroupPrefix(),o=this.getSpecificSectionLabel(),r=e.components.xAxes[0],a=this._getDownsamplingPreviewWarning(e);return ot`
            <div class="overlay-backdrop" @click=${this._cancel}></div>
            <div class="panel">
                <div class="header">
                    <div class="title">${t}</div>
                    <div class="header-actions">
                        <button class="btn" @click=${this._cancel}>Cancel</button>
                        <button class="btn primary" @click=${this._apply}>Apply</button>
                    </div>
                </div>
                <div class="content">
                    <div class="preview">
                        ${a?ot`<div class="preview-warning">${a}</div>`:dt}
                        <div class="preview-stage">
                            <div class="preview-block" style=${ut(this.previewBlockStyles)}>
                                <div class="preview-chart"></div>
                            </div>
                        </div>
                        ${this.previewMessage?ot`<div class="preview-placeholder">${this.previewMessage}</div>`:dt}
                    </div>
                    <div class="config">
                        <property-group label="Entities" groupId="${i}-entities">
                            ${this._renderEntitiesSection(e)}
                        </property-group>
                        <property-group label="General" groupId="${i}-general">
                            ${this._renderMainSection(e)}
                        </property-group>
                        <property-group label="${o}" groupId="${i}-specific">
                            ${this.renderSpecificSection(e)}
                        </property-group>
                        ${this.showAxisSections()?ot`
                            <property-group label="X Axis" groupId="${i}-axis-x">
                                ${r?this._renderAxisSection("x",r,0):dt}
                            </property-group>
                            <property-group label="Y Axes" groupId="${i}-axis-y">
                                ${this._renderYAxesSection(e)}
                            </property-group>
                        `:dt}
                    </div>
                </div>
            </div>
        `}_renderMainSection(e){return ot`
            <div class="group-body">
                <div class="row inline">
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            .checked=${e.title.show}
                            @change=${e=>this._updateNestedValue("title","show",e.target.checked)}
                        />
                        Show title
                    </label>
                </div>
                ${e.title.show?ot`
                    <div class="row">
                        <div class="field">
                            <span class="label">Title Text</span>
                            <input
                                type="text"
                                .value=${e.title.text}
                                @input=${e=>this._updateNestedValue("title","text",e.target.value)}
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="field">
                            <span class="label">Title Position</span>
                            <select
                                .value=${e.title.position}
                                @change=${e=>this._updateNestedValue("title","position",e.target.value)}
                            >
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                                <option value="center">Center</option>
                            </select>
                        </div>
                    </div>
                `:dt}
                <div class="row inline">
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            .checked=${e.legend.show}
                            @change=${e=>this._updateNestedValue("legend","show",e.target.checked)}
                        />
                        Show legend
                    </label>
                    ${e.legend.show?ot`
                        <div class="field">
                            <span class="label">Legend Position</span>
                            <select
                                .value=${e.legend.position}
                                @change=${e=>this._updateNestedValue("legend","position",e.target.value)}
                            >
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div class="field">
                            <span class="label">Legend Orientation</span>
                            <select
                                .value=${e.legend.orientation}
                                @change=${e=>this._updateNestedValue("legend","orientation",e.target.value)}
                            >
                                <option value="horizontal">Horizontal</option>
                                <option value="vertical">Vertical</option>
                            </select>
                        </div>
                    `:dt}
                </div>
                <div class="row inline">
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            .checked=${e.tooltip.show}
                            @change=${e=>this._updateNestedValue("tooltip","show",e.target.checked)}
                        />
                        Show tooltip
                    </label>
                    ${e.tooltip.show?ot`
                        <div class="field">
                            <span class="label">Tooltip Trigger</span>
                            <select
                                .value=${e.tooltip.trigger}
                                @change=${e=>this._updateNestedValue("tooltip","trigger",e.target.value)}
                            >
                                <option value="axis">Axis</option>
                                <option value="item">Item</option>
                            </select>
                        </div>
                        <div class="field">
                            <span class="label">Tooltip Decimals</span>
                            <select
                                .value=${String(e.tooltip.decimals)}
                                @change=${e=>this._updateNestedValue("tooltip","decimals",parseInt(e.target.value,10))}
                            >
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </select>
                        </div>
                    `:dt}
                </div>
            </div>
        `}_renderEntitiesSection(e){const t=this.getEditableEntities(e);return ot`
            <div class="group-body">
                <div class="group-inline-actions">
                    <span class="label">Series</span>
                    <button class="btn" @click=${this._addEntity}>Add</button>
                </div>
                ${this.entitiesLimitMessage?ot`
                    <div class="inline-alert">${this.entitiesLimitMessage}</div>
                `:dt}
                <div class="entity-list">
                    ${t.map((e,t)=>this._renderEntitySection(e,t))}
                </div>
            </div>
        `}_renderYAxesSection(e){const t=e.components.yAxes.length>1,i=this.getEditableEntities(e).length,o=e.components.yAxes.length<i,r=this.getGroupPrefix();return ot`
            <div class="group-body">
                <div class="group-inline-actions">
                    <span class="label">Axes</span>
                    <button class="btn" ?disabled=${!o} @click=${this._addYAxis}>Add</button>
                </div>
                <div class="entity-list">
                    ${e.components.yAxes.map((e,i)=>{var o;return ot`
                        <property-group
                            .label=${(null==(o=e.label)?void 0:o.trim())||`Y Axis ${i+1}`}
                            .groupId=${`${r}-y-axis-${e.id}`}
                        >
                            <div class="group-body">
                                <div class="group-inline-actions">
                                    <span class="label">Axis Options</span>
                                    <button class="btn" ?disabled=${!t} @click=${()=>this._removeYAxis(e.id)}>Remove</button>
                                </div>
                                ${this._renderAxisSection("y",e,i,!1)}
                            </div>
                        </property-group>
                    `})}
                </div>
            </div>
        `}_renderAxisSection(e,t,i,o=!0){const r="y"===e?t:void 0,a="x"===e?t:void 0,s=Boolean(a&&"time"===a.type),n=ot`
            <div class="row top-aligned">
                <label class="checkbox">
                    <input
                        type="checkbox"
                        .checked=${t.enabled}
                        @change=${i=>this._updateAxis(e,t.id,"enabled",i.target.checked)}
                    />
                    Enable axis
                </label>
            </div>
            ${t.enabled?ot`
                ${"y"===e&&r?ot`
                    <div class="row inline">
                        <div class="field">
                            <span class="label">Position</span>
                            <select
                                .value=${r.position}
                                @change=${i=>this._updateAxis(e,t.id,"position",i.target.value)}
                            >
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div class="field">
                            <span class="label">Offset Mode</span>
                            <select
                                .value=${r.offsetMode}
                                @change=${i=>this._updateAxis(e,t.id,"offsetMode",i.target.value)}
                            >
                                <option value="auto">Auto</option>
                                <option value="manual">Manual</option>
                            </select>
                        </div>
                    </div>
                    ${"manual"===r.offsetMode?ot`
                        <div class="row">
                            <div class="field">
                                <span class="label">Offset (px)</span>
                                <input
                                    type="number"
                                    step="1"
                                    .value=${String(r.offsetPx)}
                                    @input=${i=>this._updateAxisNumber(e,t.id,"offsetPx",i)}
                                />
                            </div>
                        </div>
                    `:dt}
                `:dt}
                <div class="row">
                    <div class="field">
                        <span class="label">Axis Label</span>
                        <input
                            type="text"
                            .value=${t.label}
                            @input=${i=>this._updateAxis(e,t.id,"label",i.target.value)}
                        />
                    </div>
                </div>
                <div class="row inline top-aligned">
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            .checked=${t.showLabels}
                            @change=${i=>this._updateAxis(e,t.id,"showLabels",i.target.checked)}
                        />
                        Show values
                    </label>
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            .checked=${t.showGridLines}
                            @change=${i=>this._updateAxis(e,t.id,"showGridLines",i.target.checked)}
                        />
                        Show grid lines
                    </label>
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            .checked=${t.showAxisLine}
                            @change=${i=>this._updateAxis(e,t.id,"showAxisLine",i.target.checked)}
                        />
                        Show axis line
                    </label>
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            .checked=${t.showTicks}
                            @change=${i=>this._updateAxis(e,t.id,"showTicks",i.target.checked)}
                        />
                        Show ticks
                    </label>
                </div>
                ${"y"===e&&r?this._renderUnitDisplaySection("Value Unit",r.unit,this._getYAxisUnitSource(r.id),(e,t)=>this._updateYAxisUnit(r.id,e,t)):dt}
                ${s&&a?this._renderXAxisTimeRangeSourceSection(a):this._renderAxisRangeMode(e,t)}
                <div class="row inline">
                    ${s&&a?this._renderXAxisTimeTickField(a):ot`
                            <div class="field">
                                <span class="label">Step</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    .value=${void 0!==t.step?String(t.step):""}
                                    @input=${i=>this._updateAxisOptionalNumber(e,t.id,"step",i)}
                                />
                            </div>
                        `}
                    ${"y"===e&&t.showLabels?ot`
                        <div class="field">
                            <span class="label">Decimals</span>
                            <select
                                .value=${String(t.decimals)}
                                @change=${i=>this._updateAxis(e,t.id,"decimals",parseInt(i.target.value,10))}
                            >
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </select>
                        </div>
                    `:dt}
                    ${"y"===e&&t.showGridLines&&void 0===t.step?ot`
                        <div class="field">
                            <span class="label">Target Grid Lines</span>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                .value=${void 0!==t.splitNumber?String(t.splitNumber):""}
                                @input=${i=>this._updateAxisOptionalNumber(e,t.id,"splitNumber",i)}
                            />
                        </div>
                    `:dt}
                    ${"number"==typeof t.step&&t.step>0&&!s&&("data"===t.range.mode||"data-offset"===t.range.mode)?ot`
                        <div class="field">
                            <span class="label">${"x"===e?"Step Alignment (ms)":"Step Alignment"}</span>
                            <input
                                type="number"
                                step="0.01"
                                .value=${void 0!==t.stepAlignment?String(t.stepAlignment):""}
                                @input=${i=>this._updateAxisOptionalNumber(e,t.id,"stepAlignment",i)}
                            />
                        </div>
                    `:dt}
                </div>
                ${!s&&t.showLabels&&"data"===t.range.mode?ot`
                    <div class="row">
                        <label class="checkbox">
                            <input
                                type="checkbox"
                                .checked=${t.hideMinMaxLabels}
                                @change=${i=>this._updateAxis(e,t.id,"hideMinMaxLabels",i.target.checked)}
                            />
                            Hide min/max labels
                        </label>
                    </div>
                `:dt}
                ${s||"data-offset"!==t.range.mode?dt:ot`
                    <div class="row inline">
                        <div class="field">
                            <span class="label">${"x"===e?"Min Offset (ms)":"Min Offset"}</span>
                            <input
                                type="number"
                                step="0.1"
                                .value=${String(t.range.minOffset)}
                                @input=${i=>this._updateAxisRangeNumber(e,t.id,"minOffset",i)}
                            />
                        </div>
                        <div class="field">
                            <span class="label">${"x"===e?"Max Offset (ms)":"Max Offset"}</span>
                            <input
                                type="number"
                                step="0.1"
                                .value=${String(t.range.maxOffset)}
                                @input=${i=>this._updateAxisRangeNumber(e,t.id,"maxOffset",i)}
                            />
                        </div>
                    </div>
                `}
                ${s||"fixed"!==t.range.mode?dt:ot`
                    <div class="row inline">
                        <div class="field">
                            <span class="label">${"x"===e?"Fixed Min (ms)":"Fixed Min"}</span>
                            <input
                                type="number"
                                step="0.1"
                                .value=${t.range.min??""}
                                @input=${i=>this._updateAxisRangeOptionalNumber(e,t.id,"min",i)}
                            />
                        </div>
                        <div class="field">
                            <span class="label">${"x"===e?"Fixed Max (ms)":"Fixed Max"}</span>
                            <input
                                type="number"
                                step="0.1"
                                .value=${t.range.max??""}
                                @input=${i=>this._updateAxisRangeOptionalNumber(e,t.id,"max",i)}
                            />
                        </div>
                    </div>
                `}
            `:dt}
        `;return o?ot`<div class="group-body">${n}</div>`:n}_renderXAxisTimeTickField(e){const t="preset"===e.timeTick.mode?e.timeTick.preset:e.timeTick.mode;return ot`
            <div class="field">
                <span class="label">Tick Interval</span>
                <select
                    .value=${t}
                    @change=${t=>this._updateXAxisTimeTick(e.id,t.target.value)}
                >
                    <option value="auto">Auto</option>
                    <optgroup label="Seconds">
                        ${b.filter(e=>e.endsWith("second")||e.endsWith("seconds")).map(e=>ot`
                            <option value=${e}>${this._formatTimeTickPreset(e)}</option>
                        `)}
                    </optgroup>
                    <optgroup label="Minutes">
                        ${b.filter(e=>e.endsWith("minute")||e.endsWith("minutes")).map(e=>ot`
                            <option value=${e}>${this._formatTimeTickPreset(e)}</option>
                        `)}
                    </optgroup>
                    <optgroup label="Hours">
                        ${b.filter(e=>e.endsWith("hour")||e.endsWith("hours")).map(e=>ot`
                            <option value=${e}>${this._formatTimeTickPreset(e)}</option>
                        `)}
                    </optgroup>
                    <optgroup label="Days">
                        ${b.filter(e=>e.endsWith("day")||e.endsWith("days")).map(e=>ot`
                            <option value=${e}>${this._formatTimeTickPreset(e)}</option>
                        `)}
                    </optgroup>
                </select>
            </div>
        `}_renderAxisRangeMode(e,t){return ot`
            <div class="row inline">
                <div class="field">
                    <span class="label">Range Mode</span>
                    <select
                        .value=${t.range.mode}
                        @change=${i=>this._updateAxisRange(e,t.id,"mode",i.target.value)}
                    >
                        <option value="auto">Auto</option>
                        <option value="data">Use Data Min/Max</option>
                        <option value="data-offset">Data + Offset</option>
                        <option value="fixed">Fixed Min/Max</option>
                    </select>
                </div>
            </div>
        `}renderValueUnitSection(e){return this._renderUnitDisplaySection("Value Unit",e,this._getPieValueUnitSource(),(e,t)=>this._updateValueUnit(e,t))}_renderUnitDisplaySection(e,t,i,o){const r=this._getConvertibleUnitOptions(i),a=t.targetUnit||i.sourceUnit||r[0]||"",s=a&&!r.includes(a)?[a,...r]:r,n=i.domain&&i.deviceClass?`${i.domain}|${i.deviceClass}`:"",l=Boolean(n&&void 0===this.unitOptionsByKey[n]);return ot`
            <div class="row inline top-aligned">
                <label class="checkbox">
                    <input
                        type="checkbox"
                        .checked=${t.showUnit}
                        @change=${e=>o("showUnit",e.target.checked)}
                    />
                    Show unit
                </label>
                <div class="field">
                    <span class="label">${e}</span>
                    <select
                        .value=${t.mode}
                        @change=${e=>o("mode",e.target.value)}
                    >
                        ${m.map(e=>ot`
                            <option value=${e}>${this._formatUnitDisplayMode(e)}</option>
                        `)}
                    </select>
                </div>
                ${"target"===t.mode?ot`
                    <div class="field">
                        <span class="label">Target Unit</span>
                        <select
                            .value=${a}
                            ?disabled=${0===s.length}
                            @change=${e=>o("targetUnit",e.target.value)}
                        >
                            ${s.length>0?s.map(e=>ot`
                                    <option value=${e} ?selected=${e===a}>${e}</option>
                                `):ot`<option value="">${l?"Loading units...":"No compatible units"}</option>`}
                        </select>
                    </div>
                `:dt}
            </div>
            ${"custom"===t.mode?ot`
                <div class="row inline">
                    <div class="field">
                        <span class="label">Custom Unit</span>
                        <input
                            type="text"
                            .value=${t.customUnit}
                            @input=${e=>o("customUnit",e.target.value)}
                        />
                    </div>
                    <div class="field">
                        <span class="label">Multiplier</span>
                        <input
                            type="number"
                            step="0.000001"
                            .value=${String(t.customMultiplier)}
                            @input=${e=>{const t=parseFloat(e.target.value);Number.isFinite(t)&&o("customMultiplier",t)}}
                        />
                    </div>
                </div>
            `:dt}
        `}_formatUnitDisplayMode(e){switch(e){case"source":return"Source unit";case"target":return"Convert to";case"custom":return"Custom"}}_getConvertibleUnitOptions(e){if(!e.deviceClass||!e.domain)return e.sourceUnit?[e.sourceUnit]:[];const t=`${e.domain}|${e.deviceClass}`,i=this.unitOptionsByKey[t];return i||(this._requestConvertibleUnits(e.domain,e.deviceClass,t),e.sourceUnit?[e.sourceUnit]:[])}_requestConvertibleUnits(e,t,i){this.hass&&!this.unitOptionRequests.has(i)&&(this.unitOptionRequests.add(i),f(this.hass).getConvertibleUnits(e,t).then(e=>{this.unitOptionsByKey={...this.unitOptionsByKey,[i]:e}}).finally(()=>{this.unitOptionRequests.delete(i)}))}_getYAxisUnitSource(e){const t=this._getSeriesForYAxis(e)[0];return t?this._getSeriesUnitSource(t):{domain:"sensor"}}_getPieValueUnitSource(){const e=this.getEditableEntities(this.editingConfig)[0];return e?this._getSeriesUnitSource(e):{domain:"sensor"}}_getSeriesUnitSource(e){var t,i,o,r;const a=this._resolveEntityInfo(e.binding.entityConfig).entityId||e.binding.entityConfig.entityId||"",s=a?null==(i=null==(t=this.hass)?void 0:t.states)?void 0:i[a]:void 0,n="string"==typeof(null==(o=null==s?void 0:s.attributes)?void 0:o.unit_of_measurement)?s.attributes.unit_of_measurement:void 0,l="string"==typeof(null==(r=null==s?void 0:s.attributes)?void 0:r.device_class)?s.attributes.device_class:void 0;return{domain:a.split(".")[0]||"sensor",deviceClass:l,sourceUnit:n}}_renderXAxisTimeRangeSourceSection(e){const t=this._getSeriesForXAxis(e.id);return ot`
            <div class="row inline">
                <div class="field">
                    <span class="label">Time Range Source</span>
                    <select
                        .value=${e.timeRangeSource}
                        @change=${t=>this._updateAxis("x",e.id,"timeRangeSource",t.target.value)}
                    >
                        <option value="series-union">All series</option>
                        <option value="first-series">First series</option>
                        <option value="selected-series">Specific series</option>
                        <option value="fixed">Fixed</option>
                    </select>
                </div>
                ${"selected-series"===e.timeRangeSource?ot`
                    <div class="field">
                        <span class="label">Series</span>
                        <select
                            .value=${e.timeRangeSeriesId||""}
                            @change=${t=>this._updateAxis("x",e.id,"timeRangeSeriesId",t.target.value)}
                        >
                            <option value="">First available</option>
                            ${t.map((e,t)=>ot`
                                <option value=${e.id}>${this._getSeriesSelectLabel(e,t)}</option>
                            `)}
                        </select>
                    </div>
                `:dt}
            </div>
            ${"fixed"===e.timeRangeSource?ot`
                <div class="row inline">
                    <div class="field">
                        <span class="label">Start</span>
                        <input
                            type="datetime-local"
                            .value=${e.fixedStart||""}
                            @input=${t=>this._updateAxis("x",e.id,"fixedStart",t.target.value)}
                        />
                    </div>
                    <div class="field">
                        <span class="label">End</span>
                        <input
                            type="datetime-local"
                            .value=${e.fixedEnd||""}
                            @input=${t=>this._updateAxis("x",e.id,"fixedEnd",t.target.value)}
                        />
                    </div>
                </div>
            `:dt}
        `}_getSeriesForXAxis(e){var t;const i=null==(t=this.editingConfig.components.xAxes[0])?void 0:t.id;return this.editingConfig.capabilities.usesCartesianComponents?this.editingConfig.series.filter(t=>(t.xAxisId||i)===e):[]}_getSeriesForYAxis(e){var t;const i=null==(t=this.editingConfig.components.yAxes[0])?void 0:t.id;return this.editingConfig.capabilities.usesCartesianComponents?this.editingConfig.series.filter(t=>(t.yAxisId||i)===e):[]}_getSeriesSelectLabel(e,t){var i;const o=null==(i=e.name)?void 0:i.trim();if(o)return o;return e.binding.entityConfig.entityId||`Series ${t+1}`}_renderEntitySection(e,t){var i;const o=this._resolveEntityInfo(e.binding.entityConfig),r=this._getEntityGroupLabel(e,t,o),a=this.editingConfig.components.yAxes,s=e.yAxisId&&a.some(t=>t.id===e.yAxisId)?e.yAxisId:(null==(i=a[0])?void 0:i.id)||"",n=`${s}|${a.map(e=>e.id).join("|")}`,l=this.getGroupPrefix();return ot`
            <property-group
                .label=${r}
                .groupId=${`${l}-series-${e.id}`}
            >
                <div class="group-body">
                    <div class="group-inline-actions">
                    <span class="label">Entity Options</span>
                    <button class="btn" @click=${()=>this._removeEntity(t)}>Remove</button>
                </div>
                <div class="row inline">
                    <div class="field">
                        <span class="label">Label</span>
                        <input
                            type="text"
                            .value=${e.name||""}
                            @input=${e=>this._updateSeries(t,"name",e.target.value)}
                        />
                    </div>
                    <div class="field">
                        <span class="label">Color</span>
                        <input
                            type="color"
                            .value=${e.color||"#3b82f6"}
                            @input=${e=>this._updateSeries(t,"color",e.target.value)}
                        />
                    </div>
                </div>
                ${this.block?ot`
                    <entity-config-editor
                        .block=${this.block}
                        .config=${e.binding.entityConfig}
                        .resolvedInfo=${o}
                        .hass=${this.hass}
                        @config-changed=${e=>this._updateSeriesBinding(t,"entityConfig",e.detail)}
                    ></entity-config-editor>
                `:dt}
                ${this.showSeriesYAxisSelector()?ot`
                    <div class="row">
                        <div class="field">
                            <span class="label">Y Axis</span>
                            ${bt(n,ot`
                                <select
                                    .value=${s}
                                    @change=${e=>this._updateSeries(t,"yAxisId",e.target.value)}
                                >
                                    ${a.map((e,t)=>{var i;return ot`
                                        <option value=${e.id}>
                                            ${(null==(i=e.label)?void 0:i.trim())||`Y Axis ${t+1}`}
                                        </option>
                                    `})}
                                </select>
                            `)}
                        </div>
                    </div>
                `:dt}
                <div class="row inline">
                    <div class="field">
                        <span class="label">Data Type</span>
                        <select
                            .value=${e.binding.dataSource.mode}
                            @change=${e=>this._updateSeriesDataSource(t,"mode",e.target.value)}
                        >
                            ${this.getAvailableDataModes(e).map(e=>ot`<option value=${e}>${e}</option>`)}
                        </select>
                    </div>
                    ${"statistics"!==e.binding.dataSource.mode?ot`
                        <div class="field">
                            <span class="label">Value Source</span>
                            <select
                                .value=${e.binding.dataSource.valueSource}
                                @change=${e=>this._updateSeriesDataSource(t,"valueSource",e.target.value)}
                            >
                                <option value="state">State</option>
                                <option value="attribute">Attribute</option>
                            </select>
                        </div>
                    `:dt}
                </div>
                ${"statistics"!==e.binding.dataSource.mode&&"attribute"===e.binding.dataSource.valueSource?ot`
                    <div class="row">
                        <div class="field">
                            <span class="label">Attribute</span>
                            <input
                                type="text"
                                .value=${e.binding.dataSource.attribute||""}
                                @input=${e=>this._updateSeriesDataSource(t,"attribute",e.target.value)}
                            />
                        </div>
                    </div>
                `:dt}
                ${"statistics"===e.binding.dataSource.mode?ot`
                    <div class="row inline">
                        <div class="field">
                            <span class="label">Period</span>
                            <select
                                .value=${e.binding.dataSource.statisticsPeriod}
                                @change=${e=>this._updateSeriesDataSource(t,"statisticsPeriod",e.target.value)}
                            >
                                ${y.map(e=>ot`<option value=${e}>${e}</option>`)}
                            </select>
                        </div>
                        <div class="field">
                            <span class="label">Statistic</span>
                            <select
                                .value=${e.binding.dataSource.statisticType}
                                @change=${e=>this._updateSeriesDataSource(t,"statisticType",e.target.value)}
                            >
                                ${this.getAvailableStatisticTypes(e).map(e=>ot`<option value=${e}>${e}</option>`)}
                            </select>
                        </div>
                    </div>
                `:dt}
                ${"history"===e.binding.dataSource.mode?ot`
                    <div class="row inline">
                        ${this.shouldShowHistoryAggregation()?ot`
                            <div class="field">
                                <span class="label">Aggregation</span>
                                <select
                                    .value=${e.binding.dataSource.historyAggregation}
                                    @change=${e=>this._updateSeriesDataSource(t,"historyAggregation",e.target.value)}
                                >
                                    ${this.getAvailableHistoryAggregations().map(e=>ot`
                                        <option value=${e}>${this._formatHistoryAggregation(e)}</option>
                                    `)}
                                </select>
                            </div>
                        `:dt}
                        <div class="field">
                            <span class="label">Strategy</span>
                            <select
                                .value=${e.binding.dataSource.downsampling.strategy}
                                @change=${e=>this._updateSeriesDownsamplingStrategy(t,e.target.value)}
                            >
                                ${x.map(e=>ot`
                                    <option value=${e}>${Wo[e]}</option>
                                `)}
                            </select>
                        </div>
                    </div>
                    ${"none"!==e.binding.dataSource.downsampling.strategy?this._renderDownsamplingSizing(t,e.binding.dataSource):dt}
                `:dt}
                ${this.shouldShowSeriesTimeRange(e.binding.dataSource)?this._renderSeriesTimeRange(t,e.binding.dataSource):dt}
                </div>
            </property-group>
        `}_renderDownsamplingSizing(e,t){const i=t.downsampling.sizing;return ot`
            <div class="row inline">
                <div class="field">
                    <span class="label">Sizing</span>
                    <select
                        .value=${i.mode}
                        @change=${t=>this._updateSeriesDownsamplingSizingMode(e,t.target.value)}
                    >
                        ${_.map(e=>ot`
                            <option value=${e}>${Go[e]}</option>
                        `)}
                    </select>
                </div>
                ${"by-points"===i.mode?ot`
                    <div class="field">
                        <span class="label">Target Points</span>
                        <input
                            type="number"
                            min="20"
                            max="5000"
                            .value=${String(i.maxPoints)}
                            @input=${t=>this._updateSeriesDownsamplingPoints(e,parseFloat(t.target.value))}
                        />
                    </div>
                `:ot`
                    <div class="field">
                        <span class="label">Window</span>
                        <input
                            type="number"
                            min="1"
                            .value=${String(i.window.value)}
                            @input=${t=>this._updateSeriesDownsamplingWindowValue(e,parseFloat(t.target.value))}
                        />
                    </div>
                    <div class="field">
                        <span class="label">Unit</span>
                        <select
                            .value=${i.window.unit}
                            @change=${t=>this._updateSeriesDownsamplingWindowUnit(e,t.target.value)}
                        >
                            <option value="minutes">minutes</option>
                            <option value="hours">hours</option>
                            <option value="days">days</option>
                        </select>
                    </div>
                `}
            </div>
        `}_getDownsamplingPreviewWarning(e){const t=new Date;for(const i of this.getEditableEntities(e)){const e=i.binding.dataSource;if("history"!==e.mode)continue;if("none"===e.downsampling.strategy)return"All raw history points will be rendered. This can be heavy for sensors with many state changes.";const o=e.downsampling.sizing;if("by-window"!==o.mode)continue;const r=k(e.timeRange,t),a=this._downsamplingWindowMs(o.window.value,o.window.unit),s=Math.max(1,Math.ceil((r.queryTo.getTime()-r.queryFrom.getTime())/a)),n="min-max"===e.downsampling.strategy?2*s:s;if(n>1e3)return"min-max"===e.downsampling.strategy?`This history setting may render up to ${n.toLocaleString()} points because preserve-peaks emits min and max for each window.`:`This history setting may render about ${n.toLocaleString()} points. Increase the window size for better performance.`}}_downsamplingWindowMs(e,t){const i=Math.max(1,e);return"minutes"===t?60*i*1e3:"hours"===t?60*i*60*1e3:24*i*60*60*1e3}getBaseDataModes(){return["statistics","history"]}getAvailableDataModes(e){return this._getAvailableDataModesForSeries(e)}getBaseStatisticTypes(){return[...w]}getAvailableStatisticTypes(e){return this._getAvailableStatisticTypesForSeries(e)}getAvailableHistoryAggregations(){return[...S]}shouldShowHistoryAggregation(){return!1}shouldShowSeriesTimeRange(e){return"live"!==e.mode}getAvailableTimeRangeModes(e){return"live"===e.mode?[]:"history"===e.mode?[...$]:"day"===e.statisticsPeriod||"week"===e.statisticsPeriod?["rolling","last-days","custom"]:"month"===e.statisticsPeriod?["rolling","custom"]:[...$]}_formatHistoryAggregation(e){switch(e){case"last":return"Last value";case"max":return"Maximum";case"delta":return"Delta"}}_renderSeriesTimeRange(e,t){const i=t.timeRange,o=this.getAvailableTimeRangeModes(t);return ot`
            <div class="row inline">
                <div class="field">
                    <span class="label">Time Range</span>
                    <select
                        .value=${i.mode}
                        @change=${t=>this._updateSeriesTimeRange(e,"mode",t.target.value)}
                    >
                        ${o.map(e=>ot`
                            <option value=${e}>${this._formatTimeRangeMode(e)}</option>
                        `)}
                    </select>
                </div>
                ${"rolling"===i.mode?ot`
                    <div class="field compact">
                        <span class="label">Amount</span>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            .value=${String(i.amount)}
                            @input=${t=>this._updateSeriesTimeRangeNumber(e,"amount",t)}
                        />
                    </div>
                    <div class="field compact">
                        <span class="label">Unit</span>
                        ${this._renderTimeUnitSelect(i.unit,t=>this._updateSeriesTimeRange(e,"unit",t))}
                    </div>
                `:dt}
                ${"last-days"===i.mode?ot`
                    <div class="field compact">
                        <span class="label">Days</span>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            .value=${String(i.amount)}
                            @input=${t=>this._updateSeriesTimeRangeNumber(e,"amount",t)}
                        />
                    </div>
                `:dt}
                ${"calendar-day"===i.mode?ot`
                    <div class="field">
                        <span class="label">Date</span>
                        <input
                            type="date"
                            .value=${i.date}
                            @input=${t=>this._updateSeriesTimeRange(e,"date",t.target.value)}
                        />
                    </div>
                `:dt}
                ${this._supportsFullRangeAxis(i.mode)?ot`
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            .checked=${i.showFullRange}
                            @change=${t=>this._updateSeriesTimeRange(e,"showFullRange",t.target.checked)}
                        />
                        Show full period axis
                    </label>
                `:dt}
            </div>
            ${"custom"===i.mode?ot`
                <div class="row inline">
                    <div class="field">
                        <span class="label">Start</span>
                        <input
                            type="datetime-local"
                            .value=${i.start}
                            @input=${t=>this._updateSeriesTimeRange(e,"start",t.target.value)}
                        />
                    </div>
                    <div class="field">
                        <span class="label">End</span>
                        <input
                            type="datetime-local"
                            .value=${i.end}
                            @input=${t=>this._updateSeriesTimeRange(e,"end",t.target.value)}
                        />
                    </div>
                </div>
            `:dt}
            <div class="row inline">
                <div class="field compact">
                    <span class="label">Previous Offset</span>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        .value=${String(i.offsetAmount)}
                        @input=${t=>this._updateSeriesTimeRangeNumber(e,"offsetAmount",t)}
                    />
                </div>
                <div class="field compact">
                    <span class="label">Offset Unit</span>
                    ${this._renderTimeUnitSelect(i.offsetUnit,t=>this._updateSeriesTimeRange(e,"offsetUnit",t))}
                </div>
                ${0!==i.offsetAmount?ot`
                    <div class="field">
                        <span class="label">Display</span>
                        <select
                            .value=${i.displayMode}
                            @change=${t=>this._updateSeriesTimeRange(e,"displayMode",t.target.value)}
                        >
                            <option value="aligned">Align for comparison</option>
                            <option value="absolute">Use original time</option>
                        </select>
                    </div>
                `:dt}
            </div>
        `}_renderTimeUnitSelect(e,t){return ot`
            <select
                .value=${e}
                @change=${e=>t(e.target.value)}
            >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
            </select>
        `}_supportsFullRangeAxis(e){return"today"===e||"last-days"===e}_formatTimeRangeMode(e){switch(e){case"rolling":return"Last period";case"today":return"Today";case"yesterday":return"Yesterday";case"last-days":return"Last days";case"calendar-day":return"Specific day";case"custom":return"Custom";default:return e}}_formatTimeTickPreset(e){return e.split("-").map((e,t)=>0===t?e:e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}_getAvailableDataModesForSeries(e,t){const i=this.getBaseDataModes(),o=t||(e?this._getStatisticAvailabilityForSeries(e):void 0);return o?o.hasStatistics?i:i.filter(e=>"statistics"!==e):i}_getAvailableStatisticTypesForSeries(e,t){const i=this.getBaseStatisticTypes(),o=t||(e?this._getStatisticAvailabilityForSeries(e):void 0);return o?i.filter(e=>o.statisticTypes.includes(e)):i}_getStatisticAvailabilityForSeries(e){const t=this._getResolvedEntityId(e);return t?this.statisticAvailabilityByEntityId[t]:void 0}_getResolvedEntityId(e){return this._resolveEntityInfo(e.binding.entityConfig).entityId||e.binding.entityConfig.entityId}_ensureStatisticAvailabilityForConfig(){if(this.hass)for(const e of this.getEditableEntities(this.editingConfig)){const t=this._getResolvedEntityId(e);if(!t||this.statisticAvailabilityByEntityId[t]||this.statisticAvailabilityRequests.has(t)||this.statisticAvailabilityFailedEntityIds.has(t))continue;const i=Ao(this.hass,t).then(e=>{this.statisticAvailabilityByEntityId={...this.statisticAvailabilityByEntityId,[t]:e},this._validateDataSourcesWithAvailability()}).catch(e=>{this.statisticAvailabilityFailedEntityIds.add(t),console.warn("[Chart] Unable to load statistic metadata",t,e)}).finally(()=>{this.statisticAvailabilityRequests.delete(t)});this.statisticAvailabilityRequests.set(t,i)}}_validateDataSourcesWithAvailability(){let e=this.editingConfig,t=!1;this.getEditableEntities(e).forEach((i,o)=>{const r=this._getStatisticAvailabilityForSeries(i),a=i.binding.dataSource,s=this._getAvailableDataModesForSeries(i,r),n=this._getAvailableStatisticTypesForSeries(i,r),l=this._getFallbackDataMode(s),d=this._getFallbackStatisticType(n),c=s.includes(a.mode)?a.mode:l,p=d&&!n.includes(a.statisticType)?d:a.statisticType,h={...a,mode:c,statisticType:p},u=this._getValidatedTimeRange(h);c===a.mode&&p===a.statisticType&&u===a.timeRange||(t=!0,e=this.updateEditableEntity(e,o,e=>({...e,binding:{...e.binding,dataSource:{...e.binding.dataSource,mode:c,statisticType:p,timeRange:u}}})))}),t&&(this.editingConfig=e)}_getFallbackDataMode(e){return e.includes("history")?"history":e[0]||"history"}_getFallbackStatisticType(e){return zo(e)}_getValidatedTimeRange(e){const t=this.getAvailableTimeRangeModes(e);return 0===t.length||t.includes(e.timeRange.mode)?e.timeRange:{...e.timeRange,mode:this._getFallbackTimeRangeMode(e,t)}}_getFallbackTimeRangeMode(e,t){return"statistics"!==e.mode||"day"!==e.statisticsPeriod&&"week"!==e.statisticsPeriod||!t.includes("last-days")?t.includes("rolling")?"rolling":t[0]||"rolling":"last-days"}_resolveEntityInfo(e){return this.block?"fixed"===e.mode?{entityId:e.entityId,source:"fixed"}:"slot"===e.mode?{entityId:e.slotId?this.documentModel.resolveSlotEntity(e.slotId):void 0,source:"slot",slotId:e.slotId}:this.documentModel.resolveEntityForBlock(this.block.id):{entityId:void 0,source:"none"}}_getEntityGroupLabel(e,t,i){var o,r,a,s,n;const l=null==(o=e.name)?void 0:o.trim();if(l)return l;const d=i.entityId||e.binding.entityConfig.entityId;if(!d)return`Entity ${t+1}`;const c=null==(n=null==(s=null==(a=null==(r=this.hass)?void 0:r.states)?void 0:a[d])?void 0:s.attributes)?void 0:n.friendly_name;return"string"==typeof c&&c.trim()?c:d}_updateNestedValue(e,t,i){this.editingConfig={...this.editingConfig,[e]:{...this.editingConfig[e],[t]:i}}}_updateAxis(e,t,i,o){if("x"===e){const e=this.editingConfig.components.xAxes.map(e=>e.id===t?{...e,[i]:o}:e);return void(this.editingConfig={...this.editingConfig,components:{...this.editingConfig.components,xAxes:e}})}const r=this.editingConfig.components.yAxes.map(e=>e.id===t?{...e,[i]:o}:e);this.editingConfig={...this.editingConfig,components:{...this.editingConfig.components,yAxes:r}}}_updateAxisNumber(e,t,i,o){const r=parseFloat(o.target.value);Number.isFinite(r)&&this._updateAxis(e,t,i,r)}_updateAxisOptionalNumber(e,t,i,o){const r=o.target.value.trim();if(!r)return void this._updateAxis(e,t,i,void 0);const a=parseFloat(r);Number.isFinite(a)&&this._updateAxis(e,t,i,a)}_updateXAxisTimeTick(e,t){const i=b.includes(t)?t:void 0,o=this.editingConfig.components.xAxes.map(t=>t.id===e?{...t,timeTick:{...t.timeTick,mode:i?"preset":"auto",preset:i||t.timeTick.preset}}:t);this.editingConfig={...this.editingConfig,components:{...this.editingConfig.components,xAxes:o}}}_updateAxisRange(e,t,i,o){if("x"===e){const e=this.editingConfig.components.xAxes.map(e=>e.id===t?{...e,range:{...e.range,[i]:o}}:e);return void(this.editingConfig={...this.editingConfig,components:{...this.editingConfig.components,xAxes:e}})}const r=this.editingConfig.components.yAxes.map(e=>e.id===t?{...e,range:{...e.range,[i]:o}}:e);this.editingConfig={...this.editingConfig,components:{...this.editingConfig.components,yAxes:r}}}_updateAxisRangeNumber(e,t,i,o){const r=parseFloat(o.target.value);Number.isFinite(r)&&this._updateAxisRange(e,t,i,r)}_updateAxisRangeOptionalNumber(e,t,i,o){const r=o.target.value.trim();if(!r)return void this._updateAxisRange(e,t,i,void 0);const a=parseFloat(r);Number.isFinite(a)&&this._updateAxisRange(e,t,i,a)}_updateYAxisUnit(e,t,i){const o=this.editingConfig.components.yAxes.map(o=>o.id===e?{...o,unit:{...o.unit,[t]:i}}:o);this.editingConfig={...this.editingConfig,components:{...this.editingConfig.components,yAxes:o}}}_updateValueUnit(e,t){const i=this.editingConfig;this.editingConfig={...i,valueUnit:{...i.valueUnit,[e]:t}}}_updateSpecific(e,t){const i={...this.editingConfig.specific,[e]:t};this.editingConfig={...this.editingConfig,specific:i}}_updateSpecificNumber(e,t){const i=parseFloat(t.target.value);Number.isFinite(i)&&this._updateSpecific(e,i)}_updateSeries(e,t,i){this.editingConfig=this.updateEditableEntity(this.editingConfig,e,e=>({...e,[t]:i}))}_updateSeriesBinding(e,t,i){this.editingConfig=this.updateEditableEntity(this.editingConfig,e,e=>({...e,binding:{...e.binding,[t]:i}}))}_updateSeriesDataSource(e,t,i){this.editingConfig=this.updateEditableEntity(this.editingConfig,e,e=>({...e,binding:{...e.binding,dataSource:{...e.binding.dataSource,[t]:i}}}))}_updateSeriesDownsamplingStrategy(e,t){this.editingConfig=this.updateEditableEntity(this.editingConfig,e,e=>({...e,binding:{...e.binding,dataSource:{...e.binding.dataSource,downsampling:{...e.binding.dataSource.downsampling,strategy:t}}}}))}_updateSeriesDownsamplingSizingMode(e,t){this.editingConfig=this.updateEditableEntity(this.editingConfig,e,e=>{const i=e.binding.dataSource.downsampling.sizing;return{...e,binding:{...e.binding,dataSource:{...e.binding.dataSource,downsampling:{...e.binding.dataSource.downsampling,sizing:"by-window"===t?{mode:t,window:"by-window"===i.mode?i.window:{value:1,unit:"hours"}}:{mode:t,maxPoints:"by-points"===i.mode?i.maxPoints:240}}}}}})}_updateSeriesDownsamplingPoints(e,t){Number.isFinite(t)&&(this.editingConfig=this.updateEditableEntity(this.editingConfig,e,e=>({...e,binding:{...e.binding,dataSource:{...e.binding.dataSource,downsampling:{...e.binding.dataSource.downsampling,sizing:{mode:"by-points",maxPoints:Math.max(1,Math.round(t))}}}}})))}_updateSeriesDownsamplingWindowValue(e,t){Number.isFinite(t)&&(this.editingConfig=this.updateEditableEntity(this.editingConfig,e,e=>{const i=e.binding.dataSource.downsampling.sizing,o="by-window"===i.mode?i.window:{value:1,unit:"hours"};return{...e,binding:{...e.binding,dataSource:{...e.binding.dataSource,downsampling:{...e.binding.dataSource.downsampling,sizing:{mode:"by-window",window:{...o,value:Math.max(1,Math.round(t))}}}}}}}))}_updateSeriesDownsamplingWindowUnit(e,t){this.editingConfig=this.updateEditableEntity(this.editingConfig,e,e=>{const i=e.binding.dataSource.downsampling.sizing,o="by-window"===i.mode?i.window:{value:1,unit:"hours"};return{...e,binding:{...e.binding,dataSource:{...e.binding.dataSource,downsampling:{...e.binding.dataSource.downsampling,sizing:{mode:"by-window",window:{...o,unit:t}}}}}}})}_updateSeriesTimeRange(e,t,i){this.editingConfig=this.updateEditableEntity(this.editingConfig,e,e=>({...e,binding:{...e.binding,dataSource:{...e.binding.dataSource,timeRange:{...e.binding.dataSource.timeRange,[t]:i}}}}))}_updateSeriesTimeRangeNumber(e,t,i){const o=parseFloat(i.target.value),r="offsetAmount"===t?Math.max(0,o):o;if(Number.isFinite(r)){if("offsetAmount"===t){const t=0===r?"absolute":"aligned";return void(this.editingConfig=this.updateEditableEntity(this.editingConfig,e,e=>({...e,binding:{...e.binding,dataSource:{...e.binding.dataSource,timeRange:{...e.binding.dataSource.timeRange,offsetAmount:r,displayMode:t}}}})))}this._updateSeriesTimeRange(e,t,r)}}_removeYAxis(e){if(this.editingConfig.components.yAxes.length<=1)return;const t=this.editingConfig.components.yAxes.filter(t=>t.id!==e);if(0===t.length)return;const i=t[0].id,o=this.editingConfig.series.map(t=>t.yAxisId===e?{...t,yAxisId:i}:t);this.editingConfig={...this.editingConfig,series:o,components:{...this.editingConfig.components,yAxes:t}}}_removeEntity(e){this.editingConfig=this.removeEditableEntity(this.editingConfig,e),this.entitiesLimitMessage=null}_schedulePreviewRefresh(){null!==this.previewRefreshTimer&&(window.clearTimeout(this.previewRefreshTimer),this.previewRefreshTimer=null),this.previewRefreshTimer=window.setTimeout(()=>{this.previewRefreshTimer=null,this._refreshPreview()},120)}async _refreshPreview(){if(this.open&&this.hass&&this.block&&this.chartInstance&&!this.previewRefreshInProgress){this.previewRefreshInProgress=!0;try{const t=this.normalizeConfig(this.editingConfig,this._resolvedMaxSeries()),i=this._getChartBlockElement();this._syncPreviewBlockStyles(i);const o=await C(this.hass,this.documentModel,this.block,t.series),r=await E(this.hass,t,o),a=r.series.some(e=>{var t;return e.points.length>0||Boolean(null==(t=e.items)?void 0:t.some(e=>e.points.length>0))});this.previewMessage=a?"":"No preview data available";const s=this.buildPreviewOption(t,r);if(i)try{I({config:t,option:s,getTitleStyle:()=>this._getChartTargetStyle(i,"getTitleStyleTargetId"),getLegendStyle:()=>this._getChartTargetStyle(i,"getLegendStyleTargetId"),getLegendLabelStyle:()=>this._getChartTargetStyle(i,"getLegendLabelStyleTargetId"),getLegendValueStyle:()=>this._getChartTargetStyle(i,"getLegendValueStyleTargetId"),getLegendUnitStyle:()=>this._getChartTargetStyle(i,"getLegendUnitStyleTargetId"),getTooltipStyle:()=>this._getChartTargetStyle(i,"getTooltipStyleTargetId"),getGridStyle:e=>this._getChartTargetStyle(i,"getGridStyleTargetId",e),getXAxisStyle:e=>this._getChartTargetStyle(i,"getXAxisStyleTargetId",e),getYAxisStyle:e=>this._getChartTargetStyle(i,"getYAxisStyleTargetId",e),getAllSeriesStyle:()=>this._getChartTargetStyle(i,"getAllSeriesStyleTargetId"),getSeriesStyle:e=>this._getChartTargetStyle(i,"getSeriesStyleTargetId",e)})}catch(e){}this.chartInstance.setOption(s,{notMerge:!0})}catch(t){this.previewMessage="Unable to build preview"}finally{this.previewRefreshInProgress=!1}}}_ensurePreviewChart(){this.previewChart&&(this.chartInstance||(this._syncPreviewBlockStyles(this._getChartBlockElement()),this.chartInstance=wt(this.previewChart),this.resizeObserver=new ResizeObserver(()=>{var e;return null==(e=this.chartInstance)?void 0:e.resize()}),this.resizeObserver.observe(this.previewChart)))}_disposePreviewChart(){var e,t;null!==this.previewRefreshTimer&&(window.clearTimeout(this.previewRefreshTimer),this.previewRefreshTimer=null),null==(e=this.resizeObserver)||e.disconnect(),this.resizeObserver=void 0,null==(t=this.chartInstance)||t.dispose(),this.chartInstance=void 0}_getChartBlockElement(){if(!this.block)return null;const e=this.documentModel.getElement(this.block);return e instanceof HTMLElement?e:null}_syncPreviewBlockStyles(e){if(!e)return void(this.previewBlockStyles={width:"100%",height:"300px"});const t=e.getBoundingClientRect(),i="function"==typeof e.getResolvedContextStyles?e.getResolvedContextStyles():{};this.previewBlockStyles={...i,position:"relative",left:"auto",top:"auto",right:"auto",bottom:"auto",transform:"none",margin:"0",width:`${Math.max(1,Math.round(t.width))}px`,height:`${Math.max(1,Math.round(t.height))}px`,maxWidth:"100%"}}_getChartTargetStyle(e,t,...i){const o=e[t],r=e.getTargetStyle;if("function"!=typeof o||"function"!=typeof r)return{};const a=o.apply(e,i);return a&&r.call(e,a)||{}}};Ho.styles=et`
        :host {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 1000;
            pointer-events: none;
        }

        :host([open]) {
            pointer-events: auto;
        }

        .overlay-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.56);
            opacity: 0;
            transition: opacity 0.22s ease;
        }

        :host([open]) .overlay-backdrop {
            opacity: 1;
        }

        .panel {
            position: absolute;
            top: 0;
            left: 100%;
            bottom: 0;
            width: min(96vw, 1680px);
            background: var(--bg-primary, #fff);
            box-shadow: 4px 0 24px rgba(0, 0, 0, 0.35);
            display: flex;
            flex-direction: column;
            transform: translateX(0);
            transition: transform 0.3s ease;
        }

        :host([open]) .panel {
            transform: translateX(-100%);
        }

        .header {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 14px;
            border-bottom: 1px solid var(--border-color, #e0e0e0);
            background: var(--bg-secondary, #f8f8f8);
            gap: 12px;
        }

        .title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary, #333);
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn {
            border: 1px solid var(--border-color, #d6d6d6);
            background: var(--bg-primary, #fff);
            color: var(--text-primary, #333);
            border-radius: 4px;
            padding: 6px 10px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .btn.primary {
            border: none;
            background: var(--accent-color, #2196f3);
            color: #fff;
        }
        .btn:disabled {
            opacity: 0.5;
        }

        .content {
            flex: 1;
            min-height: 0;
            display: grid;
            grid-template-columns: 1fr minmax(360px, 440px);
            overflow: hidden;
        }

        .config {
            min-height: 0;
            overflow: auto;
            border-left: 1px solid var(--border-color, #e0e0e0);
            background: var(--bg-secondary, #fafafa);
        }

        .group-body {
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: var(--bg-primary, #fff);
        }

        .group-inline-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }

        .inline-alert {
            padding: 8px 10px;
            border: 1px solid #ef9a9a;
            border-radius: 4px;
            background: #ffebee;
            color: #b71c1c;
            font-size: 12px;
            line-height: 1.4;
        }

        property-group {
            display: block;
            overflow: hidden;
            background: white;
        }

        .row {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .row.inline {
            flex-direction: row;
            gap: 8px;
        }

        .row.top-aligned {
            align-items: flex-start;
        }

        .field {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
        }

        .label {
            font-size: 10px;
            font-weight: 600;
            color: var(--text-secondary, #666);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        input,
        select {
            width: 100%;
            box-sizing: border-box;
            padding: 7px 9px;
            border: 1px solid var(--border-color, #d6d6d6);
            border-radius: 4px;
            font-size: 12px;
            color: var(--text-primary, #333);
            background: var(--bg-primary, #fff);
        }

        input[type='checkbox'] {
            width: auto;
            padding: 0;
        }

        input[type='color'] {
            height: 34px;
            padding: 4px;
        }

        .checkbox {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: var(--text-primary, #333);
            min-height: 34px;
        }

        .entity-card {
            border: 1px solid var(--border-color, #e0e0e0);
            border-radius: 8px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: var(--bg-primary, #fff);
        }

        .entity-list {
            display: flex;
            flex-direction: column;
        }

        .entity-list property-group {
            overflow: hidden;
            border: 1px solid #ccc;
            border-bottom-width: 0;
        }
        .entity-list property-group:last-child {
            border-bottom-width: 1px;
        }

        .entity-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }

        .entity-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-primary, #333);
        }

        .preview {
            position: relative;
            min-height: 0;
            padding: 15px;
            background: var(--bg-primary, #fff);
            overflow: auto;
        }

        .preview-stage {
            min-width: 100%;
            min-height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .preview-warning {
            position: sticky;
            top: 0;
            z-index: 1;
            width: min(560px, calc(100% - 24px));
            margin: 0 auto 10px;
            padding: 8px 12px;
            border: 1px solid rgba(217, 119, 6, 0.35);
            border-radius: 6px;
            background: rgba(255, 251, 235, 0.96);
            color: #92400e;
            font-size: 12px;
            line-height: 1.4;
            text-align: center;
        }

        .preview-block {
            position: relative;
            box-sizing: border-box;
            flex: 0 0 auto;
            border: 1px solid #eee;
            box-shadow: 0 0 15px -3px rgba(0, 0, 0, 0.15);
        }

        .preview-chart {
            width: 100%;
            height: 100%;
        }

        .preview-placeholder {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: var(--text-secondary, #666);
            pointer-events: none;
        }
    `;let qo=Ho;jo([pt({context:s})],qo.prototype,"documentModel"),jo([tt({type:Boolean,reflect:!0})],qo.prototype,"open"),jo([tt({attribute:!1})],qo.prototype,"block"),jo([tt({attribute:!1})],qo.prototype,"config"),jo([tt({attribute:!1})],qo.prototype,"hass"),jo([nt(".preview-chart")],qo.prototype,"previewChart"),jo([st()],qo.prototype,"editingConfig"),jo([st()],qo.prototype,"previewMessage"),jo([st()],qo.prototype,"entitiesLimitMessage"),jo([st()],qo.prototype,"unitOptionsByKey"),jo([st()],qo.prototype,"previewBlockStyles"),jo([st()],qo.prototype,"statisticAvailabilityByEntityId");var Yo=Object.getOwnPropertyDescriptor;let Xo=class extends qo{getEditorTitle(){return"Line / Area Chart"}getGroupPrefix(){return"chart-line-area"}getSpecificSectionLabel(){return"Line / Area"}getDefaultConfig(){return M()}normalizeConfig(e,t){return P(e,t)}cloneConfig(e){return T(e)}buildPreviewOption(e,t){return B(e,t)}renderSpecificSection(e){return ot`
            <div class="group-body">
                <div class="row inline">
                    <div class="field">
                        <span class="label">Mode</span>
                        <select
                            .value=${e.specific.mode}
                            @change=${e=>this._updateSpecific("mode",e.target.value)}
                        >
                            <option value="line">Line</option>
                            <option value="area">Area</option>
                        </select>
                    </div>
                    <div class="field">
                        <span class="label">Line Width</span>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            .value=${String(e.specific.lineWidth)}
                            @input=${e=>this._updateSpecificNumber("lineWidth",e)}
                        />
                    </div>
                </div>
                <div class="row inline">
                    ${"area"===e.specific.mode?ot`
                        <div class="field">
                            <span class="label">Area Opacity</span>
                            <input
                                type="number"
                                min="0"
                                max="1"
                                step="0.05"
                                .value=${String(e.specific.areaOpacity)}
                                @input=${e=>this._updateSpecificNumber("areaOpacity",e)}
                            />
                        </div>
                    `:null}
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            .checked=${e.specific.smooth}
                            @change=${e=>this._updateSpecific("smooth",e.target.checked)}
                        />
                        Smooth
                    </label>
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            .checked=${e.specific.showPoints}
                            @change=${e=>this._updateSpecific("showPoints",e.target.checked)}
                        />
                        Show points
                    </label>
                </div>
                <div class="row">
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            .checked=${e.specific.connectNulls}
                            @change=${e=>this._updateSpecific("connectNulls",e.target.checked)}
                        />
                        Connect null values
                    </label>
                </div>
            </div>
        `}};Xo=((e,t,i,o)=>{for(var r,a=o>1?void 0:o?Yo(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(a)||a);return a})([rt("chart-line-area-editor-overlay")],Xo);var Ko=Object.getOwnPropertyDescriptor;let Jo=class extends qo{getEditorTitle(){return"Bars Chart"}getGroupPrefix(){return"chart-bars"}getSpecificSectionLabel(){return"Bars"}getDefaultConfig(){return R()}normalizeConfig(e,t){return D(e,t)}cloneConfig(e){return O(e)}buildPreviewOption(e,t){return A(e,t)}renderSpecificSection(e){return ot`
            <div class="group-body">
                <div class="row inline">
                    <div class="field">
                        <span class="label">Mode</span>
                        <select
                            .value=${e.specific.mode}
                            @change=${e=>this._updateSpecific("mode",e.target.value)}
                        >
                            <option value="grouped">Grouped</option>
                            <option value="stacked">Stacked</option>
                        </select>
                    </div>
                    <div class="field">
                        <span class="label">Bar Width</span>
                        <input
                            type="number"
                            min="1"
                            max="120"
                            .value=${String(e.specific.barWidth)}
                            @input=${e=>this._updateSpecificNumber("barWidth",e)}
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="field">
                        <span class="label">Border Radius</span>
                        <input
                            type="number"
                            min="0"
                            max="40"
                            .value=${String(e.specific.borderRadius)}
                            @input=${e=>this._updateSpecificNumber("borderRadius",e)}
                        />
                    </div>
                </div>
            </div>
        `}};Jo=((e,t,i,o)=>{for(var r,a=o>1?void 0:o?Ko(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(a)||a);return a})([rt("chart-bars-editor-overlay")],Jo);var Qo=Object.getOwnPropertyDescriptor;let Zo=class extends qo{getEditorTitle(){return"Pie / Donut Chart"}getGroupPrefix(){return"chart-pie-donut"}getSpecificSectionLabel(){return"Pie / Donut"}getDefaultConfig(){return z()}normalizeConfig(e,t){return L(e,t)}cloneConfig(e){return N(e)}buildPreviewOption(e,t){var i,o;return F(e,t,{width:(null==(i=this.previewChart)?void 0:i.clientWidth)||0,height:(null==(o=this.previewChart)?void 0:o.clientHeight)||0})}getEditableEntities(e){const t=e.series[0];return t?(t.items||[]).map(e=>this._itemToEditableSeries(t,e)):[]}addEditableEntity(e){const t=this._getOrCreateParentSeries(e),i=t.items||[],o=V(i.length,{valueUnit:e.valueUnit,binding:t.binding});return this._replaceParentSeries(e,{...t,items:[...i,o]})}updateEditableEntity(e,t,i){const o=this._getOrCreateParentSeries(e),r=(o.items||[]).map((e,r)=>{if(r!==t)return e;const a=i(this._itemToEditableSeries(o,e));return this._editableSeriesToItem(e,a)});return this._replaceParentSeries(e,{...o,items:r})}removeEditableEntity(e,t){const i=this._getOrCreateParentSeries(e);return this._replaceParentSeries(e,{...i,items:(i.items||[]).filter((e,i)=>i!==t)})}renderSpecificSection(e){return ot`
            <div class="group-body">
                <div class="row inline">
                    <div class="field">
                        <span class="label">Mode</span>
                        <select
                            .value=${e.specific.mode}
                            @change=${e=>this._updateSpecific("mode",e.target.value)}
                        >
                            <option value="pie">Pie</option>
                            <option value="donut">Donut</option>
                        </select>
                    </div>
                    <div class="field">
                        <span class="label">Size (%)</span>
                        <input
                            type="number"
                            min="10"
                            max="100"
                            .value=${String(e.specific.outerRadius)}
                            @input=${e=>this._updateSpecificNumber("outerRadius",e)}
                        />
                    </div>
                    ${"donut"===e.specific.mode?ot`
                        <div class="field">
                            <span class="label">Inner Radius (%)</span>
                            <input
                                type="number"
                                min="0"
                                max="90"
                                .value=${String(e.specific.innerRadius)}
                                @input=${e=>this._updateSpecificNumber("innerRadius",e)}
                            />
                        </div>
                    `:dt}
                </div>
                <div class="row inline">
                    <div class="field">
                        <span class="label">Center Mode</span>
                        <select
                            .value=${e.specific.centerMode}
                            @change=${e=>this._updateSpecific("centerMode",e.target.value)}
                        >
                            <option value="auto">Auto</option>
                            <option value="manual">Manual</option>
                        </select>
                    </div>
                    ${"manual"===e.specific.centerMode?ot`
                        <div class="field">
                            <span class="label">X Reference</span>
                            <select
                                .value=${e.specific.centerXReference}
                                @change=${e=>this._updateSpecific("centerXReference",e.target.value)}
                            >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div class="field">
                            <span class="label">X Offset (%)</span>
                            <input
                                type="number"
                                min="-100"
                                max="100"
                                .value=${String(e.specific.centerXOffset)}
                                @input=${e=>this._updateSpecificNumber("centerXOffset",e)}
                            />
                        </div>
                    `:dt}
                </div>
                ${"manual"===e.specific.centerMode?ot`
                    <div class="row inline">
                        <div class="field">
                            <span class="label">Y Reference</span>
                            <select
                                .value=${e.specific.centerYReference}
                                @change=${e=>this._updateSpecific("centerYReference",e.target.value)}
                            >
                                <option value="top">Top</option>
                                <option value="middle">Middle</option>
                                <option value="bottom">Bottom</option>
                            </select>
                        </div>
                        <div class="field">
                            <span class="label">Y Offset (%)</span>
                            <input
                                type="number"
                                min="-100"
                                max="100"
                                .value=${String(e.specific.centerYOffset)}
                                @input=${e=>this._updateSpecificNumber("centerYOffset",e)}
                            />
                        </div>
                    </div>
                `:dt}
                ${e.title.show&&"center"===e.title.position?ot`
                    <div class="row">
                        <div class="field">
                            <span class="label">Title Center Reference</span>
                            <select
                                .value=${e.specific.titleCenterReference}
                                @change=${e=>this._updateSpecific("titleCenterReference",e.target.value)}
                            >
                                <option value="pie">Pie / Donut</option>
                                <option value="block">Block</option>
                            </select>
                        </div>
                    </div>
                `:dt}
                <div class="row inline top-aligned">
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            .checked=${e.specific.showLegendValue}
                            @change=${e=>this._updateSpecific("showLegendValue",e.target.checked)}
                        />
                        Show legend value
                    </label>
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            .checked=${e.specific.showLabel}
                            @change=${e=>this._updateSpecific("showLabel",e.target.checked)}
                        />
                        Show label
                    </label>
                    ${e.specific.showLabel?ot`
                        <label class="checkbox">
                            <input
                                type="checkbox"
                                .checked=${e.specific.showSliceValue}
                                @change=${e=>this._updateSpecific("showSliceValue",e.target.checked)}
                            />
                            Show value inside slice
                        </label>
                    `:dt}
                </div>
                ${this.renderValueUnitSection(e.valueUnit)}
            </div>
        `}showAxisSections(){return!1}getBaseDataModes(){return["live","statistics","history"]}getAvailableHistoryAggregations(){return["last","max","delta"]}getAvailableTimeRangeModes(e){return"live"===e.mode?[]:[...$]}shouldShowHistoryAggregation(){return!0}_getOrCreateParentSeries(e){return e.series[0]||z().series[0]}_replaceParentSeries(e,t){return{...e,series:[t]}}_itemToEditableSeries(e,t){return{...e,id:t.id,name:t.name,color:t.color,valueUnit:t.valueUnit||e.valueUnit,binding:t.binding,style:e.style,items:void 0}}_editableSeriesToItem(e,t){return{...e,id:t.id,name:t.name,color:t.color,valueUnit:t.valueUnit,binding:t.binding}}};Zo=((e,t,i,o)=>{for(var r,a=o>1?void 0:o?Qo(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(a)||a);return a})([rt("chart-pie-donut-editor-overlay")],Zo);const er=new U;var tr=Object.defineProperty,ir=(e,t,i,o)=>{for(var r,a=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(t,i,a)||a);return a&&tr(t,i,a),a};const or=class extends it{constructor(){super(),this.label="",this.property="",this.category="",this.origin="default",this.hasLocalOverride=!1,this.bindingEnabled=!1,this.showBindingToggle=!0,this.showAnimationToggle=!0,this.themeMode="auto",this.themeModeApplies=!1,this.hasThemeModeOverride=!1,this.hasAnyThemeModeOverride=!1,this.showOriginBadge=!0,this.disabled=!1,this.showSlot=!0,this.controls=new Map,this.contents=new Map,this.controls.set("binding",()=>this._renderControlBinding()),this.controls.set("animation",()=>this._renderControlAnimation()),this.contents.set("binding",()=>this._renderBindingSummary())}render(){return ot`
          <div class="property-header">
            <div class="label-group">
              <span class="label">${this.label}</span>
              ${this.showOriginBadge?ot`
                <property-origin-badge
                  .origin=${this.origin}
                  .presetName=${this.presetName}
                  .originContainer=${this.originContainer}
                  compact
                ></property-origin-badge>
              `:dt}
              ${this._renderThemeModeIndicator()}
            </div>
            
            <div class="controls">
                ${this.hasLocalOverride?ot`
                    <button
                        class="control-toggle"
                        @click=${this._handleReset}
                        ?disabled=${this.disabled}
                        data-tooltip="Reset to inherited value"
                        aria-label="Reset to inherited value"
                    >
                        <ha-icon icon="mdi:backup-restore"></ha-icon>
                    </button>
                `:dt}
                ${Array.from(this.controls.values()).map(e=>e())}
            </div>
          </div>
    
          <div class="property-content">
              ${Array.from(this.contents.values()).map(e=>e())}
              ${this.showSlot?ot`<slot></slot>`:dt}
              ${this.helperText?ot`<div class="helper-text">${this.helperText}</div>`:dt}
          </div>
        `}_renderControlBinding(){const e=!!this.binding;return this.showSlot=!e,ot`
            ${this.showBindingToggle?ot`
            <button
              class="control-toggle ${e?"active":""}"
              @click=${this._requestBindingEdit}
              ?disabled=${this.disabled}
              data-tooltip=${e?"Edit binding":"Add binding"}
              aria-label=${e?"Edit binding":"Add binding"}
            >
              <ha-icon icon="mdi:link-plus"></ha-icon>
            </button>
          `:dt}
        `}_renderThemeModeIndicator(){if(!this.themeModeApplies||"auto"===this.themeMode)return dt;const e=this.hasThemeModeOverride?`Editing ${this.themeMode} color override`:`Creating ${this.themeMode} color override`;return ot`
            <span
              class="theme-mode-indicator ${this.hasThemeModeOverride?"active":""} ${this.hasAnyThemeModeOverride?"mode-available":""}"
              data-tooltip=${e}
              aria-label=${e}
            >
              <ha-icon icon="mdi:theme-light-dark"></ha-icon>
            </span>
        `}_renderControlAnimation(){return ot`
            ${this.showAnimationToggle?ot`
            <button
              class="control-toggle"
              @click=${this._requestAnimationEdit}
              ?disabled=${this.disabled}
              data-tooltip='Edit animation'
              aria-label='Edit animation'
            >
                <ha-icon icon="mdi:movie-open-play-outline"></ha-icon>
            </button>
          `:dt}
        `}willUpdate(e){e.has("hass")&&(this._bindingEvaluator=this.hass?new j(this.hass,{resolveSlotEntity:e=>{var t;return null==(t=this.documentModel)?void 0:t.resolveSlotEntity(e)},onTemplateResult:()=>this.requestUpdate()}):void 0)}_requestBindingEdit(){this.disabled||this.dispatchEvent(new CustomEvent("property-binding-edit",{detail:{property:this.property,category:this.category,label:this.label},bubbles:!0,composed:!0}))}_emitBindingChange(e){this.dispatchEvent(new CustomEvent("property-binding-change",{detail:{property:this.property,category:this.category,binding:e},bubbles:!0,composed:!0}))}_requestAnimationEdit(){this.disabled||this.dispatchEvent(new CustomEvent("property-animation-edit",{detail:{property:this.property,category:this.category,label:this.label},bubbles:!0,composed:!0}))}_handleReset(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("property-reset",{detail:{property:this.property,category:this.category},bubbles:!0,composed:!0}))}_handleRemoveBinding(e){e.stopPropagation(),this._emitBindingChange(null)}_evaluateBindingValue(){if(!this.binding)return{value:this.resolvedValue,success:!0};const e=this.resolvedValue??this.binding.default;return this._bindingEvaluator&&this.hass?this._bindingEvaluator.evaluate(this.binding,{defaultEntityId:this.defaultEntityId,defaultValue:e}):{value:e,success:!1}}_formatResolvedValue(e){if(null==e||""===e)return"--";const t={value:e,unit:this.resolvedUnit};return W(this.property,t)??String(e)}_formatBindingMode(e){return`${e.charAt(0).toUpperCase()}${e.slice(1)}`}_truncate(e,t){return e.length<=t?e:`${e.slice(0,t-3)}...`}_stringifyValue(e){if(null==e)return"unset";if("string"==typeof e)return e;if("number"==typeof e||"boolean"==typeof e)return String(e);try{return JSON.stringify(e)}catch(t){return String(e)}}_getBindingSummaryLines(e){var t,i,o,r,a,s;const n=[],l=(null==(t=e.entity)?void 0:t.slotId)??void 0,d=l?null==(i=this.documentModel)?void 0:i.resolveSlotEntity(l):void 0,c=l?d:(null==(o=e.entity)?void 0:o.entityId)??void 0,p=(null==(r=e.entity)?void 0:r.source)??"state";switch(l?(n.push(`Slot: ${l}`),c?n.push(`Entity: ${c}`):n.push("Entity: slot not set")):c?n.push(`Entity: ${c}`):this.defaultEntityId?n.push(`Entity: default (${this.defaultEntityId})`):n.push("Entity: default (not set)"),n.push("Source: "+("state"===p?"state":`attribute ${p}`)),n.push(`Mode: ${this._formatBindingMode(e.mode)}`),e.mode){case"direct":if(e.inputRange||e.outputRange){const t=e.inputRange?`${e.inputRange[0]}-${e.inputRange[1]}`:"auto",i=e.outputRange?`${e.outputRange[0]}-${e.outputRange[1]}`:"auto";n.push(`Range: ${t} -> ${i}`)}break;case"map":n.push(`Mappings: ${Object.keys(e.map??{}).length}`);break;case"threshold":n.push(`Thresholds: ${(null==(a=e.thresholds)?void 0:a.length)??0}`);break;case"template":e.template&&n.push(`Template: ${this._truncate(e.template,48)}`);break;case"condition":n.push(`Conditions: ${(null==(s=e.conditions)?void 0:s.length)??0}`)}return void 0!==e.default&&""!==e.default&&n.push(`Default: ${this._stringifyValue(e.default)}`),n}_renderBindingSummary(){if(!this.binding)return dt;const e=this._evaluateBindingValue(),t=this._formatResolvedValue(e.value),i=this._getBindingSummaryLines(this.binding);return ot`
      <div class="binding-summary">
        <div class="binding-value">
          <span class="binding-value-label">Resolved value</span>
          <div class="binding-value-field">
            <span title=${t}>${t}</span>
            <div class="binding-actions">
              <button class="binding-action" @click=${this._requestBindingEdit} ?disabled=${this.disabled}>Edit</button>
              <button class="binding-action danger" @click=${this._handleRemoveBinding} ?disabled=${this.disabled}>Remove</button>
            </div>
          </div>
        </div>
        <div class="binding-details">
          ${i.map(e=>ot`<div class="binding-detail">${e}</div>`)}
        </div>
      </div>
    `}};or.styles=et`
        :host {
            display: block;
            margin-bottom: 12px;
        }

        .property-header {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 6px;
        }

        .label-group {
            display: flex;
            align-items: center;
            gap: 6px;
            flex: 1;
            min-width: 0;
        }

        .label {
            font-size: 12px;
            font-weight: 500;
            color: var(--text-primary, #333);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .controls {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            --mdc-icon-size: 18px;
        }

        .control-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2px 5px;
            border: 1px solid var(--border-color, #d4d4d4);
            border-radius: 5px;
            background: transparent;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .control-toggle:has(+ .control-toggle) {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        
        .control-toggle + .control-toggle {
            border-left: none;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        .control-toggle:hover:not(:disabled) {
            background: var(--bg-secondary, #f5f5f5);
            border-color: var(--border-color, #d4d4d4);
            color: var(--text-primary, #333);
        }

        .control-toggle.active {
            background: rgba(0, 120, 212, 0.1);
            outline: 1px solid var(--accent-color);
            outline-offset: -1px;
            color: var(--accent-color, #0078d4);
        }

        .theme-mode-indicator.active {
            color: var(--accent-color, #0078d4);
        }

        .theme-mode-indicator {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            flex: 0 0 auto;
            color: var(--accent-color, #0078d4);
            --mdc-icon-size: 15px;
        }

        .theme-mode-indicator.mode-available:not(.active) {
            color: var(--accent-color, #0078d4);
            opacity: 0.65;
        }

        .control-toggle:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .property-content {
            /* Slot for the actual input */
        }

        .helper-text {
            margin-top: 6px;
            font-size: 10px;
            color: var(--text-secondary, #666);
        }

        /* Tooltip for binding toggle */

        .control-toggle[data-tooltip],
        .theme-mode-indicator[data-tooltip] {
            position: relative;
        }

        .control-toggle[data-tooltip]::after,
        .theme-mode-indicator[data-tooltip]::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            padding: 4px 8px;
            background: #333;
            color: white;
            font-size: 10px;
            font-weight: normal;
            border-radius: 4px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.15s ease, visibility 0.15s ease;
            pointer-events: none;
            z-index: 100;
            margin-bottom: 4px;
        }

        .control-toggle[data-tooltip]:hover::after,
        .theme-mode-indicator[data-tooltip]:hover::after {
            opacity: 1;
            visibility: visible;
        }

        .binding-summary {
            border: 1px solid var(--border-color, #d4d4d4);
            background: var(--bg-secondary, #f5f5f5);
            border-radius: 4px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .binding-value {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .binding-value-label {
            font-size: 9px;
            font-weight: 600;
            color: var(--text-secondary, #666);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .binding-value-field {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 6px 8px;
            background: var(--bg-primary, #fff);
            border: 1px solid var(--border-color, #d4d4d4);
            border-radius: 3px;
            font-size: 11px;
            color: var(--text-primary, #333);
            font-weight: 600;
            min-height: 28px;
            box-sizing: border-box;
        }

        .binding-value-field span {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .binding-actions {
            display: flex;
            gap: 6px;
        }

        .binding-action {
            border: 1px solid var(--border-color, #d4d4d4);
            background: var(--bg-primary, #fff);
            color: var(--text-primary, #333);
            border-radius: 3px;
            padding: 4px 8px;
            font-size: 10px;
            cursor: pointer;
            white-space: nowrap;
        }

        .binding-action:hover {
            border-color: var(--accent-color, #0078d4);
            color: var(--accent-color, #0078d4);
        }

        .binding-action.danger:hover {
            border-color: #d32f2f;
            color: #d32f2f;
        }

        .binding-action:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .binding-details {
            display: grid;
            gap: 2px;
            font-size: 10px;
            color: var(--text-secondary, #666);
        }

        .binding-detail {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `;let rr=or;ir([tt({attribute:!1})],rr.prototype,"hass"),ir([pt({context:s})],rr.prototype,"documentModel"),ir([tt({type:String})],rr.prototype,"label"),ir([tt({type:String})],rr.prototype,"property"),ir([tt({type:String})],rr.prototype,"category"),ir([tt({type:String})],rr.prototype,"origin"),ir([tt({type:String})],rr.prototype,"presetName"),ir([tt({type:String})],rr.prototype,"originContainer"),ir([tt({type:Boolean})],rr.prototype,"hasLocalOverride"),ir([tt({attribute:!1})],rr.prototype,"binding"),ir([tt({attribute:!1})],rr.prototype,"resolvedValue"),ir([tt({type:String})],rr.prototype,"resolvedUnit"),ir([tt({type:String})],rr.prototype,"helperText"),ir([tt({type:Boolean})],rr.prototype,"bindingEnabled"),ir([tt({type:Boolean})],rr.prototype,"showBindingToggle"),ir([tt({type:Boolean})],rr.prototype,"showAnimationToggle"),ir([tt({type:String})],rr.prototype,"themeMode"),ir([tt({type:Boolean})],rr.prototype,"themeModeApplies"),ir([tt({type:Boolean})],rr.prototype,"hasThemeModeOverride"),ir([tt({type:Boolean})],rr.prototype,"hasAnyThemeModeOverride"),ir([tt({type:Boolean})],rr.prototype,"showOriginBadge"),ir([tt({type:Boolean})],rr.prototype,"disabled"),ir([tt({type:String})],rr.prototype,"defaultEntityId"),er.define("property-row",rr);class ar{renderPropertyRow(e,t,i,o={}){const{description:r,resolvedValue:a,propertyValue:s}=o,n=o.classes?o.classes:[];if(!e.binding)return ot`
                <div class="property-row ${n.join(" ")}">
                  <label class="property-label" title="${r||""}">${e.label}</label>
                  ${t}
                </div>
            `;const l=null==s?void 0:s.binding;return ot`
            <property-row
                class="property-row ${n.join(" ")}"
                .hass=${i.hass}
                .label=${e.label}
                .property=${e.name}
                .category=${"props"}
                .origin=${"default"}
                .hasLocalOverride=${!1}
                .binding=${l}
                .resolvedValue=${a}
                .defaultEntityId=${i.defaultEntityId}
                .showBindingToggle=${!0}
                .showAnimationToggle=${!1}
                .showOriginBadge=${!1}
                title=${r||""}
            >
                ${t}
            </property-row>
            `}getPropertyValue(e,t){const i=this.getPropertyValueObject(e);return i?i.value??t:t}getPropertyValueObject(e){if(!e||"object"!=typeof e)return;return"value"in e||"binding"in e?e:void 0}getValue(e,t){return null==e?t:e}}class sr extends ar{render(e,t,i,o){var r;const a=null==(r=o.actionHandlers)?void 0:r.get(e.actionId);return ot`
      <div class="property-row">
        <button
          class="edit-grid-button"
          @click=${()=>{a?a():console.warn(`[ActionTraitRenderer] No handler found for action: ${e.actionId}`)}}
        >
          ${e.icon?ot`<span class="action-icon">${e.icon}</span>`:""}
          ${e.buttonLabel}
        </button>
      </div>
    `}}class nr extends ar{render(e,t,i,o){var r,a,s;const n=this.getPropertyValueObject(t),l=this.getPropertyValue(t,""),d=null==(r=o.documentModel)?void 0:r.resolveEntityForBlock(o.block.id),c=null==d?void 0:d.entityId;let p=[];if(c&&(null==(s=null==(a=o.hass)?void 0:a.states)?void 0:s[c])){const e=o.hass.states[c];p=["last_changed","last_updated",...Object.keys(e.attributes||{}).sort()]}const h=p.length>0&&""!==l&&!p.includes(l),u=h?"__custom__":l;return this.renderPropertyRow(e,ot`
                ${0===p.length?ot`
                    <!-- No attributes available - show text input -->
                    <input
                        type="text"
                        class="property-input"
                        .value=${l}
                        @input=${t=>{i(e.name,t.target.value)}}
                        placeholder=${e.placeholder||"Enter attribute name"}
                    />
                    ${c?ot`
                        <div class="info-text" style="margin-top: 4px;">
                            This entity has no attributes
                        </div>
                    `:ot`
                        <div class="info-text" style="margin-top: 4px;">
                            No entity configured - enter attribute name manually
                        </div>
                    `}
                `:ot`
                    <!-- Attributes available - show dropdown with custom option -->
                    <select
                        class="property-input"
                        .value=${u}
                        @change=${t=>{const o=t.target.value;"__custom__"===o?h||i(e.name,"custom_attribute"):i(e.name,o)}}
                    >
                        ${""===l?ot`
                            <option value="">Select attribute...</option>
                        `:dt}
                        ${p.map(e=>ot`
                            <option value=${e} ?selected=${l===e}>
                                ${e}
                            </option>
                        `)}
                        <option value="__custom__" ?selected=${h}>
                            Custom...
                        </option>
                    </select>
                    ${h?ot`
                        <input
                            type="text"
                            class="property-input"
                            style="margin-top: 8px;"
                            .value=${l}
                            @input=${t=>{i(e.name,t.target.value)}}
                            placeholder=${e.placeholder||"Enter attribute name"}
                        />
                    `:dt}
                `}
            `,o,{description:e.description,resolvedValue:l,propertyValue:n})}}class lr extends ar{render(e,t,i,o){const r=this.getPropertyValueObject(t),a=this.getPropertyValue(t,!1);return this.renderPropertyRow(e,ot`
            <label class="toggle-switch">
                <input
                    type="checkbox"
                    .checked=${Boolean(a)}
                    @change=${t=>{i(e.name,t.target.checked)}}
                />
                <span class="toggle-slider"></span>
            </label>
          `,o,{description:e.description,resolvedValue:a,propertyValue:r,classes:["property-row-inline"]})}}class dr extends ar{render(e,t,i,o){const r=this.getPropertyValueObject(t),a=this.getPropertyValue(t,"#000000");return this.renderPropertyRow(e,ot`
        <input
          type="color"
          class="property-input"
          .value=${String(a)}
          @input=${t=>{i(e.name,t.target.value)}}
        />
      `,o,{description:e.description,resolvedValue:a,propertyValue:r})}}class cr extends ar{render(e,t,i,o){const r=this.getPropertyValueObject(t),a=this.getPropertyValue(t,""),s=this._resolveOptions(e,o),n=this._ensureCurrentOption(s,a),l=n.length>0,d=e.emptyLabel??"No options available";return this.renderPropertyRow(e,ot`
                <select
                    class="property-input"
                    .value=${String(a)}
                    ?disabled=${!l}
                    @change=${t=>{i(e.name,t.target.value)}}
                >
                    ${l?n.map(e=>ot`
                            <option value="${e.value}" ?selected=${a===e.value}>
                                ${e.label}
                            </option>
                        `):ot`<option value="">${d}</option>`}
                </select>
            `,o,{description:e.description,resolvedValue:a,propertyValue:r})}_resolveOptions(e,t){if("function"==typeof e.optionsProvider){const i=e.optionsProvider(t);if(Array.isArray(i))return i}return e.options??[]}_ensureCurrentOption(e,t){return t?e.some(e=>e.value===t)?e:[{value:t,label:t},...e]:e}}class pr extends ar{render(e,t,i,o){const r="slot"===this.getPropertyValue(t,"fixed"),a=e.slotIdProp||"slotId",s=o.props[a],n="object"==typeof s&&null!==s&&"value"in s?s.value??"":s||"";return ot`
      <div class="entity-mode-toggle">
        <span class="entity-mode-label">
          ${r?"Entity slot":"Fixed entity"}
        </span>
        <label class="toggle-switch">
          <input
            type="checkbox"
            .checked=${r}
            @change=${t=>{const o=t.target.checked;i(e.name,o?"slot":"fixed")}}
          />
          <span class="toggle-slider"></span>
        </label>
      </div>
      ${r?ot`
        <div class="property-row">
          <label class="property-label">Slot ID</label>
          <input
            type="text"
            class="property-input"
            .value=${n}
            @input=${e=>{i(a,e.target.value)}}
          />
          <div class="slot-info">This entity will be configurable when the card is used</div>
        </div>
      `:""}
    `}}class hr extends ar{render(e,t,i,o){const r=this.getPropertyValueObject(t),a=this.getPropertyValue(t,"");return o.hass?this.renderPropertyRow(e,ot`
        <ha-selector
          .hass=${o.hass}
          .selector=${{entity:{multiple:!1,domain:e.includeDomains,device_class:e.deviceClass}}}
          .value=${a}
          @value-changed=${t=>{i(e.name,t.detail.value)}}
        ></ha-selector>
      `,o,{description:e.description,resolvedValue:a,propertyValue:r}):ot``}}class ur extends ar{render(e,t,i,o){const r=this.getPropertyValueObject(t),a=this.getPropertyValue(t,"");return o.hass?this.renderPropertyRow(e,ot`
        <ha-icon-picker
          .hass=${o.hass}
          .value=${a}
          @value-changed=${t=>{i(e.name,t.detail.value)}}
        ></ha-icon-picker>
      `,o,{description:e.description,resolvedValue:a,propertyValue:r}):ot``}}class gr extends ar{render(e,t,i,o){const r=this.getPropertyValueObject(t),a=this.getPropertyValue(t,"");return this.renderPropertyRow(e,ot`
        <div class="property-info">
          ${a}
          ${e.description?ot`
            <div class="info-text">${e.description}</div>
          `:""}
        </div>
      `,o,{resolvedValue:a,propertyValue:r})}}class vr extends ar{render(e,t,i,o){var r,a;const s=this.getPropertyValueObject(t),n=this.getPropertyValue(t,""),l=Boolean(n),d=l?G(n)||n:e.emptyLabel??"No media selected",c=`media-picker-open:${e.name}`,p=`media-picker-clear:${e.name}`,h=null==(r=o.actionHandlers)?void 0:r.get(c),u=null==(a=o.actionHandlers)?void 0:a.get(p),g=e.selectLabel??"Select media",v=e.editLabel??"Edit",b=e.removeLabel??"Remove",m=ot`
            <div class="media-picker ${l?"has-value":"empty"}">
                <div class="media-chip" title=${l?n:""}>
                    ${d}
                </div>
                <div class="media-picker-actions">
                    ${l?ot`
                        <button
                            class="media-action-btn"
                            @click=${()=>{h?h():console.warn(`[MediaPickerTrait] No handler for ${c}`)}}
                        >
                            ${v}
                        </button>
                        <button
                            class="media-action-btn danger"
                            @click=${()=>{u?u():console.warn(`[MediaPickerTrait] No handler for ${p}`)}}
                        >
                            ${b}
                        </button>
                    `:ot`
                        <button
                            class="media-action-btn primary"
                            @click=${()=>{h?h():console.warn(`[MediaPickerTrait] No handler for ${c}`)}}
                        >
                            ${g}
                        </button>
                    `}
                </div>
            </div>
        `;return this.renderPropertyRow(e,m,o,{resolvedValue:n,propertyValue:s,classes:["media-picker-row"]})}}class br extends ar{render(e,t,i,o){const r=this.getPropertyValueObject(t),a=this.getPropertyValue(t,0);return this.renderPropertyRow(e,ot`
        <input
          type="number"
          class="property-input"
          .value=${String(a)}
          min="${e.min??""}"
          max="${e.max??""}"
          step="${e.step??1}"
          @input=${t=>{const o=t.target.value,r=e.step&&e.step<1?parseFloat(o):parseInt(o,10);i(e.name,isNaN(r)?0:r)}}
        />
      `,o,{description:e.description,resolvedValue:a,propertyValue:r})}}class mr extends ar{render(e,t,i,o){const r=this.getPropertyValueObject(t),a=this.getPropertyValue(t,"");return this.renderPropertyRow(e,ot`
        <select
          class="property-input"
          .value=${String(a)}
          @change=${t=>{i(e.name,t.target.value)}}
        >
          ${e.options.map(e=>ot`
            <option value="${e.value}" ?selected=${a===e.value}>
              ${e.label}
            </option>
          `)}
        </select>
      `,o,{description:e.description,resolvedValue:a,propertyValue:r})}}class fr extends ar{render(e,t,i,o){const r=this.getPropertyValueObject(t),a=this.clampValue(e,this.getPropertyValue(t,e.min)),s=this.getInputStep(e),n=this.getDisplayStep(e,a),l=this.formatValue(n,a);return this.renderPropertyRow(e,ot`
                <div class="slider-row">
                    <input
                        type="range"
                        class="property-input property-input-slider"
                        .value=${String(a)}
                        min="${e.min}"
                        max="${e.max}"
                        step="${s}"
                        @input=${t=>{const o=t.target.value,r=this.normalizeInput(e,o);i(e.name,r)}}
                    />
                    <div class="slider-value">${l}</div>
                </div>
            `,o,{description:e.description,resolvedValue:a,propertyValue:r})}getInputStep(e){return"adaptive"===e.stepMode?.1:e.step??1}getDisplayStep(e,t){return"adaptive"===e.stepMode?t<1?.1:1:e.step??1}normalizeInput(e,t){const i=parseFloat(t);if(Number.isNaN(i))return e.min;let o=e.step??1;"adaptive"===e.stepMode&&(o=i<1?.1:1);let r=i;return o>0&&(r=Math.round(i/o)*o,r=.1===o?parseFloat(r.toFixed(1)):Math.round(r)),void 0!==e.min&&(r=Math.max(e.min,r)),void 0!==e.max&&(r=Math.min(e.max,r)),r}clampValue(e,t){let i=Number.isFinite(t)?t:e.min;return void 0!==e.min&&(i=Math.max(e.min,i)),void 0!==e.max&&(i=Math.min(e.max,i)),i}formatValue(e,t){return e<1?t.toFixed(1):String(Math.round(t))}}class yr extends ar{render(e,t,i,o){var r;const a=this.getPropertyValueObject(t),s=this.getPropertyValue(t,""),n="object"==typeof s&&null!==s&&"isTemplate"in s?s.value:s,l=null==(r=o.templateErrors)?void 0:r[e.name],d=e.templateKeywords&&e.templateKeywords.length>0;return this.renderPropertyRow(e,ot`
                <input
                        type="text"
                        class="property-input"
                        .value=${String(n)}
                        placeholder="${e.placeholder||""}"
                        @input=${t=>{i(e.name,t.target.value)}}
                />
                ${d?ot`
                    <div class="template-legend">
                        ${e.templateKeywords.map(e=>ot`
                            <div class="template-legend-row">
                                <code>{{${e.key}}}</code>
                                <span>${e.description}</span>
                            </div>
                        `)}
                    </div>
                `:""}
                ${l?ot`
                    <div class="template-error">${l}</div>`:""}
            `,o,{description:e.description,resolvedValue:n,propertyValue:a})}}class xr extends ar{render(e,t,i,o){var r;const a=this.getPropertyValueObject(t),s=this.getPropertyValue(t,""),n=null==(r=o.templateErrors)?void 0:r[e.name],l=e.templateKeywords&&e.templateKeywords.length>0;return this.renderPropertyRow(e,ot`
        <textarea
          class="property-input"
          rows="${e.rows||3}"
          placeholder="${e.placeholder||""}"
          .value=${String(s)}
          @input=${t=>{i(e.name,t.target.value)}}
        ></textarea>
        ${l?ot`
          <div class="template-legend">
            ${e.templateKeywords.map(e=>ot`
              <div class="template-legend-row">
                <code>{{${e.key}}}</code>
                <span>${e.description}</span>
              </div>
            `)}
          </div>
        `:""}
        ${n?ot`<div class="template-error">${n}</div>`:""}
      `,o,{description:e.description,resolvedValue:s,propertyValue:a})}}const _r=class{static register(e,t){this.renderers.set(e,t)}static get(e){return this.initialize(),this.renderers.get(e)}static render(e,t,i,o){this.initialize();const r=this.renderers.get(e.type);return r?r.render(e,t,i,o):(console.warn(`[TraitRendererFactory] No renderer found for trait type: ${e.type}`),ot`
        <div class="property-row">
          <span class="property-label">${e.label}</span>
          <span style="color: var(--error-color, red); font-size: 11px;">
            Unknown trait type: ${e.type}
          </span>
        </div>
      `)}static hasRenderer(e){return this.initialize(),this.renderers.has(e)}static initialize(){this.initialized||(this.register("text",new yr),this.register("number",new br),this.register("slider",new fr),this.register("color",new dr),this.register("checkbox",new lr),this.register("select",new mr),this.register("context-select",new cr),this.register("textarea",new xr),this.register("entity-picker",new hr),this.register("icon-picker",new ur),this.register("action",new sr),this.register("media-picker",new vr),this.register("info",new gr),this.register("entity-mode",new pr),this.register("attribute-picker",new nr),this.initialized=!0)}};_r.renderers=new Map,_r.initialized=!1;let kr=_r;class wr{static evaluate(e,t){return void 0===e||this._evaluateCondition(e,t)}static _evaluateCondition(e,t){const{props:i}=t;if(function(e){return"prop"in e&&"eq"in e}(e)){return this._getNestedValue(i,e.prop)===e.eq}if(function(e){return"prop"in e&&"neq"in e}(e)){return this._getNestedValue(i,e.prop)!==e.neq}if(function(e){return"prop"in e&&"in"in e}(e)){const t=this._getNestedValue(i,e.prop);return e.in.includes(t)}if(function(e){return"prop"in e&&"exists"in e}(e)){const t=this._getNestedValue(i,e.prop),o=null!=t&&""!==t;return e.exists?o:!o}return function(e){return"and"in e}(e)?e.and.every(e=>this._evaluateCondition(e,t)):function(e){return"or"in e}(e)?e.or.some(e=>this._evaluateCondition(e,t)):function(e){return"not"in e}(e)?!this._evaluateCondition(e.not,t):(console.warn("[VisibilityEvaluator] Unknown condition type:",e),!0)}static _getNestedValue(e,t){const i=t.split(".");let o=e;for(const r of i){if(null==o)return;o=o[r]}return o}}var Sr=Object.defineProperty,$r=Object.getOwnPropertyDescriptor,Cr=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?$r(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Sr(t,i,a),a};const Er=["unavailable","unknown"],Ir={alarm_control_panel:["disarmed","armed_home","armed_away","armed_night","armed_vacation","armed_custom_bypass","arming","disarming","pending","triggered"],automation:["on","off"],binary_sensor:["on","off"],cover:["open","closed","opening","closing","stopped"],device_tracker:["home","not_home"],fan:["on","off"],input_boolean:["on","off"],light:["on","off"],lock:["locked","unlocked","locking","unlocking","jammed"],media_player:["off","idle","playing","paused","standby","buffering"],person:["home","not_home"],script:["on","off"],siren:["on","off"],sun:["above_horizon","below_horizon"],switch:["on","off"],timer:["idle","active","paused"],update:["on","off"],vacuum:["idle","cleaning","paused","returning","docked","error"],weather:["clear-night","cloudy","exceptional","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant"]},Mr=new Set(["alarm_control_panel","automation","binary_sensor","climate","cover","device_tracker","fan","input_boolean","input_select","light","lock","media_player","person","script","select","siren","sun","switch","timer","update","vacuum","water_heater","weather"]),Pr=new Set(["counter","input_number","number","proximity","sensor"]);let Tr=class extends it{constructor(){super(...arguments),this.slots=[],this.disabled=!1,this._entityConfig={mode:"inherited"},this._resolvedEntityInfo=null,this._valueSource="state",this._availableAttributes=[],this._stateOptions=null,this._thresholdSupported=!0,this._mode="direct",this._mapEntries=[],this._thresholds=[],this._template="",this._defaultValue=void 0,this._defaultHasValue=!1,this._inputRange=[0,100],this._outputRange=[0,100],this._useRangeMapping=!1}get _effectiveEntityId(){return"inherited"===this._entityConfig.mode?this.defaultEntityId:"slot"===this._entityConfig.mode?this._getSlotEntityId(this._entityConfig.slotId):"fixed"===this._entityConfig.mode?this._entityConfig.entityId:void 0}connectedCallback(){super.connectedCallback(),this._syncFromBinding()}disconnectedCallback(){super.disconnectedCallback(),this._disposeTemplateSession()}shouldUpdate(e){return e.has("binding")&&this._syncFromBinding(),e.has("valueInputConfig")&&this._syncValueInputConfig(),e.has("defaultEntityId")&&!e.has("binding")&&(this._updateEntityOptions(),this._updateTemplatePreview()),e.has("slots")&&!e.has("binding")&&(this._loadAvailableAttributes(),this._updateEntityOptions(),this._updateTemplatePreview()),e.has("hass")&&this._updateTemplatePreview(),(!e.has("hass")||1!==e.size)&&super.shouldUpdate(e)}render(){return this.hass?ot`
            ${this._renderEntitySourceSection()}
            ${this._renderValueSourceSection()}

            <div class="section">
                <div class="section-title">Binding Mode</div>
                <div class="mode-selector">
                    ${this._renderModeButton("direct","Direct")}
                    ${this._renderModeButton("map","Map")}
                    ${this._thresholdSupported?this._renderModeButton("threshold","Threshold"):dt}
                    ${this._renderModeButton("template","Template")}
                </div>
            </div>

            ${this._renderModeConfig()}

            <div class="section">
                <div class="row">
                    <label>Default</label>
                    <div class="default-input">
                        ${this._renderValueInput(this._defaultValue,(e,t)=>this._handleDefaultValueChange(e,t),"Fallback value")}
                    </div>
                    <button
                            class="icon-btn"
                            @click=${this._clearDefaultValue}
                            ?disabled=${this.disabled||!this._defaultHasValue}
                    >×
                    </button>
                </div>
            </div>
        `:ot``}_syncFromBinding(){if(!this.binding)return this._mode="direct",this._defaultValue=void 0,this._defaultHasValue=!1,this._mapEntries=[],this._thresholds=[],this._template="",this._useRangeMapping=!1,this._entityConfig={mode:"inherited"},this._valueSource="state",this._syncValueInputConfig(),this._updateEntityOptions(),void this._updateResolvedEntityInfo();switch(this._mode=this.binding.mode,this._defaultHasValue=void 0!==this.binding.default,this._defaultValue=this._defaultHasValue?this.binding.default:this._getDefaultValueForInput(),this.binding.entity?(void 0!==this.binding.entity.slotId?this._entityConfig={mode:"slot",slotId:this.binding.entity.slotId||void 0}:void 0!==this.binding.entity.entityId?this._entityConfig={mode:"fixed",entityId:this.binding.entity.entityId||void 0}:this._entityConfig={mode:"inherited"},this._valueSource=this.binding.entity.source||"state",this._loadAvailableAttributes()):(this._entityConfig={mode:"inherited"},this._valueSource="state"),this.binding.mode){case"direct":{const e=this.binding;this._useRangeMapping=!(!e.inputRange&&!e.outputRange),this._inputRange=e.inputRange??[0,100],this._outputRange=e.outputRange??[0,100];break}case"map":{const e=this.binding;this._mapEntries=Object.entries(e.map).map(([e,t])=>({key:e,value:t}));break}case"threshold":{const e=this.binding;this._thresholds=[...e.thresholds];break}case"template":{const e=this.binding;this._template=e.template;break}}this._syncValueInputConfig(),this._updateEntityOptions(),this._updateResolvedEntityInfo(),this._updateTemplatePreview()}_buildBinding(){const e="inherited"===this._entityConfig.mode&&"state"===this._valueSource?void 0:{entityId:"fixed"===this._entityConfig.mode?this._entityConfig.entityId||null:void 0,slotId:"slot"===this._entityConfig.mode?this._entityConfig.slotId||null:void 0,source:this._valueSource},t={default:this._defaultHasValue?this._normalizeDefaultValue(this._defaultValue):void 0,entity:e};switch(this._mode){case"direct":{const e={...t,mode:"direct"};return this._useRangeMapping&&(e.inputRange=this._inputRange,e.outputRange=this._outputRange),e}case"map":{const e={};for(const t of this._mapEntries)t.key&&(e[t.key]=t.value);return{...t,mode:"map",map:e}}case"threshold":return{...t,mode:"threshold",thresholds:this._thresholds};case"condition":return{...t,mode:"condition",conditions:[]};case"template":return{...t,mode:"template",template:this._template}}}_emitChange(){const e=this._buildBinding();this.dispatchEvent(new CustomEvent("binding-change",{detail:{binding:e,unit:this._valueUnit},bubbles:!0,composed:!0}))}_handleModeChange(e){this._mode=e,this._emitChange(),this._updateTemplatePreview()}_handleDefaultValueChange(e,t){this._defaultValue=e,this._defaultHasValue=!this._isEmptyDefaultValue(e),this._setValueUnit(t),this._emitChange()}_clearDefaultValue(){this._defaultValue=this._getDefaultValueForInput(),this._defaultHasValue=!1,this._emitChange()}_addMapEntry(){this._mapEntries=[...this._mapEntries,{key:"",value:this._getDefaultValueForInput()}]}_updateMapEntryKey(e,t){this._mapEntries=this._mapEntries.map((i,o)=>o===e?{...i,key:t}:i),this._emitChange()}_updateMapEntryValue(e,t,i){this._mapEntries=this._mapEntries.map((i,o)=>o===e?{...i,value:t}:i),this._setValueUnit(i),this._emitChange()}_removeMapEntry(e){this._mapEntries=this._mapEntries.filter((t,i)=>i!==e),this._emitChange()}_addThreshold(){this._thresholds=[...this._thresholds,{min:0,max:100,value:this._getDefaultValueForInput()}]}_updateThreshold(e,t,i){this._thresholds=this._thresholds.map((o,r)=>r===e?{...o,[t]:i}:o),this._emitChange()}_updateThresholdValue(e,t,i){this._thresholds=this._thresholds.map((i,o)=>o===e?{...i,value:t}:i),this._setValueUnit(i),this._emitChange()}_removeThreshold(e){this._thresholds=this._thresholds.filter((t,i)=>i!==e),this._emitChange()}_toggleRangeMapping(e){this._useRangeMapping=e.target.checked,this._emitChange()}_updateRange(e,t,i){"input"===e?this._inputRange=0===t?[i,this._inputRange[1]]:[this._inputRange[0],i]:this._outputRange=0===t?[i,this._outputRange[1]]:[this._outputRange[0],i],this._emitChange()}_handleEntityConfigChange(e){this._entityConfig=e.detail,this._updateResolvedEntityInfo(),this._loadAvailableAttributes(),this._updateEntityOptions(),this._emitChange(),this._updateTemplatePreview()}_updateResolvedEntityInfo(){const e=this._effectiveEntityId;e?"inherited"===this._entityConfig.mode?this._resolvedEntityInfo={source:"inherited",entityId:e}:"fixed"===this._entityConfig.mode?this._resolvedEntityInfo={source:"fixed",entityId:e}:"slot"===this._entityConfig.mode?this._resolvedEntityInfo={source:"slot",entityId:e,slotId:this._entityConfig.slotId}:this._resolvedEntityInfo={source:"none",entityId:void 0}:this._resolvedEntityInfo={source:"none",entityId:void 0}}_handleManageSlots(){this.dispatchEvent(new CustomEvent("manage-entities-slots",{bubbles:!0,composed:!0}))}_handleValueSourceTypeChange(e){const t=e.target.value;this._valueSource="state"===t?"state":this._availableAttributes[0]||"",this._updateEntityOptions(),this._emitChange(),this._updateTemplatePreview()}_handleAttributeChange(e){const t=e.target.value;if("__custom__"===t){if(!this._availableAttributes.includes(this._valueSource)&&"state"!==this._valueSource)return;this._valueSource="custom_attribute"}else this._valueSource=t||"state";this._updateEntityOptions(),this._emitChange(),this._updateTemplatePreview()}_handleCustomAttributeInput(e){const t=e.target.value;t&&"state"!==t&&(this._valueSource=t,this._updateEntityOptions(),this._emitChange(),this._updateTemplatePreview())}_loadAvailableAttributes(){var e,t;const i=this._effectiveEntityId;if(!i||!(null==(t=null==(e=this.hass)?void 0:e.states)?void 0:t[i]))return void(this._availableAttributes=[]);const o=this.hass.states[i],r=Object.keys(o.attributes||{}).sort();this._availableAttributes=["last_changed","last_updated",...r]}_getSlotEntityId(e){var t;if(e)return null==(t=this.slots.find(t=>t.id===e))?void 0:t.entityId}_syncValueInputConfig(){var e;const t=this.valueInputConfig;if(t){if("number"===t.type||"slider"===t.type||"spacing"===t.type){const i=t.unit??(null==(e=t.units)?void 0:e[0]);return i?void((!this._valueUnit||t.units&&!t.units.includes(this._valueUnit))&&(this._valueUnit=i)):void(this._valueUnit=void 0)}this._valueUnit=void 0}else this._valueUnit=void 0}_setValueUnit(e){e&&e!==this._valueUnit&&(this._valueUnit=e)}_normalizeDefaultValue(e){if("string"!=typeof e||""!==e.trim())return e}_isEmptyDefaultValue(e){return null==e||"string"==typeof e&&""===e.trim()}_getDefaultValueForInput(){var e;const t=this.valueInputConfig;if(!t)return"";switch(t.type){case"color":return"#000000";case"number":case"slider":return t.min??0;case"select":return(null==(e=t.options[0])?void 0:e.value)??"";case"spacing":return{top:0,right:0,bottom:0,left:0};default:return""}}_getEntityState(){var e,t;const i=this._effectiveEntityId;if(i&&(null==(t=null==(e=this.hass)?void 0:e.states)?void 0:t[i]))return this.hass.states[i]}_getEntityDomain(e){if(!e)return;const[t]=e.split(".");return t||void 0}_buildStateOptions(e,t){const i=[],o=e=>{i.includes(e)||i.push(e)};for(const r of e)"string"==typeof r&&r&&o(r);null!=t&&o(String(t));for(const r of Er)o(r);return i}_getAttributeStateOptions(e,t){if("input_select"===e||"select"===e){const e=t.options;if(Array.isArray(e))return e}if("climate"===e){const e=t.hvac_modes;if(Array.isArray(e))return e}if("water_heater"===e){const e=t.operation_list??t.available_modes;if(Array.isArray(e))return e}return null}_getStateOptions(){if("state"!==this._valueSource)return null;const e=this._getEntityState();if(!e)return null;const t=this._getEntityDomain(e.entity_id);if(!t)return null;const i=this._getAttributeStateOptions(t,e.attributes||{});if(i)return this._buildStateOptions(i,e.state);const o=Ir[t];return o?this._buildStateOptions(o,e.state):null}_isNumericValue(e){return"number"==typeof e?!Number.isNaN(e):"string"==typeof e&&""!==e.trim()&&!Number.isNaN(Number(e))}_isThresholdSupported(){if("state"===this._valueSource){if(this._stateOptions&&this._stateOptions.length>0)return!1;const e=this._getEntityDomain(this._effectiveEntityId);if(e&&Mr.has(e))return!1;const t=this._getEntityState();return t&&this._isNumericValue(t.state)||e&&Pr.has(e),!0}const e=this._getEntityState();if(!e)return!0;const t=(e.attributes||{})[this._valueSource];return null==t||""===t||this._isNumericValue(t)}_updateEntityOptions(){this._stateOptions=this._getStateOptions(),this._thresholdSupported=this._isThresholdSupported()}_coerceSpacing(e){if(e&&"object"==typeof e){const t=e;return{top:Number(t.top??0),right:Number(t.right??0),bottom:Number(t.bottom??0),left:Number(t.left??0)}}}_coerceNumber(e,t){const i="number"==typeof e?e:Number(e);return Number.isFinite(i)?i:t}_renderValueInput(e,t,i){var o,r,a,s;const n=this.valueInputConfig;if(!n||"text"===n.type){const o=n&&"text"===n.type&&n.placeholder?n.placeholder:i??"";return ot`
                <input
                    type="text"
                    class="entry-row-value-output"
                    .value=${"string"==typeof e?e:void 0===e?"":String(e)}
                    @input=${e=>t(e.target.value)}
                    placeholder=${o}
                    ?disabled=${this.disabled}
                />
            `}switch(n.type){case"icon-picker":{const i="string"==typeof e?e:"";return this.hass?ot`
                    <ha-icon-picker
                        class="entry-row-value-output"   
                        .hass=${this.hass}
                        .value=${i}
                        .placeholder=${n.placeholder}
                        @value-changed=${e=>t(e.detail.value)}
                    ></ha-icon-picker>
                `:dt}case"color":return ot`
                    <sm-color-input
                        class="entry-row-value-output"
                        .value=${"string"==typeof e&&e?e:"#000000"}
                        @change=${e=>t(e.detail.value)}
                    ></sm-color-input>
                `;case"select":{const i=void 0!==e?String(e):(null==(o=n.options[0])?void 0:o.value)??"";return ot`
                    <sm-select-input
                        class="entry-row-value-output"
                        .value=${i}
                        .options=${n.options}
                        @change=${e=>t(e.detail.value)}
                    ></sm-select-input>
                `}case"spacing":{const i=this._valueUnit??n.unit??(null==(r=n.units)?void 0:r[0])??"px",o=n.units??(n.unit?[n.unit]:["px"]);return ot`
                    <sm-spacing-input
                        class="entry-row-value-output"
                        .value=${this._coerceSpacing(e)}
                        .unit=${i}
                        .units=${o}
                        @change=${e=>t(e.detail.value,e.detail.unit)}
                    ></sm-spacing-input>
                `}case"slider":{const i=this._valueUnit??n.unit??(null==(a=n.units)?void 0:a[0]),o=n.units??(n.unit?[n.unit]:[]);return ot`
                    <sm-slider-input
                        class="entry-row-value-output"
                        .value=${this._coerceNumber(e,n.min)}
                        min=${n.min}
                        max=${n.max}
                        step=${n.step??1}
                        .unit=${i}
                        .units=${o}
                        @change=${e=>t(e.detail.value,e.detail.unit)}
                    ></sm-slider-input>
                `}case"number":{if(!Boolean(n.unit||n.units&&n.units.length>0))return ot`
                        <input
                            class="entry-row-value-output"    
                            type="number"
                            .value=${String(this._coerceNumber(e,n.min??0))}
                            min=${n.min??""}
                            max=${n.max??""}
                            step=${n.step??1}
                            @input=${e=>t(Number(e.target.value))}
                            ?disabled=${this.disabled}
                        />
                    `;const i=this._valueUnit??n.unit??(null==(s=n.units)?void 0:s[0])??"px",o=n.units??(n.unit?[n.unit]:["px"]);return ot`
                    <sm-number-input
                        class="entry-row-value-output"    
                        .value=${this._coerceNumber(e,n.min??0)}
                        min=${n.min??""}
                        max=${n.max??""}
                        step=${n.step??1}
                        .unit=${i}
                        .units=${o}
                        @change=${e=>t(e.detail.value,e.detail.unit)}
                    ></sm-number-input>
                `}default:return dt}}_handleTemplateChange(e){this._template=e.target.value,this._emitChange(),this._updateTemplatePreview()}_updateTemplatePreview(){var e;if(!this.hass||"template"!==this._mode)return this._templateError=void 0,void this._disposeTemplateSession();const t=null==(e=this._template)?void 0:e.trim();if(!t)return this._templateError=void 0,void this._disposeTemplateSession();const i=this._buildTemplateVariables();this._getTemplateSession().update({template:t,variables:i,reportErrors:!0,debounceMs:250})}_buildTemplateVariables(){const e=this._getEntityState(),t=this._getTemplateValue(e);return H(e,t)}_getTemplateValue(e){if(e)return"state"===this._valueSource?e.state:"last_changed"===this._valueSource?e.last_changed:"last_updated"===this._valueSource?e.last_updated:(e.attributes||{})[this._valueSource]}_getTemplateSession(){return this._templateSession||(this._templateSession=new q(this.hass,{onResult:()=>{this._templateError=void 0,this.requestUpdate()},onError:e=>{this._templateError=e.error,this.requestUpdate()}})),this._templateSession}_disposeTemplateSession(){this._templateSession&&(this._templateSession.dispose(),this._templateSession=void 0)}_renderEntitySourceSection(){return ot`
            <div class="section">
                <div class="section-title">Entity Source</div>
                <entity-config-editor
                    .config=${this._entityConfig}
                    .hass=${this.hass}
                    .block=${this.block}
                    .resolvedInfo=${this._resolvedEntityInfo}
                    .slots=${this.slots}
                    ?disabled=${this.disabled}
                    @config-changed=${this._handleEntityConfigChange}
                    @manage-entities-slots=${this._handleManageSlots}
                ></entity-config-editor>
            </div>
        `}_renderValueSourceSection(){const e=!!this._effectiveEntityId,t="state"!==this._valueSource,i=t&&this._availableAttributes.length>0&&!this._availableAttributes.includes(this._valueSource),o=i?"__custom__":this._valueSource;return ot`
            <div class="section">
                <div class="section-title">Value Source</div>
                <div class="row">
                    <label>Source</label>
                    <select
                        .value=${t?"attribute":"state"}
                        @change=${this._handleValueSourceTypeChange}
                        ?disabled=${this.disabled||!e}
                    >
                        <option value="state">State</option>
                        <option value="attribute">Attribute</option>
                    </select>
                </div>
                ${t?ot`
                    <div class="row" style="margin-top: 8px;">
                        <label>Attribute</label>
                        <select
                            .value=${o}
                            @change=${this._handleAttributeChange}
                            ?disabled=${this.disabled}
                        >
                            ${this._availableAttributes.length>0?this._availableAttributes.map(e=>ot`
                                    <option value=${e} ?selected=${this._valueSource===e}>${e}</option>
                                `):dt}
                            <option value="__custom__" ?selected=${i}>Custom...</option>
                        </select>
                    </div>
                    ${i?ot`
                        <div class="row" style="margin-top: 8px;">
                            <label>Custom</label>
                            <input
                                type="text"
                                .value=${this._valueSource}
                                @input=${this._handleCustomAttributeInput}
                                placeholder="Enter attribute name"
                                ?disabled=${this.disabled}
                            />
                        </div>
                    `:dt}
                `:dt}
            </div>
        `}_renderModeButton(e,t){return ot`
            <button
                    class="mode-btn ${this._mode===e?"active":""}"
                    @click=${()=>this._handleModeChange(e)}
                    ?disabled=${this.disabled}
            >
                ${t}
            </button>
        `}_renderModeConfig(){switch(this._mode){case"direct":return this._renderDirectConfig();case"map":return this._renderMapConfig();case"threshold":return this._renderThresholdConfig();case"template":return this._renderTemplateConfig();default:return dt}}_renderDirectConfig(){return ot`
            <div class="section">
                <div class="section-title">Range Mapping</div>
                <div class="checkbox-row">
                    <input
                            type="checkbox"
                            id="range-toggle"
                            .checked=${this._useRangeMapping}
                            @change=${this._toggleRangeMapping}
                            ?disabled=${this.disabled}
                    />
                    <label for="range-toggle">Enable range mapping</label>
                </div>
                ${this._useRangeMapping?ot`
                    <div class="range-inputs" style="margin-top: 8px;">
                        <div class="range-group">
                            <label>Input Range</label>
                            <div class="row">
                                <input
                                        type="number"
                                        .value=${String(this._inputRange[0])}
                                        @input=${e=>this._updateRange("input",0,Number(e.target.value))}
                                        ?disabled=${this.disabled}
                                />
                                <span>to</span>
                                <input
                                        type="number"
                                        .value=${String(this._inputRange[1])}
                                        @input=${e=>this._updateRange("input",1,Number(e.target.value))}
                                        ?disabled=${this.disabled}
                                />
                            </div>
                        </div>
                        <div class="range-group">
                            <label>Output Range</label>
                            <div class="row">
                                <input
                                        type="number"
                                        .value=${String(this._outputRange[0])}
                                        @input=${e=>this._updateRange("output",0,Number(e.target.value))}
                                        ?disabled=${this.disabled}
                                />
                                <span>to</span>
                                <input
                                        type="number"
                                        .value=${String(this._outputRange[1])}
                                        @input=${e=>this._updateRange("output",1,Number(e.target.value))}
                                        ?disabled=${this.disabled}
                                />
                            </div>
                        </div>
                    </div>
                `:dt}
            </div>
        `}_renderMapConfig(){const e=this._stateOptions;return ot`
            <div class="section section-map">
                <div class="section-title">Value Mapping</div>
                <div class="entries-list">
                    ${this._mapEntries.map((t,i)=>ot`
                        <div class="entry-row">
                            ${e&&e.length>0?ot`
                                <select
                                    class="entry-row-value-input entry-row-map-input"    
                                    .value=${t.key}
                                    @change=${e=>this._updateMapEntryKey(i,e.target.value)}
                                    ?disabled=${this.disabled}
                                >
                                    <option value="" ?selected=${""===t.key} disabled>Select state</option>
                                    ${e.map(e=>ot`
                                        <option value=${e} ?selected=${t.key===e}>${e}</option>
                                    `)}
                                </select>
                            `:ot`
                                <input
                                    type="text"
                                    class="entry-row-value-input entry-row-map-input"
                                    .value=${t.key}
                                    @input=${e=>this._updateMapEntryKey(i,e.target.value)}
                                    placeholder="State value"
                                    ?disabled=${this.disabled}
                                />
                            `}
                            <span class="entry-row-map-separator">→</span>
                            ${this._renderValueInput(t.value,(e,t)=>this._updateMapEntryValue(i,e,t),"Output value")}
                            <button
                                class="entry-row-delete icon-btn danger"
                                @click=${()=>this._removeMapEntry(i)}
                                ?disabled=${this.disabled}
                            >×
                            </button>
                        </div>
                    `)}
                    <button class="add-btn entry-row-add" @click=${this._addMapEntry} ?disabled=${this.disabled}>
                        + Add Mapping
                    </button>
                </div>
            </div>
        `}_renderThresholdConfig(){return ot`
            <div class="section section-thresholds">
                <div class="section-title">Thresholds</div>
                <div class="entries-list">
                    ${this._thresholds.map((e,t)=>ot`
                        <div class="entry-row">
                            <input
                                type="number"
                                class="entry-row-value-input entry-row-threshold-input entry-row-threshold-input-min"
                                .value=${String(e.min??"")}
                                @input=${e=>this._updateThreshold(t,"min",Number(e.target.value))}
                                placeholder="Min"
                                style="width: 60px; flex: none;"
                                ?disabled=${this.disabled}
                            />
                            <span class="entry-row-threshold-minmax-separator">≤ X <</span>
                            <input
                                type="number"
                                class="entry-row-value-input entry-row-threshold-input entry-row-threshold-input-max"
                                .value=${String(e.max??"")}
                                @input=${e=>this._updateThreshold(t,"max",Number(e.target.value))}
                                placeholder="Max"
                                style="width: 60px; flex: none;"
                                ?disabled=${this.disabled}
                            />
                            <span class="entry-row-threshold-separator">→</span>
                            ${this._renderValueInput(e.value,(e,i)=>this._updateThresholdValue(t,e,i),"Output")}
                            <button
                                class="icon-btn danger entry-row-delete"
                                @click=${()=>this._removeThreshold(t)}
                                ?disabled=${this.disabled}
                            >×
                            </button>
                        </div>
                    `)}
                    <button class="add-btn entry-row-add" @click=${this._addThreshold} ?disabled=${this.disabled}>
                        + Add Threshold
                    </button>
                </div>
            </div>
        `}_renderTemplateConfig(){return ot`
            <div class="section section-template">
                <div class="section-title">Template</div>
                <textarea
                        .value=${this._template}
                        @input=${this._handleTemplateChange}
                        placeholder="{{value | round(2)}}px"
                        ?disabled=${this.disabled}
                ></textarea>
                <div class="template-legend">
                    ${Y.map(e=>ot`
                        <div class="template-legend-row">
                            <code>{{${e.key}}}</code>
                            <span>${e.description}</span>
                        </div>
                    `)}
                </div>
                ${this._templateError?ot`<div class="template-error">${this._templateError}</div>`:dt}
            </div>
        `}};Tr.styles=et`
        .section {
            margin-bottom: 25px;
        }

        .section:last-child {
            margin-bottom: 0;
        }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--text-secondary, #666);
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px solid var(--border-color);
        }

        .row {
            display: flex;
            gap: 8px;
            align-items: stretch;
            margin-bottom: 8px;
        }
        
        .row > label {
            align-self: center;
        }

        .row:last-child {
            margin-bottom: 0;
        }

        label {
            font-size: 13px;
            color: var(--text-primary, #333);
            min-width: 70px;
        }

        input, select, textarea {
            flex: 1;
            box-sizing: border-box;
            padding: 6px 8px;
            border: 1px solid var(--border-color, #d4d4d4);
            border-radius: 3px;
            background: var(--bg-primary, #fff);
            color: var(--text-primary, #333);
            font-size: 13px;
            font-family: inherit;
            min-width: 0;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--accent-color, #0078d4);
        }

        textarea {
            font-size: 13px;
            min-height: 60px;
            resize: vertical;
            width: 100%;
        }

        .mode-selector {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
        }

        .mode-btn {
            flex: 1;
            padding: 4px 10px;
            border: 1px solid var(--border-color, #d4d4d4);
            border-radius: 3px;
            background: var(--bg-primary, #fff);
            color: var(--text-primary, #333);
            font-size: 13px;
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .mode-btn:hover {
            background: var(--bg-secondary, #f5f5f5);
        }

        .mode-btn.active {
            background: var(--accent-color, #0078d4);
            border-color: var(--accent-color, #0078d4);
            color: white;
            font-weight: bold;
        }

        .entries-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .entry-row {
            display: flex;
            gap: 6px;
            align-items: stretch;
        }

        .entry-row input {
            flex: 1;
        }

        .entry-row select {
            flex: 1;
        }
        
        .entry-row-value-input {
            min-width: initial;
        }
        .entry-row-map-separator,
        .entry-row-threshold-separator,
        .entry-row-threshold-minmax-separator {
            align-self: center;
        }
        .entry-row-threshold-minmax-separator {
            white-space: nowrap;
        }
        .entry-row-value-output {
            min-width: 0;
        }

        .entry-row sm-number-input,
        .entry-row sm-slider-input,
        .entry-row sm-color-input,
        .entry-row sm-select-input,
        .entry-row sm-spacing-input,
        .default-input sm-number-input,
        .default-input sm-slider-input,
        .default-input sm-color-input,
        .default-input sm-select-input,
        .default-input sm-spacing-input {
            flex: 1;
        }

        .default-input {
            flex: 1;
        }

        .icon-btn {
            padding: 4px 8px;
            border: 1px solid var(--border-color, #d4d4d4);
            border-radius: 3px;
            background: var(--bg-primary, #fff);
            color: var(--text-secondary, #666);
            cursor: pointer;
            font-size: 14px;
            line-height: 1;
        }

        .icon-btn:hover {
            background: var(--bg-secondary, #f5f5f5);
        }

        .icon-btn.danger:hover {
            background: #fee;
            border-color: #f88;
            color: #c00;
        }

        .icon-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .add-btn {
            align-items: center;
            padding: 6px 10px;
            border: 1px dashed var(--border-color, #d4d4d4);
            border-radius: 3px;
            background: transparent;
            color: var(--text-secondary, #666);
            font-size: 12px;
            cursor: pointer;
        }

        .add-btn:hover {
            border-color: var(--accent-color, #0078d4);
            color: var(--accent-color, #0078d4);
        }

        .checkbox-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .checkbox-row input[type="checkbox"] {
            width: auto;
            flex: none;
        }

        .range-inputs {
            gap: 8px;
            display: flex;
            flex-direction: column;
        }

        .range-group label {
            display: block;
            margin-bottom: 4px;
        }


        .attribute-select {
            margin-top: 4px;
        }

        .template-legend {
            margin-top: 6px;
            padding: 6px 8px;
            background: var(--secondary-background-color, #f5f5f5);
            border-radius: 4px;
            font-size: 10px;
            color: var(--text-secondary, #666);
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .template-legend-row {
            display: flex;
            align-items: baseline;
            gap: 6px;
        }

        .template-legend-row code {
            font-family: monospace;
            font-size: 10px;
            color: var(--primary-text-color, #333);
        }

        .template-error {
            margin-top: 4px;
            font-size: 10px;
            color: var(--error-color, #d32f2f);
            white-space: pre-wrap;
        }
    `,Cr([tt({attribute:!1})],Tr.prototype,"hass",2),Cr([tt({type:Object})],Tr.prototype,"block",2),Cr([tt({attribute:!1})],Tr.prototype,"binding",2),Cr([tt({type:String})],Tr.prototype,"defaultEntityId",2),Cr([tt({attribute:!1})],Tr.prototype,"slots",2),Cr([tt({type:Boolean})],Tr.prototype,"disabled",2),Cr([tt({attribute:!1})],Tr.prototype,"valueInputConfig",2),Cr([st()],Tr.prototype,"_entityConfig",2),Cr([st()],Tr.prototype,"_resolvedEntityInfo",2),Cr([st()],Tr.prototype,"_valueSource",2),Cr([st()],Tr.prototype,"_availableAttributes",2),Cr([st()],Tr.prototype,"_stateOptions",2),Cr([st()],Tr.prototype,"_thresholdSupported",2),Cr([st()],Tr.prototype,"_valueUnit",2),Cr([st()],Tr.prototype,"_mode",2),Cr([st()],Tr.prototype,"_mapEntries",2),Cr([st()],Tr.prototype,"_thresholds",2),Cr([st()],Tr.prototype,"_template",2),Cr([st()],Tr.prototype,"_templateError",2),Cr([st()],Tr.prototype,"_defaultValue",2),Cr([st()],Tr.prototype,"_defaultHasValue",2),Cr([st()],Tr.prototype,"_inputRange",2),Cr([st()],Tr.prototype,"_outputRange",2),Cr([st()],Tr.prototype,"_useRangeMapping",2),Tr=Cr([rt("property-binding-editor")],Tr);var Br=Object.defineProperty,Rr=Object.getOwnPropertyDescriptor,Dr=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Rr(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Br(t,i,a),a};let Or=class extends it{constructor(){super(...arguments),this.props={},this.bindingEditorOpen=!1,this.bindingEditorTarget=null,this.slots=[],this.templateErrors={},this.templateSessions=new Map,this._handleSlotsChanged=()=>{var e;this.slots=(null==(e=this.documentModel)?void 0:e.getSlotEntities())??[],this.requestUpdate()}}connectedCallback(){super.connectedCallback(),this.documentModel&&(this.slots=this.documentModel.getSlotEntities(),this.documentModel.addEventListener("slots-changed",this._handleSlotsChanged))}disconnectedCallback(){var e;super.disconnectedCallback(),null==(e=this.documentModel)||e.removeEventListener("slots-changed",this._handleSlotsChanged),this._disposeTemplateSessions()}render(){if(!this.config||!this.config.groups||0===this.config.groups.length)return ot`
                <div class="empty-state">
                    No editable properties available for this element
                </div>
            `;const e=this.config.groups.filter(e=>this._isGroupVisible(e));return 0===e.length?ot`
                <div class="empty-state">
                    No editable properties available for this element
                </div>
            `:ot`
            <div
                    class="traits-container"
                    @property-binding-edit=${this._handleBindingEdit}
                    @property-binding-change=${this._handleBindingChange}
            >
                ${e.map(e=>this._renderGroup(e))}
            </div>
            ${this._renderBindingEditorOverlay()}
        `}openBindingEditor(e){const t=this._findTraitByName(e);(null==t?void 0:t.binding)&&(this.bindingEditorTarget={name:e,label:t.label},this.bindingEditorOpen=!0)}updated(e){var t,i;e.has("block")&&(null==(t=e.get("block"))?void 0:t.id)!==(null==(i=this.block)?void 0:i.id)&&(this._closeBindingEditor(!0),this._disposeTemplateSessions(),this.templateErrors={}),e.has("hass")&&(this._disposeTemplateSessions(),this.templateErrors={}),(e.has("props")||e.has("block")||e.has("hass"))&&this._syncTemplateSessions()}_isGroupVisible(e){const t=this._getVisibilityContext();return wr.evaluate(e.visible,t)}_isTraitVisible(e){const t=this._getVisibilityContext();return wr.evaluate(e.visible,t)}_getVisibilityContext(){var e,t,i;return{props:this._getRawProps(),blockContext:{parentManaged:null==(e=this.block)?void 0:e.parentManaged,type:null==(t=this.block)?void 0:t.type,id:null==(i=this.block)?void 0:i.id}}}_renderGroup(e){const t=e.traits.filter(e=>this._isTraitVisible(e));return 0===t.length?dt:ot`
            <property-group
                    .label=${e.label}
                    .groupId=${e.id}
                    ?collapsed=${e.collapsed??!1}
            >
                ${t.map(e=>this._renderTrait(e))}
            </property-group>
        `}_renderTrait(e){const t=this._getTraitPropertyValue(e.name),i={hass:this.hass,block:this.block,props:this.props,actionHandlers:this.actionHandlers,defaultEntityId:this.defaultEntityId,documentModel:this.documentModel,templateErrors:this.templateErrors};return kr.render(e,t,this._handleTraitChange.bind(this),i)}_handleTraitChange(e,t){this._updateTemplateSession(e,t),this.dispatchEvent(new CustomEvent("trait-changed",{detail:{name:e,value:t},bubbles:!0,composed:!0}))}_syncTemplateSessions(){var e;const t=(null==(e=this.config)?void 0:e.groups)??[],i=new Set;for(const o of t)for(const e of o.traits){if(!this._isTraitVisible(e))continue;const t=this._getRawPropValue(e.name);this._updateTemplateSession(e.name,t,e)&&i.add(e.name)}for(const o of this.templateSessions.keys())i.has(o)||(this._disposeTemplateSession(o),this._clearTemplateError(o))}_updateTemplateSession(e,t,i){if(!this.hass||!this.block)return!1;const o=i??this._findTraitByName(e);if(!o)return!1;const r=this._extractTemplateInfo(o,t);if(!r)return this._clearTemplateError(e),this._disposeTemplateSession(e),!1;return this._getTemplateSession(e).update({template:r.template,variables:r.variables,reportErrors:!0,debounceMs:250}),!0}_extractTemplateInfo(e,t){const i=this._getTemplateString(e,t);if(!i)return null;return{template:i,variables:this._buildTemplateVariables(e)}}_getTemplateString(e,t){const i=e.templateKeywords;return i&&i.length>0?null==t?"":String(t):null}_buildTemplateVariables(e){var t,i,o,r,a;const s=null==(t=this.documentModel)?void 0:t.resolveEntityForBlock(this.block.id).entityId,n=s?null==(o=null==(i=this.hass)?void 0:i.states)?void 0:o[s]:void 0;let l=null==n?void 0:n.state;const d=this._getRawPropValue("attributeName");d&&(null==n?void 0:n.attributes)&&(l=n.attributes[String(d)]);const c=H(n,l);if("customName"===e.name){const e=(null==(r=null==n?void 0:n.attributes)?void 0:r.friendly_name)||s;c.name=e,c.value=e}if("customState"===e.name){const e=(null==(a=null==n?void 0:n.attributes)?void 0:a.friendly_name)||s;c.name=e}return c}_getRawPropValue(e){const t=this.props[e];return t&&"object"==typeof t&&"value"in t?t.value:t}_getTemplateSession(e){let t=this.templateSessions.get(e);return t||(t=new q(this.hass,{onResult:()=>this._clearTemplateError(e),onError:t=>this._setTemplateError(e,t.error)}),this.templateSessions.set(e,t)),t}_disposeTemplateSession(e){const t=this.templateSessions.get(e);t&&(t.dispose(),this.templateSessions.delete(e))}_disposeTemplateSessions(){for(const e of this.templateSessions.values())e.dispose();this.templateSessions.clear()}_setTemplateError(e,t){this.templateErrors[e]!==t&&(this.templateErrors={...this.templateErrors,[e]:t})}_clearTemplateError(e){if(!this.templateErrors[e])return;const t={...this.templateErrors};delete t[e],this.templateErrors=t}_handleBindingEdit(e){if("props"!==e.detail.category)return;const t=this._findTraitByName(e.detail.property);(null==t?void 0:t.binding)&&(this.bindingEditorTarget={name:e.detail.property,label:e.detail.label},this.bindingEditorOpen=!0)}_handleBindingChange(e){"props"===e.detail.category&&this.dispatchEvent(new CustomEvent("trait-binding-changed",{detail:{name:e.detail.property,binding:e.detail.binding},bubbles:!0,composed:!0}))}_closeBindingEditor(e=!1){this.bindingEditorOpen=!1,e&&(this.bindingEditorTarget=null)}_getTraitPropertyValue(e){const t=this.props[e];if(!t||"object"!=typeof t)return;return"value"in t||"binding"in t?t:void 0}_getRawProps(){const e={};for(const[t,i]of Object.entries(this.props))e[t]=i&&"object"==typeof i&&"value"in i?i.value:i;return e}_findTraitByName(e){var t;const i=(null==(t=this.config)?void 0:t.groups)??[];for(const o of i){const t=o.traits.find(t=>t.name===e);if(t)return t}}_renderBindingEditorOverlay(){if(!this.bindingEditorTarget)return dt;const e=this._findTraitByName(this.bindingEditorTarget.name);if(!(null==e?void 0:e.binding))return dt;const t=this._getTraitPropertyValue(this.bindingEditorTarget.name),i=null==t?void 0:t.binding;return ot`
            <property-binding-editor-overlay
                    .open=${this.bindingEditorOpen}
                    .hass=${this.hass}
                    .label=${this.bindingEditorTarget.label}
                    .category=${"props"}
                    .propertyName=${this.bindingEditorTarget.name}
                    .block=${this.block}
                    .binding=${i}
                    .defaultEntityId=${this.defaultEntityId}
                    .slots=${this.slots}
                    .valueInputConfig=${e.binding}
                    @property-binding-change=${this._handleBindingChange}
                    @overlay-close=${()=>this._closeBindingEditor()}
            ></property-binding-editor-overlay>
        `}};Or.styles=et`
        :host {
            display: block;
        }

        .traits-container {
            display: flex;
            flex-direction: column;
        }

        .empty-state {
            padding: 16px;
            text-align: center;
            color: var(--secondary-text-color, #666);
            font-size: 12px;
            font-style: italic;
        }

        /* Property row styles - used by trait renderers */

        .property-row {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .property-row.property-row-inline {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }

        .property-label {
            font-size: 11px;
            font-weight: 500;
            color: var(--secondary-text-color, #666);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .property-input {
            width: 100%;
            padding: 8px 10px;
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 4px;
            font-size: 13px;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color, #333);
            box-sizing: border-box;
            transition: border-color 0.15s ease;
        }

        .media-picker-row {
            gap: 6px;
        }

        .media-picker {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .media-chip {
            padding: 6px 10px;
            border-radius: 8px;
            background: var(--secondary-background-color, #f5f5f5);
            border: 1px solid var(--divider-color, #e0e0e0);
            font-size: 12px;
            color: var(--primary-text-color, #333);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .media-picker-actions {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }

        .media-action-btn {
            border: 1px solid var(--divider-color, #d4d4d4);
            background: var(--card-background-color, #fff);
            color: var(--text-primary, #333);
            border-radius: 4px;
            padding: 6px 10px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .media-action-btn.primary {
            background: var(--primary-color, #03a9f4);
            color: var(--text-primary-color, #fff);
            border-color: transparent;
        }

        .media-action-btn.danger {
            border: 1px solid rgba(211, 47, 47, 0.4);
            background: rgba(211, 47, 47, 0.1);
            color: #b71c1c;
        }

        .property-input:focus {
            outline: none;
            border-color: var(--primary-color, #03a9f4);
        }

        .property-input[type="number"] {
            width: 100%;
        }

        .property-input[type="range"] {
            width: 100%;
            padding: 0;
            border: none;
            height: 4px;
            border-radius: 999px;
            background: var(--divider-color, #e0e0e0);
        }

        .slider-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .slider-value {
            min-width: 42px;
            text-align: right;
            font-size: 12px;
            color: var(--secondary-text-color, #666);
        }

        .property-input[type="color"] {
            width: 100%;
            height: 36px;
            cursor: pointer;
            padding: 4px;
        }

        .property-input[type="checkbox"] {
            width: auto;
        }

        select.property-input {
            cursor: pointer;
        }

        textarea.property-input {
            min-height: 60px;
            resize: vertical;
            font-family: inherit;
        }

        /* Template support styles */

        .property-with-template {
            display: flex;
            gap: 4px;
            align-items: flex-start;
        }

        .property-with-template .property-input {
            flex: 1;
        }

        .template-toggle {
            padding: 6px 8px;
            background: var(--secondary-background-color, #f5f5f5);
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            white-space: nowrap;
            transition: all 0.2s;
        }

        .template-toggle:hover {
            background: var(--primary-color, #03a9f4);
            color: white;
        }

        .template-toggle.active {
            background: var(--accent-color, #ff9800);
            color: white;
            border-color: var(--accent-color, #ff9800);
        }

        .template-textarea {
            width: 100%;
            min-height: 60px;
            font-family: monospace;
            font-size: 12px;
            resize: vertical;
        }

        .template-legend {
            margin-top: 4px;
            padding: 6px 8px;
            background: var(--secondary-background-color, #f5f5f5);
            border-radius: 4px;
            font-size: 10px;
            color: var(--text-secondary, #666);
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .template-legend-row {
            display: flex;
            align-items: baseline;
            gap: 6px;
        }

        .template-legend-row code {
            font-family: monospace;
            font-size: 10px;
            color: var(--primary-text-color, #333);
        }

        .template-error {
            margin-top: 4px;
            font-size: 10px;
            color: var(--error-color, #d32f2f);
            white-space: pre-wrap;
        }

        /* Entity mode toggle styles */

        .entity-mode-toggle {
            display: flex;
            gap: 8px;
            margin-top: 8px;
            padding: 8px;
            background: var(--secondary-background-color, #f5f5f5);
            border-radius: 4px;
            align-items: center;
        }

        .entity-mode-label {
            font-size: 11px;
            opacity: 0.7;
            margin-right: auto;
        }

        .toggle-switch {
            position: relative;
            width: 40px;
            height: 20px;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: 0.3s;
            border-radius: 20px;
        }

        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
        }

        .toggle-switch input:checked + .toggle-slider {
            background-color: var(--primary-color, #03a9f4);
        }

        .toggle-switch input:checked + .toggle-slider:before {
            transform: translateX(20px);
        }

        .slot-info {
            font-size: 10px;
            opacity: 0.6;
            margin-top: 4px;
            font-style: italic;
        }

        /* Info display styles */

        .property-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 8px;
            background: var(--secondary-background-color, #f5f5f5);
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
        }

        .info-text {
            font-size: 10px;
            opacity: 0.6;
            font-style: italic;
            font-family: var(--font-family, sans-serif), sans-serif;
        }

        /* Action button styles */

        .edit-grid-button {
            width: 100%;
            padding: 10px 16px;
            background: var(--accent-color, #2196f3);
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.15s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .edit-grid-button:hover {
            background: var(--accent-dark, #1976d2);
        }

        .action-icon {
            font-size: 14px;
        }
    `,Dr([pt({context:s})],Or.prototype,"documentModel",2),Dr([tt({attribute:!1})],Or.prototype,"config",2),Dr([tt({attribute:!1})],Or.prototype,"props",2),Dr([tt({attribute:!1})],Or.prototype,"block",2),Dr([tt({attribute:!1})],Or.prototype,"hass",2),Dr([tt({attribute:!1})],Or.prototype,"actionHandlers",2),Dr([tt({type:String})],Or.prototype,"defaultEntityId",2),Dr([st()],Or.prototype,"bindingEditorOpen",2),Dr([st()],Or.prototype,"bindingEditorTarget",2),Dr([st()],Or.prototype,"slots",2),Dr([st()],Or.prototype,"templateErrors",2),Or=Dr([rt("traits-panel")],Or);var Ar=Object.defineProperty,zr=(e,t,i,o)=>{for(var r,a=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(t,i,a)||a);return a&&Ar(t,i,a),a};const Lr=class extends Ii{constructor(){super(...arguments),this.selectedBlock=null,this.resolvedEntityInfo=null,this.pendingBlockId="",this.blockIdError=null,this.idDirty=!1,this.pendingMediaRequestId=null,this.pendingMediaTarget=null,this.gridEditorOpen=!1,this.linkEditorOpen=!1,this.gridEditorBlockId=null,this.linkEditorBlockId=null,this.gaugeThresholdsEditorOpen=!1,this.gaugeThresholdsBlockId=null,this.chartEditorOpen=!1,this.chartEditorBlockId=null,this._handleGridEditorOpen=e=>{var t;const i=(null==e?void 0:e.blockId)??(null==(t=this.selectedBlock)?void 0:t.id)??null;if(!i)return;const o=this.documentModel.getBlock(i);o&&"block-grid"===o.type&&(this.gridEditorBlockId=i,this.gridEditorOpen=!0,this.overlayHost.invalidateOverlays())},this._handleGridEditorClose=()=>{this._closeGridEditor()},this._handleLinkEditorOpen=e=>{const t=(null==e?void 0:e.blockId)??this.documentModel.getLinkModeState().activeLinkId??null;if(!t)return;const i=this.documentModel.getBlock(t);i&&"block-link"===i.type&&(this.documentModel.select(t),this.linkEditorBlockId=t,this.linkEditorOpen=!0,this.overlayHost.invalidateOverlays())},this._handleLinkEditorClose=()=>{this.linkEditorOpen=!1,this.linkEditorBlockId=null,this.overlayHost.invalidateOverlays()},this._closeGridEditor=()=>{this.gridEditorOpen=!1,this.gridEditorBlockId=null,this.overlayHost.invalidateOverlays()},this._closeLinkEditor=()=>{var e;null==(e=this.linkModeController)||e.closeEditor()},this._closeGaugeThresholdsEditor=()=>{this.gaugeThresholdsEditorOpen=!1,this.gaugeThresholdsBlockId=null,this.overlayHost.invalidateOverlays()},this._closeChartEditor=()=>{this.chartEditorOpen=!1,this.chartEditorBlockId=null,this.overlayHost.invalidateOverlays()},this._applyGridConfig=e=>{const{config:t}=e.detail;this.gridEditorBlockId&&(this.documentModel.updateBlock(this.gridEditorBlockId,{props:{gridConfig:t}}),this._closeGridEditor())},this._applyGaugeThresholds=e=>{var t;if(!this.gaugeThresholdsBlockId)return;const i=this.documentModel.getBlock(this.gaugeThresholdsBlockId);if(!i)return;const o=null==(t=i.props)?void 0:t.thresholds,r={value:e.detail.thresholds,binding:null==o?void 0:o.binding};this.documentModel.updateBlock(this.gaugeThresholdsBlockId,{props:{thresholds:r}}),this._closeGaugeThresholdsEditor()},this._applyChartConfig=e=>{this.chartEditorBlockId&&(this.documentModel.updateBlock(this.chartEditorBlockId,{props:{chartConfig:e.detail.config}}),this._closeChartEditor())}}connectedCallback(){super.connectedCallback(),this.overlayHost.registerOverlay("grid-editor",()=>this._renderGridEditorOverlay()),this.overlayHost.registerOverlay("link-editor",()=>this._renderLinkEditorOverlay()),this.overlayHost.registerOverlay("gauge-thresholds-editor",()=>this._renderGaugeThresholdsEditorOverlay()),this.overlayHost.registerOverlay("chart-editor",()=>this._renderChartEditorOverlay()),this.documentModel.addEventListener("selection-changed",e=>{var t;const i=e.detail;this.selectedBlock=i.selectedBlock||null,this.pendingBlockId=(null==(t=this.selectedBlock)?void 0:t.id)||"",this.blockIdError=null,this.idDirty=!1,this.pendingMediaRequestId=null,this.pendingMediaTarget=null,this._updateResolvedEntityInfo()}),this.documentModel.addEventListener("block-updated",e=>{const t=e.detail;this.selectedBlock&&t.block.id===this.selectedBlock.id&&(this.selectedBlock={...t.block},this._updateResolvedEntityInfo(),this.idDirty||(this.pendingBlockId=t.block.id)),this.gridEditorBlockId!==t.block.id&&this.linkEditorBlockId!==t.block.id||this.overlayHost.invalidateOverlays(),this.gaugeThresholdsBlockId===t.block.id&&this.overlayHost.invalidateOverlays(),this.chartEditorBlockId===t.block.id&&this.overlayHost.invalidateOverlays()}),this.documentModel.addEventListener("block-deleted",e=>{const t=e.detail;(null==t?void 0:t.blockId)&&(this.gridEditorBlockId===t.blockId&&this._closeGridEditor(),this.linkEditorBlockId===t.blockId&&this._closeLinkEditor(),this.gaugeThresholdsBlockId===t.blockId&&this._closeGaugeThresholdsEditor(),this.chartEditorBlockId===t.blockId&&this._closeChartEditor())}),this.eventBus.addEventListener("grid-editor-open",this._handleGridEditorOpen),this.eventBus.addEventListener("grid-editor-close",this._handleGridEditorClose),this.eventBus.addEventListener("link-editor-open",this._handleLinkEditorOpen),this.eventBus.addEventListener("link-editor-close",this._handleLinkEditorClose),this.eventBus.addEventListener("media-manager-selected",e=>{var t;if(!e||e.requestId!==this.pendingMediaRequestId||!this.pendingMediaTarget)return;this.pendingMediaRequestId=null;const{prop:i,sourceProp:o,sourceValue:r}=this.pendingMediaTarget;this.pendingMediaTarget=null,(null==(t=e.selection)?void 0:t.reference)&&(this._updatePropWithBinding(i,e.selection.reference),o&&this._updatePropWithBinding(o,r??"media"))}),this.eventBus.addEventListener("media-manager-cancelled",e=>{e&&e.requestId===this.pendingMediaRequestId&&(this.pendingMediaRequestId=null,this.pendingMediaTarget=null)})}disconnectedCallback(){this.overlayHost.unregisterOverlay("grid-editor"),this.overlayHost.unregisterOverlay("link-editor"),this.overlayHost.unregisterOverlay("gauge-thresholds-editor"),this.overlayHost.unregisterOverlay("chart-editor"),this.eventBus.removeEventListener("grid-editor-open",this._handleGridEditorOpen),this.eventBus.removeEventListener("grid-editor-close",this._handleGridEditorClose),this.eventBus.removeEventListener("link-editor-open",this._handleLinkEditorOpen),this.eventBus.removeEventListener("link-editor-close",this._handleLinkEditorClose),super.disconnectedCallback()}render(){if(!this.selectedBlock)return ot`
                <div class="empty-state">
                    <ha-icon icon="mdi:tag-outline"></ha-icon>
                    <div>Select an element to edit its properties</div>
                </div>
            `;const e=this.blockRegistry.getBlock(this.selectedBlock.type),t=this.selectedBlock.id===this.documentModel.rootId?"Card":(null==e?void 0:e.label)||this.selectedBlock.type,i=this.pendingBlockId.trim()!==this.selectedBlock.id&&""!==this.pendingBlockId.trim(),o=this.selectedBlock.id===this.documentModel.rootId;return ot`
            <div class="info-row">
                <span class="info-label">Type</span>
                <span class="info-value">${t}</span>
            </div>
            
            ${o?dt:ot`
            <div class="block-meta">
                <div class="property-row">
                    <span class="property-label">Block name</span>
                    <input
                        class="property-input"
                        type="text"
                        .value=${this.selectedBlock.label||""}
                        placeholder="Optional name"
                        @change=${this._onBlockLabelChanged}
                    />
                </div>
                <div class="property-row">
                    <span class="property-label">Block ID</span>
                    <div class="id-row">
                        <input
                            class="property-input"
                            type="text"
                            .value=${this.pendingBlockId}
                            @input=${this._onBlockIdInput}
                        />
                        <button
                            class="id-apply"
                            ?disabled=${!i}
                            @click=${this._applyBlockId}
                        >
                            Apply
                        </button>
                    </div>
                    ${this.blockIdError?ot`<div class="id-error">${this.blockIdError}</div>`:dt}
                </div>
            </div>`}
            
            <!-- Entity Configuration Section -->
            ${this._renderEntityConfigSection()}
            
            <div class="panel-content">
                ${this._renderProperties()}
            </div>
        `}openTraitBindingEditor(e){var t,i;const o=null==(t=this.shadowRoot)?void 0:t.querySelector("traits-panel");null==(i=null==o?void 0:o.openBindingEditor)||i.call(o,e)}_updateResolvedEntityInfo(){this.selectedBlock?this.resolvedEntityInfo=this.documentModel.resolveEntityForBlock(this.selectedBlock.id):this.resolvedEntityInfo=null}_onBlockLabelChanged(e){if(!this.selectedBlock)return;const t=e.target.value.trim();this.documentModel.updateBlock(this.selectedBlock.id,{label:t||void 0})}_onBlockIdInput(e){const t=e.target;this.pendingBlockId=t.value,this.blockIdError=null,this.idDirty=!!this.selectedBlock&&this.pendingBlockId.trim()!==this.selectedBlock.id}_applyBlockId(){if(!this.selectedBlock)return;const e=this.documentModel.updateBlockId(this.selectedBlock.id,this.pendingBlockId);e.success?(this.pendingBlockId=this.pendingBlockId.trim(),this.blockIdError=null,this.idDirty=!1):this.blockIdError=e.error||"Unable to update ID"}_renderEntityConfigSection(){if(!this.selectedBlock)return dt;const e=this.selectedBlock.entityConfig||{mode:"inherited"};return ot`
            <div class="entity-config-section">
                <span class="section-title">Entity Configuration</span>
                <entity-config-editor
                    .block=${this.selectedBlock}    
                    .config=${e}
                    .resolvedInfo=${this.resolvedEntityInfo}
                    .hass=${this.hass}
                    @config-changed=${this._onEntityConfigChanged}
                    @select-source-block=${this._onSelectSourceBlock}
                ></entity-config-editor>
            </div>
        `}_renderProperties(){var e;if(!this.selectedBlock)return ot``;const t=this.documentModel.getElement(this.selectedBlock.id),i=null==t?void 0:t.getPanelConfig(),o=null==i?void 0:i.properties;return o?ot`
            <traits-panel
                .config=${o}
                .props=${this.selectedBlock.props||{}}
                .block=${this.selectedBlock}
                .hass=${this.hass}
                .defaultEntityId=${null==(e=this.resolvedEntityInfo)?void 0:e.entityId}
                .actionHandlers=${this._getActionHandlers()}
                @trait-changed=${this._onTraitChanged}
                @trait-binding-changed=${this._onTraitBindingChanged}
            ></traits-panel>
        `:ot`
                <div class="placeholder-text">
                    No editable properties available for this element
                </div>
            `}_getActionHandlers(){var e;const t=new Map([["open-grid-editor",()=>this._openGridEditor()],["open-link-editor",()=>this._openLinkEditor()],["open-gauge-thresholds-editor",()=>this._openGaugeThresholdsEditor()],["open-chart-editor",()=>this._openChartEditor()],["toggle-linear-shell-offset-editor",()=>this._toggleLinearShellOffsetEditor()]]),i=this._getPanelConfig(),o=(null==(e=null==i?void 0:i.properties)?void 0:e.groups)??[];for(const r of o)for(const e of r.traits??[])this._isMediaPickerTrait(e)&&(t.set(`media-picker-open:${e.name}`,()=>this._openMediaPicker(e)),t.set(`media-picker-clear:${e.name}`,()=>this._clearMediaPicker(e)));return t}_onTraitChanged(e){const{name:t,value:i}=e.detail,o=this._getTraitPropertyValue(t),r={value:i,binding:null==o?void 0:o.binding};this._updateProp(t,r)}_onTraitBindingChanged(e){if(!this.selectedBlock)return;const t=this._getTraitPropertyValue(e.detail.name),i={value:null==t?void 0:t.value,binding:e.detail.binding??void 0};this._updateProp(e.detail.name,i)}_getTraitPropertyValue(e){var t,i;const o=null==(i=null==(t=this.selectedBlock)?void 0:t.props)?void 0:i[e];if(!o||"object"!=typeof o)return;return"value"in o||"binding"in o?o:void 0}_getPanelConfig(){if(!this.selectedBlock)return;const e=this.documentModel.getElement(this.selectedBlock.id);return null==e?void 0:e.getPanelConfig()}_isMediaPickerTrait(e){return"media-picker"===e.type}_openMediaPicker(e){if(!this.eventBus)return;const t=`media-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;this.pendingMediaRequestId=t,this.pendingMediaTarget={prop:e.name,sourceProp:e.sourceProp,sourceValue:e.sourceValue},this.eventBus.dispatchEvent("media-manager-open",{mode:"select",requestId:t,title:"Select media",subtitle:"Choose or upload a file",confirmLabel:"Use media"})}_clearMediaPicker(e){this._updatePropWithBinding(e.name,"")}_updatePropWithBinding(e,t){const i=this._getTraitPropertyValue(e),o={value:t,binding:null==i?void 0:i.binding};this._updateProp(e,o)}_updateProp(e,t){this.selectedBlock&&this.documentModel.updateBlock(this.selectedBlock.id,{props:{[e]:t}})}_openGridEditor(){this.selectedBlock&&this.eventBus.dispatchEvent("grid-editor-open",{blockId:this.selectedBlock.id})}_openLinkEditor(){var e;this.selectedBlock&&"block-link"===this.selectedBlock.type&&(null==(e=this.linkModeController)||e.openEditor(this.selectedBlock.id))}_openGaugeThresholdsEditor(){this.selectedBlock&&(this.gaugeThresholdsBlockId=this.selectedBlock.id,this.gaugeThresholdsEditorOpen=!0,this.overlayHost.invalidateOverlays())}_openChartEditor(){this.selectedBlock&&(this.chartEditorBlockId=this.selectedBlock.id,this.chartEditorOpen=!0,this.overlayHost.invalidateOverlays())}_toggleLinearShellOffsetEditor(){var e;if(!this.selectedBlock)return;const t=!0===(null==(e=this._getTraitPropertyValue("shellVisualOffsetEditing"))?void 0:e.value);this._updatePropWithBinding("shellVisualOffsetEditing",!t)}_renderGridEditorOverlay(){var e;if(!this.gridEditorOpen||!this.gridEditorBlockId)return dt;const t=this._getGridBlock(),i=(null==(e=null==t?void 0:t.props)?void 0:e.gridConfig)||null;return t&&i?ot`
            <grid-editor-overlay
                .open=${this.gridEditorOpen}
                .config=${i}
                @overlay-cancel=${this._closeGridEditor}
                @overlay-apply=${this._applyGridConfig}
            ></grid-editor-overlay>
        `:dt}_renderLinkEditorOverlay(){const e=this._getLinkBlock();return e?ot`
            <link-editor-overlay
                .open=${this.linkEditorOpen}
                .block=${e}
                .controller=${this.linkModeController}
                @overlay-close=${this._closeLinkEditor}
            ></link-editor-overlay>
        `:dt}_renderGaugeThresholdsEditorOverlay(){if(!this.gaugeThresholdsEditorOpen||!this.gaugeThresholdsBlockId)return dt;const e=this.documentModel.getBlock(this.gaugeThresholdsBlockId);return e?ot`
            <gauge-thresholds-editor-overlay
                .open=${this.gaugeThresholdsEditorOpen}
                .thresholds=${this._getGaugeThresholds(e)}
                @overlay-cancel=${this._closeGaugeThresholdsEditor}
                @overlay-apply=${this._applyGaugeThresholds}
            ></gauge-thresholds-editor-overlay>
        `:dt}_renderChartEditorOverlay(){var e;if(!this.chartEditorOpen||!this.chartEditorBlockId)return dt;const t=this.documentModel.getBlock(this.chartEditorBlockId);if(!t)return dt;const i=this.documentModel.getElement(t),o=(null==i?void 0:i.getChartEditorTagName())||"chart-line-area-editor-overlay",r=mt(o);return ft`
            <${r}
                .open=${this.chartEditorOpen}
                .block=${t}
                .hass=${this.hass}
                .config=${null==(e=t.props)?void 0:e.chartConfig}
                @overlay-cancel=${this._closeChartEditor}
                @overlay-apply=${this._applyChartConfig}
            ></${r}>
        `}_getGridBlock(){return this.gridEditorBlockId?this.documentModel.getBlock(this.gridEditorBlockId)??null:null}_getLinkBlock(){return this.linkEditorBlockId?this.documentModel.getBlock(this.linkEditorBlockId)??null:null}_getGaugeThresholds(e){var t;const i=null==(t=e.props)?void 0:t.thresholds;return i&&"object"==typeof i?u(i.value):[]}_onEntityConfigChanged(e){this.selectedBlock&&this.documentModel.updateBlock(this.selectedBlock.id,{entityConfig:e.detail})}_onSelectSourceBlock(e){const{blockId:t}=e.detail;this.documentModel.select(t)}};Lr.styles=[...Ii.styles,et`
            .panel-content {
                padding: 0;
            }
            /* Entity Config Section */
            .entity-config-section {
                padding: 12px;
                background: var(--bg-secondary, #f9f9f9);
                border-bottom: 1px solid var(--border-color, #e0e0e0);
            }

            .section-title {
                display: block;
                margin-bottom: 12px;
                font-size: 11px;
                font-weight: 600;
                color: var(--text-primary, #333);
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }

            /* Overlay trigger styles */
            .edit-grid-button {
                width: 100%;
                padding: 10px 16px;
                background: var(--accent-color, #2196f3);
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.15s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .edit-grid-button:hover {
                background: var(--accent-dark, #1976d2);
            }

            .edit-grid-button::before {
                content: '⊞';
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: opacity 0.2s;
            }

            .block-meta {
                padding: 12px;
                border-bottom: 1px solid var(--border-color, #e0e0e0);
                background: var(--bg-secondary, #f9f9f9);
            }

            .id-row {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .id-apply {
                padding: 6px 10px;
                font-size: 11px;
                font-weight: 600;
                border: 1px solid var(--border-color, #e0e0e0);
                border-radius: 4px;
                background: var(--bg-primary, #fff);
                color: var(--text-primary, #333);
                cursor: pointer;
                transition: background 0.15s ease;
            }

            .id-apply:hover {
                background: var(--bg-tertiary, #f0f0f0);
            }

            .id-apply:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .id-error {
                margin-top: 4px;
                font-size: 10px;
                color: var(--error-color, #d32f2f);
            }
        `];let Nr=Lr;zr([pt({context:s})],Nr.prototype,"documentModel"),zr([pt({context:r})],Nr.prototype,"blockRegistry"),zr([pt({context:d})],Nr.prototype,"eventBus"),zr([pt({context:X})],Nr.prototype,"linkModeController"),zr([pt({context:ki})],Nr.prototype,"overlayHost"),zr([tt({attribute:!1})],Nr.prototype,"hass"),zr([st()],Nr.prototype,"selectedBlock"),zr([st()],Nr.prototype,"resolvedEntityInfo"),zr([st()],Nr.prototype,"pendingBlockId"),zr([st()],Nr.prototype,"blockIdError"),zr([st()],Nr.prototype,"idDirty"),zr([st()],Nr.prototype,"pendingMediaRequestId"),zr([st()],Nr.prototype,"pendingMediaTarget"),zr([st()],Nr.prototype,"gridEditorOpen"),zr([st()],Nr.prototype,"linkEditorOpen"),zr([st()],Nr.prototype,"gridEditorBlockId"),zr([st()],Nr.prototype,"linkEditorBlockId"),zr([st()],Nr.prototype,"gaugeThresholdsEditorOpen"),zr([st()],Nr.prototype,"gaugeThresholdsBlockId"),zr([st()],Nr.prototype,"chartEditorOpen"),zr([st()],Nr.prototype,"chartEditorBlockId"),er.define("panel-properties",Nr);const Fr=["layout","size","spacing","typography","background","border","svg","effects","flex","animations"],Vr={layout:["layout.display","layout.show","layout.overflow","layout.overflowX","layout.overflowY","layout.zIndex","layout.positionX","layout.positionY"],size:["size.width","size.height","size.minWidth","size.maxWidth","size.minHeight","size.maxHeight"],spacing:["spacing.margin","spacing.marginTop","spacing.marginRight","spacing.marginBottom","spacing.marginLeft","spacing.padding","spacing.paddingTop","spacing.paddingRight","spacing.paddingBottom","spacing.paddingLeft"],typography:["typography.color","typography.textAlign","typography.fontSize","typography.fontWeight","typography.fontFamily","typography.fontStyle","typography.lineHeight","typography.textTransform","typography.textDecoration","typography.textShadow","typography.letterSpacing","typography.whiteSpace"],background:["background.backgroundColor","background.backgroundImage","background.backgroundSize","background.backgroundPosition","background.backgroundRepeat","background.boxShadow","background.backgroundBlendMode"],border:["border.borderWidth","border.borderStyle","border.borderColor","border.borderRadius","border.borderTopWidth","border.borderRightWidth","border.borderBottomWidth","border.borderLeftWidth","border.borderTopLeftRadius","border.borderTopRightRadius","border.borderBottomRightRadius","border.borderBottomLeftRadius"],svg:["svg.stroke","svg.strokeWidth","svg.strokeLinecap","svg.strokeLinejoin","svg.strokeDasharray","svg.strokeDashoffset","svg.strokeMiterlimit","svg.strokeOpacity","svg.fill","svg.fillOpacity"],effects:["effects.opacity","effects.boxShadow","effects.filter","effects.backdropFilter","effects.mixBlendMode","effects.rotate"],echart:["echart.lineColor","echart.areaColor","echart.lineWidth","echart.lineSymbol","echart.lineSymbolSize","echart.barColor","echart.barBorderRadius","echart.pieSliceColor","echart.pieSliceBorderRadius","echart.pieLabelShow","echart.pieLabelPosition","echart.pieLabelLineShow","echart.pieLabelLineLength","echart.pieLabelLineLength2","echart.pieLabelLineSmooth","echart.pieLabelLineColor","echart.pieLabelLineWidth","echart.legendIcon","echart.legendIconSize"],flex:["flex.flexDirection","flex.flexWrap","flex.justifyContent","flex.alignItems","flex.alignContent","flex.gap","flex.rowGap","flex.columnGap","flex.flexGrow","flex.flexShrink","flex.flexBasis","flex.alignSelf","flex.order"],animations:["animations.motion"]},Ur={full:{groups:Fr,exclude:{groups:["svg"],properties:["display.show"]}},layout:{groups:Fr,exclude:{properties:["layout.display","flex.rowGap","flex.columnGap"]}},echart_text:{properties:["typography.color","typography.fontSize","typography.fontWeight","typography.textAlign"],editors:{"background.backgroundColor":{input:"echart-color",label:"Color"},"border.borderColor":{input:"echart-color",label:"Color"}}},echart_box:{properties:["background.backgroundColor","border.borderColor","border.borderWidth"],editors:{"background.backgroundColor":{input:"echart-color",label:"Color"},"border.borderColor":{input:"echart-color",label:"Color"}}},echart_stroke:{properties:["typography.color","border.borderColor","border.borderWidth","effects.opacity"],editors:{"background.backgroundColor":{input:"echart-color",label:"Color"},"border.borderColor":{input:"echart-color",label:"Color"}}},echart_fill:{properties:["typography.color","border.borderColor","border.borderWidth","effects.opacity"],editors:{"background.backgroundColor":{input:"echart-color",label:"Color"},"border.borderColor":{input:"echart-color",label:"Color"}}},echart_grid_spacing:{properties:["spacing.padding","spacing.paddingTop","spacing.paddingRight","spacing.paddingBottom","spacing.paddingLeft"]},echart_grid_box:{properties:["background.backgroundColor","border.borderColor","border.borderWidth"],editors:{"background.backgroundColor":{input:"echart-color",label:"Color"},"border.borderColor":{input:"echart-color",label:"Color"}}},echart_series_shape:{properties:["border.borderRadius","border.borderColor","border.borderWidth"],editors:{"border.borderColor":{input:"echart-color",label:"Color"}}},echart_line_area_series:{properties:["echart.lineColor","echart.lineWidth","echart.lineSymbol","echart.lineSymbolSize"],editors:{"echart.lineColor":{input:"echart-color",label:"Line color"},"echart.areaColor":{input:"echart-color",label:"Area color"}}},echart_bar_series:{properties:["echart.barColor","echart.barBorderRadius","border.borderColor","border.borderWidth","effects.opacity"],editors:{"echart.barColor":{input:"echart-color",label:"Bar color"}}},echart_pie_donut_series:{properties:["echart.pieSliceColor","echart.pieSliceBorderRadius","echart.pieLabelShow","echart.pieLabelPosition","echart.pieLabelLineShow","echart.pieLabelLineLength","echart.pieLabelLineLength2","echart.pieLabelLineSmooth","echart.pieLabelLineColor","echart.pieLabelLineWidth","typography.color","typography.fontSize","typography.fontWeight","border.borderColor","border.borderWidth","effects.opacity"],editors:{"echart.pieSliceColor":{input:"echart-color",label:"Slice color"},"echart.pieLabelLineColor":{input:"echart-color",label:"Label line color"},"echart.legendIcon":{input:"select",label:"Legend icon"},"echart.legendIconSize":{input:"number",label:"Icon size"}}}};class jr{resolve(e){return this.resolveConfig(e)}resolveConfig(e){if(!e)return this.createFullResolvedConfig();const t=this.createEmptyResolvedConfig();if(e.preset&&this.applyPreset(t,e.preset),e.groups)for(const i of e.groups)this.addGroup(t,i);if(e.properties)for(const i of e.properties){t.properties.add(i);const e=this.getGroupForProperty(i);e&&t.groups.add(e)}return e.editors&&this.applyEditors(t,e.editors),e.exclude&&this.applyExclusions(t,e.exclude),t}createEmptyResolvedConfig(){return{groups:new Set,properties:new Set,excludedProperties:new Set,editors:new Map}}createFullResolvedConfig(){const e=this.createEmptyResolvedConfig();for(const t of Fr){e.groups.add(t);for(const i of Vr[t])e.properties.add(i)}return e}applyPreset(e,t){const i=Ur[t];if(i){if(i.groups)for(const t of i.groups)this.addGroup(e,t);if(i.properties)for(const t of i.properties){e.properties.add(t);const i=this.getGroupForProperty(t);i&&e.groups.add(i)}i.editors&&this.applyEditors(e,i.editors),i.exclude&&this.applyExclusions(e,i.exclude)}else console.warn(`[PropertyConfigResolver] Unknown preset: ${t}`)}addGroup(e,t){e.groups.add(t);const i=Vr[t];if(i)for(const o of i)e.properties.add(o)}applyEditors(e,t){for(const[i,o]of Object.entries(t))e.editors.set(i,{...o})}applyExclusions(e,t){if(t.groups)for(const i of t.groups){e.groups.delete(i);const t=Vr[i];if(t)for(const i of t)e.properties.delete(i),e.editors.delete(i)}if(t.properties)for(const i of t.properties)e.excludedProperties.add(i),e.editors.delete(i)}getGroupForProperty(e){for(const[t,i]of Object.entries(Vr))if(i.includes(e))return t}}class Wr extends EventTarget{constructor(e){super(),this._pendingUpdates=new Map,this._flushScheduled=!1,this._flushTimeoutId=null,this._presetUnsubscribe=null,this._stateSubscription=null,this._selectedBlockId=null,this._activeTargetId=null,this._themeMode="auto",this._resolvedStyles={},this._baseResolvedStyles={},this._visibleProperties=null,this._presets=[],this.documentModel=e.documentModel,this.presetService=e.presetService,this.styleResolver=e.styleResolver,this.hass=e.hass,this._activeContainerId=e.initialContainerId,this._themeMode=e.themeMode??"light",this.propertyConfigResolver=new jr,this.hass&&(this.bindingEvaluator=new j(this.hass,{resolveSlotEntity:e=>this.documentModel.resolveSlotEntity(e),onTemplateResult:()=>{this._resolveStyles(),this._emitChange("styles")}}),this.styleResolver.setBindingEvaluator(this.bindingEvaluator)),this._presetUnsubscribe=this.presetService.subscribe(e=>{this._presets=e,this._emitChange("presets"),this._selectedBlockId&&this._resolveStyles()}),this.hass&&this._subscribeToStateChanges()}get selectedBlockId(){return this._selectedBlockId}get activeContainerId(){return this._activeContainerId}get activeTargetId(){return this._activeTargetId}get themeMode(){return this._themeMode}get resolvedStyles(){return this._resolvedStyles}get baseResolvedStyles(){return this._baseResolvedStyles}get visibleProperties(){return this._visibleProperties}get presets(){return this._presets}get selectedBlock(){return this._selectedBlockId&&this.documentModel.blocks[this._selectedBlockId]||null}get appliedPresetId(){var e,t;const i=this.selectedBlock;if(!i)return;const o=this._getActiveTargetStyle(i.id);return o?null==(t=null==(e=i.styles)?void 0:e[o.targetId])?void 0:t.stylePresetId:void 0}get appliedPreset(){const e=this.appliedPresetId;if(e)return this._presets.find(t=>t.id===e)}setHass(e){this.hass=e,this.bindingEvaluator=new j(e,{resolveSlotEntity:e=>this.documentModel.resolveSlotEntity(e),onTemplateResult:()=>{this._resolveStyles(),this._emitChange("styles")}}),this.styleResolver.setBindingEvaluator(this.bindingEvaluator),this._stateSubscription||this._subscribeToStateChanges(),this._selectedBlockId&&(this._resolveStyles(),this._emitChange("styles"))}setSelectedBlock(e){this._selectedBlockId!==e&&(this._selectedBlockId=e,this._activeTargetId=null,this._resolveVisibleProperties(),this._resolveStyles(),this._emitChange("selection"),this.documentModel.selectStyleTarget(null))}setActiveContainer(e){this._activeContainerId!==e&&(this._activeContainerId=e,this._resolveVisibleProperties(),this._resolveStyles(),this._emitChange("container"))}setActiveTarget(e){this._activeTargetId!==e&&(this._activeTargetId=e,this._resolveVisibleProperties(),this._resolveStyles(),this._emitChange("target"),this.documentModel.selectStyleTarget(e))}setThemeMode(e){this._themeMode!==e&&(this._themeMode=e,this._resolveStyles(),this._emitChange("theme"))}updateProperty(e,t,i,o,r){const a=this._activeTargetId,s=`${a??"block"}:${e}.${t}`,n=this._shouldWriteThemeModeOverride(r),l=this._resolveForCurrentWriteMode(e,t,n),d=this.isPositionUnitLocked(e,t)?void 0:o??(null==l?void 0:l.unit),c=this._buildPropertyUpdateForCurrentWriteMode(e,t,n,e=>{e.value=i,delete e.binding,void 0!==d?e.unit=d:delete e.unit});this._pendingUpdates.set(s,{category:e,property:t,value:c,targetId:a}),this._scheduleFlush()}updateProperties(e,t=null){const i=this.selectedBlock;if(!i)return;const o=t??"block",r={...i.styles||{}},a={...r[o]||{}},s={...a.containers||{}},n={...s[this._activeContainerId]||{}};for(const l of e.values()){n[l.category]||(n[l.category]={});const e={value:l.value};void 0===l.unit||this.isPositionUnitLocked(l.category,l.property)||(e.unit=l.unit),n[l.category][l.property]=e}s[this._activeContainerId]=n,a.containers=s,r[o]=a,this.documentModel.updateBlock(i.id,{styles:r}),this._resolveStyles(),this._emitChange("styles")}applyInlineOverrides(e,t){var i;const o=this.selectedBlock;if(!o||0===e.length)return;const r={...o.styles||{}},a=new Map;for(const s of e){const e=s.targetId??"block",o=s.containerId??this._activeContainerId;let n=a.get(e);if(!n){const t=r[e]||{},i={...t.containers||{}};n={target:{...t},containers:i,containerCache:new Map},a.set(e,n)}let l=n.containerCache.get(o);if(l||(l={...n.containers[o]||{}},n.containerCache.set(o,l)),(null==t?void 0:t.skipExisting)&&void 0!==(null==(i=l[s.category])?void 0:i[s.property]))continue;const d={...l[s.category]||{}};d[s.property]=K(s.value),l[s.category]=d}for(const[s,n]of a.entries()){for(const[e,t]of n.containerCache.entries())n.containers[e]=t;n.target.containers=n.containers,r[s]=n.target}this.documentModel.updateBlock(o.id,{styles:r}),this._resolveStyles(),this._emitChange("styles")}updateBinding(e,t,i,o,r){const a=this._activeTargetId,s=`${a??"block"}:${e}.${t}`,n=this._shouldWriteThemeModeOverride(r),l=this._resolveForCurrentWriteMode(e,t,n),d=this.isPositionUnitLocked(e,t)?void 0:o??(null==l?void 0:l.unit),c=this._buildPropertyUpdateForCurrentWriteMode(e,t,n,e=>{i?e.binding=i:(delete e.binding,e.value=null==l?void 0:l.value),void 0!==d?e.unit=d:delete e.unit});this._pendingUpdates.set(s,{category:e,property:t,value:c,targetId:a}),this._scheduleFlush()}resetProperty(e,t,i){var o;const r=this.selectedBlock;if(!r)return;const a=this._activeTargetId??"block",s={...r.styles||{}},n={...s[a]||{}},l={...n.containers||{}},d={...l[this._activeContainerId]||{}};if(d[e]){const r={...d[e]},a=r[t];if(Boolean((null==i?void 0:i.themeModeEligible)&&a)){const e=K(a),i=this._getSelectedThemeOverrideMode();i?(null==(o=e.themeModes)||delete o[i],e.themeModes&&0===Object.keys(e.themeModes).length&&delete e.themeModes):(delete e.value,delete e.unit,delete e.binding),this._isEmptyStylePropertyValue(e)?delete r[t]:r[t]=e}else delete r[t];0===Object.keys(r).length?delete d[e]:d[e]=r}0===Object.keys(d).length?delete l[this._activeContainerId]:l[this._activeContainerId]=d,0===Object.keys(l).length?n.stylePresetId?(delete n.containers,s[a]=n):delete s[a]:(n.containers=l,s[a]=n),this.documentModel.updateBlock(r.id,{styles:s}),this._resolveStyles(),this._emitChange("styles")}enableThemeModeOverride(e,t){var i;const o=this._getSelectedThemeOverrideMode();if(!o)return;const r=this._getOrMaterializeLocalProperty(e,t),a=null==(i=this._resolvedStyles[e])?void 0:i[t],s=this._cloneResolvedValueAsThemeOverride(a,e,t);r.themeModes={...r.themeModes??{},[o]:s},this._writeStyleProperty(e,t,r)}disableThemeModeOverride(e,t){var i,o;const r=this._getSelectedThemeOverrideMode();if(!r)return;const a=this._getCurrentContainerStyleProperty(e,t);if(!(null==(i=null==a?void 0:a.themeModes)?void 0:i[r]))return;const s=K(a);null==(o=s.themeModes)||delete o[r],s.themeModes&&0===Object.keys(s.themeModes).length&&delete s.themeModes,this._writeStyleProperty(e,t,s)}hasThemeModeOverride(e,t,i){var o,r;const a=i??this._getSelectedThemeOverrideMode();return Boolean(a&&J(null==(r=null==(o=this._getCurrentContainerStyleProperty(e,t))?void 0:o.themeModes)?void 0:r[a]))}hasAnyThemeModeOverride(e,t){var i;const o=null==(i=this._getCurrentContainerStyleProperty(e,t))?void 0:i.themeModes;return J(null==o?void 0:o.light)||J(null==o?void 0:o.dark)}hasBaseLocalOverride(e,t){return Q(this._getCurrentContainerStyleProperty(e,t))}hasCurrentEditModeLocalOverride(e,t,i){if(!i)return Boolean(this._getCurrentContainerStyleProperty(e,t));const o=this._getSelectedThemeOverrideMode();return o?this.hasThemeModeOverride(e,t,o):this.hasBaseLocalOverride(e,t)}applyPreset(e){const t=this.selectedBlock;if(!t)return;const i=this._getActiveTargetStyle(t.id);if(!i)return;const o=i.targetId,r={...t.styles||{}},a={...r[o]||{}};e?a.stylePresetId=e:delete a.stylePresetId,a.stylePresetId||a.containers?r[o]=a:delete r[o],this.documentModel.updateBlock(t.id,{styles:r}),this._resolveStyles(),this._emitChange("styles")}async createPreset(e,t,i){const o=this._buildPresetData();return await this.presetService.createPreset({name:e,description:t,extendsPresetId:i,data:o})}async deletePreset(e){await this.presetService.deletePreset(e),this.appliedPresetId===e&&this.applyPreset(null)}flush(){null!==this._flushTimeoutId&&("cancelIdleCallback"in window?window.cancelIdleCallback(this._flushTimeoutId):cancelAnimationFrame(this._flushTimeoutId)),this._flush()}handleDocumentChange(e){this._selectedBlockId&&(this._resolveVisibleProperties(),this._emitChange("properties")),e===this._selectedBlockId&&(this._resolveStyles(),this._emitChange("styles"))}dispose(){null!==this._flushTimeoutId&&("cancelIdleCallback"in window?window.cancelIdleCallback(this._flushTimeoutId):cancelAnimationFrame(this._flushTimeoutId)),this._presetUnsubscribe&&(this._presetUnsubscribe(),this._presetUnsubscribe=null),this._stateSubscription&&(this._stateSubscription(),this._stateSubscription=null),this._selectedBlockId=null,this._activeTargetId=null,this._resolvedStyles={},this._baseResolvedStyles={},this._visibleProperties=null,this._pendingUpdates.clear()}async _subscribeToStateChanges(){var e;if(null==(e=this.hass)?void 0:e.connection)try{const e=await this.hass.connection.subscribeEvents(()=>this._handleEntityStateChange(),"state_changed");this._stateSubscription=e}catch(t){console.warn("[StylePanelState] Failed to subscribe to state changes:",t)}}_handleEntityStateChange(){this._selectedBlockId&&this._hasBindingsInResolvedStyles()&&(this._resolveStyles(),this._emitChange("styles"))}_hasBindingsInResolvedStyles(){for(const e of Object.values(this._resolvedStyles))if(e)for(const t of Object.values(e))if(null==t?void 0:t.binding)return!0;return!1}_getPanelConfig(e){const t=this.documentModel.getElement(e);return(null==t?void 0:t.getPanelConfig())??null}_getTargetStyles(e){var t;return(null==(t=this._getPanelConfig(e))?void 0:t.targetStyles)??null}_getActiveTargetStyle(e){const t=this._getTargetStyles(e);if(!t||0===Object.keys(t).length)return null;const i=this._activeTargetId??"block",o=t[i];return o?{targetId:i,target:o}:null}_resolveVisibleProperties(){const e=this._selectedBlockId;if(!e)return void(this._visibleProperties=null);if(!this.documentModel.blocks[e])return void(this._visibleProperties=null);const t=this._getActiveTargetStyle(e);this._visibleProperties=t?this.propertyConfigResolver.resolve(t.target.styles):this.propertyConfigResolver.resolve({})}isPositionUnitLocked(e,t){return"layout"===e&&("positionX"===t||"positionY"===t)}_getResolvedTargetId(){return this._activeTargetId??"block"}_getBindingContext(){if(!this._selectedBlockId)return{};return{defaultEntityId:this.documentModel.resolveEntityForBlock(this._selectedBlockId).entityId}}_getCurrentContainerStyleProperty(e,t){var i,o,r,a,s;const n=this.selectedBlock;if(n)return null==(s=null==(a=null==(r=null==(o=null==(i=n.styles)?void 0:i[this._getResolvedTargetId()])?void 0:o.containers)?void 0:r[this._activeContainerId])?void 0:a[e])?void 0:s[t]}_resolveBaseStyles(e){return this._selectedBlockId?this.styleResolver.resolveBase(this._selectedBlockId,this._activeContainerId,this._getBindingContext(),e,this._activeTargetId??void 0):{}}_getSelectedThemeOverrideMode(){return"auto"===this._themeMode?void 0:this._themeMode}_shouldWriteThemeModeOverride(e){return Boolean((null==e?void 0:e.themeModeEligible)&&this._getSelectedThemeOverrideMode())}_cloneResolvedValueAsProperty(e,t,i){const o={};return void 0!==(null==e?void 0:e.value)&&(o.value=e.value),this.isPositionUnitLocked(t,i)||void 0===(null==e?void 0:e.unit)||(o.unit=e.unit),void 0!==(null==e?void 0:e.binding)&&(o.binding=e.binding),K(o)}_cloneResolvedValueAsThemeOverride(e,t,i){const o=this._cloneResolvedValueAsProperty(e,t,i);return delete o.themeModes,o}_isEmptyStylePropertyValue(e){var t,i;return!Q(e)&&!J(null==(t=e.themeModes)?void 0:t.light)&&!J(null==(i=e.themeModes)?void 0:i.dark)}_getOrMaterializeLocalProperty(e,t){var i,o;const r=this._getCurrentContainerStyleProperty(e,t);if(r){const o=K(r);if(!Q(o)){const r=null==(i=this._resolveBaseStyles(!0)[e])?void 0:i[t],a=this._cloneResolvedValueAsProperty(r,e,t);void 0!==a.value&&(o.value=a.value),void 0!==a.unit&&(o.unit=a.unit),void 0!==a.binding&&(o.binding=a.binding)}return o}const a=null==(o=this._resolveBaseStyles(!0)[e])?void 0:o[t];return this._cloneResolvedValueAsProperty(a,e,t)}_resolveForCurrentWriteMode(e,t,i){var o,r;return i?null==(o=this._resolvedStyles[e])?void 0:o[t]:null==(r=this._baseResolvedStyles[e])?void 0:r[t]}_buildPropertyUpdateForCurrentWriteMode(e,t,i,o){var r;const a=this._getOrMaterializeLocalProperty(e,t),s=this._getSelectedThemeOverrideMode();if(i&&s){const e={...(null==(r=a.themeModes)?void 0:r[s])??{}};return o(e),a.themeModes={...a.themeModes??{},[s]:e},K(a)}return o(a),K(a)}_writeStyleProperty(e,t,i){const o=this.selectedBlock;if(!o)return;const r=this._getResolvedTargetId(),a={...o.styles||{}},s={...a[r]||{}},n={...s.containers||{}},l={...n[this._activeContainerId]||{}},d={...l[e]||{}};d[t]=K(i),l[e]=d,n[this._activeContainerId]=l,s.containers=n,a[r]=s,this.documentModel.updateBlock(o.id,{styles:a}),this._resolveStyles(),this._emitChange("styles")}_scheduleFlush(){this._flushScheduled||(this._flushScheduled=!0,"requestIdleCallback"in window?this._flushTimeoutId=window.requestIdleCallback(()=>this._flush(),{timeout:16}):this._flushTimeoutId=requestAnimationFrame(()=>this._flush()))}_flush(){this._flushScheduled=!1,this._flushTimeoutId=null;const e=this.selectedBlock;if(!e||0===this._pendingUpdates.size)return;const t=new Map;for(const r of this._pendingUpdates.values()){const e=r.targetId??null;t.has(e)||t.set(e,[]),t.get(e).push(r)}const i={...e.styles||{}};let o=!1;for(const[r,a]of t.entries()){const e=r??"block",t={...i[e]||{}},s={...t.containers||{}},n={...s[this._activeContainerId]||{}};for(const i of a)n[i.category]||(n[i.category]={}),n[i.category][i.property]=i.value;s[this._activeContainerId]=n,t.containers=s,i[e]=t,o=!0}o&&this.documentModel.updateBlock(e.id,{styles:i}),this._pendingUpdates.clear(),this._resolveStyles(),this._emitChange("styles")}_resolveStyles(){if(!this._selectedBlockId)return this._resolvedStyles={},void(this._baseResolvedStyles={});const e=this._getBindingContext();this._resolvedStyles=this.styleResolver.resolve(this._selectedBlockId,this._activeContainerId,e,!1,this._activeTargetId??void 0,this._getSelectedThemeOverrideMode()),this._baseResolvedStyles=this.styleResolver.resolveBase(this._selectedBlockId,this._activeContainerId,e,!1,this._activeTargetId??void 0)}_buildPresetData(){var e,t,i,o,r;const a={},s=null==(o=null==(i=null==(t=null==(e=this.selectedBlock)?void 0:e.styles)?void 0:t[this._getResolvedTargetId()])?void 0:i.containers)?void 0:o[this._activeContainerId];for(const[n,l]of Object.entries(this._resolvedStyles))if(l){a[n]={};for(const[e,t]of Object.entries(l)){const i=null==(r=null==s?void 0:s[n])?void 0:r[e];if(i){a[n][e]=K(i);continue}const o=this._getRawPresetProperty(t.presetId,t.originContainer,n,e);o?a[n][e]=K(o):this.isPositionUnitLocked(n,e)?a[n][e]={value:t.value,binding:t.binding}:a[n][e]={value:t.value,binding:t.binding,unit:t.unit}}}return{containers:{[this._activeContainerId]:a}}}_getMergedPresetData(e,t=new Set){if(!e||t.has(e)||t.size>10)return;const i=this._presets.find(t=>t.id===e);return i?(t.add(e),Z(this._getMergedPresetData(i.extendsPresetId,t),i.data)):void 0}_getRawPresetProperty(e,t,i,o){var r,a,s;if(!e||!t)return;const n=this._getMergedPresetData(e);return null==(s=null==(a=null==(r=null==n?void 0:n.containers)?void 0:r[t])?void 0:a[i])?void 0:s[o]}_emitChange(e){this.dispatchEvent(new CustomEvent("state-change",{detail:{type:e}}))}}var Gr=Object.defineProperty,Hr=Object.getOwnPropertyDescriptor,qr=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Hr(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Gr(t,i,a),a};let Yr=class extends Fi{constructor(){super(...arguments),this.options=[],this.value="",this.placeholder="Select target"}get showSearch(){return this.options.length>5}get searchPlaceholder(){return"Search targets..."}renderTriggerIcon(){return ot`&#9678;`}renderTriggerLabel(){const e=this._getSelectedOption();return ot`
      ${e?ot`${e.label}`:ot`<span class="placeholder">${this.placeholder}</span>`}
    `}renderDropdownContent(){const e=this._getFilteredOptions();return ot`
      <div class="option-list">
        ${e.length>0?ot`
          ${e.map(e=>ot`
            <div
              class="option-item ${e.value===this.value?"selected":""}"
              @click=${()=>this._selectOption(e.value)}
            >
              <span class="icon">&#9673;</span>
              <div class="info">
                <div class="name">${e.label}</div>
                ${e.description?ot`
                  <div class="description">${e.description}</div>
                `:dt}
              </div>
              ${e.value===this.value?ot`<span class="check">&#10003;</span>`:dt}
            </div>
          `)}
        `:this._searchFilter?ot`
          <div class="empty-message">No targets match "${this._searchFilter}"</div>
        `:ot`
          <div class="empty-message">No targets available</div>
        `}
      </div>
    `}_selectOption(e){this._closeDropdown(),this.dispatchEvent(new CustomEvent("change",{detail:{value:e},bubbles:!0,composed:!0}))}_getSelectedOption(){return this.options.find(e=>e.value===this.value)}_getFilteredOptions(){return this._searchFilter?this.options.filter(e=>{var t;return e.label.toLowerCase().includes(this._searchFilter)||(null==(t=e.description)?void 0:t.toLowerCase().includes(this._searchFilter))}):this.options}};qr([tt({attribute:!1})],Yr.prototype,"options",2),qr([tt({type:String})],Yr.prototype,"value",2),qr([tt({type:String})],Yr.prototype,"placeholder",2),Yr=qr([rt("block-target-selector")],Yr);var Xr=Object.defineProperty,Kr=Object.getOwnPropertyDescriptor,Jr=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Kr(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Xr(t,i,a),a};let Qr=class extends Fi{constructor(){super(...arguments),this.presets=[],this.showManagement=!0}get showSearch(){return this.presets.length>5}get searchPlaceholder(){return"Search presets..."}renderTriggerIcon(){return"★"}renderTriggerLabel(){const e=this._getSelectedPreset();return ot`
      ${e?ot`${e.name}`:ot`<span class="placeholder">No preset applied</span>`}
    `}renderDropdownContent(){const e=this._getFilteredPresets();return ot`
      <div class="option-list">
        <!-- None option -->
        <div
          class="option-item ${this.selectedPresetId?"":"selected"}"
          @click=${()=>this._selectPreset(null)}
        >
          <span class="icon">○</span>
          <div class="info">
            <div class="name">No preset</div>
            <div class="description">Use default styles</div>
          </div>
          ${this.selectedPresetId?dt:ot`<span class="check">✓</span>`}
        </div>

        ${e.length>0?ot`
          <div class="divider"></div>
          ${e.map(e=>ot`
            <div
              class="option-item ${e.id===this.selectedPresetId?"selected":""}"
              @click=${()=>this._selectPreset(e.id)}
            >
              <span class="icon">★</span>
              <div class="info">
                <div class="name">${e.name}</div>
                ${e.description?ot`
                  <div class="description">${e.description}</div>
                `:dt}
                ${e.extendsPresetId?ot`
                  <div class="meta">Extends: ${this._getExtendsName(e.extendsPresetId)}</div>
                `:dt}
              </div>
              ${e.id===this.selectedPresetId?ot`<span class="check">✓</span>`:dt}
            </div>
          `)}
        `:this._searchFilter?ot`
          <div class="empty-message">No presets match "${this._searchFilter}"</div>
        `:dt}
      </div>

      ${this.showManagement?ot`
        <div class="divider"></div>
        <div class="action-item" @click=${this._handleCreatePreset}>
          <span class="icon">+</span>
          <span>Save current as preset...</span>
        </div>
        <div class="action-item" @click=${this._handleManagePresets}>
          <span class="icon">⚙</span>
          <span>Manage presets...</span>
        </div>
      `:dt}
    `}_selectPreset(e){this._closeDropdown(),this.dispatchEvent(new CustomEvent("preset-selected",{detail:{presetId:e},bubbles:!0,composed:!0}))}_handleCreatePreset(){this._closeDropdown(),this.dispatchEvent(new CustomEvent("create-preset",{bubbles:!0,composed:!0}))}_handleManagePresets(){this._closeDropdown(),this.dispatchEvent(new CustomEvent("manage-presets",{bubbles:!0,composed:!0}))}_getSelectedPreset(){if(this.selectedPresetId)return this.presets.find(e=>e.id===this.selectedPresetId)}_getFilteredPresets(){return this._searchFilter?this.presets.filter(e=>{var t;return e.name.toLowerCase().includes(this._searchFilter)||(null==(t=e.description)?void 0:t.toLowerCase().includes(this._searchFilter))}):this.presets}_getExtendsName(e){if(!e)return;const t=this.presets.find(t=>t.id===e);return null==t?void 0:t.name}};Jr([tt({attribute:!1})],Qr.prototype,"presets",2),Jr([tt({type:String})],Qr.prototype,"selectedPresetId",2),Jr([tt({type:Boolean})],Qr.prototype,"showManagement",2),Qr=Jr([rt("preset-selector")],Qr);var Zr=Object.defineProperty,ea=Object.getOwnPropertyDescriptor,ta=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?ea(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Zr(t,i,a),a};let ia=class extends it{constructor(){super(...arguments),this.open=!1,this.presets=[],this.saving=!1,this._name="",this._description="",this._error=""}updated(e){e.has("open")&&this.open&&this._resetForm()}render(){if(!this.open)return dt;const e=this._getPreviewItems();return ot`
            <div class="overlay" @click=${this._handleOverlayClick}>
                <div class="dialog" @click=${e=>e.stopPropagation()}>
                    <div class="dialog-header">
                        <h2 class="dialog-title">Save as Preset</h2>
                        <button class="close-btn" @click=${this._handleCancel}>×</button>
                    </div>

                    <div class="dialog-content">
                        <div class="form-group">
                            <label class="form-label">
                                Name <span class="required">*</span>
                            </label>
                            <input
                                    type="text"
                                    .value=${this._name}
                                    @input=${this._handleNameInput}
                                    placeholder="My Custom Style"
                                    class=${this._error?"error":""}
                                    ?disabled=${this.saving}
                            />
                            ${this._error?ot`
                                <div class="error-message">${this._error}</div>
                            `:dt}
                        </div>

                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea
                                    .value=${this._description}
                                    @input=${this._handleDescriptionInput}
                                    placeholder="Optional description of this preset..."
                                    ?disabled=${this.saving}
                            ></textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Extends</label>
                            <select
                                    .value=${this._extendsPresetId||""}
                                    @change=${this._handleExtendsChange}
                                    ?disabled=${this.saving}
                            >
                                <option value="">None (standalone preset)</option>
                                ${this.presets.map(e=>ot`
                                    <option value=${e.id}>${e.name}</option>
                                `)}
                            </select>
                            <div class="form-hint">
                                Extend another preset to inherit its values. Only differences will be saved.
                            </div>
                        </div>

                        ${e.length>0?ot`
                            <div class="preview-section">
                                <div class="preview-title">Values to save (${this.containerId})</div>
                                <div class="preview-list">
                                    ${e.map(e=>ot`
                                        <div class="preview-item">
                                            <span class="key">${e.key}</span>
                                            <span class="value">${e.value}</span>
                                        </div>
                                    `)}
                                    ${this._getPreviewItems().length>8?ot`
                                        <div class="preview-item">
                                            <span class="key">...</span>
                                            <span class="value">and more</span>
                                        </div>
                                    `:dt}
                                </div>
                            </div>
                        `:dt}
                    </div>

                    <div class="dialog-footer">
                        <button class="btn" @click=${this._handleCancel} ?disabled=${this.saving}>
                            Cancel
                        </button>
                        <button
                                class="btn btn-primary"
                                @click=${this._handleSave}
                                ?disabled=${this.saving||!this._name.trim()}
                        >
                            ${this.saving?ot`<span class="spinner"></span>`:dt}
                            ${this.saving?"Saving...":"Save Preset"}
                        </button>
                    </div>
                </div>
            </div>
        `}_resetForm(){this._name="",this._description="",this._extendsPresetId=void 0,this._error=""}_handleNameInput(e){this._name=e.target.value,this._error=""}_handleDescriptionInput(e){this._description=e.target.value}_handleExtendsChange(e){const t=e.target.value;this._extendsPresetId=t||void 0}_validate(){if(!this._name.trim())return this._error="Preset name is required",!1;return!this.presets.find(e=>e.name.toLowerCase()===this._name.trim().toLowerCase())||(this._error="A preset with this name already exists",!1)}_buildPresetData(){const e={};if(this.currentStyles)for(const[t,i]of Object.entries(this.currentStyles))if(i){e[t]={};for(const[o,r]of Object.entries(i))e[t][o]={value:r.value,binding:r.binding}}return{containers:{[this.containerId]:e}}}_handleSave(){if(!this._validate())return;const e={name:this._name.trim(),description:this._description.trim()||void 0,extendsPresetId:this._extendsPresetId,data:this._buildPresetData()};this.dispatchEvent(new CustomEvent("save",{detail:{input:e},bubbles:!0,composed:!0}))}_handleCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}_handleOverlayClick(e){e.target===e.currentTarget&&this._handleCancel()}_getPreviewItems(){const e=[];if(this.currentStyles)for(const[t,i]of Object.entries(this.currentStyles))if(i)for(const[o,r]of Object.entries(i))void 0!==r.value&&e.push({key:`${t}.${o}`,value:String(r.value)});return e.slice(0,8)}};ia.styles=et`
        :host {
            display: contents;
        }

        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.15s ease;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        .dialog {
            background: var(--bg-primary, #fff);
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            width: 90%;
            max-width: 450px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            animation: slideUp 0.2s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .dialog-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color, #d4d4d4);
        }

        .dialog-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary, #333);
            margin: 0;
        }

        .close-btn {
            width: 28px;
            height: 28px;
            padding: 0;
            border: none;
            border-radius: 4px;
            background: transparent;
            color: var(--text-secondary, #666);
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s ease;
        }

        .close-btn:hover {
            background: var(--bg-secondary, #f5f5f5);
            color: var(--text-primary, #333);
        }

        .dialog-content {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-group:last-child {
            margin-bottom: 0;
        }

        .form-label {
            display: block;
            margin-bottom: 6px;
            font-size: 12px;
            font-weight: 500;
            color: var(--text-primary, #333);
        }

        .form-label .required {
            color: #cc0000;
        }

        input, textarea, select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--border-color, #d4d4d4);
            border-radius: 4px;
            background: var(--bg-primary, #fff);
            color: var(--text-primary, #333);
            font-size: 13px;
            font-family: inherit;
            transition: border-color 0.15s ease;
            box-sizing: border-box;
        }

        input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: var(--accent-color, #0078d4);
        }

        input.error, textarea.error, select.error {
            border-color: #cc0000;
        }

        textarea {
            min-height: 80px;
            resize: vertical;
        }

        .form-hint {
            margin-top: 4px;
            font-size: 11px;
            color: var(--text-secondary, #666);
        }

        .error-message {
            margin-top: 4px;
            font-size: 11px;
            color: #cc0000;
        }

        .preview-section {
            margin-top: 16px;
            padding: 12px;
            background: var(--bg-secondary, #f5f5f5);
            border-radius: 4px;
        }

        .preview-title {
            font-size: 11px;
            font-weight: 600;
            color: var(--text-secondary, #666);
            text-transform: uppercase;
            margin-bottom: 8px;
        }

        .preview-list {
            font-size: 11px;
            color: var(--text-primary, #333);
        }

        .preview-item {
            display: flex;
            justify-content: space-between;
            padding: 2px 0;
        }

        .preview-item .key {
            color: var(--text-secondary, #666);
        }

        .preview-item .value {
            font-family: monospace;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .dialog-footer {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            padding: 16px 20px;
            border-top: 1px solid var(--border-color, #d4d4d4);
        }

        .btn {
            padding: 8px 16px;
            border: 1px solid var(--border-color, #d4d4d4);
            border-radius: 4px;
            background: var(--bg-primary, #fff);
            color: var(--text-primary, #333);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .btn:hover:not(:disabled) {
            background: var(--bg-secondary, #f5f5f5);
        }

        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .btn-primary {
            background: var(--accent-color, #0078d4);
            border-color: var(--accent-color, #0078d4);
            color: white;
        }

        .btn-primary:hover:not(:disabled) {
            background: #006cbd;
            border-color: #006cbd;
        }

        .btn-primary:disabled {
            background: #99c9ea;
            border-color: #99c9ea;
        }

        .spinner {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid transparent;
            border-top-color: currentColor;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-right: 6px;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    `,ta([tt({type:Boolean})],ia.prototype,"open",2),ta([tt({attribute:!1})],ia.prototype,"currentStyles",2),ta([tt({type:String})],ia.prototype,"containerId",2),ta([tt({attribute:!1})],ia.prototype,"presets",2),ta([tt({type:Boolean})],ia.prototype,"saving",2),ta([st()],ia.prototype,"_name",2),ta([st()],ia.prototype,"_description",2),ta([st()],ia.prototype,"_extendsPresetId",2),ta([st()],ia.prototype,"_error",2),ia=ta([rt("preset-save-dialog")],ia);var oa=Object.defineProperty,ra=Object.getOwnPropertyDescriptor,aa=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?ra(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&oa(t,i,a),a};let sa=class extends it{constructor(){super(...arguments),this.open=!1,this.presets=[],this._searchFilter="",this._deleting=!1}render(){if(!this.open)return dt;const e=this._getFilteredPresets();return ot`
      <div class="overlay" @click=${this._handleOverlayClick}>
        <div class="dialog" @click=${e=>e.stopPropagation()}>
          <div class="dialog-header">
            <h2 class="dialog-title">Manage Presets</h2>
            <button class="close-btn" @click=${this._handleClose}>×</button>
          </div>

          ${this.presets.length>5?ot`
            <div class="search-bar">
              <input
                type="text"
                placeholder="Search presets..."
                .value=${this._searchFilter}
                @input=${this._handleSearchInput}
              />
            </div>
          `:dt}

          <div class="dialog-content">
            ${0===e.length?ot`
              <div class="empty-state">
                <div class="icon">★</div>
                <div class="message">
                  ${this._searchFilter?`No presets match "${this._searchFilter}"`:"No presets yet"}
                </div>
                <div class="hint">
                  ${this._searchFilter?"Try a different search term":"Create your first preset from the style panel"}
                </div>
              </div>
            `:ot`
              <ul class="preset-list">
                ${e.map(e=>ot`
                  <li class="preset-item">
                    <div class="preset-icon">★</div>
                    <div class="preset-info">
                      <div class="preset-name">${e.name}</div>
                      ${e.description?ot`
                        <div class="preset-description">${e.description}</div>
                      `:dt}
                      <div class="preset-meta">
                        ${e.extendsPresetId?ot`
                          <span>Extends: ${this._getExtendsName(e.extendsPresetId)}</span>
                        `:dt}
                        <span>Created: ${this._formatDate(e.createdAt)}</span>
                        ${this._getUsageCount(e.id)>0?ot`
                          <span>Used by: ${this._getUsageCount(e.id)} preset(s)</span>
                        `:dt}
                      </div>
                      ${this._pendingDeleteId===e.id?ot`
                        <div class="delete-confirm">
                          <span class="message">Delete this preset?</span>
                          <button
                            class="btn btn-small"
                            @click=${this._handleDeleteCancel}
                            ?disabled=${this._deleting}
                          >Cancel</button>
                          <button
                            class="btn btn-small btn-danger"
                            @click=${this._handleDeleteConfirm}
                            ?disabled=${this._deleting}
                          >
                            ${this._deleting?ot`<span class="spinner"></span>`:"Delete"}
                          </button>
                        </div>
                      `:dt}
                    </div>
                    <div class="preset-actions">
                      <button
                        class="action-btn"
                        @click=${()=>this._handleEdit(e.id)}
                        title="Edit preset"
                      >✎</button>
                      <button
                        class="action-btn danger"
                        @click=${()=>this._handleDeleteClick(e.id)}
                        title="Delete preset"
                      >🗑</button>
                    </div>
                  </li>
                `)}
              </ul>
            `}
          </div>

          <div class="dialog-footer">
            <button class="btn" @click=${this._handleClose}>Close</button>
          </div>
        </div>
      </div>
    `}_handleClose(){this._pendingDeleteId=void 0,this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_handleOverlayClick(e){e.target===e.currentTarget&&this._handleClose()}_handleSearchInput(e){this._searchFilter=e.target.value.toLowerCase()}_handleEdit(e){this.dispatchEvent(new CustomEvent("edit",{detail:{presetId:e},bubbles:!0,composed:!0}))}_handleDeleteClick(e){this._pendingDeleteId=e}_handleDeleteConfirm(){this._pendingDeleteId&&(this._deleting=!0,this.dispatchEvent(new CustomEvent("delete",{detail:{presetId:this._pendingDeleteId},bubbles:!0,composed:!0})),setTimeout(()=>{this._pendingDeleteId=void 0,this._deleting=!1},500))}_handleDeleteCancel(){this._pendingDeleteId=void 0}_getFilteredPresets(){return this._searchFilter?this.presets.filter(e=>{var t;return e.name.toLowerCase().includes(this._searchFilter)||(null==(t=e.description)?void 0:t.toLowerCase().includes(this._searchFilter))}):this.presets}_getExtendsName(e){if(!e)return;const t=this.presets.find(t=>t.id===e);return null==t?void 0:t.name}_formatDate(e){try{return new Date(e).toLocaleDateString(void 0,{year:"numeric",month:"short",day:"numeric"})}catch{return e}}_getUsageCount(e){return this.presets.filter(t=>t.extendsPresetId===e).length}};sa.styles=et`
    :host {
      display: contents;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.15s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .dialog {
      background: var(--bg-primary, #fff);
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      width: 90%;
      max-width: 550px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.2s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-color, #d4d4d4);
    }

    .dialog-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary, #333);
      margin: 0;
    }

    .close-btn {
      width: 28px;
      height: 28px;
      padding: 0;
      border: none;
      border-radius: 4px;
      background: transparent;
      color: var(--text-secondary, #666);
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .close-btn:hover {
      background: var(--bg-secondary, #f5f5f5);
      color: var(--text-primary, #333);
    }

    .search-bar {
      padding: 12px 20px;
      border-bottom: 1px solid var(--border-color, #d4d4d4);
    }

    .search-bar input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--border-color, #d4d4d4);
      border-radius: 4px;
      font-size: 13px;
      outline: none;
      box-sizing: border-box;
    }

    .search-bar input:focus {
      border-color: var(--accent-color, #0078d4);
    }

    .dialog-content {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }

    .preset-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .preset-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 20px;
      border-bottom: 1px solid var(--border-color-light, #eee);
      transition: background 0.1s ease;
    }

    .preset-item:hover {
      background: var(--bg-secondary, #f5f5f5);
    }

    .preset-item:last-child {
      border-bottom: none;
    }

    .preset-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, #7b2d8e 0%, #9b5dae 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    .preset-info {
      flex: 1;
      min-width: 0;
    }

    .preset-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary, #333);
      margin-bottom: 2px;
    }

    .preset-description {
      font-size: 11px;
      color: var(--text-secondary, #666);
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .preset-meta {
      font-size: 10px;
      color: var(--text-tertiary, #999);
    }

    .preset-meta span {
      margin-right: 12px;
    }

    .preset-actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }

    .action-btn {
      width: 28px;
      height: 28px;
      padding: 0;
      border: 1px solid transparent;
      border-radius: 4px;
      background: transparent;
      color: var(--text-secondary, #666);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all 0.15s ease;
    }

    .action-btn:hover {
      background: var(--bg-tertiary, #e8e8e8);
      border-color: var(--border-color, #d4d4d4);
    }

    .action-btn.danger:hover {
      background: #fee;
      border-color: #f88;
      color: #c00;
    }

    .empty-state {
      padding: 40px 20px;
      text-align: center;
      color: var(--text-secondary, #666);
    }

    .empty-state .icon {
      font-size: 48px;
      margin-bottom: 12px;
      opacity: 0.3;
    }

    .empty-state .message {
      font-size: 14px;
      margin-bottom: 4px;
    }

    .empty-state .hint {
      font-size: 12px;
      color: var(--text-tertiary, #999);
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      padding: 16px 20px;
      border-top: 1px solid var(--border-color, #d4d4d4);
    }

    .btn {
      padding: 8px 16px;
      border: 1px solid var(--border-color, #d4d4d4);
      border-radius: 4px;
      background: var(--bg-primary, #fff);
      color: var(--text-primary, #333);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn:hover {
      background: var(--bg-secondary, #f5f5f5);
    }

    /* Delete confirmation */
    .delete-confirm {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #fee;
      border-radius: 4px;
      margin-top: 8px;
    }

    .delete-confirm .message {
      flex: 1;
      font-size: 12px;
      color: #900;
    }

    .delete-confirm .btn-small {
      padding: 4px 10px;
      font-size: 11px;
      border-radius: 3px;
    }

    .delete-confirm .btn-danger {
      background: #c00;
      border-color: #c00;
      color: white;
    }

    .delete-confirm .btn-danger:hover {
      background: #a00;
      border-color: #a00;
    }

    .spinner {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `,aa([tt({type:Boolean})],sa.prototype,"open",2),aa([tt({attribute:!1})],sa.prototype,"presets",2),aa([st()],sa.prototype,"_searchFilter",2),aa([st()],sa.prototype,"_pendingDeleteId",2),aa([st()],sa.prototype,"_deleting",2),sa=aa([rt("preset-manager-dialog")],sa);var na=Object.defineProperty,la=Object.getOwnPropertyDescriptor,da=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?la(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&na(t,i,a),a};let ca=class extends it{constructor(){super(...arguments),this.open=!1,this.label="",this.category="",this.propertyName="",this.slots=[]}render(){return ot`
            <property-editor-overlay
                .open=${this.open}
                title="Binding"
                .subtitle=${this.label||this.propertyName}
                @overlay-close=${this._handleClose}
            >
                <property-binding-editor
                    .hass=${this.hass}
                    .binding=${this.binding}
                    .block=${this.block}
                    .defaultEntityId=${this.defaultEntityId}
                    .slots=${this.slots}
                    .valueInputConfig=${this.valueInputConfig}
                    @binding-change=${this._handleBindingChange}
                ></property-binding-editor>
            </property-editor-overlay>
        `}_handleBindingChange(e){this.dispatchEvent(new CustomEvent("property-binding-change",{detail:{category:this.category,property:this.propertyName,binding:e.detail.binding,unit:e.detail.unit},bubbles:!0,composed:!0}))}_handleClose(){this.dispatchEvent(new CustomEvent("overlay-close",{bubbles:!0,composed:!0}))}};ca.styles=et`
    :host {
      display: contents;
    }
  `,da([tt({type:Boolean,reflect:!0})],ca.prototype,"open",2),da([tt({attribute:!1})],ca.prototype,"hass",2),da([tt({type:String})],ca.prototype,"label",2),da([tt({type:String})],ca.prototype,"category",2),da([tt({type:String})],ca.prototype,"propertyName",2),da([tt({type:Object})],ca.prototype,"block",2),da([tt({attribute:!1})],ca.prototype,"binding",2),da([tt({type:String})],ca.prototype,"defaultEntityId",2),da([tt({attribute:!1})],ca.prototype,"slots",2),da([tt({attribute:!1})],ca.prototype,"valueInputConfig",2),ca=da([rt("property-binding-editor-overlay")],ca);var pa=Object.defineProperty,ha=(e,t,i,o)=>{for(var r,a=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(t,i,a)||a);return a&&pa(t,i,a),a};const ua=class extends it{constructor(){super(...arguments),this.open=!1,this.label="",this.propertyName=""}render(){return ot`
            <property-editor-overlay
                .open=${this.open}
                title="Animation"
                .subtitle=${this.label||this.propertyName}
                @overlay-close=${this.handleClose}
            >
                <div class="not-available">Animation Configuration is not available yet</div>
            </property-editor-overlay>
        `}handleClose(){this.dispatchEvent(new CustomEvent("overlay-close",{bubbles:!0,composed:!0}))}};ua.styles=et`
        :host {
            display: contents;
        }
        .not-available {
            padding: 12px;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
        }
    `;let ga=ua;ha([tt({type:Boolean,reflect:!0})],ga.prototype,"open"),ha([tt({type:String})],ga.prototype,"label"),ha([tt({type:String})],ga.prototype,"propertyName"),er.define("property-animation-editor-overlay",ga);var va=Object.defineProperty,ba=(e,t,i,o)=>{for(var r,a=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(t,i,a)||a);return a&&va(t,i,a),a};const ma=["layout.show","layout.positionX","layout.positionY","animations.motion"],fa=new Set(["layout.positionX","layout.positionY","layout.zIndex","_internal.position_config"]),ya="__custom__",xa=[{label:"None",value:"none"},{label:"Image URL",value:"image"},{label:"Media Library",value:"media"},{label:"Gradient",value:"gradient"},{label:"Custom",value:"custom"}],_a=[{label:"Auto",value:"auto"},{label:"Cover",value:"cover"},{label:"Contain",value:"contain"},{label:"Custom",value:ya}],ka=[{label:"Center",value:"center"},{label:"Top",value:"top"},{label:"Bottom",value:"bottom"},{label:"Left",value:"left"},{label:"Right",value:"right"},{label:"Top Left",value:"top left"},{label:"Top Center",value:"top center"},{label:"Top Right",value:"top right"},{label:"Center Left",value:"center left"},{label:"Center Right",value:"center right"},{label:"Bottom Left",value:"bottom left"},{label:"Bottom Center",value:"bottom center"},{label:"Bottom Right",value:"bottom right"},{label:"Custom",value:ya}],wa={"left top":"top left","right top":"top right","left bottom":"bottom left","right bottom":"bottom right","left center":"center left","right center":"center right","center top":"top center","center bottom":"bottom center"},Sa=["%","px","rem","em","vw","vh"],$a={"layout.zIndex":{input:"number",min:0,step:1,default:0},"layout.display":{input:"select",options:[{label:"Block",value:"block"},{label:"Flex",value:"flex"},{label:"Grid",value:"grid"},{label:"Inline",value:"inline"},{label:"Inline Block",value:"inline-block"},{label:"Inline Flex",value:"inline-flex"},{label:"None",value:"none"}]},"layout.show":{input:"select",options:[{label:"Yes",value:"yes"},{label:"No",value:"no"}]},"layout.positionX":{input:"number",step:1},"layout.positionY":{input:"number",step:1},"size.width":{input:"number",min:1,step:1,default:0},"size.height":{input:"number",min:1,step:1,default:0},"size.minWidth":{input:"number",min:0,step:1,default:0},"size.maxWidth":{input:"number",min:0,step:1,default:0},"size.minHeight":{input:"number",min:0,step:1,default:0},"size.maxHeight":{input:"number",min:0,step:1,default:0},"spacing.margin":{input:"spacing"},"spacing.padding":{input:"spacing"},"flex.flexDirection":{input:"button-group",options:[{value:"row",tooltip:"Row",icon:'<ha-icon icon="mdi:transfer-right"></ha-icon>'},{value:"row-reverse",tooltip:"Row Reverse",icon:'<ha-icon icon="mdi:transfer-left"></ha-icon>'},{value:"column",tooltip:"Column",icon:'<ha-icon icon="mdi:transfer-down"></ha-icon>'},{value:"column-reverse",tooltip:"Column Reverse",icon:'<ha-icon icon="mdi:transfer-up"></ha-icon>'}]},"flex.justifyContent":{input:"button-group",options:[{value:"flex-start",tooltip:"Start",icon:'<ha-icon icon="mdi:format-horizontal-align-left"></ha-icon>'},{value:"center",tooltip:"Center",icon:'<ha-icon icon="mdi:format-horizontal-align-center"></ha-icon>'},{value:"flex-end",tooltip:"End",icon:'<ha-icon icon="mdi:format-horizontal-align-right"></ha-icon>'},{value:"space-between",tooltip:"Space Between",icon:'<ha-icon icon="mdi:align-horizontal-distribute"></ha-icon>'},{value:"space-around",tooltip:"Space Around",icon:'<div style="rotate: 90deg"><ha-icon icon="mdi:format-align-center"></ha-icon></div>'}]},"flex.alignItems":{input:"button-group",options:[{value:"flex-start",tooltip:"Start",icon:'<ha-icon icon="mdi:align-vertical-top"></ha-icon>'},{value:"center",tooltip:"Center",icon:'<ha-icon icon="mdi:align-vertical-center"></ha-icon>'},{value:"flex-end",tooltip:"End",icon:'<ha-icon icon="mdi:align-vertical-bottom"></ha-icon>'},{value:"stretch",tooltip:"Stretch",icon:'<ha-icon icon="mdi:stretch-to-page-outline"></ha-icon>'}]},"flex.rowGap":{input:"number",min:0,step:1,default:0},"flex.columnGap":{input:"number",min:0,step:1,default:0},"typography.color":{input:"color"},"typography.textAlign":{input:"select",options:[{label:"Left",value:"left"},{label:"Center",value:"center"},{label:"Right",value:"right"},{label:"Justify",value:"justify"}]},"typography.fontSize":{input:"slider",min:8,max:72,step:1,default:16},"typography.fontWeight":{input:"select",options:[{label:"Thin (100)",value:"100"},{label:"Light (300)",value:"300"},{label:"Normal (400)",value:"400"},{label:"Medium (500)",value:"500"},{label:"Semi-Bold (600)",value:"600"},{label:"Bold (700)",value:"700"},{label:"Extra-Bold (800)",value:"800"}]},"typography.fontFamily":{input:"select",options:[{label:"Arial",value:"Arial, sans-serif"},{label:"Helvetica",value:"Helvetica, sans-serif"},{label:"Times New Roman",value:'"Times New Roman", serif'},{label:"Georgia",value:"Georgia, serif"},{label:"Courier New",value:'"Courier New", monospace'},{label:"Verdana",value:"Verdana, sans-serif"}]},"typography.lineHeight":{input:"slider",min:.5,max:3,step:.1,default:1.5},"typography.textTransform":{input:"select",options:[{label:"None",value:"none"},{label:"Capitalize",value:"capitalize"},{label:"Uppercase",value:"uppercase"},{label:"Lowercase",value:"lowercase"}]},"typography.textDecoration":{input:"select",options:[{label:"None",value:"none"},{label:"Underline",value:"underline"},{label:"Overline",value:"overline"},{label:"Line Through",value:"line-through"}]},"typography.textShadow":{input:"textarea",rows:3,placeholder:"e.g. 2px 2px 4px rgba(0,0,0,0.3)"},"typography.letterSpacing":{input:"slider",min:-2,max:10,step:.1,default:0},"typography.whiteSpace":{input:"select",options:[{label:"Normal",value:"normal"},{label:"No-Wrap",value:"nowrap"},{label:"Pre",value:"pre"},{label:"Pre-Wrap",value:"pre-wrap"},{label:"Pre-Line",value:"pre-line"},{label:"Break-Spaces",value:"break-spaces"}]},"background.backgroundColor":{input:"color"},"background.backgroundImage":{input:"background-image"},"background.backgroundSize":{input:"background-size"},"background.backgroundPosition":{input:"background-position"},"background.backgroundRepeat":{input:"select",options:[{label:"Repeat",value:"repeat"},{label:"No Repeat",value:"no-repeat"},{label:"Repeat X",value:"repeat-x"},{label:"Repeat Y",value:"repeat-y"},{label:"Space",value:"space"},{label:"Round",value:"round"}]},"background.boxShadow":{input:"textarea",rows:3,placeholder:"0 6px 18px rgba(0, 0, 0, 0.2)"},"background.backgroundBlendMode":{input:"select",options:[{label:"Color",value:"color"},{label:"Color Burn",value:"color-burn"},{label:"Color Dodge",value:"color-dodge"},{label:"Darken",value:"darken"},{label:"Difference",value:"difference"},{label:"Exclusion",value:"exclusion"},{label:"Hard Light",value:"hard-light"},{label:"Hue",value:"hue"},{label:"Lighten",value:"lighten"},{label:"Luminosity",value:"luminosity"},{label:"Multiply",value:"multiply"},{label:"Normal",value:"normal"},{label:"Overlay",value:"overlay"},{label:"Saturation",value:"saturation"},{label:"Screen",value:"screen"},{label:"Soft Light",value:"soft-light"}]},"border.borderWidth":{input:"number",min:0,step:1,default:0},"border.borderStyle":{input:"select",options:[{label:"None",value:"none"},{label:"Solid",value:"solid"},{label:"Dashed",value:"dashed"},{label:"Dotted",value:"dotted"},{label:"Double",value:"double"}]},"border.borderColor":{input:"color"},"border.borderRadius":{input:"number",min:0,step:1,default:0},"echart.lineColor":{input:"echart-color",label:"Line color"},"echart.areaColor":{input:"echart-color",label:"Area color"},"echart.lineWidth":{input:"number",min:0,step:1,default:2},"echart.lineSymbol":{input:"select",options:[{label:"Default",value:""},{label:"None",value:"none"},{label:"Circle",value:"circle"},{label:"Empty Circle",value:"emptyCircle"},{label:"Rect",value:"rect"},{label:"Round Rect",value:"roundRect"},{label:"Triangle",value:"triangle"},{label:"Diamond",value:"diamond"},{label:"Pin",value:"pin"},{label:"Arrow",value:"arrow"}]},"echart.lineSymbolSize":{input:"slider",min:1,max:32,step:1,default:7},"echart.barColor":{input:"echart-color",label:"Bar color"},"echart.barBorderRadius":{input:"number",min:0,step:1,default:0},"echart.pieSliceColor":{input:"echart-color",label:"Slice color"},"echart.pieSliceBorderRadius":{input:"number",min:0,step:1,default:0},"echart.pieLabelShow":{input:"toggle",default:!0,labelOn:"Show",labelOff:"Hide"},"echart.pieLabelPosition":{input:"select",options:[{label:"Default",value:""},{label:"Outside",value:"outside"},{label:"Inside",value:"inside"},{label:"Center",value:"center"}]},"echart.pieLabelLineShow":{input:"toggle",default:!0,labelOn:"Show",labelOff:"Hide"},"echart.pieLabelLineLength":{input:"number",min:0,step:1,default:15},"echart.pieLabelLineLength2":{input:"number",min:0,step:1,default:15},"echart.pieLabelLineSmooth":{input:"toggle",default:!1,labelOn:"On",labelOff:"Off"},"echart.pieLabelLineColor":{input:"echart-color",label:"Label line color"},"echart.pieLabelLineWidth":{input:"number",min:0,step:1,default:1},"echart.legendIcon":{input:"select",label:"Legend icon",options:[{label:"Default",value:""},{label:"None",value:"none"},{label:"Circle",value:"circle"},{label:"Rect",value:"rect"},{label:"Round Rect",value:"roundRect"},{label:"Triangle",value:"triangle"},{label:"Diamond",value:"diamond"},{label:"Pin",value:"pin"},{label:"Arrow",value:"arrow"}]},"echart.legendIconSize":{input:"number",label:"Icon size",min:0,step:1,default:14},"svg.stroke":{input:"color"},"svg.strokeWidth":{input:"number",min:0,step:1,default:0},"svg.strokeLinecap":{input:"select",options:[{label:"Butt",value:"butt"},{label:"Round",value:"round"},{label:"Square",value:"square"}]},"svg.strokeLinejoin":{input:"select",options:[{label:"Miter",value:"miter"},{label:"Round",value:"round"},{label:"Bevel",value:"bevel"}]},"svg.strokeDasharray":{input:"text",placeholder:"e.g. 8 6"},"svg.strokeDashoffset":{input:"number",step:1,default:0},"svg.strokeOpacity":{input:"slider",min:0,max:1,step:.01,default:1},"svg.fill":{input:"color"},"svg.fillOpacity":{input:"slider",min:0,max:1,step:.01,default:1},"svg.strokeMiterlimit":{input:"number",min:1,step:1,default:1},"effects.opacity":{input:"slider",min:0,max:1,step:.01,default:1},"effects.rotate":{input:"slider",min:0,max:360,step:1,default:0},"animations.motion":{input:"hint",text:"Use the animation editor to add motion to the block."}},Ca=class extends Ii{constructor(){super(),this.themeMode="auto",this.selectedBlock=null,this.panelState=null,this.resolvedStyles={},this.baseResolvedStyles={},this.visibleProperties=null,this.presets=[],this.activeTargetId=null,this.slots=[],this.styleClipboard=null,this.copyDialogOpen=!1,this.copyCandidate=null,this.copySelectedTargets=new Set,this.copySelectedContainers=new Set,this.copySelectedApplyWarning=null,this.saveDialogOpen=!1,this.managerDialogOpen=!1,this.bindingEditorOpen=!1,this.bindingEditorTarget=null,this.expandedSections=new Set,this.backgroundImageMode="none",this.pendingMediaRequestId=null,this.animationEditorOpen=!1,this.animationEditorTarget=null,this.sections=new Map,this.editors=new Map,this.propertyConfigResolver=new jr,this.computedStyleTarget=null,this.computedStyle=null,this._handleCopyClick=()=>{if(!this.selectedBlock)return;const e=this._getInlineCopyCandidate(this.selectedBlock);if(!e)return;e.targetIds.length>1||e.containerIds.length>1?(this.copyCandidate=e,this._initializeCopySelection(e),this.copyDialogOpen=!0):this._setClipboardFromSelection(e,new Set(e.targetIds),new Set(e.containerIds))},this._confirmCopyDialog=()=>{this.copyCandidate&&(this._setClipboardFromSelection(this.copyCandidate,this.copySelectedTargets,this.copySelectedContainers),this._closeCopyDialog())},this._closeCopyDialog=()=>{this.copyDialogOpen=!1,this.copyCandidate=null},this._handleApplyClipboardClick=()=>{if(!this.selectedBlock||!this.styleClipboard)return;if(this.styleClipboard.sourceBlockId===this.selectedBlock.id)return;const{updates:e,conflictCount:t}=this._buildApplyUpdates(this.selectedBlock,this.styleClipboard);if(0===e.length)return;const i=this.selectedBlock.type!==this.styleClipboard.sourceBlockType;t>0||i?this.copySelectedApplyWarning={conflictCount:t,typeMismatch:i,updates:e}:this._applyClipboardUpdates(e,!1)},this._confirmApplyOverwrite=()=>{this.copySelectedApplyWarning&&(this._applyClipboardUpdates(this.copySelectedApplyWarning.updates,!1),this.copySelectedApplyWarning=null)},this._confirmApplyWithoutOverwrite=()=>{this.copySelectedApplyWarning&&(this._applyClipboardUpdates(this.copySelectedApplyWarning.updates,!0),this.copySelectedApplyWarning=null)},this._cancelApplyWarning=()=>{this.copySelectedApplyWarning=null},this._openMediaManagerForBackgroundImage=()=>{if(!this.eventBus)return;const e=`bg-media-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;this.pendingMediaRequestId=e,this.eventBus.dispatchEvent("media-manager-open",{mode:"select",requestId:e,title:"Select image",subtitle:"Choose or upload a background media",confirmLabel:"Use image"})},this._clearBackgroundMedia=()=>{this.pendingMediaRequestId=null,this.backgroundImageMode="media",this._handlePropertyChange("background","backgroundImage","",void 0,!0)},this.sections.set("layout",()=>this._renderLayoutSection()),this.sections.set("size",()=>this._renderSizeSection()),this.sections.set("spacing",()=>this._renderSpacingSection()),this.sections.set("flex",()=>this._renderFlexSection()),this.sections.set("typography",()=>this._renderTypographySection()),this.sections.set("background",()=>this._renderBackgroundSection()),this.sections.set("border",()=>this._renderBorderSection()),this.sections.set("echart",()=>this._renderEchartSection()),this.sections.set("svg",()=>this._renderSvgSection()),this.sections.set("effects",()=>this._renderEffectsSection()),this.sections.set("animations",()=>this._renderAnimationsSection()),this.editors.set("binding",()=>this._renderBindingEditorOverlay()),this.editors.set("animation",()=>this._renderAnimationEditorOverlay())}get defaultEntityId(){if(!this.selectedBlock)return;return this.documentModel.resolveEntityForBlock(this.selectedBlock.id).entityId}async connectedCallback(){super.connectedCallback(),await this._initializePanelState(),this.documentModel.addEventListener("selection-changed",e=>{const t=e.detail;this.handleSelectionChange(t.selectedBlock)}),this.documentModel.addEventListener("element-registered",e=>{const t=e.detail;this.selectedBlock&&t.blockId===this.selectedBlock.id&&(this.panelState&&this.panelState.handleDocumentChange(t.blockId),this._ensureActiveTargetAvailable(),this.requestUpdate())}),this.slots=this.documentModel.getSlotEntities(),this.documentModel.addEventListener("slots-changed",()=>{this.slots=this.documentModel.getSlotEntities(),this.requestUpdate()}),this.documentModel.addEventListener("block-updated",e=>{const t=e.detail;this.selectedBlock&&t.block.id===this.selectedBlock.id&&(this.selectedBlock={...t.block},this.panelState&&this.panelState.handleDocumentChange(this.selectedBlock.id),this._ensureActiveTargetAvailable(),this.requestUpdate())}),this.documentModel.addEventListener("change",e=>{var t;const i=e.detail;if("update"!==i.action&&this.selectedBlock&&(null==(t=i.block)?void 0:t.id)===this.selectedBlock.id){const e=this.documentModel.getBlock(this.selectedBlock.id);e&&(this.selectedBlock={...e},this.panelState&&this.panelState.handleDocumentChange(this.selectedBlock.id),this._ensureActiveTargetAvailable(),this.requestUpdate())}}),this.eventBus.addEventListener("moveable-change",e=>{const{position:t,positionConfig:i,size:o}=e,r=[{category:"layout",property:"positionX",value:t.x},{category:"layout",property:"positionY",value:t.y},{category:"_internal",property:"position_config",value:i}];o&&(r.push({category:"size",property:"width",value:o.width}),r.push({category:"size",property:"height",value:o.height})),this.panelState.updateProperties(r,null)}),this.eventBus.addEventListener("media-manager-selected",e=>{var t;e&&e.requestId===this.pendingMediaRequestId&&(this.pendingMediaRequestId=null,(null==(t=e.selection)?void 0:t.reference)&&(this.backgroundImageMode="media",this._handlePropertyChange("background","backgroundImage",e.selection.reference,void 0,!0)))}),this.eventBus.addEventListener("media-manager-cancelled",e=>{e&&e.requestId===this.pendingMediaRequestId&&(this.pendingMediaRequestId=null)}),this.eventBus.addEventListener("style-clipboard-clear",()=>{this._clearStyleClipboard()})}openBindingEditor(e,t,i,o){void 0!==o&&this.panelState&&this.panelState.setActiveTarget(o??null),this.bindingEditorTarget={category:e,property:t,label:i??t},this.bindingEditorOpen=!0}render(){var e;if(!this.selectedBlock)return ot`
                <div class="empty-state">
                    <ha-icon icon="mdi:palette-swatch-variant"></ha-icon>
                    <div>Select an element to edit its styles</div>
                </div>
            `;const t=this._hasStyleTargets(this.selectedBlock),i=this.containerManager.getActiveContainer(),o=i.width?`Max width: ${i.width}px`:"No width limit";return ot`
            <!-- Container Indicator -->
            <div class="container-indicator">
                Editing for: <span class="container-name">${i.name} (${o})</span>
            </div>

            ${this._renderInlineClipboardActions()}

            ${this._renderTargetSelector()}

            <!-- Preset Selector -->
            ${t?ot`
                <div class="preset-section">
                    <span class="preset-label">Style Preset</span>
                    <preset-selector
                            .presets=${this.presets}
                            .selectedPresetId=${null==(e=this.panelState)?void 0:e.appliedPresetId}
                            @preset-selected=${this._handlePresetSelected}
                            @create-preset=${this._openSaveDialog}
                            @manage-presets=${this._openManagerDialog}
                    ></preset-selector>
                </div>
            `:dt}

            <div class="panel-content">
                ${Array.from(this.sections.values()).map(e=>e())}
            </div>

            <!-- Dialogs -->
            <preset-save-dialog
                    .open=${this.saveDialogOpen}
                    .currentStyles=${this.resolvedStyles}
                    .containerId=${this.containerManager.getActiveContainerId()}
                    .presets=${this.presets}
                    @save=${this._handleSavePreset}
                    @cancel=${this._closeSaveDialog}
            ></preset-save-dialog>

            <preset-manager-dialog
                    .open=${this.managerDialogOpen}
                    .presets=${this.presets}
                    @edit=${this._handleEditPreset}
                    @delete=${this._handleDeletePreset}
                    @close=${this._closeManagerDialog}
            ></preset-manager-dialog>

            ${Array.from(this.editors.values()).map(e=>e())}
            ${this._renderCopyDialogOverlay()}
            ${this._renderApplyWarningOverlay()}
        `}disconnectedCallback(){super.disconnectedCallback(),this.panelState&&(this.panelState.dispose(),this.panelState=null)}updated(e){super.updated(e),(e.has("selectedBlock")||e.has("resolvedStyles")||e.has("activeTargetId"))&&this._resetComputedStyleCache(),e.has("themeMode")&&this.panelState&&this.panelState.setThemeMode(this.themeMode),e.has("selectedBlock")?this._updateBackgroundImageMode(!0):e.has("resolvedStyles")&&this._updateBackgroundImageMode(!1)}async _initializePanelState(){try{const e=await ee(this.hass);this.panelState=new Wr({documentModel:this.documentModel,presetService:e,styleResolver:this.styleResolver,hass:this.hass,initialContainerId:this.containerManager.getActiveContainerId(),themeMode:this.themeMode}),this.panelState.addEventListener("state-change",e=>{const t=e.detail;this._handleStateChange(t)}),this.resolvedStyles=this.panelState.resolvedStyles,this.baseResolvedStyles=this.panelState.baseResolvedStyles,this.visibleProperties=this.panelState.visibleProperties,this.presets=this.panelState.presets,this.activeTargetId=this.panelState.activeTargetId}catch(e){console.error("[PanelStyle] Failed to initialize panel state:",e)}}_handleStateChange(e){var t,i,o,r,a,s,n,l;switch(e.type){case"styles":case"theme":this.resolvedStyles=(null==(t=this.panelState)?void 0:t.resolvedStyles)||{},this.baseResolvedStyles=(null==(i=this.panelState)?void 0:i.baseResolvedStyles)||{};break;case"presets":this.presets=(null==(o=this.panelState)?void 0:o.presets)||[];break;case"properties":this.visibleProperties=(null==(r=this.panelState)?void 0:r.visibleProperties)||null;break;case"selection":case"target":case"container":this.resolvedStyles=(null==(a=this.panelState)?void 0:a.resolvedStyles)||{},this.baseResolvedStyles=(null==(s=this.panelState)?void 0:s.baseResolvedStyles)||{},this.visibleProperties=(null==(n=this.panelState)?void 0:n.visibleProperties)||null,this.activeTargetId=(null==(l=this.panelState)?void 0:l.activeTargetId)||null}this._ensureActiveTargetAvailable(),this.requestUpdate()}handleSelectionChange(e){if(this.copyDialogOpen=!1,this.copyCandidate=null,this.copySelectedApplyWarning=null,!e)return this.selectedBlock=null,this._closeBindingEditor(!0),this._closeAnimationEditor(!0),void(this.panelState&&this.panelState.setSelectedBlock(null));this._closeBindingEditor(!0),this._closeAnimationEditor(!0),this.selectedBlock={...e||{}},this.panelState&&this.panelState.setSelectedBlock(e.id),this._ensureActiveTargetAvailable()}toggleSection(e){this.expandedSections.has(e)?this.expandedSections.delete(e):this.expandedSections.add(e),this.requestUpdate()}switchLayoutMode(e){this.selectedBlock&&this.selectedBlock.layout!==e&&this.documentModel.updateBlock(this.selectedBlock.id,{layout:e})}getContainerDimensions(){if(!this.selectedBlock)return{width:this.canvasWidth,height:this.canvasHeight};const e=te(this.selectedBlock,this.documentModel,{width:this.canvasWidth,height:this.canvasHeight});return e?{width:e.width,height:e.height}:{width:0,height:0}}getLayoutData(){return this.selectedBlock?ie(this.resolvedStyles):null}getRuntimeSize(e){var t;if(e.size.width&&e.size.height)return e.size;const i=this.documentModel.getElement(this.selectedBlock.id);if(!i)return e.size;const o=(null==(t=i.getBlockBoundingClientRect)?void 0:t.call(i))??i.getBoundingClientRect();return{width:o.width,height:o.height}}getCurrentMoveablePosition(e,t,i){const o=e.positionConfig;if("px"===o.unitSystem)return e.position;const r=new oe({containerSize:t,elementSize:i,anchorPoint:o.anchor,originPoint:o.originPoint,unitSystem:o.unitSystem}).toMoveableSpace({x:o.x,y:o.y,anchorPoint:o.anchor,originPoint:o.originPoint,unitSystem:o.unitSystem});return{x:r.x,y:r.y}}applyPositionUpdate(e,t){this.panelState&&this.panelState.updateProperties([{category:"layout",property:"positionX",value:e.x},{category:"layout",property:"positionY",value:e.y},{category:"_internal",property:"position_config",value:t}],null)}_handlePresetSelected(e){const{presetId:t}=e.detail;this.panelState&&this.panelState.applyPreset(t)}_openSaveDialog(){this.saveDialogOpen=!0}_closeSaveDialog(){this.saveDialogOpen=!1}async _handleSavePreset(e){const{input:t}=e.detail;if(this.panelState)try{await this.panelState.createPreset(t.name,t.description,t.extendsPresetId),this._closeSaveDialog()}catch(i){console.error("[PanelStyle] Failed to save preset:",i)}}_openManagerDialog(){this.managerDialogOpen=!0}_closeManagerDialog(){this.managerDialogOpen=!1}_handleEditPreset(e){e.detail.presetId}async _handleDeletePreset(e){const{presetId:t}=e.detail;if(this.panelState)try{await this.panelState.deletePreset(t)}catch(i){console.error("[PanelStyle] Failed to delete preset:",i)}}_renderInlineClipboardActions(){if(!this.selectedBlock)return dt;const e=this._getInlineCopyCandidate(this.selectedBlock),t=Boolean(e),i=Boolean(this.styleClipboard&&this.selectedBlock&&this.styleClipboard.sourceBlockId!==this.selectedBlock.id);return ot`
            <div class="inline-copy-bar">
                <div class="inline-copy-bar-actions">
                    <button class="inline-copy-btn" ?disabled=${!t} @click=${this._handleCopyClick}>
                        Copy inline styles
                    </button>
                    ${i?ot`
                        <button class="inline-copy-btn primary" @click=${this._handleApplyClipboardClick}>
                            Apply copied styles
                        </button>
                    `:dt}
                </div>
            </div>
        `}_renderCopyDialogOverlay(){if(!this.copyDialogOpen||!this.copyCandidate||!this.selectedBlock)return dt;const e=this._getTargetStyles(this.selectedBlock),t=new Map(this.containerManager.getContainers().map(e=>[e.id,e.name])),i=this.copyCandidate.targetIds.map(t=>{var i,o,r,a;return"block"===t?{id:t,label:(null==(i=null==e?void 0:e.block)?void 0:i.label)??"Block",description:null==(o=null==e?void 0:e.block)?void 0:o.description}:{id:t,label:(null==(r=null==e?void 0:e[t])?void 0:r.label)??t,description:null==(a=null==e?void 0:e[t])?void 0:a.description}}),o=this.copyCandidate.containerIds.map(e=>({id:e,label:t.get(e)??e})),r=this._hasCopySelectionData(this.copyCandidate,this.copySelectedTargets,this.copySelectedContainers);return ot`
            <div class="inline-dialog-overlay" @click=${this._closeCopyDialog}>
                <div class="inline-dialog" @click=${e=>e.stopPropagation()}>
                    <div class="inline-dialog-header">
                        <div class="inline-dialog-title">Copy inline styles</div>
                        <button class="inline-copy-btn" @click=${this._closeCopyDialog}>
                            Close
                        </button>
                    </div>
                    <div class="inline-dialog-body">
                        <div>
                            <div class="inline-copy-label">Style targets</div>
                            <div class="inline-copy-dialog-grid">
                                ${i.map(e=>ot`
                                    <label class="inline-copy-dialog-item">
                                        <input
                                            type="checkbox"
                                            .checked=${this.copySelectedTargets.has(e.id)}
                                            @change=${t=>this._toggleCopyTarget(e.id,t)}
                                        />
                                        <span>${e.label}</span>
                                        ${e.description?ot`<small>${e.description}</small>`:dt}
                                    </label>
                                `)}
                            </div>
                        </div>
                        <div>
                            <div class="inline-copy-label">Containers</div>
                            <div class="inline-copy-dialog-grid">
                                ${o.map(e=>ot`
                                    <label class="inline-copy-dialog-item">
                                        <input
                                            type="checkbox"
                                            .checked=${this.copySelectedContainers.has(e.id)}
                                            @change=${t=>this._toggleCopyContainer(e.id,t)}
                                        />
                                        <span>${e.label}</span>
                                    </label>
                                `)}
                            </div>
                        </div>
                        ${r?dt:ot`
                            <div class="inline-dialog-hint">
                                No inline styles match this target/container combination.
                            </div>
                        `}
                    </div>
                    <div class="inline-dialog-footer">
                        <button class="inline-copy-btn" @click=${this._closeCopyDialog}>Cancel</button>
                        <button class="inline-copy-btn primary" ?disabled=${!r} @click=${this._confirmCopyDialog}>
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        `}_renderApplyWarningOverlay(){if(!this.copySelectedApplyWarning)return dt;const e=this.copySelectedApplyWarning.conflictCount>0?`${this.copySelectedApplyWarning.conflictCount} inline ${1===this.copySelectedApplyWarning.conflictCount?"property":"properties"} would be overwritten.`:null,t=this.copySelectedApplyWarning.typeMismatch?"The destination block type is different. Some styles may not apply as expected.":null,i=this.copySelectedApplyWarning.conflictCount>0?"Overwrite all":"Apply styles";return ot`
            <div class="inline-dialog-overlay" @click=${this._cancelApplyWarning}>
                <div class="inline-dialog" @click=${e=>e.stopPropagation()}>
                    <div class="inline-dialog-header">
                        <div class="inline-dialog-title">Apply copied styles</div>
                        <button class="inline-copy-btn" @click=${this._cancelApplyWarning}>
                            Close
                        </button>
                    </div>
                    <div class="inline-dialog-body">
                        <strong>Warning: There are potential issues to address.</strong>
                        ${t?ot`
                            <div class="inline-dialog-message inline-dialog-warning">
                                <div>${t}</div>
                            </div>
                        `:dt}
                        ${e?ot`
                            <div class="inline-dialog-message inline-dialog-warning">
                                <div>${e}</div>
                            </div>
                        `:dt}
                    </div>
                    <div class="inline-dialog-footer">
                        <button class="inline-copy-btn" @click=${this._cancelApplyWarning}>Cancel</button>
                        ${this.copySelectedApplyWarning.conflictCount>0?ot`
                            <button class="inline-copy-btn" @click=${this._confirmApplyWithoutOverwrite}>
                                Copy non-conflicting
                            </button>
                        `:dt}
                        <button class="inline-copy-btn primary" @click=${this._confirmApplyOverwrite}>
                            ${i}
                        </button>
                    </div>
                </div>
            </div>
        `}_initializeCopySelection(e){const t=new Set,i=new Set,o=this.activeTargetId??"block";e.targetIds.includes(o)?t.add(o):e.targetIds.length>0&&t.add(e.targetIds[0]);const r=this.containerManager.getActiveContainerId();e.containerIds.includes(r)?i.add(r):e.containerIds.length>0&&i.add(e.containerIds[0]),this.copySelectedTargets=t,this.copySelectedContainers=i}_toggleCopyTarget(e,t){const i=t.target.checked,o=new Set(this.copySelectedTargets);i?o.add(e):o.delete(e),this.copySelectedTargets=o}_toggleCopyContainer(e,t){const i=t.target.checked,o=new Set(this.copySelectedContainers);i?o.add(e):o.delete(e),this.copySelectedContainers=o}_hasCopySelectionData(e,t,i){for(const o of t){const t=e.targets[o];if(t)for(const e of i)if(t.containers[e])return!0}return!1}_setClipboardFromSelection(e,t,i){if(!this.selectedBlock)return;const o={};for(const r of t){const t=e.targets[r];if(!t)continue;const a={};for(const e of i){const i=t.containers[e];i&&(a[e]=this._cloneContainerStyleData(i))}Object.keys(a).length>0&&(o[r]={containers:a})}0!==Object.keys(o).length&&(this.styleClipboard={sourceBlockId:this.selectedBlock.id,sourceBlockType:this.selectedBlock.type,data:o},this._emitClipboardChanged())}_applyClipboardUpdates(e,t){this.panelState&&this.panelState.applyInlineOverrides(e.map(e=>({category:e.category,property:e.property,value:e.value,targetId:e.targetId,containerId:e.containerId})),{skipExisting:t})}_buildApplyUpdates(e,t){var i,o,r,a,s;const n=[];let l=0;const d=this._getTargetStyles(e),c=e=>d?Boolean(d[e]):"block"===e;for(const[p,h]of Object.entries(t.data))if(c(p))for(const[t,d]of Object.entries(h.containers))for(const[c,h]of Object.entries(d))if(h)for(const[d,u]of Object.entries(h))void 0!==(null==(s=null==(a=null==(r=null==(o=null==(i=e.styles)?void 0:i[p])?void 0:o.containers)?void 0:r[t])?void 0:a[c])?void 0:s[d])&&(l+=1),n.push({targetId:p,containerId:t,category:c,property:d,value:K(u)});return{updates:n,conflictCount:l}}_emitClipboardChanged(){var e;null==(e=this.eventBus)||e.dispatchEvent("style-clipboard-changed",{hasClipboard:Boolean(this.styleClipboard)})}_clearStyleClipboard(){this.styleClipboard=null,this.copyDialogOpen=!1,this.copyCandidate=null,this.copySelectedApplyWarning=null,this._emitClipboardChanged()}_handlePropertyChange(e,t,i,o,r=!1){this.panelState&&this.panelState.updateProperty(e,t,i,o,{themeModeEligible:r})}_handleBindingChange(e,t,i,o,r=this._isThemeModeColorProperty(e,t)){this.panelState&&this.panelState.updateBinding(e,t,i,o,{themeModeEligible:r})}_handleBindingEdit(e){const{category:t,property:i,label:o}=e.detail;this.bindingEditorTarget={category:t,property:i,label:o},this.bindingEditorOpen=!0}_closeBindingEditor(e=!1){this.bindingEditorOpen=!1,e&&(this.bindingEditorTarget=null)}_handlePropertyReset(e,t){this.panelState&&this.panelState.resetProperty(e,t,{themeModeEligible:this._isThemeModeColorProperty(e,t)})}updateLegacyProperty(e,t){if(!this.selectedBlock)return;const i=t.value,o="number"==typeof i?i:parseFloat(i);"layout"===e?this.documentModel.updateBlock(this.selectedBlock.id,{layout:i}):"zIndex"===e&&this.documentModel.updateBlock(this.selectedBlock.id,{zIndex:isNaN(o)?0:o})}_handleTargetChange(e){const t=e.detail.value,i="__block__"===t?null:t;this.panelState&&this.panelState.setActiveTarget(i)}_getTargetStyles(e){if(!e)return null;const t=this.documentModel.getElement(e.id),i=null==t?void 0:t.getPanelConfig();return(null==i?void 0:i.targetStyles)??null}_getAvailableTargetDefs(e){const t=this._getTargetStyles(e);if(!t)return null;const i=Object.fromEntries(Object.entries(t).filter(([e])=>"block"!==e));return Object.keys(i).length>0?i:null}_hasStyleTargets(e){const t=this._getTargetStyles(e);return!!t&&Object.keys(t).length>0}_ensureActiveTargetAvailable(){var e,t,i,o;if(!this.selectedBlock)return;const r=this._getTargetStyles(this.selectedBlock);if(!r||0===Object.keys(r).length)return void(null!==this.activeTargetId&&(null==(e=this.panelState)||e.setActiveTarget(null)));const a=Boolean(r.block),s=Object.keys(r).filter(e=>"block"!==e);!this.activeTargetId||r[this.activeTargetId]?!this.activeTargetId&&!a&&s.length>0&&(null==(o=this.panelState)||o.setActiveTarget(s[0])):a?null==(t=this.panelState)||t.setActiveTarget(null):s.length>0&&(null==(i=this.panelState)||i.setActiveTarget(s[0]))}_renderTargetSelector(){var e,t;if(!this.selectedBlock)return dt;const i=this._getTargetStyles(this.selectedBlock),o=this._getAvailableTargetDefs(this.selectedBlock);if(!i||!o)return dt;const r=Boolean(i.block),a=[...r?[{label:(null==(e=i.block)?void 0:e.label)??"Block",value:"__block__",description:null==(t=i.block)?void 0:t.description}]:[],...Object.entries(o).map(([e,t])=>({label:t.label??e,value:e,description:t.description}))],s=this.activeTargetId&&i[this.activeTargetId]?this.activeTargetId:r?"__block__":Object.keys(o)[0],n="__block__"===s?i.block??null:o[s]??null;return ot`
            <div class="target-section">
                <span class="target-label">Style target</span>
                <block-target-selector
                        .value=${s}
                        .options=${a}
                        @change=${this._handleTargetChange}
                ></block-target-selector>
                ${(null==n?void 0:n.description)?ot`
                    <div class="target-description">${n.description}</div>
                `:dt}
            </div>
        `}_renderLayoutSection(){if(!this.selectedBlock)return dt;if(!this._isSectionVisible("layout"))return dt;const e=this.expandedSections.has("layout"),t=this._renderLayoutMode();return ot`
            ${t}
            <!-- Layout Properties Section -->
            <div class="section ${e?"expanded":""}">
                <div class="section-header" @click=${()=>this.toggleSection("layout")}>
                    <span class="section-title">
                        <span>Layout</span>
                        ${this._sectionHasInlineOverrides("layout")?ot`
                            <span
                                    class="section-indicator"
                                    title="Inline overrides"
                                    aria-label="Inline overrides"
                            ></span>
                        `:dt}
                    </span>
                    <div class="section-icon"></div>
                </div>
                <div class="section-content">
                    ${"absolute"===this.selectedBlock.layout?this._renderAbsolutePositionInputs():dt}
                    ${this._renderPropertyRow("layout","zIndex",{label:"Z-Index",editor:{value:this._getUserValue("layout","zIndex",this.selectedBlock.zIndex||0),afterChange:(e,t,i)=>this.updateLegacyProperty("zIndex",null==i?void 0:i.detail)}})}

                    ${this._renderPropertyRow("layout","display",{label:"Display",helperText:this._getCurrentValueText("layout","display")})}
                    ${this._renderPropertyRow("layout","show",{label:"Show"})}
                </div>
            </div>
        `}_renderLayoutMode(){return this.documentModel.canChangeLayoutMode(this.selectedBlock.id)?ot`
            <!-- Layout Mode Toggle (no binding) -->
            <div class="layout-mode-container">
                <div class="layout-mode-label">Layout Mode</div>
                <div class="layout-mode-toggle" data-mode="${this.selectedBlock.layout}">
                    <div class="layout-mode-slider"></div>
                    <div
                        class="layout-mode-option ${"flow"===this.selectedBlock.layout?"active":""}"
                        @click=${()=>this.switchLayoutMode("flow")}
                    >
                        <ha-icon icon="mdi:format-align-left"></ha-icon>
                        <span>Flow</span>
                    </div>
                    <div
                        class="layout-mode-option ${"absolute"===this.selectedBlock.layout?"active":""}"
                        @click=${()=>this.switchLayoutMode("absolute")}
                    >
                        <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
                        <span>Absolute</span>
                    </div>
                </div>
            </div>
        `:dt}_renderAbsolutePositionInputs(){var e;const t=this.getLayoutData();if(!t)return dt;if("absolute"!==(null==(e=this.selectedBlock)?void 0:e.layout))return dt;const i=t.positionConfig;return ot`
            <!-- Position Mode (no binding) -->
            <sm-toggle-input
                    label="Position Mode"
                    labelOn="Responsive"
                    labelOff="Static"
                    .value=${"%"===i.unitSystem}
                    @change=${e=>this._handlePositionModeChange(e)}
            ></sm-toggle-input>

            <!-- Anchor Point (no binding) -->
            <sm-anchor-selector
                    label="Anchor Point"
                    .value=${i.anchor}
                    @change=${e=>this._handleAnchorChange(e)}
            ></sm-anchor-selector>

            ${this._renderPropertyRow("layout","positionX",{label:"X",editor:{value:this._getPositionDisplayValue("x",i),unit:i.unitSystem,units:[i.unitSystem],afterChange:e=>this._handlePositionChange("x",Number(e))}})}
            ${this._renderPropertyRow("layout","positionY",{label:"Y",editor:{value:this._getPositionDisplayValue("y",i),unit:i.unitSystem,units:[i.unitSystem],afterChange:e=>this._handlePositionChange("y",Number(e))}})}
        `}_handlePositionModeChange(e){const t=this.getLayoutData();if(!t)return;const i=e.detail.value?"%":"px",o=t.positionConfig,r=this.getContainerDimensions(),a=this.getRuntimeSize(t),s=this.getCurrentMoveablePosition(t,r,a),n=new oe({containerSize:r,elementSize:a,anchorPoint:o.anchor,originPoint:o.originPoint,unitSystem:i}).fromMoveableSpace(s);this.applyPositionUpdate({x:Math.round(s.x),y:Math.round(s.y)},{anchor:n.anchorPoint,x:n.x,y:n.y,unitSystem:n.unitSystem,originPoint:n.originPoint??n.anchorPoint})}_handleAnchorChange(e){const t=this.getLayoutData();if(!t)return;const i=e.detail.value,o=t.positionConfig;if(i===o.anchor)return;const r=this.getContainerDimensions(),a=this.getRuntimeSize(t),s=this.getCurrentMoveablePosition(t,r,a),n=new oe({containerSize:r,elementSize:a,anchorPoint:i,originPoint:i,unitSystem:o.unitSystem}).fromMoveableSpace(s);this.applyPositionUpdate({x:Math.round(s.x),y:Math.round(s.y)},{x:n.x,y:n.y,anchor:n.anchorPoint,originPoint:n.originPoint??n.anchorPoint,unitSystem:o.unitSystem})}_handlePositionChange(e,t){const i=this.getLayoutData();if(!i)return;const o={...i.positionConfig,[e]:t},r=this.getContainerDimensions(),a=this.getRuntimeSize(i),s=new oe({containerSize:r,elementSize:a,anchorPoint:o.anchor,originPoint:o.originPoint,unitSystem:o.unitSystem}).toMoveableSpace({x:o.x,y:o.y,anchorPoint:o.anchor,originPoint:o.originPoint,unitSystem:o.unitSystem});this.applyPositionUpdate({x:s.x,y:s.y},o)}_renderFlexSection(){if(!this.selectedBlock)return dt;if(!this._isSectionVisible("flex"))return dt;const e=this.expandedSections.has("flex");return ot`
            <div class="section ${e?"expanded":""}">
                <div class="section-header" @click=${()=>this.toggleSection("flex")}>
                    <span class="section-title">
                        <span>Arrangement</span>
                        ${this._sectionHasInlineOverrides("flex")?ot`
                            <span
                                    class="section-indicator"
                                    title="Inline overrides"
                                    aria-label="Inline overrides"
                            ></span>
                        `:dt}
                    </span>
                    <div class="section-icon"></div>
                </div>
                <div class="section-content">
                    ${this._renderPropertyRow("flex","flexDirection",{label:"Direction",helperText:this._getCurrentValueText("flex","flexDirection")})}

                    ${this._renderPropertyRow("flex","justifyContent",{label:"Justify Content",helperText:this._getCurrentValueText("flex","justifyContent")})}

                    ${this._renderPropertyRow("flex","alignItems",{label:"Align Items",helperText:this._getCurrentValueText("flex","alignItems")})}

                    <div class="property-grid">
                        ${this._renderPropertyRow("flex","rowGap",{label:"Row Gap"})}
                        ${this._renderPropertyRow("flex","columnGap",{label:"Column Gap"})}
                    </div>
                </div>
            </div>
        `}_renderSizeSection(){if(!this.selectedBlock)return dt;if(!this._isSectionVisible("size"))return dt;const e=this.expandedSections.has("size");return ot`
            <div class="section ${e?"expanded":""}">
                <div class="section-header" @click=${()=>this.toggleSection("size")}>
                    <span class="section-title">
                        <span>Size</span>
                        ${this._sectionHasInlineOverrides("size")?ot`
                            <span
                                    class="section-indicator"
                                    title="Inline overrides"
                                    aria-label="Inline overrides"
                            ></span>
                        `:dt}
                    </span>
                    <div class="section-icon"></div>
                </div>
                <div class="section-content">
                    ${this._renderPropertyRow("size","width",{label:"Width"})}
                    ${this._renderPropertyRow("size","height",{label:"Height"})}
                    ${this._renderPropertyRow("size","minWidth",{label:"Min Width"})}
                    ${this._renderPropertyRow("size","maxWidth",{label:"Max Width"})}
                    ${this._renderPropertyRow("size","minHeight",{label:"Min Height"})}
                    ${this._renderPropertyRow("size","maxHeight",{label:"Max Height"})}
                </div>
            </div>
        `}_renderSpacingSection(){if(!this._isSectionVisible("spacing"))return dt;const e=this.expandedSections.has("spacing");return ot`
            <div class="section ${e?"expanded":""}">
                <div class="section-header" @click=${()=>this.toggleSection("spacing")}>
                    <span class="section-title">
                        <span>Spacing</span>
                        ${this._sectionHasInlineOverrides("spacing")?ot`
                            <span
                                    class="section-indicator"
                                    title="Inline overrides"
                                    aria-label="Inline overrides"
                            ></span>
                        `:dt}
                    </span>
                    <div class="section-icon"></div>
                </div>
                <div class="section-content">
                    ${this._renderPropertyRow("spacing","margin",{label:"Margin",helperText:this._getCurrentValueText("spacing","margin")})}
                    ${this._renderPropertyRow("spacing","padding",{label:"Padding",helperText:this._getCurrentValueText("spacing","padding")})}
                </div>
            </div>
        `}_renderTypographySection(){if(!this._isSectionVisible("typography"))return dt;const e=this.expandedSections.has("typography");return ot`
            <div class="section ${e?"expanded":""}">
                <div class="section-header" @click=${()=>this.toggleSection("typography")}>
                    <span class="section-title">
                        <span>Typography</span>
                        ${this._sectionHasInlineOverrides("typography")?ot`
                            <span
                                    class="section-indicator"
                                    title="Inline overrides"
                                    aria-label="Inline overrides"
                            ></span>
                        `:dt}
                    </span>
                    <div class="section-icon"></div>
                </div>
                <div class="section-content">
                    ${this._renderPropertyRow("typography","color",{label:"Text Color",helperText:this._getCurrentValueText("typography","color")})}
                    ${this._renderPropertyRow("typography","textAlign",{label:"Text Align",helperText:this._getCurrentValueText("typography","textAlign")})}
                    ${this._renderPropertyRow("typography","fontSize",{label:"Font Size"})}
                    ${this._renderPropertyRow("typography","fontWeight",{label:"Font Weight",helperText:this._getCurrentValueText("typography","fontWeight")})}
                    ${this._renderPropertyRow("typography","fontFamily",{label:"Font Family",helperText:this._getCurrentValueText("typography","fontFamily")})}
                    ${this._renderPropertyRow("typography","lineHeight",{label:"Line Height"})}
                    ${this._renderPropertyRow("typography","textTransform",{label:"Text Transform",helperText:this._getCurrentValueText("typography","textTransform")})}
                    ${this._renderPropertyRow("typography","textDecoration",{label:"Text Decoration",helperText:this._getCurrentValueText("typography","textDecoration")})}
                    ${this._renderPropertyRow("typography","textShadow",{label:"Text Shadow"})}
                    ${this._renderPropertyRow("typography","letterSpacing",{label:"Letter Spacing"})}
                    ${this._renderPropertyRow("typography","whiteSpace",{label:"White Space",helperText:this._getCurrentValueText("typography","whiteSpace")})}
                </div>
            </div>
        `}_renderBackgroundSection(){if(!this._isSectionVisible("background"))return dt;const e=this.expandedSections.has("background"),t=this._getStyleEditorConfig("background","backgroundImage"),i=String(this._getResolvedValue(this._getEditorResolvedStyle("background","backgroundImage",t),"")),o=i?this._getBackgroundImageMode(i):this.backgroundImageMode,r="image"===o||"gradient"===o||"custom"===o?void 0:this._getCurrentValueText("background","backgroundImage");return ot`
            <div class="section ${e?"expanded":""}">
                <div class="section-header" @click=${()=>this.toggleSection("background")}>
                    <span class="section-title">
                        <span>Background</span>
                        ${this._sectionHasInlineOverrides("background")?ot`
                            <span
                                    class="section-indicator"
                                    title="Inline overrides"
                                    aria-label="Inline overrides"
                            ></span>
                        `:dt}
                    </span>
                    <div class="section-icon"></div>
                </div>
                <div class="section-content">
                    ${this._renderPropertyRow("background","backgroundColor",{label:"Background Color",helperText:this._getCurrentValueText("background","backgroundColor")})}
                    ${this._renderPropertyRow("background","backgroundImage",{label:"Background Image",helperText:r})}
                    ${this._renderPropertyRow("background","backgroundSize",{label:"Background Size",helperText:this._getCurrentValueText("background","backgroundSize")})}
                    ${this._renderPropertyRow("background","backgroundPosition",{label:"Background Position",helperText:this._getCurrentValueText("background","backgroundPosition")})}
                    ${this._renderPropertyRow("background","backgroundRepeat",{label:"Background Repeat",helperText:this._getCurrentValueText("background","backgroundRepeat")})}
                    ${this._renderPropertyRow("background","boxShadow",{label:"Box Shadow"})}
                    ${this._renderPropertyRow("background","backgroundBlendMode",{label:"Background Blend Mode",helperText:this._getCurrentValueText("background","backgroundBlendMode")})}
                </div>
            </div>
        `}_renderBorderSection(){if(!this._isSectionVisible("border"))return dt;const e=this.expandedSections.has("border");return ot`
            <div class="section ${e?"expanded":""}">
                <div class="section-header" @click=${()=>this.toggleSection("border")}>
                    <span class="section-title">
                        <span>Border</span>
                        ${this._sectionHasInlineOverrides("border")?ot`
                            <span
                                    class="section-indicator"
                                    title="Inline overrides"
                                    aria-label="Inline overrides"
                            ></span>
                        `:dt}
                    </span>
                    <div class="section-icon"></div>
                </div>
                <div class="section-content">
                    ${this._renderPropertyRow("border","borderWidth",{label:"Border Width"})}
                    ${this._renderPropertyRow("border","borderStyle",{label:"Border Style",helperText:this._getCurrentValueText("border","borderStyle")})}
                    ${this._renderPropertyRow("border","borderColor",{label:"Border Color",helperText:this._getCurrentValueText("border","borderColor")})}
                    ${this._renderPropertyRow("border","borderRadius",{label:"Border Radius"})}
                </div>
            </div>
        `}_renderEchartSection(){if(!this._isSectionVisible("echart"))return dt;const e=this.expandedSections.has("echart");return ot`
            <div class="section ${e?"expanded":""}">
                <div class="section-header" @click=${()=>this.toggleSection("echart")}>
                    <span class="section-title">
                        <span>Chart</span>
                        ${this._sectionHasInlineOverrides("echart")?ot`
                            <span
                                    class="section-indicator"
                                    title="Inline overrides"
                                    aria-label="Inline overrides"
                            ></span>
                        `:dt}
                    </span>
                    <div class="section-icon"></div>
                </div>
                <div class="section-content">
                    ${this._renderPropertyRow("echart","lineColor",{label:"Line color",helperText:this._getCurrentValueText("echart","lineColor")})}
                    ${this._renderPropertyRow("echart","areaColor",{label:"Area color",helperText:this._getCurrentValueText("echart","areaColor")})}
                    ${this._renderPropertyRow("echart","lineWidth",{label:"Line width"})}
                    ${this._renderPropertyRow("echart","lineSymbol",{label:"Line symbol",helperText:this._getCurrentValueText("echart","lineSymbol")})}
                    ${this._renderPropertyRow("echart","lineSymbolSize",{label:"Line symbol size"})}
                    ${this._renderPropertyRow("echart","barColor",{label:"Bar color",helperText:this._getCurrentValueText("echart","barColor")})}
                    ${this._renderPropertyRow("echart","barBorderRadius",{label:"Bar border radius"})}
                    ${this._renderPropertyRow("echart","pieSliceColor",{label:"Slice color",helperText:this._getCurrentValueText("echart","pieSliceColor")})}
                    ${this._renderPropertyRow("echart","pieSliceBorderRadius",{label:"Slice border radius"})}
                    ${this._renderPropertyRow("echart","pieLabelShow",{label:"Label"})}
                    ${this._renderPropertyRow("echart","pieLabelPosition",{label:"Label position",helperText:this._getCurrentValueText("echart","pieLabelPosition")})}
                    ${this._renderPropertyRow("echart","pieLabelLineShow",{label:"Label line"})}
                    ${this._renderPropertyRow("echart","pieLabelLineLength",{label:"Label line length"})}
                    ${this._renderPropertyRow("echart","pieLabelLineLength2",{label:"Label line length 2"})}
                    ${this._renderPropertyRow("echart","pieLabelLineSmooth",{label:"Label line smooth"})}
                    ${this._renderPropertyRow("echart","pieLabelLineColor",{label:"Label line color",helperText:this._getCurrentValueText("echart","pieLabelLineColor")})}
                    ${this._renderPropertyRow("echart","pieLabelLineWidth",{label:"Label line width"})}
                    ${this._renderPropertyRow("echart","legendIcon",{label:"Legend icon",helperText:this._getCurrentValueText("echart","legendIcon")})}
                    ${this._renderPropertyRow("echart","legendIconSize",{label:"Icon size"})}
                </div>
            </div>
        `}_renderEffectsSection(){if(!this._isSectionVisible("effects"))return dt;const e=this.expandedSections.has("effects");return ot`
            <div class="section ${e?"expanded":""}">
                <div class="section-header" @click=${()=>this.toggleSection("effects")}>
                    <span class="section-title">
                        <span>Effects</span>
                        ${this._sectionHasInlineOverrides("effects")?ot`
                            <span
                                    class="section-indicator"
                                    title="Inline overrides"
                                    aria-label="Inline overrides"
                            ></span>
                        `:dt}
                    </span>
                    <div class="section-icon"></div>
                </div>
                <div class="section-content">
                    ${this._renderPropertyRow("effects","opacity",{label:"Opacity"})}
                    ${this._renderPropertyRow("effects","rotate",{label:"Rotate"})}
                </div>
            </div>
        `}_renderSvgSection(){if(!this._isSectionVisible("svg"))return dt;const e=this.expandedSections.has("svg");return ot`
            <div class="section ${e?"expanded":""}">
                <div class="section-header" @click=${()=>this.toggleSection("svg")}>
                    <span class="section-title">
                        <span>SVG</span>
                        ${this._sectionHasInlineOverrides("svg")?ot`
                            <span
                                    class="section-indicator"
                                    title="Inline overrides"
                                    aria-label="Inline overrides"
                            ></span>
                        `:dt}
                    </span>
                    <div class="section-icon"></div>
                </div>
                <div class="section-content">
                    ${this._renderPropertyRow("svg","stroke",{label:"Stroke Color",helperText:this._getCurrentValueText("svg","stroke")})}
                    ${this._renderPropertyRow("svg","strokeWidth",{label:"Stroke Width"})}
                    ${this._renderPropertyRow("svg","strokeLinecap",{label:"Line Cap",helperText:this._getCurrentValueText("svg","strokeLinecap")})}
                    ${this._renderPropertyRow("svg","strokeLinejoin",{label:"Line Join",helperText:this._getCurrentValueText("svg","strokeLinejoin")})}
                    ${this._renderPropertyRow("svg","strokeDasharray",{label:"Dash Array"})}
                    ${this._renderPropertyRow("svg","strokeDashoffset",{label:"Dash Offset"})}
                    ${this._renderPropertyRow("svg","strokeOpacity",{label:"Stroke Opacity"})}
                    ${this._renderPropertyRow("svg","fill",{label:"Fill Color",helperText:this._getCurrentValueText("svg","fill")})}
                    ${this._renderPropertyRow("svg","fillOpacity",{label:"Fill Opacity"})}
                    ${this._renderPropertyRow("svg","strokeMiterlimit",{label:"Miter Limit"})}
                </div>
            </div>
        `}_renderAnimationsSection(){if(!this._isSectionVisible("animations"))return dt;const e=this.expandedSections.has("animations");return ot`
            <div class="section ${e?"expanded":""}">
                <div class="section-header" @click=${()=>this.toggleSection("animations")}>
                    <span class="section-title">
                        <span>Animations</span>
                        ${this._sectionHasInlineOverrides("animations")?ot`
                            <span
                                class="section-indicator"
                                title="Inline overrides"
                                aria-label="Inline overrides"
                            ></span>
                        `:dt}
                    </span>
                    <div class="section-icon"></div>
                </div>
                <div class="section-content">
                    ${this._renderPropertyRow("animations","motion",{label:"Block motion",showBindingToggle:!1})}
                </div>
            </div>
        `}_resetComputedStyleCache(){this.computedStyleTarget=null,this.computedStyle=null}_getStyleTargetElement(){var e;if(!this.selectedBlock)return null;const t=this.documentModel.getElement(this.selectedBlock.id);if(!t)return null;if(!this.activeTargetId)return t;const i=t.renderRoot??t.shadowRoot??t;return(null==(e=null==i?void 0:i.querySelector)?void 0:e.call(i,`[data-style-target="${this.activeTargetId}"]`))??t}_getComputedStyleDeclaration(){const e=this._getStyleTargetElement();return e?(this.computedStyleTarget!==e&&(this.computedStyleTarget=e,this.computedStyle=getComputedStyle(e)),this.computedStyle):(this.computedStyleTarget=null,this.computedStyle=null,null)}_getComputedStyleValueByCssProperty(e){const t=this._getComputedStyleDeclaration();if(!t)return;return t.getPropertyValue(e).trim()||void 0}_getCssPropertyName(e){if(e)return e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}_hasLocalOverride(e,t){var i,o;return Boolean(null==(o=null==(i=this.resolvedStyles[e])?void 0:i[t])?void 0:o.hasLocalOverride)}_getSelectedThemeOverrideMode(){return"auto"===this.themeMode?void 0:this.themeMode}_isThemeModeColorProperty(e,t,i){const o=i??this._getStyleEditorConfig(e,t);return re(e,t)||"color"===o.input||"echart-color"===o.input}_hasThemeModeOverride(e,t){var i;const o=this._getSelectedThemeOverrideMode();return Boolean(o&&(null==(i=this.panelState)?void 0:i.hasThemeModeOverride(e,t,o)))}_hasAnyThemeModeOverride(e,t){var i;return Boolean(null==(i=this.panelState)?void 0:i.hasAnyThemeModeOverride(e,t))}_hasCurrentEditModeLocalOverride(e,t,i){var o;const r=this._isThemeModeColorProperty(e,t,i);return Boolean(null==(o=this.panelState)?void 0:o.hasCurrentEditModeLocalOverride(e,t,r))}_getEditorResolvedStyle(e,t,i){var o,r;return this._getSelectedThemeOverrideMode()&&this._isThemeModeColorProperty(e,t,i)?null==(o=this.resolvedStyles[e])?void 0:o[t]:null==(r=this.baseResolvedStyles[e])?void 0:r[t]}_shouldUseComputedFallback(e,t){return!ma.includes(`${e}.${t}`)&&!this._hasLocalOverride(e,t)}_getComputedStyleValue(e,t){if(!this._shouldUseComputedFallback(e,t))return;if("spacing"===e&&("margin"===t||"padding"===t)){const e="margin"===t?"margin":"padding",i=this._getComputedStyleValueByCssProperty(`${e}-top`),o=this._getComputedStyleValueByCssProperty(`${e}-right`),r=this._getComputedStyleValueByCssProperty(`${e}-bottom`),a=this._getComputedStyleValueByCssProperty(`${e}-left`);if(i&&o&&r&&a)return`${i} ${o} ${r} ${a}`;const s=this._getComputedStyleValueByCssProperty(e);if(s)return s;const n=[i,o,r,a].filter(Boolean);return n.length>0?n.join(" "):void 0}const i=this._getCssPropertyName(t);return i?this._getComputedStyleValueByCssProperty(i):void 0}_getCurrentValueText(e,t){const i=this._getComputedStyleValue(e,t);if(i)return`Current: ${i}`}_parseNumberWithUnit(e){const t=e.trim().split(/\s+/)[0].match(/^(-?\d*\.?\d+)([a-z%]*)$/i);if(!t)return null;const i=parseFloat(t[1]);if(Number.isNaN(i))return null;return{value:i,unit:t[2]?t[2]:void 0}}_getComputedNumberValue(e,t){if(!this._shouldUseComputedFallback(e,t))return{};if("typography.lineHeight"===`${e}.${t}`){const e=this._getComputedStyleValueByCssProperty("line-height"),t=this._getComputedStyleValueByCssProperty("font-size");if(!e||!t)return{};const i=this._parseNumberWithUnit(e),o=this._parseNumberWithUnit(t);return(null==i?void 0:i.value)&&(null==o?void 0:o.value)?{value:i.value/o.value,text:e}:{}}const i=this._getComputedStyleValue(e,t);if(!i)return{};const o=i.trim().toLowerCase();if("none"===o||"normal"===o)return{value:0,text:i};const r=this._parseNumberWithUnit(i);return r?{value:r.value,unit:r.unit,text:i}:{text:i}}_getUserValue(e,t,i){if(this._hasLocalOverride(e,t))return this._getResolvedValue(this._getEditorResolvedStyle(e,t),i)}_renderColorInput(e,t,i,o){const r=String(i??"");return ot`
            <sm-color-input
                    .value=${r}
                    @change=${i=>o?this._applyStyleEditorChange(e,t,o,i.detail.value,void 0,i):this._handlePropertyChange(e,t,i.detail.value,void 0,!0)}
            ></sm-color-input>
        `}_getStyleEditorConfig(e,t,i){var o;const r=`${e}.${t}`;return{input:"text",...$a[r],...i,...null==(o=this.visibleProperties)?void 0:o.editors.get(r)}}_applyStyleEditorChange(e,t,i,o,r,a){var s;i.onChange?i.onChange(o,r,a):(this._handlePropertyChange(e,t,o,r,this._isThemeModeColorProperty(e,t,i)),null==(s=i.afterChange)||s.call(i,o,r,a))}_getStyleEditorValue(e,t,i){if(void 0!==i.value)return i.value;const o=this._getResolvedValue(this._getEditorResolvedStyle(e,t,i),i.default);return"text"===i.input||"textarea"===i.input?this._getUserValue(e,t,"")??"":o??""}_getStyleEditorUnitConfig(e,t,i){var o;const r=i.units;if(i.unit)return{unit:i.unit,units:r&&r.length>0?r:[i.unit]};if("layout"===e&&("positionX"===t||"positionY"===t)){const e=(null==(o=this.getLayoutData())?void 0:o.positionConfig.unitSystem)??"px";return{unit:e,units:[e]}}const a=this._getUnitConfig(e,t);if(!a&&r&&r.length>0)return{unit:r[0],units:r};if(!a)return null;const s=this._getComputedNumberValue(e,t);return!this._hasLocalOverride(e,t)&&s.unit&&a.units.includes(s.unit)?{unit:s.unit,units:a.units}:a}_getStyleEditorNumberValue(e,t,i){const o=this._parseFiniteNumber(i.value);if(void 0!==o)return o;if("number"===i.input)return this._parseFiniteNumber(this._getUserValue(e,t));const r=this._parseFiniteNumber(this._getResolvedValue(this._getEditorResolvedStyle(e,t,i)));return this._hasLocalOverride(e,t)?r??this._parseFiniteNumber(i.default):this._getComputedNumberValue(e,t).value??r??this._parseFiniteNumber(i.default)}_getStyleEditorDefaultNumber(e,t,i){return this._getComputedNumberValue(e,t).value??this._parseFiniteNumber(this._getResolvedValue(this._getEditorResolvedStyle(e,t,i)))??this._parseFiniteNumber(i.default)??0}_parseFiniteNumber(e){if("number"==typeof e)return Number.isFinite(e)?e:void 0;if("string"!=typeof e)return;const t=Number.parseFloat(e);return Number.isFinite(t)?t:void 0}_renderConfiguredStyleInput(e,t,i){const o=this._getStyleEditorValue(e,t,i),r=this._getUserValue(e,t),a=this._getStyleEditorUnitConfig(e,t,i),s=this._getStyleEditorNumberValue(e,t,i),n=this._getStyleEditorDefaultNumber(e,t,i),l=this._parseFiniteNumber(i.min),d=this._parseFiniteNumber(i.max),c=this._getCurrentValueText(e,t)??String(i.placeholder??"");switch(i.input){case"color":return ot`
                    <sm-color-input
                            .value=${String(o??"")}
                            @change=${o=>i?this._applyStyleEditorChange(e,t,i,o.detail.value,void 0,o):this._handlePropertyChange(e,t,o.detail.value)}
                    ></sm-color-input>
                `;case"echart-color":return ot`
                    <sm-echart-color-input
                            .value=${String(o||"#3b82f6")}
                            @change=${o=>this._applyStyleEditorChange(e,t,i,o.detail.value,void 0,o)}
                    ></sm-echart-color-input>
                `;case"text":case"default":default:return ot`
                    <input
                            class="text-input"
                            type="text"
                            .value=${String(r??"")}
                            placeholder=${c}
                            @input=${o=>this._applyStyleEditorChange(e,t,i,o.target.value)}
                    />
                `;case"textarea":return ot`
                    <textarea
                            class="text-input textarea-input"
                            rows=${Number(i.rows??3)}
                            .value=${String(r??"")}
                            placeholder=${c}
                            @input=${o=>this._applyStyleEditorChange(e,t,i,o.target.value)}
                    ></textarea>
                `;case"number":return ot`
                    <sm-number-input
                            .value=${s}
                            .placeholder=${c}
                            .default=${n}
                            .min=${l}
                            .max=${d}
                            .step=${Number(i.step??1)}
                            unit="${(null==a?void 0:a.unit)??""}"
                            .units=${null==a?void 0:a.units}
                            @change=${o=>this._applyStyleEditorChange(e,t,i,o.detail.value,o.detail.unit,o)}
                    ></sm-number-input>
                `;case"slider":return ot`
                    <sm-slider-input
                            .value=${s??n}
                            min=${Number(i.min??0)}
                            max=${Number(i.max??100)}
                            step=${Number(i.step??1)}
                            unit="${(null==a?void 0:a.unit)??""}"
                            .units=${(null==a?void 0:a.units)??[]}
                            @change=${o=>this._applyStyleEditorChange(e,t,i,o.detail.value,o.detail.unit,o)}
                    ></sm-slider-input>
                `;case"select":return ot`
                    <sm-select-input
                            .value=${String(o??"")}
                            .options=${(i.options??[]).map(e=>({label:e.label??e.value,value:e.value}))}
                            @change=${o=>this._applyStyleEditorChange(e,t,i,o.detail.value,void 0,o)}
                    ></sm-select-input>
                `;case"spacing":return ot`
                    <sm-spacing-input
                            .value=${o}
                            unit="${(null==a?void 0:a.unit)??"px"}"
                            .units=${(null==a?void 0:a.units)??["px"]}
                            @change=${o=>this._applyStyleEditorChange(e,t,i,o.detail.value,o.detail.unit,o)}
                    ></sm-spacing-input>
                `;case"toggle":return ot`
                    <sm-toggle-input
                            .value=${Boolean(o)}
                            .labelOn=${String(i.labelOn??"On")}
                            .labelOff=${String(i.labelOff??"Off")}
                            @change=${o=>this._applyStyleEditorChange(e,t,i,o.detail.value,void 0,o)}
                    ></sm-toggle-input>
                `;case"button-group":return ot`
                    <sm-button-group-input
                            .value=${String(o??"")}
                            .options=${(i.options??[]).map(e=>({value:e.value,tooltip:e.tooltip??e.label??e.value,icon:e.icon??e.label??e.value}))}
                            @change=${o=>this._applyStyleEditorChange(e,t,i,o.detail.value,void 0,o)}
                    ></sm-button-group-input>
                `;case"background-image":return this._renderBackgroundImageInput(i);case"background-size":return this._renderBackgroundSizeInput();case"background-position":return this._renderBackgroundPositionInput();case"hint":return ot`<div class="animation-hint">${String(i.text??"")}</div>`}}_renderBackgroundImageInput(e){const t=this._getEditorResolvedStyle("background","backgroundImage",e),i=String(this._getResolvedValue(t,"")),o=i?this._getBackgroundImageMode(i):this.backgroundImageMode,r=this._extractBackgroundImageUrl(i),a=this._getUserValue("background","backgroundImage","")??"",s=this._extractBackgroundImageUrl(a),n="media"===o?r:"",l=ae(n),d=l?G(n)||n:"",c=this._getCurrentValueText("background","backgroundImage")??String(e.placeholder??"https://example.com/background.png");return ot`
            <div class="background-input">
                <sm-select-input
                        .value=${o}
                        .options=${xa}
                        @change=${e=>this._handleBackgroundImageModeChange(e.detail.value,i)}
                ></sm-select-input>
                ${"image"===o?ot`
                    <textarea
                            class="text-input textarea-input"
                            rows="3"
                            placeholder=${c}
                            .value=${s}
                            @input=${e=>this._handlePropertyChange("background","backgroundImage",e.target.value,void 0,!0)}
                    ></textarea>
                `:dt}
                ${"media"===o?ot`
                    <div class="background-media">
                        ${l?ot`
                            <div class="media-selected">
                                <span class="media-name" title=${n}>${d}</span>
                                <div class="media-actions">
                                    <button class="media-button" @click=${this._openMediaManagerForBackgroundImage}>
                                        Edit
                                    </button>
                                    <button class="media-button danger" @click=${this._clearBackgroundMedia}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        `:ot`
                            <button class="media-button primary" @click=${this._openMediaManagerForBackgroundImage}>
                                Select media
                            </button>
                        `}
                    </div>
                `:dt}
                ${"gradient"===o?ot`
                    <textarea
                            class="text-input textarea-input"
                            rows="3"
                            placeholder=${c}
                            .value=${a}
                            @input=${e=>this._handlePropertyChange("background","backgroundImage",e.target.value,void 0,!0)}
                    ></textarea>
                `:dt}
                ${"custom"===o?ot`
                    <textarea
                            class="text-input textarea-input"
                            rows="3"
                            placeholder=${c}
                            .value=${a}
                            @input=${e=>this._handlePropertyChange("background","backgroundImage",e.target.value,void 0,!0)}
                    ></textarea>
                `:dt}
            </div>
        `}_renderBackgroundSizeInput(){const e=this.resolvedStyles.background||{},t=String(this._getResolvedValue(e.backgroundSize,"auto")),i=this._getBackgroundSizePreset(t),o=this._parseLengthPair(t,{x:{value:100,unit:"%"},y:{value:100,unit:"%"}});return ot`
            <div class="background-input">
                <sm-select-input
                        .value=${i}
                        .options=${_a}
                        @change=${e=>this._handleBackgroundSizePresetChange(e.detail.value,i)}
                ></sm-select-input>
                ${i===ya?ot`
                    <div class="background-inline-grid">
                        <div class="background-field">
                            <span class="background-field-label">Width</span>
                            <sm-number-input
                                    .value=${o.x.value}
                                    min="0"
                                    step="1"
                                    unit="${o.x.unit}"
                                    .units=${Sa}
                                    @change=${e=>this._handleBackgroundLengthPairChange("backgroundSize","x",e.detail.value,e.detail.unit,o)}
                            ></sm-number-input>
                        </div>
                        <div class="background-field">
                            <span class="background-field-label">Height</span>
                            <sm-number-input
                                    .value=${o.y.value}
                                    min="0"
                                    step="1"
                                    unit="${o.y.unit}"
                                    .units=${Sa}
                                    @change=${e=>this._handleBackgroundLengthPairChange("backgroundSize","y",e.detail.value,e.detail.unit,o)}
                            ></sm-number-input>
                        </div>
                    </div>
                `:dt}
            </div>
        `}_renderBackgroundPositionInput(){const e=this.resolvedStyles.background||{},t=String(this._getResolvedValue(e.backgroundPosition,"center")),i=this._getBackgroundPositionPreset(t),o=this._parseLengthPair(t,{x:{value:50,unit:"%"},y:{value:50,unit:"%"}});return ot`
            <div class="background-input">
                <sm-select-input
                        .value=${i}
                        .options=${ka}
                        @change=${e=>this._handleBackgroundPositionPresetChange(e.detail.value,i)}
                ></sm-select-input>
                ${i===ya?ot`
                    <div class="background-inline-grid">
                        <div class="background-field">
                            <span class="background-field-label">X</span>
                            <sm-number-input
                                    .value=${o.x.value}
                                    step="1"
                                    unit="${o.x.unit}"
                                    .units=${Sa}
                                    @change=${e=>this._handleBackgroundLengthPairChange("backgroundPosition","x",e.detail.value,e.detail.unit,o)}
                            ></sm-number-input>
                        </div>
                        <div class="background-field">
                            <span class="background-field-label">Y</span>
                            <sm-number-input
                                    .value=${o.y.value}
                                    step="1"
                                    unit="${o.y.unit}"
                                    .units=${Sa}
                                    @change=${e=>this._handleBackgroundLengthPairChange("backgroundPosition","y",e.detail.value,e.detail.unit,o)}
                            ></sm-number-input>
                        </div>
                    </div>
                `:dt}
            </div>
        `}_renderPropertyRow(e,t,i){var o;if(!this._isPropertyVisible(e,t))return dt;const r=null==(o=this.resolvedStyles[e])?void 0:o[t],a=this._getStyleEditorConfig(e,t,i.editor),s=this._getEditorResolvedStyle(e,t,a),n=a.label??i.label,l=this._renderConfiguredStyleInput(e,t,a),d=this._hasCurrentEditModeLocalOverride(e,t,a),c=d?(null==r?void 0:r.origin)||"inline":"inline"===(null==r?void 0:r.origin)||"inline-fallback"===(null==r?void 0:r.origin)?"default":(null==r?void 0:r.origin)||"default",{showBindingToggle:p=!0,showAnimationToggle:h=!0,helperText:u}=i;return ot`
            <property-row
                    .hass=${this.hass}
                    .label=${n}
                    .property=${t}
                    .category=${e}
                    .origin=${c}
                    .presetName=${("preset"===c||"preset-fallback"===c)&&(null==r?void 0:r.presetId)?this._getPresetName(r.presetId):void 0}
                    .originContainer=${"inline-fallback"===c||"preset-fallback"===c?null==r?void 0:r.originContainer:void 0}
                    .hasLocalOverride=${d}
                    .binding=${null==s?void 0:s.binding}
                    .animation=${null==r?void 0:r.animation}
                    .resolvedValue=${null==s?void 0:s.value}
                    .resolvedUnit=${null==s?void 0:s.unit}
                    .helperText=${u}
                    .defaultEntityId=${this.defaultEntityId}
                    .showBindingToggle=${p}
                    .showAnimationToggle=${h}
                    .themeMode=${this.themeMode}
                    .themeModeApplies=${this._isThemeModeColorProperty(e,t,a)}
                    .hasThemeModeOverride=${this._hasThemeModeOverride(e,t)}
                    .hasAnyThemeModeOverride=${this._hasAnyThemeModeOverride(e,t)}
                    @property-binding-change=${e=>this._handleBindingChange(e.detail.category,e.detail.property,e.detail.binding,e.detail.unit)}
                    @property-binding-edit=${this._handleBindingEdit}
                    @property-animation-change=${e=>this._handleAnimationChange(e.detail.category,e.detail.property,e.detail.animation)}
                    @property-animation-edit=${this._handleAnimationEdit}
                    @property-reset=${e=>this._handlePropertyReset(e.detail.category,e.detail.property)}
            >
                ${l}
            </property-row>
        `}_renderBindingEditorOverlay(){var e;if(!this.bindingEditorTarget)return dt;const{category:t,property:i,label:o}=this.bindingEditorTarget,r=null==(e=this._getEditorResolvedStyle(t,i))?void 0:e.binding,a=this._getBindingValueInputConfig(t,i);return ot`
            <property-binding-editor-overlay
                .open=${this.bindingEditorOpen}
                .hass=${this.hass}
                .label=${o}
                .category=${t}
                .block=${this.selectedBlock}
                .propertyName=${i}
                .binding=${r}
                .defaultEntityId=${this.defaultEntityId}
                .slots=${this.slots}
                .valueInputConfig=${a}
                @property-binding-change=${e=>this._handleBindingChange(e.detail.category,e.detail.property,e.detail.binding,e.detail.unit)}
                @overlay-close=${()=>this._closeBindingEditor()}
            ></property-binding-editor-overlay>
        `}_renderAnimationEditorOverlay(){if(!this.animationEditorTarget)return dt;const{property:e,label:t}=this.animationEditorTarget;return ot`
            <property-animation-editor-overlay
                .open=${this.animationEditorOpen}
                .label=${t}
                .propertyName=${e}
                @property-animation-change=${e=>this._handleAnimationChange(e.detail.category,e.detail.property,e.detail.animation)}
                @overlay-close=${()=>this._closeAnimationEditor()}
            ></property-animation-editor-overlay>
        `}_getBindingValueInputConfig(e,t){const i=this._getStyleEditorConfig(e,t),o=this._getStyleEditorUnitConfig(e,t,i);switch(i.input){case"number":return{type:"number",min:i.min,max:i.max,step:i.step,unit:null==o?void 0:o.unit,units:null==o?void 0:o.units};case"slider":return{type:"slider",min:Number(i.min??0),max:Number(i.max??100),step:i.step,unit:null==o?void 0:o.unit,units:null==o?void 0:o.units};case"color":case"echart-color":return{type:"color"};case"select":case"button-group":return{type:"select",options:(i.options??[]).map(e=>({label:e.label??e.tooltip??e.value,value:e.value}))};case"spacing":return{type:"spacing",unit:null==o?void 0:o.unit,units:null==o?void 0:o.units};case"text":case"textarea":case"background-image":case"background-size":case"background-position":case"default":return{type:"text",placeholder:this._getCurrentValueText(e,t)??String(i.placeholder??"")};default:return}}_getResolvedValue(e,t=void 0){return e&&void 0!==e.value?e.value:t}_updateBackgroundImageMode(e){var t;if(e&&!this.selectedBlock)return void(this.backgroundImageMode="none");const i=this._getStyleEditorConfig("background","backgroundImage"),o=null==(t=this._getEditorResolvedStyle("background","backgroundImage",i))?void 0:t.value,r="string"==typeof o?o.trim():"";if(!r)return void(e&&(this.backgroundImageMode="none"));const a=this._getBackgroundImageMode(r);a!==this.backgroundImageMode&&(this.backgroundImageMode=a)}_getBackgroundImageMode(e){const t=e.trim();if(!t||"none"===t)return"none";const i=this._extractBackgroundImageUrl(t);if(ae(i))return"media";const o=t.toLowerCase();return o.includes("gradient(")?"gradient":o.startsWith("url(")||this._looksLikeUrl(t)?"image":"custom"}_looksLikeUrl(e){return!!/^(https?:\/\/|data:|\/)/i.test(e)||/^[^()\s]+\.[a-z0-9]{2,}$/i.test(e)}_extractBackgroundImageUrl(e){const t=e.trim();if(!t)return"";const i=t.match(/^url\((.*)\)$/i);if(!i)return t;let o=i[1].trim();return(o.startsWith('"')&&o.endsWith('"')||o.startsWith("'")&&o.endsWith("'"))&&(o=o.slice(1,-1)),o}_getBackgroundSizePreset(e){const t=e.trim().toLowerCase();return"auto"===t||"auto auto"===t?"auto":"cover"===t||"contain"===t?t:ya}_getBackgroundPositionPreset(e){const t=e.trim().toLowerCase();if("center center"===t)return"center";const i=wa[t];if(i)return i;const o=ka.find(e=>e.value!==ya&&e.value===t);return o?o.value:ya}_parseLengthToken(e,t){if(!e)return t;const i=e.trim().match(/^(-?\d+(?:\.\d+)?)([a-z%]*)$/i);if(!i)return t;const o=Number(i[1]);if(!Number.isFinite(o))return t;const r=i[2]||t.unit;return Sa.includes(r)?{value:o,unit:r}:{value:o,unit:t.unit}}_parseLengthPair(e,t){const i=e.trim().split(/\s+/).filter(Boolean),o=i[0],r=i[1]??i[0];return{x:this._parseLengthToken(o,t.x),y:this._parseLengthToken(r,t.y)}}_formatLengthPair(e){return`${e.x.value}${e.x.unit} ${e.y.value}${e.y.unit}`}_handleBackgroundLengthPairChange(e,t,i,o,r){const a={x:"x"===t?{value:i,unit:o??r.x.unit}:r.x,y:"y"===t?{value:i,unit:o??r.y.unit}:r.y};this._handlePropertyChange("background",e,this._formatLengthPair(a))}_handleBackgroundImageModeChange(e,t){if(this.backgroundImageMode=e,"none"===e)return void this._handlePropertyChange("background","backgroundImage","none",void 0,!0);const i=this._getBackgroundImageMode(t);if("media"===e){"media"!==i&&this._handlePropertyChange("background","backgroundImage","",void 0,!0);const e=this._extractBackgroundImageUrl(t);return void(ae(e)||this._openMediaManagerForBackgroundImage())}"gradient"!==e?"image"!==e?"custom"===e&&"custom"!==i&&this._handlePropertyChange("background","backgroundImage","",void 0,!0):"image"!==i&&this._handlePropertyChange("background","backgroundImage","",void 0,!0):"gradient"!==i&&this._handlePropertyChange("background","backgroundImage","linear-gradient(180deg, #000000, #ffffff)",void 0,!0)}_handleBackgroundSizePresetChange(e,t){if(e!==ya)this._handlePropertyChange("background","backgroundSize",e);else if(t!==ya){const e={x:{value:100,unit:"%"},y:{value:100,unit:"%"}};this._handlePropertyChange("background","backgroundSize",this._formatLengthPair(e))}}_handleBackgroundPositionPresetChange(e,t){if(e!==ya)this._handlePropertyChange("background","backgroundPosition",e);else if(t!==ya){const e={x:{value:50,unit:"%"},y:{value:50,unit:"%"}};this._handlePropertyChange("background","backgroundPosition",this._formatLengthPair(e))}}_handleAnimationChange(e,t,i){}_handleAnimationEdit(e){const{category:t,property:i,label:o}=e.detail;this.animationEditorTarget={category:t,property:i,label:o},this.animationEditorOpen=!0}_closeAnimationEditor(e=!1){this.animationEditorOpen=!1,e&&(this.animationEditorTarget=null)}_getUnitConfig(e,t){var i;const o=se(e,t);if(!o||0===o.length)return null;const r=null==(i=this._getEditorResolvedStyle(e,t))?void 0:i.unit,a=ne(e,t)??o[0];return{unit:r&&o.includes(r)?r:a,units:o}}_getPositionDisplayValue(e,t){var i,o;if(Boolean(null==(o=null==(i=this.resolvedStyles._internal)?void 0:i.position_config)?void 0:o.value))return"x"===e?t.x:t.y;const r=this.resolvedStyles.layout||{},a="x"===e?t.x:t.y;return this._getResolvedValue("x"===e?r.positionX:r.positionY,a)}_getPresetName(e){const t=this.presets.find(t=>t.id===e);return null==t?void 0:t.name}_getInlineCopyCandidate(e){const t=this._getTargetStyles(e),i={},o=new Set,r=new Set,a=e.styles||{};for(const[s,n]of Object.entries(a)){if(!(null==n?void 0:n.containers))continue;const e=this._getTargetVisibilityConfig(s,t),a={};for(const[t,i]of Object.entries(n.containers)){const o=this._filterCopyableContainerData(i,e);o&&0!==Object.keys(o).length&&(a[t]=o,r.add(t))}Object.keys(a).length>0&&(i[s]={containers:a},o.add(s))}return 0===o.size?null:{targets:i,targetIds:Array.from(o),containerIds:Array.from(r)}}_filterCopyableContainerData(e,t){const i={};for(const[o,r]of Object.entries(e)){if(!r)continue;const e={};for(const[i,a]of Object.entries(r)){const r=`${o}.${i}`;fa.has(r)||this._isPropertyVisibleForConfig(r,t)&&(e[i]=K(a))}Object.keys(e).length>0&&(i[o]=e)}return i}_getTargetVisibilityConfig(e,t){if(!t)return this.propertyConfigResolver.resolve(void 0);const i=t[e];return this.propertyConfigResolver.resolve(null==i?void 0:i.styles)}_isPropertyVisibleForConfig(e,t){return t.properties.has(e)&&!t.excludedProperties.has(e)}_cloneContainerStyleData(e){const t={};for(const[i,o]of Object.entries(e)){if(!o)continue;const e={};for(const[t,i]of Object.entries(o))e[t]=K(i);t[i]=e}return t}_sectionHasInlineOverrides(e){return this._getSectionGroups(e).some(e=>(Vr[e]||[]).some(e=>{if(!this._isPropertyKeyVisible(e))return!1;const t=e.indexOf(".");if(-1===t)return!1;const i=e.slice(0,t),o=e.slice(t+1);return this._hasCurrentEditModeLocalOverride(i,o)}))}_getSectionGroups(e){return"layout"===e?["layout","flex"]:[e]}_isSectionVisible(e){if(!this.visibleProperties)return"echart"!==e;const t=e;if(!this.visibleProperties.groups.has(t))return!1;return(Vr[t]||[]).some(e=>this._isPropertyKeyVisible(e))}_isPropertyVisible(e,t){const i=`${e}.${t}`;return this._isPropertyKeyVisible(i)}_isPropertyKeyVisible(e){return!this.visibleProperties||this.visibleProperties.properties.has(e)&&!this.visibleProperties.excludedProperties.has(e)}};Ca.styles=[...Ii.styles,et`

        .panel-content {
            padding: 0;
        }

        /* Preset Section */

        .preset-section {
            padding: 12px;
            border-bottom: 1px solid var(--border-color);
            background: var(--bg-secondary);
        }

        .inline-copy-bar {
            padding: 6px 12px;
            border-bottom: 1px solid var(--border-color);
            background: var(--bg-secondary);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }

        .inline-copy-bar-actions {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: nowrap;
        }

        .inline-copy-label {
            font-size: 10px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .inline-copy-btn {
            padding: 4px 8px;
            border: 1px solid var(--border-color);
            background: var(--bg-primary);
            color: var(--text-primary);
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            border-radius: 3px;
            cursor: pointer;
        }

        .inline-copy-btn.primary {
            background: var(--accent-color);
            border-color: var(--accent-color);
            color: #fff;
        }

        .inline-copy-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .inline-dialog-overlay {
            position: fixed;
            inset: 0;
            z-index: 220;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.5);
        }

        .inline-dialog {
            width: min(92vw, 520px);
            max-height: 80vh;
            background: var(--bg-primary);
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .inline-dialog-header {
            padding: 12px 16px;
            border-bottom: 1px solid var(--border-color);
            background: var(--bg-secondary);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }

        .inline-dialog-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-primary);
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }

        .inline-dialog-body {
            padding: 12px 16px;
            overflow: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .inline-dialog-footer {
            padding: 10px 16px;
            border-top: 1px solid var(--border-color);
            background: var(--bg-secondary);
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }

        .inline-dialog-message {
            font-size: 12px;
            color: var(--text-primary);
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .inline-dialog-warning {
            border: 1px solid rgba(255, 152, 0, 0.5);
            background: rgba(255, 152, 0, 0.08);
            padding: 10px;
            border-radius: 6px;
        }

        .inline-copy-dialog-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px 10px;
        }

        .inline-copy-dialog-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            color: var(--text-primary);
        }

        .inline-copy-dialog-item small {
            color: var(--text-secondary);
            font-size: 10px;
        }

        .inline-dialog-hint {
            font-size: 11px;
            color: var(--text-secondary);
            background: var(--bg-tertiary);
            border-radius: 4px;
            padding: 6px 8px;
        }

        .preset-label {
            display: block;
            margin-bottom: 8px;
            font-size: 10px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .target-section {
            padding: 12px;
            border-bottom: 1px solid var(--border-color);
            background: var(--bg-secondary);
        }

        .target-label {
            display: block;
            margin-bottom: 8px;
            font-size: 10px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .target-description {
            margin-top: 8px;
            font-size: 11px;
            color: var(--text-secondary);
            line-height: 1.4;
        }

        /* Sections */

        .section {
            margin-bottom: 0;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
        }

        .section-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--accent-color);
            box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.15);
            flex-shrink: 0;
        }

        .property-grid {
            display: grid;
            grid-template-columns: 50% 50%;
            gap: 8px;
        }

        .background-input {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .background-inline-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
        }

        .background-field {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .background-field-label {
            font-size: 9px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .background-media {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .media-selected {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 8px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background: var(--bg-primary);
        }

        .media-name {
            font-size: 11px;
            color: var(--text-primary);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .media-actions {
            display: flex;
            gap: 6px;
            flex-shrink: 0;
        }

        .media-button {
            padding: 6px 10px;
            border-radius: 4px;
            border: 1px solid var(--border-color);
            background: var(--bg-secondary);
            color: var(--text-primary);
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            cursor: pointer;
        }

        .media-button.primary {
            background: var(--accent-color);
            border-color: transparent;
            color: #fff;
        }

        .media-button.danger {
            background: rgba(219, 68, 55, 0.12);
            border-color: rgba(219, 68, 55, 0.4);
            color: var(--error-color, #db4437);
        }

        .text-input {
            width: 100%;
            box-sizing: border-box;
            padding: 6px 8px;
            border: 1px solid var(--border-color);
            border-radius: 3px;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-size: 11px;
            font-family: inherit;
        }

        .text-input:focus {
            outline: none;
            border-color: var(--accent-color);
        }

        .text-input.textarea-input {
            min-height: 64px;
            line-height: 1.4;
            resize: vertical;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
        }

        .block-info {
            padding: 8px 12px;
            background: var(--bg-tertiary);
            border-bottom: 1px solid var(--border-color);
            font-size: 10px;
            line-height: 1.6;
        }

        .block-info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }

        .block-info-row:last-child {
            margin-bottom: 0;
        }

        .block-info-label {
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.3px;
            font-weight: 600;
        }

        .block-info-value {
            color: var(--text-primary);
            font-family: 'Courier New', monospace;
            font-size: 9px;
        }

        /* Layout Mode Toggle */

        .layout-mode-container {
            padding: 12px;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-color);
            --mdc-icon-size: 20px;
        }

        .layout-mode-label {
            display: block;
            margin-bottom: 8px;
            font-size: 10px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .layout-mode-toggle {
            display: flex;
            position: relative;
            background: var(--bg-tertiary);
            border-radius: 6px;
            padding: 2px;
            height: 36px;
        }

        .layout-mode-option {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 500;
            color: var(--text-secondary);
            cursor: pointer;
            z-index: 1;
            transition: color 0.2s ease;
            user-select: none;
        }

        .layout-mode-option:hover {
            color: var(--text-primary);
        }

        .layout-mode-option.active {
            color: white;
        }

        .layout-mode-option svg {
            width: 14px;
            height: 14px;
        }

        .layout-mode-slider {
            position: absolute;
            top: 2px;
            bottom: 2px;
            width: calc(50% - 2px);
            background: var(--accent-color);
            border-radius: 4px;
            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        .layout-mode-toggle[data-mode="flow"] .layout-mode-slider {
            transform: translateX(0);
        }

        .layout-mode-toggle[data-mode="absolute"] .layout-mode-slider {
            transform: translateX(calc(100% + 4px));
        }

        /* Container indicator */

        .container-indicator {
            padding: 8px 12px;
            background: var(--bg-tertiary);
            border-bottom: 1px solid var(--border-color);
            font-size: 13px;
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .container-indicator .container-name {
            font-weight: 600;
            color: var(--accent-color);
        }

        .animation-hint {
            padding: 8px 10px;
            border: 1px dashed var(--border-color);
            border-radius: 4px;
            background: var(--bg-secondary);
            font-size: 11px;
            color: var(--text-secondary);
            line-height: 1.4;
        }
    `];let Ea=Ca;ba([pt({context:s})],Ea.prototype,"documentModel"),ba([pt({context:le})],Ea.prototype,"containerManager"),ba([pt({context:de})],Ea.prototype,"styleResolver"),ba([pt({context:d})],Ea.prototype,"eventBus"),ba([pt({context:ce,subscribe:!0}),st()],Ea.prototype,"themeMode"),ba([tt({type:Object,attribute:!1})],Ea.prototype,"hass"),ba([tt({type:Number})],Ea.prototype,"canvasWidth"),ba([tt({type:Number})],Ea.prototype,"canvasHeight"),ba([st()],Ea.prototype,"selectedBlock"),ba([st()],Ea.prototype,"panelState"),ba([st()],Ea.prototype,"resolvedStyles"),ba([st()],Ea.prototype,"baseResolvedStyles"),ba([st()],Ea.prototype,"visibleProperties"),ba([st()],Ea.prototype,"presets"),ba([st()],Ea.prototype,"activeTargetId"),ba([st()],Ea.prototype,"slots"),ba([st()],Ea.prototype,"styleClipboard"),ba([st()],Ea.prototype,"copyDialogOpen"),ba([st()],Ea.prototype,"copyCandidate"),ba([st()],Ea.prototype,"copySelectedTargets"),ba([st()],Ea.prototype,"copySelectedContainers"),ba([st()],Ea.prototype,"copySelectedApplyWarning"),ba([st()],Ea.prototype,"saveDialogOpen"),ba([st()],Ea.prototype,"managerDialogOpen"),ba([st()],Ea.prototype,"bindingEditorOpen"),ba([st()],Ea.prototype,"bindingEditorTarget"),ba([st()],Ea.prototype,"expandedSections"),ba([st()],Ea.prototype,"backgroundImageMode"),ba([st()],Ea.prototype,"pendingMediaRequestId"),ba([st()],Ea.prototype,"animationEditorOpen"),ba([st()],Ea.prototype,"animationEditorTarget"),er.define("panel-styles",Ea);var Ia=Object.defineProperty,Ma=Object.getOwnPropertyDescriptor,Pa=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Ma(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Ia(t,i,a),a};const Ta={tap:"Tap",double_tap:"Double Tap",hold:"Hold"};let Ba=class extends Fi{constructor(){super(...arguments),this.slots=[],this.showManagement=!0}get showSearch(){return this.slots.length>5}get searchPlaceholder(){return"Search action slots..."}renderTriggerIcon(){return ot`<ha-icon icon="mdi:flash"></ha-icon>`}renderTriggerLabel(){const e=this._getSelectedSlot();return ot`
            ${e?ot`${e.name||e.id} (${Ta[e.trigger]})`:ot`<span class="placeholder">Select action slot</span>`}
        `}renderDropdownContent(){const e=this._getFilteredSlots();return ot`
            <div class="option-list">
                <div
                    class="option-item ${this.selectedSlotId?"":"selected"}"
                    @click=${()=>this._selectSlot(null)}
                >
                    <span class="icon">
                        <ha-icon icon="mdi:close-circle-outline"></ha-icon>
                    </span>
                    <div class="info">
                        <div class="name">No slot</div>
                        <div class="description">Clear slot selection</div>
                    </div>
                    ${this.selectedSlotId?dt:ot`<span class="check">✓</span>`}
                </div>

                ${e.length>0?ot`
                    <div class="divider"></div>
                    ${e.map(e=>ot`
                        <div
                            class="option-item ${e.id===this.selectedSlotId?"selected":""}"
                            @click=${()=>this._selectSlot(e.id)}
                        >
                            <span class="icon">
                                <ha-icon icon="mdi:flash"></ha-icon>
                            </span>
                            <div class="info">
                                <div class="name">${e.name||e.id}</div>
                                ${e.description?ot`
                                    <div class="description">${e.description}</div>
                                `:dt}
                                <div class="meta">${this._formatAction(e)}</div>
                            </div>
                            ${e.id===this.selectedSlotId?ot`<span class="check">✓</span>`:dt}
                        </div>
                    `)}
                `:this._searchFilter?ot`
                    <div class="empty-message">No slots match "${this._searchFilter}"</div>
                `:ot`
                    <div class="empty-message">No action slots available</div>
                `}
            </div>

            ${this.showManagement?ot`
                <div class="divider"></div>
                <div class="action-item" @click=${this._handleManageSlots}>
                    <span class="icon">
                        <ha-icon icon="mdi:cog"></ha-icon>
                    </span>
                    <span>Manage action slots...</span>
                </div>
            `:dt}
        `}_selectSlot(e){this._closeDropdown(),this.dispatchEvent(new CustomEvent("action-slot-selected",{detail:{slotId:e},bubbles:!0,composed:!0}))}_handleManageSlots(){this._closeDropdown(),this.dispatchEvent(new CustomEvent("manage-action-slots",{bubbles:!0,composed:!0}))}_getSelectedSlot(){if(this.selectedSlotId)return this.slots.find(e=>e.id===this.selectedSlotId)}_getFilteredSlots(){return this._searchFilter?this.slots.filter(e=>{var t,i;return e.id.toLowerCase().includes(this._searchFilter)||(null==(t=e.name)?void 0:t.toLowerCase().includes(this._searchFilter))||(null==(i=e.description)?void 0:i.toLowerCase().includes(this._searchFilter))}):this.slots}_formatAction(e){return`${Ta[e.trigger]??e.trigger} • ${this._formatActionSummary(e.action)}`}_formatActionSummary(e){const t=this._getActionLabel(e.action);if("call-service"===e.action||"perform-action"===e.action){const i=this._getServiceValue(e);return i?`${t}: ${i}`:t}return"navigate"===e.action&&"navigation_path"in e?`${t}: ${e.navigation_path||""}`:"url"===e.action&&"url_path"in e?`${t}: ${e.url_path||""}`:t}_getActionLabel(e){return{none:"None",toggle:"Toggle","call-service":"Call Service","perform-action":"Perform Action",navigate:"Navigate","more-info":"More Info",url:"Open URL","fire-dom-event":"Fire Event","toggle-menu":"Toggle Menu"}[e]??e}_getServiceValue(e){return"perform_action"in e&&"string"==typeof e.perform_action&&e.perform_action?e.perform_action:"service"in e&&"string"==typeof e.service&&e.service?e.service:"domain"in e&&"string"==typeof e.domain&&"service"in e&&"string"==typeof e.service?`${e.domain}.${e.service}`:void 0}};Pa([tt({attribute:!1})],Ba.prototype,"slots",2),Pa([tt({type:String})],Ba.prototype,"selectedSlotId",2),Pa([tt({type:Boolean})],Ba.prototype,"showManagement",2),Ba=Pa([rt("action-slot-selector")],Ba);var Ra=Object.defineProperty,Da=(e,t,i,o)=>{for(var r,a=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(t,i,a)||a);return a&&Ra(t,i,a),a};const Oa={tap:"Tap",double_tap:"Double Tap",hold:"Hold"},Aa=class extends Ii{constructor(){super(...arguments),this.selectedBlock=null,this.activeTargetId="block",this.actionSlots=[],this.isAddOpen=!1,this._toggleAddAction=()=>{this.isAddOpen=!this.isAddOpen},this._onActionSlotSelected=e=>{var t;const i=e.detail.slotId;if(!i||!this.selectedBlock)return void(this.isAddOpen=!1);if(!this.activeTargetId)return void(this.isAddOpen=!1);const o={targets:{...(null==(t=this.selectedBlock.actions)?void 0:t.targets)||{}}},r=[...o.targets[this.activeTargetId]||[]];r.includes(i)||r.push(i),o.targets[this.activeTargetId]=r,this.documentModel.updateBlock(this.selectedBlock.id,{actions:o}),this.isAddOpen=!1}}connectedCallback(){super.connectedCallback(),this._refreshActionSlots(),this.documentModel.addEventListener("selection-changed",e=>{const t=e.detail;this.selectedBlock=t.selectedBlock||null,this.activeTargetId="block",this.isAddOpen=!1}),this.documentModel.addEventListener("block-updated",e=>{const t=e.detail;this.selectedBlock&&t.block.id===this.selectedBlock.id&&(this.selectedBlock={...t.block},this._ensureActiveTargetAvailable())}),this.documentModel.addEventListener("slot-actions-changed",()=>{this._refreshActionSlots()})}render(){return this.selectedBlock?ot`
            <div class="panel-content">
                ${this._renderTargetSection()}
                ${this._renderActionsSection()}
            </div>
        `:ot`
                <div class="empty-state">
                    <ha-icon icon="mdi:gesture-tap-button"></ha-icon>
                    <div>Select an element to edit its actions</div>
                </div>
            `}_renderTargetSection(){if(!this.selectedBlock)return dt;const e=this._getActionTargets(),t=Object.entries(e).filter(([e])=>"block"!==e).map(([e,t])=>({label:t.label,value:e,description:t.description}));return 0===t.length?dt:ot`
            <div class="panel-section">
                <span class="section-title">Action Target</span>
                <block-target-selector
                    .value=${this.activeTargetId}
                    .options=${t}
                    @change=${this._onTargetChanged}
                ></block-target-selector>
            </div>
        `}_renderActionsSection(){if(!this.selectedBlock)return dt;const e=this._getActionTargets();if(!(Object.keys(e).length>0))return ot`
                <div class="panel-section">
                    <span class="section-title">Actions</span>
                    <div class="no-targets">
                        This block does not expose any action targets.
                    </div>
                </div>
            `;const t=this._getAssignedActionSlots(),i=this.actionSlots.length>0;return ot`
            <div class="panel-section">
                <span class="section-title">Actions</span>

                ${0===t.length?ot`
                    <div class="empty-message">No actions configured for this target.</div>
                `:ot`
                    ${t.map((e,t)=>this._renderActionSummary(e.slotId,e.slot,t))}
                `}

                <button class="add-btn" @click=${this._toggleAddAction} ?disabled=${!i}>
                    + Add Action
                </button>

                ${i?dt:ot`
                    <div class="info-text">No action slots defined. Use the header “Action Slots” to create one.</div>
                `}

                ${this.isAddOpen&&i?ot`
                    <div class="add-action-picker">
                        <action-slot-selector
                            .slots=${this.actionSlots}
                            @action-slot-selected=${this._onActionSlotSelected}
                        ></action-slot-selector>
                    </div>
                `:dt}
            </div>
        `}_renderActionSummary(e,t,i){const o=t?t.name||t.id:`Missing slot: ${e}`,r=t?this._formatActionSlotSummary(t):"Slot not found";return ot`
            <div class="action-summary">
                <div class="action-summary-info">
                    <div class="action-summary-title">${o}</div>
                    <div class="action-summary-detail">${r}</div>
                </div>
                <div class="action-summary-controls">
                    <button class="icon-btn danger" @click=${()=>this._removeActionSlot(e,i)}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                    </button>
                </div>
            </div>
        `}_getActionTargets(){return this.selectedBlock?this.blockRegistry.getBlockActionTargetsForBlock(this.selectedBlock):{block:{label:"Block"}}}_getAssignedActionSlots(){var e,t;if(!this.selectedBlock)return[];return((null==(t=null==(e=this.selectedBlock.actions)?void 0:e.targets)?void 0:t[this.activeTargetId])??[]).map(e=>({slotId:e,slot:this.actionSlots.find(t=>t.id===e)||null}))}_ensureActiveTargetAvailable(){if(!this.selectedBlock)return;const e=this._getActionTargets();if(0===Object.keys(e).length)return void(this.activeTargetId="");if(e[this.activeTargetId])return;const t=Object.keys(e)[0];this.activeTargetId=t??""}_removeActionSlot(e,t){var i;if(!this.selectedBlock)return;const o={targets:{...(null==(i=this.selectedBlock.actions)?void 0:i.targets)||{}}},r=[...o.targets[this.activeTargetId]||[]];if(0===r.length)return;if(r[t]===e)r.splice(t,1);else{const t=r.indexOf(e);t>=0&&r.splice(t,1)}0===r.length?delete o.targets[this.activeTargetId]:o.targets[this.activeTargetId]=r;const a=Object.keys(o.targets).length>0;this.documentModel.updateBlock(this.selectedBlock.id,{actions:a?o:void 0})}_onTargetChanged(e){const t=e.detail.value;this.activeTargetId=t||"block",this.isAddOpen=!1}_formatActionSlotSummary(e){return`${Oa[e.trigger]??e.trigger} • ${this._formatActionSummary(e.action)}`}_formatActionSummary(e){const t=this._getActionLabel(e.action);if("call-service"===e.action||"perform-action"===e.action){const i=this._getServiceValue(e);return`${t}${i?`: ${i}`:""}`}return"navigate"===e.action&&"navigation_path"in e?`${t}: ${e.navigation_path||""}`:"url"===e.action&&"url_path"in e?`${t}: ${e.url_path||""}`:t}_getActionLabel(e){return{none:"None",toggle:"Toggle","call-service":"Call Service","perform-action":"Perform Action",navigate:"Navigate","more-info":"More Info",url:"Open URL","fire-dom-event":"Fire Event","toggle-menu":"Toggle Menu"}[e]??e}_getServiceValue(e){return"perform_action"in e&&"string"==typeof e.perform_action&&e.perform_action?e.perform_action:"service"in e&&"string"==typeof e.service&&e.service?e.service:"domain"in e&&"string"==typeof e.domain&&"service"in e&&"string"==typeof e.service?`${e.domain}.${e.service}`:void 0}_refreshActionSlots(){this.actionSlots=this.documentModel.getSlotActions()}_onEntityConfigChanged(e){this.selectedBlock&&this.documentModel.updateBlock(this.selectedBlock.id,{entityConfig:e.detail})}_onSelectSourceBlock(e){const{blockId:t}=e.detail;this.documentModel.select(t)}};Aa.styles=[...Ii.styles,et`
            .panel-content {
                padding: 0;
            }

            .section-title {
                display: block;
                margin-bottom: 12px;
                font-size: 11px;
                font-weight: 600;
                color: var(--text-primary, #333);
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }

            .panel-section {
                padding: 12px;
                border-bottom: 1px solid var(--border-color, #e0e0e0);
                background: var(--bg-primary, #fff);
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .panel-section:last-child {
                border-bottom: none;
            }

            .info-text {
                font-size: 11px;
                color: var(--text-secondary, #666);
            }

            .add-btn {
                align-items: center;
                padding: 6px 10px;
                border: 1px dashed var(--border-color, #d4d4d4);
                border-radius: 3px;
                background: transparent;
                color: var(--text-secondary, #666);
                font-size: 12px;
                cursor: pointer;
            }

            .add-btn:hover {
                border-color: var(--accent-color, #0078d4);
                color: var(--accent-color, #0078d4);
            }

            .add-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .action-summary {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                padding: 8px 10px;
                border: 1px solid var(--border-color, #e0e0e0);
                border-radius: 6px;
                background: var(--bg-secondary, #f9f9f9);
            }

            .action-summary-info {
                display: flex;
                flex-direction: column;
                gap: 4px;
                min-width: 0;
            }

            .action-summary-title {
                font-size: 12px;
                font-weight: 600;
                color: var(--text-primary, #333);
            }

            .action-summary-detail {
                font-size: 11px;
                color: var(--text-secondary, #666);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .action-summary-controls {
                display: flex;
                gap: 6px;
            }

            .icon-btn {
                padding: 4px 6px;
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 3px;
                background: var(--bg-primary, #fff);
                color: var(--text-secondary, #666);
                cursor: pointer;
                line-height: 1;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .icon-btn:hover {
                background: var(--bg-secondary, #f5f5f5);
            }

            .icon-btn.danger:hover {
                background: #fee;
                border-color: #f88;
                color: #c00;
            }

            .empty-message {
                font-size: 11px;
                color: var(--text-secondary, #666);
            }

            .no-targets {
                font-size: 13px;
                color: var(--text-secondary, #666);
            }

            .add-action-picker {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
        `];let za=Aa;Da([pt({context:s})],za.prototype,"documentModel"),Da([pt({context:r})],za.prototype,"blockRegistry"),Da([tt({attribute:!1})],za.prototype,"hass"),Da([st()],za.prototype,"selectedBlock"),Da([st()],za.prototype,"activeTargetId"),Da([st()],za.prototype,"actionSlots"),Da([st()],za.prototype,"isAddOpen"),er.define("panel-actions",za);var La=Object.defineProperty,Na=Object.getOwnPropertyDescriptor,Fa=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Na(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&La(t,i,a),a};let Va=class extends it{constructor(){super(...arguments),this.width=260,this._width=260,this._isResizing=!1,this._startX=0,this._startWidth=0}connectedCallback(){super.connectedCallback(),this._width=this.width,this._updateHostWidth()}render(){const e=[{id:"properties",label:"Properties",component:"panel-properties",props:{hass:this.hass}},{id:"styles",label:"Styles",component:"panel-style",props:{hass:this.hass,canvasWidth:this.canvasWidth,canvasHeight:this.canvasHeight,canvas:this.canvas}},{id:"actions",label:"Actions",component:"panel-actions",props:{hass:this.hass}}];return ot`
            <div class="resize-handle ${this._isResizing?"resizing":""}"
                 @mousedown=${this._handleResizeStart}></div>
            <div class="sidebar-content">
                <sidebar-tabbed .tabs=${e}></sidebar-tabbed>
            </div>
        `}updated(e){super.updated(e),e.has("canvas")&&this.canvas&&this._updateStylePanelCanvas(),e.has("width")&&!this._isResizing&&(this._width=this.width,this._updateHostWidth())}_updateHostWidth(){this.style.width=`${this._width}px`}_handleResizeStart(e){e.preventDefault(),this._isResizing=!0,this._startX=e.clientX,this._startWidth=this._width;const t=e=>{if(!this._isResizing)return;const t=this._startX-e.clientX,i=Math.max(Va.MIN_WIDTH,Math.min(Va.MAX_WIDTH,this._startWidth+t));this._width=i,this._updateHostWidth(),this.dispatchEvent(new CustomEvent("right-sidebar-width-changed",{detail:{width:i},bubbles:!0,composed:!0}))},i=()=>{this._isResizing&&(this._isResizing=!1,document.removeEventListener("mousemove",t),document.removeEventListener("mouseup",i))};document.addEventListener("mousemove",t),document.addEventListener("mouseup",i)}_updateStylePanelCanvas(){var e;const t=null==(e=this.shadowRoot)?void 0:e.querySelector("sidebar-tabbed");if(null==t?void 0:t.shadowRoot){const e=t.shadowRoot.querySelector("panel-style");e&&this.canvas&&(e.canvas=this.canvas)}}};Va.styles=et`
        :host {
            display: block;
            height: 100%;
            width: 260px;
            position: relative;
        }

        .resize-handle {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 10px;
            cursor: ew-resize;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .resize-handle::before {
            content: '';
            width: 4px;
            height: 40px;
            background: var(--border-color, #d4d4d4);
            border-radius: 2px;
            transition: background 0.2s ease;
        }

        .resize-handle:hover::before,
        .resize-handle.resizing::before {
            background: var(--accent-color, #0078d4);
        }

        .sidebar-content {
            height: 100%;
            width: 100%;
        }
    `,Va.MIN_WIDTH=200,Va.MAX_WIDTH=600,Fa([tt({type:Number})],Va.prototype,"canvasWidth",2),Fa([tt({type:Number})],Va.prototype,"canvasHeight",2),Fa([tt({type:Object})],Va.prototype,"canvas",2),Fa([tt({attribute:!1})],Va.prototype,"hass",2),Fa([tt({type:Number})],Va.prototype,"width",2),Fa([st()],Va.prototype,"_width",2),Fa([st()],Va.prototype,"_isResizing",2),Va=Fa([rt("sidebar-right")],Va);var Ua=Object.defineProperty,ja=Object.getOwnPropertyDescriptor,Wa=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?ja(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Ua(t,i,a),a};let Ga=class extends Ii{constructor(){super(...arguments),this.selectedId=null,this.blocks={},this.expandedBlocks=new Set,this.autoExpandedBlocks=new Set,this.showAbsoluteSeparated=!1}connectedCallback(){super.connectedCallback(),this._onModelChange(),this.documentModel.addEventListener("change",()=>this._onModelChange()),this.documentModel.addEventListener("selection-changed",e=>{const t=e.detail.selectedId;if(this.autoExpandedBlocks.forEach(e=>{this.expandedBlocks.has(e)}),this.autoExpandedBlocks.clear(),t){const e=this.blocks[t];if(this.showAbsoluteSeparated&&"absolute"===(null==e?void 0:e.layout))this.expandedBlocks.has("absolute-root")||this.autoExpandedBlocks.add("absolute-root");else{this._getParentChain(t).forEach(e=>{this.expandedBlocks.has(e)||this.autoExpandedBlocks.add(e)})}}this.selectedId=t,this.requestUpdate()}),this.expandedBlocks.add(this.documentModel.rootId)}render(){const e=this.blocks[this.documentModel.rootId],t=Object.values(this.blocks).filter(e=>"absolute"===e.layout&&e.id!==this.documentModel.rootId);return ot`
            <div class="layers-header">
                <div class="layers-title">Layers</div>
                <div 
                    class="toggle-absolute ${this.showAbsoluteSeparated?"active":""}"
                    @click=${this._toggleAbsoluteMode}
                    title="Toggle absolute blocks visualization"
                >
                    <span class="toggle-icon"><ha-icon icon="mdi:crosshairs-gps"></ha-icon></span>
                    <span>${this.showAbsoluteSeparated?"Separated":"Nested"}</span>
                </div>
            </div>
            <div class="panel-content">
                ${this._renderLayer(e,0)}
                ${this.showAbsoluteSeparated&&t.length>0?ot`
                    <div class="absolute-root">
                        ${this._renderAbsoluteRoot(t)}
                    </div>
                `:""}
            </div>
        `}_onModelChange(){this.blocks={...this.documentModel.blocks},this.requestUpdate()}_getParentChain(e){var t;const i=[];let o=e;for(;o&&o!==this.documentModel.rootId;){let e=null;for(const[i,r]of Object.entries(this.blocks))if(null==(t=r.children)?void 0:t.includes(o)){e=i;break}if(!e)break;i.push(e),o=e}return i}_renderLayer(e,t){const i=this.blockRegistry.getBlock(e.type),o=e.id===this.documentModel.rootId?'<ha-icon icon="mdi:card-outline"></ha-icon>':(null==i?void 0:i.icon)||"?",{displayLabel:r,typeLabel:a,hasCustomLabel:s}=this._getLayerDisplay(e),n=(e.children||[]).reduce((e,t)=>{const i=this.blocks[t];let o=[i];return this.documentModel.isHidden(t)&&(o=(i.children||[]).map(e=>this.blocks[e])),o.forEach(t=>{this.showAbsoluteSeparated&&"flow"!==t.layout||e.push(t)}),e},[]),l=n.length>0,d=this.expandedBlocks.has(e.id)||this.autoExpandedBlocks.has(e.id),c=this.selectedId===e.id;return ot`
            <div>
                <div
                    class="layer-item ${c?"selected":""}"
                    @click=${t=>this._onLayerClick(t,e.id)}
                >
            <span
                  class="layer-toggle ${l?d?"expanded":"":"empty"}"
                  @click=${t=>this._onToggleClick(t,e.id)}
            ></span>
                    <span class="layer-icon">${at(o)}</span>
                    <span class="layer-label">
                        <span class="layer-label-text">${r}</span>
                        ${s?ot`<span class="layer-type">${a}</span>`:""}
                    </span>
                    ${this.showAbsoluteSeparated||"absolute"!==e.layout||e.id===this.documentModel.rootId?"":ot`
                        <span class="layer-absolute-badge">Abs</span>
                    `}
                </div>
                ${l&&d?ot`
                    <div class="layer-children">
                        ${n.map(e=>this._renderLayer(e,t+1))}
                    </div>
                `:""}
            </div>
        `}_onLayerClick(e,t){e.stopPropagation(),this.documentModel.select(t)}_onToggleClick(e,t){e.stopPropagation();const i=this.blocks[t];i.children&&i.children.some(e=>{const t=this.blocks[e];return t&&"flow"===t.layout})&&(this.expandedBlocks.has(t)?this.expandedBlocks.delete(t):this.expandedBlocks.add(t),this.requestUpdate())}_toggleAbsoluteMode(){this.showAbsoluteSeparated=!this.showAbsoluteSeparated,this.requestUpdate()}_getLayerDisplay(e){const t=this.blockRegistry.getBlock(e.type),i=e.id===this.documentModel.rootId?"Card":(null==t?void 0:t.label)||e.type;return{displayLabel:this.documentModel.getBlockDisplayName(e,i),typeLabel:i,hasCustomLabel:Boolean(this.documentModel.getBlockLabel(e))}}_renderAbsoluteRoot(e){const t=this.expandedBlocks.has("absolute-root")||this.autoExpandedBlocks.has("absolute-root");return ot`
            <div>
                <div
                    class="layer-item"
                    @click=${e=>{e.stopPropagation(),this.expandedBlocks.has("absolute-root")?this.expandedBlocks.delete("absolute-root"):this.expandedBlocks.add("absolute-root"),this.requestUpdate()}}
                >
                    <span class="layer-toggle ${t?"expanded":""}"></span>
                    <span class="layer-icon"><ha-icon icon="mdi:crosshairs-gps"></span>
                    <span class="layer-label">Absolute Blocks</span>
                </div>
                ${t?ot`
                    <div class="layer-children">
                        ${e.map(e=>this._renderAbsoluteBlock(e))}
                    </div>
                `:""}
            </div>
        `}_renderAbsoluteBlock(e){const t=this.blockRegistry.getBlock(e.type),i=(null==t?void 0:t.icon)||"?",{displayLabel:o,typeLabel:r,hasCustomLabel:a}=this._getLayerDisplay(e),s=this.selectedId===e.id,n=e.parentId?this.blocks[e.parentId]:null,l=n?this._getLayerDisplay(n):null;return ot`
            <div
                class="layer-item ${s?"selected":""}"
                @click=${t=>this._onLayerClick(t,e.id)}
            >
                <span class="layer-toggle empty"></span>
                <span class="layer-icon">${at(i)}</span>
                <span class="layer-label">
                    <span class="layer-label-text">${o}</span>
                    ${a?ot`<span class="layer-type">${r}</span>`:""}
                </span>
                ${l?ot`
                    <span class="layer-parent-ref">
                        in: 
                        <span 
                            class="parent-link"
                            @click=${t=>{t.stopPropagation(),e.parentId&&this.documentModel.select(e.parentId)}}
                        >
                            ${l.displayLabel}
                            ${l.hasCustomLabel?ot`<span class="layer-type">${l.typeLabel}</span>`:""}
                        </span>
                    </span>
                `:""}
            </div>
        `}};Ga.styles=[...Ii.styles,et`
            :host {
                --mdc-icon-size: 18px;
            }
            .layers-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 12px;
                border-bottom: 1px solid var(--divider-color);
                background: var(--bg-secondary);
            }

            .layers-title {
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                color: var(--text-secondary);
                letter-spacing: 0.5px;
            }

            .toggle-absolute {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                color: var(--text-secondary);
                background: var(--bg-primary);
                border: 1px solid var(--divider-color);
                transition: all 0.15s ease;
            }

            .toggle-absolute:hover {
                background: var(--bg-tertiary);
                border-color: var(--accent-color);
            }

            .toggle-absolute.active {
                background: var(--accent-color);
                color: white;
                border-color: var(--accent-color);
            }

            .toggle-icon {
                width: 14px;
                height: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .layer-item {
                display: flex;
                align-items: center;
                padding: 6px 8px;
                cursor: pointer;
                user-select: none;
                border-radius: 4px;
                font-size: 12px;
                color: var(--text-primary);
                transition: background 0.15s ease;
            }

            .layer-item:hover {
                background: var(--bg-tertiary);
            }

            .layer-item.selected {
                background: var(--accent-color);
                color: white;
                font-weight: 500;
            }

            .layer-item.selected:hover {
                background: var(--accent-color);
                opacity: 0.95;
            }

            .layer-parent-ref {
                margin-left: auto;
                padding-left: 8px;
                font-size: 10px;
                color: var(--text-tertiary);
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .layer-item.selected .layer-parent-ref {
                color: rgba(255, 255, 255, 0.7);
            }

            .parent-link {
                text-decoration: underline;
                cursor: pointer;
                transition: opacity 0.15s ease;
            }

            .parent-link:hover {
                opacity: 0.7;
            }

            .layer-toggle {
                width: 16px;
                height: 16px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-right: 4px;
                cursor: pointer;
                flex-shrink: 0;
            }

            .layer-toggle::before {
                content: '';
                display: inline-block;
                width: 0;
                height: 0;
                border-left: 4px solid var(--text-secondary);
                border-top: 3px solid transparent;
                border-bottom: 3px solid transparent;
                transition: transform 0.2s;
            }

            .layer-item.selected .layer-toggle::before {
                border-left-color: white;
            }

            .layer-toggle.expanded::before {
                transform: rotate(90deg);
            }

            .layer-toggle.empty {
                visibility: hidden;
            }

            .layer-icon {
                width: 18px;
                height: 18px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-right: 8px;
                font-size: 14px;
                flex-shrink: 0;
            }

            .layer-label {
                flex: 1;
                min-width: 0;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .layer-label-text {
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .layer-type {
                margin-left: 6px;
                font-size: 9px;
                letter-spacing: 0.3px;
                color: var(--text-tertiary);
            }

            .layer-item.selected .layer-type {
                color: rgba(255, 255, 255, 0.7);
            }

            .layer-absolute-badge {
                margin-left: 6px;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 9px;
                font-weight: 600;
                text-transform: uppercase;
                background: var(--accent-color);
                color: white;
                letter-spacing: 0.3px;
                flex-shrink: 0;
            }

            .layer-item.selected .layer-absolute-badge {
                background: rgba(255, 255, 255, 0.3);
            }

            .layer-children {
                padding-left: 16px;
            }

            .absolute-root {
                margin-top: 8px;
            }
        `],Wa([pt({context:s})],Ga.prototype,"documentModel",2),Wa([pt({context:r})],Ga.prototype,"blockRegistry",2),Wa([st()],Ga.prototype,"selectedId",2),Wa([st()],Ga.prototype,"blocks",2),Wa([st()],Ga.prototype,"expandedBlocks",2),Wa([st()],Ga.prototype,"autoExpandedBlocks",2),Wa([st()],Ga.prototype,"showAbsoluteSeparated",2),Ga=Wa([rt("panel-layers")],Ga);var Ha=Object.getOwnPropertyDescriptor;let qa=class extends it{render(){return ot`
      <sidebar-tabbed .tabs=${[{id:"blocks",label:"Blocks",component:"panel-blocks"},{id:"layers",label:"Layers",component:"panel-layers"}]}></sidebar-tabbed>
    `}};qa.styles=et`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
  `,qa=((e,t,i,o)=>{for(var r,a=o>1?void 0:o?Ha(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(a)||a);return a})([rt("sidebar-left")],qa);var Ya=Object.defineProperty,Xa=(e,t,i,o)=>{for(var r,a=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(t,i,a)||a);return a&&Ya(t,i,a),a};const Ka=class extends Fi{constructor(){super(...arguments),this.containers=[]}get showSearch(){return this.containers.length>5}get searchPlaceholder(){return"Search containers..."}renderTriggerIcon(){const e=this._getActiveContainer();return e?this._renderContainerIcon(e):dt}renderTriggerLabel(){const e=this._getActiveContainer();return e?ot`${e.name}${this._formatWidth(e.width)}`:ot`<span class="placeholder">Select container</span>`}renderDropdownContent(){const e=this._getFilteredContainers();return ot`
            <div class="option-list">
                ${e.length>0?e.map(e=>ot`
                    <div
                        class="option-item ${e.id===this.activeContainerId?"selected":""} ${e.disabled?"disabled":""}"
                        @click=${()=>{var t;return null==(t=this._selectContainer)?void 0:t.call(this,e)}}
                    >
                        <span class="icon">${this._renderContainerIcon(e)}</span>
                        <div class="info">
                            <div class="name">${e.name||e.id}</div>
                            <div class="description">${this._getContainerDescription(e)}</div>
                            <div class="meta">${this._getContainerMeta(e)}</div>
                        </div>
                        ${e.id===this.activeContainerId?ot`<span class="check">✓</span>`:dt}
                    </div>
                `):this._searchFilter?ot`
                    <div class="empty-message">No containers match "${this._searchFilter}"</div>
                `:ot`
                    <div class="empty-message">No containers available</div>
                `}
            </div>
        `}_selectContainer(e){}_renderContainerIcon(e){const t=e.icon||"mdi:border-radius";return ot`<ha-icon icon=${t}></ha-icon>`}_getActiveContainer(){return this.containers.find(e=>e.id===this.activeContainerId)||this.containers[0]}_getFilteredContainers(){return this._searchFilter?this.containers.filter(e=>e.id.toLowerCase().includes(this._searchFilter)||e.name.toLowerCase().includes(this._searchFilter)):this.containers}_formatWidth(e){return e?` (${e}px)`:""}_getContainerDescription(e){return e.width?`Max width: ${e.width}px`:"No width limit"}_getContainerMeta(e){return`${e.isDefault?"Default":e.isDevice?"Device":"Container"} • ID: ${e.id}`}};Ka.styles=[Fi.styles,et`
            :host {
                min-width: 180px;
            }
            .selector-button {
                --mdc-icon-size: 18px;
                padding: 4px 12px;
            }
            .option-item {
                --mdc-icon-size: 20px;
            }
            .option-item.disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `];let Ja=Ka;Xa([tt({type:Array})],Ja.prototype,"containers"),Xa([tt({type:String})],Ja.prototype,"activeContainerId"),er.define("container-selector",Ja);var Qa=Object.defineProperty;const Za=class extends it{constructor(){super(...arguments),this.open=!1,this.handleClose=()=>{this.onBeforeClose(),this.dispatchEvent(new CustomEvent("overlay-close",{bubbles:!0,composed:!0}))},this._handleBackdropClick=e=>{this.closeOnBackdrop&&e.target===e.currentTarget&&this.handleClose()},this._handleEscape=e=>{this.closeOnEscape&&"Escape"===e.key&&this.handleClose()}}get dialogSubtitle(){return null}get closeLabel(){return"Close"}get showCloseButton(){return!0}get closeOnBackdrop(){return!0}get closeOnEscape(){return!0}renderDialogHeaderActions(){return dt}renderDialogTop(){return dt}renderDialogFooter(){return dt}onBeforeClose(){}updated(e){e.has("open")&&(this.open&&this.closeOnEscape?this._addEscapeListener():this._removeEscapeListener())}disconnectedCallback(){super.disconnectedCallback(),this._removeEscapeListener()}render(){return this.open?ot`
            <div class="overlay-backdrop" @click=${this._handleBackdropClick}></div>
            <div class="dialog">
                ${this.renderDialogHeader()}
                ${this.renderDialogTop()}
                <div class="dialog-body">
                    ${this.renderDialogBody()}
                </div>
                ${this.renderDialogFooter()}
            </div>
        `:ot``}renderDialogHeader(){return ot`
            <div class="dialog-header">
                <div class="dialog-header-text">
                    <div class="dialog-title">${this.dialogTitle}</div>
                    ${this.dialogSubtitle?ot`
                        <div class="dialog-subtitle">${this.dialogSubtitle}</div>
                    `:dt}
                </div>
                <div class="dialog-header-actions">
                    ${this.renderDialogHeaderActions()}
                    ${this.showCloseButton?ot`
                        <button class="dialog-close" @click=${this.handleClose}>
                            ${this.closeLabel}
                        </button>
                    `:dt}
                </div>
            </div>
        `}_addEscapeListener(){window.addEventListener("keydown",this._handleEscape)}_removeEscapeListener(){window.removeEventListener("keydown",this._handleEscape)}};Za.styles=[et`
        :host {
            position: fixed;
            inset: 0;
            z-index: 190;
            pointer-events: none;
            display: block;
        }

        :host([open]) {
            pointer-events: auto;
        }

        .overlay-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.55);
            opacity: 0;
            transition: opacity 0.25s ease;
        }

        :host([open]) .overlay-backdrop {
            opacity: 1;
        }

        .dialog {
            position: absolute;
            top: 50%;
            left: 50%;
            width: var(--overlay-dialog-width, min(92vw, 1400px));
            height: var(--overlay-dialog-height, min(86vh, 860px));
            transform: translate(-50%, -48%) scale(0.98);
            background: var(--bg-primary, #fff);
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
            display: flex;
            flex-direction: column;
            opacity: 0;
            transition: transform 0.25s ease, opacity 0.25s ease;
            overflow: hidden;
        }

        :host([open]) .dialog {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }

        .dialog-header {
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color, #e0e0e0);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            background: var(--bg-secondary, #f5f5f5);
        }

        .dialog-header-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .dialog-title {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-primary, #333);
        }

        .dialog-subtitle {
            font-size: 12px;
            color: var(--text-secondary, #666);
        }

        .dialog-header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .dialog-close {
            border: 1px solid var(--border-color, #d4d4d4);
            background: var(--bg-primary, #fff);
            color: var(--text-primary, #333);
            border-radius: 4px;
            padding: 6px 10px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .dialog-body {
            flex: 1;
            overflow: hidden;
        }

        .dialog-footer {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            border-top: 1px solid var(--border-color, #e0e0e0);
            background: var(--bg-secondary, #f5f5f5);
        }

        .footer-spacer {
            flex: 1;
        }

        .primary-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            background: var(--accent-color, #2196f3);
            color: #fff;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            text-transform: uppercase;
            --mdc-icon-size: 18px;
        }

        .secondary-btn {
            padding: 6px 12px;
            border: 1px solid var(--border-color, #d4d4d4);
            border-radius: 4px;
            background: var(--bg-primary, #fff);
            color: var(--text-primary, #333);
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            text-transform: uppercase;
        }

        .danger-btn {
            border: 1px solid rgba(211, 47, 47, 0.4);
            background: rgba(211, 47, 47, 0.1);
            color: #b71c1c;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            text-transform: uppercase;
        }

        .primary-btn:disabled,
        .secondary-btn:disabled,
        .danger-btn:disabled,
        .dialog-close:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    `];let es=Za;((e,t,i)=>{for(var o,r=void 0,a=e.length-1;a>=0;a--)(o=e[a])&&(r=o(t,i,r)||r);r&&Qa(t,i,r)})([tt({type:Boolean,reflect:!0})],es.prototype,"open");var ts=Object.defineProperty,is=(e,t,i,o)=>{for(var r,a=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(t,i,a)||a);return a&&ts(t,i,a),a};const os=class extends es{constructor(){super(...arguments),this.slots=[],this.referencesStates={},this.formMode=null,this.editingSlotId=null,this.formSlotId="",this.formSlotName="",this.formSlotDescription="",this.formError=null,this.toastMessage=null,this.toastTimeoutId=null,this._handleSlotsChanged=()=>{this._refreshSlots()},this._handleNewSlot=()=>{this.formMode="create",this.editingSlotId=null,this.formError=null,this._resetFormFields()},this._handleSaveForm=()=>{if(!this.formSlotId.trim())return void(this.formError="Slot ID cannot be empty");const e={...this._buildBasePayload(),...this.buildSpecificPayload()},t="edit"===this.formMode&&this.editingSlotId?this.updateSlot(this.editingSlotId,e):this.createSlot(e);if(t.success){if(this.formError=null,"edit"===this.formMode)return t.slot&&(this.editingSlotId=this.getSlotId(t.slot),this._loadFormFromSlot(t.slot)),void this.handleSaveSuccess("edit",t.slot);this.handleSaveSuccess("create",t.slot),this._resetFormFields()}else this.formError=t.error||"Unable to save slot"},this._handleCancelForm=()=>{this._resetFormState()}}handleSaveSuccess(e,t){}connectedCallback(){super.connectedCallback(),this._refreshSlots(),this.documentModel.addEventListener(this.slotsChangedEventName,this._handleSlotsChanged)}disconnectedCallback(){super.disconnectedCallback(),this.documentModel.removeEventListener(this.slotsChangedEventName,this._handleSlotsChanged),null!==this.toastTimeoutId&&(window.clearTimeout(this.toastTimeoutId),this.toastTimeoutId=null)}renderDialogTop(){return ot`
            <div class="toast ${this.toastMessage?"show":""}">
                ${this.toastMessage??""}
            </div>
        `}renderDialogBody(){return ot`
            <div class="slot-list-panel">
                <div class="slot-list-header">
                    <span>Existing Slots</span>
                    <button class="primary-btn" @click=${this._handleNewSlot}>
                        <ha-icon icon="mdi:plus-circle"></ha-icon>
                        New Slot
                    </button>
                </div>
                <div class="slot-list">
                    ${0===this.slots.length?ot`
                        <div class="reference-meta">${this.emptyListMessage}</div>
                    `:dt}
                    ${this.slots.map(e=>this._renderSlotItem(e))}
                </div>
            </div>
            <div class="slot-form-panel">
                ${this.formMode?this._renderForm():ot`
                    <div class="empty-form">Select a slot to edit or create a new one.</div>
                `}
            </div>
        `}onBeforeClose(){this._resetFormState()}showToast(e){this.toastMessage=e,null!==this.toastTimeoutId&&window.clearTimeout(this.toastTimeoutId),this.toastTimeoutId=window.setTimeout(()=>{this.toastMessage=null,this.toastTimeoutId=null},1400)}_refreshSlots(){this.slots=this.getSlots();const e=new Set(this.slots.map(e=>this.getSlotId(e)));this.referencesStates=Object.fromEntries(Object.entries(this.referencesStates).filter(([t])=>e.has(t))),"edit"===this.formMode&&this.editingSlotId&&!e.has(this.editingSlotId)&&this._resetFormState()}_openEditForm(e){const t=this.slots.find(t=>this.getSlotId(t)===e);t&&(this.formMode="edit",this.editingSlotId=this.getSlotId(t),this.formError=null,this._loadFormFromSlot(t))}_resetFormState(){this.formMode=null,this.editingSlotId=null,this.formError=null,this._resetFormFields()}_resetFormFields(){this.formSlotId="",this.formSlotName="",this.formSlotDescription="",this.resetSpecificFields()}_loadFormFromSlot(e){this.formSlotId=this.getSlotId(e),this.formSlotName=this.getSlotName(e),this.formSlotDescription=this.getSlotDescription(e)||"",this.loadSpecificFields(e)}_buildBasePayload(){return{id:this.formSlotId.trim(),name:this.formSlotName.trim()||void 0,description:this.formSlotDescription.trim()||void 0}}_renderSlotItem(e){const t=this.getSlotId(e),i=this.getSlotDescription(e),o=this.referencesStates[t],r="edit"===this.formMode&&this.editingSlotId===t;return ot`
            <div class="slot-item ${r?"active":""}">
                <div class="slot-item-title">
                    <span class="slot-item-name">${this.getSlotName(e)}</span>
                    ${r?ot`<span class="slot-item-badge">Editing</span>`:dt}
                </div>
                <div class="slot-item-id">${t}</div>
                ${i?ot`
                    <div class="slot-item-description">${i}</div>
                `:dt}
                <div class="slot-item-meta">${this.renderSlotMeta(e)}</div>
                <div class="slot-item-actions">
                    <button class="secondary-btn" @click=${()=>this._openEditForm(t)}>
                        Edit
                    </button>
                    <button class="secondary-btn" @click=${()=>this._handleFindReferences(t)}>
                        Find References
                    </button>
                    <button class="danger-btn" @click=${()=>this._handleDeleteSlot(t)}>
                        Delete
                    </button>
                </div>
                ${o?ot`
                    <div class="references">
                        <div class="reference-meta">References found (${o.references.length})</div>
                        ${o.references.map(e=>ot`
                            <div class="reference-item">
                                <button
                                        class="reference-link"
                                        @click=${()=>this._handleReferenceNavigate(e)}
                                >
                                    ${this._getBlockLabel(e.blockId)} - ${this.formatReference(e)}
                                </button>
                            </div>
                        `)}
                    </div>
                `:dt}
            </div>
        `}_renderForm(){const e="edit"===this.formMode,t=e?"Update slot":"Create slot";return ot`
            <div class="form-card">
                <div class="form-title">${e?"Edit slot":"New slot"}</div>
                <div class="form-group">
                    <span class="form-label">Slot ID</span>
                    <input
                            type="text"
                            .value=${this.formSlotId}
                            @input=${e=>{this.formSlotId=e.target.value}}
                    />
                </div>
                <div class="form-group">
                    <span class="form-label">Name</span>
                    <input
                            type="text"
                            .value=${this.formSlotName}
                            @input=${e=>{this.formSlotName=e.target.value}}
                    />
                </div>
                <div class="form-group">
                    <span class="form-label">Description</span>
                    <input
                            type="text"
                            .value=${this.formSlotDescription}
                            @input=${e=>{this.formSlotDescription=e.target.value}}
                    />
                </div>
                ${this.renderFormFields()}
                <div class="form-actions">
                    <button class="primary-btn" @click=${this._handleSaveForm}>
                        ${t}
                    </button>
                    <button class="secondary-btn" @click=${this._handleCancelForm}>
                        Cancel
                    </button>
                    ${this.formError?ot`<span class="error-text">${this.formError}</span>`:dt}
                </div>
            </div>
        `}_handleDeleteSlot(e){const t=this.getReferences(e);if(t.length>0)return void(this.referencesStates={...this.referencesStates,[e]:{references:t}});this.deleteSlot(e);const i={...this.referencesStates};delete i[e],this.referencesStates=i}_handleFindReferences(e){const t=this.getReferences(e);this.referencesStates={...this.referencesStates,[e]:{references:t}}}_handleReferenceNavigate(e){this.dispatchEvent(new CustomEvent("slot-reference-navigate",{detail:{reference:e},bubbles:!0,composed:!0}))}_getBlockLabel(e){const t=this.documentModel.getBlock(e);return this.documentModel.getBlockDisplayName(e,(null==t?void 0:t.type)||e)}};os.styles=[...es.styles,et`
            .dialog-body {
                flex: 1;
                padding: 16px 20px 24px;
                display: grid;
                grid-template-columns: minmax(220px, 1fr) minmax(0, 2fr);
                gap: 16px;
                overflow: hidden;
            }

            .slot-list-panel,
            .slot-form-panel {
                display: flex;
                flex-direction: column;
                gap: 12px;
                min-height: 0;
                overflow: hidden;
            }

            .slot-list-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.4px;
                color: var(--text-secondary, #666);
            }

            .slot-list {
                flex: 1;
                overflow: auto;
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding-right: 4px;
            }

            .slot-item {
                border: 1px solid var(--border-color, #e0e0e0);
                border-radius: 8px;
                background: var(--bg-primary, #fff);
                padding: 10px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .slot-item.active {
                border-color: var(--accent-color, #2196f3);
                box-shadow: 0 0 0 1px rgba(33, 150, 243, 0.2);
            }

            .slot-item-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 8px;
            }

            .slot-item-name {
                font-size: 12px;
                font-weight: 600;
                color: var(--text-primary, #333);
            }

            .slot-item-id {
                font-size: 11px;
                color: var(--text-secondary, #666);
            }

            .slot-item-badge {
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                padding: 2px 6px;
                border-radius: 10px;
                background: rgba(33, 150, 243, 0.1);
                color: var(--accent-color, #2196f3);
            }

            .slot-item-description {
                font-size: 11px;
                color: var(--text-secondary, #666);
            }

            .slot-item-meta {
                font-size: 11px;
                color: var(--text-secondary, #666);
            }

            .slot-item-actions {
                display: flex;
                gap: 6px;
                flex-wrap: wrap;
            }

            .slot-form-panel {
                overflow: auto;
                padding-left: 4px;
            }

            .form-card {
                border: 1px solid var(--border-color, #e0e0e0);
                border-radius: 8px;
                background: var(--bg-secondary, #f9f9f9);
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .form-title {
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.4px;
                color: var(--text-primary, #333);
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .form-label {
                font-size: 11px;
                font-weight: 600;
                color: var(--text-secondary, #666);
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }

            .form-group input,
            .form-group select {
                width: 100%;
                padding: 6px 8px;
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 4px;
                font-size: 14px;
                box-sizing: border-box;
            }

            .form-actions {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .error-text {
                font-size: 11px;
                color: var(--error-color, #d32f2f);
            }

            .empty-form {
                border: 1px dashed var(--border-color, #d4d4d4);
                border-radius: 8px;
                padding: 16px;
                font-size: 12px;
                color: var(--text-secondary, #666);
                text-align: center;
            }

            .references {
                margin-top: 8px;
                padding: 10px;
                border-radius: 6px;
                background: rgba(255, 152, 0, 0.1);
                border: 1px solid rgba(255, 152, 0, 0.3);
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .reference-item {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .reference-link {
                border: none;
                background: none;
                padding: 0;
                color: var(--accent-color, #2196f3);
                cursor: pointer;
                text-decoration: underline;
                font-size: 11px;
                text-align: left;
            }

            .reference-meta {
                font-size: 11px;
                color: var(--text-secondary, #666);
            }

            .toast {
                position: absolute;
                top: 12px;
                left: 50%;
                transform: translateX(-50%) translateY(-10px);
                background: rgba(46, 125, 50, 0.95);
                color: #fff;
                padding: 6px 12px;
                border-radius: 999px;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.3px;
                text-transform: uppercase;
                box-shadow: 0 6px 18px rgba(46, 125, 50, 0.25);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease, transform 0.2s ease;
            }

            .toast.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        `];let rs=os;is([pt({context:s})],rs.prototype,"documentModel"),is([tt({attribute:!1})],rs.prototype,"hass"),is([st()],rs.prototype,"slots"),is([st()],rs.prototype,"referencesStates"),is([st()],rs.prototype,"formMode"),is([st()],rs.prototype,"editingSlotId"),is([st()],rs.prototype,"formSlotId"),is([st()],rs.prototype,"formSlotName"),is([st()],rs.prototype,"formSlotDescription"),is([st()],rs.prototype,"formError"),is([st()],rs.prototype,"toastMessage");var as=Object.defineProperty,ss=Object.getOwnPropertyDescriptor,ns=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?ss(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&as(t,i,a),a};let ls=class extends rs{constructor(){super(...arguments),this.formSlotEntityId="",this.formSlotDomains=[]}get slotsChangedEventName(){return"slots-changed"}get dialogTitle(){return"Entity slots"}get emptyListMessage(){return"No slots defined yet"}getSlots(){return this.documentModel.getSlotEntities()}getSlotId(e){return e.id}getSlotName(e){return e.name||e.id}getSlotDescription(e){return e.description}renderSlotMeta(e){const t=e.domains&&e.domains.length>0?e.domains.join(", "):"Any",i=e.entityId?e.entityId:"None";return ot`Domains: ${t} • Default: ${i}`}renderFormFields(){return ot`
          <div class="form-group">
            <span class="form-label">Domains filter</span>
            <ha-selector
              .hass=${this.hass}
              .placeholder="Domains Filter (optional)"
              .selector=${{select:{multiple:!0,options:this._getAvailableDomains()}}}
              .value=${this.formSlotDomains}
              @value-changed=${e=>{this.formSlotDomains=e.detail.value||[]}}
            ></ha-selector>
          </div>
          <div class="form-group">
            <span class="form-label">Default entity</span>
            <ha-selector
              .hass=${this.hass}
              .label="Default Entity (optional)"
              .selector=${{entity:{multiple:!1,domain:this.formSlotDomains.length>0?this.formSlotDomains:void 0}}}
              .value=${this.formSlotEntityId}
              @value-changed=${e=>{this.formSlotEntityId=e.detail.value||""}}
              allow-custom-entity
            ></ha-selector>
          </div>
        `}createSlot(e){return this.documentModel.createSlotEntity(e)}updateSlot(e,t){return this.documentModel.updateSlotEntity(e,t)}deleteSlot(e){this.documentModel.deleteSlotEntity(e)}getReferences(e){return this.documentModel.findSlotEntityReferences(e)}formatReference(e){const t=e.styleTargetId?` (target ${e.styleTargetId})`:"";switch(e.kind){case"block-entity":return"Entity configuration";case"style-binding":return`Styles: ${e.category}.${e.property}${t}`;case"style-animation":return`Animation binding: ${e.category}.${e.property}${t}`;case"trait-binding":return`Property binding: ${e.propName}`;case"trait-slot":return`Property slot: ${e.propName}`;default:return"Reference"}}loadSpecificFields(e){this.formSlotEntityId=e.entityId||"",this.formSlotDomains=e.domains?[...e.domains]:[]}resetSpecificFields(){this.formSlotEntityId="",this.formSlotDomains=[]}buildSpecificPayload(){return{entityId:this.formSlotEntityId,domains:this.formSlotDomains}}_getAvailableDomains(){return Array.from($t).sort().map(({id:e,label:t})=>({label:t,value:e}))}};ns([st()],ls.prototype,"formSlotEntityId",2),ns([st()],ls.prototype,"formSlotDomains",2),ls=ns([rt("entity-slots-editor-overlay")],ls);var ds=Object.defineProperty,cs=Object.getOwnPropertyDescriptor,ps=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?cs(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&ds(t,i,a),a};const hs=[{label:"Tap",value:"tap"},{label:"Double Tap",value:"double_tap"},{label:"Hold",value:"hold"}],us={tap:"Tap",double_tap:"Double Tap",hold:"Hold"};let gs=class extends rs{constructor(){super(...arguments),this.formSlotTrigger="tap",this.formSlotAction={action:"none"}}get slotsChangedEventName(){return"slot-actions-changed"}get dialogTitle(){return"Action slots"}get emptyListMessage(){return"No action slots defined yet"}getSlots(){return this.documentModel.getSlotActions()}getSlotId(e){return e.id}getSlotName(e){return e.name||e.id}getSlotDescription(e){return e.description}renderSlotMeta(e){return ot`${this._formatActionSlotSummary(e)}`}renderFormFields(){return ot`
          <div class="form-group">
            <span class="form-label">Trigger</span>
            <select
              .value=${this.formSlotTrigger}
              @change=${e=>{this.formSlotTrigger=e.target.value}}
            >
              ${hs.map(e=>ot`
                  <option value=${e.value}>${e.label}</option>
              `)}
            </select>
          </div>
          <div class="form-group">
            <span class="form-label">Action</span>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ui_action:{default_action:"none"}}}
              .value=${this.formSlotAction??{action:"none"}}
              @value-changed=${e=>{this.formSlotAction=e.detail.value}}
            ></ha-selector>
          </div>
        `}createSlot(e){return this.documentModel.createSlotAction(e)}updateSlot(e,t){return this.documentModel.updateSlotAction(e,t)}deleteSlot(e){this.documentModel.deleteSlotAction(e)}getReferences(e){return this.documentModel.findSlotActionReferences(e)}formatReference(e){return`Action slot (${e.actionTrigger||"trigger"}) on target ${e.propName||"block"}`}loadSpecificFields(e){this.formSlotTrigger=e.trigger,this.formSlotAction=e.action}resetSpecificFields(){this.formSlotTrigger="tap",this.formSlotAction={action:"none"}}buildSpecificPayload(){return{trigger:this.formSlotTrigger,action:this.formSlotAction??{action:"none"}}}handleSaveSuccess(e){"edit"!==e?this.showToast("Slot created"):this.showToast("Slot updated")}_formatActionSlotSummary(e){return`${us[e.trigger]??e.trigger} • ${this._formatActionSummary(e.action)}`}_formatActionSummary(e){const t=this._getActionLabel(e.action);if("call-service"===e.action||"perform-action"===e.action){const i=this._getServiceValue(e);return i?`${t}: ${i}`:t}return"navigate"===e.action&&"navigation_path"in e?`${t}: ${e.navigation_path||""}`:"url"===e.action&&"url_path"in e?`${t}: ${e.url_path||""}`:t}_getActionLabel(e){return{none:"None",toggle:"Toggle","call-service":"Call Service","perform-action":"Perform Action",navigate:"Navigate","more-info":"More Info",url:"Open URL","fire-dom-event":"Fire Event","toggle-menu":"Toggle Menu"}[e]??e}_getServiceValue(e){return"perform_action"in e&&"string"==typeof e.perform_action&&e.perform_action?e.perform_action:"service"in e&&"string"==typeof e.service&&e.service?e.service:"domain"in e&&"string"==typeof e.domain&&"service"in e&&"string"==typeof e.service?`${e.domain}.${e.service}`:void 0}};ps([st()],gs.prototype,"formSlotTrigger",2),ps([st()],gs.prototype,"formSlotAction",2),gs=ps([rt("action-slots-editor-overlay")],gs);const vs=et`
    .guides {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 9999;
    }

    .guides-axis-dot,
    .guides-origin-dot {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(212, 70, 0, 0.95);
        border: 2px solid rgba(255, 255, 255, 0.95);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
        transform: translate(-50%, -50%);
    }

    .guides-axis {
        position: absolute;
        background: transparent;
        opacity: 0.55;
    }

    .guides-axis.x {
        left: 0;
        right: 0;
        height: 2px;
        border-top: 2px dashed rgba(212, 28, 0, 0.55);
    }

    .guides-axis.y {
        top: 0;
        bottom: 0;
        width: 2px;
        border-left: 2px dashed rgba(212, 28, 0, 0.55);
    }

    .guides-line {
        position: absolute;
        border-color: rgba(212, 28, 0, 0.55);
        border-style: dashed;
        border-width: 0;
    }

    .guides-line.h {
        border-top-width: 1px;
    }

    .guides-line.v {
        border-left-width: 1px;
    }

    .guides-label {
        position: absolute;
        transform: translate(-50%, -50%);
        font-size: 10px;
        line-height: 1;
        padding: 2px 6px;
        border-radius: 4px;
        background: rgb(197, 74, 55);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.18);
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
    }

    .guides[hidden] {
        display: none;
    }
`;function bs(e,t){if("%"===t){return`${Math.round(100*e)/100}%`}return`${Math.round(e)}px`}function ms(e){e&&e.root.setAttribute("hidden","")}var fs=Object.defineProperty,ys=Object.getOwnPropertyDescriptor,xs=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?ys(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&fs(t,i,a),a};let _s=class extends it{constructor(){super(...arguments),this.show=!0,this.selectedBlockId=null,this.selectedBlock=null,this.targetElement=null,this.position={top:0,left:0},this.canDelete=!1,this.canDuplicate=!1,this.canSelectParent=!1,this.positionRafId=null,this._updateCapabilities=()=>{this.canDelete=this.documentModel.canDeleteBlock(this.selectedBlockId),this.canDuplicate=this.documentModel.canDuplicateBlock(this.selectedBlockId),this.canSelectParent=null!==this.selectedBlock.parentId},this._onSelectionChanged=e=>{const t=e.detail;this.selectedBlockId=t.selectedId},this._onCanvasSizeChanged=()=>this._updatePosition(),this._onBlockUpdated=e=>{var t;const i=e.detail;this.selectedBlockId&&((null==(t=null==i?void 0:i.block)?void 0:t.id)!==this.selectedBlockId&&this.selectedBlockId!==this.documentModel.rootId||this._updatePosition())},this._updatePosition=()=>{this.targetElement&&null===this.positionRafId&&(this.positionRafId=requestAnimationFrame(()=>{if(this.positionRafId=null,!this.targetElement)return;const e=this.targetElement.getBoundingClientRect(),t=this.getRootNode(),i=t instanceof ShadowRoot?t.host:null,o=null==i?void 0:i.getBoundingClientRect(),r=(null==o?void 0:o.top)??0,a=(null==o?void 0:o.left)??0;this.position={top:e.top-r-25-5,left:e.left-a},this.style.top=`${this.position.top}px`,this.style.left=`${this.position.left}px`,this.style.width=`${e.width}px`,this.style.transform="none"}))}}connectedCallback(){super.connectedCallback(),window.addEventListener("resize",this._updatePosition),this.documentModel.addEventListener("selection-changed",this._onSelectionChanged),this.eventBus.addEventListener("canvas-size-changed",this._onCanvasSizeChanged),this.documentModel.addEventListener("block-updated",this._onBlockUpdated)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("resize",this._updatePosition),this.documentModel.removeEventListener("selection-changed",this._onSelectionChanged),this.eventBus.removeEventListener("canvas-size-changed",this._onCanvasSizeChanged),this.documentModel.removeEventListener("block-updated",this._onBlockUpdated),null!==this.positionRafId&&(cancelAnimationFrame(this.positionRafId),this.positionRafId=null)}updated(e){super.updated(e),e.has("canvas")&&this._updatePosition()}render(){if(!this.show||!this.selectedBlockId)return dt;this.selectedBlock=this.documentModel.getBlock(this.selectedBlockId),this.targetElement=this.selectedBlockId===this.documentModel.rootId?this.canvas:this.documentModel.getElement(this.selectedBlockId),this._updateCapabilities(),this._updatePosition();const e=this._getBlockLabel();return ot`
            <div class="toolbar-container">
                <div class="block-label">${e}</div>
                <div class="toolbar">
                    <button
                            class="toolbar-button"
                            ?disabled=${!this.canSelectParent}
                            @click=${e=>this._handleSelectParent(e)}
                            title="Select parent (↑)"
                    >
                        <ha-icon icon="mdi:chevron-up"></ha-icon>
                    </button>

                    <button
                            class="toolbar-button"
                            ?disabled=${!this.canDuplicate}
                            @click=${this._handleDuplicate}
                            title="Duplicate (Ctrl+D)"
                    >
                        <ha-icon icon="mdi:content-duplicate"></ha-icon>
                    </button>

                    <button
                            class="toolbar-button delete"
                            ?disabled=${!this.canDelete}
                            @click=${this._handleDelete}
                            title="Delete"
                    >
                        <ha-icon icon="mdi:delete"></ha-icon>
                    </button>
                </div>
            </div>
        `}_handleSelectParent(e){if(e.stopPropagation(),!this.selectedBlock||!this.canSelectParent)return;let t=this.selectedBlock.parentId;for(;t&&this.documentModel.isHidden(t);)t=this.documentModel.getBlock(t).parentId;t&&this.documentModel.select(t)}_handleDuplicate(){this.selectedBlock&&this.canDuplicate&&this.documentModel.duplicateBlock(this.selectedBlock.id)}_handleDelete(){this.selectedBlock&&this.canDelete&&this.documentModel.deleteBlock(this.selectedBlock.id)}_getBlockLabel(){if(!this.selectedBlock)return"";const e=this.blockRegistry.getBlock(this.selectedBlock.type),t=(null==e?void 0:e.label)||this.selectedBlock.type.replace(/^ha-/,"").split("-").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ");return this.documentModel.getBlockDisplayName(this.selectedBlock,t)}};_s.styles=et`
        :host {
            position: absolute;
            z-index: 100;
            pointer-events: none;
        }

        .toolbar-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            width: 100%;
        }

        .block-label {
            background: var(--accent-color, #1976d2);
            color: white;
            padding: 5px 7px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
            pointer-events: auto;
            box-shadow: 0 0 0 0, 0 0 0 0, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
        }

        .toolbar {
            display: flex;
            gap: 2px;
            background: var(--bg-primary, #ffffff);
            border: 1px solid var(--border-color, #d4d4d4);
            border-radius: 6px;
            box-shadow: 0 0 0 0, 0 0 0 0, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
            pointer-events: auto;
            --mdc-icon-size: 16px;
        }

        .toolbar-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            height: 21px;
            border: none;
            background: transparent;
            cursor: pointer;
            color: var(--text-primary, #333333);
            transition: all 0.15s ease;
        }

        .toolbar-button:hover {
            background: var(--bg-secondary, #f5f5f5);
        }

        .toolbar-button:active {
            background: var(--bg-tertiary, #e8e8e8);
            transform: scale(0.95);
        }

        .toolbar-button svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }

        .toolbar-button.delete:hover {
            background: #fee;
            color: #d32f2f;
        }

        .toolbar-button:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .toolbar-button:disabled:hover {
            background: transparent;
        }
    `,xs([pt({context:s})],_s.prototype,"documentModel",2),xs([pt({context:r})],_s.prototype,"blockRegistry",2),xs([tt({attribute:!1})],_s.prototype,"show",2),xs([tt({attribute:!1})],_s.prototype,"canvas",2),xs([pt({context:d})],_s.prototype,"eventBus",2),xs([st()],_s.prototype,"selectedBlockId",2),_s=xs([rt("contextual-block-toolbar")],_s);var ks=Object.defineProperty,ws=(e,t,i,o)=>{for(var r,a=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(a=r(t,i,a)||a);return a&&ks(t,i,a),a};const Ss=class extends pe{constructor(){super(),this.showPositionGuides=!0,this.showSnapGuides=!0,this.isCanvasSelected=!1,this.showContextualBlockToolbar=!0,this.showControls=!1,this.overflowAllowBlocksOutside=!0,this.linkModeState=null,this.blocks={},this.selectedBlockId=null,this.moveable=null,this.guides=null,this._handleKeyDown=e=>{if(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement)return;const t=this.selectedBlockId?this.documentModel.getBlock(this.selectedBlockId):null;return t&&(e.ctrlKey||e.metaKey)&&"d"===e.key?(e.preventDefault(),void(this.documentModel.canDuplicateBlock(t.id)&&this.documentModel.duplicateBlock(t.id))):void 0},this._handleLinkModeChanged=e=>{const t=e.detail;this.linkModeState=(null==t?void 0:t.state)??null,this._emitSelectionDisabledState(this.linkModeState)},this.addEventListener("click",e=>this._onBuilderClick(e))}get dropId(){return this.canvasId}get dropElement(){return this.canvasFlowContainer}shouldShowDropIndicator(){return!0}getPanelConfig(){return{properties:{groups:[{id:"overflow",label:"Overflow",traits:[{type:"checkbox",name:"overflow_allow_blocks_outside",label:"Allow blocks outside"},{type:"checkbox",name:"overflow_show",label:"Show overflow"}]}]},targetStyles:{block:{styles:{groups:["background","border","typography","animations"],properties:["size.height","size.minHeight","size.maxHeight","spacing.padding"]}}}}}getBlockEntities(){var e;const t=null==(e=this.documentModel)?void 0:e.resolveEntityForBlock(this.documentModel.rootId);return(null==t?void 0:t.entityId)?[t.entityId]:[]}getBlockBoundingClientRect(){return this.canvas.getBoundingClientRect()}connectedCallback(){super.connectedCallback(),this._onModelChange(),this._setupKeyboardShortcuts(),this.documentModel.registerElement(this.documentModel.rootId,this),this.linkModeState=this.documentModel.getLinkModeState(),this.documentModel.addEventListener("link-mode-changed",this._handleLinkModeChanged),this._emitSelectionDisabledState(this.linkModeState),this.documentModel.addEventListener("change",()=>this._onModelChange()),this.documentModel.addEventListener("selection-changed",e=>{var t,i;const o=e.detail;this.selectedBlockId=o.selectedId,this.isCanvasSelected=this.selectedBlockId===this.documentModel.rootId,this.isCanvasSelected?null==(t=this.canvas)||t.classList.add("canvas-selected"):null==(i=this.canvas)||i.classList.remove("canvas-selected");const r=this.selectedBlockId?this.documentModel.getBlock(this.selectedBlockId):null;this.showControls=Boolean("absolute"===(null==r?void 0:r.layout)),this._updateMoveable()}),this.documentModel.addEventListener("style-target-changed",()=>{}),this.documentModel.addEventListener("block-updated",e=>{e.detail.block.id===this.selectedBlockId&&requestAnimationFrame(()=>{this._updateMoveable()})}),this.eventBus.addEventListener("block-created",e=>{this._handleBlockCreated(e)}),this.eventBus.addEventListener("block-reordered",e=>{this._handleBlockReordered(e)}),this.eventBus.addEventListener("block-drag-on-generate-preview",()=>{this.documentModel.select(null)})}disconnectedCallback(){super.disconnectedCallback(),this.moveable&&this.moveable.destroy(),this._cleanupKeyboardShortcuts()}async firstUpdated(){await this.updateComplete,this.dragDropManager.registerCanvas(this)}async updated(e){await super.updated(e),await this.updateComplete,e.has("showPositionGuides")&&this._updateGuides(),e.has("showSnapGuides")&&await this._updateMoveable()}render(){const e=0===this.rootBlocks.length,t=this.containerManager.getActiveContainer(),i=t.width,o=t.isDefault?"100%":`${i+40}px`,{absoluteBlocks:r,staticBlocks:a,flowBlocks:s,haCardStyles:n,canvasStyles:l,canvasFlowContainerStyles:d}=this.getRenderData({width:(t.isDefault?"100%":`${i}px`)+" !important"});return ot`
            <div
                class="canvas-viewport"
                style="width: ${o}"
                data-container-name="${t.name}"
                data-container-width="${i?`${i}px`:"Responsive"}"
            >
                
                    <ha-card style="${ut(n)}">
                        <div
                            class="canvas ${e?"canvas-empty":""}"
                            style="${ut(l)}"
                            ${ht(e=>this.canvas=e)}
                        >
                            ${ot`
        <div class="guides" hidden>
            <div class="guides-axis-dot"></div>
            <div class="guides-axis x"></div>
            <div class="guides-axis y"></div>
            <div class="guides-origin-dot"></div>
            <div class="guides-line h"></div>
            <div class="guides-line v"></div>
            <div class="guides-label h"></div>
            <div class="guides-label v"></div>
        </div>
    `}
                            ${e?ot`<div class="canvas-placeholder">Canvas is empty</div>`:dt}
                            ${gt(r,e=>e.id,e=>this.renderBlock(e))}
                            ${gt(a,e=>e.id,e=>this.renderBlock(e))}
                            <div
                                class="canvas-flow-container ${0===s.length?"flow-empty":""}"
                                data-dnd-drop-target="true"
                                style="${ut(d)}"
                                @click=${e=>this._onBuilderClick(e)}
                                ${ht(e=>this.canvasFlowContainer=e)}
                            >
                                ${gt(s,e=>e.id,e=>this.renderBlock(e))}
                            </div>
                        </div>
                    </ha-card>
                

                ${this._renderControls()}
            </div>
            <contextual-block-toolbar
                    .canvas=${this.canvas}
                    .show=${this.showContextualBlockToolbar}
            >
            </contextual-block-toolbar>
        `}canvasSizeChanged(){this.selectedBlockId&&this._updateGuides(),this.moveable&&this.moveable.updateRect()}doBlockRender(e,t){return ft`
          <${t.tag}
            block-id="${e.id}"
            data-dnd-draggable="${"flow"===e.layout}"
            data-dnd-drop-target="${"flow"===e.layout}"
            .block=${e}
            .canvasId=${this.canvasId}
            .activeContainerId=${this.activeContainerId}
            @click=${t=>this._onBlockClick(t,e.id)}
            ${ht(t=>this.documentModel.registerElement(e.id,t))}
          ></${t.tag}>
      `}_setupKeyboardShortcuts(){document.addEventListener("keydown",this._handleKeyDown)}_cleanupKeyboardShortcuts(){document.removeEventListener("keydown",this._handleKeyDown)}_ensureGuidesElements(){this.guides||(this.guides=function(e){const t=null==e?void 0:e.querySelector(".guides");if(!t)return null;const i=t.querySelector(".guides-axis-dot"),o=t.querySelector(".guides-axis.x"),r=t.querySelector(".guides-axis.y"),a=t.querySelector(".guides-origin-dot"),s=t.querySelector(".guides-line.h"),n=t.querySelector(".guides-line.v"),l=t.querySelector(".guides-label.h"),d=t.querySelector(".guides-label.v");return i&&o&&r&&a&&s&&n&&l&&d?{root:t,axisDot:i,axisX:o,axisY:r,originDot:a,lineH:s,lineV:n,labelH:l,labelV:d}:null}(this.shadowRoot))}_hideGuides(){this._ensureGuidesElements(),ms(this.guides)}_togglePositionGuides(e){e.stopPropagation(),this.showPositionGuides=!this.showPositionGuides,this.dispatchEvent(new CustomEvent("position-guides-preference-changed",{detail:{status:this.showPositionGuides,selectedId:this.selectedBlockId},bubbles:!0,composed:!0}))}_toggleSnapGuides(e){e.stopPropagation(),this.showSnapGuides=!this.showSnapGuides,this.dispatchEvent(new CustomEvent("snap-guides-preference-changed",{detail:{status:this.showPositionGuides,selectedId:this.selectedBlockId},bubbles:!0,composed:!0}))}_calculateInsertIndexFromInstruction(e,t){if(!t)return 0;switch(t.operation){case"reorder-before":return this._getIndexInParent(e);case"reorder-after":return this._getIndexInParent(e)+1;case"combine":return 0;default:return console.warn(`[BuilderCanvas] Unknow instruction operation: ${t.operation}`),0}}_getIndexInParent(e){var t;const i=e.parentId;if(!i)return e.order;const o=this.documentModel.getBlock(i),r=(null==(t=null==o?void 0:o.children)?void 0:t.indexOf(e.id))??-1;return-1===r?e.order:r}_handleBlockCreated(e){var t,i;const o=this.documentModel.getBlock(e.targetBlockId||"root"),r=e.targetBlockId?e.targetIsContainer&&"combine"===(null==(t=e.instruction)?void 0:t.operation)?e.targetBlockId:this.documentModel.getBlock(e.targetBlockId).parentId:"root",a=this._calculateInsertIndexFromInstruction(o,e.instruction);e.blockType,null==(i=e.instruction)||i.operation;const s=this.blockRegistry.getDefaults(e.blockType),n=this.blockRegistry.getEntityDefaults(e.blockType),l=this.documentModel.createBlock(e.blockType,r,{...s,entityConfig:{mode:n.mode||"inherited",slotId:n.slotId}},{},a);this.documentModel.select(l.id)}_handleBlockReordered(e){var t,i;const o=this.documentModel.getBlock(e.targetBlockId||"root");let r=e.targetIsContainer&&"combine"===(null==(t=e.instruction)?void 0:t.operation)?e.targetBlockId:this.documentModel.getBlock(e.targetBlockId).parentId;const a=this._calculateInsertIndexFromInstruction(o,e.instruction);e.blockId,null==(i=e.instruction)||i.operation,this.documentModel.moveBlock(e.blockId,r,a)}_getSelectedBlockGuideData(e,t,i){if(!this.selectedBlockId)return null;const o=this.documentModel.getBlock(this.selectedBlockId);if(!o||"absolute"!==o.layout)return null;const r=this._getResolvedLayoutData(o);r.size=i??this.getRuntimeBlockSize(o,r);const a=this.getAbsolutePositioningContext(o);if(!a)return null;const s=a.width,n=a.height,l=a.offsetX,d=a.offsetY,c=new oe({containerSize:{width:s,height:n},elementSize:r.size,anchorPoint:r.positionConfig.anchor,originPoint:r.positionConfig.originPoint,unitSystem:r.positionConfig.unitSystem});let p,h;if(void 0!==e&&void 0!==t)p=e,h=t;else{const e=this.blockToMoveable(r,r.size,s,n);p=e.left+l,h=e.top+d}const u=p-l,g=h-d,v=c.fromMoveableSpace({x:u,y:g}),{axisX:b,axisY:m}=(f=r.positionConfig.anchor,y=s,x=n,{axisX:f.includes("right")?y:f.includes("center")?y/2:0,axisY:f.includes("bottom")?x:f.includes("middle")?x/2:0});var f,y,x;const _=b+l,k=m+d,{localOriginX:w,localOriginY:S}=($=r.positionConfig.originPoint,C=r.size.width,E=r.size.height,{localOriginX:$.includes("right")?C:$.includes("center")?C/2:0,localOriginY:$.includes("bottom")?E:$.includes("middle")?E/2:0});var $,C,E;return{axisX:_,axisY:k,blockOriginX:p+w,blockOriginY:h+S,unitSystem:r.positionConfig.unitSystem,xValue:v.x,yValue:v.y}}_updateGuides(e,t,i){if(!this.showPositionGuides)return void this._hideGuides();this._ensureGuidesElements();const o=this._getSelectedBlockGuideData(e,t,i);!function(e,t,i,o){if(!e)return;if(!t)return void ms(e);e.root.removeAttribute("hidden"),e.axisDot.style.top=`calc(${t.axisY}px)`,e.axisDot.style.left=`calc(${t.axisX}px)`,e.axisX.style.top=`calc(${t.axisY}px - 2px)`,e.axisY.style.left=`calc(${t.axisX}px - 2px)`,e.originDot.style.left=`${t.blockOriginX}px`,e.originDot.style.top=`${t.blockOriginY}px`;const r=t.blockOriginY,a=Math.min(t.blockOriginX,t.axisX),s=Math.max(t.blockOriginX,t.axisX);e.lineH.style.top=`${r}px`,e.lineH.style.left=`${a}px`,e.lineH.style.width=`${Math.max(0,s-a)}px`;const n=t.blockOriginX,l=Math.min(t.blockOriginY,t.axisY),d=Math.max(t.blockOriginY,t.axisY);e.lineV.style.left=`${n}px`,e.lineV.style.top=`${l}px`,e.lineV.style.height=`${Math.max(0,d-l)}px`;const c=(a+s)/2;e.labelH.textContent=bs(t.xValue,t.unitSystem);const p=(l+d)/2;e.labelV.textContent=bs(t.yValue,t.unitSystem);const h=(e,t)=>Math.max(10,Math.min(e,t-10));e.labelH.style.left=`${h(c,i)}px`,e.labelH.style.top=`${h(r,o)}px`,e.labelV.style.left=`${h(n,i)}px`,e.labelV.style.top=`${h(p,o)}px`}(this.guides,o,this.canvasWidth,this.canvasHeight)}_getResolvedLayoutData(e){const t={defaultEntityId:this.documentModel.resolveEntityForBlock(e.id).entityId},i=this.styleResolver.resolve(e.id,this.activeContainerId,t,!0,void 0,this.activeThemeMode);return ie(i)}_onModelChange(){var e,t,i,o;this.blocks=this.documentModel.blocks;const r=this.documentModel.getBlock(this.documentModel.rootId);this.rootBlocks=Object.values(this.blocks).filter(e=>e.parentId===this.documentModel.rootId),this.overflowShow=null==(t=null==(e=r.props)?void 0:e.overflow_show)?void 0:t.value,this.overflowAllowBlocksOutside=null==(o=null==(i=r.props)?void 0:i.overflow_allow_blocks_outside)?void 0:o.value;for(const a of Object.values(this.blocks))this.subscribeBlockEntities(a.id,this.documentModel.getTrackedEntitiesFlat(a));this.requestUpdate()}_renderControls(){return this.showControls?ot`
            <div class="canvas-controls">
                <button
                        class="toggle-button"
                        aria-pressed=${this.showPositionGuides?"true":"false"}
                        title="Toggle position guides and axes"
                        @click=${e=>this._togglePositionGuides(e)}
                >
                    Position guides
                </button>
                <button
                        class="toggle-button"
                        aria-pressed=${this.showSnapGuides?"true":"false"}
                        title="Toggle snap lines"
                        @click=${e=>this._toggleSnapGuides(e)}
                >
                    Snap lines
                </button>
            </div>
        `:ot``}_onBuilderClick(e){const t=this.linkModeState;if(null==t?void 0:t.enabled)return void e.stopPropagation();e.stopPropagation();const i=e.target;i===this?this.documentModel.select(null):i!==this.canvas&&i!==this.canvasFlowContainer||this.documentModel.select(this.documentModel.rootId)}_onBlockClick(e,t){if(this.documentModel.isHidden(t))return;const i=this.linkModeState;(null==i?void 0:i.enabled)&&i.activeLinkId&&t!==i.activeLinkId?e.stopPropagation():(e.stopPropagation(),this.documentModel.select(t))}_emitSelectionDisabledState(e){(null==e?void 0:e.enabled)&&"pick-anchor"!==e.mode?this.eventBus.dispatchEvent("block-selection-disabled",{disabled:!0,excluded:e.activeLinkId??void 0}):this.eventBus.dispatchEvent("block-selection-disabled",{disabled:!1})}async _updateMoveable(){await this.updateComplete,this.guides=null,this.moveable&&(this.moveable.destroy(),this.moveable=null);const e=this.selectedBlockId;if(!e)return void this._hideGuides();const t=this.documentModel.getBlock(e);if(!t||"absolute"!==t.layout)return void this._hideGuides();const i=this.documentModel.getElement(t);if(!i||!this.canvas)return;const o=this.getAbsolutePositioningContext(t);if(!o)return;const r=o.element,a=o.width,s=o.height,n=o.offsetX,l=o.offsetY,d=!o.isRoot;await i.updateComplete;const c=this._getResolvedLayoutData(t),p=this.getRuntimeBlockSize(t,c),h=this.blockToMoveable(c,p,a,s),u=Object.values(this.blocks).filter(t=>"absolute"===t.layout&&t.id!==e),g=("root"!==t.parentId?u.filter(e=>e.parentId===t.parentId):u).map(e=>({element:this.documentModel.getElement(e.id),className:"moveable-snap-element"})),v=a/2,b=s/2;let m=null;if(!this.overflowAllowBlocksOutside)if(d){const e=this.canvas.getBoundingClientRect(),t=r.getBoundingClientRect();m={left:-(t.left-e.left),top:-(t.top-e.top),right:a+(e.right-t.right),bottom:s+(e.bottom-t.bottom)}}else m={left:0,top:0,right:this.canvasWidth,bottom:this.canvasHeight};this.moveable=new St(r,{target:i,draggable:!0,resizable:!0,keepRatio:!1,throttleDrag:0,throttleResize:0,renderDirections:["nw","n","ne","w","e","sw","s","se"],edge:!1,origin:!1,bounds:m,snappable:!0,snapThreshold:5,isDisplaySnapDigit:this.showSnapGuides,snapGap:this.showSnapGuides,snapDirections:{top:!0,left:!0,bottom:!0,right:!0,center:!0,middle:!0},elementSnapDirections:{top:!0,left:!0,bottom:!0,right:!0,center:!0,middle:!0},elementGuidelines:this.showSnapGuides?g:[],snapContainer:r,verticalGuidelines:this.showSnapGuides?[{pos:0,className:"snap-canvas-edge"},{pos:v,className:"snap-canvas-center"},{pos:a,className:"snap-canvas-edge"}]:[],horizontalGuidelines:this.showSnapGuides?[{pos:0,className:"snap-canvas-edge"},{pos:b,className:"snap-canvas-center"},{pos:s,className:"snap-canvas-edge"}]:[],snapDigit:0}),this.moveable.updateRect();let f={left:h.left,top:h.top},y=new Set;const x=a,_=s,k=n,w=l;this.moveable.on("dragStart",()=>{this.showContextualBlockToolbar=!1,this.eventBus.dispatchEvent("block-drag-start",{block:t})}),this.moveable.on("drag",({target:t,left:i,top:o,transform:r})=>{if(!this.documentModel.getBlock(e))return;f={left:i,top:o},t.style.transform=r;const a=i+k,s=o+w;this._updateGuides(a,s)}),this.moveable.on("snap",({elements:e,gaps:t})=>{y.forEach(e=>e.classList.remove("snap-highlight")),y.clear(),e&&e.length>0&&e.forEach(e=>{e.element&&e.element instanceof HTMLElement&&(e.element.classList.add("snap-highlight"),y.add(e.element))}),t&&t.length>0&&t.forEach(e=>{e.element&&e.element instanceof HTMLElement&&(e.element.classList.add("snap-highlight"),y.add(e.element))})}),this.moveable.on("dragEnd",async({target:i})=>{const o=this.documentModel.getBlock(e);if(!o)return;y.forEach(e=>e.classList.remove("snap-highlight")),y.clear();const r=f.left,a=f.top,s=this.getRuntimeBlockSize(o,c),n=this.moveableToBlock({left:r,top:a},c.positionConfig,s,x,_);i.style.transform="",this.eventBus.dispatchEvent("moveable-change",n),this.showContextualBlockToolbar=!0,this.eventBus.dispatchEvent("block-drag-end",{block:t})});let S={left:h.left,top:h.top,width:c.size.width,height:c.size.height};this.moveable.on("resizeStart",()=>{this.showContextualBlockToolbar=!1,this.eventBus.dispatchEvent("block-resize-start",{block:t})}),this.moveable.on("resize",({target:e,width:t,height:i,drag:o})=>{const r=o.left,a=o.top,s=t,n=i;S={left:r,top:a,width:s,height:n},e.style.width=`${s}px`,e.style.height=`${n}px`,e.style.transform=o.transform;const l=r+k,d=a+w;this._updateGuides(l,d,{width:s,height:n})}),this.moveable.on("resizeEnd",({target:i})=>{y.forEach(e=>e.classList.remove("snap-highlight")),y.clear();if(!this.documentModel.getBlock(e))return;const o=S.left,r=S.top,a=S.width,s=S.height,n=this.moveableResizeToBlock({left:o,top:r},{width:a,height:s},c.positionConfig,x,_);i.style.transform="",this.eventBus.dispatchEvent("moveable-change",n),this.showContextualBlockToolbar=!0,this.eventBus.dispatchEvent("block-resize-end",{block:t})}),this._updateGuides()}};Ss.styles=[...pe.styles,vs,et`
            :host {
                display: flex;
                align-items: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                width: max-content;
                position: relative;
            }

            :host(.container-desktop) {
                min-width: 100%;
            }

            .canvas-viewport {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                background: repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 10px,
                        rgba(0, 0, 0, 0.02) 10px,
                        rgba(0, 0, 0, 0.02) 20px
                );
                border: 2px dashed var(--border-color);
                border-radius: 12px;
                padding: 20px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
            }

            :host(.container-desktop) .canvas-viewport {
                background: none;
                border: none;
                border-radius: 0;
                padding: 0;
                box-shadow: none;
            }

            .canvas-viewport::before {
                content: attr(data-container-name);
                position: absolute;
                top: -10px;
                left: 20px;
                background: var(--bg-primary);
                padding: 2px 12px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: 600;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border: 1px solid var(--border-color);
            }

            :host(.container-desktop) .canvas-viewport::before {
                display: none;
            }

            .canvas-viewport::after {
                content: attr(data-container-width);
                position: absolute;
                top: -10px;
                right: 20px;
                background: var(--accent-color);
                color: white;
                padding: 2px 12px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.3px;
            }

            :host(.container-desktop) .canvas-viewport::after {
                display: none;
            }

            .canvas {
                outline: 2px solid transparent;
            }

            .canvas.canvas-selected {
                outline-color: var(--accent-color, #0078d4);
            }

            .canvas.canvas-empty .canvas-flow-container,
            .canvas-flow-container.flow-empty {
                height: 300px;
            }

            .canvas-flow-container > * {
                pointer-events: auto;
            }

            .canvas-placeholder {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: var(--text-secondary);
                font-size: 13px;
                text-align: center;
                pointer-events: none;
            }

            .canvas-controls {
                position: absolute;
                bottom: calc(100% + 15px);
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
            }

            .toggle-button {
                border: 1px solid var(--border-color);
                background: var(--bg-primary);
                color: var(--text-secondary);
                font-size: 12px;
                border-radius: 6px;
                padding: 6px 10px;
                cursor: pointer;
                transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
            }

            .toggle-button:hover {
                color: var(--text-primary);
            }

            .toggle-button[aria-pressed='true'] {
                background: var(--accent-color);
                border-color: var(--accent-color);
                color: #ffffff;
            }

            .snap-highlight {
                outline: 1px solid #ff4081 !important;
                outline-offset: 1px !important;
                box-shadow: 0 0 0 4px rgba(255, 64, 129, 0.15) !important;
                transition: none !important;
                z-index: 999;
            }

            .moveable-control-box .moveable-control.moveable-resizable {
                border: none;
                height: 4px;
                border-radius: 3px;
            }

            .moveable-control-box .moveable-control.moveable-resizable[data-direction^=n] {
                margin-top: -4px;
            }

            .moveable-control-box .moveable-control.moveable-resizable[data-direction^=s] {
                margin-top: 0;
            }

            .moveable-control-box .moveable-control.moveable-resizable[data-direction=e] {
                margin-left: 0;
            }

            .moveable-control-box .moveable-control.moveable-resizable[data-direction=w] {
                margin-left: -4px;
            }

            .moveable-control-box .moveable-control.moveable-resizable[data-direction=e],
            .moveable-control-box .moveable-control.moveable-resizable[data-direction=w] {
                width: 4px;
                height: 14px;
            }

            .moveable-control-box .moveable-control.moveable-resizable[data-direction=ne],
            .moveable-control-box .moveable-control.moveable-resizable[data-direction=se] {
                margin-left: -11px;
            }

            .moveable-control-box .moveable-control.moveable-resizable[data-direction=nw],
            .moveable-control-box .moveable-control.moveable-resizable[data-direction=sw] {
                margin-left: -4px;
            }

            .moveable-control-box .moveable-control.moveable-resizable[data-direction=ne]:before,
            .moveable-control-box .moveable-control.moveable-resizable[data-direction=nw]:before,
            .moveable-control-box .moveable-control.moveable-resizable[data-direction=se]:before,
            .moveable-control-box .moveable-control.moveable-resizable[data-direction=sw]:before {
                display: block;
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: inherit;
                background: var(--moveable-color);
            }

            .moveable-control-box .moveable-control.moveable-resizable[data-direction=ne]:before {
                transform-origin: top right;
                bottom: 0;
                right: 4px;
                rotate: 270deg;
            }

            .moveable-control-box .moveable-control.moveable-resizable[data-direction=nw]:before {
                transform-origin: top left;
                bottom: 0;
                left: 4px;
                rotate: 90deg;
            }

            .moveable-control-box .moveable-control.moveable-resizable[data-direction=se]:before {
                transform-origin: bottom right;
                bottom: 0;
                right: 4px;
                rotate: 90deg;
            }

            .moveable-control-box .moveable-control.moveable-resizable[data-direction=sw]:before {
                transform-origin: bottom left;
                bottom: 0;
                left: 4px;
                rotate: 270deg;
            }

            /* Snap guide lines - Default style */

            .moveable-guideline-group .moveable-line {
                border-style: dashed;
                border-width: 0;
                border-color: rgba(212, 28, 0, 0.55);
            }

            .moveable-guideline-group .moveable-line.moveable-horizontal {
                border-top-width: 1px;
            }

            .moveable-guideline-group .moveable-size-value.moveable-gap {
                background: rgb(197, 74, 55) !important;
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.18);
                white-space: nowrap;
                font-size: 10px;
                line-height: 1;
                padding: 2px 6px;
                border-radius: 4px;
                bottom: initial !important;
                top: 50% !important;
                transform: translate(-50%, -50%) !important;
                z-index: 3;
                font-weight: normal;
            }
        `];let $s=Ss;ws([pt({context:a})],$s.prototype,"dragDropManager"),ws([pt({context:r})],$s.prototype,"blockRegistry"),ws([tt({type:String})],$s.prototype,"canvasId"),ws([tt({type:Boolean})],$s.prototype,"showPositionGuides"),ws([tt({type:Boolean})],$s.prototype,"showSnapGuides"),ws([st()],$s.prototype,"isCanvasSelected"),ws([st()],$s.prototype,"showContextualBlockToolbar"),ws([st()],$s.prototype,"showControls"),ws([st()],$s.prototype,"overflowAllowBlocksOutside"),ws([st()],$s.prototype,"linkModeState"),er.define("builder-canvas",$s);var Cs=Object.defineProperty,Es=Object.getOwnPropertyDescriptor,Is=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Es(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Cs(t,i,a),a};let Ms=class extends it{constructor(){super(...arguments),this.baseMediaId=he,this.selectionMode=!1,this.selectedReference=null,this.currentMediaId="",this.items=[],this.loading=!1,this.uploading=!1,this.uploadProgress={current:0,total:0},this.searchQuery="",this.errorMessage=null,this.dragActive=!1,this.previewErrors=new Set,this.selectedPreviewUrl=null,this.selectedPreviewName=null,this.selectedPreviewIsImage=!1,this.selectedPreviewType=null,this.errorTimeoutId=null,this.initialized=!1,this.initializing=!1}updated(e){e.has("hass")&&this.hass&&(this.mediaService=new Ct(this.hass)),e.has("baseMediaId")&&(this.initialized=!1),e.has("selectedReference")&&!this.selectedReference&&this.updatePreview(null,null,!1,null),!e.has("hass")&&!e.has("baseMediaId")||!this.hass||this.initialized||this.initializing||(this.initializing=!0,this.initialize().finally(()=>{this.initialized=!0,this.initializing=!1}))}render(){return this.hass?ot`
            <div class="media-manager">
                <div class="toolbar">
                    <button class="button primary" @click=${this.handleUploadClick} ?disabled=${this.uploading}>
                        <ha-icon icon="mdi:upload"></ha-icon>
                        Upload
                    </button>
                    <button class="button" @click=${this.refresh} ?disabled=${this.loading||this.uploading}>
                        <ha-icon icon="mdi:refresh"></ha-icon>
                        Refresh
                    </button>
                    <div class="spacer"></div>
                    <input
                        class="search-input"
                        type="search"
                        placeholder="Search..."
                        .value=${this.searchQuery}
                        @input=${this.handleSearchInput}
                    />
                </div>

                ${this.errorMessage?ot`<div class="error-banner">${this.errorMessage}</div>`:dt}

                ${this.renderBreadcrumbs()}

                <div
                    class="drop-zone ${this.dragActive?"dragging":""}"
                    @dragenter=${this.handleDragEnter}
                    @dragover=${this.handleDragOver}
                    @dragleave=${this.handleDragLeave}
                    @drop=${this.handleDrop}
                >
                    Drag files here to upload or use the Upload button.
                </div>

                ${this.uploading?ot`
                        <div class="upload-status">
                            <div class="spinner"></div>
                            <span>Uploading ${this.uploadProgress.current}/${this.uploadProgress.total}</span>
                        </div>
                    `:dt}

                <input
                    type="file"
                    multiple
                    hidden
                    @change=${this.handleFileInput}
                />

                <div class="content ${this.selectedReference?"split":""}">
                    <div class="grid-panel">
                        <div class="grid">
                            ${this.loading?ot`<div class="empty-state">Loading...</div>`:0===this.filteredItems.length?ot`<div class="empty-state">No files found.</div>`:this.filteredItems.map(e=>this.renderItem(e))}
                        </div>
                    </div>
                    ${this.selectedReference?ot`
                        <div class="preview-panel">
                            <div class="preview-title">Selected media</div>
                            <div class="preview-frame">
                                ${this.selectedPreviewIsImage&&this.selectedPreviewUrl?ot`<img src="${this.selectedPreviewUrl}" alt="${this.selectedPreviewName??""}" />`:ot`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}
                            </div>
                            ${this.selectedPreviewName?ot`
                                <div class="preview-meta">${this.selectedPreviewName}</div>
                            `:dt}
                            ${this.selectedPreviewType?ot`
                                <div class="preview-meta">${this.selectedPreviewType}</div>
                            `:dt}
                        </div>
                    `:dt}
                </div>
            </div>
        `:ot`<div class="media-manager"><div class="empty-state">Home Assistant not available.</div></div>`}renderBreadcrumbs(){const e=this.getBreadcrumbs();return 0===e.length?dt:ot`
            <div class="breadcrumbs">
                ${e.map((t,i)=>ot`
                    <button @click=${()=>this.navigateTo(t.mediaId)}>${t.label}</button>
                    ${i<e.length-1?ot`<span class="separator">/</span>`:dt}
                `)}
            </div>
        `}renderItem(e){const t=this.isFolder(e),i=this.isImage(e),o=this.getPreviewUrl(e),r=this.selectedReference===e.media_content_id;return ot`
            <div class="item ${r?"selected":""}" @click=${()=>this.handleItemClick(e)}>
                ${t?dt:ot`
                    <div class="item-actions" @click=${e=>e.stopPropagation()}>
                        <button class="icon-button" @click=${t=>this.handleDelete(t,e)}>
                            <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                        </button>
                    </div>
                `}
                <div class="thumbnail">
                    ${o&&i?ot`<img src="${o}" @error=${()=>this.handlePreviewError(e)} />`:ot`<ha-icon icon="${t?"mdi:folder":"mdi:image-off-outline"}"></ha-icon>`}
                </div>
                <div class="item-name" title=${e.title}>${e.title}</div>
            </div>
        `}get filteredItems(){if(!this.searchQuery)return this.items;const e=this.searchQuery.toLowerCase();return this.items.filter(t=>t.title.toLowerCase().includes(e))}async initialize(){if(!this.mediaService)return;const e=this.baseMediaId||he;this.currentMediaId=e,await this.loadCurrent()}async loadCurrent(){if(this.mediaService){this.loading=!0,this.errorMessage=null;try{const e=(await this.mediaService.browse(this.currentMediaId||this.baseMediaId)).children||[];this.items=this.sortItems(e)}catch(e){this.items=[],this.setError(this.getErrorMessage(e,"Failed to load media."))}finally{this.loading=!1}}}sortItems(e){return[...e].sort((e,t)=>{const i=this.isFolder(e);return i!==this.isFolder(t)?i?-1:1:e.title.localeCompare(t.title)})}getBreadcrumbs(){const e=this.baseMediaId||he,t=this.currentMediaId||e,o=i(t),r=[{label:"Card Builder",mediaId:e}];if(!o)return r;const a=o.split("/").filter(Boolean);let s="";for(const i of a)s=s?`${s}/${i}`:i,r.push({label:i,mediaId:ue(s)});return r}isFolder(e){return Boolean(e.can_expand)||"directory"===e.media_class||"directory"===e.media_content_type}isImage(e){var t;return(null==(t=e.media_content_type)?void 0:t.startsWith("image/"))||"image"===e.media_class}getPreviewUrl(e){return this.previewErrors.has(e.media_content_id)?null:e.thumbnail?e.thumbnail:this.isImage(e)?ge(e.media_content_id):null}handlePreviewError(e){this.previewErrors=new Set(this.previewErrors).add(e.media_content_id)}async handleItemClick(e){if(this.isFolder(e))return this.clearSelection(),void this.navigateTo(e.media_content_id);const t=e.media_content_id;this.selectedReference=t;const i=await ve(this.hass,t),o=i??ge(t);this.updatePreview(e.title,e.media_content_type,this.isImage(e),o),this.dispatchEvent(new CustomEvent("media-selected",{detail:{reference:t,url:i,name:e.title,contentType:e.media_content_type},bubbles:!0,composed:!0}))}navigateTo(e){this.clearSelection(),this.currentMediaId=e,this.loadCurrent()}handleUploadClick(){var e;null==(e=this.fileInput)||e.click()}handleFileInput(e){const t=e.target;t.files&&0!==t.files.length&&(this.uploadFiles(Array.from(t.files)),t.value="")}handleSearchInput(e){const t=e.target;this.searchQuery=t.value}async uploadFiles(e){var o;if(!this.mediaService||0===e.length)return;const r=this.currentMediaId||this.baseMediaId;if(!t(r))return void this.setError("Upload is available only for Card Builder media.");this.uploading=!0,this.uploadProgress={current:0,total:e.length};const a=[];let s=null;try{for(const t of e){this.uploadProgress={current:this.uploadProgress.current+1,total:this.uploadProgress.total};const e=await this.mediaService.uploadFile(t,r),n=[i(r),t.name].filter(Boolean).join("/"),l=(null==e?void 0:e.reference)||ue(n);a.push(l),this.selectedReference=l,s={reference:l,name:t.name,isImage:(null==(o=t.type)?void 0:o.startsWith("image/"))??!1,contentType:t.type||null}}if(await this.loadCurrent(),s){const e=ge(s.reference);this.updatePreview(s.name,s.contentType,s.isImage,e)}a.length>0&&this.dispatchEvent(new CustomEvent("media-uploaded",{detail:{references:a,lastReference:a[a.length-1]},bubbles:!0,composed:!0}))}catch(n){this.setError(this.getErrorMessage(n,"Upload failed."))}finally{this.uploading=!1}}async handleDelete(e,t){if(e.stopPropagation(),!this.mediaService)return;if(this.isFolder(t))return;if(window.confirm(`Delete "${t.title}"?`))try{await this.mediaService.deleteFile(t.media_content_id),await this.loadCurrent()}catch(i){this.setError(this.getErrorMessage(i,"Delete failed."))}}handleDragEnter(e){e.preventDefault(),this.dragActive=!0}handleDragOver(e){e.preventDefault(),this.dragActive=!0}handleDragLeave(e){e.target===e.currentTarget&&(this.dragActive=!1)}handleDrop(e){var t;e.preventDefault(),this.dragActive=!1;const i=Array.from((null==(t=e.dataTransfer)?void 0:t.files)??[]);0!==i.length&&this.uploadFiles(i)}refresh(){this.clearSelection(),this.loadCurrent()}updatePreview(e,t,i,o){this.selectedPreviewName=e,this.selectedPreviewType=t,this.selectedPreviewIsImage=i,this.selectedPreviewUrl=o}clearSelection(){this.selectedReference=null,this.updatePreview(null,null,!1,null)}setError(e){this.errorMessage=e,null!==this.errorTimeoutId&&window.clearTimeout(this.errorTimeoutId),this.errorTimeoutId=window.setTimeout(()=>{this.errorMessage=null,this.errorTimeoutId=null},5e3)}getErrorMessage(e,t){var i;if(!e)return t;if("string"==typeof e)return e;if(e instanceof Error)return e.message||t;if("object"==typeof e){const o=e;return o.message||o.error||(null==(i=null==o?void 0:o.body)?void 0:i.message)||t}return t}};Ms.styles=et`
        :host {
            display: block;
            height: 100%;
            color: var(--primary-text-color);
            background: var(--primary-background-color);
            font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
        }

        .media-manager {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 16px;
            box-sizing: border-box;
            height: 100%;
        }

        .toolbar {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }

        .toolbar .spacer {
            flex: 1;
        }

        .button {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid var(--divider-color);
            background: var(--card-background-color);
            color: var(--primary-text-color);
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.2px;
        }

        .button.primary {
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            border-color: transparent;
        }

        .button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .search-input {
            flex: 1;
            min-width: 160px;
            padding: 8px 10px;
            border-radius: 6px;
            border: 1px solid var(--divider-color);
            background: var(--card-background-color);
            color: var(--primary-text-color);
            font-size: 12px;
        }

        .breadcrumbs {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: var(--secondary-text-color);
            flex-wrap: wrap;
        }

        .breadcrumbs button {
            border: none;
            background: none;
            color: var(--primary-color);
            cursor: pointer;
            padding: 0;
            font-size: 12px;
        }

        .breadcrumbs .separator {
            color: var(--secondary-text-color);
        }

        .drop-zone {
            border: 2px dashed var(--divider-color);
            border-radius: 10px;
            padding: 16px;
            text-align: center;
            background: var(--card-background-color);
            color: var(--secondary-text-color);
            transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        .drop-zone.dragging {
            border-color: var(--primary-color);
            background: rgba(3, 169, 244, 0.08);
            color: var(--primary-text-color);
        }

        .upload-status {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            color: var(--primary-text-color);
        }

        .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid var(--primary-color);
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        .error-banner {
            padding: 10px 12px;
            border-radius: 8px;
            background: rgba(219, 68, 55, 0.12);
            border: 1px solid var(--error-color, #db4437);
            color: var(--error-color, #db4437);
            font-size: 12px;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 12px;
            flex: 1;
            overflow: auto;
            padding-bottom: 4px;
            align-content: start;
            align-items: start;
            grid-auto-rows: max-content;
        }

        .content {
            flex: 1;
            min-height: 0;
            display: grid;
            grid-template-columns: minmax(0, 1fr);
            gap: 12px;
        }

        .content.split {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        }

        .grid-panel,
        .preview-panel {
            min-height: 0;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .preview-panel {
            border: 1px solid var(--divider-color);
            border-radius: 12px;
            background: var(--card-background-color);
            padding: 12px;
            gap: 12px;
        }

        .preview-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--primary-text-color);
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }

        .preview-frame {
            flex: 1;
            border-radius: 10px;
            border: 1px solid var(--divider-color);
            background: var(--secondary-background-color);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            min-height: 0;
        }

        .preview-frame img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .preview-meta {
            font-size: 12px;
            color: var(--secondary-text-color);
            word-break: break-all;
        }

        .item {
            background: var(--card-background-color);
            border: 2px solid var(--divider-color);
            border-radius: 6px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            cursor: pointer;
            position: relative;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .item:hover,
        .item.selected {
            border-color: var(--primary-color);
        }

        .item-actions {
            position: absolute;
            top: 6px;
            right: 6px;
            display: flex;
            gap: 4px;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 1;
        }

        .item:hover .item-actions {
            opacity: 1;
        }

        .icon-button {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            border: 1px solid var(--divider-color);
            background: var(--card-background-color);
            color: var(--primary-text-color);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            --mdc-icon-size: 16px;
        }

        .icon-button:hover {
            border-color: var(--error-color, #db4437);
            color: var(--error-color, #db4437);
        }

        .thumbnail {
            width: 100%;
            aspect-ratio: 1 / 1;
            border-radius: 8px;
            background: var(--secondary-background-color);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .item-name {
            font-size: 12px;
            color: var(--primary-text-color);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .empty-state {
            font-size: 13px;
            color: var(--secondary-text-color);
            text-align: center;
            padding: 24px 0;
        }
    `,Is([tt({attribute:!1})],Ms.prototype,"hass",2),Is([tt({type:String})],Ms.prototype,"baseMediaId",2),Is([tt({type:Boolean})],Ms.prototype,"selectionMode",2),Is([tt({type:String})],Ms.prototype,"selectedReference",2),Is([st()],Ms.prototype,"currentMediaId",2),Is([st()],Ms.prototype,"items",2),Is([st()],Ms.prototype,"loading",2),Is([st()],Ms.prototype,"uploading",2),Is([st()],Ms.prototype,"uploadProgress",2),Is([st()],Ms.prototype,"searchQuery",2),Is([st()],Ms.prototype,"errorMessage",2),Is([st()],Ms.prototype,"dragActive",2),Is([st()],Ms.prototype,"previewErrors",2),Is([st()],Ms.prototype,"selectedPreviewUrl",2),Is([st()],Ms.prototype,"selectedPreviewName",2),Is([st()],Ms.prototype,"selectedPreviewIsImage",2),Is([st()],Ms.prototype,"selectedPreviewType",2),Is([nt('input[type="file"]')],Ms.prototype,"fileInput",2),Ms=Is([rt("media-manager")],Ms);var Ps=Object.defineProperty,Ts=Object.getOwnPropertyDescriptor,Bs=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Ts(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Ps(t,i,a),a};let Rs=class extends es{constructor(){super(...arguments),this.mode="manage",this.title="Media Manager",this.subtitle="Manage your media",this.confirmLabel="Use selected media",this.selection=null,this._handleMediaSelected=async e=>{const{reference:t,url:i,name:o,contentType:r}=e.detail||{};if(!t)return;const a=i??await ve(this.hass,t);this.selection={reference:t,url:a??null,name:o||G(t)||t,contentType:r}},this._handleMediaUploaded=async e=>{if("select"!==this.mode)return;const t=e.detail;if(!(null==t?void 0:t.lastReference))return;const i=await ve(this.hass,t.lastReference);this.selection={reference:t.lastReference,url:i??null,name:G(t.lastReference)||t.lastReference}}}get dialogTitle(){return this.title}get dialogSubtitle(){return this.subtitle||null}updated(e){super.updated(e),e.has("open")&&!this.open&&(this.selection=null),e.has("mode")&&"manage"===this.mode&&(this.selection=null)}renderDialogBody(){var e;return ot`
            <media-manager
                .hass=${this.hass}
                .selectionMode=${"select"===this.mode}
                .selectedReference=${(null==(e=this.selection)?void 0:e.reference)??null}
                @media-selected=${this._handleMediaSelected}
                @media-uploaded=${this._handleMediaUploaded}
            ></media-manager>
        `}renderDialogFooter(){return"select"===this.mode?ot`
                <div class="dialog-footer">
                    <div class="selection-chip">
                        ${this.selection?this.selection.name:"No media selected"}
                    </div>
                    <div class="footer-spacer"></div>
                    <button class="secondary-btn" @click=${this.handleClose}>Cancel</button>
                    <button class="primary-btn" ?disabled=${!this.selection} @click=${this._confirmSelection}>
                        ${this.confirmLabel}
                    </button>
                </div>
            `:ot`
            <div class="dialog-footer">
                <div class="footer-spacer"></div>
                <button class="secondary-btn" @click=${this.handleClose}>Close</button>
            </div>
        `}_confirmSelection(){this.selection&&(this.dispatchEvent(new CustomEvent("media-confirm",{detail:this.selection,bubbles:!0,composed:!0})),this.handleClose())}onBeforeClose(){this.selection=null}};Rs.styles=[...es.styles,et`
            .dialog-body {
                padding: 0;
            }

            media-manager {
                flex: 1;
                height: 100%;
            }

            .selection-chip {
                padding: 6px 10px;
                background: var(--bg-primary, #fff);
                border: 1px solid var(--border-color, #e0e0e0);
                border-radius: 999px;
                font-size: 12px;
                color: var(--text-primary, #333);
                max-width: 260px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        `],Bs([tt({attribute:!1})],Rs.prototype,"hass",2),Bs([tt({type:String})],Rs.prototype,"mode",2),Bs([tt({type:String})],Rs.prototype,"title",2),Bs([tt({type:String})],Rs.prototype,"subtitle",2),Bs([tt({type:String})],Rs.prototype,"confirmLabel",2),Bs([st()],Rs.prototype,"selection",2),Rs=Bs([rt("media-manager-overlay")],Rs);var Ds=Object.defineProperty,Os=Object.getOwnPropertyDescriptor,As=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Os(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Ds(t,i,a),a};const zs=((e=class extends it{constructor(){super(),this.hassProvider=new yt(this,{context:be}),this.theme="light",this.environment={isBuilder:!0,blocksOutlineEnabled:!0,actionsEnabled:!1},this.documentModel=new me,this.blockRegistry=fe,this.containerManager=new ye,this.previewThemeMode="auto",this.linkEditorPreferences={...xe},this.overlayRegistry=new Map,this.overlayHost={registerOverlay:(e,t)=>{this.overlayRegistry.set(e,t),this.requestUpdate()},unregisterOverlay:e=>{this.overlayRegistry.delete(e)&&this.requestUpdate()},invalidateOverlays:()=>{this.requestUpdate()}},this.containers=[],this.canvasElement=null,this.styleResolverReady=!1,this.slotEntitiesManagerOpen=!1,this.slotActionsManagerOpen=!1,this.linkModeEnabled=!1,this.mediaManagerOpen=!1,this.styleClipboardActive=!1,this.rightSidebarWidth=260,this.mediaManagerMode="manage",this.mediaManagerRequestId=null,this.mediaManagerTitle="Media Manager",this.mediaManagerSubtitle="Manage your media",this.mediaManagerConfirmLabel="Use selected media",this._showPositionGuides=!0,this._showSnapGuides=!0,this.headerActions=new Map,this._openMediaManagerFromHeader=()=>{this._openMediaManager({mode:"manage"})},this._closeMediaManager=()=>{"select"===this.mediaManagerMode&&this.mediaManagerRequestId&&this.eventBus.dispatchEvent("media-manager-cancelled",{requestId:this.mediaManagerRequestId}),this.mediaManagerOpen=!1,this.mediaManagerMode="manage",this.mediaManagerRequestId=null},this._handleMediaConfirm=e=>{const t=e.detail;"select"===this.mediaManagerMode&&this.mediaManagerRequestId&&(null==t?void 0:t.reference)&&this.eventBus.dispatchEvent("media-manager-selected",{requestId:this.mediaManagerRequestId,selection:t}),this._closeMediaManager()},this._clearStyleClipboard=()=>{this.styleClipboardActive=!1,this.eventBus.dispatchEvent("style-clipboard-clear")},this._toggleActionsEnabled=()=>{this.environment={...this.environment,actionsEnabled:!this.environment.actionsEnabled}},this._toggleLinkMode=()=>{this.linkModeController.toggleLinkMode()},this._handleRightSidebarWidthChanged=e=>{(null==e?void 0:e.detail)&&"number"==typeof e.detail.width&&this._setRightSidebarWidth(e.detail.width,!0)},this.headerActions.set("style-clipboard",()=>this._renderHeaderActionStyleClipboard()),this.headerActions.set("link-mode-toggle",()=>this._renderHeaderActionLinkModeToggle()),this.headerActions.set("blocks-outline-toggle",()=>this._renderHeaderActionBlocksOutlineToggle()),this.headerActions.set("actions-toggle",()=>this._renderHeaderActionActionsToggle()),this.style.setProperty("--right-sidebar-width",`${this.rightSidebarWidth}px`)}set hass(e){this._hass=e,this.styleResolver&&this.styleResolver.setBindingEvaluator(this._createBindingEvaluator()),this.hassProvider.setValue(e)}async connectedCallback(){super.connectedCallback(),this.linkModeController=new _e({documentModel:this.documentModel,eventBus:this.eventBus,blockRegistry:this.blockRegistry,preferences:this.linkEditorPreferences}),this._loadCanvasUserPreferences(),this.dragDropManager=new ke(this.eventBus),await this._initializeStyleResolver(),this.documentModel.addEventListener("change",e=>{this._notifyConfigChange(e.detail)}),this.documentModel.addEventListener("link-mode-changed",e=>{var t;const i=e.detail;this.linkModeEnabled=Boolean(null==(t=null==i?void 0:i.state)?void 0:t.enabled)}),this.containers=this.containerManager.getContainers(),this.activeContainerId=this.containerManager.getActiveContainerId(),this.eventBus.addEventListener("canvas-size-changed",({width:e,height:t})=>this._onCanvasSizeChanged(e,t)),this.addEventListener("manage-entities-slots",()=>{this.slotEntitiesManagerOpen=!0}),this.addEventListener("manage-action-slots",()=>{this.slotActionsManagerOpen=!0}),this.eventBus.addEventListener("media-manager-open",e=>{this._openMediaManager(e)}),this.eventBus.addEventListener("link-editor-preferences-changed",e=>{this._updateLinkEditorPreferences((null==e?void 0:e.preferences)??{})}),this.eventBus.addEventListener("style-clipboard-changed",e=>{this.styleClipboardActive=Boolean(null==e?void 0:e.hasClipboard)})}async firstUpdated(){var e;await this.updateComplete,this.canvasElement=null==(e=this.shadowRoot)?void 0:e.querySelector("#builder-canvas"),this._applyEditorBackgroundVariables()}updated(e){super.updated(e),e.has("hass")&&this._hass&&this.styleResolver&&this.styleResolver.setBindingEvaluator(this._createBindingEvaluator()),e.has("globalEditorSettings")&&this._applyEditorBackgroundVariables()}disconnectedCallback(){var e,t;super.disconnectedCallback(),null==(e=this.dragDropManager)||e.destroy(),null==(t=this.linkModeController)||t.destroy()}render(){if(!this.styleResolverReady||!this._hass)return ot``;const e=_i(this._hass,this.previewThemeMode);return ot`
            <div class="builder-container">
                <div class="builder-body">
                    <aside class="sidebar sidebar-left">
                        <sidebar-left></sidebar-left>
                    </aside>
                    <div class="builder-center">
                        ${this._renderHeader()}
                        <hui-view-container
                            .hass=${e.hass}
                            .theme=${e.theme}
                            class="builder-center-scroll"
                        >
                            ${this._renderCanvas()}
                        </hui-view-container>
                    </div>
                    <aside class="sidebar sidebar-right">
                        <sidebar-right
                            .canvasWidth=${this.canvasWidth}
                            .canvasHeight=${this.canvasHeight}
                            .canvas=${this.canvasElement}
                            .hass=${this._hass}
                            .width=${this.rightSidebarWidth}
                            @right-sidebar-width-changed=${this._handleRightSidebarWidthChanged}
                        ></sidebar-right>
                    </aside>
                </div>
            </div>
            <entity-slots-editor-overlay
                .open=${this.slotEntitiesManagerOpen}
                .hass=${this._hass}
                @overlay-close=${()=>{this.slotEntitiesManagerOpen=!1}}
                @slot-reference-navigate=${this._handleSlotReferenceNavigate}
            ></entity-slots-editor-overlay>
            <action-slots-editor-overlay
                .open=${this.slotActionsManagerOpen}
                .hass=${this._hass}
                @overlay-close=${()=>{this.slotActionsManagerOpen=!1}}
                @slot-reference-navigate=${this._handleSlotReferenceNavigate}
            ></action-slots-editor-overlay>
            <media-manager-overlay
                .open=${this.mediaManagerOpen}
                .hass=${this._hass}
                .mode=${this.mediaManagerMode}
                .title=${this.mediaManagerTitle}
                .subtitle=${this.mediaManagerSubtitle}
                .confirmLabel=${this.mediaManagerConfirmLabel}
                @overlay-close=${this._closeMediaManager}
                @media-confirm=${this._handleMediaConfirm}
            ></media-manager-overlay>
            ${Array.from(this.overlayRegistry.values()).map(e=>e())}
        `}_renderHeader(){return ot`
            <header class="builder-header">
                <div class="builder-header-left">
                    <button
                        class="header-action ${this.slotEntitiesManagerOpen?"active":""}"
                        @click=${this._toggleSlotManager}
                        title="Manage Entities Slots"
                        aria-pressed=${this.slotEntitiesManagerOpen?"true":"false"}
                    >
                        Entities
                    </button>
                    <button
                        class="header-action ${this.slotActionsManagerOpen?"active":""}"
                        @click=${this._toggleSlotActionsManager}
                        title="Manage Action Slots"
                        aria-pressed=${this.slotActionsManagerOpen?"true":"false"}
                    >
                        Actions
                    </button>
                    <button
                        class="header-action ${this.mediaManagerOpen&&"manage"===this.mediaManagerMode?"active":""}"
                        @click=${this._openMediaManagerFromHeader}
                        title="Media Manager"
                        aria-pressed=${this.mediaManagerOpen&&"manage"===this.mediaManagerMode?"true":"false"}
                    >
                        Media
                    </button>
                </div>
                <div class="builder-header-center">
                    ${this._renderHeaderContainerSelector()}
                    ${this._renderThemeModeToggle()}
                </div>
                <div class="builder-header-actions">
                    ${Array.from(this.headerActions.values()).map(e=>e())}
                </div>
                ${this._renderThemePreviewWarning()}
            </header>
        `}_renderHeaderContainerSelector(){return ot`
            <container-selector
                .containers=${this.containers}
                .activeContainerId=${this.activeContainerId}
            ></container-selector>
        `}_renderThemeModeToggle(){return ot`
            <div class="theme-mode-toggle" aria-label="Color theme edit mode">
                <button
                    class="theme-mode-option ${"auto"===this.previewThemeMode?"active":""}"
                    @click=${()=>this._setPreviewThemeMode("auto")}
                    title="Edit base color values"
                    aria-pressed=${"auto"===this.previewThemeMode?"true":"false"}
                >
                    <ha-icon icon="mdi:auto-mode"></ha-icon>
                    <span>Auto</span>
                </button>
                <button
                    class="theme-mode-option ${"light"===this.previewThemeMode?"active":""}"
                    @click=${()=>this._setPreviewThemeMode("light")}
                    title="Edit light mode color overrides"
                    aria-pressed=${"light"===this.previewThemeMode?"true":"false"}
                >
                    <ha-icon icon="mdi:white-balance-sunny"></ha-icon>
                </button>
                <button
                    class="theme-mode-option ${"dark"===this.previewThemeMode?"active":""}"
                    @click=${()=>this._setPreviewThemeMode("dark")}
                    title="Edit dark mode color overrides"
                    aria-pressed=${"dark"===this.previewThemeMode?"true":"false"}
                >
                    <ha-icon icon="mdi:weather-night"></ha-icon>
                </button>
            </div>
        `}_renderThemePreviewWarning(){if("auto"===this.previewThemeMode)return dt;const e=o(this._hass);return this.previewThemeMode===e?dt:ot`
            <div class="theme-preview-warning">
                <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                <span>Card Builder overrides use preview mode. HA-native CSS variables still resolve from the live Home Assistant theme.</span>
            </div>
        `}_renderHeaderActionStyleClipboard(){return this.styleClipboardActive?ot`
            <button
                class="header-action header-toggle clipboard-toggle ${this.styleClipboardActive?"active":""}"
                @click=${this._clearStyleClipboard}
                title="Clear inline styles clipboard"
                aria-pressed=${this.styleClipboardActive?"true":"false"}
            >
                <ha-icon icon="mdi:clipboard-check-outline"></ha-icon>
            </button>
        `:dt}_renderHeaderActionBlocksOutlineToggle(){return ot`
            <button
                class="header-action header-toggle ${this.environment.blocksOutlineEnabled?"active":""}"
                @click=${this._toggleBlocksHighlight}
                title=${this.environment.blocksOutlineEnabled?"Disable Blocks Outline":"Enable Blocks Outline"}
                aria-pressed=${this.environment.blocksOutlineEnabled?"true":"false"}
            >
                <ha-icon icon="mdi:selection"></ha-icon>
            </button>
        `}_renderHeaderActionLinkModeToggle(){return ot`
            <button
                class="header-action header-toggle ${this.linkModeEnabled?"active":""}"
                @click=${this._toggleLinkMode}
                title=${this.linkModeEnabled?"Exit Link Mode":"Enter Link Mode"}
                aria-pressed=${this.linkModeEnabled?"true":"false"}
            >
                <ha-icon icon="mdi:vector-line"></ha-icon>
            </button>
        `}_renderHeaderActionActionsToggle(){return ot`
            <button
                class="header-action header-toggle ${this.environment.actionsEnabled?"active":""}"
                @click=${this._toggleActionsEnabled}
                title=${this.environment.actionsEnabled?"Disable Actions":"Enable Actions"}
                aria-pressed=${this.environment.actionsEnabled?"true":"false"}
            >
                <ha-icon icon="mdi:gesture-tap-button"></ha-icon>
            </button>
        `}_renderCanvas(){const e=this.containerManager.getActiveContainer();return ot`
            <builder-canvas
                id="builder-canvas"
                class="container-${e.id}"
                .canvasId=${"main-canvas"}
                .showPositionGuides=${this._showPositionGuides}
                .showSnapGuides=${this._showSnapGuides}
                @position-guides-preference-changed=${this._onPositionGuidesPreferenceChanged}
                @snap-guides-preference-changed=${this._onSnapGuidesPreferenceChanged}
            ></builder-canvas>
        `}loadConfig(e){if(e&&"object"==typeof e){const{config:t}=we(e);this.documentModel.loadFromConfig(t),this._applyEditorBackgroundVariables()}}exportConfig(){return this.documentModel.exportToConfig()}getEditorSettings(){return this.documentModel.getEditorSettings()}setEditorSettings(e){this.documentModel.setEditorSettings(e),this._applyEditorBackgroundVariables()}setThemeSupport(e){this.documentModel.setThemeSupport(e)}clearDocument(){this.documentModel.clear(),this._applyEditorBackgroundVariables()}async _initializeStyleResolver(){try{const e=await ee(this._hass);this.styleResolver=new Se(this.documentModel,this.containerManager,e,this.blockRegistry),this._hass&&this.styleResolver.setBindingEvaluator(this._createBindingEvaluator()),this.styleResolverReady=!0}catch(e){console.error("[BuilderMain] Failed to initialize StyleResolver:",e)}}_toggleSlotManager(){this.slotEntitiesManagerOpen=!this.slotEntitiesManagerOpen}_toggleSlotActionsManager(){this.slotActionsManagerOpen=!this.slotActionsManagerOpen}_openMediaManager(e){const t=(null==e?void 0:e.mode)??"manage";this.mediaManagerMode=t,this.mediaManagerRequestId=(null==e?void 0:e.requestId)??null,this.mediaManagerTitle=(null==e?void 0:e.title)??("select"===t?"Select media":"Media Manager"),this.mediaManagerSubtitle=(null==e?void 0:e.subtitle)??("select"===t?"Choose or upload a file":"Manage your media"),this.mediaManagerConfirmLabel=(null==e?void 0:e.confirmLabel)??"Use selected media",this.mediaManagerOpen=!0}_toggleBlocksHighlight(){this.environment={...this.environment,blocksOutlineEnabled:!this.environment.blocksOutlineEnabled},localStorage.setItem(e.BLOCKS_OUTLINE_STORAGE_KEY,String(this.environment.blocksOutlineEnabled))}_setPreviewThemeMode(e){this.previewThemeMode!==e&&(this.previewThemeMode=e)}_loadCanvasUserPreferences(){var t,i;const o=localStorage.getItem(e.POSITION_GUIDES_STORAGE_KEY);null!==o&&(this._showPositionGuides="true"===o);const r=localStorage.getItem(e.SNAP_GUIDES_STORAGE_KEY);null!==r&&(this._showSnapGuides="true"===r);const a=localStorage.getItem(e.BLOCKS_OUTLINE_STORAGE_KEY);null!==a&&(this.environment={...this.environment,blocksOutlineEnabled:"true"===a});const s=localStorage.getItem(e.LINK_EDITOR_PREFS_STORAGE_KEY);if(s)try{const e=JSON.parse(s);this.linkEditorPreferences=$e(e)}catch{this.linkEditorPreferences={...xe}}null==(i=null==(t=this.linkModeController)?void 0:t.setPreferences)||i.call(t,this.linkEditorPreferences);const n=localStorage.getItem(e.RIGHT_SIDEBAR_WIDTH_STORAGE_KEY);if(null!==n){const e=parseInt(n,10);Number.isNaN(e)||this._setRightSidebarWidth(e,!1)}}_updateLinkEditorPreferences(t){var i,o;this.linkEditorPreferences={...this.linkEditorPreferences,...t},localStorage.setItem(e.LINK_EDITOR_PREFS_STORAGE_KEY,JSON.stringify(this.linkEditorPreferences)),null==(o=null==(i=this.linkModeController)?void 0:i.setPreferences)||o.call(i,this.linkEditorPreferences)}_onPositionGuidesPreferenceChanged(t){this._showPositionGuides=t.detail.status,localStorage.setItem(e.POSITION_GUIDES_STORAGE_KEY,String(this._showPositionGuides))}_onSnapGuidesPreferenceChanged(t){this._showSnapGuides=t.detail.status,localStorage.setItem(e.SNAP_GUIDES_STORAGE_KEY,String(this._showSnapGuides))}_onCanvasSizeChanged(e,t){this.canvasWidth=e,this.canvasHeight=t}_setRightSidebarWidth(t,i){const o=Math.max(e.RIGHT_SIDEBAR_MIN_WIDTH,Math.min(e.RIGHT_SIDEBAR_MAX_WIDTH,Math.round(t)));this.rightSidebarWidth!==o&&(this.rightSidebarWidth=o,this.style.setProperty("--right-sidebar-width",`${o}px`),i&&localStorage.setItem(e.RIGHT_SIDEBAR_WIDTH_STORAGE_KEY,String(o)))}async _handleSlotReferenceNavigate(e){const{reference:t}=e.detail;if(this.slotEntitiesManagerOpen=!1,this.slotActionsManagerOpen=!1,this.documentModel.select(t.blockId),"style-binding"===t.kind)return this._openSidebarTab("styles"),void(await this._openStyleBinding(t));this._openSidebarTab("properties"),"trait-binding"===t.kind&&await this._openTraitBinding(t)}_openSidebarTab(e){const t=this._getSidebarTabbed();(null==t?void 0:t.setActiveTab)&&t.setActiveTab(e)}_getSidebarTabbed(){var e,t;const i=null==(e=this.shadowRoot)?void 0:e.querySelector("sidebar-right");return null==(t=null==i?void 0:i.shadowRoot)?void 0:t.querySelector("sidebar-tabbed")}async _openStyleBinding(e){var t,i;if(!e.category||!e.property)return;await new Promise(e=>requestAnimationFrame(e));const o=null==(i=null==(t=this._getSidebarTabbed())?void 0:t.shadowRoot)?void 0:i.querySelector("panel-styles");o&&o.openBindingEditor&&o.openBindingEditor(e.category,e.property,e.property,e.styleTargetId??null)}async _openTraitBinding(e){var t,i;if(!e.propName)return;await new Promise(e=>requestAnimationFrame(e));const o=null==(i=null==(t=this._getSidebarTabbed())?void 0:t.shadowRoot)?void 0:i.querySelector("panel-properties");(null==o?void 0:o.openTraitBindingEditor)&&o.openTraitBindingEditor(e.propName)}_createBindingEvaluator(){return new j(this._hass,{resolveSlotEntity:e=>this.documentModel.resolveSlotEntity(e),onTemplateResult:()=>{this.eventBus.dispatchEvent("template-updated"),this.requestUpdate()}})}_notifyConfigChange(e){this.dispatchEvent(new CustomEvent("config-changed",{detail:e,bubbles:!0,composed:!0}))}_applyEditorBackgroundVariables(){this._setOptionalCssProperty(this,"--cb-editor-background-card",this._getEditorBackgroundCssValue(this.documentModel.getEditorSettings())),this._setOptionalCssProperty(this,"--cb-editor-background-global",this._getEditorBackgroundCssValue(this.globalEditorSettings))}_getEditorBackgroundCssValue(e){var t,i,o;const r=null==(t=null==e?void 0:e.options)?void 0:t.background;return r?"color"===r.mode?(null==(i=r.color)?void 0:i.trim())||null:"value"===r.mode&&(null==(o=r.value)?void 0:o.trim())||null:null}_setOptionalCssProperty(e,t,i){i?e.style.setProperty(t,i):e.style.removeProperty(t)}}).styles=et`
        :host {
            --sidebar-width: 260px;
            --right-sidebar-width: 260px;
            --header-height: 48px;
            --bg-primary: #ffffff;
            --bg-secondary: #f5f5f5;
            --bg-tertiary: #e8e8e8;
            --border-color: #d4d4d4;
            --text-primary: #333333;
            --text-secondary: #666666;
            --accent-color: #0078d4;
            --cb-editor-background-global: var(--bg-tertiary);
            --cb-editor-background-card: var(--cb-editor-background-global);
            display: block;
            height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }

        :host([theme='dark']) {
            --bg-primary: #1e1e1e;
            --bg-secondary: #252526;
            --bg-tertiary: #2d2d2d;
            --border-color: #3c3c3c;
            --text-primary: #cccccc;
            --text-secondary: #969696;
        }

        /* Global Moveable styles */

        :host ::slotted(*),
        * {
            --moveable-color: var(--accent-color);
        }

        .builder-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: var(--bg-primary);
            color: var(--text-primary);
        }

        .builder-center {
            position: relative;
            z-index: 0;
            display: flex;
            flex: 1 1 0;
            flex-direction: column;
            min-width: 0;
            overflow: hidden;
        }

        .builder-center-scroll {
            flex: 1 1 auto;
            overflow: auto;
            padding: 24px 40px 40px;
            box-sizing: border-box;
            background: var(--cb-editor-background-card);
            display: flex;
            align-items: flex-start;
            justify-content: center;
            scroll-padding-top: 24px;
            scroll-padding-bottom: 40px;
        }

        .builder-center-scroll > builder-canvas {
            margin-top: auto;
            margin-bottom: auto;
        }

        .builder-header {
            position: relative;
            height: var(--header-height);
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: stretch;
            justify-content: space-between;
            padding: 10px 16px;
            gap: 16px;
            box-sizing: border-box;
        }

        .builder-header-center {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
        }

        .builder-header-left {
            display: flex;
            align-items: center;
        }

        .builder-header-actions {
            display: flex;
            align-items: center;
            --mdc-icon-size: 16px;
        }

        .header-action {
            height: 100%;
            padding: 0 10px;
            border: 1px solid var(--border-color);
            background: var(--bg-primary);
            color: var(--text-primary);
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.2px;
            text-transform: uppercase;
            border-radius: 4px;
            cursor: pointer;
            transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
        }
        
        .header-action:has( + .header-action ) {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        .header-action + .header-action {
            border-left: none;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        .header-toggle.active {
            color: var(--accent-color);
            background: rgba(0, 120, 212, 0.08);
            outline: 1px solid var(--accent-color);
            outline-offset: -1px;
        }

        .header-action.clipboard-toggle.active {
            box-shadow: 0 0 6px rgba(0, 120, 212, 0.45);
        }

        .theme-mode-toggle {
            display: inline-flex;
            align-items: center;
            height: 100%;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-primary);
            overflow: hidden;
        }

        .theme-mode-option {
            min-width: 34px;
            height: 100%;
            padding: 0 8px;
            border: 0;
            background: transparent;
            color: var(--text-secondary);
            cursor: pointer;
            --mdc-icon-size: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            font-size: 11px;
            font-weight: 600;
            transition: color 0.15s ease, background 0.15s ease;
        }

        .theme-mode-option + .theme-mode-option {
            border-left: 1px solid var(--border-color);
        }

        .theme-mode-option.active {
            color: var(--accent-color);
            background: rgba(0, 120, 212, 0.08);
        }

        .theme-preview-warning {
            position: absolute;
            top: calc(100% + 15px);
            left: 50%;
            transform: translateX(-50%);
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 5px 8px;
            border: 1px solid rgba(245, 159, 0, 0.5);
            border-radius: 4px;
            background: rgba(245, 159, 0, 0.12);
            color: var(--text-primary);
            font-size: 13px;
            max-width: 90%;
            z-index: 100;
            --mdc-icon-size: 15px;
        }

        .builder-body {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        .sidebar {
            width: var(--sidebar-width);
            flex: 0 0 var(--sidebar-width);
            background: var(--cb-sidebar-background);
            border-right: 1px solid var(--border-color);
            overflow: hidden;
        }

        .sidebar-right {
            width: auto;
            flex: 0 0 auto;
            border-right: none;
            border-left: 1px solid var(--border-color);
        }
    `,e.POSITION_GUIDES_STORAGE_KEY="card-builder-position-guides",e.SNAP_GUIDES_STORAGE_KEY="card-builder-snap-guides",e.BLOCKS_OUTLINE_STORAGE_KEY="card-builder-blocks-outline",e.LINK_EDITOR_PREFS_STORAGE_KEY="card-builder-link-editor-preferences",e.RIGHT_SIDEBAR_WIDTH_STORAGE_KEY="card-builder-right-sidebar-width",e.RIGHT_SIDEBAR_MIN_WIDTH=200,e.RIGHT_SIDEBAR_MAX_WIDTH=600,e);As([tt({type:String,reflect:!0})],zs.prototype,"theme",2),As([xt({context:Ce}),st()],zs.prototype,"environment",2),As([xt({context:a})],zs.prototype,"dragDropManager",2),As([xt({context:s})],zs.prototype,"documentModel",2),As([xt({context:r})],zs.prototype,"blockRegistry",2),As([st(),xt({context:le})],zs.prototype,"containerManager",2),As([xt({context:de})],zs.prototype,"styleResolver",2),As([st(),xt({context:ce})],zs.prototype,"previewThemeMode",2),As([pt({context:d})],zs.prototype,"eventBus",2),As([st(),xt({context:c})],zs.prototype,"linkEditorPreferences",2),As([st(),xt({context:ki})],zs.prototype,"overlayHost",2),As([st()],zs.prototype,"containers",2),As([st()],zs.prototype,"activeContainerId",2),As([st()],zs.prototype,"canvasWidth",2),As([st()],zs.prototype,"canvasHeight",2),As([st()],zs.prototype,"canvasElement",2),As([st()],zs.prototype,"styleResolverReady",2),As([st()],zs.prototype,"slotEntitiesManagerOpen",2),As([st()],zs.prototype,"slotActionsManagerOpen",2),As([st()],zs.prototype,"linkModeEnabled",2),As([st()],zs.prototype,"mediaManagerOpen",2),As([st()],zs.prototype,"styleClipboardActive",2),As([st()],zs.prototype,"rightSidebarWidth",2),As([st()],zs.prototype,"mediaManagerMode",2),As([st()],zs.prototype,"mediaManagerRequestId",2),As([st()],zs.prototype,"mediaManagerTitle",2),As([st()],zs.prototype,"mediaManagerSubtitle",2),As([st()],zs.prototype,"mediaManagerConfirmLabel",2),As([xt({context:X})],zs.prototype,"linkModeController",2),As([tt({attribute:!1})],zs.prototype,"hass",1),As([tt({attribute:!1})],zs.prototype,"globalEditorSettings",2);let Ls=zs;er.define("builder-main",Ls);const Ns="card-builder",Fs={DASHBOARD:"dashboard",CARDS:"cards",ACCOUNT:"account",EDITOR_CREATE:"editor/create",EDITOR_EDIT:"editor/edit"};class Vs extends EventTarget{constructor(){super(),this.currentRoute=Fs.DASHBOARD,this.currentParams={},this._initialize()}navigate(e,t){this.currentRoute=e,this.currentParams=t||{};const i=`/${Ns}/${e}${t?"?"+new URLSearchParams(t).toString():""}`;window.history.pushState({route:e,params:t},"",i),this.dispatchEvent(new CustomEvent("route-changed",{detail:{route:this.currentRoute,params:this.currentParams}}))}getCurrentRoute(){return{route:this.currentRoute,params:{...this.currentParams}}}parseRoute(e,t=""){let i=e.startsWith("/")?e.substring(1):e;if(i.startsWith(Ns)&&(i=i.substring(12)),i=i.replace(/^\/+/,""),!i)return{route:Fs.DASHBOARD,params:{}};const o=new URLSearchParams(t),r=Object.values(Fs);for(const a of r)if(i===a)return{route:a,params:Object.fromEntries(o)};return{route:Fs.DASHBOARD,params:{}}}_initialize(){window.addEventListener("popstate",e=>{this._handleLocationChange(e)}),this._handleLocationChange()}_handleLocationChange(e){const t=window.location.pathname,i=this.parseRoute(t,window.location.search);this._routesAreEqual(this.currentRoute,this.currentParams,(null==e?void 0:e.state.route)??"",(null==e?void 0:e.state.params)??{})||(this.currentRoute=i.route,this.currentParams=i.params,this.dispatchEvent(new CustomEvent("route-changed",{detail:{route:this.currentRoute,params:this.currentParams}})))}_routesAreEqual(e,t,i,o){return e===i&&this._routesParamsAreEqual(t,o)}_routesParamsAreEqual(e,t){if(e===t)return!0;if("object"!=typeof e||"object"!=typeof t||null==e||null==t)return!1;const i=Object.keys(e),o=Object.keys(t);return i.length===o.length&&i.every(i=>o.includes(i)&&this._routesParamsAreEqual(e[i],t[i]))}}let Us=null;function js(){return Us||(Us=new Vs),Us}var Ws=Object.defineProperty,Gs=Object.getOwnPropertyDescriptor,Hs=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Gs(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Ws(t,i,a),a};let qs=class extends it{constructor(){super(...arguments),this.activeRoute="dashboard",this.collapsed=!1,this.isFullscreen=!1,this.narrow=!1,this.menuItems=[{id:Fs.DASHBOARD,icon:"mdi:view-dashboard",label:"Dashboard"},{id:Fs.CARDS,icon:"mdi:cards",label:"Cards"},{id:Fs.ACCOUNT,icon:"mdi:account-circle",label:"Account"}]}render(){return ot`
      <div class="sidebar-content">
        <div class="sidebar-header">
          <div class="sidebar-title">Card Builder</div>
          <button
            class="toggle-button"
            @click=${this._toggleCollapse}
            title=${this.collapsed?"Expand sidebar":"Collapse sidebar"}
          >
              <ha-icon icon="mdi:chevron-${this.collapsed?"right":"left"}"></ha-icon>
          </button>
        </div>

        <nav>
          <ul class="menu">
            ${this.menuItems.map(e=>this._renderMenuItem(e))}
          </ul>
        </nav>

        ${this.narrow?"":this._renderFooter()}
      </div>
    `}_renderMenuItem(e){const t=this.activeRoute===e.id;return ot`
      <li
        class="menu-item ${t?"active":""}"
        @click=${()=>this._handleNavigate(e.id)}
        title=${this.collapsed?e.label:""}
      >
          <ha-icon icon="${e.icon}" class="menu-item-icon"></ha-icon>
        <span class="menu-item-label">${e.label}</span>
      </li>
    `}_renderFooter(){return this.isFullscreen?ot`
        <div class="sidebar-footer">
          <button
            class="footer-button"
            @click=${this._handleExitDashboard}
            title=${this.collapsed?"Exit to dashboard":""}
          >
              <ha-icon icon="mdi:home" class="footer-button-icon"></ha-icon>
            <span class="footer-button-label">Exit to dashboard</span>
          </button>
          <button
            class="footer-button"
            @click=${this._handleToggleFullscreen}
            title=${this.collapsed?"Exit fullscreen":""}
          >
              <ha-icon icon="mdi:fullscreen-exit" class="footer-button-icon"></ha-icon>
            <span class="footer-button-label">Exit fullscreen</span>
          </button>
        </div>
      `:ot`
        <div class="sidebar-footer">
          <button
            class="footer-button"
            @click=${this._handleToggleFullscreen}
            title=${this.collapsed?"Enter fullscreen":""}
          >
              <ha-icon icon="mdi:fullscreen" class="footer-button-icon"></ha-icon>
            <span class="footer-button-label">Enter fullscreen</span>
          </button>
        </div>
      `}_toggleCollapse(){this.collapsed=!this.collapsed}_handleNavigate(e){this.dispatchEvent(new CustomEvent("navigate",{detail:{route:e}}))}_handleToggleFullscreen(){this.dispatchEvent(new CustomEvent("toggle-fullscreen"))}_handleExitDashboard(){this.dispatchEvent(new CustomEvent("exit-dashboard"))}};qs.styles=et`
    :host {
      display: block;
      height: 100%;
      width: 200px;
      background-color: var(--sidebar-background-color, var(--card-background-color));
      border-right: 1px solid var(--divider-color);
      transition: width 0.3s ease;
      overflow: hidden;
    }

    :host([collapsed]) {
      width: 56px;
    }

    .sidebar-content {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      border-bottom: 1px solid var(--divider-color);
      box-sizing: border-box;
      height: calc(var(--header-height) + var(--safe-area-inset-top, var(--ha-space-0)))
    }

    .sidebar-title {
      font-size: 18px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: opacity 0.3s ease;
    }
      
    :host([collapsed]) .sidebar-header {
        justify-content: center;
    }  

    :host([collapsed]) .sidebar-title {
      opacity: 0;
      width: 0;
    }

    .toggle-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .toggle-button:hover {
      background-color: var(--secondary-background-color);
    }

    .menu {
      list-style: none;
      margin: 0;
      padding: 8px 0;
      flex: 1;
      overflow-y: auto;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      cursor: pointer;
      color: var(--primary-text-color);
      text-decoration: none;
      transition: background-color 0.2s ease;
    }

    .menu-item.active {
      background-color: var(--primary-color);
      color: var(--text-primary-color, white);
    }

    .menu-item-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      margin-right: 12px;
      transition: margin-right 0.3s ease;
    }

    :host([collapsed]) .menu-item-icon {
      margin-right: 0;
    }

    .menu-item-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: opacity 0.3s ease;
    }

    :host([collapsed]) .menu-item-label {
      opacity: 0;
      width: 0;
    }

    .icon {
      width: 24px;
      height: 24px;
    }

    .sidebar-footer {
      border-top: 1px solid var(--divider-color);
      padding: 8px 0;
    }

    .footer-button {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      cursor: pointer;
      color: var(--primary-text-color);
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      transition: background-color 0.2s ease;
    }

    .footer-button:hover {
      background-color: var(--secondary-background-color);
    }

    .footer-button-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      margin-right: 12px;
      transition: margin-right 0.3s ease;
    }

    :host([collapsed]) .footer-button-icon {
      margin-right: 0;
    }

    .footer-button-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: opacity 0.3s ease;
    }

    :host([collapsed]) .footer-button-label {
      opacity: 0;
      width: 0;
    }
  `,Hs([tt({attribute:!1})],qs.prototype,"hass",2),Hs([tt({type:String})],qs.prototype,"activeRoute",2),Hs([tt({type:Boolean,reflect:!0})],qs.prototype,"collapsed",2),Hs([tt({type:Boolean})],qs.prototype,"isFullscreen",2),Hs([tt({type:Boolean})],qs.prototype,"narrow",2),qs=Hs([rt("global-sidebar")],qs);var Ys=Object.defineProperty,Xs=Object.getOwnPropertyDescriptor,Ks=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Xs(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Ys(t,i,a),a};let Js=class extends it{constructor(){super(...arguments),this.currentRoute="dashboard",this.hideSidebar=!1,this.isFullscreen=!1,this.narrow=!1}render(){return ot`
            ${this.hideSidebar?"":ot`
                <div class="sidebar-container">
                    <global-sidebar
                            .hass=${this.hass}
                            .activeRoute=${this.currentRoute}
                            ?isFullscreen=${this.isFullscreen}
                            ?narrow=${this.narrow}
                            @navigate=${this._handleNavigate}
                            @toggle-fullscreen=${this._handleToggleFullscreen}
                            @exit-dashboard=${this._handleExitDashboard}
                    ></global-sidebar>
                </div>
            `}

            <div class="content-area">
                <slot></slot>
            </div>
        `}_handleNavigate(e){this.dispatchEvent(new CustomEvent("navigate",{detail:e.detail}))}_handleToggleFullscreen(){this.dispatchEvent(new CustomEvent("toggle-fullscreen"))}_handleExitDashboard(){this.dispatchEvent(new CustomEvent("exit-dashboard"))}};function Qs(e,t="downloading"){var i;const o="string"==typeof e?e.trim():"";if(!o)return null;const r=null==(i=Ee())?void 0:i.integrationVersion;return r&&Ie(r,o)>=0?null:`This card requires Card Builder ${o} or newer. Update the Card Builder integration to the latest version before ${t} it.`}Js.styles=et`
        :host {
            display: flex;
            height: 100vh;
            width: 100%;
            background-color: var(--primary-background-color);
            overflow: hidden;
        }

        .sidebar-container {
            flex-shrink: 0;
            height: 100%;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }

        :host([hideSidebar]) .sidebar-container {
            transform: translateX(-100%);
            opacity: 0;
            pointer-events: none;
            position: absolute;
        }

        .content-area {
            flex: 1;
            height: 100%;
            overflow: auto;
            transition: margin-left 0.3s ease;
        }

        :host([hideSidebar]) .content-area {
            margin-left: 0;
        }

        /* Scrollbar styling for dark/light mode */

        .content-area::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        .content-area::-webkit-scrollbar-track {
            background: var(--primary-background-color);
        }

        .content-area::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb-color);
            border-radius: 4px;
        }

        .content-area::-webkit-scrollbar-thumb:hover {
            background: var(--primary-color);
        }
    `,Ks([tt({attribute:!1})],Js.prototype,"hass",2),Ks([tt({type:String})],Js.prototype,"currentRoute",2),Ks([tt({type:Boolean,reflect:!0})],Js.prototype,"hideSidebar",2),Ks([tt({type:Boolean})],Js.prototype,"isFullscreen",2),Ks([tt({type:Boolean})],Js.prototype,"narrow",2),Js=Ks([rt("app-layout")],Js);var Zs=Object.defineProperty,en=Object.getOwnPropertyDescriptor,tn=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?en(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Zs(t,i,a),a};const on={tap:"Tap",double_tap:"Double Tap",hold:"Hold"},rn={none:"None",toggle:"Toggle","call-service":"Call Service","perform-action":"Perform Action",navigate:"Navigate","more-info":"More Info",url:"Open URL","fire-dom-event":"Fire Event","toggle-menu":"Toggle Menu"};let an=class extends it{constructor(){super(...arguments),this.entitySlots=[],this.actionSlots=[],this.slotEntities={},this.slotActions={},this.mode="both",this.validateEntities=!1}renderEntities(){return 0===this.entitySlots.length?ot`<div class="empty-message">No entity slots to configure.</div>`:ot`
            <div class="slots-list">
                ${this.entitySlots.map(e=>this._renderEntitySlot(e))}
            </div>
        `}renderActions(){return 0===this.actionSlots.length?ot`<div class="empty-message">No action slots to configure.</div>`:ot`
            <div class="slots-list">
                ${this.actionSlots.map(e=>this._renderActionSlot(e))}
            </div>
        `}render(){const e="entities"===this.mode||"both"===this.mode,t="actions"===this.mode||"both"===this.mode;return ot`
            ${e&&this.entitySlots.length?ot`
                <div class="section-title">Entity slots</div>
                ${this.renderEntities()}
            `:dt}
            ${t&&this.actionSlots.length?ot`
                <div class="section-title">Action slots</div>
                ${this.renderActions()}
            `:dt}
        `}_renderEntitySlot(e){var t,i,o,r,a;const s=this.slotEntities[e.id]??"",n=!this.validateEntities||!s||Boolean(null==(i=null==(t=this.hass)?void 0:t.states)?void 0:i[s]),l=[e.description||"",(null==(o=e.domains)?void 0:o.length)?`Domains: ${e.domains.join(", ")}`:"",(null==(r=e.entityId)?void 0:r.trim())?`Default: ${e.entityId}`:""].filter(Boolean).join(" · ");return ot`
            <div class="slot-row">
                <div class="slot-label">
                    <div class="slot-name">${e.name||e.id}</div>
                    <div class="slot-id">${e.id}</div>
                </div>
                <ha-selector
                    .hass=${this.hass}
                    .selector=${{entity:{multiple:!1,domain:(null==(a=e.domains)?void 0:a.length)?e.domains:void 0}}}
                    .value=${s}
                    @value-changed=${t=>this._handleEntityChanged(t,e)}
                    allow-custom-entity
                ></ha-selector>
                ${l?ot`<div class="slot-helper">${l}</div>`:dt}
                ${n?dt:ot`
                    <div class="slot-warning">Entity "${s}" not found in this Home Assistant instance.</div>
                `}
            </div>
        `}_renderActionSlot(e){const t=this.slotActions[e.id]??e.action??{action:"none"},i=[e.description||"",`Trigger: ${on[e.trigger]??e.trigger}`,e.action?`Default: ${this._formatActionSummary(e.action)}`:""].filter(Boolean).join(" · ");return ot`
            <div class="slot-row">
                <div class="slot-label">
                    <div class="slot-name">${e.name||e.id}</div>
                    <div class="slot-id">${e.id}</div>
                </div>
                <ha-selector
                    .hass=${this.hass}
                    .selector=${{ui_action:{default_action:"none"}}}
                    .value=${t}
                    @value-changed=${t=>this._handleActionChanged(t,e)}
                ></ha-selector>
                ${i?ot`<div class="slot-helper">${i}</div>`:dt}
            </div>
        `}_handleEntityChanged(e,t){var i;let o=(null==(i=e.detail)?void 0:i.value)??"";o="string"==typeof o?o.trim():"";const r={...this.slotEntities};o?r[t.id]=o:delete r[t.id],this.slotEntities=r,this.dispatchEvent(new CustomEvent("slot-entities-changed",{detail:{slotEntities:this.slotEntities},bubbles:!0,composed:!0}))}_handleActionChanged(e,t){var i;const o=(null==(i=e.detail)?void 0:i.value)||null,r={...this.slotActions};o&&"none"!==o.action?r[t.id]=o:delete r[t.id],this.slotActions=r,this.dispatchEvent(new CustomEvent("slot-actions-changed",{detail:{slotActions:this.slotActions},bubbles:!0,composed:!0}))}_formatActionSummary(e){const t=rn[e.action]??e.action;return"call-service"!==e.action&&"perform-action"!==e.action||!("service"in e)?"navigate"===e.action&&"navigation_path"in e?`${t}: ${e.navigation_path||""}`:"url"===e.action&&"url_path"in e?`${t}: ${e.url_path||""}`:t:`${t}: ${e.service||""}`}};an.styles=et`
        :host {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .section-title {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            color: var(--text-secondary, #666);
            font-weight: 600;
        }

        .slots-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .slot-row {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 12px;
            border: 1px solid var(--border-color, #e0e0e0);
            border-radius: 8px;
            background: var(--bg-secondary, #f7f7f7);
        }

        .slot-label {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .slot-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary, #333);
        }

        .slot-id {
            font-size: 12px;
            color: var(--text-secondary, #666);
        }

        .slot-helper {
            font-size: 12px;
            color: var(--text-secondary, #666);
        }

        .slot-warning {
            font-size: 12px;
            color: #e65100;
            font-style: italic;
        }

        .empty-message {
            font-size: 13px;
            color: var(--text-secondary, #666);
            padding: 12px;
            text-align: center;
        }
    `,tn([tt({attribute:!1})],an.prototype,"hass",2),tn([tt({attribute:!1})],an.prototype,"entitySlots",2),tn([tt({attribute:!1})],an.prototype,"actionSlots",2),tn([tt({attribute:!1})],an.prototype,"slotEntities",2),tn([tt({attribute:!1})],an.prototype,"slotActions",2),tn([tt({type:String})],an.prototype,"mode",2),tn([tt({type:Boolean})],an.prototype,"validateEntities",2),an=tn([rt("marketplace-slot-configurator")],an);var sn=Object.defineProperty,nn=Object.getOwnPropertyDescriptor,ln=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?nn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&sn(t,i,a),a};let dn=class extends es{constructor(){super(...arguments),this.initialMarketplaceId="",this.marketplaceId="",this.loadingInfo=!1,this.info=null,this.error=null,this.disclaimer=null,this.disclaimerLoading=!1,this.disclaimerError=null,this.disclaimerAccepted=!1,this.disclaimerExpanded=!1,this.step="info",this.preparing=!1,this.confirming=!1,this.preparedPayload=null,this.entitySlots=[],this.actionSlots=[],this.slotEntities={},this.slotActions={},this.downloadError=null,this._documentModel=new me,this._handleIdInput=e=>{const t=e.target;this.marketplaceId=(null==t?void 0:t.value)??"",this.error=null,this.downloadError=null},this._handleFetchInfo=async()=>{if(!this.hass)return;const e=this.marketplaceId.trim();if(e){this.loadingInfo=!0,this.error=null,this.downloadError=null,this.info=null,this.disclaimerAccepted=!1;try{const t=Me(this.hass);this.info=await t.getMarketplaceCardInfo(e),this.downloadError=Qs(this.info.min_builder_version)}catch(t){this.error=this._formatError(t)}finally{this.loadingInfo=!1}}else this.error="Marketplace ID is required."},this._handlePrepareDownload=async()=>{if(!this.hass||!this.info)return;const e=this.info.marketplace_id||this.marketplaceId.trim();if(!e)return;if(!this.disclaimerAccepted)return void(this.downloadError="You must accept the marketplace download disclaimer.");const t=Qs(this.info.min_builder_version);if(t)this.downloadError=t;else{this.preparing=!0,this.downloadError=null;try{const t=Me(this.hass);this.preparedPayload=await t.prepareMarketplaceDownload(e);const i=Qs(this.preparedPayload.min_builder_version);if(i)return this.downloadError=i,void(this.preparedPayload=null);this._initializeSlotsFromPayload(this.preparedPayload),this._advanceToFirstWizardStep()}catch(i){this.downloadError=this._formatError(i)}finally{this.preparing=!1}}},this._handleConfirmDownload=async()=>{if(!this.hass||!this.preparedPayload)return;const e=this.preparedPayload.marketplace_id||this.marketplaceId.trim();if(!e)return;const t=Qs(this.preparedPayload.min_builder_version);if(t)this.downloadError=t;else{this.confirming=!0,this.downloadError=null;try{const t=this._applySlotChoicesToPayload(),i=Me(this.hass),o=await i.confirmMarketplaceDownload(e,t);this.dispatchEvent(new CustomEvent("marketplace-download-success",{detail:o,bubbles:!0,composed:!0})),this.handleClose()}catch(i){this.downloadError=this._formatError(i)}finally{this.confirming=!1}}},this._handleSlotEntitiesChanged=e=>{var t;this.slotEntities=(null==(t=e.detail)?void 0:t.slotEntities)??{}},this._handleSlotActionsChanged=e=>{var t;this.slotActions=(null==(t=e.detail)?void 0:t.slotActions)??{}},this._handleWizardBack=()=>{const e=this._getWizardSteps(),t=e.indexOf(this.step);this.step=t<=0?"info":e[t-1],this.downloadError=null},this._handleWizardNext=()=>{const e=this._getWizardSteps(),t=e.indexOf(this.step);t<e.length-1&&(this.step=e[t+1]),this.downloadError=null},this._handleDisclaimerCheck=e=>{const t=e.target;this.disclaimerAccepted=Boolean(null==t?void 0:t.checked),this.error=null},this._handleDisclaimerToggle=()=>{this.disclaimerExpanded=!this.disclaimerExpanded}}get dialogTitle(){return"Download from marketplace"}get dialogSubtitle(){if("info"===this.step)return"Fetch a card by marketplace ID";const e=this._getWizardSteps();return`Step ${e.indexOf(this.step)+1} of ${e.length} — Configure slots`}updated(e){super.updated(e),e.has("open")&&this.open&&(this._resetState(),this._loadDisclaimer(),this.marketplaceId&&this._handleFetchInfo())}renderDialogBody(){switch(this.step){case"entities":return this._renderEntitiesStep();case"actions":return this._renderActionsStep();default:return this._renderInfoStep()}}renderDialogFooter(){switch(this.step){case"entities":case"actions":return this._renderWizardFooter();default:return this._renderInfoFooter()}}_renderInfoStep(){const e=this.loadingInfo||this.preparing||!this.marketplaceId.trim();return ot`
            <div class="input-row">
                <div class="input-group">
                    <label class="input-label" for="marketplace-id">Marketplace ID</label>
                    <input
                        id="marketplace-id"
                        class="text-input"
                        .value=${this.marketplaceId}
                        ?disabled=${this.loadingInfo||this.preparing}
                        @input=${this._handleIdInput}
                        placeholder="Enter marketplace card ID"
                    />
                </div>
                <button
                    class="primary-btn"
                    @click=${this._handleFetchInfo}
                    ?disabled=${e}
                >
                    ${this.loadingInfo?"Loading...":"Load info"}
                </button>
            </div>

            ${this.error?ot`<div class="error-banner">${this.error}</div>`:dt}

            ${this.loadingInfo?ot`
                <div class="info-loading" role="status" aria-live="polite">
                    <span class="info-loading-spinner"></span>
                    <span>Loading card information...</span>
                </div>
            `:this.info?this._renderInfo(this.info):ot`
                <div class="muted">Load the card info to preview details before downloading.</div>
            `}

            ${this.info&&!this._hasBlockingDownloadError()?this._renderDisclaimer():dt}

            ${this.downloadError?ot`<div class="error-banner">${this.downloadError}</div>`:dt}
        `}_renderInfoFooter(){const e=!this.info||this.preparing||this.loadingInfo||!this.disclaimerAccepted||this._hasBlockingDownloadError();return ot`
            <div class="dialog-footer">
                <div class="footer-spacer"></div>
                <button class="secondary-btn" @click=${this.handleClose} ?disabled=${this.preparing}>
                    Cancel
                </button>
                <button
                    class="primary-btn"
                    @click=${this._handlePrepareDownload}
                    ?disabled=${e}
                >
                    ${this.preparing?"Preparing...":"Download card"}
                </button>
            </div>
        `}_renderEntitiesStep(){return ot`
            <div class="step-header">
                <div class="step-title">Configure entity slots</div>
                <div class="step-meta">${this._getStepLabel()}</div>
            </div>
            ${this.downloadError?ot`<div class="error-banner">${this.downloadError}</div>`:dt}
            <marketplace-slot-configurator
                .hass=${this.hass}
                .entitySlots=${this.entitySlots}
                .actionSlots=${[]}
                .slotEntities=${this.slotEntities}
                .slotActions=${{}}
                .mode=${"entities"}
                .validateEntities=${!0}
                @slot-entities-changed=${this._handleSlotEntitiesChanged}
            ></marketplace-slot-configurator>
        `}_renderActionsStep(){return ot`
            <div class="step-header">
                <div class="step-title">Configure action slots</div>
                <div class="step-meta">${this._getStepLabel()}</div>
            </div>
            ${this.downloadError?ot`<div class="error-banner">${this.downloadError}</div>`:dt}
            <marketplace-slot-configurator
                .hass=${this.hass}
                .entitySlots=${[]}
                .actionSlots=${this.actionSlots}
                .slotEntities=${{}}
                .slotActions=${this.slotActions}
                .mode=${"actions"}
                @slot-actions-changed=${this._handleSlotActionsChanged}
            ></marketplace-slot-configurator>
        `}_renderWizardFooter(){const e=this._getWizardSteps(),t=e.indexOf(this.step)===e.length-1;return ot`
            <div class="dialog-footer">
                <div class="footer-spacer"></div>
                <button class="secondary-btn" @click=${this._handleWizardBack} ?disabled=${this.confirming}>
                    Back
                </button>
                ${t?ot`
                    <button class="primary-btn" @click=${this._handleConfirmDownload} ?disabled=${this.confirming}>
                        ${this.confirming?"Saving...":"Confirm"}
                    </button>
                `:ot`
                    <button class="primary-btn" @click=${this._handleWizardNext}>
                        Next
                    </button>
                `}
            </div>
        `}_renderInfo(e){var t;const i=(null==(t=e.creator)?void 0:t.username)||e.author||"Unknown",o=e.categories??[],r=e.tags??[],a=e.preview_images??[];return a.length?ot`
            <div class="info-title">${e.name}</div>
            <div class="info-layout">
                <div class="preview-column">
                    <div class="previews">
                        <div class="preview-grid">
                            ${a.map((e,t)=>ot`
                                <img
                                    src=${e.url}
                                    alt=${`Preview ${t+1}`}
                                    loading="lazy"
                                />
                            `)}
                        </div>
                    </div>
                </div>
                <div class="info-column">
                    <div class="info-card">
                        <div class="info-row">
                            <div class="info-label">Name</div>
                            <div class="info-value">${e.name}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Description</div>
                            <div class="info-value">${e.description||"No description"}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Version</div>
                            <div class="info-value">${e.version??"Unknown"}</div>
                        </div>
                        ${this._renderRequiredBuilderVersionRow(e)}
                        <div class="info-row">
                            <div class="info-label">Creator</div>
                            <div class="info-value">${i}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Style</div>
                            <div class="info-value">${e.style||"Not specified"}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Categories</div>
                            <div class="info-value">
                                ${o.length?ot`
                                    <div class="chips">
                                        ${o.map(e=>ot`<span class="chip">${e}</span>`)}
                                    </div>
                                `:"None"}
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Tags</div>
                            <div class="info-value">
                                ${r.length?ot`
                                    <div class="chips">
                                        ${r.map(e=>ot`<span class="chip">${e}</span>`)}
                                    </div>
                                `:"None"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `:ot`
                <div class="info-card">
                    <div class="info-row">
                        <div class="info-label">Name</div>
                        <div class="info-value">${e.name}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Description</div>
                        <div class="info-value">${e.description||"No description"}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Version</div>
                        <div class="info-value">${e.version??"Unknown"}</div>
                    </div>
                    ${this._renderRequiredBuilderVersionRow(e)}
                    <div class="info-row">
                        <div class="info-label">Creator</div>
                        <div class="info-value">${i}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Style</div>
                        <div class="info-value">${e.style||"Not specified"}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Categories</div>
                        <div class="info-value">
                            ${o.length?ot`
                                <div class="chips">
                                    ${o.map(e=>ot`<span class="chip">${e}</span>`)}
                                </div>
                            `:"None"}
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Tags</div>
                        <div class="info-value">
                            ${r.length?ot`
                                <div class="chips">
                                    ${r.map(e=>ot`<span class="chip">${e}</span>`)}
                                </div>
                            `:"None"}
                        </div>
                    </div>
                </div>
            `}_renderRequiredBuilderVersionRow(e){const t=this._getRequiredBuilderVersion(e);return t?ot`
            <div class="info-row">
                <div class="info-label">Required Builder</div>
                <div class="info-value">Card Builder ${t} or newer</div>
            </div>
        `:dt}_renderDisclaimer(){var e,t;const i=this.disclaimer,o=this.disclaimerLoading,r=this.disclaimerError,a=o||Boolean(r),s=Boolean((null==i?void 0:i.html)||((null==(e=null==i?void 0:i.links)?void 0:e.length)??0));return ot`
            <div class="disclaimer-block">
                <div class="disclaimer-row">
                    <label class="disclaimer-checkbox">
                        <input
                            type="checkbox"
                            ?checked=${this.disclaimerAccepted}
                            ?disabled=${a}
                            @change=${this._handleDisclaimerCheck}
                        />
                        <span>I agree to the marketplace download disclaimer.</span>
                    </label>
                    <button
                        class="disclaimer-toggle"
                        @click=${this._handleDisclaimerToggle}
                        ?disabled=${!s||a}
                        type="button"
                    >
                        ${this.disclaimerExpanded?"Hide details":"Show details"}
                    </button>
                </div>
                ${o?ot`<div class="muted">Loading disclaimer...</div>`:dt}
                ${r?ot`<div class="error-banner">${r}</div>`:dt}
                ${this.disclaimerExpanded&&s?ot`
                    <div class="disclaimer-body">
                        ${(null==i?void 0:i.html)?ot`${at(i.html)}`:dt}
                        ${(null==(t=null==i?void 0:i.links)?void 0:t.length)?ot`
                            <div class="disclaimer-links">
                                ${i.links.map(e=>ot`
                                    <a href=${e.url} target="_blank" rel="noopener">
                                        ${e.label}
                                    </a>
                                `)}
                            </div>
                        `:dt}
                    </div>
                `:dt}
            </div>
        `}_hasBlockingDownloadError(){return!!(this.error||this.downloadError||this.disclaimerError)||!!this.info&&Boolean(Qs(this.info.min_builder_version))}_getRequiredBuilderVersion(e){return("string"==typeof e.min_builder_version?e.min_builder_version.trim():"")||null}_initializeSlotsFromPayload(e){var t,i,o;const r=e.config;if(!r)return this.entitySlots=[],this.actionSlots=[],this.slotEntities={},void(this.slotActions={});const{config:a}=we(r);this._documentModel.loadFromConfig(a),this.entitySlots=this._documentModel.getSlotEntities(),this.actionSlots=this._documentModel.getSlotActions();const s={};for(const l of this.entitySlots)if(null==(t=l.entityId)?void 0:t.trim()){const e=l.entityId.trim();(null==(o=null==(i=this.hass)?void 0:i.states)?void 0:o[e])&&(s[l.id]=e)}this.slotEntities=s;const n={};for(const l of this.actionSlots)l.action&&"none"!==l.action.action&&(n[l.id]=l.action);this.slotActions=n}_applySlotChoicesToPayload(){if(!this.preparedPayload)throw new Error("No prepared payload");const e={...this.preparedPayload},t=JSON.parse(JSON.stringify(e.config)),i=t.slots;if(null==i?void 0:i.entities)for(const o of Object.keys(i.entities))o in this.slotEntities?i.entities[o].entityId=this.slotEntities[o]:delete i.entities[o].entityId;if(null==i?void 0:i.actions)for(const[o,r]of Object.entries(this.slotActions))i.actions[o]&&(i.actions[o].action=r);return e.config=t,e}_getWizardSteps(){const e=[];return this.entitySlots.length>0&&e.push("entities"),this.actionSlots.length>0&&e.push("actions"),e}_advanceToFirstWizardStep(){const e=this._getWizardSteps();e.length>0?this.step=e[0]:this._handleConfirmDownload()}_getStepLabel(){const e=this._getWizardSteps();return`Step ${e.indexOf(this.step)+1} of ${e.length}`}_formatError(e){return String(e&&"object"==typeof e&&"message"in e?e.message??"Unexpected error":e??"Unexpected error")}_resetState(){this.marketplaceId=this.initialMarketplaceId.trim(),this.loadingInfo=!1,this.info=null,this.error=null,this.downloadError=null,this.disclaimer=null,this.disclaimerLoading=!1,this.disclaimerError=null,this.disclaimerAccepted=!1,this.disclaimerExpanded=!1,this.step="info",this.preparing=!1,this.confirming=!1,this.preparedPayload=null,this.entitySlots=[],this.actionSlots=[],this.slotEntities={},this.slotActions={}}async _loadDisclaimer(){if(this.hass){this.disclaimerLoading=!0,this.disclaimerError=null;try{const e=Me(this.hass);this.disclaimer=await e.getMarketplaceDownloadDisclaimer()}catch(e){this.disclaimerError=this._formatError(e),this.disclaimer=null}finally{this.disclaimerLoading=!1}}}};dn.styles=[...es.styles,et`
            :host {
                --overlay-dialog-width: min(92vw, 980px);
                --overlay-dialog-height: min(90vh, 760px);
            }

            .dialog-body {
                padding: 20px;
                overflow: auto;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .input-row {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 12px;
                align-items: end;
            }

            .input-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .input-label {
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.4px;
                text-transform: uppercase;
                color: var(--text-secondary, #666);
            }

            .input-row button {
                padding: 13px;
            }

            .text-input {
                padding: 10px 12px;
                border-radius: 6px;
                border: 1px solid var(--border-color, #d0d0d0);
                background: var(--bg-primary, #fff);
                font-size: 14px;
                color: var(--text-primary, #333);
                font-family: inherit;
            }

            .text-input:focus {
                outline: none;
                border-color: var(--accent-color, #2196f3);
            }

            .text-input:disabled {
                opacity: 0.65;
                cursor: wait;
            }

            .info-loading {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 14px;
                border-radius: 8px;
                border: 1px solid var(--border-color, #e0e0e0);
                background: var(--bg-secondary, #f7f7f7);
                color: var(--text-secondary, #666);
                font-size: 13px;
            }

            .info-loading-spinner {
                width: 18px;
                height: 18px;
                border: 2px solid var(--divider-color, #d0d0d0);
                border-top-color: var(--accent-color, #2196f3);
                border-radius: 50%;
                animation: info-loading-spin 0.8s linear infinite;
                flex: 0 0 auto;
            }

            @keyframes info-loading-spin {
                to {
                    transform: rotate(360deg);
                }
            }

            .info-title {
                font-size: 20px;
                font-weight: 600;
                color: var(--text-primary, #333);
            }

            .info-layout {
                display: grid;
                grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
                gap: 16px;
            }

            .preview-column,
            .info-column {
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .info-card {
                padding: 16px;
                border-radius: 10px;
                border: 1px solid var(--border-color, #e0e0e0);
                background: var(--bg-secondary, #f7f7f7);
                display: grid;
                gap: 12px;
            }

            .info-row {
                display: grid;
                grid-template-columns: 120px 1fr;
                gap: 10px;
                align-items: baseline;
            }

            .info-label {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                color: var(--text-secondary, #666);
                font-weight: 600;
            }

            .info-value {
                font-size: 14px;
                color: var(--text-primary, #333);
                word-break: break-word;
            }

            .chips {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }

            .chip {
                padding: 4px 8px;
                border-radius: 999px;
                background: rgba(33, 150, 243, 0.12);
                color: var(--accent-color, #1e88e5);
                font-size: 12px;
                font-weight: 600;
            }

            .previews {
                display: grid;
                gap: 10px;
            }

            .preview-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 10px;
            }

            .preview-grid img {
                width: 100%;
                height: auto;
                border-radius: 8px;
                border: 1px solid var(--border-color, #e0e0e0);
                background: #fff;
            }

            @media (max-width: 900px) {
                .info-layout {
                    grid-template-columns: 1fr;
                }
            }

            .disclaimer-block {
                display: grid;
                gap: 8px;
                padding: 10px 12px;
                border: 1px solid var(--border-color, #dcdcdc);
                border-radius: 8px;
                background: var(--bg-secondary, #f7f7f7);
            }

            .disclaimer-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }

            .disclaimer-checkbox {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: var(--text-primary, #333);
            }

            .disclaimer-checkbox input {
                accent-color: var(--accent-color, #2196f3);
            }

            .disclaimer-toggle {
                background: none;
                border: none;
                padding: 0;
                color: var(--accent-color, #2196f3);
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
            }

            .disclaimer-toggle[disabled] {
                color: var(--text-secondary, #666);
                cursor: not-allowed;
            }

            .disclaimer-body {
                font-size: 12px;
                color: var(--text-primary, #333);
                line-height: 1.5;
            }

            .disclaimer-links {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .disclaimer-links a {
                font-size: 12px;
                color: var(--accent-color, #2196f3);
                text-decoration: none;
                font-weight: 600;
            }

            .disclaimer-links a:hover {
                text-decoration: underline;
            }

            .step-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 12px;
                border-bottom: 1px solid var(--border-color, #e0e0e0);
            }

            .step-title {
                font-size: 15px;
                font-weight: 700;
                color: var(--text-primary, #333);
            }

            .step-meta {
                font-size: 12px;
                color: var(--text-secondary, #666);
            }

            .error-banner {
                padding: 10px 12px;
                border-radius: 8px;
                background: rgba(211, 47, 47, 0.12);
                color: #b71c1c;
                font-size: 13px;
                border: 1px solid rgba(211, 47, 47, 0.2);
            }

            .muted {
                font-size: 13px;
                color: var(--text-secondary, #666);
            }
        `],ln([tt({attribute:!1})],dn.prototype,"hass",2),ln([tt({attribute:!1})],dn.prototype,"initialMarketplaceId",2),ln([st()],dn.prototype,"marketplaceId",2),ln([st()],dn.prototype,"loadingInfo",2),ln([st()],dn.prototype,"info",2),ln([st()],dn.prototype,"error",2),ln([st()],dn.prototype,"disclaimer",2),ln([st()],dn.prototype,"disclaimerLoading",2),ln([st()],dn.prototype,"disclaimerError",2),ln([st()],dn.prototype,"disclaimerAccepted",2),ln([st()],dn.prototype,"disclaimerExpanded",2),ln([st()],dn.prototype,"step",2),ln([st()],dn.prototype,"preparing",2),ln([st()],dn.prototype,"confirming",2),ln([st()],dn.prototype,"preparedPayload",2),ln([st()],dn.prototype,"entitySlots",2),ln([st()],dn.prototype,"actionSlots",2),ln([st()],dn.prototype,"slotEntities",2),ln([st()],dn.prototype,"slotActions",2),ln([st()],dn.prototype,"downloadError",2),dn=ln([rt("marketplace-card-download-dialog")],dn);var cn=Object.defineProperty,pn=Object.getOwnPropertyDescriptor,hn=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?pn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&cn(t,i,a),a};let un=class extends it{constructor(){super(...arguments),this.cards=[],this.loading=!1}connectedCallback(){super.connectedCallback(),this._ensureLoaded()}updated(e){e.has("hass")&&this._ensureLoaded()}render(){return this.loading||!this.cards.length?dt:ot`
            <section class="featured-section">
                <div class="section-header">
                    <h2 class="section-title">Marketplace Cards</h2>
                    <p class="section-text">
                        Selected cards from the marketplace, ready to preview and download into your local library.
                    </p>
                </div>
                <div class="cards-track">
                    ${this.cards.map(e=>this._renderCard(e))}
                </div>
            </section>
        `}_renderCard(e){var t,i;const o=e.preview_images[0],r="community"===e.origin?null==(t=e.creator)?void 0:t.username:null,a="community"===e.origin?null==(i=e.creator)?void 0:i.profile:null;return ot`
            <article class="featured-card">
                <img
                    class="preview"
                    src=${o.url}
                    width=${o.width??1200}
                    height=${o.height??675}
                    alt=${e.name}
                    loading="lazy"
                />
                <div class="card-body">
                    <h3 class="card-title" title=${e.name}>${e.name}</h3>
                    <p class="card-description">${e.description}</p>
                    ${r?ot`
                        <div class="creator">
                            <ha-icon icon="mdi:account-circle-outline"></ha-icon>
                            ${a?ot`
                                <a
                                    class="creator-name"
                                    href=${a}
                                    target="_blank"
                                    rel="noopener"
                                >${r}</a>
                            `:ot`
                                <span class="creator-name">${r}</span>
                            `}
                        </div>
                    `:dt}
                    <div class="badges">
                        <a
                            class="badge style"
                            href=${e.style.url}
                            target="_blank"
                            rel="noopener"
                            title=${e.style.label}
                        >Style: ${e.style.label}</a>
                        ${e.categories.map(e=>ot`
                            <a
                                class="badge"
                                href=${e.url}
                                target="_blank"
                                rel="noopener"
                                title=${e.label}
                            >${e.label}</a>
                        `)}
                        ${e.tags.map(e=>ot`
                            <a
                                class="badge tag"
                                href=${e.url}
                                target="_blank"
                                rel="noopener"
                                title=${e.label}
                            >${e.label}</a>
                        `)}
                    </div>
                    <div class="card-footer">
                        <button
                            class="download-button"
                            @click=${()=>this._handleDownload(e)}
                        >
                            <ha-icon icon="mdi:cloud-download-outline"></ha-icon>
                            <span>Download card</span>
                        </button>
                    </div>
                </div>
            </article>
        `}async _ensureLoaded(){if(this.hass&&this.loadedForHass!==this.hass){this.loadedForHass=this.hass,this.loading=!0;try{const e=Me(this.hass),t=await e.listMarketplaceCardsAvailableFeatured();this.cards=t.list.items}catch(e){console.error("Failed to load marketplace featured cards:",e),this.cards=[]}finally{this.loading=!1}}}_handleDownload(e){this.dispatchEvent(new CustomEvent("marketplace-featured-card-download",{detail:{marketplaceId:e.id,card:e},bubbles:!0,composed:!0}))}};un.styles=et`
        :host {
            display: block;
        }

        .featured-section {
            margin-bottom: 32px;
        }

        .section-header {
            margin-bottom: 14px;
        }

        .section-title {
            font-size: 18px;
            font-weight: 500;
            color: var(--primary-text-color);
            margin: 0 0 6px 0;
        }

        .section-text {
            color: var(--secondary-text-color);
            font-size: 14px;
            line-height: 1.45;
            margin: 0;
            max-width: 720px;
        }

        .cards-track {
            display: flex;
            gap: 16px;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 2px 2px 12px;
            scroll-snap-type: x proximity;
            scrollbar-width: thin;
        }

        .featured-card {
            flex: 0 0 min(330px, 82vw);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background: var(--card-background-color);
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
            scroll-snap-align: start;
        }

        .preview {
            display: block;
            width: 100%;
            height: 142px;
            object-fit: cover;
            background: var(--secondary-background-color);
            border-bottom: 1px solid var(--divider-color);
        }

        .card-body {
            display: flex;
            flex: 1;
            flex-direction: column;
            gap: 10px;
            padding: 14px;
            min-height: 0;
        }

        .card-title {
            color: var(--primary-text-color);
            font-size: 15px;
            font-weight: 600;
            line-height: 1.35;
            margin: 0;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }

        .card-description {
            color: var(--secondary-text-color);
            font-size: 13px;
            line-height: 1.45;
            margin: 0;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
        }

        .creator {
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--secondary-text-color);
            font-size: 12px;
            min-width: 0;
        }

        .creator ha-icon {
            --mdc-icon-size: 16px;
            flex: 0 0 auto;
        }

        .creator-name {
            color: inherit;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-decoration: none;
        }

        .creator-name[href]:hover {
            color: var(--primary-color);
            text-decoration: underline;
        }

        .badges {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            min-height: 24px;
        }

        .badge {
            max-width: 100%;
            padding: 4px 7px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
            line-height: 1;
            color: var(--primary-text-color);
            background: var(--secondary-background-color);
            border: 1px solid var(--divider-color);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-decoration: none;
        }

        .badge:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
        }

        .badge.tag {
            color: var(--accent-color, var(--primary-color));
            background: color-mix(in srgb, var(--accent-color, var(--primary-color)) 10%, transparent);
            border-color: color-mix(in srgb, var(--accent-color, var(--primary-color)) 28%, transparent);
        }

        .badge.style {
            color: var(--primary-color);
            background: color-mix(in srgb, var(--primary-color) 10%, transparent);
            border-color: color-mix(in srgb, var(--primary-color) 28%, transparent);
        }

        .card-footer {
            margin-top: auto;
            padding-top: 2px;
        }

        .download-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            min-height: 38px;
            padding: 9px 12px;
            border: none;
            border-radius: 6px;
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            cursor: pointer;
            font-family: inherit;
            font-size: 13px;
            font-weight: 600;
        }

        .download-button:hover {
            opacity: 0.9;
        }

        .download-button ha-icon {
            --mdc-icon-size: 18px;
        }

        @media (max-width: 768px) {
            .featured-section {
                margin-bottom: 24px;
            }

            .featured-card {
                flex-basis: min(300px, 86vw);
            }

            .preview {
                height: 128px;
            }
        }
    `,hn([tt({attribute:!1})],un.prototype,"hass",2),hn([st()],un.prototype,"cards",2),hn([st()],un.prototype,"loading",2),un=hn([rt("marketplace-featured-cards-carousel")],un);var gn=Object.defineProperty,vn=Object.getOwnPropertyDescriptor,bn=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?vn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&gn(t,i,a),a};const mn="card-create-success";let fn=class extends es{constructor(){super(...arguments),this.cardName="",this.cardDescription="",this.formError=null,this.submitError=null,this.creating=!1,this._handleNameInput=e=>{const t=e.target;this.cardName=t.value,this.formError&&(this.formError=null)},this._handleDescriptionInput=e=>{const t=e.target;this.cardDescription=t.value},this._handleNameKeyDown=e=>{"Enter"===e.key&&(e.preventDefault(),this._handleSubmit())}}get dialogTitle(){return"Create new card"}get dialogSubtitle(){return"Set required and optional card details"}updated(e){super.updated(e),e.has("open")&&this.open&&this._resetForm()}renderDialogBody(){const e=Boolean(this.formError);return ot`
            <div class="form-field">
                <label class="form-label" for="card-create-name">
                    Card name <span class="required">*</span>
                </label>
                <input
                    id="card-create-name"
                    class="form-input ${e?"error":""}"
                    .value=${this.cardName}
                    ?disabled=${this.creating}
                    @input=${this._handleNameInput}
                    @keydown=${this._handleNameKeyDown}
                    placeholder="Enter card name"
                />
                ${e?ot`<div class="error-text">${this.formError}</div>`:dt}
            </div>

            <div class="form-field">
                <label class="form-label" for="card-create-description">Description</label>
                <textarea
                    id="card-create-description"
                    class="form-input form-textarea"
                    .value=${this.cardDescription}
                    ?disabled=${this.creating}
                    @input=${this._handleDescriptionInput}
                    placeholder="Optional description"
                ></textarea>
            </div>

            ${this.submitError?ot`<div class="error-text">${this.submitError}</div>`:dt}
        `}renderDialogFooter(){return ot`
            <div class="dialog-footer">
                <div class="footer-spacer"></div>
                <button class="secondary-btn" @click=${this.handleClose} ?disabled=${this.creating}>
                    Cancel
                </button>
                <button class="primary-btn" @click=${this._handleSubmit} ?disabled=${this.creating}>
                    ${this.creating?"Creating...":"Create card"}
                </button>
            </div>
        `}_resetForm(){this.cardName="",this.cardDescription="",this.formError=null,this.submitError=null,this.creating=!1}async _handleSubmit(){var e,t;if(this.creating)return;if(!this.hass)return void(this.submitError="Home Assistant context not available.");const i=this.cardName.trim();if(i){this.formError=null,this.submitError=null,this.creating=!0;try{const o=(new me).exportToConfig(),r=Pe(this.hass),a=await r.createCard({name:i,description:this.cardDescription.trim(),config:o,min_builder_version:fe.getRequiredBuilderVersionForDocument(o),source:"local",author:(null==(e=this.hass.user)?void 0:e.name)??""});null==(t=this.eventBus)||t.dispatchEvent(mn,{cardId:a.id}),this.handleClose()}catch(o){console.error("Failed to create card:",o),this.submitError="Failed to create card. Please try again."}finally{this.creating=!1}}else this.formError="Card name is required."}};fn.styles=[...es.styles,et`
            :host {
                --overlay-dialog-width: min(92vw, 560px);
                --overlay-dialog-height: auto;
            }

            .dialog {
                height: auto;
                max-height: min(86vh, 640px);
            }

            .dialog-body {
                padding: 20px;
                overflow: auto;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .form-field {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .form-label {
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.3px;
                text-transform: uppercase;
                color: var(--text-secondary, #666);
            }

            .required {
                color: #b71c1c;
            }

            .form-input {
                width: 100%;
                box-sizing: border-box;
                padding: 10px 12px;
                border-radius: 6px;
                border: 1px solid var(--border-color, #d0d0d0);
                background: var(--bg-primary, #fff);
                color: var(--text-primary, #333);
                font-size: 14px;
                font-family: inherit;
            }

            .form-input:focus {
                outline: none;
                border-color: var(--accent-color, #2196f3);
            }

            .form-input.error {
                border-color: #b71c1c;
            }

            .form-textarea {
                min-height: 110px;
                resize: vertical;
            }

            .error-text {
                color: #b71c1c;
                font-size: 12px;
                line-height: 1.4;
            }
        `],bn([tt({attribute:!1})],fn.prototype,"hass",2),bn([pt({context:d})],fn.prototype,"eventBus",2),bn([st()],fn.prototype,"cardName",2),bn([st()],fn.prototype,"cardDescription",2),bn([st()],fn.prototype,"formError",2),bn([st()],fn.prototype,"submitError",2),bn([st()],fn.prototype,"creating",2),fn=bn([rt("card-create-dialog")],fn);var yn=Object.defineProperty,xn=Object.getOwnPropertyDescriptor,_n=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?xn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&yn(t,i,a),a};let kn=class extends it{constructor(){super(...arguments),this.cards=[],this.loading=!0,this.error=null,this.showIntegrationUpdateNotice=!1,this.marketplaceDialogOpen=!1,this.selectedMarketplaceId="",this.createCardDialogOpen=!1,this.marketplaceBrowseUrl=null,this.runtimeConfig=null,this.router=js(),this._handleMarketplaceDownload=()=>{Te()?(this.selectedMarketplaceId="",this.marketplaceDialogOpen=!0):this.router.navigate(Fs.ACCOUNT)},this._handleFeaturedMarketplaceDownload=e=>{Te()?(this.selectedMarketplaceId=e.detail.marketplaceId,this.marketplaceDialogOpen=!0):this.router.navigate(Fs.ACCOUNT)},this._closeMarketplaceDialog=()=>{this.marketplaceDialogOpen=!1,this.selectedMarketplaceId=""},this._handleMarketplaceDownloaded=()=>{this.marketplaceDialogOpen=!1,this.selectedMarketplaceId=""},this._handleMarketplaceBrowse=()=>{this.marketplaceBrowseUrl&&window.open(this.marketplaceBrowseUrl,"_blank","noopener")},this._closeCreateCardDialog=()=>{this.createCardDialogOpen=!1},this._handleCreateCardSuccess=e=>{(null==e?void 0:e.cardId)&&(this.createCardDialogOpen=!1,this.router.navigate(Fs.EDITOR_EDIT,{id:e.cardId}))}}connectedCallback(){super.connectedCallback(),this.hass&&(this.accountService=Me(this.hass),this.cardsService=Pe(this.hass),this.runtimeConfig=Ee(),this._loadCards(),this._subscribeToUpdates(),this._loadMarketplaceBrowseUrl()),this._syncIntegrationOutdatedNotice(),this.unsubscribeIntegrationOutdated=Be(()=>{this._syncIntegrationOutdatedNotice()}),this.unsubscribeRuntimeConfig=Re(()=>{this._syncIntegrationOutdatedNotice()}),this._subscribeCreateCardSuccess()}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe&&this.unsubscribe(),this.unsubscribeIntegrationOutdated&&(this.unsubscribeIntegrationOutdated(),this.unsubscribeIntegrationOutdated=void 0),this.unsubscribeRuntimeConfig&&(this.unsubscribeRuntimeConfig(),this.unsubscribeRuntimeConfig=void 0),this.unsubscribeCreateCardSuccess&&(this.unsubscribeCreateCardSuccess(),this.unsubscribeCreateCardSuccess=void 0)}updated(e){e.has("hass")&&this.hass&&!this.cardsService&&(this.accountService=Me(this.hass),this.cardsService=Pe(this.hass),this._loadCards(),this._subscribeToUpdates(),this._loadMarketplaceBrowseUrl()),this._subscribeCreateCardSuccess()}render(){var e;if(this.loading)return ot``;if(this.error)return this._renderError();const t=this._getStats();return ot`
            ${this.showIntegrationUpdateNotice?ot`
                <div class="integration-outdated-banner">
                    Your Card Builder integration is out of date. To connect your account correctly,
                    update the custom integration to the latest available version.
                </div>
            `:dt}
            <div class="dashboard-header">
                <h1 class="dashboard-title">Card Builder Dashboard</h1>
                <span class="dashboard-version">v${null==(e=this.runtimeConfig)?void 0:e.integrationVersion}</span>
                <p class="dashboard-subtitle">Manage and create your custom cards</p>
            </div>

            ${this._renderStats(t)}
            ${this._renderQuickActions()}
            <marketplace-featured-cards-carousel
                .hass=${this.hass}
                @marketplace-featured-card-download=${this._handleFeaturedMarketplaceDownload}
            ></marketplace-featured-cards-carousel>
            <marketplace-card-download-dialog
                .open=${this.marketplaceDialogOpen}
                .hass=${this.hass}
                .initialMarketplaceId=${this.selectedMarketplaceId}
                @overlay-close=${this._closeMarketplaceDialog}
                @marketplace-download-success=${this._handleMarketplaceDownloaded}
            ></marketplace-card-download-dialog>
            <card-create-dialog
                .open=${this.createCardDialogOpen}
                .hass=${this.hass}
                @overlay-close=${this._closeCreateCardDialog}
            ></card-create-dialog>
        `}_syncIntegrationOutdatedNotice(){this.showIntegrationUpdateNotice=De()}_renderStats(e){return ot`
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Cards</div>
                    <div class="stat-value">${e.total}</div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">Recently Modified</div>
                    <div class="stat-value">${e.recentlyModified}</div>
                    <div class="stat-subtitle">Last 7 days</div>
                </div>

                <div class="stat-card">
                    <div class="stat-label">Last Created</div>
                    <div class="stat-value ${e.lastCreated?"stat-card-name-value":""}">
                        ${e.lastCreated?e.lastCreated.name:"None"}
                    </div>
                    ${e.lastCreated?ot`
                        <div class="stat-subtitle">
                            ${this._formatDate(e.lastCreated.created_at)}
                        </div>
                    `:""}
                </div>
            </div>
        `}_renderQuickActions(){return ot`
            <div class="quick-actions">
                <h2 class="section-title">Quick Actions</h2>
                <div class="actions-grid">
                    <button
                            class="action-button marketplace-highlight"
                            @click=${this._handleMarketplaceBrowse}
                            ?disabled=${!this.marketplaceBrowseUrl}
                            title=${this.marketplaceBrowseUrl?"Open marketplace in a new tab":"Marketplace link unavailable"}
                    >
                        <ha-icon icon="mdi:store-search"></ha-icon>
                        <span class="action-label">Browse Marketplace</span>
                    </button>
                    <button class="action-button " @click=${this._handleMarketplaceDownload}>
                        <ha-icon icon="mdi:cloud-download"></ha-icon>
                        <span class="action-label">Download from Marketplace</span>
                    </button>

                    <button class="action-button" @click=${this._handleCreateNew}>
                        <ha-icon icon="mdi:plus-circle"></ha-icon>
                        <span class="action-label">Create New Card</span>
                    </button>

                    <button class="action-button secondary" @click=${this._handleViewAll}>
                        <ha-icon icon="mdi:cards"></ha-icon>
                        <span class="action-label">View All Cards</span>
                    </button>
                </div>
            </div>
        `}_renderError(){return ot`
            <div class="error-message">
                <strong>Error:</strong> ${this.error}
            </div>
            <button class="action-button" @click=${this._loadCards}>
                Retry
            </button>
        `}async _loadCards(){if(this.cardsService){this.loading=!0,this.error=null;try{this.cards=await this.cardsService.listCards()}catch(e){console.error("Failed to load cards:",e),this.error="Failed to load cards. Please try again."}finally{this.loading=!1}}}async _loadMarketplaceBrowseUrl(){if(this.accountService)try{const e=await this.accountService.getInfo();this.marketplaceBrowseUrl=null==e?void 0:e.urls.marketplace_page_browse}catch(e){console.error("Failed to load marketplace browse URL:",e),this.marketplaceBrowseUrl=null}}async _subscribeToUpdates(){if(this.cardsService)try{this.unsubscribe=await this.cardsService.subscribeToUpdates(()=>{this._loadCards()})}catch(e){console.error("Failed to subscribe to updates:",e)}}_getStats(){const e=this.cards.length,t=new Date;t.setDate(t.getDate()-7);return{total:e,recentlyModified:this.cards.filter(e=>new Date(e.updated_at)>=t).length,lastCreated:[...this.cards].sort((e,t)=>new Date(t.created_at).getTime()-new Date(e.created_at).getTime())[0]||null}}_formatDate(e){const t=new Date(e),i=(new Date).getTime()-t.getTime(),o=Math.floor(i/6e4),r=Math.floor(i/36e5),a=Math.floor(i/864e5);return o<1?"just now":o<60?`${o} min ago`:r<24?`${r} hours ago`:a<7?`${a} days ago`:t.toLocaleDateString()}_handleViewAll(){this.router.navigate(Fs.CARDS)}_handleCreateNew(){this.createCardDialogOpen=!0}_subscribeCreateCardSuccess(){!this.unsubscribeCreateCardSuccess&&this.eventBus&&(this.unsubscribeCreateCardSuccess=this.eventBus.addEventListener(mn,this._handleCreateCardSuccess))}};kn.styles=et`
        :host {
            display: block;
            padding: 24px;
            background-color: var(--primary-background-color);
            min-height: 100%;
        }

        .dashboard-header {
            margin-bottom: 32px;
        }

        .integration-outdated-banner {
            background: rgba(245, 159, 0, 0.15);
            border: 1px solid rgba(245, 159, 0, 0.4);
            color: var(--primary-text-color);
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            line-height: 1.5;
        }

        .dashboard-title {
            font-size: 32px;
            font-weight: 300;
            color: var(--primary-text-color);
            margin: 0;
        }
        .dashboard-version {
            font-size: 18px;
            color: var(--secondary-text-color);
        }

        .dashboard-subtitle {
            font-size: 20px;
            color: var(--secondary-text-color);
            margin: 10px 0 0 0;
        }

        /* Stats Grid */

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: var(--card-background-color);
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .stat-label {
            font-size: 14px;
            color: var(--secondary-text-color);
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-value {
            font-size: 36px;
            font-weight: 300;
            color: var(--primary-text-color);
            margin: 0;
        }

        .stat-subtitle {
            font-size: 12px;
            color: var(--secondary-text-color);
            margin-top: 8px;
        }

        .stat-card-name-value {
            font-size: 22px;
            line-height: 1.25;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            word-break: break-word;
        }

        /* Quick Actions */

        .quick-actions {
            background: var(--card-background-color);
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 32px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        }

        .section-title {
            font-size: 18px;
            font-weight: 500;
            color: var(--primary-text-color);
            margin: 0 0 16px 0;
        }

        .actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            --mdc-icon-size: 36px;
        }

        .action-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            justify-content: center;
            padding: 32px 16px;
            background: var(--primary-color);
            color: var(--text-primary-color, white);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.2s ease, opacity 0.2s ease;
            text-decoration: none;
            font-family: inherit;
        }

        .action-button:hover {
            transform: scale(1.05);
            opacity: 0.9;
        }

        .action-button:disabled {
            opacity: 0.55;
            cursor: not-allowed;
            transform: none;
        }

        .action-button.secondary {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
        }

        .action-button.marketplace-highlight {
            background: var(--accent-color, var(--primary-color));
            color: var(--text-primary-color, white);
        }

        .action-icon {
            width: 48px;
            height: 48px;
            margin-bottom: 12px;
        }

        .action-label {
            font-size: 16px;
            font-weight: 500;
        }

        /* Error State */

        .error-message {
            background: var(--error-color);
            color: white;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 16px;
        }

        @media (max-width: 768px) {
            :host {
                padding: 16px;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .actions-grid {
                grid-template-columns: 1fr;
            }
        }
    `,_n([tt({attribute:!1})],kn.prototype,"hass",2),_n([st()],kn.prototype,"cards",2),_n([st()],kn.prototype,"loading",2),_n([st()],kn.prototype,"error",2),_n([st()],kn.prototype,"showIntegrationUpdateNotice",2),_n([st()],kn.prototype,"marketplaceDialogOpen",2),_n([st()],kn.prototype,"selectedMarketplaceId",2),_n([st()],kn.prototype,"createCardDialogOpen",2),_n([st()],kn.prototype,"marketplaceBrowseUrl",2),_n([pt({context:d})],kn.prototype,"eventBus",2),kn=_n([rt("dashboard-view")],kn);const wn="card.json",Sn="extras.json",$n="media";class Cn{setHass(e){this.hass=e,this.cardsService=Pe(e),this.mediaService=new Ct(e)}getDefaultDuplicateName(e){return`${e} (Copy)`}getDefaultExportFileName(e){return this._slugifyFileName(e)}async duplicateCard(e,t){const i=this._requireService(),o=t.trim();if(!o)throw new Error("Card name is required");const r=e.marketplace_id??void 0,a="number"==typeof e.marketplace_download_version?e.marketplace_download_version:void 0;return i.createCard({name:o,description:e.description,config:this._cloneConfig(e.config),source:"marketplace",author:e.author,marketplace_origin:void 0,marketplace_download:!1,marketplace_download_version:void 0,marketplace_parent_id:r,marketplace_parent_version:a,marketplace_id:void 0,version:void 0,group_id:e.group_id??void 0,license_id:e.license_id??void 0,tags:e.tags?[...e.tags]:void 0,categories:e.categories?[...e.categories]:void 0,min_ha_version:e.min_ha_version??void 0,max_ha_version:e.max_ha_version??void 0,min_builder_version:e.min_builder_version??void 0,checksum:void 0,last_synced_at:void 0,tier:e.tier??void 0})}async exportCardBundle(e,t){if("marketplace"===e.source)throw new Error("Marketplace cards cannot be exported");const i=new _t,o=this._buildExportPayload(e),r=JSON.stringify(o,null,2);i.file(wn,r);const a=this._collectMediaReferences(e.config),s=this._collectPresetIds(e.config),[n,l]=await Promise.all([this._buildMediaItems(a),this._collectPresetsForExport(s)]),d=l.length>0?this._buildExtras(e,n,l):null;d&&i.file(Sn,JSON.stringify(d,null,2)),n.length>0&&await this._addMediaFilesToZip(i,n);const c=this._normalizeExportFileName(t,e.name),p=await i.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:6}});this._downloadBlobFile(c,p)}async readImportBundle(e){var t,i,o,r;if(!e.name.toLowerCase().endsWith(".zip"))throw new Error("Please select a ZIP bundle");const a=await _t.loadAsync(e),s=a.file(wn);if(!s)throw new Error("Invalid bundle: missing card.json");const n=await s.async("string"),l=this._parseCardPayload(n);if("marketplace"===l.source||"string"==typeof l.marketplace_id&&l.marketplace_id.trim())throw new Error("Marketplace cards cannot be imported");const d=Qs(l.min_builder_version,"importing");if(d)throw new Error(d);const c=a.file(Sn),p=c?this._parseExtras(await c.async("string")):void 0,h=this._extractMediaItems(a,p),u=(null==(i=null==(t=null==p?void 0:p.presets)?void 0:t.items)?void 0:i.length)?await this._detectPresetConflicts(p.presets.items):[],g=h.length>0?await this._detectMediaConflicts(h):[];return{card:l,extras:p??void 0,mediaItems:h,hasExtras:Boolean(null==(r=null==(o=null==p?void 0:p.presets)?void 0:o.items)?void 0:r.length),hasMedia:h.length>0,presetConflicts:u,mediaConflicts:g,zip:a}}async importBundle(e,t){var i,o,r;if("marketplace"===e.card.source||"string"==typeof e.card.marketplace_id&&e.card.marketplace_id.trim())throw new Error("Marketplace cards cannot be imported");const a=Qs(e.card.min_builder_version,"importing");if(a)throw new Error(a);const s=this._cloneConfig(e.card.config);let n=new Map,l=new Map;t.importExtras&&(null==(r=null==(o=null==(i=e.extras)?void 0:i.presets)?void 0:o.items)?void 0:r.length)&&(n=await this._importPresets(e.extras.presets.items,t.presetConflictStrategy)),t.importMedia&&e.mediaItems.length>0&&(l=await this._importMedia(e,t.mediaConflictStrategy));const d=n.size>0?this._applyPresetMapping(s,n):s,c=l.size>0?this._applyMediaMapping(d,l):d;return this._createCardFromBundle(e.card,t.name,t.description,c)}_requireService(){if(!this.cardsService)throw new Error("Cards service not available");return this.cardsService}_requireHass(){if(!this.hass)throw new Error("Home Assistant not available");return this.hass}async _requirePresetService(){return this.presetService||(this.presetService=await ee(this._requireHass())),this.presetService}_requireMediaService(){return this.mediaService||(this.mediaService=new Ct(this._requireHass())),this.mediaService}_cloneConfig(e){return JSON.parse(JSON.stringify(e))}_slugifyFileName(e){const t=e.trim();if(!t)return"card";return t.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"")||"card"}_normalizeExportFileName(e,t){const i=e.trim();if(!i)return`${this._slugifyFileName(t)}.zip`;let o=i;o.toLowerCase().endsWith(".zip")&&(o=o.slice(0,-4).trim());return`${this._slugifyFileName(o)}.zip`}_buildExportPayload(e){return{id:e.id,name:e.name,description:e.description,config:e.config,source:e.source,author:"local"===e.source?"":e.author??"",marketplace_origin:e.marketplace_origin??null,version:e.version,marketplace_id:e.marketplace_id??null,group_id:e.group_id??null,license_id:e.license_id??null,tags:e.tags??[],categories:e.categories??[],min_ha_version:e.min_ha_version??null,max_ha_version:e.max_ha_version??null,min_builder_version:e.min_builder_version??null,checksum:e.checksum??null,last_synced_at:e.last_synced_at??null,tier:e.tier??"base",created_at:e.created_at,updated_at:e.updated_at}}_buildExtras(e,t,i){const o={version:1,meta:{exportedAt:(new Date).toISOString(),cardId:e.id,cardName:e.name}};return i.length>0&&(o.presets={items:i}),t.length>0&&(o.media={items:t}),o}_downloadBlobFile(e,t){const i=URL.createObjectURL(t),o=document.createElement("a");o.href=i,o.download=e,o.rel="noopener",o.click(),URL.revokeObjectURL(i)}_collectMediaReferences(e){const i=new Set,o=e=>{"string"!=typeof e?Array.isArray(e)?e.forEach(o):e&&"object"==typeof e&&Object.values(e).forEach(o):t(e)&&i.add(e)};return o(e),Array.from(i.values())}_collectPresetIds(e){const t=new Set,i=(null==e?void 0:e.blocks)??{};return Object.values(i).forEach(e=>{const i=e.styles??{};Object.values(i).forEach(e=>{e&&"string"==typeof e.stylePresetId&&t.add(e.stylePresetId)})}),Array.from(t.values())}async _collectPresetsForExport(e){if(0===e.length)return[];const t=await this._requirePresetService(),i=new Map,o=[...e];for(;o.length>0;){const e=o.pop();if(!e||i.has(e))continue;const r=t.getCachedPreset(e)??await t.getPreset(e);r&&(i.set(e,r),r.extendsPresetId&&o.push(r.extendsPresetId))}return Array.from(i.values())}async _buildMediaItems(e){return e.map(e=>{const t=i(e);if(!t)return null;const o=t.split("/");return{reference:e,relativePath:t,fileName:o[o.length-1]||t,zipPath:`${$n}/${t}`}}).filter(e=>Boolean(e))}async _addMediaFilesToZip(e,t){await Promise.all(t.map(async t=>{const i=ge(t.reference);if(!i)throw new Error(`Unable to resolve media URL for ${t.reference}`);const o=await fetch(i,{credentials:"include"});if(!o.ok)throw new Error(`Failed to download media: ${t.fileName}`);const r=await o.arrayBuffer();e.file(t.zipPath,r)}))}_parseCardPayload(e){let t;try{t=JSON.parse(e)}catch(o){throw new Error(`Invalid card.json: ${o instanceof Error?o.message:"parse error"}`)}if(!t||"object"!=typeof t)throw new Error("Invalid card.json: expected object");const i=t.config;if(!i||"object"!=typeof i)throw new Error("Invalid card.json: missing config");return t}_parseExtras(e){let t;try{t=JSON.parse(e)}catch(i){throw new Error(`Invalid extras.json: ${i instanceof Error?i.message:"parse error"}`)}if(!t||"object"!=typeof t)throw new Error("Invalid extras.json: expected object");return t}_extractMediaItems(e,t){var i,o;if(null==(o=null==(i=null==t?void 0:t.media)?void 0:i.items)?void 0:o.length)return t.media.items.map(e=>({reference:e.reference,relativePath:e.relativePath,fileName:e.fileName,zipPath:e.zipPath||`${$n}/${e.relativePath}`}));const r=[];return e.forEach(e=>{if(!e.startsWith(`${$n}/`))return;const t=e.slice(6);if(!t||t.endsWith("/"))return;const i=t.split("/"),o=i[i.length-1]||t;r.push({reference:ue(t),relativePath:t,fileName:o,zipPath:e})}),r}async _detectPresetConflicts(e){const t=(await this._requirePresetService()).getAllPresets(),i=new Map;t.forEach(e=>{const t=e.name.trim().toLowerCase();i.has(t)||i.set(t,[]),i.get(t).push(e)});const o=[];return e.forEach(e=>{const t=e.name.trim().toLowerCase(),r=i.get(t);r&&r.length>0&&o.push({preset:e,existing:r[0]})}),o}async _detectMediaConflicts(e){const t=this._requireMediaService(),i=await t.browse(ue()),o=new Set((i.children||[]).filter(e=>!e.can_expand).map(e=>e.title)),r=[];return e.forEach(e=>{const t=this._toFlatMediaName(e.relativePath);o.has(t)&&r.push({item:e,existingName:t})}),r}async _importPresets(e,t){const i=await this._requirePresetService(),o=i.getAllPresets(),r=new Map;o.forEach(e=>{const t=e.name.trim().toLowerCase();r.has(t)||r.set(t,[]),r.get(t).push(e)});const a=new Map(e.map(e=>[e.id,e])),s=new Map,n=async e=>{if(s.has(e))return s.get(e)??null;const o=a.get(e);if(!o)return null;const l=(r.get(o.name.trim().toLowerCase())||[])[0],d=Boolean(l);let c;if(o.extendsPresetId){const e=await n(o.extendsPresetId);e&&(c=e)}if(d){if("use-existing"===t)return s.set(e,l.id),l.id;if("overwrite"===t)return await i.updatePreset(l.id,{name:o.name,description:o.description,extendsPresetId:c,data:o.data}),s.set(e,l.id),l.id}const p=await i.createPreset({name:o.name,description:o.description,extendsPresetId:c,data:o.data});return s.set(e,p.id),p.id};for(const l of e)await n(l.id);return s}async _importMedia(e,t){const i=this._requireMediaService(),o=await i.browse(ue()),r=new Set((o.children||[]).filter(e=>!e.can_expand).map(e=>e.title)),a=new Map;for(const s of e.mediaItems){const o=e.zip.file(s.zipPath);if(!o)continue;const n=this._toFlatMediaName(s.relativePath),l=r.has(n);if(l&&"skip"===t){a.set(s.reference,ue(n));continue}let d=n;l&&"rename"===t&&(d=this._getUniqueMediaName(n,r));const c=await o.async("blob"),p=new File([c],d,{type:c.type||"application/octet-stream"}),h=await i.uploadFile(p,ue());r.add(d),a.set(s.reference,h.reference||ue(d))}return a}_applyPresetMapping(e,t){const i=this._cloneConfig(e),o=i.blocks??{};return Object.values(o).forEach(e=>{e.styles&&Object.values(e.styles).forEach(e=>{if(!e||"string"!=typeof e.stylePresetId)return;const i=t.get(e.stylePresetId);i&&(e.stylePresetId=i)})}),i}_applyMediaMapping(e,t){const i=this._cloneConfig(e),o=e=>{if("string"==typeof e)return t.get(e)??e;if(Array.isArray(e))return e.map(o);if(e&&"object"==typeof e){const t=Object.entries(e),i={};return t.forEach(([e,t])=>{i[e]=o(t)}),i}return e};return o(i)}_toFlatMediaName(e){return e.replace(/\//g,"__")}_getUniqueMediaName(e,t){if(!t.has(e))return e;const i=/^(.*?)(\.[^.]+)?$/.exec(e),o=(null==i?void 0:i[1])||e,r=(null==i?void 0:i[2])||"";let a=1,s=`${o}_${a}${r}`;for(;t.has(s);)a+=1,s=`${o}_${a}${r}`;return s}_createCardFromBundle(e,t,i,o){const r=this._requireService(),a=e.source??"local",s="local"===a?this._getCurrentUserName():e.author??"";return r.createCard({name:t.trim(),description:i.trim(),config:o,source:a,author:s,marketplace_origin:e.marketplace_origin??void 0,version:e.version??void 0,marketplace_id:e.marketplace_id??void 0,group_id:e.group_id??void 0,license_id:e.license_id??void 0,tags:e.tags?[...e.tags]:void 0,categories:e.categories?[...e.categories]:void 0,min_ha_version:e.min_ha_version??void 0,max_ha_version:e.max_ha_version??void 0,min_builder_version:e.min_builder_version??void 0,checksum:e.checksum??void 0,last_synced_at:e.last_synced_at??void 0,tier:e.tier??void 0})}_getCurrentUserName(){var e,t;return(null==(t=null==(e=this.hass)?void 0:e.user)?void 0:t.name)??""}}const En=ct("cards-manager");var In=Object.defineProperty,Mn=Object.getOwnPropertyDescriptor,Pn=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Mn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&In(t,i,a),a};let Tn=class extends es{constructor(){super(...arguments),this.card=null,this.changelog=null,this.currentPreview=[],this.targetPreview=[],this.loading=!1,this.error=null,this.selectedVersion=null,this.currentPreviewLoading=!1,this.targetPreviewLoading=!1,this.currentPreviewError=null,this.targetPreviewError=null,this.confirmReplace=!1,this.step="review",this.preparing=!1,this.confirming=!1,this.preparedPayload=null,this.localConfig=null,this.missingEntitySlots=[],this.missingActionSlots=[],this.slotEntities={},this.slotActions={},this.currentPreviewRequestId=0,this.targetPreviewRequestId=0,this._documentModel=new me,this._handleVersionChange=e=>{const t=e.target,i=Number(null==t?void 0:t.value);Number.isNaN(i)?this.selectedVersion=null:(this.selectedVersion=i,this._loadTargetPreview(i))},this._handleConfirmChange=e=>{const t=e.target;this.confirmReplace=Boolean(null==t?void 0:t.checked)},this._handlePrepareUpdate=async()=>{if(this.hass&&this.card&&this.selectedVersion&&!this.preparing&&this.confirmReplace){this.preparing=!0,this.error=null;try{const e=Me(this.hass),t=await e.prepareMarketplaceUpdate(this.card.id,this.selectedVersion),i=Qs(t.payload.min_builder_version);if(i)return void(this.error=i);this.preparedPayload=t.payload,this.localConfig=t.local_config??null,this._initializeMissingSlots(),this._advanceToFirstWizardStep()}catch(e){this.error=this._formatError(e)}finally{this.preparing=!1}}},this._handleConfirmUpdate=async()=>{if(this.hass&&this.card&&this.preparedPayload){this.confirming=!0,this.error=null;try{const e=this._applySlotChoicesToPayload(),t=Me(this.hass),i=await t.confirmMarketplaceUpdate(this.card.id,e);this.dispatchEvent(new CustomEvent("marketplace-update-success",{detail:i,bubbles:!0,composed:!0})),this.handleClose()}catch(e){this.error=this._formatError(e)}finally{this.confirming=!1}}},this._handleSlotEntitiesChanged=e=>{var t;this.slotEntities=(null==(t=e.detail)?void 0:t.slotEntities)??{}},this._handleSlotActionsChanged=e=>{var t;this.slotActions=(null==(t=e.detail)?void 0:t.slotActions)??{}},this._handleWizardBack=()=>{const e=this._getWizardSteps(),t=e.indexOf(this.step);this.step=t<=0?"review":e[t-1],this.error=null},this._handleWizardNext=()=>{const e=this._getWizardSteps(),t=e.indexOf(this.step);t<e.length-1&&(this.step=e[t+1]),this.error=null}}get dialogTitle(){return"Update marketplace card"}get dialogSubtitle(){var e;if("review"===this.step)return(null==(e=this.card)?void 0:e.name)?`Update ${this.card.name}`:"Update downloaded card";const t=this._getWizardSteps();return`Step ${t.indexOf(this.step)+1} of ${t.length} — Configure new slots`}updated(e){super.updated(e),(e.has("open")&&this.open||e.has("card")&&this.open)&&this._initialize()}renderDialogBody(){switch(this.step){case"entities":return this._renderEntitiesStep();case"actions":return this._renderActionsStep();default:return this._renderReviewStep()}}renderDialogFooter(){switch(this.step){case"entities":case"actions":return this._renderWizardFooter();default:return this._renderReviewFooter()}}_renderReviewStep(){var e;if(!this.card)return ot`<div class="muted">Select a marketplace card to update.</div>`;const t=this._getCurrentVersion(),i=(null==(e=this.changelog)?void 0:e.latest_version)??null,o=this._getAvailableVersions();return ot`
            ${this.error?ot`<div class="error-banner">${this.error}</div>`:dt}

            <div class="meta-row">
                <div>Current version: ${t??"Unknown"}</div>
                <div>Latest version: ${i??"Unknown"}</div>
            </div>

            <div class="select-row">
                <div class="section-title">Version to download</div>
                <select
                    .value=${this.selectedVersion?String(this.selectedVersion):""}
                    @change=${this._handleVersionChange}
                    ?disabled=${this.loading||this.preparing||0===o.length}
                >
                    ${0===o.length?ot`
                        <option value="">No versions available</option>
                    `:o.map(e=>ot`
                        <option value=${String(e)}>
                            v${e}${e===i?" (latest)":""}
                        </option>
                    `)}
                </select>
            </div>

            <div class="preview-compare">
                <div class="preview-panel">
                    <div class="section-title">Current preview</div>
                    ${this._renderPreviewBlock(this.currentPreview,this.currentPreviewLoading,this.currentPreviewError)}
                </div>
                <div class="preview-panel">
                    <div class="section-title">Selected preview</div>
                    ${this._renderPreviewBlock(this.targetPreview,this.targetPreviewLoading,this.targetPreviewError)}
                </div>
            </div>

            <div class="changelog">
                <div class="section-title">Changelog</div>
                ${this._renderChangelog()}
            </div>

            <div class="warning-block">
                <label class="warning-checkbox">
                    <input
                        type="checkbox"
                        ?checked=${this.confirmReplace}
                        @change=${this._handleConfirmChange}
                        ?disabled=${this.preparing||this.loading}
                    />
                    <span>Updating will replace all local changes.</span>
                </label>
            </div>
        `}_renderReviewFooter(){const e=this.loading||this.preparing||!this.card||!this.selectedVersion||!this.confirmReplace;return ot`
            <div class="dialog-footer">
                <div class="footer-spacer"></div>
                <button class="secondary-btn" @click=${this.handleClose} ?disabled=${this.preparing}>
                    Cancel
                </button>
                <button class="primary-btn" @click=${this._handlePrepareUpdate} ?disabled=${e}>
                    ${this.preparing?"Preparing...":"Update card"}
                </button>
            </div>
        `}_renderEntitiesStep(){return ot`
            <div class="step-header">
                <div class="step-title">Configure new entity slots</div>
                <div class="step-meta">${this._getStepLabel()}</div>
            </div>
            ${this.error?ot`<div class="error-banner">${this.error}</div>`:dt}
            <marketplace-slot-configurator
                .hass=${this.hass}
                .entitySlots=${this.missingEntitySlots}
                .actionSlots=${[]}
                .slotEntities=${this.slotEntities}
                .slotActions=${{}}
                .mode=${"entities"}
                .validateEntities=${!0}
                @slot-entities-changed=${this._handleSlotEntitiesChanged}
            ></marketplace-slot-configurator>
        `}_renderActionsStep(){return ot`
            <div class="step-header">
                <div class="step-title">Configure new action slots</div>
                <div class="step-meta">${this._getStepLabel()}</div>
            </div>
            ${this.error?ot`<div class="error-banner">${this.error}</div>`:dt}
            <marketplace-slot-configurator
                .hass=${this.hass}
                .entitySlots=${[]}
                .actionSlots=${this.missingActionSlots}
                .slotEntities=${{}}
                .slotActions=${this.slotActions}
                .mode=${"actions"}
                @slot-actions-changed=${this._handleSlotActionsChanged}
            ></marketplace-slot-configurator>
        `}_renderWizardFooter(){const e=this._getWizardSteps(),t=e.indexOf(this.step)===e.length-1;return ot`
            <div class="dialog-footer">
                <div class="footer-spacer"></div>
                <button class="secondary-btn" @click=${this._handleWizardBack} ?disabled=${this.confirming}>
                    Back
                </button>
                ${t?ot`
                    <button class="primary-btn" @click=${this._handleConfirmUpdate} ?disabled=${this.confirming}>
                        ${this.confirming?"Saving...":"Confirm"}
                    </button>
                `:ot`
                    <button class="primary-btn" @click=${this._handleWizardNext}>
                        Next
                    </button>
                `}
            </div>
        `}_renderPreviewBlock(e,t,i){return t?ot`<div class="muted">Loading preview...</div>`:i?ot`<div class="error-banner">${i}</div>`:(null==e?void 0:e.length)?ot`
            <div class="preview-grid">
                ${e.map((e,t)=>ot`
                    <img
                        src=${e.url}
                        alt=${`Preview ${t+1}`}
                        loading="lazy"
                    />
                `)}
            </div>
        `:ot`<div class="muted">No previews available.</div>`}_renderChangelog(){var e;const t=(null==(e=this.changelog)?void 0:e.changelog)??[];return t.length?ot`
            ${t.map(e=>{var t;return ot`
                <div class="changelog-entry">
                    <div class="changelog-title">v${e.version}</div>
                    ${e.update_notes?ot`
                        <div class="changelog-text">${e.update_notes}</div>
                    `:dt}
                    ${(null==(t=e.update_reasons)?void 0:t.length)?ot`
                        <div class="changelog-text">Reasons: ${e.update_reasons.join(", ")}</div>
                    `:dt}
                    ${e.released_at?ot`
                        <div class="changelog-text">Released: ${new Date(e.released_at).toLocaleDateString()}</div>
                    `:dt}
                </div>
            `})}
        `:ot`<div class="muted">No changelog entries available.</div>`}_initializeMissingSlots(){var e,t,i,o;if(!(null==(e=this.preparedPayload)?void 0:e.config))return this.missingEntitySlots=[],this.missingActionSlots=[],this.slotEntities={},void(this.slotActions={});const{config:r}=we(this.preparedPayload.config);this._documentModel.loadFromConfig(r);const a=this._documentModel.getSlotEntities(),s=this._documentModel.getSlotActions(),n=new Set,l=new Set;if(this.localConfig){const{config:e}=we(this.localConfig),t=new me;t.loadFromConfig(e);for(const i of t.getSlotEntities())n.add(i.id);for(const i of t.getSlotActions())l.add(i.id)}const d=JSON.parse(JSON.stringify(this.preparedPayload.config)),c=d.slots;if((null==c?void 0:c.entities)&&this.localConfig){const e=this.localConfig.slots;if(null==e?void 0:e.entities)for(const t of Object.keys(c.entities))if(n.has(t)&&e.entities[t]){const i=e.entities[t].entityId;"string"!=typeof i&&void 0!==i||(c.entities[t].entityId=i)}}if((null==c?void 0:c.actions)&&this.localConfig){const e=this.localConfig.slots;if(null==e?void 0:e.actions)for(const t of Object.keys(c.actions))if(l.has(t)&&e.actions[t]){const i=e.actions[t];i.trigger&&(c.actions[t].trigger=i.trigger),i.action&&(c.actions[t].action=JSON.parse(JSON.stringify(i.action)))}}this.preparedPayload={...this.preparedPayload,config:d},this.missingEntitySlots=a.filter(e=>!n.has(e.id)),this.missingActionSlots=s.filter(e=>!l.has(e.id));const p={};for(const u of this.missingEntitySlots)if(null==(t=u.entityId)?void 0:t.trim()){const e=u.entityId.trim();(null==(o=null==(i=this.hass)?void 0:i.states)?void 0:o[e])&&(p[u.id]=e)}this.slotEntities=p;const h={};for(const u of this.missingActionSlots)u.action&&"none"!==u.action.action&&(h[u.id]=u.action);this.slotActions=h}_applySlotChoicesToPayload(){if(!this.preparedPayload)throw new Error("No prepared payload");const e={...this.preparedPayload},t=JSON.parse(JSON.stringify(e.config)),i=t.slots;if(null==i?void 0:i.entities)for(const o of this.missingEntitySlots)i.entities[o.id]&&(o.id in this.slotEntities?i.entities[o.id].entityId=this.slotEntities[o.id]:delete i.entities[o.id].entityId);if(null==i?void 0:i.actions)for(const[o,r]of Object.entries(this.slotActions))i.actions[o]&&(i.actions[o].action=r);return e.config=t,e}_getWizardSteps(){const e=[];return this.missingEntitySlots.length>0&&e.push("entities"),this.missingActionSlots.length>0&&e.push("actions"),e}_advanceToFirstWizardStep(){const e=this._getWizardSteps();e.length>0?this.step=e[0]:this._handleConfirmUpdate()}_getStepLabel(){const e=this._getWizardSteps();return`Step ${e.indexOf(this.step)+1} of ${e.length}`}_getAvailableVersions(){var e,t,i;const o=(null==(t=null==(e=this.changelog)?void 0:e.changelog)?void 0:t.map(e=>e.version))??[];if(o.length>0)return o;const r=null==(i=this.changelog)?void 0:i.latest_version;return"number"==typeof r?[r]:[]}_getCurrentVersion(){var e;return"number"==typeof(null==(e=this.card)?void 0:e.marketplace_download_version)?this.card.marketplace_download_version:null}async _initialize(){var e;if(this.hass&&this.card&&this.card.marketplace_id){this.loading=!0,this.error=null,this.changelog=null,this.selectedVersion=null,this.confirmReplace=!1,this.currentPreview=[],this.targetPreview=[],this.currentPreviewError=null,this.targetPreviewError=null,this.currentPreviewLoading=!1,this.targetPreviewLoading=!1,this.step="review",this.preparing=!1,this.confirming=!1,this.preparedPayload=null,this.localConfig=null,this.missingEntitySlots=[],this.missingActionSlots=[],this.slotEntities={},this.slotActions={};try{const t=Me(this.hass);this.changelog=await t.getMarketplaceCardChangelog(this.card.marketplace_id);const i=null==(e=this.changelog)?void 0:e.latest_version;if("number"==typeof i)this.selectedVersion=i;else{const e=this._getAvailableVersions();this.selectedVersion=e.length?e[0]:null}await Promise.all([this._loadCurrentPreview(),this.selectedVersion?this._loadTargetPreview(this.selectedVersion):Promise.resolve()])}catch(t){this.error=this._formatError(t)}finally{this.loading=!1}}}async _loadCurrentPreview(){var e;if(!this.hass||!(null==(e=this.card)?void 0:e.marketplace_id))return;const t=this._getCurrentVersion();if(!t)return;const i=++this.currentPreviewRequestId;this.currentPreviewLoading=!0,this.currentPreviewError=null;try{const e=Me(this.hass),o=await e.getMarketplaceCardInfo(this.card.marketplace_id,t);if(i!==this.currentPreviewRequestId)return;this.currentPreview=o.preview_images??[]}catch(o){if(i!==this.currentPreviewRequestId)return;this.currentPreviewError=this._formatError(o),this.currentPreview=[]}finally{i===this.currentPreviewRequestId&&(this.currentPreviewLoading=!1)}}async _loadTargetPreview(e){var t;if(!this.hass||!(null==(t=this.card)?void 0:t.marketplace_id))return;const i=++this.targetPreviewRequestId;this.targetPreviewLoading=!0,this.targetPreviewError=null;try{const t=Me(this.hass),o=await t.getMarketplaceCardInfo(this.card.marketplace_id,e);if(i!==this.targetPreviewRequestId)return;this.targetPreview=o.preview_images??[]}catch(o){if(i!==this.targetPreviewRequestId)return;this.targetPreviewError=this._formatError(o),this.targetPreview=[]}finally{i===this.targetPreviewRequestId&&(this.targetPreviewLoading=!1)}}_formatError(e){return String(e&&"object"==typeof e&&"message"in e?e.message??"Unexpected error":e??"Unexpected error")}};Tn.styles=[...es.styles,et`
            :host {
                --overlay-dialog-width: min(92vw, 1100px);
                --overlay-dialog-height: min(92vh, 820px);
            }

            .dialog-body {
                padding: 20px;
                overflow: auto;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .section-title {
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                color: var(--text-secondary, #666);
                font-weight: 600;
            }

            .meta-row {
                display: flex;
                gap: 16px;
                flex-wrap: wrap;
                font-size: 13px;
                color: var(--text-secondary, #666);
            }

            .select-row {
                display: grid;
                grid-template-columns: 160px 1fr;
                gap: 12px;
                align-items: center;
            }

            .select-row select {
                padding: 8px 10px;
                border-radius: 6px;
                border: 1px solid var(--border-color, #d0d0d0);
                background: var(--bg-primary, #fff);
                font-size: 14px;
                color: var(--text-primary, #333);
                font-family: inherit;
            }

            .preview-compare {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 16px;
            }

            .preview-panel {
                display: grid;
                gap: 10px;
            }

            .preview-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 10px;
            }

            .preview-grid img {
                width: 100%;
                height: auto;
                border-radius: 8px;
                border: 1px solid var(--border-color, #e0e0e0);
                background: #fff;
            }

            .changelog {
                display: grid;
                gap: 12px;
                padding: 12px;
                border: 1px solid var(--border-color, #e0e0e0);
                border-radius: 8px;
                background: var(--bg-secondary, #f7f7f7);
            }

            .changelog-entry {
                display: grid;
                gap: 6px;
            }

            .changelog-title {
                font-size: 13px;
                font-weight: 600;
                color: var(--text-primary, #333);
            }

            .changelog-text {
                font-size: 13px;
                color: var(--text-secondary, #666);
                line-height: 1.4;
            }

            .warning-block {
                display: grid;
                gap: 8px;
                padding: 10px 12px;
                border: 1px solid rgba(211, 47, 47, 0.3);
                border-radius: 8px;
                background: rgba(211, 47, 47, 0.08);
            }

            .warning-checkbox {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: var(--text-primary, #333);
            }

            .warning-checkbox input {
                accent-color: var(--warning-color, #f57c00);
            }

            .step-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 12px;
                border-bottom: 1px solid var(--border-color, #e0e0e0);
            }

            .step-title {
                font-size: 15px;
                font-weight: 700;
                color: var(--text-primary, #333);
            }

            .step-meta {
                font-size: 12px;
                color: var(--text-secondary, #666);
            }

            .error-banner {
                padding: 10px 12px;
                border-radius: 8px;
                background: rgba(211, 47, 47, 0.12);
                color: #b71c1c;
                font-size: 13px;
                border: 1px solid rgba(211, 47, 47, 0.2);
            }

            .muted {
                font-size: 13px;
                color: var(--text-secondary, #666);
            }
        `],Pn([tt({attribute:!1})],Tn.prototype,"hass",2),Pn([tt({attribute:!1})],Tn.prototype,"card",2),Pn([st()],Tn.prototype,"changelog",2),Pn([st()],Tn.prototype,"currentPreview",2),Pn([st()],Tn.prototype,"targetPreview",2),Pn([st()],Tn.prototype,"loading",2),Pn([st()],Tn.prototype,"error",2),Pn([st()],Tn.prototype,"selectedVersion",2),Pn([st()],Tn.prototype,"currentPreviewLoading",2),Pn([st()],Tn.prototype,"targetPreviewLoading",2),Pn([st()],Tn.prototype,"currentPreviewError",2),Pn([st()],Tn.prototype,"targetPreviewError",2),Pn([st()],Tn.prototype,"confirmReplace",2),Pn([st()],Tn.prototype,"step",2),Pn([st()],Tn.prototype,"preparing",2),Pn([st()],Tn.prototype,"confirming",2),Pn([st()],Tn.prototype,"preparedPayload",2),Pn([st()],Tn.prototype,"localConfig",2),Pn([st()],Tn.prototype,"missingEntitySlots",2),Pn([st()],Tn.prototype,"missingActionSlots",2),Pn([st()],Tn.prototype,"slotEntities",2),Pn([st()],Tn.prototype,"slotActions",2),Tn=Pn([rt("marketplace-card-update-dialog")],Tn);var Bn=Object.defineProperty,Rn=Object.getOwnPropertyDescriptor,Dn=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Rn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Bn(t,i,a),a};function On(e){return Boolean(e&&"object"==typeof e&&"integration_version_outdated"===e.code)}let An=class extends it{constructor(){super(...arguments),this.cards=[],this.filteredCards=[],this.loading=!0,this.searchQuery="",this.sortColumn="updated_at",this.sortDirection="desc",this.currentPage=1,this.pageSize=10,this.deleteConfirmId=null,this.error=null,this.showImportDialog=!1,this.importError=null,this.importName="",this.importDescription="",this.isImporting=!1,this.isParsingImport=!1,this.importBundle=null,this.importExtras=!0,this.importMedia=!0,this.presetConflictStrategy="create-new",this.mediaConflictStrategy="rename",this.migratingCardIds=new Set,this.duplicateSourceId=null,this.duplicateName="",this.exportSourceId=null,this.exportFileName="",this.marketplaceSharedCardsStatuses={},this.marketplaceSyncingCardIds=new Set,this.marketplaceAvailableVersions={},this.marketplaceStatusUnknown=!1,this.marketplaceSharedStatusChecking=!1,this.marketplaceAvailableStatusChecking=!1,this.showIntegrationUpdateNotice=!1,this.marketplaceDialogOpen=!1,this.marketplaceUpdateCard=null,this.createCardDialogOpen=!1,this.router=js(),this.marketplaceStatusRequestId=0,this._closeCreateCardDialog=()=>{this.createCardDialogOpen=!1},this._handleCreateCardSuccess=e=>{(null==e?void 0:e.cardId)&&(this.createCardDialogOpen=!1,this.router.navigate(Fs.EDITOR_EDIT,{id:e.cardId}))},this._handleMarketplaceDownload=()=>{Te()?this.marketplaceDialogOpen=!0:this.router.navigate(Fs.ACCOUNT)},this._closeMarketplaceDialog=()=>{this.marketplaceDialogOpen=!1},this._handleMarketplaceDownloaded=()=>{this.marketplaceDialogOpen=!1},this._closeMarketplaceUpdateDialog=()=>{this.marketplaceUpdateCard=null},this._handleMarketplaceUpdated=()=>{this.marketplaceUpdateCard=null}}connectedCallback(){super.connectedCallback(),this.hass&&(this.accountService=Me(this.hass),this.cardsService=Pe(this.hass),this._loadCards(),this._subscribeToUpdates()),this._syncIntegrationOutdatedNotice(),this.unsubscribeIntegrationOutdated=Be(()=>{this._syncIntegrationOutdatedNotice()}),this.unsubscribeRuntimeConfig=Re(()=>{this._handleRuntimeConfigChange()}),this._subscribeCreateCardSuccess()}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe&&this.unsubscribe(),this.searchTimeout&&clearTimeout(this.searchTimeout),this.unsubscribeIntegrationOutdated&&(this.unsubscribeIntegrationOutdated(),this.unsubscribeIntegrationOutdated=void 0),this.unsubscribeRuntimeConfig&&(this.unsubscribeRuntimeConfig(),this.unsubscribeRuntimeConfig=void 0),this.unsubscribeCreateCardSuccess&&(this.unsubscribeCreateCardSuccess(),this.unsubscribeCreateCardSuccess=void 0)}updated(e){e.has("hass")&&this.hass&&!this.accountService&&(this.accountService=Me(this.hass)),e.has("hass")&&this.hass&&!this.cardsService&&(this.cardsService=Pe(this.hass),this._loadCards(),this._subscribeToUpdates()),this._subscribeCreateCardSuccess()}render(){return this.loading?ot``:ot`
            ${this.error?ot`
                <div class="error-message">
                    <strong>Error:</strong> ${this.error}
                </div>
            `:""}

            ${this.showIntegrationUpdateNotice?ot`
                <div class="integration-outdated-banner">
                    Your Card Builder integration is out of date. To connect your account correctly,
                    update the custom integration to the latest available version.
                </div>
            `:dt}

            <div class="cards-header">
                <h1 class="cards-title">Cards</h1>
                <div class="header-actions">
                    <button class="secondary-button marketplace-download-button" @click=${this._handleMarketplaceDownload}>
                        <ha-icon icon="mdi:cloud-download"></ha-icon>
                        Download from Marketplace
                    </button>
                    <button class="secondary-button" @click=${this._handleImportClick}>
                        <ha-icon icon="mdi:file-download-outline"></ha-icon>
                        Import Card
                    </button>
                    <button class="primary-button" @click=${this._handleCreateNew}>
                        <ha-icon icon="mdi:plus-circle"></ha-icon>
                        New Card
                    </button>
                </div>
            </div>

            ${this._renderFilters()}
            ${0===this.filteredCards.length?this._renderEmptyState():this._renderTable()}
            ${this.filteredCards.length>0?this._renderPagination():""}
            ${this.deleteConfirmId?this._renderDeleteDialog():""}
            ${this.showImportDialog?this._renderImportDialog():""}
            ${this.duplicateSourceId?this._renderDuplicateDialog():""}
            ${this.exportSourceId?this._renderExportDialog():""}
            <marketplace-card-download-dialog
                .open=${this.marketplaceDialogOpen}
                .hass=${this.hass}
                @overlay-close=${this._closeMarketplaceDialog}
                @marketplace-download-success=${this._handleMarketplaceDownloaded}
            ></marketplace-card-download-dialog>
            <marketplace-card-update-dialog
                .open=${Boolean(this.marketplaceUpdateCard)}
                .hass=${this.hass}
                .card=${this.marketplaceUpdateCard}
                @overlay-close=${this._closeMarketplaceUpdateDialog}
                @marketplace-update-success=${this._handleMarketplaceUpdated}
            ></marketplace-card-update-dialog>
            <card-create-dialog
                .open=${this.createCardDialogOpen}
                .hass=${this.hass}
                @overlay-close=${this._closeCreateCardDialog}
            ></card-create-dialog>
        `}_renderFilters(){return ot`
            <div class="filters-bar">
                <input
                        type="text"
                        class="search-input"
                        placeholder="Search by name or description..."
                        .value=${this.searchQuery}
                        @input=${this._handleSearchInput}
                />
                <select
                        class="page-size-select"
                        .value=${this.pageSize.toString()}
                        @change=${this._handlePageSizeChange}
                >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                </select>
            </div>
        `}_getPageCards(){const e=(this.currentPage-1)*this.pageSize,t=e+this.pageSize;return this.filteredCards.slice(e,t)}_syncIntegrationOutdatedNotice(){this.showIntegrationUpdateNotice=De()}_handleRuntimeConfigChange(){this._syncIntegrationOutdatedNotice(),Te()?this._refreshMarketplaceStatus():this._resetMarketplaceStatus()}_renderTable(){const e=this._getPageCards();return ot`
            <div class="table-container">
                <table>
                    <thead>
                    <tr>
                        <th
                                class="sortable ${"name"===this.sortColumn?`sort-${this.sortDirection}`:""}"
                                @click=${()=>this._handleSort("name")}
                        >
                            Name
                        </th>
                        <th>Marketplace</th>
                        <th
                                class="sortable ${"updated_at"===this.sortColumn?`sort-${this.sortDirection}`:""}"
                                @click=${()=>this._handleSort("updated_at")}
                        >
                            Modified
                        </th>
                        <th style="text-align: right;">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${e.map(e=>this._renderTableRow(e))}
                    </tbody>
                </table>
            </div>
        `}_renderTableRow(e){const t=Oe(e.config),i=this._isMigrating(e.id),o=Boolean(e.marketplace_download),r=this._isSharedMarketplaceCard(e),a=this.marketplaceSharedCardsStatuses[e.id],s=Boolean(null==a?void 0:a.outOfSyncReason),n=!Te()&&(o||r),l=this.marketplaceStatusUnknown&&(o||r),d=!this.marketplaceStatusUnknown&&(o?this.marketplaceAvailableStatusChecking:this.marketplaceSharedStatusChecking),c=this.marketplaceSyncingCardIds.has(e.id),p=e.marketplace_id??null,h=(null==a?void 0:a.version)??null,u=p?this.marketplaceAvailableVersions[p]:null,g="number"==typeof e.marketplace_download_version?e.marketplace_download_version:0,v=o&&"number"==typeof u&&u>g;let b="Local",m="Local Only - Not Shared in Marketplace",f="unshared";if(n)b="Not connected",m="Connect your Card Builder account to check marketplace status.",f="not-connected";else if(d)b="Checking",m="Checking marketplace status",f="checking";else if(l)b="Unknown",m="Marketplace status unavailable. Update the Card Builder integration to refresh this status.",f="unknown";else if(o)b="Downloaded",m="Downloaded from marketplace",f="downloaded";else if(s)b="Out of sync",m=this._getSharedOutOfSyncTitle((null==a?void 0:a.outOfSyncReason)??null),f="shared missing";else if(r&&"number"==typeof h){h===e.version?(b="Shared",m=`Shared in marketplace (v${h})`,f="shared"):(b="Update",m=`Marketplace out of sync (local v${e.version}, marketplace v${h})`,f="shared outdated")}else r&&(b="Shared",m="Shared in marketplace",f="shared");return ot`
            <tr>
                <td>
                    <div
                            class="card-name"
                            @click=${()=>this._handleEdit(e.id)}
                    >${e.name}
                    </div>
                    <div class="card-description">
                        ${e.description?e.description.length>60?e.description.slice(0,60)+"…":e.description:ot`<em>No description</em>`}
                    </div>
                </td>
                <td>
                    <div class="marketplace-cell">
                        <span class="share-badge ${f}" title=${m}>
                            ${b}
                        </span>
                        ${!o||n||l||d?dt:ot`
                            <button
                                class="marketplace-icon-button ${v?"available":""}"
                                @click=${()=>this._handleMarketplaceUpdateClick(e)}
                                title=${v?"New version available":"Download another version"}
                            >
                                <ha-icon icon=${v?"mdi:cloud-download-outline":"mdi:history"}></ha-icon>
                            </button>
                        `}
                        ${!s||n||l||d?dt:ot`
                            <button
                                class="marketplace-icon-button sync ${c?"syncing":""}"
                                @click=${()=>this._handleMarketplaceSharedSync(e)}
                                ?disabled=${c}
                                title=${c?"Synchronizing marketplace state":"Synchronize marketplace state"}
                            >
                                <ha-icon icon=${c?"mdi:loading":"mdi:sync"}></ha-icon>
                            </button>
                        `}
                    </div>
                </td>
                <td>
                    <div class="card-date">${this._formatDate(e.updated_at)}</div>
                </td>
                <td>
                    <div class="actions-cell">
                        ${t?ot`
                            <button
                                    class="migrate-button"
                                    @click=${()=>this._handleMigrateCard(e.id)}
                                    ?disabled=${i}
                                    title="Migrate card to the latest data format"
                            >
                                ${i?"Migrating...":"Migrate"}
                            </button>
                        `:""}
                        <button
                                class="icon-button"
                                @click=${()=>this._handleDuplicateClick(e.id)}
                                title="Duplicate card"
                        >
                            <ha-icon icon="mdi:content-copy"></ha-icon>
                        </button>
                        <button
                                class="icon-button"
                                @click=${()=>this._handleExportClick(e.id)}
                                ?disabled=${"marketplace"===e.source}
                                title=${"marketplace"===e.source?"Marketplace cards cannot be exported":"Export card"}
                        >
                            <ha-icon icon="mdi:file-export-outline"></ha-icon>
                        </button>
                        <button
                                class="icon-button delete"
                                @click=${()=>this._handleDeleteClick(e.id)}
                                title="Delete card"
                        >
                            <ha-icon icon="mdi:delete"></ha-icon>
                        </button>
                    </div>
                </td>
            </tr>
        `}_isSharedMarketplaceCard(e){return!e.marketplace_download&&Boolean(e.marketplace_id)}_getSharedOutOfSyncTitle(e){switch(e){case"remote-missing":return"Shared locally but not found in marketplace. Synchronize to reset marketplace metadata.";case"local-missing":return"Found in marketplace but missing local marketplace metadata. Synchronize marketplace metadata.";case"marketplace-id-mismatch":return"Local marketplace metadata differs from marketplace. Synchronize marketplace metadata."}return"Marketplace metadata is out of sync. Synchronize marketplace metadata."}_resetMarketplaceStatus(){this.marketplaceStatusRequestId+=1,this.marketplaceStatusUnknown=!1,this.marketplaceSharedStatusChecking=!1,this.marketplaceAvailableStatusChecking=!1,this.marketplaceSharedCardsStatuses={},this.marketplaceAvailableVersions={}}async _refreshMarketplaceStatus(){if(!this.accountService)return;if(!Te())return void this._resetMarketplaceStatus();const e=this.cards.filter(e=>!e.marketplace_download),t=Array.from(new Set(this.cards.filter(e=>Boolean(e.marketplace_id)&&e.marketplace_download).map(e=>e.marketplace_id).filter(e=>Boolean(e)))).sort();if(0===this.cards.length)return void this._resetMarketplaceStatus();const i=++this.marketplaceStatusRequestId;this.marketplaceSharedStatusChecking=e.length>0,this.marketplaceAvailableStatusChecking=t.length>0;try{const[o,r]=await Promise.all([e.length?this.accountService.listAllMarketplaceCardsShared({cache:{ttlSeconds:3600}}):Promise.resolve([]),t.length?this.accountService.checkMarketplaceCardVersions(t,{cache:{ttlSeconds:3600}}):Promise.resolve({})]);if(i!==this.marketplaceStatusRequestId)return;this.marketplaceStatusUnknown=!1,this.marketplaceSharedStatusChecking=!1,this.marketplaceAvailableStatusChecking=!1;const a=new Map;for(const e of o)a.set(e.id,e);const s={};for(const t of e){const e=a.get(t.id),i=this._isSharedMarketplaceCard(t),o=(null==e?void 0:e.marketplace_id)??t.marketplace_id??null,r=(null==e?void 0:e.version)??null,n=t.marketplace_id??"";let l=null;e&&!i?l="local-missing":!e&&i?l="remote-missing":e&&i&&Boolean(o)&&o!==n&&(l="marketplace-id-mismatch"),s[t.id]={marketplaceId:o,version:r,remoteFound:Boolean(e),localShared:i,outOfSyncReason:l}}this.marketplaceSharedCardsStatuses=s;const n={};for(const[e,t]of Object.entries(r??{})){const i="number"==typeof(null==t?void 0:t.latest_version)?t.latest_version:null;n[e]=i}this.marketplaceAvailableVersions=n}catch(o){if(i!==this.marketplaceStatusRequestId)return;if(console.error("Failed to load marketplace status:",o),this.marketplaceSharedStatusChecking=!1,this.marketplaceAvailableStatusChecking=!1,On(o))return this.marketplaceStatusUnknown=!0,this._syncIntegrationOutdatedNotice(),void(this.marketplaceAvailableVersions={});this.marketplaceSharedCardsStatuses={},this.marketplaceAvailableVersions={}}}_renderPagination(){const e=Math.ceil(this.filteredCards.length/this.pageSize),t=(this.currentPage-1)*this.pageSize+1,i=Math.min(this.currentPage*this.pageSize,this.filteredCards.length),o=[];let r=Math.max(1,this.currentPage-Math.floor(2.5)),a=Math.min(e,r+5-1);a-r<4&&(r=Math.max(1,a-5+1));for(let s=r;s<=a;s++)o.push(s);return ot`
            <div class="pagination">
                <div class="pagination-info">
                    Showing ${t}-${i} of ${this.filteredCards.length}
                </div>
                <div class="pagination-controls">
                    <button
                            class="page-button"
                            @click=${()=>this._goToPage(this.currentPage-1)}
                            ?disabled=${1===this.currentPage}
                    >
                        ‹
                    </button>
                    ${o.map(e=>ot`
                        <button
                                class="page-button ${e===this.currentPage?"active":""}"
                                @click=${()=>this._goToPage(e)}
                        >
                            ${e}
                        </button>
                    `)}
                    <button
                            class="page-button"
                            @click=${()=>this._goToPage(this.currentPage+1)}
                            ?disabled=${this.currentPage===e}
                    >
                        ›
                    </button>
                </div>
            </div>
        `}_renderEmptyState(){return this.searchQuery?ot`
                <div class="table-container">
                    <div class="empty-state">
                        <ha-icon icon="mdi:credit-card-search-outline"></ha-icon>
                        <h3 class="empty-state-title">No cards found</h3>
                        <p class="empty-state-text">Try adjusting your search query</p>
                    </div>
                </div>
            `:ot`
            <div class="table-container">
                <div class="empty-state">
                    <ha-icon icon="mdi:card-bulleted-off-outline"></ha-icon>
                    <h3 class="empty-state-title">No cards yet</h3>
                    <p class="empty-state-text">Get started by creating your first card</p>
                </div>
            </div>
        `}_renderDeleteDialog(){if(!this.deleteConfirmId)return null;const e=this.cards.find(e=>e.id===this.deleteConfirmId);return e?ot`
            <div class="dialog-overlay" @click=${this._cancelDelete}>
                <div class="dialog" @click=${e=>e.stopPropagation()}>
                    <h2 class="dialog-header">Delete Card</h2>
                    <div class="dialog-content">
                        Are you sure you want to delete <strong>"${e.name}"</strong>?
                        This action cannot be undone.
                    </div>
                    <div class="dialog-actions">
                        <button class="secondary-button" @click=${this._cancelDelete}>
                            Cancel
                        </button>
                        <button class="danger-button" @click=${this._confirmDelete}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `:null}_renderImportDialog(){var e,t,i,o,r,a,s,n;const l=Boolean(this.importBundle)&&!this.importError&&""!==this.importName.trim(),d=(null==(o=null==(i=null==(t=null==(e=this.importBundle)?void 0:e.extras)?void 0:t.presets)?void 0:i.items)?void 0:o.length)??0,c=(null==(a=null==(r=this.importBundle)?void 0:r.mediaItems)?void 0:a.length)??0,p=(null==(s=this.importBundle)?void 0:s.presetConflicts)??[],h=(null==(n=this.importBundle)?void 0:n.mediaConflicts)??[];return ot`
            <div class="dialog-overlay" @click=${this._handleCloseImport}>
                <div class="dialog import-dialog" @click=${e=>e.stopPropagation()}>
                    <h2 class="dialog-header">Import Card</h2>

                    <div class="dialog-content">
                        <div
                                class="file-upload-area"
                                @click=${this._handleFileClick}
                                @dragover=${this._handleDragOver}
                                @dragleave=${this._handleDragLeave}
                                @drop=${this._handleFileDrop}
                        >
                            <ha-icon icon="mdi:archive-arrow-up-outline"></ha-icon>
                            <div class="file-upload-text">Click to select or drag and drop</div>
                            <div class="file-upload-hint">ZIP bundles only</div>
                        </div>
                        <input
                                type="file"
                                class="file-input"
                                accept=".zip"
                                @change=${this._handleFileSelect}
                        />

                        ${this.isParsingImport?ot`
                            <div class="success-box">
                                Parsing bundle...
                            </div>
                        `:""}

                        ${this.importError?ot`
                            <div class="error-box">
                                ${this.importError}
                            </div>
                        `:""}

                        ${!this.importBundle||this.importError||this.isParsingImport?"":ot`
                            <div class="success-box">
                                ✓ Bundle loaded
                                ${d>0?ot` • ${d} preset(s)`:""}
                                ${c>0?ot` • ${c} image(s)`:""}
                            </div>

                            <div class="form-field">
                                <label class="form-label">Card Name *</label>
                                <input
                                        type="text"
                                        class="form-input"
                                        .value=${this.importName}
                                        @input=${this._handleNameInput}
                                        placeholder="Enter card name"
                                />
                            </div>

                            <div class="form-field">
                                <label class="form-label">Description</label>
                                <textarea
                                        class="form-input form-textarea"
                                        .value=${this.importDescription}
                                        @input=${this._handleDescriptionInput}
                                        placeholder="Enter card description (optional)"
                                ></textarea>
                            </div>

                            ${this.importBundle.hasExtras?ot`
                                <div class="form-field">
                                    <label class="checkbox-row">
                                        <input
                                                type="checkbox"
                                                .checked=${this.importExtras}
                                                @change=${this._handleImportExtrasToggle}
                                        />
                                        Import extras (presets)
                                    </label>
                                    <div class="form-hint">Presets in bundle: ${d}</div>
                                </div>
                            `:""}

                            ${this.importBundle.hasMedia?ot`
                                <div class="form-field">
                                    <label class="checkbox-row">
                                        <input
                                                type="checkbox"
                                                .checked=${this.importMedia}
                                                @change=${this._handleImportMediaToggle}
                                        />
                                        Import images
                                    </label>
                                    <div class="form-hint">Images in bundle: ${c}</div>
                                </div>
                            `:""}

                            ${this.importExtras&&p.length>0?ot`
                                <div class="form-field">
                                    <label class="form-label">Preset conflicts</label>
                                    <select
                                            class="form-input"
                                            .value=${this.presetConflictStrategy}
                                            @change=${this._handlePresetConflictStrategyChange}
                                    >
                                        <option value="create-new">Create new presets</option>
                                        <option value="use-existing">Use existing presets</option>
                                        <option value="overwrite">Overwrite existing presets</option>
                                    </select>
                                    <div class="form-hint">
                                        Conflicting presets: ${p.map(e=>e.preset.name).join(", ")}
                                    </div>
                                </div>
                            `:""}

                            ${this.importMedia&&h.length>0?ot`
                                <div class="form-field">
                                    <label class="form-label">Image conflicts</label>
                                    <select
                                            class="form-input"
                                            .value=${this.mediaConflictStrategy}
                                            @change=${this._handleMediaConflictStrategyChange}
                                    >
                                        <option value="rename">Rename imported images</option>
                                        <option value="overwrite">Overwrite existing images</option>
                                        <option value="skip">Use existing images</option>
                                    </select>
                                    <div class="form-hint">
                                        Conflicting images: ${h.map(e=>e.item.fileName).join(", ")}
                                    </div>
                                </div>
                            `:""}
                        `}
                    </div>

                    <div class="dialog-actions">
                        <button class="secondary-button" @click=${this._handleCloseImport}>
                            Cancel
                        </button>
                        <button
                                class="primary-button"
                                @click=${this._handleConfirmImport}
                                ?disabled=${!l||this.isImporting}
                        >
                            ${this.isImporting?"Importing...":"Import Card"}
                        </button>
                    </div>
                </div>
            </div>
        `}_renderDuplicateDialog(){if(!this.duplicateSourceId)return null;const e=this.cards.find(e=>e.id===this.duplicateSourceId);if(!e)return null;const t=this.duplicateName.trim().length>0;return ot`
            <div class="dialog-overlay" @click=${this._handleCloseDuplicate}>
                <div class="dialog" @click=${e=>e.stopPropagation()}>
                    <h2 class="dialog-header">Duplicate Card</h2>
                    <div class="dialog-content">
                        <div class="form-field">
                            <label class="form-label">New Card Name *</label>
                            <input
                                    type="text"
                                    class="form-input"
                                    .value=${this.duplicateName}
                                    @input=${this._handleDuplicateNameInput}
                                    placeholder="Enter new card name"
                            />
                            <div class="form-hint">Source: ${e.name}</div>
                        </div>
                    </div>
                    <div class="dialog-actions">
                        <button class="secondary-button" @click=${this._handleCloseDuplicate}>
                            Cancel
                        </button>
                        <button
                                class="primary-button"
                                @click=${this._handleConfirmDuplicate}
                                ?disabled=${!t}
                        >
                            Duplicate
                        </button>
                    </div>
                </div>
            </div>
        `}_renderExportDialog(){var e;if(!this.exportSourceId)return null;const t=this.cards.find(e=>e.id===this.exportSourceId);if(!t)return null;const i=this.exportFileName.trim().length>0,o=(null==(e=this.cardsManager)?void 0:e.getDefaultExportFileName(t.name))??t.name;return ot`
            <div class="dialog-overlay" @click=${this._handleCloseExport}>
                <div class="dialog" @click=${e=>e.stopPropagation()}>
                    <h2 class="dialog-header">Export Card</h2>
                    <div class="dialog-content">
                        <div class="form-field">
                            <label class="form-label">File Name *</label>
                            <input
                                    type="text"
                                    class="form-input"
                                    .value=${this.exportFileName}
                                    @input=${this._handleExportFileNameInput}
                                    placeholder="Enter file name"
                            />
                            <div class="form-hint">Default: ${o}.zip</div>
                        </div>
                    </div>
                    <div class="dialog-actions">
                        <button class="secondary-button" @click=${this._handleCloseExport}>
                            Cancel
                        </button>
                        <button
                                class="primary-button"
                                @click=${this._handleConfirmExport}
                                ?disabled=${!i}
                        >
                            Export
                        </button>
                    </div>
                </div>
            </div>
        `}async _loadCards(){if(this.cardsService){this.loading=!0,this.error=null;try{this.cards=await this.cardsService.listCards(),this._applyFilters(),this._refreshMarketplaceStatus()}catch(e){console.error("Failed to load cards:",e),this.error="Failed to load cards. Please try again."}finally{this.loading=!1}}}async _subscribeToUpdates(){if(this.cardsService)try{this.unsubscribe=await this.cardsService.subscribeToUpdates(()=>{this._loadCards()})}catch(e){console.error("Failed to subscribe to updates:",e)}}_applyFilters(){let e=[...this.cards];if(this.searchQuery){const t=this.searchQuery.toLowerCase();e=e.filter(e=>e.name.toLowerCase().includes(t)||e.description.toLowerCase().includes(t))}e.sort((e,t)=>{let i,o;return"name"===this.sortColumn?(i=e.name.toLowerCase(),o=t.name.toLowerCase()):(i=new Date(e.updated_at).getTime(),o=new Date(t.updated_at).getTime()),"asc"===this.sortDirection?i>o?1:-1:i<o?1:-1}),this.filteredCards=e;const t=Math.ceil(this.filteredCards.length/this.pageSize);this.currentPage>t&&t>0&&(this.currentPage=t)}_isMigrating(e){return this.migratingCardIds.has(e)}async _handleMigrateCard(e){if(!this.cardsService)return;const t=this.cards.find(t=>t.id===e);if(!t)return;const i=new Set(this.migratingCardIds);i.add(e),this.migratingCardIds=i,this.error=null;try{const{config:i}=we(t.config);await this.cardsService.updateCard(e,{config:i,min_builder_version:fe.getRequiredBuilderVersionForDocument(i)}),await this._loadCards()}catch(o){console.error("Failed to migrate card:",o),this.error="Failed to migrate card. Please try again."}finally{const t=new Set(this.migratingCardIds);t.delete(e),this.migratingCardIds=t}}_handleSearchInput(e){const t=e.target;this.searchQuery=t.value,this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=window.setTimeout(()=>{this.currentPage=1,this._applyFilters()},300)}_handleSort(e){this.sortColumn===e?this.sortDirection="asc"===this.sortDirection?"desc":"asc":(this.sortColumn=e,this.sortDirection="desc"),this._applyFilters()}_handlePageSizeChange(e){const t=e.target;this.pageSize=parseInt(t.value,10),this.currentPage=1,this._applyFilters()}_goToPage(e){const t=Math.ceil(this.filteredCards.length/this.pageSize);e>=1&&e<=t&&(this.currentPage=e)}_formatDate(e){const t=new Date(e),i=(new Date).getTime()-t.getTime(),o=Math.floor(i/6e4),r=Math.floor(i/36e5),a=Math.floor(i/864e5);return o<1?"just now":o<60?`${o} min ago`:r<24?`${r} hours ago`:a<7?`${a} days ago`:t.toLocaleDateString()}_handleCreateNew(){this.createCardDialogOpen=!0}_subscribeCreateCardSuccess(){!this.unsubscribeCreateCardSuccess&&this.eventBus&&(this.unsubscribeCreateCardSuccess=this.eventBus.addEventListener(mn,this._handleCreateCardSuccess))}_handleImportClick(){this.showImportDialog=!0,this.importBundle=null,this.importError=null,this.importName="",this.importDescription="",this.isImporting=!1,this.isParsingImport=!1,this.importExtras=!0,this.importMedia=!0,this.presetConflictStrategy="create-new",this.mediaConflictStrategy="rename"}_handleMarketplaceUpdateClick(e){this.marketplaceUpdateCard=e}async _handleMarketplaceSharedSync(e){if(!this.accountService)return;const t=new Set(this.marketplaceSyncingCardIds);t.add(e.id),this.marketplaceSyncingCardIds=t,this.error=null;try{const t=await this.accountService.syncMarketplaceSharedCard(e.id);this.marketplaceSharedCardsStatuses={...this.marketplaceSharedCardsStatuses,[e.id]:{marketplaceId:t.marketplace_id,version:t.version??null,remoteFound:t.shared,localShared:t.shared,outOfSyncReason:null}},await this._loadCards()}catch(i){if(console.error("Failed to synchronize marketplace shared card:",i),On(i))return this.marketplaceStatusUnknown=!0,void this._syncIntegrationOutdatedNotice();this.error=i instanceof Error?`Failed to synchronize marketplace card: ${i.message}`:"Failed to synchronize marketplace card."}finally{const t=new Set(this.marketplaceSyncingCardIds);t.delete(e.id),this.marketplaceSyncingCardIds=t}}_handleCloseImport(){this.showImportDialog=!1,this.importBundle=null,this.importError=null,this.importName="",this.importDescription="",this.isImporting=!1,this.isParsingImport=!1,this.importExtras=!0,this.importMedia=!0,this.presetConflictStrategy="create-new",this.mediaConflictStrategy="rename"}_handleDuplicateClick(e){const t=this.cards.find(t=>t.id===e);t&&(this.duplicateSourceId=e,this.duplicateName=this.cardsManager.getDefaultDuplicateName(t.name)??`${t.name} (Copy)`)}_handleCloseDuplicate(){this.duplicateSourceId=null,this.duplicateName=""}_handleDuplicateNameInput(e){const t=e.target;this.duplicateName=t.value}async _handleConfirmDuplicate(){if(!this.cardsManager||!this.duplicateSourceId)return void(this.error="Cards manager not available. Please try again.");const e=this.cards.find(e=>e.id===this.duplicateSourceId);if(!e)return;const t=this.duplicateName.trim();if(t)try{await this.cardsManager.duplicateCard(e,t),this._handleCloseDuplicate(),await this._loadCards()}catch(i){console.error("Failed to duplicate card:",i),this.error="Failed to duplicate card. Please try again."}}_handleExportClick(e){var t;const i=this.cards.find(t=>t.id===e);i&&(this.exportSourceId=e,this.exportFileName=(null==(t=this.cardsManager)?void 0:t.getDefaultExportFileName(i.name))??i.name)}_handleCloseExport(){this.exportSourceId=null,this.exportFileName=""}_handleExportFileNameInput(e){const t=e.target;this.exportFileName=t.value}_handleFileClick(e){var t;const i=null==(t=e.currentTarget.parentElement)?void 0:t.querySelector(".file-input");i&&i.click()}_handleDragOver(e){e.preventDefault(),e.stopPropagation();e.currentTarget.classList.add("drag-over")}_handleDragLeave(e){e.preventDefault(),e.stopPropagation();e.currentTarget.classList.remove("drag-over")}_handleFileDrop(e){var t;e.preventDefault(),e.stopPropagation();e.currentTarget.classList.remove("drag-over");const i=null==(t=e.dataTransfer)?void 0:t.files;i&&i.length>0&&this._readFile(i[0])}_handleFileSelect(e){const t=e.target.files;t&&t.length>0&&this._readFile(t[0])}async _readFile(e){if(this.cardsManager){this.importError=null,this.importBundle=null,this.isParsingImport=!0;try{const t=await this.cardsManager.readImportBundle(e);this.importBundle=t,this.importName=t.card.name??"",this.importDescription=t.card.description??"",this.importExtras=t.hasExtras,this.importMedia=t.hasMedia,this.presetConflictStrategy="create-new",this.mediaConflictStrategy="rename"}catch(t){this.importError=t instanceof Error?t.message:"Failed to read bundle"}finally{this.isParsingImport=!1}}else this.importError="Cards manager not available. Please try again."}_handleNameInput(e){const t=e.target;this.importName=t.value}_handleDescriptionInput(e){const t=e.target;this.importDescription=t.value}_handleImportExtrasToggle(e){const t=e.target;this.importExtras=t.checked}_handleImportMediaToggle(e){const t=e.target;this.importMedia=t.checked}_handlePresetConflictStrategyChange(e){const t=e.target;this.presetConflictStrategy=t.value}_handleMediaConflictStrategyChange(e){const t=e.target;this.mediaConflictStrategy=t.value}async _handleConfirmImport(){if(this.cardsManager&&this.importBundle&&this.importName.trim()){this.isImporting=!0;try{await this.cardsManager.importBundle(this.importBundle,{name:this.importName.trim(),description:this.importDescription.trim(),importExtras:this.importExtras,importMedia:this.importMedia,presetConflictStrategy:this.presetConflictStrategy,mediaConflictStrategy:this.mediaConflictStrategy}),this._handleCloseImport(),await this._loadCards()}catch(e){console.error("Failed to import card:",e),this.importError=`Failed to import card: ${e instanceof Error?e.message:"unknown error"}`}finally{this.isImporting=!1}}}async _handleConfirmExport(){if(!this.cardsManager||!this.exportSourceId)return void(this.error="Cards manager not available. Please try again.");const e=this.cards.find(e=>e.id===this.exportSourceId);if(e)if("marketplace"!==e.source)try{await this.cardsManager.exportCardBundle(e,this.exportFileName),this._handleCloseExport()}catch(t){console.error("Failed to export card:",t),this.error=`Failed to export card: ${t instanceof Error?t.message:"unknown error"}`}else this.error="Marketplace cards cannot be exported."}_handleEdit(e){this.router.navigate(Fs.EDITOR_EDIT,{id:e})}_handleDeleteClick(e){this.deleteConfirmId=e}_cancelDelete(){this.deleteConfirmId=null}async _confirmDelete(){if(this.cardsService&&this.deleteConfirmId)try{await this.cardsService.deleteCard(this.deleteConfirmId),this.deleteConfirmId=null,await this._loadCards()}catch(e){console.error("Failed to delete card:",e),this.error="Failed to delete card. Please try again.",this.deleteConfirmId=null}}};An.styles=et`
        :host {
            display: block;
            padding: 24px;
            background-color: var(--primary-background-color);
            min-height: 100%;
        }

        .cards-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
        }

        .cards-title {
            font-size: 32px;
            font-weight: 300;
            color: var(--primary-text-color);
            margin: 0;
        }

        .integration-outdated-banner {
            background: rgba(245, 159, 0, 0.15);
            border: 1px solid rgba(245, 159, 0, 0.4);
            color: var(--primary-text-color);
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            line-height: 1.5;
        }

        .header-actions {
            display: flex;
            gap: 8px;
        }

        .primary-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: var(--primary-color);
            color: var(--text-primary-color, white);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: opacity 0.2s ease;
            font-family: inherit;
        }

        .primary-button:hover {
            opacity: 0.9;
        }

        .secondary-button {
            display: flex;
            align-items: center;
            padding: 10px 20px;
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s ease;
            font-family: inherit;
        }

        .secondary-button:hover {
            background: var(--divider-color);
        }

        .secondary-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .secondary-button.marketplace-download-button {
            background: var(--accent-color, var(--primary-color));
            color: var(--text-primary-color, white);
            border-color: var(--accent-color, var(--primary-color));
            transition: opacity 0.2s ease;
        }

        .secondary-button.marketplace-download-button:hover {
            background: var(--accent-color, var(--primary-color));
            opacity: 0.9;
        }

        .icon-small {
            width: 20px;
            height: 20px;
        }

        /* Filters Bar */

        .filters-bar {
            background: var(--card-background-color);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
            display: flex;
            gap: 16px;
            align-items: center;
            flex-wrap: wrap;
        }

        .search-input {
            flex: 1;
            min-width: 200px;
            padding: 10px 12px;
            border: 1px solid var(--divider-color);
            border-radius: 4px;
            background: var(--primary-background-color);
            color: var(--primary-text-color);
            font-size: 14px;
            font-family: inherit;
        }

        .search-input:focus {
            outline: none;
            border-color: var(--primary-color);
        }

        .page-size-select {
            padding: 8px 12px;
            border: 1px solid var(--divider-color);
            border-radius: 4px;
            background: var(--primary-background-color);
            color: var(--primary-text-color);
            font-size: 14px;
            font-family: inherit;
            cursor: pointer;
        }

        /* Table */

        .table-container {
            background: var(--card-background-color);
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
            overflow: hidden;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: var(--secondary-background-color);
        }

        th {
            padding: 16px;
            text-align: left;
            font-size: 12px;
            font-weight: 500;
            color: var(--secondary-text-color);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            cursor: pointer;
            user-select: none;
            position: relative;
        }

        th:hover {
            background: var(--divider-color);
        }

        th.sortable::after {
            content: '';
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            opacity: 0.3;
        }

        th.sort-asc::after {
            border-bottom: 6px solid var(--primary-text-color);
            opacity: 1;
        }

        th.sort-desc::after {
            border-top: 6px solid var(--primary-text-color);
            opacity: 1;
        }

        td {
            padding: 5px 10px;
            border-top: 1px solid var(--divider-color);
            color: var(--primary-text-color);
        }

        .card-name {
            font-weight: 500;
            max-width: 200px;
        }

        .card-name:hover {
            color: var(--primary-color);
            text-decoration: underline;
            cursor: pointer;
        }

        .share-badge {
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            padding: 2px 6px;
            border-radius: 999px;
            border: 1px solid transparent;
            line-height: 1.4;
        }

        .share-badge.shared {
            background: rgba(33, 150, 243, 0.12);
            color: var(--primary-color);
            border-color: rgba(33, 150, 243, 0.4);
        }

        .share-badge.shared.outdated {
            background: rgba(255, 152, 0, 0.18);
            color: var(--warning-color, #f57c00);
            border-color: rgba(255, 152, 0, 0.45);
        }

        .share-badge.shared.missing {
            background: rgba(244, 67, 54, 0.14);
            color: var(--error-color, #f44336);
            border-color: rgba(244, 67, 54, 0.45);
        }

        .share-badge.unshared {
            background: rgba(120, 120, 120, 0.12);
            color: var(--secondary-text-color);
            border-color: rgba(120, 120, 120, 0.35);
        }

        .share-badge.downloaded {
            background: rgba(76, 175, 80, 0.12);
            color: var(--success-color, #2e7d32);
            border-color: rgba(76, 175, 80, 0.4);
        }

        .share-badge.unknown {
            background: rgba(120, 120, 120);
            color: white;
            border-color: rgba(120, 120, 120, 0.45);
        }

        .share-badge.not-connected {
            background: rgba(120, 120, 120, 0.12);
            color: var(--secondary-text-color);
            border-color: rgba(120, 120, 120, 0.36);
        }

        .share-badge.checking {
            background: rgba(33, 150, 243, 0.10);
            color: var(--primary-color);
            border-color: rgba(33, 150, 243, 0.32);
        }

        .marketplace-cell {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .marketplace-icon-button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            color: var(--primary-text-color);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s ease, color 0.2s ease;
        }

        .marketplace-icon-button:hover {
            background-color: var(--secondary-background-color);
        }

        .marketplace-icon-button.available {
            color: var(--warning-color, #f57c00);
        }

        .marketplace-icon-button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
        
        .marketplace-icon-button.sync {
            color: var(--error-color, #f44336);
        }

        .marketplace-icon-button.syncing ha-icon {
            animation: spin 1s linear infinite;
        }

        .card-description {
            font-size: 12px;
            color: var(--secondary-text-color);
            margin-top: 4px;
        }

        .card-date {
            font-size: 13px;
            color: var(--secondary-text-color);
        }

        .actions-cell {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }

        .migrate-button {
            display: inline-flex;
            align-items: center;
            padding: 6px 10px;
            border: 1px solid var(--warning-color);
            border-radius: 6px;
            background: transparent;
            color: var(--warning-color);
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s ease, opacity 0.2s ease;
            font-family: inherit;
        }

        .migrate-button:hover {
            background: rgba(255, 152, 0, 0.15);
        }

        .migrate-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .icon-button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            color: var(--primary-text-color);
            border-radius: 4px;
            transition: background-color 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .icon-button[disabled] {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .icon-button:not([disabled]):hover {
            background-color: var(--secondary-background-color);
        }

        .icon-button.delete {
            color: var(--error-color);
        }

        .icon {
            width: 20px;
            height: 20px;
        }

        /* Pagination */

        .pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: var(--card-background-color);
            border-radius: 8px;
            margin-top: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
            flex-wrap: wrap;
            gap: 16px;
        }

        .pagination-info {
            font-size: 14px;
            color: var(--secondary-text-color);
        }

        .pagination-controls {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .page-button {
            padding: 8px 12px;
            background: var(--primary-background-color);
            border: 1px solid var(--divider-color);
            border-radius: 4px;
            cursor: pointer;
            color: var(--primary-text-color);
            font-size: 14px;
            transition: background-color 0.2s ease;
            min-width: 36px;
            font-family: inherit;
        }

        .page-button:hover:not(:disabled) {
            background: var(--secondary-background-color);
        }

        .page-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .page-button.active {
            background: var(--primary-color);
            color: var(--text-primary-color, white);
            border-color: var(--primary-color);
        }

        /* Empty State */

        .empty-state {
            text-align: center;
            padding: 64px 16px;
            color: var(--secondary-text-color);
        }

        .empty-state ha-icon {
            --mdc-icon-size: 48px;
            margin-bottom: 16px;
            opacity: 0.3;
        }

        .empty-state-title {
            font-size: 20px;
            color: var(--primary-text-color);
            margin: 0 0 8px 0;
        }

        .empty-state-text {
            font-size: 14px;
            margin: 0 0 24px 0;
        }

        /* Delete Dialog */

        .dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
        }

        .dialog {
            background: var(--card-background-color, var(--primary-background-color));
            border-radius: 8px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 11px 15px -7px rgba(0, 0, 0, .2), 0 24px 38px 3px rgba(0, 0, 0, .14), 0 9px 46px 8px rgba(0, 0, 0, .12);
        }

        .import-dialog {
            max-width: 700px;
        }

        .dialog-header {
            font-size: 24px;
            font-weight: 400;
            margin: 0;
            padding: 24px 24px 16px;
            color: var(--primary-text-color);
        }

        .dialog-content {
            padding: 0 24px 24px;
            color: var(--primary-text-color);
        }

        .dialog-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            padding: 16px 24px;
            border-top: 1px solid var(--divider-color);
        }

        .import-tabs {
            display: flex;
            gap: 0;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--divider-color);
        }

        .import-tab {
            flex: 1;
            padding: 12px 16px;
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: var(--secondary-text-color);
            transition: all 0.2s ease;
            font-family: inherit;
        }

        .import-tab:hover {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
        }

        .import-tab.active {
            color: var(--primary-color);
            border-bottom-color: var(--primary-color);
        }

        .import-textarea {
            width: 100%;
            min-height: 200px;
            padding: 12px;
            border: 1px solid var(--divider-color);
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            resize: vertical;
            box-sizing: border-box;
        }

        .import-textarea:focus {
            outline: none;
            border-color: var(--primary-color);
        }

        .file-upload-area {
            border: 2px dashed var(--divider-color);
            border-radius: 8px;
            padding: 32px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            background: var(--secondary-background-color);
        }

        .file-upload-area:hover {
            border-color: var(--primary-color);
            background: var(--primary-background-color);
        }

        .file-upload-area.drag-over {
            border-color: var(--primary-color);
            background: var(--primary-color);
            opacity: 0.1;
        }

        .file-upload-area ha-icon {
            --mdc-icon-size: 64px;
            display: block;
            margin-bottom: 16px;
            color: var(--secondary-text-color);
        }

        .file-upload-text {
            color: var(--primary-text-color);
            font-size: 16px;
            margin-bottom: 8px;
        }

        .file-upload-hint {
            color: var(--secondary-text-color);
            font-size: 12px;
        }

        .file-input {
            display: none;
        }

        .selected-file {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: var(--secondary-background-color);
            border-radius: 4px;
            margin-top: 12px;
        }

        .selected-file-icon {
            width: 32px;
            height: 32px;
            color: var(--primary-color);
        }

        .selected-file-info {
            flex: 1;
        }

        .selected-file-name {
            font-weight: 500;
            color: var(--primary-text-color);
        }

        .selected-file-size {
            font-size: 12px;
            color: var(--secondary-text-color);
        }

        .error-box {
            padding: 12px;
            background: var(--error-color, #f44336);
            color: white;
            border-radius: 4px;
            margin: 16px 0;
            font-size: 14px;
        }

        .success-box {
            padding: 12px;
            background: var(--success-color, #4caf50);
            color: white;
            border-radius: 4px;
            margin: 16px 0;
            font-size: 14px;
        }

        .form-field {
            margin-bottom: 16px;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            color: var(--primary-text-color);
            font-size: 14px;
            font-weight: 500;
        }

        .form-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--divider-color);
            border-radius: 4px;
            font-size: 14px;
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            font-family: inherit;
            box-sizing: border-box;
        }

        .form-input:focus {
            outline: none;
            border-color: var(--primary-color);
        }

        .form-textarea {
            min-height: 80px;
            resize: vertical;
        }

        .form-hint {
            margin-top: 6px;
            font-size: 12px;
            color: var(--secondary-text-color);
        }

        .checkbox-row {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: var(--primary-text-color);
        }

        .checkbox-row input {
            width: 16px;
            height: 16px;
        }

        .danger-button {
            padding: 10px 20px;
            background: var(--error-color, #f44336);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: opacity 0.2s ease;
            font-family: inherit;
        }

        .danger-button:hover {
            opacity: 0.9;
        }

        .danger-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Error Message */

        .error-message {
            background: var(--error-color);
            color: white;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 16px;
        }

        /* Responsive */
        @media (max-width: 768px) {
            :host {
                padding: 16px;
            }

            .cards-header {
                flex-direction: column;
                align-items: flex-start;
            }

            .filters-bar {
                flex-direction: column;
                align-items: stretch;
            }

            .search-input {
                width: 100%;
            }

            table {
                font-size: 12px;
            }

            th, td {
                padding: 12px 8px;
            }

            .card-description {
                display: none;
            }

            .pagination {
                flex-direction: column;
                align-items: stretch;
            }

            .pagination-controls {
                justify-content: center;
            }
        }
    `,Dn([tt({attribute:!1})],An.prototype,"hass",2),Dn([pt({context:En,subscribe:!0})],An.prototype,"cardsManager",2),Dn([pt({context:d})],An.prototype,"eventBus",2),Dn([st()],An.prototype,"cards",2),Dn([st()],An.prototype,"filteredCards",2),Dn([st()],An.prototype,"loading",2),Dn([st()],An.prototype,"searchQuery",2),Dn([st()],An.prototype,"sortColumn",2),Dn([st()],An.prototype,"sortDirection",2),Dn([st()],An.prototype,"currentPage",2),Dn([st()],An.prototype,"pageSize",2),Dn([st()],An.prototype,"deleteConfirmId",2),Dn([st()],An.prototype,"error",2),Dn([st()],An.prototype,"showImportDialog",2),Dn([st()],An.prototype,"importError",2),Dn([st()],An.prototype,"importName",2),Dn([st()],An.prototype,"importDescription",2),Dn([st()],An.prototype,"isImporting",2),Dn([st()],An.prototype,"isParsingImport",2),Dn([st()],An.prototype,"importBundle",2),Dn([st()],An.prototype,"importExtras",2),Dn([st()],An.prototype,"importMedia",2),Dn([st()],An.prototype,"presetConflictStrategy",2),Dn([st()],An.prototype,"mediaConflictStrategy",2),Dn([st()],An.prototype,"migratingCardIds",2),Dn([st()],An.prototype,"duplicateSourceId",2),Dn([st()],An.prototype,"duplicateName",2),Dn([st()],An.prototype,"exportSourceId",2),Dn([st()],An.prototype,"exportFileName",2),Dn([st()],An.prototype,"marketplaceSharedCardsStatuses",2),Dn([st()],An.prototype,"marketplaceSyncingCardIds",2),Dn([st()],An.prototype,"marketplaceAvailableVersions",2),Dn([st()],An.prototype,"marketplaceStatusUnknown",2),Dn([st()],An.prototype,"marketplaceSharedStatusChecking",2),Dn([st()],An.prototype,"marketplaceAvailableStatusChecking",2),Dn([st()],An.prototype,"showIntegrationUpdateNotice",2),Dn([st()],An.prototype,"marketplaceDialogOpen",2),Dn([st()],An.prototype,"marketplaceUpdateCard",2),Dn([st()],An.prototype,"createCardDialogOpen",2),An=Dn([rt("cards-list-view")],An);var zn=Object.defineProperty,Ln=Object.getOwnPropertyDescriptor,Nn=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Ln(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&zn(t,i,a),a};const Fn=100;let Vn=class extends es{constructor(){super(...arguments),this.cardId="",this.cardName="",this.description="",this.shared=!1,this.busy=!1,this.error=null,this.descriptionDraft="",this.changeNotes="",this.changeReasons=new Set,this.updateReasonOptions=[],this.updateReasonLoading=!1,this.updateReasonError=null,this.stepIndex=0,this.containers=[],this.snapshots=[],this.snapshotting=!1,this.snapshotError=null,this.containerWidthPercents={},this.containerScales={},this.shareDisclaimer=null,this.shareDisclaimerLoading=!1,this.shareDisclaimerError=null,this.shareDisclaimerAccepted=!1,this.shareDisclaimerExpanded=!1,this.previewThemeMode="auto",this.previewRenderScale=1,this.updateReasonRequestId=0,this.disclaimerRequestId=0,this._handleDescriptionInput=e=>{const t=e.target;this.descriptionDraft=t.value},this._handleShareDisclaimerCheck=e=>{const t=e.target;this.shareDisclaimerAccepted=t.checked},this._handleShareDisclaimerToggle=()=>{this.shareDisclaimerExpanded=!this.shareDisclaimerExpanded},this._handleChangeNotesInput=e=>{const t=e.target;this.changeNotes=t.value},this._handleReasonChange=e=>{const t=e.target,i=Number(t.value);if(Number.isNaN(i))return;const o=new Set(this.changeReasons);t.checked?o.add(i):o.delete(i),this.changeReasons=o},this._handleThemeSupportChange=e=>{const t=e.target.value;this.themeSupport!==t&&(this.themeSupport=t,this.snapshots=[],this.snapshotError=null,this._syncPreviewThemeMode(),this.dispatchEvent(new CustomEvent("theme-support-declared",{detail:{themeSupport:t},bubbles:!0,composed:!0})))},this._handleWidthInput=(e,t)=>{const i=e.target,o=Number(i.value);if(Number.isNaN(o))return;const r=Math.min(Math.max(o,30),Fn);this.containerWidthPercents={...this.containerWidthPercents,[t]:r}},this._handleScaleInput=(e,t)=>{var i;const o=e.target,r=Number(o.value);if(Number.isNaN(r))return;const a=Math.min(Math.max(r,.5),2);this.containerScales={...this.containerScales,[t]:a},(null==(i=this._getCurrentPreviewStep())?void 0:i.container.id)===t&&(this.previewRenderScale=a)},this._handleThemeNext=()=>{!this.busy&&this.themeSupport&&(this.stepIndex=1,this.snapshotError=null,this._syncPreviewThemeMode(),this._syncPreviewRenderScale())},this._handleNext=async()=>{if(this.snapshotting||this.busy)return;const e=this._getCurrentPreviewStep();if(e){this.snapshotting=!0,this.snapshotError=null;try{this.previewThemeMode=e.themeMode,this.previewRenderScale=this._getCardScale(e.container.id),await this.updateComplete,await new Promise(e=>requestAnimationFrame(()=>e(!0))),await this._captureSnapshot(e),this.stepIndex=Math.min(this.stepIndex+1,this._getPreviewSteps().length+1)}catch(t){console.error("Failed to capture snapshot:",t),this.snapshotError="Unable to capture the screenshot. Try again."}finally{this.snapshotting=!1}}},this._handleBack=()=>{this.snapshotting||this.busy||0!==this.stepIndex&&(this.stepIndex-=1,this.snapshotError=null)},this._handleConfirm=()=>{if(this.busy)return;if(!this.themeSupport)return;if(!this._hasAllSnapshots())return;if(!this.shared&&!this.descriptionDraft.trim())return;if(!this.shared&&(!this.shareDisclaimer||this.shareDisclaimerLoading||this.shareDisclaimerError||!this.shareDisclaimerAccepted))return;if(this.shared&&(!this.changeNotes.trim()||0===this.changeReasons.size))return;const e={themeSupport:this.themeSupport,screens:this.snapshots.slice()};this.shared?(e.updateNotes=this.changeNotes.trim(),e.updateReasons=Array.from(this.changeReasons)):e.description=this.descriptionDraft.trim(),this.dispatchEvent(new CustomEvent("share-confirm",{detail:e,bubbles:!0,composed:!0}))}}get dialogTitle(){return this.shared?"Upload update":"Share to marketplace"}get dialogSubtitle(){const e=this._getTotalSteps();if(!this.open||0===e)return null;return`Step ${Math.min(this.stepIndex+1,e)} of ${e}`}get closeOnBackdrop(){return!this.busy&&!this.snapshotting}get closeOnEscape(){return!this.busy&&!this.snapshotting}updated(e){super.updated(e),e.has("open")&&this.open&&this._initializeDialog(),e.has("description")&&this.open&&!this.shared&&(this.descriptionDraft=this.description||""),(e.has("stepIndex")||e.has("themeSupport")||e.has("containers")||e.has("containerScales"))&&(this._syncPreviewThemeMode(),this._syncPreviewRenderScale())}renderDialogBody(){return ot`
            ${this._renderStepHeader()}
            <div class="step-body">
                ${this._isThemeStep()?this._renderThemeSupportStep():this._isFinalStep()?this._renderFinalStep():this._renderContainerStep()}
            </div>
        `}renderDialogFooter(){if(this._isThemeStep()){const e=this.busy||!this.themeSupport;return ot`
                <div class="dialog-footer">
                    <div class="footer-spacer"></div>
                    <button class="secondary-btn" @click=${this.handleClose} ?disabled=${this.busy}>Cancel</button>
                    <button class="primary-btn" @click=${this._handleThemeNext} ?disabled=${e}>
                        ${this.busy?"Saving...":"Next"}
                    </button>
                </div>
            `}if(this._isFinalStep()){const e=this.shared,t=!this.descriptionDraft.trim(),i=e&&!this.changeNotes.trim(),o=e&&0===this.changeReasons.size,r=!e&&!this.shareDisclaimerLoading&&!this.shareDisclaimerError&&Boolean(this.shareDisclaimer),a=!(e||this.shareDisclaimerAccepted&&r),s=this._hasAllSnapshots(),n=this.busy||!s||(e?i||o:t||a),l=e?"Upload update":"Share";return ot`
                <div class="dialog-footer">
                    <button class="secondary-btn" @click=${this._handleBack} ?disabled=${this.busy}>Back</button>
                    <div class="footer-spacer"></div>
                    <button class="secondary-btn" @click=${this.handleClose} ?disabled=${this.busy}>Cancel</button>
                    <button class="primary-btn" @click=${this._handleConfirm} ?disabled=${n}>
                        ${this.busy?"Uploading...":l}
                    </button>
                </div>
            `}const e=this._getPreviewSteps(),t=this.stepIndex===e.length?"Capture & Review":"Capture & Next",i="ready"===this._getRendererStatus(),o=this.busy||this.snapshotting||!i;return ot`
            <div class="dialog-footer">
                ${this.stepIndex>0?ot`<button class="secondary-btn" @click=${this._handleBack} ?disabled=${this.snapshotting||this.busy}>Back</button>`:dt}
                <div class="footer-spacer"></div>
                <button class="secondary-btn" @click=${this.handleClose} ?disabled=${this.snapshotting||this.busy}>Cancel</button>
                <button class="primary-btn" @click=${this._handleNext} ?disabled=${o}>
                    ${this.snapshotting?"Capturing...":t}
                </button>
            </div>
        `}_renderStepHeader(){if(this._isThemeStep())return ot`
                <div class="step-header">
                    <div>
                        <div class="step-title">Theme support</div>
                        <div class="step-meta">Declare which Home Assistant theme modes this card is designed for.</div>
                    </div>
                    <div class="step-meta">${this._getCurrentStepLabel()}</div>
                </div>
            `;if(this._isFinalStep())return ot`
                <div class="step-header">
                    <div>
                        <div class="step-title">Review and upload</div>
                        <div class="step-meta">Check details and screenshots before publishing.</div>
                    </div>
                </div>
            `;const e=this._getCurrentPreviewStep();if(!e)return ot``;const t=e.container,i=`${t.aspectRatioWidth}:${t.aspectRatioHeight}`;return ot`
            <div class="step-header">
                <div>
                    <div class="step-title">${e.label}</div>
                    <div class="step-meta">Target screen: ${i}</div>
                </div>
                <div class="step-meta">${this._getCurrentStepLabel()}</div>
            </div>
        `}_renderThemeSupportStep(){const e=this._getThemeSupportOptions();return ot`
            <div class="theme-step">
                <p class="intro">
                    Choose the theme support statement that will be published with this card.
                    This is an author declaration, not an automatic check of the card styles.
                </p>
                ${this.error?ot`<div class="error-banner">${this.error}</div>`:dt}
                <div class="theme-options">
                    ${e.map(e=>ot`
                        <label class="theme-option ${this.themeSupport===e.value?"selected":""}">
                            <input
                                type="radio"
                                name="theme-support"
                                .value=${e.value}
                                ?checked=${this.themeSupport===e.value}
                                @change=${this._handleThemeSupportChange}
                            />
                            <span class="theme-option-copy">
                                <span class="theme-option-title">${e.label}</span>
                                <span class="theme-option-description">${e.description}</span>
                            </span>
                        </label>
                    `)}
                </div>
            </div>
        `}_renderContainerStep(){const e=this._getCurrentPreviewStep();if(!e)return ot``;const t=e.container,i=this._getCardWidthPercent(t.id),o=this._getCardScale(t.id),r=Boolean(e.controlsLocked),a="loading"===this._getRendererStatus(),s=_i(this.hass,e.themeMode);return ot`
            <div class="step-layout">
                <div class="preview-column">
                    <div
                        class="preview-frame"
                        style="
                            --preview-ratio: ${t.aspectRatioWidth} / ${t.aspectRatioHeight};
                            --card-width: ${i}%; 
                            --card-scale: ${o};
                        "
                        ${ht(e=>this.previewFrame=e)}
                    >
                        ${a?ot`
                            <div class="preview-loading">
                                <div class="preview-spinner"></div>
                                <div>Loading preview...</div>
                            </div>
                        `:dt}
                        <div class="preview-stage">
                            <div class="card-wrapper">
                                <hui-view-container
                                    .hass=${s.hass}
                                    .theme=${s.theme}
                                    class="card-scale"
                                >
                                    <card-builder-renderer-card
                                        ${ht(e=>this._setPreviewRenderer(e))}
                                        .hass=${this.hass}
                                        .activeContainerId=${t.id}
                                    ></card-builder-renderer-card>
                                </hui-view-container>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="controls-column">
                    <p class="intro">
                        ${r?"This screenshot uses the same width and scale as the light preview.":`Adjust the card width to improve the ${e.themeLabel.toLowerCase()} screenshot.`}
                    </p>
                    <p class="intro">
                        This capture will be sent as <strong>${e.key}</strong>.
                    </p>
                    <div class="form-group">
                        <label class="form-label">Card width (%)</label>
                        <div class="range-row">
                            <input
                                type="range"
                                min=${30}
                                max=${Fn}
                                step="1"
                                .value=${String(i)}
                                ?disabled=${r}
                                @input=${e=>this._handleWidthInput(e,t.id)}
                            />
                            <input
                                type="number"
                                min=${30}
                                max=${Fn}
                                step="1"
                                .value=${String(i)}
                                ?disabled=${r}
                                @input=${e=>this._handleWidthInput(e,t.id)}
                            />
                        </div>
                        <div class="hint">
                            ${r?"Locked to match the light screenshot framing.":"Scale width between 30% and 100%."}
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Card scale</label>
                        <div class="range-row">
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.05"
                                .value=${String(o)}
                                ?disabled=${r}
                                @input=${e=>this._handleScaleInput(e,t.id)}
                            />
                            <input
                                type="number"
                                min="0.5"
                                max="2"
                                step="0.05"
                                .value=${String(o)}
                                ?disabled=${r}
                                @input=${e=>this._handleScaleInput(e,t.id)}
                            />
                        </div>
                        <div class="hint">
                            ${r?"Scale is locked to keep the light and dark screenshots identical except for theme colors.":"Zoom in or out to improve visibility."}
                        </div>
                    </div>
                    ${this.snapshotError?ot`<div class="error-banner">${this.snapshotError}</div>`:dt}
                </div>
            </div>
        `}_renderFinalStep(){const e=this.shared,t=!this.descriptionDraft.trim(),i=e&&!this.changeNotes.trim(),o=e&&0===this.changeReasons.size,r=this._getPreviewSteps();return ot`
            <div class="step-layout">
                <div class="controls-column">
                    <p class="intro">
                        ${e?"This will upload a new version of your card to the marketplace.":"This will upload your card and any linked assets to the marketplace."}
                    </p>
                    ${this.error?ot`<div class="error-banner">${this.error}</div>`:dt}
                    <div class="summary">
                        <div class="summary-row">
                            <span class="summary-label">Card</span>
                            <span class="summary-value">${this.cardName||"Untitled Card"}</span>
                        </div>
                        ${e?ot`
                            <div class="summary-row">
                                <span class="summary-label">Description</span>
                                <span class="summary-value">${this.description||"No description provided."}</span>
                            </div>
                        `:dt}
                        <div class="summary-row">
                            <span class="summary-label">Theme</span>
                            <span class="summary-value">${this._getThemeSupportLabel(this.themeSupport)}</span>
                        </div>
                    </div>
                    ${e?this._renderUpdateFields(i,o):ot`
                        ${this._renderDescriptionField(t)}
                    `}
                </div>
                <div class="preview-column">
                    <div class="step-title">Screenshots</div>
                    <div class="screens-grid">
                        ${r.map(e=>{const t=this._getSnapshot(e.key);return ot`
                                <div class="screen-card">
                                    <div class="screen-label">${e.key}</div>
                                    ${t?ot`<img src=${t.dataUrl} alt="Screenshot ${e.key}" />`:ot`<div class="screen-missing">Missing screenshot</div>`}
                                </div>
                            `})}
                    </div>
                    ${this._hasAllSnapshots()?dt:ot`
                        <div class="error-banner">Some screenshots are missing. Go back to capture them.</div>
                    `}
                </div>
            </div>
        `}_renderDescriptionField(e){return ot`
            <div class="form-group">
                <label class="form-label">
                    Description
                    <span class="required">*</span>
                </label>
                <textarea
                    .value=${this.descriptionDraft}
                    class=${e?"error":""}
                    @input=${this._handleDescriptionInput}
                    placeholder="Describe your card for the marketplace"
                ></textarea>
                ${e?ot`
                    <div class="error-text">Description is required.</div>
                `:dt}
                ${this._renderShareDisclaimer()}
            </div>
        `}_renderShareDisclaimer(){var e,t;if(this.shared)return dt;const i=this.shareDisclaimer,o=this.shareDisclaimerLoading,r=this.shareDisclaimerError,a=o||Boolean(r),s=Boolean((null==i?void 0:i.html)||((null==(e=null==i?void 0:i.links)?void 0:e.length)??0));return ot`
            <div class="disclaimer-block">
                <div class="disclaimer-row">
                    <label class="checkbox-item">
                        <input
                            type="checkbox"
                            ?checked=${this.shareDisclaimerAccepted}
                            ?disabled=${a}
                            @change=${this._handleShareDisclaimerCheck}
                        />
                        <span>I agree to the marketplace sharing disclaimer.</span>
                    </label>
                    <button
                        class="disclaimer-toggle"
                        @click=${this._handleShareDisclaimerToggle}
                        ?disabled=${!s||a}
                        type="button"
                    >
                        ${this.shareDisclaimerExpanded?"Hide details":"Show details"}
                    </button>
                </div>
                ${o?ot`<div class="hint">Loading disclaimer...</div>`:dt}
                ${r?ot`<div class="error-text">${r}</div>`:dt}
                ${this.shareDisclaimerExpanded&&s?ot`
                    <div class="disclaimer-body">
                        ${(null==i?void 0:i.html)?ot`${at(i.html)}`:dt}
                        ${(null==(t=null==i?void 0:i.links)?void 0:t.length)?ot`
                            <div class="disclaimer-links">
                                ${i.links.map(e=>ot`
                                    <a href=${e.url} target="_blank" rel="noopener">
                                        ${e.label}
                                    </a>
                                `)}
                            </div>
                        `:dt}
                    </div>
                `:dt}
            </div>
        `}_renderUpdateFields(e,t){const i=this.updateReasonOptions.length>0;return ot`
            <div class="form-group">
                <label class="form-label">
                    What changed
                    <span class="required">*</span>
                </label>
                <textarea
                    .value=${this.changeNotes}
                    class=${e?"error":""}
                    @input=${this._handleChangeNotesInput}
                    placeholder="Explain what changed in this update"
                ></textarea>
                ${e?ot`
                    <div class="error-text">Please describe the update.</div>
                `:dt}
            </div>

            <div class="form-group">
                <label class="form-label">
                    Reasons
                    <span class="required">*</span>
                </label>
                ${this.updateReasonLoading?ot`
                    <div class="hint">Loading update reasons...</div>
                `:dt}
                ${this.updateReasonError?ot`
                    <div class="error-text">${this.updateReasonError}</div>
                `:dt}
                ${this.updateReasonLoading||this.updateReasonError||i?dt:ot`
                    <div class="hint">No update reasons available.</div>
                `}
                ${i?ot`
                    <div class="checkbox-group">
                        ${this.updateReasonOptions.map(e=>ot`
                            <label class="checkbox-item">
                                <input
                                    type="checkbox"
                                    .value=${String(e.id)}
                                    ?checked=${this.changeReasons.has(e.id)}
                                    @change=${this._handleReasonChange}
                                />
                                <span>${e.name}</span>
                            </label>
                        `)}
                    </div>
                `:dt}
                ${t&&i?ot`
                    <div class="error-text">Select at least one reason.</div>
                `:i?ot`
                    <div class="hint">Select all that apply.</div>
                `:dt}
            </div>
        `}async _fetchUpdateReasons(){if(!this.hass)return this.updateReasonError="Unable to load update reasons.",void(this.updateReasonLoading=!1);const e=++this.updateReasonRequestId;this.updateReasonLoading=!0,this.updateReasonError=null;try{const t=Me(this.hass),i=await t.listMarketplaceUpdateReasons();if(e!==this.updateReasonRequestId)return;const o=[];for(const e of(null==i?void 0:i.data)??[]){const t=e,i=t.id,r="string"==typeof t.name?t.name:"";let a=null;"number"==typeof i&&Number.isFinite(i)?a=i:"string"==typeof i&&i.trim().match(/^\d+$/)&&(a=Number(i.trim())),null!==a&&r&&o.push({id:a,name:r})}this.updateReasonOptions=o}catch(t){if(e!==this.updateReasonRequestId)return;console.error("Failed to load update reasons:",t),this.updateReasonError="Unable to load update reasons.",this.updateReasonOptions=[]}finally{e===this.updateReasonRequestId&&(this.updateReasonLoading=!1)}}async _fetchShareDisclaimer(){if(!this.hass)return this.shareDisclaimerError="Unable to load disclaimer.",void(this.shareDisclaimerLoading=!1);const e=++this.disclaimerRequestId;this.shareDisclaimerLoading=!0,this.shareDisclaimerError=null;try{const t=Me(this.hass),i=await t.getMarketplaceShareDisclaimer();if(e!==this.disclaimerRequestId)return;this.shareDisclaimer=i}catch(t){if(e!==this.disclaimerRequestId)return;console.error("Failed to load share disclaimer:",t),this.shareDisclaimerError="Unable to load disclaimer.",this.shareDisclaimer=null}finally{e===this.disclaimerRequestId&&(this.shareDisclaimerLoading=!1)}}_setPreviewRenderer(e){if(!e)return;const t=e;this.previewRenderer=t,this.cardId&&t.setConfig({type:"custom:card-builder-renderer-card",card_id:this.cardId})}_initializeDialog(){var e;this.descriptionDraft=this.description||"",this.changeNotes="",this.changeReasons=new Set,this.updateReasonOptions=[],this.updateReasonLoading=!1,this.updateReasonError=null,this.themeSupport=null==(e=this.cardConfig)?void 0:e.themeSupport,this.previewThemeMode="auto",this.previewRenderScale=1,this.shareDisclaimer=null,this.shareDisclaimerLoading=!1,this.shareDisclaimerError=null,this.shareDisclaimerAccepted=!1,this.shareDisclaimerExpanded=!1,this.containers=ze.getContainers(!0),this.containerWidthPercents=this._buildInitialPercents(this.containers),this.containerScales=this._buildInitialScales(this.containers),this.snapshots=[],this.stepIndex=0,this.snapshotError=null,this.shared?this._fetchUpdateReasons():this._fetchShareDisclaimer()}_buildInitialPercents(e){const t={};for(const i of e)t[i.id]=Fn;return t}_buildInitialScales(e){const t={};for(const i of e)t[i.id]=1;return t}_getThemeSupportOptions(){return[{value:"light",label:"Light mode only",description:"Designed and verified for light mode only. The card has not been optimized or checked in dark mode and may look wrong on a dark background."},{value:"dark",label:"Dark mode only",description:"Designed and verified for dark mode only. The card has not been optimized or checked in light mode and may look wrong on a light background."},{value:"both",label:"Light and dark",description:"Explicitly designed and verified for both light and dark mode. Colors are set or checked so the card looks correct in each mode."},{value:"universal",label:"Universal base design",description:"Designed to look correct in any theme using one set of base colors, without mode-specific overrides. This is intentionally different from light-only support."}]}_getThemeSupportLabel(e){var t;return(null==(t=this._getThemeSupportOptions().find(t=>t.value===e))?void 0:t.label)??"Not declared"}_getPreviewSteps(){return this.themeSupport?this.containers.flatMap(e=>"both"===this.themeSupport?[this._createPreviewStep(e,"light",`${e.id}_light`,"Light","light"),this._createPreviewStep(e,"dark",`${e.id}_dark`,"Dark","dark",!0)]:"light"===this.themeSupport?[this._createPreviewStep(e,"light",e.id,"Light")]:"dark"===this.themeSupport?[this._createPreviewStep(e,"dark",e.id,"Dark")]:[this._createPreviewStep(e,"auto",e.id,"Universal base")]):[]}_createPreviewStep(e,t,i,o,r,a=!1){return{key:i,label:`${e.name} ${o.toLowerCase()} preview`,themeLabel:o,container:e,themeMode:t,uploadThemeMode:r,controlsLocked:a}}_getCurrentPreviewStep(){return this._getPreviewSteps()[this.stepIndex-1]}_syncPreviewThemeMode(){const e=this._isThemeStep()||this._isFinalStep()?void 0:this._getCurrentPreviewStep(),t=(null==e?void 0:e.themeMode)??"auto";this.previewThemeMode!==t&&(this.previewThemeMode=t)}_syncPreviewRenderScale(){const e=this._isThemeStep()||this._isFinalStep()?void 0:this._getCurrentPreviewStep(),t=e?this._getCardScale(e.container.id):1;this.previewRenderScale!==t&&(this.previewRenderScale=t)}_getCardWidthPercent(e){return this.containerWidthPercents[e]??Fn}_getCardScale(e){return this.containerScales[e]??1}_getContainerScreenSize(e){const t=e.screenWidth,i=e.aspectRatioWidth/e.aspectRatioHeight;return{width:t,height:Math.round(t/i)}}_getTotalSteps(){return this._getPreviewSteps().length+2}_getCurrentStepLabel(){const e=this._getTotalSteps();return`Step ${Math.min(this.stepIndex+1,e)} / ${e}`}_isFinalStep(){return this.stepIndex>=this._getPreviewSteps().length+1}_isThemeStep(){return 0===this.stepIndex}_hasAllSnapshots(){const e=this._getPreviewSteps();return e.length>0&&e.every(e=>Boolean(this._getSnapshot(e.key)))}_getSnapshot(e){return this.snapshots.find(t=>t.key===e)}_getRendererStatus(){var e;const t=null==(e=this.previewRenderer)?void 0:e.shadowRoot;return t?t.querySelector(".card-content.error")?"error":t.querySelector(".card-content.loading")?"loading":t.querySelector("card-builder-renderer-card-canvas")?"ready":"loading":"loading"}async _waitForRendererReady(e=4e3){const t=performance.now();for(;performance.now()-t<e;){const e=this._getRendererStatus();if("ready"===e)return!0;if("error"===e)return!1;await new Promise(e=>requestAnimationFrame(()=>e(!0)))}return!1}async _captureSnapshot(e){const t=this.previewFrame;if(!t)return void(this.snapshotError="Preview frame not ready.");if(!(await this._waitForRendererReady()))return void(this.snapshotError="Preview is not ready yet.");const i=t.clientWidth;if(!i)return void(this.snapshotError="Unable to measure preview size.");const o=e.container,r=this._getCardScale(o.id),a=this._getContainerScreenSize(o),s=a.width/i,n=await kt(t,{width:a.width,height:a.height,style:{width:`${a.width}px`,height:`${a.height}px`,border:"none",borderRadius:"0",background:"transparent"},scale:1,backgroundColor:"transparent",fetch:{bypassingCache:!0},onCloneNode:function(e){e.querySelector(".card-scale").style.setProperty("transform",`scale(${r*s})`)}}),l={key:e.key,containerId:o.id,themeMode:e.uploadThemeMode,dataUrl:n,width:a.width,height:a.height,cardWidthPercent:this._getCardWidthPercent(o.id),cardScale:this._getCardScale(o.id)};this.snapshots=[...this.snapshots.filter(t=>t.key!==e.key),l]}};Vn.styles=[...es.styles,et`
            :host {
                --overlay-dialog-width: min(96vw, 1280px);
                --overlay-dialog-height: min(94vh, 920px);
            }

            .dialog-body {
                padding: 0;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .step-header {
                padding: 16px 20px;
                border-bottom: 1px solid var(--border-color, #e0e0e0);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                background: var(--bg-secondary, #f5f5f5);
            }

            .step-title {
                font-size: 15px;
                font-weight: 700;
                color: var(--text-primary, #333);
            }

            .step-meta {
                font-size: 12px;
                color: var(--text-secondary, #666);
            }

            .step-body {
                flex: 1;
                overflow-y: auto;
            }

            .step-layout {
                display: grid;
                grid-template-columns: minmax(0, 1.8fr) minmax(0, 0.5fr);
                gap: 20px;
                padding: 20px;
                box-sizing: border-box;
            }

            .preview-column,
            .controls-column {
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 14px;
            }

            .preview-frame {
                position: relative;
                width: 100%;
                aspect-ratio: var(--preview-ratio);
                border: 1px solid var(--border-color, #dcdcdc);
                border-radius: 12px;
                background: #f7f7f7;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            .preview-stage {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                box-sizing: border-box;
            }

            .card-wrapper {
                width: var(--card-width, 100%);
                max-width: 100%;
                display: flex;
                justify-content: center;
            }

            .card-scale {
                width: 100%;
                display: block;
                transform: scale(calc(var(--card-scale, 1) * var(--export-factor, 1)));
                transform-origin: center;
            }

            .card-scale card-builder-renderer-card {
                width: 100%;
                display: block;
            }

            .preview-loading {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                gap: 10px;
                background: rgba(0, 0, 0, 0.55);
                font-size: 22px;
                font-weight: bold;
                color: white;
                z-index: 1;
            }

            .preview-spinner {
                width: 34px;
                height: 34px;
                border-radius: 50%;
                border: 4px solid white;
                border-top-color: var(--accent-color, #2196f3);
                animation: preview-spin 0.9s linear infinite;
            }

            @keyframes preview-spin {
                to {
                    transform: rotate(360deg);
                }
            }

            .intro {
                font-size: 13px;
                color: var(--text-secondary, #666);
                margin: 0;
                line-height: 1.5;
            }

            .summary {
                display: grid;
                gap: 10px;
                padding: 12px;
                border: 1px solid var(--border-color, #e0e0e0);
                border-radius: 8px;
                background: var(--bg-secondary, #f5f5f5);
                margin-bottom: 16px;
            }

            .summary-row {
                display: grid;
                grid-template-columns: 110px 1fr;
                gap: 8px;
                align-items: start;
            }

            .summary-label {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                color: var(--text-secondary, #666);
                font-weight: 600;
            }

            .summary-value {
                font-size: 13px;
                color: var(--text-primary, #333);
                word-break: break-word;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
                margin-bottom: 14px;
            }

            .form-label {
                font-size: 11px;
                font-weight: 600;
                color: var(--text-secondary, #666);
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }

            .form-label .required {
                color: #cc0000;
                margin-left: 4px;
            }

            textarea,
            input[type="text"],
            input[type="number"] {
                width: 100%;
                padding: 8px 10px;
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 4px;
                font-size: 13px;
                font-family: inherit;
                box-sizing: border-box;
                background: var(--bg-primary, #fff);
                color: var(--text-primary, #333);
            }

            textarea {
                min-height: 90px;
                resize: vertical;
            }

            textarea.error {
                border-color: #cc0000;
            }

            .error-text {
                font-size: 11px;
                color: #cc0000;
            }

            .checkbox-group {
                display: grid;
                gap: 8px;
                padding: 10px 0;
            }

            .checkbox-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: var(--text-primary, #333);
            }

            .checkbox-item input {
                accent-color: var(--accent-color, #2196f3);
            }

            .disclaimer-block {
                display: grid;
                gap: 8px;
                padding: 10px 12px;
                border: 1px solid var(--border-color, #dcdcdc);
                border-radius: 8px;
                background: var(--bg-secondary, #f7f7f7);
            }

            .disclaimer-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }

            .disclaimer-toggle {
                background: none;
                border: none;
                padding: 0;
                color: var(--accent-color, #2196f3);
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
            }

            .disclaimer-toggle[disabled] {
                color: var(--text-secondary, #666);
                cursor: not-allowed;
            }

            .disclaimer-body {
                font-size: 12px;
                color: var(--text-primary, #333);
                line-height: 1.5;
            }

            .disclaimer-links {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .disclaimer-links a {
                font-size: 12px;
                color: var(--accent-color, #2196f3);
                text-decoration: none;
                font-weight: 600;
            }

            .disclaimer-links a:hover {
                text-decoration: underline;
            }

            .hint {
                font-size: 11px;
                color: var(--text-secondary, #666);
            }

            .theme-step {
                padding: 20px;
                display: grid;
                gap: 18px;
            }

            .theme-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 12px;
            }

            .theme-option {
                display: grid;
                grid-template-columns: auto 1fr;
                gap: 10px;
                align-items: start;
                padding: 14px;
                border: 1px solid var(--border-color, #dcdcdc);
                border-radius: 8px;
                background: var(--bg-primary, #fff);
                cursor: pointer;
            }

            .theme-option.selected {
                border-color: var(--accent-color, #2196f3);
                background: rgba(33, 150, 243, 0.08);
            }

            .theme-option input {
                margin-top: 2px;
                accent-color: var(--accent-color, #2196f3);
            }

            .theme-option-copy {
                display: grid;
                gap: 6px;
            }

            .theme-option-title {
                font-size: 13px;
                font-weight: 700;
                color: var(--text-primary, #333);
            }

            .theme-option-description {
                font-size: 12px;
                line-height: 1.45;
                color: var(--text-secondary, #666);
            }

            .screens-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 12px;
                margin-bottom: 16px;
            }

            .screen-card {
                border: 1px solid var(--border-color, #dcdcdc);
                border-radius: 8px;
                padding: 8px;
                background: #fff;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .screen-card img {
                width: 100%;
                height: auto;
                border-radius: 6px;
                border: 1px solid rgba(0, 0, 0, 0.05);
                background: #f5f5f5;
            }

            .screen-label {
                font-size: 11px;
                font-weight: 600;
                color: var(--text-secondary, #666);
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }

            .screen-missing {
                font-size: 12px;
                color: #b71c1c;
                padding: 10px;
                border: 1px dashed rgba(183, 28, 28, 0.4);
                border-radius: 6px;
                text-align: center;
            }

            .range-row {
                display: grid;
                grid-template-columns: 1fr 120px;
                gap: 12px;
                align-items: center;
            }

            .range-row input[type="range"] {
                width: 100%;
            }

            .error-banner {
                margin-bottom: 12px;
                padding: 8px 10px;
                border-radius: 6px;
                background: rgba(211, 47, 47, 0.1);
                color: #b71c1c;
                font-size: 12px;
            }

            @media (max-width: 900px) {
                .step-layout {
                    grid-template-columns: 1fr;
                    overflow: auto;
                }
            }
        `],Nn([tt({type:String})],Vn.prototype,"cardId",2),Nn([tt({type:String})],Vn.prototype,"cardName",2),Nn([tt({type:String})],Vn.prototype,"description",2),Nn([tt({attribute:!1})],Vn.prototype,"cardConfig",2),Nn([tt({attribute:!1})],Vn.prototype,"hass",2),Nn([tt({type:Boolean})],Vn.prototype,"shared",2),Nn([tt({type:Boolean})],Vn.prototype,"busy",2),Nn([tt({type:String})],Vn.prototype,"error",2),Nn([st()],Vn.prototype,"descriptionDraft",2),Nn([st()],Vn.prototype,"changeNotes",2),Nn([st()],Vn.prototype,"changeReasons",2),Nn([st()],Vn.prototype,"updateReasonOptions",2),Nn([st()],Vn.prototype,"updateReasonLoading",2),Nn([st()],Vn.prototype,"updateReasonError",2),Nn([st()],Vn.prototype,"stepIndex",2),Nn([st()],Vn.prototype,"containers",2),Nn([st()],Vn.prototype,"themeSupport",2),Nn([st()],Vn.prototype,"snapshots",2),Nn([st()],Vn.prototype,"snapshotting",2),Nn([st()],Vn.prototype,"snapshotError",2),Nn([st()],Vn.prototype,"containerWidthPercents",2),Nn([st()],Vn.prototype,"containerScales",2),Nn([st()],Vn.prototype,"shareDisclaimer",2),Nn([st()],Vn.prototype,"shareDisclaimerLoading",2),Nn([st()],Vn.prototype,"shareDisclaimerError",2),Nn([st()],Vn.prototype,"shareDisclaimerAccepted",2),Nn([st()],Vn.prototype,"shareDisclaimerExpanded",2),Nn([st(),xt({context:ce})],Vn.prototype,"previewThemeMode",2),Nn([st(),xt({context:Ae})],Vn.prototype,"previewRenderScale",2),Vn=Nn([rt("marketplace-card-share-dialog")],Vn);var Un=Object.defineProperty,jn=Object.getOwnPropertyDescriptor,Wn=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?jn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Un(t,i,a),a};const Gn="editor-settings-changed",Hn="editor-settings-set-default",qn="editor-settings-reset-default";let Yn=class extends es{constructor(){super(...arguments),this.savingDefault=!1,this.backgroundSelection="default",this.backgroundColor="#e8e8e8",this.backgroundValue="",this._handleBackgroundSelectionChange=e=>{const t=e.target;this.backgroundSelection=t.value,this._emitSettingsChange()},this._handleColorChange=e=>{var t;this.backgroundColor=(null==(t=e.detail)?void 0:t.value)||this.backgroundColor,this._emitSettingsChange()},this._handleValueChange=e=>{this.backgroundValue=e.target.value,this._emitSettingsChange()},this._handleSetDefault=()=>{const e=this._buildBackgroundOption();e&&this.eventBus.dispatchEvent(Hn,{settings:{options:{background:e}}})},this._handleResetDefault=()=>{this.eventBus.dispatchEvent(qn,{settings:void 0})}}get dialogTitle(){return"Editor settings"}get dialogSubtitle(){return"Configure this card editor"}updated(e){super.updated(e),e.has("open")&&this.open&&this._loadSettings(),e.has("settings")&&this.open&&this._loadSettings()}renderDialogBody(){return ot`
            <div class="settings-body">
                <div class="setting-row">
                    <label class="setting-label" for="background-mode">Editor background</label>
                    <div class="setting-control-line">
                        <select
                            id="background-mode"
                            .value=${this.backgroundSelection}
                            @change=${this._handleBackgroundSelectionChange}
                        >
                            <option value="default">Use default</option>
                            <option value="color">Custom color</option>
                            <option value="value">Custom value</option>
                        </select>
                        ${this._renderResetDefaultButton()}
                    </div>
                </div>
                ${this._renderBackgroundValueControl()}
            </div>
        `}renderDialogFooter(){return ot`
            <div class="dialog-footer">
                <div class="footer-spacer"></div>
                <button class="primary-btn" @click=${this.handleClose}>Done</button>
            </div>
        `}_renderBackgroundValueControl(){return"color"===this.backgroundSelection?ot`
                <div class="setting-row">
                    <label class="setting-label">Custom color</label>
                    <div class="setting-control-line">
                        <sm-color-input
                            .value=${this.backgroundColor}
                            @change=${this._handleColorChange}
                        ></sm-color-input>
                        ${this._renderSetDefaultButton()}
                    </div>
                </div>
            `:"value"===this.backgroundSelection?ot`
                <div class="setting-row">
                    <label class="setting-label" for="background-value">Custom CSS background value</label>
                    <div class="setting-control-line">
                        <textarea
                            id="background-value"
                            .value=${this.backgroundValue}
                            @input=${this._handleValueChange}
                            placeholder="linear-gradient(135deg, #20242c, #3a4252)"
                        ></textarea>
                        ${this._renderSetDefaultButton()}
                    </div>
                </div>
            `:dt}_renderSetDefaultButton(){return ot`
            <button
                class="default-button"
                title="Set as editor default"
                ?disabled=${this.savingDefault||!this._buildBackgroundOption()}
                @click=${this._handleSetDefault}
            >
                <ha-icon icon="mdi:content-save-cog-outline"></ha-icon>
            </button>
        `}_renderResetDefaultButton(){return"default"===this.backgroundSelection&&this._hasGlobalBackground()?ot`
            <button
                class="default-button"
                title="Reset editor default"
                ?disabled=${this.savingDefault}
                @click=${this._handleResetDefault}
            >
                <ha-icon icon="mdi:restore"></ha-icon>
            </button>
        `:dt}_loadSettings(){var e,t;const i=null==(t=null==(e=this.settings)?void 0:e.options)?void 0:t.background;if(i)return"color"===i.mode?(this.backgroundSelection="color",void(this.backgroundColor=i.color||this.backgroundColor)):void("value"===i.mode&&(this.backgroundSelection="value",this.backgroundValue=i.value||""));this.backgroundSelection="default"}_emitSettingsChange(){const e=this._buildBackgroundOption(),t=e?{options:{background:e}}:void 0;this.eventBus.dispatchEvent(Gn,{settings:t})}_buildBackgroundOption(){if("color"===this.backgroundSelection){const e=this.backgroundColor.trim();return e?{mode:"color",color:e}:void 0}if("value"===this.backgroundSelection){const e=this.backgroundValue.trim();return e?{mode:"value",value:e}:void 0}}_hasGlobalBackground(){var e,t;return Boolean(null==(t=null==(e=this.globalSettings)?void 0:e.options)?void 0:t.background)}};Yn.styles=[...es.styles,et`
            :host {
                --overlay-dialog-width: min(92vw, 520px);
                --overlay-dialog-height: auto;
            }

            .dialog-body {
                overflow: visible;
            }

            .settings-body {
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 18px;
            }

            .setting-row {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .setting-label {
                font-size: 12px;
                font-weight: 600;
                color: var(--text-primary, #333);
            }

            .setting-control-line {
                display: flex;
                align-items: stretch;
                gap: 8px;
            }

            select,
            textarea {
                flex: 1;
                min-width: 0;
                width: 100%;
                box-sizing: border-box;
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 4px;
                background: var(--bg-primary, #fff);
                color: var(--text-primary, #333);
                font: inherit;
                font-size: 13px;
            }

            select {
                padding: 8px 10px;
            }

            textarea {
                min-height: 96px;
                padding: 10px;
                resize: vertical;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                line-height: 1.4;
            }

            select:focus,
            textarea:focus {
                outline: none;
                border-color: var(--accent-color, #0078d4);
            }

            sm-color-input {
                flex: 1;
            }

            .default-button {
                width: 34px;
                min-width: 34px;
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 4px;
                background: var(--bg-primary, #fff);
                color: var(--text-primary, #333);
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                --mdc-icon-size: 18px;
            }

            .default-button:hover:not(:disabled) {
                color: var(--accent-color, #0078d4);
                border-color: var(--accent-color, #0078d4);
            }

            .default-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `],Wn([tt({attribute:!1})],Yn.prototype,"settings",2),Wn([tt({attribute:!1})],Yn.prototype,"globalSettings",2),Wn([tt({type:Boolean})],Yn.prototype,"savingDefault",2),Wn([pt({context:d})],Yn.prototype,"eventBus",2),Wn([st()],Yn.prototype,"backgroundSelection",2),Wn([st()],Yn.prototype,"backgroundColor",2),Wn([st()],Yn.prototype,"backgroundValue",2),Yn=Wn([rt("editor-settings-dialog")],Yn);var Xn=Object.defineProperty,Kn=Object.getOwnPropertyDescriptor,Jn=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?Kn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Xn(t,i,a),a};let Qn=class extends it{constructor(){super(...arguments),this.cardName="",this.cardDescription="",this.loading=!1,this.saving=!1,this.isDirty=!1,this.migrationRequired=!1,this.migrationInProgress=!1,this.error=null,this.accountConnected=!1,this.shareDialogOpen=!1,this.editorSettingsDialogOpen=!1,this.editorSettingsDefaultSaving=!1,this.sharing=!1,this.shareDeclarationSaving=!1,this.shareError=null,this.marketplaceShared=!1,this.localCardVersion=null,this.marketplaceSharedVersion=null,this.marketplaceVersionLoading=!1,this.marketplaceDownloaded=!1,this.marketplaceId=null,this.shareDialogConfig=null,this.router=js(),this.pendingMigrationConfig=null,this.accountLoaded=!1,this.cardMeta=null,this.marketplaceVersionRequestId=0,this.editorSettingsEventUnsubscribers=[],this._handleShare=()=>{this._getShareDisabledReason()||this.sharing||(this.shareError=null,this.shareDialogConfig=this._getConfigFromBuilder(),this.shareDialogOpen=!0)},this._closeShareDialog=()=>{this.sharing||this.shareDeclarationSaving||(this.shareDialogOpen=!1,this.shareError=null,this.shareDialogConfig=null)},this._handleShareThemeSupportDeclared=async e=>{await this._persistShareThemeSupport(e.detail.themeSupport)},this._openEditorSettings=()=>{this.migrationRequired||(this.editorSettingsDialogOpen=!0)},this._handleEditorSettingsChanged=e=>{const t=JSON.stringify(this._getEditorSettingsFromBuilder()??null);this._setEditorSettingsOnBuilder(null==e?void 0:e.settings);t!==JSON.stringify(this._getEditorSettingsFromBuilder()??null)&&this._markDirty()},this._handleSetEditorDefault=async e=>{if(!this.editorSettingsService||this.editorSettingsDefaultSaving)return;const t=null==e?void 0:e.settings;if(t){this.editorSettingsDefaultSaving=!0,this.error=null;try{this.globalEditorSettings=await this.editorSettingsService.updateSettings(t),this._getEditorSettingsFromBuilder()&&(this._setEditorSettingsOnBuilder(void 0),this._markDirty())}catch(i){console.error("Failed to save editor default settings:",i),this.error="Failed to save editor settings. Please try again."}finally{this.editorSettingsDefaultSaving=!1}}},this._handleResetEditorDefault=async e=>{if(this.editorSettingsService&&!this.editorSettingsDefaultSaving){this.editorSettingsDefaultSaving=!0,this.error=null;try{this.globalEditorSettings=await this.editorSettingsService.updateSettings(null==e?void 0:e.settings)}catch(t){console.error("Failed to reset editor default settings:",t),this.error="Failed to reset editor settings. Please try again."}finally{this.editorSettingsDefaultSaving=!1}}}}connectedCallback(){if(super.connectedCallback(),this._subscribeEditorSettingsEvents(),this.hass){if(this.accountService=Me(this.hass),this.accountLoaded||(this.accountLoaded=!0,this._loadAccountStatus()),this.cardsService=Pe(this.hass),this.editorSettingsService=Le(this.hass),this._loadGlobalEditorSettings(),!this.cardId)return void this._handleMissingCardId();this._loadCard()}}disconnectedCallback(){super.disconnectedCallback(),this.configChangeListener&&this.builderRef&&this.builderRef.removeEventListener("config-changed",this.configChangeListener),this._clearDocumentModel(),this._unsubscribeEditorSettingsEvents()}updated(e){if(this._subscribeEditorSettingsEvents(),e.has("hass")&&this.hass&&!this.cardsService){if(this.cardsService=Pe(this.hass),this.editorSettingsService=Le(this.hass),this._loadGlobalEditorSettings(),!this.cardId)return void this._handleMissingCardId();this._loadCard()}if(e.has("hass")&&this.hass&&!this.accountService&&(this.accountService=Me(this.hass),this.accountLoaded=!0,this._loadAccountStatus()),e.has("cardId")){if(!this.cardId)return void this._handleMissingCardId();this._loadCard()}}firstUpdated(){this.configChangeListener=e=>{"load"!==e.detail.action&&this._markDirty()},this.builderRef&&this.builderRef.addEventListener("config-changed",this.configChangeListener)}render(){return ot`
      ${this.error?this._renderError():""}
      ${this._renderHeader()}
      <div class="builder-container">
        <builder-main
          .theme=${this._getTheme()}
          .hass=${this.hass}
          .globalEditorSettings=${this.globalEditorSettings}
        ></builder-main>
        ${this.loading?this._renderLoading():""}
        ${this.migrationRequired?this._renderMigrationOverlay():""}
      </div>
      <marketplace-card-share-dialog
        .open=${this.shareDialogOpen}
        .hass=${this.hass}
        .cardId=${this.cardId??""}
        .cardName=${this.cardName}
        .description=${this.cardDescription}
        .cardConfig=${this.shareDialogConfig??void 0}
        .shared=${this.marketplaceShared}
        .busy=${this.sharing||this.shareDeclarationSaving}
        .error=${this.shareError}
        @overlay-close=${this._closeShareDialog}
        @theme-support-declared=${this._handleShareThemeSupportDeclared}
        @share-confirm=${this._handleShareConfirm}
      ></marketplace-card-share-dialog>
      <editor-settings-dialog
        .open=${this.editorSettingsDialogOpen}
        .settings=${this._getEditorSettingsFromBuilder()}
        .globalSettings=${this.globalEditorSettings}
        .savingDefault=${this.editorSettingsDefaultSaving}
        @overlay-close=${()=>{this.editorSettingsDialogOpen=!1}}
      ></editor-settings-dialog>
    `}_renderHeader(){const e=this._getShareDisabledReason(),t=Boolean(e)||this.sharing||this.shareDeclarationSaving,i=e??(this.marketplaceShared?"Upload a new version to the marketplace":"Share the card to marketplace"),o=this.marketplaceShared?"Share Update":"Share Card";return ot`
      <div class="editor-header">
        <button class="back-button" @click=${this._handleBack} title="Back to cards">
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </button>

        <button
          class="settings-button"
          @click=${this._openEditorSettings}
          title="Editor settings"
          ?disabled=${this.migrationRequired}
        >
          <ha-icon icon="mdi:cog-outline"></ha-icon>
        </button>

        <input type="text"
          class="name-input ${this.isDirty?"dirty":""}"
          .value=${this.cardName}
          @input=${this._handleNameChange}
          placeholder="Card name"
          ?disabled=${this.migrationRequired}
        />

        <div class="header-actions">
          ${this.isDirty?ot`<div class="dirty-indicator" title="Unsaved changes"></div>`:""}
          
          <button
            class="save-button"
            @click=${this._handleSave}
            ?disabled=${this.saving||!this.isDirty||this.migrationRequired}
          >
            ${this.saving?ot`
              <div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>
            `:""}
            ${this.saving?"Saving...":"Save"}
          </button>

          <button
            class="share-button"
            @click=${this._handleShare}
            ?disabled=${t}
            title=${i}
          >
            <ha-icon icon="mdi:cloud-upload"></ha-icon>
            ${this.sharing?"Uploading...":o}
          </button>

          <button
            class="close-button"
            @click=${this._handleClose}
            title="Close"
          >
              <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      </div>
    `}_renderError(){return ot`
      <div class="error-banner">
        <div class="error-text">
          <strong>Error:</strong> ${this.error}
        </div>
        <button class="dismiss-button" @click=${()=>this.error=null}>
          Dismiss
        </button>
      </div>
    `}_renderLoading(){return ot`
      <div class="loading-overlay">
        <div class="loading-content">
          <div class="spinner"></div>
          <div class="loading-text">Loading card...</div>
        </div>
      </div>
    `}_renderMigrationOverlay(){return ot`
      <div class="migration-overlay">
        <div class="migration-content">
          <h3 class="migration-title">Migration Required</h3>
          <div class="migration-text">
            This card uses an older data format and must be migrated before it can be edited.
          </div>
          <div class="migration-version">
            Current version: v${this.pendingMigrationConfig.version||"unknown"} -> Target version: v${Ne}
          </div>
          <div class="migration-actions">
            <button
              class="primary-button"
              @click=${this._handleMigrateCard}
              ?disabled=${this.migrationInProgress}
            >
              ${this.migrationInProgress?"Migrating...":"Migrate Card"}
            </button>
          </div>
        </div>
      </div>
    `}_getTheme(){return o(this.hass)}async _loadAccountStatus(){if(this.hass)try{const e=Me(this.hass);await e.getAccount(),this.accountConnected=!0,this.marketplaceShared&&this.marketplaceId&&this._refreshMarketplaceSharedVersion()}catch{this.accountConnected=!1}}async _loadGlobalEditorSettings(){if(this.editorSettingsService)try{this.globalEditorSettings=await this.editorSettingsService.getSettings()}catch(e){console.error("Failed to load editor settings:",e)}}async _loadCard(){if(this.cardId&&this.cardsService){this.loading=!0,this.error=null,this.migrationRequired=!1,this.pendingMigrationConfig=null;try{const e=await this.cardsService.getCard(this.cardId);if(e){if(this.cardName=e.name,this.cardDescription=e.description,this.localCardVersion="number"==typeof e.version?e.version:null,this.marketplaceDownloaded=Boolean(e.marketplace_download),this.marketplaceId="string"==typeof e.marketplace_id&&e.marketplace_id.trim()?e.marketplace_id.trim():null,this.marketplaceShared=Boolean(this.marketplaceId)&&!this.marketplaceDownloaded,this.marketplaceSharedVersion=null,this.marketplaceVersionLoading=!1,this.cardMeta=e.meta??null,this.isDirty=!1,this.marketplaceShared&&this.accountConnected&&this._refreshMarketplaceSharedVersion(),Oe(e.config))return this.migrationRequired=!0,this.pendingMigrationConfig=e.config,void this._clearDocumentModel();await this.updateComplete,this.builderRef&&"function"==typeof this.builderRef.loadConfig&&this.builderRef.loadConfig(e.config)}else this.error="Card not found",this.router.navigate(Fs.CARDS)}catch(e){console.error("Failed to load card:",e),this.error="Failed to load card. Please try again."}finally{this.loading=!1}}}async _handleMigrateCard(){if(this.cardId&&this.cardsService&&this.pendingMigrationConfig){this.migrationInProgress=!0,this.error=null;try{const{config:e}=we(this.pendingMigrationConfig);await this.cardsService.updateCard(this.cardId,{config:e,min_builder_version:fe.getRequiredBuilderVersionForDocument(e)}),this.migrationRequired=!1,this.pendingMigrationConfig=null,await this._loadCard()}catch(e){console.error("Failed to migrate card:",e),this.error="Failed to migrate card. Please try again."}finally{this.migrationInProgress=!1}}}async _handleSave(){if(this.cardsService&&this.cardId&&!this.saving&&!this.migrationRequired){this.saving=!0,this.error=null;try{const e=this._getConfigFromBuilder(),t=fe.getRequiredBuilderVersionForDocument(e),i=await this.cardsService.updateCard(this.cardId,{name:this.cardName,description:this.cardDescription,config:e,min_builder_version:t});this.localCardVersion="number"==typeof(null==i?void 0:i.version)?i.version:this.localCardVersion,this.isDirty=!1}catch(e){console.error("Failed to save card:",e),this.error="Failed to save card. Please try again."}finally{this.saving=!1}}}_getShareDisabledReason(){if(!this.cardId)return"Card ID missing. Reopen the editor from the cards list.";if(!this.accountConnected)return"Create an account to share in the marketplace.";if(this.marketplaceDownloaded)return"This card was downloaded from the marketplace and cannot be updated.";if(this.isDirty)return"Save your changes before sharing.";if(this.migrationRequired)return"Complete the migration before sharing.";if(this.saving||this.loading)return"Please wait until the card is saved.";if(this.marketplaceShared){if(this.marketplaceVersionLoading)return"Checking marketplace version...";if("number"!=typeof this.localCardVersion)return"Unable to determine local card version.";if("number"!=typeof this.marketplaceSharedVersion)return"Unable to verify marketplace version.";if(this.localCardVersion===this.marketplaceSharedVersion)return`No updates to upload (v${this.localCardVersion}).`;if(this.localCardVersion<this.marketplaceSharedVersion)return`Local version is behind marketplace (local v${this.localCardVersion}, marketplace v${this.marketplaceSharedVersion}).`}return null}async _refreshMarketplaceSharedVersion(){var e;if(!(this.accountService&&this.accountConnected&&this.cardId&&this.marketplaceShared))return this.marketplaceSharedVersion=null,void(this.marketplaceVersionLoading=!1);const t=++this.marketplaceVersionRequestId;this.marketplaceVersionLoading=!0;try{const i=await this.accountService.listMarketplaceCardsShared({local_ids:[this.cardId],per_page:1});if(t!==this.marketplaceVersionRequestId)return;const o=((null==i?void 0:i.data)??[]).find(e=>(null==e?void 0:e.id)===this.marketplaceId)??(null==(e=null==i?void 0:i.data)?void 0:e[0]);this.marketplaceSharedVersion="number"==typeof(null==o?void 0:o.version)?o.version:null}catch(i){if(t!==this.marketplaceVersionRequestId)return;console.error("Failed to load marketplace shared version:",i),this.marketplaceSharedVersion=null}finally{t===this.marketplaceVersionRequestId&&(this.marketplaceVersionLoading=!1)}}async _persistShareThemeSupport(e){if(!this.cardsService||!this.cardId)return null;const t=this.shareDialogConfig??this._getConfigFromBuilder();if(t.themeSupport===e)return t;const i={...t,themeSupport:e};this.shareDeclarationSaving=!0,this.shareError=null;try{const t=await this.cardsService.updateCard(this.cardId,{config:i,min_builder_version:fe.getRequiredBuilderVersionForDocument(i)});return this.localCardVersion="number"==typeof(null==t?void 0:t.version)?t.version:this.localCardVersion,this.shareDialogConfig=i,this.builderRef&&"function"==typeof this.builderRef.setThemeSupport&&this.builderRef.setThemeSupport(e),this.isDirty=!1,i}catch(o){return console.error("Failed to save theme support declaration:",o),this.shareError="Failed to save the theme support declaration. Please try again.",null}finally{this.shareDeclarationSaving=!1}}_buildMarketplaceMeta(e,t){if(!e&&0===t.length)return this.cardMeta??null;return{...this.cardMeta&&"object"==typeof this.cardMeta?this.cardMeta:{},marketplace_update:{notes:e||void 0,reasons:t.length?t:void 0}}}async _handleShareConfirm(e){if(!this.accountService||!this.cardsService||!this.cardId||this.sharing)return;const t=e.detail||{},i=t.themeSupport;if(!i)return void(this.shareError="Select the theme support declaration before sharing.");const o="string"==typeof t.description?t.description.trim():"",r="string"==typeof t.updateNotes?t.updateNotes.trim():"",a=Array.isArray(t.updateReasons)?t.updateReasons.map(e=>"number"==typeof e&&Number.isFinite(e)?e:"string"==typeof e&&e.trim().match(/^\d+$/)?Number(e.trim()):null).filter(e=>"number"==typeof e&&Number.isFinite(e)):[],s=Array.isArray(t.categoryIds)?t.categoryIds.filter(e=>"string"==typeof e&&e.trim()):null,n=Array.isArray(t.screens)?t.screens.filter(e=>e&&"string"==typeof e.containerId&&"string"==typeof e.dataUrl):null;this.sharing=!0,this.shareError=null;try{if(!(await this._persistShareThemeSupport(i)))return;const e={};let t=!1;const l=o&&o!==this.cardDescription?o:null,d=this.marketplaceShared?this._buildMarketplaceMeta(r,a):null,c=!this.marketplaceShared&&s?s:null;if(l&&(e.description=l,t=!0),d&&JSON.stringify(d)!==JSON.stringify(this.cardMeta??{})&&(e.meta=d,t=!0),c&&(e.categories=c,t=!0),t){const t=await this.cardsService.updateCard(this.cardId,e);this.localCardVersion="number"==typeof(null==t?void 0:t.version)?t.version:this.localCardVersion,l&&(this.cardDescription=l),e.meta&&(this.cardMeta=e.meta)}const p=await this.accountService.uploadMarketplaceCard(this.cardId,{screens:n?n.map(e=>({container_id:e.containerId,data_url:e.dataUrl,width:e.width,height:e.height,card_width_percent:e.cardWidthPercent,card_scale:e.cardScale,theme_mode:e.themeMode??""})):void 0,updateNotes:this.marketplaceShared&&r?r:void 0,updateReasons:this.marketplaceShared&&a.length?a:void 0,themeSupport:i});this.marketplaceShared||(this.marketplaceId=p.marketplace_id,this.marketplaceShared=!0,this.marketplaceDownloaded=!1),"number"==typeof this.localCardVersion?this.marketplaceSharedVersion=this.localCardVersion:this.marketplaceShared&&this.marketplaceId&&this._refreshMarketplaceSharedVersion(),this.shareDialogOpen=!1,this.shareDialogConfig=null}catch(l){console.error("Failed to share card:",l),this.shareError=this._getErrorMessage(l)}finally{this.sharing=!1}}_getConfigFromBuilder(){return this.builderRef&&"function"==typeof this.builderRef.exportConfig?this.builderRef.exportConfig():(new me).exportToConfig()}_getEditorSettingsFromBuilder(){if(this.builderRef&&"function"==typeof this.builderRef.getEditorSettings)return this.builderRef.getEditorSettings()}_subscribeEditorSettingsEvents(){!this.eventBus||this.editorSettingsEventUnsubscribers.length>0||(this.editorSettingsEventUnsubscribers=[this.eventBus.addEventListener(Gn,this._handleEditorSettingsChanged),this.eventBus.addEventListener(Hn,this._handleSetEditorDefault),this.eventBus.addEventListener(qn,this._handleResetEditorDefault)])}_unsubscribeEditorSettingsEvents(){this.editorSettingsEventUnsubscribers.forEach(e=>e()),this.editorSettingsEventUnsubscribers=[]}_setEditorSettingsOnBuilder(e){this.builderRef&&"function"==typeof this.builderRef.setEditorSettings&&this.builderRef.setEditorSettings(e)}_handleNameChange(e){const t=e.target;this.cardName=t.value,this._markDirty()}_markDirty(){this.isDirty||(this.isDirty=!0)}_handleBack(){this.isDirty?this._showUnsavedChangesDialog():this.router.navigate(Fs.CARDS)}_handleClose(){this.isDirty?this._showUnsavedChangesDialog():this.router.navigate(Fs.CARDS)}_showUnsavedChangesDialog(){confirm("You have unsaved changes. Are you sure you want to leave?")&&this.router.navigate(Fs.CARDS)}_clearDocumentModel(){this.builderRef&&"function"==typeof this.builderRef.clearDocument&&this.builderRef.clearDocument()}_handleMissingCardId(){this.error="Card ID is missing. Open a card from the list.",this._clearDocumentModel(),this.router.navigate(Fs.CARDS)}_getErrorMessage(e){if(!e)return"Operation failed.";if("string"==typeof e)return e;if("object"==typeof e){const t=e;if(t.message)return t.message;if(t.code)return t.code}return"Operation failed."}};Qn.styles=et`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: var(--primary-background-color);
    }

    .editor-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
      flex-shrink: 0;
    }

    .back-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: var(--primary-text-color);
      border-radius: 4px;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .back-button:hover {
      background-color: var(--secondary-background-color);
    }

    .settings-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: var(--primary-text-color);
      border-radius: 4px;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .settings-button:hover:not(:disabled) {
      background-color: var(--secondary-background-color);
    }

    .settings-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .icon {
      width: 24px;
      height: 24px;
    }

    .name-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 500;
      font-family: inherit;
      min-width: 200px;
    }

    .name-input:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .name-input.dirty {
      border-color: var(--warning-color);
    }

    .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .save-button {
      padding: 12px 20px;
      background: var(--primary-color);
      color: var(--text-primary-color, white);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: opacity 0.2s ease;
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .save-button:hover:not(:disabled) {
      opacity: 0.9;
    }

    .save-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .share-button {
      padding: 7px 16px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: opacity 0.2s ease;
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .share-button:hover:not(:disabled) {
      opacity: 0.9;
    }

    .share-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .close-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: var(--primary-text-color);
      border-radius: 4px;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-button:hover {
      background-color: var(--secondary-background-color);
    }

    .dirty-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--warning-color);
    }

    .builder-container {
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    builder-main {
      width: 100%;
      height: 100%;
    }

    /* Loading State */
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    .loading-content {
      background: var(--card-background-color);
      padding: 32px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .migration-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 110;
    }

    .migration-content {
      background: var(--card-background-color);
      padding: 28px;
      border-radius: 10px;
      max-width: 520px;
      width: 90%;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .migration-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin: 0;
    }

    .migration-text {
      color: var(--primary-text-color);
      line-height: 1.5;
      font-size: 14px;
    }

    .migration-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    .migration-version {
      font-size: 12px;
      color: var(--secondary-text-color);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--divider-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .loading-text {
      color: var(--primary-text-color);
      font-size: 14px;
    }

    /* Error Message */
    .error-banner {
      background: var(--error-color);
      color: white;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .error-text {
      flex: 1;
    }

    .dismiss-button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px 8px;
      font-size: 14px;
      text-decoration: underline;
    }

    /* Confirm Dialog */
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog {
      background: var(--card-background-color);
      border-radius: 8px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .dialog-header {
      font-size: 20px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin: 0 0 16px 0;
    }

    .dialog-content {
      color: var(--primary-text-color);
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    .secondary-button {
      padding: 10px 20px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: opacity 0.2s ease;
      font-family: inherit;
    }

    .secondary-button:hover {
      opacity: 0.8;
    }

    .primary-button {
      padding: 10px 20px;
      background: var(--primary-color);
      color: var(--text-primary-color, white);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: opacity 0.2s ease;
      font-family: inherit;
    }

    .primary-button:hover {
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .editor-header {
        flex-wrap: wrap;
      }

      .name-input {
        min-width: 150px;
        font-size: 14px;
      }
    }
  `,Jn([tt({attribute:!1})],Qn.prototype,"hass",2),Jn([tt({type:String})],Qn.prototype,"cardId",2),Jn([pt({context:d})],Qn.prototype,"eventBus",2),Jn([st()],Qn.prototype,"cardName",2),Jn([st()],Qn.prototype,"cardDescription",2),Jn([st()],Qn.prototype,"loading",2),Jn([st()],Qn.prototype,"saving",2),Jn([st()],Qn.prototype,"isDirty",2),Jn([st()],Qn.prototype,"migrationRequired",2),Jn([st()],Qn.prototype,"migrationInProgress",2),Jn([st()],Qn.prototype,"error",2),Jn([st()],Qn.prototype,"accountConnected",2),Jn([st()],Qn.prototype,"shareDialogOpen",2),Jn([st()],Qn.prototype,"editorSettingsDialogOpen",2),Jn([st()],Qn.prototype,"globalEditorSettings",2),Jn([st()],Qn.prototype,"editorSettingsDefaultSaving",2),Jn([st()],Qn.prototype,"sharing",2),Jn([st()],Qn.prototype,"shareDeclarationSaving",2),Jn([st()],Qn.prototype,"shareError",2),Jn([st()],Qn.prototype,"marketplaceShared",2),Jn([st()],Qn.prototype,"localCardVersion",2),Jn([st()],Qn.prototype,"marketplaceSharedVersion",2),Jn([st()],Qn.prototype,"marketplaceVersionLoading",2),Jn([st()],Qn.prototype,"shareDialogConfig",2),Jn([nt("builder-main")],Qn.prototype,"builderRef",2),Qn=Jn([rt("editor-view")],Qn);var Zn=Object.defineProperty,el=Object.getOwnPropertyDescriptor,tl=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?el(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Zn(t,i,a),a};let il=class extends it{constructor(){super(...arguments),this.account=null,this.connected=!1,this.accountLoading=!0,this.error=null,this.info=null,this.infoError=null,this.infoLoading=!0,this.tokenValue="",this.savingToken=!1,this.tokenSuccess=!1,this.disconnecting=!1,this.priceSelection={},this.showIntegrationUpdateNotice=!1,this.integrationOutdated=!1,this.hasIntegrationToken=!1,this.hasLoaded=!1}connectedCallback(){super.connectedCallback(),this._syncIntegrationStatus(),this.unsubscribeIntegrationOutdated=Be(()=>{this._syncIntegrationStatus()}),this.unsubscribeRuntimeConfig=Re(()=>{this._syncIntegrationStatus()})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribeIntegrationOutdated&&(this.unsubscribeIntegrationOutdated(),this.unsubscribeIntegrationOutdated=void 0),this.unsubscribeRuntimeConfig&&(this.unsubscribeRuntimeConfig(),this.unsubscribeRuntimeConfig=void 0)}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this.hasLoaded&&(this.hasLoaded=!0,this._loadInfo(),this._loadAccount({silentAuthError:!0}))}render(){const e=Ve(),t=Fe(),i=this.infoLoading||this.accountLoading,o=this.integrationOutdated&&!this.hasIntegrationToken,r=this.integrationOutdated&&this.hasIntegrationToken;if(i)return ot`
                <div class="page page-loading">
                    <div class="spinner" role="status" aria-label="Loading"></div>
                </div>
            `;const a=this._getHeroCopy();return ot`
            <div class="page">
                ${this.showIntegrationUpdateNotice?ot`
                    <div class="integration-outdated-banner">
                        Your Card Builder integration is out of date. To connect your account correctly,
                        update the custom integration to the latest available version.
                    </div>
                `:dt}
                <section class="hero">
                    <div class="hero-copy">
                        <div class="eyebrow">Card Builder Account</div>
                        <h1 class="headline">${a.title}</h1>
                        <p class="subline">${a.subline}</p>
                        ${r?dt:ot`
                            <div class="cta-group">
                                ${this.connected?ot`
                                    <a class="cta primary" href=${t} target="_blank" rel="noopener">
                                        Manage Account
                                    </a>
                                `:ot`
                                    <a class="cta primary" href=${e} target="_blank" rel="noopener">
                                        Create Account
                                    </a>
                                `}
                            </div>
                        `}
                        
                        <ul class="benefits">
                            <li class="benefit-item">
                                <div class="benefit-icon">
                                    <ha-icon icon="mdi:download-box"></ha-icon>
                                </div>
                                <div>
                                    <p class="benefit-title">Download and Customize</p>
                                    <p class="benefit-text">Grab ready-made cards and adapt them fast.</p>
                                </div>
                            </li>
                            <li class="benefit-item">
                                <div class="benefit-icon">
                                    <ha-icon icon="mdi:cloud-upload"></ha-icon>
                                </div>
                                <div>
                                    <p class="benefit-title">Publish your cards</p>
                                    <p class="benefit-text">Make your creations available in the marketplace for the community.</p>
                                </div>
                            </li>
                            <li class="benefit-item">
                                <div class="benefit-icon">
                                    <ha-icon icon="mdi:numeric-positive-1"></ha-icon>
                                </div>
                                <div>
                                    <p class="benefit-title">Earn Free Download</p>
                                    <p class="benefit-text">Earn extra download slots.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                ${r?this._renderIntegrationOutdatedSection():dt}
                ${r||this.connected?dt:this._renderTokenSection({disabled:o,message:o?"Update the custom integration to the latest available version before entering a token.":null})}
                ${r?dt:this.connected?this._renderAccountSection():this._renderPromoSection()}
            </div>
        `}_getHeroCopy(){if(this.integrationOutdated)return this.hasIntegrationToken?{title:"Update required to reconnect your account.",subline:"The Card Builder integration is out of date. Update the custom integration to the latest available version to reconnect your account."}:{title:"Update required before connecting.",subline:"This Card Builder integration is out of date. Update the custom integration to the latest available version before connecting an account."};if(!this.connected)return{title:"Create an Account and Unlock the Marketplace.",subline:"Upload your cards, download community ones, and tailor them to your dashboards. Every shared download increases your Free limit."};const e=this._getAccountPlan();return this._isFreePlan(e)?{title:"Ready for more?",subline:"Upgrade your plan for unlimited downloads, advanced features, and the integrated AI agent."}:{title:`You're on ${e.name}.`,subline:"Enjoy the full toolkit and manage your subscription anytime from the console."}}_renderPromoSection(){var e;if(this.infoError)return ot`
                <section class="section">
                    <h2 class="section-title">Choose the plan that fits you</h2>
                    <p class="subline">${this.infoError}</p>
                </section>
            `;if(!this.info)return ot`
                <section class="section">
                    <h2 class="section-title">Choose the plan that fits you</h2>
                    <p class="subline">Plan information is not available.</p>
                </section>
            `;const t=(null==(e=this.info)?void 0:e.plans)??[];return ot`
            <section class="section">
                <h2 class="section-title">Choose the plan that fits you</h2>
                ${t.length>0?ot`
                    <div class="pricing-grid">
                        ${t.map(e=>this._renderPlanCard(e))}
                    </div>
                `:ot`
                    <p class="subline">No plans available at the moment.</p>
                `}
            </section>
        `}_renderPlanCard(e){var t,i,o;const r=this._buildPlanView(e),a=this._getSubscriptionPrices(e.prices),s=Boolean(a.monthly&&a.yearly),n=this.priceSelection[e.code]??"monthly",l=this._getSelectedPrice(e.prices,a,n),d=l?this._getBillingLabel(l):e.name,c=l?this._getPriceDisplay(l):{amountLabel:"--",unitLabel:null,billedAnnually:!1},p="preview"===e.status,h=(null==(i=null==(t=e.cta)?void 0:t.label)?void 0:i.trim())||"Get Started",u="string"==typeof(null==(o=e.cta)?void 0:o.link)?e.cta.link.trim():"",g=p||!u;return ot`
            <div class="pricing-card">
                ${p?ot`<div class="plan-preview-badge">Coming Soon</div>`:dt}
                <div class="pricing-label">${d}</div>
                <h3 class="pricing-title">${r.label}</h3>
                ${s?ot`
                    <div class="price-toggle">
                        <button
                            class=${"monthly"===n?"active":""}
                            @click=${()=>this._handlePriceToggle(e.code,"monthly")}
                        >
                            Monthly
                        </button>
                        <button
                            class=${"yearly"===n?"active":""}
                            @click=${()=>this._handlePriceToggle(e.code,"yearly")}
                        >
                            Yearly
                        </button>
                    </div>
                `:ot`<div class="price-toggle-placeholder"></div>`}
                <div class="pricing-price">
                    <span class="pricing-price-amount">${c.amountLabel}</span>
                    ${c.unitLabel?ot`<span class="pricing-price-unit">${c.unitLabel}</span>`:dt}
                </div>
                <div class="pricing-billing-note">
                    ${c.billedAnnually?"billed annually":ot`&nbsp;`}    
                </div>
                
                ${g?ot`<button class="cta primary plan-cta disabled" disabled>${h}</button>`:ot`<a class="cta primary plan-cta" href=${u} target="_blank" rel="noopener">${h}</a>`}
                <ul class="pricing-features">
                    ${r.features.map(e=>ot`<li>${e}</li>`)}
                </ul>
            </div>
        `}_renderAccountSection(){var e,t;const i=this.account??{},o=this._getAccountPlan(),r=!!o&&this._isFreePlan(o),a=this._getAccountValueFrom(i,["instance_name"]),s=this._getAccountNumberFrom(i,["downloads_count"]),n=this._getAccountNumberFrom(i,["download_slots"]),l=this._getAccountNumberFrom(i,["download_slots_initial"]),d=null===this._getAccountNumberFrom(i,["downloads_remaining"]),c=n??l,p=s??0,h=c&&c>0?Math.min(100,p/c*100):0,u=d?0:Math.round(h),g=d?"unlimited":h>=100?"full":h>=60?"warning":"normal",v=d?`${p}/∞`:null!==c?`${p}/${c}`:`${p}`,b=null!==c?`${u}% of ${c} downloads used.`:`${u}% of downloads used.`,m="full"===g?"You cannot download more cards.":"",f=null!==n&&null!==l?Math.max(0,n-l):0,y=0===f&&!d;return ot`
            <section class="section">
                <h2 class="section-title">Your Account</h2>
                <div class="account-grid">
                    ${o?ot`
                        <div class="account-metric">
                            <div class="account-metric-header">
                                <div class="account-metric-title">Plan</div>
                            </div>
                            <div class="account-metric-value">${o.name}</div>
                            <div class="account-metric-subline">&nbsp;</div>
                            ${r?ot`
                                <a class="cta primary" href=${null==(e=this.info)?void 0:e.urls.website_page_home} target="_blank" rel="noopener">
                                    Upgrade plan
                                </a>
                            `:""}
                        </div>
                    `:""}
                    ${a?ot`
                        <div class="account-metric">
                            <span>Instance Name</span>
                            <strong>${a}</strong>
                        </div>
                    `:""}
                    <div class="account-metric downloads ${g}">
                        <div class="account-metric-header">
                            <div class="account-metric-title">Downloads</div>
                            ${"warning"===g?ot`<ha-icon class="account-metric-icon" icon="mdi:alert-circle"></ha-icon>`:""}
                            ${"full"===g?ot`<ha-icon class="account-metric-icon full" icon="mdi:close-circle"></ha-icon>`:""}
                        </div>
                        <div class="account-metric-value">${v}</div>
                        <div class="account-metric-subline ${"full"===g?"critical":""}">
                            ${d?"Unlimited downloads":ot`${b}${m?` ${m}`:""}`}
                        </div>
                    </div>
                    <div class="account-metric">
                        <div class="account-metric-header">
                            <div class="account-metric-title">Extra Slots</div>
                        </div>
                        <div class="account-metric-value">${f}</div>
                        <div class="account-metric-subline">
                            Slots unlocked from community downloads.
                        </div>
                        ${y?ot`
                            <a class="cta primary" href=${null==(t=this.info)?void 0:t.urls.website_page_marketplace} target="_blank" rel="noopener">
                                Learn how to unlock more
                            </a>
                        `:""}
                    </div>
                </div>
                <div class="account-actions">
                    <button class="cta danger" @click=${this._handleDisconnect} ?disabled=${this.disconnecting}>
                        ${this.disconnecting?"Disconnecting...":"Disconnect"}
                    </button>
                </div>
            </section>
        `}_renderTokenSection(e){const t=Boolean(null==e?void 0:e.disabled),i=null==e?void 0:e.message;return ot`
            <section class="section token-card" id="token-section">
                <h2 class="section-title">Enter Token</h2>
                <p class="subline">
                    Paste the token generated in the Card Builder console account to link this instance.
                </p>
                ${i?ot`<div class="status-banner error">${i}</div>`:""}
                ${this.error?ot`<div class="status-banner error">${this.error}</div>`:""}
                ${this.tokenSuccess?ot`<div class="status-banner">Token saved and account linked.</div>`:""}
                <div class="token-input">
                    <input
                        type="password"
                        placeholder="Paste the authentication token here"
                        .value=${this.tokenValue}
                        @input=${this._handleTokenInput}
                        ?disabled=${t}
                    />
                    <button class="cta primary" @click=${this._handleTokenSave} ?disabled=${this.savingToken||t}>
                        ${this.savingToken?"Saving...":"Connect account"}
                    </button>
                </div>
            </section>
        `}_renderIntegrationOutdatedSection(){return ot`
            <section class="section">
                <h2 class="section-title">Update Required</h2>
                <p class="subline">
                    The Card Builder integration is out of date, so account data cannot be loaded right now.
                    Update the custom integration to the latest available version, then refresh this panel.
                </p>
            </section>
        `}_handleTokenInput(e){const t=e.target;this.tokenValue=t.value,this.error&&(this.error=null),this.tokenSuccess&&(this.tokenSuccess=!1)}async _handleTokenSave(){if(!this.hass)return;if(this.integrationOutdated&&!this.hasIntegrationToken)return void(this.error="Update the custom integration before connecting an account.");const e=this.tokenValue.trim();if(e){this.savingToken=!0,this.error=null,this.tokenSuccess=!1;try{const i=Me(this.hass);if(await i.setToken(e),this.tokenValue="",await this._loadAccount(),this.connected)try{await i.registerFingerprint()}catch(t){this.error=this._getErrorMessage(t)}this.tokenSuccess=this.connected}catch(t){this.error=this._getErrorMessage(t)}finally{this.savingToken=!1}}else this.error="Enter a valid token."}async _loadAccount(e={}){if(this.hass){this.accountLoading=!0,this.error=null;try{const e=Me(this.hass);this.account=await e.getAccount(),this.connected=!0}catch(t){this.connected=!1,this.account=null,e.silentAuthError&&this._isAuthError(t)||(this.error=this._getErrorMessage(t))}finally{this.accountLoading=!1}}}async _loadInfo(){if(this.hass){this.infoLoading=!0,this.infoError=null;try{const e=Me(this.hass);this.info=await e.getInfo()}catch(e){console.error(e),this.info=null,this.infoError="Unable to load plan details."}finally{this.infoLoading=!1}}}async _handleDisconnect(){if(!this.hass||this.disconnecting)return;if(window.confirm("Disconnect this Card Builder account from this Home Assistant instance?")){this.disconnecting=!0,this.error=null;try{const e=Me(this.hass);await e.disconnect(),this.connected=!1,this.account=null,this.tokenValue="",this.tokenSuccess=!1}catch(e){this.error=this._getErrorMessage(e)}finally{this.disconnecting=!1}}}_handlePriceToggle(e,t){this.priceSelection={...this.priceSelection,[e]:t}}_getAccountPlan(){if(!this.info)return null;const e=this._getAccountValueFrom(this.account??{},["plan_code"]);return e?this.info.plans.find(t=>t.code===e)??null:null}_isFreePlan(e){return!e.prices||0===e.prices.length||e.prices.every(e=>"free"===e.billing_type||0===e.amount)}_buildPlanView(e){return{label:e.name,features:e.features.map(e=>e.label),isDownloadLimited:null!==e.download_limit,prices:e.prices,downloadLimit:e.download_limit}}_getSubscriptionPrices(e){return{monthly:e.find(e=>"subscription"===e.billing_type&&"monthly"===e.billing_interval),yearly:e.find(e=>"subscription"===e.billing_type&&"yearly"===e.billing_interval)}}_getSelectedPrice(e,t,i){return t.monthly||t.yearly?"yearly"===i&&t.yearly?t.yearly:"monthly"===i&&t.monthly?t.monthly:t.monthly??t.yearly??null:e[0]??null}_getBillingLabel(e){return"free"===e.billing_type?"Free":"one_time"===e.billing_type?"One-time":"Subscription"}_getPriceDisplay(e){if("free"===e.billing_type||0===e.amount)return{amountLabel:"Free",unitLabel:null,billedAnnually:!1};if("subscription"===e.billing_type){const t="yearly"===e.billing_interval?e.amount/12/100:e.amount/100;return{amountLabel:new Intl.NumberFormat(void 0,{style:"currency",currency:e.currency}).format(t),unitLabel:"/ month",billedAnnually:"yearly"===e.billing_interval}}return{amountLabel:new Intl.NumberFormat(void 0,{style:"currency",currency:e.currency}).format(e.amount/100),unitLabel:null,billedAnnually:!1}}_getAccountValueFrom(e,t){for(const i of t){const t=e[i];if(null!=t){if("string"==typeof t&&t.trim())return t;if("number"==typeof t||"boolean"==typeof t)return String(t)}}return null}_getAccountNumberFrom(e,t){for(const i of t){const t=e[i];if("number"==typeof t&&Number.isFinite(t))return t;if("string"==typeof t&&t.trim()&&!Number.isNaN(Number(t)))return Number(t)}return null}_isAuthError(e){if(!e||"object"!=typeof e)return!1;const t=e;return"api_auth_failed"===t.code||!("string"!=typeof t.message||!t.message.toLowerCase().includes("token"))}_syncIntegrationStatus(){this.hasIntegrationToken=Te(),this.integrationOutdated=Boolean(Ue()),this.showIntegrationUpdateNotice=this.integrationOutdated&&!this.hasIntegrationToken}_getErrorMessage(e){if(!e)return"Operation failed.";if("string"==typeof e)return e;if("object"==typeof e){const t=e;if(t.message)return t.message;if(t.code)return t.code}return"Operation failed."}};il.styles=et`
        :host {
            --account-ink: #0c1a2a;
            --account-muted: rgba(12, 26, 42, 0.7);
            --account-accent: #ff8f3f;
            --account-accent-strong: #ff6a1f;
            --account-accent-2: #2f8cf2;
            --account-surface: rgba(255, 255, 255, 0.94);
            --account-surface-strong: #ffffff;
            --account-border: rgba(12, 26, 42, 0.12);
            --account-shadow: 0 24px 60px rgba(12, 26, 42, 0.12);
            --account-shadow-soft: 0 12px 30px rgba(12, 26, 42, 0.08);
            --account-radius: 18px;
            display: block;
            min-height: 100%;
            padding: 32px;
            background: var(--primary-background-color);
            color: var(--account-ink);
            font-family: "Space Grotesk", "Sora", "IBM Plex Sans", sans-serif;
            position: relative;
            overflow: hidden;
        }

        :host::before,
        :host::after {
            content: "";
            position: absolute;
            width: 520px;
            height: 520px;
            border-radius: 50%;
            opacity: 0.35;
            filter: blur(0);
            pointer-events: none;
        }

        :host::before {
            top: -200px;
            left: -160px;
            background: radial-gradient(circle at center, rgba(255, 143, 63, 0.6), transparent 70%);
        }

        :host::after {
            top: -220px;
            right: -180px;
            background: radial-gradient(circle at center, rgba(47, 140, 242, 0.55), transparent 70%);
        }

        .page {
            position: relative;
            z-index: 1;
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 32px;
        }

        .hero {
            animation: rise 0.5s ease both;
        }

        .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--account-muted);
            margin-bottom: 16px;
        }

        .eyebrow::before {
            content: "";
            width: 26px;
            height: 2px;
            background: linear-gradient(90deg, var(--account-accent), var(--account-accent-2));
        }

        .headline {
            font-size: clamp(28px, 4vw, 42px);
            font-weight: 600;
            margin: 0 0 12px 0;
        }

        .subline {
            font-size: 16px;
            line-height: 1.6;
            color: var(--account-muted);
            margin: 0 0 20px 0;
        }

        .cta-group {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 24px;
        }

        .cta {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            border: 1px solid transparent;
            cursor: pointer;
            text-decoration: none;
            transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
            font-family: inherit;
        }

        .cta.primary {
            background: linear-gradient(120deg, var(--account-accent), var(--account-accent-strong));
            color: #fff;
            box-shadow: 0 12px 24px rgba(255, 111, 32, 0.25);
        }

        .cta.secondary {
            background: var(--account-surface);
            color: var(--account-ink);
            border-color: var(--account-border);
            box-shadow: var(--account-shadow-soft);
        }

        .cta.ghost {
            background: transparent;
            color: var(--account-ink);
            border-color: var(--account-border);
        }

        .cta.danger {
            background: transparent;
            color: #b13b1d;
            border-color: rgba(255, 111, 32, 0.35);
        }

        .cta:hover {
            transform: translateY(-2px);
        }

        .cta:disabled,
        .cta[disabled] {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .benefits {
            display: grid;
            gap: 12px;
            margin: 0;
            padding: 0;
            list-style: none;
        }

        .benefit-item {
            display: flex;
            gap: 12px;
            padding: 12px 14px;
            background: var(--account-surface);
            border-radius: 14px;
            border: 1px solid var(--account-border);
            box-shadow: var(--account-shadow-soft);
        }

        .benefit-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            background: rgba(47, 140, 242, 0.12);
            display: grid;
            place-items: center;
            color: var(--account-accent-2);
            flex-shrink: 0;
        }

        .benefit-title {
            font-weight: 600;
            margin: 0 0 4px 0;
        }

        .benefit-text {
            margin: 0;
            color: var(--account-muted);
            font-size: 13px;
            line-height: 1.5;
        }

        .section {
            background: var(--account-surface);
            border-radius: var(--account-radius);
            padding: 24px;
            border: 1px solid var(--account-border);
            box-shadow: var(--account-shadow-soft);
            animation: rise 0.55s ease both;
        }

        .integration-outdated-banner {
            padding: 14px 18px;
            border-radius: 14px;
            border: 1px solid rgba(255, 111, 32, 0.4);
            background: rgba(255, 111, 32, 0.12);
            color: var(--account-ink);
            font-size: 14px;
            line-height: 1.5;
        }

        .section-title {
            margin: 0 0 16px 0;
            font-size: 20px;
        }

        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
        }

        .pricing-card {
            border-radius: 16px;
            padding: 20px;
            border: 1px solid var(--account-border);
            background: #fff;
            display: flex;
            flex-direction: column;
            gap: 14px;
            box-shadow: var(--account-shadow-soft);
            position: relative;
        }

        .plan-preview-badge {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            padding: 4px 10px;
            border-radius: 6px;
            background: var(--primary-color);
            color: var(--text-primary-color);
            border: 1px solid rgba(47, 140, 242, 0.35);
            font-size: 11px;
            font-weight: 700;
            line-height: 1;
            white-space: nowrap;
        }

        .pricing-card.featured {
            border-color: rgba(255, 143, 63, 0.4);
            box-shadow: 0 18px 40px rgba(255, 143, 63, 0.2);
        }

        .pricing-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            color: var(--account-muted);
        }

        .pricing-title {
            font-size: 20px;
            margin: 0;
        }

        .pricing-price {
            display: flex;
            align-items: baseline;
            gap: 6px;
        }

        .pricing-price-amount {
            font-size: 22px;
            font-weight: 600;
        }

        .pricing-price-unit {
            font-size: 12px;
            font-weight: 500;
            color: var(--account-muted);
        }

        .pricing-billing-note {
            margin-top: -6px;
            font-size: 12px;
            color: var(--account-muted);
        }

        .plan-cta.disabled {
            opacity: 0.6;
            cursor: not-allowed;
            pointer-events: none;
            transform: none;
            box-shadow: none;
        }

        .pricing-features {
            list-style: none;
            margin: 0;
            padding: 0;
            display: grid;
            gap: 10px;
            color: var(--account-muted);
            font-size: 13px;
            line-height: 1.5;
        }

        .pricing-features li::before {
            content: "-";
            margin-right: 8px;
            color: var(--account-accent-2);
        }

        .price-toggle {
            display: inline-flex;
            gap: 6px;
            padding: 4px;
            border-radius: 999px;
            background: rgba(12, 26, 42, 0.08);
            align-self: flex-start;
        }
        .price-toggle-placeholder {
            height: 34px;
        }

        .price-toggle button {
            border: none;
            background: transparent;
            padding: 6px 12px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
            color: var(--account-muted);
            cursor: pointer;
            font-family: inherit;
        }

        .price-toggle button.active {
            background: #fff;
            color: var(--account-ink);
            box-shadow: 0 6px 16px rgba(12, 26, 42, 0.12);
        }

        .token-input {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .token-input input {
            flex: 1;
            min-width: 220px;
            padding: 12px 14px;
            border-radius: 12px;
            border: 1px solid var(--account-border);
            font-size: 14px;
            font-family: inherit;
        }

        .token-input button {
            min-width: 160px;
        }

        .status-banner {
            padding: 10px 14px;
            border-radius: 12px;
            background: rgba(47, 140, 242, 0.12);
            color: var(--account-ink);
            font-size: 13px;
        }

        .status-banner.error {
            background: rgba(255, 111, 32, 0.15);
        }

        .account-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
        }

        .account-actions {
            margin-top: 18px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .account-metric {
            background: #fff;
            border-radius: 14px;
            padding: 14px;
            border: 1px solid var(--account-border);
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .account-metric span {
            display: block;
            font-size: 12px;
            color: var(--account-muted);
            text-transform: uppercase;
            letter-spacing: 0.12em;
            margin-bottom: 6px;
        }

        .account-metric strong {
            font-size: 16px;
        }

        .account-metric.downloads.warning {
            border-color: rgba(255, 143, 63, 0.45);
            background: rgba(255, 143, 63, 0.12);
        }

        .account-metric.downloads.full {
            border-color: rgba(229, 70, 70, 0.45);
            background: rgba(229, 70, 70, 0.12);
        }

        .account-metric-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .account-metric-title {
            font-size: 12px;
            color: var(--account-muted);
            text-transform: uppercase;
            letter-spacing: 0.12em;
        }

        .account-metric-value {
            font-size: 20px;
            font-weight: 600;
        }

        .account-metric-subline {
            font-size: 12px;
            color: var(--account-muted);
            line-height: 1.4;
        }

        .account-metric-subline.critical {
            color: #b13b1d;
        }

        .account-metric-icon {
            color: var(--account-accent);
        }

        .account-metric-icon.full {
            color: #c0392b;
        }

        .page-loading {
            min-height: 60vh;
            display: grid;
            place-items: center;
        }

        .spinner {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 3px solid rgba(12, 26, 42, 0.15);
            border-top-color: var(--account-accent-2);
            animation: spin 0.9s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        @keyframes rise {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 980px) {
            .hero {
                grid-template-columns: 1fr;
            }

            .pricing-grid {
                grid-template-columns: 1fr;
            }

            .pricing-card.featured {
                transform: none;
            }
        }
    `,tl([tt({attribute:!1})],il.prototype,"hass",2),tl([st()],il.prototype,"account",2),tl([st()],il.prototype,"connected",2),tl([st()],il.prototype,"accountLoading",2),tl([st()],il.prototype,"error",2),tl([st()],il.prototype,"info",2),tl([st()],il.prototype,"infoError",2),tl([st()],il.prototype,"infoLoading",2),tl([st()],il.prototype,"tokenValue",2),tl([st()],il.prototype,"savingToken",2),tl([st()],il.prototype,"tokenSuccess",2),tl([st()],il.prototype,"disconnecting",2),tl([st()],il.prototype,"priceSelection",2),tl([st()],il.prototype,"showIntegrationUpdateNotice",2),tl([st()],il.prototype,"integrationOutdated",2),tl([st()],il.prototype,"hasIntegrationToken",2),il=tl([rt("account-view")],il);const ol="CARD-BUILDER-PANEL",rl="#1976d2",al="#FFFFFF",sl="#ff7043",nl="#FFFFFF";var ll=Object.defineProperty,dl=Object.getOwnPropertyDescriptor,cl=(e,t,i,o)=>{for(var r,a=o>1?void 0:o?dl(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&ll(t,i,a),a};let pl=class extends it{constructor(){super(...arguments),this.cardsManager=new Cn,this.panelEventBus=new We,this.narrow=!1,this._isReady=!1,this._loadedHAComponents=!1,this._currentRoute=Fs.DASHBOARD,this._routeParams={},this._isFullscreen=!1,this._router=js(),this._originalDrawerWidth=null,this._handleFrontendVersionRecheck=()=>{this.hass&&this._syncFrontendVersionCheck()}}async connectedCallback(){super.connectedCallback(),window.addEventListener(Ge,this._handleFrontendVersionRecheck),await this._initialize(),this._loadFullscreenPreference(),this._router.addEventListener("route-changed",this._handleRouteChanged.bind(this));const{route:e,params:t}=this._router.getCurrentRoute();this._currentRoute=e,this._routeParams=t}disconnectedCallback(){window.removeEventListener(Ge,this._handleFrontendVersionRecheck),super.disconnectedCallback()}render(){if(this._versionCheck&&!this._versionCheck.ok)return this._renderVersionBlocked(this._versionCheck);if(!this.hass||!this._isReady)return ot``;const e=[Fs.EDITOR_CREATE,Fs.EDITOR_EDIT].includes(this._currentRoute);return ot`
      <app-layout
        .hass=${this.hass}
        .currentRoute=${this._currentRoute}
        ?hideSidebar=${e}
        ?isFullscreen=${this._isFullscreen}
        ?narrow=${this.narrow}
        @navigate=${this._handleNavigate}
        @toggle-fullscreen=${this._toggleFullscreen}
        @exit-dashboard=${this._exitToDefaultDashboard}
      >
        ${this._renderCurrentView()}
      </app-layout>
    `}async firstUpdated(e){super.firstUpdated(e),await this._loadHAComponents()}async _loadHAComponents(){this._loadedHAComponents||(customElements.get("ha-selector")||(await window.loadFragment("ha-selector"),customElements.get("ha-selector")||console.warn("Unable to load custom element: ha-selector.")),this._loadedHAComponents=!0)}async updated(e){if(super.updated(e),e.has("hass")&&this.hass){if(!this._syncFrontendVersionCheck())return;this.cardsManager.setHass(this.hass),await this._loadHAComponents()}if(e.has("narrow")){if(this.narrow&&this._isFullscreen)return void(this._isFullscreen=!1);this._applyFullscreen()}e.has("_isFullscreen")&&this._applyFullscreen()}async _initialize(){await this._waitForHass(),this._syncFrontendVersionCheck()?(await this.hass.loadFragmentTranslation("lovelace"),await this.hass.loadBackendTranslation("services"),await this._initializeRuntimeConfig(),this._isReady=!0):this._isReady=!0}async _initializeRuntimeConfig(){if(!this.hass)return;const e=He(this.hass);qe(e),Ye(e.integrationVersion),Xe();try{const e=Ke(this.hass),t=await e.getStatus();Je({hasToken:t.hasToken}),Xe()}catch(t){console.warn("[CardBuilderPanel] Failed to load account status:",t)}}async _waitForHass(){return new Promise(e=>{if(this.hass)return void e();const t=()=>{this.hass?e():setTimeout(t,50)};t()})}_loadFullscreenPreference(){if(!this.narrow){"true"===localStorage.getItem(pl.FULLSCREEN_STORAGE_KEY)&&(this._isFullscreen=!0,this._applyFullscreen())}}_applyFullscreen(){this._isFullscreen&&!this.narrow?this._hideHASidebar():this._showHASidebar()}_hideHASidebar(){const e=document.querySelector("home-assistant");if(null==e?void 0:e.shadowRoot){const t=e.shadowRoot.querySelector("home-assistant-main");if(null==t?void 0:t.shadowRoot){const e=t.shadowRoot.querySelector("ha-drawer");if(e){const t=getComputedStyle(e).getPropertyValue("--mdc-drawer-width");null===this._originalDrawerWidth&&t&&(this._originalDrawerWidth=t.trim()),e.style.setProperty("--mdc-drawer-width","0px")}}}}_showHASidebar(){const e=document.querySelector("home-assistant");if(null==e?void 0:e.shadowRoot){const t=e.shadowRoot.querySelector("home-assistant-main");if(null==t?void 0:t.shadowRoot){const e=t.shadowRoot.querySelector("ha-drawer");e&&null!==this._originalDrawerWidth&&(e.style.setProperty("--mdc-drawer-width",this._originalDrawerWidth),this._originalDrawerWidth=null)}}}_toggleFullscreen(){this.narrow||(this._isFullscreen=!this._isFullscreen,localStorage.setItem(pl.FULLSCREEN_STORAGE_KEY,String(this._isFullscreen)))}_exitToDefaultDashboard(){window.location.href="/"}_handleRouteChanged(e){const t=e;this._currentRoute=t.detail.route,this._routeParams=t.detail.params}_handleNavigate(e){const{route:t}=e.detail;this._router.navigate(t)}_renderCurrentView(){switch(this._currentRoute){case Fs.DASHBOARD:return ot`<dashboard-view .hass=${this.hass}></dashboard-view>`;case Fs.CARDS:return ot`<cards-list-view .hass=${this.hass}></cards-list-view>`;case Fs.ACCOUNT:return ot`<account-view .hass=${this.hass}></account-view>`;case Fs.EDITOR_CREATE:return ot`<editor-view .hass=${this.hass}></editor-view>`;case Fs.EDITOR_EDIT:return ot`<editor-view .hass=${this.hass} .cardId=${this._routeParams.id}></editor-view>`;default:return ot`<dashboard-view .hass=${this.hass}></dashboard-view>`}}_syncFrontendVersionCheck(){if(!this.hass)return!0;const e=Qe(this.hass);return this._isSameVersionCheck(e)||(this._versionCheck=e),e.ok}_isSameVersionCheck(e){const t=this._versionCheck;return Boolean(t&&t.ok===e.ok&&t.jsVersion===e.jsVersion&&t.runtimeVersion===e.runtimeVersion)}_renderVersionBlocked(e){const t=Ze(e);return ot`
            <div class="cache-guard-page">
                <div class="cache-guard-box">
                    <h2 class="cache-guard-title">${t.title}</h2>
                    <p class="cache-guard-message">${t.message}</p>
                    <div class="cache-guard-versions">
                        <span class="cache-guard-label">Cached JS</span>
                        <span class="cache-guard-value">${t.jsVersion}</span>
                        <span class="cache-guard-label">Runtime</span>
                        <span class="cache-guard-value">${t.runtimeVersion}</span>
                    </div>
                </div>
            </div>
        `}};pl.styles=et`
    :host {
      --cb-font-family: Roboto, Arial, Helvetica, sans-serif;
      --cb-sidebar-background: white;
      --cb-sidebar-section-border-color: #e6e8ee
    }
    
    :host {
      display: block;
      height: 100%;
      width: 100%;
      position: relative;
      overflow: hidden;
      background: var(--card-background-color, #ffffff);
    }

    .panel-container {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    .builder-wrapper {
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    builder-main {
      width: 100%;
      height: 100%;
    }

    .error {
      padding: 16px;
      color: var(--error-color, #db4437);
      background: var(--card-background-color, #ffffff);
      border-radius: 8px;
      margin: 16px;
      border: 1px solid var(--error-color, #db4437);
    }

    .cache-guard-page {
      box-sizing: border-box;
      min-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      color: var(--primary-text-color, #212121);
      background: var(--primary-background-color, #ffffff);
      font-family: var(--paper-font-body1_-_font-family, Roboto, Arial, sans-serif);
    }

    .cache-guard-box {
      width: min(100%, 560px);
      border: 1px solid var(--divider-color, #d9dce3);
      border-radius: 8px;
      background: var(--card-background-color, #ffffff);
      padding: 18px;
      box-sizing: border-box;
    }

    .cache-guard-title {
      margin: 0 0 8px;
      font-size: 18px;
      line-height: 1.35;
      font-weight: 600;
    }

    .cache-guard-message {
      margin: 0;
      font-size: 14px;
      line-height: 1.45;
      color: var(--secondary-text-color, #5f6368);
    }

    .cache-guard-versions {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 6px 10px;
      margin-top: 14px;
      font-size: 13px;
      line-height: 1.35;
    }

    .cache-guard-label {
      color: var(--secondary-text-color, #5f6368);
    }

    .cache-guard-value {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      overflow-wrap: anywhere;
    }
  `,pl.FULLSCREEN_STORAGE_KEY="card-builder-fullscreen",cl([xt({context:En})],pl.prototype,"cardsManager",2),cl([xt({context:d})],pl.prototype,"panelEventBus",2),cl([tt({attribute:!1})],pl.prototype,"hass",2),cl([tt({attribute:!1})],pl.prototype,"narrow",2),cl([tt({attribute:!1})],pl.prototype,"route",2),cl([tt({attribute:!1})],pl.prototype,"panel",2),cl([st()],pl.prototype,"_isReady",2),cl([st()],pl.prototype,"_loadedHAComponents",2),cl([st()],pl.prototype,"_currentRoute",2),cl([st()],pl.prototype,"_routeParams",2),cl([st()],pl.prototype,"_isFullscreen",2),cl([st()],pl.prototype,"_versionCheck",2),pl=cl([rt("card-builder-panel")],pl),console.info(`%c ${ol} %c v${je}`,`background: ${rl}; color: ${al}; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;`,`background: ${sl}; color: ${nl}; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;`),er.boot();