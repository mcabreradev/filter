---
title: Lazy Evaluation
description: Efficient processing for large datasets with generators and lazy evaluation
---

# Lazy Evaluation Guide

## Overview

Lazy evaluation allows you to process large datasets efficiently by evaluating items on-demand rather than processing the entire array upfront. This approach:

- **Reduces memory footprint** - Only processes items as needed
- **Improves performance** - Stops early when conditions are met
- **Enables infinite streams** - Works with generators and async iterables
- **Supports chunked processing** - Process data in manageable batches

---

## API Reference

### `filterLazy<T>`

Returns a lazy iterator that yields filtered items on-demand.

**Signature:**
```typescript
function filterLazy<T>(
  iterable: Iterable<T>,
  expression: Expression<T>,
  options?: FilterOptions
): Generator<T, void, undefined>
```

**Example:**
```typescript
import { filterLazy, toArray } from '@mcabreradev/filter';

const users = [...]; // Large dataset

// Lazy evaluation - items processed on-demand
const filtered = filterLazy(users, { age: { $gte: 18 } });

// Consume only what you need
for (const user of filtered) {
  console.log(user);
  if (someCondition) break; // Stop early
}

// Or convert to array
const results = toArray(filtered);
```

---

### `filterLazyAsync<T>`

Lazy filtering for async iterables (streams, database cursors, etc.).

**Signature:**
```typescript
function filterLazyAsync<T>(
  iterable: AsyncIterable<T>,
  expression: Expression<T>,
  options?: FilterOptions
): AsyncGenerator<T, void, undefined>
```

**Example:**
```typescript
import { filterLazyAsync } from '@mcabreradev/filter';

async function* fetchUsers() {
  // Simulate async data source
  for (let i = 0; i < 10000; i++) {
    yield await fetchUser(i);
  }
}

const filtered = filterLazyAsync(fetchUsers(), { active: true });

for await (const user of filtered) {
  console.log(user);
}
```

---

### `filterFirst<T>`

Returns the first N matching items with early exit optimization.

**Signature:**
```typescript
function filterFirst<T>(
  array: T[],
  expression: Expression<T>,
  count: number = 1,
  options?: FilterOptions
): T[]
```

**Example:**
```typescript
import { filterFirst } from '@mcabreradev/filter';

// Find first 10 premium users
const topUsers = filterFirst(users, { premium: true }, 10);

// Find first match only
const firstMatch = filterFirst(users, { id: 123 }, 1)[0];
```

---

### `filterExists<T>`

Checks if at least one matching item exists (stops on first match).

**Signature:**
```typescript
function filterExists<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions
): boolean
```

**Example:**
```typescript
import { filterExists } from '@mcabreradev/filter';

// Check if any admin exists
const hasAdmin = filterExists(users, { role: 'admin' });

// Check if any user over 100 years old
const hasCentennial = filterExists(users, { age: { $gte: 100 } });
```

---

### `filterCount<T>`

Counts matching items without creating result array.

**Signature:**
```typescript
function filterCount<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions
): number
```

**Example:**
```typescript
import { filterCount } from '@mcabreradev/filter';

// Count active users
const activeCount = filterCount(users, { active: true });

// Count users in age range
const youngAdults = filterCount(users, { age: { $gte: 18, $lt: 30 } });
```

---

### `filterChunked<T>`

Processes data in chunks and returns all results as chunk arrays.

**Signature:**
```typescript
function filterChunked<T>(
  array: T[],
  expression: Expression<T>,
  chunkSize: number = 1000,
  options?: FilterOptions
): T[][]
```

**Example:**
```typescript
import { filterChunked } from '@mcabreradev/filter';

// Process in batches of 1000
const chunks = filterChunked(largeDataset, { active: true }, 1000);

// Process each chunk
for (const chunk of chunks) {
  await processBatch(chunk);
}
```

---

### `filterLazyChunked<T>`

Lazy version of chunked filtering - yields chunks on-demand.

**Signature:**
```typescript
function filterLazyChunked<T>(
  array: T[],
  expression: Expression<T>,
  chunkSize: number = 1000,
  options?: FilterOptions
): Generator<T[], void, undefined>
```

**Example:**
```typescript
import { filterLazyChunked } from '@mcabreradev/filter';

// Lazy chunked processing
for (const chunk of filterLazyChunked(largeDataset, { active: true }, 500)) {
  await processChunk(chunk);

  // Can stop early if needed
  if (shouldStop) break;
}
```

---

## Lazy Iterator Utilities

Compose lazy operations for powerful data pipelines:

### `take<T>`
Take first N items from an iterable.

```typescript
import { filterLazy, take, toArray } from '@mcabreradev/filter';

const first10 = toArray(take(filterLazy(users, { active: true }), 10));
```

### `skip<T>`
Skip first N items from an iterable.

```typescript
import { filterLazy, skip, toArray } from '@mcabreradev/filter';

// Pagination: skip 20, take 10
const page3 = toArray(take(skip(filterLazy(users, { active: true }), 20), 10));
```

### `map<T, U>`
Transform items lazily.

```typescript
import { filterLazy, map, toArray } from '@mcabreradev/filter';

const userNames = toArray(
  map(filterLazy(users, { active: true }), (u) => u.name)
);
```

### `chunk<T>`
Chunk items into arrays.

```typescript
import { filterLazy, chunk, toArray } from '@mcabreradev/filter';

const batches = toArray(chunk(filterLazy(users, { active: true }), 100));
```

