# Type Tests 🔬

This directory contains comprehensive TypeScript type-level tests using [tsd](https://github.com/SamVerschueren/tsd).

## Overview

Type tests ensure that the TypeScript types in this library work correctly and catch type regressions before they reach production. Unlike runtime tests, type tests validate the type system itself.

## Test Files

### `config.types.test-d.ts`
Tests for configuration types:
- `FilterConfig` - Complete configuration object
- `FilterOptions` - Partial configuration options
- `Comparator` - Custom comparator function type

### `expression.types.test-d.ts`
Tests for expression types:
- `PrimitiveExpression` - String, number, boolean, null
- `PredicateFunction` - Function predicates
- `ObjectExpression` - Object-based filters
- `Expression` - Union of all expression types

### `operators.types.test-d.ts`
Tests for operator types:
- `ComparisonOperators` - $gt, $gte, $lt, $lte, $eq, $ne
- `ArrayOperators` - $in, $nin, $contains, $size
- `StringOperators` - $startsWith, $endsWith, $contains, $regex, $match
- `LogicalOperators` - $and, $or, $not
- `OperatorExpression` - Combined operator types
- `ExtendedObjectExpression` - Objects with operators and logical operators

### `filter.test-d.ts`
Tests for the main filter function:
- Return type inference
- Expression type validation
- Options parameter handling
- Error cases

### `edge-cases.test-d.ts`
Tests for edge cases and complex scenarios:
- Empty interfaces
- Optional fields
- Readonly types
- Union types
- Generic types
- Nullable types
- Recursive types
- Complex unions
- Intersection types
- Tuple types
- Literal types
- Symbol keys

## Running Type Tests

```bash
# Run type tests only
pnpm run test:types

# Run all checks (includes type tests)
pnpm run check

# Run before publishing
pnpm run prepublish
```

## How Type Tests Work

Type tests use special assertion functions from `tsd`:

- `expectType<T>(value)` - Asserts value is exactly type T
- `expectAssignable<T>(value)` - Asserts value is assignable to type T
- `expectNotAssignable<T>(value)` - Asserts value is NOT assignable to type T
- `expectError(expression)` - Asserts expression produces a type error

## Example

```typescript
import { expectType } from 'tsd';
import { filter } from '../../src/core/filter';

interface User {
  name: string;
  age: number;
}

const users: User[] = [
  { name: 'John', age: 25 }
];

// Assert that filter returns User[]
expectType<User[]>(filter(users, { name: 'John' }));

// Assert that invalid input produces error
expectError(filter('not-an-array', 'test'));
```

## Benefits

### ✅ Type Safety
- Catches breaking changes in type signatures
- Validates generic type constraints
- Ensures operator types are properly typed

### ✅ Documentation
- Serves as executable documentation
- Shows expected type behavior
- Demonstrates API usage

### ✅ Refactoring Confidence
- Safe to refactor types
- Immediate feedback on type changes
- Prevents accidental breaking changes

### ✅ CI/CD Integration
- Fast execution (type-level only)
- No runtime overhead
- Fails build on type regressions

## Adding New Type Tests

1. Create a new `.test-d.ts` file or add to existing file
2. Import types and functions to test
3. Write assertions using `expectType`, `expectAssignable`, etc.
4. Run `pnpm run test:types` to verify

## Notes

- Type tests are NOT included in the published package
- They run during development and CI/CD
- The main type test file is `build/index.test-d.ts` (auto-generated)
- Additional test files in this directory provide comprehensive coverage

