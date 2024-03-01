# Filter

> Filters the array to a subset of it based on provided criteria. Selects a subset of items from `array` and returns it as a new `array`.

<p>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/classnames">
    <img alt="" src="https://img.shields.io/npm/v/@mcabreradev/filter.svg?style=for-the-badge&labelColor=0869B8">
  </a>
  <a aria-label="License" href="#">
    <img alt="" src="https://img.shields.io/npm/l/classnames.svg?style=for-the-badge&labelColor=579805">
  </a>

  </p>

## About The Project

This project provides a comprehensive implementation of a `filter` function in TypeScript. The `filter` function is a versatile tool that can be used to select a subset of items from an array based on a provided predicate function or expression.

The `filter` function in this project is designed to handle a wide variety of use cases. It can `filter` arrays of primitive values, objects, and even nested objects. The function also supports complex `filter`ing expressions, including wildcard characters and regular expressions.

The project also includes a number of utility functions that are used internally by the `filter` function. These include functions for deep comparison of objects, checking the type of a value, and more. These utility functions are also exported by the module, so they can be used independently if needed.

The code is written in TypeScript, providing static type checking and other benefits. It is thoroughly documented with comments explaining the purpose and functionality of each function and variable.

Whether you need to `filter` an array in a complex way, or you're just interested in understanding how a robust `filter` function can be implemented, this project is a valuable resource.

### Install

```shell
npm install @mcabreradev/filter
```

### Usage

```ts
import filter from '@mcabreradev/filter';
```

</br>

## Features

The `filter` function in the provided TypeScript code is a versatile function that allows you to select a subset of items from an array based on a variety of conditions. Here are some of its key features:
</br>

1.  **Array Filtering**: The primary purpose of the `filter` function is to filter an array. It takes an array and a predicate function as arguments, and returns a new array that includes only the items for which the predicate function returns `true`.

```ts
import filter from '@mcabreradev/filter';

const numbers = [1, 2, 3, 4, 5];
const evenNumbers = filter(numbers, (n) => n % 2 === 0);

console.log(evenNumbers); // Output: [2, 4]
```

</br>

2.  **Case-Insensitive Search**: The `filter` function supports case-insensitive search. When you provide a string as the predicate, it will match any property of the objects in the array that contains the string, regardless of case.

```ts
import filter from '@mcabreradev/filter';

const words = ['Apple', 'Banana', 'Cherry'];
const result = filter(words, 'a');

console.log(result); // Output: ['Apple', 'Banana']
```

</br>

3.  **Wildcard Matching**: The `filter` function supports wildcard matching with the '%' and '_' characters. The '%' character matches any sequence of characters, and the '_' character matches any single character. These wildcards also work in a case-insensitive manner.

```ts
import filter from '@mcabreradev/filter';

const words = ['Apple', 'Banana', 'Cherry'];
const result = filter(words, 'A%e');

console.log(result); // Output: ['Apple']
```

</br>

4.  **Multiple Conditions**: The `filter` function allows you to filter an array based on multiple conditions. You can specify these conditions as an object, where each key-value pair represents a condition that the items in the array must meet to be included in the result.

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

5.  **Custom Predicate Functions**: The `filter` function allows you to provide a custom predicate function to determine which items should be included in the result. This gives you maximum flexibility to define your own conditions for filtering the array.

```ts
import filter from '@mcabreradev/filter';

const numbers = [1, 2, 3, 4, 5];
const result = filter(numbers, (n) => n > 3);

console.log(result); // Output: [4, 5]
```

</br>

6.  **Deep Comparison**: The `filter` function supports deep comparison of objects. This means that it can compare the properties of nested objects, not just the top-level properties.

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

7.  **Negation**: The `filter` function supports negation. If the predicate is a string that starts with '!', the function will include an item in the result only if it does not match the rest of the string.

```ts
import filter from '@mcabreradev/filter';

const words = ['Apple', 'Banana', 'Cherry'];
const result = filter(words, '!Apple');

console.log(result); // Output: ['Banana', 'Cherry']
```

</br>

8.  **Array-Like Objects**: The `filter` function can filter not only arrays, but also array-like objects. An array-like object is an object that has a `length` property and whose property keys can be accessed using numeric indices.

```ts
import filter from '@mcabreradev/filter';

const arrayLike = { 0: 'Apple', 1: 'Banana', 2: 'Cherry', length: 3 };
const result = filter(arrayLike, 'a');

console.log(result); // Output: ['Apple', 'Banana']
```

</br>

9.  **Nested Objects**: The `filter` function can filter arrays with a nested object that has 2 node levels:

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
// [
//	 {
//		name: 'Alice',
// 		age: 20,
// 		address: {
// 			city: 'New York',
// 			country: 'USA',
// 			coordinates: { lat: 40.7128, long: 74.0060 }
// 		}
// 	}
// ]
```

## Examples of Usage

The `filter` function can be used in a wide variety of scenarios. Here are some examples of how it can be used:

Filters customers with a specific city

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

## Filters customers with a specific city with wildcard `%`

#### The `%` wildcard represents any number of characters, even zero characters.

<br/>

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

return all customers that contains the pattern `'Ber'`:

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

return all customers that contains the pattern 'erli':

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

## Filters customers with a specific city with wildcard \_

#### The `_` wildcard represents a single character. It can be any character or number, but each `_` represents one, and only one, character.

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

## Filters customers based on objects

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

## Filters customers based on object key value with wilcards `%`

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

## Filters customers based on a predicate function

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

## Filters customers based on based on two cities

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

## Filters customers based on based on two cities if exists

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

## Contributing

Contributions to this project are very welcome and greatly appreciated. Whether you're fixing bugs, adding new features, improving performance, or even correcting typos, your help is valuable.

Here are some steps to contribute to this project:

1. **Fork the Repository:** Start by forking the repository to your own GitHub account.

2. **Clone the Repository:** Clone the forked repository to your local machine.

3. **Create a New Branch:** Always create a new branch for your changes. This keeps the commit history clean and makes it easier to separate and manage different features or fixes.

4. **Make Your Changes:** Make your changes in the new branch. Please follow the existing coding style and conventions.

5. **Test Your Changes:** Ensure that your changes do not break any existing functionality. Add new tests if necessary.

6. **Commit Your Changes:** Commit your changes with a clear and descriptive commit message.

7. **Push Your Changes:** Push your changes to your forked repository on GitHub.

8. **Submit a Pull Request:** Submit a pull request from your forked repository to the original repository. Please provide a clear and detailed description of your changes.

Thank you for your interest in contributing to this project!

## Copyright

Copyright (c) 2024. All rights reserved. This project is licensed under the MIT license. This means you are free to use, modify, and distribute the code, as long as you include the original copyright notice and disclaimers. Please see the LICENSE file in the project root for the full license text.
