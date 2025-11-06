import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FilterService, DebouncedFilterService, PaginatedFilterService, FilterPipe } from './index';

interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

const mockUsers: User[] = [
  { id: 1, name: 'Alice', age: 30, active: true },
  { id: 2, name: 'Bob', age: 25, active: false },
  { id: 3, name: 'Charlie', age: 35, active: true },
  { id: 4, name: 'David', age: 28, active: false },
  { id: 5, name: 'Eve', age: 32, active: true },
];

describe('FilterService', () => {
  let service: FilterService<User>;

  beforeEach(() => {
    service = new FilterService<User>();
  });

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  it('should filter data based on expression', () => {
    service.setData(mockUsers);
    service.setExpression({ active: true });

    const result = service.filtered();
    expect(result).toHaveLength(3);
    expect(result.every((u) => u.active)).toBe(true);
  });

  it('should return all data when no expression is set', () => {
    service.setData(mockUsers);

    const result = service.filtered();
    expect(result).toHaveLength(5);
  });

  it('should update filtered results when expression changes', () => {
    service.setData(mockUsers);
    service.setExpression({ active: true });

    let result = service.filtered();
    expect(result).toHaveLength(3);

    service.setExpression({ age: { $gte: 30 } });
    result = service.filtered();
    expect(result).toHaveLength(3);
    expect(result.every((u) => u.age >= 30)).toBe(true);
  });

  it('should update filtered results when data changes', () => {
    service.setData(mockUsers);
    service.setExpression({ active: true });

    let result = service.filtered();
    expect(result).toHaveLength(3);

    service.setData(mockUsers.slice(0, 2));
    result = service.filtered();
    expect(result).toHaveLength(1);
  });

  it('should indicate filtering is active', () => {
    service.setData(mockUsers);

    expect(service.isFiltering()).toBe(false);

    service.setExpression({ active: true });
    expect(service.isFiltering()).toBe(true);
  });

  it('should reset filters', () => {
    service.setData(mockUsers);
    service.setExpression({ active: true });
    service.setOptions({ caseSensitive: true });

    service.reset();

    const result = service.filtered();
    expect(result).toHaveLength(5);
    expect(service.isFiltering()).toBe(false);
  });

  it('should apply filter options', () => {
    service.setData(mockUsers);
    service.setExpression({ name: 'alice' });
    service.setOptions({ caseSensitive: false });

    const result = service.filtered();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice');
  });
});

describe('DebouncedFilterService', () => {
  let service: DebouncedFilterService<User>;

  beforeEach(() => {
    service = new DebouncedFilterService<User>();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create debounced service', () => {
    expect(service).toBeDefined();
  });

  it('should debounce filter updates', () => {
    service.setData(mockUsers);
    service.setExpressionDebounced({ active: true }, 300);

    expect(service.isPending()).toBe(true);
    expect(service.filtered()).toHaveLength(5);

    vi.advanceTimersByTime(300);

    expect(service.isPending()).toBe(false);
    expect(service.filtered()).toHaveLength(3);
  });

  it('should cancel previous debounce when new expression is set', () => {
    service.setData(mockUsers);
    service.setExpressionDebounced({ active: true }, 300);

    expect(service.isPending()).toBe(true);

    vi.advanceTimersByTime(150);

    service.setExpressionDebounced({ age: { $gte: 30 } }, 300);

    vi.advanceTimersByTime(150);
    expect(service.isPending()).toBe(true);

    vi.advanceTimersByTime(150);
    expect(service.isPending()).toBe(false);
    expect(service.filtered()).toHaveLength(3);
    expect(service.filtered().every((u) => u.age >= 30)).toBe(true);
  });

  it('should clear pending state on reset', () => {
    service.setData(mockUsers);
    service.setExpressionDebounced({ active: true }, 300);

    expect(service.isPending()).toBe(true);

    service.reset();

    expect(service.isPending()).toBe(false);
    expect(service.filtered()).toHaveLength(5);
  });
});

describe('PaginatedFilterService', () => {
  let service: PaginatedFilterService<User>;

  beforeEach(() => {
    service = new PaginatedFilterService<User>();
  });

  it('should create paginated service', () => {
    expect(service).toBeDefined();
  });

  it('should paginate filtered results', () => {
    service.setData(mockUsers);
    service.setExpression({ active: true });
    service.setPageSize(2);

    const page1 = service.paginatedResults();
    expect(page1).toHaveLength(2);

    service.nextPage();
    const page2 = service.paginatedResults();
    expect(page2).toHaveLength(1);
  });

  it('should calculate total pages correctly', () => {
    service.setData(mockUsers);
    service.setExpression(null);
    service.setPageSize(2);

    expect(service.totalPages()).toBe(3);

    service.setPageSize(3);
    expect(service.totalPages()).toBe(2);
  });

  it('should navigate to next page', () => {
    service.setData(mockUsers);
    service.setPageSize(2);

    expect(service.currentPage()).toBe(1);

    service.nextPage();
    expect(service.currentPage()).toBe(2);

    service.nextPage();
    expect(service.currentPage()).toBe(3);

    service.nextPage();
    expect(service.currentPage()).toBe(3);
  });

  it('should navigate to previous page', () => {
    service.setData(mockUsers);
    service.setPageSize(2);
    service.setPage(3);

    expect(service.currentPage()).toBe(3);

    service.prevPage();
    expect(service.currentPage()).toBe(2);

    service.prevPage();
    expect(service.currentPage()).toBe(1);

    service.prevPage();
    expect(service.currentPage()).toBe(1);
  });

  it('should set specific page', () => {
    service.setData(mockUsers);
    service.setPageSize(2);

    service.setPage(2);
    expect(service.currentPage()).toBe(2);

    service.setPage(5);
    expect(service.currentPage()).toBe(3);

    service.setPage(0);
    expect(service.currentPage()).toBe(1);
  });

  it('should reset to page 1 when page size changes', () => {
    service.setData(mockUsers);
    service.setPageSize(2);
    service.setPage(2);

    expect(service.currentPage()).toBe(2);

    service.setPageSize(3);
    expect(service.currentPage()).toBe(1);
  });
});

describe('FilterPipe', () => {
  let pipe: FilterPipe;

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  it('should create pipe', () => {
    expect(pipe).toBeDefined();
  });

  it('should filter data based on expression', () => {
    const result = pipe.transform(mockUsers, { active: true });

    expect(result).toHaveLength(3);
    expect(result.every((u) => u.active)).toBe(true);
  });

  it('should return empty array for null data', () => {
    const result = pipe.transform<User>(null, { active: true });

    expect(result).toEqual([]);
  });

  it('should return empty array for undefined data', () => {
    const result = pipe.transform<User>(undefined, { active: true });

    expect(result).toEqual([]);
  });

  it('should return data when expression is null', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = pipe.transform(mockUsers, null as any);

    expect(result).toEqual(mockUsers);
  });

  it('should apply filter options', () => {
    const result = pipe.transform(mockUsers, { name: 'alice' }, { caseSensitive: false });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice');
  });

  it('should handle complex expressions', () => {
    const result = pipe.transform(mockUsers, {
      age: { $gte: 30 },
      active: true,
    });

    expect(result).toHaveLength(3);
    expect(result.every((u) => u.age >= 30 && u.active)).toBe(true);
  });
});
