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

## Real-World Examples

### 1. Search with Signals and Dynamic Sorting

Advanced search interface using Angular Signals with debounced input and reactive sorting.

```typescript
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DebouncedFilterService } from '@mcabreradev/filter/angular';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  inStock: boolean;
}

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DebouncedFilterService],
  template: `
    <div class="product-search">
      <div class="filters">
        <input
          type="text"
          placeholder="Search products..."
          [ngModel]="searchTerm()"
          (ngModelChange)="searchTerm.set($event)"
          class="search-input"
        />
        
        <select [ngModel]="category()" (ngModelChange)="category.set($event)">
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
        </select>

        <div class="price-filter">
          <label>Max Price: $\{{ maxPrice() }}</label>
          <input
            type="range"
            min="0"
            max="10000"
            [ngModel]="maxPrice()"
            (ngModelChange)="maxPrice.set($event)"
          />
        </div>

        <div class="sort-controls">
          <select [ngModel]="sortBy()" (ngModelChange)="sortBy.set($event)">
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
          <button (click)="toggleSortDirection()">
            {{ sortDir() === 'asc' ? '↑' : '↓' }}
          </button>
        </div>
      </div>

      @if (filterService.isFiltering()) {
        <div class="loading">Searching...</div>
      }

      <div class="results">
        <p>{{ filterService.filtered().length }} products found</p>
        <div class="product-grid">
          @for (product of filterService.filtered(); track product.id) {
            <div class="product-card">
              <h3>{{ product.name }}</h3>
              <p class="category">{{ product.category }}</p>
              <p class="price">\${{ product.price }}</p>
              <p class="rating">⭐ {{ product.rating }}/5</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-search {
      padding: 1rem;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .search-input {
      flex: 1;
      min-width: 200px;
      padding: 0.5rem;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .product-card {
      border: 1px solid #ddd;
      padding: 1rem;
      border-radius: 8px;
    }
  `]
})
export class ProductSearchComponent implements OnInit {
  filterService = inject(DebouncedFilterService<Product>);

  searchTerm = signal('');
  category = signal('');
  maxPrice = signal(10000);
  sortBy = signal<'price' | 'rating'>('price');
  sortDir = signal<'asc' | 'desc'>('asc');

  products: Product[] = [
    { id: 1, name: 'Laptop Pro', price: 1200, category: 'Electronics', rating: 4.5, inStock: true },
    { id: 2, name: 'Wireless Mouse', price: 25, category: 'Electronics', rating: 4.0, inStock: true },
    // ... more products
  ];

  // Reactive expression using computed
  expression = computed(() => {
    const expr: any = {
      price: { $lte: this.maxPrice() },
      inStock: true
    };

    if (this.searchTerm()) {
      expr.name = { $contains: this.searchTerm() };
    }

    if (this.category()) {
      expr.category = this.category();
    }

    return expr;
  });

  // Reactive options using computed
  options = computed(() => ({
    orderBy: { field: this.sortBy(), direction: this.sortDir() },
    enableCache: true
  }));

  ngOnInit() {
    this.filterService.setData(this.products);
    
    // Watch expression changes
    this.filterService.setExpression(this.expression());
    this.filterService.setOptions(this.options());
    this.filterService.setDebounce(300);
  }

  toggleSortDirection() {
    this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    this.filterService.setOptions(this.options());
  }
}
```

### 2. Data Table with Column Sorting

Sortable, filterable data table with column-based filtering and pagination.

```typescript
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatedFilterService } from '@mcabreradev/filter/angular';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: Date;
}

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [PaginatedFilterService],
  template: `
    <div class="data-table">
      <div class="table-filters">
        <input
          type="text"
          placeholder="Filter by name..."
          [ngModel]="nameFilter()"
          (ngModelChange)="nameFilter.set($event)"
        />
        <select [ngModel]="roleFilter()" (ngModelChange)="roleFilter.set($event)">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
        </select>
        <select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th (click)="handleSort('name')">
              Name {{ getSortIcon('name') }}
            </th>
            <th (click)="handleSort('email')">
              Email {{ getSortIcon('email') }}
            </th>
            <th (click)="handleSort('role')">
              Role {{ getSortIcon('role') }}
            </th>
            <th (click)="handleSort('status')">
              Status {{ getSortIcon('status') }}
            </th>
            <th (click)="handleSort('lastLogin')">
              Last Login {{ getSortIcon('lastLogin') }}
            </th>
          </tr>
        </thead>
        <tbody>
          @for (user of filterService.paginatedResults(); track user.id) {
            <tr>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <span [class]="'status-badge ' + user.status">
                  {{ user.status }}
                </span>
              </td>
              <td>{{ user.lastLogin | date:'short' }}</td>
            </tr>
          }
        </tbody>
      </table>

      <div class="pagination">
        <button 
          (click)="filterService.prevPage()"
          [disabled]="filterService.currentPage() === 1"
        >
          Previous
        </button>
        <span>
          Page {{ filterService.currentPage() }} of {{ filterService.totalPages() }} 
          ({{ filterService.filtered().length }} results)
        </span>
        <button 
          (click)="filterService.nextPage()"
          [disabled]="filterService.currentPage() === filterService.totalPages()"
        >
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .data-table {
      width: 100%;
    }

    .table-filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      cursor: pointer;
      user-select: none;
      background: #f5f5f5;
      padding: 0.75rem;
      text-align: left;
    }

    td {
      padding: 0.75rem;
      border-bottom: 1px solid #ddd;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.inactive {
      background: #f8d7da;
      color: #721c24;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
    }
  `]
})
export class UserTableComponent implements OnInit {
  filterService = inject(PaginatedFilterService<User>);

  nameFilter = signal('');
  roleFilter = signal('');
  statusFilter = signal('');
  sortField = signal<keyof User>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', status: 'active', lastLogin: new Date() },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', status: 'active', lastLogin: new Date() },
    // ... more users
  ];

  expression = computed(() => {
    const expr: any = {};

    if (this.nameFilter()) {
      expr.name = { $contains: this.nameFilter() };
    }

    if (this.roleFilter()) {
      expr.role = this.roleFilter();
    }

    if (this.statusFilter()) {
      expr.status = this.statusFilter();
    }

    return expr;
  });

  options = computed(() => ({
    orderBy: { field: this.sortField(), direction: this.sortDirection() },
    enableCache: true
  }));

  ngOnInit() {
    this.filterService.setData(this.users);
    this.filterService.setExpression(this.expression());
    this.filterService.setOptions(this.options());
    this.filterService.setPageSize(10);
  }

  handleSort(field: keyof User) {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
    this.filterService.setOptions(this.options());
    this.filterService.setPage(1);
  }

  getSortIcon(field: keyof User): string {
    if (this.sortField() !== field) return '↕️';
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }
}
```

### 3. Infinite Scroll with Virtual Scrolling

Infinite scroll list using CDK Virtual Scrolling for memory-efficient rendering.

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { filterLazy } from '@mcabreradev/filter';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: Date;
}

@Component({
  selector: 'app-infinite-list',
  standalone: true,
  imports: [CommonModule, ScrollingModule, FormsModule],
  template: `
    <div class="infinite-list">
      <div class="filter-bar">
        <select [ngModel]="selectedTag()" (ngModelChange)="changeTag($event)">
          <option value="">All Tags</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="angular">Angular</option>
        </select>
      </div>

      <cdk-virtual-scroll-viewport
        itemSize="150"
        class="viewport"
        (scrolledIndexChange)="onScroll($event)"
      >
        <article
          *cdkVirtualFor="let post of displayedPosts()"
          class="post-card"
        >
          <h2>{{ post.title }}</h2>
          <p class="author">By {{ post.author }}</p>
          <p class="content">{{ post.content }}</p>
          <div class="tags">
            @for (tag of post.tags; track tag) {
              <span class="tag">{{ tag }}</span>
            }
          </div>
          <time>{{ post.createdAt | date:'short' }}</time>
        </article>

        @if (hasMore()) {
          <div class="loading-trigger">
            {{ isLoading() ? 'Loading more posts...' : 'Scroll for more' }}
          </div>
        } @else {
          <div class="end-message">
            No more posts ({{ displayedPosts().length }} total)
          </div>
        }
      </cdk-virtual-scroll-viewport>
    </div>
  `,
  styles: [`
    .infinite-list {
      max-width: 800px;
      margin: 0 auto;
      height: 100vh;
    }

    .viewport {
      height: calc(100vh - 60px);
    }

    .post-card {
      padding: 1.5rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin: 0.5rem;
    }

    .tags {
      display: flex;
      gap: 0.5rem;
      margin: 0.5rem 0;
    }

    .tag {
      padding: 0.25rem 0.5rem;
      background: #e0e0e0;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .loading-trigger,
    .end-message {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `]
})
export class InfiniteListComponent implements OnInit {
  displayedPosts = signal<Post[]>([]);
  hasMore = signal(true);
  isLoading = signal(false);
  selectedTag = signal('');

  posts: Post[] = [];
  iterator: Generator<Post, void, undefined> | null = null;

  ngOnInit() {
    // Initialize with sample data
    this.posts = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      title: `Post ${i + 1}`,
      content: `Content for post ${i + 1}...`,
      author: `Author ${i % 10}`,
      tags: ['javascript', 'typescript', 'angular'].slice(0, Math.floor(Math.random() * 3) + 1),
      createdAt: new Date()
    }));

    this.initializeIterator();
  }

  initializeIterator() {
    const expression = this.selectedTag() 
      ? { tags: { $contains: this.selectedTag() } } 
      : {};
    
    this.iterator = filterLazy(this.posts, expression);
    this.displayedPosts.set([]);
    this.hasMore.set(true);
    this.loadMore();
  }

  loadMore() {
    if (!this.iterator || this.isLoading()) return;

    this.isLoading.set(true);
    
    const newPosts: Post[] = [];
    for (let i = 0; i < 20; i++) {
      const result = this.iterator.next();
      if (result.done) {
        this.hasMore.set(false);
        break;
      }
      newPosts.push(result.value);
    }

    this.displayedPosts.set([...this.displayedPosts(), ...newPosts]);
    this.isLoading.set(false);
  }

  onScroll(index: number) {
    const threshold = this.displayedPosts().length - 5;
    if (index >= threshold && this.hasMore() && !this.isLoading()) {
      this.loadMore();
    }
  }

  changeTag(tag: string) {
    this.selectedTag.set(tag);
    this.initializeIterator();
  }
}
```

### 4. NgRx Store Integration

Integration with NgRx for global state management with filtering.

```typescript
// filter.state.ts
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createAction, props } from '@ngrx/store';
import type { Expression, FilterOptions } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

