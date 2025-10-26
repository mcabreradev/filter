---
title: Real-World Examples
description: Practical examples for common use cases
---

# Real-World Examples

Practical examples demonstrating how to use `@mcabreradev/filter` in real-world applications.

## E-commerce Product Filtering

```typescript
import { filter } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  rating: number;
  inStock: boolean;
  tags: string[];
}

const products: Product[] = [...];

const affordableElectronics = filter(products, {
  category: 'Electronics',
  price: { $lte: 1000 },
  rating: { $gte: 4.5 },
  inStock: { $eq: true }
});

const searchResults = filter(products, {
  name: { $contains: 'laptop' },
  brand: { $in: ['Apple', 'Dell', 'HP'] },
  price: { $gte: 500, $lte: 2000 }
});
```

## User Management Dashboard

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  active: boolean;
  lastLogin: Date;
  permissions: string[];
}

const users: User[] = [...];

const activeAdmins = filter(users, {
  active: true,
  role: 'admin'
});

const recentlyActive = filter(users, {
  lastLogin: { $gte: thirtyDaysAgo },
  active: true
});

const usersWithPermission = filter(users, {
  permissions: { $contains: 'write' }
});
```

## Analytics and Reporting

```typescript
interface Order {
  id: string;
  customerId: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  items: string[];
}

const orders: Order[] = [...];

const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const recentHighValue = filter(orders, {
  createdAt: { $gte: thirtyDaysAgo },
  amount: { $gte: 1000 },
  status: { $in: ['completed', 'shipped'] }
});

const pendingOrders = filter(orders, {
  status: 'pending',
  createdAt: { $lt: sevenDaysAgo }
});
```

## Content Management System

```typescript
interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  published: boolean;
  publishedAt: Date;
  views: number;
}

const articles: Article[] = [...];

const popularPublished = filter(articles, {
  published: true,
  views: { $gte: 1000 },
  publishedAt: { $gte: lastMonth }
});

const draftsByAuthor = filter(articles, {
  published: false,
  author: 'john@example.com'
});

const taggedArticles = filter(articles, {
  tags: { $contains: 'typescript' },
  published: true
});
```

## Search Functionality

```typescript
function searchProducts(
  products: Product[],
  searchTerm: string,
  filters: {
    minPrice?: number;
    maxPrice?: number;
    categories?: string[];
    minRating?: number;
  }
) {
  const expression: any = {};

  if (searchTerm) {
    expression.name = { $contains: searchTerm };
  }

  if (filters.minPrice !== undefined) {
    expression.price = { $gte: filters.minPrice };
  }

  if (filters.maxPrice !== undefined) {
    expression.price = {
      ...expression.price,
      $lte: filters.maxPrice
    };
  }

  if (filters.categories && filters.categories.length > 0) {
    expression.category = { $in: filters.categories };
  }

  if (filters.minRating !== undefined) {
    expression.rating = { $gte: filters.minRating };
  }

  return filter(products, expression, { enableCache: true });
}

const results = searchProducts(products, 'laptop', {
  minPrice: 500,
  maxPrice: 2000,
  categories: ['Electronics', 'Computers'],
  minRating: 4.0
});
```

## Inventory Management

```typescript
interface InventoryItem {
  sku: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  supplier: string;
  lastRestocked: Date;
  category: string;
}

const inventory: InventoryItem[] = [...];

const lowStock = filter(inventory, {
  $and: [
    { quantity: { $lte: 10 } },
    { quantity: { $gt: 0 } }
  ]
});

const needsReorder = filter(inventory, (item) =>
  item.quantity <= item.reorderLevel
);

const outOfStock = filter(inventory, {
  quantity: { $eq: 0 }
});
```

## Social Media Feed

```typescript
interface Post {
  id: string;
  authorId: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  createdAt: Date;
  isPublic: boolean;
}

const posts: Post[] = [...];

const trendingPosts = filter(posts, {
  $and: [
    { isPublic: true },
    {
      $or: [
        { likes: { $gte: 100 } },
        { comments: { $gte: 50 } }
      ]
    },
    { createdAt: { $gte: last24Hours } }
  ]
});

const userPosts = filter(posts, {
  authorId: currentUserId,
  createdAt: { $gte: lastWeek }
});
```

## Performance Monitoring

```typescript
import { filter, getFilterCacheStats, clearFilterCache } from '@mcabreradev/filter';

class DataService {
  private cache = true;

  getActiveUsers(users: User[]) {
    return filter(
      users,
      { active: true },
      { enableCache: this.cache }
    );
  }

  getPremiumUsers(users: User[]) {
    return filter(
      users,
      { subscription: 'premium' },
      { enableCache: this.cache }
    );
  }

  refreshCache() {
    clearFilterCache();
  }

  getCacheStats() {
    return getFilterCacheStats();
  }
}
```

## Next Steps

- [Basic Examples](/examples/basic)
- [Advanced Examples](/examples/advanced)
- [Framework Integration](/frameworks/overview)
- [Performance Guide](/performance)

