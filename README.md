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
- **✨ Smart Autocomplete** - IntelliSense suggests only valid operators for each property type
- **🎨 Multiple Strategies** - String patterns, objects, predicates, operators, or custom comparators
- **🚀 Performance Optimized** - Optional caching and regex compilation optimization
- **📦 MongoDB-Style Operators** - 21+ operators for advanced filtering (v5.0.0+)
- **🌍 Geospatial Operators** - Location-based filtering with $near, $geoBox, $geoPolygon (v5.6.0+)
- **💨 Lazy Evaluation** - Process large datasets efficiently with generators (v5.1.0+)
- **🎨 Framework Integrations** - React, Vue, and Svelte support (v5.3.0+)
- **🧪 Battle-Tested** - 523+ tests ensuring reliability

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

> 🎮 **[Try it live in the Interactive Playground!](https://mcabreradev-filter.vercel.app/playground/)**

---

## Framework Integrations 🎨

**New in v5.4.0**: Full framework integration support for React, Vue, and Svelte!

### React Hooks

```typescript
import { useFilter, useDebouncedFilter, usePaginatedFilter } from '@mcabreradev/filter';

function UserList() {
  const { filtered, isFiltering } = useFilter(users, { active: true });

  return (
    <div>
      {isFiltering && <span>Filtering...</span>}
      {filtered.map(user => <User key={user.id} {...user} />)}
    </div>
  );
}

function SearchUsers() {
  const [search, setSearch] = useState('');
  const { filtered, isPending } = useDebouncedFilter(users, search, { delay: 300 });

  return (
    <div>
      <input onChange={(e) => setSearch(e.target.value)} />
      {isPending && <span>Loading...</span>}
      {filtered.map(user => <User key={user.id} {...user} />)}
    </div>
  );
}
```

### Vue Composables

```vue
<script setup>
import { ref } from 'vue';
import { useFilter, usePaginatedFilter } from '@mcabreradev/filter';

const searchTerm = ref('');
const { filtered, isFiltering } = useFilter(users, searchTerm);
</script>

<template>
  <div>
    <span v-if="isFiltering">Filtering...</span>
    <div v-for="user in filtered" :key="user.id">{{ user.name }}</div>
  </div>
</template>
```

### Svelte Stores

```svelte
<script>
import { writable } from 'svelte/store';
import { useFilter } from '@mcabreradev/filter';

const searchTerm = writable('');
const { filtered, isFiltering } = useFilter(users, searchTerm);
</script>

{#if $isFiltering}
  <span>Filtering...</span>
{/if}
{#each $filtered as user (user.id)}
  <div>{user.name}</div>
{/each}
```

**Features**:
- ✅ React Hooks: `useFilter`, `useFilteredState`, `useDebouncedFilter`, `usePaginatedFilter`
- ✅ Vue Composables: Full Composition API support with reactivity
- ✅ Svelte Stores: Reactive stores with derived state
- ✅ TypeScript: Full type safety with generics
- ✅ SSR Compatible: Works with Next.js, Nuxt, and SvelteKit

See Framework Integrations Guide for complete documentation.

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

### MongoDB-Style Operators (v5.0.0+)

Powerful operators for advanced filtering with **intelligent autocomplete** - TypeScript suggests only valid operators for each property type!

```typescript
interface Product {
  name: string;
  price: number;
  tags: string[];
  inStock: boolean;
}

// TypeScript autocompletes operators based on property types
filter(products, {
  price: {
    // Suggests: $gt, $gte, $lt, $lte, $eq, $ne
    $gte: 100,
    $lte: 500
  },
  name: {
    // Suggests: $startsWith, $endsWith, $contains, $regex, $match, $eq, $ne
    $startsWith: 'Laptop'
  },
  tags: {
    // Suggests: $in, $nin, $contains, $size
    $contains: 'sale'
  },
  inStock: {
    // Suggests: $eq, $ne
    $eq: true
  }
});
```

📖 **[Learn more about autocomplete →](docs/guide/autocomplete.md)**

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

// Regular expressions
filter(users, {
  email: { $regex: '^[a-z]+@example\\.com$' }
});

filter(users, {
  phone: { $regex: /^\+1-\d{3}-\d{4}$/ }
});

// $match is an alias for $regex
filter(users, {
  username: { $match: '^[a-z]+\\d+$' }
});
```

**Available:** `$startsWith`, `$endsWith`, `$contains`, `$regex`, `$match`

#### Logical Operators (v5.2.0+)

Combine multiple conditions with logical operators:

```typescript
// $and - All conditions must match
filter(products, {
  $and: [
    { category: 'Electronics' },
    { inStock: true },
    { price: { $lt: 1000 } }
  ]
});

// $or - At least one condition must match
filter(products, {
  $or: [
    { category: 'Electronics' },
    { category: 'Accessories' }
  ]
});

// $not - Negates the condition
filter(products, {
  $not: { category: 'Furniture' }
});

// Complex nested queries
filter(products, {
  $and: [
    { inStock: true },
    {
      $or: [
        { rating: { $gte: 4.5 } },
        { price: { $lt: 50 } }
      ]
    },
    { $not: { category: 'Clearance' } }
  ]
});

// Combine with field-level conditions
filter(products, {
  category: 'Electronics',
  $and: [
    { price: { $gte: 100 } },
    { $or: [{ inStock: true }, { preOrder: true }] }
  ]
});
```

**Available:** `$and`, `$or`, `$not`

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

#### Array OR Syntax (v5.5.0+)

**New in v5.5.0**: Intuitive array-based OR filtering without explicit `$in` operator!

```typescript
// Array syntax - clean and intuitive (OR logic)
filter(products, { category: ['Electronics', 'Books'] });
// Equivalent to: { category: { $in: ['Electronics', 'Books'] } }

// Multiple properties with array OR (independent OR conditions)
filter(products, {
  category: ['Electronics', 'Accessories'],
  price: [100, 200, 300]
});
// Logic: (category === 'Electronics' OR category === 'Accessories') 
//    AND (price === 100 OR price === 200 OR price === 300)

// Combining array OR with other conditions (AND logic)
filter(users, {
  city: ['Berlin', 'Paris'],
  age: 30,
  role: ['admin', 'moderator']
});
// Logic: (city === 'Berlin' OR city === 'Paris') 
//    AND age === 30 
//    AND (role === 'admin' OR role === 'moderator')

// Works with wildcards
filter(users, { email: ['%@gmail.com', '%@yahoo.com'] });
// Matches emails ending with @gmail.com OR @yahoo.com

// Empty array matches nothing
filter(products, { category: [] });
// → Returns empty array
```

**Benefits:**
- ✨ More intuitive than `$in` operator
- 📝 Cleaner, more readable code
- 🔄 100% backward compatible
- 🎯 Works with strings, numbers, booleans
- 🌟 Supports wildcard patterns

#### Geospatial Operators (v5.6.0+)

**New in v5.6.0**: Filter by geographic location with powerful spatial operators!

```typescript
import { filter, type GeoPoint } from '@mcabreradev/filter';

interface Restaurant {
  name: string;
  location: GeoPoint;
  rating: number;
}

const userLocation: GeoPoint = { lat: 52.52, lng: 13.405 };

// $near - Find points within radius
filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 5000
    }
  }
});

