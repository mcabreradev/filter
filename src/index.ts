import { filter } from './core';

export { filter };

export type {
  Expression,
  PrimitiveExpression,
  PredicateFunction,
  ObjectExpression,
  FilterConfig,
  FilterOptions,
  Comparator,
} from './types';

export { validateExpression, validateOptions } from './validation';
export { mergeConfig, createFilterConfig } from './config';

export default filter;
