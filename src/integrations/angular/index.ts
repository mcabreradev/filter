import { Injectable, Signal, computed, signal, Pipe, PipeTransform } from '@angular/core';
import { filter } from '../../core/filter';
import type { Expression, FilterOptions } from '../../types';

@Injectable()
export class FilterService<T> {
  private dataSignal = signal<T[]>([]);
  private expressionSignal = signal<Expression<T> | null>(null);
  private optionsSignal = signal<FilterOptions>({});

  filtered: Signal<T[]> = computed(() => {
    const data = this.dataSignal();
    const expression = this.expressionSignal();
    const options = this.optionsSignal();

    if (!expression || data.length === 0) {
      return data;
    }

    return filter(data, expression, options);
  });

  isFiltering: Signal<boolean> = computed(() => {
    return this.expressionSignal() !== null && this.dataSignal().length > 0;
  });

  setData(data: T[]): void {
    this.dataSignal.set(data);
  }

  setExpression(expression: Expression<T> | null): void {
    this.expressionSignal.set(expression);
  }

  setOptions(options: FilterOptions): void {
    this.optionsSignal.set(options);
  }

  reset(): void {
    this.expressionSignal.set(null);
    this.optionsSignal.set({});
  }
}

@Pipe({
  name: 'filterPipe',
  standalone: true,
  pure: true,
})
export class FilterPipe implements PipeTransform {
  transform<T>(
    data: T[] | null | undefined,
    expression: Expression<T>,
    options?: FilterOptions,
  ): T[] {
    if (!data || !expression) {
      return data || [];
    }
    return filter(data, expression, options);
  }
}

@Injectable()
export class DebouncedFilterService<T> extends FilterService<T> {
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingSignal = signal<boolean>(false);

  isPending: Signal<boolean> = computed(() => this.pendingSignal());

  setExpressionDebounced(expression: Expression<T> | null, delay = 300): void {
    this.pendingSignal.set(true);

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      super.setExpression(expression);
      this.pendingSignal.set(false);
      this.debounceTimer = null;
    }, delay);
  }

  override reset(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.pendingSignal.set(false);
    super.reset();
  }
}

@Injectable()
export class PaginatedFilterService<T> extends FilterService<T> {
  private pageSignal = signal<number>(1);
  private pageSizeSignal = signal<number>(10);

  currentPage: Signal<number> = computed(() => this.pageSignal());
  pageSize: Signal<number> = computed(() => this.pageSizeSignal());

  paginatedResults: Signal<T[]> = computed(() => {
    const filtered = this.filtered();
    const page = this.pageSignal();
    const size = this.pageSizeSignal();
    const start = (page - 1) * size;
    return filtered.slice(start, start + size);
  });

  totalPages: Signal<number> = computed(() => {
    const total = this.filtered().length;
    const size = this.pageSizeSignal();
    return Math.ceil(total / size);
  });

  setPage(page: number): void {
    const maxPage = this.totalPages();
    this.pageSignal.set(Math.max(1, Math.min(page, maxPage)));
  }

  setPageSize(size: number): void {
    this.pageSizeSignal.set(Math.max(1, size));
    this.pageSignal.set(1);
  }

  nextPage(): void {
    const current = this.pageSignal();
    const total = this.totalPages();
    if (current < total) {
      this.pageSignal.set(current + 1);
    }
  }

  prevPage(): void {
    const current = this.pageSignal();
    if (current > 1) {
      this.pageSignal.set(current - 1);
    }
  }
}

export { filter };
