---
title: Migration Guide
description: Migrate from v3.x to v5.x or from native Array.filter()
---

# Migration Guide: v3.x → v5.0.0

## Overview

Version 5.0.0 represents a major refactoring of `@mcabreradev/filter` with improved type safety, modularity, and new features. This guide will help you migrate from v3.x to v5.0.0.

## Breaking Changes

### 1. Minimum Node.js Version

- **v3.x**: Node.js >= 18
- **v5.0.0**: Node.js >= 20

**Action Required**: Ensure your environment is running Node.js 20 or higher.

### 2. TypeScript Strict Mode

v5.0.0 is built with strict TypeScript mode enabled, which may reveal type issues in your consuming code.

**Before (v3.x)**:
```typescript
const result = filter(data, expression);
```

**After (v5.0.0)**:
```typescript
import { filter } from '@mcabreradev/filter';
const result = filter<MyType>(data, expression);
```

### 3. Runtime Validation

v5.0.0+ includes runtime validation using Zod v4. Invalid expressions now throw descriptive errors.

**Before (v3.x)**:
```typescript
filter(data, undefined);
```

**After (v5.0.0)**:
```typescript
filter(data, undefined);
```
**This will now throw**: `Error: Invalid filter expression: Expected string | number | boolean | null | function | object, received undefined`

### 4. Package Manager

The project now standardizes on `pnpm`. While you can still use npm or yarn to install the package, if you're contributing to the project, you'll need pnpm.

## New Features

### 1. Configuration Options

v5.0.0 introduces an optional third parameter for configuration:

```typescript
import { filter } from '@mcabreradev/filter';

const result = filter(data, expression, {
  caseSensitive: true,
  maxDepth: 5,
  enableCache: true,
  customComparator: (a, b) => a === b
});
```

**Available Options**:
- `caseSensitive` (boolean, default: `false`): Enable case-sensitive matching
- `maxDepth` (number, default: `3`): Maximum depth for nested object comparison (1-10)
- `enableCache` (boolean, default: `false`): Enable result caching
- `customComparator` (function, optional): Custom comparison function

### 2. Enhanced Type Safety

v5.0.0 provides better TypeScript support with explicit types:

```typescript
import type { Expression, FilterOptions } from '@mcabreradev/filter';

const expression: Expression<User> = { name: 'John' };
const options: FilterOptions = { caseSensitive: true };

const result = filter<User>(users, expression, options);
```

### 3. Runtime Validation

Expressions and options are now validated at runtime:

```typescript
import { validateExpression, validateOptions } from '@mcabreradev/filter';

try {
  const validated = validateExpression(expression);
  const options = validateOptions({ maxDepth: 15 });
} catch (error) {
  console.error(error.message);
}
```

### 4. Performance Optimizations

- Regex compilation is now cached
- Optional result caching via `enableCache` option
- Configurable maximum depth to prevent excessive recursion

### 5. MongoDB-Style Operators (NEW)

v5.0.0 introduces powerful MongoDB-style operators for advanced filtering:

#### Comparison Operators

```typescript
filter(products, { price: { $gt: 100 } });

filter(products, { price: { $gte: 100, $lte: 500 } });

filter(orders, {
  date: {
    $gte: new Date('2025-01-01'),
    $lte: new Date('2025-12-31')
  }
});

filter(products, { price: { $ne: 0 } });
```

**Available**: `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`

#### Array Operators

```typescript
filter(products, { category: { $in: ['Electronics', 'Books'] } });

filter(products, { category: { $nin: ['Furniture'] } });

filter(products, { tags: { $contains: 'sale' } });

filter(products, { tags: { $size: 3 } });
```

**Available**: `$in`, `$nin`, `$contains`, `$size`

#### String Operators

```typescript
filter(users, { name: { $startsWith: 'Al' } });

filter(users, { email: { $endsWith: '@company.com' } });

filter(products, { description: { $contains: 'wireless' } });
```

**Available**: `$startsWith`, `$endsWith`, `$contains`

#### Combining Operators

```typescript
filter(products, {
  price: { $gte: 100, $lte: 500 },
  category: { $in: ['Electronics', 'Accessories'] },
  name: { $startsWith: 'Pro' }
});
```

**See**: [Operators Guide](../guide/operators.md) for comprehensive operator documentation.

## Migration Steps

### Step 1: Update Node.js

Ensure you're running Node.js 20 or higher:

```bash
node --version
```

### Step 2: Update the Package

Using npm:
```bash
npm install @mcabreradev/filter@5.0.0
```

