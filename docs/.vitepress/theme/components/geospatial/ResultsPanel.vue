<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  data: any[];
  total: number;
  datasetConfig: any;
}

const props = defineProps<Props>();

// Calculate percentage
const percentage = computed(() => {
  if (props.total === 0) return 0;
  return ((props.data.length / props.total) * 100).toFixed(1);
});

// Get display fields from config
const displayFields = computed(() => {
  return props.datasetConfig.displayFields || ['name'];
});

// Format value for display
const formatValue = (value: any): string => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? '✓' : '✗';
  if (typeof value === 'number') return value.toLocaleString();
  if (Array.isArray(value)) return value.join(', ');
  if (value instanceof Date) return value.toLocaleDateString();
  return String(value);
};
</script>

<template>
  <div class="results-panel">
    <div class="results-header">
      <h4>📊 Filtered Results</h4>
      <div class="results-count">
        <span class="count">{{ data.length }}</span>
        <span class="total">/ {{ total }}</span>
        <span class="percentage">({{ percentage }}%)</span>
      </div>
    </div>

    <div v-if="data.length === 0" class="empty-state">
      <p>🔍 No items match the current filter</p>
      <p class="hint">Try adjusting the operator settings</p>
    </div>

    <div v-else class="results-list">
      <div
        v-for="(item, index) in data"
        :key="item.id || item.name || index"
        class="result-item"
      >
        <div class="item-header">
          <span class="item-number">#{{ index + 1 }}</span>
          <span class="item-name">{{ item.name }}</span>
        </div>

        <div class="item-details">
          <div
            v-for="field in displayFields.filter((f: string) => f !== 'name')"
            :key="field"
            class="detail"
          >
            <span class="detail-label">{{ field }}:</span>
            <span class="detail-value">
              {{ formatValue(item[field]) }}
            </span>
          </div>
        </div>

        <!-- Location info if available -->
        <div v-if="item.location" class="location-info">
          📍 {{ item.location.lat.toFixed(4) }}, {{ item.location.lng.toFixed(4) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results-panel {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.results-header h4 {
  margin: 0;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.results-count {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-weight: 500;
  flex-wrap: wrap;
}

.count {
  font-size: 1.5rem;
  color: var(--vp-c-brand);
  font-weight: 600;
}

.total {
  color: var(--vp-c-text-2);
}

.percentage {
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--vp-c-text-2);
}

.empty-state p {
  margin: 0.5rem 0;
}

.empty-state .hint {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s;
}

.result-item:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.item-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.item-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 1rem;
  word-break: break-word;
}

.item-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.detail {
  display: flex;
  gap: 0.25rem;
  font-size: 0.875rem;
  flex-wrap: wrap;
}

.detail-label {
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.detail-value {
  color: var(--vp-c-text-1);
  word-break: break-word;
}

.location-info {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-family: 'Monaco', 'Courier New', monospace;
  word-break: break-all;
}

@media (max-width: 768px) {
  .results-panel {
    padding: 1rem;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .results-count {
    width: 100%;
  }

  .results-list {
    max-height: 300px;
  }

  .result-item {
    padding: 0.875rem;
  }

  .item-header {
    gap: 0.5rem;
  }

  .item-name {
    font-size: 0.9375rem;
  }

  .item-details {
    gap: 0.75rem;
  }

  .detail {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .results-panel {
    padding: 0.75rem;
  }

  .results-header h4 {
    font-size: 0.9375rem;
  }

  .count {
    font-size: 1.25rem;
  }

  .results-list {
    max-height: 250px;
  }

  .result-item {
    padding: 0.75rem;
  }

  .item-name {
    font-size: 0.875rem;
  }

  .item-details {
    gap: 0.5rem;
  }

  .detail {
    font-size: 0.75rem;
  }
}
</style>
