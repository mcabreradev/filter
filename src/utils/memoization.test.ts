import { describe, it, expect, beforeEach } from 'vitest';
import { MemoizationManager, memoization } from './memoization';
import type { FilterConfig } from '../types';

describe('MemoizationManager', () => {
  const defaultConfig: FilterConfig = {
    caseSensitive: false,
    maxDepth: 3,
    enableCache: true,
  };

  beforeEach(() => {
    memoization.clearAll();
  });

  describe('createExpressionHash', () => {
    it('creates consistent hash for same string expression', () => {
      const expr = 'test';
      const hash1 = memoization.createExpressionHash(expr, defaultConfig);
      const hash2 = memoization.createExpressionHash(expr, defaultConfig);

      expect(hash1).toBe(hash2);
    });

    it('creates different hashes for different case sensitivity', () => {
      const expr = 'test';
      const hash1 = memoization.createExpressionHash(expr, {
        ...defaultConfig,
        caseSensitive: false,
      });
      const hash2 = memoization.createExpressionHash(expr, {
        ...defaultConfig,
        caseSensitive: true,
      });

      expect(hash1).not.toBe(hash2);
    });

    it('creates consistent hash for object expressions', () => {
      const expr = { name: 'John', age: 30 };
      const hash1 = memoization.createExpressionHash(expr, defaultConfig);
      const hash2 = memoization.createExpressionHash(expr, defaultConfig);

      expect(hash1).toBe(hash2);
    });

    it('creates same hash for objects with same properties in different order', () => {
      const expr1 = { name: 'John', age: 30 };
      const expr2 = { age: 30, name: 'John' };
      const hash1 = memoization.createExpressionHash(expr1, defaultConfig);
      const hash2 = memoization.createExpressionHash(expr2, defaultConfig);

      expect(hash1).toBe(hash2);
    });

    it('handles nested objects', () => {
      const expr = { user: { name: 'John', address: { city: 'NYC' } } };
      const hash1 = memoization.createExpressionHash(expr, defaultConfig);
      const hash2 = memoization.createExpressionHash(expr, defaultConfig);

      expect(hash1).toBe(hash2);
    });

    it('handles arrays', () => {
      const expr = { tags: ['javascript', 'typescript'] };
      const hash1 = memoization.createExpressionHash(expr, defaultConfig);
      const hash2 = memoization.createExpressionHash(expr, defaultConfig);

      expect(hash1).toBe(hash2);
    });

    it('handles Date objects', () => {
      const date = new Date('2024-01-01');
      const expr = { createdAt: date };
      const hash1 = memoization.createExpressionHash(expr, defaultConfig);
      const hash2 = memoization.createExpressionHash(expr, defaultConfig);

      expect(hash1).toBe(hash2);
    });

    it('handles RegExp objects', () => {
      const expr = { pattern: /test/i };
      const hash1 = memoization.createExpressionHash(expr, defaultConfig);
      const hash2 = memoization.createExpressionHash(expr, defaultConfig);

      expect(hash1).toBe(hash2);
    });

    it('handles function expressions', () => {
      const fn = (): boolean => true;
      const hash = memoization.createExpressionHash(fn, defaultConfig);

      expect(hash).toContain('fn:');
    });
  });

  describe('predicate caching', () => {
    it('caches and retrieves predicates', () => {
      const key = 'test-key';
      const predicate = (): boolean => true;

      memoization.setCachedPredicate(key, predicate);
      const retrieved = memoization.getCachedPredicate(key);

      expect(retrieved).toBe(predicate);
    });

    it('returns undefined for non-existent predicates', () => {
      const retrieved = memoization.getCachedPredicate('non-existent');
      expect(retrieved).toBeUndefined();
    });

    it('clears predicate cache', () => {
      const key = 'test-key';
      const predicate = (): boolean => true;

      memoization.setCachedPredicate(key, predicate);
      memoization.clearPredicateCache();

      const retrieved = memoization.getCachedPredicate(key);
      expect(retrieved).toBeUndefined();
    });
  });

  describe('regex caching', () => {
    it('caches and retrieves regex patterns', () => {
      const pattern = 'test';
      const flags = 'i';
      const regex = new RegExp(pattern, flags);

      memoization.setCachedRegex(pattern, regex, flags);
      const retrieved = memoization.getCachedRegex(pattern, flags);

      expect(retrieved).toBe(regex);
    });

    it('returns undefined for non-existent patterns', () => {
      const retrieved = memoization.getCachedRegex('non-existent');
      expect(retrieved).toBeUndefined();
    });

    it('differentiates patterns with different flags', () => {
      const pattern = 'test';
      const regex1 = new RegExp(pattern, 'i');
      const regex2 = new RegExp(pattern, 'g');

      memoization.setCachedRegex(pattern, regex1, 'i');
      memoization.setCachedRegex(pattern, regex2, 'g');

      expect(memoization.getCachedRegex(pattern, 'i')).toBe(regex1);
      expect(memoization.getCachedRegex(pattern, 'g')).toBe(regex2);
    });

    it('clears regex cache', () => {
      const pattern = 'test';
      const regex = new RegExp(pattern);

      memoization.setCachedRegex(pattern, regex);
      memoization.clearRegexCache();

      const retrieved = memoization.getCachedRegex(pattern);
      expect(retrieved).toBeUndefined();
    });
  });

  describe('clearAll', () => {
    it('clears all caches', () => {
      const predicateKey = 'pred-key';
      const predicate = (): boolean => true;
      const pattern = 'test';
      const regex = new RegExp(pattern);

      memoization.setCachedPredicate(predicateKey, predicate);
      memoization.setCachedRegex(pattern, regex);

      memoization.clearAll();

      expect(memoization.getCachedPredicate(predicateKey)).toBeUndefined();
      expect(memoization.getCachedRegex(pattern)).toBeUndefined();
    });
  });

  describe('getStats', () => {
    it('returns cache statistics', () => {
      memoization.setCachedPredicate('key1', (): boolean => true);
      memoization.setCachedPredicate('key2', (): boolean => false);
      memoization.setCachedRegex('pattern1', /test/);

      const stats = memoization.getStats();

      expect(stats.predicateCacheSize).toBe(2);
      expect(stats.regexCacheSize).toBe(1);
    });
  });

  describe('singleton pattern', () => {
    it('returns same instance', () => {
      const instance1 = MemoizationManager.getInstance();
      const instance2 = MemoizationManager.getInstance();

      expect(instance1).toBe(instance2);
    });
  });
});
