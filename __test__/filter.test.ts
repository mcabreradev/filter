import { filter } from '../src/index';

import data from './data.json';

describe('filter', () => {
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

  it('filters an array based on object key value', () => {
    const obj = { city: '%erlin' };

    const output = filter(data, obj);
    const input = [{ name: 'Alfreds Futterkiste', city: 'Berlin' }];

    expect(output).toEqual(input);
  });

  it('filters an array based on object key value', () => {
    const obj = { city: '_erlin' };

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

  it('filters an array based on city with single character', () => {
    const obj = { city: 's' };

    const output = filter(data, obj);
    const input = [
      { name: 'Bon app', city: 'Marseille' },
      { name: 'Bottom-Dollar Marketse', city: 'Tsawassen' },
      { name: 'Cactus Comidas para llevar', city: 'Buenos Aires' },
    ];

    expect(output).toEqual(input);
  });

  it('filters an array based on city and name with single character', () => {
    const obj = { name: 'O', city: 'London' };

    const output = filter(data, obj);
    const input = [{ name: 'Around the Horn', city: 'London' }];

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

  it('filters an array based on city and name with single character', () => {
    const obj = { city: 'T', name: 'B' };

    const output = filter(data, obj);
    const input = [{ name: 'Bottom-Dollar Marketse', city: 'Tsawassen' }];

    expect(output).toEqual(input);
  });

  it('filters an array based on if predicate dont match', () => {
    const obj = { name: 'Albert Einstain', city: 'Berlin' };

    const output = filter(data, obj);
    const input = [];

    expect(output).toEqual(input);
  });

  it('filters an array based on wildcard % at starting word', () => {
    const obj = '%ondon';

    const output = filter(data, obj);
    const input = [
      { name: 'Around the Horn', city: 'London' },
      { name: 'Bs Beverages', city: 'London' },
    ];

    expect(output).toEqual(input);
  });

  it('filters an array based on wildcard % at the end of the word', () => {
    const obj = 'Lond%';

    const output = filter(data, obj);
    const input = [
      { name: 'Around the Horn', city: 'London' },
      { name: 'Bs Beverages', city: 'London' },
    ];

    expect(output).toEqual(input);
  });

  it('filters an array based on wildcard % both sides of the word', () => {
    const obj = '%ond%';

    const output = filter(data, obj);
    const input = [
      { name: 'Around the Horn', city: 'London' },
      { name: 'Bs Beverages', city: 'London' },
    ];

    expect(output).toEqual(input);
  });

  it('filters an array based on wildcard _ at the end of word', () => {
    const obj = 'Londo_';

    const output = filter(data, obj);

    const input = [
      { name: 'Around the Horn', city: 'London' },
      { name: 'Bs Beverages', city: 'London' },
    ];

    expect(output).toEqual(input);
  });

  it('filters an array based on wildcard _ at start of word', () => {
    const obj = '_ondon';

    const output = filter(data, obj);
    const input = [
      { name: 'Around the Horn', city: 'London' },
      { name: 'Bs Beverages', city: 'London' },
    ];

    expect(output).toEqual(input);
  });

  it('filters an array based on wildcard _ both sides of word', () => {
    const obj = '_ondo_';

    const output = filter(data, obj);
    const input = [
      { name: 'Around the Horn', city: 'London' },
      { name: 'Bs Beverages', city: 'London' },
    ];

    expect(output).toEqual(input);
  });
});
