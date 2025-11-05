# Frequently Asked Questions

Common questions about @mcabreradev/filter.

## General Questions

### What is @mcabreradev/filter?

A TypeScript-first filtering library that provides powerful, type-safe filtering capabilities for JavaScript arrays with framework integrations for React, Vue, and Svelte.

### Why use this instead of Array.filter()?

**Advantages**:
- Type-safe expressions with TypeScript
- Advanced operators (30+ including comparison, array, string, logical, geospatial, datetime)
- Built-in memoization for performance
- Framework-specific hooks/composables
- Lazy evaluation support
- Pagination and debouncing utilities
- Nested object filtering
- Complex logical operations
- Geospatial queries ($near, $geoBox, $geoPolygon)
- DateTime filtering ($recent, $upcoming, $dayOfWeek, $age)

### Is it production-ready?

Yes. The library is:
- Fully tested (613+ tests, 100% coverage)
- Type-safe with TypeScript
- Used in production applications
- Actively maintained
- Semantic versioning

### What's the bundle size?

- Core: ~3KB gzipped
- React integration: ~1KB additional
- Vue integration: ~1KB additional
- Svelte integration: ~1KB additional

Tree-shaking ensures you only bundle what you use.

## Installation & Setup

### Which package manager should I use?

Any modern package manager works:

```bash
npm install @mcabreradev/filter
pnpm add @mcabreradev/filter
yarn add @mcabreradev/filter
bun add @mcabreradev/filter
```

### Do I need TypeScript?

No, but it's recommended. The library works with JavaScript but provides excellent TypeScript support with full type inference.

### What are the peer dependencies?

**Core**: None

**React**: `react ^18.0.0`

**Vue**: `vue ^3.0.0`

**Svelte**: `svelte ^3.0.0 || ^4.0.0`

### Can I use it with older React/Vue/Svelte versions?

- React 16/17: May work but not officially supported
- Vue 2: Not supported (use Vue 3)
- Svelte 3: Supported

## Usage Questions

### How do I filter by multiple conditions?

Use the `$and` operator:

```typescript
const expression = {
  $and: [
    { age: { $gte: 18 } },
    { status: { $eq: 'active' } },
    { role: { $in: ['admin', 'user'] } }
  ]
};
```

### How do I filter nested objects?

Use dot notation or nested objects:

```typescript
const expression = {
  'address.city': { $eq: 'New York' }
};

const expression = {
  address: {
    city: { $eq: 'New York' }
  }
};
```

### How do I do case-insensitive string matching?

Use `$regex` with the `i` flag:

```typescript
const expression = {
  name: { $regex: /john/i }
};
```

Or configure globally:

```typescript
const { filtered } = useFilter(data, expression, {
  caseSensitive: false
});
```

### Can I use custom operators?

Yes, extend the operator system:

```typescript
import { registerOperator } from '@mcabreradev/filter';

registerOperator('$between', (value, [min, max]) => {
  return value >= min && value <= max;
});

const expression = {
  age: { $between: [18, 65] }
};
```

### How do I filter arrays within objects?

Use the `$contains` or `$in` operators:

```typescript
const expression = {
  tags: { $contains: 'javascript' }
};

const expression = {
  'items.0.name': { $eq: 'Product A' }
};
```

### How do I filter by location/proximity?

Use geospatial operators (v5.6.0+):

```typescript
// Find items within 5km radius
const expression = {
  location: {
    $near: {
      center: { lat: 52.52, lng: 13.405 },
      maxDistanceMeters: 5000
    }
  }
};

// Find items in bounding box
const expression = {
  location: {
    $geoBox: {
      southwest: { lat: 52.5, lng: 13.3 },
      northeast: { lat: 52.6, lng: 13.5 }
    }
  }
};
```

### How do I filter by date/time ranges?

Use datetime operators (v5.6.0+):

