# Contributing to Filter

Thank you for your interest in contributing to Filter! This document provides guidelines and instructions for contributing.

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

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/filter.git`
3. Add upstream remote: `git remote add upstream https://github.com/mcabreradev/filter.git`

## Development Setup

```bash
pnpm install

pnpm test

pnpm test:watch

pnpm build

pnpm type-check

pnpm docs:dev
```

## Project Structure

```
filter/
├── src/                    # Source code
│   ├── core/              # Core filter functionality
│   ├── operators/         # Operator implementations
│   ├── comparison/        # Comparison utilities
│   ├── config/            # Configuration
│   ├── integrations/      # Framework integrations (React, Vue, Svelte)
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

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Write/update tests
4. Update documentation
5. Run tests: `pnpm test`
6. Run type checks: `pnpm type-check`
7. Commit your changes following conventional commits
8. Push to your fork
9. Open a Pull Request

## Testing

### Unit Tests

All new features and bug fixes must include tests:

```bash
pnpm test

pnpm test:coverage

pnpm test filter.test.ts
```

### Type Tests

Type-level tests ensure TypeScript types work correctly:

```bash
pnpm test:types
```

### Writing Tests

- Use descriptive test names
- Follow Arrange-Act-Assert pattern
- Test edge cases and error conditions
- Maintain 100% code coverage

Example:

```typescript
describe('filter', () => {
  it('should filter array by simple condition', () => {
    const data = [{ age: 25 }, { age: 30 }];
    const expression = { field: 'age', operator: 'gt', value: 26 };

    const result = filter(data, expression);

    expect(result).toEqual([{ age: 30 }]);
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Include usage examples
- Document parameters and return types

### Documentation Site

Documentation is in the `docs/` directory:

```bash
pnpm docs:dev

pnpm docs:build
```

When adding new features:
1. Update relevant documentation pages
2. Add examples to `docs/examples/`
3. Update API reference if needed

## Pull Request Process

### Before Submitting

- [ ] Tests pass locally
- [ ] Code follows project style guidelines
- [ ] Documentation is updated
- [ ] Type checks pass
- [ ] No linter errors
- [ ] Commit messages follow conventional commits

### PR Description Template

```markdown
## Description

[Describe your changes]

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

## Checklist

- [ ] Code builds successfully
- [ ] Documentation updated
- [ ] No TypeScript errors
- [ ] No linter issues
```

### Review Process

1. Maintainers will review your PR
2. Address any feedback
3. Once approved, your PR will be merged

## Coding Standards

### TypeScript

- Use strict TypeScript mode
- Prefer `interface` over `type` for objects
- Avoid `any` - use proper types
- Use descriptive variable names

### Code Style

- Use functional programming patterns
- Follow DRY principle
- Keep functions small and focused
- Use meaningful names

### Naming Conventions

- `camelCase` - variables, functions
- `PascalCase` - types, interfaces, classes
- `kebab-case` - file names
- `UPPERCASE` - constants

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

When adding framework integrations:

1. Follow framework best practices
2. Maintain type safety
3. Add comprehensive examples
4. Update framework documentation
5. Add integration tests

## Performance Considerations

- Use memoization where appropriate
- Implement lazy evaluation for expensive operations
- Benchmark performance-critical changes
- Document performance characteristics

## Questions?

- Open an issue for questions
- Join discussions in GitHub Discussions
- Check existing issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

