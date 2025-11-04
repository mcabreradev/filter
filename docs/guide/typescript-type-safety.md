# TypeScript Type Safety

Complete guide to TypeScript type safety in @mcabreradev/filter, including dot notation paths, operator autocomplete, and advanced type patterns.

## Overview

@mcabreradev/filter provides comprehensive TypeScript support with:

- **Full Type Inference** - Automatic type detection for all operations
- **Dot Notation Types** - Type-safe nested property paths
- **Operator Autocomplete** - Context-aware operator suggestions
- **Generic Support** - Works with any TypeScript interface
- **Zero Configuration** - Works out of the box

::: tip Version Compatibility
TypeScript type safety features require TypeScript `>= 5.0` and @mcabreradev/filter `>= 5.0.0`
:::

## Basic Type Safety

### Simple Type Inference

```typescript
import { filter } from '@mcabreradev/filter';

interface User {
  name: string;
  age: number;
  active: boolean;
}

const users: User[] = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 17, active: false },
  { name: 'Charlie', age: 30, active: true }
];

// TypeScript infers return type as User[]
const adults = filter(users, { age: { $gte: 18 } });
// adults is User[]

// Type-safe property access
adults.forEach(user => {
  console.log(user.name); // ✅ OK
  console.log(user.invalid); // ❌ Error: Property 'invalid' does not exist
});
```

### Explicit Generic Types

```typescript
// Provide generic type explicitly
const filtered = filter<User>(users, { age: { $gte: 18 } });

// Works with complex types
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [...];
const expensive = filter<Product>(products, {
  price: { $gte: 1000 }
});
```

## Dot Notation Type Safety

### Built-in NestedKeyOf Type

The library provides `NestedKeyOf<T>` for type-safe dot notation:

```typescript
import type { NestedKeyOf } from '@mcabreradev/filter';

interface User {
  name: string;
  profile: {
    age: number;
    address: {
      city: string;
      country: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
  };
  settings: {
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
}

// Generate all valid paths
type UserPaths = NestedKeyOf<User>;
// Type: "name" | "profile" | "profile.age" | "profile.address" | 
//       "profile.address.city" | "profile.address.country" |
//       "profile.address.coordinates" | "profile.address.coordinates.lat" |
//       "profile.address.coordinates.lng" | "settings" | "settings.theme" |
//       "settings.notifications" | "settings.notifications.email" |
//       "settings.notifications.push"

// Type-safe expressions
const expression: Partial<Record<UserPaths, any>> = {
  'profile.age': { $gte: 18 },
  'profile.address.city': 'Berlin',
  'settings.notifications.email': true
};

filter(users, expression);

// ❌ TypeScript catches invalid paths
const invalid: Partial<Record<UserPaths, any>> = {
  'profile.invalid': true, // Error!
  'address.city': 'Berlin' // Error! (should be 'profile.address.city')
};
```

### typedFilter Function

Use `typedFilter` for maximum type safety:

```typescript
import { typedFilter } from '@mcabreradev/filter';

interface Product {
  name: string;
  pricing: {
    amount: number;
    currency: string;
  };
}

const products: Product[] = [...];

// ✅ Full autocomplete and type checking
typedFilter(products, {
  'pricing.amount': { $gte: 100 },
  'pricing.currency': 'USD'
});

// ❌ TypeScript error
typedFilter(products, {
  'pricing.invalid': true // Property 'pricing.invalid' does not exist
});

// ❌ TypeScript error
typedFilter(products, {
  'name.nested': 'error' // 'name' is string, not an object
});
```

## Operator Type Safety

### Context-Aware Operator Suggestions

TypeScript suggests only valid operators based on property types:

