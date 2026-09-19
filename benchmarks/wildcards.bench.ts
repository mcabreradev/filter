import { bench, describe } from 'vitest';
import { genDataset } from './helpers';
import { filter } from '../src/index';

const items = genDataset(100_000);

describe('wildcard patterns (100K items, cache off)', () => {
  bench('plain value', () => filter(items, { name: 'Alpha' }, { enableCache: false }));
  bench('prefix%', () => filter(items, { name: 'Alp%' }, { enableCache: false }));
  bench('%suffix', () => filter(items, { name: '%ha' }, { enableCache: false }));
  bench('%contai%', () => filter(items, { name: '%lp%' }, { enableCache: false }));
  bench('single char ?', () => filter(items, { name: 'A?pha' }, { enableCache: false }));
});

describe('wildcard patterns (cache on, repeated)', () => {
  bench('plain value (cached)', () => filter(items, { name: 'Alpha' }));
  bench('prefix% (cached)', () => filter(items, { name: 'Alp%' }));
  bench('%contai% (cached)', () => filter(items, { name: '%lp%' }));
});
