import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useDebouncedExecute } from '../composables/useDebounce';

describe('useDebouncedExecute', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should debounce function execution', () => {
    const callback = vi.fn();
    const { debouncedExecute } = useDebouncedExecute(callback, 300);

    debouncedExecute();
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on subsequent calls', () => {
    const callback = vi.fn();
    const { debouncedExecute } = useDebouncedExecute(callback, 300);

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
    const { debouncedExecute } = useDebouncedExecute(callback, 300);

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
    const { debouncedExecute } = useDebouncedExecute(callback, 500);

    debouncedExecute();

    vi.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should use default delay of 300ms', () => {
    const callback = vi.fn();
    const { debouncedExecute } = useDebouncedExecute(callback);

    debouncedExecute();

    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should execute callback multiple times if enough time passes', () => {
    const callback = vi.fn();
    const { debouncedExecute } = useDebouncedExecute(callback, 100);

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
    const { debouncedExecute } = useDebouncedExecute(callback, 300);

    debouncedExecute();
    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should clear pending timer when called rapidly', () => {
    const callback = vi.fn();
    const { debouncedExecute } = useDebouncedExecute(callback, 300);

    debouncedExecute();
    const firstTimerId = vi.getTimerCount();

    debouncedExecute();
    debouncedExecute();

    // Should still have only one timer
    expect(vi.getTimerCount()).toBeLessThanOrEqual(firstTimerId);
  });

  it('should execute callback immediately after delay expires', () => {
    const callback = vi.fn();
    const { debouncedExecute } = useDebouncedExecute(callback, 0);

    debouncedExecute();

    vi.advanceTimersByTime(0);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should handle errors in callback gracefully', () => {
    const callback = vi.fn(() => {
      throw new Error('Test error');
    });
    const { debouncedExecute } = useDebouncedExecute(callback, 300);

    debouncedExecute();

    expect(() => {
      vi.advanceTimersByTime(300);
    }).toThrow('Test error');

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
