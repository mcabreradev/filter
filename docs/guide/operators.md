---
title: Operators Guide
description: Complete reference for all 40+ MongoDB-style operators in @mcabreradev/filter
---

# Operators Guide (v5.8.2)

This comprehensive guide covers all MongoDB-style operators available in `@mcabreradev/filter` v5.8.2.

## Table of Contents

- [Comparison Operators](#comparison-operators)
- [Array Operators](#array-operators)
- [String Operators](#string-operators)
- [Logical Operators](#logical-operators)
- [Geospatial Operators](#geospatial-operators)
- [DateTime Operators](#datetime-operators)
- [Combining Operators](#combining-operators)
- [Real-World Examples](#real-world-examples)
- [Performance Considerations](#performance-considerations)
- [Type Safety](#type-safety)

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

### Array Syntax - Syntactic Sugar for `$in`

You can use array values directly as a shorthand for the `$in` operator. This provides a cleaner, more intuitive syntax for OR logic.

#### Basic Usage

```typescript
const users = [
  { name: 'Alice', city: 'Berlin', age: 30 },
  { name: 'Bob', city: 'London', age: 25 },
  { name: 'Charlie', city: 'Berlin', age: 35 },
  { name: 'David', city: 'Paris', age: 30 }
];

// Array syntax (syntactic sugar)
filter(users, { city: ['Berlin', 'London'] });
// → Returns: Alice, Bob, Charlie

// Equivalent explicit $in operator
filter(users, { city: { $in: ['Berlin', 'London'] } });
// → Returns: Alice, Bob, Charlie (identical result)
```

#### How It Works

When you provide an **array as a property value** (without an explicit operator), the filter automatically applies **OR logic** to match any value in the array:

```typescript
// These are functionally equivalent:
{ city: ['Berlin', 'London', 'Paris'] }
{ city: { $in: ['Berlin', 'London', 'Paris'] } }

// Both mean: city === 'Berlin' OR city === 'London' OR city === 'Paris'
```

#### Combining with AND Logic

Array syntax (OR logic) combines with other properties using AND logic:

```typescript
// Find users in Berlin OR London AND age 30
filter(users, {
  city: ['Berlin', 'London'],
  age: 30
});
// → Returns: Alice (Berlin, age 30)
// Logic: (city === 'Berlin' OR city === 'London') AND age === 30
```

#### Multiple Array Properties

You can use arrays on multiple properties - each applies OR logic independently:

```typescript
// Find users in (Berlin OR Paris) AND age (30 OR 35)
filter(users, {
  city: ['Berlin', 'Paris'],
  age: [30, 35]
});
// → Returns: Alice (Berlin, 30), Charlie (Berlin, 35), David (Paris, 30)
// Logic: (city === 'Berlin' OR city === 'Paris') AND (age === 30 OR age === 35)
```

#### Wildcard Support

Array syntax supports wildcards within array values:

```typescript
// Match cities starting with 'B' or ending with 'is'
filter(users, { city: ['B%', '%is'] });
// → Returns: Bob (London matches 'B%'), David (Paris matches '%is')

// Underscore wildcard
filter(users, { city: ['_erlin', 'L_ndon'] });
// → Returns: Alice (Berlin), Bob (London)
```

#### Works with All Types

Array syntax works with strings, numbers, booleans, and other primitive types:

```typescript
// Numbers
filter(users, { age: [25, 30, 35] });
// → Returns users aged 25, 30, or 35

// Strings
filter(users, { name: ['Alice', 'Bob'] });
// → Returns Alice and Bob

// Booleans
filter(products, { inStock: [true] });
// → Returns products in stock
```

#### Edge Cases

```typescript
// Empty array matches nothing
filter(users, { city: [] });
// → Returns: []

// Single-element array
filter(users, { city: ['Berlin'] });
// → Returns: Alice, Charlie (same as { city: 'Berlin' })
```

#### Important: Explicit Operators Take Precedence

When you use an **explicit operator**, the array syntax does NOT apply:

```typescript
// Array syntax - applies OR logic
filter(users, { city: ['Berlin', 'London'] });
// → Matches: Berlin OR London

// Explicit $in operator - uses operator logic
filter(users, { city: { $in: ['Berlin', 'London'] } });
// → Matches: Berlin OR London (same result, explicit syntax)

// Other operators are NOT affected by array syntax
filter(users, { age: { $gte: 25, $lte: 35 } });
// → Uses operator logic, NOT array syntax
```

#### When to Use Array Syntax vs `$in`

**Use Array Syntax when:**
- You want clean, readable code
- You're filtering by multiple exact values
- You want OR logic on a single property

```typescript
// ✅ Clean and intuitive
filter(users, { status: ['active', 'pending'] });
```

**Use Explicit `$in` when:**
- You want to be explicit about using the $in operator
- You're combining with other operators
- You're migrating from MongoDB-style queries

```typescript
// ✅ Explicit and clear intent
filter(users, { status: { $in: ['active', 'pending'] } });
```

Both syntaxes produce **identical results** - choose based on your preference and code style.

#### Real-World Examples

```typescript
// E-commerce: Filter products by multiple categories
filter(products, {
  category: ['Electronics', 'Accessories'],
  price: { $lte: 500 },
  inStock: true
});

// User management: Find users with specific roles
filter(users, {
  role: ['admin', 'moderator'],
  active: true
});

// Analytics: Orders from multiple statuses
filter(orders, {
  status: ['completed', 'shipped', 'delivered'],
  amount: { $gte: 100 }
});

// Content filtering: Posts with multiple tags
filter(posts, {
  tags: ['javascript', 'typescript', 'react'],
  published: true
});
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

## Geospatial Operators

**New in v5.6.0:** Filter data by geographic location with powerful spatial operators.

### `$near` - Proximity Search

Find points within a specified radius of a center point. Uses the spherical law of cosines for distance calculation.

```typescript
import { filter, type GeoPoint } from '@mcabreradev/filter';

interface Restaurant {
  name: string;
  location: GeoPoint;
  rating: number;
}

const restaurants: Restaurant[] = [
  { name: 'Berlin Bistro', location: { lat: 52.52, lng: 13.405 }, rating: 4.5 },
  { name: 'Pasta Paradise', location: { lat: 52.521, lng: 13.406 }, rating: 4.8 },
  { name: 'Sushi Spot', location: { lat: 52.53, lng: 13.42 }, rating: 4.6 },
  { name: 'Taco Time', location: { lat: 52.55, lng: 13.45 }, rating: 4.2 }
];

const userLocation: GeoPoint = { lat: 52.52, lng: 13.405 };

filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 2000
    }
  }
});
// → Returns: Berlin Bistro, Pasta Paradise, Sushi Spot (within 2km)
```

**With minimum distance:**

```typescript
filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 5000,
      minDistanceMeters: 1000
    }
  }
});
// → Excludes restaurants too close (< 1km) or too far (> 5km)
```

**Combined with other filters:**

```typescript
filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 3000
    }
  },
  rating: { $gte: 4.5 }
});
// → High-rated restaurants within 3km
```

### `$geoBox` - Bounding Box

Find points within a rectangular area defined by southwest and northeast corners.

```typescript
interface Store {
  name: string;
  location: GeoPoint;
  inStock: boolean;
}

