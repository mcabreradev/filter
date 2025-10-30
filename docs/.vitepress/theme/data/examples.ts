export interface Example {
  id: string;
  name: string;
  code: string;
}

export const examples: Example[] = [
  {
    id: 'basic',
    name: 'Basic Filtering',
    code: `import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', age: 30, city: 'Berlin' },
  { name: 'Bob', age: 25, city: 'London' },
  { name: 'Charlie', age: 35, city: 'Berlin' }
];

const result = filter(users, { city: 'Berlin' });
console.log(result);`,
  },
  {
    id: 'operators',
    name: 'MongoDB Operators',
    code: `import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'Laptop', price: 1200, rating: 4.5 },
  { name: 'Mouse', price: 25, rating: 4.0 },
  { name: 'Monitor', price: 450, rating: 4.8 }
];

const result = filter(products, {
  price: { $gte: 100, $lte: 500 },
  rating: { $gte: 4.5 }
});
console.log(result);`,
  },
  {
    id: 'wildcards',
    name: 'Wildcard Patterns',
    code: `import { filter } from '@mcabreradev/filter';

const emails = [
  { email: 'alice@example.com', verified: true },
  { email: 'bob@test.com', verified: false },
  { email: 'charlie@example.com', verified: true }
];

const result = filter(emails, '%@example.com%');
console.log(result);`,
  },
  {
    id: 'logical',
    name: 'Logical Operators',
    code: `import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'Laptop', category: 'Electronics', price: 1200, inStock: true },
  { name: 'Desk', category: 'Furniture', price: 300, inStock: false },
  { name: 'Mouse', category: 'Electronics', price: 25, inStock: true }
];

const result = filter(products, {
  $and: [
    { inStock: true },
    { $or: [
      { category: 'Electronics' },
      { price: { $lt: 50 } }
    ]}
  ]
});
console.log(result);`,
  },
];
