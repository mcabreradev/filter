import { ref, computed, unref, type MaybeRef } from 'vue';
import { filter } from '../../core';
import type { Expression, FilterOptions } from '../../types';
import type { UsePaginatedFilterResult } from './vue.types';
import { DEFAULT_PAGE_SIZE, DEFAULT_INITIAL_PAGE } from './vue.constants';
import {
  getPageData,
  createPaginationResult,
  validatePageNumber,
  validatePageSize,
} from '../shared';

export function usePaginatedFilter<T>(
  data: MaybeRef<T[]>,
  expression: MaybeRef<Expression<T>>,
  initialPageSize: number = DEFAULT_PAGE_SIZE,
  options?: FilterOptions,
): UsePaginatedFilterResult<T> {
  const currentPage = ref(DEFAULT_INITIAL_PAGE);
  const pageSize = ref(validatePageSize(initialPageSize));

  const filtered = computed(() => {
    const dataValue = unref(data);
    const expressionValue = unref(expression);

    if (!dataValue || dataValue.length === 0) {
      return [];
    }

    try {
      return filter(dataValue, expressionValue, options);
    } catch {
      return [];
    }
  });

  const isFiltering = computed(() => {
    const dataValue = unref(data);
    return filtered.value.length !== dataValue.length;
  });

  const paginationState = computed(() => ({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    totalItems: filtered.value.length,
  }));

  const pageData = computed(() => {
    return getPageData(filtered.value, currentPage.value, pageSize.value);
  });

  const pagination = computed(() => {
    return createPaginationResult(pageData.value, filtered.value, paginationState.value);
  });

  const nextPage = (): void => {
    const validated = validatePageNumber(currentPage.value + 1, pagination.value.totalPages);
    currentPage.value = validated;
  };

  const previousPage = (): void => {
    const validated = validatePageNumber(currentPage.value - 1, pagination.value.totalPages);
    currentPage.value = validated;
  };

  const goToPage = (page: number): void => {
    const validated = validatePageNumber(page, pagination.value.totalPages);
    currentPage.value = validated;
  };

  const setPageSize = (size: number): void => {
    const validated = validatePageSize(size);
    pageSize.value = validated;
    currentPage.value = DEFAULT_INITIAL_PAGE;
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
