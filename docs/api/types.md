# TypeScript Types Reference

Complete TypeScript type definitions for @mcabreradev/filter v5.8.2.

## Core Types

### Expression`<T>`

The main type for filter expressions.

```typescript
type Expression<T> = {
  [K in keyof T]?: OperatorExpression<T[K]> | T[K] | T[K][];
} | LogicalExpression<T>;
```

**Usage**:
```typescript
interface User {
  id: number;
  name: string;
  age: number;
  status: 'active' | 'inactive';
}

// Simple equality
const expr1: Expression<User> = {
  age: 25,
  status: 'active'
};

// With operators
const expr2: Expression<User> = {
  age: { $gte: 18, $lte: 65 },
  name: { $regex: /john/i }
};

// Array OR syntax
const expr3: Expression<User> = {
  status: ['active', 'pending'] // Equivalent to: { status: { $in: ['active', 'pending'] } }
};
```

### OperatorExpression`<T>`

Type for operator-based expressions.

```typescript
interface OperatorExpression<T> {
  // Comparison operators
  $eq?: T;
  $ne?: T;
  $gt?: T extends number | Date ? T : never;
  $gte?: T extends number | Date ? T : never;
  $lt?: T extends number | Date ? T : never;
  $lte?: T extends number | Date ? T : never;
  
  // Array operators
  $in?: T[];
  $nin?: T[];
  $contains?: T extends Array<infer U> ? U : never;
  $size?: T extends Array<any> ? number : never;
  
  // String operators
  $regex?: T extends string ? RegExp : never;
  $startsWith?: T extends string ? string : never;
  $endsWith?: T extends string ? string : never;
  $match?: T extends string ? string : never;
  
  // Geospatial operators
  $near?: T extends GeoPoint ? NearOperator : never;
  $geoBox?: T extends GeoPoint ? GeoBoxOperator : never;
  $geoPolygon?: T extends GeoPoint ? GeoPolygonOperator : never;
  
  // DateTime operators
  $recent?: T extends Date ? RecentOperator : never;
  $upcoming?: T extends Date ? UpcomingOperator : never;
  $dayOfWeek?: T extends Date ? number[] : never;
  $timeOfDay?: T extends Date ? TimeOfDayOperator : never;
  $age?: T extends Date ? AgeOperator : never;
  $isWeekday?: T extends Date ? boolean : never;
  $isWeekend?: T extends Date ? boolean : never;
  $isBefore?: T extends Date ? Date : never;
  $isAfter?: T extends Date ? Date : never;
}
```

### LogicalExpression`<T>`

Type for logical operators.

```typescript
interface LogicalExpression<T> {
  $and?: Expression<T>[];
  $or?: Expression<T>[];
  $not?: Expression<T>;
}
```

**Usage**:
```typescript
const expression: Expression<User> = {
  $and: [
    { age: { $gte: 18 } },
    {
      $or: [
        { status: 'active' },
        { status: 'pending' }
      ]
    }
  ]
};
```

## Geospatial Types

### GeoPoint

Type for geographic coordinates.

```typescript
interface GeoPoint {
  lat: number;  // Latitude (-90 to 90)
  lng: number;  // Longitude (-180 to 180)
}
```

**Usage**:
```typescript
const location: GeoPoint = { lat: 52.52, lng: 13.405 };
```

### NearOperator

Type for `$near` operator.

```typescript
interface NearOperator {
  center: GeoPoint;
  maxDistanceMeters: number;
  minDistanceMeters?: number;
}
```

**Usage**:
```typescript
const expression: Expression<Restaurant> = {
  location: {
    $near: {
      center: { lat: 52.52, lng: 13.405 },
      maxDistanceMeters: 5000,
      minDistanceMeters: 100
    }
  }
};
```

### GeoBoxOperator

Type for `$geoBox` operator.

```typescript
interface GeoBoxOperator {
  bottomLeft: GeoPoint;
  topRight: GeoPoint;
}
```

**Usage**:
```typescript
const expression: Expression<Restaurant> = {
  location: {
    $geoBox: {
      bottomLeft: { lat: 52.5, lng: 13.3 },
      topRight: { lat: 52.6, lng: 13.5 }
    }
  }
};
```

### GeoPolygonOperator

Type for `$geoPolygon` operator.

```typescript
interface GeoPolygonOperator {
  points: GeoPoint[];
}
```

