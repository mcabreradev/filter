---
title: Svelte Integration
description: Svelte Stores for filtering with @mcabreradev/filter
---

# Svelte Integration

Complete guide for using `@mcabreradev/filter` with Svelte.

## Installation

```bash
npm install @mcabreradev/filter
```

## Import

```typescript
import {
  useFilter,
  useFilteredState,
  useDebouncedFilter,
  usePaginatedFilter
} from '@mcabreradev/filter/svelte';
```

## Available Functions

- [`useFilter`](#usefilter) - Basic filtering with Svelte stores
- [`useFilteredState`](#usefilteredstate) - Filtering with writable state
- [`useDebouncedFilter`](#usedebouncedfilter) - Debounced filtering for search
- [`usePaginatedFilter`](#usepaginatedfilter) - Filtering with pagination

## useFilter

Basic filtering with Svelte stores.

```svelte
<script lang="ts">
import { writable } from 'svelte/store';
import { useFilter } from '@mcabreradev/filter/svelte';

interface User {
  id: number;
  name: string;
  active: boolean;
}

const users = writable<User[]>([
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
]);

const expression = writable({ active: true });
const { filtered, isFiltering } = useFilter(users, expression);
</script>

<div>
  <p>Showing {$filtered.length} active users</p>
  {#each $filtered as user (user.id)}
    <div>{user.name}</div>
  {/each}
</div>
```

### API Reference

```typescript
function useFilter<T>(
  data: Readable<T[]> | T[],
  expression: Readable<Expression<T> | null> | Expression<T> | null,
  options?: FilterOptions
): UseFilterResult<T>

interface UseFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
}
```

## useFilteredState

Filtering with writable state management.

```svelte
<script lang="ts">
import { writable } from 'svelte/store';
import { useFilteredState } from '@mcabreradev/filter/svelte';

const products = writable([
  { id: 1, name: 'Laptop', price: 1000, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 25, category: 'Electronics' },
]);

const { filtered, expression, setExpression } = useFilteredState(
  products,
  { category: 'Electronics' }
);

function applyFilter() {
  setExpression({ price: { $lt: 500 } });
}
</script>

<div>
  <button on:click={applyFilter}>Under $500</button>
  <div>Found {$filtered.length} products</div>
</div>
```

### API Reference

```typescript
function useFilteredState<T>(
  data: Readable<T[]> | T[],
  initialExpression: Expression<T> | null,
  options?: FilterOptions
): UseFilteredStateResult<T>

interface UseFilteredStateResult<T> {
  filtered: Readable<T[]>;
  expression: Writable<Expression<T> | null>;
  setExpression: (expression: Expression<T> | null) => void;
  isFiltering: Readable<boolean>;
}
```

## useDebouncedFilter

Debounced filtering for search inputs.

```svelte
<script lang="ts">
import { writable } from 'svelte/store';
import { useDebouncedFilter } from '@mcabreradev/filter/svelte';

let searchTerm = '';
const users = writable([
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
]);

$: expression = { name: { $contains: searchTerm } };
const { filtered, isPending } = useDebouncedFilter(
  users,
  () => expression,
  { delay: 300 }
);
</script>

<div>
  <input
    bind:value={searchTerm}
    placeholder="Search users..."
  />
  {#if $isPending}
    <span>Searching...</span>
  {/if}
  <div>Found {$filtered.length} users</div>
</div>
```

### API Reference

```typescript
function useDebouncedFilter<T>(
  data: Readable<T[]> | T[],
  expression: (() => Expression<T> | null) | Readable<Expression<T> | null> | Expression<T> | null,
  options?: UseDebouncedFilterOptions
): UseDebouncedFilterResult<T>

interface UseDebouncedFilterOptions extends FilterOptions {
  delay?: number; // Default: 300ms
}

interface UseDebouncedFilterResult<T> {
  filtered: Readable<T[]>;
  isPending: Readable<boolean>;
}
```

## usePaginatedFilter

Filtering with built-in pagination.

```svelte
<script lang="ts">
import { writable } from 'svelte/store';
import { usePaginatedFilter } from '@mcabreradev/filter/svelte';

const products = writable(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: Math.random() * 1000,
  }))
);

const {
  paginatedResults,
  currentPage,
  totalPages,
  nextPage,
  prevPage,
} = usePaginatedFilter(
  products,
  { price: { $gte: 100 } },
  { pageSize: 10, initialPage: 1 }
);
</script>

<div>
  {#each $paginatedResults as product (product.id)}
    <div>{product.name} - ${product.price}</div>
  {/each}
  <div>
    <button on:click={prevPage} disabled={$currentPage === 1}>
      Previous
    </button>
    <span>Page {$currentPage} of {$totalPages}</span>
    <button on:click={nextPage} disabled={$currentPage === $totalPages}>
      Next
    </button>
  </div>
</div>
```

### API Reference

```typescript
function usePaginatedFilter<T>(
  data: Readable<T[]> | T[],
  expression: Readable<Expression<T> | null> | Expression<T> | null,
  options?: {
    pageSize?: number;
    initialPage?: number;
    filterOptions?: FilterOptions;
  }
): UsePaginatedFilterResult<T>

interface UsePaginatedFilterResult<T> {
  paginatedResults: Readable<T[]>;
  currentPage: Readable<number>;
  totalPages: Readable<number>;
  totalItems: Readable<number>;
  pageSize: Writable<number>;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
```

## TypeScript Support

Full type safety with generics:

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

const { filtered } = useFilter<Product>(
  products,
  { price: { $gte: 100 } }
);
// filtered is typed as Readable<Product[]>
```

## SSR Support

Works with SvelteKit:

```svelte
<script lang="ts">
import { useFilter } from '@mcabreradev/filter/svelte';
import { writable } from 'svelte/store';

export let data;

const products = writable(data.products);
const { filtered } = useFilter(products, { inStock: true });
</script>
```

## Next Steps

- [React Integration](./react.md)
- [Vue Integration](./vue.md)
- [SvelteKit Integration](./sveltekit.md)
- [API Reference](../api/reference.md)


