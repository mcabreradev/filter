import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFilter } from './use-filter';

interface TestItem {
  id: number;
  name: string;
  active: boolean;
}

describe('useFilter', () => {
  const testData: TestItem[] = [
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false },
    { id: 3, name: 'Charlie', active: true },
  ];

  it('should filter data with string expression', () => {
    const { result } = renderHook(() => useFilter(testData, 'Alice'));

    expect(result.current.filtered).toEqual([{ id: 1, name: 'Alice', active: true }]);
    expect(result.current.isFiltering).toBe(true);
  });

  it('should filter data with object expression', () => {
    const { result } = renderHook(() => useFilter(testData, { active: true }));

    expect(result.current.filtered).toHaveLength(2);
    expect(result.current.isFiltering).toBe(true);
  });

  it('should filter data with predicate function', () => {
    const { result } = renderHook(() => useFilter(testData, (item) => item.id > 1));

    expect(result.current.filtered).toHaveLength(2);
    expect(result.current.isFiltering).toBe(true);
  });

  it('should return empty array for empty data', () => {
    const { result } = renderHook(() => useFilter([], 'test'));

    expect(result.current.filtered).toEqual([]);
    expect(result.current.isFiltering).toBe(false);
  });

  it('should handle invalid expression gracefully', () => {
    const { result } = renderHook(() => useFilter(testData, null as never));

    expect(result.current.filtered).toEqual([]);
  });

  it('should update when data changes', () => {
    const { result, rerender } = renderHook(
      ({ data }) => useFilter(data, { active: true }),
      { initialProps: { data: testData } },
    );

    expect(result.current.filtered).toHaveLength(2);

    const newData = [...testData, { id: 4, name: 'David', active: true }];
    rerender({ data: newData });

    expect(result.current.filtered).toHaveLength(3);
  });

  it('should update when expression changes', () => {
    const { result, rerender } = renderHook(
      ({ expression }) => useFilter(testData, expression),
      { initialProps: { expression: { active: true } as const } },
    );

    expect(result.current.filtered).toHaveLength(2);

    rerender({ expression: { active: false } });

    expect(result.current.filtered).toHaveLength(1);
  });

  it('should respect filter options', () => {
    const { result } = renderHook(() =>
      useFilter(testData, 'ALICE', { caseSensitive: true }),
    );

    expect(result.current.filtered).toEqual([]);
  });

  it('should indicate when not filtering', () => {
    const { result } = renderHook(() => useFilter(testData, () => true));

    expect(result.current.filtered).toHaveLength(3);
    expect(result.current.isFiltering).toBe(false);
  });
});

