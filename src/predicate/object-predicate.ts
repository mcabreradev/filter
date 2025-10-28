import type { FilterConfig, OperatorExpression, LogicalOperators } from '../types';
import { OPERATORS } from '../constants';
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
import { applyLogicalOperators } from '../operators/logical.operators';

const isLogicalOperator = (key: string): key is '$and' | '$or' | '$not' => {
  return key === OPERATORS.AND || key === OPERATORS.OR || key === OPERATORS.NOT;
};

export function createObjectPredicate<T>(
  expression: Record<string, unknown>,
  config: FilterConfig,
): (item: T) => boolean {
  return function (item: T): boolean {
    for (const key in expression) {
      if (isLogicalOperator(key)) {
        const logicalExpr = expression as LogicalOperators<T>;
        const operatorValue = logicalExpr[key];
        if (
          operatorValue !== undefined &&
          !applyLogicalOperators(item, key, operatorValue, config)
        ) {
          return false;
        }
        continue;
      }

      let expr = expression[key];
      const itemValue = (item as Record<string, unknown>)[key];

      if (isObject(expr) && isOperatorExpression(expr)) {
        if (!processOperators(itemValue, expr as OperatorExpression, config, item)) {
          return false;
        }
        continue;
      }

      if (isObject(expr) && !isOperatorExpression(expr) && isObject(itemValue)) {
        const nestedPredicate = createObjectPredicate(expr as Record<string, unknown>, config);
        if (!nestedPredicate(itemValue)) {
          return false;
        }
        continue;
      }

      let shouldNegate = false;

      if (isString(expr) && hasNegation(expr)) {
        expr = removeNegation(expr);
        shouldNegate = true;
      }

      if (Array.isArray(expr)) {
        const matchesAny = expr.some((value) => {
          if (isString(value) && hasWildcard(value)) {
            const regex = createWildcardRegex(value, config.caseSensitive);
            return typeof itemValue === 'string' && regex.test(itemValue);
          }
          return itemValue === value;
        });

        if (shouldNegate ? matchesAny : !matchesAny) {
          return false;
        }
        continue;
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
