import { filter } from './core';

export { filter };

export { clearFilterCache, getFilterCacheStats } from './core';

export {
  filterLazy,
  filterLazyAsync,
  filterChunked,
  filterLazyChunked,
  filterFirst,
  filterExists,
  filterCount,
} from './core';

export {
  take,
  skip,
  map,
  reduce,
  toArray,
  forEach,
  every,
  some,
  find,
  chunk,
  flatten,
  asyncMap,
  asyncFilter,
} from './utils';

export type {
  Expression,
  PrimitiveExpression,
  PredicateFunction,
  ObjectExpression,
  FilterConfig,
  FilterOptions,
  Comparator,
  LazyFilterOptions,
  LazyFilterResult,
  AsyncLazyFilterResult,
  ChunkedFilterOptions,
} from './types';

export { validateExpression, validateOptions } from './validation';
export { mergeConfig, createFilterConfig } from './config';

export default filter;