const stores: Store[] = [
  { name: 'Store A', location: { lat: 52.52, lng: 13.405 }, inStock: true },
  { name: 'Store B', location: { lat: 52.525, lng: 13.415 }, inStock: true },
  { name: 'Store C', location: { lat: 52.55, lng: 13.45 }, inStock: false }
];

filter(stores, {
  location: {
    $geoBox: {
      southwest: { lat: 52.51, lng: 13.4 },
      northeast: { lat: 52.54, lng: 13.43 }
    }
  }
});
// → Returns: Store A, Store B (within delivery area)
```

**Use case - Delivery zone validation:**

```typescript
filter(stores, {
  location: {
    $geoBox: {
      southwest: { lat: 52.5, lng: 13.3 },
      northeast: { lat: 52.6, lng: 13.5 }
    }
  },
  inStock: true
});
// → Available stores in delivery zone
```

### `$geoPolygon` - Polygon Containment

Find points inside a custom polygon area. Uses ray casting algorithm for point-in-polygon detection.

```typescript
interface Property {
  address: string;
  location: GeoPoint;
  price: number;
}

const properties: Property[] = [
  { address: '123 Main St', location: { lat: 52.52, lng: 13.405 }, price: 500000 },
  { address: '456 Oak Ave', location: { lat: 52.525, lng: 13.415 }, price: 450000 },
  { address: '789 Elm Rd', location: { lat: 52.55, lng: 13.45 }, price: 600000 }
];

