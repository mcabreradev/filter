---
title: Comparison Operators
description: Numeric and value comparison operators
---

# Comparison Operators

Operators for numeric comparisons and value equality.

## Available Operators

- `$gt` - Greater than
- `$gte` - Greater than or equal
- `$lt` - Less than
- `$lte` - Less than or equal  
- `$eq` - Equal to
- `$ne` - Not equal to

---

## $gt (Greater Than)

```typescript
// Find users older than 18
filter(users, { age: { $gt: 18 } });

// Find products more expensive than $100
filter(products, { price: { $gt: 100 } });

// Find orders after a date
filter(orders, { createdAt: { $gt: new Date('2024-01-01') } });
```

---

## $gte (Greater Than or Equal)

```typescript
// Find adult users (18+)
filter(users, { age: { $gte: 18 } });

// Find products $100 or more
filter(products, { price: { $gte: 100 } });

// Find orders from today onwards
filter(orders, { createdAt: { $gte: today } });
```

---

## $lt (Less Than)

```typescript
// Find minors
filter(users, { age: { $lt: 18 } });

// Find affordable products
filter(products, { price: { $lt: 50 } });

// Find pending tasks before deadline
filter(tasks, { dueDate: { $lt: deadline } });
```

---

## $lte (Less Than or Equal)

```typescript
// Find users 65 or younger
filter(users, { age: { $lte: 65 } });

// Find products under $100
filter(products, { price: { $lte: 99.99 } });

// Find tasks due by deadline
filter(tasks, { dueDate: { $lte: deadline } });
```

---

## $eq (Equal To)

```typescript
// Find active users
filter(users, { status: { $eq: 'active' } });

// Find exact price
filter(products, { price: { $eq: 99.99 } });

// Find specific role
filter(users, { role: { $eq: 'admin' } });

// Note: Shorthand without operator works too
filter(users, { status: 'active' }); // Same as $eq
```

---

## $ne (Not Equal To)

```typescript
// Exclude guests
filter(users, { role: { $ne: 'guest' } });

// Exclude out of stock
filter(products, { inStock: { $ne: false } });

// Exclude archived
filter(items, { status: { $ne: 'archived' } });
```

---

## Range Queries

Combine multiple operators for range filtering:

```typescript
// Age range 18-65
filter(users, {
  age: { $gte: 18, $lte: 65 }
});

// Price range $100-$500
filter(products, {
  price: { $gte: 100, $lte: 500 }
});

// Date range (this month)
const startOfMonth = new Date(2024, 0, 1);
const endOfMonth = new Date(2024, 0, 31);

filter(orders, {
  createdAt: { $gte: startOfMonth, $lte: endOfMonth }
});
```

---

## Type Support

Works with all comparable types:

```typescript
// Numbers
filter(data, { score: { $gt: 85 } });

// Dates
filter(data, { date: { $gte: yesterday } });

// Strings (lexicographical)
filter(data, { name: { $gte: 'M' } }); // M-Z

// Booleans
filter(data, { active: { $eq: true } });
```

---

## See Also

- [Operators Overview](./index.md)
- [Array Operators](./array.md)
- [String Operators](./string.md)