**Usage**:
```typescript
const expression: Expression<Restaurant> = {
  location: {
    $geoPolygon: {
      points: [
        { lat: 52.5, lng: 13.3 },
        { lat: 52.6, lng: 13.3 },
        { lat: 52.6, lng: 13.5 },
        { lat: 52.5, lng: 13.5 }
      ]
    }
  }
};
```

## DateTime Types

### RecentOperator

Type for `$recent` operator.

```typescript
interface RecentOperator {
  days?: number;
  hours?: number;
  minutes?: number;
}
```

**Usage**:
```typescript
const expression: Expression<Event> = {
  createdAt: {
    $recent: { days: 7 } // Last 7 days
  }
};
```

### UpcomingOperator

Type for `$upcoming` operator.

```typescript
interface UpcomingOperator {
  days?: number;
  hours?: number;
  minutes?: number;
}
```

**Usage**:
```typescript
const expression: Expression<Event> = {
  startTime: {
    $upcoming: { hours: 24 } // Next 24 hours
  }
};
```

### TimeOfDayOperator

Type for `$timeOfDay` operator.

```typescript
interface TimeOfDayOperator {
  start: number; // Hour (0-23)
  end: number;   // Hour (0-23)
}
```

**Usage**:
```typescript
const expression: Expression<Event> = {
  startTime: {
    $timeOfDay: { start: 9, end: 17 } // Business hours
  }
};
```

### AgeOperator

Type for `$age` operator.

```typescript
interface AgeOperator {
  $gt?: number;
  $gte?: number;
  $lt?: number;
  $lte?: number;
  $eq?: number;
  $ne?: number;
}
```

**Usage**:
```typescript
const expression: Expression<User> = {
  birthDate: {
    $age: { $gte: 18, $lt: 65 } // Age between 18 and 64
  }
};
```

## Filter Options

### FilterOptions

Configuration options for filtering.

```typescript
interface FilterOptions {
  // Performance options
  enableCache?: boolean;        // Enable memoization (530x-1520x faster)
  maxDepth?: number;            // Max depth for nested object comparison (1-10)
  
  // String comparison options
  caseSensitive?: boolean;      // Case-sensitive string matching
  
  // Sorting options
  orderBy?: OrderBy | OrderBy[]; // Single or multi-field sorting
  
  // Pagination options
  limit?: number;               // Maximum number of results
  
  // Debug options
  debug?: boolean;              // Enable debug tree visualization
  verbose?: boolean;            // Verbose debug output
  
  // Custom comparison
  customComparator?: <T>(a: T, b: T) => boolean;
}
```

**Properties**:
- `enableCache` - Enable result caching (530x-1520x speedup for repeated queries)
- `caseSensitive` - Case-sensitive string comparisons (default: false)
- `maxDepth` - Maximum depth for nested object comparison (default: 3, range: 1-10)
- `orderBy` - Sort results by field(s) in ascending or descending order
- `limit` - Restrict the number of returned results
- `debug` - Enable debug tree visualization in console
- `verbose` - Include detailed timing and match statistics in debug output
- `customComparator` - Custom comparison function for deep equality checks

**Usage**:
```typescript
// With caching
const results = filter(data, expression, {
  enableCache: true,
  orderBy: { field: 'price', direction: 'asc' },
  limit: 10
});

// With debug mode
const debugResults = filter(data, expression, {
  debug: true,
  verbose: true
});

// Multi-field sorting
const sorted = filter(data, expression, {
  orderBy: [
    { field: 'category', direction: 'asc' },
    { field: 'price', direction: 'desc' }
  ]
});
```

### OrderBy

Type for ordering/sorting options.

```typescript
interface OrderBy {
  field: string;
  direction: 'asc' | 'desc';
}
```

**Usage**:
```typescript
// Single field
const options1: FilterOptions = {
  orderBy: { field: 'price', direction: 'asc' }
};

// Multiple fields
const options2: FilterOptions = {
  orderBy: [
    { field: 'category', direction: 'asc' },
    { field: 'price', direction: 'desc' },
    { field: 'name', direction: 'asc' }
  ]
};
```

## React Types

### UseFilterResult`<T>`

Return type for `useFilter` hook.

```typescript
interface UseFilterResult<T> {
  filtered: T[];
  isFiltering: boolean;
}
```

**Usage**:
```typescript
const { filtered, isFiltering }: UseFilterResult<User> = useFilter(
  users,
  expression
);
```

### UseFilteredStateResult`<T>`

Return type for `useFilteredState` hook.

```typescript
interface UseFilteredStateResult<T> {
  data: T[];
  setData: (data: T[]) => void;
  expression: Expression<T>;
  setExpression: (expression: Expression<T>) => void;
  filtered: T[];
  isFiltering: boolean;
}
```