filter(properties, {
  location: {
    $geoPolygon: {
      points: [
        { lat: 52.51, lng: 13.4 },
        { lat: 52.54, lng: 13.4 },
        { lat: 52.54, lng: 13.43 },
        { lat: 52.51, lng: 13.43 }
      ]
    }
  }
});
// → Properties within neighborhood boundary
```

**Use case - School district search:**

```typescript
const schoolDistrict = {
  points: [
    { lat: 52.5, lng: 13.3 },
    { lat: 52.55, lng: 13.35 },
    { lat: 52.6, lng: 13.3 },
    { lat: 52.6, lng: 13.5 },
    { lat: 52.5, lng: 13.5 }
  ]
};

filter(properties, {
  location: {
    $geoPolygon: schoolDistrict
  },
  price: { $lte: 500000 }
});
// → Affordable properties in school district
```

### Combining Geospatial Operators

You can combine geospatial operators with all other operators:

```typescript
filter(restaurants, {
  $and: [
    {
      location: {
        $near: {
          center: userLocation,
          maxDistanceMeters: 3000
        }
      }
    },
    {
      $or: [
        { cuisine: 'Italian' },
        { cuisine: 'Japanese' }
      ]
    },
    {
      rating: { $gte: 4.5 },
      isOpen: true
    }
  ]
});
// → Nearby, open, highly-rated Italian or Japanese restaurants
```

### Distance Utilities

You can also use the distance calculation utilities directly:

```typescript
import { calculateDistance, isValidGeoPoint } from '@mcabreradev/filter';

const berlin: GeoPoint = { lat: 52.52, lng: 13.405 };
const paris: GeoPoint = { lat: 48.8566, lng: 2.3522 };

const distance = calculateDistance(berlin, paris);
console.log(distance);
// → ~878000 (meters)

if (isValidGeoPoint({ lat: 91, lng: 0 })) {
  // Invalid - latitude must be -90 to 90
}

if (isValidGeoPoint({ lat: 52.52, lng: 13.405 })) {
  // Valid coordinates
}
```

### Coordinate Validation

All geospatial operators automatically validate coordinates:

- **Latitude:** Must be between -90 and 90
- **Longitude:** Must be between -180 and 180
- Invalid coordinates are automatically excluded from results

### Performance Considerations

- **Distance calculation:** Uses spherical law of cosines (fast approximation)
- **Bounding box:** Fastest for rectangular areas
- **Polygon:** Efficient ray casting algorithm
- **Lazy evaluation:** Works with `filterLazy` for large datasets

```typescript
import { filterLazy } from '@mcabreradev/filter';

const nearbyLazy = filterLazy(millionRestaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 5000
    }
  }
});

for (const restaurant of nearbyLazy) {
  if (shouldStop) break;
}
```

### Real-World Examples

**Restaurant finder:**

```typescript
const findNearbyRestaurants = (userLoc: GeoPoint, cuisine?: string) => {
  return filter(restaurants, {
    location: {
      $near: {
        center: userLoc,
        maxDistanceMeters: 5000
      }
    },
    ...(cuisine && { cuisine }),
    isOpen: true,
    rating: { $gte: 4.0 }
  });
};
```

**Delivery zone check:**

```typescript
const isInDeliveryZone = (address: GeoPoint, restaurantLoc: GeoPoint): boolean => {
  const nearby = filter([{ location: address }], {
    location: {
      $near: {
        center: restaurantLoc,
        maxDistanceMeters: 8000
      }
    }
  });
  
  return nearby.length > 0;
};
```

**Property search by neighborhood:**

```typescript
const findPropertiesInNeighborhood = (boundary: GeoPoint[], maxPrice: number) => {
  return filter(properties, {
    location: {
      $geoPolygon: { points: boundary }
    },
    price: { $lte: maxPrice },
    status: 'available'
  });
};
```

**Available:** `$near`, `$geoBox`, `$geoPolygon`

## DateTime Operators

Filter data by date and time with powerful temporal operators.

### `$recent` - Recent Time Period

Returns items where the date is within the last N days/hours/minutes from now.

```typescript
import { filter } from '@mcabreradev/filter';

interface Event {
  name: string;
  date: Date;
}

const events: Event[] = [
  { name: 'Meeting', date: new Date('2025-11-15') },
  { name: 'Conference', date: new Date('2025-10-20') }
];

// Events in last 7 days
filter(events, {
  date: { $recent: { days: 7 } }
});
// → Returns recent events

// Activities in last 24 hours
filter(activities, {
  timestamp: { $recent: { hours: 24 } }
});

// Recent notifications (last 30 minutes)
filter(notifications, {
  createdAt: { $recent: { minutes: 30 } }
});

