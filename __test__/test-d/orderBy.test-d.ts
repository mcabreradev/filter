import { expectType, expectAssignable, expectNotAssignable } from 'tsd';
import type {
  OrderBy,
  OrderByField,
  SortDirection,
  FilterConfig,
  FilterOptions,
} from '../../src/types';

const validSortDirection: SortDirection = 'asc';
expectAssignable<SortDirection>(validSortDirection);

const validSortDirectionDesc: SortDirection = 'desc';
expectAssignable<SortDirection>(validSortDirectionDesc);

expectNotAssignable<SortDirection>('invalid');
expectNotAssignable<SortDirection>('ASC');
expectNotAssignable<SortDirection>('DESC');

const validOrderByField: OrderByField = {
  field: 'name',
  direction: 'asc',
};
expectType<OrderByField>(validOrderByField);

const validOrderByFieldDesc: OrderByField = {
  field: 'age',
  direction: 'desc',
};
expectType<OrderByField>(validOrderByFieldDesc);

expectNotAssignable<OrderByField>({
  field: 'name',
  direction: 'invalid',
});

expectNotAssignable<OrderByField>({
  field: 123,
  direction: 'asc',
});

const validOrderByString: OrderBy = 'name';
expectAssignable<OrderBy>(validOrderByString);

const validOrderByObject: OrderBy = {
  field: 'name',
  direction: 'asc',
};
expectAssignable<OrderBy>(validOrderByObject);

const validOrderByArray: OrderBy = ['name', { field: 'age', direction: 'desc' }];
expectAssignable<OrderBy>(validOrderByArray);

const validFilterOptionsWithOrderBy: FilterOptions = {
  caseSensitive: false,
  orderBy: 'name',
};
expectAssignable<FilterOptions>(validFilterOptionsWithOrderBy);

const validFilterOptionsWithOrderByObject: FilterOptions = {
  caseSensitive: false,
  orderBy: { field: 'name', direction: 'asc' },
};
expectAssignable<FilterOptions>(validFilterOptionsWithOrderByObject);

const validFilterOptionsWithOrderByArray: FilterOptions = {
  caseSensitive: false,
  orderBy: [
    { field: 'age', direction: 'desc' },
    { field: 'name', direction: 'asc' },
  ],
};
expectAssignable<FilterOptions>(validFilterOptionsWithOrderByArray);

const partialFilterOptionsWithOrderBy: FilterOptions = {
  orderBy: 'name',
};
expectAssignable<FilterOptions>(partialFilterOptionsWithOrderBy);

const emptyFilterOptions: FilterOptions = {};
expectAssignable<FilterOptions>(emptyFilterOptions);

const validFilterConfigWithOrderBy: FilterConfig = {
  caseSensitive: false,
  maxDepth: 3,
  enableCache: false,
  orderBy: 'name',
};
expectType<FilterConfig>(validFilterConfigWithOrderBy);

const validFilterConfigWithOrderByObject: FilterConfig = {
  caseSensitive: false,
  maxDepth: 3,
  enableCache: false,
  orderBy: { field: 'name', direction: 'asc' },
};
expectType<FilterConfig>(validFilterConfigWithOrderByObject);

const validFilterConfigWithOrderByArray: FilterConfig = {
  caseSensitive: false,
  maxDepth: 3,
  enableCache: false,
  orderBy: [{ field: 'age', direction: 'desc' }, 'name'],
};
expectType<FilterConfig>(validFilterConfigWithOrderByArray);

const validFilterConfigWithoutOrderBy: FilterConfig = {
  caseSensitive: false,
  maxDepth: 3,
  enableCache: false,
};
expectType<FilterConfig>(validFilterConfigWithoutOrderBy);

const invalidDirection: 'invalid' = 'invalid';
expectNotAssignable<FilterConfig>({
  caseSensitive: false,
  maxDepth: 3,
  enableCache: false,
  orderBy: { field: 'name', direction: invalidDirection },
});
