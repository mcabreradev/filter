import type { Expression, FilterOptions } from '../types';
import { expressionSchema, filterOptionsSchema } from './schemas';

export const validateExpression = <T>(expression: unknown): Expression<T> => {
  const result = expressionSchema.safeParse(expression);
  if (!result.success) {
    throw new Error(`Invalid filter expression: ${result.error.message}`);
  }
  return result.data as Expression<T>;
};

export const validateOptions = (options: unknown): FilterOptions => {
  const result = filterOptionsSchema.safeParse(options);
  if (!result.success) {
    throw new Error(`Invalid filter options: ${result.error.message}`);
  }
  return (result.data as FilterOptions) || {};
};
