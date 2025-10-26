import { computed, unref, type MaybeRef } from 'vue';
import { filter } from '../../core';
import type { Expression, FilterOptions } from '../../types';
import type { UseFilterResult } from './vue.types';

export function useFilter<T>(
  data: MaybeRef<T[]>,
  expression: MaybeRef<Expression<T>>,
  options?: MaybeRef<FilterOptions>,
): UseFilterResult<T> {
  const filtered = computed(() => {
    const dataValue = unref(data);
    const expressionValue = unref(expression);
    const optionsValue = unref(options);

    if (!dataValue || dataValue.length === 0) {
      return [];
    }

    try {
      return filter(dataValue, expressionValue, optionsValue);
    } catch {
      return [];
    }
  });

  const isFiltering = computed(() => {
    const dataValue = unref(data);
    return filtered.value.length !== dataValue.length;
  });

  return {
    filtered,
    isFiltering,
  };
}
