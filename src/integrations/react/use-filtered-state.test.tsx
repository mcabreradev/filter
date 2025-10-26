import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilteredState } from './use-filtered-state';

interface TestItem {
  id: number;
  name: string;
  active: boolean;
}

describe('useFilteredState', () => {
  const testData: TestItem[] = [
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false },
    { id: 3, name: 'Charlie', active: true },
  ];

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFilteredState<TestItem>());

    expect(result.current.data).toEqual([]);
    expect(result.current.filtered).toEqual([]);
    expect(result.current.isFiltering).toBe(false);
  });

  it('should initialize with provided data', () => {
    const { result } = renderHook(() => useFilteredState(testData));

    expect(result.current.data).toEqual(testData);
    expect(result.current.filtered).toEqual(testData);
  });

  it('should filter data with initial expression', () => {
    const { result } = renderHook(() =>
      useFilteredState(testData, { active: true }),
    );

    expect(result.current.filtered).toHaveLength(2);
    expect(result.current.isFiltering).toBe(true);
  });

  it('should update data', () => {
    const { result } = renderHook(() => useFilteredState(testData));

    act(() => {
      result.current.setData([{ id: 4, name: 'David', active: false }]);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].name).toBe('David');
  });

  it('should update expression', () => {
    const { result } = renderHook(() =>
      useFilteredState(testData, { active: true }),
    );

    expect(result.current.filtered).toHaveLength(2);

    act(() => {
      result.current.setExpression({ active: false });
    });

    expect(result.current.filtered).toHaveLength(1);
  });

  it('should update filtered results when data changes', () => {
    const { result } = renderHook(() =>
      useFilteredState(testData, { active: true }),
    );

    expect(result.current.filtered).toHaveLength(2);

    act(() => {
      result.current.setData([...testData, { id: 4, name: 'David', active: true }]);
    });

    expect(result.current.filtered).toHaveLength(3);
  });

  it('should update filtered results when expression changes', () => {
    const { result } = renderHook(() => useFilteredState(testData));

    expect(result.current.filtered).toHaveLength(3);

    act(() => {
      result.current.setExpression('Alice');
    });

    expect(result.current.filtered).toHaveLength(1);
  });

  it('should handle predicate function expressions', () => {
    const { result } = renderHook(() =>
      useFilteredState(testData, (item) => item.id > 1),
    );

    expect(result.current.filtered).toHaveLength(2);

    act(() => {
      result.current.setExpression((item) => item.id === 1);
    });

    expect(result.current.filtered).toHaveLength(1);
  });

  it('should respect filter options', () => {
    const { result } = renderHook(() =>
      useFilteredState(testData, 'ALICE', { caseSensitive: true }),
    );

    expect(result.current.filtered).toEqual([]);
  });

  it('should handle empty data gracefully', () => {
    const { result } = renderHook(() => useFilteredState([], 'test'));

    expect(result.current.filtered).toEqual([]);
    expect(result.current.isFiltering).toBe(false);
  });

  it('should maintain stable setters', () => {
    const { result, rerender } = renderHook(() => useFilteredState(testData));

    const setDataRef = result.current.setData;
    const setExpressionRef = result.current.setExpression;

    rerender();

    expect(result.current.setData).toBe(setDataRef);
    expect(result.current.setExpression).toBe(setExpressionRef);
  });
});

