import type { Ref } from 'vue';

export function isRefObject<T>(value: unknown): value is Ref<T> {
  return value !== null && typeof value === 'object' && 'value' in value && '__v_isRef' in value;
}

export function unwrapRef<T>(value: T | Ref<T>): T {
  return isRefObject(value) ? value.value : value;
}
