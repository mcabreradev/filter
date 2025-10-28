import { describe, it, expect, beforeEach } from 'vitest';
import { filter, clearFilterCache, getFilterCacheStats } from '../src';

describe('Memoization Integration', () => {
  interface TestItem {
    id: number;
    name: string;
    age: number;
    tags: string[];
  }

  const testData: TestItem[] = [
    { id: 1, name: 'Alice', age: 25, tags: ['javascript', 'react'] },
    { id: 2, name: 'Bob', age: 30, tags: ['typescript', 'node'] },
    { id: 3, name: 'Charlie', age: 35, tags: ['python', 'django'] },
    { id: 4, name: 'David', age: 28, tags: ['javascript', 'vue'] },
    { id: 5, name: 'Eve', age: 32, tags: ['rust', 'go'] },
  ];

  beforeEach(() => {
    clearFilterCache();
  });

  describe('result caching', () => {
    it('caches filter results when enableCache is true', () => {
      const expression = { age: { $gte: 30 } };

      const result1 = filter(testData, expression, { enableCache: true });
      const result2 = filter(testData, expression, { enableCache: true });

      expect(result1).toEqual(result2);
      expect(result1.length).toBe(3);
    });

    it('does not cache when enableCache is false', () => {
      const expression = { age: { $gte: 30 } };

      const result1 = filter(testData, expression, { enableCache: false });
      const result2 = filter(testData, expression, { enableCache: false });

      expect(result1).toEqual(result2);
    });

    it('caches different expressions separately', () => {
      const expr1 = { age: { $gte: 30 } };
      const expr2 = { age: { $lt: 30 } };

      const result1 = filter(testData, expr1, { enableCache: true });
      const result2 = filter(testData, expr2, { enableCache: true });

      expect(result1.length).toBe(3);
      expect(result2.length).toBe(2);
    });

    it('respects case sensitivity in cache keys', () => {
      const expression = { name: 'alice' };

      const result1 = filter(testData, expression, { enableCache: true, caseSensitive: false });
      const result2 = filter(testData, expression, { enableCache: true, caseSensitive: true });

      expect(result1.length).toBe(1);
      expect(result2.length).toBe(0);
    });
  });

  describe('predicate caching', () => {
    it('caches predicate functions', () => {
      const expression = { tags: { $contains: 'javascript' } };

      filter(testData, expression, { enableCache: true });
      const stats1 = getFilterCacheStats();

      filter(testData, expression, { enableCache: true });
      const stats2 = getFilterCacheStats();

      expect(stats2.predicateCacheSize).toBeGreaterThanOrEqual(stats1.predicateCacheSize);
    });
  });

  describe('regex caching', () => {
    it('caches regex patterns', () => {
      const expression = { name: { $regex: '^A' } };

      const result1 = filter(testData, expression, { enableCache: true });
      const result2 = filter(testData, expression, { enableCache: true });

      expect(result1).toEqual(result2);
      expect(result1.length).toBe(1);
      expect(result1[0].name).toBe('Alice');
    });

    it('caches regex with different flags separately', () => {
      const expr1 = { name: { $regex: 'alice' } };
      const expr2 = { name: { $regex: 'alice' } };

      const result1 = filter(testData, expr1, { enableCache: true, caseSensitive: false });
      const result2 = filter(testData, expr2, { enableCache: true, caseSensitive: true });

      expect(result1.length).toBe(1);
      expect(result2.length).toBe(0);
    });
  });

  describe('cache clearing', () => {
    it('clears all caches', () => {
      const expression = { age: { $gte: 30 } };

      filter(testData, expression, { enableCache: true });
      clearFilterCache();

      const stats = getFilterCacheStats();
      expect(stats.predicateCacheSize).toBe(0);
      expect(stats.regexCacheSize).toBe(0);
    });
  });

  describe('complex expressions', () => {
    it('caches complex nested expressions', () => {
      const expression = {
        $and: [{ age: { $gte: 25 } }, { tags: { $contains: 'javascript' } }],
      };

      const result1 = filter(testData, expression, { enableCache: true });
      const result2 = filter(testData, expression, { enableCache: true });

      expect(result1).toEqual(result2);
      expect(result1.length).toBe(2);
    });

    it('handles array expressions', () => {
      const expression = {
        tags: { $in: ['javascript', 'typescript'] },
      };

      const result1 = filter(testData, expression, { enableCache: true });
      const result2 = filter(testData, expression, { enableCache: true });

      expect(result1).toEqual(result2);
      expect(result1.length).toBe(3);
    });
  });

  describe('performance', () => {
    it('improves performance on repeated queries', () => {
      const largeData = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        age: 20 + (i % 50),
        tags: ['tag1', 'tag2'],
      }));

      const expression = { age: { $gte: 40, $lte: 50 } };

      const start1 = performance.now();
      filter(largeData, expression, { enableCache: true });
      const time1 = performance.now() - start1;

      const start2 = performance.now();
      filter(largeData, expression, { enableCache: true });
      const time2 = performance.now() - start2;

      expect(time2).toBeLessThan(time1);
    });
  });
});
