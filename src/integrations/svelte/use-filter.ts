import { derived, readable, type Readable } from 'svelte/store';
import { filter } from '../../core';
import type { Expression, FilterOptions } from '../../types';
import type { UseFilterResult } from './svelte.types';
import { isStore } from './svelte.utils';

export function useFilter<T>(
  data: T[] | Readable<T[]>,
  expression: Expression<T> | Readable<Expression<T>>,
  options?: FilterOptions,
): UseFilterResult<T> {
  const dataStore = isStore(data) ? data : readable(data);
  const expressionStore = isStore(expression) ? expression : readable(expression);

  const filtered = derived([dataStore, expressionStore], ([$data, $expression]) => {
    if (!$data || $data.length === 0) {
      return [] as T[];
    }

    try {
      return filter($data, $expression, options);
    } catch {
      return [] as T[];
    }
  }) as Readable<T[]>;

  const isFiltering = derived([dataStore, filtered], ([$data, $filtered]) => {
    return $filtered.length !== $data.length;
  }) as Readable<boolean>;

  return {
    filtered,
    isFiltering,
  };
}
