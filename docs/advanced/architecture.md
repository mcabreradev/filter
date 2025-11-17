# Architecture

Deep dive into the architecture of @mcabreradev/filter.

## Overview

@mcabreradev/filter is built with a modular architecture that separates concerns and enables tree-shaking for optimal bundle sizes. The library has evolved through multiple versions, with v5.8.2 featuring MongoDB-style operators, framework integrations (React, Vue, Svelte, Angular, SolidJS, Preact), lazy evaluation, memoization, geospatial operators, datetime operators, and visual debugging.

## Core Architecture

```
@mcabreradev/filter
├── core/                   # Core filtering logic
│   ├── filter.ts           # Main filter function with caching & debug
│   └── filter-lazy.ts      # Lazy evaluation with generators
├── operators/              # Operator implementations
│   ├── comparison.operators.ts      # $gt, $gte, $lt, $lte, $eq, $ne
│   ├── logical.operators.ts         # $and, $or, $not
│   ├── string.operators.ts          # $startsWith, $endsWith, $contains, $regex, $match
│   ├── array.operators.ts           # $in, $nin, $contains, $size
│   ├── geospatial.operators.ts      # $near, $geoBox, $geoPolygon
│   ├── datetime.operators.ts        # $recent, $upcoming, $dayOfWeek, $timeOfDay, $age
│   └── operator-processor.ts        # Orchestrates operator evaluation
├── comparison/             # Comparison utilities
│   ├── deep-compare.ts
│   ├── object-compare.ts
│   └── property-compare.ts
├── predicate/              # Predicate functions
│   ├── predicate-factory.ts         # Creates appropriate predicate
│   ├── object-predicate.ts
│   ├── string-predicate.ts
│   └── function-predicate.ts
├── debug/                  # Debug & visualization (v5.5.0+)
│   ├── debug-filter.ts              # Debug-enabled filter
│   ├── debug-tree-builder.ts        # Expression tree builder
│   ├── debug-formatter.ts           # ANSI color output
│   └── debug-evaluator.ts           # Tracks evaluations
├── types/                  # TypeScript definitions
│   ├── expression.types.ts
│   ├── operator.types.ts
│   ├── config.types.ts
│   ├── geospatial.types.ts          # Geo types (v5.6.0+)
│   └── datetime.types.ts            # Datetime types (v5.6.0+)
├── utils/                  # Utility functions
│   ├── cache.ts                     # Result caching with WeakMap
│   ├── memoization.ts               # Multi-layer memoization (v5.2.0+)
│   ├── lazy-iterators.ts            # Generator utilities (v5.1.0+)
│   ├── pattern-matching.ts          # SQL wildcards (%, _)
│   ├── geospatial.utils.ts          # Distance calculation (v5.6.0+)
│   ├── datetime.utils.ts            # Datetime utilities (v5.6.0+)
│   └── type-guards.ts
├── validation/             # Runtime validation with Zod
│   ├── expression.validator.ts
│   └── options.validator.ts
├── config/                 # Configuration
│   ├── config-builder.ts
│   └── default-config.ts
└── integrations/           # Framework integrations (v5.3.0+)
    ├── react/              # React hooks
    │   ├── use-filter.ts
    │   ├── use-filtered-state.ts
    │   ├── use-debounced-filter.ts
    │   └── use-paginated-filter.ts
    ├── vue/                # Vue composables
    │   ├── use-filter.ts
    │   ├── use-filtered-state.ts
    │   ├── use-debounced-filter.ts
    │   └── use-paginated-filter.ts
    └── svelte/             # Svelte stores
        ├── use-filter.ts
        ├── use-filtered-state.ts
        ├── use-debounced-filter.ts
        └── use-paginated-filter.ts
```

## Core Components

### Filter Engine

The filter engine is the heart of the library, processing expressions with multi-layer caching and debug support.

```typescript
export function filter<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions
): T[] {
  if (!Array.isArray(array)) {
    throw new Error(`Expected array but received: ${typeof array}`);
  }

  const config = mergeConfig(options);
  const validatedExpression = validateExpression<T>(expression);

  // Debug mode (v5.5.0+)
  if (config.debug) {
    const result = filterDebug(array, validatedExpression, options);
    result.print();
    return result.items;
  }

  // Multi-layer caching (v5.2.0+)
  if (config.enableCache) {
    const cacheKey = memoization.createExpressionHash(validatedExpression, config);
    const cached = globalFilterCache.get(array, cacheKey);
    if (cached !== undefined) {
      return cached as T[];
    }

    const predicate = createPredicateFn<T>(validatedExpression, config);
    const result = array.filter(predicate);

    globalFilterCache.set(array, cacheKey, result);
    return result;
  }

  // Standard filtering
  const predicate = createPredicateFn<T>(validatedExpression, config);
  return array.filter(predicate);
}
```

