---
title: Express.js Integration
description: Use @mcabreradev/filter with Express.js for powerful API filtering
---

# Express.js Integration

Complete guide for integrating `@mcabreradev/filter` with Express.js applications.

## Installation

```bash
npm install @mcabreradev/filter express
```

## Basic Usage

```typescript
import express from 'express';
import { filter, validateExpression } from '@mcabreradev/filter';

const app = express();
app.use(express.json());

app.get('/api/products', async (req, res) => {
  const products = await db.products.find();
  
  try {
    const expression = req.query.filter 
      ? JSON.parse(req.query.filter as string)
      : {};
    
    const validExpression = validateExpression(expression);
    const filtered = filter(products, validExpression);
    
    res.json(filtered);
  } catch (error) {
    res.status(400).json({ error: 'Invalid filter expression' });
  }
});

app.listen(3000);
```

## Query Parameter Examples

```bash
# Simple filtering
GET /api/products?filter=Electronics

# Object-based filtering
GET /api/products?filter={"category":"Electronics","inStock":true}

# MongoDB operators
GET /api/products?filter={"price":{"$gte":100,"$lte":500}}

# Complex queries
GET /api/products?filter={"$and":[{"category":"Electronics"},{"rating":{"$gte":4.5}}]}
```

## Advanced Patterns

### REST API with Filtering, Sorting, and Pagination

```typescript
import express from 'express';
import { filter } from '@mcabreradev/filter';

interface QueryParams {
  filter?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

app.get('/api/products', async (req, res) => {
  const { filter: filterExpr, sort, page = '1', limit = '20' } = req.query as QueryParams;
  
  let products = await db.products.find();
  
  if (filterExpr) {
    const expression = JSON.parse(filterExpr);
    products = filter(products, expression);
  }
  
  if (sort) {
    const [field, order] = sort.split(':');
    products.sort((a, b) => {
      if (order === 'desc') return b[field] - a[field];
      return a[field] - b[field];
    });
  }
  
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  const paginated = products.slice(start, end);
  
  res.json({
    data: paginated,
    total: products.length,
    page: pageNum,
    pages: Math.ceil(products.length / limitNum)
  });
});
```

### Validation Middleware

```typescript
import { validateExpression, InvalidExpressionError } from '@mcabreradev/filter';

const validateFilterMiddleware = (req, res, next) => {
  if (req.query.filter) {
    try {
      const expression = JSON.parse(req.query.filter as string);
      req.validatedFilter = validateExpression(expression);
      next();
    } catch (error) {
      if (error instanceof InvalidExpressionError) {
        return res.status(400).json({
          error: 'Invalid filter expression',
          details: error.message
        });
      }
      return res.status(400).json({ error: 'Malformed JSON' });
    }
  } else {
    next();
  }
};

app.get('/api/products', validateFilterMiddleware, async (req, res) => {
  const products = await db.products.find();
  const filtered = req.validatedFilter 
    ? filter(products, req.validatedFilter)
    : products;
  res.json(filtered);
});
```

### Security: Sanitization

```typescript
import { filter } from '@mcabreradev/filter';

const ALLOWED_OPERATORS = ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$contains'];
const ALLOWED_FIELDS = ['name', 'price', 'category', 'rating', 'inStock'];

function sanitizeExpression(expr: any): any {
  if (typeof expr !== 'object' || expr === null) return expr;
  
  const sanitized: any = {};
  for (const [key, value] of Object.entries(expr)) {
    if (key.startsWith('$') && !ALLOWED_OPERATORS.includes(key)) {
      continue;
    }
    if (!key.startsWith('$') && !ALLOWED_FIELDS.includes(key)) {
      continue;
    }
    sanitized[key] = typeof value === 'object' 
      ? sanitizeExpression(value) 
      : value;
  }
  return sanitized;
}

app.get('/api/products', async (req, res) => {
  const products = await db.products.find();
  const rawExpression = req.query.filter 
    ? JSON.parse(req.query.filter as string) 
    : {};
  const expression = sanitizeExpression(rawExpression);
  const filtered = filter(products, expression);
  res.json(filtered);
});
```

### Caching for Performance

