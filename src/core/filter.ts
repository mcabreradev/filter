import type { Expression, FilterOptions } from '../types';
import { createPredicateFn } from '../predicate';
import { validateExpression } from '../validation';
import { mergeConfig } from '../config';
import { FilterCache } from '../utils';
import { memoization } from '../utils/memoization';
import { filterDebug } from '../debug';
import { getPerformanceMonitor } from '../utils/performance-monitor.js';
import { TypeMismatchError } from '../errors/filter-errors.js';

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
      endTotalTime();
      return result.items;
    }

    if (config.enableCache) {
      const endCacheLookup = performanceMonitor.start('filter:cache-lookup');
      const cacheKey = memoization.createExpressionHash(validatedExpression, config);
      const cached = globalFilterCache.get(array as unknown[], cacheKey);
      endCacheLookup();

      if (cached !== undefined) {
        endTotalTime();
        return cached as T[];
      }

      const endPredicateCreation = performanceMonitor.start('filter:predicate-creation');
      const predicate = createPredicateFn<T>(validatedExpression, config);
      endPredicateCreation();

      const endFiltering = performanceMonitor.start('filter:filtering');
      const result = array.filter(predicate);
      endFiltering();

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
    const result = array.filter(predicate);
    endFiltering();

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
