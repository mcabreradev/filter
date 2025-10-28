<template>
  <div class="playground-container">
    <div class="playground-header">
      <span>Interactive Playground</span>
      <div class="header-controls">
        <button 
          @click="toggleBuilder" 
          class="builder-toggle"
          :class="{ active: showBuilder }"
          title="Toggle Filter Builder"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
        <button 
          @click="toggleLayout" 
          class="layout-toggle"
          :title="isVerticalLayout ? 'Switch to side-by-side' : 'Switch to stacked'"
        >
          <svg v-if="isVerticalLayout" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="18" rx="1"></rect>
            <rect x="14" y="3" width="7" height="18" rx="1"></rect>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="7" rx="1"></rect>
            <rect x="3" y="14" width="18" height="7" rx="1"></rect>
          </svg>
        </button>
        <select v-model="selectedExample" @change="loadExample" class="example-selector">
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
          <select v-model="selectedDataset" @change="changeDataset" class="dataset-selector">
            <option v-for="dataset in datasets" :key="dataset.id" :value="dataset.id">
              Dataset: {{ dataset.name }}
            </option>
          </select>
          <button @click="applyBuilderFilter" class="btn-apply">Apply to Code</button>
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

    <div class="playground-content" :class="{ 'layout-horizontal': !isVerticalLayout }">
      <div class="editor-section">
        <div class="editor-header">Code</div>
        <div class="editor-wrapper">
          <pre class="code-highlight" v-html="highlightedCode"></pre>
          <textarea
            v-model="code"
            class="code-editor"
            spellcheck="false"
            @input="debouncedExecute"
            @scroll="syncScroll"
          ></textarea>
        </div>
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
import { ref, computed, onMounted, watch } from 'vue';
import { filter } from '../../../../src/index';

interface Example {
  id: string;
  name: string;
  code: string;
}

interface BuilderRule {
  field: string;
  operator: string;
  value: string;
}

interface OperatorOption {
  value: string;
  label: string;
}

interface Dataset {
  id: string;
  name: string;
  code: string;
  fields: string[];
}

// Predefined datasets that users can select
const datasets: Dataset[] = [
  {
    id: 'users',
    name: 'Users',
    code: `const users = [
  { name: 'Alice', age: 30, city: 'Berlin' },
  { name: 'Bob', age: 25, city: 'London' },
  { name: 'Charlie', age: 35, city: 'Berlin' }
];`,
    fields: ['name', 'age', 'city']
  },
  {
    id: 'products',
    name: 'Products',
    code: `const products = [
  { name: 'Laptop', price: 1200, rating: 4.5, category: 'Electronics', inStock: true },
  { name: 'Mouse', price: 25, rating: 4.0, category: 'Electronics', inStock: true },
  { name: 'Monitor', price: 450, rating: 4.8, category: 'Electronics', inStock: false },
  { name: 'Desk', price: 300, rating: 4.2, category: 'Furniture', inStock: true }
];`,
    fields: ['name', 'price', 'rating', 'category', 'inStock']
  },
  {
    id: 'emails',
    name: 'Emails',
    code: `const emails = [
  { email: 'alice@example.com', verified: true, spam: false },
  { email: 'bob@test.com', verified: false, spam: false },
  { email: 'charlie@example.com', verified: true, spam: false },
  { email: 'spam@fake.com', verified: false, spam: true }
];`,
    fields: ['email', 'verified', 'spam']
  },
  {
    id: 'orders',
    name: 'Orders',
    code: `const orders = [
  { id: 1, amount: 1200, status: 'completed', customerId: 101 },
  { id: 2, amount: 450, status: 'pending', customerId: 102 },
  { id: 3, amount: 890, status: 'shipped', customerId: 101 },
  { id: 4, amount: 230, status: 'cancelled', customerId: 103 }
];`,
    fields: ['id', 'amount', 'status', 'customerId']
  },
  {
    id: 'employees',
    name: 'Employees',
    code: `const employees = [
  { name: 'Alice Johnson', department: 'Engineering', salary: 95000, level: 'Senior' },
  { name: 'Bob Smith', department: 'Marketing', salary: 65000, level: 'Mid' },
  { name: 'Charlie Brown', department: 'Engineering', salary: 110000, level: 'Staff' },
  { name: 'Diana Prince', department: 'Sales', salary: 75000, level: 'Senior' }
];`,
    fields: ['name', 'department', 'salary', 'level']
  }
];

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