```typescript
interface User {
  name: string;
  age: number;
  tags: string[];
  active: boolean;
  birthDate: Date;
  location: { lat: number; lng: number };
}

// String property - suggests string operators
filter(users, {
  name: {
    // Autocomplete suggests: $eq, $ne, $in, $nin, $startsWith, 
    //                        $endsWith, $contains, $regex, $match
    $startsWith: 'A'
  }
});

// Number property - suggests comparison operators
filter(users, {
  age: {
    // Autocomplete suggests: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin
    $gte: 18,
    $lte: 65
  }
});

// Array property - suggests array operators
filter(users, {
  tags: {
    // Autocomplete suggests: $in, $nin, $contains, $size
    $contains: 'premium'
  }
});

// Boolean property - suggests equality operators
filter(users, {
  active: {
    // Autocomplete suggests: $eq, $ne
    $eq: true
  }
});

// Date property - suggests date/time operators
filter(users, {
  birthDate: {
    // Autocomplete suggests: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin,
    //                        $recent, $upcoming, $dayOfWeek, $timeOfDay,
    //                        $age, $isWeekday, $isWeekend, $isBefore, $isAfter
    $age: { min: 18 }
  }
});

// GeoPoint property - suggests geospatial operators
filter(users, {
  location: {
    // Autocomplete suggests: $near, $geoBox, $geoPolygon
    $near: {
      center: { lat: 52.52, lng: 13.405 },
      maxDistanceMeters: 5000
    }
  }
});
```

### Operator Type Definitions

```typescript
// Import all type utilities at once
import type {
  NestedKeyOf,
  Expression,
  ComparisonOperators,
  StringOperators,
  ArrayOperators,
  DateTimeOperators,
  GeospatialOperators,
  PathValue,
  DeepPartial
} from '@mcabreradev/filter';

// Use specific operator types
const ageFilter: ComparisonOperators<number> = {
  $gte: 18,
  $lte: 65
};

const nameFilter: StringOperators = {
  $startsWith: 'A',
  $endsWith: 'son'
};

const tagsFilter: ArrayOperators<string> = {
  $contains: 'premium',
  $size: 3
};

const dateFilter: DateTimeOperators = {
  $recent: { days: 7 },
  $dayOfWeek: [1, 2, 3, 4, 5]
};

const locationFilter: GeospatialOperators = {
  $near: {
    center: { lat: 52.52, lng: 13.405 },
    maxDistanceMeters: 5000
  }
};
```

## Expression Type

Use `Expression<T>` for type-safe filter expressions:

```typescript
import type { Expression } from '@mcabreradev/filter';

interface Product {
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

// Type-safe expression
const expression: Expression<Product> = {
  price: { $gte: 100, $lte: 500 },
  category: { $in: ['Electronics', 'Computers'] },
  inStock: true
};

// ❌ TypeScript catches errors
const invalid: Expression<Product> = {
  price: 'invalid', // Type error
  invalidProp: true // Property does not exist
};
```

## Advanced Type Patterns

### Generic Filter Functions

```typescript
function filterByAge<T extends { age: number }>(
  items: T[],
  minAge: number,
  maxAge: number
): T[] {
  return filter(items, {
    age: { $gte: minAge, $lte: maxAge }
  });
}

function filterByLocation<T extends { location: { lat: number; lng: number } }>(
  items: T[],
  center: { lat: number; lng: number },
  radiusMeters: number
): T[] {
  return filter(items, {
    location: {
      $near: { center, maxDistanceMeters: radiusMeters }
    }
  });
}

// Usage
interface User {
  name: string;
  age: number;
  location: { lat: number; lng: number };
}

const adults = filterByAge(users, 18, 100);
const nearby = filterByLocation(users, { lat: 52.52, lng: 13.405 }, 5000);
```

### Type-Safe Filter Builder

