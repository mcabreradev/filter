# Migration Guide v5.4.0

This guide helps you migrate to the latest version of `@mcabreradev/filter` and understand the framework integration APIs.

## Current Version: v5.4.0

### What's New in v5.4.0

- **Stable Framework Integrations**: Production-ready React, Vue, and Svelte support
- **Improved Type Safety**: Better TypeScript inference for framework hooks
- **Bug Fixes**: Stability improvements across all integrations
- **SSR Compatibility**: Full support for Next.js, Nuxt, and SvelteKit

---

## Framework Integration APIs

### React Hooks

All React hooks return consistent interfaces with `filtered` and `isFiltering` properties.

#### useFilter

Basic filtering hook for React components.

```typescript
import { useFilter } from '@mcabreradev/filter';

interface User {
  id: number;
  name: string;
  active: boolean;
}

function UserList({ users }: { users: User[] }) {
  const { filtered, isFiltering } = useFilter(users, { active: true });

  return (
    <div>
      {isFiltering && <span>Filtering {users.length} users...</span>}
      <ul>
        {filtered.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Return Type:**
```typescript
interface UseFilterResult<T> {
  filtered: T[];        // Filtered results
  isFiltering: boolean; // True if filter is active (filtered.length !== data.length)
}
```

#### useFilteredState

Hook with internal state management for both data and filter expression.

```typescript
import { useFilteredState } from '@mcabreradev/filter';

function UserManager() {
  const {
    data,
    setData,
    expression,
    setExpression,
    filtered,
    isFiltering
  } = useFilteredState<User>([], () => true);

  const handleAddUser = (user: User) => {
    setData([...data, user]);
  };

  const handleFilterActive = () => {
    setExpression({ active: true });
  };

  return (
    <div>
      <button onClick={handleFilterActive}>Show Active Only</button>
      <p>Showing {filtered.length} of {data.length} users</p>
      {/* ... */}
    </div>
  );
}
```

**Return Type:**
```typescript
interface UseFilteredStateResult<T> {
  data: T[];
  setData: (data: T[]) => void;
  expression: Expression<T>;
  setExpression: (expression: Expression<T>) => void;
  filtered: T[];
  isFiltering: boolean;
}
```

#### useDebouncedFilter

Debounced filtering for search inputs.

```typescript
import { useDebouncedFilter } from '@mcabreradev/filter';

function UserSearch({ users }: { users: User[] }) {
  const [search, setSearch] = useState('');
  const { filtered, isFiltering, isPending } = useDebouncedFilter(
    users,
    { name: { $contains: search } },
    { delay: 300 }
  );

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
      />
      {isPending && <span>Typing...</span>}
      {isFiltering && <span>Filtered to {filtered.length} results</span>}
      {/* ... */}
    </div>
  );
}
```

**Return Type:**
```typescript
interface UseDebouncedFilterResult<T> {
  filtered: T[];
  isFiltering: boolean;
  isPending: boolean;  // True while debounce is waiting
}
```

#### usePaginatedFilter

Filtering with built-in pagination.

```typescript
import { usePaginatedFilter } from '@mcabreradev/filter';

