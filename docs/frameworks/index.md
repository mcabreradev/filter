---
title: Framework Integrations
description: Complete guide for React, Vue, Svelte, Angular, SolidJS, and Preact integrations
---

# Framework Integrations

> **Version**: 5.7.0+
> **Status**: Stable

Complete guide for using `@mcabreradev/filter` with 6 major frameworks.

---

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [React Integration](#react-integration)
- [Vue Integration](#vue-integration)
- [Svelte Integration](#svelte-integration)
- [Angular Integration](#angular-integration) ⭐ NEW
- [SolidJS Integration](#solidjs-integration) ⭐ NEW
- [Preact Integration](#preact-integration) ⭐ NEW
- [Shared Features](#shared-features)
- [Performance Tips](#performance-tips)
- [TypeScript Support](#typescript-support)
- [Examples](#examples)

---

## Overview

The framework integrations provide idiomatic hooks, composables, services, and stores for all major frameworks, making it easy to integrate powerful filtering capabilities into your applications.

### Supported Frameworks

- ⚛️ **[React](/frameworks/react)** - Hooks with automatic re-rendering
- 🟢 **[Vue](/frameworks/vue)** - Composition API with reactivity
- 🔴 **[Svelte](/frameworks/svelte)** - Store-based reactive filtering
- 🅰️ **[Angular](/frameworks/angular)** - Services and Pipes with Signals ⭐ NEW
- 🔷 **[SolidJS](/frameworks/solidjs)** - Signal-based reactive hooks ⭐ NEW
- ⚡ **[Preact](/frameworks/preact)** - Lightweight hooks API ⭐ NEW

### Features

- **React Hooks**: `useFilter`, `useFilteredState`, `useDebouncedFilter`, `usePaginatedFilter`
- **Vue Composables**: Composition API-first with full reactivity
- **Svelte Stores**: Reactive stores with derived state
- **Angular Services**: `FilterService`, `DebouncedFilterService`, `PaginatedFilterService`, `FilterPipe`
- **SolidJS Hooks**: `useFilter`, `useDebouncedFilter`, `usePaginatedFilter`
- **Preact Hooks**: `useFilter`, `useFilteredState`, `useDebouncedFilter`, `usePaginatedFilter`
- **Shared Utilities**: Debouncing, pagination, and performance optimizations
- **TypeScript**: Full type safety with generics
- **SSR Compatible**: Works with Next.js, Nuxt, SvelteKit, Angular Universal, and SolidStart

---

## Installation

```bash
npm install @mcabreradev/filter

# Install peer dependencies for your framework
npm install react          # For React
npm install vue            # For Vue
npm install svelte         # For Svelte
npm install @angular/core  # For Angular 17+
npm install solid-js       # For SolidJS
npm install preact         # For Preact
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

## Angular Integration

⭐ **New in v5.7.0**: Full Angular support with Services, Pipes, and Signals!

### FilterService

Injectable service for component-based filtering with Angular Signals.

```typescript
import { Component, inject } from '@angular/core';
import { FilterService } from '@mcabreradev/filter/angular';

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  providers: [FilterService],
  template: `
    <div>
      <p>Showing {{ filterService.filtered().length }} active users</p>
      @for (user of filterService.filtered(); track user.id) {
        <div>{{ user.name }}</div>
      }
    </div>
  `
})
export class UserListComponent {
  filterService = inject(FilterService<User>);

  users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', active: true },
    { id: 2, name: 'Bob', email: 'bob@example.com', active: false },
  ];

  constructor() {
    this.filterService.setData(this.users);
    this.filterService.setExpression({ active: true });
  }
}
```

**API**:
```typescript
class FilterService<T> {
  data: Signal<T[]>;
  expression: Signal<Expression<T>>;
  filtered: Signal<T[]>;
  isFiltering: Signal<boolean>;

  setData(data: T[]): void;
  setExpression(expression: Expression<T>): void;
  setOptions(options: FilterOptions): void;
}
```

### DebouncedFilterService

Debounced filtering service for search inputs.

```typescript
import { Component, inject } from '@angular/core';
import { DebouncedFilterService } from '@mcabreradev/filter/angular';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-users',
  standalone: true,
  providers: [DebouncedFilterService],
  template: `
    <div>
      <input [formControl]="searchControl" placeholder="Search users..." />
      @if (filterService.isPending()) {
        <span>Searching...</span>
      }
      @for (user of filterService.filtered(); track user.id) {
        <div>{{ user.name }}</div>
      }
    </div>
  `
})
export class SearchUsersComponent {
  filterService = inject(DebouncedFilterService<User>);
  searchControl = new FormControl('');

  constructor() {
    this.filterService.setData(users);
    this.filterService.setDelay(300);

    this.searchControl.valueChanges.subscribe(term => {
      this.filterService.setExpression({ name: { $contains: term || '' } });
    });
  }
}
```

**API**:
```typescript
class DebouncedFilterService<T> extends FilterService<T> {
  isPending: Signal<boolean>;
  delay: Signal<number>;

  setDelay(delay: number): void;
}
```

### PaginatedFilterService

Filtering with built-in pagination.

```typescript
import { Component, inject } from '@angular/core';
import { PaginatedFilterService } from '@mcabreradev/filter/angular';

@Component({
  selector: 'app-paginated-users',
  standalone: true,
  providers: [PaginatedFilterService],
  template: `
    <div>
      @for (user of filterService.paginatedResults(); track user.id) {
        <div>{{ user.name }}</div>
      }
      <div>
        <button 
          (click)="filterService.previousPage()" 
          [disabled]="filterService.currentPage() === 1">
          Previous
        </button>
        <span>
          Page {{ filterService.currentPage() }} of {{ filterService.totalPages() }}
        </span>
        <button 
          (click)="filterService.nextPage()" 
          [disabled]="filterService.currentPage() === filterService.totalPages()">
          Next
        </button>
      </div>
    </div>
  `
})
export class PaginatedUsersComponent {
  filterService = inject(PaginatedFilterService<User>);

  constructor() {
    this.filterService.setData(users);
    this.filterService.setExpression({ active: true });
    this.filterService.setPageSize(10);
  }
}
```

**API**:
```typescript
class PaginatedFilterService<T> extends FilterService<T> {
  paginatedResults: Signal<T[]>;
  currentPage: Signal<number>;
  totalPages: Signal<number>;
  pageSize: Signal<number>;

  setPageSize(size: number): void;
  setPage(page: number): void;
  nextPage(): void;
  previousPage(): void;
}
```

### FilterPipe

Transform arrays in templates with filtering.

```typescript
import { Component } from '@angular/core';
import { FilterPipe } from '@mcabreradev/filter/angular';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FilterPipe],
  template: `
    <div>
      @for (user of users | filter:{ active: true }; track user.id) {
        <div>{{ user.name }}</div>
      }
      
      @for (product of products | filter:{ price: { $gte: 100 } } : { orderBy: 'price', limit: 10 }; track product.id) {
        <div>{{ product.name }} - ${{ product.price }}</div>
      }
    </div>
  `
})
export class UsersComponent {
  users: User[] = [...];
  products: Product[] = [...];
}
```

**API**:
```typescript
@Pipe({ name: 'filter', standalone: true })
export class FilterPipe implements PipeTransform {
  transform<T>(
    array: T[],
    expression: Expression<T>,
    options?: FilterOptions
  ): T[];
}
```

---

## SolidJS Integration

⭐ **New in v5.7.0**: Full SolidJS support with signal-based reactive hooks!

### useFilter

Signal-based filtering with fine-grained reactivity.

```tsx
import { createSignal, For } from 'solid-js';
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
      <p>Showing {filtered().length} active users</p>
      <For each={filtered()}>
        {(user) => <div>{user.name}</div>}
      </For>
    </div>
  );
}
```

**API**:
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

### useDebouncedFilter

Debounced filtering with proper cleanup.

```tsx
import { createSignal, Show, For } from 'solid-js';
import { useDebouncedFilter } from '@mcabreradev/filter/solidjs';