// Operators by type - following MongoDB-style operators from the library
const operatorsByType = {
  string: [
    { value: '$eq', label: 'equals' },
    { value: '$ne', label: 'not equals' },
    { value: '$contains', label: 'contains' },
    { value: '$startsWith', label: 'starts with' },
    { value: '$endsWith', label: 'ends with' },
    { value: '$regex', label: 'matches regex' },
  ],
  number: [
    { value: '$eq', label: 'equals' },
    { value: '$ne', label: 'not equals' },
    { value: '$gt', label: 'greater than' },
    { value: '$gte', label: 'greater or equal' },
    { value: '$lt', label: 'less than' },
    { value: '$lte', label: 'less or equal' },
  ],
  boolean: [
    { value: '$eq', label: 'equals' },
    { value: '$ne', label: 'not equals' },
  ],
  array: [
    { value: '$in', label: 'in array' },
    { value: '$nin', label: 'not in array' },
  ],
};

const code = ref('');
const output = ref('');
const error = ref('');
const selectedExample = ref('basic');
const selectedDataset = ref('users');
const highlightedCode = ref('');
const isVerticalLayout = ref(true);
const showBuilder = ref(false);
const logicalOperator = ref<'$and' | '$or'>('$and');

const builderRules = ref<BuilderRule[]>([
  { field: '', operator: '$eq', value: '' }
]);

let debounceTimer: number | null = null;

/**
 * Dynamically extract available fields from the selected dataset
 */
const availableFields = computed(() => {
  const dataset = datasets.find(d => d.id === selectedDataset.value);
  if (dataset) {
    return dataset.fields;
  }
  
  // Fallback: extract from code
  try {
    const arrayMatch = code.value.match(/const\s+\w+\s*=\s*\[([\s\S]*?)\];/);
    if (!arrayMatch) return [];

    const arrayContent = arrayMatch[1];
    const firstObjectMatch = arrayContent.match(/\{([^}]+)\}/);
    if (!firstObjectMatch) return [];

    const objectContent = firstObjectMatch[1];
    const fieldMatches = objectContent.matchAll(/(\w+):/g);
    const fields = Array.from(fieldMatches, match => match[1]);
    
    return [...new Set(fields)];
  } catch (e) {
    console.error('Error extracting fields:', e);
    return [];
  }
});

/**
 * Infer field types from the selected dataset
 */
const fieldTypes = computed(() => {
  try {
    const types: Record<string, 'string' | 'number' | 'boolean'> = {};
    
    // Get the dataset code
    const dataset = datasets.find(d => d.id === selectedDataset.value);
    const codeToAnalyze = dataset ? dataset.code : code.value;
    
    const arrayMatch = codeToAnalyze.match(/const\s+\w+\s*=\s*\[([\s\S]*?)\];/);
    if (!arrayMatch) return types;

    const arrayContent = arrayMatch[1];
    const firstObjectMatch = arrayContent.match(/\{([^}]+)\}/);
    if (!firstObjectMatch) return types;

    const objectContent = firstObjectMatch[1];
    const fieldPattern = /(\w+):\s*([^,}]+)/g;
    let match;
    
    while ((match = fieldPattern.exec(objectContent)) !== null) {
      const [, fieldName, value] = match;
      const trimmedValue = value.trim();
      
      if (trimmedValue === 'true' || trimmedValue === 'false') {
        types[fieldName] = 'boolean';
      } else if (trimmedValue.startsWith("'") || trimmedValue.startsWith('"')) {
        types[fieldName] = 'string';
      } else if (!isNaN(Number(trimmedValue))) {
        types[fieldName] = 'number';
      } else {
        types[fieldName] = 'string';
      }
    }
    
    return types;
  } catch (e) {
    console.error('Error inferring types:', e);
    return {};
  }
});

