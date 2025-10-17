import { OPERATOR_KEYS } from '../constants';
import { isObject } from './type-guards';

export const isOperatorExpression = (value: unknown): boolean => {
  if (!isObject(value)) return false;
  return Object.keys(value).some((key) =>
    OPERATOR_KEYS.includes(key as (typeof OPERATOR_KEYS)[number]),
  );
};

export const hasOperator = (obj: Record<string, unknown>, operator: string): boolean => {
  return operator in obj;
};
