# Playground Components

This directory contains the refactored Interactive Playground components for the @mcabreradev/filter documentation.

## Structure

```
playground/
├── components/
│   ├── PlaygroundHeader.vue    # Header with example selector and builder toggle
│   ├── FilterBuilder.vue        # Visual filter builder UI
│   ├── CodeEditor.vue           # Code editor with syntax highlighting
│   ├── OutputPanel.vue          # Output display panel
│   └── Playground.vue           # Main container component
├── composables/
│   ├── useCodeEditor.ts         # Code editing and execution logic
│   ├── useFilterBuilder.ts      # Filter builder state management
│   ├── useCodeAnalysis.ts       # Code analysis and field extraction
│   ├── useEditorResize.ts       # Editor auto-resize functionality
│   └── useDebounce.ts           # Debounced execution utilities
├── data/
│   ├── examples.ts              # Code examples for the playground
│   └── datasets.ts              # Sample datasets for testing
├── types.ts                     # TypeScript type definitions
├── index.ts                     # Public exports
└── README.md                    # This file
```

## Components

### Playground.vue
Main container component that orchestrates all child components and manages the overall state.

**Props:** None (self-contained)

**Features:**
- Example selection and loading
- Dataset switching
- Filter builder integration
- Code execution with debouncing
- Output display

### PlaygroundHeader.vue
Header section with controls for example selection and builder toggle.

**Props:**
- `examples: Example[]` - List of available examples
- `showBuilder: boolean` - Whether builder is visible
- `initialExample?: string` - Initial example ID

**Emits:**
- `toggle-builder` - Toggle filter builder visibility
- `example-changed(exampleId: string)` - Example selection changed

### FilterBuilder.vue
Visual filter builder for constructing filter expressions.

**Props:**
- `datasets: Dataset[]` - Available datasets
- `builderRules: BuilderRule[]` - Current filter rules
- `logicalOperator: string` - AND/OR operator
- `generatedExpression: string` - Generated filter expression
- `availableFields: string[]` - Fields from current dataset
- `selectedDataset: string` - Currently selected dataset
- Various operator/input helper functions

**Emits:**
- `dataset-changed(datasetId: string)` - Dataset changed
- `remove-rule(index: number)` - Remove a rule
- `add-rule` - Add new rule
- `update:logicalOperator(value: string)` - Logical operator changed
- `clear-builder` - Clear all rules
- `apply-filter` - Apply filter to code

### CodeEditor.vue
Code editor with syntax highlighting and auto-resize.

**Props:**
- `code: string` - Current code content
- `highlightedCode: string` - Syntax-highlighted HTML

**Emits:**
- `update:code(value: string)` - Code content changed
- `code-input` - Code input event (for debouncing)

### OutputPanel.vue
Display panel for execution results or errors.

**Props:**
- `highlightedOutput: string` - Syntax-highlighted output
- `error: string` - Error message (if any)

## Composables

### useCodeEditor()
Manages code editing, syntax highlighting, and execution.

**Returns:**
- `code: Ref<string>` - Current code
- `highlightedCode: Ref<string>` - Highlighted code HTML
- `highlightedOutput: Ref<string>` - Highlighted output HTML
- `error: Ref<string>` - Error message
- `highlightCode()` - Highlight current code
- `executeCode(filterFn)` - Execute code with filter function
- `setCode(newCode)` - Set code content

### useFilterBuilder()
Manages filter builder state and expression generation.

**Returns:**
- `builderRules: Ref<BuilderRule[]>` - Current rules
- `logicalOperator: Ref<LogicalOperator>` - AND/OR operator
- `generatedExpression: ComputedRef<string>` - Generated expression
- `addRule()` - Add new rule
- `removeRule(index)` - Remove rule
- `clearBuilder()` - Clear all rules

### useCodeAnalysis()
Analyzes code to extract available fields and provide context-aware suggestions.

**Parameters:**
- `code: Ref<string>` - Code to analyze
- `datasetFields?: ComputedRef<string[]>` - Known dataset fields

**Returns:**
- `availableFields: ComputedRef<string[]>` - Available fields
- `fieldTypes: ComputedRef<FieldType>` - Field type mapping
- `getOperatorsForField(field)` - Get operators for field
- `getInputTypeForOperator(operator)` - Get input type
- `getPlaceholderForOperator(operator)` - Get placeholder text

### useEditorResize()
Provides auto-resize functionality for textarea elements.

**Returns:**
- `autoResize(textarea)` - Auto-resize textarea
- `syncScroll(event)` - Sync scroll between elements

### useDebouncedExecute()
Provides debounced execution utilities.

**Parameters:**
- `fn: Function` - Function to debounce
- `delay: number` - Debounce delay in ms

**Returns:**
- `debouncedExecute()` - Debounced function

## Data

### examples.ts
Contains code examples for the playground with various filter patterns:
- Basic filtering
- MongoDB-style operators
- Wildcard patterns
- Logical operators
- Geospatial queries
- Datetime filtering

### datasets.ts
Sample datasets for testing filters:
- Users dataset
- Products dataset
- Events dataset
- And more...

## Usage

Import the main Playground component:

```typescript
import { Playground } from './components/playground';
```

Or import individual components:

```typescript
import {
  PlaygroundHeader,
  FilterBuilder,
  CodeEditor,
  OutputPanel
} from './components/playground';
```

## Type Definitions

All TypeScript interfaces are defined in `types.ts`:
- `Example` - Code example structure
- `Dataset` - Dataset structure
- `BuilderRule` - Filter builder rule
- `OperatorOption` - Operator option for UI
- `FieldType` - Field type mapping

## Contributing

When adding new components or features:

1. Place components in the root playground directory
2. Add composables to `composables/`
3. Add data files to `data/`
4. Export public APIs from `index.ts`
5. Update type definitions in `types.ts`
6. Document changes in this README

## Notes

- All components use Vue 3 Composition API
- TypeScript strict mode is enabled
- Components are designed to be modular and reusable
- State management uses Vue reactivity system
- No external state management library needed
