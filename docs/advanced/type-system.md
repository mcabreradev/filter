# Type System

Understanding the TypeScript type system in @mcabreradev/filter.

## Overview

@mcabreradev/filter is built with TypeScript-first design, providing full type safety and intelligent autocomplete through advanced type inference. The type system adapts to your data structure, suggesting only valid operators for each property type.

## Core Type Definitions

### Expression`<T>`

The main type for filter expressions that adapts to your data structure with intelligent operator suggestions.

```typescript
type Expression<T> = 
  | PrimitiveExpression
  | PredicateFunction<T>
  | ObjectExpression<T>
  | LogicalExpression<T>;

// Object expression with typed operators
type ObjectExpression<T> = {
  [K in keyof T]?: 
    | T[K]
    | OperatorExpression<T[K]>
    | T[K][];  // Array OR syntax (v5.5.0+)
} & {
  $and?: Expression<T>[];
  $or?: Expression<T>[];
  $not?: Expression<T>;
};

// Primitive expressions
type PrimitiveExpression = string | number | boolean | null;

// Predicate function
type PredicateFunction<T> = (item: T) => boolean;

// Logical expressions
type LogicalExpression<T> = {
  $and?: Expression<T>[];
  $or?: Expression<T>[];
  $not?: Expression<T>;
};
```

**How it works**:
- Maps over all properties of type `T`
- Each property can have an operator expression, direct value, or array of values (OR logic)
- Supports logical expressions (`$and`, `$or`, `$not`)
- TypeScript suggests only valid operators for each property type

**Example**:
```typescript
interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
  tags: string[];
  location: GeoPoint;
  birthDate: Date;
}

const expression: Expression<User> = {
  // Number property - suggests: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin
  age: { $gte: 18, $lte: 65 },
  
  // String property - suggests: $eq, $ne, $startsWith, $endsWith, $contains, $regex, $match, $in, $nin
  name: { $startsWith: 'John' },
  
  // Array property - suggests: $contains, $size, $in, $nin
  tags: { $contains: 'premium' },
  
  // GeoPoint property - suggests: $near, $geoBox, $geoPolygon
  location: {
    $near: {
      center: { lat: 52.52, lng: 13.405 },
      maxDistanceMeters: 5000
    }
  },
  
  // Date property - suggests: $recent, $upcoming, $dayOfWeek, $timeOfDay, $age, etc.
  birthDate: { $age: { min: 18, max: 65, unit: 'years' } },
  
  // Boolean property - suggests: $eq, $ne
  active: { $eq: true },
  
  // Array OR syntax (v5.5.0+)
  id: [1, 2, 3]  // Matches id === 1 OR id === 2 OR id === 3
};
```

### OperatorExpression`<T>`

Type-safe operator expressions that adapt to property types with intelligent autocomplete.

```typescript
type OperatorExpression<T> = 
  & ComparisonOperators<T>
  & ArrayOperators<T>
  & StringOperators<T>
  & GeospatialOperators<T>
  & DateTimeOperators<T>;

// Comparison operators (available for all types)
interface ComparisonOperators<T> {
  $eq?: T;
  $ne?: T;
  $gt?: T extends number | Date ? T : never;
  $gte?: T extends number | Date ? T : never;
  $lt?: T extends number | Date ? T : never;
  $lte?: T extends number | Date ? T : never;
}

// Array operators (available for array types)
interface ArrayOperators<T> {
  $in?: T[];
  $nin?: T[];
  $contains?: T extends Array<infer U> ? U : never;
  $size?: T extends unknown[] ? number : never;
}

// String operators (available for string types)
interface StringOperators<T> {
  $startsWith?: T extends string ? string : never;
  $endsWith?: T extends string ? string : never;
  $contains?: T extends string ? string : never;
  $regex?: T extends string ? RegExp | string : never;
  $match?: T extends string ? RegExp | string : never;
}

// Geospatial operators (v5.6.0+, available for GeoPoint types)
interface GeospatialOperators<T> {
  $near?: T extends GeoPoint ? NearQuery : never;
  $geoBox?: T extends GeoPoint ? BoundingBox : never;
  $geoPolygon?: T extends GeoPoint ? PolygonQuery : never;
}

// Date/time operators (v5.6.0+, available for Date types)
interface DateTimeOperators<T> {
  $recent?: T extends Date ? RelativeTimeQuery : never;
  $upcoming?: T extends Date ? RelativeTimeQuery : never;
  $dayOfWeek?: T extends Date ? number[] : never;
  $timeOfDay?: T extends Date ? TimeOfDayQuery : never;
  $age?: T extends Date ? AgeQuery : never;
  $isWeekday?: T extends Date ? boolean : never;
  $isWeekend?: T extends Date ? boolean : never;
  $isBefore?: T extends Date ? Date : never;
  $isAfter?: T extends Date ? Date : never;
}
```

