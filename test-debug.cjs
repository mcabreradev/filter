const { filter } = require('./build/index.js');
const { isOperatorExpression } = require('./build/utils/index.js');

const testObj = { $gt: 100 };
console.log('Is operator expression?', isOperatorExpression(testObj));

const products = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Mouse', price: 25 }
];

const result = filter(products, { price: { $gt: 100 } });
console.log('Result:', result);
