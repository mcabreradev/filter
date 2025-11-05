---
title: Installation
description: Install and configure @mcabreradev/filter
---

# Installation

Learn how to install and configure `@mcabreradev/filter` for your project.

## Package Managers

Install using your preferred package manager:

::: code-group

```bash [npm]
npm install @mcabreradev/filter
```

```bash [yarn]
yarn add @mcabreradev/filter
```

```bash [pnpm]
pnpm add @mcabreradev/filter
```

```bash [bun]
bun add @mcabreradev/filter
```

:::

## Requirements

- **Node.js:** >= 20
- **TypeScript:** >= 5.0 (optional)
- **Zero dependencies** - Truly dependency-free!

::: tip Optional Validation
If you need runtime validation features (like `validateExpression` or `validateOptions`), install Zod as a peer dependency:

```bash
npm install zod
```

The core filtering functionality works without any dependencies.
:::

## Import Styles

@mcabreradev/filter supports two import styles:

### Classic Import (All Features)

Import everything from the main package:

```typescript
import { filter, useFilter, filterLazy } from '@mcabreradev/filter';

const results = filter(users, { active: true });
```

**Bundle size:** ~12 KB (gzipped)

**Best for:**
- Getting started quickly
- Small applications
- Prototyping
- Development

### Modular Import (Production Recommended)

Import only what you need for optimal bundle size:

```typescript
// Core filtering
import { filter } from '@mcabreradev/filter/core';

// React hooks
import { useFilter } from '@mcabreradev/filter/react';

// Vue composables
import { useFilter } from '@mcabreradev/filter/vue';

// Svelte stores
import { useFilter } from '@mcabreradev/filter/svelte';

// Lazy evaluation
import { filterLazy } from '@mcabreradev/filter/lazy';

// Operators
import { applyComparisonOperators } from '@mcabreradev/filter/operators/comparison';
```

**Bundle size:** ~3-5 KB (gzipped) - **50-70% smaller!**

**Best for:**
- Production applications
- Bundle size optimization
- Tree-shaking support
- Specific feature usage

::: tip Recommendation
Use **classic imports** for development and prototyping, then switch to **modular imports** for production to optimize bundle size.
:::

## TypeScript Setup

Add to your `tsconfig.json` for optimal type support:

```json
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## Framework-Specific Setup

### React

```typescript
// Classic import
import { useFilter } from '@mcabreradev/filter';

// Modular import (recommended)
import { useFilter } from '@mcabreradev/filter/react';

function UserList() {
  const { filtered, isFiltering } = useFilter(users, { active: true });
  return <div>{/* ... */}</div>;
}
```

### Vue 3

```typescript
// Classic import
import { useFilter } from '@mcabreradev/filter';

// Modular import (recommended)
import { useFilter } from '@mcabreradev/filter/vue';

const searchTerm = ref('');
const { filtered, isFiltering } = useFilter(users, searchTerm);
```

### Svelte

```typescript
// Classic import
import { useFilter } from '@mcabreradev/filter';

// Modular import (recommended)
import { useFilter } from '@mcabreradev/filter/svelte';

const searchTerm = writable('');
const { filtered, isFiltering } = useFilter(users, searchTerm);
```

## CDN Usage

For quick prototyping without a build step:

```html
<script type="module">
  import { filter } from 'https://esm.sh/@mcabreradev/filter';
  
  const users = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 }
  ];
  
  const adults = filter(users, { age: { $gte: 18 } });
  console.log(adults);
</script>
```

## Deno

```typescript
import { filter } from 'npm:@mcabreradev/filter';

const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
];

const adults = filter(users, { age: { $gte: 18 } });
console.log(adults);
```

## Browser Support

Works in all modern browsers:

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Node.js >= 20
- ✅ Deno
- ✅ Bun

## Bundle Size

| Import Strategy | Size (gzipped) | Use Case |
|----------------|----------------|----------|
| `import { ... } from '@mcabreradev/filter'` | ~12 KB | Quick start, prototypes |
| `import { filter } from '@mcabreradev/filter/core'` | ~3 KB | Production apps |
| `import { useFilter } from '@mcabreradev/filter/react'` | ~3 KB | React apps |
| `import { filterLazy } from '@mcabreradev/filter/lazy'` | ~2 KB | Large datasets |

See [Modular Imports](/guide/modular-imports) for detailed bundle optimization strategies.

## Verification

Verify your installation works:

```typescript
import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
];

const adults = filter(users, { age: { $gte: 18 } });
console.log(adults); // [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]
```

## Next Steps

- [Quick Start](/guide/quick-start) - Get started in minutes
- [Modular Imports](/guide/modular-imports) - Optimize bundle size
- [Basic Filtering](/guide/basic-filtering) - Learn core concepts
- [Framework Integrations](/frameworks/) - React, Vue, Svelte guides

## Troubleshooting

### Module not found

If you see module resolution errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors

Ensure your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "esModuleInterop": true
  }
}
```

### Import path errors

For modular imports, ensure you're using the exact paths:

```typescript
// ✅ Correct
import { filter } from '@mcabreradev/filter/core';

// ❌ Wrong
import { filter } from '@mcabreradev/filter/core/index';
```

## Support

Need help? Check out:

- [FAQ](/guide/faq) - Common questions
- [Troubleshooting](/guide/troubleshooting) - Common issues
- [GitHub Issues](https://github.com/mcabreradev/filter/issues) - Report bugs
- [GitHub Discussions](https://github.com/mcabreradev/filter/discussions) - Ask questions
