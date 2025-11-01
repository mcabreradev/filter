<template>
  <div class="playground-container">
    <div class="playground-header">
      <span>Interactive Playground</span>
      <div class="header-controls">
        <button 
          @click="showBuilder = !showBuilder" 
          class="builder-toggle"
          :class="{ active: showBuilder }"
          title="Toggle Filter Builder"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
        <select v-model="selectedExample" @change="handleLoadExample" class="example-selector">
          <option v-for="example in examples" :key="example.id" :value="example.id">
            {{ example.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Filter Builder -->
    <div v-if="showBuilder" class="filter-builder">
      <div class="builder-header">
        <span>Visual Filter Builder</span>
        <div class="builder-header-controls">
          <select v-model="selectedDataset" @change="handleDatasetChange" class="dataset-selector">
            <option v-for="dataset in datasets" :key="dataset.id" :value="dataset.id">
              Dataset: {{ dataset.name }}
            </option>
          </select>
          <button @click="handleApplyFilter" class="btn-apply">Apply to Code</button>
        </div>
      </div>
      <div class="builder-content">
        <div class="builder-rules">
          <div v-for="(rule, index) in builderRules" :key="index" class="rule-row">
            <select v-model="rule.field" class="rule-field">
              <option value="">Select field...</option>
              <option v-for="field in availableFields" :key="field" :value="field">
                {{ field }}
              </option>
            </select>
            
            <select v-model="rule.operator" class="rule-operator">
              <option v-for="op in getOperatorsForField(rule.field)" :key="op.value" :value="op.value">
                {{ op.label }}
              </option>
            </select>
            
            <input 
              v-model="rule.value" 
              :type="getInputTypeForOperator(rule.operator)"
              :placeholder="getPlaceholderForOperator(rule.operator)"
              class="rule-value"
            />
            
            <button @click="removeRule(index)" class="btn-remove" :disabled="builderRules.length === 1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="builder-actions">
          <button @click="addRule" class="btn-add">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Rule
          </button>
          
          <select v-model="logicalOperator" class="logical-operator" v-if="builderRules.length > 1">
            <option value="$and">AND (all must match)</option>
            <option value="$or">OR (any can match)</option>
          </select>
          
          <button @click="clearBuilder" class="btn-clear">Clear All</button>
        </div>
        
        <div class="builder-preview">
          <div class="preview-header">Generated Filter Expression:</div>
          <pre class="preview-code">{{ generatedExpression }}</pre>
        </div>
      </div>
    </div>

    <!-- Code Editor and Output -->
    <div class="playground-content">
      <div class="editor-section">
        <div class="editor-header">Code</div>
        <div class="editor-wrapper">
          <pre class="code-highlight" v-html="highlightedCode"></pre>
          <textarea
            v-model="code"
            class="code-editor"
            spellcheck="false"
            @input="handleCodeInput"
            @scroll="syncScroll"
          ></textarea>
        </div>
      </div>
      <div class="output-section">
        <div class="output-header">Output</div>
        <pre v-if="!error" class="output-content" v-html="highlightedOutput"></pre>
        <pre v-else class="error-content">{{ error }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { filter } from '../../../../src/index';

import { useCodeEditor } from '../composables/useCodeEditor';
import { useFilterBuilder } from '../composables/useFilterBuilder';
import { useCodeAnalysis } from '../composables/useCodeAnalysis';
import { useEditorResize } from '../composables/useEditorResize';
import { useDebouncedExecute } from '../composables/useDebounce';

import { examples } from '../data/examples';
import { datasets, getDatasetSampleFilter } from '../data/datasets';

const showBuilder = ref(false);
const selectedExample = ref('basic');
const selectedDataset = ref('users');
const savedCode = ref('');

const { code, highlightedCode, highlightedOutput, output, error, highlightCode, executeCode, setCode } = useCodeEditor();

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
  fieldTypes,
  getOperatorsForField,
  getInputTypeForOperator,
  getPlaceholderForOperator,
} = useCodeAnalysis(code, datasetFields);

const { autoResize, syncScroll } = useEditorResize();

const executeAndHighlight = (): void => {
  highlightCode();
  executeCode(filter);
};

const { debouncedExecute } = useDebouncedExecute(executeAndHighlight, 300);

const handleCodeInput = (): void => {
  const textarea = document.querySelector('.code-editor') as HTMLTextAreaElement;
  if (textarea) autoResize(textarea);
  debouncedExecute();
};

const handleLoadExample = (): void => {
  const example = examples.find((e) => e.id === selectedExample.value);
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

  nextTick(() => {
    const textarea = document.querySelector('.code-editor') as HTMLTextAreaElement;
    if (textarea) autoResize(textarea);
  });
};

const handleDatasetChange = (): void => {
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

  nextTick(() => {
    const textarea = document.querySelector('.code-editor') as HTMLTextAreaElement;
    if (textarea) autoResize(textarea);
  });
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

  if (code.value.includes('filter(')) {
    code.value = code.value.replace(
      /const result = filter\([^)]+(?:,\s*[\s\S]*?)?\);/,
      newFilterCode
    );
  } else {
    const lines = code.value.split('\n');
    const consoleIndex = lines.findIndex((l) => l.includes('console.log'));
    if (consoleIndex > 0) {
      lines.splice(consoleIndex, 0, '', newFilterCode);
      code.value = lines.join('\n');
    }
  }

  highlightCode();
  executeCode(filter);

  nextTick(() => {
    const textarea = document.querySelector('.code-editor') as HTMLTextAreaElement;
    if (textarea) autoResize(textarea);
  });
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
    output.value = '[]';
    highlightedOutput.value = '[]';
    error.value = '';
    
    nextTick(() => {
      const textarea = document.querySelector('.code-editor') as HTMLTextAreaElement;
      if (textarea) autoResize(textarea);
    });
  } else {
    clearBuilder();
    
    if (savedCode.value) {
      setCode(savedCode.value);
      executeCode(filter);
      
      nextTick(() => {
        const textarea = document.querySelector('.code-editor') as HTMLTextAreaElement;
        if (textarea) autoResize(textarea);
      });
    }
  }
});

