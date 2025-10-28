import type { PredicateFunction } from '../types';

export function createFunctionPredicate<T>(expression: PredicateFunction<T>): (item: T) => boolean {
  return expression;
}
