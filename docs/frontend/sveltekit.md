# SvelteKit Integration

Guide for using @mcabreradev/filter with SvelteKit.

## Overview

@mcabreradev/filter integrates seamlessly with SvelteKit, supporting both client-side and server-side filtering with Svelte stores.

## Installation

```bash
npm install @mcabreradev/filter
pnpm add @mcabreradev/filter
yarn add @mcabreradev/filter
```

## Basic Usage

### Client-Side Filtering

```svelte
<script lang="ts">
  import { writable } from 'svelte/store';
  import { useFilter } from '@mcabreradev/filter/svelte';

  interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
  }

  const products = writable<Product[]>([]);
  let category = '';

  $: expression = {
    category: { $eq: category }
  };

  const { filtered, isFiltering } = useFilter(products, expression);
</script>

<select bind:value={category}>
  <option value="">All Categories</option>
  <option value="electronics">Electronics</option>
  <option value="clothing">Clothing</option>
</select>

{#if $isFiltering}
  <div>Loading...</div>
{:else}
  <div>
    {#each $filtered as product (product.id)}
      <div>{product.name}</div>
    {/each}
  </div>
{/if}
```

## Server-Side Rendering

### Using `load` Function

```typescript
import { filter } from '@mcabreradev/filter';
import type { PageLoad } from './$types';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export const load: PageLoad = async ({ url, fetch }) => {
  const category = url.searchParams.get('category') || '';
  const minPrice = Number(url.searchParams.get('minPrice')) || 0;

  const response = await fetch('/api/products');
  const products: Product[] = await response.json();

  const expression = {
    $and: [
      category && { category: { $eq: category } },
      minPrice > 0 && { price: { $gte: minPrice } }
    ].filter(Boolean)
  };

  return {
    products: filter(products, expression)
  };
};
```

```svelte
<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h1>Products</h1>
<div>
  {#each data.products as product (product.id)}
    <div>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </div>
  {/each}
</div>
```

### Server Load Function

```typescript
import { filter } from '@mcabreradev/filter';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const category = url.searchParams.get('category') || '';

  const products = await getProducts();

  const expression = {
    category: { $eq: category }
  };

  return {
    products: filter(products, expression)
  };
};
```

## API Routes

### GET Endpoint

```typescript
import { json } from '@sveltejs/kit';
import { filter } from '@mcabreradev/filter';
import type { RequestHandler } from './$types';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export const GET: RequestHandler = async ({ url }) => {
  const category = url.searchParams.get('category');
  const minPrice = url.searchParams.get('minPrice');

  const products: Product[] = await getProducts();

  const expression = {
    $and: [
      category && { category: { $eq: category } },
      minPrice && { price: { $gte: Number(minPrice) } }
    ].filter(Boolean)
  };

  const filtered = filter(products, expression);

  return json({ products: filtered });
};
```

### POST Endpoint

```typescript
import { json } from '@sveltejs/kit';
import { filter } from '@mcabreradev/filter';
import type { RequestHandler } from './$types';
import type { Expression } from '@mcabreradev/filter';

export const POST: RequestHandler = async ({ request }) => {
  const { expression } = await request.json() as { expression: Expression<Product> };

  const products = await getProducts();
  const filtered = filter(products, expression);

  return json({
    products: filtered,
    total: filtered.length
  });
};
```

## Advanced Patterns

### Search with Pagination

```svelte
<script lang="ts">
  import { writable } from 'svelte/store';
  import { usePaginatedFilter } from '@mcabreradev/filter/svelte';

  const products = writable<Product[]>([]);
  let searchTerm = '';
  let category = '';

  $: expression = {
    $and: [
      searchTerm && {
        name: { $regex: new RegExp(searchTerm, 'i') }
      },
      category && {
        category: { $eq: category }
      }
    ].filter(Boolean)
  };

  const {
    filtered,
    currentPage,
    totalPages,
    nextPage,
    previousPage
  } = usePaginatedFilter(products, expression, 20);
</script>

<input
  bind:value={searchTerm}
  placeholder="Search..."
/>
<select bind:value={category}>
  <option value="">All Categories</option>
  <option value="electronics">Electronics</option>
</select>

<div>
  {#each $filtered as product (product.id)}
    <div>{product.name}</div>
  {/each}
</div>

<div>
  <button on:click={previousPage} disabled={$currentPage === 1}>
    Previous
  </button>
  <span>Page {$currentPage} of {$totalPages}</span>
  <button on:click={nextPage} disabled={$currentPage === $totalPages}>
    Next
  </button>
</div>
```

### Debounced Search

```svelte
<script lang="ts">
  import { writable } from 'svelte/store';
  import { useDebouncedFilter } from '@mcabreradev/filter/svelte';

  const products = writable<Product[]>([]);
  let searchTerm = '';

  $: expression = {
    name: { $regex: new RegExp(searchTerm, 'i') }
  };

  const { filtered, isPending } = useDebouncedFilter(products, expression, {
    delay: 300
  });
</script>

<input
  bind:value={searchTerm}
  placeholder="Search..."
/>
{#if $isPending}
  <span>Searching...</span>
{/if}

<div>
  {#each $filtered as product (product.id)}
    <div>{product.name}</div>
  {/each}
</div>
```

