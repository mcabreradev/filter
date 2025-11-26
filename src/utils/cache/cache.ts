import { LRUCache } from '../memoization/memoization';

export class FilterCache<T> {
  private cache = new WeakMap<T[], LRUCache<T[]>>();

  get(array: T[], key: string): T[] | undefined {
    return this.cache.get(array)?.get(key);
  }

  set(array: T[], key: string, result: T[]): void {
    if (!this.cache.has(array)) {
      this.cache.set(array, new LRUCache<T[]>(100));
    }
    const arrayCache = this.cache.get(array);
    if (arrayCache) {
      arrayCache.set(key, result);
    }
  }

  clear(): void {
    this.cache = new WeakMap<T[], LRUCache<T[]>>();
  }
}
