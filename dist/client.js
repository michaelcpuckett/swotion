!// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
function(e,t,n,r,l){/* eslint-disable no-undef */var o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},i="function"==typeof o[r]&&o[r],s=i.cache||{},a="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function d(t,n){if(!s[t]){if(!e[t]){// if we cannot find the module within our internal map or
// cache jump to the current global require ie. the last bundle
// that was added to the page.
var l="function"==typeof o[r]&&o[r];if(!n&&l)return l(t,!0);// If there are other bundles on this page the require from the
// previous one is saved to 'previousRequire'. Repeat this as
// many times as there are bundles until the module is found or
// we exhaust the require chain.
if(i)return i(t,!0);// Try the node require function if it exists.
if(a&&"string"==typeof t)return a(t);var u=Error("Cannot find module '"+t+"'");throw u.code="MODULE_NOT_FOUND",u}h.resolve=function(n){var r=e[t][1][n];return null!=r?r:n},h.cache={};var m=s[t]=new d.Module(t);e[t][0].call(m.exports,h,m,m.exports,this)}return s[t].exports;function h(e){var t=h.resolve(e);return!1===t?{}:d(t)}}d.isParcelRequire=!0,d.Module=function(e){this.id=e,this.bundle=d,this.exports={}},d.modules=e,d.cache=s,d.parent=i,d.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(d,"root",{get:function(){return o[r]}}),o[r]=d;for(var u=0;u<t.length;u++)d(t[u]);if(n){// Expose entry point to Node, AMD or browser globals
// Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
var m=d(n);// CommonJS
"object"==typeof exports&&"undefined"!=typeof module?module.exports=m:"function"==typeof define&&define.amd?define(function(){return m}):l&&(this[l]=m)}}({gUvsp:[function(e,t,n){e("elements/AutoSaveTextElement"),e("elements/AutoSaveCheckboxElement"),e("elements/AutoSaveSearchElement"),e("elements/ClearSearchElement"),e("elements/UnloadHandlerElement"),e("elements/PostFormElement"),e("elements/SelectAllCheckboxElement"),e("elements/ModalDialogElement"),e("elements/GridKeyboardNavigationElement"),e("elements/FlyoutMenuElement"),e("elements/ViewContainerElement"),function e(t){if(!(t instanceof Element)&&!(t instanceof DocumentFragment)&&!(t instanceof Document)||HTMLTemplateElement.prototype.hasOwnProperty("shadowRootDelegatesFocus"))return;let n=Array.from(t.querySelectorAll("template[shadowrootmode]"));for(let t of n){if(!(t instanceof HTMLTemplateElement))continue;let n=t.getAttribute("shadowrootmode");if(!["open","closed"].includes(n))continue;let r=t.hasAttribute("shadowrootdelegatesfocus"),l=t.parentNode;if(!(l instanceof Element))continue;let o=l.attachShadow({mode:n,delegatesFocus:r});o.appendChild(t.content),t.remove(),e(o)}}(document)},{"elements/AutoSaveTextElement":"jpb0K","elements/AutoSaveCheckboxElement":"3MJok","elements/AutoSaveSearchElement":"8q7LM","elements/ClearSearchElement":"foex1","elements/UnloadHandlerElement":"bGTnF","elements/PostFormElement":"cKAw4","elements/SelectAllCheckboxElement":"enxk1","elements/GridKeyboardNavigationElement":"a0B3I","elements/ModalDialogElement":"4HvQn","elements/FlyoutMenuElement":"41FSx","elements/ViewContainerElement":"1qbGb"}],jpb0K:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"AutoSaveTextElement",()=>o);var l=e("elements/BaseAutoSaveElement");class o extends l.BaseAutoSaveElement{connectedCallback(){this.inputElement.addEventListener("change",this.boundChangeHandler),this.inputElement.addEventListener("keydown",this.boundKeydownHandler),this.inputElement.addEventListener("blur",this.boundBlurHandler),this.inputElement.addEventListener("click",this.boundClickHandler)}disconnectedCallback(){this.inputElement.removeEventListener("change",this.boundChangeHandler),this.inputElement.removeEventListener("keydown",this.boundKeydownHandler),this.inputElement.removeEventListener("blur",this.boundBlurHandler),this.inputElement.removeEventListener("click",this.boundClickHandler)}enterEditMode(){this.inputElement.removeAttribute("data-read-only")}exitEditMode(){this.inputElement.setAttribute("data-read-only",""),this.submitData().then(()=>{this.markClean()})}toggleEditMode(){""===this.inputElement.dataset.readOnly?this.enterEditMode():this.exitEditMode()}handleClick(){this.enterEditMode()}handleBlur(){this.exitEditMode()}handleKeydown(e){if(e instanceof KeyboardEvent){if("Escape"===e.key&&""!==this.inputElement.dataset.readOnly){let e=this.inputElement.value,t=this.inputElement.getAttribute("value")||"";e===t?this.toggleEditMode():this.inputElement.value=this.inputElement.getAttribute("value")||""}"Enter"===e.key&&(e.preventDefault(),this.toggleEditMode(),""===this.inputElement.dataset.readOnly?(this.dispatchEvent(new CustomEvent("auto-save-text:toggle-edit-mode",{composed:!0,bubbles:!0})),this.submitData().then(()=>{this.dispatchEvent(new CustomEvent("auto-save-text:save",{composed:!0,bubbles:!0}))})):this.inputElement.selectionStart=this.inputElement.selectionEnd=this.inputElement.value.length),1===e.key.length&&/[a-zA-Z0-9-_ ]/.test(e.key)&&""===this.inputElement.dataset.readOnly&&(this.toggleEditMode(),this.inputElement.value="",this.inputElement.selectionStart=this.inputElement.selectionEnd=this.inputElement.value.length)}}async submitData(){let e=this.inputElement.value,t=this.inputElement.form;if(!t){this.markDirty();return}let n=t.getAttribute("action");if(!n)return;let r=new FormData(t).get("_method")?.toString()||"";if(["PUT","PATCH"].includes(r))return this.patch(n,e).then(()=>{this.inputElement.setAttribute("value",e),this.markClean()}).catch(()=>{this.markDirty()});this.markDirty()}constructor(...e){super(...e),this.boundKeydownHandler=this.handleKeydown.bind(this),this.boundClickHandler=this.handleClick.bind(this),this.boundBlurHandler=this.handleBlur.bind(this)}}window.customElements.define("auto-save-text",o)},{"elements/BaseAutoSaveElement":"gOsXZ","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],gOsXZ:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"BaseAutoSaveElement",()=>i);var l=e("shared/getUniqueId"),o=e("elements/UnloadHandlerElement");class i extends HTMLElement{constructor(){if(super(),!this.shadowRoot)throw Error("Declarative shadow root not supported");let e=this.shadowRoot.querySelector("slot");if(!(e instanceof HTMLSlotElement))throw Error("No slot element provided");let t=e.assignedNodes();if(!t||!t.length)throw Error("No content provided");let n=t.find(function(e){return e instanceof HTMLInputElement});if(!n)throw Error("No input element provided");let r=window.document.querySelector("unload-handler");if(!(r instanceof HTMLElement))throw Error("No unload handler element found");this.inputElement=n,this.inputId=n.id||(0,l.getUniqueId)(),this.unloadHandlerElement=r,this.boundChangeHandler=this.handleChange.bind(this),this.boundInputHandler=this.handleInput.bind(this)}handleChange(){}handleInput(){}markDirty(){let e=this.unloadHandlerElement.getAttribute(o.DIRTY_ELEMENTS_KEY)||"",t=e?e.split(","):[];t.push(this.inputId);let n=Array.from(new Set(t)),r=n.join(",");this.unloadHandlerElement.setAttribute(o.DIRTY_ELEMENTS_KEY,r),this.inputElement.setAttribute("data-dirty","")}markClean(){let e=this.unloadHandlerElement.getAttribute(o.DIRTY_ELEMENTS_KEY)||"",t=e?e.split(","):[],n=t.filter(e=>e!==this.inputId).join(",");this.unloadHandlerElement.setAttribute(o.DIRTY_ELEMENTS_KEY,n),this.inputElement.removeAttribute("data-dirty")}async patch(e,t){let n=new FormData;return n.append("_method","PATCH"),n.append(this.inputElement.name,t),window.fetch(e,{method:"POST",body:n}).then(e=>{if(404===e.status)throw Error("Not found");return e})}}},{"shared/getUniqueId":"eClT9","elements/UnloadHandlerElement":"bGTnF","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],eClT9:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"getUniqueId",()=>o);var l=e("uuid");function o(){return`${Date.now()}-${(0,l.v4)()}`}},{uuid:"klst7","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],klst7:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"v1",()=>o.default),r.export(n,"v3",()=>s.default),r.export(n,"v4",()=>d.default),r.export(n,"v5",()=>m.default),r.export(n,"NIL",()=>c.default),r.export(n,"version",()=>p.default),r.export(n,"validate",()=>g.default),r.export(n,"stringify",()=>b.default),r.export(n,"parse",()=>w.default);var l=e("./v1.js"),o=r.interopDefault(l),i=e("./v3.js"),s=r.interopDefault(i),a=e("./v4.js"),d=r.interopDefault(a),u=e("./v5.js"),m=r.interopDefault(u),h=e("./nil.js"),c=r.interopDefault(h),f=e("./version.js"),p=r.interopDefault(f),E=e("./validate.js"),g=r.interopDefault(E),v=e("./stringify.js"),b=r.interopDefault(v),y=e("./parse.js"),w=r.interopDefault(y)},{"./v1.js":!1,"./v3.js":!1,"./v4.js":"fpA4M","./v5.js":!1,"./nil.js":!1,"./version.js":!1,"./validate.js":!1,"./stringify.js":!1,"./parse.js":!1,"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],fpA4M:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n);var l=e("./native.js"),o=r.interopDefault(l),i=e("./rng.js"),s=r.interopDefault(i),a=e("./stringify.js");n.default=function(e,t,n){if(o.default.randomUUID&&!t&&!e)return(0,o.default).randomUUID();e=e||{};let r=e.random||(e.rng||(0,s.default))();// Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,t){n=n||0;for(let e=0;e<16;++e)t[n+e]=r[e];return t}return(0,a.unsafeStringify)(r)}},{"./native.js":"2mj2P","./rng.js":"lpvWd","./stringify.js":"fHrI1","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"2mj2P":[function(e,t,n){e("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(n);let r="undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto);n.default={randomUUID:r}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],k3151:[function(e,t,n){n.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},n.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.exportAll=function(e,t){return Object.keys(e).forEach(function(n){"default"===n||"__esModule"===n||t.hasOwnProperty(n)||Object.defineProperty(t,n,{enumerable:!0,get:function(){return e[n]}})}),t},n.export=function(e,t,n){Object.defineProperty(e,t,{enumerable:!0,get:n})}},{}],lpvWd:[function(e,t,n){let r;// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var l=e("@parcel/transformer-js/src/esmodule-helpers.js");l.defineInteropFlag(n),l.export(n,"default",()=>i);let o=new Uint8Array(16);function i(){// lazy load so that environments that need to polyfill have a chance to do so
if(!r&&!// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
(r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return r(o)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],fHrI1:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"unsafeStringify",()=>s);var l=e("./validate.js"),o=r.interopDefault(l);/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */let i=[];for(let e=0;e<256;++e)i.push((e+256).toString(16).slice(1));function s(e,t=0){// Note: Be careful editing this code!  It's been tuned for performance
// and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
return i[e[t+0]]+i[e[t+1]]+i[e[t+2]]+i[e[t+3]]+"-"+i[e[t+4]]+i[e[t+5]]+"-"+i[e[t+6]]+i[e[t+7]]+"-"+i[e[t+8]]+i[e[t+9]]+"-"+i[e[t+10]]+i[e[t+11]]+i[e[t+12]]+i[e[t+13]]+i[e[t+14]]+i[e[t+15]]}n.default=function(e,t=0){let n=s(e,t);// Consistency check for valid UUID.  If this throws, it's likely due to one
// of the following:
// - One or more input array values don't map to a hex octet (leading to
// "undefined" in the uuid)
// - Invalid input values for the RFC `version` or `variant` fields
if(!(0,o.default)(n))throw TypeError("Stringified UUID is invalid");return n}},{"./validate.js":"d35r5","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],d35r5:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n);var l=e("./regex.js"),o=r.interopDefault(l);n.default=function(e){return"string"==typeof e&&(0,o.default).test(e)}},{"./regex.js":"agidw","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],agidw:[function(e,t,n){e("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(n),n.default=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],bGTnF:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"DIRTY_ELEMENTS_KEY",()=>l),r.export(n,"UnloadHandlerElement",()=>o);let l="dirty-elements";class o extends HTMLElement{constructor(){super(),this.boundBeforeUnloadHandler=this.handleBeforeUnload.bind(this)}static get observedAttributes(){return["dirty-elements"]}attributeChangedCallback(e,t,n){"dirty-elements"===e&&(n?this.triggerBeforeUnload():this.removeBeforeUnload())}triggerBeforeUnload(){window.onbeforeunload||(window.onbeforeunload=this.boundBeforeUnloadHandler)}removeBeforeUnload(){window.onbeforeunload&&(window.onbeforeunload=null)}handleBeforeUnload(e){e.preventDefault(),e.returnValue=""}}window.customElements.define("unload-handler",o)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"3MJok":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"AutoSaveCheckboxElement",()=>o);var l=e("elements/BaseAutoSaveElement");class o extends l.BaseAutoSaveElement{constructor(){super(),this.boundMarkClean=this.markClean.bind(this);let e=this.inputElement.form;if(!e)return;this.formElement=e}connectedCallback(){this.inputElement.addEventListener("input",this.boundInputHandler),this.formElement&&this.formElement.addEventListener("submit",this.boundMarkClean)}disconnectedCallback(){this.inputElement.removeEventListener("input",this.boundInputHandler),this.formElement&&this.formElement.removeEventListener("submit",this.boundMarkClean)}handleInput(){let e=this.inputElement.checked,t=e?this.inputElement.value:"",n=this.inputElement.form;if(!n){this.markDirty();return}let r=n.getAttribute("action");if(!r)return;let l=new FormData(n).get("_method")?.toString()||"";["PUT","PATCH"].includes(l)?this.patch(r,t).then(()=>{window.location.reload()}).catch(()=>{this.markDirty()}):this.inputElement.checked!==this.inputElement.defaultChecked?this.markDirty():this.markClean()}}window.customElements.define("auto-save-checkbox",o)},{"elements/BaseAutoSaveElement":"gOsXZ","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"8q7LM":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"AutoSaveSearchElement",()=>s);var l=e("debounce"),o=r.interopDefault(l),i=e("elements/BaseAutoSaveElement");class s extends i.BaseAutoSaveElement{connectedCallback(){this.inputElement.addEventListener("input",this.debouncedInputHandler)}disconnectedCallback(){this.inputElement.removeEventListener("input",this.debouncedInputHandler)}handleInput(){let e=this.inputElement.form;e&&e.submit()}constructor(...e){super(...e),this.debouncedInputHandler=(0,o.default)(this.boundInputHandler,350)}}window.customElements.define("auto-save-search",s)},{debounce:"7Bek2","elements/BaseAutoSaveElement":"gOsXZ","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"7Bek2":[function(e,t,n){/**
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
 */function r(e,t,n){function r(){var d=Date.now()-s;d<t&&d>=0?l=setTimeout(r,t-d):(l=null,n||(a=e.apply(i,o),i=o=null))}null==t&&(t=100);var l,o,i,s,a,d=function(){i=this,o=arguments,s=Date.now();var d=n&&!l;return l||(l=setTimeout(r,t)),d&&(a=e.apply(i,o),i=o=null),a};return d.clear=function(){l&&(clearTimeout(l),l=null)},d.flush=function(){l&&(a=e.apply(i,o),i=o=null,clearTimeout(l),l=null)},d}// Adds compatibility for ES modules
r.debounce=r,t.exports=r},{}],foex1:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"ClearSearchElement",()=>l);class l extends HTMLElement{connectedCallback(){let e=this.querySelector("button");if(!(e instanceof HTMLButtonElement))throw Error("No button element provided");let t=e.form;if(!(t instanceof HTMLFormElement))throw Error("No form element provided");let n=Array.from(t.elements).find(function(e){return e instanceof HTMLInputElement&&"search"===e.type});if(!n)throw Error("No search input element provided");this.buttonElement=e,this.formElement=t,this.searchInputElement=n,this.buttonElement.addEventListener("click",this.boundClickHandler)}disconnectedCallback(){this.buttonElement&&this.buttonElement.removeEventListener("click",this.boundClickHandler)}handleClick(){if(!this.searchInputElement)throw Error("No search input element provided");if(!this.formElement)throw Error("No form element provided");this.searchInputElement.removeAttribute("name"),this.formElement.submit()}constructor(...e){super(...e),this.boundClickHandler=this.handleClick.bind(this)}}window.customElements.define("clear-search",l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],cKAw4:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"PostFormElement",()=>o);var l=e("elements/UnloadHandlerElement");class o extends HTMLElement{connectedCallback(){let e=this.querySelector("form");if(!(e instanceof HTMLFormElement))throw Error("PostFormElement must contain a form element");this.formElement=e,this.formElement.addEventListener("submit",this.boundSubmitHandler)}disconnectedCallback(){this.formElement&&this.formElement.removeEventListener("submit",this.boundSubmitHandler)}handleFormSubmit(e){if(e.preventDefault(),!this.formElement)return;let t=window.document.querySelector("unload-handler");if(!t)return;let n=t.getAttribute(l.DIRTY_ELEMENTS_KEY)||"",r=n?n.split(","):[],o=Array.from(this.formElement.elements),i=r.filter(e=>{let t=window.document.getElementById(e);return t&&!o.includes(t)}).join(",");t.setAttribute(l.DIRTY_ELEMENTS_KEY,i),this.formElement.submit()}constructor(...e){super(...e),this.boundSubmitHandler=this.handleFormSubmit.bind(this)}}window.customElements.define("post-form",o)},{"elements/UnloadHandlerElement":"bGTnF","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],enxk1:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"SelectAllCheckboxElement",()=>l);class l extends HTMLElement{constructor(){if(super(),this.boundChangeHandler=this.handleChange.bind(this),this.boundControllableCheckboxChangeHandler=this.handleControllableCheckboxChange.bind(this),!this.shadowRoot)throw Error("Declarative shadow root not supported");let e=this.querySelector("input");if(!(e instanceof HTMLInputElement))throw Error("No input element provided");let t=e.form;if(!t)throw Error("No form element provided");let n=e.getAttribute("name");e.removeAttribute("name"),this.checkboxElements=Array.from(t.elements).filter(function(e){return e instanceof HTMLInputElement&&"checkbox"===e.type&&e.name===n}),this.inputElement=e,this.formElement=t}connectedCallback(){for(let e of(this.inputElement.addEventListener("change",this.boundChangeHandler),this.checkboxElements))e.addEventListener("change",this.boundControllableCheckboxChangeHandler)}disconnectedCallback(){for(let e of(this.inputElement.removeEventListener("change",this.boundChangeHandler),this.checkboxElements))e.removeEventListener("change",this.boundControllableCheckboxChangeHandler)}handleChange(){let e=this.inputElement.checked;for(let t of this.checkboxElements)t.checked=e}handleControllableCheckboxChange(){let e=this.checkboxElements.every(e=>e.checked);this.inputElement.checked=e}}window.customElements.define("select-all-checkbox",l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],a0B3I:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"GridKeyboardNavigationElement",()=>i);let l='[role="gridcell"], [role="columnheader"], [role="rowheader"]';function o(e){if(!(e instanceof Element))return!1;let t=e.closest('flyout-menu [role="menu"]');return t instanceof HTMLElement}class i extends HTMLElement{constructor(){super(),this.boundKeydownHandler=this.handleKeydown.bind(this),this.addEventListener("auto-save-text:toggle-edit-mode",e=>{if(!(e instanceof CustomEvent)||!(e.target instanceof HTMLElement))return;let t=e.target.closest(l);if(!(t instanceof HTMLElement))return;let n=t.closest('[role="row"]');if(!(n instanceof HTMLElement))return;let r=Array.from(n.children).indexOf(t),o=n.nextElementSibling;if(!(o instanceof HTMLElement))return;let i=o.children[r];i instanceof HTMLElement&&i.focus()})}connectedCallback(){this.addEventListener("keydown",this.boundKeydownHandler)}disconnected(){this.removeEventListener("keydown",this.boundKeydownHandler)}handleKeydown(e){if(!(e instanceof KeyboardEvent))return;let t=e.composedPath().find(e=>e instanceof HTMLElement&&e.matches(l));if(!(t instanceof HTMLElement))return;let n=t.querySelector('auto-save-text input[type="text"]:not([data-read-only])');if(n)return;let r=e.composedPath().find(o);if(!r)switch(e.key){case"ArrowUp":e.preventDefault(),this.handleArrowUp(t);break;case"ArrowDown":e.preventDefault(),this.handleArrowDown(t);break;case"ArrowLeft":e.preventDefault(),this.handleArrowLeft(t);break;case"ArrowRight":e.preventDefault(),this.handleArrowRight(t);break;case"Home":e.preventDefault(),this.handleHome(t);break;case"End":e.preventDefault(),this.handleEnd(t)}}handleHome(e){let t=e.closest('[role="grid"]');if(!(t instanceof HTMLElement))return;let n=Array.from(t.querySelectorAll('[role="row"]')),r=n[0];if(!(r instanceof HTMLElement))return;let l=Array.from(r.children),o=l[0];o instanceof HTMLElement&&this.focusElement(o)}handleEnd(e){let t=e.closest('[role="grid"]');if(!(t instanceof HTMLElement))return;let n=Array.from(t.querySelectorAll('[role="row"]')),r=n[n.length-1];if(!(r instanceof HTMLElement))return;let l=Array.from(r.children),o=l[l.length-1];o instanceof HTMLElement&&this.focusElement(o)}handleArrowUp(e){let t=e.closest('[role="row"]');if(!t)return;let n=Array.from(t.children).indexOf(e),r=t.closest('[role="grid"]');if(!(r instanceof HTMLElement))return;let l=Array.from(r.querySelectorAll('[role="row"]')),o=l.indexOf(t),i=l[o-1];if(!(i instanceof HTMLElement))return;let s=Array.from(i.children),a=s[Math.min(s.length-1,n)];a instanceof HTMLElement&&this.focusElement(a)}handleArrowDown(e){let t=e.closest('[role="row"]');if(!t)return;let n=Array.from(t.children).indexOf(e),r=t.closest('[role="grid"]');if(!(r instanceof HTMLElement))return;let l=Array.from(r.querySelectorAll('[role="row"]')),o=l.indexOf(t),i=l[o+1];if(!(i instanceof HTMLElement))return;let s=Array.from(i.children),a=s[Math.min(s.length-1,n)];a instanceof HTMLElement&&this.focusElement(a)}handleArrowLeft(e){let t=e.previousElementSibling;t instanceof HTMLElement&&this.focusElement(t)}handleArrowRight(e){let t=e.nextElementSibling;t instanceof HTMLElement&&this.focusElement(t)}focusElement(e){e.focus()}}window.customElements.define("grid-keyboard-navigation",i)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"4HvQn":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"ModalDialogElement",()=>l);class l extends HTMLElement{constructor(){super(),this.boundKeydownHandler=this.handleKeydown.bind(this);let e=this.querySelector("dialog");if(!(e instanceof HTMLDialogElement))throw Error("Could not find dialog element");this.dialogElement=e}connectedCallback(){this.addEventListener("keydown",this.boundKeydownHandler)}disconnectedCallback(){this.removeEventListener("keydown",this.boundKeydownHandler)}handleKeydown(e){if(e instanceof KeyboardEvent&&"Escape"===e.key){let e=this.dialogElement.querySelector("form");e instanceof HTMLFormElement&&e.submit()}}}window.customElements.define("modal-dialog",l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"41FSx":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"FlyoutMenuElement",()=>l);class l extends HTMLElement{constructor(){super(),this.boundKeydownHandler=this.handleKeydown.bind(this),this.boundToggleHandler=this.handleToggle.bind(this),this.boundClickHandler=this.handleClick.bind(this);let e=this.querySelector("details");if(!(e instanceof HTMLDetailsElement))throw Error("Could not find details element");this.detailsElement=e;let t=this.querySelector("summary");if(!(t instanceof HTMLElement))throw Error("Could not find summary element");this.summaryElement=t;let n=this.querySelector('[role="menu"]');if(!(n instanceof HTMLElement))throw Error("Could not find menu element");let r=Array.from(n.querySelectorAll('[role="menuitem"]')).filter(function(e){return e instanceof HTMLElement});this.menuItemElements=r}connectedCallback(){this.addEventListener("keydown",this.boundKeydownHandler),this.summaryElement.addEventListener("click",this.boundClickHandler),this.detailsElement.addEventListener("toggle",this.boundToggleHandler)}disconnectedCallback(){this.removeEventListener("keydown",this.boundKeydownHandler),this.summaryElement.removeEventListener("click",this.boundClickHandler),this.detailsElement.removeEventListener("toggle",this.boundToggleHandler)}positionPopover(){let{left:e,top:t,height:n,width:r}=this.summaryElement.getBoundingClientRect(),l=e>window.innerWidth/2?`calc(-100% - ${r}px)`:"0px",o=t>window.innerHeight/2?`calc(-100% + ${n}px)`:"0px",i=`translateX(${l}) translateY(${o})`;this.style.setProperty("--popover-transform",i),this.style.setProperty("--popover-left",`${e+r}px`),this.style.setProperty("--popover-top",`${t}px`)}handleClick(){this.positionPopover()}handleKeydown(e){if(!(e instanceof KeyboardEvent))return;if(!this.detailsElement.open){[" ","Enter"].includes(e.key)&&this.positionPopover();return}"Escape"===e.key&&(this.summaryElement.focus(),this.detailsElement.open=!1);let t=e.composedPath().find(e=>e instanceof HTMLElement&&e.matches('[role="menuitem"]'));if(!(t instanceof HTMLElement))return;let n=e.composedPath().find(e=>e instanceof HTMLElement&&e.closest("summary"));n||("ArrowUp"===e.key?(e.preventDefault(),this.handleArrowUp(t)):"ArrowDown"===e.key&&(e.preventDefault(),this.handleArrowDown(t)))}handleArrowUp(e){let t=this.menuItemElements.indexOf(e);if(-1===t)return;let n=this.menuItemElements[t-1]||this.menuItemElements[this.menuItemElements.length-1];n instanceof HTMLElement&&n.focus()}handleArrowDown(e){let t=this.menuItemElements.indexOf(e),n=this.menuItemElements[t+1]||this.menuItemElements[0];n instanceof HTMLElement&&n.focus()}handleToggle(){if(this.detailsElement.open){let[e]=this.menuItemElements;e instanceof HTMLElement&&e.focus()}}}window.customElements.define("flyout-menu",l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"1qbGb":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"ViewContainerElement",()=>o);let l='[role="gridcell"], [role="columnheader"], [role="rowheader"]';class o extends HTMLElement{constructor(){super(),this.draggedCellElement=null,this.highlightElement=null,this.boundDragstartHandler=this.handleDragstart.bind(this),this.boundDragendHandler=this.handleDragend.bind(this),this.boundDragoverHandler=this.handleDragover.bind(this),this.boundPointerdownHandler=this.handlePointerdown.bind(this),this.boundDropHandler=this.handleDrop.bind(this),this.boundHandleAutoSaveTextSave=this.handleAutoSaveTextSave.bind(this);let e=this.querySelector('[role="grid"]');if(!(e instanceof HTMLElement))throw Error("Could not find grid element");this.gridElement=e}connectedCallback(){// this.addEventListener('dragstart', this.boundDragstartHandler);
this.addEventListener("pointerdown",this.boundDragstartHandler),// this.addEventListener('dragover', this.boundDragoverHandler);
this.addEventListener("pointerover",this.boundDragoverHandler),// this.addEventListener('dragend', this.boundDragendHandler);
this.addEventListener("pointerup",this.boundDragendHandler),// this.addEventListener('pointercancel', this.boundDragendHandler);
// this.addEventListener('drop', this.boundDropHandler);
// this.addEventListener('pointerdown', this.boundPointerdownHandler);
this.addEventListener("auto-save-text:save",this.boundHandleAutoSaveTextSave)}disconnectedCallback(){// this.removeEventListener('dragstart', this.boundDragstartHandler);
this.removeEventListener("pointerdown",this.boundDragstartHandler),// this.removeEventListener('dragover', this.boundDragoverHandler);
this.removeEventListener("pointerover",this.boundDragoverHandler),// this.removeEventListener('dragend', this.boundDragendHandler);
this.removeEventListener("pointerup",this.boundDragendHandler);// this.removeEventListener('drop', this.boundDropHandler);
// this.removeEventListener('pointerdown', this.boundPointerdownHandler);
// this.removeEventListener(
//   'auto-save-text:save',
//   this.boundHandleAutoSaveTextSave,
// );
}handleDragstart(e){console.log("DRAGSTART..."),e instanceof PointerEvent&&(e.target,HTMLElement);let t=e.composedPath().find(e=>e instanceof HTMLElement&&e.matches("auto-save-text input"));if(!(t instanceof HTMLInputElement))return;let n=t.closest(l);if(!(n instanceof HTMLElement))return;if(e instanceof DragEvent){e.dataTransfer?.setData("text/plain",t.id);let n=new Image;n.src="/empty.gif",e.dataTransfer?.setDragImage(n,10,10)}this.draggedCellElement=n;let r=Array.from(this.gridElement.querySelectorAll(`${l}[aria-selected="true"]`));for(let e of r)e.removeAttribute("aria-selected");this.highlightElement=window.document.createElement("div"),this.highlightElement.classList.add("highlight");let{left:o,top:i,height:s,width:a}=n.getBoundingClientRect();// this.highlightElement.style.width = `${width}px`;
// this.highlightElement.style.height = `${height}px`;
this.highlightElement.style.top=`${i}px`,this.highlightElement.style.left=`${o}px`,this.appendChild(this.highlightElement),console.log("HIGHLIGHT ELEMENT CREATED.")}handleDragend(){if(console.log("DRAG END..."),!this.highlightElement)return;let{top:e,left:t,bottom:n,right:r,height:o,width:i}=this.highlightElement.getBoundingClientRect();for(let o of(this.highlightElement.remove(),this.highlightElement=null,this.draggedCellElement=null,console.log("REMOVED HIGHLIGHT"),Array.from(this.gridElement.querySelectorAll(l)))){let l=o.getBoundingClientRect();if(Math.ceil(l.top)>=Math.ceil(e)&&Math.ceil(l.bottom)<=Math.ceil(n)&&Math.ceil(l.left)>=Math.ceil(t)&&Math.ceil(l.right)<=Math.ceil(r)){o.setAttribute("aria-selected","true");let e=o.querySelector("auto-save-text input");if(!(e instanceof HTMLInputElement))continue;e.classList.add("selected")}}}handleDragover(e){if(!this.draggedCellElement||!this.highlightElement)return;console.log("dragover");let t=e.composedPath().find(e=>e instanceof HTMLElement&&e.matches("auto-save-text input"));if(!(t instanceof HTMLElement))return;let n=t.closest(l);if(!(n instanceof HTMLElement))return;let r=n.closest('[role="row"]');if(!(r instanceof HTMLElement))return;let o=Array.from(this.gridElement.querySelectorAll('[role="row"]')).indexOf(r);if(-1===o)return;let i=Array.from(r.querySelectorAll(l)).indexOf(n);if(-1===i)return;let s=this.draggedCellElement.closest('[role="row"]');if(!(s instanceof HTMLElement))return;if(n===this.draggedCellElement){console.log("same, no change...");return}let a=s.getBoundingClientRect().top,d=r.getBoundingClientRect().top,u=this.draggedCellElement.getBoundingClientRect().left,m=n.getBoundingClientRect().left,h=m-u,c=d-a;this.highlightElement.style.height=`${Math.abs(c)+this.draggedCellElement.getBoundingClientRect().height}px`,this.highlightElement.style.width=`${Math.abs(h)+this.draggedCellElement.getBoundingClientRect().width}px`,h<0?this.highlightElement.style.left=`${n.getBoundingClientRect().left}px`:this.highlightElement.style.left=`${this.draggedCellElement.getBoundingClientRect().left}px`,c<0?this.highlightElement.style.top=`${n.getBoundingClientRect().top}px`:this.highlightElement.style.top=`${this.draggedCellElement.getBoundingClientRect().top}px`}handlePointerdown(e){window.document.body.style.overflow="hidden";let t=Array.from(this.gridElement.querySelectorAll(`${l}[aria-selected="true"]`));for(let e of t)e.removeAttribute("aria-selected")}handleDrop(e){if(e.preventDefault(),!this.draggedCellElement||!this.highlightElement)return;let t=e.composedPath().find(e=>e instanceof HTMLElement&&e.matches("auto-save-text input"));if(!(t instanceof HTMLElement))return;let n=t.closest(l);n instanceof HTMLElement&&n.focus()}handleAutoSaveTextSave(e){if(!(e instanceof CustomEvent))return;let{target:t}=e;if(!(t instanceof HTMLElement))return;let n=t.closest('[role="row"]');if(!(n instanceof HTMLElement))return;let r=Array.from(this.gridElement.querySelectorAll('[role="row"]')),l=r.indexOf(n);if(Number(l)!==r.length-1)return;let o=this.querySelector("#add-new-row-button");if(!(o instanceof HTMLButtonElement))throw Error("Could not find add new row button element");let i=o.form;if(!(i instanceof HTMLFormElement))throw Error("Could not find add new row form element");i.submit()}}window.customElements.define("view-container",o)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}]},["gUvsp"],"gUvsp","parcelRequireb585")//# sourceMappingURL=client.js.map
;
//# sourceMappingURL=client.js.map