### URL Query Parameters

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import { useFilter } from '@mcabreradev/filter/svelte';

  const products = writable<Product[]>([]);

  $: category = $page.url.searchParams.get('category') || '';
  $: minPrice = Number($page.url.searchParams.get('minPrice')) || 0;

  $: expression = {
    $and: [
      category && { category: { $eq: category } },
      minPrice > 0 && { price: { $gte: minPrice } }
    ].filter(Boolean)
  };

  const { filtered } = useFilter(products, expression);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams($page.url.searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    goto(`?${params.toString()}`);
  }
</script>

<select
  value={category}
  on:change={(e) => updateFilter('category', e.target.value)}
>
  <option value="">All Categories</option>
  <option value="electronics">Electronics</option>
</select>

<input
  type="number"
  value={minPrice}
  on:input={(e) => updateFilter('minPrice', e.target.value)}
  placeholder="Min price"
/>

<div>
  {#each $filtered as product (product.id)}
    <div>{product.name}</div>
  {/each}
</div>
```

### Custom Store Pattern

Create a reusable store:

```typescript
import { derived, writable, type Readable, type Writable } from 'svelte/store';
import { filter } from '@mcabreradev/filter';
import type { Expression } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface ProductFilters {
  searchTerm: string;
  category: string;
  minPrice: number;
  maxPrice: number;
}

export function createProductFilterStore(initialProducts: Product[] = []) {
  const products: Writable<Product[]> = writable(initialProducts);
  const filters: Writable<ProductFilters> = writable({
    searchTerm: '',
    category: '',
    minPrice: 0,
    maxPrice: 0
  });

  const filtered: Readable<Product[]> = derived(
    [products, filters],
    ([$products, $filters]) => {
      const conditions = [];

      if ($filters.searchTerm) {
        conditions.push({
          name: { $regex: new RegExp($filters.searchTerm, 'i') }
        });
      }

      if ($filters.category) {
        conditions.push({
          category: { $eq: $filters.category }
        });
      }

      if ($filters.minPrice > 0) {
        conditions.push({
          price: { $gte: $filters.minPrice }
        });
      }

      if ($filters.maxPrice > 0) {
        conditions.push({
          price: { $lte: $filters.maxPrice }
        });
      }

      const expression: Expression<Product> =
        conditions.length > 0 ? { $and: conditions } : {};

      return filter($products, expression);
    }
  );

  return {
    products,
    filters,
    filtered,
    setProducts: (newProducts: Product[]) => products.set(newProducts),
    updateFilters: (newFilters: Partial<ProductFilters>) =>
      filters.update(f => ({ ...f, ...newFilters })),
    resetFilters: () => filters.set({
      searchTerm: '',
      category: '',
      minPrice: 0,
      maxPrice: 0
    })
  };
}
```

Usage:

```svelte
<script lang="ts">
  import { createProductFilterStore } from '$lib/stores/productFilter';

  const store = createProductFilterStore([]);
  const { filters, filtered, updateFilters } = store;
</script>

<input
  value={$filters.searchTerm}
  on:input={(e) => updateFilters({ searchTerm: e.target.value })}
  placeholder="Search..."
/>

<select
  value={$filters.category}
  on:change={(e) => updateFilters({ category: e.target.value })}
>
  <option value="">All Categories</option>
  <option value="electronics">Electronics</option>
</select>

<div>
  {#each $filtered as product (product.id)}
    <div>{product.name}</div>
  {/each}
</div>
```

## Form Actions

### Using Form Actions

```typescript
import { fail } from '@sveltejs/kit';
import { filter } from '@mcabreradev/filter';
import type { Actions } from './$types';

export const actions: Actions = {
  filter: async ({ request }) => {
    const data = await request.formData();
    const category = data.get('category') as string;
    const minPrice = Number(data.get('minPrice'));

    const products = await getProducts();

    const expression = {
      $and: [
        category && { category: { $eq: category } },
        minPrice > 0 && { price: { $gte: minPrice } }
      ].filter(Boolean)
    };

    const filtered = filter(products, expression);

    return {
      products: filtered
    };
  }
};
```

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<form method="POST" action="?/filter" use:enhance>
  <select name="category">
    <option value="">All Categories</option>
    <option value="electronics">Electronics</option>
  </select>

  <input
    type="number"
    name="minPrice"
    placeholder="Min price"
  />

  <button type="submit">Filter</button>
</form>

{#if form?.products}
  <div>
    {#each form.products as product (product.id)}
      <div>{product.name}</div>
    {/each}
  </div>
{/if}
```

## Performance Tips

### 1. Use Reactive Statements

```typescript
$: expression = {
  status: { $eq: status }
};
```

### 2. Enable Memoization

```typescript
const { filtered } = useFilter(data, expression, {
  memoize: true
});
```

### 3. Use Server Load Functions

Filter data on the server when possible:

```typescript
export const load: PageServerLoad = async () => {
  const products = await getProducts();
  return {
    products: filter(products, expression)
  };
};
```

### 4. Implement Pagination

```typescript
const { filtered } = usePaginatedFilter(data, expression, 50);
```

## TypeScript Support

Ensure proper TypeScript configuration in `svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
};
```

And in `tsconfig.json`:

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## Related Resources

- [Svelte Integration](/frameworks/svelte)
- [Best Practices](/guide/best-practices)
- [Examples](/examples/basic-usage)
- [API Reference](/api/core)

