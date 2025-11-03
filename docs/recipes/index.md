---
title: Recipes
description: Practical how-to guides for common filtering scenarios
---

# Recipes

> **Practical solutions** for common filtering scenarios

Quick, copy-paste-ready code examples for solving real-world filtering problems.

---

## Available Recipes

### UI & Components
- [Search & Filter UI](./search-filtering.md) - Build powerful search interfaces
- [Table Filtering](./table-filtering.md) - Interactive data tables with filters
- [Form Validation](./form-validation.md) - Filter-based validation logic

### Specialized Filtering
- [Geospatial Search](./geospatial-search.md) - Location-based filtering
- [DateTime Filtering](./datetime-filtering.md) - Time-based queries
- [Multi-Criteria Filtering](./multi-criteria.md) - Complex filter combinations

### Performance
- [Performance Optimization](./performance.md) - Speed up filtering for large datasets
- [Lazy Loading](./lazy-loading.md) - Efficient pagination and infinite scroll

### Advanced
- [Custom Operators](./custom-operators.md) - Build your own operators
- [Dynamic Filters](./dynamic-filters.md) - User-defined filter expressions
- [Real-Time Filtering](./realtime.md) - Live data filtering

---

## Quick Examples

### Search Bar with Autocomplete

```typescript
import { useDebouncedFilter } from '@mcabreradev/filter';

function SearchBar({ data }: { data: Product[] }) {
  const [search, setSearch] = useState('');
  const { filtered, isPending } = useDebouncedFilter(
    data,
    { name: { $contains: search } },
    { delay: 300 }
  );

  return (
    <>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
      />
      {isPending && <Spinner />}
      <Results items={filtered} />
    </>
  );
}
```

### Multi-Select Filter

```typescript
function ProductFilter({ products }: { products: Product[] }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  const filtered = filter(products, {
    category: { $in: selectedCategories },
    price: { $gte: priceRange.min, $lte: priceRange.max },
    inStock: true
  });

  return <ProductGrid products={filtered} />;
}
```

### Proximity Search

```typescript
function NearbyLocations({ locations, userLocation }) {
  const nearby = filter(locations, {
    location: {
      $near: {
        center: userLocation,
        maxDistanceMeters: 5000 // 5km radius
      }
    },
    isOpen: true
  });

  return <MapView locations={nearby} />;
}
```

---

## Recipe Categories

### By Use Case

| Recipe | Use Case | Difficulty |
|--------|----------|------------|
| [Search Filtering](./search-filtering.md) | Search bars, autocomplete | 🟢 Easy |
| [Table Filtering](./table-filtering.md) | Data tables, grids | 🟢 Easy |
| [Form Validation](./form-validation.md) | Validation logic | 🟡 Medium |
| [Geospatial Search](./geospatial-search.md) | Maps, location-based | 🟡 Medium |
| [DateTime Filtering](./datetime-filtering.md) | Calendars, schedules | 🟡 Medium |
| [Performance](./performance.md) | Large datasets | 🟡 Medium |
| [Custom Operators](./custom-operators.md) | Domain-specific logic | 🔴 Advanced |
| [Real-Time](./realtime.md) | Live updates | 🔴 Advanced |

---

## Contributing Recipes

Have a useful recipe to share? We welcome contributions!

1. Fork the repository
2. Create your recipe in `docs/recipes/`
3. Follow the recipe template
4. Submit a pull request

See [Contributing Guide](../project/contributing.md) for details.

---

## See Also

- [Examples](../examples/) - Comprehensive code examples
- [Guide](../guide/) - Complete documentation
- [API Reference](../api/) - Technical details
