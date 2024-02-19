import { filter } from '../src/index';

import data from './data.json'

describe('filter', () => {
  it('filters an array based on a predicate function', () => {
    const predicate = (item) => item.city === 'Berlin';

    const output = filter(data, predicate);
    const input = [
      { name: 'Alfreds Futterkiste', city: 'Berlin' }
    ];

    expect(output).toEqual(input);
  });

  it('filters an array based on object key value', () => {
    const obj = { city: 'Berlin' };

    const output = filter(data, obj);
    const input = [
      { name: 'Alfreds Futterkiste', city: 'Berlin' }
    ];

    expect(output).toEqual(input);
  });

  it('filters an array based on city with single character', () => {
    const obj = { city: 's' };

    const output = filter(data, obj);
    const input = [
      { name: 'Bon app', city: 'Marseille' },
      { name: 'Bottom-Dollar Marketse', city: 'Tsawassen' },
      { name: 'Cactus Comidas para llevar', city: 'Buenos Aires' }
    ];

    expect(output).toEqual(input);
  });

  it('filters an array based on city and name with single character', () => {
    const obj = {'name' : 'O', 'city' : 'London'};

    const output = filter(data, obj);
    const input = [
      { name: 'Around the Horn', city: 'London' }
    ];

    expect(output).toEqual(input);
  });

  it('filters an array based on two cities', () => {
    const predicate = (item) => item.city === 'Berlin' || item.city === 'London';

    const output = filter(data, predicate);
    console.log(output);

    const input = [
      { name: 'Alfreds Futterkiste', city: 'Berlin' },
      { name: 'Around the Horn', city: 'London' },
      { name: 'Bs Beverages', city: 'London' }
    ];

    expect(output).toEqual(input);
  });

  it('filters an array based on two cities if exists', () => {
    const predicate = (item) => item.city === 'Berlin' && item.city === 'Caracas';

    const output = filter(data, predicate);
    const input = [];

    expect(output).toEqual(input);
  });

  it('filters an array based on city and name with single character', () => {
    const obj = { city: 'T', name: 'B'};

    const output = filter(data, obj);

    const input = [
      { name: "Bottom-Dollar Marketse", city: "Tsawassen",}
    ];

    expect(output).toEqual(input);
  });
});