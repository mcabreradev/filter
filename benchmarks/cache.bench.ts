import { bench, describe } from 'vitest';
import { genDataset } from './helpers';
import { filter } from '../src/index';

const items = genDataset(100_000);

describe('cache impact (100K items)', () => {
  bench('cold first call (unique expr, cache off)', () => {
    filter(items.slice(), { city: 'Berlin' }, { enableCache: false });
  });
  bench('warm cache, repeated expression', () => {
    filter(items, { city: 'Berlin' }, { enableCache: true });
  });
  bench('cached full-array hits', () => {
    filter(items, { age: { $gte: 50 } }, { enableCache: true });
  });
});

const small = genDataset(1_000);
const medium = genDataset(10_000);
describe('dataset-size scaling (cache off)', () => {
  bench('1K items', () => filter(small, { age: { $gte: 50 } }, { enableCache: false }));
  bench('10K items', () => filter(medium, { age: { $gte: 50 } }, { enableCache: false }));
});
