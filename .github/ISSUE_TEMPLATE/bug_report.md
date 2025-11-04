---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description

A clear and concise description of what the bug is.

## To Reproduce

Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Code Example

```typescript
// Minimal code to reproduce the issue
import { filter } from '@mcabreradev/filter';

const data = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
];

const result = filter(data, { age: { $gte: 18 } });
console.log(result);
```

## Expected Behavior

A clear and concise description of what you expected to happen.

## Actual Behavior

A clear and concise description of what actually happened.

## Error Messages

```
If applicable, paste any error messages here
```

## Environment

- **@mcabreradev/filter version:** [e.g. 5.6.1]
- **Node.js version:** [e.g. 20.0.0]
- **TypeScript version:** [e.g. 5.0.0]
- **Package manager:** [e.g. npm 10.0.0, yarn 1.22.0, pnpm 8.0.0]
- **Operating System:** [e.g. macOS 14.0, Ubuntu 22.04, Windows 11]

## Additional Context

Add any other context about the problem here (screenshots, related issues, etc.)

## Checklist

- [ ] I have searched existing issues to ensure this is not a duplicate
- [ ] I have provided a minimal code example to reproduce the issue
- [ ] I have included my environment information
- [ ] I am using the latest version of @mcabreradev/filter
