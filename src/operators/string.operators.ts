import type { StringOperators } from '../types';

export const applyStringOperators = (
  value: unknown,
  operators: StringOperators,
  caseSensitive: boolean = false,
): boolean => {
  if (typeof value !== 'string') return false;

  const strValue = caseSensitive ? value : value.toLowerCase();

  if (operators.$startsWith !== undefined) {
    const compareValue = caseSensitive
      ? operators.$startsWith
      : operators.$startsWith.toLowerCase();
    if (!strValue.startsWith(compareValue)) return false;
  }

  if (operators.$endsWith !== undefined) {
    const compareValue = caseSensitive ? operators.$endsWith : operators.$endsWith.toLowerCase();
    if (!strValue.endsWith(compareValue)) return false;
  }

  if (operators.$contains !== undefined) {
    const compareValue = caseSensitive ? operators.$contains : operators.$contains.toLowerCase();
    if (!strValue.includes(compareValue)) return false;
  }

  return true;
};
