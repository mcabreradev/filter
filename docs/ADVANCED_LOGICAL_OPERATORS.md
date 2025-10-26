# Advanced Logical Operators Guide

## Complex Query Patterns

### E-commerce Product Filtering

```typescript
interface Product {
  name: string;
  price: number;
  category: string;
  brand: string;
  rating: number;
  inStock: boolean;
  tags: string[];
  discount: number;
}

const products: Product[] = [...];

// Find premium products: (High rating OR popular brand) AND in stock AND affordable
filter(products, {
  $and: [
    {
      $or: [
        { rating: { $gte: 4.5 } },
        { brand: { $in: ['Apple', 'Samsung', 'Sony'] } }
      ]
    },
    { inStock: true },
    { price: { $lte: 1000 } }
  ]
});

// Clearance items: On sale BUT NOT (out of stock OR discontinued)
filter(products, {
  discount: { $gt: 0 },
  $not: {
    $or: [
      { inStock: false },
      { tags: { $contains: 'discontinued' } }
    ]
  }
});
```

### User Access Control

```typescript
interface User {
  id: number;
  role: string;
  department: string;
  active: boolean;
  permissions: string[];
  lastLogin: Date;
}

const users: User[] = [...];

// Active admins OR users with specific permission
filter(users, {
  active: true,
  $or: [
    { role: 'admin' },
    { permissions: { $contains: 'manage_users' } }
  ]
});

// Users needing attention: Inactive OR (no recent login AND not admin)
filter(users, {
  $or: [
    { active: false },
    {
      $and: [
        { lastLogin: { $lt: new Date('2025-01-01') } },
        { $not: { role: 'admin' } }
      ]
    }
  ]
});
```

### Data Validation Queries

```typescript
// Find invalid records: Missing required fields OR invalid values
filter(records, {
  $or: [
    { email: { $regex: '^$' } },
    { age: { $lt: 0 } },
    { $not: { status: { $in: ['active', 'inactive', 'pending'] } } }
  ]
});

// Quality control: All conditions must pass
filter(products, {
  $and: [
    { name: { $regex: '.+' } },
    { price: { $gt: 0 } },
    { category: { $in: validCategories } },
    { $not: { description: { $regex: '^$' } } }
  ]
});
```

### Geographic Filtering

```typescript
interface Location {
  city: string;
  state: string;
  country: string;
  region: string;
}

// US West Coast OR major European cities
filter(locations, {
  $or: [
    {
      $and: [
        { country: 'USA' },
        { state: { $in: ['CA', 'OR', 'WA'] } }
      ]
    },
    {
      $and: [
        { country: { $in: ['UK', 'France', 'Germany'] } },
        { city: { $in: ['London', 'Paris', 'Berlin'] } }
      ]
    }
  ]
});
```

### Time-Based Queries

```typescript
// Recent activity: Last 7 days OR high-priority items
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

filter(tasks, {
  $or: [
    { updatedAt: { $gte: sevenDaysAgo } },
    { priority: 'high' }
  ],
  $not: { status: 'completed' }
});
```

## Performance Optimization

### Operator Ordering

```typescript
// ✅ Good: Most restrictive conditions first
filter(products, {
  $and: [
    { inStock: true },
    { price: { $lte: 100 } },
    { name: { $regex: 'complex.*pattern' } }
  ]
});

// ⚠️ Less efficient: Expensive operations first
filter(products, {
  $and: [
    { description: { $regex: 'very.*complex.*pattern' } },
    { inStock: true }
  ]
});
```

### Avoiding Deep Nesting

```typescript
// ❌ Hard to read and maintain
filter(data, {
  $and: [
    {
      $or: [
        {
          $and: [
            { a: 1 },
            { $or: [{ b: 2 }, { c: 3 }] }
          ]
        },
        { d: 4 }
      ]
    }
  ]
});

// ✅ Better: Flatten when possible
filter(data, {
  $or: [
    { $and: [{ a: 1 }, { b: 2 }] },
    { $and: [{ a: 1 }, { c: 3 }] },
    { d: 4 }
  ]
});
```

## Common Patterns

### Inclusion with Exclusions

```typescript
// Include category BUT exclude specific items
filter(products, {
  category: 'Electronics',
  $not: {
    $or: [
      { brand: 'BrandX' },
      { tags: { $contains: 'refurbished' } }
    ]
  }
});
```

### Range with Exceptions

```typescript
// Price range BUT NOT specific excluded prices
filter(products, {
  $and: [
    { price: { $gte: 100, $lte: 500 } },
    { $not: { price: { $in: [199, 299, 399] } } }
  ]
});
```

### Multi-Field OR

```typescript
// Search across multiple fields
const searchTerm = 'laptop';
filter(products, {
  $or: [
    { name: { $contains: searchTerm } },
    { description: { $contains: searchTerm } },
    { tags: { $contains: searchTerm } }
  ]
});
```

## Testing Logical Operators

```typescript
import { describe, it, expect } from 'vitest';
import { filter } from '@mcabreradev/filter';

describe('Logical Operators', () => {
  const products = [
    { name: 'A', price: 100, inStock: true },
    { name: 'B', price: 200, inStock: false },
    { name: 'C', price: 300, inStock: true }
  ];

  it('should handle $and correctly', () => {
    const result = filter(products, {
      $and: [
        { price: { $gte: 100 } },
        { inStock: true }
      ]
    });
    expect(result).toHaveLength(2);
  });

  it('should handle $or correctly', () => {
    const result = filter(products, {
      $or: [
        { price: { $lt: 150 } },
        { name: 'C' }
      ]
    });
    expect(result).toHaveLength(2);
  });

  it('should handle $not correctly', () => {
    const result = filter(products, {
      $not: { inStock: false }
    });
    expect(result).toHaveLength(2);
  });

  it('should handle nested operators', () => {
    const result = filter(products, {
      $and: [
        {
          $or: [
            { price: { $lt: 150 } },
            { price: { $gt: 250 } }
          ]
        },
        { inStock: true }
      ]
    });
    expect(result).toHaveLength(2);
  });
});
```

## Troubleshooting

### Common Mistakes

```typescript
// ❌ Wrong: $and with single condition (unnecessary)
filter(data, {
  $and: [{ price: { $gt: 100 } }]
});

// ✅ Correct: Direct condition
filter(data, {
  price: { $gt: 100 }
});

// ❌ Wrong: $or with object (should be array)
filter(data, {
  $or: { a: 1, b: 2 }
});

// ✅ Correct: $or with array
filter(data, {
  $or: [{ a: 1 }, { b: 2 }]
});

// ❌ Wrong: $not with array (should be single expression)
filter(data, {
  $not: [{ a: 1 }, { b: 2 }]
});

// ✅ Correct: $not with single expression or use $and
filter(data, {
  $not: { $or: [{ a: 1 }, { b: 2 }] }
});
```

## See Also

- [Main Operators Guide](./OPERATORS.md)
- [Performance Optimization](./WIKI.md#performance-optimization)
- [Real-World Examples](./WIKI.md#real-world-examples)

