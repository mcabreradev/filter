---
title: Svelte Integration
description: Svelte Stores for filtering with @mcabreradev/filter
---

# Svelte Integration

Complete guide for using `@mcabreradev/filter` with Svelte.

## Installation

```bash
npm install @mcabreradev/filter svelte
```

## Available Stores

- `useFilter` - Basic filtering with reactive stores
- `useFilteredState` - Filtering with writable store management
- `useDebouncedFilter` - Debounced filtering for search inputs
- `usePaginatedFilter` - Filtering with pagination support

## useFilter

Basic filtering with reactive stores.

```svelte
<script lang="ts">
import { useFilter } from '@mcabreradev/filter';

interface User {
  id: number;
  name: string;
  active: boolean;
}

const users: User[] = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
];

const { filtered, isFiltering } = useFilter(users, { active: true });
</script>

<div>
  <p>Showing {$filtered.length} active users</p>
  {#each $filtered as user (user.id)}
    <div>{user.name}</div>
  {/each}
</div>
```

## useFilteredState

Filtering with writable store management.

```svelte
<script lang="ts">
import { useFilteredState } from '@mcabreradev/filter';

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
</script>

<div>
  <input
    value={$expression}
    on:input={(e) => setExpression(e.target.value)}
    placeholder="Search users..."
  />
  {#each $filtered as user (user.id)}
    <div>{user.name} - {user.email}</div>
  {/each}
</div>
```

## useDebouncedFilter

Debounced filtering for search inputs.

```svelte
<script lang="ts">
import { writable } from 'svelte/store';
import { useDebouncedFilter } from '@mcabreradev/filter';

const search = writable('');
const users = [...];

const { filtered, isPending } = useDebouncedFilter(
  users,
  search,
  { delay: 300 }
);
</script>

<div>
  <input
    bind:value={$search}
    placeholder="Search..."
  />
  {#if $isPending}
    <span>Searching...</span>
  {/if}
  {#each $filtered as user (user.id)}
    <div>{user.name}</div>
  {/each}
</div>
```

## usePaginatedFilter

Filtering with pagination support.

### API Reference

```typescript
interface UsePaginatedFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
  pagination: Readable<PaginationResult<T>>;
  currentPage: Writable<number>;
  pageSize: Writable<number>;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
```

### Basic Usage

```svelte
<script lang="ts">
import { usePaginatedFilter } from '@mcabreradev/filter';

const users = [...];

const {
  filtered,
  isFiltering,
  pagination,
  currentPage,
  pageSize,
  nextPage,
  previousPage,
  goToPage,
  setPageSize,
} = usePaginatedFilter(users, { active: true }, 10);
</script>

<div>
  <p>Page {$currentPage} of {$pagination.totalPages}</p>
  <p>Showing {$pagination.data.length} of {$filtered.length} results</p>

  {#each $pagination.data as user (user.id)}
    <div>{user.name}</div>
  {/each}

  <div class="pagination">
    <button on:click={previousPage} disabled={!$pagination.hasPreviousPage}>
      Previous
    </button>
    <span>Page {$currentPage} of {$pagination.totalPages}</span>
    <button on:click={nextPage} disabled={!$pagination.hasNextPage}>
      Next
    </button>
  </div>

  <select bind:value={$pageSize} on:change={() => setPageSize($pageSize)}>
    <option value={10}>10 per page</option>
    <option value={25}>25 per page</option>
    <option value={50}>50 per page</option>
  </select>
</div>
```

## TypeScript Support

All stores are fully typed with generics:

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

All stores work with SvelteKit:

```svelte
<script lang="ts">
import { useFilter } from '@mcabreradev/filter';

const { filtered } = useFilter(data, expression);
</script>
```

## Complete Example

```svelte
<script lang="ts">
import { writable, derived } from 'svelte/store';
import { usePaginatedFilter } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
}

export let products: Product[];

const search = writable('');
const category = writable('all');
const minPrice = writable(0);

const expression = derived(
  [search, category, minPrice],
  ([$search, $category, $minPrice]) => {
    const expr: any = {};

    if ($search) {
      expr.name = { $contains: $search };
    }

    if ($category !== 'all') {
      expr.category = $category;
    }

    if ($minPrice > 0) {
      expr.price = { $gte: $minPrice };
    }

    return expr;
  }
);

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
</script>

<div>
  <div class="filters">
    <input
      bind:value={$search}
      type="text"
      placeholder="Search products..."
    />
    <select bind:value={$category}>
      <option value="all">All Categories</option>
      <option value="Electronics">Electronics</option>
      <option value="Clothing">Clothing</option>
    </select>
    <input
      bind:value={$minPrice}
      type="number"
      placeholder="Min price"
    />
  </div>

  <div class="products">
    {#each $filtered as product (product.id)}
      <div class="product-card">
        <h3>{product.name}</h3>
        <p>${product.price}</p>
        <p>Rating: {product.rating}/5</p>
      </div>
    {/each}
  </div>

  <div class="pagination">
    <button on:click={prevPage} disabled={!$hasPrevPage}>
      Previous
    </button>
    <span>Page {$currentPage} of {$totalPages}</span>
    <button on:click={nextPage} disabled={!$hasNextPage}>
      Next
    </button>
  </div>
</div>

<style>
  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .products {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .product-card {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
  }
</style>
```

## Next Steps

- [React Integration](/frameworks/react)
- [Vue Integration](/frameworks/vue)
- [Operators Guide](/guide/operators)
- [Performance Tips](/performance)

