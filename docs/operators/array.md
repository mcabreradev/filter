---
title: Array Operators
description: Array membership and collection operators
---

# Array Operators

Operators for filtering by array membership and collection properties.

## Available Operators

- `$in` - Value in array
- `$nin` - Value not in array
- `$contains` - Array contains value
- `$size` - Array has specific length

---

## $in (In Array)

Check if a value is in an array of options:

```typescript
// Find users in specific cities
filter(users, {
  city: { $in: ['Berlin', 'Paris', 'London'] }
});

// Find products in categories
filter(products, {
  category: { $in: ['Electronics', 'Books'] }
});

// Find orders with specific statuses
filter(orders, {
  status: { $in: ['shipped', 'delivered'] }
});

// Works with numbers
filter(products, {
  rating: { $in: [4, 5] }
});
```

**Array OR Syntax (v5.5.0+):**

```typescript
// Cleaner syntax - same as $in
filter(users, { city: ['Berlin', 'Paris', 'London'] });
filter(products, { category: ['Electronics', 'Books'] });
```

---

## $nin (Not In Array)

Exclude values in an array:

```typescript
// Exclude archived and deleted
filter(items, {
  status: { $nin: ['archived', 'deleted'] }
});

// Exclude specific categories
filter(products, {
  category: { $nin: ['Clearance', 'Discontinued'] }
});

// Exclude certain user roles
filter(users, {
  role: { $nin: ['guest', 'banned'] }
});
```

---

## $contains (Array Contains Value)

Check if an array property contains a specific value:

```typescript
interface Product {
  id: number;
  tags: string[];
  colors: string[];
}

// Find products with 'sale' tag
filter(products, {
  tags: { $contains: 'sale' }
});

// Find products with red color
filter(products, {
  colors: { $contains: 'red' }
});

// Find users with admin permission
filter(users, {
  permissions: { $contains: 'admin' }
});
```

**Also works for string substring matching:**

```typescript
filter(users, {
  email: { $contains: '@gmail.com' }
});
```

---

## $size (Array Size)

Filter by array length:

```typescript
// Find products with exactly 3 images
filter(products, {
  images: { $size: 3 }
});

// Find users with 5 permissions
filter(users, {
  permissions: { $size: 5 }
});

// Find orders with 1 item (single-item orders)
filter(orders, {
  items: { $size: 1 }
});

// Find empty arrays
filter(data, {
  tags: { $size: 0 }
});
```

---

## Combining Array Operators

```typescript
// Multiple conditions on different arrays
filter(products, {
  tags: { $contains: 'featured' },
  images: { $size: { $gte: 3 } }, // Note: $size doesn't support operators currently
  category: { $in: ['Electronics', 'Accessories'] }
});

// Check for presence in array and value membership
filter(users, {
  roles: { $contains: 'admin' },
  status: { $in: ['active', 'verified'] }
});
```

---

## Real-World Examples

### E-commerce Product Filtering

```typescript
interface Product {
  id: number;
  name: string;
  category: string;
  tags: string[];
  colors: string[];
  images: string[];
  price: number;
}

// Featured products in Electronics or Accessories with images
filter(products, {
  tags: { $contains: 'featured' },
  category: { $in: ['Electronics', 'Accessories'] },
  images: { $size: { $gte: 1 } } // Has at least one image
});
```

### User Permission Filtering

```typescript
interface User {
  id: number;
  email: string;
  roles: string[];
  permissions: string[];
  status: string;
}

// Active users with admin or moderator roles
filter(users, {
  status: { $in: ['active', 'verified'] },
  roles: { $contains: 'admin' }
});
```

### Multi-Tag Filtering

```typescript
// Products with ANY of these tags
filter(products, {
  $or: [
    { tags: { $contains: 'sale' } },
    { tags: { $contains: 'clearance' } },
    { tags: { $contains: 'discount' } }
  ]
});

// Products with ALL of these tags (using $and)
const requiredTags = ['featured', 'new', 'premium'];
filter(products, {
  $and: requiredTags.map(tag => ({ tags: { $contains: tag } }))
});
```

---

## See Also

- [Operators Overview](./index.md)
- [Comparison Operators](./comparison.md)
- [Logical Operators](./logical.md)
- [Array OR Syntax](../guide/operators.md#array-or-syntax)
