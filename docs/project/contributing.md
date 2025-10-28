# Contributing to Filter

Thank you for your interest in contributing to @mcabreradev/filter! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Framework Integrations](#framework-integrations)
- [Performance Considerations](#performance-considerations)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/filter.git
cd filter
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/mcabreradev/filter.git
```

### Stay Synced

Keep your fork up to date:

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

## Development Setup

### Prerequisites

- Node.js 18+ or 20+
- pnpm 8+ (recommended)

### Installation

```bash
pnpm install
```

### Available Scripts

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm test:types

pnpm build
pnpm type-check

pnpm docs:dev
pnpm docs:build
```

## Project Structure

```
filter/
├── src/
│   ├── core/              # Core filter functionality
│   │   ├── filter.ts
│   │   ├── filter-lazy.ts
│   │   └── index.ts
│   ├── operators/         # Operator implementations
│   │   ├── comparison.operators.ts
│   │   ├── logical.operators.ts
│   │   ├── string.operators.ts
│   │   ├── array.operators.ts
│   │   └── operator-processor.ts
│   ├── comparison/        # Comparison utilities
│   │   ├── deep-compare.ts
│   │   ├── object-compare.ts
│   │   └── property-compare.ts
│   ├── config/            # Configuration
│   │   ├── config-builder.ts
│   │   └── default-config.ts
│   ├── integrations/      # Framework integrations
│   │   ├── react/
│   │   ├── vue/
│   │   ├── svelte/
│   │   └── shared/
│   ├── predicate/         # Predicate functions
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── validation/        # Validation schemas
├── __test__/              # Test files
├── docs/                  # Documentation
├── examples/              # Usage examples
└── build/                 # Build output
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow TypeScript best practices
- Add/update tests
- Update documentation

### 3. Test Your Changes

```bash
pnpm test
pnpm test:coverage
pnpm type-check
```

### 4. Commit Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add new operator for date filtering"
git commit -m "fix: resolve memory leak in memoization"
git commit -m "docs: update React integration guide"
```

Commit types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Open a Pull Request on GitHub.

## Testing

### Unit Tests

All new features and bug fixes must include tests.

```bash
pnpm test

pnpm test:watch

pnpm test filter.test.ts
```

### Type Tests

Type-level tests ensure TypeScript types work correctly:

```bash
pnpm test:types
```

### Coverage

Maintain 100% code coverage:

```bash
pnpm test:coverage
```

### Writing Tests

Follow these guidelines:

**1. Descriptive Names**

```typescript
it('should filter users by age greater than 18', () => {
  // test
});
```

**2. Arrange-Act-Assert Pattern**

```typescript
it('should filter array by simple condition', () => {
  const data = [{ age: 25 }, { age: 30 }];
  const expression = { age: { $gt: 26 } };

  const result = filter(data, expression);

  expect(result).toEqual([{ age: 30 }]);
});
```

**3. Test Edge Cases**

```typescript
it('should handle empty arrays', () => {
  expect(filter([], expression)).toEqual([]);
});

it('should handle null values', () => {
  const data = [{ age: null }, { age: 25 }];
  expect(filter(data, { age: { $gt: 20 } })).toEqual([{ age: 25 }]);
});
```

**4. Test Error Conditions**

```typescript
it('should throw error for invalid operator', () => {
  expect(() => filter(data, { age: { $invalid: 20 } }))
    .toThrow('Invalid operator');
});
```

## Documentation

### Code Documentation

Add JSDoc comments for public APIs:

```typescript
/**
 * Filters an array based on the provided expression.
 *
 * @template T - The type of items in the array
 * @param data - The array to filter
 * @param expression - The filter expression
 * @param options - Optional configuration
 * @returns Filtered array
 *
 * @example
 * ```typescript
 * const users = [{ age: 25 }, { age: 30 }];
 * const filtered = filter(users, { age: { $gte: 26 } });
 * ```
 */
export function filter<T>(
  data: T[],
  expression: Expression<T>,
  options?: FilterOptions
): T[] {
  // implementation
}
```

### Documentation Site

Documentation is built with VitePress:

```bash
pnpm docs:dev

pnpm docs:build
```

When adding features:
1. Update relevant documentation pages
2. Add examples to `docs/examples/`
3. Update API reference
4. Add to changelog

## Pull Request Process

### Before Submitting

Checklist:
- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] Type checks pass
- [ ] No linter errors
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### PR Description Template

```markdown
## Description

Brief description of changes and motivation.

## Type of Change

- [ ] ✨ New feature
- [ ] 🛠️ Bug fix
- [ ] ❌ Breaking change
- [ ] 🧹 Code refactor
- [ ] 📝 Documentation
- [ ] 🗑️ Chore

## Testing

- [ ] Unit tests added/updated
- [ ] Type tests added/updated
- [ ] All tests pass
- [ ] Coverage maintained at 100%

## Documentation

- [ ] Documentation updated
- [ ] Examples added/updated
- [ ] API reference updated
- [ ] Changelog updated

## Checklist

- [ ] Code builds successfully
- [ ] No TypeScript errors
- [ ] No linter issues
- [ ] Follows coding standards
```

### Review Process

1. Maintainers review your PR
2. Address feedback and requested changes
3. Once approved, PR will be merged
4. Your contribution will be included in the next release

## Coding Standards

### TypeScript

- Use strict TypeScript mode
- Prefer `interface` over `type` for objects
- Avoid `any` - use proper types
- Use type guards for runtime checks
- Leverage type inference

```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'age' in value
  );
}
```

### Code Style

- Use functional programming patterns
- Follow DRY principle
- Keep functions small and focused
- Use meaningful names
- Avoid side effects

```typescript
const filterByAge = (minAge: number) => (user: User) => user.age >= minAge;

const adults = users.filter(filterByAge(18));
```

### Naming Conventions

- `camelCase` - variables, functions, methods
- `PascalCase` - types, interfaces, classes
- `kebab-case` - file names
- `UPPERCASE` - constants, environment variables

```typescript
const userName = 'John';

interface UserProfile {
  id: number;
}

const MAX_RETRIES = 3;
```

### File Organization

```
feature/
├── feature.ts              # Main implementation
├── feature.types.ts        # Type definitions
├── feature.utils.ts        # Utility functions
├── feature.constants.ts    # Constants
├── feature.test.ts         # Unit tests
└── index.ts                # Public exports
```

## Framework Integrations

When adding framework integrations:

### 1. Follow Framework Best Practices

**React**: Use hooks, avoid class components
**Vue**: Use Composition API
**Svelte**: Use stores

### 2. Maintain Type Safety

```typescript
export function useFilter<T>(
  data: T[],
  expression: Expression<T>,
  options?: FilterOptions
): UseFilterResult<T> {
  // implementation
}
```

### 3. Add Comprehensive Examples

Include examples for common use cases.

### 4. Update Framework Documentation

Add/update documentation in `docs/frameworks/`.

### 5. Add Integration Tests

Test framework-specific behavior.

## Performance Considerations

### Benchmarking

Benchmark performance-critical changes:

```typescript
console.time('filter');
const result = filter(largeDataset, expression);
console.timeEnd('filter');
```

### Optimization Guidelines

- Use memoization for expensive operations
- Implement lazy evaluation where appropriate
- Avoid unnecessary re-renders in React
- Minimize reactivity overhead in Vue
- Optimize store updates in Svelte

### Memory Management

- Clear caches when appropriate
- Avoid memory leaks in subscriptions
- Use weak references where possible

## Questions and Support

- **Questions**: Open a [GitHub Discussion](https://github.com/mcabreradev/filter/discussions)
- **Bugs**: Open a [GitHub Issue](https://github.com/mcabreradev/filter/issues)
- **Security**: Email security@mcabreradev.com

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing! 🎉

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
