import type { PrimitiveExpression, PredicateFunction } from '../types';
import { TYPE_NAMES } from '../constants';

export const isString = (value: unknown): value is string =>
  typeof value === TYPE_NAMES.STRING;

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === TYPE_NAMES.OBJECT && value !== null && !Array.isArray(value);

export const isFunction = (value: unknown): value is Function =>
  typeof value === TYPE_NAMES.FUNCTION;

export const isUndefined = (value: unknown): value is undefined =>
  typeof value === TYPE_NAMES.UNDEFINED;

export const isPrimitive = (value: unknown): value is PrimitiveExpression => {
  const type = typeof value;
  return (
    type === TYPE_NAMES.STRING ||
    type === TYPE_NAMES.NUMBER ||
    type === TYPE_NAMES.BOOLEAN ||
    value === null
  );
};

export const isPredicateFunction = <T>(
  expr: unknown
): expr is PredicateFunction<T> => isFunction(expr);

export const getTypeForFilter = (value: unknown): string =>
  value === null ? TYPE_NAMES.NULL : typeof value;

export const hasCustomToString = (obj: unknown): boolean =>
  isFunction((obj as { toString?: () => string }).toString) &&
  (obj as { toString: () => string }).toString !== Object.prototype.toString;

