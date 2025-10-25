# Framework Integrations

> **Version**: 5.3.0+
> **Status**: Stable

Complete guide for using `@mcabreradev/filter` with React, Vue, and Svelte frameworks.

---

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [React Integration](#react-integration)
- [Vue Integration](#vue-integration)
- [Svelte Integration](#svelte-integration)
- [Shared Features](#shared-features)
- [Performance Tips](#performance-tips)
- [TypeScript Support](#typescript-support)
- [Examples](#examples)

---

## Overview

The framework integrations provide idiomatic hooks, composables, and stores for React, Vue, and Svelte, making it easy to integrate powerful filtering capabilities into your applications.

### Features

- **React Hooks**: `useFilter`, `useFilteredState`, `useDebouncedFilter`, `usePaginatedFilter`
- **Vue Composables**: Composition API-first with full reactivity
- **Svelte Stores**: Reactive stores with derived state
- **Shared Utilities**: Debouncing, pagination, and performance optimizations
- **TypeScript**: Full type safety with generics
- **SSR Compatible**: Works with Next.js, Nuxt, and SvelteKit

---

## Installation

```bash
npm install @mcabreradev/filter

# Install peer dependencies for your framework
npm install react          # For React
npm install vue            # For Vue
npm install svelte         # For Svelte
```

---

## React Integration

### useFilter

Basic filtering with automatic memoization.

```typescript
import { useFilter } from '@mcabreradev/filter';

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

function UserList() {
  const users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', active: true },
    { id: 2, name: 'Bob', email: 'bob@example.com', active: false },
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

**API**:
```typescript
function useFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: FilterOptions
): {
  filtered: T[];
  isFiltering: boolean;
}
```

### useFilteredState

Stateful filtering with local data management.

```typescript
import { useFilteredState } from '@mcabreradev/filter';

function UserManager() {
  const {
    data,
    setData,
    expression,
    setExpression,
    filtered,
    isFiltering,
  } = useFilteredState<User>(initialUsers, { active: true });

  const addUser = (user: User) => {
    setData([...data, user]);
  };

  const filterByName = (name: string) => {
    setExpression({ name: { $contains: name } });
  };

  return (
    <div>
      <input onChange={(e) => filterByName(e.target.value)} />
      <button onClick={() => addUser(newUser)}>Add User</button>
      <UserList users={filtered} />
    </div>
  );
}
```

**API**:
```typescript
function useFilteredState<T>(
  initialData?: T[],
  initialExpression?: Expression<T>,
  options?: FilterOptions
): {
  data: T[];
  setData: (data: T[]) => void;
  expression: Expression<T>;
  setExpression: (expression: Expression<T>) => void;
  filtered: T[];
  isFiltering: boolean;
}
```

### useDebouncedFilter

Debounced filtering for search inputs.

```typescript
import { useDebouncedFilter } from '@mcabreradev/filter';
import { useState } from 'react';

function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const { filtered, isFiltering, isPending } = useDebouncedFilter(
    users,
    searchTerm,
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
      <UserList users={filtered} />
    </div>
  );
}
```

**API**:
```typescript
function useDebouncedFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: UseDebouncedFilterOptions
): {
  filtered: T[];
  isFiltering: boolean;
  isPending: boolean;
}

interface UseDebouncedFilterOptions extends FilterOptions {
  delay?: number; // Default: 300ms
}
```

### usePaginatedFilter

Filtering with built-in pagination.

```typescript
import { usePaginatedFilter } from '@mcabreradev/filter';

function PaginatedUserList() {
  const {
    data,
    filtered,
    isFiltering,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    setPageSize,
  } = usePaginatedFilter(users, { active: true }, 10);

  return (
    <div>
      <UserList users={data} />
      <div>
        <button onClick={previousPage} disabled={!hasPreviousPage}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={!hasNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}
```

**API**:
```typescript
function usePaginatedFilter<T>(
  data: T[],
  expression: Expression<T>,
  initialPageSize?: number,
  options?: FilterOptions
): {
  data: T[];
  filtered: T[];
  isFiltering: boolean;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
```

### FilterProvider

Global filter configuration with React Context.

```typescript
import { FilterProvider, useFilterContext } from '@mcabreradev/filter';

function App() {
  return (
    <FilterProvider value={{ options: { caseSensitive: true, enableCache: true } }}>
      <UserList />
    </FilterProvider>
  );
}

function UserList() {
  const context = useFilterContext();
  // Use context.options in your components
}
```

---

## Vue Integration

### useFilter

Vue 3 Composition API filtering.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useFilter } from '@mcabreradev/filter';

interface User {
  id: number;
  name: string;
  active: boolean;
}

const users = ref<User[]>([
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
]);

const expression = ref({ active: true });
const { filtered, isFiltering } = useFilter(users, expression);
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

**API**:
```typescript
function useFilter<T>(
  data: MaybeRef<T[]>,
  expression: MaybeRef<Expression<T>>,
  options?: MaybeRef<FilterOptions>
): {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
}
```

### useFilteredState

Stateful filtering with Vue refs.

```vue
<script setup lang="ts">
import { useFilteredState } from '@mcabreradev/filter';

const { data, expression, filtered, isFiltering } = useFilteredState<User>(
  initialUsers,
  { active: true }
);

const addUser = (user: User) => {
  data.value = [...data.value, user];
};

const filterByName = (name: string) => {
  expression.value = { name: { $contains: name } };
};
</script>
```

**API**:
```typescript
function useFilteredState<T>(
  initialData?: T[],
  initialExpression?: Expression<T>,
  options?: FilterOptions
): {
  data: Ref<T[]>;
  expression: Ref<Expression<T>>;
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
}
```

### useDebouncedFilter

Debounced filtering for Vue.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useDebouncedFilter } from '@mcabreradev/filter';

const searchTerm = ref('');
const { filtered, isFiltering, isPending } = useDebouncedFilter(
  users,
  searchTerm,
  { delay: 300 }
);
</script>

<template>
  <div>
    <input v-model="searchTerm" placeholder="Search..." />
    <span v-if="isPending">Searching...</span>
    <UserList :users="filtered" />
  </div>
</template>
```

**API**:
```typescript
function useDebouncedFilter<T>(
  data: MaybeRef<T[]>,
  expression: MaybeRef<Expression<T>>,
  options?: UseDebouncedFilterOptions
): {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
  isPending: Ref<boolean>;
}
```

### usePaginatedFilter

Pagination support for Vue.

```vue
<script setup lang="ts">
import { usePaginatedFilter } from '@mcabreradev/filter';

const {
  pagination,
  filtered,
  isFiltering,
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
    <UserList :users="pagination.data" />
    <div>
      <button @click="previousPage" :disabled="!pagination.hasPreviousPage">
        Previous
      </button>
      <span>Page {{ pagination.currentPage }} of {{ pagination.totalPages }}</span>
      <button @click="nextPage" :disabled="!pagination.hasNextPage">
        Next
      </button>
    </div>
  </div>
</template>
```

**API**:
```typescript
function usePaginatedFilter<T>(
  data: MaybeRef<T[]>,
  expression: MaybeRef<Expression<T>>,
  initialPageSize?: number,
  options?: FilterOptions
): {
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

---

## Svelte Integration

### useFilter

Svelte store-based filtering.

```svelte
<script lang="ts">
import { writable } from 'svelte/store';
import { useFilter } from '@mcabreradev/filter';

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

**API**:
```typescript
function useFilter<T>(
  data: T[] | Readable<T[]>,
  expression: Expression<T> | Readable<Expression<T>>,
  options?: FilterOptions
): {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
}
```

### useFilteredState

Stateful filtering with Svelte stores.

```svelte
<script lang="ts">
import { useFilteredState } from '@mcabreradev/filter';

const { data, expression, filtered, isFiltering } = useFilteredState<User>(
  initialUsers,
  { active: true }
);

const addUser = (user: User) => {
  $data = [...$data, user];
};

const filterByName = (name: string) => {
  $expression = { name: { $contains: name } };
};
</script>
```

**API**:
```typescript
function useFilteredState<T>(
  initialData?: T[],
  initialExpression?: Expression<T>,
  options?: FilterOptions
): {
  data: Writable<T[]>;
  expression: Writable<Expression<T>>;
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
}
```

### useDebouncedFilter

Debounced filtering for Svelte.

```svelte
<script lang="ts">
import { writable } from 'svelte/store';
import { useDebouncedFilter } from '@mcabreradev/filter';

const searchTerm = writable('');
const { filtered, isFiltering, isPending } = useDebouncedFilter(
  users,
  searchTerm,
  { delay: 300 }
);
</script>

<div>
  <input bind:value={$searchTerm} placeholder="Search..." />
  {#if $isPending}
    <span>Searching...</span>
  {/if}
  <UserList users={$filtered} />
</div>
```

**API**:
```typescript
function useDebouncedFilter<T>(
  data: T[] | Readable<T[]>,
  expression: Expression<T> | Readable<Expression<T>>,
  options?: UseDebouncedFilterOptions
): {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
  isPending: Readable<boolean>;
}
```

### usePaginatedFilter

Pagination support for Svelte.

```svelte
<script lang="ts">
import { usePaginatedFilter } from '@mcabreradev/filter';

const {
  pagination,
  filtered,
  isFiltering,
  currentPage,
  pageSize,
  nextPage,
  previousPage,
  goToPage,
  setPageSize,
} = usePaginatedFilter(users, { active: true }, 10);
</script>

<div>
  <UserList users={$pagination.data} />
  <div>
    <button on:click={previousPage} disabled={!$pagination.hasPreviousPage}>
      Previous
    </button>
    <span>Page {$pagination.currentPage} of {$pagination.totalPages}</span>
    <button on:click={nextPage} disabled={!$pagination.hasNextPage}>
      Next
    </button>
  </div>
</div>
```

**API**:
```typescript
function usePaginatedFilter<T>(
  data: T[] | Readable<T[]>,
  expression: Expression<T> | Readable<Expression<T>>,
  initialPageSize?: number,
  options?: FilterOptions
): {
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

---

## Shared Features

### Debouncing

All frameworks support debounced filtering with configurable delays:

```typescript
// Default delay: 300ms
useDebouncedFilter(data, expression);

// Custom delay
useDebouncedFilter(data, expression, { delay: 500 });

// With filter options
useDebouncedFilter(data, expression, {
  delay: 300,
  caseSensitive: true,
  enableCache: true,
});
```

### Pagination

Pagination utilities are shared across all frameworks:

- **Page navigation**: `nextPage()`, `previousPage()`, `goToPage(page)`
- **Page size**: `setPageSize(size)`
- **Metadata**: `currentPage`, `totalPages`, `totalItems`
- **Availability**: `hasNextPage`, `hasPreviousPage`

### Filter Options

All hooks/composables/stores support standard filter options:

```typescript
{
  caseSensitive: boolean;    // Default: false
  maxDepth: number;          // Default: 3
  enableCache: boolean;      // Default: false
  customComparator?: (a, b) => boolean;
}
```

---

## Performance Tips

### React

1. **Memoize expressions**: Use `useMemo` for complex expressions
```typescript
const expression = useMemo(() => ({
  age: { $gte: 18 },
  city: { $in: ['Berlin', 'Paris'] }
}), []);
```

2. **Enable caching**: For large datasets
```typescript
useFilter(data, expression, { enableCache: true });
```

3. **Use debouncing**: For search inputs
```typescript
useDebouncedFilter(data, searchTerm, { delay: 300 });
```

### Vue

1. **Avoid unnecessary reactivity**: Use `shallowRef` for large datasets
```typescript
const users = shallowRef(largeDataset);
```

2. **Computed expressions**: For derived filter expressions
```typescript
const expression = computed(() => ({
  name: { $contains: searchTerm.value }
}));
```

3. **Enable caching**: For repeated queries
```typescript
useFilter(data, expression, { enableCache: true });
```

### Svelte

1. **Use derived stores**: For computed values
```typescript
const filtered = derived([data, expression], ([$data, $expr]) => {
  return filter($data, $expr);
});
```

2. **Avoid store subscriptions in loops**: Subscribe once at the top level

3. **Enable caching**: For large datasets
```typescript
useFilter(data, expression, { enableCache: true });
```

---

## TypeScript Support

All framework integrations are fully typed with generics:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

// React
const { filtered } = useFilter<User>(users, { active: true });
// filtered is User[]

// Vue
const { filtered } = useFilter<User>(users, expression);
// filtered is ComputedRef<User[]>

// Svelte
const { filtered } = useFilter<User>(users, expression);
// filtered is Readable<User[]>
```

---

## Examples

### Real-World React Example

```typescript
import { useState } from 'react';
import { useDebouncedFilter, usePaginatedFilter } from '@mcabreradev/filter';

function ProductCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const expression = useMemo(() => {
    const filters: any = {};

    if (searchTerm) {
      filters.name = { $contains: searchTerm };
    }

    if (category !== 'all') {
      filters.category = category;
    }

    return filters;
  }, [searchTerm, category]);

  const {
    data,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
  } = usePaginatedFilter(products, expression, 20, { enableCache: true });

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="books">Books</option>
      </select>

      <ProductGrid products={data} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNext={hasNextPage}
        hasPrevious={hasPreviousPage}
        onNext={nextPage}
        onPrevious={previousPage}
      />
    </div>
  );
}
```

### Real-World Vue Example

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePaginatedFilter } from '@mcabreradev/filter';

const searchTerm = ref('');
const category = ref('all');

const expression = computed(() => {
  const filters: any = {};

  if (searchTerm.value) {
    filters.name = { $contains: searchTerm.value };
  }

  if (category.value !== 'all') {
    filters.category = category.value;
  }

  return filters;
});

const {
  pagination,
  nextPage,
  previousPage,
} = usePaginatedFilter(products, expression, 20, { enableCache: true });
</script>

<template>
  <div>
    <input v-model="searchTerm" placeholder="Search products..." />
    <select v-model="category">
      <option value="all">All Categories</option>
      <option value="electronics">Electronics</option>
      <option value="books">Books</option>
    </select>

    <ProductGrid :products="pagination.data" />

    <Pagination
      :current-page="pagination.currentPage"
      :total-pages="pagination.totalPages"
      :has-next="pagination.hasNextPage"
      :has-previous="pagination.hasPreviousPage"
      @next="nextPage"
      @previous="previousPage"
    />
  </div>
</template>
```

### Real-World Svelte Example

```svelte
<script lang="ts">
import { writable, derived } from 'svelte/store';
import { usePaginatedFilter } from '@mcabreradev/filter';

const searchTerm = writable('');
const category = writable('all');

const expression = derived([searchTerm, category], ([$searchTerm, $category]) => {
  const filters: any = {};

  if ($searchTerm) {
    filters.name = { $contains: $searchTerm };
  }

  if ($category !== 'all') {
    filters.category = $category;
  }

  return filters;
});

const {
  pagination,
  nextPage,
  previousPage,
} = usePaginatedFilter(products, expression, 20, { enableCache: true });
</script>

<div>
  <input bind:value={$searchTerm} placeholder="Search products..." />
  <select bind:value={$category}>
    <option value="all">All Categories</option>
    <option value="electronics">Electronics</option>
    <option value="books">Books</option>
  </select>

  <ProductGrid products={$pagination.data} />

  <Pagination
    currentPage={$pagination.currentPage}
    totalPages={$pagination.totalPages}
    hasNext={$pagination.hasNextPage}
    hasPrevious={$pagination.hasPreviousPage}
    on:next={nextPage}
    on:previous={previousPage}
  />
</div>
```

---

## SSR Compatibility

All framework integrations are compatible with server-side rendering:

- **Next.js**: Works with App Router and Pages Router
- **Nuxt**: Compatible with Nuxt 3
- **SvelteKit**: Full SSR support

### Next.js Example

```typescript
'use client';

import { useFilter } from '@mcabreradev/filter';

export default function UserList({ initialUsers }: { initialUsers: User[] }) {
  const { filtered } = useFilter(initialUsers, { active: true });

  return <div>{/* render filtered users */}</div>;
}
```

---

## Migration Guide

### From Array.filter()

```typescript
// Before
const filtered = users.filter(user => user.active);

// After (React)
const { filtered } = useFilter(users, { active: true });

// After (Vue)
const { filtered } = useFilter(users, { active: true });

// After (Svelte)
const { filtered } = useFilter(users, { active: true });
```

### From Custom Hooks

```typescript
// Before (custom React hook)
function useFilteredUsers(users: User[], searchTerm: string) {
  return useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);
}

// After
const { filtered } = useDebouncedFilter(
  users,
  { name: { $contains: searchTerm } },
  { delay: 300 }
);
```

---

## Support

- **Documentation**: [GitHub Wiki](https://github.com/mcabreradev/filter/wiki)
- **Issues**: [GitHub Issues](https://github.com/mcabreradev/filter/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mcabreradev/filter/discussions)

---

<p align="center">
  <strong>Made with ❤️ for the JavaScript/TypeScript community</strong>
</p>

