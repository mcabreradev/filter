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

## Performance Monitoring

### PerformanceMonitor

Class for tracking filter performance metrics.

```typescript
class PerformanceMonitor {
  start(label: string): void;
  end(label: string): number;
  getMetric(label: string): PerformanceMetric | undefined;
  getAllMetrics(): Map<string, PerformanceMetric>;
  clear(): void;
  reset(label: string): void;
}
```

**Example:**
```typescript
import { PerformanceMonitor } from '@mcabreradev/filter';

const monitor = new PerformanceMonitor();

monitor.start('filter-operation');
const result = filter(largeDataset, { active: true });
const duration = monitor.end('filter-operation');

console.log(`Filtering took ${duration}ms`);
```

### startPerformanceMonitoring

Start monitoring a specific operation.

```typescript
function startPerformanceMonitoring(label: string): void
```

### endPerformanceMonitoring

End monitoring and return duration.

```typescript
function endPerformanceMonitoring(label: string): number
```

### getPerformanceMetrics

Get all performance metrics.

```typescript
function getPerformanceMetrics(): Map<string, PerformanceMetric>
```

### clearPerformanceMetrics

Clear all performance metrics.

```typescript
function clearPerformanceMetrics(): void
```

### getPerformanceMetric

Get a specific performance metric by label.

```typescript
function getPerformanceMetric(label: string): PerformanceMetric | undefined
```

### resetPerformanceMetric

Reset a specific performance metric.

```typescript
function resetPerformanceMetric(label: string): void
```

**Example:**
```typescript
import { 
  startPerformanceMonitoring, 
  endPerformanceMonitoring, 
  getPerformanceMetric 
} from '@mcabreradev/filter';

startPerformanceMonitoring('complex-filter');
const results = filter(data, complexExpression);
const duration = endPerformanceMonitoring('complex-filter');

const metric = getPerformanceMetric('complex-filter');
console.log('Executions:', metric?.count);
console.log('Average:', metric?.averageDuration);
```

## Type Helpers

### isComparisonOperator

Check if value is a comparison operator expression.

```typescript
function isComparisonOperator(value: unknown): value is ComparisonOperators
```

### isStringOperator

Check if value is a string operator expression.

```typescript
function isStringOperator(value: unknown): value is StringOperators
```

### isArrayOperator

Check if value is an array operator expression.

```typescript
function isArrayOperator(value: unknown): value is ArrayOperators
```

### isLogicalOperator

Check if value is a logical operator expression.

```typescript
function isLogicalOperator<T>(value: unknown): value is LogicalOperators<T>
```

### isGeospatialOperator

Check if value is a geospatial operator expression.

```typescript
function isGeospatialOperator(value: unknown): value is GeospatialOperators
```

### isDateTimeOperator

Check if value is a datetime operator expression.

```typescript
function isDateTimeOperator(value: unknown): value is DateTimeOperators
```

### isObjectExpression

Check if value is an object-based expression.

```typescript
function isObjectExpression<T>(value: unknown): value is ObjectExpression<T>
```

### isPredicateFunction

Check if value is a predicate function.

```typescript
function isPredicateFunction<T>(value: unknown): value is PredicateFunction<T>
```

**Example:**
```typescript
import { isComparisonOperator, isStringOperator } from '@mcabreradev/filter';

const expr = { $gte: 100 };
if (isComparisonOperator(expr)) {
  console.log('Comparison operator detected');
}

const strExpr = { $startsWith: 'test' };
if (isStringOperator(strExpr)) {
  console.log('String operator detected');
}
```

## Typed Filter

### TypedFilter

Class for building type-safe filter queries.

```typescript
class TypedFilter<T> {
  constructor(data: T[]);
  where(expression: Expression<T>): TypedFilter<T>;
  orderBy(field: keyof T, direction?: 'asc' | 'desc'): TypedFilter<T>;
  limit(count: number): TypedFilter<T>;
  execute(options?: FilterOptions): T[];
}
```