**Usage**:
```typescript
const {
  data,
  setData,
  expression,
  setExpression,
  filtered,
  isFiltering
}: UseFilteredStateResult<Product> = useFilteredState(initialProducts);
```

### UseDebouncedFilterOptions

Options for debounced filtering.

```typescript
interface UseDebouncedFilterOptions extends FilterOptions {
  delay?: number; // Debounce delay in milliseconds (default: 300)
}
```

**Usage**:
```typescript
const { filtered, isPending } = useDebouncedFilter(
  users,
  expression,
  { delay: 500, enableCache: true }
);
```

### UseDebouncedFilterResult`<T>`

Return type for `useDebouncedFilter` hook.

```typescript
interface UseDebouncedFilterResult<T> {
  filtered: T[];
  isFiltering: boolean;
  isPending: boolean;
}
```

**Usage**:
```typescript
const {
  filtered,
  isFiltering,
  isPending
}: UseDebouncedFilterResult<User> = useDebouncedFilter(users, expression);
```

### UsePaginatedFilterResult`<T>`

Return type for `usePaginatedFilter` hook.

```typescript
interface UsePaginatedFilterResult<T> {
  filtered: T[];
  isFiltering: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
```

**Usage**:
```typescript
const {
  filtered,
  currentPage,
  totalPages,
  nextPage,
  previousPage,
  goToPage
}: UsePaginatedFilterResult<Product> = usePaginatedFilter(
  products,
  expression,
  { pageSize: 20 }
);
```

## Vue Types

### MaybeRefOrGetter`<T>`

Type for reactive values in Vue.

```typescript
type MaybeRefOrGetter<T> = T | Ref<T> | ComputedRef<T> | (() => T);
```

**Usage**:
```typescript
import { ref, computed } from 'vue';

const staticData = [{ id: 1 }];
const refData = ref([{ id: 1 }]);
const computedData = computed(() => [{ id: 1 }]);
const getterData = () => [{ id: 1 }];

// All are valid
useFilter(staticData, expression);
useFilter(refData, expression);
useFilter(computedData, expression);
useFilter(getterData, expression);
```

### UseFilterResult (Vue)

Return type for Vue `useFilter` composable.

```typescript
interface UseFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
}
```

**Usage**:
```typescript
import { ref } from 'vue';
import type { ComputedRef } from 'vue';

const { filtered, isFiltering }: {
  filtered: ComputedRef<User[]>;
  isFiltering: ComputedRef<boolean>;
} = useFilter(users, expression);
```

### UseFilteredStateResult (Vue)

Return type for Vue `useFilteredState` composable.

```typescript
interface UseFilteredStateResult<T> {
  data: Ref<T[]>;
  expression: Ref<Expression<T>>;
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
}
```

**Usage**:
```typescript
const {
  data,
  expression,
  filtered,
  isFiltering
}: UseFilteredStateResult<Product> = useFilteredState(initialProducts);
```

### UseDebouncedFilterResult (Vue)

Return type for Vue `useDebouncedFilter` composable.

```typescript
interface UseDebouncedFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
  isPending: Ref<boolean>;
}
```

**Usage**:
```typescript
const {
  filtered,
  isFiltering,
  isPending
}: UseDebouncedFilterResult<User> = useDebouncedFilter(users, expression);
```

### UsePaginatedFilterResult (Vue)

Return type for Vue `usePaginatedFilter` composable.

```typescript
interface UsePaginatedFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
  currentPage: Ref<number>;
  totalPages: ComputedRef<number>;
  pageSize: Ref<number>;
  totalItems: ComputedRef<number>;
  hasNextPage: ComputedRef<boolean>;
  hasPreviousPage: ComputedRef<boolean>;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
```

**Usage**:
```typescript
const {
  filtered,
  currentPage,
  totalPages,
  nextPage,
  previousPage
}: UsePaginatedFilterResult<Product> = usePaginatedFilter(products, expression);
```

## Svelte Types

### UseFilterResult (Svelte)

Return type for Svelte `useFilter` store.

```typescript
interface UseFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
}
```

**Usage**:
```typescript
import type { Readable } from 'svelte/store';

const { filtered, isFiltering }: {
  filtered: Readable<User[]>;
  isFiltering: Readable<boolean>;
} = useFilter(users, expression);
```

### UseFilteredStateResult (Svelte)

Return type for Svelte `useFilteredState` store.

