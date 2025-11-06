import { Signal, computed, signal, Pipe, PipeTransform } from '@angular/core';
import { filter } from '../../core/filter';
import type { Expression, FilterOptions } from '../../types';

// Factory function for FilterService (no decorator overhead)
export class FilterService<T> {
  private dataSignal = signal<T[]>([]);
  private expressionSignal = signal<Expression<T> | null>(null);
  private optionsSignal = signal<FilterOptions>({});

  readonly filtered: Signal<T[]> = computed(() => {
    const d = this.dataSignal();
    const e = this.expressionSignal();
    const o = this.optionsSignal();
    return !e || !d.length ? d : filter(d, e, o);
  });

  readonly isFiltering: Signal<boolean> = computed(
    () => !!this.expressionSignal() && !!this.dataSignal().length,
  );

  setData = (data: T[]): void => this.dataSignal.set(data);
  setExpression = (expr: Expression<T> | null): void => this.expressionSignal.set(expr);
  setOptions = (opts: FilterOptions): void => this.optionsSignal.set(opts);
  reset = (): void => {
    this.expressionSignal.set(null);
    this.optionsSignal.set({});
  };
}

@Pipe({ name: 'filterPipe', standalone: true, pure: true })
export class FilterPipe implements PipeTransform {
  transform<T>(data: T[] | null | undefined, expr: Expression<T>, opts?: FilterOptions): T[] {
    return data && expr ? filter(data, expr, opts) : data || [];
  }
}

// Composition over inheritance - no extends
export class DebouncedFilterService<T> {
  private dataSignal = signal<T[]>([]);
  private expressionSignal = signal<Expression<T> | null>(null);
  private optionsSignal = signal<FilterOptions>({});
  private timer: ReturnType<typeof setTimeout> | null = null;
  private pendingSignal = signal(false);

  readonly filtered: Signal<T[]> = computed(() => {
    const d = this.dataSignal();
    const e = this.expressionSignal();
    const o = this.optionsSignal();
    return !e || !d.length ? d : filter(d, e, o);
  });

  readonly isFiltering: Signal<boolean> = computed(
    () => !!this.expressionSignal() && !!this.dataSignal().length,
  );

  readonly isPending: Signal<boolean> = computed(() => this.pendingSignal());

  setData = (data: T[]): void => this.dataSignal.set(data);
  setOptions = (opts: FilterOptions): void => this.optionsSignal.set(opts);

  setExpressionDebounced = (expr: Expression<T> | null, delay = 300): void => {
    this.pendingSignal.set(true);
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.expressionSignal.set(expr);
      this.pendingSignal.set(false);
      this.timer = null;
    }, delay);
  };

  reset = (): void => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.pendingSignal.set(false);
    this.expressionSignal.set(null);
    this.optionsSignal.set({});
  };
}

// Composition over inheritance - no extends
export class PaginatedFilterService<T> {
  private dataSignal = signal<T[]>([]);
  private expressionSignal = signal<Expression<T> | null>(null);
  private optionsSignal = signal<FilterOptions>({});
  private pageSignal = signal(1);
  private pageSizeSignal = signal(10);

  readonly filtered: Signal<T[]> = computed(() => {
    const d = this.dataSignal();
    const e = this.expressionSignal();
    const o = this.optionsSignal();
    return !e || !d.length ? d : filter(d, e, o);
  });

  readonly isFiltering: Signal<boolean> = computed(
    () => !!this.expressionSignal() && !!this.dataSignal().length,
  );

  readonly currentPage: Signal<number> = computed(() => this.pageSignal());
  readonly pageSize: Signal<number> = computed(() => this.pageSizeSignal());

  readonly paginatedResults: Signal<T[]> = computed(() => {
    const items = this.filtered();
    const p = this.pageSignal();
    const s = this.pageSizeSignal();
    return items.slice((p - 1) * s, p * s);
  });

  readonly totalPages: Signal<number> = computed(() =>
    Math.ceil(this.filtered().length / this.pageSizeSignal()),
  );

  setData = (data: T[]): void => this.dataSignal.set(data);
  setExpression = (expr: Expression<T> | null): void => this.expressionSignal.set(expr);
  setOptions = (opts: FilterOptions): void => this.optionsSignal.set(opts);

  setPage = (page: number): void => {
    this.pageSignal.set(Math.max(1, Math.min(page, this.totalPages())));
  };

  setPageSize = (size: number): void => {
    this.pageSizeSignal.set(Math.max(1, size));
    this.pageSignal.set(1);
  };

  nextPage = (): void => {
    const c = this.pageSignal();
    if (c < this.totalPages()) this.pageSignal.set(c + 1);
  };

  prevPage = (): void => {
    const c = this.pageSignal();
    if (c > 1) this.pageSignal.set(c - 1);
  };

  reset = (): void => {
    this.expressionSignal.set(null);
    this.optionsSignal.set({});
    this.pageSignal.set(1);
  };
}

export { filter };
