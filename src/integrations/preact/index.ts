import { useMemo, useState, useEffect } from 'preact/hooks';
import { filter } from '../../core/filter/filter';
import type { Expression, FilterOptions } from '../../types';

export function useFilter<T>(
  data: T[],
  expression: Expression<T> | null,
  options?: FilterOptions,
): {
  filtered: T[];
  isFiltering: boolean;
} {
  const filtered = useMemo(() => {
    if (!expression || data.length === 0) {
      return data;
    }
    return filter(data, expression, options);
  }, [data, expression, options]);

  const isFiltering = useMemo(() => {
    return expression !== null && data.length > 0;
  }, [expression, data]);

  return { filtered, isFiltering };
}

export function useFilteredState<T>(
  data: T[],
  initialExpression?: Expression<T>,
  options?: FilterOptions,
): {
  filtered: T[];
  expression: Expression<T> | null;
  setExpression: (expr: Expression<T> | null) => void;
  reset: () => void;
} {
  const [expression, setExpression] = useState<Expression<T> | null>(initialExpression || null);

  const filtered = useMemo(() => {
    if (!expression || data.length === 0) {
      return data;
    }
    return filter(data, expression, options);
  }, [data, expression, options]);

  const reset = (): void => setExpression(null);

  return { filtered, expression, setExpression, reset };
}

export function useDebouncedFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: {
    delay?: number;
    filterOptions?: FilterOptions;
  },
): {
  filtered: T[];
  isPending: boolean;
} {
  const { delay = 300, filterOptions = {} } = options || {};
  const [debouncedExpr, setDebouncedExpr] = useState<Expression<T> | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    setIsPending(true);
    const timer = setTimeout((): void => {
      setDebouncedExpr(expression);
      setIsPending(false);
    }, delay);

    return (): void => clearTimeout(timer);
  }, [expression, delay]);

  const filtered = useMemo(() => {
    if (!debouncedExpr || data.length === 0) {
      return data;
    }
    return filter(data, debouncedExpr, filterOptions);
  }, [data, debouncedExpr, filterOptions]);

  return { filtered, isPending };
}

export function usePaginatedFilter<T>(
  data: T[],
  expression: Expression<T> | null,
  options?: {
    pageSize?: number;
    initialPage?: number;
    filterOptions?: FilterOptions;
  },
): {
  paginatedResults: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
} {
  const { pageSize: initialPageSize = 10, initialPage = 1, filterOptions = {} } = options || {};

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const filtered = useMemo(() => {
    if (!expression || data.length === 0) {
      return data;
    }
    return filter(data, expression, filterOptions);
  }, [data, expression, filterOptions]);

  const totalPages = useMemo(() => {
    return Math.ceil(filtered.length / pageSize);
  }, [filtered.length, pageSize]);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const setPage = (page: number): void => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const setPageSize = (size: number): void => {
    setPageSizeState(Math.max(1, size));
    setCurrentPage(1);
  };

  const nextPage = (): void => {
    setPage(currentPage + 1);
  };

  const prevPage = (): void => {
    setPage(currentPage - 1);
  };

  return {
    paginatedResults,
    currentPage,
    totalPages,
    pageSize,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
  };
}

export { filter };
