import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  PerformanceMonitor,
  getPerformanceMonitor,
  resetPerformanceMonitor,
} from './performance-monitor';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor({ enabled: true });
    resetPerformanceMonitor();
  });

  describe('constructor', () => {
    it('should create with default options', () => {
      const mon = new PerformanceMonitor();
      expect(mon.isEnabled()).toBe(true);
    });

    it('should create with custom options', () => {
      const mon = new PerformanceMonitor({
        enabled: false,
        maxSamples: 500,
        verbose: true,
      });
      expect(mon.isEnabled()).toBe(false);
    });

    it('should call onMetric callback', () => {
      const callback = vi.fn();
      const mon = new PerformanceMonitor({ onMetric: callback });

      mon.track('test', 100);

      expect(callback).toHaveBeenCalledWith('test', 100);
    });
  });

  describe('track', () => {
    it('should track operation duration', () => {
      monitor.track('test-op', 100);

      const metrics = monitor.getMetrics('test-op');
      expect(metrics).toBeDefined();
      expect(metrics?.count).toBe(1);
      expect(metrics?.avg).toBe(100);
    });

    it('should track multiple durations', () => {
      monitor.track('test-op', 100);
      monitor.track('test-op', 200);
      monitor.track('test-op', 300);

      const metrics = monitor.getMetrics('test-op');
      expect(metrics?.count).toBe(3);
      expect(metrics?.avg).toBe(200);
      expect(metrics?.min).toBe(100);
      expect(metrics?.max).toBe(300);
    });

    it('should not track when disabled', () => {
      monitor.setEnabled(false);
      monitor.track('test-op', 100);

      const metrics = monitor.getMetrics('test-op');
      expect(metrics).toBeUndefined();
    });

    it('should limit samples to maxSamples', () => {
      const mon = new PerformanceMonitor({ maxSamples: 5 });

      for (let i = 0; i < 10; i++) {
        mon.track('test-op', i);
      }

      const metrics = mon.getMetrics('test-op');
      expect(metrics?.count).toBe(5);
    });
  });

  describe('start', () => {
    it('should track duration automatically', async () => {
      const end = monitor.start('test-op');

      await new Promise((resolve) => setTimeout(resolve, 10));

      end();

      const metrics = monitor.getMetrics('test-op');
      expect(metrics).toBeDefined();
      expect(metrics?.count).toBe(1);
      expect(metrics?.avg).toBeGreaterThan(0);
    });

    it('should return no-op function when disabled', () => {
      monitor.setEnabled(false);
      const end = monitor.start('test-op');
      end();

      const metrics = monitor.getMetrics('test-op');
      expect(metrics).toBeUndefined();
    });
  });

  describe('getMetrics', () => {
    it('should return undefined for unknown operation', () => {
      const metrics = monitor.getMetrics('unknown');
      expect(metrics).toBeUndefined();
    });

    it('should calculate correct metrics', () => {
      const durations = [100, 200, 300, 400, 500];
      durations.forEach((d) => monitor.track('test-op', d));

      const metrics = monitor.getMetrics('test-op');
      expect(metrics).toBeDefined();
      expect(metrics?.count).toBe(5);
      expect(metrics?.avg).toBe(300);
      expect(metrics?.min).toBe(100);
      expect(metrics?.max).toBe(500);
      expect(metrics?.total).toBe(1500);
    });

    it('should calculate percentiles correctly', () => {
      const durations = Array.from({ length: 100 }, (_, i) => i + 1);
      durations.forEach((d) => monitor.track('test-op', d));

      const metrics = monitor.getMetrics('test-op');
      expect(metrics?.p95).toBeGreaterThan(90);
      expect(metrics?.p99).toBeGreaterThan(95);
    });
  });

  describe('getAllMetrics', () => {
    it('should return all tracked operations', () => {
      monitor.track('op1', 100);
      monitor.track('op2', 200);
      monitor.track('op3', 300);

      const allMetrics = monitor.getAllMetrics();
      expect(allMetrics.size).toBe(3);
      expect(allMetrics.has('op1')).toBe(true);
      expect(allMetrics.has('op2')).toBe(true);
      expect(allMetrics.has('op3')).toBe(true);
    });

    it('should return empty map when no operations tracked', () => {
      const allMetrics = monitor.getAllMetrics();
      expect(allMetrics.size).toBe(0);
    });
  });

  describe('getSummary', () => {
    it('should return summary of operations', () => {
      monitor.track('op1', 100);
      monitor.track('op1', 200);
      monitor.track('op2', 50);
      monitor.track('op2', 300);

      const summary = monitor.getSummary();
      expect(summary.operations).toBe(2);
      expect(summary.totalTracked).toBe(4);
      expect(summary.slowest).toEqual({ operation: 'op2', duration: 300 });
      expect(summary.fastest).toEqual({ operation: 'op2', duration: 50 });
    });

    it('should return zeros when no operations tracked', () => {
      const summary = monitor.getSummary();
      expect(summary.operations).toBe(0);
      expect(summary.totalTracked).toBe(0);
      expect(summary.slowest).toBeNull();
      expect(summary.fastest).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear metrics for specific operation', () => {
      monitor.track('op1', 100);
      monitor.track('op2', 200);

      monitor.clear('op1');

      expect(monitor.getMetrics('op1')).toBeUndefined();
      expect(monitor.getMetrics('op2')).toBeDefined();
    });
  });

  describe('clearAll', () => {
    it('should clear all metrics', () => {
      monitor.track('op1', 100);
      monitor.track('op2', 200);
      monitor.track('op3', 300);

      monitor.clearAll();

      expect(monitor.getAllMetrics().size).toBe(0);
    });
  });

  describe('setEnabled / isEnabled', () => {
    it('should enable and disable monitoring', () => {
      expect(monitor.isEnabled()).toBe(true);

      monitor.setEnabled(false);
      expect(monitor.isEnabled()).toBe(false);

      monitor.setEnabled(true);
      expect(monitor.isEnabled()).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('should export metrics as JSON', () => {
      monitor.track('op1', 100);
      monitor.track('op2', 200);

      const json = monitor.toJSON();
      expect(json).toHaveProperty('op1');
      expect(json).toHaveProperty('op2');
      expect(json.op1.count).toBe(1);
      expect(json.op2.count).toBe(1);
    });
  });

  describe('toString', () => {
    it('should format metrics for display', () => {
      monitor.track('op1', 100);
      monitor.track('op1', 200);

      const str = monitor.toString();
      expect(str).toContain('Performance Metrics');
      expect(str).toContain('Total Operations');
      expect(str).toContain('op1');
      expect(str).toContain('Count: 2');
    });

    it('should show slowest and fastest operations', () => {
      monitor.track('slow', 1000);
      monitor.track('fast', 10);

      const str = monitor.toString();
      expect(str).toContain('Slowest: slow');
      expect(str).toContain('Fastest: fast');
    });
  });

  describe('Global Monitor', () => {
    it('should get or create global monitor', () => {
      const mon1 = getPerformanceMonitor();
      const mon2 = getPerformanceMonitor();

      expect(mon1).toBe(mon2);
    });

    it('should create with options', () => {
      resetPerformanceMonitor();
      const mon = getPerformanceMonitor({ enabled: false });

      expect(mon.isEnabled()).toBe(false);
    });

    it('should reset global monitor', () => {
      const mon1 = getPerformanceMonitor();
      mon1.track('test', 100);

      resetPerformanceMonitor();

      const mon2 = getPerformanceMonitor();
      expect(mon2).not.toBe(mon1);
      expect(mon2.getMetrics('test')).toBeUndefined();
    });
  });

  describe('Real-world scenarios', () => {
    it('should track filter operations', () => {
      const data = Array.from({ length: 1000 }, (_, i) => ({ id: i }));

      const end = monitor.start('filter-operation');
      data.filter((item) => item.id > 500);
      end();

      const metrics = monitor.getMetrics('filter-operation');
      expect(metrics).toBeDefined();
      expect(metrics?.count).toBe(1);
    });

    it('should track multiple iterations', () => {
      for (let i = 0; i < 10; i++) {
        const end = monitor.start('iteration');
        // Simulate work
        Array.from({ length: 100 }, (_, j) => j).reduce((a, b) => a + b, 0);
        end();
      }

      const metrics = monitor.getMetrics('iteration');
      expect(metrics?.count).toBe(10);
      expect(metrics?.avg).toBeGreaterThan(0);
    });

    it('should identify performance bottlenecks', () => {
      monitor.track('fast-op', 1);
      monitor.track('fast-op', 2);
      monitor.track('slow-op', 100);
      monitor.track('slow-op', 200);

      const summary = monitor.getSummary();
      expect(summary.slowest?.operation).toBe('slow-op');
      expect(summary.fastest?.operation).toBe('fast-op');
    });
  });
});
