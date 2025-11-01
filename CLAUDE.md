# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**@mcabreradev/filter** is a TypeScript-first filtering engine for arrays with SQL-like wildcards, MongoDB-style operators, lazy evaluation, memoization, and framework integrations (React, Vue, Svelte). It provides 18+ operators for advanced filtering with zero dependencies (except Zod for validation).

## Development Commands

### Core Development
```bash
# Install dependencies
pnpm install

# Build project (outputs to build/)
pnpm build

# Type checking
pnpm typecheck
```

### Testing
```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage

# Run TypeScript type tests (tsd)
pnpm test:types

# Run all checks (lint, typecheck, type tests, test)
pnpm run check
```

### Linting & Formatting
```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code with Prettier
pnpm format
```

### Publishing
```bash
# Publish major version (runs check, version bump, publish)
pnpm run publish:major

# Publish minor version
pnpm run publish:minor

# Publish patch version
pnpm run publish:patch

# Release (push tags to remote)
pnpm run release

# Full release workflow (publish + push tags)
pnpm run release:major
pnpm run release:minor
pnpm run release:patch
```

### Documentation
```bash
# Start docs dev server (http://localhost:5173/)
pnpm run docs:dev

# Build documentation
pnpm run docs:build

# Preview built docs
pnpm run docs:preview

# Generate API documentation
pnpm run docs:api
```

## Code Architecture

### Module Structure
- **`src/index.ts`** - Main entry point that re-exports all public APIs
- **`src/core/`** - Core filtering logic
  - `filter.ts` - Main filter function with caching and debug support
  - `filter-lazy.ts` - Lazy evaluation with generators for large datasets
- **`src/operators/`** - MongoDB-style operator implementations
  - `comparison.operators.ts` - $gt, $gte, $lt, $lte, $eq, $ne
  - `array.operators.ts` - $in, $nin, $contains, $size
  - `string.operators.ts` - $startsWith, $endsWith, $contains, $regex, $match
  - `logical.operators.ts` - $and, $or, $not
  - `operator-processor.ts` - Processes operator-based expressions
- **`src/predicate/`** - Predicate function builders
  - `predicate-factory.ts` - Creates appropriate predicate based on expression type
  - `string-predicate.ts` - Handles wildcards (%, _), negation (!)
  - `object-predicate.ts` - Handles object-based filtering
  - `function-predicate.ts` - Handles custom predicate functions
- **`src/comparison/`** - Deep comparison logic
  - `deep-compare.ts` - Recursive deep equality for nested objects
  - `object-compare.ts` - Object comparison with maxDepth support
  - `property-compare.ts` - Property-level comparison with wildcards
- **`src/config/`** - Configuration management
  - `default-config.ts` - Default configuration values
  - `config-builder.ts` - Merges user options with defaults
- **`src/validation/`** - Runtime validation with Zod
  - `schemas.ts` - Zod schemas for expressions and options
  - `validator.ts` - Validates expressions and options at runtime
- **`src/debug/`** - Debug mode with tree visualization
  - `debug-filter.ts` - Debug-enabled filter with statistics
  - `debug-tree-builder.ts` - Builds expression tree for visualization
  - `debug-formatter.ts` - Formats debug output with colors
  - `debug-evaluator.ts` - Tracks condition evaluations
- **`src/utils/`** - Utility functions
  - `cache.ts` - Result caching with WeakMap
  - `memoization.ts` - Predicate and regex memoization
  - `lazy-iterators.ts` - Generator utilities (take, skip, map, etc.)
  - `pattern-matching.ts` - SQL wildcard matching (%, _)
  - `type-guards.ts` - TypeScript type guards
- **`src/integrations/`** - Framework integrations
  - `react/` - React hooks (useFilter, useDebouncedFilter, etc.)
  - `vue/` - Vue composables with reactivity
  - `svelte/` - Svelte stores
  - `shared/` - Shared utilities (debounce, pagination)
- **`src/types/`** - TypeScript type definitions
  - `expression.types.ts` - Expression and operator types
  - `config.types.ts` - Configuration types
  - `operators.types.ts` - Operator-specific types
  - `lazy.types.ts` - Lazy evaluation types

### Key Design Patterns

**Predicate Factory Pattern**: The `predicate-factory.ts` determines the appropriate predicate builder based on expression type (string, object, function, or primitive).

**Operator Processing**: Operators are processed in `operator-processor.ts`, which detects operator-based expressions and delegates to specific operator implementations.

**Multi-Layer Caching**: Three-tier caching strategy:
1. Result cache - Complete filter results (WeakMap-based)
2. Predicate cache - Compiled predicate functions
3. Regex cache - Compiled regex patterns

**Lazy Evaluation**: Generator-based filtering in `filter-lazy.ts` enables early exit and memory-efficient processing of large datasets.

**Debug Tree**: Debug mode builds an expression tree showing condition evaluations, match counts, and execution timings.

## Test Organization

- **`src/**/*.test.ts`** - Unit tests co-located with source files
- **`__test__/filter.test.ts`** - Integration tests for main filter function
- **`__test__/test-d/`** - TypeScript type tests using tsd
- **`__test__/memoization-integration.test.ts`** - Caching integration tests

Tests use Vitest and must achieve comprehensive coverage.

## Git Hooks

### pre-commit
Runs automatically on commit:
1. lint-staged (eslint + prettier on staged files)
2. Type checking

### pre-push
Runs automatically on push:
1. All unit tests
2. Type tests (tsd)
3. Type checking
4. Linting all files
5. Full check command

## Branch Strategy

- **Main branch**: `dev`
- **Feature branches**: Use prefixes `feat/`, `fix/`, `docs/`, `refactor/`, `test/`, `chore/`

## Development Guidelines

### TypeScript
- All source code must be TypeScript (no `.js` in `src/`)
- Strict mode enabled - all compiler options are strict
- Target: ES2022 with ESM modules
- Tests excluded from build output

### Code Style
- Functional programming preferred - pure functions, avoid side effects
- Modular design - small, focused modules with single responsibility
- Export from `index.ts` barrels for clean imports
- Dont add jsdoc and comments

### Operator Extensibility
To add new operators:
1. Create implementation in appropriate `src/operators/*.operators.ts` file
2. Add type definitions to `src/types/operators.types.ts`
3. Update operator detection in `src/utils/operator-detection.ts`
4. Add comprehensive tests

### Configuration
- All config options defined in `src/config/default-config.ts`
- Options: caseSensitive, maxDepth, enableCache, debug, verbose, showTimings, colorize, customComparator
- Merge user options via `mergeConfig()` in `config-builder.ts`

### Framework Integrations
Framework-specific code lives in `src/integrations/<framework>/`:
- React uses hooks pattern
- Vue uses Composition API
- Svelte uses stores
- Shared utilities in `src/integrations/shared/`
- All optional peer dependencies

## Publishing Workflow

The project uses semantic versioning:
1. Run `pnpm run publish:[major|minor|patch]` - runs all checks, bumps version, publishes to npm
2. Run `pnpm run release` to push git tags
3. Or use combined commands: `pnpm run release:[major|minor|patch]`

Pre-publish checks ensure:
- All tests pass
- Type tests pass
- Type checking succeeds
- Linting passes
- No uncommitted changes

## Key Files

- **`package.json`** - Main: `build/index.js`, Types: `build/index.d.ts`
- **`tsconfig.json`** - TypeScript config with strict mode
- **`.husky/`** - Git hooks configuration
- **`docs/`** - VitePress documentation site
- **`examples/`** - Usage examples referenced in docs
