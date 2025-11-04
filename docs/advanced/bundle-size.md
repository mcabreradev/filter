# Bundle Size Optimization Guide

This guide provides comprehensive strategies for minimizing bundle size when using @mcabreradev/filter in your projects.

::: tip See Also
For detailed import syntax and examples, see the [Modular Imports Guide](/guide/modular-imports).
:::

## Overview

@mcabreradev/filter is designed with tree-shaking support and granular imports to minimize bundle impact. With the right import strategy, you can reduce bundle size by up to 80%.

## Bundle Size Breakdown

| Import Strategy | Size (gzipped) | Reduction | Use Case |
|----------------|----------------|-----------|----------|
| Full library | ~10 KB | Baseline | All features needed |
| Core only | ~3 KB | 70% | Basic filtering |
| Operators (granular) | ~5 KB | 50% | Specific operators |
| React integration | ~3 KB | 70% | React hooks only |
| Vue integration | ~3 KB | 70% | Vue composables only |
| Svelte integration | ~3 KB | 70% | Svelte stores only |
| Lazy evaluation | ~2 KB | 80% | Large dataset processing |

## Import Strategies

### 1. Full Import (Not Recommended for Production)

```typescript
import { filter } from '@mcabreradev/filter';
// Bundle: ~10 KB (gzipped)
```

**Use when:**
- Rapid prototyping
- All features are needed
- Bundle size is not a concern

**Avoid when:**
- Production builds
- Performance is critical
- Only using specific features

### 2. Core-Only Import (Recommended)

```typescript
import { filter } from '@mcabreradev/filter/core';
// Bundle: ~3 KB (gzipped) - 70% reduction
```

**Use when:**
- Basic filtering is sufficient
- No advanced operators needed
- Minimal bundle size is priority

::: tip
See [Modular Imports](/guide/modular-imports) for complete documentation on all available import paths.
:::

**Features included:**
- Basic filter function
- String pattern matching
- Object-based filtering
- Predicate functions
- Wildcard patterns

### 3. Granular Operator Imports (Recommended)

```typescript
// Import only comparison operators
import { filter } from '@mcabreradev/filter/core';
import { evaluateGt, evaluateLt, evaluateGte, evaluateLte } from '@mcabreradev/filter/operators/comparison';
// Bundle: ~4 KB (gzipped) - 60% reduction

// Import only string operators
import { filter } from '@mcabreradev/filter/core';
import { evaluateStartsWith, evaluateEndsWith } from '@mcabreradev/filter/operators/string';
// Bundle: ~4 KB (gzipped) - 60% reduction

// Import only array operators
import { filter } from '@mcabreradev/filter/core';
import { evaluateIn, evaluateContains } from '@mcabreradev/filter/operators/array';
// Bundle: ~4 KB (gzipped) - 60% reduction
```

**Use when:**
- Using specific operators
- Need operator functionality
- Want to optimize bundle size

**Available operator modules:**
- `@mcabreradev/filter/operators/comparison` - $gt, $gte, $lt, $lte, $eq, $ne
- `@mcabreradev/filter/operators/string` - $startsWith, $endsWith, $contains, $regex, $match
- `@mcabreradev/filter/operators/array` - $in, $nin, $contains, $size
- `@mcabreradev/filter/operators/logical` - $and, $or, $not
- `@mcabreradev/filter/operators/geospatial` - $near, $geoBox, $geoPolygon
- `@mcabreradev/filter/operators/datetime` - $recent, $upcoming, $dayOfWeek, $timeOfDay, $age

### 4. Framework-Specific Imports (Recommended)

```typescript
// React
import { useFilter, useDebouncedFilter } from '@mcabreradev/filter/react';
// Bundle: ~3 KB (gzipped) - 70% reduction

// Vue
import { useFilter } from '@mcabreradev/filter/vue';
// Bundle: ~3 KB (gzipped) - 70% reduction

// Svelte
import { filterStore } from '@mcabreradev/filter/svelte';
// Bundle: ~3 KB (gzipped) - 70% reduction
```

**Use when:**
- Using framework integrations
- Don't need core filter function
- Building framework-specific features

### 5. Lazy Evaluation Only (Recommended for Large Datasets)

```typescript
import { filterLazy, filterFirst, filterExists } from '@mcabreradev/filter/lazy';
// Bundle: ~2 KB (gzipped) - 80% reduction
```

**Use when:**
- Processing large datasets
- Early exit optimization needed
- Memory efficiency is critical

### 6. Debug Tools (Development Only)

```typescript
import { filterDebug } from '@mcabreradev/filter/debug';
// Bundle: ~2 KB (gzipped)
```

**Use when:**
- Debugging filter expressions
- Performance analysis
- Development mode only

**Note:** Should be excluded from production builds using build-time conditionals.

## Real-World Examples

### E-commerce Product Filtering