```typescript
interface UseFilteredStateResult<T> {
  data: Writable<T[]>;
  expression: Writable<Expression<T>>;
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
}
```

**Usage**:
```typescript
import type { Readable, Writable } from 'svelte/store';

const {
  data,
  expression,
  filtered,
  isFiltering
}: UseFilteredStateResult<Product> = useFilteredState(initialProducts);
```

### UseDebouncedFilterResult (Svelte)

Return type for Svelte `useDebouncedFilter` store.

```typescript
interface UseDebouncedFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
  isPending: Readable<boolean>;
}
```

**Usage**:
```typescript
const {
  filtered,
  isFiltering,
  isPending
}: UseDebouncedFilterResult<User> = useDebouncedFilter(users, expression);
```

### UsePaginatedFilterResult (Svelte)

Return type for Svelte `usePaginatedFilter` store.

```typescript
interface UsePaginatedFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
  currentPage: Writable<number>;
  totalPages: Readable<number>;
  pageSize: Writable<number>;
  totalItems: Readable<number>;
  hasNextPage: Readable<boolean>;
  hasPreviousPage: Readable<boolean>;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
```

## Angular Types

### FilterService`<T>`

Type for Angular FilterService with Signals.

```typescript
class FilterService<T> {
  // Signals (read-only)
  filtered: Signal<T[]>;
  isFiltering: Signal<boolean>;
  
  // Methods
  setData(data: T[]): void;
  setExpression(expr: Expression<T> | null): void;
  setOptions(opts: FilterOptions): void;
  reset(): void;
}
```

**Usage**:
```typescript
@Component({
  providers: [FilterService]
})
export class MyComponent {
  filterService = inject(FilterService<User>);
  
  ngOnInit() {
    this.filterService.setData(users);
    this.filterService.setExpression({ active: true });
  }
}
```

### DebouncedFilterService`<T>`

Type for Angular DebouncedFilterService.

```typescript
class DebouncedFilterService<T> {
  // Signals (read-only)
  filtered: Signal<T[]>;
  isFiltering: Signal<boolean>;
  isPending: Signal<boolean>;
  
  // Methods
  setData(data: T[]): void;
  setExpression(expr: Expression<T> | null): void;
  setOptions(opts: FilterOptions): void;
  setDebounce(ms: number): void;
  reset(): void;
}
```

### PaginatedFilterService`<T>`

Type for Angular PaginatedFilterService.

```typescript
class PaginatedFilterService<T> {
  // Signals (read-only)
  filtered: Signal<T[]>;
  isFiltering: Signal<boolean>;
  paginatedResults: Signal<T[]>;
  currentPage: Signal<number>;
  pageSize: Signal<number>;
  totalPages: Signal<number>;
  
  // Methods
  setData(data: T[]): void;
  setExpression(expr: Expression<T> | null): void;
  setOptions(opts: FilterOptions): void;
  setPage(page: number): void;
  setPageSize(size: number): void;
  nextPage(): void;
  prevPage(): void;
  reset(): void;
}
```

### FilterPipe

Type for Angular FilterPipe.

```typescript
@Pipe({
  name: 'filterPipe',
  standalone: true,
  pure: true
})
class FilterPipe implements PipeTransform {
  transform<T>(
    data: T[] | null | undefined,
    expr: Expression<T>,
    opts?: FilterOptions
  ): T[];
}
```

**Usage**:
```typescript
@Component({
  template: `
    @for (user of users | filterPipe:{ active: true }; track user.id) {
      <div>{{ user.name }}</div>
    }
  `
})
```

## SolidJS Types

### UseFilterResult (SolidJS)

Return type for SolidJS `useFilter` hook.

```typescript
interface UseFilterResult<T> {
  filtered: Accessor<T[]>;
  isFiltering: Accessor<boolean>;
}
```

**Usage**:
```typescript
import type { Accessor } from 'solid-js';

const { filtered, isFiltering }: {
  filtered: Accessor<User[]>;
  isFiltering: Accessor<boolean>;
} = useFilter(() => users, () => expression);
```

## Preact Types

### UseFilterResult (Preact)

Return type for Preact `useFilter` hook (same as React).

```typescript
interface UseFilterResult<T> {
  filtered: T[];
  isFiltering: boolean;
}
```

**Usage**:
```typescript
const { filtered, isFiltering }: UseFilterResult<User> = useFilter(
  users,
  expression
);
```

## Operator Union Types

### Operator

Union type of all operator names.

