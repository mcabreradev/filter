import type { FilterConfig } from '../../types';
import { hasWildcard, createWildcardRegex, hasNegation, removeNegation } from '../../utils';

export function createStringPredicate<T>(
  expression: string,
  config: FilterConfig,
): (item: T) => boolean {
  if (hasNegation(expression)) {
    const cleanExpression = removeNegation(expression);
    return function (item: T): boolean {
      if (item === null || item === undefined) {
        return false;
      }
      if (typeof item === 'string') {
        const itemLower = config.caseSensitive ? item : item.toLowerCase();
        const exprLower = config.caseSensitive ? cleanExpression : cleanExpression.toLowerCase();
        return itemLower !== exprLower;
      }
      const values = Object.values(item as Record<string, unknown>);
      return !values.some((value) => {
        if (typeof value === 'string') {
          const valueLower = config.caseSensitive ? value : value.toLowerCase();
          const exprLower = config.caseSensitive ? cleanExpression : cleanExpression.toLowerCase();
          return valueLower === exprLower;
        }
        return value === cleanExpression;
      });
    };
  }

  if (hasWildcard(expression)) {
    const regex = createWildcardRegex(expression, config.caseSensitive);
    return function (item: T): boolean {
      if (item === null || item === undefined) {
        return false;
      }
      if (typeof item === 'string') {
        return regex.test(item);
      }
      for (const key in item as unknown as object) {
        const value = (item as Record<string, unknown>)[key];
        if (typeof value === 'string' && regex.test(value)) {
          return true;
        }
      }
      return false;
    };
  }

  return function (item: T): boolean {
    if (item === null || item === undefined) {
      return false;
    }
    if (typeof item === 'string') {
      const itemLower = config.caseSensitive ? item : item.toLowerCase();
      const exprLower = config.caseSensitive ? expression : expression.toLowerCase();
      return itemLower === exprLower;
    }
    const values = Object.values(item as Record<string, unknown>);
    return values.some((value) => {
      if (typeof value === 'string') {
        const valueLower = config.caseSensitive ? value : value.toLowerCase();
        const exprLower = config.caseSensitive ? expression : expression.toLowerCase();
        return valueLower === exprLower;
      }
      return value === expression;
    });
  };
}
