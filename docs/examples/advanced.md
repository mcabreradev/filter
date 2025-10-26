---
title: Advanced Examples
description: Advanced patterns and complex queries
---

# Advanced Examples

Master advanced filtering techniques with MongoDB-style operators and logical combinations.

## MongoDB-Style Operators

### Comparison Operators

```typescript
import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'Laptop', price: 1200, rating: 4.5 },
  { name: 'Mouse', price: 25, rating: 4.0 },
  { name: 'Monitor', price: 450, rating: 4.8 }
];

filter(products, { price: { $gt: 100 } });

filter(products, { price: { $gte: 100, $lte: 500 } });

filter(products, { rating: { $ne: 4.0 } });
```

### Array Operators

```typescript
const users = [
  { name: 'Alice', tags: ['admin', 'developer'], city: 'Berlin' },
  { name: 'Bob', tags: ['user'], city: 'London' },
  { name: 'Charlie', tags: ['developer', 'designer'], city: 'Paris' }
];

filter(users, { city: { $in: ['Berlin', 'Paris'] } });

filter(users, { tags: { $contains: 'developer' } });

filter(users, { tags: { $size: 2 } });
```

### String Operators

```typescript
const emails = [
  { email: 'alice@example.com', verified: true },
  { email: 'bob@test.com', verified: false },
  { email: 'charlie@example.com', verified: true }
];

filter(emails, { email: { $startsWith: 'alice' } });

filter(emails, { email: { $endsWith: '@example.com' } });

filter(emails, { email: { $contains: 'test' } });

filter(emails, { email: { $regex: '^[a-z]+@example\\.com$' } });
```

## Logical Operators

### $and Operator

All conditions must match:

```typescript
filter(products, {
  $and: [
    { price: { $gte: 100 } },
    { rating: { $gte: 4.5 } },
    { inStock: true }
  ]
});
```

### $or Operator

At least one condition must match:

```typescript
filter(products, {
  $or: [
    { category: 'Electronics' },
    { category: 'Accessories' }
  ]
});
```

### $not Operator

Negates the condition:

```typescript
filter(products, {
  $not: { category: 'Furniture' }
});
```

### Complex Nested Queries

```typescript
filter(products, {
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

## Lazy Evaluation

For large datasets, use lazy evaluation:

```typescript
import { filterLazy, filterFirst, filterExists } from '@mcabreradev/filter';

const largeDataset = [...];

for (const item of filterLazy(largeDataset, { active: true })) {
  process(item);
  if (shouldStop) break;
}

const first10 = filterFirst(users, { premium: true }, 10);

const hasAdmin = filterExists(users, { role: 'admin' });
```

## Memoization

Enable caching for repeated queries:

```typescript
const results = filter(
  largeDataset,
  { status: 'active' },
  { enableCache: true }
);

const sameResults = filter(
  largeDataset,
  { status: 'active' },
  { enableCache: true }
);
```

## Configuration Options

Customize filter behavior:

```typescript
filter(users, 'ALICE', { caseSensitive: true });

filter(data, expression, { maxDepth: 5 });

filter(data, expression, {
  customComparator: (actual, expected) => actual === expected
});
```

## Next Steps

- [Real-World Examples](/examples/real-world)
- [Lazy Evaluation Guide](/guide/lazy-evaluation)
- [Memoization Guide](/guide/memoization)
- [Logical Operators](/guide/logical-operators)

