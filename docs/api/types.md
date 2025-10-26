# TypeScript Types Reference

Complete TypeScript type definitions for @mcabreradev/filter.

## Core Types

### Expression<T>

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

### OperatorExpression<T>

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

### LogicalExpression<T>

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

### UseFilterResult<T>

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

### UseFilteredStateResult<T>

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

### UseDebouncedFilterResult<T>

Return type for `useDebouncedFilter` hook.

```typescript
interface UseDebouncedFilterResult<T> {
  filtered: T[];
  isFiltering: boolean;
  isPending: boolean;
}
```

### UsePaginatedFilterResult<T>

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

### DeepPartial<T>

Recursive partial type for nested objects.

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### NestedKeyOf<T>

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

### FilterableArray<T>

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

