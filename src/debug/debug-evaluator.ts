import type { Expression, FilterConfig } from '../types';
import type { DebugNode } from './debug.types';
import { createPredicateFn } from '../predicate';

export const evaluateWithDebug = <T>(
  array: T[],
  tree: DebugNode,
  expression: Expression<T>,
  config: FilterConfig,
): { items: T[]; tree: DebugNode } => {
  const predicate = createPredicateFn<T>(expression, config);
  const decoratedPredicate = createDecoratedPredicate(predicate, tree);

  const startTime = performance.now();
  const items = array.filter(decoratedPredicate);
  tree.evaluationTime = performance.now() - startTime;

  return { items, tree };
};

const createDecoratedPredicate = <T>(
  predicate: (item: T) => boolean,
  node: DebugNode,
): ((item: T) => boolean) => {
  return (item: T): boolean => {
    const result = predicate(item);

    node.total = (node.total || 0) + 1;
    if (result) {
      node.matched = (node.matched || 0) + 1;
    }

    if (node.children) {
      updateChildrenStats(node.children, item, result);
    }

    return result;
  };
};

const updateChildrenStats = <T>(children: DebugNode[], item: T, parentResult: boolean): void => {
  for (const child of children) {
    child.total = (child.total || 0) + 1;

    if (parentResult) {
      child.matched = (child.matched || 0) + 1;
    }

    if (child.children) {
      updateChildrenStats(child.children, item, parentResult);
    }
  }
};