const toggleLayout = () => {
  isVerticalLayout.value = !isVerticalLayout.value;
};

const toggleBuilder = () => {
  showBuilder.value = !showBuilder.value;
};

const changeDataset = () => {
  const dataset = datasets.find(d => d.id === selectedDataset.value);
  if (!dataset) return;
  
  // Extract variable name from dataset code
  const datasetVarMatch = dataset.code.match(/const\s+(\w+)\s*=/);
  const datasetVarName = datasetVarMatch ? datasetVarMatch[1] : 'data';
  
  // Generate appropriate sample filter expression based on dataset
  let sampleFilter = '{}';
  
  switch (dataset.id) {
    case 'users':
      sampleFilter = `{ city: 'Berlin' }`;
      break;
    case 'products':
      sampleFilter = `{
  price: { $gte: 100, $lte: 500 },
  inStock: true
}`;
      break;
    case 'emails':
      sampleFilter = `{ verified: true }`;
      break;
    case 'orders':
      sampleFilter = `{
  status: { $in: ['completed', 'shipped'] },
  amount: { $gte: 500 }
}`;
      break;
    case 'employees':
      sampleFilter = `{
  department: 'Engineering',
  salary: { $gte: 80000 }
}`;
      break;
    default:
      sampleFilter = '{}';
  }
  
  // Build new code with dataset-specific sample
  code.value = `import { filter } from '@mcabreradev/filter';

${dataset.code}

const result = filter(${datasetVarName}, ${sampleFilter});
console.log(result);`;
  
  // Reset builder rules when dataset changes
  builderRules.value = [{ field: '', operator: '$eq', value: '' }];
  
  highlightCode();
  executeCode();
  
  setTimeout(() => {
    if (isVerticalLayout.value) {
      const textarea = document.querySelector('.code-editor') as HTMLTextAreaElement;
      if (textarea) {
        autoResize(textarea);
      }
    }
  }, 50);
};

const getOperatorsForField = (field: string): OperatorOption[] => {
  if (!field) return operatorsByType.string;
  const type = fieldTypes.value[field] || 'string';
  return operatorsByType[type];
};

const getInputTypeForOperator = (operator: string): string => {
  if (operator === '$eq' || operator === '$ne') return 'text';
  if (operator.startsWith('$gt') || operator.startsWith('$lt')) return 'number';
  return 'text';
};

const getPlaceholderForOperator = (operator: string): string => {
  if (operator === '$in' || operator === '$nin') return 'value1, value2, value3';
  if (operator === '$regex') return '^pattern$';
  return 'Enter value...';
};

const addRule = () => {
  builderRules.value.push({ field: '', operator: '$eq', value: '' });
};

const removeRule = (index: number) => {
  if (builderRules.value.length > 1) {
    builderRules.value.splice(index, 1);
  }
};

const clearBuilder = () => {
  builderRules.value = [{ field: '', operator: '$eq', value: '' }];
  logicalOperator.value = '$and';
};

const generatedExpression = computed(() => {
  const validRules = builderRules.value.filter(r => r.field && r.value);
  
  if (validRules.length === 0) {
    return '{}';
  }
  
  if (validRules.length === 1) {
    const rule = validRules[0];
    return buildRuleExpression(rule);
  }
  
  // Multiple rules with logical operator
  const ruleExpressions = validRules.map(rule => {
    const expr = buildRuleExpression(rule);
    try {
      return JSON.parse(expr);
    } catch {
      return expr;
    }
  });
  
  const result = {
    [logicalOperator.value]: ruleExpressions
  };
  
  return JSON.stringify(result, null, 2);
});

