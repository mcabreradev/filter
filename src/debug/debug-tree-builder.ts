import type { Expression, FilterConfig } from '../types';
import type { DebugNode } from './debug.types';
import { OPERATORS } from '../constants';
import { isString, isObject, isFunction, isOperatorExpression } from '../utils';

export const buildDebugTree = <T>(expression: Expression<T>, config: FilterConfig): DebugNode => {
  if (isFunction(expression)) {
    return {
      type: 'primitive',
      operator: 'function',
      value: '<custom predicate>',
    };
  }

  if (isString(expression) || typeof expression === 'number' || typeof expression === 'boolean') {
    return {
      type: 'primitive',
      value: expression,
    };
  }

  if (isObject(expression)) {
    const expr = expression as Record<string, unknown>;
    const children: DebugNode[] = [];
    let hasLogicalOps = false;

    if (OPERATORS.AND in expr) {
      hasLogicalOps = true;
      const andExpressions = expr[OPERATORS.AND] as Expression<T>[];
      children.push({
        type: 'logical',
        operator: OPERATORS.AND,
        children: andExpressions.map((e) => buildDebugTree(e, config)),
      });
    }

    if (OPERATORS.OR in expr) {
      hasLogicalOps = true;
      const orExpressions = expr[OPERATORS.OR] as Expression<T>[];
      children.push({
        type: 'logical',
        operator: OPERATORS.OR,
        children: orExpressions.map((e) => buildDebugTree(e, config)),
      });
    }

    if (OPERATORS.NOT in expr) {
      hasLogicalOps = true;
      const notExpression = expr[OPERATORS.NOT] as Expression<T>;
      children.push({
        type: 'logical',
        operator: OPERATORS.NOT,
        children: [buildDebugTree(notExpression, config)],
      });
    }

    for (const key in expr) {
      if (key === OPERATORS.AND || key === OPERATORS.OR || key === OPERATORS.NOT) {
        continue;
      }

      const value = expr[key];

      if (Array.isArray(value)) {
        children.push({
          type: 'field',
          field: key,
          operator: 'OR',
          children: value.map((v) => ({
            type: 'primitive',
            value: v,
          })),
        });
        continue;
      }

      if (isObject(value) && isOperatorExpression(value)) {
        const operatorChildren: DebugNode[] = [];
        for (const op in value) {
          operatorChildren.push({
            type: 'operator',
            operator: op,
            field: key,
            value: (value as Record<string, unknown>)[op],
          });
        }
        children.push({
          type: 'field',
          field: key,
          children: operatorChildren,
        });
        continue;
      }

      if (isObject(value) && !isOperatorExpression(value)) {
        children.push({
          type: 'field',
          field: key,
          children: [buildDebugTree(value as Expression<T>, config)],
        });
        continue;
      }

      children.push({
        type: 'field',
        field: key,
        value,
      });
    }

    if (hasLogicalOps && children.length > 1) {
      return {
        type: 'logical',
        operator: 'ROOT',
        children,
      };
    }

    if (children.length === 1) {
      return children[0];
    }

    return {
      type: 'logical',
      operator: 'AND',
      children,
    };
  }

  return {
    type: 'primitive',
    value: expression,
  };
};