**Type Constraints**:
- Comparison operators (`$gt`, `$gte`, `$lt`, `$lte`) only work with `number` or `Date`
- String operators (`$regex`, `$startsWith`, `$endsWith`, `$contains`, `$match`) only work with `string`
- Array operators (`$contains`, `$size`) only work with arrays
- Geospatial operators (`$near`, `$geoBox`, `$geoPolygon`) only work with `GeoPoint`
- Date/time operators (`$recent`, `$upcoming`, `$dayOfWeek`, etc.) only work with `Date`

**Example**:
```typescript
interface Product {
  price: number;
  name: string;
  tags: string[];
  location: GeoPoint;
  createdAt: Date;
}

const expression: Expression<Product> = {
  // TypeScript suggests only valid operators for each property
  price: { $gte: 100, $lte: 500 },  // number: $gt, $gte, $lt, $lte, $eq, $ne, $in, $nin
  name: { $startsWith: 'Pro' },      // string: $startsWith, $endsWith, $contains, $regex, $match, $eq, $ne, $in, $nin
  tags: { $contains: 'sale' },       // array: $contains, $size, $in, $nin
  location: {                        // GeoPoint: $near, $geoBox, $geoPolygon
    $near: {
      center: { lat: 40.7128, lng: -74.0060 },
      maxDistanceMeters: 10000
    }
  },
  createdAt: {                       // Date: $recent, $upcoming, $dayOfWeek, $timeOfDay, $age, etc.
    $recent: { days: 30 }
  }
};
```

## Geospatial Types (v5.6.0+)

### GeoPoint

Represents a geographic coordinate point.

```typescript
export interface GeoPoint {
  lat: number;  // Latitude: -90 to 90
  lng: number;  // Longitude: -180 to 180
}
```

### NearQuery

Query for finding points within a radius.

```typescript
export interface NearQuery {
  center: GeoPoint;
  maxDistanceMeters: number;  // Maximum distance in meters
}
```

**Example**:
```typescript
interface Restaurant {
  name: string;
  location: GeoPoint;
}

const expression: Expression<Restaurant> = {
  location: {
    $near: {
      center: { lat: 40.7128, lng: -74.0060 },
      maxDistanceMeters: 5000  // 5km radius
    }
  }
};
```

### BoundingBox

Defines a rectangular geographic area.

```typescript
export interface BoundingBox {
  southwest: GeoPoint;  // Southwest corner
  northeast: GeoPoint;  // Northeast corner
}
```

**Example**:
```typescript
const expression: Expression<Restaurant> = {
  location: {
    $geoBox: {
      southwest: { lat: 40.7, lng: -74.1 },
      northeast: { lat: 40.8, lng: -73.9 }
    }
  }
};
```

### PolygonQuery

Defines a polygon for containment queries.

```typescript
export interface PolygonQuery {
  points: GeoPoint[];  // Array of points defining the polygon
}
```

**Example**:
```typescript
const expression: Expression<Restaurant> = {
  location: {
    $geoPolygon: {
      points: [
        { lat: 40.7128, lng: -74.0060 },
        { lat: 40.7580, lng: -73.9855 },
        { lat: 40.7489, lng: -73.9680 },
        { lat: 40.7128, lng: -74.0060 }  // Close the polygon
      ]
    }
  }
};
```

## Date/Time Types (v5.6.0+)

### RelativeTimeQuery

Query for relative time ranges (last/next N days/hours/minutes).

```typescript
export interface RelativeTimeQuery {
  days?: number;     // Number of days
  hours?: number;    // Number of hours
  minutes?: number;  // Number of minutes
}
```

