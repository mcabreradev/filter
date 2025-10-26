---
title: React Integration
description: React Hooks for filtering with @mcabreradev/filter
---

# React Integration

Complete guide for using `@mcabreradev/filter` with React.

## Installation

```bash
npm install @mcabreradev/filter react
```

## Available Hooks

- `useFilter` - Basic filtering with automatic memoization
- `useFilteredState` - Filtering with local state management
- `useDebouncedFilter` - Debounced filtering for search inputs
- `usePaginatedFilter` - Filtering with pagination support

## useFilter

Basic filtering with automatic memoization.

```typescript
import { useFilter } from '@mcabreradev/filter';

interface User {
  id: number;
  name: string;
  active: boolean;
}

function UserList() {
  const users: User[] = [
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false },
  ];

  const { filtered, isFiltering } = useFilter(users, { active: true });

  return (
    <div>
      <p>Showing {filtered.length} active users</p>
      {filtered.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## useFilteredState

Filtering with local state management.

```typescript
import { useFilteredState } from '@mcabreradev/filter';

function SearchableList() {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ];

  const {
    filtered,
    expression,
    setExpression,
    isFiltering,
  } = useFilteredState(users, '');

  return (
    <div>
      <input
        type="text"
        value={expression as string}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="Search users..."
      />
      <div>
        {filtered.map((user) => (
          <div key={user.id}>{user.name} - {user.email}</div>
        ))}
      </div>
    </div>
  );
}
```

## useDebouncedFilter

Debounced filtering for search inputs.

```typescript
import { useState } from 'react';
import { useDebouncedFilter } from '@mcabreradev/filter';

function SearchUsers() {
  const [search, setSearch] = useState('');
  const users = [...];

  const { filtered, isPending } = useDebouncedFilter(
    users,
    search,
    { delay: 300 }
  );

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      {isPending && <span>Searching...</span>}
      <div>
        {filtered.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    </div>
  );
}
```

## usePaginatedFilter

Filtering with pagination support.

```typescript
import { usePaginatedFilter } from '@mcabreradev/filter';

function PaginatedList() {
  const users = [...];

  const {
    filtered,
    currentPage,
    totalPages,
    pageSize,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
  } = usePaginatedFilter(users, { active: true }, {
    initialPage: 1,
    initialPageSize: 10,
  });

  return (
    <div>
      <div>
        {filtered.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
      <div>
        <button onClick={prevPage} disabled={!hasPrevPage}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={!hasNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}
```

## TypeScript Support

All hooks are fully typed with generics:

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const { filtered } = useFilter<Product>(products, {
  category: 'Electronics',
  price: { $gte: 100 }
});
```

## SSR Support

All hooks work with Next.js and other SSR frameworks:

```typescript
'use client';

import { useFilter } from '@mcabreradev/filter';

export function ClientComponent() {
  const { filtered } = useFilter(data, expression);
  return <div>{/* ... */}</div>;
}
```

## Performance Tips

1. Enable caching for large datasets:
```typescript
const { filtered } = useFilter(largeDataset, expression, {
  enableCache: true
});
```

2. Use debounced filter for search inputs:
```typescript
const { filtered } = useDebouncedFilter(data, searchTerm, {
  delay: 300
});
```

3. Memoize complex expressions:
```typescript
const expression = useMemo(() => ({
  category: 'Electronics',
  price: { $gte: 100, $lte: 500 }
}), []);

const { filtered } = useFilter(products, expression);
```

## Complete Example

```typescript
import { useState, useMemo } from 'react';
import { useDebouncedFilter, usePaginatedFilter } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
}

export function ProductList({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState(0);

  const expression = useMemo(() => {
    const expr: any = {};

    if (search) {
      expr.name = { $contains: search };
    }

    if (category !== 'all') {
      expr.category = category;
    }

    if (minPrice > 0) {
      expr.price = { $gte: minPrice };
    }

    return expr;
  }, [search, category, minPrice]);

  const {
    filtered,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
  } = usePaginatedFilter(products, expression, {
    initialPageSize: 12,
  });

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
        </select>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          placeholder="Min price"
        />
      </div>

      <div className="products">
        {filtered.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>Rating: {product.rating}/5</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={prevPage} disabled={!hasPrevPage}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={!hasNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}
```

## Next Steps

- [Vue Integration](/frameworks/vue)
- [Svelte Integration](/frameworks/svelte)
- [Operators Guide](/guide/operators)
- [Performance Tips](/performance)

