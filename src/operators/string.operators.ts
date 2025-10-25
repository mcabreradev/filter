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

  if (operators.$regex !== undefined) {
    const regex =
      typeof operators.$regex === 'string'
        ? new RegExp(operators.$regex, caseSensitive ? '' : 'i')
        : operators.$regex;
    if (!regex.test(value)) return false;
  }

  if (operators.$match !== undefined) {
    const regex =
      typeof operators.$match === 'string'
        ? new RegExp(operators.$match, caseSensitive ? '' : 'i')
        : operators.$match;
    if (!regex.test(value)) return false;
  }

  return true;
};
