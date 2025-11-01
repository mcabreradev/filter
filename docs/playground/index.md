# Interactive Playground

Try @mcabreradev/filter directly in your browser! Experiment with different filtering strategies, operators, and configurations in real-time.

## Quick Start Playground

<Playground />

## Features

The playground allows you to:

- ✨ **Test all filtering strategies** - strings, objects, predicates, operators, wildcards
- 🔍 **Try MongoDB-style operators** - comparison, array, string, and logical operators
- ⚙️ **Configure options** - case sensitivity, max depth, caching, debug mode
- 💾 **See performance metrics** - execution time and cache statistics
- 📝 **View results** - formatted output with syntax highlighting
- 💡 **Learn by example** - Pre-built examples for common use cases

## Pre-built Examples

### Basic Filtering

```typescript
// String search
filter(users, 'Berlin');

// Wildcard patterns
filter(users, '%alice%');

// Object matching
filter(users, { city: 'Berlin', active: true });

// Negation
filter(users, '!admin');
```

### MongoDB Operators

```typescript
// Comparison operators
filter(products, { price: { $gte: 100, $lte: 500 } });

// Array operators
filter(products, { category: { $in: ['Electronics', 'Books'] } });

// String operators
filter(users, { email: { $endsWith: '@company.com' } });

// Logical operators
filter(products, {
  $and: [
    { inStock: true },
    { $or: [{ rating: { $gte: 4.5 } }, { price: { $lt: 50 } }] }
  ]
});
```

### Datetime Operators

```typescript
// Events in next 7 days
filter(events, {
  date: { $upcoming: { days: 7 } }
});

// Recent activity (last 24 hours)
filter(users, {
  lastLogin: { $recent: { hours: 24 } }
});

// Weekday events only
filter(events, {
  date: { $dayOfWeek: [1, 2, 3, 4, 5] }
});

// Business hours (9 AM - 5 PM)
filter(appointments, {
  startTime: { $timeOfDay: { start: 9, end: 17 } }
});

// Adults (18+)
filter(users, {
  birthDate: { $age: { min: 18 } }
});

// Weekend events
filter(events, {
  date: { $isWeekend: true }
});

// Combine multiple datetime conditions
filter(events, {
  date: {
    $upcoming: { days: 7 },
    $dayOfWeek: [1, 2, 3, 4, 5]
  },
  startTime: {
    $timeOfDay: { start: 9, end: 17 }
  }
});
```

### Advanced Examples

```typescript
// Nested objects
filter(users, {
  address: { city: 'Berlin' },
  settings: { theme: 'dark' }
});

// Complex predicates
filter(products, (p) => 
  p.price < 100 && 
  p.inStock && 
  p.rating >= 4.0
);

// With configuration
filter(users, 'ALICE', { 
  caseSensitive: true,
  debug: true 
});

// Datetime filtering - upcoming weekday events
filter(events, {
  date: {
    $upcoming: { days: 30 },
    $dayOfWeek: [1, 2, 3, 4, 5]
  },
  startTime: {
    $timeOfDay: { start: 9, end: 17 }
  }
});

// Active adult users
filter(users, {
  birthDate: { $age: { min: 18, max: 65 } },
  lastLogin: { $recent: { days: 30 } },
  premium: true
});
```

## Sample Datasets

The playground includes pre-populated datasets:

### Users Dataset

```typescript
[
  { 
    id: 1, 
    name: 'Alice', 
    email: 'alice@example.com', 
    age: 30, 
    city: 'Berlin',
    active: true,
    role: 'admin'
  },
  { 
    id: 2, 
    name: 'Bob', 
    email: 'bob@example.com', 
    age: 25, 
    city: 'London',
    active: true,
    role: 'user'
  },
  { 
    id: 3, 
    name: 'Charlie', 
    email: 'charlie@example.com', 
    age: 35, 
    city: 'Berlin',
    active: false,
    role: 'user'
  }
]
```

### Products Dataset

```typescript
[
  {
    id: 1,
    name: 'Laptop Pro',
    price: 1200,
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.8,
    inStock: true,
    tags: ['premium', 'sale']
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    price: 25,
    category: 'Accessories',
    brand: 'Logitech',
    rating: 4.5,
    inStock: true,
    tags: ['affordable']
  },
  {
    id: 3,
    name: '4K Monitor',
    price: 450,
    category: 'Electronics',
    brand: 'Dell',
    rating: 4.7,
    inStock: false,
    tags: ['premium']
  }
]
```

### Events Dataset

```typescript
[
  {
    id: 1,
    name: 'Team Meeting',
    date: new Date('2025-01-20'),
    startTime: new Date('2025-01-20T09:00:00'),
    duration: 60,
    attendees: 5,
    location: 'Office'
  },
  {
    id: 2,
    name: 'Product Launch',
    date: new Date('2025-01-25'),
    startTime: new Date('2025-01-25T14:00:00'),
    duration: 120,
    attendees: 50,
    location: 'Conference Center'
  },
  {
    id: 3,
    name: 'Weekend Workshop',
    date: new Date('2025-02-01'),
    startTime: new Date('2025-02-01T10:00:00'),
    duration: 480,
    attendees: 20,
    location: 'Remote'
  },
  {
    id: 4,
    name: 'Client Call',
    date: new Date('2025-01-18'),
    startTime: new Date('2025-01-18T15:00:00'),
    duration: 30,
    attendees: 3,
    location: 'Video Call'
  }
]
```

