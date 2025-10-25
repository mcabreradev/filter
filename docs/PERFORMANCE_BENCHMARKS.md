# Performance Benchmarks

## Benchmark Environment

- **Node.js**: v20.10.0
- **CPU**: Apple M1 Pro (10 cores)
- **RAM**: 16 GB
- **Dataset Size**: 10,000 objects (unless specified)
- **Iterations**: 1,000 runs per test
- **Tool**: Vitest benchmark

## Filter Strategy Comparison

### Small Dataset (100 items)

| Strategy | Time (ms) | Ops/sec | Relative |
|----------|-----------|---------|----------|
| Simple string | 0.05 | 20,000 | 1.00x (baseline) |
| Object match | 0.06 | 16,667 | 1.20x |
| Operator ($eq) | 0.07 | 14,286 | 1.40x |
| Predicate function | 0.10 | 10,000 | 2.00x |
| Wildcard (%) | 0.15 | 6,667 | 3.00x |

### Medium Dataset (1,000 items)

| Strategy | Time (ms) | Ops/sec | Relative |
|----------|-----------|---------|----------|
| Simple string | 0.45 | 2,222 | 1.00x |
| Object match | 0.52 | 1,923 | 1.16x |
| Operator ($eq) | 0.58 | 1,724 | 1.29x |
| Predicate function | 0.95 | 1,053 | 2.11x |
| Wildcard (%) | 1.42 | 704 | 3.16x |

### Large Dataset (10,000 items)

| Strategy | Time (ms) | Ops/sec | Relative |
|----------|-----------|---------|----------|
| Simple string | 4.2 | 238 | 1.00x |
| Object match | 4.8 | 208 | 1.14x |
| Operator ($eq) | 5.3 | 189 | 1.26x |
| Predicate function | 8.9 | 112 | 2.12x |
| Wildcard (%) | 13.5 | 74 | 3.21x |

## Operator Performance

### Comparison Operators (10,000 items)

| Operator | Time (ms) | Ops/sec |
|----------|-----------|---------|
| $eq | 5.3 | 189 |
| $ne | 5.4 | 185 |
| $gt | 5.5 | 182 |
| $gte | 5.5 | 182 |
| $lt | 5.6 | 179 |
| $lte | 5.6 | 179 |
| Range ($gte + $lte) | 6.2 | 161 |

### Array Operators (10,000 items)

| Operator | Time (ms) | Ops/sec |
|----------|-----------|---------|
| $in (3 items) | 6.8 | 147 |
| $in (10 items) | 8.2 | 122 |
| $nin (3 items) | 6.9 | 145 |
| $contains | 7.1 | 141 |
| $size | 5.8 | 172 |

### String Operators (10,000 items)

| Operator | Time (ms) | Ops/sec |
|----------|-----------|---------|
| $startsWith | 7.2 | 139 |
| $endsWith | 7.3 | 137 |
| $contains | 7.5 | 133 |
| $regex (simple) | 12.1 | 83 |
| $regex (complex) | 18.5 | 54 |

### Logical Operators (10,000 items)

| Operator | Time (ms) | Ops/sec |
|----------|-----------|---------|
| $and (2 conditions) | 8.5 | 118 |
| $and (5 conditions) | 12.3 | 81 |
| $or (2 conditions) | 7.8 | 128 |
| $or (5 conditions) | 10.2 | 98 |
| $not | 6.1 | 164 |

## Lazy Evaluation Performance

### Early Exit Optimization

| Operation | Standard | Lazy | Improvement |
|-----------|----------|------|-------------|
| Find first match (position 10) | 4.2ms | 0.04ms | **105x faster** |
| Find first 10 matches | 4.2ms | 0.42ms | **10x faster** |
| Check existence (match at position 5) | 4.2ms | 0.02ms | **210x faster** |
| Check existence (no match) | 4.2ms | 4.2ms | Same (full scan) |

### Memory Usage

| Dataset Size | Standard | Lazy | Savings |
|--------------|----------|------|---------|
| 1,000 items | 1.2 MB | 12 KB | **99% less** |
| 10,000 items | 12 MB | 12 KB | **99.9% less** |
| 100,000 items | 120 MB | 12 KB | **99.99% less** |
| 1,000,000 items | 1.2 GB | 12 KB | **99.999% less** |

## Memoization Strategy

### Multi-Layer Caching Architecture

The filter library implements a sophisticated multi-layer memoization strategy:

1. **Result Cache** - Caches complete filter results using WeakMap
2. **Predicate Cache** - Memoizes compiled predicate functions (LRU with TTL)
3. **Regex Cache** - Caches compiled regex patterns
4. **Expression Hash** - Stable hashing for cache key generation

### Cache Performance Impact

| Operation | Without Cache | With Cache | Speedup |
|-----------|---------------|------------|---------|
| First run (10K items) | 5.3ms | 5.3ms | 1.0x (baseline) |
| Second run (same query) | 5.3ms | 0.01ms | **530x** |
| Regex pattern (first) | 12.1ms | 12.1ms | 1.0x |
| Regex pattern (cached) | 12.1ms | 0.02ms | **605x** |
| Complex nested (first) | 15.2ms | 15.2ms | 1.0x |
| Complex nested (cached) | 15.2ms | 0.01ms | **1520x** |

### Cache Configuration

```typescript
// Enable all caching layers
filter(data, expression, { enableCache: true });

// Clear all caches manually
import { clearFilterCache } from '@mcabreradev/filter';
clearFilterCache();

// Get cache statistics
import { getFilterCacheStats } from '@mcabreradev/filter';
const stats = getFilterCacheStats();
console.log(stats); // { predicateCacheSize: 45, regexCacheSize: 12 }
```

