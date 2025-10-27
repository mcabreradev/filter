# Operators Reference

Complete reference for all operators in @mcabreradev/filter.

## Comparison Operators

### $eq (Equals)

Matches values that are equal to a specified value.

```typescript
const expression = {
  status: { $eq: 'active' }
};
```

**Type**: `any`

**Example**:
```typescript
{ age: { $eq: 25 } }
{ name: { $eq: 'John' } }
{ active: { $eq: true } }
```

### $ne (Not Equal)

Matches values that are not equal to a specified value.

```typescript
const expression = {
  status: { $ne: 'deleted' }
};
```

**Type**: `any`

**Example**:
```typescript
{ age: { $ne: 0 } }
{ role: { $ne: 'guest' } }
```

### $gt (Greater Than)

Matches values that are greater than a specified value.

```typescript
const expression = {
  age: { $gt: 18 }
};
```

**Type**: `number | Date`

**Example**:
```typescript
{ price: { $gt: 100 } }
{ createdAt: { $gt: new Date('2024-01-01') } }
```

### $gte (Greater Than or Equal)

Matches values that are greater than or equal to a specified value.

```typescript
const expression = {
  age: { $gte: 18 }
};
```

**Type**: `number | Date`

**Example**:
```typescript
{ score: { $gte: 80 } }
{ updatedAt: { $gte: startDate } }
```

### $lt (Less Than)

Matches values that are less than a specified value.

```typescript
const expression = {
  age: { $lt: 65 }
};
```

**Type**: `number | Date`

**Example**:
```typescript
{ price: { $lt: 50 } }
{ expiresAt: { $lt: new Date() } }
```

### $lte (Less Than or Equal)

Matches values that are less than or equal to a specified value.

```typescript
const expression = {
  age: { $lte: 65 }
};
```

**Type**: `number | Date`

**Example**:
```typescript
{ quantity: { $lte: 10 } }
{ deadline: { $lte: endDate } }
```

## Array Operators

### $in (In Array)

Matches any of the values specified in an array.

```typescript
const expression = {
  role: { $in: ['admin', 'moderator', 'user'] }
};
```

**Type**: `any[]`

**Example**:
```typescript
{ status: { $in: ['active', 'pending'] } }
{ category: { $in: ['electronics', 'computers'] } }
{ priority: { $in: [1, 2, 3] } }
```

### $nin (Not In Array)

Matches none of the values specified in an array.

```typescript
const expression = {
  status: { $nin: ['deleted', 'banned', 'suspended'] }
};
```

**Type**: `any[]`

**Example**:
```typescript
{ role: { $nin: ['guest', 'anonymous'] } }
{ tag: { $nin: ['spam', 'inappropriate'] } }
```

### $contains (Array Contains)

Matches arrays that contain a specified value.

```typescript
const expression = {
  tags: { $contains: 'javascript' }
};
```

**Type**: `any`

**Example**:
```typescript
{ skills: { $contains: 'react' } }
{ categories: { $contains: 'featured' } }
{ permissions: { $contains: 'write' } }
```

## String Operators

### $regex (Regular Expression)

Matches values that match a specified regular expression.

```typescript
const expression = {
  email: { $regex: /^[a-z]+@example\.com$/i }
};
```

**Type**: `RegExp`

**Example**:
```typescript
{ name: { $regex: /john/i } }
{ phone: { $regex: /^\+1/ } }
{ url: { $regex: /^https:/ } }
```

### $startsWith (Starts With)

Matches strings that start with a specified value.

```typescript
const expression = {
  username: { $startsWith: 'user_' }
};
```

**Type**: `string`

**Example**:
```typescript
{ email: { $startsWith: 'admin' } }
{ sku: { $startsWith: 'PROD-' } }
{ code: { $startsWith: 'US' } }
```

### $endsWith (Ends With)

Matches strings that end with a specified value.

```typescript
const expression = {
  email: { $endsWith: '@example.com' }
};
```

**Type**: `string`

**Example**:
```typescript
{ filename: { $endsWith: '.pdf' } }
{ domain: { $endsWith: '.com' } }
{ path: { $endsWith: '/index.html' } }
```

## Logical Operators

### $and (Logical AND)

Joins query clauses with a logical AND.

