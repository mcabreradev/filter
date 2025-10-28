import { expectType, expectAssignable, expectNotAssignable } from 'tsd';
import type { FilterConfig, FilterOptions, Comparator } from '../../src/types';

const validConfig: FilterConfig = {
  caseSensitive: true,
  maxDepth: 5,
  enableCache: true,
};

expectType<FilterConfig>(validConfig);

const validConfigWithComparator: FilterConfig = {
  caseSensitive: false,
  maxDepth: 10,
  enableCache: false,
  customComparator: (a, b) => a === b,
};

expectType<FilterConfig>(validConfigWithComparator);

const partialOptions: FilterOptions = {
  caseSensitive: true,
};

expectAssignable<FilterOptions>(partialOptions);

const emptyOptions: FilterOptions = {};

expectAssignable<FilterOptions>(emptyOptions);

const fullOptions: FilterOptions = {
  caseSensitive: false,
  maxDepth: 3,
  customComparator: (a, b) => a === b,
  enableCache: true,
};

expectAssignable<FilterOptions>(fullOptions);

const comparator: Comparator = (actual, expected) => actual === expected;

expectType<Comparator>(comparator);

expectType<boolean>(comparator('test', 'test'));

expectNotAssignable<FilterConfig>({
  caseSensitive: true,
  maxDepth: 5,
});

expectNotAssignable<FilterConfig>({
  caseSensitive: 'true',
  maxDepth: 5,
  enableCache: true,
});