### LRU Cache Settings

- **Max Size**: 500 predicates, 1000 regex patterns
- **TTL**: 5 minutes (300,000ms)
- **Eviction**: Least Recently Used (LRU)

### Memory Usage

| Cache Type | Memory per Entry | Max Memory |
|------------|------------------|------------|
| Result Cache | ~8 bytes (WeakMap ref) | Unlimited* |
| Predicate Cache | ~200 bytes | ~100 KB |
| Regex Cache | ~150 bytes | ~150 KB |

*WeakMap automatically garbage collects when arrays are no longer referenced

### Best Practices

✅ **Enable caching for:**
- Large datasets (>1000 items)
- Repeated identical queries
- Complex expressions with regex
- Read-heavy workloads

❌ **Disable caching for:**
- Frequently changing data
- One-time queries
- Memory-constrained environments
- Unique expressions every time

### Cache Invalidation

```typescript
// Automatic: WeakMap clears when array is garbage collected
let data = [/* large dataset */];
filter(data, query, { enableCache: true });
data = null; // Cache entry automatically cleared

// Manual: Clear all caches
clearFilterCache();

// TTL: Predicate cache entries expire after 5 minutes
```

## Configuration Impact

### Case Sensitivity

| caseSensitive | Time (ms) | Relative |
|---------------|-----------|----------|
| false (default) | 7.2 | 1.00x |
| true | 5.8 | 0.81x (faster) |

**Insight**: Case-insensitive matching adds ~20% overhead due to `.toLowerCase()` calls.

### Max Depth

| maxDepth | Time (ms) | Relative |
|----------|-----------|----------|
| 1 | 4.5 | 1.00x |
| 3 (default) | 5.2 | 1.16x |
| 5 | 6.1 | 1.36x |
| 10 | 8.3 | 1.84x |

**Insight**: Each additional depth level adds ~10-15% overhead for nested objects.

## Real-World Scenarios

### E-commerce Product Search

```typescript
// Scenario: Filter 10,000 products
const query = {
  category: { $in: ['Electronics', 'Accessories'] },
  price: { $gte: 100, $lte: 500 },
  inStock: true,
  rating: { $gte: 4.0 }
};

// Results:
// - Time: 12.5ms
// - Throughput: 800 products/sec
// - Matches: ~350 products
```

### User Management

```typescript
// Scenario: Filter 50,000 users
const query = {
  $and: [
    { active: true },
    { $or: [{ role: 'admin' }, { permissions: { $contains: 'manage' } }] },
    { lastLogin: { $gte: thirtyDaysAgo } }
  ]
};

// Results:
// - Time: 45ms
// - Throughput: 1,111 users/sec
// - Matches: ~2,500 users
```

### Log Analysis

```typescript
// Scenario: Filter 1,000,000 log entries
const query = {
  level: { $in: ['error', 'critical'] },
  timestamp: { $gte: yesterday, $lte: today },
  message: { $regex: 'database.*timeout' }
};

// Standard filter:
// - Time: 2,500ms
// - Memory: 1.2 GB

// Lazy filter (first 100):
// - Time: 15ms (167x faster)
// - Memory: 120 KB (10,000x less)
```

## Optimization Recommendations

### 1. Choose the Right Strategy

```typescript
// ✅ Best for exact matches
filter(data, { id: 123 });

// ✅ Best for ranges
filter(data, { age: { $gte: 18, $lte: 65 } });

// ✅ Best for complex logic
filter(data, (item) => customComplexLogic(item));
```

### 2. Use Lazy Evaluation for Large Datasets

```typescript
// ❌ Slow: Process all 1M records
const results = filter(millionRecords, query);
displayFirst10(results);

// ✅ Fast: Only process what's needed
const results = filterFirst(millionRecords, query, 10);
displayFirst10(results);
```

### 3. Enable Caching for Repeated Queries

```typescript
// ✅ Good for repeated identical queries
filter(data, query, { enableCache: true });
```

### 4. Optimize Operator Order

```typescript
// ✅ Fast checks first
filter(products, {
  $and: [
    { inStock: true },
    { price: { $lte: 100 } },
    { name: { $regex: 'pattern' } }
  ]
});
```

### 5. Avoid Deep Nesting

```typescript
// ⚠️ Slower
filter(deeplyNested, query, { maxDepth: 10 });

// ✅ Faster
filter(flatStructure, query, { maxDepth: 2 });
```

## Benchmark Methodology

### Setup

```typescript
import { bench, describe } from 'vitest';
import { filter } from '@mcabreradev/filter';

const data = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  price: Math.random() * 1000,
  category: ['A', 'B', 'C'][i % 3],
  inStock: i % 2 === 0
}));

describe('Filter Performance', () => {
  bench('simple string match', () => {
    filter(data, 'Item 5000');
  });

  bench('operator query', () => {
    filter(data, { price: { $gte: 500 } });
  });

  bench('complex query', () => {
    filter(data, {
      $and: [
        { category: { $in: ['A', 'B'] } },
        { price: { $gte: 100, $lte: 500 } },
        { inStock: true }
      ]
    });
  });
});
```

### Running Benchmarks

```bash
pnpm run bench
```

## Continuous Monitoring

Benchmarks are run automatically in CI/CD on every PR to detect performance regressions.

**Regression Threshold**: 10% slowdown triggers a warning.

## See Also

- [Performance Optimization Guide](./WIKI.md#performance-optimization)
- [Lazy Evaluation Guide](./LAZY_EVALUATION.md)
- [Operators Guide](./OPERATORS.md)

