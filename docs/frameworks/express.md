# Express.js Integration

Guide for using @mcabreradev/filter with Express.js and Node.js.

## Overview

@mcabreradev/filter integrates seamlessly with Express.js applications, enabling powerful filtering capabilities for REST APIs, middleware, and database queries.

## Installation

```bash
npm install @mcabreradev/filter express
npm install --save-dev @types/express typescript

pnpm add @mcabreradev/filter express
pnpm add -D @types/express typescript

yarn add @mcabreradev/filter express
yarn add -D @types/express typescript
```

## Basic REST API Filtering

### Simple GET Endpoint

```typescript
import express from 'express';
import { filter } from '@mcabreradev/filter';
import type { Expression } from '@mcabreradev/filter';

const app = express();
app.use(express.json());

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: string;
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', role: 'user' }
];

app.get('/api/users', (req, res) => {
  const expression: Expression<User> = {
    status: { $eq: 'active' }
  };

  const filtered = filter(users, expression);

  res.json({
    success: true,
    data: filtered,
    count: filtered.length
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Query Parameter Filtering

### Dynamic Filtering from URL Parameters

```typescript
app.get('/api/users', (req, res) => {
  const { status, role, search } = req.query;

  const conditions: any[] = [];

  if (status) {
    conditions.push({ status: { $eq: status as string } });
  }

  if (role) {
    conditions.push({ role: { $eq: role as string } });
  }

  if (search) {
    conditions.push({
      $or: [
        { name: { $regex: new RegExp(search as string, 'i') } },
        { email: { $regex: new RegExp(search as string, 'i') } }
      ]
    });
  }

  const expression: Expression<User> =
    conditions.length > 0 ? { $and: conditions } : {};

  const filtered = filter(users, expression);

  res.json({
    success: true,
    data: filtered,
    count: filtered.length
  });
});
```

### Advanced Query Parameters

```typescript
interface QueryParams {
  status?: string;
  role?: string;
  minId?: string;
  search?: string;
  sortBy?: 'name' | 'email' | 'id';
  order?: 'asc' | 'desc';
}

app.get('/api/users', (req, res) => {
  const { status, role, minId, search, sortBy, order } = req.query as QueryParams;

  const conditions: any[] = [];

  if (status) {
    conditions.push({ status: { $eq: status } });
  }

  if (role) {
    conditions.push({ role: { $eq: role } });
  }

  if (minId) {
    conditions.push({ id: { $gte: parseInt(minId) } });
  }

  if (search) {
    conditions.push({
      $or: [
        { name: { $regex: new RegExp(search, 'i') } },
        { email: { $regex: new RegExp(search, 'i') } }
      ]
    });
  }

  const expression: Expression<User> =
    conditions.length > 0 ? { $and: conditions } : {};

  let filtered = filter(users, expression);

  if (sortBy) {
    filtered = filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return order === 'desc' ? -comparison : comparison;
    });
  }

  res.json({
    success: true,
    data: filtered,
    count: filtered.length
  });
});
```

## Request Body Filtering

### POST Endpoint with Complex Expressions

```typescript
app.post('/api/users/filter', (req, res) => {
  try {
    const expression: Expression<User> = req.body.expression;

    if (!expression || typeof expression !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid expression provided'
      });
    }

    const filtered = filter(users, expression);

    res.json({
      success: true,
      data: filtered,
      count: filtered.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to filter users'
    });
  }
});
```

## Middleware Integration

### Filter Middleware

```typescript
import { Request, Response, NextFunction } from 'express';

interface FilterMiddlewareOptions {
  dataKey: string;
  expressionKey?: string;
}

function filterMiddleware(options: FilterMiddlewareOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { dataKey, expressionKey = 'expression' } = options;

    const data = (req as any)[dataKey];
    const expression = req.body[expressionKey] || {};

    if (!data || !Array.isArray(data)) {
      return next();
    }

    try {
      const filtered = filter(data, expression);
      (req as any).filtered = filtered;
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Invalid filter expression'
      });
    }
  };
}

