import { describe, it, expect } from 'vitest';
import {
  take,
  skip,
  map,
  reduce,
  toArray,
  forEach,
  every,
  some,
  find,
  chunk,
  flatten,
} from './lazy-iterators';

describe('Lazy Iterator Utilities', () => {
  describe('take', () => {
    it('should take first N items', () => {
      const items = [1, 2, 3, 4, 5];
      const result = toArray(take(items, 3));

      expect(result).toEqual([1, 2, 3]);
    });

    it('should return all items if count is larger', () => {
      const items = [1, 2, 3];
      const result = toArray(take(items, 10));

      expect(result).toEqual([1, 2, 3]);
    });

    it('should return empty for count 0', () => {
      const items = [1, 2, 3];
      const result = toArray(take(items, 0));

      expect(result).toEqual([]);
    });

    it('should be lazy', () => {
      let processedCount = 0;
      function* generator() {
        for (let i = 0; i < 1000; i++) {
          processedCount++;
          yield i;
        }
      }

      const result = take(generator(), 5);
      processedCount = 0;

      toArray(result);

      expect(processedCount).toBe(5);
    });
  });

  describe('skip', () => {
    it('should skip first N items', () => {
      const items = [1, 2, 3, 4, 5];
      const result = toArray(skip(items, 2));

      expect(result).toEqual([3, 4, 5]);
    });

    it('should return empty if skip count is larger', () => {
      const items = [1, 2, 3];
      const result = toArray(skip(items, 10));

      expect(result).toEqual([]);
    });

    it('should return all items if skip is 0', () => {
      const items = [1, 2, 3];
      const result = toArray(skip(items, 0));

      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('map', () => {
    it('should transform items', () => {
      const items = [1, 2, 3];
      const result = toArray(map(items, (x) => x * 2));

      expect(result).toEqual([2, 4, 6]);
    });

    it('should provide index to mapper', () => {
      const items = ['a', 'b', 'c'];
      const result = toArray(map(items, (x, i) => `${x}-${i}`));

      expect(result).toEqual(['a-0', 'b-1', 'c-2']);
    });

    it('should be lazy', () => {
      let processedCount = 0;
      const items = Array.from({ length: 1000 }, (_, i) => i);

      const mapped = map(items, (x) => {
        processedCount++;
        return x * 2;
      });

      expect(processedCount).toBe(0);

      toArray(take(mapped, 5));

      expect(processedCount).toBe(5);
    });
  });

  describe('reduce', () => {
    it('should reduce items to single value', () => {
      const items = [1, 2, 3, 4];
      const result = reduce(items, (acc, x) => acc + x, 0);

      expect(result).toBe(10);
    });

    it('should provide index to reducer', () => {
      const items = [1, 2, 3];
      const result = reduce(items, (acc, x, i) => acc + x + i, 0);

      expect(result).toBe(9);
    });
  });

  describe('forEach', () => {
    it('should iterate over all items', () => {
      const items = [1, 2, 3];
      const results: number[] = [];

      forEach(items, (x) => results.push(x * 2));

      expect(results).toEqual([2, 4, 6]);
    });

    it('should provide index to callback', () => {
      const items = ['a', 'b', 'c'];
      const results: string[] = [];

      forEach(items, (x, i) => results.push(`${x}-${i}`));

      expect(results).toEqual(['a-0', 'b-1', 'c-2']);
    });
  });

  describe('every', () => {
    it('should return true if all items match', () => {
      const items = [2, 4, 6, 8];
      const result = every(items, (x) => x % 2 === 0);

      expect(result).toBe(true);
    });

    it('should return false if any item does not match', () => {
      const items = [2, 4, 5, 8];
      const result = every(items, (x) => x % 2 === 0);

      expect(result).toBe(false);
    });

    it('should short-circuit on first false', () => {
      let processedCount = 0;
      const items = Array.from({ length: 1000 }, (_, i) => i);

      const result = every(items, (x) => {
        processedCount++;
        return x < 5;
      });

      expect(result).toBe(false);
      expect(processedCount).toBe(6);
    });
  });

  describe('some', () => {
    it('should return true if any item matches', () => {
      const items = [1, 3, 5, 8];
      const result = some(items, (x) => x % 2 === 0);

      expect(result).toBe(true);
    });

    it('should return false if no items match', () => {
      const items = [1, 3, 5, 7];
      const result = some(items, (x) => x % 2 === 0);

      expect(result).toBe(false);
    });

    it('should short-circuit on first true', () => {
      let processedCount = 0;
      const items = Array.from({ length: 1000 }, (_, i) => i);

      const result = some(items, (x) => {
        processedCount++;
        return x === 5;
      });

      expect(result).toBe(true);
      expect(processedCount).toBe(6);
    });
  });

  describe('find', () => {
    it('should return first matching item', () => {
      const items = [1, 2, 3, 4, 5];
      const result = find(items, (x) => x > 2);

      expect(result).toBe(3);
    });

    it('should return undefined if no match', () => {
      const items = [1, 2, 3];
      const result = find(items, (x) => x > 10);

      expect(result).toBeUndefined();
    });

    it('should short-circuit on first match', () => {
      let processedCount = 0;
      const items = Array.from({ length: 1000 }, (_, i) => i);

      const result = find(items, (x) => {
        processedCount++;
        return x === 5;
      });

      expect(result).toBe(5);
      expect(processedCount).toBe(6);
    });
  });

  describe('chunk', () => {
    it('should chunk items into arrays', () => {
      const items = [1, 2, 3, 4, 5, 6, 7];
      const result = toArray(chunk(items, 3));

      expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });

    it('should handle exact multiples', () => {
      const items = [1, 2, 3, 4, 5, 6];
      const result = toArray(chunk(items, 2));

      expect(result).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
    });

    it('should throw error for invalid chunk size', () => {
      const items = [1, 2, 3];

      expect(() => toArray(chunk(items, 0))).toThrow('Chunk size must be positive');
      expect(() => toArray(chunk(items, -1))).toThrow('Chunk size must be positive');
    });
  });

  describe('flatten', () => {
    it('should flatten nested iterables', () => {
      const items = [[1, 2], [3, 4], [5]];
      const result = toArray(flatten(items));

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle mixed nested and flat items', () => {
      const items = [1, [2, 3], 4, [5]];
      const result = toArray(flatten(items));

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('composition', () => {
    it('should compose multiple lazy operations', () => {
      const items = Array.from({ length: 100 }, (_, i) => i);

      const result = toArray(
        take(
          map(skip(items, 10), (x) => x * 2),
          5,
        ),
      );

      expect(result).toEqual([20, 22, 24, 26, 28]);
    });

    it('should remain lazy through composition', () => {
      let processedCount = 0;
      const items = Array.from({ length: 1000 }, (_, i) => i);

      const composed = take(
        map(items, (x) => {
          processedCount++;
          return x * 2;
        }),
        5,
      );

      expect(processedCount).toBe(0);

      toArray(composed);

      expect(processedCount).toBe(5);
    });
  });
});
