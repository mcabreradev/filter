export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  delay: number,
  options: DebounceOptions = {},
): T & { cancel: () => void } {
  const { leading = false, trailing = true } = options;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime = 0;

  const debounced = function (this: unknown, ...args: never[]): void {
    const now = Date.now();
    const isLeading = leading && now - lastCallTime > delay;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (isLeading) {
      lastCallTime = now;
      func.apply(this, args);
    }

    if (trailing) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        func.apply(this, args);
        timeoutId = null;
      }, delay);
    }
  } as T & { cancel: () => void };

  debounced.cancel = (): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}
