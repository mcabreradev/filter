# Debug Mode

Debug mode provides visual debugging capabilities for complex filter expressions, helping you understand how filters are evaluated and which conditions match your data.

## Overview

Enable debug mode by setting `debug: true` in the filter options:

- **Visual Tree Representation** - ASCII tree showing filter structure
- **Match Statistics** - Shows matched/total items per condition
- **Performance Metrics** - Execution time tracking
- **Nested Expression Support** - Handles complex logical operators
- **Zero Production Impact** - Debug code only runs when explicitly called

## Basic Usage

```typescript
import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', age: 25, city: 'Berlin', premium: true },
  { name: 'Bob', age: 30, city: 'Berlin', premium: false },
  { name: 'Charlie', age: 28, city: 'Paris', premium: true },
];

const result = filter(users, { city: 'Berlin' }, { debug: true });
```

**Output:**

```
Filter Debug Tree
└── city = "Berlin" (2/3 matched, 66.7%)

Statistics:
├── Matched: 2 / 3 items (66.7%)
├── Execution Time: 0.45ms
├── Cache Hit: No
└── Conditions Evaluated: 1
```

## Complex Expressions

Debug mode excels at visualizing complex nested expressions:

```typescript
filter(users, {
  $and: [
    { city: 'Berlin' },
    { $or: [{ age: { $lt: 30 } }, { premium: true }] }
  ]
}, { debug: true });
```

**Output:**

```
Filter Debug Tree
└── AND (2/3 matched, 66.7%)
   ├── city = "Berlin" (2/3 matched, 66.7%)
   └── OR (2/2 matched, 100.0%)
      ├── age < 30 (1/2 matched, 50.0%)
      └── premium = true (1/2 matched, 50.0%)

Statistics:
├── Matched: 2 / 3 items (66.7%)
├── Execution Time: 0.51ms
├── Cache Hit: No
└── Conditions Evaluated: 5
```

## Debug Options

### Verbose Mode

Include additional details about each condition:

```typescript
filter(users, { age: { $gte: 25 } }, {
  debug: true,
  verbose: true
});
```

**Output:**

```
Filter Debug Tree
└── age (2/3 matched, 66.7%)
   │ Value: 25
   └── age >= 25 (2/3 matched, 66.7%)
      │ Value: 25

Statistics:
├── Matched: 2 / 3 items (66.7%)
├── Execution Time: 0.32ms
├── Cache Hit: No
└── Conditions Evaluated: 2
```

### Show Timings

Display execution time for each node:

```typescript
filter(users, { city: 'Berlin' }, {
  debug: true,
  showTimings: true
});
```

**Output:**

```
Filter Debug Tree
└── city = "Berlin" (2/3 matched, 66.7%) [0.15ms]

Statistics:
├── Matched: 2 / 3 items (66.7%)
├── Execution Time: 0.45ms
├── Cache Hit: No
└── Conditions Evaluated: 1
```

### Colorized Output

Enable ANSI colors for better readability in terminals:

```typescript
filter(users, { premium: true }, {
  debug: true,
  colorize: true
});
```

This will display the tree with colored output (operators in yellow, fields in cyan, values in green, etc.).

### Combined Options

You can combine multiple options:

```typescript
filter(users, { city: 'Berlin', age: { $gte: 25 } }, {
  debug: true,
  verbose: true,
  showTimings: true,
  colorize: true
});
```

## Programmatic Access

For programmatic access to debug information, use the `filterDebug` function directly:

```typescript
import { filterDebug } from '@mcabreradev/filter';

const result = filterDebug(users, { age: { $gte: 30 } });

console.log('Matched users:', result.items.map(u => u.name));
console.log('Match count:', result.stats.matched);
console.log('Total count:', result.stats.total);
console.log('Percentage:', result.stats.percentage.toFixed(1) + '%');
console.log('Execution time:', result.stats.executionTime.toFixed(2) + 'ms');
console.log('Conditions evaluated:', result.stats.conditionsEvaluated);

result.print();
```

## Tree Structure

The debug tree mirrors your filter expression structure:

### Logical Operators

```typescript
filterDebug(users, {
  $and: [
    { city: 'Berlin' },
    { premium: true }
  ]
}).print();
```

```
Filter Debug Tree
└── AND (1/3 matched, 33.3%)
   ├── city = "Berlin" (1/3 matched, 33.3%)
   └── premium = true (1/3 matched, 33.3%)
```

### Comparison Operators

```typescript
filterDebug(users, {
  age: { $gte: 25, $lte: 30 }
}).print();
```

```
Filter Debug Tree
└── age (2/3 matched, 66.7%)
   ├── age >= 25 (2/3 matched, 66.7%)
   └── age <= 30 (2/3 matched, 66.7%)
```

### Array Operators

```typescript
filterDebug(users, {
  city: { $in: ['Berlin', 'Paris'] }
}).print();
```

```
Filter Debug Tree
└── city IN ["Berlin", "Paris"] (3/3 matched, 100.0%)
```

