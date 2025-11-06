import type { OrderBy, OrderByField, SortDirection } from '../types';
import { getNestedValue } from '../types/type-helpers';
import { SORT_DIRECTIONS } from '../constants';

export function normalizeOrderBy(orderBy: OrderBy): OrderByField[] {
  if (typeof orderBy === 'string') {
    return [{ field: orderBy, direction: SORT_DIRECTIONS.ASC }];
  }

  if (Array.isArray(orderBy)) {
    return orderBy.map((item) => {
      if (typeof item === 'string') {
        return { field: item, direction: SORT_DIRECTIONS.ASC };
      }
      return item;
    });
  }

  return [orderBy];
}

export function compareValues(
  a: unknown,
  b: unknown,
  direction: SortDirection,
  caseSensitive: boolean = false,
): number {
  if (a === null || a === undefined) {
    return 1;
  }

  if (b === null || b === undefined) {
    return -1;
  }

  if (a === b) {
    return 0;
  }

  if (a instanceof Date && b instanceof Date) {
    const diff = a.getTime() - b.getTime();
    return direction === SORT_DIRECTIONS.ASC ? diff : -diff;
  }

  if (typeof a === 'number' && typeof b === 'number') {
    const diff = a - b;
    return direction === SORT_DIRECTIONS.ASC ? diff : -diff;
  }

  if (typeof a === 'boolean' && typeof b === 'boolean') {
    const diff = a === b ? 0 : a ? 1 : -1;
    return direction === SORT_DIRECTIONS.ASC ? diff : -diff;
  }

  if (typeof a === 'string' && typeof b === 'string') {
    const aStr = caseSensitive ? a : a.toLowerCase();
    const bStr = caseSensitive ? b : b.toLowerCase();
    const diff = aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
    return direction === SORT_DIRECTIONS.ASC ? diff : -diff;
  }

  const aStr = String(a);
  const bStr = String(b);
  const diff = aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
  return direction === SORT_DIRECTIONS.ASC ? diff : -diff;
}

export function sortByFields<T>(
  array: T[],
  orderBy: OrderByField[],
  caseSensitive: boolean = false,
): T[] {
  if (array.length === 0 || orderBy.length === 0) {
    return array;
  }

  const sorted = [...array];

  sorted.sort((a, b) => {
    for (const { field, direction } of orderBy) {
      const aValue = getNestedValue(a, field);
      const bValue = getNestedValue(b, field);

      const comparison = compareValues(aValue, bValue, direction, caseSensitive);

      if (comparison !== 0) {
        return comparison;
      }
    }

    return 0;
  });

  return sorted;
}
