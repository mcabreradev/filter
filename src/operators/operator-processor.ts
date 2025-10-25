import type {
  OperatorExpression,
  FilterConfig,
  ComparisonOperators,
  ArrayOperators,
  StringOperators,
  LogicalOperators,
} from '../types';
import { OPERATORS } from '../constants';
import { applyComparisonOperators } from './comparison.operators';
import { applyArrayOperators } from './array.operators';
import { applyStringOperators } from './string.operators';
import { applyLogicalOperators } from './logical.operators';

const hasComparisonOps = (ops: unknown): ops is ComparisonOperators => {
  return (
    (ops as ComparisonOperators)[OPERATORS.GT] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.GTE] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.LT] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.LTE] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.EQ] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.NE] !== undefined
  );
};

const hasArrayOps = (ops: unknown): ops is ArrayOperators => {
  return (
    (ops as ArrayOperators)[OPERATORS.IN] !== undefined ||
    (ops as ArrayOperators)[OPERATORS.NIN] !== undefined ||
    (ops as ArrayOperators)[OPERATORS.CONTAINS] !== undefined ||
    (ops as ArrayOperators)[OPERATORS.SIZE] !== undefined
  );
};

const hasStringOps = (ops: unknown): ops is StringOperators => {
  return (
    (ops as StringOperators)[OPERATORS.STARTS_WITH] !== undefined ||
    (ops as StringOperators)[OPERATORS.ENDS_WITH] !== undefined ||
    (typeof (ops as StringOperators)[OPERATORS.CONTAINS] === 'string' &&
      (ops as StringOperators)[OPERATORS.CONTAINS] !== undefined)
  );
};

const hasLogicalOps = <T>(ops: unknown): ops is LogicalOperators<T> => {
  return (
    (ops as LogicalOperators<T>)[OPERATORS.AND] !== undefined ||
    (ops as LogicalOperators<T>)[OPERATORS.OR] !== undefined ||
    (ops as LogicalOperators<T>)[OPERATORS.NOT] !== undefined
  );
};

export const processOperators = <T>(
  value: unknown,
  operators: OperatorExpression | LogicalOperators<T>,
  config: FilterConfig,
  item?: T,
): boolean => {
  if (hasLogicalOps<T>(operators) && item !== undefined) {
    const andOp = operators[OPERATORS.AND];
    if (andOp !== undefined) {
      if (!applyLogicalOperators(item, OPERATORS.AND, andOp, config)) {
        return false;
      }
    }
    const orOp = operators[OPERATORS.OR];
    if (orOp !== undefined) {
      if (!applyLogicalOperators(item, OPERATORS.OR, orOp, config)) {
        return false;
      }
    }
    const notOp = operators[OPERATORS.NOT];
    if (notOp !== undefined) {
      if (!applyLogicalOperators(item, OPERATORS.NOT, notOp, config)) {
        return false;
      }
    }
  }

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
