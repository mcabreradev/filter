import { ref, computed } from 'vue';
import { filter } from '../../core';
import type { Expression, FilterOptions } from '../../types';
import type { UseFilteredStateResult } from './vue.types';

export function useFilteredState<T>(
  initialData: T[] = [],
  initialExpression: Expression<T> = () => true,
  options?: FilterOptions,
): UseFilteredStateResult<T> {
  const data = ref(initialData) as unknown as UseFilteredStateResult<T>['data'];
  const expression = ref(initialExpression) as unknown as UseFilteredStateResult<T>['expression'];

  const filtered = computed(() => {
    if (!data.value || data.value.length === 0) {
      return [];
    }

    try {
      return filter(data.value, expression.value, options);
    } catch {
      return [];
    }
  }) as unknown as UseFilteredStateResult<T>['filtered'];

  const isFiltering = computed(() => {
    return filtered.value.length !== data.value.length;
  });

  return {
    data,
    expression,
    filtered,
    isFiltering,
  };
}
