# Debug API

The Debug API provides visual debugging capabilities for filter expressions, helping you understand how filters are evaluated and which conditions match your data.

## filterDebug()

Debug filter expressions with tree visualization, match statistics, and performance metrics.

### Signature

```typescript
function filterDebug<T>(
  array: T[],
  expression: Expression<T>,
  options?: DebugOptions
): DebugResult<T>
```

### Parameters

- **array**: `T[]` - The array to filter
- **expression**: `Expression<T>` - The filter expression to debug
- **options**: `DebugOptions` (optional) - Debug configuration options

### Returns

`DebugResult<T>` - An object containing filtered items, debug tree, statistics, and print method

### Example

```typescript
import { filterDebug } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', age: 25, city: 'Berlin', premium: true },
  { name: 'Bob', age: 30, city: 'Berlin', premium: false },
  { name: 'Charlie', age: 28, city: 'Paris', premium: true },
];

const result = filterDebug(users, {
  $and: [
    { city: 'Berlin' },
    { $or: [{ age: { $lt: 30 } }, { premium: true }] }
  ]
});

result.print();
```

### Output

```
Filter Debug Tree
├── AND (2/3 matched, 66.7%)
│   ├── city = "Berlin" (2/3 matched, 66.7%)
│   └── OR (2/2 matched, 100.0%)
│       ├── age < 30 (1/2 matched, 50.0%)
│       └── premium = true (1/2 matched, 50.0%)

Statistics:
├── Matched: 2 / 3 items (66.7%)
├── Execution Time: 0.45ms
├── Cache Hit: No
└── Conditions Evaluated: 5
```

## Types

### DebugResult

```typescript
interface DebugResult<T> {
  items: T[];
  tree: DebugNode;
  stats: DebugStats;
  print: () => void;
}
```

**Properties:**

- **items**: `T[]` - The filtered array items
- **tree**: `DebugNode` - The debug tree structure
- **stats**: `DebugStats` - Statistics about the filter execution
- **print**: `() => void` - Method to print formatted debug output to console

### DebugNode

```typescript
interface DebugNode {
  type: 'logical' | 'comparison' | 'field' | 'operator' | 'primitive';
  operator?: string;
  field?: string;
  value?: unknown;
  children?: DebugNode[];
  matched?: number;
  total?: number;
  evaluationTime?: number;
}
```

**Properties:**

- **type**: Node type indicating the kind of expression
- **operator**: Operator name (e.g., '$and', '$gt', '=')
- **field**: Field name for field-level conditions
- **value**: The comparison value
- **children**: Child nodes for nested expressions
- **matched**: Number of items that matched this condition
- **total**: Total number of items evaluated
- **evaluationTime**: Time taken to evaluate this node (in milliseconds)

### DebugStats

```typescript
interface DebugStats {
  matched: number;
  total: number;
  percentage: number;
  executionTime: number;
  cacheHit: boolean;
  conditionsEvaluated: number;
}
```

**Properties:**

- **matched**: Number of items that passed the filter
- **total**: Total number of items in the input array
- **percentage**: Percentage of items that matched (0-100)
- **executionTime**: Total execution time in milliseconds
- **cacheHit**: Whether the result was retrieved from cache
- **conditionsEvaluated**: Total number of conditions in the expression tree

### DebugOptions

```typescript
interface DebugOptions extends FilterOptions {
  verbose?: boolean;
  showTimings?: boolean;
  colorize?: boolean;
}
```

**Properties:**

- **verbose**: `boolean` - Include additional details in output (default: `false`)
- **showTimings**: `boolean` - Show execution time for each node (default: `false`)
- **colorize**: `boolean` - Use ANSI colors in console output (default: `false`)
- Inherits all properties from `FilterOptions` (caseSensitive, maxDepth, etc.)

## Usage Examples

### Basic Usage

```typescript
const result = filterDebug(users, { city: 'Berlin' });
result.print();
```

### Verbose Mode

```typescript
const result = filterDebug(
  users,
  { age: { $gte: 25 } },
  { verbose: true }
);
result.print();
```

### With Timing Information

```typescript
const result = filterDebug(
  users,
  { premium: true },
  { showTimings: true }
);
result.print();
```

### Colorized Output

```typescript
const result = filterDebug(
  users,
  { city: 'Berlin' },
  { colorize: true }
);
result.print();
```

### Programmatic Access

```typescript
const result = filterDebug(users, { age: { $gte: 30 } });

console.log('Matched:', result.stats.matched);
console.log('Total:', result.stats.total);
console.log('Percentage:', result.stats.percentage);
console.log('Time:', result.stats.executionTime);

result.items.forEach(user => {
  console.log(user.name);
});
```

### Complex Nested Expressions

```typescript
const result = filterDebug(users, {
  $and: [
    { city: 'Berlin' },
    {
      $or: [
        { age: { $lt: 30 } },
        { premium: true }
      ]
    }
  ]
}, { verbose: true, showTimings: true, colorize: true });

result.print();
```

## Use Cases

### Development & Debugging

- Understand why certain items match or don't match
- Visualize complex filter logic
- Identify performance bottlenecks in filter expressions

### Testing

- Verify filter behavior with visual feedback
- Debug failing test cases
- Document expected filter behavior

### Performance Optimization

- Identify slow conditions
- Optimize filter order based on timing data
- Compare different filter approaches

### Documentation

- Generate visual examples for documentation
- Explain filter behavior to team members
- Create interactive debugging sessions

## Performance Considerations

The debug API wraps the standard filter function with tracking logic. While optimized, it does add overhead:

- **Memory**: Debug tree structure requires additional memory
- **Time**: Tracking adds ~10-20% overhead compared to standard filter
- **Use in Production**: Not recommended for production filtering; use standard `filter()` instead

The debug API is designed for development, testing, and debugging purposes only.

## Integration with DevTools

### Browser Console

```typescript
// Make debug available globally
window.filterDebug = filterDebug;

// Use in console
filterDebug(myData, myExpression).print();
```

### Node.js

```typescript
import { filterDebug } from '@mcabreradev/filter';

// Debug in terminal with colors
filterDebug(data, expression, { colorize: true }).print();
```

## Operator Display Names

The debug output uses human-readable operator names:

| Operator | Display |
|----------|---------|
| `$gt` | `>` |
| `$gte` | `>=` |
| `$lt` | `<` |
| `$lte` | `<=` |
| `$eq` | `=` |
| `$ne` | `!=` |
| `$in` | `IN` |
| `$nin` | `NOT IN` |
| `$contains` | `CONTAINS` |
| `$size` | `SIZE` |
| `$startsWith` | `STARTS WITH` |
| `$endsWith` | `ENDS WITH` |
| `$regex` | `REGEX` |
| `$match` | `MATCH` |
| `$and` | `AND` |
| `$or` | `OR` |
| `$not` | `NOT` |

## See Also

- [Filter API](./filter.md) - Standard filtering API
- [Operators Guide](../guide/operators.md) - Available operators
- [Examples](../examples/basic.md) - More usage examples

