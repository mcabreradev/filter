import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { FilterProvider, useFilterContext } from './filter-provider';
import type { ReactNode } from 'react';

describe('FilterProvider', () => {
  it('should provide default context', () => {
    const { result } = renderHook(() => useFilterContext(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <FilterProvider>{children}</FilterProvider>
      ),
    });

    expect(result.current).toEqual({});
  });

  it('should provide custom context value', () => {
    const contextValue = {
      options: { caseSensitive: true, maxDepth: 5 },
      enableCache: true,
    };

    const { result } = renderHook(() => useFilterContext(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <FilterProvider value={contextValue}>{children}</FilterProvider>
      ),
    });

    expect(result.current).toEqual(contextValue);
  });

  it('should return empty object when used outside provider', () => {
    const { result } = renderHook(() => useFilterContext());

    expect(result.current).toEqual({});
  });

  it('should update context when value changes', () => {
    const { result, rerender } = renderHook(() => useFilterContext(), {
      wrapper: ({ children, value }: { children: ReactNode; value?: unknown }) => (
        <FilterProvider value={value as never}>{children}</FilterProvider>
      ),
      initialProps: { value: { enableCache: true } },
    });

    expect(result.current).toEqual({ enableCache: true });

    rerender({ value: { enableCache: false } });

    expect(result.current).toEqual({ enableCache: false });
  });

  it('should provide filter options', () => {
    const contextValue = {
      options: {
        caseSensitive: true,
        maxDepth: 5,
        enableCache: true,
      },
    };

    const { result } = renderHook(() => useFilterContext(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <FilterProvider value={contextValue}>{children}</FilterProvider>
      ),
    });

    expect(result.current.options?.caseSensitive).toBe(true);
    expect(result.current.options?.maxDepth).toBe(5);
    expect(result.current.options?.enableCache).toBe(true);
  });
});

