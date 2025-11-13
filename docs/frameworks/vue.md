---
title: Vue Integration
description: Vue Composables for filtering with @mcabreradev/filter
---

# Vue Integration

Complete guide for using `@mcabreradev/filter` with Vue 3.

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
} from '@mcabreradev/filter/vue';
```

## Available Composables

- [`useFilter`](#usefilter) - Basic filtering with reactive computed properties
- [`useFilteredState`](#usefilteredstate) - Filtering with reactive state management
- [`useDebouncedFilter`](#usedebouncedfilter) - Debounced filtering for search
- [`usePaginatedFilter`](#usepaginatedfilter) - Filtering with pagination

## useFilter

Basic filtering composable with reactive computed properties.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useFilter } from '@mcabreradev/filter/vue';

interface User {
  id: number;
  name: string;
  active: boolean;
}

const users = ref<User[]>([
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
]);

const { filtered, isFiltering } = useFilter(
  users,
  { active: true }
);
</script>

<template>
  <div>
    <p>Showing {{ filtered.length }} active users</p>
    <div v-for="user in filtered" :key="user.id">
      {{ user.name }}
    </div>
  </div>
</template>
```

### API Reference

```typescript
function useFilter<T>(
  data: MaybeRefOrGetter<T[]>,
  expression: MaybeRefOrGetter<Expression<T> | null>,
  options?: MaybeRefOrGetter<FilterOptions>
): UseFilterResult<T>

interface UseFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
}
```

## useFilteredState

Filtering with reactive state management.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useFilteredState } from '@mcabreradev/filter/vue';

const products = ref([
  { id: 1, name: 'Laptop', price: 1000, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 25, category: 'Electronics' },
]);

const { filtered, expression, setExpression } = useFilteredState(
  products,
  { category: 'Electronics' }
);

const applyFilter = () => {
  setExpression({ price: { $lt: 500 } });
};
</script>

<template>
  <div>
    <button @click="applyFilter">Under $500</button>
    <div>Found {{ filtered.length }} products</div>
  </div>
</template>
```

### API Reference

```typescript
function useFilteredState<T>(
  data: MaybeRefOrGetter<T[]>,
  initialExpression: Expression<T> | null,
  options?: MaybeRefOrGetter<FilterOptions>
): UseFilteredStateResult<T>

interface UseFilteredStateResult<T> {
  filtered: ComputedRef<T[]>;
  expression: Ref<Expression<T> | null>;
  setExpression: (expression: Expression<T> | null) => void;
  isFiltering: ComputedRef<boolean>;
}
```

## useDebouncedFilter

Debounced filtering for search inputs.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useDebouncedFilter } from '@mcabreradev/filter/vue';

const searchTerm = ref('');
const users = ref([
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
]);

const { filtered, isPending } = useDebouncedFilter(
  users,
  () => ({ name: { $contains: searchTerm.value } }),
  { delay: 300 }
);
</script>

<template>
  <div>
    <input
      v-model="searchTerm"
      placeholder="Search users..."
    />
    <span v-if="isPending">Searching...</span>
    <div>Found {{ filtered.length }} users</div>
  </div>
</template>
```

### API Reference

```typescript
function useDebouncedFilter<T>(
  data: MaybeRefOrGetter<T[]>,
  expression: MaybeRefOrGetter<Expression<T> | null>,
  options?: UseDebouncedFilterOptions
): UseDebouncedFilterResult<T>

interface UseDebouncedFilterOptions extends FilterOptions {
  delay?: number; // Default: 300ms
}

interface UseDebouncedFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isPending: Ref<boolean>;
}
```

## usePaginatedFilter

Filtering with built-in pagination.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { usePaginatedFilter } from '@mcabreradev/filter/vue';

const products = ref(
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

<template>
  <div>
    <div v-for="product in paginatedResults" :key="product.id">
      {{ product.name }} - ${{ product.price }}
    </div>
    <div>
      <button @click="prevPage" :disabled="currentPage === 1">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>
  </div>
</template>
```

### API Reference

```typescript
function usePaginatedFilter<T>(
  data: MaybeRefOrGetter<T[]>,
  expression: MaybeRefOrGetter<Expression<T> | null>,
  options?: {
    pageSize?: number;
    initialPage?: number;
    filterOptions?: FilterOptions;
  }
): UsePaginatedFilterResult<T>

interface UsePaginatedFilterResult<T> {
  paginatedResults: ComputedRef<T[]>;
  currentPage: Ref<number>;
  totalPages: ComputedRef<number>;
  totalItems: ComputedRef<number>;
  pageSize: Ref<number>;
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
// filtered is typed as ComputedRef<Product[]>
```

## SSR Support

All composables work with Nuxt 3 and SSR:

```vue
<script setup lang="ts">
import { useFilter } from '@mcabreradev/filter/vue';

const { data: products } = await useFetch('/api/products');
const { filtered } = useFilter(products, { inStock: true });
</script>
```

## Next Steps

- [React Integration](./react.md)
- [Svelte Integration](./svelte.md)
- [Nuxt Integration](./nuxt.md)
- [API Reference](../api/reference.md)

