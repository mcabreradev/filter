---
title: Basic Examples
description: Basic usage examples for @mcabreradev/filter
---

# Basic Examples

Learn the fundamentals of `@mcabreradev/filter` with these basic examples.

## String Matching

Search across all object properties:

```typescript
import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', email: 'alice@example.com', age: 30 },
  { name: 'Bob', email: 'bob@example.com', age: 25 },
  { name: 'Charlie', email: 'charlie@example.com', age: 35 }
];

filter(users, 'alice');

filter(users, 'example.com');
```

## Wildcard Patterns

Use SQL-like wildcards for flexible matching:

```typescript
filter(users, '%alice%');

filter(users, 'Al%');

filter(users, '%son');

filter(users, 'Bo_');
```

## Object-Based Filtering

Match by specific properties:

```typescript
filter(users, { age: 30 });

filter(users, { name: 'Alice', age: 30 });
```

## Negation

Exclude items with the `!` prefix:

```typescript
filter(users, '!Bob');

filter(users, '!%@example.com%');
```

## Predicate Functions

For complex custom logic:

```typescript
filter(users, (user) => user.age > 28);

filter(users, (user) =>
  user.age > 25 && user.name.startsWith('A')
);
```

## Interactive Playground

Try these examples in the interactive playground:

<Playground />

## Next Steps

- [Advanced Examples](/examples/advanced)
- [Real-World Cases](/examples/real-world)
- [Operators Guide](/guide/operators)

