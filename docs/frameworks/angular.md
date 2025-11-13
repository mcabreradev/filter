---
title: Angular Integration
description: Angular Services and Pipes for filtering with @mcabreradev/filter
---

# Angular Integration

Complete guide for using `@mcabreradev/filter` with Angular 17+.

## Installation

```bash
npm install @mcabreradev/filter
```

## Import

```typescript
import {
  FilterService,
  FilterPipe,
  DebouncedFilterService,
  PaginatedFilterService
} from '@mcabreradev/filter/angular';
```

## Available Tools

- [`FilterService`](#filterservice) - Injectable service with Signals support
- [`FilterPipe`](#filterpipe) - Declarative filtering in templates
- [`DebouncedFilterService`](#debouncedfilterservice) - Debounced filtering for search
- [`PaginatedFilterService`](#paginatedfilterservice) - Filtering with pagination

## FilterService

Reactive filtering service using Angular Signals.

### Basic Usage

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterService } from '@mcabreradev/filter/angular';

interface User {
  id: number;
  name: string;
  active: boolean;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  providers: [FilterService],
  template: `
    <div>
      <button (click)="showActive()">Show Active</button>
      <button (click)="filterService.reset()">Reset</button>
      
      @if (filterService.isFiltering()) {
        <span>Filtering...</span>
      }
      
      @for (user of filterService.filtered(); track user.id) {
        <div class="user-card">
          <h3>{{ user.name }}</h3>
        </div>
      }
    </div>
  `
})
export class UserListComponent implements OnInit {
  filterService = inject(FilterService<User>);
  
  users: User[] = [
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false },
  ];

  ngOnInit() {
    this.filterService.setData(this.users);
  }

  showActive() {
    this.filterService.setExpression({ active: true });
  }
}
```

### API Reference

```typescript
class FilterService<T> {
  // Signals (read-only)
  filtered: Signal<T[]>;
  isFiltering: Signal<boolean>;
  
  // Methods
  setData(data: T[]): void;
  setExpression(expr: Expression<T> | null): void;
  setOptions(opts: FilterOptions): void;
  reset(): void;
}
```

## FilterPipe

Declarative filtering directly in templates.

```typescript
import { Component } from '@angular/core';
import { FilterPipe } from '@mcabreradev/filter/angular';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FilterPipe],
  template: `
    @for (user of users | filterPipe:{ active: true }; track user.id) {
      <div>{{ user.name }}</div>
    }
  `
})
export class UserListComponent {
  users = [
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false },
  ];
}
```

### API Reference

```typescript
@Pipe({
  name: 'filterPipe',
  standalone: true,
  pure: true
})
class FilterPipe implements PipeTransform {
  transform<T>(
    data: T[] | null | undefined,
    expr: Expression<T>,
    opts?: FilterOptions
  ): T[];
}
```

## DebouncedFilterService

Debounced filtering service for search inputs.

```typescript
import { Component, inject, signal, effect } from '@angular/core';
import { DebouncedFilterService } from '@mcabreradev/filter/angular';

@Component({
  selector: 'app-search',
  standalone: true,
  providers: [DebouncedFilterService],
  template: `
    <input
      [value]="searchTerm()"
      (input)="onSearchChange($event)"
      placeholder="Search..."
    />
    
    @if (filterService.isPending()) {
      <span>Searching...</span>
    }
    
    @for (user of filterService.filtered(); track user.id) {
      <div>{{ user.name }}</div>
    }
  `
})
export class SearchComponent {
  filterService = inject(DebouncedFilterService<User>);
  searchTerm = signal('');
  
  users = signal<User[]>([...]);

  constructor() {
    this.filterService.setData(this.users());
    
    effect(() => {
      this.filterService.setExpressionDebounced(
        { name: { $contains: this.searchTerm() } },
        300 // delay in ms
      );
    });
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }
}
```

### API Reference

```typescript
class DebouncedFilterService<T> {
  // Signals (read-only)
  filtered: Signal<T[]>;
  isFiltering: Signal<boolean>;
  isPending: Signal<boolean>;
  
