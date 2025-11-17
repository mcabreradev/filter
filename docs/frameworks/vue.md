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

## Real-World Examples

### 1. Search with Debounce and Sorting

Advanced search interface with debounced input, multi-field filtering, and dynamic sorting.

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDebouncedFilter } from '@mcabreradev/filter/vue';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  inStock: boolean;
}

const props = defineProps<{
  products: Product[];
}>();

const searchTerm = ref('');
const category = ref('');
const maxPrice = ref(10000);
const sortBy = ref<'price' | 'rating'>('price');
const sortDir = ref<'asc' | 'desc'>('asc');

// Build dynamic expression
const expression = computed(() => ({
  ...(searchTerm.value && { name: { $contains: searchTerm.value } }),
  ...(category.value && { category: category.value }),
  price: { $lte: maxPrice.value },
  inStock: true
}));

const { filtered, isPending } = useDebouncedFilter(
  () => props.products,
  expression,
  {
    delay: 300,
    orderBy: computed(() => ({ 
      field: sortBy.value, 
      direction: sortDir.value 
    })),
    enableCache: true
  }
);

const toggleSortDirection = () => {
  sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
};
</script>

<template>
  <div class="product-search">
    <div class="filters">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search products..."
        class="search-input"
      />
      
      <select v-model="category">
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Books">Books</option>
        <option value="Clothing">Clothing</option>
      </select>

      <div class="price-filter">
        <label>Max Price: ${{ maxPrice }}</label>
        <input
          v-model.number="maxPrice"
          type="range"
          min="0"
          max="10000"
        />
      </div>

      <div class="sort-controls">
        <select v-model="sortBy">
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
        <button @click="toggleSortDirection">
          {{ sortDir === 'asc' ? '↑' : '↓' }}
        </button>
      </div>
    </div>

    <div v-if="isPending" class="loading">Searching...</div>

    <div class="results">
      <p>{{ filtered.length }} products found</p>
      <div class="product-grid">
        <div 
          v-for="product in filtered" 
          :key="product.id" 
          class="product-card"
        >
          <h3>{{ product.name }}</h3>
          <p class="category">{{ product.category }}</p>
          <p class="price">${{ product.price }}</p>
          <p class="rating">⭐ {{ product.rating }}/5</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-search {
  padding: 1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 0.5rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.product-card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}
</style>
```

### 2. Data Table with Sorting and Filtering

Sortable, filterable data table with column-based filtering and pagination.

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFilter } from '@mcabreradev/filter/vue';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: Date;
}

const props = defineProps<{
  users: User[];
}>();

const nameFilter = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
const sortField = ref<keyof User>('name');
const sortDirection = ref<'asc' | 'desc'>('asc');
const currentPage = ref(1);
const pageSize = 10;

// Build filter expression
const expression = computed(() => ({
  ...(nameFilter.value && { name: { $contains: nameFilter.value } }),
  ...(roleFilter.value && { role: roleFilter.value }),
  ...(statusFilter.value && { status: statusFilter.value as 'active' | 'inactive' })
}));

const { filtered } = useFilter(
  () => props.users,
  expression,
  {
    orderBy: computed(() => ({ 
      field: sortField.value, 
      direction: sortDirection.value 
    })),
    enableCache: true
  }
);

// Paginate results
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filtered.value.slice(start, start + pageSize);
});

const totalPages = computed(() => 
  Math.ceil(filtered.value.length / pageSize)
);

const handleSort = (field: keyof User) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
  currentPage.value = 1;
};

const getSortIcon = (field: keyof User) => {
  if (sortField.value !== field) return '↕️';
  return sortDirection.value === 'asc' ? '↑' : '↓';
};

const goToPage = (page: number) => {
  currentPage.value = Math.max(1, Math.min(page, totalPages.value));
};
</script>

<template>
  <div class="data-table">
    <div class="table-filters">
      <input
        v-model="nameFilter"
        type="text"
        placeholder="Filter by name..."
      />
      <select v-model="roleFilter">
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="moderator">Moderator</option>
      </select>
      <select v-model="statusFilter">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th @click="handleSort('name')">
            Name {{ getSortIcon('name') }}
          </th>
          <th @click="handleSort('email')">
            Email {{ getSortIcon('email') }}
          </th>
          <th @click="handleSort('role')">
            Role {{ getSortIcon('role') }}
          </th>
          <th @click="handleSort('status')">
            Status {{ getSortIcon('status') }}
          </th>
          <th @click="handleSort('lastLogin')">
            Last Login {{ getSortIcon('lastLogin') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedData" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <span :class="['status-badge', user.status]">
              {{ user.status }}
            </span>
          </td>
          <td>{{ new Date(user.lastLogin).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button 
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Previous
      </button>
      <span>
        Page {{ currentPage }} of {{ totalPages }} 
        ({{ filtered.length }} results)
      </span>
      <button 
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
.data-table {
  width: 100%;
}

.table-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  cursor: pointer;
  user-select: none;
  background: #f5f5f5;
  padding: 0.75rem;
  text-align: left;
}

td {
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
```