### Expression Parser

Converts user expressions into executable predicates with support for operators, wildcards, and functions.

```typescript
export function createPredicateFn<T>(
  expression: Expression<T>,
  config: FilterConfig,
): (item: T) => boolean {
  // Handle predicate functions
  if (typeof expression === 'function') {
    return expression as PredicateFunction<T>;
  }

  // Handle primitive expressions (string, number, boolean)
  if (isPrimitive(expression)) {
    return createStringPredicate<T>(expression, config);
  }

  // Handle object expressions with operators
  if (isObjectExpression(expression)) {
    return createObjectPredicate<T>(expression, config);
  }

  throw new Error(`Invalid expression type: ${typeof expression}`);
}
```

### Operator Processor

Orchestrates operator evaluation with support for 30+ operators across multiple categories.

```typescript
export function processOperators<T>(
  value: unknown,
  operators: Record<string, unknown>,
  config: FilterConfig,
): boolean {
  for (const [op, operand] of Object.entries(operators)) {
    // Comparison operators
    if (isComparisonOperator(op)) {
      if (!evaluateComparison(value, op, operand)) return false;
    }
    // Array operators
    else if (isArrayOperator(op)) {
      if (!evaluateArray(value, op, operand)) return false;
    }
    // String operators
    else if (isStringOperator(op)) {
      if (!evaluateString(value, op, operand, config)) return false;
    }
    // Logical operators (v5.2.0+)
    else if (isLogicalOperator(op)) {
      if (!evaluateLogical(value, op, operand, config)) return false;
    }
    // Geospatial operators (v5.6.0+)
    else if (isGeospatialOperator(op)) {
      if (!evaluateGeospatial(value, op, operand)) return false;
    }
    // Datetime operators (v5.6.0+)
    else if (isDateTimeOperator(op)) {
      if (!evaluateDateTime(value, op, operand)) return false;
    }
    else {
      throw new Error(`Unknown operator: ${op}`);
    }
  }
  return true;
}
```

### Operator Categories

**Comparison Operators** (v5.0.0+):
```typescript
export function evaluateComparison(
  value: unknown,
  operator: ComparisonOperator,
  operand: unknown,
): boolean {
  switch (operator) {
    case '$eq': return value === operand;
    case '$ne': return value !== operand;
    case '$gt': return (value as number) > (operand as number);
    case '$gte': return (value as number) >= (operand as number);
    case '$lt': return (value as number) < (operand as number);
    case '$lte': return (value as number) <= (operand as number);
    default: return false;
  }
}
```

**Array Operators** (v5.0.0+):
```typescript
export function evaluateArray(
  value: unknown,
  operator: ArrayOperator,
  operand: unknown,
): boolean {
  switch (operator) {
    case '$in':
      return Array.isArray(operand) && operand.includes(value);
    case '$nin':
      return Array.isArray(operand) && !operand.includes(value);
    case '$contains':
      return Array.isArray(value) && value.includes(operand);
    case '$size':
      return Array.isArray(value) && value.length === operand;
    default:
      return false;
  }
}
```

**String Operators** (v5.0.0+):
```typescript
export function evaluateString(
  value: unknown,
  operator: StringOperator,
  operand: unknown,
  config: FilterConfig,
): boolean {
  const str = String(value);
  const pattern = String(operand);

  switch (operator) {
    case '$startsWith':
      return config.caseSensitive
        ? str.startsWith(pattern)
        : str.toLowerCase().startsWith(pattern.toLowerCase());
    case '$endsWith':
      return config.caseSensitive
        ? str.endsWith(pattern)
        : str.toLowerCase().endsWith(pattern.toLowerCase());
    case '$contains':
      return config.caseSensitive
        ? str.includes(pattern)
        : str.toLowerCase().includes(pattern.toLowerCase());
    case '$regex':
    case '$match':
      const regex = operand instanceof RegExp ? operand : new RegExp(pattern);
      return regex.test(str);
    default:
      return false;
  }
}
```