```typescript
// Before: Full import (10 KB)
import { filter } from '@mcabreradev/filter';

// After: Granular imports (5 KB - 50% reduction)
import { filter } from '@mcabreradev/filter/core';
import { evaluateGte, evaluateLte } from '@mcabreradev/filter/operators/comparison';
import { evaluateIn } from '@mcabreradev/filter/operators/array';

const products = filter(products, {
  price: { $gte: 100, $lte: 500 },
  category: { $in: ['Electronics', 'Accessories'] }
});
```

### React Dashboard with Search

```typescript
// Before: Full import (10 KB)
import { filter } from '@mcabreradev/filter';
import { useState } from 'react';

// After: Framework-specific (3 KB - 70% reduction)
import { useDebouncedFilter } from '@mcabreradev/filter/react';

function Dashboard() {
  const { filtered } = useDebouncedFilter(users, searchTerm, { delay: 300 });
  return <UserList users={filtered} />;
}
```

### Large Dataset Processing

```typescript
// Before: Full import (10 KB)
import { filter } from '@mcabreradev/filter';

// After: Lazy evaluation (2 KB - 80% reduction)
import { filterFirst, filterExists } from '@mcabreradev/filter/lazy';

// Find first 100 active users
const activeUsers = filterFirst(millionUsers, { active: true }, 100);

// Check if admin exists
const hasAdmin = filterExists(users, { role: 'admin' });
```

## Tree-Shaking Support

@mcabreradev/filter is fully tree-shakeable with:

- **ESM modules** - Modern module system
- **Side-effect free** - `"sideEffects": false` in package.json
- **Granular exports** - Import only what you need

### Bundler Configuration

#### Webpack

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: true
  }
};
```

#### Rollup

```javascript
// rollup.config.js
export default {
  treeshake: {
    moduleSideEffects: false
  }
};
```

#### Vite

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      treeshake: true
    }
  }
};
```

## Analyzing Your Bundle

### Using size-limit

```bash
# Check bundle size
pnpm run size

# Analyze why bundle is large
pnpm run size:why

# Or use analyze alias
pnpm run analyze
```

### Using webpack-bundle-analyzer

```bash
npm install --save-dev webpack-bundle-analyzer

# Add to webpack config
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

### Using Rollup Plugin Visualizer

```bash
npm install --save-dev rollup-plugin-visualizer

# Add to rollup config
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer()
  ]
};
```

## Production Build Optimizations

### 1. Code Splitting

```typescript
// Lazy load operators when needed
const loadGeospatial = () => import('@mcabreradev/filter/operators/geospatial');

async function filterByLocation() {
  const { evaluateNear } = await loadGeospatial();
  // Use geospatial operators
}
```

### 2. Conditional Imports

```typescript
// Load debug tools only in development
const filter = process.env.NODE_ENV === 'development'
  ? (await import('@mcabreradev/filter/debug')).filterDebug
  : (await import('@mcabreradev/filter/core')).filter;
```

### 3. Dynamic Imports

```typescript
// Load framework integrations dynamically
const useFilter = await import('@mcabreradev/filter/react').then(m => m.useFilter);
```

## Best Practices

### ✅ Do

- Use granular imports in production
- Import only needed operators
- Use framework-specific imports when available
- Enable tree-shaking in bundler
- Analyze bundle size regularly
- Use lazy evaluation for large datasets
- Code-split operator modules

### ❌ Don't

- Import entire library in production
- Import unused operators
- Mix full and granular imports
- Disable tree-shaking
- Include debug tools in production
- Load all operators upfront

## Size Limits

The library enforces the following size limits (gzipped):

| Module | Limit | Current |
|--------|-------|---------|
| Full Library | 10 KB | ~10 KB |
| Core | 3 KB | ~3 KB |
| Operators (all) | 5 KB | ~5 KB |
| Operators (individual) | 1-2 KB | ~1 KB |
| Framework Integrations | 3 KB | ~3 KB |
| Lazy Evaluation | 2 KB | ~2 KB |
| Debug Tools | 2 KB | ~2 KB |

## Migration Guide

### From v3.x to v5.x

```typescript
// v3.x - No granular imports
import { filter } from '@mcabreradev/filter';

// v5.x - Granular imports available
import { filter } from '@mcabreradev/filter/core';
import { evaluateGt } from '@mcabreradev/filter/operators/comparison';
```

### From Full Import to Granular

```typescript
// Before
import { filter, evaluateGt, evaluateLt, useFilter } from '@mcabreradev/filter';

// After
import { filter } from '@mcabreradev/filter/core';
import { evaluateGt, evaluateLt } from '@mcabreradev/filter/operators/comparison';
import { useFilter } from '@mcabreradev/filter/react';
```

## Resources

- [Bundle Size Benchmarks](./performance-benchmarks.md)
- [API Reference](../api/reference.md)
- [Framework Integrations](../frameworks/overview.md)
- [Lazy Evaluation Guide](../guide/lazy-evaluation.md)

## Support

If you encounter bundle size issues:

1. Check bundler configuration
2. Verify tree-shaking is enabled
3. Use `pnpm run analyze` to identify issues
4. Review import statements
5. [Open an issue](https://github.com/mcabreradev/filter/issues)

---

**Last Updated:** November 4, 2025  
**Version:** 5.6.1
