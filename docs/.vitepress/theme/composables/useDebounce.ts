import { ref, type Ref, onUnmounted } from 'vue';

interface UseDebouncedExecuteReturn {
  debouncedExecute: () => void;
}

/**
 * Composable for debounced function execution
 */
export function useDebouncedExecute(callback: () => void, delay = 300): UseDebouncedExecuteReturn {
  const debounceTimer = ref<number | null>(null);

  const debouncedExecute = (): void => {
    if (debounceTimer.value) {
      clearTimeout(debounceTimer.value);
    }

    debounceTimer.value = window.setTimeout(() => {
      callback();
    }, delay);
  };

  onUnmounted(() => {
    if (debounceTimer.value) {
      clearTimeout(debounceTimer.value);
    }
  });

  return {
    debouncedExecute,
  };
}
