# Contributing Guide

Thank you for your interest in contributing to Filter! We welcome contributions from the community.

## Quick Links

- [GitHub Repository](https://github.com/mcabreradev/filter)
- [Issue Tracker](https://github.com/mcabreradev/filter/issues)
- [Pull Requests](https://github.com/mcabreradev/filter/pulls)

## Getting Started

### Prerequisites

- Node.js 20+ or 22+
- pnpm (recommended package manager)
- Git

### Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:
```bash
git clone https://github.com/YOUR_USERNAME/filter.git
cd filter
```

3. **Add upstream remote**:
```bash
git remote add upstream https://github.com/mcabreradev/filter.git
```

4. **Install dependencies**:
```bash
pnpm install
```

5. **Verify setup**:
```bash
pnpm test
pnpm build
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements

### 2. Make Changes

- Write clean, maintainable code
- Follow the project's coding standards
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
pnpm test

pnpm test:coverage

pnpm type-check
```

### 4. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add new operator for date comparison"
git commit -m "fix: resolve issue with nested object filtering"
git commit -m "docs: update installation guide"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub.

## Project Structure

```
filter/
├── src/
│   ├── core/              # Core filtering logic
│   ├── operators/         # Operator implementations
│   ├── comparison/        # Comparison utilities
│   ├── config/            # Configuration management
│   ├── integrations/      # Framework integrations
│   │   ├── react/         # React hooks and components
│   │   ├── vue/           # Vue composables
│   │   └── svelte/        # Svelte stores
│   ├── predicate/         # Predicate functions
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Utility functions
│   └── validation/        # Validation schemas
├── __test__/              # Test files
├── docs/                  # Documentation
├── examples/              # Usage examples
└── build/                 # Build output
```

## Testing

### Running Tests

```bash
pnpm test

pnpm test:watch

pnpm test:coverage
```

### Writing Tests

All new features must include tests:

```typescript
import { describe, it, expect } from 'vitest';
import { filter } from '../src';

describe('Feature Name', () => {
  it('should handle basic case', () => {
    const data = [{ id: 1 }, { id: 2 }];
    const expression = { field: 'id', operator: 'eq', value: 1 };

    const result = filter(data, expression);

    expect(result).toEqual([{ id: 1 }]);
  });

  it('should handle edge case', () => {
    // Test edge cases
  });
});
```

### Type Tests

Type-level tests ensure TypeScript types work correctly:

```bash
pnpm test:types
```

Located in `__test__/types/`, these tests verify type inference and type safety.

## Documentation

### Running Documentation Locally

```bash
pnpm docs:dev
```

Visit `http://localhost:5173` to view the documentation.

### Documentation Structure

- `docs/guide/` - User guides and tutorials
- `docs/api/` - API reference
- `docs/examples/` - Usage examples
- `docs/frameworks/` - Framework-specific guides
- `docs/advanced/` - Advanced topics
- `docs/project/` - Project information

### Adding Documentation

When adding features:
1. Update relevant guide pages
2. Add examples to `docs/examples/`
3. Update API reference if needed
4. Include code examples with explanations

## Pull Request Guidelines

### Before Submitting

Ensure your PR meets these criteria:

- [ ] All tests pass
- [ ] Code coverage maintained at 100%
- [ ] Type checks pass without errors
- [ ] Documentation updated
- [ ] Examples added/updated if applicable
- [ ] Commit messages follow conventional commits
- [ ] No linter errors or warnings

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] ✨ New feature
- [ ] 🛠️ Bug fix
- [ ] ❌ Breaking change
- [ ] 🧹 Code refactor
- [ ] 📝 Documentation
- [ ] 🗑️ Chore

## Changes Made

- List specific changes
- Include technical details
- Mention any breaking changes

## Testing

- [ ] Unit tests added/updated
- [ ] Type tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests pass locally

## Documentation

- [ ] Documentation updated
- [ ] Examples added/updated
- [ ] API reference updated

## Checklist

- [ ] Code builds successfully
- [ ] No TypeScript errors
- [ ] No linter issues
- [ ] Follows coding standards
```

## Coding Standards

### TypeScript

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const filterUsers = (users: User[], minId: number): User[] => {
  return filter(users, {
    field: 'id',
    operator: 'gte',
    value: minId
  });
};
```

**Guidelines:**
- Use strict TypeScript mode
- Prefer `interface` over `type` for objects
- Avoid `any` - use proper types or `unknown`
- Use descriptive names
- Document complex types with JSDoc

### Code Style

```typescript
const processData = <T extends Record<string, unknown>>(
  data: T[],
  config: FilterConfig
): T[] => {
  if (!data.length) {
    return [];
  }

  return filter(data, config.expression, config.options);
};
```

**Guidelines:**
- Use functional programming patterns
- Keep functions small and focused
- Follow DRY principle
- Use meaningful variable names
- Avoid deep nesting

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Variables | camelCase | `userData`, `isActive` |
| Functions | camelCase | `filterData`, `handleClick` |
| Types/Interfaces | PascalCase | `FilterExpression`, `User` |
| Files | kebab-case | `filter.ts`, `user-utils.ts` |
| Constants | UPPERCASE | `MAX_DEPTH`, `DEFAULT_CONFIG` |

### File Organization

```
feature/
├── feature.ts              # Main implementation
├── feature.types.ts        # Type definitions
├── feature.utils.ts        # Utility functions
├── feature.constants.ts    # Constants
└── feature.test.ts         # Tests
```

## Framework Integrations

### Adding New Framework Support

1. Create directory in `src/integrations/[framework]/`
2. Implement framework-specific hooks/composables
3. Add comprehensive tests
4. Create documentation in `docs/frameworks/[framework].md`
5. Add examples

### Example Structure

```
src/integrations/react/
├── hooks/
│   ├── use-filter.ts
│   └── use-filter.test.ts
├── types/
│   └── react.types.ts
└── index.ts
```

## Performance Guidelines

- Use memoization for expensive operations
- Implement lazy evaluation where appropriate
- Benchmark performance-critical changes
- Document performance characteristics
- Avoid unnecessary re-computations

## Common Tasks

### Adding a New Operator

1. Define operator in `src/operators/[category].operators.ts`
2. Add operator type to `src/types/operators.types.ts`
3. Update operator processor if needed
4. Add comprehensive tests
5. Document in `docs/guide/operators.md`
6. Add examples

### Adding a New Framework Integration

1. Create integration directory
2. Implement framework-specific API
3. Add tests (unit + integration)
4. Create documentation page
5. Add to main exports
6. Update README

### Fixing a Bug

1. Create test that reproduces the bug
2. Fix the issue
3. Ensure test passes
4. Add regression test if needed
5. Update documentation if applicable

## Release Process

Releases are handled by maintainers:

1. Version bump following semantic versioning
2. Update CHANGELOG.md
3. Create GitHub release
4. Publish to npm

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/mcabreradev/filter/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mcabreradev/filter/discussions)
- **Documentation**: [Filter Docs](https://filter-docs.vercel.app)

## Recognition

Contributors are recognized in:
- GitHub contributors page
- Release notes
- Project README

Thank you for contributing to Filter! 🎉

