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

export {
  useFilter as useFilterReact,
  useFilteredState as useFilteredStateReact,
  useDebouncedFilter as useDebouncedFilterReact,
  usePaginatedFilter as usePaginatedFilterReact,
  FilterProvider,
  useFilterContext,
} from './integrations/react';

export type {
  UseFilterResult as UseFilterResultReact,
  UseFilteredStateResult as UseFilteredStateResultReact,
  UseDebouncedFilterOptions as UseDebouncedFilterOptionsReact,
  UseDebouncedFilterResult as UseDebouncedFilterResultReact,
  UsePaginatedFilterResult as UsePaginatedFilterResultReact,
  FilterContextValue,
} from './integrations/react';

export {
  useFilter as useFilterVue,
  useFilteredState as useFilteredStateVue,
  useDebouncedFilter as useDebouncedFilterVue,
  usePaginatedFilter as usePaginatedFilterVue,
} from './integrations/vue';

export type {
  UseFilterResult as UseFilterResultVue,
  UseFilteredStateResult as UseFilteredStateResultVue,
  UseDebouncedFilterOptions as UseDebouncedFilterOptionsVue,
  UseDebouncedFilterResult as UseDebouncedFilterResultVue,
  UsePaginatedFilterResult as UsePaginatedFilterResultVue,
} from './integrations/vue';

export {
  useFilter as useFilterSvelte,
  useFilteredState as useFilteredStateSvelte,
  useDebouncedFilter as useDebouncedFilterSvelte,
  usePaginatedFilter as usePaginatedFilterSvelte,
} from './integrations/svelte';

export type {
  UseFilterResult as UseFilterResultSvelte,
  UseFilteredStateResult as UseFilteredStateResultSvelte,
  UseDebouncedFilterOptions as UseDebouncedFilterOptionsSvelte,
  UseDebouncedFilterResult as UseDebouncedFilterResultSvelte,
  UsePaginatedFilterResult as UsePaginatedFilterResultSvelte,
} from './integrations/svelte';

export default filter;