  // Methods
  setData(data: T[]): void;
  setExpressionDebounced(expr: Expression<T> | null, delay?: number): void;
  setOptions(opts: FilterOptions): void;
  reset(): void;
}
```

## PaginatedFilterService

Filtering service with built-in pagination.

```typescript
import { Component, inject, computed } from '@angular/core';
import { PaginatedFilterService } from '@mcabreradev/filter/angular';

@Component({
  selector: 'app-paginated-list',
  standalone: true,
  providers: [PaginatedFilterService],
  template: `
    @for (item of filterService.paginatedResults(); track item.id) {
      <div>{{ item.name }}</div>
    }
    
    <div>
      <button 
        (click)="filterService.prevPage()" 
        [disabled]="filterService.currentPage() === 1"
      >
        Previous
      </button>
      <span>
        Page {{ filterService.currentPage() }} 
        of {{ filterService.totalPages() }}
      </span>
      <button 
        (click)="filterService.nextPage()" 
        [disabled]="filterService.currentPage() === filterService.totalPages()"
      >
        Next
      </button>
    </div>
  `
})
export class PaginatedListComponent {
  filterService = inject(PaginatedFilterService<Product>);
  
  products = signal<Product[]>([...]);
  expression = signal({ inStock: true });

  constructor() {
    this.filterService.setData(this.products());
    this.filterService.setExpression(this.expression());
    this.filterService.setPageSize(10);
  }
}
```

### API Reference

```typescript
class PaginatedFilterService<T> {
  // Signals (read-only)
  filtered: Signal<T[]>;
  isFiltering: Signal<boolean>;
  paginatedResults: Signal<T[]>;
  currentPage: Signal<number>;
  pageSize: Signal<number>;
  totalPages: Signal<number>;
  
  // Methods
  setData(data: T[]): void;
  setExpression(expr: Expression<T> | null): void;
  setOptions(opts: FilterOptions): void;
  setPage(page: number): void;
  setPageSize(size: number): void;
  nextPage(): void;
  prevPage(): void;
  reset(): void;
}
```
## TypeScript Support

Full type safety with generics:

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  providers: [FilterService]
})
export class ProductsComponent {
  filterService = inject(FilterService<Product>);
  
  ngOnInit() {
    this.filterService.setExpression({
      price: { $gte: 100 } // ✅ Type-safe
    });
  }
}
```

## SSR Support

All tools are SSR-compatible and work with Angular Universal.

```typescript
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FilterService } from '@mcabreradev/filter/angular';

@Component({
  selector: 'app-ssr-component',
  standalone: true,
  providers: [FilterService],
  template: `...`
})
export class SSRComponent {
  filterService = inject(FilterService<Product>);
  platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Client-side only code
      this.filterService.setOptions({ enableCache: true });
    }
  }
}
```

## Best Practices

### 1. Use Signals for Reactivity

```typescript
const searchTerm = signal('');
const expression = computed(() => ({
  name: { $contains: searchTerm() }
}));
```

### 2. Provide Services at Component Level

```typescript
@Component({
  providers: [FilterService], // Component-scoped
  // ...
})
```

### 3. Use FilterPipe for Simple Cases

```typescript
// Simple filtering
@for (item of items | filterPipe:{ active: true }; track item.id) {
  <div>{{ item.name }}</div>
}
```

### 4. Use Services for Complex Logic

```typescript
// Complex filtering with multiple updates
filterService.setExpression({ category: 'Electronics' });
filterService.setOptions({ enableCache: true });
```

## Next Steps

- [React Integration](./react.md)
- [Vue Integration](./vue.md)
- [Svelte Integration](./svelte.md)
- [API Reference](../api/reference.md)

