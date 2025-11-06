import { describe, it, expect } from 'vitest';
import {
  filterLazy,
  filterLazyAsync,
  filterChunked,
  filterLazyChunked,
  filterFirst,
  filterExists,
  filterCount,
} from './filter-lazy';

describe('filterLazy', () => {
  const users = [
    { id: 1, name: 'Alice', age: 30, city: 'Berlin' },
    { id: 2, name: 'Bob', age: 25, city: 'London' },
    { id: 3, name: 'Charlie', age: 35, city: 'Berlin' },
    { id: 4, name: 'David', age: 28, city: 'Paris' },
    { id: 5, name: 'Eve', age: 32, city: 'Berlin' },
  ];

  describe('filterLazy - basic functionality', () => {
    it('should lazily filter items', () => {
      const result = filterLazy(users, { city: 'Berlin' });
      const array = Array.from(result);

      expect(array).toHaveLength(3);
      expect(array.map((u) => u.name)).toEqual(['Alice', 'Charlie', 'Eve']);
    });

    it('should work with string expressions', () => {
      const result = filterLazy(users, 'Berlin');
      const array = Array.from(result);

      expect(array).toHaveLength(3);
    });

    it('should work with predicate functions', () => {
      const result = filterLazy(users, (user) => user.age > 30);
      const array = Array.from(result);

      expect(array).toHaveLength(2);
      expect(array.map((u) => u.name)).toEqual(['Charlie', 'Eve']);
    });

    it('should work with operators', () => {
      const result = filterLazy(users, { age: { $gte: 30 } });
      const array = Array.from(result);

      expect(array).toHaveLength(3);
    });

    it('should be truly lazy and not process all items immediately', () => {
      let processedCount = 0;
      const largeArray = Array.from({ length: 10000 }, (_, i) => {
        processedCount++;
        return { id: i, value: i };
      });

      processedCount = 0;

      const result = filterLazy(largeArray, (item) => {
        processedCount++;
        return item.value < 5;
      });

      expect(processedCount).toBe(0);

      const iterator = result[Symbol.iterator]();
      iterator.next();

      expect(processedCount).toBeLessThan(10000);
    });

    it('should handle empty arrays', () => {
      const result = filterLazy([], { city: 'Berlin' });
      const array = Array.from(result);

      expect(array).toHaveLength(0);
    });

    it('should handle no matches', () => {
      const result = filterLazy(users, { city: 'Tokyo' });
      const array = Array.from(result);

      expect(array).toHaveLength(0);
    });
  });

  describe('filterLazyAsync', () => {
    async function* asyncIterable<T>(items: T[]): AsyncGenerator<T, void, undefined> {
      for (const item of items) {
        yield item;
      }
    }

    it('should lazily filter async iterables', async () => {
      const asyncUsers = asyncIterable(users);
      const result = filterLazyAsync(asyncUsers, { city: 'Berlin' });
      const array: typeof users = [];

      for await (const user of result) {
        array.push(user);
      }

      expect(array).toHaveLength(3);
      expect(array.map((u) => u.name)).toEqual(['Alice', 'Charlie', 'Eve']);
    });

    it('should work with async predicate-like expressions', async () => {
      const asyncUsers = asyncIterable(users);
      const result = filterLazyAsync(asyncUsers, (user) => user.age > 30);
      const array: typeof users = [];

      for await (const user of result) {
        array.push(user);
      }

      expect(array).toHaveLength(2);
    });
  });

  describe('filterChunked', () => {
    it('should return filtered results in chunks', () => {
      const chunks = filterChunked(users, { city: 'Berlin' }, 2);

      expect(chunks).toHaveLength(2);
      expect(chunks[0]).toHaveLength(2);
      expect(chunks[1]).toHaveLength(1);
    });

    it('should handle chunk size larger than results', () => {
      const chunks = filterChunked(users, { city: 'Berlin' }, 10);

      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toHaveLength(3);
    });

    it('should throw error for invalid array', () => {
      expect(() => filterChunked(null as unknown as User[], { city: 'Berlin' })).toThrow(
        'Expected array but received: object',
      );
    });

    it('should throw error for invalid chunk size', () => {
      expect(() => filterChunked(users, { city: 'Berlin' }, 0)).toThrow(
        'Chunk size must be positive',
      );

      expect(() => filterChunked(users, { city: 'Berlin' }, -5)).toThrow(
        'Chunk size must be positive',
      );
    });
  });

  describe('filterLazyChunked', () => {
    it('should lazily yield chunks', () => {
      const result = filterLazyChunked(users, { city: 'Berlin' }, 2);
      const chunks = Array.from(result);

      expect(chunks).toHaveLength(2);
      expect(chunks[0]).toHaveLength(2);
      expect(chunks[1]).toHaveLength(1);
    });

    it('should be truly lazy', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({ id: i, value: i }));

      let processedCount = 0;
      const result = filterLazyChunked(
        largeArray,
        (item) => {
          processedCount++;
          return item.value < 100;
        },
        10,
      );

      expect(processedCount).toBe(0);

      const iterator = result[Symbol.iterator]();
      iterator.next();

      expect(processedCount).toBeLessThan(10000);
    });
  });

  describe('filterFirst', () => {
    it('should return first N matching items', () => {
      const result = filterFirst(users, { city: 'Berlin' }, 2);

      expect(result).toHaveLength(2);
      expect(result.map((u) => u.name)).toEqual(['Alice', 'Charlie']);
    });

    it('should return all matches if count is larger', () => {
      const result = filterFirst(users, { city: 'Berlin' }, 10);

      expect(result).toHaveLength(3);
    });

    it('should return empty array if no matches', () => {
      const result = filterFirst(users, { city: 'Tokyo' }, 5);

      expect(result).toHaveLength(0);
    });

    it('should stop processing after finding required count', () => {
      let processedCount = 0;
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({ id: i, value: i }));

      const result = filterFirst(
        largeArray,
        (item) => {
          processedCount++;
          return item.value < 1000;
        },
        10,
      );

      expect(result).toHaveLength(10);
      expect(processedCount).toBeLessThan(100);
    });

    it('should throw error for invalid count', () => {
      expect(() => filterFirst(users, { city: 'Berlin' }, 0)).toThrow('Count must be positive');
      expect(() => filterFirst(users, { city: 'Berlin' }, -1)).toThrow('Count must be positive');
    });
  });

  describe('filterExists', () => {
    it('should return true if at least one match exists', () => {
      const result = filterExists(users, { city: 'Berlin' });

      expect(result).toBe(true);
    });

    it('should return false if no matches exist', () => {
      const result = filterExists(users, { city: 'Tokyo' });

      expect(result).toBe(false);
    });

    it('should stop processing after finding first match', () => {
      let processedCount = 0;
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({ id: i, value: i }));

      const result = filterExists(largeArray, (item) => {
        processedCount++;
        return item.value === 5000;
      });

      expect(result).toBe(true);
      expect(processedCount).toBeLessThan(10000);
    });
  });

  describe('filterCount', () => {
    it('should count matching items', () => {
      const result = filterCount(users, { city: 'Berlin' });

      expect(result).toBe(3);
    });

    it('should return 0 if no matches', () => {
      const result = filterCount(users, { city: 'Tokyo' });

      expect(result).toBe(0);
    });

    it('should count all matching items', () => {
      const result = filterCount(users, (user) => user.age >= 30);

      expect(result).toBe(3);
    });
  });

  describe('integration with options', () => {
    it('should respect caseSensitive option', () => {
      const result = filterLazy(users, 'berlin', { caseSensitive: true });
      const array = Array.from(result);

      expect(array).toHaveLength(0);
    });

    it('should work with custom comparator', () => {
      const result = filterLazy(users, 'Alice', {
        customComparator: (actual, expected) => actual === expected,
      });
      const array = Array.from(result);

      expect(array).toHaveLength(1);
    });
  });
});