```typescript
type Operator =
  // Comparison
  | '$eq'
  | '$ne'
  | '$gt'
  | '$gte'
  | '$lt'
  | '$lte'
  // Array
  | '$in'
  | '$nin'
  | '$contains'
  | '$size'
  // String
  | '$regex'
  | '$startsWith'
  | '$endsWith'
  | '$match'
  // Geospatial
  | '$near'
  | '$geoBox'
  | '$geoPolygon'
  // DateTime
  | '$recent'
  | '$upcoming'
  | '$dayOfWeek'
  | '$timeOfDay'
  | '$age'
  | '$isWeekday'
  | '$isWeekend'
  | '$isBefore'
  | '$isAfter';
```

### LogicalOperator

Union type of logical operator names.

```typescript
type LogicalOperator = '$and' | '$or' | '$not';
```

### ComparisonOperator

Union type of comparison operator names.

```typescript
type ComparisonOperator = '$eq' | '$ne' | '$gt' | '$gte' | '$lt' | '$lte';
```

### ArrayOperator

Union type of array operator names.

```typescript
type ArrayOperator = '$in' | '$nin' | '$contains' | '$size';
```

### StringOperator

Union type of string operator names.

```typescript
type StringOperator = '$regex' | '$startsWith' | '$endsWith' | '$match';
```

### GeospatialOperator

Union type of geospatial operator names.

```typescript
type GeospatialOperator = '$near' | '$geoBox' | '$geoPolygon';
```

### DateTimeOperator

Union type of datetime operator names.

```typescript
type DateTimeOperator =
  | '$recent'
  | '$upcoming'
  | '$dayOfWeek'
  | '$timeOfDay'
  | '$age'
  | '$isWeekday'
  | '$isWeekend'
  | '$isBefore'
  | '$isAfter';
```

## Advanced Types

### DeepPartial`<T>`

Recursive partial type for nested objects.

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

**Usage**:
```typescript
interface User {
  profile: {
    address: {
      city: string;
      country: string;
    };
  };
}

const partial: DeepPartial<User> = {
  profile: {
    address: {
      city: 'Berlin'
      // country is optional
    }
  }
};
```

### NestedKeyOf`<T>`

Type for nested property paths.

```typescript
type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`;
}[keyof T & string];
```

**Usage**:
```typescript
interface User {
  name: string;
  profile: {
    address: {
      city: string;
    };
  };
}

type UserKeys = NestedKeyOf<User>;
// 'name' | 'profile' | 'profile.address' | 'profile.address.city'
```

### PathValue`<T, P>`

Type for value at nested path.

```typescript
type PathValue<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : never
  : never;
```

**Usage**:
```typescript
interface User {
  profile: {
    address: {
      city: string;
    };
  };
}

type CityType = PathValue<User, 'profile.address.city'>; // string
```

## Type Guards

### isExpression

Type guard for expressions.

```typescript
function isExpression<T>(value: unknown): value is Expression<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}
```

**Usage**:
```typescript
if (isExpression<User>(value)) {
  // value is Expression<User>
  filter(users, value);
}
```

### isOperatorExpression

Type guard for operator expressions.

```typescript
function isOperatorExpression<T>(
  value: unknown
): value is OperatorExpression<T> {
  if (typeof value !== 'object' || value === null) return false;

  const operators = [
    '$eq', '$ne', '$gt', '$gte', '$lt', '$lte',
    '$in', '$nin', '$contains', '$size', '$regex',
    '$startsWith', '$endsWith', '$match',
    '$near', '$geoBox', '$geoPolygon',
    '$recent', '$upcoming', '$dayOfWeek', '$timeOfDay',
    '$age', '$isWeekday', '$isWeekend', '$isBefore', '$isAfter'
  ];

  return Object.keys(value).some(key => operators.includes(key));
}
```

### isLogicalExpression

Type guard for logical expressions.

```typescript
function isLogicalExpression<T>(
  value: unknown
): value is LogicalExpression<T> {
  if (typeof value !== 'object' || value === null) return false;
  const keys = Object.keys(value);
  return keys.some(key => ['$and', '$or', '$not'].includes(key));
}
```

### isGeoPoint

Type guard for GeoPoint.

```typescript
function isGeoPoint(value: unknown): value is GeoPoint {
  return (
    typeof value === 'object' &&
    value !== null &&
    'lat' in value &&
    'lng' in value &&
    typeof (value as any).lat === 'number' &&
    typeof (value as any).lng === 'number'
  );
}
```

**Usage**:
```typescript
if (isGeoPoint(location)) {
  // location is GeoPoint
  const distance = calculateDistance(location, targetLocation);
}
```

## Generic Constraints

### Filterable

Constraint for filterable types.

```typescript
type Filterable = Record<string, any>;
```

**Usage**:
```typescript
function createFilter<T extends Filterable>(
  expression: Expression<T>
) {
  return (data: T[]) => filter(data, expression);
}
```

### FilterableArray`<T>`

Constraint for filterable arrays.

```typescript
type FilterableArray<T extends Filterable> = T[];
```

**Usage**:
```typescript
function processFilterable<T extends Filterable>(
  data: FilterableArray<T>,
  expr: Expression<T>
): T[] {
  return filter(data, expr);
}
```

## Predicate Types

### Predicate`<T>`

Type for predicate functions.

```typescript
type Predicate<T> = (item: T, index?: number, array?: T[]) => boolean;
```

**Usage**:
```typescript
const isAdult: Predicate<User> = (user) => user.age >= 18;
const adults = filter(users, isAdult);
```

### AsyncPredicate`<T>`

Type for async predicate functions.

```typescript
type AsyncPredicate<T> = (item: T, index?: number, array?: T[]) => Promise<boolean>;
```

## Lazy Evaluation Types

### LazyFilterIterator`<T>`

Type for lazy filter iterator.

```typescript
type LazyFilterIterator<T> = Generator<T, void, undefined>;
```

**Usage**:
```typescript
import { filterLazy } from '@mcabreradev/filter';