**Example**:
```typescript
interface Event {
  name: string;
  date: Date;
}

const expression: Expression<Event> = {
  date: {
    $recent: { days: 7 }      // Events in last 7 days
  }
};

const upcoming: Expression<Event> = {
  date: {
    $upcoming: { hours: 24 }  // Events in next 24 hours
  }
};
```

### TimeOfDayQuery

Query for filtering by time of day.

```typescript
export interface TimeOfDayQuery {
  start: number;  // Start hour (0-23)
  end: number;    // End hour (0-23)
}
```

**Example**:
```typescript
const expression: Expression<Event> = {
  date: {
    $timeOfDay: {
      start: 9,   // 9 AM
      end: 17     // 5 PM
    }
  }
};
```

### AgeQuery

Query for calculating and filtering by age.

```typescript
export interface AgeQuery {
  min?: number;                              // Minimum age
  max?: number;                              // Maximum age
  unit?: 'years' | 'months' | 'days';       // Age unit (default: 'years')
}
```

**Example**:
```typescript
interface User {
  name: string;
  birthDate: Date;
}

const expression: Expression<User> = {
  birthDate: {
    $age: {
      min: 18,
      max: 65,
      unit: 'years'
    }
  }
};
```

## Debug Types (v5.5.0+)

### DebugResult

Result from debug-enabled filtering.

```typescript
export interface DebugResult<T> {
  items: T[];                    // Filtered items
  stats: DebugStats;             // Performance and match statistics
  debug: {
    tree: DebugNode;             // Expression tree
    expression: Expression<T>;    // Original expression
  };
  print: () => void;             // Print debug tree to console
}
```

### DebugStats

Statistics about filter execution.

```typescript
export interface DebugStats {
  matched: number;              // Number of matched items
  total: number;                // Total number of items
  percentage: number;           // Match percentage
  executionTime: number;        // Execution time in milliseconds
  conditionsEvaluated: number;  // Number of conditions evaluated
}
```

### DebugNode

Node in the debug expression tree.

```typescript
export interface DebugNode {
  type: 'logical' | 'operator' | 'property' | 'primitive';
  label: string;
  operator?: string;
  matched?: number;
  total?: number;
  children?: DebugNode[];
}
```

**Example**:
```typescript
import { filterDebug } from '@mcabreradev/filter';

const result = filterDebug(users, { age: { $gte: 18 } });

console.log(result.stats);
// {
//   matched: 150,
//   total: 200,
//   percentage: 75,
//   executionTime: 1.23,
//   conditionsEvaluated: 200
// }

result.print();  // Print colorized debug tree
```

## Configuration Types

### FilterOptions

Configuration options for filtering.

```typescript
export interface FilterOptions {
  caseSensitive?: boolean;      // Case-sensitive string matching (default: false)
  maxDepth?: number;            // Max depth for nested objects (default: 3, range: 1-10)
  enableCache?: boolean;        // Enable result caching (default: false)
  debug?: boolean;              // Enable debug mode (default: false)
  verbose?: boolean;            // Show detailed debug info (default: false)
  showTimings?: boolean;        // Show execution timings (default: false)
  colorize?: boolean;           // Use ANSI colors in debug output (default: false)
  customComparator?: Comparator; // Custom comparison function
}
```

### FilterConfig

Internal configuration after merging with defaults.

```typescript
export interface FilterConfig {
  caseSensitive: boolean;
  maxDepth: number;
  enableCache: boolean;
  debug: boolean;
  verbose: boolean;
  showTimings: boolean;
  colorize: boolean;
  customComparator?: Comparator;
}
```

### Comparator

Custom comparison function type.

```typescript
export type Comparator = (actual: unknown, expected: unknown) => boolean;
```

**Example**:
```typescript
const customComparator: Comparator = (actual, expected) => {
  // Custom fuzzy string matching
  if (typeof actual === 'string' && typeof expected === 'string') {
    return actual.toLowerCase().includes(expected.toLowerCase());
  }
  return actual === expected;
};

const filtered = filter(users, 'john', { customComparator });
```

## Advanced Type Features

### Nested Object Support

The type system supports nested object filtering with dot notation.

```typescript
interface User {
  profile: {
    address: {
      city: string;
      country: string;
    };
  };
}

const expression: Expression<User> = {
  'profile.address.city': { $eq: 'New York' }
};

const expression2: Expression<User> = {
  profile: {
    address: {
      city: { $eq: 'New York' }
    }
  }
};
```

