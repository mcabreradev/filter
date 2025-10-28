# Nested Objects

Filter supports deep object filtering with intelligent TypeScript autocomplete up to 4 levels of nesting. This powerful feature allows you to query complex data structures with ease.

## Overview

Nested object filtering enables you to:
- Filter by properties at any depth level
- Use operators on nested properties
- Get full TypeScript autocomplete for nested paths
- Combine nested filters with logical operators
- Handle complex data structures efficiently

## Basic Nested Filtering

### Simple Nested Property

```typescript
interface User {
  name: string;
  address: {
    city: string;
    country: string;
  };
}

const users: User[] = [
  { name: 'Alice', address: { city: 'Berlin', country: 'Germany' } },
  { name: 'Bob', address: { city: 'Paris', country: 'France' } },
  { name: 'Charlie', address: { city: 'Berlin', country: 'Germany' } },
];

filter(users, {
  address: {
    city: 'Berlin'
  }
});
```

### Multiple Nested Properties

```typescript
filter(users, {
  address: {
    city: 'Berlin',
    country: 'Germany'
  }
});
```

## Operators on Nested Properties

All operators work seamlessly with nested properties:

### Comparison Operators

```typescript
interface Product {
  name: string;
  pricing: {
    amount: number;
    currency: string;
  };
}

const products: Product[] = [...];

filter(products, {
  pricing: {
    amount: { $gte: 100, $lte: 500 }
  }
});
```

### String Operators

```typescript
filter(users, {
  address: {
    city: { $startsWith: 'Ber' }
  }
});
```

### Array Operators

```typescript
interface Company {
  name: string;
  locations: {
    offices: string[];
  };
}

filter(companies, {
  locations: {
    offices: { $contains: 'Berlin' }
  }
});
```

## Deep Nesting (Up to 4 Levels)

Filter supports up to 4 levels of nesting with full TypeScript support:

```typescript
interface Organization {
  name: string;
  department: {
    name: string;
    team: {
      name: string;
      lead: {
        name: string;
        email: string;
      };
    };
  };
}

const orgs: Organization[] = [...];

filter(orgs, {
  department: {
    team: {
      lead: {
        email: { $endsWith: '@company.com' }
      }
    }
  }
});
```

## TypeScript Autocomplete

One of the most powerful features is intelligent autocomplete at every nesting level:

```typescript
interface User {
  profile: {
    personal: {
      age: number;
      location: {
        city: string;
      };
    };
  };
}

filter(users, {
  profile: {
    personal: {
      // TypeScript suggests: age, location
      location: {
        // TypeScript suggests: city
        city: 'Berlin'
      }
    }
  }
});
```

### Operator Autocomplete

TypeScript also suggests appropriate operators based on the property type:

```typescript
filter(users, {
  profile: {
    personal: {
      age: {
        // TypeScript suggests: $gt, $gte, $lt, $lte, $eq, $ne, $in, $nin
        $gte: 18
      }
    }
  }
});
```

## Combining with Logical Operators

### Nested Properties with $and

```typescript
filter(users, {
  $and: [
    {
      address: {
        city: 'Berlin'
      }
    },
    {
      address: {
        country: 'Germany'
      }
    }
  ]
});
```

### Nested Properties with $or

```typescript
filter(users, {
  $or: [
    {
      address: {
        city: 'Berlin'
      }
    },
    {
      address: {
        city: 'Paris'
      }
    }
  ]
});
```

### Complex Nested Logic

```typescript
filter(users, {
  $and: [
    {
      profile: {
        personal: {
          age: { $gte: 18 }
        }
      }
    },
    {
      $or: [
        {
          address: {
            city: 'Berlin'
          }
        },
        {
          address: {
            country: 'France'
          }
        }
      ]
    }
  ]
});
```

## Real-World Examples

### E-commerce Order Filtering

