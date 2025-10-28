import filter from '../src/index';

import data from './data.json';

describe('filter array', () => {
  it('filters an array based on single a word', () => {
    const city = 'Berlin';

    const input = filter(data, city);
    const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(input).toEqual(output);
  });

  it('filters an array with wildcard % based on single name', () => {
    const city = '%erlin';

    const input = filter(data, city);
    const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(input).toEqual(output);
  });

  it('filters an array with wildcard % based on single name', () => {
    const city = '%erli%';

    const input = filter(data, city);
    const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(input).toEqual(output);
  });

  it('filters an array with wildcard _ based on single name', () => {
    const city = '_erlin';

    const input = filter(data, city);
    const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(input).toEqual(output);
  });

  it('filters an array with wildcard _ based on single name', () => {
    const city = '_e_li_';

    const input = filter(data, city);
    const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(input).toEqual(output);
  });

  it('filters an array with wildcard _ based on single name', () => {
    const city = 'B__lin';

    const input = filter(data, city);
    const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(input).toEqual(output);
  });

  it('filters an array based on object key value', () => {
    const city = { city: 'Berlin' };

    const input = filter(data, city);
    const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(input).toEqual(output);
  });

  it('filters an array with wildcard % based on object key value', () => {
    const city = { city: '%erlin' };

    const input = filter(data, city);
    const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(input).toEqual(output);
  });

  it('filters an array with wildcard % based on object key value', () => {
    const obj = { city: '%erli%' };

    const input = filter(data, obj);
    const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(input).toEqual(output);
  });

  it('filters an array with wildcard based on object key value', () => {
    const obj = { city: '_erlin' };

    const input = filter(data, obj);
    const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(input).toEqual(output);
  });

  it('filters an array with wildcard based on object key value', () => {
    const obj = { city: '_e_li_' };

    const input = filter(data, obj);
    const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(input).toEqual(output);
  });

  it('filters an array with wildcard based on object key value', () => {
    const obj = { city: 'B__lin' };

    const input = filter(data, obj);
    const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(input).toEqual(output);
  });

  it('filters an array based on a predicate function', () => {
    const predicate = ({ city }: { city: string }) => city === 'Berlin';

    const input = filter(data, predicate);
    const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(input).toEqual(output);
  });

  it('filters an array based on two cities', () => {
    const predicate = ({ city }: { city: string }) => city === 'Berlin' || city === 'London';

    const input = filter(data, predicate);
    const output = [
      { name: 'Alfreds Futterkiste', city: 'Berlin' },
      { name: 'Around the Horn', city: 'London' },
      { name: 'Bs Beverages', city: 'London' },
    ];

    expect(input).toEqual(output);
  });

  it('filters an array based on two cities if exists', () => {
    const predicate = ({ city }: { city: string }) => {
      // @ts-expect-error - intentionally testing impossible condition
      return city === 'Berlin' && city === 'Caracas';
    };

    const input = filter(data, predicate);
    const output: typeof data = [];

    expect(input).toEqual(output);
  });

  it('filters an array based on negation', () => {
    const words = ['Apple', 'Banana', 'Cherry'];

    const input = filter(words, '!Apple');
    const output = ['Banana', 'Cherry'];

    expect(input).toEqual(output);
  });

  it('filters an array of objects based on negation', () => {
    const people = [{ name: 'Michael' }, { name: 'Sarah' }, { name: 'Jessica' }];

    const input = filter(people, { name: '!Michael' });
    const output = [{ name: 'Sarah' }, { name: 'Jessica' }];

    expect(input).toEqual(output);
  });
});

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

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { name: 'Alice', email: 'alice@example.com', age: 30, city: 'Berlin' },
      { name: 'Charlie', email: 'charlie@example.com', age: 35, city: 'Berlin' },
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

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { name: 'Alice', email: 'alice@example.com', age: 30, city: 'Berlin' },
      { name: 'Bob', email: 'bob@example.com', age: 25, city: 'London' },
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

    expect(result).toHaveLength(1);
    expect(result).toEqual([
      { name: 'Alice', email: 'alice@example.com', age: 30, city: 'Berlin' },
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
