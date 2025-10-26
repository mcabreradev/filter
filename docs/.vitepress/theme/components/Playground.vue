<template>
  <div class="playground-container">
    <div class="playground-header">
      <span>Interactive Playground</span>
      <select v-model="selectedExample" @change="loadExample" class="example-selector">
        <option v-for="example in examples" :key="example.id" :value="example.id">
          {{ example.name }}
        </option>
      </select>
    </div>
    <div class="playground-content">
      <div class="editor-section">
        <div class="editor-header">Code</div>
        <textarea
          v-model="code"
          class="code-editor"
          spellcheck="false"
          @input="debouncedExecute"
        ></textarea>
      </div>
      <div class="output-section">
        <div class="output-header">Output</div>
        <pre v-if="!error" class="output-content">{{ output }}</pre>
        <pre v-else class="error-content">{{ error }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Example {
  id: string;
  name: string;
  code: string;
}

const examples: Example[] = [
  {
    id: 'basic',
    name: 'Basic Filtering',
    code: `import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', age: 30, city: 'Berlin' },
  { name: 'Bob', age: 25, city: 'London' },
  { name: 'Charlie', age: 35, city: 'Berlin' }
];

const result = filter(users, { city: 'Berlin' });
console.log(result);`,
  },
  {
    id: 'operators',
    name: 'MongoDB Operators',
    code: `import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'Laptop', price: 1200, rating: 4.5 },
  { name: 'Mouse', price: 25, rating: 4.0 },
  { name: 'Monitor', price: 450, rating: 4.8 }
];

const result = filter(products, {
  price: { $gte: 100, $lte: 500 },
  rating: { $gte: 4.5 }
});
console.log(result);`,
  },
  {
    id: 'wildcards',
    name: 'Wildcard Patterns',
    code: `import { filter } from '@mcabreradev/filter';

const emails = [
  { email: 'alice@example.com', verified: true },
  { email: 'bob@test.com', verified: false },
  { email: 'charlie@example.com', verified: true }
];

const result = filter(emails, '%@example.com%');
console.log(result);`,
  },
  {
    id: 'logical',
    name: 'Logical Operators',
    code: `import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'Laptop', category: 'Electronics', price: 1200, inStock: true },
  { name: 'Desk', category: 'Furniture', price: 300, inStock: false },
  { name: 'Mouse', category: 'Electronics', price: 25, inStock: true }
];

const result = filter(products, {
  $and: [
    { inStock: true },
    { $or: [
      { category: 'Electronics' },
      { price: { $lt: 50 } }
    ]}
  ]
});
console.log(result);`,
  },
];

const code = ref('');
const output = ref('');
const error = ref('');
const selectedExample = ref('basic');

let debounceTimer: number | null = null;

const loadExample = () => {
  const example = examples.find(e => e.id === selectedExample.value);
  if (example) {
    code.value = example.code;
    executeCode();
  }
};

const executeCode = () => {
  try {
    error.value = '';
    const logs: string[] = [];

    const mockConsole = {
      log: (...args: unknown[]) => {
        logs.push(args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      }
    };

    const wrappedCode = `
      (function() {
        const console = arguments[0];
        ${code.value.replace(/import.*from.*['"];?\n?/g, '')}
      })
    `;

    const fn = eval(wrappedCode);
    fn(mockConsole);

    output.value = logs.join('\n') || 'No output';
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
    output.value = '';
  }
};

const debouncedExecute = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = window.setTimeout(() => {
    executeCode();
  }, 500);
};

onMounted(() => {
  loadExample();
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
}

.example-selector {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  cursor: pointer;
}

.playground-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 400px;
}

.editor-section,
.output-section {
  display: flex;
  flex-direction: column;
}

.editor-section {
  border-right: 1px solid var(--vp-c-divider);
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

.code-editor {
  flex: 1;
  padding: 1rem;
  border: none;
  outline: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  resize: none;
  tab-size: 2;
}

.output-content,
.error-content {
  flex: 1;
  padding: 1rem;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.output-content {
  color: var(--vp-c-text-1);
}

.error-content {
  color: #e0245e;
  background: rgba(224, 36, 94, 0.05);
}

@media (max-width: 768px) {
  .playground-content {
    grid-template-columns: 1fr;
  }

  .editor-section {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
  }
}
</style>

