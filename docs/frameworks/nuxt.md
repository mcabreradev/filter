# Nuxt Integration

Guide for using @mcabreradev/filter with Nuxt 3.

## Overview

@mcabreradev/filter integrates seamlessly with Nuxt 3, supporting both client-side and server-side filtering with Vue 3 Composition API.

## Installation

```bash
# Using npm
npm install @mcabreradev/filter

# Using yarn
yarn add @mcabreradev/filter

# Using pnpm
pnpm add @mcabreradev/filter

## Basic Usage

### Client-Side Filtering

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFilter } from '@mcabreradev/filter/vue';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const products = ref<Product[]>([]);
const category = ref('');

const expression = computed(() => ({
  category: { $eq: category.value }
}));

const { filtered, isFiltering } = useFilter(products, expression);
</script>

<template>
  <div>
    <select v-model="category">
      <option value="">All Categories</option>
      <option value="electronics">Electronics</option>
      <option value="clothing">Clothing</option>
    </select>

    <div v-if="isFiltering">Loading...</div>
    <div v-else>
      <div v-for="product in filtered" :key="product.id">
        {{ product.name }}
      </div>
    </div>
  </div>
</template>
```

## Server-Side Rendering

### Using `useFetch`

```vue
<script setup lang="ts">
import { filter } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const route = useRoute();
const category = computed(() => route.query.category as string || '');
const minPrice = computed(() => Number(route.query.minPrice) || 0);

const { data: products } = await useFetch<Product[]>('/api/products');

const filtered = computed(() => {
  if (!products.value) return [];

  const expression = {
    $and: [
      category.value && { category: { $eq: category.value } },
      minPrice.value > 0 && { price: { $gte: minPrice.value } }
    ].filter(Boolean)
  };

  return filter(products.value, expression);
});
</script>

<template>
  <div>
    <h1>Products</h1>
    <div v-for="product in filtered" :key="product.id">
      <h2>{{ product.name }}</h2>
      <p>${{ product.price }}</p>
    </div>
  </div>
</template>
```

### Using `useAsyncData`

```vue
<script setup lang="ts">
import { filter } from '@mcabreradev/filter';

const route = useRoute();

const { data: filtered } = await useAsyncData(
  'filtered-products',
  async () => {
    const products = await $fetch<Product[]>('/api/products');

    const expression = {
      category: { $eq: route.query.category as string }
    };

    return filter(products, expression);
  },
  {
    watch: [() => route.query]
  }
);
</script>

<template>
  <div>
    <div v-for="product in filtered" :key="product.id">
      {{ product.name }}
    </div>
  </div>
</template>
```

## Server API Routes

### Basic API Route

```typescript
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { category, minPrice } = query;

  const products = await getProducts();

  const expression = {
    $and: [
      category && { category: { $eq: category as string } },
      minPrice && { price: { $gte: Number(minPrice) } }
    ].filter(Boolean)
  };

  return filter(products, expression);
});
```

### POST API Route

```typescript
import { filter } from '@mcabreradev/filter';
import type { Expression } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { expression } = body as { expression: Expression<Product> };

  const products = await getProducts();

  return {
    products: filter(products, expression),
    total: products.length
  };
});
```

## Advanced Patterns

### Search with Pagination

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePaginatedFilter } from '@mcabreradev/filter/vue';

const products = ref<Product[]>([]);
const searchTerm = ref('');
const category = ref('');

const expression = computed(() => {
  const conditions = [];

  if (searchTerm.value) {
    conditions.push({
      name: { $regex: new RegExp(searchTerm.value, 'i') }
    });
  }

  if (category.value) {
    conditions.push({
      category: { $eq: category.value }
    });
  }

  return conditions.length > 0 ? { $and: conditions } : {};
});

const {
  filtered,
  currentPage,
  totalPages,
  nextPage,
  previousPage
} = usePaginatedFilter(products, expression, 20);
</script>

<template>
  <div>
    <input
      v-model="searchTerm"
      placeholder="Search..."
    />
    <select v-model="category">
      <option value="">All Categories</option>
      <option value="electronics">Electronics</option>
    </select>

    <div>
      <div v-for="product in filtered" :key="product.id">
        {{ product.name }}
      </div>
    </div>

    <div>
      <button @click="previousPage" :disabled="currentPage === 1">
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

### Debounced Search

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDebouncedFilter } from '@mcabreradev/filter/vue';

const products = ref<Product[]>([]);
const searchTerm = ref('');

const expression = computed(() => ({
  name: { $regex: new RegExp(searchTerm.value, 'i') }
}));

