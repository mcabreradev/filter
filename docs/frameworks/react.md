---
title: React Integration
description: React Hooks for filtering with @mcabreradev/filter
---

# React Integration

Complete guide for using `@mcabreradev/filter` with React 18+.

## Installation

```bash
npm install @mcabreradev/filter react
```

## Import

```typescript
import { 
  useFilter,
  useFilteredState,
  useDebouncedFilter,
  usePaginatedFilter,
  FilterProvider,
  useFilterContext
} from '@mcabreradev/filter/react';
```

## Available Hooks

- [`useFilter`](#usefilter) - Basic filtering with automatic memoization
- [`useFilteredState`](#usefilteredstate) - Filtering with local state management
- [`useDebouncedFilter`](#usedebouncedfilter) - Debounced filtering for search inputs
- [`usePaginatedFilter`](#usepaginatedfilter) - Filtering with built-in pagination
- [`FilterProvider`](#filterprovider) - Global filter configuration context
- [`useFilterContext`](#usefiltercontext) - Access global filter configuration

## useFilter

Basic filtering hook with automatic memoization.

```typescript
import { useFilter } from '@mcabreradev/filter/react';

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

### API Reference

```typescript
function useFilter<T>(
  data: T[],
  expression: Expression<T> | null,
  options?: FilterOptions
): UseFilterResult<T>

interface UseFilterResult<T> {
  filtered: T[];
  isFiltering: boolean;
}
```

## useFilteredState

Filtering with local state management for dynamic expressions.

```typescript
import { useState } from 'react';
import { useFilteredState } from '@mcabreradev/filter/react';

function ProductSearch() {
  const products = [
    { id: 1, name: 'Laptop', price: 1000, category: 'Electronics' },
    { id: 2, name: 'Mouse', price: 25, category: 'Electronics' },
  ];

  const { filtered, expression, setExpression } = useFilteredState(
    products,
    { category: 'Electronics' }
  );

  return (
    <div>
      <button onClick={() => setExpression({ price: { $lt: 500 } })}>
        Under $500
      </button>
      <div>Found {filtered.length} products</div>
    </div>
  );
}
```

### API Reference

```typescript
function useFilteredState<T>(
  data: T[],
  initialExpression: Expression<T> | null,
  options?: FilterOptions
): UseFilteredStateResult<T>

interface UseFilteredStateResult<T> {
  filtered: T[];
  expression: Expression<T> | null;
  setExpression: (expression: Expression<T> | null) => void;
  isFiltering: boolean;
}
```

## useDebouncedFilter

Debounced filtering for search inputs with pending state.

```typescript
import { useState } from 'react';
import { useDebouncedFilter } from '@mcabreradev/filter/react';

function UserSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ];

  const { filtered, isPending } = useDebouncedFilter(
    users,
    { name: { $contains: searchTerm } },
    { delay: 300 }
  );

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
      {isPending && <span>Searching...</span>}
      <div>Found {filtered.length} users</div>
    </div>
  );
}
```

### API Reference

```typescript
function useDebouncedFilter<T>(
  data: T[],
  expression: Expression<T> | null,
  options?: UseDebouncedFilterOptions
): UseDebouncedFilterResult<T>

interface UseDebouncedFilterOptions extends FilterOptions {
  delay?: number; // Default: 300ms
}

interface UseDebouncedFilterResult<T> {
  filtered: T[];
  isPending: boolean;
}
```

## usePaginatedFilter

Filtering with built-in pagination support.

```typescript
import { usePaginatedFilter } from '@mcabreradev/filter/react';

function PaginatedProducts() {
  const products = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: Math.random() * 1000,
  }));

  const {
    paginatedResults,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  } = usePaginatedFilter(
    products,
    { price: { $gte: 100 } },
    { pageSize: 10, initialPage: 1 }
  );

  return (
    <div>
      <div>
        {paginatedResults.map((product) => (
          <div key={product.id}>{product.name} - ${product.price}</div>
        ))}
      </div>
      <div>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
```

### API Reference

```typescript
function usePaginatedFilter<T>(
  data: T[],
  expression: Expression<T> | null,
  options?: { pageSize?: number; initialPage?: number; filterOptions?: FilterOptions }
): UsePaginatedFilterResult<T>

interface UsePaginatedFilterResult<T> {
  paginatedResults: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
```

## FilterProvider

Global filter configuration using React Context.

```typescript
import { FilterProvider, useFilterContext } from '@mcabreradev/filter/react';

function App() {
  return (
    <FilterProvider value={{ options: { caseSensitive: true, enableCache: true } }}>
      <UserList />
    </FilterProvider>
  );
}

function UserList() {
  const context = useFilterContext();
  // Access context.options in your components
  
  return <div>Users List</div>;
}
```

### API Reference

```typescript
interface FilterContextValue {
  options?: FilterOptions;
}

function FilterProvider({ 
  value, 
  children 
}: { 
  value: FilterContextValue; 
  children: React.ReactNode;
}): JSX.Element

function useFilterContext(): FilterContextValue
```

## TypeScript Support

Full type safety with generics:

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const { filtered } = useFilter<Product>(
  products,
  { category: 'Electronics' }
);
// filtered is typed as Product[]
```

## SSR Support

All hooks are SSR-compatible and work with Next.js, Remix, etc.

```typescript
// Next.js App Router
'use client';

import { useFilter } from '@mcabreradev/filter/react';

export default function ProductsPage({ products }: { products: Product[] }) {
  const { filtered } = useFilter(products, { inStock: true });
  
  return <div>{/* render filtered products */}</div>;
}
```

## Best Practices

### 1. Memoize Large Datasets

```typescript
const data = useMemo(() => largeDataset, []);
const { filtered } = useFilter(data, expression);
```

### 2. Use Debouncing for Search

```typescript
const { filtered, isPending } = useDebouncedFilter(
  users,
  { name: { $contains: searchTerm } },
  { delay: 300 }
);
```

### 3. Enable Caching for Repeated Queries

```typescript
const { filtered } = useFilter(
  data,
  expression,
  { enableCache: true }
);
```

## Real-World Examples

### 1. Search with Debounce and Sorting

Advanced search interface with debounced input, multi-field filtering, and dynamic sorting.

```typescript
import { useState } from 'react';
import { useDebouncedFilter } from '@mcabreradev/filter/react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  inStock: boolean;
}

function ProductSearch({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Build dynamic expression
  const expression = {
    ...(searchTerm && { name: { $contains: searchTerm } }),
    ...(category && { category }),
    price: { $lte: maxPrice },
    inStock: true
  };

  const { filtered, isPending } = useDebouncedFilter(
    products,
    expression,
    {
      delay: 300,
      orderBy: { field: sortBy, direction: sortDir },
      enableCache: true
    }
  );

  return (
    <div className="product-search">
      <div className="filters">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="search-input"
        />
        
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
        </select>

        <div className="price-filter">
          <label>Max Price: ${maxPrice}</label>
          <input
            type="range"
            min="0"
            max="10000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div className="sort-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'price' | 'rating')}
          >
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
          <button onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>
            {sortDir === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {isPending && <div className="loading">Searching...</div>}

      <div className="results">
        <p>{filtered.length} products found</p>
        <div className="product-grid">
          {filtered.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p className="category">{product.category}</p>
              <p className="price">${product.price}</p>
              <p className="rating">⭐ {product.rating}/5</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 2. Data Table with Sorting and Filtering

Sortable, filterable data table with column-based filtering and pagination.

```typescript
import { useState, useMemo } from 'react';
import { useFilter } from '@mcabreradev/filter/react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: Date;
}

type SortConfig = {
  field: keyof User;
  direction: 'asc' | 'desc';
};

function UserDataTable({ users }: { users: User[] }) {
  const [nameFilter, setNameFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'name',
    direction: 'asc'
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Build filter expression
  const expression = useMemo(() => ({
    ...(nameFilter && { name: { $contains: nameFilter } }),
    ...(roleFilter && { role: roleFilter }),
    ...(statusFilter && { status: statusFilter as 'active' | 'inactive' })
  }), [nameFilter, roleFilter, statusFilter]);

  const { filtered } = useFilter(users, expression, {
    orderBy: { field: sortConfig.field, direction: sortConfig.direction },
    enableCache: true
  });

  // Paginate results
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const handleSort = (field: keyof User) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field: keyof User) => {
    if (sortConfig.field !== field) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="data-table">
      <div className="table-filters">
        <input
          type="text"
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Name {getSortIcon('name')}
            </th>
            <th onClick={() => handleSort('email')}>
              Email {getSortIcon('email')}
            </th>
            <th onClick={() => handleSort('role')}>
              Role {getSortIcon('role')}
            </th>
            <th onClick={() => handleSort('status')}>
              Status {getSortIcon('status')}
            </th>
            <th onClick={() => handleSort('lastLogin')}>
              Last Login {getSortIcon('lastLogin')}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span className={`status-badge ${user.status}`}>
                  {user.status}
                </span>
              </td>
              <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button 
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages} ({filtered.length} results)</span>
        <button 
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### 3. Infinite Scroll with Lazy Loading

Infinite scroll list using lazy evaluation for memory-efficient rendering.

```typescript
import { useState, useEffect, useRef, useCallback } from 'react';
import { filterLazy } from '@mcabreradev/filter';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: Date;
}

function InfinitePostList({ posts }: { posts: Post[] }) {
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('');
  
  const observerTarget = useRef<HTMLDivElement>(null);
  const iteratorRef = useRef<Generator<Post, void, undefined> | null>(null);

  // Initialize lazy iterator when filter changes
  useEffect(() => {
    const expression = selectedTag ? { tags: { $contains: selectedTag } } : {};
    iteratorRef.current = filterLazy(posts, expression);
    setDisplayedPosts([]);
    setHasMore(true);
    loadMore();
  }, [selectedTag, posts]);

  const loadMore = useCallback(() => {
    if (!iteratorRef.current || isLoading) return;

    setIsLoading(true);
    
    // Load 20 items at a time
    const newPosts: Post[] = [];
    for (let i = 0; i < 20; i++) {
      const result = iteratorRef.current.next();
      if (result.done) {
        setHasMore(false);
        break;
      }
      newPosts.push(result.value);
    }

    setDisplayedPosts((prev) => [...prev, ...newPosts]);
    setIsLoading(false);
  }, [isLoading]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, loadMore]);

  return (
    <div className="infinite-list">
      <div className="filter-bar">
        <select 
          value={selectedTag} 
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All Tags</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="react">React</option>
        </select>
      </div>

      <div className="post-list">
        {displayedPosts.map((post) => (
          <article key={post.id} className="post-card">
            <h2>{post.title}</h2>
            <p className="author">By {post.author}</p>
            <p className="content">{post.content}</p>
            <div className="tags">
              {post.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <time>{new Date(post.createdAt).toLocaleDateString()}</time>
          </article>
        ))}
      </div>

      {hasMore && (
        <div ref={observerTarget} className="loading-trigger">
          {isLoading ? 'Loading more posts...' : 'Scroll for more'}
        </div>
      )}

      {!hasMore && (
        <div className="end-message">
          No more posts to load ({displayedPosts.length} total)
        </div>
      )}
    </div>
  );
}
```

### 4. Redux Integration Pattern

Integration with Redux for global state management with filtering.

```typescript
// store/filterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Expression } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

interface FilterState {
  expression: Expression<Product>;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  enableCache: boolean;
}

const initialState: FilterState = {
  expression: {},
  sortBy: 'name',
  sortDirection: 'asc',
  enableCache: true
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setExpression: (state, action: PayloadAction<Expression<Product>>) => {
      state.expression = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    toggleSortDirection: (state) => {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    },
    resetFilters: (state) => {
      state.expression = {};
      state.sortBy = 'name';
      state.sortDirection = 'asc';
    }
  }
});

export const { setExpression, setSortBy, toggleSortDirection, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;

// Component using Redux
import { useSelector, useDispatch } from 'react-redux';
import { useFilter } from '@mcabreradev/filter/react';
import { setExpression, setSortBy, toggleSortDirection, resetFilters } from './store/filterSlice';
import type { RootState } from './store';

function ProductCatalog({ products }: { products: Product[] }) {
  const dispatch = useDispatch();
  const filterState = useSelector((state: RootState) => state.filter);

  const { filtered, isFiltering } = useFilter(
    products,
    filterState.expression,
    {
      orderBy: { 
        field: filterState.sortBy, 
        direction: filterState.sortDirection 
      },
      enableCache: filterState.enableCache
    }
  );

  const handleCategoryFilter = (category: string) => {
    dispatch(setExpression({ category }));
  };

  const handlePriceRangeFilter = (min: number, max: number) => {
    dispatch(setExpression({
      price: { $gte: min, $lte: max }
    }));
  };

  const handleClearFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="product-catalog">
      <div className="filters">
        <button onClick={() => handleCategoryFilter('Electronics')}>
          Electronics
        </button>
        <button onClick={() => handleCategoryFilter('Books')}>
          Books
        </button>
        <button onClick={() => handlePriceRangeFilter(0, 100)}>
          Under $100
        </button>
        <button onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>

      <div className="sort-controls">
        <select 
          value={filterState.sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="category">Category</option>
        </select>
        <button onClick={() => dispatch(toggleSortDirection())}>
          {filterState.sortDirection === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </button>
      </div>

      {isFiltering && <div>Filtering...</div>}

      <div className="product-grid">
        <p>{filtered.length} products</p>
        {filtered.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <p className="price">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5. Next.js App Router with SSR

Server-side rendering with Next.js App Router and client-side filtering.

```typescript
// app/products/page.tsx
import { Suspense } from 'react';
import ProductList from './ProductList';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

// Server Component - fetch data
async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });
  
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="products-page">
      <h1>Product Catalog</h1>
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductList initialProducts={products} />
      </Suspense>
    </div>
  );
}