```typescript
interface Order {
  id: string;
  customer: {
    name: string;
    contact: {
      email: string;
      phone: string;
    };
  };
  shipping: {
    address: {
      city: string;
      country: string;
      postalCode: string;
    };
    method: string;
  };
  payment: {
    method: string;
    status: string;
    amount: number;
  };
}

const orders: Order[] = [...];

filter(orders, {
  shipping: {
    address: {
      country: 'Germany',
      city: { $in: ['Berlin', 'Munich', 'Hamburg'] }
    }
  },
  payment: {
    status: 'completed',
    amount: { $gte: 100 }
  }
});
```

### User Profile Search

```typescript
interface UserProfile {
  username: string;
  profile: {
    bio: string;
    social: {
      twitter: string;
      github: string;
    };
    preferences: {
      theme: string;
      notifications: {
        email: boolean;
        push: boolean;
      };
    };
  };
}

filter(profiles, {
  profile: {
    social: {
      github: { $startsWith: 'https://github.com/' }
    },
    preferences: {
      notifications: {
        email: true
      }
    }
  }
});
```

### Organization Hierarchy

```typescript
interface Organization {
  name: string;
  structure: {
    department: {
      name: string;
      manager: {
        name: string;
        level: number;
      };
      budget: {
        allocated: number;
        spent: number;
      };
    };
  };
}

filter(organizations, {
  structure: {
    department: {
      manager: {
        level: { $gte: 3 }
      },
      budget: {
        spent: { $lt: 50000 }
      }
    }
  }
});
```

## Configuration

### Max Depth Control

Control the maximum nesting depth (default: 3):

```typescript
filter(data, expression, {
  maxDepth: 5
});
```

This affects how deep the filter will traverse nested objects.

## Performance Considerations

### Best Practices

1. **Keep Nesting Reasonable**: While 4 levels are supported, shallower structures are faster
2. **Use Specific Paths**: More specific nested paths filter faster
3. **Index Critical Paths**: For large datasets, consider pre-indexing nested properties

### Performance Tips

```typescript
filter(largeDataset, {
  address: {
    city: 'Berlin'
  }
});
```

For large datasets with frequent nested queries, consider:
- Enabling caching with `enableCache: true`
- Flattening deeply nested structures if possible
- Using lazy evaluation for early exits

## Type Safety

Full TypeScript support ensures type-safe nested queries:

```typescript
interface User {
  profile: {
    age: number;
  };
}

filter(users, {
  profile: {
    age: 'invalid'  // ❌ TypeScript error: Type 'string' is not assignable to type 'number'
  }
});

filter(users, {
  profile: {
    age: { $gte: 18 }  // ✅ Type-safe
  }
});
```

## Limitations

1. **Maximum Depth**: 4 levels of nesting
2. **Plain Objects Only**: Arrays, Dates, and Functions are not traversed as nested objects
3. **Performance**: Very deep nesting may impact performance on large datasets

## Troubleshooting

### Property Not Found

If nested properties aren't being matched:

```typescript
const result = filterDebug(users, {
  address: {
    city: 'Berlin'
  }
}, { verbose: true });

result.print();
```

### Type Errors

Ensure your interface matches your data structure:

```typescript
interface User {
  address?: {
    city: string;
  };
}
```

### Performance Issues

For slow nested queries:
1. Enable caching
2. Reduce nesting depth
3. Use more specific filters
4. Consider data structure optimization

## Advanced Patterns

### Partial Nested Matching

```typescript
filter(users, {
  address: {
    city: 'Berlin'
  }
});
```

### Combining Multiple Nested Paths

```typescript
filter(users, {
  profile: {
    age: { $gte: 18 }
  },
  address: {
    country: 'Germany'
  }
});
```

### Nested Arrays with Objects

```typescript
interface User {
  orders: Array<{
    items: Array<{
      price: number;
    }>;
  }>;
}

filter(users, {
  orders: {
    items: {
      price: { $gte: 100 }
    }
  }
});
```

## See Also

- [Operators Guide](/guide/operators) - Available operators
- [Logical Operators](/guide/logical-operators) - Complex expressions
- [Configuration](/guide/configuration) - maxDepth and other options
- [TypeScript Support](/guide/getting-started#typescript-support) - Type safety

