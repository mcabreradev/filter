import type { FilterConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

export { DEFAULT_CONFIG };

export const getDefaultConfig = (): FilterConfig => ({ ...DEFAULT_CONFIG });
