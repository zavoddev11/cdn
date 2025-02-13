(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-dom'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ChatWidget = {}, global.React, global.ReactDOM));
})(this, (function (exports, React, ReactDOM) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

  const Widget = () => /*#__PURE__*/React__default["default"].createElement("div", {
    className: "my-widget"
  }, /*#__PURE__*/React__default["default"].createElement("h3", null, "Hello from Widget!"), /*#__PURE__*/React__default["default"].createElement("p", null, "This is a live widget served from a CDN."));
  const mountWidget = containerId => {
    const container = document.getElementById(containerId);
    if (container) {
      ReactDOM__default["default"].render(/*#__PURE__*/React__default["default"].createElement(Widget, null), container);
    }
  };

  exports.mountWidget = mountWidget;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
