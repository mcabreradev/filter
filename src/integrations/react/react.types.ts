import type { Expression, FilterOptions } from '../../types';
import type { PaginationResult, PaginationActions } from '../shared';

export interface UseFilterResult<T> {
  filtered: T[];
  isFiltering: boolean;
}

export interface UseFilteredStateResult<T> {
  data: T[];
  setData: (data: T[]) => void;
  expression: Expression<T>;
  setExpression: (expression: Expression<T>) => void;
  filtered: T[];
  isFiltering: boolean;
}

export interface UseDebouncedFilterOptions extends FilterOptions {
  delay?: number;
}

export interface UseDebouncedFilterResult<T> {
  filtered: T[];
  isFiltering: boolean;
  isPending: boolean;
}

export interface UsePaginatedFilterResult<T> extends PaginationResult<T>, PaginationActions {
  filtered: T[];
  isFiltering: boolean;
}

export interface FilterContextValue {
  options?: FilterOptions;
  enableCache?: boolean;
}
