---
title: E-Commerce Dashboard
description: End-to-end e-commerce catalog dashboard example using @mcabreradev/filter
---

# E-Commerce Dashboard

A complete e-commerce catalog dashboard example, combining multiple operator families, React pagination, and cache invalidation into one scenario.

## Product Dataset

A typed `Product[]` catalog that the following expressions filter:

```typescript
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  inStock: boolean;
  tags: string[];
  releasedAt: Date;
}

const products: Product[] = [
  { id: 1, name: 'Mechanical Keyboard', category: 'electronics', price: 129, rating: 4.7, inStock: true, tags: ['wireless', 'mechanical'], releasedAt: new Date('2025-08-12') },
  { id: 2, name: 'Noise-Cancelling Headphones', category: 'electronics', price: 249, rating: 4.8, inStock: true, tags: ['wireless', 'over-ear'], releasedAt: new Date('2025-09-30') },
  { id: 3, name: 'Ergonomic Office Chair', category: 'furniture', price: 399, rating: 4.5, inStock: false, tags: ['mesh', 'adjustable'], releasedAt: new Date('2025-06-03') },
  { id: 4, name: 'Laptop Backpack', category: 'accessories', price: 79, rating: 4.3, inStock: true, tags: ['waterproof', 'travel'], releasedAt: new Date('2025-07-21') },
  { id: 5, name: 'Smart Home Hub', category: 'electronics', price: 149, rating: 4.1, inStock: true, tags: ['wireless', 'smart-home'], releasedAt: new Date('2025-10-15') },
  { id: 6, name: 'Standing Desk', category: 'furniture', price: 599, rating: 4.6, inStock: true, tags: ['adjustable', 'motorized'], releasedAt: new Date('2025-05-11') },
  { id: 7, name: 'Ultrabook Laptop', category: 'electronics', price: 1249, rating: 4.9, inStock: true, tags: ['ultrabook', 'usb-c'], releasedAt: new Date('2025-11-02') },
  { id: 8, name: 'Wireless Mouse', category: 'electronics', price: 49, rating: 4.2, inStock: true, tags: ['wireless', 'compact'], releasedAt: new Date('2025-04-19') },
  { id: 9, name: 'Desk Organizer', category: 'accessories', price: 29, rating: 3.9, inStock: false, tags: ['storage', 'bamboo'], releasedAt: new Date('2025-03-08') },
  { id: 10, name: 'Portable Monitor', category: 'electronics', price: 219, rating: 4.4, inStock: true, tags: ['usb-c', 'portable'], releasedAt: new Date('2025-12-01') },
];
```

## Multi-Criteria Search

One `$and` expression combining a price range (`$gte`/`$lte`), an array tag match (`$contains`), and a regular expression on the product name:

```typescript
import { filter } from '@mcabreradev/filter';

// Wireless electronics between $100 and $300
filter(products, {
  $and: [
    { price: { $gte: 100 } },
    { price: { $lte: 300 } },
    { tags: { $contains: 'wireless' } }, // any 'wireless' tag
    { name: { $regex: /^(smart|noise)/i } },
  ],
});
// -> [
// ->   { id: 2, name: 'Noise-Cancelling Headphones', price: 249, ... },
// ->   { id: 5, name: 'Smart Home Hub', price: 149, ... }
// -> ]

// Same expression without the name constraint
filter(products, {
  $and: [
    { price: { $gte: 100 } },
    { price: { $lte: 300 } },
    { tags: { $contains: 'wireless' } },
  ],
});
// -> [1, 2, 5] // Mechanical Keyboard, Noise-Cancelling Headphones, Smart Home Hub
```

## Filtering by Date Range

`Date` values are compared by their time value, so a `releasedAt` bound checked with `$gte`/`$lte` uses the same instant semantics as a numeric comparison while remaining null-safe:

