import {
  ref,
  computed,
  watch,
  unref,
  onUnmounted,
  getCurrentInstance,
  onScopeDispose,
  type MaybeRef,
} from 'vue';
import { filter } from '../../core';
import type { Expression } from '../../types';
import type { UseDebouncedFilterOptions, UseDebouncedFilterResult } from './vue.types';
import { DEFAULT_DEBOUNCE_DELAY } from './vue.constants';
import { debounce } from '../shared';

export function useDebouncedFilter<T>(
  data: MaybeRef<T[]>,
  expression: MaybeRef<Expression<T>>,
  options?: UseDebouncedFilterOptions,
): UseDebouncedFilterResult<T> {
  const { delay = DEFAULT_DEBOUNCE_DELAY, ...filterOptions } = options || {};
  const debouncedExpression = ref<Expression<T>>(unref(expression));
  const isPending = ref(false);

  const debouncedUpdate = debounce((expr: Expression<T>) => {
    debouncedExpression.value = expr;
    isPending.value = false;
  }, delay) as ((expr: Expression<T>) => void) & { cancel: () => void };

  watch(
    () => unref(expression),
    (newExpression) => {
      isPending.value = true;
      debouncedUpdate(newExpression);
    },
    { immediate: false },
  );

  // Use onScopeDispose which works in both component and effectScope contexts
  // This avoids Vue warnings when used outside a component instance
  if (getCurrentInstance()) {
    onUnmounted(() => {
      debouncedUpdate.cancel();
    });
  } else {
    onScopeDispose(() => {
      debouncedUpdate.cancel();
    });
  }

  const filtered = computed(() => {
    const dataValue = unref(data);

    if (!dataValue || dataValue.length === 0) {
      return [];
    }

    try {
      return filter(dataValue, debouncedExpression.value, filterOptions);
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
    isPending,
  };
}
