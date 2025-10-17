const { filter } = require('./build/index.js');

const products = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Mouse', price: 25 }
];

console.log('Test 1: Simple price filter');
const result1 = filter(products, { price: { $gt: 100 } });
console.log('Result:', result1);
console.log('Length:', result1.length);

console.log('\nTest 2: Simple price match');
const result2 = filter(products, { price: 1200 });
console.log('Result:', result2);
console.log('Length:', result2.length);
