import { describe, it, expect } from 'vitest';
import { filter } from './filter';

describe('Array values with OR logic (syntactic sugar for $in)', () => {
  const users = [
    { name: 'Alice', email: 'alice@example.com', age: 30, city: 'Berlin' },
    { name: 'Bob', email: 'bob@example.com', age: 25, city: 'London' },
    { name: 'Charlie', email: 'charlie@example.com', age: 35, city: 'Berlin' },
    { name: 'David', email: 'david@example.com', age: 30, city: 'Paris' },
  ];

  it('filters with OR logic when property value is an array', () => {
    const result = filter(users, { city: ['Berlin', 'London'] });

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { name: 'Alice', email: 'alice@example.com', age: 30, city: 'Berlin' },
      { name: 'Bob', email: 'bob@example.com', age: 25, city: 'London' },
      { name: 'Charlie', email: 'charlie@example.com', age: 35, city: 'Berlin' },
    ]);
  });

  it('combines array OR with other AND conditions', () => {
    const result = filter(users, { city: ['Berlin', 'London'], age: 30 });

    expect(result).toHaveLength(1);
    expect(result).toEqual([
      { name: 'Alice', email: 'alice@example.com', age: 30, city: 'Berlin' },
    ]);
  });

  it('supports wildcards within array values', () => {
    const result = filter(users, { city: ['%erlin', 'Paris'] });

    expect(result).toHaveLength(3);
    expect(result.map((u) => u.city)).toEqual(['Berlin', 'Berlin', 'Paris']);
  });

  it('works with multiple array properties', () => {
    const result = filter(users, {
      city: ['Berlin', 'Paris'],
      age: [30, 35],
    });

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { name: 'Alice', email: 'alice@example.com', age: 30, city: 'Berlin' },
      { name: 'Charlie', email: 'charlie@example.com', age: 35, city: 'Berlin' },
      { name: 'David', email: 'david@example.com', age: 30, city: 'Paris' },
    ]);
  });

  it('returns empty array when no values in array match', () => {
    const result = filter(users, { city: ['Tokyo', 'Madrid'] });

    expect(result).toHaveLength(0);
  });

  it('works with single-element arrays', () => {
    const result = filter(users, { city: ['Berlin'] });

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { name: 'Alice', email: 'alice@example.com', age: 30, city: 'Berlin' },
      { name: 'Charlie', email: 'charlie@example.com', age: 35, city: 'Berlin' },
    ]);
  });

  it('handles empty arrays by matching nothing', () => {
    const result = filter(users, { city: [] });

    expect(result).toHaveLength(0);
  });

  it('array syntax is equivalent to explicit $in operator', () => {
    const resultWithArray = filter(users, { city: ['Berlin', 'London'] });
    const resultWithOperator = filter(users, { city: { $in: ['Berlin', 'London'] } });

    expect(resultWithArray).toEqual(resultWithOperator);
  });

  it('explicit $in operator takes precedence over array syntax', () => {
    const resultWithOperator = filter(users, { city: { $in: ['Berlin'] } });

    expect(resultWithOperator).toHaveLength(2);
    expect(resultWithOperator.every((u) => u.city === 'Berlin')).toBe(true);
  });

  it('works with number arrays', () => {
    const result = filter(users, { age: [25, 30] });

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { name: 'Alice', email: 'alice@example.com', age: 30, city: 'Berlin' },
      { name: 'Bob', email: 'bob@example.com', age: 25, city: 'London' },
      { name: 'David', email: 'david@example.com', age: 30, city: 'Paris' },
    ]);
  });

  it('works with string arrays and exact matches', () => {
    const result = filter(users, { name: ['Alice', 'Bob'] });

    expect(result).toHaveLength(2);
    expect(result.map((u) => u.name)).toEqual(['Alice', 'Bob']);
  });

  it('combines multiple conditions with different types', () => {
    const result = filter(users, {
      city: ['Berlin', 'Paris'],
      age: 30,
      name: ['Alice', 'David'],
    });

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { name: 'Alice', email: 'alice@example.com', age: 30, city: 'Berlin' },
      { name: 'David', email: 'david@example.com', age: 30, city: 'Paris' },
    ]);
  });

  it('works with wildcards in array for partial matching', () => {
    const result = filter(users, { city: ['%ondon', '%aris'] });

    expect(result).toHaveLength(2);
    expect(result.map((u) => u.city).sort()).toEqual(['London', 'Paris']);
  });

  it('works with underscore wildcard in arrays', () => {
    const result = filter(users, { city: ['_erlin', 'L_ndon'] });

    expect(result).toHaveLength(3);
    expect(result.map((u) => u.city).sort()).toEqual(['Berlin', 'Berlin', 'London']);
  });
});