**Logical Operators** (v5.2.0+):
```typescript
export function evaluateLogical<T>(
  item: T,
  operator: LogicalOperator,
  operand: unknown,
  config: FilterConfig,
): boolean {
  switch (operator) {
    case '$and':
      if (!Array.isArray(operand)) return false;
      return operand.every(expr => {
        const predicate = createPredicateFn(expr, config);
        return predicate(item);
      });
    case '$or':
      if (!Array.isArray(operand)) return false;
      return operand.some(expr => {
        const predicate = createPredicateFn(expr, config);
        return predicate(item);
      });
    case '$not':
      const predicate = createPredicateFn(operand as Expression<T>, config);
      return !predicate(item);
    default:
      return false;
  }
}
```

**Geospatial Operators** (v5.6.0+):
```typescript
export function evaluateNear(point: GeoPoint, query: NearQuery): boolean {
  const distance = calculateDistance(point, query.center);
  return distance <= query.maxDistanceMeters;
}

export function evaluateGeoBox(point: GeoPoint, box: BoundingBox): boolean {
  return (
    point.lat >= box.southwest.lat &&
    point.lat <= box.northeast.lat &&
    point.lng >= box.southwest.lng &&
    point.lng <= box.northeast.lng
  );
}

export function evaluateGeoPolygon(point: GeoPoint, query: PolygonQuery): boolean {
  // Ray casting algorithm for point-in-polygon
  let inside = false;
  const { points } = query;

  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].lng, yi = points[i].lat;
    const xj = points[j].lng, yj = points[j].lat;

    const intersect = ((yi > point.lat) !== (yj > point.lat)) &&
      (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

// Spherical law of cosines for distance calculation
export function calculateDistance(p1: GeoPoint, p2: GeoPoint): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = p1.lat * Math.PI / 180;
  const φ2 = p2.lat * Math.PI / 180;
  const Δλ = (p2.lng - p1.lng) * Math.PI / 180;

  const d = Math.acos(
    Math.sin(φ1) * Math.sin(φ2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  ) * R;

  return d;
}
```

**Datetime Operators** (v5.6.0+):
```typescript
export function evaluateRecent(date: Date, query: RelativeTimeQuery): boolean {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const threshold = calculateTimeDifference(query);
  return diff <= threshold;
}

export function evaluateUpcoming(date: Date, query: RelativeTimeQuery): boolean {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const threshold = calculateTimeDifference(query);
  return diff >= 0 && diff <= threshold;
}

export function evaluateDayOfWeek(date: Date, days: number[]): boolean {
  return days.includes(date.getDay());
}

export function evaluateTimeOfDay(date: Date, query: TimeOfDayQuery): boolean {
  const hour = date.getHours();
  return hour >= query.start && hour <= query.end;
}

export function evaluateAge(birthDate: Date, query: AgeQuery): boolean {
  const age = calculateAge(birthDate, query.unit);
  if (query.min !== undefined && age < query.min) return false;
  if (query.max !== undefined && age > query.max) return false;
  return true;
}

export function calculateAge(birthDate: Date, unit: 'years' | 'months' | 'days' = 'years'): number {
  const now = new Date();
  const diff = now.getTime() - birthDate.getTime();

  switch (unit) {
    case 'years':
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    case 'months':
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
    case 'days':
      return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
```

## Memoization System (v5.2.0+)

### Multi-Layer Caching Strategy

The library implements a sophisticated three-layer caching system:

1. **Result Cache** - Caches complete filter results using WeakMap
2. **Predicate Cache** - Memoizes compiled predicate functions
3. **Regex Cache** - Caches compiled regex patterns

```typescript
class MemoizationStrategy {
  private predicateCache = new Map<string, (item: any) => boolean>();
  private regexCache = new Map<string, RegExp>();

  // Predicate memoization
  memoizePredicate<T>(
    key: string,
    factory: () => (item: T) => boolean,
  ): (item: T) => boolean {
    if (this.predicateCache.has(key)) {
      return this.predicateCache.get(key)!;
    }

    const predicate = factory();
    this.predicateCache.set(key, predicate);
    return predicate;
  }

  // Regex memoization
  memoizeRegex(pattern: string, flags?: string): RegExp {
    const key = `${pattern}:${flags || ''}`;

    if (this.regexCache.has(key)) {
      return this.regexCache.get(key)!;
    }

    const regex = new RegExp(pattern, flags);
    this.regexCache.set(key, regex);
    return regex;
  }

  // Expression hash for result cache
  createExpressionHash(expression: unknown, config: FilterConfig): string {
    return JSON.stringify({ expression, config });
  }

  // Cache statistics
  getStats() {
    return {
      predicateCacheSize: this.predicateCache.size,
      regexCacheSize: this.regexCache.size,
    };
  }

  clearAll() {
    this.predicateCache.clear();
    this.regexCache.clear();
  }
}

export const memoization = new MemoizationStrategy();
```

