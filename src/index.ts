import { filter } from './core/index.js';

export { filter };

export { clearFilterCache, getFilterCacheStats } from './core/index.js';

export { filterDebug } from './debug/index.js';
export type { DebugResult, DebugNode, DebugOptions, DebugStats } from './debug/index.js';

export {
  filterLazy,
  filterLazyAsync,
  filterChunked,
  filterLazyChunked,
  filterFirst,
  filterExists,
  filterCount,
} from './core/index.js';

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
} from './utils/index.js';

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
  GeoPoint,
  NearQuery,
  BoundingBox,
  PolygonQuery,
  GeospatialOperators,
  RelativeTimeQuery,
  TimeOfDayQuery,
  AgeQuery,
  DateTimeOperators,
} from './types/index.js';

export { validateExpression, validateOptions } from './validation/index.js';
export { mergeConfig, createFilterConfig } from './config/index.js';
export { calculateDistance, isValidGeoPoint } from './utils/index.js';
export { evaluateNear, evaluateGeoBox, evaluateGeoPolygon } from './operators/index.js';
export {
  isValidDate,
  isValidTimeOfDay,
  isValidDayOfWeek,
  isValidRelativeTime,
  isValidAgeQuery,
  calculateTimeDifference,
  calculateAge,
  isWeekday,
  isWeekend,
} from './utils/index.js';
export {
  evaluateRecent,
  evaluateUpcoming,
  evaluateDayOfWeek,
  evaluateTimeOfDay,
  evaluateAge,
  evaluateIsWeekday,
  evaluateIsWeekend,
  evaluateIsBefore,
  evaluateIsAfter,
} from './operators/index.js';

export {
  useFilter as useFilterReact,
  useFilteredState as useFilteredStateReact,
  useDebouncedFilter as useDebouncedFilterReact,
  usePaginatedFilter as usePaginatedFilterReact,
  FilterProvider,
  useFilterContext,
} from './integrations/react/index.js';

export type {
  UseFilterResult as UseFilterResultReact,
  UseFilteredStateResult as UseFilteredStateResultReact,
  UseDebouncedFilterOptions as UseDebouncedFilterOptionsReact,
  UseDebouncedFilterResult as UseDebouncedFilterResultReact,
  UsePaginatedFilterResult as UsePaginatedFilterResultReact,
  FilterContextValue,
} from './integrations/react/index.js';

export {
  useFilter as useFilterVue,
  useFilteredState as useFilteredStateVue,
  useDebouncedFilter as useDebouncedFilterVue,
  usePaginatedFilter as usePaginatedFilterVue,
} from './integrations/vue/index.js';

export type {
  UseFilterResult as UseFilterResultVue,
  UseFilteredStateResult as UseFilteredStateResultVue,
  UseDebouncedFilterOptions as UseDebouncedFilterOptionsVue,
  UseDebouncedFilterResult as UseDebouncedFilterResultVue,
  UsePaginatedFilterResult as UsePaginatedFilterResultVue,
} from './integrations/vue/index.js';

export {
  useFilter as useFilterSvelte,
  useFilteredState as useFilteredStateSvelte,
  useDebouncedFilter as useDebouncedFilterSvelte,
  usePaginatedFilter as usePaginatedFilterSvelte,
} from './integrations/svelte/index.js';

export type {
  UseFilterResult as UseFilterResultSvelte,
  UseFilteredStateResult as UseFilteredStateResultSvelte,
  UseDebouncedFilterOptions as UseDebouncedFilterOptionsSvelte,
  UseDebouncedFilterResult as UseDebouncedFilterResultSvelte,
  UsePaginatedFilterResult as UsePaginatedFilterResultSvelte,
} from './integrations/svelte/index.js';

export default filter;
