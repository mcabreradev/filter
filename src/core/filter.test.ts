import { describe, it, expect } from 'vitest';
import { filter } from './filter';

const data = [
  { name: 'Alfreds Futterkiste', city: 'Berlin' },
  { name: 'Around the Horn', city: 'London' },
  { name: 'Bs Beverages', city: 'London' },
  { name: 'Bolido Comidas preparadas', city: 'Madrid' },
  { name: 'Bon app', city: 'Marseille' },
  { name: 'Bottom-Dollar Marketse', city: 'Tsawassen' },
  { name: 'Cactus Comidas para llevar', city: 'Buenos Aires' }
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
      const predicate = ({ city }: { city: string }) => city === 'Berlin';
      const input = filter(data, predicate);
      const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

      expect(input).toEqual(output);
    });

    it('filters based on two cities with OR logic', () => {
      const predicate = ({ city }: { city: string }) => city === 'Berlin' || city === 'London';
      const input = filter(data, predicate);
      const output = [
        { name: 'Alfreds Futterkiste', city: 'Berlin' },
        { name: 'Around the Horn', city: 'London' },
        { name: 'Bs Beverages', city: 'London' }
      ];

      expect(input).toEqual(output);
    });

    it('filters based on two cities with AND logic (no match)', () => {
      const predicate = ({ city }: { city: string }) => city === 'Berlin' && city === 'Caracas';
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
      expect(() => filter('not an array' as unknown as unknown[], 'test')).toThrow(
        'Expected array but received:'
      );
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
});

