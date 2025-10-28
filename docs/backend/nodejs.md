# Node.js Integration

Learn how to use `@mcabreradev/filter` as a standalone library in Node.js applications for data filtering, API development, and backend processing.

## Installation

```bash
# Using npm
npm install @mcabreradev/filter

# Using yarn
yarn add @mcabreradev/filter

# Using pnpm
pnpm add @mcabreradev/filter
```

**Requirements:**
- Node.js >= 20
- TypeScript >= 5.0 (optional, for type safety)

---

## Quick Start

### Basic Usage

```typescript
// ESM (recommended)
import { filter } from '@mcabreradev/filter';

// CommonJS
const { filter } = require('@mcabreradev/filter');

const users = [
  { name: 'Alice', age: 30, role: 'admin', active: true },
  { name: 'Bob', age: 25, role: 'user', active: true },
  { name: 'Charlie', age: 35, role: 'user', active: false }
];

// Simple filtering
const activeUsers = filter(users, { active: true });
console.log(activeUsers);
// → [{ name: 'Alice', ... }, { name: 'Bob', ... }]

// MongoDB-style operators
const youngUsers = filter(users, {
  age: { $lt: 30 },
  active: true
});
console.log(youngUsers);
// → [{ name: 'Bob', age: 25, ... }]
```

### TypeScript Support

Full type safety with TypeScript:

```typescript
import { filter, type Expression, type FilterOptions } from '@mcabreradev/filter';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: 'admin' | 'user' | 'guest';
  active: boolean;
  metadata?: Record<string, unknown>;
}

const users: User[] = [...];

// Type-safe filtering
const admins = filter<User>(users, {
  role: 'admin',
  active: true
});
// admins is User[]

// Type-safe expressions
const ageFilter: Expression<User> = {
  age: { $gte: 18, $lt: 65 }
};

const adults = filter<User>(users, ageFilter);
```

---

## Common Use Cases

### 1. API Response Filtering

Filter data before sending API responses:

```typescript
import { filter } from '@mcabreradev/filter';
import type { Request, Response } from 'express';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  rating: number;
}

async function getProducts(req: Request, res: Response) {
  const allProducts: Product[] = await db.products.findAll();
  
  // Parse query parameters
  const {
    category,
    minPrice,
    maxPrice,
    inStock,
    minRating,
    search
  } = req.query;
  
  // Build filter expression
  let expression: Expression<Product> = {};
  
  if (category) {
    expression.category = category as string;
  }
  
  if (minPrice || maxPrice) {
    expression.price = {};
    if (minPrice) expression.price.$gte = Number(minPrice);
    if (maxPrice) expression.price.$lte = Number(maxPrice);
  }
  
  if (inStock === 'true') {
    expression.inStock = true;
  }
  
  if (minRating) {
    expression.rating = { $gte: Number(minRating) };
  }
  
  if (search) {
    expression.name = { $contains: search as string };
  }
  
  // Apply filters
  const filtered = filter(allProducts, expression);
  
  res.json({
    total: filtered.length,
    products: filtered
  });
}
```

### 2. Data Processing Pipeline

Process large datasets efficiently:

```typescript
import { filter, filterLazy, filterCount } from '@mcabreradev/filter';
import fs from 'fs/promises';

interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

async function analyzeLogs(filePath: string) {
  const rawData = await fs.readFile(filePath, 'utf-8');
  const logs: LogEntry[] = JSON.parse(rawData);
  
  // Count errors
  const errorCount = filterCount(logs, { level: 'error' });
  
  // Get recent warnings
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentWarnings = filter(logs, {
    level: 'warn',
    timestamp: { $gte: oneHourAgo }
  });
  
  // Find critical errors (lazy evaluation for memory efficiency)
  const criticalErrors = [];
  for (const log of filterLazy(logs, {
    level: 'error',
    message: { $contains: 'critical' }
  })) {
    criticalErrors.push(log);
    if (criticalErrors.length >= 100) break; // Early exit
  }
  
  return {
    totalLogs: logs.length,
    errorCount,
    recentWarnings: recentWarnings.length,
    criticalErrors
  };
}
```

