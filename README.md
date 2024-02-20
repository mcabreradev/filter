[![npm (scoped)](https://img.shields.io/npm/v/@mcabreradev/filter.svg)](https://www.npmjs.com/package/@mcabreradev/filter)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@mcabreradev/filter.svg)](https://www.npmjs.com/package/@mcabreradev/filter)
[![Rate on Openbase](https://badges.openbase.io/js/rating/@mcabreradev/filter.svg)](https://openbase.io/js/@mcabreradev/filter?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)

Filter
=========

Filters the array to a subset of it based on provided criteria. Selects a subset of items from `array` and returns it as a new array.

## Install

```
$ npm install @mcabreradev/filter
```

## Usage

```ts
import filter from '@mcabreradev/filter';

const customers = [
  { "name" : "Alfreds Futterkiste", "city" : "Berlin" },
  { "name" : "Around the Horn", "city" : "London" },
  { "name" : "B's Beverages", "city" : "London" },
  { "name" : "Bolido Comidas preparadas", "city" : "Madrid" },
  { "name" : "Bon app", "city" : "Marseille" },
  { "name" : "Bottom-Dollar Marketse" ,"city" : "Tsawassen" },
  { "name" : "Cactus Comidas para llevar", "city" : "Buenos Aires" }
];
```

### Filters customers with a specific city
```ts
filter(customers, 'Berlin' );

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

### Filters customers based on a predicate function
```ts
filter(customers, ({city}) => city === 'Berlin' );

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

### Filters customers based on object key value
```ts
filter(customers, { city: 'Berlin' } );

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

### Filters customer with a specific city and name containing 'o' letter
```ts
filter(customers, {'name' : 'O', 'city' : 'London'});

// [ { name: 'Around the Horn', city: 'London' } ]
```

### Filters customers based on a half name of city
```ts
filter(customers, {'city' : 'Mars'} );

// [ { name: 'Bon app', city: 'Marseille' } ]
```

### Filters customers based on city with single character
```ts
filter(customers, {'city' : 's'} );

// [
//   { name: 'Bon app', city: 'Marseille' },
//   { name: 'Bottom-Dollar Marketse', city: 'Tsawassen' },
//   { name: 'Cactus Comidas para llevar', city: 'Buenos Aires' }
// ]
```

### Filters customers based on based on two cities
```ts
filter(customers, ({city}) => city === 'Berlin' || city === 'London' );

// [
//    { name: 'Alfreds Futterkiste', city: 'Berlin' },
//    { name: 'Around the Horn', city: 'London' },
//    { name: 'Bs Beverages', city: 'London' }
// ]
```

## Tests

```
$ npm test
```


## Contributing
```
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
```
