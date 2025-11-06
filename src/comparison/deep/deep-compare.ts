import type { Comparator, FilterConfig } from '../../types';
import { TYPE_NAMES, ANY_PROPERTY_KEY } from '../../constants';
import { getTypeForFilter } from '../../utils';
import { compareObjects } from '../object/object-compare.js';

export function deepCompare(
  actual: unknown,
  expected: unknown,
  comparator: Comparator,
  config: FilterConfig,
  anyPropertyKey: string = ANY_PROPERTY_KEY,
  matchAgainstAnyProp: boolean = false,
  dontMatchWholeObject: boolean = false,
  currentDepth: number = 0,
): boolean {
  if (currentDepth > config.maxDepth) {
    return false;
  }

  const actualType: string = getTypeForFilter(actual);
  const expectedType: string = getTypeForFilter(expected);

  if (expectedType === TYPE_NAMES.STRING && (expected as string).charAt(0) === '!') {
    return !deepCompare(
      actual,
      (expected as string).substring(1),
      comparator,
      config,
      anyPropertyKey,
      matchAgainstAnyProp,
      dontMatchWholeObject,
      currentDepth + 1,
    );
  }

  if (Array.isArray(actual)) {
    return actual.some((item: unknown) =>
      deepCompare(
        item,
        expected,
        comparator,
        config,
        anyPropertyKey,
        matchAgainstAnyProp,
        dontMatchWholeObject,
        currentDepth + 1,
      ),
    );
  }

  if (actualType === TYPE_NAMES.OBJECT) {
    return compareObjects(
      actual,
      expected,
      comparator,
      config,
      anyPropertyKey,
      matchAgainstAnyProp,
      dontMatchWholeObject,
      expectedType,
      currentDepth,
    );
  }

  if (actualType === TYPE_NAMES.FUNCTION) {
    return false;
  }

  return comparator(actual, expected);
}
