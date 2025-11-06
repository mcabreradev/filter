---
title: SolidJS Integration
description: SolidJS Hooks for filtering with @mcabreradev/filter
---

# SolidJS Integration

Complete guide for using `@mcabreradev/filter` with SolidJS.

## Installation

```bash
npm install @mcabreradev/filter solid-js
```

## Import

```typescript
import { useFilter } from '@mcabreradev/filter/solidjs';
```

## Available Hooks

- `useFilter` - Basic filtering with reactive signals
- `useDebouncedFilter` - Debounced filtering for search
- `usePaginatedFilter` - Filtering with pagination

## useFilter

Basic filtering with SolidJS signals.

### Basic Usage

```tsx
import { createSignal, For, Show } from 'solid-js';
import { useFilter } from '@mcabreradev/filter/solidjs';

interface User {
  id: number;
  name: string;
  active: boolean;
}

function UserList() {
  const [users] = createSignal<User[]>([
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false },
  ]);

  const { filtered, isFiltering } = useFilter(
    users,
    () => ({ active: true })
  );

  return (
    <div>
      <Show when={isFiltering()}>
        <span>Filtering...</span>
      </Show>
      
      <For each={filtered()}>
        {(user) => (
          <div class="user-card">
            <h3>{user.name}</h3>
          </div>
        )}
      </For>
    </div>
  );
}
```

### Dynamic Filtering

```tsx
function SearchableList() {
  const [search, setSearch] = createSignal('');
  const [users] = createSignal<User[]>([...]);

  const { filtered } = useFilter(
    users,
    () => search() ? { name: { $contains: search() } } : null
  );

  return (
    <div>
      <input
        value={search()}
        onInput={(e) => setSearch(e.currentTarget.value)}
        placeholder="Search..."
      />
      
      <For each={filtered()}>
        {(user) => <div>{user.name}</div>}
      </For>
    </div>
  );
}
```

### API Reference

```typescript
function useFilter<T>(
  data: Accessor<T[]>,
  expression: Accessor<Expression<T> | null>,
  options?: Accessor<FilterOptions>
): {
  filtered: Accessor<T[]>;
  isFiltering: Accessor<boolean>;
}
```

## useDebouncedFilter

Debounced filtering for search inputs.

### Usage

```tsx
import { createSignal, For, Show } from 'solid-js';
import { useDebouncedFilter } from '@mcabreradev/filter/solidjs';

function SearchUsers() {
  const [search, setSearch] = createSignal('');
  const [users] = createSignal<User[]>([...]);

  const { filtered, isPending } = useDebouncedFilter(
    users,
    () => ({ name: { $contains: search() } }),
    { delay: 300 }
  );

  return (
    <div>
      <input
        value={search()}
        onInput={(e) => setSearch(e.currentTarget.value)}
        placeholder="Search users..."
      />
      
      <Show when={isPending()}>
        <span>Loading...</span>
      </Show>
      
      <For each={filtered()}>
        {(user) => <div>{user.name}</div>}
      </For>
    </div>
  );
}
```

### API Reference

```typescript
function useDebouncedFilter<T>(
  data: Accessor<T[]>,
  expression: Accessor<Expression<T>>,
  options?: {
    delay?: number;
    filterOptions?: FilterOptions;
  }
): {
  filtered: Accessor<T[]>;
  isPending: Accessor<boolean>;
}
```

## usePaginatedFilter

Filtering with pagination support.

### Usage

```tsx
import { createSignal, For } from 'solid-js';
import { usePaginatedFilter } from '@mcabreradev/filter/solidjs';

function PaginatedUsers() {
  const [users] = createSignal<User[]>([...]);

  const {
    paginatedResults,
    currentPage,
    totalPages,
    nextPage,
    prevPage
  } = usePaginatedFilter(
    users,
    () => ({ active: true }),
    { pageSize: 10 }
  );

  return (
    <div>
      <For each={paginatedResults()}>
        {(user) => <div>{user.name}</div>}
      </For>
      
      <div class="pagination">
        <button onClick={prevPage} disabled={currentPage() === 1}>
          Previous
        </button>
        <span>{currentPage()} / {totalPages()}</span>
        <button onClick={nextPage} disabled={currentPage() === totalPages()}>
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
  data: Accessor<T[]>,
  expression: Accessor<Expression<T> | null>,
  options?: {
    pageSize?: number;
    initialPage?: number;
    filterOptions?: FilterOptions;
  }
): {
  paginatedResults: Accessor<T[]>;
  currentPage: Accessor<number>;
  totalPages: Accessor<number>;
  pageSize: Accessor<number>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}
```

## TypeScript Support

Full type safety with SolidJS:

```tsx
interface Product {
  id: number;
  name: string;
  price: number;
}

function Products() {
  const [products] = createSignal<Product[]>([...]);

  const { filtered } = useFilter(
    products,
    () => ({ price: { $gte: 100 } }) // ✅ Type-safe
  );

  return <For each={filtered()}>{(p) => <div>{p.name}</div>}</For>;
}
```

## Best Practices

1. **Use Accessors** - Always pass signals as accessors: `() => value`
2. **Memoization** - SolidJS automatically memos filtered results
3. **Debounce Search** - Use `useDebouncedFilter` for better UX
4. **Type Safety** - Leverage TypeScript generics for autocomplete

## Examples

See [SolidJS Examples](https://github.com/mcabreradev/filter/tree/main/examples/solidjs) for more examples.