const iterator: LazyFilterIterator<User> = filterLazy(users, { active: true });

for (const user of iterator) {
  console.log(user);
  if (shouldStop) break;
}
```

## Performance Types

### PerformanceMetrics

Type for performance monitoring metrics.

```typescript
interface PerformanceMetrics {
  executionTime: number;
  matchedCount: number;
  totalCount: number;
  matchRate: number;
  cacheHit: boolean;
}
```

**Usage**:
```typescript
import { PerformanceMonitor } from '@mcabreradev/filter';

const monitor = new PerformanceMonitor();
monitor.startMeasure('filter-operation');
const results = filter(data, expression);
const metrics = monitor.endMeasure('filter-operation');

console.log(`Execution time: ${metrics.executionTime}ms`);
console.log(`Match rate: ${metrics.matchRate}%`);
```

### CacheKey

Type for cache keys.

```typescript
type CacheKey = string;
```

### CacheEntry`<T>`

Type for cache entries.

```typescript
interface CacheEntry<T> {
  result: T[];
  timestamp: number;
  hits: number;
}
```

## Example Usage

### Type-Safe Filter

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  tags: string[];
  location: GeoPoint;
  createdAt: Date;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Laptop',
    price: 999,
    category: 'electronics',
    inStock: true,
    tags: ['tech', 'computers'],
    location: { lat: 52.52, lng: 13.405 },
    createdAt: new Date('2024-01-01')
  }
];

const expression: Expression<Product> = {
  $and: [
    { price: { $gte: 500, $lte: 1500 } },
    { category: 'electronics' },
    { inStock: true },
    { tags: { $contains: 'tech' } },
    {
      location: {
        $near: {
          center: { lat: 52.52, lng: 13.405 },
          maxDistanceMeters: 5000
        }
      }
    },
    { createdAt: { $recent: { days: 30 } } }
  ]
};

const options: FilterOptions = {
  enableCache: true,
  orderBy: [
    { field: 'price', direction: 'asc' },
    { field: 'name', direction: 'asc' }
  ],
  limit: 10,
  debug: true
};

const { filtered }: UseFilterResult<Product> = useFilter(
  products,
  expression,
  options
);
```

### Generic Filter Function

```typescript
function createFilter<T extends Filterable>(
  expression: Expression<T>,
  options?: FilterOptions
) {
  return (data: T[]): T[] => {
    return filter(data, expression, options);
  };
}

const activeUserFilter = createFilter<User>({
  status: 'active',
  age: { $gte: 18 }
});

const activeUsers = activeUserFilter(users);
```

### Type-Safe Lazy Filtering

```typescript
function* filterWithLogging<T extends Filterable>(
  data: T[],
  expression: Expression<T>
): LazyFilterIterator<T> {
  const iterator = filterLazy(data, expression);
  
  for (const item of iterator) {
    console.log('Processing:', item);
    yield item;
  }
}

const results = [...filterWithLogging(products, { inStock: true })];
```

## Related Resources

