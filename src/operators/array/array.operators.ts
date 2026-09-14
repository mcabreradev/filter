import type { ArrayOperators } from '../../types';

const sameValue = (a: unknown, b: unknown): boolean => {
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  return a === b;
};

export const applyArrayOperators = (value: unknown, operators: ArrayOperators): boolean => {
  if (operators.$in !== undefined) {
    if (!operators.$in.some((candidate) => sameValue(value, candidate))) return false;
  }

  if (operators.$nin !== undefined) {
    if (operators.$nin.some((candidate) => sameValue(value, candidate))) return false;
  }

  if (operators.$contains !== undefined) {
    if (!Array.isArray(value)) return false;
    if (!value.some((candidate) => sameValue(candidate, operators.$contains))) return false;
  }

  if (operators.$size !== undefined) {
    if (!Array.isArray(value)) return false;
    if (value.length !== operators.$size) return false;
  }

  return true;
};
