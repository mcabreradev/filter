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
  $regex?: string | RegExp;
  $match?: string | RegExp;
}

export interface LogicalOperators<T> {
  $and?: Expression<T>[];
  $or?: Expression<T>[];
  $not?: Expression<T>;
}

type OperatorsForType<T> = T extends string
  ? {
      $startsWith?: string;
      $endsWith?: string;
      $contains?: string;
      $regex?: string | RegExp;
      $match?: string | RegExp;
      $eq?: string;
      $ne?: string;
    }
  : T extends number
    ? {
        $gt?: number;
        $gte?: number;
        $lt?: number;
        $lte?: number;
        $eq?: number;
        $ne?: number;
      }
    : T extends Date
      ? {
          $gt?: Date;
          $gte?: Date;
          $lt?: Date;
          $lte?: Date;
          $eq?: Date;
          $ne?: Date;
        }
      : T extends (infer U)[]
        ? {
            $in?: U[];
            $nin?: U[];
            $contains?: U;
            $size?: number;
          }
        : T extends boolean
          ? {
              $eq?: boolean;
              $ne?: boolean;
            }
          : {
              $eq?: T;
              $ne?: T;
            };

export type ExtendedObjectExpression<T> = Partial<{
  [K in keyof T]: T[K] | OperatorsForType<T[K]> | string;
}> &
  Partial<LogicalOperators<T>>;

export type OperatorExpression =
  | ComparisonOperators
  | ArrayOperators
  | StringOperators
  | (ComparisonOperators & ArrayOperators & StringOperators);
