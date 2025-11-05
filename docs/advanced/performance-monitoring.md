# Performance Monitoring Guide

@mcabreradev/filter includes built-in performance monitoring to help you track and optimize filter operations.

## Quick Start

```typescript
import { filter, getPerformanceMonitor } from '@mcabreradev/filter';

// Enable performance monitoring
const result = filter(users, { age: { $gte: 18 } }, {
  enablePerformanceMonitoring: true
});

// Get performance metrics
const monitor = getPerformanceMonitor();
const metrics = monitor.getMetrics('filter:total');

console.log(`Average: ${metrics?.avg}ms`);
console.log(`Min: ${metrics?.min}ms`);
console.log(`Max: ${metrics?.max}ms`);
console.log(`P95: ${metrics?.p95}ms`);
```

## PerformanceMonitor Class

### Creating a Monitor

```typescript
import { PerformanceMonitor } from '@mcabreradev/filter';

const monitor = new PerformanceMonitor({
  enabled: true,
  maxSamples: 1000,
  verbose: false,
  onMetric: (operation, duration) => {
    console.log(`${operation}: ${duration}ms`);
  }
});
```

**Options:**
- `enabled` (boolean): Enable/disable monitoring (default: `true`)
- `maxSamples` (number): Maximum samples per operation (default: `1000`)
- `verbose` (boolean): Enable detailed logging (default: `false`)
- `onMetric` (function): Callback when metrics are recorded

### Tracking Operations

#### Manual Tracking

```typescript
monitor.track('my-operation', 150); // Track 150ms duration
```

#### Automatic Tracking

```typescript
const end = monitor.start('my-operation');

// Do some work
performWork();

end(); // Automatically records duration
```

#### Async Operations

```typescript
async function asyncOperation() {
  const end = monitor.start('async-op');
  
  try {
    await doAsyncWork();
  } finally {
    end();
  }
}
```

### Getting Metrics

#### Single Operation

```typescript
const metrics = monitor.getMetrics('filter:total');

if (metrics) {
  console.log({
    count: metrics.count,      // Number of samples
    avg: metrics.avg,          // Average duration (ms)
    min: metrics.min,          // Minimum duration (ms)
    max: metrics.max,          // Maximum duration (ms)
    p95: metrics.p95,          // 95th percentile (ms)
    p99: metrics.p99,          // 99th percentile (ms)
    total: metrics.total       // Total duration (ms)
  });
}
```

#### All Operations

```typescript
const allMetrics = monitor.getAllMetrics();

for (const [operation, metrics] of allMetrics) {
  console.log(`${operation}: ${metrics.avg}ms avg`);
}
```

#### Summary

```typescript
const summary = monitor.getSummary();

console.log({
  operations: summary.operations,      // Number of tracked operations
  totalTracked: summary.totalTracked,  // Total samples
  slowest: summary.slowest,            // Slowest operation
  fastest: summary.fastest             // Fastest operation
});
```

### Managing Metrics

#### Clear Specific Operation

```typescript
monitor.clear('filter:total');
```

#### Clear All Operations

```typescript
monitor.clearAll();
```

#### Enable/Disable

```typescript
monitor.setEnabled(false);  // Disable
monitor.setEnabled(true);   // Enable

console.log(monitor.isEnabled()); // Check status
```

### Exporting Metrics

#### JSON Export

```typescript
const json = monitor.toJSON();

// Send to analytics service
fetch('/api/metrics', {
  method: 'POST',
  body: JSON.stringify(json)
});
```

#### String Format

```typescript
console.log(monitor.toString());

// Output:
// Performance Metrics:
//   Total Operations: 3
//   Total Tracked: 150
//   Slowest: filter:filtering (25.32ms)
//   Fastest: filter:validation (0.15ms)
//
// Detailed Metrics:
//   filter:total:
//     Count: 50
//     Avg: 15.23ms
//     Min: 10.12ms
//     Max: 25.32ms
//     P95: 22.15ms
//     P99: 24.87ms
```

