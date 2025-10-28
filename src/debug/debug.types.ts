export type DebugNodeType = 'logical' | 'comparison' | 'field' | 'operator' | 'primitive';

export interface DebugNode {
  type: DebugNodeType;
  operator?: string;
  field?: string;
  value?: unknown;
  children?: DebugNode[];
  matched?: number;
  total?: number;
  evaluationTime?: number;
}

export interface DebugStats {
  matched: number;
  total: number;
  percentage: number;
  executionTime: number;
  cacheHit: boolean;
  conditionsEvaluated: number;
}

export interface DebugResult<T> {
  items: T[];
  tree: DebugNode;
  stats: DebugStats;
  print: () => void;
}

export interface DebugOptions {
  verbose?: boolean;
  showTimings?: boolean;
  colorize?: boolean;
}
