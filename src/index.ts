/**
 * Filters an array based on the provided expression.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The array to filter.
 * @param {unknown} expression - The expression used for filtering.
 * @returns {T[]} - The filtered array.
 * @throws {Error} - If the input is not an array.
 */

// Constants
const TYPES = {
  BOOLEAN: 'boolean',
  NULL: 'null',
  NUMBER: 'number',
  STRING: 'string',
  OBJECT: 'object',
  FUNCTION: 'function',
  UNDEFINED: 'undefined',
};

const ANY_PROPERTY_KEY = '$';

// Type Checking Functions
const isType =
  (type: string) =>
  (value: unknown): boolean =>
    typeof value === type;
const isObject = isType(TYPES.OBJECT);
const isFunction = isType(TYPES.FUNCTION);
const isString = isType(TYPES.STRING);
const isUndefined = isType(TYPES.UNDEFINED);

// Other Helper Functions
const lowercase = (string: string): string => string.toLowerCase();
const equals = (a: unknown, b: unknown): boolean => a === b;
const getTypeForFilter = (value: unknown): string => (value === null ? TYPES.NULL : typeof value);
const hasCustomToString = (obj: unknown): boolean =>
  isFunction((obj as { toString: () => string }).toString) &&
  (obj as { toString: () => string }).toString !== Object.prototype.toString;

// Main Filter Function
const filter = <T>(array: T[], expression): T[] => {
  if (!Array.isArray(array)) {
    throw new Error(`Expected array but received: ${array}`);
  }

  const expressionType: string = getTypeForFilter(expression);
  const matchAgainstAnyProp: boolean = [
    TYPES.BOOLEAN,
    TYPES.NULL,
    TYPES.NUMBER,
    TYPES.STRING,
  ].includes(expressionType);
  const predicateFn = createPredicateFn(expression, equals, ANY_PROPERTY_KEY, matchAgainstAnyProp);

  return array.filter(predicateFn);
};

// Predicate Function Creation
const createPredicateFn = (
  expression,
  comparator: unknown = equals,
  anyPropertyKey: string,
  matchAgainstAnyProp: boolean,
): ((item: unknown) => boolean) => {
  const shouldMatchPrimitives: boolean = isObject(expression) && anyPropertyKey in expression;
  let shouldNegate = false;

  if (isString(expression)) {
    if (expression.includes('%')) {
      const regex = new RegExp('^' + expression.replace(/%/g, '.*') + '$', 'i');
      return function (item) {
        for (const key in item as unknown as object) {
          if (regex.test(item[key])) {
            return true;
          }
        }
        return false;
      };
    } else if (expression.includes('_')) {
      const regex = new RegExp('^' + expression.replace(/_/g, '.') + '$', 'i');
      return function (item) {
        for (const key in item as unknown as object) {
          if (regex.test(item[key])) {
            return true;
          }
        }
        return false;
      };
    } else if (expression.charAt(0) === '!') {
      expression = expression.slice(1);
      shouldNegate = true;
    } else {
      return function (item) {
        for (const key in item as unknown as object) {
          if (item[key] === expression) {
            return true;
          }
        }
        return false;
      };
    }
  }

  if (isObject(expression)) {
    return function (item) {
      for (const key in expression as unknown as object) {
        let expr = expression[key];
        let shouldNegate = false;

        if (isString(expr) && expr.charAt(0) === '!') {
          expr = expr.slice(1);
          shouldNegate = true;
        }

        if (isString(expr) && expr.includes('%')) {
          const regex = new RegExp('^' + expr.replace(/%/g, '.*') + '$', 'i');
          if (shouldNegate ? regex.test(item[key]) : !regex.test(item[key])) {
            return false;
          }
        } else if (isString(expr) && expr.includes('_')) {
          const regex = new RegExp('^' + expr.replace(/_/g, '.') + '$', 'i');
          if (shouldNegate ? regex.test(item[key]) : !regex.test(item[key])) {
            return false;
          }
        } else if (shouldNegate ? item[key] === expr : item[key] !== expr) {
          return false;
        }
      }
      return true;
    };
  }

  if (isFunction(expression)) {
    return expression;
  }

  if (isFunction(comparator)) {
    comparator = (actual: unknown, expected: unknown): boolean => {
      if (isUndefined(actual)) return false;
      if (actual === null || expected === null) return actual === expected;
      if (isObject(expected) || (isObject(actual) && !hasCustomToString(actual))) return false;

      actual = lowercase('' + actual);
      expected = lowercase('' + expected);
      return (actual as string).indexOf(expected as string) !== -1;
    };
  }

  return (item: unknown) => {
    if (shouldMatchPrimitives && !isObject(item)) {
      return deepCompare(item, expression[anyPropertyKey], comparator, anyPropertyKey, false);
    } else if (shouldNegate) {
      return !deepCompare(item, expression, comparator, anyPropertyKey, matchAgainstAnyProp);
    }
    return deepCompare(item, expression, comparator, anyPropertyKey, matchAgainstAnyProp);
  };
};

