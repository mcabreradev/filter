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

  describe('$regex operator', () => {
    it('returns true when string matches regex pattern', () => {
      expect(applyStringOperators('hello123', { $regex: '^hello\\d+$' })).toBe(true);
    });

    it('returns false when string does not match regex pattern', () => {
      expect(applyStringOperators('hello', { $regex: '^hello\\d+$' })).toBe(false);
    });

    it('handles RegExp object', () => {
      expect(applyStringOperators('test@example.com', { $regex: /^[a-z]+@[a-z]+\.[a-z]+$/ })).toBe(
        true,
      );
    });

    it('handles case sensitivity with string pattern', () => {
      expect(applyStringOperators('Hello', { $regex: '^hello$' }, false)).toBe(true);
      expect(applyStringOperators('Hello', { $regex: '^hello$' }, true)).toBe(false);
    });

    it('handles case sensitivity with RegExp object', () => {
      const caseInsensitive = /^hello$/i;
      const caseSensitive = /^hello$/;
      expect(applyStringOperators('Hello', { $regex: caseInsensitive })).toBe(true);
      expect(applyStringOperators('Hello', { $regex: caseSensitive })).toBe(false);
    });

    it('returns false for non-string values', () => {
      expect(applyStringOperators(123, { $regex: '\\d+' })).toBe(false);
      expect(applyStringOperators(null, { $regex: 'test' })).toBe(false);
      expect(applyStringOperators(undefined, { $regex: 'test' })).toBe(false);
    });

    it('handles complex email patterns', () => {
      expect(applyStringOperators('user@example.com', { $regex: '^[a-z]+@[a-z]+\\.[a-z]+$' })).toBe(
        true,
      );
      expect(applyStringOperators('invalid-email', { $regex: '^[a-z]+@[a-z]+\\.[a-z]+$' })).toBe(
        false,
      );
    });

    it('handles phone number patterns', () => {
      expect(applyStringOperators('+1-555-0123', { $regex: '^\\+1-\\d{3}-\\d{4}$' })).toBe(true);
      expect(applyStringOperators('555-0123', { $regex: '^\\+1-\\d{3}-\\d{4}$' })).toBe(false);
    });

    it('handles alphanumeric patterns', () => {
      expect(applyStringOperators('abc123', { $regex: '^[a-z]+\\d+$' })).toBe(true);
      expect(applyStringOperators('123abc', { $regex: '^[a-z]+\\d+$' })).toBe(false);
    });

    it('handles special characters in patterns', () => {
      expect(applyStringOperators('hello.world', { $regex: '\\.' })).toBe(true);
      expect(applyStringOperators('hello@world', { $regex: '@' })).toBe(true);
    });
  });

  describe('$match operator', () => {
    it('returns true when string matches pattern (alias of $regex)', () => {
      expect(applyStringOperators('hello123', { $match: '^hello\\d+$' })).toBe(true);
    });

    it('returns false when string does not match pattern', () => {
      expect(applyStringOperators('hello', { $match: '^hello\\d+$' })).toBe(false);
    });

    it('handles RegExp object', () => {
      expect(applyStringOperators('test@example.com', { $match: /^[a-z]+@[a-z]+\.[a-z]+$/ })).toBe(
        true,
      );
    });

    it('handles case sensitivity', () => {
      expect(applyStringOperators('Hello', { $match: '^hello$' }, false)).toBe(true);
      expect(applyStringOperators('Hello', { $match: '^hello$' }, true)).toBe(false);
    });

    it('returns false for non-string values', () => {
      expect(applyStringOperators(123, { $match: '\\d+' })).toBe(false);
      expect(applyStringOperators(null, { $match: 'test' })).toBe(false);
    });

    it('handles complex patterns', () => {
      expect(applyStringOperators('ABC-1234-X', { $match: '^[A-Z]{3}-\\d{4}-[A-Z]$' })).toBe(true);
      expect(applyStringOperators('ABC-123-X', { $match: '^[A-Z]{3}-\\d{4}-[A-Z]$' })).toBe(false);
    });
  });

  describe('combining regex with other string operators', () => {
    it('applies all string operators together', () => {
      expect(
        applyStringOperators('hello@example.com', {
          $startsWith: 'hello',
          $contains: '@',
          $regex: '.*\\.com$',
        }),
      ).toBe(true);
    });

    it('returns false if any operator fails', () => {
      expect(
        applyStringOperators('hello@example.org', {
          $startsWith: 'hello',
          $regex: '.*\\.com$',
        }),
      ).toBe(false);
    });

    it('combines $regex with $endsWith', () => {
      expect(
        applyStringOperators('user123@test.com', {
          $regex: '^[a-z]+\\d+@',
          $endsWith: '.com',
        }),
      ).toBe(true);
    });

    it('combines $match with other operators', () => {
      expect(
        applyStringOperators('test_user_123', {
          $startsWith: 'test',
          $match: '_\\d+$',
          $contains: 'user',
        }),
      ).toBe(true);
    });
  });
});
