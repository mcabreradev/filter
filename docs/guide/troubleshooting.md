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
- **Comparison**: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`
- **Array**: `$in`, `$nin`, `$contains`, `$size`
- **String**: `$startsWith`, `$endsWith`, `$regex`, `$match`
- **Logical**: `$and`, `$or`, `$not`
- **Geospatial**: `$near`, `$geoBox`, `$geoPolygon`
- **DateTime**: `$recent`, `$upcoming`, `$dayOfWeek`, `$timeOfDay`, `$age`, `$isWeekday`, `$isWeekend`, `$isBefore`, `$isAfter`

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

### Geospatial Queries Not Working

**Problem**: `$near` operator returns no results.

**Cause 1**: Invalid coordinates (latitude must be -90 to 90, longitude -180 to 180)

**Solution**:
```typescript
// Correct coordinate format
const expression = {
  location: {
    $near: {
      center: { lat: 52.52, lng: 13.405 },
      maxDistanceMeters: 5000
    }
  }
};
```

**Cause 2**: Distance unit mismatch (all distances are in meters)

**Solution**:
```typescript
// Convert kilometers to meters
const distanceKm = 5;
const expression = {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: distanceKm * 1000
    }
  }
};
```

### DateTime Filters Not Matching

**Problem**: `$recent` or `$upcoming` returns unexpected results.

**Cause**: Date property is stored as string instead of Date object.

**Solution**: Convert strings to Date objects
```typescript
const data = rawData.map(item => ({
  ...item,
  date: new Date(item.date)
}));

const expression = {
  date: { $recent: { days: 7 } }
};
```

### $dayOfWeek Not Filtering Correctly

**Problem**: `$dayOfWeek` doesn't match expected days.

**Cause**: Day numbering starts at 0 (Sunday) through 6 (Saturday).

**Solution**:
```typescript
// Weekdays: Monday (1) to Friday (5)
const expression = {
  date: { $dayOfWeek: [1, 2, 3, 4, 5] }
};

// Weekends: Saturday (6) and Sunday (0)
const expression = {
  date: { $dayOfWeek: [0, 6] }
};

// Or use convenience operators
const expression = {
  date: { $isWeekday: true }  // Monday-Friday
};
```

### $age Calculation Issues

**Problem**: `$age` returns incorrect age.

**Cause**: Birth date property not in Date format.

**Solution**:
```typescript
// Ensure birthDate is a Date object
const users = rawUsers.map(user => ({
  ...user,
  birthDate: new Date(user.birthDate)
}));

const expression = {
  birthDate: { $age: { min: 18, max: 65 } }
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

### Geospatial Performance Issues

**Problem**: Filtering large datasets with geospatial queries is slow.

**Solution 1**: Use bounding box for initial filtering
```typescript
// First filter by bounding box (fast)
const nearbyItems = filter(items, {
  location: {
    $geoBox: {
      southwest: { lat: 52.5, lng: 13.3 },
      northeast: { lat: 52.6, lng: 13.5 }
    }
  }
});

// Then apply precise distance filter
const results = filter(nearbyItems, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 2000
    }
  }
});
```

**Solution 2**: Enable memoization for repeated queries
```typescript
const { filtered } = useFilter(restaurants, expression, { memoize: true });
```

### DateTime Timezone Issues

**Problem**: DateTime filters not working across timezones.

**Solution**: Normalize all dates to UTC
```typescript
const normalizeToUTC = (date: Date) => {
  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ));
};

const data = rawData.map(item => ({
  ...item,
  date: normalizeToUTC(new Date(item.date))
}));
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

