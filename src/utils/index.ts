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
