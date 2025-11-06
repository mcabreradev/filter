import type { ComparisonOperators } from '../../types';

export const applyComparisonOperators = (
  value: unknown,
  operators: ComparisonOperators,
): boolean => {
  if (operators.$eq !== undefined) {
    if (value !== operators.$eq) return false;
  }

  if (operators.$ne !== undefined) {
    if (value === operators.$ne) return false;
  }

  const numValue =
    typeof value === 'number' ? value : value instanceof Date ? value.getTime() : null;

  if (
    operators.$gt !== undefined ||
    operators.$gte !== undefined ||
    operators.$lt !== undefined ||
    operators.$lte !== undefined
  ) {
    if (numValue === null) return false;
  }

  if (operators.$gt !== undefined) {
    const compareValue = operators.$gt instanceof Date ? operators.$gt.getTime() : operators.$gt;
    if (numValue === null || numValue <= compareValue) return false;
  }

  if (operators.$gte !== undefined) {
    const compareValue = operators.$gte instanceof Date ? operators.$gte.getTime() : operators.$gte;
    if (numValue === null || numValue < compareValue) return false;
  }

  if (operators.$lt !== undefined) {
    const compareValue = operators.$lt instanceof Date ? operators.$lt.getTime() : operators.$lt;
    if (numValue === null || numValue >= compareValue) return false;
  }

  if (operators.$lte !== undefined) {
    const compareValue = operators.$lte instanceof Date ? operators.$lte.getTime() : operators.$lte;
    if (numValue === null || numValue > compareValue) return false;
  }

  return true;
};
