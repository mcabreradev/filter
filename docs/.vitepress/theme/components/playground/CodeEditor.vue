<template>
  <div class="editor-section">
    <div class="editor-header">Code</div>
    <div class="editor-wrapper">
      <pre class="code-highlight" v-html="highlightedCode"></pre>
      <textarea
        ref="textareaRef"
        v-model="localCode"
        class="code-editor"
        spellcheck="false"
        @input="handleInput"
        @scroll="handleScroll"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';

interface Props {
  code: string;
  highlightedCode: string;
}

interface Emits {
  (e: 'update:code', value: string): void;
  (e: 'code-input'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const localCode = ref(props.code);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

watch(() => props.code, (newVal) => {
  localCode.value = newVal;
  nextTick(() => {
    if (textareaRef.value) {
      autoResize(textareaRef.value);
    }
  });
});

const handleInput = () => {
  emit('update:code', localCode.value);
  emit('code-input');
  if (textareaRef.value) {
    autoResize(textareaRef.value);
  }
};

const handleScroll = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  const highlight = target.previousElementSibling as HTMLElement;
  if (highlight) {
    highlight.scrollTop = target.scrollTop;
    highlight.scrollLeft = target.scrollLeft;
  }
};

const autoResize = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto';
  const scrollHeight = textarea.scrollHeight;
  textarea.style.height = `${Math.max(scrollHeight, 200)}px`;
  
  const wrapper = textarea.closest('.editor-wrapper') as HTMLElement;
  if (wrapper) {
    wrapper.style.height = `${Math.max(scrollHeight, 200)}px`;
  }
};

onMounted(() => {
  if (textareaRef.value) {
    autoResize(textareaRef.value);
  }
});
</script>

<style scoped>
.editor-section {
  border-bottom: 1px solid var(--vp-c-divider);
}

.editor-header {
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

.code-editor::-webkit-scrollbar,
.code-highlight::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.code-editor::-webkit-scrollbar-track,
.code-highlight::-webkit-scrollbar-track {
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.code-editor::-webkit-scrollbar-thumb,
.code-highlight::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 4px;
}

.code-editor::-webkit-scrollbar-thumb:hover,
.code-highlight::-webkit-scrollbar-thumb:hover {
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
</style>
