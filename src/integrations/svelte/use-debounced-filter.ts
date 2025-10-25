import { writable, derived, readable, type Readable } from 'svelte/store';
import { filter } from '../../core';
import type { Expression } from '../../types';
import type { UseDebouncedFilterOptions, UseDebouncedFilterResult } from './svelte.types';
import { DEFAULT_DEBOUNCE_DELAY } from './svelte.constants';
import { debounce } from '../shared';
import { isStore } from './svelte.utils';

export function useDebouncedFilter<T>(
  data: T[] | Readable<T[]>,
  expression: Expression<T> | Readable<Expression<T>>,
  options?: UseDebouncedFilterOptions,
): UseDebouncedFilterResult<T> {
  const { delay = DEFAULT_DEBOUNCE_DELAY, ...filterOptions } = options || {};
  const debouncedExpression = writable<Expression<T>>(
    isStore(expression) ? ((() => true) as Expression<T>) : expression,
  );
  const isPending = writable(false);

  const dataStore = isStore(data) ? data : readable(data);
  const expressionStore = isStore(expression) ? expression : readable(expression);

  const debouncedUpdate = debounce((expr: Expression<T>) => {
    debouncedExpression.set(expr);
    isPending.set(false);
  }, delay) as ((expr: Expression<T>) => void) & { cancel: () => void };

  if (isStore(expression)) {
    expressionStore.subscribe((expr) => {
      isPending.set(true);
      debouncedUpdate(expr);
    });
  }

  const filtered = derived([dataStore, debouncedExpression], ([$data, $expression]) => {
    if (!$data || $data.length === 0) {
      return [] as T[];
    }

    try {
      return filter($data, $expression, filterOptions);
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
    isPending: { subscribe: isPending.subscribe },
  };
}