### Result Cache Implementation

```typescript
export class FilterCache<T> {
  private cache = new WeakMap<T[], Map<string, T[]>>();

  get(array: T[], key: string): T[] | undefined {
    const arrayCache = this.cache.get(array);
    return arrayCache?.get(key);
  }

  set(array: T[], key: string, value: T[]): void {
    let arrayCache = this.cache.get(array);
    if (!arrayCache) {
      arrayCache = new Map();
      this.cache.set(array, arrayCache);
    }
    arrayCache.set(key, value);
  }

  clear(): void {
    this.cache = new WeakMap();
  }
}

const globalFilterCache = new FilterCache<unknown>();
```

### Performance Gains

| Operation | Without Cache | With Cache | Speedup |
|-----------|---------------|------------|---------|
| Simple query | 5.3ms | 0.01ms | **530x** |
| Regex pattern | 12.1ms | 0.02ms | **605x** |
| Complex nested | 15.2ms | 0.01ms | **1520x** |

## Lazy Evaluation (v5.1.0+)

### Generator-Based Filtering

Efficiently process large datasets with lazy evaluation and early exit optimization.

```typescript
export function* filterLazy<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions,
): IterableIterator<T> {
  const config = mergeConfig(options);
  const validatedExpression = validateExpression<T>(expression);
  const predicate = createPredicateFn<T>(validatedExpression, config);

  for (const item of array) {
    if (predicate(item)) {
      yield item;
    }
  }
}

// Helper functions for lazy operations
export function filterFirst<T>(
  array: T[],
  expression: Expression<T>,
  count: number,
  options?: FilterOptions,
): T[] {
  const iterator = filterLazy(array, expression, options);
  const result: T[] = [];

  for (const item of iterator) {
    result.push(item);
    if (result.length >= count) break; // Early exit
  }

  return result;
}

export function filterExists<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions,
): boolean {
  const iterator = filterLazy(array, expression, options);
  const { value, done } = iterator.next();
  return !done && value !== undefined;
}

export function filterCount<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions,
): number {
  const iterator = filterLazy(array, expression, options);
  let count = 0;

  for (const _ of iterator) {
    count++;
  }

  return count;
}
```

### Lazy Iterator Utilities

```typescript
// Take first N items
export function* take<T>(iterator: Iterable<T>, count: number): IterableIterator<T> {
  let taken = 0;
  for (const item of iterator) {
    if (taken >= count) break;
    yield item;
    taken++;
  }
}

// Skip first N items
export function* skip<T>(iterator: Iterable<T>, count: number): IterableIterator<T> {
  let skipped = 0;
  for (const item of iterator) {
    if (skipped < count) {
      skipped++;
      continue;
    }
    yield item;
  }
}

// Map transformation
export function* map<T, U>(
  iterator: Iterable<T>,
  fn: (item: T) => U,
): IterableIterator<U> {
  for (const item of iterator) {
    yield fn(item);
  }
}

// Convert to array
export function toArray<T>(iterator: Iterable<T>): T[] {
  return Array.from(iterator);
}
```

## Debug System (v5.5.0+)

### Debug Filter Implementation

```typescript
export const filterDebug = <T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions,
): DebugResult<T> => {
  const startTime = performance.now();
  const config = mergeConfig(options);
  const validatedExpression = validateExpression<T>(expression);

  // Build expression tree
  const tree = buildDebugTree(validatedExpression, config);

  // Evaluate with tracking
  const { items, tree: populatedTree } = evaluateWithDebug(
    array,
    tree,
    validatedExpression,
    config,
  );

  const executionTime = performance.now() - startTime;
  const conditionsEvaluated = countConditions(populatedTree);

  return {
    items,
    stats: {
      matched: items.length,
      total: array.length,
      percentage: (items.length / array.length) * 100,
      executionTime,
      conditionsEvaluated,
    },
    debug: {
      tree: populatedTree,
      expression: validatedExpression,
    },
    print: () => {
      const formatted = formatDebugTree(populatedTree, config);
      console.log(formatted);
    },
  };
};
```

### Debug Tree Builder

