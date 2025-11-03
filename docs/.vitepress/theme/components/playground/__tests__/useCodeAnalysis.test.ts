import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useCodeAnalysis } from '../composables/useCodeAnalysis';

describe('useCodeAnalysis', () => {
  describe('field extraction from code', () => {
    it('should extract fields from data array', () => {
      const code = ref(`
        const users = [
          { name: 'Alice', age: 30, active: true },
          { name: 'Bob', age: 25, active: false }
        ];
      `);

      const { availableFields } = useCodeAnalysis(code);

      expect(availableFields.value).toContain('name');
      expect(availableFields.value).toContain('age');
      expect(availableFields.value).toContain('active');
    });

    it('should use provided dataset fields', () => {
      const code = ref('const data = [];');
      const datasetFields = ref(['customField1', 'customField2']);

      const { availableFields } = useCodeAnalysis(code, datasetFields);

      expect(availableFields.value).toEqual(['customField1', 'customField2']);
    });

    it('should handle code without array declaration', () => {
      const code = ref('const x = 5;');

      const { availableFields } = useCodeAnalysis(code);

      expect(availableFields.value).toEqual([]);
    });

    it('should deduplicate field names', () => {
      const code = ref(`
        const data = [
          { id: 1, name: 'test' },
          { id: 2, name: 'test2' }
        ];
      `);

      const { availableFields } = useCodeAnalysis(code);

      expect(availableFields.value).toEqual(['id', 'name']);
    });
  });

  describe('field type inference', () => {
    it('should infer string type', () => {
      const code = ref(`
        const data = [{ name: 'Alice', email: "test@example.com" }];
      `);

      const { fieldTypes } = useCodeAnalysis(code);

      expect(fieldTypes.value.name).toBe('string');
      expect(fieldTypes.value.email).toBe('string');
    });

    it('should infer number type', () => {
      const code = ref(`
        const data = [{ age: 30, score: 95.5 }];
      `);

      const { fieldTypes } = useCodeAnalysis(code);

      expect(fieldTypes.value.age).toBe('number');
      expect(fieldTypes.value.score).toBe('number');
    });

    it('should infer boolean type', () => {
      const code = ref(`
        const data = [{ active: true, verified: false }];
      `);

      const { fieldTypes } = useCodeAnalysis(code);

      expect(fieldTypes.value.active).toBe('boolean');
      expect(fieldTypes.value.verified).toBe('boolean');
    });

    it('should infer date type', () => {
      const code = ref(`
        const data = [{ createdAt: new Date(), birthDate: new Date(1990, 0, 1) }];
      `);

      const { fieldTypes } = useCodeAnalysis(code);

      expect(fieldTypes.value.createdAt).toBe('date');
      expect(fieldTypes.value.birthDate).toBe('date');
    });

    it('should infer object type', () => {
      const code = ref(`
        const data = [{ location: { lat: 0, lng: 0 } }];
      `);

      const { fieldTypes } = useCodeAnalysis(code);

      expect(fieldTypes.value.location).toBe('object');
    });
  });

  describe('getOperatorsForField', () => {
    it('should return string operators for string fields', () => {
      const code = ref(`const data = [{ name: 'test' }];`);
      const { getOperatorsForField } = useCodeAnalysis(code);

      const operators = getOperatorsForField('name');

      expect(operators).toContainEqual({ value: '$eq', label: 'equals' });
      expect(operators).toContainEqual({ value: '$contains', label: 'contains' });
      expect(operators).toContainEqual({ value: '$startsWith', label: 'starts with' });
      expect(operators).toContainEqual({ value: '$endsWith', label: 'ends with' });
      expect(operators).toContainEqual({ value: '$regex', label: 'matches regex' });
    });

    it('should return number operators for number fields', () => {
      const code = ref(`const data = [{ age: 30 }];`);
      const { getOperatorsForField } = useCodeAnalysis(code);

      const operators = getOperatorsForField('age');

      expect(operators).toContainEqual({ value: '$eq', label: 'equals' });
      expect(operators).toContainEqual({ value: '$gt', label: 'greater than' });
      expect(operators).toContainEqual({ value: '$gte', label: 'greater or equal' });
      expect(operators).toContainEqual({ value: '$lt', label: 'less than' });
      expect(operators).toContainEqual({ value: '$lte', label: 'less or equal' });
    });

    it('should return boolean operators for boolean fields', () => {
      const code = ref(`const data = [{ active: true }];`);
      const { getOperatorsForField } = useCodeAnalysis(code);

      const operators = getOperatorsForField('active');

      expect(operators).toContainEqual({ value: '$eq', label: 'equals' });
      expect(operators).toContainEqual({ value: '$ne', label: 'not equals' });
      expect(operators).toHaveLength(2);
    });

    it('should return date operators for date fields', () => {
      const code = ref(`const data = [{ createdAt: new Date() }];`);
      const { getOperatorsForField } = useCodeAnalysis(code);

      const operators = getOperatorsForField('createdAt');

      expect(operators).toContainEqual({ value: '$recent', label: 'recent (within last X time)' });
      expect(operators).toContainEqual({
        value: '$upcoming',
        label: 'upcoming (within next X time)',
      });
      expect(operators).toContainEqual({ value: '$dayOfWeek', label: 'day of week' });
      expect(operators).toContainEqual({ value: '$timeOfDay', label: 'time of day' });
      expect(operators).toContainEqual({ value: '$age', label: 'age (calculate from date)' });
    });

    it('should return object operators for object fields', () => {
      const code = ref(`const data = [{ location: { lat: 0, lng: 0 } }];`);
      const { getOperatorsForField } = useCodeAnalysis(code);

      const operators = getOperatorsForField('location');

      expect(operators).toContainEqual({ value: '$near', label: 'near location' });
      expect(operators).toContainEqual({ value: '$geoBox', label: 'within bounding box' });
      expect(operators).toContainEqual({ value: '$geoPolygon', label: 'within polygon' });
    });

    it('should return default operators for unknown fields', () => {
      const code = ref(`const data = [];`);
      const { getOperatorsForField } = useCodeAnalysis(code);

      const operators = getOperatorsForField('unknownField');

      expect(operators[0]).toEqual({ value: '$eq', label: 'equals' });
    });
  });

  describe('getInputTypeForOperator', () => {
    it('should return text for equality operators', () => {
      const code = ref('');
      const { getInputTypeForOperator } = useCodeAnalysis(code);

      expect(getInputTypeForOperator('$eq')).toBe('text');
      expect(getInputTypeForOperator('$ne')).toBe('text');
    });

    it('should return number for comparison operators', () => {
      const code = ref('');
      const { getInputTypeForOperator } = useCodeAnalysis(code);

      expect(getInputTypeForOperator('$gt')).toBe('number');
      expect(getInputTypeForOperator('$gte')).toBe('number');
      expect(getInputTypeForOperator('$lt')).toBe('number');
      expect(getInputTypeForOperator('$lte')).toBe('number');
    });

    it('should return text for other operators', () => {
      const code = ref('');
      const { getInputTypeForOperator } = useCodeAnalysis(code);

      expect(getInputTypeForOperator('$contains')).toBe('text');
      expect(getInputTypeForOperator('$regex')).toBe('text');
    });
  });

  describe('getPlaceholderForOperator', () => {
    it('should return appropriate placeholders for array operators', () => {
      const code = ref('');
      const { getPlaceholderForOperator } = useCodeAnalysis(code);

      expect(getPlaceholderForOperator('$in')).toBe('value1, value2, value3');
      expect(getPlaceholderForOperator('$nin')).toBe('value1, value2, value3');
    });

    it('should return regex placeholder for pattern operators', () => {
      const code = ref('');
      const { getPlaceholderForOperator } = useCodeAnalysis(code);

      expect(getPlaceholderForOperator('$regex')).toBe('^pattern$');
      expect(getPlaceholderForOperator('$match')).toBe('^pattern$');
    });

    it('should return geospatial placeholders', () => {
      const code = ref('');
      const { getPlaceholderForOperator } = useCodeAnalysis(code);

      expect(getPlaceholderForOperator('$near')).toContain('lat');
      expect(getPlaceholderForOperator('$near')).toContain('lng');
      expect(getPlaceholderForOperator('$geoBox')).toContain('southwest');
      expect(getPlaceholderForOperator('$geoPolygon')).toContain('points');
    });

    it('should return datetime placeholders', () => {
      const code = ref('');
      const { getPlaceholderForOperator } = useCodeAnalysis(code);

      expect(getPlaceholderForOperator('$recent')).toContain('days');
      expect(getPlaceholderForOperator('$upcoming')).toContain('days');
      expect(getPlaceholderForOperator('$dayOfWeek')).toContain('[1, 2, 3, 4, 5]');
      expect(getPlaceholderForOperator('$timeOfDay')).toContain('start');
      expect(getPlaceholderForOperator('$age')).toContain('min');
    });

    it('should return default placeholder for unknown operators', () => {
      const code = ref('');
      const { getPlaceholderForOperator } = useCodeAnalysis(code);

      expect(getPlaceholderForOperator('$unknown')).toBe('Enter value...');
    });
  });

  describe('reactivity', () => {
    it('should update fields when code changes', () => {
      const code = ref(`const data = [{ name: 'test' }];`);
      const { availableFields } = useCodeAnalysis(code);

      expect(availableFields.value).toEqual(['name']);

      code.value = `const data = [{ age: 30, city: 'Berlin' }];`;

      expect(availableFields.value).toContain('age');
      expect(availableFields.value).toContain('city');
      expect(availableFields.value).not.toContain('name');
    });

    it('should update field types when code changes', () => {
      const code = ref(`const data = [{ value: 'string' }];`);
      const { fieldTypes } = useCodeAnalysis(code);

      expect(fieldTypes.value.value).toBe('string');

      code.value = `const data = [{ value: 42 }];`;

      expect(fieldTypes.value.value).toBe('number');
    });

    it('should prioritize dataset fields over code analysis', () => {
      const code = ref(`const data = [{ name: 'test' }];`);
      const datasetFields = ref(['custom1', 'custom2']);

      const { availableFields } = useCodeAnalysis(code, datasetFields);

      expect(availableFields.value).toEqual(['custom1', 'custom2']);

      datasetFields.value = ['updated1', 'updated2', 'updated3'];

      expect(availableFields.value).toEqual(['updated1', 'updated2', 'updated3']);
    });
  });
});
