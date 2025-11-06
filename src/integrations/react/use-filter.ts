import type { Expression, FilterOptions } from '../../types';
import type { UseFilterResult } from './react.types';
import { useFilterCore, useIsFiltering } from './react.utils';

export function useFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: FilterOptions,
): UseFilterResult<T> {
  const filtered = useFilterCore(data, expression, options);
  const isFiltering = useIsFiltering(filtered, data);
  return { filtered, isFiltering };
}