```typescript
import { filter } from '@mcabreradev/filter';

const cache = new Map<string, any>();
const CACHE_TTL = 60000;

app.get('/api/products', async (req, res) => {
  const filterKey = req.query.filter || 'all';
  
  if (cache.has(filterKey)) {
    return res.json(cache.get(filterKey));
  }
  
  const products = await db.products.find();
  const expression = req.query.filter ? JSON.parse(req.query.filter as string) : {};
  const filtered = filter(products, expression, { enableCache: true });
  
  cache.set(filterKey, filtered);
  setTimeout(() => cache.delete(filterKey), CACHE_TTL);
  
  res.json(filtered);
});
```

### Error Handling

```typescript
import { 
  filter, 
  FilterError, 
  InvalidExpressionError,
  ValidationError 
} from '@mcabreradev/filter';

app.get('/api/products', async (req, res) => {
  try {
    const products = await db.products.find();
    const expression = req.query.filter 
      ? JSON.parse(req.query.filter as string) 
      : {};
    
    const filtered = filter(products, expression);
    res.json(filtered);
  } catch (error) {
    if (error instanceof InvalidExpressionError) {
      return res.status(400).json({
        error: 'Invalid filter expression',
        message: error.message,
        code: error.code
      });
    }
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message
      });
    }
    
    if (error instanceof SyntaxError) {
      return res.status(400).json({
        error: 'Invalid JSON in filter parameter'
      });
    }
    
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### TypeScript Types

```typescript
import { Request, Response, NextFunction } from 'express';
import { Expression } from '@mcabreradev/filter';

interface FilterRequest extends Request {
  validatedFilter?: Expression;
}

const validateFilter = (req: FilterRequest, res: Response, next: NextFunction) => {
  if (req.query.filter) {
    try {
      const expression = JSON.parse(req.query.filter as string);
      req.validatedFilter = expression;
      next();
    } catch {
      res.status(400).json({ error: 'Invalid filter' });
    }
  } else {
    next();
  }
};

app.get('/api/products', validateFilter, async (req: FilterRequest, res: Response) => {
  const products = await db.products.find();
  const filtered = req.validatedFilter 
    ? filter(products, req.validatedFilter)
    : products;
  res.json(filtered);
});
```

## Complete Example

```typescript
import express from 'express';
import { filter, validateExpression, InvalidExpressionError } from '@mcabreradev/filter';

const app = express();

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  inStock: boolean;
}

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 1200, category: 'Electronics', rating: 4.5, inStock: true },
  { id: 2, name: 'Mouse', price: 25, category: 'Electronics', rating: 4.2, inStock: true },
  { id: 3, name: 'Keyboard', price: 75, category: 'Electronics', rating: 4.7, inStock: false },
];

app.get('/api/products', (req, res) => {
  try {
    let result = products;
    
    if (req.query.filter) {
      const expression = JSON.parse(req.query.filter as string);
      const validated = validateExpression(expression);
      result = filter(result, validated);
    }
    
    res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    if (error instanceof InvalidExpressionError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filter expression',
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## Best Practices

1. **Always validate user input** - Use `validateExpression` before filtering
2. **Sanitize expressions** - Remove dangerous operators or fields
3. **Set rate limits** - Prevent abuse of complex queries
4. **Cache results** - Enable caching for repeated queries
5. **Use pagination** - Don't return entire datasets
6. **Log filter queries** - Monitor for performance issues
7. **Type safety** - Use TypeScript interfaces for requests
8. **Error handling** - Provide clear error messages

## Performance Tips

```typescript
import { filter, getPerformanceMonitor } from '@mcabreradev/filter';

app.get('/api/products', async (req, res) => {
  const products = await db.products.find();
  const expression = req.query.filter ? JSON.parse(req.query.filter as string) : {};
  
  const filtered = filter(products, expression, {
    enableCache: true,
    enablePerformanceMonitoring: true
  });
  
  const monitor = getPerformanceMonitor();
  const metrics = monitor.getSummary();
  
  res.json({
    data: filtered,
    _meta: {
      count: filtered.length,
      performance: metrics
    }
  });
});
```

## See Also

- [NestJS Integration](/backend/nestjs)
- [Deno Integration](/backend/deno)
- [Error Handling](/advanced/error-handling)
- [Performance Monitoring](/advanced/performance-monitoring)
