import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { FilterContextValue } from './react.types';

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export interface FilterProviderProps {
  children: ReactNode;
  value?: FilterContextValue;
}

export function FilterProvider({ children, value }: FilterProviderProps): React.JSX.Element {
  const ctx = useMemo(() => value || {}, [value]);
  return React.createElement(FilterContext.Provider, { value: ctx }, children);
}

export function useFilterContext(): FilterContextValue {
  return useContext(FilterContext) || {};
}