// Users who logged in recently
filter(users, {
  lastLogin: { $recent: { days: 7 } }
});
```

### `$upcoming` - Upcoming Time Period

Returns items where the date is within the next N days/hours/minutes from now.

```typescript
// Events in next 7 days
filter(events, {
  date: { $upcoming: { days: 7 } }
});

// Meetings in next 2 hours
filter(meetings, {
  startTime: { $upcoming: { hours: 2 } }
});

// Reminders in next 15 minutes
filter(reminders, {
  scheduledAt: { $upcoming: { minutes: 15 } }
});

// Subscriptions expiring soon
filter(subscriptions, {
  expiresAt: { $upcoming: { days: 30 } }
});
```

### `$dayOfWeek` - Day of Week

Returns items where the date falls on specific days of the week (0=Sunday, 6=Saturday).

```typescript
// Weekday events (Monday-Friday)
filter(events, {
  date: { $dayOfWeek: [1, 2, 3, 4, 5] }
});

// Weekend events
filter(events, {
  date: { $dayOfWeek: [0, 6] }
});

// Monday meetings
filter(meetings, {
  scheduledAt: { $dayOfWeek: [1] }
});

// Mid-week appointments (Wed, Thu)
filter(appointments, {
  date: { $dayOfWeek: [3, 4] }
});
```

**Day Numbers:**
- `0` - Sunday
- `1` - Monday
- `2` - Tuesday
- `3` - Wednesday
- `4` - Thursday
- `5` - Friday
- `6` - Saturday

### `$timeOfDay` - Time of Day

Returns items where the time falls within a specified hour range (24-hour format).

```typescript
// Business hours (9 AM - 5 PM)
filter(appointments, {
  scheduledAt: { $timeOfDay: { start: 9, end: 17 } }
});

// Morning events (6 AM - 12 PM)
filter(events, {
  startTime: { $timeOfDay: { start: 6, end: 12 } }
});

// Evening activities (6 PM - 11 PM)
filter(activities, {
  time: { $timeOfDay: { start: 18, end: 23 } }
});
```

### `$age` - Age Calculation

Calculate and filter by age from a birth/start date.

```typescript
// Adults (18-65 years old)
filter(users, {
  birthDate: { $age: { min: 18, max: 65 } }
});

// Minors (under 18)
filter(users, {
  birthDate: { $age: { max: 18 } }
});

// Seniors (65+)
filter(users, {
  birthDate: { $age: { min: 65 } }
});

// Young adults (18-25)
filter(users, {
  birthDate: { $age: { min: 18, max: 25 } }
});

// Accounts older than 6 months
filter(accounts, {
  createdAt: { $age: { min: 6, unit: 'months' } }
});

// Items in inventory for more than 90 days
filter(inventory, {
  receivedDate: { $age: { min: 90, unit: 'days' } }
});
```

**Age Units:**
- `'years'` (default)
- `'months'`
- `'days'`

### `$isWeekday` - Is Weekday

Returns items where the date falls on a weekday (Monday-Friday).

```typescript
// Events on weekdays
filter(events, {
  date: { $isWeekday: true }
});

// Weekend events
filter(events, {
  date: { $isWeekday: false }
});

// Users who logged in on weekdays
filter(users, {
  lastLogin: { $isWeekday: true }
});
```

### `$isWeekend` - Is Weekend

Returns items where the date falls on a weekend (Saturday-Sunday).

```typescript
// Weekend events
filter(events, {
  date: { $isWeekend: true }
});

// Weekday events
filter(events, {
  date: { $isWeekend: false }
});

// Orders placed on weekends
filter(orders, {
  createdAt: { $isWeekend: true }
});
```

### `$isBefore` - Is Before Date

Returns items where the date is before a specific date.

```typescript
// Events before year end
filter(events, {
  date: { $isBefore: new Date('2025-12-31') }
});

// Users registered before launch
filter(users, {
  registeredAt: { $isBefore: new Date('2024-01-01') }
});
```

**Note:** Equivalent to `$lt` with dates.

### `$isAfter` - Is After Date

Returns items where the date is after a specific date.

```typescript
// Events after today
filter(events, {
  date: { $isAfter: new Date() }
});

