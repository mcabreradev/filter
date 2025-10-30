---
title: Supercharge Your Frontend with @mcabreradev/filter: React, Vue, and Svelte Guide
published: true
description: Learn how @mcabreradev/filter simplifies data filtering in React, Vue, and Svelte with hooks, composables, and stores. Real-world examples included!
tags: react, vue, svelte, typescript
cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/your-cover-image.png
---

# Supercharge Your Frontend with `@mcabreradev/filter`: React, Vue, and Svelte Guide 🚀

**TL;DR:** `@mcabreradev/filter` now includes first-class support for React, Vue, and Svelte! Use hooks, composables, and stores to filter data declaratively with SQL-like syntax and MongoDB-style operators. Perfect for e-commerce, dashboards, search interfaces, and more. TypeScript-first, SSR-compatible, and battle-tested with 270+ tests.

---

## The Frontend Filtering Challenge

If you've built a modern web application, you've probably written code like this:

```tsx
// React - The old way
const [filteredProducts, setFilteredProducts] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [filters, setFilters] = useState({ category: '', priceRange: [0, 1000] });

useEffect(() => {
  const results = products.filter(product => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    // Price range filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    
    // Search term (case-insensitive)
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // In stock only
    if (!product.inStock) {
      return false;
    }
    
    return true;
  });
  
  setFilteredProducts(results);
}, [products, searchTerm, filters]);
```

This works, but it's:
- ❌ **Verbose** - 20+ lines for basic filtering
- ❌ **Error-prone** - Easy to miss edge cases
- ❌ **Hard to maintain** - Adding filters requires touching multiple places
- ❌ **Not reusable** - Logic tied to this component
- ❌ **Performance issues** - Re-filtering on every render

There has to be a better way! 💡

---

## Enter `@mcabreradev/filter` v5.4.0

The latest release brings **first-class framework integration** for React, Vue, and Svelte. Filter data declaratively with a simple, powerful API:

```tsx
// React - The new way
import { useFilter } from '@mcabreradev/filter';

function ProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { filtered, isFiltering } = useFilter(products, {
    name: { $contains: searchTerm },
    category: 'Electronics',
    price: { $gte: 0, $lte: 1000 },
    inStock: true
  });

  return (
    <div>
      <input onChange={(e) => setSearchTerm(e.target.value)} />
      {isFiltering && <Spinner />}
      {filtered.map(product => <ProductCard {...product} />)}
    </div>
  );
}
```

**4 lines instead of 20+** with:
- ✅ SQL-like syntax (`$contains`, `$gte`, `$lte`)
- ✅ MongoDB-style operators (18+ operators)
- ✅ Automatic memoization (530x faster for repeated queries)
- ✅ TypeScript autocomplete for valid operators
- ✅ Loading states built-in

---

## Real-World Use Case: E-Commerce Product Search

Let's build a realistic product filtering system for an e-commerce store. Users need to:

1. **Search** by product name (debounced)
2. **Filter** by category, price range, availability, and rating
3. **Paginate** through results
4. **Sort** by price or relevance

### React Implementation

