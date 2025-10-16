const { filter } = require('./build/index.js');
const { processOperators } = require('./build/operators/index.js');

const value = 1200;
const operators = { $gt: 100 };
const config = { caseSensitive: false, maxDepth: 3, enableCache: false };

console.log('Test processOperators directly:');
console.log('Value:', value);
console.log('Operators:', operators);
console.log('Result:', processOperators(value, operators, config));

console.log('\nTest filter:');
const products = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Mouse', price: 25 }
];

const result = filter(products, { price: { $gt: 100 } });
console.log('Result:', result);
