# Nested Objects & Dot Notation

Learn how to filter nested objects using dot notation and nested object syntax in @mcabreradev/filter.

## Overview

@mcabreradev/filter provides **two powerful ways** to filter nested object properties:

1. **Dot Notation** - Use string paths like `'address.city'`
2. **Nested Object Syntax** - Use nested object structure

Both approaches are fully supported and can be mixed in the same expression!

Nested object filtering enables you to:
- Filter by properties at any depth level using dot notation or nested objects
- Use all 30+ operators on nested properties
- Get full TypeScript autocomplete for nested paths
- Combine nested filters with logical operators
- Handle complex data structures efficiently
- Mix both syntaxes in the same expression

## Dot Notation

Access nested properties using dot-separated paths:

```typescript
import { filter } from '@mcabreradev/filter';

interface User {
  name: string;
  address: {
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    }
  }
  settings: {
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
    }
  }
}

const users: User[] = [
  {
    name: 'Alice',
    address: {
      city: 'Berlin',
      country: 'Germany',
      coordinates: { lat: 52.52, lng: 13.405 }
    },
    settings: {
      theme: 'dark',
      notifications: { email: true, push: false }
    }
  },
  {
    name: 'Bob',
    address: {
      city: 'Paris',
      country: 'France',
      coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    settings: {
      theme: 'light',
      notifications: { email: true, push: true }
    }
  }
];

// ✅ Simple dot notation
const berlinUsers = filter(users, {
  'address.city': 'Berlin'
});
// → Returns [Alice]

// ✅ Multiple levels deep
const highLatitude = filter(users, {
  'address.coordinates.lat': { $gte: 50 }
});
// → Returns [Alice, Bob]

// ✅ Deeply nested properties
const emailEnabled = filter(users, {
  'settings.notifications.email': true
});
// → Returns [Alice, Bob]
```

## Nested Object Syntax

Use nested objects for a more structured approach:

```typescript
// ✅ Nested object syntax
const berlinUsers = filter(users, {
  address: {
    city: 'Berlin'
  }
});
// → Returns [Alice]

// ✅ Multiple nested levels
const darkThemeUsers = filter(users, {
  settings: {
    theme: 'dark',
    notifications: {
      email: true
    }
  }
});
// → Returns [Alice]
```

## Both Syntaxes Are Equivalent

These expressions produce the same result:

```typescript
// Dot notation
filter(users, {
  'address.city': 'Berlin',
  'settings.theme': 'dark'
});

// Nested object syntax
filter(users, {
  address: { city: 'Berlin' },
  settings: { theme: 'dark' }
});

// Both return [Alice]
```

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

All operators work seamlessly with nested properties using both dot notation and nested object syntax:

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

// Dot notation
filter(products, {
  'pricing.amount': { $gte: 100, $lte: 500 }
});

// Nested object syntax
filter(products, {
  pricing: {
    amount: { $gte: 100, $lte: 500 }
  }
});

// Range queries with dot notation
filter(orders, {
  'payment.amount': { $gte: 100, $lte: 1000 }
});
```

### String Operators

```typescript
// Starts with / Ends with
filter(users, {
  'address.city': { $startsWith: 'Ber' }
});

filter(users, {
  'contact.email': { $endsWith: '@company.com' }
});

// Contains substring
filter(products, {
  'details.description': { $contains: 'premium' }
});