// $geoBox - Bounding box queries
filter(stores, {
  location: {
    $geoBox: {
      southwest: { lat: 52.5, lng: 13.3 },
      northeast: { lat: 52.6, lng: 13.5 }
    }
  }
});

// $geoPolygon - Polygon containment
filter(properties, {
  location: {
    $geoPolygon: {
      points: [
        { lat: 51.5074, lng: -0.1278 },
        { lat: 51.5100, lng: -0.1200 },
        { lat: 51.5050, lng: -0.1150 },
        { lat: 51.5020, lng: -0.1250 }
      ]
    }
  }
});

// Combine with other filters
filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 3000
    }
  },
  rating: { $gte: 4.5 },
  isOpen: true
});
```

**Available:** `$near`, `$geoBox`, `$geoPolygon`

**Features:**
- 🌍 Location-based filtering
- 📏 Accurate distance calculation
- 🗺️ Bounding box and polygon support
- ⚡ Fast spherical law of cosines
- 🔒 Automatic coordinate validation

See [Geospatial Operators Guide](./docs/guide/geospatial-operators.md) for complete documentation.

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

## Lazy Evaluation (v5.1.0+)

Efficiently process large datasets with lazy evaluation:

```typescript
import { filterLazy, filterFirst, filterExists, filterCount, toArray, take, map } from '@mcabreradev/filter';

// Lazy evaluation - process items on-demand
const filtered = filterLazy(millionRecords, { active: true });
for (const item of filtered) {
  process(item);
  if (shouldStop) break; // Early exit - stops processing immediately
}

// Find first N matches with early exit optimization
const first10 = filterFirst(users, { premium: true }, 10);

