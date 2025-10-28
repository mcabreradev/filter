# Deno Integration

Guide for using @mcabreradev/filter with Deno.

## Overview

@mcabreradev/filter works seamlessly with Deno, supporting Oak framework, Fresh framework, standard HTTP server, and Deno Deploy edge functions.

## Installation

### Using deno.land/x

```typescript
import { filter } from 'https://deno.land/x/mcabreradev_filter/mod.ts';
import type { Expression } from 'https://deno.land/x/mcabreradev_filter/mod.ts';
```

### Using npm: specifier

```typescript
import { filter } from 'npm:@mcabreradev/filter';
import type { Expression } from 'npm:@mcabreradev/filter';
```

### Using import map (deno.json)

```json
{
  "imports": {
    "@mcabreradev/filter": "npm:@mcabreradev/filter@^5.4.0"
  }
}
```

```typescript
import { filter } from '@mcabreradev/filter';
```

## Oak Framework Integration

### Basic Router

```typescript
import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { filter } from 'npm:@mcabreradev/filter';
import type { Expression } from 'npm:@mcabreradev/filter';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: string;
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', role: 'user' }
];

const router = new Router();

router.get('/api/users', (ctx) => {
  const expression: Expression<User> = {
    status: { $eq: 'active' }
  };

  const filtered = filter(users, expression);

  ctx.response.body = {
    success: true,
    data: filtered,
    count: filtered.length
  };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log('Server running on http://localhost:8000');
await app.listen({ port: 8000 });
```

### Query Parameter Filtering

```typescript
router.get('/api/users', (ctx) => {
  const params = ctx.request.url.searchParams;
  const status = params.get('status');
  const role = params.get('role');
  const search = params.get('search');

  const conditions: any[] = [];

  if (status) {
    conditions.push({ status: { $eq: status } });
  }

  if (role) {
    conditions.push({ role: { $eq: role } });
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

  const filtered = filter(users, expression);

  ctx.response.body = {
    success: true,
    data: filtered,
    count: filtered.length
  };
});
```

### POST with Request Body

```typescript
router.post('/api/users/filter', async (ctx) => {
  try {
    const body = await ctx.request.body().value;
    const expression: Expression<User> = body.expression;

    if (!expression || typeof expression !== 'object') {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        error: 'Invalid expression provided'
      };
      return;
    }

    const filtered = filter(users, expression);

    ctx.response.body = {
      success: true,
      data: filtered,
      count: filtered.length
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      error: 'Failed to filter users'
    };
  }
});
```

## Middleware Patterns

### Filter Middleware

```typescript
import { Context, Next } from 'https://deno.land/x/oak/mod.ts';

interface FilterMiddlewareOptions {
  dataKey: string;
  expressionKey?: string;
}

function filterMiddleware(options: FilterMiddlewareOptions) {
  return async (ctx: Context, next: Next) => {
    const { dataKey, expressionKey = 'expression' } = options;

    const data = (ctx.state as any)[dataKey];
    const body = await ctx.request.body().value;
    const expression = body[expressionKey] || {};

    if (!data || !Array.isArray(data)) {
      return await next();
    }

    try {
      const filtered = filter(data, expression);
      ctx.state.filtered = filtered;
      await next();
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        error: 'Invalid filter expression'
      };
    }
  };
}

router.post('/api/users/filter',
  async (ctx, next) => {
    ctx.state.users = users;
    await next();
  },
  filterMiddleware({ dataKey: 'users' }),
  (ctx) => {
    ctx.response.body = {
      success: true,
      data: ctx.state.filtered
    };
  }
);
```

### Authentication Middleware

```typescript
async function authMiddleware(ctx: Context, next: Next) {
  const token = ctx.request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = {
      success: false,
      error: 'Unauthorized'
    };
    return;
  }

  ctx.state.user = { id: 1, role: 'admin' };
  await next();
}

router.get('/api/users',
  authMiddleware,
  (ctx) => {
    const userRole = ctx.state.user?.role;

    let expression: Expression<User>;

    if (userRole === 'admin') {
      expression = {};
    } else {
      expression = {
        $and: [
          { status: { $eq: 'active' } },
          { id: { $eq: ctx.state.user.id } }
        ]
      };
    }

    const filtered = filter(users, expression);

    ctx.response.body = {
      success: true,
      data: filtered
    };
  }
);
```

## Fresh Framework Integration

### API Route Handler

