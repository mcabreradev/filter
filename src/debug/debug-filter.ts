import type { Expression, FilterOptions } from '../types';
import type { DebugResult, DebugOptions, DebugNode } from './debug.types';
import { validateExpression } from '../validation';
import { mergeConfig } from '../config';
import { buildDebugTree } from './debug-tree-builder';
import { evaluateWithDebug } from './debug-evaluator';
import { formatDebugTree } from './debug-formatter';

export const filterDebug = <T>(
  array: T[],
  expression: Expression<T>,
  options?: FilterOptions,
): DebugResult<T> => {
  if (!Array.isArray(array)) {
    throw new Error(`Expected array but received: ${typeof array}`);
  }

  const startTime = performance.now();
  const config = mergeConfig(options);
  const validatedExpression = validateExpression<T>(expression);

  const tree = buildDebugTree(validatedExpression, config);
  const { items, tree: populatedTree } = evaluateWithDebug(
    array,
    tree,
    validatedExpression,
    config,
  );

  const executionTime = performance.now() - startTime;
  const conditionsEvaluated = countConditions(populatedTree);

  const result: DebugResult<T> = {
    items,
    tree: populatedTree,
    stats: {
      matched: items.length,
      total: array.length,
      percentage: array.length > 0 ? (items.length / array.length) * 100 : 0,
      executionTime,
      cacheHit: false,
      conditionsEvaluated,
    },
    print: () => {
      const debugOpts = getDebugOptions(options);
      const treeOutput = formatDebugTree(populatedTree, debugOpts);
      console.log(treeOutput);
      console.log('');
      console.log(`Statistics:`);
      console.log(
        `├── Matched: ${items.length} / ${array.length} items (${result.stats.percentage.toFixed(1)}%)`,
      );
      console.log(`├── Execution Time: ${executionTime.toFixed(2)}ms`);
      console.log(`├── Cache Hit: ${result.stats.cacheHit ? 'Yes' : 'No'}`);
      console.log(`└── Conditions Evaluated: ${conditionsEvaluated}`);
    },
  };

  return result;
};

export const getDebugOptions = (options?: FilterOptions): DebugOptions => {
  return {
    verbose: options?.verbose,
    showTimings: options?.showTimings,
    colorize: options?.colorize,
  };
};

const countConditions = (node: DebugNode): number => {
  let count = 1;
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countConditions(child);
    }
  }
  return count;
};