```typescript
// Events in next 7 days
const expression = {
  date: { $upcoming: { days: 7 } }
};

// Recent events (last 24 hours)
const expression = {
  date: { $recent: { hours: 24 } }
};

// Weekday events only
const expression = {
  date: { $dayOfWeek: [1, 2, 3, 4, 5] }
};

// Business hours (9 AM - 5 PM)
const expression = {
  startTime: { $timeOfDay: { start: 9, end: 17 } }
};

// Users 18 years or older
const expression = {
  birthDate: { $age: { min: 18 } }
};
```

## Performance Questions

### When should I enable memoization?

Enable memoization when:
- Dataset has 1,000+ items
- Same expression used repeatedly
- Filter operations are expensive

```typescript
const { filtered } = useFilter(data, expression, {
  memoize: true
});
```

### How do I optimize for large datasets?

**Strategies**:

1. Enable memoization
2. Use pagination
3. Use lazy evaluation
4. Debounce user input

```typescript
const { filtered } = usePaginatedFilter(data, expression, 50, {
  memoize: true
});
```

### Does it cause re-renders in React?

Only when dependencies change. Use `useMemo` for expressions:

```typescript
const expression = useMemo(() => ({
  status: { $eq: 'active' }
}), []);

const { filtered } = useFilter(data, expression);
```

### How do I clear the memoization cache?

```typescript
import { clearMemoizationCache } from '@mcabreradev/filter';

clearMemoizationCache();
```

Or disable memoization:

```typescript
const { filtered } = useFilter(data, expression, {
  memoize: false
});
```

## Geospatial & DateTime Questions

### What coordinate format does $near use?

Standard WGS84 coordinates (latitude/longitude):

```typescript
const location = {
  lat: 52.52,   // Latitude: -90 to 90
  lng: 13.405   // Longitude: -180 to 180
};

const expression = {
  location: {
    $near: {
      center: location,
      maxDistanceMeters: 5000  // Always in meters
    }
  }
};
```

### How accurate is the distance calculation?

Uses the spherical law of cosines with Earth radius = 6,371,000 meters. Accuracy:
- **< 100km**: ~99.9% accurate
- **100-1000km**: ~99.5% accurate
- **> 1000km**: ~99% accurate

For most use cases (restaurant finders, delivery zones, store locators), this is highly accurate.

### Can I use miles instead of meters?

Convert to meters:

```typescript
const milestoMeters = (miles: number) => miles * 1609.34;

const expression = {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: milestoMeters(5)  // 5 miles
    }
  }
};
```

### How do I filter by polygon/custom area?

Use `$geoPolygon`:

```typescript
const expression = {
  location: {
    $geoPolygon: {
      points: [
        { lat: 51.5074, lng: -0.1278 },
        { lat: 51.5100, lng: -0.1200 },
        { lat: 51.5050, lng: -0.1150 },
        { lat: 51.5020, lng: -0.1250 }
      ]
    }
  }
};
```

### What timezone are datetime operators using?

All datetime operators use the **local timezone** of the Date objects. For UTC:

```typescript
// Convert to UTC
const data = rawData.map(item => ({
  ...item,
  date: new Date(Date.UTC(
    item.date.getFullYear(),
    item.date.getMonth(),
    item.date.getDate()
  ))
}));
```

### How does $dayOfWeek numbering work?

Days are numbered 0-6:
- **0** = Sunday
- **1** = Monday
- **2** = Tuesday
- **3** = Wednesday
- **4** = Thursday
- **5** = Friday
- **6** = Saturday

```typescript
// Weekdays (Monday-Friday)
const expression = {
  date: { $dayOfWeek: [1, 2, 3, 4, 5] }
};

// Or use convenience operators
const expression = {
  date: { $isWeekday: true }
};
```

### Can I combine geospatial and datetime filters?

Yes, use `$and`:

```typescript
const expression = {
  $and: [
    {
      location: {
        $near: {
          center: userLocation,
          maxDistanceMeters: 5000
        }
      }
    },
    {
      eventDate: { $upcoming: { days: 7 } }
    },
    {
      eventDate: { $dayOfWeek: [1, 2, 3, 4, 5] }  // Weekdays only
    }
  ]
};
```

