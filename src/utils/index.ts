export {
  isString,
  isObject,
  isFunction,
  isUndefined,
  isPrimitive,
  isPredicateFunction,
  getTypeForFilter,
  hasCustomToString,
} from './type-guards/index.js';

export {
  hasWildcard,
  createWildcardRegex,
  getCachedRegex,
  hasNegation,
  removeNegation,
} from './pattern-matching/index.js';

export { lowercase, equals } from './string-helpers/index.js';

export { FilterCache } from './cache/index.js';

export { isOperatorExpression, hasOperator } from './operator-detection/index.js';

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
} from './lazy-iterators/index.js';

export { memoization, MemoizationManager } from './memoization/index.js';

export { calculateDistance, isValidGeoPoint } from './geo-distance/index.js';

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
} from './date-time/index.js';

export {
  PerformanceMonitor,
  getPerformanceMonitor,
  resetPerformanceMonitor,
  trackPerformance,
} from './performance-monitor/index.js';

export type { PerformanceMetrics, PerformanceMonitorOptions } from './performance-monitor/index.js';