```typescript
const expression = {
  $and: [
    { age: { $gte: 18 } },
    { status: { $eq: 'active' } },
    { role: { $in: ['admin', 'user'] } }
  ]
};
```

**Type**: `Expression[]`

**Example**:
```typescript
{
  $and: [
    { price: { $gte: 10 } },
    { price: { $lte: 100 } }
  ]
}
```

### $or (Logical OR)

Joins query clauses with a logical OR.

```typescript
const expression = {
  $or: [
    { role: { $eq: 'admin' } },
    { permissions: { $contains: 'write' } }
  ]
};
```

**Type**: `Expression[]`

**Example**:
```typescript
{
  $or: [
    { status: { $eq: 'active' } },
    { status: { $eq: 'pending' } }
  ]
}
```

### $not (Logical NOT)

Inverts the effect of a query expression.

```typescript
const expression = {
  $not: {
    status: { $eq: 'deleted' }
  }
};
```

**Type**: `Expression`

**Example**:
```typescript
{
  $not: {
    role: { $in: ['guest', 'anonymous'] }
  }
}
```

## Operator Combinations

### Range Query

```typescript
const expression = {
  $and: [
    { age: { $gte: 18 } },
    { age: { $lte: 65 } }
  ]
};
```

### Multiple Conditions

```typescript
const expression = {
  $and: [
    { status: { $eq: 'active' } },
    { role: { $in: ['admin', 'user'] } },
    { email: { $endsWith: '@company.com' } }
  ]
};
```

### Complex Logic

```typescript
const expression = {
  $and: [
    {
      $or: [
        { role: { $eq: 'admin' } },
        { permissions: { $contains: 'write' } }
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

## Nested Property Access

### Dot Notation

```typescript
const expression = {
  'address.city': { $eq: 'New York' },
  'profile.age': { $gte: 18 }
};
```

### Nested Objects

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
  'user.profile.settings.notifications.email': { $eq: true }
};
```

## Type Definitions

### Expression Type

```typescript
type Expression<T> = {
  [K in keyof T]?: OperatorExpression<T[K]> | T[K];
} | LogicalExpression<T>;
```

### Operator Expression

```typescript
interface OperatorExpression<T> {
  $eq?: T;
  $ne?: T;
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
  $in?: T[];
  $nin?: T[];
  $contains?: T extends Array<infer U> ? U : never;
  $regex?: RegExp;
  $startsWith?: string;
  $endsWith?: string;
}
```

### Logical Expression

```typescript
interface LogicalExpression<T> {
  $and?: Expression<T>[];
  $or?: Expression<T>[];
  $not?: Expression<T>;
}
```

## Custom Operators

### Register Custom Operator

```typescript
import { registerOperator } from '@mcabreradev/filter';

registerOperator('$between', (value, [min, max]) => {
  return value >= min && value <= max;
});

const expression = {
  age: { $between: [18, 65] }
};
```

### Custom String Operator

```typescript
registerOperator('$icontains', (value, search) => {
  return value.toLowerCase().includes(search.toLowerCase());
});

const expression = {
  name: { $icontains: 'john' }
};
```

## Operator Precedence

Operators are evaluated in the following order:

1. Property access (dot notation)
2. Comparison operators (`$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`)
3. Array operators (`$in`, `$nin`, `$contains`)
4. String operators (`$regex`, `$startsWith`, `$endsWith`)
5. Logical NOT (`$not`)
6. Logical AND (`$and`)
7. Logical OR (`$or`)

## Best Practices

### Use Specific Operators

```typescript
{ status: { $eq: 'active' } }

{ status: { $regex: /active/ } }
```

### Combine with $and

```typescript
{
  $and: [
    { age: { $gte: 18 } },
    { age: { $lte: 65 } }
  ]
}
```

### Use $in for Multiple Values

```typescript
{ status: { $in: ['active', 'pending'] } }

{
  $or: [
    { status: { $eq: 'active' } },
    { status: { $eq: 'pending' } }
  ]
}
```

### Case-Insensitive String Matching

```typescript
{ name: { $regex: /john/i } }
```

## Related Resources

- [Basic Filtering](/guide/basic-filtering)
- [TypeScript Types](/api/types)
- [Configuration](/guide/configuration)
- [Examples](/examples/basic-usage)

