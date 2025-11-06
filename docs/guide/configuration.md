# Configuration

Filter provides flexible configuration options to customize behavior for your specific needs. Configure globally or per-filter call.

## Overview

Available configuration options:
- **`caseSensitive`** - Control case sensitivity for string matching
- **`maxDepth`** - Set maximum depth for nested object traversal
- **`enableCache`** - Enable performance caching
- **`customComparator`** - Provide custom comparison logic
- **`debug`** - Enable debug mode with visual tree output
- **`verbose`** - Show additional debug details (requires debug: true)
- **`showTimings`** - Display execution timings (requires debug: true)
- **`colorize`** - Use ANSI colors in debug output (requires debug: true)
- **`orderBy`** - Sort filtered results by field(s) (v5.7.0+)
- **`limit`** - Limit the number of results returned (v5.7.0+)

## Configuration Options

### caseSensitive

Controls whether string comparisons are case-sensitive.

**Type**: `boolean`
**Default**: `false`

```typescript
filter(users, 'alice');

filter(users, 'Alice', { caseSensitive: true });
```

**Use Cases:**
- Case-insensitive search (default)
- Exact case matching for codes/IDs
- Case-sensitive email validation

**Examples:**

```typescript
const users = [
  { name: 'Alice' },
  { name: 'alice' },
  { name: 'ALICE' },
];

filter(users, 'alice');

filter(users, 'alice', { caseSensitive: true });
```

### maxDepth

Controls how deep the filter traverses nested objects.

**Type**: `number`
**Default**: `3`
**Range**: `0-10` (recommended: `1-5`)

```typescript
filter(data, expression, { maxDepth: 5 });
```

**Use Cases:**
- Limit traversal for performance
- Control nested object filtering depth
- Prevent excessive recursion

**Examples:**

```typescript
interface DeepObject {
  level1: {
    level2: {
      level3: {
        value: string;
      };
    };
  };
}

filter(data, {
  level1: {
    level2: {
      level3: {
        value: 'test'
      }
    }
  }
}, { maxDepth: 3 });
```

**Performance Impact:**
- Lower values = faster filtering
- Higher values = more flexible but slower
- Default (3) balances flexibility and performance

### enableCache

Enables caching of filter predicates and regex patterns for improved performance.

**Type**: `boolean`
**Default**: `false`

```typescript
filter(data, expression, { enableCache: true });
```

**Use Cases:**
- Repeated filtering with same expression
- High-frequency filtering operations
- Performance-critical applications

**Performance Gains:**
- Up to 530x faster for cached predicates
- Significant improvement for regex patterns
- Best for repeated identical queries

**Examples:**

```typescript
const expression = { age: { $gte: 18 } };

filter(users, expression, { enableCache: true });
filter(users, expression, { enableCache: true });
```

**Cache Management:**

```typescript
import { clearFilterCache, getFilterCacheStats } from '@mcabreradev/filter';

clearFilterCache();

const stats = getFilterCacheStats();
console.log(stats);
```

### debug

Enable debug mode to visualize filter execution with tree output and statistics.

**Type**: `boolean`
**Default**: `false`

```typescript
filter(users, { city: 'Berlin' }, { debug: true });
```

**Use Cases:**
- Understanding complex filter logic
- Debugging why items match or don't match
- Performance analysis
- Development and testing

**Output:**
```
Filter Debug Tree
└── city = "Berlin" (2/3 matched, 66.7%)

Statistics:
├── Matched: 2 / 3 items (66.7%)
├── Execution Time: 0.45ms
├── Cache Hit: No
└── Conditions Evaluated: 1
```

**Examples:**

```typescript
filter(users, {
  $and: [
    { city: 'Berlin' },
    { age: { $gte: 25 } }
  ]
}, { debug: true });
```

**Debug Options:**

Combine with verbose, showTimings, and colorize for enhanced output:

```typescript
filter(users, expression, {
  debug: true,
  verbose: true,
  showTimings: true,
  colorize: true
});
```

### orderBy

Sort filtered results by one or more fields in ascending or descending order.

**Type**: `string | { field: string; direction: 'asc' | 'desc' } | Array<string | { field: string; direction: 'asc' | 'desc' }>`
**Default**: `undefined` (no sorting)

```typescript
filter(users, { age: { $gte: 18 } }, { orderBy: 'age' });
```

**Use Cases:**
- Sort results by a single field
- Multi-field sorting (primary, secondary, tertiary)
- Sort by nested paths using dot notation
- Combine filtering with sorting in one operation

**Single Field Sorting:**

```typescript
const users = [
  { name: 'Charlie', age: 35 },
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
];

filter(users, {}, { orderBy: 'name' });
filter(users, {}, { orderBy: { field: 'age', direction: 'desc' } });
```