### 3. Database Query Builder

Build database queries from user input:

```typescript
import { filter } from '@mcabreradev/filter';

interface QueryParams {
  status?: string[];
  createdAfter?: string;
  createdBefore?: string;
  search?: string;
  tags?: string[];
}

function buildQuery(params: QueryParams) {
  const expression: Record<string, unknown> = {};
  
  if (params.status && params.status.length > 0) {
    expression.status = { $in: params.status };
  }
  
  if (params.createdAfter || params.createdBefore) {
    expression.createdAt = {};
    if (params.createdAfter) {
      expression.createdAt.$gte = new Date(params.createdAfter);
    }
    if (params.createdBefore) {
      expression.createdAt.$lte = new Date(params.createdBefore);
    }
  }
  
  if (params.search) {
    expression.$or = [
      { title: { $contains: params.search } },
      { description: { $contains: params.search } }
    ];
  }
  
  if (params.tags && params.tags.length > 0) {
    expression.tags = { $contains: params.tags[0] };
  }
  
  return expression;
}

// Usage
async function searchDocuments(params: QueryParams) {
  const documents = await db.documents.findAll();
  const query = buildQuery(params);
  return filter(documents, query);
}
```

### 4. Batch Processing

Process large datasets in chunks:

```typescript
import { filterLazy } from '@mcabreradev/filter';

interface Order {
  id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  createdAt: Date;
}

async function processPendingOrders(orders: Order[]) {
  const batchSize = 100;
  let batch: Order[] = [];
  
  // Use lazy evaluation for memory efficiency
  for (const order of filterLazy(orders, {
    status: 'pending',
    amount: { $gte: 100 }
  })) {
    batch.push(order);
    
    if (batch.length >= batchSize) {
      await processOrderBatch(batch);
      batch = [];
    }
  }
  
  // Process remaining orders
  if (batch.length > 0) {
    await processOrderBatch(batch);
  }
}

async function processOrderBatch(orders: Order[]): Promise<void> {
  // Batch processing logic
  console.log(`Processing ${orders.length} orders...`);
  // await api.batchProcess(orders);
}
```

### 5. Configuration Validation

Validate and filter configuration objects:

```typescript
import { filter, validateExpression } from '@mcabreradev/filter';

interface Config {
  name: string;
  enabled: boolean;
  priority: number;
  environment: 'dev' | 'staging' | 'prod';
  features: string[];
}

function loadValidConfigs(configs: Config[]): Config[] {
  try {
    // Validate expression
    const expression = validateExpression({
      enabled: true,
      priority: { $gte: 1 },
      environment: { $in: ['staging', 'prod'] }
    });
    
    return filter(configs, expression);
  } catch (error) {
    console.error('Invalid filter expression:', error);
    throw error;
  }
}

// Usage
const configs: Config[] = [
  { name: 'Feature A', enabled: true, priority: 5, environment: 'prod', features: ['auth'] },
  { name: 'Feature B', enabled: false, priority: 3, environment: 'dev', features: ['beta'] },
  { name: 'Feature C', enabled: true, priority: 8, environment: 'staging', features: ['new'] }
];

const validConfigs = loadValidConfigs(configs);
console.log(validConfigs);
// → [{ name: 'Feature A', ... }, { name: 'Feature C', ... }]
```

---

## Performance Optimization

### 1. Enable Caching

Use caching for repeated queries on large datasets:

```typescript
import { filter, clearFilterCache, getFilterCacheStats } from '@mcabreradev/filter';

const largeDataset = [...]; // 100,000+ items

// Enable caching
const result1 = filter(largeDataset, {
  category: 'Electronics',
  price: { $gte: 100 }
}, { enableCache: true });

// Subsequent calls use cache (530x-1520x faster)
const result2 = filter(largeDataset, {
  category: 'Electronics',
  price: { $gte: 100 }
}, { enableCache: true });

// Check cache stats
const stats = getFilterCacheStats();
console.log(`Cache hit rate: ${(stats.hitRate * 100).toFixed(2)}%`);

// Clear cache when data changes
clearFilterCache();
```

