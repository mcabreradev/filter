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

## Next Steps

- [Vue Integration](./vue.md)
- [Svelte Integration](./svelte.md)
- [API Reference](../api/reference.md)
- [Examples](../examples/)
