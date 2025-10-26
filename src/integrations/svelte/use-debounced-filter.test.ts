import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { writable, get } from 'svelte/store';
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

  it('should debounce filter expression changes', () => {
    const data = writable(testData);
    const expression = writable('Alice');
    const { filtered, isPending } = useDebouncedFilter(data, expression, {
      delay: 300,
    });

    expect(get(isPending)).toBe(true);

    vi.advanceTimersByTime(300);

    expect(get(isPending)).toBe(false);
    expect(get(filtered)).toHaveLength(1);

    expression.set('Bob');
    expect(get(isPending)).toBe(true);

    vi.advanceTimersByTime(300);

    expect(get(isPending)).toBe(false);
    expect(get(filtered)).toHaveLength(1);
    expect(get(filtered)[0].name).toBe('Bob');
  });

  it('should use default delay', () => {
    const data = writable(testData);
    const expression = writable('Alice');
    const { filtered, isPending } = useDebouncedFilter(data, expression);

    expect(get(isPending)).toBe(true);

    vi.advanceTimersByTime(300);

    expect(get(isPending)).toBe(false);
    expect(get(filtered)).toHaveLength(1);
  });

  it('should handle rapid expression changes', () => {
    const data = writable(testData);
    const expression = writable('Alice');
    const { filtered, isPending } = useDebouncedFilter(data, expression, {
      delay: 300,
    });

    expression.set('Bob');
    vi.advanceTimersByTime(100);

    expression.set('Charlie');
    vi.advanceTimersByTime(100);

    expression.set('Alice');
    vi.advanceTimersByTime(300);

    expect(get(isPending)).toBe(false);
    expect(get(filtered)).toHaveLength(1);
    expect(get(filtered)[0].name).toBe('Alice');
  });

  it('should handle object expressions', () => {
    const data = writable(testData);
    const expression = writable({ active: true });
    const { filtered } = useDebouncedFilter(data, expression, { delay: 300 });

    vi.advanceTimersByTime(300);

    expect(get(filtered)).toHaveLength(2);
  });

  it('should handle predicate functions', () => {
    const data = writable(testData);
    const expression = writable((item: TestItem) => item.id > 1);
    const { filtered } = useDebouncedFilter(data, expression, { delay: 300 });

    vi.advanceTimersByTime(300);

    expect(get(filtered)).toHaveLength(2);
  });

  it('should respect filter options', () => {
    const data = writable(testData);
    const expression = writable('ALICE');
    const { filtered } = useDebouncedFilter(data, expression, {
      delay: 300,
      caseSensitive: true,
    });

    vi.advanceTimersByTime(300);

    expect(get(filtered)).toEqual([]);
  });

  it('should handle empty data', () => {
    const data = writable<TestItem[]>([]);
    const expression = writable('test');
    const { filtered } = useDebouncedFilter(data, expression, { delay: 300 });

    vi.advanceTimersByTime(300);

    expect(get(filtered)).toEqual([]);
  });

  it('should indicate filtering status', () => {
    const data = writable(testData);
    const expression = writable({ active: true });
    const { isFiltering } = useDebouncedFilter(data, expression, { delay: 300 });

    vi.advanceTimersByTime(300);

    expect(get(isFiltering)).toBe(true);
  });

  it('should work with non-store values', () => {
    const expression = writable('Alice');
    const { filtered } = useDebouncedFilter(testData, expression, { delay: 300 });

    vi.advanceTimersByTime(300);

    expect(get(filtered)).toHaveLength(1);
  });
});
