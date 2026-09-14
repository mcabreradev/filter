import type { Expression, FilterConfig } from '../../types';

interface MemoizationCache<R> {
  get(key: string): R | undefined;
  set(key: string, value: R): void;
  clear(): void;
  size(): number;
}

export class LRUCache<R> implements MemoizationCache<R> {
  private cache = new Map<string, { value: R; timestamp: number }>();
  private maxSize: number;
  private maxAge: number;

  constructor(maxSize = 1000, maxAge = 300000) {
    this.maxSize = maxSize;
    this.maxAge = maxAge;
  }

  get(key: string): R | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return undefined;
    }

    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  set(key: string, value: R): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, { value, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export class MemoizationManager {
  private static instance: MemoizationManager;
  private predicateCache: LRUCache<(item: unknown) => boolean>;
  private regexCache: LRUCache<RegExp>;
  private expressionHashCache: WeakMap<object, string>;

  private constructor() {
    this.predicateCache = new LRUCache<(item: unknown) => boolean>(500, 300000);
    this.regexCache = new LRUCache<RegExp>(500, 300000);
    this.expressionHashCache = new WeakMap();
  }

  static getInstance(): MemoizationManager {
    if (!MemoizationManager.instance) {
      MemoizationManager.instance = new MemoizationManager();
    }
    return MemoizationManager.instance;
  }

  createExpressionHash<T>(expression: Expression<T>, config: FilterConfig): string {
    if (typeof expression === 'function') {
      return `fn:${expression.toString()}`;
    }

    if (typeof expression === 'string') {
      return `str:${expression}:${config.caseSensitive}:${config.limit}`;
    }

    if (typeof expression === 'object' && expression !== null) {
      const cached = this.expressionHashCache.get(expression);
      const configHash = `:cs:${config.caseSensitive}:md:${config.maxDepth}:lim:${config.limit}`;

      if (cached) {
        return `${cached}${configHash}`;
      }

      const hash = this.hashObject(expression, config, true);
      this.expressionHashCache.set(expression, hash);
      return `${hash}${configHash}`;
    }

    return `primitive:${String(expression)}:${config.limit}`;
  }

  private hashObject(
    obj: unknown,
    config: FilterConfig,
    skipConfigSuffix = false,
    stack = new WeakSet<object>(),
  ): string {
    const parts: string[] = [];
    const record = obj as Record<string, unknown>;
    stack.add(obj as object);

    const hashValue = (value: unknown): string => this.hashValueInner(value, stack);

    if ('$and' in record || '$or' in record || '$not' in record) {
      if ('$and' in record) {
        const andArray = Array.isArray(record.$and) ? record.$and : [record.$and];
        parts.push(`$and:[${andArray.map((v) => hashValue(v)).join(',')}]`);
      }

      if ('$or' in record) {
        const orArray = Array.isArray(record.$or) ? record.$or : [record.$or];
        parts.push(`$or:[${orArray.map((v) => hashValue(v)).join(',')}]`);
      }

      if ('$not' in record) {
        parts.push(`$not:${hashValue(record.$not)}`);
      }

      const otherKeys = Object.keys(record)
        .filter((k) => !k.startsWith('$'))
        .sort();
      for (const key of otherKeys) {
        const value = record[key];
        parts.push(`${key}:${hashValue(value)}`);
      }
    } else {
      const sortedKeys = Object.keys(record).sort();
      for (const key of sortedKeys) {
        const value = record[key];
        parts.push(`${key}:${hashValue(value)}`);
      }
    }
    stack.delete(obj as object);

    if (skipConfigSuffix) {
      return parts.join('|');
    }

    const orderByHash = config.orderBy ? this.hashOrderBy(config.orderBy) : '';
    return `${parts.join('|')}:cs:${config.caseSensitive}:md:${config.maxDepth}:lim:${config.limit}${orderByHash ? `:ob:${orderByHash}` : ''}`;
  }

  private hashValueInner(value: unknown, stack: WeakSet<object>): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (value instanceof Date) return `date:${value.getTime()}`;
    if (value instanceof RegExp) return `regex:${value.source}:${value.flags}`;

    if (typeof value === 'object') {
      if (stack.has(value as object)) return '[circular]';
      if (Array.isArray(value)) {
        stack.add(value as object);
        const arr = `arr:[${value.map((v) => this.hashValueInner(v, stack)).join(',')}]`;
        stack.delete(value as object);
        return arr;
      }
      return `obj:{${this.hashObject(value, { caseSensitive: false, maxDepth: 3, enableCache: false }, true, stack)}}`;
    }

    return `${typeof value}:${String(value)}`;
  }

  private hashOrderBy(orderBy: unknown): string {
    if (typeof orderBy === 'string') {
      return `str:${orderBy}`;
    }

    if (Array.isArray(orderBy)) {
      return `arr:[${orderBy
        .map((item) => {
          if (typeof item === 'string') {
            return `str:${item}`;
          }
          return `obj:{field:${item.field}:dir:${item.direction}}`;
        })
        .join(',')}]`;
    }

    if (typeof orderBy === 'object' && orderBy !== null) {
      const obj = orderBy as { field: string; direction: string };
      return `obj:{field:${obj.field}:dir:${obj.direction}}`;
    }

    return String(orderBy);
  }

  getCachedPredicate<T>(key: string): ((item: T) => boolean) | undefined {
    return this.predicateCache.get(key) as ((item: T) => boolean) | undefined;
  }

  setCachedPredicate<T>(key: string, predicate: (item: T) => boolean): void {
    this.predicateCache.set(key, predicate as (item: unknown) => boolean);
  }

  getCachedRegex(pattern: string, flags?: string): RegExp | undefined {
    const key = `${pattern}:${flags || ''}`;
    return this.regexCache.get(key);
  }

  setCachedRegex(pattern: string, regex: RegExp, flags?: string): void {
    const key = `${pattern}:${flags || ''}`;
    this.regexCache.set(key, regex);
  }

  clearPredicateCache(): void {
    this.predicateCache.clear();
  }

  clearRegexCache(): void {
    this.regexCache.clear();
  }

  clearAll(): void {
    this.predicateCache.clear();
    this.regexCache.clear();
    this.expressionHashCache = new WeakMap();
  }

  getStats(): CacheStats {
    return {
      predicateCacheSize: this.predicateCache.size(),
      regexCacheSize: this.regexCache.size(),
    };
  }
}

export const memoization = MemoizationManager.getInstance();

export interface CacheStats {
  predicateCacheSize: number;
  regexCacheSize: number;
}
