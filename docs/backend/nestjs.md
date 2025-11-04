---
title: NestJS Integration
description: Use @mcabreradev/filter with NestJS for enterprise-grade filtering
---

# NestJS Integration

Complete guide for integrating `@mcabreradev/filter` with NestJS applications.

## Installation

```bash
npm install @mcabreradev/filter
```

## Module Setup

```typescript
import { Module } from '@nestjs/common';
import { FilterService } from './filter.service';

@Module({
  providers: [FilterService],
  exports: [FilterService],
})
export class FilterModule {}
```

## Service Implementation

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { 
  filter, 
  validateExpression, 
  InvalidExpressionError,
  FilterOptions 
} from '@mcabreradev/filter';

@Injectable()
export class FilterService {
  filter<T>(data: T[], expression: any, options: FilterOptions = {}): T[] {
    try {
      const validExpression = validateExpression(expression);
      return filter(data, validExpression, options);
    } catch (error) {
      if (error instanceof InvalidExpressionError) {
        throw new BadRequestException({
          message: 'Invalid filter expression',
          error: error.message,
          code: error.code
        });
      }
      throw error;
    }
  }
}
```

## Controller Usage

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { FilterService } from './filter.service';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly filterService: FilterService,
  ) {}

  @Get()
  async findAll(@Query('filter') filterQuery?: string) {
    const products = await this.productsService.findAll();
    
    if (!filterQuery) {
      return products;
    }
    
    const expression = JSON.parse(filterQuery);
    return this.filterService.filter(products, expression);
  }
}
```

## DTO with Validation

```typescript
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class FilterQueryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      throw new BadRequestException('Invalid JSON in filter');
    }
  })
  filter?: any;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
```

## Custom Decorator

```typescript
import { 
  createParamDecorator, 
  ExecutionContext, 
  BadRequestException 
} from '@nestjs/common';
import { validateExpression, InvalidExpressionError } from '@mcabreradev/filter';

export const FilterExpression = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const filterQuery = request.query.filter;
    
    if (!filterQuery) {
      return undefined;
    }
    
    try {
      const expression = typeof filterQuery === 'string' 
        ? JSON.parse(filterQuery) 
        : filterQuery;
      return validateExpression(expression);
    } catch (error) {
      if (error instanceof InvalidExpressionError) {
        throw new BadRequestException({
          message: 'Invalid filter expression',
          error: error.message
        });
      }
      throw new BadRequestException('Invalid filter format');
    }
  },
);

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly filterService: FilterService,
  ) {}

  @Get()
  async findAll(@FilterExpression() expression?: any) {
    const products = await this.productsService.findAll();
    return expression 
      ? this.filterService.filter(products, expression)
      : products;
  }
}
```

## Interceptor for Filtering

```typescript
import { 
  Injectable, 
  NestInterceptor, 
  ExecutionContext, 
  CallHandler 
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { filter } from '@mcabreradev/filter';

@Injectable()
export class FilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const filterExpression = request.query.filter 
      ? JSON.parse(request.query.filter) 
      : undefined;

    return next.handle().pipe(
      map(data => {
        if (!filterExpression || !Array.isArray(data)) {
          return data;
        }
        return filter(data, filterExpression);
      }),
    );
  }
}

@Controller('products')
export class ProductsController {
  @Get()
  @UseInterceptors(FilterInterceptor)
  async findAll() {
    return this.productsService.findAll();
  }
}
```

## Pipe for Validation

```typescript
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validateExpression, InvalidExpressionError } from '@mcabreradev/filter';

@Injectable()
export class FilterValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      return undefined;
    }

    try {
      const expression = typeof value === 'string' ? JSON.parse(value) : value;
      return validateExpression(expression);
    } catch (error) {
      if (error instanceof InvalidExpressionError) {
        throw new BadRequestException({
          message: 'Invalid filter expression',
          error: error.message,
          code: error.code
        });
      }
      throw new BadRequestException('Invalid filter format');
    }
  }
}

@Controller('products')
export class ProductsController {
  @Get()
  async findAll(
    @Query('filter', new FilterValidationPipe()) expression?: any
  ) {
    const products = await this.productsService.findAll();
    return expression 
      ? this.filterService.filter(products, expression)
      : products;
  }
}
```

## TypeORM Integration

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { filter } from '@mcabreradev/filter';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findFiltered(expression: any): Promise<Product[]> {
    const products = await this.productsRepository.find();
    return filter(products, expression);
  }

  async findWithPagination(
    expression: any,
    page: number = 1,
    limit: number = 20
  ) {
    const allProducts = await this.productsRepository.find();
    const filtered = filter(allProducts, expression);
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);
    
    return {
      data: paginated,
      total: filtered.length,
      page,
      pages: Math.ceil(filtered.length / limit)
    };
  }
}
```

## Complete Example

```typescript
import { Module, Controller, Get, Query, Injectable } from '@nestjs/common';
import { FilterService } from './filter.service';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

@Injectable()
class ProductsService {
  private products: Product[] = [
    { id: 1, name: 'Laptop', price: 1200, category: 'Electronics', inStock: true },
    { id: 2, name: 'Mouse', price: 25, category: 'Electronics', inStock: true },
    { id: 3, name: 'Keyboard', price: 75, category: 'Electronics', inStock: false },
  ];

  findAll(): Product[] {
    return this.products;
  }
}

@Controller('products')
class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly filterService: FilterService,
  ) {}

  @Get()
  async findAll(@Query('filter') filterQuery?: string) {
    const products = this.productsService.findAll();
    
    if (!filterQuery) {
      return {
        success: true,
        count: products.length,
        data: products
      };
    }
    
    const expression = JSON.parse(filterQuery);
    const filtered = this.filterService.filter(products, expression);
    
    return {
      success: true,
      count: filtered.length,
      data: filtered
    };
  }
}

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, FilterService],
})
export class AppModule {}
```

## Exception Filter

```typescript
import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpStatus 
} from '@nestjs/common';
import { Response } from 'express';
import { InvalidExpressionError, ValidationError } from '@mcabreradev/filter';

@Catch(InvalidExpressionError, ValidationError)
export class FilterExceptionFilter implements ExceptionFilter {
  catch(exception: InvalidExpressionError | ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: exception.message,
      code: exception.code,
      timestamp: new Date().toISOString(),
    });
  }
}

@Controller('products')
@UseFilters(FilterExceptionFilter)
export class ProductsController {
  // ...
}
```

## Best Practices

1. **Use DTOs** - Validate query parameters with class-validator
2. **Custom decorators** - Extract filter logic into reusable decorators
3. **Interceptors** - Apply filtering globally with interceptors
4. **Exception filters** - Use NestJS exception filters for consistent errors
5. **Caching** - Integrate with @nestjs/cache-manager for performance
6. **Type safety** - Leverage TypeScript generics
7. **Dependency injection** - Use FilterService as a provider
8. **Testing** - Write unit tests for filter logic

## Testing

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { FilterService } from './filter.service';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilterService],
    }).compile();

    service = module.get<FilterService>(FilterService);
  });

  it('should filter products by price', () => {
    const products = [
      { id: 1, price: 100 },
      { id: 2, price: 200 },
      { id: 3, price: 300 },
    ];

    const result = service.filter(products, { price: { $gte: 150 } });
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(2);
  });
});
```

## See Also

- [Express.js Integration](/backend/express)
- [Deno Integration](/backend/deno)
- [Error Handling](/advanced/error-handling)
- [Performance Monitoring](/advanced/performance-monitoring)
