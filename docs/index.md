---
layout: home

hero:
  name: "@mcabreradev/filter"
  text: "SQL-like Array Filtering"
  tagline: "A powerful TypeScript/JavaScript library with MongoDB-style operators, lazy evaluation, and zero dependencies"
  image:
    src: /logo.svg
    alt: Filter Library
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Try Playground
      link: /playground/
    - theme: alt
      text: View on GitHub
      link: https://github.com/mcabreradev/filter

features:
  - icon: 🎯
    title: SQL-like Wildcards
    details: Use % and _ for flexible pattern matching. Search like a pro with familiar SQL syntax.

  - icon: 🔍
    title: Deep Object Filtering
    details: Search through nested objects up to configurable depths. No data structure is too complex.

  - icon: ⚡
    title: Zero Dependencies
    details: Lightweight and production-ready. Only Zod for runtime validation, nothing else.

  - icon: 🔒
    title: Type-Safe
    details: Built with strict TypeScript for maximum reliability. Full IntelliSense support.

  - icon: 🎨
    title: Multiple Strategies
    details: String patterns, objects, predicates, operators, or custom comparators. Your choice.

  - icon: 🚀
    title: Performance Optimized
    details: Optional caching and regex compilation. 530x faster with memoization.

  - icon: 📦
    title: MongoDB-Style Operators
    details: 18 operators for advanced filtering including $and, $or, $not, $regex, and more.

  - icon: 💨
    title: Lazy Evaluation
    details: Process large datasets efficiently with generators. 500x faster for early exits.

  - icon: 🐛
    title: Debug Mode
    details: Visual debugging with tree visualization, match statistics, and performance metrics. Understand your filters.

  - icon: 🎨
    title: Framework Integration
    details: React Hooks, Vue Composables, and Svelte Stores. First-class framework support.

  - icon: 🧪
    title: Battle-Tested
    details: 300+ tests ensuring reliability. 100% test coverage across all features.

  - icon: 📚
    title: Comprehensive Docs
    details: Extensive documentation with 150+ examples. Learn by doing.

  - icon: 🌐
    title: Universal
    details: Works in Node.js, browsers, and edge runtimes. Deploy anywhere.
---

## Quick Start

Install the package:

```bash
npm install @mcabreradev/filter
```

Start filtering:

```typescript
import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', email: 'alice@example.com', age: 30, city: 'Berlin' },
  { name: 'Bob', email: 'bob@example.com', age: 25, city: 'London' },
  { name: 'Charlie', email: 'charlie@example.com', age: 35, city: 'Berlin' }
];

// Simple string matching
filter(users, 'Berlin');
// → Returns Alice and Charlie

// Wildcard patterns
filter(users, '%alice%');
// → Returns Alice

// Object-based filtering
filter(users, { city: 'Berlin', age: 30 });
// → Returns Alice

// MongoDB-style operators
filter(users, { age: { $gte: 25, $lt: 35 } });
// → Returns Bob and Alice

// Logical operators
filter(users, {
  $and: [
    { city: 'Berlin' },
    { age: { $gte: 30 } }
  ]
});
// → Returns Alice and Charlie

// Debug mode for visual inspection
import { filterDebug } from '@mcabreradev/filter';

const result = filterDebug(users, {
  $and: [
    { city: 'Berlin' },
    { $or: [{ age: { $lt: 30 } }, { premium: true }] }
  ]
});

result.print();
// Outputs visual tree with match statistics
```

## Framework Integration

### React

```typescript
import { useFilter, useDebouncedFilter } from '@mcabreradev/filter';

function UserList() {
  const { filtered, isFiltering } = useFilter(users, { active: true });
  return <div>{filtered.map(user => <User key={user.id} {...user} />)}</div>;
}
```

### Vue

```vue
<script setup>
import { ref } from 'vue';
import { useFilter } from '@mcabreradev/filter';

const searchTerm = ref('');
const { filtered, isFiltering } = useFilter(users, searchTerm);
</script>
```

### Svelte

