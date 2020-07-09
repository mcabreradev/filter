'use strict';

const filter = require('../index');
const customers = require('../data.json');

describe("Filter function", () => {

  test('it should filter single string', () => {
    let input = filter(customers, 'Berlin');
    let output = [
      { name: 'Alfreds Futterkiste', city: 'Berlin' }
    ];

    expect(input).toEqual(output);
  });

  test('it should filter city', () => {
    let input = filter(customers, {'city' : 'Mars'});
    let output = [
      { name: 'Bon app', city: 'Marseille' }
    ];

    expect(input).toEqual(output);
  });

  test('it should filter city with single character', () => {
    let input = filter(customers, {'city' : 's'});
    let output = [
      { name: 'Bon app', city: 'Marseille' },
      { name: 'Bottom-Dollar Marketse', city: 'Tsawassen' },
      { name: 'Cactus Comidas para llevar', city: 'Buenos Aires' }
    ];

    expect(input).toEqual(output);
  });

  test('it should filter city and name with single character', () => {
    let input = filter(customers, {'name' : 'O', 'city' : 'London'});
    let output = [
      { name: 'Around the Horn', city: 'London' }
    ];

    expect(input).toEqual(output);
  });

  test('it should filter input with two single letters', () => {
    let input = filter(customers, {'city' : 'B', 'city' : 'L'});
    let output = [
      { name: 'Alfreds Futterkiste', city: 'Berlin' },
      { name: 'Around the Horn', city: 'London' },
      { name: 'B\'s Beverages', city: 'London' },
      { name: 'Bon app', city: 'Marseille' }
    ];

    expect(input).toEqual(output);
  });

});