```typescript
export const buildDebugTree = (
  expression: Expression<unknown>,
  config: FilterConfig,
): DebugNode => {
  // Handle logical operators
  if (hasLogicalOperator(expression)) {
    return buildLogicalNode(expression, config);
  }

  // Handle object expressions
  if (isObjectExpression(expression)) {
    return buildObjectNode(expression, config);
  }

  // Handle primitive expressions
  return buildPrimitiveNode(expression, config);
};

const buildLogicalNode = (
  expression: Record<string, unknown>,
  config: FilterConfig,
): DebugNode => {
  const operator = getLogicalOperator(expression);
  const operands = expression[operator] as unknown[];

  return {
    type: 'logical',
    operator,
    children: operands.map(op => buildDebugTree(op, config)),
  };
};
```

### Debug Tree Formatter

```typescript
export const formatDebugTree = (
  tree: DebugNode,
  config: FilterConfig,
): string => {
  const lines: string[] = [];
  const colorize = config.colorize ?? false;

  const formatNode = (node: DebugNode, prefix = '', isLast = true): void => {
    const connector = isLast ? '└─' : '├─';
    const matchInfo = node.matched !== undefined
      ? ` (${node.matched}/${node.total} matched, ${((node.matched / node.total) * 100).toFixed(1)}%)`
      : '';

    const status = node.matched === node.total ? '✓' : '✗';
    const line = `${prefix}${connector} ${status} ${node.label}${matchInfo}`;

    lines.push(colorize ? colorizeOutput(line, node.matched === node.total) : line);

    if (node.children) {
      const childPrefix = prefix + (isLast ? '  ' : '│ ');
      node.children.forEach((child, i) => {
        formatNode(child, childPrefix, i === node.children!.length - 1);
      });
    }
  };

  formatNode(tree);
  return lines.join('\n');
};

const colorizeOutput = (text: string, success: boolean): string => {
  const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    reset: '\x1b[0m',
  };

  return success
    ? `${colors.green}${text}${colors.reset}`
    : `${colors.red}${text}${colors.reset}`;
};
```

## Framework Integration Architecture (v5.3.0+)

### React Integration

Uses React hooks for state management and reactivity with memoization.

```typescript
export function useFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: FilterOptions,
): UseFilterResult<T> {
  const filtered = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    try {
      return filter(data, expression, options);
    } catch {
      return [];
    }
  }, [data, expression, options]);

  const isFiltering = useMemo(() => {
    return filtered.length !== data.length;
  }, [filtered.length, data.length]);

  return {
    filtered,
    isFiltering,
  };
}

export function useDebouncedFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: UseDebouncedFilterOptions,
): UseDebouncedFilterResult<T> {
  const { delay = 300, ...filterOptions } = options || {};
  const [debouncedExpression, setDebouncedExpression] = useState(expression);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(true);
    const timer = setTimeout(() => {
      setDebouncedExpression(expression);
      setIsPending(false);
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsPending(false);
    };
  }, [expression, delay]);

  const filtered = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    try {
      return filter(data, debouncedExpression, filterOptions);
    } catch {
      return [];
    }
  }, [data, debouncedExpression, filterOptions]);

  const isFiltering = useMemo(() => {
    return filtered.length !== data.length;
  }, [filtered.length, data.length]);

  return {
    filtered,
    isFiltering,
    isPending,
  };
}
```

### Vue Integration

Uses Vue's reactive system with computed properties for automatic updates.

```typescript
export function useFilter<T>(
  data: MaybeRef<T[]>,
  expression: MaybeRef<Expression<T>>,
  options?: MaybeRef<FilterOptions>,
): UseFilterResult<T> {
  const filtered = computed(() => {
    const dataValue = unref(data);
    const expressionValue = unref(expression);
    const optionsValue = unref(options);

    if (!dataValue || dataValue.length === 0) {
      return [];
    }

    try {
      return filter(dataValue, expressionValue, optionsValue);
    } catch {
      return [];
    }
  });

  const isFiltering = computed(() => {
    const dataValue = unref(data);
    return filtered.value.length !== dataValue.length;
  });

  return {
    filtered,
    isFiltering,
  };
}
```

### Svelte Integration

Uses Svelte stores for reactive state management.

