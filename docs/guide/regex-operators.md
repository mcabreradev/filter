---
title: Regex Operators
description: Pattern matching with regular expressions using $regex and $match
---

# Regex Operators

**New in v5.2.0** - Match strings using powerful regular expression patterns.

## Overview

Regex operators provide flexible pattern matching beyond simple string operations. Use them for:

- Email validation
- Phone number formatting
- URL pattern matching
- Date format validation
- Custom pattern validation

## $regex - Regular Expression Match

Match strings using JavaScript regular expressions.

### Basic Usage

```typescript
import { filter } from '@mcabreradev/filter';

const users = [
  { email: 'user@gmail.com' },
  { email: 'admin@company.com' },
  { email: 'test@GMAIL.com' }
];

// Case-insensitive email matching
filter(users, {
  email: { $regex: /@gmail\.com$/i }
});
// → [{ email: 'user@gmail.com' }, { email: 'test@GMAIL.com' }]
```

### Pattern Validation

```typescript
const products = [
  { sku: 'PROD-001-A' },
  { sku: 'PROD-002-B' },
  { sku: 'SERV-001-A' }
];

// Match SKU pattern: PROD-###-X
filter(products, {
  sku: { $regex: /^PROD-\d{3}-[A-Z]$/ }
});
// → [{ sku: 'PROD-001-A' }, { sku: 'PROD-002-B' }]
```

### Phone Number Validation

```typescript
const contacts = [
  { phone: '+1-555-0100' },
  { phone: '555-0200' },
  { phone: '+1-555-0300' }
];

// Match format: +1-###-####
filter(contacts, {
  phone: { $regex: /^\+1-\d{3}-\d{4}$/ }
});
// → [{ phone: '+1-555-0100' }, { phone: '+1-555-0300' }]
```

## $match - Alias for $regex

`$match` is a more intuitive alias for `$regex`:

```typescript
// These are equivalent:
filter(users, { email: { $regex: /^admin/ } });
filter(users, { email: { $match: /^admin/ } });
```

## Complex Patterns

### URL Validation

```typescript
const links = [
  { url: 'https://example.com/api/v1/users' },
  { url: 'http://test.com/admin' },
  { url: 'https://example.com/api/v2/products' }
];

// Match HTTPS API endpoints (v1 or v2)
filter(links, {
  url: { $regex: /^https:\/\/.*\/api\/v[12]\// }
});
// → HTTPS API v1 and v2 endpoints only
```

### Date Format Matching

```typescript
const records = [
  { date: '2025-01-15' },
  { date: '01/15/2025' },
  { date: '2025-02-20' }
];

// Match YYYY-MM-DD format
filter(records, {
  date: { $regex: /^\d{4}-\d{2}-\d{2}$/ }
});
// → [{ date: '2025-01-15' }, { date: '2025-02-20' }]
```

### Username Validation

```typescript
const users = [
  { username: 'john_doe' },
  { username: 'jane.smith' },
  { username: 'user123' },
  { username: 'invalid user' }
];

// Alphanumeric with underscore, 3-20 characters
filter(users, {
  username: { $regex: /^[a-zA-Z0-9_]{3,20}$/ }
});
// → [{ username: 'john_doe' }, { username: 'user123' }]
```

## Performance Considerations

::: warning Performance Note
Regex operators are powerful but slower than simple string operators. Use `$startsWith`, `$endsWith`, or `$contains` when possible.

**Performance Ranking (fastest to slowest):**
1. Simple string matching
2. Object-based filtering
3. String operators ($startsWith, $endsWith, $contains)
4. **Regex operators** ← You are here
5. Predicate functions
:::

### Optimization Tips

```typescript
// ⚠️ Slower: Regex for simple matching
filter(users, { email: { $regex: /@gmail\.com$/ } });

// ✅ Faster: String operator
filter(users, { email: { $endsWith: '@gmail.com' } });

// ⚠️ Slower: Regex for prefix
filter(products, { name: { $regex: /^Laptop/ } });

// ✅ Faster: String operator
filter(products, { name: { $startsWith: 'Laptop' } });
```

## Real-World Examples

### Email Domain Filtering

```typescript
const users = [
  { email: 'user@gmail.com' },
  { email: 'admin@company.com' },
  { email: 'test@outlook.com' }
];

// Match common email providers
filter(users, {
  email: { $regex: /@(gmail|outlook|yahoo)\.com$/i }
});
```

### Credit Card Validation

```typescript
const payments = [
  { card: '4111-1111-1111-1111' },
  { card: '5500-0000-0000-0004' },
  { card: 'invalid' }
];

// Match Visa cards (start with 4, 16 digits)
filter(payments, {
  card: { $regex: /^4\d{3}-\d{4}-\d{4}-\d{4}$/ }
});
```

### IP Address Validation

```typescript
const logs = [
  { ip: '192.168.1.1' },
  { ip: '10.0.0.1' },
  { ip: 'invalid' }
];

// Simple IP pattern (not perfect but practical)
filter(logs, {
  ip: { $regex: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/ }
});
```

## Combining with Other Operators

```typescript
// Regex + comparison operators
filter(products, {
  sku: { $regex: /^PROD-/ },
  price: { $gte: 100, $lte: 500 }
});

// Regex + logical operators
filter(users, {
  $or: [
    { email: { $regex: /@gmail\.com$/i } },
    { email: { $regex: /@outlook\.com$/i } }
  ],
  isActive: true
});
```

## Case Sensitivity

```typescript
// Case-insensitive (use 'i' flag)
filter(users, {
  email: { $regex: /@GMAIL\.COM$/i }  // Matches any case
});

// Case-sensitive (no flag)
filter(users, {
  email: { $regex: /@gmail\.com$/ }  // Exact case only
});
```

## Common Patterns

### Alphanumeric

```typescript
{ field: { $regex: /^[a-zA-Z0-9]+$/ } }
```

### Email

```typescript
{ email: { $regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } }
```

### Phone (US)

```typescript
{ phone: { $regex: /^\+?1?\d{10}$/ } }
```

### URL

```typescript
{ url: { $regex: /^https?:\/\/.+/ } }
```

### Hex Color

```typescript
{ color: { $regex: /^#[0-9A-Fa-f]{6}$/ } }
```

## Next Steps

- Learn about [String Operators](/guide/operators#string-operators) for simpler patterns
- Explore [Logical Operators](/guide/logical-operators) for complex queries
- Read about [Performance Optimization](/advanced/performance) strategies

::: tip Best Practice
Use regex operators for complex patterns that can't be expressed with simple string operators. For basic prefix/suffix/substring matching, prefer `$startsWith`, `$endsWith`, and `$contains`.
:::

