import { describe, it, expect } from 'vitest';
import {
  comparisonOperatorSchema,
  arrayOperatorSchema,
  stringOperatorSchema,
  operatorExpressionSchema,
} from './schemas';

describe('operator validation', () => {
  describe('comparison operator schema', () => {
    it('validates $gt with number', () => {
      const result = comparisonOperatorSchema.safeParse({ $gt: 10 });
      expect(result.success).toBe(true);
    });

    it('validates $gt with date', () => {
      const result = comparisonOperatorSchema.safeParse({ $gt: new Date() });
      expect(result.success).toBe(true);
    });

    it('validates $gte with number', () => {
      const result = comparisonOperatorSchema.safeParse({ $gte: 5 });
      expect(result.success).toBe(true);
    });

    it('validates $lt with number', () => {
      const result = comparisonOperatorSchema.safeParse({ $lt: 100 });
      expect(result.success).toBe(true);
    });

    it('validates $lte with date', () => {
      const result = comparisonOperatorSchema.safeParse({ $lte: new Date() });
      expect(result.success).toBe(true);
    });

    it('validates $eq with any value', () => {
      expect(comparisonOperatorSchema.safeParse({ $eq: 5 }).success).toBe(true);
      expect(comparisonOperatorSchema.safeParse({ $eq: 'string' }).success).toBe(true);
      expect(comparisonOperatorSchema.safeParse({ $eq: true }).success).toBe(true);
    });

    it('validates $ne with any value', () => {
      expect(comparisonOperatorSchema.safeParse({ $ne: 5 }).success).toBe(true);
      expect(comparisonOperatorSchema.safeParse({ $ne: null }).success).toBe(true);
    });

    it('validates combined comparison operators', () => {
      const result = comparisonOperatorSchema.safeParse({
        $gte: 10,
        $lte: 100,
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid types for $gt', () => {
      const result = comparisonOperatorSchema.safeParse({ $gt: 'invalid' });
      expect(result.success).toBe(false);
    });

    it('allows empty object', () => {
      const result = comparisonOperatorSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('array operator schema', () => {
    it('validates $in with array', () => {
      const result = arrayOperatorSchema.safeParse({ $in: [1, 2, 3] });
      expect(result.success).toBe(true);
    });

    it('validates $nin with array', () => {
      const result = arrayOperatorSchema.safeParse({ $nin: ['a', 'b', 'c'] });
      expect(result.success).toBe(true);
    });

    it('validates $contains with any value', () => {
      expect(arrayOperatorSchema.safeParse({ $contains: 'test' }).success).toBe(true);
      expect(arrayOperatorSchema.safeParse({ $contains: 5 }).success).toBe(true);
    });

    it('validates $size with number', () => {
      const result = arrayOperatorSchema.safeParse({ $size: 3 });
      expect(result.success).toBe(true);
    });

    it('rejects non-array for $in', () => {
      const result = arrayOperatorSchema.safeParse({ $in: 'not-an-array' });
      expect(result.success).toBe(false);
    });

    it('rejects non-array for $nin', () => {
      const result = arrayOperatorSchema.safeParse({ $nin: 123 });
      expect(result.success).toBe(false);
    });

    it('rejects non-number for $size', () => {
      const result = arrayOperatorSchema.safeParse({ $size: '3' });
      expect(result.success).toBe(false);
    });

    it('validates combined array operators', () => {
      const result = arrayOperatorSchema.safeParse({
        $contains: 'test',
        $size: 5,
      });
      expect(result.success).toBe(true);
    });

    it('allows empty object', () => {
      const result = arrayOperatorSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('string operator schema', () => {
    it('validates $startsWith with string', () => {
      const result = stringOperatorSchema.safeParse({ $startsWith: 'test' });
      expect(result.success).toBe(true);
    });

    it('validates $endsWith with string', () => {
      const result = stringOperatorSchema.safeParse({ $endsWith: 'test' });
      expect(result.success).toBe(true);
    });

    it('validates $contains with string', () => {
      const result = stringOperatorSchema.safeParse({ $contains: 'test' });
      expect(result.success).toBe(true);
    });

    it('rejects non-string for $startsWith', () => {
      const result = stringOperatorSchema.safeParse({ $startsWith: 123 });
      expect(result.success).toBe(false);
    });

    it('rejects non-string for $endsWith', () => {
      const result = stringOperatorSchema.safeParse({ $endsWith: true });
      expect(result.success).toBe(false);
    });

    it('rejects non-string for $contains', () => {
      const result = stringOperatorSchema.safeParse({ $contains: null });
      expect(result.success).toBe(false);
    });

    it('validates combined string operators', () => {
      const result = stringOperatorSchema.safeParse({
        $startsWith: 'hello',
        $endsWith: 'world',
      });
      expect(result.success).toBe(true);
    });

    it('allows empty string values', () => {
      const result = stringOperatorSchema.safeParse({
        $startsWith: '',
        $contains: '',
      });
      expect(result.success).toBe(true);
    });

    it('allows empty object', () => {
      const result = stringOperatorSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('operator expression schema (combined)', () => {
    it('validates comparison operators only', () => {
      const result = operatorExpressionSchema.safeParse({
        $gte: 10,
        $lte: 100,
      });
      expect(result.success).toBe(true);
    });

    it('validates array operators only', () => {
      const result = operatorExpressionSchema.safeParse({
        $in: [1, 2, 3],
        $size: 3,
      });
      expect(result.success).toBe(true);
    });

    it('validates string operators only', () => {
      const result = operatorExpressionSchema.safeParse({
        $startsWith: 'hello',
        $endsWith: 'world',
      });
      expect(result.success).toBe(true);
    });

    it('validates mixed operator types', () => {
      const result = operatorExpressionSchema.safeParse({
        $gte: 10,
        $in: [1, 2, 3],
        $startsWith: 'test',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid operator combinations', () => {
      const result = operatorExpressionSchema.safeParse({
        $gt: 'not-a-number',
        $in: 'not-an-array',
      });
      expect(result.success).toBe(false);
    });

    it('rejects unknown operators', () => {
      const result = operatorExpressionSchema.safeParse({
        $unknown: 'value',
      });
      expect(result.success).toBe(false);
    });

    it('allows empty object', () => {
      const result = operatorExpressionSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('real-world operator validation scenarios', () => {
    it('validates price range query', () => {
      const result = operatorExpressionSchema.safeParse({
        $gte: 100,
        $lte: 500,
      });
      expect(result.success).toBe(true);
    });

    it('validates category filter with $in', () => {
      const result = operatorExpressionSchema.safeParse({
        $in: ['Electronics', 'Furniture', 'Books'],
      });
      expect(result.success).toBe(true);
    });

    it('validates name search with string operators', () => {
      const result = operatorExpressionSchema.safeParse({
        $startsWith: 'Pro',
        $contains: 'laptop',
      });
      expect(result.success).toBe(true);
    });

    it('validates date range with comparison operators', () => {
      const result = operatorExpressionSchema.safeParse({
        $gte: new Date('2025-01-01'),
        $lte: new Date('2025-12-31'),
      });
      expect(result.success).toBe(true);
    });

    it('validates complex multi-type operator query', () => {
      const result = operatorExpressionSchema.safeParse({
        $gte: 100,
        $lt: 1000,
        $ne: 500,
        $nin: [250, 750],
      });
      expect(result.success).toBe(true);
    });
  });
});
