import type { Comparator, FilterConfig } from '../types';
import { ANY_PROPERTY_KEY } from '../constants';
import { isFunction, isUndefined } from '../utils';
import { deepCompare } from './deep-compare';

export function compareAgainstAnyProperty(
  actual: Record<string, unknown>,
  expected: unknown,
  comparator: Comparator,
  config: FilterConfig,
  anyPropertyKey: string,
  dontMatchWholeObject: boolean,
  currentDepth: number
): boolean {
  for (const key in actual) {
    if (
      key.charAt &&
      key.charAt(0) !== ANY_PROPERTY_KEY &&
      deepCompare(actual[key], expected, comparator, config, anyPropertyKey, true, false, currentDepth + 1)
    ) {
      return true;
    }
  }

  return dontMatchWholeObject
    ? false
    : deepCompare(actual, expected, comparator, config, anyPropertyKey, false, false, currentDepth + 1);
}

export function compareAllProperties(
  actual: Record<string, unknown>,
  expected: Record<string, unknown>,
  comparator: Comparator,
  config: FilterConfig,
  anyPropertyKey: string,
  currentDepth: number
): boolean {
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
        config,
        anyPropertyKey,
        matchAnyProperty,
        matchAnyProperty,
        currentDepth + 1
      )
    ) {
      return false;
    }
  }

  return true;
}

