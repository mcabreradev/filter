import { createMemo, createSignal, Accessor } from 'solid-js';
import { filter } from '../../core/filter';
import type { Expression, FilterOptions } from '../../types';

export function useFilter<T>(
  data: Accessor<T[]>,
  expression: Accessor<Expression<T> | null>,
  options?: Accessor<FilterOptions>,
): {
  filtered: Accessor<T[]>;
  isFiltering: Accessor<boolean>;
} {
  const filtered = createMemo(() => {
    const items = data();
    const expr = expression();
    const opts = options?.() || {};

    if (!expr || items.length === 0) {
      return items;
    }

    return filter(items, expr, opts);
  });

  const isFiltering = createMemo(() => {
    return expression() !== null && data().length > 0;
  });

  return { filtered, isFiltering };
}

export function useDebouncedFilter<T>(
  data: Accessor<T[]>,
  expression: Accessor<Expression<T>>,
  options?: {
    delay?: number;
    filterOptions?: FilterOptions;
  },
): {
  filtered: Accessor<T[]>;
  isPending: Accessor<boolean>;
} {
  const { delay = 300, filterOptions = {} } = options || {};
  const [debouncedExpr, setDebouncedExpr] = createSignal<Expression<T> | null>(null);
  const [isPending, setIsPending] = createSignal(false);

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  createMemo(() => {
    const expr = expression();
    setIsPending(true);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      setDebouncedExpr(() => expr);
      setIsPending(false);
    }, delay);
  });

  const filtered = createMemo(() => {
    const items = data();
    const expr = debouncedExpr();

    if (!expr || items.length === 0) {
      return items;
    }

    return filter(items, expr, filterOptions);
  });

  return { filtered, isPending };
}

export function usePaginatedFilter<T>(
  data: Accessor<T[]>,
  expression: Accessor<Expression<T> | null>,
  options?: {
    pageSize?: number;
    initialPage?: number;
    filterOptions?: FilterOptions;
  },
): {
  paginatedResults: Accessor<T[]>;
  currentPage: Accessor<number>;
  totalPages: Accessor<number>;
  pageSize: Accessor<number>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
} {
  const { pageSize: initialPageSize = 10, initialPage = 1, filterOptions = {} } = options || {};

  const [currentPage, setCurrentPage] = createSignal(initialPage);
  const [pageSize, setPageSizeSignal] = createSignal(initialPageSize);

  const filtered = createMemo(() => {
    const items = data();
    const expr = expression();

    if (!expr || items.length === 0) {
      return items;
    }

    return filter(items, expr, filterOptions);
  });

  const totalPages = createMemo(() => {
    const total = filtered().length;
    const size = pageSize();
    return Math.ceil(total / size);
  });

  const paginatedResults = createMemo(() => {
    const items = filtered();
    const page = currentPage();
    const size = pageSize();
    const start = (page - 1) * size;
    return items.slice(start, start + size);
  });

  const setPage = (page: number): void => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages())));
  };

  const setPageSize = (size: number): void => {
    setPageSizeSignal(Math.max(1, size));
    setCurrentPage(1);
  };

  const nextPage = (): void => {
    setPage(currentPage() + 1);
  };

  const prevPage = (): void => {
    setPage(currentPage() - 1);
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
