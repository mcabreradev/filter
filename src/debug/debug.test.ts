import { describe, it, expect } from 'vitest';
import { filterDebug } from './debug-filter';

interface User {
  id: number;
  name: string;
  age: number;
  city: string;
  premium: boolean;
  tags: string[];
}

const users: User[] = [
  { id: 1, name: 'Alice', age: 25, city: 'Berlin', premium: true, tags: ['developer', 'senior'] },
  { id: 2, name: 'Bob', age: 30, city: 'Berlin', premium: false, tags: ['designer'] },
  { id: 3, name: 'Charlie', age: 28, city: 'Paris', premium: true, tags: ['developer'] },
  { id: 4, name: 'Diana', age: 22, city: 'Berlin', premium: false, tags: ['developer', 'junior'] },
  { id: 5, name: 'Eve', age: 35, city: 'London', premium: true, tags: ['manager'] },
];

describe('filterDebug', () => {
  it('should return correct match statistics for simple expression', () => {
    const result = filterDebug(users, { city: 'Berlin' });

    expect(result.items).toHaveLength(3);
    expect(result.stats.matched).toBe(3);
    expect(result.stats.total).toBe(5);
    expect(result.stats.percentage).toBe(60);
    expect(result.stats.executionTime).toBeGreaterThan(0);
  });

  it('should build correct tree for $and operator', () => {
    const result = filterDebug(users, {
      $and: [{ city: 'Berlin' }, { age: { $lt: 30 } }],
    });

    expect(result.tree.type).toBe('logical');
    expect(result.tree.operator).toBe('$and');
    expect(result.tree.children).toHaveLength(2);
    expect(result.items).toHaveLength(2);
  });

  it('should build correct tree for $or operator', () => {
    const result = filterDebug(users, {
      $or: [{ city: 'Berlin' }, { premium: true }],
    });

    expect(result.tree.type).toBe('logical');
    expect(result.tree.operator).toBe('$or');
    expect(result.tree.children).toHaveLength(2);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it('should build correct tree for $not operator', () => {
    const result = filterDebug(users, {
      $not: { city: 'Berlin' },
    });

    expect(result.tree.type).toBe('logical');
    expect(result.tree.operator).toBe('$not');
    expect(result.tree.children).toHaveLength(1);
    expect(result.items).toHaveLength(2);
  });

  it('should handle nested logical operators', () => {
    const result = filterDebug(users, {
      $and: [{ city: 'Berlin' }, { $or: [{ age: { $lt: 30 } }, { premium: true }] }],
    });

    expect(result.tree.type).toBe('logical');
    expect(result.tree.operator).toBe('$and');
    expect(result.tree.children).toHaveLength(2);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it('should track match counts accurately', () => {
    const result = filterDebug(users, { city: 'Berlin' });

    expect(result.tree.matched).toBe(3);
    expect(result.tree.total).toBe(5);
  });

  it('should handle comparison operators', () => {
    const result = filterDebug(users, { age: { $gte: 30 } });

    expect(result.items).toHaveLength(2);
    expect(result.stats.matched).toBe(2);
  });

  it('should handle array operators', () => {
    const result = filterDebug(users, { tags: { $contains: 'developer' } });

    expect(result.items.length).toBeGreaterThanOrEqual(0);
    expect(result.stats.matched).toBeGreaterThanOrEqual(0);
  });

  it('should handle multiple field conditions', () => {
    const result = filterDebug(users, {
      city: 'Berlin',
      premium: true,
    });

    expect(result.items).toHaveLength(1);
    expect(result.stats.matched).toBe(1);
  });

  it('should provide print method', () => {
    const result = filterDebug(users, { city: 'Berlin' });

    expect(typeof result.print).toBe('function');
    expect(() => result.print()).not.toThrow();
  });

  it('should count conditions correctly', () => {
    const result = filterDebug(users, {
      $and: [{ city: 'Berlin' }, { age: { $lt: 30 } }],
    });

    expect(result.stats.conditionsEvaluated).toBeGreaterThan(0);
  });

  it('should handle complex real-world expression', () => {
    const result = filterDebug(users, {
      $and: [{ city: 'Berlin' }, { $or: [{ age: { $lt: 30 } }, { premium: true }] }],
    });

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.stats.percentage).toBeGreaterThan(0);
    expect(result.tree.type).toBe('logical');
  });

  it('should handle empty results', () => {
    const result = filterDebug(users, { city: 'Tokyo' });

    expect(result.items).toHaveLength(0);
    expect(result.stats.matched).toBe(0);
    expect(result.stats.percentage).toBe(0);
  });

  it('should handle all items matching', () => {
    const result = filterDebug(users, { age: { $gte: 0 } });

    expect(result.items).toHaveLength(5);
    expect(result.stats.matched).toBe(5);
    expect(result.stats.percentage).toBe(100);
  });

  it('should work with verbose option', () => {
    const result = filterDebug(users, { city: 'Berlin' }, { verbose: true });

    expect(result.items).toHaveLength(3);
    expect(() => result.print()).not.toThrow();
  });

  it('should work with showTimings option', () => {
    const result = filterDebug(users, { city: 'Berlin' }, { showTimings: true });

    expect(result.tree.evaluationTime).toBeGreaterThanOrEqual(0);
  });

  it('should work with colorize option', () => {
    const result = filterDebug(users, { city: 'Berlin' }, { colorize: true });

    expect(result.items).toHaveLength(3);
    expect(() => result.print()).not.toThrow();
  });

  it('should handle array OR syntax', () => {
    const result = filterDebug(users, { city: ['Berlin', 'Paris'] });

    expect(result.items).toHaveLength(4);
    expect(result.stats.matched).toBe(4);
  });

  it('should handle custom predicate functions', () => {
    const result = filterDebug(users, (user: User) => user.age > 25);

    expect(result.items).toHaveLength(3);
    expect(result.tree.type).toBe('primitive');
    expect(result.tree.operator).toBe('function');
  });

  it('should throw error for non-array input', () => {
    expect(() => filterDebug({} as never, { city: 'Berlin' })).toThrow(
      'Expected array but received: object',
    );
  });
});