### Users with Dates Dataset

```typescript
[
  {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    birthDate: new Date('2000-01-01'),
    lastLogin: new Date('2025-01-14T10:30:00'),
    joinedAt: new Date('2023-06-15'),
    premium: true
  },
  {
    id: 2,
    name: 'Bob',
    email: 'bob@example.com',
    birthDate: new Date('2005-05-15'),
    lastLogin: new Date('2025-01-10T08:00:00'),
    joinedAt: new Date('2024-01-20'),
    premium: false
  },
  {
    id: 3,
    name: 'Charlie',
    email: 'charlie@example.com',
    birthDate: new Date('1990-08-22'),
    lastLogin: new Date('2025-01-01T14:15:00'),
    joinedAt: new Date('2022-03-10'),
    premium: true
  },
  {
    id: 4,
    name: 'Diana',
    email: 'diana@example.com',
    birthDate: new Date('2010-12-05'),
    lastLogin: new Date('2025-01-15T16:45:00'),
    joinedAt: new Date('2024-11-01'),
    premium: false
  }
]
```

## Configuration Options

Try different configurations in the playground:

### Case Sensitivity

```typescript
// Case-insensitive (default)
filter(users, 'alice'); // Matches 'Alice'

// Case-sensitive
filter(users, 'alice', { caseSensitive: true }); // No match
```

### Max Depth

```typescript
// Default depth (3 levels)
filter(data, { level1: { level2: { level3: 'value' } } });

// Increase for deeper nesting
filter(data, expression, { maxDepth: 5 });
```

### Debug Mode

```typescript
// Enable debug output
filter(users, expression, { debug: true });

// See execution tree and timing
filter(users, expression, { debug: true, verbose: true });
```

### Caching

```typescript
// Enable caching for performance
filter(largeDataset, expression, { enableCache: true });

// See cache statistics
const stats = getFilterCacheStats();
```

## Performance Testing

The playground shows:

- ⏱️ **Execution time** in milliseconds
- 📊 **Items processed** vs items returned
- 💾 **Cache hits/misses** when caching is enabled
- 🔍 **Query complexity** indicator

## Tips & Tricks

### 1. Start Simple

Begin with basic string or object filtering to understand the syntax:

```typescript
filter(users, 'Berlin');
filter(users, { city: 'Berlin' });
```

### 2. Build Complexity Gradually

Add operators one at a time:

```typescript
// Step 1: Single operator
filter(products, { price: { $gte: 100 } });

// Step 2: Multiple operators on same field
filter(products, { price: { $gte: 100, $lte: 500 } });

// Step 3: Multiple fields
filter(products, {
  price: { $gte: 100, $lte: 500 },
  category: 'Electronics'
});
```

### 3. Use Debug Mode

Enable debug mode to understand how your expression is evaluated:

```typescript
filter(users, expression, { debug: true, verbose: true });
```

### 4. Test Edge Cases

Try edge cases to understand behavior:

```typescript
// Empty array
filter([], expression);

// Non-existent properties
filter(users, { nonExistent: 'value' });

// Type mismatches
filter(products, { price: 'not a number' });
```

### 5. Explore Date/Time Operators

Test temporal filtering with datetime operators:

```typescript
// Upcoming events in next week
filter(events, {
  date: { $upcoming: { days: 7 } }
});

// Recent user activity
filter(users, {
  lastLogin: { $recent: { hours: 24 } }
});

// Business hours appointments
filter(appointments, {
  startTime: { $timeOfDay: { start: 9, end: 17 } },
  date: { $isWeekday: true }
});

// Age-based filtering
filter(users, {
  birthDate: { $age: { min: 18, max: 65 } }
});

// Weekend events
filter(events, {
  date: { $isWeekend: true }
});
```

## Sharing Examples

You can share your playground examples via URL parameters (coming soon) or copy the code directly from the editor.

## Limitations

The playground runs entirely in the browser with these limitations:

- Dataset size limited to 10,000 items for performance
- Custom datasets must be valid JSON
- File uploads not supported (paste JSON instead)
- Some advanced features may require local installation

## Next Steps

After experimenting in the playground:

1. 📦 [Install the library](../guide/installation.md)
2. 📖 [Read the Getting Started Guide](../guide/getting-started.md)
3. 🔍 [Explore All Operators](../guide/operators.md)
4. 🚀 [Check Real-World Examples](../examples/real-world.md)

## Feedback

Have suggestions for the playground? [Open an issue](https://github.com/mcabreradev/filter/issues) or contribute!

---

**Happy filtering!** 🎉
