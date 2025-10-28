# NestJS Integration

Guide for using @mcabreradev/filter with NestJS.

## Overview

@mcabreradev/filter integrates seamlessly with NestJS applications, providing powerful filtering capabilities for controllers, services, GraphQL resolvers, and more.

## Installation

```bash
npm install @mcabreradev/filter
npm install --save-dev @types/node

pnpm add @mcabreradev/filter
pnpm add -D @types/node

yarn add @mcabreradev/filter
yarn add -D @types/node
```

## Controller Integration

### Basic Controller

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { filter } from '@mcabreradev/filter';
import type { Expression } from '@mcabreradev/filter';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: string;
}

@Controller('users')
export class UsersController {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', role: 'user' }
  ];

  @Get()
  findAll(@Query('status') status?: string, @Query('role') role?: string) {
    const conditions: any[] = [];

    if (status) {
      conditions.push({ status: { $eq: status } });
    }

    if (role) {
      conditions.push({ role: { $eq: role } });
    }

    const expression: Expression<User> =
      conditions.length > 0 ? { $and: conditions } : {};

    const filtered = filter(this.users, expression);

    return {
      success: true,
      data: filtered,
      count: filtered.length
    };
  }
}
```

### Controller with DTO

```typescript
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class FilterQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

export class FilterExpressionDto {
  @IsOptional()
  expression?: Expression<User>;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: FilterQueryDto) {
    return this.usersService.findFiltered(query);
  }

  @Post('filter')
  async filterUsers(@Body() dto: FilterExpressionDto) {
    return this.usersService.filterByExpression(dto.expression);
  }
}
```

## Service Layer Filtering

### Basic Service

```typescript
import { Injectable } from '@nestjs/common';
import { filter } from '@mcabreradev/filter';
import type { Expression } from '@mcabreradev/filter';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findFiltered(query: FilterQueryDto) {
    const conditions: any[] = [];

    if (query.status) {
      conditions.push({ status: { $eq: query.status } });
    }

    if (query.role) {
      conditions.push({ role: { $eq: query.role } });
    }

    if (query.search) {
      conditions.push({
        $or: [
          { name: { $regex: new RegExp(query.search, 'i') } },
          { email: { $regex: new RegExp(query.search, 'i') } }
        ]
      });
    }

    const expression: Expression<User> =
      conditions.length > 0 ? { $and: conditions } : {};

    const filtered = filter(this.users, expression, {
      memoize: true
    });

    return {
      success: true,
      data: filtered,
      count: filtered.length
    };
  }

  filterByExpression(expression: Expression<User>) {
    const filtered = filter(this.users, expression);

    return {
      success: true,
      data: filtered,
      count: filtered.length
    };
  }
}
```

### Service with Repository Pattern

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findFiltered(query: FilterQueryDto) {
    const allUsers = await this.usersRepository.find();

    const conditions: any[] = [];

    if (query.status) {
      conditions.push({ status: { $eq: query.status } });
    }

    if (query.role) {
      conditions.push({ role: { $eq: query.role } });
    }

    const expression: Expression<User> =
      conditions.length > 0 ? { $and: conditions } : {};

    const filtered = filter(allUsers, expression);

    return {
      success: true,
      data: filtered,
      count: filtered.length
    };
  }
}
```

## DTO Validation with Filtering

### Filter DTO

```typescript
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginatedFilterDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
```

### Using DTO in Controller

```typescript
import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: PaginatedFilterDto
  ) {
    return this.usersService.findPaginated(query);
  }
}
```

## Pipes and Guards

### Filter Validation Pipe

```typescript
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FilterExpressionPipe implements PipeTransform {
  transform(value: any) {
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Invalid filter expression');
    }

    return value;
  }
}

@Controller('users')
export class UsersController {
  @Post('filter')
  async filterUsers(
    @Body('expression', FilterExpressionPipe) expression: Expression<User>
  ) {
    return this.usersService.filterByExpression(expression);
  }
}
```

### Role-Based Filter Guard

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class FilterGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    if (user.role !== 'admin') {
      request.query.userId = user.id;
    }

    return true;
  }
}

