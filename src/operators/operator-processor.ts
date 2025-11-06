import type {
  OperatorExpression,
  FilterConfig,
  ComparisonOperators,
  ArrayOperators,
  StringOperators,
  LogicalOperators,
} from '../types';
import type { GeospatialOperators, GeoPoint } from '../types/geospatial';
import type { DateTimeOperators } from '../types/datetime';
import { OPERATORS } from '../constants';
import { applyComparisonOperators } from './comparison/comparison.operators';
import { applyArrayOperators } from './array/array.operators';
import { applyStringOperators } from './string/string.operators';
import { applyLogicalOperators } from './logical/logical.operators';
import { evaluateNear, evaluateGeoBox, evaluateGeoPolygon } from './geospatial/geospatial.operators';
import {
  evaluateRecent,
  evaluateUpcoming,
  evaluateDayOfWeek,
  evaluateTimeOfDay,
  evaluateAge,
  evaluateIsWeekday,
  evaluateIsWeekend,
  evaluateIsBefore,
  evaluateIsAfter,
} from './datetime/datetime.operators';

const hasComparisonOps = (ops: unknown): ops is ComparisonOperators => {
  return (
    (ops as ComparisonOperators)[OPERATORS.GT] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.GTE] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.LT] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.LTE] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.EQ] !== undefined ||
    (ops as ComparisonOperators)[OPERATORS.NE] !== undefined
  );
};

const hasArrayOps = (ops: unknown, value: unknown): ops is ArrayOperators => {
  const hasIn = (ops as ArrayOperators)[OPERATORS.IN] !== undefined;
  const hasNin = (ops as ArrayOperators)[OPERATORS.NIN] !== undefined;
  const hasSize = (ops as ArrayOperators)[OPERATORS.SIZE] !== undefined;
  const hasContains = (ops as ArrayOperators)[OPERATORS.CONTAINS] !== undefined;

  if (hasContains && !hasIn && !hasNin && !hasSize) {
    return Array.isArray(value);
  }

  return hasIn || hasNin || hasSize || (hasContains && Array.isArray(value));
};

const hasStringOps = (ops: unknown): ops is StringOperators => {
  return (
    (ops as StringOperators)[OPERATORS.STARTS_WITH] !== undefined ||
    (ops as StringOperators)[OPERATORS.ENDS_WITH] !== undefined ||
    (ops as StringOperators)[OPERATORS.REGEX] !== undefined ||
    (ops as StringOperators)[OPERATORS.MATCH] !== undefined ||
    (ops as StringOperators)[OPERATORS.CONTAINS] !== undefined
  );
};

const hasLogicalOps = <T>(ops: unknown): ops is LogicalOperators<T> => {
  return (
    (ops as LogicalOperators<T>)[OPERATORS.AND] !== undefined ||
    (ops as LogicalOperators<T>)[OPERATORS.OR] !== undefined ||
    (ops as LogicalOperators<T>)[OPERATORS.NOT] !== undefined
  );
};

const hasGeospatialOps = (ops: unknown): ops is GeospatialOperators => {
  return (
    (ops as GeospatialOperators)[OPERATORS.NEAR] !== undefined ||
    (ops as GeospatialOperators)[OPERATORS.GEO_BOX] !== undefined ||
    (ops as GeospatialOperators)[OPERATORS.GEO_POLYGON] !== undefined
  );
};

const hasDateTimeOps = (ops: unknown): ops is DateTimeOperators => {
  return (
    (ops as DateTimeOperators)[OPERATORS.RECENT] !== undefined ||
    (ops as DateTimeOperators)[OPERATORS.UPCOMING] !== undefined ||
    (ops as DateTimeOperators)[OPERATORS.DAY_OF_WEEK] !== undefined ||
    (ops as DateTimeOperators)[OPERATORS.TIME_OF_DAY] !== undefined ||
    (ops as DateTimeOperators)[OPERATORS.AGE] !== undefined ||
    (ops as DateTimeOperators)[OPERATORS.IS_WEEKDAY] !== undefined ||
    (ops as DateTimeOperators)[OPERATORS.IS_WEEKEND] !== undefined ||
    (ops as DateTimeOperators)[OPERATORS.IS_BEFORE] !== undefined ||
    (ops as DateTimeOperators)[OPERATORS.IS_AFTER] !== undefined
  );
};

export const processOperators = <T>(
  value: unknown,
  operators: OperatorExpression | LogicalOperators<T>,
  config: FilterConfig,
  item?: T,
): boolean => {
  if (hasLogicalOps<T>(operators) && item !== undefined) {
    const andOp = operators[OPERATORS.AND];
    if (andOp !== undefined) {
      if (!applyLogicalOperators(item, OPERATORS.AND, andOp, config)) {
        return false;
      }
    }
    const orOp = operators[OPERATORS.OR];
    if (orOp !== undefined) {
      if (!applyLogicalOperators(item, OPERATORS.OR, orOp, config)) {
        return false;
      }
    }
    const notOp = operators[OPERATORS.NOT];
    if (notOp !== undefined) {
      if (!applyLogicalOperators(item, OPERATORS.NOT, notOp, config)) {
        return false;
      }
    }
  }

  if (hasComparisonOps(operators)) {
    if (!applyComparisonOperators(value, operators)) return false;
  }

  if (hasArrayOps(operators, value)) {
    if (!applyArrayOperators(value, operators)) return false;
  }

  if (hasStringOps(operators)) {
    if (!applyStringOperators(value, operators, config.caseSensitive)) return false;
  }

  if (hasGeospatialOps(operators)) {
    const nearOp = operators[OPERATORS.NEAR];
    if (nearOp && !evaluateNear(value as GeoPoint, nearOp)) return false;

    const geoBoxOp = operators[OPERATORS.GEO_BOX];
    if (geoBoxOp && !evaluateGeoBox(value as GeoPoint, geoBoxOp)) return false;

    const geoPolygonOp = operators[OPERATORS.GEO_POLYGON];
    if (geoPolygonOp && !evaluateGeoPolygon(value as GeoPoint, geoPolygonOp)) return false;
  }

  if (hasDateTimeOps(operators)) {
    const recentOp = operators[OPERATORS.RECENT];
    if (recentOp && !evaluateRecent(value, recentOp)) return false;

    const upcomingOp = operators[OPERATORS.UPCOMING];
    if (upcomingOp && !evaluateUpcoming(value, upcomingOp)) return false;

    const dayOfWeekOp = operators[OPERATORS.DAY_OF_WEEK];
    if (dayOfWeekOp && !evaluateDayOfWeek(value, dayOfWeekOp)) return false;

    const timeOfDayOp = operators[OPERATORS.TIME_OF_DAY];
    if (timeOfDayOp && !evaluateTimeOfDay(value, timeOfDayOp)) return false;

    const ageOp = operators[OPERATORS.AGE];
    if (ageOp && !evaluateAge(value, ageOp)) return false;

    const isWeekdayOp = operators[OPERATORS.IS_WEEKDAY];
    if (isWeekdayOp !== undefined && !evaluateIsWeekday(value, isWeekdayOp)) return false;

    const isWeekendOp = operators[OPERATORS.IS_WEEKEND];
    if (isWeekendOp !== undefined && !evaluateIsWeekend(value, isWeekendOp)) return false;

    const isBeforeOp = operators[OPERATORS.IS_BEFORE];
    if (isBeforeOp && !evaluateIsBefore(value, isBeforeOp)) return false;

    const isAfterOp = operators[OPERATORS.IS_AFTER];
    if (isAfterOp && !evaluateIsAfter(value, isAfterOp)) return false;
  }

  return true;
};
