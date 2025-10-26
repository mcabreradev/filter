# Examples

This directory contains comprehensive examples demonstrating the usage of `@mcabreradev/filter` v5.1.0.

## Running Examples

### TypeScript Examples

To run the TypeScript examples with ts-node:

```bash
pnpm install -g ts-node
ts-node examples/operators-examples.ts
```

### Compiled Examples

1. Build the project:
   ```bash
   pnpm run build
   ```

2. Compile the examples:
   ```bash
   tsc examples/operators-examples.ts --outDir examples/dist --esModuleInterop
   ```

3. Run the compiled example:
   ```bash
   node examples/dist/operators-examples.js
   ```

## Available Examples

### `autocomplete-demo.ts`

Interactive examples demonstrating intelligent autocomplete for operators:

- **Type-Based Suggestions**: TypeScript suggests only valid operators for each property type
- **Number Operators**: Autocomplete for `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`
- **String Operators**: Autocomplete for `$startsWith`, `$endsWith`, `$contains`, `$regex`, `$match`
- **Array Operators**: Autocomplete for `$in`, `$nin`, `$contains`, `$size`
- **Boolean Operators**: Autocomplete for `$eq`, `$ne`
- **Date Operators**: Autocomplete for date comparison operators
- **Combined Examples**: Multiple operators with intelligent suggestions

### `operators-examples.ts`

Comprehensive examples showcasing all v5.0.0 operators:

- **Comparison Operators**: `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`
- **Array Operators**: `$in`, `$nin`, `$contains`, `$size`
- **String Operators**: `$startsWith`, `$endsWith`, `$contains`
- **Combined Operators**: Multiple operators on same/different properties
- **Mixed Syntax**: Operators combined with legacy v3.x syntax
- **Real-World Scenarios**: E-commerce, inventory, and search use cases

### `lazy-evaluation-examples.ts` (v5.1.0+)

Comprehensive examples showcasing lazy evaluation features:

- **Basic Lazy Filtering**: Using `filterLazy` for on-demand processing
- **Early Exit Optimization**: Using `filterFirst` to stop after N matches
- **Existence Checks**: Using `filterExists` for fast boolean checks
- **Counting**: Using `filterCount` without creating result arrays
- **Chunked Processing**: Using `filterChunked` and `filterLazyChunked` for batch operations
- **Lazy Composition**: Combining `take`, `skip`, `map`, and other utilities
- **Pagination**: Building efficient pagination with lazy operations
- **Async Streams**: Using `filterLazyAsync` for async iterables
- **Performance Comparison**: Benchmarking lazy vs standard filtering
- **Memory Efficiency**: Demonstrating memory savings with large datasets

### `memoization-examples.ts` (v5.2.0+)

Comprehensive examples showcasing the multi-layer memoization strategy:

- **Basic Result Caching**: Demonstrating 530x speedup with cached results
- **Predicate Caching**: Reusing compiled predicates across different arrays
- **Regex Pattern Caching**: Automatic caching of compiled regex patterns
- **Cache Statistics**: Monitoring cache size and effectiveness
- **Complex Query Caching**: Caching nested and complex expressions
- **Lazy + Cache Combination**: Combining lazy evaluation with caching
- **Cache Management**: Clearing caches and managing memory
- **Performance Comparison**: Benchmarking with/without caching (100 iterations)

## Example Output

Running `operators-examples.ts` will output filtered results for 20 different scenarios, demonstrating:

1. Price range filtering
2. Date-based filtering
3. Category inclusion/exclusion
4. Tag-based searching
5. Name pattern matching
6. Complex multi-condition queries
7. Performance optimization patterns

## Memoization Examples

### Basic Result Caching