```typescript
// Products released between 2025-07-01 and 2025-09-30 (inclusive)
const from = new Date('2025-07-01');
const to = new Date('2025-09-30T23:59:59.999');

filter(products, {
  $and: [
    { releasedAt: { $gte: from } },
    { releasedAt: { $lte: to } },
  ],
});
// -> [
// ->   { id: 1, name: 'Mechanical Keyboard', releasedAt: 2025-08-12, ... },
// ->   { id: 2, name: 'Noise-Cancelling Headphones', releasedAt: 2025-09-30, ... },
// ->   { id: 4, name: 'Laptop Backpack', releasedAt: 2025-07-21, ... }
// -> ]

// Dates at the same instant compare as equal
filter([{ t: new Date('2025-07-01T00:00:00Z') }, { t: new Date('2025-07-02T00:00:00Z') }], {
  t: { $eq: new Date('2025-07-01T00:00:00Z') },
});
// -> [{ t: 2025-07-01T00:00:00Z }]
```

> **Note:** Dates compare by their time value, not by object identity. Two `Date` instances created for the same instant are treated as equal by the range operators.

## Paginated Results with `usePaginatedFilter`

The React binding filters and paginates in one call. `currentPage` starts at 1, and `goToPage`/`nextPage`/`previousPage` clamp to the valid range:

```typescript
import { useState } from 'react';
import { usePaginatedFilter } from '@mcabreradev/filter/react';

const Dashboard = ({ products }: { products: Product[] }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const { filtered, isFiltering, currentPage, totalItems, totalPages, nextPage, previousPage, goToPage } =
    usePaginatedFilter<Product>(products, { inStock: { $eq: true } }, pageSize);

  // totalItems is the number of matching products (all in-stock items)
  // totalPages is ceil(totalItems / pageSize)

  const changePage = (target: number) => {
    setPage(target);
    goToPage(target); // clamps to [1, totalPages]
  };

  return (
    <div>
      <ProductGrid products={filtered} />
      <Pagination
        current={currentPage}
        total={totalPages}
        onNext={nextPage}
        onPrevious={previousPage}
        onGoTo={changePage}
      />
      <PageSizeSelector value={pageSize} onChange={setPageSize} />
      {isFiltering && <Spinner />}
    </div>
  );
};
```

With the seed dataset, `{ inStock: { $eq: true } }` matches ids `[1, 2, 4, 5, 6, 7, 8, 10]`, so with `pageSize` of 3:

```typescript
// -> currentPage: 1, totalItems: 8, totalPages: 3
// -> page 1: ids [1, 2, 4]   (first 3 in-stock products)
// -> page 2: ids [5, 6, 7]
// -> page 3: ids [8, 10]
// -> goToPage(9)  -> currentPage: 3 (clamped)
// -> previousPage -> currentPage: 2
// -> setPageSize(6) -> currentPage: 1, totalPages: 2
```

## Cache Invalidation After a Data Refresh

The filter cache is enabled per-call with the `enableCache` option. Since the cache is keyed on the array reference plus the expression, a refresh that replaces the dataset with a new array needs to invalidate the old entries:

```typescript
import { filter, clearFilterCache } from '@mcabreradev/filter';

// Initial catalog
const catalog: Product[] = [
  { id: 1, name: 'Mechanical Keyboard', price: 129, tags: ['wireless', 'mechanical'], inStock: true, rating: 4.7, category: 'electronics', releasedAt: new Date('2025-08-12') },
  { id: 2, name: 'Noise-Cancelling Headphones', price: 249, tags: ['wireless', 'over-ear'], inStock: true, rating: 4.8, category: 'electronics', releasedAt: new Date('2025-09-30') },
  { id: 3, name: 'Desk Organizer', price: 29, tags: ['storage', 'bamboo'], inStock: true, rating: 3.9, category: 'accessories', releasedAt: new Date('2025-03-08') },
];

const onRefresh = async () => {
  const fresh = await fetchCatalog(); // new array reference

  // Invalidate stale cache entries before serving fresh data
  clearFilterCache();

  const sale = filter(fresh, { price: { $gte: 200 } }, { enableCache: true });
  console.log(sale); // -> [{ id: 2, name: 'Noise-Cancelling Headphones', price: 249, ... }]
};
```

> **Note:** `clearFilterCache()` is imported from the package root (`@mcabreradev/filter`) and clears both the result cache and the memoized predicate/regex caches. Call it whenever the source data is refreshed so the cache cannot serve stale results.

## Related Resources

- [E-Commerce Examples](/examples/ecommerce) — per-feature snippets for the same domain
- [Recipes](/recipes/) — reusable patterns for real-world filtering
- [React Integration](/frameworks/react) — the `useFilter` / `usePaginatedFilter` family
