---
title: API Reference
description: Complete API documentation for @mcabreradev/filter
---

# API Reference

Complete API documentation for all exported functions, types, and interfaces.

## Core Functions

### filter

Main filtering function that processes arrays based on expressions.

```typescript
function filter<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions
): T[]
```

**Parameters:**
- `array` - The array to filter
- `expression` - The filter expression (string, object, predicate, or operators)
- `options` - Optional configuration

**Returns:** Filtered array of type `T[]`

**Example:**
```typescript
const users = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }];
const result = filter(users, { age: { $gte: 25 } });
```

### filterLazy

Returns a lazy iterator for on-demand filtering.

```typescript
function filterLazy<T>(
  iterable: Iterable<T>,
  expression: Expression<T>,
  options?: FilterOptions
): Generator<T, void, undefined>
```

**Parameters:**
- `iterable` - The iterable to filter
- `expression` - The filter expression
- `options` - Optional configuration

**Returns:** Generator yielding filtered items

**Example:**
```typescript
for (const item of filterLazy(largeDataset, { active: true })) {
  process(item);
  if (shouldStop) break;
}
```

### filterFirst

Returns the first N matching items with early exit optimization.

```typescript
function filterFirst<T>(
  array: T[],
  expression: Expression<T>,
  count: number,
  options?: FilterOptions
): T[]
```

**Parameters:**
- `array` - The array to filter
- `expression` - The filter expression
- `count` - Maximum number of items to return
- `options` - Optional configuration

**Returns:** Array of up to `count` filtered items

**Example:**
```typescript
const first10 = filterFirst(users, { premium: true }, 10);
```

### filterExists

Checks if any item matches the expression without processing all items.

```typescript
function filterExists<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions
): boolean
```

**Parameters:**
- `array` - The array to check
- `expression` - The filter expression
- `options` - Optional configuration

**Returns:** `true` if at least one item matches, `false` otherwise

**Example:**
```typescript
const hasAdmin = filterExists(users, { role: 'admin' });
```

### filterCount

Counts matching items without creating a result array.

```typescript
function filterCount<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions
): number
```

**Parameters:**
- `array` - The array to count
- `expression` - The filter expression
- `options` - Optional configuration

**Returns:** Number of matching items

**Example:**
```typescript
const activeCount = filterCount(users, { active: true });
```

## Cache Management

### clearFilterCache

Clears all filter caches (result, predicate, and regex caches).

```typescript
function clearFilterCache(): void
```

**Example:**
```typescript
clearFilterCache();
```

### getFilterCacheStats

Returns statistics about the filter cache.

```typescript
function getFilterCacheStats(): {
  predicateCacheSize: number;
  regexCacheSize: number;
}
```

**Returns:** Object with cache statistics

**Example:**
```typescript
const stats = getFilterCacheStats();
console.log('Predicates cached:', stats.predicateCacheSize);
```

## Types

### Expression

Union type for all possible filter expressions.

```typescript
type Expression<T> =
  | string
  | number
  | boolean
  | ObjectExpression<T>
  | PredicateFunction<T>;
```

### ObjectExpression

Object-based filter expression with operators.

```typescript
type ObjectExpression<T> = {
  [K in keyof T]?: T[K] | ComparisonOperators | StringOperators | ArrayOperators;
} & LogicalOperators<T>;
```

### PredicateFunction

Function-based filter predicate.

```typescript
type PredicateFunction<T> = (item: T) => boolean;
```

### FilterOptions

Configuration options for filtering.

```typescript
interface FilterOptions {
  caseSensitive?: boolean;
  maxDepth?: number;
  enableCache?: boolean;
  customComparator?: (actual: unknown, expected: unknown) => boolean;
}
```

**Properties:**
- `caseSensitive` - Enable case-sensitive string matching (default: `false`)
- `maxDepth` - Maximum depth for nested object comparison (default: `3`, range: 1-10)
- `enableCache` - Enable result caching (default: `false`)
- `customComparator` - Custom comparison function (optional)

## Operators

### ComparisonOperators

```typescript
interface ComparisonOperators {
  $gt?: number | Date;
  $gte?: number | Date;
  $lt?: number | Date;
  $lte?: number | Date;
  $eq?: unknown;
  $ne?: unknown;
}
```

### StringOperators

```typescript
interface StringOperators {
  $startsWith?: string;
  $endsWith?: string;
  $contains?: string;
  $regex?: string | RegExp;
  $match?: string | RegExp;
}
```

### ArrayOperators

```typescript
interface ArrayOperators {
  $in?: unknown[];
  $nin?: unknown[];
  $contains?: unknown;
  $size?: number;
}
```

### LogicalOperators

```typescript
interface LogicalOperators<T> {
  $and?: Expression<T>[];
  $or?: Expression<T>[];
  $not?: Expression<T>;
}
```

## Framework Integrations

### React Hooks

```typescript
function useFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: FilterOptions
): {
  filtered: T[];
  isFiltering: boolean;
}

function useDebouncedFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: { delay?: number } & FilterOptions
): {
  filtered: T[];
  isPending: boolean;
}

function usePaginatedFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: PaginationOptions & FilterOptions
): PaginationResult<T>
```

### Vue Composables

```typescript
function useFilter<T>(
  data: T[] | Ref<T[]>,
  expression: Expression<T> | Ref<Expression<T>>,
  options?: FilterOptions
): {
  filtered: ComputedRef<T[]>;
  isFiltering: Ref<boolean>;
}
```

### Svelte Stores

```typescript
function useFilter<T>(
  data: T[] | Readable<T[]>,
  expression: Expression<T> | Readable<Expression<T>>,
  options?: FilterOptions
): {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
}
```

## Validation

### validateExpression

Validates a filter expression using Zod schema.

```typescript
function validateExpression<T>(expression: unknown): Expression<T>
```

### validateOptions

Validates filter options using Zod schema.

```typescript
function validateOptions(options: unknown): FilterOptions
```

## Configuration

### mergeConfig

Merges provided options with default configuration.

```typescript
function mergeConfig(options?: FilterOptions): FilterConfig
```

### createFilterConfig

Creates a new filter configuration.

```typescript
function createFilterConfig(options?: FilterOptions): FilterConfig
```

## Next Steps

- [Operators Guide](/guide/operators)
- [TypeScript Integration](/guide/getting-started#type-safety)
- [Framework Integration](/frameworks/overview)
- [Examples](/examples/basic)