- [Operators Reference](../guide/operators.md)
- [Filter Options](../guide/configuration.md)
- [React Integration](../frameworks/react.md)
- [Vue Integration](../frameworks/vue.md)
- [Angular Integration](../frameworks/angular.md)
- [Geospatial Operators](../guide/geospatial-operators.md)
- [DateTime Operators](../guide/datetime-operators.md)
- [API Reference](./reference.md)



## Core Types

### Expression`<T>`

The main type for filter expressions.

```typescript
type Expression<T> = {
  [K in keyof T]?: OperatorExpression<T[K]> | T[K];
} | LogicalExpression<T>;
```

**Usage**:
```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

const expression: Expression<User> = {
  age: { $gte: 18 },
  name: { $regex: /john/i }
};
```

### OperatorExpression`<T>`

Type for operator-based expressions.

```typescript
interface OperatorExpression<T> {
  $eq?: T;
  $ne?: T;
  $gt?: T extends number | Date ? T : never;
  $gte?: T extends number | Date ? T : never;
  $lt?: T extends number | Date ? T : never;
  $lte?: T extends number | Date ? T : never;
  $in?: T[];
  $nin?: T[];
  $contains?: T extends Array<infer U> ? U : never;
  $regex?: T extends string ? RegExp : never;
  $startsWith?: T extends string ? string : never;
  $endsWith?: T extends string ? string : never;
}
```

### LogicalExpression`<T>`

Type for logical operators.

```typescript
interface LogicalExpression<T> {
  $and?: Expression<T>[];
  $or?: Expression<T>[];
  $not?: Expression<T>;
}
```

## Filter Options

### FilterOptions

Configuration options for filtering.

```typescript
interface FilterOptions {
  memoize?: boolean;
  caseSensitive?: boolean;
  debug?: boolean;
  lazy?: boolean;
}
```

**Properties**:
- `memoize` - Enable result caching
- `caseSensitive` - Case-sensitive string comparisons
- `debug` - Enable debug logging
- `lazy` - Use lazy evaluation

## React Types

### UseFilterResult`<T>`

Return type for `useFilter` hook.

```typescript
interface UseFilterResult<T> {
  filtered: T[];
  isFiltering: boolean;
}
```

**Usage**:
```typescript
const { filtered, isFiltering }: UseFilterResult<User> = useFilter(
  users,
  expression
);
```

### UseFilteredStateResult`<T>`

Return type for `useFilteredState` hook.

```typescript
interface UseFilteredStateResult<T> {
  data: T[];
  setData: (data: T[]) => void;
  expression: Expression<T>;
  setExpression: (expression: Expression<T>) => void;
  filtered: T[];
  isFiltering: boolean;
}
```

### UseDebouncedFilterOptions

Options for debounced filtering.

```typescript
interface UseDebouncedFilterOptions extends FilterOptions {
  delay?: number;
}
```

### UseDebouncedFilterResult`<T>`

Return type for `useDebouncedFilter` hook.

```typescript
interface UseDebouncedFilterResult<T> {
  filtered: T[];
  isFiltering: boolean;
  isPending: boolean;
}
```

### UsePaginatedFilterResult`<T>`

Return type for `usePaginatedFilter` hook.

```typescript
interface UsePaginatedFilterResult<T> {
  filtered: T[];
  isFiltering: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
```

## Vue Types

### UseFilterResult (Vue)

Return type for Vue `useFilter` composable.

```typescript
interface UseFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
}
```

**Usage**:
```typescript
import { ref } from 'vue';
import type { ComputedRef } from 'vue';

const { filtered, isFiltering }: {
  filtered: ComputedRef<User[]>;
  isFiltering: ComputedRef<boolean>;
} = useFilter(users, expression);
```

### UseFilteredStateResult (Vue)

Return type for Vue `useFilteredState` composable.

```typescript
interface UseFilteredStateResult<T> {
  data: Ref<T[]>;
  expression: Ref<Expression<T>>;
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
}
```

### UseDebouncedFilterResult (Vue)

Return type for Vue `useDebouncedFilter` composable.

```typescript
interface UseDebouncedFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
  isPending: Ref<boolean>;
}
```

### UsePaginatedFilterResult (Vue)

Return type for Vue `usePaginatedFilter` composable.

```typescript
interface UsePaginatedFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
  currentPage: Ref<number>;
  totalPages: ComputedRef<number>;
  pageSize: Ref<number>;
  totalItems: ComputedRef<number>;
  hasNextPage: ComputedRef<boolean>;
  hasPreviousPage: ComputedRef<boolean>;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
```

