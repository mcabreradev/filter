import { LRUCache } from '../memoization/memoization';

interface ArrayCacheEntry<T> {
  length: number;
  lru: LRUCache<T[]>;
}

export class FilterCache<T> {
  private cache = new WeakMap<T[], ArrayCacheEntry<T>>();

  get(array: T[], key: string): T[] | undefined {
    const entry = this.cache.get(array);
    if (!entry) return undefined;
    if (entry.length !== array.length) return undefined;
    return entry.lru.get(key);
  }

  set(array: T[], key: string, result: T[]): void {
    const existing = this.cache.get(array);
    if (!existing || existing.length !== array.length) {
      this.cache.set(array, { length: array.length, lru: new LRUCache<T[]>(100) });
    }
    const entry = this.cache.get(array);
    if (entry) {
      entry.lru.set(key, result);
    }
  }

  clear(): void {
    this.cache = new WeakMap<T[], ArrayCacheEntry<T>>();
  }
}
