export type {
  PrimitiveExpression,
  PredicateFunction,
  ObjectExpression,
  Expression,
} from './expression.types';

export type { FilterConfig, Comparator, FilterOptions } from './config.types';

export type {
  ComparisonOperators,
  ArrayOperators,
  StringOperators,
  LogicalOperators,
  OperatorExpression,
  ExtendedObjectExpression,
} from './operators.types';

export type {
  LazyFilterOptions,
  LazyFilterResult,
  AsyncLazyFilterResult,
  ChunkedFilterOptions,
} from './lazy.types';

export type {
  GeoPoint,
  NearQuery,
  BoundingBox,
  PolygonQuery,
  GeospatialOperators,
} from './geospatial';
