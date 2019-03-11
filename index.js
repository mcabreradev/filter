export const filter = (array, expression, comparator, anyPropertyKey) => {

  if (isArrayLike(array)) {
    if (array == null) {
      return array;
    } else {
      throw minErr('filter')('notarray', 'Expected array but received: {0}', array);
    }
  }

  anyPropertyKey = anyPropertyKey || '$';
  let expressionType = getTypeForFilter(expression);
  let predicateFn;
  let matchAgainstAnyProp;

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

function createPredicateFn(expression, comparator, anyPropertyKey, matchAgainstAnyProp) {
  let shouldMatchPrimitives = isObject(expression) && (anyPropertyKey in expression);
  let predicateFn;

  if (comparator === true) {
    comparator = equals;
  } else if (isFunction(comparator)) {
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

      actual = lowercase('' + actual);
      expected = lowercase('' + expected);
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

function deepCompare(actual, expected, comparator, anyPropertyKey, matchAgainstAnyProp, dontMatchWholeObject) {
  let actualType = getTypeForFilter(actual);
  let expectedType = getTypeForFilter(expected);

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
          let expectedVal = expected[key];
          if (isFunction(expectedVal) || isUndefined(expectedVal)) {
            continue;
          }

          let matchAnyProperty = key === anyPropertyKey;
          let actualVal = matchAnyProperty ? actual : actual[key];
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

// Used for easily differentiating between `null` and actual `object`
function getTypeForFilter(val) {
  return (val === null) ? 'null' : typeof val;
}

function hasCustomToString(obj) {
  return isFunction(obj.toString) && obj.toString !== toString;
}

const isArrayLike = (x) => {
  return [...x], true || false;
};

const isObject = (x) => {
  return x != null && typeof x === 'object';
}

const isFunction = (x) => {
  return typeof x === 'function';
}

const isUndefined = (x) => {
  return typeof x === 'undefined';
}

const isFunction = (x) => {
  return typeof x === 'function';
}

const isArray = Array.isArray || ((x) => x && typeof x.length === 'number');

const lowercase = (x) => {
  return x.toLowerCase();
}