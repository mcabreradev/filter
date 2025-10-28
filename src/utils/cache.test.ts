import { describe, it, expect, beforeEach } from 'vitest';
import { FilterCache } from './cache';

describe('FilterCache', () => {
  let cache: FilterCache<{ id: number; name: string }>;

  beforeEach(() => {
    cache = new FilterCache();
  });

  it('stores and retrieves cached results', () => {
    const array = [{ id: 1, name: 'test' }];
    const result = [{ id: 1, name: 'test' }];
    const key = 'filter-key';

    cache.set(array, key, result);
    const retrieved = cache.get(array, key);

    expect(retrieved).toEqual(result);
  });

  it('returns undefined for non-existent cache entries', () => {
    const array = [{ id: 1, name: 'test' }];
    const retrieved = cache.get(array, 'non-existent-key');

    expect(retrieved).toBeUndefined();
  });

  it('handles multiple cache entries for same array', () => {
    const array = [{ id: 1, name: 'test' }];
    const result1 = [{ id: 1, name: 'test' }];
    const result2: typeof result1 = [];

    cache.set(array, 'key1', result1);
    cache.set(array, 'key2', result2);

    expect(cache.get(array, 'key1')).toEqual(result1);
    expect(cache.get(array, 'key2')).toEqual(result2);
  });

  it('differentiates between different array instances', () => {
    const array1 = [{ id: 1, name: 'test' }];
    const array2 = [{ id: 1, name: 'test' }];
    const result = [{ id: 1, name: 'test' }];

    cache.set(array1, 'key', result);

    expect(cache.get(array1, 'key')).toEqual(result);
    expect(cache.get(array2, 'key')).toBeUndefined();
  });

  it('clears all cache entries', () => {
    const array = [{ id: 1, name: 'test' }];
    const result = [{ id: 1, name: 'test' }];

    cache.set(array, 'key', result);
    expect(cache.get(array, 'key')).toEqual(result);

    cache.clear();
    expect(cache.get(array, 'key')).toBeUndefined();
  });
});
