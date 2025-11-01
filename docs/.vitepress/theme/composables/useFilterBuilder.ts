import { ref, computed, type Ref, type ComputedRef } from 'vue';

export interface BuilderRule {
  field: string;
  operator: string;
  value: string;
}

export type LogicalOperator = '$and' | '$or';

interface UseFilterBuilderReturn {
  builderRules: Ref<BuilderRule[]>;
  logicalOperator: Ref<LogicalOperator>;
  generatedExpression: ComputedRef<string>;
  addRule: () => void;
  removeRule: (index: number) => void;
  clearBuilder: () => void;
  buildRuleExpression: (rule: BuilderRule) => Record<string, any>;
}

/**
 * Composable for visual filter builder
 * Manages filter rules and generates MongoDB-style expressions
 */
export function useFilterBuilder(): UseFilterBuilderReturn {
  const builderRules = ref<BuilderRule[]>([{ field: '', operator: '$eq', value: '' }]);
  const logicalOperator = ref<LogicalOperator>('$and');

  const buildRuleExpression = (rule: BuilderRule): Record<string, any> => {
    const { field, operator, value } = rule;

    // Handle array operators
    if (operator === '$in' || operator === '$nin') {
      const values = value.split(',').map((v) => {
        const trimmed = v.trim();
        const num = Number(trimmed);
        return isNaN(num) ? trimmed : num;
      });
      return { [field]: { [operator]: values } };
    }

    // Handle regex
    if (operator === '$regex' || operator === '$match') {
      return { [field]: { [operator]: value } };
    }

    // Handle boolean values
    if (value === 'true' || value === 'false') {
      return { [field]: { [operator]: value === 'true' } };
    }

    // Handle numeric values
    const numValue = Number(value);
    if (!isNaN(numValue) && value !== '') {
      return { [field]: { [operator]: numValue } };
    }

    // Handle string values
    return { [field]: { [operator]: value } };
  };

  const generatedExpression = computed(() => {
    const validRules = builderRules.value.filter((r) => r.field && r.value);

    if (validRules.length === 0) {
      return '{}';
    }

    if (validRules.length === 1) {
      const ruleObj = buildRuleExpression(validRules[0]);
      return JSON.stringify(ruleObj, null, 2);
    }

    // Multiple rules with logical operator
    const ruleExpressions = validRules.map((rule) => buildRuleExpression(rule));

    const result = {
      [logicalOperator.value]: ruleExpressions,
    };

    return JSON.stringify(result, null, 2);
  });

  const addRule = (): void => {
    builderRules.value.push({ field: '', operator: '$eq', value: '' });
  };

  const removeRule = (index: number): void => {
    if (builderRules.value.length > 1) {
      builderRules.value.splice(index, 1);
    }
  };

  const clearBuilder = (): void => {
    builderRules.value = [{ field: '', operator: '$eq', value: '' }];
    logicalOperator.value = '$and';
  };

  return {
    builderRules,
    logicalOperator,
    generatedExpression,
    addRule,
    removeRule,
    clearBuilder,
    buildRuleExpression,
  };
}