### How do I calculate age from birthdate?

Use `$age`:

```typescript
// Users 18-65 years old
const expression = {
  birthDate: {
    $age: {
      min: 18,
      max: 65,
      unit: 'years'  // 'years', 'months', or 'days'
    }
  }
};
```

### What's the difference between $recent and $isBefore?

- **`$recent`**: Relative to current time (e.g., "last 7 days")
- **`$isBefore`**: Absolute comparison to specific date

```typescript
// Relative: Events in last 7 days
const expression = {
  date: { $recent: { days: 7 } }
};

// Absolute: Events before Jan 1, 2025
const expression = {
  date: { $isBefore: new Date('2025-01-01') }
};
```

## Performance Questions

### When should I enable memoization?

Enable memoization when:
- Dataset has 1,000+ items
- Same expression used repeatedly
- Filter operations are expensive

```typescript
const { filtered } = useFilter(data, expression, {
  memoize: true
});
```

### How do I optimize for large datasets?

**Strategies**:

1. Enable memoization
2. Use pagination
3. Use lazy evaluation
4. Debounce user input

```typescript
const { filtered } = usePaginatedFilter(data, expression, 50, {
  memoize: true
});
```

### Does it cause re-renders in React?

Only when dependencies change. Use `useMemo` for expressions:

```typescript
const expression = useMemo(() => ({
  status: { $eq: 'active' }
}), []);

const { filtered } = useFilter(data, expression);
```

### How do I clear the memoization cache?

```typescript
import { clearMemoizationCache } from '@mcabreradev/filter';

clearMemoizationCache();
```

Or disable memoization:

```typescript
const { filtered } = useFilter(data, expression, {
  memoize: false
});
```

## Framework Integration Questions

### Can I use it without a framework?

Yes, use the core functions:

```typescript
import { filter } from '@mcabreradev/filter';

const filtered = filter(data, expression);
```

### Does it work with Next.js?

Yes, works with both App Router and Pages Router:

```typescript
'use client';

import { useFilter } from '@mcabreradev/filter/react';

export default function Page() {
  const { filtered } = useFilter(data, expression);
  return <div>{/* ... */}</div>;
}
```

### Does it work with Nuxt?

Yes, use in components:

```vue
<script setup lang="ts">
import { useFilter } from '@mcabreradev/filter/vue';

const { filtered } = useFilter(data, expression);
</script>
```

### Does it work with SvelteKit?

Yes, use in components:

```svelte
<script lang="ts">
  import { useFilter } from '@mcabreradev/filter/svelte';

  const { filtered } = useFilter(data, expression);
</script>
```

### Can I use it with React Native?

Yes, the React integration works with React Native:

```typescript
import { useFilter } from '@mcabreradev/filter/react';
```

## TypeScript Questions

### How do I type my data?

Provide a generic type parameter:

```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

const { filtered } = useFilter<User>(data, expression);
```

### How do I type expressions?

Use the `Expression` type:

```typescript
import type { Expression } from '@mcabreradev/filter';

const expression: Expression<User> = {
  age: { $gte: 18 }
};
```

### Why am I getting type errors?

Common causes:

1. Missing generic type parameter
2. Incorrect operator syntax
3. Property doesn't exist on type
4. Incompatible value types

**Solution**: Provide explicit types and check operator syntax.

### Does it support generic components?

Yes:

```typescript
function FilteredList<T>({ data, expression }: Props<T>) {
  const { filtered } = useFilter<T>(data, expression);
  return <div>{/* ... */}</div>;
}
```

## Migration Questions

### How do I migrate from v4 to v5?

The library is **100% backward compatible** - no breaking changes! All v3.x and v4.x code continues to work.

See the [Migration Guide](/guide/migration-v2) for details on new features.

**What's New in v5.x** (all optional):
- v5.6.0: Geospatial and datetime operators
- v5.5.0: Array OR syntax, visual debugging
- v5.4.0: Framework integrations
- v5.2.0: Logical operators, memoization
- v5.1.0: Lazy evaluation
- v5.0.0: MongoDB-style operators

