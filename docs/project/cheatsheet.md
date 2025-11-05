# Filter Cheat Sheet

> Quick reference guide for common filtering patterns and operators

## Table of Contents

- [Installation](#installation)
- [Basic Filtering](#basic-filtering)
- [Wildcard Patterns](#wildcard-patterns)
- [Object Filtering](#object-filtering)
- [Comparison Operators](#comparison-operators)
- [Array Operators](#array-operators)
- [String Operators](#string-operators)
- [Logical Operators](#logical-operators)
- [Geospatial Operators](#geospatial-operators)
- [Date/Time Operators](#datetime-operators)
- [Configuration Options](#configuration-options)
- [Framework Integration](#framework-integration)
- [Performance Tips](#performance-tips)

---

## Installation

```bash
# Install the library
npm install @mcabreradev/filter

# Optional: Install Zod for runtime validation
npm install zod
```

---

## Basic Filtering

### Simple String Match
```typescript
import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', city: 'Berlin' },
  { name: 'Bob', city: 'London' }
];

// Case-insensitive search across all properties
filter(users, 'Berlin');  // → Returns Alice
```

### Number Match
```typescript
const products = [
  { id: 1, price: 100 },
  { id: 2, price: 200 }
];

filter(products, 100);  // → Returns product with id: 1
```

### Boolean Match
```typescript
const tasks = [
  { title: 'Task 1', completed: true },
  { title: 'Task 2', completed: false }
];

filter(tasks, true);  // → Returns completed tasks
```

### Predicate Function
```typescript
filter(users, (user) => user.age > 25);
```

---

## Wildcard Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| `%` | Matches zero or more characters | `'%alice%'` matches "alice", "Alice123" |
| `_` | Matches exactly one character | `'A_'` matches "A1", "AB" |
| `!` | Negation | `'!admin'` excludes "admin" |

### Examples
```typescript
// Contains
filter(users, '%alice%');

// Starts with
filter(users, 'Al%');

// Ends with
filter(users, '%son');

// Exact length
filter(codes, 'A_');  // 'A1', 'A2', but not 'AB1'

// Negation
filter(users, '!admin');        // Exclude admin
filter(files, '!%.pdf');        // Exclude PDFs
```

---

## Object Filtering

### Single Property
```typescript
filter(products, { category: 'Electronics' });
```

### Multiple Properties (AND logic)
```typescript
filter(products, {
  category: 'Electronics',
  inStock: true,
  price: 100
});
```

### Nested Objects
```typescript
filter(users, {
  address: { city: 'Berlin' },
  settings: { theme: 'dark' }
});
```

### Array OR Syntax
```typescript
// OR logic for a single property
filter(products, { category: ['Electronics', 'Books'] });

// Multiple OR conditions (independent)
filter(users, {
  city: ['Berlin', 'Paris'],    // OR
  role: ['admin', 'moderator']  // AND + OR
});
```

---

## Comparison Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal to | `{ age: { $eq: 30 } }` |
| `$ne` | Not equal to | `{ role: { $ne: 'guest' } }` |
| `$gt` | Greater than | `{ price: { $gt: 100 } }` |
| `$gte` | Greater than or equal | `{ age: { $gte: 18 } }` |
| `$lt` | Less than | `{ price: { $lt: 50 } }` |
| `$lte` | Less than or equal | `{ stock: { $lte: 10 } }` |

### Examples
```typescript
// Single comparison
filter(products, { price: { $gt: 100 } });

// Range query
filter(products, {
  price: { $gte: 100, $lte: 500 }
});

// Date range
filter(orders, {
  date: {
    $gte: new Date('2025-01-01'),
    $lte: new Date('2025-12-31')
  }
});
```

---

## Array Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$in` | Value in array | `{ status: { $in: ['active', 'pending'] } }` |
| `$nin` | Value not in array | `{ status: { $nin: ['archived'] } }` |
| `$contains` | Array contains value | `{ tags: { $contains: 'sale' } }` |
| `$size` | Array size equals | `{ images: { $size: 3 } }` |

### Examples
```typescript
// In array
filter(products, {
  category: { $in: ['Electronics', 'Books'] }
});

// Not in array
filter(products, {
  status: { $nin: ['archived', 'deleted'] }
});

// Array contains
filter(products, {
  tags: { $contains: 'sale' }
});

// Array size
filter(products, {
  images: { $size: 3 }
});
```

---

## String Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$startsWith` | Starts with | `{ name: { $startsWith: 'Pro' } }` |
| `$endsWith` | Ends with | `{ email: { $endsWith: '@company.com' } }` |
| `$contains` | Contains substring | `{ title: { $contains: 'typescript' } }` |
| `$regex` | Regular expression | `{ email: { $regex: '^[a-z]+@' } }` |
| `$match` | Alias for $regex | `{ phone: { $match: /^\+1-/ } }` |

### Examples
```typescript
// Starts with
filter(files, {
  name: { $startsWith: 'report-' }
});

// Ends with
filter(users, {
  email: { $endsWith: '@company.com' }
});

// Contains
filter(articles, {
  title: { $contains: 'typescript' }
});

// Regex (string or RegExp)
filter(users, {
  email: { $regex: '^[a-z]+@example\\.com$' }
});

filter(users, {
  phone: { $regex: /^\+1-\d{3}-\d{4}$/ }
});
```

---

## Logical Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$and` | All conditions must match | `{ $and: [{ a: 1 }, { b: 2 }] }` |
| `$or` | At least one must match | `{ $or: [{ a: 1 }, { b: 2 }] }` |
| `$not` | Negates condition | `{ $not: { status: 'archived' } }` |

### Examples
```typescript
// AND
filter(products, {
  $and: [
    { category: 'Electronics' },
    { inStock: true },
    { price: { $lt: 1000 } }
  ]
});

// OR
filter(products, {
  $or: [
    { category: 'Electronics' },
    { category: 'Accessories' }
  ]
});

// NOT
filter(products, {
  $not: { category: 'Furniture' }
});

// Complex nested
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
```

---

## Geospatial Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$near` | Within radius | `{ location: { $near: { center, maxDistanceMeters } } }` |
| `$geoBox` | Bounding box | `{ location: { $geoBox: { southwest, northeast } } }` |
| `$geoPolygon` | Polygon containment | `{ location: { $geoPolygon: { points } } }` |

### Examples
```typescript
import { filter, type GeoPoint } from '@mcabreradev/filter';

const userLocation: GeoPoint = { lat: 52.52, lng: 13.405 };

// Find points within 5km
filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 5000
    }
  }
});

// Bounding box
filter(stores, {
  location: {
    $geoBox: {
      southwest: { lat: 52.5, lng: 13.3 },
      northeast: { lat: 52.6, lng: 13.5 }
    }
  }
});

// Polygon
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
```

---

## Date/Time Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$recent` | Within last N time units | `{ date: { $recent: { days: 7 } } }` |
| `$upcoming` | Within next N time units | `{ date: { $upcoming: { hours: 24 } } }` |
| `$dayOfWeek` | Specific days (0-6) | `{ date: { $dayOfWeek: [1, 2, 3, 4, 5] } }` |
| `$timeOfDay` | Hour range (0-23) | `{ time: { $timeOfDay: { start: 9, end: 17 } } }` |
| `$age` | Age calculation | `{ birthDate: { $age: { min: 18 } } }` |
| `$isWeekend` | Is weekend | `{ date: { $isWeekend: true } }` |
| `$isWeekday` | Is weekday | `{ date: { $isWeekday: true } }` |

### Examples
```typescript
// Last 7 days
filter(events, {
  date: { $recent: { days: 7 } }
});

// Next 24 hours
filter(events, {
  date: { $upcoming: { hours: 24 } }
});

// Weekdays only
filter(events, {
  date: { $dayOfWeek: [1, 2, 3, 4, 5] }
});

// Business hours (9 AM - 5 PM)
filter(events, {
  startTime: { $timeOfDay: { start: 9, end: 17 } }
});

// Adults (18+)
filter(users, {
  birthDate: { $age: { min: 18 } }
});

// Weekend events
filter(events, {
  date: { $isWeekend: true }
});
```

---

## Configuration Options

```typescript
import { filter } from '@mcabreradev/filter';

// Case-sensitive matching
filter(users, 'ALICE', { caseSensitive: true });

// Increase max depth for nested objects
filter(data, expression, { maxDepth: 5 });

// Enable caching for repeated queries (530x-1520x faster)
filter(largeDataset, expression, { enableCache: true });

// Enable debug mode
filter(users, expression, { debug: true });

// Verbose debug output
filter(users, expression, {
  debug: true,
  verbose: true,
  showTimings: true,
  colorize: true
});

// Custom comparison logic
filter(data, expression, {
  customComparator: (actual, expected) => actual === expected
});
```

### All Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `caseSensitive` | boolean | `false` | Case-sensitive string matching |
| `maxDepth` | number | `3` | Max depth for nested objects (1-10) |
| `enableCache` | boolean | `false` | Enable result caching |
| `debug` | boolean | `false` | Enable debug mode |
| `verbose` | boolean | `false` | Detailed debug info |
| `showTimings` | boolean | `false` | Show execution timings |
| `colorize` | boolean | `false` | ANSI colors in debug output |
| `customComparator` | function | - | Custom comparison function |

---

## Framework Integration

### React Hooks
```typescript
import { useFilter, useDebouncedFilter } from '@mcabreradev/filter/react';

// Basic usage
const { filtered, isFiltering } = useFilter(users, { active: true });

// Debounced search
const [search, setSearch] = useState('');
const { filtered, isPending } = useDebouncedFilter(users, search, { delay: 300 });
```

### Vue Composables
```typescript
import { ref } from 'vue';
import { useFilter } from '@mcabreradev/filter/vue';

const searchTerm = ref('');
const { filtered, isFiltering } = useFilter(users, searchTerm);
```

### Svelte Stores
```typescript
import { writable } from 'svelte/store';
import { useFilter } from '@mcabreradev/filter/svelte';

const searchTerm = writable('');
const { filtered, isFiltering } = useFilter(users, searchTerm);
```

---

## Performance Tips

### ✅ Use Lazy Evaluation for Large Datasets
```typescript
import { filterLazy, filterFirst } from '@mcabreradev/filter';

// Process items on-demand (500x faster)
const filtered = filterLazy(millionRecords, { active: true });
for (const item of filtered) {
  process(item);
  if (shouldStop) break;
}

// Find first N matches (early exit)
const first10 = filterFirst(users, { premium: true }, 10);
```

### ✅ Enable Caching for Repeated Queries
```typescript
// 530x-1520x faster for repeated queries
filter(largeDataset, expression, { enableCache: true });
```

### ✅ Use Operators Instead of Predicates
```typescript
// ✅ Fast: Operators with early exit
filter(data, { age: { $gte: 18 } });

// ⚠️ Slower: Complex predicates
filter(data, (item) => complexCalculation(item));
```

### ✅ Use Granular Imports
```typescript
// ✅ Small bundle (3 KB)
import { filter } from '@mcabreradev/filter/core';
import { evaluateGt } from '@mcabreradev/filter/operators/comparison';

// ⚠️ Larger bundle (4 KB)
import { filter } from '@mcabreradev/filter';
```

---

## Common Patterns

### E-commerce Product Search
```typescript
filter(products, {
  category: { $in: ['Electronics', 'Computers'] },
  price: { $gte: 100, $lte: 2000 },
  inStock: true,
  rating: { $gte: 4.0 },
  name: { $contains: searchTerm }
});
```

### User Management
```typescript
filter(users, {
  $and: [
    { active: true },
    { role: { $in: ['admin', 'moderator'] } },
    { $or: [
      { lastLogin: { $recent: { days: 30 } } },
      { email: { $endsWith: '@company.com' } }
    ]}
  ]
});
```

### Location-based Search
```typescript
filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 5000
    }
  },
  rating: { $gte: 4.5 },
  isOpen: true,
  cuisine: { $in: ['Italian', 'Japanese'] }
});
```

### Event Calendar
```typescript
filter(events, {
  date: {
    $upcoming: { days: 7 },
    $dayOfWeek: [1, 2, 3, 4, 5]  // Weekdays
  },
  startTime: {
    $timeOfDay: { start: 9, end: 17 }  // Business hours
  },
  category: { $in: ['meeting', 'conference'] }
});
```

---

## Quick Reference Card

```typescript
// Basic
filter(data, 'search');              // Simple search
filter(data, { prop: value });       // Object match
filter(data, (item) => condition);   // Predicate

// Wildcards
filter(data, '%search%');            // Contains
filter(data, 'prefix%');             // Starts with
filter(data, '%suffix');             // Ends with
filter(data, '!excluded');           // Not equal

// Comparison
{ price: { $gt: 100 } }              // Greater than
{ age: { $gte: 18, $lte: 65 } }      // Range

// Arrays
{ tags: { $contains: 'sale' } }      // Array contains
{ status: { $in: ['active'] } }      // In array

// Strings
{ name: { $startsWith: 'Pro' } }     // Starts with
{ email: { $endsWith: '.com' } }     // Ends with
{ title: { $contains: 'JS' } }       // Contains

// Logical
{ $and: [...conditions] }            // All match
{ $or: [...conditions] }             // Any match
{ $not: { status: 'archived' } }     // Negation

// Location
{ location: { $near: { ... } } }     // Within radius

// Date/Time
{ date: { $recent: { days: 7 } } }   // Last 7 days
{ date: { $dayOfWeek: [1,2,3] } }    // Mon-Wed
```

---

## Need More Help?

- 📖 [Complete Documentation](../advanced/wiki.md)
- 🎮 [Interactive Playground](https://mcabreradev-filter.vercel.app/playground/)
- 💬 [GitHub Discussions](https://github.com/mcabreradev/filter/discussions)
- 🐛 [Issue Tracker](https://github.com/mcabreradev/filter/issues)
- ⭐ [Star on GitHub](https://github.com/mcabreradev/filter)

---

**Made with ❤️ for the JavaScript/TypeScript community**
