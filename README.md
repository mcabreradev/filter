# Filter

> A powerful, SQL-like array filtering library for TypeScript and JavaScript with advanced pattern matching, MongoDB-style operators, deep object comparison, and zero dependencies.

<p>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@mcabreradev/filter">
    <img alt="" src="https://img.shields.io/npm/v/@mcabreradev/filter.svg?style=for-the-badge&labelColor=0869B8">
  </a>
  <a aria-label="License" href="https://github.com/mcabreradev/filter/blob/main/LICENSE.md">
    <img alt="" src="https://img.shields.io/npm/l/@mcabreradev/filter.svg?style=for-the-badge&labelColor=579805">
  </a>
  <a aria-label="Bundle Size" href="https://bundlephobia.com/package/@mcabreradev/filter">
    <img alt="" src="https://img.shields.io/bundlephobia/minzip/@mcabreradev/filter?style=for-the-badge&labelColor=orange">
  </a>
  <a aria-label="TypeScript" href="#">
    <img alt="" src="https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=for-the-badge&labelColor=blue">
  </a>
</p>

## Why @mcabreradev/filter?

Go beyond JavaScript's native `Array.filter()` with a library that understands your data:

- **🎯 SQL-like Wildcards** - Use `%` and `_` for flexible pattern matching
- **🔍 Deep Object Filtering** - Search through nested objects up to configurable depths
- **⚡ Zero Dependencies** - Lightweight and production-ready (only Zod for runtime validation)
- **🔒 Type-Safe** - Built with strict TypeScript for maximum reliability
- **🎨 Multiple Strategies** - String patterns, objects, predicates, operators, or custom comparators
- **🚀 Performance Optimized** - Optional caching and regex compilation optimization
- **📦 MongoDB-Style Operators** - 13 operators for advanced filtering (v5.0.0+)
- **🧪 Battle-Tested** - 240+ tests ensuring reliability

---

## Installation

```bash
# Using npm
npm install @mcabreradev/filter

# Using yarn
yarn add @mcabreradev/filter

# Using pnpm
pnpm add @mcabreradev/filter
```

**Requirements:** Node.js >= 20, TypeScript 5.0+ (optional)

---

## Quick Start

```typescript
import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', email: 'alice@example.com', age: 30, city: 'Berlin' },
  { name: 'Bob', email: 'bob@example.com', age: 25, city: 'London' },
  { name: 'Charlie', email: 'charlie@example.com', age: 35, city: 'Berlin' }
];

// Simple string matching (case-insensitive by default)
filter(users, 'Berlin');
// → Returns Alice and Charlie

// Wildcard patterns (SQL-like)
filter(users, '%alice%');
// → Returns Alice

// Object-based filtering
filter(users, { city: 'Berlin', age: 30 });
// → Returns Alice

// Negation support
filter(users, '!London');
// → Returns Alice and Charlie

// Predicate functions
filter(users, (user) => user.age > 28);
// → Returns Alice and Charlie

// v5.0.0: MongoDB-style operators
filter(users, { age: { $gte: 25, $lt: 35 } });
// → Returns Bob and Alice

filter(users, { city: { $in: ['Berlin', 'Paris'] } });
// → Returns Alice and Charlie

filter(users, { name: { $startsWith: 'A' } });
// → Returns Alice
```

---

## Core Features

### Basic Filtering

Filter by simple values across all object properties:

```typescript
const products = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Mouse', price: 25 },
  { id: 3, name: 'Monitor', price: 450 }
];

// String search
filter(products, 'Laptop');  // → [{ id: 1, ... }]

// Number search
filter(products, 25);  // → [{ id: 2, ... }]

// Boolean search
filter(tasks, true);  // Finds all completed tasks
```

### Wildcard Patterns

SQL-like wildcards for flexible matching:

```typescript
// % matches zero or more characters
filter(users, '%alice%');     // Contains 'alice'
filter(users, 'Al%');          // Starts with 'Al'
filter(users, '%son');         // Ends with 'son'

// _ matches exactly one character
filter(codes, 'A_');           // 'A1', 'A2', but not 'AB1'
filter(ids, 'user-10_');       // 'user-101', 'user-102'

// Negation with !
filter(users, '!admin');       // Exclude admin
filter(files, '!%.pdf');       // Exclude PDFs
```

### Object-Based Filtering

Match by specific properties (AND logic):

```typescript
// Single property
filter(products, { category: 'Electronics' });

// Multiple properties (all must match)
filter(products, {
  category: 'Electronics',
  price: 1200,
  inStock: true
});

// Nested objects
filter(users, {
  address: { city: 'Berlin' },
  settings: { theme: 'dark' }
});
```

