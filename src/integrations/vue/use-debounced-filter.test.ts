import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref, nextTick, effectScope, type EffectScope } from 'vue';
import { useDebouncedFilter } from './use-debounced-filter';

interface TestItem {
  id: number;
  name: string;
  active: boolean;
}

// Helper function to run composable within an effect scope
function withSetup<T>(composable: () => T): [T, EffectScope] {
  const scope = effectScope();
  const result = scope.run(() => composable())!;
  return [result, scope];
}

describe('useDebouncedFilter', () => {
  let scopes: EffectScope[] = [];
  const testData: TestItem[] = [
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false },
    { id: 3, name: 'Charlie', active: true },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    scopes.forEach((scope) => scope.stop());
    scopes = [];
    vi.restoreAllMocks();
  });

  it('should debounce filter expression changes', async () => {
    const data = ref(testData);
    const expression = ref('Alice');
    const [{ filtered, isPending }, scope] = withSetup(() =>
      useDebouncedFilter(data, expression, {
        delay: 300,
      }),
    );
    scopes.push(scope);

    await nextTick();
    expect(isPending.value).toBe(false);

    expression.value = 'Bob';
    await nextTick();
    expect(isPending.value).toBe(true);

    vi.advanceTimersByTime(300);
    await nextTick();

    expect(isPending.value).toBe(false);
    expect(filtered.value).toHaveLength(1);
    expect(filtered.value[0].name).toBe('Bob');
  });

  it('should use default delay', async () => {
    const data = ref(testData);
    const expression = ref('Alice');
    const [{ filtered, isPending }, scope] = withSetup(() => useDebouncedFilter(data, expression));
    scopes.push(scope);

    expression.value = 'Bob';
    await nextTick();
    expect(isPending.value).toBe(true);

    vi.advanceTimersByTime(300);
    await nextTick();

    expect(isPending.value).toBe(false);
    expect(filtered.value).toHaveLength(1);
  });

  it('should handle rapid expression changes', async () => {
    const data = ref(testData);
    const expression = ref('Alice');
    const [{ filtered, isPending }, scope] = withSetup(() =>
      useDebouncedFilter(data, expression, {
        delay: 300,
      }),
    );
    scopes.push(scope);

    expression.value = 'Bob';
    await nextTick();
    vi.advanceTimersByTime(100);

    expression.value = 'Charlie';
    await nextTick();
    vi.advanceTimersByTime(100);

    expression.value = 'Alice';
    await nextTick();
    vi.advanceTimersByTime(300);
    await nextTick();

    expect(isPending.value).toBe(false);
    expect(filtered.value).toHaveLength(1);
    expect(filtered.value[0].name).toBe('Alice');
  });

  it('should handle object expressions', async () => {
    const data = ref(testData);
    const expression = ref({ active: true });
    const [{ filtered }, scope] = withSetup(() =>
      useDebouncedFilter(data, expression, { delay: 300 }),
    );
    scopes.push(scope);

    vi.advanceTimersByTime(300);
    await nextTick();

    expect(filtered.value).toHaveLength(2);
  });

  it('should handle predicate functions', async () => {
    const data = ref(testData);
    const expression = ref((item: TestItem) => item.id > 1);
    const [{ filtered }, scope] = withSetup(() =>
      useDebouncedFilter(data, expression, { delay: 300 }),
    );
    scopes.push(scope);

    vi.advanceTimersByTime(300);
    await nextTick();

    expect(filtered.value).toHaveLength(2);
  });

  it('should respect filter options', async () => {
    const data = ref(testData);
    const expression = ref('ALICE');
    const [{ filtered }, scope] = withSetup(() =>
      useDebouncedFilter(data, expression, {
        delay: 300,
        caseSensitive: true,
      }),
    );
    scopes.push(scope);

    vi.advanceTimersByTime(300);
    await nextTick();

    expect(filtered.value).toEqual([]);
  });

  it('should handle empty data', async () => {
    const data = ref<TestItem[]>([]);
    const expression = ref('test');
    const [{ filtered }, scope] = withSetup(() =>
      useDebouncedFilter(data, expression, { delay: 300 }),
    );
    scopes.push(scope);

    vi.advanceTimersByTime(300);
    await nextTick();

    expect(filtered.value).toEqual([]);
  });

  it('should indicate filtering status', async () => {
    const data = ref(testData);
    const expression = ref({ active: true });
    const [{ isFiltering }, scope] = withSetup(() =>
      useDebouncedFilter(data, expression, { delay: 300 }),
    );
    scopes.push(scope);

    vi.advanceTimersByTime(300);
    await nextTick();

    expect(isFiltering.value).toBe(true);
  });

  it('should work with non-ref values', async () => {
    const expression = ref('Alice');
    const [{ filtered }, scope] = withSetup(() =>
      useDebouncedFilter(testData, expression, { delay: 300 }),
    );
    scopes.push(scope);

    vi.advanceTimersByTime(300);
    await nextTick();

    expect(filtered.value).toHaveLength(1);
  });
});
