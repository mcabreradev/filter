<template>
  <div class="playground-header">
    <span>Interactive Playground</span>
    <div class="header-controls">
      <button 
        @click="$emit('toggle-builder')" 
        class="builder-toggle"
        :class="{ active: showBuilder }"
        title="Toggle Filter Builder"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
      </button>
      <select v-model="selectedExample" @change="$emit('example-changed', selectedExample)" class="example-selector">
        <option v-for="example in examples" :key="example.id" :value="example.id">
          {{ example.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Example } from './data/examples';

interface Props {
  examples: Example[];
  showBuilder: boolean;
  initialExample?: string;
}

interface Emits {
  (e: 'toggle-builder'): void;
  (e: 'example-changed', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  initialExample: 'basic'
});

defineEmits<Emits>();

const selectedExample = ref(props.initialExample);

watch(() => props.initialExample, (newVal) => {
  selectedExample.value = newVal;
});
</script>

<style scoped>
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
</style>
