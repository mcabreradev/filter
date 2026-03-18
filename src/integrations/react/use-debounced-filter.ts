import { useState, useEffect, useRef } from 'react';
import type { Expression } from '../../types';
import type { UseDebouncedFilterOptions, UseDebouncedFilterResult } from './react.types';
import { DEFAULT_DEBOUNCE_DELAY } from './react.constants';
import { debounce } from '../shared';
import { useFilterCore, useIsFiltering } from './react.utils';

export function useDebouncedFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: UseDebouncedFilterOptions,
): UseDebouncedFilterResult<T> {
  const { delay = DEFAULT_DEBOUNCE_DELAY, ...filterOptions } = options || {};
  const [debouncedExpr, setDebouncedExpr] = useState<Expression<T>>(expression);
  const [isPending, setIsPending] = useState(false);

  type DebouncedFn = ((e: Expression<T>) => void) & { cancel: () => void };
  const debouncedSet = useRef<DebouncedFn | null>(null);

  useEffect(() => {
    const fn = debounce((e: Expression<T>) => {
      setDebouncedExpr(e);
      setIsPending(false);
    }, delay);
    debouncedSet.current = fn;
    return (): void => fn.cancel();
  }, [delay]);

  useEffect(() => {
    if (!debouncedSet.current) return;
    setIsPending(true);
    debouncedSet.current(expression);
  }, [expression]);

  const filtered = useFilterCore(data, debouncedExpr, filterOptions);
  const isFiltering = useIsFiltering(filtered, data);

  return { filtered, isFiltering, isPending };
}
