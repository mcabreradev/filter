import type { Expression, FilterOptions } from '../../types';
import { createPredicateFn } from '../../predicate';
import { validateExpression } from '../../validation';
import { mergeConfig } from '../../config';

const validateArray = (arr: unknown, fnName: string): void => {
  if (!Array.isArray(arr)) {
    throw new Error(`${fnName}: Expected array but received: ${typeof arr}`);
  }
};

const validatePositive = (val: number, name: string, fnName: string): void => {
  if (val <= 0) {
    throw new Error(`${fnName}: ${name} must be positive, received: ${val}`);
  }
};

const createPred = <T>(expr: Expression<T>, opts?: FilterOptions): ((item: T) => boolean) => {
  const cfg = mergeConfig(opts);
  const validated = validateExpression<T>(expr);
  return createPredicateFn<T>(validated, cfg);
};

export function* filterLazy<T>(
  iterable: Iterable<T>,
  expression: Expression<T>,
  options?: FilterOptions,
): Generator<T, void, undefined> {
  const pred = createPred(expression, options);
  for (const item of iterable) {
    if (pred(item)) yield item;
  }
}

export function filterLazyAsync<T>(
  iterable: AsyncIterable<T>,
  expression: Expression<T>,
  options?: FilterOptions,
): AsyncGenerator<T, void, undefined> {
  const pred = createPred(expression, options);
  return (async function* (): AsyncGenerator<T, void, undefined> {
    for await (const item of iterable) {
      if (pred(item)) yield item;
    }
  })();
}

export function filterChunked<T>(
  array: T[],
  expression: Expression<T>,
  chunkSize: number = 1000,
  options?: FilterOptions,
): T[][] {
  validateArray(array, 'filterChunked');
  validatePositive(chunkSize, 'Chunk size', 'filterChunked');

  const pred = createPred(expression, options);
  const chunks: T[][] = [];
  let chunk: T[] = [];

  for (const item of array) {
    if (pred(item)) {
      chunk.push(item);
      if (chunk.length >= chunkSize) {
        chunks.push(chunk);
        chunk = [];
      }
    }
  }

  if (chunk.length > 0) chunks.push(chunk);
  return chunks;
}

export function* filterLazyChunked<T>(
  array: T[],
  expression: Expression<T>,
  chunkSize: number = 1000,
  options?: FilterOptions,
): Generator<T[], void, undefined> {
  validateArray(array, 'filterLazyChunked');
  validatePositive(chunkSize, 'Chunk size', 'filterLazyChunked');

  const pred = createPred(expression, options);
  let chunk: T[] = [];

  for (const item of array) {
    if (pred(item)) {
      chunk.push(item);
      if (chunk.length >= chunkSize) {
        yield chunk;
        chunk = [];
      }
    }
  }

  if (chunk.length > 0) yield chunk;
}

export function filterFirst<T>(
  array: T[],
  expression: Expression<T>,
  count: number = 1,
  options?: FilterOptions,
): T[] {
  validateArray(array, 'filterFirst');
  validatePositive(count, 'Count', 'filterFirst');

  const pred = createPred(expression, options);
  const results: T[] = [];

  for (const item of array) {
    if (pred(item)) {
      results.push(item);
      if (results.length >= count) break;
    }
  }

  return results;
}

export function filterExists<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions,
): boolean {
  validateArray(array, 'filterExists');
  const pred = createPred(expression, options);
  for (const item of array) {
    if (pred(item)) return true;
  }
  return false;
}

export function filterCount<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions,
): number {
  validateArray(array, 'filterCount');
  const pred = createPred(expression, options);
  let count = 0;
  for (const item of array) {
    if (pred(item)) count++;
  }
  return count;
}