```typescript
export function useFilter<T>(
  data: Writable<T[]> | Readable<T[]>,
  expression: MaybeStore<Expression<T>>,
  options?: FilterOptions,
): UseFilterResult<T> {
  const expressionStore = toStore(expression);

  const filtered = derived(
    [data, expressionStore],
    ([$data, $expression]) => {
      if (!$data || $data.length === 0) {
        return [];
      }

      try {
        return filter($data, $expression, options);
      } catch {
        return [];
      }
    }
  );

  const isFiltering = derived(
    [data, filtered],
    ([$data, $filtered]) => {
      return $filtered.length !== $data.length;
    }
  );

  return {
    filtered,
    isFiltering,
  };
}

function toStore<T>(value: MaybeStore<T>): Readable<T> {
  if (isStore(value)) {
    return value;
  }
  return readable(value);
}
```

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

### Generic Type Constraints with Operator Autocomplete

The type system provides intelligent autocomplete based on property types:

```typescript
// Core expression type
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

// Type-aware operator expressions
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

// Geospatial operators (v5.6.0+)
interface GeospatialOperators<T> {
  $near?: T extends GeoPoint ? NearQuery : never;
  $geoBox?: T extends GeoPoint ? BoundingBox : never;
  $geoPolygon?: T extends GeoPoint ? PolygonQuery : never;
}

// Datetime operators (v5.6.0+)
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

// Geospatial types
export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface NearQuery {
  center: GeoPoint;
  maxDistanceMeters: number;
}

export interface BoundingBox {
  southwest: GeoPoint;
  northeast: GeoPoint;
}

export interface PolygonQuery {
  points: GeoPoint[];
}

// Datetime types
export interface RelativeTimeQuery {
  days?: number;
  hours?: number;
  minutes?: number;
}

export interface TimeOfDayQuery {
  start: number;  // 0-23
  end: number;    // 0-23
}

export interface AgeQuery {
  min?: number;
  max?: number;
  unit?: 'years' | 'months' | 'days';
}
```

### Type Inference Example

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  tags: string[];
  location: GeoPoint;
  birthDate: Date;
  active: boolean;
}

// TypeScript suggests only valid operators for each property type
const expression: Expression<User> = {
  // number property - suggests: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin
  age: { $gte: 18, $lte: 65 },

  // string property - suggests: $eq, $ne, $startsWith, $endsWith, $contains, $regex, $match, $in, $nin
  name: { $startsWith: 'A' },
  email: { $endsWith: '@example.com' },

  // array property - suggests: $contains, $size, $in, $nin
  tags: { $contains: 'premium' },

  // GeoPoint property - suggests: $near, $geoBox, $geoPolygon
  location: {
    $near: {
      center: { lat: 52.52, lng: 13.405 },
      maxDistanceMeters: 5000
    }
  },

  // Date property - suggests: $recent, $upcoming, $dayOfWeek, $timeOfDay, $age, $isWeekday, $isWeekend, $isBefore, $isAfter
  birthDate: {
    $age: { min: 18, max: 65, unit: 'years' }
  },

  // boolean property - suggests: $eq, $ne
  active: { $eq: true }
};

// Filtered result is properly typed as User[]
const filtered = filter(users, expression);
```

## Performance Optimizations

### 1. Early Exit Strategy

```typescript
function createObjectPredicate<T>(
  expression: ObjectExpression<T>,
  config: FilterConfig,
): (item: T) => boolean {
  return (item: T): boolean => {
    // Early exit on first failed condition
    for (const [key, condition] of Object.entries(expression)) {
      if (!evaluateCondition(item[key as keyof T], condition, config)) {
        return false;  // Early exit
      }
    }
    return true;
  };
}
```

### 2. Operator Specialization

```typescript
// Fast lookup maps for operators
const comparisonOps = new Map([
  ['$eq', (a: any, b: any) => a === b],
  ['$ne', (a: any, b: any) => a !== b],
  ['$gt', (a: any, b: any) => a > b],
  ['$gte', (a: any, b: any) => a >= b],
  ['$lt', (a: any, b: any) => a < b],
  ['$lte', (a: any, b: any) => a <= b],
]);

export function evaluateComparison(
  value: unknown,
  operator: string,
  operand: unknown,
): boolean {
  const fn = comparisonOps.get(operator);
  return fn ? fn(value, operand) : false;
}
```

### 3. Pattern Matching Optimization

```typescript
// Compile wildcard patterns once
export function compileWildcardPattern(pattern: string): RegExp {
  // Memoized via regex cache
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/%/g, '.*')
    .replace(/_/g, '.');

  return memoization.memoizeRegex(`^${escaped}$`, 'i');
}
```

### 4. Deep Comparison Caching

```typescript
const comparisonCache = new WeakMap<object, Map<object, boolean>>();

