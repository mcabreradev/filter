const filter = (array, expression, comparator, anyPropertyKey) => {

    if (!isArrayLike(array)) {
      if (array == null) {
        return array;
      } else {
        throw minErr('filter')('notarray', 'Expected array but received: {0}', array);
      }
    }
  
    anyPropertyKey = anyPropertyKey || '$';
    var expressionType = getTypeForFilter(expression);
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
        // falls through
      case 'object':
        predicateFn = createPredicateFn(expression, comparator, anyPropertyKey, matchAgainstAnyProp);
        break;
      default:
        return array;
    }
  
    return Array.prototype.filter.call(array, predicateFn);
  };
  
  const createPredicateFn = (expression, comparator, anyPropertyKey, matchAgainstAnyProp) => {
    var shouldMatchPrimitives = isObject(expression) && (anyPropertyKey in expression), predicateFn;
  
    if (!isFunction(comparator)) {
      comparator = function (actual, expected) {
        if (isUndefined(actual)) {
          // No substring matching against `undefined`
          return false;
        }
        if ((actual === null) || (expected === null)) {
          // No substring matching against `null`; only match against `null`
          return actual === expected;
        }
        if (isObject(expected) || (isObject(actual) && !hasCustomToString(actual))) {
          // Should not compare primitives against objects, unless they have custom `toString` method
          return false;
        }
  
        actual = lowerCase('' + actual);
        expected = lowerCase('' + expected);
        return actual.indexOf(expected) !== -1;
      };
    }
  
    predicateFn = function (item) {
      if (shouldMatchPrimitives && !isObject(item)) {
        return deepCompare(item, expression[anyPropertyKey], comparator, anyPropertyKey, false);
      }
      return deepCompare(item, expression, comparator, anyPropertyKey, matchAgainstAnyProp);
    };
  
    return predicateFn;
  }
  
  const deepCompare = (actual, expected, comparator, anyPropertyKey, matchAgainstAnyProp, dontMatchWholeObject) => {
    var actualType = getTypeForFilter(actual);
    var expectedType = getTypeForFilter(expected);
  
    if ((expectedType === 'string') && (expected.charAt(0) === '!')) {
      return !deepCompare(actual, expected.substring(1), comparator, anyPropertyKey, matchAgainstAnyProp);
    } else if (isArray(actual)) {
      // In case `actual` is an array, consider it a match
      // if ANY of it's items matches `expected`
      return actual.some(function (item) {
        return deepCompare(item, expected, comparator, anyPropertyKey, matchAgainstAnyProp);
      });
    }
  
    switch (actualType) {
      case 'object':
        var key;
        if (matchAgainstAnyProp) {
          for (key in actual) {
            // Under certain, rare, circumstances, key may not be a string and `charAt` will be undefined
            // See: https://github.com/angular/angular.js/issues/15644
            if (key.charAt && (key.charAt(0) !== '$') &&
              deepCompare(actual[key], expected, comparator, anyPropertyKey, true)) {
              return true;
            }
          }
          return dontMatchWholeObject ? false : deepCompare(actual, expected, comparator, anyPropertyKey, false);
        } else if (expectedType === 'object') {
          for (key in expected) {
            var expectedVal = expected[key];
            if (isFunction(expectedVal) || isUndefined(expectedVal)) {
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
  }
  
  const getTypeForFilter = (val) => (val === null) ? 'null' : typeof val;
  
  const hasCustomToString = (obj) => isFunction(obj.toString) && obj.toString !== toString;
  
  const isArray = Array.isArray || ((x) => x && typeof x.length === 'number');
  
  const isArrayLike = (x) => {
    return [...x], true || false;
  };
  
  const isObject = (x) => x != null && typeof x === 'object';
  
  const isFunction = (x) => typeof x === 'function';
  
  const isUndefined = (x) => typeof x === 'undefined';
  
  const lowerCase = (x) =>  x.toLowerCase();



  module.exports = filter;