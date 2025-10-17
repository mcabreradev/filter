import type { Expression, FilterOptions } from '../types';
import { createPredicateFn } from '../predicate';
import { validateExpression } from '../validation';
import { mergeConfig } from '../config';

export function filter<T>(array: T[], expression: Expression<T>, options?: FilterOptions): T[] {
  if (!Array.isArray(array)) {
    throw new Error(`Expected array but received: ${typeof array}`);
  }

  const config = mergeConfig(options);
  const validatedExpression = validateExpression<T>(expression);
  const predicate = createPredicateFn<T>(validatedExpression, config);

  return array.filter(predicate);
}
