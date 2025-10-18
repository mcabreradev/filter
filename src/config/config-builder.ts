import type { FilterConfig, FilterOptions } from '../types';
import { DEFAULT_CONFIG } from '../constants';

export const mergeConfig = (options?: FilterOptions): FilterConfig => {
  return {
    ...DEFAULT_CONFIG,
    ...options,
  };
};

export const createFilterConfig = (overrides?: FilterOptions): FilterConfig => {
  return mergeConfig(overrides);
};