export interface FilterState {
  expression: Expression<Product>;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  enableCache: boolean;
}

const initialState: FilterState = {
  expression: {},
  sortBy: 'name',
  sortDirection: 'asc',
  enableCache: true
};

// Actions
export const filterActions = {
  setExpression: createAction(
    '[Filter] Set Expression',
    props<{ expression: Expression<Product> }>()
  ),
  setSortBy: createAction(
    '[Filter] Set Sort By',
    props<{ field: string }>()
  ),
  toggleSortDirection: createAction('[Filter] Toggle Sort Direction'),
  resetFilters: createAction('[Filter] Reset Filters')
};

// Reducer
export const filterFeature = createFeature({
  name: 'filter',
  reducer: createReducer(
    initialState,
    on(filterActions.setExpression, (state, { expression }) => ({
      ...state,
      expression
    })),
    on(filterActions.setSortBy, (state, { field }) => ({
      ...state,
      sortBy: field
    })),
    on(filterActions.toggleSortDirection, (state) => ({
      ...state,
      sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc'
    })),
    on(filterActions.resetFilters, () => initialState)
  ),
  extraSelectors: ({ selectExpression, selectSortBy, selectSortDirection, selectEnableCache }) => ({
    selectFilterOptions: createSelector(
      selectSortBy,
      selectSortDirection,
      selectEnableCache,
      (sortBy, sortDirection, enableCache): FilterOptions => ({
        orderBy: { field: sortBy, direction: sortDirection },
        enableCache
      })
    )
  })
});
```

```typescript
// Component using NgRx
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { filter } from '@mcabreradev/filter';
import { filterActions, filterFeature } from './filter.state';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-catalog">
      <div class="filters">
        <button (click)="filterByCategory('Electronics')">
          Electronics
        </button>
        <button (click)="filterByCategory('Books')">
          Books
        </button>
        <button (click)="filterByPriceRange(0, 100)">
          Under $100
        </button>
        <button (click)="resetFilters()">
          Clear Filters
        </button>
      </div>

      <div class="sort-controls">
        <select 
          [value]="sortBy()"
          (change)="setSortBy($any($event.target).value)"
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="category">Category</option>
        </select>
        <button (click)="toggleSort()">
          {{ sortDirection() === 'asc' ? '↑ Ascending' : '↓ Descending' }}
        </button>
      </div>

      <div class="product-grid">
        <p>{{ filteredProducts().length }} products</p>
        @for (product of filteredProducts(); track product.id) {
          <div class="product-card">
            <h3>{{ product.name }}</h3>
            <p>{{ product.category }}</p>
            <p class="price">\${{ product.price }}</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .product-catalog {
      padding: 1rem;
    }

    .filters {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .sort-controls {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .product-card {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
  `]
})
export class ProductCatalogComponent implements OnInit {
  private store = inject(Store);

  products = signal<Product[]>([
    { id: 1, name: 'Laptop', category: 'Electronics', price: 1200 },
    { id: 2, name: 'Book', category: 'Books', price: 25 },
    // ... more products
  ]);

  expression = this.store.selectSignal(filterFeature.selectExpression);
  sortBy = this.store.selectSignal(filterFeature.selectSortBy);
  sortDirection = this.store.selectSignal(filterFeature.selectSortDirection);
  filterOptions = this.store.selectSignal(filterFeature.selectFilterOptions);

  filteredProducts = computed(() => 
    filter(this.products(), this.expression(), this.filterOptions())
  );

  ngOnInit() {}

  filterByCategory(category: string) {
    this.store.dispatch(filterActions.setExpression({ 
      expression: { category } 
    }));
  }

  filterByPriceRange(min: number, max: number) {
    this.store.dispatch(filterActions.setExpression({ 
      expression: { price: { $gte: min, $lte: max } } 
    }));
  }

  setSortBy(field: string) {
    this.store.dispatch(filterActions.setSortBy({ field }));
  }

  toggleSort() {
    this.store.dispatch(filterActions.toggleSortDirection());
  }

  resetFilters() {
    this.store.dispatch(filterActions.resetFilters());
  }
}
```

### 5. Angular Universal SSR

Server-side rendering with Angular Universal and client-side filtering.

```typescript
// app/products/products.component.ts
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="products-page">
      <h1>Product Catalog</h1>

      <div class="filters-panel">
        <input
          type="search"
          placeholder="Search products..."
          [ngModel]="searchTerm()"
          (ngModelChange)="searchTerm.set($event)"
          class="search-input"
        />

        <select [ngModel]="category()" (ngModelChange)="category.set($event)">
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
        </select>

        <div class="price-range">
          <label>
            Price Range: ${{ priceRange()[0] }} - ${{ priceRange()[1] }}
          </label>
          <input
            type="range"
            min="0"
            max="10000"
            [ngModel]="priceRange()[1]"
            (ngModelChange)="updatePriceRange($event)"
          />
        </div>

        <label class="checkbox">
          <input
            type="checkbox"
            [ngModel]="showInStockOnly()"
            (ngModelChange)="showInStockOnly.set($event)"
          />
          In Stock Only
        </label>

        <div class="filter-stats">
          {{ filteredProducts().length }} products found
        </div>
      </div>

      <div class="products-grid">
        @for (product of filteredProducts(); track product.id) {
          <div class="product-card">
            <h3>{{ product.name }}</h3>
            <p class="category">{{ product.category }}</p>
            <p class="price">\${{ product.price.toFixed(2) }}</p>
            <p class="stock">
              {{ product.inStock ? '✅ In Stock' : '❌ Out of Stock' }}
            </p>
          </div>
        }

        @if (filteredProducts().length === 0) {
          <div class="no-results">
            <p>No products match your filters</p>
            <button (click)="clearFilters()">
              Clear All Filters
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .products-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .filters-panel {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .search-input {
      padding: 0.75rem;
      font-size: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .product-card {
      padding: 1.5rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      transition: box-shadow 0.2s;
    }

    .product-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class ProductsPageComponent implements OnInit {
  private http = inject(HttpClient);

  // Server-side data fetching
  products = toSignal(
    this.http.get<Product[]>('/api/products'),
    { initialValue: [] }
  );

  searchTerm = signal('');
  category = signal('');
  priceRange = signal<[number, number]>([0, 10000]);
  showInStockOnly = signal(false);

  // Client-side filtering
  expression = computed(() => {
    const expr: any = {
      price: { $gte: this.priceRange()[0], $lte: this.priceRange()[1] }
    };

    if (this.searchTerm()) {
      expr.$or = [
        { name: { $contains: this.searchTerm() } },
        { category: { $contains: this.searchTerm() } }
      ];
    }

    if (this.category()) {
      expr.category = this.category();
    }

    if (this.showInStockOnly()) {
      expr.inStock = true;
    }

    return expr;
  });

  filteredProducts = computed(() => 
    filter(this.products(), this.expression(), { 
      orderBy: 'name',
      enableCache: true 
    })
  );

  ngOnInit() {}

  updatePriceRange(max: number) {
    this.priceRange.set([this.priceRange()[0], max]);
  }

  clearFilters() {
    this.searchTerm.set('');
    this.category.set('');
    this.priceRange.set([0, 10000]);
    this.showInStockOnly.set(false);
  }
}
```

```typescript
// server.ts - Angular Universal setup
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // API endpoint for products
  server.get('/api/products', (req, res) => {
    const products = [
      { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1200, inStock: true },
      { id: 2, name: 'Mouse Wireless', category: 'Electronics', price: 25, inStock: true },
      // ... more products
    ];
    res.json(products);
  });

  // Serve static files
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
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

