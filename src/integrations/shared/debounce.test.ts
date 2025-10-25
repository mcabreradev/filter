import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should debounce function calls', () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);

    debounced();
    debounced();
    debounced();

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments correctly', () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);

    debounced('arg1', 'arg2');

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should support leading edge execution', () => {
    const func = vi.fn();
    const debounced = debounce(func, 100, { leading: true });

    debounced();

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(2);
  });

  it('should support trailing edge only', () => {
    const func = vi.fn();
    const debounced = debounce(func, 100, { leading: false, trailing: true });

    debounced();

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should cancel pending execution', () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);

    debounced();
    debounced.cancel();

    vi.advanceTimersByTime(100);

    expect(func).not.toHaveBeenCalled();
  });

  it('should handle multiple rapid calls', () => {
    const func = vi.fn();
    const debounced = debounce(func, 100);

    for (let i = 0; i < 10; i++) {
      debounced();
      vi.advanceTimersByTime(50);
    }

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should preserve this context', () => {
    const obj = {
      value: 42,
      method: vi.fn(function (this: { value: number }) {
        return this.value;
      }),
    };

    const debounced = debounce(obj.method, 100);
    debounced.call(obj);

    vi.advanceTimersByTime(100);

    expect(obj.method).toHaveBeenCalled();
  });
});