// Deep Comparison
function deepCompare(
  actual: unknown,
  expected: unknown,
  comparator: unknown,
  anyPropertyKey?: string,
  matchAgainstAnyProp?: boolean,
  dontMatchWholeObject?: boolean,
): boolean {
  const actualType: string = getTypeForFilter(actual);
  const expectedType: string = getTypeForFilter(expected);

  if (expectedType === TYPES.STRING && (expected as string).charAt(0) === '!') {
    return !deepCompare(
      actual,
      (expected as string).substring(1),
      comparator,
      anyPropertyKey,
      matchAgainstAnyProp,
    );
  }

  if (Array.isArray(actual)) {
    return actual.some((item: unknown) =>
      deepCompare(item, expected, comparator, anyPropertyKey, matchAgainstAnyProp),
    );
  }

  if (actualType === TYPES.OBJECT) {
    return compareObjects(
      actual,
      expected,
      comparator,
      anyPropertyKey,
      matchAgainstAnyProp,
      dontMatchWholeObject || false, // Fix: Ensure dontMatchWholeObject is always of type boolean
      expectedType,
    );
  }

  if (actualType === TYPES.FUNCTION) {
    return false;
  }

  return (comparator as (a: unknown, b: unknown) => boolean)(actual, expected);
}

// Object Comparison
function compareObjects(
  actual: unknown,
  expected: unknown,
  comparator,
  anyPropertyKey: string,
  matchAgainstAnyProp: boolean,
  dontMatchWholeObject: boolean,
  expectedType: string,
): boolean {
  if (matchAgainstAnyProp) {
    return compareAgainstAnyProperty(
      actual,
      expected,
      comparator,
      anyPropertyKey,
      dontMatchWholeObject,
    );
  }

  if (expectedType === TYPES.OBJECT) {
    return compareAllProperties(actual, expected, comparator, anyPropertyKey);
  }

  return comparator(actual, expected);
}

// Property Comparison
function compareAgainstAnyProperty(
  actual,
  expected,
  comparator,
  anyPropertyKey: string,
  dontMatchWholeObject: boolean,
): boolean {
  for (const key in actual) {
    if (
      key.charAt &&
      key.charAt(0) !== ANY_PROPERTY_KEY &&
      deepCompare(actual[key], expected, comparator, anyPropertyKey, true)
    ) {
      return true;
    }
  }

  return dontMatchWholeObject
    ? false
    : deepCompare(actual, expected, comparator, anyPropertyKey, false);
}

function compareAllProperties(actual, expected, comparator, anyPropertyKey: string): boolean {
  for (const key in expected) {
    const expectedVal = expected[key];
    if (isFunction(expectedVal) || isUndefined(expectedVal)) {
      continue;
    }

    const matchAnyProperty = key === anyPropertyKey;
    const actualVal = matchAnyProperty ? actual : actual[key];
    if (
      !deepCompare(
        actualVal,
        expectedVal,
        comparator,
        anyPropertyKey,
        matchAnyProperty,
        matchAnyProperty,
      )
    ) {
      return false;
    }
  }

  return true;
}

export default filter;
