export interface FilterConfig {
  caseSensitive: boolean;
  maxDepth: number;
  customComparator?: Comparator;
  enableCache: boolean;
}

export type Comparator = (actual: unknown, expected: unknown) => boolean;

export type FilterOptions = Partial<FilterConfig>;