```typescript
import { filter } from '@mcabreradev/filter';

const products = [
  { id: 1, name: 'Laptop', price: 1200, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 25, category: 'Electronics' },
  { id: 3, name: 'Desk', price: 300, category: 'Furniture' },
];

console.time('first');
const electronics1 = filter(
  products,
  { category: 'Electronics' },
  { enableCache: true }
);
console.timeEnd('first');

console.time('cached');
const electronics2 = filter(
  products,
  { category: 'Electronics' },
  { enableCache: true }
);
console.timeEnd('cached');
```

### Predicate Caching Across Arrays

```typescript
import { filter } from '@mcabreradev/filter';

const users1 = [/* 5,000 users */];
const users2 = [/* 3,000 different users */];
const query = { age: { $gte: 18 }, active: true };

filter(users1, query, { enableCache: true });

filter(users2, query, { enableCache: true });
```

### Regex Pattern Caching

```typescript
import { filter } from '@mcabreradev/filter';

const users = [/* users */];
const customers = [/* customers */];
const admins = [/* admins */];

const emailPattern = { email: { $regex: '^[a-z]+@example\\.com$' } };

filter(users, emailPattern);

filter(customers, emailPattern);
filter(admins, emailPattern);
```

### Cache Management

```typescript
import { filter, clearFilterCache, getFilterCacheStats } from '@mcabreradev/filter';

const data = [/* large dataset */];

filter(data, { status: 'active' }, { enableCache: true });

const stats = getFilterCacheStats();
console.log('Predicates cached:', stats.predicateCacheSize);
console.log('Regex patterns cached:', stats.regexCacheSize);

clearFilterCache();
```

### Real-World: E-commerce Dashboard

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

class ProductDashboard {
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

  getAffordable(): Product[] {
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

  refreshData(newProducts: Product[]): void {
    this.products = newProducts;
    clearFilterCache();
  }
}

const dashboard = new ProductDashboard(products);

dashboard.getElectronics();
dashboard.getAffordable();
dashboard.getTopRated();

dashboard.getElectronics();
dashboard.getAffordable();
dashboard.getTopRated();
```

### Combining Caching with Lazy Evaluation

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
```

### Performance Monitoring

```typescript
import { filter, getFilterCacheStats, clearFilterCache } from '@mcabreradev/filter';

class PerformanceMonitor {
  private queryCount = 0;
  private cacheHits = 0;

  query<T>(data: T[], expression: any): T[] {
    this.queryCount++;

    const startTime = performance.now();
    const result = filter(data, expression, { enableCache: true });
    const endTime = performance.now();

    if (endTime - startTime < 0.1) {
      this.cacheHits++;
    }

    return result;
  }

  getStats() {
    const cacheStats = getFilterCacheStats();
    return {
      totalQueries: this.queryCount,
      cacheHits: this.cacheHits,
      hitRate: (this.cacheHits / this.queryCount * 100).toFixed(2) + '%',
      predicateCacheSize: cacheStats.predicateCacheSize,
      regexCacheSize: cacheStats.regexCacheSize
    };
  }

  reset() {
    this.queryCount = 0;
    this.cacheHits = 0;
    clearFilterCache();
  }
}

const monitor = new PerformanceMonitor();

monitor.query(products, { category: 'Electronics' });
monitor.query(products, { category: 'Electronics' });
monitor.query(products, { price: { $gte: 100 } });

console.log(monitor.getStats());
```

## Further Reading

- [Full Operators Guide](../docs/OPERATORS.md)
- [Advanced Regex Patterns](../docs/OPERATORS.md#advanced-regex-patterns)
- [Lazy Evaluation Guide](../docs/LAZY_EVALUATION.md)
- [Memoization Guide](../docs/MEMOIZATION.md)
- [Advanced Logical Operators](../docs/ADVANCED_LOGICAL_OPERATORS.md)
- [Performance Benchmarks](../docs/PERFORMANCE_BENCHMARKS.md)
- [Security Best Practices](../docs/SECURITY.md)
- [Migration Guide](../docs/MIGRATION.md)
- [Main README](../README.md)