// app/products/ProductList.tsx
'use client';

import { useState } from 'react';
import { useFilter } from '@mcabreradev/filter/react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

export default function ProductList({ 
  initialProducts 
}: { 
  initialProducts: Product[] 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // Client-side filtering
  const expression = {
    ...(searchTerm && { 
      $or: [
        { name: { $contains: searchTerm } },
        { category: { $contains: searchTerm } }
      ]
    }),
    ...(category && { category }),
    price: { $gte: priceRange[0], $lte: priceRange[1] },
    ...(showInStockOnly && { inStock: true })
  };

  const { filtered, isFiltering } = useFilter(
    initialProducts,
    expression,
    { 
      orderBy: 'name',
      enableCache: true 
    }
  );

  return (
    <div className="product-list">
      <div className="filters-panel">
        <input
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
        </select>

        <div className="price-range">
          <label>Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
          <input
            type="range"
            min="0"
            max="10000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          />
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={showInStockOnly}
            onChange={(e) => setShowInStockOnly(e.target.checked)}
          />
          In Stock Only
        </label>

        <div className="filter-stats">
          {isFiltering ? 'Filtering...' : `${filtered.length} products found`}
        </div>
      </div>

      <div className="products-grid">
        {filtered.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="category">{product.category}</p>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="stock">
              {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
            </p>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="no-results">
            <p>No products match your filters</p>
            <button onClick={() => {
              setSearchTerm('');
              setCategory('');
              setPriceRange([0, 10000]);
              setShowInStockOnly(false);
            }}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// app/products/loading.tsx
export default function Loading() {
  return (
    <div className="loading-skeleton">
      <div className="skeleton-filters" />
      <div className="skeleton-grid">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="skeleton-card" />
        ))}
      </div>
    </div>
  );
}
```

## Next Steps

- [Vue Integration](./vue.md)
- [Svelte Integration](./svelte.md)
- [API Reference](../api/reference.md)
- [Examples](../examples/)
