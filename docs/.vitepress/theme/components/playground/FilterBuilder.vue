<template>
  <div class="filter-builder">
    <div class="builder-header">
      <span>Visual Filter Builder</span>
      <div class="builder-header-controls">
        <select :value="selectedDataset" @change="handleDatasetChange" class="dataset-selector">
          <option v-for="dataset in datasets" :key="dataset.id" :value="dataset.id">
            Dataset: {{ dataset.name }}
          </option>
        </select>
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
          
          <button @click="$emit('remove-rule', index)" class="btn-remove" :disabled="builderRules.length === 1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="builder-actions">
        <button @click="$emit('add-rule')" class="btn-add">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Rule
        </button>
        
        <select :value="logicalOperator" @change="handleLogicalOperatorChange" class="logical-operator" v-if="builderRules.length > 1">
          <option value="$and">AND (all must match)</option>
          <option value="$or">OR (any can match)</option>
        </select>
        
        <button @click="$emit('clear-builder')" class="btn-clear">Clear All</button>
        <button @click="$emit('apply-filter')" class="btn-apply">Apply to Code</button>
      </div>
      
      <div class="builder-preview">
        <div class="preview-header">Generated Filter Expression:</div>
        <pre class="preview-code">{{ generatedExpression }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Dataset, BuilderRule, OperatorOption } from './types';

interface Props {
  datasets: Dataset[];
  builderRules: BuilderRule[];
  logicalOperator: string;
  generatedExpression: string;
  availableFields: string[];
  selectedDataset: string;
  getOperatorsForField: (field: string) => OperatorOption[];
  getInputTypeForOperator: (operator: string) => string;
  getPlaceholderForOperator: (operator: string) => string;
}

interface Emits {
  (e: 'dataset-changed', value: string): void;
  (e: 'remove-rule', index: number): void;
  (e: 'add-rule'): void;
  (e: 'update:logicalOperator', value: string): void;
  (e: 'clear-builder'): void;
  (e: 'apply-filter'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const logicalOp = ref(props.logicalOperator);

const handleDatasetChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('dataset-changed', target.value);
};

const handleLogicalOperatorChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:logicalOperator', target.value);
};

watch(() => props.logicalOperator, (newVal) => {
  logicalOp.value = newVal;
});
</script>

<style scoped>
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

@media (max-width: 768px) {
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
</style>
