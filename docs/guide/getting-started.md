---
title: Getting Started
description: Introduction to @mcabreradev/filter - A powerful SQL-like array filtering library
---

# Getting Started

Welcome to **@mcabreradev/filter** - a powerful, SQL-like array filtering library for TypeScript and JavaScript with advanced pattern matching, MongoDB-style operators, deep object comparison, and zero dependencies.

## What is @mcabreradev/filter?

Go beyond JavaScript's native `Array.filter()` with a library that understands your data:

- **🎯 SQL-like Wildcards** - Use `%` and `_` for flexible pattern matching
- **🔍 Deep Object Filtering** - Search through nested objects up to configurable depths
- **⚡ Zero Dependencies** - Lightweight and production-ready (only Zod for runtime validation)
- **🔒 Type-Safe** - Built with strict TypeScript for maximum reliability
- **🎨 Multiple Strategies** - String patterns, objects, predicates, operators, or custom comparators
- **🚀 Performance Optimized** - Optional caching and regex compilation optimization
- **📦 MongoDB-Style Operators** - 18 operators for advanced filtering (v5.0.0+)
- **💨 Lazy Evaluation** - Process large datasets efficiently with generators (v5.1.0+)
- **🧪 Battle-Tested** - 300+ tests ensuring reliability

## Why Choose This Library?

### Developer Experience

The API is designed to be intuitive and familiar. If you know SQL wildcards or MongoDB queries, you already know how to use this library.

```typescript
// Familiar SQL-like syntax
filter(users, '%@example.com%');

// MongoDB-style operators
filter(products, { price: { $gte: 100, $lte: 500 } });

// Simple object matching
filter(items, { category: 'Electronics', inStock: true });
```

### Performance

Built for production with multiple optimization strategies:

- **530x faster** with result caching
- **500x faster** with lazy evaluation for early exits
- **Regex pattern caching** for repeated queries
- **Predicate memoization** across different arrays

### Type Safety

Full TypeScript support with strict typing:

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

const users: User[] = [...];
const result = filter<User>(users, { age: { $gte: 18 } });
// result is User[] with full type inference
```

### Framework Integration

First-class support for modern frameworks:

- **React Hooks** - `useFilter`, `useDebouncedFilter`, `usePaginatedFilter`
- **Vue Composables** - Full Composition API support with reactivity
- **Svelte Stores** - Reactive store-based filtering

## Browser Support

Works in all modern browsers and Node.js:

- **Node.js:** >= 20
- **Browsers:** Chrome, Firefox, Safari, Edge (latest versions)
- **TypeScript:** >= 5.0
- **Module Systems:** ESM, CommonJS

## Next Steps

- [Installation](/guide/installation) - Install and set up the library
- [Quick Start](/guide/quick-start) - Start filtering in minutes
- [Operators Guide](/guide/operators) - Learn all 18 MongoDB-style operators
- [Framework Integration](/frameworks/overview) - Integrate with React, Vue, or Svelte

## Community & Support

- 📖 [Complete Documentation](/)
- 💬 [GitHub Discussions](https://github.com/mcabreradev/filter/discussions)
- 🐛 [Issue Tracker](https://github.com/mcabreradev/filter/issues)
- ⭐ [Star on GitHub](https://github.com/mcabreradev/filter)

