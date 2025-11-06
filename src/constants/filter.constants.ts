import type { FilterConfig } from '../types';

export const TYPE_NAMES = {
  BOOLEAN: 'boolean',
  NULL: 'null',
  NUMBER: 'number',
  STRING: 'string',
  OBJECT: 'object',
  FUNCTION: 'function',
  UNDEFINED: 'undefined',
} as const;

export const WILDCARD_PERCENT = '%';
export const WILDCARD_UNDERSCORE = '_';
export const NEGATION_PREFIX = '!';
export const ANY_PROPERTY_KEY = '$';

export const OPERATORS = {
  GT: '$gt',
  GTE: '$gte',
  LT: '$lt',
  LTE: '$lte',
  EQ: '$eq',
  NE: '$ne',
  IN: '$in',
  NIN: '$nin',
  CONTAINS: '$contains',
  SIZE: '$size',
  STARTS_WITH: '$startsWith',
  ENDS_WITH: '$endsWith',
  AND: '$and',
  OR: '$or',
  NOT: '$not',
  REGEX: '$regex',
  MATCH: '$match',
  NEAR: '$near',
  GEO_BOX: '$geoBox',
  GEO_POLYGON: '$geoPolygon',
  RECENT: '$recent',
  UPCOMING: '$upcoming',
  DAY_OF_WEEK: '$dayOfWeek',
  TIME_OF_DAY: '$timeOfDay',
  AGE: '$age',
  IS_WEEKDAY: '$isWeekday',
  IS_WEEKEND: '$isWeekend',
  IS_BEFORE: '$isBefore',
  IS_AFTER: '$isAfter',
} as const;

export const OPERATOR_KEYS = Object.values(OPERATORS);

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const DEFAULT_CONFIG: FilterConfig = {
  caseSensitive: false,
  maxDepth: 3,
  enableCache: false,
  enablePerformanceMonitoring: false,
  debug: false,
  limit: undefined,
};
