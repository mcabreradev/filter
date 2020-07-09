"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPredicateFn = void 0;

var _utils = require("./utils");

var deepCompare = function deepCompare(actual, expected, comparator, anyPropertyKey, matchAgainstAnyProp, dontMatchWholeObject) {
  var actualType = (0, _utils.getTypeForFilter)(actual);
  var expectedType = (0, _utils.getTypeForFilter)(expected);

  if (expectedType === 'string' && expected.charAt(0) === '!') {
    return !deepCompare(actual, expected.substring(1), comparator, anyPropertyKey, matchAgainstAnyProp);
  } else if ((0, _utils.isArray)(actual)) {
    return actual.some(function (item) {
      return deepCompare(item, expected, comparator, anyPropertyKey, matchAgainstAnyProp);
    });
  }

  switch (actualType) {
    case 'object':
      var key;

      if (matchAgainstAnyProp) {
        for (key in actual) {
          if (key.charAt && key.charAt(0) !== '$' && deepCompare(actual[key], expected, comparator, anyPropertyKey, true)) {
            return true;
          }
        }

        return dontMatchWholeObject ? false : deepCompare(actual, expected, comparator, anyPropertyKey, false);
      } else if (expectedType === 'object') {
        for (key in expected) {
          var expectedVal = expected[key];

          if ((0, _utils.isFunction)(expectedVal) || (0, _utils.isUndefined)(expectedVal)) {
            continue;
          }

          var matchAnyProperty = key === anyPropertyKey;
          var actualVal = matchAnyProperty ? actual : actual[key];

          if (!deepCompare(actualVal, expectedVal, comparator, anyPropertyKey, matchAnyProperty, matchAnyProperty)) {
            return false;
          }
        }

        return true;
      } else {
        return comparator(actual, expected);
      }

    case 'function':
      return false;

    default:
      return comparator(actual, expected);
  }
};

var createPredicateFn = function createPredicateFn(expression, comparator, anyPropertyKey, matchAgainstAnyProp) {
  var shouldMatchPrimitives = (0, _utils.isObject)(expression) && anyPropertyKey in expression,
      predicateFn;

  if (!(0, _utils.isFunction)(comparator)) {
    comparator = function comparator(actual, expected) {
      if ((0, _utils.isUndefined)(actual)) {
        return false;
      }

      if (actual === null || expected === null) {
        return actual === expected;
      }

      if ((0, _utils.isObject)(expected) || (0, _utils.isObject)(actual) && !(0, _utils.hasCustomToString)(actual)) {
        return false;
      }

      actual = (0, _utils.lowerCase)("" + actual);
      expected = (0, _utils.lowerCase)("" + expected);
      return actual.indexOf(expected) !== -1;
    };
  }

  predicateFn = function predicateFn(item) {
    if (shouldMatchPrimitives && !(0, _utils.isObject)(item)) {
      return deepCompare(item, expression[anyPropertyKey], comparator, anyPropertyKey, false);
    }

    return deepCompare(item, expression, comparator, anyPropertyKey, matchAgainstAnyProp);
  };

  return predicateFn;
};

exports.createPredicateFn = createPredicateFn;