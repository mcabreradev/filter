import { describe, it, expect } from 'vitest';
import {
  isPrimitive,
  isPlainObject,
  getNestedValue,
  setNestedValue,
  hasNestedPath,
  isValidPath,
  getAllNestedKeys,
} from '../src/types/helpers';

describe('Type Helpers', () => {
  describe('isPrimitive', () => {
    it('should return true for primitive values', () => {
      expect(isPrimitive('string')).toBe(true);
      expect(isPrimitive(42)).toBe(true);
      expect(isPrimitive(true)).toBe(true);
      expect(isPrimitive(false)).toBe(true);
      expect(isPrimitive(null)).toBe(true);
      expect(isPrimitive(undefined)).toBe(true);
      expect(isPrimitive(Symbol('test'))).toBe(true);
      expect(isPrimitive(BigInt(123))).toBe(true);
    });

    it('should return false for non-primitive values', () => {
      expect(isPrimitive({})).toBe(false);
      expect(isPrimitive([])).toBe(false);
      expect(isPrimitive(new Date())).toBe(false);
      expect(isPrimitive(() => {})).toBe(false);
      expect(isPrimitive(new Map())).toBe(false);
      expect(isPrimitive(new Set())).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject({ nested: { value: 1 } })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(true);
    });

    it('should return false for non-plain objects', () => {
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(new Map())).toBe(false);
      expect(isPlainObject(() => {})).toBe(false);
      expect(isPlainObject('string')).toBe(false);
      expect(isPlainObject(42)).toBe(false);
    });

    it('should return false for class instances', () => {
      class CustomClass {}
      expect(isPlainObject(new CustomClass())).toBe(false);
    });
  });

  describe('getNestedValue', () => {
    const testObj = {
      name: 'John',
      age: 30,
      address: {
        city: 'Berlin',
        country: 'Germany',
        coordinates: {
          lat: 52.52,
          lng: 13.405,
        },
      },
      tags: ['developer', 'typescript'],
    };

    it('should get top-level property values', () => {
      expect(getNestedValue(testObj, 'name')).toBe('John');
      expect(getNestedValue(testObj, 'age')).toBe(30);
    });

    it('should get nested property values using dot notation', () => {
      expect(getNestedValue(testObj, 'address.city')).toBe('Berlin');
      expect(getNestedValue(testObj, 'address.country')).toBe('Germany');
      expect(getNestedValue(testObj, 'address.coordinates.lat')).toBe(52.52);
      expect(getNestedValue(testObj, 'address.coordinates.lng')).toBe(13.405);
    });

    it('should get array values', () => {
      expect(getNestedValue(testObj, 'tags')).toEqual(['developer', 'typescript']);
    });

    it('should return undefined for non-existent paths', () => {
      expect(getNestedValue(testObj, 'nonexistent')).toBeUndefined();
      expect(getNestedValue(testObj, 'address.nonexistent')).toBeUndefined();
      expect(getNestedValue(testObj, 'address.city.nonexistent')).toBeUndefined();
    });

    it('should handle empty path', () => {
      expect(getNestedValue(testObj, '')).toBe(testObj);
    });

    it('should handle null/undefined objects', () => {
      expect(getNestedValue(null, 'path')).toBeUndefined();
      expect(getNestedValue(undefined, 'path')).toBeUndefined();
    });
  });

  describe('setNestedValue', () => {
    it('should set top-level property values', () => {
      const obj = { name: 'John', age: 30 };
      setNestedValue(obj, 'name', 'Jane');
      expect(obj.name).toBe('Jane');

      setNestedValue(obj, 'age', 25);
      expect(obj.age).toBe(25);
    });

    it('should set nested property values using dot notation', () => {
      const obj = {
        address: {
          city: 'Berlin',
          coordinates: {
            lat: 52.52,
          },
        },
      };

      setNestedValue(obj, 'address.city', 'Paris');
      expect(obj.address.city).toBe('Paris');

      setNestedValue(obj, 'address.coordinates.lat', 48.8566);
      expect(obj.address.coordinates.lat).toBe(48.8566);
    });

    it("should create intermediate objects if they don't exist", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj = {} as any;
      setNestedValue(obj, 'address.city', 'Berlin');
      expect(obj.address.city).toBe('Berlin');

      setNestedValue(obj, 'user.profile.name', 'John');
      expect(obj.user.profile.name).toBe('John');
    });

    it('should handle empty path by not modifying object', () => {
      const obj = { name: 'John' };
      setNestedValue(obj, '', 'test');
      expect(obj).toEqual({ name: 'John' });
    });

    it('should handle null/undefined objects gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => setNestedValue(null as any, 'path', 'value')).not.toThrow();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => setNestedValue(undefined as any, 'path', 'value')).not.toThrow();
    });
  });

  describe('hasNestedPath', () => {
    const testObj = {
      name: 'John',
      age: 30,
      address: {
        city: 'Berlin',
        coordinates: {
          lat: 52.52,
        },
      },
    };

    it('should return true for existing top-level properties', () => {
      expect(hasNestedPath(testObj, 'name')).toBe(true);
      expect(hasNestedPath(testObj, 'age')).toBe(true);
    });

    it('should return true for existing nested properties', () => {
      expect(hasNestedPath(testObj, 'address.city')).toBe(true);
      expect(hasNestedPath(testObj, 'address.coordinates.lat')).toBe(true);
    });

    it('should return false for non-existent properties', () => {
      expect(hasNestedPath(testObj, 'nonexistent')).toBe(false);
      expect(hasNestedPath(testObj, 'address.nonexistent')).toBe(false);
      expect(hasNestedPath(testObj, 'address.city.nonexistent')).toBe(false);
    });

    it('should handle empty path', () => {
      expect(hasNestedPath(testObj, '')).toBe(true);
    });

    it('should return false for null/undefined objects', () => {
      expect(hasNestedPath(null, 'path')).toBe(false);
      expect(hasNestedPath(undefined, 'path')).toBe(false);
    });

    it('should handle properties with undefined values', () => {
      const obj = { prop: undefined };
      expect(hasNestedPath(obj, 'prop')).toBe(true);
    });
  });

  describe('isValidPath', () => {
    const testObj = {
      name: 'John',
      address: {
        city: 'Berlin',
        coordinates: {
          lat: 52.52,
        },
      },
    };

    it('should return true for valid paths', () => {
      expect(isValidPath(testObj, 'name')).toBe(true);
      expect(isValidPath(testObj, 'address')).toBe(true);
      expect(isValidPath(testObj, 'address.city')).toBe(true);
      expect(isValidPath(testObj, 'address.coordinates.lat')).toBe(true);
    });

    it('should return false for invalid paths', () => {
      expect(isValidPath(testObj, 'nonexistent')).toBe(false);
      expect(isValidPath(testObj, 'address.nonexistent')).toBe(false);
      expect(isValidPath(testObj, 'name.invalid')).toBe(false);
    });

    it('should handle empty path', () => {
      expect(isValidPath(testObj, '')).toBe(true);
    });

    it('should return false for null/undefined objects', () => {
      expect(isValidPath(null, 'path')).toBe(false);
      expect(isValidPath(undefined, 'path')).toBe(false);
    });
  });

  describe('getAllNestedKeys', () => {
    it('should return all top-level keys for flat objects', () => {
      const obj = { name: 'John', age: 30, active: true };
      const keys = getAllNestedKeys(obj);
      expect(keys).toEqual(['name', 'age', 'active']);
    });

    it('should return nested keys with dot notation', () => {
      const obj = {
        name: 'John',
        address: {
          city: 'Berlin',
          country: 'Germany',
        },
      };
      const keys = getAllNestedKeys(obj);
      expect(keys).toContain('name');
      expect(keys).toContain('address.city');
      expect(keys).toContain('address.country');
    });

    it('should handle deeply nested objects', () => {
      const obj = {
        user: {
          profile: {
            name: 'John',
            location: {
              city: 'Berlin',
            },
          },
        },
      };
      const keys = getAllNestedKeys(obj);
      expect(keys).toContain('user.profile.name');
      expect(keys).toContain('user.profile.location.city');
    });

    it('should respect maxDepth parameter', () => {
      const obj = {
        level1: {
          level2: {
            level3: {
              level4: 'deep',
            },
          },
        },
      };

      const keys1 = getAllNestedKeys(obj, '', 1);
      expect(keys1).toContain('level1');
      expect(keys1).not.toContain('level1.level2');

      const keys2 = getAllNestedKeys(obj, '', 2);
      expect(keys2).toContain('level1.level2');
      expect(keys2).not.toContain('level1.level2.level3');

      const keys3 = getAllNestedKeys(obj, '', 3);
      expect(keys3).toContain('level1.level2.level3');
      expect(keys3).not.toContain('level1.level2.level3.level4');
    });

    it('should exclude array properties', () => {
      const obj = {
        name: 'John',
        tags: ['developer', 'typescript'],
        address: {
          city: 'Berlin',
        },
      };
      const keys = getAllNestedKeys(obj);
      expect(keys).toContain('name');
      expect(keys).toContain('tags');
      expect(keys).toContain('address.city');
    });

    it('should handle objects with Date values', () => {
      const obj = {
        name: 'John',
        createdAt: new Date(),
        profile: {
          updatedAt: new Date(),
        },
      };
      const keys = getAllNestedKeys(obj);
      expect(keys).toContain('name');
      expect(keys).toContain('createdAt');
      expect(keys).toContain('profile.updatedAt');
    });

    it('should return empty array for null/undefined', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getAllNestedKeys(null as any)).toEqual([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getAllNestedKeys(undefined as any)).toEqual([]);
    });

    it('should return empty array for primitives', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getAllNestedKeys('string' as any)).toEqual([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getAllNestedKeys(42 as any)).toEqual([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getAllNestedKeys(true as any)).toEqual([]);
    });

    it('should handle empty objects', () => {
      expect(getAllNestedKeys({})).toEqual([]);
    });

    it('should handle circular references without infinite loop', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: any = { name: 'John' };
      obj.self = obj;

      const keys = getAllNestedKeys(obj);
      expect(keys).toContain('name');
      // Should not cause stack overflow
    });
  });

  describe('Integration tests', () => {
    it('should work with getNestedValue and setNestedValue together', () => {
      const obj = {
        user: {
          profile: {
            name: 'John',
          },
        },
      };

      const originalName = getNestedValue(obj, 'user.profile.name');
      expect(originalName).toBe('John');

      setNestedValue(obj, 'user.profile.name', 'Jane');
      const newName = getNestedValue(obj, 'user.profile.name');
      expect(newName).toBe('Jane');
    });

    it('should work with hasNestedPath and getNestedValue together', () => {
      const obj = {
        address: {
          city: 'Berlin',
        },
      };

      if (hasNestedPath(obj, 'address.city')) {
        const city = getNestedValue(obj, 'address.city');
        expect(city).toBe('Berlin');
      }

      if (!hasNestedPath(obj, 'address.country')) {
        setNestedValue(obj, 'address.country', 'Germany');
      }

      expect(getNestedValue(obj, 'address.country')).toBe('Germany');
    });

    it('should work with getAllNestedKeys and getNestedValue together', () => {
      const obj = {
        name: 'John',
        address: {
          city: 'Berlin',
          country: 'Germany',
        },
      };

      const keys = getAllNestedKeys(obj);
      const values = keys.map((key) => getNestedValue(obj, key));

      expect(values).toContain('John');
      expect(values).toContain('Berlin');
      expect(values).toContain('Germany');
    });

    it('should validate path before getting value', () => {
      const obj = {
        user: {
          name: 'John',
        },
      };

      const path = 'user.name';
      if (isValidPath(obj, path)) {
        const value = getNestedValue(obj, path);
        expect(value).toBe('John');
      }

      const invalidPath = 'user.age';
      if (!isValidPath(obj, invalidPath)) {
        const value = getNestedValue(obj, invalidPath);
        expect(value).toBeUndefined();
      }
    });
  });
});
