import { describe, it, expect } from 'vitest';

describe('Package.json Exports', () => {
  describe('Operator exports should point to subdirectories', () => {
    it('should export comparison operators from subdirectory', async () => {
      // Test that the package.json export points to the correct path
      const module = await import('../build/operators/comparison/index.js');
      expect(module.applyComparisonOperators).toBeDefined();
      expect(typeof module.applyComparisonOperators).toBe('function');
    });

    it('should export array operators from subdirectory', async () => {
      const module = await import('../build/operators/array/index.js');
      expect(module.applyArrayOperators).toBeDefined();
      expect(typeof module.applyArrayOperators).toBe('function');
    });

    it('should export string operators from subdirectory', async () => {
      const module = await import('../build/operators/string/index.js');
      expect(module.applyStringOperators).toBeDefined();
      expect(typeof module.applyStringOperators).toBe('function');
    });

    it('should export logical operators from subdirectory', async () => {
      const module = await import('../build/operators/logical/index.js');
      expect(module.applyLogicalOperators).toBeDefined();
      expect(typeof module.applyLogicalOperators).toBe('function');
    });

    it('should export geospatial operators from subdirectory', async () => {
      const module = await import('../build/operators/geospatial/index.js');
      expect(module.evaluateNear).toBeDefined();
      expect(module.evaluateGeoBox).toBeDefined();
      expect(module.evaluateGeoPolygon).toBeDefined();
    });

    it('should export datetime operators from subdirectory', async () => {
      const module = await import('../build/operators/datetime/index.js');
      expect(module.evaluateRecent).toBeDefined();
      expect(module.evaluateUpcoming).toBeDefined();
      expect(module.evaluateDayOfWeek).toBeDefined();
      expect(module.evaluateTimeOfDay).toBeDefined();
      expect(module.evaluateAge).toBeDefined();
    });
  });

  describe('Main operator index should re-export all operators', () => {
    it('should export all operator functions from main operators index', async () => {
      const module = await import('../build/operators/index.js');
      
      // Comparison
      expect(module.applyComparisonOperators).toBeDefined();
      expect(module.evaluateComparison).toBeDefined();
      
      // Array
      expect(module.applyArrayOperators).toBeDefined();
      expect(module.evaluateArray).toBeDefined();
      
      // String
      expect(module.applyStringOperators).toBeDefined();
      expect(module.evaluateString).toBeDefined();
      
      // Logical
      expect(module.applyLogicalOperators).toBeDefined();
      expect(module.evaluateLogical).toBeDefined();
      
      // Geospatial
      expect(module.evaluateNear).toBeDefined();
      expect(module.evaluateGeoBox).toBeDefined();
      expect(module.evaluateGeoPolygon).toBeDefined();
      
      // Datetime
      expect(module.evaluateRecent).toBeDefined();
      expect(module.evaluateUpcoming).toBeDefined();
      expect(module.evaluateDayOfWeek).toBeDefined();
      expect(module.evaluateTimeOfDay).toBeDefined();
      expect(module.evaluateAge).toBeDefined();
    });
  });

  describe('Build structure should match package.json exports', () => {
    it('should have operator files in subdirectories', async () => {
      // These imports should work based on the new package.json exports
      const paths = [
        '../build/operators/comparison/index.js',
        '../build/operators/array/index.js',
        '../build/operators/string/index.js',
        '../build/operators/logical/index.js',
        '../build/operators/geospatial/index.js',
        '../build/operators/datetime/index.js',
      ];

      for (const path of paths) {
        const module = await import(path);
        expect(module).toBeDefined();
        expect(Object.keys(module).length).toBeGreaterThan(0);
      }
    });
  });
});