**Example:**
```typescript
import { TypedFilter } from '@mcabreradev/filter';

interface Product {
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [...];

const result = new TypedFilter(products)
  .where({ category: 'Electronics' })
  .where({ price: { $gte: 100 } })
  .orderBy('price', 'asc')
  .limit(10)
  .execute();
```

### createTypedFilter

Factory function to create a TypedFilter instance.

```typescript
function createTypedFilter<T>(data: T[]): TypedFilter<T>
```

### TypedFilterBuilder

Advanced filter builder with fluent API.

```typescript
class TypedFilterBuilder<T> {
  field<K extends keyof T>(field: K): FieldQuery<T, K>;
  and(...expressions: Expression<T>[]): TypedFilterBuilder<T>;
  or(...expressions: Expression<T>[]): TypedFilterBuilder<T>;
  not(expression: Expression<T>): TypedFilterBuilder<T>;
  build(): Expression<T>;
}
```

**Example:**
```typescript
import { TypedFilterBuilder } from '@mcabreradev/filter';

const builder = new TypedFilterBuilder<User>();

const expression = builder
  .field('age').gte(18).lte(65)
  .and(
    builder.field('role').in(['admin', 'moderator']),
    builder.field('active').equals(true)
  )
  .build();

const results = filter(users, expression);
```

## Geospatial Functions

### calculateDistance

Calculate distance between two geographic points in meters.

```typescript
function calculateDistance(
  point1: GeoPoint,
  point2: GeoPoint
): number
```

**Parameters:**
- `point1` - First geographic point `{ lat: number, lng: number }`
- `point2` - Second geographic point

**Returns:** Distance in meters

**Example:**
```typescript
import { calculateDistance } from '@mcabreradev/filter';

const berlin: GeoPoint = { lat: 52.52, lng: 13.405 };
const paris: GeoPoint = { lat: 48.8566, lng: 2.3522 };

const distance = calculateDistance(berlin, paris);
console.log(`Distance: ${distance} meters`); // ~878000m
```

### isValidGeoPoint

Validate geographic coordinates.

```typescript
function isValidGeoPoint(point: unknown): point is GeoPoint
```

**Returns:** `true` if point has valid lat (-90 to 90) and lng (-180 to 180)

**Example:**
```typescript
import { isValidGeoPoint } from '@mcabreradev/filter';

isValidGeoPoint({ lat: 52.52, lng: 13.405 }); // true
isValidGeoPoint({ lat: 91, lng: 0 }); // false (invalid latitude)
```

### evaluateNearOperator

Evaluate $near geospatial operator.

```typescript
function evaluateNearOperator(
  location: unknown,
  query: NearOperator
): boolean
```

**Example:**
```typescript
import { evaluateNearOperator } from '@mcabreradev/filter';

const location = { lat: 52.52, lng: 13.405 };
const query = {
  center: { lat: 52.52, lng: 13.40 },
  maxDistanceMeters: 1000
};

evaluateNearOperator(location, query); // true if within range
```

## DateTime Utilities

### isValidDate

Check if value is a valid Date object.

```typescript
function isValidDate(date: unknown): date is Date
```

### isValidTimeOfDay

Validate time of day query.

```typescript
function isValidTimeOfDay(query: unknown): query is TimeOfDayQuery
```

### isValidDayOfWeek

Validate day of week array.

```typescript
function isValidDayOfWeek(days: unknown): days is number[]
```

### isValidRelativeTime

Validate relative time query.

```typescript
function isValidRelativeTime(query: unknown): query is RelativeTimeQuery
```

### isValidAgeQuery

Validate age query.

```typescript
function isValidAgeQuery(query: unknown): query is AgeQuery
```

### calculateTimeDifference

Calculate time difference in milliseconds.

```typescript
function calculateTimeDifference(date: Date, now?: Date): number
```

### calculateAge

Calculate age from birth date.

```typescript
function calculateAge(
  birthDate: Date,
  unit?: 'years' | 'months' | 'days',
  now?: Date
): number
```

**Example:**
```typescript
import { calculateAge } from '@mcabreradev/filter';

const birthDate = new Date('1990-01-15');
const age = calculateAge(birthDate, 'years'); // 35
const ageInMonths = calculateAge(birthDate, 'months'); // 420
```

