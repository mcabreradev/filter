import { describe, it, expect } from 'vitest';
import { writable, get } from 'svelte/store';
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
    const data = writable(testData);
    const expression = writable('Alice');
    const { filtered, isFiltering } = useFilter(data, expression);

    expect(get(filtered)).toEqual([{ id: 1, name: 'Alice', active: true }]);
    expect(get(isFiltering)).toBe(true);
  });

  it('should filter data with object expression', () => {
    const data = writable(testData);
    const expression = writable({ active: true });
    const { filtered, isFiltering } = useFilter(data, expression);

    expect(get(filtered)).toHaveLength(2);
    expect(get(isFiltering)).toBe(true);
  });

  it('should filter data with predicate function', () => {
    const data = writable(testData);
    const expression = writable((item: TestItem) => item.id > 1);
    const { filtered } = useFilter(data, expression);

    expect(get(filtered)).toHaveLength(2);
  });

  it('should return empty array for empty data', () => {
    const data = writable<TestItem[]>([]);
    const expression = writable('test');
    const { filtered, isFiltering } = useFilter(data, expression);

    expect(get(filtered)).toEqual([]);
    expect(get(isFiltering)).toBe(false);
  });

  it('should handle invalid expression gracefully', () => {
    const data = writable(testData);
    const expression = writable(null as never);
    const { filtered } = useFilter(data, expression);

    expect(get(filtered)).toEqual([]);
  });

  it('should react to data changes', () => {
    const data = writable(testData);
    const expression = writable({ active: true });
    const { filtered } = useFilter(data, expression);

    expect(get(filtered)).toHaveLength(2);

    data.set([...testData, { id: 4, name: 'David', active: true }]);

    expect(get(filtered)).toHaveLength(3);
  });

  it('should react to expression changes', () => {
    const data = writable(testData);
    const expression = writable<Expression<TestItem>>({ active: true });
    const { filtered } = useFilter(data, expression);

    expect(get(filtered)).toHaveLength(2);

    expression.set({ active: false });

    expect(get(filtered)).toHaveLength(1);
  });

  it('should respect filter options', () => {
    const data = writable(testData);
    const expression = writable('ALICE');
    const { filtered } = useFilter(data, expression, { caseSensitive: true });

    expect(get(filtered)).toEqual([]);
  });

  it('should work with non-store values', () => {
    const { filtered } = useFilter(testData, 'Alice');

    expect(get(filtered)).toHaveLength(1);
  });

  it('should indicate when not filtering', () => {
    const data = writable(testData);
    const expression = writable(() => true);
    const { filtered, isFiltering } = useFilter(data, expression);

    expect(get(filtered)).toHaveLength(3);
    expect(get(isFiltering)).toBe(false);
  });
});
