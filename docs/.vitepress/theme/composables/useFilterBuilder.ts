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
  buildRuleExpression: (rule: BuilderRule) => string;
}

/**
 * Composable for visual filter builder
 * Manages filter rules and generates MongoDB-style expressions
 */
export function useFilterBuilder(): UseFilterBuilderReturn {
  const builderRules = ref<BuilderRule[]>([{ field: '', operator: '$eq', value: '' }]);
  const logicalOperator = ref<LogicalOperator>('$and');

  const buildRuleExpression = (rule: BuilderRule): string => {
    const { field, operator, value } = rule;

    // Handle array operators
    if (operator === '$in' || operator === '$nin') {
      const values = value.split(',').map((v) => {
        const trimmed = v.trim();
        const num = Number(trimmed);
        return isNaN(num) ? `"${trimmed}"` : num;
      });
      return `{ "${field}": { "${operator}": [${values.join(', ')}] } }`;
    }

    // Handle regex
    if (operator === '$regex') {
      return `{ "${field}": { "${operator}": "${value}" } }`;
    }

    // Handle boolean values
    if (value === 'true' || value === 'false') {
      return `{ "${field}": { "${operator}": ${value} } }`;
    }

    // Handle numeric values
    const numValue = Number(value);
    if (!isNaN(numValue) && value !== '') {
      return `{ "${field}": { "${operator}": ${numValue} } }`;
    }

    // Handle string values
    return `{ "${field}": { "${operator}": "${value}" } }`;
  };

  const generatedExpression = computed(() => {
    const validRules = builderRules.value.filter((r) => r.field && r.value);

    if (validRules.length === 0) {
      return '{}';
    }

    if (validRules.length === 1) {
      return buildRuleExpression(validRules[0]);
    }

    // Multiple rules with logical operator
    const ruleExpressions = validRules.map((rule) => {
      const expr = buildRuleExpression(rule);
      try {
        return JSON.parse(expr);
      } catch {
        return expr;
      }
    });

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
