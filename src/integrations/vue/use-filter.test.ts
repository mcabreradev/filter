import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
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
    const data = ref(testData);
    const expression = ref('Alice');
    const { filtered, isFiltering } = useFilter(data, expression);

    expect(filtered.value).toEqual([{ id: 1, name: 'Alice', active: true }]);
    expect(isFiltering.value).toBe(true);
  });

  it('should filter data with object expression', () => {
    const data = ref(testData);
    const expression = ref({ active: true });
    const { filtered, isFiltering } = useFilter(data, expression);

    expect(filtered.value).toHaveLength(2);
    expect(isFiltering.value).toBe(true);
  });

  it('should filter data with predicate function', () => {
    const data = ref(testData);
    const expression = ref((item: TestItem) => item.id > 1);
    const { filtered } = useFilter(data, expression);

    expect(filtered.value).toHaveLength(2);
  });

  it('should return empty array for empty data', () => {
    const data = ref<TestItem[]>([]);
    const expression = ref('test');
    const { filtered, isFiltering } = useFilter(data, expression);

    expect(filtered.value).toEqual([]);
    expect(isFiltering.value).toBe(false);
  });

  it('should handle invalid expression gracefully', () => {
    const data = ref(testData);
    const expression = ref(null as never);
    const { filtered } = useFilter(data, expression);

    expect(filtered.value).toEqual([]);
  });

  it('should react to data changes', () => {
    const data = ref(testData);
    const expression = ref({ active: true });
    const { filtered } = useFilter(data, expression);

    expect(filtered.value).toHaveLength(2);

    data.value = [...testData, { id: 4, name: 'David', active: true }];

    expect(filtered.value).toHaveLength(3);
  });

  it('should react to expression changes', () => {
    const data = ref(testData);
    const expression = ref<Expression<TestItem>>({ active: true });
    const { filtered } = useFilter(data, expression);

    expect(filtered.value).toHaveLength(2);

    expression.value = { active: false };

    expect(filtered.value).toHaveLength(1);
  });

  it('should respect filter options', () => {
    const data = ref(testData);
    const expression = ref('ALICE');
    const options = ref({ caseSensitive: true });
    const { filtered } = useFilter(data, expression, options);

    expect(filtered.value).toEqual([]);
  });

  it('should work with non-ref values', () => {
    const { filtered } = useFilter(testData, 'Alice');

    expect(filtered.value).toHaveLength(1);
  });

  it('should indicate when not filtering', () => {
    const data = ref(testData);
    const expression = ref(() => true);
    const { filtered, isFiltering } = useFilter(data, expression);

    expect(filtered.value).toHaveLength(3);
    expect(isFiltering.value).toBe(false);
  });
});
