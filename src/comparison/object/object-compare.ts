import type { Comparator, FilterConfig } from '../../types';
import { TYPE_NAMES } from '../../constants';
import { compareAgainstAnyProperty, compareAllProperties } from '../property/property-compare.js';

export function compareObjects(
  actual: unknown,
  expected: unknown,
  comparator: Comparator,
  config: FilterConfig,
  anyPropertyKey: string,
  matchAgainstAnyProp: boolean,
  dontMatchWholeObject: boolean,
  expectedType: string,
  currentDepth: number,
): boolean {
  if (matchAgainstAnyProp) {
    return compareAgainstAnyProperty(
      actual as Record<string, unknown>,
      expected,
      comparator,
      config,
      anyPropertyKey,
      dontMatchWholeObject,
      currentDepth,
    );
  }

  if (expectedType === TYPE_NAMES.OBJECT) {
    return compareAllProperties(
      actual as Record<string, unknown>,
      expected as Record<string, unknown>,
      comparator,
      config,
      anyPropertyKey,
      currentDepth,
    );
  }

  return comparator(actual, expected);
}
