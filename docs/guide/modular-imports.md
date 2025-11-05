# Modular Imports

@mcabreradev/filter supports granular imports to minimize bundle size through tree-shaking.

## Import Styles

### Classic Import (All Features)

Import everything from the main package for quick setup:

```typescript
import { filter, useFilter, filterLazy } from '@mcabreradev/filter';

const { filtered } = useFilter(users, { active: true });
```

**Bundle size:** ~10 KB (gzipped)

**Best for:**
- Getting started quickly
- Small applications
- Prototyping
- Development

### Modular Import (Production Recommended)

Import only what you need for optimal bundle size:

```typescript
import { filter } from '@mcabreradev/filter/core';
import { useFilter } from '@mcabreradev/filter/react';
import { evaluateGt } from '@mcabreradev/filter/operators/comparison';
```

**Bundle size:** ~3-5 KB (gzipped) - **50-70% smaller!**

**Best for:**
- Production applications
- Bundle size optimization
- Tree-shaking support
- Specific feature usage

## Framework Integrations

### React

Both import styles work seamlessly:

```typescript
// Classic import
import { useFilter } from '@mcabreradev/filter';

// Modular import (recommended)
import { useFilter } from '@mcabreradev/filter/react';

function UserList() {
  const { filtered, isFiltering } = useFilter(users, { active: true });
  
  return (
    <div>
      {isFiltering && <span>Loading...</span>}
      {filtered.map(user => <User key={user.id} {...user} />)}
    </div>
  );
}
```

**Available hooks:**
- `useFilter` - Basic filtering with state management
- `useFilteredState` - Filter with local state
- `useDebouncedFilter` - Debounced filtering for search inputs
- `usePaginatedFilter` - Pagination support

### Vue

```typescript
// Classic import
import { useFilter } from '@mcabreradev/filter';

// Modular import (recommended)
import { useFilter } from '@mcabreradev/filter/vue';

const searchTerm = ref('');
const { filtered, isFiltering } = useFilter(users, searchTerm);
```

**Available composables:**
- `useFilter` - Reactive filtering with refs
- `useFilteredState` - Filter with reactive state
- `useDebouncedFilter` - Debounced filtering
- `usePaginatedFilter` - Pagination support

### Svelte

```typescript
// Classic import - exports useFilter for compatibility
import { useFilter } from '@mcabreradev/filter';

// Modular import (recommended)
import { useFilter } from '@mcabreradev/filter/svelte';

const searchTerm = writable('');
const { filtered, isFiltering } = useFilter(users, searchTerm);
```

**Available stores:**
- `useFilter` - Basic filtering store
- `useFilteredState` - Filtered state store
- `useDebouncedFilter` - Debounced filtering store
- `usePaginatedFilter` - Pagination store

## Operators

### Comparison Operators

```typescript
import { applyComparisonOperators } from '@mcabreradev/filter/operators/comparison';

const operators = { $gte: 18, $lte: 65 };
const isWorkingAge = applyComparisonOperators(user.age, operators);
```

### Array Operators

```typescript
import { applyArrayOperators } from '@mcabreradev/filter/operators/array';

const operators = { $in: ['Electronics', 'Books'] };
const isValidCategory = applyArrayOperators(product.category, operators);
```

### String Operators

```typescript
import { applyStringOperators } from '@mcabreradev/filter/operators/string';

const operators = { $startsWith: 'admin' };
const isAdmin = applyStringOperators(user.username, operators);
```

### Logical Operators

```typescript
import { applyLogicalOperators } from '@mcabreradev/filter/operators/logical';

const operators = {
  $and: [
    { active: true },
    { verified: true }
  ]
};
const isValid = applyLogicalOperators(user, operators);
```

### Geospatial Operators

```typescript
import { evaluateNear, evaluateGeoBox } from '@mcabreradev/filter/operators/geospatial';

const isNearby = evaluateNear(restaurant.location, {
  center: userLocation,
  maxDistanceMeters: 5000
});
```

**Available:** `evaluateNear`, `evaluateGeoBox`, `evaluateGeoPolygon`

### DateTime Operators

