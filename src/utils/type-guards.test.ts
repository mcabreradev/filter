import { describe, it, expect } from 'vitest';
import {
  isString,
  isObject,
  isFunction,
  isUndefined,
  isPrimitive,
  isPredicateFunction,
  getTypeForFilter,
  hasCustomToString
} from './type-guards';

describe('type-guards', () => {
  describe('isString', () => {
    it('returns true for strings', () => {
      expect(isString('test')).toBe(true);
      expect(isString('')).toBe(true);
    });

    it('returns false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
    });
  });

  describe('isObject', () => {
    it('returns true for plain objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ key: 'value' })).toBe(true);
    });

    it('returns false for arrays', () => {
      expect(isObject([])).toBe(false);
      expect(isObject([1, 2, 3])).toBe(false);
    });

    it('returns false for null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('returns false for primitives', () => {
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(true)).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('returns true for functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function () {})).toBe(true);
      expect(isFunction(Function)).toBe(true);
    });

    it('returns false for non-functions', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction('test')).toBe(false);
      expect(isFunction(123)).toBe(false);
    });
  });

  describe('isUndefined', () => {
    it('returns true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    it('returns false for defined values', () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined('')).toBe(false);
      expect(isUndefined(false)).toBe(false);
    });
  });

  describe('isPrimitive', () => {
    it('returns true for primitives', () => {
      expect(isPrimitive('string')).toBe(true);
      expect(isPrimitive(123)).toBe(true);
      expect(isPrimitive(true)).toBe(true);
      expect(isPrimitive(false)).toBe(true);
      expect(isPrimitive(null)).toBe(true);
    });

    it('returns false for objects and arrays', () => {
      expect(isPrimitive({})).toBe(false);
      expect(isPrimitive([])).toBe(false);
      expect(isPrimitive(() => {})).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isPrimitive(undefined)).toBe(false);
    });
  });

  describe('isPredicateFunction', () => {
    it('returns true for functions', () => {
      expect(isPredicateFunction(() => true)).toBe(true);
      expect(isPredicateFunction((x: number) => x > 0)).toBe(true);
    });

    it('returns false for non-functions', () => {
      expect(isPredicateFunction('test')).toBe(false);
      expect(isPredicateFunction(123)).toBe(false);
      expect(isPredicateFunction({})).toBe(false);
    });
  });

  describe('getTypeForFilter', () => {
    it('returns correct type for primitives', () => {
      expect(getTypeForFilter('test')).toBe('string');
      expect(getTypeForFilter(123)).toBe('number');
      expect(getTypeForFilter(true)).toBe('boolean');
      expect(getTypeForFilter(undefined)).toBe('undefined');
    });

    it('returns "null" for null', () => {
      expect(getTypeForFilter(null)).toBe('null');
    });

    it('returns "object" for objects and arrays', () => {
      expect(getTypeForFilter({})).toBe('object');
      expect(getTypeForFilter([])).toBe('object');
    });

    it('returns "function" for functions', () => {
      expect(getTypeForFilter(() => {})).toBe('function');
    });
  });

  describe('hasCustomToString', () => {
    it('returns true for objects with custom toString', () => {
      const obj = {
        toString: () => 'custom'
      };
      expect(hasCustomToString(obj)).toBe(true);
    });

    it('returns false for objects with default toString', () => {
      expect(hasCustomToString({})).toBe(false);
    });

    it('returns false for objects without toString', () => {
      const obj = Object.create(null);
      expect(hasCustomToString(obj)).toBe(false);
    });
  });
});

