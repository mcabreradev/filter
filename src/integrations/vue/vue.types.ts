import type { Ref, ComputedRef } from 'vue';
import type { Expression, FilterOptions } from '../../types';
import type { PaginationResult } from '../shared';

export interface UseFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
}

export interface UseFilteredStateResult<T> {
  data: Ref<T[]>;
  expression: Ref<Expression<T>>;
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
}

export interface UseDebouncedFilterOptions extends FilterOptions {
  delay?: number;
}

export interface UseDebouncedFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
  isPending: Ref<boolean>;
}

export interface UsePaginatedFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
  pagination: ComputedRef<PaginationResult<T>>;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