## Svelte Types

### UseFilterResult (Svelte)

Return type for Svelte `useFilter` store.

```typescript
interface UseFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
}
```

**Usage**:
```typescript
import type { Readable } from 'svelte/store';

const { filtered, isFiltering }: {
  filtered: Readable<User[]>;
  isFiltering: Readable<boolean>;
} = useFilter(users, expression);
```

### UseFilteredStateResult (Svelte)

Return type for Svelte `useFilteredState` store.

```typescript
interface UseFilteredStateResult<T> {
  data: Writable<T[]>;
  expression: Writable<Expression<T>>;
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
}
```

### UseDebouncedFilterResult (Svelte)

Return type for Svelte `useDebouncedFilter` store.

```typescript
interface UseDebouncedFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
  isPending: Readable<boolean>;
}
```

### UsePaginatedFilterResult (Svelte)

Return type for Svelte `usePaginatedFilter` store.

```typescript
interface UsePaginatedFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
  currentPage: Writable<number>;
  totalPages: Readable<number>;
  pageSize: Writable<number>;
  totalItems: Readable<number>;
  hasNextPage: Readable<boolean>;
  hasPreviousPage: Readable<boolean>;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
```

## Utility Types

### Operator

Union type of all operator names.

```typescript
type Operator =
  | '$eq'
  | '$ne'
  | '$gt'
  | '$gte'
  | '$lt'
  | '$lte'
  | '$in'
  | '$nin'
  | '$contains'
  | '$regex'
  | '$startsWith'
  | '$endsWith';
```

### LogicalOperator

Union type of logical operator names.

```typescript
type LogicalOperator = '$and' | '$or' | '$not';
```

### ComparisonOperator

Union type of comparison operator names.

```typescript
type ComparisonOperator = '$eq' | '$ne' | '$gt' | '$gte' | '$lt' | '$lte';
```

### ArrayOperator

Union type of array operator names.

```typescript
type ArrayOperator = '$in' | '$nin' | '$contains';
```

### StringOperator

Union type of string operator names.

```typescript
type StringOperator = '$regex' | '$startsWith' | '$endsWith';
```

## Advanced Types

### DeepPartial`<T>`

Recursive partial type for nested objects.

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### NestedKeyOf`<T>`

Type for nested property paths.

```typescript
type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`;
}[keyof T & string];
```

**Usage**:
```typescript
interface User {
  profile: {
    address: {
      city: string;
    };
  };
}

type UserKeys = NestedKeyOf<User>;
```

## Type Guards

### isExpression

Type guard for expressions.

```typescript
function isExpression<T>(value: unknown): value is Expression<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}
```

### isOperatorExpression

Type guard for operator expressions.

```typescript
function isOperatorExpression<T>(
  value: unknown
): value is OperatorExpression<T> {
  if (typeof value !== 'object' || value === null) return false;

  const operators = [
    '$eq', '$ne', '$gt', '$gte', '$lt', '$lte',
    '$in', '$nin', '$contains', '$regex',
    '$startsWith', '$endsWith'
  ];

  return Object.keys(value).some(key => operators.includes(key));
}
```

## Generic Constraints

### Filterable

Constraint for filterable types.

```typescript
type Filterable = Record<string, any>;
```

### FilterableArray`<T>`

Constraint for filterable arrays.

```typescript
type FilterableArray<T extends Filterable> = T[];
```

## Example Usage

### Type-Safe Filter

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  tags: string[];
}

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999, category: 'electronics', inStock: true, tags: ['tech'] }
];

const expression: Expression<Product> = {
  $and: [
    { price: { $gte: 500 } },
    { price: { $lte: 1500 } },
    { category: { $eq: 'electronics' } },
    { inStock: { $eq: true } },
    { tags: { $contains: 'tech' } }
  ]
};

const { filtered }: UseFilterResult<Product> = useFilter(products, expression);
```

### Generic Filter Function

```typescript
function createFilter<T extends Filterable>(
  expression: Expression<T>,
  options?: FilterOptions
) {
  return (data: T[]): T[] => {
    return filter(data, expression, options);
  };
}

const activeUserFilter = createFilter<User>({
  status: { $eq: 'active' }
});

const activeUsers = activeUserFilter(users);
```

## Related Resources

- [Operators Reference](/api/operators)
- [Basic Filtering](/guide/basic-filtering)
- [React Integration](/frameworks/react)
- [Vue Integration](/frameworks/vue)
- [Svelte Integration](/frameworks/svelte)

