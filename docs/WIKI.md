# @mcabreradev/filter - Complete Documentation Wiki

<p align="center">
  <a href="https://www.npmjs.com/package/@mcabreradev/filter">
    <img alt="NPM version" src="https://img.shields.io/npm/v/@mcabreradev/filter.svg?style=for-the-badge&labelColor=0869B8">
  </a>
  <a href="https://github.com/mcabreradev/filter/blob/main/LICENSE.md">
    <img alt="License" src="https://img.shields.io/npm/l/@mcabreradev/filter.svg?style=for-the-badge&labelColor=579805">
  </a>
  <a href="https://bundlephobia.com/package/@mcabreradev/filter">
    <img alt="Bundle Size" src="https://img.shields.io/bundlephobia/minzip/@mcabreradev/filter?style=for-the-badge&labelColor=orange">
  </a>
  <a href="#">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=for-the-badge&labelColor=blue">
  </a>
</p>

> **Version 5.0.0** - A powerful, SQL-like array filtering library for TypeScript and JavaScript with advanced pattern matching, MongoDB-style operators, deep object comparison, and zero dependencies.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation & Setup](#installation--setup)
3. [Quick Start](#quick-start)
4. [Basic Usage](#basic-usage)
   - [String Filtering](#string-filtering)
   - [Number Filtering](#number-filtering)
   - [Boolean Filtering](#boolean-filtering)
5. [Wildcard Patterns](#wildcard-patterns)
   - [Percent Wildcard (%)](#percent-wildcard-)
   - [Underscore Wildcard (_)](#underscore-wildcard-_)
   - [Negation (!)](#negation-)
6. [Object-Based Filtering](#object-based-filtering)
   - [Single Property Match](#single-property-match)
   - [Multiple Properties (AND Logic)](#multiple-properties-and-logic)
   - [Nested Objects](#nested-objects)
7. [Predicate Functions](#predicate-functions)
   - [Basic Predicates](#basic-predicates)
   - [Advanced Predicates](#advanced-predicates)
8. [MongoDB-Style Operators](#mongodb-style-operators)
   - [Comparison Operators](#comparison-operators)
   - [Array Operators](#array-operators)
   - [String Operators](#string-operators)
   - [Combining Operators](#combining-operators)
9. [Configuration API](#configuration-api)
   - [caseSensitive](#casesensitive)
   - [maxDepth](#maxdepth)
   - [enableCache](#enablecache)
   - [customComparator](#customcomparator)
10. [Mixing Syntax Patterns](#mixing-syntax-patterns)
11. [TypeScript Integration](#typescript-integration)
12. [Real-World Examples](#real-world-examples)
13. [Performance Optimization](#performance-optimization)
14. [Migration Guides](#migration-guides)
15. [Validation & Error Handling](#validation--error-handling)
16. [API Reference](#api-reference)
17. [Testing Your Filters](#testing-your-filters)
18. [Frequently Asked Questions](#frequently-asked-questions)
19. [Troubleshooting](#troubleshooting)
20. [Contributing & Support](#contributing--support)
21. [Version History](#version-history)
22. [License & Credits](#license--credits)

---

## Introduction

`@mcabreradev/filter` is a powerful filtering library that goes far beyond JavaScript's native `Array.filter()`. It provides multiple filtering strategies including string patterns, wildcards, object matching, predicates, and MongoDB-style operators.

### Key Features

- **🎯 SQL-like Wildcards** - Use `%` and `_` for flexible pattern matching
- **🔍 Deep Object Filtering** - Search through nested objects up to configurable depths
- **⚡ Zero Dependencies** - Lightweight and production-ready (only Zod for runtime validation)
- **🔒 Type-Safe** - Built with strict TypeScript for maximum reliability
- **🎨 Multiple Strategies** - String patterns, objects, predicates, operators, or custom comparators
- **🚀 Performance Optimized** - Optional caching and regex compilation optimization
- **🧪 Battle-Tested** - 240+ tests ensuring reliability
- **📦 MongoDB-Style Operators** - 13 operators for advanced filtering (v5.0.0+)

### Why Choose This Library?

1. **Flexible**: Multiple ways to filter - choose what fits your use case
2. **Powerful**: Handles complex scenarios that native filter can't
3. **Type-Safe**: Full TypeScript support with strict typing
4. **Tested**: Comprehensive test suite with 100% operator coverage
5. **Modern**: Built with latest best practices and tools
6. **Documented**: Extensive documentation with real-world examples

[↑ Back to top](#table-of-contents)

---

## Installation & Setup

### Installation

Choose your preferred package manager:

```bash
# Using npm
npm install @mcabreradev/filter

# Using yarn
yarn add @mcabreradev/filter

# Using pnpm
pnpm add @mcabreradev/filter
```

### TypeScript Configuration

The library is built with TypeScript and requires **Node.js >= 20**. For optimal TypeScript experience, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Import Examples

#### ES Modules (Recommended)

```typescript
import { filter } from '@mcabreradev/filter';

// With types
import type { Expression, FilterOptions } from '@mcabreradev/filter';
```

#### CommonJS

```javascript
const { filter } = require('@mcabreradev/filter');

// In TypeScript
import filter = require('@mcabreradev/filter');
```

#### Default Import

```typescript
import filter from '@mcabreradev/filter';
```

[↑ Back to top](#table-of-contents)

---

## Quick Start

Get started with the most common use cases:

```typescript
import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', age: 30, city: 'Berlin', role: 'admin' },
  { name: 'Bob', age: 25, city: 'London', role: 'user' },
  { name: 'Charlie', age: 35, city: 'Berlin', role: 'user' }
];

// Simple string matching (searches all properties)
filter(users, 'Berlin');
// → [Alice, Charlie]

// Object-based filtering (exact match)
filter(users, { city: 'Berlin', age: 30 });
// → [Alice]

// Predicate function
filter(users, (user) => user.age > 28);
// → [Alice, Charlie]

// MongoDB-style operators (v5.0.0+)
filter(users, { age: { $gte: 25, $lt: 35 } });
// → [Bob, Alice]
```

[↑ Back to top](#table-of-contents)

---

## Basic Usage

### String Filtering

Filter arrays by searching for a string across all object properties.

#### Simple String Match

```typescript
const products = [
  { id: 1, name: 'Laptop', brand: 'Dell' },
  { id: 2, name: 'Mouse', brand: 'Logitech' },
  { id: 3, name: 'Keyboard', brand: 'Dell' }
];

// Find all products with "Dell" (case-insensitive by default)
filter(products, 'Dell');
// → [{ id: 1, name: 'Laptop', brand: 'Dell' }, { id: 3, name: 'Keyboard', brand: 'Dell' }]

filter(products, 'laptop');
// → [{ id: 1, name: 'Laptop', brand: 'Dell' }]
```

#### Case-Sensitive Matching

```typescript
// Case-sensitive search
filter(products, 'Dell', { caseSensitive: true });
// → Finds only exact "Dell" matches

filter(products, 'dell', { caseSensitive: true });
// → Returns [] (no match)
```

#### Searching Arrays of Primitives

```typescript
const tags = ['JavaScript', 'TypeScript', 'React', 'Node.js'];

filter(tags, 'script');
// → ['JavaScript', 'TypeScript']

filter(tags, 'React');
// → ['React']
```

### Number Filtering

Filter by numeric values.

```typescript
const prices = [10, 25, 50, 100, 200];

filter(prices, 50);
// → [50]

// With objects
const items = [
  { name: 'Item A', price: 10 },
  { name: 'Item B', price: 25 },
  { name: 'Item C', price: 10 }
];

filter(items, 10);
// → [{ name: 'Item A', price: 10 }, { name: 'Item C', price: 10 }]
```

### Boolean Filtering

Filter by boolean values.

```typescript
const tasks = [
  { title: 'Task 1', completed: true },
  { title: 'Task 2', completed: false },
  { title: 'Task 3', completed: true }
];

filter(tasks, true);
// → [{ title: 'Task 1', completed: true }, { title: 'Task 3', completed: true }]

filter(tasks, false);
// → [{ title: 'Task 2', completed: false }]
```

[↑ Back to top](#table-of-contents)

---

## Wildcard Patterns

SQL-like wildcard patterns for flexible string matching.

### Percent Wildcard (%)

The `%` wildcard matches zero or more characters.

#### Match at Beginning

```typescript
const users = [
  { name: 'Alice' },
  { name: 'Alex' },
  { name: 'Bob' }
];

filter(users, 'Al%');
// → [{ name: 'Alice' }, { name: 'Alex' }]
```

#### Match at End

```typescript
filter(users, '%ce');
// → [{ name: 'Alice' }]
```

#### Match in Middle

```typescript
const emails = [
  { email: 'user@gmail.com' },
  { email: 'admin@yahoo.com' },
  { email: 'test@gmail.com' }
];

filter(emails, '%gmail%');
// → [{ email: 'user@gmail.com' }, { email: 'test@gmail.com' }]
```

#### Multiple Wildcards

```typescript
const files = [
  { name: 'document.pdf' },
  { name: 'image.png' },
  { name: 'archive.tar.gz' }
];

filter(files, '%.p%');
// → [{ name: 'document.pdf' }, { name: 'image.png' }]
```

### Underscore Wildcard (_)

The `_` wildcard matches exactly one character.

#### Single Character Match

```typescript
const codes = [
  { code: 'A1' },
  { code: 'A2' },
  { code: 'B1' },
  { code: 'AB1' }
];

filter(codes, 'A_');
// → [{ code: 'A1' }, { code: 'A2' }]
```

#### Position-Specific Matching

```typescript
const ids = [
  { id: 'user-101' },
  { id: 'user-102' },
  { id: 'admin-101' }
];

filter(ids, 'user-10_');
// → [{ id: 'user-101' }, { id: 'user-102' }]
```

#### Combining _ and %

```typescript
const patterns = [
  { text: 'test' },
  { text: 'testing' },
  { text: 'tested' }
];

filter(patterns, 'test__%');
// → [{ text: 'testing' }, { text: 'tested' }]
```

### Negation (!)

Use `!` prefix to exclude matches.

#### Negating Strings

```typescript
const users = [
  { name: 'Alice', city: 'Berlin' },
  { name: 'Bob', city: 'London' },
  { name: 'Charlie', city: 'Berlin' }
];

filter(users, '!London');
// → [{ name: 'Alice', city: 'Berlin' }, { name: 'Charlie', city: 'Berlin' }]
```

#### Negating Patterns

```typescript
const emails = [
  { email: 'user@gmail.com' },
  { email: 'admin@company.com' },
  { email: 'test@gmail.com' }
];

filter(emails, '!%gmail%');
// → [{ email: 'admin@company.com' }]
```

#### Negation with Wildcards

```typescript
const files = [
  { name: 'doc.pdf' },
  { name: 'image.jpg' },
  { name: 'video.mp4' }
];

filter(files, '!%.pdf');
// → [{ name: 'image.jpg' }, { name: 'video.mp4' }]
```

[↑ Back to top](#table-of-contents)

---

## Object-Based Filtering

Filter by matching object properties.

### Single Property Match

```typescript
const products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 1200 },
  { id: 2, name: 'Desk', category: 'Furniture', price: 350 },
  { id: 3, name: 'Mouse', category: 'Electronics', price: 25 }
];

// Match by single property
filter(products, { category: 'Electronics' });
// → [{ id: 1, ... }, { id: 3, ... }]

filter(products, { price: 350 });
// → [{ id: 2, name: 'Desk', ... }]
```

### Multiple Properties (AND Logic)

All specified properties must match.

```typescript
filter(products, { category: 'Electronics', price: 1200 });
// → [{ id: 1, name: 'Laptop', ... }]

filter(products, { category: 'Electronics', price: 25 });
// → [{ id: 3, name: 'Mouse', ... }]
```

### Nested Objects

Filter by nested object properties.

```typescript
const users = [
  {
    name: 'Alice',
    address: { city: 'Berlin', country: 'Germany' },
    settings: { theme: 'dark', language: 'en' }
  },
  {
    name: 'Bob',
    address: { city: 'London', country: 'UK' },
    settings: { theme: 'light', language: 'en' }
  }
];

// Direct nested property match
filter(users, { address: { city: 'Berlin' } });
// → [{ name: 'Alice', ... }]

// Multiple nested properties
filter(users, {
  address: { country: 'Germany' },
  settings: { theme: 'dark' }
});
// → [{ name: 'Alice', ... }]
```

### Mixing with Wildcards

```typescript
const items = [
  { name: 'Product A', code: 'PROD-001' },
  { name: 'Product B', code: 'PROD-002' },
  { name: 'Service A', code: 'SERV-001' }
];

filter(items, { code: 'PROD-%' });
// → [{ name: 'Product A', ... }, { name: 'Product B', ... }]
```

[↑ Back to top](#table-of-contents)

---

## Predicate Functions

Use custom functions for complex filtering logic.

### Basic Predicates

```typescript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Simple condition
filter(numbers, (n) => n > 5);
// → [6, 7, 8, 9, 10]

// Even numbers
filter(numbers, (n) => n % 2 === 0);
// → [2, 4, 6, 8, 10]

// Odd numbers
filter(numbers, (n) => n % 2 !== 0);
// → [1, 3, 5, 7, 9]
```

### Advanced Predicates

```typescript
const products = [
  { name: 'Laptop', price: 1200, inStock: true, rating: 4.5 },
  { name: 'Mouse', price: 25, inStock: true, rating: 4.0 },
  { name: 'Keyboard', price: 75, inStock: false, rating: 4.2 }
];

// Complex conditions
filter(products, (product) =>
  product.price < 100 &&
  product.inStock &&
  product.rating >= 4.0
);
// → [{ name: 'Mouse', ... }]

// String operations
filter(products, (product) =>
  product.name.toLowerCase().includes('key')
);
// → [{ name: 'Keyboard', ... }]

// Date comparisons
const orders = [
  { id: 1, date: new Date('2025-01-15'), amount: 100 },
  { id: 2, date: new Date('2025-02-20'), amount: 200 },
  { id: 3, date: new Date('2025-03-10'), amount: 150 }
];

filter(orders, (order) =>
  order.date >= new Date('2025-02-01') &&
  order.amount > 150
);
// → [{ id: 2, ... }]
```

### Type-Safe Predicates with TypeScript

```typescript
interface User {
  id: number;
  name: string;
  age: number;
  isActive: boolean;
}

const users: User[] = [
  { id: 1, name: 'Alice', age: 30, isActive: true },
  { id: 2, name: 'Bob', age: 25, isActive: false },
  { id: 3, name: 'Charlie', age: 35, isActive: true }
];

// Fully typed predicate
filter<User>(users, (user: User): boolean =>
  user.age > 28 && user.isActive
);
// → [{ id: 1, ... }, { id: 3, ... }]
```

### Performance Considerations

```typescript
// ✅ Good: Simple, direct checks
filter(items, (item) => item.price > 100);

// ⚠️ Slower: Complex operations
filter(items, (item) => {
  const calculated = item.price * 1.2 + item.tax;
  return calculated > 100 && item.category.toLowerCase().includes('electronics');
});

// 💡 Better: Use operators when possible
filter(items, {
  price: { $gt: 83.33 },  // Pre-calculated
  category: { $contains: 'electronics' }
});
```

[↑ Back to top](#table-of-contents)

---

## MongoDB-Style Operators

Version 5.0.0 introduces 13 powerful MongoDB-style operators for advanced filtering.

### Comparison Operators

#### $gt - Greater Than

Returns items where the property value is **greater than** the specified value.

```typescript
const products = [
  { name: 'Item A', price: 50 },
  { name: 'Item B', price: 150 },
  { name: 'Item C', price: 250 }
];

filter(products, { price: { $gt: 100 } });
// → [{ name: 'Item B', price: 150 }, { name: 'Item C', price: 250 }]

// With dates
const orders = [
  { id: 1, date: new Date('2025-01-15') },
  { id: 2, date: new Date('2025-02-20') },
  { id: 3, date: new Date('2025-03-10') }
];

filter(orders, { date: { $gt: new Date('2025-02-01') } });
// → [{ id: 2, ... }, { id: 3, ... }]
```

#### $gte - Greater Than or Equal

```typescript
filter(products, { price: { $gte: 150 } });
// → [{ name: 'Item B', price: 150 }, { name: 'Item C', price: 250 }]

// Date range start
filter(orders, {
  date: { $gte: new Date('2025-02-01') }
});
// → Includes orders from Feb 1st onwards
```

#### $lt - Less Than

```typescript
filter(products, { price: { $lt: 200 } });
// → [{ name: 'Item A', price: 50 }, { name: 'Item B', price: 150 }]

// Before a date
filter(orders, {
  date: { $lt: new Date('2025-03-01') }
});
// → Orders before March 1st
```

#### $lte - Less Than or Equal

```typescript
filter(products, { price: { $lte: 150 } });
// → [{ name: 'Item A', price: 50 }, { name: 'Item B', price: 150 }]
```

#### $eq - Equal

```typescript
const users = [
  { name: 'Alice', role: 'admin', age: 30 },
  { name: 'Bob', role: 'user', age: 25 },
  { name: 'Charlie', role: 'admin', age: 35 }
];

filter(users, { role: { $eq: 'admin' } });
// → [{ name: 'Alice', ... }, { name: 'Charlie', ... }]

// Equivalent to simple object matching
filter(users, { role: 'admin' });
// → Same result
```

#### $ne - Not Equal

```typescript
filter(users, { role: { $ne: 'admin' } });
// → [{ name: 'Bob', role: 'user', ... }]

filter(products, { price: { $ne: 50 } });
// → All products except Item A
```

#### Range Queries (Combining Operators)

```typescript
// Price between $100 and $200 (inclusive)
filter(products, {
  price: { $gte: 100, $lte: 200 }
});
// → [{ name: 'Item B', price: 150 }]

// Date range
filter(orders, {
  date: {
    $gte: new Date('2025-01-01'),
    $lte: new Date('2025-02-29')
  }
});
// → Orders in Q1 2025

// Excluding boundaries
filter(products, {
  price: { $gt: 50, $lt: 250 }
});
// → [{ name: 'Item B', price: 150 }]
```

### Array Operators

#### $in - Inclusion

Returns items where the property value is in the specified array.

```typescript
const products = [
  { id: 1, category: 'Electronics' },
  { id: 2, category: 'Furniture' },
  { id: 3, category: 'Books' },
  { id: 4, category: 'Clothing' }
];

filter(products, {
  category: { $in: ['Electronics', 'Books'] }
});
// → [{ id: 1, ... }, { id: 3, ... }]

// With numbers
const items = [
  { id: 1, status: 200 },
  { id: 2, status: 404 },
  { id: 3, status: 500 }
];

filter(items, {
  status: { $in: [200, 201, 202] }
});
// → [{ id: 1, status: 200 }]

// Mixed types
filter(products, {
  id: { $in: [1, 3, 5, 7] }
});
// → Products with IDs 1 and 3
```

#### $nin - Not In (Exclusion)

```typescript
filter(products, {
  category: { $nin: ['Furniture', 'Clothing'] }
});
// → [{ id: 1, category: 'Electronics' }, { id: 3, category: 'Books' }]

// Exclude multiple statuses
filter(items, {
  status: { $nin: [404, 500] }
});
// → Only successful responses
```

#### $contains - Array Contains Value

Checks if an array property contains a specific value.

```typescript
const products = [
  { name: 'Laptop', tags: ['computer', 'portable', 'gaming'] },
  { name: 'Mouse', tags: ['computer', 'accessory'] },
  { name: 'Desk', tags: ['office', 'furniture'] }
];

filter(products, {
  tags: { $contains: 'computer' }
});
// → [{ name: 'Laptop', ... }, { name: 'Mouse', ... }]

filter(products, {
  tags: { $contains: 'gaming' }
});
// → [{ name: 'Laptop', ... }]
```

#### $size - Array Length

Returns items where the array has a specific length.

```typescript
filter(products, {
  tags: { $size: 2 }
});
// → [{ name: 'Mouse', tags: ['computer', 'accessory'] }]

filter(products, {
  tags: { $size: 3 }
});
// → [{ name: 'Laptop', tags: ['computer', 'portable', 'gaming'] }]

// Find items with no tags
const allProducts = [
  ...products,
  { name: 'Unknown', tags: [] }
];

filter(allProducts, { tags: { $size: 0 } });
// → [{ name: 'Unknown', tags: [] }]
```

### String Operators

All string operators are case-insensitive by default (configurable).

#### $startsWith - Starts With

```typescript
const users = [
  { name: 'Alice', email: 'alice@gmail.com' },
  { name: 'Bob', email: 'bob@yahoo.com' },
  { name: 'Alex', email: 'alex@gmail.com' }
];

filter(users, { name: { $startsWith: 'Al' } });
// → [{ name: 'Alice', ... }, { name: 'Alex', ... }]

// Email domain filtering
filter(users, {
  email: { $startsWith: 'alice' }
});
// → [{ name: 'Alice', ... }]

// Case-sensitive
filter(users, {
  name: { $startsWith: 'al' }
}, { caseSensitive: true });
// → [] (no match)
```

#### $endsWith - Ends With

```typescript
filter(users, {
  email: { $endsWith: 'gmail.com' }
});
// → [{ name: 'Alice', ... }, { name: 'Alex', ... }]

// File extensions
const files = [
  { name: 'document.pdf' },
  { name: 'image.jpg' },
  { name: 'video.mp4' }
];

filter(files, {
  name: { $endsWith: '.pdf' }
});
// → [{ name: 'document.pdf' }]

filter(files, {
  name: { $endsWith: '.jpg' }
});
// → [{ name: 'image.jpg' }]
```

#### $contains - String Contains (Substring)

```typescript
filter(users, {
  email: { $contains: 'gmail' }
});
// → [{ name: 'Alice', ... }, { name: 'Alex', ... }]

filter(users, {
  name: { $contains: 'li' }
});
// → [{ name: 'Alice', ... }]

// URL filtering
const links = [
  { url: 'https://example.com/api/users' },
  { url: 'https://example.com/admin/users' },
  { url: 'https://example.com/api/products' }
];

filter(links, {
  url: { $contains: '/api/' }
});
// → API endpoints only
```

### Combining Operators

#### Multiple Operators on Same Property

```typescript
const products = [
  { name: 'Item A', price: 50 },
  { name: 'Item B', price: 150 },
  { name: 'Item C', price: 250 },
  { name: 'Item D', price: 300 }
];

// Price between 100 and 200, excluding 150
filter(products, {
  price: {
    $gte: 100,
    $lte: 200,
    $ne: 150
  }
});
// → [] (Item B is excluded by $ne)

// More realistic: 100-300 range, excluding 250
filter(products, {
  price: {
    $gte: 100,
    $lte: 300,
    $ne: 250
  }
});
// → [{ name: 'Item B', ... }, { name: 'Item D', ... }]
```

#### Multiple Operators on Different Properties

```typescript
const products = [
  { name: 'Laptop Pro', price: 1200, category: 'Electronics', rating: 4.5 },
  { name: 'Mouse', price: 25, category: 'Accessories', rating: 4.0 },
  { name: 'Monitor', price: 450, category: 'Electronics', rating: 4.7 },
  { name: 'Desk', price: 350, category: 'Furniture', rating: 4.2 }
];

// Complex multi-condition filter
filter(products, {
  price: { $gte: 100, $lte: 500 },
  category: { $in: ['Electronics', 'Accessories'] },
  name: { $startsWith: 'M' },
  rating: { $gte: 4.0 }
});
// → [{ name: 'Monitor', ... }]

// E-commerce: Affordable electronics in stock
const inventory = [
  { name: 'Product A', price: 299, category: 'Electronics', inStock: true },
  { name: 'Product B', price: 599, category: 'Electronics', inStock: true },
  { name: 'Product C', price: 199, category: 'Electronics', inStock: false }
];

filter(inventory, {
  price: { $lte: 400 },
  category: { $eq: 'Electronics' },
  inStock: { $eq: true }
});
// → [{ name: 'Product A', ... }]
```

[↑ Back to top](#table-of-contents)

---

## Configuration API

Customize filter behavior with configuration options.

### caseSensitive

Controls case sensitivity for string matching.

**Type:** `boolean`
**Default:** `false`

```typescript
const users = [
  { name: 'Alice' },
  { name: 'ALICE' },
  { name: 'alice' }
];

// Case-insensitive (default)
filter(users, 'alice');
// → All three users

filter(users, 'ALICE');
// → All three users

// Case-sensitive
filter(users, 'alice', { caseSensitive: true });
// → [{ name: 'alice' }]

filter(users, 'ALICE', { caseSensitive: true });
// → [{ name: 'ALICE' }]
```

**Impact on String Operators:**

```typescript
const emails = [
  { email: 'User@Example.com' },
  { email: 'admin@example.com' }
];

// Case-insensitive
filter(emails, {
  email: { $startsWith: 'user' }
});
// → [{ email: 'User@Example.com' }]

// Case-sensitive
filter(emails, {
  email: { $startsWith: 'user' }
}, { caseSensitive: true });
// → [] (no match)
```

### maxDepth

Sets maximum depth for nested object comparison.

**Type:** `number`
**Default:** `3`
**Range:** `1-10`

```typescript
const data = [
  {
    level1: {
      level2: {
        level3: {
          level4: {
            value: 'deep'
          }
        }
      }
    }
  }
];

// Default depth (3)
filter(data, {
  level1: {
    level2: {
      level3: { value: 'deep' }
    }
  }
});
// → May not match if depth exceeded

// Increase depth
filter(data, {
  level1: {
    level2: {
      level3: {
        level4: { value: 'deep' }
      }
    }
  }
}, { maxDepth: 5 });
// → Matches
```

**Performance Note:** Higher depth values may impact performance with deeply nested objects.

### enableCache

Enables result caching for repeated queries.

**Type:** `boolean`
**Default:** `false`

```typescript
const largeDataset = [...]; // 10,000 items

// Without cache
const result1 = filter(largeDataset, { category: 'Electronics' });
const result2 = filter(largeDataset, { category: 'Electronics' }); // Recalculates

// With cache
const result1 = filter(largeDataset, { category: 'Electronics' }, { enableCache: true });
const result2 = filter(largeDataset, { category: 'Electronics' }, { enableCache: true });
// → Second call uses cached result
```

**When to Enable:**
- Filtering large datasets repeatedly
- Same filter expressions used multiple times
- Performance is critical

**When NOT to Enable:**
- Data changes frequently
- Memory constraints
- One-time filters

### customComparator

Provide custom comparison logic.

**Type:** `(actual: unknown, expected: unknown) => boolean`
**Default:** Case-insensitive substring matching

```typescript
// Custom exact match comparator
const exactMatch = (actual: unknown, expected: unknown) => actual === expected;

filter(users, 'Alice', { customComparator: exactMatch });
// → Exact matches only

// Custom numeric comparator with tolerance
const numericTolerance = (actual: unknown, expected: unknown) => {
  if (typeof actual === 'number' && typeof expected === 'number') {
    return Math.abs(actual - expected) < 0.01;
  }
  return actual === expected;
};

const measurements = [
  { value: 10.001 },
  { value: 10.002 },
  { value: 11.0 }
];

filter(measurements, 10, { customComparator: numericTolerance });
// → [{ value: 10.001 }, { value: 10.002 }]

// Custom locale-aware string comparator
const localeCompare = (actual: unknown, expected: unknown) => {
  if (typeof actual === 'string' && typeof expected === 'string') {
    return actual.localeCompare(expected, 'en', { sensitivity: 'base' }) === 0;
  }
  return actual === expected;
};
```

[↑ Back to top](#table-of-contents)

---

## Mixing Syntax Patterns

Combine different filtering syntaxes for maximum flexibility.

### Operators + Simple Equality

```typescript
const products = [
  { name: 'Laptop', price: 1200, category: 'Electronics' },
  { name: 'Monitor', price: 450, category: 'Electronics' },
  { name: 'Desk', price: 350, category: 'Furniture' }
];

filter(products, {
  category: 'Electronics',    // Simple equality
  price: { $gte: 400 }        // Operator
});
// → [{ name: 'Laptop', ... }, { name: 'Monitor', ... }]
```

### Operators + Wildcards

```typescript
const files = [
  { name: 'report-2025.pdf', size: 1024 },
  { name: 'image-2025.jpg', size: 2048 },
  { name: 'video-2025.mp4', size: 10240 }
];

filter(files, {
  name: '%2025%',           // Wildcard
  size: { $lt: 5000 }       // Operator
});
// → [{ name: 'report-2025.pdf', ... }, { name: 'image-2025.jpg', ... }]
```

### Operators + Negation

```typescript
const users = [
  { name: 'Alice', role: 'admin', age: 30 },
  { name: 'Bob', role: 'user', age: 25 },
  { name: 'Charlie', role: 'admin', age: 35 }
];

filter(users, {
  role: '!user',           // Negation
  age: { $gte: 30 }        // Operator
});
// → [{ name: 'Alice', ... }, { name: 'Charlie', ... }]
```

### Complex Combination

```typescript
const products = [
  {
    name: 'Gaming Laptop',
    price: 1500,
    category: 'Electronics',
    tags: ['gaming', 'portable'],
    inStock: true
  },
  {
    name: 'Office Laptop',
    price: 800,
    category: 'Electronics',
    tags: ['business', 'portable'],
    inStock: true
  },
  {
    name: 'Gaming Desktop',
    price: 2000,
    category: 'Electronics',
    tags: ['gaming', 'powerful'],
    inStock: false
  }
];

filter(products, {
  category: 'Electronics',              // Simple equality
  name: '%Laptop%',                     // Wildcard
  price: { $gte: 700, $lte: 1600 },   // Range operators
  tags: { $contains: 'gaming' },       // Array operator
  inStock: { $eq: true }               // Boolean operator
});
// → [{ name: 'Gaming Laptop', ... }]
```

[↑ Back to top](#table-of-contents)

---

## TypeScript Integration

Full TypeScript support with strict typing.

### Type Definitions

```typescript
import type {
  Expression,
  PrimitiveExpression,
  PredicateFunction,
  ObjectExpression,
  FilterOptions,
  FilterConfig,
  Comparator,
  ComparisonOperators,
  ArrayOperators,
  StringOperators,
  OperatorExpression
} from '@mcabreradev/filter';
```

### Generic Type Parameter

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  tags: string[];
  inStock: boolean;
}

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 1200, category: 'Electronics', tags: ['computer'], inStock: true },
  // ...
];

// Type-safe filtering
const result = filter<Product>(products, {
  price: { $gte: 100 }
});
// result is Product[]

// TypeScript catches errors
filter<Product>(products, {
  price: { $gte: '100' }  // ❌ Error: Type 'string' not assignable to 'number | Date'
});

filter<Product>(products, {
  invalidProp: 'value'     // ❌ Error: Property 'invalidProp' does not exist
});
```

### Type Inference

```typescript
// TypeScript infers types automatically
const numbers = [1, 2, 3, 4, 5];
const filtered = filter(numbers, (n) => n > 3);
// filtered is number[]

const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
];
const adults = filter(users, (user) => user.age >= 18);
// adults is { name: string; age: number; }[]
```

### Custom Types with Operators

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  roles: string[];
  createdAt: Date;
}

// Type-safe operator expressions
const ageFilter: ComparisonOperators = {
  $gte: 18,
  $lte: 65
};

const roleFilter: ArrayOperators = {
  $contains: 'admin'
};

const emailFilter: StringOperators = {
  $endsWith: '@company.com'
};

// Combine in filter
filter<User>(users, {
  age: ageFilter,
  roles: roleFilter,
  email: emailFilter
});
```

### Predicate Type Safety

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [...];

// Fully typed predicate
filter<Product>(products, (product: Product): boolean => {
  // TypeScript provides autocomplete and type checking
  return product.price > 100 && product.name.includes('Pro');
});

// Arrow function with implicit return
filter<Product>(products, (p) => p.price > 100);
```

### Expression Type

```typescript
// Define reusable expressions
const electronicFilter: Expression<Product> = {
  category: 'Electronics',
  price: { $lte: 1000 }
};

const premiumFilter: Expression<Product> = (product) =>
  product.price > 500 && product.rating >= 4.5;

// Use in filters
filter<Product>(products, electronicFilter);
filter<Product>(products, premiumFilter);
```

### FilterOptions Type

```typescript
const options: FilterOptions = {
  caseSensitive: true,
  maxDepth: 5,
  enableCache: false
};

filter(data, expression, options);

// Partial options
const partialOptions: FilterOptions = {
  caseSensitive: true
  // Other options use defaults
};
```

[↑ Back to top](#table-of-contents)

---

## Real-World Examples

Comprehensive examples for common use cases.

### E-commerce Product Filtering

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
  discount: number;
  images: string[];
  createdAt: Date;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Dell XPS 15 Laptop',
    price: 1499,
    category: 'Electronics',
    subcategory: 'Computers',
    brand: 'Dell',
    rating: 4.7,
    reviews: 1250,
    inStock: true,
    tags: ['laptop', 'gaming', 'professional'],
    discount: 10,
    images: ['img1.jpg', 'img2.jpg'],
    createdAt: new Date('2025-01-15')
  },
  // ... more products
];

// Find affordable laptops with good ratings
const affordableLaptops = filter(products, {
  category: 'Electronics',
  subcategory: 'Computers',
  price: { $lte: 1500 },
  rating: { $gte: 4.5 },
  inStock: { $eq: true }
});

// Products on sale (discount > 0)
const onSale = filter(products, {
  discount: { $gt: 0 },
  inStock: true
});

// New arrivals (last 30 days)
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const newArrivals = filter(products, {
  createdAt: { $gte: thirtyDaysAgo },
  inStock: true
});

// Premium products by specific brands
const premiumProducts = filter(products, {
  brand: { $in: ['Apple', 'Dell', 'HP'] },
  price: { $gte: 1000 },
  rating: { $gte: 4.5 }
});

// Products with many reviews
const popularProducts = filter(products, {
  reviews: { $gte: 1000 },
  rating: { $gte: 4.0 }
});

// Search by keyword in name
const searchResults = filter(products, {
  name: { $contains: 'laptop' },
  price: { $lte: 2000 }
});
```

### User Management System

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  age: number;
  roles: string[];
  isActive: boolean;
  department: string;
  salary: number;
  hireDate: Date;
  lastLogin: Date;
}

const users: User[] = [...];

// Active admin users
const activeAdmins = filter(users, {
  roles: { $contains: 'admin' },
  isActive: { $eq: true }
});

// Users hired this year
const thisYear = new Date().getFullYear();
const newHires = filter(users, {
  hireDate: { $gte: new Date(`${thisYear}-01-01`) }
});

// High-salary employees in Engineering
const topEngineers = filter(users, {
  department: 'Engineering',
  salary: { $gte: 100000 }
});

// Inactive users (no login in 90 days)
const ninetyDaysAgo = new Date();
ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

const inactiveUsers = filter(users, {
  lastLogin: { $lt: ninetyDaysAgo },
  isActive: true
});

// Users by email domain
const companyUsers = filter(users, {
  email: { $endsWith: '@company.com' }
});

// Users with multiple roles
const multiRoleUsers = filter(users, {
  roles: { $size: { $gte: 2 } }
});

// Adult users in specific departments
const eligibleUsers = filter(users, {
  age: { $gte: 18, $lte: 65 },
  department: { $in: ['Engineering', 'Sales', 'Marketing'] },
  isActive: true
});
```

### Data Analytics & Reporting

```typescript
interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  customerId: string;
  date: Date;
  category: string;
  paymentMethod: string;
  country: string;
}

const transactions: Transaction[] = [...];

// Successful transactions above threshold
const highValueTransactions = filter(transactions, {
  amount: { $gte: 10000 },
  status: 'completed'
});

// Failed transactions for investigation
const failedPayments = filter(transactions, {
  status: 'failed',
  date: {
    $gte: new Date('2025-01-01'),
    $lte: new Date('2025-12-31')
  }
});

// International transactions
const internationalSales = filter(transactions, {
  country: { $nin: ['USA', 'US'] },
  status: 'completed'
});

// Refund analysis
const refunds = filter(transactions, {
  status: 'refunded',
  amount: { $gte: 100 }
});

// Payment method distribution
const cardPayments = filter(transactions, {
  paymentMethod: { $startsWith: 'card' },
  status: { $in: ['completed', 'pending'] }
});

// Monthly revenue (Q1 example)
const q1Revenue = filter(transactions, {
  date: {
    $gte: new Date('2025-01-01'),
    $lte: new Date('2025-03-31')
  },
  status: 'completed'
});

const totalRevenue = q1Revenue.reduce((sum, t) => sum + t.amount, 0);
```

### Search Functionality

```typescript
interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  category: string;
  publishDate: Date;
  views: number;
  likes: number;
  status: 'draft' | 'published' | 'archived';
}

const articles: Article[] = [...];

// Full-text search (title + content)
const searchTerm = 'typescript';
const searchResults = filter(articles, (article) =>
  article.title.toLowerCase().includes(searchTerm) ||
  article.content.toLowerCase().includes(searchTerm)
);

// Advanced search with filters
const advancedSearch = filter(articles, {
  title: { $contains: 'typescript' },
  category: { $in: ['Technology', 'Programming'] },
  status: 'published',
  publishDate: { $gte: new Date('2025-01-01') },
  views: { $gte: 1000 }
});

// Popular articles
const popularArticles = filter(articles, {
  views: { $gte: 10000 },
  likes: { $gte: 500 },
  status: 'published'
});

// Articles by tag
const taggedArticles = filter(articles, {
  tags: { $contains: 'tutorial' },
  status: 'published'
});

// Recent articles by author
const authorArticles = filter(articles, {
  author: { $startsWith: 'John' },
  publishDate: { $gte: new Date('2025-01-01') },
  status: 'published'
});
```

### Inventory Management

```typescript
interface InventoryItem {
  sku: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  price: number;
  category: string;
  supplier: string;
  expiryDate: Date | null;
  location: string;
  tags: string[];
}

const inventory: InventoryItem[] = [...];

// Low stock alerts
const lowStock = filter(inventory, (item) =>
  item.quantity <= item.reorderLevel
);

// Items needing reorder
const needsReorder = filter(inventory, {
  quantity: { $lte: 10 },
  reorderLevel: { $gte: 10 }
});

// Expiring items (next 30 days)
const thirtyDaysFromNow = new Date();
thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

const expiringItems = filter(inventory, (item) =>
  item.expiryDate !== null &&
  item.expiryDate <= thirtyDaysFromNow &&
  item.quantity > 0
);

// High-value inventory
const highValueItems = filter(inventory, {
  price: { $gte: 1000 },
  quantity: { $gte: 1 }
});

const totalValue = highValueItems.reduce((sum, item) =>
  sum + (item.price * item.quantity), 0
);

// Items by supplier
const supplierItems = filter(inventory, {
  supplier: { $in: ['Supplier A', 'Supplier B'] },
  quantity: { $gt: 0 }
});

// Items by location and category
const warehouseElectronics = filter(inventory, {
  location: { $startsWith: 'Warehouse' },
  category: 'Electronics',
  quantity: { $gte: 1 }
});
```

[↑ Back to top](#table-of-contents)

---

## Performance Optimization

Tips and strategies for optimal performance.

### When to Use Each Pattern

**Performance Ranking (fastest to slowest):**

1. **Simple String/Number/Boolean** - Fastest
   ```typescript
   filter(data, 'Berlin');  // ✅ Fastest
   ```

2. **Object-Based Filtering** - Very Fast
   ```typescript
   filter(data, { city: 'Berlin' });  // ✅ Very Fast
   ```

3. **Operators** - Fast (optimized with early exit)
   ```typescript
   filter(data, { age: { $gte: 18 } });  // ✅ Fast
   ```

4. **Wildcards** - Moderate (regex compilation cached)
   ```typescript
   filter(data, '%berlin%');  // ⚠️ Moderate
   ```

5. **Predicate Functions** - Slowest (most flexible)
   ```typescript
   filter(data, (item) => item.age > 18);  // ⚠️ Slowest
   ```

### Caching Strategy

```typescript
const largeDataset = [...]; // 100,000 items

// ❌ Without cache: Re-computes every time
for (let i = 0; i < 1000; i++) {
  filter(largeDataset, { category: 'Electronics' });
}

// ✅ With cache: Computes once, reuses result
for (let i = 0; i < 1000; i++) {
  filter(largeDataset, { category: 'Electronics' }, { enableCache: true });
}
```

**When to Enable Cache:**
- Large datasets (>1000 items)
- Repeated identical queries
- Read-heavy workloads
- Static data

**When NOT to Enable:**
- Frequently changing data
- One-time queries
- Memory-constrained environments

### Large Dataset Handling

```typescript
// ❌ Slow: Processing entire dataset
const results = filter(millionRecords, complexExpression);
displayResults(results);

// ✅ Better: Pagination
const pageSize = 100;
const page = 0;
const pagedData = millionRecords.slice(page * pageSize, (page + 1) * pageSize);
const results = filter(pagedData, expression);

// ✅ Best: Pre-filter with operators, then apply complex logic
const preFiltered = filter(millionRecords, {
  category: { $in: ['Electronics', 'Books'] }  // Fast operator filter
});
const finalResults = filter(preFiltered, complexPredicate);  // Smaller dataset
```

### Optimization Tips

```typescript
// ❌ Slow: Complex predicate on large dataset
filter(largeDataset, (item) => {
  const calculated = item.price * 1.2 + item.tax;
  return calculated > 100 &&
    item.category.toLowerCase().includes('electronics') &&
    item.inStock &&
    item.rating >= 4.0;
});

// ✅ Fast: Use operators when possible
filter(largeDataset, {
  price: { $gte: 80 },  // Pre-calculated threshold
  category: { $contains: 'electronics' },
  inStock: { $eq: true },
  rating: { $gte: 4.0 }
});

// ✅ Fast: Pre-filter with simple checks first
const preFiltered = filter(largeDataset, { inStock: true });
const results = filter(preFiltered, complexExpression);
```

### Benchmarking

```typescript
// Measure filter performance
console.time('Filter Performance');
const results = filter(data, expression, options);
console.timeEnd('Filter Performance');

// Compare different approaches
const testData = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  value: Math.random() * 1000,
  category: i % 2 === 0 ? 'A' : 'B'
}));

console.time('Simple Object');
filter(testData, { category: 'A' });
console.timeEnd('Simple Object');

console.time('Operator');
filter(testData, { value: { $gte: 500 } });
console.timeEnd('Operator');

console.time('Predicate');
filter(testData, (item) => item.value >= 500);
console.timeEnd('Predicate');
```

[↑ Back to top](#table-of-contents)

---

## Migration Guides

### Migrating to v5.0.0

**From v3.x:**

✅ **100% Backward Compatible** - No breaking changes!

All v3.x code continues to work:

```typescript
// ✅ v3.x syntax still works in v5.0.0
filter(data, 'string');
filter(data, { prop: 'value' });
filter(data, (item) => true);
filter(data, '%pattern%');
```

**New Features to Adopt:**

```typescript
// ✅ v5.0.0: MongoDB-style operators
filter(data, { age: { $gte: 18, $lt: 65 } });

// ✅ v5.0.0: Configuration options
filter(data, expression, {
  caseSensitive: true,
  maxDepth: 5,
  enableCache: true
});

// ✅ v5.0.0: Runtime validation
import { validateExpression, validateOptions } from '@mcabreradev/filter';
```

**Recommended Updates:**

```typescript
// Before (v3.x) - Still works
filter(products, (p) => p.price >= 100 && p.price <= 500);

// After (v5.0.0) - Recommended
filter(products, {
  price: { $gte: 100, $lte: 500 }
});

// Benefits:
// - More declarative and readable
// - Can be serialized to JSON
// - Better TypeScript support
// - Runtime validation
```

### From Native Array.filter()

**Direct Replacements:**

```typescript
// Native filter
const adults = users.filter(u => u.age >= 18);

// @mcabreradev/filter equivalent
const adults = filter(users, (u) => u.age >= 18);
// OR better with operators:
const adults = filter(users, { age: { $gte: 18 } });

// Native: Multiple conditions
const results = users.filter(u =>
  u.age >= 18 &&
  u.city === 'Berlin' &&
  u.isActive
);

// @mcabreradev/filter
const results = filter(users, {
  age: { $gte: 18 },
  city: 'Berlin',
  isActive: true
});
```

**Enhanced Capabilities:**

```typescript
// ❌ Native: No wildcard support
const results = users.filter(u =>
  u.email.includes('gmail.com')
);

// ✅ @mcabreradev/filter
const results = filter(users, {
  email: { $endsWith: 'gmail.com' }
});
// OR
const results = filter(users, '%gmail.com');

// ❌ Native: Complex string operations
const results = users.filter(u =>
  u.name.toLowerCase().startsWith('al')
);

// ✅ @mcabreradev/filter
const results = filter(users, {
  name: { $startsWith: 'Al' }
});
```

**When to Migrate:**

**Migrate When:**
- Need wildcard pattern matching
- Filtering by partial object matches
- Want to serialize filter expressions
- Need case-insensitive search
- Want MongoDB-style query syntax
- Need deep object comparison

**Keep Native When:**
- Simple one-time predicates
- Performance is ultra-critical (native is marginally faster)
- No dependencies requirement is strict
- Project already has comprehensive native filter logic

[↑ Back to top](#table-of-contents)

---

## Validation & Error Handling

Runtime validation with Zod.

### Expression Validation

```typescript
import { validateExpression } from '@mcabreradev/filter';

// Valid expressions
validateExpression('string');          // ✅ Valid
validateExpression(42);                // ✅ Valid
validateExpression({ prop: 'value' }); // ✅ Valid
validateExpression((x) => true);       // ✅ Valid

// Invalid expressions
try {
  validateExpression(undefined);       // ❌ Throws error
} catch (error) {
  console.error(error.message);
  // "Invalid filter expression: Expected string | number | boolean | null | function | object"
}

try {
  validateExpression(Symbol('test')); // ❌ Throws error
} catch (error) {
  console.error(error.message);
}
```

### Options Validation

```typescript
import { validateOptions } from '@mcabreradev/filter';

// Valid options
validateOptions({ caseSensitive: true });  // ✅ Valid
validateOptions({ maxDepth: 5 });          // ✅ Valid
validateOptions({ enableCache: false });   // ✅ Valid
validateOptions({});                       // ✅ Valid (uses defaults)

// Invalid options
try {
  validateOptions({ maxDepth: 15 });      // ❌ maxDepth must be 1-10
} catch (error) {
  console.error(error.message);
  // "Invalid filter options: maxDepth too large"
}

try {
  validateOptions({ caseSensitive: 'yes' }); // ❌ Wrong type
} catch (error) {
  console.error(error.message);
  // "Invalid filter options: Expected boolean, received string"
}
```

### Common Errors & Solutions

#### Error: "Invalid filter expression"

```typescript
// ❌ Problem
filter(data, undefined);
filter(data, null);

// ✅ Solution
if (expression !== undefined && expression !== null) {
  filter(data, expression);
}
```

#### Error: "Invalid filter options: maxDepth too large"

```typescript
// ❌ Problem
filter(data, expression, { maxDepth: 15 });

// ✅ Solution
filter(data, expression, { maxDepth: 10 }); // Max is 10
```

#### Error: Unexpected Results

```typescript
// ❌ Problem: Case sensitivity issue
filter(users, 'BERLIN', { caseSensitive: true });
// Returns [] if all data is lowercase

// ✅ Solution: Check case sensitivity
filter(users, 'berlin', { caseSensitive: false }); // Default
```

### Debug Tips

```typescript
// 1. Validate before filtering
import { validateExpression, validateOptions } from '@mcabreradev/filter';

try {
  validateExpression(expression);
  validateOptions(options);
  const results = filter(data, expression, options);
} catch (error) {
  console.error('Filter error:', error.message);
}

// 2. Test with simple data first
const testData = [{ id: 1, name: 'Test' }];
const testResult = filter(testData, expression);
console.log('Test result:', testResult);

// 3. Check expression type
console.log('Expression type:', typeof expression);
console.log('Expression value:', expression);

// 4. Verify data structure
console.log('Data sample:', data[0]);
console.log('Data length:', data.length);
```

[↑ Back to top](#table-of-contents)

---

## API Reference

Complete reference for all exported functions and types.

### filter<T>(array, expression, options?)

Main filtering function.

**Signature:**
```typescript
function filter<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions
): T[]
```

**Parameters:**

- `array` (`T[]`): Array to filter
- `expression` (`Expression<T>`): Filter expression (string, number, boolean, null, object, or predicate)
- `options` (`FilterOptions`, optional): Configuration options

**Returns:** `T[]` - Filtered array

**Throws:** Error if expression or options are invalid

**Examples:**

```typescript
filter([1, 2, 3], 2);
filter(users, { age: 30 });
filter(products, { price: { $gte: 100 } });
filter(items, (item) => item.active);
```

---

### validateExpression(expression)

Validates a filter expression.

**Signature:**
```typescript
function validateExpression<T>(expression: unknown): Expression<T>
```

**Parameters:**
- `expression` (`unknown`): Expression to validate

**Returns:** `Expression<T>` - Validated expression

**Throws:** Error if expression is invalid

**Examples:**

```typescript
validateExpression('string');    // ✅ Returns 'string'
validateExpression(undefined);   // ❌ Throws Error
```

---

### validateOptions(options)

Validates filter options.

**Signature:**
```typescript
function validateOptions(options: unknown): FilterOptions
```

**Parameters:**
- `options` (`unknown`): Options to validate

**Returns:** `FilterOptions` - Validated options

**Throws:** Error if options are invalid

**Examples:**

```typescript
validateOptions({ caseSensitive: true });  // ✅ Returns options
validateOptions({ maxDepth: 15 });         // ❌ Throws Error (max is 10)
```

---

### mergeConfig(options)

Merges options with defaults.

**Signature:**
```typescript
function mergeConfig(options?: FilterOptions): FilterConfig
```

**Parameters:**
- `options` (`FilterOptions`, optional): User options

**Returns:** `FilterConfig` - Complete configuration with defaults

**Examples:**

```typescript
mergeConfig();  // Returns default config
mergeConfig({ caseSensitive: true });  // Merges with defaults
```

---

### createFilterConfig(options)

Creates a complete filter configuration.

**Signature:**
```typescript
function createFilterConfig(options?: FilterOptions): FilterConfig
```

**Parameters:**
- `options` (`FilterOptions`, optional): User options

**Returns:** `FilterConfig` - Complete configuration

**Examples:**

```typescript
const config = createFilterConfig({ maxDepth: 5 });
```

---

### Type Exports

```typescript
// Expression types
export type Expression<T> =
  | PrimitiveExpression
  | PredicateFunction<T>
  | ObjectExpression<T>
  | ExtendedObjectExpression<T>;

export type PrimitiveExpression = string | number | boolean | null;

export type PredicateFunction<T> = (item: T) => boolean;

export type ObjectExpression<T> = Partial<{
  [K in keyof T]: T[K] | string;
}>;

// Config types
export interface FilterConfig {
  caseSensitive: boolean;
  maxDepth: number;
  customComparator?: Comparator;
  enableCache: boolean;
}

export type FilterOptions = Partial<FilterConfig>;

export type Comparator = (actual: unknown, expected: unknown) => boolean;

// Operator types
export interface ComparisonOperators {
  $gt?: number | Date;
  $gte?: number | Date;
  $lt?: number | Date;
  $lte?: number | Date;
  $eq?: unknown;
  $ne?: unknown;
}

export interface ArrayOperators {
  $in?: unknown[];
  $nin?: unknown[];
  $contains?: unknown;
  $size?: number;
}

export interface StringOperators {
  $startsWith?: string;
  $endsWith?: string;
  $contains?: string;
}
```

[↑ Back to top](#table-of-contents)

---

## Testing Your Filters

Best practices for testing filter logic.

### Unit Testing with Vitest/Jest

```typescript
import { describe, it, expect } from 'vitest'; // or 'jest'
import { filter } from '@mcabreradev/filter';

describe('User Filtering', () => {
  const users = [
    { id: 1, name: 'Alice', age: 30, role: 'admin' },
    { id: 2, name: 'Bob', age: 25, role: 'user' },
    { id: 3, name: 'Charlie', age: 35, role: 'user' }
  ];

  it('filters by age', () => {
    const result = filter(users, { age: { $gte: 30 } });
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Alice');
    expect(result[1].name).toBe('Charlie');
  });

  it('filters by role', () => {
    const result = filter(users, { role: 'admin' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice');
  });

  it('handles empty results', () => {
    const result = filter(users, { age: { $gt: 100 } });
    expect(result).toEqual([]);
  });

  it('filters with predicates', () => {
    const result = filter(users, (u) => u.age > 28);
    expect(result).toHaveLength(2);
  });
});
```

### Mocking Data

```typescript
// Test helpers
function createMockUser(overrides = {}) {
  return {
    id: 1,
    name: 'Test User',
    age: 25,
    email: 'test@example.com',
    isActive: true,
    ...overrides
  };
}

describe('Complex Filters', () => {
  it('handles large datasets', () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) =>
      createMockUser({ id: i, age: 20 + (i % 50) })
    );

    const result = filter(largeDataset, { age: { $gte: 30, $lt: 40 } });
    expect(result.length).toBeGreaterThan(0);
  });
});
```

### Edge Cases

```typescript
describe('Edge Cases', () => {
  it('handles empty arrays', () => {
    const result = filter([], { id: 1 });
    expect(result).toEqual([]);
  });

  it('handles null values', () => {
    const data = [
      { id: 1, value: null },
      { id: 2, value: 'test' }
    ];
    const result = filter(data, { value: null });
    expect(result).toHaveLength(1);
  });

  it('handles undefined properties', () => {
    const data = [
      { id: 1 },
      { id: 2, value: 'test' }
    ];
    const result = filter(data, { value: 'test' });
    expect(result).toHaveLength(1);
  });

  it('handles special characters', () => {
    const data = [
      { email: 'user@example.com' },
      { email: 'admin@test.org' }
    ];
    const result = filter(data, { email: '%@example.com' });
    expect(result).toHaveLength(1);
  });
});
```

### Integration Testing

```typescript
describe('E-commerce Integration', () => {
  let products;

  beforeEach(() => {
    products = loadTestProducts(); // Load test data
  });

  it('filters products for product listing page', () => {
    const results = filter(products, {
      category: 'Electronics',
      price: { $lte: 1000 },
      inStock: true,
      rating: { $gte: 4.0 }
    });

    expect(results.length).toBeGreaterThan(0);
    results.forEach(product => {
      expect(product.category).toBe('Electronics');
      expect(product.price).toBeLessThanOrEqual(1000);
      expect(product.inStock).toBe(true);
      expect(product.rating).toBeGreaterThanOrEqual(4.0);
    });
  });
});
```

[↑ Back to top](#table-of-contents)

---

## Frequently Asked Questions

### How do I filter by multiple conditions with OR logic?

Use separate filter calls or predicates:

```typescript
// Option 1: Separate filters and combine
const electronics = filter(products, { category: 'Electronics' });
const books = filter(products, { category: 'Books' });
const result = [...electronics, ...books];

// Option 2: Use $in operator
const result = filter(products, {
  category: { $in: ['Electronics', 'Books'] }
});

// Option 3: Predicate function
const result = filter(products, (p) =>
  p.category === 'Electronics' || p.category === 'Books'
);
```

### Can I filter nested arrays?

Use predicate functions:

```typescript
const data = [
  { id: 1, items: [{ name: 'A' }, { name: 'B' }] },
  { id: 2, items: [{ name: 'C' }] }
];

const result = filter(data, (item) =>
  item.items.some(subItem => subItem.name === 'A')
);
```

### How do I handle null/undefined values?

```typescript
const data = [
  { id: 1, value: null },
  { id: 2, value: undefined },
  { id: 3, value: 'test' }
];

// Filter for null
filter(data, { value: null });  // Returns id: 1

// Filter out null/undefined
filter(data, (item) => item.value != null);  // Returns id: 3
```

### What's the performance impact of operators vs predicates?

Operators are generally faster due to optimizations:

```typescript
// ✅ Faster: Operators with early exit
filter(data, { age: { $gte: 18 } });

// ⚠️ Slower: Predicate (more flexible but slower)
filter(data, (item) => item.age >= 18);

// For best performance: Use operators when possible
```

### Can I use this in React/Vue/Angular?

Yes! Works in any JavaScript/TypeScript environment:

```typescript
// React
const FilteredList = () => {
  const [products, setProducts] = useState([...]);
  const [priceFilter, setPriceFilter] = useState(100);

  const filtered = filter(products, {
    price: { $lte: priceFilter }
  });

  return <div>{filtered.map(p => <div key={p.id}>{p.name}</div>)}</div>;
};

// Vue
export default {
  computed: {
    filteredProducts() {
      return filter(this.products, {
        category: this.selectedCategory
      });
    }
  }
};
```

### How do I debug complex filters?

```typescript
// 1. Break down the filter
const step1 = filter(data, { category: 'Electronics' });
console.log('After category filter:', step1.length);

const step2 = filter(step1, { price: { $lte: 1000 } });
console.log('After price filter:', step2.length);

// 2. Test expression validity
import { validateExpression } from '@mcabreradev/filter';
validateExpression(myExpression);

// 3. Log results
const result = filter(data, expression);
console.log('Results:', result.length, result);
```

### Can operators be serialized to JSON?

Yes! This is a major advantage:

```typescript
// Save filter to JSON
const filterExpr = {
  price: { $gte: 100, $lte: 500 },
  category: { $in: ['Electronics', 'Books'] }
};
localStorage.setItem('savedFilter', JSON.stringify(filterExpr));

// Load and use later
const loaded = JSON.parse(localStorage.getItem('savedFilter'));
const results = filter(products, loaded);
```

### How do I filter by date ranges?

```typescript
const startDate = new Date('2025-01-01');
const endDate = new Date('2025-12-31');

const results = filter(orders, {
  date: {
    $gte: startDate,
    $lte: endDate
  }
});

// Last 30 days
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const recent = filter(orders, {
  date: { $gte: thirtyDaysAgo }
});
```

### Can I chain multiple filter calls?

Yes:

```typescript
const result = filter(
  filter(
    filter(data, { category: 'Electronics' }),
    { price: { $lte: 1000 } }
  ),
  { inStock: true }
);

// Or better: Combine in one call
const result = filter(data, {
  category: 'Electronics',
  price: { $lte: 1000 },
  inStock: true
});
```

### How do I filter case-sensitive strings?

```typescript
// Case-insensitive (default)
filter(users, 'alice');  // Matches 'Alice', 'ALICE', 'alice'

// Case-sensitive
filter(users, 'alice', { caseSensitive: true });  // Only 'alice'

// With operators
filter(users, {
  name: { $startsWith: 'Al' }
}, { caseSensitive: true });
```

[↑ Back to top](#table-of-contents)

---

## Troubleshooting

### "Invalid filter expression" error

**Problem:** Passing invalid expression types

```typescript
// ❌ These cause errors
filter(data, undefined);
filter(data, Symbol('test'));
filter(data, new Map());
```

**Solution:**

```typescript
// ✅ Valid expressions only
if (expression !== undefined && expression !== null) {
  filter(data, expression);
}

// ✅ Validate first
import { validateExpression } from '@mcabreradev/filter';
try {
  validateExpression(expression);
  filter(data, expression);
} catch (error) {
  console.error('Invalid expression:', error.message);
}
```

### TypeScript type errors

**Problem:** Type mismatches

```typescript
interface Product {
  id: number;
  name: string;
}

// ❌ Error: 'invalidProp' does not exist
filter<Product>(products, { invalidProp: 'value' });

// ❌ Error: Type 'string' not assignable
filter<Product>(products, { id: 'not-a-number' });
```

**Solution:**

```typescript
// ✅ Use correct types
filter<Product>(products, { id: 1 });
filter<Product>(products, { name: 'test' });

// ✅ Use type assertions carefully
filter(products, { someField: 'value' } as any);
```

### Unexpected results with wildcards

**Problem:** Wildcard not matching

```typescript
// ❌ No results
filter(users, '%Alice%');  // Expecting matches but gets []
```

**Solution:**

```typescript
// Check case sensitivity
filter(users, '%Alice%', { caseSensitive: false });  // Default

// Check actual data
console.log('Sample data:', users[0]);

// Try simpler pattern
filter(users, 'Alice');  // Without wildcards
```

### Performance issues

**Problem:** Slow filtering on large datasets

```typescript
// ⚠️ Slow: Complex predicate on 100k items
filter(largeDataset, (item) => {
  // Complex calculations
  return complexCondition(item);
});
```

**Solution:**

```typescript
// ✅ Use operators
filter(largeDataset, {
  price: { $gte: 100 },
  category: { $in: ['A', 'B'] }
});

// ✅ Enable cache for repeated queries
filter(largeDataset, expression, { enableCache: true });

// ✅ Pre-filter with simple conditions
const preFiltered = filter(largeDataset, { inStock: true });
const final = filter(preFiltered, complexExpression);
```

### Cache not working

**Problem:** Cache doesn't seem to improve performance

**Checklist:**
1. ✅ Enable cache: `{ enableCache: true }`
2. ✅ Use identical expressions (objects must be same reference or identical)
3. ✅ Data hasn't changed between calls
4. ✅ Filtering same dataset

### Operators not detected

**Problem:** Operators treated as regular values

```typescript
// ❌ Might be treated as literal object
const expr = { price: { $gt: 100 } };
filter(products, expr);  // Not working
```

**Solution:**

```typescript
// ✅ Ensure correct syntax
filter(products, {
  price: { $gt: 100 }  // Inline or properly structured
});

// ✅ Check TypeScript types
import type { ComparisonOperators } from '@mcabreradev/filter';
const priceFilter: ComparisonOperators = { $gt: 100 };
filter(products, { price: priceFilter });
```

[↑ Back to top](#table-of-contents)

---

## Contributing & Support

### Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**How to Contribute:**

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

**Areas for Contribution:**
- Bug fixes
- Documentation improvements
- Performance optimizations
- New operator ideas
- Example use cases

### Reporting Bugs

Please open an issue on [GitHub](https://github.com/mcabreradev/filter/issues) with:

- Clear description of the bug
- Minimal reproduction example
- Expected vs actual behavior
- Environment details (Node.js version, TypeScript version)

### Feature Requests

We love hearing your ideas! Open an issue with:

- Use case description
- Proposed API (if applicable)
- Why existing features don't solve it

### Support

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community support
- **Documentation**: This wiki and README
- **Examples**: Check `examples/` directory

### Version Support Policy

- **v4.x**: Active development, full support
- **v3.x**: Bug fixes for 6 months after v5.0.0 release
- **v2.x**: No longer supported

[↑ Back to top](#table-of-contents)

---

## Version History

### v5.0.0 (Latest - October 2025)

**Major Features:**
- 13 MongoDB-style operators ($gt, $gte, $lt, $lte, $eq, $ne, $in, $nin, $contains, $size, $startsWith, $endsWith)
- Configuration API with 4 options (caseSensitive, maxDepth, enableCache, customComparator)
- Runtime validation with Zod
- Performance optimizations (caching, early exit)
- Strict TypeScript with complete type coverage
- Migration to Vitest for testing
- 240+ comprehensive tests

**Breaking Changes:**
- Node.js >= 20 required (was >= 18)
- None for v3.x users (100% backward compatible)

**Improvements:**
- Modular architecture for better maintainability
- Enhanced documentation with real-world examples
- Better error messages
- Improved TypeScript inference

### v3.x

**Features:**
- String, number, boolean filtering
- Wildcard patterns (%, _)
- Negation (!)
- Object-based filtering
- Predicate functions
- Deep object comparison
- TypeScript support

### Migration Path

See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions.

[↑ Back to top](#table-of-contents)

---

## License & Credits

### License

MIT License - see [LICENSE.md](./LICENSE.md) for details.

Copyright (c) 2025 Miguelangel Cabrera

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

### Credits

**Author:** Miguelangel Cabrera
**GitHub:** [@mcabreradev](https://github.com/mcabreradev)
**Repository:** [github.com/mcabreradev/filter](https://github.com/mcabreradev/filter)

**Dependencies:**
- [Zod](https://zod.dev/) - Runtime validation (production)
- [Vitest](https://vitest.dev/) - Testing framework (development)
- [TypeScript](https://www.typescriptlang.org/) - Language (development)

**Inspired By:**
- MongoDB query syntax
- SQL wildcard patterns
- Lodash/Underscore filtering utilities

**Contributors:**

Thank you to all contributors who have helped improve this library!

[View all contributors](https://github.com/mcabreradev/filter/graphs/contributors)

---

### Star History

If you find this library useful, please consider giving it a star on [GitHub](https://github.com/mcabreradev/filter)!

---

**[↑ Back to top](#table-of-contents)**

---

*Last updated: October 2025 | Version 5.0.0*

