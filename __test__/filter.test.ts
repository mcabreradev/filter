import { filter } from '../src/index';

import data from './data.json';

describe('filter array', () => {
  it('filters an array based on single a word', () => {
    const obj = 'Berlin';

    const output = filter(data, obj);
    const input = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(output).toEqual(input);
  });

  it('filters an array with wildcard % based on single name', () => {
    const obj = '%erlin';

    const output = filter(data, obj);
    const input = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(output).toEqual(input);
  });

  it('filters an array with wildcard % based on single name', () => {
    const obj = '%erli%';

    const output = filter(data, obj);
    const input = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(output).toEqual(input);
  });

  it('filters an array with wildcard _ based on single name', () => {
    const obj = '_erlin';

    const output = filter(data, obj);
    const input = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(output).toEqual(input);
  });

  it('filters an array with wildcard _ based on single name', () => {
    const obj = '_e_li_';

    const output = filter(data, obj);
    const input = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(output).toEqual(input);
  });

  it('filters an array with wildcard _ based on single name', () => {
    const obj = 'B__lin';

    const output = filter(data, obj);
    const input = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(output).toEqual(input);
  });

  it('filters an array based on object key value', () => {
    const obj = { city: 'Berlin' };

    const output = filter(data, obj);
    const input = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(output).toEqual(input);
  });

  it('filters an array with wildcard % based on object key value', () => {
    const obj = { city: '%erlin' };

    const output = filter(data, obj);
    const input = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(output).toEqual(input);
  });

  it('filters an array with wildcard % based on object key value', () => {
    const obj = { city: '%erli%' };

    const output = filter(data, obj);
    const input = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(output).toEqual(input);
  });

  it('filters an array with wildcard based on object key value', () => {
    const obj = { city: '_erlin' };

    const output = filter(data, obj);
    const input = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(output).toEqual(input);
  });

  it('filters an array with wildcard based on object key value', () => {
    const obj = { city: '_e_li_' };

    const output = filter(data, obj);
    const input = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(output).toEqual(input);
  });

  it('filters an array with wildcard based on object key value', () => {
    const obj = { city: 'B__lin' };

    const output = filter(data, obj);
    const input = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(output).toEqual(input);
  });

  it('filters an array based on a predicate function', () => {
    const predicate = ({ city }) => city === 'Berlin';

    const output = filter(data, predicate);
    const input = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(output).toEqual(input);
  });

  it('filters an array based on two cities', () => {
    const predicate = ({ city }) => city === 'Berlin' || city === 'London';

    const output = filter(data, predicate);
    const input = [
      { name: 'Alfreds Futterkiste', city: 'Berlin' },
      { name: 'Around the Horn', city: 'London' },
      { name: 'Bs Beverages', city: 'London' },
    ];

    expect(output).toEqual(input);
  });

  it('filters an array based on two cities if exists', () => {
    const predicate = ({ city }) => city === 'Berlin' && city === 'Caracas';

    const output = filter(data, predicate);
    const input = [];

    expect(output).toEqual(input);
  });

  it('filters an array based on if predicate dont match', () => {
    const obj = { name: 'Albert Einstain', city: 'Berlin' };

    const output = filter(data, obj);
    const input = [];

    expect(output).toEqual(input);
  });
});
