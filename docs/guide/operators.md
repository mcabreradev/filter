---
title: Operators Guide
description: Complete guide to all 18 MongoDB-style operators in @mcabreradev/filter
---

# Operators Guide (v5.0.0)

This guide covers all the MongoDB-style operators available in `@mcabreradev/filter` v5.0.0.

## Table of Contents

- [Comparison Operators](#comparison-operators)
- [Array Operators](#array-operators)
- [String Operators](#string-operators)
- [Logical Operators](#logical-operators)
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

### `$regex` - Regular Expression Match

Matches strings against a regular expression pattern. Accepts either a string pattern or a RegExp object.

```typescript
// String pattern
filter(users, { email: { $regex: '^[a-z]+@example\\.com$' } });
// → Returns users with emails matching the pattern

// RegExp object
filter(users, { phone: { $regex: /^\+1-\d{3}-\d{4}$/ } });
// → Returns users with US phone numbers

// Complex patterns
filter(products, { sku: { $regex: '^[A-Z]{3}-\\d{4}-[A-Z]$' } });
// → Returns products with SKU format like "ABC-1234-X"

// Email validation
filter(users, { email: { $regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' } });
// → Returns users with valid email format

// Phone number patterns
filter(users, { phone: { $regex: '^\\+1-\\d{3}-\\d{4}$' } });
// → Returns US phone numbers in format +1-555-0123
```

**Case Sensitivity:**
- String patterns respect the `caseSensitive` config (default: case-insensitive)
- RegExp objects use their own flags (e.g., `/pattern/i` for case-insensitive)

```typescript
// Case-insensitive by default
filter(users, { name: { $regex: '^alice$' } });
// → Returns: Alice (case-insensitive)

// Case-sensitive with config
filter(users, { name: { $regex: '^alice$' } }, { caseSensitive: true });
// → Returns: [] (no match)

// Case-insensitive with RegExp flag
filter(users, { name: { $regex: /^alice$/i } });
// → Returns: Alice (case-insensitive regardless of config)
```

**Common Use Cases:**
- Email validation: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
- Phone numbers: `^\+\d{1,3}-\d{3}-\d{4}$`
- Zip codes: `^\d{5}(-\d{4})?$`
- Usernames: `^[a-zA-Z0-9_]{3,16}$`
- URLs: `^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$`

### `$match` - Pattern Match (Alias)

`$match` is an alias for `$regex` and works identically.

```typescript
filter(users, { username: { $match: '^[a-z]+\\d+$' } });
// Same as: { username: { $regex: '^[a-z]+\\d+$' } }

// Using RegExp object
filter(products, { code: { $match: /^[A-Z]{2}\d{4}$/ } });
// → Returns products with codes like "AB1234"
```

### Case Sensitivity

By default, string operators are case-insensitive:

```typescript
filter(users, { name: { $startsWith: 'al' } });
// → Returns: Alice and Alex (case-insensitive)

filter(users, { name: { $startsWith: 'al' } }, { caseSensitive: true });
// → Returns: [] (case-sensitive, no match)
```

### Advanced Regex Patterns

#### Email Validation

```typescript
const users = [
  { email: 'valid@example.com' },
  { email: 'invalid@' },
  { email: 'another.valid+tag@domain.co.uk' }
];

// RFC 5322 simplified email pattern
filter(users, {
  email: { $regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }
});
// → Returns: valid@example.com, another.valid+tag@domain.co.uk
```

#### Phone Number Patterns

```typescript
const contacts = [
  { phone: '+1-555-0123' },
  { phone: '555-0123' },
  { phone: '+44-20-7123-4567' },
  { phone: 'invalid' }
];

// US phone numbers
filter(contacts, {
  phone: { $regex: '^\\+1-\\d{3}-\\d{4}$' }
});
// → Returns: +1-555-0123

// International format
filter(contacts, {
  phone: { $regex: '^\\+\\d{1,3}-\\d{2,4}-\\d{4,10}$' }
});
// → Returns: +1-555-0123, +44-20-7123-4567
```

#### URL Validation

```typescript
const links = [
  { url: 'https://example.com' },
  { url: 'http://sub.domain.com/path' },
  { url: 'ftp://files.com' },
  { url: 'not-a-url' }
];

// HTTP/HTTPS URLs only
filter(links, {
  url: { $regex: '^https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(/.*)?$' }
});
// → Returns: https://example.com, http://sub.domain.com/path
```

#### Username Validation

```typescript
const users = [
  { username: 'john_doe123' },
  { username: 'alice' },
  { username: 'bob@invalid' },
  { username: 'x' }
];

// Alphanumeric + underscore, 3-16 characters
filter(users, {
  username: { $regex: '^[a-zA-Z0-9_]{3,16}$' }
});
// → Returns: john_doe123, alice
```

#### Postal Code Patterns

```typescript
const addresses = [
  { zip: '12345' },
  { zip: '12345-6789' },
  { zip: 'SW1A 1AA' },
  { zip: 'invalid' }
];

// US ZIP codes (5 digits or ZIP+4)
filter(addresses, {
  zip: { $regex: '^\\d{5}(-\\d{4})?$' }
});
// → Returns: 12345, 12345-6789

// UK postcodes
filter(addresses, {
  zip: { $regex: '^[A-Z]{1,2}\\d{1,2}[A-Z]?\\s?\\d[A-Z]{2}$' }
});
// → Returns: SW1A 1AA
```

#### Case-Insensitive Regex

```typescript
// Using string pattern (respects caseSensitive config)
filter(users, {
  name: { $regex: '^john' }
}, { caseSensitive: false });
// → Matches: John, JOHN, john

// Using RegExp with flags (ignores config)
filter(users, {
  name: { $regex: /^john/i }
});
// → Always case-insensitive
```

#### Complex Patterns

```typescript
// Product SKU format: ABC-1234-X
filter(products, {
  sku: { $regex: '^[A-Z]{3}-\\d{4}-[A-Z]$' }
});

// Date format: YYYY-MM-DD
filter(records, {
  date: { $regex: '^\\d{4}-\\d{2}-\\d{2}$' }
});

// IPv4 address
filter(servers, {
  ip: { $regex: '^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$' }
});

// Credit card (basic pattern)
filter(payments, {
  card: { $regex: '^\\d{4}-\\d{4}-\\d{4}-\\d{4}$' }
});
```

#### Performance Considerations

```typescript
// ✅ Good: Compile regex once
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
filter(users, { email: { $regex: emailPattern } });

// ⚠️ Less efficient: String pattern compiled on each filter
filter(users, { email: { $regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' } });

// 💡 Best: Use simpler operators when possible
filter(users, { email: { $endsWith: '@company.com' } });
```

#### Common Regex Patterns Reference

| Pattern | Regex | Example |
|---------|-------|---------|
| Email | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` | `user@example.com` |
| US Phone | `^\+1-\d{3}-\d{4}$` | `+1-555-0123` |
| URL | `^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$` | `https://example.com` |
| ZIP Code | `^\d{5}(-\d{4})?$` | `12345` or `12345-6789` |
| Username | `^[a-zA-Z0-9_]{3,16}$` | `john_doe123` |
| Hex Color | `^#[0-9A-Fa-f]{6}$` | `#FF5733` |
| IPv4 | `^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$` | `192.168.1.1` |
| Date (YYYY-MM-DD) | `^\d{4}-\d{2}-\d{2}$` | `2025-10-25` |

#### Escaping Special Characters

Remember to escape special regex characters in string patterns:

```typescript
// Special characters: . * + ? ^ $ { } ( ) | [ ] \

// ❌ Wrong: . matches any character
filter(files, { name: { $regex: 'file.txt' } });

// ✅ Correct: Escape the dot
filter(files, { name: { $regex: 'file\\.txt' } });

// ❌ Wrong: * is invalid regex
filter(files, { name: { $regex: '*.txt' } });

// ✅ Correct: Use .* for wildcard
filter(files, { name: { $regex: '.*\\.txt$' } });
```

## Logical Operators

Logical operators allow you to combine multiple conditions with AND, OR, and NOT logic. They support recursive nesting for complex queries.

### `$and` - Logical AND

Returns items where **all** conditions in the array match.

```typescript
import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'Laptop', price: 1200, category: 'Electronics', inStock: true },
  { name: 'Mouse', price: 25, category: 'Accessories', inStock: true },
  { name: 'Desk', price: 350, category: 'Furniture', inStock: false }
];

// Simple AND - all conditions must match
filter(products, {
  $and: [
    { category: 'Electronics' },
    { inStock: true }
  ]
});
// → Returns: Laptop

// AND with operators
filter(products, {
  $and: [
    { price: { $gte: 100 } },
    { price: { $lte: 500 } },
    { inStock: true }
  ]
});
// → Returns: Desk would match price range but is out of stock, so returns []

// Nested AND conditions
filter(products, {
  $and: [
    { category: { $in: ['Electronics', 'Accessories'] } },
    { price: { $lt: 1000 } },
    { inStock: { $eq: true } }
  ]
});
// → Returns: Mouse
```

**Use Case:** When you need ALL conditions to be true simultaneously.

### `$or` - Logical OR

Returns items where **at least one** condition in the array matches.

```typescript
// Simple OR - any condition can match
filter(products, {
  $or: [
    { category: 'Electronics' },
    { category: 'Accessories' }
  ]
});
// → Returns: Laptop and Mouse

// OR with different properties
filter(products, {
  $or: [
    { price: { $lt: 50 } },
    { category: 'Furniture' }
  ]
});
// → Returns: Mouse ($25) and Desk (Furniture)

// OR with complex conditions
filter(products, {
  $or: [
    { $and: [{ category: 'Electronics' }, { price: { $gt: 1000 } }] },
    { $and: [{ category: 'Accessories' }, { inStock: true }] }
  ]
});
// → Returns: Laptop (Electronics > $1000) and Mouse (Accessories in stock)
```

**Use Case:** When you want items matching ANY of several criteria.

### `$not` - Logical NOT

Returns items where the condition does **NOT** match. Accepts a single expression (not an array).

```typescript
// Simple NOT
filter(products, {
  $not: { category: 'Furniture' }
});
// → Returns: Laptop and Mouse (everything except Furniture)

// NOT with operators
filter(products, {
  $not: { price: { $gt: 500 } }
});
// → Returns: Mouse and Desk (price <= $500)

// NOT with complex conditions
filter(products, {
  $not: {
    $and: [
      { category: 'Furniture' },
      { inStock: false }
    ]
  }
});
// → Returns: Laptop, Mouse, and any Furniture that IS in stock
```

**Use Case:** When you want to exclude items matching certain criteria.

### Nested Logical Operators

Logical operators can be nested to create complex queries:

```typescript
// Complex nested query: (Electronics OR Accessories) AND in stock AND affordable
filter(products, {
  $and: [
    {
      $or: [
        { category: 'Electronics' },
        { category: 'Accessories' }
      ]
    },
    { inStock: true },
    { price: { $lt: 100 } }
  ]
});
// → Returns: Mouse (Accessories, in stock, $25)

// NOT with nested conditions
filter(products, {
  $not: {
    $or: [
      { price: { $gt: 1000 } },
      { inStock: false }
    ]
  }
});
// → Returns: Mouse (not expensive and not out of stock)

// Deeply nested logic
filter(products, {
  $or: [
    {
      $and: [
        { category: 'Electronics' },
        { $not: { price: { $lt: 500 } } }
      ]
    },
    {
      $and: [
        { category: 'Accessories' },
        { inStock: true }
      ]
    }
  ]
});
// → Returns: Laptop (Electronics >= $500) and Mouse (Accessories in stock)
```

### Combining Logical Operators with Field Conditions

You can mix logical operators with regular field-level conditions:

```typescript
// Field condition + logical operator
filter(products, {
  category: 'Electronics',
  $and: [
    { price: { $gte: 100 } },
    { inStock: true }
  ]
});
// → Returns: Laptop (Electronics, price >= $100, in stock)

// Multiple logical operators
filter(products, {
  inStock: true,
  $or: [
    { category: 'Electronics' },
    { price: { $lt: 50 } }
  ],
  $not: { name: { $startsWith: 'Old' } }
});
// → Returns: Items in stock that are either Electronics OR cheap, but NOT starting with "Old"
```

### Real-World Logical Operator Examples

```typescript
interface User {
  name: string;
  age: number;
  role: string;
  active: boolean;
  lastLogin: Date;
}

const users: User[] = [
  { name: 'Alice', age: 30, role: 'admin', active: true, lastLogin: new Date('2025-10-20') },
  { name: 'Bob', age: 25, role: 'user', active: false, lastLogin: new Date('2025-09-15') },
  { name: 'Charlie', age: 35, role: 'moderator', active: true, lastLogin: new Date('2025-10-24') }
];

// Find active admins or moderators
filter(users, {
  $and: [
    { active: true },
    { $or: [{ role: 'admin' }, { role: 'moderator' }] }
  ]
});
// → Returns: Alice and Charlie

// Find users who need attention (inactive OR haven't logged in recently)
filter(users, {
  $or: [
    { active: false },
    { lastLogin: { $lt: new Date('2025-10-01') } }
  ]
});
// → Returns: Bob (inactive and old login)

// Find eligible users (NOT guest AND (active OR recent login))
filter(users, {
  $and: [
    { $not: { role: 'guest' } },
    {
      $or: [
        { active: true },
        { lastLogin: { $gte: new Date('2025-10-15') } }
      ]
    }
  ]
});
// → Returns: Alice and Charlie
```

**Available:** `$and`, `$or`, `$not`

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

Operators are a **new feature** in v5.0.0 and are 100% backward compatible. All existing v3.x syntax continues to work:

```typescript
// v3.x syntax still works
filter(users, 'Berlin');
filter(users, { city: 'Berlin' });
filter(users, (u) => u.age > 25);

// v5.0.0 new operator syntax
filter(users, { age: { $gt: 25 } });
```

## Further Reading

- [Advanced Logical Operators Guide](./logical-operators.md)
- [Lazy Evaluation Guide](./lazy-evaluation.md)
- [Performance Benchmarks](../advanced/performance-benchmarks.md)
- [Security Best Practices](./SECURITY.md)
- [Configuration API](../README.md#configuration-api)
- [Migration Guide](../advanced/migration.md)
- [Full API Documentation](../README.md)

