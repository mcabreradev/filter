# Next.js Integration

Guide for using @mcabreradev/filter with Next.js.

## Overview

@mcabreradev/filter works seamlessly with both Next.js App Router and Pages Router, supporting both client-side and server-side filtering.

## Installation

```bash
# Using npm
npm install @mcabreradev/filter

# Using yarn
yarn add @mcabreradev/filter

# Using pnpm
pnpm add @mcabreradev/filter

## App Router (Next.js 13+)

### Client Components

Use the `'use client'` directive for interactive filtering.

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useFilter } from '@mcabreradev/filter/react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('');

  const expression = useMemo(() => ({
    category: { $eq: category }
  }), [category]);

  const { filtered, isFiltering } = useFilter(products, expression, {
    memoize: true
  });

  return (
    <div>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      {isFiltering ? (
        <div>Loading...</div>
      ) : (
        <div>
          {filtered.map(product => (
            <div key={product.id}>{product.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Server Components

Filter data on the server before rendering.

```typescript
import { filter } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { category?: string; minPrice?: string };
}) {
  const products = await getProducts();

  const expression = {
    ...(searchParams.category && {
      category: { $eq: searchParams.category }
    }),
    ...(searchParams.minPrice && {
      price: { $gte: Number(searchParams.minPrice) }
    })
  };

  const filtered = filter(products, expression);

  return (
    <div>
      <h1>Products</h1>
      <div>
        {filtered.map(product => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Server Actions

Use Server Actions for filtering with form submissions.

```typescript
'use server';

import { filter } from '@mcabreradev/filter';
import type { Expression } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export async function filterProducts(formData: FormData) {
  const category = formData.get('category') as string;
  const minPrice = formData.get('minPrice') as string;

  const products = await getProducts();

  const expression: Expression<Product> = {
    $and: [
      category && { category: { $eq: category } },
      minPrice && { price: { $gte: Number(minPrice) } }
    ].filter(Boolean)
  };

  return filter(products, expression);
}
```

```typescript
'use client';

import { filterProducts } from './actions';

export default function FilterForm() {
  async function handleSubmit(formData: FormData) {
    const results = await filterProducts(formData);
    console.log(results);
  }

  return (
    <form action={handleSubmit}>
      <select name="category">
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
      </select>
      <input type="number" name="minPrice" placeholder="Min price" />
      <button type="submit">Filter</button>
    </form>
  );
}
```

### API Routes

Create API endpoints for filtering.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { filter } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');

  const products: Product[] = await getProducts();

  const expression = {
    ...(category && { category: { $eq: category } }),
    ...(minPrice && { price: { $gte: Number(minPrice) } })
  };

  const filtered = filter(products, expression);

  return NextResponse.json({ products: filtered });
}
```

## Pages Router (Next.js 12 and below)

### Client-Side Filtering

```typescript
import { useState, useMemo } from 'react';
import { useFilter } from '@mcabreradev/filter/react';
import type { NextPage } from 'next';

interface Product {
  id: number;
  name: string;
  price: number;
}

const ProductsPage: NextPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const expression = useMemo(() => ({
    name: { $regex: new RegExp(searchTerm, 'i') }
  }), [searchTerm]);

  const { filtered } = useFilter(products, expression);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
      />
      <div>
        {filtered.map(product => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
```

### Server-Side Rendering (SSR)

```typescript
import { filter } from '@mcabreradev/filter';
import type { GetServerSideProps, NextPage } from 'next';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Props {
  products: Product[];
}

const ProductsPage: NextPage<Props> = ({ products }) => {
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { category, minPrice } = context.query;

  const res = await fetch('https://api.example.com/products');
  const allProducts: Product[] = await res.json();

  const expression = {
    ...(category && { category: { $eq: category as string } }),
    ...(minPrice && { price: { $gte: Number(minPrice) } })
  };

  const products = filter(allProducts, expression);

  return {
    props: {
      products
    }
  };
};

export default ProductsPage;
```

### Static Site Generation (SSG)

```typescript
import { filter } from '@mcabreradev/filter';
import type { GetStaticProps, GetStaticPaths, NextPage } from 'next';

interface Product {
  id: number;
  name: string;
  category: string;
}

interface Props {
  products: Product[];
  category: string;
}

const CategoryPage: NextPage<Props> = ({ products, category }) => {
  return (
    <div>
      <h1>{category}</h1>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = ['electronics', 'clothing', 'books'];

  return {
    paths: categories.map(category => ({
      params: { category }
    })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const category = context.params?.category as string;

  const res = await fetch('https://api.example.com/products');
  const allProducts: Product[] = await res.json();

  const products = filter(allProducts, {
    category: { $eq: category }
  });

  return {
    props: {
      products,
      category
    },
    revalidate: 60
  };
};

export default CategoryPage;
```

### API Routes (Pages Router)

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { filter } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { category, minPrice, maxPrice } = req.query;

  const products: Product[] = await getProducts();

  const expression = {
    $and: [
      category && { category: { $eq: category as string } },
      minPrice && { price: { $gte: Number(minPrice) } },
      maxPrice && { price: { $lte: Number(maxPrice) } }
    ].filter(Boolean)
  };

  const filtered = filter(products, expression);

  res.status(200).json({ products: filtered });
}
```

## Advanced Patterns

### Search with Pagination

```typescript
'use client';

import { useState, useMemo } from 'react';
import { usePaginatedFilter } from '@mcabreradev/filter/react';

export default function ProductSearch() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  const expression = useMemo(() => {
    const conditions = [];

    if (searchTerm) {
      conditions.push({
        name: { $regex: new RegExp(searchTerm, 'i') }
      });
    }

    if (category) {
      conditions.push({
        category: { $eq: category }
      });
    }

    return conditions.length > 0 ? { $and: conditions } : {};
  }, [searchTerm, category]);

  const {
    filtered,
    currentPage,
    totalPages,
    nextPage,
    previousPage
  } = usePaginatedFilter(products, expression, 20, {
    memoize: true
  });

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
      </select>

      <div>
        {filtered.map(product => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>

      <div>
        <button onClick={previousPage} disabled={currentPage === 1}>
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

### Debounced Search

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useDebouncedFilter } from '@mcabreradev/filter/react';

export default function DebouncedSearch() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const expression = useMemo(() => ({
    name: { $regex: new RegExp(searchTerm, 'i') }
  }), [searchTerm]);

  const { filtered, isPending } = useDebouncedFilter(products, expression, {
    delay: 300,
    memoize: true
  });

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      {isPending && <span>Searching...</span>}

      <div>
        {filtered.map(product => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    </div>
  );
}
```

### URL Query Parameters

```typescript
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useFilter } from '@mcabreradev/filter/react';

export default function FilterWithURL() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';

  const expression = useMemo(() => ({
    $and: [
      category && { category: { $eq: category } },
      minPrice && { price: { $gte: Number(minPrice) } }
    ].filter(Boolean)
  }), [category, minPrice]);

  const { filtered } = useFilter(products, expression);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <select
        value={category}
        onChange={(e) => updateFilter('category', e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
      </select>

      <input
        type="number"
        value={minPrice}
        onChange={(e) => updateFilter('minPrice', e.target.value)}
        placeholder="Min price"
      />

      <div>
        {filtered.map(product => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    </div>
  );
}
```

## TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Performance Tips

### 1. Enable Memoization

```typescript
const { filtered } = useFilter(data, expression, {
  memoize: true
});
```

### 2. Use Server Components When Possible

Render filtered data on the server to reduce client bundle size.

### 3. Implement Pagination

```typescript
const { filtered } = usePaginatedFilter(data, expression, 50);
```

### 4. Debounce User Input

```typescript
const { filtered } = useDebouncedFilter(data, expression, {
  delay: 300
});
```

## Related Resources

- [React Integration](/frameworks/react)
- [Best Practices](/guide/best-practices)
- [Examples](/examples/basic-usage)
- [API Reference](/api/core)