### 2. Lazy Evaluation

Use lazy evaluation for large datasets:

```typescript
import { filterLazy, filterFirst, filterExists, filterCount } from '@mcabreradev/filter';

const millionRecords = [...]; // 1,000,000+ items

// Get first 100 matches (500x faster than regular filter)
const first100 = filterFirst(millionRecords, {
  active: true,
  premium: true
}, 100);

// Check if any match exists (early exit)
const hasActiveAdmin = filterExists(millionRecords, {
  role: 'admin',
  active: true
});

// Count matches without loading all
const activeCount = filterCount(millionRecords, { active: true });

// Process items on-demand
for (const item of filterLazy(millionRecords, { needsProcessing: true })) {
  await processItem(item);
  if (shouldStop()) break; // Early exit
}
```

### 3. Optimize Expressions

Structure expressions for better performance:

```typescript
// ✅ Good: Specific conditions first
filter(data, {
  status: 'active',      // Fast equality check
  premium: true,         // Fast boolean check
  name: { $contains: 'search' }  // Slower regex last
});

// ⚠️ Less optimal: Expensive operations first
filter(data, {
  name: { $regex: /complex.*pattern/ },
  status: 'active'
});

// ✅ Good: Use $in for multiple values
filter(data, {
  category: { $in: ['Electronics', 'Books', 'Music'] }
});

// ⚠️ Less optimal: Multiple $or conditions
filter(data, {
  $or: [
    { category: 'Electronics' },
    { category: 'Books' },
    { category: 'Music' }
  ]
});
```

---

## Error Handling

### Validation Errors

```typescript
import { filter, validateExpression, validateOptions } from '@mcabreradev/filter';

try {
  // Validate expression
  const expression = validateExpression({
    age: { $gte: 18 },
    status: { $in: ['active', 'pending'] }
  });
  
  // Validate options
  const options = validateOptions({
    caseSensitive: true,
    maxDepth: 5,
    enableCache: true
  });
  
  const result = filter(data, expression, options);
} catch (error) {
  if (error instanceof Error) {
    console.error('Validation error:', error.message);
  }
}
```

### Safe Filtering

```typescript
function safeFilter<T>(
  data: T[],
  expression: unknown,
  options?: unknown
): { success: true; data: T[] } | { success: false; error: string } {
  try {
    const validExpression = validateExpression(expression);
    const validOptions = options ? validateOptions(options) : undefined;
    
    const result = filter(data, validExpression, validOptions);
    
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Usage
const result = safeFilter(users, { age: { $gte: 18 } });

if (result.success) {
  console.log('Filtered data:', result.data);
} else {
  console.error('Filter failed:', result.error);
}
```

---

## Testing

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { filter } from '@mcabreradev/filter';

interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

