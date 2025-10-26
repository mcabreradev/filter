import { writable, derived, readable, type Readable } from 'svelte/store';
import { filter } from '../../core';
import type { Expression, FilterOptions } from '../../types';
import type { UsePaginatedFilterResult } from './svelte.types';
import { DEFAULT_PAGE_SIZE, DEFAULT_INITIAL_PAGE } from './svelte.constants';
import {
  getPageData,
  createPaginationResult,
  validatePageNumber,
  validatePageSize,
  type PaginationResult,
} from '../shared';
import { isStore } from './svelte.utils';

export function usePaginatedFilter<T>(
  data: T[] | Readable<T[]>,
  expression: Expression<T> | Readable<Expression<T>>,
  initialPageSize: number = DEFAULT_PAGE_SIZE,
  options?: FilterOptions,
): UsePaginatedFilterResult<T> {
  const currentPage = writable(DEFAULT_INITIAL_PAGE);
  const pageSize = writable(validatePageSize(initialPageSize));

  const dataStore = isStore(data) ? data : readable(data);
  const expressionStore = isStore(expression) ? expression : readable(expression);

  const filtered = derived([dataStore, expressionStore], ([$data, $expression]) => {
    if (!$data || $data.length === 0) {
      return [] as T[];
    }

    try {
      return filter($data, $expression, options);
    } catch {
      return [] as T[];
    }
  }) as Readable<T[]>;

  const isFiltering = derived([dataStore, filtered], ([$data, $filtered]) => {
    return $filtered.length !== $data.length;
  }) as Readable<boolean>;

  const paginationState = derived(
    [currentPage, pageSize, filtered],
    ([$currentPage, $pageSize, $filtered]) => ({
      currentPage: $currentPage,
      pageSize: $pageSize,
      totalItems: ($filtered as T[]).length,
    }),
  );

  const pageData = derived(
    [filtered, currentPage, pageSize],
    ([$filtered, $currentPage, $pageSize]) => {
      return getPageData($filtered as T[], $currentPage, $pageSize);
    },
  );

  const pagination = derived(
    [pageData, filtered, paginationState],
    ([$pageData, $filtered, $paginationState]) => {
      return createPaginationResult($pageData, $filtered as T[], $paginationState);
    },
  ) as Readable<PaginationResult<T>>;

  const nextPage = (): void => {
    currentPage.update((page) => {
      let totalPages = 0;
      pagination.subscribe((p) => {
        totalPages = p.totalPages;
      })();
      return validatePageNumber(page + 1, totalPages);
    });
  };

  const previousPage = (): void => {
    currentPage.update((page) => {
      let totalPages = 0;
      pagination.subscribe((p) => {
        totalPages = p.totalPages;
      })();
      return validatePageNumber(page - 1, totalPages);
    });
  };

  const goToPage = (page: number): void => {
    let totalPages = 0;
    pagination.subscribe((p) => {
      totalPages = p.totalPages;
    })();
    const validated = validatePageNumber(page, totalPages);
    currentPage.set(validated);
  };

  const setPageSize = (size: number): void => {
    const validated = validatePageSize(size);
    pageSize.set(validated);
    currentPage.set(DEFAULT_INITIAL_PAGE);
  };

  return {
    filtered,
    isFiltering,
    pagination,
    currentPage,
    pageSize,
    nextPage,
    previousPage,
    goToPage,
    setPageSize,
  };
}
