import { filter, filterDebug } from '../src';

const users = [
  { name: 'Alice', age: 25, city: 'Berlin', premium: true, salary: 50000 },
  { name: 'Bob', age: 30, city: 'Berlin', premium: false, salary: 60000 },
  { name: 'Charlie', age: 28, city: 'Paris', premium: true, salary: 55000 },
  { name: 'Diana', age: 35, city: 'London', premium: true, salary: 70000 },
  { name: 'Eve', age: 22, city: 'Berlin', premium: false, salary: 45000 },
];

console.log('=== Example 1: Basic Debug (using config option) ===\n');
filter(users, { city: 'Berlin' }, { debug: true });

console.log('\n=== Example 2: Complex Nested Expression (using config option) ===\n');
filter(
  users,
  {
    $and: [{ city: 'Berlin' }, { $or: [{ age: { $lt: 30 } }, { premium: true }] }],
  },
  { debug: true },
);

console.log('\n=== Example 3: Verbose Mode (using config option) ===\n');
filter(users, { age: { $gte: 25 } }, { debug: true, verbose: true });

console.log('\n=== Example 4: Show Timings (using config option) ===\n');
filter(users, { premium: true }, { debug: true, showTimings: true });

console.log('\n=== Example 5: Colorized Output (using config option) ===\n');
filter(users, { city: 'Berlin' }, { debug: true, colorize: true });

console.log('\n=== Example 6: Combined Options (using config option) ===\n');
filter(
  users,
  { age: { $gte: 25 }, city: 'Berlin' },
  { debug: true, verbose: true, showTimings: true, colorize: true },
);

console.log('\n=== Example 7: Programmatic Access (using filterDebug directly) ===\n');
const result7 = filterDebug(users, { age: { $gte: 30 } });
console.log(
  'Matched users:',
  result7.items.map((u) => u.name),
);
console.log('Match count:', result7.stats.matched);
console.log('Total count:', result7.stats.total);
console.log('Percentage:', result7.stats.percentage.toFixed(1) + '%');
console.log('Execution time:', result7.stats.executionTime.toFixed(2) + 'ms');
console.log('Conditions evaluated:', result7.stats.conditionsEvaluated);

console.log('\n=== Example 8: Array Operators ===\n');
filter(users, { city: { $in: ['Berlin', 'Paris'] } }, { debug: true });

console.log('\n=== Example 9: Comparison Operators ===\n');
filter(users, { salary: { $gte: 55000 } }, { debug: true });

console.log('\n=== Example 10: Multiple Conditions ===\n');
filter(
  users,
  {
    $and: [{ city: 'Berlin' }, { age: { $gte: 25 } }, { premium: false }],
  },
  { debug: true },
);

console.log('\n=== Example 11: Nested OR Logic ===\n');
filter(
  users,
  {
    $or: [{ city: 'London' }, { $and: [{ age: { $lt: 26 } }, { premium: true }] }],
  },
  { debug: true },
);

console.log('\n=== Example 12: Real-World E-commerce Filter ===\n');
const products = [
  { name: 'Laptop', price: 1200, category: 'electronics', inStock: true, rating: 4.5 },
  { name: 'Phone', price: 800, category: 'electronics', inStock: true, rating: 4.8 },
  { name: 'Desk', price: 300, category: 'furniture', inStock: false, rating: 4.2 },
  { name: 'Chair', price: 150, category: 'furniture', inStock: true, rating: 4.0 },
  { name: 'Monitor', price: 400, category: 'electronics', inStock: true, rating: 4.6 },
];

filter(
  products,
  {
    $and: [
      { category: 'electronics' },
      { inStock: true },
      { price: { $lte: 1000 } },
      { rating: { $gte: 4.5 } },
    ],
  },
  { debug: true, verbose: true },
);