### 3. Infinite Scroll with Lazy Loading

Infinite scroll list using lazy evaluation for memory-efficient rendering.

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { filterLazy } from '@mcabreradev/filter';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: Date;
}

const props = defineProps<{
  posts: Post[];
}>();

const displayedPosts = ref<Post[]>([]);
const hasMore = ref(true);
const isLoading = ref(false);
const selectedTag = ref('');
const loadingTrigger = ref<HTMLDivElement | null>(null);

let iterator: Generator<Post, void, undefined> | null = null;
let observer: IntersectionObserver | null = null;

const initializeIterator = () => {
  const expression = selectedTag.value 
    ? { tags: { $contains: selectedTag.value } } 
    : {};
  iterator = filterLazy(props.posts, expression);
  displayedPosts.value = [];
  hasMore.value = true;
  loadMore();
};

const loadMore = () => {
  if (!iterator || isLoading.value) return;

  isLoading.value = true;
  
  // Load 20 items at a time
  const newPosts: Post[] = [];
  for (let i = 0; i < 20; i++) {
    const result = iterator.next();
    if (result.done) {
      hasMore.value = false;
      break;
    }
    newPosts.push(result.value);
  }

  displayedPosts.value = [...displayedPosts.value, ...newPosts];
  isLoading.value = false;
};

onMounted(() => {
  initializeIterator();

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !isLoading.value) {
        loadMore();
      }
    },
    { threshold: 0.1 }
  );

  if (loadingTrigger.value) {
    observer.observe(loadingTrigger.value);
  }
});

onUnmounted(() => {
  if (observer && loadingTrigger.value) {
    observer.unobserve(loadingTrigger.value);
  }
});

const changeTag = (tag: string) => {
  selectedTag.value = tag;
  initializeIterator();
};
</script>

<template>
  <div class="infinite-list">
    <div class="filter-bar">
      <select :value="selectedTag" @change="changeTag($event.target.value)">
        <option value="">All Tags</option>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="vue">Vue</option>
      </select>
    </div>

    <div class="post-list">
      <article 
        v-for="post in displayedPosts" 
        :key="post.id" 
        class="post-card"
      >
        <h2>{{ post.title }}</h2>
        <p class="author">By {{ post.author }}</p>
        <p class="content">{{ post.content }}</p>
        <div class="tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
        <time>{{ new Date(post.createdAt).toLocaleDateString() }}</time>
      </article>
    </div>

    <div 
      v-if="hasMore" 
      ref="loadingTrigger" 
      class="loading-trigger"
    >
      {{ isLoading ? 'Loading more posts...' : 'Scroll for more' }}
    </div>

    <div v-if="!hasMore" class="end-message">
      No more posts to load ({{ displayedPosts.length }} total)
    </div>
  </div>
</template>

<style scoped>
.infinite-list {
  max-width: 800px;
  margin: 0 auto;
}