const { filtered, isPending } = useDebouncedFilter(products, expression, {
  delay: 300
});
</script>

<template>
  <div>
    <input
      v-model="searchTerm"
      placeholder="Search..."
    />
    <span v-if="isPending">Searching...</span>

    <div>
      <div v-for="product in filtered" :key="product.id">
        {{ product.name }}
      </div>
    </div>
  </div>
</template>
```

### URL Query Parameters

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useFilter } from '@mcabreradev/filter/vue';

const route = useRoute();
const router = useRouter();

const products = ref<Product[]>([]);

const category = computed(() => route.query.category as string || '');
const minPrice = computed(() => Number(route.query.minPrice) || 0);

const expression = computed(() => ({
  $and: [
    category.value && { category: { $eq: category.value } },
    minPrice.value > 0 && { price: { $gte: minPrice.value } }
  ].filter(Boolean)
}));

const { filtered } = useFilter(products, expression);

const updateFilter = (key: string, value: string) => {
  router.push({
    query: {
      ...route.query,
      [key]: value || undefined
    }
  });
};
</script>

<template>
  <div>
    <select
      :value="category"
      @change="updateFilter('category', $event.target.value)"
    >
      <option value="">All Categories</option>
      <option value="electronics">Electronics</option>
    </select>

    <input
      type="number"
      :value="minPrice"
      @input="updateFilter('minPrice', $event.target.value)"
      placeholder="Min price"
    />

    <div>
      <div v-for="product in filtered" :key="product.id">
        {{ product.name }}
      </div>
    </div>
  </div>
</template>
```

### Composable Pattern

Create a reusable composable:

```typescript
import { computed, type Ref } from 'vue';
import { useFilter } from '@mcabreradev/filter/vue';
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

export function useProductFilter(
  products: Ref<Product[]>,
  filters: Ref<ProductFilters>
) {
  const expression = computed<Expression<Product>>(() => {
    const conditions = [];

    if (filters.value.searchTerm) {
      conditions.push({
        name: { $regex: new RegExp(filters.value.searchTerm, 'i') }
      });
    }

    if (filters.value.category) {
      conditions.push({
        category: { $eq: filters.value.category }
      });
    }

    if (filters.value.minPrice > 0) {
      conditions.push({
        price: { $gte: filters.value.minPrice }
      });
    }

    if (filters.value.maxPrice > 0) {
      conditions.push({
        price: { $lte: filters.value.maxPrice }
      });
    }

    return conditions.length > 0 ? { $and: conditions } : {};
  });

  return useFilter(products, expression, {
    memoize: true
  });
}
```

Usage:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useProductFilter } from '~/composables/useProductFilter';

const products = ref<Product[]>([]);
const filters = ref({
  searchTerm: '',
  category: '',
  minPrice: 0,
  maxPrice: 0
});

const { filtered, isFiltering } = useProductFilter(products, filters);
</script>

<template>
  <div>
    <input v-model="filters.searchTerm" placeholder="Search..." />
    <select v-model="filters.category">
      <option value="">All Categories</option>
      <option value="electronics">Electronics</option>
    </select>

    <div v-if="isFiltering">Loading...</div>
    <div v-else>
      <div v-for="product in filtered" :key="product.id">
        {{ product.name }}
      </div>
    </div>
  </div>
</template>
```

## Nuxt Module (Optional)

Create a custom Nuxt module for global configuration:

```typescript
import { defineNuxtModule } from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'filter',
    configKey: 'filter'
  },
  defaults: {
    memoize: true,
    caseSensitive: false
  },
  setup(options, nuxt) {
    nuxt.options.runtimeConfig.public.filter = options;
  }
});
```

## Performance Tips

### 1. Use Computed Properties

```typescript
const expression = computed(() => ({
  status: { $eq: status.value }
}));
```

### 2. Enable Memoization

```typescript
const { filtered } = useFilter(data, expression, {
  memoize: true
});
```

### 3. Use Server-Side Filtering

Filter data on the server when possible:

```typescript
const { data } = await useFetch('/api/filtered-products', {
  query: { category: 'electronics' }
});
```

### 4. Implement Pagination

```typescript
const { filtered } = usePaginatedFilter(data, expression, 50);
```

## TypeScript Support

Ensure proper TypeScript configuration in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: true
  }
});
```

## Related Resources

- [Vue Integration](/frameworks/vue)
- [Best Practices](/guide/best-practices)
- [Examples](/examples/basic-usage)
- [API Reference](/api/core)