### MongoDB-Style Operators (v5.0.0)

Powerful operators for advanced filtering:

#### Comparison Operators

```typescript
// Greater than / Less than
filter(products, { price: { $gt: 100 } });
filter(products, { price: { $lte: 500 } });

// Range queries
filter(products, {
  price: { $gte: 100, $lte: 500 }
});

// Date ranges
filter(orders, {
  date: {
    $gte: new Date('2025-01-01'),
    $lte: new Date('2025-12-31')
  }
});

// Not equal
filter(users, { role: { $ne: 'guest' } });
```

**Available:** `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`

#### Array Operators

```typescript
// In / Not in array
filter(products, {
  category: { $in: ['Electronics', 'Books'] }
});

filter(products, {
  status: { $nin: ['archived', 'deleted'] }
});

// Array contains value
filter(products, {
  tags: { $contains: 'sale' }
});

// Array size
filter(products, {
  images: { $size: 3 }
});
```

**Available:** `$in`, `$nin`, `$contains`, `$size`

#### String Operators

```typescript
// Starts with / Ends with
filter(users, {
  email: { $endsWith: '@company.com' }
});

filter(files, {
  name: { $startsWith: 'report-' }
});

// Contains substring
filter(articles, {
  title: { $contains: 'typescript' }
});
```

**Available:** `$startsWith`, `$endsWith`, `$contains`

#### Combining Operators

```typescript
// Multiple operators, multiple properties
filter(products, {
  price: { $gte: 100, $lte: 500 },
  category: { $in: ['Electronics', 'Accessories'] },
  name: { $startsWith: 'Pro' },
  inStock: { $eq: true }
});
```

### Predicate Functions

For complex custom logic:

```typescript
// Simple predicate
filter(numbers, (n) => n > 5);

// Complex conditions
filter(products, (product) =>
  product.price < 100 &&
  product.inStock &&
  product.rating >= 4.0
);

// Type-safe with TypeScript
filter<Product>(products, (p: Product): boolean =>
  p.price > 100 && p.name.includes('Pro')
);
```

---

## Configuration

Customize filter behavior with options:

```typescript
import { filter } from '@mcabreradev/filter';

// Case-sensitive matching
filter(users, 'ALICE', { caseSensitive: true });

// Increase max depth for nested objects
filter(data, expression, { maxDepth: 5 });

// Enable caching for repeated queries
filter(largeDataset, expression, { enableCache: true });

// Custom comparison logic
filter(data, expression, {
  customComparator: (actual, expected) => actual === expected
});
```

**Available Options:**

- `caseSensitive` (boolean, default: `false`) - Case-sensitive string matching
- `maxDepth` (number, default: `3`, range: 1-10) - Max depth for nested objects
- `enableCache` (boolean, default: `false`) - Enable result caching
- `customComparator` (function, optional) - Custom comparison function

---

## TypeScript Support

Full TypeScript support with strict typing:

```typescript
import { filter } from '@mcabreradev/filter';
import type {
  Expression,
  FilterOptions,
  ComparisonOperators
} from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [...];

// Type-safe filtering
const result = filter<Product>(products, {
  price: { $gte: 100 }
});
// result is Product[]

// Type-safe expressions
const priceFilter: ComparisonOperators = {
  $gte: 100,
  $lte: 500
};

filter<Product>(products, { price: priceFilter });
```

---

## Real-World Example

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  rating: number;
  inStock: boolean;
  tags: string[];
  createdAt: Date;
}

const products: Product[] = [...];

// E-commerce: Find affordable, highly-rated electronics in stock
const affordableElectronics = filter(products, {
  category: 'Electronics',
  price: { $lte: 1000 },
  rating: { $gte: 4.5 },
  inStock: { $eq: true }
});

// Search: Products matching keyword with filters
const searchResults = filter(products, {
  name: { $contains: 'laptop' },
  brand: { $in: ['Apple', 'Dell', 'HP'] },
  price: { $gte: 500, $lte: 2000 }
});

// Analytics: Recent high-value orders
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const recentHighValue = filter(orders, {
  createdAt: { $gte: thirtyDaysAgo },
  amount: { $gte: 1000 },
  status: { $in: ['completed', 'shipped'] }
});
```

---

## Performance

Filter is optimized for performance:

- **Operators** use early exit strategies for fast evaluation
- **Regex patterns** are compiled and cached
- **Optional caching** for repeated queries on large datasets
- **Type guards** for fast type checking

```typescript
// ✅ Fast: Operators with early exit
filter(data, { age: { $gte: 18 } });

