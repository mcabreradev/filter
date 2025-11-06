---
title: Preact Integration
description: Preact Hooks for filtering with @mcabreradev/filter
---

# Preact Integration

Complete guide for using `@mcabreradev/filter` with Preact.

## Installation

```bash
npm install @mcabreradev/filter preact
```

## Import

```typescript
import { useFilter } from '@mcabreradev/filter/preact';
```

::: tip Lightweight
Preact integration is only **~2KB** gzipped, making it perfect for performance-critical applications.
:::

## Available Hooks

- `useFilter` - Basic filtering with memoization
- `useFilteredState` - Filtering with state management
- `useDebouncedFilter` - Debounced filtering for search
- `usePaginatedFilter` - Filtering with pagination

## useFilter

Basic filtering with automatic memoization.

### Basic Usage

```tsx
import { h } from 'preact';
import { useFilter } from '@mcabreradev/filter/preact';

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
      {isFiltering && <span>Filtering...</span>}
      
      {filtered.map(user => (
        <div key={user.id} class="user-card">
          <h3>{user.name}</h3>
        </div>
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
): {
  filtered: T[];
  isFiltering: boolean;
}
```

## useFilteredState

Filtering with state management.

### Usage

```tsx
import { h } from 'preact';
import { useFilteredState } from '@mcabreradev/filter/preact';

function UserList() {
  const users: User[] = [...];

  const { filtered, expression, setExpression, reset } =
    useFilteredState(users, { active: true });

  return (
    <div>
      <button onClick={() => setExpression({ role: 'admin' })}>
        Admins Only
      </button>
      <button onClick={reset}>Reset</button>
      
      {filtered.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### API Reference

```typescript
function useFilteredState<T>(
  data: T[],
  initialExpression?: Expression<T>,
  options?: FilterOptions
): {
  filtered: T[];
  expression: Expression<T> | null;
  setExpression: (expr: Expression<T> | null) => void;
  reset: () => void;
}
```

## useDebouncedFilter

Debounced filtering for search inputs.

### Usage

```tsx
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useDebouncedFilter } from '@mcabreradev/filter/preact';

function SearchUsers() {
  const [search, setSearch] = useState('');
  const users: User[] = [...];

  const { filtered, isPending } = useDebouncedFilter(
    users,
    { name: { $contains: search } },
    { delay: 300 }
  );

  return (
    <div>
      <input
        value={search}
        onInput={(e) => setSearch(e.currentTarget.value)}
        placeholder="Search users..."
      />
      
      {isPending && <span>Loading...</span>}
      
      {filtered.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### API Reference

```typescript
function useDebouncedFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: {
    delay?: number;
    filterOptions?: FilterOptions;
  }
): {
  filtered: T[];
  isPending: boolean;
}
```

## usePaginatedFilter

Filtering with pagination support.

### Usage

```tsx
import { h } from 'preact';
import { usePaginatedFilter } from '@mcabreradev/filter/preact';

function PaginatedUsers() {
  const users: User[] = [...];

  const {
    paginatedResults,
    currentPage,
    totalPages,
    nextPage,
    prevPage
  } = usePaginatedFilter(users, { active: true }, { pageSize: 10 });

  return (
    <div>
      {paginatedResults.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      
      <div class="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{currentPage} / {totalPages}</span>
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
  options?: {
    pageSize?: number;
    initialPage?: number;
    filterOptions?: FilterOptions;
  }
): {
  paginatedResults: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}
```

## TypeScript Support

Full type safety with Preact:

```tsx
interface Product {
  id: number;
  name: string;
  price: number;
}

function Products() {
  const products: Product[] = [...];

  const { filtered } = useFilter(
    products,
    { price: { $gte: 100 } } // ✅ Type-safe
  );

  return (
    <div>
      {filtered.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
```

## Best Practices

1. **Memoization** - Hooks automatically memoize results
2. **Debounce Search** - Use `useDebouncedFilter` for inputs
3. **State Management** - Use `useFilteredState` for complex filters
4. **Type Safety** - Leverage TypeScript for better DX

## Examples

See [Preact Examples](https://github.com/mcabreradev/filter/tree/main/examples/preact) for more examples.
