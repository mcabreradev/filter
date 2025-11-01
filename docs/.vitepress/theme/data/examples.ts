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

filter(users, { city: 'Berlin' });`,
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

filter(products, {
  price: { $gte: 100, $lte: 500 },
  rating: { $gte: 4.5 }
});`,
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

filter(emails, '%@example.com%');`,
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

filter(products, {
  $and: [
    { inStock: true },
    { $or: [
      { category: 'Electronics' },
      { price: { $lt: 50 } }
    ]}
  ]
});`,
  },
  {
    id: 'geospatial',
    name: 'Geospatial Operators',
    code: `import { filter } from '@mcabreradev/filter';

const restaurants = [
  { name: 'Berlin Bistro', location: { lat: 52.52, lng: 13.405 }, rating: 4.5 },
  { name: 'Pasta Paradise', location: { lat: 52.521, lng: 13.406 }, rating: 4.8 },
  { name: 'Sushi Spot', location: { lat: 52.53, lng: 13.42 }, rating: 4.6 },
  { name: 'Taco Time', location: { lat: 52.55, lng: 13.45 }, rating: 4.2 }
];

const userLocation = { lat: 52.52, lng: 13.405 };

// Find restaurants within 2km radius
filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 2000
    }
  }
});`,
  },
];
