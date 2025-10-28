# Troubleshooting

Common issues and solutions when using @mcabreradev/filter.

## Installation Issues

### Package Not Found

**Problem**: `npm install @mcabreradev/filter` fails with 404 error.

**Solution**:
```bash
npm cache clean --force
npm install @mcabreradev/filter
```

### TypeScript Errors After Installation

**Problem**: TypeScript cannot find type definitions.

**Solution**:
```bash
npm install --save-dev @types/node
```

Ensure `tsconfig.json` includes:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

## React Integration Issues

### Hook Returns Undefined

**Problem**: `useFilter` returns `undefined` for `filtered`.

**Cause**: Data prop is `null` or `undefined`.

**Solution**:
```typescript
const { filtered } = useFilter(data ?? [], expression);
```

### Infinite Re-renders

**Problem**: Component re-renders infinitely when using `useFilter`.

**Cause**: Expression or options object recreated on every render.

**Solution**:
```typescript
const expression = useMemo(() => ({ age: { $gte: 18 } }), []);
const options = useMemo(() => ({ memoize: true }), []);

const { filtered } = useFilter(data, expression, options);
```

### Stale Closure in useEffect

**Problem**: `filtered` data is stale inside `useEffect`.

**Solution**:
```typescript
useEffect(() => {
  console.log(filtered);
}, [filtered]);
```

## Vue Integration Issues

### Reactivity Not Working

**Problem**: Filtered results don't update when data changes.

**Cause**: Data is not reactive.

**Solution**:
```typescript
import { ref } from 'vue';

const data = ref([...]);
const expression = ref({ status: 'active' });

const { filtered } = useFilter(data, expression);
```

### ComputedRef Type Errors

**Problem**: TypeScript errors when accessing `filtered.value`.

**Solution**:
```typescript
import type { ComputedRef } from 'vue';

const { filtered }: { filtered: ComputedRef<User[]> } = useFilter(data, expression);
```

## Svelte Integration Issues

### Store Not Updating

**Problem**: `$filtered` doesn't update in template.

**Cause**: Not subscribing to store properly.

**Solution**:
```svelte
<script lang="ts">
  import { useFilter } from '@mcabreradev/filter/svelte';

  const { filtered } = useFilter(data, expression);
</script>

{#each $filtered as item}
  <div>{item.name}</div>
{/each}
```

### TypeScript Errors with Stores

**Problem**: Type errors when using Svelte stores.

**Solution**:
```typescript
import type { Readable } from 'svelte/store';
import type { User } from './types';

const { filtered }: { filtered: Readable<User[]> } = useFilter(data, expression);
```

## Performance Issues

### Slow Filtering on Large Datasets

**Problem**: Filtering takes too long with 10,000+ items.

**Solution 1**: Enable memoization
```typescript
const { filtered } = useFilter(data, expression, { memoize: true });
```

**Solution 2**: Use lazy evaluation
```typescript
import { createLazyFilter } from '@mcabreradev/filter';

const lazyFilter = createLazyFilter(data, expression);
const first10 = lazyFilter.take(10).toArray();
```

**Solution 3**: Use pagination
```typescript
const { filtered, currentPage, nextPage } = usePaginatedFilter(
  data,
  expression,
  50
);
```

### Memory Leaks

**Problem**: Memory usage grows over time.

**Cause**: Memoization cache not cleared.

**Solution**:
```typescript
import { clearMemoizationCache } from '@mcabreradev/filter';

useEffect(() => {
  return () => {
    clearMemoizationCache();
  };
}, []);
```

## Expression Syntax Issues

### Operator Not Working

**Problem**: Custom operator doesn't filter correctly.

**Check**: Operator name and syntax
```typescript
const expression = {
  age: { $gte: 18 }
};
```

Available operators:
- `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`
- `$in`, `$nin`, `$contains`, `$startsWith`, `$endsWith`
- `$regex`, `$and`, `$or`, `$not`

### Nested Property Access Fails

**Problem**: Cannot filter by nested properties.

**Solution**:
```typescript
const expression = {
  'address.city': { $eq: 'New York' }
};
```

Or use dot notation:
```typescript
const expression = {
  address: {
    city: { $eq: 'New York' }
  }
};
```

### Case-Sensitive String Matching

**Problem**: String comparisons are case-sensitive.

**Solution**: Use `$regex` with case-insensitive flag
```typescript
const expression = {
  name: { $regex: /john/i }
};
```

## Type Safety Issues

### Generic Type Not Inferred

**Problem**: TypeScript doesn't infer item type.

**Solution**: Explicitly provide generic type
```typescript
interface User {
  id: number;
  name: string;
}

const { filtered } = useFilter<User>(data, expression);
```

### Expression Type Errors

**Problem**: Expression doesn't match data type.

**Solution**: Use type-safe expression builder
```typescript
import type { Expression } from '@mcabreradev/filter';

const expression: Expression<User> = {
  age: { $gte: 18 },
  status: { $eq: 'active' }
};
```

## Debugging Tips

### Enable Debug Logging

```typescript
const options = {
  debug: true
};

const { filtered } = useFilter(data, expression, options);
```

### Inspect Expression

```typescript
console.log('Expression:', JSON.stringify(expression, null, 2));
console.log('Data count:', data.length);
console.log('Filtered count:', filtered.length);
```

### Check Operator Processing

```typescript
import { processOperator } from '@mcabreradev/filter';

const result = processOperator(value, operator, operand);
console.log('Operator result:', result);
```

## Common Patterns Issues

### Combining Multiple Filters

**Problem**: Multiple filters not working together.

**Solution**: Use `$and` operator
```typescript
const expression = {
  $and: [
    { age: { $gte: 18 } },
    { status: { $eq: 'active' } },
    { role: { $in: ['admin', 'user'] } }
  ]
};
```

### Dynamic Filter Building

**Problem**: Building filters dynamically is complex.

**Solution**: Use configuration builder
```typescript
import { createFilterConfig } from '@mcabreradev/filter';

const config = createFilterConfig<User>()
  .where('age', { $gte: 18 })
  .where('status', { $eq: 'active' })
  .build();
```

## Getting Help

If you're still experiencing issues:

1. Check the [API Reference](/api/core)
2. Review [Examples](/examples/basic-usage)
3. Search [GitHub Issues](https://github.com/mcabreradev/filter/issues)
4. Open a [new issue](https://github.com/mcabreradev/filter/issues/new) with:
   - Library version
   - Framework and version
   - Minimal reproduction code
   - Expected vs actual behavior

## Related Resources

- [Configuration Guide](/guide/configuration)
- [Best Practices](/guide/best-practices)
- [Performance Optimization](/advanced/performance)
- [Migration Guide](/guide/migration-v2)