app.post('/api/users/filter',
  (req, res, next) => {
    (req as any).users = users;
    next();
  },
  filterMiddleware({ dataKey: 'users' }),
  (req, res) => {
    res.json({
      success: true,
      data: (req as any).filtered
    });
  }
);
```

### Validation Middleware

```typescript
function validateExpression(req: Request, res: Response, next: NextFunction) {
  const expression = req.body.expression;

  if (!expression) {
    return res.status(400).json({
      success: false,
      error: 'Expression is required'
    });
  }

  if (typeof expression !== 'object' || Array.isArray(expression)) {
    return res.status(400).json({
      success: false,
      error: 'Expression must be an object'
    });
  }

  next();
}

app.post('/api/users/filter',
  validateExpression,
  (req, res) => {
    const filtered = filter(users, req.body.expression);
    res.json({ success: true, data: filtered });
  }
);
```

## Database Integration

### MongoDB Example

```typescript
import { MongoClient } from 'mongodb';
import { filter } from '@mcabreradev/filter';

const client = new MongoClient('mongodb://localhost:27017');

app.get('/api/products', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('myapp');
    const collection = db.collection('products');

    const allProducts = await collection.find({}).toArray();

    const { category, minPrice, maxPrice, inStock } = req.query;

    const conditions: any[] = [];

    if (category) {
      conditions.push({ category: { $eq: category as string } });
    }

    if (minPrice) {
      conditions.push({ price: { $gte: parseFloat(minPrice as string) } });
    }

    if (maxPrice) {
      conditions.push({ price: { $lte: parseFloat(maxPrice as string) } });
    }

    if (inStock === 'true') {
      conditions.push({ inStock: { $eq: true } });
    }

    const expression = conditions.length > 0 ? { $and: conditions } : {};
    const filtered = filter(allProducts, expression);

    res.json({
      success: true,
      data: filtered,
      count: filtered.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Database error'
    });
  }
});
```

### PostgreSQL with Prisma

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany();

    const { status, role, search } = req.query;

    const conditions: any[] = [];

    if (status) {
      conditions.push({ status: { $eq: status as string } });
    }

    if (role) {
      conditions.push({ role: { $eq: role as string } });
    }

    if (search) {
      conditions.push({
        $or: [
          { name: { $regex: new RegExp(search as string, 'i') } },
          { email: { $regex: new RegExp(search as string, 'i') } }
        ]
      });
    }

    const expression = conditions.length > 0 ? { $and: conditions } : {};
    const filtered = filter(allUsers, expression);

    res.json({
      success: true,
      data: filtered,
      count: filtered.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Database error'
    });
  } finally {
    await prisma.$disconnect();
  }
});
```

## Advanced Patterns

### Pagination with Filtering

```typescript
interface PaginationParams {
  page?: string;
  limit?: string;
  status?: string;
  role?: string;
}

app.get('/api/users', (req, res) => {
  const { page = '1', limit = '10', status, role } = req.query as PaginationParams;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const conditions: any[] = [];

  if (status) {
    conditions.push({ status: { $eq: status } });
  }

  if (role) {
    conditions.push({ role: { $eq: role } });
  }

  const expression = conditions.length > 0 ? { $and: conditions } : {};
  const filtered = filter(users, expression);

  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginated = filtered.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginated,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limitNum),
      hasNext: endIndex < filtered.length,
      hasPrev: pageNum > 1
    }
  });
});
```

### Search Endpoint with Debouncing

```typescript
import { createHash } from 'crypto';

const searchCache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_TTL = 5000;

app.get('/api/search', (req, res) => {
  const { q, category, minPrice } = req.query;

  const cacheKey = createHash('md5')
    .update(JSON.stringify(req.query))
    .digest('hex');

  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json({
      success: true,
      data: cached.data,
      cached: true
    });
  }

  const conditions: any[] = [];

  if (q) {
    conditions.push({
      $or: [
        { name: { $regex: new RegExp(q as string, 'i') } },
        { description: { $regex: new RegExp(q as string, 'i') } }
      ]
    });
  }

  if (category) {
    conditions.push({ category: { $eq: category as string } });
  }

  if (minPrice) {
    conditions.push({ price: { $gte: parseFloat(minPrice as string) } });
  }

  const expression = conditions.length > 0 ? { $and: conditions } : {};
  const filtered = filter(users, expression);

  searchCache.set(cacheKey, {
    data: filtered,
    timestamp: Date.now()
  });

  res.json({
    success: true,
    data: filtered,
    cached: false
  });
});
```

