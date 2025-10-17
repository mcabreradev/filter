import { WILDCARD_PERCENT, WILDCARD_UNDERSCORE, NEGATION_PREFIX } from '../constants';

const regexCache = new Map<string, RegExp>();

export const hasWildcard = (pattern: string): boolean =>
  pattern.includes(WILDCARD_PERCENT) || pattern.includes(WILDCARD_UNDERSCORE);

export const createWildcardRegex = (pattern: string, caseSensitive: boolean): RegExp => {
  const escaped = pattern.replace(/%/g, '.*').replace(/_/g, '.');
  const flags = caseSensitive ? '' : 'i';
  return new RegExp(`^${escaped}$`, flags);
};

export const getCachedRegex = (pattern: string, flags: string): RegExp => {
  const key = `${pattern}:${flags}`;
  if (!regexCache.has(key)) {
    regexCache.set(key, new RegExp(pattern, flags));
  }
  const regex = regexCache.get(key);
  if (!regex) {
    throw new Error(`Failed to create regex for pattern: ${pattern}`);
  }
  return regex;
};

export const hasNegation = (pattern: string): boolean => pattern.startsWith(NEGATION_PREFIX);

export const removeNegation = (pattern: string): string =>
  hasNegation(pattern) ? pattern.slice(1) : pattern;