**Multiple Fields Sorting:**

Sort by multiple fields with different directions:

```typescript
filter(users, {}, {
  orderBy: [
    { field: 'age', direction: 'desc' },
    { field: 'name', direction: 'asc' }
  ]
});
```

**Nested Paths:**

Sort by nested object properties using dot notation:

```typescript
const users = [
  { name: 'Alice', profile: { age: 30, address: { city: 'Berlin' } } },
  { name: 'Bob', profile: { age: 25, address: { city: 'London' } } },
];

filter(users, {}, { orderBy: 'profile.age' });
filter(users, {}, { orderBy: 'profile.address.city' });
```

**Combining with Filtering:**

Filter and sort in a single operation:

```typescript
filter(users, { city: 'Berlin' }, { orderBy: 'age' });
filter(products, { category: 'Electronics' }, {
  orderBy: [
    { field: 'price', direction: 'asc' },
    { field: 'rating', direction: 'desc' }
  ]
});
```

**Type Support:**

- **Strings**: Case-insensitive by default (respects `caseSensitive` option)
- **Numbers**: Numeric comparison
- **Dates**: Date comparison using `getTime()`
- **Booleans**: Boolean comparison
- **Null/undefined**: Placed at the end (nulls last)

**Examples:**

```typescript
const products = [
  { name: 'Laptop', price: 1200, rating: 4.5 },
  { name: 'Mouse', price: 25, rating: 4.8 },
  { name: 'Monitor', price: 450, rating: 4.2 },
];

filter(products, { price: { $lte: 1000 } }, { orderBy: 'price' });

filter(products, {}, {
  orderBy: [
    { field: 'rating', direction: 'desc' },
    { field: 'price', direction: 'asc' }
  ]
});
```

**Performance Impact:**
- Sorting is O(n log n) operation
- Applied only when `orderBy` is specified
- No performance impact when `orderBy` is not used
- Works efficiently with caching (different `orderBy` = different cache entry)

See [Debug Mode Guide](/guide/debug) for complete documentation.

### limit

Limit the number of results returned by the filter. The limit is applied **after filtering and sorting**, so you get the top N results after all processing.

**Type**: `number`
**Default**: `undefined` (no limit)

```typescript
filter(users, { active: true }, { limit: 10 });
```

**Use Cases:**
- Pagination and result limiting
- "Top N" queries (e.g., top 10 products)
- Performance optimization for large datasets
- Preview/sample data display
- Rate limiting and quotas

**Basic Usage:**

```typescript
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 },
  { name: 'David', age: 28 },
  { name: 'Eve', age: 32 },
];

filter(users, { age: { $gte: 25 } }, { limit: 3 });
```

**Combining with Sorting:**

Get the top N results by combining `limit` with `orderBy`:

```typescript
filter(products, { category: 'Electronics' }, {
  orderBy: { field: 'price', direction: 'desc' },
  limit: 5
});

filter(users, { active: true }, {
  orderBy: [
    { field: 'score', direction: 'desc' },
    { field: 'createdAt', direction: 'asc' }
  ],
  limit: 10
});
```

**Special Values:**
- `undefined` or omitted: No limit (returns all matching results)
- `0`: No limit (returns all matching results)
- Negative numbers: No limit (returns all matching results)
- Positive numbers: Returns at most N results

**Examples:**

```typescript
filter(users, { active: true }, { limit: 0 });

filter(users, { active: true }, { limit: -5 });

filter(users, { active: true });

filter(users, { active: true }, { limit: 100 });
```

**Top N Queries:**

Get top performers, highest scores, most recent items, etc.:

```typescript
filter(students, {}, {
  orderBy: { field: 'grade', direction: 'desc' },
  limit: 10
});

filter(posts, { published: true }, {
  orderBy: { field: 'createdAt', direction: 'desc' },
  limit: 20
});

filter(products, { category: 'Electronics', inStock: true }, {
  orderBy: [
    { field: 'rating', direction: 'desc' },
    { field: 'price', direction: 'asc' }
  ],
  limit: 5
});
```

**Pagination Pattern:**

While `limit` doesn't support offset directly, you can implement pagination by filtering in chunks:

```typescript
const pageSize = 10;

const allResults = filter(users, { active: true }, {
  orderBy: 'createdAt'
});

const page1 = allResults.slice(0, pageSize);
const page2 = allResults.slice(pageSize, pageSize * 2);
const page3 = allResults.slice(pageSize * 2, pageSize * 3);
```

Or use lazy evaluation for memory efficiency:

```typescript
import { filterLazy, take, toArray } from '@mcabreradev/filter';

const resultsIterator = filterLazy(users, { active: true });
const limitedResults = toArray(take(resultsIterator, 10));
```