export function deepCompare(a: unknown, b: unknown): boolean {
  // Use cache for object comparisons
  if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
    let cache = comparisonCache.get(a);
    if (!cache) {
      cache = new Map();
      comparisonCache.set(a, cache);
    }

    if (cache.has(b)) {
      return cache.get(b)!;
    }

    const result = deepCompareImpl(a, b);
    cache.set(b, result);
    return result;
  }

  return a === b;
}
```

## Configuration System

### Configuration Builder

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

export const defaultConfig: FilterConfig = {
  caseSensitive: false,
  maxDepth: 3,
  enableCache: false,
  debug: false,
  verbose: false,
  showTimings: false,
  colorize: false,
};

export function mergeConfig(options?: FilterOptions): FilterConfig {
  return {
    ...defaultConfig,
    ...options,
  };
}

export function createFilterConfig(options?: FilterOptions): FilterConfig {
  const config = mergeConfig(options);

  // Validate configuration
  if (config.maxDepth < 1 || config.maxDepth > 10) {
    throw new Error('maxDepth must be between 1 and 10');
  }

  return config;
}
```

## Validation System

### Zod Schema Validation

```typescript
import { z } from 'zod';

const operatorSchema = z.object({
  $eq: z.any().optional(),
  $ne: z.any().optional(),
  $gt: z.union([z.number(), z.date()]).optional(),
  $gte: z.union([z.number(), z.date()]).optional(),
  $lt: z.union([z.number(), z.date()]).optional(),
  $lte: z.union([z.number(), z.date()]).optional(),
  $in: z.array(z.any()).optional(),
  $nin: z.array(z.any()).optional(),
  $contains: z.any().optional(),
  $size: z.number().optional(),
  $startsWith: z.string().optional(),
  $endsWith: z.string().optional(),
  $regex: z.union([z.instanceof(RegExp), z.string()]).optional(),
  $match: z.union([z.instanceof(RegExp), z.string()]).optional(),
  $near: z.object({
    center: z.object({ lat: z.number(), lng: z.number() }),
    maxDistanceMeters: z.number().positive(),
  }).optional(),
  $recent: z.object({
    days: z.number().optional(),
    hours: z.number().optional(),
    minutes: z.number().optional(),
  }).optional(),
  // ... other operators
});

export function validateExpression<T>(expression: unknown): Expression<T> {
  // Validate expression structure
  if (typeof expression === 'function') {
    return expression as PredicateFunction<T>;
  }

  if (isPrimitive(expression)) {
    return expression as PrimitiveExpression;
  }

  if (typeof expression === 'object' && expression !== null) {
    // Validate operators
    for (const [key, value] of Object.entries(expression)) {
      if (key.startsWith('$')) {
        operatorSchema.parse({ [key]: value });
      }
    }
    return expression as ObjectExpression<T>;
  }

  throw new Error(`Invalid expression: ${typeof expression}`);
}
```

## Extension Points

### Custom Operators

```typescript
const customOperators = new Map<string, OperatorFunction>();

export function registerOperator(
  name: string,
  fn: OperatorFunction,
): void {
  if (!name.startsWith('$')) {
    throw new Error('Operator name must start with $');
  }
  customOperators.set(name, fn);
}

export function getOperator(name: string): OperatorFunction | undefined {
  return customOperators.get(name) || builtInOperators.get(name);
}

// Example: Register custom operator
registerOperator('$divisibleBy', (value: number, divisor: number) => {
  return value % divisor === 0;
});

// Usage
filter(numbers, { value: { $divisibleBy: 3 } });
```

### Configuration Hooks

```typescript
export interface FilterConfig {
  // ... existing config
  onBeforeFilter?: (data: any[], expression: any) => void;
  onAfterFilter?: (result: any[], executionTime: number) => void;
  onError?: (error: Error) => void;
}

export function filter<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions,
): T[] {
  const config = mergeConfig(options);

  // Before hook
  config.onBeforeFilter?.(array, expression);

  const startTime = performance.now();

  try {
    const result = filterImpl(array, expression, config);
    const executionTime = performance.now() - startTime;

    // After hook
    config.onAfterFilter?.(result, executionTime);

    return result;
  } catch (error) {
    config.onError?.(error as Error);
    throw error;
  }
}
```

## Bundle Optimization

### Tree-Shaking Support

