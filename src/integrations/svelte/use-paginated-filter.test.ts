import { describe, it, expect } from 'vitest';
import { writable, get } from 'svelte/store';
import { usePaginatedFilter } from './use-paginated-filter';

interface TestItem {
  id: number;
  name: string;
  active: boolean;
}

describe('usePaginatedFilter', () => {
  const testData: TestItem[] = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    active: i % 2 === 0,
  }));

  it('should paginate filtered data', () => {
    const data = writable(testData);
    const expression = writable(() => true);
    const { pagination } = usePaginatedFilter(data, expression, 10);

    const paginationValue = get(pagination);
    expect(paginationValue.data).toHaveLength(10);
    expect(paginationValue.currentPage).toBe(1);
    expect(paginationValue.totalPages).toBe(3);
    expect(paginationValue.totalItems).toBe(25);
  });

  it('should navigate to next page', () => {
    const data = writable(testData);
    const expression = writable(() => true);
    const { pagination, nextPage, currentPage } = usePaginatedFilter(data, expression, 10);

    nextPage();

    expect(get(currentPage)).toBe(2);
    expect(get(pagination).data[0].id).toBe(11);
  });

  it('should navigate to previous page', () => {
    const data = writable(testData);
    const expression = writable(() => true);
    const { previousPage, nextPage, currentPage } = usePaginatedFilter(data, expression, 10);

    nextPage();
    previousPage();

    expect(get(currentPage)).toBe(1);
  });

  it('should go to specific page', () => {
    const data = writable(testData);
    const expression = writable(() => true);
    const { pagination, goToPage, currentPage } = usePaginatedFilter(data, expression, 10);

    goToPage(3);

    expect(get(currentPage)).toBe(3);
    expect(get(pagination).data).toHaveLength(5);
  });

  it('should not exceed total pages', () => {
    const data = writable(testData);
    const expression = writable(() => true);
    const { goToPage, currentPage } = usePaginatedFilter(data, expression, 10);

    goToPage(10);

    expect(get(currentPage)).toBe(3);
  });

  it('should not go below page 1', () => {
    const data = writable(testData);
    const expression = writable(() => true);
    const { previousPage, currentPage } = usePaginatedFilter(data, expression, 10);

    previousPage();

    expect(get(currentPage)).toBe(1);
  });

  it('should change page size', () => {
    const data = writable(testData);
    const expression = writable(() => true);
    const { pagination, setPageSize, currentPage, pageSize } = usePaginatedFilter(
      data,
      expression,
      10,
    );

    setPageSize(5);

    expect(get(pageSize)).toBe(5);
    expect(get(pagination).data).toHaveLength(5);
    expect(get(pagination).totalPages).toBe(5);
    expect(get(currentPage)).toBe(1);
  });

  it('should filter and paginate', () => {
    const data = writable(testData);
    const expression = writable({ active: true });
    const { pagination, isFiltering } = usePaginatedFilter(data, expression, 5);

    const paginationValue = get(pagination);
    expect(paginationValue.totalItems).toBe(13);
    expect(paginationValue.totalPages).toBe(3);
    expect(get(isFiltering)).toBe(true);
  });

  it('should update pagination when filter changes', () => {
    const data = writable(testData);
    const expression = writable<{ active: boolean }>({ active: true });
    const { pagination } = usePaginatedFilter(data, expression, 5);

    expect(get(pagination).totalItems).toBe(13);

    expression.set({ active: false });

    expect(get(pagination).totalItems).toBe(12);
  });

  it('should indicate next page availability', () => {
    const data = writable(testData);
    const expression = writable(() => true);
    const { pagination, goToPage } = usePaginatedFilter(data, expression, 10);

    expect(get(pagination).hasNextPage).toBe(true);

    goToPage(3);

    expect(get(pagination).hasNextPage).toBe(false);
  });

  it('should indicate previous page availability', () => {
    const data = writable(testData);
    const expression = writable(() => true);
    const { pagination, nextPage } = usePaginatedFilter(data, expression, 10);

    expect(get(pagination).hasPreviousPage).toBe(false);

    nextPage();

    expect(get(pagination).hasPreviousPage).toBe(true);
  });

  it('should handle empty data', () => {
    const data = writable<TestItem[]>([]);
    const expression = writable(() => true);
    const { pagination } = usePaginatedFilter(data, expression, 10);

    const paginationValue = get(pagination);
    expect(paginationValue.data).toEqual([]);
    expect(paginationValue.totalPages).toBe(0);
    expect(paginationValue.totalItems).toBe(0);
  });

  it('should handle single page', () => {
    const smallData = testData.slice(0, 5);
    const data = writable(smallData);
    const expression = writable(() => true);
    const { pagination } = usePaginatedFilter(data, expression, 10);

    const paginationValue = get(pagination);
    expect(paginationValue.data).toHaveLength(5);
    expect(paginationValue.totalPages).toBe(1);
    expect(paginationValue.hasNextPage).toBe(false);
    expect(paginationValue.hasPreviousPage).toBe(false);
  });

  it('should validate page size', () => {
    const data = writable(testData);
    const expression = writable(() => true);
    const { pageSize } = usePaginatedFilter(data, expression, -5);

    expect(get(pageSize)).toBe(1);
  });

  it('should reset to page 1 when changing page size', () => {
    const data = writable(testData);
    const expression = writable(() => true);
    const { goToPage, setPageSize, currentPage } = usePaginatedFilter(data, expression, 10);

    goToPage(2);
    setPageSize(5);

    expect(get(currentPage)).toBe(1);
  });

  it('should work with non-store values', () => {
    const { pagination } = usePaginatedFilter(testData, () => true, 10);

    expect(get(pagination).data).toHaveLength(10);
  });
});
