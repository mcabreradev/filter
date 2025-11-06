import { describe, it, expect } from 'vitest';
import { filter } from '../src/core/filter';

interface User {
  id: number;
  name: string;
  age: number;
  city: string;
  active: boolean;
}

const users: User[] = [
  { id: 1, name: 'Alice', age: 30, city: 'Berlin', active: true },
  { id: 2, name: 'Bob', age: 25, city: 'London', active: false },
  { id: 3, name: 'Charlie', age: 35, city: 'Berlin', active: true },
  { id: 4, name: 'David', age: 28, city: 'Paris', active: true },
  { id: 5, name: 'Eve', age: 32, city: 'London', active: false },
  { id: 6, name: 'Frank', age: 27, city: 'Berlin', active: true },
  { id: 7, name: 'Grace', age: 33, city: 'Paris', active: true },
  { id: 8, name: 'Henry', age: 29, city: 'London', active: false },
  { id: 9, name: 'Ivy', age: 31, city: 'Berlin', active: true },
  { id: 10, name: 'Jack', age: 26, city: 'Paris', active: true },
];

describe('Filter with limit option', () => {
  describe('Basic limit functionality', () => {
    it('should limit results to specified count', () => {
      const result = filter(users, { active: true }, { limit: 3 });
      expect(result).toHaveLength(3);
      expect(result.every((u) => u.active)).toBe(true);
    });

    it('should return all results when limit exceeds matches', () => {
      const result = filter(users, { city: 'Berlin' }, { limit: 100 });
      expect(result).toHaveLength(4);
    });

    it('should return empty array when no matches and limit specified', () => {
      const result = filter(users, { city: 'Tokyo' }, { limit: 5 });
      expect(result).toHaveLength(0);
    });

    it('should return single result when limit is 1', () => {
      const result = filter(users, { active: true }, { limit: 1 });
      expect(result).toHaveLength(1);
      expect(result[0].active).toBe(true);
    });

    it('should handle limit of 0 as no limit', () => {
      const result = filter(users, { active: true }, { limit: 0 });
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle negative limit as no limit', () => {
      const result = filter(users, { active: true }, { limit: -1 });
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle undefined limit as no limit', () => {
      const result = filter(users, { active: true }, { limit: undefined });
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Limit with different expression types', () => {
    it('should work with string expressions', () => {
      const result = filter(users, 'Berlin', { limit: 2 });
      expect(result).toHaveLength(2);
      expect(result.every((u) => u.city === 'Berlin')).toBe(true);
    });

    it('should work with wildcard patterns', () => {
      const result = filter(users, '%ice%', { limit: 1 });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alice');
    });

    it('should work with object expressions', () => {
      const result = filter(users, { city: 'Berlin', active: true }, { limit: 2 });
      expect(result).toHaveLength(2);
      expect(result.every((u) => u.city === 'Berlin' && u.active)).toBe(true);
    });

    it('should work with operator expressions', () => {
      const result = filter(users, { age: { $gte: 30 } }, { limit: 3 });
      expect(result).toHaveLength(3);
      expect(result.every((u) => u.age >= 30)).toBe(true);
    });

    it('should work with predicate functions', () => {
      const result = filter(users, (u: User) => u.age > 25 && u.active, { limit: 2 });
      expect(result).toHaveLength(2);
      expect(result.every((u) => u.age > 25 && u.active)).toBe(true);
    });

    it('should work with array expressions', () => {
      const result = filter(users, { city: ['Berlin', 'Paris'] }, { limit: 3 });
      expect(result).toHaveLength(3);
      expect(result.every((u) => u.city === 'Berlin' || u.city === 'Paris')).toBe(true);
    });
  });

  describe('Limit with orderBy', () => {
    it('should limit after sorting by single field', () => {
      const result = filter(
        users,
        { active: true },
        {
          orderBy: 'age',
          limit: 3,
        },
      );
      expect(result).toHaveLength(3);
      expect(result[0].age).toBeLessThanOrEqual(result[1].age);
      expect(result[1].age).toBeLessThanOrEqual(result[2].age);
    });

    it('should limit after sorting descending', () => {
      const result = filter(
        users,
        { active: true },
        {
          orderBy: { field: 'age', direction: 'desc' },
          limit: 2,
        },
      );
      expect(result).toHaveLength(2);
      expect(result[0].age).toBeGreaterThanOrEqual(result[1].age);
    });

    it('should limit after sorting by multiple fields', () => {
      const result = filter(
        users,
        { active: true },
        {
          orderBy: [
            { field: 'city', direction: 'asc' },
            { field: 'age', direction: 'desc' },
          ],
          limit: 3,
        },
      );
      expect(result).toHaveLength(3);
    });

    it('should return top N results after sorting', () => {
      const result = filter(
        users,
        {},
        {
          orderBy: { field: 'age', direction: 'desc' },
          limit: 3,
        },
      );
      expect(result).toHaveLength(3);
      expect(result[0].age).toBe(35);
      expect(result[1].age).toBe(33);
      expect(result[2].age).toBe(32);
    });
  });

  describe('Limit with caching', () => {
    it('should cache limited results', () => {
      const result1 = filter(users, { active: true }, { limit: 3, enableCache: true });
      const result2 = filter(users, { active: true }, { limit: 3, enableCache: true });
      expect(result1).toHaveLength(3);
      expect(result2).toHaveLength(3);
      expect(result1).toEqual(result2);
    });

    it('should not cache results with different limits', () => {
      const result1 = filter(users, { active: true }, { limit: 2, enableCache: true });
      const result2 = filter(users, { active: true }, { limit: 3, enableCache: true });
      expect(result1).toHaveLength(2);
      expect(result2).toHaveLength(3);
    });
  });

  describe('Limit with debug mode', () => {
    it('should limit results in debug mode', () => {
      const result = filter(users, { active: true }, { limit: 2, debug: true });
      expect(result).toHaveLength(2);
    });

    it('should limit results in verbose debug mode', () => {
      const result = filter(users, { active: true }, { limit: 3, debug: true, verbose: true });
      expect(result).toHaveLength(3);
    });
  });

  describe('Limit with complex expressions', () => {
    it('should work with $and operator', () => {
      const result = filter(
        users,
        {
          $and: [{ active: true }, { age: { $gte: 30 } }],
        },
        { limit: 2 },
      );
      expect(result).toHaveLength(2);
      expect(result.every((u) => u.active && u.age >= 30)).toBe(true);
    });

    it('should work with $or operator', () => {
      const result = filter(
        users,
        {
          $or: [{ city: 'Berlin' }, { city: 'Paris' }],
        },
        { limit: 3 },
      );
      expect(result).toHaveLength(3);
      expect(result.every((u) => u.city === 'Berlin' || u.city === 'Paris')).toBe(true);
    });

    it('should work with nested logical operators', () => {
      const result = filter(
        users,
        {
          $and: [
            { active: true },
            {
              $or: [{ city: 'Berlin' }, { city: 'Paris' }],
            },
          ],
        },
        { limit: 2 },
      );
      expect(result).toHaveLength(2);
      expect(result.every((u) => u.active && (u.city === 'Berlin' || u.city === 'Paris'))).toBe(
        true,
      );
    });
  });

  describe('Limit with string operators', () => {
    it('should work with $startsWith', () => {
      const result = filter(users, { name: { $startsWith: 'A' } }, { limit: 1 });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alice');
    });

    it('should work with $contains', () => {
      const result = filter(users, { city: { $contains: 'on' } }, { limit: 3 });
      expect(result).toHaveLength(3);
      expect(result.every((u) => u.city.includes('on'))).toBe(true);
    });

    it('should work with $regex', () => {
      const result = filter(users, { name: { $regex: '^[A-C]' } }, { limit: 2 });
      expect(result).toHaveLength(2);
    });
  });

  describe('Limit with array operators', () => {
    it('should work with $in operator', () => {
      const result = filter(users, { city: { $in: ['Berlin', 'Paris', 'London'] } }, { limit: 5 });
      expect(result).toHaveLength(5);
    });

    it('should work with $nin operator', () => {
      const result = filter(users, { city: { $nin: ['London'] } }, { limit: 4 });
      expect(result).toHaveLength(4);
      expect(result.every((u) => u.city !== 'London')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty array', () => {
      const result = filter<User>([], { active: true }, { limit: 5 });
      expect(result).toHaveLength(0);
    });

    it('should handle limit larger than array length', () => {
      const result = filter(users, {}, { limit: 1000 });
      expect(result).toHaveLength(users.length);
    });

    it('should preserve object references when limiting', () => {
      const result = filter(users, { active: true }, { limit: 2 });
      expect(result[0]).toBe(users.find((u) => u.id === result[0].id));
    });

    it('should work with all options combined', () => {
      const result = filter(
        users,
        { active: true },
        {
          limit: 2,
          orderBy: 'age',
          caseSensitive: false,
          enableCache: true,
        },
      );
      expect(result).toHaveLength(2);
      expect(result[0].age).toBeLessThanOrEqual(result[1].age);
    });
  });
});
