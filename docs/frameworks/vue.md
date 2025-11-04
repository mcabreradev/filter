---
title: Vue Integration
description: Vue Composables for filtering with @mcabreradev/filter
---

# Vue Integration

Complete guide for using `@mcabreradev/filter` with Vue 3.

## Installation

```bash
# Using npm
npm install @mcabreradev/filter

# Using yarn
yarn add @mcabreradev/filter

# Using pnpm
pnpm add @mcabreradev/filter

## Available Composables

- `useFilter` - Basic filtering with automatic reactivity
- `useFilteredState` - Filtering with reactive state management
- `useDebouncedFilter` - Debounced filtering for search inputs
- `usePaginatedFilter` - Filtering with pagination support

## useFilter

Basic filtering with automatic reactivity.

```vue
<script setup lang="ts">
import { ref } from 'vue';
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

<template>
  <div>
    <p>Showing {{ filtered.length }} active users</p>
    <div v-for="user in filtered" :key="user.id">
      {{ user.name }}
    </div>
  </div>
</template>
```

## useFilteredState

Filtering with reactive state management.

```vue
<script setup lang="ts">
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

<template>
  <div>
    <input
      :value="expression"
      @input="setExpression($event.target.value)"
      placeholder="Search users..."
    />
    <div v-for="user in filtered" :key="user.id">
      {{ user.name }} - {{ user.email }}
    </div>
  </div>
</template>
```

## useDebouncedFilter

Debounced filtering for search inputs.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useDebouncedFilter } from '@mcabreradev/filter';

const search = ref('');
const users = [...];

const { filtered, isPending } = useDebouncedFilter(
  users,
  search,
  { delay: 300 }
);
</script>

<template>
  <div>
    <input
      v-model="search"
      placeholder="Search..."
    />
    <span v-if="isPending">Searching...</span>
    <div v-for="user in filtered" :key="user.id">
      {{ user.name }}
    </div>
  </div>
</template>
```

## usePaginatedFilter

Filtering with pagination support.

### API Reference

```typescript
interface UsePaginatedFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
  pagination: ComputedRef<PaginationResult<T>>;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
```

### Basic Usage

```vue
<script setup lang="ts">
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

<template>
  <div>
    <p>Page {{ currentPage }} of {{ pagination.totalPages }}</p>
    <p>Showing {{ pagination.data.length }} of {{ filtered.length }} results</p>

    <div v-for="user in pagination.data" :key="user.id">
      {{ user.name }}
    </div>

    <div class="pagination">
      <button @click="previousPage" :disabled="!pagination.hasPreviousPage">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ pagination.totalPages }}</span>
      <button @click="nextPage" :disabled="!pagination.hasNextPage">
        Next
      </button>
    </div>

    <select v-model="pageSize" @change="setPageSize(Number($event.target.value))">
      <option :value="10">10 per page</option>
      <option :value="25">25 per page</option>
      <option :value="50">50 per page</option>
    </select>
  </div>
</template>
```

## TypeScript Support

All composables are fully typed with generics:

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

All composables work with Nuxt 3:

```vue
<script setup lang="ts">
import { useFilter } from '@mcabreradev/filter';

const { filtered } = useFilter(data, expression);
</script>
```

## Complete Example

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePaginatedFilter } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
}

const props = defineProps<{
  products: Product[];
}>();

const search = ref('');
const category = ref('all');
const minPrice = ref(0);

const expression = computed(() => {
  const expr: any = {};

  if (search.value) {
    expr.name = { $contains: search.value };
  }

  if (category.value !== 'all') {
    expr.category = category.value;
  }

  if (minPrice.value > 0) {
    expr.price = { $gte: minPrice.value };
  }

  return expr;
});

const {
  filtered,
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  hasNextPage,
  hasPrevPage,
} = usePaginatedFilter(props.products, expression, {
  initialPageSize: 12,
});
</script>

<template>
  <div>
    <div class="filters">
      <input
        v-model="search"
        type="text"
        placeholder="Search products..."
      />
      <select v-model="category">
        <option value="all">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
      </select>
      <input
        v-model.number="minPrice"
        type="number"
        placeholder="Min price"
      />
    </div>

    <div class="products">
      <div
        v-for="product in filtered"
        :key="product.id"
        class="product-card"
      >
        <h3>{{ product.name }}</h3>
        <p>${{ product.price }}</p>
        <p>Rating: {{ product.rating }}/5</p>
      </div>
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="!hasPrevPage">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="!hasNextPage">
        Next
      </button>
    </div>
  </div>
</template>
```

## Next Steps

- [React Integration](/frameworks/react)
- [Svelte Integration](/frameworks/svelte)
- [Operators Guide](/guide/operators)
- [Performance Tips](/performance)

