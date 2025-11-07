import { useState, useMemo, useCallback } from 'react';
import type { Expression, FilterOptions } from '../../types';
import type { UsePaginatedFilterResult } from './react.types';
import { DEFAULT_PAGE_SIZE, DEFAULT_INITIAL_PAGE } from './react.constants';
import {
  getPageData,
  createPaginationResult,
  validatePageNumber,
  validatePageSize,
} from '../shared';
import { useFilterCore, useIsFiltering } from './react.utils';

export function usePaginatedFilter<T>(
  data: T[],
  expression: Expression<T>,
  initialPageSize: number = DEFAULT_PAGE_SIZE,
  options?: FilterOptions,
): UsePaginatedFilterResult<T> {
  const [pg, setPg] = useState(DEFAULT_INITIAL_PAGE);
  const [sz, setSz] = useState(validatePageSize(initialPageSize));

  const filtered = useFilterCore(data, expression, options);
  const isFiltering = useIsFiltering(filtered, data);

  const pgState = useMemo(
    () => ({ currentPage: pg, pageSize: sz, totalItems: filtered.length }),
    [pg, sz, filtered.length],
  );
  const pgData = useMemo(() => getPageData(filtered, pg, sz), [filtered, pg, sz]);
  const pgResult = useMemo(
    () => createPaginationResult(pgData, filtered, pgState),
    [pgData, filtered, pgState],
  );

  const nextPage = useCallback(
    () => setPg((p) => validatePageNumber(p + 1, pgResult.totalPages)),
    [pgResult.totalPages],
  );
  const previousPage = useCallback(
    () => setPg((p) => validatePageNumber(p - 1, pgResult.totalPages)),
    [pgResult.totalPages],
  );
  const goToPage = useCallback(
    (p: number) => setPg(validatePageNumber(p, pgResult.totalPages)),
    [pgResult.totalPages],
  );
  const setPageSize = useCallback((s: number) => {
    setSz(validatePageSize(s));
    setPg(DEFAULT_INITIAL_PAGE);
  }, []);

  return { ...pgResult, filtered, isFiltering, nextPage, previousPage, goToPage, setPageSize };
}