### Type Inference

The library automatically infers types from your data:

```typescript
const users = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 }
];

const { filtered } = useFilter(users, {
  age: { $gte: 18 }
});
```

### Generic Constraints

Use generic constraints for reusable filter functions:

```typescript
function createAgeFilter<T extends { age: number }>(minAge: number): Expression<T> {
  return {
    age: { $gte: minAge }
  };
}

interface User {
  id: number;
  name: string;
  age: number;
}

interface Employee {
  employeeId: string;
  age: number;
  department: string;
}

const userFilter = createAgeFilter<User>(18);
const employeeFilter = createAgeFilter<Employee>(21);
```

## Framework-Specific Types

### React Types

```typescript
interface UseFilterResult<T> {
  filtered: T[];
  isFiltering: boolean;
}

interface UseFilteredStateResult<T> {
  data: T[];
  setData: (data: T[]) => void;
  expression: Expression<T>;
  setExpression: (expression: Expression<T>) => void;
  filtered: T[];
  isFiltering: boolean;
}

interface UseDebouncedFilterResult<T> {
  filtered: T[];
  isFiltering: boolean;
  isPending: boolean;
}

interface UseDebouncedFilterOptions extends FilterOptions {
  delay?: number;  // Debounce delay in milliseconds (default: 300)
}

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

interface UsePaginatedFilterOptions extends FilterOptions {
  initialPage?: number;    // Initial page number (default: 1)
  initialPageSize?: number; // Initial page size (default: 10)
}
```

**Example**:
```typescript
import { useFilter, useDebouncedFilter, usePaginatedFilter } from '@mcabreradev/filter/react';

function UserList() {
  // Basic filtering
  const { filtered, isFiltering } = useFilter(users, { active: true });
  
  // Debounced filtering for search
  const [search, setSearch] = useState('');
  const { filtered: searchResults, isPending } = useDebouncedFilter(
    users,
    { name: { $contains: search } },
    { delay: 300 }
  );
  
  // Paginated filtering
  const {
    filtered: paginatedUsers,
    currentPage,
    totalPages,
    nextPage,
    previousPage
  } = usePaginatedFilter(
    users,
    { active: true },
    { initialPage: 1, initialPageSize: 20 }
  );
  
  return <div>{/* ... */}</div>;
}
```

### Vue Types

```typescript
import type { Ref, ComputedRef } from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

interface UseFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
}

interface UseFilteredStateResult<T> {
  data: Ref<T[]>;
  expression: Ref<Expression<T>>;
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
}

interface UseDebouncedFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
  isPending: Ref<boolean>;
}

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

**Example**:
```typescript
import { ref } from 'vue';
import { useFilter, useDebouncedFilter } from '@mcabreradev/filter/vue';

const users = ref([...]);
const searchTerm = ref('');

// Basic filtering
const { filtered, isFiltering } = useFilter(users, { active: true });

// Debounced filtering
const { filtered: searchResults, isPending } = useDebouncedFilter(
  users,
  { name: { $contains: searchTerm } },
  { delay: 300 }
);
```

### Svelte Types

```typescript
import type { Readable, Writable } from 'svelte/store';

type MaybeStore<T> = T | Readable<T> | Writable<T>;

interface UseFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
}

interface UseFilteredStateResult<T> {
  data: Writable<T[]>;
  expression: Writable<Expression<T>>;
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
}

interface UseDebouncedFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
  isPending: Readable<boolean>;
}

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

**Example**:
```typescript
import { writable } from 'svelte/store';
import { useFilter } from '@mcabreradev/filter/svelte';

const users = writable([...]);
const searchTerm = writable('');

const { filtered, isFiltering } = useFilter(
  users,
  { name: { $contains: searchTerm } }
);
```

## Type Guards

### Expression Type Guard

```typescript
function isExpression<T>(value: unknown): value is Expression<T> {
  return (
    typeof value === 'function' ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    (typeof value === 'object' && value !== null && !Array.isArray(value))
  );
}
```

### Operator Expression Type Guard

