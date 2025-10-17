import { describe, it, expect } from 'vitest';
import { mergeConfig, createFilterConfig } from './config-builder';
import { DEFAULT_CONFIG } from '../constants';

describe('config-builder', () => {
  describe('mergeConfig', () => {
    it('returns default config when no options provided', () => {
      const config = mergeConfig();
      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it('returns default config when undefined passed', () => {
      const config = mergeConfig(undefined);
      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it('merges custom options with defaults', () => {
      const config = mergeConfig({ caseSensitive: true });
      expect(config).toEqual({
        ...DEFAULT_CONFIG,
        caseSensitive: true,
      });
    });

    it('allows overriding multiple options', () => {
      const config = mergeConfig({
        caseSensitive: true,
        maxDepth: 5,
        enableCache: true,
      });
      expect(config).toEqual({
        caseSensitive: true,
        maxDepth: 5,
        enableCache: true,
        customComparator: undefined,
      });
    });

    it('preserves default values for non-specified options', () => {
      const config = mergeConfig({ maxDepth: 2 });
      expect(config.caseSensitive).toBe(DEFAULT_CONFIG.caseSensitive);
      expect(config.enableCache).toBe(DEFAULT_CONFIG.enableCache);
      expect(config.maxDepth).toBe(2);
    });

    it('allows custom comparator', () => {
      const customComparator = (a: unknown, b: unknown): boolean => a === b;
      const config = mergeConfig({ customComparator });
      expect(config.customComparator).toBe(customComparator);
    });
  });

  describe('createFilterConfig', () => {
    it('returns default config when no options provided', () => {
      const config = createFilterConfig();
      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it('creates config with custom options', () => {
      const config = createFilterConfig({ caseSensitive: true, maxDepth: 4 });
      expect(config.caseSensitive).toBe(true);
      expect(config.maxDepth).toBe(4);
      expect(config.enableCache).toBe(DEFAULT_CONFIG.enableCache);
    });
  });
});
