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
- [Search & Filter UI](/recipes/#search-filtering) - Build powerful search interfaces
- [Table Filtering](/recipes/#table-filtering) - Interactive data tables with filters
- [Form Validation](/recipes/#form-validation) - Filter-based validation logic

### Specialized Filtering
- [Geospatial Search](/recipes/#geospatial-search) - Location-based filtering
- [DateTime Filtering](/recipes/#datetime-filtering) - Time-based queries
- [Multi-Criteria Filtering](/recipes/#multi-criteria) - Complex filter combinations

### Performance
- [Performance Optimization](/recipes/#performance) - Speed up filtering for large datasets
- [Lazy Loading](/recipes/#lazy-loading) - Efficient pagination and infinite scroll

### Advanced
- [Custom Operators](/recipes/#custom-operators) - Build your own operators
- [Dynamic Filters](/recipes/#dynamic-filters) - User-defined filter expressions
- [Real-Time Filtering](/recipes/#realtime) - Live data filtering

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
| [Search Filtering](/recipes/#search-filtering) | Search bars, autocomplete | 🟢 Easy |
| [Table Filtering](/recipes/#table-filtering) | Data tables, grids | 🟢 Easy |
| [Form Validation](/recipes/#form-validation) | Validation logic | 🟡 Medium |
| [Geospatial Search](/recipes/#geospatial-search) | Maps, location-based | 🟡 Medium |
| [DateTime Filtering](/recipes/#datetime-filtering) | Calendars, schedules | 🟡 Medium |
| [Performance](/recipes/#performance) | Large datasets | 🟡 Medium |
| [Custom Operators](/recipes/#custom-operators) | Domain-specific logic | 🔴 Advanced |
| [Real-Time](/recipes/#realtime) | Live updates | 🔴 Advanced |

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
