"use strict";

var _functions = require("./functions");

var _utils = require("./utils");

var filter = function filter(array, expression, comparator, anyPropertyKey) {
  if (!(0, _utils.isArrayLike)(array)) {
    if (array == null) {
      return array;
    } else {
      throw minErr('filter')('notarray', 'Expected array but received: {0}', array);
    }
  }

  anyPropertyKey = anyPropertyKey || '$';
  var expressionType = (0, _utils.getTypeForFilter)(expression);
  var predicateFn;
  var matchAgainstAnyProp;

  switch (expressionType) {
    case 'function':
      predicateFn = expression;
      break;

    case 'boolean':
    case 'null':
    case 'number':
    case 'string':
      matchAgainstAnyProp = true;

    case 'object':
      predicateFn = (0, _functions.createPredicateFn)(expression, comparator, anyPropertyKey, matchAgainstAnyProp);
      break;

    default:
      return array;
  }

  return Array.prototype.filter.call(array, predicateFn);
};

module.exports = filter;