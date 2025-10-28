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

See [Debug Mode Guide](/guide/debug) for complete documentation.

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

