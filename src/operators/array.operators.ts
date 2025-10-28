import type { ArrayOperators } from '../types';

export const applyArrayOperators = (value: unknown, operators: ArrayOperators): boolean => {
  if (operators.$in !== undefined) {
    if (!operators.$in.includes(value)) return false;
  }

  if (operators.$nin !== undefined) {
    if (operators.$nin.includes(value)) return false;
  }

  if (operators.$contains !== undefined) {
    if (!Array.isArray(value)) return false;
    if (!value.includes(operators.$contains)) return false;
  }

  if (operators.$size !== undefined) {
    if (!Array.isArray(value)) return false;
    if (value.length !== operators.$size) return false;
  }

  return true;
};
