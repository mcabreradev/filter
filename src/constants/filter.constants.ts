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
} as const;

export const OPERATOR_KEYS = Object.values(OPERATORS);

export const DEFAULT_CONFIG: FilterConfig = {
  caseSensitive: false,
  maxDepth: 3,
  enableCache: false,
};
