# Type System

Understanding the TypeScript type system in @mcabreradev/filter.

## Overview

@mcabreradev/filter is built with TypeScript-first design, providing full type safety and excellent IDE support through advanced type inference.

## Core Type Definitions

### Expression<T>

The main type for filter expressions that adapts to your data structure.

```typescript
type Expression<T> = {
  [K in keyof T]?: OperatorExpression<T[K]> | T[K];
} | LogicalExpression<T>;
```

**How it works**:
- Maps over all properties of type `T`
- Each property can have an operator expression or direct value
- Supports logical expressions (`$and`, `$or`, `$not`)

**Example**:
```typescript
interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

const expression: Expression<User> = {
  age: { $gte: 18 },
  active: { $eq: true },
  name: { $regex: /john/i }
};
```

### OperatorExpression<T>

Type-safe operator expressions that adapt to property types.

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

**Type Constraints**:
- Comparison operators (`$gt`, `$gte`, `$lt`, `$lte`) only work with `number` or `Date`
- String operators (`$regex`, `$startsWith`, `$endsWith`) only work with `string`
- Array operators (`$contains`) only work with arrays

**Example**:
```typescript
interface Product {
  price: number;
  name: string;
  tags: string[];
}

const expression: Expression<Product> = {
  price: { $gte: 100 },
  name: { $regex: /laptop/i },
  tags: { $contains: 'electronics' }
};
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

### Vue Types

```typescript
import type { Ref, ComputedRef } from 'vue';

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
```

### Svelte Types

```typescript
import type { Readable, Writable } from 'svelte/store';

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
```

## Type Guards

### Expression Type Guard

```typescript
function isExpression<T>(value: unknown): value is Expression<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
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
    '$eq', '$ne', '$gt', '$gte', '$lt', '$lte',
    '$in', '$nin', '$contains', '$regex',
    '$startsWith', '$endsWith'
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

## Utility Types

### DeepPartial<T>

Make all properties and nested properties optional:

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### NestedKeyOf<T>

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

```typescript
const users = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 }
];

const { filtered } = useFilter(users, {
  age: { $gte: 18 }
});
```

### Explicit Type Parameters

```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

const { filtered } = useFilter<User>([], {
  age: { $gte: 18 }
});
```

### Generic Components

```typescript
interface FilterListProps<T> {
  data: T[];
  expression: Expression<T>;
}

function FilterList<T>({ data, expression }: FilterListProps<T>) {
  const { filtered } = useFilter<T>(data, expression);

  return (
    <div>
      {filtered.map((item, index) => (
        <div key={index}>{JSON.stringify(item)}</div>
      ))}
    </div>
  );
}
```

## Type Safety Best Practices

### 1. Always Provide Type Parameters

```typescript
const { filtered } = useFilter<User>(data, expression);
```

### 2. Use Interfaces Over Types

```typescript
interface User {
  id: number;
  name: string;
}

type User = {
  id: number;
  name: string;
};
```

### 3. Avoid `any` and `unknown`

```typescript
const expression: Expression<any> = { ... };

const expression: Expression<User> = { ... };
```

### 4. Use Type Guards

```typescript
if (isOperatorExpression(value)) {
  // TypeScript knows value is OperatorExpression
}
```

### 5. Leverage Type Inference

```typescript
const expression = {
  age: { $gte: 18 }
} satisfies Expression<User>;
```

## Common Type Errors

### Error: Property does not exist

```typescript
interface User {
  name: string;
}

const expression: Expression<User> = {
  age: { $gte: 18 }
};
```

**Solution**: Add the property to the interface or use a different property.

### Error: Type is not assignable

```typescript
interface User {
  name: string;
}

const expression: Expression<User> = {
  name: { $gt: 'John' }
};
```

**Solution**: Use the correct operator for the type (string doesn't support `$gt`).

### Error: Generic type requires type argument

```typescript
const { filtered } = useFilter(data, expression);
```

**Solution**: Provide explicit type parameter:
```typescript
const { filtered } = useFilter<User>(data, expression);
```

## Related Resources

- [Architecture](/advanced/architecture)
- [API Types](/api/types)
- [Best Practices](/guide/best-practices)
- [TypeScript Configuration](/guide/configuration)

