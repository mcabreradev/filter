# @mcabreradev/filter

[![npm (scoped)](https://img.shields.io/npm/v/@mcabreradev/filter.svg)](https://www.npmjs.com/package/@mcabreradev/filter)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@mcabreradev/filter.svg)](https://www.npmjs.com/package/@mcabreradev/filter)

Filter helper for complex searches

## Install

```
$ npm install @mcabreradev/filter
```

## Usage

```js
const filter = require("@mcabreradev/filter");

const arr = [
  1,
  2,
  3,
  { name: 'Migue', social: { github: 'mcabreradev' } }
];

filter(arr, 'mcabreradev');
//=> [{ name: 'Migue', social: { github: 'mcabreradev' } }]