```tsx
import { 
  useFilter, 
  useDebouncedFilter, 
  usePaginatedFilter 
} from '@mcabreradev/filter';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  inStock: boolean;
  tags: string[];
}

function ProductSearch({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // Debounced search - prevents excessive filtering while typing
  const { filtered, isPending } = useDebouncedFilter(
    products,
    {
      name: { $contains: searchTerm },
      ...(category && { category }),
      price: { $gte: priceRange[0], $lte: priceRange[1] },
      rating: { $gte: minRating },
      ...(showInStockOnly && { inStock: true })
    },
    { delay: 300 } // Wait 300ms after user stops typing
  );

  return (
    <div className="product-search">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {/* Filters */}
      <div className="filters">
        <select onChange={(e) => setCategory(e.target.value || null)}>
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
        </select>

        <div className="price-range">
          <label>Price: ${priceRange[0]} - ${priceRange[1]}</label>
          <input
            type="range"
            min="0"
            max="2000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          />
        </div>

        <div className="rating">
          <label>Min Rating: {minRating}★</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
          />
        </div>

        <label>
          <input
            type="checkbox"
            checked={showInStockOnly}
            onChange={(e) => setShowInStockOnly(e.target.checked)}
          />
          In Stock Only
        </label>
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="loading">
          <span>Searching...</span>
        </div>
      )}

      {/* Results */}
      <div className="results">
        <p>{filtered.length} products found</p>
        <div className="product-grid">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Key Features:**
- 🔍 **Debounced search** prevents excessive re-filtering
- ⚡ **Loading states** for better UX
- 🎯 **MongoDB-style operators** for flexible filtering
- 🔒 **Type-safe** with TypeScript generics

---

### Vue Implementation

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFilter, useDebouncedFilter } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  inStock: boolean;
}

const props = defineProps<{ products: Product[] }>();

const searchTerm = ref('');
const category = ref<string | null>(null);
const priceRange = ref([0, 2000]);
const minRating = ref(0);
const showInStockOnly = ref(false);

// Reactive filter expression
const filterExpression = computed(() => ({
  name: { $contains: searchTerm.value },
  ...(category.value && { category: category.value }),
  price: { $gte: priceRange.value[0], $lte: priceRange.value[1] },
  rating: { $gte: minRating.value },
  ...(showInStockOnly.value && { inStock: true })
}));

// Debounced filtering
const { filtered, isPending } = useDebouncedFilter(
  props.products,
  filterExpression,
  { delay: 300 }
);
</script>

<template>
  <div class="product-search">
    <!-- Search Input -->
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Search products..."
    />

    <!-- Filters -->
    <div class="filters">
      <select v-model="category">
        <option :value="null">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Books">Books</option>
      </select>

      <div class="price-range">
        <label>Price: ${{ priceRange[0] }} - ${{ priceRange[1] }}</label>
        <input
          v-model.number="priceRange[1]"
          type="range"
          min="0"
          max="2000"
        />
      </div>

      <div class="rating">
        <label>Min Rating: {{ minRating }}★</label>
        <input
          v-model.number="minRating"
          type="range"
          min="0"
          max="5"
          step="0.5"
        />
      </div>

      <label>
        <input v-model="showInStockOnly" type="checkbox" />
        In Stock Only
      </label>
    </div>

    <!-- Loading State -->
    <div v-if="isPending" class="loading">
      <span>Searching...</span>
    </div>

    <!-- Results -->
    <div class="results">
      <p>{{ filtered.length }} products found</p>
      <div class="product-grid">
        <ProductCard
          v-for="product in filtered"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>
```

**Vue Benefits:**
- 🔄 **Reactive refs** automatically trigger re-filtering
- 📦 **Computed expressions** for clean filter definitions
- ⚡ **Composition API** for maximum flexibility

---

### Svelte Implementation

```svelte
<script lang="ts">
import { writable, derived } from 'svelte/store';
import { useFilter } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  inStock: boolean;
}

export let products: Product[];

const searchTerm = writable('');
const category = writable<string | null>(null);
const priceRange = writable([0, 2000]);
const minRating = writable(0);
const showInStockOnly = writable(false);

// Derived filter expression
const filterExpression = derived(
  [searchTerm, category, priceRange, minRating, showInStockOnly],
  ([$search, $cat, $price, $rating, $inStock]) => ({
    name: { $contains: $search },
    ...($cat && { category: $cat }),
    price: { $gte: $price[0], $lte: $price[1] },
    rating: { $gte: $rating },
    ...($inStock && { inStock: true })
  })
);

const { filtered, isFiltering } = useFilter(products, filterExpression);
</script>

<div class="product-search">
  <!-- Search Input -->
  <input
    bind:value={$searchTerm}
    type="text"
    placeholder="Search products..."
  />

  <!-- Filters -->
  <div class="filters">
    <select bind:value={$category}>
      <option value={null}>All Categories</option>
      <option value="Electronics">Electronics</option>
      <option value="Clothing">Clothing</option>
      <option value="Books">Books</option>
    </select>

    <div class="price-range">
      <label>Price: ${$priceRange[0]} - ${$priceRange[1]}</label>
      <input
        bind:value={$priceRange[1]}
        type="range"
        min="0"
        max="2000"
      />
    </div>

    <div class="rating">
      <label>Min Rating: {$minRating}★</label>
      <input
        bind:value={$minRating}
        type="range"
        min="0"
        max="5"
        step="0.5"
      />
    </div>

    <label>
      <input bind:checked={$showInStockOnly} type="checkbox" />
      In Stock Only
    </label>
  </div>

  <!-- Loading State -->
  {#if $isFiltering}
    <div class="loading">
      <span>Searching...</span>
    </div>
  {/if}

  <!-- Results -->
  <div class="results">
    <p>{$filtered.length} products found</p>
    <div class="product-grid">
      {#each $filtered as product (product.id)}
        <ProductCard {product} />
      {/each}
    </div>
  </div>
</div>
```

