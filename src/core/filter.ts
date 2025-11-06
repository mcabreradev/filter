import type { Expression, FilterOptions } from '../types';
import { createPredicateFn } from '../predicate';
import { validateExpression } from '../validation';
import { mergeConfig } from '../config';
import { FilterCache } from '../utils';
import { memoization } from '../utils/memoization';
import { filterDebug } from '../debug';
import { getPerformanceMonitor } from '../utils/performance-monitor.js';
import { TypeMismatchError } from '../errors/filter-errors.js';
import { normalizeOrderBy, sortByFields } from '../utils/sort';

const globalFilterCache = new FilterCache<unknown>();

export function filter<T>(array: T[], expression: Expression<T>, options?: FilterOptions): T[] {
  const performanceMonitor = getPerformanceMonitor({
    enabled: options?.enablePerformanceMonitoring ?? false,
  });
  const endTotalTime = performanceMonitor.start('filter:total');

  try {
    if (!Array.isArray(array)) {
      throw new TypeMismatchError('array', typeof array);
    }

    const endValidation = performanceMonitor.start('filter:validation');
    const config = mergeConfig(options);
    const validatedExpression = validateExpression<T>(expression);
    endValidation();

    if (config.debug) {
      const result = filterDebug(array, validatedExpression, options);
      result.print();
      let items = result.items;
      if (config.orderBy) {
        const endSorting = performanceMonitor.start('filter:sorting');
        const orderByFields = normalizeOrderBy(config.orderBy);
        items = sortByFields(items, orderByFields, config.caseSensitive);
        endSorting();
      }
      endTotalTime();
      return items;
    }

    if (config.enableCache) {
      const endCacheLookup = performanceMonitor.start('filter:cache-lookup');
      const cacheKey = memoization.createExpressionHash(validatedExpression, config);
      const cached = globalFilterCache.get(array as unknown[], cacheKey);
      endCacheLookup();

      if (cached !== undefined) {
        let result = cached as T[];
        if (config.orderBy) {
          const endSorting = performanceMonitor.start('filter:sorting');
          const orderByFields = normalizeOrderBy(config.orderBy);
          result = sortByFields(result, orderByFields, config.caseSensitive);
          endSorting();
        }
        endTotalTime();
        return result;
      }

      const endPredicateCreation = performanceMonitor.start('filter:predicate-creation');
      const predicate = createPredicateFn<T>(validatedExpression, config);
      endPredicateCreation();

      const endFiltering = performanceMonitor.start('filter:filtering');
      let result = array.filter(predicate);
      endFiltering();

      if (config.orderBy) {
        const endSorting = performanceMonitor.start('filter:sorting');
        const orderByFields = normalizeOrderBy(config.orderBy);
        result = sortByFields(result, orderByFields, config.caseSensitive);
        endSorting();
      }

      const endCacheSet = performanceMonitor.start('filter:cache-set');
      globalFilterCache.set(array as unknown[], cacheKey, result as unknown[]);
      endCacheSet();

      endTotalTime();
      return result;
    }

    const endPredicateCreation = performanceMonitor.start('filter:predicate-creation');
    const predicate = createPredicateFn<T>(validatedExpression, config);
    endPredicateCreation();

    const endFiltering = performanceMonitor.start('filter:filtering');
    let result = array.filter(predicate);
    endFiltering();

    if (config.orderBy) {
      const endSorting = performanceMonitor.start('filter:sorting');
      const orderByFields = normalizeOrderBy(config.orderBy);
      result = sortByFields(result, orderByFields, config.caseSensitive);
      endSorting();
    }

    endTotalTime();
    return result;
  } catch (error) {
    endTotalTime();
    throw error;
  }
}

export function clearFilterCache(): void {
  globalFilterCache.clear();
  memoization.clearAll();
}

export function getFilterCacheStats(): { predicateCacheSize: number; regexCacheSize: number } {
  return memoization.getStats();
}
