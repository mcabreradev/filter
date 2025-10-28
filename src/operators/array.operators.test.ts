import { describe, it, expect } from 'vitest';
import { applyArrayOperators } from './array.operators';

describe('array operators', () => {
  describe('$in operator', () => {
    it('returns true when value is in array', () => {
      expect(applyArrayOperators(5, { $in: [1, 2, 5, 10] })).toBe(true);
    });

    it('returns false when value is not in array', () => {
      expect(applyArrayOperators(7, { $in: [1, 2, 5, 10] })).toBe(false);
    });

    it('works with strings', () => {
      expect(applyArrayOperators('apple', { $in: ['apple', 'banana', 'orange'] })).toBe(true);
      expect(applyArrayOperators('grape', { $in: ['apple', 'banana', 'orange'] })).toBe(false);
    });

    it('works with mixed types', () => {
      expect(applyArrayOperators(5, { $in: [1, 'test', 5, true] })).toBe(true);
      expect(applyArrayOperators(true, { $in: [1, 'test', 5, true] })).toBe(true);
    });

    it('handles empty array', () => {
      expect(applyArrayOperators(5, { $in: [] })).toBe(false);
    });
  });

  describe('$nin operator', () => {
    it('returns true when value is not in array', () => {
      expect(applyArrayOperators(7, { $nin: [1, 2, 5, 10] })).toBe(true);
    });

    it('returns false when value is in array', () => {
      expect(applyArrayOperators(5, { $nin: [1, 2, 5, 10] })).toBe(false);
    });

    it('works with strings', () => {
      expect(applyArrayOperators('grape', { $nin: ['apple', 'banana', 'orange'] })).toBe(true);
      expect(applyArrayOperators('apple', { $nin: ['apple', 'banana', 'orange'] })).toBe(false);
    });

    it('handles empty array', () => {
      expect(applyArrayOperators(5, { $nin: [] })).toBe(true);
    });
  });

  describe('$contains operator', () => {
    it('returns true when array contains value', () => {
      expect(applyArrayOperators([1, 2, 3, 4], { $contains: 3 })).toBe(true);
    });

    it('returns false when array does not contain value', () => {
      expect(applyArrayOperators([1, 2, 3, 4], { $contains: 5 })).toBe(false);
    });

    it('works with strings', () => {
      expect(applyArrayOperators(['apple', 'banana'], { $contains: 'apple' })).toBe(true);
      expect(applyArrayOperators(['apple', 'banana'], { $contains: 'orange' })).toBe(false);
    });

    it('returns false for non-array values', () => {
      expect(applyArrayOperators('string', { $contains: 's' })).toBe(false);
      expect(applyArrayOperators(5, { $contains: 5 })).toBe(false);
    });

    it('handles empty array', () => {
      expect(applyArrayOperators([], { $contains: 1 })).toBe(false);
    });
  });

  describe('$size operator', () => {
    it('returns true when array size matches', () => {
      expect(applyArrayOperators([1, 2, 3], { $size: 3 })).toBe(true);
    });

    it('returns false when array size does not match', () => {
      expect(applyArrayOperators([1, 2, 3], { $size: 5 })).toBe(false);
    });

    it('handles empty array', () => {
      expect(applyArrayOperators([], { $size: 0 })).toBe(true);
    });

    it('returns false for non-array values', () => {
      expect(applyArrayOperators('string', { $size: 6 })).toBe(false);
      expect(applyArrayOperators(5, { $size: 1 })).toBe(false);
    });
  });

  describe('combined operators', () => {
    it('handles $contains and $size together', () => {
      expect(applyArrayOperators([1, 2, 3], { $contains: 2, $size: 3 })).toBe(true);
      expect(applyArrayOperators([1, 2, 3], { $contains: 4, $size: 3 })).toBe(false);
    });

    it('handles $nin and $contains', () => {
      expect(applyArrayOperators([1, 2, 3], { $nin: [[1, 2]], $contains: 2 })).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles null values', () => {
      expect(applyArrayOperators(null, { $in: [null, 1, 2] })).toBe(true);
      expect(applyArrayOperators(null, { $nin: [1, 2] })).toBe(true);
    });

    it('handles undefined values', () => {
      expect(applyArrayOperators(undefined, { $in: [undefined, 1, 2] })).toBe(true);
      expect(applyArrayOperators(undefined, { $nin: [1, 2] })).toBe(true);
    });

    it('handles empty operator object', () => {
      expect(applyArrayOperators([1, 2, 3], {})).toBe(true);
    });

    it('returns false if any operator fails', () => {
      expect(applyArrayOperators([1, 2, 3], { $contains: 2, $size: 5 })).toBe(false);
    });
  });
});
