import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useDebouncedExecute } from '../composables/useDebounce';

describe('useDebouncedExecute', () => {
  let cleanup: (() => void) | null = null;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
    vi.restoreAllMocks();
  });

  it('should debounce function execution', () => {
    const callback = vi.fn();
    const result = useDebouncedExecute(callback, 300);
    cleanup = result.cleanup;
    const { debouncedExecute } = result;

    debouncedExecute();
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on subsequent calls', () => {
    const callback = vi.fn();
    const result = useDebouncedExecute(callback, 300);
    cleanup = result.cleanup;
    const { debouncedExecute } = result;

    debouncedExecute();
    vi.advanceTimersByTime(200);

    debouncedExecute();
    vi.advanceTimersByTime(200);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should only execute callback once after multiple rapid calls', () => {
    const callback = vi.fn();
    const result = useDebouncedExecute(callback, 300);
    cleanup = result.cleanup;
    const { debouncedExecute } = result;

    debouncedExecute();
    debouncedExecute();
    debouncedExecute();
    debouncedExecute();

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should use custom delay', () => {
    const callback = vi.fn();
    const result = useDebouncedExecute(callback, 500);
    cleanup = result.cleanup;
    const { debouncedExecute } = result;

    debouncedExecute();

    vi.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should use default delay of 300ms', () => {
    const callback = vi.fn();
    const result = useDebouncedExecute(callback);
    cleanup = result.cleanup;
    const { debouncedExecute } = result;

    debouncedExecute();

    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should execute callback multiple times if enough time passes', () => {
    const callback = vi.fn();
    const result = useDebouncedExecute(callback, 100);
    cleanup = result.cleanup;
    const { debouncedExecute } = result;

    debouncedExecute();
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);

    debouncedExecute();
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(2);

    debouncedExecute();
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('should handle callback execution', () => {
    const callback = vi.fn();
    const result = useDebouncedExecute(callback, 300);
    cleanup = result.cleanup;
    const { debouncedExecute } = result;

    debouncedExecute();
    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should clear pending timer when called rapidly', () => {
    const callback = vi.fn();
    const result = useDebouncedExecute(callback, 300);
    cleanup = result.cleanup;
    const { debouncedExecute } = result;

    debouncedExecute();
    const firstTimerId = vi.getTimerCount();

    debouncedExecute();
    debouncedExecute();

    // Should still have only one timer
    expect(vi.getTimerCount()).toBeLessThanOrEqual(firstTimerId);
  });

  it('should execute callback immediately after delay expires', () => {
    const callback = vi.fn();
    const result = useDebouncedExecute(callback, 0);
    cleanup = result.cleanup;
    const { debouncedExecute } = result;

    debouncedExecute();

    vi.advanceTimersByTime(0);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should handle errors in callback gracefully', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const callback = vi.fn(() => {
      throw new Error('Test error');
    });
    const result = useDebouncedExecute(callback, 300);
    cleanup = result.cleanup;
    const { debouncedExecute } = result;

    debouncedExecute();

    // Error should be caught and not crash the debounce mechanism
    expect(() => {
      vi.advanceTimersByTime(300);
    }).not.toThrow();

    expect(callback).toHaveBeenCalledTimes(1);
    consoleErrorSpy.mockRestore();
  });
});
