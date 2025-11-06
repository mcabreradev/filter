// Internal operator processors
export { applyComparisonOperators } from './comparison/comparison.operators';
export { applyArrayOperators } from './array/array.operators';
export { applyStringOperators } from './string/string.operators';
export { applyLogicalOperators } from './logical/logical.operators';
export { processOperators } from './operator-processor';

// Comparison operators (exported as individual functions for direct use)
export { applyComparisonOperators as evaluateComparison } from './comparison/comparison.operators';

// Array operators
export { applyArrayOperators as evaluateArray } from './array/array.operators';

// String operators
export { applyStringOperators as evaluateString } from './string/string.operators';

// Logical operators
export { applyLogicalOperators as evaluateLogical } from './logical/logical.operators';

// Geospatial operators
export {
  evaluateNear,
  evaluateGeoBox,
  evaluateGeoPolygon,
} from './geospatial/geospatial.operators';

// Date/Time operators
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
} from './datetime/datetime.operators';

// Re-export types for convenience
export type {
  ComparisonOperators,
  ArrayOperators,
  StringOperators,
  LogicalOperators,
  GeospatialOperators,
  DateTimeOperators,
  GeoPoint,
  NearQuery,
  BoundingBox,
  PolygonQuery,
  RelativeTimeQuery,
  TimeOfDayQuery,
  AgeQuery,
} from '../types/index.js';
