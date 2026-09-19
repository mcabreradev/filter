import { bench, describe } from 'vitest';
import { genDataset } from './helpers';
import { filter } from '../src/index';

const SIZES = [100, 1_000, 10_000, 100_000] as const;
const datasets = SIZES.map((size) => ({ size, items: genDataset(size) }));

for (const { size, items } of datasets) {
  describe(`dataset size ${size}`, () => {
    bench('primitive string match', () => {
      filter(items, { city: 'Berlin' });
    });
    bench('wildcard %er%', () => {
      filter(items, { name: '%er%' });
    });
    bench('$gte numeric', () => {
      filter(items, { age: { $gte: 50 } });
    });
    bench('$in array', () => {
      filter(items, { city: { $in: ['Berlin', 'Paris', 'Rome'] } });
    });
    bench('$and logical', () => {
      filter(items, { $and: [{ active: true }, { age: { $gte: 30 } }] });
    });
  });
}
