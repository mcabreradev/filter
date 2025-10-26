import type { Readable } from 'svelte/store';

export function isStore<T>(value: unknown): value is Readable<T> {
  return (
    value !== null &&
    typeof value === 'object' &&
    'subscribe' in value &&
    typeof (value as { subscribe: unknown }).subscribe === 'function'
  );
}

export function getValue<T>(value: T | Readable<T>): T {
  if (isStore(value)) {
    let currentValue: T = undefined as never;
    value.subscribe((v) => {
      currentValue = v;
    })();
    return currentValue;
  }
  return value;
}