.filter-bar {
  margin-bottom: 1rem;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-card {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.tag {
  padding: 0.25rem 0.5rem;
  background: #e0e0e0;
  border-radius: 4px;
  font-size: 0.875rem;
}

.loading-trigger,
.end-message {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
```

### 4. Pinia Store Integration

Integration with Pinia for global state management with filtering.

```typescript
// stores/filter.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Expression } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

export const useFilterStore = defineStore('filter', () => {
  const expression = ref<Expression<Product>>({});
  const sortBy = ref<string>('name');
  const sortDirection = ref<'asc' | 'desc'>('asc');
  const enableCache = ref(true);

  const setExpression = (newExpression: Expression<Product>) => {
    expression.value = newExpression;
  };

  const setSortBy = (field: string) => {
    sortBy.value = field;
  };

  const toggleSortDirection = () => {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  };

  const resetFilters = () => {
    expression.value = {};
    sortBy.value = 'name';
    sortDirection.value = 'asc';
  };

  const filterOptions = computed(() => ({
    orderBy: { field: sortBy.value, direction: sortDirection.value },
    enableCache: enableCache.value
  }));

  return {
    expression,
    sortBy,
    sortDirection,
    filterOptions,
    setExpression,
    setSortBy,
    toggleSortDirection,
    resetFilters
  };
});
```

```vue
<!-- Component using Pinia store -->
<script setup lang="ts">
import { useFilter } from '@mcabreradev/filter/vue';
import { useFilterStore } from '@/stores/filter';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

const props = defineProps<{
  products: Product[];
}>();

const filterStore = useFilterStore();

const { filtered, isFiltering } = useFilter(
  () => props.products,
  () => filterStore.expression,
  () => filterStore.filterOptions
);

const handleCategoryFilter = (category: string) => {
  filterStore.setExpression({ category });
};

const handlePriceRangeFilter = (min: number, max: number) => {
  filterStore.setExpression({
    price: { $gte: min, $lte: max }
  });
};
</script>

<template>
  <div class="product-catalog">
    <div class="filters">
      <button @click="handleCategoryFilter('Electronics')">
        Electronics
      </button>
      <button @click="handleCategoryFilter('Books')">
        Books
      </button>
      <button @click="handlePriceRangeFilter(0, 100)">
        Under $100
      </button>
      <button @click="filterStore.resetFilters()">
        Clear Filters
      </button>
    </div>

    <div class="sort-controls">
      <select 
        :value="filterStore.sortBy"
        @change="filterStore.setSortBy($event.target.value)"
      >
        <option value="name">Name</option>
        <option value="price">Price</option>
        <option value="category">Category</option>
      </select>
      <button @click="filterStore.toggleSortDirection()">
        {{ filterStore.sortDirection === 'asc' ? '↑ Ascending' : '↓ Descending' }}
      </button>
    </div>

    <div v-if="isFiltering">Filtering...</div>

    <div class="product-grid">
      <p>{{ filtered.length }} products</p>
      <div 
        v-for="product in filtered" 
        :key="product.id" 
        class="product-card"
      >
        <h3>{{ product.name }}</h3>
        <p>{{ product.category }}</p>
        <p class="price">${{ product.price }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-catalog {
  padding: 1rem;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.sort-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.product-card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
```

### 5. Nuxt 3 with SSR

Server-side rendering with Nuxt 3 and client-side filtering.

```vue
<!-- pages/products.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFilter } from '@mcabreradev/filter/vue';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

// Server-side data fetching
const { data: products } = await useFetch<Product[]>('/api/products', {
  // Cache for 60 seconds
  getCachedData: (key) => useNuxtApp().payload.data[key] || useNuxtApp().static.data[key]
});

const searchTerm = ref('');
const category = ref('');
const priceRange = ref<[number, number]>([0, 10000]);
const showInStockOnly = ref(false);

// Client-side filtering
const expression = computed(() => ({
  ...(searchTerm.value && { 
    $or: [
      { name: { $contains: searchTerm.value } },
      { category: { $contains: searchTerm.value } }
    ]
  }),
  ...(category.value && { category: category.value }),
  price: { $gte: priceRange.value[0], $lte: priceRange.value[1] },
  ...(showInStockOnly.value && { inStock: true })
}));

const { filtered, isFiltering } = useFilter(
  products,
  expression,
  { 
    orderBy: 'name',
    enableCache: true 
  }
);

const clearFilters = () => {
  searchTerm.value = '';
  category.value = '';
  priceRange.value = [0, 10000];
  showInStockOnly.value = false;
};
</script>

<template>
  <div class="products-page">
    <h1>Product Catalog</h1>

    <div class="filters-panel">
      <input
        v-model="searchTerm"
        type="search"
        placeholder="Search products..."
        class="search-input"
      />

      <select v-model="category">
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Books">Books</option>
        <option value="Clothing">Clothing</option>
      </select>

      <div class="price-range">
        <label>
          Price Range: ${{ priceRange[0] }} - ${{ priceRange[1] }}
        </label>
        <input
          v-model.number="priceRange[1]"
          type="range"
          min="0"
          max="10000"
        />
      </div>

      <label class="checkbox">
        <input
          v-model="showInStockOnly"
          type="checkbox"
        />
        In Stock Only
      </label>

      <div class="filter-stats">
        {{ isFiltering ? 'Filtering...' : `${filtered.length} products found` }}
      </div>
    </div>

    <div class="products-grid">
      <div 
        v-for="product in filtered" 
        :key="product.id" 
        class="product-card"
      >
        <h3>{{ product.name }}</h3>
        <p class="category">{{ product.category }}</p>
        <p class="price">${{ product.price.toFixed(2) }}</p>
        <p class="stock">
          {{ product.inStock ? '✅ In Stock' : '❌ Out of Stock' }}
        </p>
      </div>

      <div v-if="filtered.length === 0" class="no-results">
        <p>No products match your filters</p>
        <button @click="clearFilters">
          Clear All Filters
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.filters-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.search-input {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.product-card {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
```

```typescript
// server/api/products.ts - Nuxt API route
export default defineEventHandler(async (event) => {
  // Simulate database fetch
  const products = [
    { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1200, inStock: true },
    { id: 2, name: 'Mouse Wireless', category: 'Electronics', price: 25, inStock: true },
    { id: 3, name: 'Desk Lamp', category: 'Office', price: 45, inStock: false },
    // ... more products
  ];

  return products;
});
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