### isWeekday

Check if date is a weekday (Monday-Friday).

```typescript
function isWeekday(date: Date): boolean
```

### isWeekend

Check if date is a weekend (Saturday-Sunday).

```typescript
function isWeekend(date: Date): boolean
```

**Example:**
```typescript
import { isWeekday, isWeekend } from '@mcabreradev/filter';

const monday = new Date('2025-11-17'); // Monday
isWeekday(monday); // true
isWeekend(monday); // false

const saturday = new Date('2025-11-22'); // Saturday
isWeekday(saturday); // false
isWeekend(saturday); // true
```

## DateTime Evaluators

### evaluateRecent

Evaluate $recent datetime operator.

```typescript
function evaluateRecent(date: unknown, query: RelativeTimeQuery): boolean
```

### evaluateUpcoming

Evaluate $upcoming datetime operator.

```typescript
function evaluateUpcoming(date: unknown, query: RelativeTimeQuery): boolean
```

### evaluateDayOfWeek

Evaluate $dayOfWeek datetime operator.

```typescript
function evaluateDayOfWeek(date: unknown, days: number[]): boolean
```

### evaluateTimeOfDay

Evaluate $timeOfDay datetime operator.

```typescript
function evaluateTimeOfDay(date: unknown, query: TimeOfDayQuery): boolean
```

### evaluateAge

Evaluate $age datetime operator.

```typescript
function evaluateAge(date: unknown, query: AgeQuery): boolean
```

### evaluateIsWeekday

Evaluate $isWeekday datetime operator.

```typescript
function evaluateIsWeekday(date: unknown, expected: boolean): boolean
```

### evaluateIsWeekend

Evaluate $isWeekend datetime operator.

```typescript
function evaluateIsWeekend(date: unknown, expected: boolean): boolean
```

### evaluateIsBefore

Evaluate $isBefore datetime operator.

```typescript
function evaluateIsBefore(date: unknown, beforeDate: Date): boolean
```

### evaluateIsAfter

Evaluate $isAfter datetime operator.

```typescript
function evaluateIsAfter(date: unknown, afterDate: Date): boolean
```

**Example:**
```typescript
import { evaluateRecent, evaluateDayOfWeek } from '@mcabreradev/filter';

const recentDate = new Date();
evaluateRecent(recentDate, { days: 7 }); // true

const monday = new Date('2025-11-17');
evaluateDayOfWeek(monday, [1, 2, 3, 4, 5]); // true (Monday is day 1)
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
  orderBy?: string | { field: string; direction: 'asc' | 'desc' } | Array<string | { field: string; direction: 'asc' | 'desc' }>;
  limit?: number;
  debug?: boolean;
  verbose?: boolean;
}
```

**Properties:**
- `caseSensitive` - Enable case-sensitive string matching (default: `false`)
- `maxDepth` - Maximum depth for nested object comparison (default: `3`, range: 1-10)
- `enableCache` - Enable result caching for 530x-1520x faster repeated queries (default: `false`)
- `customComparator` - Custom comparison function for advanced matching (optional)
- `orderBy` - Sort filtered results by field(s) in ascending or descending order (optional)
  - Single field: `'price'` or `{ field: 'price', direction: 'desc' }`
  - Multiple fields: `['price', { field: 'rating', direction: 'desc' }]`
- `limit` - Maximum number of results to return, useful for pagination (optional)
- `debug` - Enable visual debugging with expression tree output (default: `false`)
- `verbose` - Enable verbose debug output with execution details (default: `false`)

**Example:**
```typescript
// Enable caching for performance
filter(largeDataset, expression, { enableCache: true });

// Sort results
filter(products, { category: 'Electronics' }, {
  orderBy: { field: 'price', direction: 'asc' }
});

// Multiple sort fields
filter(products, { inStock: true }, {
  orderBy: [
    { field: 'price', direction: 'asc' },
    { field: 'rating', direction: 'desc' }
  ]
});

// Limit results for pagination
filter(users, { active: true }, {
  orderBy: 'name',
  limit: 20
});

// Debug mode
filter(data, expression, { debug: true });
```

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