function SearchUsers() {
  const [users] = createSignal<User[]>([...]);
  const [searchTerm, setSearchTerm] = createSignal('');

  const { filtered, isPending } = useDebouncedFilter(
    users,
    () => ({ name: { $contains: searchTerm() } }),
    { delay: 300 }
  );

  return (
    <div>
      <input 
        value={searchTerm()} 
        onInput={(e) => setSearchTerm(e.currentTarget.value)}
        placeholder="Search users..." 
      />
      <Show when={isPending()}>
        <span>Searching...</span>
      </Show>
      <For each={filtered()}>
        {(user) => <div>{user.name}</div>}
      </For>
    </div>
  );
}
```

**API**:
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

### usePaginatedFilter

Pagination with signal-based state management.

```tsx
import { createSignal, For } from 'solid-js';
import { usePaginatedFilter } from '@mcabreradev/filter/solidjs';

function PaginatedUserList() {
  const [users] = createSignal<User[]>([...]);

  const {
    paginatedResults,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
  } = usePaginatedFilter(
    users,
    () => ({ active: true }),
    {
      pageSize: 10,
      initialPage: 1
    }
  );

  return (
    <div>
      <For each={paginatedResults()}>
        {(user) => <div>{user.name}</div>}
      </For>
      <div>
        <button onClick={prevPage} disabled={currentPage() === 1}>
          Previous
        </button>
        <span>
          Page {currentPage()} of {totalPages()}
        </span>
        <button onClick={nextPage} disabled={currentPage() === totalPages()}>
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

---

## Preact Integration

⭐ **New in v5.7.0**: Full Preact support with lightweight hooks API!

### useFilter

Basic filtering hook compatible with Preact.

```tsx
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

Stateful filtering with Preact hooks.

```tsx
import { useFilteredState } from '@mcabreradev/filter/preact';

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
      <input onInput={(e) => filterByName(e.currentTarget.value)} />
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

Debounced filtering for Preact.

```tsx
import { useState } from 'preact/hooks';
import { useDebouncedFilter } from '@mcabreradev/filter/preact';

function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const { filtered, isFiltering, isPending } = useDebouncedFilter(
    users,
    { name: { $contains: searchTerm } },
    { delay: 300 }
  );

  return (
    <div>
      <input
        value={searchTerm}
        onInput={(e) => setSearchTerm(e.currentTarget.value)}
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
```

### usePaginatedFilter

Pagination support for Preact.

```tsx
import { usePaginatedFilter } from '@mcabreradev/filter/preact';

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

### React / Preact

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
useDebouncedFilter(data, { name: { $contains: searchTerm } }, { delay: 300 });
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

### Angular

1. **Use Signals**: Leverage Angular's fine-grained reactivity
```typescript
const filtered = computed(() => 
  filter(this.data(), this.expression())
);
```

2. **Enable caching**: In services for repeated queries
```typescript
this.filterService.setOptions({ enableCache: true });
```

3. **Use OnPush**: Change detection strategy
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### SolidJS

1. **Fine-grained reactivity**: SolidJS automatically optimizes
```typescript
const { filtered } = useFilter(data, expression);
```

2. **Memoize expressions**: Use `createMemo` for computed values
```typescript
const expression = createMemo(() => ({
  name: { $contains: searchTerm() }
}));
```

3. **Enable caching**: For large datasets
```typescript
useFilter(data, expression, () => ({ enableCache: true }));
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

// React / Preact
const { filtered } = useFilter<User>(users, { active: true });
// filtered is User[]

// Vue
const { filtered } = useFilter<User>(users, expression);
// filtered is ComputedRef<User[]>

// Svelte
const { filtered } = useFilter<User>(users, expression);
// filtered is Readable<User[]>

// Angular
filterService.setData<User>(users);
// filtered is Signal<User[]>

// SolidJS
const { filtered } = useFilter<User>(users, expression);
// filtered is Accessor<User[]>
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
- **Angular Universal**: Server-side rendering support
- **SolidStart**: SSR and streaming support

### Next.js Example

```typescript
'use client';

import { useFilter } from '@mcabreradev/filter/react';

export default function UserList({ initialUsers }: { initialUsers: User[] }) {
  const { filtered } = useFilter(initialUsers, { active: true });

  return <div>{/* render filtered users */}</div>;
}
```

### Nuxt Example

```vue
<script setup lang="ts">
import { useFilter } from '@mcabreradev/filter/vue';

const { data: users } = await useFetch('/api/users');
const { filtered } = useFilter(users, { active: true });
</script>
```

### SvelteKit Example

```svelte
<script lang="ts">
import { useFilter } from '@mcabreradev/filter/svelte';
import { writable } from 'svelte/store';

export let data;
const users = writable(data.users);
const { filtered } = useFilter(users, { active: true });
</script>
```

### Angular Universal Example

```typescript
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FilterService } from '@mcabreradev/filter/angular';

@Component({
  selector: 'app-users',
  providers: [FilterService]
})
export class UsersComponent {
  platformId = inject(PLATFORM_ID);
  filterService = inject(FilterService<User>);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.filterService.setData(this.users);
    }
  }
}
```

### SolidStart Example

```tsx
import { createSignal } from 'solid-js';
import { useFilter } from '@mcabreradev/filter/solidjs';

export default function UserList(props: { users: User[] }) {
  const [users] = createSignal(props.users);
  const { filtered } = useFilter(users, () => ({ active: true }));

  return <div>{/* render filtered users */}</div>;
}
```

---

## Migration Guide

### From Array.filter()

```typescript
// Before
const filtered = users.filter(user => user.active);

// After (React / Preact)
const { filtered } = useFilter(users, { active: true });

// After (Vue)
const { filtered } = useFilter(users, { active: true });

// After (Svelte)
const { filtered } = useFilter(users, { active: true });

// After (Angular)
this.filterService.setExpression({ active: true });

// After (SolidJS)
const { filtered } = useFilter(users, () => ({ active: true }));
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

