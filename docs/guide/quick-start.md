---
title: Quick Start
description: Get started with @mcabreradev/filter in minutes
---

# Quick Start

This guide will get you up and running with `@mcabreradev/filter` in just a few minutes.

## Installation

```bash
npm install @mcabreradev/filter
# or
yarn add @mcabreradev/filter
# or
pnpm add @mcabreradev/filter
```

## Import Styles

Choose between two import styles:

```typescript
// Classic import (all features)
import { filter, useFilter } from '@mcabreradev/filter';

// Modular import (smaller bundle, recommended for production)
import { filter } from '@mcabreradev/filter/core';
import { useFilter } from '@mcabreradev/filter/react';
```

::: tip Bundle Size
Modular imports reduce bundle size by **50-70%**! See [Modular Imports](/guide/modular-imports) for details.
:::

## Basic Usage

Import the `filter` function and start filtering:

```typescript
import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', email: 'alice@example.com', age: 30, city: 'Berlin' },
  { name: 'Bob', email: 'bob@example.com', age: 25, city: 'London' },
  { name: 'Charlie', email: 'charlie@example.com', age: 35, city: 'Berlin' }
];

// Simple string matching (case-insensitive by default)
const berlinUsers = filter(users, 'Berlin');
// → Returns Alice and Charlie
```

## Filtering Strategies

The library supports multiple filtering strategies:

### 1. String Matching

Search across all object properties:

```typescript
filter(users, 'alice');
// → Returns Alice

filter(users, 'example.com');
// → Returns all users (all have example.com in email)
```

### 2. Wildcard Patterns

Use SQL-like wildcards for flexible matching:

```typescript
// % matches zero or more characters
filter(users, '%alice%');     // Contains 'alice'
filter(users, 'Al%');          // Starts with 'Al'
filter(users, '%son');         // Ends with 'son'

// _ matches exactly one character
filter(users, 'Bo_');          // 'Bob', 'Bot', etc.
```

### 3. Object-Based Filtering

Match by specific properties:

```typescript
// Single property
filter(users, { city: 'Berlin' });
// → Returns Alice and Charlie

// Multiple properties (all must match)
filter(users, { city: 'Berlin', age: 30 });
// → Returns Alice
```

### 4. MongoDB-Style Operators

Use powerful operators for advanced filtering:

```typescript
// Comparison operators
filter(users, { age: { $gte: 25, $lt: 35 } });
// → Returns Bob and Alice

// Array operators
filter(users, { city: { $in: ['Berlin', 'Paris'] } });
// → Returns Alice and Charlie

// String operators
filter(users, { name: { $startsWith: 'A' } });
// → Returns Alice
```

### 5. Predicate Functions

For complex custom logic:

```typescript
filter(users, (user) => user.age > 28);
// → Returns Alice and Charlie

filter(users, (user) =>
  user.age > 25 && user.city === 'Berlin'
);
// → Returns Alice and Charlie
```

## Negation

Exclude items with the `!` prefix:

```typescript
filter(users, '!London');
// → Returns Alice and Charlie (excludes Bob)

filter(users, '!%@example.com%');
// → Returns no one (all have example.com)
```

## Configuration Options

Customize filter behavior:

```typescript
// Case-sensitive matching
filter(users, 'ALICE', { caseSensitive: true });
// → Returns nothing (case doesn't match)

// Increase max depth for nested objects
filter(data, expression, { maxDepth: 5 });

// Enable caching for repeated queries
filter(largeDataset, expression, { enableCache: true });
```

## TypeScript Support

Full type safety with generics:

```typescript
interface User {
  name: string;
  age: number;
  email: string;
  city: string;
}

const users: User[] = [...];

// Type-safe filtering
const result = filter<User>(users, { age: { $gte: 18 } });
// result is User[]

// Type-safe predicates
const adults = filter<User>(users, (user: User): boolean =>
  user.age >= 18
);
```

## Real-World Example

Here's a practical example for an e-commerce application:

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  rating: number;
  inStock: boolean;
  tags: string[];
}

const products: Product[] = [...];

// Find affordable, highly-rated electronics in stock
const affordableElectronics = filter(products, {
  category: 'Electronics',
  price: { $lte: 1000 },
  rating: { $gte: 4.5 },
  inStock: { $eq: true }
});

// Search products matching keyword with filters
const searchResults = filter(products, {
  name: { $contains: 'laptop' },
  brand: { $in: ['Apple', 'Dell', 'HP'] },
  price: { $gte: 500, $lte: 2000 }
});

// Complex query with logical operators
const premiumDeals = filter(products, {
  $and: [
    { inStock: true },
    {
      $or: [
        { rating: { $gte: 4.5 } },
        { price: { $lt: 50 } }
      ]
    },
    { $not: { category: 'Clearance' } }
  ]
});
```

## Performance Tips

For optimal performance:

```typescript
// Enable caching for large datasets
const results = filter(
  largeDataset,
  { status: 'active' },
  { enableCache: true }
);

// Use lazy evaluation for early exits
import { filterFirst } from '@mcabreradev/filter';

const first10 = filterFirst(users, { premium: true }, 10);
// Stops processing after finding 10 matches
```

## Next Steps

Now that you know the basics, explore more advanced features:

- [Modular Imports](/guide/modular-imports) - Optimize bundle size with granular imports ⭐
- [Operators Guide](/guide/operators) - Learn all 30+ MongoDB-style operators
- [Logical Operators](/guide/logical-operators) - Complex queries with $and, $or, $not
- [Lazy Evaluation](/guide/lazy-evaluation) - Efficient processing for large datasets
- [Memoization](/guide/memoization) - 530x performance boost with caching
- [Framework Integration](/frameworks/) - React, Vue, and Svelte support

## Interactive Playground

Try the library in your browser:

<Playground />

## Common Patterns

### Search Functionality

```typescript
function searchUsers(users: User[], searchTerm: string) {
  return filter(users, `%${searchTerm}%`);
}
```

### Filter with Multiple Conditions

```typescript
function filterProducts(
  products: Product[],
  minPrice: number,
  maxPrice: number,
  category: string
) {
  return filter(products, {
    category,
    price: { $gte: minPrice, $lte: maxPrice }
  });
}
```

### Active Records

```typescript
function getActiveUsers(users: User[]) {
  return filter(users, {
    active: true,
    deletedAt: { $eq: null }
  });
}
```

## Troubleshooting

### No Results Found

If you're not getting expected results:

1. Check case sensitivity (default is case-insensitive)
2. Verify property names match exactly
3. For nested objects, ensure maxDepth is sufficient
4. Use predicates for debugging:

```typescript
filter(users, (user) => {
  console.log('Checking:', user);
  return user.age > 25;
});
```

### Performance Issues

For large datasets:

1. Enable caching: `{ enableCache: true }`
2. Use lazy evaluation: `filterFirst()`, `filterExists()`
3. Avoid complex predicates when operators suffice
4. Profile with cache statistics:

```typescript
import { getFilterCacheStats } from '@mcabreradev/filter';

const stats = getFilterCacheStats();
console.log('Cache stats:', stats);
```

