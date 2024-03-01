[![npm (scoped)](https://img.shields.io/npm/v/@mcabreradev/filter.svg)](https://www.npmjs.com/package/@mcabreradev/filter)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@mcabreradev/filter.svg)](https://www.npmjs.com/package/@mcabreradev/filter)
[![Rate on Openbase](https://badges.openbase.io/js/rating/@mcabreradev/filter.svg)](https://openbase.io/js/@mcabreradev/filter?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)

# Filter

Filters the array to a subset of it based on provided criteria. Selects a subset of items from `array` and returns it as a new array.

## Install

```
$ npm install @mcabreradev/filter
```

## Usage

```ts
import filter from '@mcabreradev/filter';

const customers = [
  { name: 'Alfreds Futterkiste', city: 'Berlin' },
  { name: 'Around the Horn', city: 'London' },
  { name: "B's Beverages", city: 'London' },
  { name: 'Bolido Comidas preparadas', city: 'Madrid' },
  { name: 'Bon app', city: 'Marseille' },
  { name: 'Bottom-Dollar Marketse', city: 'Tsawassen' },
  { name: 'Cactus Comidas para llevar', city: 'Buenos Aires' },
];
```

## Filters customers with a specific city

```ts
filter(customers, 'Berlin');

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

## Filters customers with a specific city with wildcard %

#### The % wildcard represents any number of characters, even zero characters.

return all customers that contains the pattern 'erlin':

```ts
filter(customers, '%erlin');

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

return all customers that contains the pattern 'Ber':

```ts
filter(customers, 'Ber%');

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

return all customers that contains the pattern 'erli':

```ts
filter(customers, '%erli%');

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

---

## Filters customers with a specific city with wildcard \_

#### The _ wildcard represents a single character. It can be any character or number, but each _ represents one, and only one, character.

return all customers with a City starting with any character, followed by "erlin":

```ts
filter(customers, '_erlin');

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

return all customers with a City witch contains "erli":

```ts
filter(customers, '_erli_');

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

return all customers with a City starting with "L", followed by any 2 characters, ending with "lin":

```ts
filter(customers, 'B__lin');

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

## Filters customers based on object key value

```ts
filter(customers, { city: 'Berlin' });

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

## Filters customers based on object key value with wilcards

```ts
filter(customers, { city: '%erlin' });

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

```ts
filter(customers, { city: 'Berl%' });

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

```ts
filter(customers, { city: '_erlin' });

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

```ts
filter(customers, { city: '_erl__' });

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

```ts
filter(customers, { city: '_e_li_' });

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

## Filters customers based on a predicate function

```ts
filter(customers, ({ city }) => city === 'Berlin');

// [ { name: 'Alfreds Futterkiste', city: 'Berlin' } ]
```

## Filters customers based on based on two cities

```ts
filter(customers, ({ city }) => city === 'Berlin' || city === 'London');

// [
//    { name: 'Alfreds Futterkiste', city: 'Berlin' },
//    { name: 'Around the Horn', city: 'London' },
//    { name: 'Bs Beverages', city: 'London' }
// ]
```

## Filters customers based on based on two cities if exists

```ts
filter(customers, ({ city }) => city === 'Berlin' && city === 'Caracas');

// []
```

## Tests

```
$ npm test
```

## Contributing

```
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
```
