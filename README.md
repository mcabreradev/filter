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
  - [The Problem](#the-problem)
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
    - [Datetime Filtering](#datetime-filtering)
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
    - [v5.9.0 (Current)](#v590-current)
    - [v5.8.2](#v582)
    - [v5.8.0](#v580)
    - [v5.7.0](#v570)
    - [v5.6.0](#v560)
    - [v5.5.0](#v550)
  - [Contributing](#contributing)
  - [License](#license)
  - [Support](#support)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## The Problem

**Tired of writing complex filter logic?** Stop wrestling with nested `Array.filter()` chains and verbose conditionals. Write clean, declarative filters that read like queries.

**Before — the usual mess:**
```typescript
const results = data.filter(item =>
  item.age >= 18 &&
  item.status === 'active' &&
  (item.role === 'admin' || item.role === 'moderator') &&
  item.email.endsWith('@company.com') &&
  item.createdAt >= thirtyDaysAgo
);
```

**After — clean and declarative:**
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

// Simple string search — scans all fields
const berlinUsers = filter(users, 'Berlin');
// → [{ name: 'Alice', ... }, { name: 'Charlie', ... }]

// Object matching — AND logic across fields
const activeBerlinUsers = filter(users, { city: 'Berlin', active: true });
// → [{ name: 'Alice', ... }]

// MongoDB-style operators
const adults = filter(users, { age: { $gte: 18 } });
// → All users

// SQL-like wildcards
const startsWithAl = filter(users, 'Al%');
// → [{ name: 'Alice', ... }]
```

> **`find` is an alias for `filter`** — use whichever name feels more natural:
> ```typescript
> import { find } from '@mcabreradev/filter';
> const result = find(users, { active: true }); // identical to filter()
> ```

**🎮 [Try it in the Playground →](https://mcabreradev-filter.vercel.app/playground/)**

---

## Why You'll Love It

### 🚀 **Blazing Fast**
- **530x faster** on repeated queries with optional LRU caching
- **500x faster** with lazy evaluation for large datasets
- Compiled predicates and regex patterns cached automatically

### 🎯 **Developer Friendly**
- Intuitive API — reads like English
- SQL-like wildcards (`%`, `_`) you already know
- Full TypeScript generics with intelligent autocomplete

### 🔧 **Incredibly Flexible**
- Four filtering strategies: strings, objects, operators, predicates
- Combine them seamlessly in a single expression
- Works with any data shape — flat, nested, arrays

### 📦 **Production Ready**
- **1,004+ tests** ensuring bulletproof reliability
- Zero runtime dependencies (only Zod for optional validation)
- Battle-tested in production applications
- MIT licensed

### 🪶 **Ultra Lightweight**
- Full package: **12KB gzipped**
- Core only: **8.4KB gzipped**
- Zero mandatory dependencies
- Tree-shakeable — only pay for what you use

### 🔒 **Type-Safe by Default**
- Built with strict TypeScript
- Catch errors at compile time, not runtime
- Full IntelliSense for operators based on field types

### 🎨 **Framework Agnostic**
- First-class hooks: React, Vue, Svelte, Angular, SolidJS, Preact
- Debounced search, pagination, and reactive state out of the box
- SSR compatible: Next.js, Nuxt, SvelteKit

### 📊 **Handles Big Data**
- Generator-based lazy evaluation for millions of records
- Early exit — stop processing when you have enough results
- LRU caches with TTL prevent memory leaks in long-running apps

---

## Examples

### Basic Filtering

```typescript
// String matching — searches all string properties
filter(products, 'Laptop');

// Exact field matching — AND logic
filter(products, { category: 'Electronics', price: { $lt: 1000 } });

// SQL wildcard patterns
filter(users, '%alice%');   // contains 'alice'
filter(users, 'Al%');       // starts with 'Al'
filter(users, '%son');      // ends with 'son'
filter(users, 'J_hn');      // single-char wildcard

// Predicate functions — full control
filter(users, (u) => u.score > 90 && u.verified);
```

### MongoDB-Style Operators

```typescript
// Comparison
filter(products, { price: { $gte: 100, $lte: 500 } });
filter(products, { rating: { $gt: 4 }, stock: { $ne: 0 } });

// Array membership
filter(products, { category: { $in: ['Electronics', 'Books'] } });
filter(products, { tags: { $contains: 'sale' } });
filter(products, { sizes: { $size: 3 } });

// String matching
filter(users, {
  email: { $endsWith: '@company.com' },
  name: { $startsWith: 'John' },
  bio: { $regex: /developer/i }
});

// Logical combinators
filter(products, {
  $and: [
    { inStock: true },
    { $or: [{ rating: { $gte: 4.5 } }, { price: { $lt: 50 } }] }
  ]
});

// Negate with $not
filter(users, { role: { $not: 'banned' } });
```

### Array OR Syntax (Intuitive!)

```typescript
// Pass an array → automatic OR logic, no $in needed
filter(products, { category: ['Electronics', 'Books'] });
// Same as: { category: { $in: ['Electronics', 'Books'] } }

// Combine across fields
filter(users, {
  city: ['Berlin', 'Paris', 'London'],
  role: ['admin', 'moderator']
});
```

### Geospatial Queries

```typescript
import { filter, type GeoPoint } from '@mcabreradev/filter';

const userLocation: GeoPoint = { lat: 52.52, lng: 13.405 };

// Find restaurants within 5km rated 4.5+
filter(restaurants, {
  location: { $near: { center: userLocation, maxDistanceMeters: 5000 } },
  rating: { $gte: 4.5 }
});

// Bounding box search
filter(places, {
  location: {
    $geoBox: {
      topLeft: { lat: 53.0, lng: 13.0 },
      bottomRight: { lat: 52.0, lng: 14.0 }
    }
  }
});
```

### Datetime Filtering

```typescript
// Events in next 7 days
filter(events, { date: { $upcoming: { days: 7 } } });

// Recent activity (last 24 hours)
filter(logs, { createdAt: { $recent: { hours: 24 } } });

// Weekday events during business hours
filter(events, {
  date: { $dayOfWeek: [1, 2, 3, 4, 5] },       // Mon–Fri
  startTime: { $timeOfDay: { start: 9, end: 17 } }  // 9am–5pm
});

// Users of age 18–65
filter(users, { birthDate: { $age: { min: 18, max: 65 } } });

// Weekend-only events
filter(events, { date: { $isWeekend: true } });

// Events before a deadline
filter(tasks, { dueDate: { $isBefore: new Date('2025-12-31') } });
```

### Performance Optimization

```typescript
// LRU caching — 530x faster on repeat queries
const results = filter(largeDataset, expression, {
  enableCache: true,
  orderBy: { field: 'price', direction: 'desc' },
  limit: 100
});

// Lazy evaluation — process millions of records without loading all into memory
import { filterFirst, filterExists, filterCount, filterLazy } from '@mcabreradev/filter';

const first10 = filterFirst(millionRecords, { premium: true }, 10);
const hasAdmin = filterExists(users, { role: 'admin' });      // exits on first match
const activeCount = filterCount(users, { active: true });     // no array allocated
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

// Affordable, highly-rated electronics in stock
const results = filter<Product>(products, {
  category: 'Electronics',
  price: { $lte: 1000 },
  rating: { $gte: 4.5 },
  inStock: true
});

// Full-text search with brand filter
const searchResults = filter<Product>(products, {
  name: { $contains: 'laptop' },
  brand: ['Apple', 'Dell', 'HP'],
  price: { $gte: 500, $lte: 2000 }
});

// Sorted and paginated results
const page1 = filter<Product>(products, { category: 'Electronics', inStock: true }, {
  orderBy: [
    { field: 'price', direction: 'asc' },
    { field: 'rating', direction: 'desc' }
  ],
  limit: 20
});
```

---

## Framework Integrations

First-class hooks and composables — reactive, debounced, paginated, ready to drop in:

### React

```typescript
import { useFilter, useDebouncedFilter, usePaginatedFilter } from '@mcabreradev/filter/react';

function UserList() {
  const { filtered, isFiltering } = useFilter(users, { active: true });

  return (
    <ul>
      {filtered.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}

// Debounced live search
function SearchBox() {
  const [query, setQuery] = useState('');
  const { filtered, isPending } = useDebouncedFilter(users, query, { delay: 300 });

  return (
    <>
      <input onChange={e => setQuery(e.target.value)} />
      {isPending ? <Spinner /> : filtered.map(u => <User key={u.id} user={u} />)}
    </>
  );
}
```

### Vue

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useFilter } from '@mcabreradev/filter/vue';

const expression = ref({ active: true });
const { filtered, isFiltering } = useFilter(users, expression);
</script>

<template>
  <ul>
    <li v-for="user in filtered" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
```

### Svelte

```svelte
<script lang="ts">
  import { writable } from 'svelte/store';
  import { useFilter } from '@mcabreradev/filter/svelte';

  const expression = writable({ active: true });
  const { filtered } = useFilter(users, expression);
</script>

{#each $filtered as user}
  <p>{user.name}</p>
{/each}
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

**Every integration includes:**
- ✅ Full TypeScript generics
- ✅ Debounced search hook with `isPending` state
- ✅ Pagination hook with `nextPage`, `prevPage`, `goToPage`
- ✅ SSR compatible
- ✅ 100% test coverage

📖 **[Complete Framework Guide →](./docs/frameworks/index.md)**

---

## Core Features

### Supported Operators

| Category | Operators |
|----------|-----------|
| **Comparison** | `$gt` `$gte` `$lt` `$lte` `$eq` `$ne` |
| **Array** | `$in` `$nin` `$contains` `$size` |
| **String** | `$startsWith` `$endsWith` `$contains` `$regex` `$match` |
| **Logical** | `$and` `$or` `$not` |
| **Geospatial** | `$near` `$geoBox` `$geoPolygon` |
| **Datetime** | `$recent` `$upcoming` `$dayOfWeek` `$timeOfDay` `$age` `$isWeekday` `$isWeekend` `$isBefore` `$isAfter` |

> 18+ operators covering every filtering scenario you'll encounter.

### TypeScript Support

Full type safety — autocomplete shows only valid operators for each field type:

```typescript
interface Product {
  name: string;
  price: number;
  tags: string[];
}

filter<Product>(products, {
  price: { $gte: 100 },    // ✅ number operators
  name: { $contains: '' }, // ✅ string operators
  tags: { $size: 3 },      // ✅ array operators
  price: { $contains: '' } // ❌ TypeScript error — string op on number field
});
```

### Configuration Options

```typescript
filter(data, expression, {
  caseSensitive: false,           // default: false
  maxDepth: 3,                    // nested object traversal depth (1–10)
  enableCache: true,              // LRU result caching (530x speedup)
  orderBy: 'price',               // sort field or array of fields
  limit: 10,                      // cap result count
  debug: true,                    // print expression tree to console
  verbose: true,                  // detailed per-item evaluation logs
  showTimings: true,              // execution time per operator
  enablePerformanceMonitoring: true,  // collect performance metrics
});
```

---

## Advanced Features

### Lazy Evaluation

Process large datasets without loading everything into memory:

```typescript
import { filterLazy, filterFirst, filterExists, filterCount } from '@mcabreradev/filter';

// Generator — pull items one by one, exit any time
const lazy = filterLazy(millionRecords, { active: true });
for (const item of lazy) {
  process(item);
  if (shouldStop) break; // ← zero wasted work
}

// Grab first N matches
const top10 = filterFirst(users, { premium: true }, 10);

// Check existence — exits on first match
const hasBanned = filterExists(users, { role: 'banned' });

// Count matches — no array allocated
const total = filterCount(orders, { status: 'pending' });
```

| Scenario | Array.filter | filterLazy / filterFirst |
|----------|-------------|--------------------------|
| First match in 1M items | ~50ms | **~0.1ms** |
| Memory for 1M items | ~80MB | **~0KB** |
| Early exit | ❌ | ✅ |

📖 **[Lazy Evaluation Guide →](./docs/guide/lazy-evaluation.md)**

### Memoization & Caching

Three-tier LRU caching strategy with automatic TTL eviction:

```typescript
// First call — compiles predicates, runs filter, stores result
const results = filter(largeDataset, { age: { $gte: 18 } }, { enableCache: true });

// Subsequent calls — returns cached result instantly
const same = filter(largeDataset, { age: { $gte: 18 } }, { enableCache: true });
```

| Scenario | Without Cache | With Cache | Speedup |
|----------|--------------|------------|---------|
| Simple query, 10K items | 5.3ms | 0.01ms | **530x** |
| Regex pattern | 12.1ms | 0.02ms | **605x** |
| Complex nested query | 15.2ms | 0.01ms | **1520x** |

Caches are bounded (LRU, max 500 entries each) and auto-expire after 5 minutes — safe for long-running servers.

📖 **[Memoization Guide →](./docs/guide/memoization.md)**

### Visual Debugging

Built-in tree visualization for understanding filter behavior:

```typescript
filter(users, { city: 'Berlin', age: { $gte: 18 } }, { debug: true });

// Console output:
// ┌─ Filter Debug Tree
// │  Expression: {"city":"Berlin","age":{"$gte":18}}
// │  Matched: 3/10 items (30.0%)
// │  Execution time: 0.42ms
// ├─ ✓ city = "Berlin"         [3 matches]
// └─ ✓ age >= 18               [3 matches]
```

📖 **[Debug Guide →](./docs/guide/debugging.md)**

---

## Documentation

### 📖 Complete Guides

- **[Getting Started](./docs/guide/getting-started.md)** — Installation and first steps
- **[All Operators](./docs/guide/operators.md)** — Complete operator reference
- **[Geospatial Queries](./docs/guide/geospatial-operators.md)** — Location-based filtering
- **[Datetime Operators](./docs/guide/datetime-operators.md)** — Temporal filtering
- **[Framework Integrations](./docs/frameworks/index.md)** — React, Vue, Svelte, Angular, SolidJS, Preact
- **[Lazy Evaluation](./docs/guide/lazy-evaluation.md)** — Efficient large dataset processing
- **[Memoization & Caching](./docs/guide/memoization.md)** — Performance optimization
- **[Visual Debugging](./docs/guide/debugging.md)** — Debug mode and tree visualization

### 🎯 Quick Links

- [Interactive Playground](https://mcabreradev-filter.vercel.app/playground/) 🎮
- [API Reference](./docs/api/reference.md)
- [Examples](./examples/)
- [Migration Guide](./docs/advanced/migration.md)
- [Performance Benchmarks](./docs/advanced/performance-benchmarks.md)
- [FAQ](./docs/guide/faq.md)

---

## Performance

| Technique | Benefit |
|-----------|---------|
| Early-exit operators | Skip remaining items on first mismatch |
| LRU result cache | 530x–1520x speedup on repeated queries |
| LRU predicate cache | Compiled predicates reused across calls |
| LRU regex cache | Compiled patterns reused, bounded to 500 entries |
| Lazy generators | 500x faster when you don't need all results |
| Absolute TTL eviction | Stale entries removed after 5 min — no memory leaks |

```typescript
// Enable all optimizations at once
filter(data, expression, { enableCache: true });

// Maximum efficiency for large datasets
const first100 = filterFirst(millionRecords, { active: true }, 100);
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

**Good news:** v5.x is **100% backward compatible**. All v3.x code continues to work.

```typescript
// ✅ All v3.x syntax still works
filter(data, 'string');
filter(data, { prop: 'value' });
filter(data, (item) => true);
filter(data, '%pattern%');

// ✅ New in v5.x
filter(data, { age: { $gte: 18 } });
filter(data, expression, { enableCache: true, limit: 50 });
```

📖 **[Migration Guide →](./docs/advanced/migration.md)**

---

## Changelog

### v5.9.0 (Current)

- ✨ **New**: `find` — an alias for `filter` with identical signature and behavior. `import { find } from '@mcabreradev/filter'` returns `T[]` just like `filter`.
- ✨ **New**: `lazyFind` — the lazy-iterator helper (previously exported as `find`) is now exported as `lazyFind`. Returns `T | undefined`, exits on first match.
- ⚠️ **Breaking**: `find` exported from `@mcabreradev/filter` root **changed meaning**. Previously it was the lazy-iterator helper (`T | undefined`); it is now an alias for `filter` (`T[]`). Rename usages to `lazyFind`.

  ```typescript
  // Migrate: rename find → lazyFind for the iterable helper
  import { lazyFind } from '@mcabreradev/filter';
  const item = lazyFind(iterable, (x) => x.active); // T | undefined
  ```

### v5.8.2

- 🐛 **Bug Fix**: Wildcard regex now correctly escapes all special characters (`.`, `+`, `*`, `?`, `(`, `[`, `^`, etc.) — patterns like `%.txt` or `a.b%` no longer silently break
- 🐛 **Bug Fix**: `$timeOfDay` with `start > end` (e.g. `{ start: 22, end: 5 }`) now correctly fails validation instead of silently never matching
- 🐛 **Bug Fix**: React `useDebouncedFilter` now reacts to `delay` prop changes — previously the initial delay was frozen for the hook's lifetime
- 🔒 **Validation**: `limit` option now validated by schema — negative or non-integer values throw a clear configuration error
- 🔒 **Validation**: `debug`, `verbose`, `showTimings`, `colorize`, `enablePerformanceMonitoring` options now validated by schema
- ⚡ **Performance**: Pattern-matching regex cache now delegates to the shared LRU `MemoizationManager` — the previously unbounded `Map` is gone
- ⚡ **Performance**: LRU cache TTL is now absolute (expire 5 min after creation) instead of sliding — entries can no longer live forever under heavy load
- 🧹 **Code Quality**: Svelte pagination replaced `subscribe()()` anti-pattern with idiomatic `get()` from `svelte/store`
- ✅ **Tests**: 1,004+ tests — added coverage for every bug fixed in this release

### v5.8.0

- 🎨 **New Framework Integrations**: Angular, SolidJS, and Preact support
- 🔢 **Limit Option**: New `limit` configuration to restrict result count
- 📊 **OrderBy Option**: Sort filtered results by field(s) in ascending or descending order
- ✅ 993+ tests with comprehensive coverage

### v5.7.0

- 🅰️ **Angular**: Services and Pipes with Signals support
- 🔷 **SolidJS**: Signal-based reactive hooks
- ⚡ **Preact**: Lightweight hooks API

### v5.6.0

- 🌍 **Geospatial Operators**: Location-based filtering with `$near`, `$geoBox`, `$geoPolygon`
- 📅 **Datetime Operators**: Temporal filtering with `$recent`, `$upcoming`, `$dayOfWeek`, `$age`

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

MIT License — see [LICENSE.md](./LICENSE.md) for details.

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
