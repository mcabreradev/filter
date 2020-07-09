import { createPredicateFn } from './functions';
import { getTypeForFilter, isArrayLike } from './utils';

const filter = (array, expression, comparator, anyPropertyKey) => {
    if (!isArrayLike(array)) {
      if (array == null) {
        return array;
      } else {
        throw minErr('filter')('notarray', 'Expected array but received: {0}', array);
      }
    }

    anyPropertyKey = anyPropertyKey || '$';
    const expressionType = getTypeForFilter(expression);
    let predicateFn;
    let matchAgainstAnyProp;

    switch (expressionType) {
      case 'function':
        predicateFn = expression;
        break;
      case 'boolean':
      case 'null':
      case 'number':
      case 'string':
        matchAgainstAnyProp = true;
      case 'object':
        predicateFn = createPredicateFn(expression, comparator, anyPropertyKey, matchAgainstAnyProp);
        break;
      default:
        return array;
    }

    return Array.prototype.filter.call(array, predicateFn);
  };

  module.exports = filter;