```typescript
function isOperatorExpression<T>(
  value: unknown
): value is OperatorExpression<T> {
  if (typeof value !== 'object' || value === null) return false;

  const operators = [
    // Comparison
    '$eq', '$ne', '$gt', '$gte', '$lt', '$lte',
    // Array
    '$in', '$nin', '$contains', '$size',
    // String
    '$regex', '$match', '$startsWith', '$endsWith',
    // Geospatial
    '$near', '$geoBox', '$geoPolygon',
    // Date/Time
    '$recent', '$upcoming', '$dayOfWeek', '$timeOfDay', '$age',
    '$isWeekday', '$isWeekend', '$isBefore', '$isAfter'
  ];

  return Object.keys(value).some(key => operators.includes(key));
}
```

### Logical Expression Type Guard

```typescript
function isLogicalExpression<T>(
  value: unknown
): value is LogicalExpression<T> {
  if (typeof value !== 'object' || value === null) return false;

  return '$and' in value || '$or' in value || '$not' in value;
}
```

### GeoPoint Type Guard

```typescript
function isGeoPoint(value: unknown): value is GeoPoint {
  return (
    typeof value === 'object' &&
    value !== null &&
    'lat' in value &&
    'lng' in value &&
    typeof (value as GeoPoint).lat === 'number' &&
    typeof (value as GeoPoint).lng === 'number' &&
    (value as GeoPoint).lat >= -90 &&
    (value as GeoPoint).lat <= 90 &&
    (value as GeoPoint).lng >= -180 &&
    (value as GeoPoint).lng <= 180
  );
}
```

**Example**:
```typescript
const value = { lat: 40.7128, lng: -74.0060 };

if (isGeoPoint(value)) {
  // TypeScript knows value is GeoPoint
  console.log(value.lat, value.lng);
}
```

## Utility Types

### DeepPartial`<T>`

Make all properties and nested properties optional:

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### NestedKeyOf`<T>`

Get all possible nested property paths:

```typescript
type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`;
}[keyof T & string];

interface User {
  profile: {
    address: {
      city: string;
    };
  };
}

type UserKeys = NestedKeyOf<User>;
```

### Filterable

Constraint for filterable types:

```typescript
type Filterable = Record<string, any>;

type FilterableArray<T extends Filterable> = T[];
```

## Type-Safe Patterns

### Builder Pattern

```typescript
class FilterBuilder<T> {
  private expression: Expression<T> = {};

  where<K extends keyof T>(
    key: K,
    operator: OperatorExpression<T[K]>
  ): this {
    this.expression[key] = operator;
    return this;
  }

  and(expressions: Expression<T>[]): this {
    this.expression = {
      $and: expressions
    } as Expression<T>;
    return this;
  }

  build(): Expression<T> {
    return this.expression;
  }
}

const filter = new FilterBuilder<User>()
  .where('age', { $gte: 18 })
  .where('status', { $eq: 'active' })
  .build();
```

### Factory Pattern

```typescript
function createFilterFactory<T>() {
  return {
    equals<K extends keyof T>(key: K, value: T[K]): Expression<T> {
      return { [key]: { $eq: value } } as Expression<T>;
    },

    greaterThan<K extends keyof T>(
      key: K,
      value: T[K] extends number | Date ? T[K] : never
    ): Expression<T> {
      return { [key]: { $gt: value } } as Expression<T>;
    },

    contains<K extends keyof T>(
      key: K,
      value: T[K] extends Array<infer U> ? U : never
    ): Expression<T> {
      return { [key]: { $contains: value } } as Expression<T>;
    }
  };
}

const userFilters = createFilterFactory<User>();
const expression = userFilters.equals('status', 'active');
```

## Type Inference Examples

### Automatic Type Inference

TypeScript automatically infers types from your data:

```typescript
const users = [
  { id: 1, name: 'John', age: 25, location: { lat: 40.7128, lng: -74.0060 } },
  { id: 2, name: 'Jane', age: 30, location: { lat: 51.5074, lng: -0.1278 } }
];

// TypeScript infers User type from the array
const { filtered } = useFilter(users, {
  age: { $gte: 18 },
  location: {
    $near: {
      center: { lat: 40.7128, lng: -74.0060 },
      maxDistanceMeters: 5000
    }
  }
});
// filtered is inferred as typeof users[0][]
```

### Explicit Type Parameters

Provide explicit types for better type safety:

```typescript
interface User {
  id: number;
  name: string;
  age: number;
  location: GeoPoint;
  birthDate: Date;
  tags: string[];
}