```typescript
import { filter } from '@mcabreradev/filter';
import type { Expression, NestedKeyOf } from '@mcabreradev/filter';

class FilterBuilder<T> {
  private expression: Partial<Record<string, unknown>> = {};

  where<K extends keyof T>(
    key: K,
    value: T[K] | Partial<Record<string, unknown>>
  ): this {
    this.expression[key as string] = value;
    return this;
  }

  whereNested<P extends NestedKeyOf<T>>(
    path: P,
    value: unknown
  ): this {
    this.expression[path] = value;
    return this;
  }

  build(): Partial<Record<string, unknown>> {
    return this.expression;
  }

  execute(data: T[]): T[] {
    return filter(data, this.expression);
  }
}

// Usage
interface User {
  name: string;
  age: number;
  address: {
    city: string;
  };
}

const filtered = new FilterBuilder<User>()
  .where('age', { $gte: 18 })
  .whereNested('address.city', 'Berlin')
  .execute(users);
```

### Conditional Types

```typescript
type FilterableProperties<T> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Date
      ? K
      : never
    : K;
}[keyof T];

function filterByPrimitive<
  T,
  K extends FilterableProperties<T>
>(
  items: T[],
  key: K,
  value: T[K]
): T[] {
  return filter(items, { [key]: value } as Expression<T>);
}
```

## Type Utilities

### Path Type Helpers

```typescript
import type {
  NestedKeyOf,
  PathValue,
  DeepPartial
} from '@mcabreradev/filter';

interface User {
  profile: {
    address: {
      city: string;
    };
  };
}

// Get all valid paths
type Paths = NestedKeyOf<User>;
// "profile" | "profile.address" | "profile.address.city"

// Get value type at path
type CityType = PathValue<User, 'profile.address.city'>;
// string

// Deep partial for optional properties
type PartialUser = DeepPartial<User>;
// { profile?: { address?: { city?: string } } }

// Practical usage of PathValue
function getValueAtPath<T, P extends NestedKeyOf<T>>(
  obj: T,
  path: P
): PathValue<T, P> | undefined {
  const keys = (path as string).split('.');
  let value: any = obj;
  for (const key of keys) {
    value = value?.[key];
  }
  return value;
}

// Usage with DeepPartial for updates
function updateUser(user: User, updates: DeepPartial<User>): User {
  return { ...user, ...updates };
}
```

### Operator Type Checking

```typescript
import type {
  ComparisonOperators,
  StringOperators,
  GeospatialOperators
} from '@mcabreradev/filter';

// Type guard helpers
function hasComparisonOperator(op: unknown): op is ComparisonOperators<any> {
  return typeof op === 'object' && op !== null &&
    ('$gte' in op || '$lte' in op || '$gt' in op || '$lt' in op);
}

function hasStringOperator(op: unknown): op is StringOperators {
  return typeof op === 'object' && op !== null &&
    ('$startsWith' in op || '$endsWith' in op || '$contains' in op);
}

function hasGeospatialOperator(op: unknown): op is GeospatialOperators {
  return typeof op === 'object' && op !== null &&
    ('$near' in op || '$geoBox' in op || '$geoPolygon' in op);
}

// Usage
function processOperator(op: unknown) {
  if (hasComparisonOperator(op)) {
    console.log('Comparison:', op.$gte, op.$lte);
  } else if (hasStringOperator(op)) {
    console.log('String:', op.$startsWith);
  } else if (hasGeospatialOperator(op)) {
    console.log('Geo:', op.$near);
  }
}
```

## Real-World Examples

### Type-Safe E-Commerce Filtering

```typescript
import { typedFilter } from '@mcabreradev/filter';
import type { NestedKeyOf, Expression } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  pricing: {
    amount: number;
    currency: string;
    discount: {
      active: boolean;
      percentage: number;
    };
  };
  inventory: {
    inStock: boolean;
    quantity: number;
  };
  metadata: {
    ratings: {
      average: number;
      count: number;
    };
  };
}

type ProductPaths = NestedKeyOf<Product>;
type ProductExpression = Partial<Record<ProductPaths, any>>;

// Type-safe filter
const discountedInStock: ProductExpression = {
  'pricing.discount.active': true,
  'pricing.discount.percentage': { $gte: 20 },
  'inventory.inStock': true,
  'metadata.ratings.average': { $gte: 4.5 }
};

const results = typedFilter(products, discountedInStock);
```

