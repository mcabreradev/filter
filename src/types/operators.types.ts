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

type IsPlainObject<T> = T extends object
  ? T extends Array<unknown>
    ? false
    : T extends Date
      ? false
      : T extends Function
        ? false
        : true
  : false;

type Decrement<N extends number> = N extends 4
  ? 3
  : N extends 3
    ? 2
    : N extends 2
      ? 1
      : N extends 1
        ? 0
        : never;

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

type NestedObjectExpression<T, Depth extends number = 4> = [Depth] extends [0]
  ? never
  : IsPlainObject<T> extends true
    ? Partial<{
        [K in keyof T]:
          | T[K]
          | OperatorsForType<T[K]>
          | NestedObjectExpression<T[K], Decrement<Depth>>
          | string;
      }>
    : never;

export type ExtendedObjectExpression<T> = Partial<{
  [K in keyof T]:
    | T[K]
    | OperatorsForType<T[K]>
    | (IsPlainObject<T[K]> extends true ? NestedObjectExpression<T[K]> : never)
    | string;
}> &
  Partial<LogicalOperators<T>>;

export type OperatorExpression =
  | ComparisonOperators
  | ArrayOperators
  | StringOperators
  | (ComparisonOperators & ArrayOperators & StringOperators);