// Check existence without processing all items
const hasAdmin = filterExists(users, { role: 'admin' });

// Count matching items
const activeCount = filterCount(users, { active: true });

// Compose lazy operations for powerful pipelines
const result = toArray(
  take(
    map(filterLazy(users, { active: true }), u => u.name),
    100
  )
);

// Chunked processing for batch operations
for (const chunk of filterLazyChunked(largeDataset, { needsProcessing: true }, 1000)) {
  await api.batchUpdate(chunk);
}
```

**Benefits:**
- 🚀 **500x faster** for operations that don't need all results
- 💾 **100,000x less memory** for large datasets
- ⚡ **Early exit** optimization for existence checks
- 🔄 **Streaming** support for async data sources
- 📦 **Chunked processing** for batch operations

See [Lazy Evaluation Guide](./docs/guide/lazy-evaluation.md) for complete documentation.

---

## Memoization & Performance 💾

**New in v5.2.0**: Advanced multi-layer memoization strategy for maximum performance.

The library implements a sophisticated caching system with three layers:

1. **Result Cache** - Caches complete filter results
2. **Predicate Cache** - Memoizes compiled predicate functions
3. **Regex Cache** - Caches compiled regex patterns

### Basic Usage

```typescript
import { filter, clearFilterCache, getFilterCacheStats } from '@mcabreradev/filter';

const largeDataset = [...];

// First call - processes data
const results = filter(largeDataset, { age: { $gte: 18 } }, { enableCache: true });

// Second call - returns cached result instantly
const sameResults = filter(largeDataset, { age: { $gte: 18 } }, { enableCache: true });
```

### Performance Gains

| Scenario | Without Cache | With Cache | Speedup |
|----------|---------------|------------|---------|
| Simple query (10K items) | 5.3ms | 0.01ms | **530x** |
| Regex pattern | 12.1ms | 0.02ms | **605x** |
| Complex nested | 15.2ms | 0.01ms | **1520x** |

### Real-World Example

```typescript
const products = await fetchProducts();

const electronics = filter(
  products,
  {
    category: { $in: ['Electronics', 'Computers'] },
    price: { $gte: 100, $lte: 2000 },
    inStock: true,
    rating: { $gte: 4.0 }
  },
  { enableCache: true }
);

const electronicsAgain = filter(
  products,
  {
    category: { $in: ['Electronics', 'Computers'] },
    price: { $gte: 100, $lte: 2000 },
    inStock: true,
    rating: { $gte: 4.0 }
  },
  { enableCache: true }
);
```

### Cache Management

```typescript
// Get cache statistics
const stats = getFilterCacheStats();
console.log(stats);
// { hits: 150, misses: 10, size: 25, hitRate: 0.9375 }

// Clear cache when data changes
clearFilterCache();

// Memory management
let data = [/* large dataset */];
filter(data, query, { enableCache: true });
data = null; // Cache will be garbage collected
```

### When to Enable Caching

✅ **Enable for:**
- Large datasets (>1,000 items)
- Repeated identical queries
- Complex expressions with regex
- Read-heavy workloads
- Dashboard/analytics views

❌ **Disable for:**
- Frequently changing data
- One-time queries
- Memory-constrained environments
- Unique expressions every time

### Complete Example: Dashboard with Caching

```typescript
import { filter, clearFilterCache } from '@mcabreradev/filter';

class ProductDashboard {
  private products: Product[];

  constructor(products: Product[]) {
    this.products = products;
  }

  getElectronics() {
    return filter(
      this.products,
      { category: 'Electronics' },
      { enableCache: true }
    );
  }

  getHighRated() {
    return filter(
      this.products,
      { rating: { $gte: 4.5 } },
      { enableCache: true }
    );
  }

  refreshData(newProducts: Product[]) {
    this.products = newProducts;
    clearFilterCache();
  }
}

const dashboard = new ProductDashboard(products);

dashboard.getElectronics();
dashboard.getHighRated();

dashboard.getElectronics();
dashboard.getHighRated();
```

See [Memoization Guide](./docs/guide/memoization.md) for complete documentation.

---

## Visual Debugging (v5.5.0+) 🐛

**New in v5.5.0**: Built-in debug mode with expression tree visualization, performance metrics, and condition tracking!

### Basic Debug Mode

Enable debug mode to see how your filter expressions are evaluated:

```typescript
import { filter } from '@mcabreradev/filter';

// Enable debug mode with config option
filter(users, { city: 'Berlin' }, { debug: true });

