import {
  getTypeForFilter,
  hasCustomToString,
  isArray,
  isObject,
  isUndefined,
  isFunction,
  lowerCase
} from './utils';

const deepCompare = (actual, expected, comparator, anyPropertyKey, matchAgainstAnyProp, dontMatchWholeObject) => {
  const actualType = getTypeForFilter(actual);
  const expectedType = getTypeForFilter(expected);

  if ((expectedType === 'string') && (expected.charAt(0) === '!')) {
    return !deepCompare(actual, expected.substring(1), comparator, anyPropertyKey, matchAgainstAnyProp);
  } else if (isArray(actual)) {
    return actual.some(function (item) {
      return deepCompare(item, expected, comparator, anyPropertyKey, matchAgainstAnyProp);
    });
  }

  switch (actualType) {
    case 'object':
      let key;
      if (matchAgainstAnyProp) {
        for (key in actual) {
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

export const createPredicateFn = (expression, comparator, anyPropertyKey, matchAgainstAnyProp) => {
  let shouldMatchPrimitives = isObject(expression) && (anyPropertyKey in expression), predicateFn;

  if (!isFunction(comparator)) {
    comparator = function (actual, expected) {
      if (isUndefined(actual)) {
        return false;
      }
      if ((actual === null) || (expected === null)) {
        return actual === expected;
      }
      if (isObject(expected) || (isObject(actual) && !hasCustomToString(actual))) {
        return false;
      }

      actual = lowerCase(""+actual);
      expected = lowerCase(""+expected);
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
