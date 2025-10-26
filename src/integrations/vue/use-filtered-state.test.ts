import { describe, it, expect } from 'vitest';
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

    expect(data.value).toEqual([]);
    expect(filtered.value).toEqual([]);
    expect(isFiltering.value).toBe(false);
  });

  it('should initialize with provided data', () => {
    const { data, filtered } = useFilteredState(testData);

    expect(data.value).toEqual(testData);
    expect(filtered.value).toEqual(testData);
  });

  it('should filter data with initial expression', () => {
    const { filtered, isFiltering } = useFilteredState(testData, { active: true });

    expect(filtered.value).toHaveLength(2);
    expect(isFiltering.value).toBe(true);
  });

  it('should update data', () => {
    const { data, filtered } = useFilteredState(testData);

    data.value = [{ id: 4, name: 'David', active: false }];

    expect(data.value).toHaveLength(1);
    expect(data.value[0].name).toBe('David');
    expect(filtered.value).toHaveLength(1);
  });

  it('should update expression', () => {
    const { expression, filtered } = useFilteredState(testData, { active: true });

    expect(filtered.value).toHaveLength(2);

    expression.value = { active: false };

    expect(filtered.value).toHaveLength(1);
  });

  it('should update filtered results when data changes', () => {
    const { data, filtered } = useFilteredState(testData, { active: true });

    expect(filtered.value).toHaveLength(2);

    data.value = [...testData, { id: 4, name: 'David', active: true }];

    expect(filtered.value).toHaveLength(3);
  });

  it('should update filtered results when expression changes', () => {
    const { expression, filtered } = useFilteredState(testData);

    expect(filtered.value).toHaveLength(3);

    expression.value = 'Alice';

    expect(filtered.value).toHaveLength(1);
  });

  it('should handle predicate function expressions', () => {
    const { expression, filtered } = useFilteredState(testData, (item) => item.id > 1);

    expect(filtered.value).toHaveLength(2);

    expression.value = (item) => item.id === 1;

    expect(filtered.value).toHaveLength(1);
  });

  it('should respect filter options', () => {
    const { filtered } = useFilteredState(testData, 'ALICE', {
      caseSensitive: true,
    });

    expect(filtered.value).toEqual([]);
  });

  it('should handle empty data gracefully', () => {
    const { filtered, isFiltering } = useFilteredState([], 'test');

    expect(filtered.value).toEqual([]);
    expect(isFiltering.value).toBe(false);
  });

  it('should be reactive', () => {
    const { data, expression, filtered } = useFilteredState(testData);

    expect(filtered.value).toHaveLength(3);

    expression.value = { active: true };
    expect(filtered.value).toHaveLength(2);

    data.value = testData.slice(0, 1);
    expect(filtered.value).toHaveLength(1);
  });
});