@Controller('users')
@UseGuards(FilterGuard)
export class UsersController {
  @Get()
  async findAll(@Query() query: FilterQueryDto) {
    return this.usersService.findFiltered(query);
  }
}
```

## Database Integration

### TypeORM Integration

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { filter } from '@mcabreradev/filter';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findWithFilter(query: FilterQueryDto) {
    const users = await this.usersRepository.find();

    const conditions: any[] = [];

    if (query.status) {
      conditions.push({ status: { $eq: query.status } });
    }

    if (query.role) {
      conditions.push({ role: { $eq: query.role } });
    }

    const expression = conditions.length > 0 ? { $and: conditions } : {};

    return filter(users, expression);
  }
}
```

### Prisma Integration

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { filter } from '@mcabreradev/filter';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findWithFilter(query: FilterQueryDto) {
    const users = await this.prisma.user.findMany();

    const conditions: any[] = [];

    if (query.status) {
      conditions.push({ status: { $eq: query.status } });
    }

    if (query.role) {
      conditions.push({ role: { $eq: query.role } });
    }

    const expression = conditions.length > 0 ? { $and: conditions } : {};

    return filter(users, expression);
  }
}
```

## GraphQL Resolver Filtering

### Basic Resolver

```typescript
import { Resolver, Query, Args } from '@nestjs/graphql';
import { filter } from '@mcabreradev/filter';
import { User } from './models/user.model';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  async users(
    @Args('status', { nullable: true }) status?: string,
    @Args('role', { nullable: true }) role?: string,
  ) {
    const allUsers = await this.usersService.findAll();

    const conditions: any[] = [];

    if (status) {
      conditions.push({ status: { $eq: status } });
    }

    if (role) {
      conditions.push({ role: { $eq: role } });
    }

    const expression = conditions.length > 0 ? { $and: conditions } : {};

    return filter(allUsers, expression);
  }
}
```

### Resolver with Input Type

```typescript
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FilterInput {
  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  search?: string;
}

@Resolver(() => User)
export class UsersResolver {
  @Query(() => [User])
  async filteredUsers(@Args('filter') filterInput: FilterInput) {
    const allUsers = await this.usersService.findAll();

    const conditions: any[] = [];

    if (filterInput.status) {
      conditions.push({ status: { $eq: filterInput.status } });
    }

    if (filterInput.role) {
      conditions.push({ role: { $eq: filterInput.role } });
    }

    if (filterInput.search) {
      conditions.push({
        $or: [
          { name: { $regex: new RegExp(filterInput.search, 'i') } },
          { email: { $regex: new RegExp(filterInput.search, 'i') } }
        ]
      });
    }

    const expression = conditions.length > 0 ? { $and: conditions } : {};

    return filter(allUsers, expression);
  }
}
```

## Advanced Patterns

### Custom Filter Decorator

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Expression } from '@mcabreradev/filter';

export const FilterExpression = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Expression<any> => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const conditions: any[] = [];

    Object.keys(query).forEach(key => {
      if (query[key]) {
        conditions.push({ [key]: { $eq: query[key] } });
      }
    });

    return conditions.length > 0 ? { $and: conditions } : {};
  },
);

@Controller('users')
export class UsersController {
  @Get()
  async findAll(@FilterExpression() expression: Expression<User>) {
    return this.usersService.filterByExpression(expression);
  }
}
```

### Filter Interceptor

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { filter } from '@mcabreradev/filter';

@Injectable()
export class FilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const filterQuery = request.query.filter;

    return next.handle().pipe(
      map(data => {
        if (!filterQuery || !Array.isArray(data)) {
          return data;
        }

        try {
          const expression = JSON.parse(filterQuery);
          return filter(data, expression);
        } catch {
          return data;
        }
      }),
    );
  }
}

@Controller('users')
@UseInterceptors(FilterInterceptor)
export class UsersController {
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
}
```

### Dynamic Filter Building from DTOs

```typescript
import { Injectable } from '@nestjs/common';
import type { Expression } from '@mcabreradev/filter';

@Injectable()
export class FilterBuilderService {
  buildExpression<T>(dto: Record<string, any>): Expression<T> {
    const conditions: any[] = [];

    Object.entries(dto).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (typeof value === 'string' && value.includes('*')) {
        const regex = new RegExp(value.replace(/\*/g, '.*'), 'i');
        conditions.push({ [key]: { $regex: regex } });
      } else if (Array.isArray(value)) {
        conditions.push({ [key]: { $in: value } });
      } else {
        conditions.push({ [key]: { $eq: value } });
      }
    });

    return conditions.length > 0 ? { $and: conditions } : {};
  }
}