// Regular expressions
filter(users, {
  'contact.phone': { $regex: /^\+1-\d{3}-\d{4}$/ }
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

// Dot notation with array operators
filter(companies, {
  'locations.offices': { $contains: 'Berlin' }
});

// In / Not in array
filter(users, {
  'address.country': { $in: ['Germany', 'France', 'Spain'] }
});

// Array size
filter(users, {
  'profile.interests': { $size: 3 }
});
```

### Geospatial Operators

```typescript
// Near query with nested coordinates (dot notation)
filter(stores, {
  'location.coordinates': {
    $near: {
      center: { lat: 52.52, lng: 13.405 },
      maxDistanceMeters: 5000
    }
  }
});

// Bounding box with nested coordinates
filter(properties, {
  'location.coordinates': {
    $geoBox: {
      southwest: { lat: 52.5, lng: 13.3 },
      northeast: { lat: 52.6, lng: 13.5 }
    }
  }
});
```

### Date/Time Operators

```typescript
// Recent events (dot notation)
filter(events, {
  'schedule.startDate': { $recent: { days: 7 } }
});

// Upcoming appointments
filter(appointments, {
  'schedule.appointmentDate': { $upcoming: { days: 30 } }
});

// Day of week filtering
filter(events, {
  'schedule.date': { $dayOfWeek: [1, 2, 3, 4, 5] } // Weekdays
});

// Age calculation
filter(users, {
  'profile.birthDate': { $age: { min: 18, max: 65 } }
});
```

## Combining Multiple Nested Paths

Mix dot notation and operators for powerful queries:

```typescript
// E-commerce product search
filter(products, {
  'pricing.amount': { $gte: 100, $lte: 500 },
  'pricing.currency': 'USD',
  'pricing.discount.active': true,
  'metadata.ratings.average': { $gte: 4.5 },
  'inventory.inStock': true
});

// User search with nested preferences
filter(users, {
  'address.city': { $in: ['Berlin', 'Paris', 'London'] },
  'settings.language': 'en',
  'settings.notifications.email': true,
  'profile.verified': true
});

// Event filtering with location and schedule
filter(events, {
  'location.city': 'Berlin',
  'location.coordinates': {
    $near: {
      center: { lat: 52.52, lng: 13.405 },
      maxDistanceMeters: 10000
    }
  },
  'schedule.date': { $upcoming: { days: 7 } },
  'schedule.startTime': { $timeOfDay: { start: 18, end: 23 } }
});
```

## Deep Nesting (Up to 10 Levels)

Filter supports configurable nesting depth (default: 3, max: 10) with full TypeScript support:

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

// Dot notation for deep nesting
filter(orgs, {
  'department.team.lead.email': { $endsWith: '@company.com' }
});

// Nested object syntax
filter(orgs, {
  department: {
    team: {
      lead: {
        email: { $endsWith: '@company.com' }
      }
    }
  }
});

// Very deep nesting (configure maxDepth)
filter(data, {
  'level1.level2.level3.level4.level5.value': 'deep'
}, { maxDepth: 10 });
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
// Dot notation with $and
filter(users, {
  $and: [
    { 'address.city': 'Berlin' },
    { 'address.country': 'Germany' }
  ]
});

// Nested object syntax with $and
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
// Dot notation with $or
filter(users, {
  $or: [
    { 'address.city': 'Berlin' },
    { 'address.city': 'Paris' }
  ]
});

// Nested object syntax with $or
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
// Mix dot notation and nested objects with logical operators
filter(products, {
  $and: [
    { 'pricing.currency': 'USD' },
    {
      $or: [
        { 'pricing.discount.active': true },
        { 'metadata.ratings.average': { $gte: 4.8 } }
      ]
    },
    { 'inventory.quantity': { $gt: 0 } }
  ]
});

// Complex nested query
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
        { 'address.city': 'Berlin' },
        { 'address.country': 'France' }
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

// Using dot notation
filter(orders, {
  'shipping.address.country': 'Germany',
  'shipping.address.city': { $in: ['Berlin', 'Munich', 'Hamburg'] },
  'payment.status': 'completed',
  'payment.amount': { $gte: 100 }
});

// Using nested object syntax
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

// Dot notation approach
filter(profiles, {
  'profile.social.github': { $startsWith: 'https://github.com/' },
  'profile.preferences.notifications.email': true
});

// Nested object approach
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

### Event Management with Location and Schedule

```typescript
interface Event {
  id: number;
  name: string;
  location: {
    venue: string;
    address: {
      city: string;
      country: string;
    }
    coordinates: {
      lat: number;
      lng: number;
    }
  }
  schedule: {
    startDate: Date;
    endDate: Date;
    startTime: Date;
    timezone: string;
  }
  registration: {
    open: boolean;
    capacity: number;
    registered: number;
  }
}

const events: Event[] = [...];

// Upcoming events in Berlin with available spots (dot notation)
filter(events, {
  'location.address.city': 'Berlin',
  'schedule.startDate': { $upcoming: { days: 30 } },
  'registration.open': true
});

// Weekend events near user location (mixed syntax)
const userLocation = { lat: 52.52, lng: 13.405 };
filter(events, {
  'location.coordinates': {
    $near: {
      center: userLocation,
      maxDistanceMeters: 10000
    }
  },
  'schedule.startDate': { $isWeekend: true },
  'registration.open': true
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

// Dot notation
filter(organizations, {
  'structure.department.manager.level': { $gte: 3 },
  'structure.department.budget.spent': { $lt: 50000 }
});

// Nested object syntax
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

## Array of Objects

Filter arrays containing objects with nested properties:

```typescript
interface Order {
  id: number;
  customer: {
    name: string;
    email: string;
  };
  items: Array<{
    productId: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  shipping: {
    address: {
      city: string;
      country: string;
    }
    status: string;
  }
}

const orders: Order[] = [...];

// Filter by first item's price (dot notation)
filter(orders, {
  'items.0.price': { $gte: 100 }
});

// Filter by nested customer email
filter(orders, {
  'customer.email': { $endsWith: '@company.com' }
});

// Filter by shipping address
filter(orders, {
  'shipping.address.city': 'Berlin',
  'shipping.status': 'delivered'
});

// Complex query combining multiple nested paths
filter(orders, {
  'customer.email': { $endsWith: '@premium.com' },
  'items.0.price': { $gte: 1000 },
  'shipping.address.country': 'Germany',
  'shipping.status': { $in: ['shipped', 'delivered'] }
});
```

## Configuration

### Max Depth Control

Control the maximum nesting depth (default: 3, range: 1-10):

```typescript
// Default: maxDepth = 3
filter(users, { 'address.city': 'Berlin' });

// Increase depth for deeper nesting
filter(data, { 'a.b.c.d.e': 'value' }, { maxDepth: 5 });

// Very deep nesting
filter(complexData, {
  'level1.level2.level3.level4.level5.level6.value': 'deep'
}, { maxDepth: 10 });
```

**Performance Note:** Higher `maxDepth` values may impact performance on large datasets.

## Best Practices

### ✅ DO

```typescript
// Use dot notation for clarity and conciseness
filter(users, {
  'address.city': 'Berlin',
  'settings.theme': 'dark'
});

// Group related nested paths
filter(products, {
  'pricing.amount': { $gte: 100, $lte: 500 },
  'pricing.currency': 'USD',
  'pricing.discount.active': true
});

// Configure maxDepth for very deep structures
filter(complexData, expression, { maxDepth: 5 });

// Use operators with nested paths
filter(users, {
  'profile.age': { $gte: 18, $lte: 65 },
  'address.country': { $in: ['US', 'CA', 'MX'] }
});

// Mix both syntaxes when it makes sense
filter(users, {
  'address.city': 'Berlin',
  settings: {
    notifications: {
      email: true
    }
  }
});
```

### ❌ DON'T

```typescript
// Don't exceed maxDepth without configuration
filter(data, {
  'a.b.c.d.e.f.g': 'value' // Exceeds default maxDepth of 3
});

// Don't mix dot notation and nested objects for same path
filter(users, {
  'address.city': 'Berlin',
  address: { country: 'Germany' } // Confusing - don't do this
});
```

## Performance Considerations

### Optimization Tips

1. **Limit Depth**: Use appropriate `maxDepth` values
2. **Enable Caching**: For repeated queries on nested objects
3. **Use Operators**: More efficient than predicates
4. **Dot Notation**: Often faster than deeply nested object syntax

```typescript
// ✅ Optimized for performance
filter(largeDataset, {
  'address.city': 'Berlin',
  'profile.verified': true
}, {
  maxDepth: 3,
  enableCache: true
});

// ⚠️ May be slower with very deep nesting
filter(data, {
  'level1.level2.level3.level4.level5.level6.value': 'deep'
}, {
  maxDepth: 10
});
```

### Best Practices

1. **Keep Nesting Reasonable**: While 10 levels are supported, shallower structures are faster
2. **Use Specific Paths**: More specific nested paths filter faster
3. **Index Critical Paths**: For large datasets, consider pre-indexing nested properties
4. **Enable Caching**: Use `enableCache: true` for repeated queries

### Performance Tips

```typescript
// Fast: Specific dot notation
filter(largeDataset, {
  'address.city': 'Berlin'
});

// Slower: Very deep nesting
filter(largeDataset, {
  'a.b.c.d.e.f.g.h.i.j': 'value'
}, { maxDepth: 10 });
```

For large datasets with frequent nested queries, consider:
- Enabling caching with `enableCache: true`
- Flattening deeply nested structures if possible
- Using lazy evaluation for early exits
- Optimizing geospatial queries with bounding boxes first

## Type Safety

Full TypeScript support ensures type-safe nested queries with both syntaxes:

```typescript
interface User {
  profile: {
    age: number;
  };
}

// ❌ TypeScript error with dot notation
filter(users, {
  'profile.age': 'invalid'  // Type error
});

// ❌ TypeScript error with nested syntax
filter(users, {
  profile: {
    age: 'invalid'  // Type error
  }
});

// ✅ Type-safe dot notation
filter(users, {
  'profile.age': { $gte: 18 }
});

// ✅ Type-safe nested syntax
filter(users, {
  profile: {
    age: { $gte: 18 }
  }
});

// Full type inference
import type { Expression } from '@mcabreradev/filter';

const expression: Expression<User> = {
  'profile.age': { $gte: 18 }  // Fully type-checked
};
```

## Type-Safe Dot Notation

TypeScript can provide type safety for dot notation paths using several approaches:

### Option 1: String Literal Types (Simple)

For basic type safety, use string literals:

```typescript
import { filter } from '@mcabreradev/filter';
import type { Expression } from '@mcabreradev/filter';

interface User {
  profile: {
    personal: {
      age: number;
      name: string;
    };
    address: {
      city: string;
      country: string;
    };
  };
}

// Define allowed paths as string literals
type UserPath = 
  | 'profile.personal.age'
  | 'profile.personal.name'
  | 'profile.address.city'
  | 'profile.address.country';

// Use with Record type
const expression: Record<UserPath, any> = {
  'profile.personal.age': { $gte: 18 },
  'profile.address.city': 'Berlin'
};

filter(users, expression);
```

### Option 2: Path Helper Type (Advanced)

Create a recursive type that generates all valid paths:

```typescript
// Type helper for generating dot notation paths
type Primitive = string | number | boolean | Date;

type DotNotation<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Primitive
    ? `${Prefix}${string & K}`
    : T[K] extends Array<any>
    ? `${Prefix}${string & K}` | DotNotation<T[K][number], `${Prefix}${string & K}.`>
    : `${Prefix}${string & K}` | DotNotation<T[K], `${Prefix}${string & K}.`>
}[keyof T];

// Usage
interface User {
  name: string;
  profile: {
    age: number;
    address: {
      city: string;
      country: string;
    };
  };
}

type UserPaths = DotNotation<User>;
// Type: "name" | "profile" | "profile.age" | "profile.address" | 
//       "profile.address.city" | "profile.address.country"

// Type-safe expression
const expression: Partial<Record<UserPaths, any>> = {
  'profile.age': { $gte: 18 },
  'profile.address.city': 'Berlin'
  // 'invalid.path': 'error' // ❌ TypeScript error!
};

filter(users, expression);
```

### Option 3: Using @mcabreradev/filter's Built-in Types

The library provides built-in type helpers:

```typescript
import { filter } from '@mcabreradev/filter';
import type { Expression, NestedKeyOf } from '@mcabreradev/filter';

interface User {
  name: string;
  profile: {
    age: number;
    address: {
      city: string;
    };
  };
}

// Built-in NestedKeyOf type
type UserPaths = NestedKeyOf<User>;

// Type-safe expression
const expression: Partial<Record<UserPaths, any>> = {
  'profile.age': { $gte: 18 },
  'profile.address.city': 'Berlin'
};

filter(users, expression);
```

### Option 4: Type-Safe Filter Function

Use the built-in typed filter wrapper:

```typescript
import { typedFilter } from '@mcabreradev/filter';

interface User {
  name: string;
  address: {
    city: string;
    country: string;
  };
}

const users: User[] = [...];

// ✅ Type-safe with autocomplete
typedFilter(users, {
  'address.city': 'Berlin',
  'address.country': 'Germany'
});

// ❌ TypeScript error
typedFilter(users, {
  'address.invalid': 'error' // Property does not exist!
});
```

### Practical Example: Type-Safe E-Commerce Filtering

```typescript
interface Product {
  id: number;
  name: string;
  pricing: {
    amount: number;
    currency: string;
    discount: {
      active: boolean;
      percentage: number;
    };
  };
  inventory: {
    inStock: boolean;
    quantity: number;
  };
  metadata: {
    tags: string[];
    ratings: {
      average: number;
      count: number;
    };
  };
}

// Type-safe filter expressions
import type { NestedKeyOf } from '@mcabreradev/filter';

type ProductPaths = NestedKeyOf<Product>;

const discountedProducts: Partial<Record<ProductPaths, any>> = {
  'pricing.discount.active': true,
  'pricing.discount.percentage': { $gte: 20 },
  'inventory.inStock': true,
  'metadata.ratings.average': { $gte: 4.5 }
};

const results = filter(products, discountedProducts);

// ✅ TypeScript catches invalid paths
const invalid: Partial<Record<ProductPaths, any>> = {
  'pricing.invalid': true, // ❌ Error: Property does not exist
  'metadata.ratings.invalid': 5 // ❌ Error: Property does not exist
};
```

### IDE Support

With proper typing, you get:

1. **Autocomplete**: IDE suggests valid dot notation paths
2. **Error Detection**: Invalid paths are highlighted
3. **Refactoring**: Rename detection for nested properties
4. **Documentation**: Hover to see property types

### Best Practices for Typed Dot Notation

#### ✅ DO

```typescript
// Use built-in NestedKeyOf type
import type { NestedKeyOf } from '@mcabreradev/filter';
type UserPaths = NestedKeyOf<User>;

// Define expression type once
type UserExpression = Partial<Record<UserPaths, any>>;

// Reuse across codebase
const expression: UserExpression = {
  'profile.age': { $gte: 18 }
};

// Use typedFilter for maximum safety
import { typedFilter } from '@mcabreradev/filter';
typedFilter(users, expression);
```

#### ❌ DON'T

```typescript
// Don't use 'any' everywhere
const expression: any = {
  'profile.age': { $gte: 18 }
};

// Don't skip type definitions
filter(users, {
  'profile.invalid': 'error' // No type safety
});

// Don't ignore TypeScript errors
// @ts-ignore
const badExpression = {
  'invalid.path': 'error'
};
```

For complete TypeScript type safety documentation, see [TypeScript Type Safety Guide](/guide/typescript-type-safety).

## Limitations

1. **Maximum Depth**: Configurable 1-10 levels (default: 3)
2. **Plain Objects Only**: Arrays, Dates, and Functions are not traversed as nested objects
3. **Performance**: Very deep nesting may impact performance on large datasets
4. **Dot Notation**: Property names cannot contain dots (use nested syntax instead)

## Troubleshooting

### Property Not Found

If nested properties aren't being matched:

```typescript
// Enable debug mode to see what's happening
const result = filterDebug(users, {
  'address.city': 'Berlin'
}, { verbose: true });

result.print();

// Check if maxDepth needs to be increased
filter(data, {
  'a.b.c.d': 'value'
}, { maxDepth: 5 });
```

### Dot Notation Not Working

**Problem**: Dot notation path not matching.

**Solution**: Check property names and ensure they don't contain dots

```typescript
// ❌ If property name contains dots, use nested syntax
const data = [{ 'address.city': 'Berlin' }];
filter(data, { 'address.city': 'Berlin' }); // Won't work

// ✅ Use bracket notation or nested syntax
filter(data, { 'address.city': 'Berlin' }); // For literal dot in property name
```

### Type Errors

Ensure your interface matches your data structure:

```typescript
interface User {
  address?: {  // Make optional if it might not exist
    city: string;
  };
}

// Type-safe optional chaining
filter(users, {
  'address.city': 'Berlin'  // TypeScript knows address might be undefined
});
```

### Performance Issues

For slow nested queries:
1. Enable caching: `{ enableCache: true }`
2. Reduce nesting depth: Lower `maxDepth` value
3. Use more specific filters
4. Consider data structure optimization (flatten if possible)
5. Use dot notation instead of deeply nested objects

```typescript
// ✅ Optimized
filter(data, {
  'address.city': 'Berlin'
}, {
  maxDepth: 3,
  enableCache: true
});
```

## Advanced Patterns

### Partial Nested Matching

```typescript
// Dot notation
filter(users, {
  'address.city': 'Berlin'
});

// Nested object syntax
filter(users, {
  address: {
    city: 'Berlin'
  }
});
```

### Combining Multiple Nested Paths

```typescript
// Mix dot notation and nested objects
filter(users, {
  'profile.age': { $gte: 18 },
  address: {
    country: 'Germany'
  }
});

// All dot notation
filter(users, {
  'profile.age': { $gte: 18 },
  'address.country': 'Germany'
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

// Dot notation for array indices
filter(users, {
  'orders.0.items.0.price': { $gte: 100 }
});

// Nested object syntax
filter(users, {
  orders: {
    items: {
      price: { $gte: 100 }
    }
  }
});
```

### Geospatial with Nested Coordinates

```typescript
// Nested coordinates with dot notation
filter(stores, {
  'location.coordinates': {
    $near: {
      center: { lat: 52.52, lng: 13.405 },
      maxDistanceMeters: 5000
    }
  }
});

// Nested object syntax
filter(stores, {
  location: {
    coordinates: {
      $near: {
        center: { lat: 52.52, lng: 13.405 },
        maxDistanceMeters: 5000
      }
    }
  }
});
```

### DateTime with Nested Dates

```typescript
// Dot notation for schedule filtering
filter(events, {
  'schedule.startDate': { $upcoming: { days: 7 } },
  'schedule.date': { $dayOfWeek: [1, 2, 3, 4, 5] }
});

// Nested object syntax
filter(events, {
  schedule: {
    startDate: { $upcoming: { days: 7 } },
    date: { $dayOfWeek: [1, 2, 3, 4, 5] }
  }
});
```

## Summary

- ✅ **Dot Notation**: Use `'property.nested.deep'` for accessing nested properties
- ✅ **Nested Objects**: Alternative syntax with nested object structure
- ✅ **Both Work**: Mix both syntaxes in the same expression
- ✅ **All Operators**: All 30+ operators work with both syntaxes
- ✅ **Configurable Depth**: 1-10 levels (default: 3)
- ✅ **TypeScript Support**: Full type safety
- ✅ **Performance**: Optimized with caching and early exit
- ✅ **Flexible**: Choose the syntax that works best for your use case

## See Also

- [Operators Guide](/guide/operators) - All 30+ available operators
- [Geospatial Operators](/guide/geospatial-operators) - Location-based filtering
- [Date/Time Operators](/guide/datetime-operators) - Temporal filtering
- [Logical Operators](/guide/logical-operators) - Complex expressions
- [Configuration](/guide/configuration) - maxDepth and other options
- [TypeScript Support](/advanced/type-system) - Type safety and inference
- [Performance Guide](/advanced/performance-benchmarks) - Optimization tips
- [API Reference](/api/reference) - Complete API documentation

