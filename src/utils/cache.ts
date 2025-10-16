export class FilterCache<T> {
  private cache = new WeakMap<T[], Map<string, T[]>>();

  get(array: T[], key: string): T[] | undefined {
    return this.cache.get(array)?.get(key);
  }

  set(array: T[], key: string, result: T[]): void {
    if (!this.cache.has(array)) {
      this.cache.set(array, new Map());
    }
    this.cache.get(array)!.set(key, result);
  }

  clear(): void {
    this.cache = new WeakMap<T[], Map<string, T[]>>();
  }
}

