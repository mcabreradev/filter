# Wildcard Patterns

Wildcard patterns provide SQL-like pattern matching for flexible string filtering. Use `%` and `_` to create powerful search queries.

## Overview

Filter supports two wildcard characters:
- **`%`** - Matches any sequence of characters (including zero characters)
- **`_`** - Matches exactly one character

These work similarly to SQL's `LIKE` operator, making them familiar and intuitive.

## Basic Wildcards

### The `%` Wildcard

Matches zero or more characters:

```typescript
const users = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@test.com' },
  { name: 'Charlie', email: 'charlie@example.com' },
];

filter(users, '%example%');
```

### The `_` Wildcard

Matches exactly one character:

```typescript
const products = [
  { code: 'A1B' },
  { code: 'A2B' },
  { code: 'A3C' },
];

filter(products, 'A_B');
```

## Pattern Matching

### Starts With

```typescript
filter(users, 'Alice%');
```

### Ends With

```typescript
filter(users, '%@example.com');
```

### Contains

```typescript
filter(users, '%test%');
```

### Exact Length with Multiple `_`

```typescript
filter(products, 'A__');
```

## Combining Wildcards

### Mixed Wildcards

```typescript
filter(users, 'A%e_');
```

### Multiple `%` Wildcards

```typescript
filter(users, '%@%.com');
```

### Complex Patterns

```typescript
filter(products, 'PRD-____-%');
```

## Case Sensitivity

By default, wildcard matching is case-insensitive:

```typescript
filter(users, '%ALICE%');
```

Enable case-sensitive matching:

```typescript
filter(users, '%Alice%', { caseSensitive: true });
```

## Object-Based Wildcards

Use wildcards with specific properties:

```typescript
filter(users, {
  email: '%@example.com'
});

filter(products, {
  code: 'A_B',
  category: '%electronics%'
});
```

## Real-World Examples

### Email Domain Filtering

```typescript
const users = [
  { name: 'Alice', email: 'alice@company.com' },
  { name: 'Bob', email: 'bob@gmail.com' },
  { name: 'Charlie', email: 'charlie@company.com' },
];

filter(users, { email: '%@company.com' });
```

### Product Code Patterns

```typescript
const products = [
  { code: 'PRD-2024-001', name: 'Widget A' },
  { code: 'PRD-2024-002', name: 'Widget B' },
  { code: 'SVC-2024-001', name: 'Service A' },
];

filter(products, { code: 'PRD-____-___' });
```

### Phone Number Patterns

```typescript
const contacts = [
  { name: 'Alice', phone: '+1-555-1234' },
  { name: 'Bob', phone: '+1-555-5678' },
  { name: 'Charlie', phone: '+44-20-1234' },
];

filter(contacts, { phone: '+1-555-%' });
```

### File Name Matching

```typescript
const files = [
  { name: 'report-2024-01.pdf' },
  { name: 'report-2024-02.pdf' },
  { name: 'summary-2024-01.pdf' },
];

filter(files, { name: 'report-____-__.pdf' });
```

### URL Pattern Matching

```typescript
const links = [
  { url: 'https://example.com/api/users' },
  { url: 'https://example.com/api/products' },
  { url: 'https://test.com/api/users' },
];

filter(links, { url: '%example.com/api/%' });
```

## Advanced Patterns

### Combining with Logical Operators

```typescript
filter(users, {
  $or: [
    { email: '%@company.com' },
    { email: '%@partner.com' }
  ]
});
```

### Multiple Wildcard Properties

```typescript
filter(products, {
  code: 'PRD-%',
  name: '%Widget%'
});
```

### Negation with Wildcards

```typescript
filter(users, '!%@spam.com');

filter(users, {
  email: '!%@blocked.com'
});
```

### Array OR Syntax with Wildcards

```typescript
filter(users, {
  email: ['%@company.com', '%@partner.com']
});
```

## Performance Considerations

### Wildcard Position Matters

```typescript
filter(users, 'Alice%');
```

**Leading wildcards are slower:**

```typescript
filter(users, '%Alice');
```

