import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { usePaginatedFilter } from './use-paginated-filter';

interface TestItem {
  id: number;
  name: string;
  active: boolean;
}

describe('usePaginatedFilter', () => {
  const testData: TestItem[] = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    active: i % 2 === 0,
  }));

  it('should paginate filtered data', () => {
    const data = ref(testData);
    const expression = ref(() => true);
    const { pagination } = usePaginatedFilter(data, expression, 10);

    expect(pagination.value.data).toHaveLength(10);
    expect(pagination.value.currentPage).toBe(1);
    expect(pagination.value.totalPages).toBe(3);
    expect(pagination.value.totalItems).toBe(25);
  });

  it('should navigate to next page', () => {
    const data = ref(testData);
    const expression = ref(() => true);
    const { pagination, nextPage, currentPage } = usePaginatedFilter(data, expression, 10);

    nextPage();

    expect(currentPage.value).toBe(2);
    expect(pagination.value.data[0].id).toBe(11);
  });

  it('should navigate to previous page', () => {
    const data = ref(testData);
    const expression = ref(() => true);
    const { previousPage, nextPage, currentPage } = usePaginatedFilter(data, expression, 10);

    nextPage();
    previousPage();

    expect(currentPage.value).toBe(1);
  });

  it('should go to specific page', () => {
    const data = ref(testData);
    const expression = ref(() => true);
    const { pagination, goToPage, currentPage } = usePaginatedFilter(data, expression, 10);

    goToPage(3);

    expect(currentPage.value).toBe(3);
    expect(pagination.value.data).toHaveLength(5);
  });

  it('should not exceed total pages', () => {
    const data = ref(testData);
    const expression = ref(() => true);
    const { goToPage, currentPage } = usePaginatedFilter(data, expression, 10);

    goToPage(10);

    expect(currentPage.value).toBe(3);
  });

  it('should not go below page 1', () => {
    const data = ref(testData);
    const expression = ref(() => true);
    const { previousPage, currentPage } = usePaginatedFilter(data, expression, 10);

    previousPage();

    expect(currentPage.value).toBe(1);
  });

  it('should change page size', () => {
    const data = ref(testData);
    const expression = ref(() => true);
    const { pagination, setPageSize, currentPage, pageSize } = usePaginatedFilter(
      data,
      expression,
      10,
    );

    setPageSize(5);

    expect(pageSize.value).toBe(5);
    expect(pagination.value.data).toHaveLength(5);
    expect(pagination.value.totalPages).toBe(5);
    expect(currentPage.value).toBe(1);
  });

  it('should filter and paginate', () => {
    const data = ref(testData);
    const expression = ref({ active: true });
    const { pagination, isFiltering } = usePaginatedFilter(data, expression, 5);

    expect(pagination.value.totalItems).toBe(13);
    expect(pagination.value.totalPages).toBe(3);
    expect(isFiltering.value).toBe(true);
  });

  it('should update pagination when filter changes', () => {
    const data = ref(testData);
    const expression = ref<{ active: boolean }>({ active: true });
    const { pagination } = usePaginatedFilter(data, expression, 5);

    expect(pagination.value.totalItems).toBe(13);

    expression.value = { active: false };

    expect(pagination.value.totalItems).toBe(12);
  });

  it('should indicate next page availability', () => {
    const data = ref(testData);
    const expression = ref(() => true);
    const { pagination, goToPage } = usePaginatedFilter(data, expression, 10);

    expect(pagination.value.hasNextPage).toBe(true);

    goToPage(3);

    expect(pagination.value.hasNextPage).toBe(false);
  });

  it('should indicate previous page availability', () => {
    const data = ref(testData);
    const expression = ref(() => true);
    const { pagination, nextPage } = usePaginatedFilter(data, expression, 10);

    expect(pagination.value.hasPreviousPage).toBe(false);

    nextPage();

    expect(pagination.value.hasPreviousPage).toBe(true);
  });

  it('should handle empty data', () => {
    const data = ref<TestItem[]>([]);
    const expression = ref(() => true);
    const { pagination } = usePaginatedFilter(data, expression, 10);

    expect(pagination.value.data).toEqual([]);
    expect(pagination.value.totalPages).toBe(0);
    expect(pagination.value.totalItems).toBe(0);
  });

  it('should handle single page', () => {
    const smallData = testData.slice(0, 5);
    const data = ref(smallData);
    const expression = ref(() => true);
    const { pagination } = usePaginatedFilter(data, expression, 10);

    expect(pagination.value.data).toHaveLength(5);
    expect(pagination.value.totalPages).toBe(1);
    expect(pagination.value.hasNextPage).toBe(false);
    expect(pagination.value.hasPreviousPage).toBe(false);
  });

  it('should validate page size', () => {
    const data = ref(testData);
    const expression = ref(() => true);
    const { pageSize } = usePaginatedFilter(data, expression, -5);

    expect(pageSize.value).toBe(1);
  });

  it('should reset to page 1 when changing page size', () => {
    const data = ref(testData);
    const expression = ref(() => true);
    const { goToPage, setPageSize, currentPage } = usePaginatedFilter(data, expression, 10);

    goToPage(2);
    setPageSize(5);

    expect(currentPage.value).toBe(1);
  });

  it('should work with non-ref values', () => {
    const { pagination } = usePaginatedFilter(testData, () => true, 10);

    expect(pagination.value.data).toHaveLength(10);
  });
});
