import type { Expression, FilterOptions } from '../types';
import { createPredicateFn } from '../predicate';
import { validateExpression } from '../validation';
import { mergeConfig } from '../config';

export function* filterLazy<T>(
  iterable: Iterable<T>,
  expression: Expression<T>,
  options?: FilterOptions,
): Generator<T, void, undefined> {
  const config = mergeConfig(options);
  const validatedExpression = validateExpression<T>(expression);
  const predicate = createPredicateFn<T>(validatedExpression, config);

  for (const item of iterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}

export function filterLazyAsync<T>(
  iterable: AsyncIterable<T>,
  expression: Expression<T>,
  options?: FilterOptions,
): AsyncGenerator<T, void, undefined> {
  const config = mergeConfig(options);
  const validatedExpression = validateExpression<T>(expression);
  const predicate = createPredicateFn<T>(validatedExpression, config);

  return (async function* (): AsyncGenerator<T, void, undefined> {
    for await (const item of iterable) {
      if (predicate(item)) {
        yield item;
      }
    }
  })();
}

export function filterChunked<T>(
  array: T[],
  expression: Expression<T>,
  chunkSize: number = 1000,
  options?: FilterOptions,
): T[][] {
  if (!Array.isArray(array)) {
    throw new Error(`Expected array but received: ${typeof array}`);
  }

  if (chunkSize <= 0) {
    throw new Error(`Chunk size must be positive, received: ${chunkSize}`);
  }

  const config = mergeConfig(options);
  const validatedExpression = validateExpression<T>(expression);
  const predicate = createPredicateFn<T>(validatedExpression, config);

  const chunks: T[][] = [];
  let currentChunk: T[] = [];

  for (const item of array) {
    if (predicate(item)) {
      currentChunk.push(item);

      if (currentChunk.length >= chunkSize) {
        chunks.push(currentChunk);
        currentChunk = [];
      }
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

export function* filterLazyChunked<T>(
  array: T[],
  expression: Expression<T>,
  chunkSize: number = 1000,
  options?: FilterOptions,
): Generator<T[], void, undefined> {
  if (!Array.isArray(array)) {
    throw new Error(`Expected array but received: ${typeof array}`);
  }

  if (chunkSize <= 0) {
    throw new Error(`Chunk size must be positive, received: ${chunkSize}`);
  }

  const config = mergeConfig(options);
  const validatedExpression = validateExpression<T>(expression);
  const predicate = createPredicateFn<T>(validatedExpression, config);

  let currentChunk: T[] = [];

  for (const item of array) {
    if (predicate(item)) {
      currentChunk.push(item);

      if (currentChunk.length >= chunkSize) {
        yield currentChunk;
        currentChunk = [];
      }
    }
  }

  if (currentChunk.length > 0) {
    yield currentChunk;
  }
}

export function filterFirst<T>(
  array: T[],
  expression: Expression<T>,
  count: number = 1,
  options?: FilterOptions,
): T[] {
  if (!Array.isArray(array)) {
    throw new Error(`Expected array but received: ${typeof array}`);
  }

  if (count <= 0) {
    throw new Error(`Count must be positive, received: ${count}`);
  }

  const config = mergeConfig(options);
  const validatedExpression = validateExpression<T>(expression);
  const predicate = createPredicateFn<T>(validatedExpression, config);

  const results: T[] = [];

  for (const item of array) {
    if (predicate(item)) {
      results.push(item);

      if (results.length >= count) {
        break;
      }
    }
  }

  return results;
}

export function filterExists<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions,
): boolean {
  if (!Array.isArray(array)) {
    throw new Error(`Expected array but received: ${typeof array}`);
  }

  const config = mergeConfig(options);
  const validatedExpression = validateExpression<T>(expression);
  const predicate = createPredicateFn<T>(validatedExpression, config);

  for (const item of array) {
    if (predicate(item)) {
      return true;
    }
  }

  return false;
}

export function filterCount<T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions,
): number {
  if (!Array.isArray(array)) {
    throw new Error(`Expected array but received: ${typeof array}`);
  }

  const config = mergeConfig(options);
  const validatedExpression = validateExpression<T>(expression);
  const predicate = createPredicateFn<T>(validatedExpression, config);

  let count = 0;

  for (const item of array) {
    if (predicate(item)) {
      count++;
    }
  }

  return count;
}
