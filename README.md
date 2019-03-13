# @mcabreradev/filter

[![npm (scoped)](https://img.shields.io/npm/v/@mcabreradev/filter.svg)](https://www.npmjs.com/package/@mcabreradev/filter)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@mcabreradev/filter.svg)](https://www.npmjs.com/package/@mcabreradev/filter)

Filter helper for complex searches

## Install

```
$ npm i @mcabreradev/filter
```

## Usage

```js
const filter = require("@mcabreradev/filter");

const customers = [
  {"name" : "Alfreds Futterkiste", "city" : "Berlin"},
  {"name" : "Around the Horn", "city" : "London"},
  {"name" : "B's Beverages", "city" : "London"},
  {"name" : "Bolido Comidas preparadas", "city" : "Madrid"},
  {"name" : "Bon app", "city" : "Marseille"},
  {"name" : "Bottom-Dollar Marketse" ,"city" : "Tsawassen"},
  {"name" : "Cactus Comidas para llevar", "city" : "Buenos Aires"}
];

filter(customers, {'name' : 'O', 'city' : 'London'});
//=> [ { name: 'Around the Horn', city: 'London' } ]
