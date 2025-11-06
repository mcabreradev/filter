import type { Expression, FilterConfig, Comparator } from '../../types';
import { TYPE_NAMES, ANY_PROPERTY_KEY } from '../../constants';
import {
  isString,
  isObject,
  isFunction,
  isUndefined,
  getTypeForFilter,
  hasCustomToString,
  lowercase,
} from '../../utils';
import { deepCompare } from '../../comparison';
import { createStringPredicate } from '../string';
import { createObjectPredicate } from '../object';
import { createFunctionPredicate } from '../function';
import { memoization } from '../../utils/memoization';

export function createPredicateFn<T>(
  expression: Expression<T>,
  config: FilterConfig,
): (item: T) => boolean {
  if (config.enableCache) {
    const cacheKey = memoization.createExpressionHash(expression, config);
    const cached = memoization.getCachedPredicate<T>(cacheKey);
    if (cached) {
      return cached;
    }

    const predicate = buildPredicate(expression, config);
    memoization.setCachedPredicate(cacheKey, predicate);
    return predicate;
  }

  return buildPredicate(expression, config);
}

function buildPredicate<T>(expression: Expression<T>, config: FilterConfig): (item: T) => boolean {
  const expressionType: string = getTypeForFilter(expression);

  if (isFunction(expression)) {
    return createFunctionPredicate(expression);
  }

  if (isString(expression)) {
    return createStringPredicate(expression, config);
  }

  if (isObject(expression)) {
    return createObjectPredicate(expression as Record<string, unknown>, config);
  }

  const primitiveTypes = [
    TYPE_NAMES.BOOLEAN,
    TYPE_NAMES.NULL,
    TYPE_NAMES.NUMBER,
    TYPE_NAMES.STRING,
  ] as const;

  const matchAgainstAnyProp: boolean = primitiveTypes.includes(
    expressionType as (typeof primitiveTypes)[number],
  );

  const shouldMatchPrimitives: boolean =
    isObject(expression) && ANY_PROPERTY_KEY in (expression as Record<string, unknown>);

  let shouldNegate = false;

  if (isString(expression) && (expression as string).charAt(0) === '!') {
    expression = (expression as string).slice(1) as Expression<T>;
    shouldNegate = true;
  }

  const comparator: Comparator = config.customComparator
    ? config.customComparator
    : (actual: unknown, expected: unknown): boolean => {
        if (isUndefined(actual)) return false;
        if (actual === null || expected === null) return actual === expected;
        if (isObject(expected) || (isObject(actual) && !hasCustomToString(actual))) return false;

        const actualStr = lowercase(String(actual));
        const expectedStr = lowercase(String(expected));
        return actualStr.indexOf(expectedStr) !== -1;
      };

  return (item: T): boolean => {
    if (shouldMatchPrimitives && !isObject(item)) {
      return deepCompare(
        item,
        (expression as Record<string, unknown>)[ANY_PROPERTY_KEY],
        comparator,
        config,
        ANY_PROPERTY_KEY,
        false,
      );
    } else if (shouldNegate) {
      return !deepCompare(
        item,
        expression,
        comparator,
        config,
        ANY_PROPERTY_KEY,
        matchAgainstAnyProp,
      );
    }
    return deepCompare(item, expression, comparator, config, ANY_PROPERTY_KEY, matchAgainstAnyProp);
  };
}
