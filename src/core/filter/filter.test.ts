import { describe, it, expect } from 'vitest';
import { filter } from './filter';

const data = [
  { name: 'Alfreds Futterkiste', city: 'Berlin' },
  { name: 'Around the Horn', city: 'London' },
  { name: 'Bs Beverages', city: 'London' },
  { name: 'Bolido Comidas preparadas', city: 'Madrid' },
  { name: 'Bon app', city: 'Marseille' },
  { name: 'Bottom-Dollar Marketse', city: 'Tsawassen' },
  { name: 'Cactus Comidas para llevar', city: 'Buenos Aires' },
];

describe('filter', () => {
  describe('string expressions', () => {
    it('filters an array based on single a word', () => {
      const city = 'Berlin';
      const input = filter(data, city);
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });

    it('filters an array based on negation', () => {
      const words = ['Apple', 'Banana', 'Cherry'];
      const input = filter(words, '!Apple');
      const output = ['Banana', 'Cherry'];

      expect(input).toEqual(output);
    });
  });

  describe('wildcard patterns with %', () => {
    it('filters with wildcard % at beginning', () => {
      const city = '%erlin';
      const input = filter(data, city);
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });

    it('filters with wildcard % at beginning and end', () => {
      const city = '%erli%';
      const input = filter(data, city);
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });
  });

  describe('wildcard patterns with _', () => {
    it('filters with wildcard _ at beginning', () => {
      const city = '_erlin';
      const input = filter(data, city);
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });

    it('filters with wildcard _ in middle positions', () => {
      const city = '_e_li_';
      const input = filter(data, city);
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });

    it('filters with wildcard _ in complex pattern', () => {
      const city = 'B__lin';
      const input = filter(data, city);
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });
  });

  describe('object expressions', () => {
    it('filters based on object key value', () => {
      const city = { city: 'Berlin' };
      const input = filter(data, city);
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });

    it('filters with wildcard % in object value at beginning', () => {
      const city = { city: '%erlin' };
      const input = filter(data, city);
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });

    it('filters with wildcard % in object value at beginning and end', () => {
      const obj = { city: '%erli%' };
      const input = filter(data, obj);
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });

    it('filters with wildcard _ in object value at beginning', () => {
      const obj = { city: '_erlin' };
      const input = filter(data, obj);
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });

    it('filters with wildcard _ in object value in middle', () => {
      const obj = { city: '_e_li_' };
      const input = filter(data, obj);
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });

    it('filters with wildcard _ in object value complex pattern', () => {
      const obj = { city: 'B__lin' };
      const input = filter(data, obj);
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });

    it('filters with negation in object value', () => {
      const people = [{ name: 'Michael' }, { name: 'Sarah' }, { name: 'Jessica' }];
      const input = filter(people, { name: '!Michael' });
      const output = [{ name: 'Sarah' }, { name: 'Jessica' }];

      expect(input).toEqual(output);
    });
  });

  describe('predicate functions', () => {
    it('filters based on a predicate function', () => {
      const predicate = ({ city }: { city: string }): boolean => city === 'Berlin';
      const input = filter(data, predicate);
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });

    it('filters based on two cities with OR logic', () => {
      const predicate = ({ city }: { city: string }): boolean =>
        city === 'Berlin' || city === 'London';
      const input = filter(data, predicate);
      const output = [
        { name: 'Alfreds Futterkiste', city: 'Berlin' },
        { name: 'Around the Horn', city: 'London' },
        { name: 'Bs Beverages', city: 'London' },
      ];

      expect(input).toEqual(output);
    });

    it('filters based on two cities with AND logic (no match)', () => {
      const predicate = ({ city }: { city: string }): boolean => {
        // This is intentionally impossible to demonstrate filtering logic
        const isBerlin = city === 'Berlin';
        const isCaracas = city === 'Caracas';
        return isBerlin && isCaracas;
      };
      const input = filter(data, predicate);
      const output: typeof data = [];

      expect(input).toEqual(output);
    });
  });

  describe('edge cases', () => {
    it('handles empty arrays', () => {
      const input = filter([], 'test');
      expect(input).toEqual([]);
    });

    it('throws error for non-array input', () => {
      expect(() => filter('not an array' as unknown as unknown[], 'test')).toThrow('Type mismatch');
    });

    it('handles arrays with null values', () => {
      const dataWithNull = [...data, null as unknown as (typeof data)[0]];
      const input = filter(dataWithNull, 'Berlin');
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });
  });

  describe('configuration options', () => {
    it('respects case sensitivity when configured', () => {
      const testData = [{ name: 'BERLIN' }, { name: 'berlin' }, { name: 'Berlin' }];
      const input = filter(testData, 'berlin', { caseSensitive: true });
      const output = [{ name: 'berlin' }];

      expect(input).toEqual(output);
    });

    it('uses case insensitive search by default', () => {
      const testData = [{ name: 'BERLIN' }, { name: 'berlin' }, { name: 'Berlin' }];
      const input = filter(testData, 'berlin');
      const output = testData;

      expect(input).toEqual(output);
    });
  });

  describe('orderBy', () => {
    const users = [
      { name: 'Charlie', age: 35, city: 'Berlin' },
      { name: 'Alice', age: 30, city: 'Berlin' },
      { name: 'Bob', age: 25, city: 'London' },
      { name: 'David', age: 30, city: 'Paris' },
    ];

    describe('basic sorting', () => {
      it('sorts by single field ascending (string)', () => {
        const input = filter(users, {}, { orderBy: 'name' });
        const output = [
          { name: 'Alice', age: 30, city: 'Berlin' },
          { name: 'Bob', age: 25, city: 'London' },
          { name: 'Charlie', age: 35, city: 'Berlin' },
          { name: 'David', age: 30, city: 'Paris' },
        ];

        expect(input).toEqual(output);
      });

      it('sorts by single field descending (string)', () => {
        const input = filter(users, {}, { orderBy: { field: 'name', direction: 'desc' } });
        const output = [
          { name: 'David', age: 30, city: 'Paris' },
          { name: 'Charlie', age: 35, city: 'Berlin' },
          { name: 'Bob', age: 25, city: 'London' },
          { name: 'Alice', age: 30, city: 'Berlin' },
        ];

        expect(input).toEqual(output);
      });

      it('sorts by single field ascending (number)', () => {
        const input = filter(users, {}, { orderBy: 'age' });
        const output = [
          { name: 'Bob', age: 25, city: 'London' },
          { name: 'Alice', age: 30, city: 'Berlin' },
          { name: 'David', age: 30, city: 'Paris' },
          { name: 'Charlie', age: 35, city: 'Berlin' },
        ];

        expect(input).toEqual(output);
      });

      it('sorts by single field descending (number)', () => {
        const input = filter(users, {}, { orderBy: { field: 'age', direction: 'desc' } });
        const output = [
          { name: 'Charlie', age: 35, city: 'Berlin' },
          { name: 'Alice', age: 30, city: 'Berlin' },
          { name: 'David', age: 30, city: 'Paris' },
          { name: 'Bob', age: 25, city: 'London' },
        ];

        expect(input).toEqual(output);
      });

      it('sorts by single field ascending (Date)', () => {
        const events = [
          { name: 'Event C', date: new Date('2025-03-15') },
          { name: 'Event A', date: new Date('2025-01-15') },
          { name: 'Event B', date: new Date('2025-02-15') },
        ];
        const input = filter(events, {}, { orderBy: 'date' });
        const output = [
          { name: 'Event A', date: new Date('2025-01-15') },
          { name: 'Event B', date: new Date('2025-02-15') },
          { name: 'Event C', date: new Date('2025-03-15') },
        ];

        expect(input).toEqual(output);
      });

      it('sorts by single field descending (Date)', () => {
        const events = [
          { name: 'Event C', date: new Date('2025-03-15') },
          { name: 'Event A', date: new Date('2025-01-15') },
          { name: 'Event B', date: new Date('2025-02-15') },
        ];
        const input = filter(events, {}, { orderBy: { field: 'date', direction: 'desc' } });
        const output = [
          { name: 'Event C', date: new Date('2025-03-15') },
          { name: 'Event B', date: new Date('2025-02-15') },
          { name: 'Event A', date: new Date('2025-01-15') },
        ];

        expect(input).toEqual(output);
      });
    });

    describe('multiple fields', () => {
      it('sorts by two fields (primary and secondary)', () => {
        const input = filter(
          users,
          {},
          {
            orderBy: [
              { field: 'age', direction: 'asc' },
              { field: 'name', direction: 'asc' },
            ],
          },
        );
        const output = [
          { name: 'Bob', age: 25, city: 'London' },
          { name: 'Alice', age: 30, city: 'Berlin' },
          { name: 'David', age: 30, city: 'Paris' },
          { name: 'Charlie', age: 35, city: 'Berlin' },
        ];

        expect(input).toEqual(output);
      });

      it('sorts by two fields with mixed directions', () => {
        const input = filter(
          users,
          {},
          {
            orderBy: [
              { field: 'age', direction: 'desc' },
              { field: 'name', direction: 'asc' },
            ],
          },
        );
        const output = [
          { name: 'Charlie', age: 35, city: 'Berlin' },
          { name: 'Alice', age: 30, city: 'Berlin' },
          { name: 'David', age: 30, city: 'Paris' },
          { name: 'Bob', age: 25, city: 'London' },
        ];

        expect(input).toEqual(output);
      });

      it('sorts by three fields', () => {
        const input = filter(
          users,
          {},
          {
            orderBy: [
              { field: 'city', direction: 'asc' },
              { field: 'age', direction: 'desc' },
              { field: 'name', direction: 'asc' },
            ],
          },
        );
        const output = [
          { name: 'Charlie', age: 35, city: 'Berlin' },
          { name: 'Alice', age: 30, city: 'Berlin' },
          { name: 'Bob', age: 25, city: 'London' },
          { name: 'David', age: 30, city: 'Paris' },
        ];

        expect(input).toEqual(output);
      });
    });

    describe('nested paths', () => {
      const usersWithNested = [
        { name: 'Alice', profile: { age: 30, address: { city: 'Berlin' } } },
        { name: 'Bob', profile: { age: 25, address: { city: 'London' } } },
        { name: 'Charlie', profile: { age: 35, address: { city: 'Berlin' } } },
      ];

      it('sorts by single level nested path', () => {
        const input = filter(usersWithNested, {}, { orderBy: 'profile.age' });
        const output = [
          { name: 'Bob', profile: { age: 25, address: { city: 'London' } } },
          { name: 'Alice', profile: { age: 30, address: { city: 'Berlin' } } },
          { name: 'Charlie', profile: { age: 35, address: { city: 'Berlin' } } },
        ];

        expect(input).toEqual(output);
      });

      it('sorts by multi-level nested path', () => {
        const input = filter(usersWithNested, {}, { orderBy: 'profile.address.city' });
        const output = [
          { name: 'Alice', profile: { age: 30, address: { city: 'Berlin' } } },
          { name: 'Charlie', profile: { age: 35, address: { city: 'Berlin' } } },
          { name: 'Bob', profile: { age: 25, address: { city: 'London' } } },
        ];

        expect(input).toEqual(output);
      });
    });

    describe('edge cases', () => {
      it('handles empty array input', () => {
        const input = filter([], {}, { orderBy: 'name' });
        expect(input).toEqual([]);
      });

      it('handles empty filtered results', () => {
        const input = filter(users, { name: 'NonExistent' }, { orderBy: 'name' });
        expect(input).toEqual([]);
      });

      it('handles all null/undefined values in sort field', () => {
        const dataWithNulls = [
          { name: 'A', age: null },
          { name: 'B', age: null },
          { name: 'C', age: undefined },
        ];
        const input = filter(dataWithNulls, {}, { orderBy: 'age' });
        expect(input.length).toBe(3);
      });

      it('handles mixed null and non-null values', () => {
        const dataWithMixed = [
          { name: 'A', age: 30 },
          { name: 'B', age: null },
          { name: 'C', age: 20 },
        ];
        const input = filter(dataWithMixed, {}, { orderBy: 'age' });
        const output = [
          { name: 'C', age: 20 },
          { name: 'A', age: 30 },
          { name: 'B', age: null },
        ];

        expect(input).toEqual(output);
      });

      it('handles single item in filtered results', () => {
        const input = filter(users, { name: 'Alice' }, { orderBy: 'age' });
        const output = [{ name: 'Alice', age: 30, city: 'Berlin' }];

        expect(input).toEqual(output);
      });
    });

    describe('integration with other features', () => {
      it('works with filtering and sorting', () => {
        const input = filter(users, { city: 'Berlin' }, { orderBy: 'age' });
        const output = [
          { name: 'Alice', age: 30, city: 'Berlin' },
          { name: 'Charlie', age: 35, city: 'Berlin' },
        ];

        expect(input).toEqual(output);
      });

      it('works with caching (different orderBy = different cache)', () => {
        const result1 = filter(users, {}, { orderBy: 'name', enableCache: true });
        const result2 = filter(
          users,
          {},
          { orderBy: { field: 'name', direction: 'desc' }, enableCache: true },
        );

        expect(result1[0].name).toBe('Alice');
        expect(result2[0].name).toBe('David');
      });

      it('works with caseSensitive option for string sorting', () => {
        const testData = [
          { name: 'BERLIN', value: 1 },
          { name: 'berlin', value: 2 },
          { name: 'Berlin', value: 3 },
        ];
        const input = filter(testData, {}, { orderBy: 'name', caseSensitive: true });
        const output = [
          { name: 'BERLIN', value: 1 },
          { name: 'Berlin', value: 3 },
          { name: 'berlin', value: 2 },
        ];

        expect(input).toEqual(output);
      });

      it('works with operators', () => {
        const input = filter(users, { age: { $gte: 30 } }, { orderBy: 'name' });
        const output = [
          { name: 'Alice', age: 30, city: 'Berlin' },
          { name: 'Charlie', age: 35, city: 'Berlin' },
          { name: 'David', age: 30, city: 'Paris' },
        ];

        expect(input).toEqual(output);
      });
    });
  });
});
