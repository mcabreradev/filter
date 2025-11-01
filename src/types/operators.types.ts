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

type IsGeoPoint<T> = T extends { lat: number; lng: number } ? true : false;

type OperatorsForType<T> =
  IsGeoPoint<T> extends true
    ? {
        $near?: import('./geospatial').NearQuery;
        $geoBox?: import('./geospatial').BoundingBox;
        $geoPolygon?: import('./geospatial').PolygonQuery;
        $eq?: T;
        $ne?: T;
        $in?: T[];
        $nin?: T[];
      }
    : T extends string
      ? {
          $startsWith?: string;
          $endsWith?: string;
          $contains?: string;
          $regex?: string | RegExp;
          $match?: string | RegExp;
          $eq?: string;
          $ne?: string;
          $in?: string[];
          $nin?: string[];
        }
      : T extends number
        ? {
            $gt?: number;
            $gte?: number;
            $lt?: number;
            $lte?: number;
            $eq?: number;
            $ne?: number;
            $in?: number[];
            $nin?: number[];
          }
        : T extends Date
          ? {
              $gt?: Date;
              $gte?: Date;
              $lt?: Date;
              $lte?: Date;
              $eq?: Date;
              $ne?: Date;
              $in?: Date[];
              $nin?: Date[];
              $recent?: import('./datetime').RelativeTimeQuery;
              $upcoming?: import('./datetime').RelativeTimeQuery;
              $dayOfWeek?: number[];
              $timeOfDay?: import('./datetime').TimeOfDayQuery;
              $age?: import('./datetime').AgeQuery;
              $isWeekday?: boolean;
              $isWeekend?: boolean;
              $isBefore?: Date;
              $isAfter?: Date;
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
                  $in?: boolean[];
                  $nin?: boolean[];
                }
              : {
                  $eq?: T;
                  $ne?: T;
                  $in?: T[];
                  $nin?: T[];
                };

type NestedObjectExpression<T, Depth extends number = 4> = [Depth] extends [0]
  ? never
  : IsPlainObject<T> extends true
    ? Partial<{
        [K in keyof T]:
          | T[K]
          | ArrayValueForOperator<T[K]>
          | OperatorsForType<T[K]>
          | NestedObjectExpression<T[K], Decrement<Depth>>
          | string;
      }>
    : never;

type ArrayValueForOperator<T> = T extends unknown[] ? never : T[];

export type ExtendedObjectExpression<T> = T extends object
  ? Partial<{
      [K in keyof T]:
        | T[K]
        | ArrayValueForOperator<T[K]>
        | OperatorsForType<T[K]>
        | (IsPlainObject<T[K]> extends true ? NestedObjectExpression<T[K]> : never)
        | string;
    }> &
      Partial<LogicalOperators<T>>
  : never;

export type OperatorExpression =
  | ComparisonOperators
  | ArrayOperators
  | StringOperators
  | (ComparisonOperators & ArrayOperators & StringOperators);
