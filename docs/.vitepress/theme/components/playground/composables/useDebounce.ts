import { ref, type Ref, onUnmounted, getCurrentInstance } from 'vue';

interface UseDebouncedExecuteReturn {
  debouncedExecute: () => void;
  cleanup: () => void;
}

/**
 * Composable for debounced function execution
 */
export function useDebouncedExecute(
  callback: () => void | Promise<void>,
  delay = 300,
): UseDebouncedExecuteReturn {
  const debounceTimer = ref<number | null>(null);

  const debouncedExecute = (): void => {
    if (debounceTimer.value) {
      clearTimeout(debounceTimer.value);
    }

    debounceTimer.value = setTimeout(async () => {
      try {
        await callback();
      } catch (error) {
        console.error('Error in debounced callback:', error);
      }
    }, delay) as unknown as number;
  };

  const cleanup = (): void => {
    if (debounceTimer.value) {
      clearTimeout(debounceTimer.value);
      debounceTimer.value = null;
    }
  };

  // Only register onUnmounted if we're in a Vue component context
  if (getCurrentInstance()) {
    onUnmounted(cleanup);
  }

  return {
    debouncedExecute,
    cleanup,
  };
}
