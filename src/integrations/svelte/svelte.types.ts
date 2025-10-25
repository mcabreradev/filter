import type { Readable, Writable } from 'svelte/store';
import type { Expression, FilterOptions } from '../../types';
import type { PaginationResult } from '../shared';

export interface UseFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
}

export interface UseFilteredStateResult<T> {
  data: Writable<T[]>;
  expression: Writable<Expression<T>>;
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
}

export interface UseDebouncedFilterOptions extends FilterOptions {
  delay?: number;
}

export interface UseDebouncedFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
  isPending: Readable<boolean>;
}

export interface UsePaginatedFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
  pagination: Readable<PaginationResult<T>>;
  currentPage: Writable<number>;
  pageSize: Writable<number>;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