function PaginatedUserList({ users }: { users: User[] }) {
  const {
    filtered,
    isFiltering,
    data,
    currentPage,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    setPageSize
  } = usePaginatedFilter(users, { active: true }, 10);

  return (
    <div>
      <p>Page {currentPage} of {totalPages}</p>
      {data.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button onClick={previousPage} disabled={!hasPreviousPage}>
        Previous
      </button>
      <button onClick={nextPage} disabled={!hasNextPage}>
        Next
      </button>
    </div>
  );
}
```

**Return Type:**
```typescript
interface UsePaginatedFilterResult<T> extends PaginationResult<T>, PaginationActions {
  filtered: T[];        // All filtered results
  isFiltering: boolean;
}

interface PaginationResult<T> {
  data: T[];           // Current page data
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginationActions {
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
```

---

### Vue Composables

Vue composables return `ComputedRef` and `Ref` for reactive integration.

#### useFilter

```typescript
import { ref } from 'vue';
import { useFilter } from '@mcabreradev/filter';

interface User {
  id: number;
  name: string;
  active: boolean;
}

const users = ref<User[]>([...]);
const searchTerm = ref('');

const { filtered, isFiltering } = useFilter(users, {
  name: { $contains: searchTerm }
});
```

**Return Type:**
```typescript
interface UseFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
}
```

#### useFilteredState

```typescript
import { useFilteredState } from '@mcabreradev/filter';

const {
  data,
  expression,
  filtered,
  isFiltering
} = useFilteredState<User>([], () => true);

// Update data
data.value = [...newUsers];

// Update expression
expression.value = { active: true };
```

**Return Type:**
```typescript
interface UseFilteredStateResult<T> {
  data: Ref<T[]>;
  expression: Ref<Expression<T>>;
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
}
```

#### useDebouncedFilter

```typescript
import { useDebouncedFilter } from '@mcabreradev/filter';

const search = ref('');
const { filtered, isFiltering, isPending } = useDebouncedFilter(
  users,
  { name: { $contains: search } },
  { delay: 300 }
);
```

**Return Type:**
```typescript
interface UseDebouncedFilterResult<T> {
  filtered: ComputedRef<T[]>;
  isFiltering: ComputedRef<boolean>;
  isPending: Ref<boolean>;
}
```

#### usePaginatedFilter

```typescript
import { usePaginatedFilter } from '@mcabreradev/filter';

const {
  filtered,
  isFiltering,
  pagination,
  currentPage,
  pageSize,
  nextPage,
  previousPage,
  goToPage,
  setPageSize
} = usePaginatedFilter(users, { active: true }, 10);
```

**Return Type:**
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

---

### Svelte Stores

Svelte integration uses stores for reactive state management.

#### useFilter

```typescript
import { writable } from 'svelte/store';
import { useFilter } from '@mcabreradev/filter';

const users = writable<User[]>([...]);
const searchTerm = writable('');

const { filtered, isFiltering } = useFilter(users, {
  name: { $contains: searchTerm }
});
```

**Usage in Svelte component:**
```svelte
<script>
  import { writable } from 'svelte/store';
  import { useFilter } from '@mcabreradev/filter';

  const users = writable([...]);
  const { filtered, isFiltering } = useFilter(users, { active: true });
</script>

{#if $isFiltering}
  <p>Filtering active...</p>
{/if}

{#each $filtered as user (user.id)}
  <div>{user.name}</div>
{/each}
```

**Return Type:**
```typescript
interface UseFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
}
```

#### useFilteredState

```typescript
import { useFilteredState } from '@mcabreradev/filter';

const {
  data,
  expression,
  filtered,
  isFiltering
} = useFilteredState<User>([], () => true);

// Update data
data.set([...newUsers]);

// Update expression
expression.set({ active: true });
```

**Return Type:**
```typescript
interface UseFilteredStateResult<T> {
  data: Writable<T[]>;
  expression: Writable<Expression<T>>;
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
}
```

#### useDebouncedFilter

```typescript
import { useDebouncedFilter } from '@mcabreradev/filter';

const search = writable('');
const { filtered, isFiltering, isPending } = useDebouncedFilter(
  users,
  { name: { $contains: search } },
  { delay: 300 }
);
```

**Return Type:**
```typescript
interface UseDebouncedFilterResult<T> {
  filtered: Readable<T[]>;
  isFiltering: Readable<boolean>;
  isPending: Readable<boolean>;
}
```

#### usePaginatedFilter

```typescript
import { usePaginatedFilter } from '@mcabreradev/filter';

const {
  filtered,
  isFiltering,
  pagination,
  currentPage,
  pageSize,
  nextPage,
  previousPage,
  goToPage,
  setPageSize
} = usePaginatedFilter(users, { active: true }, 10);
```

**Return Type:**
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

---

## Common Patterns

### Search with Debounce

**React:**
```typescript
function Search() {
  const [search, setSearch] = useState('');
  const { filtered, isPending } = useDebouncedFilter(
    data,
    { name: { $contains: search } },
    { delay: 300 }
  );

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

**Vue:**
```vue
<script setup>
import { ref } from 'vue';
import { useDebouncedFilter } from '@mcabreradev/filter';

const search = ref('');
const { filtered, isPending } = useDebouncedFilter(
  data,
  { name: { $contains: search } },
  { delay: 300 }
);
</script>

<template>
  <input v-model="search" placeholder="Search..." />
  <span v-if="isPending">Typing...</span>
</template>
```

**Svelte:**
```svelte
<script>
  import { writable } from 'svelte/store';
  import { useDebouncedFilter } from '@mcabreradev/filter';

  const search = writable('');
  const { filtered, isPending } = useDebouncedFilter(
    data,
    { name: { $contains: search } },
    { delay: 300 }
  );
</script>

<input bind:value={$search} placeholder="Search..." />
{#if $isPending}
  <span>Typing...</span>
{/if}
```

### Pagination with Filtering

All frameworks follow the same pattern - filter first, then paginate the results.

```typescript
const {
  filtered,      // All filtered results
  data,          // Current page data
  currentPage,
  totalPages,
  nextPage,
  previousPage
} = usePaginatedFilter(allData, filterExpression, pageSize);
```

---

## Migration from Earlier Versions

### From v5.3.0 to v5.4.0

No breaking changes. v5.4.0 is a stability and bug-fix release.

### From v5.2.0 to v5.3.0

Framework integrations were added. If you were using the core `filter` function, no changes needed.

### From v5.0.0 to v5.1.0+

Lazy evaluation functions were added. Existing code continues to work without changes.

---

## TypeScript Support

All hooks and composables are fully typed with generics:

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

// React
const { filtered } = useFilter<Product>(products, { price: { $gte: 100 } });
// filtered is Product[]

// Vue
const { filtered } = useFilter<Product>(products, { price: { $gte: 100 } });
// filtered is ComputedRef<Product[]>

// Svelte
const { filtered } = useFilter<Product>(products, { price: { $gte: 100 } });
// filtered is Readable<Product[]>
```

---

## SSR Compatibility

All framework integrations are SSR-compatible:

- **Next.js**: Works in both App Router and Pages Router
- **Nuxt**: Compatible with Nuxt 3
- **SvelteKit**: Full SSR support

Example with Next.js App Router:

```typescript
'use client';

import { useFilter } from '@mcabreradev/filter';

export function ProductList({ products }: { products: Product[] }) {
  const { filtered, isFiltering } = useFilter(products, { inStock: true });

  return (
    <div>
      {filtered.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

---

## Performance Tips

1. **Use `enableCache` for large datasets:**
   ```typescript
   useFilter(largeData, expression, { enableCache: true });
   ```

2. **Debounce search inputs:**
   ```typescript
   useDebouncedFilter(data, searchExpression, { delay: 300 });
   ```

3. **Paginate large result sets:**
   ```typescript
   usePaginatedFilter(data, expression, 50); // 50 items per page
   ```

4. **Memoize complex expressions:**
   ```typescript
   const expression = useMemo(() => ({
     price: { $gte: minPrice, $lte: maxPrice },
     category: { $in: selectedCategories }
   }), [minPrice, maxPrice, selectedCategories]);
   ```

---

## Troubleshooting

### React: "Too many re-renders"

**Problem:** Expression object is recreated on every render.

**Solution:** Memoize the expression:
```typescript
const expression = useMemo(() => ({ active: true }), []);
const { filtered } = useFilter(data, expression);
```

### Vue: "Filtered results not updating"

**Problem:** Using plain objects instead of refs.

**Solution:** Wrap in `ref()` or `computed()`:
```typescript
const searchTerm = ref(''); // Not const searchTerm = '';
const { filtered } = useFilter(data, { name: { $contains: searchTerm } });
```

### Svelte: "Store is not reactive"

**Problem:** Not using `$` prefix to access store values.

**Solution:** Use `$` prefix:
```svelte
{#each $filtered as item}  <!-- Not {#each filtered as item} -->
  <div>{item.name}</div>
{/each}
```

---

## Support

- **Documentation**: [Full Documentation](../advanced/complete-documentation.md)
- **GitHub Issues**: [Report bugs](https://github.com/mcabreradev/filter/issues)
- **GitHub Discussions**: [Ask questions](https://github.com/mcabreradev/filter/discussions)

---

## What's Next?

Check out the framework-specific guides:

- [React Integration Guide](../frameworks/react.md)
- [Vue Integration Guide](../frameworks/vue.md)
- [Svelte Integration Guide](../frameworks/svelte.md)

