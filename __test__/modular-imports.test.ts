import { describe, it, expect } from 'vitest';

describe('Modular Imports', () => {
  describe('Framework Integrations', () => {
    it('should import React hooks from react path', async () => {
      const reactModule = await import('../src/integrations/react/index.js');

      expect(reactModule.useFilter).toBeDefined();
      expect(reactModule.useFilteredState).toBeDefined();
      expect(reactModule.useDebouncedFilter).toBeDefined();
      expect(reactModule.usePaginatedFilter).toBeDefined();
    });

    it('should import Vue composables from vue path', async () => {
      const vueModule = await import('../src/integrations/vue/index.js');

      expect(vueModule.useFilter).toBeDefined();
      expect(vueModule.useFilteredState).toBeDefined();
      expect(vueModule.useDebouncedFilter).toBeDefined();
      expect(vueModule.usePaginatedFilter).toBeDefined();
    });

    it('should import Svelte stores from svelte path', async () => {
      const svelteModule = await import('../src/integrations/svelte/index.js');

      expect(svelteModule.useFilter).toBeDefined();
      expect(svelteModule.useFilteredState).toBeDefined();
      expect(svelteModule.useDebouncedFilter).toBeDefined();
      expect(svelteModule.usePaginatedFilter).toBeDefined();
    });

    it('should import React hooks from main index', async () => {
      const mainModule = await import('../src/index.js');

      expect(mainModule.useFilter).toBeDefined();
      expect(mainModule.useFilteredState).toBeDefined();
      expect(mainModule.useDebouncedFilter).toBeDefined();
      expect(mainModule.usePaginatedFilter).toBeDefined();
    });

    it('should import framework-specific hooks from main index', async () => {
      const mainModule = await import('../src/index.js');

      expect(mainModule.useFilterReact).toBeDefined();
      expect(mainModule.useFilterVue).toBeDefined();
      expect(mainModule.useFilterSvelte).toBeDefined();
    });
  });

  describe('Operators', () => {
    it('should import comparison operators', async () => {
      const comparisonModule = await import('../src/operators/comparison.js');

      expect(comparisonModule.applyComparisonOperators).toBeDefined();
    });

    it('should import array operators', async () => {
      const arrayModule = await import('../src/operators/array.js');

      expect(arrayModule.applyArrayOperators).toBeDefined();
    });

    it('should import string operators', async () => {
      const stringModule = await import('../src/operators/string.js');

      expect(stringModule.applyStringOperators).toBeDefined();
    });

    it('should import logical operators', async () => {
      const logicalModule = await import('../src/operators/logical.js');

      expect(logicalModule.applyLogicalOperators).toBeDefined();
    });

    it('should import geospatial operators', async () => {
      const geoModule = await import('../src/operators/geospatial.js');

      expect(geoModule.evaluateNear).toBeDefined();
      expect(geoModule.evaluateGeoBox).toBeDefined();
      expect(geoModule.evaluateGeoPolygon).toBeDefined();
    });

    it('should import datetime operators', async () => {
      const datetimeModule = await import('../src/operators/datetime.js');

      expect(datetimeModule.evaluateRecent).toBeDefined();
      expect(datetimeModule.evaluateUpcoming).toBeDefined();
      expect(datetimeModule.evaluateDayOfWeek).toBeDefined();
      expect(datetimeModule.evaluateTimeOfDay).toBeDefined();
      expect(datetimeModule.evaluateAge).toBeDefined();
      expect(datetimeModule.evaluateIsWeekday).toBeDefined();
      expect(datetimeModule.evaluateIsWeekend).toBeDefined();
      expect(datetimeModule.evaluateIsBefore).toBeDefined();
      expect(datetimeModule.evaluateIsAfter).toBeDefined();
    });
  });

  describe('Core', () => {
    it('should import lazy utilities', async () => {
      const lazyModule = await import('../src/core/lazy.js');

      expect(lazyModule.filterLazy).toBeDefined();
      expect(lazyModule.filterFirst).toBeDefined();
      expect(lazyModule.filterExists).toBeDefined();
      expect(lazyModule.filterCount).toBeDefined();
      expect(lazyModule.filterLazyChunked).toBeDefined();
      expect(lazyModule.take).toBeDefined();
      expect(lazyModule.skip).toBeDefined();
      expect(lazyModule.map).toBeDefined();
      expect(lazyModule.reduce).toBeDefined();
      expect(lazyModule.toArray).toBeDefined();
      expect(lazyModule.forEach).toBeDefined();
    });
  });

  describe('Main Index Exports', () => {
    it('should export all core functions', async () => {
      const mainModule = await import('../src/index.js');

      expect(mainModule.filter).toBeDefined();
      expect(mainModule.filterLazy).toBeDefined();
      expect(mainModule.filterFirst).toBeDefined();
      expect(mainModule.filterExists).toBeDefined();
      expect(mainModule.filterCount).toBeDefined();
    });

    it('should export all operators', async () => {
      const mainModule = await import('../src/index.js');

      expect(mainModule.evaluateNear).toBeDefined();
      expect(mainModule.evaluateGeoBox).toBeDefined();
      expect(mainModule.evaluateGeoPolygon).toBeDefined();
      expect(mainModule.evaluateRecent).toBeDefined();
      expect(mainModule.evaluateUpcoming).toBeDefined();
    });

    it('should export error classes', async () => {
      const mainModule = await import('../src/index.js');

      expect(mainModule.FilterError).toBeDefined();
      expect(mainModule.InvalidExpressionError).toBeDefined();
      expect(mainModule.OperatorError).toBeDefined();
      expect(mainModule.ValidationError).toBeDefined();
      expect(mainModule.TypeMismatchError).toBeDefined();
      expect(mainModule.GeospatialError).toBeDefined();
    });

    it('should export performance monitor', async () => {
      const mainModule = await import('../src/index.js');

      expect(mainModule.PerformanceMonitor).toBeDefined();
      expect(mainModule.getPerformanceMonitor).toBeDefined();
      expect(mainModule.trackPerformance).toBeDefined();
    });
  });
});