### String Operators

```typescript
filterDebug(users, {
  name: { $startsWith: 'A' }
}).print();
```

```
Filter Debug Tree
└── name STARTS WITH "A" (1/3 matched, 33.3%)
```

## Real-World Examples

### E-commerce Product Search

```typescript
interface Product {
  name: string;
  price: number;
  category: string;
  rating: number;
  inStock: boolean;
}

const products: Product[] = [...];

const result = filterDebug(products, {
  $and: [
    { category: 'Electronics' },
    { price: { $lte: 1000 } },
    { rating: { $gte: 4.5 } },
    { inStock: true }
  ]
});

result.print();
```

**Output:**

```
Filter Debug Tree
└── AND (12/100 matched, 12.0%)
   ├── category = "Electronics" (12/100 matched, 12.0%)
   ├── price <= 1000 (12/100 matched, 12.0%)
   ├── rating >= 4.5 (12/100 matched, 12.0%)
   └── inStock = true (12/100 matched, 12.0%)

Statistics:
├── Matched: 12 / 100 items (12.0%)
├── Execution Time: 2.15ms
├── Cache Hit: No
└── Conditions Evaluated: 5
```

### User Segmentation

```typescript
const result = filterDebug(users, {
  $or: [
    {
      $and: [
        { city: 'Berlin' },
        { age: { $lt: 30 } }
      ]
    },
    {
      $and: [
        { premium: true },
        { age: { $gte: 30 } }
      ]
    }
  ]
});

result.print();
```

**Output:**

```
Filter Debug Tree
└── OR (3/5 matched, 60.0%)
   ├── AND (2/5 matched, 40.0%)
   │  ├── city = "Berlin" (2/5 matched, 40.0%)
   │  └── age < 30 (2/5 matched, 40.0%)
   └── AND (1/5 matched, 20.0%)
      ├── premium = true (1/5 matched, 20.0%)
      └── age >= 30 (1/5 matched, 20.0%)

Statistics:
├── Matched: 3 / 5 items (60.0%)
├── Execution Time: 0.82ms
├── Cache Hit: No
└── Conditions Evaluated: 7
```

### Geospatial Filtering

```typescript
interface Restaurant {
  name: string;
  location: { lat: number; lng: number };
  rating: number;
}

const restaurants: Restaurant[] = [...];
const userLocation = { lat: 52.52, lng: 13.405 };

const result = filterDebug(restaurants, {
  $and: [
    {
      location: {
        $near: {
          center: userLocation,
          maxDistanceMeters: 2000
        }
      }
    },
    { rating: { $gte: 4.0 } }
  ]
});

result.print();
```

**Output:**

```
Filter Debug Tree
└── AND (8/50 matched, 16.0%)
   ├── location NEAR (lat: 52.52, lng: 13.405, max: 2000m) (15/50 matched, 30.0%)
   └── rating >= 4.0 (8/15 matched, 53.3%)

Statistics:
├── Matched: 8 / 50 items (16.0%)
├── Execution Time: 1.23ms
├── Cache Hit: No
└── Conditions Evaluated: 3
```

### DateTime Filtering

```typescript
interface Event {
  name: string;
  date: Date;
  startTime: Date;
}

const events: Event[] = [...];

const result = filterDebug(events, {
  $and: [
    { date: { $upcoming: { days: 7 } } },
    { date: { $dayOfWeek: [1, 2, 3, 4, 5] } },
    { startTime: { $timeOfDay: { start: 9, end: 17 } } }
  ]
});

result.print();
```

**Output:**

```
Filter Debug Tree
└── AND (5/30 matched, 16.7%)
   ├── date UPCOMING (7 days) (12/30 matched, 40.0%)
   ├── date DAY OF WEEK [Mon, Tue, Wed, Thu, Fri] (8/12 matched, 66.7%)
   └── startTime TIME OF DAY (9:00-17:00) (5/8 matched, 62.5%)

Statistics:
├── Matched: 5 / 30 items (16.7%)
├── Execution Time: 0.95ms
├── Cache Hit: No
└── Conditions Evaluated: 4
```

## Understanding Match Statistics

Each node in the tree shows:

- **Matched count** - Number of items that passed this condition
- **Total count** - Number of items evaluated at this level
- **Percentage** - `(matched / total) * 100`

### How Statistics Work

```typescript
const result = filterDebug(users, {
  $and: [
    { city: 'Berlin' },      // Filters entire dataset
    { age: { $lt: 30 } }     // Only evaluates Berlin users
  ]
});
```

In this example:
1. First condition evaluates all users
2. Second condition only evaluates users who passed the first condition
3. Statistics reflect this cascading evaluation

## Performance Analysis

Use debug mode to identify performance bottlenecks:

```typescript
const result = filterDebug(largeDataset, complexExpression, {
  showTimings: true
});

result.print();
```

Look for:
- **Slow conditions** - High execution times
- **Inefficient ordering** - Put faster/more selective conditions first
- **Unnecessary complexity** - Simplify nested expressions

