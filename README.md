# @mcabreradev/filter

> **Filter arrays like a pro.** A powerful, SQL-like array filtering library for TypeScript with advanced pattern matching, MongoDB-style operators, deep object comparison, geospatial queries, and zero dependencies.

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@mcabreradev/filter">
    <img alt="" src="https://img.shields.io/npm/v/@mcabreradev/filter.svg?style=for-the-badge&labelColor=0869B8">
  </a>
  <a aria-label="License" href="https://github.com/mcabreradev/filter/blob/main/LICENSE.md">
    <img alt="" src="https://img.shields.io/npm/l/@mcabreradev/filter.svg?style=for-the-badge&labelColor=579805">
  </a>
  <a aria-label="Bundle Size" href="https://bundlephobia.com/package/@mcabreradev/filter">
    <img alt="" src="https://img.shields.io/bundlephobia/minzip/@mcabreradev/filter?style=for-the-badge&labelColor=orange">
  </a>
  <a aria-label="Tree Shaking" href="https://bundlephobia.com/package/@mcabreradev/filter">
    <img alt="" src="https://img.shields.io/badge/tree--shaking-friendly-success?style=for-the-badge&labelColor=green">
  </a>
  <a aria-label="TypeScript" href="#">
    <img alt="" src="https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=for-the-badge&labelColor=blue">
  </a>
  <a aria-label="Zero Dependencies" href="https://bundlephobia.com/package/@mcabreradev/filter">
    <img alt="" src="https://img.shields.io/badge/dependencies-0-purple?style=for-the-badge&labelColor=purple">
  </a>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#why-youll-love-it">Why You'll Love It</a> •
  <a href="#examples">Examples</a> •
  <a href="https://mcabreradev-filter.vercel.app/playground/">Playground</a> •
  <a href="./docs">Documentation</a>
</p>

