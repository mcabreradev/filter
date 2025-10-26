# Basic Filtering

Learn the fundamentals of filtering with @mcabreradev/filter.

## Introduction

@mcabreradev/filter provides a declarative, type-safe way to filter arrays using operator-based expressions.

## Simple Equality

### Basic Equality Check

```typescript
import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'John', age: 25, status: 'active' },
  { name: 'Jane', age: 30, status: 'inactive' },
  { name: 'Bob', age: 35, status: 'active' }
];

const expression = {
  status: { $eq: 'active' }
};

const result = filter(users, expression);
```

### Multiple Properties

```typescript
const expression = {
  status: { $eq: 'active' },
  age: { $eq: 25 }
};
```

## Comparison Operators

### Greater Than / Less Than

```typescript
const expression = {
  age: { $gt: 25 }
};

const expression = {
  age: { $gte: 25 }
};

const expression = {
  age: { $lt: 30 }
};

const expression = {
  age: { $lte: 30 }
};
```

### Not Equal

```typescript
const expression = {
  status: { $ne: 'deleted' }
};
```

### Range Queries

```typescript
const expression = {
  $and: [
    { age: { $gte: 18 } },
    { age: { $lte: 65 } }
  ]
};
```

## String Operators

### Contains

```typescript
const expression = {
  name: { $contains: 'john' }
};
```

### Starts With / Ends With

```typescript
const expression = {
  email: { $endsWith: '@example.com' }
};

const expression = {
  username: { $startsWith: 'user_' }
};
```

### Regular Expressions

```typescript
const expression = {
  name: { $regex: /john/i }
};

const expression = {
  email: { $regex: /^[a-z]+@example\.com$/ }
};
```

## Array Operators

### In Array

```typescript
const expression = {
  role: { $in: ['admin', 'moderator', 'user'] }
};
```

### Not In Array

```typescript
const expression = {
  status: { $nin: ['deleted', 'banned'] }
};
```

### Array Contains

```typescript
const users = [
  { name: 'John', tags: ['javascript', 'react'] },
  { name: 'Jane', tags: ['python', 'django'] }
];

const expression = {
  tags: { $contains: 'javascript' }
};
```

## Logical Operators

### AND Operator

```typescript
const expression = {
  $and: [
    { age: { $gte: 18 } },
    { status: { $eq: 'active' } },
    { role: { $in: ['admin', 'user'] } }
  ]
};
```

### OR Operator

```typescript
const expression = {
  $or: [
    { role: { $eq: 'admin' } },
    { permissions: { $contains: 'write' } }
  ]
};
```

### NOT Operator

```typescript
const expression = {
  $not: {
    status: { $eq: 'deleted' }
  }
};
```

### Complex Combinations

```typescript
const expression = {
  $and: [
    {
      $or: [
        { role: { $eq: 'admin' } },
        { role: { $eq: 'moderator' } }
      ]
    },
    { status: { $eq: 'active' } },
    {
      $not: {
        email: { $endsWith: '@blocked.com' }
      }
    }
  ]
};
```

## Nested Objects

### Dot Notation

```typescript
const users = [
  {
    name: 'John',
    address: {
      city: 'New York',
      country: 'USA'
    }
  }
];

const expression = {
  'address.city': { $eq: 'New York' }
};
```

### Nested Object Syntax

```typescript
const expression = {
  address: {
    city: { $eq: 'New York' },
    country: { $eq: 'USA' }
  }
};
```

### Deep Nesting

```typescript
const expression = {
  'profile.settings.notifications.email': { $eq: true }
};
```

## Working with Null and Undefined

### Check for Null

```typescript
const expression = {
  deletedAt: { $eq: null }
};
```

### Check for Not Null

```typescript
const expression = {
  deletedAt: { $ne: null }
};
```

### Handle Optional Properties

```typescript
const users = [
  { name: 'John', age: 25 },
  { name: 'Jane' },
  { name: 'Bob', age: null }
];

const expression = {
  age: { $ne: null }
};
```

## Type Safety with TypeScript

### Define Interfaces

```typescript
interface User {
  id: number;
  name: string;
  age: number;
  status: 'active' | 'inactive';
  email: string;
}

const expression: Expression<User> = {
  status: { $eq: 'active' },
  age: { $gte: 18 }
};
```

### Type-Safe Expressions

```typescript
import type { Expression } from '@mcabreradev/filter';

const createUserFilter = (minAge: number): Expression<User> => ({
  $and: [
    { age: { $gte: minAge } },
    { status: { $eq: 'active' } }
  ]
});
```

## Common Patterns

### Active Records

```typescript
const ACTIVE_EXPRESSION = {
  $and: [
    { status: { $eq: 'active' } },
    { deletedAt: { $eq: null } }
  ]
};
```

### Search Pattern

```typescript
const createSearchExpression = (term: string) => ({
  $or: [
    { name: { $regex: new RegExp(term, 'i') } },
    { email: { $regex: new RegExp(term, 'i') } },
    { username: { $regex: new RegExp(term, 'i') } }
  ]
});
```

### Date Range Pattern

```typescript
const createDateRangeExpression = (start: Date, end: Date) => ({
  $and: [
    { createdAt: { $gte: start } },
    { createdAt: { $lte: end } }
  ]
});
```

### Permission Check Pattern

```typescript
const createPermissionExpression = (requiredPermissions: string[]) => ({
  $or: [
    { role: { $eq: 'admin' } },
    {
      permissions: {
        $in: requiredPermissions
      }
    }
  ]
});
```

## Performance Tips

### Use Specific Operators

```typescript
const expression = {
  status: { $eq: 'active' }
};

const expression = {
  status: { $regex: /active/ }
};
```

### Avoid Nested OR Operations

```typescript
const expression = {
  $or: [
    { $or: [{ a: 1 }, { b: 2 }] },
    { $or: [{ c: 3 }, { d: 4 }] }
  ]
};

const expression = {
  $or: [
    { a: 1 },
    { b: 2 },
    { c: 3 },
    { d: 4 }
  ]
};
```

### Use $in Instead of Multiple $or

```typescript
const expression = {
  $or: [
    { status: { $eq: 'active' } },
    { status: { $eq: 'pending' } },
    { status: { $eq: 'approved' } }
  ]
};

const expression = {
  status: { $in: ['active', 'pending', 'approved'] }
};
```

## Next Steps

- Learn about [Framework Integration](/frameworks/overview)
- Explore [Advanced Features](/advanced/performance)
- Check out [Examples](/examples/basic-usage)
- Read [Best Practices](/guide/best-practices)

## Related Resources

- [Operator Reference](/api/operators)
- [Configuration Guide](/guide/configuration)
- [TypeScript Types](/api/types)
- [Troubleshooting](/guide/troubleshooting)