// Console output:
// ┌─ Filter Debug Tree
// │  Expression: {"city":"Berlin"}
// │  Matched: 3/10 (30.0%)
// │  Execution time: 0.42ms
// └─ ✓ city = "Berlin"
```

### Advanced Debugging Features

```typescript
// Verbose mode - detailed evaluation info
filter(users, { age: { $gte: 25 } }, { 
  debug: true, 
  verbose: true 
});

// Show execution timings
filter(products, { premium: true }, { 
  debug: true, 
  showTimings: true 
});

// Colorized output (ANSI colors)
filter(users, { city: 'Berlin' }, { 
  debug: true, 
  colorize: true 
});

// All options combined
filter(users, { 
  age: { $gte: 25 }, 
  city: 'Berlin' 
}, { 
  debug: true, 
  verbose: true, 
  showTimings: true, 
  colorize: true 
});
```

### Programmatic Access

Use `filterDebug` for programmatic access to debug information:

```typescript
import { filterDebug } from '@mcabreradev/filter';

const result = filterDebug(users, { age: { $gte: 30 } });

console.log('Matched:', result.items.map(u => u.name));
console.log('Stats:', {
  matched: result.stats.matched,
  total: result.stats.total,
  percentage: result.stats.percentage,
  executionTime: result.stats.executionTime,
  conditionsEvaluated: result.stats.conditionsEvaluated
});

// Access debug tree
console.log('Debug Tree:', result.debug.tree);
```

### Debug Complex Expressions

Visualize complex nested expressions:

```typescript
filter(products, {
  $and: [
    { category: 'Electronics' },
    { inStock: true },
    {
      $or: [
        { rating: { $gte: 4.5 } },
        { price: { $lt: 50 } }
      ]
    }
  ]
}, { debug: true, verbose: true });

// Console output shows tree structure:
// ┌─ Filter Debug Tree
// │  Expression: Complex nested query
// │  Matched: 5/10 (50.0%)
// │  Execution time: 1.23ms
// ├─ AND
// │  ├─ ✓ category = "Electronics"
// │  ├─ ✓ inStock = true
// │  └─ OR
// │     ├─ ✓ rating >= 4.5
// │     └─ ✗ price < 50
// └─ Conditions evaluated: 8
```

**Debug Options:**
- `debug` (boolean) - Enable debug mode
- `verbose` (boolean) - Show detailed evaluation info
- `showTimings` (boolean) - Display execution timings
- `colorize` (boolean) - Use ANSI colors in output

**Use Cases:**
- 🔍 Understanding complex filter logic
- ⚡ Performance optimization
- 🐛 Debugging unexpected results
- 📊 Analytics and monitoring
- 🧪 Testing and validation

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

// Enable debug mode (v5.5.0+)
filter(users, expression, { debug: true });

// Custom comparison logic
filter(data, expression, {
  customComparator: (actual, expected) => actual === expected
});
```

**Available Options:**

- `caseSensitive` (boolean, default: `false`) - Case-sensitive string matching
- `maxDepth` (number, default: `3`, range: 1-10) - Max depth for nested objects
- `enableCache` (boolean, default: `false`) - Enable result caching
- `debug` (boolean, default: `false`) - Enable debug mode with tree visualization (v5.5.0+)
- `verbose` (boolean, default: `false`) - Show detailed evaluation info in debug mode (v5.5.0+)
- `showTimings` (boolean, default: `false`) - Display execution timings in debug mode (v5.5.0+)
- `colorize` (boolean, default: `false`) - Use ANSI colors in debug output (v5.5.0+)
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
- **Optional caching** for repeated queries on large datasets (530x-1520x faster)
- **Lazy evaluation** for efficient large dataset processing (500x faster)
- **Type guards** for fast type checking

```typescript
// ✅ Fast: Operators with early exit
filter(data, { age: { $gte: 18 } });

// ✅ Fast with caching for repeated queries
filter(largeData, expression, { enableCache: true });

// ✅ Fast with lazy evaluation for large datasets
const result = filterFirst(millionRecords, { active: true }, 100);

// ⚠️ Slower: Complex predicates (but more flexible)
filter(data, (item) => complexCalculation(item));
```

