# Configuration

Complete reference for configuring @mcabreradev/filter.

## Overview

The library supports various configuration options to customize filtering behavior, optimize performance, and enable advanced features.

## Filter Options

### Basic Options

```typescript
interface FilterOptions {
  memoize?: boolean;
  caseSensitive?: boolean;
  debug?: boolean;
  lazy?: boolean;
}
```

### Memoization

Cache filter results for improved performance on repeated operations.

```typescript
const { filtered } = useFilter(data, expression, {
  memoize: true
});
```

**When to use**:
- Large datasets (1,000+ items)
- Expensive filter operations
- Repeated filtering with same expression

**Trade-offs**:
- Increased memory usage
- Cache invalidation complexity

### Case Sensitivity

Control string comparison behavior.

```typescript
const { filtered } = useFilter(data, expression, {
  caseSensitive: false
});
```

**Default**: `true`

**Example**:
```typescript
const expression = {
  name: { $eq: 'john' }
};

const options = { caseSensitive: false };
```

### Debug Mode

Enable detailed logging for troubleshooting.

```typescript
const { filtered } = useFilter(data, expression, {
  debug: true
});
```

**Output**:
- Expression parsing details
- Operator execution logs
- Performance metrics

### Lazy Evaluation

Defer filtering until results are needed.

```typescript
const { filtered } = useFilter(data, expression, {
  lazy: true
});
```

**Benefits**:
- Reduced initial computation
- Memory efficient for large datasets
- Chainable operations

## Debounced Filter Options

### Configuration

```typescript
interface UseDebouncedFilterOptions extends FilterOptions {
  delay?: number;
}
```

### Delay Setting

Control debounce timing for search inputs.

```typescript
const { filtered, isPending } = useDebouncedFilter(data, expression, {
  delay: 300
});
```

**Default**: `300ms`

**Recommendations**:
- Search inputs: `300-500ms`
- Real-time updates: `100-200ms`
- Heavy operations: `500-1000ms`

### Example: Search Input

```typescript
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const expression = useMemo(() => ({
    name: { $regex: new RegExp(searchTerm, 'i') }
  }), [searchTerm]);

  const { filtered, isPending } = useDebouncedFilter(users, expression, {
    delay: 300,
    memoize: true
  });

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
      {isPending && <Spinner />}
      <UserList users={filtered} />
    </div>
  );
};
```

## Paginated Filter Options

### Configuration

```typescript
interface UsePaginatedFilterOptions extends FilterOptions {
  initialPage?: number;
}
```

### Page Size

Set number of items per page.

```typescript
const { filtered, currentPage, totalPages } = usePaginatedFilter(
  data,
  expression,
  50
);
```

**Default**: `10`

**Recommendations**:
- Tables: `10-25`
- Cards/Grid: `12-24`
- Lists: `20-50`

### Initial Page

Start on specific page.

```typescript
const { filtered } = usePaginatedFilter(data, expression, 20, {
  initialPage: 2
});
```

### Complete Example

```typescript
const PaginatedTable = () => {
  const [pageSize, setPageSize] = useState(25);

  const {
    filtered,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    setPageSize: updatePageSize
  } = usePaginatedFilter(users, expression, pageSize, {
    memoize: true
  });

  return (
    <div>
      <Table data={filtered} />

      <Pagination
        current={currentPage}
        total={totalPages}
        onNext={nextPage}
        onPrevious={previousPage}
        onGoTo={goToPage}
      />

      <select
        value={pageSize}
        onChange={(e) => {
          const newSize = Number(e.target.value);
          setPageSize(newSize);
          updatePageSize(newSize);
        }}
      >
        <option value={10}>10 per page</option>
        <option value={25}>25 per page</option>
        <option value={50}>50 per page</option>
      </select>
    </div>
  );
};
```

## Configuration Builder

### Creating Configurations

Use the builder pattern for complex setups.

```typescript
import { createFilterConfig } from '@mcabreradev/filter';

const config = createFilterConfig<User>()
  .withMemoization(true)
  .withCaseSensitivity(false)
  .withDebug(process.env.NODE_ENV === 'development')
  .build();

const { filtered } = useFilter(data, expression, config);
```

### Preset Configurations

#### Development Mode

```typescript
const devConfig = createFilterConfig()
  .withDebug(true)
  .withMemoization(false)
  .build();
```

#### Production Mode

```typescript
const prodConfig = createFilterConfig()
  .withDebug(false)
  .withMemoization(true)
  .build();
```

#### Performance Mode

```typescript
const perfConfig = createFilterConfig()
  .withMemoization(true)
  .withLazy(true)
  .build();
```

## Environment-Based Configuration

### Setup

```typescript
const getFilterConfig = (): FilterOptions => {
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';

  return {
    debug: isDev,
    memoize: isProd,
    lazy: isProd
  };
};

const config = getFilterConfig();
```

### Usage

```typescript
const { filtered } = useFilter(data, expression, config);
```

## Global Configuration

### Setting Defaults

```typescript
import { setDefaultConfig } from '@mcabreradev/filter';

setDefaultConfig({
  memoize: true,
  caseSensitive: false,
  debug: false
});
```

### Overriding Defaults

```typescript
const { filtered } = useFilter(data, expression, {
  debug: true
});
```

## Performance Tuning

### Large Datasets (10,000+ items)

```typescript
const config = {
  memoize: true,
  lazy: true
};
```

### Real-Time Updates

```typescript
const config = {
  memoize: false,
  lazy: false
};
```

### Memory-Constrained Environments

```typescript
const config = {
  memoize: false,
  lazy: true
};
```

## Framework-Specific Configuration

### React

```typescript
const config = useMemo(() => ({
  memoize: true,
  caseSensitive: false
}), []);

const { filtered } = useFilter(data, expression, config);
```

### Vue

```typescript
import { reactive } from 'vue';

const config = reactive({
  memoize: true,
  caseSensitive: false
});

const { filtered } = useFilter(data, expression, config);
```

### Svelte

```typescript
import { writable } from 'svelte/store';

const config = writable({
  memoize: true,
  caseSensitive: false
});

const { filtered } = useFilter(data, expression, $config);
```

## Best Practices

### 1. Memoize Configuration Objects

```typescript
const config = useMemo(() => ({
  memoize: true,
  caseSensitive: false
}), []);
```

### 2. Use Environment Variables

```typescript
const config = {
  debug: process.env.NODE_ENV === 'development',
  memoize: process.env.NODE_ENV === 'production'
};
```

### 3. Profile Before Optimizing

```typescript
const config = {
  debug: true
};

console.time('filter');
const { filtered } = useFilter(data, expression, config);
console.timeEnd('filter');
```

### 4. Clear Cache When Needed

```typescript
import { clearMemoizationCache } from '@mcabreradev/filter';

useEffect(() => {
  return () => clearMemoizationCache();
}, []);
```

## Related Resources

- [Performance Optimization](/advanced/performance)
- [Best Practices](/guide/best-practices)
- [Troubleshooting](/guide/troubleshooting)
- [API Reference](/api/configuration)

