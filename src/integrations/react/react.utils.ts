import type { Expression } from '../../types';

export function createStableKey<T>(expression: Expression<T>): string {
  if (typeof expression === 'function') {
    return expression.toString();
  }
  return JSON.stringify(expression);
}

export function areExpressionsEqual<T>(a: Expression<T>, b: Expression<T>): boolean {
  if (typeof a === 'function' && typeof b === 'function') {
    return a.toString() === b.toString();
  }
  return JSON.stringify(a) === JSON.stringify(b);
}
