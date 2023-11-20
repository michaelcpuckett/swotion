!// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
function(e,t,n,r,o){/* eslint-disable no-undef */var l="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},s="function"==typeof l[r]&&l[r],i=s.cache||{},a="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function d(t,n){if(!i[t]){if(!e[t]){// if we cannot find the module within our internal map or
// cache jump to the current global require ie. the last bundle
// that was added to the page.
var o="function"==typeof l[r]&&l[r];if(!n&&o)return o(t,!0);// If there are other bundles on this page the require from the
// previous one is saved to 'previousRequire'. Repeat this as
// many times as there are bundles until the module is found or
// we exhaust the require chain.
if(s)return s(t,!0);// Try the node require function if it exists.
if(a&&"string"==typeof t)return a(t);var u=Error("Cannot find module '"+t+"'");throw u.code="MODULE_NOT_FOUND",u}m.resolve=function(n){var r=e[t][1][n];return null!=r?r:n},m.cache={};var c=i[t]=new d.Module(t);e[t][0].call(c.exports,m,c,c.exports,this)}return i[t].exports;function m(e){var t=m.resolve(e);return!1===t?{}:d(t)}}d.isParcelRequire=!0,d.Module=function(e){this.id=e,this.bundle=d,this.exports={}},d.modules=e,d.cache=i,d.parent=s,d.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(d,"root",{get:function(){return l[r]}}),l[r]=d;for(var u=0;u<t.length;u++)d(t[u]);if(n){// Expose entry point to Node, AMD or browser globals
// Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
var c=d(n);// CommonJS
"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):o&&(this[o]=c)}}({gUvsp:[function(e,t,n){e("elements/AutoSaveTextElement"),e("elements/AutoSaveCheckboxElement"),e("elements/AutoSaveSearchElement"),e("elements/ClearSearchElement"),e("elements/UnloadHandlerElement"),e("elements/PostFormElement"),e("elements/SelectAllCheckboxElement"),e("elements/GridKeyboardNavigationElement"),e("elements/ModalDialogElement"),e("elements/FlyoutMenuElement")},{"elements/AutoSaveTextElement":"jpb0K","elements/AutoSaveCheckboxElement":"3MJok","elements/AutoSaveSearchElement":"8q7LM","elements/ClearSearchElement":"foex1","elements/UnloadHandlerElement":"bGTnF","elements/PostFormElement":"cKAw4","elements/SelectAllCheckboxElement":"enxk1","elements/GridKeyboardNavigationElement":"a0B3I","elements/ModalDialogElement":"4HvQn","elements/FlyoutMenuElement":"41FSx"}],jpb0K:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"AutoSaveTextElement",()=>l);var o=e("elements/BaseAutoSaveElement");class l extends o.BaseAutoSaveElement{connectedCallback(){this.inputElement.addEventListener("pointerdown",this.boundClickHandler),this.inputElement.addEventListener("change",this.boundChangeHandler),this.inputElement.addEventListener("keydown",this.boundKeydownHandler),this.inputElement.addEventListener("blur",this.boundBlurHandler)}disconnectedCallback(){this.inputElement.removeEventListener("pointerdown",this.boundClickHandler),this.inputElement.removeEventListener("change",this.boundChangeHandler),this.inputElement.removeEventListener("keydown",this.boundKeydownHandler),this.inputElement.removeEventListener("blur",this.boundBlurHandler)}handleClick(){this.inputElement.readOnly&&this.toggleEditMode()}handleBlur(){this.inputElement.readOnly||this.toggleEditMode()}handleKeydown(e){if(e instanceof KeyboardEvent){if("Escape"===e.key&&!this.inputElement.readOnly){let e=this.inputElement.value,t=this.inputElement.getAttribute("value")||"";e===t?this.toggleEditMode():this.inputElement.value=this.inputElement.getAttribute("value")||""}"Enter"===e.key&&(this.toggleEditMode(),e.preventDefault(),this.inputElement.readOnly?this.dispatchEvent(new CustomEvent("auto-save-text:toggle-edit-mode",{composed:!0,bubbles:!0})):this.inputElement.selectionStart=this.inputElement.selectionEnd=this.inputElement.value.length),1===e.key.length&&/[a-zA-Z0-9-_ ]/.test(e.key)&&this.inputElement.readOnly&&(this.toggleEditMode(),this.inputElement.value="",this.inputElement.selectionStart=this.inputElement.selectionEnd=this.inputElement.value.length)}}toggleEditMode(){this.inputElement.readOnly=!this.inputElement.readOnly}handleChange(){let e=this.inputElement.value,t=this.inputElement.form;if(!t){this.markDirty();return}let n=t.getAttribute("action");if(!n)return;let r=new FormData(t).get("_method")?.toString()||"";["PUT","PATCH"].includes(r)?this.patch(n,e).then(()=>{this.inputElement.setAttribute("value",e)}).catch(()=>{this.markDirty()}):this.markDirty()}constructor(...e){super(...e),this.boundKeydownHandler=this.handleKeydown.bind(this),this.boundClickHandler=this.handleClick.bind(this),this.boundBlurHandler=this.handleBlur.bind(this)}}window.customElements.define("auto-save-text",l)},{"elements/BaseAutoSaveElement":"gOsXZ","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],gOsXZ:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"BaseAutoSaveElement",()=>s);var o=e("shared/getUniqueId"),l=e("elements/UnloadHandlerElement");class s extends HTMLElement{constructor(){if(super(),!this.shadowRoot)throw Error("Declarative shadow root not supported");let e=this.shadowRoot.querySelector("slot");if(!(e instanceof HTMLSlotElement))throw Error("No slot element provided");let t=e.assignedNodes();if(!t||!t.length)throw Error("No content provided");let n=t.find(function(e){return e instanceof HTMLInputElement});if(!n)throw Error("No input element provided");let r=window.document.querySelector("unload-handler");if(!(r instanceof HTMLElement))throw Error("No unload handler element found");this.inputElement=n,this.inputId=n.id||(0,o.getUniqueId)(),this.unloadHandlerElement=r,this.boundChangeHandler=this.handleChange.bind(this),this.boundInputHandler=this.handleInput.bind(this)}handleChange(){}handleInput(){}markDirty(){let e=this.unloadHandlerElement.getAttribute(l.DIRTY_ELEMENTS_KEY)||"",t=e?e.split(","):[];t.push(this.inputId);let n=Array.from(new Set(t)),r=n.join(",");this.unloadHandlerElement.setAttribute(l.DIRTY_ELEMENTS_KEY,r),this.inputElement.setAttribute("data-dirty","")}markClean(){let e=this.unloadHandlerElement.getAttribute(l.DIRTY_ELEMENTS_KEY)||"",t=e?e.split(","):[],n=t.filter(e=>e!==this.inputId).join(",");this.unloadHandlerElement.setAttribute(l.DIRTY_ELEMENTS_KEY,n),this.inputElement.removeAttribute("data-dirty")}async patch(e,t){let n=new FormData;return n.append("_method","PATCH"),n.append(this.inputElement.name,t),window.fetch(e,{method:"POST",body:n}).then(e=>{if(404===e.status)throw Error("Not found");return e})}}},{"shared/getUniqueId":"eClT9","elements/UnloadHandlerElement":"bGTnF","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],eClT9:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"getUniqueId",()=>l);var o=e("uuid");function l(){return`${Date.now()}-${(0,o.v4)()}`}},{uuid:"klst7","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],klst7:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"v1",()=>l.default),r.export(n,"v3",()=>i.default),r.export(n,"v4",()=>d.default),r.export(n,"v5",()=>c.default),r.export(n,"NIL",()=>h.default),r.export(n,"version",()=>p.default),r.export(n,"validate",()=>b.default),r.export(n,"stringify",()=>g.default),r.export(n,"parse",()=>w.default);var o=e("./v1.js"),l=r.interopDefault(o),s=e("./v3.js"),i=r.interopDefault(s),a=e("./v4.js"),d=r.interopDefault(a),u=e("./v5.js"),c=r.interopDefault(u),m=e("./nil.js"),h=r.interopDefault(m),f=e("./version.js"),p=r.interopDefault(f),E=e("./validate.js"),b=r.interopDefault(E),v=e("./stringify.js"),g=r.interopDefault(v),y=e("./parse.js"),w=r.interopDefault(y)},{"./v1.js":!1,"./v3.js":!1,"./v4.js":"fpA4M","./v5.js":!1,"./nil.js":!1,"./version.js":!1,"./validate.js":!1,"./stringify.js":!1,"./parse.js":!1,"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],fpA4M:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n);var o=e("./native.js"),l=r.interopDefault(o),s=e("./rng.js"),i=r.interopDefault(s),a=e("./stringify.js");n.default=function(e,t,n){if(l.default.randomUUID&&!t&&!e)return(0,l.default).randomUUID();e=e||{};let r=e.random||(e.rng||(0,i.default))();// Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,t){n=n||0;for(let e=0;e<16;++e)t[n+e]=r[e];return t}return(0,a.unsafeStringify)(r)}},{"./native.js":"2mj2P","./rng.js":"lpvWd","./stringify.js":"fHrI1","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"2mj2P":[function(e,t,n){e("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(n);let r="undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto);n.default={randomUUID:r}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],k3151:[function(e,t,n){n.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},n.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.exportAll=function(e,t){return Object.keys(e).forEach(function(n){"default"===n||"__esModule"===n||t.hasOwnProperty(n)||Object.defineProperty(t,n,{enumerable:!0,get:function(){return e[n]}})}),t},n.export=function(e,t,n){Object.defineProperty(e,t,{enumerable:!0,get:n})}},{}],lpvWd:[function(e,t,n){let r;// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(n),o.export(n,"default",()=>s);let l=new Uint8Array(16);function s(){// lazy load so that environments that need to polyfill have a chance to do so
if(!r&&!// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
(r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return r(l)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],fHrI1:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"unsafeStringify",()=>i);var o=e("./validate.js"),l=r.interopDefault(o);/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */let s=[];for(let e=0;e<256;++e)s.push((e+256).toString(16).slice(1));function i(e,t=0){// Note: Be careful editing this code!  It's been tuned for performance
// and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
return s[e[t+0]]+s[e[t+1]]+s[e[t+2]]+s[e[t+3]]+"-"+s[e[t+4]]+s[e[t+5]]+"-"+s[e[t+6]]+s[e[t+7]]+"-"+s[e[t+8]]+s[e[t+9]]+"-"+s[e[t+10]]+s[e[t+11]]+s[e[t+12]]+s[e[t+13]]+s[e[t+14]]+s[e[t+15]]}n.default=function(e,t=0){let n=i(e,t);// Consistency check for valid UUID.  If this throws, it's likely due to one
// of the following:
// - One or more input array values don't map to a hex octet (leading to
// "undefined" in the uuid)
// - Invalid input values for the RFC `version` or `variant` fields
if(!(0,l.default)(n))throw TypeError("Stringified UUID is invalid");return n}},{"./validate.js":"d35r5","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],d35r5:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n);var o=e("./regex.js"),l=r.interopDefault(o);n.default=function(e){return"string"==typeof e&&(0,l.default).test(e)}},{"./regex.js":"agidw","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],agidw:[function(e,t,n){e("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(n),n.default=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],bGTnF:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"DIRTY_ELEMENTS_KEY",()=>o),r.export(n,"UnloadHandlerElement",()=>l);let o="dirty-elements";class l extends HTMLElement{constructor(){super(),this.boundBeforeUnloadHandler=this.handleBeforeUnload.bind(this)}static get observedAttributes(){return["dirty-elements"]}attributeChangedCallback(e,t,n){"dirty-elements"===e&&(n?this.triggerBeforeUnload():this.removeBeforeUnload())}triggerBeforeUnload(){window.onbeforeunload||(window.onbeforeunload=this.boundBeforeUnloadHandler)}removeBeforeUnload(){window.onbeforeunload&&(window.onbeforeunload=null)}handleBeforeUnload(e){console.log(e),console.log(e.composedPath()),e.preventDefault(),e.returnValue=""}}window.customElements.define("unload-handler",l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"3MJok":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"AutoSaveCheckboxElement",()=>l);var o=e("elements/BaseAutoSaveElement");class l extends o.BaseAutoSaveElement{constructor(){super(),this.boundMarkClean=this.markClean.bind(this);let e=this.inputElement.form;if(!e)return;this.formElement=e}connectedCallback(){this.inputElement.addEventListener("input",this.boundInputHandler),this.formElement&&this.formElement.addEventListener("submit",this.boundMarkClean)}disconnectedCallback(){this.inputElement.removeEventListener("input",this.boundInputHandler),this.formElement&&this.formElement.removeEventListener("submit",this.boundMarkClean)}handleInput(){let e=this.inputElement.checked,t=e?this.inputElement.value:"",n=this.inputElement.form;if(!n){this.markDirty();return}let r=n.getAttribute("action");if(!r)return;let o=new FormData(n).get("_method")?.toString()||"";["PUT","PATCH"].includes(o)?this.patch(r,t).then(()=>{window.location.reload()}).catch(()=>{this.markDirty()}):this.inputElement.checked!==this.inputElement.defaultChecked?this.markDirty():this.markClean()}}window.customElements.define("auto-save-checkbox",l)},{"elements/BaseAutoSaveElement":"gOsXZ","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"8q7LM":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"AutoSaveSearchElement",()=>i);var o=e("debounce"),l=r.interopDefault(o),s=e("elements/BaseAutoSaveElement");class i extends s.BaseAutoSaveElement{connectedCallback(){this.inputElement.addEventListener("input",this.debouncedInputHandler)}disconnectedCallback(){this.inputElement.removeEventListener("input",this.debouncedInputHandler)}handleInput(){let e=this.inputElement.form;e&&e.submit()}constructor(...e){super(...e),this.debouncedInputHandler=(0,l.default)(this.boundInputHandler,350)}}window.customElements.define("auto-save-search",i)},{debounce:"7Bek2","elements/BaseAutoSaveElement":"gOsXZ","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"7Bek2":[function(e,t,n){/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */function r(e,t,n){function r(){var d=Date.now()-i;d<t&&d>=0?o=setTimeout(r,t-d):(o=null,n||(a=e.apply(s,l),s=l=null))}null==t&&(t=100);var o,l,s,i,a,d=function(){s=this,l=arguments,i=Date.now();var d=n&&!o;return o||(o=setTimeout(r,t)),d&&(a=e.apply(s,l),s=l=null),a};return d.clear=function(){o&&(clearTimeout(o),o=null)},d.flush=function(){o&&(a=e.apply(s,l),s=l=null,clearTimeout(o),o=null)},d}// Adds compatibility for ES modules
r.debounce=r,t.exports=r},{}],foex1:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"ClearSearchElement",()=>o);class o extends HTMLElement{connectedCallback(){let e=this.querySelector("button");if(!(e instanceof HTMLButtonElement))throw Error("No button element provided");let t=e.form;if(!(t instanceof HTMLFormElement))throw Error("No form element provided");let n=Array.from(t.elements).find(function(e){return e instanceof HTMLInputElement&&"search"===e.type});if(!n)throw Error("No search input element provided");this.buttonElement=e,this.formElement=t,this.searchInputElement=n,this.buttonElement.addEventListener("click",this.boundClickHandler)}disconnectedCallback(){this.buttonElement&&this.buttonElement.removeEventListener("click",this.boundClickHandler)}handleClick(){if(!this.searchInputElement)throw Error("No search input element provided");if(!this.formElement)throw Error("No form element provided");this.searchInputElement.removeAttribute("name"),this.formElement.submit()}constructor(...e){super(...e),this.boundClickHandler=this.handleClick.bind(this)}}window.customElements.define("clear-search",o)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],cKAw4:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"PostFormElement",()=>l);var o=e("elements/UnloadHandlerElement");class l extends HTMLElement{connectedCallback(){let e=this.querySelector("form");if(!(e instanceof HTMLFormElement))throw Error("PostFormElement must contain a form element");this.formElement=e,this.formElement.addEventListener("submit",this.boundSubmitHandler)}disconnectedCallback(){this.formElement&&this.formElement.removeEventListener("submit",this.boundSubmitHandler)}handleFormSubmit(e){if(e.preventDefault(),!this.formElement)return;let t=window.document.querySelector("unload-handler");if(!t)return;let n=t.getAttribute(o.DIRTY_ELEMENTS_KEY)||"",r=n?n.split(","):[],l=Array.from(this.formElement.elements),s=r.filter(e=>{let t=window.document.getElementById(e);return t&&!l.includes(t)}).join(",");t.setAttribute(o.DIRTY_ELEMENTS_KEY,s),this.formElement.submit()}constructor(...e){super(...e),this.boundSubmitHandler=this.handleFormSubmit.bind(this)}}window.customElements.define("post-form",l)},{"elements/UnloadHandlerElement":"bGTnF","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],enxk1:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"SelectAllCheckboxElement",()=>o);class o extends HTMLElement{constructor(){if(super(),this.boundChangeHandler=this.handleChange.bind(this),this.boundControllableCheckboxChangeHandler=this.handleControllableCheckboxChange.bind(this),!this.shadowRoot)throw Error("Declarative shadow root not supported");let e=this.querySelector("input");if(!(e instanceof HTMLInputElement))throw Error("No input element provided");let t=e.form;if(!t)throw Error("No form element provided");let n=e.getAttribute("name");e.removeAttribute("name"),this.checkboxElements=Array.from(t.elements).filter(function(e){return e instanceof HTMLInputElement&&"checkbox"===e.type&&e.name===n}),this.inputElement=e,this.formElement=t}connectedCallback(){for(let e of(this.inputElement.addEventListener("change",this.boundChangeHandler),this.checkboxElements))e.addEventListener("change",this.boundControllableCheckboxChangeHandler)}disconnectedCallback(){for(let e of(this.inputElement.removeEventListener("change",this.boundChangeHandler),this.checkboxElements))e.removeEventListener("change",this.boundControllableCheckboxChangeHandler)}handleChange(){let e=this.inputElement.checked;for(let t of this.checkboxElements)t.checked=e}handleControllableCheckboxChange(){let e=this.checkboxElements.every(e=>e.checked);this.inputElement.checked=e}}window.customElements.define("select-all-checkbox",o)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],a0B3I:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"GridKeyboardNavigationElement",()=>s);let o='input:not([type="hidden"]):not([hidden]), button:not([hidden]), a:not([hidden]), textarea:not([hidden]), select:not([hidden]), [tabindex]:not([hidden])',l='[role="gridcell"], [role="columnheader"], [role="rowheader"]';class s extends HTMLElement{constructor(){super(),this.boundKeydownHandler=this.handleKeydown.bind(this),this.boundFocusinHandler=this.handleFocusin.bind(this),this.boundFocusoutHandler=this.handleFocusout.bind(this),this.setInitialTabIndices(),this.addEventListener("auto-save-text:toggle-edit-mode",e=>{if(!(e instanceof CustomEvent))return;let t=e.target;if(!(t instanceof HTMLElement))return;let n=t.closest(l);if(!(n instanceof HTMLElement))return;let r=n.closest('[role="row"]');if(!(r instanceof HTMLElement))return;let o=Array.from(r.children).indexOf(n),s=r.nextElementSibling;if(!(s instanceof HTMLElement))return;let i=s.children[o];i instanceof HTMLElement&&i.focus()})}setInitialTabIndices(){let e=Array.from(this.querySelectorAll(o));for(let t of e)t instanceof HTMLElement&&(t.dataset.originalTabindex=t.tabIndex.toString()),t.setAttribute("tabindex","-1");let t=sessionStorage.getItem("focus-element-id")||"",n=t?this.querySelector(`#${t}`):null,r=n||this.querySelector(o);if(!(r instanceof HTMLElement))return;let s=r.closest(l);if(!(s instanceof HTMLElement))return;let i=Array.from(s.querySelectorAll(o)).filter(function(e){return e instanceof HTMLElement});for(let e of i)e.setAttribute("tabindex",e.dataset.originalTabindex||"0")}connectedCallback(){this.addEventListener("keydown",this.boundKeydownHandler),this.addEventListener("focusin",this.boundFocusinHandler),this.addEventListener("focusout",this.boundFocusoutHandler)}disconnected(){this.removeEventListener("keydown",this.boundKeydownHandler),this.removeEventListener("focusin",this.boundFocusinHandler),this.removeEventListener("focusout",this.boundFocusoutHandler)}handleFocusin(e){if(!(e instanceof FocusEvent))return;let t=e.composedPath().find(e=>e instanceof HTMLElement&&e.matches(l));if(!(t instanceof HTMLElement))return;let n=Array.from(t.querySelectorAll(o));for(let e of n)e instanceof HTMLElement&&e.setAttribute("tabindex",e.dataset.originalTabindex||"0")}handleFocusout(e){if(!(e instanceof FocusEvent))return;let t=e.composedPath().find(e=>e instanceof HTMLElement&&e.matches(l));if(!(t instanceof HTMLElement))return;let n=e.relatedTarget;if(!(n instanceof HTMLElement)||!this.contains(n))return;let r=Array.from(t.querySelectorAll(o));for(let e of r)e instanceof HTMLElement&&e.setAttribute("tabindex","-1")}handleKeydown(e){if(!(e instanceof KeyboardEvent))return;let t=e.composedPath().find(e=>e instanceof HTMLElement&&e.matches(l));if(!(t instanceof HTMLElement))return;let n=t.closest(l);if(!(n instanceof HTMLElement))return;let r=e.composedPath().find(e=>e instanceof HTMLInputElement&&e.closest("auto-save-text")&&!e.readOnly);r||("ArrowUp"===e.key?(e.preventDefault(),this.handleArrowUp(n)):"ArrowDown"===e.key?(e.preventDefault(),this.handleArrowDown(n)):"ArrowLeft"===e.key?(e.preventDefault(),this.handleArrowLeft(n)):"ArrowRight"===e.key&&(e.preventDefault(),this.handleArrowRight(n)))}handleArrowUp(e){let t=e.closest('[role="row"]');if(!t)return;let n=Array.from(t.children).indexOf(e),r=t.closest('[role="grid"]');if(!(r instanceof HTMLElement))return;let o=Array.from(r.querySelectorAll('[role="row"]')),l=o.indexOf(t),s=o[l-1];if(!(s instanceof HTMLElement))return;let i=Array.from(s.children),a=i[Math.min(i.length-1,n)];a instanceof HTMLElement&&this.focusElement(a)}handleArrowDown(e){let t=e.closest('[role="row"]');if(!t)return;let n=Array.from(t.children).indexOf(e),r=t.closest('[role="grid"]');if(!(r instanceof HTMLElement))return;let o=Array.from(r.querySelectorAll('[role="row"]')),l=o.indexOf(t),s=o[l+1];if(!(s instanceof HTMLElement))return;let i=Array.from(s.children),a=i[Math.min(i.length-1,n)];a instanceof HTMLElement&&this.focusElement(a)}handleArrowLeft(e){let t=e.previousElementSibling;t instanceof HTMLElement&&this.focusElement(t)}handleArrowRight(e){let t=e.nextElementSibling;t instanceof HTMLElement&&this.focusElement(t)}focusElement(e){e.focus()}}window.customElements.define("grid-keyboard-navigation",s)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"4HvQn":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"ModalDialogElement",()=>o);class o extends HTMLElement{constructor(){super(),this.boundKeydownHandler=this.handleKeydown.bind(this);let e=this.querySelector("dialog");if(!(e instanceof HTMLDialogElement))throw Error("Could not find dialog element");this.dialogElement=e}connectedCallback(){this.addEventListener("keydown",this.boundKeydownHandler)}disconnectedCallback(){this.removeEventListener("keydown",this.boundKeydownHandler)}handleKeydown(e){if(e instanceof KeyboardEvent&&"Escape"===e.key){let e=this.dialogElement.querySelector("form");e instanceof HTMLFormElement&&e.submit()}}}window.customElements.define("modal-dialog",o)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"41FSx":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"FlyoutMenuElement",()=>o);class o extends HTMLElement{constructor(){super(),this.boundKeydownHandler=this.handleKeydown.bind(this),this.boundToggleHandler=this.handleToggle.bind(this);let e=this.querySelector("details");if(!(e instanceof HTMLDetailsElement))throw Error("Could not find details element");this.detailsElement=e}connectedCallback(){this.addEventListener("keydown",this.boundKeydownHandler),this.detailsElement.addEventListener("toggle",this.boundToggleHandler)}disconnectedCallback(){this.removeEventListener("keydown",this.boundKeydownHandler)}handleKeydown(e){e instanceof KeyboardEvent&&"Escape"===e.key&&(this.detailsElement.open=!1)}handleToggle(){if(this.detailsElement.open){let e=this.querySelector('[role="menuitem"]');e instanceof HTMLElement&&e.focus()}}}window.customElements.define("flyout-menu",o)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}]},["gUvsp"],"gUvsp","parcelRequireb585")//# sourceMappingURL=client.js.map
;
//# sourceMappingURL=client.js.map
