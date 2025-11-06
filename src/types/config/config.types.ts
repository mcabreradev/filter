export type SortDirection = 'asc' | 'desc';

export interface OrderByField {
  field: string;
  direction: SortDirection;
}

export type OrderBy = string | OrderByField | Array<string | OrderByField>;

export interface FilterConfig {
  caseSensitive: boolean;
  maxDepth: number;
  customComparator?: Comparator;
  enableCache: boolean;
  enablePerformanceMonitoring?: boolean;
  debug?: boolean;
  verbose?: boolean;
  showTimings?: boolean;
  colorize?: boolean;
  orderBy?: OrderBy;
  limit?: number;
}

export type Comparator = (actual: unknown, expected: unknown) => boolean;

export type FilterOptions = Partial<FilterConfig>;
