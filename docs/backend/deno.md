---
title: Deno Integration
description: Use @mcabreradev/filter with Deno and Oak framework
---

# Deno Integration

Complete guide for integrating `@mcabreradev/filter` with Deno applications.

## Installation

Import directly from npm using the `npm:` specifier:

```typescript
import { filter, validateExpression } from 'npm:@mcabreradev/filter';
```

Or use esm.sh CDN:

```typescript
import { filter } from 'https://esm.sh/@mcabreradev/filter';
```

## Oak Framework

### Basic Usage

```typescript
import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { filter } from 'npm:@mcabreradev/filter';

const router = new Router();

router.get('/api/products', async (ctx) => {
  const products = await db.products.find();
  const filterQuery = ctx.request.url.searchParams.get('filter');
  
  if (filterQuery) {
    const expression = JSON.parse(filterQuery);
    ctx.response.body = filter(products, expression);
  } else {
    ctx.response.body = products;
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log('Server running on http://localhost:8000');
await app.listen({ port: 8000 });
```

### Validation Middleware

```typescript
import { Context, Next } from 'https://deno.land/x/oak/mod.ts';
import { 
  validateExpression, 
  InvalidExpressionError 
} from 'npm:@mcabreradev/filter';

async function validateFilter(ctx: Context, next: Next) {
  const filterQuery = ctx.request.url.searchParams.get('filter');
  
  if (filterQuery) {
    try {
      const expression = JSON.parse(filterQuery);
      ctx.state.filter = validateExpression(expression);
    } catch (error) {
      if (error instanceof InvalidExpressionError) {
        ctx.response.status = 400;
        ctx.response.body = { 
          error: 'Invalid filter expression',
          message: error.message 
        };
        return;
      }
      ctx.response.status = 400;
      ctx.response.body = { error: 'Invalid JSON' };
      return;
    }
  }
  
  await next();
}

app.use(validateFilter);

router.get('/api/products', async (ctx) => {
  const products = await db.products.find();
  
  if (ctx.state.filter) {
    ctx.response.body = filter(products, ctx.state.filter);
  } else {
    ctx.response.body = products;
  }
});
```

### Error Handling

```typescript
import { 
  filter, 
  InvalidExpressionError,
  ValidationError 
} from 'npm:@mcabreradev/filter';

router.get('/api/products', async (ctx) => {
  try {
    const products = await db.products.find();
    const filterQuery = ctx.request.url.searchParams.get('filter');
    
    if (filterQuery) {
      const expression = JSON.parse(filterQuery);
      ctx.response.body = filter(products, expression);
    } else {
      ctx.response.body = products;
    }
  } catch (error) {
    if (error instanceof InvalidExpressionError) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: 'Invalid filter expression',
        message: error.message,
        code: error.code
      };
    } else if (error instanceof SyntaxError) {
      ctx.response.status = 400;
      ctx.response.body = { error: 'Invalid JSON' };
    } else {
      ctx.response.status = 500;
      ctx.response.body = { error: 'Internal server error' };
    }
  }
});
```

## Fresh Framework

### Basic Usage

```typescript
import { Handlers } from '$fresh/server.ts';
import { filter } from 'npm:@mcabreradev/filter';

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const filterQuery = url.searchParams.get('filter');
    
    const products = await getProducts();
    
    const filtered = filterQuery
      ? filter(products, JSON.parse(filterQuery))
      : products;
    
    return new Response(JSON.stringify(filtered), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
```

### With Validation

```typescript
import { Handlers } from '$fresh/server.ts';
import { 
  filter, 
  validateExpression,
  InvalidExpressionError 
} from 'npm:@mcabreradev/filter';

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      const url = new URL(req.url);
      const filterQuery = url.searchParams.get('filter');
      
      const products = await getProducts();
      
      if (!filterQuery) {
        return new Response(JSON.stringify(products), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      const expression = JSON.parse(filterQuery);
      const validated = validateExpression(expression);
      const filtered = filter(products, validated);
      
      return new Response(JSON.stringify(filtered), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      if (error instanceof InvalidExpressionError) {
        return new Response(
          JSON.stringify({
            error: 'Invalid filter expression',
            message: error.message
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
```

## Complete Example

```typescript
import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { 
  filter, 
  validateExpression,
  InvalidExpressionError 
} from 'npm:@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 1200, category: 'Electronics', inStock: true },
  { id: 2, name: 'Mouse', price: 25, category: 'Electronics', inStock: true },
  { id: 3, name: 'Keyboard', price: 75, category: 'Electronics', inStock: false },
];

const router = new Router();

router.get('/api/products', (ctx) => {
  try {
    const filterQuery = ctx.request.url.searchParams.get('filter');
    
    if (!filterQuery) {
      ctx.response.body = {
        success: true,
        count: products.length,
        data: products
      };
      return;
    }
    
    const expression = JSON.parse(filterQuery);
    const validated = validateExpression(expression);
    const filtered = filter(products, validated);
    
    ctx.response.body = {
      success: true,
      count: filtered.length,
      data: filtered
    };
  } catch (error) {
    if (error instanceof InvalidExpressionError) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        error: 'Invalid filter expression',
        message: error.message
      };
    } else {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        error: 'Internal server error'
      };
    }
  }
});

const app = new Application();

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get('X-Response-Time');
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log('Server running on http://localhost:8000');
await app.listen({ port: 8000 });
```

## Import Maps

Create `import_map.json` for cleaner imports:

```json
{
  "imports": {
    "filter": "npm:@mcabreradev/filter",
    "oak": "https://deno.land/x/oak/mod.ts"
  }
}
```

Then use:

```typescript
import { filter } from 'filter';
import { Application, Router } from 'oak';
```

Run with:

```bash
deno run --allow-net --import-map=import_map.json server.ts
```

## Deployment

### Deno Deploy

```typescript
import { serve } from 'https://deno.land/std/http/server.ts';
import { filter } from 'npm:@mcabreradev/filter';

serve((req) => {
  const url = new URL(req.url);
  const filterQuery = url.searchParams.get('filter');
  
  const products = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
  ];
  
  const filtered = filterQuery
    ? filter(products, JSON.parse(filterQuery))
    : products;
  
  return new Response(JSON.stringify(filtered), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

## Best Practices

1. **Use import maps** - Simplify imports with import_map.json
2. **Type safety** - Leverage Deno's built-in TypeScript support
3. **Validation** - Always validate filter expressions
4. **Error handling** - Use try-catch for JSON parsing
5. **Permissions** - Use minimal required permissions
6. **Edge caching** - Implement caching for static filters
7. **Logging** - Log filter queries for debugging
8. **Security** - Sanitize user input

## Performance Tips

```typescript
import { filter, getPerformanceMonitor } from 'npm:@mcabreradev/filter';

router.get('/api/products', async (ctx) => {
  const products = await db.products.find();
  const filterQuery = ctx.request.url.searchParams.get('filter');
  
  if (filterQuery) {
    const expression = JSON.parse(filterQuery);
    const filtered = filter(products, expression, {
      enableCache: true,
      enablePerformanceMonitoring: true
    });
    
    const monitor = getPerformanceMonitor();
    const metrics = monitor.getSummary();
    
    ctx.response.body = {
      data: filtered,
      _meta: {
        count: filtered.length,
        performance: metrics
      }
    };
  } else {
    ctx.response.body = products;
  }
});
```

## See Also

- [Express.js Integration](/backend/express)
- [NestJS Integration](/backend/nestjs)
- [Error Handling](/advanced/error-handling)
- [Performance Monitoring](/advanced/performance-monitoring)