**Svelte Advantages:**
- 📦 **Reactive stores** for automatic updates
- 🎯 **Derived stores** for computed expressions
- ⚡ **Minimal boilerplate** with two-way binding

---

## Advanced Features

### Pagination with `usePaginatedFilter`

```tsx
// React
import { usePaginatedFilter } from '@mcabreradev/filter';

function PaginatedProducts() {
  const {
    currentPage,
    totalPages,
    pageData,
    nextPage,
    prevPage,
    goToPage
  } = usePaginatedFilter(
    products,
    { inStock: true },
    { pageSize: 20 }
  );

  return (
    <div>
      <div className="products">
        {pageData.map(p => <ProductCard key={p.id} {...p} />)}
      </div>
      
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
```

### Complex Queries with Logical Operators

```tsx
// Find products that are either:
// - Electronics under $500, OR
// - Books with 4+ star rating
const { filtered } = useFilter(products, {
  $or: [
    {
      $and: [
        { category: 'Electronics' },
        { price: { $lt: 500 } }
      ]
    },
    {
      $and: [
        { category: 'Books' },
        { rating: { $gte: 4 } }
      ]
    }
  ]
});
```

### Performance Optimization with Caching

```tsx
// Enable caching for repeated queries (530x faster!)
const { filtered } = useFilter(
  largeProductList,
  { category: 'Electronics' },
  { enableCache: true }
);
```

---

## Why Choose `@mcabreradev/filter`?

### 1. **Developer Experience** 🎯
- Declarative syntax is easier to read and maintain
- TypeScript autocomplete suggests only valid operators
- Built-in loading states and error handling

### 2. **Performance** ⚡
- 530x faster with memoization for repeated queries
- Debounced filtering prevents excessive re-renders
- Lazy evaluation for large datasets

### 3. **Flexibility** 🔧
- 18+ MongoDB-style operators (`$gte`, `$in`, `$regex`, etc.)
- SQL-like wildcards (`%`, `_`)
- Custom predicates for complex logic
- Logical operators (`$and`, `$or`, `$not`)

### 4. **Type Safety** 🔒
- Full TypeScript support with strict typing
- Autocomplete suggests valid operators per property type
- Compile-time validation

### 5. **Framework Integration** 🎨
- React Hooks: `useFilter`, `useDebouncedFilter`, `usePaginatedFilter`
- Vue Composables: Reactive refs and computed expressions
- Svelte Stores: Reactive and derived stores
- SSR compatible (Next.js, Nuxt, SvelteKit)

---

## Getting Started

### Installation

```bash
npm install @mcabreradev/filter
# or
yarn add @mcabreradev/filter
# or
pnpm add @mcabreradev/filter
```

### Quick Example

```tsx
// React
import { useFilter } from '@mcabreradev/filter';

function App() {
  const { filtered } = useFilter(users, {
    age: { $gte: 18 },
    city: { $in: ['Berlin', 'London'] },
    name: { $startsWith: 'A' }
  });

  return <UserList users={filtered} />;
}
```

---

## Resources

- 📖 **[Complete Documentation](https://github.com/mcabreradev/filter#readme)**
- 🎮 **[Interactive Playground](https://filter-docs.vercel.app/playground/)**
- 📚 **[Framework Integration Guide](https://github.com/mcabreradev/filter/blob/main/docs/frameworks/overview.md)**
- 🔍 **[All Operators Reference](https://github.com/mcabreradev/filter/blob/main/docs/guide/operators.md)**
- 💡 **[Real-World Examples](https://github.com/mcabreradev/filter/tree/main/examples)**

---

## Conclusion

`@mcabreradev/filter` transforms frontend data filtering from a chore into a joy. Whether you're building an e-commerce search, a dashboard, or a complex admin panel, the framework-specific APIs make filtering declarative, performant, and maintainable.

**Ready to supercharge your frontend?** 🚀

```bash
npm install @mcabreradev/filter
```

Try it in your next project and let me know what you build! Drop a comment below with your use case, or star the repo on GitHub to show your support. 💫

---

**What's your biggest data filtering challenge?** Share in the comments! 👇
