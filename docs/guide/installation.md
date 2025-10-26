---
title: Installation
description: How to install @mcabreradev/filter in your project
---

# Installation

## Package Manager

Install the package using your preferred package manager:

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
- **TypeScript:** >= 5.0 (optional, but recommended)

## Verify Installation

After installation, verify it works:

```typescript
import { filter } from '@mcabreradev/filter';

const data = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
];

const result = filter(data, { age: 30 });
console.log(result); // [{ name: 'Alice', age: 30 }]
```

## TypeScript Configuration

For optimal TypeScript support, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "target": "ES2022",
    "module": "ES2022"
  }
}
```

## Framework-Specific Setup

### React

No additional setup required. Import and use:

```typescript
import { useFilter } from '@mcabreradev/filter';
```

### Vue

No additional setup required. Import and use:

```typescript
import { useFilter } from '@mcabreradev/filter';
```

### Svelte

No additional setup required. Import and use:

```typescript
import { useFilter } from '@mcabreradev/filter';
```

## CDN Usage

For quick prototyping, you can use a CDN:

```html
<script type="module">
  import { filter } from 'https://esm.sh/@mcabreradev/filter';

  const data = [{ name: 'Alice' }, { name: 'Bob' }];
  const result = filter(data, 'Alice');
  console.log(result);
</script>
```

## Next Steps

- [Quick Start](/guide/quick-start) - Start filtering in minutes
- [Operators Guide](/guide/operators) - Learn all available operators
- [Framework Integration](/frameworks/overview) - Integrate with your framework

## Troubleshooting

### Module Resolution Issues

If you encounter module resolution issues, ensure your bundler supports ESM:

**Vite:**
```javascript
// vite.config.js
export default {
  resolve: {
    alias: {
      '@mcabreradev/filter': '@mcabreradev/filter/build/index.js'
    }
  }
}
```

**Webpack:**
```javascript
// webpack.config.js
module.exports = {
  resolve: {
    extensions: ['.js', '.ts'],
    mainFields: ['module', 'main']
  }
}
```

### TypeScript Errors

If you see TypeScript errors, ensure you have the latest version:

```bash
npm install -D typescript@latest
```

### Peer Dependency Warnings

The library has optional peer dependencies for framework integrations. These warnings are safe to ignore if you're not using those frameworks:

```
WARN  Optional peer dependency not installed: react
```

To suppress these warnings, you can install only the framework you're using:

```bash
# For React
npm install react

# For Vue
npm install vue

# For Svelte
npm install svelte
```

