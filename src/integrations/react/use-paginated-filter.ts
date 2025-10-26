import { useState, useMemo, useCallback } from 'react';
import { filter } from '../../core';
import type { Expression, FilterOptions } from '../../types';
import type { UsePaginatedFilterResult } from './react.types';
import { DEFAULT_PAGE_SIZE, DEFAULT_INITIAL_PAGE } from './react.constants';
import {
  getPageData,
  createPaginationResult,
  validatePageNumber,
  validatePageSize,
} from '../shared';

export function usePaginatedFilter<T>(
  data: T[],
  expression: Expression<T>,
  initialPageSize: number = DEFAULT_PAGE_SIZE,
  options?: FilterOptions,
): UsePaginatedFilterResult<T> {
  const [currentPage, setCurrentPage] = useState(DEFAULT_INITIAL_PAGE);
  const [pageSize, setPageSizeState] = useState(validatePageSize(initialPageSize));

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

  const paginationState = useMemo(
    () => ({
      currentPage,
      pageSize,
      totalItems: filtered.length,
    }),
    [currentPage, pageSize, filtered.length],
  );

  const pageData = useMemo(() => {
    return getPageData(filtered, currentPage, pageSize);
  }, [filtered, currentPage, pageSize]);

  const paginationResult = useMemo(() => {
    return createPaginationResult(pageData, filtered, paginationState);
  }, [pageData, filtered, paginationState]);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => {
      const validated = validatePageNumber(prev + 1, paginationResult.totalPages);
      return validated;
    });
  }, [paginationResult.totalPages]);

  const previousPage = useCallback(() => {
    setCurrentPage((prev) => {
      const validated = validatePageNumber(prev - 1, paginationResult.totalPages);
      return validated;
    });
  }, [paginationResult.totalPages]);

  const goToPage = useCallback(
    (page: number) => {
      const validated = validatePageNumber(page, paginationResult.totalPages);
      setCurrentPage(validated);
    },
    [paginationResult.totalPages],
  );

  const setPageSize = useCallback((size: number) => {
    const validated = validatePageSize(size);
    setPageSizeState(validated);
    setCurrentPage(DEFAULT_INITIAL_PAGE);
  }, []);

  return {
    ...paginationResult,
    filtered,
    isFiltering,
    nextPage,
    previousPage,
    goToPage,
    setPageSize,
  };
}