### Composition

Combine multiple lazy operations:

```typescript
import { filterLazy, skip, take, map, toArray } from '@mcabreradev/filter';

// Complex pipeline - all lazy!
const result = toArray(
  take(
    map(
      skip(filterLazy(users, { active: true }), 100),
      (u) => ({ id: u.id, name: u.name })
    ),
    50
  )
);
```

---

## Performance Comparison

### Memory Usage

```typescript
// Standard filter - loads all results in memory
const standard = filter(millionRecords, { active: true }); // ~100MB

// Lazy filter - minimal memory footprint
const lazy = filterLazy(millionRecords, { active: true }); // ~1KB
for (const item of lazy) {
  process(item); // Process one at a time
}
```

### Early Exit

```typescript
// Standard filter - processes all 1M records
const standard = filter(millionRecords, { id: 123 })[0]; // 1M iterations

// filterFirst - stops after finding match
const optimized = filterFirst(millionRecords, { id: 123 }, 1)[0]; // ~123 iterations
```

### Existence Check

```typescript
// Standard filter - processes all records
const hasMatch = filter(millionRecords, { role: 'admin' }).length > 0; // 1M iterations

// filterExists - stops on first match
const hasMatch = filterExists(millionRecords, { role: 'admin' }); // Early exit
```

---

## Use Cases

### 1. Pagination

```typescript
function paginate<T>(
  data: T[],
  expression: Expression<T>,
  page: number,
  pageSize: number
) {
  return toArray(
    take(
      skip(filterLazy(data, expression), page * pageSize),
      pageSize
    )
  );
}

const page2 = paginate(users, { active: true }, 1, 20);
```

### 2. Streaming Data

```typescript
async function* streamFromDB() {
  const cursor = db.collection('users').find();
  for await (const doc of cursor) {
    yield doc;
  }
}

const activeUsers = filterLazyAsync(streamFromDB(), { active: true });

for await (const user of activeUsers) {
  await sendEmail(user);
}
```

### 3. Batch Processing

```typescript
for (const chunk of filterLazyChunked(largeDataset, { needsProcessing: true }, 1000)) {
  await api.batchUpdate(chunk);
  await delay(100); // Rate limiting
}
```

### 4. Search with Limit

```typescript
function searchUsers(query: string, limit: number = 10) {
  return filterFirst(
    users,
    { name: { $contains: query } },
    limit
  );
}

const results = searchUsers('john', 5);
```

### 5. Validation

```typescript
// Check if all items pass validation
const allValid = !filterExists(items, (item) => !isValid(item));

// Count invalid items
const invalidCount = filterCount(items, (item) => !isValid(item));
```

---

## Best Practices

### ✅ Do

- Use `filterLazy` for large datasets when you don't need all results immediately
- Use `filterFirst` when you only need a few matches
- Use `filterExists` for existence checks
- Use `filterCount` when you only need the count
- Compose lazy operations for complex pipelines
- Use chunked processing for batch operations

### ❌ Don't

- Don't use lazy evaluation for small datasets (< 1000 items) - overhead not worth it
- Don't convert lazy results to array immediately - defeats the purpose
- Don't use lazy evaluation when you need all results anyway
- Don't forget to handle cleanup in async iterables

---

## TypeScript Support

Full type safety for all lazy operations:

```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

const users: User[] = [...];

// Type-safe lazy filtering
const filtered: Generator<User, void, undefined> = filterLazy(users, { age: { $gte: 18 } });

// Type-safe transformation
const names: Generator<string, void, undefined> = map(filtered, (u) => u.name);

// Type-safe array conversion
const results: string[] = toArray(names);
```

---

## Performance Benchmarks

| Operation | Standard | Lazy | Improvement |
|-----------|----------|------|-------------|
| Filter 1M records, take 10 | 250ms | 0.5ms | **500x faster** |
| Existence check in 1M records | 200ms | 0.1ms | **2000x faster** |
| Count matches in 1M records | 180ms | 180ms | Same (needs full scan) |
| Paginate 1M records (page 1) | 220ms | 1ms | **220x faster** |
| Memory usage (1M records) | 100MB | 1KB | **100,000x less** |

*Benchmarks run on Node.js 20, dataset of 1M objects with 10 properties each*

---

## Migration from Standard Filter

```typescript
// Before: Standard filter
const results = filter(largeDataset, { active: true });
for (const item of results) {
  if (shouldStop) break; // Already processed everything!
}

// After: Lazy filter
const results = filterLazy(largeDataset, { active: true });
for (const item of results) {
  if (shouldStop) break; // Stops processing immediately
}
```

```typescript
// Before: Finding first match
const firstMatch = filter(largeDataset, { id: 123 })[0];

// After: Optimized early exit
const firstMatch = filterFirst(largeDataset, { id: 123 }, 1)[0];
```

```typescript
// Before: Checking existence
const hasMatch = filter(largeDataset, { role: 'admin' }).length > 0;

// After: Early exit optimization
const hasMatch = filterExists(largeDataset, { role: 'admin' });
```

---

## See Also

- [Performance Benchmarks](../advanced/performance-benchmarks.md)
- [Performance Guide](../advanced/wiki.md#performance-optimization)
- [Operators Reference](./operators.md)
- [Advanced Logical Operators](./logical-operators.md)
- [API Reference](../advanced/wiki.md#api-reference)