### Type-Safe User Management

```typescript
interface User {
  id: number;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    age: number;
    birthDate: Date;
  };
  address: {
    street: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  subscription: {
    plan: 'free' | 'premium' | 'enterprise';
    expiresAt: Date;
  };
}

// Type-safe filtering functions
function findAdultUsers(users: User[]): User[] {
  return typedFilter(users, {
    'profile.age': { $gte: 18 }
  });
}

function findNearbyPremiumUsers(
  users: User[],
  location: { lat: number; lng: number },
  radiusMeters: number
): User[] {
  return typedFilter(users, {
    'address.coordinates': {
      $near: { center: location, maxDistanceMeters: radiusMeters }
    },
    'subscription.plan': { $in: ['premium', 'enterprise'] }
  });
}

function findExpiringSubscriptions(users: User[], days: number): User[] {
  return typedFilter(users, {
    'subscription.expiresAt': { $upcoming: { days } }
  });
}
```

## Testing Type Safety

### Type Tests with tsd

```typescript
// __test__/test-d/dot-notation.test-d.ts
import { expectType, expectError } from 'tsd';
import { filter, typedFilter } from '@mcabreradev/filter';
import type { NestedKeyOf, Expression } from '@mcabreradev/filter';

interface User {
  name: string;
  profile: {
    age: number;
    address: {
      city: string;
    };
  };
}

// Test NestedKeyOf generates correct paths
type Paths = NestedKeyOf<User>;
expectType<'name' | 'profile' | 'profile.age' | 'profile.address' | 'profile.address.city'>(
  '' as Paths
);

// Test typedFilter accepts valid paths
typedFilter([] as User[], {
  'profile.age': { $gte: 18 },
  'profile.address.city': 'Berlin'
});

// Test typedFilter rejects invalid paths
expectError(
  typedFilter([] as User[], {
    'profile.invalid': true
  })
);

// Test Expression type
const validExpr: Expression<User> = {
  'profile.age': { $gte: 18 }
};

expectError({
  'invalid.path': true
} as Expression<User>);
```

## Best Practices

### ✅ DO

```typescript
// Use explicit types for reusability
import type { NestedKeyOf, Expression } from '@mcabreradev/filter';

type UserPaths = NestedKeyOf<User>;
type UserExpression = Expression<User>;

// Use typedFilter for maximum safety
import { typedFilter } from '@mcabreradev/filter';
const results = typedFilter(users, expression);

// Create type-safe helper functions
function filterUsers(expr: UserExpression): User[] {
  return filter(users, expr);
}

// Use generic constraints
function filterByProperty<T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): T[] {
  return filter(items, { [key]: value } as Expression<T>);
}
```

### ❌ DON'T

```typescript
// Don't use any
const expression: any = { 'profile.age': { $gte: 18 } };

// Don't skip type annotations
filter(users, {
  'invalid.path': true
});

// Don't ignore TypeScript errors
// @ts-ignore
typedFilter(users, { 'invalid': true });

// Don't use overly complex types
type OverlyComplex<T> = {
  [K in keyof T]: T[K] extends infer U
    ? U extends object
      ? // ... 10 more levels
      : never
    : never;
};

// Don't use type assertions unnecessarily
const expr = { age: { $gte: 18 } } as Expression<User>;
```

## IDE Configuration

### VSCode Settings

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

### TSConfig Settings

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## Troubleshooting

### Type Inference Not Working

**Problem**: IDE doesn't suggest types.

**Solution**: Ensure TypeScript version >= 5.0

