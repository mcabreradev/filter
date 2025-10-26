import { useState, useEffect, useMemo, useRef } from 'react';
import { filter } from '../../core';
import type { Expression } from '../../types';
import type { UseDebouncedFilterOptions, UseDebouncedFilterResult } from './react.types';
import { DEFAULT_DEBOUNCE_DELAY } from './react.constants';
import { debounce } from '../shared';

export function useDebouncedFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: UseDebouncedFilterOptions,
): UseDebouncedFilterResult<T> {
  const { delay = DEFAULT_DEBOUNCE_DELAY, ...filterOptions } = options || {};
  const [debouncedExpression, setDebouncedExpression] = useState<Expression<T>>(expression);
  const [isPending, setIsPending] = useState(false);

  const debouncedSetExpression = useRef(
    debounce((expr: Expression<T>): void => {
      setDebouncedExpression(expr);
      setIsPending(false);
    }, delay),
  );

  useEffect(() => {
    setIsPending(true);
    debouncedSetExpression.current(expression);

    return (): void => {
      debouncedSetExpression.current.cancel();
    };
  }, [expression]);

  const filtered = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    try {
      return filter(data, debouncedExpression, filterOptions);
    } catch {
      return [];
    }
  }, [data, debouncedExpression, filterOptions]);

  const isFiltering = useMemo(() => {
    return filtered.length !== data.length;
  }, [filtered.length, data.length]);

  return {
    filtered,
    isFiltering,
    isPending,
  };
}