// Recent signups (after Jan 1)
filter(users, {
  registeredAt: { $isAfter: new Date('2025-01-01') }
});
```

**Note:** Equivalent to `$gt` with dates.

### DateTime Operator Use Cases

**Event Management:**

```typescript
// Upcoming weekday morning events
filter(events, {
  date: {
    $upcoming: { days: 7 },
    $dayOfWeek: [1, 2, 3, 4, 5]
  },
  startTime: {
    $timeOfDay: { start: 9, end: 12 }
  }
});

// Events starting in next 2 hours
filter(events, {
  startTime: { $upcoming: { hours: 2 } }
});
```

**User Analytics:**

```typescript
// Active adult users
filter(users, {
  birthDate: { $age: { min: 18, max: 65 } },
  lastLogin: { $recent: { days: 30 } }
});

// Inactive users (no login in 90 days)
filter(users, {
  lastLogin: { $age: { min: 90, unit: 'days' } }
});

// New registrations this week
filter(users, {
  registeredAt: { $recent: { days: 7 } }
});
```

**E-commerce & Flash Sales:**

```typescript
// Active sales (started recently, ending soon)
filter(products, {
  saleStart: { $recent: { hours: 24 } },
  saleEnd: { $upcoming: { hours: 48 } }
});

// Sales ending soon (next 6 hours)
filter(products, {
  saleEnd: { $upcoming: { hours: 6 } }
});

// Weekend-only sales
filter(products, {
  saleStart: { $isWeekend: true }
});
```

**Appointment Scheduling:**

```typescript
// Business hours appointments (weekdays 9-5)
filter(appointments, {
  scheduledAt: {
    $dayOfWeek: [1, 2, 3, 4, 5],
    $timeOfDay: { start: 9, end: 17 }
  }
});

// Morning appointments (next week)
filter(appointments, {
  scheduledAt: {
    $upcoming: { days: 7 },
    $timeOfDay: { start: 8, end: 12 }
  }
});
```

**Subscription Management:**

```typescript
// Expiring soon (next 7 days)
filter(subscriptions, {
  expiresAt: { $upcoming: { days: 7 } }
});

// New subscriptions (last 30 days)
filter(subscriptions, {
  startDate: { $recent: { days: 30 } }
});

// Long-term subscribers (1+ year)
filter(subscriptions, {
  startDate: { $age: { min: 1, unit: 'years' } }
});
```

**Available:** `$recent`, `$upcoming`, `$dayOfWeek`, `$timeOfDay`, `$age`, `$isWeekday`, `$isWeekend`, `$isBefore`, `$isAfter`

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

## Performance Considerations

### Optimization Strategies

Operators are highly optimized for performance:

**✅ Early Exit Strategies:**
```typescript
// Comparison operators short-circuit on first mismatch
filter(products, {
  price: { $gte: 100, $lte: 500, $ne: 300 }
});
// Stops evaluating remaining operators if one fails
```

**✅ Cached Regex Compilation:**
```typescript
// Regex patterns are compiled once and cached
const emailPattern = /^[a-z]+@example\.com$/;
filter(users, { email: { $regex: emailPattern } });
// Pattern is not recompiled on subsequent calls
```

**✅ Enable Caching for Repeated Queries:**
```typescript
// 530x-1520x faster for repeated queries
filter(largeDataset, expression, { enableCache: true });
```

**✅ Lazy Evaluation for Large Datasets:**
```typescript
import { filterLazy, filterFirst } from '@mcabreradev/filter';

// Process items on-demand (500x faster for partial results)
const first10 = filterFirst(millionRecords, { active: true }, 10);

// Or use lazy iterator
for (const item of filterLazy(millionRecords, { active: true })) {
  if (shouldStop) break; // Early exit
}
```

### Performance Ranking (Fastest to Slowest)

1. **Simple Equality** - Direct property matching
   ```typescript
   filter(users, { city: 'Berlin' })
   ```

2. **Comparison Operators** - Numeric comparisons
   ```typescript
   filter(products, { price: { $gte: 100, $lte: 500 } })
   ```

3. **Array Operators** - Set membership
   ```typescript
   filter(products, { category: { $in: ['A', 'B'] } })
   ```

4. **String Operators** - Prefix/suffix/substring
   ```typescript
   filter(users, { name: { $startsWith: 'John' } })
   ```

5. **Logical Operators** - Complex conditions
   ```typescript
   filter(data, { $and: [{ a: 1 }, { b: 2 }] })
   ```

6. **Regex Operators** - Pattern matching
   ```typescript
   filter(users, { email: { $regex: /@gmail\.com$/i } })
   ```

7. **DateTime Operators** - Temporal calculations
   ```typescript
   filter(events, { date: { $recent: { days: 7 } } })
   ```

8. **Geospatial Operators** - Distance calculations
   ```typescript
   filter(places, { location: { $near: { center, maxDistanceMeters: 5000 } } })
   ```

### Best Practices

**✅ Combine Filters in Single Call:**
```typescript
// Good: Single filter call
filter(products, {
  category: 'Electronics',
  price: { $gte: 100 },
  inStock: true
});