```json
{
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### Autocomplete Too Slow

**Problem**: Autocomplete is slow with large types.

**Solution**: Simplify nested depth or use explicit types

```typescript
// Instead of deep inference
type AllPaths = NestedKeyOf<VeryDeepType>;

// Use explicit path subsets
type CommonPaths = 
  | 'user.profile.name'
  | 'user.profile.age'
  | 'user.address.city';
```

::: warning TypeScript Recursion Limits
TypeScript has a recursion depth limit (typically 50 levels). For deeply nested objects (&gt; 10 levels), consider:

- Flattening your data structure
- Using explicit path unions for commonly accessed paths
- Breaking down types into smaller, composable pieces
:::

### Circular Type References

**Problem**: TypeScript complains about circular references.

**Solution**: Use type aliases to break cycles

```typescript
type UserPath = NestedKeyOf<User>;
type UserExpr = Partial<Record<UserPath, any>>;
```

### Deep Nesting Performance

**Problem**: Type checking is slow with deeply nested objects.

**Solution**: Limit nesting depth and use type caching

```typescript
// ❌ Slow: 15+ levels of nesting
interface DeepType {
  level1: {
    level2: {
      // ... 15 more levels
    };
  };
}

// ✅ Better: Flatten or limit depth
interface OptimizedType {
  'level1.level2.level3': string;
  'level1.level2.level4': number;
}

// Cache commonly used types
type UserPaths = NestedKeyOf<User>; // Compute once
type UserFilter = Partial<Record<UserPaths, any>>;
```

## Common Pitfalls

### Optional Properties

```typescript
interface User {
  name: string;
  email?: string; // Optional
}

// ✅ Handle optional properties
const filtered = typedFilter(users, {
  email: { $ne: undefined } // Filter users with email
});
```

### Union Types

```typescript
interface Product {
  price: number | string; // Union type
}

// ✅ Use type guards or specific operators
const expensive = filter(products, {
  price: { $gte: 100 } // Works with number
});
```

### Arrays of Objects

```typescript
interface User {
  tags: Array<{ id: number; name: string }>;
}

// Use array operators
const filtered = filter(users, {
  tags: { $size: { $gte: 1 } }
});
```

## Migration Guide

### From filter() to typedFilter()

```typescript
// Before: Basic filter
import { filter } from '@mcabreradev/filter';

const results = filter(users, {
  'profile.age': { $gte: 18 }
});

// After: Type-safe filter
import { typedFilter } from '@mcabreradev/filter';

const results = typedFilter(users, {
  'profile.age': { $gte: 18 } // Full autocomplete and type checking
});
```

**Benefits**:
- ✅ Compile-time path validation
- ✅ IDE autocomplete for nested paths
- ✅ Catch typos before runtime
- ✅ No performance overhead

## Summary

| Feature | Type Safety Level | Type Check Time | Bundle Impact | Ease of Use |
|---------|------------------|-----------------|---------------|-------------|
| Basic filter() | Medium | Fast | Minimal | Easy |
| Expression&lt;T&gt; | High | Fast | Minimal | Easy |
| typedFilter() | Maximum | Fast | Minimal | Easy |
| NestedKeyOf&lt;T&gt; | Maximum | Medium | None (type-only) | Medium |
| Custom Types | Variable | Variable | None (type-only) | Complex |

**Recommended Approach**:
- **Small Projects** (&lt;100 types): Use `filter()` with `Expression<T>`
- **Medium Projects** (100-1000 types): Add `NestedKeyOf<T>` for dot notation
- **Large Projects** (&gt;1000 types): Use `typedFilter()` + explicit path types
- **Libraries**: Export `NestedKeyOf<T>` and type utilities for consumers

## See Also

- [Nested Objects Guide](/guide/nested-objects) - Dot notation and nested filtering
- [Operators Guide](/guide/operators) - All available operators
- [Type System Architecture](/advanced/type-system) - Deep dive into types
- [API Reference](/api/types) - Complete type definitions
