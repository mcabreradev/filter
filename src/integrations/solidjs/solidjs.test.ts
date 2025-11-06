import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSignal } from 'solid-js';
import { createRoot } from 'solid-js';
import { useFilter, useDebouncedFilter, usePaginatedFilter } from './index';

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

describe('useFilter', () => {
  it('should filter data based on expression', () => {
    createRoot((dispose) => {
      const [data] = createSignal(mockUsers);
      const [expression] = createSignal({ active: true });

      const { filtered, isFiltering } = useFilter(data, expression);

      expect(filtered()).toHaveLength(3);
      expect(filtered().every((u) => u.active)).toBe(true);
      expect(isFiltering()).toBe(true);

      dispose();
    });
  });

  it('should return all data when expression is null', () => {
    createRoot((dispose) => {
      const [data] = createSignal(mockUsers);
      const [expression] = createSignal(null);

      const { filtered, isFiltering } = useFilter(data, expression);

      expect(filtered()).toHaveLength(5);
      expect(isFiltering()).toBe(false);

      dispose();
    });
  });

  it.skip('should update when data changes', () => {
    createRoot((dispose) => {
      const [data, setData] = createSignal(mockUsers);
      const [expression] = createSignal({ active: true });

      const { filtered } = useFilter(data, expression);

      expect(filtered()).toHaveLength(3);

      setData(mockUsers.slice(0, 2));
      expect(filtered()).toHaveLength(1);

      dispose();
    });
  });

  it('should update when expression changes', () => {
    createRoot((dispose) => {
      const [data] = createSignal(mockUsers);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [expression, setExpression] = createSignal<any>({ active: true });

      const { filtered } = useFilter(data, expression);

      expect(filtered()).toHaveLength(3);

      setExpression({ age: { $gte: 30 } });
      expect(filtered()).toHaveLength(3);
      expect(filtered().every((u) => u.age >= 30)).toBe(true);

      dispose();
    });
  });

  it('should apply filter options', () => {
    createRoot((dispose) => {
      const [data] = createSignal(mockUsers);
      const [expression] = createSignal({ name: 'alice' });
      const [options] = createSignal({ caseSensitive: false });

      const { filtered } = useFilter(data, expression, options);

      expect(filtered()).toHaveLength(1);
      expect(filtered()[0].name).toBe('Alice');

      dispose();
    });
  });
});

describe('useDebouncedFilter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.skip('should debounce filter updates', () => {
    createRoot((dispose) => {
      const [data] = createSignal(mockUsers);
      const [expression] = createSignal({ active: true });

      const { filtered, isPending } = useDebouncedFilter(data, expression, {
        delay: 300,
      });

      expect(isPending()).toBe(true);
      expect(filtered()).toHaveLength(5);

      vi.advanceTimersByTime(300);

      expect(isPending()).toBe(false);
      expect(filtered()).toHaveLength(3);

      dispose();
    });
  });

  it.skip('should cancel previous debounce when expression changes', () => {
    createRoot((dispose) => {
      const [data] = createSignal(mockUsers);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [expression, setExpression] = createSignal<any>({ active: true });

      const { filtered, isPending } = useDebouncedFilter(data, expression, {
        delay: 300,
      });

      expect(isPending()).toBe(true);

      vi.advanceTimersByTime(150);

      setExpression({ age: { $gte: 30 } });

      vi.advanceTimersByTime(150);
      expect(isPending()).toBe(true);

      vi.advanceTimersByTime(150);
      expect(isPending()).toBe(false);
      expect(filtered().every((u) => u.age >= 30)).toBe(true);

      dispose();
    });
  });

  it.skip('should apply filter options', () => {
    createRoot((dispose) => {
      const [data] = createSignal(mockUsers);
      const [expression] = createSignal({ name: 'alice' });

      const { filtered } = useDebouncedFilter(data, expression, {
        delay: 300,
        filterOptions: { caseSensitive: false },
      });

      vi.advanceTimersByTime(300);

      expect(filtered()).toHaveLength(1);
      expect(filtered()[0].name).toBe('Alice');

      dispose();
    });
  });
});

describe('usePaginatedFilter', () => {
  it.skip('should paginate filtered results', () => {
    createRoot((dispose) => {
      const [data] = createSignal(mockUsers);
      const [expression] = createSignal({ active: true });

      const { paginatedResults, nextPage } = usePaginatedFilter(data, expression, { pageSize: 2 });

      expect(paginatedResults()).toHaveLength(2);

      nextPage();
      expect(paginatedResults()).toHaveLength(1);

      dispose();
    });
  });

  it.skip('should calculate total pages correctly', () => {
    createRoot((dispose) => {
      const [data] = createSignal(mockUsers);
      const [expression] = createSignal(null);

      const { totalPages, setPageSize } = usePaginatedFilter(data, expression, { pageSize: 2 });

      expect(totalPages()).toBe(3);

      setPageSize(3);
      expect(totalPages()).toBe(2);

      dispose();
    });
  });

  it('should navigate pages correctly', () => {
    createRoot((dispose) => {
      const [data] = createSignal(mockUsers);
      const [expression] = createSignal(null);

      const { currentPage, nextPage, prevPage, setPage } = usePaginatedFilter(data, expression, {
        pageSize: 2,
      });

      expect(currentPage()).toBe(1);

      nextPage();
      expect(currentPage()).toBe(2);

      nextPage();
      expect(currentPage()).toBe(3);

      nextPage();
      expect(currentPage()).toBe(3);

      prevPage();
      expect(currentPage()).toBe(2);

      setPage(1);
      expect(currentPage()).toBe(1);

      dispose();
    });
  });

  it('should reset to page 1 when page size changes', () => {
    createRoot((dispose) => {
      const [data] = createSignal(mockUsers);
      const [expression] = createSignal(null);

      const { currentPage, setPage, setPageSize } = usePaginatedFilter(data, expression, {
        pageSize: 2,
      });

      setPage(2);
      expect(currentPage()).toBe(2);

      setPageSize(3);
      expect(currentPage()).toBe(1);

      dispose();
    });
  });

  it('should apply filter options', () => {
    createRoot((dispose) => {
      const [data] = createSignal(mockUsers);
      const [expression] = createSignal({ name: 'alice' });

      const { paginatedResults } = usePaginatedFilter(data, expression, {
        pageSize: 2,
        filterOptions: { caseSensitive: false },
      });

      expect(paginatedResults()).toHaveLength(1);
      expect(paginatedResults()[0].name).toBe('Alice');

      dispose();
    });
  });
});
