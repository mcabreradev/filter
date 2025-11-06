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
import { FilterService, FilterPipe } from '@mcabreradev/filter/angular';
```

::: tip Signals Required
Angular integration requires Angular 17+ with Signals support.
:::

## Available APIs

- `FilterService` - Reactive filtering with Angular Signals
- `DebouncedFilterService` - Debounced filtering for search
- `PaginatedFilterService` - Filtering with pagination
- `FilterPipe` - Standalone pipe for templates

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
  // Signals
  filtered: Signal<T[]>;
  isFiltering: Signal<boolean>;
  
  // Methods
  setData(data: T[]): void;
  setExpression(expression: Expression<T> | null): void;
  setOptions(options: FilterOptions): void;
  reset(): void;
}
```

## FilterPipe

Standalone pipe for template filtering.

### Usage

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '@mcabreradev/filter/angular';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FilterPipe],
  template: `
    <div>
      @for (product of products | filterPipe:{ inStock: true }; track product.id) {
        <div>{{ product.name }} - ${{ product.price }}</div>
      }
    </div>
  `
})
export class ProductsComponent {
  products = [
    { id: 1, name: 'Laptop', price: 1200, inStock: true },
    { id: 2, name: 'Mouse', price: 25, inStock: false },
  ];
}
```

## DebouncedFilterService

Debounced filtering for search inputs.

### Usage

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DebouncedFilterService } from '@mcabreradev/filter/angular';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DebouncedFilterService],
  template: `
    <div>
      <input
        [(ngModel)]="searchTerm"
        (ngModelChange)="onSearchChange($event)"
        placeholder="Search users..."
      />
      
      @if (filterService.isPending()) {
        <span>Loading...</span>
      }
      
      @for (user of filterService.filtered(); track user.id) {
        <div>{{ user.name }}</div>
      }
    </div>
  `
})
export class SearchComponent implements OnInit {
  filterService = inject(DebouncedFilterService<User>);
  searchTerm = '';
  users: User[] = [...];

  ngOnInit() {
    this.filterService.setData(this.users);
  }

  onSearchChange(term: string) {
    this.filterService.setExpressionDebounced(
      term ? { name: { $contains: term } } : null,
      300
    );
  }
}
```

## PaginatedFilterService

Filtering with pagination support.

### Usage

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { PaginatedFilterService } from '@mcabreradev/filter/angular';

@Component({
  selector: 'app-paginated-list',
  standalone: true,
  imports: [CommonModule],
  providers: [PaginatedFilterService],
  template: `
    <div>
      @for (user of filterService.paginatedResults(); track user.id) {
        <div>{{ user.name }}</div>
      }
      
      <div class="pagination">
        <button
          (click)="filterService.prevPage()"
          [disabled]="filterService.currentPage() === 1"
        >
          Previous
        </button>
        
        <span>
          Page {{ filterService.currentPage() }} of {{ filterService.totalPages() }}
        </span>
        
        <button
          (click)="filterService.nextPage()"
          [disabled]="filterService.currentPage() === filterService.totalPages()"
        >
          Next
        </button>
      </div>
    </div>
  `
})
export class PaginatedListComponent implements OnInit {
  filterService = inject(PaginatedFilterService<User>);
  users: User[] = [...];

  ngOnInit() {
    this.filterService.setData(this.users);
    this.filterService.setExpression({ active: true });
    this.filterService.setPageSize(10);
  }
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

## Best Practices

1. **Provide at Component Level** - Provide services at component level for isolation
2. **Use Signals** - Access signals by calling them: `filtered()`
3. **Debounce Search** - Use `DebouncedFilterService` for search inputs
4. **Paginate Large Lists** - Use `PaginatedFilterService` for >100 items

## SSR Support

Compatible with Angular Universal:

```typescript
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

@Component({...})
export class MyComponent {
  private platformId = inject(PLATFORM_ID);
  filterService = inject(FilterService<User>);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.filterService.setData(this.users);
    }
  }
}
```

## Examples

See [Angular Examples](https://github.com/mcabreradev/filter/tree/main/examples/angular) for more examples.
