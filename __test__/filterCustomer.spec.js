'use strict';

const filter = require('../index');
const customers = require('../data.json');

describe("Filter function", () => {

  test('it should filter single string', () => {
    let output = filter(customers, 'Berlin');
    let input = [
      { name: 'Alfreds Futterkiste', city: 'Berlin' }
    ];

    expect(input).toEqual(output);
  });

  test('it should filter city', () => {
    let output = filter(customers, {'city' : 'Mars'});
    let input = [
      { name: 'Bon app', city: 'Marseille' }
    ];

    expect(input).toEqual(output);
  });

  test('it should filter city with single character', () => {
    let output = filter(customers, {'city' : 's'});
    let input = [
      { name: 'Bon app', city: 'Marseille' },
      { name: 'Bottom-Dollar Marketse', city: 'Tsawassen' },
      { name: 'Cactus Comidas para llevar', city: 'Buenos Aires' }
    ];

    expect(input).toEqual(output);
  });

  test('it should filter city and name with single character', () => {
    let output = filter(customers, {'name' : 'O', 'city' : 'London'});
    let input = [
      { name: 'Around the Horn', city: 'London' }
    ];

    expect(input).toEqual(output);
  });

  test('it should filter input with two single letters', () => {
    let output = filter(customers, {'city' : 'B', 'city' : 'L'});
    let input = [
      { name: 'Alfreds Futterkiste', city: 'Berlin' },
      { name: 'Around the Horn', city: 'London' },
      { name: 'B\'s Beverages', city: 'London' },
      { name: 'Bon app', city: 'Marseille' }
    ];

    expect(input).toEqual(output);
  });

});