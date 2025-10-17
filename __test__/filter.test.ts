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
    const predicate = ({ city }) => city === 'Berlin';

    const input = filter(data, predicate);
    const output = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(input).toEqual(output);
  });

  it('filters an array based on two cities', () => {
    const predicate = ({ city }) => city === 'Berlin' || city === 'London';

    const input = filter(data, predicate);
    const output = [
      { name: 'Alfreds Futterkiste', city: 'Berlin' },
      { name: 'Around the Horn', city: 'London' },
      { name: 'Bs Beverages', city: 'London' },
    ];

    expect(input).toEqual(output);
  });

  it('filters an array based on two cities if exists', () => {
    const predicate = ({ city }) => city === 'Berlin' && city === 'Caracas';

    const input = filter(data, predicate);
    const output = [];

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