Using yarn:
```bash
yarn add @mcabreradev/filter@5.0.0
```

Using pnpm:
```bash
pnpm add @mcabreradev/filter@5.0.0
```

### Step 3: Update Imports

The default export remains the same, but named exports are recommended:

**Before (v3.x)**:
```typescript
import filter from '@mcabreradev/filter';
```

**After (v5.0.0) - Both work**:
```typescript
import filter from '@mcabreradev/filter';

import { filter } from '@mcabreradev/filter';
```

### Step 4: Add Type Parameters (Recommended)

For better type safety, add explicit type parameters:

```typescript
interface User {
  name: string;
  age: number;
}

const users: User[] = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
];

const result = filter<User>(users, { age: 30 });
```

### Step 5: Handle Validation Errors

Wrap filter calls in try-catch if you're passing dynamic expressions:

```typescript
try {
  const result = filter(data, userProvidedExpression);
} catch (error) {
  console.error('Invalid filter expression:', error.message);
}
```

### Step 6: Leverage New Configuration Options

Take advantage of new configuration options for better control:

```typescript
const result = filter(data, '%berlin%', {
  caseSensitive: true,
  maxDepth: 2
});
```

## Common Migration Scenarios

### Scenario 1: Basic String Filtering

**No changes required** - Works exactly the same:

```typescript
const result = filter(customers, 'Berlin');
```

### Scenario 2: Wildcard Matching

**No changes required** - Works exactly the same:

```typescript
const result = filter(customers, '%erlin');
const result2 = filter(customers, '_erlin');
```

### Scenario 3: Object-Based Filtering

**No changes required** - Works exactly the same:

```typescript
const result = filter(customers, { city: 'Berlin' });
```

### Scenario 4: Predicate Functions

**No changes required** - Works exactly the same:

```typescript
const result = filter(customers, (item) => item.age > 18);
```

### Scenario 5: Case-Sensitive Filtering (NEW)

**v5.0.0 feature**:

```typescript
const result = filter(
  [{ name: 'BERLIN' }, { name: 'berlin' }],
  'berlin',
  { caseSensitive: true }
);
```

### Scenario 6: Migrating from Custom Predicates to Operators

**Before (v3.x)** - Using predicates:

```typescript
const result = filter(products, (p) => p.price >= 100 && p.price <= 500);
```

**After (v5.0.0)** - Using operators (recommended):

```typescript
const result = filter(products, {
  price: { $gte: 100, $lte: 500 }
});
```

**Benefits of operators**:
- More declarative and readable
- Can be serialized to JSON
- Better TypeScript type safety
- Runtime validation

### Scenario 7: Complex Multi-Condition Filters

**Before (v3.x)**:

```typescript
const result = filter(products, (p) =>
  p.price < 500 &&
  ['Electronics', 'Furniture'].includes(p.category) &&
  p.name.startsWith('Pro')
);
```

**After (v5.0.0)**:

```typescript
const result = filter(products, {
  price: { $lt: 500 },
  category: { $in: ['Electronics', 'Furniture'] },
  name: { $startsWith: 'Pro' }
});
```

## Testing Your Migration

After migrating, run your test suite to ensure everything works as expected:

```bash
npm test
```

Check for:
1. TypeScript compilation errors
2. Runtime validation errors
3. Changed filter behavior (if you relied on edge cases)

## Troubleshooting

### Error: "Invalid filter expression"

**Cause**: You're passing an invalid expression (e.g., undefined).

**Solution**: Ensure your expression is a string, number, boolean, null, object, or function:

```typescript
if (expression !== undefined) {
  const result = filter(data, expression);
}
```

### Error: "Invalid filter options: maxDepth too large"

**Cause**: maxDepth must be between 1 and 10.

**Solution**: Use a valid maxDepth value:

```typescript
const result = filter(data, expression, { maxDepth: 5 });
```

### TypeScript Errors After Upgrade

**Cause**: Strict mode reveals previously hidden type issues.

**Solution**: Add explicit types to your code:

```typescript
const expression: Expression<MyType> = { ... };
const result = filter<MyType>(data, expression);
```

## Getting Help

If you encounter issues during migration:

1. Check the [README](../../README.md) for updated examples
2. Review the [TypeScript types](./build/index.d.ts) for API reference
3. Open an issue on [GitHub](https://github.com/mcabreradev/filter/issues)

## Rollback Plan

If you need to rollback to v3.x:

```bash
npm install @mcabreradev/filter@3.1.3
```

Note: v3.x will continue to receive critical bug fixes for 6 months after v5.0.0 release.

