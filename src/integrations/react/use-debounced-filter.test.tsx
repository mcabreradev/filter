import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebouncedFilter } from './use-debounced-filter';

interface TestItem {
  id: number;
  name: string;
  active: boolean;
}

describe('useDebouncedFilter', () => {
  const testData: TestItem[] = [
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false },
    { id: 3, name: 'Charlie', active: true },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should debounce filter expression changes', async () => {
    const { result, rerender } = renderHook(
      ({ expression }) => useDebouncedFilter(testData, expression, { delay: 300 }),
      { initialProps: { expression: 'Alice' as const } },
    );

    expect(result.current.isPending).toBe(true);

    vi.advanceTimersByTime(300);
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.filtered).toHaveLength(1);

    rerender({ expression: 'Bob' });
    expect(result.current.isPending).toBe(true);

    vi.advanceTimersByTime(300);
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].name).toBe('Bob');
  });

  it('should use default delay', async () => {
    const { result } = renderHook(() => useDebouncedFilter(testData, 'Alice'));

    expect(result.current.isPending).toBe(true);

    vi.advanceTimersByTime(300);
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.filtered).toHaveLength(1);
  });

  it('should cancel pending debounce on unmount', () => {
    const { unmount } = renderHook(() => useDebouncedFilter(testData, 'Alice'));

    unmount();

    vi.advanceTimersByTime(300);
  });

  it('should handle rapid expression changes', async () => {
    const { result, rerender } = renderHook(
      ({ expression }) => useDebouncedFilter(testData, expression, { delay: 300 }),
      { initialProps: { expression: 'Alice' as const } },
    );

    rerender({ expression: 'Bob' });
    vi.advanceTimersByTime(100);

    rerender({ expression: 'Charlie' });
    vi.advanceTimersByTime(100);

    rerender({ expression: 'Alice' });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].name).toBe('Alice');
  });

  it('should handle object expressions', async () => {
    const { result } = renderHook(() =>
      useDebouncedFilter(testData, { active: true }, { delay: 300 }),
    );

    vi.advanceTimersByTime(300);
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.filtered).toHaveLength(2);
  });

  it('should handle predicate functions', async () => {
    const { result } = renderHook(() =>
      useDebouncedFilter(testData, (item) => item.id > 1, { delay: 300 }),
    );

    vi.advanceTimersByTime(300);
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.filtered).toHaveLength(2);
  });

  it('should respect filter options', async () => {
    const { result } = renderHook(() =>
      useDebouncedFilter(testData, 'ALICE', { delay: 300, caseSensitive: true }),
    );

    vi.advanceTimersByTime(300);
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.filtered).toEqual([]);
  });

  it('should handle empty data', async () => {
    const { result } = renderHook(() =>
      useDebouncedFilter([], 'test', { delay: 300 }),
    );

    vi.advanceTimersByTime(300);
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.filtered).toEqual([]);
  });

  it('should indicate filtering status', async () => {
    const { result } = renderHook(() =>
      useDebouncedFilter(testData, { active: true }, { delay: 300 }),
    );

    vi.advanceTimersByTime(300);
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isFiltering).toBe(true);
  });
});

