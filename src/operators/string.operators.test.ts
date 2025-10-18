import { describe, it, expect } from 'vitest';
import { applyStringOperators } from './string.operators';

describe('string operators', () => {
  describe('$startsWith operator', () => {
    it('returns true when string starts with value', () => {
      expect(applyStringOperators('hello world', { $startsWith: 'hello' })).toBe(true);
    });

    it('returns false when string does not start with value', () => {
      expect(applyStringOperators('hello world', { $startsWith: 'world' })).toBe(false);
    });

    it('handles case sensitivity', () => {
      expect(applyStringOperators('Hello World', { $startsWith: 'hello' }, false)).toBe(true);
      expect(applyStringOperators('Hello World', { $startsWith: 'hello' }, true)).toBe(false);
    });

    it('returns false for non-string values', () => {
      expect(applyStringOperators(123, { $startsWith: '12' })).toBe(false);
      expect(applyStringOperators(null, { $startsWith: 'test' })).toBe(false);
    });

    it('handles empty string', () => {
      expect(applyStringOperators('', { $startsWith: '' })).toBe(true);
      expect(applyStringOperators('test', { $startsWith: '' })).toBe(true);
    });
  });

  describe('$endsWith operator', () => {
    it('returns true when string ends with value', () => {
      expect(applyStringOperators('hello world', { $endsWith: 'world' })).toBe(true);
    });

    it('returns false when string does not end with value', () => {
      expect(applyStringOperators('hello world', { $endsWith: 'hello' })).toBe(false);
    });

    it('handles case sensitivity', () => {
      expect(applyStringOperators('Hello World', { $endsWith: 'world' }, false)).toBe(true);
      expect(applyStringOperators('Hello World', { $endsWith: 'world' }, true)).toBe(false);
    });

    it('returns false for non-string values', () => {
      expect(applyStringOperators(123, { $endsWith: '23' })).toBe(false);
      expect(applyStringOperators(null, { $endsWith: 'test' })).toBe(false);
    });

    it('handles empty string', () => {
      expect(applyStringOperators('', { $endsWith: '' })).toBe(true);
      expect(applyStringOperators('test', { $endsWith: '' })).toBe(true);
    });
  });

  describe('$contains operator', () => {
    it('returns true when string contains value', () => {
      expect(applyStringOperators('hello world', { $contains: 'lo wo' })).toBe(true);
    });

    it('returns false when string does not contain value', () => {
      expect(applyStringOperators('hello world', { $contains: 'xyz' })).toBe(false);
    });

    it('handles case sensitivity', () => {
      expect(applyStringOperators('Hello World', { $contains: 'hello' }, false)).toBe(true);
      expect(applyStringOperators('Hello World', { $contains: 'hello' }, true)).toBe(false);
    });

    it('returns false for non-string values', () => {
      expect(applyStringOperators(123, { $contains: '2' })).toBe(false);
      expect(applyStringOperators(null, { $contains: 'test' })).toBe(false);
    });

    it('handles empty string', () => {
      expect(applyStringOperators('test', { $contains: '' })).toBe(true);
      expect(applyStringOperators('', { $contains: '' })).toBe(true);
    });
  });

  describe('combined operators', () => {
    it('handles $startsWith and $endsWith together', () => {
      expect(
        applyStringOperators('hello world', { $startsWith: 'hello', $endsWith: 'world' }),
      ).toBe(true);
      expect(
        applyStringOperators('hello world', { $startsWith: 'world', $endsWith: 'hello' }),
      ).toBe(false);
    });

    it('handles all three operators together', () => {
      expect(
        applyStringOperators(
          'hello beautiful world',
          { $startsWith: 'hello', $contains: 'beautiful', $endsWith: 'world' },
          false,
        ),
      ).toBe(true);

      expect(
        applyStringOperators(
          'hello world',
          { $startsWith: 'hello', $contains: 'beautiful', $endsWith: 'world' },
          false,
        ),
      ).toBe(false);
    });

    it('respects case sensitivity for all operators', () => {
      const text = 'Hello Beautiful World';

      expect(
        applyStringOperators(
          text,
          { $startsWith: 'hello', $contains: 'beautiful', $endsWith: 'world' },
          false,
        ),
      ).toBe(true);

      expect(
        applyStringOperators(
          text,
          { $startsWith: 'hello', $contains: 'beautiful', $endsWith: 'world' },
          true,
        ),
      ).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles empty operator object', () => {
      expect(applyStringOperators('test', {})).toBe(true);
    });

    it('returns false if any operator fails', () => {
      expect(applyStringOperators('hello world', { $startsWith: 'hello', $endsWith: 'xyz' })).toBe(
        false,
      );
    });

    it('handles special characters', () => {
      expect(applyStringOperators('hello@world.com', { $contains: '@' })).toBe(true);
      expect(applyStringOperators('$100.00', { $startsWith: '$' })).toBe(true);
    });

    it('handles unicode characters', () => {
      expect(applyStringOperators('café', { $endsWith: 'fé' })).toBe(true);
      expect(applyStringOperators('🎉 party', { $startsWith: '🎉' })).toBe(true);
    });
  });
});
