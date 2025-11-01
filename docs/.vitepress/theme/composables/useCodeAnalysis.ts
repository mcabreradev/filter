import { computed, type Ref, type ComputedRef } from 'vue';

export interface OperatorOption {
  value: string;
  label: string;
}

type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'date';

const operatorsByType: Record<FieldType | 'array', OperatorOption[]> = {
  string: [
    { value: '$eq', label: 'equals' },
    { value: '$ne', label: 'not equals' },
    { value: '$contains', label: 'contains' },
    { value: '$startsWith', label: 'starts with' },
    { value: '$endsWith', label: 'ends with' },
    { value: '$regex', label: 'matches regex' },
    { value: '$match', label: 'matches pattern' },
    { value: '$in', label: 'in array' },
    { value: '$nin', label: 'not in array' },
  ],
  number: [
    { value: '$eq', label: 'equals' },
    { value: '$ne', label: 'not equals' },
    { value: '$gt', label: 'greater than' },
    { value: '$gte', label: 'greater or equal' },
    { value: '$lt', label: 'less than' },
    { value: '$lte', label: 'less or equal' },
    { value: '$in', label: 'in array' },
    { value: '$nin', label: 'not in array' },
  ],
  boolean: [
    { value: '$eq', label: 'equals' },
    { value: '$ne', label: 'not equals' },
  ],
  object: [
    { value: '$near', label: 'near location' },
    { value: '$geoBox', label: 'within bounding box' },
    { value: '$geoPolygon', label: 'within polygon' },
  ],
  date: [
    { value: '$recent', label: 'recent (within last X time)' },
    { value: '$upcoming', label: 'upcoming (within next X time)' },
    { value: '$dayOfWeek', label: 'day of week' },
    { value: '$timeOfDay', label: 'time of day' },
    { value: '$age', label: 'age (calculate from date)' },
    { value: '$isWeekday', label: 'is weekday' },
    { value: '$isWeekend', label: 'is weekend' },
    { value: '$isBefore', label: 'is before date' },
    { value: '$isAfter', label: 'is after date' },
    { value: '$eq', label: 'equals' },
    { value: '$ne', label: 'not equals' },
    { value: '$gt', label: 'greater than' },
    { value: '$gte', label: 'greater or equal' },
    { value: '$lt', label: 'less than' },
    { value: '$lte', label: 'less or equal' },
  ],
  array: [
    { value: '$in', label: 'in array' },
    { value: '$nin', label: 'not in array' },
    { value: '$contains', label: 'contains' },
    { value: '$size', label: 'array size' },
  ],
};

interface UseCodeAnalysisReturn {
  availableFields: ComputedRef<string[]>;
  fieldTypes: ComputedRef<Record<string, FieldType>>;
  getOperatorsForField: (field: string) => OperatorOption[];
  getInputTypeForOperator: (operator: string) => string;
  getPlaceholderForOperator: (operator: string) => string;
}

/**
 * Composable for code analysis and field extraction
 * Provides type inference and operator suggestions
 */
export function useCodeAnalysis(
  code: Ref<string>,
  datasetFields?: Ref<string[] | undefined>,
): UseCodeAnalysisReturn {
  const availableFields = computed(() => {
    if (datasetFields?.value) {
      return datasetFields.value;
    }

    // Fallback: extract from code
    try {
      const arrayMatch = code.value.match(/const\s+\w+\s*=\s*\[([\s\S]*?)\];/);
      if (!arrayMatch) return [];

      const arrayContent = arrayMatch[1];
      const firstObjectMatch = arrayContent.match(/\{([^}]+)\}/);
      if (!firstObjectMatch) return [];

      const objectContent = firstObjectMatch[1];
      const fieldMatches = objectContent.matchAll(/(\w+):/g);
      const fields = Array.from(fieldMatches, (match) => match[1]);

      return [...new Set(fields)];
    } catch {
      return [];
    }
  });

  const fieldTypes = computed(() => {
    try {
      const types: Record<string, FieldType> = {};
      const arrayMatch = code.value.match(/const\s+\w+\s*=\s*\[([\s\S]*?)\];/);
      if (!arrayMatch) return types;

      const arrayContent = arrayMatch[1];
      const firstObjectMatch = arrayContent.match(/\{([^}]+)\}/);
      if (!firstObjectMatch) return types;

      const objectContent = firstObjectMatch[1];
      const fieldPattern = /(\w+):\s*([^,}]+)/g;
      let match;

      while ((match = fieldPattern.exec(objectContent)) !== null) {
        const [, fieldName, value] = match;
        const trimmedValue = value.trim();

        if (trimmedValue === 'true' || trimmedValue === 'false') {
          types[fieldName] = 'boolean';
        } else if (trimmedValue.startsWith('new Date(')) {
          types[fieldName] = 'date';
        } else if (trimmedValue.startsWith('{')) {
          types[fieldName] = 'object';
        } else if (trimmedValue.startsWith("'") || trimmedValue.startsWith('"')) {
          types[fieldName] = 'string';
        } else if (!isNaN(Number(trimmedValue))) {
          types[fieldName] = 'number';
        } else {
          types[fieldName] = 'string';
        }
      }

      return types;
    } catch {
      return {};
    }
  });

  const getOperatorsForField = (field: string): OperatorOption[] => {
    if (!field) return operatorsByType.string;
    const type = fieldTypes.value[field] || 'string';
    return operatorsByType[type];
  };

  const getInputTypeForOperator = (operator: string): string => {
    if (operator === '$eq' || operator === '$ne') return 'text';
    if (operator.startsWith('$gt') || operator.startsWith('$lt')) return 'number';
    return 'text';
  };

  const getPlaceholderForOperator = (operator: string): string => {
    if (operator === '$in' || operator === '$nin') return 'value1, value2, value3';
    if (operator === '$regex' || operator === '$match') return '^pattern$';
    if (operator === '$near') return '{ center: { lat: 0, lng: 0 }, maxDistanceMeters: 1000 }';
    if (operator === '$geoBox')
      return '{ southwest: { lat: 0, lng: 0 }, northeast: { lat: 0, lng: 0 } }';
    if (operator === '$geoPolygon') return '{ points: [{ lat: 0, lng: 0 }] }';
    if (operator === '$size') return '3';
    if (operator === '$recent') return '{ days: 7 } or { hours: 24 }';
    if (operator === '$upcoming') return '{ days: 7 } or { hours: 24 }';
    if (operator === '$dayOfWeek') return '[1, 2, 3, 4, 5] (Mon-Fri)';
    if (operator === '$timeOfDay') return '{ start: 9, end: 17 }';
    if (operator === '$age') return '{ min: 18 } or { min: 18, max: 65 }';
    if (operator === '$isWeekday' || operator === '$isWeekend') return 'true or false';
    if (operator === '$isBefore' || operator === '$isAfter') return 'new Date(2025, 0, 1)';
    return 'Enter value...';
  };

  return {
    availableFields,
    fieldTypes,
    getOperatorsForField,
    getInputTypeForOperator,
    getPlaceholderForOperator,
  };
}
