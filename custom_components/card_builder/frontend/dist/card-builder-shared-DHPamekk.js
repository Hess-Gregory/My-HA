import{aL as e,aD as t,aC as i,aM as n,aY as r,aZ as o,a_ as s,a$ as a,aB as l,aH as c,aK as d,aO as u,aE as h,aF as p,b0 as g,aQ as m,b1 as v,aP as y,b2 as b,aN as f,aI as k,aG as x,aS as w,aV as S,aU as _,aT as T}from"./card-builder-shared-MgdMk8WF.js";import{u as A,a as I,b as C,c as P,d as M,e as $,f as L,g as B,h as E,j as D,k as R,l as O,m as N,i as z}from"./card-builder-shared-CNfdQpSP.js";import{d as V,a as F,b as W,m as j,e as G,c as U}from"./card-builder-shared-D9W2hmOT.js";const H="2.6.0",q=e("event-bus");class X{constructor(){this.listeners=new Map}addEventListener(e,t){return this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t),()=>this.removeEventListener(e,t)}removeEventListener(e,t){const i=this.listeners.get(e);i&&(i.delete(t),0===i.size&&this.listeners.delete(e))}dispatchEvent(e,t){const i=this.listeners.get(e);i&&i.forEach(i=>{try{i(t)}catch(n){console.error(`Error in event listener for "${e}":`,n)}})}removeAllListeners(e){e?this.listeners.delete(e):this.listeners.clear()}listenerCount(e){var t;return(null==(t=this.listeners.get(e))?void 0:t.size)||0}hasListeners(e){return this.listenerCount(e)>0}}const Y=e("blocks-renderer");function K(e){return"object"==typeof e&&null!==e&&"rules"in e}const Q="Template error",Z=[{key:"value",description:"Current value (state or attribute)"},{key:"state",description:"Entity state string"},{key:"attributes",description:"Entity attributes object"},{key:"entity",description:"Entity ID"},{key:"last_changed",description:"Last changed timestamp"},{key:"last_updated",description:"Last updated timestamp"}],J=[...Z,{key:"name",description:"Entity friendly name"}];function ee(e,t,i){const n={};return e?(n.value=void 0!==t?t:e.state,n.state=e.state,n.attributes=e.attributes||{},n.entity=e.entity_id,n.last_changed=e.last_changed,n.last_updated=e.last_updated):n.value=t,n}class te{constructor(e,t={}){this.hass=e,this.callbacks=t,this.requestId=0}update(e){var t;const i=null==(t=e.template)?void 0:t.trim();if(!i)return this.lastResult=void 0,this.lastError=void 0,this.lastKey=void 0,void this._cleanup();const n=this._buildKey({...e,template:i});if(this.lastKey===n)return;this.lastKey=n,this.lastError=void 0;const r=e.debounceMs??0;this.debounceId&&(window.clearTimeout(this.debounceId),this.debounceId=void 0),r>0?this.debounceId=window.setTimeout(()=>{this.debounceId=void 0,this._subscribe({...e,template:i})},r):this._subscribe({...e,template:i})}dispose(){this.debounceId&&(window.clearTimeout(this.debounceId),this.debounceId=void 0),this._cleanup()}getResult(){return this.lastResult}getError(){return this.lastError}async _subscribe(e){var t,i;this.requestId+=1;const n=this.requestId;this._cleanup();try{this.unsubscribe=await this.hass.connection.subscribeMessage(e=>{var t,i,r,o;if(n===this.requestId){if(function(e){return void 0!==e.error}(e))return this.lastError=e,this.lastResult=void 0,null==(i=(t=this.callbacks).onError)||i.call(t,e),void this._cleanup();var s;this.lastResult=e,this.lastError=void 0,null==(o=(r=this.callbacks).onResult)||o.call(r,e),s=e.listeners,Boolean(s.all||s.time||s.entities&&s.entities.length>0||s.domains&&s.domains.length>0)||this._cleanup()}},{type:"render_template",template:e.template,variables:e.variables,entity_ids:e.entityIds,strict:e.strict,report_errors:e.reportErrors??!0})}catch(r){const e={error:r instanceof Error?r.message:"Template render failed",level:"ERROR"};this.lastError=e,this.lastResult=void 0,null==(i=(t=this.callbacks).onError)||i.call(t,e),this._cleanup()}}_cleanup(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=void 0)}_buildKey(e){const t=e.variables?function(e){try{return ie(e)}catch{return""}}(e.variables):"",i=Array.isArray(e.entityIds)?e.entityIds.join(","):e.entityIds??"";return[e.template,t,i,e.strict?"1":"0",!1===e.reportErrors?"0":"1"].join("::")}}function ie(e){if(null==e)return String(e);if("object"!=typeof e)return JSON.stringify(e);if(Array.isArray(e))return"["+e.map(e=>ie(e)).join(",")+"]";const t=e;return"{"+Object.keys(t).sort().map(e=>`${JSON.stringify(e)}:${ie(t[e])}`).join(",")+"}"}class ne{constructor(e,t={}){this.hass=e,this.options=t,this.templateSessions=new Map,this.bindingTemplateKeys=new WeakMap}evaluate(e,t={}){var i,n,r,o,s;const{defaultValue:a,defaultEntityId:l}=t,c=(null==(i=e.entity)?void 0:i.slotId)??void 0,d=c?null==(r=(n=this.options).resolveSlotEntity)?void 0:r.call(n,c):void 0,u=c?d:(null==(o=e.entity)?void 0:o.entityId)||l,h=(null==(s=e.entity)?void 0:s.source)||"state",p="state"===h?void 0:h;if(!u)return{value:a??e.default,success:!0};try{const t={state:this._getEntityState(u),attribute:p,entityId:u,getState:e=>this._getEntityState(e)};if("template"===e.mode){return{value:this._evaluateTemplateBinding(e,t,a),success:!0}}const i=function(e,t){if(!t.state)return e.default;switch(e.mode){case"direct":return function(e,t){const i=ue(t.state,t.attribute);if(!e.inputRange&&!e.outputRange)return i??e.default;const n=he(i);if(null===n)return e.default;const r=e.inputRange??[0,100],o=e.outputRange??[0,100];return function(e,t,i,n,r){const o=Math.max(t,Math.min(i,e));return n+(o-t)/(i-t)*(r-n)}(n,r[0],r[1],o[0],o[1])}(e,t);case"map":return function(e,t){const i=ue(t.state,t.attribute),n=String(i);if(n in e.map)return e.map[n];const r=n.toLowerCase();for(const[o,s]of Object.entries(e.map))if(o.toLowerCase()===r)return s;return e.default}(e,t);case"threshold":return function(e,t){const i=ue(t.state,t.attribute),n=he(i);if(null===n)return e.default;const r=function(e,t){for(const i of t){const t=void 0===i.min||e>=i.min,n=void 0===i.max||e<i.max;if(t&&n)return i}return null}(n,e.thresholds);if(r)return r.value;return e.default}(e,t);case"condition":return function(e,t){for(const i of e.conditions){if(re(i.condition,t.getState,t.entityId))return i.value}return e.default}(e,t);case"template":return function(e,t){const i=t.state,n={value:ue(i,t.attribute),state:i.state,attributes:i.attributes,entity:i.entity_id,last_changed:i.last_changed,last_updated:i.last_updated},r=function(e,t){if(!e)return"";const i=/\{\{(.+?)\}\}/g;return e.replace(i,(e,i)=>{const n=function(e,t){const i=e.split("|").map(e=>e.trim());let n=function(e,t){switch(e){case"value":return t.value;case"state":return t.state;case"entity":return t.entity;case"last_changed":return t.last_changed;case"last_updated":return t.last_updated}if(e.startsWith("attributes.")){const i=e.slice(11);return function(e,t){const i=t.split(".");let n=e;for(const r of i){if(null==n)return;if("object"!=typeof n)return;n=n[r]}return n}(t.attributes,i)}if(e in t.attributes)return t.attributes[e];return}(i[0],t);for(let r=1;r<i.length;r++){n=ce(i[r],n)}return n}(i.trim(),t);return null!=n?String(n):""})}(e.template,n);return r||e.default}(e,t);default:return console.warn(`[ValueResolver] Unknown binding mode: ${e.mode}`),e.default}}(e,t);return void 0===i?{value:a??e.default,success:!0}:{value:i,success:!0}}catch(g){return console.warn("[BindingEvaluator] Evaluation failed:",g),{value:a??e.default,success:!1,error:g instanceof Error?g.message:"Unknown error"}}}_evaluateTemplateBinding(e,t,i){var n,r;const o=null==(n=e.template)?void 0:n.trim(),s=t.state;if(!o||!s)return this._clearBindingTemplateSession(e),i??e.default;const a=ee(s,this._extractValue(s,t.attribute)),l=this._getTemplateSessionKey(o,t);this._trackBindingTemplateKey(e,l);const c=this._getTemplateSession(l);c.update({template:o,variables:a,reportErrors:!0});if(c.getError())return Q;const d=null==(r=c.getResult())?void 0:r.result;return void 0!==d?d:i??e.default}_trackBindingTemplateKey(e,t){const i=this.bindingTemplateKeys.get(e);if(i&&i!==t){const e=this.templateSessions.get(i);e&&(e.dispose(),this.templateSessions.delete(i))}this.bindingTemplateKeys.set(e,t)}_clearBindingTemplateSession(e){const t=this.bindingTemplateKeys.get(e);if(!t)return;const i=this.templateSessions.get(t);i&&(i.dispose(),this.templateSessions.delete(t)),this.bindingTemplateKeys.delete(e)}_getTemplateSession(e){let t=this.templateSessions.get(e);return t||(t=new te(this.hass,{onResult:t=>{var i,n;return null==(n=(i=this.options).onTemplateResult)?void 0:n.call(i,{key:e,value:t.result})},onError:t=>{var i,n;return null==(n=(i=this.options).onTemplateResult)?void 0:n.call(i,{key:e,error:t})}}),this.templateSessions.set(e,t)),t}_getTemplateSessionKey(e,t){return`${t.entityId??""}::${t.attribute??"state"}::${e}`}_extractValue(e,t){var i;if(!t||"state"===t)return e.state;if("last_changed"===t)return e.last_changed;if("last_updated"===t)return e.last_updated;if(t.includes(".")){const i=t.split(".");let n=e.attributes;for(const e of i){if(null==n)return;if("object"!=typeof n)return;n=n[e]}return n}return null==(i=e.attributes)?void 0:i[t]}_getEntityState(e){const t=this.hass.states[e];if(t)return{entity_id:t.entity_id,state:t.state,attributes:t.attributes||{},last_changed:t.last_changed,last_updated:t.last_updated,context:t.context}}}function re(e,t,i){return K(e)?function(e,t,i){if(!e.rules||0===e.rules.length)return!0;if("and"===e.operator)return e.rules.every(e=>re(e,t,i));if("or"===e.operator)return e.rules.some(e=>re(e,t,i));return!1}(e,t,i):function(e,t,i){const n=e.entity||i;if(!n)return console.warn("[ConditionEvaluator] No entity specified for condition rule"),!1;const r=t(n);if(!r)return!1;return function(e,t,i){switch(t){case"==":return oe(e,i);case"!=":return!oe(e,i);case">":return se(e,i,(e,t)=>e>t);case"<":return se(e,i,(e,t)=>e<t);case">=":return se(e,i,(e,t)=>e>=t);case"<=":return se(e,i,(e,t)=>e<=t);case"contains":return function(e,t){if("string"==typeof e&&"string"==typeof t)return e.toLowerCase().includes(t.toLowerCase());if(Array.isArray(e))return e.some(e=>oe(e,t));return!1}(e,i);case"in":return function(e,t){if(!Array.isArray(t))return!1;return t.some(t=>oe(e,t))}(e,i);default:return console.warn(`[ConditionEvaluator] Unknown operator: ${t}`),!1}}(function(e,t){if(!t||"state"===t)return e.state;if("last_changed"===t)return e.last_changed;if("last_updated"===t)return e.last_updated;if(t.includes("."))return function(e,t){const i=t.split(".");let n=e;for(const r of i){if(null==n)return;if("object"!=typeof n)return;n=n[r]}return n}(e.attributes,t);return e.attributes[t]}(r,e.attribute),e.operator,e.value)}(e,t,i)}function oe(e,t){if(e===t)return!0;if("string"==typeof e&&"string"==typeof t)return e.toLowerCase()===t.toLowerCase();if("string"==typeof e&&"number"==typeof t)return parseFloat(e)===t;if("number"==typeof e&&"string"==typeof t)return e===parseFloat(t);if("boolean"==typeof t){if("boolean"==typeof e)return e===t;if("string"==typeof e){const i=e.toLowerCase();return!0===t?"true"===i||"on"===i||"yes"===i||"1"===i:"false"===i||"off"===i||"no"===i||"0"===i}}return!1}function se(e,t,i){const n=ae(e),r=ae(t);return null!==n&&null!==r&&i(n,r)}function ae(e){if("number"==typeof e)return isNaN(e)?null:e;if("string"==typeof e){const t=parseFloat(e);return isNaN(t)?null:t}return null}const le={round:(e,t="0")=>{const i=de(e);if(null===i)return e;const n=parseInt(t,10)||0;return i.toFixed(n)},int:e=>{const t=de(e);return null===t?e:Math.floor(t)},float:(e,t)=>{const i=de(e);if(null===i)return e;if(void 0!==t){const e=parseInt(t,10)||0;return parseFloat(i.toFixed(e))}return i},upper:e=>String(e).toUpperCase(),lower:e=>String(e).toLowerCase(),capitalize:e=>{const t=String(e);return t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()},title:e=>String(e).split(" ").map(e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join(" "),default:(e,t="")=>null==e||""===e?t:e,replace:(e,t="",i="")=>String(e).split(t).join(i),truncate:(e,t="20",i="...")=>{const n=String(e),r=parseInt(t,10)||20;return n.length<=r?n:n.slice(0,r-i.length)+i},abs:e=>{const t=de(e);return null===t?e:Math.abs(t)},multiply:(e,t="1")=>{const i=de(e),n=de(t);return null===i||null===n?e:i*n},divide:(e,t="1")=>{const i=de(e),n=de(t);return null===i||null===n||0===n?e:i/n},add:(e,t="0")=>{const i=de(e),n=de(t);return null===i||null===n?e:i+n},subtract:(e,t="0")=>{const i=de(e),n=de(t);return null===i||null===n?e:i-n},percentage:(e,t="0")=>{const i=de(e);if(null===i)return e;const n=parseInt(t,10)||0;return i.toFixed(n)+"%"},relative_time:e=>{if("string"!=typeof e)return e;try{const t=new Date(e),i=(new Date).getTime()-t.getTime(),n=Math.floor(i/1e3),r=Math.floor(n/60),o=Math.floor(r/60),s=Math.floor(o/24);return s>0?`${s}d ago`:o>0?`${o}h ago`:r>0?`${r}m ago`:`${n}s ago`}catch{return e}},timestamp:(e,t="HH:mm")=>{if("string"!=typeof e)return e;try{const i=new Date(e);return t.replace("YYYY",String(i.getFullYear())).replace("MM",String(i.getMonth()+1).padStart(2,"0")).replace("DD",String(i.getDate()).padStart(2,"0")).replace("HH",String(i.getHours()).padStart(2,"0")).replace("mm",String(i.getMinutes()).padStart(2,"0")).replace("ss",String(i.getSeconds()).padStart(2,"0"))}catch{return e}}};function ce(e,t){const i=e.match(/^(\w+)(?:\((.+)\))?$/);if(!i)return console.warn(`[TemplateParser] Invalid filter expression: ${e}`),t;const n=i[1],r=i[2],o=le[n];if(!o)return console.warn(`[TemplateParser] Unknown filter: ${n}`),t;const s=r?function(e){const t=[];let i="",n=!1,r="";for(const o of e)'"'!==o&&"'"!==o||n?o===r&&n?(n=!1,r=""):","!==o||n?i+=o:(t.push(i.trim()),i=""):(n=!0,r=o);i.trim()&&t.push(i.trim());return t.map(e=>e.startsWith('"')&&e.endsWith('"')||e.startsWith("'")&&e.endsWith("'")?e.slice(1,-1):e)}(r):[];try{return o(t,...s)}catch(a){return console.warn(`[TemplateParser] Error applying filter ${n}:`,a),t}}function de(e){if("number"==typeof e)return isNaN(e)?null:e;if("string"==typeof e){const t=parseFloat(e);return isNaN(t)?null:t}return null}function ue(e,t){return t&&"state"!==t?"last_changed"===t?e.last_changed:"last_updated"===t?e.last_updated:t.includes(".")?function(e,t){const i=t.split(".");let n=e;for(const r of i){if(null==n)return;if("object"!=typeof n)return;n=n[r]}return n}(e.attributes,t):e.attributes[t]:e.state}function he(e){if("number"==typeof e)return isNaN(e)?null:e;if("string"==typeof e){const t=parseFloat(e);return isNaN(t)?null:t}return null}const pe=5;class ge extends EventTarget{constructor(){super(),this.version=5,this.rootId="root",this.slots={entities:{},actions:{}},this.blocks={},this.selectedId=null,this.selectedStyleTargetId=null,this.linkModeState={enabled:!1,mode:"idle",activeLinkId:null},this.linkEditorSelection={blockId:null,pointId:null,segmentIndex:null,handle:null},this.linkAnchorHighlight={blockId:null},this.linkGridColor="#000000",this._elementRegistry=new Map,this._reset(),this._initialize()}createBlock(e,t="root",i={},n={},r){const o=`block-${Date.now()}-${Math.random().toString(36).substring(2,9)}`,s=this.blocks[t],a=n.layout||"flow",l=n.entityConfig||i.entityConfig||{mode:"inherited"},c={id:o,type:e,parentId:t,canBeDeleted:n.canBeDeleted??i.canBeDeleted,canBeDuplicated:n.canBeDuplicated??i.canBeDuplicated,canChangeLayoutMode:n.canChangeLayoutMode??i.canChangeLayoutMode,isHidden:n.isHidden??i.isHidden,requireEntity:n.requireEntity??i.requireEntity,parentManaged:n.parentManaged||!1,label:n.label||void 0,layout:a,children:[],props:{...i.props||{},...n.props||{}},order:r||0,styles:n.styles,zIndex:Object.keys(this.blocks).length,entityConfig:l};return this.blocks[o]=c,void 0!==r?(s.children.splice(r,0,o),s.children.forEach((e,t)=>{this.blocks[e].order=t})):s.children.push(o),this.blocks={...this.blocks,[o]:c},this._emit("block-created",{block:c}),this._emit("change",{action:"create",block:c}),c}updateBlock(e,t){const i=this.blocks[e];if(!i)return;const n={...i},r="styles"in t||"layout"in t;t.props&&(n.props={...n.props,...t.props},delete t.props),"styles"in t&&(n.styles=t.styles,delete t.styles),Object.assign(n,t),this.blocks={...this.blocks,[e]:n},this._emit("change",{action:"update",block:n,styleChanged:r}),this._emit("block-updated",{block:n})}updateBlockId(e,t){const i=t.trim().toLowerCase().replaceAll(" ","-");if(!i)return{success:!1,error:"ID cannot be empty"};if(i===e)return{success:!0};if(e===this.rootId)return{success:!1,error:"Root block ID cannot be changed"};if(this.blocks[i])return{success:!1,error:"ID already exists"};const n=this.blocks[e];if(!n)return{success:!1,error:"Block not found"};const r={...this.blocks},o={...n,id:i};delete r[e],r[i]=o;const s=new Set([i]);Object.values(r).forEach(t=>{var n;let o=t,a=!1;if(o.parentId===e&&(o={...o,parentId:i},a=!0),null==(n=o.children)?void 0:n.includes(e)){const t=o.children.map(t=>t===e?i:t);o={...o,children:t},a=!0}a&&(r[o.id]=o,s.add(o.id))}),this.blocks=r;return this.selectedId===e&&this.select(i),this._emit("change",{action:"update",block:o}),s.forEach(e=>{this._emit("block-updated",{block:r[e]})}),{success:!0}}deleteBlock(e,t=!1){const i=this.blocks[e];if(!i||"root"===e)return;if(!this.canDeleteBlock(e)&&!t)return void console.warn(`Cannot delete parent-managed block: ${e}`);const n=this.blocks[i.parentId];n&&n.children&&(n.children=n.children.filter(t=>t!==e)),i.children&&[...i.children].forEach(e=>this.deleteBlock(e)),delete this.blocks[e],this.selectedId===e&&(this.selectedId=null,this._emit("selection-changed",{selectedId:null})),this._emit("block-deleted",{blockId:e}),this._emit("change",{action:"delete",block:i})}moveBlock(e,t,i){const n=this.blocks[e],r=this.blocks[n.parentId],o=this.blocks[t];if(!n||!o||!o.children)return;let s=i;if((null==r?void 0:r.id)===t&&(null==r?void 0:r.children)){const t=r.children.indexOf(e);-1!==t&&t<s&&(s-=1)}r&&r.children&&(r.children=r.children.filter(t=>t!==e));const a=o.children.length;s<0&&(s=0),s>a&&(s=a),n.parentId=t,o.children.splice(s,0,e),o.children.forEach((e,t)=>{this.blocks[e].order=t}),this._emit("block-moved",{block:n,oldParentId:null==r?void 0:r.id,newParentId:t,newIndex:s}),this._emit("change",{action:"move",block:n})}select(e){this.selectedId=e,this.selectedStyleTargetId=null,this._emit("selection-changed",{selectedId:e,selectedBlock:e?this.blocks[e]:void 0}),this._emit("style-target-changed",{selectedId:e,targetId:null})}getSelected(){return this.selectedId?this.blocks[this.selectedId]:null}selectStyleTarget(e){this.selectedStyleTargetId!==e&&(this.selectedStyleTargetId=e,this._emit("style-target-changed",{selectedId:this.selectedId,targetId:e}))}getSelectedStyleTargetId(){return this.selectedStyleTargetId}getLinkModeState(){return this.linkModeState}setLinkModeState(e){this.linkModeState={...this.linkModeState,...e},this._emit("link-mode-changed",{state:this.linkModeState})}getLinkEditorSelection(){return this.linkEditorSelection}setLinkEditorSelection(e){this.linkEditorSelection={...this.linkEditorSelection,...e},this._emit("link-editor-selection-changed",{selection:this.linkEditorSelection})}getLinkAnchorHighlight(){return this.linkAnchorHighlight}setLinkAnchorHighlight(e){this.linkAnchorHighlight.blockId!==e&&(this.linkAnchorHighlight={blockId:e},this._emit("link-anchor-highlight-changed",{blockId:e}))}getLinkGridColor(){return this.linkGridColor}setLinkGridColor(e){this.linkGridColor!==e&&(this.linkGridColor=e,this._emit("link-grid-color-changed",{color:e}))}canDeleteBlock(e){const t=this.blocks[e];return!(!t||"root"===e)&&(t.canBeDeleted??!0)}canDuplicateBlock(e){return this.blocks[e].canBeDuplicated??!0}canChangeLayoutMode(e){return this.blocks[e].canChangeLayoutMode??!0}isHidden(e){return!0===this.blocks[e].isHidden}isEntityRequired(e){return this.blocks[e].requireEntity??!1}duplicateBlock(e){const t=this.blocks[e];if(!t||!this.canDuplicateBlock(e))return console.warn(`Cannot duplicate block: ${e}`),null;const i=this.blocks[t.parentId];if(!i||!i.children)return null;const n=i.children.indexOf(e);if(-1===n)return null;const r=`block-${Date.now()}-${Math.random().toString(36).substring(2,9)}`,o={...t,id:r,order:n+1,children:[]};return this.blocks={...this.blocks,[r]:o},i.children.splice(n+1,0,r),i.children.forEach((e,t)=>{this.blocks[e].order=t}),t.children&&t.children.length>0&&t.children.forEach(e=>{this.blocks[e]&&this._duplicateBlockRecursive(e,r)}),this._emit("block-created",{block:o}),this._emit("change",{action:"duplicate",block:o}),this.select(r),o}getBlock(e){return this.blocks[e]}getChildren(e){const t=this.blocks[e];return t&&t.children?t.children.map(e=>this.blocks[e]).filter(Boolean).sort((e,t)=>e.order-t.order):[]}getBlockLabel(e){var t;const i="string"==typeof e?this.blocks[e]:e;return(null==(t=null==i?void 0:i.label)?void 0:t.trim())||void 0}getBlockDisplayName(e,t){const i="string"==typeof e?this.blocks[e]:e;return i?this.getBlockLabel(i)||t||i.type:t||""}resolveEntityForBlock(e){const t=this.blocks[e];if(!t)return{entityId:void 0,source:"none"};const i=t.entityConfig;if(!i)return this._resolveInheritedEntity(t);if("fixed"===i.mode)return{entityId:i.entityId,source:"fixed"};if("slot"===i.mode){const e=i.slotId;return{entityId:e?this.resolveSlotEntity(e):void 0,source:"slot",slotId:e}}return this._resolveInheritedEntity(t)}resolveSlotEntity(e){var t;return null==(t=this.slots.entities[e])?void 0:t.entityId}resolveSlotAction(e){return this.slots.actions[e]}getBlockEntities(e){var t,i,n;if(!e)return[];const r=this.getElement(e.id),o=null==(t=null==r?void 0:r.getBlockEntities)?void 0:t.call(r);if(void 0!==o)return o;if("fixed"===(null==(i=e.entityConfig)?void 0:i.mode)||"slot"===(null==(n=e.entityConfig)?void 0:n.mode)){const t=this.resolveEntityForBlock(e.id).entityId;return t?[t]:[]}return[]}getStyleBindingEntities(e){var t;if(!e)return[];const i=new Set;if(e.styles)for(const n of Object.values(e.styles))if(null==n?void 0:n.containers)for(const r of Object.values(n.containers))if(r)for(const n of Object.values(r))if(n)for(const r of Object.values(n)){if(!r||"object"!=typeof r)continue;const n=r;if(n.binding){ve(n.binding,e,this).forEach(e=>i.add(e))}for(const t of Object.values(n.themeModes??{})){if(!(null==t?void 0:t.binding))continue;ve(t.binding,e,this).forEach(e=>i.add(e))}if(null==(t=n.animation)?void 0:t.binding){ve(n.animation.binding,e,this).forEach(e=>i.add(e))}}return Array.from(i)}getTraitBindingEntities(e){if(!e)return[];const t={};for(const[i,n]of Object.entries(e.props??{})){if(!n||"object"!=typeof n)continue;const e=n;e.binding&&(t[i]=e.binding)}return 0===Object.keys(t).length?[]:function(e,t,i){const n=new Set,r=Array.isArray(e)?e:Object.values(e);for(const o of r){if(!o)continue;ve(o,t,i).forEach(e=>n.add(e))}return Array.from(n)}(t,e,this)}getAllTrackedEntities(e){return{blockEntities:this.getBlockEntities(e),styleEntities:this.getStyleBindingEntities(e),traitBindingEntities:this.getTraitBindingEntities(e)}}getTrackedEntitiesFlat(e){const{blockEntities:t,styleEntities:i,traitBindingEntities:n}=this.getAllTrackedEntities(e);return[...new Set([...t,...i,...n])]}getAllTrackedEntitiesRecursive(e){if(!e)return{blockId:void 0,blockEntities:[],styleEntities:[],traitBindingEntities:[],children:[]};const t=this.getAllTrackedEntities(e),i=this.getChildren(e.id).map(e=>this.getAllTrackedEntitiesRecursive(e));return{blockId:e.id,blockEntities:t.blockEntities,styleEntities:t.styleEntities,traitBindingEntities:t.traitBindingEntities,children:i}}getTrackedEntitiesRecursiveFlat(e){if(!e)return[];const t=new Set;this.getTrackedEntitiesFlat(e).forEach(e=>t.add(e));const i=this.getChildren(e.id);for(const n of i){this.getTrackedEntitiesRecursiveFlat(n).forEach(e=>t.add(e))}return Array.from(t)}isDescendant(e,t){if(!e||!t||e===t)return!1;if(!this.blocks[e])return!1;const i=this.getChildren(e);if(i.some(e=>e.id===t))return!0;for(const n of i)if(this.isDescendant(n.id,t))return!0;return!1}getSlotEntities(){return Object.values(this.slots.entities).sort((e,t)=>e.id.localeCompare(t.id))}getSlotEntity(e){return this.slots.entities[e]}getSlotActions(){return Object.values(this.slots.actions).sort((e,t)=>e.id.localeCompare(t.id))}getSlotAction(e){return this.slots.actions[e]}createSlotEntity(e){var t,i,n,r;const o=this._normalizeSlotId(e.id);if(!o)return{success:!1,error:"Slot ID cannot be empty"};if(this.slots.entities[o])return{success:!1,error:"Slot ID already exists"};const s=null==(t=e.domains)?void 0:t.filter(e=>e.trim()).map(e=>e.trim().toLowerCase()),a=(null==(i=e.entityId)?void 0:i.trim())||void 0;if(s&&s.length>0&&a){const e=a.split(".")[0];if(!s.includes(e))return{success:!1,error:`Default entity domain '${e}' must be one of: ${s.join(", ")}`}}const l={id:o,name:(null==(n=e.name)?void 0:n.trim())||void 0,description:(null==(r=e.description)?void 0:r.trim())||void 0,entityId:a,domains:s&&s.length>0?s:void 0};return this.slots={...this.slots,entities:{...this.slots.entities,[o]:l}},this._emitSlotEntitiesChanged("create",l),this._emit("change",{action:"update"}),{success:!0,slot:l}}updateSlotEntity(e,t){var i;const n=this.slots.entities[e];if(!n)return{success:!1,error:"Slot not found"};const r=t.id?this._normalizeSlotId(t.id):e;if(!r)return{success:!1,error:"Slot ID cannot be empty"};if(r!==e&&this.slots.entities[r])return{success:!1,error:"Slot ID already exists"};const o=void 0!==t.domains?(null==(i=t.domains)?void 0:i.filter(e=>e.trim()).map(e=>e.trim().toLowerCase()))||[]:n.domains,s=void 0!==t.entityId?t.entityId.trim()||void 0:n.entityId;if(o&&o.length>0&&s){const e=s.split(".")[0];if(!o.includes(e))return{success:!1,error:`Entity domain '${e}' must be one of: ${o.join(", ")}`}}const a={...n,...t,id:r,name:void 0!==t.name?t.name.trim()||void 0:n.name,description:void 0!==t.description?t.description.trim()||void 0:n.description,entityId:s,domains:o&&o.length>0?o:void 0};if(r!==e){const t={...this.slots.entities};delete t[e],t[r]=a,this.slots={...this.slots,entities:t};const i=this._replaceSlotEntityReferences(e,r);this._notifySlotUsageChanged(i)}else if(this.slots={...this.slots,entities:{...this.slots.entities,[e]:a}},"entityId"in t){const t=this._getSlotEntityReferenceBlockIds(e);this._notifySlotUsageChanged(t)}return this._emitSlotEntitiesChanged("update",a),this._emit("change",{action:"update"}),{success:!0,slot:a}}deleteSlotEntity(e){if(!this.slots.entities[e])return{success:!1,error:"Slot not found"};const t={...this.slots.entities},i=t[e];return delete t[e],this.slots={...this.slots,entities:t},this._emitSlotEntitiesChanged("delete",i),this._emit("change",{action:"update"}),{success:!0,slot:i}}createSlotAction(e){var t,i;const n=this._normalizeSlotId(e.id);if(!n)return{success:!1,error:"Slot ID cannot be empty"};if(this.slots.actions[n])return{success:!1,error:"Slot ID already exists"};if(!e.trigger)return{success:!1,error:"Trigger is required"};if(!e.action||"none"===e.action.action)return{success:!1,error:"Action is required"};const r={id:n,name:(null==(t=e.name)?void 0:t.trim())||void 0,description:(null==(i=e.description)?void 0:i.trim())||void 0,trigger:e.trigger,action:e.action};return this.slots={...this.slots,actions:{...this.slots.actions,[n]:r}},this._emitSlotActionsChanged("create",r),this._emit("change",{action:"update"}),{success:!0,slot:r}}updateSlotAction(e,t){const i=this.slots.actions[e];if(!i)return{success:!1,error:"Slot not found"};const n=t.id?this._normalizeSlotId(t.id):e;if(!n)return{success:!1,error:"Slot ID cannot be empty"};if(n!==e&&this.slots.actions[n])return{success:!1,error:"Slot ID already exists"};if(void 0!==t.trigger&&!t.trigger)return{success:!1,error:"Trigger is required"};if(t.action&&"none"===t.action.action)return{success:!1,error:"Action is required"};const r={...i,...t,id:n,name:void 0!==t.name?t.name.trim()||void 0:i.name,description:void 0!==t.description?t.description.trim()||void 0:i.description,trigger:t.trigger??i.trigger,action:t.action??i.action};if(n!==e){const t={...this.slots.actions};delete t[e],t[n]=r,this.slots={...this.slots,actions:t};const i=this._replaceSlotActionReferences(e,n);this._notifySlotUsageChanged(i)}else if(this.slots={...this.slots,actions:{...this.slots.actions,[e]:r}},"action"in t||"trigger"in t){const t=this._getSlotActionReferenceBlockIds(e);this._notifySlotUsageChanged(t)}return this._emitSlotActionsChanged("update",r),this._emit("change",{action:"update"}),{success:!0,slot:r}}deleteSlotAction(e){if(!this.slots.actions[e])return{success:!1,error:"Slot not found"};const t={...this.slots.actions},i=t[e];return delete t[e],this.slots={...this.slots,actions:t},this._emitSlotActionsChanged("delete",i),this._emit("change",{action:"update"}),{success:!0,slot:i}}findSlotEntityReferences(e){var t,i;const n=[];for(const r of Object.values(this.blocks)){const o=r.entityConfig;if("slot"===(null==o?void 0:o.mode)&&(null==o?void 0:o.slotId)===e&&n.push({blockId:r.id,kind:"block-entity"}),r.styles)for(const[t,i]of Object.entries(r.styles))this._collectSlotReferencesFromContainerStyles(r.id,e,null==i?void 0:i.containers,n,"block"===t?void 0:t);if(r.props)for(const[s,a]of Object.entries(r.props))if(a&&"object"==typeof a){const o=a;(null==(i=null==(t=o.binding)?void 0:t.entity)?void 0:i.slotId)===e&&n.push({blockId:r.id,kind:"trait-binding",propName:s}),this._isSlotPropReference(s,o.value,e)&&n.push({blockId:r.id,kind:"trait-slot",propName:s})}else this._isSlotPropReference(s,a,e)&&n.push({blockId:r.id,kind:"trait-slot",propName:s})}return n}findSlotActionReferences(e){var t,i;const n=[];for(const r of Object.values(this.blocks))if(null==(t=r.actions)?void 0:t.targets)for(const[t,o]of Object.entries(r.actions.targets))if(Array.isArray(o))for(const s of o)s===e&&n.push({blockId:r.id,kind:"action-slot",propName:t,actionTrigger:null==(i=this.slots.actions[e])?void 0:i.trigger});return n}buildTree(){const e=this.blocks[this.rootId],t=e=>e.children?{...e,tree:e.children.map(e=>t(this.blocks[e]))}:e;return t(e)}registerElement(e,t){const i="string"==typeof e?e:e.id;this.blocks[i]?t?(this._elementRegistry.set(i,t),this._emit("element-registered",{blockId:i,element:t})):this._elementRegistry.delete(i):t&&console.error(`[DocumentModel] Block ${i} not found, element cannot be registered`)}getElement(e){const t="string"==typeof e?e:e.id;if(this.blocks[t])return this._elementRegistry.get(t);console.warn(`[DocumentModel] Block ${t} not found, element cannot be retrieved`)}clear(){this._reset(),this._initialize()}loadFromConfig(e){this._reset(),this.version=e.version,this.rootId=e.rootId,this.slots=e.slots,this.blocks=e.blocks,this.editor=e.editor,this.themeSupport=e.themeSupport,this.dispatchEvent(new CustomEvent("document-loaded")),this._emitSlotEntitiesReloaded(),this._emitSlotActionsReloaded(),this._emit("change",{action:"load"})}exportToConfig(){const e={version:this.version,rootId:this.rootId,slots:this.slots,blocks:this.blocks};return this.editor&&(e.editor=this.editor),this.themeSupport&&(e.themeSupport=this.themeSupport),e}getEditorSettings(){return this.editor}setEditorSettings(e){JSON.stringify(this.editor??null)!==JSON.stringify(e??null)&&(this.editor=e,this._emit("change",{action:"update"}))}setThemeSupport(e){this.themeSupport!==e&&(this.themeSupport=e,this._emit("change",{action:"update"}))}_initialize(){this.blocks[this.rootId]={label:"Card",id:this.rootId,type:"canvas",parentId:null,canBeDeleted:!1,canBeDuplicated:!1,canChangeLayoutMode:!1,isHidden:!1,requireEntity:!1,parentManaged:!1,layout:"flow",children:[],props:{overflow_allow_blocks_outside:{value:!0},overflow_show:{value:!0}},order:0,zIndex:0}}_reset(){Object.keys(this.blocks).forEach(e=>delete this.blocks[e]),this.selectedId=null,this.selectedStyleTargetId=null,this.linkModeState={enabled:!1,mode:"idle",activeLinkId:null},this.linkEditorSelection={blockId:null,pointId:null,segmentIndex:null,handle:null},this.linkAnchorHighlight={blockId:null},this.linkGridColor="#000000",this.slots={entities:{},actions:{}},this.version=5,this.editor=void 0,this.themeSupport=void 0}_duplicateBlockRecursive(e,t){const i=this.blocks[e];if(!i)return;const n=`block-${Date.now()}-${Math.random().toString(36).substring(2,9)}`,r=this.blocks[t],o={...i,id:n,parentId:t,order:r.children?r.children.length:0,children:[]};this.blocks={...this.blocks,[n]:o},r.children&&r.children.push(n),i.children&&i.children.length>0&&i.children.forEach(e=>{this._duplicateBlockRecursive(e,n)})}_resolveInheritedEntity(e){let t=e.parentId;for(;t;){const e=this.blocks[t];if(!e)break;const i=e.entityConfig;if("fixed"===(null==i?void 0:i.mode))return{entityId:i.entityId,source:"inherited",inheritedFromId:e.id,inheritedFromDisplayName:this.getBlockDisplayName(e),inheritedFromType:e.type};if("slot"===(null==i?void 0:i.mode)){const t=i.slotId;return{entityId:t?this._resolveSlotEntity(t):void 0,source:"inherited",inheritedFromId:e.id,inheritedFromDisplayName:this.getBlockDisplayName(e),inheritedFromType:e.type,slotId:t}}t=e.parentId}return{entityId:void 0,source:"none"}}_resolveSlotEntity(e){var t;if(e)return null==(t=this.slots.entities[e])?void 0:t.entityId}_normalizeSlotId(e){return e.trim().toLowerCase().replaceAll(" ","-")}_emitSlotEntitiesChanged(e,t){this.dispatchEvent(new CustomEvent("slots-changed",{detail:{action:e,slot:t}}))}_emitSlotEntitiesReloaded(){this.dispatchEvent(new CustomEvent("slots-changed",{detail:{action:"load"}}))}_emitSlotActionsChanged(e,t){this.dispatchEvent(new CustomEvent("slot-actions-changed",{detail:{action:e,slot:t}}))}_emitSlotActionsReloaded(){this.dispatchEvent(new CustomEvent("slot-actions-changed",{detail:{action:"load"}}))}_collectSlotReferencesFromContainerStyles(e,t,i,n,r){var o,s,a,l,c,d,u;if(i)for(const h of Object.values(i))if(h)for(const[i,p]of Object.entries(h))if(p)for(const[h,g]of Object.entries(p)){if(!g||"object"!=typeof g)continue;const p=g;(null==(s=null==(o=p.binding)?void 0:o.entity)?void 0:s.slotId)===t&&n.push({blockId:e,kind:"style-binding",category:i,property:h,styleTargetId:r});for(const o of Object.values(p.themeModes??{}))(null==(l=null==(a=null==o?void 0:o.binding)?void 0:a.entity)?void 0:l.slotId)===t&&n.push({blockId:e,kind:"style-binding",category:i,property:h,styleTargetId:r});(null==(u=null==(d=null==(c=p.animation)?void 0:c.binding)?void 0:d.entity)?void 0:u.slotId)===t&&n.push({blockId:e,kind:"style-animation",category:i,property:h,styleTargetId:r})}}_replaceSlotEntityReferences(e,t){var i,n;const r={...this.blocks},o=new Set;for(const[s,a]of Object.entries(this.blocks)){let l=a,c=!1;if("slot"===(null==(i=a.entityConfig)?void 0:i.mode)&&(null==(n=a.entityConfig)?void 0:n.slotId)===e&&(l={...l,entityConfig:{...a.entityConfig,slotId:t}},c=!0),a.styles){let i=!1;const n={...a.styles};for(const[r,o]of Object.entries(a.styles)){if(!(null==o?void 0:o.containers))continue;const{containerStyles:s,changed:a}=this._updateSlotIdInContainerStyles(o.containers,e,t);a&&(n[r]={...o,containers:s},i=!0)}i&&(l={...l,styles:n},c=!0)}if(a.props){let i=!1;const n={...a.props};for(const[r,o]of Object.entries(a.props)){const s=this._updateSlotIdInTraitValue(r,o,e,t);s.changed&&(n[r]=s.value,i=!0)}i&&(l={...l,props:n},c=!0)}c&&(r[s]=l,o.add(s))}return o.size>0&&(this.blocks=r),o}_replaceSlotActionReferences(e,t){var i;const n={...this.blocks},r=new Set;for(const[o,s]of Object.entries(this.blocks)){if(!(null==(i=s.actions)?void 0:i.targets))continue;let a=!1;const l={...s.actions.targets};for(const[i,n]of Object.entries(s.actions.targets)){if(!Array.isArray(n))continue;let r=!1;const o=n.map(i=>i===e?(r=!0,t):i);r&&(l[i]=o,a=!0)}a&&(n[o]={...s,actions:{targets:l}},r.add(o))}return r.size>0&&(this.blocks=n),r}_updateSlotIdInContainerStyles(e,t,i){let n=!1;const r={};for(const[o,s]of Object.entries(e)){if(!s)continue;let e=!1;const a={...s};for(const[n,r]of Object.entries(s)){if(!r)continue;let o=!1;const s={...r};for(const[e,n]of Object.entries(r)){if(!n||"object"!=typeof n)continue;const r=this._updateSlotIdInStylePropertyValue(n,t,i);r.changed&&(s[e]=r.value,o=!0)}o&&(a[n]=s,e=!0)}e?(r[o]=a,n=!0):r[o]=s}return{containerStyles:n?r:e,changed:n}}_updateSlotIdInStylePropertyValue(e,t,i){var n,r,o,s,a,l,c;const d=e;let u=!1,h=d.binding,p=d.animation,g=d.themeModes;if((null==(r=null==(n=d.binding)?void 0:n.entity)?void 0:r.slotId)===t&&(h={...d.binding,entity:{...d.binding.entity,slotId:i}},u=!0),(null==(a=null==(s=null==(o=d.animation)?void 0:o.binding)?void 0:s.entity)?void 0:a.slotId)===t&&(p={...d.animation,binding:{...d.animation.binding,entity:{...d.animation.binding.entity,slotId:i}}},u=!0),d.themeModes)for(const[m,v]of Object.entries(d.themeModes))(null==(c=null==(l=null==v?void 0:v.binding)?void 0:l.entity)?void 0:c.slotId)===t&&(g={...g??{},[m]:{...v,binding:{...v.binding,entity:{...v.binding.entity,slotId:i}}}},u=!0);return u?{value:{...d,binding:h,animation:p,themeModes:g},changed:!0}:{value:e,changed:!1}}_updateSlotIdInTraitValue(e,t,i,n){var r,o;if(t&&"object"==typeof t){const s=t;let a=!1,l=s.value,c=s.binding;return(null==(o=null==(r=s.binding)?void 0:r.entity)?void 0:o.slotId)===i&&(c={...s.binding,entity:{...s.binding.entity,slotId:n}},a=!0),this._isSlotPropReference(e,s.value,i)&&(l=n,a=!0),a?{value:{...s,value:l,binding:c},changed:!0}:{value:t,changed:!1}}return this._isSlotPropReference(e,t,i)?{value:n,changed:!0}:{value:t,changed:!1}}_isSlotPropReference(e,t,i){return"string"==typeof t&&(t===i&&e.toLowerCase().includes("slot"))}_getSlotEntityReferenceBlockIds(e){const t=new Set;for(const i of this.findSlotEntityReferences(e))t.add(i.blockId);return t}_getSlotActionReferenceBlockIds(e){const t=new Set;for(const i of this.findSlotActionReferences(e))t.add(i.blockId);return t}_notifySlotUsageChanged(e){if(0!==e.size)for(const t of e){const e=this.blocks[t];e&&(this._emit("block-updated",{block:e}),this._emit("change",{action:"update",block:e,styleChanged:!0}))}}_emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t}))}}const me=e("document-model");function ve(e,t,i){if(!e||"object"!=typeof e)return[];const n=new Set,r=e,o=function(e,t,i){return(null==e?void 0:e.slotId)?i.resolveSlotEntity(e.slotId):(null==e?void 0:e.entityId)?e.entityId:i.resolveEntityForBlock(t.id).entityId}(r.entity,t,i);if(o&&n.add(o),"condition"===r.mode){const e=r;if(e.conditions)for(const t of e.conditions){ye(t.condition).forEach(e=>n.add(e))}}const s=e;if("showWhen"in s&&s.showWhen){ye(s.showWhen).forEach(e=>n.add(e))}if("hideWhen"in s&&s.hideWhen){ye(s.hideWhen).forEach(e=>n.add(e))}if("activeWhen"in s&&s.activeWhen){ye(s.activeWhen).forEach(e=>n.add(e))}return Array.from(n)}function ye(e){const t=new Set;if(K(e))for(const n of e.rules){ye(n).forEach(e=>t.add(e))}else"object"==typeof(i=e)&&null!==i&&"operator"in i&&!("rules"in i)&&e.entity&&t.add(e.entity);var i;return Array.from(t)}const be="desktop";class fe extends X{constructor(e=null){super(),this.containers=new Map,this.containers.set(be,{id:be,name:"Desktop",width:0,aspectRatioWidth:16,aspectRatioHeight:9,screenWidth:1200,order:1,isDefault:!0,isDevice:!0,icon:"mdi:monitor"});this.getDefaultContainers(e).forEach(e=>this.setContainer(e))}getDefaultContainers(e){return[{id:"tablet",name:"Tablet",width:768,aspectRatioWidth:4,aspectRatioHeight:3,screenWidth:1024,order:2,isDefault:!1,isDevice:!0,icon:"mdi:tablet",disabled:!0},{id:"mobile",name:"Mobile",width:480,aspectRatioWidth:9,aspectRatioHeight:19.5,screenWidth:800,order:3,isDefault:!1,isDevice:!0,icon:"mdi:cellphone",disabled:!0}]}getContainers(e=!1){const t=Array.from(this.containers.values()).sort((e,t)=>e.order-t.order);return e?t.filter(e=>!e.disabled):t}getDefaultContainer(){return this.containers.get(be)}getDefaultContainerId(){return be}getActiveContainer(){return this.containers.get(be)}getActiveContainerId(){return be}setContainer(e){if(this.containers.has(e.id))throw new Error(`Container is already registered: ${e.id}`);if(e.isDefault)throw new Error(`Container ${e.id} can not be registered ad default container`);this.containers.set(e.id,e),this.dispatchEvent("containers-updated",{containers:this.getContainers()})}getFallbackChain(e){return[this.getDefaultContainer()]}}const ke=new fe,xe=e("container-manager");var we=Object.defineProperty,Se=(e,t,i,n)=>{for(var r,o=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&we(t,i,o),o};const _e=e("drag-drop-manager");class Te extends t{constructor(){super(...arguments),this.blockId="",this.canvasId="",this._registered=!1,this._wasDisconnected=!1}get dropId(){return this.blockId}get dropElement(){return this}get blockType(){return this.tagName.toLowerCase()}get isBlockDraggable(){return!0}get isBlockDroppable(){return!0}get isBlockContainer(){return!1}resolveDragSource(){return this}shouldShowDropIndicator(){return!0}get blockTypesAcceptedAsChildren(){return null}connectedCallback(){super.connectedCallback(),this.dragDropManager}disconnectedCallback(){this.dragDropManager&&(this._wasDisconnected=!0,this._unregisterFromManager()),super.disconnectedCallback()}updated(e){if(!this.dragDropManager)return;const t=this.blockId&&this.canvasId,i=e.has("blockId")||e.has("canvasId"),n=!this._registered||i||this._wasDisconnected;t&&n&&((i||this._wasDisconnected)&&this._registered&&(this._registered=!1),this._wasDisconnected=!1,this._registerWithManager())}getBlockedDropInstructions(){return null}_registerWithManager(){this.dragDropManager.registerBlock(this),this._registered=!0,this.blockId}_unregisterFromManager(){this._registered&&this.blockId&&(this.dragDropManager.unregisterBlock(this),this._registered=!1,this.blockId)}}Se([i({type:String,attribute:"block-id"})],Te.prototype,"blockId"),Se([i({type:String,attribute:"canvas-id"})],Te.prototype,"canvasId"),Se([n({context:_e})],Te.prototype,"dragDropManager");const Ae="data-dnd-draggable",Ie=`[${Ae}="true"]`;var Ce=(e=>(e.CANVAS="canvas",e.SOURCE_ZONE="source-zone",e))(Ce||{}),Pe=(e=>(e.CANVAS="canvas",e.CONTAINER="container",e.BLOCK="block",e))(Pe||{}),Me=(e=>(e.SOURCE_NOT_ALLOWED="source_not_allowed",e.BLOCK_TYPE_NOT_ALLOWED="block_type_not_allowed",e.CONTAINER_REFUSES="container_refuses",e.BOUND_BLOCK_LOCKED="bound_block_locked",e.TRANSFER_NOT_ALLOWED="transfer_not_allowed",e))(Me||{});class $e{constructor(e,t,i){this.restrictionManager=e,this.shakeAnimator=t,this.eventBus=i,this.draggables=new Map}attachToBlock(e){if(this.draggables.has(e))return e.blockId,void e.canvasId;e.blockId,e.blockType,e.setAttribute(Ae,"true");const t=V({element:e,getInitialData:()=>{const t={sourceId:e.canvasId,sourceType:Ce.CANVAS,blockType:e.blockType,blockId:e.blockId};return e.blockId,t},onGenerateDragPreview:({nativeSetDragImage:t,location:i})=>{if(e.blockId,t){const n=e.resolveDragSource(),r=n.getBoundingClientRect(),o=i.initial.input;t(n,Math.max(0,Math.min(r.width,o.clientX-r.left)),Math.max(0,Math.min(r.height,o.clientY-r.top)))}this.eventBus.dispatchEvent("block-drag-on-generate-preview",{sourceId:e.canvasId,sourceType:Ce.CANVAS,blockId:e.blockId,blockType:e.blockType})},onDragStart:()=>{e.blockId,this.eventBus.dispatchEvent("block-drag-started",{sourceId:e.canvasId,sourceType:Ce.CANVAS,blockId:e.blockId,blockType:e.blockType,canvasId:e.canvasId}),e.style.opacity="0.5"},onDrop:()=>{e.blockId,e.style.opacity="1"},canDrag:()=>{const t={sourceType:Ce.CANVAS,sourceId:e.canvasId,blockType:e.blockType,blockId:e.blockId};e.blockId;const i=this.restrictionManager.canStartDrag(t);return i.allowed?(e.blockId,!0):(i.reason,i.message,this.eventBus.dispatchEvent("block-rejected",{blockType:e.blockType,blockId:e.blockId,sourceZoneId:e.canvasId,reason:i.reason,message:i.message||"Drag operation not allowed",element:e}),this.shakeAnimator.playShake(e),!1)}});this.draggables.set(e,t),e.blockId}detachFromBlock(e){const t=this.draggables.get(e);t&&(e.blockId,t(),this.draggables.delete(e))}destroy(){this.draggables.forEach(e=>e()),this.draggables.clear()}}class Le{constructor(){this.sourceAllowlist=new Map,this.blockTypeRestrictions=new Map,this.containerAcceptance=new Map,this.boundBlocks=new Set,this.transferRules=[]}setRestrictions(e){e.sourceAllowlist&&(this.sourceAllowlist=e.sourceAllowlist),e.blockTypeRestrictions&&(this.blockTypeRestrictions=e.blockTypeRestrictions),e.containerAcceptance&&(this.containerAcceptance=e.containerAcceptance),e.boundBlocks&&(this.boundBlocks=e.boundBlocks)}setTransferRules(e){this.transferRules=e}canStartDrag(e,t){return t&&this.boundBlocks.has(t)?{allowed:!1,reason:Me.BOUND_BLOCK_LOCKED,message:"This block is locked and cannot be moved"}:{allowed:!0}}canDropInCanvas(e,t){if(this.sourceAllowlist.has(t)){if(!this.sourceAllowlist.get(t).has(e.sourceId))return{allowed:!1,reason:Me.SOURCE_NOT_ALLOWED,message:"Blocks from this source cannot be dropped in this canvas"}}if(this.blockTypeRestrictions.has(t)){if(!this.blockTypeRestrictions.get(t).has(e.blockType))return{allowed:!1,reason:Me.BLOCK_TYPE_NOT_ALLOWED,message:"This block type is not allowed in this canvas"}}return{allowed:!0}}canNestInContainer(e,t,i=null){if(i&&i.length>0&&!i.includes(e.blockType))return{allowed:!1,reason:Me.CONTAINER_REFUSES,message:"This container does not accept this block type"};if(this.containerAcceptance.has(t)){if(!this.containerAcceptance.get(t).has(e.blockType))return{allowed:!1,reason:Me.CONTAINER_REFUSES,message:"This container type does not accept this block"}}return{allowed:!0}}canTransferBetweenCanvases(e,t,i){if(t===i)return{allowed:!0};if(0===this.transferRules.length)return{allowed:!0};for(const n of this.transferRules){const r=n.sourceCanvasId===t&&n.targetCanvasId===i,o=n.bidirectional&&n.sourceCanvasId===i&&n.targetCanvasId===t;if(r||o)return n.allowedBlockTypes&&n.allowedBlockTypes.length>0&&!n.allowedBlockTypes.includes(e.blockType)?{allowed:!1,reason:Me.TRANSFER_NOT_ALLOWED,message:"This block type cannot be transferred between these canvases"}:{allowed:!0}}return{allowed:!1,reason:Me.TRANSFER_NOT_ALLOWED,message:"Transfer between these canvases is not allowed"}}addBoundBlock(e){this.boundBlocks.add(e)}removeBoundBlock(e){this.boundBlocks.delete(e)}}class Be{constructor(e,t){this.restrictionManager=e,this.eventBus=t,this.dropTargets=new Map}register(e){this.dropTargets.has(e.dropElement)?console.warn(`[${this.getAdapterName()}] Drop target already registered, skip: `,e.dropElement):(this.getAdapterName(),e.dropId,this._attachDropTarget(e))}unregister(e){const t=this.dropTargets.get(e.dropElement);t&&(t(),this.dropTargets.delete(e.dropElement))}destroy(){this.dropTargets.forEach(e=>e()),this.dropTargets.clear()}_attachDropTarget(e){const t=F({element:e.dropElement,canDrop:({source:t})=>{const i=t.data;return this._canDrop(i,e)},getData:({input:t,element:i})=>{const n=this._getBlockChildren(i),r=this._getDropTargetData(e),o=this._getBlockedInstructions(e,n.length),s={"reorder-before":o.includes("reorder-before")?"not-available":"available","reorder-after":o.includes("reorder-after")?"not-available":"available",combine:o.includes("combine")?"not-available":"available"};return W(r,{input:t,element:i,axis:"vertical",operations:s})}});this.dropTargets.set(e.dropElement,t)}_getBlockChildren(e){return Array.from(e.children).filter(e=>e instanceof Te)}_getBlockedInstructions(e,t){return[]}}class Ee extends Be{constructor(e,t){super(e,t)}registerBlock(e){this.register(e)}unregisterBlock(e){this.unregister(e)}getAdapterName(){return"BlockDropAdapter"}_canDrop(e,t){const i=this.restrictionManager.canDropInCanvas(e,t.canvasId);return e.blockId!==t.blockId&&i.allowed}_getDropTargetData(e){return{type:Pe.BLOCK,canvasId:e.canvasId,targetBlockId:e.dropId,targetBlockType:e.blockType}}_getBlockedInstructions(e,t){return["combine"]}}class De extends Be{constructor(e,t){super(e,t)}registerCanvas(e){this.register(e)}unregisterCanvas(e){this.unregister(e)}getAdapterName(){return"CanvasAdapter"}_canDrop(e,t){return this.restrictionManager.canDropInCanvas(e,t.dropId).allowed}_getDropTargetData(e){return{type:Pe.CANVAS,canvasId:e.dropId}}_getBlockedInstructions(e,t){return 0==t?["reorder-before","reorder-after"]:["combine","reorder-before","reorder-after"]}}class Re extends Be{constructor(e,t){super(e,t)}attachToContainer(e){this.register(e)}unregisterContainer(e){this.unregister(e)}getAdapterName(){return"ContainerAdapter"}_canDrop(e,t){return this.restrictionManager.canNestInContainer(e,t.blockType,t.blockTypesAcceptedAsChildren).allowed}_getDropTargetData(e){return{type:Pe.CONTAINER,canvasId:e.canvasId,targetBlockId:e.dropId,targetBlockType:e.blockType}}_getBlockedInstructions(e,t){const i=e.getBlockedDropInstructions();return null!==i?i:[]}}function Oe(e,t){const i=new CSSStyleSheet;i.replaceSync(t),e.adoptedStyleSheets=[...e.adoptedStyleSheets,i]}const Ne="\n@keyframes dnd-shake {\n  0%, 100% { transform: translateX(0); }\n  25% { transform: translateX(-4px); }\n  50% { transform: translateX(4px); }\n  75% { transform: translateX(-4px); }\n}\n\n.dnd-shaking {\n  animation: dnd-shake 0.4s ease-in-out;\n}\n";class ze{constructor(){this.injectedRoots=new WeakSet}playShake(e){this._ensureStyles(e),e.classList.add("dnd-shaking");const t=()=>{e.classList.remove("dnd-shaking"),e.removeEventListener("animationend",t)};e.addEventListener("animationend",t)}destroy(){}_ensureStyles(e){const t=e.getRootNode();if(t instanceof ShadowRoot&&!this.injectedRoots.has(t))Oe(t,Ne),this.injectedRoots.add(t);else if(t instanceof Document&&!document.getElementById("dnd-shake-styles")){const e=document.createElement("style");e.id="dnd-shake-styles",e.textContent=Ne,document.head.appendChild(e)}}}class Ve{constructor(e,t,i){this.restrictionManager=e,this.shakeAnimator=t,this.eventBus=i,this.zones=new Map,this.cleanupFunctions=new Map}registerZone(e){this.zones.has(e.sourceId)?console.warn(`Source zone ${e.sourceId} already registered`):(this.zones.set(e.sourceId,e),this._attachDraggables(e))}destroy(){this.cleanupFunctions.forEach(e=>{e.forEach(e=>e())}),this.cleanupFunctions.clear(),this.zones.clear()}_attachDraggables(e){const t=[];e.sourceElement.querySelectorAll(Ie).forEach(i=>{if(!(i instanceof HTMLElement))return;const n=i.getAttribute("block-type")||i.dataset.blockType;if(n)if(!e.sourceAllowedBlockTypes||e.sourceAllowedBlockTypes.includes(n))try{const r={sourceId:e.sourceId,sourceType:Ce.SOURCE_ZONE,blockType:n},o=V({element:i,getInitialData:()=>r,onGenerateDragPreview:()=>{this.eventBus.dispatchEvent("block-drag-on-generate-preview",{sourceId:e.sourceId,sourceType:Ce.SOURCE_ZONE,blockType:n})},canDrag:()=>{const t=this.restrictionManager.canStartDrag(r);return!!t.allowed||(t.reason,t.message,this.eventBus.dispatchEvent("block-rejected",{blockType:n,sourceZoneId:e.sourceId,reason:t.reason,message:t.message||"Drag operation not allowed",element:i}),this.shakeAnimator.playShake(i),!1)}});t.push(o)}catch(r){console.error(`[SourceAdapter] Error attaching draggable to ${n}:`,r)}else e.sourceId;else console.warn("[SourceAdapter] Block missing data-block-type:",i)}),t.length,this.cleanupFunctions.set(e.sourceId,t)}}class Fe{constructor(){this.transferRules=[],this.blockOwnership=new Map}setRules(e){this.transferRules=e}getRules(){return this.transferRules}canTransfer(e,t,i){if(e===t)return!0;if(0===this.transferRules.length)return!0;for(const n of this.transferRules){const r=n.sourceCanvasId===e&&n.targetCanvasId===t,o=n.bidirectional&&n.sourceCanvasId===t&&n.targetCanvasId===e;if(r||o)return!(n.allowedBlockTypes&&n.allowedBlockTypes.length>0)||n.allowedBlockTypes.includes(i)}return!1}trackBlock(e,t){this.blockOwnership.set(e,t)}untrackBlock(e){this.blockOwnership.delete(e)}getBlockCanvas(e){return this.blockOwnership.get(e)}destroy(){this.transferRules=[],this.blockOwnership.clear()}}const We="\n.dnd-drop-indicator {\n  position: absolute;\n  background: var(--dnd-indicator-color, #0078d4);\n  pointer-events: none;\n  z-index: 10000;\n  border-radius: var(--dnd-indicator-radius, 2px);\n  transition: margin-left 0.15s ease-out;\n}\n\n.dnd-drop-indicator.dnd-edge-top,\n.dnd-drop-indicator.dnd-edge-bottom {\n  height: 2px;\n  left: 0;\n  right: 0;\n}\n\n.dnd-drop-indicator.dnd-edge-top {\n  top: -1px;\n}\n\n.dnd-drop-indicator.dnd-edge-bottom {\n  bottom: -1px;\n}\n\n.dnd-drop-indicator.dnd-edge-left,\n.dnd-drop-indicator.dnd-edge-right {\n  width: 2px;\n  top: 0;\n  bottom: 0;\n}\n\n.dnd-drop-indicator.dnd-edge-left {\n  left: -1px;\n}\n\n.dnd-drop-indicator.dnd-edge-right {\n  right: -1px;\n}\n\n.dnd-drop-indicator-indented {\n  box-shadow: 0 0 0 1px rgba(0, 120, 212, 0.3);\n}\n";class je{constructor(){this.indicator=null,this.currentParent=null,this.injectedRoots=new WeakSet}show(e,t,i=0){var n;if(!t)return void this.hide();this._ensureStyles(e),this.indicator||(this.indicator=document.createElement("div"),this.indicator.className="dnd-drop-indicator"),this.indicator.className=`dnd-drop-indicator dnd-edge-${t}`,i>0&&(this.indicator.className+=" dnd-drop-indicator-indented");const r=this._getIndicatorParent(e);r&&r!==this.currentParent&&(this.currentParent&&this.indicator.parentNode===this.currentParent&&this.currentParent.removeChild(this.indicator),this.currentParent=r),this.currentParent&&!this.indicator.parentNode&&(this.currentParent instanceof ShadowRoot?this.currentParent.appendChild(this.indicator):"top"===t?this.currentParent.insertBefore(this.indicator,e):e.nextSibling?this.currentParent.insertBefore(this.indicator,e.nextSibling):this.currentParent.appendChild(this.indicator));const o=e.getBoundingClientRect(),s=this.currentParent instanceof ShadowRoot?this.currentParent.host.getBoundingClientRect():null==(n=this.currentParent)?void 0:n.getBoundingClientRect();if(s){const e=o.left-s.left,n=o.top-s.top,r=20*i;"top"===t||"bottom"===t?(this.indicator.style.left=`${e+r}px`,this.indicator.style.width=o.width-r+"px",this.indicator.style.top="top"===t?`${n}px`:n+o.height-2+"px"):(this.indicator.style.top=`${n}px`,this.indicator.style.height=`${o.height}px`,this.indicator.style.left="left"===t?`${e}px`:`${e+o.width}px`)}}hide(){this.indicator&&this.indicator.parentNode&&this.indicator.parentNode.removeChild(this.indicator),this.currentParent=null}destroy(){this.hide(),this.indicator=null}_ensureStyles(e){const t=e.getRootNode();if(t instanceof ShadowRoot&&!this.injectedRoots.has(t))Oe(t,We),this.injectedRoots.add(t);else if(t instanceof Document&&!document.getElementById("dnd-indicator-styles")){const e=document.createElement("style");e.id="dnd-indicator-styles",e.textContent=We,document.head.appendChild(e)}}_getIndicatorParent(e){if(e.parentElement)return e.parentElement;const t=e.getRootNode();return t instanceof ShadowRoot?t:null}}const Ge=class e{constructor(e){this.autoScrollCleanup=null,this.monitorCleanup=null,this.autoScrollInitialized=!1,this.activeDropTargetElement=null,this.autoScrollConfig={maxScrollSpeed:"standard",startEdgeThreshold:30},this._applyEventRetargetingPatch(),this.eventBus=e,this.restrictionManager=new Le,this.transferManager=new Fe,this.dropIndicator=new je,this.shakeAnimator=new ze,this.sourceAdapter=new Ve(this.restrictionManager,this.shakeAnimator,this.eventBus),this.canvasAdapter=new De(this.restrictionManager,this.eventBus),this.blockDropAdapter=new Ee(this.restrictionManager,this.eventBus),this.blockDraggableAdapter=new $e(this.restrictionManager,this.shakeAnimator,this.eventBus),this.containerAdapter=new Re(this.restrictionManager,this.eventBus),this._setupMonitor()}registerSourceZone(e){e.sourceId,this.sourceAdapter.registerZone(e)}registerCanvas(e){e.dropId,this.canvasAdapter.registerCanvas(e)}registerBlock(e){e.isBlockDroppable&&(e.isBlockContainer?this.containerAdapter.attachToContainer(e):this.blockDropAdapter.registerBlock(e)),e.isBlockDraggable&&this.blockDraggableAdapter.attachToBlock(e),e.blockId,e.isBlockContainer,e.isBlockDraggable,e.isBlockDroppable}unregisterBlock(e){e.blockId,this.blockDropAdapter.unregisterBlock(e),this.blockDraggableAdapter.detachFromBlock(e),this.containerAdapter.unregisterContainer(e)}setRestrictions(e){this.restrictionManager.setRestrictions(e)}enableCrossCanvasTransfer(e){this.transferManager.setRules(e),this.restrictionManager.setTransferRules(e)}setAutoScrollConfig(e,t){this.autoScrollElement=e,this.autoScrollConfig={...this.autoScrollConfig,...t},this.autoScrollInitialized&&this.autoScrollCleanup&&this.autoScrollCleanup(),this._setupAutoScroll()}addBoundBlock(e){this.restrictionManager.addBoundBlock(e)}removeBoundBlock(e){this.restrictionManager.removeBoundBlock(e)}destroy(){this.sourceAdapter.destroy(),this.canvasAdapter.destroy(),this.blockDropAdapter.destroy(),this.blockDraggableAdapter.destroy(),this.containerAdapter.destroy(),this.dropIndicator.destroy(),this.shakeAnimator.destroy(),this.transferManager.destroy(),this.monitorCleanup&&(this.monitorCleanup(),this.monitorCleanup=null),this.autoScrollCleanup&&(this.autoScrollCleanup(),this.autoScrollCleanup=null)}_applyEventRetargetingPatch(){if(e._isEventRetargetingPatchApplied)return void console.warn("[DragDropManager] Event retargeting patch already applied");const t=(e,t)=>{const i=function(e,t){var i;if(!e)return null;let n=e;for(;n;){if(null==(i=n.matches)?void 0:i.call(n,t))return n;if(n.parentElement)n=n.parentElement;else{const e=n.getRootNode();if(!(e instanceof ShadowRoot&&e.host))break;n=e.host}}return null}(e.composedPath()[0],t);let n=i;t===Ie&&i instanceof Te&&(n=i.resolveDragSource()),n&&e.target!==n&&Object.defineProperty(e,"target",{value:n,enumerable:!0,configurable:!0})};["dragstart","drag","dragend"].forEach(e=>{window.addEventListener(e,e=>t(e,Ie),{capture:!0})}),["dragenter","dragover","dragleave","drop"].forEach(e=>{window.addEventListener(e,e=>t(e,'[data-dnd-drop-target="true"]'),{capture:!0})})}_setupMonitor(){this.monitorCleanup=j({onDrag:({source:e,location:t})=>{var i;const n=t.current.dropTargets;if(0===n.length)return this._setActiveDropTarget(null),void this.dropIndicator.hide();const r=e.element,o=n.find(e=>{const t=e.element;return!this._isTargetDescendantOfSource(r,t)});if(!o)return this._setActiveDropTarget(null),void this.dropIndicator.hide();const s=o.element,a=o.data,l=G(o.data),c=l?{operation:l.operation,blocked:l.blocked}:void 0;if(this._setActiveDropTarget(s,a,c),!(null==(i=s.shouldShowDropIndicator)?void 0:i.call(s)))return void this.dropIndicator.hide();if(!l||l.blocked)return void this.dropIndicator.hide();let d=null;switch(l.operation){case"reorder-before":case"combine":d="top";break;case"reorder-after":d="bottom"}if(d&&s){const e=0;this.dropIndicator.show(s,d,e)}else this.dropIndicator.hide()},onDropTargetChange:({location:e})=>{e.current.dropTargets},onDrop:({source:e,location:t})=>{this._setActiveDropTarget(null),this.dropIndicator.hide();const i=e.data;if(0===t.current.dropTargets.length)return void this.eventBus.dispatchEvent("block-drop-ignored",{blockType:i.blockType,sourceId:i.sourceId,sourceType:i.sourceType});const n=e.element,r=t.current.dropTargets.find(e=>{const t=e.element;return!this._isTargetDescendantOfSource(n,t)});if(!r)return void console.warn("[DragDropManager] Drop rejected: Cannot drop a block inside itself or its descendants");r.element;const o=r.data,s=G(o),a=s?{operation:s.operation,blocked:s.blocked}:void 0,l={blockType:i.blockType,sourceId:i.sourceId,sourceType:i.sourceType,targetCanvasId:o.canvasId,targetBlockId:o.targetBlockId,targetBlockType:o.targetBlockType,targetIsContainer:o.type===Pe.CONTAINER,instruction:a};i.sourceType===Ce.SOURCE_ZONE?this.eventBus.dispatchEvent("block-created",l):this.eventBus.dispatchEvent("block-reordered",{...l,blockId:i.blockId})}})}_isTargetDescendantOfSource(e,t){const i=e.getAttribute("block-id");if(!i)return!1;let n=t;for(;n;){if(n.getAttribute("block-id")===i)return!0;if(n.parentElement)n=n.parentElement;else{if(!n.getRootNode||!n.getRootNode().host)break;n=n.getRootNode().host}}return!1}_setActiveDropTarget(e,t,i){this.activeDropTargetElement!==e&&(this.activeDropTargetElement&&this.eventBus.dispatchEvent("drop-target-hover",{active:!1,targetElement:this.activeDropTargetElement}),this.activeDropTargetElement=e,e&&this.eventBus.dispatchEvent("drop-target-hover",{active:!0,targetElement:e,targetCanvasId:null==t?void 0:t.canvasId,targetBlockId:null==t?void 0:t.targetBlockId,targetBlockType:null==t?void 0:t.targetBlockType,targetIsContainer:(null==t?void 0:t.type)===Pe.CONTAINER,instruction:i}))}_setupAutoScroll(){this.autoScrollCleanup=U({element:this.autoScrollElement,canScroll:({element:e})=>e.scrollHeight>e.clientHeight||e.scrollWidth>e.clientWidth,getConfiguration:()=>({maxScrollSpeed:this.autoScrollConfig.maxScrollSpeed})}),this.autoScrollInitialized=!0}};Ge._isEventRetargetingPatchApplied=!1;let Ue=Ge;const He=e("environment-context"),qe=e("render-scale");function Xe(e){var t;return(null==(t=null==e?void 0:e.themes)?void 0:t.darkMode)?"dark":"light"}const Ye=e("theme-mode");async function Ke(e){const{hass:t,element:i,action:n,trigger:l,entityId:c,eventBus:d,blockId:u,targetId:h,slotId:p,throwOnError:g}=e;if(t)try{await(async(e,t,i,n)=>{if(n||(n={action:"more-info"}),n.confirmation&&(!n.confirmation.exemptions||!n.confirmation.exemptions.some(e=>{var i;return e.user===(null==(i=t.user)?void 0:i.id)}))){r("warning");const e=n.confirmation.text||`Are you sure you want to ${n.action}?`;if(!confirm(e))return}switch(n.action){case"more-info":{const t="entity"in n&&n.entity||i.entity||i.camera_image||i.image_entity;t?o(e,"hass-more-info",{entityId:t}):r("failure");break}case"navigate":if(n.navigation_path){const t="navigation_replace"in n?n.navigation_replace:void 0;a(e,n.navigation_path,t)}else r("failure");break;case"url":n.url_path?window.open(n.url_path):r("failure");break;case"toggle":i.entity?(s(t,i.entity),r("light")):r("failure");break;case"perform-action":case"call-service":{const e="perform_action"in n&&n.perform_action||"service"in n&&n.service||"";if(!e)return void r("failure");const[i,o]=e.split(".",2);await t.callService(i,o,"data"in n&&void 0!==n.data?n.data:"service_data"in n?n.service_data:void 0,"target"in n?n.target:void 0),r("light");break}case"fire-dom-event":o(e,"ll-custom",n)}})(i,t,{entity:c},n)}catch(m){if(console.error("[Actions] Failed to dispatch action:",m),g)throw m}finally{null==d||d.dispatchEvent("block-action",{blockId:u,targetId:h,trigger:l,action:n.action,entityId:c,slotId:p})}}const Qe=new Set(["typography.color","background.backgroundColor","background.backgroundImage","background.boxShadow","border.borderColor","effects.boxShadow","echart.lineColor","echart.areaColor","echart.barColor","echart.pieSliceColor","echart.pieLabelLineColor","svg.stroke","svg.fill"]);function Ze(e,t){const i=`${e}.${t}`;return Qe.has(i)||"color"===t||"fill"===t||"stroke"===t||t.endsWith("Color")}function Je(e){return Boolean(e&&(void 0!==e.value||void 0!==e.binding))}function et(e){return Boolean(e&&(void 0!==e.value||void 0!==e.binding))}function tt(e,t,i,n){var r;return!!e&&(t&&Ze(i,n)&&Je(null==(r=e.themeModes)?void 0:r[t])||et(e))}function it(e){return null==e?e:"function"==typeof structuredClone?structuredClone(e):JSON.parse(JSON.stringify(e))}function nt(e){const t={};if("value"in e&&(t.value=it(e.value)),"unit"in e&&(t.unit=e.unit),"binding"in e&&(t.binding=it(e.binding)),e.themeModes){t.themeModes={};for(const[i,n]of Object.entries(e.themeModes))n&&(t.themeModes[i]={},"value"in n&&(t.themeModes[i].value=it(n.value)),"unit"in n&&(t.themeModes[i].unit=n.unit),"binding"in n&&(t.themeModes[i].binding=it(n.binding)))}return t}function rt(e,t){if(!e)return t||{};if(!t)return e;const i={...e};for(const n of Object.keys(t)){const r=e[n],o=t[n];o&&(i[n]=r?{...r,...o}:{...o})}return i}function ot(e,t){if(!e)return t||{containers:{}};if(!t)return e;const i={containers:{}},n=new Set([...Object.keys(e.containers),...Object.keys(t.containers)]);for(const r of n)i.containers[r]=rt(e.containers[r],t.containers[r]);return i}const st=e("hass");var at=Object.defineProperty,lt=(e,t,i,n)=>{for(var r,o=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&at(t,i,o),o};const ct=class extends Te{constructor(){super(...arguments),this.isDragging=!1,this.isResizing=!1,this.canvasWidth=0,this.canvasHeight=0,this.selected=!1,this.templateSessions=new Map,this.actionHoldDelay=1e3,this.actionDoubleTapDelay=250,this._holdTimeoutId=null,this._tapTimeoutId=null,this._lastTapTimestamp=0,this._lastTapTarget=null,this._holdTriggered=!1,this._pointerId=null,this._pressTarget=null,this._pressStartX=0,this._pressStartY=0,this._pointerMoved=!1,this._feedbackTimeoutId=null,this._actionListenersActive=!1,this._handlePointerDown=e=>{if(!this._shouldHandleActions(e))return;const t=this._resolveActionTarget(e);if(t&&this._hasAnyConfiguredActionForTarget(t)){this._pointerId=e.pointerId,this._pressTarget=t,this._pressStartX=e.clientX,this._pressStartY=e.clientY,this._pointerMoved=!1,this._holdTriggered=!1;const{hasHold:i,hasDoubleTap:n,hasTap:r}=this._getActionTriggerFlags(t);if(n&&r&&this._tapTimeoutId&&this._lastTapTarget===this._pressTarget){performance.now()-this._lastTapTimestamp<this.actionDoubleTapDelay&&this._clearTapTimer()}return i&&this._pressTarget&&(this._clearHoldTimer(),this._holdTimeoutId=window.setTimeout(()=>{this._holdTriggered=!0,this._clearTapTimer(),this._lastTapTimestamp=0,this._lastTapTarget=null,this._executeAction("hold",this._pressTarget)},this.actionHoldDelay)),void(this.setPointerCapture&&this.setPointerCapture(e.pointerId))}const i=this._resolveRawTarget(e);this.handleNativePointerDown(e,i)},this._handlePointerMove=e=>{if(null===this._pointerId||e.pointerId!==this._pointerId)return;const t=e.clientX-this._pressStartX,i=e.clientY-this._pressStartY;Math.hypot(t,i)>6&&(this._pointerMoved=!0,this._clearHoldTimer())},this._handlePointerUp=e=>{if(null===this._pointerId||e.pointerId!==this._pointerId)return;if(this._clearHoldTimer(),!this.areActionsEnabled())return void this._resetPointerState(e.pointerId);if(this._holdTriggered||this._pointerMoved)return void this._resetPointerState(e.pointerId);const t=this._pressTarget||this._resolveActionTarget(e);if(!t||!this._hasAnyConfiguredActionForTarget(t))return void this._resetPointerState(e.pointerId);const{hasTap:i,hasDoubleTap:n}=this._getActionTriggerFlags(t);if(n){const e=performance.now();this._lastTapTimestamp>0&&e-this._lastTapTimestamp<this.actionDoubleTapDelay&&this._lastTapTarget===t?(this._clearTapTimer(),this._lastTapTimestamp=0,this._lastTapTarget=null,this._executeAction("double_tap",t)):(this._lastTapTimestamp=e,this._lastTapTarget=t,i&&(this._tapTimeoutId=window.setTimeout(()=>{this._executeAction("tap",t),this._lastTapTimestamp=0,this._lastTapTarget=null,this._tapTimeoutId=null},this.actionDoubleTapDelay)))}else i&&(this._clearTapTimer(),this._lastTapTimestamp=0,this._lastTapTarget=null,this._executeAction("tap",t));this._resetPointerState(e.pointerId)},this._handlePointerCancel=e=>{null!==this._pointerId&&e.pointerId!==this._pointerId||(this._clearHoldTimer(),this._resetPointerState(e.pointerId))}}get isBlockDraggable(){return!!this.block&&"static"!==this.block.layout}get isBlockDroppable(){return!!this.block&&"static"!==this.block.layout}resolveDragSource(){var e;if(this.selected)return this;const t=this.documentModel.selectedId;if(!t)return this;let i=(null==(e=this.block)?void 0:e.parentId)??null;for(;i;){if(t===i){const e=this.documentModel.getElement(i);if(e instanceof Te)return e;break}const e=this.documentModel.getBlock(i);i=(null==e?void 0:e.parentId)??null}return this}get slotId(){var e,t;return null==(t=null==(e=this.block)?void 0:e.entityConfig)?void 0:t.slotId}static getBlockConfig(){return null}static getAvailableActionTargetIds(e,t){return Object.keys(t)}static getStyleOutputConfig(e,t){return null}hasNativeActions(){return!1}getNativeActionTargetIds(){return[]}handleNativePointerDown(e,t){return!1}getPanelConfig(){return{}}connectedCallback(){var e;super.connectedCallback(),this.entity=this.resolvedEntityId(),this.selected=this.documentModel.selectedId===(null==(e=this.block)?void 0:e.id),this.environment.isBuilder&&(this.documentModel.addEventListener("change",e=>{var t;(null==(t=(null==e?void 0:e.detail).block)?void 0:t.parentId)===this.block.id&&this.requestUpdate()}),this.documentModel.addEventListener("block-moved",e=>{const t=e.detail;t.oldParentId!==this.block.id&&t.newParentId!==this.block.id||this.requestUpdate()}),this.documentModel.addEventListener("selection-changed",e=>{const t=e.detail;this.selected=this.block.id===t.selectedId,this.activeStyleTargetId=this.selected?this.documentModel.getSelectedStyleTargetId():null,this.selected?this.classList.add("block-selected"):this.classList.remove("block-selected")}),this.documentModel.addEventListener("style-target-changed",e=>{const t=e.detail,i=(null==t?void 0:t.selectedId)===this.block.id;this.activeStyleTargetId=i?(null==t?void 0:t.targetId)??null:null}),this.documentModel.addEventListener("link-anchor-highlight-changed",e=>{const t=e.detail;this.classList.toggle("block-anchor-highlight",this.block.id===(null==t?void 0:t.blockId))}),this.documentModel.addEventListener("slots-changed",()=>{const e=this.resolvedEntityId();this.entity!==e&&(this.entity=e),this.requestUpdate()}),this.eventBus.addEventListener("block-drag-start",({block:e})=>{e.id===this.block.id&&(this.isDragging=!0)}),this.eventBus.addEventListener("block-drag-end",({block:e})=>{e.id===this.block.id&&(this.isDragging=!1)}),this.eventBus.addEventListener("block-resize-start",({block:e})=>{e.id===this.block.id&&(this.isResizing=!0)}),this.eventBus.addEventListener("block-resize-end",({block:e})=>{e.id===this.block.id&&(this.isResizing=!1)}),this.eventBus.addEventListener("block-selection-disabled",e=>{if(!this.block)return;const t=Boolean(null==e?void 0:e.disabled),i=null==e?void 0:e.excluded;t?i&&this.block.id===i?this.classList.remove("block-selection-disabled"):this.classList.add("block-selection-disabled"):this.classList.remove("block-selection-disabled")}),this.eventBus.addEventListener("drop-target-hover",e=>this._handleDropTargetHover(e))),this.eventBus.addEventListener("canvas-size-changed",({width:e,height:t})=>{this.canvasWidth=e,this.canvasHeight=t}),this._syncActionListeners()}disconnectedCallback(){this._clearActionTimers(),this._removeActionListeners(),this.disposeTemplateSessions(),super.disconnectedCallback()}shouldUpdate(e){var t,i;if(e.has("block")||e.has("entity"))return!0;if(e.has("previewThemeMode"))return!0;if(e.has("renderScale"))return!0;if(e.has("hass")){const i=e.get("hass");if(!i)return!0;if(Xe(i)!==Xe(this.hass))return!0;const n=this.documentModel.getTrackedEntitiesRecursiveFlat(this.block);if(0===n.length)return!1;for(const e of n){if(i.states[e]!==(null==(t=this.hass)?void 0:t.states[e]))return!0}return!1}return(null==(i=super.shouldUpdate)?void 0:i.call(this,e))??!0}willUpdate(e){super.willUpdate(e),this.activeStyleTargetId=this.selected?this.documentModel.getSelectedStyleTargetId():null,this.resolvedRenderContext=this.renderer.resolvedRenderContext(this.block,void 0,this.getPanelConfig().targetStyles),this.canvasWidth=this.resolvedRenderContext.canvasWidth,this.canvasHeight=this.resolvedRenderContext.canvasHeight,e.has("hass")&&this.disposeTemplateSessions(),(e.has("hass")||this.hass&&!this.bindingEvaluator)&&(this.bindingEvaluator=new ne(this.hass,{resolveSlotEntity:e=>this.documentModel.resolveSlotEntity(e),onTemplateResult:()=>this.requestUpdate()}))}firstUpdated(e){super.firstUpdated(e),this.addEventListener("block-rendering-completed",e=>{this.documentModel.isDescendant(this.block.id,e.detail.block.id)&&this.updatePositionFromLayoutData()})}updated(e){var t;super.updated(e),e.has("block")&&this.block&&(this.entity=this.resolvedEntityId(),this.classList.remove(`block-${null==(t=e.get("block"))?void 0:t.layout}`),this.classList.add(`block-${this.block.layout}`)),e.has("block")&&this._syncActionListeners();const i={"block-selected":this.selected,"block-outline-enabled":this.environment.blocksOutlineEnabled,builder:this.environment.isBuilder,"actions-pass-through":this._shouldPassThroughActions()};Object.entries(i).forEach(([e,t])=>{this.classList.toggle(e,Boolean(t))}),this._syncActionTargetPointerEvents();const n=this.getResolvedContextStyles();this.style.cssText=this.stylesToString(n),this.updatePositionFromLayoutData(),this.dispatchEvent(new CustomEvent("block-rendering-completed",{detail:{block:this.block},bubbles:!0,composed:!0}))}getBlockEntities(){var e,t;if(!this.block)return[];if("fixed"===(null==(e=this.block.entityConfig)?void 0:e.mode)&&this.block.entityConfig.entityId)return[this.block.entityConfig.entityId];const i=null==(t=this.documentModel)?void 0:t.resolveEntityForBlock(this.block.id);return(null==i?void 0:i.entityId)?[i.entityId]:[]}updatePositionFromLayoutData(){if(!this.block||"absolute"!==this.block.layout||!this.resolvedRenderContext.layoutData)return;const e=this.renderer.getRuntimeBlockSize(this.block,this.resolvedRenderContext.layoutData),t=this.renderer.getAbsolutePositioningContext(this.block);if(!t)return;const i=this.renderer.blockToMoveable(this.resolvedRenderContext.layoutData,e,t.width,t.height);this.style.left=`${i.left}px`,this.style.top=`${i.top}px`}getResolvedContextStyles(){return this.resolvedRenderContext.styles}resolvedEntityId(){if(!this.block||!this.documentModel)return;return this.documentModel.resolveEntityForBlock(this.block.id).entityId}getEntityState(){return this.hass&&this.entity?this.hass.states[this.entity]:null}isEntityAvailable(){const e=this.getEntityState();return!!e&&"unavailable"!==e.state&&"unknown"!==e.state}getTargetStyle(e){var t,i;return(null==(i=null==(t=this.resolvedRenderContext)?void 0:t.targetStyles)?void 0:i[e])||{}}isStyleTargetActive(e){return this.activeStyleTargetId===e}getActionSlotIds(e){var t,i,n;return(null==(n=null==(i=null==(t=this.block)?void 0:t.actions)?void 0:i.targets)?void 0:n[e])??[]}getResolvedActionSlots(e){return this.getActionSlotIds(e).map(e=>this.documentModel.resolveSlotAction(e)).filter(e=>Boolean(e))}_isActionConfigured(e){return!!e&&"none"!==e.action}_getActionTriggerFlags(e){const t=this.getResolvedActionSlots(e).filter(e=>this._isActionConfigured(e.action));return{hasTap:t.some(e=>"tap"===e.trigger),hasDoubleTap:t.some(e=>"double_tap"===e.trigger),hasHold:t.some(e=>"hold"===e.trigger)}}_hasAnyConfiguredActionForTarget(e){return this.getResolvedActionSlots(e).some(e=>this._isActionConfigured(e.action))}_hasAnyConfiguredAction(){var e,t;const i=null==(t=null==(e=this.block)?void 0:e.actions)?void 0:t.targets;if(!i)return!1;for(const n of Object.keys(i))if(this._hasAnyConfiguredActionForTarget(n))return!0;return!1}_syncActionListeners(){const e=this._hasAnyConfiguredAction()||this.hasNativeActions();e!==this._actionListenersActive&&(e?(this.addEventListener("pointerdown",this._handlePointerDown),this.addEventListener("pointerup",this._handlePointerUp),this.addEventListener("pointermove",this._handlePointerMove),this.addEventListener("pointercancel",this._handlePointerCancel)):(this._removeActionListeners(),this._clearActionTimers(),this._resetPointerState()),this._actionListenersActive=e)}_removeActionListeners(){this.removeEventListener("pointerdown",this._handlePointerDown),this.removeEventListener("pointerup",this._handlePointerUp),this.removeEventListener("pointermove",this._handlePointerMove),this.removeEventListener("pointercancel",this._handlePointerCancel),this._actionListenersActive=!1}_handleDropTargetHover(e){this.classList.toggle("block-drop-target",e&&e.targetElement===this&&e.active)}_executeAction(e,t){if(!this.areActionsEnabled())return;if(!this.block||!this.hass)return;const i=this.resolvedEntityId(),n=this.getResolvedActionSlots(t).filter(t=>t.trigger===e).filter(e=>this._isActionConfigured(e.action));if(0===n.length)return;let r=!1;for(const o of n)this._isActionExecutable(o.action,i)&&(r=!0,Ke({hass:this.hass,element:this,action:o.action,trigger:e,entityId:i,eventBus:this.eventBus,blockId:this.block.id,targetId:t,slotId:o.id}));r&&this._applyActionFeedback()}_isActionExecutable(e,t){if(!this._isActionConfigured(e))return!1;if(("toggle"===e.action||"more-info"===e.action)&&!t)return!1;if("call-service"===e.action||"perform-action"===e.action){if(!Boolean("perform_action"in e&&e.perform_action||"service"in e&&"string"==typeof e.service&&e.service||"domain"in e&&"string"==typeof e.domain&&"service"in e&&"string"==typeof e.service))return!1}return!("navigate"===e.action&&!e.navigation_path)}_applyActionFeedback(){this.classList.add("action-feedback"),this._feedbackTimeoutId&&window.clearTimeout(this._feedbackTimeoutId),this._feedbackTimeoutId=window.setTimeout(()=>{this.classList.remove("action-feedback"),this._feedbackTimeoutId=null},150)}_shouldHandleActions(e){return!!this.areActionsEnabled()&&(!this.isDragging&&!this.isResizing&&(("mouse"!==e.pointerType||0===e.button)&&!this._isInteractiveElement(e.target)))}areActionsEnabled(){var e;return Boolean(null==(e=this.environment)?void 0:e.actionsEnabled)}_shouldPassThroughActions(){return!!this.areActionsEnabled()&&(!this.hasNativeActions()&&!this._hasAnyConfiguredAction())}_resolveActionTarget(e){var t;const i=e.composedPath();for(const n of i){if(n===this)break;if(n instanceof HTMLElement){const e=null==(t=n.dataset)?void 0:t.actionTarget;if(e&&this._hasAnyConfiguredActionForTarget(e))return e}}return this._hasAnyConfiguredActionForTarget("block")?"block":null}_resolveRawTarget(e){var t;const i=e.composedPath();for(const n of i){if(n===this)break;if(n instanceof HTMLElement){const e=null==(t=n.dataset)?void 0:t.actionTarget;if(e)return e}}return"block"}_syncActionTargetPointerEvents(){var e,t;const i=new Set(this.getNativeActionTargetIds()),n=null==(t=null==(e=this.renderRoot)?void 0:e.querySelectorAll)?void 0:t.call(e,"[data-action-target]");n&&n.forEach(e=>{var t;if(!(e instanceof HTMLElement))return;const n=null==(t=e.dataset)?void 0:t.actionTarget;if(!n)return;const r=this._hasAnyConfiguredActionForTarget(n)||i.has(n);e.style.pointerEvents=r?"":"none"})}_isInteractiveElement(e){if(!e)return!1;if(e.isContentEditable)return!0;const t=e.tagName.toLowerCase();return!!["input","textarea","select","button","a"].includes(t)||!!e.closest('input, textarea, select, button, a, [contenteditable="true"]')}_resetPointerState(e){if(void 0!==e&&this.releasePointerCapture)try{this.releasePointerCapture(e)}catch{}this._pointerId=null,this._pressTarget=null,this._pressStartX=0,this._pressStartY=0,this._pointerMoved=!1,this._holdTriggered=!1}_clearHoldTimer(){this._holdTimeoutId&&(window.clearTimeout(this._holdTimeoutId),this._holdTimeoutId=null)}_clearTapTimer(){this._tapTimeoutId&&(window.clearTimeout(this._tapTimeoutId),this._tapTimeoutId=null)}_clearActionTimers(){this._clearHoldTimer(),this._clearTapTimer(),this._feedbackTimeoutId&&(window.clearTimeout(this._feedbackTimeoutId),this._feedbackTimeoutId=null)}stylesToString(e){return Object.entries(e).map(([e,t])=>`${e.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${t}`).join("; ")}resolveRawValue(e,t=""){return this.resolveRawValueWithTemplate(e,t)}resolveRawValueWithTemplate(e,t="",i){if(null==e)return String(t);if("object"==typeof e){if("value"in e&&"isTemplate"in e){const n=e;if(n.isTemplate){const e=(null==i?void 0:i.keywords)?function(e){if(!e||0===e.length)return{};const t={};for(const i of e)t[i.key]=i.value;return t}(i.keywords):{},t={...(null==i?void 0:i.variables)??{},...e};return this.resolveTemplateString((null==i?void 0:i.key)??n.value,n.value,t,null==i?void 0:i.debounceMs)}return n.value??t}if("binding"in e||"value"in e&&!("isTemplate"in e)){const i=e,n=i.value??t;if(i.binding&&this.bindingEvaluator){const e=this.bindingEvaluator.evaluate(i.binding,{defaultEntityId:this.resolvedEntityId(),defaultValue:n});return String(e.value??n)}return String(n)}}else if("string"==typeof e)return e;return String(t)}resolveRawValueAsNumber(e,t){const i=this.resolveRawValueWithTemplate(e,t),n=parseFloat(i);return Number.isNaN(n)?t:n}resolveRawValueAsBoolean(e,t=!1){const i=this.resolveRawValueWithTemplate(e,t),n=i.trim().toLowerCase();if("true"===n)return!0;if("false"===n)return!1;const r=parseFloat(i);return Number.isNaN(r)?t:0!==r}resolveProperty(e,t,i){const n=this.getPropertyValue(e);return this.resolveRawValueWithTemplate(n,t,{...i,key:(null==i?void 0:i.key)??e})}resolvePropertyAsNumber(e,t,i){const n=this.resolveRawValueWithTemplate(this.getPropertyValue(e),t,{...i,key:(null==i?void 0:i.key)??e}),r=parseFloat(n);return Number.isNaN(r)?t:r}resolvePropertyAsBoolean(e,t=!1,i){const n=this.resolveRawValueWithTemplate(this.getPropertyValue(e),t,{...i,key:(null==i?void 0:i.key)??e}),r=n.trim().toLowerCase();if("true"===r)return!0;if("false"===r)return!1;const o=parseFloat(n);return Number.isNaN(o)?t:0!==o}resolveTemplateString(e,t,i,n){var r;const o=null==t?void 0:t.trim();if(!this.hass||!o)return this.disposeTemplateSession(e),"";const s=this.getTemplateSession(e);s.update({template:o,variables:i,reportErrors:!0,debounceMs:n});return s.getError()?Q:(null==(r=s.getResult())?void 0:r.result)??""}getTemplateSession(e){let t=this.templateSessions.get(e);return t||(t=new te(this.hass,{onResult:()=>this.requestUpdate(),onError:()=>this.requestUpdate()}),this.templateSessions.set(e,t)),t}disposeTemplateSession(e){const t=this.templateSessions.get(e);t&&(t.dispose(),this.templateSessions.delete(e))}disposeTemplateSessions(){for(const e of this.templateSessions.values())e.dispose();this.templateSessions.clear()}getPropertyValue(e){var t,i;const n=null==(i=null==(t=this.block)?void 0:t.props)?void 0:i[e];if(!n||"object"!=typeof n)return;return"value"in n||"binding"in n?n:void 0}};ct.styles=[l`
            :host {
                display: block;
                user-select: none;
                outline-offset: -2px;
                box-sizing: border-box;
                pointer-events: auto;
                line-height: normal;
                padding: 4px;
                transition:
                    /* all 0.5s ease, */ /* FIXME: This may be very dangerous, we must add transition only for some properties */
                    color 0.35s ease,
                    border-color 0.35s ease,
                    box-shadow 0.35s ease,
                    background 0.35s ease,
                    background-color 0.35s ease,
                    background-image 0.35s ease,
                    background-size 0.35s ease,
                    background-position 0.35s ease,
                    width 0.35s ease,
                    height 0.35s ease,
                    opacity 0.15s ease,
                    outline 0.15s ease;
            }

            :host(.block-absolute) {
                position: absolute;
            }

            :host(.block-flow) {
                position: relative;
                width: auto;
            }

            :host(.block-outline-enabled) {
                outline: 1px dashed rgba(100, 100, 100, 0.75);
            }
            
            :host(.block-selected) {
                transition: none !important;
                outline: 2px solid var(--accent-color, #0078d4);
                z-index: 1000;
            }

            :host(.block-anchor-highlight) {
                outline: 2px solid #ffc107 !important;
                outline-offset: 1px;
                box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.2);
                transition: none !important;
                z-index: 999;
            }

            :host(.block-drop-target)::after {
                position: absolute;
                content: '';
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1000;
                background: rgba(0, 0, 0, 0.25);
                border: 1px dashed var(--accent-color, #0078d4);
                box-sizing: border-box;
            }
            
            :host(.builder:hover) {
                cursor: pointer;
            }

            :host(.snap-highlight) {
                outline: 1px solid #ff4081 !important;
                outline-offset: 1px !important;
                box-shadow: 0 0 0 4px rgba(255, 64, 129, 0.15) !important;
                transition: none !important;
                z-index: 999;
            }

            .style-target-active {
                outline: 1px dashed var(--accent-color, #0078d4);
                outline-offset: 2px;
                box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.12);
            }

            :host(.actions-pass-through) {
                pointer-events: none;
            }

            :host(.block-selection-disabled) {
                pointer-events: none;
            }

            :host(.action-feedback) {
                opacity: 0.7;
                transition: opacity 0.15s ease;
            }
        `];let dt=ct;lt([n({context:He,subscribe:!0}),c()],dt.prototype,"environment"),lt([n({context:Y})],dt.prototype,"renderer"),lt([n({context:me})],dt.prototype,"documentModel"),lt([n({context:xe})],dt.prototype,"containerManager"),lt([n({context:q})],dt.prototype,"eventBus"),lt([n({context:st,subscribe:!0}),i({attribute:!1})],dt.prototype,"hass"),lt([n({context:Ye,subscribe:!0}),c()],dt.prototype,"previewThemeMode"),lt([n({context:qe,subscribe:!0}),c()],dt.prototype,"renderScale"),lt([i({type:Object})],dt.prototype,"block"),lt([i({type:String})],dt.prototype,"activeContainerId"),lt([c()],dt.prototype,"entity"),lt([c()],dt.prototype,"activeStyleTargetId"),lt([c()],dt.prototype,"isDragging"),lt([c()],dt.prototype,"isResizing"),lt([c()],dt.prototype,"canvasWidth"),lt([c()],dt.prototype,"canvasHeight");var ut=Object.getOwnPropertyDescriptor;const ht="mdi:star-outline";let pt=class extends dt{static getBlockConfig(){return{sinceVersion:"1.0.0",definition:{label:"Icon",icon:'<ha-icon icon="mdi:star-outline"></ha-icon>',category:"basic"},defaults:{props:{iconSize:{value:24},iconSource:{value:"list"},icon:{value:ht},iconTemplate:{value:""},preTemplate:{value:""},postTemplate:{value:""}}},entityDefaults:{mode:"inherited"}}}getPanelConfig(){return{properties:{groups:[{id:"icon",label:"Icon",traits:[{type:"number",name:"iconSize",label:"Icon Size",min:12,max:128},{type:"select",name:"iconSource",label:"Icon Source",options:[{value:"list",label:"From List"},{value:"template",label:"From Template"}]},{type:"icon-picker",name:"icon",label:"Icon",placeholder:"mdi:icon-name",visible:{prop:"iconSource",eq:"list"},binding:{type:"icon-picker",placeholder:"mdi:icon-name"}},{type:"text",name:"iconTemplate",label:"Icon Template",placeholder:"{{ 'mdi:lightbulb' if state == 'on' else 'mdi:lightbulb-off' }}",description:"If set, overrides the selected icon.",templateKeywords:Z,visible:{prop:"iconSource",eq:"template"}}]},{id:"templates",label:"Templates",traits:[{type:"text",name:"preTemplate",label:"Pre Template",placeholder:"Text before icon",templateKeywords:Z},{type:"text",name:"postTemplate",label:"Post Template",placeholder:"Text after icon",templateKeywords:Z}]}]},targetStyles:{block:{styles:{preset:"full"}},icon:{label:"Icon",description:"Icon element",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},pre:{label:"Pre Template",description:"Text before the icon",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},post:{label:"Post Template",description:"Text after the icon",styles:{preset:"full",exclude:{groups:["layout","flex"]}}}}}}render(){const e=this.getTemplateVariables(),t=this.resolveProperty("iconSource","list"),i=this.resolveProperty("iconTemplate",""),n=this.resolveProperty("preTemplate",""),r=this.resolveProperty("postTemplate",""),o=this.resolvePropertyAsNumber("iconSize",24),s="template"===t,a=i.trim().length>0,l=n.trim().length>0,c=r.trim().length>0,p=s&&a?this.resolveTemplateString("iconTemplate",i,e):"",g=this.resolveIcon(p,s),m=l?this.resolveTemplateString("preTemplate",n,e):"",v=c?this.resolveTemplateString("postTemplate",r,e):"",y={"--mdc-icon-size":`${o}px`,...this.getTargetStyle("icon")},b=this.getTargetStyle("pre"),f=this.getTargetStyle("post"),k=this.isStyleTargetActive("icon"),x=this.isStyleTargetActive("pre"),w=this.isStyleTargetActive("post");return h`
            ${l?h`
                <span
                    class="icon-template ${x?"style-target-active":""}"
                    style=${u(b)}
                    data-style-target="pre"
                >${m}</span>
            `:d}
            <ha-icon
                class="icon ${k?"style-target-active":""}"
                style=${u(y)}
                data-style-target="icon"
                .icon=${g}
            ></ha-icon>
            ${c?h`
                <span
                    class="icon-template ${w?"style-target-active":""}"
                    style=${u(f)}
                    data-style-target="post"
                >${v}</span>
            `:d}
        `}getTemplateVariables(){const e=this.getEntityState()??void 0;return ee(e,null==e?void 0:e.state)}resolveIcon(e,t){if(t)return e&&e!==Q?e:ht;const i=this.resolveProperty("icon",ht);return i&&i!==Q?i:ht}};pt.styles=[...dt.styles,l`
            :host {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .icon {
                width: var(--mdc-icon-size, 24px);
                height: var(--mdc-icon-size, 24px);
            }
            .icon-template {
                white-space: nowrap;
            }
        `],pt=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?ut(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-icon")],pt);const gt="cb-media://local/card_builder",mt="/local/card_builder";function vt(e){return e===gt||e.startsWith(`${gt}/`)}function yt(e){return vt(e)}function bt(e){return/^https?:\/\//i.test(e)||e.startsWith("data:")||e.startsWith("blob:")}function ft(e){return e.replace(/^\/+/,"").replace(/\/+$/g,"").replace(/\/+/g,"/")}function kt(e){const t=e?ft(e):"";return t?`${gt}/${t}`:gt}function xt(e){return e===gt?"":e.startsWith(`${gt}/`)?e.slice(30):""}function wt(e){if(!e)return"";if(vt(e)){const t=xt(e);if(!t)return"card_builder";const i=t.split("/");return i[i.length-1]||t}if(bt(e))try{const t=new URL(e,window.location.origin),i=t.pathname.replace(/\/+$/g,"").split("/");return i[i.length-1]||e}catch(n){return e}const t=ft(e),i=t.split("/");return i[i.length-1]||t}function St(e){if(vt(e)){const t=ft(xt(e)).replace(/(^|\/)\.\//g,"$1");return t?`${mt}/${t}`:mt}return null}async function _t(e,t){return t?bt(t)?t:vt(t)?St(t):t:null}var Tt=Object.getOwnPropertyDescriptor;let At=class extends dt{static getBlockConfig(){return{sinceVersion:"1.0.0",definition:{label:"Image",icon:'<ha-icon icon="mdi:image-outline"></ha-icon>',category:"basic"},defaults:{props:{imageSource:{value:"none"},imageUrl:{value:""},mediaReference:{value:""},objectFit:{value:"initial"},objectPositionMode:{value:"center"},objectPositionCustom:{value:"center"}}},entityDefaults:{mode:"inherited"}}}getPanelConfig(){return{properties:{groups:[{id:"image",label:"Image",traits:[{type:"select",name:"imageSource",label:"Image Source",options:[{value:"none",label:"None"},{value:"url",label:"Image URL"},{value:"media",label:"Media Library"}]},{type:"text",name:"imageUrl",label:"Image URL",placeholder:"https://example.com/image.png",visible:{prop:"imageSource",eq:"url"},binding:{type:"text",placeholder:"https://example.com/image.png"}},{type:"media-picker",name:"mediaReference",label:"Media",emptyLabel:"No media selected",selectLabel:"Select media",editLabel:"Edit",removeLabel:"Remove",sourceProp:"imageSource",sourceValue:"media",visible:{prop:"imageSource",eq:"media"},binding:{type:"text",placeholder:"cb-media://local/card_builder/..."}},{type:"select",name:"objectFit",label:"Image Fit",options:[{value:"initial",label:"None (Default)"},{value:"contain",label:"Contain (Fit Inside)"},{value:"cover",label:"Cover (Fill & Crop)"},{value:"fill",label:"Stretch (Fill)"},{value:"scale-down",label:"Scale Down Only"},{value:"none",label:"Original Size"}],binding:{type:"select",options:[{value:"initial",label:"None (Default)"},{value:"contain",label:"Contain (Fit Inside)"},{value:"cover",label:"Cover (Fill & Crop)"},{value:"fill",label:"Stretch (Fill)"},{value:"scale-down",label:"Scale Down Only"},{value:"none",label:"Original Size"}]}},{name:"objectPositionMode",label:"Image Position",type:"select",options:[{value:"center",label:"Center"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"left",label:"Left"},{value:"right",label:"Right"},{value:"top left",label:"Top Left"},{value:"top right",label:"Top Right"},{value:"bottom left",label:"Bottom Left"},{value:"bottom right",label:"Bottom Right"},{value:"custom",label:"Custom"}],binding:{type:"select",options:[{value:"center",label:"Center"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"left",label:"Left"},{value:"right",label:"Right"},{value:"top left",label:"Top Left"},{value:"top right",label:"Top Right"},{value:"bottom left",label:"Bottom Left"},{value:"bottom right",label:"Bottom Right"}]}},{type:"text",name:"objectPositionCustom",label:"Custom Position",placeholder:"e.g. 20% 80%",visible:{prop:"objectPositionMode",eq:"custom"},binding:{type:"text",placeholder:"e.g. 20% 80%"}}]}]},targetStyles:{block:{styles:{preset:"full"}}}}}render(){const e=this.getImageSource();if(!e)return h`<div class="empty">No Image Selected</div>`;const t=this.resolveProperty("objectFit","initial"),i=this.getObjectPosition(),n={};return t&&(n.objectFit=t),i&&(n.objectPosition=i),h`<img src="${e}" alt="" style=${u(n)} />`}getImageSource(){const e=this.resolveProperty("imageSource","none");if("none"===e)return null;const t="media"===e?this.resolveProperty("mediaReference",""):this.resolveProperty("imageUrl","");return t?yt(t)?St(t)??null:(bt(t)||t.startsWith("/"),t):null}getObjectPosition(){const e=this.resolveProperty("objectPositionMode","center");return"custom"===e?this.resolveProperty("objectPositionCustom","center"):e||"center"}};At.styles=[...dt.styles,l`
            :host {
                display: block;
                padding: 0;
                overflow: hidden;
            }
            .empty {
                text-align: center;
                padding: 16px;
                color: #000;
            }
            img {
                display: block;
                max-width: 100%;
                max-height: 100%;
                width: 100%;
                height: 100%;
            }
        `],At=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?Tt(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-image")],At);var It=Object.getOwnPropertyDescriptor;let Ct=class extends dt{static getBlockConfig(){return{sinceVersion:"1.0.0",definition:{label:"Text",icon:'<ha-icon icon="mdi:format-text"></ha-icon>',category:"basic"},defaults:{},entityDefaults:{mode:"inherited"}}}getPanelConfig(){return{properties:{groups:[{id:"content",label:"Content",traits:[{type:"text",name:"text",label:"Text",placeholder:"Enter text...",binding:{type:"text",placeholder:"Enter text..."}}]}]},targetStyles:{block:{styles:{preset:"full"}}}}}render(){const e=this.resolveProperty("text","Text");return h`
            <div class="text-content">
                ${e}
            </div>
        `}};function Pt(e){return"minmax"===e.unit&&void 0!==e.minValue&&void 0!==e.maxValue?`minmax(${e.minValue}px, ${e.maxValue}px)`:"auto"===e.unit?"auto":"fr"===e.unit?`minmax(0, ${e.value}fr)`:`${e.value}${e.unit}`}function Mt(e){return e.map(Pt).join(" ")}function $t(e,t="full"){try{const i=new Date(e);if(isNaN(i.getTime()))return String(e);switch(t){case"full":return i.toLocaleString(void 0,{year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});case"long":return i.toLocaleString(void 0,{year:"numeric",month:"long",day:"numeric"});case"medium":return i.toLocaleString(void 0,{year:"numeric",month:"short",day:"numeric"});case"short":return i.toLocaleDateString(void 0,{year:"2-digit",month:"numeric",day:"numeric"});case"time":return i.toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"});case"datetime":return i.toLocaleString(void 0,{year:"2-digit",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit"});case"relative":return function(e){const t=(new Date).getTime()-e.getTime(),i=Math.floor(t/1e3),n=Math.floor(i/60),r=Math.floor(n/60),o=Math.floor(r/24),s=Math.floor(o/7),a=Math.floor(o/30),l=Math.floor(o/365);return i<60?1===i?"1 second ago":`${i} seconds ago`:n<60?1===n?"1 minute ago":`${n} minutes ago`:r<24?1===r?"1 hour ago":`${r} hours ago`:o<7?1===o?"1 day ago":`${o} days ago`:s<4?1===s?"1 week ago":`${s} weeks ago`:a<12?1===a?"1 month ago":`${a} months ago`:1===l?"1 year ago":`${l} years ago`}(i);case"iso":return i.toISOString();default:return i.toLocaleString()}}catch(i){return String(e)}}function Lt(e,t,i=void 0){if(null==e)return i;const n=t.format;if("numeric"===n||"integer"===n){return function(e,t=1){const i=parseFloat(e);return isNaN(i)?String(e):void 0!==t&&t>=0?i.toFixed(t):String(i)}(e,"integer"===n?0:t.precision??1)}return"date"===n&&e?$t(e,t.dateFormat??"full"):"boolean"===n?function(e,t="Yes",i="No"){return!0===e||"on"===e||"true"===e||"1"===e?t:i}(e):String(e)}Ct.styles=[...dt.styles,l`
            :host {
                overflow: hidden;
            }
            .text-content {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        `],Ct=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?It(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-text")],Ct);const Bt=[{type:"select",name:"format",label:"Format",options:[{value:"text",label:"Text"},{value:"numeric",label:"Numeric"},{value:"integer",label:"Integer"},{value:"date",label:"Date/Time"},{value:"boolean",label:"Boolean"},{value:"template",label:"Template"}]},{type:"number",name:"precision",label:"Precision",min:0,max:10,visible:{prop:"format",in:["numeric","integer"]}},{type:"select",name:"dateFormat",label:"Date Format",options:[{value:"full",label:"Full (Feb 12, 2026, 3:45 PM)"},{value:"long",label:"Long (February 12, 2026)"},{value:"medium",label:"Medium (Feb 12, 2026)"},{value:"short",label:"Short (2/12/26)"},{value:"time",label:"Time Only (3:45 PM)"},{value:"datetime",label:"Date & Time (2/12/26, 3:45 PM)"},{value:"relative",label:"Time Ago (5 minutes ago)"},{value:"iso",label:"ISO 8601 (2026-02-12T15:45:00)"}],visible:{prop:"format",eq:"date"}},{type:"textarea",name:"formatTemplate",label:"Format Template",placeholder:"e.g., {{ value | round(2) }} units",rows:3,templateKeywords:Z,visible:{prop:"format",eq:"template"}}],Et=class extends dt{getEntityAttribute(e){var t;const i=this.getEntityState();if(i)return"last_changed"===e?i.last_changed:"last_updated"===e?i.last_updated:null==(t=i.attributes)?void 0:t[e]}getEntityIcon(e){const t=this.getEntityState();return t?g(t):e}getEntityName(){return this.getEntityAttribute("friendly_name")||this.entity||"Unknown"}getEntityDomain(){return this.entity?this.entity.split(".")[0]:null}getAttributeConfig(){var e,t;const i=this.resolveRawValue(null==(t=null==(e=this.block)?void 0:e.props)?void 0:t.attributes,[]);return Array.isArray(i)?i:[]}isAttributeVisible(e){const t=this.getAttributeConfig().find(t=>t.name===e);return(null==t?void 0:t.visible)??!1}getVisibleAttributes(){return this.getAttributeConfig().filter(e=>e.visible)}getAttributeLabel(e){const t=this.getAttributeConfig().find(t=>t.name===e);return(null==t?void 0:t.label)?t.label:e.split("_").map(e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join(" ")}formatValue(e){const t=this.resolveProperty("format","text");if("template"===t){const t=this.resolveProperty("formatTemplate","");if(!t)return"";const i=this.getTemplateVariables(e);return this.resolveTemplateString("formatTemplate",t,i)}return Lt(e,{format:t,precision:this.resolvePropertyAsNumber("precision",1),dateFormat:this.resolveProperty("dateFormat","full")},"")}getTemplateVariables(e,t){const i=ee(this.getEntityState(),e);return t&&Object.keys(t).length>0&&Object.assign(i,t),i}};Et.styles=[...dt.styles,l`
      .no-entity {
        color: var(--warning-color, #ff9800);
        font-size: 14px;
        padding: 8px;
        text-align: center;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
      }
    `];let Dt=Et;const Rt=class extends Dt{get hasLockedEntity(){var e,t;return"inherited"===(null==(t=null==(e=this.block)?void 0:e.entityConfig)?void 0:t.mode)}getAttributeConfig(){var e,t;const i=this.resolveRawValue(null==(t=null==(e=this.block)?void 0:e.props)?void 0:t.attributes,[]);return Array.isArray(i)?i:[]}isAttributeVisible(e){const t=this.getAttributeConfig().find(t=>t.name===e);return(null==t?void 0:t.visible)??!1}getVisibleAttributes(){return this.getAttributeConfig().filter(e=>e.visible)}getAttributeLabel(e){const t=this.getAttributeConfig().find(t=>t.name===e);return(null==t?void 0:t.label)?t.label:e.split("_").map(e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join(" ")}renderAttribute(e){const t=this.getEntityAttribute(e),i=this.getAttributeLabel(e),n=this.getAttributeConfig().find(t=>t.name===e),r=(null==n?void 0:n.showLabel)??!0;return h`
      <div class="attribute-row">
        ${r?h`<span class="attribute-label">${i}</span>`:""}
        <span class="attribute-value">${void 0!==t?t:"—"}</span>
      </div>
    `}renderAttributes(){const e=this.getVisibleAttributes();return 0===e.length?h``:h`
      <div class="attributes-container">
        ${e.map(e=>this.renderAttribute(e.name))}
      </div>
    `}};Rt.styles=[...Dt.styles];let Ot=Rt;var Nt=Object.getOwnPropertyDescriptor;let zt=class extends Ot{static getBlockConfig(){return{sinceVersion:"1.0.0",definition:{label:"Entity Attribute",icon:'<ha-icon icon="mdi:tag-text-outline"></ha-icon>',category:"entities"},defaults:{requireEntity:!0,props:{attributeName:{value:""},showLabel:{value:!0},customLabel:{value:""},labelPosition:{value:"top"},format:{value:"text"},precision:{value:1},dateFormat:{value:"full"},formatTemplate:{value:""},prefix:{value:""},suffix:{value:""}}},entityDefaults:{mode:"inherited"},actionTargets:{label:{label:"Label",description:"Attribute label"},value:{label:"Value",description:"Attribute value"}}}}getPanelConfig(){return{properties:{groups:[{id:"attribute",label:"Attribute",traits:[{type:"attribute-picker",name:"attributeName",label:"Attribute Name",placeholder:"Enter attribute name"}]},{id:"label",label:"Label",traits:[{type:"checkbox",name:"showLabel",label:"Show Label"},{type:"text",name:"customLabel",label:"Custom Label",placeholder:"Auto-generated from attribute name",visible:{prop:"showLabel",eq:!0}},{type:"select",name:"labelPosition",label:"Label Position",options:[{value:"top",label:"Top"},{value:"left",label:"Left"},{value:"inline",label:"Inline"}],visible:{prop:"showLabel",eq:!0}}]},{id:"formatting",label:"Formatting",traits:[...Bt,{type:"text",name:"prefix",label:"Prefix",templateKeywords:Z,visible:{prop:"format",neq:"template"}},{type:"text",name:"suffix",label:"Suffix",templateKeywords:Z,visible:{prop:"format",neq:"template"}}]}]},targetStyles:{block:{styles:{preset:"full"}},label:{label:"Label",description:"Label shown for the attribute name",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},value:{label:"Value",description:"Formatted attribute value",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},prefix:{label:"Prefix",description:"Text shown before the value",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},suffix:{label:"Suffix",description:"Text shown after the value",styles:{preset:"full",exclude:{groups:["layout","flex"]}}}}}}render(){if(!this.entity)return h`
                <div class="no-entity">No entity selected</div>
            `;if(!this.resolveProperty("attributeName"))return h`
                <div class="no-entity">No attribute selected</div>
            `;const e=this.getAttributeValue(),t=this.resolveProperty("format","text"),i=this.formatValue(e),n=this.getTemplateVariables(e,{attribute:e}),r="template"!==t?this.resolveProperty("prefix"):null,o=r?this.resolveTemplateString("prefix",r,n):"",s="template"!==t?this.resolveProperty("suffix"):null,a=s?this.resolveTemplateString("suffix",s,n):"",l=this.resolvePropertyAsBoolean("showLabel"),c=this.getLabelText(),p=l?`layout-${this.resolveProperty("labelPosition","top")}`:"",g=this.getTargetStyle("label"),m=this.getTargetStyle("value"),v=this.getTargetStyle("prefix"),y=this.getTargetStyle("suffix"),b=this.isStyleTargetActive("label"),f=this.isStyleTargetActive("value"),k=this.isStyleTargetActive("prefix"),x=this.isStyleTargetActive("suffix");return h`

            <div class="attribute-container layout-${p}">
                ${l?h`
                    <div
                            class="attribute-label ${b?"style-target-active":d}"
                            style=${u(g)}
                            data-style-target="label"
                            data-action-target="label"
                    >${c}:
                    </div>
                `:d}
                <div
                        class="attribute-value ${f?"style-target-active":d}"
                        style=${u(m)}
                        data-style-target="value"
                        data-action-target="value"
                    >
                    <div class="value-content">
                        ${r?h`
                            <span
                                class="value-prefix ${k?"style-target-active":""}"
                                style=${u(v)}
                                data-style-target="prefix"
                            >${o}</span>
                        `:d}
                        <span>${i}</span>
                        ${s?h`
                            <span
                                class="value-suffix ${x?"style-target-active":""}"
                                style=${u(y)}
                                data-style-target="suffix"
                            >${a}</span>
                        `:d}
                    </div>
                </div>
            </div>

        `}getAttributeValue(){const e=this.resolveProperty("attributeName");if(e)return this.getEntityAttribute(e)}getLabelText(){const e=this.resolveProperty("customLabel");if(e)return e;const t=this.resolveProperty("attributeName");return t?this.getAttributeLabel(t):"Attribute"}};zt.styles=[...Ot.styles,l`
            .attribute-container {
                width: 100%;
                height: 100%;
                display: flex;
                box-sizing: border-box;
            }

            .attribute-container.layout-top {
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .attribute-container.layout-left {
                flex-direction: row;
                align-items: center;
                gap: 8px;
            }

            .attribute-container.layout-inline {
                flex-direction: row;
                align-items: baseline;
                gap: 4px;
            }
      
            .attribute-label {
                font-size: 12px;
                white-space: nowrap;
            }

            .layout-top .attribute-label {
                margin-bottom: 4px;
            }

            .attribute-value {
                font-size: 14px;
                white-space: nowrap;
            }

            .value-content {
                display: flex;
                align-items: baseline;
                gap: 4px;
            }
        `],zt=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?Nt(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-entity-field-attribute")],zt);var Vt=Object.getOwnPropertyDescriptor;let Ft=class extends Ot{static getBlockConfig(){return{sinceVersion:"1.0.0",definition:{label:"Entity Icon",icon:'<ha-icon icon="mdi:gamepad-outline"></ha-icon>',category:"entities"},defaults:{requireEntity:!0,props:{iconSize:{value:24},color:{value:""},colorMode:{value:"fixed"},stateColors:{value:[]},availableColor:{value:""},unavailableColor:{value:"#9e9e9e"}}},entityDefaults:{mode:"inherited"}}}getPanelConfig(){return{properties:{groups:[{id:"icon",label:"Icon",traits:[{type:"number",name:"iconSize",label:"Icon Size",min:12,max:128}]},{id:"color",label:"Color",traits:[{type:"select",name:"colorMode",label:"Color Mode",options:[{value:"fixed",label:"Fixed"},{value:"state",label:"State-based"},{value:"availability",label:"Availability-based"}]},{type:"color",name:"color",label:"Color",visible:{prop:"colorMode",eq:"fixed"}},{type:"color",name:"availableColor",label:"Available Color",visible:{prop:"colorMode",eq:"availability"}},{type:"color",name:"unavailableColor",label:"Unavailable Color",visible:{prop:"colorMode",eq:"availability"}}]}]},targetStyles:{block:{styles:{preset:"full"}}}}}render(){if(!this.entity)return h`
                <div class="no-entity">No entity selected</div>`;const e=this.getEntityIcon("mdi:alert-circle-outline"),t=this.resolvePropertyAsNumber("iconSize",24),i=this.getIconColor();return e?h`
            <div
                    class="icon-container"
                    style="
                --mdc-icon-size: ${t}px;
                ${i?`--icon-primary-color: ${i};`:""}
            "
            >
                <ha-icon
                        class="entity-icon"
                        .icon="${e}"
                ></ha-icon>
            </div>
        `:h`
                <div class="icon-container">
                    <div class="fallback-icon">?</div>
                </div>
            `}getIconColor(){var e,t,i;const n=this.resolveProperty("colorMode","fixed");if("fixed"===n){return this.resolveProperty("color")||void 0}if("state"===n){const n=null==(e=this.getEntityState())?void 0:e.state,r=this.resolveRawValue(null==(i=null==(t=this.block)?void 0:t.props)?void 0:i.stateColors,[]),o=(Array.isArray(r)?r:[]).find(e=>e.state===n);return null==o?void 0:o.color}if("availability"===n){const e=this.isEntityAvailable(),t=this.resolveProperty("availableColor"),i=this.resolveProperty("unavailableColor","#9e9e9e");return e?t||void 0:i}}};Ft.styles=[...Ot.styles,l`
            .icon-container {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
            }

            .entity-icon {
                width: var(--mdc-icon-size, 24px);
                height: var(--mdc-icon-size, 24px);
                color: var(--icon-primary-color, currentColor);
                transition: color 0.3s ease;
            }

            .entity-icon svg,
            .entity-icon ha-icon,
            .entity-icon mwc-icon {
                width: 100%;
                height: 100%;
                fill: currentColor;
            }

            .fallback-icon {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--mdc-icon-size, 24px);
            }
        `],Ft=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?Vt(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-entity-field-icon")],Ft);var Wt=Object.getOwnPropertyDescriptor;let jt=class extends Ot{static getBlockConfig(){return{sinceVersion:"1.0.0",definition:{label:"Entity Image",icon:'<ha-icon icon="mdi:image-outline"></ha-icon>',category:"entities"},defaults:{requireEntity:!0,props:{customImageUrl:{value:""},fallbackIcon:{value:"mdi:image-off-outline"}}},entityDefaults:{mode:"inherited"}}}getPanelConfig(){return{properties:{groups:[{id:"image",label:"Image",traits:[{type:"text",name:"customImageUrl",label:"Custom Image URL",placeholder:"Leave empty to use entity_picture"},{type:"icon-picker",name:"fallbackIcon",label:"Fallback Icon",placeholder:"mdi:image-off-outline",binding:{type:"icon-picker",placeholder:"mdi:image-off-outline"}}]}]},targetStyles:{block:{styles:{preset:"full"}}}}}render(){if(!this.entity)return h`
                <div class="no-entity">No entity selected</div>`;const e=this.getImageUrl();if(!e){const e=this.getFallbackIcon();return h`
                <div class="image-container">
                    <div class="fallback-icon-container">
                        <ha-icon class="fallback-icon" .icon="${e}"></ha-icon>
                    </div>
                </div>
            `}return h`
            <div class="image-container">
                <img
                    class="entity-picture"
                    src="${e}"
                    alt="${this.getEntityName()}"
                    @error="${this._handleImageError}"
                />
            </div>
        `}updated(e){super.updated(e);const t=this.getImageUrl();this.classList.toggle("has-image",!!t)}getImageUrl(){const e=this.resolveProperty("customImageUrl");if(e)return e;return this.getEntityAttribute("entity_picture")||null}getFallbackIcon(){return this.resolveProperty("fallbackIcon","mdi:image-off-outline")}_handleImageError(e){const t=e.target,i=this.getFallbackIcon(),n=t.parentElement;n&&(n.innerHTML=`\n        <div class="fallback-icon-container">\n          <ha-icon class="fallback-icon" icon="${i}"></ha-icon>\n        </div>\n      `)}};jt.styles=[...Ot.styles,l`
            :host(.has-image) {
                padding: 0;
                overflow: hidden;
            }
            .image-container {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                overflow: hidden;
            }

            .entity-picture {
                width: 100%;
                height: 100%;
                transition: filter 0.3s ease;
            }

            .fallback-icon-container {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .fallback-icon {
                width: 50%;
                height: 50%;
                max-width: 48px;
                max-height: 48px;
            }

            .fallback-icon svg,
            .fallback-icon ha-icon {
                width: 100%;
                height: 100%;
                fill: currentColor;
            }
        `],jt=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?Wt(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-entity-field-image")],jt);var Gt=Object.getOwnPropertyDescriptor;let Ut=class extends Ot{static getBlockConfig(){return{sinceVersion:"1.0.0",definition:{label:"Entity Name",icon:'<ha-icon icon="mdi:alphabetical-variant"></ha-icon>',category:"entities"},defaults:{requireEntity:!0,props:{customName:{value:""},case:{value:"none"},maxLength:{value:0},ellipsis:{value:!0}}},entityDefaults:{mode:"inherited"}}}getPanelConfig(){return{properties:{groups:[{id:"name",label:"Name",traits:[{type:"text",name:"customName",label:"Custom Name",placeholder:"Custom name or template (e.g. {{name}})",description:"Leave empty to use entity friendly name. Use {{name}} to display entity name inside text.",templateKeywords:J}]},{id:"formatting",label:"Formatting",traits:[{type:"select",name:"case",label:"Case",options:[{value:"none",label:"None"},{value:"upper",label:"Upper"},{value:"lower",label:"Lower"},{value:"title",label:"Title"},{value:"kebab",label:"Kebab"},{value:"camel",label:"Camel"}]},{type:"number",name:"maxLength",label:"Max Length",min:1,max:250,step:1,description:"Leave empty to disable truncation"},{type:"checkbox",name:"ellipsis",label:"Use Ellipsis",description:"If enabled, truncation will be done using ellipsis instead of hiding text"}]}]},targetStyles:{block:{styles:{preset:"full"}}}}}render(){if(!this.entity)return h`
                <div class="no-entity">No entity selected</div>
            `;const e=this.getEntityName(),t=this.resolveProperty("customName"),i=t?this.resolveTemplateString("customName",t,this.getTemplateVariables(e,{name:e})):e,n=this.formatName(i),r=this.truncateName(n),o=this.resolvePropertyAsBoolean("ellipsis"),s=this.resolvePropertyAsNumber("maxLength",0);return h`
            <div class="name-container">
                <div class="name-text ${o&&0===s?"ellipsis":""}">
                    ${r}
                </div>
            </div>
        `}formatName(e){var t;switch(this.resolveProperty("case","none")){case"upper":return e.toUpperCase();case"lower":return e.toLowerCase();case"title":return e.split(" ").map(e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join(" ");case"kebab":return(e.match(/[A-Za-z0-9]+/g)||[]).map(e=>e.toLowerCase()).join("-");case"camel":{const i=e.match(/[A-Za-z0-9]+/g)||[];return 0===i.length?"":(null==(t=i[0])?void 0:t.toLowerCase())+i.slice(1).map(e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join("")}default:return e}}truncateName(e){const t=this.resolvePropertyAsNumber("maxLength",0);if(t>0&&e.length>t){return this.resolvePropertyAsBoolean("ellipsis")?e.substring(0,t)+"...":e.substring(0,t)}return e}};Ut.styles=[...Ot.styles,l`
            .name-container {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: var(--text-align, flex-start);
                box-sizing: border-box;
            }
      
            .name-text {
                overflow: hidden;
                white-space: nowrap;
            }

            .name-text.ellipsis {
                text-overflow: ellipsis;
            }

            .name-text.wrap {
                white-space: normal;
                word-break: break-word;
            }
        `],Ut=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?Gt(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-entity-field-name")],Ut);var Ht=Object.getOwnPropertyDescriptor;let qt=class extends Ot{static getBlockConfig(){return{sinceVersion:"1.0.0",definition:{label:"Entity State",icon:'<ha-icon icon="mdi:state-machine"></ha-icon>',category:"entities"},defaults:{requireEntity:!0,props:{format:{value:"text"},precision:{value:1},dateFormat:{value:"full"},formatTemplate:{value:""},showUnit:{value:!0},customUnit:{value:""}}},entityDefaults:{mode:"inherited"},actionTargets:{state:{label:"State",description:"State value"},unit:{label:"Unit",description:"Unit of measurement"}}}}getPanelConfig(){return{properties:{groups:[{id:"formatting",label:"Formatting",traits:Bt},{id:"unit",label:"Unit",traits:[{type:"checkbox",name:"showUnit",label:"Show Unit"},{type:"text",name:"customUnit",label:"Custom Unit",placeholder:"Leave empty for auto",visible:{prop:"showUnit",eq:!0}}]}]},targetStyles:{block:{styles:{preset:"full"}},state:{label:"State value",description:"Main state text",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},unit:{label:"Unit",description:"Unit of measurement displayed after the value",styles:{preset:"full",exclude:{groups:["layout","flex"]}}}}}}render(){if(!this.entity)return h`
                <div class="no-entity">No entity selected</div>
            `;if(!this.hass||!this.getEntityState())return h`
                <div class="state-container">
                    <div class="state-value">—</div>
                </div>
            `;const e=this.getDisplayValue(),t=this.formatValue(e),i=this.getUnit(),n=this.resolveProperty("format","text"),r="numeric"===n||"integer"===n,o=this.getTargetStyle("state"),s=this.getTargetStyle("unit"),a=this.isStyleTargetActive("state"),l=this.isStyleTargetActive("unit");return h`
            <div class="state-container">
                <div
                    class="state-value ${a?"style-target-active":""}"
                    style=${u(o)}
                    data-style-target="state"
                    data-action-target="state"
                >
                    <span class="${r?"state-number":""}">${t}</span>
                </div>
                ${i?h`
                    <span
                        class="state-unit ${l?"style-target-active":""}"
                        style=${u(s)}
                        data-style-target="unit"
                        data-action-target="unit"
                    >${i}</span>
                `:""}
            </div>
        `}getDisplayValue(){var e;return(null==(e=this.getEntityState())?void 0:e.state)||""}getUnit(){if(!this.resolvePropertyAsBoolean("showUnit"))return"";const e=this.resolveProperty("customUnit");return e||(this.getEntityAttribute("unit_of_measurement")||"")}};qt.styles=[...Ot.styles,l`
            .state-value {
                font-size: 16px;
                white-space: nowrap;
                display: inline-block;
            }
            .state-number {
                font-variant-numeric: tabular-nums;
            }
            .state-unit {
                font-size: 0.8em;
                margin-left: 2px;
            }
        `],qt=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?Ht(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-entity-field-state")],qt);var Xt=Object.defineProperty;const Yt={climate:[{id:"climate_hvac_mode",label:"HVAC Mode",domain:"climate",listAttributes:["hvac_modes"],valueAttribute:"hvac_mode",service:"set_hvac_mode",serviceField:"hvac_mode",iconAttribute:"hvac_mode"},{id:"climate_fan_mode",label:"Fan Mode",domain:"climate",listAttributes:["fan_modes"],valueAttribute:"fan_mode",service:"set_fan_mode",serviceField:"fan_mode",iconAttribute:"fan_mode"},{id:"climate_swing_mode",label:"Swing Mode",domain:"climate",listAttributes:["swing_modes"],valueAttribute:"swing_mode",service:"set_swing_mode",serviceField:"swing_mode",iconAttribute:"swing_mode"},{id:"climate_preset_mode",label:"Preset Mode",domain:"climate",listAttributes:["preset_modes"],valueAttribute:"preset_mode",service:"set_preset_mode",serviceField:"preset_mode",iconAttribute:"preset_mode"}],automation:[{id:"automation_enabled",label:"Enabled",domain:"automation",staticOptions:["on","off"],valueSource:"state",serviceMap:{on:{service:"turn_on"},off:{service:"turn_off"}},iconType:"state"}],water_heater:[{id:"water_heater_operation_mode",label:"Operation Mode",domain:"water_heater",listAttributes:["operation_list","available_modes"],valueAttribute:"operation_mode",service:"set_operation_mode",serviceField:"operation_mode",iconAttribute:"operation_mode"}],humidifier:[{id:"humidifier_mode",label:"Mode",domain:"humidifier",listAttributes:["available_modes"],valueAttribute:"mode",service:"set_mode",serviceField:"mode",iconAttribute:"mode"}],media_player:[{id:"media_player_source",label:"Source",domain:"media_player",listAttributes:["source_list"],valueAttribute:"source",service:"select_source",serviceField:"source",iconAttribute:"source"},{id:"media_player_sound_mode",label:"Sound Mode",domain:"media_player",listAttributes:["sound_mode_list"],valueAttribute:"sound_mode",service:"select_sound_mode",serviceField:"sound_mode",iconAttribute:"sound_mode"}],fan:[{id:"fan_power",label:"Power",domain:"fan",staticOptions:["on","off"],valueSource:"state",serviceMap:{on:{service:"turn_on"},off:{service:"turn_off"}},iconType:"state"},{id:"fan_preset_mode",label:"Preset Mode",domain:"fan",listAttributes:["preset_modes"],valueAttribute:"preset_mode",service:"set_preset_mode",serviceField:"preset_mode",iconAttribute:"preset_mode"},{id:"fan_speed",label:"Speed",domain:"fan",listAttributes:["speed_list"],valueAttribute:"speed",service:"set_speed",serviceField:"speed",iconAttribute:"speed"}],vacuum:[{id:"vacuum_fan_speed",label:"Fan Speed",domain:"vacuum",listAttributes:["fan_speed_list"],valueAttribute:"fan_speed",service:"set_fan_speed",serviceField:"fan_speed",iconAttribute:"fan_speed"}],cover:[{id:"cover_state",label:"Open/Close",domain:"cover",staticOptions:["open","closed"],valueSource:"state",serviceMap:{open:{service:"open_cover"},closed:{service:"close_cover"}},iconType:"state"}],lock:[{id:"lock_state",label:"Lock",domain:"lock",staticOptions:["locked","unlocked"],valueSource:"state",serviceMap:{locked:{service:"lock"},unlocked:{service:"unlock"}},iconType:"state"}],light:[{id:"light_power",label:"Power",domain:"light",staticOptions:["on","off"],valueSource:"state",serviceMap:{on:{service:"turn_on"},off:{service:"turn_off"}},iconType:"state"},{id:"light_effect",label:"Effect",domain:"light",listAttributes:["effect_list"],valueAttribute:"effect",service:"turn_on",serviceField:"effect",iconAttribute:"effect"}],switch:[{id:"switch_power",label:"Power",domain:"switch",staticOptions:["on","off"],valueSource:"state",serviceMap:{on:{service:"turn_on"},off:{service:"turn_off"}},iconType:"state"}],input_boolean:[{id:"input_boolean_state",label:"State",domain:"input_boolean",staticOptions:["on","off"],valueSource:"state",serviceMap:{on:{service:"turn_on"},off:{service:"turn_off"}},iconType:"state"}],siren:[{id:"siren_state",label:"State",domain:"siren",staticOptions:["on","off"],valueSource:"state",serviceMap:{on:{service:"turn_on"},off:{service:"turn_off"}},iconType:"state"}],select:[{id:"select_option",label:"Option",domain:"select",listAttributes:["options"],valueSource:"state",service:"select_option",serviceField:"option",iconAttribute:"option"}],input_select:[{id:"input_select_option",label:"Option",domain:"input_select",listAttributes:["options"],valueSource:"state",service:"select_option",serviceField:"option",iconAttribute:"option"}]},Kt=e=>e.map(e=>null==e?"":String(e)).filter(e=>""!==e),Qt=e=>e.filter((t,i)=>e.indexOf(t)===i),Zt=(e,t,i)=>{var n,r;return Boolean(null==(r=null==(n=null==e?void 0:e.services)?void 0:n[t])?void 0:r[i])},Jt=(e,t,i)=>(null==i?void 0:i.services)?e.serviceMap?t.filter(t=>{var n;const r=null==(n=e.serviceMap)?void 0:n[t];return!!r&&Zt(i,e.domain,r.service)}):e.service?Zt(i,e.domain,e.service)?t:[]:t:t,ei=(e,t,i)=>{var n,r;if((null==(n=e.listAttributes)?void 0:n.length)&&t){const n=e.listAttributes.find(e=>Array.isArray(t[e]));if(!n)return null;const r=t[n];if(!Array.isArray(r))return null;const o=Qt(Kt(r)),s=Jt(e,o,i);return s.length>=2?{listAttribute:n,options:s}:null}if(null==(r=e.staticOptions)?void 0:r.length){const t=Qt(Kt(e.staticOptions)),n=Jt(e,t,i);return n.length>=2?{options:n}:null}return null},ti=class extends Dt{constructor(){super(...arguments),this._localValue=null,this._pendingValueAt=0,this._pendingTimeoutId=null}disconnectedCallback(){this._clearPendingTimeout(),super.disconnectedCallback()}_resolveAvailableFeatures(e,t){const i=Yt[t]??[],n=e.attributes;return i.map(t=>{const i=ei(t,n,this.hass);if(!i)return null;const r=this._getCurrentValue(e,t);return{...t,listAttribute:i.listAttribute,options:i.options,currentValue:r}}).filter(e=>Boolean(e))}_resolveSelectedFeature(e){const t=String(this.resolveProperty("feature","auto")??"auto");return"auto"===t?1===e.length?e[0]:null:e.find(e=>e.id===t)??null}_getCurrentValue(e,t){if("state"===(t.valueSource??(t.valueAttribute?"attribute":"state")))return void 0!==e.state&&null!==e.state?String(e.state):void 0;if(t.valueAttribute&&e.attributes){const i=e.attributes[t.valueAttribute];return null!=i?String(i):void 0}}_buildOptions(e,t){return e.options.map(i=>({value:i,label:this._formatOptionLabel(i,e,t)}))}_formatOptionLabel(e,t,i){var n;if((null==(n=this.hass)?void 0:n.formatEntityAttributeValue)&&t.valueAttribute)try{return this.hass.formatEntityAttributeValue(i,t.valueAttribute,e)}catch{}return t.staticOptions?this._formatStaticOptionLabel(e):e}_renderOptionIcon(e,t,i,n){const r=e.iconType??(e.staticOptions?"state":"attribute");if(!this.hass)return d;if("state"===r){const e=this.getEntityState();if(!e)return d;const r=g({...e,state:t});return r?h`
                <span
                    class="option-icon ${this.isStyleTargetActive(n)?"style-target-active":""}"
                    style=${u(i)}
                    data-style-target=${n}
                >
                    <ha-icon .icon=${r}></ha-icon>
                </span>
            `:d}const o=e.iconAttribute??e.valueAttribute??e.serviceField;return o?h`
            <span
                class="option-icon ${this.isStyleTargetActive(n)?"style-target-active":""}"
                style=${u(i)}
                data-style-target=${n}
            >
                <ha-attribute-icon
                    .hass=${this.hass}
                    .stateObj=${this.getEntityState()}
                    .attribute=${o}
                    .attributeValue=${t}
                ></ha-attribute-icon>
            </span>
        `:d}_renderOptionLabel(e,t,i){return h`
            <span
                class="option-label ${this.isStyleTargetActive(i)?"style-target-active":""}"
                style=${u(t)}
                data-style-target=${i}
            >${e}</span>
        `}_getEffectiveValue(e,t){const i=this._getCurrentValue(t,e);if(!this._localValue)return i;if(i===this._localValue)return this._clearPendingValue(),i;return Date.now()-this._pendingValueAt<1500?this._localValue:(this._clearPendingValue(),i)}async _dispatchBlockAction(e,t){var i;if(!this.entity)return;const n=this._resolveServiceCall(e,t);if(!n)return;const r={...n.data??{},entity_id:this.entity},o={action:"call-service",service:`${e.domain}.${n.service}`,data:r};try{await Ke({hass:this.hass,element:this,action:o,trigger:"tap",entityId:this.entity,eventBus:this.eventBus,blockId:null==(i=this.block)?void 0:i.id,targetId:"block",slotId:void 0,throwOnError:!0})}catch(s){this._clearPendingValue(),this._emitServiceError(s,r)}}_resolveServiceCall(e,t){return e.serviceMap?e.serviceMap[t]??null:e.service?e.serviceField?{service:e.service,data:{[e.serviceField]:t}}:{service:e.service}:null}_formatStaticOptionLabel(e){return e.split("_").map(e=>e?e[0].toUpperCase()+e.slice(1):"").join(" ")}_setPendingValue(e){this._localValue=e,this._pendingValueAt=Date.now(),this._schedulePendingTimeout()}_clearPendingValue(){this._localValue=null,this._pendingValueAt=0,this._clearPendingTimeout()}_schedulePendingTimeout(){this._clearPendingTimeout(),this._pendingTimeoutId=window.setTimeout(()=>{this._pendingTimeoutId=null,this._clearPendingValue(),this.requestUpdate()},1500)}_clearPendingTimeout(){null!==this._pendingTimeoutId&&(window.clearTimeout(this._pendingTimeoutId),this._pendingTimeoutId=null)}};ti.styles=[...Dt.styles,l`
            .option-icon ha-icon,
            .option-icon ha-attribute-icon,
            .option-icon ha-svg-icon {
                --mdc-icon-size: 16px;
            }
        `];let ii=ti;((e,t,i)=>{for(var n,r=void 0,o=e.length-1;o>=0;o--)(n=e[o])&&(r=n(t,i,r)||r);r&&Xt(t,i,r)})([c()],ii.prototype,"_localValue");const ni=e=>{var t,i,n,r,o,s;const a=e,l=null==(r=null==(n=null==(t=a.documentModel)?void 0:t.resolveEntityForBlock)?void 0:n.call(t,(null==(i=a.block)?void 0:i.id)??""))?void 0:r.entityId,c=l&&(null==(s=null==(o=a.hass)?void 0:o.states)?void 0:s[l])?a.hass.states[l]:void 0;if(!c)return[{value:"auto",label:"Auto"}];const d=c.entity_id.split(".")[0],u=Yt[d]??[],h=c.attributes;return[{value:"auto",label:"Auto"},...u.map(e=>ei(e,h,a.hass)?e:null).filter(e=>Boolean(e)).map(e=>({value:e.id,label:e.label}))]};var ri=Object.getOwnPropertyDescriptor;let oi=class extends ii{static getBlockConfig(){return{sinceVersion:"2.0.0",definition:{label:"Button Toggle",icon:'<ha-icon icon="mdi:toggle-switch-off-outline"></ha-icon>',category:"controls"},defaults:{requireEntity:!0,props:{orientation:{value:"horizontal"},feature:{value:"auto"},showIcon:{value:!0},showLabel:{value:!0},contentLayout:{value:"horizontal"},contentOrder:{value:"icon-first"},verticalAlign:{value:"center"}}},entityDefaults:{mode:"inherited"},exposeBlockActionTarget:!1}}hasNativeActions(){return!0}getPanelConfig(){return{properties:{groups:[{id:"options",label:"Options",traits:[{type:"context-select",name:"feature",label:"Feature",emptyLabel:"No options available",optionsProvider:ni}]},{id:"appearance",label:"Appearance",traits:[{type:"select",name:"orientation",label:"Orientation",options:[{value:"horizontal",label:"Horizontal"},{value:"vertical",label:"Vertical"}]},{type:"checkbox",name:"showIcon",label:"Show Icon"},{type:"checkbox",name:"showLabel",label:"Show Label"},{type:"select",name:"contentLayout",label:"Icon + Label Layout",options:[{value:"horizontal",label:"Horizontal"},{value:"vertical",label:"Vertical"}],visible:{and:[{prop:"showIcon",eq:!0},{prop:"showLabel",eq:!0}]}},{type:"select",name:"contentOrder",label:"Content Order",options:[{value:"icon-first",label:"Icon First"},{value:"label-first",label:"Label First"}],visible:{and:[{prop:"showIcon",eq:!0},{prop:"showLabel",eq:!0}]}},{type:"select",name:"verticalAlign",label:"Vertical Align",options:[{value:"left",label:"Left"},{value:"center",label:"Center"},{value:"right",label:"Right"}],visible:{prop:"orientation",eq:"vertical"}}]}]},targetStyles:{block:{styles:{preset:"full"}},container:{label:"Container",description:"Options container",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},option:{label:"Option",description:"Option button",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"option-active":{label:"Option Active",description:"Active option button",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},icon:{label:"Icon",description:"Option icon",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"icon-active":{label:"Icon Active",description:"Active option icon",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},label:{label:"Label",description:"Option label",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"label-active":{label:"Label Active",description:"Active option label",styles:{preset:"full",exclude:{groups:["layout","flex"]}}}}}}updated(e){super.updated(e),e.has("block")&&(this.entity=this.resolvedEntityId())}render(){if(!this.entity)return h`<div class="no-options">No entity selected</div>`;const e=this.getEntityState();if(!e)return h`<div class="no-options">Entity unavailable</div>`;const t=this.getEntityDomain();if(!t)return h`<div class="no-options">Entity unavailable</div>`;const i=this._resolveAvailableFeatures(e,t),n=this._resolveSelectedFeature(i);if(!n||n.options.length<2)return h`<div class="no-options">No options available</div>`;const r=this._getOrientation(),o=this.resolvePropertyAsBoolean("showIcon"),s=this.resolvePropertyAsBoolean("showLabel"),a=this.resolveProperty("contentLayout","horizontal"),l=this.resolveProperty("contentOrder","icon-first"),c=this.resolveProperty("verticalAlign","center"),p=this._getEffectiveValue(n,e),g=this._buildOptions(n,e),v=this.getTargetStyle("container"),y=this.getTargetStyle("option"),b=this.getTargetStyle("option-active"),f=this.getTargetStyle("icon"),k=this.getTargetStyle("icon-active"),x=this.getTargetStyle("label"),w=this.getTargetStyle("label-active"),S=m({"mode-selector":!0,vertical:"vertical"===r,"align-left":"vertical"===r&&"left"===c,"align-center":"vertical"===r&&"center"===c,"align-right":"vertical"===r&&"right"===c,"style-target-active":this.isStyleTargetActive("container")});return h`
            <div class="toggle-root">
                <div
                    class=${S}
                    style=${u(v)}
                    data-style-target="container"
                >
                    ${g.map(t=>{const i=t.value===p,r=i?"option-active":"option",c=i?"icon-active":"icon",g=i?"label-active":"label",v=m({"mode-option":!0,active:i,"style-target-active":this.isStyleTargetActive(r)}),S=i?{...y,...b}:y,_=i?{...f,...k}:f,T=i?{...x,...w}:x,A=m({"option-content":!0,"layout-vertical":"vertical"===a,"layout-horizontal":"horizontal"===a,"order-label-first":"label-first"===l}),I=o?this._renderOptionIcon(n,t.value,_,c):d,C=s?this._renderOptionLabel(t.label,T,g):d;return h`
                            <button
                                class=${v}
                                style=${u(S)}
                                data-style-target=${r}
                                type="button"
                                aria-disabled=${this.areActionsEnabled()&&this.isEntityAvailable()?"false":"true"}
                                aria-pressed=${i?"true":"false"}
                                @click=${i=>this._handleOptionClick(i,t.value,n,e)}
                            >
                                <div class=${A}>
                                    ${I}
                                    ${C}
                                </div>
                            </button>
                        `})}
                </div>
            </div>
        `}async _handleOptionClick(e,t,i,n){if(!this.hass||!this.entity)return;if(!this.areActionsEnabled())return;if(!this.isEntityAvailable())return;e.preventDefault(),e.stopPropagation();this._getEffectiveValue(i,n)!==t&&(this._setPendingValue(t),this._dispatchBlockAction(i,t))}_emitServiceError(e,t){var i,n;const r={entityId:this.entity,error:e,payload:t,blockId:null==(i=this.block)?void 0:i.id};null==(n=this.eventBus)||n.dispatchEvent("button-toggle-service-error",r),this.dispatchEvent(new CustomEvent("button-toggle-service-error",{detail:r,bubbles:!0,composed:!0}))}_getOrientation(){return"vertical"===this.resolveProperty("orientation","horizontal")?"vertical":"horizontal"}};oi.styles=[...ii.styles,l`
            :host {
                display: block;
            }

            .toggle-root {
                display: flex;
                flex-direction: column;
                gap: 6px;
                width: 100%;
            }

            .mode-selector {
                display: flex;
                background: var(--bg-tertiary, #f5f5f5);
                border-radius: 6px;
                padding: 2px;
                gap: 2px;
                box-sizing: border-box;
            }

            .mode-selector.vertical {
                flex-direction: column;
            }

            .mode-selector.vertical.align-left .mode-option {
                justify-content: flex-start;
                text-align: left;
            }

            .mode-selector.vertical.align-center .mode-option {
                justify-content: center;
                text-align: center;
            }

            .mode-selector.vertical.align-right .mode-option {
                justify-content: flex-end;
                text-align: right;
            }

            .mode-option {
                flex: 1 1 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                font-size: 11px;
                font-weight: 500;
                color: var(--text-secondary, #666);
                cursor: pointer;
                border-radius: 4px;
                transition: all 0.2s ease;
                user-select: none;
                border: none;
                background: transparent;
                padding: 6px 10px;
                min-height: 30px;
            }

            .mode-option:hover {
                color: var(--text-primary, #333);
            }

            .mode-option.active {
                background: var(--accent-color, #2196f3);
                color: white;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
            }

            .option-content {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .option-content.layout-vertical {
                flex-direction: column;
                gap: 2px;
            }

            .option-content.order-label-first .option-icon {
                order: 2;
            }

            .option-content.order-label-first .option-label {
                order: 1;
            }

            .option-icon {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .option-label {
                white-space: nowrap;
                font-variant-numeric: tabular-nums;
            }

            .no-options {
                font-size: 12px;
                color: var(--text-secondary, #666);
                padding: 6px 8px;
            }
        `],oi=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?ri(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-button-toggle")],oi);var si=Object.defineProperty,ai=Object.getOwnPropertyDescriptor,li=(e,t,i,n)=>{for(var r,o=n>1?void 0:n?ai(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&si(t,i,o),o};let ci=class extends ii{constructor(){super(...arguments),this._dropdownOpen=!1,this._toggleDropdown=e=>{this.areActionsEnabled()&&this.isEntityAvailable()&&(e.preventDefault(),e.stopPropagation(),this._dropdownOpen?this._closeDropdown():this._openDropdown())}}static getBlockConfig(){return{sinceVersion:"2.0.0",definition:{label:"Select Menu",icon:'<ha-icon icon="mdi:form-dropdown"></ha-icon>',category:"controls"},defaults:{requireEntity:!0,props:{feature:{value:"auto"},contentOrder:{value:"icon-first"},dropdownPlacement:{value:"down"},containerShowIcon:{value:!0},containerShowLabel:{value:!0},dropdownShowIcon:{value:!0},dropdownShowLabel:{value:!0}}},entityDefaults:{mode:"inherited"},exposeBlockActionTarget:!1}}hasNativeActions(){return!0}getPanelConfig(){return{properties:{groups:[{id:"options",label:"Options",traits:[{type:"context-select",name:"feature",label:"Feature",emptyLabel:"No options available",optionsProvider:ni}]},{id:"appearance",label:"Appearance",traits:[{type:"checkbox",name:"containerShowIcon",label:"Show Container Icon"},{type:"checkbox",name:"containerShowLabel",label:"Show Container Label"},{type:"checkbox",name:"dropdownShowIcon",label:"Show Dropdown Icon"},{type:"checkbox",name:"dropdownShowLabel",label:"Show Dropdown Label"},{type:"select",name:"contentOrder",label:"Content Order",options:[{value:"icon-first",label:"Icon First"},{value:"label-first",label:"Label First"}]},{type:"select",name:"dropdownPlacement",label:"Dropdown Placement",options:[{value:"down",label:"Below"},{value:"up",label:"Above"}]}]}]},targetStyles:{block:{styles:{preset:"full"}},container:{label:"Container",description:"Select container",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},dropdown:{label:"Dropdown",description:"Dropdown panel",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"container-icon":{label:"Container Icon",description:"Selected icon",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"container-label":{label:"Container Label",description:"Selected label",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"dropdown-icon":{label:"Dropdown Icon",description:"Option icon",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"dropdown-label":{label:"Dropdown Label",description:"Option label",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"dropdown-selected-icon":{label:"Selected Icon",description:"Selected option icon",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"dropdown-selected-label":{label:"Selected Label",description:"Selected option label",styles:{preset:"full",exclude:{groups:["layout","flex"]}}}}}}updated(e){super.updated(e),e.has("block")&&(this.entity=this.resolvedEntityId())}connectedCallback(){super.connectedCallback(),this._handleOutsideClick=this._handleOutsideClick.bind(this)}disconnectedCallback(){this._removeOutsideListener(),super.disconnectedCallback()}render(){var e;if(!this.entity)return h`<div class="no-options">No entity selected</div>`;const t=this.getEntityState();if(!t)return h`<div class="no-options">Entity unavailable</div>`;const i=this.getEntityDomain();if(!i)return h`<div class="no-options">Entity unavailable</div>`;const n=this._resolveAvailableFeatures(t,i),r=this._resolveSelectedFeature(n);if(!r||r.options.length<2)return h`<div class="no-options">No options available</div>`;const o=this._buildOptions(r,t),s=this._getEffectiveValue(r,t)??r.currentValue??(null==(e=o[0])?void 0:e.value),a=o.find(e=>e.value===s),l=(null==a?void 0:a.label)??"Select",c=this.resolveProperty("contentOrder","icon-first"),p=this.resolveProperty("dropdownPlacement","down"),g=this.resolvePropertyAsBoolean("containerShowIcon"),v=this.resolvePropertyAsBoolean("containerShowLabel"),y=this.resolvePropertyAsBoolean("dropdownShowIcon"),b=this.resolvePropertyAsBoolean("dropdownShowLabel"),f=this.getTargetStyle("container"),k=this.getTargetStyle("dropdown"),x=this.getTargetStyle("container-icon"),w=this.getTargetStyle("container-label"),S=this.getTargetStyle("dropdown-icon"),_=this.getTargetStyle("dropdown-label"),T=this.getTargetStyle("dropdown-selected-icon"),A=this.getTargetStyle("dropdown-selected-label"),I=m({"select-content":!0,"order-label-first":"label-first"===c}),C=m({dropdown:!0,"placement-up":"up"===p,"style-target-active":this.isStyleTargetActive("dropdown")}),P=m({"select-button":!0,open:this._dropdownOpen,"style-target-active":this.isStyleTargetActive("container")});return h`
            <div class="select-root">
                <button
                    class=${P}
                    style=${u(f)}
                    data-style-target="container"
                    type="button"
                    aria-disabled=${this.areActionsEnabled()&&this.isEntityAvailable()?"false":"true"}
                    @click=${this._toggleDropdown}
                >
                    <div class=${I}>
                        ${g&&s?this._renderOptionIcon(r,s,x,"container-icon"):d}
                        ${v?this._renderOptionLabel(l,w,"container-label"):d}
                    </div>
                    <span class="select-arrow">▼</span>
                </button>

                ${this._dropdownOpen?h`
                    <div class=${C} style=${u(k)} data-style-target="dropdown" @click=${e=>e.stopPropagation()}>
                        <div class="dropdown-options">
                            ${o.map(e=>{const i=e.value===s,n=i?{...S,...T}:S,o=i?{..._,...A}:_,a=m({"dropdown-option":!0,selected:i,"order-label-first":"label-first"===c});return h`
                                    <div
                                        class=${a}
                                        @click=${i=>this._handleOptionSelect(i,e.value,r,t)}
                                    >
                                        ${y?this._renderOptionIcon(r,e.value,n,i?"dropdown-selected-icon":"dropdown-icon"):d}
                                        ${b?this._renderOptionLabel(e.label,o,i?"dropdown-selected-label":"dropdown-label"):d}
                                    </div>
                                `})}
                        </div>
                    </div>
                `:d}
            </div>
        `}_openDropdown(){this._dropdownOpen=!0,setTimeout(()=>{document.addEventListener("click",this._handleOutsideClick)},0)}_closeDropdown(){this._dropdownOpen=!1,this._removeOutsideListener()}_removeOutsideListener(){document.removeEventListener("click",this._handleOutsideClick)}_handleOutsideClick(e){this.contains(e.target)||this._closeDropdown()}async _handleOptionSelect(e,t,i,n){if(!this.hass||!this.entity)return;if(!this.areActionsEnabled())return;if(!this.isEntityAvailable())return;e.preventDefault(),e.stopPropagation();this._getEffectiveValue(i,n)!==t?(this._setPendingValue(t),this._closeDropdown(),await this._dispatchBlockAction(i,t)):this._closeDropdown()}_emitServiceError(e,t){var i,n;const r={entityId:this.entity,error:e,payload:t,blockId:null==(i=this.block)?void 0:i.id};null==(n=this.eventBus)||n.dispatchEvent("select-menu-service-error",r),this.dispatchEvent(new CustomEvent("select-menu-service-error",{detail:r,bubbles:!0,composed:!0}))}};ci.styles=[...ii.styles,l`
            :host {
                display: block;
            }

            .select-root {
                position: relative;
                width: 100%;
            }

            .select-button {
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 6px;
                background: var(--bg-primary, #fff);
                color: var(--text-primary, #333);
                font-size: 12px;
                cursor: pointer;
                transition: all 0.15s ease;
                box-sizing: border-box;
            }

            .select-button:hover:not(:disabled) {
                border-color: var(--accent-color, #2196f3);
            }

            .select-button.open {
                border-color: var(--accent-color, #2196f3);
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
            }

            .select-content {
                display: flex;
                align-items: center;
                gap: 6px;
                flex: 1;
                min-width: 0;
            }

            .select-content.order-label-first .option-icon {
                order: 2;
            }

            .select-content.order-label-first .option-label {
                order: 1;
            }

            .select-arrow {
                color: var(--text-tertiary, #999);
                font-size: 10px;
                margin-left: auto;
            }

            .option-label {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                margin-top: 6px;
                background: var(--bg-primary, #fff);
                border: 1px solid var(--border-color, #d4d4d4);
                border-radius: 6px;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
                z-index: 1000;
                max-height: 280px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .dropdown.placement-up {
                top: auto;
                bottom: 100%;
                margin-top: 0;
                margin-bottom: 6px;
            }

            .dropdown-options {
                overflow-y: auto;
                padding: 4px 0;
            }

            .dropdown-option {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                cursor: pointer;
                transition: background 0.1s ease;
            }

            .dropdown-option.order-label-first .option-icon {
                order: 2;
            }

            .dropdown-option.order-label-first .option-label {
                order: 1;
            }

            .dropdown-option:hover {
                background: var(--bg-secondary, #f5f5f5);
            }

            .dropdown-option.selected {
                background: rgba(33, 150, 243, 0.1);
            }

            .no-options {
                font-size: 12px;
                color: var(--text-secondary, #666);
                padding: 6px 8px;
            }
        `],li([c()],ci.prototype,"_dropdownOpen",2),ci=li([p("block-select-menu")],ci);var di=Object.defineProperty,ui=Object.getOwnPropertyDescriptor,hi=(e,t,i,n)=>{for(var r,o=n>1?void 0:n?ui(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&di(t,i,o),o};const pi={light:"#f4b400",media_player:"#1e88e5",cover:"#8d6e63",fan:"#00acc1",humidifier:"#4fc3f7",climate:"#e53935",water_heater:"#ff7043",input_number:"#43a047",number:"#43a047"};let gi=class extends Dt{constructor(){super(...arguments),this._localDisplayValue=null,this._localDisplayLow=null,this._localDisplayHigh=null,this._activeThumb=null,this._isInteracting=!1,this._syncPending=!1,this._lastCommitAt=0,this._throttleTimerId=null,this._debounceTimerId=null,this._pendingCommit=null,this._pendingSync=null,this._pendingSyncTimeoutId=null,this._lastCommittedValues=null,this._holdActivationTimerId=null,this._pendingHold=null,this._dragState=null,this._onTrackPointerMove=e=>{if(!this._dragState||e.pointerId!==this._dragState.pointerId)return;const{config:t,thumb:i,rect:n}=this._dragState,r=this._displayFromPointer(e.clientX,e.clientY,n,t);this._applyDisplayValue(r,t,i)},this._onTrackPointerUp=e=>{if(!this._dragState||e.pointerId!==this._dragState.pointerId)return;const{config:t,thumb:i}=this._dragState;e.preventDefault(),e.stopPropagation(),this._dragState=null,window.removeEventListener("pointermove",this._onTrackPointerMove),window.removeEventListener("pointerup",this._onTrackPointerUp),this._commitOnRelease(t,i),this._activeThumb=null,this._isInteracting=!1},this._onHoldPointerMove=e=>{if(!this._pendingHold||e.pointerId!==this._pendingHold.pointerId)return;this._pendingHold.lastX=e.clientX,this._pendingHold.lastY=e.clientY;const t=e.clientX-this._pendingHold.startX,i=e.clientY-this._pendingHold.startY;Math.hypot(t,i)>6&&this._cancelHoldActivation(!0,!1)},this._onHoldPointerUp=e=>{this._pendingHold&&e.pointerId===this._pendingHold.pointerId&&this._cancelHoldActivation(!0,!0)}}static getBlockConfig(){return{sinceVersion:"2.0.0",definition:{label:"Slider",icon:'<ha-icon icon="mdi:arrow-left-right-bold"></ha-icon>',category:"controls"},defaults:{requireEntity:!0,props:{mode:{value:"auto"},coverControl:{value:"auto"},valueSource:{value:"state"},valueAttribute:{value:""},displayMode:{value:"auto"},displayMin:{value:0},displayMax:{value:100},shape:{value:"rounded"},showThumb:{value:!0},showValue:{value:!0},orientation:{value:"horizontal"},valuePositionHorizontal:{value:"inline"},inlinePositionHorizontal:{value:"right"},insidePositionHorizontal:{value:"center"},valuePositionVertical:{value:"top"},insidePositionVertical:{value:"middle"},activationMode:{value:"press"},holdTapEnabled:{value:!1},holdTapAction:{value:"more-info"},commitMode:{value:"onRelease"},commitThrottleMs:{value:200},commitDebounceMs:{value:300},disableMode:{value:"auto"},disabled:{value:!1},invert:{value:!1},rangeMinGap:{value:0},useMinOverride:{value:!1},minOverride:{value:0},useMaxOverride:{value:!1},maxOverride:{value:100},useStepOverride:{value:!1},stepOverride:{value:1},usePrecisionOverride:{value:!1},precisionOverride:{value:0}}},entityDefaults:{mode:"inherited"},exposeBlockActionTarget:!1,actionTargets:{value:{label:"Value",description:"Value label"}}}}hasNativeActions(){return!0}static getStyleOutputConfig(e,t){return t&&"block"!==t?null:{mode:"properties",filter:{exclude:{properties:["size.height","border.borderRadius"]}},varPrefix:"block"}}getPanelConfig(){return{properties:{groups:[{id:"appearance",label:"Appearance",traits:[{type:"select",name:"orientation",label:"Orientation",options:[{value:"horizontal",label:"Horizontal"},{value:"vertical",label:"Vertical"}]},{type:"select",name:"shape",label:"Shape",options:[{value:"rounded",label:"Rounded"},{value:"square",label:"Square"}]},{type:"checkbox",name:"showThumb",label:"Show Thumb"},{type:"checkbox",name:"showValue",label:"Show Value"},{type:"select",name:"valuePositionHorizontal",label:"Value Position",options:[{value:"inline",label:"Inline"},{value:"tooltip",label:"Tooltip"},{value:"inside",label:"Inside"}],visible:{and:[{prop:"showValue",eq:!0},{prop:"orientation",eq:"horizontal"}]}},{type:"select",name:"inlinePositionHorizontal",label:"Inline Position",options:[{value:"left",label:"Left"},{value:"right",label:"Right"}],visible:{and:[{prop:"orientation",eq:"horizontal"},{prop:"valuePositionHorizontal",eq:"inline"}]}},{type:"select",name:"insidePositionHorizontal",label:"Inside Position",options:[{value:"left",label:"Left"},{value:"center",label:"Center"},{value:"right",label:"Right"}],visible:{and:[{prop:"orientation",eq:"horizontal"},{prop:"valuePositionHorizontal",eq:"inside"}]}},{type:"select",name:"valuePositionVertical",label:"Value Position",options:[{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"inside",label:"Inside"},{value:"tooltip",label:"Tooltip"}],visible:{and:[{prop:"showValue",eq:!0},{prop:"orientation",eq:"vertical"}]}},{type:"select",name:"insidePositionVertical",label:"Inside Position",options:[{value:"top",label:"Top"},{value:"middle",label:"Middle"},{value:"bottom",label:"Bottom"}],visible:{and:[{prop:"orientation",eq:"vertical"},{prop:"valuePositionVertical",eq:"inside"}]}},{type:"checkbox",name:"invert",label:"Invert"}]},{id:"behavior",label:"Behavior",traits:[{type:"select",name:"activationMode",label:"Activation",options:[{value:"press",label:"Press"},{value:"hold",label:"Hold"}]},{type:"checkbox",name:"holdTapEnabled",label:"Enable Tap Action",visible:{prop:"activationMode",eq:"hold"}},{type:"select",name:"holdTapAction",label:"Tap Action",options:[{value:"more-info",label:"More Info"},{value:"toggle",label:"Toggle"}],visible:{and:[{prop:"activationMode",eq:"hold"},{prop:"holdTapEnabled",eq:!0}]}},{type:"select",name:"mode",label:"Mode",options:[{value:"auto",label:"Auto"},{value:"single",label:"Single"},{value:"range",label:"Range"}]},{type:"select",name:"coverControl",label:"Cover Control",options:[{value:"auto",label:"Auto"},{value:"position",label:"Position"},{value:"tilt",label:"Tilt"}],visible:{prop:"mode",in:["auto","single","range"]}},{type:"select",name:"valueSource",label:"Value Source",options:[{value:"state",label:"State"},{value:"attribute",label:"Attribute"}]},{type:"attribute-picker",name:"valueAttribute",label:"Value Attribute",placeholder:"Select or type attribute",visible:{prop:"valueSource",eq:"attribute"}},{type:"select",name:"displayMode",label:"Display Mode",options:[{value:"auto",label:"Auto"},{value:"raw",label:"Raw"},{value:"percent",label:"Percent"},{value:"custom",label:"Custom"}]},{type:"number",name:"displayMin",label:"Display Min",step:.01,binding:{type:"number"},visible:{prop:"displayMode",eq:"custom"}},{type:"number",name:"displayMax",label:"Display Max",step:.01,binding:{type:"number"},visible:{prop:"displayMode",eq:"custom"}},{type:"select",name:"commitMode",label:"Commit Mode",options:[{value:"onRelease",label:"On Release"},{value:"throttled",label:"Throttled"},{value:"debounced",label:"Debounced"}]},{type:"number",name:"commitThrottleMs",label:"Throttle (ms)",min:50,max:2e3,visible:{prop:"commitMode",eq:"throttled"}},{type:"number",name:"commitDebounceMs",label:"Debounce (ms)",min:50,max:2e3,visible:{prop:"commitMode",eq:"debounced"}}]},{id:"overrides",label:"Overrides",traits:[{type:"checkbox",name:"useMinOverride",label:"Override Min"},{type:"number",name:"minOverride",label:"Min",step:.01,binding:{type:"number"},visible:{prop:"useMinOverride",eq:!0}},{type:"checkbox",name:"useMaxOverride",label:"Override Max"},{type:"number",name:"maxOverride",label:"Max",step:.01,binding:{type:"number"},visible:{prop:"useMaxOverride",eq:!0}},{type:"checkbox",name:"useStepOverride",label:"Override Step"},{type:"number",name:"stepOverride",label:"Step",step:.01,binding:{type:"number"},visible:{prop:"useStepOverride",eq:!0}},{type:"checkbox",name:"usePrecisionOverride",label:"Override Precision"},{type:"number",name:"precisionOverride",label:"Precision",min:0,max:6,visible:{prop:"usePrecisionOverride",eq:!0}}]},{id:"range",label:"Range",traits:[{type:"number",name:"rangeMinGap",label:"Min Gap",min:0,max:100,step:.01}]},{id:"disabled",label:"Disabled",traits:[{type:"select",name:"disableMode",label:"Disabled When",options:[{value:"auto",label:"Unavailable/Unknown"},{value:"custom",label:"Custom"},{value:"never",label:"Never"}]},{type:"checkbox",name:"disabled",label:"Disabled",binding:{type:"select",options:[{label:"False",value:"false"},{label:"True",value:"true"}]},visible:{prop:"disableMode",eq:"custom"}}]}]},targetStyles:{block:{styles:{preset:"full"}},track:{label:"Track",description:"Slider track container",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"track-inactive":{label:"Track Inactive",description:"Inactive track area",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"track-active":{label:"Track Active",description:"Active track area",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},thumb:{label:"Thumb",description:"Single slider thumb",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"thumb-low":{label:"Thumb Low",description:"Range low thumb",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"thumb-high":{label:"Thumb High",description:"Range high thumb",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},value:{label:"Value",description:"Value label text",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},tooltip:{label:"Tooltip",description:"Tooltip value bubble",styles:{preset:"full",exclude:{groups:["layout","flex"]}}}}}}updated(e){super.updated(e),e.has("block")&&(this.entity=this.resolvedEntityId());const t=this.resolveProperty("orientation","horizontal");this.classList.toggle("vertical","vertical"===t)}disconnectedCallback(){this._clearCommitTimers(),this._clearPendingSync(),this._dragState&&(window.removeEventListener("pointermove",this._onTrackPointerMove),window.removeEventListener("pointerup",this._onTrackPointerUp),this._dragState=null),super.disconnectedCallback()}render(){if(!this.entity)return h`<div class="no-entity">No entity selected</div>`;const e=this._resolveConfig();if(!e)return h`<div class="no-entity">Entity unavailable</div>`;const t=this.resolveProperty("orientation","horizontal"),i=this._buildRenderContext(e,t);return"vertical"===t?this._renderVertical(i):this._renderHorizontal(i)}_buildRenderContext(e,t){const i=this._isDisabled(),n=this._getDisplayValues(e),r=this._getDefaultActiveColor(e.domain),o=this.resolvePropertyAsBoolean("showValue"),s=this._safeRange(e.displayMin,e.displayMax),a=n.single??e.displayMin,l=n.low??e.displayMin,c=n.high??e.displayMax,d=t=>(t-e.displayMin)/s*100,u=d(a),h=d(l),p=d(c),g=this._clamp(u,0,100),v=this._clamp(h,0,100),y=this._clamp(p,0,100),b=this.resolvePropertyAsBoolean("invert"),f=b?100-g:g,k=b?100-v:v,x=b?100-y:y,w="range"===e.mode?Math.min(k,x):b?f:0,S="range"===e.mode?Math.max(k,x):b?100:f,_=this.getTargetStyle("track"),T=this.getTargetStyle("track-inactive"),A=this._withDefaultActiveColor(this.getTargetStyle("track-active"),r),I=this.getTargetStyle("thumb"),C=this.getTargetStyle("thumb-low"),P=this.getTargetStyle("thumb-high"),M=this.getTargetStyle("value"),$=this.getTargetStyle("tooltip"),L=this.resolvePropertyAsBoolean("showThumb"),B=this.resolveProperty("shape","rounded"),E=m({"slider-root":!0,vertical:"vertical"===t,disabled:i,"sync-pending":this._syncPending,dragging:this._isInteracting,[`shape-${B}`]:!0}),D=this._formatRangeValue(n,e);return{config:e,displayValues:n,isDisabled:i,activeColor:r,showValue:o,singleValue:a,lowValue:l,highValue:c,positionSinglePercent:f,positionLowPercent:k,positionHighPercent:x,startPercent:w,endPercent:S,trackStyle:_,trackInactiveStyle:T,trackActiveStyle:A,thumbStyle:I,thumbLowStyle:C,thumbHighStyle:P,valueStyle:M,tooltipStyle:$,showThumb:L,shape:B,valueText:D,rootClasses:E}}_renderHorizontal(e){const t=this.resolveProperty("valuePositionHorizontal","inline"),i=this.resolveProperty("inlinePositionHorizontal","left"),n=this.resolveProperty("insidePositionHorizontal","left"),r=e.showValue,o=r&&"tooltip"===t&&this._isInteracting,s=r&&"inline"===t?h`
            <div
                class="value-inline align-${i} ${this.isStyleTargetActive("value")?"style-target-active":""}"
                style=${u(e.valueStyle)}
                data-style-target="value"
                data-action-target="value"
            >${e.valueText}</div>
        `:d,a=r&&"inside"===t?h`
            <div
                class=${m({"value-label":!0,"value-inside":!0,"position-center":"center"===n,"position-left":"left"===n,"position-right":"right"===n,"style-target-active":this.isStyleTargetActive("value")})}
                style=${u(e.valueStyle)}
                data-style-target="value"
                data-action-target="value"
            >${e.valueText}</div>
        `:d,l=m({"slider-row":!0}),c=r&&"inline"===t,p=c&&"left"===i,g=c&&"left"!==i;return h`
            <div
                class=${e.rootClasses}
                style=${u({"--slider-active-color":e.activeColor})}
            >
                <div class=${l}>
                    ${p?s:d}
                    <div
                        class="track ${this.isStyleTargetActive("track")?"style-target-active":""}"
                        style=${u(e.trackStyle)}
                        data-style-target="track"
                    >
                        <div
                            class="track-inactive ${this.isStyleTargetActive("track-inactive")?"style-target-active":""}"
                            style=${u(e.trackInactiveStyle)}
                            data-style-target="track-inactive"
                        ></div>
                        <div
                            class="track-active ${this.isStyleTargetActive("track-active")?"style-target-active":""}"
                            style=${u({...e.trackActiveStyle,left:`${e.startPercent}%`,width:e.endPercent-e.startPercent+"%"})}
                            data-style-target="track-active"
                        ></div>
                        ${a}

                        ${"range"===e.config.mode?h`
                            ${e.showThumb?h`
                                <div
                                    class="thumb ${"low"===this._activeThumb?"active":""} ${this.isStyleTargetActive("thumb-low")?"style-target-active":""}"
                                    style=${u({...e.thumbLowStyle,left:`${e.positionLowPercent}%`})}
                                    data-style-target="thumb-low"
                                ></div>
                                <div
                                    class="thumb ${"high"===this._activeThumb?"active":""} ${this.isStyleTargetActive("thumb-high")?"style-target-active":""}"
                                    style=${u({...e.thumbHighStyle,left:`${e.positionHighPercent}%`})}
                                    data-style-target="thumb-high"
                                ></div>
                            `:d}

                            ${o?h`
                                <div
                                    class="tooltip ${this.isStyleTargetActive("tooltip")?"style-target-active":""}"
                                    style=${u({...e.tooltipStyle,left:`${e.positionLowPercent}%`})}
                                    data-style-target="tooltip"
                                >${this._formatSingleValue(e.lowValue,e.config)}</div>
                                <div
                                    class="tooltip ${this.isStyleTargetActive("tooltip")?"style-target-active":""}"
                                    style=${u({...e.tooltipStyle,left:`${e.positionHighPercent}%`})}
                                    data-style-target="tooltip"
                                >${this._formatSingleValue(e.highValue,e.config)}</div>
                            `:d}
                        `:h`
                            ${e.showThumb?h`
                                <div
                                    class="thumb ${"single"===this._activeThumb?"active":""} ${this.isStyleTargetActive("thumb")?"style-target-active":""}"
                                    style=${u({...e.thumbStyle,left:`${e.positionSinglePercent}%`})}
                                    data-style-target="thumb"
                                ></div>
                            `:d}

                            ${o?h`
                                <div
                                    class="tooltip ${this.isStyleTargetActive("tooltip")?"style-target-active":""}"
                                    style=${u({...e.tooltipStyle,left:`${e.positionSinglePercent}%`})}
                                    data-style-target="tooltip"
                                >${this._formatSingleValue(e.singleValue,e.config)}</div>
                            `:d}
                        `}
                    </div>

                    ${g?s:d}
                </div>
            </div>
        `}_renderVertical(e){const t=this.resolveProperty("valuePositionVertical","top"),i=this.resolveProperty("insidePositionVertical","middle"),n=e.showValue,r=n&&"tooltip"===t&&this._isInteracting,o=!n||"top"!==t&&"bottom"!==t?d:h`
            <div
                class="value-label value-vertical ${this.isStyleTargetActive("value")?"style-target-active":""}"
                style=${u(e.valueStyle)}
                data-style-target="value"
                data-action-target="value"
            >${e.valueText}</div>
        `,s=n&&"inside"===t?h`
            <div
                class=${m({"value-label":!0,"value-inside":!0,vertical:!0,"position-top":"top"===i,"position-middle":"middle"===i,"position-bottom":"bottom"===i,"style-target-active":this.isStyleTargetActive("value")})}
                style=${u(e.valueStyle)}
                data-style-target="value"
                data-action-target="value"
            >${e.valueText}</div>
        `:d,a=n&&"top"===t,l=n&&"bottom"===t;return h`
            <div
                class=${e.rootClasses}
                style=${u({"--slider-active-color":e.activeColor})}
            >
                <div class="slider-row">
                    ${a?o:d}
                    <div
                        class="track ${this.isStyleTargetActive("track")?"style-target-active":""}"
                        style=${u(e.trackStyle)}
                        data-style-target="track"
                    >
                        <div
                            class="track-inactive ${this.isStyleTargetActive("track-inactive")?"style-target-active":""}"
                            style=${u(e.trackInactiveStyle)}
                            data-style-target="track-inactive"
                        ></div>
                        <div
                            class="track-active ${this.isStyleTargetActive("track-active")?"style-target-active":""}"
                            style=${u({...e.trackActiveStyle,bottom:`${e.startPercent}%`,height:e.endPercent-e.startPercent+"%"})}
                            data-style-target="track-active"
                        ></div>
                        ${s}

                        ${"range"===e.config.mode?h`
                            ${e.showThumb?h`
                                <div
                                    class="thumb ${"low"===this._activeThumb?"active":""} ${this.isStyleTargetActive("thumb-low")?"style-target-active":""}"
                                    style=${u({...e.thumbLowStyle,bottom:`${e.positionLowPercent}%`})}
                                    data-style-target="thumb-low"
                                ></div>
                                <div
                                    class="thumb ${"high"===this._activeThumb?"active":""} ${this.isStyleTargetActive("thumb-high")?"style-target-active":""}"
                                    style=${u({...e.thumbHighStyle,bottom:`${e.positionHighPercent}%`})}
                                    data-style-target="thumb-high"
                                ></div>
                            `:d}

                            ${r?h`
                                <div
                                    class="tooltip ${this.isStyleTargetActive("tooltip")?"style-target-active":""}"
                                    style=${u({...e.tooltipStyle,top:100-e.positionLowPercent+"%"})}
                                    data-style-target="tooltip"
                                >${this._formatSingleValue(e.lowValue,e.config)}</div>
                                <div
                                    class="tooltip ${this.isStyleTargetActive("tooltip")?"style-target-active":""}"
                                    style=${u({...e.tooltipStyle,top:100-e.positionHighPercent+"%"})}
                                    data-style-target="tooltip"
                                >${this._formatSingleValue(e.highValue,e.config)}</div>
                            `:d}
                        `:h`
                            ${e.showThumb?h`
                                <div
                                    class="thumb ${"single"===this._activeThumb?"active":""} ${this.isStyleTargetActive("thumb")?"style-target-active":""}"
                                    style=${u({...e.thumbStyle,bottom:`${e.positionSinglePercent}%`})}
                                    data-style-target="thumb"
                                ></div>
                            `:d}

                            ${r?h`
                                <div
                                    class="tooltip ${this.isStyleTargetActive("tooltip")?"style-target-active":""}"
                                    style=${u({...e.tooltipStyle,top:100-e.positionSinglePercent+"%"})}
                                    data-style-target="tooltip"
                                >${this._formatSingleValue(e.singleValue,e.config)}</div>
                            `:d}
                        `}
                    </div>

                    ${l?o:d}
                </div>
            </div>
        `}getNativeActionTargetIds(){return[]}handleNativePointerDown(e,t){var i;const n=this._resolveConfig();if(!n||this._isDisabled())return!1;if(!this.areActionsEnabled())return!1;if("mouse"===e.pointerType&&0!==e.button)return!1;const r=null==(i=this.renderRoot)?void 0:i.querySelector(".track");if(!r)return!1;if(!e.composedPath().includes(r))return!1;e.preventDefault(),e.stopPropagation();const o=r.getBoundingClientRect(),s=this._displayFromPointer(e.clientX,e.clientY,o,n),a="range"===n.mode?this._pickRangeThumb(s,n):"single";if("hold"===this.resolveProperty("activationMode","press")){const t=this.resolvePropertyAsBoolean("holdTapEnabled");return this._scheduleHoldActivation(e,o,n,a,r,t),!0}return this._beginDrag(e.pointerId,e.clientX,e.clientY,o,n,a,r),!0}_scheduleHoldActivation(e,t,i,n,r,o){var s;this._cancelHoldActivation(!1,!1),this._pendingHold={pointerId:e.pointerId,config:i,thumb:n,rect:t,target:r,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY,hasDragStarted:!1,shouldTriggerTapAction:o},null==(s=r.setPointerCapture)||s.call(r,e.pointerId),window.addEventListener("pointermove",this._onHoldPointerMove),window.addEventListener("pointerup",this._onHoldPointerUp),window.addEventListener("pointercancel",this._onHoldPointerUp),this._holdActivationTimerId=window.setTimeout(()=>{const e=this._pendingHold;e&&(this._pendingHold=null,this._holdActivationTimerId=null,this._removeHoldListeners(),e.hasDragStarted=!0,this._beginDrag(e.pointerId,e.lastX,e.lastY,e.rect,e.config,e.thumb,e.target))},350)}_cancelHoldActivation(e,t){var i;const n=this._pendingHold;if(null!==this._holdActivationTimerId&&(window.clearTimeout(this._holdActivationTimerId),this._holdActivationTimerId=null),t&&n&&!n.hasDragStarted&&this._maybeTriggerHoldTapAction(n),e&&(null==(i=null==n?void 0:n.target)?void 0:i.releasePointerCapture))try{n.target.releasePointerCapture(n.pointerId)}catch{}this._pendingHold=null,this._removeHoldListeners()}_removeHoldListeners(){window.removeEventListener("pointermove",this._onHoldPointerMove),window.removeEventListener("pointerup",this._onHoldPointerUp),window.removeEventListener("pointercancel",this._onHoldPointerUp)}_maybeTriggerHoldTapAction(e){if(!e.shouldTriggerTapAction)return;if(!this.hass||!this.block||!this.eventBus)return;const t=this.resolvedEntityId();if(!t)return;const i="toggle"===this.resolveProperty("holdTapAction","more-info")?{action:"toggle"}:{action:"more-info"};Ke({hass:this.hass,element:this,action:i,trigger:"tap",entityId:t,eventBus:this.eventBus,blockId:this.block.id,targetId:"block",slotId:void 0})}_beginDrag(e,t,i,n,r,o,s){var a;const l=this._displayFromPointer(t,i,n,r);this._activeThumb=o,this._isInteracting=!0,this._applyDisplayValue(l,r,o),this._dragState={pointerId:e,config:r,thumb:o,rect:n},null==(a=s.setPointerCapture)||a.call(s,e),window.addEventListener("pointermove",this._onTrackPointerMove),window.addEventListener("pointerup",this._onTrackPointerUp)}_applyDisplayValue(e,t,i){if("single"===t.mode){const i=this._normalizeDisplayValues({single:e},t);return this._localDisplayValue=i.single??e,void this._scheduleCommit(i,t,"single")}const n=this._getDisplayValues(t),r={low:n.low??t.displayMin,high:n.high??t.displayMax};"low"===i?r.low=e:r.high=e;const o=this._normalizeDisplayValues(r,t,i);this._localDisplayLow=o.low??r.low??t.displayMin,this._localDisplayHigh=o.high??r.high??t.displayMax,this._scheduleCommit(o,t,i)}_commitOnRelease(e,t){if("onRelease"===this._getCommitMode())if("single"===e.mode){if(null===this._localDisplayValue)return;this._commitDisplayValues({single:this._localDisplayValue},e,t)}else{if(null===this._localDisplayLow||null===this._localDisplayHigh)return;this._commitDisplayValues({low:this._localDisplayLow,high:this._localDisplayHigh},e,t)}}_displayFromPointer(e,t,i,n){let r=0;if("vertical"===this.resolveProperty("orientation","horizontal")){const e=this._clamp(i.bottom-t,0,i.height);r=i.height>0?e/i.height:0}else{const t=this._clamp(e-i.left,0,i.width);r=i.width>0?t/i.width:0}const o=100*r,s=this._applyInvert(o),a=n.displayMax-n.displayMin;return n.displayMin+s/100*a}_applyInvert(e){return this.resolvePropertyAsBoolean("invert")?100-e:e}_pickRangeThumb(e,t){const i=this._getDisplayValues(t),n=i.low??t.displayMin,r=i.high??t.displayMax;return Math.abs(e-n)<=Math.abs(e-r)?"low":"high"}_getCommitMode(){return this.resolveProperty("commitMode","onRelease")}_scheduleCommit(e,t,i){if(!t.supportsService)return;const n=this._getCommitMode();if("onRelease"!==n){if("throttled"===n){const n=Math.max(50,this.resolvePropertyAsNumber("commitThrottleMs",200)),r=Date.now();if(!this._lastCommitAt||r-this._lastCommitAt>=n)return this._lastCommitAt=r,void this._commitDisplayValues(e,t,i);if(this._pendingCommit=e,null===this._throttleTimerId){const e=Math.max(0,n-(r-this._lastCommitAt));this._throttleTimerId=window.setTimeout(()=>{this._throttleTimerId=null,this._pendingCommit&&(this._lastCommitAt=Date.now(),this._commitDisplayValues(this._pendingCommit,t,i),this._pendingCommit=null)},e)}return}if("debounced"===n){const n=Math.max(50,this.resolvePropertyAsNumber("commitDebounceMs",300));this._pendingCommit=e,null!==this._debounceTimerId&&window.clearTimeout(this._debounceTimerId),this._debounceTimerId=window.setTimeout(()=>{this._debounceTimerId=null,this._pendingCommit&&(this._commitDisplayValues(this._pendingCommit,t,i),this._pendingCommit=null)},n)}}}async _commitDisplayValues(e,t,i){var n;if(!(this.hass&&this.entity&&t.supportsService&&t.service))return;if(this._isDisabled())return;if(!this.areActionsEnabled())return;const r=this._normalizeDisplayValues(e,t,"high"===i?"high":"low"===i?"low":void 0),o=this._toActualValues(r,t,i),s="brightness_pct"===t.service.field?r:o,a=this._buildServicePayload(s,t);if(!a)return;this._lastCommittedValues={...t.values},this._setPendingSync(o);const l={action:"call-service",service:`${a.domain}.${a.service}`,data:a.data};try{await Ke({hass:this.hass,element:this,action:l,trigger:"tap",entityId:this.entity,eventBus:this.eventBus,blockId:null==(n=this.block)?void 0:n.id,targetId:"block",slotId:void 0,throwOnError:!0})}catch(c){this._clearPendingSync(),this._revertToLastCommitted(t),this._emitServiceError(c,a)}}_clearCommitTimers(){null!==this._throttleTimerId&&(window.clearTimeout(this._throttleTimerId),this._throttleTimerId=null),null!==this._debounceTimerId&&(window.clearTimeout(this._debounceTimerId),this._debounceTimerId=null),this._pendingCommit=null}_resolveConfig(){const e=this.getEntityState(),t=this.getEntityDomain();if(!e||!t)return null;const i=e.attributes||{},n=this.resolveProperty("mode","auto"),r=this.resolveProperty("coverControl","auto"),o=this.resolveProperty("displayMode","auto"),s=this.resolveProperty("valueSource","state"),a=this.resolveProperty("valueAttribute","");let l,c="single",d={},u=0,h=100,p=1,g="",m="raw";switch(t){case"light":{const e=this._getNumberAttribute(i,"brightness");u=0,h=255,p=1,d.single=e??u,m="percent",l={domain:"light",service:"turn_on",field:"brightness"};break}case"media_player":{const e=this._getNumberAttribute(i,"volume_level");u=0,h=1,p=.01,d.single=e??u,m="percent",l={domain:"media_player",service:"volume_set",field:"volume_level"};break}case"cover":{const e=null!==this._getNumberAttribute(i,"current_tilt_position")||null!==this._getNumberAttribute(i,"tilt_position"),t="tilt"===r||"auto"===r&&e,n=t?this._firstNumber(i,["current_tilt_position","tilt_position"]):this._firstNumber(i,["current_position","position"]);u=0,h=100,p=1,d.single=n??u,l=t?{domain:"cover",service:"set_cover_tilt_position",field:"tilt_position"}:{domain:"cover",service:"set_cover_position",field:"position"},g="%";break}case"fan":{const e=this._firstNumber(i,["percentage","speed","speed_percent","speed_percentage"]);u=0,h=100,p=this._getNumberAttribute(i,"percentage_step")??1,d.single=e??u,l={domain:"fan",service:"set_percentage",field:"percentage"},g="%";break}case"humidifier":{const e=this._firstNumber(i,["humidity","target_humidity"]);u=this._getNumberAttribute(i,"min_humidity")??0,h=this._getNumberAttribute(i,"max_humidity")??100,p=this._getNumberAttribute(i,"humidity_step")??1,d.single=e??u,l={domain:"humidifier",service:"set_humidity",field:"humidity"},g="%";break}case"climate":{const e=this._getNumberAttribute(i,"target_temp_low"),t=this._getNumberAttribute(i,"target_temp_high");c=null!==e&&null!==t?"range":"single",u=this._getNumberAttribute(i,"min_temp")??7,h=this._getNumberAttribute(i,"max_temp")??35;const n=this._getTemperatureUnit(i);if(p=this._getNumberAttribute(i,"target_temp_step")??this._getDefaultTempStep(n),g=n,"range"===c)d.low=e??u,d.high=t??h,l={domain:"climate",service:"set_temperature",field:"temperature",fieldLow:"target_temp_low",fieldHigh:"target_temp_high"};else{const e=this._firstNumber(i,["temperature","target_temperature"]);d.single=e??u,l={domain:"climate",service:"set_temperature",field:"temperature"}}break}case"water_heater":{const e=this._firstNumber(i,["temperature","target_temperature"]);u=this._getNumberAttribute(i,"min_temp")??30,h=this._getNumberAttribute(i,"max_temp")??75;const t=this._getTemperatureUnit(i);p=this._getNumberAttribute(i,"target_temp_step")??this._getNumberAttribute(i,"temperature_step")??this._getDefaultTempStep(t),g=t,d.single=e??u,l={domain:"water_heater",service:"set_temperature",field:"temperature"};break}case"input_number":{const t=this._parseNumber(e.state)??0;u=this._getNumberAttribute(i,"min")??0,h=this._getNumberAttribute(i,"max")??100,p=this._getNumberAttribute(i,"step")??1,g=String(i.unit_of_measurement??""),d.single=t,l={domain:"input_number",service:"set_value",field:"value"};break}case"number":{const t=this._parseNumber(e.state)??0;u=this._getNumberAttribute(i,"min")??0,h=this._getNumberAttribute(i,"max")??100,p=this._getNumberAttribute(i,"step")??1,g=String(i.unit_of_measurement??""),d.single=t,l={domain:"number",service:"set_value",field:"value"};break}default:{const n=this._parseNumber(e.state);u=this._getNumberAttribute(i,"min")??0,h=this._getNumberAttribute(i,"max")??100,p=this._getNumberAttribute(i,"step")??1,d.single=n??u,g=String(i.unit_of_measurement??"");const r=this._resolveGenericService(t);r&&(l=r);break}}if("auto"!==n&&("climate"===t?c=n:"single"===n&&(c="single")),"range"!==c||void 0!==d.low&&void 0!==d.high||(d.low=d.low??u,d.high=d.high??h),"single"===c)if("attribute"===s&&a){const e=this._getNumberAttribute(i,a);null!==e&&(d.single=e)}else if("state"===s){const t=this._parseNumber(e.state);null!==t&&(d.single=t)}if("range"===c&&"attribute"===s&&a){const e=this._getNumberAttribute(i,a);null!==e&&(d.low=e,d.high=e)}if(this.resolvePropertyAsBoolean("useMinOverride")&&(u=this.resolvePropertyAsNumber("minOverride",u)),this.resolvePropertyAsBoolean("useMaxOverride")&&(h=this.resolvePropertyAsNumber("maxOverride",h)),this.resolvePropertyAsBoolean("useStepOverride")&&(p=this.resolvePropertyAsNumber("stepOverride",p)),u>h){const e=u;u=h,h=e}p<=0&&(p=1),"auto"!==o&&(m=o),"light"===t&&(l="percent"===m?{domain:"light",service:"turn_on",field:"brightness_pct"}:{domain:"light",service:"turn_on",field:"brightness"});let v=u,y=h,b=p;if("percent"===m)v=0,y=100,b=1,g="%";else if("custom"===m){if(v=this.resolvePropertyAsNumber("displayMin",u),y=this.resolvePropertyAsNumber("displayMax",h),v>y){const e=v;v=y,y=e}v===y&&(y=v+1),b=this._mapStep(p,u,h,v,y)}g||(g=this._guessUnitForDomain(t,m));let f=this._decimalsFromStep(b);return this.resolvePropertyAsBoolean("usePrecisionOverride")&&(f=Math.max(0,this.resolvePropertyAsNumber("precisionOverride",f))),{domain:t,mode:c,actualMin:u,actualMax:h,actualStep:p,displayMin:v,displayMax:y,displayStep:b,displayMode:m,precision:f,unit:g,values:d,service:l,supportsService:Boolean(l)}}_resolveGenericService(e){var t,i;const n=null==(i=null==(t=this.hass)?void 0:t.services)?void 0:i[e];if(n)return n.set_value?{domain:e,service:"set_value",field:"value"}:void 0}_getDisplayValues(e){if(this._isInteracting)return{single:this._localDisplayValue??this._toDisplayValue(e.values.single??e.actualMin,e),low:this._localDisplayLow??this._toDisplayValue(e.values.low??e.actualMin,e),high:this._localDisplayHigh??this._toDisplayValue(e.values.high??e.actualMax,e)};if(this._pendingSync){const t=Date.now();if(this._pendingSyncMatches(e))this._clearPendingSync();else if(t-this._pendingSync.startedAt<1500)return{single:this._toDisplayValue(this._pendingSync.values.single??e.values.single??e.actualMin,e),low:this._toDisplayValue(this._pendingSync.values.low??e.values.low??e.actualMin,e),high:this._toDisplayValue(this._pendingSync.values.high??e.values.high??e.actualMax,e)};this._clearPendingSync()}return{single:this._toDisplayValue(e.values.single??e.actualMin,e),low:this._toDisplayValue(e.values.low??e.actualMin,e),high:this._toDisplayValue(e.values.high??e.actualMax,e)}}_toDisplayValue(e,t){const i=this._safeRange(t.actualMin,t.actualMax),n=this._safeRange(t.displayMin,t.displayMax),r=(e-t.actualMin)/i,o=t.displayMin+r*n;return this._clamp(o,t.displayMin,t.displayMax)}_pendingSyncMatches(e){if(!this._pendingSync)return!1;const t=Math.max(e.actualStep,.01)/2;if("range"===e.mode){if(void 0===this._pendingSync.values.low||void 0===this._pendingSync.values.high)return!1;if(void 0===e.values.low||void 0===e.values.high)return!1;const i=Math.abs(e.values.low-this._pendingSync.values.low),n=Math.abs(e.values.high-this._pendingSync.values.high);return i<=t&&n<=t}if(void 0===this._pendingSync.values.single||void 0===e.values.single)return!1;return Math.abs(e.values.single-this._pendingSync.values.single)<=t}_normalizeDisplayValues(e,t,i){if("single"===t.mode){const i=this._toActualValue(e.single??t.displayMin,t),n=this._snapToStep(i,t.actualMin,t.actualStep);return{single:this._toDisplayValue(n,t)}}const n=this._toActualValue(e.low??t.displayMin,t),r=this._toActualValue(e.high??t.displayMax,t),o=this._applyRangeConstraints(n,r,t,"high"===i?"high":"low");return{low:this._toDisplayValue(o.low,t),high:this._toDisplayValue(o.high,t)}}_toActualValues(e,t,i){if("single"===t.mode){const i=this._toActualValue(e.single??t.displayMin,t);return{single:this._snapToStep(i,t.actualMin,t.actualStep)}}const n=this._toActualValue(e.low??t.displayMin,t),r=this._toActualValue(e.high??t.displayMax,t),o=this._applyRangeConstraints(n,r,t,"high"===i?"high":"low");return{low:this._snapToStep(o.low,t.actualMin,t.actualStep),high:this._snapToStep(o.high,t.actualMin,t.actualStep)}}_applyRangeConstraints(e,t,i,n){const r=Math.max(0,this.resolvePropertyAsNumber("rangeMinGap",0));let o=this._clamp(e,i.actualMin,i.actualMax),s=this._clamp(t,i.actualMin,i.actualMax);if("low"===n?o>s-r&&(o=s-r):s<o+r&&(s=o+r),o=this._clamp(o,i.actualMin,i.actualMax),s=this._clamp(s,i.actualMin,i.actualMax),o>s){const e=o;o=s,s=e}return{low:o,high:s}}_buildServicePayload(e,t){if(!t.service||!this.entity)return null;const i={entity_id:this.entity};return"range"===t.mode&&t.service.fieldLow&&t.service.fieldHigh?(i[t.service.fieldLow]=e.low,i[t.service.fieldHigh]=e.high):i[t.service.field]=e.single,{domain:t.service.domain,service:t.service.service,data:i}}_emitServiceError(e,t){var i,n;const r={entityId:this.entity,error:e,payload:t,blockId:null==(i=this.block)?void 0:i.id};null==(n=this.eventBus)||n.dispatchEvent("slider-service-error",r),this.dispatchEvent(new CustomEvent("slider-service-error",{detail:r,bubbles:!0,composed:!0}))}_setPendingSync(e){this._pendingSync={values:e,startedAt:Date.now()},this._syncPending=!0,null!==this._pendingSyncTimeoutId&&window.clearTimeout(this._pendingSyncTimeoutId),this._pendingSyncTimeoutId=window.setTimeout(()=>{this._clearPendingSync(),this.requestUpdate()},1500)}_clearPendingSync(){this._pendingSync=null,this._syncPending=!1,null!==this._pendingSyncTimeoutId&&(window.clearTimeout(this._pendingSyncTimeoutId),this._pendingSyncTimeoutId=null)}_revertToLastCommitted(e){if(!this._lastCommittedValues)return;const t=this._getDisplayValues({...e,values:this._lastCommittedValues});this._localDisplayValue=t.single??null,this._localDisplayLow=t.low??null,this._localDisplayHigh=t.high??null,this._lastCommittedValues=null,this.requestUpdate()}_formatSingleValue(e,t){const i=this._formatNumber(e,t.precision);return t.unit?`${i}${t.unit}`:i}_formatRangeValue(e,t){if("range"===t.mode){const i=e.low??t.displayMin,n=e.high??t.displayMax,r=this._formatNumber(i,t.precision),o=this._formatNumber(n,t.precision);return t.unit?`${r}-${o}${t.unit}`:`${r}-${o}`}const i=e.single??t.displayMin;return this._formatSingleValue(i,t)}_formatNumber(e,t){if(!Number.isFinite(e))return"-";const i=e.toFixed(t);return t>0?i.replace(/\.?0+$/,""):i}_isDisabled(){const e=this.resolveProperty("disableMode","auto");return"never"!==e&&("custom"===e?this.resolvePropertyAsBoolean("disabled"):!this.isEntityAvailable())}_getDefaultActiveColor(e){return e&&pi[e]||"var(--accent-color, #2196f3)"}_withDefaultActiveColor(e,t){return"backgroundColor"in e||"background"in e?e:{...e,backgroundColor:t}}_safeRange(e,t){const i=t-e;return 0===i?1:i}_guessUnitForDomain(e,t){return"percent"===t||"fan"===e||"cover"===e||"humidifier"===e?"%":""}_getTemperatureUnit(e){var t,i,n;return String(e.temperature_unit||e.unit_of_measurement||(null==(n=null==(i=null==(t=this.hass)?void 0:t.config)?void 0:i.unit_system)?void 0:n.temperature)||"°C")}_getDefaultTempStep(e){return e.includes("F")?1:.5}_getNumberAttribute(e,t){if(!e||!(t in e))return null;const i=this._parseNumber(e[t]);return null===i?null:i}_firstNumber(e,t){for(const i of t){const t=this._getNumberAttribute(e,i);if(null!==t)return t}return null}_parseNumber(e){if("number"==typeof e)return Number.isFinite(e)?e:null;if("string"==typeof e){const t=parseFloat(e);return Number.isFinite(t)?t:null}return null}_decimalsFromStep(e){if(!Number.isFinite(e)||e<=0)return 0;const t=e.toString();if(t.includes("e-")){const e=parseInt(t.split("e-")[1]||"0",10);return Number.isFinite(e)?e:0}const i=t.indexOf(".");return-1===i?0:t.length-i-1}_mapStep(e,t,i,n,r){const o=i-t;if(0===o)return 1;const s=e/o*(r-n);return s>0?s:1}_snapToStep(e,t,i){if(!Number.isFinite(e))return t;if(i<=0)return e;return t+Math.round((e-t)/i)*i}_clamp(e,t,i){return Math.min(i,Math.max(t,e))}_toActualValue(e,t){const i=this._safeRange(t.actualMin,t.actualMax),n=this._safeRange(t.displayMin,t.displayMax),r=(this._clamp(e,t.displayMin,t.displayMax)-t.displayMin)/n;return t.actualMin+r*i}};function mi(e){const t=e.match(/\d+/g);return t?t.map(e=>Number.parseInt(e,10)).filter(e=>Number.isFinite(e)):[]}function vi(e,t){const i=mi(e),n=mi(t),r=Math.max(i.length,n.length,1);for(let o=0;o<r;o+=1){const e=i[o]??0,t=n[o]??0;if(e>t)return 1;if(e<t)return-1}return 0}gi.styles=[...Dt.styles,l`
            :host {
                --block-size-height: 20px;
                --block-size-width: 100%;
                --block-border-radius: var(--ha-card-border-radius, var(--ha-border-radius-lg));
                --slider-thumb-size: var(--block-size-height);
                display: block;
                height: var(--block-size-height);
                border-radius: var(--block-border-radius);
            }
            :host, :host(.block-flow) {
                width: var(--block-size-width);
            }
            :host(.vertical) {
                --block-size-height: 100px;
                --block-size-width: 30px;
                --slider-thumb-size: var(--block-size-width);
            }

            .slider-root {
                display: flex;
                flex-direction: column;
                gap: 6px;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: inherit;
            }

            .slider-row {
                display: flex;
                align-items: center;
                gap: 10px;
                width: 100%;
                height: 100%;
                border-radius: inherit;
            }

            .slider-root.vertical .slider-row {
                flex-direction: column;
                gap: 10px;
            }

            .slider-root.vertical .track {
                flex: 1 1 auto;
                width: 100%;
            }

            .track {
                --slider-track-border-radius: var(--block-border-radius);
                position: relative;
                width: 100%;
                height: 100%;
                border-radius: var(--slider-track-border-radius);
                background: var(--slider-inactive-color, rgba(0, 0, 0, 0.12));
                overflow: visible;
                touch-action: none;
                cursor: pointer;
            }

            .slider-root.dragging,
            .slider-root.dragging .track {
                cursor: ew-resize;
            }

            .slider-root.vertical.dragging,
            .slider-root.vertical.dragging .track {
                cursor: ns-resize;
            }

            .track-inactive {
                position: absolute;
                inset: 0;
                border-radius: var(--slider-track-border-radius);
            }

            .track-active {
                position: absolute;
                top: 0;
                height: 100%;
                border-radius: var(--slider-track-border-radius);
                background: var(--slider-active-color, var(--accent-color, #2196f3));
            }

            .slider-root.vertical .track-active {
                top: auto;
                left: 0;
                width: 100%;
            }

            .thumb {
                position: absolute;
                top: 50%;
                width: var(--slider-thumb-size);
                height: var(--slider-thumb-size);
                border-radius: 50%;
                background: #fff;
                border: 2px solid var(--slider-active-color, var(--accent-color, #2196f3));
                transform: translate(-50%, -50%);
                box-sizing: border-box;
                pointer-events: none;
                transition: box-shadow 0.15s ease;
            }

            .slider-root.vertical .thumb {
                top: auto;
                left: 50%;
                transform: translate(-50%, 50%);
            }

            .thumb.active {
                box-shadow: 0 0 0 6px rgba(0, 0, 0, 0.08);
            }

            .value-label,
            .value-inline {
                font-size: 12px;
                font-weight: 600;
                color: var(--primary-text-color, #111);
                white-space: nowrap;
                font-variant-numeric: tabular-nums;
            }

            .value-inline {
                min-width: 48px;
                text-align: right;
            }

            .value-inline.align-left {
                text-align: left;
            }

            .value-inline.align-right {
                text-align: right;
            }

            .value-vertical {
                text-align: center;
            }

            .value-inside {
                position: absolute;
                padding: 0;
                box-sizing: border-box;
                text-align: center;
                top: 50%;
                transform: translateY(-50%);
            }
            
            .value-inside.position-center {
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .value-inside.position-left {
                left: 0;
                margin-left: 10px;
            }

            .value-inside.position-right {
                right: 0;
                margin-right: 10px;
            }

            .value-inside.vertical {
                left: 50%;
                top: auto;
                transform: translateX(-50%);
            }

            .value-inside.vertical.position-top {
                top: 0;
                margin-top: 10px;
            }

            .value-inside.vertical.position-middle {
                top: 50%;
                transform: translate(-50%, -50%);
            }

            .value-inside.vertical.position-bottom {
                bottom: 0;
                margin-bottom: 10px;
            }

            .tooltip {
                position: absolute;
                top: -28px;
                transform: translateX(-50%);
                padding: 4px 6px;
                border-radius: 6px;
                background: rgba(0, 0, 0, 0.75);
                color: white;
                font-size: 11px;
                font-weight: 600;
                white-space: nowrap;
                pointer-events: none;
            }

            .slider-root.vertical .tooltip {
                top: auto;
                left: calc(100% + 8px);
                transform: translateY(-50%);
            }

            .slider-root.disabled {
                opacity: 0.6;
                pointer-events: none;
            }

            .slider-root.sync-pending .thumb {
                box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.08);
            }

            .slider-root.shape-square .track,
            .slider-root.shape-square .track-inactive,
            .slider-root.shape-square .track-active {
                border-radius: 0;
            }

            .slider-root.shape-square .thumb {
                border-radius: 0;
            }
        `],hi([c()],gi.prototype,"_localDisplayValue",2),hi([c()],gi.prototype,"_localDisplayLow",2),hi([c()],gi.prototype,"_localDisplayHigh",2),hi([c()],gi.prototype,"_activeThumb",2),hi([c()],gi.prototype,"_isInteracting",2),hi([c()],gi.prototype,"_syncPending",2),gi=hi([p("block-slider")],gi);const yi=new class{constructor(){this.blocks=new Map,this.classes=new Map}get allBlocks(){const e={};return this.blocks.forEach((t,i)=>{null!==t.definition&&(e[i]=t.definition)}),e}register(e,t,i){if(this.blocks.has(e)&&console.warn(`[BlockRegistry] Block type "${e}" is already registered. Overwriting.`),!i.sinceVersion)throw new Error(`[BlockRegistry] Block "${e}" missing required field: sinceVersion`);if(n=i.sinceVersion,!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(n))throw new Error(`[BlockRegistry] Block "${e}" has invalid sinceVersion: ${i.sinceVersion}`);var n;this._validateRegistration(e,i),this.blocks.set(e,i),this.classes.set(e,t)}getBlock(e){var t;return null==(t=this.blocks.get(e))?void 0:t.definition}getBlockClass(e){return this.classes.get(e)}getDefaults(e){var t;return null==(t=this.blocks.get(e))?void 0:t.defaults}getByCategory(e){const t=[];return this.blocks.forEach((i,n)=>{null!==i.definition&&i.definition.category===e&&t.push({type:n,...i.definition})}),t}getAllCategories(){const e=new Set;return this.blocks.forEach(t=>{null!==t.definition&&e.add(t.definition.category)}),Array.from(e)}getAllTypes(){return Array.from(this.blocks.keys())}isRegistered(e){return this.blocks.has(e)}getRegistration(e){return this.blocks.get(e)}getBlockSinceVersion(e){var t;return null==(t=this.blocks.get(e))?void 0:t.sinceVersion}getRequiredBuilderVersionForBlockTypes(e){let t="1.0.0";for(const i of new Set(e)){const e=this.getBlockSinceVersion(i);if(!e)throw new Error(`[BlockRegistry] Block "${i}" missing sinceVersion`);vi(e,t)>0&&(t=e)}return t}getRequiredBuilderVersionForDocument(e){return this.getRequiredBuilderVersionForBlockTypes(Object.values(e.blocks).filter(t=>t.id!==e.rootId).map(e=>e.type))}getBlockStyleOutputConfig(e,t){const i=this.classes.get(e.type);return i?i.getStyleOutputConfig(e,t):null}getBlockActionTargets(e){var t;return null==(t=this.blocks.get(e))?void 0:t.actionTargets}getBlockActionTargetsForBlock(e){var t,i;const n={...(null==(t=this.blocks.get(e.type))?void 0:t.actionTargets)||{}};((null==(i=this.blocks.get(e.type))?void 0:i.exposeBlockActionTarget)??!0)&&!n.block&&(n.block={label:"Block"});const r=this.classes.get(e.type);if(!r)return n;const o=r.getAvailableActionTargetIds(e,n);if(o.length===Object.keys(n).length)return n;const s={};for(const a of o){const e=n[a];e&&(s[a]=e)}return s}getBlockActionTargetDefinition(e,t){var i,n;return null==(n=null==(i=this.blocks.get(e))?void 0:i.actionTargets)?void 0:n[t]}getBlockDefaults(e){var t;return null==(t=this.blocks.get(e))?void 0:t.styleDefaults}getEntityDefaults(e){const t=this.blocks.get(e);return(null==t?void 0:t.entityDefaults)?t.entityDefaults:{mode:"inherited"}}_validateRegistration(e,t){const{definition:i}=t;if(null!==i){if(!i.label)throw new Error(`[BlockRegistry] Block "${e}" missing required field: label`);if(!i.icon)throw new Error(`[BlockRegistry] Block "${e}" missing required field: icon`);if(!i.category&&!i.internal)throw new Error(`[BlockRegistry] Block "${e}" missing required field: category`)}if(t.actionTargets)for(const[n,r]of Object.entries(t.actionTargets))if(!r.label)throw new Error(`[BlockRegistry] Block "${e}" action target "${n}" missing required field: label`)}};function bi(){return`th-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function fi(e){if(!Array.isArray(e))return[];const t=[];for(const i of e){if(!i||"object"!=typeof i)continue;const e=i,n=parseFloat(String(e.value));if(!Number.isFinite(n))continue;const r="string"==typeof e.label?e.label.trim():"";t.push({id:e.id,value:n,color:e.color,label:r||void 0})}return t.sort((e,t)=>e.value-t.value),t}class ki extends Dt{getBaseGaugePropertyGroups(){return[{id:"data",label:"Data",traits:[{type:"select",name:"valueSource",label:"Value Source",options:[{value:"state",label:"State"},{value:"attribute",label:"Attribute"}]},{type:"attribute-picker",name:"valueAttribute",label:"Value Attribute",placeholder:"Select or type attribute",visible:{prop:"valueSource",eq:"attribute"}}]},{id:"range",label:"Range",traits:[{type:"number",name:"minValue",label:"Min",step:.1,binding:{type:"number"}},{type:"number",name:"maxValue",label:"Max",step:.1,binding:{type:"number"}},{type:"checkbox",name:"clampValue",label:"Clamp Value"}]},{id:"value",label:"Value",traits:[{type:"checkbox",name:"showValue",label:"Show Value"},{type:"select",name:"displayMode",label:"Display",options:[{value:"value",label:"Value"},{value:"percent",label:"Percent"}],visible:{prop:"showValue",eq:!0}},{type:"number",name:"decimalPlaces",label:"Decimals",min:0,max:6,visible:{prop:"showValue",eq:!0}},{type:"checkbox",name:"showUnit",label:"Show Unit",visible:{and:[{prop:"showValue",eq:!0},{prop:"displayMode",eq:"value"}]}},{type:"text",name:"customUnit",label:"Custom Unit",placeholder:"Leave empty for auto",visible:{and:[{prop:"showValue",eq:!0},{prop:"displayMode",eq:"value"},{prop:"showUnit",eq:!0}]}},{type:"select",name:"unitPosition",label:"Unit Position",options:[{value:"inline",label:"Inline"},{value:"below",label:"Below Value"}],visible:{and:[{prop:"showValue",eq:!0},{prop:"displayMode",eq:"value"},{prop:"showUnit",eq:!0}]}}]},{id:"thresholds",label:"Thresholds",traits:[{type:"checkbox",name:"thresholdsEnabled",label:"Enable Thresholds"},{type:"action",name:"editThresholds",label:"Thresholds",buttonLabel:"Edit Thresholds",actionId:"open-gauge-thresholds-editor",icon:"◉",visible:this.withThresholdsEnabledVisibility()},{type:"checkbox",name:"valueFollowThresholdColor",label:"Value Follows Threshold Color",visible:this.withThresholdsEnabledVisibility({prop:"showValue",eq:!0})},{type:"checkbox",name:"showThresholdMarkers",label:"Show Markers",visible:this.withThresholdsEnabledVisibility()},{type:"number",name:"markerWidthRatio",label:"Marker Width Ratio",min:.5,max:2,step:.1,visible:this.withThresholdsEnabledVisibility({prop:"showThresholdMarkers",eq:!0})},{type:"number",name:"markerThicknessPx",label:"Marker Thickness (px)",min:.5,max:20,step:.5,visible:this.withThresholdsEnabledVisibility({prop:"showThresholdMarkers",eq:!0})},{type:"select",name:"thresholdColorMode",label:"Color Mode",options:[{value:"active",label:"Active Threshold"},{value:"none",label:"None"}],visible:this.withThresholdsEnabledVisibility()}]},{id:"behavior",label:"Behavior",traits:[{type:"checkbox",name:"animate",label:"Animate"},{type:"number",name:"animationDurationMs",label:"Animation (ms)",min:0,max:4e3,step:10,visible:{prop:"animate",eq:!0}}]}]}getBaseGaugeTargetStyles(){return{block:{styles:{preset:"full"}},value:{label:"Value",description:"Gauge value label",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},unit:{label:"Unit",description:"Gauge unit label",styles:{preset:"full",exclude:{groups:["layout","flex"]}}}}}getBaseGaugePropertyGroup(e){return this.getBaseGaugePropertyGroups().find(t=>t.id===e)}buildMergedBaseDataGroup(e){var t,i,n,r;const o=[...(null==(t=this.getBaseGaugePropertyGroup("data"))?void 0:t.traits)??[]],s=(null==(i=this.getBaseGaugePropertyGroup("range"))?void 0:i.traits)??[],a=(null==(n=this.getBaseGaugePropertyGroup("value"))?void 0:n.traits)??[],l=(null==e?void 0:e.insertAfterShowValueTraits)??[];o.push(...s);let c=0===l.length;for(const d of a)o.push(d),c||"showValue"!==d.name||(o.push(...l),c=!0);return c||o.push(...l),(null==(r=null==e?void 0:e.appendTraits)?void 0:r.length)&&o.push(...e.appendTraits),{id:"data",label:(null==e?void 0:e.label)??"Data",traits:o}}buildGaugeLabelModeTraits(e){const t=(null==e?void 0:e.modeName)??"labelMode",i=(null==e?void 0:e.customName)??"customLabel";return[{type:"select",name:t,label:(null==e?void 0:e.modeLabel)??"Label",options:[{value:"hidden",label:"Hidden"},{value:"entity",label:"Entity Name"},{value:"custom",label:"Custom Name"}]},{type:"text",name:i,label:(null==e?void 0:e.customLabel)??"Custom Name",visible:{prop:t,eq:"custom"}}]}extendThresholdTraitsWithAdvancedColors(e,t){const i=(null==t?void 0:t.singleColorModeLabel)??"Single Color Mode",n=(null==t?void 0:t.singleColorModeVisible)??{prop:"thresholdsApplyTo",in:["none","background"]},r=e.find(e=>"thresholdColorMode"===e.name),o=r?{...r,label:i,visible:n}:null;return[...e.filter(e=>"thresholdColorMode"!==e.name),{type:"color",name:"thresholdBaseColor",label:"Base Color"},{type:"select",name:"thresholdsApplyTo",label:"Show Step Colors On",options:[{value:"none",label:"Disabled"},{value:"bar",label:"Bar"},{value:"background",label:"Background"},{value:"both",label:"Both"}]},...o?[o]:[],{type:"checkbox",name:"showStepColorsOnBarBlend",label:"Blend Bar Colors",visible:{prop:"thresholdsApplyTo",in:["bar","both"]}},{type:"number",name:"showStepColorsOnBarBlendDistance",label:"Bar Blend Distance",min:0,max:40,step:.5,visible:{and:[{prop:"thresholdsApplyTo",in:["bar","both"]},{prop:"showStepColorsOnBarBlend",eq:!0}]}},{type:"number",name:"showStepColorsOnBackgroundOpacity",label:"Background Opacity",min:0,max:1,step:.05,visible:{prop:"thresholdsApplyTo",in:["background","both"]}},{type:"checkbox",name:"showStepColorsOnBackgroundBlend",label:"Blend Background Colors",visible:{prop:"thresholdsApplyTo",in:["background","both"]}},{type:"number",name:"showStepColorsOnBackgroundBlendDistance",label:"Background Blend Distance",min:0,max:40,step:.5,visible:{and:[{prop:"thresholdsApplyTo",in:["background","both"]},{prop:"showStepColorsOnBackgroundBlend",eq:!0}]}}].map(e=>"thresholdsEnabled"===e.name?e:{...e,visible:this.withThresholdsEnabledVisibility(e.visible)})}withThresholdsEnabledVisibility(e){const t={prop:"thresholdsEnabled",eq:!0};return e?{and:[t,e]}:t}resolveThresholdsEnabled(){return this.resolvePropertyAsBoolean("thresholdsEnabled")}getThresholds(){if(!this.resolveThresholdsEnabled())return[];return fi(this.getTraitPropertyValue("thresholds"))}resolveGaugeMetrics(){const{min:e,max:t,span:i}=this.resolveGaugeRange(),n=this.resolveGaugeRawValue(),r=null!==n,o=r?n:e,s=(o-e)/i,a=this.resolvePropertyAsBoolean("clampValue")?this.clamp(s,0,1):s,l=100*a,c=this.getThresholds();return{rawValue:o,hasValue:r,min:e,max:t,span:i,normalized:a,percent:l,thresholds:c,activeThreshold:this.resolveActiveThreshold(o,c)}}resolveGaugeValueParts(e){if(!e.hasValue)return{valueText:"—",unitText:""};const t=this.resolveProperty("displayMode","value"),i=Math.max(0,Math.min(6,this.resolvePropertyAsNumber("decimalPlaces",1)));if("percent"===t)return{valueText:this.formatNumber(e.percent,i),unitText:"%"};const n=this.resolveGaugeUnit();return{valueText:this.formatNumber(e.rawValue,i),unitText:n}}resolveGaugeUnit(){if(!this.resolvePropertyAsBoolean("showUnit"))return"";const e=this.resolveProperty("customUnit","").trim();return e||String(this.getEntityAttribute("unit_of_measurement")||"")}resolveActiveThresholdColor(e){var t;if(this.resolveThresholdsEnabled()&&"active"===this.resolveProperty("thresholdColorMode","active"))return null==(t=e.activeThreshold)?void 0:t.color}resolveValueTextColor(e){var t;if(!this.resolveThresholdsEnabled())return;if(!this.resolvePropertyAsBoolean("valueFollowThresholdColor"))return;const i=null==(t=e.activeThreshold)?void 0:t.color;if(i)return i;return this.resolveProperty("thresholdBaseColor","").trim()||void 0}resolveThresholdBaseColor(){return this.resolveThresholdsEnabled()?this.resolveProperty("thresholdBaseColor","").trim():""}resolveGlowIntensity(){return this.clamp(this.resolvePropertyAsNumber("progressGlowIntensity",6),1,40)}resolveThresholdPlacement(){if(!this.resolveThresholdsEnabled())return"none";const e=this.getTraitPropertyValue("thresholdsApplyTo"),t="string"==typeof e?e:void 0;return"bar"===t||"background"===t||"both"===t||"none"===t?t:"none"}buildThresholdColorChanges(e,t,i){const n=Math.max(1e-9,i),r=[{position:0,color:e}];for(const o of this.getThresholds()){if(!o.color)continue;const e=this.clamp((o.value-t)/n,0,1),i=r[r.length-1];Math.abs(i.position-e)<1e-6?i.color=o.color:r.push({position:e,color:o.color})}return r}buildThresholdGradientStops(e,t,i){if(0===e.length)return[{offset:0,color:"#2196f3"},{offset:1,color:"#2196f3"}];const n=[...e].sort((e,t)=>e.position-t.position);if(!t||n.length<2){const e=[];for(let t=0;t<n.length;t+=1){const i=n[t],r=this.clamp(i.position,0,1),o=t<n.length-1?this.clamp(n[t+1].position,0,1):1;e.push({offset:r,color:i.color}),e.push({offset:o,color:i.color})}return e}const r=this.clamp(i/100,0,.6),o=[];let s=n[0].color,a=0;o.push({offset:0,color:s});for(let l=1;l<n.length;l+=1){const e=this.clamp(n[l].position,0,1),t=n[l].color;if(e<=a){s=t;continue}const i=r/2,c=this.clamp(e-i,a,1),d=this.clamp(e+i,c,1);o.push({offset:c,color:s}),o.push({offset:d,color:t}),a=d,s=t}return o.push({offset:1,color:s}),o}buildLinearThresholdGradient(e,t,i,n){var r;const o=this.buildThresholdGradientStops(t,i,n),s=o.map(e=>`${e.color} ${100*this.clamp(e.offset??0,0,1)}%`);if(0===s.length)return`linear-gradient(${e}, #2196f3 0%, #2196f3 100%)`;if(1===s.length){const t=(null==(r=o[0])?void 0:r.color)??"#2196f3";return`linear-gradient(${e}, ${t} 0%, ${t} 100%)`}return`linear-gradient(${e}, ${s.join(", ")})`}resolveGaugeLabelText(e="labelMode",t="customLabel"){const i=this.resolveProperty(e,"hidden");return"hidden"===i?"":"custom"===i?this.resolveProperty(t,"").trim():this.getEntityName()}resolvePreferredPaint(e,t,i=["background","backgroundImage","backgroundColor"]){for(const n of i){if("stroke"===n){const t=e.stroke;if("string"==typeof t&&t.trim())return t.trim();continue}if("background"===n){const t=e.background;if("string"==typeof t&&t.trim())return t.trim();continue}if("backgroundImage"===n){const t=e.backgroundImage??e["background-image"];if("string"==typeof t&&t.trim())return t.trim();continue}const t=e.backgroundColor??e["background-color"];if("string"==typeof t&&t.trim())return t.trim()}return t}extractFirstLinearGradientExpression(e){const t=e.toLowerCase().indexOf("linear-gradient(");if(t<0)return null;const i=e.indexOf("(",t);if(i<0)return null;let n=0;for(let r=i;r<e.length;r+=1){const i=e[r];if("("!==i){if(")"===i&&(n-=1,0===n))return e.slice(t,r+1).trim()}else n+=1}return null}parseLinearGradientExpression(e){const t=e.match(/^linear-gradient\(([\s\S]+)\)$/i);if(!t)return null;const i=this.splitTopLevelCommaSeparated(t[1]);if(0===i.length)return null;const n=i[0].trim();let r="to right",o=i;this.isGradientDirectionToken(n)&&(r=n,o=i.slice(1));const s=[];for(const a of o){const e=this.parseGradientStopToken(a);e&&s.push(e)}return 0===s.length?null:{direction:r,stops:s}}splitTopLevelCommaSeparated(e){const t=[];let i=0,n=0;for(let o=0;o<e.length;o+=1){const r=e[o];"("!==r?")"!==r?","===r&&0===i&&(t.push(e.slice(n,o).trim()),n=o+1):i=Math.max(0,i-1):i+=1}const r=e.slice(n).trim();return r&&t.push(r),t.filter(e=>e.length>0)}isGradientDirectionToken(e){const t=e.trim().toLowerCase();return!!t&&(!!t.startsWith("to ")||/^-?\d*\.?\d+(deg|rad|turn)$/.test(t))}parseGradientStopToken(e){const t=e.trim();if(!t)return null;const i=this.findLastTopLevelWhitespace(t);if(i<0)return{color:t};const n=t.slice(0,i).trim(),r=t.slice(i+1).trim(),o=this.parseGradientOffset(r);return null!==o&&n?{color:n,offset:o}:{color:t}}findLastTopLevelWhitespace(e){let t=0;for(let i=e.length-1;i>=0;i-=1){const n=e[i];if(")"!==n)if("("!==n){if(0===t&&/\s/.test(n))return i}else t=Math.max(0,t-1);else t+=1}return-1}parseGradientOffset(e){const t=e.trim().toLowerCase();if(!t)return null;if(t.endsWith("%")){const e=parseFloat(t.slice(0,-1));return Number.isFinite(e)?this.clamp(e/100,0,1):null}const i=parseFloat(t);return Number.isFinite(i)?this.clamp(i,0,1):null}resolveGradientStopOffsets(e){if(0===e.length)return[];const t=e.map(e=>({...e}));void 0===t[0].offset&&(t[0].offset=0),void 0===t[t.length-1].offset&&(t[t.length-1].offset=1);let i=0;for(;i<t.length-1;){if(void 0===t[i].offset){i+=1;continue}let e=i+1;for(;e<t.length&&void 0===t[e].offset;)e+=1;if(e>=t.length)break;const n=t[i].offset??0,r=t[e].offset??n,o=e-i;if(o>1)for(let s=1;s<o;s+=1){const e=s/o;t[i+s].offset=n+(r-n)*e}i=e}let n=0;for(const r of t){const e=this.clamp(r.offset??n,0,1);r.offset=Math.max(n,e),n=r.offset}return t}resolveGradientVector(e,t){const i=t.minX,n=t.minY,r=t.minX+t.width,o=t.minY+t.height,s=(i+r)/2,a=(n+o)/2,l=e.trim().toLowerCase();if(l.startsWith("to ")){const e=l.includes("left"),t=l.includes("right"),c=l.includes("top"),d=l.includes("bottom");return{x1:t?i:e?r:s,y1:d?n:c?o:a,x2:t?r:e?i:s,y2:d?o:c?n:a}}const c=l.match(/^(-?\d*\.?\d+)(deg|rad|turn)$/);if(!c)return{x1:i,y1:a,x2:r,y2:a};const d=parseFloat(c[1]),u=c[2],h="deg"===u?d*Math.PI/180:"turn"===u?d*Math.PI*2:d,p=Math.sin(h),g=-Math.cos(h),m=Math.hypot(t.width,t.height)/2;return{x1:s-p*m,y1:a-g*m,x2:s+p*m,y2:a+g*m}}resolveGlowColorFromPaint(e,t){var i;const n=e.trim();if(!n)return t;const r=this.extractFirstLinearGradientExpression(n);if(r){const e=this.parseLinearGradientExpression(r);return(null==(i=(e?this.resolveGradientStopOffsets(e.stops):[])[0])?void 0:i.color)??t}return n}parseColor(e){const t=e.trim();if(t.startsWith("#")){const e=t.slice(1);if(3===e.length||4===e.length){return{r:parseInt(e[0]+e[0],16),g:parseInt(e[1]+e[1],16),b:parseInt(e[2]+e[2],16),a:4===e.length?parseInt(e[3]+e[3],16)/255:1}}if(6===e.length||8===e.length){return{r:parseInt(e.slice(0,2),16),g:parseInt(e.slice(2,4),16),b:parseInt(e.slice(4,6),16),a:8===e.length?parseInt(e.slice(6,8),16)/255:1}}return null}const i=t.match(/^rgba?\(([^)]+)\)$/i);if(!i)return null;const n=i[1].split(",").map(e=>e.trim());if(n.length<3)return null;const r=parseFloat(n[0]),o=parseFloat(n[1]),s=parseFloat(n[2]),a=n.length>=4?parseFloat(n[3]):1;return[r,o,s,a].every(e=>Number.isFinite(e))?{r:r,g:o,b:s,a:a}:null}mixColors(e,t,i){return{r:e.r+(t.r-e.r)*i,g:e.g+(t.g-e.g)*i,b:e.b+(t.b-e.b)*i,a:e.a+(t.a-e.a)*i}}rgbToString(e){return`rgba(${Math.round(this.clamp(e.r,0,255))}, ${Math.round(this.clamp(e.g,0,255))}, ${Math.round(this.clamp(e.b,0,255))}, ${this.clamp(e.a,0,1)})`}resolveUnitPosition(){return"below"===this.resolveProperty("unitPosition","inline")?"below":"inline"}resolveMarkerWidthRatio(){return this.clamp(this.resolvePropertyAsNumber("markerWidthRatio",1.2),.5,2)}resolveMarkerThicknessPx(){return Math.max(.5,this.resolvePropertyAsNumber("markerThicknessPx",2))}getAnimationDurationMs(){return this.resolvePropertyAsBoolean("animate")?Math.max(0,this.resolvePropertyAsNumber("animationDurationMs",350)):0}formatNumber(e,t){return e.toFixed(t)}clamp(e,t,i){return e<t?t:e>i?i:e}getTraitPropertyValue(e){var t,i;const n=null==(i=null==(t=this.block)?void 0:t.props)?void 0:i[e];if(!n||"object"!=typeof n)return;return n.value}resolveGaugeRawValue(){const e=this.getEntityState();if(!e)return null;if("attribute"===this.resolveProperty("valueSource","state")){const e=this.resolveProperty("valueAttribute","").trim();if(!e)return null;const t=this.getEntityAttribute(e),i=parseFloat(String(t));return Number.isFinite(i)?i:null}const t=parseFloat(e.state);return Number.isFinite(t)?t:null}resolveGaugeRange(){let e=this.resolvePropertyAsNumber("minValue",0),t=this.resolvePropertyAsNumber("maxValue",100);if(t<e){const i=e;e=t,t=i}return t===e&&(t=e+1),{min:e,max:t,span:t-e}}resolveActiveThreshold(e,t){let i;for(const n of t){if(!(e>=n.value))break;i=n}return i}}class xi extends ki{getLinearGaugePropertyGroups(){return[{id:"bar",label:"Bar",traits:[{type:"select",name:"orientation",label:"Orientation",options:[{value:"horizontal",label:"Horizontal"},{value:"vertical",label:"Vertical"}]},{type:"select",name:"horizontalFillDirection",label:"Horizontal Fill",options:[{value:"left-to-right",label:"Left to Right"},{value:"right-to-left",label:"Right to Left"}],visible:{prop:"orientation",eq:"horizontal"}},{type:"select",name:"verticalFillDirection",label:"Vertical Fill",options:[{value:"bottom-to-top",label:"Bottom to Top"},{value:"top-to-bottom",label:"Top to Bottom"}],visible:{prop:"orientation",eq:"vertical"}},{type:"slider",name:"horizontalBarHeight",label:"Horizontal Bar Height",min:8,max:250,step:1,visible:{prop:"orientation",eq:"horizontal"}},{type:"slider",name:"barCornerRadius",label:"Bar Corner Radius",min:0,max:60,step:1},{type:"checkbox",name:"showBackground",label:"Show Background"},{type:"select",name:"shellType",label:"Shell",options:[{value:"none",label:"None"},{value:"battery-1",label:"Battery 1"},{value:"tank-1",label:"Tank 1"},{value:"custom-png",label:"Custom PNG"}]},{type:"media-picker",name:"shellPngMediaReference",label:"Custom Shell PNG",emptyLabel:"No PNG selected",selectLabel:"Select PNG",editLabel:"Edit",removeLabel:"Remove",sourceProp:"shellType",sourceValue:"custom-png",visible:{prop:"shellType",eq:"custom-png"},binding:{type:"text",placeholder:"cb-media://local/card_builder/gauge-shell.png"}},{type:"action",name:"toggleShellOffsetEditor",label:"Visual Offset Editor",buttonLabel:"Toggle Visual Offset Editing",actionId:"toggle-linear-shell-offset-editor",icon:"⌖",visible:{prop:"shellType",neq:"none"}},{type:"number",name:"shellBarInsetTopPct",label:"Bar Inset Top (%)",min:0,max:95,step:.1,visible:{prop:"shellType",neq:"none"}},{type:"number",name:"shellBarInsetRightPct",label:"Bar Inset Right (%)",min:0,max:95,step:.1,visible:{prop:"shellType",neq:"none"}},{type:"number",name:"shellBarInsetBottomPct",label:"Bar Inset Bottom (%)",min:0,max:95,step:.1,visible:{prop:"shellType",neq:"none"}},{type:"number",name:"shellBarInsetLeftPct",label:"Bar Inset Left (%)",min:0,max:95,step:.1,visible:{prop:"shellType",neq:"none"}},{type:"select",name:"fillPattern",label:"Fill Pattern",options:[{value:"none",label:"None"},{value:"squares",label:"Squares"},{value:"circles",label:"Circles"},{value:"diagonal-right",label:"Diagonal Right"},{value:"diagonal-left",label:"Diagonal Left"}]},{type:"slider",name:"patternCount",label:"Pattern Rows/Columns",min:1,max:8,step:1,visible:{prop:"fillPattern",in:["squares","circles","diagonal-right","diagonal-left"]}},{type:"slider",name:"patternGapX",label:"Pattern Gap Horizontal",min:0,max:24,step:1,visible:{and:[{prop:"fillPattern",in:["squares","circles","diagonal-right","diagonal-left"]},{or:[{prop:"patternCount",neq:1},{prop:"orientation",eq:"horizontal"}]}]}},{type:"slider",name:"patternGapY",label:"Pattern Gap Vertical",min:0,max:24,step:1,visible:{and:[{prop:"fillPattern",in:["squares","circles","diagonal-right","diagonal-left"]},{or:[{prop:"patternCount",neq:1},{prop:"orientation",eq:"vertical"}]}]}},{type:"slider",name:"patternStrokeWidth",label:"Pattern Thickness",min:.6,max:8,step:.2,visible:{prop:"fillPattern",in:["diagonal-right","diagonal-left"]}},{type:"checkbox",name:"patternOnBackground",label:"Apply Pattern On Background",visible:{and:[{prop:"showBackground",eq:!0},{prop:"fillPattern",in:["squares","circles","diagonal-right","diagonal-left"]}]}},{type:"checkbox",name:"progressGlow",label:"Glow"},{type:"slider",name:"progressGlowIntensity",label:"Glow Intensity",min:1,max:40,step:.5,visible:{prop:"progressGlow",eq:!0}},{type:"select",name:"valuePositionHorizontal",label:"Value Position",options:[{value:"inside-start",label:"Inside Start"},{value:"inside-center",label:"Inside Center"},{value:"inside-end",label:"Inside End"},{value:"outside-start",label:"Outside Start"},{value:"outside-end",label:"Outside End"}],visible:{and:[{prop:"showValue",eq:!0},{prop:"orientation",eq:"horizontal"}]}},{type:"select",name:"valuePositionVertical",label:"Value Position",options:[{value:"inside-start",label:"Inside Start"},{value:"inside-center",label:"Inside Center"},{value:"inside-end",label:"Inside End"},{value:"outside-start",label:"Outside Start"},{value:"outside-end",label:"Outside End"}],visible:{and:[{prop:"showValue",eq:!0},{prop:"orientation",eq:"vertical"}]}}]}]}getLinearGaugePanelPropertyGroups(){const e=this.getLinearGaugePropertyGroups().find(e=>"bar"===e.id),t=(null==e?void 0:e.traits)??[],i=new Set(["shellType","shellPngMediaReference","toggleShellOffsetEditor","shellBarInsetTopPct","shellBarInsetRightPct","shellBarInsetBottomPct","shellBarInsetLeftPct"]),n=t.filter(e=>i.has(e.name)),r=t.find(e=>"valuePositionHorizontal"===e.name),o=t.find(e=>"valuePositionVertical"===e.name),s=[...this.buildGaugeLabelModeTraits(),{type:"select",name:"labelPositionHorizontal",label:"Label Position",options:[{value:"top-center",label:"Top Center"},{value:"top-left",label:"Top Left"},{value:"top-right",label:"Top Right"},{value:"bottom-center",label:"Bottom Center"},{value:"bottom-left",label:"Bottom Left"},{value:"bottom-right",label:"Bottom Right"}],visible:{and:[{prop:"labelMode",neq:"hidden"},{prop:"orientation",eq:"horizontal"}]}},{type:"select",name:"labelPositionVertical",label:"Label Position",options:[{value:"top",label:"Top"},{value:"bottom",label:"Bottom"}],visible:{and:[{prop:"labelMode",neq:"hidden"},{prop:"orientation",eq:"vertical"}]}}],a=this.buildMergedBaseDataGroup({insertAfterShowValueTraits:[...r?[r]:[],...o?[o]:[]]}),l=t.filter(e=>"valuePositionHorizontal"!==e.name&&"valuePositionVertical"!==e.name).filter(e=>!i.has(e.name)),c=this.getBaseGaugePropertyGroup("thresholds"),d=this.extendThresholdTraitsWithAdvancedColors((null==c?void 0:c.traits)??[]).map(e=>"thresholdsApplyTo"===e.name?{...e,options:this.resolveLinearShowBackground()?[{value:"none",label:"Disabled"},{value:"bar",label:"Bar"},{value:"background",label:"Background"},{value:"both",label:"Both"}]:[{value:"none",label:"Disabled"},{value:"bar",label:"Bar"}]}:"showStepColorsOnBackgroundOpacity"===e.name||"showStepColorsOnBackgroundBlend"===e.name||"showStepColorsOnBackgroundBlendDistance"===e.name?{...e,visible:e.visible?{and:[e.visible,{prop:"showBackground",eq:!0}]}:{prop:"showBackground",eq:!0}}:e),u=this.getBaseGaugePropertyGroup("behavior");return[a,{id:"label",label:"Label",traits:s},{id:"bar",label:(null==e?void 0:e.label)??"Bar",traits:l},{id:"thresholds",label:"Thresholds",traits:d},{id:"shell",label:"Shell",traits:n},...u?[u]:[]]}getLinearGaugeTargetStyles(){return{...this.resolveLinearShowBackground()?{track:{label:"Track",description:"Gauge track",styles:{preset:"full",exclude:{groups:["layout","flex"]}}}}:{},fill:{label:"Fill",description:"Gauge filled area",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},overlay:{label:"Overlay",description:"Top visual overlay",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},label:{label:"Label",description:"Gauge label",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},markers:{label:"Markers",description:"Threshold markers",styles:{preset:"full",exclude:{groups:["layout","flex"]}}}}}resolveLinearOrientation(){return this.resolveProperty("orientation","horizontal")}resolveLinearValuePosition(){return"vertical"===this.resolveLinearOrientation()?this.resolveProperty("valuePositionVertical","inside-center"):this.resolveProperty("valuePositionHorizontal","inside-center")}resolveLinearLabelPosition(){if("vertical"===this.resolveLinearOrientation()){return"bottom"===this.resolveProperty("labelPositionVertical","top")?"bottom":"top"}const e=this.resolveProperty("labelPositionHorizontal","top-center");return"top-center"===e||"top-left"===e||"top-right"===e||"bottom-center"===e||"bottom-left"===e||"bottom-right"===e?e:"top-center"}resolveLinearFillStyle(e){const t=this.resolveLinearOrientation(),i=this.getAnimationDurationMs(),n=i>0?`${i}ms linear`:"none",r=this.clamp(100*e,0,100),o=this.resolveLinearBarCornerRadius(),s=o>0?` round ${o}px`:"";let a=`inset(0 0 0 0${s})`;if("vertical"===t){a="top-to-bottom"===this.resolveProperty("verticalFillDirection","bottom-to-top")?`inset(0 0 ${100-r}% 0${s})`:`inset(${100-r}% 0 0 0${s})`}else{a="right-to-left"===this.resolveProperty("horizontalFillDirection","left-to-right")?`inset(0 0 0 ${100-r}%${s})`:`inset(0 ${100-r}% 0 0${s})`}return{left:"0",top:"0",width:"100%",height:"100%",clipPath:a,transition:`clip-path ${n}`}}resolveLinearMarkerStyle(e){const t=this.resolveLinearOrientation(),i=`${this.clamp(100*e,0,100)}%`;if("vertical"===t){return"top-to-bottom"===this.resolveProperty("verticalFillDirection","bottom-to-top")?{top:i}:{bottom:i}}return"right-to-left"===this.resolveProperty("horizontalFillDirection","left-to-right")?{right:i}:{left:i}}resolveHorizontalBarHeight(){return Math.max(8,this.resolvePropertyAsNumber("horizontalBarHeight",40))}resolveLinearBarCornerRadius(){return Math.max(0,this.resolvePropertyAsNumber("barCornerRadius",0))}resolveLinearShowBackground(){return this.resolvePropertyAsBoolean("showBackground")}resolveLinearGradientDirection(){if("vertical"===this.resolveLinearOrientation()){return"top-to-bottom"===this.resolveProperty("verticalFillDirection","bottom-to-top")?"to bottom":"to top"}return"right-to-left"===this.resolveProperty("horizontalFillDirection","left-to-right")?"to left":"to right"}resolveLinearFillPattern(){const e=this.resolveProperty("fillPattern","none");return"squares"===e||"circles"===e||"diagonal-right"===e||"diagonal-left"===e?e:"none"}}var wi=Object.getOwnPropertyDescriptor;const Si=[{id:"battery-1",label:"Battery #1",fileName:"battery_1.png",defaultInsets:{top:10.5,right:.9,bottom:5.5,left:2.1}},{id:"tank-1",label:"Tank #1",fileName:"tank_1.png",defaultInsets:{top:24.8,right:10.6,bottom:17.4,left:2.7}}];let _i=class extends xi{constructor(){super(...arguments),this._patternSvgId=Math.random().toString(36).slice(2,8),this._lastShellType=null,this._offsetEditorDragState=null,this.onShellOffsetEditorPointerMove=e=>{const t=this._offsetEditorDragState;if(!t||e.pointerId!==t.pointerId)return;e.preventDefault(),e.stopPropagation();const i=this.resolveShellOffsetInsets(),n=this.clamp(e.clientX-t.rect.left,0,t.rect.width),r=this.clamp(e.clientY-t.rect.top,0,t.rect.height),o=t.rect.width>0?n/t.rect.width*100:0,s=t.rect.height>0?r/t.rect.height*100:0;if("top"===t.side){const e=this.roundPattern(this.clamp(s,0,Math.min(95,99-i.bottom)));return void this.updateShellInsetProp("shellBarInsetTopPct",e)}if("bottom"===t.side){const e=100-s,t=this.roundPattern(this.clamp(e,0,Math.min(95,99-i.top)));return void this.updateShellInsetProp("shellBarInsetBottomPct",t)}if("left"===t.side){const e=this.roundPattern(this.clamp(o,0,Math.min(95,99-i.right)));return void this.updateShellInsetProp("shellBarInsetLeftPct",e)}const a=100-o,l=this.roundPattern(this.clamp(a,0,Math.min(95,99-i.left)));this.updateShellInsetProp("shellBarInsetRightPct",l)},this.onShellOffsetEditorPointerUp=e=>{const t=this._offsetEditorDragState;t&&e.pointerId===t.pointerId&&(e.preventDefault(),e.stopPropagation(),this.stopShellOffsetEditingDrag())},this.onBuilderSelectionChanged=e=>{var t;if(!(null==(t=this.environment)?void 0:t.isBuilder)||!this.block)return;const i=e.detail;(null==i?void 0:i.selectedId)===this.block.id||this.resolvePropertyAsBoolean("shellVisualOffsetEditing")&&(this.stopShellOffsetEditingDrag(),this.setShellVisualOffsetEditing(!1))}}static getBlockConfig(){return{sinceVersion:"2.4.0",definition:{label:"Gauge Linear",icon:'<ha-icon icon="mdi:drag-horizontal-variant"></ha-icon>',category:"gauges"},defaults:{requireEntity:!0,props:{valueSource:{value:"state"},valueAttribute:{value:""},minValue:{value:0},maxValue:{value:100},clampValue:{value:!0},showValue:{value:!0},displayMode:{value:"value"},decimalPlaces:{value:1},showUnit:{value:!0},customUnit:{value:""},unitPosition:{value:"inline"},thresholds:{value:[]},thresholdsEnabled:{value:!1},showThresholdMarkers:{value:!1},markerWidthRatio:{value:1.2},markerThicknessPx:{value:2},thresholdColorMode:{value:"active"},thresholdBaseColor:{value:""},thresholdsApplyTo:{value:"none"},showStepColorsOnBarBlend:{value:!1},showStepColorsOnBarBlendDistance:{value:4},showStepColorsOnBackgroundOpacity:{value:.28},showStepColorsOnBackgroundBlend:{value:!1},showStepColorsOnBackgroundBlendDistance:{value:4},animate:{value:!0},animationDurationMs:{value:350},valueFollowThresholdColor:{value:!1},orientation:{value:"horizontal"},horizontalFillDirection:{value:"left-to-right"},verticalFillDirection:{value:"bottom-to-top"},horizontalBarHeight:{value:40},barCornerRadius:{value:0},showBackground:{value:!0},shellType:{value:"none"},shellPngMediaReference:{value:""},shellBarInsetTopPct:{value:0},shellBarInsetRightPct:{value:0},shellBarInsetBottomPct:{value:0},shellBarInsetLeftPct:{value:0},shellVisualOffsetEditing:{value:!1},fillPattern:{value:"none"},patternCount:{value:1},patternGapX:{value:2},patternGapY:{value:2},patternStrokeWidth:{value:1.6},patternOnBackground:{value:!1},progressGlow:{value:!1},progressGlowIntensity:{value:6},valuePositionHorizontal:{value:"inside-center"},valuePositionVertical:{value:"inside-center"},labelMode:{value:"hidden"},customLabel:{value:""},labelPositionHorizontal:{value:"top-center"},labelPositionVertical:{value:"top"}}},entityDefaults:{mode:"inherited"},actionTargets:{value:{label:"Value",description:"Gauge value label"},fill:{label:"Fill",description:"Gauge fill area"},label:{label:"Label",description:"Gauge label"}}}}getPanelConfig(){return{properties:{groups:this.getLinearGaugePanelPropertyGroups()},targetStyles:{...this.getBaseGaugeTargetStyles(),...this.getLinearGaugeTargetStyles()}}}connectedCallback(){var e;super.connectedCallback(),(null==(e=this.environment)?void 0:e.isBuilder)&&this.documentModel.addEventListener("selection-changed",this.onBuilderSelectionChanged)}disconnectedCallback(){var e;(null==(e=this.environment)?void 0:e.isBuilder)&&this.documentModel.removeEventListener("selection-changed",this.onBuilderSelectionChanged),this.stopShellOffsetEditingDrag(),super.disconnectedCallback()}updated(e){var t;if(super.updated(e),this.syncShellInsetsFromDefaultsOnTypeChange(),(null==(t=this.environment)?void 0:t.isBuilder)&&!this.selected&&this.resolvePropertyAsBoolean("shellVisualOffsetEditing"))return this.stopShellOffsetEditingDrag(),void this.setShellVisualOffsetEditing(!1);this.shouldShowShellOffsetEditor()||this.stopShellOffsetEditingDrag()}syncShellInsetsFromDefaultsOnTypeChange(){var e;if(!this.block)return;const t=this.resolveProperty("shellType","none");if(null===this._lastShellType)return void(this._lastShellType=t);if(t===this._lastShellType)return;if(this._lastShellType=t,"none"===t||"custom-png"===t)return;const i=this.getDefaultShell(t).defaultInsets,n=[["shellBarInsetTopPct",i.top],["shellBarInsetRightPct",i.right],["shellBarInsetBottomPct",i.bottom],["shellBarInsetLeftPct",i.left]],r={};let o=!1;for(const[s,a]of n){const t=null==(e=this.block.props)?void 0:e[s],i=this.resolvePropertyAsNumber(s,0);Math.abs(i-a)<1e-4||(o=!0,r[s]="object"==typeof t&&null!==t&&"value"in t?{value:a,binding:t.binding}:{value:a})}o&&this.documentModel.updateBlock(this.block.id,{props:r})}render(){if(!this.entity)return h`<div class="no-entity">No entity selected</div>`;const e=this.resolveGaugeMetrics(),t=this.resolveLinearOrientation(),i=this.resolveLinearValuePosition(),n=this.resolvePropertyAsBoolean("showValue"),r=this.resolvePropertyAsBoolean("showThresholdMarkers"),o=this.resolvePropertyAsBoolean("progressGlow"),s=this.resolveGlowIntensity(),a=this.resolveGaugeLabelText(),l=this.resolveLinearLabelPosition(),c=this.resolveLinearBarCornerRadius(),p=this.resolveLinearShowBackground(),g=this.resolveShellTransformMode(t),v=this.resolveProperty("shellType","none"),y="none"!==v&&"custom-png"!==v?this.getDefaultShell(v):null,b=y?this.resolveDefaultShellUrl(y.fileName):null,f=this.resolveProperty("shellPngMediaReference","").trim(),k="custom-png"===v?this.resolveShellMediaUrl(f):null,x=b||k,w=!!x,S=this.shouldShowShellOffsetEditor()&&w,_=this.resolveShellOffsetInsets(),T=this.resolveLinearFillPattern(),A="none"!==T,I=A&&p&&this.resolvePropertyAsBoolean("patternOnBackground"),C=this.resolveThresholdPlacement(),P=this.resolveThresholdsEnabled(),M="bar"===C||"both"===C,$=p&&("background"===C||"both"===C),L=this.resolveGaugeValueParts(e),B=this.resolveActiveThresholdColor(e),E=this.resolveThresholdBaseColor(),D={...this.getTargetStyle("track")};if("horizontal"===t){const e=this.resolveHorizontalBarHeight();D.height=`${e}px`,D.minHeight||(D.minHeight=`${e}px`)}(o||w)&&(D.overflow="visible"),D.borderRadius=`${c}px`;const R=w?this.resolvePngShellBarLayoutStyle(g,null==y?void 0:y.defaultInsets):{},O={},N={...R,...O},z={...this.resolveLinearFillStyle(e.normalized),...this.getTargetStyle("fill")};P&&(delete z.background,delete z.backgroundImage,delete z["background-image"]),z.borderRadius=`${c}px`;const V=this.getTargetStyle("fill");if(!M){const e=B||E;!e||V.backgroundColor||V.background||V.backgroundImage||V["background-image"]||(z.backgroundColor=e)}const F=this.resolveLinearGradientDirection(),W=String(z.backgroundColor||"#2196f3"),j=this.resolvePreferredPaint(z,W,["background","backgroundImage","backgroundColor"]),G=this.resolveSvgCompatiblePaint(j,W),U=String(D.backgroundColor||"rgba(0, 0, 0, 0.16)"),H=this.resolvePreferredPaint(D,U,["background","backgroundImage","backgroundColor"]),q=E||W,X=this.buildThresholdColorChanges(q,e.min,e.span),Y=this.resolvePropertyAsBoolean("showStepColorsOnBarBlend"),K=this.resolvePropertyAsNumber("showStepColorsOnBarBlendDistance",4);M&&(z.background=this.buildLinearThresholdGradient(F,X,Y,K),delete z.backgroundColor);const Q=M?String(z.background||W):j,Z=o&&w,J={};let ee=U,te=1;const ie=E||U;let ne=this.buildThresholdColorChanges(ie,e.min,e.span),re=!1,oe=4;$?(re=this.resolvePropertyAsBoolean("showStepColorsOnBackgroundBlend"),oe=this.resolvePropertyAsNumber("showStepColorsOnBackgroundBlendDistance",4),te=this.clamp(this.resolvePropertyAsNumber("showStepColorsOnBackgroundOpacity",.28),0,1),ne=this.buildThresholdColorChanges(ie,e.min,e.span),ee=this.buildLinearThresholdGradient(F,ne,re,oe),J.background=ee,J.opacity=String(te)):p&&w&&(J.background=H,J.opacity="1"),w||A?(D.background="transparent",D.backgroundColor="transparent"):p||(D.background="transparent",D.backgroundColor="transparent");const se={...this.getTargetStyle("value")},ae=this.resolveValueTextColor(e);ae&&(se.color=ae);const le=this.getTargetStyle("unit"),ce="outside-start"===i,de="outside-end"===i,ue=i.startsWith("inside"),he="horizontal"===t&&(ce||de),pe=this.resolveUnitPosition(),ge=this.resolveLinearValuePlaceholder(e),me=n?h`
            <span
                class=${m({value:!0,"unit-below":"below"===pe,inside:ue,[t]:!0,[i]:!0,"style-target-active":this.isStyleTargetActive("value")})}
                style=${u(se)}
                data-style-target="value"
                data-action-target="value"
            >
                <span class="value-number">
                    ${he?h`
                        <span class="value-number-layer value-placeholder" aria-hidden="true">${ge}</span>
                    `:d}
                    <span class="value-number-layer">${L.valueText}</span>
                </span>
                ${L.unitText?h`
                    <span
                        class="${this.isStyleTargetActive("unit")?"style-target-active":""}"
                        style=${u(le)}
                        data-style-target="unit"
                        data-action-target="unit"
                    >${L.unitText}</span>
                `:d}
            </span>
        `:d,ve=a?h`
            <span
                class=${m({label:!0,[t]:!0,[l]:!0,"style-target-active":this.isStyleTargetActive("label")})}
                style=${u(this.getTargetStyle("label"))}
                data-style-target="label"
                data-action-target="label"
            >${a}</span>
        `:d,ye="horizontal"===t&&a?{vertical:String(l).startsWith("top")?"top":"bottom",align:String(l).endsWith("-left")?"left":String(l).endsWith("-right")?"right":"center"}:null,be="top"===(null==ye?void 0:ye.vertical)?h`
            <div class=${m({"label-row":!0,top:!0,"align-left":"left"===ye.align,"align-center":"center"===ye.align,"align-right":"right"===ye.align})}>
                ${ve}
            </div>
        `:d,fe="bottom"===(null==ye?void 0:ye.vertical)?h`
            <div class=${m({"label-row":!0,bottom:!0,"align-left":"left"===ye.align,"align-center":"center"===ye.align,"align-right":"right"===ye.align})}>
                ${ve}
            </div>
        `:d,ke=A?this.renderPatternFillSvg({pattern:T,orientation:t,normalized:e.normalized,gradientDirection:F,showBackground:p,colorChanges:X,barThresholdsActive:M,barBlendEnabled:Y,barBlendDistance:K,defaultFillPaint:G,glowEnabled:o&&!Z,glowIntensity:s,barCornerRadius:c,fillTargetStyle:V,patternOnBackground:I,backgroundPaint:ee,backgroundOpacity:te,backgroundThresholdsActive:$,backgroundColorChanges:ne,backgroundBlendEnabled:re,backgroundBlendDistance:oe}):h`
                ${o&&!Z?h`
                    <div
                        class="fill-glow"
                        style=${u(this.resolveLinearGlowContainerStyle(s))}
                    >
                        <div
                            class="fill-glow-source"
                            style=${u(this.resolveLinearGlowSourceStyle(e.normalized,Q))}
                        ></div>
                    </div>
                `:d}
                <div
                    class="fill ${this.isStyleTargetActive("fill")?"style-target-active":""}"
                    style=${u(z)}
                    data-style-target="fill"
                    data-action-target="fill"
                ></div>
            `,xe=Z?h`
            <div
                class="fill-glow"
                style=${u({...this.resolveLinearGlowContainerStyle(s),...R,borderRadius:`${c}px`})}
            >
                <div
                    class="fill-glow-source"
                    style=${u({...this.resolveLinearGlowSourceStyle(e.normalized,Q),borderRadius:`${c}px`})}
                ></div>
            </div>
        `:d,we=w?h`
            <div class="shell-layer" data-cb-gauge-shell-orientation=${t}>
                <svg
                    class="shell-image-svg"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    focusable="false"
                    aria-hidden="true"
                >
                    <image
                        href=${x}
                        x="0"
                        y="0"
                        width="100"
                        height="100"
                        preserveAspectRatio="none"
                        transform=${this.resolvePngShellImageTransform(g)}
                    ></image>
                </svg>
            </div>
        `:d,Se={...this.getTargetStyle("overlay"),...R,...O,left:R.left??"0%",top:R.top??"0%",width:R.width??"100%",height:R.height??"100%",pointerEvents:"none",background:this.getTargetStyle("overlay").background??"transparent"},_e=h`
            <div
                class="fx-overlay ${this.isStyleTargetActive("overlay")?"style-target-active":""}"
                style=${u(Se)}
                data-style-target="overlay"
            ></div>
        `,Te=S?this.renderShellOffsetEditor(_):d,Ae=h`
            <div
                class="track ${this.isStyleTargetActive("track")?"style-target-active":""}"
                style=${u(D)}
                data-style-target="track"
            >
                <div class="bar-content" style=${u(N)}>
                    ${p&&!A&&($||w)?h`
                        <div class="track-thresholds" style=${u(J)}></div>
                    `:d}
                    ${ke}
                    ${r?this.renderThresholdMarkers(e.min,e.span):d}
                </div>
                ${xe}
                ${ue?me:d}
                ${we}
                ${_e}
                ${"vertical"===t?ve:d}
                ${Te}
            </div>
        `;return"horizontal"===t?h`
                <div class=${m({"linear-root":!0,[t]:!0})}>
                    ${be}
                    <div class="bar-row">
                        ${ce?me:d}
                        ${Ae}
                        ${de?me:d}
                    </div>
                    ${fe}
                </div>
            `:h`
            <div class=${m({"linear-root":!0,[t]:!0})}>
                ${ce?me:d}
                ${Ae}
                ${de?me:d}
            </div>
        `}resolveShellMediaUrl(e){return yt(e)?St(e):bt(e)||e.startsWith("/")?e:e||null}getDefaultShell(e){const t=Si.find(t=>t.id===e);if(!t)throw new Error(`unknown shell type "${e}"`);return t}resolveDefaultShellUrl(e){return`/card_builder/assets/common/blocks/components/gauges/block-gauge-linear/shells/${e}`}resolveShellTransformMode(e){if("vertical"===e){return"top-to-bottom"===this.resolveProperty("verticalFillDirection","bottom-to-top")?"rotate-right":"rotate-left"}return"right-to-left"===this.resolveProperty("horizontalFillDirection","left-to-right")?"flip-horizontal":"none"}resolvePngShellBarLayoutStyle(e,t){const i=this.clamp(this.resolvePropertyAsNumber("shellBarInsetTopPct",(null==t?void 0:t.top)??0),0,95),n=this.clamp(this.resolvePropertyAsNumber("shellBarInsetRightPct",(null==t?void 0:t.right)??0),0,95),r=this.clamp(this.resolvePropertyAsNumber("shellBarInsetBottomPct",(null==t?void 0:t.bottom)??0),0,95),o=this.clamp(this.resolvePropertyAsNumber("shellBarInsetLeftPct",(null==t?void 0:t.left)??0),0,95),s=Math.max(1,100-o-n),a=Math.max(1,100-i-r);return{left:`${this.roundPattern(o)}%`,top:`${this.roundPattern(i)}%`,width:`${this.roundPattern(s)}%`,height:`${this.roundPattern(a)}%`}}resolvePngShellImageTransform(e){return"flip-horizontal"===e?"matrix(-1 0 0 1 100 0)":"rotate-left"===e?"matrix(0 -1 1 0 0 100)":"rotate-right"===e?"matrix(0 1 -1 0 100 0)":"matrix(1 0 0 1 0 0)"}shouldShowShellOffsetEditor(){var e;return!!(null==(e=this.environment)?void 0:e.isBuilder)&&"none"!==this.resolveProperty("shellType","none")&&this.resolvePropertyAsBoolean("shellVisualOffsetEditing")}resolveShellOffsetInsets(){return{top:this.clamp(this.resolvePropertyAsNumber("shellBarInsetTopPct",0),0,95),right:this.clamp(this.resolvePropertyAsNumber("shellBarInsetRightPct",0),0,95),bottom:this.clamp(this.resolvePropertyAsNumber("shellBarInsetBottomPct",0),0,95),left:this.clamp(this.resolvePropertyAsNumber("shellBarInsetLeftPct",0),0,95)}}renderShellOffsetEditor(e){const t=Math.max(1,100-e.left-e.right),i=Math.max(1,100-e.top-e.bottom),n=e=>`${this.roundPattern(e)}%`;return h`
            <div class="shell-offset-editor">
                <div class="shell-offset-overlay"></div>
                <div
                    class="shell-offset-inner"
                    style=${u({top:`${e.top}%`,right:`${e.right}%`,bottom:`${e.bottom}%`,left:`${e.left}%`,width:`${t}%`,height:`${i}%`})}
                ></div>

                <div
                    class="shell-offset-line top"
                    style=${u({top:`${e.top}%`})}
                    @pointerdown=${e=>this.startShellOffsetEditingDrag(e,"top")}
                >
                    <span class="shell-offset-badge top">${n(e.top)}</span>
                </div>

                <div
                    class="shell-offset-line right"
                    style=${u({right:`${e.right}%`})}
                    @pointerdown=${e=>this.startShellOffsetEditingDrag(e,"right")}
                >
                    <span class="shell-offset-badge right">${n(e.right)}</span>
                </div>

                <div
                    class="shell-offset-line bottom"
                    style=${u({bottom:`${e.bottom}%`})}
                    @pointerdown=${e=>this.startShellOffsetEditingDrag(e,"bottom")}
                >
                    <span class="shell-offset-badge bottom">${n(e.bottom)}</span>
                </div>

                <div
                    class="shell-offset-line left"
                    style=${u({left:`${e.left}%`})}
                    @pointerdown=${e=>this.startShellOffsetEditingDrag(e,"left")}
                >
                    <span class="shell-offset-badge left">${n(e.left)}</span>
                </div>
            </div>
        `}startShellOffsetEditingDrag(e,t){var i,n;if(!this.block)return;if(!this.shouldShowShellOffsetEditor())return;if("mouse"===e.pointerType&&0!==e.button)return;const r=e.currentTarget,o=null==(i=this.renderRoot)?void 0:i.querySelector(".track");r&&o&&(e.preventDefault(),e.stopPropagation(),null==(n=r.setPointerCapture)||n.call(r,e.pointerId),this._offsetEditorDragState={pointerId:e.pointerId,side:t,rect:o.getBoundingClientRect()},window.addEventListener("pointermove",this.onShellOffsetEditorPointerMove),window.addEventListener("pointerup",this.onShellOffsetEditorPointerUp),window.addEventListener("pointercancel",this.onShellOffsetEditorPointerUp))}stopShellOffsetEditingDrag(){this._offsetEditorDragState=null,window.removeEventListener("pointermove",this.onShellOffsetEditorPointerMove),window.removeEventListener("pointerup",this.onShellOffsetEditorPointerUp),window.removeEventListener("pointercancel",this.onShellOffsetEditorPointerUp)}updateShellInsetProp(e,t){var i;if(!this.block)return;const n=null==(i=this.block.props)?void 0:i[e];if("object"==typeof n&&null!==n&&"value"in n){const i=Number(n.value??0);if(Number.isFinite(i)&&Math.abs(i-t)<1e-4)return;const r={value:t,binding:n.binding};return void this.documentModel.updateBlock(this.block.id,{props:{[e]:r}})}const r=this.resolvePropertyAsNumber(e,0);Math.abs(r-t)<1e-4||this.documentModel.updateBlock(this.block.id,{props:{[e]:{value:t}}})}setShellVisualOffsetEditing(e){var t;if(!this.block)return;const i=null==(t=this.block.props)?void 0:t.shellVisualOffsetEditing;if("object"==typeof i&&null!==i&&"value"in i){if(Boolean(i.value)===e)return;const t={value:e,binding:i.binding};return void this.documentModel.updateBlock(this.block.id,{props:{shellVisualOffsetEditing:t}})}this.resolvePropertyAsBoolean("shellVisualOffsetEditing")!==e&&this.documentModel.updateBlock(this.block.id,{props:{shellVisualOffsetEditing:{value:e}}})}renderPatternFillSvg(e){var t;const i=this.getAnimationDurationMs(),n=i>0?`${i}ms linear`:"none",r=this.clamp(e.normalized,0,1),o=this.resolvePatternSvgViewport(e.orientation),s=this.resolvePatternTileGeometry(e.orientation,o),a=this.resolvePatternRenderMeta(e.pattern,s),l=this.resolvePatternClipRect(r,e.orientation,o),{x1:c,y1:p,x2:g,y2:m}=this.resolveSvgGradientVector(e.gradientDirection,o),y=`${(null==(t=this.block)?void 0:t.id)?this.block.id.replace(/[^a-zA-Z0-9_-]/g,"-"):"block"}-${this._patternSvgId}`,b=`vb-pat-${y}`,f=`vb-mask-${y}`,k=`vb-clip-${y}`,x=`vb-grad-${y}`,w=`vb-bg-grad-${y}`,S=`vb-glow-${y}`,_=e.barThresholdsActive?this.buildLinearThresholdGradientStops(e.colorChanges,e.barBlendEnabled,e.barBlendDistance):[],T=e.backgroundThresholdsActive?this.buildLinearThresholdGradientStops(e.backgroundColorChanges,e.backgroundBlendEnabled,e.backgroundBlendDistance):[],A=_.length>0?`url(#${x})`:e.defaultFillPaint,I=T.length>0?`url(#${w})`:e.backgroundPaint,C={position:"absolute",inset:"0",width:"100%",height:"100%",overflow:e.glowEnabled?"visible":"hidden",pointerEvents:"none",borderRadius:`${this.roundPattern(e.barCornerRadius)}px`},P=new Set(["left","top","right","bottom","width","height","clipPath","transition","background","backgroundColor","filter"]);for(const[d,u]of Object.entries(e.fillTargetStyle))P.has(d)||(C[d]=u);return h`
            <svg
                class="${this.isStyleTargetActive("fill")?"style-target-active":""}"
                style=${u(C)}
                data-style-target="fill"
                data-action-target="fill"
                viewBox="0 0 ${this.roundPattern(o.width)} ${this.roundPattern(o.height)}"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>
                    <pattern
                        id=${b}
                        x="0"
                        y="0"
                        width=${String(this.roundPattern(a.tileW))}
                        height=${String(this.roundPattern(a.tileH))}
                        patternUnits="userSpaceOnUse"
                        patternTransform=${a.transform??d}
                    >
                        <rect
                            x="0"
                            y="0"
                            width=${String(this.roundPattern(a.tileW))}
                            height=${String(this.roundPattern(a.tileH))}
                            fill="black"
                        ></rect>
                        ${this.renderPatternShape(e.pattern,s,a)}
                    </pattern>

                    <mask
                        id=${f}
                        maskUnits="userSpaceOnUse"
                        maskContentUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width=${String(this.roundPattern(o.width))}
                        height=${String(this.roundPattern(o.height))}
                    >
                        <rect
                            x="0"
                            y="0"
                            width=${String(this.roundPattern(o.width))}
                            height=${String(this.roundPattern(o.height))}
                            fill=${`url(#${b})`}
                        ></rect>
                    </mask>

                    <clipPath id=${k} clipPathUnits="userSpaceOnUse">
                        <rect
                            x=${String(this.roundPattern(l.x))}
                            y=${String(this.roundPattern(l.y))}
                            width=${String(this.roundPattern(l.width))}
                            height=${String(this.roundPattern(l.height))}
                            rx=${String(this.roundPattern(e.barCornerRadius))}
                            ry=${String(this.roundPattern(e.barCornerRadius))}
                            style=${u({x:`${this.roundPattern(l.x)}px`,y:`${this.roundPattern(l.y)}px`,width:`${this.roundPattern(l.width)}px`,height:`${this.roundPattern(l.height)}px`,transition:[`x ${n}`,`y ${n}`,`width ${n}`,`height ${n}`].join(", ")})}
                        ></rect>
                    </clipPath>

                    ${_.length>0?v`
                        <linearGradient
                            id=${x}
                            gradientUnits="userSpaceOnUse"
                            x1=${String(c)}
                            y1=${String(p)}
                            x2=${String(g)}
                            y2=${String(m)}
                        >
                            ${_.map(e=>v`
                                <stop offset="${this.roundPattern(e.offset)}%" stop-color=${e.color}></stop>
                            `)}
                        </linearGradient>
                    `:d}
                    ${T.length>0?v`
                        <linearGradient
                            id=${w}
                            gradientUnits="userSpaceOnUse"
                            x1=${String(c)}
                            y1=${String(p)}
                            x2=${String(g)}
                            y2=${String(m)}
                        >
                            ${T.map(e=>v`
                                <stop offset="${this.roundPattern(e.offset)}%" stop-color=${e.color}></stop>
                            `)}
                        </linearGradient>
                    `:d}

                    ${e.glowEnabled?v`
                        <filter id=${S} x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
                            <feGaussianBlur
                                in="SourceGraphic"
                                stdDeviation=${String(this.roundPattern(Math.max(.2,e.glowIntensity/2)))}
                                result="blur"
                            ></feGaussianBlur>
                            <feComposite in="blur" in2="SourceAlpha" operator="out" result="outerGlow"></feComposite>
                            <feMerge>
                                <feMergeNode in="outerGlow"></feMergeNode>
                            </feMerge>
                        </filter>
                    `:d}
                </defs>

                ${e.showBackground?v`
                    <rect
                        x="0"
                        y="0"
                        width=${String(this.roundPattern(o.width))}
                        height=${String(this.roundPattern(o.height))}
                        rx=${String(this.roundPattern(e.barCornerRadius))}
                        ry=${String(this.roundPattern(e.barCornerRadius))}
                        fill=${I}
                        opacity=${String(this.roundPattern(e.backgroundOpacity))}
                        mask=${e.patternOnBackground?`url(#${f})`:d}
                    ></rect>
                `:d}

                ${e.glowEnabled?v`
                    <rect
                        x=${String(this.roundPattern(l.x))}
                        y=${String(this.roundPattern(l.y))}
                        width=${String(this.roundPattern(l.width))}
                        height=${String(this.roundPattern(l.height))}
                        rx=${String(this.roundPattern(e.barCornerRadius))}
                        ry=${String(this.roundPattern(e.barCornerRadius))}
                        fill=${A}
                        filter=${`url(#${S})`}
                        opacity="0.92"
                        style=${u({x:`${this.roundPattern(l.x)}px`,y:`${this.roundPattern(l.y)}px`,width:`${this.roundPattern(l.width)}px`,height:`${this.roundPattern(l.height)}px`,transition:[`x ${n}`,`y ${n}`,`width ${n}`,`height ${n}`,`fill ${n}`].join(", ")})}
                    ></rect>
                `:d}
                <rect
                    x="0"
                    y="0"
                    width=${String(this.roundPattern(o.width))}
                    height=${String(this.roundPattern(o.height))}
                    rx=${String(this.roundPattern(e.barCornerRadius))}
                    ry=${String(this.roundPattern(e.barCornerRadius))}
                    fill=${A}
                    clip-path=${`url(#${k})`}
                    mask=${`url(#${f})`}
                    style=${u({transition:`fill ${n}`})}
                ></rect>
            </svg>
        `}resolveLinearGlowContainerStyle(e){return{left:"0",top:"0",width:"100%",height:"100%",filter:`blur(${e}px)`,opacity:"0.92"}}resolveLinearGlowSourceStyle(e,t){const i={...this.resolveLinearFillStyle(e)};return t.includes("gradient(")?i.background=t:i.backgroundColor=t,i}resolveSvgCompatiblePaint(e,t){return e.trim().toLowerCase().includes("gradient(")?t:e}resolvePatternSvgViewport(e){var t,i;const n=null==(t=this.renderRoot)?void 0:t.querySelector(".bar-content"),r=null==(i=this.renderRoot)?void 0:i.querySelector(".track"),o=null==n?void 0:n.getBoundingClientRect(),s=null==r?void 0:r.getBoundingClientRect(),a=this.getBoundingClientRect();if("horizontal"===e){const e=Math.max(1,(null==o?void 0:o.height)??(null==s?void 0:s.height)??this.resolveHorizontalBarHeight());return{width:Math.max(1,(null==o?void 0:o.width)??0,(null==s?void 0:s.width)??0,a.width>0?a.width:160),height:e}}return{width:Math.max(1,(null==o?void 0:o.width)??0,(null==s?void 0:s.width)??0,a.width>0?a.width:40),height:Math.max(1,(null==o?void 0:o.height)??0,(null==s?void 0:s.height)??0,a.height>0?a.height:140)}}resolvePatternTileGeometry(e,t){const i=this.clamp(Math.round(this.resolvePropertyAsNumber("patternCount",1)),1,8),n=this.clamp(this.resolvePropertyAsNumber("patternGapX",2),0,24),r=this.clamp(this.resolvePropertyAsNumber("patternGapY",2),0,24),o=i>1?"horizontal"===e?r:n:0,s="horizontal"===e?n:r,a="horizontal"===e?t.height:t.width,l=Math.max(1,(a-(i-1)*o)/i),c=Math.max(1,l+s),d=Math.max(1,l+o);return{tileW:"horizontal"===e?c:d,tileH:"horizontal"===e?d:c,shapeX:0,shapeY:0,shapeW:l,shapeH:l,patternThickness:Math.max(.5,this.resolvePropertyAsNumber("patternStrokeWidth",1.6))}}resolvePatternClipRect(e,t,i){if("vertical"===t){return"top-to-bottom"===this.resolveProperty("verticalFillDirection","bottom-to-top")?{x:0,y:0,width:i.width,height:e*i.height}:{x:0,y:(1-e)*i.height,width:i.width,height:e*i.height}}return"right-to-left"===this.resolveProperty("horizontalFillDirection","left-to-right")?{x:(1-e)*i.width,y:0,width:e*i.width,height:i.height}:{x:0,y:0,width:e*i.width,height:i.height}}resolveSvgGradientVector(e,t){return this.resolveGradientVector(e,{minX:0,minY:0,width:t.width,height:t.height})}buildLinearThresholdGradientStops(e,t,i){return this.buildThresholdGradientStops(e,t,i).map(e=>({offset:this.clamp(100*(e.offset??0),0,100),color:e.color}))}resolvePatternRenderMeta(e,t){if("diagonal-right"===e||"diagonal-left"===e){const i=Math.max(1,Math.max(t.tileW,t.tileH));return{tileW:i,tileH:i,transform:"diagonal-right"===e?"rotate(45)":"rotate(-45)"}}return{tileW:t.tileW,tileH:t.tileH}}renderPatternShape(e,t,i){const n=e=>this.roundPattern(e),r=t.shapeX,o=t.shapeY,s=t.shapeX+t.shapeW,a=t.shapeY+t.shapeH,l=t.shapeX+t.shapeW/2,c=t.shapeY+t.shapeH/2,d=Math.max(.5,t.patternThickness);if("squares"===e)return v`
                <rect
                    x=${String(n(t.shapeX))}
                    y=${String(n(t.shapeY))}
                    width=${String(n(t.shapeW))}
                    height=${String(n(t.shapeH))}
                    fill="white"
                ></rect>
            `;if("circles"===e)return v`
                <circle
                    cx=${String(n(l))}
                    cy=${String(n(c))}
                    r=${String(n(Math.min(t.shapeW,t.shapeH)/2))}
                    fill="white"
                ></circle>
            `;if("diagonal-right"===e||"diagonal-left"===e){const e=.25*i.tileH,t=.75*i.tileH;return v`
                <line
                    x1="0"
                    y1=${String(n(e))}
                    x2=${String(n(i.tileW))}
                    y2=${String(n(e))}
                    stroke="white"
                    stroke-width=${String(n(d))}
                    stroke-linecap="butt"
                ></line>
                <line
                    x1="0"
                    y1=${String(n(t))}
                    x2=${String(n(i.tileW))}
                    y2=${String(n(t))}
                    stroke="white"
                    stroke-width=${String(n(d))}
                    stroke-linecap="butt"
                ></line>
            `}return v`
            <line
                x1=${String(n(r))}
                y1=${String(n(o))}
                x2=${String(n(s))}
                y2=${String(n(a))}
                stroke="white"
                stroke-width=${String(n(d))}
                stroke-linecap="butt"
            ></line>
        `}roundPattern(e){return Math.round(1e3*e)/1e3}renderThresholdMarkers(e,t){const i=this.getTargetStyle("markers"),n=this.isStyleTargetActive("markers"),r=this.resolveLinearOrientation(),o=this.resolveMarkerWidthRatio(),s=this.resolveMarkerThicknessPx(),a="vertical"===r?{width:100*o+"%",left:100*(1-o)/2+"%",height:`${s}px`}:{height:100*o+"%",top:100*(1-o)/2+"%",width:`${s}px`};return this.getThresholds().map(o=>{const s=this.clamp((o.value-e)/t,0,1),l={...i,...this.resolveLinearMarkerStyle(s),...a};return o.color&&!l.backgroundColor&&(l.backgroundColor=o.color),o.color&&"vertical"===r&&!l.borderColor&&(l.borderColor=o.color),h`
                <div
                    class="marker ${n?"style-target-active":""}"
                    style=${u(l)}
                    data-style-target="markers"
                ></div>
            `})}resolveLinearValuePlaceholder(e){const t=this.resolveProperty("displayMode","value"),i=Math.max(0,Math.min(6,this.resolvePropertyAsNumber("decimalPlaces",1)));if("percent"===t)return this.formatNumber(100,i);const n=this.formatNumber(e.min,i),r=this.formatNumber(e.max,i);return n.length>=r.length?n:r}};_i.styles=[...xi.styles,l`
            :host {
                display: block;
                min-width: 60px;
                min-height: 18px;
            }

            .linear-root {
                display: flex;
                width: 100%;
                height: 100%;
                align-items: center;
                gap: 8px;
            }

            .linear-root.horizontal {
                flex-direction: column;
                align-items: stretch;
                gap: 4px;
            }

            .bar-row {
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
                min-width: 0;
            }

            .linear-root.vertical {
                flex-direction: column;
                justify-content: center;
                min-height: 100px;
            }

            .track {
                position: relative;
                flex: 1 1 auto;
                width: 100%;
                height: 100%;
                min-height: 8px;
                min-width: 8px;
                overflow: hidden;
                border-radius: inherit;
                background: rgba(0, 0, 0, 0.16);
            }

            .linear-root.vertical .track {
                width: 100%;
                height: 100%;
                min-height: 40px;
                flex: 1 1 auto;
            }

            .fill {
                position: absolute;
                inset: 0;
                border-radius: inherit;
                background: var(--accent-color, #2196f3);
            }

            .fill-glow {
                position: absolute;
                inset: 0;
                pointer-events: none;
                border-radius: inherit;
                overflow: visible;
            }

            .fill-glow-source {
                position: absolute;
                inset: 0;
                border-radius: inherit;
            }

            .track-thresholds {
                position: absolute;
                inset: 0;
                border-radius: inherit;
                pointer-events: none;
            }

            .bar-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: inherit;
            }

            .value {
                display: inline-flex;
                align-items: baseline;
                gap: 4px;
                white-space: nowrap;
                z-index: 2;
                pointer-events: none;
            }

            .label {
                display: inline-flex;
                align-items: center;
                white-space: nowrap;
                z-index: 5;
                pointer-events: none;
            }

            .label-row {
                display: flex;
                width: 100%;
                min-width: 0;
                pointer-events: none;
            }

            .label-row.align-left {
                justify-content: flex-start;
            }

            .label-row.align-center {
                justify-content: center;
            }

            .label-row.align-right {
                justify-content: flex-end;
            }

            .label-row.top {
                order: 0;
            }

            .label-row.bottom {
                order: 2;
            }

            .bar-row {
                order: 1;
            }

            .label.vertical.top {
                position: absolute;
                top: 4px;
                left: 50%;
                transform: translateX(-50%);
            }

            .label.vertical.bottom {
                position: absolute;
                bottom: 4px;
                left: 50%;
                transform: translateX(-50%);
            }

            .value.unit-below {
                flex-direction: column;
                align-items: center;
                gap: 0;
                line-height: 1.1;
            }

            .value-number {
                display: inline-grid;
                align-items: baseline;
                justify-items: end;
            }

            .value-number-layer {
                grid-area: 1 / 1;
                justify-self: end;
            }

            .value-placeholder {
                visibility: hidden;
                pointer-events: none;
                justify-self: start;
            }

            .value.inside {
                position: absolute;
            }

            .value.inside.horizontal.inside-start {
                left: 8px;
                top: 50%;
                transform: translateY(-50%);
            }

            .value.inside.horizontal.inside-center {
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }

            .value.inside.horizontal.inside-end {
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
            }

            .value.inside.vertical.inside-start {
                top: 8px;
                left: 50%;
                transform: translateX(-50%);
            }

            .value.inside.vertical.inside-center {
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .value.inside.vertical.inside-end {
                bottom: 8px;
                left: 50%;
                transform: translateX(-50%);
            }

            .marker {
                position: absolute;
                width: 2px;
                height: 100%;
                transform: translateX(-50%);
                pointer-events: auto;
                background: rgba(0, 0, 0, 0.55);
            }

            .linear-root.vertical .marker {
                width: 100%;
                height: 2px;
                transform: translateY(50%);
                background: rgba(0, 0, 0, 0.55);
            }

            .shell-layer {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 3;
            }

            .shell-layer svg {
                display: block;
                width: 100%;
                height: 100%;
                overflow: visible;
            }

            .shell-image-svg {
                display: block;
                width: 100%;
                height: 100%;
                overflow: visible;
            }

            .shell-offset-editor {
                position: absolute;
                inset: 0;
                z-index: 6;
                pointer-events: none;
            }

            .shell-offset-overlay {
                position: absolute;
                inset: 0;
                border: 1px dashed rgba(0, 120, 212, 0.45);
                background: rgba(0, 120, 212, 0.04);
                box-sizing: border-box;
            }

            .shell-offset-inner {
                position: absolute;
                border: 1px solid rgba(0, 120, 212, 0.95);
                background: rgba(0, 120, 212, 0.10);
                box-sizing: border-box;
                pointer-events: none;
            }

            .shell-offset-line {
                position: absolute;
                pointer-events: auto;
                touch-action: none;
            }

            .shell-offset-line.top,
            .shell-offset-line.bottom {
                left: 0;
                right: 0;
                height: 12px;
                margin-top: -6px;
                cursor: ns-resize;
            }

            .shell-offset-line.top::after,
            .shell-offset-line.bottom::after {
                content: '';
                position: absolute;
                left: 0;
                right: 0;
                top: 50%;
                border-top: 2px solid rgba(0, 120, 212, 1);
            }

            .shell-offset-line.left,
            .shell-offset-line.right {
                top: 0;
                bottom: 0;
                width: 12px;
                margin-left: -6px;
                cursor: ew-resize;
            }

            .shell-offset-line.left::after,
            .shell-offset-line.right::after {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: 50%;
                border-left: 2px solid rgba(0, 120, 212, 1);
            }

            .shell-offset-line.right {
                margin-left: 0;
                margin-right: -6px;
            }

            .shell-offset-badge {
                position: absolute;
                z-index: 1;
                pointer-events: none;
                border-radius: 3px;
                background: rgba(0, 0, 0, 0.72);
                color: #fff;
                font-size: 10px;
                line-height: 1;
                padding: 2px 4px;
                white-space: nowrap;
            }

            .shell-offset-badge.top {
                left: 50%;
                transform: translate(-50%, -100%);
            }

            .shell-offset-badge.bottom {
                left: 50%;
                transform: translate(-50%, 0);
            }

            .shell-offset-badge.left {
                top: 50%;
                transform: translate(-100%, -50%);
            }

            .shell-offset-badge.right {
                top: 50%;
                transform: translate(0, -50%);
            }

            .fx-overlay {
                position: absolute;
                z-index: 7;
                pointer-events: none;
                background: transparent;
                box-sizing: border-box;
                border-radius: inherit;
            }

        `],_i=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?wi(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-gauge-linear")],_i);class Ti extends ki{getArcGaugePropertyGroups(){return[{id:"arc",label:"Arc",traits:[{type:"slider",name:"arcAngle",label:"Arc Angle",min:10,max:360,step:1},{type:"number",name:"startAngle",label:"Start Angle",min:-360,max:360,step:1},{type:"select",name:"arcDirection",label:"Direction",options:[{value:"clockwise",label:"Clockwise"},{value:"counterclockwise",label:"Counterclockwise"}]},{type:"select",name:"valuePositionArc",label:"Value Position",options:[{value:"center",label:"Center"},{value:"left",label:"Left"},{value:"right",label:"Right"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"outside-top",label:"Outside Top"},{value:"outside-bottom",label:"Outside Bottom"}],visible:{prop:"showValue",eq:!0}}]}]}getArcGaugeTargetStyles(){return{track:{label:"Track",description:"Arc track",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},progress:{label:"Progress",description:"Arc progress stroke",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},markers:{label:"Markers",description:"Threshold markers",styles:{preset:"full",exclude:{groups:["layout","flex"]}}}}}resolveArcDirection(){return this.resolveProperty("arcDirection","clockwise")}resolveArcAngle(){const e=this.resolvePropertyAsNumber("arcAngle",180);return this.clamp(e,10,360)}resolveStartAngle(){return this.resolvePropertyAsNumber("startAngle",0)}resolveArcValuePosition(){const e=this.resolveProperty("valuePositionArc","center");return"inside-start"===e?"left":"inside-end"===e?"right":"center"===e||"left"===e||"right"===e||"top"===e||"bottom"===e||"outside-top"===e||"outside-bottom"===e?e:"center"}resolveArcValueAnchor(e,t,i={}){const n=Math.max(24,Math.round(i.sampleSteps??240)),r=Math.max(0,(i.strokeWidth??0)/2),o=this.resolveArcBounds(e,0,1,n),s={minX:o.minX-r,minY:o.minY-r,maxX:o.maxX+r,maxY:o.maxY+r},a=e.radius+r,l={minX:e.cx-a,minY:e.cy-a,maxX:e.cx+a,maxY:e.cy+a},c=(s.minX+s.maxX)/2,d=(s.minY+s.maxY)/2,u=Math.max(s.minY,s.maxY-r),h=i.clampToArcBounds??!0,p=(e,t)=>({x:h?this.clamp(e,s.minX,s.maxX):e,y:h?this.clamp(t,s.minY,s.maxY):t});switch(t){case"top":{const e=p((l.minX+l.maxX)/2,l.minY);return{x:e.x,y:e.y,transform:"translate(-50%, 0)"}}case"outside-top":{const e=p((l.minX+l.maxX)/2,l.minY);return{x:e.x,y:e.y,transform:"translate(-50%, -100%)"}}case"bottom":{const e=p((l.minX+l.maxX)/2,u);return{x:e.x,y:e.y,transform:"translate(-50%, -100%)"}}case"outside-bottom":{const e=p((l.minX+l.maxX)/2,u);return{x:e.x,y:e.y,transform:"translate(-50%, 0)"}}case"left":{const e=p(l.minX,d);return{x:e.x,y:e.y,transform:"translate(0, -50%)"}}case"right":{const e=p(l.maxX,d);return{x:e.x,y:e.y,transform:"translate(-100%, -50%)"}}default:return{x:c,y:d,transform:"translate(-50%, -50%)"}}}createArcGeometry(e,t=12){return{cx:e/2,cy:e/2,radius:Math.max(1,e/2-t),startAngle:this.resolveStartAngle(),sweepAngle:this.resolveArcAngle(),direction:this.resolveArcDirection()}}getArcTrackPath(e){return this.buildArcPath(e,e.sweepAngle)}getArcSegmentPath(e,t,i){const n=this.clamp(Math.min(t,i),0,1),r=this.clamp(Math.max(t,i),0,1);if(r<=n){const t=this.getArcMarkerPoint(e,n);return`M ${t.x} ${t.y}`}const o=this.resolveArcAngleAt(e,n),s=e.sweepAngle*(r-n);return this.buildArcPathFrom(e.cx,e.cy,e.radius,o,s,e.direction)}getArcMarkerPoint(e,t){return this.pointOnCircle(e.cx,e.cy,e.radius,this.resolveArcAngleAt(e,t))}resolveArcAngleAt(e,t){const i=this.clamp(t,0,1),n=e.sweepAngle*i;return"clockwise"===e.direction?e.startAngle+n:e.startAngle-n}pointOnCircle(e,t,i,n){const r=(n+180)*(Math.PI/180);return{x:e+i*Math.cos(r),y:t+i*Math.sin(r)}}sampleArcPoints(e,t=0,i=1,n=90){const r=this.clamp(Math.min(t,i),0,1),o=this.clamp(Math.max(t,i),0,1),s=[];if(o<=r)return s.push(this.getArcMarkerPoint(e,r)),s;const a=Math.max(2,n);for(let l=0;l<=a;l+=1){const t=r+(o-r)*l/a;s.push(this.getArcMarkerPoint(e,t))}return s}resolveArcBounds(e,t=0,i=1,n=120){const r=this.sampleArcPoints(e,t,i,n);let o=Number.POSITIVE_INFINITY,s=Number.POSITIVE_INFINITY,a=Number.NEGATIVE_INFINITY,l=Number.NEGATIVE_INFINITY;for(const c of r)o=Math.min(o,c.x),s=Math.min(s,c.y),a=Math.max(a,c.x),l=Math.max(l,c.y);return{minX:o,minY:s,maxX:a,maxY:l,width:Math.max(1,a-o),height:Math.max(1,l-s)}}buildArcPath(e,t){const i=this.clamp(t,0,e.sweepAngle);return this.buildArcPathFrom(e.cx,e.cy,e.radius,e.startAngle,i,e.direction)}buildArcPathFrom(e,t,i,n,r,o){if(r<=0){const r=this.pointOnCircle(e,t,i,n);return`M ${r.x} ${r.y}`}if(r>=360){const r=this.pointOnCircle(e,t,i,n),s="clockwise"===o?n+180:n-180,a=this.pointOnCircle(e,t,i,s),l="clockwise"===o?1:0;return[`M ${r.x} ${r.y}`,`A ${i} ${i} 0 1 ${l} ${a.x} ${a.y}`,`A ${i} ${i} 0 1 ${l} ${r.x} ${r.y}`].join(" ")}const s=n+("clockwise"===o?r:-r),a=this.pointOnCircle(e,t,i,n),l=this.pointOnCircle(e,t,i,s),c=r>180?1:0,d="clockwise"===o?1:0;return`M ${a.x} ${a.y} A ${i} ${i} 0 ${c} ${d} ${l.x} ${l.y}`}}var Ai=Object.getOwnPropertyDescriptor;let Ii=class extends Ti{static getBlockConfig(){return{sinceVersion:"2.4.0",definition:{label:"Gauge Radial",icon:'<ha-icon icon="mdi:gauge-full"></ha-icon>',category:"gauges"},defaults:{requireEntity:!0,props:{valueSource:{value:"state"},valueAttribute:{value:""},minValue:{value:0},maxValue:{value:100},clampValue:{value:!0},showValue:{value:!0},valueFollowThresholdColor:{value:!1},displayMode:{value:"value"},decimalPlaces:{value:1},showUnit:{value:!0},customUnit:{value:""},unitPosition:{value:"inline"},thresholds:{value:[]},thresholdsEnabled:{value:!1},showThresholdMarkers:{value:!1},markerWidthRatio:{value:1.2},markerThicknessPx:{value:2},thresholdColorMode:{value:"active"},animate:{value:!0},animationDurationMs:{value:350},arcAngle:{value:180},startAngle:{value:0},arcDirection:{value:"clockwise"},arcWidth:{value:10},valuePositionArc:{value:"bottom"},progressGlow:{value:!1},progressGlowIntensity:{value:6},thresholdBaseColor:{value:""},showStepColorsOnBarBlend:{value:!1},showStepColorsOnBarBlendDistance:{value:4},showStepColorsOnBackgroundOpacity:{value:.28},showStepColorsOnBackgroundBlend:{value:!1},showStepColorsOnBackgroundBlendDistance:{value:4},thresholdsApplyTo:{value:"none"},labelMode:{value:"hidden"},labelPosition:{value:"outside-bottom"},customLabel:{value:""}}},entityDefaults:{mode:"inherited"},actionTargets:{value:{label:"Value",description:"Gauge value label"},progress:{label:"Progress",description:"Gauge progress arc"},label:{label:"Label",description:"Gauge label"}}}}getPanelConfig(){var e;const t=this.getArcGaugePropertyGroups().find(e=>"arc"===e.id),i=(null==t?void 0:t.traits)??[],n=i.find(e=>"valuePositionArc"===e.name),r=i.filter(e=>"valuePositionArc"!==e.name),o=this.buildMergedBaseDataGroup({insertAfterShowValueTraits:n?[n]:[]}),s={id:"arc",label:(null==t?void 0:t.label)??"Arc",traits:[...r,{type:"slider",name:"arcWidth",label:"Arc Width",min:2,max:40,step:.5},{type:"checkbox",name:"progressGlow",label:"Glow"},{type:"slider",name:"progressGlowIntensity",label:"Glow Intensity",min:1,max:40,step:.5,visible:{prop:"progressGlow",eq:!0}}]},a={id:"thresholds",label:"Thresholds",traits:this.extendThresholdTraitsWithAdvancedColors((null==(e=this.getBaseGaugePropertyGroup("thresholds"))?void 0:e.traits)??[],{singleColorModeLabel:"Single Color Mode",singleColorModeVisible:{prop:"thresholdsApplyTo",in:["none","background"]}})},l=[o,{id:"label",label:"Label",traits:[...this.buildGaugeLabelModeTraits(),{type:"select",name:"labelPosition",label:"Label Position",options:[{value:"center",label:"Center"},{value:"left",label:"Left"},{value:"right",label:"Right"},{value:"top",label:"Top"},{value:"bottom",label:"Bottom"},{value:"outside-top",label:"Outside Top"},{value:"outside-bottom",label:"Outside Bottom"}],visible:{prop:"labelMode",neq:"hidden"}}]},s,a],c=this.getBaseGaugePropertyGroup("behavior");return c&&l.push(c),{properties:{groups:l},targetStyles:{...this.getBaseGaugeTargetStyles(),...this.getArcGaugeTargetStyles(),label:{label:"Label",description:"Entity/custom label",styles:{preset:"full",exclude:{groups:["layout","flex"]}}}}}}render(){if(!this.entity)return h`<div class="no-entity">No entity selected</div>`;const e=this.resolveGaugeMetrics(),t=this.createArcGeometry(100,12),i=this.getArcTrackPath(t),n=this.clamp(e.normalized,0,1),r=this.resolveActiveThresholdColor(e),o=this.resolvePropertyAsBoolean("showThresholdMarkers"),s="butt",a=this.resolvePropertyAsBoolean("progressGlow"),l=this.resolveGlowIntensity(),c=this.resolveThresholdPlacement(),p="bar"===c||"both"===c,g="background"===c||"both"===c,y=this.resolveArcWidth(),b=this.resolveThresholdBaseColor(),f={...this.getTargetStyle("track"),strokeLinecap:s};f.strokeWidth||(f.strokeWidth=String(y));const k={...this.getTargetStyle("progress")},x=this.getAnimationDurationMs(),w={...k,strokeLinecap:s,transition:x>0?`stroke-dasharray ${x}ms linear, stroke ${x}ms linear`:"none"};if(!p){const e=r||b;e&&!k.stroke&&(w.stroke=e)}w.strokeWidth||(w.strokeWidth=String(y));const S=this.resolveStrokeWidth(f,y),_=this.resolveStrokeWidth(w,y),T=Math.max(S,_),A=a?l+2:0,I=this.resolveArcLayout(t,T,S,o,A),C=this.ensureValidLayout(I),P=this.resolveGaugeValueParts(e),M=this.resolvePropertyAsBoolean("showValue"),$={...this.getTargetStyle("value")},L=this.resolveValueTextColor(e);L&&($.color=L);const B=this.getTargetStyle("unit"),E=this.resolveUnitPosition(),D=this.resolveArcValuePosition(),R=this.resolveArcValueAnchor(t,D,{strokeWidth:S,clampToArcBounds:!0,sampleSteps:240}),O=this.resolvePlacementStyle(R,C),N=this.resolveGaugeLabelText(),z=this.getTargetStyle("label"),V=this.resolveLabelPosition(),F=this.resolveArcValueAnchor(t,V,{strokeWidth:S,clampToArcBounds:!0,sampleSteps:240}),W=this.resolvePlacementStyle(F,C),j=this.resolvePropertyAsBoolean("showStepColorsOnBarBlend"),G=this.resolvePropertyAsNumber("showStepColorsOnBarBlendDistance",4),U=this.resolvePropertyAsBoolean("showStepColorsOnBackgroundBlend"),H=this.resolvePropertyAsNumber("showStepColorsOnBackgroundBlendDistance",4),q=this.clamp(this.resolvePropertyAsNumber("showStepColorsOnBackgroundOpacity",.28),0,1),X=b||k.stroke||"#2196f3",Y=f.stroke||"rgba(0, 0, 0, 0.2)",K=p?{paint:X,defs:[],glowColor:X}:this.resolveArcStrokePaint(this.resolvePreferredPaint(w,X,["stroke","background","backgroundImage","backgroundColor"]),this.resolveCustomArcGradientId("progress"),C),Q=g?{paint:Y,defs:[]}:this.resolveArcStrokePaint(this.resolvePreferredPaint(f,Y,["stroke","background","backgroundImage","backgroundColor"]),this.resolveCustomArcGradientId("track"),C),Z=[...K.defs,...Q.defs],J=this.buildThresholdColorChanges(X,e.min,e.span),ee=this.buildThresholdColorChanges(Y,e.min,e.span);g||(f.stroke=Q.paint),a&&(p?delete w.filter:w.filter=`drop-shadow(0 0 ${l}px ${K.glowColor})`);const te={...w};delete te.filter;const ie={...w,strokeDasharray:`${n} 1`};p||(te.stroke=K.paint,ie.stroke=K.paint),n<=0&&(ie.opacity="0");const ne={fill:"none",stroke:"#fff",strokeWidth:String(_),strokeLinecap:s,strokeDasharray:`${n} 1`,transition:x>0?`stroke-dasharray ${x}ms linear`:"none"};n<=0&&(ne.opacity="0");const re=this.resolveProgressMaskId(),oe=this.resolveProgressGlowMaskId(),se=this.resolveProgressGlowFilterId(),ae={fill:"none",stroke:"#fff",strokeWidth:String(_+4*l),strokeLinecap:s,strokeDasharray:`${n} 1`,transition:x>0?`stroke-dasharray ${x}ms linear`:"none"};n<=0&&(ae.opacity="0");const le=p&&j?this.renderBlendedArcSegments("bar",t,1,te,J,G,1,"progress-segment","progress",!1):null,ce=g&&U?this.renderBlendedArcSegments("background",t,1,f,ee,H,1,"track-segment","track",!1):null;return h`
            <div
                class="radial-root"
                style=${u({"--radial-aspect-ratio":`${C.width} / ${C.height}`})}
            >
                <svg
                    width=${String(C.width)}
                    height=${String(C.height)}
                    viewBox="${C.minX} ${C.minY} ${C.width} ${C.height}"
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true"
                >
                    ${p||le||ce||Z.length>0?v`
                        <defs>
                            ${Z}
                            ${le?le.defs:d}
                            ${ce?ce.defs:d}
                            ${p?v`
                                <mask
                                    id=${re}
                                    maskUnits="userSpaceOnUse"
                                    x=${C.minX}
                                    y=${C.minY}
                                    width=${C.width}
                                    height=${C.height}
                                >
                                    <path
                                        d=${i}
                                        pathLength="1"
                                        style=${u(ne)}
                                    ></path>
                                </mask>
                                <mask
                                    id=${oe}
                                    maskUnits="userSpaceOnUse"
                                    x=${C.minX}
                                    y=${C.minY}
                                    width=${C.width}
                                    height=${C.height}
                                >
                                    <path
                                        d=${i}
                                        pathLength="1"
                                        style=${u(ae)}
                                    ></path>
                                </mask>
                            `:d}
                            ${p&&a?this.renderProgressGlowFilterDef(se,l,C):d}
                        </defs>
                    `:d}

                    ${g?v`
                            <g opacity=${String(q)}>
                                ${ce?ce.segments:this.renderColoredArcSegments(t,1,f,ee,!1,H,1,"track-segment","track",!1)}
                            </g>
                        `:v`
                            <path
                                class="track ${this.isStyleTargetActive("track")?"style-target-active":""}"
                                d=${i}
                                style=${u(f)}
                                data-style-target="track"
                            ></path>
                        `}

                    ${p?v`
                            <g mask="url(#${re})">
                                ${le?le.segments:this.renderColoredArcSegments(t,1,te,J,!1,G,1,"progress-segment","progress",!1)}
                            </g>
                            ${a?v`
                                <g
                                    mask="url(#${oe})"
                                    filter="url(#${se})"
                                    pointer-events="none"
                                >
                                    ${le?le.segments:this.renderColoredArcSegments(t,1,te,J,!1,G,1,"progress-segment","progress",!1)}
                                </g>
                            `:d}
                        `:v`
                            <path
                                class="progress ${this.isStyleTargetActive("progress")?"style-target-active":""}"
                                d=${i}
                                pathLength="1"
                                style=${u(ie)}
                                data-style-target="progress"
                                data-action-target="progress"
                            ></path>
                        `}

                    ${o?this.renderThresholdMarkers(e.min,e.span,t,S):d}
                </svg>

                ${N?h`
                    <div
                        class=${m({label:!0,"style-target-active":this.isStyleTargetActive("label")})}
                        style=${u({...z,...W})}
                        data-style-target="label"
                        data-action-target="label"
                    >${N}</div>
                `:d}

                ${M?h`
                    <div
                        class=${m({value:!0,"unit-below":"below"===E,[D]:!0,"style-target-active":this.isStyleTargetActive("value")})}
                        style=${u({...$,...O})}
                        data-style-target="value"
                        data-action-target="value"
                    >
                        <span>${P.valueText}</span>
                        ${P.unitText?h`
                            <span
                                class="${this.isStyleTargetActive("unit")?"style-target-active":""}"
                                style=${u(B)}
                                data-style-target="unit"
                                data-action-target="unit"
                            >${P.unitText}</span>
                        `:d}
                    </div>
                `:d}
            </div>
        `}renderThresholdMarkers(e,t,i,n){const r=this.getTargetStyle("markers"),o=this.isStyleTargetActive("markers"),s=this.resolveMarkerLength(n),a=this.resolveMarkerThickness();return this.getThresholds().map(n=>{const l=this.clamp((n.value-e)/t,0,1),c=this.resolveMarkerSegment(i,l,s),d={...r};return n.color&&!d.stroke&&(d.stroke=n.color),d.strokeWidth||(d.strokeWidth=String(a)),d.strokeLinecap||(d.strokeLinecap="round"),v`
                <g data-style-target="markers">
                    <line
                        class="${o?"style-target-active":""}"
                        x1=${c.inner.x}
                        y1=${c.inner.y}
                        x2=${c.outer.x}
                        y2=${c.outer.y}
                        style=${u(d)}
                    ></line>
                </g>
            `})}renderColoredArcSegments(e,t,i,n,r,o,s,a,l,c){const h=this.clamp(t,0,1);if(h<=0)return d;const p=r?this.buildBlendedSegments(h,n,o):this.buildStepSegments(h,n),g=this.resolveStrokeWidth(i,this.resolveArcWidth()),m=this.resolveSegmentOverlapNormalized(e,g),y=[];if(p.forEach((t,n)=>{const r=t.start,o=n===p.length-1?t.end:Math.min(h,t.end+m);if(o<=r)return;const c=this.applyAlpha(t.color,s),d={...i,stroke:c,strokeLinecap:"butt"},g=v`
                <path
                    class="${a} ${this.isStyleTargetActive(l)?"style-target-active":""}"
                    d=${this.getArcSegmentPath(e,r,o)}
                    style=${u(d)}
                    data-style-target=${l}
                    data-action-target=${l}
                ></path>
            `;y.push(g)}),!c||"round"!==i.strokeLinecap||0===p.length)return y;const b=g/2;if(b<=0)return y;const f=this.getArcMarkerPoint(e,0),k=this.getArcMarkerPoint(e,h),x={fill:this.applyAlpha(p[0].color,s),stroke:"none"},w={fill:this.applyAlpha(p[p.length-1].color,s),stroke:"none"};i.filter&&(x.filter=i.filter,w.filter=i.filter);const S=`${a}-cap ${this.isStyleTargetActive(l)?"style-target-active":""}`;return[...y,v`
                <circle
                    class=${S}
                    cx=${f.x}
                    cy=${f.y}
                    r=${b}
                    style=${u(x)}
                    data-style-target=${l}
                    data-action-target=${l}
                ></circle>
            `,v`
                <circle
                    class=${S}
                    cx=${k.x}
                    cy=${k.y}
                    r=${b}
                    style=${u(w)}
                    data-style-target=${l}
                    data-action-target=${l}
                ></circle>
            `]}renderBlendedArcSegments(e,t,i,n,r,o,s,a,l,c){const d=this.clamp(i,0,1);if(d<=0)return{defs:[],segments:[]};const h=this.buildBlendSegments(d,r,o),p=this.resolveStrokeWidth(n,this.resolveArcWidth()),g=this.resolveSegmentOverlapNormalized(t,p),m=[],y=[],b=[];h.forEach((i,r)=>{const o=i.startColor!==i.endColor,c=i.start,p=r===h.length-1?i.end:Math.min(d,i.end+g);if(p<=c)return;const f={...n,strokeLinecap:"butt"},k=this.applyAlpha(i.startColor,s),x=this.applyAlpha(i.endColor,s);if(k===x)f.stroke=k;else{const i=this.resolveBlendSegmentGradientId(e,r),n=this.getArcMarkerPoint(t,c),o=this.getArcMarkerPoint(t,p);m.push(v`
                    <linearGradient
                        id=${i}
                        gradientUnits="userSpaceOnUse"
                        x1=${n.x}
                        y1=${n.y}
                        x2=${o.x}
                        y2=${o.y}
                        color-interpolation="sRGB"
                    >
                        <stop offset="0" stop-color=${k}></stop>
                        <stop offset="1" stop-color=${x}></stop>
                    </linearGradient>
                `),f.stroke=`url(#${i})`}const w=v`
                <path
                    class="${a} ${this.isStyleTargetActive(l)?"style-target-active":""}"
                    d=${this.getArcSegmentPath(t,c,p)}
                    style=${u(f)}
                    data-style-target=${l}
                    data-action-target=${l}
                ></path>
            `;o?b.push(w):y.push(w)});const f=[...y,...b];if(!c||"round"!==n.strokeLinecap||0===h.length)return{defs:m,segments:f};const k=p/2;if(k<=0)return{defs:m,segments:f};const x=h[0],w=h[h.length-1],S=this.getArcMarkerPoint(t,x.start),_=this.getArcMarkerPoint(t,w.end),T={fill:this.applyAlpha(x.startColor,s),stroke:"none"},A={fill:this.applyAlpha(w.endColor,s),stroke:"none"};n.filter&&(T.filter=n.filter,A.filter=n.filter);const I=`${a}-cap ${this.isStyleTargetActive(l)?"style-target-active":""}`;return f.push(v`
            <circle
                class=${I}
                cx=${S.x}
                cy=${S.y}
                r=${k}
                style=${u(T)}
                data-style-target=${l}
                data-action-target=${l}
            ></circle>
        `),f.push(v`
            <circle
                class=${I}
                cx=${_.x}
                cy=${_.y}
                r=${k}
                style=${u(A)}
                data-style-target=${l}
                data-action-target=${l}
            ></circle>
        `),{defs:m,segments:f}}buildBlendSegments(e,t,i){var n;const r=this.clamp(e,0,1);if(r<=0)return[];const o=this.clamp(i/100,0,.6),s=[],a=1e-6;let l=0,c=(null==(n=t[0])?void 0:n.color)??"#2196f3";for(let d=1;d<t.length;d+=1){const e=this.clamp(t[d].position,0,1),i=t[d].color;if(e<=l+a){c=i;continue}if(e>=r+a)break;if(o<=0){const t=Math.min(e,r);t>l+a&&(s.push({start:l,end:t,startColor:c,endColor:c}),l=t),c=i;continue}const n=o/2,u=this.clamp(e-n,0,r),h=this.clamp(e+n,0,r),p=Math.max(u,l),g=Math.max(p,h);if(p>l+a&&s.push({start:l,end:p,startColor:c,endColor:c}),g>p+a&&s.push({start:p,end:g,startColor:c,endColor:i}),l=g,c=i,l>=r-a)break}return l<r-a&&s.push({start:l,end:r,startColor:c,endColor:c}),s.filter(e=>e.end>e.start+a)}resolveBlendSegmentGradientId(e,t){var i;return`gauge-radial-${((null==(i=this.block)?void 0:i.id)??"radial").replace(/[^a-zA-Z0-9_-]/g,"_")}-${e}-blend-${t}`}resolveProgressMaskId(){var e;return`gauge-radial-${((null==(e=this.block)?void 0:e.id)??"radial").replace(/[^a-zA-Z0-9_-]/g,"_")}-progress-mask`}resolveProgressGlowMaskId(){var e;return`gauge-radial-${((null==(e=this.block)?void 0:e.id)??"radial").replace(/[^a-zA-Z0-9_-]/g,"_")}-progress-glow-mask`}resolveProgressGlowFilterId(){var e;return`gauge-radial-${((null==(e=this.block)?void 0:e.id)??"radial").replace(/[^a-zA-Z0-9_-]/g,"_")}-progress-glow`}resolveCustomArcGradientId(e){var t;return`gauge-radial-${((null==(t=this.block)?void 0:t.id)??"radial").replace(/[^a-zA-Z0-9_-]/g,"_")}-custom-${e}-paint`}resolveArcStrokePaint(e,t,i){var n;const r=e.trim();if(!r)return{paint:"#2196f3",defs:[],glowColor:"#2196f3"};const o=this.extractFirstLinearGradientExpression(r);if(!o)return{paint:r,defs:[],glowColor:this.resolveGlowColorFromPaint(r,"#2196f3")};const s=this.parseLinearGradientExpression(o);if(!s||0===s.stops.length)return{paint:this.resolveGlowColorFromPaint(r,"#2196f3"),defs:[],glowColor:this.resolveGlowColorFromPaint(r,"#2196f3")};const a=this.resolveGradientVector(s.direction,i),l=this.resolveGradientStopOffsets(s.stops);return{paint:`url(#${t})`,defs:[v`
                <linearGradient
                    id=${t}
                    gradientUnits="userSpaceOnUse"
                    x1=${a.x1}
                    y1=${a.y1}
                    x2=${a.x2}
                    y2=${a.y2}
                    color-interpolation="sRGB"
                >
                    ${l.map(e=>v`
                        <stop offset=${String(this.clamp(e.offset??0,0,1))} stop-color=${e.color}></stop>
                    `)}
                </linearGradient>
            `],glowColor:(null==(n=l[0])?void 0:n.color)??"#2196f3"}}renderProgressGlowFilterDef(e,t,i){const n=8*t,r=i.minX-n,o=i.minY-n,s=i.width+2*n,a=i.height+2*n,l=Math.max(.2,t);return v`
            <filter
                id=${e}
                x=${String(r)}
                y=${String(o)}
                width=${String(s)}
                height=${String(a)}
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
                <feGaussianBlur in="SourceGraphic" stdDeviation=${String(l)} result="blur"></feGaussianBlur>
                <feComposite in="blur" in2="SourceAlpha" operator="out"></feComposite>
            </filter>
        `}resolveSegmentOverlapNormalized(e,t){const i=Math.max(10,e.sweepAngle)*(Math.PI/180),n=Math.max(1,e.radius*i),r=Math.max(1,.22*t);return this.clamp(r/n,0,.04)}buildStepSegments(e,t){var i;const n=[];let r=0,o=(null==(i=t[0])?void 0:i.color)??"#2196f3";for(const s of t){if(s.position<=0){o=s.color;continue}const t=this.clamp(s.position,0,e);if(t>r&&n.push({start:r,end:t,color:o}),r=Math.max(r,s.position),o=s.color,r>=e)break}return r<e&&n.push({start:r,end:e,color:o}),n.filter(e=>e.end>e.start)}buildBlendedSegments(e,t,i){const n=[],r=Math.max(24,Math.ceil(140*e)),o=this.clamp(i/100,0,.6);for(let s=0;s<r;s+=1){const i=e*s/r,a=e*(s+1)/r,l=(i+a)/2,c=this.resolveColorAt(l,t,o);n.push({start:i,end:a,color:c})}return n}resolveColorAt(e,t,i){if(0===t.length)return"#2196f3";let n=t[0].color;for(let o=0;o<t.length;o+=1){const i=t[o];if(e<i.position)break;n=i.color}if(i<=0||t.length<2)return n;const r=i/2;for(let o=0;o<t.length-1;o+=1){const i=t[o],n=t[o+1],s=n.position-r,a=n.position+r;if(e<s||e>a)continue;const l=this.parseColor(i.color),c=this.parseColor(n.color);if(!l||!c)return e<n.position?i.color:n.color;const d=this.clamp((e-s)/(a-s),0,1);return this.rgbToString(this.mixColors(l,c,d))}return n}resolveLabelPosition(){const e=this.resolveProperty("labelPosition","outside-bottom");return"inside-top"===e?"top":"inside-center"===e?"center":"inside-bottom"===e?"bottom":"center"===e||"left"===e||"right"===e||"top"===e||"bottom"===e||"outside-top"===e||"outside-bottom"===e?e:"outside-bottom"}resolvePlacementStyle(e,t){return{left:`${(e.x-t.minX)/t.width*100}%`,top:`${(e.y-t.minY)/t.height*100}%`,right:"auto",bottom:"auto",transform:e.transform}}resolveArcLayout(e,t,i,n,r){const o=this.resolveArcBounds(e,0,1,180),s=this.resolveGaugeMetrics();let a=o.minX,l=o.minY,c=o.maxX,d=o.maxY;if(n){const t=this.resolveMarkerLength(i),n=this.resolveMarkerThickness()/2;for(const i of this.getThresholds()){const r=this.clamp((i.value-s.min)/s.span,0,1),o=this.resolveMarkerSegment(e,r,t);a=Math.min(a,o.inner.x-n,o.outer.x-n),c=Math.max(c,o.inner.x+n,o.outer.x+n),l=Math.min(l,o.inner.y-n,o.outer.y-n),d=Math.max(d,o.inner.y+n,o.outer.y+n)}}const u=t/2+2+r;a-=u,c+=u,l-=u,d+=u;const h=Math.max(1,c-a),p=Math.max(1,d-l);return{minX:a,minY:l,width:h,height:p,aspectRatio:h/p}}resolveStrokeWidth(e,t){const i=e.strokeWidth;if(!i)return t;const n=parseFloat(i);return Number.isFinite(n)?n:t}resolveArcWidth(){return Math.max(1,this.resolvePropertyAsNumber("arcWidth",10))}resolveMarkerThickness(){return this.resolveMarkerThicknessPx()}resolveMarkerLength(e){return Math.max(1,e*this.resolveMarkerWidthRatio())}resolveMarkerSegment(e,t,i){const n=this.resolveArcAngleAt(e,t),r=i/2,o=Math.max(0,e.radius-r),s=e.radius+r;return{inner:this.pointOnCircle(e.cx,e.cy,o,n),outer:this.pointOnCircle(e.cx,e.cy,s,n)}}applyAlpha(e,t){const i=this.parseColor(e);return i?this.rgbToString({...i,a:i.a*t}):e}ensureValidLayout(e){return!Number.isFinite(e.minX)||!Number.isFinite(e.minY)||!Number.isFinite(e.width)||!Number.isFinite(e.height)||e.width<=0||e.height<=0?{minX:0,minY:0,width:100,height:100,aspectRatio:1}:e}};Ii.styles=[...Ti.styles,l`
            :host {
                display: block;
                min-width: 90px;
                min-height: 90px;
            }

            .radial-root {
                position: relative;
                display: block;
                width: 100%;
                min-height: 0;
                aspect-ratio: var(--radial-aspect-ratio, 1 / 1);
            }

            svg {
                width: 100%;
                height: 100%;
                min-height: 0;
                display: block;
                overflow: visible;
            }

            .track,
            .progress,
            .track-segment,
            .progress-segment {
                fill: none;
                stroke-width: 10;
            }

            .track {
                stroke: rgba(0, 0, 0, 0.2);
            }

            .progress {
                stroke: var(--accent-color, #2196f3);
                stroke-linecap: round;
            }

            .value,
            .label {
                position: absolute;
                white-space: nowrap;
                display: inline-flex;
                align-items: baseline;
                gap: 4px;
                pointer-events: none;
            }

            .value.unit-below {
                flex-direction: column;
                align-items: center;
                gap: 0;
                line-height: 1.1;
            }

            .value.center {
                left: 50%;
                top: 52%;
                transform: translate(-50%, -50%);
            }

            .value.inside-start {
                left: 28%;
                top: 52%;
                transform: translate(-50%, -50%);
            }

            .value.inside-end {
                left: 72%;
                top: 52%;
                transform: translate(-50%, -50%);
            }

            .value.top,
            .value.outside-top {
                left: 50%;
                top: 4px;
                transform: translateX(-50%);
            }

            .value.bottom,
            .value.outside-bottom {
                left: 50%;
                bottom: 4px;
                transform: translateX(-50%);
            }

        `],Ii=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?Ai(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-gauge-radial")],Ii);var Ci=Object.defineProperty,Pi=Object.getOwnPropertyDescriptor,Mi=(e,t,i,n)=>{for(var r,o=n>1?void 0:n?Pi(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Ci(t,i,o),o};let $i=class extends Ii{constructor(){super(...arguments),this._overlayViewBox="0 0 100 100"}static getBlockConfig(){const e=Ii.getBlockConfig(),t=e.defaults.props;return{...e,definition:{...e.definition,label:"Gauge Tachometer",icon:'<ha-icon icon="mdi:speedometer"></ha-icon>'},defaults:{...e.defaults,props:{...t,arcAngle:{value:270},startAngle:{value:-45},needleLength:{value:40},showMajorTicks:{value:!0},majorTickCount:{value:10},majorTickLength:{value:5},majorTickThickness:{value:.7},showMinorTicks:{value:!0},minorTicksPerInterval:{value:4},minorTickLength:{value:3},minorTickThickness:{value:.5},showMajorTickValues:{value:!0},majorTickValueDecimals:{value:0}}},actionTargets:{...e.actionTargets,needle:{label:"Needle",description:"Tachometer needle"},needleCenter:{label:"Needle Center",description:"Needle center circle"}}}}getPanelConfig(){var e;const t=super.getPanelConfig(),i=[...(null==(e=t.properties)?void 0:e.groups)??[]].filter(e=>"tachometer"!==e.id),n={id:"tachometer",label:"Tachometer",traits:[{type:"slider",name:"needleLength",label:"Needle Length",min:20,max:100,step:1},{type:"checkbox",name:"showMajorTicks",label:"Show Major Ticks"},{type:"number",name:"majorTickCount",label:"Major Tick Count",min:2,max:24,step:1,visible:{prop:"showMajorTicks",eq:!0}},{type:"slider",name:"majorTickLength",label:"Major Tick Length",min:1,max:24,step:.5,visible:{prop:"showMajorTicks",eq:!0}},{type:"slider",name:"majorTickThickness",label:"Major Tick Thickness",min:.5,max:8,step:.1,visible:{prop:"showMajorTicks",eq:!0}},{type:"checkbox",name:"showMinorTicks",label:"Show Minor Ticks",visible:{prop:"showMajorTicks",eq:!0}},{type:"number",name:"minorTicksPerInterval",label:"Minor Ticks/Interval",min:1,max:12,step:1,visible:{and:[{prop:"showMajorTicks",eq:!0},{prop:"showMinorTicks",eq:!0}]}},{type:"slider",name:"minorTickLength",label:"Minor Tick Length",min:1,max:24,step:.5,visible:{and:[{prop:"showMajorTicks",eq:!0},{prop:"showMinorTicks",eq:!0}]}},{type:"slider",name:"minorTickThickness",label:"Minor Tick Thickness",min:.5,max:8,step:.1,visible:{and:[{prop:"showMajorTicks",eq:!0},{prop:"showMinorTicks",eq:!0}]}},{type:"checkbox",name:"showMajorTickValues",label:"Show Major Tick Values",visible:{prop:"showMajorTicks",eq:!0}},{type:"number",name:"majorTickValueDecimals",label:"Tick Value Decimals",min:0,max:4,step:1,visible:{and:[{prop:"showMajorTicks",eq:!0},{prop:"showMajorTickValues",eq:!0}]}}]},r=i.findIndex(e=>"thresholds"===e.id);return r>=0?i.splice(r,0,n):i.push(n),{properties:{...t.properties??{},groups:i},targetStyles:{...t.targetStyles,needle:{label:"Needle",description:"Needle body",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},needleCenter:{label:"Needle Center",description:"Needle center circle",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},majorTicks:{label:"Major Ticks",description:"Main tachometer ticks",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},minorTicks:{label:"Minor Ticks",description:"Secondary tachometer ticks",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},tickValues:{label:"Tick Values",description:"Major tick labels",styles:{preset:"full",exclude:{groups:["layout","flex"]}}}}}}updated(e){super.updated(e);const t=this.renderRoot.querySelector(".radial-root > svg");if(!t)return;const i=t.getAttribute("viewBox")??"0 0 100 100";i!==this._overlayViewBox&&(this._overlayViewBox=i)}render(){if(!this.entity)return super.render();const e=super.render(),t=this.resolveGaugeMetrics(),i=this.createArcGeometry(100,12),n=this.resolveArcAngleAt(i,t.normalized),r=this.clamp(this.resolvePropertyAsNumber("needleLength",84),20,100),o=i.radius*(r/100),s=this.createNeedleShape(i.cx,i.cy,o),a=this.getAnimationDurationMs(),l=a>0?`transform ${a}ms linear`:"none",c=this.resolvePropertyAsBoolean("showMajorTicks"),p=this.resolvePropertyAsBoolean("showMinorTicks"),g=this.resolvePropertyAsBoolean("showMajorTickValues"),m=Math.max(2,Math.round(this.resolvePropertyAsNumber("majorTickCount",8))),v=Math.max(1,Math.round(this.resolvePropertyAsNumber("minorTicksPerInterval",4))),y=Math.max(0,Math.min(4,Math.round(this.resolvePropertyAsNumber("majorTickValueDecimals",0)))),b={...this.getTargetStyle("needle")},f={...this.getTargetStyle("needleCenter")},k={transformOrigin:`${i.cx}px ${i.cy}px`,transformBox:"view-box",transform:`rotate(${n}deg)`,transition:l},x={...this.getTargetStyle("majorTicks")},w={...this.getTargetStyle("minorTicks")},S={...this.getTargetStyle("tickValues")},_=this.resolveTachArcStrokeWidth(),T=Math.max(0,i.radius-_/2),A=this.clamp(this.resolvePropertyAsNumber("majorTickLength",Math.max(3,.9*_)),1,24),I=this.clamp(this.resolvePropertyAsNumber("majorTickThickness",1.4),.5,8),C=this.clamp(this.resolvePropertyAsNumber("minorTickLength",Math.max(2,.55*A)),1,24),P=this.clamp(this.resolvePropertyAsNumber("minorTickThickness",1),.5,8),M=T,$=Math.max(0,T-A),L=T,B=Math.max(0,T-C),E=Math.max(0,$-4);return h`
            <div class="tachometer-shell">
                ${e}
                <svg
                    class="tachometer-overlay"
                    viewBox=${this._overlayViewBox}
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true"
                >
                    ${c?this.renderMajorTicks(i,m,M,$,I,x):d}
                    ${c&&p?this.renderMinorTicks(i,m,v,L,B,P,w):d}
                    ${c&&g?this.renderMajorTickValues(i,t.min,t.span,m,E,y,S):d}
                    <g style=${u(k)}>
                        <path
                            class="needle-highlight"
                            d=${s.highlightPath}
                        ></path>
                        <path
                            class="needle ${this.isStyleTargetActive("needle")?"style-target-active":""}"
                            d=${s.path}
                            style=${u(b)}
                            data-style-target="needle"
                            data-action-target="needle"
                        ></path>
                    </g>
                    <circle
                        class="needle-center ${this.isStyleTargetActive("needleCenter")?"style-target-active":""}"
                        cx=${i.cx}
                        cy=${i.cy}
                        r=${s.centerRadius}
                        style=${u(f)}
                        data-style-target="needleCenter"
                        data-action-target="needleCenter"
                    ></circle>
                </svg>
            </div>
        `}renderMajorTicks(e,t,i,n,r,o){const s={...o,strokeLinecap:"butt",strokeWidth:String(r)},a=[];for(let l=0;l<=t;l+=1){const r=l/t,o=this.resolveArcAngleAt(e,r),c=this.pointOnCircle(e.cx,e.cy,i,o),d=this.pointOnCircle(e.cx,e.cy,n,o);a.push(v`
                <line
                    class="tick-major ${this.isStyleTargetActive("majorTicks")?"style-target-active":""}"
                    x1=${c.x}
                    y1=${c.y}
                    x2=${d.x}
                    y2=${d.y}
                    style=${u(s)}
                    data-style-target="majorTicks"
                ></line>
            `)}return a}renderMinorTicks(e,t,i,n,r,o,s){const a={...s,strokeLinecap:"butt",strokeWidth:String(o)},l=[];for(let c=0;c<t;c+=1)for(let o=1;o<=i;o+=1){const s=(c+o/(i+1))/t,d=this.resolveArcAngleAt(e,s),h=this.pointOnCircle(e.cx,e.cy,n,d),p=this.pointOnCircle(e.cx,e.cy,r,d);l.push(v`
                    <line
                        class="tick-minor ${this.isStyleTargetActive("minorTicks")?"style-target-active":""}"
                        x1=${h.x}
                        y1=${h.y}
                        x2=${p.x}
                        y2=${p.y}
                        style=${u(a)}
                        data-style-target="minorTicks"
                    ></line>
                `)}return l}renderMajorTickValues(e,t,i,n,r,o,s){const a=[];for(let l=0;l<=n;l+=1){const c=l/n,d=this.resolveArcAngleAt(e,c),h=this.pointOnCircle(e.cx,e.cy,r,d),p=t+i*c;a.push(v`
                <text
                    class="tick-value ${this.isStyleTargetActive("tickValues")?"style-target-active":""}"
                    x=${h.x}
                    y=${h.y}
                    style=${u(s)}
                    data-style-target="tickValues"
                >${this.formatNumber(p,o)}</text>
            `)}return a}resolveArcAngle(){const e=this.resolvePropertyAsNumber("arcAngle",270);return this.clamp(e,10,360)}resolveTachArcStrokeWidth(){const e=this.getTargetStyle("track").strokeWidth;if(e){const t=parseFloat(e);if(Number.isFinite(t)&&t>0)return t}return Math.max(1,this.resolvePropertyAsNumber("arcWidth",10))}createNeedleShape(e,t,i){const n=this.pointOnCircle(e,t,i,0),r=Math.min(10,Math.max(3,.18*i)),o=this.pointOnCircle(e,t,r,180),s=Math.max(1.3,Math.min(4.5,.055*i)),a=Math.max(.9,.72*s),l=Math.PI/180*90,c=Math.cos(l),d=Math.sin(l),u=e+c*s,h=t+d*s,p=e-c*s,g=t-d*s,m=o.x+c*a,v=o.y+d*a,y=o.x-c*a,b=o.y-d*a,f=[`M ${m} ${v}`,`L ${u} ${h}`,`L ${n.x} ${n.y}`,`L ${p} ${g}`,`L ${y} ${b}`,"Z"].join(" "),k=this.pointOnCircle(e,t,Math.max(1.2,.25*r),180),x=this.pointOnCircle(e,t,Math.max(2,.9*i),0);return{path:f,highlightPath:`M ${k.x} ${k.y} L ${x.x} ${x.y}`,centerRadius:Math.max(3.2,s+.2)}}};$i.styles=[...Ii.styles,l`
            .tachometer-shell {
                position: relative;
                width: 100%;
            }

            .tachometer-overlay {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                overflow: visible;
                pointer-events: none;
            }

            .needle {
                fill: #f4f4f2;
                stroke: rgba(0, 0, 0, 0.28);
                stroke-width: 0.35;
                stroke-linejoin: round;
            }

            .needle-highlight {
                fill: none;
                stroke: rgba(255, 255, 255, 0.75);
                stroke-width: 0.9;
                stroke-linecap: round;
                pointer-events: none;
            }

            .needle-center {
                fill: #1f1f1f;
                stroke: rgba(0, 0, 0, 0.35);
                stroke-width: 0.45;
            }

            .tick-major,
            .tick-minor {
                stroke: rgba(0, 0, 0, 0.45);
                stroke-linecap: butt;
                fill: none;
            }

            .tick-major {
                stroke-width: 1.4;
            }

            .tick-minor {
                stroke-width: 1;
                opacity: 0.75;
            }

            .tick-value {
                fill: currentColor;
                text-anchor: middle;
                dominant-baseline: middle;
                font-size: 4.2px;
                pointer-events: none;
            }
        `],Mi([c()],$i.prototype,"_overlayViewBox",2),$i=Mi([p("block-gauge-tachometer")],$i);class Li extends dt{_getDropZones(){return this.block&&0!==this.block.children.length?this.block.children.map(e=>this.documentModel.getBlock(e)):[]}_updateDropZones(){this._getDropZones().forEach(e=>{const t=this.documentModel.getElement(e.id);null==t||t.requestUpdate()})}}const Bi=e("block-registry");class Ei{constructor(e,t,i,n){this.documentModel=e,this.containerManager=t,this.presetService=i,this.blockRegistry=n,this.bindingContext={}}setBindingEvaluator(e){this.bindingEvaluator=e}setBindingContext(e){this.bindingContext=e}resolve(e,t,i,n=!0,r,o){return this.resolveTarget(e,t,r,i,n,o)}resolveBase(e,t,i,n=!0,r){return this.resolveTarget(e,t,r,i,n,void 0)}resolveTarget(e,t,i,n,r=!0,o){var s,a;const l=n||this.bindingContext,c=i??"block",d=this.documentModel.getBlock(e);if(!d)return{};const u=null==(a=null==(s=d.styles)?void 0:s[c])?void 0:a.stylePresetId,h={blockId:e,targetId:c,containerId:t,blockType:d.type,presetId:u,applyFallbacks:r,themeMode:o};return this.resolveAllCategories(d,h,l)}resolveAllCategories(e,t,i){const n={},r=this.getAllCategories(e,t);for(const o of r){const r=this.resolveCategory(e,t,o,i);Object.keys(r).length>0&&(n[o]=r)}return n}getAllCategories(e,t){var i,n;const r=new Set,o=null==(i=this.blockRegistry)?void 0:i.getBlockDefaults(t.blockType),s="block"===t.targetId;if(o&&s&&Object.keys(o).forEach(e=>r.add(e)),t.presetId){const e=this.presetService.getCachedPreset(t.presetId);if(null==(n=null==e?void 0:e.data)?void 0:n.containers)for(const t of Object.values(e.data.containers))t&&Object.keys(t).forEach(e=>r.add(e))}const a=this.getInlineSources(e,t);for(const l of a)l&&Object.keys(l).forEach(e=>r.add(e));return Array.from(r)}resolveCategory(e,t,i,n){const r={},o=this.getAllPropertiesInCategory(e,t,i);for(const s of o){const o=this.resolvePropertyValue(e,t,i,s,n);o&&(r[s]=o)}return r}getAllPropertiesInCategory(e,t,i){var n;const r=new Set,o=null==(n=this.blockRegistry)?void 0:n.getBlockDefaults(t.blockType);if("block"===t.targetId&&(null==o?void 0:o[i])&&Object.keys(o[i]).forEach(e=>r.add(e)),t.presetId){this.getPresetPropertiesInCategory(i,t.presetId,t.containerId,t.applyFallbacks??!0).forEach(e=>r.add(e))}return this.getInlinePropertiesInCategory(e,i,t.containerId,t.targetId,t.applyFallbacks).forEach(e=>r.add(e)),Array.from(r)}resolvePropertyValue(e,t,i,n,r){const o=this.hasLocalOverride(e,t.containerId,i,n,t.targetId,t.themeMode),s=this.containerManager.getFallbackChain(t.containerId);for(const a of s){const s=this.getPropertyFromInline(e,a.id,i,n,t.targetId);if(tt(s.value,t.themeMode,i,n)){const e=a.id===t.containerId?"inline":"inline-fallback";return this.createResolvedValue(s,e,a.id,o,i,n,void 0,r,t.themeMode)}}if(t.presetId)for(const a of s){const e=this.getPropertyFromPreset(t.presetId,a.id,i,n);if(tt(e.value,t.themeMode,i,n)){const s=a.id===t.containerId?"preset":"preset-fallback";return this.createResolvedValue(e,s,a.id,o,i,n,t.presetId,r,t.themeMode)}}if("block"===t.targetId){const e=this.getPropertyFromBlockDefaults(t.blockType,i,n);if(tt(e.value,t.themeMode,i,n))return this.createResolvedValue(e,"block-type-default",void 0,o,i,n,void 0,r,t.themeMode)}}hasLocalOverride(e,t,i,n,r,o){var s,a,l,c,d;const u=r??"block";return tt(null==(d=null==(c=null==(l=null==(a=null==(s=e.styles)?void 0:s[u])?void 0:a.containers)?void 0:l[t])?void 0:c[i])?void 0:d[n],o,i,n)}createResolvedValue(e,t,i,n,r,o,s,a,l){var c;const d=this.resolveThemeModeFields(e.value,l,r,o),u=d.binding,h=d.unit;let p;if(u){const e=null==(c=this.bindingEvaluator)?void 0:c.evaluate(u,{defaultEntityId:(null==a?void 0:a.defaultEntityId)||this.bindingContext.defaultEntityId,defaultValue:d.value});p=null==e?void 0:e.value}else p=d.value;return{value:p,unit:h,origin:t,originContainer:i,presetId:s,binding:u,hasLocalOverride:n}}resolveThemeModeFields(e,t,i,n){var r;if(!t||!Ze(i,n))return{value:e.value,unit:e.unit,binding:e.binding};const o=null==(r=e.themeModes)?void 0:r[t];return{value:(null==o?void 0:o.value)??e.value,unit:(null==o?void 0:o.unit)??e.unit,binding:(null==o?void 0:o.binding)??e.binding}}getInlinePropertiesInCategory(e,t,i,n,r=!0){var o,s,a,l;const c=n??"block",d=null==(s=null==(o=e.styles)?void 0:o[c])?void 0:s.containers,u=this.containerManager.getFallbackChain(i);if(!r&&(null==(a=null==d?void 0:d[i])?void 0:a[t]))return Object.keys(d[i][t]||{});const h=new Set;for(const p of u)for(const e of Object.keys((null==(l=null==d?void 0:d[p.id])?void 0:l[t])||{}))h.add(e);return Array.from(h)}getInlineSources(e,t){var i;const n=t.targetId??"block",r=null==(i=e.styles)?void 0:i[n];return(null==r?void 0:r.containers)?Object.values(r.containers).filter(Boolean):[]}getPresetPropertiesInCategory(e,t,i,n){var r,o,s;const a=this.getMergedPreset(t);if(!(null==a?void 0:a.containers))return[];const l=this.containerManager.getFallbackChain(i);if(!n&&(null==(r=a.containers[i])?void 0:r[e]))return Object.keys(a.containers[i][e]||{});const c=new Set;for(const d of l)for(const t of Object.keys((null==(s=null==(o=a.containers)?void 0:o[d.id])?void 0:s[e])||{}))c.add(t);return Array.from(c)}getPropertyFromInline(e,t,i,n,r){var o,s,a,l,c;const d=r??"block";return{value:null==(c=null==(l=null==(a=null==(s=null==(o=e.styles)?void 0:o[d])?void 0:s.containers)?void 0:a[t])?void 0:l[i])?void 0:c[n]}}getPropertyFromPreset(e,t,i,n){var r,o,s;const a=this.getMergedPreset(e);return{value:null==(s=null==(o=null==(r=null==a?void 0:a.containers)?void 0:r[t])?void 0:o[i])?void 0:s[n]}}getPropertyFromBlockDefaults(e,t,i){var n,r;const o=null==(n=this.blockRegistry)?void 0:n.getBlockDefaults(e);return{value:null==(r=null==o?void 0:o[t])?void 0:r[i]}}getMergedPreset(e){return this.mergePresetChain(e)}mergePresetChain(e,t=new Set){if(t.has(e))return void console.warn(`[StyleResolver] Circular preset inheritance detected: ${Array.from(t).join(" → ")} → ${e}`);if(t.size>10)return void console.warn("[StyleResolver] Max preset inheritance depth exceeded");const i=this.presetService.getCachedPreset(e);if(!i)return void console.warn(`[StyleResolver] Preset not found: ${e}`);if(t.add(e),!i.extendsPresetId)return i.data;return ot(this.mergePresetChain(i.extendsPresetId,t),i.data)}}function Di(e,t){var i,n,r,o;if(!t)return!0;if(t.only){const r=(null==(i=t.only.categories)?void 0:i.includes(e))??!1,o=(null==(n=t.only.properties)?void 0:n.some(t=>t.startsWith(`${e}.`)))??!1;return r||o}if(t.exclude){return!((null==(r=t.exclude.categories)?void 0:r.includes(e))??!1)||((null==(o=t.include)?void 0:o.some(t=>t.startsWith(`${e}.`)))??!1)}return!0}function Ri(e,t,i){var n,r,o,s,a;if(!i)return!0;const l=`${e}.${t}`;if(i.only){const t=(null==(n=i.only.categories)?void 0:n.includes(e))??!1,o=(null==(r=i.only.properties)?void 0:r.includes(l))??!1;return t||o}if(i.exclude){const t=(null==(o=i.exclude.categories)?void 0:o.includes(e))??!1,n=(null==(s=i.exclude.properties)?void 0:s.includes(l))??!1;return!!(null==(a=i.include)?void 0:a.includes(l))||!t&&!n}return!0}const Oi=["px","rem","em","%","vh","vw","vmin","vmax","ch","ex","cm","mm","in","pt","pc"],Ni=["px","rem","em","vh","vw","vmin","vmax","ch","ex","cm","mm","in","pt","pc"],zi=[...Oi,"auto"],Vi=[...Oi,"none"],Fi={"size.width":zi,"size.height":zi,"size.minWidth":zi,"size.maxWidth":Vi,"size.minHeight":zi,"size.maxHeight":Vi,"spacing.margin":Oi,"spacing.padding":Oi,"spacing.marginTop":Oi,"spacing.marginRight":Oi,"spacing.marginBottom":Oi,"spacing.marginLeft":Oi,"spacing.paddingTop":Oi,"spacing.paddingRight":Oi,"spacing.paddingBottom":Oi,"spacing.paddingLeft":Oi,"typography.fontSize":Oi,"typography.letterSpacing":Ni,"border.borderWidth":Ni,"border.borderTopWidth":Ni,"border.borderRightWidth":Ni,"border.borderBottomWidth":Ni,"border.borderLeftWidth":Ni,"border.borderRadius":Oi,"border.borderTopLeftRadius":Oi,"border.borderTopRightRadius":Oi,"border.borderBottomRightRadius":Oi,"border.borderBottomLeftRadius":Oi,"svg.strokeWidth":Ni,"svg.strokeDashoffset":Ni,"flex.gap":Oi,"flex.rowGap":Oi,"flex.columnGap":Oi,"flex.flexBasis":zi,"effects.rotate":["deg","rad","grad","turn"]},Wi={"size.width":"px","size.height":"px","size.minWidth":"px","size.maxWidth":"px","size.minHeight":"px","size.maxHeight":"px","spacing.margin":"px","spacing.padding":"px","spacing.marginTop":"px","spacing.marginRight":"px","spacing.marginBottom":"px","spacing.marginLeft":"px","spacing.paddingTop":"px","spacing.paddingRight":"px","spacing.paddingBottom":"px","spacing.paddingLeft":"px","typography.fontSize":"px","typography.letterSpacing":"px","border.borderWidth":"px","border.borderTopWidth":"px","border.borderRightWidth":"px","border.borderBottomWidth":"px","border.borderLeftWidth":"px","border.borderRadius":"px","border.borderTopLeftRadius":"px","border.borderTopRightRadius":"px","border.borderBottomRightRadius":"px","border.borderBottomLeftRadius":"px","svg.strokeWidth":"px","svg.strokeDashoffset":"px","flex.gap":"px","flex.rowGap":"px","flex.columnGap":"px","flex.flexBasis":"px","effects.rotate":"deg"},ji={width:"px",height:"px",minWidth:"px",maxWidth:"px",minHeight:"px",maxHeight:"px",margin:"px",padding:"px",marginTop:"px",marginRight:"px",marginBottom:"px",marginLeft:"px",paddingTop:"px",paddingRight:"px",paddingBottom:"px",paddingLeft:"px",fontSize:"px",letterSpacing:"px",borderWidth:"px",borderRadius:"px",borderTopWidth:"px",borderRightWidth:"px",borderBottomWidth:"px",borderLeftWidth:"px",borderTopLeftRadius:"px",borderTopRightRadius:"px",borderBottomRightRadius:"px",borderBottomLeftRadius:"px",strokeWidth:"px",strokeDashoffset:"px",rowGap:"px",columnGap:"px",gap:"px",flexBasis:"px",rotate:"deg"};function Gi(e,t){return Fi[`${e}.${t}`]}function Ui(e,t){return Wi[`${e}.${t}`]}function Hi(e,t={}){const{filter:i,append:n}=t,r={};for(const[o,s]of Object.entries(e)){if(!s)continue;if("_internal"===o)continue;if(!Di(o,i))continue;const e=qi(o,s,t);Object.assign(r,e)}return n&&Object.assign(r,n),r}function qi(e,t,i={}){const n={};switch(e){case"layout":Object.assign(n,function(e,t,i){var n,r,o,s,a,l;const c={},{filter:d}=i,u=Yi(e,c,i);if(void 0!==(null==(n=t.display)?void 0:n.value)&&Ri(e,"display",d)){u("display","display",`${t.display.value}`,"layout-display")}if(void 0!==(null==(r=t.show)?void 0:r.value)&&Ri(e,"show",d)&&"no"===t.show.value){u("show","display","none","layout-show")}if(void 0!==(null==(o=t.positionX)?void 0:o.value)&&Ri(e,"positionX",d)){u("positionX","top",`${t.positionX.value}px`,"layout-position-x")}if(void 0!==(null==(s=t.positionY)?void 0:s.value)&&Ri(e,"positionY",d)){u("positionY","left",`${null==(a=t.positionY)?void 0:a.value}px`,"layout-position-y")}if(void 0!==(null==(l=t.zIndex)?void 0:l.value)&&Ri(e,"zIndex",d)){u("zIndex","zIndex",`${t.zIndex.value}`,"layout-z-index")}return c}(e,t,i));break;case"size":Object.assign(n,function(e,t,i){var n,r,o,s,a,l;const c={},{filter:d}=i,u=Yi(e,c,i);if(void 0!==(null==(n=t.width)?void 0:n.value)&&Ri(e,"width",d)){const e=Ki(t.width.value,t.width.unit,Ui("size","width"));void 0!==e&&u("width","width",e,"size-width")}if(void 0!==(null==(r=t.height)?void 0:r.value)&&Ri(e,"height",d)){const e=Ki(t.height.value,t.height.unit,Ui("size","height"));void 0!==e&&u("height","height",e,"size-height")}if(void 0!==(null==(o=t.minWidth)?void 0:o.value)&&Ri(e,"minWidth",d)){const e=Ki(t.minWidth.value,t.minWidth.unit,Ui("size","minWidth"));void 0!==e&&u("minWidth","minWidth",e,"size-min-width")}if(void 0!==(null==(s=t.maxWidth)?void 0:s.value)&&Ri(e,"maxWidth",d)){const e=Ki(t.maxWidth.value,t.maxWidth.unit,Ui("size","maxWidth"));void 0!==e&&u("maxWidth","maxWidth",e,"size-max-width")}if(void 0!==(null==(a=t.minHeight)?void 0:a.value)&&Ri(e,"minHeight",d)){const e=Ki(t.minHeight.value,t.minHeight.unit,Ui("size","minHeight"));void 0!==e&&u("minHeight","minHeight",e,"size-min-height")}if(void 0!==(null==(l=t.maxHeight)?void 0:l.value)&&Ri(e,"maxHeight",d)){const e=Ki(t.maxHeight.value,t.maxHeight.unit,Ui("size","maxHeight"));void 0!==e&&u("maxHeight","maxHeight",e,"size-max-height")}return c}(e,t,i));break;case"spacing":Object.assign(n,function(e,t,i){var n,r,o,s;const a={},{filter:l}=i,c=Yi(e,a,i);if(void 0!==(null==(n=t.margin)?void 0:n.value)&&Ri(e,"margin",l)){c("margin","margin",Qi(t.margin.value,t.margin.unit,Ui("spacing","margin")??"px"),"spacing-margin")}if(void 0!==(null==(r=t.padding)?void 0:r.value)&&Ri(e,"padding",l)){c("padding","padding",Qi(t.padding.value,t.padding.unit,Ui("spacing","padding")??"px"),"spacing-padding")}for(const d of["marginTop","marginRight","marginBottom","marginLeft"])if(void 0!==(null==(o=t[d])?void 0:o.value)&&Ri(e,d,l)){const e=Ki(t[d].value,t[d].unit,Ui("spacing",d));void 0!==e&&c(d,d,e,`spacing-${d}`)}for(const d of["paddingTop","paddingRight","paddingBottom","paddingLeft"])if(void 0!==(null==(s=t[d])?void 0:s.value)&&Ri(e,d,l)){const e=Ki(t[d].value,t[d].unit,Ui("spacing",d));void 0!==e&&c(d,d,e,`spacing-${d}`)}return a}(e,t,i));break;case"typography":Object.assign(n,function(e,t,i){var n,r,o,s,a,l,c,d,u,h,p,g;const m={},{filter:v}=i,y=Yi(e,m,i);if(void 0!==(null==(n=t.fontFamily)?void 0:n.value)&&Ri(e,"fontFamily",v)){y("fontFamily","fontFamily",String(t.fontFamily.value),"typography-fontFamily")}if(void 0!==(null==(r=t.fontSize)?void 0:r.value)&&Ri(e,"fontSize",v)){const e=Ki(t.fontSize.value,t.fontSize.unit,Ui("typography","fontSize"));void 0!==e&&y("fontSize","fontSize",e,"typography-fontSize")}if(void 0!==(null==(o=t.fontWeight)?void 0:o.value)&&Ri(e,"fontWeight",v)){y("fontWeight","fontWeight",String(t.fontWeight.value),"typography-fontWeight")}if(void 0!==(null==(s=t.fontStyle)?void 0:s.value)&&Ri(e,"fontStyle",v)){y("fontStyle","fontStyle",String(t.fontStyle.value),"typography-fontStyle")}if(void 0!==(null==(a=t.lineHeight)?void 0:a.value)&&Ri(e,"lineHeight",v)){y("lineHeight","lineHeight",String(t.lineHeight.value),"typography-lineHeight")}if(void 0!==(null==(l=t.letterSpacing)?void 0:l.value)&&Ri(e,"letterSpacing",v)){const e=Ki(t.letterSpacing.value,t.letterSpacing.unit,Ui("typography","letterSpacing"));void 0!==e&&y("letterSpacing","letterSpacing",e,"typography-letterSpacing")}if(void 0!==(null==(c=t.textAlign)?void 0:c.value)&&Ri(e,"textAlign",v)){y("textAlign","textAlign",String(t.textAlign.value),"typography-textAlign")}if(void 0!==(null==(d=t.textDecoration)?void 0:d.value)&&Ri(e,"textDecoration",v)){y("textDecoration","textDecoration",String(t.textDecoration.value),"typography-textDecoration")}if(void 0!==(null==(u=t.textTransform)?void 0:u.value)&&Ri(e,"textTransform",v)){y("textTransform","textTransform",String(t.textTransform.value),"typography-textTransform")}if(void 0!==(null==(h=t.textShadow)?void 0:h.value)&&Ri(e,"textShadow",v)){y("textShadow","textShadow",String(t.textShadow.value),"typography-textShadow")}if(void 0!==(null==(p=t.whiteSpace)?void 0:p.value)&&Ri(e,"whiteSpace",v)){y("whiteSpace","whiteSpace",String(t.whiteSpace.value),"typography-whiteSpace")}if(void 0!==(null==(g=t.color)?void 0:g.value)&&Ri(e,"color",v)){y("color","color",String(t.color.value),"typography-color")}return m}(e,t,i));break;case"background":Object.assign(n,function(e,t,i){var n,r,o,s,a,l,c,d,u,h,p,g;const m={},{filter:v}=i,y=Yi(e,m,i);if(void 0!==(null==(n=t.backgroundColor)?void 0:n.value)&&Ri(e,"backgroundColor",v)){y("backgroundColor","backgroundColor",String(t.backgroundColor.value),"background-color")}if(void 0!==(null==(r=t.color)?void 0:r.value)&&Ri(e,"color",v)){y("color","backgroundColor",String(t.color.value),"background-color")}if(void 0!==(null==(o=t.backgroundImage)?void 0:o.value)&&Ri(e,"backgroundImage",v)){const e=Ji(t.backgroundImage.value);void 0!==e&&y("backgroundImage","backgroundImage",e,"background-image")}if(void 0!==(null==(s=t.image)?void 0:s.value)&&Ri(e,"image",v)){const e=Ji(t.image.value);void 0!==e&&y("image","backgroundImage",e,"background-image")}if(void 0!==(null==(a=t.backgroundSize)?void 0:a.value)&&Ri(e,"backgroundSize",v)){y("backgroundSize","backgroundSize",String(t.backgroundSize.value),"background-size")}if(void 0!==(null==(l=t.size)?void 0:l.value)&&Ri(e,"size",v)){y("size","backgroundSize",String(t.size.value),"background-size")}if(void 0!==(null==(c=t.backgroundRepeat)?void 0:c.value)&&Ri(e,"backgroundRepeat",v)){y("backgroundRepeat","backgroundRepeat",String(t.backgroundRepeat.value),"background-repeat")}if(void 0!==(null==(d=t.repeat)?void 0:d.value)&&Ri(e,"repeat",v)){y("repeat","backgroundRepeat",String(t.repeat.value),"background-repeat")}if(void 0!==(null==(u=t.backgroundPosition)?void 0:u.value)&&Ri(e,"backgroundPosition",v)){y("backgroundPosition","backgroundPosition",String(t.backgroundPosition.value),"background-position")}if(void 0!==(null==(h=t.position)?void 0:h.value)&&Ri(e,"position",v)){y("position","backgroundPosition",String(t.position.value),"background-position")}if(void 0!==(null==(p=t.boxShadow)?void 0:p.value)&&Ri(e,"boxShadow",v)){y("boxShadow","boxShadow",String(t.boxShadow.value),"background-box-shadow")}if(void 0!==(null==(g=t.backgroundBlendMode)?void 0:g.value)&&Ri(e,"backgroundBlendMode",v)){y("backgroundBlendMode","backgroundBlendMode",String(t.backgroundBlendMode.value),"background-blend-mode")}return m}(e,t,i));break;case"border":Object.assign(n,function(e,t,i){var n,r,o,s,a,l,c,d,u,h;const p={},{filter:g}=i,m=Yi(e,p,i);if(void 0!==(null==(n=t.borderWidth)?void 0:n.value)&&Ri(e,"borderWidth",g)){const e=Ki(t.borderWidth.value,t.borderWidth.unit,Ui("border","borderWidth"));void 0!==e&&m("borderWidth","borderWidth",e,"border-width")}if(void 0!==(null==(r=t.width)?void 0:r.value)&&Ri(e,"width",g)){const e=Ki(t.width.value,t.width.unit,Ui("border","borderWidth"));void 0!==e&&m("width","borderWidth",e,"border-width")}if(void 0!==(null==(o=t.borderStyle)?void 0:o.value)&&Ri(e,"borderStyle",g)){m("borderStyle","borderStyle",String(t.borderStyle.value),"border-style")}if(void 0!==(null==(s=t.style)?void 0:s.value)&&Ri(e,"style",g)){m("style","borderStyle",String(t.style.value),"border-style")}if(void 0!==(null==(a=t.borderColor)?void 0:a.value)&&Ri(e,"borderColor",g)){m("borderColor","borderColor",String(t.borderColor.value),"border-color")}if(void 0!==(null==(l=t.color)?void 0:l.value)&&Ri(e,"color",g)){m("color","borderColor",String(t.color.value),"border-color")}if(void 0!==(null==(c=t.borderRadius)?void 0:c.value)&&Ri(e,"borderRadius",g)){m("borderRadius","borderRadius",Zi(t.borderRadius.value,t.borderRadius.unit,Ui("border","borderRadius")??"px"),"border-radius")}if(void 0!==(null==(d=t.radius)?void 0:d.value)&&Ri(e,"radius",g)){m("radius","borderRadius",Zi(t.radius.value,t.radius.unit,Ui("border","borderRadius")??"px"),"border-radius")}for(const v of["borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth"])if(void 0!==(null==(u=t[v])?void 0:u.value)&&Ri(e,v,g)){const e=Ki(t[v].value,t[v].unit,Ui("border",v));void 0!==e&&m(v,v,e,`border-${v}`)}for(const v of["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"])if(void 0!==(null==(h=t[v])?void 0:h.value)&&Ri(e,v,g)){m(v,v,Zi(t[v].value,t[v].unit,Ui("border",v)??"px"),`border-${v}`)}return p}(e,t,i));break;case"svg":Object.assign(n,function(e,t,i){var n,r,o,s,a,l,c,d,u,h;const p={},{filter:g}=i,m=Yi(e,p,i);if(void 0!==(null==(n=t.stroke)?void 0:n.value)&&Ri(e,"stroke",g)){m("stroke","stroke",String(t.stroke.value),"svg-stroke")}if(void 0!==(null==(r=t.strokeWidth)?void 0:r.value)&&Ri(e,"strokeWidth",g)){const e=Ki(t.strokeWidth.value,t.strokeWidth.unit,Ui("svg","strokeWidth"));void 0!==e&&m("strokeWidth","strokeWidth",e,"svg-stroke-width")}if(void 0!==(null==(o=t.strokeLinecap)?void 0:o.value)&&Ri(e,"strokeLinecap",g)){m("strokeLinecap","strokeLinecap",String(t.strokeLinecap.value),"svg-stroke-linecap")}if(void 0!==(null==(s=t.strokeLinejoin)?void 0:s.value)&&Ri(e,"strokeLinejoin",g)){m("strokeLinejoin","strokeLinejoin",String(t.strokeLinejoin.value),"svg-stroke-linejoin")}if(void 0!==(null==(a=t.strokeDasharray)?void 0:a.value)&&Ri(e,"strokeDasharray",g)){m("strokeDasharray","strokeDasharray",String(t.strokeDasharray.value),"svg-stroke-dasharray")}if(void 0!==(null==(l=t.strokeDashoffset)?void 0:l.value)&&Ri(e,"strokeDashoffset",g)){const e=Ki(t.strokeDashoffset.value,t.strokeDashoffset.unit,Ui("svg","strokeDashoffset"));void 0!==e&&m("strokeDashoffset","strokeDashoffset",e,"svg-stroke-dashoffset")}if(void 0!==(null==(c=t.strokeMiterlimit)?void 0:c.value)&&Ri(e,"strokeMiterlimit",g)){m("strokeMiterlimit","strokeMiterlimit",String(t.strokeMiterlimit.value),"svg-stroke-miterlimit")}if(void 0!==(null==(d=t.strokeOpacity)?void 0:d.value)&&Ri(e,"strokeOpacity",g)){m("strokeOpacity","strokeOpacity",String(t.strokeOpacity.value),"svg-stroke-opacity")}if(void 0!==(null==(u=t.fill)?void 0:u.value)&&Ri(e,"fill",g)){m("fill","fill",String(t.fill.value),"svg-fill")}if(void 0!==(null==(h=t.fillOpacity)?void 0:h.value)&&Ri(e,"fillOpacity",g)){m("fillOpacity","fillOpacity",String(t.fillOpacity.value),"svg-fill-opacity")}return p}(e,t,i));break;case"flex":Object.assign(n,function(e,t,i){var n,r,o,s,a,l,c,d,u,h,p;const g={},{filter:m}=i,v=Yi(e,g,i);if(void 0!==(null==(n=t.flexDirection)?void 0:n.value)&&Ri(e,"flexDirection",m)){v("flexDirection","flexDirection",String(t.flexDirection.value),"flex-direction")}if(void 0!==(null==(r=t.direction)?void 0:r.value)&&Ri(e,"direction",m)){v("direction","flexDirection",String(t.direction.value),"flex-direction")}if(void 0!==(null==(o=t.justifyContent)?void 0:o.value)&&Ri(e,"justifyContent",m)){v("justifyContent","justifyContent",String(t.justifyContent.value),"flex-justify")}if(void 0!==(null==(s=t.justify)?void 0:s.value)&&Ri(e,"justify",m)){v("justify","justifyContent",String(t.justify.value),"flex-justify")}if(void 0!==(null==(a=t.alignItems)?void 0:a.value)&&Ri(e,"alignItems",m)){v("alignItems","alignItems",String(t.alignItems.value),"flex-align")}if(void 0!==(null==(l=t.align)?void 0:l.value)&&Ri(e,"align",m)){v("align","alignItems",String(t.align.value),"flex-align")}if(void 0!==(null==(c=t.flexWrap)?void 0:c.value)&&Ri(e,"flexWrap",m)){v("flexWrap","flexWrap",String(t.flexWrap.value),"flex-wrap")}if(void 0!==(null==(d=t.wrap)?void 0:d.value)&&Ri(e,"wrap",m)){v("wrap","flexWrap",String(t.wrap.value),"flex-wrap")}if(void 0!==(null==(u=t.gap)?void 0:u.value)&&Ri(e,"gap",m)){const e=Ki(t.gap.value,t.gap.unit,Ui("flex","gap"));void 0!==e&&v("gap","gap",e,"flex-gap")}if(void 0!==(null==(h=t.rowGap)?void 0:h.value)&&Ri(e,"rowGap",m)){const e=Ki(t.rowGap.value,t.rowGap.unit,Ui("flex","rowGap"));void 0!==e&&v("rowGap","rowGap",e,"flex-rowGap")}if(void 0!==(null==(p=t.columnGap)?void 0:p.value)&&Ri(e,"columnGap",m)){const e=Ki(t.columnGap.value,t.columnGap.unit,Ui("flex","columnGap"));void 0!==e&&v("columnGap","columnGap",e,"flex-columnGap")}return g}(e,t,i));break;case"effects":Object.assign(n,function(e,t,i){var n,r,o,s,a;const l={},{filter:c}=i,d=Yi(e,l,i);if(void 0!==(null==(n=t.opacity)?void 0:n.value)&&Ri(e,"opacity",c)){d("opacity","opacity",String(t.opacity.value),"effects-opacity")}if(void 0!==(null==(r=t.boxShadow)?void 0:r.value)&&Ri(e,"boxShadow",c)){d("boxShadow","boxShadow",String(t.boxShadow.value),"effects-boxShadow")}if(void 0!==(null==(o=t.transform)?void 0:o.value)&&Ri(e,"transform",c)){d("transform","transform",String(t.transform.value),"effects-transform")}if(void 0!==(null==(s=t.filter)?void 0:s.value)&&Ri(e,"filter",c)){d("filter","filter",String(t.filter.value),"effects-filter")}if(void 0!==(null==(a=t.rotate)?void 0:a.value)&&Ri(e,"rotate",c)){const e=Ki(t.rotate.value,t.rotate.unit,Ui("effects","rotate"));void 0!==e&&d("rotate","rotate",e,"effects-rotate")}return l}(e,t,i));break;case"echart":Object.assign(n,function(e,t,i){var n,r,o,s,a,l,c,d,u,h,p,g,m,v,y,b,f,k,x;const w={},{filter:S}=i,_=Yi(e,w,i);if(void 0!==(null==(n=t.lineColor)?void 0:n.value)&&Ri(e,"lineColor",S)){const e=String(t.lineColor.value).trim();e&&_("lineColor","echartLineColor",e,"echart-line-color")}if(void 0!==(null==(r=t.areaColor)?void 0:r.value)&&Ri(e,"areaColor",S)){const e=String(t.areaColor.value).trim();e&&_("areaColor","echartAreaColor",e,"echart-area-color")}if(void 0!==(null==(o=t.lineWidth)?void 0:o.value)&&Ri(e,"lineWidth",S)){const e=String(t.lineWidth.value).trim();e&&_("lineWidth","echartLineWidth",e,"echart-line-width")}if(void 0!==(null==(s=t.lineSymbol)?void 0:s.value)&&Ri(e,"lineSymbol",S)){const e=String(t.lineSymbol.value).trim();e&&_("lineSymbol","echartLineSymbol",e,"echart-line-symbol")}if(void 0!==(null==(a=t.lineSymbolSize)?void 0:a.value)&&Ri(e,"lineSymbolSize",S)){const e=String(t.lineSymbolSize.value).trim();e&&_("lineSymbolSize","echartLineSymbolSize",e,"echart-line-symbol-size")}if(void 0!==(null==(l=t.barColor)?void 0:l.value)&&Ri(e,"barColor",S)){const e=String(t.barColor.value).trim();e&&_("barColor","echartBarColor",e,"echart-bar-color")}if(void 0!==(null==(c=t.barBorderRadius)?void 0:c.value)&&Ri(e,"barBorderRadius",S)){const e=String(t.barBorderRadius.value).trim();e&&_("barBorderRadius","echartBarBorderRadius",e,"echart-bar-border-radius")}if(void 0!==(null==(d=t.pieSliceColor)?void 0:d.value)&&Ri(e,"pieSliceColor",S)){const e=String(t.pieSliceColor.value).trim();e&&_("pieSliceColor","echartPieSliceColor",e,"echart-pie-slice-color")}if(void 0!==(null==(u=t.pieSliceBorderRadius)?void 0:u.value)&&Ri(e,"pieSliceBorderRadius",S)){const e=String(t.pieSliceBorderRadius.value).trim();e&&_("pieSliceBorderRadius","echartPieSliceBorderRadius",e,"echart-pie-slice-border-radius")}void 0!==(null==(h=t.pieLabelShow)?void 0:h.value)&&Ri(e,"pieLabelShow",S)&&_("pieLabelShow","echartPieLabelShow",String(t.pieLabelShow.value),"echart-pie-label-show");if(void 0!==(null==(p=t.pieLabelPosition)?void 0:p.value)&&Ri(e,"pieLabelPosition",S)){const e=String(t.pieLabelPosition.value).trim();e&&_("pieLabelPosition","echartPieLabelPosition",e,"echart-pie-label-position")}void 0!==(null==(g=t.pieLabelLineShow)?void 0:g.value)&&Ri(e,"pieLabelLineShow",S)&&_("pieLabelLineShow","echartPieLabelLineShow",String(t.pieLabelLineShow.value),"echart-pie-label-line-show");if(void 0!==(null==(m=t.pieLabelLineLength)?void 0:m.value)&&Ri(e,"pieLabelLineLength",S)){const e=String(t.pieLabelLineLength.value).trim();e&&_("pieLabelLineLength","echartPieLabelLineLength",e,"echart-pie-label-line-length")}if(void 0!==(null==(v=t.pieLabelLineLength2)?void 0:v.value)&&Ri(e,"pieLabelLineLength2",S)){const e=String(t.pieLabelLineLength2.value).trim();e&&_("pieLabelLineLength2","echartPieLabelLineLength2",e,"echart-pie-label-line-length2")}void 0!==(null==(y=t.pieLabelLineSmooth)?void 0:y.value)&&Ri(e,"pieLabelLineSmooth",S)&&_("pieLabelLineSmooth","echartPieLabelLineSmooth",String(t.pieLabelLineSmooth.value),"echart-pie-label-line-smooth");if(void 0!==(null==(b=t.pieLabelLineColor)?void 0:b.value)&&Ri(e,"pieLabelLineColor",S)){const e=String(t.pieLabelLineColor.value).trim();e&&_("pieLabelLineColor","echartPieLabelLineColor",e,"echart-pie-label-line-color")}if(void 0!==(null==(f=t.pieLabelLineWidth)?void 0:f.value)&&Ri(e,"pieLabelLineWidth",S)){const e=String(t.pieLabelLineWidth.value).trim();e&&_("pieLabelLineWidth","echartPieLabelLineWidth",e,"echart-pie-label-line-width")}if(void 0!==(null==(k=t.legendIcon)?void 0:k.value)&&Ri(e,"legendIcon",S)){const e=String(t.legendIcon.value).trim();e&&_("legendIcon","echartLegendIcon",e,"echart-legend-icon")}if(void 0!==(null==(x=t.legendIconSize)?void 0:x.value)&&Ri(e,"legendIconSize",S)){const e=String(t.legendIconSize.value).trim();e&&_("legendIconSize","echartLegendIconSize",e,"echart-legend-icon-size")}return w}(e,t,i));break;default:Object.assign(n,function(e,t,i){const n={},{filter:r}=i,o=Yi(e,n,i);for(const[s,a]of Object.entries(t)){if(void 0===(null==a?void 0:a.value))continue;if(!Ri(e,s,r))continue;o(s,s,String(a.value),`${e}-${s}`)}return n}(e,t,i))}return n}function Xi(e,t,i={}){if(!t||void 0===t.value)return;const n=function(e,t,i){if(null==t)return;const n=function(e){return ji[e]}(e);switch(e){case"margin":case"padding":return Qi(t,i,n??"px");case"borderRadius":case"radius":return Zi(t,i,n??"px");case"fontSize":case"letterSpacing":case"borderWidth":case"borderTopWidth":case"borderRightWidth":case"borderBottomWidth":case"borderLeftWidth":case"width":case"height":case"minWidth":case"maxWidth":case"minHeight":case"maxHeight":case"rowGap":case"columnGap":case"gap":case"rotate":return Ki(t,i,n)??String(t);case"backgroundImage":case"image":return Ji(t);default:return String(t)}}(e,t.value,t.unit);return void 0!==n?i.useCSSVar&&i.varName?`var(${i.varName}, ${n})`:n:void 0}function Yi(e,t,i){const n=i.outputMode,r=n?n.varPrefix??i.varPrefix??"block":i.varPrefix;return(n,o,s,a)=>{const l=function(e,t,i){const n=i.outputMode;return n?Ri(e,t,n.filter)?n.mode:"properties"===n.mode?"vars":"properties":null}(e,n,i);if("vars"===l)return r?void(t[`--${r}-${a}`]=s):void(t[o]=s);"properties"!==l&&i.useCSSVars?t[o]=`var(--${i.varPrefix}-${a}, ${s})`:t[o]=s}}function Ki(e,t,i){if(null==e)return;if("string"==typeof e)return e;const n=t??i;return n?"auto"===n||"none"===n?n:`${e}${n}`:String(e)}function Qi(e,t,i="px"){if("string"==typeof e)return e;const n=t??i;return"auto"===n||"none"===n?n:"number"==typeof e?`${e}${n}`:`${e.top||0}${n} ${e.right||0}${n} ${e.bottom||0}${n} ${e.left||0}${n}`}function Zi(e,t,i="px"){if("string"==typeof e)return e;const n=t??i;return"auto"===n||"none"===n?n:"number"==typeof e?`${e}${n}`:"object"==typeof e?`${e.topLeft||0}${n} ${e.topRight||0}${n} ${e.bottomRight||0}${n} ${e.bottomLeft||0}${n}`:String(e)}function Ji(e){if(null==e)return;const t=String(e).trim();if(!t)return;const i=t.match(/^url\((.*)\)$/i);let n=t;if(i&&(n=i[1].trim(),(n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'"))&&(n=n.slice(1,-1))),yt(n)){const e=St(n);return e?`url(${e})`:i?t:`url(${n})`}const r=t.toLowerCase();return"none"===r||r.startsWith("url(")||r.startsWith("var(")||r.startsWith("image-set(")||r.includes("gradient(")?t:`url(${t})`}const en=e("style-resolver");var tn=Object.defineProperty,nn=Object.getOwnPropertyDescriptor,rn=(e,t,i,n)=>{for(var r,o=n>1?void 0:n?nn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&tn(t,i,o),o};let on=class extends Li{get isBlockContainer(){return!0}static getBlockConfig(){return{sinceVersion:"1.0.0",definition:{label:"Container",icon:'<ha-icon icon="mdi:contain"></ha-icon>',category:"layout"},defaults:{},entityDefaults:{mode:"inherited"}}}getPanelConfig(){return{targetStyles:{block:{styles:{preset:"layout"}}}}}getDropZoneResolvedStyleData(e){const t=this.documentModel.resolveEntityForBlock(this.block.id),i=this.renderer.resolveBlockStyles(this.block,this.activeContainerId,{defaultEntityId:t.entityId}),{flex:n}=i??{};return{flex:n}}updated(e){super.updated(e),e.has("block")&&this.block&&(this._ensureDropZone(),this._updateDropZones())}render(){if(!this.block||0===this.block.children.length)return h``;const e=this._getDropZone();return h`
            <div class="container">
                <div class="container-slot">
                    ${this.renderer.renderBlock(e)}
                </div>
            </div>
        `}getBlockedDropInstructions(){return["combine"]}_getDropZone(){return this._getDropZones()[0]??void 0}_ensureDropZone(){if(!this.block)return;if(!this._getDropZone()){const e=this.documentModel.createBlock("block-drop-zone",this.blockId,this.blockRegistry.getDefaults("block-drop-zone"),{label:"Content",isHidden:!0});this.block.children=[e.id]}}};on.styles=[...dt.styles,l`
            .container {
                display: flex;
            }
            .container-slot {
                width: 100%;
            }
        `],rn([n({context:Bi})],on.prototype,"blockRegistry",2),on=rn([p("block-container")],on);var sn=Object.getOwnPropertyDescriptor;const an={groups:["background","border","flex"],properties:["layout.display","spacing.padding"]};let ln=class extends dt{get isBlockDraggable(){return!1}get isBlockContainer(){return!0}shouldShowDropIndicator(){var e;const t=this.documentModel.getBlock(this.blockId)??this.block;return((null==(e=null==t?void 0:t.children)?void 0:e.length)??0)>0}static getBlockConfig(){return{sinceVersion:"1.0.0",definition:{label:"Drop Zone",icon:'<ha-icon icon="mdi:download-box-outline"></ha-icon>',internal:!0},defaults:{canBeDeleted:!1,canBeDuplicated:!1,canChangeLayoutMode:!1},entityDefaults:{mode:"inherited"}}}getPanelConfig(){return{targetStyles:{block:{styles:this._getParentStyleConfig()??an}}}}render(){var e;const t=(null==(e=this.block)?void 0:e.children)||[],i=t.length>0,n=t.map(e=>this.documentModel.getBlock(e)).filter(e=>!!e);return h`
            ${i?y(n,e=>e.id,e=>this.renderer.renderBlock(e)):h`
                        <div class="empty-state">
                            <div class="empty-state-message">
                                Drop Blocks Here
                            </div>
                        </div>`}
        `}getBlockedDropInstructions(){const e=this.documentModel.getBlock(this.blockId),t=this.documentModel.getBlock(e.parentId),i=this.documentModel.getElement(t),n=(null==i?void 0:i.getBlockedDropInstructions())??null;return n&&n.includes("combine")?["reorder-before","reorder-after"]:null}getResolvedContextStyles(){var e;const t=this.documentModel.getBlock(this.blockId)??this.block,i=null==t?void 0:t.parentId,n=this.documentModel.getElement(i),r=null==(e=null==n?void 0:n.getDropZoneResolvedStyleData)?void 0:e.call(n,this.block);return r?Hi(r):this.resolvedRenderContext.styles}_getParentStyleConfig(){var e;const t=this.documentModel.getBlock(this.blockId)??this.block,i=null==t?void 0:t.parentId;if(!i)return;const n=this.documentModel.getElement(i);return null==(e=null==n?void 0:n.getDropZoneStyleConfig)?void 0:e.call(n)}};ln.styles=[...dt.styles,l`
            :host {
                display: flex;
                flex-direction: column;
                flex: 1;
                min-height: 1px;
                padding: 0;
                width: 100%;
                height: 100%;
                position: relative;
            }

            /* Empty state - shown only when no children */

            .empty-state {
                min-height: 40px;
                height: 100%;
                padding: 4px;
            }

            .empty-state-message {
                display: flex;
                align-items: center;
                justify-content: center;
                color: black;
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
                background: rgba(0, 0, 0, 0.2);
                text-align: center;
                box-sizing: border-box;
                height: 100%;
            }
        `],ln=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?sn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-drop-zone")],ln);var cn=Object.defineProperty,dn=Object.getOwnPropertyDescriptor,un=(e,t,i,n)=>{for(var r,o=n>1?void 0:n?dn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&cn(t,i,o),o};let hn=class extends Li{constructor(){super(...arguments),this._resizeState=null,this._resizeHandleIndex=null,this._handleResizeMove=e=>{if(!this._resizeState||!this.block)return;const t=(e.clientX-this._resizeState.startX)/this._resizeState.containerWidth*100;let i=this._resizeState.startLeft+t,n=this._resizeState.totalPair-i;i<1?(i=1,n=this._resizeState.totalPair-i):n<1&&(n=1,i=this._resizeState.totalPair-n),this._setDropZoneWidthsPercent([{zoneId:this._resizeState.leftId,width:i},{zoneId:this._resizeState.rightId,width:n}]),this._resizeState.currentLeft=i,this._resizeState.currentRight=n,this.requestUpdate()},this._handleResizeEnd=e=>{if(this._resizeState){const t=e.target;(null==t?void 0:t.releasePointerCapture)&&t.releasePointerCapture(e.pointerId)}this._resizeState=null,this._resizeHandleIndex=null,this.requestUpdate(),window.removeEventListener("pointermove",this._handleResizeMove),window.removeEventListener("pointerup",this._handleResizeEnd),window.removeEventListener("pointercancel",this._handleResizeEnd)}}get isBlockContainer(){return!0}static getBlockConfig(){return{sinceVersion:"1.0.0",definition:{label:"Columns",icon:'<ha-icon icon="mdi:view-column-outline"></ha-icon>',category:"layout"},defaults:{props:{columns:{value:2},gap:{value:0}}},entityDefaults:{mode:"inherited"}}}getPanelConfig(){return{properties:{groups:[{id:"layout",label:"Layout",traits:[{type:"number",name:"columns",label:"Columns",min:2,max:12},{type:"number",name:"gap",label:"Gap",min:0,max:100}]}]},targetStyles:{block:{styles:{preset:"layout",exclude:{properties:["flex.flexDirection"]}}}}}}getDropZoneStyleConfig(){return{...an,properties:["size.width","spacing.padding"]}}getDropZoneResolvedStyleData(e){const t={defaultEntityId:this.documentModel.resolveEntityForBlock(e.id).entityId},i=this.renderer.resolveBlockStyles(e,this.activeContainerId,t),{size:n,...r}=i??{};return r}updated(e){var t;if(super.updated(e),e.has("block")&&this.block){const i=e.get("block"),n=this.resolvePropertyAsNumber("columns",2),r=this.resolveRawValueAsNumber(null==(t=null==i?void 0:i.props)?void 0:t.columns,0);if(!i||r!==n){this._ensureDropZones();const e=this._getDropZones();i&&r!==n&&this._resetDropZoneWidths(e,n)}this._updateDropZones()}}render(){var e;const t=this.resolvePropertyAsNumber("gap",0),i=((null==(e=this.block)?void 0:e.children)||[]).map(e=>this.documentModel.getBlock(e)).filter(e=>!!e),n=Hi(this.resolvedRenderContext.resolved,{filter:{only:{categories:["flex"]}},append:{"--columns-gap":`${t}px`}}),r=0===i.length||!i.every(e=>{var t;return null==(t=e.children)?void 0:t.length}),o=i.length>0?100/i.length:0,s=this._resizeState&&this._resizeState.index<i.length-1?(()=>{const e=i.map(e=>this._getDropZoneWidthPercent(e,o)).slice(0,this._resizeState.index).reduce((e,t)=>e+t,0),t=`${this._formatPercent(this._resizeState.currentLeft)}%`,n=`${this._formatPercent(this._resizeState.currentRight)}%`;return h`
                    <div
                            class="column-resize-overlay"
                            style=${u({left:`${e}%`,width:`${this._resizeState.currentLeft}%`})}
                    >
                        <div class="column-resize-overlay__label">${t}</div>
                    </div>
                    <div
                            class="column-resize-overlay"
                            style=${u({left:`${e+this._resizeState.currentLeft}%`,width:`${this._resizeState.currentRight}%`})}
                    >
                        <div class="column-resize-overlay__label">${n}</div>
                    </div>
                `})():null;return h`
            <div class="content ${r?"empty-state":""}" style="${u(n)}">
                ${y(i,e=>e.id,(e,t)=>{const n=this.documentModel.resolveEntityForBlock(e.id),r=this.renderer.resolveBlockStyles(e,this.activeContainerId,{defaultEntityId:n.entityId}),{size:o}=r??{},s=Hi({size:o}??{}),a=t<i.length-1,l=this._resizeHandleIndex===t;return h`
                        <div class="column-slot" style=${u(s)}>
                            ${a?h`
                                <div
                                    class="column-resize-handle ${l?"active":""}"
                                    @pointerdown=${e=>this._handleResizeStart(e,t)}
                                ></div>
                            `:null}
                            ${this.renderer.renderBlock(e)}
                        </div>
                    `})}
                ${s}
            </div>
        `}getBlockedDropInstructions(){return["combine"]}_getConfiguredContainerIds(e){var t,i;const n=new Set;n.add(this.containerManager.getDefaultContainerId());for(const r of e){const e=null==(i=null==(t=r.styles)?void 0:t.block)?void 0:i.containers;if(e)for(const t of Object.keys(e))n.add(t)}return Array.from(n)}_resetDropZoneWidths(e,t){var i,n,r;const o=t>0?100/t:0,s=this._getConfiguredContainerIds(e);for(const a of e){const e={};for(const c of s){const t={...(null==(r=null==(n=null==(i=a.styles)?void 0:i.block)?void 0:n.containers)?void 0:r[c])||{}},s={...t.size||{}};s.width={value:this._roundPercent(o),unit:"%"},t.size=s,e[c]=t}const t={...a.styles||{}},l={...t.block||{}};l.containers=e,t.block=l,this.documentModel.updateBlock(a.id,{styles:t})}}_roundPercent(e){return Math.round(1e3*e)/1e3}_formatPercent(e){return e.toFixed(1)}_getDropZoneWidthPercent(e,t){var i;const n=this.documentModel.resolveEntityForBlock(e.id),r=null==(i=this.renderer.resolveBlockStyles(e,this.activeContainerId,{defaultEntityId:n.entityId}).size)?void 0:i.width;if(r){if("%"===r.unit&&"number"==typeof r.value)return r.value;if("string"==typeof r.value&&r.value.endsWith("%")){const e=parseFloat(r.value);if(!Number.isNaN(e))return e}}return t}_setDropZoneWidthsPercent(e){var t,i,n;const r=this.activeContainerId;for(const o of e){const e=this.documentModel.getBlock(o.zoneId);if(!e)continue;const s={...(null==(n=null==(i=null==(t=e.styles)?void 0:t.block)?void 0:i.containers)?void 0:n[r])||{}},a={...s.size||{}};a.width={value:this._roundPercent(o.width),unit:"%"},s.size=a;const l={...e.styles||{}},c={...l.block||{}},d={...c.containers||{}};d[r]=s,c.containers=d,l.block=c,this.documentModel.updateBlock(e.id,{styles:l})}}_handleResizeStart(e,t){var i;if(!this.block||!this.selected)return;const n=null==(i=this.renderRoot)?void 0:i.querySelector(".content");if(!n)return;const r=n.getBoundingClientRect();if(r.width<=0)return;e.preventDefault(),e.stopPropagation();const o=this._getDropZones();if(t<0||t>=o.length-1)return;const s=o.length>0?100/o.length:0,a=o[t],l=o[t+1],c=this._getDropZoneWidthPercent(a,s),d=this._getDropZoneWidthPercent(l,s);this._resizeState={index:t,startX:e.clientX,containerWidth:r.width,startLeft:c,startRight:d,totalPair:c+d,leftId:a.id,rightId:l.id,currentLeft:c,currentRight:d},this._resizeHandleIndex=t,this.requestUpdate();const u=e.currentTarget;(null==u?void 0:u.setPointerCapture)&&u.setPointerCapture(e.pointerId),window.addEventListener("pointermove",this._handleResizeMove),window.addEventListener("pointerup",this._handleResizeEnd),window.addEventListener("pointercancel",this._handleResizeEnd)}_ensureDropZones(){if(!this.block)return;const e=this.resolvePropertyAsNumber("columns",2),t=this.block.children||[];if(t.length<e){const i=e-t.length,n=t.length,r={};r[this.activeContainerId]={size:{width:{value:this._roundPercent(100/e),unit:"%"}}};for(let e=0;e<i;e++)this.documentModel.createBlock("block-drop-zone",this.blockId,this.blockRegistry.getDefaults("block-drop-zone"),{label:`Column ${n+e+1}`,props:{columnIndex:n+e},styles:{block:{containers:r}}})}else if(t.length>e){t.slice(e).forEach(e=>this.documentModel.deleteBlock(e,!0))}const i=this.documentModel.getBlock(this.block.id);(null==i?void 0:i.children)&&i.children.forEach((e,t)=>{const i=this.documentModel.getBlock(e);if(!i)return;i.props.columnIndex!==t&&this.documentModel.updateBlock(e,{props:{...i.props||{},columnIndex:t}})})}};hn.styles=[...dt.styles,l`
            .content {
                display: flex;
                flex-direction: row;
                gap: var(--columns-gap, 0);
                position: relative;
                height: 100%;
            }

            .column-slot {
                display: flex;
                flex-direction: column;
                min-width: 0;
                position: relative;
            }

            .column-resize-handle {
                position: absolute;
                top: 0;
                right: calc(min(var(--columns-gap, 0px), 5px) / -2);
                width: 10px;
                height: 100%;
                cursor: col-resize;
                touch-action: none;
                z-index: 200;
                pointer-events: none;
            }

            .column-resize-handle::before {
                content: '';
                position: absolute;
                left: 100%;
                top: 0;
                width: 2px;
                height: 100%;
                background: var(--accent-color, #ddd);
                opacity: 0;
                transform: translateX(-50%);
            }

            :host(.block-selected) .column-resize-handle {
                pointer-events: auto;
            }

            :host(.block-selected) .column-resize-handle:hover::before,
            :host(.block-selected) .column-resize-handle.active::before {
                opacity: 1;
            }

            .column-resize-overlay {
                position: absolute;
                top: 0;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.08);
                pointer-events: none;
                z-index: 250;
            }

            .column-resize-overlay__label {
                padding: 6px 10px;
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.9);
                border: 1px solid rgba(0, 0, 0, 0.08);
                font-size: 12px;
                font-weight: 600;
                color: var(--primary-text-color, #111);
            }

            :host(.block-selected) .content {
                box-shadow: 0 0 1px 1px var(--border-color, #ddd);
            }
        `],un([n({context:Bi})],hn.prototype,"blockRegistry",2),hn=un([p("block-columns")],hn);var pn=Object.defineProperty,gn=Object.getOwnPropertyDescriptor,mn=(e,t,i,n)=>{for(var r,o=n>1?void 0:n?gn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&pn(t,i,o),o};const vn={rows:2,columns:2,rowSizes:[{value:1,unit:"fr"},{value:1,unit:"fr"}],columnSizes:[{value:1,unit:"fr"},{value:1,unit:"fr"}],areas:[],gap:{row:0,column:0}};let yn=class extends Li{constructor(){super(...arguments),this._onBlockUpdated=e=>{const t=e.detail,i=t.block;"block-drop-zone"===i.type&&i.parentId===this.block.id&&this._handleDropZoneLabelUpdate(t.block)}}get isBlockContainer(){return!0}static getBlockConfig(){return{sinceVersion:"1.0.0",definition:{label:"Grid",icon:'<ha-icon icon="mdi:grid"></ha-icon>',category:"layout"},defaults:{props:{gridConfig:{...vn}}},entityDefaults:{mode:"inherited"}}}getPanelConfig(){return{properties:{groups:[{id:"grid-editor",label:"Grid Layout",traits:[{type:"action",name:"editGrid",label:"Grid Editor",buttonLabel:"Edit Grid Layout",actionId:"open-grid-editor",icon:"⊞"},{type:"info",name:"gridInfo",label:"Grid Info",description:"Configure grid rows, columns and areas"}]}]},targetStyles:{block:{styles:{preset:"layout"}}}}}connectedCallback(){super.connectedCallback(),this.documentModel.addEventListener("block-updated",this._onBlockUpdated)}disconnectedCallback(){this.documentModel.removeEventListener("block-updated",this._onBlockUpdated),super.disconnectedCallback()}updated(e){super.updated(e),e.has("block")&&this.block&&(this._ensureDropZones(),this._updateDropZones())}render(){var e,t;const i=(null==(e=this.block)?void 0:e.props.gridConfig)||vn,n=((null==(t=this.block)?void 0:t.children)||[]).map(e=>this.documentModel.getBlock(e)).filter(e=>!!e),r=0===n.length||!n.every(e=>{var t;return null==(t=e.children)?void 0:t.length}),o={gridTemplateRows:Mt(i.rowSizes),gridTemplateColumns:Mt(i.columnSizes),gap:`${i.gap.row}px ${i.gap.column}px`};if(i.areas.length>0){const e=function(e,t,i){if(0===e.length)return"";const n=[];for(let r=0;r<t;r++){n[r]=[];for(let e=0;e<i;e++)n[r][e]="."}return e.forEach(e=>{for(let r=e.rowStart;r<e.rowEnd;r++)for(let o=e.columnStart;o<e.columnEnd;o++)r<t&&o<i&&(n[r][o]=e.id)}),n.map(e=>`"${e.join(" ")}"`).join("\n    ")}(i.areas,i.rows,i.columns);e&&(o.gridTemplateAreas=e)}return h`
      <div class="grid-content ${r?"empty-state":""}" style=${u(o)}>
        ${y(n,e=>e.id,e=>{const t={gridArea:e.props.areaId||e.props.gridArea};return h`
              <div class="grid-zone" style=${u(t)}>
                ${this.renderer.renderBlock(e)}
              </div>
            `})}
      </div>
    `}getBlockedDropInstructions(){return["combine"]}_ensureDropZones(){const e=this.block.props.gridConfig||vn,t=e.areas||[],i=t.length>0?t.length:e.rows*e.columns,n=this.block.children||[];if(n.length<i){const r=i-n.length;for(let i=0;i<r;i++){const n=i,r={zoneIndex:n};let o=`Grid Area ${n+1}`;const s=t.length>0?t[n]:void 0;if(s)r.areaName=s.name,r.gridArea=s.name,o=s.name;else{const t=Math.floor(n/e.columns),i=n%e.columns;r.row=t,r.column=i,r.gridArea=`${t+1} / ${i+1} / span 1 / span 1`}this.documentModel.createBlock("block-drop-zone",this.blockId,this.blockRegistry.getDefaults("block-drop-zone"),{label:o,props:r})}}else if(n.length>i){n.slice(i).forEach(e=>this.documentModel.deleteBlock(e,!0))}n.forEach((i,n)=>{const r=this.documentModel.getBlock(i);if(!r)return;const o={zoneIndex:n},s=t.length>0?t[n]:void 0;if(s)o.areaId=s.id,o.areaName=s.name,o.gridArea=s.name;else{const t=Math.floor(n/e.columns),i=n%e.columns;o.areaId=void 0,o.areaName=void 0,o.row=t,o.column=i,o.gridArea=`${t+1} / ${i+1} / span 1 / span 1`}const a=Object.keys(o).some(e=>r.props[e]!==o[e]),l=s&&r.label!==s.name;if(a||l){const e={};a&&(e.props=o),l&&(e.label=null==s?void 0:s.name),this.documentModel.updateBlock(i,e)}})}_handleDropZoneLabelUpdate(e){var t;const i=this.block.props.gridConfig||vn;if(!i.areas.length)return;const n="number"==typeof e.props.zoneIndex?e.props.zoneIndex:this.block.children.indexOf(e.id);if(n<0||n>=i.areas.length)return;const r=null==(t=e.label)?void 0:t.trim();if(!r)return;const o=i.areas[n];if(!o||o.name===r)return;const s=i.areas.map((e,t)=>t===n?{...e,name:r}:e);this.documentModel.updateBlock(this.block.id,{props:{gridConfig:{...i,areas:s}}})}};yn.styles=[...dt.styles,l`
            .grid-content {
                display: grid;
            }

            .grid-zone {
                display: flex;
                flex-direction: column;
                min-width: 0;
                min-height: 0;
                position: relative;
            }
        `],mn([n({context:Bi})],yn.prototype,"blockRegistry",2),yn=mn([p("block-grid")],yn);const bn={type:"line"};function fn(e){return Number.isNaN(e)?0:Math.min(100,Math.max(0,e))}function kn(e,t){const i=Math.max(0,e.length-1),n=(t||[]).slice(0,i).map(e=>({...e}));for(;n.length<i;)n.push({...bn});return n}function xn(e){return{...e,x:fn(e.x),y:fn(e.y)}}const wn={showGrid:!1,snapToGrid:!1,snapToPoints:!1,snapToBlocks:!1,showPoints:!0};function Sn(e){return{...wn,...e??{}}}const _n=e("link-editor-preferences");class Tn{constructor(e){this.activeLinkId=null,this.linkElement=null,this.drawListenersAttached=!1,this.pickListenerAttached=!1,this.attachRetryHandle=null,this.dragListenersAttached=!1,this.dragging=null,this.snapGuideBlockId=null,this.preferences={...wn},this.snapBlocksCache=null,this.pathDragging=null,this._handleLinkModeChanged=e=>{const t=e.detail;this._applyState((null==t?void 0:t.state)??{enabled:!1,mode:"idle",activeLinkId:null})},this._handleLinkSelectionChanged=e=>{const t=e.detail;this._syncAnchorHighlight((null==t?void 0:t.selection)??null)},this._handleBlockDeleted=e=>{const t=e.detail;(null==t?void 0:t.blockId)&&(this.activeLinkId&&t.blockId===this.activeLinkId&&this.closeEditor(),this._cleanupAnchorsForDeletedBlock(t.blockId))},this._handleLinkPointerDown=e=>{if(!this.state.enabled||"draw"!==this.state.mode||!this.activeLinkId)return;if(0!==e.button)return;if(!this.linkElement)return;const t=this._getNormalizedFromEvent(e,this.linkElement);if(!t)return;const i=this._getConnectedPointIdsForDraw(this.activeLinkId),n=this._applySnapping(this.activeLinkId,t,{connectedPointIds:i});this._emitSnapGuide(this.activeLinkId,n.guide),this._addPoint(this.activeLinkId,n.point),this.documentModel.select(this.activeLinkId),e.stopPropagation(),e.preventDefault()},this._handleLinkPointerMove=e=>{if(!this.state.enabled||"draw"!==this.state.mode||!this.activeLinkId)return;if(!this.linkElement)return;const t=this._getNormalizedFromEvent(e,this.linkElement);if(!t)return;const i=this._getConnectedPointIdsForDraw(this.activeLinkId),n=this._applySnapping(this.activeLinkId,t,{connectedPointIds:i});this._emitSnapGuide(this.activeLinkId,n.guide),this.eventBus.dispatchEvent("link-preview-move",{blockId:this.activeLinkId,point:n.point})},this._handleLinkPointerLeave=()=>{this.state.enabled&&"draw"===this.state.mode&&(this.eventBus.dispatchEvent("link-preview-clear",{blockId:this.activeLinkId??void 0}),this._clearSnapGuide())},this._handleLinkContextMenu=e=>{this.state.enabled&&"draw"===this.state.mode&&(e.preventDefault(),e.stopPropagation(),this._finishDrawing())},this._handlePickAnchor=e=>{if(!this.state.enabled||"pick-anchor"!==this.state.mode)return;if(0!==e.button)return e.stopPropagation(),void e.preventDefault();if(!this.activeLinkId||!this.state.anchorPickPointId)return e.stopPropagation(),void e.preventDefault();const t=this._getBlockIdFromEvent(e);if(!t||t===this.activeLinkId)return e.stopPropagation(),void e.preventDefault();this._applyAnchorPick(this.activeLinkId,this.state.anchorPickPointId,t),this.documentModel.setLinkModeState({mode:"edit",anchorPickPointId:null}),e.stopPropagation(),e.preventDefault()},this._handleDragMove=e=>{if(this.pathDragging){const{blockId:t,start:i,points:n,startClient:r}=this.pathDragging;if(!this._isEditingActive(t)||"edit"!==this.state.mode)return void(this.pathDragging=null);const o=this._getNormalizedFromEventForLink(t,e);if(!o)return;const s=Math.hypot(e.clientX-r.x,e.clientY-r.y);if(!this.pathDragging.moved){if(s<3)return;this.pathDragging.moved=!0}const a={x:o.x-i.x,y:o.y-i.y},l=this._applyDeltaToPoints(t,n,a);return void this._updateGeometry(t,l)}if(!this.dragging)return;const{blockId:t,pointId:i,handle:n}=this.dragging;if(!this._isEditingActive(t))return void this._endDrag();const r=this._getNormalizedFromEventForLink(t,e);if(!r)return;if(!n){const e=this._applySnapping(t,r,{excludePointId:i,currentPointId:i});return this._emitSnapGuide(t,e.guide),void this._updatePointPosition(t,i,e.point)}const o=this._applySnapping(t,r,{includeHandles:!0,excludeHandle:{pointId:i,handle:n},currentPointId:i});this._emitSnapGuide(t,o.guide),this._updateHandlePosition(t,i,n,o.point)},this._handleDragEnd=()=>{this.pathDragging&&!this.pathDragging.moved&&this._selectSegmentAtPoint(this.pathDragging.blockId,this.pathDragging.start),this._endDrag(),this.pathDragging=null,this._clearSnapGuide()},this.documentModel=e.documentModel,this.eventBus=e.eventBus,this.blockRegistry=e.blockRegistry,e.preferences&&(this.preferences={...e.preferences}),this.state=this.documentModel.getLinkModeState(),this.activeLinkId=this.state.activeLinkId??null,this.documentModel.addEventListener("link-mode-changed",this._handleLinkModeChanged),this.documentModel.addEventListener("block-deleted",this._handleBlockDeleted),this.documentModel.addEventListener("link-editor-selection-changed",this._handleLinkSelectionChanged),this._applyState(this.state)}destroy(){this.documentModel.removeEventListener("link-mode-changed",this._handleLinkModeChanged),this.documentModel.removeEventListener("block-deleted",this._handleBlockDeleted),this.documentModel.removeEventListener("link-editor-selection-changed",this._handleLinkSelectionChanged),this._detachDrawListeners(),this._detachPickListener(),this._detachOutsideListener(),this._detachDragListeners(),this._cancelLinkElementRetry(),this.eventBus.dispatchEvent("link-preview-clear",{blockId:this.activeLinkId??void 0}),this._clearSnapGuide(),this.documentModel.setLinkAnchorHighlight(null)}setPreferences(e){this.preferences={...e}}toggleLinkMode(){this.state.enabled?this.closeEditor():this.startNewLink()}startNewLink(){const e=this._createLinkBlock();e&&(this.documentModel.select(e.id),this.documentModel.setLinkModeState({enabled:!0,mode:"draw",activeLinkId:e.id,anchorPickPointId:null}),this.documentModel.setLinkEditorSelection({blockId:e.id,pointId:null,segmentIndex:null,handle:null}),this.eventBus.dispatchEvent("link-editor-open",{blockId:e.id}))}openEditor(e){const t=this.documentModel.getBlock(e);t&&"block-link"===t.type&&(this.documentModel.select(e),this.documentModel.setLinkModeState({enabled:!0,mode:"edit",activeLinkId:e,anchorPickPointId:null}),this.documentModel.setLinkEditorSelection({blockId:e,pointId:null,segmentIndex:null,handle:null}),this.eventBus.dispatchEvent("link-editor-open",{blockId:e}))}closeEditor(){this.documentModel.setLinkModeState({enabled:!1,mode:"idle",activeLinkId:null,anchorPickPointId:null}),this.documentModel.setLinkEditorSelection({blockId:null,pointId:null,segmentIndex:null,handle:null}),this.eventBus.dispatchEvent("link-editor-close"),this.eventBus.dispatchEvent("link-preview-clear",{blockId:this.activeLinkId??void 0}),this._clearSnapGuide(),this.pathDragging=null}finishDrawing(){this._finishDrawing()}selectPoint(e,t){this.documentModel.setLinkEditorSelection({blockId:e,pointId:t,segmentIndex:null,handle:null})}selectSegment(e,t){this.documentModel.setLinkEditorSelection({blockId:e,pointId:null,segmentIndex:t,handle:null})}startPathDrag(e,t){if(!this._isEditingActive(e)||"edit"!==this.state.mode)return;if(0!==t.button)return;const i=this._getNormalizedFromEventForLink(e,t);if(!i)return;const n=this.documentModel.getBlock(e);n&&(this.pathDragging={blockId:e,start:i,startClient:{x:t.clientX,y:t.clientY},moved:!1,points:this._getLinkPoints(n).map(e=>({...e}))},this.documentModel.setLinkEditorSelection({blockId:e,pointId:null,segmentIndex:null,handle:null}),this._attachDragListeners(),t.stopPropagation(),t.preventDefault())}updateProp(e,t,i){this.documentModel.updateBlock(e,{props:{[t]:{value:i}}})}updatePointCoordinate(e,t,i,n){const r=this.documentModel.getBlock(e);if(!r)return;const o=this._getLinkPoints(r).map(r=>{var o;if(r.id!==t)return r;const s=fn(n),a={...r,[i]:s};if(null==(o=r.anchor)?void 0:o.blockId){const t=this._getAnchorBaseForLink(e,r.anchor.blockId,r.anchor.anchor||"middle-center");if(t){const e="x"===i?s:r.x,n="y"===i?s:r.y;a.anchor={...r.anchor,offset:{x:this._clampOffset(e-t.x),y:this._clampOffset(n-t.y)}}}}return a}),s=this._applyCurveAutoUpdate(e,o,t);this._updateGeometry(e,s)}toggleAnchor(e,t,i){const n=this.documentModel.getBlock(e);if(!n)return;if(i)return void this.enterAnchorPick(e,t);const r=this._getLinkPoints(n).map(i=>{if(i.id!==t)return i;const n=this._resolvePointPosition(e,i);return{...i,x:n.x,y:n.y,anchor:void 0}});this._updateGeometry(e,r),this.documentModel.setLinkModeState({mode:"edit",anchorPickPointId:null}),this._syncAnchorHighlight(this.documentModel.getLinkEditorSelection())}enterAnchorPick(e,t){this.documentModel.setLinkEditorSelection({blockId:e,pointId:t,segmentIndex:null,handle:null}),this.documentModel.setLinkModeState({enabled:!0,mode:"pick-anchor",activeLinkId:e,anchorPickPointId:t})}updateAnchorPoint(e,t,i){const n=this.documentModel.getBlock(e);if(!n)return;const r=this._getLinkPoints(n).map(n=>{var r;if(n.id!==t)return n;if(null==(r=n.anchor)?void 0:r.blockId){const t=this._resolvePointPosition(e,n),r=this._getAnchorBaseForLink(e,n.anchor.blockId,i);if(r)return{...n,anchor:{...n.anchor,anchor:i,offset:{x:this._clampOffset(t.x-r.x),y:this._clampOffset(t.y-r.y)}}}}return{...n,anchor:{...n.anchor||{blockId:""},anchor:i}}});this._updateGeometry(e,r),this._syncAnchorHighlight(this.documentModel.getLinkEditorSelection())}updateAnchorOffset(e,t,i,n){const r=this.documentModel.getBlock(e);if(!r)return;const o=this._getLinkPoints(r).map(e=>{var r;if(e.id!==t)return e;const o=(null==(r=e.anchor)?void 0:r.offset)??{x:0,y:0};return{...e,anchor:{...e.anchor||{blockId:""},offset:{...o,[i]:this._clampOffset(n)}}}});this._updateGeometry(e,o)}setSegmentType(e,t,i){const n=this.documentModel.getBlock(e);if(!n)return;const r=this._getLinkPoints(n),o=kn(r,this._getLinkSegments(n)).map((e,n)=>n!==t?e:"curve"===i?{...e,type:i,curvePreset:e.curvePreset??"smooth",curveBulge:"number"==typeof e.curveBulge?e.curveBulge:.25,curveAutoUpdate:Boolean(e.curveAutoUpdate??!1)}:{type:i});let s=r;"curve"===i&&(s=this._applyCurvePreset(e,r,t,o[t])),this._updateGeometry(e,s,o)}setSegmentCurvePreset(e,t,i){const n=this.documentModel.getBlock(e);if(!n)return;const r=this._getLinkPoints(n),o=kn(r,this._getLinkSegments(n));if(t<0||t>=o.length)return;const s=o.map((e,n)=>n===t?{...e,type:"curve",curvePreset:i,curveBulge:"number"==typeof e.curveBulge?e.curveBulge:.25,curveAutoUpdate:Boolean(e.curveAutoUpdate??!1)}:e),a=this._applyCurvePreset(e,r,t,s[t]);this._updateGeometry(e,a,s)}setSegmentCurveBulge(e,t,i){const n=this.documentModel.getBlock(e);if(!n)return;const r=this._getLinkPoints(n),o=kn(r,this._getLinkSegments(n));if(t<0||t>=o.length)return;const s=o.map((e,n)=>n===t?{...e,type:"curve",curveBulge:this._clampBulge(i),curvePreset:e.curvePreset??"arc",curveAutoUpdate:Boolean(e.curveAutoUpdate??!1)}:e),a=this._applyCurvePreset(e,r,t,s[t]);this._updateGeometry(e,a,s)}setSegmentCurveAutoUpdate(e,t,i){const n=this.documentModel.getBlock(e);if(!n)return;const r=this._getLinkPoints(n),o=kn(r,this._getLinkSegments(n));if(t<0||t>=o.length)return;const s=o.map((e,n)=>n===t?{...e,type:"curve",curveAutoUpdate:i,curvePreset:e.curvePreset??"smooth",curveBulge:"number"==typeof e.curveBulge?e.curveBulge:.25}:e);let a=r;i&&"manual"!==s[t].curvePreset&&(a=this._applyCurvePreset(e,r,t,s[t])),this._updateGeometry(e,a,s)}deletePoint(e,t){const i=this.documentModel.getBlock(e);if(!i)return;const n=this._getLinkPoints(i);if(n.length<=2)return;const r=n.findIndex(e=>e.id===t);if(-1===r)return;const o=n.filter(e=>e.id!==t),s=[...kn(n,this._getLinkSegments(i))];0===r?s.splice(0,1):s.splice(r-1,1),this._updateGeometry(e,o,s),this.documentModel.setLinkEditorSelection({blockId:e,pointId:null,segmentIndex:null,handle:null})}handleLineContextMenu(e,t){if(!this._isEditingActive(e))return;if("draw"===this.state.mode)return;t.preventDefault(),t.stopPropagation();const i=this._getNormalizedFromEventForLink(e,t);if(!i)return;const n=this.documentModel.getBlock(e);if(!n)return;const r=this._getLinkPoints(n);if(r.length<2)return;const o=this._getResolvedPoints(e),s=this._getRenderScaleForLink(e),a=s?this._getRenderPointFromEvent(e,t):i;if(!a)return;const l=s?this._toRenderPoints(o,s):o,c=this._findNearestSegment(l,a),d={id:this._generateLinkPointId(),x:i.x,y:i.y},u=[...r];u.splice(c+1,0,d);const h=[...kn(r,this._getLinkSegments(n))];h.splice(c,1,{type:"line"},{type:"line"}),this._updateGeometry(e,u,h),this.documentModel.setLinkEditorSelection({blockId:e,pointId:d.id,segmentIndex:null,handle:null})}handlePointContextMenu(e,t,i){this._isEditingActive(e)&&(t.preventDefault(),t.stopPropagation(),this.deletePoint(e,i))}startPointDrag(e,t,i){this._isEditingActive(e)&&(t.stopPropagation(),this.dragging={blockId:e,pointId:i},this._clearSnapGuide(e),this.documentModel.setLinkEditorSelection({blockId:e,pointId:i,segmentIndex:null,handle:null}),this._attachDragListeners())}startHandleDrag(e,t,i,n){this._isEditingActive(e)&&(t.stopPropagation(),this.dragging={blockId:e,pointId:i,handle:n},this._clearSnapGuide(e),this.documentModel.setLinkEditorSelection({blockId:e,pointId:i,segmentIndex:null,handle:n}),this._attachDragListeners())}_syncAnchorHighlight(e){var t;if(!e||!e.blockId||!e.pointId)return void this.documentModel.setLinkAnchorHighlight(null);if(!this.state.enabled||"edit"!==this.state.mode)return void this.documentModel.setLinkAnchorHighlight(null);if(!this.activeLinkId||e.blockId!==this.activeLinkId)return void this.documentModel.setLinkAnchorHighlight(null);const i=this.documentModel.getBlock(e.blockId);if(!i)return void this.documentModel.setLinkAnchorHighlight(null);const n=this._getLinkPoints(i).find(t=>t.id===e.pointId),r=(null==(t=null==n?void 0:n.anchor)?void 0:t.blockId)??null;this.documentModel.setLinkAnchorHighlight(r)}_applyState(e){const t=this.activeLinkId;this.state=e,this.activeLinkId=e.activeLinkId??null,t&&this.activeLinkId!==t&&(this.pathDragging=null),e.enabled&&e.activeLinkId||(this.snapBlocksCache=null),e.enabled&&"edit"===e.mode?this._syncAnchorHighlight(this.documentModel.getLinkEditorSelection()):this.documentModel.setLinkAnchorHighlight(null),this._syncDrawListeners(),this._syncPickListener(),this.dragging&&!this._isEditingActive(this.dragging.blockId)&&this._endDrag(),e.enabled&&"draw"===e.mode||this.eventBus.dispatchEvent("link-preview-clear",{blockId:e.activeLinkId??void 0}),e.enabled&&e.activeLinkId||(this.pathDragging=null)}_syncDrawListeners(){if(!Boolean(this.state.enabled&&"draw"===this.state.mode&&this.activeLinkId))return this._detachDrawListeners(),this._detachOutsideListener(),this._cancelLinkElementRetry(),void(this.linkElement=null);const e=this._getActiveLinkElement();e?(this.linkElement!==e&&(this._detachDrawListeners(),this.linkElement=e),this._attachDrawListeners(),this._attachOutsideListener()):this._scheduleLinkElementRetry()}_syncPickListener(){Boolean(this.state.enabled&&"pick-anchor"===this.state.mode&&this.activeLinkId&&this.state.anchorPickPointId)?this._attachPickListener():this._detachPickListener()}_attachDrawListeners(){!this.drawListenersAttached&&this.linkElement&&(this.linkElement.addEventListener("pointerdown",this._handleLinkPointerDown),this.linkElement.addEventListener("pointermove",this._handleLinkPointerMove),this.linkElement.addEventListener("pointerleave",this._handleLinkPointerLeave),this.linkElement.addEventListener("contextmenu",this._handleLinkContextMenu),this.drawListenersAttached=!0)}_detachDrawListeners(){this.drawListenersAttached&&this.linkElement&&(this.linkElement.removeEventListener("pointerdown",this._handleLinkPointerDown),this.linkElement.removeEventListener("pointermove",this._handleLinkPointerMove),this.linkElement.removeEventListener("pointerleave",this._handleLinkPointerLeave),this.linkElement.removeEventListener("contextmenu",this._handleLinkContextMenu),this.drawListenersAttached=!1)}_attachOutsideListener(){}_detachOutsideListener(){}_scheduleLinkElementRetry(){null===this.attachRetryHandle&&(this.attachRetryHandle=window.requestAnimationFrame(()=>{this.attachRetryHandle=null,this.state.enabled&&"draw"===this.state.mode&&this.activeLinkId&&this._syncDrawListeners()}))}_cancelLinkElementRetry(){null!==this.attachRetryHandle&&(window.cancelAnimationFrame(this.attachRetryHandle),this.attachRetryHandle=null)}_attachPickListener(){this.pickListenerAttached||(document.addEventListener("pointerdown",this._handlePickAnchor,!0),this.pickListenerAttached=!0)}_detachPickListener(){this.pickListenerAttached&&(document.removeEventListener("pointerdown",this._handlePickAnchor,!0),this.pickListenerAttached=!1)}_finishDrawing(){this.state.enabled&&"draw"===this.state.mode&&(this.documentModel.setLinkModeState({mode:"edit",anchorPickPointId:null}),this.eventBus.dispatchEvent("link-preview-clear",{blockId:this.activeLinkId??void 0}),this._clearSnapGuide())}_addPoint(e,t){const i=this.documentModel.getBlock(e);if(!i)return;const n=this._getLinkPoints(i),r=this._getLinkSegments(i),o={id:this._generateLinkPointId(),x:fn(t.x),y:fn(t.y)},s=[...n,o],a=kn(s,r);this.documentModel.updateBlock(e,{props:{points:s,segments:a}}),this.documentModel.setLinkEditorSelection({blockId:e,pointId:o.id,segmentIndex:null,handle:null})}_applyAnchorPick(e,t,i){var n;const r=this.documentModel.getBlock(e);if(!r)return;const o=this._getLinkPoints(r),s=o.findIndex(e=>e.id===t);if(-1===s)return;const a=(null==(n=o[s].anchor)?void 0:n.anchor)||"middle-center",l=this._resolvePointPosition(e,o[s]),c=this._getAnchorBaseForLink(e,i,a);if(!c)return;const d={x:this._clampOffset(l.x-c.x),y:this._clampOffset(l.y-c.y)},u={...o[s],anchor:{blockId:i,anchor:a,offset:d}},h=[...o];h[s]=u,this.documentModel.updateBlock(e,{props:{points:h}}),this.documentModel.setLinkEditorSelection({blockId:e,pointId:u.id,segmentIndex:null,handle:null}),this._syncAnchorHighlight({blockId:e,pointId:u.id,segmentIndex:null,handle:null})}_attachDragListeners(){this.dragListenersAttached||(window.addEventListener("pointermove",this._handleDragMove),window.addEventListener("pointerup",this._handleDragEnd),window.addEventListener("pointercancel",this._handleDragEnd),this.dragListenersAttached=!0)}_detachDragListeners(){this.dragListenersAttached&&(window.removeEventListener("pointermove",this._handleDragMove),window.removeEventListener("pointerup",this._handleDragEnd),window.removeEventListener("pointercancel",this._handleDragEnd),this.dragListenersAttached=!1)}_endDrag(){this.dragging=null,this._detachDragListeners()}_applyDeltaToPoints(e,t,i){return t.map(t=>{var n;const r=this._resolvePointPosition(e,t),o=fn(r.x+i.x),s=fn(r.y+i.y),a={...t,x:o,y:s};if(null==(n=t.anchor)?void 0:n.blockId){const i=this._getAnchorBaseForLink(e,t.anchor.blockId,t.anchor.anchor||"middle-center");i&&(a.anchor={...t.anchor,offset:{x:this._clampOffset(o-i.x),y:this._clampOffset(s-i.y)}})}return a})}_selectSegmentAtPoint(e,t){if(!this._isEditingActive(e))return;if("edit"!==this.state.mode)return;const i=this._getResolvedPoints(e);if(i.length<2)return;const n=this._getRenderScaleForLink(e);if(n){const r=this._toRenderPoints(i,n),o={x:t.x*n.sx,y:t.y*n.sy},s=this._findNearestSegment(r,o);return void this.documentModel.setLinkEditorSelection({blockId:e,pointId:null,segmentIndex:s,handle:null})}const r=this._findNearestSegment(i,t);this.documentModel.setLinkEditorSelection({blockId:e,pointId:null,segmentIndex:r,handle:null})}_createLinkBlock(){const e=this.blockRegistry.getDefaults("block-link");if(!e)return null;const t=this.blockRegistry.getEntityDefaults("block-link");return this.documentModel.createBlock("block-link",this.documentModel.rootId,{...e,entityConfig:{mode:t.mode||"inherited",slotId:t.slotId}},{layout:"static"})}_updateGeometry(e,t,i){const n={points:t};i&&(n.segments=i),this.documentModel.updateBlock(e,{props:n})}_applyCurvePreset(e,t,i,n){if("curve"!==n.type)return t;const r=n.curvePreset??"smooth";if("manual"===r)return t;const o=t[i],s=t[i+1];if(!o||!s)return t;const a=this._resolvePointPosition(e,o),l=this._resolvePointPosition(e,s);let c={x:0,y:0},d={x:0,y:0};if("smooth"===r){const n=t[i-1]??o,r=t[i+2]??s,u=this._resolvePointPosition(e,n),h=this._resolvePointPosition(e,r),p=1/6,g={x:a.x+(l.x-u.x)*p,y:a.y+(l.y-u.y)*p},m={x:l.x-(h.x-a.x)*p,y:l.y-(h.y-a.y)*p};c={x:g.x-a.x,y:g.y-a.y},d={x:m.x-l.x,y:m.y-l.y}}else if("arc"===r||"symmetric"===r){const e=l.x-a.x,t=l.y-a.y,i=Math.hypot(e,t);if(i>0){const o=-t/i,s=e/i,a=i*(1/3),l=this._clampBulge(n.curveBulge??.25)*i*("arc"===r?.35:.2);c={x:e*(a/i)+o*l,y:t*(a/i)+s*l},d={x:a/i*-e+o*l,y:a/i*-t+s*l}}}const u=t.map(e=>({...e}));return u[i]={...u[i],handleOut:c},u[i+1]={...u[i+1],handleIn:d},u}_clampBulge(e){return Number.isNaN(e)?0:Math.max(-1,Math.min(1,e))}_applyCurveAutoUpdate(e,t,i){const n=t.findIndex(e=>e.id===i);if(-1===n)return t;const r=this.documentModel.getBlock(e);if(!r)return t;const o=kn(t,this._getLinkSegments(r));let s=t;const a=t=>{if(t<0||t>=o.length)return;const i=o[t];i&&"curve"===i.type&&"manual"!==i.curvePreset&&i.curveAutoUpdate&&(s=this._applyCurvePreset(e,s,t,i))};return a(n-1),a(n),s}_getLinkPoints(e){var t;const i=null==(t=e.props)?void 0:t.points;return Array.isArray(i)?i:[]}_getLinkSegments(e){var t;const i=null==(t=e.props)?void 0:t.segments;return Array.isArray(i)?i:[]}_getPropValue(e,t,i){var n;const r=this.documentModel.getBlock(e),o=null==(n=null==r?void 0:r.props)?void 0:n[t];return o&&"object"==typeof o&&"value"in o?o.value??i:i}_resolvePointPosition(e,t){var i;if(null==(i=t.anchor)?void 0:i.blockId){const i=this._getAnchorBaseForLink(e,t.anchor.blockId,t.anchor.anchor||"middle-center");if(i){const e=t.anchor.offset??{x:t.x-i.x,y:t.y-i.y};return{x:fn(i.x+e.x),y:fn(i.y+e.y)}}}return{x:fn(t.x),y:fn(t.y)}}_getResolvedPoints(e){const t=this.documentModel.getBlock(e);return t?this._getLinkPoints(t).map(t=>({...t,...this._resolvePointPosition(e,t)})):[]}_updatePointPosition(e,t,i){const n=this.documentModel.getBlock(e);if(!n)return;const r=this._getLinkPoints(n).map(n=>{var r;if(n.id!==t)return n;const o={...n,x:i.x,y:i.y};if(null==(r=n.anchor)?void 0:r.blockId){const t=this._getAnchorBaseForLink(e,n.anchor.blockId,n.anchor.anchor||"middle-center");if(t){const e={x:this._clampOffset(i.x-t.x),y:this._clampOffset(i.y-t.y)};o.anchor={...n.anchor,offset:e}}}return xn(o)}),o=this._applyCurveAutoUpdate(e,r,t);this._updateGeometry(e,o)}_updateHandlePosition(e,t,i,n){const r=this.documentModel.getBlock(e);if(!r)return;const o=this._getLinkPoints(r),s=kn(o,this._getLinkSegments(r));let a=!1;const l=s.map((e,n)=>{var r,s;if("curve"!==e.type||"manual"===e.curvePreset)return e;return"out"===i&&(null==(r=o[n])?void 0:r.id)===t||"in"===i&&(null==(s=o[n+1])?void 0:s.id)===t?(a=!0,{...e,curvePreset:"manual",curveAutoUpdate:!1}):e}),c=o.map(e=>{if(e.id!==t)return e;const r={x:n.x-e.x,y:n.y-e.y};return"in"===i?{...e,handleIn:r}:{...e,handleOut:r}});this._updateGeometry(e,c,a?l:void 0)}_getAnchorBaseForLink(e,t,i){const n=this._getReferenceRect(e);if(!n)return null;if(!this.documentModel.getBlock(t))return null;const r=this.documentModel.getElement(t);if(!r)return null;const o=r.getBoundingClientRect();if(!n.width||!n.height)return null;const s=this._getAnchorOffset(i,o);return{x:fn((s.x-n.left)/n.width*100),y:fn((s.y-n.top)/n.height*100)}}_getReferenceRect(e){const t=this.documentModel.getElement(e)??this._getActiveLinkElement();return t?t.getBoundingClientRect():null}_getAnchorOffset(e,t){const i={left:t.left,center:t.left+t.width/2,right:t.right},n={top:t.top,middle:t.top+t.height/2,bottom:t.bottom},[r,o]=e.split("-");return{x:i[o],y:n[r]}}_cleanupAnchorsForDeletedBlock(e){this.documentModel.getLinkAnchorHighlight().blockId===e&&this.documentModel.setLinkAnchorHighlight(null);const t=Object.values(this.documentModel.blocks);for(const i of t){if(!i||"block-link"!==i.type)continue;const t=this._getLinkPoints(i);let n=!1;const r=t.map(t=>{var r;if((null==(r=t.anchor)?void 0:r.blockId)!==e)return t;n=!0;const o=this._resolvePointPosition(i.id,t);return{...t,x:o.x,y:o.y,anchor:void 0}});n&&this.documentModel.updateBlock(i.id,{props:{points:r}})}}_getNormalizedFromEvent(e,t){const i=t.getBoundingClientRect();return i.width&&i.height?{x:fn((e.clientX-i.left)/i.width*100),y:fn((e.clientY-i.top)/i.height*100)}:null}_getNormalizedFromEventForLink(e,t){const i=this._getReferenceRect(e);return i&&i.width&&i.height?{x:fn((t.clientX-i.left)/i.width*100),y:fn((t.clientY-i.top)/i.height*100)}:null}_applySnapping(e,t,i){const n=this.preferences.showGrid&&this.preferences.snapToGrid,r=this.preferences.snapToPoints,o=this.preferences.snapToBlocks;if(!n&&!r&&!o)return{point:t};const s=this._getReferenceRect(e);if(!s||!s.width||!s.height)return{point:t};const a=8/s.width*100,l=8/s.height*100,c=t.x,d=t.y;let u=t.x,h=t.y,p=null,g=null,m=Number.POSITIVE_INFINITY,v=Number.POSITIVE_INFINITY;const y=(e,t)=>{const i=Math.abs(c-e);i<=a&&i<m&&(m=i,u=e,p=t??null)},b=(e,t)=>{const i=Math.abs(d-e);i<=l&&i<v&&(v=i,h=e,g=t??null)};if(n){const e=5*Math.round(c/5),t=5*Math.round(d/5);y(e),b(t)}if(r){const t=this._getResolvedPoints(e).filter(e=>e.id!==(null==i?void 0:i.excludePointId));if(t.length)for(const e of t)y(e.x,{kind:"point",id:e.id,x:e.x,y:e.y}),b(e.y,{kind:"point",id:e.id,x:e.x,y:e.y});if(null==i?void 0:i.includeHandles){const t=this._getHandleSnapTargets(e,i.excludeHandle);for(const e of t)y(e.x,e),b(e.y,e)}}if(o){const t=this._getSnapBlocks();for(const i of t){const t=this._getAnchorBaseForLink(e,i.id,"middle-center");if(!t)continue;y(t.x,{kind:"block",id:i.id,x:t.x,y:t.y}),b(t.y,{kind:"block",id:i.id,x:t.x,y:t.y});const n=c-t.x,r=d-t.y;if(Math.abs(n)>=Math.abs(r)){const t=this._getAnchorBaseForLink(e,i.id,"top-center"),n=this._getAnchorBaseForLink(e,i.id,"bottom-center");t&&b(t.y,{kind:"block",id:i.id,x:t.x,y:t.y}),n&&b(n.y,{kind:"block",id:i.id,x:n.x,y:n.y})}else{const t=this._getAnchorBaseForLink(e,i.id,"middle-left"),n=this._getAnchorBaseForLink(e,i.id,"middle-right");t&&y(t.x,{kind:"block",id:i.id,x:t.x,y:t.y}),n&&y(n.x,{kind:"block",id:i.id,x:n.x,y:n.y})}}}const f={x:fn(u),y:fn(h)},k=new Set((null==i?void 0:i.connectedPointIds)??this._getConnectedPointIds(e,null==i?void 0:i.currentPointId));let x;if(p){const e=p;("point"!==e.kind||!k.has(e.id))&&(x={...x??{},x:{x:e.x,y1:Math.min(f.y,e.y),y2:Math.max(f.y,e.y)}})}if(g){const e=g;("point"!==e.kind||!k.has(e.id))&&(x={...x??{},y:{y:e.y,x1:Math.min(f.x,e.x),x2:Math.max(f.x,e.x)}})}return{point:f,guide:x}}_getConnectedPointIds(e,t){if(!t)return[];const i=this.documentModel.getBlock(e);if(!i)return[];const n=this._getLinkPoints(i),r=n.findIndex(e=>e.id===t);if(-1===r)return[];const o=[];return r>0&&o.push(n[r-1].id),r<n.length-1&&o.push(n[r+1].id),o}_getConnectedPointIdsForDraw(e){const t=this.documentModel.getBlock(e);if(!t)return[];const i=this._getLinkPoints(t),n=i[i.length-1];return n?[n.id]:[]}_getHandleSnapTargets(e,t){const i=this._getResolvedPoints(e),n=[];for(const r of i)r.handleIn&&(t&&t.pointId===r.id&&"in"===t.handle||n.push({kind:"handle",id:`${r.id}:in`,x:fn(r.x+r.handleIn.x),y:fn(r.y+r.handleIn.y)})),r.handleOut&&(t&&t.pointId===r.id&&"out"===t.handle||n.push({kind:"handle",id:`${r.id}:out`,x:fn(r.x+r.handleOut.x),y:fn(r.y+r.handleOut.y)}));return n}_getSnapBlocks(){return this.snapBlocksCache||(this.snapBlocksCache=Object.values(this.documentModel.blocks).filter(e=>e&&e.id!==this.documentModel.rootId&&"block-link"!==e.type)),this.snapBlocksCache}_emitSnapGuide(e,t){t?(this.snapGuideBlockId=e,this.eventBus.dispatchEvent("link-snap-guide",{blockId:e,guide:t})):this._clearSnapGuide(e)}_clearSnapGuide(e){if(!this.snapGuideBlockId&&!e)return;const t=e??this.snapGuideBlockId;this.eventBus.dispatchEvent("link-snap-clear",{blockId:t}),e&&e!==this.snapGuideBlockId||(this.snapGuideBlockId=null)}_getRenderScaleForLink(e){const t=this._getReferenceRect(e);return t&&t.width&&t.height?{sx:t.width/100,sy:t.height/100}:null}_getRenderPointFromEvent(e,t){const i=this._getReferenceRect(e);return i&&i.width&&i.height?{x:t.clientX-i.left,y:t.clientY-i.top}:null}_toRenderPoints(e,t){return e.map(e=>this._toRenderPoint(e,t))}_toRenderPoint(e,t){const{sx:i,sy:n}=t;return{...e,x:e.x*i,y:e.y*n,handleIn:e.handleIn?{x:e.handleIn.x*i,y:e.handleIn.y*n}:void 0,handleOut:e.handleOut?{x:e.handleOut.x*i,y:e.handleOut.y*n}:void 0}}_findNearestSegment(e,t){let i=Number.POSITIVE_INFINITY,n=0;for(let r=0;r<e.length-1;r+=1){const o=e[r],s=e[r+1],a=this._distancePointToSegment(t,o,s);a<i&&(i=a,n=r)}return n}_distancePointToSegment(e,t,i){const n=i.x-t.x,r=i.y-t.y;if(0===n&&0===r)return Math.hypot(e.x-t.x,e.y-t.y);const o=((e.x-t.x)*n+(e.y-t.y)*r)/(n*n+r*r),s=Math.max(0,Math.min(1,o)),a=t.x+s*n,l=t.y+s*r;return Math.hypot(e.x-a,e.y-l)}_getBlockIdFromEvent(e){const t=e.composedPath();for(const i of t){if(!(i instanceof HTMLElement))continue;const e=i.getAttribute("block-id");if(e)return e}return null}_isEditingActive(e){return Boolean(this.state.enabled&&this.state.activeLinkId===e)}_getActiveLinkElement(){return this.activeLinkId?this.documentModel.getElement(this.activeLinkId):null}_clampOffset(e){return Number.isNaN(e)?0:Math.max(-100,Math.min(100,e))}_generateLinkPointId(){return`lp-${Date.now()}-${Math.random().toString(36).substring(2,8)}`}}const An=e("link-mode-controller");class In{constructor(){this.animations=[],this.baseDuration=1e3,this.iterations=1e9,this.lastRate=null,this.lastActive=null,this.lastConfigKey=null}getPanelConfig(){return{}}getResolvedProps(e){return{}}update(e){if(this.ensureAnimations(e),!this.animations.length)return;const{active:t,playbackRate:i}=this.computePlayback(e);if(!t)return void(!1!==this.lastActive&&(this.animations.forEach(e=>e.pause()),this.lastActive=!1));(null===this.lastRate||Math.abs(i-this.lastRate)>1e-6)&&(this.applyPlayback(i),this.lastRate=i),!0!==this.lastActive&&(this.startFromEdge(i),this.lastActive=!0)}destroy(){this.resetAnimations()}computePlayback(e){const t=Math.abs(e.speedValue);if(!(e.flowEnabled&&t>0&&e.pathLength>0))return{active:!1,playbackRate:0};const i="reverse"===e.flowDirectionPositive?-1:1,n=(e.speedValue<0?-1:1)*i;return{active:!0,playbackRate:t/e.pathLength*n}}applyPlayback(e){this.animations.forEach(t=>{t.playbackRate=e})}startFromEdge(e){this.animations.forEach(t=>{var i;if(null===t.currentTime){const n=null==(i=t.effect)?void 0:i.getTiming(),r="number"==typeof(null==n?void 0:n.duration)?n.duration:this.baseDuration;t.currentTime=e<0?r:0}t.play()})}ensureAnimations(e){const t=this.getConfigKey(e);if(!(!this.animations.length||this.shouldRebuild(e)||null!==t&&t!==this.lastConfigKey))return;this.resetAnimations();const i=this.createAnimations(e);i.length&&(this.animations=i,this.lastConfigKey=t)}resetAnimations(){this.animations.forEach(e=>e.cancel()),this.animations=[],this.lastRate=null,this.lastActive=null,this.lastConfigKey=null}parseSize(e,t){if("number"==typeof e)return e;if(!e)return t;const i=parseFloat(e);return Number.isNaN(i)?t:i}getConfigKey(e){return null}shouldRebuild(e){return!1}}class Cn extends In{constructor(){super(...arguments),this.particleRef=b()}getDefaultStyle(){return l`
            .link-flow-particle {
                fill: var(--link-flow-color);
                stroke: none;
                stroke-width: 0;
                opacity: 1;
                filter: none;
                offset-rotate: auto;
                pointer-events: none;
            }
        `}getPanelConfig(){return{properties:{groups:[{id:"particle-animation",label:"Particle",traits:[{type:"number",name:"particleSize",label:"Particle Size",min:1,max:48,step:1,description:"Overrides the particle size when set."}]}]},targetStyles:{particle:{label:"Particle",description:"Animated particle style",styles:{groups:["svg"],properties:["effects.opacity","effects.filter"]}}}}}getResolvedProps(e){return{particleSize:e.resolveNumber("particleSize",0)}}render(e){const t={offsetPath:`path('${e.path}')`},{style:i,radius:n}=this.buildParticleStyle(e);return v`
            <g class="link-particle-layer">
                <circle
                    class="link-flow-particle"
                    r=${n}
                    ${f(this.particleRef)}
                    style=${u({...i,...t})}
                ></circle>
            </g>
        `}createAnimations(e){const t=this.particleRef.value;return t?[t.animate([{offsetDistance:"0%"},{offsetDistance:"100%"}],{duration:this.baseDuration,iterations:this.iterations,easing:"linear"})]:[]}shouldRebuild(e){var t;const i=this.particleRef.value;return!i||(1!==this.animations.length||(null==(t=this.animations[0].effect)?void 0:t.target)!==i)}buildParticleStyle(e){var t,i;const n=(null==(t=e.animationStyles)?void 0:t.particle)||{},r=this.parseSize(null==(i=e.animationConfig)?void 0:i.particleSize,0),o=r>0?r:10,s=this.parseSize(o,10);return{style:n,radius:Math.max(1,s/2)}}}var Pn=Object.defineProperty,Mn=Object.getOwnPropertyDescriptor,$n=(e,t,i,n)=>{for(var r,o=n>1?void 0:n?Mn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Pn(t,i,o),o};const Ln="particle";let Bn=class extends Dt{constructor(){super(...arguments),this.linkModeState=null,this.linkEditorSelection=null,this.previewPoint=null,this.snapGuide=null,this.pathLength=0,this.gridColor="#000000",this.animation=null,this.animationId=null,this.lastAnimationContext=null,this.linkEditorPreferences={...wn},this._handleLinkModeChanged=e=>{var t;const i=e.detail;this.linkModeState=i.state,"draw"!==(null==(t=this.linkModeState)?void 0:t.mode)&&(this.previewPoint=null),this.isEditingActive()||(this.snapGuide=null)},this._handleLinkGridColorChanged=e=>{const t=e.detail;this.gridColor=(null==t?void 0:t.color)||"#000000"},this._handleLinkSelectionChanged=e=>{const t=e.detail;this.linkEditorSelection=t.selection}}static registerAnimation(e,t){this.animationRegistry.set(e,t)}getAnimation(e){var t;const i=Bn.animationRegistry.get(e);return i?(this.animation&&this.animationId===e||(null==(t=this.animation)||t.destroy(),this.animation=i.factory(),this.animationId=e),this.animation):null}getAnimationPanelConfig(e){var t;const i=this.getAnimation(e);return(null==(t=null==i?void 0:i.getPanelConfig)?void 0:t.call(i))??null}getAnimationTargetIds(e){const t=this.getAnimationPanelConfig(e);return(null==t?void 0:t.targetStyles)?Object.keys(t.targetStyles):[]}getAnimationResolvedProps(e){const t=this.getAnimation(e);if(!(null==t?void 0:t.getResolvedProps))return{};const i={resolveString:(e,t)=>this.resolveProperty(e,t),resolveNumber:(e,t)=>this.resolvePropertyAsNumber(e,t),resolveBoolean:(e,t=!1)=>this.resolvePropertyAsBoolean(e,t)};return t.getResolvedProps(i)}static getBlockConfig(){return{sinceVersion:"2.0.0",definition:{label:"Link",icon:'<ha-icon icon="mdi:vector-line"></ha-icon>',internal:!0},defaults:{canChangeLayoutMode:!1,canBeDuplicated:!0,requireEntity:!0,props:{points:[],segments:[],renderStyle:{value:Ln},flowEnabled:{value:!0},flowDirectionPositive:{value:"forward"},speedSource:{value:"state"},speedAttribute:{value:""},valueMin:{value:0},valueMax:{value:0},speedMultiplier:{value:1},smoothingEnabled:{value:!1},smoothingTension:{value:.15}}},entityDefaults:{mode:"inherited"}}}getPanelConfig(){var e,t,i,n;const r=this.block?(null==(t=null==(e=this.documentModel)?void 0:e.getBlock)?void 0:t.call(e,this.block.id))??this.block:this.block,o=null==(i=null==r?void 0:r.props)?void 0:i.renderStyle,s=void 0!==(null==o?void 0:o.value)?String(o.value):this.resolveProperty("renderStyle",Ln),a=this.getAnimationPanelConfig(s),l=(null==(n=null==a?void 0:a.properties)?void 0:n.groups)??[],c=(null==a?void 0:a.targetStyles)??{},d=[{id:"link-editor",label:"Link Editor",traits:[{type:"action",name:"editLink",label:"Link Editor",buttonLabel:"Edit Link",actionId:"open-link-editor",icon:"⇢"}]},{id:"rendering",label:"Rendering",traits:[{type:"select",name:"renderStyle",label:"Style",options:Array.from(Bn.animationRegistry.values()).map(({id:e,label:t})=>({value:e,label:t}))}]}],u={id:"flow",label:"Flow",traits:[{type:"checkbox",name:"flowEnabled",label:"Enable Animation"},{type:"select",name:"flowDirectionPositive",label:"Positive Direction",options:[{value:"forward",label:"Start → End"},{value:"reverse",label:"End → Start"}]},{type:"select",name:"speedSource",label:"Value Source",options:[{value:"state",label:"Entity State"},{value:"attribute",label:"Attribute"}]},{type:"attribute-picker",name:"speedAttribute",label:"Attribute",placeholder:"Enter attribute name",visible:{prop:"speedSource",eq:"attribute"}},{type:"number",name:"valueMin",label:"Value Min",step:.1,description:"Minimum expected sensor value used to normalize speed."},{type:"number",name:"valueMax",label:"Value Max",step:.1,description:"Maximum expected sensor value used to normalize speed."},{type:"slider",name:"speedMultiplier",label:"Speed Multiplier",min:.1,max:10,step:.1,stepMode:"adaptive",description:"Scales the normalized speed (0.1–10)."}]},h={block:{styles:{properties:["layout.show","layout.zIndex"]}},path:{label:"Path",description:"Base path style",styles:{groups:["svg"],properties:["effects.opacity","effects.filter"]}}};return 0===l.length&&0===Object.keys(c).length?{properties:{groups:[...d,u]},targetStyles:h}:{properties:{groups:[...d,...l,u]},targetStyles:{...h,...c}}}connectedCallback(){super.connectedCallback(),this.linkModeState=this.documentModel.getLinkModeState(),this.linkEditorSelection=this.documentModel.getLinkEditorSelection(),this.gridColor=this.documentModel.getLinkGridColor(),this.documentModel.addEventListener("link-mode-changed",this._handleLinkModeChanged),this.documentModel.addEventListener("link-editor-selection-changed",this._handleLinkSelectionChanged),this.documentModel.addEventListener("link-grid-color-changed",this._handleLinkGridColorChanged),this.eventBus.addEventListener("link-preview-move",e=>{var t;e.blockId===(null==(t=this.block)?void 0:t.id)&&(this.previewPoint=e.point)}),this.eventBus.addEventListener("link-preview-clear",e=>{var t;e.blockId&&e.blockId!==(null==(t=this.block)?void 0:t.id)||(this.previewPoint=null)}),this.eventBus.addEventListener("link-snap-guide",e=>{var t;e.blockId===(null==(t=this.block)?void 0:t.id)&&(this.snapGuide=e.guide)}),this.eventBus.addEventListener("link-snap-clear",e=>{var t;e.blockId&&e.blockId!==(null==(t=this.block)?void 0:t.id)||(this.snapGuide=null)}),this.blockUpdateListener=e=>{const t=e.detail;if(!(null==t?void 0:t.block)||!this.block)return;if(t.block.id===this.block.id)return;this.getPoints().map(e=>{var t;return null==(t=e.anchor)?void 0:t.blockId}).filter(Boolean).includes(t.block.id)&&this.requestUpdate()},this.documentModel.addEventListener("block-updated",this.blockUpdateListener)}disconnectedCallback(){var e;this.documentModel.removeEventListener("link-mode-changed",this._handleLinkModeChanged),this.documentModel.removeEventListener("link-editor-selection-changed",this._handleLinkSelectionChanged),this.documentModel.removeEventListener("link-grid-color-changed",this._handleLinkGridColorChanged),this.blockUpdateListener&&this.documentModel.removeEventListener("block-updated",this.blockUpdateListener),null==(e=this.animation)||e.destroy(),this.animation=null,this.animationId=null,this.lastAnimationContext=null,super.disconnectedCallback()}updated(e){var t,i,n,r;super.updated(e);const o=null==(i=null==(t=this.linePath)?void 0:t.getTotalLength)?void 0:i.call(t);"number"==typeof o&&Number.isFinite(o)&&Math.abs(o-this.pathLength)>.1&&(this.pathLength=o),this.classList.toggle("editing-active",this.isEditingActive()),e.has("linkModeState")&&(this.classList.remove(`editing-mode-${(null==(n=e.get("linkModeState"))?void 0:n.mode)??"view"}`),this.classList.add(`editing-mode-${(null==(r=this.linkModeState)?void 0:r.mode)??"view"}`)),this.animation&&this.lastAnimationContext&&this.animation.update(this.lastAnimationContext)}firstUpdated(e){super.firstUpdated(e),this.animation&&this.lastAnimationContext&&this.animation.update(this.lastAnimationContext)}render(){var e,t,i,n;if(!this.block)return d;if(!this.canvasWidth||!this.canvasHeight)return d;const r=this.getResolvedPoints(),o={sx:this.canvasWidth/100,sy:this.canvasHeight/100},s=r.map(e=>this.toRenderPoint(e,o)),a=s.length>1,l=this.resolveProperty("renderStyle",Ln),c=m({"link-svg":!0,[`style-${l}`]:!0}),h=kn(this.getPoints(),this.getSegments()),p=this.resolvePropertyAsBoolean("smoothingEnabled"),g=this.resolvePropertyAsNumber("smoothingTension",.15),y=this.resolvePropertyAsBoolean("flowEnabled"),b=a?this.buildPath(s,h,p,g):"",f=this.buildSvgStyle(this.getTargetStyle("path"),{color:"var(--link-line-color)",width:"var(--link-line-width)"}),k=this.isEditingActive()&&"edit"===(null==(e=this.linkModeState)?void 0:e.mode),x=m({"link-path":!0,"link-line":!0,"move-enabled":k}),w=k?(null==(t=this.linkEditorSelection)?void 0:t.segmentIndex)??null:null,S=null!==w?this.buildSegmentPath(s,h,w,p,g):"",_=S?{...f,stroke:"var(--link-line-selected-color, var(--accent-color, #0078d4))",color:"var(--link-line-selected-color, var(--accent-color, #0078d4))",strokeWidth:"calc(var(--link-line-width) + 1px)"}:null,T=this.getAnimationTargetIds(l),A={};for(const d of T)A[d]=this.getTargetStyle(d);const I=this.resolveSpeedValue(this.pathLength),C=y&&Math.abs(I)>0,P=this.getAnimation(l),M=this.getAnimationResolvedProps(l),$=null==(n=null==(i=null==P?void 0:P.getDefaultStyle)?void 0:i.call(P))?void 0:n.cssText,L={blockId:this.block.id,path:b,pathLength:this.pathLength,flowEnabled:C,speedValue:I,flowDirectionPositive:this.resolveProperty("flowDirectionPositive","forward"),animationStyles:A,animationConfig:M};return this.lastAnimationContext=L,v`
            <svg class=${c} viewBox="0 0 ${this.canvasWidth} ${this.canvasHeight}" preserveAspectRatio="none" width="${this.canvasWidth}px" height="${this.canvasHeight}px">
                ${$?v`<style>${$}</style>`:d}
                ${this.renderGrid(o)}
                ${this.renderSnapGuides(o)}
                ${a?v`
                        <path
                            class=${x}
                            d=${b}
                            style=${u(f)}
                            @pointerdown=${e=>{var t;return null==(t=this.linkModeController)?void 0:t.startPathDrag(this.block.id,e)}}
                            @contextmenu=${e=>{var t;return null==(t=this.linkModeController)?void 0:t.handleLineContextMenu(this.block.id,e)}}
                        ></path>
                        ${_?v`
                                  <path
                                      class=${m({"link-path":!0,"link-line":!0,selected:!0,"link-element-no-pointer":!0})}
                                      d=${S}
                                      style=${u(_)}
                                  ></path>
                              `:d}
                    `:d}

                ${a&&C&&P&&L?P.render(L):d}

                ${this.renderEditorNodes(s,h)}
            </svg>
        `}updatePositionFromLayoutData(){this.style.left="0px",this.style.top="0px",this.style.width="100%",this.style.height="100%",this.block&&(this.style.zIndex=String(this.block.zIndex??1))}renderEditorNodes(e,t){if(!this.block)return d;if(!this.isEditingActive())return d;if(!this.linkEditorPreferences.showPoints)return d;const i=e.filter(e=>"preview"!==e.id),n=this.linkEditorSelection,r=null==n?void 0:n.pointId,o=null==n?void 0:n.handle;return v`
            <g class="link-nodes link-element-no-pointer">
                ${i.map((e,i)=>{var n;const s=r===e.id,a=Boolean(null==(n=e.anchor)?void 0:n.blockId),l=m({"link-node":!0,selected:s,anchored:a}),c=this.getHandlePosition(e,"out"),u=this.getHandlePosition(e,"in"),h=this.isCurveSegment(t[i]),p=this.isCurveSegment(t[i-1]);return v`
                        ${h?v`
                                  <line class="handle-line" x1=${e.x} y1=${e.y} x2=${c.x} y2=${c.y}></line>
                                  <circle
                                      class=${m({"link-handle":!0,selected:s&&"out"===o})}
                                      cx=${c.x}
                                      cy=${c.y}
                                      r=${5}
                                      @pointerdown=${t=>this.linkModeController.startHandleDrag(this.block.id,t,e.id,"out")}
                                  ></circle>
                              `:d}
                        ${p?v`
                                  <line class="handle-line" x1=${e.x} y1=${e.y} x2=${u.x} y2=${u.y}></line>
                                  <circle
                                      class=${m({"link-handle":!0,selected:s&&"in"===o})}
                                      cx=${u.x}
                                      cy=${u.y}
                                      r=${5}
                                      @pointerdown=${t=>this.linkModeController.startHandleDrag(this.block.id,t,e.id,"in")}
                                  ></circle>
                              `:d}
                        <circle
                            class=${l}
                            cx=${e.x}
                            cy=${e.y}
                            r=${5}
                            @pointerdown=${t=>this.linkModeController.startPointDrag(this.block.id,t,e.id)}
                            @contextmenu=${t=>this.linkModeController.handlePointContextMenu(this.block.id,t,e.id)}
                        ></circle>
                    `})}
            </g>
        `}renderGrid(e){if(!this.isEditingActive())return d;if(!this.linkEditorPreferences.showGrid)return d;const t=[];for(let i=0;i<=100;i+=5){const n=i*e.sx,r=i*e.sy,o=i%10==0,s={stroke:this.gridColor,strokeOpacity:o?"0.50":"0.25"};t.push(v`
                <line
                    class=${m({"grid-line":!0,major:o})}
                    x1=${n}
                    y1="0"
                    x2=${n}
                    y2=${this.canvasHeight}
                    style=${u(s)}
                ></line>
            `),t.push(v`
                <line
                    class=${m({"grid-line":!0,major:o})}
                    x1="0"
                    y1=${r}
                    x2=${this.canvasWidth}
                    y2=${r}
                    style=${u(s)}
                ></line>
            `)}return v`<g class="link-grid">${t}</g>`}renderSnapGuides(e){if(!this.isEditingActive())return d;if(!this.snapGuide)return d;const t=[];return this.snapGuide.x&&t.push(v`
                <line
                    x1=${this.snapGuide.x.x*e.sx}
                    y1=${this.snapGuide.x.y1*e.sy}
                    x2=${this.snapGuide.x.x*e.sx}
                    y2=${this.snapGuide.x.y2*e.sy}
                ></line>
            `),this.snapGuide.y&&t.push(v`
                <line
                    x1=${this.snapGuide.y.x1*e.sx}
                    y1=${this.snapGuide.y.y*e.sy}
                    x2=${this.snapGuide.y.x2*e.sx}
                    y2=${this.snapGuide.y.y*e.sy}
                ></line>
            `),t.length?v`<g class="link-snap-guides">${t}</g>`:d}buildPath(e,t,i,n){if(e.length<2)return"";const r=e[0];let o=`M ${r.x.toFixed(2)} ${r.y.toFixed(2)}`;for(let s=0;s<e.length-1;s+=1){const r=e[s],a=e[s+1],l=t[s];if("curve"===(null==l?void 0:l.type)){const e=this.getHandlePosition(r,"out"),t=this.getHandlePosition(a,"in");o+=` C ${e.x.toFixed(2)} ${e.y.toFixed(2)} ${t.x.toFixed(2)} ${t.y.toFixed(2)} ${a.x.toFixed(2)} ${a.y.toFixed(2)}`;continue}if(i&&e.length>2){const t=e[s-1]??r,i=e[s+2]??a,l=Math.max(0,Math.min(1,1-n))/6,c={x:r.x+(a.x-t.x)*l,y:r.y+(a.y-t.y)*l},d={x:a.x-(i.x-r.x)*l,y:a.y-(i.y-r.y)*l};o+=` C ${c.x.toFixed(2)} ${c.y.toFixed(2)} ${d.x.toFixed(2)} ${d.y.toFixed(2)} ${a.x.toFixed(2)} ${a.y.toFixed(2)}`;continue}o+=` L ${a.x.toFixed(2)} ${a.y.toFixed(2)}`}return o}buildSegmentPath(e,t,i,n,r){if(e.length<2)return"";if(i<0||i>=e.length-1)return"";const o=e[i],s=e[i+1],a=t[i];let l=`M ${o.x.toFixed(2)} ${o.y.toFixed(2)}`;if("curve"===(null==a?void 0:a.type)){const e=this.getHandlePosition(o,"out"),t=this.getHandlePosition(s,"in");return l+=` C ${e.x.toFixed(2)} ${e.y.toFixed(2)} ${t.x.toFixed(2)} ${t.y.toFixed(2)} ${s.x.toFixed(2)} ${s.y.toFixed(2)}`,l}if(n&&e.length>2){const t=e[i-1]??o,n=e[i+2]??s,a=Math.max(0,Math.min(1,1-r))/6,c={x:o.x+(s.x-t.x)*a,y:o.y+(s.y-t.y)*a},d={x:s.x-(n.x-o.x)*a,y:s.y-(n.y-o.y)*a};return l+=` C ${c.x.toFixed(2)} ${c.y.toFixed(2)} ${d.x.toFixed(2)} ${d.y.toFixed(2)} ${s.x.toFixed(2)} ${s.y.toFixed(2)}`,l}return l+=` L ${s.x.toFixed(2)} ${s.y.toFixed(2)}`,l}resolveSpeedValue(e){const t=this.getEntityState(),i=this.resolveProperty("speedSource","state"),n=this.resolveProperty("speedAttribute","");let r=null==t?void 0:t.state;"attribute"===i&&n&&(r=this.getEntityAttribute(n));const o=this.toNumber(r);if(0===o||!Number.isFinite(o)||e<=0)return 0;const s=this.resolvePropertyAsNumber("valueMin",0),a=this.resolvePropertyAsNumber("valueMax",0),l=this.normalizeMultiplier(this.resolvePropertyAsNumber("speedMultiplier",1)),c=this.normalizeValue(o,s,a);if(c<=0)return 0;return c*e*l*(o<0?-1:1)}toNumber(e){if(null==e)return 0;if("number"==typeof e)return e;const t=parseFloat(String(e));return Number.isNaN(t)?0:t}normalizeValue(e,t,i){if(0===e)return 0;const n=Math.min(t,i),r=Math.max(t,i);if(e>0){if(r<=0)return 0;const t=Math.max(0,n),i=r-t;return i<=0?0:this.clamp01((e-t)/i)}if(e<0){if(n>=0)return 0;const t=n,i=Math.min(0,r),o=Math.abs(t)-Math.abs(i);return o<=0?0:this.clamp01((Math.abs(e)-Math.abs(i))/o)}return 0}normalizeMultiplier(e){if(!Number.isFinite(e))return 1;const t=Math.max(.1,Math.min(10,e));return t<1?Math.round(10*t)/10:Math.round(t)}clamp01(e){return Math.max(0,Math.min(1,e))}buildSvgStyle(e,t){const i=e.stroke||t.color,n=e.strokeWidth||t.width,r=e.fill??"none",o=e.color||i;return{...e,stroke:i,strokeWidth:n,fill:r,color:o}}isEditingActive(){var e,t;return!!(null==(e=this.linkModeState)?void 0:e.enabled)&&this.linkModeState.activeLinkId===(null==(t=this.block)?void 0:t.id)}getPoints(){var e,t;const i=null==(t=null==(e=this.block)?void 0:e.props)?void 0:t.points;return Array.isArray(i)?i:[]}getSegments(){var e,t;const i=null==(t=null==(e=this.block)?void 0:e.props)?void 0:t.segments;return Array.isArray(i)?i:[]}getResolvedPoints(){var e;const t=this.getPoints().map(e=>({...e})).map(e=>{var t;if(!(null==(t=e.anchor)?void 0:t.blockId))return xn(e);const i=this.resolveAnchorBase(e);if(!i)return xn(e);const n=e.anchor.offset??{x:e.x-i.x,y:e.y-i.y};return{...e,x:fn(i.x+n.x),y:fn(i.y+n.y)}});return"draw"===(null==(e=this.linkModeState)?void 0:e.mode)&&this.previewPoint&&t.push({id:"preview",x:this.previewPoint.x,y:this.previewPoint.y}),t}toRenderPoint(e,t){return{...e,x:e.x*t.sx,y:e.y*t.sy,handleIn:e.handleIn?{x:e.handleIn.x*t.sx,y:e.handleIn.y*t.sy}:void 0,handleOut:e.handleOut?{x:e.handleOut.x*t.sx,y:e.handleOut.y*t.sy}:void 0}}resolveAnchorBase(e){var t;if(!(null==(t=e.anchor)?void 0:t.blockId))return null;if(!this.documentModel.getBlock(e.anchor.blockId))return null;const i=this.documentModel.getElement(e.anchor.blockId);if(!i)return null;const n=this.renderer.getCanvasElement();if(!n)return null;const r=n.getBoundingClientRect(),o=i.getBoundingClientRect();if(!r.width||!r.height)return null;const s=e.anchor.anchor||"middle-center",{x:a,y:l}=this.getAnchorOffset(s,o);return{x:fn((a-r.left)/r.width*100),y:fn((l-r.top)/r.height*100)}}getAnchorOffset(e,t){const i={left:t.left,center:t.left+t.width/2,right:t.right},n={top:t.top,middle:t.top+t.height/2,bottom:t.bottom},[r,o]=e.split("-");return{x:i[o],y:n[r]}}getHandlePosition(e,t){const i="in"===t?e.handleIn:e.handleOut;return i?{x:this.clampRender(e.x+i.x,this.canvasWidth),y:this.clampRender(e.y+i.y,this.canvasHeight)}:{x:e.x,y:e.y}}clampRender(e,t){return Number.isNaN(e)?0:!Number.isFinite(t)||t<=0?e:Math.min(t,Math.max(0,e))}isCurveSegment(e){return"curve"===(null==e?void 0:e.type)}};Bn.animationRegistry=new Map,Bn.styles=[...Dt.styles,l`
            :host {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                padding: 0;
                pointer-events: none;
                --link-line-color: var(--text-secondary, rgba(0, 0, 0, 0.35));
                --link-flow-color: var(--accent-color, rgba(33, 150, 243, 0.95));
                --link-line-width: 4px;
            }

            :host(.editing-active.editing-mode-draw) {
                pointer-events: auto;
            }

            svg {
                width: 100%;
                height: 100%;
                display: block;
                pointer-events: none;
            }

            .link-path {
                fill: none;
                vector-effect: non-scaling-stroke;
                pointer-events: visibleStroke;
                stroke-linecap: round;
                stroke-linejoin: round;
            }

            .link-line {
                stroke: var(--link-line-color);
                stroke-width: var(--link-line-width);
            }

            .link-line.move-enabled {
                cursor: move;
            }

            .link-line.selected {
                stroke: var(--link-line-selected-color, var(--accent-color, #0078d4));
            }

            .link-grid {
                pointer-events: none;
            }

            .link-grid line {
                stroke-width: 1px;
                vector-effect: non-scaling-stroke;
            }

            .link-snap-guides {
                pointer-events: none;
            }

            .link-snap-guides line {
                stroke: var(--accent-color, #0078d4);
                stroke-width: 1px;
                stroke-dasharray: 4 4;
                vector-effect: non-scaling-stroke;
            }

            .link-element-no-pointer {
                pointer-events: none;
            }

            .link-node,
            .link-handle {
                pointer-events: all;
                cursor: pointer;
                vector-effect: non-scaling-stroke;
            }

            .link-node {
                fill: #ffffff;
                stroke: #000000;
                stroke-width: 1px;
            }

            .link-node.selected {
                fill: #ff4081;
            }

            .link-node.anchored {
                fill: #ffc107;
            }

            .handle-line {
                stroke: #aaa;
                stroke-width: 2px;
            }

            .link-handle {
                fill: #ffffff;
                stroke: #2196f3;
                stroke-width: 1px;
            }

            .link-handle.selected {
                fill: #ff4081;
                stroke: #8d0734;
            }

        `],$n([c()],Bn.prototype,"linkModeState",2),$n([c()],Bn.prototype,"linkEditorSelection",2),$n([c()],Bn.prototype,"previewPoint",2),$n([c()],Bn.prototype,"snapGuide",2),$n([c()],Bn.prototype,"pathLength",2),$n([c()],Bn.prototype,"gridColor",2),$n([k("path.link-line")],Bn.prototype,"linePath",2),$n([n({context:An})],Bn.prototype,"linkModeController",2),$n([n({context:_n,subscribe:!0})],Bn.prototype,"linkEditorPreferences",2),Bn=$n([p("block-link")],Bn),Bn.registerAnimation("particle",{id:"particle",label:"Particle",factory:()=>new Cn});const En='<?xml version="1.0" encoding="UTF-8"?>\n<svg\n        xmlns="http://www.w3.org/2000/svg"\n        viewBox="0 0 520 180"\n        data-cb-weather-background-version="1"\n>\n    <defs>\n\n        \x3c!-- ── Gradients ── --\x3e\n        <linearGradient id="sky-fallback" x1="0" y1="0" x2="0" y2="1">\n            <stop offset="0%"   stop-color="var(--cb-weather-background-sky-top,    #0a1628)"/>\n            <stop offset="55%"  stop-color="var(--cb-weather-background-sky-middle,  #1a3a6e)"/>\n            <stop offset="100%" stop-color="var(--cb-weather-background-sky-bottom,  #2d5a9e)"/>\n        </linearGradient>\n\n        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">\n            <stop offset="0%"   stop-color="#fffde7" stop-opacity="1"/>\n            <stop offset="35%"  stop-color="#ffd54f" stop-opacity="0.85"/>\n            <stop offset="100%" stop-color="#ff9f43" stop-opacity="0"/>\n        </radialGradient>\n\n        <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">\n            <stop offset="0%"   stop-color="#e8f0ff" stop-opacity="0.9"/>\n            <stop offset="40%"  stop-color="#c8d8f8" stop-opacity="0.5"/>\n            <stop offset="100%" stop-color="#8899cc"  stop-opacity="0"/>\n        </radialGradient>\n\n        <linearGradient id="ground-grad" x1="0" y1="0" x2="0" y2="1">\n            <stop offset="0%"   stop-color="#1a2535"/>\n            <stop offset="100%" stop-color="#0e1720"/>\n        </linearGradient>\n\n        <linearGradient id="snow-ground" x1="0" y1="0" x2="0" y2="1">\n            <stop offset="0%"   stop-color="#dde8f8"/>\n            <stop offset="100%" stop-color="#c8d8f0"/>\n        </linearGradient>\n\n        \x3c!-- ── Filters ── --\x3e\n        <filter id="blur-soft" x="-50%"  y="-50%"  width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>\n        <filter id="blur-md"   x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="30"/></filter>\n        <filter id="blur-glow" x="-80%"  y="-80%"  width="260%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>\n\n        \x3c!-- ── Clip path: keep animated elements inside the viewBox ── --\x3e\n        <clipPath id="scene-clip">\n            <rect x="0" y="0" width="520" height="180"/>\n        </clipPath>\n\n        \x3c!-- ── CSS Style & Animations ── --\x3e\n        <style>\n            svg:not([data-cb-weather-background-runtime-active="true"])\n            [data-cb-weather-background-weather]:not([data-cb-weather-background-weather~="sunny"]) {\n            display: none;\n            }\n\n            /* ── CLOUDS ── */\n            .cloud-layer {\n            animation: cloud-drift var(--cb-weather-background-cloud-speed, 52s) ease-in-out infinite alternate;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-cloud-opacity, 1);\n            }\n            .cloud-bob {\n            animation: cloud-bob var(--cb-weather-background-cloud-bob-speed, 8s) ease-in-out infinite alternate;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            }\n            .cloud-layer-b {\n            animation: cloud-drift-b var(--cb-weather-background-cloud-speed, 52s) ease-in-out infinite alternate;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-cloud-opacity, 1);\n            }\n\n            /* ── RAIN ── */\n            .rain-a {\n            animation: rain-fall var(--cb-weather-background-rain-speed, 0.9s) linear infinite;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-rain-opacity, 0.55);\n            }\n            .rain-b {\n            animation: rain-fall var(--cb-weather-background-rain-speed, 0.9s) linear infinite;\n            animation-delay: -0.45s;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-rain-opacity, 0.55);\n            }\n\n            /* ── POURING ── */\n            .pour-a {\n            animation: rain-fall var(--cb-weather-background-pouring-speed, 0.55s) linear infinite;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-pouring-opacity, 0.70);\n            }\n            .pour-b {\n            animation: rain-fall var(--cb-weather-background-pouring-speed, 0.55s) linear infinite;\n            animation-delay: -0.28s;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-pouring-opacity, 0.70);\n            }\n            .pour-c {\n            animation: rain-fall var(--cb-weather-background-pouring-speed, 0.55s) linear infinite;\n            animation-delay: -0.14s;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-pouring-opacity, 0.70);\n            }\n\n            /* ── SNOW ── */\n            .snow-a {\n            animation: snow-fall var(--cb-weather-background-snow-speed, 6s) linear infinite;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-snow-opacity, 0.88);\n            }\n            .snow-b {\n            animation: snow-fall var(--cb-weather-background-snow-speed, 6s) linear infinite;\n            animation-delay: -3s;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-snow-opacity, 0.88);\n            }\n            .snow-c {\n            animation: snow-fall var(--cb-weather-background-snow-speed, 6s) linear infinite;\n            animation-delay: -1.5s;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-snow-opacity, 0.88);\n            }\n\n            /* ── HAIL ── */\n            .hail-a {\n            animation: hail-fall var(--cb-weather-background-hail-speed, 0.45s) ease-in infinite;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-hail-opacity, 0.80);\n            }\n            .hail-b {\n            animation: hail-fall var(--cb-weather-background-hail-speed, 0.45s) ease-in infinite;\n            animation-delay: -0.22s;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-hail-opacity, 0.80);\n            }\n\n            /* ── LIGHTNING bolt propagation ── */\n            .lightning-bolt {\n            stroke-dasharray: 200;\n            stroke-dashoffset: 200;\n            animation: bolt-draw var(--cb-weather-background-lightning-speed, 2.8s) ease-in infinite;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            }\n            .lightning-bolt-2 {\n            stroke-dasharray: 120;\n            stroke-dashoffset: 120;\n            animation: bolt-draw var(--cb-weather-background-lightning-speed, 2.8s) ease-in infinite;\n            animation-delay: -1.4s;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            }\n            /* ── LIGHTNING scene flash ── */\n            .lightning-flash {\n            animation: flash var(--cb-weather-background-lightning-speed, 2.8s) ease-in infinite;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: 0;\n            }\n            .lightning-flash-2 {\n            animation: flash var(--cb-weather-background-lightning-speed, 2.8s) ease-in infinite;\n            animation-delay: -1.4s;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: 0;\n            }\n\n            /* ── FOG ── */\n            .fog-a {\n            animation: fog-drift var(--cb-weather-background-fog-speed, 18s) linear infinite;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            }\n            .fog-b {\n            animation: fog-drift var(--cb-weather-background-fog-speed, 18s) linear infinite;\n            animation-delay: -9s;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            }\n\n            /* ── WIND strokes ── */\n            .wind-stroke {\n            stroke-dasharray: 60 40;\n            animation: wind-flow var(--cb-weather-background-wind-speed, 2.8s) linear infinite;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-wind-opacity, 0.50);\n            }\n            .wind-stroke-b {\n            stroke-dasharray: 44 56;\n            animation: wind-flow var(--cb-weather-background-wind-speed, 2.8s) linear infinite;\n            animation-delay: -1.4s;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-wind-opacity, 0.50);\n            }\n            .wind-stroke-fast {\n            stroke-dasharray: 50 50;\n            animation: wind-flow calc(var(--cb-weather-background-wind-speed, 2.8s) * 0.65) linear infinite;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-wind-opacity, 0.60);\n            }\n\n            /* ── STARS twinkle ── */\n            .star-twinkle {\n            animation: star-twinkle var(--cb-weather-background-star-speed, 4s) ease-in-out infinite alternate;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-star-opacity, 0.85);\n            }\n            .star-twinkle-b {\n            animation: star-twinkle var(--cb-weather-background-star-speed, 4s) ease-in-out infinite alternate;\n            animation-delay: -2s;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-star-opacity, 0.85);\n            }\n\n            /* ── SUN pulse ── */\n            .sun-pulse {\n            animation: sun-pulse var(--cb-weather-background-sun-pulse-speed, 4s) ease-in-out infinite alternate;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            }\n\n            /* ── EXCEPTIONAL warning wave ── */\n            .exc-wave {\n            stroke-dasharray: 80 40;\n            animation: wind-flow calc(var(--cb-weather-background-exceptional-speed, 3s) * 0.5) linear infinite;\n            animation-play-state: var(--cb-weather-background-animation-play-state, running);\n            opacity: var(--cb-weather-background-exceptional-opacity, 0.55);\n            }\n\n            /* ── KEYFRAMES ── */\n            @keyframes cloud-drift {\n            from { transform: translateX(-14px); }\n            to   { transform: translateX(20px);  }\n            }\n            @keyframes cloud-drift-b {\n            from { transform: translateX(10px);  }\n            to   { transform: translateX(-18px); }\n            }\n            @keyframes cloud-bob {\n            from { transform: translateY(0px);  }\n            to   { transform: translateY(3px);  }\n            }\n            @keyframes rain-fall {\n            from { transform: translate(0,    -50px); }\n            to   { transform: translate(-18px, 50px); }\n            }\n            @keyframes snow-fall {\n            from { transform: translate(0,    -50px); }\n            to   { transform: translate(10px,  50px); }\n            }\n            @keyframes hail-fall {\n            from { transform: translate(0,    -45px); }\n            to   { transform: translate(-8px,  45px); }\n            }\n            @keyframes bolt-draw {\n            0%   { stroke-dashoffset: 200; opacity: 0;   }\n            5%   { stroke-dashoffset: 0;   opacity: 1;   }\n            18%  { stroke-dashoffset: 0;   opacity: 0.9; }\n            22%  { stroke-dashoffset: 0;   opacity: 0;   }\n            100% { stroke-dashoffset: 0;   opacity: 0;   }\n            }\n            @keyframes flash {\n            0%   { opacity: 0;    }\n            5%   { opacity: 0.12; }\n            10%  { opacity: 0;    }\n            14%  { opacity: 0.08; }\n            18%  { opacity: 0;    }\n            100% { opacity: 0;    }\n            }\n            @keyframes fog-drift {\n            from { transform: translateX(-60px); }\n            to   { transform: translateX(60px);  }\n            }\n            @keyframes wind-flow {\n            from { stroke-dashoffset:  100; }\n            to   { stroke-dashoffset: -100; }\n            }\n            @keyframes star-twinkle {\n            from { opacity: 0.3; }\n            to   { opacity: 1.0; }\n            }\n            @keyframes sun-pulse {\n            from { transform: scale(0.96); }\n            to   { transform: scale(1.04); }\n            }\n\n            /* ── Reduced motion ── */\n            @media (prefers-reduced-motion: reduce) {\n            * {\n            animation-duration: 1ms !important;\n            animation-iteration-count: 1 !important;\n            transition-duration: 1ms !important;\n            }\n            }\n        </style>\n\n    </defs>\n\n    \x3c!-- ══════════════════════════════════════════\n         SKY — runtime-driven by the block\n         ══════════════════════════════════════════ --\x3e\n    <rect\n            data-cb-weather-background-role="sky"\n            x="0" y="0" width="520" height="180"\n            fill="url(#sky-fallback)"\n    />\n\n    \x3c!-- ══════════════════════════════════════════\n         HORIZON GLOW — dawn / dusk / twilight\n         ══════════════════════════════════════════ --\x3e\n    <g\n            data-cb-weather-background-role="dawn-dusk"\n            data-cb-weather-background-phase="dawn dusk twilight"\n            opacity="0"\n    >\n        <ellipse cx="260" cy="142" rx="320" ry="68" fill="#e06820" filter="url(#blur-md)" opacity="0.35"/>\n    </g>\n\n    \x3c!-- ══════════════════════════════════════════\n         STARS — clear-night / phase:night\n         ══════════════════════════════════════════ --\x3e\n    <g\n            data-cb-weather-background-role="stars"\n            data-cb-weather-background-weather="clear-night"\n            data-cb-weather-background-phase="night"\n            clip-path="url(#scene-clip)"\n    >\n        <g class="star-twinkle">\n            <circle cx="22"  cy="8"  r="0.8" fill="#ffffff" opacity="0.9"/>\n            <circle cx="88"  cy="7"  r="1.1" fill="#ffffff" opacity="0.8"/>\n            <circle cx="148" cy="10" r="0.9" fill="#ffffff" opacity="0.9"/>\n            <circle cx="230" cy="6"  r="1.0" fill="#ffffff" opacity="0.7"/>\n            <circle cx="290" cy="9"  r="0.7" fill="#ffffff" opacity="0.9"/>\n            <circle cx="355" cy="7"  r="0.9" fill="#ffffff" opacity="0.8"/>\n            <circle cx="418" cy="11" r="1.1" fill="#ffffff" opacity="0.9"/>\n            <circle cx="478" cy="16" r="0.9" fill="#ffffff" opacity="0.7"/>\n            <circle cx="138" cy="35" r="0.7" fill="#ffffff" opacity="0.6"/>\n            <circle cx="340" cy="28" r="0.7" fill="#ffffff" opacity="0.5"/>\n        </g>\n        <g class="star-twinkle-b">\n            <circle cx="55"  cy="14" r="0.6" fill="#ffffff" opacity="0.7"/>\n            <circle cx="115" cy="20" r="0.7" fill="#ffffff" opacity="0.6"/>\n            <circle cx="175" cy="5"  r="0.6" fill="#ffffff" opacity="0.5"/>\n            <circle cx="198" cy="22" r="0.8" fill="#ffffff" opacity="0.8"/>\n            <circle cx="262" cy="15" r="0.8" fill="#ffffff" opacity="0.6"/>\n            <circle cx="320" cy="20" r="1.0" fill="#ffffff" opacity="0.7"/>\n            <circle cx="388" cy="18" r="0.7" fill="#ffffff" opacity="0.5"/>\n            <circle cx="448" cy="6"  r="0.8" fill="#ffffff" opacity="0.6"/>\n            <circle cx="502" cy="9"  r="0.6" fill="#ffffff" opacity="0.8"/>\n            <circle cx="42"  cy="30" r="0.6" fill="#ffffff" opacity="0.5"/>\n            <circle cx="210" cy="32" r="0.8" fill="#ffffff" opacity="0.6"/>\n            <circle cx="430" cy="33" r="0.9" fill="#ffffff" opacity="0.4"/>\n            <circle cx="495" cy="28" r="0.6" fill="#ffffff" opacity="0.5"/>\n        </g>\n    </g>\n\n    \x3c!-- ══════════════════════════════════════════\n         SUN ARC\n         Arc: left horizon (54,164) → apex (~260,14) → right horizon (466,164)\n         ══════════════════════════════════════════ --\x3e\n    <path\n            data-cb-weather-background-role="sun-arc"\n            d="M 54 164 C 140 0 380 0 466 164"\n            fill="none"\n            stroke="none"\n    />\n\n    \x3c!-- ══════════════════════════════════════════\n         SUN — drawn around (0,0)\n         ══════════════════════════════════════════ --\x3e\n    <g\n            data-cb-weather-background-role="sun"\n            data-cb-weather-background-weather="sunny partlycloudy cloudy fog windy windy-variant exceptional"\n    >\n        <g class="sun-pulse">\n            <circle cx="0" cy="0" r="58" fill="url(#sun-glow)" filter="url(#blur-soft)" opacity="0.48"/>\n            <circle cx="0" cy="0" r="30" fill="#ffd54f" opacity="0.16"/>\n            <circle cx="0" cy="0" r="17" fill="#fffde7" opacity="0.97"/>\n            <g opacity="0.30" stroke="#ffe082" stroke-linecap="round">\n                <line x1="0"   y1="-24" x2="0"   y2="-32" stroke-width="1.5"/>\n                <line x1="0"   y1=" 24" x2="0"   y2=" 32" stroke-width="1.5"/>\n                <line x1="-24" y1="0"   x2="-32" y2="0"   stroke-width="1.5"/>\n                <line x1=" 24" y1="0"   x2=" 32" y2="0"   stroke-width="1.5"/>\n                <line x1="-17" y1="-17" x2="-22" y2="-22" stroke-width="1.2"/>\n                <line x1=" 17" y1="-17" x2=" 22" y2="-22" stroke-width="1.2"/>\n                <line x1=" 17" y1=" 17" x2=" 22" y2=" 22" stroke-width="1.2"/>\n                <line x1="-17" y1=" 17" x2="-22" y2=" 22" stroke-width="1.2"/>\n            </g>\n        </g>\n    </g>\n\n    \x3c!-- ══════════════════════════════════════════\n         MOON — static at arc midpoint for clear-night\n         ══════════════════════════════════════════ --\x3e\n    <g\n            data-cb-weather-background-weather="clear-night"\n            data-cb-weather-background-phase="night"\n    >\n        <circle cx="260" cy="22" r="40" fill="url(#moon-glow)" filter="url(#blur-soft)" opacity="0.42"/>\n        <circle cx="260" cy="22" r="13" fill="#dde8ff" opacity="0.95"/>\n        <circle cx="265" cy="19" r="10" fill="#0d1a30" opacity="0.46"/>\n        <circle cx="254" cy="17" r="2.2" fill="#b8c8e8" opacity="0.32"/>\n        <circle cx="261" cy="26" r="1.5" fill="#b8c8e8" opacity="0.25"/>\n        <circle cx="267" cy="21" r="1.0" fill="#c8d8f0" opacity="0.20"/>\n    </g>\n\n    \x3c!-- ══════════════════════════════════════════\n         WEATHER OVERLAYS\n         ══════════════════════════════════════════ --\x3e\n\n    \x3c!-- ── PARTLY CLOUDY ── --\x3e\n    <g data-cb-weather-background-weather="partlycloudy" clip-path="url(#scene-clip)">\n        <g class="cloud-layer">\n            <g class="cloud-bob">\n                <ellipse cx="105" cy="30" rx="72"  ry="20" fill="#2a4870" opacity="0.55"/>\n                <ellipse cx="138" cy="20" rx="55"  ry="16" fill="#304f80" opacity="0.48"/>\n                <ellipse cx="80"  cy="34" rx="40"  ry="14" fill="#243d6a" opacity="0.40"/>\n            </g>\n        </g>\n        <g class="cloud-layer-b">\n            <g class="cloud-bob">\n                <ellipse cx="400" cy="26" rx="80"  ry="19" fill="#2a4870" opacity="0.50"/>\n                <ellipse cx="435" cy="16" rx="58"  ry="15" fill="#304f80" opacity="0.42"/>\n                <ellipse cx="370" cy="31" rx="42"  ry="13" fill="#243d6a" opacity="0.38"/>\n            </g>\n        </g>\n    </g>\n\n    \x3c!-- ── CLOUDY ── --\x3e\n    <g data-cb-weather-background-weather="cloudy rainy" clip-path="url(#scene-clip)">\n        <rect x="0" y="0" width="520" height="135" fill="#1a2840" opacity="0.55"/>\n        <g class="cloud-layer">\n            <g class="cloud-bob">\n                <ellipse cx="90"  cy="24" rx="110" ry="26" fill="#283850" opacity="0.75"/>\n                <ellipse cx="80"  cy="14" rx="85"  ry="20" fill="#2e4060" opacity="0.65"/>\n                <ellipse cx="150" cy="32" rx="95"  ry="22" fill="#243250" opacity="0.60"/>\n            </g>\n        </g>\n        <g class="cloud-layer-b">\n            <g class="cloud-bob">\n                <ellipse cx="270" cy="20" rx="130" ry="24" fill="#283858" opacity="0.72"/>\n                <ellipse cx="260" cy="10" rx="100" ry="18" fill="#304268" opacity="0.60"/>\n                <ellipse cx="440" cy="26" rx="110" ry="25" fill="#283850" opacity="0.70"/>\n                <ellipse cx="460" cy="15" rx="80"  ry="19" fill="#2e4060" opacity="0.62"/>\n            </g>\n        </g>\n    </g>\n\n    \x3c!-- ── RAINY ── --\x3e\n    <g data-cb-weather-background-weather="rainy" clip-path="url(#scene-clip)">\n        \x3c!-- rain pass A --\x3e\n        <g class="rain-a" stroke="#6890b8" stroke-width="0.8" stroke-linecap="round">\n            <line x1="20"  y1="35" x2="8"   y2="85"/> <line x1="50"  y1="28" x2="38"  y2="78"/>\n            <line x1="80"  y1="32" x2="68"  y2="82"/> <line x1="110" y1="26" x2="98"  y2="76"/>\n            <line x1="140" y1="31" x2="128" y2="81"/> <line x1="170" y1="27" x2="158" y2="77"/>\n            <line x1="200" y1="33" x2="188" y2="83"/> <line x1="230" y1="29" x2="218" y2="79"/>\n            <line x1="260" y1="34" x2="248" y2="84"/> <line x1="290" y1="28" x2="278" y2="78"/>\n            <line x1="320" y1="32" x2="308" y2="82"/> <line x1="350" y1="26" x2="338" y2="76"/>\n            <line x1="380" y1="31" x2="368" y2="81"/> <line x1="410" y1="27" x2="398" y2="77"/>\n            <line x1="440" y1="33" x2="428" y2="83"/> <line x1="470" y1="29" x2="458" y2="79"/>\n            <line x1="500" y1="34" x2="488" y2="84"/>\n        </g>\n        \x3c!-- rain pass B (offset) --\x3e\n        <g class="rain-b" stroke="#6890b8" stroke-width="0.8" stroke-linecap="round">\n            <line x1="35"  y1="35" x2="23"  y2="85"/> <line x1="65"  y1="28" x2="53"  y2="78"/>\n            <line x1="95"  y1="32" x2="83"  y2="82"/> <line x1="125" y1="26" x2="113" y2="76"/>\n            <line x1="155" y1="31" x2="143" y2="81"/> <line x1="185" y1="27" x2="173" y2="77"/>\n            <line x1="215" y1="33" x2="203" y2="83"/> <line x1="245" y1="29" x2="233" y2="79"/>\n            <line x1="275" y1="34" x2="263" y2="84"/> <line x1="305" y1="28" x2="293" y2="78"/>\n            <line x1="335" y1="32" x2="323" y2="82"/> <line x1="365" y1="26" x2="353" y2="76"/>\n            <line x1="395" y1="31" x2="383" y2="81"/> <line x1="425" y1="27" x2="413" y2="77"/>\n            <line x1="455" y1="33" x2="443" y2="83"/> <line x1="485" y1="29" x2="473" y2="79"/>\n            <line x1="515" y1="34" x2="503" y2="84"/>\n        </g>\n    </g>\n\n    \x3c!-- ── POURING ── --\x3e\n    <g data-cb-weather-background-weather="pouring" clip-path="url(#scene-clip)">\n        <rect x="0" y="0" width="520" height="135" fill="#0e1520" opacity="0.65"/>\n        <g class="cloud-layer">\n            <ellipse cx="100" cy="18" rx="130" ry="26" fill="#18222e" opacity="0.88"/>\n            <ellipse cx="270" cy="14" rx="150" ry="25" fill="#141e2c" opacity="0.85"/>\n            <ellipse cx="440" cy="20" rx="120" ry="24" fill="#18222e" opacity="0.82"/>\n        </g>\n        <g class="pour-a" stroke="#5580a8" stroke-width="1.0" stroke-linecap="round">\n            <line x1="10"  y1="32" x2="-2"  y2="84"/> <line x1="30"  y1="27" x2="18"  y2="79"/>\n            <line x1="50"  y1="33" x2="38"  y2="85"/> <line x1="70"  y1="27" x2="58"  y2="79"/>\n            <line x1="90"  y1="32" x2="78"  y2="84"/> <line x1="110" y1="28" x2="98"  y2="80"/>\n            <line x1="130" y1="34" x2="118" y2="86"/> <line x1="150" y1="28" x2="138" y2="80"/>\n            <line x1="170" y1="32" x2="158" y2="84"/> <line x1="190" y1="27" x2="178" y2="79"/>\n            <line x1="210" y1="33" x2="198" y2="85"/> <line x1="230" y1="28" x2="218" y2="80"/>\n            <line x1="250" y1="34" x2="238" y2="86"/> <line x1="270" y1="28" x2="258" y2="80"/>\n            <line x1="290" y1="32" x2="278" y2="84"/> <line x1="310" y1="27" x2="298" y2="79"/>\n            <line x1="330" y1="33" x2="318" y2="85"/> <line x1="350" y1="28" x2="338" y2="80"/>\n            <line x1="370" y1="32" x2="358" y2="84"/> <line x1="390" y1="27" x2="378" y2="79"/>\n            <line x1="410" y1="33" x2="398" y2="85"/> <line x1="430" y1="28" x2="418" y2="80"/>\n            <line x1="450" y1="32" x2="438" y2="84"/> <line x1="470" y1="27" x2="458" y2="79"/>\n            <line x1="490" y1="33" x2="478" y2="85"/> <line x1="510" y1="28" x2="498" y2="80"/>\n        </g>\n        <g class="pour-b" stroke="#5580a8" stroke-width="1.0" stroke-linecap="round">\n            <line x1="20"  y1="32" x2="8"   y2="84"/> <line x1="60"  y1="27" x2="48"  y2="79"/>\n            <line x1="100" y1="33" x2="88"  y2="85"/> <line x1="140" y1="27" x2="128" y2="79"/>\n            <line x1="180" y1="32" x2="168" y2="84"/> <line x1="220" y1="28" x2="208" y2="80"/>\n            <line x1="260" y1="33" x2="248" y2="85"/> <line x1="300" y1="28" x2="288" y2="80"/>\n            <line x1="340" y1="32" x2="328" y2="84"/> <line x1="380" y1="27" x2="368" y2="79"/>\n            <line x1="420" y1="33" x2="408" y2="85"/> <line x1="460" y1="28" x2="448" y2="80"/>\n            <line x1="500" y1="32" x2="488" y2="84"/>\n        </g>\n        <g class="pour-c" stroke="#5580a8" stroke-width="1.0" stroke-linecap="round">\n            <line x1="40"  y1="32" x2="28"  y2="84"/> <line x1="80"  y1="27" x2="68"  y2="79"/>\n            <line x1="120" y1="33" x2="108" y2="85"/> <line x1="160" y1="27" x2="148" y2="79"/>\n            <line x1="200" y1="32" x2="188" y2="84"/> <line x1="240" y1="28" x2="228" y2="80"/>\n            <line x1="280" y1="33" x2="268" y2="85"/> <line x1="320" y1="28" x2="308" y2="80"/>\n            <line x1="360" y1="32" x2="348" y2="84"/> <line x1="400" y1="27" x2="388" y2="79"/>\n            <line x1="440" y1="33" x2="428" y2="85"/> <line x1="480" y1="28" x2="468" y2="80"/>\n            <line x1="520" y1="32" x2="508" y2="84"/>\n        </g>\n        <rect x="0" y="135" width="520" height="20" fill="#3a5a80" opacity="0.22"/>\n    </g>\n\n    \x3c!-- ── LIGHTNING & LIGHTNING-RAINY ── --\x3e\n    <g data-cb-weather-background-weather="lightning lightning-rainy" clip-path="url(#scene-clip)">\n        <rect x="0" y="0" width="520" height="180" fill="#352f2f" opacity="0.68"/>\n        <g class="cloud-layer">\n            <ellipse cx="90"  cy="18" rx="130" ry="28" fill="#595555" opacity="0.90"/>\n            <ellipse cx="270" cy="14" rx="155" ry="26" fill="#0d1218" opacity="0.88"/>\n            <ellipse cx="440" cy="20" rx="125" ry="26" fill="#7f7f7f" opacity="0.86"/>\n        </g>\n        \x3c!-- flash overlay 1 --\x3e\n        <rect class="lightning-flash"   x="0" y="0" width="520" height="180" fill="#fffde7"/>\n        \x3c!-- flash overlay 2 (offset) --\x3e\n        <rect class="lightning-flash-2" x="0" y="0" width="520" height="180" fill="#fffde7"/>\n        \x3c!-- bolt 1 --\x3e\n        <polyline class="lightning-bolt"\n                  points="275,10 255,55 272,75 248,200"\n                  fill="none" stroke="#fff8a0" stroke-width="8"\n                  stroke-linejoin="round" stroke-linecap="round" filter="url(#blur-glow)"/>\n        <polyline class="lightning-bolt"\n                  points="275,10 255,55 272,75 248,200"\n                  fill="none" stroke="#ffd700" stroke-width="2.8"\n                  stroke-linejoin="round" stroke-linecap="round"/>\n        \x3c!-- bolt 2 --\x3e\n        <polyline class="lightning-bolt-2"\n                  points="388,18 374,52 385,52 368,350"\n                  fill="none" stroke="#fff8a0" stroke-width="8"\n                  stroke-linejoin="round" stroke-linecap="round" filter="url(#blur-glow)"/>\n        <polyline class="lightning-bolt-2"\n                  points="388,18 374,52 385,52 368,350"\n                  fill="none" stroke="#ffd700" stroke-width="1.8"\n                  stroke-linejoin="round" stroke-linecap="round"/>\n    </g>\n\n    \x3c!-- ── SNOWY & SHOWY-RAINY ── --\x3e\n    <g data-cb-weather-background-weather="snowy snowy-rainy" clip-path="url(#scene-clip)">\n        <rect x="0" y="0" width="520" height="135" fill="#2a3550" opacity="0.50"/>\n        <g class="cloud-layer">\n            <ellipse cx="130" cy="20" rx="140" ry="24" fill="#3a4a6a" opacity="0.60"/>\n            <ellipse cx="290" cy="15" rx="155" ry="22" fill="#364468" opacity="0.58"/>\n            <ellipse cx="440" cy="22" rx="120" ry="21" fill="#3a4a6a" opacity="0.55"/>\n        </g>\n        \x3c!-- snow pass A --\x3e\n        <g class="snow-a" fill="#e8f0ff">\n            <circle cx="18"  cy="38" r="2.2"/> <circle cx="78"  cy="42" r="2.0"/> <circle cx="140" cy="44" r="2.4"/>\n            <circle cx="200" cy="40" r="1.5"/> <circle cx="262" cy="43" r="1.7"/> <circle cx="322" cy="41" r="1.5"/>\n            <circle cx="382" cy="44" r="1.6"/> <circle cx="442" cy="40" r="1.8"/> <circle cx="500" cy="42" r="1.4"/>\n            <circle cx="64"  cy="70" r="2.3"/> <circle cx="128" cy="68" r="2.0"/> <circle cx="188" cy="72" r="2.4"/>\n            <circle cx="248" cy="66" r="2.1"/> <circle cx="308" cy="69" r="2.2"/> <circle cx="368" cy="65" r="2.0"/>\n            <circle cx="428" cy="60" r="2.3"/> <circle cx="488" cy="57" r="2.0"/>\n            <circle cx="52"  cy="96" r="2.0"/> <circle cx="122" cy="94" r="2.2"/> <circle cx="185" cy="98" r="2.0"/>\n            <circle cx="245" cy="93" r="2.4"/> <circle cx="305" cy="97" r="2.1"/> <circle cx="365" cy="95" r="2.3"/>\n            <circle cx="425" cy="96" r="2.0"/> <circle cx="485" cy="94" r="2.2"/>\n        </g>\n        \x3c!-- snow pass B --\x3e\n        <g class="snow-b" fill="#e8f0ff">\n            <circle cx="48"  cy="32" r="1.6"/> <circle cx="110" cy="35" r="1.4"/> <circle cx="172" cy="31" r="1.8"/>\n            <circle cx="232" cy="36" r="2.1"/> <circle cx="292" cy="33" r="2.3"/> <circle cx="352" cy="36" r="2.0"/>\n            <circle cx="412" cy="32" r="2.2"/> <circle cx="472" cy="35" r="2.0"/>\n            <circle cx="30"  cy="62" r="1.8"/> <circle cx="96"  cy="58" r="1.5"/> <circle cx="158" cy="60" r="1.6"/>\n            <circle cx="218" cy="57" r="1.7"/> <circle cx="278" cy="61" r="1.4"/> <circle cx="338" cy="58" r="1.8"/>\n            <circle cx="398" cy="72" r="1.5"/> <circle cx="458" cy="68" r="1.6"/>\n            <circle cx="14"  cy="90" r="1.6"/> <circle cx="88"  cy="88" r="1.4"/> <circle cx="155" cy="90" r="1.7"/>\n            <circle cx="215" cy="87" r="1.5"/> <circle cx="275" cy="91" r="1.8"/> <circle cx="335" cy="88" r="1.4"/>\n            <circle cx="395" cy="90" r="1.6"/> <circle cx="455" cy="89" r="1.7"/> <circle cx="510" cy="90" r="1.5"/>\n        </g>\n        \x3c!-- snow pass C --\x3e\n        <g class="snow-c" fill="#e8f0ff">\n            <circle cx="33"  cy="36" r="1.9"/> <circle cx="93"  cy="40" r="1.6"/> <circle cx="155" cy="37" r="2.0"/>\n            <circle cx="217" cy="43" r="1.7"/> <circle cx="277" cy="38" r="2.1"/> <circle cx="337" cy="42" r="1.6"/>\n            <circle cx="397" cy="36" r="1.9"/> <circle cx="457" cy="41" r="1.7"/>\n            <circle cx="47"  cy="64" r="2.0"/> <circle cx="112" cy="67" r="1.8"/> <circle cx="173" cy="63" r="2.2"/>\n            <circle cx="233" cy="69" r="1.6"/> <circle cx="293" cy="65" r="2.0"/> <circle cx="353" cy="68" r="1.8"/>\n            <circle cx="413" cy="62" r="2.1"/> <circle cx="473" cy="66" r="1.6"/>\n        </g>\n        <rect x="0" y="130" width="520" height="50" fill="url(#snow-ground)" opacity="0.35"/>\n    </g>\n\n    \x3c!-- ── HAIL ── --\x3e\n    <g data-cb-weather-background-weather="hail" clip-path="url(#scene-clip)">\n        <rect x="0" y="0" width="520" height="135" fill="#141e2c" opacity="0.65"/>\n        <g class="cloud-layer">\n            <ellipse cx="100" cy="18" rx="130" ry="26" fill="#18262e" opacity="0.88"/>\n            <ellipse cx="270" cy="14" rx="150" ry="25" fill="#14202c" opacity="0.85"/>\n            <ellipse cx="440" cy="20" rx="120" ry="24" fill="#18262e" opacity="0.82"/>\n        </g>\n        <g class="hail-a">\n            <g stroke="#a0b8cc" stroke-width="1.4" stroke-linecap="round">\n                <line x1="40"  y1="38" x2="36"  y2="52"/> <line x1="120" y1="40" x2="116" y2="54"/>\n                <line x1="200" y1="41" x2="196" y2="55"/> <line x1="280" y1="40" x2="276" y2="54"/>\n                <line x1="360" y1="41" x2="356" y2="55"/> <line x1="440" y1="40" x2="436" y2="54"/>\n            </g>\n            <g fill="#c8d8e8">\n                <circle cx="38"  cy="53" r="2.8"/> <circle cx="118" cy="55" r="3.0"/>\n                <circle cx="198" cy="56" r="2.8"/> <circle cx="278" cy="55" r="3.0"/>\n                <circle cx="358" cy="56" r="2.8"/> <circle cx="438" cy="55" r="3.0"/>\n            </g>\n        </g>\n        <g class="hail-b">\n            <g stroke="#a0b8cc" stroke-width="1.4" stroke-linecap="round">\n                <line x1="80"  y1="33" x2="76"  y2="47"/> <line x1="160" y1="35" x2="156" y2="49"/>\n                <line x1="240" y1="36" x2="236" y2="50"/> <line x1="320" y1="35" x2="316" y2="49"/>\n                <line x1="400" y1="36" x2="396" y2="50"/> <line x1="480" y1="35" x2="476" y2="49"/>\n                <line x1="60"  y1="62" x2="56"  y2="78"/> <line x1="140" y1="60" x2="136" y2="76"/>\n                <line x1="220" y1="64" x2="216" y2="80"/> <line x1="300" y1="61" x2="296" y2="77"/>\n                <line x1="380" y1="64" x2="376" y2="80"/> <line x1="460" y1="60" x2="456" y2="76"/>\n            </g>\n            <g fill="#c8d8e8">\n                <circle cx="78"  cy="48" r="2.4"/> <circle cx="158" cy="50" r="2.6"/>\n                <circle cx="238" cy="51" r="2.4"/> <circle cx="318" cy="50" r="2.6"/>\n                <circle cx="398" cy="51" r="2.4"/> <circle cx="478" cy="50" r="2.6"/>\n                <circle cx="58"  cy="79" r="2.8"/> <circle cx="138" cy="77" r="2.4"/>\n                <circle cx="218" cy="81" r="3.0"/> <circle cx="298" cy="78" r="2.6"/>\n                <circle cx="378" cy="81" r="2.8"/> <circle cx="458" cy="77" r="2.4"/>\n            </g>\n        </g>\n    </g>\n\n    \x3c!-- ── FOG ── --\x3e\n    <g data-cb-weather-background-weather="fog" clip-path="url(#scene-clip)">\n        <rect x="0" y="0" width="520" height="180" fill="#8090a0" opacity="0.28"/>\n        \x3c!-- fog layer A: moves right --\x3e\n        <g class="fog-a">\n            <rect x="-60" y="14"  width="640" height="18" rx="9"  fill="#8899aa" opacity="0.52"/>\n            <rect x="-60" y="50"  width="640" height="20" rx="10" fill="#8899aa" opacity="0.45"/>\n            <rect x="-60" y="86"  width="640" height="16" rx="8"  fill="#8899aa" opacity="0.40"/>\n            <rect x="-60" y="118" width="640" height="24" rx="12" fill="#9aaabb" opacity="0.50"/>\n        </g>\n        \x3c!-- fog layer B: moves left, offset --\x3e\n        <g class="fog-b">\n            <rect x="-60" y="32"  width="640" height="14" rx="7"  fill="#aabbcc" opacity="0.42"/>\n            <rect x="-60" y="68"  width="640" height="16" rx="8"  fill="#aabbcc" opacity="0.36"/>\n            <rect x="-60" y="100" width="640" height="18" rx="9"  fill="#9aaabb" opacity="0.38"/>\n            <rect x="-60" y="132" width="640" height="22" rx="11" fill="#aabbcc" opacity="0.48"/>\n        </g>\n    </g>\n\n    \x3c!-- ── WINDY ── --\x3e\n    <g data-cb-weather-background-weather="windy" clip-path="url(#scene-clip)">\n        \x3c!-- stroke A --\x3e\n        <g class="wind-stroke" fill="none" stroke="#7a9ab8" stroke-linecap="round">\n            <path d="M-10,22  Q80,14  200,22  Q320,30  440,22  Q490,18 530,22"   stroke-width="1.8"/>\n            <path d="M-10,50  Q90,42  210,50  Q330,58  450,50  Q495,46 530,50"   stroke-width="1.6"/>\n            <path d="M-10,78  Q85,70  205,78  Q325,86  445,78  Q495,74 530,78"   stroke-width="1.5"/>\n            <path d="M-10,106 Q90,98  210,106 Q330,114 450,106 Q498,102 530,106" stroke-width="1.1"/>\n            <path d="M20,16   Q70,12  130,16"  stroke-width="1.0"/>\n            <path d="M260,30  Q330,26 400,30"  stroke-width="1.0"/>\n        </g>\n        \x3c!-- stroke B (offset timing) --\x3e\n        <g class="wind-stroke-b" fill="none" stroke="#7a9ab8" stroke-linecap="round">\n            <path d="M-10,36  Q70,28  180,36  Q310,44  430,36  Q480,32 530,36"   stroke-width="1.4"/>\n            <path d="M-10,64  Q75,56  195,64  Q315,72  435,64  Q490,60 530,64"   stroke-width="1.2"/>\n            <path d="M-10,92  Q80,84  200,92  Q320,100 440,92  Q492,88 530,92"   stroke-width="1.3"/>\n            <path d="M380,44  Q450,40 520,44"  stroke-width="1.0"/>\n            <path d="M0,54    Q50,50  100,54"  stroke-width="0.9"/>\n        </g>\n    </g>\n\n    \x3c!-- ── WINDY-VARIANT ── --\x3e\n    <g data-cb-weather-background-weather="windy-variant" clip-path="url(#scene-clip)">\n        <g class="wind-stroke-fast" fill="none" stroke="#6a8aaa" stroke-linecap="round">\n            <path d="M-10,18  Q80,8   200,18  Q320,28  440,18  Q490,14 530,18"   stroke-width="2.2"/>\n            <path d="M-10,46  Q90,36  210,46  Q330,56  450,46  Q495,42 530,46"   stroke-width="2.0"/>\n            <path d="M-10,74  Q85,64  205,74  Q325,84  445,74  Q495,70 530,74"   stroke-width="1.8"/>\n            <path d="M-10,102 Q90,92  210,102 Q330,112 450,102 Q498,98 530,102"  stroke-width="1.4"/>\n            <path d="M-10,116 Q78,106 198,116 Q318,126 438,116 Q492,112 530,116" stroke-width="1.7"/>\n            <path d="M0,24    Q50,18  120,24"  stroke-width="1.4"/>\n            <path d="M180,38  Q260,32 360,38"  stroke-width="1.3"/>\n            <path d="M400,52  Q460,46 530,52"  stroke-width="1.2"/>\n        </g>\n        <g class="wind-stroke-b" fill="none" stroke="#6a8aaa" stroke-linecap="round">\n            <path d="M-10,32  Q70,22  180,32  Q310,42  430,32  Q480,28 530,32"   stroke-width="1.8"/>\n            <path d="M-10,60  Q75,50  195,60  Q315,70  435,60  Q490,56 530,60"   stroke-width="1.5"/>\n            <path d="M-10,88  Q80,78  200,88  Q320,98  440,88  Q492,84 530,88"   stroke-width="1.6"/>\n            <path d="M10,66   Q80,60  160,66"  stroke-width="1.3"/>\n            <path d="M240,78  Q320,72 420,78"  stroke-width="1.2"/>\n        </g>\n    </g>\n\n    \x3c!-- ── EXCEPTIONAL ── --\x3e\n    <g data-cb-weather-background-weather="exceptional" clip-path="url(#scene-clip)">\n        <rect x="0" y="0" width="520" height="135" fill="#2a1840" opacity="0.40"/>\n        <ellipse cx="260" cy="60"  rx="280" ry="80" fill="#6030a0" filter="url(#blur-md)" opacity="0.22"/>\n        <ellipse cx="260" cy="140" rx="300" ry="60" fill="#c04820" filter="url(#blur-md)" opacity="0.18"/>\n        \x3c!-- warning wave strokes --\x3e\n        <g class="exc-wave" fill="none" stroke="#c060d0" stroke-linecap="round">\n            <path d="M-10,30 Q80,20 200,30 Q320,40 440,30 Q490,26 540,30" stroke-width="2.0"/>\n            <path d="M-10,55 Q80,45 200,55 Q320,65 440,55 Q490,51 540,55" stroke-width="1.6"/>\n            <path d="M-10,80 Q80,70 200,80 Q320,90 440,80 Q490,76 540,80" stroke-width="1.8"/>\n        </g>\n        <g class="exc-wave" fill="none" stroke="#e07030" stroke-linecap="round"\n           style="animation-delay:-1.5s">\n            <path d="M-10,42 Q80,32 200,42 Q320,52 440,42 Q490,38 540,42" stroke-width="1.4"/>\n            <path d="M-10,68 Q80,58 200,68 Q320,78 440,68 Q490,64 540,68" stroke-width="1.6"/>\n        </g>\n    </g>\n\n    \x3c!-- ══════════════════════════════════════════\n         STATIC SCENE — ground\n         ══════════════════════════════════════════ --\x3e\n\n    <rect x="0" y="135" width="520" height="46" fill="url(#ground-grad)"/>\n\n</svg>\n';var Dn=Object.defineProperty,Rn=Object.getOwnPropertyDescriptor,On=(e,t,i,n)=>{for(var r,o=n>1?void 0:n?Rn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Dn(t,i,o),o};const Nn="data-cb-weather-background-role",zn="data-cb-weather-background-weather",Vn="data-cb-weather-background-phase",Fn="data-cb-weather-background-original-display",Wn="data-cb-weather-background-original-transform",jn="data-cb-weather-background-runtime",Gn="sun.sun",Un=864e5,Hn="background-1",qn=["clear-night","cloudy","exceptional","fog","hail","lightning","lightning-rainy","partlycloudy","pouring","rainy","snowy","snowy-rainy","sunny","windy","windy-variant"],Xn=[{id:Hn,label:"Background #1",fileName:"background-1.svg",svg:En}];let Yn=class extends Dt{constructor(){super(...arguments),this.svgMarkup=En,this.svgWarnings=[],this.svgLoadWarning=null,this.loadedSourceKey="",this.loadingSourceKey="",this.loadSequence=0,this.updateTimerId=null,this.updateTimerMinutes=null,this.runtimeFrameId=null}static getBlockConfig(){return{sinceVersion:"2.1.0",definition:{label:"Weather Background",icon:'<ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>',category:"weather"},defaults:{requireEntity:!0,props:{svgSource:{value:"default"},defaultSvgBackground:{value:Hn},mediaReference:{value:""},animationsEnabled:{value:!0},showSvgWarnings:{value:!0},sunPositionUpdateMinutes:{value:10}}},entityDefaults:{mode:"inherited"}}}getPanelConfig(){return{properties:{groups:[{id:"svg",label:"SVG",traits:[{type:"select",name:"svgSource",label:"SVG Source",options:[{value:"default",label:"Default SVG"},{value:"media",label:"Media Library"}]},{type:"select",name:"defaultSvgBackground",label:"Default Background",options:Xn.map(e=>({value:e.id,label:e.label})),visible:{prop:"svgSource",eq:"default"}},{type:"media-picker",name:"mediaReference",label:"Custom SVG",emptyLabel:"No SVG selected",selectLabel:"Select SVG",editLabel:"Edit",removeLabel:"Remove",sourceProp:"svgSource",sourceValue:"media",visible:{prop:"svgSource",eq:"media"},binding:{type:"text",placeholder:"cb-media://local/card_builder/weather.svg"}},{type:"checkbox",name:"animationsEnabled",label:"Enable Animations"},{type:"checkbox",name:"showSvgWarnings",label:"Show SVG Warnings"}]},{id:"sun",label:"Sun",traits:[{type:"slider",name:"sunPositionUpdateMinutes",label:"Update Interval",min:5,max:60,step:5,binding:{type:"slider",min:5,max:60,step:5}}]}]},targetStyles:{block:{styles:{preset:"full"}}}}}connectedCallback(){super.connectedCallback(),this.ensureSvgLoaded()}disconnectedCallback(){this.clearUpdateTimer(),null!==this.runtimeFrameId&&(window.cancelAnimationFrame(this.runtimeFrameId),this.runtimeFrameId=null),super.disconnectedCallback()}updated(e){super.updated(e),this.syncUpdateTimer(),this.ensureSvgLoaded(),this.scheduleRuntimeApply()}getBlockEntities(){const e=new Set,t=this.resolvedEntityId();return t&&e.add(t),e.add(Gn),Array.from(e)}render(){const e=this.getVisibleWarnings(),t=this.areAnimationsEnabled();return h`
            <div class="weather-background">
                <div class="svg-stage ${t?"":"animations-disabled"}">
                    ${this.svgMarkup?x(this.svgMarkup):d}
                </div>
                ${e.length>0?h`
                    <div class="warnings" role="alert">
                        ${e.map(e=>h`<div class="warning">${e}</div>`)}
                    </div>
                `:d}
            </div>
        `}async ensureSvgLoaded(){const e=this.getSvgSource(),t=this.getDefaultSvgBackground(),i=this.resolveProperty("mediaReference",""),n="media"===e?`media:${i}`:`default:${t.id}`;if(n===this.loadedSourceKey||n===this.loadingSourceKey)return;const r=++this.loadSequence;this.loadingSourceKey=n;try{const t=await this.loadRawSvg(e,i);if(r!==this.loadSequence)return;const o=this.prepareSvg(t);this.svgMarkup=o.markup,this.svgWarnings=o.warnings,this.svgLoadWarning="media"!==e||i?null:"No custom SVG selected; using the default weather background SVG.",this.loadedSourceKey=n}catch(o){if(r!==this.loadSequence)return;const e=this.prepareSvg(this.getDefaultSvgBackground().svg);this.svgMarkup=e.markup,this.svgWarnings=e.warnings,this.svgLoadWarning=`Unable to load custom weather SVG: ${this.getErrorMessage(o)}. Using the default SVG.`,this.loadedSourceKey=n}finally{r===this.loadSequence&&(this.loadingSourceKey="",this.scheduleRuntimeApply())}}async loadRawSvg(e,t){if("default"===e)return this.getDefaultSvgBackground().svg;if(!t)return this.getDefaultSvgBackground().svg;const i=this.resolveSvgUrl(t);if(!i)throw new Error("the selected media reference cannot be resolved");const n=await fetch(i,{credentials:"same-origin"});if(!n.ok)throw new Error(`HTTP ${n.status}`);return n.text()}resolveSvgUrl(e){return yt(e)?St(e):bt(e)||e.startsWith("/")?e:e||null}prepareSvg(e){const t=this.parseSvg(e);this.sanitizeSvgDocument(t);const i=this.validateSvgDocument(t),n=t.documentElement;n.removeAttribute("width"),n.removeAttribute("height"),n.setAttribute("preserveAspectRatio",n.getAttribute("preserveAspectRatio")||"xMidYMid slice"),n.setAttribute("focusable","false"),n.setAttribute("aria-hidden","true");const r=n.getAttribute("class");return n.setAttribute("class",r?`${r} cb-weather-background-svg`:"cb-weather-background-svg"),{markup:(new XMLSerializer).serializeToString(n),warnings:i}}parseSvg(e){const t=(new DOMParser).parseFromString(e,"image/svg+xml"),i=t.documentElement,n=t.getElementsByTagName("parsererror");if(!i||"svg"!==i.localName.toLowerCase()||n.length>0)throw new Error("the selected file is not a valid SVG document");return t}sanitizeSvgDocument(e){e.querySelectorAll("script, foreignObject, iframe, object, embed, link").forEach(e=>e.remove()),e.querySelectorAll("*").forEach(e=>{for(const t of Array.from(e.attributes)){const i=t.name.toLowerCase(),n=t.value.trim().toLowerCase();i.startsWith("on")?e.removeAttribute(t.name):"href"!==i&&"xlink:href"!==i||!n.startsWith("javascript:")?"style"===i&&n.includes("javascript:")&&e.removeAttribute(t.name):e.removeAttribute(t.name)}})}validateSvgDocument(e){const t=[],i=this.findElementsByRole(e,"sky"),n=this.findElementsByRole(e,"sun-arc"),r=this.findElementsByRole(e,"sun"),o=n.filter(e=>"path"===e.localName.toLowerCase());0===i.length&&t.push(`Missing SVG element with ${Nn}="sky".`),0===o.length&&t.push(`Missing SVG path with ${Nn}="sun-arc".`),0===r.length&&t.push(`Missing SVG element with ${Nn}="sun".`);const s=new Set;e.querySelectorAll(`[${zn}]`).forEach(e=>{this.getTokenList(e.getAttribute(zn)).forEach(e=>s.add(e))});for(const a of qn)s.has(a)||t.push(`Missing weather representation for "${a}".`);return Array.from(e.querySelectorAll(`[${Vn}]`)).some(e=>{const t=this.getTokenList(e.getAttribute(Vn));return t.includes("dawn")||t.includes("dusk")||t.includes("twilight")})||t.push(`Missing sunrise/sunset phase representation using ${Vn}="dawn dusk twilight".`),t}findElementsByRole(e,t){return Array.from(e.querySelectorAll(`[${Nn}]`)).filter(e=>this.getTokenList(e.getAttribute(Nn)).includes(t))}scheduleRuntimeApply(){null!==this.runtimeFrameId&&window.cancelAnimationFrame(this.runtimeFrameId),this.runtimeFrameId=window.requestAnimationFrame(()=>{this.runtimeFrameId=null,this.applyRuntimeSvgState()})}applyRuntimeSvgState(){const e=this.renderRoot.querySelector(".svg-stage svg");if(!e)return;e.setAttribute("data-cb-weather-background-runtime-active","true");const t=this.getWeatherCondition(),i=this.getSolarContext(),n=this.getSkyPalette(t,i.phase),r=this.getWeatherAnimationVariables(t,i.phase),o=this.getWeatherTokens(t);this.applyRuntimeStateVariables(e,t,o,i),this.applySkyPalette(e,n),this.applyWeatherAnimationVariables(e,r),this.applyAnimationState(e,this.areAnimationsEnabled()),this.applyConditionalVisibility(e,o,i.phaseTokens),this.applySunPosition(e,i,o)}applyRuntimeStateVariables(e,t,i,n){const r=this.getSunState(),o=null===n.progress?"none":this.clampDecimal(n.progress,4),s={weather:t,weatherTokens:Array.from(i),solarPhase:n.phase,solarPhaseTokens:Array.from(n.phaseTokens),sunVisible:n.sunVisible,sunProgress:o,sunState:(null==r?void 0:r.state)??"unknown"};e.style.setProperty("--cb-weather-background-state",JSON.stringify(s)),e.style.setProperty("--cb-weather-background-current-weather",t),e.style.setProperty("--cb-weather-background-current-weather-tokens",Array.from(i).join(" ")),e.style.setProperty("--cb-weather-background-current-phase",n.phase),e.style.setProperty("--cb-weather-background-current-phase-tokens",Array.from(n.phaseTokens).join(" ")),e.style.setProperty("--cb-weather-background-sun-visible",n.sunVisible?"1":"0"),e.style.setProperty("--cb-weather-background-sun-progress",o),e.style.setProperty("--cb-weather-background-sun-state",(null==r?void 0:r.state)??"unknown")}applySkyPalette(e,t){e.style.setProperty("--cb-weather-background-sky-top",t.top),e.style.setProperty("--cb-weather-background-sky-middle",t.middle),e.style.setProperty("--cb-weather-background-sky-bottom",t.bottom),e.style.setProperty("--cb-weather-background-cloud-opacity",t.cloudOpacity);const i=`cb-weather-background-sky-${this.getSafeBlockId()}`,n=this.ensureRuntimeSkyGradient(e,i),r=Array.from(n.querySelectorAll("stop")),o=[t.top,t.middle,t.bottom],s=["0%","58%","100%"];r.forEach((e,t)=>{e.setAttribute("offset",s[t]),e.setAttribute("stop-color",o[t])}),this.findElementsByRole(e,"sky").forEach(e=>{e.setAttribute("fill",`url(#${i})`)})}applyWeatherAnimationVariables(e,t){e.style.setProperty("--cb-weather-background-cloud-speed",t.cloudSpeed),e.style.setProperty("--cb-weather-background-cloud-bob-speed",t.cloudBobSpeed),e.style.setProperty("--cb-weather-background-rain-speed",t.rainSpeed),e.style.setProperty("--cb-weather-background-rain-opacity",t.rainOpacity),e.style.setProperty("--cb-weather-background-pouring-speed",t.pouringSpeed),e.style.setProperty("--cb-weather-background-pouring-opacity",t.pouringOpacity),e.style.setProperty("--cb-weather-background-snow-speed",t.snowSpeed),e.style.setProperty("--cb-weather-background-snow-opacity",t.snowOpacity),e.style.setProperty("--cb-weather-background-hail-speed",t.hailSpeed),e.style.setProperty("--cb-weather-background-hail-opacity",t.hailOpacity),e.style.setProperty("--cb-weather-background-lightning-speed",t.lightningSpeed),e.style.setProperty("--cb-weather-background-lightning-intensity",t.lightningIntensity),e.style.setProperty("--cb-weather-background-wind-speed",t.windSpeed),e.style.setProperty("--cb-weather-background-wind-opacity",t.windOpacity),e.style.setProperty("--cb-weather-background-fog-speed",t.fogSpeed),e.style.setProperty("--cb-weather-background-exceptional-speed",t.exceptionalSpeed),e.style.setProperty("--cb-weather-background-exceptional-opacity",t.exceptionalOpacity),e.style.setProperty("--cb-weather-background-star-speed",t.starSpeed),e.style.setProperty("--cb-weather-background-star-opacity",t.starOpacity),e.style.setProperty("--cb-weather-background-sun-pulse-speed",t.sunPulseSpeed)}applyAnimationState(e,t){e.dataset.cbWeatherBackgroundAnimations=t?"enabled":"disabled",e.style.setProperty("--cb-weather-background-animation-play-state",t?"running":"paused");try{t?e.unpauseAnimations():e.pauseAnimations()}catch(i){}}ensureRuntimeSkyGradient(e,t){const i="http://www.w3.org/2000/svg";let n=e.querySelector(`defs[${jn}="true"]`);n||(n=document.createElementNS(i,"defs"),n.setAttribute(jn,"true"),e.insertBefore(n,e.firstChild));let r=n.querySelector(`#${t}`);if(!r){r=document.createElementNS(i,"linearGradient"),r.setAttribute("id",t),r.setAttribute("x1","0"),r.setAttribute("y1","0"),r.setAttribute("x2","0"),r.setAttribute("y2","1");for(let e=0;e<3;e+=1)r.appendChild(document.createElementNS(i,"stop"));n.appendChild(r)}return r}applyConditionalVisibility(e,t,i){e.querySelectorAll(`[${zn}], [${Vn}]`).forEach(e=>{this.setSvgElementVisible(e,this.shouldShowForRuntimeConditions(e,t,i))})}shouldShowForRuntimeConditions(e,t,i){const n=this.matchesTokens(e.getAttribute(zn),t),r=this.matchesTokens(e.getAttribute(Vn),i);return n&&r}applySunPosition(e,t,i){const n=this.findElementsByRole(e,"sun-arc").find(e=>e instanceof SVGPathElement),r=this.findElementsByRole(e,"sun");if(!n||0===r.length)return;const o=t.progress;if(t.sunVisible&&null!==o)try{const e=n.getPointAtLength(n.getTotalLength()*o);r.forEach(n=>{const r=`${this.getOriginalTransform(n)} translate(${e.x.toFixed(2)} ${e.y.toFixed(2)})`.trim();n.setAttribute("transform",r);const o=this.shouldShowForRuntimeConditions(n,i,t.phaseTokens);this.setSunElementVisible(n,o)})}catch(s){r.forEach(e=>this.setSvgElementVisible(e,!1))}else r.forEach(e=>this.setSvgElementVisible(e,!1))}setSunElementVisible(e,t){t?(e.removeAttribute("display"),e.style.display=""):this.setSvgElementVisible(e,!1)}setSvgElementVisible(e,t){if(e.hasAttribute(Fn)||e.setAttribute(Fn,e.getAttribute("display")||e.style.display||""),t){const t=e.getAttribute(Fn)||"";return t?e.setAttribute("display",t):e.removeAttribute("display"),void(e.style.display="")}e.setAttribute("display","none"),e.style.display="none"}getOriginalTransform(e){return e.hasAttribute(Wn)||e.setAttribute(Wn,e.getAttribute("transform")||""),e.getAttribute(Wn)||""}getWeatherCondition(){const e=this.getEntityState(),t=String((null==e?void 0:e.state)||"").toLowerCase();return this.isWeatherCondition(t)?t:"exceptional"}isWeatherCondition(e){return qn.includes(e)}getWeatherTokens(e){const t=new Set([e]);return"pouring"===e&&t.add("rainy"),"lightning-rainy"===e&&(t.add("lightning"),t.add("rainy")),"snowy-rainy"===e&&(t.add("snowy"),t.add("rainy")),"windy-variant"===e&&t.add("windy"),"clear-night"===e&&(t.add("night"),t.add("clear")),t}getSolarContext(){const e=[],t=this.getSunState();if(!t)return e.push(`${Gn} entity not found.`),this.buildSolarContext(null,"night",e);const i=this.calculateSunProgress(t,e),n=this.calculateSolarPhase(t,i);return this.buildSolarContext(i,n,e)}buildSolarContext(e,t,i){const n=new Set([t]),r=null!==e&&e>=0&&e<=1;return"dawn"!==t&&"dusk"!==t||(n.add("twilight"),n.add("day")),r?n.add("sun-up"):n.add("sun-down"),{progress:e,phase:t,phaseTokens:n,sunVisible:r,warnings:i}}calculateSunProgress(e,t){var i,n;const r=this.parseDate(null==(i=e.attributes)?void 0:i.next_rising),o=this.parseDate(null==(n=e.attributes)?void 0:n.next_setting);if(!r||!o)return t.push(`${Gn} is missing next_rising or next_setting attributes.`),null;const s=Date.now(),a="above_horizon"===e.state,l=this.isSunRising(e);return a?this.normalizeBetween(s,r.getTime()-Un,o.getTime()):l?this.normalizeBetween(s,r.getTime(),o.getTime()):this.normalizeBetween(s,r.getTime()-Un,o.getTime()-Un)}calculateSolarPhase(e,t){var i,n,r,o;if(null!==t&&t>=0&&t<=1)return t<=.12?"dawn":t>=.88?"dusk":"day";const s=Date.now(),a=this.parseDate(null==(i=e.attributes)?void 0:i.next_dawn),l=this.parseDate(null==(n=e.attributes)?void 0:n.next_rising),c=this.parseDate(null==(r=e.attributes)?void 0:r.next_setting),d=this.parseDate(null==(o=e.attributes)?void 0:o.next_dusk);if(a&&l&&s>=a.getTime()&&s<=l.getTime())return"dawn";if(c&&d){const e=c.getTime()-Un,t=d.getTime()-Un;if(s>=e&&s<=t)return"dusk"}return null!==t&&t<0&&t>-.12?"dawn":null!==t&&t>1&&t<1.12?"dusk":"night"}getSkyPalette(e,t){if("night"===t)return"clear-night"===e?{top:"#050b18",middle:"#0b1630",bottom:"#182a46",cloudOpacity:"0.72"}:"lightning"===e||"lightning-rainy"===e||"exceptional"===e?{top:"#030711",middle:"#111827",bottom:"#263044",cloudOpacity:"0.9"}:{top:"#08111f",middle:"#151d2b",bottom:"#263446",cloudOpacity:"0.86"};if("dawn"===t)return this.adjustTwilightPalette(e,{top:"#324b83",middle:"#f09b72",bottom:"#ffe4aa",cloudOpacity:"0.84"});if("dusk"===t)return this.adjustTwilightPalette(e,{top:"#2d356f",middle:"#d97873",bottom:"#ffc477",cloudOpacity:"0.88"});switch(e){case"cloudy":case"partlycloudy":return{top:"#7898ad",middle:"#b7c8d1",bottom:"#e2e7e8",cloudOpacity:"0.96"};case"fog":return{top:"#a8b4bb",middle:"#cdd4d7",bottom:"#ebeeee",cloudOpacity:"0.74"};case"hail":case"snowy":case"snowy-rainy":return{top:"#86a8bd",middle:"#c9dce5",bottom:"#f6fbff",cloudOpacity:"0.88"};case"rainy":case"pouring":return{top:"#33485f",middle:"#6c7c8b",bottom:"#aab4bc",cloudOpacity:"0.92"};case"lightning":case"lightning-rainy":return{top:"#1b2231",middle:"#424b5e",bottom:"#7c8795",cloudOpacity:"0.95"};case"exceptional":return{top:"#442640",middle:"#9a5756",bottom:"#e0a06c",cloudOpacity:"0.9"};case"windy":case"windy-variant":return{top:"#68a7d0",middle:"#a4d0ea",bottom:"#e0f3fa",cloudOpacity:"0.72"};case"clear-night":return{top:"#050b18",middle:"#0b1630",bottom:"#182a46",cloudOpacity:"0.72"};default:return{top:"#61b8f4",middle:"#a8dcff",bottom:"#e8f7ff",cloudOpacity:"0.68"}}}adjustTwilightPalette(e,t){switch(e){case"cloudy":case"partlycloudy":case"fog":return{top:"#5f7185",middle:"#c29286",bottom:"#e1c8a3",cloudOpacity:"0.94"};case"rainy":case"pouring":case"lightning":case"lightning-rainy":case"exceptional":return{top:"#202738",middle:"#705365",bottom:"#aa7664",cloudOpacity:"0.95"};case"snowy":case"snowy-rainy":case"hail":return{top:"#6d829b",middle:"#d4b6a5",bottom:"#f4ddbd",cloudOpacity:"0.88"};default:return t}}getWeatherAnimationVariables(e,t){const i={cloudSpeed:"52s",cloudBobSpeed:"9s",rainSpeed:"0.9s",rainOpacity:"0.76",pouringSpeed:"0.55s",pouringOpacity:"0.9",snowSpeed:"7s",snowOpacity:"0.94",hailSpeed:"1.4s",hailOpacity:"0.92",lightningSpeed:"2.8s",lightningIntensity:"0.78",windSpeed:"2.8s",windOpacity:"0.82",fogSpeed:"24s",exceptionalSpeed:"3.6s",exceptionalOpacity:"0.78",starSpeed:"4s",starOpacity:"night"===t?"0.96":"0.35",sunPulseSpeed:"day"===t?"5s":"3.6s"};switch(e){case"cloudy":return{...i,cloudSpeed:"42s",cloudBobSpeed:"10s"};case"partlycloudy":return{...i,cloudSpeed:"58s",cloudBobSpeed:"11s"};case"rainy":return{...i,cloudSpeed:"38s",rainSpeed:"0.82s",rainOpacity:"0.78"};case"pouring":return{...i,cloudSpeed:"34s",rainSpeed:"0.72s",pouringSpeed:"0.48s",pouringOpacity:"0.96"};case"lightning":return{...i,cloudSpeed:"32s",lightningSpeed:"2.2s",lightningIntensity:"0.88"};case"lightning-rainy":return{...i,cloudSpeed:"30s",rainSpeed:"0.7s",rainOpacity:"0.86",lightningSpeed:"2.1s",lightningIntensity:"0.94"};case"snowy":return{...i,cloudSpeed:"46s",snowSpeed:"8.5s",snowOpacity:"0.96"};case"snowy-rainy":return{...i,cloudSpeed:"40s",rainSpeed:"1s",rainOpacity:"0.58",snowSpeed:"7.2s"};case"hail":return{...i,cloudSpeed:"34s",hailSpeed:"1.05s",hailOpacity:"0.96"};case"fog":return{...i,cloudSpeed:"64s",cloudBobSpeed:"14s",fogSpeed:"30s"};case"windy":return{...i,cloudSpeed:"26s",windSpeed:"2.1s",windOpacity:"0.84"};case"windy-variant":return{...i,cloudSpeed:"20s",windSpeed:"1.55s",windOpacity:"0.92"};case"exceptional":return{...i,cloudSpeed:"24s",lightningSpeed:"1.9s",lightningIntensity:"0.9",windSpeed:"1.8s",exceptionalSpeed:"2.4s",exceptionalOpacity:"0.86"};case"clear-night":return{...i,starSpeed:"3.6s",starOpacity:"0.98",cloudSpeed:"70s"};default:return i}}getVisibleWarnings(){const e=[];return this.shouldShowSvgWarnings()&&(this.svgLoadWarning&&e.push(this.svgLoadWarning),e.push(...this.svgWarnings)),e.push(...this.getRuntimeWarnings()),Array.from(new Set(e))}getRuntimeWarnings(){const e=[],t=this.resolvedEntityId();if(t)if(t.startsWith("weather."))if(this.hass&&!this.hass.states[t])e.push(`Weather entity "${t}" was not found in Home Assistant states.`);else{const t=this.getEntityState(),i=String((null==t?void 0:t.state)||"").toLowerCase();i&&!this.isWeatherCondition(i)&&e.push(`Unsupported weather state "${i}"; using exceptional fallback.`)}else e.push(`Configured entity "${t}" is not a weather entity.`);else e.push("Weather entity is not configured.");return this.hass&&!this.hass.states[Gn]?e.push(`${Gn} was not found in Home Assistant states.`):e.push(...this.getSolarContext().warnings),e}getSunState(){var e;return(null==(e=this.hass)?void 0:e.states[Gn])??null}getSvgSource(){return"media"===this.resolveProperty("svgSource","default")?"media":"default"}getDefaultSvgBackground(){const e=this.resolveProperty("defaultSvgBackground",Hn);return Xn.find(t=>t.id===e)??Xn[0]}shouldShowSvgWarnings(){return this.resolvePropertyAsBoolean("showSvgWarnings")}areAnimationsEnabled(){return this.resolvePropertyAsBoolean("animationsEnabled")}syncUpdateTimer(){const e=this.getUpdateIntervalMinutes();this.updateTimerMinutes===e&&null!==this.updateTimerId||(this.clearUpdateTimer(),this.updateTimerMinutes=e,this.updateTimerId=window.setInterval(()=>{this.requestUpdate(),this.scheduleRuntimeApply()},60*e*1e3))}clearUpdateTimer(){null!==this.updateTimerId&&(window.clearInterval(this.updateTimerId),this.updateTimerId=null)}getUpdateIntervalMinutes(){const e=this.resolvePropertyAsNumber("sunPositionUpdateMinutes",10),t=Math.min(60,Math.max(5,e));return 5*Math.round(t/5)}getTokenList(e){return e?e.split(/\s+/).map(e=>e.trim().toLowerCase()).filter(Boolean):[]}matchesTokens(e,t){const i=this.getTokenList(e);return 0===i.length||(!!i.includes("all")||i.some(e=>t.has(e)))}parseDate(e){if("string"!=typeof e&&"number"!=typeof e)return null;const t=new Date(e);return Number.isNaN(t.getTime())?null:t}normalizeBetween(e,t,i){const n=i-t;return!Number.isFinite(n)||n<=0?null:(e-t)/n}clampDecimal(e,t){return Number.isFinite(e)?e.toFixed(t).replace(/\.?0+$/,""):"none"}isSunRising(e){var t;const i=null==(t=e.attributes)?void 0:t.rising;return!0===i||"true"===i}getSafeBlockId(){var e;return((null==(e=this.block)?void 0:e.id)||"default").replace(/[^a-zA-Z0-9_-]/g,"-")}getErrorMessage(e){return e instanceof Error?e.message:String(e)}};Yn.styles=[...Dt.styles,l`
            :host {
                display: block;
                padding: 0;
                overflow: hidden;
                min-width: 1px;
                min-height: 1px;
                background: transparent;
            }

            .weather-background {
                position: relative;
                width: 100%;
                height: auto;
                overflow: hidden;
            }

            .svg-stage svg {
                display: block;
                width: 100%;
                height: 100%;
            }

            .svg-stage.animations-disabled svg,
            .svg-stage.animations-disabled svg *,
            .svg-stage.animations-disabled svg *::before,
            .svg-stage.animations-disabled svg *::after {
                animation: none !important;
                transition: none !important;
            }

            .warnings {
                position: absolute;
                z-index: 2;
                top: 8px;
                left: 8px;
                right: 8px;
                max-height: calc(100% - 16px);
                overflow: auto;
                box-sizing: border-box;
                padding: 8px 10px;
                border: 1px solid rgba(255, 214, 102, 0.7);
                border-radius: 6px;
                background: rgba(38, 31, 16, 0.88);
                color: #fff6d8;
                font-size: 12px;
                line-height: 1.35;
                pointer-events: none;
                text-align: left;
            }

            .warning + .warning {
                margin-top: 4px;
            }
        `],On([c()],Yn.prototype,"svgMarkup",2),On([c()],Yn.prototype,"svgWarnings",2),On([c()],Yn.prototype,"svgLoadWarning",2),Yn=On([p("block-weather-background")],Yn);var Kn=Object.defineProperty,Qn=Object.getOwnPropertyDescriptor,Zn=(e,t,i,n)=>{for(var r,o=n>1?void 0:n?Qn(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Kn(t,i,o),o};const Jn=[{key:"precipitation_probability",prop:"show_precipitation_probability",label:"Precipitation Probability",targetId:"secondary-precipitation-probability",defaultValue:!0},{key:"precipitation",prop:"show_precipitation",label:"Precipitation Amount",targetId:"secondary-precipitation",defaultValue:!1},{key:"wind_speed",prop:"show_wind_speed",label:"Wind Speed",targetId:"secondary-wind-speed",defaultValue:!0},{key:"wind_bearing",prop:"show_wind_bearing",label:"Wind Direction",targetId:"secondary-wind-bearing",defaultValue:!1},{key:"humidity",prop:"show_humidity",label:"Humidity",targetId:"secondary-humidity",defaultValue:!1},{key:"dew_point",prop:"show_dew_point",label:"Dew Point",targetId:"secondary-dew-point",defaultValue:!1},{key:"cloud_coverage",prop:"show_cloud_coverage",label:"Cloud Cover",targetId:"secondary-cloud-coverage",defaultValue:!1},{key:"uv_index",prop:"show_uv_index",label:"UV Index",targetId:"secondary-uv-index",defaultValue:!1},{key:"pressure",prop:"show_pressure",label:"Pressure",targetId:"secondary-pressure",defaultValue:!1},{key:"apparent_temperature",prop:"show_apparent_temperature",label:"Feels Like",targetId:"secondary-apparent-temperature",defaultValue:!1}],er={"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",exceptional:"mdi:alert-circle-outline",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant"},tr={"clear-night":"#818cf8",cloudy:"#94a3b8",exceptional:"#f97316",fog:"#a8a29e",hail:"#67e8f9",lightning:"#a78bfa","lightning-rainy":"#8b5cf6",partlycloudy:"#fbbf24",pouring:"#0ea5e9",rainy:"#38bdf8",snowy:"#bae6fd","snowy-rainy":"#7dd3fc",sunny:"#f59e0b",windy:"#5eead4","windy-variant":"#2dd4bf"},ir=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"],nr={thermal:{colors:["#60a5fa","#f59e0b"],mode:"rgb"},blue:{colors:["#bfdbfe","#60a5fa","#3b82f6"],mode:"hsl"},amber:{colors:["#fde68a","#f59e0b","#d97706"],mode:"hsl"},teal:{colors:["#99f6e4","#2dd4bf","#0d9488"],mode:"hsl"}},rr={humidity:{humidity:["#f59e0b","#22c55e","#2563eb"],blue:["#bae6fd","#0284c7"],teal:["#ccfbf1","#0f766e"]},cloud_coverage:{cloud:["#f8fafc","#cbd5e1","#64748b"],storm:["#e0f2fe","#64748b","#334155"],blue:["#dbeafe","#1d4ed8"]},uv_index:{uv:["#22c55e","#eab308","#f97316","#ef4444","#8b5cf6"],solar:["#22c55e","#fde047","#f97316"],alert:["#84cc16","#facc15","#dc2626"]}};let or=class extends Dt{constructor(){super(...arguments),this.forecast=[],this.forecastStatus="idle",this.availableAttributeKeys=new Set,this.refreshTimerId=null,this.requestSequence=0,this.loadingKey="",this.loadedKey="",this.forecastEntityId="",this.availableAttributeSignature=""}static getBlockConfig(){return{sinceVersion:"2.3.0",definition:{label:"Hourly Forecast",icon:'<ha-icon icon="mdi:clock-outline"></ha-icon>',category:"weather"},defaults:{requireEntity:!0,props:{hours:{value:12},layout_direction:{value:"horizontal"},horizontal_column_mode:{value:"auto"},auto_column_min_width:{value:90},auto_column_max_width:{value:""},custom_column_width:{value:"52px"},show_now_indicator:{value:!0},show_day_separator:{value:!0},show_condition_icons:{value:!0},show_temperature:{value:!0},show_temperature_unit:{value:!0},show_thermal_bars:{value:!0},bar_height:{value:40},vertical_bar_width_mode:{value:"fill"},vertical_bar_width:{value:120},show_rain_badge:{value:!0},rain_threshold:{value:0},color_ramp:{value:"thermal"},temperature_color_range_mode:{value:"forecast"},temperature_color_min:{value:0},temperature_color_max:{value:40},color_cold:{value:"#60a5fa"},color_warm:{value:"#f59e0b"},color_ramp_interpolation:{value:"rgb"},color_ramp_reverse_hue:{value:!1},humidity_color_ramp:{value:"humidity"},humidity_color_low:{value:"#f59e0b"},humidity_color_high:{value:"#2563eb"},cloud_coverage_color_ramp:{value:"cloud"},cloud_coverage_color_low:{value:"#f8fafc"},cloud_coverage_color_high:{value:"#64748b"},uv_index_color_ramp:{value:"uv"},uv_index_color_low:{value:"#22c55e"},uv_index_color_high:{value:"#8b5cf6"},show_precipitation_probability:{value:!0},show_precipitation:{value:!1},show_wind_speed:{value:!0},show_wind_bearing:{value:!1},show_humidity:{value:!1},show_dew_point:{value:!1},show_cloud_coverage:{value:!1},show_uv_index:{value:!1},show_pressure:{value:!1},show_apparent_temperature:{value:!1}}},entityDefaults:{mode:"inherited"},actionTargets:{header:{label:"Header",description:"Forecast header"},strip:{label:"Forecast Strip",description:"Scrollable forecast area"},hour:{label:"Hour",description:"Hourly forecast item"}}}}getPanelConfig(){const e={or:[{prop:"show_temperature",eq:!0},{prop:"show_thermal_bars",eq:!0}]},t={and:[e,{prop:"color_ramp",neq:"none"}]},i={and:[t,{prop:"temperature_color_range_mode",eq:"custom"}]},n=[{id:"general",label:"General",traits:[{type:"slider",name:"hours",label:"Hours",min:4,max:24,step:1,binding:{type:"slider",min:4,max:24,step:1}}]},{id:"appearance",label:"Appearance",traits:[{type:"select",name:"layout_direction",label:"Layout",options:[{value:"horizontal",label:"Horizontal"},{value:"vertical",label:"Vertical"}]},{type:"select",name:"horizontal_column_mode",label:"Horizontal Columns",options:[{value:"auto",label:"Auto"},{value:"fill",label:"Fill"},{value:"custom",label:"Custom"}],visible:{prop:"layout_direction",eq:"horizontal"}},{type:"number",name:"auto_column_min_width",label:"Column Min Width (px)",min:1,step:1,visible:{and:[{prop:"layout_direction",eq:"horizontal"},{prop:"horizontal_column_mode",eq:"auto"}]}},{type:"text",name:"auto_column_max_width",label:"Column Max Width",placeholder:"Optional, e.g. 90px",visible:{and:[{prop:"layout_direction",eq:"horizontal"},{prop:"horizontal_column_mode",eq:"auto"}]}},{type:"text",name:"custom_column_width",label:"Column Width",placeholder:"52px or 16%",visible:{and:[{prop:"layout_direction",eq:"horizontal"},{prop:"horizontal_column_mode",eq:"custom"}]}},{type:"checkbox",name:"show_now_indicator",label:"Show Now Indicator"},{type:"checkbox",name:"show_day_separator",label:"Show Day Separator"},{type:"checkbox",name:"show_condition_icons",label:"Show Condition Icons"},{type:"checkbox",name:"show_temperature",label:"Show Hourly Temperature"},{type:"checkbox",name:"show_temperature_unit",label:"Show Temperature Unit",visible:{prop:"show_temperature",eq:!0}},{type:"checkbox",name:"show_thermal_bars",label:"Show Thermal Bars"},{type:"slider",name:"bar_height",label:"Bar Height",min:10,max:100,step:1,visible:{and:[{prop:"layout_direction",eq:"horizontal"},{prop:"show_thermal_bars",eq:!0}]}},{type:"select",name:"vertical_bar_width_mode",label:"Vertical Bar Width",options:[{value:"fill",label:"Fill"},{value:"custom",label:"Custom"}],visible:{and:[{prop:"layout_direction",eq:"vertical"},{prop:"show_thermal_bars",eq:!0}]}},{type:"slider",name:"vertical_bar_width",label:"Custom Bar Width",min:24,max:260,step:1,visible:{and:[{prop:"layout_direction",eq:"vertical"},{prop:"show_thermal_bars",eq:!0},{prop:"vertical_bar_width_mode",eq:"custom"}]}},{type:"select",name:"color_ramp",label:"Temperature Color Ramp",options:[{value:"none",label:"None"},{value:"thermal",label:"Thermal"},{value:"blue",label:"Blue"},{value:"amber",label:"Amber"},{value:"teal",label:"Teal"},{value:"custom",label:"Custom"}],visible:e},{type:"color",name:"color_cold",label:"Cold Color",visible:{and:[t,{prop:"color_ramp",eq:"custom"}]}},{type:"color",name:"color_warm",label:"Warm Color",visible:{and:[t,{prop:"color_ramp",eq:"custom"}]}},{type:"select",name:"color_ramp_interpolation",label:"Color Interpolation",options:[{value:"rgb",label:"Linear (RGB)"},{value:"hsl",label:"Chromatic (HSL)"}],visible:{and:[t,{prop:"color_ramp",eq:"custom"}]}},{type:"checkbox",name:"color_ramp_reverse_hue",label:"Reverse hue path",visible:{and:[e,{prop:"color_ramp",eq:"custom"},{prop:"color_ramp_interpolation",eq:"hsl"}]}},{type:"select",name:"temperature_color_range_mode",label:"Temperature Color Range",options:[{value:"forecast",label:"Visible Forecast"},{value:"custom",label:"Custom"}],visible:t},{type:"number",name:"temperature_color_min",label:"Temperature Color Min",step:1,visible:i},{type:"number",name:"temperature_color_max",label:"Temperature Color Max",step:1,visible:i},{type:"checkbox",name:"show_rain_badge",label:"Show Rain Badge"},{type:"slider",name:"rain_threshold",label:"Rain Threshold",min:0,max:50,step:5}]}],r=this.getSecondaryAttributeTraits();return r.length>0&&n.push({id:"secondary",label:"Secondary Data",traits:r}),{properties:{groups:n},targetStyles:{block:{styles:{preset:"full"}},container:{label:"Container",description:"Forecast block surface",styles:{preset:"full"}},header:{label:"Header",description:"Fixed forecast header",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},title:{label:"Title",description:"Header title and icon",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},badge:{label:"Rain Badge",description:"Conditional precipitation badge",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},range:{label:"Temperature Range",description:"Visible high and low temperatures",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"range-high":{label:"Range High",description:"Maximum temperature in the range",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"range-low":{label:"Range Low",description:"Minimum temperature in the range",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},strip:{label:"Forecast Strip",description:"Scrollable hourly forecast area",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},hour:{label:"Hour Item",description:"Single forecast hour item",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},now:{label:"Now Item",description:"Current hour item",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},time:{label:"Time Label",description:"Hourly time label",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},icon:{label:"Condition Icon",description:"Weather condition icon",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},temperature:{label:"Temperature",description:"Hourly temperature value",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"temperature-unit":{label:"Temperature Unit",description:"Unit of measure shown with hourly temperature",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"time-meridiem":{label:"AM/PM",description:"Meridiem indicator in 12-hour time format",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},thermalBar:{label:"Thermal Bar",description:"Temperature bar indicator",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},secondary:{label:"Secondary Value",description:"Secondary forecast data rows",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"secondary-icon":{label:"Secondary Icons",description:"All secondary data icons",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},"secondary-unit":{label:"Secondary Units",description:"All secondary data units",styles:{preset:"full",exclude:{groups:["layout","flex"]}}},...this.getSecondaryTargetStyles(),placeholder:{label:"Placeholder",description:"Empty or error message",styles:{preset:"full",exclude:{groups:["layout","flex"]}}}}}}connectedCallback(){super.connectedCallback(),this.syncRefreshTimer(),this.ensureForecastLoaded(!0)}disconnectedCallback(){this.clearRefreshTimer(),super.disconnectedCallback()}updated(e){super.updated(e),this.syncRefreshTimer(),(e.has("block")||e.has("entity")||e.has("hass"))&&this.ensureForecastLoaded(!1)}getBlockEntities(){const e=this.resolvedEntityId();return e?[e]:[]}render(){var e;const t=this.resolvedEntityId(),i=t?(null==(e=this.hass)?void 0:e.states[t])??null:null;if(!t)return this.renderPlaceholder("Select a weather entity");if(!t.startsWith("weather."))return this.renderPlaceholder("Select a weather entity");if(this.hass&&!i)return this.renderPlaceholder("Weather entity not found");if("unsupported"===this.forecastStatus)return this.renderPlaceholder("This entity does not provide hourly forecasts");if("empty"===this.forecastStatus)return this.renderPlaceholder("No forecast data available");if("ready"!==this.forecastStatus||0===this.forecast.length)return this.renderPlaceholder("Loading hourly forecast");const n=this.getVisibleForecast();if(0===n.length)return this.renderPlaceholder("No forecast data available");const r=this.getLayoutDirection(),o=this.getTemperatures(n),s=o.length>0?Math.min(...o):null,a=o.length>0?Math.max(...o):null,l=this.getTemperatureColorRange(s,a),c=this.renderHeader(n,s,a),d=this.getEnabledSecondaryKeys(),p=this.getBarHeight(),g=this.getHorizontalColumnMode(),m=this.getVerticalBarWidthMode(),v=this.resolvePropertyAsBoolean("show_condition_icons"),y=this.resolvePropertyAsBoolean("show_temperature"),b=this.resolvePropertyAsBoolean("show_thermal_bars"),f=this.getTargetStyle("container"),k={"--fc-thermal-bar-height":`${p}px`,"--fc-vertical-secondary-columns":this.getVerticalSecondaryColumns(d),...this.getHorizontalColumnStyles(g),...this.getVerticalBarStyles(m),...this.getTargetStyle("strip")},x=["strip",r,"horizontal"===r?g:`${m}-bars`,v?"":"no-icons",y?"":"no-temperature",b?"":"no-bars",d.length>0?"":"no-secondary",this.getTargetActiveClass("strip")].filter(Boolean).join(" ");return h`
            <div
                class="forecast-card ${this.getTargetActiveClass("container")}"
                style=${u(f)}
                data-style-target="container"
            >
                ${c}
                <div
                    class=${x}
                    style=${u(k)}
                    data-style-target="strip"
                    data-action-target="strip"
                >
                    ${n.map((e,t)=>this.renderForecastHour(e,t,n,s,a,l,d,p,r))}
                </div>
            </div>
        `}renderHeader(e,t,i){const n=this.getTargetStyle("header"),r=this.getTargetStyle("title"),o=this.getTargetStyle("range"),s=this.getTargetStyle("range-high"),a=this.getTargetStyle("range-low"),l=this.getRainBadge(e),c=this.getTemperatureRangeColor("max"),p=this.getTemperatureRangeColor("min");return h`
            <div
                class="header ${this.getTargetActiveClass("header")}"
                style=${u(n)}
                data-style-target="header"
                data-action-target="header"
            >
                <div
                    class="title ${this.getTargetActiveClass("title")}"
                    style=${u(r)}
                    data-style-target="title"
                >
                    <ha-icon icon="mdi:clock-outline"></ha-icon>
                    <span>Hourly forecast</span>
                </div>
                ${l}
                ${null!==t&&null!==i?h`
                    <div
                        class="range ${this.getTargetActiveClass("range")}"
                        style=${u(o)}
                        data-style-target="range"
                    >
                        <span
                            class="range-part ${this.getTargetActiveClass("range-high")}"
                            style=${u({...this.getColorStyle(c),...s})}
                            data-style-target="range-high"
                        >
                            <ha-icon icon="mdi:arrow-up-thin"></ha-icon>
                            ${this.formatWeatherValue(i,"temperature",0)}
                        </span>
                        <span
                            class="range-part ${this.getTargetActiveClass("range-low")}"
                            style=${u({...this.getColorStyle(p),...a})}
                            data-style-target="range-low"
                        >
                            <ha-icon icon="mdi:arrow-down-thin"></ha-icon>
                            ${this.formatWeatherValue(t,"temperature",0)}
                        </span>
                    </div>
                `:d}
            </div>
        `}renderForecastHour(e,t,i,n,r,o,s,a,l){const c=0===t&&this.resolvePropertyAsBoolean("show_now_indicator"),p=this.shouldRenderDaySeparator(e,t,i),g=this.resolvePropertyAsBoolean("show_condition_icons"),m=this.resolvePropertyAsBoolean("show_temperature"),v=this.resolvePropertyAsBoolean("show_thermal_bars"),y=this.getNumberValue(e.temperature),b=null===y||null===o.min||null===o.max?void 0:this.getTemperatureColor(y,o.min,o.max),f={...this.getTargetStyle("hour"),...c?this.getTargetStyle("now"):{}},k=this.getTargetStyle("time"),x={color:this.getConditionColor(e.condition),...this.getTargetStyle("icon")},w={color:b??"var(--fc-text)",...this.getTargetStyle("temperature")},S=this.normalizeCondition(e.condition),_=["hour",c?"now":"",p?"day-separator":"",this.getTargetActiveClass("hour"),c?this.getTargetActiveClass("now"):""].filter(Boolean).join(" ");return h`
            <div
                class=${_}
                style=${u(f)}
                data-style-target=${c?"now":"hour"}
                data-action-target="hour"
            >
                <div
                    class="time ${this.getTargetActiveClass("time")}"
                    style=${u(k)}
                    data-style-target="time"
                >
                    ${c?"Now":this.renderForecastTime(e.datetime)}
                </div>
                ${g?h`
                    <ha-icon
                        class="condition-icon ${this.getTargetActiveClass("icon")}"
                        style=${u(x)}
                        data-style-target="icon"
                        .icon=${er[S]??er.exceptional}
                    ></ha-icon>
                `:d}
                ${m?h`
                    <div
                        class="temperature ${this.getTargetActiveClass("temperature")}"
                        style=${u(w)}
                        data-style-target="temperature"
                    >
                        ${this.renderTemperatureValue(y)}
                    </div>
                `:d}
                ${v&&null!==y?this.renderThermalBar(y,n,r,a,b??"var(--fc-accent)",l):d}
                ${"vertical"===l?s.map((t,i)=>this.renderVerticalSecondaryCell(t,e,i)):h`
                        <div class="secondary-stack">
                            ${s.map(t=>this.renderSecondaryValue(t,e))}
                        </div>
                    `}
            </div>
        `}renderThermalBar(e,t,i,n,r,o){const s=null===t||null===i?.5:this.normalizeTemperature(e,t,i),a="vertical"===o?{width:6+94*s+"%",background:r,...this.getTargetStyle("thermalBar")}:{height:4+s*(n-4)+"px",background:r,...this.getTargetStyle("thermalBar")};return h`
            <div class="thermal-bar-wrap">
                <span
                    class="thermal-bar ${this.getTargetActiveClass("thermalBar")}"
                    style=${u(a)}
                    data-style-target="thermalBar"
                ></span>
            </div>
        `}renderSecondaryValue(e,t){const i=t[e];if(null==i||""===i)return d;const n=this.getTargetStyle("secondary");switch(e){case"precipitation_probability":return this.renderPrecipitationProbability(t,n);case"precipitation":return this.renderPrecipitationAmount(t,n);case"wind_speed":return this.renderWind(t,n);case"wind_bearing":return this.renderWindDirection(t,n);case"humidity":return this.renderSecondaryMeasureValue(e,"mdi:water-percent",i,"humidity",0,{...this.getSecondaryColorStyle(e,i),...n});case"dew_point":return this.renderSecondaryMeasureValue(e,"mdi:thermometer-water",i,"dew_point",0,n);case"cloud_coverage":return this.renderSecondaryMeasureValue(e,"mdi:weather-cloudy",i,"cloud_coverage",0,{...this.getSecondaryColorStyle(e,i),...n});case"uv_index":return this.renderSecondaryMeasureValue(e,"mdi:sun-wireless",i,"uv_index",1,{...this.getSecondaryColorStyle(e,i),...n});case"pressure":return this.renderSecondaryMeasureValue(e,"mdi:gauge",i,"pressure",0,n);case"apparent_temperature":return this.renderSecondaryMeasureValue(e,"mdi:thermometer",i,"apparent_temperature",0,n)}}renderVerticalSecondaryCell(e,t,i){const n={gridColumn:String(5+i)};return h`
            <div class="vertical-secondary-cell" style=${u(n)}>
                ${this.renderSecondaryValue(e,t)}
            </div>
        `}renderPrecipitationProbability(e,t){const i=this.getNumberValue(e.precipitation_probability);if(null===i)return d;const n=this.getRainThreshold();return n>0&&i<n?d:this.renderSecondaryMeasureValue("precipitation_probability","mdi:weather-rainy",i,"precipitation_probability",0,{color:"var(--fc-rain)",...t})}renderPrecipitationAmount(e,t){const i=this.getNumberValue(e.precipitation);return null===i||0===i?d:this.renderSecondaryMeasureValue("precipitation","mdi:weather-pouring",i,"precipitation",1,{color:"var(--fc-rain)",...t})}renderWind(e,t){const i=this.getNumberValue(e.wind_speed);if(null===i)return d;const n=this.getWindBearingDegrees(e.wind_bearing),r=this.getSecondaryTargetId("wind_speed"),o=this.getTargetStyle(r),s={transform:`rotate(${n??0}deg)`},a=this.formatWeatherValueParts(i,"wind_speed",0),l=this.getSecondaryIconTargetId("wind_speed"),c=this.getSecondaryUnitTargetId("wind_speed"),p={...this.getTargetStyle("secondary-icon"),...this.getTargetStyle(l)},g={...this.getTargetStyle("secondary-unit"),...this.getTargetStyle(c)};return h`
            <div
                class="secondary wind-row ${this.getTargetActiveClass("secondary")}"
                style=${u(t)}
                data-style-target="secondary"
            >
                <span
                    class="secondary-content wind-row ${this.getTargetActiveClass(r)}"
                    style=${u(o)}
                    data-style-target=${r}
                >
                    <span class="wind-main">
                        <ha-icon
                            class="${this.getTargetActiveClass("secondary-icon")} ${this.getTargetActiveClass(l)}"
                            style=${u({...s,...p})}
                            data-style-target=${l}
                            icon="mdi:arrow-up"
                        ></ha-icon>
                        <span>${a.value}</span>
                        ${a.unit?h`<span
                            class="${this.getTargetActiveClass("secondary-unit")} ${this.getTargetActiveClass(c)}"
                            style=${u(g)}
                            data-style-target=${c}
                        >${a.unit}</span>`:d}
                    </span>
                </span>
            </div>
        `}renderWindDirection(e,t){const i=this.getWindCardinalDirection(e.wind_bearing);return i?this.renderIconValue("wind_bearing","mdi:compass-outline",i,"",t):d}renderSecondaryMeasureValue(e,t,i,n,r,o){const s=this.formatWeatherValueParts(i,n,r);return this.renderIconValue(e,t,s.value,s.unit,o)}renderIconValue(e,t,i,n,r){const o=this.getSecondaryTargetId(e),s=this.getTargetStyle(o),a=this.getSecondaryIconTargetId(e),l=this.getSecondaryUnitTargetId(e),c={...this.getTargetStyle("secondary-icon"),...this.getTargetStyle(a)},p={...this.getTargetStyle("secondary-unit"),...this.getTargetStyle(l)};return h`
            <div
                class="secondary ${this.getTargetActiveClass("secondary")}"
                style=${u(r)}
                data-style-target="secondary"
            >
                <span
                    class="secondary-content ${this.getTargetActiveClass(o)}"
                    style=${u(s)}
                    data-style-target=${o}
                >
                    <ha-icon
                        class="${this.getTargetActiveClass("secondary-icon")} ${this.getTargetActiveClass(a)}"
                        style=${u(c)}
                        data-style-target=${a}
                        .icon=${t}
                    ></ha-icon>
                    <span>${i}</span>
                    ${n?h`<span
                        class="${this.getTargetActiveClass("secondary-unit")} ${this.getTargetActiveClass(l)}"
                        style=${u(p)}
                        data-style-target=${l}
                    >${n}</span>`:d}
                </span>
            </div>
        `}renderPlaceholder(e){const t=this.getTargetStyle("container"),i=this.getTargetStyle("placeholder");return h`
            <div
                class="forecast-card ${this.getTargetActiveClass("container")}"
                style=${u(t)}
                data-style-target="container"
            >
                <div
                    class="placeholder ${this.getTargetActiveClass("placeholder")}"
                    style=${u(i)}
                    data-style-target="placeholder"
                >
                    ${e}
                </div>
            </div>
        `}async ensureForecastLoaded(e){if(!this.hass)return;const t=this.resolvedEntityId();if(!t||!t.startsWith("weather."))return this.forecastEntityId="",this.setForecastState([],"idle"),void this.setAvailableAttributeKeys(new Set);const i=this.hass.states[t];if(!i)return this.forecastEntityId="",this.setForecastState([],"empty"),void this.setAvailableAttributeKeys(new Set);this.forecastEntityId!==t&&(this.forecastEntityId=t,this.loadedKey="",this.forecast=[],this.forecastStatus="loading",this.setAvailableAttributeKeys(new Set));const n=`${`${t}:${i.state}:${i.last_changed}:${i.last_updated}`}:${this.getHours()}`;if(!e&&(n===this.loadedKey||n===this.loadingKey))return;const r=++this.requestSequence;this.loadingKey=n,this.forecastStatus=this.forecast.length>0?this.forecastStatus:"loading";try{const e=await this.hass.callWS({type:"call_service",domain:"weather",service:"get_forecasts",service_data:{type:"hourly"},target:{entity_id:t},return_response:!0});if(r!==this.requestSequence)return;const i=this.extractForecastFromResponse(e,t);Array.isArray(i)&&0!==i.length?(this.setForecastState(i,"ready"),this.setAvailableAttributeKeys(this.extractAvailableAttributeKeys(i))):(this.setForecastState([],"empty"),this.setAvailableAttributeKeys(new Set)),this.loadedKey=n}catch{if(r!==this.requestSequence)return;this.setForecastState([],"unsupported"),this.setAvailableAttributeKeys(new Set)}finally{r===this.requestSequence&&(this.loadingKey="")}}setForecastState(e,t){this.forecast=e,this.forecastStatus=t,"ready"!==t&&"loading"!==t&&(this.loadedKey="")}extractForecastFromResponse(e,t){var i;if(!e||"object"!=typeof e)return[];const n=e.response,r=n&&"object"==typeof n?n:e,o=null==(i=null==r?void 0:r[t])?void 0:i.forecast;return Array.isArray(o)?o:[]}syncRefreshTimer(){null===this.refreshTimerId&&(this.refreshTimerId=window.setInterval(()=>{this.ensureForecastLoaded(!0)},18e5))}clearRefreshTimer(){null!==this.refreshTimerId&&(window.clearInterval(this.refreshTimerId),this.refreshTimerId=null)}getSecondaryTargetStyles(){return Object.fromEntries(Jn.flatMap(e=>[[e.targetId,{label:e.label,description:`${e.label} secondary forecast value`,styles:{preset:"full",exclude:{groups:["layout","flex"]}}}],[this.getSecondaryIconTargetId(e.key),{label:`${e.label} Icon`,description:`${e.label} secondary icon`,styles:{preset:"full",exclude:{groups:["layout","flex"]}}}],[this.getSecondaryUnitTargetId(e.key),{label:`${e.label} Unit`,description:`${e.label} unit of measure`,styles:{preset:"full",exclude:{groups:["layout","flex"]}}}]]))}getSecondaryAttributeTraits(){return Jn.filter(e=>this.availableAttributeKeys.has(e.key)).filter(e=>"wind_bearing"!==e.key||this.availableAttributeKeys.has("wind_speed")).flatMap(e=>{const t=[{type:"checkbox",name:e.prop,label:e.label,visible:"wind_bearing"===e.key?{prop:"show_wind_speed",eq:!0}:void 0}];if("humidity"===e.key||"cloud_coverage"===e.key||"uv_index"===e.key){const i=this.getSecondaryColorRampProp(e.key),n=this.getSecondaryColorLowProp(e.key),r=this.getSecondaryColorHighProp(e.key),o={prop:e.prop,eq:!0},s={and:[o,{prop:i,eq:"custom"}]};t.push({type:"select",name:i,label:`${e.label} Color Ramp`,options:this.getSecondaryColorRampOptions(e.key),visible:o},{type:"color",name:n,label:`${e.label} Low Color`,visible:s},{type:"color",name:r,label:`${e.label} High Color`,visible:s})}return t})}getSecondaryColorRampOptions(e){switch(e){case"humidity":return[{value:"none",label:"None"},{value:"humidity",label:"Dry to Humid"},{value:"blue",label:"Blue"},{value:"teal",label:"Teal"},{value:"custom",label:"Custom"}];case"cloud_coverage":return[{value:"none",label:"None"},{value:"cloud",label:"Clear to Overcast"},{value:"storm",label:"Storm"},{value:"blue",label:"Blue"},{value:"custom",label:"Custom"}];case"uv_index":return[{value:"none",label:"None"},{value:"uv",label:"UV Scale"},{value:"solar",label:"Solar"},{value:"alert",label:"Alert"},{value:"custom",label:"Custom"}];default:return[{value:"none",label:"None"},{value:"custom",label:"Custom"}]}}getEnabledSecondaryKeys(){return Jn.filter(e=>this.availableAttributeKeys.has(e.key)).filter(e=>"wind_bearing"!==e.key||this.availableAttributeKeys.has("wind_speed")&&this.resolvePropertyAsBoolean("show_wind_speed")).filter(e=>this.resolvePropertyAsBoolean(e.prop,e.defaultValue)).map(e=>e.key)}extractAvailableAttributeKeys(e){const t=new Set;for(const i of Jn)e.some(e=>void 0!==e[i.key]&&null!==e[i.key])&&t.add(i.key);return t}setAvailableAttributeKeys(e){const t=Array.from(e).sort().join("|");t!==this.availableAttributeSignature&&(this.availableAttributeSignature=t,this.availableAttributeKeys=e,this.requestPropertyPanelRefresh())}requestPropertyPanelRefresh(){var e;(null==(e=this.environment)?void 0:e.isBuilder)&&this.block&&this.selected&&this.documentModel.dispatchEvent(new CustomEvent("block-updated",{detail:{block:{...this.block}}}))}getVisibleForecast(){return this.forecast.slice(0,this.getHours())}getHours(){const e=Math.round(this.resolvePropertyAsNumber("hours",12));return Math.min(24,Math.max(4,e))}getLayoutDirection(){return this.resolveProperty("layout_direction")}getHorizontalColumnMode(){const e=this.resolveProperty("horizontal_column_mode","auto");return"fill"===e||"custom"===e?e:"auto"}getHorizontalColumnStyles(e){return"fill"===e?{}:"custom"===e?{"--fc-custom-column-width":this.normalizeCssLength(this.resolveProperty("custom_column_width","52px"),"52px",!0)}:{"--fc-auto-column-min-width":`${Math.max(1,this.resolvePropertyAsNumber("auto_column_min_width",90))}px`,"--fc-auto-column-max-width":this.normalizeCssLength(this.resolveProperty("auto_column_max_width",""),"none",!0)}}getVerticalBarWidthMode(){return this.resolveProperty("vertical_bar_width_mode")}getVerticalBarStyles(e){return"fill"===e?{"--fc-vertical-bar-column-width":"minmax(0, 1fr)"}:{"--fc-vertical-bar-width":`${this.getVerticalBarWidth()}px`}}getVerticalSecondaryColumns(e){return e.length>0?e.map(()=>"max-content").join(" "):"0"}getVerticalBarWidth(){const e=this.resolvePropertyAsNumber("vertical_bar_width",120);return Math.min(260,Math.max(24,e))}getBarHeight(){const e=this.resolvePropertyAsNumber("bar_height",40);return Math.min(100,Math.max(10,e))}getRainThreshold(){const e=this.resolvePropertyAsNumber("rain_threshold",0);return Math.min(50,Math.max(0,e))}getTemperatureColorRange(e,t){return"custom"===this.resolveProperty("temperature_color_range_mode")?{min:this.resolvePropertyAsNumber("temperature_color_min",0),max:this.resolvePropertyAsNumber("temperature_color_max",40)}:{min:e,max:t}}getTemperatures(e){return e.map(e=>this.getNumberValue(e.temperature)).filter(e=>null!==e)}getRainBadge(e){if(!this.resolvePropertyAsBoolean("show_rain_badge"))return d;const t=this.getRainThreshold(),i=e.findIndex(e=>{const i=this.getNumberValue(e.precipitation_probability);return null!==i&&i>t});if(-1===i)return d;const n=this.getTargetStyle("badge"),r=0===i?"Raining now":`Rain in ${i}h`;return h`
            <div
                class="rain-badge ${this.getTargetActiveClass("badge")}"
                style=${u(n)}
                data-style-target="badge"
            >
                <ha-icon icon="mdi:weather-rainy"></ha-icon>
                <span>${r}</span>
            </div>
        `}shouldRenderDaySeparator(e,t,i){var n;if(!this.resolvePropertyAsBoolean("show_day_separator")||0===t)return!1;const r=this.parseDate(e.datetime),o=this.parseDate(null==(n=i[t-1])?void 0:n.datetime);return!(!r||!o)&&(r.getDate()!==o.getDate()&&0===r.getHours())}resolveTimeFormat(){var e,t;if(!(null==(t=null==(e=this.hass)?void 0:e.locale)?void 0:t.time_format))return!1;if("12"===this.hass.locale.time_format)return!0;if("24"===this.hass.locale.time_format)return!1;if("system"===this.hass.locale.time_format){const e=new Intl.DateTimeFormat(void 0,{hour:"numeric"}).resolvedOptions();return"h12"===e.hourCycle||"h11"===e.hourCycle}const i=new Intl.DateTimeFormat(this.hass.locale.language,{hour:"numeric"}).resolvedOptions();return"h12"===i.hourCycle||"h11"===i.hourCycle}renderForecastTime(e){var t,i,n;const r=this.parseDate(e);if(!r)return"--";const o=(null==(i=null==(t=this.hass)?void 0:t.locale)?void 0:i.language)||(null==(n=this.hass)?void 0:n.language)||void 0;if(this.resolveTimeFormat()){const e=new Intl.DateTimeFormat(o,{hour:"numeric",minute:"2-digit",hour12:!0}).format(r);return this.renderTimeWithMeridiem(e)}return new Intl.DateTimeFormat(o,{hour:"2-digit",minute:"2-digit",hour12:!1}).format(r)}renderTimeWithMeridiem(e){const t=e.match(/^(.*?)(\s*)(am|pm|a\.m\.|p\.m\.)$/i);if(!t)return e;const i=t[1],n=t[2]||" ",r=t[3].toUpperCase(),o=this.getTargetStyle("time-meridiem");return h`${i} ${n} <span
            class=${this.getTargetActiveClass("time-meridiem")}
            style=${u(o)}
            data-style-target="time-meridiem"
        >${r}</span>`}renderTemperatureValue(e){if(null===e)return"--";const t=this.resolvePropertyAsBoolean("show_temperature_unit"),i=this.formatWeatherValueParts(e,"temperature",0);if(!t||!i.unit)return h`${i.value}°`;const n=this.getTargetStyle("temperature-unit");return h`${i.value}<span
            class=${this.getTargetActiveClass("temperature-unit")}
            style=${u(n)}
            data-style-target="temperature-unit"
        >${i.unit}</span>`}formatWeatherValue(e,t,i){const n=this.formatWeatherValueParts(e,t,i);return n.unit?`${n.value}${n.unit}`:n.value}formatWeatherValueParts(e,t,i){let n=this.getWeatherUnit(t);const r=this.resolvePropertyAsBoolean("show_temperature_unit");"temperature"!==t||r||(n="°");return{value:this.formatNumber(e,i),unit:n}}formatNumber(e,t){var i,n,r;const o=this.getNumberValue(e);if(null===o)return String(e??"");const s=(null==(n=null==(i=this.hass)?void 0:i.locale)?void 0:n.language)||(null==(r=this.hass)?void 0:r.language)||void 0;return new Intl.NumberFormat(s,{maximumFractionDigits:t,minimumFractionDigits:0}).format(o)}getWeatherUnit(e){var t,i,n,r,o;const s=this.getEntityState(),a=(null==s?void 0:s.attributes)??{},l=(null==(n=null==(i=null==(t=this.hass)?void 0:t.config)?void 0:i.unit_system)?void 0:n.length)||"",c=null==(o=null==(r=this.hass)?void 0:r.config)?void 0:o.unit_system;switch(e){case"temperature":case"apparent_temperature":case"dew_point":return String(a.temperature_unit||(null==c?void 0:c.temperature)||"");case"precipitation":return String(a.precipitation_unit||("km"===l?"mm":"in"));case"pressure":return String(a.pressure_unit||("km"===l?"hPa":"inHg"));case"wind_speed":return String(a.wind_speed_unit||(l?`${l}/h`:""));case"cloud_coverage":case"humidity":case"precipitation_probability":return"%";case"uv_index":case"wind_bearing":return""}}getTemperatureColor(e,t,i){const n=this.resolveProperty("color_ramp");if("none"===n)return;const r=this.normalizeTemperature(e,t,i),o=this.getTemperatureColorRampConfig(n);return this.interpolateRamp(o.colors,r,o.mode,o.direction)}getTemperatureRangeColor(e){const t=this.resolveProperty("color_ramp");if("none"===t)return;const i=this.getTemperatureColorRampConfig(t);return this.interpolateRamp(i.colors,"min"===e?0:1,i.mode,i.direction)}getColorStyle(e){return e?{color:e}:{}}getTemperatureColorRampConfig(e){if("custom"!==e){const t=nr[e];return{colors:t.colors,mode:t.mode,direction:"shortest"}}const t=this.resolveProperty("color_ramp_interpolation");return{colors:[this.resolveProperty("color_cold"),this.resolveProperty("color_warm")],mode:t,direction:"hsl"===t&&this.resolvePropertyAsBoolean("color_ramp_reverse_hue")?"longest":"shortest"}}normalizeTemperature(e,t,i){if(!Number.isFinite(e)||!Number.isFinite(t)||!Number.isFinite(i)||i===t)return.5;const n=Math.min(t,i),r=Math.max(t,i);return(Math.min(r,Math.max(n,e))-n)/(r-n)}interpolateRamp(e,t,i="hsl",n="shortest"){if(0===e.length)return"#f59e0b";if(1===e.length)return e[0];const r=Math.min(1,Math.max(0,t)),o=1/(e.length-1),s=Math.min(e.length-2,Math.floor(r/o)),a=(r-s*o)/o;return"rgb"===i?this.interpolateRgb(e[s],e[s+1],a):this.interpolateHsl(e[s],e[s+1],a,n)}interpolateRgb(e,t,i){const n=this.hexToRgb(e),r=this.hexToRgb(t);return n&&r?this.rgbToHex(Math.round(n.r+(r.r-n.r)*i),Math.round(n.g+(r.g-n.g)*i),Math.round(n.b+(r.b-n.b)*i)):i<.5?e:t}interpolateHsl(e,t,i,n="shortest"){const r=this.hexToHsl(e),o=this.hexToHsl(t);if(!r||!o)return i<.5?e:t;let s=o.h-r.h;"longest"===n?s>0&&s<=180?s-=360:s<0&&s>=-180&&(s+=360):(s>180&&(s-=360),s<-180&&(s+=360));const a=(r.h+s*i+360)%360,l=r.s+(o.s-r.s)*i,c=r.l+(o.l-r.l)*i;return this.hslToHex(a,l,c)}hexToHsl(e){const t=this.hexToRgb(e);if(!t)return null;const i=t.r/255,n=t.g/255,r=t.b/255,o=Math.max(i,n,r),s=Math.min(i,n,r),a=(o+s)/2;if(o===s)return{h:0,s:0,l:a};const l=o-s,c=a>.5?l/(2-o-s):l/(o+s);let d=0;switch(o){case i:d=(n-r)/l+(n<r?6:0);break;case n:d=(r-i)/l+2;break;case r:d=(i-n)/l+4}return{h:60*d,s:c,l:a}}hslToHex(e,t,i){const n=(1-Math.abs(2*i-1))*t,r=n*(1-Math.abs(e/60%2-1)),o=i-n/2;let s=0,a=0,l=0;return e<60?(s=n,a=r):e<120?(s=r,a=n):e<180?(a=n,l=r):e<240?(a=r,l=n):e<300?(s=r,l=n):(s=n,l=r),this.rgbToHex(Math.round(255*(s+o)),Math.round(255*(a+o)),Math.round(255*(l+o)))}hexToRgb(e){const t=e.trim().replace(/^#/,""),i=3===t.length?t.split("").map(e=>`${e}${e}`).join(""):t;if(!/^[0-9a-fA-F]{6}$/.test(i))return null;const n=Number.parseInt(i,16);return{r:n>>16&255,g:n>>8&255,b:255&n}}rgbToHex(e,t,i){return`#${[e,t,i].map(e=>e.toString(16).padStart(2,"0")).join("")}`}getSecondaryColorStyle(e,t){const i=this.getSecondaryColor(e,t);return i?{color:i}:{}}getSecondaryColor(e,t){var i;const n=this.resolveProperty(this.getSecondaryColorRampProp(e));if(!n||"none"===n)return;const r=this.normalizeSecondaryColorAmount(e,t);if(null===r)return;const o="custom"===n?[this.resolveProperty(this.getSecondaryColorLowProp(e)),this.resolveProperty(this.getSecondaryColorHighProp(e))]:null==(i=rr[e])?void 0:i[n];return o?this.interpolateRamp(o,r):void 0}normalizeSecondaryColorAmount(e,t){const i=this.getNumberValue(t);if(null===i)return null;switch(e){case"humidity":case"cloud_coverage":return Math.min(1,Math.max(0,i/100));case"uv_index":return Math.min(1,Math.max(0,i/11));default:return null}}getSecondaryColorRampProp(e){return`${e}_color_ramp`}getSecondaryColorLowProp(e){return`${e}_color_low`}getSecondaryColorHighProp(e){return`${e}_color_high`}getConditionColor(e){return tr[this.normalizeCondition(e)]??tr.exceptional}normalizeCondition(e){const t=String(e||"").toLowerCase();return er[t]?t:"exceptional"}getWindBearingDegrees(e){const t=this.getNumberValue(e);return null===t?null:(t%360+360)%360}getWindCardinalDirection(e){const t=this.getWindBearingDegrees(e);return null===t?"string"==typeof e?e:"":ir[Math.round(t/22.5)%16]}getSecondaryTargetId(e){var t;return(null==(t=Jn.find(t=>t.key===e))?void 0:t.targetId)??"secondary"}getSecondaryIconTargetId(e){return`${this.getSecondaryTargetId(e)}-icon`}getSecondaryUnitTargetId(e){return`${this.getSecondaryTargetId(e)}-unit`}normalizeCssLength(e,t,i){const n=String(e??"").trim();if(!n)return t;if(/^\d+(\.\d+)?$/.test(n))return`${n}px`;return new RegExp(`^\\d+(\\.\\d+)?(${i?"px|%":"px"})$`,"i").test(n)?n:t}parseDate(e){if("string"!=typeof e&&"number"!=typeof e)return null;const t=new Date(e);return Number.isNaN(t.getTime())?null:t}getNumberValue(e){if("number"==typeof e)return Number.isFinite(e)?e:null;if("string"==typeof e&&e.trim()){const t=Number.parseFloat(e);return Number.isFinite(t)?t:null}return null}getTargetActiveClass(e){return this.isStyleTargetActive(e)?"style-target-active":""}};function sr(e){if("number"==typeof e)return Number.isFinite(e)?e:null;if("string"==typeof e){const t=parseFloat(e);return Number.isFinite(t)?t:null}return null}function ar(e,t,i){return"fixed"===i.mode?i.entityId:"slot"===i.mode?i.slotId?e.resolveSlotEntity(i.slotId):void 0:e.resolveEntityForBlock(t.id).entityId}function lr(e,t,i,n){var r,o;const s=null==(r=i.name)?void 0:r.trim();if(s)return s;const a=e.states[t],l=null==(o=null==a?void 0:a.attributes)?void 0:o.friendly_name;return"string"==typeof l&&l.trim()?l:`Series ${n+1}`}function cr(e,t,i,n){const r=e.filter(e=>e.timestamp>=t&&e.timestamp<=i).sort((e,t)=>e.timestamp-t.timestamp);if("none"===n.strategy)return r;const o=n.sizing,s="by-window"===o.mode?function(e,t,i,n){if(0===e.length)return[];const r=Math.max(1,n),o=new Map;for(const a of e){const e=Math.floor((a.timestamp-t)/r),i=o.get(e)||[];i.push(a),o.set(e,i)}const s=Math.max(1,Math.ceil((i-t)/r));return Array.from({length:s},(e,t)=>o.get(t)||[]).filter(e=>e.length>0)}(r,t,i,o.window.value*("minutes"===(a=o.window.unit)?6e4:"hours"===a?36e5:864e5)):function(e,t){if(0===e.length)return[];const i=Math.max(1,Math.min(t,e.length)),n=Math.ceil(e.length/i),r=[];for(let o=0;o<e.length;o+=n)r.push(e.slice(o,o+n));return r}(r,"min-max"===n.strategy?Math.max(1,Math.floor(o.maxPoints/2)):o.maxPoints);var a;return"average"===n.strategy?s.flatMap(e=>function(e){if(0===e.length)return[];const t=e[0],i=e[e.length-1],n=e.reduce((e,t)=>e+t.value,0);return[{timestamp:Math.round((t.timestamp+i.timestamp)/2),value:n/e.length}]}(e)):"min-max"===n.strategy?s.flatMap(e=>function(e){if(0===e.length)return[];let t=e[0],i=e[0];for(const n of e)n.value<t.value&&(t=n),n.value>i.value&&(i=n);return t.timestamp===i.timestamp?[t]:t.timestamp<i.timestamp?[t,i]:[i,t]}(e)):s.map(e=>e[0]).filter(e=>Boolean(e))}function dr(e,t,i){const n=new Date(e);return"hours"===i?n.setHours(n.getHours()+t):"days"===i?n.setDate(n.getDate()+t):"weeks"===i?n.setDate(n.getDate()+7*t):n.setMonth(n.getMonth()+t),n}function ur(e){return new Date(e.getFullYear(),e.getMonth(),e.getDate())}function hr(e){return dr(ur(e),1,"days")}function pr(e){if(!e)return;const t=new Date(e);return Number.isFinite(t.getTime())?t:void 0}function gr(e,t){if("today"===e.mode)return{from:ur(t),to:e.showFullRange?hr(t):t};if("yesterday"===e.mode){const e=ur(t);return{from:dr(e,-1,"days"),to:e}}if("last-days"===e.mode){const i=Math.max(1,Math.round(e.amount||1));return{from:dr(ur(t),-(i-1),"days"),to:e.showFullRange?hr(t):t}}if("calendar-day"===e.mode){const i=function(e){if(!e)return;const t=e.split("-").map(e=>Number.parseInt(e,10));return 3!==t.length||t.some(e=>!Number.isFinite(e))?void 0:new Date(t[0],t[1]-1,t[2])}(e.date)??ur(t);return{from:i,to:dr(i,1,"days")}}if("custom"===e.mode){const i={from:dr(t,-24,"hours"),to:t},n=pr(e.start)??i.from,r=pr(e.end)??i.to;return n.getTime()<r.getTime()?{from:n,to:r}:i}return{from:dr(t,-Math.max(1,e.amount||24),e.unit||"hours"),to:t}}function mr(e,t){const i=gr(e,t),n=Math.max(0,e.offsetAmount||0),r=-n,o=dr(i.from,r,e.offsetUnit||"days"),s=dr(i.to,r,e.offsetUnit||"days"),a=s.getTime()>t.getTime()?t:s,l="aligned"===e.displayMode&&0!==n;return{queryFrom:o,queryTo:a,displayFrom:l?i.from:o,displayTo:l?i.to:s}}function vr(e,t){const i=t.displayFrom.getTime()-t.queryFrom.getTime();return 0===i?e:e.map(e=>({...e,originalTimestamp:e.timestamp,timestamp:e.timestamp+i}))}function yr(e){const t=e.start;if("number"==typeof t)return t;const i=Date.parse(t);return Number.isFinite(i)?i:Date.now()}function br(e,t,i,n){const r=e.states[i];if(!r)return[];const o=function(e,t){var i;return"attribute"===t.valueSource?sr(null==(i=e.attributes)?void 0:i[t.attribute||""]):sr(e.state)}(r,t);return null===o?[]:[{timestamp:n,value:o}]}async function fr(e,t,i,n,r){return"live"===t.mode?br(e,t,i,r.getTime()):"history"===t.mode?async function(e,t,i,n,r){const o=await e.callWS({type:"history/history_during_period",start_time:n.toISOString(),end_time:r.toISOString(),entity_ids:[t],minimal_response:!0,no_attributes:!1});return cr(((null==o?void 0:o[t])||[]).map(e=>{var t;const n=sr("attribute"===i.valueSource?null==(t=e.a)?void 0:t[i.attribute||""]:e.s);return null===n?null:{timestamp:1e3*e.lu,value:n}}).filter(e=>Boolean(e)),n.getTime(),r.getTime(),i.downsampling)}(e,i,t,n,r):async function(e,t,i,n,r){const o=i.statisticType,s=await e.callWS({type:"recorder/statistics_during_period",start_time:n.toISOString(),end_time:r.toISOString(),statistic_ids:[t],period:i.statisticsPeriod,types:[o]});return function(e,t,i){return e.filter(e=>e.timestamp>=t&&e.timestamp<=i).sort((e,t)=>e.timestamp-t.timestamp)}(((null==s?void 0:s[t])||[]).map(e=>{const t=sr(e[o]);return null===t?null:{timestamp:yr(e),value:t}}).filter(e=>Boolean(e)),n.getTime(),r.getTime())}(e,i,t,n,r)}function kr(e,t){var i,n;const r=e.states[t];return{sourceUnit:"string"==typeof(null==(i=null==r?void 0:r.attributes)?void 0:i.unit_of_measurement)?r.attributes.unit_of_measurement:void 0,deviceClass:"string"==typeof(null==(n=null==r?void 0:r.attributes)?void 0:n.device_class)?r.attributes.device_class:void 0}}function xr(e,t,i,n){const r=e.map(e=>e[t]).filter(e=>Number.isFinite(e));return r.length>0?n(...r):i}async function wr(e,t,i,n){const r=new Date,o=n.filter(e=>{var t;return!(null==(t=e.items)?void 0:t.length)}).map(e=>{const n=ar(t,i,e.binding.entityConfig);return n?{series:e,entityId:n}:null}).filter(e=>Boolean(e)),s=await Promise.all(o.map(async(t,i)=>{const n=mr(t.series.binding.dataSource.timeRange,r),o=await fr(e,t.series.binding.dataSource,t.entityId,n.queryFrom,n.queryTo),s=kr(e,t.entityId);return{id:t.series.id,name:lr(e,t.entityId,t.series,i),color:t.series.color||"#3b82f6",entityId:t.entityId,unit:s.sourceUnit,sourceUnit:s.sourceUnit,deviceClass:s.deviceClass,showUnit:!1,from:n.queryFrom.getTime(),to:n.queryTo.getTime(),displayFrom:n.displayFrom.getTime(),displayTo:n.displayTo.getTime(),seriesConfig:t.series,points:vr(o,n)}})),a=await Promise.all(n.filter(e=>{var t;return null==(t=e.items)?void 0:t.length}).map(async n=>{var o;const s=(await Promise.all((n.items||[]).map((n,o)=>async function(e,t,i,n,r,o,s){const a=ar(t,i,r.binding.entityConfig);if(!a)return;const l=mr(r.binding.dataSource.timeRange,s),c=await fr(e,r.binding.dataSource,a,l.queryFrom,l.queryTo),d=kr(e,a);return{id:r.id,name:lr(e,a,r,o),color:r.color||"#3b82f6",entityId:a,unit:d.sourceUnit,sourceUnit:d.sourceUnit,deviceClass:d.deviceClass,showUnit:!1,from:l.queryFrom.getTime(),to:l.queryTo.getTime(),displayFrom:l.displayFrom.getTime(),displayTo:l.displayTo.getTime(),itemConfig:r,points:vr(c,l)}}(e,t,i,0,n,o,r)))).filter(e=>Boolean(e)),a=r.getTime();return{id:n.id,name:(null==(o=n.name)?void 0:o.trim())||"Series",color:n.color||"#3b82f6",entityId:"",unit:void 0,sourceUnit:void 0,deviceClass:void 0,showUnit:!1,from:xr(s,"from",a,Math.min),to:xr(s,"to",a,Math.max),displayFrom:xr(s,"displayFrom",a,Math.min),displayTo:xr(s,"displayTo",a,Math.max),seriesConfig:n,points:[],items:s}})),l=[...s,...a];return{from:l.length>0?Math.min(...l.map(e=>e.displayFrom)):void 0,to:l.length>0?Math.max(...l.map(e=>e.displayTo)):void 0,series:l}}or.styles=[...Dt.styles,l`
            :host {
                display: block;
                min-width: 1px;
                min-height: 1px;
                overflow: hidden;
                padding: 0;
                font-size: 16px;
                --fc-bg: var(--ha-card-background, var(--card-background-color, transparent));
                --fc-text: var(--primary-text-color, #1f2937);
                --fc-text-secondary: var(--secondary-text-color, #64748b);
                --fc-text-muted: var(--disabled-text-color, #94a3b8);
                --fc-border: var(--divider-color, rgba(148, 163, 184, 0.28));
                --fc-accent: var(--accent-color, #03a9f4);
                --fc-rain: #38bdf8;
                --fc-auto-column-min-width: 50px;
                --fc-auto-column-max-width: none;
                --fc-custom-column-width: 52px;
                --fc-vertical-time-column-width: max-content;
                --fc-vertical-icon-column-width: max-content;
                --fc-vertical-temp-column-width: max-content;
                --fc-vertical-bar-column-width: minmax(0, 1fr);
                --fc-vertical-secondary-columns: max-content;
                --fc-vertical-bar-width: 120px;
            }

            .forecast-card {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                min-width: 0;
                box-sizing: border-box;
                overflow: hidden;
                gap: 8px;
                padding: 10px;
                background: var(--fc-bg);
                color: var(--fc-text);
            }

            .header {
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
                flex: 0 0 auto;
                color: var(--fc-text-secondary);
                font-size: 0.857em;
                font-weight: 500;
            }

            .title {
                display: inline-flex;
                align-items: center;
                font-size: 1.2em;
                gap: 5px;
                min-width: 0;
                flex: 1 1 auto;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .title ha-icon {
                --mdc-icon-size: 1.167em;
                flex: 0 0 auto;
            }

            .rain-badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                flex: 0 0 auto;
                max-width: 45%;
                box-sizing: border-box;
                padding: 3px 7px;
                border-radius: 999px;
                background: color-mix(in srgb, var(--fc-rain) 18%, transparent);
                color: var(--fc-rain);
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: 1em;
                line-height: 1.2;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .rain-badge ha-icon {
                --mdc-icon-size: 1.2em;
                flex: 0 0 auto;
            }

            .range {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                flex: 0 0 auto;
                color: var(--fc-text-muted);
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: 1.2em;
                line-height: 1.2;
                white-space: nowrap;
            }

            .range-part {
                display: inline-flex;
                align-items: center;
                gap: 2px;
            }

            .range-part ha-icon {
                --mdc-icon-size: 1.1em;
            }

            .strip {
                display: flex;
                flex: 1 1 auto;
                width: 100%;
                min-width: 0;
                max-width: 100%;
                min-height: 0;
                gap: 4px;
                overflow: auto;
                scrollbar-width: none;
            }

            .strip::-webkit-scrollbar {
                display: none;
            }

            .strip.horizontal {
                flex-direction: row;
                overflow-x: auto;
                overflow-y: hidden;
                scroll-snap-type: x mandatory;
                padding-bottom: 1px;
            }

            .strip.horizontal.auto,
            .strip.horizontal.custom {
                scrollbar-width: thin;
                scrollbar-color: var(--fc-border) transparent;
            }

            .strip.horizontal.auto::-webkit-scrollbar,
            .strip.horizontal.custom::-webkit-scrollbar {
                display: block;
                height: 6px;
            }

            .strip.horizontal.auto::-webkit-scrollbar-thumb,
            .strip.horizontal.custom::-webkit-scrollbar-thumb {
                border-radius: 999px;
                background: var(--fc-border);
            }

            .strip.horizontal.auto::-webkit-scrollbar-track,
            .strip.horizontal.custom::-webkit-scrollbar-track {
                background: transparent;
            }

            .strip.horizontal.fill {
                overflow-x: hidden;
                scroll-snap-type: none;
            }

            .strip.vertical {
                display: grid;
                grid-template-columns:
                    var(--fc-vertical-time-column-width)
                    var(--fc-vertical-icon-column-width)
                    var(--fc-vertical-temp-column-width)
                    var(--fc-vertical-bar-column-width)
                    var(--fc-vertical-secondary-columns);
                grid-auto-rows: minmax(38px, auto);
                gap: 4px 8px;
                align-items: stretch;
                overflow-x: hidden;
                overflow-y: auto;
                scroll-snap-type: y proximity;
                padding-right: 1px;
            }

            .hour {
                position: relative;
                display: flex;
                box-sizing: border-box;
                border: 1px solid transparent;
                border-radius: 7px;
                color: var(--fc-text-secondary);
                scroll-snap-align: start;
            }

            .horizontal .hour {
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                gap: 8px;
                padding: 6px 4px;
                text-align: center;
            }

            .horizontal.auto .hour {
                flex: 1 0 var(--fc-auto-column-min-width);
                width: auto;
                min-width: var(--fc-auto-column-min-width);
                max-width: var(--fc-auto-column-max-width);
            }

            .horizontal.fill .hour {
                flex: 1 1 0;
                width: auto;
                min-width: 0;
                max-width: none;
            }

            .horizontal.custom .hour {
                flex: 0 0 var(--fc-custom-column-width);
                width: var(--fc-custom-column-width);
                min-width: 0;
                max-width: none;
            }

            .vertical .hour {
                display: grid;
                grid-column: 1 / -1;
                grid-template-columns: subgrid;
                width: 100%;
                min-height: 38px;
                align-items: center;
                column-gap: inherit;
                padding: 6px 8px;
                text-align: left;
                scroll-snap-align: start;
            }

            .strip.vertical.no-icons {
                --fc-vertical-icon-column-width: 0;
            }

            .strip.vertical.no-temperature {
                --fc-vertical-temp-column-width: 0;
            }

            .strip.vertical.no-bars {
                --fc-vertical-bar-column-width: 0;
            }

            .strip.vertical.no-secondary {
                --fc-vertical-secondary-columns: 0;
            }

            .strip.vertical.custom-bars {
                --fc-vertical-bar-column-width: var(--fc-vertical-bar-width);
            }

            .hour.now {
                border-color: color-mix(in srgb, var(--fc-accent) 55%, transparent);
                background: color-mix(in srgb, var(--fc-accent) 8%, transparent);
            }

            .horizontal .hour.day-separator {
                border-left-color: color-mix(in srgb, var(--fc-border) 72%, transparent);
                border-left-style: dashed;
            }

            .vertical .hour.day-separator {
                border-top-color: color-mix(in srgb, var(--fc-border) 72%, transparent);
                border-top-style: dashed;
            }

            .time {
                display: flex;
                align-items: flex-end;
                gap: 2px;
                max-width: 100%;
                overflow: hidden;
                color: var(--fc-text-muted);
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: 1em;
                line-height: 1.2;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .now .time {
                color: var(--fc-accent);
                font-weight: 600;
            }

            .condition-icon {
                --mdc-icon-size: 1.2em;
                flex: 0 0 auto;
            }

            .temperature {
                max-width: 100%;
                overflow: hidden;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: 1em;
                font-weight: 650;
                line-height: 1.15;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .thermal-bar-wrap {
                display: flex;
                align-items: flex-end;
                justify-content: center;
                width: 100%;
                height: var(--fc-thermal-bar-height, 24px);
            }

            .vertical .thermal-bar-wrap {
                align-items: center;
                justify-content: flex-start;
                width: 100%;
                min-width: 0;
                height: 8px;
            }

            .thermal-bar {
                display: block;
                width: 3px;
                min-height: 4px;
                border-radius: 999px;
            }

            .vertical .thermal-bar {
                width: var(--fc-thermal-bar-width, 50%);
                height: 3px;
                min-width: 4px;
                min-height: 3px;
            }

            .secondary {
                text-align: center;
                max-width: 100%;
                overflow: hidden;
                color: var(--fc-text-muted);
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: 0.85em;
                font-weight: 400;
                line-height: 1.5;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .vertical .secondary {
                text-align: left;
            }

            .secondary ha-icon {
                --mdc-icon-size: 1.112em;
                flex: 0 0 auto;
            }

            .secondary-content {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 2px;
                max-width: 100%;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .vertical .secondary-content {
                justify-content: flex-start;
            }

            .secondary-stack {
                display: flex;
                flex-direction: column;
                gap: 2px;
                max-width: 100%;
                min-width: 0;
            }

            .vertical .time {
                grid-column: 1;
            }

            .vertical .condition-icon {
                grid-column: 2;
                justify-self: center;
            }

            .vertical .temperature {
                grid-column: 3;
            }

            .vertical .thermal-bar-wrap {
                grid-column: 4;
            }

            .vertical-secondary-cell {
                min-width: 0;
                align-self: center;
            }

            .wind-row {
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                gap: 1px;
                max-width: 100%;
                min-width: 0;
            }

            .vertical .wind-row {
                align-items: flex-start;
            }

            .wind-main {
                display: inline-flex;
                align-items: center;
                gap: 2px;
                max-width: 100%;
                min-width: 0;
            }

            .placeholder {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                min-height: 56px;
                box-sizing: border-box;
                padding: 10px;
                border: 1px dashed var(--fc-border);
                border-radius: 8px;
                color: var(--fc-text-secondary);
                font-size: 0.857em;
                text-align: center;
            }
        `],Zn([c()],or.prototype,"forecast",2),Zn([c()],or.prototype,"forecastStatus",2),Zn([c()],or.prototype,"availableAttributeKeys",2),or=Zn([p("block-hourly-forecast")],or);const Sr=new Map;function _r(e){Sr.set(e.type,e)}function Tr(e){return Sr.get(e)}const Ar=new Set(["left","center","right","auto"]),Ir=new Set(["none","circle","emptyCircle","rect","roundRect","triangle","diamond","pin","arrow"]),Cr=new Set(["none","circle","rect","roundRect","triangle","diamond","pin","arrow"]),Pr=new Set(["outside","inside","center"]);function Mr(e){return e?Array.isArray(e)?e:[e]:[]}function $r(e){if(!e)return;const t=Number.parseFloat(e);return Number.isFinite(t)?t:void 0}function Lr(e){if(!e)return;const t=e.trim();return!t||t.includes("var(")||t.includes("calc(")?void 0:t}function Br(e){return Number.isFinite(e)?e<0?0:e>1?1:e:0}function Er(e){if(!e)return;const t=e.trim();if(t){if(t.startsWith("{")&&t.endsWith("}"))try{const e=JSON.parse(t);if("solid"===e.type)return Lr("string"==typeof e.color?e.color:void 0);if("linear"===e.type&&Array.isArray(e.colorStops)){const t=e.colorStops.map(e=>({offset:Br(Number(e.offset)),color:Lr("string"==typeof e.color?e.color:void 0)??"#3b82f6"})).filter(e=>Number.isFinite(e.offset));if(t.length<2)return;return{type:"linear",x:Number.isFinite(Number(e.x))?Number(e.x):0,y:Number.isFinite(Number(e.y))?Number(e.y):0,x2:Number.isFinite(Number(e.x2))?Number(e.x2):1,y2:Number.isFinite(Number(e.y2))?Number(e.y2):0,colorStops:t,global:Boolean(e.global)}}if("radial"===e.type&&Array.isArray(e.colorStops)){const t=e.colorStops.map(e=>({offset:Br(Number(e.offset)),color:Lr("string"==typeof e.color?e.color:void 0)??"#3b82f6"})).filter(e=>Number.isFinite(e.offset));if(t.length<2)return;return{type:"radial",x:Number.isFinite(Number(e.x))?Number(e.x):.5,y:Number.isFinite(Number(e.y))?Number(e.y):.5,r:Number.isFinite(Number(e.r))?Number(e.r):.5,colorStops:t,global:Boolean(e.global)}}}catch(i){}return Lr(t)}}function Dr(e){if(void 0===e)return;const t=e.trim().toLowerCase();return!!["true","yes","1","on","show"].includes(t)||!["false","no","0","off","hide"].includes(t)&&void 0}function Rr(e){return $r(e)}function Or(e){if(!e)return;const t=Number.parseInt(e,10);return Number.isFinite(t)&&String(t)===e.trim()?t:e}function Nr(e){const t=Rr(e.fontSize);return{color:Er(e.color),fontSize:t,fontWeight:Or(e.fontWeight)}}function zr(e,t){return{...e&&"object"==typeof e&&!Array.isArray(e)?e:{},...Object.fromEntries(Object.entries(t).filter(([,e])=>void 0!==e))}}function Vr(e,t){const i={...e};return Object.entries(t??{}).forEach(([e,t])=>{void 0!==t&&""!==t.trim()&&(i[e]=t)}),i}function Fr(e,t){e&&t&&0!==Object.keys(t).length&&(e.textStyle=zr(e.textStyle,Nr(t)),e.backgroundColor=Er(t.backgroundColor)??e.backgroundColor,e.borderColor=Er(t.borderColor)??e.borderColor,e.borderWidth=Rr(t.borderWidth)??e.borderWidth,e.textAlign=function(e){if(e)return Ar.has(e)?e:void 0}(t.textAlign)||e.textAlign)}function Wr(e,t){if(!e||!t||0===Object.keys(t).length)return;const i=function(e){const t=[],i=e=>{e&&(Array.isArray(e)?e.forEach(i):Array.isArray(e.elements)?e.elements.forEach(i):(t.push(e),Array.isArray(e.children)&&e.children.forEach(i)))};return i(e),t}(e);if(!i.some(e=>"chart-center-title"===(null==e?void 0:e.id)))return;const n=i.find(e=>"chart-center-title-text"===(null==e?void 0:e.id));if(!n)return;const r=Nr(t);n.style=zr(n.style,{fill:Er(t.color),fontSize:r.fontSize,fontWeight:r.fontWeight})}function jr(e,t){if(!e||!t||0===Object.keys(t).length)return;e.backgroundColor=Er(t.backgroundColor)??e.backgroundColor,e.borderColor=Er(t.borderColor)??e.borderColor,e.borderWidth=Rr(t.borderWidth)??e.borderWidth,e.icon=function(e){if(!e)return;const t=e.trim();return Cr.has(t)?t:void 0}(t.echartLegendIcon)??e.icon;const i=Rr(t.echartLegendIconSize);void 0!==i&&(e.itemWidth=i,e.itemHeight=i)}function Gr(e,t,i,n=!1){var r;e&&i&&0!==Object.keys(i).length&&(e.textStyle=zr(e.textStyle,n?Nr(i):{}),t&&(e.textStyle.rich=zr(e.textStyle.rich,{[t]:zr(null==(r=e.textStyle.rich)?void 0:r[t],Nr(i))})))}function Ur(e,t){var i,n;if(!e||!t||0===Object.keys(t).length)return;const r=Er(t.color),o=Er(t.borderColor)??r,s=Rr(t.borderWidth),a=Rr(t.borderTopWidth||t.borderWidth);e.nameTextStyle=zr(e.nameTextStyle,Nr(t)),e.axisLabel=zr(e.axisLabel,Nr(t)),e.axisLine=zr(e.axisLine,{lineStyle:zr(null==(i=e.axisLine)?void 0:i.lineStyle,{color:o,width:s})}),e.splitLine=zr(e.splitLine,{lineStyle:zr(null==(n=e.splitLine)?void 0:n.lineStyle,{color:o,width:a,opacity:$r(t.opacity)})}),void 0!==r&&(e.axisLabel=zr(e.axisLabel,{color:r}))}function Hr(e,t){if(!e||!t||0===Object.keys(t).length)return;const i=function(e){if(!e)return{};const t=e.trim().split(/\s+/).filter(Boolean);if(0===t.length)return{};const i=t.map(e=>Rr(e));return i.some(e=>void 0===e)?{}:1===i.length?{top:i[0],right:i[0],bottom:i[0],left:i[0]}:2===i.length?{top:i[0],right:i[1],bottom:i[0],left:i[1]}:3===i.length?{top:i[0],right:i[1],bottom:i[2],left:i[1]}:{top:i[0],right:i[1],bottom:i[2],left:i[3]}}(t.padding),n=Rr(t.paddingTop)??i.top,r=Rr(t.paddingRight)??i.right,o=Rr(t.paddingBottom)??i.bottom,s=Rr(t.paddingLeft)??i.left;void 0!==n&&(e.top=n),void 0!==r&&(e.right=r),void 0!==o&&(e.bottom=o),void 0!==s&&(e.left=s)}function qr(e){const t=e.option;if(!t||!e.config)return t;for(const u of Mr(t.title))try{Fr(u,e.getTitleStyle())}catch(d){}try{Wr(t.graphic,e.getTitleStyle())}catch(d){}try{jr(t.legend,e.getLegendStyle()),Gr(t.legend,"legendLabel",e.getLegendLabelStyle(),!0),Gr(t.legend,"legendValue",e.getLegendValueStyle()),Gr(t.legend,"legendUnit",e.getLegendUnitStyle())}catch(d){}try{!function(e,t){e&&t&&0!==Object.keys(t).length&&(e.textStyle=zr(e.textStyle,Nr(t)),e.backgroundColor=Er(t.backgroundColor)??e.backgroundColor,e.borderColor=Er(t.borderColor)??e.borderColor,e.borderWidth=Rr(t.borderWidth)??e.borderWidth)}(t.tooltip,e.getTooltipStyle())}catch(d){}const i=Mr(t.grid);e.config.components.grids.forEach((t,n)=>{try{Hr(i[n],e.getGridStyle(t.id))}catch(d){}});const n=Mr(t.xAxis);e.config.components.xAxes.forEach((t,i)=>{try{Ur(n[i],e.getXAxisStyle(t.id))}catch(d){}});const r=Mr(t.yAxis);e.config.components.yAxes.forEach((t,i)=>{try{Ur(r[i],e.getYAxisStyle(t.id))}catch(d){}});const o=new Map,s=new Map(e.config.series.map(e=>[e.id,e])),a=new Map,l=e.getAllSeriesStyle();e.config.series.forEach(t=>{var i;o.set(t.id,e.getSeriesStyle(t.id)),null==(i=t.items)||i.forEach(i=>{o.set(i.id,e.getSeriesStyle(i.id)),a.set(i.id,t.id)})});const c=Mr(t.series);for(const u of c){if("string"==typeof(null==u?void 0:u.id))try{const e=s.get(u.id),t=e?Tr(e.type):void 0;null==t||t.applySeriesStyle(u,Vr(l,o.get(u.id)))}catch(d){}Array.isArray(null==u?void 0:u.data)&&(u.data=u.data.map(e=>{const t="string"==typeof(null==e?void 0:e.id)?e.id:void 0,i=t?a.get(t):void 0,n=i?s.get(i):void 0,r=n?Tr(n.type):void 0;if(!t||!r)return e;try{return r.applySeriesItemStyle(e,Vr(l,o.get(t)))}catch(d){return e}}))}return t}const Xr="card-builder-runtime-config-change";let Yr=null;function Kr(e){Yr=e}function Qr(){return Yr}function Zr(){return Boolean(null==Yr?void 0:Yr.hasToken)}function Jr(e){Yr&&(Yr={...Yr,...e})}function eo(){"undefined"!=typeof window&&window.dispatchEvent(new CustomEvent(Xr))}function to(e){return"undefined"==typeof window?()=>{}:(window.addEventListener(Xr,e),()=>window.removeEventListener(Xr,e))}function io(){return Yr?`${Yr.baseSchema}://www.${Yr.baseDomain}/create-account`:null}function no(){return Yr?`${Yr.baseSchema}://console.${Yr.baseDomain}/`:null}const ro="cb_integration_outdated",oo="card-builder-integration-outdated-change";function so(){return function(e){if("undefined"==typeof document)return null;const t=`${e}=`,i=document.cookie?document.cookie.split(";"):[];for(const n of i){const e=n.trim();if(e.startsWith(t))return decodeURIComponent(e.slice(t.length))}return null}(ro)}function ao(e){var t,i,n;e&&(t=ro,i=e,n=31536e3,"undefined"!=typeof document&&(document.cookie=`${t}=${encodeURIComponent(i)}; max-age=${n}; path=/; samesite=lax`),ho())}function lo(){var e;e=ro,"undefined"!=typeof document&&(document.cookie=`${e}=; max-age=0; path=/; samesite=lax`),ho()}function co(e){const t=so();return!(!t||!e)&&(vi(e,t)>0&&(lo(),!0))}function uo(){return!!so()&&!!Zr()}function ho(){"undefined"!=typeof window&&window.dispatchEvent(new CustomEvent(oo))}function po(e){return"undefined"==typeof window?()=>{}:(window.addEventListener(oo,e),()=>window.removeEventListener(oo,e))}const go="card_builder/account/marketplace/cards/available/versions_check",mo="card_builder.account.marketplace.shared_cards",vo="card_builder.account.marketplace.available_versions",yo="card_builder.account.marketplace.available_featured",bo="card_builder.account.info";class fo{constructor(e){this.hass=e}async _callWS(e){try{return await this.hass.callWS(e)}catch(t){throw function(e){if(!e||"object"!=typeof e)return;if("integration_version_outdated"!==e.code)return;const t=Qr();ao(null==t?void 0:t.integrationVersion)}(t),this._handleAuthFailedError(t),t}}_handleAuthFailedError(e){this._isAuthFailedError(e)&&(Jr({hasToken:!1}),this.invalidateMarketplaceSharedCardsCache(),this.invalidateMarketplaceCardVersionsCache(),eo())}_isAuthFailedError(e){return!(!e||"object"!=typeof e)&&"api_auth_failed"===e.code}_readCache(e){try{const t=localStorage.getItem(e);if(!t)return;const i=JSON.parse(t);return i.expiresAt<=Date.now()?void localStorage.removeItem(e):i.data}catch{return}}_writeCache(e,t,i){try{localStorage.setItem(e,JSON.stringify({data:t,expiresAt:Date.now()+1e3*i}))}catch{}}_deleteCache(e){try{localStorage.removeItem(e)}catch{}}async getInfo(e={}){const t=e.cache??{};if(!t.refresh){const e=this._readCache(bo);if(void 0!==e)return e}const i=await this._callWS({type:"card_builder/account/info_get"});if(!(null==i?void 0:i.data))throw new Error("Info payload missing");return this._writeCache(bo,i.data,t.ttlSeconds??86400),i.data}async setToken(e){await this._callWS({type:"card_builder/account/token_set",token:e}),Jr({hasToken:!0}),eo()}async getAccount(){const e=await this._callWS({type:"card_builder/account/account_get"});return Jr({hasToken:!0}),eo(),(null==e?void 0:e.data)??{}}async registerFingerprint(){await this._callWS({type:"card_builder/account/account_fingerprint"})}async disconnect(){await this._callWS({type:"card_builder/account/account_disconnect"}),Jr({hasToken:!1}),eo()}async uploadMarketplaceCard(e,t){const i=null==t?void 0:t.screens,n=null==t?void 0:t.updateNotes,r=null==t?void 0:t.updateReasons,o=null==t?void 0:t.themeSupport,s=await this._callWS({type:"card_builder/account/marketplace/cards/shared/upload",card_id:e,screens:i,update_notes:n,update_reasons:r,theme_support:o});return this.invalidateMarketplaceSharedCardsCache(),s}async listMarketplaceCardsShared(e={}){const{local_ids:t,sort:i,direction:n,per_page:r,page:o}=e??{};return this._callWS({type:"card_builder/account/marketplace/cards/shared/list",ids:t,sort:i,direction:n,per_page:r,page:o})}async listAllMarketplaceCardsShared(e){const t=null==e?void 0:e.cache;if(t&&!t.refresh){const e=this._readCache(mo);if(void 0!==e)return e}const i=await this._callWS({type:"card_builder/account/marketplace/cards/shared/list_all"});if(!(null==i?void 0:i.data))throw new Error("Marketplace shared cards payload missing");return t&&this._writeCache(mo,i.data,t.ttlSeconds),i.data}invalidateMarketplaceSharedCardsCache(){this._deleteCache(mo)}async syncMarketplaceSharedCard(e){const t=await this._callWS({type:"card_builder/account/marketplace/cards/shared/sync",card_id:e});if(!(null==t?void 0:t.data))throw new Error("Marketplace shared card sync payload missing");return this.invalidateMarketplaceSharedCardsCache(),t.data}async listMarketplaceCategories(e){const{lang:t,search:i,page:n,per_page:r}=e??{};return this._callWS({type:"card_builder/account/marketplace/categories",lang:t,search:i,page:n,per_page:r})}async listMarketplaceUpdateReasons(){return this._callWS({type:"card_builder/account/marketplace/cards/shared/update_reasons"})}async getMarketplaceCardInfo(e,t){const i=await this._callWS({type:"card_builder/account/marketplace/cards/available/info",marketplace_id:e,version:t});if(!(null==i?void 0:i.data))throw new Error("Marketplace card info payload missing");return i.data}async listMarketplaceCardsAvailableFeatured(e={}){const t=e.cache??{};if(!t.refresh){const e=this._readCache(yo);if(void 0!==e)return e}const i=await this._callWS({type:"card_builder/account/marketplace/cards/available/featured"});if(!(null==i?void 0:i.data))throw new Error("Marketplace featured cards payload missing");return this._writeCache(yo,i.data,t.ttlSeconds??21600),i.data}async prepareMarketplaceDownload(e,t){const i=await this._callWS({type:"card_builder/account/marketplace/cards/available/download_prepare",marketplace_id:e,version:t});if(!(null==i?void 0:i.data))throw new Error("Marketplace card prepare payload missing");return i.data}async confirmMarketplaceDownload(e,t){const i=await this._callWS({type:"card_builder/account/marketplace/cards/available/download_confirm",marketplace_id:e,payload:t});if(!(null==i?void 0:i.data))throw new Error("Marketplace card download confirm payload missing");return this.invalidateMarketplaceCardVersionsCache(),i.data}async prepareMarketplaceUpdate(e,t){const i=await this._callWS({type:"card_builder/account/marketplace/cards/available/update_prepare",card_id:e,version:t});if(!(null==i?void 0:i.data))throw new Error("Marketplace card update prepare payload missing");return i.data}async confirmMarketplaceUpdate(e,t){const i=await this._callWS({type:"card_builder/account/marketplace/cards/available/update_confirm",card_id:e,payload:t});if(!(null==i?void 0:i.data))throw new Error("Marketplace card update confirm payload missing");return this.invalidateMarketplaceCardVersionsCache(),i.data}async checkMarketplaceCardVersions(e,t){const i=null==t?void 0:t.cache;if(i){const t=i.refresh?void 0:this._readCache(vo);if(void 0!==t)return t;const n=await this._callWS({type:go,marketplace_ids:e}),r=(null==n?void 0:n.data)??{};return this._writeCache(vo,r,i.ttlSeconds),r}const n=await this._callWS({type:go,marketplace_ids:e});return(null==n?void 0:n.data)??{}}invalidateMarketplaceCardVersionsCache(){this._deleteCache(vo)}async getMarketplaceCardChangelog(e){const t=await this._callWS({type:"card_builder/account/marketplace/cards/available/changelog",marketplace_id:e});if(!(null==t?void 0:t.data))throw new Error("Marketplace changelog payload missing");return t.data}async getMarketplaceShareDisclaimer(){const e=await this._callWS({type:"card_builder/account/marketplace/disclaimers/share"});if(!(null==e?void 0:e.data))throw new Error("Marketplace share disclaimer payload missing");return e.data}async getMarketplaceDownloadDisclaimer(){const e=await this._callWS({type:"card_builder/account/marketplace/disclaimers/download"});if(!(null==e?void 0:e.data))throw new Error("Marketplace download disclaimer payload missing");return e.data}}class ko{constructor(e){this.hass=e}async getStatus(){const e=await this.hass.callWS({type:"card_builder/account/status"});return{hasToken:Boolean(e.has_token)}}}const xo="card_builder",wo=`${xo}/cards`;class So{constructor(e){this.hass=e}async listCards(){return this.hass.callWS({type:`${wo}/list`})}async getCard(e){return(await this.listCards()).find(t=>t.id===e)}async createCard(e){return this.hass.callWS({type:`${wo}/create`,...e})}async updateCard(e,t){return this.hass.callWS({type:`${wo}/update`,card_id:e,...t})}async deleteCard(e){await this.hass.callWS({type:`${wo}/delete`,card_id:e})}async subscribeToUpdates(e){return await this.hass.connection.subscribeMessage(()=>{e()},{type:`${wo}/subscribe`})}}const _o=`${xo}/editor_settings`;class To{constructor(e){this.hass=e}async getSettings(){return this.hass.callWS({type:`${_o}/get`})}async updateSettings(e){return this.hass.callWS({type:`${_o}/update`,settings:e??{}})}}const Ao=`${xo}/style_presets`;class Io{constructor(e){this.hass=e,this.cache=new Map,this.initialized=!1,this.subscribers=new Set,this.unsubscribe=null}async initialize(){this.initialized||(await this.loadPresets(),await this.subscribeToUpdates(),this.initialized=!0)}dispose(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null),this.cache.clear(),this.subscribers.clear(),this.initialized=!1}async loadPresets(){const e=await this.hass.callWS({type:`${Ao}/list`});this.cache.clear();for(const t of e)this.cache.set(t.id,t);return e}getAllPresets(){return Array.from(this.cache.values())}getCachedPreset(e){return this.cache.get(e)}async getPreset(e){try{const t=await this.hass.callWS({type:`${Ao}/get`,preset_id:e});return this.cache.set(t.id,t),t}catch{return}}async createPreset(e){const t=await this.hass.callWS({type:`${Ao}/create`,name:e.name,description:e.description||"",extends_preset_id:e.extendsPresetId,data:e.data});return this.cache.set(t.id,t),this.notifySubscribers(),t}async updatePreset(e,t){const i=await this.hass.callWS({type:`${Ao}/update`,preset_id:e,...t});return this.cache.set(i.id,i),this.notifySubscribers(),i}async deletePreset(e){await this.hass.callWS({type:`${Ao}/delete`,preset_id:e}),this.cache.delete(e),this.notifySubscribers()}subscribe(e){return this.subscribers.add(e),e(this.getAllPresets()),()=>{this.subscribers.delete(e)}}hasPreset(e){return this.cache.has(e)}getChildPresets(e){return this.getAllPresets().filter(t=>t.extendsPresetId===e)}getInheritanceChain(e){const t=[],i=new Set;let n=e;for(;n&&!i.has(n);){i.add(n);const e=this.cache.get(n);if(!e)break;t.unshift(e),n=e.extendsPresetId}return t}async subscribeToUpdates(){try{this.unsubscribe=await this.hass.connection.subscribeMessage(e=>{e.preset&&(this.cache.set(e.preset.id,e.preset),this.notifySubscribers())},{type:`${Ao}/subscribe`})}catch(e){console.warn("[StylePresetService] Failed to subscribe to updates:",e)}}notifySubscribers(){const e=this.getAllPresets();for(const i of this.subscribers)try{i(e)}catch(t){console.error("[StylePresetService] Subscriber error:",t)}}}const Co=new Map,Po=new Map;function Mo(e){return e.map(e=>e||"").join("|")}class $o{constructor(e){this.hass=e}setHass(e){this.hass=e}async getConvertibleUnits(e,t){if(!t)return[];const i=Mo([e,t]),n=Co.get(i);if(n)return n;const r=this.hass.callWS({type:`${e}/device_class_convertible_units`,device_class:t}).then(e=>Array.isArray(null==e?void 0:e.units)?e.units:[]).catch(()=>[]);return Co.set(i,r),r}async getConversionInfo(e,t,i,n){if(!t||!i||!n||i===n)return{supported:Boolean(i&&n),multiplier:1,from_unit:i,to_unit:n};const r=Mo([e,t,i,n]),o=Po.get(r);if(o)return o;const s=this.hass.callWS({type:"card_builder/unit/conversion_info",domain:e,device_class:t,from_unit:i,to_unit:n}).catch(()=>({supported:!1}));return Po.set(r,s),s}}let Lo=null,Bo=null,Eo=null,Do=null,Ro=null,Oo=null;function No(e){return Ro&&Ro.hass===e||(Ro=new fo(e)),Ro}function zo(e){return Lo&&Lo.hass===e||(Lo=new So(e)),Lo}function Vo(e){return Do&&Do.hass===e||(Do=new ko(e)),Do}async function Fo(e){return Bo&&Bo.hass===e||(Bo=new Io(e),await Bo.initialize()),Bo}function Wo(e){return Eo&&Eo.hass===e||(Eo=new To(e)),Eo}function jo(e){return Oo?Oo.setHass(e):Oo=new $o(e),Oo}const Go=["source","target","custom"],Uo={showUnit:!1,mode:"source",targetUnit:"",customUnit:"",customMultiplier:1};function Ho(e={}){return{...Uo,...e}}function qo(e,t){return Number.isFinite(t)?e*t:e}function Xo(e,t,i,n=!1){const r=function(e){return Number.isFinite(e)?Math.max(0,Math.min(6,Math.round(e))):2}(t),o=Number(e.toFixed(r)).toString();return n&&i?`${o} ${i}`:o}function Yo(e){return{multiplier:1,unit:e.sourceUnit}}function Ko(e){return e.split(".")[0]||"sensor"}async function Qo(e,t,i){return"custom"===t.mode?function(e,t){return{multiplier:Number.isFinite(e.customMultiplier)?e.customMultiplier:1,unit:e.customUnit||t.sourceUnit}}(t,i):"target"===t.mode?async function(e,t,i){const n=t.targetUnit||i.sourceUnit,r=await e.getConversionInfo(i.domain,i.deviceClass,i.sourceUnit,n);return r.supported&&"number"==typeof r.multiplier?{multiplier:r.multiplier,unit:n}:Yo(i)}(e,t,i):Yo(i)}async function Zo(e,t,i){return function(e,t,i){return 1===t.multiplier&&t.unit===e.unit&&e.showUnit===i.showUnit?e:{...e,unit:t.unit,showUnit:i.showUnit,points:e.points.map(e=>({...e,value:qo(e.value,t.multiplier)}))}}(t,await Qo(e,i,{domain:Ko(t.entityId),deviceClass:t.deviceClass,sourceUnit:t.sourceUnit}),i)}async function Jo(e,t,i){return function(e,t,i){return 1===t.multiplier&&t.unit===e.unit&&e.showUnit===i.showUnit?e:{...e,unit:t.unit,showUnit:i.showUnit,points:e.points.map(e=>({...e,value:qo(e.value,t.multiplier)}))}}(t,await Qo(e,i,{domain:Ko(t.entityId),deviceClass:t.deviceClass,sourceUnit:t.sourceUnit}),i)}async function es(e,t,i){const n=jo(e),r=await Promise.all(i.series.map(e=>async function(e,t){var i;const n=t.points.length>0?await Zo(e,t,t.seriesConfig.valueUnit):t;if(!(null==(i=t.items)?void 0:i.length))return n;const r=await Promise.all(t.items.map(i=>Jo(e,i,i.itemConfig.valueUnit||t.seriesConfig.valueUnit)));return{...n,items:r}}(n,e)));return{...i,series:r}}A([I,C,P,M,$,L,B,E,D,R,O,N]);var ts=Object.defineProperty,is=(e,t,i,n)=>{for(var r,o=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&ts(t,i,o),o};const ns=class extends dt{constructor(){super(...arguments),this.statusMessage="",this.chartRefreshTimer=null,this.refreshInProgress=!1}get chartConfigPropName(){return"chartConfig"}getChartConfig(){var e,t;const i=this.normalizeChartConfig(null==(t=null==(e=this.block)?void 0:e.props)?void 0:t[this.chartConfigPropName]);return{...i,series:i.series.slice(0,this.getMaxSeriesCount())}}getChartSeries(e){return e.series}getPanelConfig(){const e=this.getChartConfig();return{properties:{groups:[{id:"chart-editor",label:"Chart",traits:[{type:"action",name:"chartEditor",label:"Chart Editor",buttonLabel:"Configure Chart",actionId:"open-chart-editor"}]}]},targetStyles:{block:{styles:{preset:"full"}},...this.buildChartStyleTargets(e)}}}getTitleStyleTargetId(){return"chart-title"}getLegendStyleTargetId(){return"chart-legend"}getLegendLabelStyleTargetId(){return"chart-legend-label"}getLegendValueStyleTargetId(){return"chart-legend-value"}getLegendUnitStyleTargetId(){return"chart-legend-unit"}getTooltipStyleTargetId(){return"chart-tooltip"}getXAxisStyleTargetId(e){return`chart-x-axis-${e}`}getYAxisStyleTargetId(e){return`chart-y-axis-${e}`}getSeriesStyleTargetId(e){return`chart-series-${e}`}getAllSeriesStyleTargetId(){return"chart-series"}getGridStyleTargetId(e){return`chart-grid-${e}`}getTitleStyleTargetOptions(){return{label:"Chart Title",description:"Style for chart title",styles:{preset:"echart_text",properties:["background.backgroundColor","border.borderColor","border.borderWidth"]}}}getLegendStyleTargetOptions(){return{label:"Legend",description:"Style for chart legend",styles:{properties:["background.backgroundColor","border.borderColor","border.borderWidth","echart.legendIcon","echart.legendIconSize"],exclude:{properties:["typography.textAlign"]}}}}getLegendLabelStyleTargetOptions(){return{label:"Legend Label",description:"Style for chart legend labels",styles:{preset:"echart_text",exclude:{properties:["typography.textAlign"]}}}}getLegendValueStyleTargetOptions(){return{label:"Legend Value",description:"Style for chart legend values",styles:{preset:"echart_text",exclude:{properties:["typography.textAlign"]}}}}getLegendUnitStyleTargetOptions(){return{label:"Legend Unit",description:"Style for chart legend units",styles:{preset:"echart_text",exclude:{properties:["typography.textAlign"]}}}}getTooltipStyleTargetOptions(){return{label:"Tooltip",description:"Style for chart tooltip",styles:{preset:"echart_text",properties:["background.backgroundColor","border.borderColor","border.borderWidth"],exclude:{properties:["typography.textAlign"]}}}}getAxisStyleTargetOptions(e){return{label:e,description:`Style for ${e.toLowerCase()}`,styles:{preset:"echart_stroke",properties:["typography.fontSize","typography.fontWeight"],exclude:{properties:["typography.textAlign"]}}}}getSeriesStyleTargetOptions(e){return{label:e,description:`Style for ${e.toLowerCase()}`,styles:{preset:"echart_fill",properties:["typography.fontSize","typography.fontWeight"]}}}getGridStyleTargetOptions(e){return{label:e,description:`Padding for ${e.toLowerCase()}`,styles:{preset:"echart_grid_spacing"}}}buildTitleStyleTarget(){return{[this.getTitleStyleTargetId()]:this.getTitleStyleTargetOptions()}}buildLegendStyleTarget(){return{[this.getLegendStyleTargetId()]:this.getLegendStyleTargetOptions(),[this.getLegendLabelStyleTargetId()]:this.getLegendLabelStyleTargetOptions()}}buildLegendValueStyleTargets(){return{[this.getLegendValueStyleTargetId()]:this.getLegendValueStyleTargetOptions(),[this.getLegendUnitStyleTargetId()]:this.getLegendUnitStyleTargetOptions()}}buildTooltipStyleTarget(){return{[this.getTooltipStyleTargetId()]:this.getTooltipStyleTargetOptions()}}buildXAxisStyleTargets(e){return Object.fromEntries(e.components.xAxes.map((e,t)=>{const i=this.getXAxisStyleTargetId(e.id),n=this.getAxisTargetLabel("X Axis",e,t+1);return[i,this.getAxisStyleTargetOptions(n)]}))}buildYAxisStyleTargets(e){return Object.fromEntries(e.components.yAxes.map((e,t)=>{const i=this.getYAxisStyleTargetId(e.id),n=this.getAxisTargetLabel("Y Axis",e,t+1);return[i,this.getAxisStyleTargetOptions(n)]}))}buildSeriesStyleTargets(e){return{[this.getAllSeriesStyleTargetId()]:this.getSeriesStyleTargetOptions("All Series"),...Object.fromEntries(e.series.map((e,t)=>{const i=this.getSeriesStyleTargetId(e.id),n=this.getSeriesTargetLabel(e,t+1);return[i,this.getSeriesStyleTargetOptions(n)]}))}}buildSeriesStyleTargetsWithOptions(e,t){return{[this.getAllSeriesStyleTargetId()]:t("All Series"),...Object.fromEntries(e.series.map((e,i)=>{const n=this.getSeriesStyleTargetId(e.id),r=this.getSeriesTargetLabel(e,i+1);return[n,t(r)]}))}}buildSeriesItemStyleTargetsWithOptions(e,t){const i=e.series.flatMap(e=>e.items||[]);return{[this.getAllSeriesStyleTargetId()]:t("All Series"),...Object.fromEntries(i.map((e,i)=>{const n=this.getSeriesStyleTargetId(e.id),r=this.getSeriesItemTargetLabel(e,i+1);return[n,t(r)]}))}}buildGridStyleTargets(e){return Object.fromEntries(e.components.grids.map((e,t)=>{const i=`Grid ${t+1}`;return[this.getGridStyleTargetId(e.id),this.getGridStyleTargetOptions(i)]}))}getAxisTargetLabel(e,t,i){const n=t.label.trim();return n?`${e}: ${n}`:`${e} ${i}`}getSeriesTargetLabel(e,t){var i,n;const r=null==(i=e.name)?void 0:i.trim();if(r)return`Series: ${r}`;const o=null==(n=e.binding.entityConfig.entityId)?void 0:n.trim();return o?`Series: ${o}`:`Series ${t}`}getSeriesItemTargetLabel(e,t){var i,n;const r=null==(i=e.name)?void 0:i.trim();if(r)return`Series: ${r}`;const o=null==(n=e.binding.entityConfig.entityId)?void 0:n.trim();return o?`Series: ${o}`:`Series ${t}`}connectedCallback(){super.connectedCallback(),this._scheduleChartRefresh(!0)}disconnectedCallback(){var e,t;null!==this.chartRefreshTimer&&(window.clearTimeout(this.chartRefreshTimer),this.chartRefreshTimer=null),null==(e=this.resizeObserver)||e.disconnect(),this.resizeObserver=void 0,null==(t=this.chartInstance)||t.dispose(),this.chartInstance=void 0,super.disconnectedCallback()}updated(e){super.updated(e),this._ensureChartInstance(),this._scheduleChartRefresh()}getBlockEntities(){var e;if(!this.block)return[];const t=this.getChartConfig(),i=new Set;for(const n of this.getChartSeries(t)){const t=(null==(e=n.items)?void 0:e.length)?n.items.map(e=>e.binding.entityConfig):[n.binding.entityConfig];for(const e of t){const t=this._resolveEntityId(e);t&&i.add(t)}}return Array.from(i)}render(){return h`
            <div class="chart-shell">
                <div class="chart-root" data-action-target="block"></div>
                ${this.statusMessage?h`<div class="placeholder">${this.statusMessage}</div>`:d}
            </div>
        `}_resolveEntityId(e){if(this.block)return"fixed"===e.mode?e.entityId:"slot"===e.mode?e.slotId?this.documentModel.resolveSlotEntity(e.slotId):void 0:this.documentModel.resolveEntityForBlock(this.block.id).entityId}_scheduleChartRefresh(e=!1){null!==this.chartRefreshTimer&&(window.clearTimeout(this.chartRefreshTimer),this.chartRefreshTimer=null);const t=e?0:180;this.chartRefreshTimer=window.setTimeout(()=>{this.chartRefreshTimer=null,this._refreshChart()},t)}async _refreshChart(){if(!this.refreshInProgress&&this.block&&this.hass&&this.chartInstance){this.refreshInProgress=!0;try{const t=this.getChartConfig(),i=await wr(this.hass,this.documentModel,this.block,this.getChartSeries(t)),n=await es(this.hass,0,i),r=n.series.some(e=>this._hasRuntimeSeriesData(e));this.statusMessage=r?"":"No chart data available";const o=this.buildChartOption(t,n);let s=!1;try{qr({config:t,option:o,getTitleStyle:()=>this.getTargetStyle(this.getTitleStyleTargetId()),getLegendStyle:()=>this.getTargetStyle(this.getLegendStyleTargetId()),getLegendLabelStyle:()=>this.getTargetStyle(this.getLegendLabelStyleTargetId()),getLegendValueStyle:()=>this.getTargetStyle(this.getLegendValueStyleTargetId()),getLegendUnitStyle:()=>this.getTargetStyle(this.getLegendUnitStyleTargetId()),getTooltipStyle:()=>this.getTargetStyle(this.getTooltipStyleTargetId()),getGridStyle:e=>this.getTargetStyle(this.getGridStyleTargetId(e)),getXAxisStyle:e=>this.getTargetStyle(this.getXAxisStyleTargetId(e)),getYAxisStyle:e=>this.getTargetStyle(this.getYAxisStyleTargetId(e)),getAllSeriesStyle:()=>this.getTargetStyle(this.getAllSeriesStyleTargetId()),getSeriesStyle:e=>this.getTargetStyle(this.getSeriesStyleTargetId(e))}),this.chartInstance.setOption(o,{notMerge:!0}),s=!0}catch(e){console.warn("[Chart] Style patch could not be applied, rendering base chart option.",e)}s||this.chartInstance.setOption(this.buildChartOption(t,n),{notMerge:!0})}catch(t){this.statusMessage="Unable to load chart data"}finally{this.refreshInProgress=!1}}}_ensureChartInstance(){this.chartRoot&&(this.chartInstance||(this.chartInstance=z(this.chartRoot),this.resizeObserver=new ResizeObserver(()=>{var e;null==(e=this.chartInstance)||e.resize()}),this.resizeObserver.observe(this.chartRoot)))}_hasRuntimeSeriesData(e){var t;return e.points.length>0||Boolean(null==(t=e.items)?void 0:t.some(e=>e.points.length>0))}};ns.styles=[...dt.styles,l`
            :host {
                display: block;
                min-width: 1px;
                min-height: 1px;
                padding: 0;
                height: 300px;
            }

            .chart-shell {
                position: relative;
                width: 100%;
                height: 100%;
            }

            .chart-root {
                width: 100%;
                height: 100%;
            }

            .placeholder {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: var(--secondary-text-color, #666);
                text-align: center;
                padding: 12px;
                pointer-events: none;
            }
        `];let rs=ns;function os(e,t,i){return"fixed"===e.mode?{min:Number.isFinite(e.min)?e.min:void 0,max:Number.isFinite(e.max)?e.max:void 0}:"data"===e.mode?{min:t,max:i}:"data-offset"===e.mode?{min:void 0!==t?t-(e.minOffset||0):void 0,max:void 0!==i?i+(e.maxOffset||0):void 0}:{}}function ss(e){return e.hideMinMaxLabels&&"data"===e.range.mode}function as(e){if("number"==typeof e.step&&Number.isFinite(e.step))return e.step>0?e.step:void 0}function ls(e){switch(e){case"seconds":return 1e3;case"minutes":return 6e4;case"hours":return 36e5;case"days":return 864e5}}is([k(".chart-root")],rs.prototype,"chartRoot"),is([c()],rs.prototype,"statusMessage");const cs={"1-second":ls("seconds"),"2-seconds":2*ls("seconds")+1,"5-seconds":5*ls("seconds")+1,"10-seconds":10*ls("seconds")+1,"15-seconds":15*ls("seconds")+1,"20-seconds":20*ls("seconds")+1,"30-seconds":30*ls("seconds")+1,"1-minute":ls("minutes"),"2-minutes":2*ls("minutes")+1,"5-minutes":5*ls("minutes")+1,"10-minutes":10*ls("minutes")+1,"15-minutes":15*ls("minutes")+1,"20-minutes":20*ls("minutes")+1,"30-minutes":30*ls("minutes")+1,"1-hour":ls("hours"),"2-hours":2*ls("hours")+1,"4-hours":4*ls("hours")+1,"6-hours":6*ls("hours")+1,"12-hours":12*ls("hours")+1,"1-day":ls("days"),"2-days":2*ls("days")+1,"4-days":4*ls("days")+1,"7-days":Math.ceil(7.5*ls("days"))+1,"16-days":16*ls("days")+1};function ds(e){return Number.isFinite(e)?Math.max(0,Math.min(6,Math.round(e))):2}function us(e){return Number(e.toFixed(12))}function hs(e,t,i,n){if(void 0===n)return{min:t,max:i};if("data"!==e.range.mode&&"data-offset"!==e.range.mode)return{min:t,max:i};if(!Number.isFinite(t)||!Number.isFinite(i))return{min:t,max:i};const r=function(e){if("number"==typeof e.stepAlignment&&Number.isFinite(e.stepAlignment))return e.stepAlignment}(e);if(void 0===r)return{min:t,max:i};const o=function(e,t,i){return us(t+Math.floor((e-t)/i+Number.EPSILON)*i)}(Number(t),r,n),s=function(e,t,i){return us(t+Math.ceil((e-t)/i-Number.EPSILON)*i)}(Number(i),r,n);return{min:o,max:s}}function ps(e,t){return"manual"===e.offsetMode?Number.isFinite(e.offsetPx)?e.offsetPx:0:42*t}function gs(e){if("value"!==e.type&&"log"!==e.type)return;const t=ds(e.decimals);return e=>function(e,t){return Number(e.toFixed(t)).toString()}(e,t)}function ms(e){if(!e)return;const t=new Date(e).getTime();return Number.isFinite(t)?t:void 0}function vs(e){return Number.isFinite(e.displayFrom)&&Number.isFinite(e.displayTo)}function ys(e){return e&&vs(e)?{min:e.displayFrom,max:e.displayTo}:{}}function bs(e,t){for(const i of t.orderedIds){const t=ys(e.get(i));if(void 0!==t.min||void 0!==t.max)return t}return{}}function fs(e,t,i){if("fixed"===e.timeRangeSource)return{min:ms(e.fixedStart),max:ms(e.fixedEnd)};const n=function(e,t){const i=new Map(e.series.map(e=>[e.id,e])),n=new Map;for(const r of t.orderedIds){const e=i.get(r);e&&vs(e)&&n.set(r,e)}return n}(t,i);if("selected-series"===e.timeRangeSource){const t=function(e,t,i){if(!i||!t.idSet.has(i))return{};const n=e.get(i);return n?ys(n):{}}(n,i,e.timeRangeSeriesId);return void 0!==t.min||void 0!==t.max?t:bs(n,i)}return"first-series"===e.timeRangeSource?bs(n,i):function(e,t){let i=1/0,n=-1/0;const r=new Map(e.series.map(e=>[e.id,e]));for(const o of t.orderedIds){const e=r.get(o);e&&vs(e)&&(e.displayFrom<i&&(i=e.displayFrom),e.displayTo>n&&(n=e.displayTo))}return{min:Number.isFinite(i)?i:void 0,max:Number.isFinite(n)?n:void 0}}(t,i)}function ks(e,t,i,n,r){const o="category"!==e.type,s="time"===e.type,a=o?s?fs(e,t,i):os(e.range,n,r):{},l=ss(e),c=o?function(e){return"time"!==e.type?as(e):"preset"===e.timeTick.mode?cs[e.timeTick.preset]:void 0}(e):void 0,d=s?a:hs(e,a.min,a.max,c),u=gs(e);return{type:e.type,show:e.enabled,position:e.position,name:e.label||void 0,nameLocation:"middle",nameGap:28,axisLabel:{show:e.showLabels,hideOverlap:!0,showMinLabel:!l,showMaxLabel:!l,formatter:u},axisLine:{show:e.showAxisLine},axisTick:{show:e.showTicks},splitLine:{show:e.showGridLines},interval:s?void 0:c,minInterval:s?c:void 0,maxInterval:s?c:void 0,min:o?d.min??(s?void 0:n):void 0,max:o?d.max??(s?void 0:r):void 0}}function xs(e,t,i,n=0,r,o=!1){const s="category"!==e.type,a=s?os(e.range,t,i):{},l=ss(e),c=s?as(e):void 0,d=s?function(e,t){if(void 0!==t||"number"!=typeof e.splitNumber||!Number.isFinite(e.splitNumber))return;const i=Math.floor(e.splitNumber);return i>0?i:void 0}(e,c):void 0,u=hs(e,a.min,a.max,c),h=function(e,t,i=!1){if("value"!==e.type&&"log"!==e.type)return;const n=ds(e.decimals);return e=>Xo(e,n,t,i)}(e,r,o);return{type:e.type,show:e.enabled,name:e.label||void 0,nameLocation:"middle",nameGap:36,position:e.position,offset:ps(e,n),axisLabel:{show:e.showLabels,showMinLabel:!l,showMaxLabel:!l,formatter:h},axisLine:{show:e.showAxisLine},axisTick:{show:e.showTicks},splitLine:{show:e.showGridLines},splitNumber:d,interval:c,min:s?u.min:void 0,max:s?u.max:void 0}}function ws(e){return e.title.show&&Boolean(e.title.text.trim())}function Ss(e){if(ws(e))return{text:e.title.text,left:"center",top:"center"===e.title.position?"middle":"top"===e.title.position?6:void 0,bottom:"bottom"===e.title.position?8:void 0,textStyle:{fontSize:13,fontWeight:600}}}function _s(e){switch(e.position){case"top":return{top:8,left:"center"};case"bottom":return{bottom:4,left:"center"};case"left":return{left:8,top:"middle"};case"right":return{right:8,top:"middle"}}}function Ts(e){return Number.isFinite(e)?Math.max(0,Math.min(6,Math.round(e))):2}function As(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Is(e,t){if(!t)return;const i=Ts(e.tooltip.decimals),n=new Map(t.series.map(e=>[e.id,e.unit])),r=new Map(t.series.map(e=>[e.name,e.unit])),o=new Map(t.series.map(e=>[e.id,e.showUnit])),s=new Map(t.series.map(e=>[e.name,e.showUnit]));return e=>{const t=Array.isArray(e)?e:[e],a=t[0];return`${(null==a?void 0:a.axisValueLabel)?`${As(a.axisValueLabel)}<br/>`:""}${t.map(e=>{var t,a,l,c;const d=function(e){const t=null==e?void 0:e.value;return"number"==typeof t&&Number.isFinite(t)?t:Array.isArray(t)&&"number"==typeof t[1]&&Number.isFinite(t[1])?t[1]:void 0}(e),u=(null==(t=null==e?void 0:e.data)?void 0:t.unit)||n.get(null==e?void 0:e.seriesId)||r.get(null==e?void 0:e.seriesName),h=(null==(a=null==e?void 0:e.data)?void 0:a.showUnit)??o.get(null==e?void 0:e.seriesId)??s.get(null==e?void 0:e.seriesName)??!1,p=void 0===d?"":Xo(d,i,u,h);return`${(null==e?void 0:e.marker)||""}${As((null==(l=null==e?void 0:e.data)?void 0:l.id)?(null==e?void 0:e.name)||(null==(c=null==e?void 0:e.data)?void 0:c.name)||(null==e?void 0:e.seriesName)||"":(null==e?void 0:e.seriesName)||(null==e?void 0:e.name)||"")}: ${As(p)}`}).join("<br/>")}`}}function Cs(e,t){var i,n,r;const o=function(e){let t=1/0,i=-1/0,n=1/0,r=-1/0;for(const o of e.series){o.displayFrom<t&&(t=o.displayFrom),o.displayTo>i&&(i=o.displayTo);for(const e of o.points)e.value<n&&(n=e.value),e.value>r&&(r=e.value)}return{xMin:Number.isFinite(t)?t:void 0,xMax:Number.isFinite(i)?i:void 0,yMin:Number.isFinite(n)?n:void 0,yMax:Number.isFinite(r)?r:void 0}}(t),s=e.components.grids,a=e.components.xAxes,l=e.components.yAxes,c=new Map(s.map((e,t)=>[e.id,t])),d=new Map(a.map((e,t)=>[e.id,t])),u=new Map(l.map((e,t)=>[e.id,t])),h=null==(i=s[0])?void 0:i.id,p=null==(n=a[0])?void 0:n.id,g=null==(r=l[0])?void 0:r.id,m=new Map,v=new Map;for(const w of a)v.set(w.id,{orderedIds:[],idSet:new Set});for(const w of l)m.set(w.id,new Set);for(const w of e.series){const e=w.xAxisId||p,t=w.yAxisId||g;if(!e||!t)continue;const i=v.get(e);i&&!i.idSet.has(w.id)&&(i.orderedIds.push(w.id),i.idSet.add(w.id));const n=m.get(t);n&&n.add(w.id)}let y=0,b=0;const f=l.map(i=>{const n=m.get(i.id)||new Set,r=function(e,t){let i=1/0,n=-1/0;for(const r of e.series)if(t.has(r.id))for(const e of r.points)e.value<i&&(i=e.value),e.value>n&&(n=e.value);return{min:Number.isFinite(i)?i:void 0,max:Number.isFinite(n)?n:void 0}}(t,n),o=function(e,t,i,n){const r=new Map(t.series.map(e=>[e.id,e])),o=e.series.find(e=>{var t;return(e.yAxisId||n)===i&&((null==(t=r.get(e.id))?void 0:t.points.length)||0)>0});if(!o)return{showUnit:!1};const s=r.get(o.id);return{unit:null==s?void 0:s.unit,showUnit:Boolean(null==s?void 0:s.showUnit)}}(e,t,i.id,g),s="left"===i.position?y:b;i.enabled&&("left"===i.position?y+=1:b+=1);const a=i.gridId||h,l=a?c.get(a)??0:0;return{...xs(i,r.min,r.max,s,o.unit,o.showUnit),gridIndex:l}}),k=a.map(e=>{const i=v.get(e.id)||{orderedIds:[],idSet:new Set},n=e.gridId||h,r=n?c.get(n)??0:0;return{...ks(e,t,i,o.xMin,o.xMax),gridIndex:r}}),x=s.map(t=>function(e,t,i,n){if(!t.autoLayout)return{left:t.left,right:t.right,top:t.top,bottom:t.bottom,containLabel:t.containLabel};let r=10,o=10,s=10,a=0;if(ws(e)&&("top"===e.title.position?r+=28:"bottom"===e.title.position&&(s+=28)),e.legend.show)switch(e.legend.position){case"top":r+=30;break;case"bottom":s+=30;break;case"left":a+=96;break;case"right":o+=96}return i>1&&(a+=36*(i-1)),n>1&&(o+=36*(n-1)),{left:a,right:o,top:r,bottom:s,containLabel:t.containLabel}}(e,t,y,b));return{gridOptions:x,xAxisOptions:k,yAxisOptions:f,gridIndexById:c,xAxisIndexById:d,yAxisIndexById:u,defaultGridId:h,defaultXAxisId:p,defaultYAxisId:g,leftEnabledAxisCount:y,rightEnabledAxisCount:b}}function Ps(e,t,i){const n=e.components.dataZoom.filter(e=>e.enabled).map(e=>({type:e.type,xAxisIndex:e.xAxisIds.map(e=>t.get(e)).filter(e=>void 0!==e),yAxisIndex:e.yAxisIds.map(e=>i.get(e)).filter(e=>void 0!==e),start:e.start,end:e.end,height:"slider"===e.type?e.height:void 0}));return n.length>0?n:void 0}function Ms(e,t){const i=e.components.visualMaps.filter(e=>e.enabled).map(e=>({type:e.type,min:e.min,max:e.max,dimension:e.dimension,seriesIndex:e.seriesIds.map(e=>t.get(e)).filter(e=>void 0!==e)}));return i.length>0?i:void 0}function $s(e){const t=e.components.datasets.filter(e=>Array.isArray(e.source)).map(e=>({id:e.id,source:e.source}));return t.length>0?t:void 0}function Ls(e,t){return t?{...e,...t}:e}function Bs(e,t){return e?t?[...Array.isArray(e)?e:[e],...Array.isArray(t)?t:[t]]:e:t}function Es(e,t){return e.series.push(...t.series),e.title=void 0!==t.title?t.title:e.title,e.legendPatch=Ls(e.legendPatch??{},t.legendPatch),e.tooltipPatch=Ls(e.tooltipPatch??{},t.tooltipPatch),e.graphic=Bs(e.graphic,t.graphic),e}function Ds(e,t,i={}){const n=Cs(e,t),r=new Map(e.series.map(e=>[e.id,e])),o={config:e,runtimeData:t,components:n,configSeriesById:r,chartSize:i.chartSize},s=[],a=new Map;let l,c=Ss(e),d=function(e){return{show:e.legend.show,orient:e.legend.orientation,type:"scroll",..._s(e.legend)}}(e),u=function(e,t){if("none"===e.tooltip.trigger)return{show:!1};const i=Ts(e.tooltip.decimals);return{show:e.tooltip.show,trigger:e.tooltip.trigger,confine:!0,formatter:Is(e,t),valueFormatter:e=>"number"!=typeof e?"":e.toFixed(i)}}(e,t);const h=function(e,t){const i={series:[]};for(const n of e.series){const e=Tr(n.seriesConfig.type);e&&Es(i,e.buildSeriesOptions([n],t))}return i}(t,o);!function(e,t,i){for(const n of e){const e=t.length;t.push(n.option);for(const t of n.sourceSeriesIds)i.set(t,e)}}(h.series,s,a),c=null===h.title?{show:!1}:h.title??c,d=Ls(d,h.legendPatch),u=Ls(u,h.tooltipPatch),l=Bs(l,h.graphic);const p=e.capabilities.usesCartesianComponents;return{animationDuration:220,color:t.series.map(e=>e.color),title:c,legend:d,tooltip:u,grid:p?n.gridOptions:void 0,xAxis:p?n.xAxisOptions:void 0,yAxis:p?n.yAxisOptions:void 0,dataZoom:p?Ps(e,n.xAxisIndexById,n.yAxisIndexById):void 0,visualMap:Ms(e,a),dataset:$s(e),graphic:l,series:s}}function Rs(e,t){const i=e.seriesConfig.xAxisId||t.components.defaultXAxisId;return i?t.components.xAxisIndexById.get(i)??0:0}function Os(e,t){const i=e.seriesConfig.yAxisId||t.components.defaultYAxisId;return i?t.components.yAxisIndexById.get(i)??0:0}function Ns(e,t){const i=e.seriesConfig.style,n="area"===i.lineMode;return{id:e.id,name:e.name,type:"line",data:e.points.map(e=>[e.timestamp,e.value]),xAxisIndex:Rs(e,t),yAxisIndex:Os(e,t),smooth:i.smooth??!0,showSymbol:i.showPoints??!1,symbolSize:7,lineStyle:{width:i.lineWidth??2,color:e.color},itemStyle:{color:e.color},areaStyle:n?{opacity:i.areaOpacity,color:e.color}:void 0,connectNulls:i.connectNulls??!1}}function zs(e,t){return Ds(e,t)}_r({type:"line",buildSeriesOptions:function(e,t){return{series:e.map(e=>({option:Ns(e,t),sourceSeriesIds:[e.id]}))}},applySeriesStyle:function(e,t){var i,n,r,o,s;if(!e||0===Object.keys(t).length)return;const a=Er(t.color),l=Er(t.borderColor),c=Rr(t.borderWidth),d=$r(t.opacity),u=Er(t.echartLineColor)??a,h=Er(t.echartAreaColor),p=$r(t.echartLineWidth),g=function(e){if(!e)return;const t=e.trim();return Ir.has(t)?t:void 0}(t.echartLineSymbol),m=$r(t.echartLineSymbolSize);e.lineStyle=zr(e.lineStyle,{color:u??(null==(i=e.lineStyle)?void 0:i.color),width:p??c??(null==(n=e.lineStyle)?void 0:n.width),opacity:d}),e.itemStyle=zr(e.itemStyle,{color:u??(null==(r=e.itemStyle)?void 0:r.color),borderColor:l??(null==(o=e.itemStyle)?void 0:o.borderColor),borderWidth:c,opacity:d}),e.areaStyle&&(e.areaStyle=zr(e.areaStyle,{color:h??(null==(s=e.areaStyle)?void 0:s.color)})),void 0!==g&&(e.symbol=g),void 0!==m&&(e.symbolSize=m),e.label=zr(e.label,Nr(t))},applySeriesItemStyle:function(e){return e}});const Vs=["#3b82f6","#22c55e","#f97316"],Fs=["mean","min","max","sum","state","change"],Ws=["last","max","delta"],js=["5minute","hour","day","week","month"],Gs=["min-max","every-nth","average","none"],Us=["by-points","by-window"],Hs=["rolling","today","yesterday","last-days","calendar-day","custom"],qs=["1-second","2-seconds","5-seconds","10-seconds","15-seconds","20-seconds","30-seconds","1-minute","2-minutes","5-minutes","10-minutes","15-minutes","20-minutes","30-minutes","1-hour","2-hours","4-hours","6-hours","12-hours","1-day","2-days","4-days","7-days","16-days"],Xs={mode:"line",smooth:!0,lineWidth:2,showPoints:!1,areaOpacity:.25,connectNulls:!1},Ys={mode:"grouped",barWidth:18,borderRadius:0},Ks={mode:"pie",outerRadius:85,innerRadius:55,titleCenterReference:"pie",centerMode:"auto",centerXReference:"center",centerXOffset:0,centerYReference:"middle",centerYOffset:0,showLegendValue:!1,showLabel:!0,showSliceValue:!1},Qs={show:!1,text:"",position:"top"},Zs={show:!0,position:"bottom",orientation:"horizontal"},Js={show:!0,trigger:"axis",decimals:2},ea={mode:"rolling",amount:24,unit:"hours",offsetAmount:0,offsetUnit:"days",date:"",start:"",end:"",displayMode:"absolute",showFullRange:!1},ta={mode:"auto",minOffset:0,maxOffset:0},ia={enabled:!0,containLabel:!0,autoLayout:!0,top:10,right:10,bottom:10,left:0},na={type:"time",position:"bottom",timeRangeSource:"series-union",timeRangeSeriesId:"",fixedStart:"",fixedEnd:"",timeTick:{mode:"auto",preset:"1-hour",custom:{unit:"hours"}},enabled:!0,label:"",showLabels:!0,showGridLines:!1,showAxisLine:!0,showTicks:!0,hideMinMaxLabels:!1,step:void 0,stepAlignment:void 0,decimals:0,range:{...ta}},ra={type:"value",enabled:!0,label:"",showLabels:!0,showGridLines:!0,showAxisLine:!0,showTicks:!0,hideMinMaxLabels:!1,step:void 0,stepAlignment:void 0,decimals:2,range:{...ta},offsetMode:"auto",offsetPx:0,unit:Ho()},oa={mode:"statistics",valueSource:"state",attribute:"",statisticsPeriod:"hour",statisticType:"mean",historyAggregation:"last",downsampling:{strategy:"min-max",sizing:{mode:"by-points",maxPoints:240}},timeRange:{...ea}},sa={chartType:"line-area",defaultSeriesType:"line",defaultCoordinateSystem:"cartesian2d",usesCartesianComponents:!0,allowedDataModes:["statistics","history"],fallbackDataMode:"statistics"},aa={chartType:"bars",defaultSeriesType:"bar",defaultCoordinateSystem:"cartesian2d",usesCartesianComponents:!0,allowedDataModes:["statistics","history"],fallbackDataMode:"statistics"},la={chartType:"pie-donut",defaultSeriesType:"pie",defaultCoordinateSystem:"none",usesCartesianComponents:!1,allowedDataModes:["live","statistics","history"],fallbackDataMode:"live"};function ca(e){return`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function da(e,t){return t.allowedDataModes.includes(e)?e:t.fallbackDataMode}function ua(e,t){if("by-window"===(null==e?void 0:e.mode)){const t=e.window,i="minutes"===(null==t?void 0:t.unit)||"hours"===(null==t?void 0:t.unit)||"days"===(null==t?void 0:t.unit)?t.unit:"hours";return{mode:"by-window",window:{value:Number.isFinite(null==t?void 0:t.value)?Math.max(1,Math.round(t.value)):1,unit:i}}}const i=Number.isFinite(null==e?void 0:e.maxPoints)?e.maxPoints:void 0;return{mode:"by-points",maxPoints:Math.max(1,Math.round(i??t))}}function ha(e,t=oa.downsampling.sizing.maxPoints){return{strategy:(null==e?void 0:e.strategy)&&Gs.includes(e.strategy)?e.strategy:oa.downsampling.strategy,sizing:ua((null==e?void 0:e.sizing)||(Number.isFinite(null==e?void 0:e.maxPoints)?{mode:"by-points",maxPoints:e.maxPoints}:void 0),t)}}function pa(e,t,i,n){return{...t,...e||{},mode:da((null==e?void 0:e.mode)||t.mode,i),statisticType:(null==e?void 0:e.statisticType)||t.statisticType,historyAggregation:(null==e?void 0:e.historyAggregation)||t.historyAggregation,downsampling:ha(null==e?void 0:e.downsampling,n??("by-points"===t.downsampling.sizing.mode?t.downsampling.sizing.maxPoints:oa.downsampling.sizing.maxPoints)),timeRange:{...ea,...(null==e?void 0:e.timeRange)||{}}}}function ga(e={}){return{...ia,...e,id:e.id||ca("grid")}}function ma(e={}){var t;return{...na,...e,id:e.id||ca("x-axis"),gridId:e.gridId||"",timeTick:{...na.timeTick,...e.timeTick||{},custom:{...na.timeTick.custom,...(null==(t=e.timeTick)?void 0:t.custom)||{}}},range:{...ta,...e.range||{}}}}function va(e=0,t={}){const i=e%2==0?"left":"right";return{...ra,...t,id:t.id||ca("y-axis"),gridId:t.gridId||"",position:t.position||i,unit:Ho(t.unit),range:{...ta,...t.range||{}}}}function ya(e=0,t,i={}){var n,r,o,s,a,l;const c=i.type||"line",d=i.coordinateSystem||"cartesian2d",u=i.binding||{};return{id:i.id||ca("series"),name:"",color:Vs[e%Vs.length],type:c,coordinateSystem:d,gridId:i.gridId??(null==t?void 0:t.gridId),xAxisId:i.xAxisId??(null==t?void 0:t.xAxisId),yAxisId:i.yAxisId??(null==t?void 0:t.yAxisId),stack:i.stack,valueUnit:Ho(i.valueUnit),binding:{entityConfig:{mode:(null==(n=u.entityConfig)?void 0:n.mode)??"inherited",entityId:null==(r=u.entityConfig)?void 0:r.entityId,slotId:null==(o=u.entityConfig)?void 0:o.slotId},dataSource:{...oa,...u.dataSource||{},historyAggregation:(null==(s=u.dataSource)?void 0:s.historyAggregation)||oa.historyAggregation,downsampling:ha(null==(a=u.dataSource)?void 0:a.downsampling),timeRange:{...ea,...(null==(l=u.dataSource)?void 0:l.timeRange)||{}}}},style:{...i.style||{}},items:i.items}}function ba(e=0,t={}){var i,n,r,o,s,a;const l=t.binding||{};return{id:t.id||ca("item"),name:t.name||"",color:t.color||Vs[e%Vs.length],valueUnit:Ho(t.valueUnit),binding:{entityConfig:{mode:(null==(i=l.entityConfig)?void 0:i.mode)??"inherited",entityId:null==(n=l.entityConfig)?void 0:n.entityId,slotId:null==(r=l.entityConfig)?void 0:r.slotId},dataSource:{...oa,...l.dataSource||{},historyAggregation:(null==(o=l.dataSource)?void 0:o.historyAggregation)||oa.historyAggregation,downsampling:ha(null==(s=l.dataSource)?void 0:s.downsampling),timeRange:{...ea,...(null==(a=l.dataSource)?void 0:a.timeRange)||{}}}},style:{...t.style||{}}}}function fa(e,t,i,n,r){var o,s,a,l,c,d,u;const h=ba(t,{valueUnit:n});return{...h,...e,valueUnit:Ho(e.valueUnit??n??h.valueUnit),binding:{...h.binding,...e.binding||{},entityConfig:{mode:(null==(s=null==(o=e.binding)?void 0:o.entityConfig)?void 0:s.mode)??h.binding.entityConfig.mode,entityId:null==(l=null==(a=e.binding)?void 0:a.entityConfig)?void 0:l.entityId,slotId:null==(d=null==(c=e.binding)?void 0:c.entityConfig)?void 0:d.slotId},dataSource:pa(null==(u=e.binding)?void 0:u.dataSource,h.binding.dataSource,i,r)},style:{...h.style,...e.style||{}}}}function ka(e){const t=function(){const e=ga();return{grids:[e],xAxes:[ma({gridId:e.id})],yAxes:[va(0,{gridId:e.id})],dataZoom:[],visualMaps:[],datasets:[]}}(),i=t.grids[0],n=t.xAxes[0],r=t.yAxes[0],o={title:{...Qs},legend:{...Zs},tooltip:{...Js}},s=ya(0,{gridId:i.id,xAxisId:n.id,yAxisId:r.id},{type:e.defaultSeriesType,coordinateSystem:e.defaultCoordinateSystem});return e.usesCartesianComponents||(s.gridId=void 0,s.xAxisId=void 0,s.yAxisId=void 0),{...o,chartType:e.chartType,capabilities:{usesCartesianComponents:e.usesCartesianComponents},series:[s],components:t}}function xa(e,t){return Number.isFinite(t)?e.slice(0,t):e}function wa(e){return"string"==typeof e&&e.trim()?e:void 0}function Sa(e,t,i){const n=ka(t);if(!e||"object"!=typeof e){const e=xa(n.series,i);return e.length===n.series.length?n:{...n,series:e}}const r=e,o="number"==typeof e.maxPoints?e.maxPoints:void 0,s=function(e,t){const i=Array.isArray(null==e?void 0:e.grids)?e.grids.filter(e=>Boolean(e&&"object"==typeof e)).map(e=>ga(e)):t.grids,n=i.length>0?i:t.grids,r=n[0].id,o=new Set(n.map(e=>e.id)),s=Array.isArray(null==e?void 0:e.xAxes)?e.xAxes.filter(e=>Boolean(e&&"object"==typeof e)).map(e=>ma({...e,gridId:(null==e?void 0:e.gridId)&&o.has(e.gridId)?e.gridId:r})):t.xAxes,a=s.length>0?s:[ma({...t.xAxes[0],gridId:r})],l=Array.isArray(null==e?void 0:e.yAxes)?e.yAxes.filter(e=>Boolean(e&&"object"==typeof e)).map((e,t)=>va(t,{...e,gridId:(null==e?void 0:e.gridId)&&o.has(e.gridId)?e.gridId:r})):t.yAxes;return{grids:n,xAxes:a,yAxes:l.length>0?l:[va(0,{...t.yAxes[0],gridId:r})],dataZoom:Array.isArray(null==e?void 0:e.dataZoom)?e.dataZoom.filter(e=>Boolean(e&&"object"==typeof e)).map(e=>({id:e.id||ca("data-zoom"),enabled:e.enabled??!1,type:e.type||"inside",xAxisIds:Array.isArray(e.xAxisIds)?[...e.xAxisIds]:[],yAxisIds:Array.isArray(e.yAxisIds)?[...e.yAxisIds]:[],start:e.start,end:e.end,height:e.height})):t.dataZoom,visualMaps:Array.isArray(null==e?void 0:e.visualMaps)?e.visualMaps.filter(e=>Boolean(e&&"object"==typeof e)).map(e=>({id:e.id||ca("visual-map"),enabled:e.enabled??!1,type:e.type||"continuous",min:e.min??0,max:e.max??100,dimension:e.dimension??1,seriesIds:Array.isArray(e.seriesIds)?[...e.seriesIds]:[]})):t.visualMaps,datasets:Array.isArray(null==e?void 0:e.datasets)?e.datasets.filter(e=>Boolean(e&&"object"==typeof e)).map(e=>({id:e.id||ca("dataset"),source:Array.isArray(e.source)?[...e.source]:[]})):t.datasets}}(r.components,n.components),a=xa(function(e,t,i,n,r){var o,s,a;if(!Array.isArray(e))return i;const l=null==(o=t.grids[0])?void 0:o.id,c=null==(s=t.xAxes[0])?void 0:s.id,d=null==(a=t.yAxes[0])?void 0:a.id,u=new Set(t.grids.map(e=>e.id)),h=new Set(t.xAxes.map(e=>e.id)),p=new Set(t.yAxes.map(e=>e.id));return e.filter(e=>Boolean(e&&"object"==typeof e)).map((e,t)=>{var i,o,s,a,g,m,v;const y=e.type||n.defaultSeriesType,b=e.coordinateSystem||n.defaultCoordinateSystem,f=ya(t,{gridId:l,xAxisId:c,yAxisId:d},{type:y,coordinateSystem:b}),k={...f,...e,type:y,coordinateSystem:b,valueUnit:Ho(e.valueUnit??f.valueUnit),binding:{...f.binding,...e.binding||{},entityConfig:{mode:(null==(o=null==(i=e.binding)?void 0:i.entityConfig)?void 0:o.mode)??f.binding.entityConfig.mode,entityId:null==(a=null==(s=e.binding)?void 0:s.entityConfig)?void 0:a.entityId,slotId:null==(m=null==(g=e.binding)?void 0:g.entityConfig)?void 0:m.slotId},dataSource:pa(null==(v=e.binding)?void 0:v.dataSource,f.binding.dataSource,n,r)},style:{...f.style,...e.style||{}},items:Array.isArray(e.items)?e.items.filter(e=>Boolean(e&&"object"==typeof e)).map((t,i)=>fa(t,i,n,e.valueUnit??f.valueUnit,r)):void 0};return n.usesCartesianComponents?(k.gridId=k.gridId&&u.has(k.gridId)?k.gridId:l,k.xAxisId=k.xAxisId&&h.has(k.xAxisId)?k.xAxisId:c,k.yAxisId=k.yAxisId&&p.has(k.yAxisId)?k.yAxisId:d):(k.gridId=void 0,k.xAxisId=void 0,k.yAxisId=void 0),k})}(r.series,s,n.series,t,o),i);return{...n,chartType:t.chartType,capabilities:{usesCartesianComponents:t.usesCartesianComponents},series:a,title:{...n.title,...r.title||{}},legend:{...n.legend,...r.legend||{}},tooltip:{...n.tooltip,...r.tooltip||{}},components:s}}function _a(){const e=ka(sa);return{...e,chartType:"line-area",series:e.series.map(e=>({...e,type:"line",coordinateSystem:"cartesian2d",style:{...e.style,lineMode:Xs.mode,smooth:Xs.smooth,lineWidth:Xs.lineWidth,showPoints:Xs.showPoints,areaOpacity:Xs.areaOpacity,connectNulls:Xs.connectNulls}})),specific:{...Xs}}}function Ta(){const e=ka(aa);return{...e,chartType:"bars",series:e.series.map(e=>({...e,type:"bar",coordinateSystem:"cartesian2d",style:{...e.style,barWidth:Ys.barWidth,borderRadius:Ys.borderRadius},stack:void 0})),specific:{...Ys}}}function Aa(){const e=ka(la),t=e.series[0],i=Ho(),n={...t,id:ca("pie-series"),type:"pie",coordinateSystem:"none",gridId:void 0,xAxisId:void 0,yAxisId:void 0,valueUnit:i,binding:{...t.binding,dataSource:{...t.binding.dataSource,mode:"live",statisticType:"sum",historyAggregation:"last"}},style:{...t.style,innerRadius:Ks.innerRadius},items:[ba(0,{id:t.id,name:t.name,color:t.color,valueUnit:i,binding:{...t.binding,dataSource:{...t.binding.dataSource,mode:"live",statisticType:"sum",historyAggregation:"last"}}})]};return{...e,chartType:"pie-donut",valueUnit:i,series:[n],specific:{...Ks}}}function Ia(e){return JSON.parse(JSON.stringify(e))}function Ca(e){return Ia(e)}function Pa(e){return Ia(e)}function Ma(e){return Ia(e)}function $a(e,t){const i=Sa(e,sa,t),n=e&&"object"==typeof e?e:void 0,r={...Xs,...(null==n?void 0:n.specific)||{}},o=new Map(i.components.yAxes.map(e=>[e.id,e])),s=i.components.yAxes[0],a=i.series.map(e=>{const t=(e.yAxisId?o.get(e.yAxisId):void 0)||s;return{...e,type:"line",coordinateSystem:"cartesian2d",valueUnit:Ho(null==t?void 0:t.unit),style:{...e.style,lineMode:r.mode,smooth:r.smooth,lineWidth:r.lineWidth,showPoints:r.showPoints,areaOpacity:r.areaOpacity,connectNulls:r.connectNulls}}});return{...i,chartType:"line-area",series:a,specific:r}}function La(e,t){const i=Sa(e,aa,t),n=e&&"object"==typeof e?e:void 0,r={...Ys,...(null==n?void 0:n.specific)||{}},o=new Map(i.components.yAxes.map(e=>[e.id,e])),s=i.components.yAxes[0],a=i.series.map(e=>{const t=(e.yAxisId?o.get(e.yAxisId):void 0)||s;return{...e,type:"bar",coordinateSystem:"cartesian2d",stack:"stacked"===r.mode?"total":void 0,valueUnit:Ho(null==t?void 0:t.unit),style:{...e.style,barWidth:r.barWidth,borderRadius:r.borderRadius}}});return{...i,chartType:"bars",series:a,specific:r}}function Ba(e,t){var i,n,r,o,s,a,l;const c=Sa(e,la,t),d=e&&"object"==typeof e?e:void 0,u=e&&"object"==typeof e&&"number"==typeof e.maxPoints?e.maxPoints:void 0,h=Ho(null==d?void 0:d.valueUnit),p=Array.isArray(null==d?void 0:d.series)?d.series.filter(e=>Boolean(e&&"object"==typeof e)).map(e=>e):[],g=c.series[0]||ka(la).series[0],m=function(e,t){return Number.isFinite(t)?e.slice(0,t):e}(1===c.series.length&&Array.isArray(c.series[0].items)&&c.series[0].items.length>0?c.series[0].items:c.series.map((e,t)=>ba(t,{id:e.id,name:e.name,color:e.color,valueUnit:e.valueUnit,binding:e.binding})),t),v=m.map((e,t)=>{const i=e.binding.dataSource;return fa({...e,valueUnit:h,binding:{...e.binding,dataSource:{...i,mode:(null==i?void 0:i.mode)??"live",statisticType:(null==i?void 0:i.statisticType)||"sum",historyAggregation:(null==i?void 0:i.historyAggregation)||"last"}}},t,la,h,u)}),y=p.find(e=>Array.isArray(e.items)),b=y||p[0],f=function(e,t,i,n){const r=wa(null==e?void 0:e.id);if(r)return r;const o=wa(null==t?void 0:t.id)||i.map(e=>wa(e.id)).find(Boolean)||wa(n.id);return o?`pie-series-${o}`:"pie-series-default"}(y,b,v,g),k={...ya(0,void 0,{id:f,type:"pie",coordinateSystem:"none",valueUnit:h,binding:g.binding,style:{innerRadius:Ks.innerRadius}}),...y,id:f,type:"pie",coordinateSystem:"none",gridId:void 0,xAxisId:void 0,yAxisId:void 0,valueUnit:h,binding:{...g.binding,...(null==b?void 0:b.binding)||{},dataSource:pa({...(null==(i=null==b?void 0:b.binding)?void 0:i.dataSource)||{},mode:(null==(r=null==(n=null==b?void 0:b.binding)?void 0:n.dataSource)?void 0:r.mode)??"live",statisticType:(null==(s=null==(o=null==b?void 0:b.binding)?void 0:o.dataSource)?void 0:s.statisticType)||"sum",historyAggregation:(null==(l=null==(a=null==b?void 0:b.binding)?void 0:a.dataSource)?void 0:l.historyAggregation)||"last"},g.binding.dataSource,la,u)},style:{...g.style,...(null==b?void 0:b.style)||{},innerRadius:Ks.innerRadius},items:v};return{...c,chartType:"pie-donut",valueUnit:h,series:[k],specific:{...Ks,...(null==d?void 0:d.specific)||{}}}}var Ea=Object.getOwnPropertyDescriptor;let Da=class extends rs{static getBlockConfig(){return{sinceVersion:"2.5.0",definition:{label:"Line / Area Chart",icon:'<ha-icon icon="mdi:chart-line"></ha-icon>',category:"charts"},defaults:{props:{chartConfig:_a()}},entityDefaults:{mode:"inherited"}}}getChartEditorTagName(){return"chart-line-area-editor-overlay"}getMaxSeriesCount(){return Da.MAX_SERIES}normalizeChartConfig(e){return $a(e,this.getMaxSeriesCount())}buildChartStyleTargets(e){return{...this.buildTitleStyleTarget(),...this.buildLegendStyleTarget(),...this.buildTooltipStyleTarget(),...this.buildGridStyleTargets(e),...this.buildXAxisStyleTargets(e),...this.buildYAxisStyleTargets(e),...this.buildSeriesStyleTargetsWithOptions(e,t=>this.getLineAreaSeriesStyleTargetOptions(t,"area"===e.specific.mode))}}getLineAreaSeriesStyleTargetOptions(e,t){return{label:e,description:`Style for ${e.toLowerCase()}`,styles:{preset:"echart_line_area_series",properties:t?["echart.areaColor"]:[]}}}buildChartOption(e,t){return zs(e,t)}};function Ra(e,t){const i=e.seriesConfig.xAxisId||t.components.defaultXAxisId;return i?t.components.xAxisIndexById.get(i)??0:0}function Oa(e,t){const i=e.seriesConfig.yAxisId||t.components.defaultYAxisId;return i?t.components.yAxisIndexById.get(i)??0:0}function Na(e,t){const i=e.seriesConfig.style;return{id:e.id,name:e.name,type:"bar",data:e.points.map(e=>[e.timestamp,e.value]),xAxisIndex:Ra(e,t),yAxisIndex:Oa(e,t),stack:e.seriesConfig.stack,barWidth:i.barWidth??18,itemStyle:{color:e.color,borderRadius:i.borderRadius??0}}}function za(e,t){return Ds(e,t)}Da.MAX_SERIES=1,Da=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?Ea(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-chart-line-area")],Da),_r({type:"bar",buildSeriesOptions:function(e,t){return{series:e.map(e=>({option:Na(e,t),sourceSeriesIds:[e.id]}))}},applySeriesStyle:function(e,t){var i,n,r;if(!e||0===Object.keys(t).length)return;const o=Er(t.color),s=Er(t.borderColor),a=Rr(t.borderWidth),l=$r(t.opacity),c=Er(t.echartBarColor)??o,d=$r(t.echartBarBorderRadius);e.itemStyle=zr(e.itemStyle,{color:c??(null==(i=e.itemStyle)?void 0:i.color),borderColor:s??(null==(n=e.itemStyle)?void 0:n.borderColor),borderWidth:a,borderRadius:d??(null==(r=e.itemStyle)?void 0:r.borderRadius),opacity:l}),e.label=zr(e.label,Nr(t))},applySeriesItemStyle:function(e){return e}});var Va=Object.getOwnPropertyDescriptor;let Fa=class extends rs{static getBlockConfig(){return{sinceVersion:"2.5.0",definition:{label:"Bars Chart",icon:'<ha-icon icon="mdi:chart-bar"></ha-icon>',category:"charts"},defaults:{props:{chartConfig:Ta()}},entityDefaults:{mode:"inherited"}}}getChartEditorTagName(){return"chart-bars-editor-overlay"}getMaxSeriesCount(){return Fa.MAX_SERIES}normalizeChartConfig(e){return La(e,this.getMaxSeriesCount())}buildChartStyleTargets(e){return{...this.buildTitleStyleTarget(),...this.buildLegendStyleTarget(),...this.buildTooltipStyleTarget(),...this.buildGridStyleTargets(e),...this.buildXAxisStyleTargets(e),...this.buildYAxisStyleTargets(e),...this.buildSeriesStyleTargetsWithOptions(e,e=>this.getBarSeriesStyleTargetOptions(e))}}getBarSeriesStyleTargetOptions(e){return{label:e,description:`Style for ${e.toLowerCase()}`,styles:{preset:"echart_bar_series"}}}buildChartOption(e,t){return za(e,t)}};Fa.MAX_SERIES=1,Fa=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?Va(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-chart-bars")],Fa);const Wa={mode:"pie",outerRadius:85,innerRadius:55,centerMode:"auto",centerXReference:"center",centerXOffset:0,centerYReference:"middle",centerYOffset:0,titleCenterReference:"pie",showLegendValue:!1,showLabel:!0,showSliceValue:!1};function ja(e){const t=e.points.map(e=>e.value).filter(e=>"number"==typeof e&&Number.isFinite(e));if(0===t.length)return 0;const i=e.itemConfig.binding.dataSource;if("statistics"===i.mode){switch(i.statisticType){case"change":return t.reduce((e,t)=>e+t,0);case"sum":return t[t.length-1]-t[0];case"max":return Math.max(...t);case"min":return Math.min(...t);case"mean":return t.reduce((e,t)=>e+t,0)/t.length;case"state":return t[t.length-1]}return t[t.length-1]}return"history"===i.mode?"max"===i.historyAggregation?Math.max(...t):"delta"===i.historyAggregation?t[t.length-1]-t[0]:t[t.length-1]:t[t.length-1]}function Ga(e){const t=Math.max(10,Math.min(100,Math.round(e.outerRadius)));if("donut"===e.mode){return[`${Math.max(0,Math.min(t-1,Math.round(e.innerRadius)))}%`,`${t}%`]}return`${t}%`}function Ua(e){return Math.max(0,Math.min(100,e))}function Ha(e,t){const i=Number.isFinite(t)?t:0;switch(e){case"left":return`${Ua(i)}%`;case"right":return`${Ua(100-i)}%`;default:return`${Ua(50+i)}%`}}function qa(e,t){const i=Number.isFinite(t)?t:0;switch(e){case"top":return`${Ua(i)}%`;case"bottom":return`${Ua(100-i)}%`;default:return`${Ua(50+i)}%`}}function Xa(e,t){return"manual"===t.centerMode?e.chartSize&&Number.isFinite(e.chartSize.width)&&Number.isFinite(e.chartSize.height)?function(e,t){const i=Math.max(1,t.width),n=Math.max(1,t.height),r=Math.min(i,n)*(Math.max(10,Math.min(100,e.outerRadius))/100)/2,o=i*((Number.isFinite(e.centerXOffset)?e.centerXOffset:0)/100),s=n*((Number.isFinite(e.centerYOffset)?e.centerYOffset:0)/100);let a=i/2+o;"left"===e.centerXReference?a=r+o:"right"===e.centerXReference&&(a=i-r-o);let l=n/2+s;return"top"===e.centerYReference?l=r+s:"bottom"===e.centerYReference&&(l=n-r-s),[`${Ua(a/i*100)}%`,`${Ua(l/n*100)}%`]}(t,e.chartSize):[Ha(t.centerXReference,t.centerXOffset),qa(t.centerYReference,t.centerYOffset)]:e.config.legend.show?"right"===e.config.legend.position?["38%","50%"]:"left"===e.config.legend.position?["62%","50%"]:["50%","50%"]:["50%","50%"]}function Ya(e,t){const i=Ss(e);return i&&"center"===e.title.position&&"block"!==t.titleCenterReference?null:i}function Ka(e,t,i){if(ws(e)&&"center"===e.title.position&&"pie"===t.titleCenterReference)return{elements:[{id:"chart-center-title",type:"group",left:i[0],top:i[1],width:0,height:0,bounding:"raw",silent:!0,z:20,children:[{id:"chart-center-title-text",type:"text",silent:!0,style:{x:0,y:0,text:e.title.text,fill:"#333",fontSize:13,fontWeight:600,align:"center",verticalAlign:"middle"}}]}]}}function Qa(e,t,i,n){const r=Math.max(0,Math.min(6,Math.round(t.config.tooltip.decimals)));return{valueText:Number(e.toFixed(r)).toString(),unitText:n&&i?i:""}}function Za(e){return String(e).replace(/[{}|]/g," ")}function Ja(e,t,i){if(!t.showLegendValue)return;const n=new Map(i.map(t=>[t.name,Qa(t.value,e,t.unit,t.showUnit)]));return{textStyle:{rich:{legendLabel:{},legendValue:{},legendUnit:{}}},formatter:e=>{const t=n.get(e),i=Za(e);if(!t)return`{legendLabel|${i}}`;const r=t.unitText?` {legendUnit|${Za(t.unitText)}}`:"";return`{legendLabel|${i}}  {legendValue|${Za(t.valueText)}}${r}`}}}function el(e,t,i){return Ds(e,t,{chartSize:i})}_r({type:"pie",buildSeriesOptions:function(e,t){const i=function(e){const t=e.specific;return{...Wa,...t||{}}}(t.config),n=Xa(t,i),r=e[0],o=(null==r?void 0:r.items)||[],s=o.map(e=>({id:e.id,name:e.name,value:ja(e),unit:e.unit,showUnit:e.showUnit,itemStyle:{color:e.color}}));return{title:Ya(t.config,i),graphic:Ka(t.config,i,n),legendPatch:Ja(t,i,s),tooltipPatch:{trigger:"item"},series:[{option:{id:null==r?void 0:r.id,type:"pie",radius:Ga(i),center:n,animationDurationUpdate:0,animationEasingUpdate:"linear",stillShowZeroSum:!1,data:s,label:{show:i.showLabel,position:i.showSliceValue?"inside":"outside",formatter:e=>{var n,r;const o=(null==e?void 0:e.name)||"";if(!i.showSliceValue)return o;return function(e,t,i,n){return Xo(e,t.config.tooltip.decimals,i,Boolean(n))}("number"==typeof(null==e?void 0:e.value)?e.value:0,t,null==(n=null==e?void 0:e.data)?void 0:n.unit,null==(r=null==e?void 0:e.data)?void 0:r.showUnit)}},labelLine:{show:i.showLabel&&!i.showSliceValue},emphasis:{scale:!0,scaleSize:4}},sourceSeriesIds:r?[r.id,...o.map(e=>e.id)]:[]}]}},applySeriesStyle:function(e,t){var i,n,r;if(!e||0===Object.keys(t).length)return;const o=Er(t.echartPieSliceColor),s=$r(t.echartPieSliceBorderRadius),a=Er(t.borderColor),l=Rr(t.borderWidth),c=$r(t.opacity);e.itemStyle=zr(e.itemStyle,{color:o??(null==(i=e.itemStyle)?void 0:i.color),borderColor:a??(null==(n=e.itemStyle)?void 0:n.borderColor),borderWidth:l,borderRadius:s??(null==(r=e.itemStyle)?void 0:r.borderRadius),opacity:c}),e.label=zr(e.label,Nr(t))},applySeriesItemStyle:function(e,t){var i,n,r,o;if(!t||0===Object.keys(t).length)return e;const s=Er(t.echartPieSliceColor),a=$r(t.echartPieSliceBorderRadius),l=Dr(t.echartPieLabelShow),c=function(e){if(!e)return;const t=e.trim();return Pr.has(t)?t:void 0}(t.echartPieLabelPosition),d=Dr(t.echartPieLabelLineShow),u=$r(t.echartPieLabelLineLength),h=$r(t.echartPieLabelLineLength2),p=Dr(t.echartPieLabelLineSmooth),g=Er(t.echartPieLabelLineColor),m=$r(t.echartPieLabelLineWidth),v=Er(t.borderColor),y=Rr(t.borderWidth),b=$r(t.opacity);return{...e,itemStyle:zr(e.itemStyle,{color:s??(null==(i=e.itemStyle)?void 0:i.color),borderColor:v??(null==(n=e.itemStyle)?void 0:n.borderColor),borderWidth:y,borderRadius:a??(null==(r=e.itemStyle)?void 0:r.borderRadius),opacity:b}),label:zr(e.label,{...Nr(t),show:l,position:c}),labelLine:zr(e.labelLine,{show:d,length:u,length2:h,smooth:p,lineStyle:zr(null==(o=e.labelLine)?void 0:o.lineStyle,{color:g,width:m})})}}});var tl=Object.getOwnPropertyDescriptor;let il=class extends rs{static getBlockConfig(){return{sinceVersion:"2.5.0",definition:{label:"Pie / Donut Chart",icon:'<ha-icon icon="mdi:chart-donut"></ha-icon>',category:"charts"},defaults:{props:{chartConfig:Aa()}},entityDefaults:{mode:"inherited"}}}getChartType(){return"pie-donut"}getChartEditorTagName(){return"chart-pie-donut-editor-overlay"}getMaxSeriesCount(){return il.MAX_SERIES}normalizeChartConfig(e){return Ba(e,this.getMaxSeriesCount())}buildChartStyleTargets(e){return{...this.buildTitleStyleTarget(),...this.buildLegendStyleTarget(),...e.specific.showLegendValue?this.buildLegendValueStyleTargets():{},...this.buildTooltipStyleTarget(),...this.buildSeriesItemStyleTargetsWithOptions(e,e=>this.getPieDonutSeriesStyleTargetOptions(e))}}getPieDonutSeriesStyleTargetOptions(e){return{label:e,description:`Style for ${e.toLowerCase()}`,styles:{preset:"echart_pie_donut_series"}}}buildChartOption(e,t){var i,n;return el(e,t,{width:(null==(i=this.chartRoot)?void 0:i.clientWidth)||0,height:(null==(n=this.chartRoot)?void 0:n.clientHeight)||0})}};function nl(e){const t=e.slots;if(!t||"object"!=typeof t||Array.isArray(t))return{...e,slots:{entities:{},actions:{}}};if("entities"in t){const i=t,n=i.actions??function(e){const t=Object.entries(e);if(0===t.length)return{};const i={action:"none"};return t.reduce((e,[t,n])=>{const r=n.id||t;return e[r]={id:r,name:n.name,description:n.description,trigger:"tap",action:i},e},{})}(i.targets??{});return{...e,slots:{entities:i.entities??{},actions:n}}}return{...e,slots:{entities:t,actions:{}}}}function rl(e){return("number"==typeof e.version?e.version:1)<3}function ol(e){const t=e.version,i=t<5;let n={...e};return t<2&&(n=function(e){const t=e.blocks;if(!t||"object"!=typeof t)return{...e};let i=!1;const n={...t};for(const[r,o]of Object.entries(t)){if(!o||"object"!=typeof o)continue;const e=o,t="deviceStyles"in e||"stylePresetId"in e||"styleSlots"in e;let s=e,a=e.styles?{...e.styles}:void 0,l=!1;if(e.deviceStyles||e.stylePresetId){const t={...(null==a?void 0:a.block)||{}};let i=!1;void 0===t.stylePresetId&&void 0!==e.stylePresetId&&(t.stylePresetId=e.stylePresetId,i=!0),void 0===t.containers&&void 0!==e.deviceStyles&&(t.containers=e.deviceStyles,i=!0),i&&(a={...a||{},block:t},l=!0)}if(e.styleSlots&&"object"==typeof e.styleSlots)for(const[i,n]of Object.entries(e.styleSlots)){if(!i||!n||"object"!=typeof n)continue;const e={...(null==a?void 0:a[i])||{}};let t=!1;void 0===e.stylePresetId&&void 0!==n.stylePresetId&&(e.stylePresetId=n.stylePresetId,t=!0),void 0===e.containers&&void 0!==n.deviceStyles&&(e.containers=n.deviceStyles,t=!0),t&&(a={...a||{},[i]:e},l=!0)}(l||t)&&(s={...e},l&&(s.styles=a),t&&(delete s.deviceStyles,delete s.stylePresetId,delete s.styleSlots),n[r]=s,i=!0)}return i?{...e,blocks:n}:{...e}}(n)),t<3&&(n=nl(n)),n={...n,version:5},{config:n,fromVersion:t,toVersion:5,migrated:i}}il.MAX_SERIES=3,il.styles=[...rs.styles,l`
            :host {
                height: auto;
                aspect-ratio: 1 / 1;
            }
        `],il=((e,t,i,n)=>{for(var r,o=n>1?void 0:n?tl(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(o)||o);return o})([p("block-chart-pie-donut")],il),[{type:"block-text",blockClass:Ct},{type:"block-icon",blockClass:pt},{type:"block-image",blockClass:At},{type:"block-container",blockClass:on},{type:"block-columns",blockClass:hn},{type:"block-drop-zone",blockClass:ln},{type:"block-grid",blockClass:yn},{type:"block-link",blockClass:Bn},{type:"block-weather-background",blockClass:Yn},{type:"block-hourly-forecast",blockClass:or},{type:"block-entity-field-state",blockClass:qt},{type:"block-entity-field-icon",blockClass:Ft},{type:"block-entity-field-name",blockClass:Ut},{type:"block-entity-field-attribute",blockClass:zt},{type:"block-entity-field-image",blockClass:jt},{type:"block-button-toggle",blockClass:oi},{type:"block-select-menu",blockClass:ci},{type:"block-slider",blockClass:gi},{type:"block-gauge-linear",blockClass:_i},{type:"block-gauge-radial",blockClass:Ii},{type:"block-gauge-tachometer",blockClass:$i},{type:"block-chart-line-area",blockClass:Da},{type:"block-chart-bars",blockClass:Fa},{type:"block-chart-pie-donut",blockClass:il}].forEach(({type:e,blockClass:t})=>{const i=t.getBlockConfig();i?yi.register(e,t,i):console.warn(`[BlockRegistry] Block class "${e}" does not provide getBlockConfig()`)});class sl{constructor(){this._registry=new Map,this._isBooted=!1}define(e,t){this._registry.set(e,t),this._isBooted&&this.registerTag(e,t)}boot(){this._isBooted=!0,this._registry.forEach((e,t)=>{this.registerTag(t,e)})}registerTag(e,t){customElements.get(e)||customElements.define(e,t)}}const al=50,ll=50,cl="top-left",dl="px",ul=e=>"number"==typeof e&&!Number.isNaN(e),hl=(e,t)=>ul(e)?e:t,pl=e=>{var t,i,n,r,o,s,a,l,c,d;const u=(e=>{const t=(null==e?void 0:e.anchor)??cl,i=(null==e?void 0:e.originPoint)??t,n=(null==e?void 0:e.unitSystem)??dl;return{x:ul(null==e?void 0:e.x)?e.x:al,y:ul(null==e?void 0:e.y)?e.y:ll,anchor:t,originPoint:i,unitSystem:n}})(null==(i=null==(t=e._internal)?void 0:t.position_config)?void 0:i.value);return{position:{x:hl(null==(r=null==(n=e.layout)?void 0:n.positionX)?void 0:r.value,u.x),y:hl(null==(s=null==(o=e.layout)?void 0:o.positionY)?void 0:s.value,u.y)},size:{width:hl(null==(l=null==(a=e.size)?void 0:a.width)?void 0:l.value,0),height:hl(null==(d=null==(c=e.size)?void 0:c.height)?void 0:d.value,0)},positionConfig:u}};function gl(e,t){const{width:i,height:n}=t;switch(e){case"top-left":return{x:0,y:0};case"top-center":return{x:i/2,y:0};case"top-right":return{x:i,y:0};case"middle-left":return{x:0,y:n/2};case"middle-center":return{x:i/2,y:n/2};case"middle-right":return{x:i,y:n/2};case"bottom-left":return{x:0,y:n};case"bottom-center":return{x:i/2,y:n};case"bottom-right":return{x:i,y:n}}}class ml{constructor(e){this.config=e}updateConfig(e){this.config={...this.config,...e}}toMoveableSpace(e){const{anchorPoint:t,originPoint:i,unitSystem:n,x:r,y:o}=e;let s=r,a=o;"%"===n&&(s=r/100*this.config.containerSize.width,a=o/100*this.config.containerSize.height),t.includes("right")&&(s=-s),t.includes("bottom")&&(a=-a);const l=gl(t,this.config.containerSize),c=gl(i,this.config.elementSize);return{x:l.x+s-c.x,y:l.y+a-c.y}}fromMoveableSpace(e){const{anchorPoint:t,originPoint:i,unitSystem:n}=this.config,r=gl(t,this.config.containerSize),o=gl(i,this.config.elementSize);let s=e.x-r.x+o.x,a=e.y-r.y+o.y;t.includes("right")&&(s=-s),t.includes("bottom")&&(a=-a);let l=s,c=a;return"%"===n?(l=s/this.config.containerSize.width*100,c=a/this.config.containerSize.height*100,l=Math.round(100*l)/100,c=Math.round(100*c)/100):(l=Math.round(l),c=Math.round(c)),{x:l,y:c,anchorPoint:t,originPoint:i,unitSystem:n}}convertUnits(e,t){if(e.unitSystem===t)return e;const i=this.toMoveableSpace(e),n={...this.config,unitSystem:t};return new ml(n).fromMoveableSpace(i)}convertAnchor(e,t,i){const n=this.toMoveableSpace(e),r={...this.config,anchorPoint:t,originPoint:i||t};return new ml(r).fromMoveableSpace(n)}clampToContainer(e){const t=this.config.containerSize.width-this.config.elementSize.width,i=this.config.containerSize.height-this.config.elementSize.height;return{x:Math.max(0,Math.min(e.x,t)),y:Math.max(0,Math.min(e.y,i))}}getConfig(){return{...this.config}}}class vl{constructor(){this.subscriptions=new Map,this.previousStates=new Map}setHass(e){const t=this.hass;if(this.hass=e,t)for(const i of this.subscriptions.keys()){const t=this.previousStates.get(i),n=e.states[i];t!==n&&(this.previousStates.set(i,n),this.notifySubscribers(i,n,t))}else for(const i of this.subscriptions.keys())this.previousStates.set(i,e.states[i])}getHass(){return this.hass}subscribe(e,t){return this.subscriptions.has(e)||(this.subscriptions.set(e,new Set),this.hass&&this.previousStates.set(e,this.hass.states[e])),this.subscriptions.get(e).add(t),()=>{const i=this.subscriptions.get(e);null==i||i.delete(t),0===(null==i?void 0:i.size)&&(this.subscriptions.delete(e),this.previousStates.delete(e))}}subscribeMultiple(e,t){const i=e.map(e=>this.subscribe(e,t));return()=>{i.forEach(e=>e())}}isSubscribed(e){return this.subscriptions.has(e)}getSubscribedEntities(){return Array.from(this.subscriptions.keys())}getSubscriberCount(e){var t;return(null==(t=this.subscriptions.get(e))?void 0:t.size)??0}getEntityState(e){var t;return null==(t=this.hass)?void 0:t.states[e]}clear(){this.subscriptions.clear(),this.previousStates.clear()}notifySubscribers(e,t,i){const n=this.subscriptions.get(e);if(n)for(const o of n)try{o(e,t,i)}catch(r){console.error(`[EntitySubscriptionManager] Error in callback for ${e}:`,r)}}}var yl=Object.defineProperty,bl=(e,t,i,n)=>{for(var r,o=void 0,s=e.length-1;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&yl(t,i,o),o};function fl(e){return"number"==typeof e&&Number.isFinite(e)&&e>0?e:1}function kl(e,t){const i=e.clientWidth,n=e.clientHeight;if(i>0&&n>0)return{width:i,height:n};const r=e.getBoundingClientRect(),o=fl(t);return{width:r.width/o,height:r.height/o}}function xl(e,t,i,n=1){if(e.parentId===t.rootId)return i;const r=t.getElement(e.parentId)??null;return r?kl(r,n):null}const wl=class extends t{constructor(){super(...arguments),this.rendererManager=this,this.rootBlocks=[],this.overflowShow=!0,this.canvas=null,this.canvasFlowContainer=null,this.entitySubscriptionManager=new vl,this.resizeObserver=null,this.blockEntityUnsubscribers=new Map,this.canvasStyleProperties=["background.boxShadow","border.borderRadius","typography.fontFamily","typography.fontSize","typography.fontWeight","typography.fontStyle","typography.lineHeight","typography.letterSpacing","typography.textAlign","typography.textDecoration","typography.textTransform","typography.textShadow","typography.whiteSpace","typography.color","animations.motion"]}get activeThemeMode(){if("auto"!==this.previewThemeMode)return this.previewThemeMode??Xe(this.hass)}get activeRenderScale(){return fl(this.renderScale)}renderBlock(e){if(!customElements.get(e.type))throw new Error(`Block type "${e.type}" not registered as custom element`);return this.doBlockRender(e,{tag:w(e.type)})}connectedCallback(){var e,t,i;super.connectedCallback(),this.activeContainerId=this.containerManager.getActiveContainerId(),this.overflowShow=(null==(i=null==(t=null==(e=this.documentModel.getBlock(this.documentModel.rootId))?void 0:e.props)?void 0:t.overflow_show)?void 0:i.value)??!0,this.setupResizeObserver(),this.templateUpdateUnsubscribe=this.eventBus.addEventListener("template-updated",()=>{this.requestUpdate()})}disconnectedCallback(){super.disconnectedCallback();for(const e of this.blockEntityUnsubscribers.values())e();this.templateUpdateUnsubscribe&&(this.templateUpdateUnsubscribe(),this.templateUpdateUnsubscribe=void 0),this.resizeObserver&&this.resizeObserver.disconnect(),this.blockEntityUnsubscribers.clear(),this.entitySubscriptionManager.clear(),this.documentModel.registerElement(this.documentModel.rootId,void 0)}shouldUpdate(e){var t,i;if(e.has("hass")&&1===e.size){const i=e.get("hass");if(!i)return!0;if(Xe(i)!==Xe(this.hass))return!0;const n=this.documentModel.getTrackedEntitiesRecursiveFlat(this.documentModel.getBlock(this.documentModel.rootId));if(0===n.length)return!1;for(const e of n){if(i.states[e]!==(null==(t=this.hass)?void 0:t.states[e]))return!0}return!1}return(null==(i=super.shouldUpdate)?void 0:i.call(this,e))??!0}async updated(e){var t;e.has("hass")&&this.hass&&this.entitySubscriptionManager.setHass(this.hass),null==(t=this.canvas)||t.style.setProperty("overflow",this.overflowShow?"visible":"hidden"),super.updated(e)}setupResizeObserver(){this.resizeObserver&&this.resizeObserver.disconnect(),this.resizeObserver=new ResizeObserver(e=>{for(const t of e){const{width:e,height:i}=t.contentRect,n=this.canvasWidth!==e||this.canvasHeight!==i;this.canvasWidth=e,this.canvasHeight=i,n&&(this.eventBus.dispatchEvent("canvas-size-changed",{width:e,height:i}),this.canvasSizeChanged(),this.requestUpdate())}}),this.updateComplete.then(()=>{if(this.canvas){this.resizeObserver.observe(this.canvas);const e=kl(this.canvas,this.activeRenderScale);e.width>0&&e.height>0&&(this.canvasWidth=e.width,this.canvasHeight=e.height,this.eventBus.dispatchEvent("canvas-size-changed",{width:this.canvasWidth,height:this.canvasHeight}))}})}getRenderData(e={}){var t,i,n,r,o,s,a;const l=this.rootBlocks.filter(e=>"absolute"===e.layout),c=this.rootBlocks.filter(e=>"static"===e.layout),d=this.rootBlocks.filter(e=>"flow"===e.layout).sort((e,t)=>e.order-t.order),u=this.documentModel.resolveEntityForBlock(this.documentModel.rootId),h=this.resolveBlockStyles(this.documentModel.getBlock(this.documentModel.rootId),this.activeContainerId,{defaultEntityId:u.entityId}),p=Hi(h,{filter:{only:{properties:this.canvasStyleProperties}},append:e}),g=Hi(h,{filter:{exclude:{properties:this.canvasStyleProperties}}}),m={};((null==(t=h.background)?void 0:t.background)||(null==(i=h.background)?void 0:i.backgroundColor)||(null==(n=h.background)?void 0:n.backgroundImage))&&(m["--ha-card-background"]="transparent",m["--card-background-color"]="transparent"),(null==(r=h.border)?void 0:r.borderStyle)&&"none"!==(null==(o=h.border)?void 0:o.borderStyle.value)&&(m["--ha-card-border-color"]="transparent",m["--ha-card-border-width"]="0"),(null==(s=h.border)?void 0:s.borderRadius)&&(m["--ha-card-border-radius"]=null==(a=h.border)?void 0:a.borderRadius.value);return{absoluteBlocks:l,staticBlocks:c,flowBlocks:d,haCardStyles:Hi(h,{filter:{only:{properties:["border.borderRadius"]}},append:{...m,...e}}),canvasStyles:p,canvasFlowContainerStyles:g}}resolveBlockStyles(e,t=this.activeContainerId,i,n){return this.styleResolver.resolve(e.id,t,i,!0,n,this.activeThemeMode)}resolvedRenderContext(e,t=null,i){const n={defaultEntityId:this.documentModel.resolveEntityForBlock(e.id).entityId};t=t??this.resolveBlockStyles(e,this.activeContainerId,n);const r=pl(t),o=this.blockRegistry.getBlockStyleOutputConfig(e),s=o?Hi(t,{outputMode:o,varPrefix:o.varPrefix??"block"}):Hi(t),a={},l=i?Object.keys(i).filter(e=>"block"!==e):[];if(l.length>0)for(const d of l){const t=this.styleResolver.resolve(e.id,this.activeContainerId,n,!0,d,this.activeThemeMode),i=this.blockRegistry.getBlockStyleOutputConfig(e,d);a[d]=i?Hi(t,{outputMode:i,varPrefix:i.varPrefix??"block"}):Hi(t)}const c={zIndex:String(e.zIndex||"auto")};return Object.assign(c,s),{canvasWidth:this.canvasWidth,canvasHeight:this.canvasHeight,resolved:t,layoutData:r,styles:c,targetStyles:a}}computeAbsoluteBlockSize(e){const t=this.documentModel.getElement(e);if(t)return function(e,t){const i=e.offsetWidth,n=e.offsetHeight;if(i>0&&n>0)return{width:i,height:n};const r=e.getBoundingClientRect(),o=fl(t);return{width:r.width/o,height:r.height/o}}(t,this.activeRenderScale)}getRuntimeBlockSize(e,t){if(t.size.width&&t.size.height)return t.size;return this.computeAbsoluteBlockSize(e.id)??t.size}canvasSizeChanged(){}getCanvasElement(){return this.canvas}getAbsolutePositioningContext(e){return function(e,t,i,n=1){if(!i)return null;const r=fl(n),o=e.parentId===t.rootId,s=o?i:t.getElement(e.parentId)??null;if(!s)return null;const a=xl(e,t,kl(i,r),r);if(!a)return null;const l=s.getBoundingClientRect(),c=i.getBoundingClientRect();return{element:s,width:a.width,height:a.height,offsetX:o?0:(l.left-c.left)/r,offsetY:o?0:(l.top-c.top)/r,isRoot:o}}(e,this.documentModel,this.canvas,this.activeRenderScale)}blockToMoveable(e,t,i,n){if(!i||!n)return{left:e.position.x,top:e.position.y};const r={containerSize:{width:i,height:n},elementSize:{width:t.width,height:t.height},anchorPoint:e.positionConfig.anchor,originPoint:e.positionConfig.originPoint,unitSystem:e.positionConfig.unitSystem},o=new ml(r),s={x:e.positionConfig.x,y:e.positionConfig.y,anchorPoint:e.positionConfig.anchor,originPoint:e.positionConfig.originPoint,unitSystem:e.positionConfig.unitSystem},a=o.toMoveableSpace(s);return{left:a.x,top:a.y}}moveableToBlock(e,t,i,n,r){const o={x:e.left,y:e.top},s={containerSize:{width:n,height:r},elementSize:{width:i.width,height:i.height},anchorPoint:t.anchor,originPoint:t.originPoint,unitSystem:t.unitSystem},a=new ml(s).fromMoveableSpace(o);return{position:{x:Math.round(o.x),y:Math.round(o.y)},positionConfig:{anchor:a.anchorPoint,x:a.x,y:a.y,unitSystem:a.unitSystem,originPoint:a.originPoint??a.anchorPoint}}}moveableResizeToBlock(e,t,i,n,r){const o={x:e.left,y:e.top},s={containerSize:{width:n,height:r},elementSize:{width:t.width,height:t.height},anchorPoint:i.anchor,originPoint:i.originPoint,unitSystem:i.unitSystem},a=new ml(s).fromMoveableSpace(o);return{position:{x:Math.round(o.x),y:Math.round(o.y)},size:t,positionConfig:{anchor:a.anchorPoint,x:a.x,y:a.y,unitSystem:a.unitSystem,originPoint:a.originPoint??a.anchorPoint}}}subscribeBlockEntities(e,t){if(this.unsubscribeBlockEntities(e),0===t.length)return;const i=this.entitySubscriptionManager.subscribeMultiple(t,e=>this.handleBlockEntityChange(e));this.blockEntityUnsubscribers.set(e,i)}unsubscribeBlockEntities(e){const t=this.blockEntityUnsubscribers.get(e);t&&(t(),this.blockEntityUnsubscribers.delete(e))}handleBlockEntityChange(e){this.requestUpdate()}};wl.styles=[l`
            .canvas {
                min-height: 1px;
                position: relative;
                background: var(--ha-card-background, var(--card-background-color, var(--bg-primary)));
                border-radius: var(--ha-card-border-radius, var(--ha-border-radius-lg));
                box-sizing: border-box;
                overflow: hidden;
                z-index: 0;
            }

            .canvas-flow-container {
                border-radius: inherit;
                box-sizing: border-box;
                inset: 0;
                display: flex;
                flex-direction: column;
                padding: 20px;
            }
        `];let Sl=wl;bl([n({context:me})],Sl.prototype,"documentModel"),bl([n({context:Bi})],Sl.prototype,"blockRegistry"),bl([n({context:xe})],Sl.prototype,"containerManager"),bl([n({context:en})],Sl.prototype,"styleResolver"),bl([n({context:q})],Sl.prototype,"eventBus"),bl([S({context:Y})],Sl.prototype,"rendererManager"),bl([n({context:st,subscribe:!0}),i({attribute:!1})],Sl.prototype,"hass"),bl([n({context:Ye,subscribe:!0}),c()],Sl.prototype,"previewThemeMode"),bl([n({context:qe,subscribe:!0}),c()],Sl.prototype,"renderScale"),bl([c()],Sl.prototype,"rootBlocks"),bl([c()],Sl.prototype,"activeContainerId"),bl([c()],Sl.prototype,"canvasWidth"),bl([c()],Sl.prototype,"canvasHeight"),bl([c()],Sl.prototype,"overflowShow");const _l="card-builder-frontend-version-recheck";function Tl(e){return"string"==typeof e?e.trim():""}function Al(e){return e.panels["card-builder"].config}function Il(e){delete e.isFrontendVersionValid,delete e.cachedJsVersion,delete e.cachedRuntimeVersion}function Cl(){window.setTimeout(()=>{window.dispatchEvent(new CustomEvent(_l))},0)}function Pl(e){var t;const i=(window.cardbuilder=window.cardbuilder||{},window.cardbuilder);if(i.observedConnection!==e.connection){null==(t=i.removeConnectionListeners)||t.call(i);const n=e.connection,r=()=>{i.backendWasDisconnected=!0},o=()=>{i.backendWasDisconnected&&(i.backendWasDisconnected=!1,Il(i),Cl())};n.addEventListener("disconnected",r),n.addEventListener("ready",o),i.observedConnection=n,i.removeConnectionListeners=()=>{n.removeEventListener("disconnected",r),n.removeEventListener("ready",o)}}return e.connected?i.backendWasDisconnected&&(i.backendWasDisconnected=!1,Il(i),Cl()):i.backendWasDisconnected=!0,i}function Ml(e){const t=Al(e);return{baseDomain:t.base_domain,baseSchema:t.base_schema,integrationVersion:t.integration_version}}function $l(e){const t=Tl(Al(e).integration_version),i=Tl(H);return function(e){const t=Pl(e),i=Tl(Al(e).integration_version),n=Tl(H);if("boolean"==typeof t.isFrontendVersionValid&&t.cachedRuntimeVersion===i&&t.cachedJsVersion===n)return t.isFrontendVersionValid;const r=i===n;return t.isFrontendVersionValid=r,t.cachedRuntimeVersion=i,t.cachedJsVersion=n,r}(e)?{ok:!0,jsVersion:i,runtimeVersion:t}:{ok:!1,reason:"mismatch",jsVersion:i,runtimeVersion:t}}function Ll(e){return e&&e.trim()?e:"unknown"}function Bl(e){return{title:"Card Builder cache refresh required",message:"Home Assistant is running a different Card Builder version than the JavaScript cached on this device. Clear the browser or app cache, then reload Home Assistant.",jsVersion:Ll(e.jsVersion),runtimeVersion:Ll(e.runtimeVersion)}}const El=new sl;var Dl=Object.defineProperty,Rl=Object.getOwnPropertyDescriptor,Ol=(e,t,i,n)=>{for(var r,o=n>1?void 0:n?Rl(t,i):t,s=e.length-1;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Dl(t,i,o),o};const Nl={isBuilder:!1,blocksOutlineEnabled:!1,actionsEnabled:!0},zl=class extends t{constructor(){super(...arguments),this.environment=Nl,this.blockRegistry=yi,this.containerManager=new fe,this.eventBus=new X,this.hassProvider=new _(this,{context:st}),this.documentModel=new ge,this._loading=!1,this._handleFrontendVersionRecheck=()=>{this._hass&&this._ensureFrontendVersionValid()}}set hass(e){this._hass=e,this._ensureFrontendVersionValid()&&(this.styleResolver&&this.styleResolver.setBindingEvaluator(this._createBindingEvaluator()),this.hassProvider.setValue(e))}static async getConfigElement(){return document.createElement("card-builder-renderer-card-editor")}static getStubConfig(){return{type:"custom:card-builder-renderer-card"}}async connectedCallback(){window.addEventListener(_l,this._handleFrontendVersionRecheck),!this._hass||this._ensureFrontendVersionValid()?(await this._initializeStyleResolver(),this._hass&&(await this._loadCards(),await this._subscribeToCardsUpdates()),super.connectedCallback()):super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(_l,this._handleFrontendVersionRecheck),this.unsubscribe&&this.unsubscribe()}setConfig(e){var t;if(!e)throw new Error("Invalid configuration");const i=null==(t=this._config)?void 0:t.card_id;this._config=e,this._ensureFrontendVersionValid()&&(e.card_id&&e.card_id!==i?this._loadCardData(e.card_id):(this._applySlotEntitiesFromConfig(),this._applySlotActionsFromConfig()))}getCardSize(){return 3}async updated(e){var t;super.updated(e),this._ensureFrontendVersionValid()&&(e.has("hass")&&this._hass&&!this._cardsService&&(await this._loadCards(),await this._subscribeToCardsUpdates()),e.has("cards")&&(null==(t=this._config)?void 0:t.card_id)&&!this._cardData&&!this._loading&&await this._loadCardData(this._config.card_id))}render(){if(this._versionCheck&&!this._versionCheck.ok)return this._renderVersionBlocked(this._versionCheck);if(!this._config||!this._hass)return h``;if(!this._config.card_id)return h`
                <ha-card>
                    <div class="card-content placeholder">
                        <p>No card selected. Configure this card to select a Card Builder card.</p>
                    </div>
                </ha-card>
            `;if(this._loading)return h`
                <ha-card>
                    <div class="card-content loading">
                        <ha-circular-progress indeterminate></ha-circular-progress>
                    </div>
                </ha-card>
            `;if(this._error)return h`
                <ha-card>
                    <div class="card-content error">${this._error}</div>
                </ha-card>
            `;const e=this.documentModel.blocks,t=Object.keys(e).length>1;return this._cardData&&t?h`
            <card-builder-renderer-card-canvas 
                .hass=${this._hass}
            >
            </card-builder-renderer-card-canvas>
        `:h`
                <ha-card>
                    <div class="card-content placeholder">No card data available</div>
                </ha-card>
            `}async _initializeStyleResolver(){if(this._ensureFrontendVersionValid())try{const e=await Fo(this._hass);this.styleResolver=new Ei(this.documentModel,this.containerManager,e,this.blockRegistry),this._hass&&this.styleResolver.setBindingEvaluator(this._createBindingEvaluator())}catch(e){console.error("[CardBuilderRendererCard] Failed to initialize StyleResolver:",e)}}async _loadCards(){if(this._hass&&this._ensureFrontendVersionValid()){this._cardsService=zo(this._hass),this._loading=!0,this._error=void 0;try{this.cards=await this._cardsService.listCards()}catch(e){console.error("Failed to load cards:",e),this._error=`Failed to load cards: ${e}`}finally{this._loading=!1}}}async _loadCardData(e){var t;if(this._hass&&void 0!==this.cards&&this._ensureFrontendVersionValid()){this._loading=!0,this._error=void 0;try{const i=null==(t=this.cards)?void 0:t.find(t=>t.id===e);if(i){this._cardData=i;const{config:e}=ol(i.config);this.documentModel.loadFromConfig(e),this._applySlotEntitiesFromConfig(),this._applySlotActionsFromConfig()}else this._cardData=void 0,this._error=`Card not found: ${e}`}catch(i){console.error("Failed to load card:",i),this._cardData=void 0,this._error=`Failed to load card: ${i}`}finally{this._loading=!1}}}async _subscribeToCardsUpdates(){if(this._cardsService&&this._ensureFrontendVersionValid())try{this.unsubscribe=await this._cardsService.subscribeToUpdates(()=>{this._loadCards()})}catch(e){console.error("Failed to subscribe to cards updates:",e)}}_createBindingEvaluator(){return new ne(this._hass,{resolveSlotEntity:e=>this.documentModel.resolveSlotEntity(e),onTemplateResult:()=>{this.eventBus.dispatchEvent("template-updated")}})}_applySlotEntitiesFromConfig(){var e;const t=null==(e=this._config)?void 0:e.slot_entities;if(t)for(const i of this.documentModel.getSlotEntities()){if(!(i.id in t))continue;const e=t[i.id].trim()||void 0;this.documentModel.updateSlotEntity(i.id,{entityId:e})}}_applySlotActionsFromConfig(){var e;const t=null==(e=this._config)?void 0:e.slot_actions;if(t)for(const i of this.documentModel.getSlotActions()){if(!(i.id in t))continue;const e=t[i.id];e&&"none"!==e.action&&this.documentModel.updateSlotAction(i.id,{action:e})}}_ensureFrontendVersionValid(){if(!this._hass)return!0;const e=$l(this._hass);return this._isSameVersionCheck(e)||(this._versionCheck=e),e.ok}_isSameVersionCheck(e){const t=this._versionCheck;return Boolean(t&&t.ok===e.ok&&t.jsVersion===e.jsVersion&&t.runtimeVersion===e.runtimeVersion)}_renderVersionBlocked(e){const t=Bl(e);return h`
            <ha-card>
                <div class="card-content error">
                    <h2 class="version-title">${t.title}</h2>
                    <p class="version-message">${t.message}</p>
                    <div class="version-grid">
                        <span class="version-label">Cached JS</span>
                        <span class="version-value">${t.jsVersion}</span>
                        <span class="version-label">Runtime</span>
                        <span class="version-value">${t.runtimeVersion}</span>
                    </div>
                </div>
            </ha-card>
        `}};zl.styles=l`
        .card-content {
            padding: 16px;
        }

        .card-content.loading {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100px;
        }

        .card-content.error {
            color: var(--error-color);
        }

        .card-content.placeholder {
            color: var(--secondary-text-color);
            text-align: center;
        }

        .version-title {
            margin: 0 0 8px;
            font-size: 16px;
            line-height: 1.35;
            font-weight: 600;
            color: var(--primary-text-color);
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
            color: var(--primary-text-color);
        }

        .version-label {
            color: var(--secondary-text-color);
        }

        .version-value {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            overflow-wrap: anywhere;
        }
    `;let Vl=zl;Ol([S({context:He})],Vl.prototype,"environment",2),Ol([S({context:Bi})],Vl.prototype,"blockRegistry",2),Ol([S({context:xe})],Vl.prototype,"containerManager",2),Ol([S({context:en})],Vl.prototype,"styleResolver",2),Ol([S({context:q})],Vl.prototype,"eventBus",2),Ol([i({attribute:!1})],Vl.prototype,"hass",1),Ol([S({context:me})],Vl.prototype,"documentModel",2),Ol([c()],Vl.prototype,"cards",2),Ol([c()],Vl.prototype,"_cardData",2),Ol([c()],Vl.prototype,"_config",2),Ol([c()],Vl.prototype,"_loading",2),Ol([c()],Vl.prototype,"_error",2),Ol([c()],Vl.prototype,"_versionCheck",2);window.customCards=window.customCards||[],window.customCards.push({type:"card-builder-renderer-card",name:"Card Builder Card",description:"Render a card created with Card Builder"}),El.define("card-builder-renderer-card",Vl),El.define("card-builder-renderer-card-canvas",class extends Sl{connectedCallback(){super.connectedCallback(),this.rootBlocks=Object.values(this.documentModel.blocks).filter(e=>e.parentId===this.documentModel.rootId)}render(){const{absoluteBlocks:e,staticBlocks:t,flowBlocks:i,haCardStyles:n,canvasStyles:r,canvasFlowContainerStyles:o}=this.getRenderData();return h`
            <ha-card style="${u(n)}">
                <div
                    class="canvas"
                    style="${u(r)}"
                    ${f(e=>this.canvas=e)}
                >
                    ${y(e,e=>e.id,e=>this.renderBlock(e))}
                    ${y(t,e=>e.id,e=>this.renderBlock(e))}
                    <div 
                        class="canvas-flow-container"
                        style="${u(o)}"
                        ${f(e=>this.canvasFlowContainer=e)}
                    >
                        ${y(i,e=>e.id,e=>this.renderBlock(e))}
                    </div>
                </div>
            </ha-card>
        `}doBlockRender(e,t){return T`
          <${t.tag}
            block-id="${e.id}"
            .block=${e}
            .renderer="${this}"
            .activeContainerId=${this.containerManager.getActiveContainer().id}
            ${f(t=>this.documentModel.registerElement(e.id,t))}
          ></${t.tag}>
      `}});export{Fo as $,$a as A,Ca as B,qs as C,vn as D,zs as E,Ta as F,La as G,Pa as H,za as I,Aa as J,Ba as K,Ma as L,el as M,ba as N,sl as O,ne as P,Xi as Q,wt as R,ee as S,te as T,Go as U,Z as V,An as W,nt as X,Je as Y,et as Z,ot as _,Xe as a,xl as a0,pl as a1,ml as a2,Ze as a3,yt as a4,Gi as a5,Ui as a6,xe as a7,en as a8,Ye as a9,ke as aA,Wo as aB,pe as aC,no as aD,io as aE,so as aF,H as aG,X as aH,_l as aI,Ml as aJ,Kr as aK,co as aL,eo as aM,Vo as aN,Jr as aO,$l as aP,Bl as aQ,El as aR,Sl as aa,gt as ab,kt as ac,St as ad,_t as ae,st as af,ge as ag,yi as ah,fe as ai,wn as aj,Tn as ak,Ue as al,ol as am,Ei as an,Sn as ao,He as ap,Qr as aq,vi as ar,No as as,zo as at,Zr as au,po as av,to as aw,uo as ax,rl as ay,qe as az,Bi as b,me as c,_e as d,Mt as e,q as f,xt as g,kn as h,vt as i,bi as j,va as k,_n as l,ya as m,fi as n,jo as o,js as p,Gs as q,Us as r,mr as s,Fs as t,Ws as u,Hs as v,wr as w,es as x,qr as y,_a as z};