const { filtered } = useFilter<User>([], {
  age: { $gte: 18 },
  birthDate: { $age: { min: 18, unit: 'years' } },
  location: { $near: { center: { lat: 40, lng: -74 }, maxDistanceMeters: 5000 } },
  tags: { $contains: 'premium' }
});
// filtered is User[]
```

### Intelligent Operator Autocomplete

TypeScript suggests only valid operators for each property type:

```typescript
interface Product {
  id: number;          // number property
  name: string;        // string property
  price: number;       // number property
  tags: string[];      // array property
  location: GeoPoint;  // GeoPoint property
  createdAt: Date;     // Date property
  inStock: boolean;    // boolean property
}

const expression: Expression<Product> = {
  // For number properties, TypeScript suggests:
  // $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin
  id: { $gte: 100 },
  price: { $gte: 50, $lte: 500 },
  
  // For string properties, TypeScript suggests:
  // $eq, $ne, $startsWith, $endsWith, $contains, $regex, $match, $in, $nin
  name: { $startsWith: 'Pro' },
  
  // For array properties, TypeScript suggests:
  // $contains, $size, $in, $nin
  tags: { $contains: 'electronics' },
  
  // For GeoPoint properties, TypeScript suggests:
  // $near, $geoBox, $geoPolygon
  location: {
    $near: {
      center: { lat: 40.7128, lng: -74.0060 },
      maxDistanceMeters: 10000
    }
  },
  
  // For Date properties, TypeScript suggests:
  // $recent, $upcoming, $dayOfWeek, $timeOfDay, $age,
  // $isWeekday, $isWeekend, $isBefore, $isAfter, $eq, $ne, $gt, $gte, $lt, $lte
  createdAt: {
    $recent: { days: 30 }
  },
  
  // For boolean properties, TypeScript suggests:
  // $eq, $ne
  inStock: { $eq: true }
};
```

### Array OR Syntax (v5.5.0+)

TypeScript properly types array OR syntax:

```typescript
const expression: Expression<Product> = {
  // Array of values - TypeScript knows this is OR logic
  id: [1, 2, 3],              // id === 1 OR id === 2 OR id === 3
  name: ['Laptop', 'Mouse'],  // name === 'Laptop' OR name === 'Mouse'
  
  // Works with any property type
  price: [99, 199, 299],
  inStock: [true]
};
```

### Generic Components

Create type-safe reusable components:

```typescript
interface FilterListProps<T> {
  data: T[];
  expression: Expression<T>;
  renderItem: (item: T) => React.ReactNode;
}

