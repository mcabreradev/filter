import type { Expression, FilterOptions } from '../types';
import { createPredicateFn } from '../predicate';
import { validateExpression } from '../validation';
import { mergeConfig } from '../config';
import { FilterCache } from '../utils';
import { memoization } from '../utils/memoization';

const globalFilterCache = new FilterCache<unknown>();

export function filter<T>(array: T[], expression: Expression<T>, options?: FilterOptions): T[] {
  if (!Array.isArray(array)) {
    throw new Error(`Expected array but received: ${typeof array}`);
  }

  const config = mergeConfig(options);
  const validatedExpression = validateExpression<T>(expression);

  if (config.enableCache) {
    const cacheKey = memoization.createExpressionHash(validatedExpression, config);
    const cached = globalFilterCache.get(array as unknown[], cacheKey);
    if (cached !== undefined) {
      return cached as T[];
    }

    const predicate = createPredicateFn<T>(validatedExpression, config);
    const result = array.filter(predicate);

    globalFilterCache.set(array as unknown[], cacheKey, result as unknown[]);
    return result;
  }

  const predicate = createPredicateFn<T>(validatedExpression, config);
  return array.filter(predicate);
}

export function clearFilterCache(): void {
  globalFilterCache.clear();
  memoization.clearAll();
}

export function getFilterCacheStats(): { predicateCacheSize: number; regexCacheSize: number } {
  return memoization.getStats();
}
