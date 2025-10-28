export const TREE_SYMBOLS = {
  BRANCH: '├──',
  LAST_BRANCH: '└──',
  VERTICAL: '│',
  SPACE: '   ',
  HORIZONTAL: '───',
} as const;

export const OPERATOR_LABELS: Record<string, string> = {
  $gt: '>',
  $gte: '>=',
  $lt: '<',
  $lte: '<=',
  $eq: '=',
  $ne: '!=',
  $in: 'IN',
  $nin: 'NOT IN',
  $contains: 'CONTAINS',
  $size: 'SIZE',
  $startsWith: 'STARTS WITH',
  $endsWith: 'ENDS WITH',
  $regex: 'REGEX',
  $match: 'MATCH',
  $and: 'AND',
  $or: 'OR',
  $not: 'NOT',
};

export const ANSI_COLORS = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
  GRAY: '\x1b[90m',
} as const;