```typescript
import { evaluateRecent, evaluateUpcoming } from '@mcabreradev/filter/operators/datetime';

const isRecentEvent = evaluateRecent(event.date, { hours: 24 });
const isUpcoming = evaluateUpcoming(event.date, { days: 7 });
```

**Available:** `evaluateRecent`, `evaluateUpcoming`, `evaluateDayOfWeek`, `evaluateTimeOfDay`, `evaluateAge`, `evaluateIsWeekday`, `evaluateIsWeekend`, `evaluateIsBefore`, `evaluateIsAfter`

## Core Functions

### Basic Filter

```typescript
import { filter } from '@mcabreradev/filter/core';

const results = filter(data, expression);
```

**Bundle size:** ~3 KB (gzipped)

### Lazy Evaluation

```typescript
import { 
  filterLazy, 
  filterFirst, 
  filterExists,
  take, 
  map 
} from '@mcabreradev/filter/lazy';

const results = filterFirst(largeDataset, { active: true }, 10);
```

**Bundle size:** ~2 KB (gzipped)

## Utilities

### Debug

```typescript
import { filterDebug } from '@mcabreradev/filter/debug';

const result = filterDebug(users, expression);
console.log(result.stats);
```

### Config

```typescript
import { createFilterConfig } from '@mcabreradev/filter/config';

const config = createFilterConfig({ caseSensitive: true });
```

### Validation

```typescript
import { validateExpression } from '@mcabreradev/filter/validation';

const validExpression = validateExpression(userInput);
```

## Migration Examples

### Before (Full Import)

```typescript
// Classic import
import { filter, useFilter, filterLazy } from '@mcabreradev/filter';

// Modular import (recommended)
import { filter } from '@mcabreradev/filter/core';
import { useFilter } from '@mcabreradev/filter/react';
import { applyComparisonOperators } from '@mcabreradev/filter/operators/comparison';
```

**Bundle size reduction:** ~50% (10 KB → 5 KB)

## Best Practices

1. **Import only what you need** - Use granular imports for production
2. **Combine related imports** - Import from the same module when possible
3. **Use framework-specific entry points** - Better tree-shaking
4. **Leverage lazy evaluation** - For large datasets
5. **Keep classic imports for development** - Faster prototyping

## TypeScript Support

All modular imports have full TypeScript support:

```typescript
import type { UseFilterResult } from '@mcabreradev/filter/react';
import type { GeoPoint } from '@mcabreradev/filter/operators/geospatial';
import type { FilterOptions } from '@mcabreradev/filter/core';
```

## Bundle Size Comparison

| Import Strategy | Size (gzipped) | Use Case |
|----------------|----------------|----------|
| `import { ... } from '@mcabreradev/filter'` | ~10 KB | Quick start, prototypes |
| `import { filter } from '@mcabreradev/filter/core'` | ~3 KB | Production apps |
| `import { useFilter } from '@mcabreradev/filter/react'` | ~3 KB | React apps |
| `import { filterLazy } from '@mcabreradev/filter/lazy'` | ~2 KB | Large datasets |

## Package Exports Configuration

The package is configured with granular exports in `package.json`:

```json
{
  "exports": {
    ".": "./build/index.js",
    "./core": "./build/core/index.js",
    "./react": "./build/integrations/react/index.js",
    "./vue": "./build/integrations/vue/index.js",
    "./svelte": "./build/integrations/svelte/index.js",
    "./operators/comparison": "./build/operators/comparison.js",
    "./operators/array": "./build/operators/array.js",
    "./operators/string": "./build/operators/string.js",
    "./operators/logical": "./build/operators/logical.js",
    "./operators/geospatial": "./build/operators/geospatial.js",
    "./operators/datetime": "./build/operators/datetime.js",
    "./lazy": "./build/core/lazy.js",
    "./debug": "./build/debug/index.js",
    "./config": "./build/config/index.js",
    "./validation": "./build/validation/index.js"
  }
}
```

## See Also

- [Installation Guide](./installation.md)
- [Bundle Size Optimization](../advanced/bundle-size.md)
- [Framework Integrations](../frameworks/overview.md)
- [API Reference](../api/reference.md)
