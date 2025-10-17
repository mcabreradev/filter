import type {
  OperatorExpression,
  FilterConfig,
  ComparisonOperators,
  ArrayOperators,
  StringOperators,
} from '../types';
import { OPERATORS } from '../constants';
import { applyComparisonOperators } from './comparison.operators';
import { applyArrayOperators } from './array.operators';
import { applyStringOperators } from './string.operators';

const hasComparisonOps = (ops: OperatorExpression): ops is ComparisonOperators => {
  return (
    (ops as ComparisonOperators)[OPERATORS.GT] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.GTE] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.LT] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.LTE] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.EQ] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.NE] !== undefined
  );
};

const hasArrayOps = (ops: OperatorExpression): ops is ArrayOperators => {
  return (
    (ops as ArrayOperators)[OPERATORS.IN] !== undefined ||
    (ops as ArrayOperators)[OPERATORS.NIN] !== undefined ||
    (ops as ArrayOperators)[OPERATORS.CONTAINS] !== undefined ||
    (ops as ArrayOperators)[OPERATORS.SIZE] !== undefined
  );
};

const hasStringOps = (ops: OperatorExpression): ops is StringOperators => {
  return (
    (ops as StringOperators)[OPERATORS.STARTS_WITH] !== undefined ||
    (ops as StringOperators)[OPERATORS.ENDS_WITH] !== undefined ||
    (typeof (ops as StringOperators)[OPERATORS.CONTAINS] === 'string' &&
      (ops as StringOperators)[OPERATORS.CONTAINS] !== undefined)
  );
};

export const processOperators = (
  value: unknown,
  operators: OperatorExpression,
  config: FilterConfig,
): boolean => {
  if (hasComparisonOps(operators)) {
    if (!applyComparisonOperators(value, operators)) return false;
  }

  if (hasArrayOps(operators)) {
    if (!applyArrayOperators(value, operators)) return false;
  }

  if (hasStringOps(operators)) {
    if (!applyStringOperators(value, operators, config.caseSensitive)) return false;
  }

  return true;
};
