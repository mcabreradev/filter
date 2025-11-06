import type { Expression, FilterConfig } from '../../types';
import { createPredicateFn } from '../../predicate';

export const applyLogicalOperators = <T>(
  item: T,
  operator: '$and' | '$or' | '$not',
  expressions: Expression<T> | Expression<T>[],
  config: FilterConfig,
): boolean => {
  switch (operator) {
    case '$and':
      if (!Array.isArray(expressions)) {
        throw new Error('$and operator requires an array of expressions');
      }
      return expressions.every((expr) => {
        const predicate = createPredicateFn<T>(expr, config);
        return predicate(item);
      });

    case '$or':
      if (!Array.isArray(expressions)) {
        throw new Error('$or operator requires an array of expressions');
      }
      return expressions.some((expr) => {
        const predicate = createPredicateFn<T>(expr, config);
        return predicate(item);
      });

    case '$not':
      if (Array.isArray(expressions)) {
        throw new Error('$not operator requires a single expression');
      }
      const predicate = createPredicateFn<T>(expressions, config);
      return !predicate(item);

    default:
      return true;
  }
};