For performance optimization tips, see [Performance Guide](./docs/advanced/wiki.md#performance-optimization).

---

## Documentation

### 📖 Complete Documentation

- **[Complete Wiki](./docs/advanced/wiki.md)** - Complete documentation with 150+ examples, API reference, TypeScript guide, real-world use cases, FAQ, and troubleshooting
- **[Framework Integrations](./docs/frameworks/overview.md)** - Complete guide for React, Vue, and Svelte integrations
- **[Operators Guide](./docs/guide/operators.md)** - Detailed guide for all 21+ MongoDB-style operators with examples and advanced regex patterns
- **[Geospatial Operators](./docs/guide/geospatial-operators.md)** - Complete guide for location-based filtering with $near, $geoBox, $geoPolygon
- **[Lazy Evaluation](./docs/guide/lazy-evaluation.md)** - Comprehensive guide to lazy evaluation for efficient large dataset processing
- **[Logical Operators](./docs/guide/logical-operators.md)** - Advanced patterns and complex queries with $and, $or, $not
- **[Performance Benchmarks](./docs/advanced/performance-benchmarks.md)** - Detailed performance metrics and optimization strategies
- **[Migration Guide](./docs/advanced/migration.md)** - Migration guide from v3.x or native Array.filter()
- **[Examples](./examples/)** - Real-world usage examples and code samples

### 🎯 Quick Links

- [Installation & Setup](./docs/guide/installation.md)
- [Interactive Playground](https://mcabreradev-filter.vercel.app/playground/) 🎮 NEW
- [Framework Integrations](./docs/frameworks/overview.md) ⭐ NEW
- [Geospatial Operators](./docs/guide/geospatial-operators.md) 🌍 NEW
- [All Operators Reference](./docs/guide/operators.md)
- [Regex Patterns Guide](./docs/guide/operators.md#string-operators)
- [Logical Operators Guide](./docs/guide/logical-operators.md)
- [Lazy Evaluation](./docs/guide/lazy-evaluation.md)
- [Memoization & Caching](./docs/guide/memoization.md)
- [Performance Benchmarks](./docs/advanced/performance-benchmarks.md)
- [TypeScript Integration](./docs/advanced/wiki.md#typescript-integration)
- [Real-World Examples](./docs/examples/real-world.md)
- [Performance Tips](./docs/advanced/wiki.md#performance-optimization)
- [API Reference](./docs/api/reference.md)
- [FAQ](./docs/advanced/wiki.md#frequently-asked-questions)
- [Troubleshooting](./docs/advanced/wiki.md#troubleshooting)

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
filter(data, expression, { caseSensitive: true });
filter(data, expression, { enableCache: true });
```

**What's New in v5.x:**
- **v5.5.0**: Array OR syntax, visual debugging, interactive playground
- **v5.4.0**: Framework integrations (React, Vue, Svelte)
- **v5.3.0**: Initial framework support
- **v5.2.0**: Enhanced memoization, logical operators ($and, $or, $not), regex operators
- **v5.1.0**: Lazy evaluation with generators
- **v5.0.0**: 18+ MongoDB-style operators, configuration API, runtime validation

See [Migration Guide](./docs/advanced/migration.md) for detailed migration guide.

---

## API Overview

```typescript
// Main filter function
filter<T>(array: T[], expression: Expression<T>, options?: FilterOptions): T[]

// Lazy evaluation functions
filterLazy<T>(array: T[], expression: Expression<T>, options?: FilterOptions): IterableIterator<T>
filterFirst<T>(array: T[], expression: Expression<T>, count: number, options?: FilterOptions): T[]
filterExists<T>(array: T[], expression: Expression<T>, options?: FilterOptions): boolean
filterCount<T>(array: T[], expression: Expression<T>, options?: FilterOptions): number

// Validation functions
validateExpression(expression: unknown): Expression<T>
validateOptions(options: unknown): FilterOptions

// Cache management
clearFilterCache(): void
getFilterCacheStats(): { hits: number; misses: number; size: number; hitRate: number }

// Configuration
mergeConfig(options?: FilterOptions): FilterConfig
createFilterConfig(options?: FilterOptions): FilterConfig

// Geospatial utilities
calculateDistance(p1: GeoPoint, p2: GeoPoint): number
isValidGeoPoint(point: unknown): point is GeoPoint
evaluateNear(point: GeoPoint, query: NearQuery): boolean
evaluateGeoBox(point: GeoPoint, box: BoundingBox): boolean
evaluateGeoPolygon(point: GeoPoint, query: PolygonQuery): boolean

// Framework integrations
useFilter<T>(data: T[], expression: Expression<T>, options?: FilterOptions) // React
useFilter<T>(data: Ref<T[]>, expression: Ref<Expression<T>>, options?: FilterOptions) // Vue
filterStore<T>(data: Writable<T[]>, expression: Writable<Expression<T>>, options?: FilterOptions) // Svelte
```

For complete API reference, see [API Reference](./docs/api/reference.md).

---

## Browser Support

Works in all modern browsers and Node.js:

- **Node.js:** >= 20
- **Browsers:** Chrome, Firefox, Safari, Edge (latest versions)
- **TypeScript:** >= 5.0
- **Module Systems:** ESM, CommonJS

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Development setup and workflow
- Testing requirements
- Coding standards
- Pull request process

**Ways to Contribute:**
- Report bugs or request features via [GitHub Issues](https://github.com/mcabreradev/filter/issues)
- Submit pull requests with bug fixes or new features
- Improve documentation
- Share your use cases and examples

For detailed guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage

# Type checking
pnpm typecheck
```

The library has 270+ tests with comprehensive coverage of all features.

---

## Changelog

### v5.6.0 (Current)
- 🌍 **Geospatial Operators**: Location-based filtering with $near, $geoBox, $geoPolygon
- 📏 **Distance Calculation**: Spherical law of cosines for accurate distance measurement
- 🗺️ **Spatial Queries**: Proximity search, bounding box, and polygon containment
- 🔒 **Coordinate Validation**: Automatic validation of lat/lng coordinates
- ⚡ **Performance Optimized**: Fast algorithms for all geospatial operations
- 📚 Complete geospatial documentation and examples
- ✅ 26 new tests (549 total tests)

### v5.5.1
- 🐛 Bug fixes and stability improvements
- 📚 Documentation updates
- 🔧 Build optimizations

### v5.5.0
- 🎨 **Array OR Syntax**: Intuitive array-based OR filtering (`{ city: ['Berlin', 'Paris'] }`)
- 🐛 **Visual Debugging**: Built-in debug mode with expression tree visualization
- 🎮 **Interactive Playground**: New online playground for testing filters
- 📊 **Debug Analytics**: Performance metrics and condition evaluation tracking
- 🎨 **Colorized Output**: ANSI color support for debug tree visualization
- ⚡ Performance improvements for array operations

### v5.4.0
- 🎨 **Framework Integrations**: React, Vue, and Svelte support
- 🪝 React Hooks: `useFilter`, `useFilteredState`, `useDebouncedFilter`, `usePaginatedFilter`
- 🔄 Vue Composables: Full Composition API support with reactive refs
- 📦 Svelte Stores: Reactive store-based filtering
- 📚 Comprehensive framework documentation
- ✅ 100% test coverage for all integrations
- 🔒 TypeScript generics for type safety
- 🌐 SSR compatibility (Next.js, Nuxt, SvelteKit)

### v5.3.0
- 🎨 Initial framework integration support
- 🪝 React hooks implementation
- 🔄 Vue composables implementation
- 📦 Svelte stores implementation

### v5.2.0
- 💾 **Enhanced Memoization**: Multi-layer caching (530x faster)
- 🔀 **Logical Operators**: $and, $or, $not for complex queries
- 📝 **Regex Operators**: $regex and $match for pattern matching
- 🚀 Performance optimizations

### v5.1.0
- 💨 **Lazy Evaluation**: filterLazy, filterFirst for efficient processing
- 🔄 Generator-based filtering
- ⚡ Early exit optimization

### v5.0.0
- ✨ Added 18+ MongoDB-style operators
- ⚙️ Configuration API with 4 options
- ✅ Runtime validation with Zod
- 🚀 Performance optimizations
- 📘 Enhanced TypeScript support
- 🧪 270+ tests
- 📁 Reorganized documentation into `/docs` directory

See [Migration Guide](./docs/advanced/migration.md) for detailed changelog and migration guide.

---

## License

MIT License - see [LICENSE.md](./LICENSE.md) for details.

Copyright (c) 2025 Miguelangel Cabrera

---

## Credits

**Author:** [Miguelángel Cabrera](https://github.com/mcabreradev)
**Repository:** [github.com/mcabreradev/filter](https://github.com/mcabreradev/filter)

Inspired by MongoDB query syntax, SQL wildcards, and functional programming patterns.

---

## Support

- 📖 Complete Documentation
- 💬 [GitHub Discussions](https://github.com/mcabreradev/filter/discussions)
- 🐛 [Issue Tracker](https://github.com/mcabreradev/filter/issues)
- ⭐ [Star on GitHub](https://github.com/mcabreradev/filter)

---

<p align="center">
  <strong>Made with ❤️ for the JavaScript/TypeScript community</strong>
</p>
