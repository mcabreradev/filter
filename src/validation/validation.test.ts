import { describe, it, expect } from 'vitest';
import { validateExpression, validateOptions } from './validator';

describe('validation', () => {
  describe('validateExpression', () => {
    it('validates string expressions', () => {
      expect(() => validateExpression('test')).not.toThrow();
      expect(() => validateExpression('Berlin')).not.toThrow();
      expect(() => validateExpression('%test%')).not.toThrow();
    });

    it('validates number expressions', () => {
      expect(() => validateExpression(123)).not.toThrow();
      expect(() => validateExpression(0)).not.toThrow();
      expect(() => validateExpression(-1)).not.toThrow();
    });

    it('validates boolean expressions', () => {
      expect(() => validateExpression(true)).not.toThrow();
      expect(() => validateExpression(false)).not.toThrow();
    });

    it('validates null expression', () => {
      expect(() => validateExpression(null)).not.toThrow();
    });

    it('validates function expressions', () => {
      expect(() => validateExpression(() => true)).not.toThrow();
      expect(() => validateExpression((x: number) => x > 0)).not.toThrow();
    });

    it('validates object expressions', () => {
      expect(() => validateExpression({ city: 'Berlin' })).not.toThrow();
      expect(() => validateExpression({ name: 'test', age: 25 })).not.toThrow();
    });

    it('throws for undefined', () => {
      expect(() => validateExpression(undefined)).toThrow('Invalid filter expression');
    });
  });

  describe('validateOptions', () => {
    it('validates empty options', () => {
      expect(() => validateOptions({})).not.toThrow();
    });

    it('validates undefined options', () => {
      expect(() => validateOptions(undefined)).not.toThrow();
    });

    it('validates caseSensitive option', () => {
      expect(() => validateOptions({ caseSensitive: true })).not.toThrow();
      expect(() => validateOptions({ caseSensitive: false })).not.toThrow();
    });

    it('validates maxDepth option', () => {
      expect(() => validateOptions({ maxDepth: 5 })).not.toThrow();
      expect(() => validateOptions({ maxDepth: 1 })).not.toThrow();
      expect(() => validateOptions({ maxDepth: 10 })).not.toThrow();
    });

    it('throws for invalid maxDepth below minimum', () => {
      expect(() => validateOptions({ maxDepth: 0 })).toThrow('Invalid filter options');
    });

    it('throws for invalid maxDepth above maximum', () => {
      expect(() => validateOptions({ maxDepth: 11 })).toThrow('Invalid filter options');
    });

    it('validates enableCache option', () => {
      expect(() => validateOptions({ enableCache: true })).not.toThrow();
      expect(() => validateOptions({ enableCache: false })).not.toThrow();
    });

    it('validates customComparator option', () => {
      const comparator = (a: unknown, b: unknown): boolean => a === b;
      expect(() => validateOptions({ customComparator: comparator })).not.toThrow();
    });

    it('validates complete options object', () => {
      const options = {
        caseSensitive: true,
        maxDepth: 3,
        enableCache: true,
        customComparator: (a: unknown, b: unknown): boolean => a === b,
      };
      expect(() => validateOptions(options)).not.toThrow();
    });
  });
});
