import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { resolve } from 'path';

const buildExists = existsSync(resolve(__dirname, '../build'));

describe('Package.json Exports', () => {
  describe('Operator exports should point to subdirectories', () => {
    it.skipIf(!buildExists)('should export comparison operators from subdirectory', async () => {
      // Test that the package.json export points to the correct path
      // @ts-expect-error build may not exist
      const module = await import('../build/operators/comparison/index.js');
      expect(module.applyComparisonOperators).toBeDefined();
      expect(typeof module.applyComparisonOperators).toBe('function');
    });

    it.skipIf(!buildExists)('should export array operators from subdirectory', async () => {
      // @ts-expect-error build may not exist
      const module = await import('../build/operators/array/index.js');
      expect(module.applyArrayOperators).toBeDefined();
      expect(typeof module.applyArrayOperators).toBe('function');
    });

    it.skipIf(!buildExists)('should export string operators from subdirectory', async () => {
      // @ts-expect-error build may not exist
      const module = await import('../build/operators/string/index.js');
      expect(module.applyStringOperators).toBeDefined();
      expect(typeof module.applyStringOperators).toBe('function');
    });

    it.skipIf(!buildExists)('should export logical operators from subdirectory', async () => {
      // @ts-expect-error build may not exist
      const module = await import('../build/operators/logical/index.js');
      expect(module.applyLogicalOperators).toBeDefined();
      expect(typeof module.applyLogicalOperators).toBe('function');
    });

    it.skipIf(!buildExists)('should export geospatial operators from subdirectory', async () => {
      // @ts-expect-error build may not exist
      const module = await import('../build/operators/geospatial/index.js');
      expect(module.evaluateNear).toBeDefined();
      expect(module.evaluateGeoBox).toBeDefined();
      expect(module.evaluateGeoPolygon).toBeDefined();
    });

    it.skipIf(!buildExists)('should export datetime operators from subdirectory', async () => {
      // @ts-expect-error build may not exist
      const module = await import('../build/operators/datetime/index.js');
      expect(module.evaluateRecent).toBeDefined();
      expect(module.evaluateUpcoming).toBeDefined();
      expect(module.evaluateDayOfWeek).toBeDefined();
      expect(module.evaluateTimeOfDay).toBeDefined();
      expect(module.evaluateAge).toBeDefined();
    });
  });

  describe('Main operator index should re-export all operators', () => {
    it.skipIf(!buildExists)(
      'should export all operator functions from main operators index',
      async () => {
        // @ts-expect-error build may not exist
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
      },
    );
  });

  describe('Build structure should match package.json exports', () => {
    it.skipIf(!buildExists)('should have operator files in subdirectories', async () => {
      const paths = [
        '../build/operators/comparison/index.js',
        '../build/operators/array/index.js',
        '../build/operators/string/index.js',
        '../build/operators/logical/index.js',
        '../build/operators/geospatial/index.js',
        '../build/operators/datetime/index.js',
      ];

      for (const path of paths) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const module = await import(path as any);
        expect(module).toBeDefined();
        expect(Object.keys(module).length).toBeGreaterThan(0);
      }
    });
  });
});
