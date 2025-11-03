<template>
  <div class="playground-container">
    <PlaygroundHeader
      :examples="examples"
      :show-builder="showBuilder"
      :initial-example="selectedExample"
      @toggle-builder="handleToggleBuilder"
      @example-changed="handleExampleChanged"
    />

    <FilterBuilder
      v-if="showBuilder"
      :datasets="datasets"
      :builder-rules="builderRules"
      :logical-operator="logicalOperator"
      :generated-expression="generatedExpression"
      :available-fields="availableFields"
      :selected-dataset="selectedDataset"
      :get-operators-for-field="getOperatorsForField"
      :get-input-type-for-operator="getInputTypeForOperator"
      :get-placeholder-for-operator="getPlaceholderForOperator"
      @dataset-changed="handleDatasetChange"
      @remove-rule="removeRule"
      @add-rule="addRule"
      @update:logical-operator="handleLogicalOperatorUpdate"
      @clear-builder="clearBuilder"
      @apply-filter="handleApplyFilter"
    />

    <div class="playground-content">
      <CodeEditor
        :code="code"
        :highlighted-code="highlightedCode"
        @update:code="code = $event"
        @code-input="handleCodeInput"
      />
      
      <OutputPanel
        :highlighted-output="highlightedOutput"
        :error="error"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { filter } from '../../../../../src/index';

import PlaygroundHeader from './PlaygroundHeader.vue';
import FilterBuilder from './FilterBuilder.vue';
import CodeEditor from './CodeEditor.vue';
import OutputPanel from './OutputPanel.vue';

import { useCodeEditor } from './composables/useCodeEditor';
import { useFilterBuilder } from './composables/useFilterBuilder';
import { useCodeAnalysis } from './composables/useCodeAnalysis';
import { useDebouncedExecute } from './composables/useDebounce';

import { examples } from './data/examples';
import { datasets, getDatasetSampleFilter } from './data/datasets';

const showBuilder = ref(false);
const selectedExample = ref('basic');
const selectedDataset = ref('users');
const savedCode = ref('');

const { code, highlightedCode, highlightedOutput, error, highlightCode, executeCode, setCode } = useCodeEditor();

const {
  builderRules,
  logicalOperator,
  generatedExpression,
  addRule,
  removeRule,
  clearBuilder,
} = useFilterBuilder();

const currentDataset = computed(() => datasets.find((d) => d.id === selectedDataset.value));
const datasetFields = computed(() => currentDataset.value?.fields);

const {
  availableFields,
  getOperatorsForField,
  getInputTypeForOperator,
  getPlaceholderForOperator,
} = useCodeAnalysis(code, datasetFields);

const executeAndHighlight = (): void => {
  highlightCode();
  executeCode(filter);
};

const { debouncedExecute } = useDebouncedExecute(executeAndHighlight, 300);

const handleCodeInput = (): void => {
  debouncedExecute();
};

const handleLogicalOperatorUpdate = (value: string): void => {
  logicalOperator.value = value as any;
};

const handleToggleBuilder = (): void => {
  showBuilder.value = !showBuilder.value;
};

const handleExampleChanged = (exampleId: string): void => {
  selectedExample.value = exampleId;
  const example = examples.find((e) => e.id === exampleId);
  if (!example) return;

  setCode(example.code);
  executeCode(filter);

  const datasetMatch = example.code.match(/const\s+(\w+)\s*=/);
  if (datasetMatch) {
    const varName = datasetMatch[1];
    const dataset = datasets.find((d) => d.id === varName);
    if (dataset) {
      selectedDataset.value = dataset.id;
    }
  }
};

const handleDatasetChange = (datasetId: string): void => {
  selectedDataset.value = datasetId;
  const dataset = currentDataset.value;
  if (!dataset) return;

  const datasetVarMatch = dataset.code.match(/const\s+(\w+)\s*=/);
  const datasetVarName = datasetVarMatch?.[1] || 'data';
  const sampleFilter = getDatasetSampleFilter(dataset.id);

  const newCode = `import { filter } from '@mcabreradev/filter';

${dataset.code}

const result = filter(${datasetVarName}, ${sampleFilter});

console.log(result);`;

  setCode(newCode);
  executeCode(filter);
  clearBuilder();
};

const handleApplyFilter = (): void => {
  const expression = generatedExpression.value;
  
  const dataMatch = code.value.match(/const\s+(\w+)\s*=\s*\[[\s\S]*?\];/);
  
  if (!dataMatch) {
    error.value = 'No data array found in code';
    return;
  }

  const dataName = dataMatch[1];
  const newFilterCode = `const result = filter(${dataName}, ${expression});`;

  const filterCallPattern = /const\s+result\s*=\s*filter\([^;]*\);/s;
  
  if (filterCallPattern.test(code.value)) {
    code.value = code.value.replace(filterCallPattern, newFilterCode);
  } else {
    const lines = code.value.split('\n');
    const consoleIndex = lines.findIndex((l) => l.trim().startsWith('console.log'));
    
    if (consoleIndex > 0) {
      lines.splice(consoleIndex, 0, '', newFilterCode);
      code.value = lines.join('\n');
    } else {
      code.value += `\n\n${newFilterCode}\n\nconsole.log(result);`;
    }
  }

  highlightCode();
  executeCode(filter);
};

watch(availableFields, (currentFields) => {
  builderRules.value = builderRules.value.map((rule) =>
    rule.field && !currentFields.includes(rule.field)
      ? { field: '', operator: '$eq', value: '' }
      : rule
  );
});

watch(showBuilder, (isBuilderOpen) => {
  if (isBuilderOpen) {
    savedCode.value = code.value;
    clearBuilder();
    
    const dataset = currentDataset.value;
    if (!dataset) return;

    const datasetVarMatch = dataset.code.match(/const\s+(\w+)\s*=/);
    const datasetVarName = datasetVarMatch?.[1] || 'data';

    const emptyFilterCode = `import { filter } from '@mcabreradev/filter';

${dataset.code}

const result = filter(${datasetVarName}, {});

console.log(result);`;

    setCode(emptyFilterCode);
    error.value = '';
  } else {
    clearBuilder();
    
    if (savedCode.value) {
      setCode(savedCode.value);
      executeCode(filter);
    }
  }
});

onMounted(() => {
  handleExampleChanged(selectedExample.value);
});
</script>

<style scoped>
.playground-container {
  margin: 2rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.playground-content {
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

@media (max-width: 768px) {
  .playground-content {
    flex-direction: column;
  }
}
</style>