---
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [@mcabreradev/filter](#mcabreradevfilter)
  - [The Hook](#the-hook)
  - [Quick Start](#quick-start)
    - [Install](#install)
    - [Your First Filter](#your-first-filter)
  - [Why You'll Love It](#why-youll-love-it)
    - [🚀 **Blazing Fast**](#-blazing-fast)
    - [🎯 **Developer Friendly**](#-developer-friendly)
    - [🔧 **Incredibly Flexible**](#-incredibly-flexible)
    - [📦 **Production Ready**](#-production-ready)
    - [🪶 **Ultra Lightweight**](#-ultra-lightweight)
    - [🔒 **Type-Safe by Default**](#-type-safe-by-default)
    - [🎨 **Framework Agnostic**](#-framework-agnostic)
    - [📊 **Handles Big Data**](#-handles-big-data)
  - [Examples](#examples)
    - [Basic Filtering](#basic-filtering)
    - [MongoDB-Style Operators](#mongodb-style-operators)
    - [Array OR Syntax (Intuitive!)](#array-or-syntax-intuitive)
    - [Geospatial Queries](#geospatial-queries)
    - [Date/Time Filtering](#datetime-filtering)
    - [Performance Optimization](#performance-optimization)
    - [Real-World: E-commerce Search](#real-world-e-commerce-search)
  - [Framework Integrations](#framework-integrations)
    - [React](#react)
    - [Vue](#vue)
    - [Svelte](#svelte)
    - [Angular](#angular)
    - [SolidJS](#solidjs)
    - [Preact](#preact)
  - [Core Features](#core-features)
    - [Supported Operators](#supported-operators)
    - [TypeScript Support](#typescript-support)
    - [Configuration Options](#configuration-options)
  - [Advanced Features](#advanced-features)
    - [Lazy Evaluation](#lazy-evaluation)
    - [Memoization & Caching](#memoization--caching)
    - [Visual Debugging](#visual-debugging)
  - [Documentation](#documentation)
    - [📖 Complete Guides](#-complete-guides)
    - [🎯 Quick Links](#-quick-links)
  - [Performance](#performance)
  - [Bundle Size](#bundle-size)
  - [Browser Support](#browser-support)
  - [Migration from v3.x](#migration-from-v3x)
  - [Changelog](#changelog)
    - [v5.8.0 (Current)](#v580-current)
    - [v5.7.0](#v570)
    - [v5.6.0](#v560)
    - [v5.5.0](#v550)
  - [Contributing](#contributing)
  - [License](#license)
  - [Support](#support)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## The Hook

**Tired of writing complex filter logic?** Stop wrestling with nested `Array.filter()` chains and verbose conditionals. Write clean, declarative filters that read like queries.

**Before:**
```typescript
const results = data.filter(item =>
  item.age >= 18 &&
  item.status === 'active' &&
  (item.role === 'admin' || item.role === 'moderator') &&
  item.email.endsWith('@company.com') &&
  item.createdAt >= thirtyDaysAgo
);
```

**After:**
```typescript
const results = filter(data, {
  age: { $gte: 18 },
  status: 'active',
  role: ['admin', 'moderator'],
  email: { $endsWith: '@company.com' },
  createdAt: { $gte: thirtyDaysAgo }
});
```

**Same result. 70% less code. 100% more readable.**

---

## Quick Start

### Install

```bash
npm install @mcabreradev/filter
# or
pnpm add @mcabreradev/filter
# or
yarn add @mcabreradev/filter
```

**Requirements:** Node.js >= 20, TypeScript 5.0+ (optional)

### Your First Filter

```typescript
import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', age: 30, city: 'Berlin', active: true },
  { name: 'Bob', age: 25, city: 'London', active: false },
  { name: 'Charlie', age: 35, city: 'Berlin', active: true }
];

// Simple string search
const berlinUsers = filter(users, 'Berlin');
// → [{ name: 'Alice', ... }, { name: 'Charlie', ... }]

// Object-based filtering
const activeBerlinUsers = filter(users, {
  city: 'Berlin',
  active: true
});
// → [{ name: 'Alice', ... }]

// MongoDB-style operators
const adults = filter(users, {
  age: { $gte: 18 }
});
// → All users (all are 18+)

// That's it! You're filtering like a pro.
```

**🎮 [Try it in the Playground →](https://mcabreradev-filter.vercel.app/playground/)**

---

## Why You'll Love It

### 🚀 **Blazing Fast**
- **530x faster** with optional caching
- **500x faster** with lazy evaluation for large datasets
- Optimized for production workloads

### 🎯 **Developer Friendly**
- Intuitive API that feels natural
- SQL-like syntax you already know
- Full TypeScript support with intelligent autocomplete

### 🔧 **Incredibly Flexible**
- Multiple filtering strategies (strings, objects, operators, predicates)
- Works with any data structure
- Combine approaches seamlessly

### 📦 **Production Ready**
- **993+ tests** ensuring reliability
- Zero dependencies (12KB gzipped)
- Used in production by companies worldwide
- MIT licensed

### 🪶 **Ultra Lightweight**
- Truly zero dependencies!
- Tiny 12KB bundle
- Optional Zod for validation
- No bloat, just pure filtering power

### 🔒 **Type-Safe by Default**
- Built with strict TypeScript
- Catch errors at compile time
- Full IntelliSense and autocomplete support

### 🎨 **Framework Agnostic**
- Works everywhere: React, Vue, Svelte, Angular, SolidJS, Preact
- First-class hooks and composables included
- SSR compatible (Next.js, Nuxt, SvelteKit)

### 📊 **Handles Big Data**
- Process millions of records efficiently
- Lazy evaluation for memory optimization
- Built for scale

---

## Examples

### Basic Filtering

```typescript
// String matching - searches all properties
filter(products, 'Laptop');

// Object matching - AND logic
filter(products, {
  category: 'Electronics',
  price: { $lt: 1000 }
});

// Wildcard patterns (SQL-like)
filter(users, '%alice%');  // Contains 'alice'
filter(users, 'Al%');      // Starts with 'Al'
filter(users, '%son');     // Ends with 'son'
```

### MongoDB-Style Operators

```typescript
// Comparison operators
filter(products, {
  price: { $gte: 100, $lte: 500 }
});

// Array operators
filter(products, {
  category: { $in: ['Electronics', 'Books'] },
  tags: { $contains: 'sale' }
});

// String operators
filter(users, {
  email: { $endsWith: '@company.com' },
  name: { $startsWith: 'John' }
});

// Logical operators
filter(products, {
  $and: [
    { inStock: true },
    {
      $or: [
        { rating: { $gte: 4.5 } },
        { price: { $lt: 50 } }
      ]
    }
  ]
});
```

### Array OR Syntax (Intuitive!)

```typescript
// Clean array syntax - no $in needed!
filter(products, {
  category: ['Electronics', 'Books']
});
// Equivalent to: { category: { $in: ['Electronics', 'Books'] } }

// Multiple properties
filter(users, {
  city: ['Berlin', 'Paris'],
  role: ['admin', 'moderator']
});
```

### Geospatial Queries

```typescript
import { filter, type GeoPoint } from '@mcabreradev/filter';

const userLocation: GeoPoint = { lat: 52.52, lng: 13.405 };

// Find restaurants within 5km
filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 5000
    }
  },
  rating: { $gte: 4.5 }
});
```

### Date/Time Filtering

```typescript
// Events in next 7 days
filter(events, {
  date: { $upcoming: { days: 7 } }
});

// Recent events (last 24 hours)
filter(events, {
  date: { $recent: { hours: 24 } }
});

// Weekday events during business hours
filter(events, {
  date: { $dayOfWeek: [1, 2, 3, 4, 5] },
  startTime: { $timeOfDay: { start: 9, end: 17 } }
});
```

### Performance Optimization

```typescript
// Enable caching for repeated queries
const results = filter(largeDataset, expression, {
  enableCache: true,
  orderBy: { field: 'price', direction: 'desc' },
  limit: 100
});

// Lazy evaluation for large datasets
import { filterFirst } from '@mcabreradev/filter';
const first10 = filterFirst(users, { premium: true }, 10);
```

### Real-World: E-commerce Search

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
}

const products: Product[] = [...];

// Find affordable, highly-rated electronics in stock
const affordableElectronics = filter(products, {
  category: 'Electronics',
  price: { $lte: 1000 },
  rating: { $gte: 4.5 },
  inStock: true
});

// Search with multiple filters
const searchResults = filter(products, {
  name: { $contains: 'laptop' },
  brand: { $in: ['Apple', 'Dell', 'HP'] },
  price: { $gte: 500, $lte: 2000 }
});

// Sort results
const sortedProducts = filter(products, {
  category: 'Electronics',
  inStock: true
}, {
  orderBy: [
    { field: 'price', direction: 'asc' },
    { field: 'rating', direction: 'desc' }
  ],
  limit: 20
});
```

---

## Framework Integrations

Works seamlessly with your favorite framework:

### React

```typescript
import { useFilter } from '@mcabreradev/filter/react';

function UserList() {
  const { filtered, isFiltering } = useFilter(users, { active: true });
  return <div>{filtered.map(u => <User key={u.id} {...u} />)}</div>;
}
```

### Vue

```vue
<script setup>
import { useFilter } from '@mcabreradev/filter/vue';
const { filtered } = useFilter(users, { active: true });
</script>
```

### Svelte

```svelte
<script>
import { useFilter } from '@mcabreradev/filter/svelte';
const { filtered } = useFilter(users, writable({ active: true }));
</script>
```

### Angular

```typescript
import { FilterService } from '@mcabreradev/filter/angular';

@Component({
  providers: [FilterService],
  template: `
    @for (user of filterService.filtered(); track user.id) {
      <div>{{ user.name }}</div>
    }
  `
})
export class UserListComponent {
  filterService = inject(FilterService<User>);
}
```

### SolidJS

```tsx
import { useFilter } from '@mcabreradev/filter/solidjs';

function UserList() {
  const { filtered } = useFilter(
    () => users,
    () => ({ active: true })
  );
  return <For each={filtered()}>{(u) => <div>{u.name}</div>}</For>;
}
```

### Preact

```tsx
import { useFilter } from '@mcabreradev/filter/preact';

function UserList() {
  const { filtered } = useFilter(users, { active: true });
  return <div>{filtered.map(u => <div key={u.id}>{u.name}</div>)}</div>;
}
```

**Features:**
- ✅ Full TypeScript support with generics
- ✅ Debounced search hooks/services
- ✅ Pagination support
- ✅ SSR compatible
- ✅ 100% test coverage

📖 **[Complete Framework Guide →](./docs/frameworks/index.md)**

---

## Core Features

### Supported Operators

**Comparison:** `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`
**Array:** `$in`, `$nin`, `$contains`, `$size`
**String:** `$startsWith`, `$endsWith`, `$contains`, `$regex`, `$match`
**Logical:** `$and`, `$or`, `$not`
**Geospatial:** `$near`, `$geoBox`, `$geoPolygon`
**Date/Time:** `$recent`, `$upcoming`, `$dayOfWeek`, `$timeOfDay`, `$age`, `$isWeekday`, `$isWeekend`, `$isBefore`, `$isAfter`

### TypeScript Support

Full type safety with intelligent autocomplete:

```typescript
interface Product {
  name: string;
  price: number;
  tags: string[];
}

filter<Product>(products, {
  price: {  }, // Autocomplete: $gt, $gte, $lt, $lte, $eq, $ne
  name: {  },  // Autocomplete: $startsWith, $endsWith, $contains, $regex
  tags: {  }   // Autocomplete: $in, $nin, $contains, $size
});
```

### Configuration Options

```typescript
filter(data, expression, {
  caseSensitive: false,      // Case-sensitive string matching
  maxDepth: 3,                // Max depth for nested objects
  enableCache: true,          // Enable result caching (530x faster)
  orderBy: 'price',           // Sort results
  limit: 10,                  // Limit number of results
  debug: true                 // Visual debugging mode
});
```

---

## Advanced Features

### Lazy Evaluation

Efficiently process large datasets with lazy evaluation:

```typescript
import { filterLazy, filterFirst, filterExists, filterCount } from '@mcabreradev/filter';

// Process items on-demand
const filtered = filterLazy(millionRecords, { active: true });
for (const item of filtered) {
  process(item);
  if (shouldStop) break; // Early exit
}

// Find first N matches
const first10 = filterFirst(users, { premium: true }, 10);

// Check existence without processing all items
const hasAdmin = filterExists(users, { role: 'admin' });

// Count matches
const activeCount = filterCount(users, { active: true });
```

**Benefits:**
- 🚀 **500x faster** for operations that don't need all results
- 💾 **100,000x less memory** for large datasets
- ⚡ **Early exit** optimization

📖 **[Lazy Evaluation Guide →](./docs/guide/lazy-evaluation.md)**

### Memoization & Caching

**530x faster** with optional caching:

```typescript
// First call - processes data
const results = filter(largeDataset, { age: { $gte: 18 } }, { enableCache: true });

// Second call - returns cached result instantly
const sameResults = filter(largeDataset, { age: { $gte: 18 } }, { enableCache: true });
```

**Performance Gains:**
| Scenario | Without Cache | With Cache | Speedup |
|----------|---------------|------------|---------|
| Simple query (10K items) | 5.3ms | 0.01ms | **530x** |
| Regex pattern | 12.1ms | 0.02ms | **605x** |
| Complex nested | 15.2ms | 0.01ms | **1520x** |

📖 **[Memoization Guide →](./docs/guide/memoization.md)**

### Visual Debugging

Built-in debug mode with expression tree visualization:

```typescript
filter(users, { city: 'Berlin' }, { debug: true });

// Console output:
// ┌─ Filter Debug Tree
// │  Expression: {"city":"Berlin"}
// │  Matched: 3/10 (30.0%)
// │  Execution time: 0.42ms
// └─ ✓ city = "Berlin"
```

📖 **[Debug Guide →](./docs/guide/debugging.md)**

---

## Documentation

### 📖 Complete Guides

- **[Getting Started](./docs/guide/getting-started.md)** - Installation and first steps
- **[All Operators](./docs/guide/operators.md)** - Complete operator reference
- **[Geospatial Queries](./docs/guide/geospatial-operators.md)** - Location-based filtering
- **[Date/Time Operators](./docs/guide/datetime-operators.md)** - Temporal filtering
- **[Framework Integrations](./docs/frameworks/index.md)** - React, Vue, Svelte, Angular, SolidJS, Preact
- **[Lazy Evaluation](./docs/guide/lazy-evaluation.md)** - Efficient large dataset processing
- **[Memoization & Caching](./docs/guide/memoization.md)** - Performance optimization
- **[Visual Debugging](./docs/guide/debugging.md)** - Debug mode and tree visualization

### 🎯 Quick Links

- [Interactive Playground](https://mcabreradev-filter.vercel.app/playground/) 🎮
- [API Reference](./docs/api/reference.md)
- [Examples](./examples/)
- [Migration Guide](./docs/advanced/migration.md)
- [Performance Benchmarks](./docs/advanced/performance-benchmarks.md)
- [FAQ](./docs/guide/faq.md)

---

## Performance

Filter is optimized for performance:

- **Operators** use early exit strategies for fast evaluation
- **Regex patterns** are compiled and cached
- **Optional caching** for repeated queries (530x-1520x faster)
- **Lazy evaluation** for efficient large dataset processing (500x faster)
- **Type guards** for fast type checking

```typescript
// ✅ Fast: Operators with early exit
filter(data, { age: { $gte: 18 } });

// ✅ Fast with caching for repeated queries
filter(largeData, expression, { enableCache: true });

// ✅ Fast with lazy evaluation for large datasets
const result = filterFirst(millionRecords, { active: true }, 100);
```

---

## Bundle Size

| Import | Size (gzipped) | Tree-Shakeable |
|--------|----------------|----------------|
| Full | 12 KB | ✅ |
| Core only | 8.4 KB | ✅ |
| React hooks | 9.2 KB | ✅ |
| Lazy evaluation | 5.4 KB | ✅ |

---

## Browser Support

Works in all modern browsers and Node.js:

- **Node.js:** >= 20
- **Browsers:** Chrome, Firefox, Safari, Edge (latest versions)
- **TypeScript:** >= 5.0
- **Module Systems:** ESM, CommonJS

---

## Migration from v3.x

**Good news:** v5.x is **100% backward compatible**! All v3.x code continues to work.

```typescript
// ✅ All v3.x syntax still works
filter(data, 'string');
filter(data, { prop: 'value' });
filter(data, (item) => true);
filter(data, '%pattern%');

// ✅ New in v5.x
filter(data, { age: { $gte: 18 } });
filter(data, expression, { enableCache: true });
```

📖 **[Migration Guide →](./docs/advanced/migration.md)**

---

## Changelog

### v5.8.0 (Current)
- 🎨 **New Framework Integrations**: Angular, SolidJS, and Preact support
- 🔢 **Limit Option**: New `limit` configuration option to restrict result count
- 📊 **OrderBy Option**: Sort filtered results by field(s) in ascending or descending order
- ✅ 993+ tests with comprehensive coverage

### v5.7.0
- 🅰️ **Angular**: Services and Pipes with Signals support
- 🔷 **SolidJS**: Signal-based reactive hooks
- ⚡ **Preact**: Lightweight hooks API
- 📊 **OrderBy & Limit**: Sort and limit filtered results

### v5.6.0
- 🌍 **Geospatial Operators**: Location-based filtering with $near, $geoBox, $geoPolygon
- 📅 **Date/Time Operators**: Temporal filtering with $recent, $upcoming, $dayOfWeek, $age

### v5.5.0
- 🎨 **Array OR Syntax**: Intuitive array-based OR filtering
- 🐛 **Visual Debugging**: Built-in debug mode with expression tree visualization
- 🎮 **Interactive Playground**: Online playground for testing filters

📖 **[Full Changelog →](./docs/project/changelog.md)**

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

**Ways to Contribute:**
- Report bugs or request features via [GitHub Issues](https://github.com/mcabreradev/filter/issues)
- Submit pull requests with bug fixes or new features
- Improve documentation
- Share your use cases and examples

---

## License

MIT License - see [LICENSE.md](./LICENSE.md) for details.

Copyright (c) 2025 Miguelangel Cabrera

---

## Support

- 📖 [Complete Documentation](./docs)
- 💬 [GitHub Discussions](https://github.com/mcabreradev/filter/discussions)
- 🐛 [Issue Tracker](https://github.com/mcabreradev/filter/issues)
- ⭐ [Star on GitHub](https://github.com/mcabreradev/filter)

---

<p align="center">
  <strong>Made with ❤️ for the JavaScript/TypeScript community</strong>
</p>