```typescript
import { Handlers } from '$fresh/server.ts';
import { filter } from 'npm:@mcabreradev/filter';
import type { Expression } from 'npm:@mcabreradev/filter';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const users: User[] = [];

export const handler: Handlers = {
  GET(req, _ctx) {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    const conditions: any[] = [];

    if (status) {
      conditions.push({ status: { $eq: status } });
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

    const filtered = filter(users, expression);

    return new Response(JSON.stringify({
      success: true,
      data: filtered,
      count: filtered.length
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  async POST(req, _ctx) {
    try {
      const body = await req.json();
      const expression: Expression<User> = body.expression;

      const filtered = filter(users, expression);

      return new Response(JSON.stringify({
        success: true,
        data: filtered,
        count: filtered.length
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid request'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
```

## Standard HTTP Server

### Basic Server

```typescript
import { filter } from 'npm:@mcabreradev/filter';
import type { Expression } from 'npm:@mcabreradev/filter';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const users: User[] = [];

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (url.pathname === '/api/users' && req.method === 'GET') {
    const status = url.searchParams.get('status');
    const role = url.searchParams.get('role');

    const conditions: any[] = [];

    if (status) {
      conditions.push({ status: { $eq: status } });
    }

    if (role) {
      conditions.push({ role: { $eq: role } });
    }

    const expression: Expression<User> =
      conditions.length > 0 ? { $and: conditions } : {};

    const filtered = filter(users, expression);

    return new Response(JSON.stringify({
      success: true,
      data: filtered,
      count: filtered.length
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (url.pathname === '/api/users/filter' && req.method === 'POST') {
    try {
      const body = await req.json();
      const expression: Expression<User> = body.expression;

      const filtered = filter(users, expression);

      return new Response(JSON.stringify({
        success: true,
        data: filtered
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid request'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Not Found', { status: 404 });
}

console.log('Server running on http://localhost:8000');
Deno.serve({ port: 8000 }, handler);
```

## Database Integration

### Deno KV

```typescript
const kv = await Deno.openKv();

router.get('/api/users', async (ctx) => {
  const entries = kv.list({ prefix: ['users'] });
  const users: User[] = [];

  for await (const entry of entries) {
    users.push(entry.value as User);
  }

  const params = ctx.request.url.searchParams;
  const status = params.get('status');

  const expression: Expression<User> = status
    ? { status: { $eq: status } }
    : {};

  const filtered = filter(users, expression);

  ctx.response.body = {
    success: true,
    data: filtered
  };
});
```

### PostgreSQL

```typescript
import { Client } from 'https://deno.land/x/postgres/mod.ts';

const client = new Client({
  user: 'user',
  database: 'test',
  hostname: 'localhost',
  port: 5432,
  password: 'password'
});

await client.connect();

router.get('/api/users', async (ctx) => {
  const result = await client.queryObject<User>('SELECT * FROM users');
  const users = result.rows;

  const params = ctx.request.url.searchParams;
  const status = params.get('status');
  const role = params.get('role');

  const conditions: any[] = [];

  if (status) conditions.push({ status: { $eq: status } });
  if (role) conditions.push({ role: { $eq: role } });

  const expression: Expression<User> =
    conditions.length > 0 ? { $and: conditions } : {};

  const filtered = filter(users, expression);

  ctx.response.body = {
    success: true,
    data: filtered
  };
});
```

## Advanced Patterns

### WebSocket Filtering

```typescript
import { WebSocketServer } from 'https://deno.land/x/websocket/mod.ts';

const wss = new WebSocketServer(8080);

wss.on('connection', (ws) => {
  ws.on('message', (message: string) => {
    try {
      const { action, expression } = JSON.parse(message);

      if (action === 'filter') {
        const filtered = filter(users, expression);

        ws.send(JSON.stringify({
          success: true,
          data: filtered
        }));
      }
    } catch (error) {
      ws.send(JSON.stringify({
        success: false,
        error: 'Invalid message'
      }));
    }
  });
});
```

### Server-Sent Events

```typescript
router.get('/api/users/stream', (ctx) => {
  const target = ctx.sendEvents();

  const params = ctx.request.url.searchParams;
  const status = params.get('status');

  const expression: Expression<User> = status
    ? { status: { $eq: status } }
    : {};

  const filtered = filter(users, expression);

  target.dispatchMessage({
    data: JSON.stringify({
      success: true,
      data: filtered
    })
  });
});
```

### Edge Function Filtering (Deno Deploy)

```typescript
import { serve } from 'https://deno.land/std/http/server.ts';
import { filter } from 'npm:@mcabreradev/filter';

serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === '/api/filter') {
    try {
      const body = await req.json();
      const { data, expression } = body;

      if (!Array.isArray(data) || !expression) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid request'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const filtered = filter(data, expression, {
        memoize: true
      });

      return new Response(JSON.stringify({
        success: true,
        data: filtered,
        count: filtered.length
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Processing error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Not Found', { status: 404 });
});
```