onMounted(() => {
  handleLoadExample();
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

.playground-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--vp-c-bg-soft);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.builder-toggle {
  padding: 0.5rem;
  background: var(--vp-code-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.builder-toggle:hover,
.builder-toggle.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.builder-toggle svg {
  stroke: var(--vp-code-color);
}

.builder-toggle:hover svg,
.builder-toggle.active svg {
  stroke: white;
}

.example-selector {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.example-selector:hover {
  border-color: var(--vp-c-brand-1);
}

.example-selector:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

/* Filter Builder Styles */
.filter-builder {
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.builder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
}

.builder-header-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dataset-selector {
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
  cursor: pointer;
  transition: border-color 0.2s;
  font-family: var(--vp-font-family-mono);
}

.dataset-selector:hover {
  border-color: var(--vp-c-brand-1);
}

.dataset-selector:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.btn-apply {
  padding: 0.4rem 1rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-apply:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.builder-content {
  padding: 1rem;
}

.builder-rules {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.rule-row {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 2fr auto;
  gap: 0.5rem;
  align-items: center;
}

.rule-field,
.rule-operator,
.rule-value,
.logical-operator {
  padding: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  font-family: var(--vp-font-family-mono);
}

.rule-field:focus,
.rule-operator:focus,
.rule-value:focus,
.logical-operator:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.btn-remove {
  padding: 0.5rem;
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover:not(:disabled) {
  background: var(--vp-custom-block-danger-bg);
  border-color: var(--vp-custom-block-danger-border);
}

.btn-remove:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-remove svg {
  stroke: var(--vp-c-text-2);
}

.btn-remove:hover:not(:disabled) svg {
  stroke: var(--vp-custom-block-danger-text);
}

.builder-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.btn-add,
.btn-clear {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-add:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.btn-clear:hover {
  background: var(--vp-custom-block-danger-bg);
  border-color: var(--vp-custom-block-danger-border);
  color: var(--vp-custom-block-danger-text);
}

.logical-operator {
  flex: 1;
  max-width: 250px;
}

.builder-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}

.preview-header {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.preview-code {
  padding: 1rem;
  background: var(--vp-code-bg);
  border-radius: 4px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-code-color);
  margin: 0;
  overflow-x: auto;
}

.playground-content {
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.editor-section,
.output-section {
  min-height: 300px;
}

.editor-section {
  border-bottom: 1px solid var(--vp-c-divider);
}

.editor-header,
.output-header {
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-2);
}

.editor-wrapper {
  position: relative;
  flex: 1;
  overflow: visible;
  min-height: 200px;
}

.playground-content:not(.layout-horizontal) .editor-wrapper {
  min-height: fit-content;
  height: auto;
  overflow: visible;
}

.playground-content.layout-horizontal .editor-wrapper {
  overflow: hidden;
  max-height: 600px;
}

.code-highlight {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  background: var(--vp-code-bg);
  color: var(--vp-code-color);
  white-space: pre;
  overflow: auto;
  overflow-x: auto;
  overflow-y: auto;
  pointer-events: none;
  tab-size: 2;
}

.code-editor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  padding: 1rem;
  border: none;
  outline: none;
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  background: transparent;
  color: transparent;
  caret-color: var(--vp-code-color);
  resize: none;
  tab-size: 2;
  overflow: auto;
  overflow-x: auto;
  overflow-y: auto;
  white-space: pre;
  word-wrap: normal;
  -webkit-text-fill-color: transparent;
}

.code-editor::selection {
  background: rgba(255, 255, 255, 0.2);
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.code-editor::-moz-selection {
  background: rgba(255, 255, 255, 0.2);
  color: transparent;
}

.code-editor:focus {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
}

.output-content,
.error-content {
  flex: 1;
  padding: 1rem;
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.output-content {
  background: var(--vp-code-bg);
  color: var(--vp-code-color);
}

.error-content {
  color: var(--vp-custom-block-danger-text);
  background: var(--vp-custom-block-danger-bg);
  border-left: 4px solid var(--vp-custom-block-danger-border);
}

@media (max-width: 768px) {
  .playground-content,
  .playground-content.layout-horizontal {
    flex-direction: column;
  }

  .playground-content.layout-horizontal .editor-section {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .rule-row {
    grid-template-columns: 1fr;
  }

  .btn-remove {
    justify-self: end;
  }

  .builder-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .builder-header-controls {
    width: 100%;
    flex-direction: column;
  }

  .dataset-selector {
    width: 100%;
  }
}

.code-editor::-webkit-scrollbar,
.code-highlight::-webkit-scrollbar,
.output-content::-webkit-scrollbar,
.preview-code::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.code-editor::-webkit-scrollbar-track,
.code-highlight::-webkit-scrollbar-track,
.output-content::-webkit-scrollbar-track,
.preview-code::-webkit-scrollbar-track {
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.code-editor::-webkit-scrollbar-thumb,
.code-highlight::-webkit-scrollbar-thumb,
.output-content::-webkit-scrollbar-thumb,
.preview-code::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 4px;
}

.code-editor::-webkit-scrollbar-thumb:hover,
.code-highlight::-webkit-scrollbar-thumb:hover,
.output-content::-webkit-scrollbar-thumb:hover,
.preview-code::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

.code-highlight :deep(.token-keyword) {
  color: #c792ea;
  font-weight: bold;
}

.code-highlight :deep(.token-string) {
  color: #c3e88d;
}

.code-highlight :deep(.token-number) {
  color: #f78c6c;
}

.code-highlight :deep(.token-comment) {
  color: #676e95;
  font-style: italic;
}

.code-highlight :deep(.token-function) {
  color: #82aaff;
}

.code-highlight :deep(.token-property) {
  color: #89ddff;
}

.output-content :deep(.token-keyword) {
  color: #c792ea;
  font-weight: 600;
}

.output-content :deep(.token-string) {
  color: #c3e88d;
}

.output-content :deep(.token-number) {
  color: #f78c6c;
}

.output-content :deep(.token-property) {
  color: #89ddff;
}
</style>