**Performance Impact:**
- `limit` is applied **after** filtering and sorting
- Reduces memory usage when only subset of results needed
- No performance gain for filtering itself (all items still evaluated)
- Fastest when combined with lazy evaluation for early exit

**Combining with Caching:**

Limit works with caching - different limits create different cache entries:

```typescript
filter(users, { active: true }, {
  limit: 10,
  enableCache: true
});

filter(users, { active: true }, {
  limit: 20,
  enableCache: true
});
```

**Order of Operations:**

Understanding how `limit` interacts with other options:

1. **Filtering** - Apply expression to all items
2. **Sorting** - Apply `orderBy` if specified
3. **Limiting** - Apply `limit` to get top N results

```typescript
const result = filter(products, { category: 'Electronics' }, {
  orderBy: { field: 'price', direction: 'desc' },
  limit: 5
});
```

**Best Practices:**

```typescript
filter(users, { active: true }, {
  orderBy: 'name',
  limit: 100
});

filter(users, { active: true }, { limit: 0 });

import { filterLazy, take } from '@mcabreradev/filter';
const result = take(filterLazy(hugeDataset, expression), 1000);

const pageSize = 20;
filter(users, expression, {
  orderBy: 'createdAt',
  limit: pageSize,
  enableCache: true
});
```

### verbose

Show additional details in debug output (only works with `debug: true`).

**Type**: `boolean`
**Default**: `false`

```typescript
filter(users, expression, {
  debug: true,
  verbose: true
});
```

### showTimings

Display execution time for each node in debug tree (only works with `debug: true`).

**Type**: `boolean`
**Default**: `false`

```typescript
filter(users, expression, {
  debug: true,
  showTimings: true
});
```

### colorize

Use ANSI colors in debug output for better readability (only works with `debug: true`).

**Type**: `boolean`
**Default**: `false`

```typescript
filter(users, expression, {
  debug: true,
  colorize: true
});
```

### customComparator

Provide custom comparison logic for string matching.

**Type**: `(actual: unknown, expected: unknown) => boolean`
**Default**: Case-insensitive substring matching

```typescript
filter(data, expression, {
  customComparator: (actual, expected) => {
    return String(actual) === String(expected);
  }
});
```

**Use Cases:**
- Custom string comparison logic
- Locale-specific comparisons
- Special matching rules
- Domain-specific equality

**Examples:**

```typescript
filter(users, 'alice', {
  customComparator: (actual, expected) => {
    return String(actual).toLowerCase() === String(expected).toLowerCase();
  }
});
```

**Advanced Comparator:**

```typescript
filter(products, 'widget', {
  customComparator: (actual, expected) => {
    const actualStr = String(actual).toLowerCase().trim();
    const expectedStr = String(expected).toLowerCase().trim();

    return actualStr.includes(expectedStr) ||
           expectedStr.includes(actualStr);
  }
});
```

## Configuration Methods

### Per-Filter Configuration

Pass options to individual filter calls:

```typescript
filter(users, expression, {
  caseSensitive: true,
  maxDepth: 5,
  enableCache: true
});
```

### Configuration Builder

Use the configuration builder for reusable configs:

```typescript
import { createFilterConfig } from '@mcabreradev/filter';

const config = createFilterConfig({
  caseSensitive: true,
  enableCache: true,
  maxDepth: 4
});

filter(users, expression, config);
```

### Merging Configurations

Merge multiple configurations:

```typescript
import { mergeConfig } from '@mcabreradev/filter';

const baseConfig = { caseSensitive: true };
const cacheConfig = { enableCache: true };

const merged = mergeConfig(baseConfig, cacheConfig);
```

## Real-World Examples

### Case-Sensitive Code Matching

```typescript
const products = [
  { sku: 'PRD-001' },
  { sku: 'prd-001' },
];

filter(products, { sku: 'PRD-001' }, {
  caseSensitive: true
});
```

### Deep Object Filtering

```typescript
interface Organization {
  department: {
    team: {
      lead: {
        name: string;
      };
    };
  };
}

filter(orgs, {
  department: {
    team: {
      lead: {
        name: 'Alice'
      }
    }
  }
}, {
  maxDepth: 4
});
```

### High-Performance Dashboard

```typescript
const dashboardConfig = {
  enableCache: true,
  caseSensitive: false,
  maxDepth: 3
};

const activeUsers = filter(users, { status: 'active' }, dashboardConfig);
const premiumUsers = filter(users, { premium: true }, dashboardConfig);
```

### Custom Fuzzy Matching

