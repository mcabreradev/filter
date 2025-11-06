import { describe, it, expect } from 'vitest';
import { applyComparisonOperators } from './comparison.operators';

describe('comparison operators', () => {
  describe('$gt operator', () => {
    it('returns true when value is greater than $gt', () => {
      expect(applyComparisonOperators(10, { $gt: 5 })).toBe(true);
    });

    it('returns false when value is equal to $gt', () => {
      expect(applyComparisonOperators(5, { $gt: 5 })).toBe(false);
    });

    it('returns false when value is less than $gt', () => {
      expect(applyComparisonOperators(3, { $gt: 5 })).toBe(false);
    });

    it('works with dates', () => {
      const date1 = new Date('2025-01-01');
      const date2 = new Date('2025-01-02');
      expect(applyComparisonOperators(date2, { $gt: date1 })).toBe(true);
      expect(applyComparisonOperators(date1, { $gt: date2 })).toBe(false);
    });
  });

  describe('$gte operator', () => {
    it('returns true when value is greater than $gte', () => {
      expect(applyComparisonOperators(10, { $gte: 5 })).toBe(true);
    });

    it('returns true when value is equal to $gte', () => {
      expect(applyComparisonOperators(5, { $gte: 5 })).toBe(true);
    });

    it('returns false when value is less than $gte', () => {
      expect(applyComparisonOperators(3, { $gte: 5 })).toBe(false);
    });

    it('works with dates', () => {
      const date = new Date('2025-01-01');
      expect(applyComparisonOperators(date, { $gte: date })).toBe(true);
    });
  });

  describe('$lt operator', () => {
    it('returns true when value is less than $lt', () => {
      expect(applyComparisonOperators(3, { $lt: 5 })).toBe(true);
    });

    it('returns false when value is equal to $lt', () => {
      expect(applyComparisonOperators(5, { $lt: 5 })).toBe(false);
    });

    it('returns false when value is greater than $lt', () => {
      expect(applyComparisonOperators(10, { $lt: 5 })).toBe(false);
    });

    it('works with dates', () => {
      const date1 = new Date('2025-01-01');
      const date2 = new Date('2025-01-02');
      expect(applyComparisonOperators(date1, { $lt: date2 })).toBe(true);
      expect(applyComparisonOperators(date2, { $lt: date1 })).toBe(false);
    });
  });

  describe('$lte operator', () => {
    it('returns true when value is less than $lte', () => {
      expect(applyComparisonOperators(3, { $lte: 5 })).toBe(true);
    });

    it('returns true when value is equal to $lte', () => {
      expect(applyComparisonOperators(5, { $lte: 5 })).toBe(true);
    });

    it('returns false when value is greater than $lte', () => {
      expect(applyComparisonOperators(10, { $lte: 5 })).toBe(false);
    });

    it('works with dates', () => {
      const date = new Date('2025-01-01');
      expect(applyComparisonOperators(date, { $lte: date })).toBe(true);
    });
  });

  describe('$eq operator', () => {
    it('returns true when values are equal', () => {
      expect(applyComparisonOperators(5, { $eq: 5 })).toBe(true);
      expect(applyComparisonOperators('test', { $eq: 'test' })).toBe(true);
    });

    it('returns false when values are not equal', () => {
      expect(applyComparisonOperators(5, { $eq: 10 })).toBe(false);
      expect(applyComparisonOperators('test', { $eq: 'other' })).toBe(false);
    });
  });

  describe('$ne operator', () => {
    it('returns true when values are not equal', () => {
      expect(applyComparisonOperators(5, { $ne: 10 })).toBe(true);
      expect(applyComparisonOperators('test', { $ne: 'other' })).toBe(true);
    });

    it('returns false when values are equal', () => {
      expect(applyComparisonOperators(5, { $ne: 5 })).toBe(false);
      expect(applyComparisonOperators('test', { $ne: 'test' })).toBe(false);
    });
  });

  describe('combined operators (range queries)', () => {
    it('handles range with $gte and $lte', () => {
      expect(applyComparisonOperators(5, { $gte: 1, $lte: 10 })).toBe(true);
      expect(applyComparisonOperators(0, { $gte: 1, $lte: 10 })).toBe(false);
      expect(applyComparisonOperators(11, { $gte: 1, $lte: 10 })).toBe(false);
    });

    it('handles range with $gt and $lt', () => {
      expect(applyComparisonOperators(5, { $gt: 1, $lt: 10 })).toBe(true);
      expect(applyComparisonOperators(1, { $gt: 1, $lt: 10 })).toBe(false);
      expect(applyComparisonOperators(10, { $gt: 1, $lt: 10 })).toBe(false);
    });

    it('handles date ranges', () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-12-31');
      const midDate = new Date('2025-06-15');

      expect(applyComparisonOperators(midDate, { $gte: start, $lte: end })).toBe(true);
      expect(applyComparisonOperators(new Date('2023-12-31'), { $gte: start, $lte: end })).toBe(
        false,
      );
    });
  });

  describe('edge cases', () => {
    it('returns false for non-numeric, non-date values with range operators', () => {
      expect(applyComparisonOperators('string', { $gt: 5 })).toBe(false);
      expect(applyComparisonOperators(null, { $gte: 10 })).toBe(false);
      expect(applyComparisonOperators(undefined, { $lt: 5 })).toBe(false);
    });

    it('handles empty operator object', () => {
      expect(applyComparisonOperators(5, {})).toBe(true);
    });

    it('handles multiple operators that all pass', () => {
      expect(applyComparisonOperators(5, { $gt: 1, $lt: 10, $ne: 3 })).toBe(true);
    });

    it('returns false if any operator fails', () => {
      expect(applyComparisonOperators(5, { $gt: 1, $lt: 10, $eq: 3 })).toBe(false);
    });
  });
});
