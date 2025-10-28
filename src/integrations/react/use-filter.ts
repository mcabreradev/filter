import { useMemo } from 'react';
import { filter } from '../../core';
import type { Expression, FilterOptions } from '../../types';
import type { UseFilterResult } from './react.types';

export function useFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: FilterOptions,
): UseFilterResult<T> {
  const filtered = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    try {
      return filter(data, expression, options);
    } catch {
      return [];
    }
  }, [data, expression, options]);

  const isFiltering = useMemo(() => {
    return filtered.length !== data.length;
  }, [filtered.length, data.length]);

  return {
    filtered,
    isFiltering,
  };
}
