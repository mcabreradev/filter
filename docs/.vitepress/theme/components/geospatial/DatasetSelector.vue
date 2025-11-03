<script setup lang="ts">
interface Props {
  datasets: Record<string, any>;
  selected: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  change: [datasetId: string];
}>();

// Dataset options
const datasetOptions = Object.entries(props.datasets).map(([id, config]) => ({
  id,
  name: config.name,
  description: config.description,
  count: config.items.length
}));
</script>

<template>
  <div class="dataset-selector">
    <label for="dataset">📦 Dataset:</label>
    <select
      id="dataset"
      :value="selected"
      @change="emit('change', ($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="dataset in datasetOptions"
        :key="dataset.id"
        :value="dataset.id"
      >
        {{ dataset.name }} ({{ dataset.count }} items)
      </option>
    </select>
  </div>
</template>

<style scoped>
.dataset-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.dataset-selector label {
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}

.dataset-selector select {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  cursor: pointer;
}

.dataset-selector select:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}
</style>