### Authentication-Based Filtering

```typescript
interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }

  req.user = { id: 1, role: 'admin' };
  next();
}

app.get('/api/users', authMiddleware, (req: AuthRequest, res) => {
  const userRole = req.user?.role;

  let expression: Expression<User>;

  if (userRole === 'admin') {
    expression = {};
  } else {
    expression = {
      $and: [
        { status: { $eq: 'active' } },
        { id: { $eq: req.user!.id } }
      ]
    };
  }

  const filtered = filter(users, expression);

  res.json({
    success: true,
    data: filtered
  });
});
```

### Error Handling

```typescript
function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.get('/api/users', asyncHandler(async (req: Request, res: Response) => {
  const expression = req.body.expression;

  if (!expression) {
    throw new Error('Expression is required');
  }

  const filtered = filter(users, expression);

  res.json({
    success: true,
    data: filtered
  });
}));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});
```

## Performance Tips

### 1. Enable Memoization

```typescript
import { filter } from '@mcabreradev/filter';

app.get('/api/users', (req, res) => {
  const filtered = filter(users, expression, {
    memoize: true
  });

  res.json({ data: filtered });
});
```

### 2. Implement Caching

```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 });

app.get('/api/users', (req, res) => {
  const cacheKey = JSON.stringify(req.query);
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json({ data: cached, cached: true });
  }

  const filtered = filter(users, expression);
  cache.set(cacheKey, filtered);

  res.json({ data: filtered, cached: false });
});
```

### 3. Use Compression

```typescript
import compression from 'compression';

app.use(compression());
```

### 4. Limit Response Size

```typescript
app.get('/api/users', (req, res) => {
  const filtered = filter(users, expression);

  const limited = filtered.slice(0, 100);

  res.json({
    data: limited,
    total: filtered.length,
    hasMore: filtered.length > 100
  });
});
```

## TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Testing

### Unit Tests with Jest

```typescript
import request from 'supertest';
import express from 'express';
import { filter } from '@mcabreradev/filter';

describe('User API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.get('/api/users', (req, res) => {
      const expression = { status: { $eq: 'active' } };
      const filtered = filter(users, expression);
      res.json({ data: filtered });
    });
  });

  it('should filter active users', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200);

    expect(response.body.data).toHaveLength(2);
    expect(response.body.data.every((u: User) => u.status === 'active')).toBe(true);
  });

  it('should handle query parameters', async () => {
    const response = await request(app)
      .get('/api/users?status=active&role=admin')
      .expect(200);

    expect(response.body.data).toHaveLength(1);
  });
});
```

## Complete Example

```typescript
import express from 'express';
import { filter } from '@mcabreradev/filter';
import type { Expression } from '@mcabreradev/filter';

const app = express();
app.use(express.json());

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: string;
}

const users: User[] = [];

app.get('/api/users', (req, res) => {
  const { status, role, search, page = '1', limit = '10' } = req.query;

  const conditions: any[] = [];

  if (status) conditions.push({ status: { $eq: status } });
  if (role) conditions.push({ role: { $eq: role } });
  if (search) {
    conditions.push({
      $or: [
        { name: { $regex: new RegExp(search as string, 'i') } },
        { email: { $regex: new RegExp(search as string, 'i') } }
      ]
    });
  }

  const expression: Expression<User> =
    conditions.length > 0 ? { $and: conditions } : {};

  const filtered = filter(users, expression, { memoize: true });

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(startIndex, startIndex + limitNum);

  res.json({
    success: true,
    data: paginated,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limitNum)
    }
  });
});

app.post('/api/users/filter', (req, res) => {
  try {
    const expression: Expression<User> = req.body.expression;
    const filtered = filter(users, expression);

    res.json({
      success: true,
      data: filtered,
      count: filtered.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid expression'
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## Related Resources

- [API Reference](/api/operators)
- [TypeScript Types](/api/types)
- [Best Practices](/guide/best-practices)
- [NestJS Integration](/backend/nestjs)
- [Deno Integration](/backend/deno)