// Avoid: Chaining multiple filters
const filtered1 = filter(products, { category: 'Electronics' });
const filtered2 = filter(filtered1, { price: { $gte: 100 } });
const filtered3 = filter(filtered2, { inStock: true });
```

**✅ Use Simpler Operators When Possible:**
```typescript
// Good: String operator
filter(users, { email: { $endsWith: '@gmail.com' } });

// Slower: Regex for simple pattern
filter(users, { email: { $regex: /@gmail\.com$/i } });
```

**✅ Put Most Restrictive Conditions First:**
```typescript
// Good: Most selective property first
filter(products, {
  inStock: true,              // Eliminates 80% of items
  category: 'Electronics',    // Further filters remaining 20%
  price: { $gte: 100 }       // Final refinement
});
```

**✅ Avoid Deep Nesting:**
```typescript
// Hard to read and maintain
filter(data, {
  $and: [
    { $or: [{ $and: [{ a: 1 }, { b: 2 }] }, { c: 3 }] }
  ]
});

// Better: Flatten when possible
filter(data, {
  $or: [
    { $and: [{ a: 1 }, { b: 2 }] },
    { c: 3 }
  ]
});
```

### Performance Benchmarks

| Operation | Without Cache | With Cache | Speedup |
|-----------|---------------|------------|---------|
| Simple query (10K items) | 5.3ms | 0.01ms | **530x** |
| Regex pattern | 12.1ms | 0.02ms | **605x** |
| Complex nested | 15.2ms | 0.01ms | **1520x** |
| Geospatial $near | 8.4ms | 0.02ms | **420x** |
| DateTime $recent | 6.7ms | 0.01ms | **670x** |

See [Performance Benchmarks](../advanced/performance-benchmarks.md) for detailed analysis.

## Type Safety

All operators are fully typed with TypeScript:

```typescript
import type { 
  ComparisonOperators, 
  ArrayOperators, 
  StringOperators,
  LogicalOperators,
  GeospatialOperators,
  DateTimeOperators,
  Expression
} from '@mcabreradev/filter';

interface Product {
  name: string;
  price: number;
  tags: string[];
  location: GeoPoint;
  createdAt: Date;
}

// Full type safety with autocomplete
const query: Expression<Product> = {
  name: { $startsWith: 'Lap' },        // String operators
  price: { $gte: 100, $lte: 500 },     // Comparison operators
  tags: { $contains: 'sale' },         // Array operators
  location: { $near: { ... } },        // Geospatial operators
  createdAt: { $recent: { days: 7 } }  // DateTime operators
};

filter(products, query);
```

**Type-Safe Operator Usage:**
```typescript
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

const dateFilter: DateTimeOperators = {
  $recent: { days: 7 },
  $dayOfWeek: [1, 2, 3, 4, 5]
};
```

## See Also

- **Guides:**
  - [Logical Operators Guide](./logical-operators.md) - Complex query patterns
  - [DateTime Operators Guide](./datetime-operators.md) - Temporal filtering
  - [Geospatial Operators Guide](./geospatial-operators.md) - Location-based filtering
  - [Regex Operators Guide](./regex-operators.md) - Pattern matching
  - [Lazy Evaluation Guide](./lazy-evaluation.md) - Efficient processing
  - [Memoization Guide](./memoization.md) - Performance optimization

- **API Reference:**
  - [Complete API Reference](../api/reference.md) - All exported functions
  - [Types Reference](../api/types.md) - TypeScript types
  - [Operators API](../api/operators.md) - Technical operator details

- **Advanced:**
  - [Performance Benchmarks](../advanced/performance-benchmarks.md) - Optimization tips
  - [Architecture Guide](../advanced/architecture.md) - Internal design
  - [Migration Guide](../advanced/migration.md) - Upgrade instructions

- **Examples:**
  - [Basic Examples](../examples/basic.md) - Getting started
  - [Advanced Examples](../examples/advanced.md) - Complex scenarios
  - [Real-World Examples](../examples/real-world.md) - Production use cases

---

**Made with ❤️ for the JavaScript/TypeScript community**

