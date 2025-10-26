import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
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
    const { result } = renderHook(() =>
      usePaginatedFilter(testData, () => true, 10),
    );

    expect(result.current.data).toHaveLength(10);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.totalItems).toBe(25);
  });

  it('should navigate to next page', () => {
    const { result } = renderHook(() =>
      usePaginatedFilter(testData, () => true, 10),
    );

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.data[0].id).toBe(11);
  });

  it('should navigate to previous page', () => {
    const { result } = renderHook(() =>
      usePaginatedFilter(testData, () => true, 10),
    );

    act(() => {
      result.current.nextPage();
      result.current.previousPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('should go to specific page', () => {
    const { result } = renderHook(() =>
      usePaginatedFilter(testData, () => true, 10),
    );

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.data).toHaveLength(5);
  });

  it('should not exceed total pages', () => {
    const { result } = renderHook(() =>
      usePaginatedFilter(testData, () => true, 10),
    );

    act(() => {
      result.current.goToPage(10);
    });

    expect(result.current.currentPage).toBe(3);
  });

  it('should not go below page 1', () => {
    const { result } = renderHook(() =>
      usePaginatedFilter(testData, () => true, 10),
    );

    act(() => {
      result.current.previousPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('should change page size', () => {
    const { result } = renderHook(() =>
      usePaginatedFilter(testData, () => true, 10),
    );

    act(() => {
      result.current.setPageSize(5);
    });

    expect(result.current.pageSize).toBe(5);
    expect(result.current.data).toHaveLength(5);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.currentPage).toBe(1);
  });

  it('should filter and paginate', () => {
    const { result } = renderHook(() =>
      usePaginatedFilter(testData, { active: true }, 5),
    );

    expect(result.current.totalItems).toBe(13);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.isFiltering).toBe(true);
  });

  it('should update pagination when filter changes', () => {
    const { result, rerender } = renderHook(
      ({ expression }) => usePaginatedFilter(testData, expression, 5),
      { initialProps: { expression: { active: true } as const } },
    );

    expect(result.current.totalItems).toBe(13);

    rerender({ expression: { active: false } });

    expect(result.current.totalItems).toBe(12);
  });

  it('should indicate next page availability', () => {
    const { result } = renderHook(() =>
      usePaginatedFilter(testData, () => true, 10),
    );

    expect(result.current.hasNextPage).toBe(true);

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.hasNextPage).toBe(false);
  });

  it('should indicate previous page availability', () => {
    const { result } = renderHook(() =>
      usePaginatedFilter(testData, () => true, 10),
    );

    expect(result.current.hasPreviousPage).toBe(false);

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.hasPreviousPage).toBe(true);
  });

  it('should handle empty data', () => {
    const { result } = renderHook(() => usePaginatedFilter([], () => true, 10));

    expect(result.current.data).toEqual([]);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.totalItems).toBe(0);
  });

  it('should handle single page', () => {
    const smallData = testData.slice(0, 5);
    const { result } = renderHook(() =>
      usePaginatedFilter(smallData, () => true, 10),
    );

    expect(result.current.data).toHaveLength(5);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(false);
  });

  it('should validate page size', () => {
    const { result } = renderHook(() =>
      usePaginatedFilter(testData, () => true, -5),
    );

    expect(result.current.pageSize).toBe(1);
  });

  it('should reset to page 1 when changing page size', () => {
    const { result } = renderHook(() =>
      usePaginatedFilter(testData, () => true, 10),
    );

    act(() => {
      result.current.goToPage(2);
      result.current.setPageSize(5);
    });

    expect(result.current.currentPage).toBe(1);
  });
});