// ✅ Fast with caching for repeated queries
filter(largeData, expression, { enableCache: true });

// ⚠️ Slower: Complex predicates (but more flexible)
filter(data, (item) => complexCalculation(item));
```

For performance optimization tips, see [Performance Guide in WIKI](./WIKI.md#performance-optimization).

---

## Documentation

### 📖 Complete Documentation

- **[WIKI.md](./WIKI.md)** - Complete documentation with 150+ examples, API reference, TypeScript guide, real-world use cases, FAQ, and troubleshooting
- **[OPERATORS.md](./OPERATORS.md)** - Detailed guide for all 13 MongoDB-style operators with examples
- **[MIGRATION.md](./MIGRATION.md)** - Migration guide from v3.x or native Array.filter()
- **[Examples](./examples/)** - Real-world usage examples and code samples

### 🎯 Quick Links

- [Installation & Setup](./WIKI.md#installation--setup)
- [All Operators Reference](./OPERATORS.md)
- [TypeScript Integration](./WIKI.md#typescript-integration)
- [Real-World Examples](./WIKI.md#real-world-examples)
- [Performance Tips](./WIKI.md#performance-optimization)
- [API Reference](./WIKI.md#api-reference)
- [FAQ](./WIKI.md#frequently-asked-questions)
- [Troubleshooting](./WIKI.md#troubleshooting)

---

## Migration from v3.x

**Good news:** v5.0.0 is **100% backward compatible**! All v3.x code continues to work.

```typescript
// ✅ All v3.x syntax still works
filter(data, 'string');
filter(data, { prop: 'value' });
filter(data, (item) => true);
filter(data, '%pattern%');

// ✅ New in v5.0.0
filter(data, { age: { $gte: 18 } });
filter(data, expression, { caseSensitive: true });
```

**What's New in v5.0.0:**
- 13 MongoDB-style operators
- Configuration API
- Runtime validation with Zod
- Performance optimizations
- Enhanced TypeScript support

See [MIGRATION.md](./MIGRATION.md) for detailed migration guide.

---

## API Overview

```typescript
// Main filter function
filter<T>(array: T[], expression: Expression<T>, options?: FilterOptions): T[]

// Validation functions
validateExpression(expression: unknown): Expression<T>
validateOptions(options: unknown): FilterOptions

// Configuration
mergeConfig(options?: FilterOptions): FilterConfig
createFilterConfig(options?: FilterOptions): FilterConfig
```

For complete API reference, see [WIKI.md - API Reference](./WIKI.md#api-reference).

---

## Browser Support

Works in all modern browsers and Node.js:

- **Node.js:** >= 20
- **Browsers:** Chrome, Firefox, Safari, Edge (latest versions)
- **TypeScript:** >= 5.0
- **Module Systems:** ESM, CommonJS

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Ways to Contribute:**
- Report bugs or request features via [GitHub Issues](https://github.com/mcabreradev/filter/issues)
- Submit pull requests with bug fixes or new features
- Improve documentation
- Share your use cases and examples

---

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Type checking
npm run typecheck
```

The library has 240+ tests with comprehensive coverage of all features.

---

## Changelog

### v5.0.0 (Latest)
- ✨ Added 13 MongoDB-style operators
- ⚙️ Configuration API with 4 options
- ✅ Runtime validation with Zod
- 🚀 Performance optimizations
- 📘 Enhanced TypeScript support
- 🧪 240+ tests

See [MIGRATION.md](./MIGRATION.md) for detailed changelog and migration guide.

---

## License

MIT License - see [LICENSE.md](./LICENSE.md) for details.

Copyright (c) 2025 Miguelangel Cabrera

---

## Credits

**Author:** [Miguelangel Cabrera](https://github.com/mcabreradev)
**Repository:** [github.com/mcabreradev/filter](https://github.com/mcabreradev/filter)

Inspired by MongoDB query syntax, SQL wildcards, and functional programming patterns.

---

## Support

- 📖 [Complete Documentation (WIKI)](./WIKI.md)
- 💬 [GitHub Discussions](https://github.com/mcabreradev/filter/discussions)
- 🐛 [Issue Tracker](https://github.com/mcabreradev/filter/issues)
- ⭐ [Star on GitHub](https://github.com/mcabreradev/filter)

---

<p align="center">
  <strong>Made with ❤️ for the JavaScript/TypeScript community</strong>
</p>
