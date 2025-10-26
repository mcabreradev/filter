# Architecture

Deep dive into the architecture of @mcabreradev/filter.

## Overview

@mcabreradev/filter is built with a modular architecture that separates concerns and enables tree-shaking for optimal bundle sizes.

## Core Architecture

```
@mcabreradev/filter
├── core/                 # Core filtering logic
│   ├── filter.ts        # Main filter function
│   └── filter-lazy.ts   # Lazy evaluation
├── operators/           # Operator implementations
│   ├── comparison.operators.ts
│   ├── logical.operators.ts
│   ├── string.operators.ts
│   ├── array.operators.ts
│   └── operator-processor.ts
├── comparison/          # Comparison utilities
│   ├── deep-compare.ts
│   ├── object-compare.ts
│   └── property-compare.ts
├── predicate/           # Predicate functions
├── types/               # TypeScript definitions
├── utils/               # Utility functions
├── validation/          # Input validation
├── config/              # Configuration
└── integrations/        # Framework integrations
    ├── react/
    ├── vue/
    └── svelte/
```

## Core Components

### Filter Engine

The filter engine is the heart of the library, responsible for processing expressions and filtering data.

```typescript
export function filter<T>(
  data: T[],
  expression: Expression<T>,
  options?: FilterOptions
): T[] {
  const config = mergeConfig(defaultConfig, options);

  if (config.memoize) {
    const cached = getCachedResult(data, expression);
    if (cached) return cached;
  }

  const predicate = createPredicate(expression, config);
  const result = data.filter(predicate);

  if (config.memoize) {
    cacheResult(data, expression, result);
  }

  return result;
}
```

### Expression Parser

Converts user expressions into executable predicates.

```typescript
function createPredicate<T>(
  expression: Expression<T>,
  config: FilterConfig
): (item: T) => boolean {
  if (isLogicalExpression(expression)) {
    return createLogicalPredicate(expression, config);
  }

  return createPropertyPredicate(expression, config);
}
```

### Operator Processor

Handles operator evaluation for different data types.

```typescript
export function processOperator<T>(
  value: T,
  operator: Operator,
  operand: any
): boolean {
  switch (operator) {
    case '$eq':
      return value === operand;
    case '$ne':
      return value !== operand;
    case '$gt':
      return value > operand;
    case '$gte':
      return value >= operand;
    case '$lt':
      return value < operand;
    case '$lte':
      return value <= operand;
    case '$in':
      return operand.includes(value);
    case '$nin':
      return !operand.includes(value);
    case '$contains':
      return Array.isArray(value) && value.includes(operand);
    case '$regex':
      return operand.test(String(value));
    case '$startsWith':
      return String(value).startsWith(operand);
    case '$endsWith':
      return String(value).endsWith(operand);
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}
```

## Memoization System

### Cache Strategy

Uses a WeakMap-based cache for efficient memory management.

```typescript
const cache = new WeakMap<any[], Map<string, any>>();

function getCachedResult<T>(
  data: T[],
  expression: Expression<T>
): T[] | null {
  const dataCache = cache.get(data);
  if (!dataCache) return null;

  const key = JSON.stringify(expression);
  return dataCache.get(key) || null;
}

function cacheResult<T>(
  data: T[],
  expression: Expression<T>,
  result: T[]
): void {
  let dataCache = cache.get(data);
  if (!dataCache) {
    dataCache = new Map();
    cache.set(data, dataCache);
  }

  const key = JSON.stringify(expression);
  dataCache.set(key, result);
}
```

### Cache Invalidation

```typescript
export function clearMemoizationCache(): void {
  cache = new WeakMap();
}
```

## Lazy Evaluation

### Lazy Filter Implementation

```typescript
export class LazyFilter<T> {
  private data: T[];
  private expression: Expression<T>;
  private operations: Array<(items: T[]) => T[]> = [];

  constructor(data: T[], expression: Expression<T>) {
    this.data = data;
    this.expression = expression;
  }

  take(count: number): this {
    this.operations.push(items => items.slice(0, count));
    return this;
  }

  skip(count: number): this {
    this.operations.push(items => items.slice(count));
    return this;
  }

  toArray(): T[] {
    const predicate = createPredicate(this.expression);
    let result = this.data.filter(predicate);

    for (const operation of this.operations) {
      result = operation(result);
    }

    return result;
  }
}
```

## Framework Integration Architecture

### React Integration

Uses React hooks for state management and reactivity.

```typescript
export function useFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: FilterOptions
): UseFilterResult<T> {
  const [isFiltering, setIsFiltering] = useState(false);

  const filtered = useMemo(() => {
    setIsFiltering(true);
    const result = filter(data, expression, options);
    setIsFiltering(false);
    return result;
  }, [data, expression, options]);

  return {
    filtered,
    isFiltering
  };
}
```

### Vue Integration

Uses Vue's reactive system for automatic updates.

