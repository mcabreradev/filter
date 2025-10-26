import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
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
    const { data, filtered, isFiltering } = useFilteredState<TestItem>();

    expect(get(data)).toEqual([]);
    expect(get(filtered)).toEqual([]);
    expect(get(isFiltering)).toBe(false);
  });

  it('should initialize with provided data', () => {
    const { data, filtered } = useFilteredState(testData);

    expect(get(data)).toEqual(testData);
    expect(get(filtered)).toEqual(testData);
  });

  it('should filter data with initial expression', () => {
    const { filtered, isFiltering } = useFilteredState(testData, { active: true });

    expect(get(filtered)).toHaveLength(2);
    expect(get(isFiltering)).toBe(true);
  });

  it('should update data', () => {
    const { data, filtered } = useFilteredState(testData);

    data.set([{ id: 4, name: 'David', active: false }]);

    expect(get(data)).toHaveLength(1);
    expect(get(data)[0].name).toBe('David');
    expect(get(filtered)).toHaveLength(1);
  });

  it('should update expression', () => {
    const { expression, filtered } = useFilteredState(testData, { active: true });

    expect(get(filtered)).toHaveLength(2);

    expression.set({ active: false });

    expect(get(filtered)).toHaveLength(1);
  });

  it('should update filtered results when data changes', () => {
    const { data, filtered } = useFilteredState(testData, { active: true });

    expect(get(filtered)).toHaveLength(2);

    data.set([...testData, { id: 4, name: 'David', active: true }]);

    expect(get(filtered)).toHaveLength(3);
  });

  it('should update filtered results when expression changes', () => {
    const { expression, filtered } = useFilteredState(testData);

    expect(get(filtered)).toHaveLength(3);

    expression.set('Alice');

    expect(get(filtered)).toHaveLength(1);
  });

  it('should handle predicate function expressions', () => {
    const { expression, filtered } = useFilteredState(testData, (item) => item.id > 1);

    expect(get(filtered)).toHaveLength(2);

    expression.set((item) => item.id === 1);

    expect(get(filtered)).toHaveLength(1);
  });

  it('should respect filter options', () => {
    const { filtered } = useFilteredState(testData, 'ALICE', {
      caseSensitive: true,
    });

    expect(get(filtered)).toEqual([]);
  });

  it('should handle empty data gracefully', () => {
    const { filtered, isFiltering } = useFilteredState([], 'test');

    expect(get(filtered)).toEqual([]);
    expect(get(isFiltering)).toBe(false);
  });

  it('should be reactive', () => {
    const { data, expression, filtered } = useFilteredState(testData);

    expect(get(filtered)).toHaveLength(3);

    expression.set({ active: true });
    expect(get(filtered)).toHaveLength(2);

    data.set(testData.slice(0, 1));
    expect(get(filtered)).toHaveLength(1);
  });
});
