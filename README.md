# Filter

> Filters the array to a subset of it based on provided criteria.

<p>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@mcabreradev/filter">
    <img alt="" src="https://img.shields.io/npm/v/@mcabreradev/filter.svg?style=for-the-badge&labelColor=0869B8">
  </a>
  <a aria-label="License" href="#">
    <img alt="" src="https://img.shields.io/npm/l/classnames.svg?style=for-the-badge&labelColor=579805">
  </a>

</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Motivation](#motivation)
- [About The Project](#about-the-project)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
  - [Array Filtering:](#array-filtering)
  - [Case-Insensitive Search:](#case-insensitive-search)
  - [Wildcard Matching:](#wildcard-matching)
  - [Multiple Conditions:](#multiple-conditions)
  - [Custom Predicate Functions:](#custom-predicate-functions)
  - [Deep Comparison:](#deep-comparison)
  - [Negation:](#negation)
  - [Nested Objects:](#nested-objects)
- [Advanced Examples of Use](#advanced-examples-of-use)
  - [Filters customers with a specific city](#filters-customers-with-a-specific-city)
  - [Filters customers with a specific city with wildcard `%`](#filters-customers-with-a-specific-city-with-wildcard-%25)
  - [Filters customers with a specific city with wildcard \_](#filters-customers-with-a-specific-city-with-wildcard-%5C_)
  - [Filters customers based on objects](#filters-customers-based-on-objects)
  - [Filters customers based on object key value with wilcards `%`](#filters-customers-based-on-object-key-value-with-wilcards-%25)
  - [Filters customers based on a predicate function](#filters-customers-based-on-a-predicate-function)
  - [Filters customers based on based on two cities](#filters-customers-based-on-based-on-two-cities)
  - [Filters customers based on based on two cities if exists](#filters-customers-based-on-based-on-two-cities-if-exists)
- [Tests](#tests)
- [Philosophy](#philosophy)
- [About the Author](#about-the-author)
- [Copyright](#copyright)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Motivation

The motivation behind this project is to provide a robust, versatile, and comprehensive filter function that can handle a wide array of use cases. Filtering is a fundamental operation in programming, especially in data manipulation and analysis. However, the built-in filter function in JavaScript and TypeScript can sometimes be limited in its capabilities, especially when dealing with complex data structures and filtering conditions.

This project aims to overcome these limitations by providing a filter function that is not only more powerful, but also easier to use. It supports filtering arrays of primitive values, objects, and even nested objects. It also supports complex filtering expressions, including wildcard characters and regular expressions. This makes it a versatile tool that can be used in a wide variety of scenarios.

## About The Project

This project provides a comprehensive implementation of a `filter` function in TypeScript. The `filter` function is a versatile tool that can be used to select a subset of items from an array based on a provided predicate function or expression.

The `filter` function in this project is designed to handle a wide variety of use cases. It can `filter` arrays of primitive values, objects, and even nested objects. The function also supports complex `filtering` expressions, including wildcard characters and regular expressions.

Whether you need to `filter` an array in a complex way, or you're just interested in understanding how a robust `filter` function can be implemented, this project is a valuable resource.

## Installation

You can install this package using various package managers. Here are the commands for each of them:

npm

```shell
npm install @mcabreradev/filter
```

yarn

```shell
yarn add @mcabreradev/filter
```

pnpm

```shell
pnpm add @mcabreradev/filter
```

bun

```shell
bun install @mcabreradev/filter
```

## Usage

After installation, you can import the filter function from the package like this:

```ts
import filter from '@mcabreradev/filter';
```

If you're working in a Node.js environment, the installation process is the same as mentioned before. However, you can use the CommonJS syntax to import the filter function:

```ts
const filter = require('@mcabreradev/filter');
```

## Features

The `filter` function in the provided TypeScript code is a versatile function that allows you to select a subset of items from an array based on a variety of conditions. Here are some of its key features:

</br>

### Array Filtering:

The primary purpose of the `filter` function is to filter an array. It takes an array and a predicate function as arguments, and returns a new array that includes only the items for which the predicate function returns `true`.

```ts
import filter from '@mcabreradev/filter';

const numbers = [1, 2, 3, 4, 5];
const evenNumbers = filter(numbers, (n) => n % 2 === 0);

console.log(evenNumbers); // Output: [2, 4]
```

</br>

### Case-Insensitive Search:

The `filter` function supports case-insensitive search. When you provide a string as the predicate, it will match any property of the objects in the array that contains the string, regardless of case.

```ts
import filter from '@mcabreradev/filter';

const words = ['Apple', 'Banana', 'Cherry'];
const result = filter(words, 'a');

console.log(result); // Output: ['Apple', 'Banana']
```

</br>

### Wildcard Matching:

The `filter` function supports wildcard matching with the `%` and `_` characters. The `%` character matches any sequence of characters, and the `_` character matches any single character. These wildcards also work in a case-insensitive manner.

```ts
import filter from '@mcabreradev/filter';

const words = ['Apple', 'Banana', 'Cherry'];
const result = filter(words, 'A%e');

console.log(result); // Output: ['Apple']
```

</br>

### Multiple Conditions:

The `filter` function allows you to filter an array based on multiple conditions. You can specify these conditions as an object, where each key-value pair represents a condition that the items in the array must meet to be included in the result.

```ts
import filter from '@mcabreradev/filter';

const users = [
  { name: 'Alice', age: 20 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 30 },
];
const result = filter(users, { name: 'A%', age: 20 });

console.log(result); // Output: [{ name: 'Alice', age: 20 }]
```

</br>

### Custom Predicate Functions:

The `filter` function allows you to provide a custom predicate function to determine which items should be included in the result. This gives you maximum flexibility to define your own conditions for filtering the array.

```ts
import filter from '@mcabreradev/filter';

const numbers = [1, 2, 3, 4, 5];
const result = filter(numbers, (n) => n > 3);

console.log(result); // Output: [4, 5]
```

</br>

### Deep Comparison:

The `filter` function supports deep comparison of objects. This means that it can compare the properties of nested objects, not just the top-level properties.

```ts
import filter from '@mcabreradev/filter';

const users = [
  { name: 'Alice', age: 20, address: { city: 'New York' } },
  { name: 'Bob', age: 25, address: { city: 'Los Angeles' } },
  { name: 'Charlie', age: 30, address: { city: 'Chicago' } },
];
const result = filter(users, { address: { city: 'New York' } });

console.log(result); // Output: [{ name: 'Alice', age: 20, address: { city: 'New York' } }]
```

</br>

### Negation:

The `filter` function supports negation. If the predicate is a string that starts with `!`, the function will include an item in the result only if it does not match the rest of the string.

```ts
import filter from '@mcabreradev/filter';

const words = ['Apple', 'Banana', 'Cherry'];
const result = filter(words, '!Apple');

console.log(result); // Output: ['Banana', 'Cherry']
```

</br>

### Nested Objects:

The `filter` function can filter arrays with a nested object that has 2 node levels:

```ts
import filter from '@mcabreradev/filter';

const users = [
  { name: 'Alice', age: 20, address: { city: 'New York', country: 'USA' } },
  { name: 'Bob', age: 25, address: { city: 'Los Angeles', country: 'USA' } },
  { name: 'Charlie', age: 30, address: { city: 'London', country: 'UK' } },
];
const result = filter(users, { address: { country: 'USA' } });

console.log(result);

// Output:
//[
// { name: 'Alice', age: 20, address: { city: 'New York', country: 'USA' } },
// { name: 'Bob', age: 25, address: { city: 'Los Angeles', country: 'USA' } }
//]
```

<br/>

And here's an example of `filter` function with a nested object that has 3 node levels:

```ts
import filter from '@mcabreradev/filter';

const users = [
  {
    name: 'Alice',
    age: 20,
    address: {
      city: 'New York',
      country: 'USA',
      coordinates: { lat: 40.7128, long: 74.006 },
    },
  },
  {
    name: 'Bob',
    age: 25,
    address: {
      city: 'Los Angeles',
      country: 'USA',
      coordinates: { lat: 34.0522, long: 118.2437 },
    },
  },
  {
    name: 'Charlie',
    age: 30,
    address: {
      city: 'London',
      country: 'UK',
      coordinates: { lat: 51.5074, long: 0.1278 },
    },
  },
];

const result = filter(users, { address: { coordinates: { lat: 40.7128 } } });

console.log(result);

// Output:
// [{
//   name: 'Alice',
//   age: 20,
//   address: {
//       city: 'New York',
//       country: 'USA',
//       coordinates: {
//           lat: 40.7128,
//           long: 74.0060
//       }
//   }
// }]
```

</br>

## Advanced Examples of Use

The `filter` function can be used in a wide variety of scenarios. Here are some examples of how it can be used:

### Filters customers with a specific city

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

filter(customers, 'Berlin');

// Output:
// [{ name: 'Alfreds Futterkiste', city: 'Berlin' }]
```

### Filters customers with a specific city with wildcard `%`

The `%` wildcard represents any number of characters, even zero characters.

return all customers that contains the pattern `'erlin'`:

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

filter(customers, '%erlin');

// Output:
// [{ name: 'Alfreds Futterkiste', city: 'Berlin' }]
```

<br/>

return all customers that contains the pattern `"Ber"`:

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

filter(customers, 'Ber%');

// Output:
// [{ name: 'Alfreds Futterkiste', city: 'Berlin' }]
```

<br/>

return all customers that contains the pattern `"erli"`:

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

filter(customers, '%erli%');

// Output:
// [{ name: 'Alfreds Futterkiste', city: 'Berlin' }]
```

---

### Filters customers with a specific city with wildcard \_

The `_` wildcard represents a single character. It can be any character or number, but each `_` represents one, and only one, character.

return all customers with a City starting with any character, followed by `"erlin"`:

<br/>

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

filter(customers, '_erlin');

// Output:
// [{ name: 'Alfreds Futterkiste', city: 'Berlin' }]
```

<br/>

return all customers with a City witch contains `"erli"`:

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

filter(customers, '_erli_');

// Output:
// [{ name: 'Alfreds Futterkiste', city: 'Berlin' }]
```

<br/>

return all customers with a City starting with `"L"`, followed by any 2 characters, ending with `"lin"`:

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

filter(customers, 'B__lin');

// Output:
// [{ name: 'Alfreds Futterkiste', city: 'Berlin' }]
```

<br/>

### Filters customers based on objects

return all customers with a City named `"Berlin"`:

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

filter(customers, { city: 'Berlin' });

// Output:
// [{ name: 'Alfreds Futterkiste', city: 'Berlin' }]
```

<br/>

### Filters customers based on object key value with wilcards `%`

return all customers with a City witch contains `"erlin"` at the end of the string:

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

filter(customers, { city: '%erlin' });

// Output:
// [{ name: 'Alfreds Futterkiste', city: 'Berlin' }]
```

<br/>

return all customers with a City witch contains `"erli"` at the begining of the string:

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

filter(customers, { city: 'Berl%' });

// Output:
// [{ name: 'Alfreds Futterkiste', city: 'Berlin' }]
```

<br/>

return all customers with a City witch contains `"erlin"` at the end of the string:

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

filter(customers, { city: '_erlin' });

// Output:
// [{ name: 'Alfreds Futterkiste', city: 'Berlin' }]
```

<br/>

return all customers with a City witch contains `"erl"` in the string:

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

filter(customers, { city: '_erl__' });

// Output:
// [{ name: 'Alfreds Futterkiste', city: 'Berlin' }]
```

<br/>

return all customers with a City witch contains the characters `"e,li"` in the string:

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

filter(customers, { city: '_e_li_' });

// Output:
// [{ name: 'Alfreds Futterkiste', city: 'Berlin' }]
```

<br/>

### Filters customers based on a predicate function

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

filter(customers, ({ city }) => city === 'Berlin');

// Output:
// [{ name: 'Alfreds Futterkiste', city: 'Berlin' }]
```

<br/>

### Filters customers based on based on two cities

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

filter(customers, ({ city }) => city === 'Berlin' || city === 'London');

// Output:
// [
//  { name: 'Alfreds Futterkiste', city: 'Berlin' },
//  { name: 'Around the Horn', city: 'London' },
//  { name: 'Bs Beverages', city: 'London' }
// ]
```

<br/>

### Filters customers based on based on two cities if exists

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

filter(customers, ({ city }) => city === 'Berlin' && city === 'Caracas');

// Output:
// []
```

## Tests

```bash
$ npm run test
```

## Philosophy

The philosophy behind this project is to provide a robust, flexible, and efficient solution for filtering arrays in TypeScript. We believe in the power of simplicity and readability, and we strive to make our code as clear and understandable as possible. We also believe in the importance of performance, and we have designed our filter function to be highly efficient, even when dealing with large arrays and complex filtering conditions.

## About the Author

This project is maintained by [Miguelangel Cabrera](https://mcabrera.dev), a passionate software developer with a deep interest in TypeScript and functional programming. Miguelangel has years of experience in software development and a strong commitment to code quality, performance, and maintainability.

## Copyright

Copyright (c) 2024. All rights reserved. This project is licensed under the MIT license. This means you are free to use, modify, and distribute the code, as long as you include the original copyright notice and disclaimers. Please see the LICENSE file in the project root for the full license text.
