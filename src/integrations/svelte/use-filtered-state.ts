import { writable, derived } from 'svelte/store';
import { filter } from '../../core';
import type { Expression, FilterOptions } from '../../types';
import type { UseFilteredStateResult } from './svelte.types';

export function useFilteredState<T>(
  initialData: T[] = [],
  initialExpression: Expression<T> = () => true,
  options?: FilterOptions,
): UseFilteredStateResult<T> {
  const data = writable<T[]>(initialData);
  const expression = writable<Expression<T>>(initialExpression);

  const filtered = derived([data, expression], ([$data, $expression]) => {
    if (!$data || $data.length === 0) {
      return [];
    }

    try {
      return filter($data, $expression, options);
    } catch {
      return [];
    }
  });

  const isFiltering = derived([data, filtered], ([$data, $filtered]) => {
    return $filtered.length !== $data.length;
  });

  return {
    data,
    expression,
    filtered,
    isFiltering,
  };
}