@Injectable()
export class UsersService {
  constructor(private filterBuilder: FilterBuilderService) {}

  async findFiltered(query: FilterQueryDto) {
    const users = await this.findAll();
    const expression = this.filterBuilder.buildExpression<User>(query);

    return filter(users, expression);
  }
}
```

### Role-Based Filtering

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async findFilteredByRole(query: FilterQueryDto, userRole: string, userId: number) {
    const users = await this.findAll();

    const conditions: any[] = [];

    if (query.status) {
      conditions.push({ status: { $eq: query.status } });
    }

    if (userRole !== 'admin') {
      conditions.push({ id: { $eq: userId } });
    }

    const expression = conditions.length > 0 ? { $and: conditions } : {};

    return filter(users, expression);
  }
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() query: FilterQueryDto,
    @Request() req,
  ) {
    return this.usersService.findFilteredByRole(
      query,
      req.user.role,
      req.user.id
    );
  }
}
```

### Caching with Filtering

```typescript
import { Injectable, CacheInterceptor, UseInterceptors } from '@nestjs/common';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('filtered-users')
  @CacheTTL(300)
  async findAll(@Query() query: FilterQueryDto) {
    return this.usersService.findFiltered(query);
  }
}
```

## Testing with Jest

### Service Testing

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should filter users by status', () => {
    const result = service.findFiltered({ status: 'active' });

    expect(result.data.every(u => u.status === 'active')).toBe(true);
  });

  it('should filter users by multiple conditions', () => {
    const result = service.findFiltered({
      status: 'active',
      role: 'admin'
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].role).toBe('admin');
  });
});
```

### Controller Testing

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should return filtered users', async () => {
    const result = await controller.findAll({ status: 'active' });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });
});
```

### E2E Testing

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET) with filters', () => {
    return request(app.getHttpServer())
      .get('/users?status=active&role=admin')
      .expect(200)
      .expect(res => {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## Performance Optimization

### 1. Enable Memoization

```typescript
@Injectable()
export class UsersService {
  findFiltered(query: FilterQueryDto) {
    const filtered = filter(users, expression, {
      memoize: true
    });

    return filtered;
  }
}
```

### 2. Use Caching

```typescript
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async findFiltered(query: FilterQueryDto) {
    const cacheKey = JSON.stringify(query);
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached;
    }

    const filtered = filter(users, expression);
    await this.cacheManager.set(cacheKey, filtered, 300);

    return filtered;
  }
}
```

### 3. Implement Pagination

```typescript
@Injectable()
export class UsersService {
  findPaginated(query: PaginatedFilterDto) {
    const filtered = filter(users, expression);

    const startIndex = (query.page - 1) * query.limit;
    const endIndex = startIndex + query.limit;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      data: paginated,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / query.limit)
      }
    };
  }
}
```

## Complete Example

```typescript
import { Module, Controller, Get, Post, Body, Query, Injectable } from '@nestjs/common';
import { filter } from '@mcabreradev/filter';
import type { Expression } from '@mcabreradev/filter';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  findFiltered(query: any) {
    const conditions: any[] = [];

    if (query.status) conditions.push({ status: { $eq: query.status } });
    if (query.role) conditions.push({ role: { $eq: query.role } });
    if (query.search) {
      conditions.push({
        $or: [
          { name: { $regex: new RegExp(query.search, 'i') } },
          { email: { $regex: new RegExp(query.search, 'i') } }
        ]
      });
    }

    const expression: Expression<User> =
      conditions.length > 0 ? { $and: conditions } : {};

    return filter(this.users, expression, { memoize: true });
  }
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(@Query() query: any) {
    const filtered = this.usersService.findFiltered(query);
    return { success: true, data: filtered };
  }

  @Post('filter')
  filterUsers(@Body('expression') expression: Expression<User>) {
    const filtered = filter(this.usersService['users'], expression);
    return { success: true, data: filtered };
  }
}

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

## Related Resources

- [API Reference](/api/operators)
- [TypeScript Types](/api/types)
- [Best Practices](/guide/best-practices)
- [Express.js Integration](/backend/express)
- [Deno Integration](/backend/deno)

