export function* take<T>(iterable: Iterable<T>, count: number): Generator<T, void, undefined> {
  if (count <= 0) return;

  let taken = 0;
  for (const item of iterable) {
    yield item;
    taken++;
    if (taken >= count) break;
  }
}

export function* skip<T>(iterable: Iterable<T>, count: number): Generator<T, void, undefined> {
  let skipped = 0;
  for (const item of iterable) {
    if (skipped < count) {
      skipped++;
      continue;
    }
    yield item;
  }
}

export function* map<T, U>(
  iterable: Iterable<T>,
  mapper: (item: T, index: number) => U,
): Generator<U, void, undefined> {
  let index = 0;
  for (const item of iterable) {
    yield mapper(item, index++);
  }
}

export function reduce<T, U>(
  iterable: Iterable<T>,
  reducer: (acc: U, item: T, index: number) => U,
  initialValue: U,
): U {
  let acc = initialValue;
  let index = 0;
  for (const item of iterable) {
    acc = reducer(acc, item, index++);
  }
  return acc;
}

export function toArray<T>(iterable: Iterable<T>): T[] {
  return Array.from(iterable);
}

export function forEach<T>(
  iterable: Iterable<T>,
  callback: (item: T, index: number) => void,
): void {
  let index = 0;
  for (const item of iterable) {
    callback(item, index++);
  }
}

export function every<T>(
  iterable: Iterable<T>,
  predicate: (item: T, index: number) => boolean,
): boolean {
  let index = 0;
  for (const item of iterable) {
    if (!predicate(item, index++)) {
      return false;
    }
  }
  return true;
}

export function some<T>(
  iterable: Iterable<T>,
  predicate: (item: T, index: number) => boolean,
): boolean {
  let index = 0;
  for (const item of iterable) {
    if (predicate(item, index++)) {
      return true;
    }
  }
  return false;
}

export function find<T>(
  iterable: Iterable<T>,
  predicate: (item: T, index: number) => boolean,
): T | undefined {
  let index = 0;
  for (const item of iterable) {
    if (predicate(item, index++)) {
      return item;
    }
  }
  return undefined;
}

export function* chunk<T>(iterable: Iterable<T>, size: number): Generator<T[], void, undefined> {
  if (size <= 0) {
    throw new Error(`Chunk size must be positive, received: ${size}`);
  }

  let currentChunk: T[] = [];

  for (const item of iterable) {
    currentChunk.push(item);

    if (currentChunk.length >= size) {
      yield currentChunk;
      currentChunk = [];
    }
  }

  if (currentChunk.length > 0) {
    yield currentChunk;
  }
}

export function* flatten<T>(iterable: Iterable<T | Iterable<T>>): Generator<T, void, undefined> {
  for (const item of iterable) {
    if (typeof item === 'object' && item !== null && Symbol.iterator in item) {
      yield* item as Iterable<T>;
    } else {
      yield item as T;
    }
  }
}

export async function* asyncMap<T, U>(
  iterable: AsyncIterable<T>,
  mapper: (item: T, index: number) => Promise<U> | U,
): AsyncGenerator<U, void, undefined> {
  let index = 0;
  for await (const item of iterable) {
    yield await mapper(item, index++);
  }
}

export async function* asyncFilter<T>(
  iterable: AsyncIterable<T>,
  predicate: (item: T, index: number) => Promise<boolean> | boolean,
): AsyncGenerator<T, void, undefined> {
  let index = 0;
  for await (const item of iterable) {
    if (await predicate(item, index++)) {
      yield item;
    }
  }
}