## Global Monitor

Use the global monitor instance for convenience:

```typescript
import { getPerformanceMonitor, resetPerformanceMonitor } from '@mcabreradev/filter';

// Get or create global monitor
const monitor = getPerformanceMonitor({ enabled: true });

// Use the monitor
monitor.track('operation', 100);

// Reset global monitor (creates new instance)
resetPerformanceMonitor();
```

## Filter Integration

Performance monitoring is automatically integrated into the filter function:

```typescript
import { filter, getPerformanceMonitor } from '@mcabreradev/filter';

// Enable monitoring
filter(users, expression, { enablePerformanceMonitoring: true });

// Get metrics
const monitor = getPerformanceMonitor();

// View all operation timings
console.log(monitor.toJSON());
```

**Tracked Operations:**
- `filter:total` - Total filter operation time
- `filter:validation` - Expression validation time
- `filter:cache-lookup` - Cache lookup time
- `filter:cache-set` - Cache set time
- `filter:predicate-creation` - Predicate creation time
- `filter:filtering` - Actual filtering time

## Decorator (TypeScript)

Use the `@trackPerformance` decorator for class methods:

```typescript
import { trackPerformance } from '@mcabreradev/filter';

class DataService {
  @trackPerformance('DataService.processUsers')
  async processUsers(users: User[]) {
    // Method will be automatically tracked
    return users.filter(u => u.active);
  }
}
```

## Real-World Examples

### 1. Performance Dashboard

```typescript
import { filter, getPerformanceMonitor } from '@mcabreradev/filter';

class FilterDashboard {
  private monitor = getPerformanceMonitor({ enabled: true });

  filterUsers(users: User[], expression: unknown) {
    return filter(users, expression, {
      enablePerformanceMonitoring: true
    });
  }

  getPerformanceReport() {
    const summary = this.monitor.getSummary();
    const allMetrics = this.monitor.getAllMetrics();

    return {
      summary,
      operations: Array.from(allMetrics.entries()).map(([op, metrics]) => ({
        operation: op,
        count: metrics.count,
        avg: metrics.avg,
        p95: metrics.p95
      }))
    };
  }
}
```

### 2. Performance Alerts

```typescript
import { PerformanceMonitor } from '@mcabreradev/filter';

const monitor = new PerformanceMonitor({
  enabled: true,
  onMetric: (operation, duration) => {
    // Alert if operation is too slow
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${operation} took ${duration}ms`);
      
      // Send to monitoring service
      sendAlert({
        type: 'performance',
        operation,
        duration,
        threshold: 1000
      });
    }
  }
});
```

### 3. A/B Testing

```typescript
import { filter, getPerformanceMonitor } from '@mcabreradev/filter';

// Test with cache enabled
const monitorA = new PerformanceMonitor({ enabled: true });
const resultA = filter(largeDataset, expression, {
  enableCache: true,
  enablePerformanceMonitoring: true
});
const metricsA = monitorA.getMetrics('filter:total');

// Test with cache disabled
const monitorB = new PerformanceMonitor({ enabled: true });
const resultB = filter(largeDataset, expression, {
  enableCache: false,
  enablePerformanceMonitoring: true
});
const metricsB = monitorB.getMetrics('filter:total');

console.log('Cache enabled:', metricsA?.avg, 'ms');
console.log('Cache disabled:', metricsB?.avg, 'ms');
console.log('Speedup:', (metricsB?.avg / metricsA?.avg).toFixed(2), 'x');
```

### 4. Regression Detection

```typescript
import { PerformanceMonitor } from '@mcabreradev/filter';

const monitor = new PerformanceMonitor({ enabled: true });
const baseline = { avg: 10, p95: 15 }; // Known good performance

// After changes
runFilterOperations();

const current = monitor.getMetrics('filter:total');

