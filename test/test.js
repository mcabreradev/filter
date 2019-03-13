'use strict';

const expect = require('chai').expect;
const filter = require('../index');
const customers = require('../data.json');

describe('#filter', function () {

  it('should filter single string', function () {
    var result = filter(customers, 'Berlin');
    expect(result).to.deep.equal([
      { name: 'Alfreds Futterkiste', city: 'Berlin' }
    ]);
  });

  it('should filter city', function () {
    var result = filter(customers, {'city' : 'Marseille'});
    expect(result).to.have.deep.members([
      { name: 'Bon app', city: 'Marseille' }
    ]);
  });

  it('should filter city with single character', function () {
    var result = filter(customers, {'city' : 's'});
    expect(result).to.have.deep.members([
      { name: 'Bon app', city: 'Marseille' },
      { name: 'Bottom-Dollar Marketse', city: 'Tsawassen' },
      { name: 'Cactus Comidas para llevar', city: 'Buenos Aires' }
    ]);
  });

  it('should filter city and name with single character', function () {
    var result = filter(customers, {'name' : 'O', 'city' : 'London'});
    expect(result).to.have.deep.members([
      { name: 'Around the Horn', city: 'London' }
    ]);
  });

  it('should filter cities single character each one', function () {
    var result = filter(customers, {'city' : 'B', 'city' : 'L'});
    expect(result).to.have.deep.members([
      { name: 'Alfreds Futterkiste', city: 'Berlin' },
      { name: 'Around the Horn', city: 'London' },
      { name: 'B\'s Beverages', city: 'London' },
      { name: 'Bon app', city: 'Marseille' }
    ]);
  });

});