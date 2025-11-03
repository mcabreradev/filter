<template>
  <div class="output-section">
    <div class="output-header">Output</div>
    <pre v-if="!error" class="output-content" v-html="highlightedOutput"></pre>
    <pre v-else class="error-content">{{ error }}</pre>
  </div>
</template>

<script setup lang="ts">
interface Props {
  highlightedOutput: string;
  error: string;
}

defineProps<Props>();
</script>

<style scoped>
.output-section {
  min-height: 300px;
}

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

.output-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.output-content::-webkit-scrollbar-track {
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.output-content::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 4px;
}

.output-content::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
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
