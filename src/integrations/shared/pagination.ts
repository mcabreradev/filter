export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface PaginationResult<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationActions {
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export function calculateTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}

export function getPageData<T>(data: T[], currentPage: number, pageSize: number): T[] {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return data.slice(startIndex, endIndex);
}

export function createPaginationResult<T>(
  data: T[],
  _allData: T[],
  state: PaginationState,
): PaginationResult<T> {
  const totalPages = calculateTotalPages(state.totalItems, state.pageSize);

  return {
    data,
    currentPage: state.currentPage,
    pageSize: state.pageSize,
    totalItems: state.totalItems,
    totalPages,
    hasNextPage: state.currentPage < totalPages,
    hasPreviousPage: state.currentPage > 1,
  };
}

export function validatePageNumber(page: number, totalPages: number): number {
  return Math.max(1, Math.min(page, totalPages));
}

export function validatePageSize(size: number): number {
  return Math.max(1, size);
}
