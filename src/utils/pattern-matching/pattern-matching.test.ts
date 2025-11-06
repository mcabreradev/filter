import { describe, it, expect } from 'vitest';
import {
  hasWildcard,
  createWildcardRegex,
  getCachedRegex,
  hasNegation,
  removeNegation,
} from './pattern-matching';

describe('pattern-matching', () => {
  describe('hasWildcard', () => {
    it('detects % wildcard', () => {
      expect(hasWildcard('test%')).toBe(true);
      expect(hasWildcard('%test')).toBe(true);
      expect(hasWildcard('te%st')).toBe(true);
    });

    it('detects _ wildcard', () => {
      expect(hasWildcard('test_')).toBe(true);
      expect(hasWildcard('_test')).toBe(true);
      expect(hasWildcard('te_st')).toBe(true);
    });

    it('returns false for patterns without wildcards', () => {
      expect(hasWildcard('test')).toBe(false);
      expect(hasWildcard('simple')).toBe(false);
      expect(hasWildcard('')).toBe(false);
    });
  });

  describe('createWildcardRegex', () => {
    it('converts % to .*', () => {
      const regex = createWildcardRegex('test%', false);
      expect(regex.test('test')).toBe(true);
      expect(regex.test('testing')).toBe(true);
      expect(regex.test('testABC')).toBe(true);
    });

    it('converts _ to .', () => {
      const regex = createWildcardRegex('te_t', false);
      expect(regex.test('test')).toBe(true);
      expect(regex.test('text')).toBe(true);
      expect(regex.test('tent')).toBe(true);
      expect(regex.test('teest')).toBe(false);
    });

    it('respects case sensitivity', () => {
      const caseInsensitive = createWildcardRegex('test', false);
      expect(caseInsensitive.test('TEST')).toBe(true);
      expect(caseInsensitive.test('Test')).toBe(true);

      const caseSensitive = createWildcardRegex('test', true);
      expect(caseSensitive.test('TEST')).toBe(false);
      expect(caseSensitive.test('Test')).toBe(false);
      expect(caseSensitive.test('test')).toBe(true);
    });

    it('handles complex patterns', () => {
      const regex = createWildcardRegex('%te_t%', false);
      expect(regex.test('test')).toBe(true);
      expect(regex.test('testing')).toBe(true);
      expect(regex.test('pretext')).toBe(true);
      expect(regex.test('pretestmore')).toBe(true);
    });
  });

  describe('getCachedRegex', () => {
    it('returns a regex', () => {
      const regex = getCachedRegex('test', 'i');
      expect(regex).toBeInstanceOf(RegExp);
      expect(regex.test('test')).toBe(true);
    });

    it('caches regex instances', () => {
      const regex1 = getCachedRegex('pattern', 'i');
      const regex2 = getCachedRegex('pattern', 'i');
      expect(regex1).toBe(regex2);
    });

    it('differentiates by flags', () => {
      const regex1 = getCachedRegex('test', 'i');
      const regex2 = getCachedRegex('test', '');
      expect(regex1).not.toBe(regex2);
      expect(regex1.test('TEST')).toBe(true);
      expect(regex2.test('TEST')).toBe(false);
    });
  });

  describe('hasNegation', () => {
    it('detects negation prefix', () => {
      expect(hasNegation('!test')).toBe(true);
      expect(hasNegation('!Berlin')).toBe(true);
    });

    it('returns false for patterns without negation', () => {
      expect(hasNegation('test')).toBe(false);
      expect(hasNegation('Berlin')).toBe(false);
      expect(hasNegation('')).toBe(false);
    });
  });

  describe('removeNegation', () => {
    it('removes ! prefix', () => {
      expect(removeNegation('!test')).toBe('test');
      expect(removeNegation('!Berlin')).toBe('Berlin');
    });

    it('returns original string if no negation', () => {
      expect(removeNegation('test')).toBe('test');
      expect(removeNegation('Berlin')).toBe('Berlin');
    });
  });
});