```svelte
<script>
import { writable } from 'svelte/store';
import { useFilter } from '@mcabreradev/filter';

const searchTerm = writable('');
const { filtered, isFiltering } = useFilter(users, searchTerm);
</script>
```

## Why Choose This Library?

<div class="feature-grid">
  <div class="feature-card">
    <div class="feature-icon">⚡</div>
    <div class="feature-title">Blazing Fast</div>
    <div class="feature-description">
      530x faster with caching, 500x faster with lazy evaluation. Optimized for production workloads.
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon">🎯</div>
    <div class="feature-title">Developer Friendly</div>
    <div class="feature-description">
      Intuitive API that feels natural. SQL-like syntax you already know. Full TypeScript support.
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon">🔧</div>
    <div class="feature-title">Flexible</div>
    <div class="feature-description">
      Multiple filtering strategies. Use what fits your use case. Combine approaches seamlessly.
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon">📦</div>
    <div class="feature-title">Production Ready</div>
    <div class="feature-description">
      Battle-tested with 300+ tests. Used in production by companies worldwide. MIT licensed.
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon">🪶</div>
    <div class="feature-title">Ultra Lightweight</div>
    <div class="feature-description">
      Zero dependencies (except Zod). Tiny bundle size. No bloat, just pure filtering power.
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon">🔒</div>
    <div class="feature-title">Type-Safe by Default</div>
    <div class="feature-description">
      Built with strict TypeScript. Catch errors at compile time. Full IntelliSense and autocomplete support.
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon">🎨</div>
    <div class="feature-title">Framework Agnostic</div>
    <div class="feature-description">
      Works everywhere: React, Vue, Svelte, Angular, Node.js, Deno, Bun. First-class hooks and composables included.
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon">📊</div>
    <div class="feature-title">Handles Big Data</div>
    <div class="feature-description">
      Process millions of records efficiently. Lazy evaluation for memory optimization. Built for scale.
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon">🛡️</div>
    <div class="feature-title">Runtime Validation</div>
    <div class="feature-description">
      Zod-powered schema validation. Catch invalid queries before they run. Safe and predictable behavior.
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon">🎓</div>
    <div class="feature-title">Easy Learning Curve</div>
    <div class="feature-description">
      Familiar MongoDB and SQL patterns. Comprehensive docs with 150+ examples. Get productive in minutes.
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon">🔄</div>
    <div class="feature-title">Active Maintenance</div>
    <div class="feature-description">
      Regular updates and improvements. Responsive to issues and feature requests. Community-driven development.
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon">🌍</div>
    <div class="feature-title">Edge-Ready</div>
    <div class="feature-description">
      Works in Cloudflare Workers, Vercel Edge, Deno Deploy. Perfect for serverless and edge computing.
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon">🧪</div>
    <div class="feature-title">Test Coverage</div>
    <div class="feature-description">
      100% code coverage. 300+ unit and integration tests. Type-level tests for TypeScript guarantees.
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon">🎭</div>
    <div class="feature-title">No Vendor Lock-in</div>
    <div class="feature-description">
      Pure JavaScript/TypeScript. No proprietary formats. Easy to migrate to or from. You own your data.
    </div>
  </div>

  <div class="feature-card">
    <div class="feature-icon">⚙️</div>
    <div class="feature-title">Highly Configurable</div>
    <div class="feature-description">
      Customize behavior to your needs. Configure depth, caching, case sensitivity. Fine-tune performance.
    </div>
  </div>
</div>

## Real-World Example

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  inStock: boolean;
  tags: string[];
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

// Complex queries with logical operators
const premiumDeals = filter(products, {
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

## Community & Support

- 📖 [Complete Documentation](/guide/getting-started)
- 💬 [GitHub Discussions](https://github.com/mcabreradev/filter/discussions)
- 🐛 [Issue Tracker](https://github.com/mcabreradev/filter/issues)
- ⭐ [Star on GitHub](https://github.com/mcabreradev/filter)

## License

MIT License - see [LICENSE](https://github.com/mcabreradev/filter/blob/main/LICENSE.md) for details.

Copyright © 2025 Miguelangel Cabrera

