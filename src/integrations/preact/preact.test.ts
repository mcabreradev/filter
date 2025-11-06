/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/preact';
import { useFilter, useFilteredState, useDebouncedFilter, usePaginatedFilter } from './index';

interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

const mockUsers: User[] = [
  { id: 1, name: 'Alice', age: 30, active: true },
  { id: 2, name: 'Bob', age: 25, active: false },
  { id: 3, name: 'Charlie', age: 35, active: true },
  { id: 4, name: 'David', age: 28, active: false },
  { id: 5, name: 'Eve', age: 32, active: true },
];

describe('useFilter', () => {
  it('should filter data based on expression', () => {
    const { result } = renderHook(() => useFilter(mockUsers, { active: true }));

    expect(result.current.filtered).toHaveLength(3);
    expect(result.current.filtered.every((u) => u.active)).toBe(true);
    expect(result.current.isFiltering).toBe(true);
  });

  it('should return all data when expression is null', () => {
    const { result } = renderHook(() => useFilter(mockUsers, null));

    expect(result.current.filtered).toHaveLength(5);
    expect(result.current.isFiltering).toBe(false);
  });

  it('should update when data changes', () => {
    const { result, rerender } = renderHook(({ data }) => useFilter(data, { active: true }), {
      initialProps: { data: mockUsers },
    });

    expect(result.current.filtered).toHaveLength(3);

    rerender({ data: mockUsers.slice(0, 2) });
    expect(result.current.filtered).toHaveLength(1);
  });

  it('should update when expression changes', () => {
    const { result, rerender } = renderHook(
      ({ expression }) => useFilter(mockUsers, expression),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { initialProps: { expression: { active: true } as any } },
    );

    expect(result.current.filtered).toHaveLength(3);

    rerender({ expression: { age: { $gte: 30 } } });
    expect(result.current.filtered).toHaveLength(3);
    expect(result.current.filtered.every((u) => u.age >= 30)).toBe(true);
  });

  it('should apply filter options', () => {
    const { result } = renderHook(() =>
      useFilter(mockUsers, { name: 'alice' }, { caseSensitive: false }),
    );

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].name).toBe('Alice');
  });
});

describe('useFilteredState', () => {
  it('should manage filter state', () => {
    const { result } = renderHook(() => useFilteredState(mockUsers, { active: true }));

    expect(result.current.filtered).toHaveLength(3);
    expect(result.current.expression).toEqual({ active: true });
  });

  it('should update expression', () => {
    const { result } = renderHook(() => useFilteredState(mockUsers, { active: true }));

    act(() => {
      result.current.setExpression({ age: { $gte: 30 } });
    });

    expect(result.current.filtered).toHaveLength(3);
    expect(result.current.filtered.every((u) => u.age >= 30)).toBe(true);
    expect(result.current.expression).toEqual({ age: { $gte: 30 } });
  });

  it('should reset expression', () => {
    const { result } = renderHook(() => useFilteredState(mockUsers, { active: true }));

    act(() => {
      result.current.reset();
    });

    expect(result.current.filtered).toHaveLength(5);
    expect(result.current.expression).toBeNull();
  });

  it('should apply filter options', () => {
    const { result } = renderHook(() =>
      useFilteredState(mockUsers, { name: 'alice' }, { caseSensitive: false }),
    );

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].name).toBe('Alice');
  });
});

describe('useDebouncedFilter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.skip('should debounce filter updates', () => {
    const { result } = renderHook(() =>
      useDebouncedFilter(mockUsers, { active: true }, { delay: 300 }),
    );

    expect(result.current.isPending).toBe(true);
    expect(result.current.filtered).toHaveLength(5);

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.filtered).toHaveLength(3);
  });

  it('should cancel previous debounce when expression changes', () => {
    const { result, rerender } = renderHook(
      ({ expression }) => useDebouncedFilter(mockUsers, expression, { delay: 300 }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { initialProps: { expression: { active: true } as any } },
    );

    expect(result.current.isPending).toBe(true);

    act(() => {
      vi.advanceTimersByTime(150);
    });

    rerender({ expression: { age: { $gte: 30 } } });

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current.isPending).toBe(true);

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current.isPending).toBe(false);
    expect(result.current.filtered.every((u) => u.age >= 30)).toBe(true);
  });

  it('should apply filter options', () => {
    const { result } = renderHook(() =>
      useDebouncedFilter(
        mockUsers,
        { name: 'alice' },
        { delay: 300, filterOptions: { caseSensitive: false } },
      ),
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].name).toBe('Alice');
  });
});

describe('usePaginatedFilter', () => {
  it('should paginate filtered results', () => {
    const { result } = renderHook(() =>
      usePaginatedFilter(mockUsers, { active: true }, { pageSize: 2 }),
    );

    expect(result.current.paginatedResults).toHaveLength(2);

    act(() => {
      result.current.nextPage();
    });
    expect(result.current.paginatedResults).toHaveLength(1);
  });

  it('should calculate total pages correctly', () => {
    const { result } = renderHook(() => usePaginatedFilter(mockUsers, null, { pageSize: 2 }));

    expect(result.current.totalPages).toBe(3);

    act(() => {
      result.current.setPageSize(3);
    });
    expect(result.current.totalPages).toBe(2);
  });

  it('should navigate pages correctly', () => {
    const { result } = renderHook(() => usePaginatedFilter(mockUsers, null, { pageSize: 2 }));

    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.nextPage();
    });
    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.nextPage();
    });
    expect(result.current.currentPage).toBe(3);

    act(() => {
      result.current.nextPage();
    });
    expect(result.current.currentPage).toBe(3);

    act(() => {
      result.current.prevPage();
    });
    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.setPage(1);
    });
    expect(result.current.currentPage).toBe(1);
  });

  it('should reset to page 1 when page size changes', () => {
    const { result } = renderHook(() => usePaginatedFilter(mockUsers, null, { pageSize: 2 }));

    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.setPageSize(3);
    });
    expect(result.current.currentPage).toBe(1);
  });

  it('should apply filter options', () => {
    const { result } = renderHook(() =>
      usePaginatedFilter(
        mockUsers,
        { name: 'alice' },
        { pageSize: 2, filterOptions: { caseSensitive: false } },
      ),
    );

    expect(result.current.paginatedResults).toHaveLength(1);
    expect(result.current.paginatedResults[0].name).toBe('Alice');
  });
});
