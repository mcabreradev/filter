import type { StringOperators } from '../types';
import { memoization } from '../utils/memoization';

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
    const regex = getOrCreateRegex(operators.$regex, caseSensitive);
    if (!regex.test(value)) return false;
  }

  if (operators.$match !== undefined) {
    const regex = getOrCreateRegex(operators.$match, caseSensitive);
    if (!regex.test(value)) return false;
  }

  return true;
};

function getOrCreateRegex(pattern: string | RegExp, caseSensitive: boolean): RegExp {
  if (pattern instanceof RegExp) {
    return pattern;
  }

  const flags = caseSensitive ? '' : 'i';
  const cached = memoization.getCachedRegex(pattern, flags);

  if (cached) {
    return cached;
  }

  const regex = new RegExp(pattern, flags);
  memoization.setCachedRegex(pattern, regex, flags);
  return regex;
}
