import { bench, describe } from 'vitest';
import { genDataset } from './helpers';
import { filter, filterLazy, filterCount } from '../src/index';

const items = genDataset(100_000);
const expression = { age: { $gte: 35 } } as const;

describe('operator vs predicate (100K items)', () => {
  bench('operator $gte', () => filter(items.slice(), expression, { enableCache: false }));
  bench('function predicate', () =>
    filter(items.slice(), (it) => it.age >= 35, { enableCache: false }),
  );
});

describe('filter vs filterLazy (100K items)', () => {
  bench('filter (eager, all results)', () => filter(items, expression, { enableCache: false }));
  bench('filterLazy (all results)', () => Array.from(filterLazy(items, expression)));
});

describe('early exit', () => {
  bench('filterLazy first 1000', () => {
    const out: unknown[] = [];
    for (const it of filterLazy(items, expression)) {
      out.push(it);
      if (out.length >= 1000) break;
    }
    return out;
  });
  bench('filterCount (full scan)', () => filterCount(items, expression, { enableCache: false }));
});