### Optimization Tips

1. **Avoid Leading Wildcards**: `'%text'` is slower than `'text%'`
2. **Be Specific**: More specific patterns filter faster
3. **Use Operators When Possible**: `{ email: { $endsWith: '@company.com' } }` may be faster than `{ email: '%@company.com' }`
4. **Enable Caching**: For repeated patterns, enable caching

### When to Use Wildcards vs Operators

**Use Wildcards:**
- Simple pattern matching
- SQL-familiar syntax
- Quick prototyping

**Use String Operators:**
- Performance-critical code
- Complex patterns (use regex)
- Type-safe queries

```typescript
filter(users, { email: { $endsWith: '@company.com' } });
```

## Escaping Special Characters

If you need to match literal `%` or `_` characters, wildcards don't support escaping. Use regex operators instead:

```typescript
filter(products, {
  description: { $regex: /100% guaranteed/ }
});
```

## Wildcard Reference

| Pattern | Matches | Example | Matches |
|---------|---------|---------|---------|
| `%` | Any sequence | `%test%` | "test", "testing", "my test" |
| `_` | Single character | `A_C` | "ABC", "A1C", "AXC" |
| `text%` | Starts with | `Alice%` | "Alice", "Alice Smith" |
| `%text` | Ends with | `%@test.com` | "user@test.com" |
| `%text%` | Contains | `%example%` | "example", "my example" |
| `___` | Exact length | `A__` | "ABC", "A12" (3 chars) |
| `%text%text%` | Multiple contains | `%@%.com` | "user@example.com" |

## Comparison with Other Methods

### Wildcards vs String Operators

```typescript
filter(users, '%@example.com');

filter(users, { email: { $endsWith: '@example.com' } });
```

### Wildcards vs Regex

```typescript
filter(users, '%test%');

filter(users, { email: { $regex: /test/i } });
```

### Wildcards vs Predicate Functions

```typescript
filter(users, '%@company.com');

filter(users, (user) => user.email.endsWith('@company.com'));
```

## Case Studies

### User Search

```typescript
interface User {
  username: string;
  email: string;
  fullName: string;
}

const searchTerm = 'john';

filter(users, {
  $or: [
    { username: `%${searchTerm}%` },
    { email: `%${searchTerm}%` },
    { fullName: `%${searchTerm}%` }
  ]
});
```

### Product Catalog

```typescript
filter(products, {
  $and: [
    { sku: 'PRD-%' },
    { name: '%laptop%' },
    { category: '%electronics%' }
  ]
});
```

### Log Filtering

```typescript
const logs = [
  { message: 'ERROR: Connection failed', level: 'error' },
  { message: 'INFO: User logged in', level: 'info' },
  { message: 'ERROR: Database timeout', level: 'error' },
];

filter(logs, {
  level: 'error',
  message: '%Connection%'
});
```

## Best Practices

### 1. Use Specific Patterns

```typescript
filter(users, 'Alice%');
```

### 2. Combine with Other Filters

```typescript
filter(users, {
  email: '%@company.com',
  active: true
});
```

### 3. Consider Performance

```typescript
filter(users, { email: { $endsWith: '@company.com' } });
```

### 4. Document Complex Patterns

```typescript
const emailPattern = '%@company.com';
filter(users, { email: emailPattern });
```

## Troubleshooting

### Pattern Not Matching

Check case sensitivity:

```typescript
filter(users, '%ALICE%', { caseSensitive: false });
```

### Performance Issues

Avoid leading wildcards:

```typescript
filter(users, 'Alice%');
```

### Unexpected Results

Use debug mode to verify:

```typescript
import { filterDebug } from '@mcabreradev/filter';

const result = filterDebug(users, '%test%');
result.print();
```

## See Also

- [String Operators](/guide/operators#string-operators) - Alternative string matching
- [Regex Operators](/guide/regex-operators) - Complex pattern matching
- [Configuration](/guide/configuration) - Case sensitivity options
- [Performance](/advanced/performance-benchmarks) - Optimization tips