### Can I migrate incrementally?

No migration needed! Just upgrade and all existing code works:

```bash
npm install @mcabreradev/filter@latest
```

All v3.x/v4.x syntax remains valid:
```typescript
// All these still work in v5.x
filter(data, 'string');
filter(data, { prop: 'value' });
filter(data, (item) => true);
filter(data, '%pattern%');

// Plus new v5.x features (optional)
filter(data, { age: { $gte: 18 } });
filter(data, { location: { $near: { center, maxDistanceMeters: 5000 } } });
```

### How do I migrate from Array.filter()?

**Before**:
```typescript
const filtered = data.filter(item =>
  item.age >= 18 && item.status === 'active'
);
```

**After**:
```typescript
const expression = {
  $and: [
    { age: { $gte: 18 } },
    { status: { $eq: 'active' } }
  ]
};

const { filtered } = useFilter(data, expression);
```

## Testing Questions

### How do I test components using the library?

**React Testing Library**:

```typescript
import { render, screen } from '@testing-library/react';
import { useFilter } from '@mcabreradev/filter/react';

test('filters data correctly', () => {
  const TestComponent = () => {
    const { filtered } = useFilter(mockData, expression);
    return <div>{filtered.length}</div>;
  };

  render(<TestComponent />);
  expect(screen.getByText('2')).toBeInTheDocument();
});
```

### How do I mock the library?

```typescript
jest.mock('@mcabreradev/filter/react', () => ({
  useFilter: jest.fn(() => ({
    filtered: mockFilteredData,
    isFiltering: false
  }))
}));
```

### Does it work with Vitest?

Yes, fully compatible with Vitest.

## Troubleshooting Questions

### Why isn't my filter working?

**Check**:
1. Expression syntax is correct
2. Data is not null/undefined
3. Property names match exactly
4. Operator is supported

Enable debug mode:

```typescript
const { filtered } = useFilter(data, expression, {
  debug: true
});
```

### Why is filtering slow?

**Solutions**:
1. Enable memoization for repeated queries
2. Use pagination for large datasets
3. Reduce dataset size with pre-filtering
4. Use lazy evaluation for early exit scenarios
5. For geospatial queries, use $geoBox before $near
6. Optimize datetime queries by filtering date ranges first

```typescript
// Example: Optimize geospatial + other filters
const nearbyFiltered = filter(data, {
  location: { $geoBox: boundingBox }  // Fast pre-filter
});

const results = filter(nearbyFiltered, {
  location: { $near: { center, maxDistanceMeters: 2000 } },
  rating: { $gte: 4.5 }
});
```

### Why am I getting infinite re-renders?

**Cause**: Expression or options recreated on every render.

**Solution**: Use `useMemo`:

```typescript
const expression = useMemo(() => ({
  status: { $eq: 'active' }
}), []);
```

### Where can I get help?

1. Check [Troubleshooting Guide](/guide/troubleshooting)
2. Review [Examples](/examples/basic-usage)
3. Search [GitHub Issues](https://github.com/mcabreradev/filter/issues)
4. Open a [new issue](https://github.com/mcabreradev/filter/issues/new)

## Contributing Questions

### How can I contribute?

See the [Contributing Guide](/project/contributing).

Ways to contribute:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation
- Share examples

### How do I report a bug?

Open a [GitHub issue](https://github.com/mcabreradev/filter/issues/new) with:
- Library version
- Framework and version
- Minimal reproduction code
- Expected vs actual behavior

### Can I add new operators?

Yes! Submit a pull request with:
- Operator implementation
- Tests
- Documentation
- Type definitions

## Related Resources

- [Getting Started](/guide/getting-started)
- [Configuration](/guide/configuration)
- [Best Practices](/guide/best-practices)
- [Troubleshooting](/guide/troubleshooting)
- [API Reference](/api/core)

