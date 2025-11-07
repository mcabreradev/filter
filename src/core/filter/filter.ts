import type { Expression, FilterOptions } from '../../types';
import { createPredicateFn } from '../../predicate';
import { validateExpression } from '../../validation';
import { mergeConfig } from '../../config';
import { FilterCache } from '../../utils';
import { memoization } from '../../utils/memoization';
import { filterDebug } from '../../debug';
import { getPerformanceMonitor } from '../../utils/performance-monitor';
import { TypeMismatchError } from '../../errors/filter-errors.js';
import { normalizeOrderBy, sortByFields } from '../../utils/sort';

const globalFilterCache = new FilterCache<unknown>();

const applyPostProcessing = <T>(
  items: T[],
  orderBy: FilterOptions['orderBy'],
  limit: number | undefined,
  caseSensitive: boolean,
): T[] => {
  let result = items;
  if (orderBy) {
    const fields = normalizeOrderBy(orderBy);
    result = sortByFields(result, fields, caseSensitive);
  }
  if (limit !== undefined && limit > 0) {
    result = result.slice(0, limit);
  }
  return result;
};

export function filter<T>(array: T[], expression: Expression<T>, options?: FilterOptions): T[] {
  const perfMon = getPerformanceMonitor({ enabled: options?.enablePerformanceMonitoring ?? false });
  const endTotal = perfMon.start('filter:total');

  try {
    if (!Array.isArray(array)) {
      throw new TypeMismatchError('array', typeof array);
    }

    const endVal = perfMon.start('filter:validation');
    const cfg = mergeConfig(options);
    const expr = validateExpression<T>(expression);
    endVal();

    if (cfg.debug) {
      const dbg = filterDebug(array, expr, options);
      dbg.print();
      const result = applyPostProcessing(dbg.items, cfg.orderBy, cfg.limit, cfg.caseSensitive);
      endTotal();
      return result;
    }

    if (cfg.enableCache) {
      const endCacheLookup = perfMon.start('filter:cache-lookup');
      const key = memoization.createExpressionHash(expr, cfg);
      const cached = globalFilterCache.get(array as unknown[], key);
      endCacheLookup();

      if (cached !== undefined) {
        const result = applyPostProcessing(
          cached as T[],
          cfg.orderBy,
          cfg.limit,
          cfg.caseSensitive,
        );
        endTotal();
        return result;
      }

      const endPred = perfMon.start('filter:predicate-creation');
      const pred = createPredicateFn<T>(expr, cfg);
      endPred();

      const endFilt = perfMon.start('filter:filtering');
      const filtered = array.filter(pred);
      endFilt();

      const result = applyPostProcessing(filtered, cfg.orderBy, cfg.limit, cfg.caseSensitive);

      const endCache = perfMon.start('filter:cache-set');
      globalFilterCache.set(array as unknown[], key, result as unknown[]);
      endCache();

      endTotal();
      return result;
    }

    const endPred = perfMon.start('filter:predicate-creation');
    const pred = createPredicateFn<T>(expr, cfg);
    endPred();

    const endFilt = perfMon.start('filter:filtering');
    const filtered = array.filter(pred);
    endFilt();

    const result = applyPostProcessing(filtered, cfg.orderBy, cfg.limit, cfg.caseSensitive);
    endTotal();
    return result;
  } catch (error) {
    endTotal();
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
