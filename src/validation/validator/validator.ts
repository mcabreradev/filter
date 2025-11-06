import type { Expression, FilterOptions } from '../../types';
import { expressionSchema, filterOptionsSchema } from '../schemas';
import { InvalidExpressionError, ConfigurationError } from '../../errors/filter-errors.js';

export const validateExpression = <T>(expression: unknown): Expression<T> => {
  const result = expressionSchema.safeParse(expression);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message);
    throw new InvalidExpressionError(expression, result.error.message, errors);
  }
  return result.data as Expression<T>;
};

export const validateOptions = (options: unknown): FilterOptions => {
  const result = filterOptionsSchema.safeParse(options);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message);
    throw new ConfigurationError(`${result.error.message}\nErrors: ${errors.join(', ')}`);
  }
  return (result.data as FilterOptions) || {};
};
