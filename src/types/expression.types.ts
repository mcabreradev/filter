import type { ExtendedObjectExpression } from './operators.types';

export type PrimitiveExpression = string | number | boolean | null;

export type PredicateFunction<T> = (item: T) => boolean;

type ArrayValue<T> = T extends unknown[] ? never : T[];

export type ObjectExpression<T> = T extends object
  ? Partial<{
      [K in keyof T]: T[K] extends object ? T[K] | string : T[K] | string | ArrayValue<T[K]>;
    }>
  : never;

export type Expression<T> =
  | PrimitiveExpression
  | PredicateFunction<T>
  | ObjectExpression<T>
  | ExtendedObjectExpression<T>;
