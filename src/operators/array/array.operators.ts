import type { ArrayOperators } from '../../types';
import { sameValue } from '../../utils';

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
