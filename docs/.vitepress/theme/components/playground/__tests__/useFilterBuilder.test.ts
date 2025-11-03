import { describe, it, expect } from 'vitest';
import { useFilterBuilder } from '../composables/useFilterBuilder';

describe('useFilterBuilder', () => {
  it('should generate correct expression for single rule', () => {
    const { builderRules, generatedExpression } = useFilterBuilder();

    builderRules.value = [{ field: 'age', operator: '$gte', value: '18' }];

    const result = JSON.parse(generatedExpression.value);
    expect(result).toEqual({
      age: { $gte: 18 },
    });
  });

  it('should generate correct expression for multiple rules with $and', () => {
    const { builderRules, logicalOperator, generatedExpression } = useFilterBuilder();

    builderRules.value = [
      { field: 'age', operator: '$gte', value: '18' },
      { field: 'city', operator: '$eq', value: 'Berlin' },
    ];
    logicalOperator.value = '$and';

    const result = JSON.parse(generatedExpression.value);
    expect(result).toEqual({
      $and: [{ age: { $gte: 18 } }, { city: { $eq: 'Berlin' } }],
    });
  });

  it('should generate correct expression for $in operator', () => {
    const { builderRules, generatedExpression } = useFilterBuilder();

    builderRules.value = [{ field: 'city', operator: '$in', value: 'Berlin, Paris, London' }];

    const result = JSON.parse(generatedExpression.value);
    expect(result).toEqual({
      city: { $in: ['Berlin', 'Paris', 'London'] },
    });
  });

  it('should handle boolean values correctly', () => {
    const { builderRules, generatedExpression } = useFilterBuilder();

    builderRules.value = [{ field: 'active', operator: '$eq', value: 'true' }];

    const result = JSON.parse(generatedExpression.value);
    expect(result).toEqual({
      active: { $eq: true },
    });
  });

  it('should return empty object for no valid rules', () => {
    const { builderRules, generatedExpression } = useFilterBuilder();

    builderRules.value = [{ field: '', operator: '$eq', value: '' }];

    expect(generatedExpression.value).toBe('{}');
  });

  it('should add and remove rules', () => {
    const { builderRules, addRule, removeRule } = useFilterBuilder();

    expect(builderRules.value.length).toBe(1);

    addRule();
    expect(builderRules.value.length).toBe(2);

    removeRule(1);
    expect(builderRules.value.length).toBe(1);
  });

  it('should not remove last rule', () => {
    const { builderRules, removeRule } = useFilterBuilder();

    expect(builderRules.value.length).toBe(1);

    removeRule(0);
    expect(builderRules.value.length).toBe(1);
  });

  it('should clear builder', () => {
    const { builderRules, logicalOperator, addRule, clearBuilder } = useFilterBuilder();

    addRule();
    addRule();
    logicalOperator.value = '$or';

    clearBuilder();

    expect(builderRules.value.length).toBe(1);
    expect(builderRules.value[0]).toEqual({ field: '', operator: '$eq', value: '' });
    expect(logicalOperator.value).toBe('$and');
  });
});
