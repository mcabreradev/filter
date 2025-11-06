import { useMemo } from 'react';
import { filter as filterFn } from '../../core';
import type { Expression, FilterOptions } from '../../types';

export const useFilterCore = <T>(d: T[], e: Expression<T>, o?: FilterOptions) =>
  useMemo(() => {
    if (!d?.length) return [];
    try {
      return filterFn(d, e, o);
    } catch {
      return [];
    }
  }, [d, e, o]);

export const useIsFiltering = <T>(f: T[], d: T[]) =>
  useMemo(() => f.length !== d.length, [f.length, d.length]);
