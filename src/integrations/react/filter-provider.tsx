import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { FilterContextValue } from './react.types';

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export interface FilterProviderProps {
  children: ReactNode;
  value?: FilterContextValue;
}

export function FilterProvider({ children, value }: FilterProviderProps): React.JSX.Element {
  const contextValue = useMemo(() => value || {}, [value]);

  return React.createElement(FilterContext.Provider, { value: contextValue }, children);
}

export function useFilterContext(): FilterContextValue {
  const context = useContext(FilterContext);
  return context || {};
}