## Browser DevTools Integration

Make debug available globally for console debugging:

```typescript
// In your app initialization
if (process.env.NODE_ENV === 'development') {
  window.filterDebug = filterDebug;
}

// Then in browser console:
filterDebug(myData, myExpression).print();
```

## Node.js Debugging

Use with Node.js REPL or scripts:

```typescript
import { filterDebug } from '@mcabreradev/filter';

const result = filterDebug(data, expression, { colorize: true });
result.print();
```

## Operator Display Names

Debug mode uses human-readable operator names:

### Comparison Operators

| Operator | Display |
|----------|---------|
| `$gt` | `>` |
| `$gte` | `>=` |
| `$lt` | `<` |
| `$lte` | `<=` |
| `$eq` | `=` |
| `$ne` | `!=` |

### Array Operators

| Operator | Display |
|----------|---------|
| `$in` | `IN` |
| `$nin` | `NOT IN` |
| `$contains` | `CONTAINS` |
| `$size` | `SIZE` |

### String Operators

| Operator | Display |
|----------|---------|
| `$startsWith` | `STARTS WITH` |
| `$endsWith` | `ENDS WITH` |
| `$regex` | `REGEX` |
| `$match` | `MATCH` |

### Logical Operators

| Operator | Display |
|----------|---------|
| `$and` | `AND` |
| `$or` | `OR` |
| `$not` | `NOT` |

### Geospatial Operators

| Operator | Display |
|----------|---------|
| `$near` | `NEAR` |
| `$geoBox` | `GEO BOX` |
| `$geoPolygon` | `GEO POLYGON` |

### DateTime Operators

| Operator | Display |
|----------|---------|
| `$recent` | `RECENT` |
| `$upcoming` | `UPCOMING` |
| `$dayOfWeek` | `DAY OF WEEK` |
| `$timeOfDay` | `TIME OF DAY` |
| `$age` | `AGE` |
| `$isWeekday` | `IS WEEKDAY` |
| `$isWeekend` | `IS WEEKEND` |
| `$isBefore` | `BEFORE` |
| `$isAfter` | `AFTER` |

## Best Practices

### 1. Use in Development Only

Debug mode adds overhead. Only use during development:

```typescript
if (process.env.NODE_ENV === 'development') {
  filterDebug(data, expression).print();
} else {
  filter(data, expression);
}
```

### 2. Start Simple

Begin with simple expressions and gradually add complexity:

```typescript
// Step 1: Debug individual conditions
filterDebug(users, { city: 'Berlin' }).print();
filterDebug(users, { age: { $lt: 30 } }).print();

// Step 2: Combine conditions
filterDebug(users, {
  $and: [
    { city: 'Berlin' },
    { age: { $lt: 30 } }
  ]
}).print();
```

### 3. Use Verbose Mode for Deep Inspection

When debugging complex issues, enable verbose mode:

```typescript
filterDebug(data, expression, {
  verbose: true,
  showTimings: true
}).print();
```

### 4. Save Debug Output

Capture debug output for documentation or bug reports:

```typescript
const result = filterDebug(data, expression);
const debugOutput = formatDebugTree(result.tree, {});
fs.writeFileSync('debug-output.txt', debugOutput);
```

## Troubleshooting

### No Items Matching

If no items match, check each condition:

```typescript
const result = filterDebug(users, {
  $and: [
    { city: 'Berlin' },
    { age: { $lt: 20 } }  // Too restrictive?
  ]
});

result.print();
```

Look at the match statistics to see where items are being filtered out.

### Unexpected Results

Use verbose mode to see actual values:

```typescript
const result = filterDebug(users, expression, { verbose: true });
result.print();
```

### Performance Issues

Enable timing to identify slow conditions:

```typescript
const result = filterDebug(users, expression, { showTimings: true });
result.print();
```

## TypeScript Support

Full TypeScript support with type inference:

```typescript
interface User {
  name: string;
  age: number;
  city: string;
}

const users: User[] = [...];

const result = filterDebug(users, {
  age: { $gte: 25 }  // Type-safe
});

// result.items is typed as User[]
// result.stats is typed as DebugStats
```

## API Reference

For complete API documentation, see [Debug API Reference](/api/debug).

## Examples

For more examples, see:
- [Basic Examples](/examples/basic#debug-mode)
- [Advanced Patterns](/examples/advanced#debugging-complex-filters)
- [Real-World Cases](/examples/real-world#debugging-production-issues)

## Performance Considerations

Debug mode adds overhead:
- **Memory**: Debug tree structure requires additional memory
- **Time**: Tracking adds ~10-20% overhead compared to standard filter
- **Production**: Not recommended for production filtering

Use standard `filter()` for production code and `filterDebug()` only during development and debugging.

## See Also

- [Operators Guide](/guide/operators) - Available operators
- [Logical Operators](/guide/logical-operators) - Complex expressions
- [Performance Benchmarks](/advanced/performance-benchmarks) - Performance tips

