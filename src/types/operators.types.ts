import type { Expression } from './expression.types';

export interface ComparisonOperators {
  $gt?: number | Date;
  $gte?: number | Date;
  $lt?: number | Date;
  $lte?: number | Date;
  $eq?: unknown;
  $ne?: unknown;
}

export interface ArrayOperators {
  $in?: unknown[];
  $nin?: unknown[];
  $contains?: unknown;
  $size?: number;
}

export interface StringOperators {
  $startsWith?: string;
  $endsWith?: string;
  $contains?: string;
}

export interface LogicalOperators<T> {
  $and?: Expression<T>[];
  $or?: Expression<T>[];
  $not?: Expression<T>;
}

export type OperatorExpression =
  | ComparisonOperators
  | ArrayOperators
  | StringOperators
  | (ComparisonOperators & ArrayOperators & StringOperators);

export type ExtendedObjectExpression<T> = Partial<{
  [K in keyof T]: T[K] | OperatorExpression | string;
}> &
  Partial<LogicalOperators<T>>;
