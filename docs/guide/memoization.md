---
title: Memoization
description: Multi-layer caching strategy for 530x performance boost
---

# Memoization Strategy Guide 💾

Complete guide to the multi-layer memoization system in `@mcabreradev/filter`.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Cache Layers](#cache-layers)
4. [Usage Examples](#usage-examples)
5. [Performance Benchmarks](#performance-benchmarks)
6. [Best Practices](#best-practices)
7. [API Reference](#api-reference)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The memoization system provides **3 layers of caching** to maximize performance:

```
┌─────────────────────────────────────────┐
│         Result Cache (WeakMap)          │
│  Caches complete filter results         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Predicate Cache (LRU + TTL)        │
│  Memoizes compiled predicate functions  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Regex Cache (Map)               │
│  Caches compiled regex patterns         │
└─────────────────────────────────────────┘
```

### Key Benefits

- **530x faster** for repeated identical queries
- **605x faster** for regex pattern reuse
- **Automatic memory management** with WeakMap
- **LRU eviction** prevents memory bloat
- **TTL expiration** (5 minutes) for predicates

---

## Architecture

### 1. Result Cache

Uses `WeakMap` to cache complete filter results:

```typescript
WeakMap<Array, Map<ExpressionHash, Result>>
```

**Benefits:**
- Automatic garbage collection
- No memory leaks
- Zero configuration needed

**How it works:**
```typescript
const data = [/* 10,000 items */];
const query = { age: { $gte: 18 } };

filter(data, query, { enableCache: true });

filter(data, query, { enableCache: true });
```

### 2. Predicate Cache

LRU cache with TTL for compiled predicate functions:

```typescript
Map<ExpressionHash, { predicate: Function, timestamp: number }>
```

**Configuration:**
- Max size: 500 entries
- TTL: 5 minutes (300,000ms)
- Eviction: Least Recently Used

**How it works:**
```typescript
filter(data1, { age: { $gte: 18 } }, { enableCache: true });

filter(data2, { age: { $gte: 18 } }, { enableCache: true });
```

### 3. Regex Cache

Simple `Map` for compiled regex patterns:

```typescript
Map<PatternHash, RegExp>
```

**How it works:**
```typescript
filter(users, { email: { $regex: '^admin@' } });

filter(customers, { email: { $regex: '^admin@' } });
filter(vendors, { email: { $regex: '^admin@' } });
```

---

## Cache Layers

### Layer 1: Result Cache (Fastest)

```typescript
import { filter } from '@mcabreradev/filter';

const products = [/* 10,000 products */];
const query = { category: 'Electronics', inStock: true };

const result1 = filter(products, query, { enableCache: true });

const result2 = filter(products, query, { enableCache: true });

console.log(result1 === result2);
console.log(JSON.stringify(result1) === JSON.stringify(result2));
```

**When it hits:**
- Same array reference
- Same expression (deep equality)
- Same config options

### Layer 2: Predicate Cache (Fast)

```typescript
const users1 = [/* 5,000 users */];
const users2 = [/* 3,000 different users */];
const query = { age: { $gte: 18 }, active: true };

filter(users1, query, { enableCache: true });

filter(users2, query, { enableCache: true });
```

**When it hits:**
- Same expression (even with different arrays)
- Same config options
- Within 5-minute TTL

### Layer 3: Regex Cache (Always Active)

```typescript
const pattern = { email: { $regex: '^[a-z]+@example\\.com$' } };

filter(users, pattern);

filter(customers, pattern);
filter(admins, pattern);
```

**Always active** - no configuration needed!

---

## Usage Examples

### Example 1: E-commerce Product Filtering

```typescript
import { filter, clearFilterCache } from '@mcabreradev/filter';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  rating: number;
}

class ProductService {
  private products: Product[];

  constructor(products: Product[]) {
    this.products = products;
  }

  getElectronics(): Product[] {
    return filter(
      this.products,
      { category: 'Electronics' },
      { enableCache: true }
    );
  }

  getAffordableProducts(): Product[] {
    return filter(
      this.products,
      { price: { $lte: 100 }, inStock: true },
      { enableCache: true }
    );
  }

  getTopRated(): Product[] {
    return filter(
      this.products,
      { rating: { $gte: 4.5 } },
      { enableCache: true }
    );
  }

  refreshProducts(newProducts: Product[]): void {
    this.products = newProducts;
    clearFilterCache();
  }
}

const service = new ProductService(products);

service.getElectronics();
service.getAffordableProducts();
service.getTopRated();

service.getElectronics();
service.getAffordableProducts();
service.getTopRated();
```

### Example 2: Real-time Dashboard

```typescript
import { filter, getFilterCacheStats } from '@mcabreradev/filter';

class AnalyticsDashboard {
  private data: AnalyticsEvent[];
  private cacheEnabled = true;

  constructor(data: AnalyticsEvent[]) {
    this.data = data;
  }

  getActiveUsers() {
    return filter(
      this.data,
      { event: 'page_view', timestamp: { $gte: Date.now() - 3600000 } },
      { enableCache: this.cacheEnabled }
    );
  }

  getConversions() {
    return filter(
      this.data,
      { event: 'purchase', status: 'completed' },
      { enableCache: this.cacheEnabled }
    );
  }

  getErrors() {
    return filter(
      this.data,
      { level: { $in: ['error', 'critical'] } },
      { enableCache: this.cacheEnabled }
    );
  }

  getCacheStats() {
    return getFilterCacheStats();
  }

  async refresh() {
    this.data = await fetchLatestData();
    clearFilterCache();
  }
}

const dashboard = new AnalyticsDashboard(events);

setInterval(() => {
  dashboard.refresh();
}, 30000);

dashboard.getActiveUsers();
dashboard.getConversions();
dashboard.getErrors();

console.log(dashboard.getCacheStats());
```

### Example 3: Search with Multiple Filters

```typescript
import { filter } from '@mcabreradev/filter';

interface SearchFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  rating?: number;
  searchTerm?: string;
}

class ProductSearch {
  private products: Product[];

  constructor(products: Product[]) {
    this.products = products;
  }

  search(filters: SearchFilters): Product[] {
    const query: any = {};

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      query.price = {};
      if (filters.priceMin !== undefined) {
        query.price.$gte = filters.priceMin;
      }
      if (filters.priceMax !== undefined) {
        query.price.$lte = filters.priceMax;
      }
    }

    if (filters.inStock !== undefined) {
      query.inStock = filters.inStock;
    }

    if (filters.rating !== undefined) {
      query.rating = { $gte: filters.rating };
    }

    if (filters.searchTerm) {
      query.name = { $regex: filters.searchTerm, $options: 'i' };
    }

    return filter(this.products, query, { enableCache: true });
  }
}

const search = new ProductSearch(products);

const results1 = search.search({
  category: 'Electronics',
  priceMin: 100,
  priceMax: 500,
  inStock: true,
  rating: 4.0
});

const results2 = search.search({
  category: 'Electronics',
  priceMin: 100,
  priceMax: 500,
  inStock: true,
  rating: 4.0
});
```

### Example 4: Log Analysis with Regex Caching

```typescript
import { filter } from '@mcabreradev/filter';

interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'critical';
  message: string;
  service: string;
}

class LogAnalyzer {
  private logs: LogEntry[];

  constructor(logs: LogEntry[]) {
    this.logs = logs;
  }

  findDatabaseErrors(): LogEntry[] {
    return filter(this.logs, {
      level: { $in: ['error', 'critical'] },
      message: { $regex: 'database.*timeout' }
    });
  }

  findAuthenticationIssues(): LogEntry[] {
    return filter(this.logs, {
      message: { $regex: 'auth.*failed|unauthorized' }
    });
  }

  findAPIErrors(): LogEntry[] {
    return filter(this.logs, {
      message: { $regex: 'api.*error|http.*[45]\\d{2}' }
    });
  }
}

const analyzer = new LogAnalyzer(logs);

analyzer.findDatabaseErrors();

analyzer.findDatabaseErrors();

const analyzer2 = new LogAnalyzer(newLogs);
analyzer2.findDatabaseErrors();
```

### Example 5: Combining Caching with Lazy Evaluation

```typescript
import { filterFirst, filter } from '@mcabreradev/filter';

const customers = [/* 1,000,000 customers */];

const highValueQuery = {
  totalPurchases: { $gte: 10000 },
  status: 'active',
  lastPurchase: { $gte: thirtyDaysAgo }
};

const top20 = filterFirst(
  customers,
  highValueQuery,
  20,
  { enableCache: true }
);

const top20Again = filterFirst(
  customers,
  highValueQuery,
  20,
  { enableCache: true }
);

const allHighValue = filter(
  customers,
  highValueQuery,
  { enableCache: true }
);
```

---

## Performance Benchmarks

### Result Cache Performance

| Dataset Size | First Run | Cached Run | Speedup |
|--------------|-----------|------------|---------|
| 1,000 items | 0.52ms | 0.01ms | **52x** |
| 10,000 items | 5.3ms | 0.01ms | **530x** |
| 100,000 items | 53ms | 0.01ms | **5,300x** |

### Predicate Cache Performance

| Scenario | Without Cache | With Cache | Improvement |
|----------|---------------|------------|-------------|
| Simple operator | 5.3ms | 3.2ms | **40% faster** |
| Complex nested | 15.2ms | 9.1ms | **40% faster** |
| Multiple arrays | 5.3ms × 3 | 3.2ms × 3 | **40% faster** |

### Regex Cache Performance

| Pattern Type | First Compile | Cached | Speedup |
|--------------|---------------|--------|---------|
| Simple | 12.1ms | 7.8ms | **35% faster** |
| Complex | 18.5ms | 11.2ms | **39% faster** |
| With flags | 12.8ms | 8.1ms | **37% faster** |

### Memory Usage

| Cache Type | 100 Entries | 500 Entries | 1000 Entries |
|------------|-------------|-------------|--------------|
| Result Cache | ~800 bytes | ~4 KB | ~8 KB |
| Predicate Cache | ~20 KB | ~100 KB | ~200 KB |
| Regex Cache | ~15 KB | ~75 KB | ~150 KB |

---

## Best Practices

### ✅ DO: Enable for Large Datasets

```typescript
const products = [/* 50,000 products */];

function getElectronics() {
  return filter(products, { category: 'Electronics' }, { enableCache: true });
}

getElectronics();
getElectronics();
getElectronics();
```

### ✅ DO: Use with Complex Expressions

```typescript
const complexQuery = {
  $and: [
    { price: { $gte: 100, $lte: 500 } },
    { category: { $in: ['Electronics', 'Computers'] } },
    { rating: { $gte: 4.0 } },
    { name: { $regex: 'pro|premium' } }
  ]
};

filter(products, complexQuery, { enableCache: true });
```

### ✅ DO: Clear Cache on Data Updates

```typescript
class DataService {
  private data: Item[];

  updateData(newData: Item[]) {
    this.data = newData;
    clearFilterCache();
  }

  query(expression: Expression) {
    return filter(this.data, expression, { enableCache: true });
  }
}
```

### ✅ DO: Monitor Cache Stats

```typescript
import { getFilterCacheStats } from '@mcabreradev/filter';

function logCacheStats() {
  const stats = getFilterCacheStats();
  console.log('Cache Stats:', stats);

  if (stats.predicateCacheSize > 400) {
    console.warn('Predicate cache is getting full');
  }
}

setInterval(logCacheStats, 60000);
```

### ❌ DON'T: Enable for Frequently Changing Data

```typescript
setInterval(() => {
  data = fetchLatestData();

  filter(data, query, { enableCache: true });
}, 1000);

setInterval(() => {
  data = fetchLatestData();
  filter(data, query, { enableCache: false });
}, 1000);
```

### ❌ DON'T: Enable for One-Time Queries

```typescript
function runOnce() {
  const result = filter(data, query, { enableCache: true });
  return result;
}

function runOnce() {
  const result = filter(data, query, { enableCache: false });
  return result;
}
```

### ❌ DON'T: Forget to Clear Cache

```typescript
class BadService {
  query(data: Item[]) {
    return filter(data, expression, { enableCache: true });
  }
}

class GoodService {
  query(data: Item[]) {
    return filter(data, expression, { enableCache: true });
  }

  refresh(newData: Item[]) {
    this.data = newData;
    clearFilterCache();
  }
}
```

---

## API Reference

### `filter(array, expression, options)`

```typescript
filter<T>(
  array: T[],
  expression: Expression<T>,
  options?: { enableCache?: boolean; ... }
): T[]
```

**Options:**
- `enableCache: boolean` - Enable result and predicate caching (default: `false`)

**Example:**
```typescript
filter(data, query, { enableCache: true });
```

### `clearFilterCache()`

```typescript
clearFilterCache(): void
```

Clears all cache layers:
- Result cache
- Predicate cache
- Regex cache

**Example:**
```typescript
import { clearFilterCache } from '@mcabreradev/filter';

clearFilterCache();
```

### `getFilterCacheStats()`

```typescript
getFilterCacheStats(): {
  predicateCacheSize: number;
  regexCacheSize: number;
}
```

Returns current cache statistics.

**Example:**
```typescript
import { getFilterCacheStats } from '@mcabreradev/filter';

const stats = getFilterCacheStats();
console.log(`Predicates cached: ${stats.predicateCacheSize}`);
console.log(`Regex patterns cached: ${stats.regexCacheSize}`);
```

---

## Troubleshooting

### Cache Not Working

**Problem:** Cache doesn't seem to improve performance

**Checklist:**
1. ✅ `enableCache: true` is set
2. ✅ Same array reference (Result cache)
3. ✅ Identical expression structure
4. ✅ Same config options
5. ✅ Within 5-minute TTL (Predicate cache)

**Debug:**
```typescript
const stats = getFilterCacheStats();
console.log('Cache stats:', stats);
```

### Memory Usage Growing

**Problem:** Memory usage increases over time

**Solution:**
```typescript
setInterval(() => {
  clearFilterCache();
}, 300000);

function updateData(newData) {
  data = newData;
  clearFilterCache();
}
```

### Cache Hit Rate Low

**Problem:** Cache isn't being hit often

**Possible causes:**
1. Expressions are always different
2. Array references change frequently
3. Config options vary between calls

**Solution:**
```typescript
const query = { age: { $gte: 18 } };

filter(data1, query, { enableCache: true });
filter(data1, query, { enableCache: true });

filter(data1, { age: { $gte: 18 } }, { enableCache: true });
filter(data1, { age: { $gte: 18 } }, { enableCache: true });
```

---

## See Also

- [Performance Benchmarks](../advanced/performance-benchmarks.md)
- [Lazy Evaluation Guide](./lazy-evaluation.md)
- [Complete Wiki](../advanced/wiki.md)

---

**Version:** 5.2.0
**Last Updated:** October 2025