```typescript
export function useFilter<T>(
  data: Ref<T[]> | ComputedRef<T[]>,
  expression: Ref<Expression<T>> | ComputedRef<Expression<T>>,
  options?: FilterOptions
): UseFilterResult<T> {
  const isFiltering = ref(false);

  const filtered = computed(() => {
    isFiltering.value = true;
    const result = filter(
      unref(data),
      unref(expression),
      options
    );
    isFiltering.value = false;
    return result;
  });

  return {
    filtered,
    isFiltering: computed(() => isFiltering.value)
  };
}
```

### Svelte Integration

Uses Svelte stores for reactive state.

```typescript
export function useFilter<T>(
  data: Readable<T[]>,
  expression: Expression<T> | Readable<Expression<T>>,
  options?: FilterOptions
): UseFilterResult<T> {
  const isFiltering = writable(false);

  const filtered = derived(
    [data, isReadable(expression) ? expression : readable(expression)],
    ([$data, $expression]) => {
      isFiltering.set(true);
      const result = filter($data, $expression, options);
      isFiltering.set(false);
      return result;
    }
  );

  return {
    filtered,
    isFiltering: readonly(isFiltering)
  };
}
```

## Type System

### Generic Type Constraints

```typescript
type Expression<T> = {
  [K in keyof T]?: OperatorExpression<T[K]> | T[K];
} | LogicalExpression<T>;

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

### Type Inference

The library uses TypeScript's type inference to provide type safety:

```typescript
const users: User[] = [...];
const expression: Expression<User> = {
  age: { $gte: 18 }
};

const filtered = filter(users, expression);
```

## Performance Optimizations

### 1. Early Exit

```typescript
function createPredicate<T>(expression: Expression<T>): (item: T) => boolean {
  return (item: T) => {
    for (const [key, condition] of Object.entries(expression)) {
      if (!evaluateCondition(item[key], condition)) {
        return false;
      }
    }
    return true;
  };
}
```

### 2. Operator Specialization

```typescript
const comparisonOperators = new Map([
  ['$eq', (a, b) => a === b],
  ['$ne', (a, b) => a !== b],
  ['$gt', (a, b) => a > b],
  ['$gte', (a, b) => a >= b],
  ['$lt', (a, b) => a < b],
  ['$lte', (a, b) => a <= b]
]);
```

### 3. Property Access Caching

```typescript
const propertyCache = new Map<string, (obj: any) => any>();

function getPropertyAccessor(path: string): (obj: any) => any {
  if (propertyCache.has(path)) {
    return propertyCache.get(path)!;
  }

  const accessor = createPropertyAccessor(path);
  propertyCache.set(path, accessor);
  return accessor;
}
```

## Extension Points

### Custom Operators

```typescript
const customOperators = new Map<string, OperatorFunction>();

export function registerOperator(
  name: string,
  fn: OperatorFunction
): void {
  customOperators.set(name, fn);
}

export function getOperator(name: string): OperatorFunction | undefined {
  return customOperators.get(name) || builtInOperators.get(name);
}
```

### Configuration Hooks

```typescript
export interface FilterConfig {
  memoize?: boolean;
  caseSensitive?: boolean;
  debug?: boolean;
  lazy?: boolean;
  onBeforeFilter?: (data: any[], expression: any) => void;
  onAfterFilter?: (result: any[]) => void;
}
```

## Bundle Optimization

### Tree-Shaking

The library is structured to enable tree-shaking:

```typescript
export { filter } from './core/filter';
export { createLazyFilter } from './core/filter-lazy';
export { useFilter } from './integrations/react/use-filter';
export { usePaginatedFilter } from './integrations/react/use-paginated-filter';
```

### Code Splitting

Framework integrations are in separate entry points:

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./react": "./dist/integrations/react/index.js",
    "./vue": "./dist/integrations/vue/index.js",
    "./svelte": "./dist/integrations/svelte/index.js"
  }
}
```

## Testing Architecture

### Unit Tests

Each component has isolated unit tests:

```typescript
describe('filter', () => {
  it('should filter by equality', () => {
    const data = [{ age: 25 }, { age: 30 }];
    const result = filter(data, { age: { $eq: 25 } });
    expect(result).toEqual([{ age: 25 }]);
  });
});
```

### Integration Tests

Test framework integrations:

```typescript
describe('useFilter', () => {
  it('should update when data changes', () => {
    const { result, rerender } = renderHook(
      ({ data }) => useFilter(data, { age: { $gte: 18 } }),
      { initialProps: { data: [{ age: 20 }] } }
    );

    expect(result.current.filtered).toHaveLength(1);

    rerender({ data: [{ age: 15 }] });

    expect(result.current.filtered).toHaveLength(0);
  });
});
```

## Related Resources

- [Type System](/advanced/type-system)
- [Performance](/advanced/performance)
- [Contributing](/project/contributing)
- [API Reference](/api/core)

