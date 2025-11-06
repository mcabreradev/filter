import { useState, useCallback } from 'react';
import type { Expression, FilterOptions } from '../../types';
import type { UseFilteredStateResult } from './react.types';
import { useFilterCore, useIsFiltering } from './react.utils';

export function useFilteredState<T>(
  initialData: T[] = [],
  initialExpression: Expression<T> = () => true,
  options?: FilterOptions,
): UseFilteredStateResult<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [expression, setExpressionState] = useState<Expression<T>>(initialExpression);

  const filtered = useFilterCore(data, expression, options);
  const isFiltering = useIsFiltering(filtered, data);

  const setExpression = useCallback((e: Expression<T>) => setExpressionState(e), []);

  return { data, setData, expression, setExpression, filtered, isFiltering };
}
