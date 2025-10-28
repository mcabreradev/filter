import type { DebugNode, DebugOptions } from './debug.types';
import { TREE_SYMBOLS, OPERATOR_LABELS, ANSI_COLORS } from './debug.constants';

export const formatDebugTree = (node: DebugNode, options: DebugOptions): string => {
  const lines: string[] = [];
  const colorize = options.colorize ?? false;
  const showTimings = options.showTimings ?? false;
  const verbose = options.verbose ?? false;

  const header = colorize
    ? `${ANSI_COLORS.BRIGHT}${ANSI_COLORS.CYAN}Filter Debug Tree${ANSI_COLORS.RESET}`
    : 'Filter Debug Tree';

  lines.push(header);

  formatNode(node, '', true, lines, { colorize, showTimings, verbose });

  return lines.join('\n');
};

const formatNode = (
  node: DebugNode,
  prefix: string,
  isLast: boolean,
  lines: string[],
  options: { colorize: boolean; showTimings: boolean; verbose: boolean },
): void => {
  const connector = isLast ? TREE_SYMBOLS.LAST_BRANCH : TREE_SYMBOLS.BRANCH;
  const nodeLabel = formatNodeLabel(node, options);
  const stats = formatMatchStats(node, options);
  const timing =
    options.showTimings && node.evaluationTime !== undefined
      ? ` ${formatTiming(node.evaluationTime, options.colorize)}`
      : '';

  lines.push(`${prefix}${connector} ${nodeLabel}${stats}${timing}`);

  if (options.verbose && node.value !== undefined && node.type !== 'primitive') {
    const valuePrefix = prefix + (isLast ? TREE_SYMBOLS.SPACE : TREE_SYMBOLS.VERTICAL + '  ');
    lines.push(`${valuePrefix}${TREE_SYMBOLS.VERTICAL} Value: ${formatValue(node.value)}`);
  }

  if (node.children && node.children.length > 0) {
    const childPrefix = prefix + (isLast ? TREE_SYMBOLS.SPACE : TREE_SYMBOLS.VERTICAL + '  ');
    const children = node.children;
    children.forEach((child, index) => {
      const isLastChild = index === children.length - 1;
      formatNode(child, childPrefix, isLastChild, lines, options);
    });
  }
};

const formatNodeLabel = (node: DebugNode, options: { colorize: boolean }): string => {
  const { colorize } = options;

  if (node.type === 'logical') {
    const label = formatOperatorLabel(node.operator || '');
    return colorize
      ? `${ANSI_COLORS.YELLOW}${ANSI_COLORS.BRIGHT}${label}${ANSI_COLORS.RESET}`
      : label;
  }

  if (node.type === 'operator') {
    const opLabel = formatOperatorLabel(node.operator || '');
    const field = node.field || '';
    const value = formatValue(node.value);
    const label = `${field} ${opLabel} ${value}`;
    return colorize
      ? `${ANSI_COLORS.CYAN}${field}${ANSI_COLORS.RESET} ${ANSI_COLORS.MAGENTA}${opLabel}${ANSI_COLORS.RESET} ${ANSI_COLORS.GREEN}${value}${ANSI_COLORS.RESET}`
      : label;
  }

  if (node.type === 'field') {
    if (node.operator === 'OR') {
      const field = node.field || '';
      return colorize
        ? `${ANSI_COLORS.CYAN}${field}${ANSI_COLORS.RESET} ${ANSI_COLORS.YELLOW}OR${ANSI_COLORS.RESET}`
        : `${field} OR`;
    }

    if (node.value !== undefined) {
      const field = node.field || '';
      const value = formatValue(node.value);
      return colorize
        ? `${ANSI_COLORS.CYAN}${field}${ANSI_COLORS.RESET} ${ANSI_COLORS.MAGENTA}=${ANSI_COLORS.RESET} ${ANSI_COLORS.GREEN}${value}${ANSI_COLORS.RESET}`
        : `${field} = ${value}`;
    }

    return colorize
      ? `${ANSI_COLORS.CYAN}${node.field || ''}${ANSI_COLORS.RESET}`
      : node.field || '';
  }

  if (node.type === 'primitive') {
    if (node.operator === 'function') {
      return colorize ? `${ANSI_COLORS.BLUE}${node.value}${ANSI_COLORS.RESET}` : String(node.value);
    }
    return formatValue(node.value);
  }

  return '';
};

export const formatOperatorLabel = (operator: string): string => {
  return OPERATOR_LABELS[operator] || operator;
};

export const formatValue = (value: unknown): string => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return `[${value.map(formatValue).join(', ')}]`;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

export const formatMatchStats = (node: DebugNode, options: { colorize: boolean }): string => {
  if (node.matched === undefined || node.total === undefined) {
    return '';
  }

  const percentage = node.total > 0 ? ((node.matched / node.total) * 100).toFixed(1) : '0.0';
  const stats = ` (${node.matched}/${node.total} matched, ${percentage}%)`;

  if (options.colorize) {
    return `${ANSI_COLORS.GRAY}${stats}${ANSI_COLORS.RESET}`;
  }

  return stats;
};

const formatTiming = (time: number, colorize: boolean): string => {
  const formatted = `${time.toFixed(2)}ms`;
  return colorize ? `${ANSI_COLORS.DIM}[${formatted}]${ANSI_COLORS.RESET}` : `[${formatted}]`;
};
