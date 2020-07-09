"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isArrayLike = exports.isArray = exports.hasCustomToString = exports.getTypeForFilter = exports.lowerCase = exports.isUndefined = exports.isFunction = exports.isObject = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isObject = function isObject(x) {
  return x != null && _typeof(x) === 'object';
};

exports.isObject = isObject;

var isFunction = function isFunction(x) {
  return typeof x === 'function';
};

exports.isFunction = isFunction;

var isUndefined = function isUndefined(x) {
  return typeof x === 'undefined';
};

exports.isUndefined = isUndefined;

var lowerCase = function lowerCase(x) {
  return x.toLowerCase();
};

exports.lowerCase = lowerCase;

var getTypeForFilter = function getTypeForFilter(val) {
  return val === null ? 'null' : _typeof(val);
};

exports.getTypeForFilter = getTypeForFilter;

var hasCustomToString = function hasCustomToString(obj) {
  return isFunction(obj.toString) && obj.toString !== toString;
};

exports.hasCustomToString = hasCustomToString;

var isArray = Array.isArray || function (x) {
  return x && typeof x.length === 'number';
};

exports.isArray = isArray;

var isArrayLike = function isArrayLike(x) {
  return _toConsumableArray(x), true || false;
};

exports.isArrayLike = isArrayLike;