```typescript
filter(products, 'laptop', {
  customComparator: (actual, expected) => {
    const actualStr = String(actual).toLowerCase();
    const expectedStr = String(expected).toLowerCase();

    const distance = levenshteinDistance(actualStr, expectedStr);
    return distance <= 2;
  }
});
```

## Configuration Patterns

### Development vs Production

```typescript
const config = {
  enableCache: process.env.NODE_ENV === 'production',
  caseSensitive: false,
  maxDepth: 3
};

filter(data, expression, config);
```

### Feature Flags

```typescript
const config = {
  enableCache: featureFlags.caching,
  caseSensitive: featureFlags.strictMatching,
  maxDepth: featureFlags.deepSearch ? 5 : 3
};
```

### User Preferences

```typescript
const getUserConfig = (preferences) => ({
  caseSensitive: preferences.exactMatch,
  enableCache: preferences.performanceMode,
  maxDepth: preferences.searchDepth || 3
});

filter(data, expression, getUserConfig(userPreferences));
```

## Performance Guidelines

### When to Enable Caching

**Enable caching when:**
- Filtering the same data repeatedly
- Using identical expressions multiple times
- Performance is critical
- Working with large datasets

**Don't enable caching when:**
- Expressions change frequently
- Memory is constrained
- Filtering small datasets
- One-time queries

### Optimal maxDepth

| Use Case | Recommended maxDepth |
|----------|---------------------|
| Flat objects | 1 |
| Simple nesting | 2-3 (default) |
| Complex structures | 4-5 |
| Very deep nesting | 6+ (use sparingly) |

### caseSensitive Impact

- **Case-insensitive** (default): Slightly slower but more flexible
- **Case-sensitive**: Faster but stricter matching

## Best Practices

### 1. Use Sensible Defaults

```typescript
const defaultConfig = {
  caseSensitive: false,
  maxDepth: 3,
  enableCache: false
};
```

### 2. Enable Caching for Repeated Queries

```typescript
const config = { enableCache: true };

setInterval(() => {
  const active = filter(users, { status: 'active' }, config);
  updateDashboard(active);
}, 1000);
```

### 3. Adjust maxDepth Based on Data

```typescript
const shallowConfig = { maxDepth: 2 };
const deepConfig = { maxDepth: 5 };

filter(simpleData, expression, shallowConfig);
filter(complexData, expression, deepConfig);
```

### 4. Document Custom Comparators

```typescript
const fuzzyComparator = (actual, expected) => {
  return similarity(actual, expected) > 0.8;
};

filter(data, expression, {
  customComparator: fuzzyComparator
});
```

### 5. Clear Cache Periodically

```typescript
import { clearFilterCache } from '@mcabreradev/filter';

setInterval(() => {
  clearFilterCache();
}, 60000);
```

## TypeScript Support

Full type safety for configuration:

```typescript
import type { FilterOptions } from '@mcabreradev/filter';

const config: FilterOptions = {
  caseSensitive: true,
  maxDepth: 4,
  enableCache: true,
  customComparator: (a, b) => String(a) === String(b)
};

filter(users, expression, config);
```

## Troubleshooting

### Nested Properties Not Matching

Increase maxDepth:

```typescript
filter(data, expression, { maxDepth: 5 });
```

### Case Sensitivity Issues

Check caseSensitive setting:

```typescript
filter(users, 'Alice', { caseSensitive: false });
```

### Performance Problems

Enable caching:

```typescript
filter(data, expression, { enableCache: true });
```

### Custom Comparator Not Working

Verify comparator signature:

```typescript
const comparator = (actual: unknown, expected: unknown): boolean => {
  return String(actual) === String(expected);
};

filter(data, expression, { customComparator: comparator });
```

## Advanced Configuration

### Combining All Options

```typescript
const advancedConfig = {
  caseSensitive: true,
  maxDepth: 5,
  enableCache: true,
  customComparator: (actual, expected) => {
    if (typeof actual === 'string' && typeof expected === 'string') {
      return actual.localeCompare(expected, 'en', { sensitivity: 'base' }) === 0;
    }
    return actual === expected;
  }
};

filter(data, expression, advancedConfig);
```

### Environment-Based Configuration

```typescript
const getConfig = (): FilterOptions => {
  const env = process.env.NODE_ENV;

  return {
    caseSensitive: env === 'production',
    maxDepth: env === 'development' ? 5 : 3,
    enableCache: env === 'production',
  };
};

filter(data, expression, getConfig());
```

## See Also

- [Memoization](/guide/memoization) - Caching and performance
- [Nested Objects](/guide/nested-objects) - maxDepth usage
- [Wildcards](/guide/wildcards) - Case sensitivity
- [Performance Benchmarks](/advanced/performance-benchmarks) - Optimization tips

