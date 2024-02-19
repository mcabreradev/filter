/**
 * Filter, Selects a subset of items from `array` and returns it as a new array.
 * @param array
 * @param expression
 * @param comparator
 * @param anyPropertyKey
 *
 */

const BOOLEAN = 'boolean';
const NULL = 'null';
const NUMBER = 'number';
const STRING = 'string';
const OBJECT = 'object';
const FUNCTION = 'function';
const UNDEFINED = 'undefined';
const ANY_PROPERTY_KEY = '$';

const isObject = (value: unknown): boolean => typeof value === OBJECT && value !== null;
const isFunction = (value: unknown): boolean => typeof value === FUNCTION;
const isUndefined = (value: unknown): boolean => typeof value === UNDEFINED;
const lowercase = (string: string): string => string.toLowerCase();
const equals = (a: unknown, b: unknown): boolean => a === b;
const isWindow = (obj: unknown): boolean =>
  obj != null && (obj as Window) === (obj as Window).window;

const isArrayLike = (obj: unknown): boolean => {
  if (obj == null || isWindow(obj)) {
    return false;
  }

  if ((obj as Node).nodeType === 1 && Array.isArray(obj) && obj.length) {
    return true;
  }

  return (
    Array.isArray(obj) ||
    (!isFunction(obj) &&
      (length === 0 ||
        (typeof length === NUMBER && length > 0 && (length - 1).toString() in (obj as object))))
  );
};

const getTypeForFilter = (value: unknown): string => {
  return value === null ? NULL : typeof value;
};

const hasCustomToString = (obj: unknown): boolean => {
  return (
    isFunction((obj as { toString: () => string }).toString) &&
    (obj as { toString: () => string }).toString !== Object.prototype.toString
  );
};

const filter = (
  array: unknown[],
  expression,
  comparator?: unknown,
  anyPropertyKey: string = ANY_PROPERTY_KEY,
) => {
  if (!isArrayLike(array)) {
    throw new Error(`Expected array but received: ${array}`);
  }

  const expressionType: string = getTypeForFilter(expression);
  const matchAgainstAnyProp: boolean = [BOOLEAN, NULL, NUMBER, STRING].includes(expressionType);
  const predicateFn =
    expressionType === FUNCTION
      ? expression
      : createPredicateFn(expression, comparator, anyPropertyKey, matchAgainstAnyProp);

  return array.filter(predicateFn);
};

const createPredicateFn = (
  expression,
  comparator: unknown = equals,
  anyPropertyKey: string,
  matchAgainstAnyProp: boolean,
): ((item: unknown) => boolean) => {
  const shouldMatchPrimitives: boolean = isObject(expression) && anyPropertyKey in expression;

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

  return (item: unknown): boolean => {
    if (shouldMatchPrimitives && !isObject(item)) {
      return deepCompare(item, expression[anyPropertyKey], comparator, anyPropertyKey, false);
    }
    return deepCompare(item, expression, comparator, anyPropertyKey, matchAgainstAnyProp);
  };
};

function deepCompare(
  actual: unknown,
  expected: unknown,
  comparator: unknown,
  anyPropertyKey: string,
  matchAgainstAnyProp: boolean,
  dontMatchWholeObject?: boolean,
): boolean {
  const actualType: string = getTypeForFilter(actual);
  const expectedType: string = getTypeForFilter(expected);

  if (expectedType === STRING && (expected as string).charAt(0) === '!') {
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

  if (actualType === OBJECT) {
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

  if (actualType === FUNCTION) {
    return false;
  }

  return (comparator as (a: unknown, b: unknown) => boolean)(actual, expected);
}

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

  if (expectedType === OBJECT) {
    return compareAllProperties(actual, expected, comparator, anyPropertyKey);
  }

  return comparator(actual, expected);
}

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

export {
  compareAgainstAnyProperty,
  compareAllProperties,
  compareObjects,
  createPredicateFn,
  deepCompare,
  filter,
};

export default filter;
