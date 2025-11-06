/**
 * Performance metrics for operations
 */
export interface PerformanceMetrics {
  /** Total number of operations tracked */
  count: number;
  /** Average duration in milliseconds */
  avg: number;
  /** Minimum duration in milliseconds */
  min: number;
  /** Maximum duration in milliseconds */
  max: number;
  /** 95th percentile duration in milliseconds */
  p95: number;
  /** 99th percentile duration in milliseconds */
  p99: number;
  /** Total duration in milliseconds */
  total: number;
}

/**
 * Performance monitor options
 */
export interface PerformanceMonitorOptions {
  /** Enable performance monitoring */
  enabled?: boolean;
  /** Maximum number of samples to keep per operation */
  maxSamples?: number;
  /** Enable detailed logging */
  verbose?: boolean;
  /** Callback when metrics are recorded */
  onMetric?: (operation: string, duration: number) => void;
}

/**
 * Performance monitor for tracking filter operations
 */
export class PerformanceMonitor {
  private metrics = new Map<string, number[]>();
  private readonly maxSamples: number;
  private readonly verbose: boolean;
  private readonly onMetric?: (operation: string, duration: number) => void;
  private enabled: boolean;

  constructor(options: PerformanceMonitorOptions = {}) {
    this.enabled = options.enabled ?? true;
    this.maxSamples = options.maxSamples ?? 1000;
    this.verbose = options.verbose ?? false;
    this.onMetric = options.onMetric;
  }

  /**
   * Start tracking an operation
   */
  start(operation: string): () => void {
    if (!this.enabled) {
      return () => {};
    }

    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      this.track(operation, duration);
    };
  }

  /**
   * Track an operation duration
   */
  track(operation: string, duration: number): void {
    if (!this.enabled) return;

    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }

    const samples = this.metrics.get(operation);
    if (!samples) return;

    samples.push(duration);

    // Limit samples to prevent memory issues
    if (samples.length > this.maxSamples) {
      samples.shift();
    }

    if (this.verbose) {
      console.log(`[PerformanceMonitor] ${operation}: ${duration.toFixed(2)}ms`);
    }

    if (this.onMetric) {
      this.onMetric(operation, duration);
    }
  }

  /**
   * Get metrics for a specific operation
   */
  getMetrics(operation: string): PerformanceMetrics | undefined {
    const samples = this.metrics.get(operation);
    if (!samples || samples.length === 0) {
      return undefined;
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const total = samples.reduce((sum, val) => sum + val, 0);

    return {
      count: samples.length,
      avg: total / samples.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      total,
    };
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Map<string, PerformanceMetrics> {
    const result = new Map<string, PerformanceMetrics>();

    for (const [operation, samples] of this.metrics.entries()) {
      if (samples.length > 0) {
        const metrics = this.getMetrics(operation);
        if (metrics) {
          result.set(operation, metrics);
        }
      }
    }

    return result;
  }

  /**
   * Get summary of all operations
   */
  getSummary(): {
    operations: number;
    totalTracked: number;
    slowest: { operation: string; duration: number } | null;
    fastest: { operation: string; duration: number } | null;
  } {
    let totalTracked = 0;
    let slowest: { operation: string; duration: number } | null = null;
    let fastest: { operation: string; duration: number } | null = null;

    for (const [operation, samples] of this.metrics.entries()) {
      totalTracked += samples.length;

      const max = Math.max(...samples);
      const min = Math.min(...samples);

      if (!slowest || max > slowest.duration) {
        slowest = { operation, duration: max };
      }

      if (!fastest || min < fastest.duration) {
        fastest = { operation, duration: min };
      }
    }

    return {
      operations: this.metrics.size,
      totalTracked,
      slowest,
      fastest,
    };
  }

  /**
   * Clear metrics for a specific operation
   */
  clear(operation: string): void {
    this.metrics.delete(operation);
  }

  /**
   * Clear all metrics
   */
  clearAll(): void {
    this.metrics.clear();
  }

  /**
   * Enable or disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if monitoring is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Export metrics as JSON
   */
  toJSON(): Record<string, PerformanceMetrics> {
    const result: Record<string, PerformanceMetrics> = {};

    for (const [operation, metrics] of this.getAllMetrics()) {
      result[operation] = metrics;
    }

    return result;
  }

  /**
   * Format metrics for display
   */
  toString(): string {
    const lines: string[] = ['Performance Metrics:'];
    const summary = this.getSummary();

    lines.push(`  Total Operations: ${summary.operations}`);
    lines.push(`  Total Tracked: ${summary.totalTracked}`);

    if (summary.slowest) {
      lines.push(
        `  Slowest: ${summary.slowest.operation} (${summary.slowest.duration.toFixed(2)}ms)`,
      );
    }

    if (summary.fastest) {
      lines.push(
        `  Fastest: ${summary.fastest.operation} (${summary.fastest.duration.toFixed(2)}ms)`,
      );
    }

    lines.push('\nDetailed Metrics:');

    for (const [operation, metrics] of this.getAllMetrics()) {
      lines.push(`  ${operation}:`);
      lines.push(`    Count: ${metrics.count}`);
      lines.push(`    Avg: ${metrics.avg.toFixed(2)}ms`);
      lines.push(`    Min: ${metrics.min.toFixed(2)}ms`);
      lines.push(`    Max: ${metrics.max.toFixed(2)}ms`);
      lines.push(`    P95: ${metrics.p95.toFixed(2)}ms`);
      lines.push(`    P99: ${metrics.p99.toFixed(2)}ms`);
    }

    return lines.join('\n');
  }
}

/**
 * Global performance monitor instance
 */
let globalMonitor: PerformanceMonitor | null = null;

/**
 * Get or create global performance monitor
 */
export function getPerformanceMonitor(options?: PerformanceMonitorOptions): PerformanceMonitor {
  if (!globalMonitor) {
    globalMonitor = new PerformanceMonitor(options);
  }
  return globalMonitor;
}

/**
 * Reset global performance monitor
 */
export function resetPerformanceMonitor(): void {
  globalMonitor = null;
}

/**
 * Decorator for performance tracking
 */
export function trackPerformance(operation: string) {
  return function <T extends (...args: unknown[]) => unknown>(
    _target: unknown,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value;
    if (!originalMethod) {
      return descriptor;
    }

    descriptor.value = function (this: unknown, ...args: unknown[]) {
      const monitor = getPerformanceMonitor();
      const end = monitor.start(operation || propertyKey);

      try {
        const result = originalMethod.apply(this, args);

        // Handle promises
        if (result instanceof Promise) {
          return result.finally(end) as ReturnType<T>;
        }

        end();
        return result;
      } catch (error) {
        end();
        throw error;
      }
    } as T;

    return descriptor;
  };
}
