import type { ExtendedObjectExpression } from './operators.types';

export type PrimitiveExpression = string | number | boolean | null;

export type PredicateFunction<T> = (item: T) => boolean;

export type ObjectExpression<T> = Partial<{
  [K in keyof T]: T[K] extends object ? T[K] | string : T[K] | string;
}>;

export type Expression<T> =
  | PrimitiveExpression
  | PredicateFunction<T>
  | ObjectExpression<T>
  | ExtendedObjectExpression<T>;
