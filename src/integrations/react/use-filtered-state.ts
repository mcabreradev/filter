import { useState, useMemo, useCallback } from 'react';
import { filter } from '../../core';
import type { Expression, FilterOptions } from '../../types';
import type { UseFilteredStateResult } from './react.types';

export function useFilteredState<T>(
  initialData: T[] = [],
  initialExpression: Expression<T> = () => true,
  options?: FilterOptions,
): UseFilteredStateResult<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [expression, setExpressionState] = useState<Expression<T>>(initialExpression);

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

  const setExpression = useCallback((newExpression: Expression<T>) => {
    setExpressionState(newExpression);
  }, []);

  return {
    data,
    setData,
    expression,
    setExpression,
    filtered,
    isFiltering,
  };
}