### Pagination with Filtering

```typescript
router.get('/api/users', (ctx) => {
  const params = ctx.request.url.searchParams;
  const page = parseInt(params.get('page') || '1');
  const limit = parseInt(params.get('limit') || '10');
  const status = params.get('status');
  const role = params.get('role');

  const conditions: any[] = [];

  if (status) conditions.push({ status: { $eq: status } });
  if (role) conditions.push({ role: { $eq: role } });

  const expression: Expression<User> =
    conditions.length > 0 ? { $and: conditions } : {};

  const filtered = filter(users, expression);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginated = filtered.slice(startIndex, endIndex);

  ctx.response.body = {
    success: true,
    data: paginated,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      hasNext: endIndex < filtered.length,
      hasPrev: page > 1
    }
  };
});
```

## Performance Tips

### 1. Enable Memoization

```typescript
const filtered = filter(users, expression, {
  memoize: true
});
```

### 2. Implement Caching

```typescript
const cache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_TTL = 60000;

router.get('/api/users', (ctx) => {
  const cacheKey = ctx.request.url.search;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    ctx.response.body = {
      success: true,
      data: cached.data,
      cached: true
    };
    return;
  }

  const filtered = filter(users, expression);

  cache.set(cacheKey, {
    data: filtered,
    timestamp: Date.now()
  });

  ctx.response.body = {
    success: true,
    data: filtered,
    cached: false
  };
});
```

### 3. Use Response Compression

```typescript
import { compress } from 'https://deno.land/x/oak_compress/mod.ts';

app.use(compress());
```

### 4. Limit Response Size

```typescript
router.get('/api/users', (ctx) => {
  const filtered = filter(users, expression);
  const limited = filtered.slice(0, 100);

  ctx.response.body = {
    success: true,
    data: limited,
    total: filtered.length,
    hasMore: filtered.length > 100
  };
});
```

## TypeScript Configuration

Create a `deno.json` file:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  },
  "imports": {
    "@mcabreradev/filter": "npm:@mcabreradev/filter@^5.4.0",
    "oak": "https://deno.land/x/oak@v12.6.1/mod.ts"
  },
  "tasks": {
    "dev": "deno run --allow-net --allow-read --watch server.ts",
    "start": "deno run --allow-net --allow-read server.ts"
  }
}
```

## Testing

### Basic Test

```typescript
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { filter } from 'npm:@mcabreradev/filter';

Deno.test('filter users by status', () => {
  const users = [
    { id: 1, name: 'John', status: 'active' },
    { id: 2, name: 'Jane', status: 'inactive' }
  ];

  const expression = { status: { $eq: 'active' } };
  const filtered = filter(users, expression);

  assertEquals(filtered.length, 1);
  assertEquals(filtered[0].name, 'John');
});
```

### API Testing

```typescript
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { Application } from 'https://deno.land/x/oak/mod.ts';
import { superoak } from 'https://deno.land/x/superoak/mod.ts';

Deno.test('GET /api/users with filters', async () => {
  const app = new Application();

  const request = await superoak(app);
  const response = await request
    .get('/api/users?status=active')
    .expect(200);

  assertEquals(response.body.success, true);
  assertEquals(Array.isArray(response.body.data), true);
});
```

## Complete Example

```typescript
import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { filter } from 'npm:@mcabreradev/filter';
import type { Expression } from 'npm:@mcabreradev/filter';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: string;
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', role: 'user' }
];

const router = new Router();

router.get('/api/users', (ctx) => {
  const params = ctx.request.url.searchParams;
  const status = params.get('status');
  const role = params.get('role');
  const search = params.get('search');
  const page = parseInt(params.get('page') || '1');
  const limit = parseInt(params.get('limit') || '10');

  const conditions: any[] = [];

  if (status) conditions.push({ status: { $eq: status } });
  if (role) conditions.push({ role: { $eq: role } });
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

  const filtered = filter(users, expression, { memoize: true });

  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  ctx.response.body = {
    success: true,
    data: paginated,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit)
    }
  };
});

router.post('/api/users/filter', async (ctx) => {
  try {
    const body = await ctx.request.body().value;
    const expression: Expression<User> = body.expression;

    const filtered = filter(users, expression);

    ctx.response.body = {
      success: true,
      data: filtered,
      count: filtered.length
    };
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = {
      success: false,
      error: 'Invalid expression'
    };
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log('Server running on http://localhost:8000');
await app.listen({ port: 8000 });
```

## Related Resources

- [API Reference](/api/operators)
- [TypeScript Types](/api/types)
- [Best Practices](/guide/best-practices)
- [Express.js Integration](/backend/express)
- [NestJS Integration](/backend/nestjs)

