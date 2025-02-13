(function(r,i){typeof exports=="object"&&typeof module<"u"?i(require("react"),require("react-dom")):typeof define=="function"&&define.amd?define(["react","react-dom"],i):(r=typeof globalThis<"u"?globalThis:r||self,i(r.React,r.ReactDOM))})(this,function(r,i){"use strict";var s={exports:{}},n={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var l;function m(){if(l)return n;l=1;var o=Symbol.for("react.transitional.element"),h=Symbol.for("react.fragment");function f(v,e,t){var u=null;if(t!==void 0&&(u=""+t),e.key!==void 0&&(u=""+e.key),"key"in e){t={};for(var a in e)a!=="key"&&(t[a]=e[a])}else t=e;return e=t.ref,{$$typeof:o,type:v,key:u,ref:e!==void 0?e:null,props:t}}return n.Fragment=h,n.jsx=f,n.jsxs=f,n}var c;function p(){return c||(c=1,s.exports=m()),s.exports}var d=p();const R=()=>d.jsxs("div",{className:"my-widget",children:[d.jsx("h3",{children:"Hello from Widget!"}),d.jsx("p",{children:"This is a live widget served from a CDN."})]}),x=document.createElement("style");x.textContent=`
  .my-widget {
    border: 1px solid #ddd;
    padding: 10px;
    width: 250px;
    background-color: white;
    font-family: Arial, sans-serif;
  }
  .my-widget h3 {
    color: blue;
  }
`,document.head.appendChild(x),window.renderWidget=o=>{i.render(d.jsx(R,{}),document.getElementById(o))}});
