export {
  isString,
  isObject,
  isFunction,
  isUndefined,
  isPrimitive,
  isPredicateFunction,
  getTypeForFilter,
  hasCustomToString,
} from './type-guards';

export {
  hasWildcard,
  createWildcardRegex,
  getCachedRegex,
  hasNegation,
  removeNegation,
} from './pattern-matching';

export { lowercase, equals } from './string-helpers';

export { FilterCache } from './cache';

export { isOperatorExpression, hasOperator } from './operator-detection';

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
} from './lazy-iterators';

export { memoization, MemoizationManager } from './memoization';

export { calculateDistance, isValidGeoPoint } from './geo-distance';

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
} from './date-time';

export {
  PerformanceMonitor,
  getPerformanceMonitor,
  resetPerformanceMonitor,
  trackPerformance,
} from './performance-monitor';

export type { PerformanceMetrics, PerformanceMonitorOptions } from './performance-monitor';