```typescript
// Separate exports for optimal tree-shaking
export { filter } from './core/filter/filter';
export { filterLazy, filterFirst, filterExists, filterCount } from './core/lazy/filter-lazy';
export { filterDebug } from './debug/debug-filter';

// Framework integrations in separate entry points
export { useFilter, useDebouncedFilter } from './integrations/react';
export { useFilter as useFilterVue } from './integrations/vue';
export { useFilter as useFilterSvelte } from './integrations/svelte';
```

### Code Splitting Configuration

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./react": {
      "import": "./dist/integrations/react/index.js",
      "types": "./dist/integrations/react/index.d.ts"
    },
    "./vue": {
      "import": "./dist/integrations/vue/index.js",
      "types": "./dist/integrations/vue/index.d.ts"
    },
    "./svelte": {
      "import": "./dist/integrations/svelte/index.js",
      "types": "./dist/integrations/svelte/index.d.ts"
    }
  }
}
```

## Testing Architecture

### Unit Tests

Each component has isolated unit tests with 100% coverage:

```typescript
describe('filter', () => {
  it('should filter by equality operator', () => {
    const data = [{ age: 25 }, { age: 30 }];
    const result = filter(data, { age: { $eq: 25 } });
    expect(result).toEqual([{ age: 25 }]);
  });

  it('should support geospatial operators', () => {
    const data = [
      { location: { lat: 52.52, lng: 13.405 } },
      { location: { lat: 51.5074, lng: -0.1278 } },
    ];

    const result = filter(data, {
      location: {
        $near: {
          center: { lat: 52.52, lng: 13.405 },
          maxDistanceMeters: 100,
        },
      },
    });

    expect(result).toHaveLength(1);
  });

  it('should support Datetime operators', () => {
    const data = [
      { birthDate: new Date('1990-01-01') },
      { birthDate: new Date('2010-01-01') },
    ];

    const result = filter(data, {
      birthDate: { $age: { min: 18, unit: 'years' } },
    });

    expect(result).toHaveLength(1);
  });
});
```

### Integration Tests

Test framework integrations across all frameworks:

```typescript
describe('useFilter (React)', () => {
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

describe('useFilter (Vue)', () => {
  it('should be reactive to data changes', () => {
    const data = ref([{ age: 20 }]);
    const { filtered } = useFilter(data, { age: { $gte: 18 } });

    expect(filtered.value).toHaveLength(1);

    data.value = [{ age: 15 }];

    expect(filtered.value).toHaveLength(0);
  });
});
```

### Performance Tests

```typescript
describe('performance', () => {
  it('should handle large datasets efficiently', () => {
    const data = Array.from({ length: 100000 }, (_, i) => ({ id: i }));

    const start = performance.now();
    filter(data, { id: { $gte: 50000 } });
    const end = performance.now();

    expect(end - start).toBeLessThan(100); // < 100ms
  });

  it('should benefit from caching', () => {
    const data = Array.from({ length: 10000 }, (_, i) => ({ id: i }));
    const expression = { id: { $gte: 5000 } };

    // First call
    const start1 = performance.now();
    filter(data, expression, { enableCache: true });
    const time1 = performance.now() - start1;

    // Second call (cached)
    const start2 = performance.now();
    filter(data, expression, { enableCache: true });
    const time2 = performance.now() - start2;

    expect(time2).toBeLessThan(time1 * 0.1); // 10x faster
  });
});
```

## Evolution Timeline

- **v5.0.0**: MongoDB-style operators, configuration API, validation
- **v5.1.0**: Lazy evaluation with generators
- **v5.2.0**: Multi-layer memoization, logical operators
- **v5.3.0**: Initial framework integrations
- **v5.4.0**: Full React, Vue, Svelte support
- **v5.5.0**: Array OR syntax, visual debugging, playground
- **v5.6.0**: Geospatial operators, datetime operators
- **v5.7.0**: Angular, SolidJS, Preact integrations
- **v5.8.0**: OrderBy and limit configuration options
- **v5.8.2**: Current stable version with comprehensive documentation

## Related Resources

- [Type System](/advanced/type-system)
- [Performance Benchmarks](/advanced/performance-benchmarks)
- [Contributing Guide](/project/contributing)
- [API Reference](/api/reference)
- [Operators Guide](/guide/operators)
- [Lazy Evaluation](/guide/lazy-evaluation)
- [Memoization Guide](/guide/memoization)
- [Framework Integrations](/frameworks/overview)