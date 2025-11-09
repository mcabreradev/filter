---
title: Operators Reference
description: Complete reference for all 40+ filter operators
---

# Operators Reference

> **Complete operator reference** for all filtering capabilities

Quick navigation to operator categories:

## Operator Categories

### [Comparison Operators](./comparison.md)
Numeric and value comparisons
- `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`

### [Array Operators](./array.md)
Array membership and operations
- `$in`, `$nin`, `$contains`, `$size`

### [String Operators](./string.md)
String matching and patterns
- `$startsWith`, `$endsWith`, `$contains`, `$regex`, `$match`

### [Logical Operators](./logical.md)
Complex query composition
- `$and`, `$or`, `$not`

### [Geospatial Operators](./geospatial.md)
Location-based filtering
- `$near`, `$geoBox`, `$geoPolygon`

### [Datetime Operators](./datetime.md)
Temporal filtering
- `$recent`, `$upcoming`, `$dayOfWeek`, `$timeOfDay`, `$age`

---

## Quick Reference Table

| Operator | Category | Description | Example |
|----------|----------|-------------|---------|
| `$gt` | Comparison | Greater than | `{ age: { $gt: 18 } }` |
| `$gte` | Comparison | Greater than or equal | `{ age: { $gte: 21 } }` |
| `$lt` | Comparison | Less than | `{ price: { $lt: 100 } }` |
| `$lte` | Comparison | Less than or equal | `{ price: { $lte: 99.99 } }` |
| `$eq` | Comparison | Equal to | `{ status: { $eq: 'active' } }` |
| `$ne` | Comparison | Not equal to | `{ role: { $ne: 'guest' } }` |
| `$in` | Array | Value in array | `{ city: { $in: ['Berlin', 'Paris'] } }` |
| `$nin` | Array | Value not in array | `{ status: { $nin: ['archived', 'deleted'] } }` |
| `$contains` | Array/String | Contains value/substring | `{ tags: { $contains: 'urgent' } }` |
| `$size` | Array | Array length | `{ items: { $size: 5 } }` |
| `$startsWith` | String | Starts with string | `{ email: { $startsWith: 'admin' } }` |
| `$endsWith` | String | Ends with string | `{ file: { $endsWith: '.pdf' } }` |
| `$regex` | String | Regex match | `{ phone: { $regex: /^\+1/ } }` |
| `$match` | String | Regex match (alias) | `{ username: { $match: '^[a-z]+$' } }` |
| `$and` | Logical | All conditions match | `{ $and: [...] }` |
| `$or` | Logical | Any condition matches | `{ $or: [...] }` |
| `$not` | Logical | Negates condition | `{ $not: { ... } }` |
| `$near` | Geospatial | Proximity search | `{ location: { $near: { center, radius } } }` |
| `$geoBox` | Geospatial | Bounding box | `{ location: { $geoBox: { sw, ne } } }` |
| `$geoPolygon` | Geospatial | Polygon containment | `{ location: { $geoPolygon: { points } } }` |
| `$recent` | DateTime | Recent time period | `{ date: { $recent: { days: 7 } } }` |
| `$upcoming` | DateTime | Future time period | `{ date: { $upcoming: { hours: 24 } } }` |
| `$dayOfWeek` | DateTime | Day of week (0-6) | `{ date: { $dayOfWeek: [1,2,3,4,5] } }` |
| `$timeOfDay` | DateTime | Hour range (0-23) | `{ time: { $timeOfDay: { start: 9, end: 17 } } }` |
| `$age` | DateTime | Age calculation | `{ birthDate: { $age: { min: 18 } } }` |
| `$isWeekday` | DateTime | Is weekday | `{ date: { $isWeekday: true } }` |
| `$isWeekend` | DateTime | Is weekend | `{ date: { $isWeekend: true } }` |

---

## Operator Compatibility

### Type-Specific Operators

TypeScript provides intelligent autocomplete based on property types:

```typescript
interface Product {
  name: string;      // String operators available
  price: number;     // Comparison operators available
  tags: string[];    // Array operators available
  inStock: boolean;  // Comparison operators available
  location: GeoPoint; // Geospatial operators available
  createdAt: Date;   // DateTime operators available
}

filter(products, {
  name: { $startsWith: 'Pro' },        // ✅ String operator
  price: { $gte: 100, $lte: 500 },     // ✅ Comparison operators
  tags: { $contains: 'sale' },         // ✅ Array operator
  inStock: { $eq: true },              // ✅ Comparison operator
  location: { $near: { ... } },        // ✅ Geospatial operator
  createdAt: { $recent: { days: 7 } }  // ✅ DateTime operator
});
```

---

## Combining Operators

### Multiple Operators on Same Field

```typescript
// Range query
filter(products, {
  price: { $gte: 100, $lte: 500 }
});

// String pattern with negation
filter(files, {
  name: { $startsWith: 'report', $endsWith: '.pdf' }
});
```

### Multiple Fields with Operators

```typescript
filter(products, {
  price: { $gte: 100 },
  category: { $in: ['Electronics', 'Books'] },
  inStock: { $eq: true },
  rating: { $gte: 4.0 }
});
```

### Logical Operators

```typescript
filter(products, {
  $and: [
    { price: { $gte: 100 } },
    { $or: [
      { category: 'Electronics' },
      { category: 'Books' }
    ]}
  ]
});
```

---

## See Also

- [Operators Guide](../guide/operators.md) - Detailed guide with examples
- [Logical Operators Guide](../guide/logical-operators.md) - Complex queries
- [Geospatial Guide](../guide/geospatial-operators.md) - Location filtering
- [DateTime Guide](../guide/datetime-operators.md) - Temporal filtering
- [API Reference](../api/operators.md) - Technical API details