describe('User Filtering', () => {
  const users: User[] = [
    { id: 1, name: 'Alice', age: 30, active: true },
    { id: 2, name: 'Bob', age: 25, active: true },
    { id: 3, name: 'Charlie', age: 35, active: false }
  ];
  
  it('should filter active users', () => {
    const result = filter(users, { active: true });
    expect(result).toHaveLength(2);
    expect(result.every(u => u.active)).toBe(true);
  });
  
  it('should filter by age range', () => {
    const result = filter(users, {
      age: { $gte: 25, $lte: 30 }
    });
    expect(result).toHaveLength(2);
    expect(result.map(u => u.name)).toEqual(['Alice', 'Bob']);
  });
  
  it('should handle empty results', () => {
    const result = filter(users, { age: { $gt: 100 } });
    expect(result).toEqual([]);
  });
  
  it('should handle complex conditions', () => {
    const result = filter(users, {
      $and: [
        { active: true },
        { age: { $gte: 30 } }
      ]
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice');
  });
});
```

### Integration Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { filter, clearFilterCache } from '@mcabreradev/filter';

describe('Filter Integration', () => {
  const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    value: Math.random() * 100,
    active: i % 2 === 0
  }));
  
  beforeEach(() => {
    clearFilterCache();
  });
  
  it('should handle large datasets efficiently', () => {
    const start = performance.now();
    
    const result = filter(largeDataset, {
      active: true,
      value: { $gte: 50 }
    }, { enableCache: true });
    
    const duration = performance.now() - start;
    
    expect(result.length).toBeGreaterThan(0);
    expect(duration).toBeLessThan(100); // Should complete in <100ms
  });
  
  it('should cache results correctly', () => {
    const expression = { active: true };
    const options = { enableCache: true };
    
    // First call
    const result1 = filter(largeDataset, expression, options);
    
    // Second call (should use cache)
    const start = performance.now();
    const result2 = filter(largeDataset, expression, options);
    const duration = performance.now() - start;
    
    expect(result1).toEqual(result2);
    expect(duration).toBeLessThan(1); // Cache should be near-instant
  });
});
```

---

## Best Practices

### 1. Type Safety

Always use TypeScript for type safety:

```typescript
// ✅ Good: Type-safe interfaces
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [...];
const filtered = filter<Product>(products, { price: { $gte: 100 } });

// ❌ Avoid: Untyped data
const data: any[] = [...];
const result = filter(data, { someField: 'value' });
```

### 2. Validate User Input

Always validate user-provided expressions:

```typescript
import { validateExpression } from '@mcabreradev/filter';

// ✅ Good: Validate before use
try {
  const userExpression = JSON.parse(req.body.filter);
  const validated = validateExpression(userExpression);
  const result = filter(data, validated);
} catch (error) {
  res.status(400).json({ error: 'Invalid filter expression' });
}

// ❌ Avoid: Direct use of user input
const result = filter(data, JSON.parse(req.body.filter));
```

### 3. Use Lazy Evaluation

Use lazy evaluation for large datasets:

```typescript
import { filterLazy, filterFirst } from '@mcabreradev/filter';

// ✅ Good: Lazy evaluation for large data
const first100 = filterFirst(millionRecords, expression, 100);

// ✅ Good: Early exit when condition is met
for (const item of filterLazy(largeData, expression)) {
  if (found) break;
}

// ⚠️ Less optimal: Load all results
const allResults = filter(millionRecords, expression).slice(0, 100);
```

### 4. Enable Caching Strategically

Enable caching for repeated queries:

```typescript
// ✅ Good: Cache for dashboard queries
const electronics = filter(products, { category: 'Electronics' }, {
  enableCache: true
});

// ✅ Good: Clear cache when data changes
function updateProducts(newProducts: Product[]) {
  products = newProducts;
  clearFilterCache();
}

// ❌ Avoid: Cache for one-time queries
const result = filter(data, uniqueExpression, { enableCache: true });
```

### 5. Structure Complex Queries

Break down complex queries for maintainability:

```typescript
// ✅ Good: Modular query building
function buildUserQuery(params: QueryParams) {
  const baseQuery = { active: true };
  
  if (params.role) {
    baseQuery.role = params.role;
  }
  
  if (params.minAge) {
    baseQuery.age = { $gte: params.minAge };
  }
  
  return baseQuery;
}

const query = buildUserQuery(params);
const users = filter(allUsers, query);

// ⚠️ Less maintainable: Inline complex query
const users = filter(allUsers, {
  $and: [
    { active: true },
    params.role ? { role: params.role } : {},
    params.minAge ? { age: { $gte: params.minAge } } : {}
  ]
});
```

---

## Advanced Patterns

### Custom Comparator

Implement custom comparison logic:

```typescript
import { filter, type FilterOptions } from '@mcabreradev/filter';

interface Product {
  name: string;
  price: number;
  tags: string[];
}

const products: Product[] = [...];

// Case-insensitive string matching
const options: FilterOptions = {
  customComparator: (actual, expected) => {
    if (typeof actual === 'string' && typeof expected === 'string') {
      return actual.toLowerCase() === expected.toLowerCase();
    }
    return actual === expected;
  }
};

const result = filter(products, { name: 'LAPTOP' }, options);
```

### Composable Filters

Create reusable filter functions:

```typescript
function createUserFilter(role?: string, minAge?: number) {
  const expression: Record<string, unknown> = { active: true };
  
  if (role) expression.role = role;
  if (minAge) expression.age = { $gte: minAge };
  
  return (users: User[]) => filter(users, expression);
}

// Usage
const adminFilter = createUserFilter('admin');
const seniorFilter = createUserFilter(undefined, 30);

const admins = adminFilter(users);
const seniors = seniorFilter(users);
```

### Middleware Pattern

Use filter in middleware:

```typescript
import { filter } from '@mcabreradev/filter';
import type { Request, Response, NextFunction } from 'express';

interface FilterMiddleware {
  (req: Request, res: Response, next: NextFunction): void;
}

function createFilterMiddleware(dataKey: string): FilterMiddleware {
  return (req, res, next) => {
    try {
      const data = res.locals[dataKey];
      if (!data || !Array.isArray(data)) {
        return next();
      }
      
      const expression = req.query.filter
        ? JSON.parse(req.query.filter as string)
        : {};
      
      res.locals[`${dataKey}Filtered`] = filter(data, expression);
      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid filter' });
    }
  };
}

// Usage
app.get('/api/users',
  loadUsers,
  createFilterMiddleware('users'),
  (req, res) => {
    res.json(res.locals.usersFiltered);
  }
);
```

---

## Real-World Examples

### Example 1: E-commerce API

Complete example with filtering, pagination, and sorting:

```typescript
import { filter } from '@mcabreradev/filter';
import express from 'express';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  inStock: boolean;
}

const app = express();
const products: Product[] = [...]; // Load from database

app.get('/api/products', (req, res) => {
  try {
    let filtered = products;
    
    // Apply filters from query params
    const {
      category,
      minPrice,
      maxPrice,
      inStock,
      minRating,
      search
    } = req.query;
    
    const expression: Record<string, unknown> = {};
    
    if (category) {
      expression.category = category;
    }
    
    if (minPrice || maxPrice) {
      expression.price = {};
      if (minPrice) expression.price.$gte = Number(minPrice);
      if (maxPrice) expression.price.$lte = Number(maxPrice);
    }
    
    if (inStock === 'true') {
      expression.inStock = true;
    }
    
    if (minRating) {
      expression.rating = { $gte: Number(minRating) };
    }
    
    if (search) {
      expression.name = { $contains: search as string };
    }
    
    filtered = filter(products, expression, { enableCache: true });
    
    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const paginated = filtered.slice(start, end);
    
    res.json({
      total: filtered.length,
      page,
      limit,
      products: paginated
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000);
```

### Example 2: Log Analysis Service

Analyze application logs with filtering:

```typescript
import { filter, filterCount, filterLazy } from '@mcabreradev/filter';
import fs from 'fs/promises';

interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  service: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

async function analyzeLogs(filePath: string, timeRange: {
  start: Date;
  end: Date;
}) {
  // Load logs
  const rawData = await fs.readFile(filePath, 'utf-8');
  const logs: LogEntry[] = JSON.parse(rawData);
  
  // Time range filter
  const logsInRange = filter(logs, {
    timestamp: {
      $gte: timeRange.start,
      $lte: timeRange.end
    }
  });
  
  // Count by level
  const errorCount = filterCount(logsInRange, { level: 'error' });
  const warnCount = filterCount(logsInRange, { level: 'warn' });
  const infoCount = filterCount(logsInRange, { level: 'info' });
  
  // Find errors by service
  const services = [...new Set(logs.map(l => l.service))];
  const errorsByService = services.map(service => ({
    service,
    errors: filterCount(logsInRange, {
      level: 'error',
      service
    })
  }));
  
  // Get critical errors (lazy evaluation)
  const criticalErrors = [];
  for (const log of filterLazy(logsInRange, {
    level: 'error',
    message: { $contains: 'critical' }
  })) {
    criticalErrors.push(log);
    if (criticalErrors.length >= 100) break;
  }
  
  return {
    summary: {
      total: logsInRange.length,
      errors: errorCount,
      warnings: warnCount,
      info: infoCount
    },
    errorsByService,
    criticalErrors
  };
}

// Usage
const analysis = await analyzeLogs('./logs/app.log', {
  start: new Date('2025-01-01'),
  end: new Date('2025-01-31')
});

console.log(analysis);
```

### Example 3: Data Synchronization

Filter and sync data between systems:

```typescript
import { filter, filterLazy } from '@mcabreradev/filter';

interface Record {
  id: string;
  updatedAt: Date;
  synced: boolean;
  data: unknown;
}

async function syncRecords(
  localRecords: Record[],
  lastSyncTime: Date
) {
  // Find records that need syncing
  const toSync = filter(localRecords, {
    $and: [
      { synced: false },
      { updatedAt: { $gte: lastSyncTime } }
    ]
  });
  
  console.log(`Found ${toSync.length} records to sync`);
  
  // Process in batches using lazy evaluation
  const batchSize = 100;
  let batch: Record[] = [];
  
  for (const record of filterLazy(toSync, {})) {
    batch.push(record);
    
    if (batch.length >= batchSize) {
      await syncBatch(batch);
      batch = [];
    }
  }
  
  // Sync remaining records
  if (batch.length > 0) {
    await syncBatch(batch);
  }
}

async function syncBatch(records: Record[]): Promise<void> {
  console.log(`Syncing ${records.length} records...`);
  // await api.sync(records);
}
```

---

## Performance Benchmarks

### Filter Performance

```typescript
import { filter } from '@mcabreradev/filter';

const dataset = Array.from({ length: 100000 }, (_, i) => ({
  id: i,
  value: Math.random() * 100,
  active: i % 2 === 0,
  category: ['A', 'B', 'C'][i % 3]
}));

// Simple filter: ~5ms
console.time('simple');
filter(dataset, { active: true });
console.timeEnd('simple');

// Complex filter: ~15ms
console.time('complex');
filter(dataset, {
  active: true,
  value: { $gte: 50, $lte: 75 },
  category: { $in: ['A', 'B'] }
});
console.timeEnd('complex');

// With cache: ~0.01ms (1520x faster)
console.time('cached');
filter(dataset, { active: true }, { enableCache: true });
filter(dataset, { active: true }, { enableCache: true });
console.timeEnd('cached');
```

---

## Troubleshooting

### Common Issues

**Issue:** Filter returns empty array

```typescript
// ❌ Problem: Type mismatch
filter(users, { age: '30' }); // String instead of number

// ✅ Solution: Correct types
filter(users, { age: 30 });
```

**Issue:** Performance degradation

```typescript
// ❌ Problem: No caching for repeated queries
for (let i = 0; i < 1000; i++) {
  filter(largeDataset, sameExpression);
}

// ✅ Solution: Enable caching
for (let i = 0; i < 1000; i++) {
  filter(largeDataset, sameExpression, { enableCache: true });
}
```

**Issue:** Memory usage too high

```typescript
// ❌ Problem: Loading all results
const all = filter(millionRecords, expression);

// ✅ Solution: Use lazy evaluation
for (const item of filterLazy(millionRecords, expression)) {
  process(item);
  if (found) break;
}
```

---

## Resources

- **[Complete Wiki](../advanced/wiki.md)** - Comprehensive documentation
- **[API Reference](../api/reference.md)** - Complete API documentation
- **[Operators Guide](../guide/operators.md)** - All MongoDB-style operators
- **[Lazy Evaluation](../guide/lazy-evaluation.md)** - Efficient processing
- **[Performance Guide](../advanced/performance-benchmarks.md)** - Optimization tips
- **[Examples](../../examples/)** - Real-world code samples

---

## Next Steps

- Explore [Express Integration](./express.md)
- Learn about [NestJS Integration](./nestjs.md)
- Check [Deno Integration](./deno.md)
- Read the [Complete Wiki](../advanced/wiki.md)

---

**Need help?** Open an issue on [GitHub](https://github.com/mcabreradev/filter/issues) or check our [FAQ](../advanced/wiki.md#frequently-asked-questions).
