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

export type OperatorExpression =
  | ComparisonOperators
  | ArrayOperators
  | StringOperators
  | (ComparisonOperators & ArrayOperators & StringOperators);

export type ExtendedObjectExpression<T> = Partial<{
  [K in keyof T]: T[K] | OperatorExpression | string;
}>;