const buildRuleExpression = (rule: BuilderRule): string => {
  const { field, operator, value } = rule;
  
  // Handle array operators
  if (operator === '$in' || operator === '$nin') {
    const values = value.split(',').map(v => {
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

const applyBuilderFilter = () => {
  const expression = generatedExpression.value;
  
  // Find the data array in the current code
  const dataMatch = code.value.match(/const\s+(\w+)\s*=\s*\[[\s\S]*?\];/);
  if (!dataMatch) {
    error.value = 'No data array found in code';
    return;
  }
  
  const dataName = dataMatch[1];
  
  // Generate new filter code
  const newFilterCode = `const result = filter(${dataName}, ${expression});`;
  
  // Replace existing filter call or append
  if (code.value.includes('filter(')) {
    code.value = code.value.replace(
      /const result = filter\([^)]+(?:,\s*[\s\S]*?)?\);/,
      newFilterCode
    );
  } else {
    const lines = code.value.split('\n');
    const consoleIndex = lines.findIndex(l => l.includes('console.log'));
    if (consoleIndex > 0) {
      lines.splice(consoleIndex, 0, '', newFilterCode);
      code.value = lines.join('\n');
    }
  }
  
  highlightCode();
  executeCode();
  
  // Auto-resize after applying
  setTimeout(() => {
    if (isVerticalLayout.value) {
      const textarea = document.querySelector('.code-editor') as HTMLTextAreaElement;
      if (textarea) {
        autoResize(textarea);
      }
    }
  }, 50);
};

// Watch for layout changes and adjust editor size
watch(isVerticalLayout, (newValue) => {
  setTimeout(() => {
    const textarea = document.querySelector('.code-editor') as HTMLTextAreaElement;
    if (textarea) {
      if (newValue) {
        // Switching to vertical - auto-resize
        autoResize(textarea);
      } else {
        // Switching to horizontal - reset wrapper height
        const wrapper = textarea.parentElement;
        if (wrapper) {
          wrapper.style.height = '';
        }
      }
    }
  }, 50);
});

// Watch for code changes to update available fields
watch(code, () => {
  const currentFields = availableFields.value;
  builderRules.value = builderRules.value.map(rule => {
    if (rule.field && !currentFields.includes(rule.field)) {
      return { field: '', operator: '$eq', value: '' };
    }
    return rule;
  });
});

const loadExample = () => {
  const example = examples.find(e => e.id === selectedExample.value);
  if (example) {
    code.value = example.code;
    
    // Try to detect which dataset this example uses
    const datasetMatch = example.code.match(/const\s+(\w+)\s*=/);
    if (datasetMatch) {
      const varName = datasetMatch[1];
      const dataset = datasets.find(d => d.id === varName);
      if (dataset) {
        selectedDataset.value = dataset.id;
      }
    }
    
    highlightCode();
    executeCode();
    
    // Auto-resize after loading example
    setTimeout(() => {
      if (isVerticalLayout.value) {
        const textarea = document.querySelector('.code-editor') as HTMLTextAreaElement;
        if (textarea) {
          autoResize(textarea);
        }
      }
    }, 50);
  }
};

const highlightCode = () => {
  let codeText = code.value;
  
  // Escape HTML first
  codeText = codeText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Apply syntax highlighting in specific order
  codeText = codeText
    // Comments first (to avoid matching keywords inside comments)
    .replace(/(\/\/.*$)/gm, '<span class="token-comment">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="token-comment">$1</span>')
    // Strings (including those with escaped quotes)
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span class="token-string">$1</span>')
    // Numbers
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="token-number">$1</span>')
    // Keywords
    .replace(/\b(import|from|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|true|false|null|undefined|typeof|instanceof|try|catch|finally|throw|async|await|export|default)\b/g, '<span class="token-keyword">$1</span>')
    // Function calls
    .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="token-function">$1</span>')
    // Object properties (after dot)
    .replace(/\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g, '.<span class="token-property">$1</span>');
  
  highlightedCode.value = codeText;
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
        const filter = arguments[1];
        ${code.value.replace(/import.*from.*['"];?\n?/g, '')}
      })
    `;

    const fn = eval(wrappedCode);
    fn(mockConsole, filter);

    output.value = logs.join('\n') || 'No output';
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
    output.value = '';
  }
};

const debouncedExecute = () => {
  // Auto-resize immediately on input in vertical layout
  if (isVerticalLayout.value) {
    const textarea = document.querySelector('.code-editor') as HTMLTextAreaElement;
    if (textarea) {
      autoResize(textarea);
    }
  }
  
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = window.setTimeout(() => {
    highlightCode();
    executeCode();
  }, 300);
};

const syncScroll = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  const highlight = textarea.previousElementSibling as HTMLPreElement;
  if (highlight) {
    highlight.scrollTop = textarea.scrollTop;
    highlight.scrollLeft = textarea.scrollLeft;
  }
  
  // Auto-resize in vertical layout
  if (isVerticalLayout.value) {
    autoResize(textarea);
  }
};

const autoResize = (textarea: HTMLTextAreaElement) => {
  const wrapper = textarea.parentElement;
  const highlight = textarea.previousElementSibling as HTMLPreElement;
  if (!wrapper || !highlight) return;
  
  // Temporarily set to auto to get true content height
  wrapper.style.height = 'auto';
  
  // Force a reflow to ensure highlight has updated
  setTimeout(() => {
    // Get the actual content height from the highlight element
    const scrollHeight = highlight.scrollHeight;
    const minHeight = 200;
    
    // Set height based on content with minimum bound (no maximum - grow infinitely)
    const newHeight = Math.max(minHeight, scrollHeight + 20);
    wrapper.style.height = `${newHeight}px`;
  }, 0);
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
  color: var(--vp-c-text-1);
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.builder-toggle,
.layout-toggle {
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
.layout-toggle:hover,
.builder-toggle.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.builder-toggle svg,
.layout-toggle svg {
  stroke: var(--vp-code-color);
}

.builder-toggle:hover svg,
.layout-toggle:hover svg,
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

.playground-content.layout-horizontal {
  flex-direction: row;
  max-height: 600px;
}

.playground-content.layout-horizontal .editor-section {
  flex: 1;
  border-right: 1px solid var(--vp-c-divider);
  border-bottom: none;
  min-height: 400px;
  max-height: 600px;
}

.playground-content.layout-horizontal .output-section {
  flex: 1;
  min-height: 400px;
  max-height: 600px;
}

.editor-section,
.output-section {
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

/* In vertical layout, allow sections to grow with content */
.playground-content:not(.layout-horizontal) .editor-section,
.playground-content:not(.layout-horizontal) .output-section {
  flex: 0 0 auto;
}

/* In horizontal layout, use flex: 1 to split evenly */
.playground-content.layout-horizontal .editor-section,
.playground-content.layout-horizontal .output-section {
  flex: 1;
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

/* In vertical layout, let the editor wrapper grow with content */
.playground-content:not(.layout-horizontal) .editor-wrapper {
  min-height: fit-content;
  height: auto;
  overflow: visible;
}

/* In horizontal layout, constrain height and enable scrolling */
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

/* Custom scrollbar styling for code editor and output */
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

/* Syntax Highlighting for Code Editor - VitePress Dark Theme */
.code-highlight :deep(.token-keyword) {
  color: #c792ea; /* Purple for keywords */
  font-weight: bold;
}

.code-highlight :deep(.token-string) {
  color: #c3e88d; /* Light green for strings */
}

.code-highlight :deep(.token-number) {
  color: #f78c6c; /* Orange for numbers */
}

.code-highlight :deep(.token-comment) {
  color: #676e95; /* Gray for comments */
  font-style: italic;
}

.code-highlight :deep(.token-function) {
  color: #82aaff; /* Light blue for functions */
}

.code-highlight :deep(.token-property) {
  color: #89ddff; /* Cyan for properties */
}
</style>

