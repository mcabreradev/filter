import type { FilterConfig, OperatorExpression } from '../types';
import {
  hasWildcard,
  createWildcardRegex,
  hasNegation,
  removeNegation,
  isString,
  isObject,
  isOperatorExpression,
} from '../utils';
import { processOperators } from '../operators';

export function createObjectPredicate<T>(
  expression: Record<string, unknown>,
  config: FilterConfig,
): (item: T) => boolean {
  return function (item: T): boolean {
    for (const key in expression) {
      let expr = expression[key];
      const itemValue = (item as Record<string, unknown>)[key];

      if (isObject(expr) && isOperatorExpression(expr)) {
        if (!processOperators(itemValue, expr as OperatorExpression, config)) {
          return false;
        }
        continue;
      }

      let shouldNegate = false;

      if (isString(expr) && hasNegation(expr)) {
        expr = removeNegation(expr);
        shouldNegate = true;
      }

      if (isString(expr) && hasWildcard(expr)) {
        const regex = createWildcardRegex(expr, config.caseSensitive);
        const matches = typeof itemValue === 'string' && regex.test(itemValue);
        if (shouldNegate ? matches : !matches) {
          return false;
        }
      } else {
        const matches = itemValue === expr;
        if (shouldNegate ? matches : !matches) {
          return false;
        }
      }
    }
    return true;
  };
}
