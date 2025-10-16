import type { OperatorExpression, FilterConfig } from '../types';
import { OPERATORS } from '../constants';
import { applyComparisonOperators } from './comparison.operators';
import { applyArrayOperators } from './array.operators';
import { applyStringOperators } from './string.operators';

const hasComparisonOps = (ops: any): boolean => {
  return (
    ops[OPERATORS.GT] !== undefined ||
    ops[OPERATORS.GTE] !== undefined ||
    ops[OPERATORS.LT] !== undefined ||
    ops[OPERATORS.LTE] !== undefined ||
    ops[OPERATORS.EQ] !== undefined ||
    ops[OPERATORS.NE] !== undefined
  );
};

const hasArrayOps = (ops: any): boolean => {
  return (
    ops[OPERATORS.IN] !== undefined ||
    ops[OPERATORS.NIN] !== undefined ||
    ops[OPERATORS.CONTAINS] !== undefined ||
    ops[OPERATORS.SIZE] !== undefined
  );
};

const hasStringOps = (ops: any): boolean => {
  return (
    ops[OPERATORS.STARTS_WITH] !== undefined ||
    ops[OPERATORS.ENDS_WITH] !== undefined ||
    (typeof ops[OPERATORS.CONTAINS] === 'string' && ops[OPERATORS.CONTAINS] !== undefined)
  );
};

export const processOperators = (
  value: unknown,
  operators: OperatorExpression,
  config: FilterConfig
): boolean => {
  if (hasComparisonOps(operators)) {
    if (!applyComparisonOperators(value, operators as any)) return false;
  }

  if (hasArrayOps(operators)) {
    if (!applyArrayOperators(value, operators as any)) return false;
  }

  if (hasStringOps(operators)) {
    if (!applyStringOperators(value, operators as any, config.caseSensitive)) return false;
  }

  return true;
};

