# Operators Guide (v4.0.0)

This guide covers all the MongoDB-style operators available in `@mcabreradev/filter` v4.0.0.

## Table of Contents

- [Comparison Operators](#comparison-operators)
- [Array Operators](#array-operators)
- [String Operators](#string-operators)
- [Combining Operators](#combining-operators)
- [Real-World Examples](#real-world-examples)

## Comparison Operators

### `$gt` - Greater Than

Returns items where the property value is **greater than** the specified value.

```typescript
import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'Laptop', price: 1200 },
  { name: 'Mouse', price: 25 },
  { name: 'Monitor', price: 450 }
];

filter(products, { price: { $gt: 100 } });
// → Returns: Laptop ($1200) and Monitor ($450)
```

### `$gte` - Greater Than or Equal

Returns items where the property value is **greater than or equal to** the specified value.

```typescript
filter(products, { price: { $gte: 450 } });
// → Returns: Laptop ($1200) and Monitor ($450)
```

### `$lt` - Less Than

Returns items where the property value is **less than** the specified value.

```typescript
filter(products, { price: { $lt: 500 } });
// → Returns: Mouse ($25) and Monitor ($450)
```

### `$lte` - Less Than or Equal

Returns items where the property value is **less than or equal to** the specified value.

```typescript
filter(products, { price: { $lte: 450 } });
// → Returns: Mouse ($25) and Monitor ($450)
```

### `$eq` - Equal

Returns items where the property value **equals** the specified value.

```typescript
filter(products, { price: { $eq: 450 } });
// → Returns: Monitor ($450)
```

### `$ne` - Not Equal

Returns items where the property value **does not equal** the specified value.

```typescript
filter(products, { price: { $ne: 25 } });
// → Returns: Laptop ($1200) and Monitor ($450)
```

### Date Comparisons

All comparison operators work with dates:

```typescript
const orders = [
  { id: 1, date: new Date('2025-01-15') },
  { id: 2, date: new Date('2025-02-20') },
  { id: 3, date: new Date('2025-03-10') }
];

filter(orders, {
  date: {
    $gte: new Date('2025-02-01'),
    $lte: new Date('2025-03-31')
  }
});
// → Returns: orders 2 and 3
```

### Range Queries

Combine `$gte` and `$lte` (or `$gt` and `$lt`) to create range queries:

```typescript
filter(products, {
  price: { $gte: 100, $lte: 500 }
});
// → Returns products with price between $100 and $500 (inclusive)
```

## Array Operators

### `$in` - In Array

Returns items where the property value is **in** the specified array.

```typescript
const products = [
  { id: 1, category: 'Electronics' },
  { id: 2, category: 'Furniture' },
  { id: 3, category: 'Books' }
];

filter(products, {
  category: { $in: ['Electronics', 'Books'] }
});
// → Returns: products 1 and 3
```

### `$nin` - Not In Array

Returns items where the property value is **not in** the specified array.

```typescript
filter(products, {
  category: { $nin: ['Furniture'] }
});
// → Returns: products 1 and 3
```

### `$contains` - Array Contains

Returns items where the array property **contains** the specified value.

```typescript
const products = [
  { name: 'Laptop', tags: ['computer', 'portable'] },
  { name: 'Mouse', tags: ['computer', 'accessory'] },
  { name: 'Desk', tags: ['office', 'large'] }
];

filter(products, {
  tags: { $contains: 'computer' }
});
// → Returns: Laptop and Mouse
```

### `$size` - Array Size

Returns items where the array property has the **specified length**.

```typescript
filter(products, {
  tags: { $size: 2 }
});
// → Returns all products (all have exactly 2 tags)
```

## String Operators

All string operators respect the `caseSensitive` configuration option (defaults to `false`).

### `$startsWith` - Starts With

Returns items where the string property **starts with** the specified value.

```typescript
const users = [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Alex' }
];

filter(users, {
  name: { $startsWith: 'Al' }
});
// → Returns: Alice and Alex
```

### `$endsWith` - Ends With

Returns items where the string property **ends with** the specified value.

```typescript
filter(users, {
  name: { $endsWith: 'ce' }
});
// → Returns: Alice
```

### `$contains` - String Contains

Returns items where the string property **contains** the specified substring.

```typescript
filter(users, {
  name: { $contains: 'li' }
});
// → Returns: Alice
```

### Case Sensitivity

By default, string operators are case-insensitive:

```typescript
filter(users, { name: { $startsWith: 'al' } });
// → Returns: Alice and Alex (case-insensitive)

filter(users, { name: { $startsWith: 'al' } }, { caseSensitive: true });
// → Returns: [] (case-sensitive, no match)
```

## Combining Operators

### Multiple Operators on Same Property

You can use multiple operators on the same property:

```typescript
filter(products, {
  price: {
    $gte: 100,
    $lte: 500,
    $ne: 300
  }
});
// → Returns products priced between $100-$500, excluding $300
```

### Multiple Properties with Operators

You can use operators on different properties:

```typescript
filter(products, {
  price: { $gte: 100 },
  category: { $in: ['Electronics', 'Furniture'] },
  name: { $startsWith: 'M' }
});
// → Returns products matching all conditions
```

### Mixing Operators with Legacy Syntax

Operators work seamlessly with the existing filter syntax:

```typescript
filter(products, {
  category: 'Electronics',           // Simple equality
  name: 'M%',                         // Wildcard pattern
  price: { $gte: 100, $lte: 500 }   // Operators
});
```

## Real-World Examples

### E-commerce Product Filtering

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  tags: string[];
  inStock: boolean;
  rating: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Laptop Pro',
    price: 1200,
    category: 'Electronics',
    tags: ['computer', 'portable', 'gaming'],
    inStock: true,
    rating: 4.5
  },
  // ... more products
];

// Find affordable electronics in stock
filter(products, {
  category: { $in: ['Electronics', 'Accessories'] },
  price: { $lte: 500 },
  inStock: { $eq: true }
});

// Find highly-rated gaming products
filter(products, {
  tags: { $contains: 'gaming' },
  rating: { $gte: 4.0 }
});

// Find products with specific name patterns
filter(products, {
  name: { $startsWith: 'Laptop' },
  price: { $lt: 1500 }
});
```

### User Management

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  age: number;
  roles: string[];
  createdAt: Date;
}

const users: User[] = [
  // ... user data
];

// Find adult users created this year
filter(users, {
  age: { $gte: 18 },
  createdAt: {
    $gte: new Date('2025-01-01'),
    $lte: new Date('2025-12-31')
  }
});

// Find users with specific roles
filter(users, {
  roles: { $contains: 'admin' }
});

// Find users with email from specific domains
filter(users, {
  email: { $endsWith: '@company.com' }
});
```

### Analytics and Reporting

```typescript
interface Order {
  id: number;
  customerId: number;
  amount: number;
  status: string;
  items: string[];
  orderDate: Date;
}

const orders: Order[] = [
  // ... order data
];

// High-value orders from last quarter
filter(orders, {
  amount: { $gte: 1000 },
  orderDate: {
    $gte: new Date('2025-01-01'),
    $lte: new Date('2025-03-31')
  },
  status: { $in: ['completed', 'shipped'] }
});

// Orders with specific products
filter(orders, {
  items: { $contains: 'PRODUCT-123' },
  amount: { $lt: 500 }
});
```

## Type Safety

All operators are fully typed with TypeScript:

```typescript
import type { ComparisonOperators, ArrayOperators, StringOperators } from '@mcabreradev/filter';

// Type-safe operator usage
const priceFilter: ComparisonOperators = {
  $gte: 100,
  $lte: 500
};

const categoryFilter: ArrayOperators = {
  $in: ['Electronics', 'Furniture']
};

const nameFilter: StringOperators = {
  $startsWith: 'Lap'
};
```

## Performance Notes

- Operators are optimized with early exit strategies
- Multiple operators on the same property are evaluated efficiently
- String operators respect the global `caseSensitive` configuration
- Operator detection is cached for repeated queries (when `enableCache: true`)

## Migration from v3.x

Operators are a **new feature** in v4.0.0 and are 100% backward compatible. All existing v3.x syntax continues to work:

```typescript
// v3.x syntax still works
filter(users, 'Berlin');
filter(users, { city: 'Berlin' });
filter(users, (u) => u.age > 25);

// v4.0.0 new operator syntax
filter(users, { age: { $gt: 25 } });
```

## Further Reading

- [Configuration API](./README.md#configuration-api)
- [Migration Guide](./MIGRATION.md)
- [Full API Documentation](./README.md)