if (current && current.avg > baseline.avg * 1.2) {
  console.error('Performance regression detected!');
  console.error(`Current avg: ${current.avg}ms`);
  console.error(`Baseline avg: ${baseline.avg}ms`);
  console.error(`Regression: ${((current.avg / baseline.avg - 1) * 100).toFixed(1)}%`);
}
```

### 5. Production Monitoring

```typescript
import { filter, getPerformanceMonitor } from '@mcabreradev/filter';

// Enable monitoring in production
const monitor = getPerformanceMonitor({
  enabled: process.env.NODE_ENV === 'production',
  maxSamples: 5000
});

// Filter with monitoring
app.post('/api/filter', (req, res) => {
  const result = filter(data, req.body.expression, {
    enablePerformanceMonitoring: true
  });

  res.json({ data: result });
});

// Periodic reporting
setInterval(() => {
  const summary = monitor.getSummary();
  
  // Send to analytics
  analytics.track('filter_performance', {
    operations: summary.operations,
    totalTracked: summary.totalTracked,
    slowest: summary.slowest,
    fastest: summary.fastest
  });
}, 60000); // Every minute
```

### 6. Memory-Efficient Monitoring

```typescript
import { PerformanceMonitor } from '@mcabreradev/filter';

// Limit samples to prevent memory issues
const monitor = new PerformanceMonitor({
  enabled: true,
  maxSamples: 100  // Keep only last 100 samples
});

// For long-running applications
setInterval(() => {
  // Export and clear old data
  const metrics = monitor.toJSON();
  saveMetrics(metrics);
  monitor.clearAll();
}, 3600000); // Every hour
```

## Best Practices

### ✅ Do

- Enable monitoring in development for optimization
- Use global monitor for consistency
- Set appropriate `maxSamples` for your use case
- Clear metrics periodically in long-running apps
- Export metrics to analytics services
- Use `onMetric` callback for real-time alerts

### ❌ Don't

- Enable verbose mode in production
- Keep unlimited samples in memory
- Track every single operation in production
- Forget to disable monitoring when not needed
- Ignore performance metrics from monitoring

## Integration with Monitoring Services

### Datadog

```typescript
import { StatsD } from 'hot-shots';
import { PerformanceMonitor } from '@mcabreradev/filter';

const dogstatsd = new StatsD();

const monitor = new PerformanceMonitor({
  enabled: true,
  onMetric: (operation, duration) => {
    dogstatsd.timing(operation, duration);
  }
});
```

### Prometheus

```typescript
import { Histogram } from 'prom-client';
import { PerformanceMonitor } from '@mcabreradev/filter';

const histogram = new Histogram({
  name: 'filter_duration_ms',
  help: 'Filter operation duration',
  labelNames: ['operation']
});

const monitor = new PerformanceMonitor({
  enabled: true,
  onMetric: (operation, duration) => {
    histogram.observe({ operation }, duration);
  }
});
```

### New Relic

```typescript
import newrelic from 'newrelic';
import { PerformanceMonitor } from '@mcabreradev/filter';

const monitor = new PerformanceMonitor({
  enabled: true,
  onMetric: (operation, duration) => {
    newrelic.recordMetric(`Custom/Filter/${operation}`, duration);
  }
});
```

## TypeScript Types

```typescript
import type {
  PerformanceMetrics,
  PerformanceMonitorOptions
} from '@mcabreradev/filter';

const options: PerformanceMonitorOptions = {
  enabled: true,
  maxSamples: 1000,
  verbose: false,
  onMetric: (operation: string, duration: number) => {
    console.log(`${operation}: ${duration}ms`);
  }
};

const metrics: PerformanceMetrics = {
  count: 100,
  avg: 15.5,
  min: 10.2,
  max: 25.8,
  p95: 22.1,
  p99: 24.5,
  total: 1550
};
```

---

**See Also:**
- [Error Handling Guide](./error-handling.md)
- [Performance Benchmarks](./performance-benchmarks.md)
- [API Reference](../api/reference.md)