function FilterList<T>({ data, expression, renderItem }: FilterListProps<T>) {
  const { filtered } = useFilter<T>(data, expression);

  return (
    <div>
      {filtered.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  );
}

// Usage with type inference
<FilterList
  data={users}
  expression={{ age: { $gte: 18 } }}
  renderItem={(user) => <div>{user.name}</div>}
/>
```

## Type Safety Best Practices

### 1. Always Provide Type Parameters for Empty Arrays

```typescript
// ❌ Bad - TypeScript can't infer the type
const { filtered } = useFilter<User>([], expression);

// ✅ Good - Explicit type parameter
const { filtered } = useFilter<User>([], { age: { $gte: 18 } });
```

### 2. Use Interfaces Over Type Aliases

```typescript
// ✅ Good - Interfaces are more flexible
interface User {
  id: number;
  name: string;
  location: GeoPoint;
}

// ❌ Avoid - Type aliases are less extensible
type User = {
  id: number;
  name: string;
  location: GeoPoint;
};
```

### 3. Avoid `any` and `unknown`

```typescript
// ❌ Bad - Loses type safety
const expression: Expression<any> = { ... };

// ✅ Good - Maintains type safety
const expression: Expression<User> = { ... };
```

### 4. Use Type Guards

```typescript
// ✅ Good - TypeScript knows the type after guard
if (isOperatorExpression(value)) {
  // TypeScript knows value is OperatorExpression
  console.log(value.$eq);
}

if (isGeoPoint(location)) {
  // TypeScript knows location is GeoPoint
  console.log(location.lat, location.lng);
}
```

### 5. Leverage Type Inference with `satisfies`

```typescript
// ✅ Good - Type checking with inference
const expression = {
  age: { $gte: 18 },
  location: {
    $near: {
      center: { lat: 40.7128, lng: -74.0060 },
      maxDistanceMeters: 5000
    }
  }
} satisfies Expression<User>;
```

### 6. Use Const Assertions for Literal Types

```typescript
// ✅ Good - Preserves literal types
const operators = ['$eq', '$ne', '$gt'] as const;
type Operator = typeof operators[number];

const weekdays = [1, 2, 3, 4, 5] as const;
const expression: Expression<Event> = {
  date: { $dayOfWeek: [...weekdays] }
};
```

### 7. Define Reusable Type Helpers

```typescript
// Create type helpers for common patterns
type AgeFilter<T extends { age: number }> = Expression<T>;
type LocationFilter<T extends { location: GeoPoint }> = Expression<T>;
type DateFilter<T extends { date: Date }> = Expression<T>;

// Use in your application
const ageFilter: AgeFilter<User> = { age: { $gte: 18 } };
const locationFilter: LocationFilter<Store> = {
  location: {
    $near: {
      center: { lat: 40, lng: -74 },
      maxDistanceMeters: 5000
    }
  }
};
```

## Common Type Errors

### Error: Property does not exist

```typescript
interface User {
  name: string;
}

// ❌ Error: Property 'age' does not exist on type 'User'
const expression: Expression<User> = {
  age: { $gte: 18 }
};
```

**Solution**: Add the property to the interface or use a different property.
```typescript
interface User {
  name: string;
  age: number;  // ✅ Add missing property
}

const expression: Expression<User> = {
  age: { $gte: 18 }  // ✅ Now works
};
```

### Error: Type is not assignable

```typescript
interface User {
  name: string;
}

// ❌ Error: Type 'string' is not assignable to type 'never'
const expression: Expression<User> = {
  name: { $gt: 'John' }  // $gt only works with number or Date
};
```

**Solution**: Use the correct operator for the type.
```typescript
const expression: Expression<User> = {
  name: { $startsWith: 'John' }  // ✅ Use string operators
};
```

### Error: Invalid operator for type

```typescript
interface Product {
  tags: string[];
}

// ❌ Error: Property '$startsWith' does not exist
const expression: Expression<Product> = {
  tags: { $startsWith: 'electronics' }  // $startsWith doesn't work with arrays
};
```

**Solution**: Use array-specific operators.
```typescript
const expression: Expression<Product> = {
  tags: { $contains: 'electronics' }  // ✅ Use array operators
};
```

### Error: Incorrect geospatial query structure

```typescript
interface Store {
  location: GeoPoint;
}

// ❌ Error: Property 'center' is missing
const expression: Expression<Store> = {
  location: {
    $near: {
      maxDistanceMeters: 5000
    }
  }
};
```

**Solution**: Provide complete query structure.
```typescript
const expression: Expression<Store> = {
  location: {
    $near: {
      center: { lat: 40.7128, lng: -74.0060 },  // ✅ Add center
      maxDistanceMeters: 5000
    }
  }
};
```

### Error: Generic type requires type argument

```typescript
// ❌ Error: Generic type 'useFilter' requires 1 type argument(s)
const { filtered } = useFilter(data, expression);
```

**Solution**: Provide explicit type parameter when type can't be inferred.
```typescript
// ✅ Option 1: Provide type parameter
const { filtered } = useFilter<User>(data, expression);

// ✅ Option 2: Use typed data
const users: User[] = data;
const { filtered } = useFilter(users, expression);
```

### Error: Invalid date/time query

```typescript
interface Event {
  date: Date;
}

// ❌ Error: Type '{ invalid: number }' is not assignable
const expression: Expression<Event> = {
  date: {
    $recent: { invalid: 7 }
  }
};
```

**Solution**: Use correct RelativeTimeQuery properties.
```typescript
const expression: Expression<Event> = {
  date: {
    $recent: { days: 7 }  // ✅ Use days, hours, or minutes
  }
};
```

## Related Resources

- [Architecture](/advanced/architecture)
- [Operators Guide](/guide/operators)
- [Geospatial Operators](/guide/geospatial-operators)
- [Date/Time Operators](/guide/datetime-operators)
- [Framework Integrations](/frameworks/overview)
- [API Reference](/api/reference)
- [Best Practices](/guide/best-practices)
- [TypeScript Configuration](/guide/configuration)

