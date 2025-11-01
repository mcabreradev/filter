# Query Builder API Proposal

> **Status:** 🟡 Under Consideration  
> **Target Version:** v6.0.0  
> **Priority:** Medium  
> **Last Updated:** November 1, 2025

---

## Overview

A fluent, chainable Query Builder API as an alternative to the object-based filter syntax, providing improved developer experience and type safety.

## Problem Statement

While the current object-based syntax is powerful and MongoDB-like, it can become verbose and harder to read for complex queries:

```typescript
// Current syntax - requires mental parsing
filter(users, {
  $and: [
    { age: { $gte: 18 } },
    { city: { $in: ['Berlin', 'Paris'] } },
    { active: true }
  ]
});

// Proposed - reads like English
new QueryBuilder<User>()
  .where('age').gte(18)
  .and('city').in(['Berlin', 'Paris'])
  .and('active').equals(true)
  .build();
```

## Proposed Solution

### Architecture: Optional Export

Implement as a **separate, optional export** to maintain backward compatibility:

```typescript
// Primary API (unchanged)
import { filter } from '@mcabreradev/filter';
filter(users, { age: { $gte: 18 } }); // ✅ Primary API

// Query Builder (optional)
import { QueryBuilder } from '@mcabreradev/filter/builder';
const query = new QueryBuilder<User>()
  .where('age').gte(18)
  .build();
filter(users, query); // ✅ Same result, different syntax
```

### Core Design

```typescript
class QueryBuilder<T> {
  private conditions: Expression<T>[] = [];
  
  // Field selection with autocomplete
  where<K extends keyof T>(field: K): FieldBuilder<T, K> {
    return new FieldBuilder<T, K>(field, this);
  }
  
  // Logical operators
  and(): QueryBuilder<T> {
    return this;
  }
  
  or(): OrBuilder<T> {
    return new OrBuilder<T>(this.conditions);
  }
  
  not(): NotBuilder<T> {
    return new NotBuilder<T>(this);
  }
  
  // Build final expression
  build(): Expression<T> {
    if (this.conditions.length === 0) return {};
    if (this.conditions.length === 1) return this.conditions[0];
    return { $and: this.conditions };
  }
  
  // Execute directly without build()
  execute(data: T[], options?: FilterOptions): T[] {
    return filter(data, this.build(), options);
  }
}

// Type-safe field operations
class FieldBuilder<T, K extends keyof T> {
  constructor(
    private field: K,
    private parent: QueryBuilder<T>
  ) {}
  
  // Comparison operators
  equals(value: T[K]): QueryBuilder<T> {
    this.parent.addCondition({ [this.field]: value });
    return this.parent;
  }
  
  // Number operators (conditional on type)
  gte(value: T[K] extends number ? number : never): QueryBuilder<T> {
    this.parent.addCondition({ [this.field]: { $gte: value } });
    return this.parent;
  }
  
  lte(value: T[K] extends number ? number : never): QueryBuilder<T> {
    this.parent.addCondition({ [this.field]: { $lte: value } });
    return this.parent;
  }
  
  between(min: T[K] extends number ? number : never, 
          max: T[K] extends number ? number : never): QueryBuilder<T> {
    this.parent.addCondition({ 
      [this.field]: { $gte: min, $lte: max } 
    });
    return this.parent;
  }
  
  // String operators (conditional on type)
  contains(value: T[K] extends string ? string : never): QueryBuilder<T> {
    this.parent.addCondition({ [this.field]: { $contains: value } });
    return this.parent;
  }
  
  startsWith(value: T[K] extends string ? string : never): QueryBuilder<T> {
    this.parent.addCondition({ [this.field]: { $startsWith: value } });
    return this.parent;
  }
  
  endsWith(value: T[K] extends string ? string : never): QueryBuilder<T> {
    this.parent.addCondition({ [this.field]: { $endsWith: value } });
    return this.parent;
  }
  
  matches(pattern: T[K] extends string ? RegExp | string : never): QueryBuilder<T> {
    this.parent.addCondition({ [this.field]: { $regex: pattern } });
    return this.parent;
  }
  
  // Array operators
  in(values: T[K][]): QueryBuilder<T> {
    this.parent.addCondition({ [this.field]: { $in: values } });
    return this.parent;
  }
  
  nin(values: T[K][]): QueryBuilder<T> {
    this.parent.addCondition({ [this.field]: { $nin: values } });
    return this.parent;
  }
  
  containsElement(value: T[K] extends any[] ? T[K][number] : never): QueryBuilder<T> {
    this.parent.addCondition({ [this.field]: { $contains: value } });
    return this.parent;
  }
  
  hasSize(size: T[K] extends any[] ? number : never): QueryBuilder<T> {
    this.parent.addCondition({ [this.field]: { $size: size } });
    return this.parent;
  }
}

// Logical builders
class OrBuilder<T> {
  constructor(private previousConditions: Expression<T>[]) {}
  
  where<K extends keyof T>(field: K): FieldBuilder<T, K> {
    return new FieldBuilder<T, K>(field, this);
  }
  
  build(): Expression<T> {
    // Build OR expression
  }
}

class NotBuilder<T> {
  constructor(private parent: QueryBuilder<T>) {}
  
  where<K extends keyof T>(field: K): FieldBuilder<T, K> {
    return new FieldBuilder<T, K>(field, this);
  }
  
  build(): Expression<T> {
    // Build NOT expression
  }
}
```

### Usage Examples

```typescript
import { QueryBuilder } from '@mcabreradev/filter/builder';

interface User {
  name: string;
  age: number;
  city: string;
  active: boolean;
  tags: string[];
  email: string;
}

const users: User[] = [...];

// Simple query
const adults = new QueryBuilder<User>()
  .where('age').gte(18)
  .and()
  .where('active').equals(true)
  .execute(users);

// Complex query with OR
const targetUsers = new QueryBuilder<User>()
  .where('age').between(18, 65)
  .and()
  .or()
    .where('city').in(['Berlin', 'Paris'])
    .where('tags').containsElement('premium')
  .end()
  .execute(users);

// String operations
const gmailUsers = new QueryBuilder<User>()
  .where('email').endsWith('@gmail.com')
  .and()
  .where('name').startsWith('A')
  .execute(users);

// Pattern matching
const phoneUsers = new QueryBuilder<User>()
  .where('phone').matches(/^\+1-\d{3}-\d{4}$/)
  .execute(users);

// Direct execution (no build needed)
const berliners = new QueryBuilder<User>()
  .where('city').equals('Berlin')
  .execute(users);

// Build for reuse
const adultQuery = new QueryBuilder<User>()
  .where('age').gte(18)
  .build();

filter(users, adultQuery);
filter(customers, adultQuery);

// Reusable query templates
class UserQueries {
  static adults() {
    return new QueryBuilder<User>()
      .where('age').gte(18);
  }
  
  static activeInCities(cities: string[]) {
    return new QueryBuilder<User>()
      .where('active').equals(true)
      .and()
      .where('city').in(cities);
  }
  
  static premiumUsers() {
    return new QueryBuilder<User>()
      .where('tags').containsElement('premium')
      .and()
      .where('active').equals(true);
  }
}

// Compose queries
const premiumBerliners = UserQueries.premiumUsers()
  .and()
  .where('city').equals('Berlin')
  .execute(users);
```

## Analysis

### ✅ Pros

1. **Improved Developer Experience**
   - Intuitive, chainable API
   - Better autocomplete/IntelliSense support
   - Reduced cognitive load for complex queries
   - Self-documenting code

2. **Type Safety**
   - TypeScript enforces valid field names at each step
   - Method chaining provides compile-time validation
   - Prevents invalid operator/field combinations
   - Type-conditional methods (e.g., `gte()` only for numbers)

3. **Readability**
   - Reads like natural language
   - Method names are discoverable
   - No need to memorize operator syntax

4. **Discoverability**
   - IDE shows available operators as you type
   - Methods guide users through available operations
   - Better learning curve for new users

### ⚠️ Cons

1. **Bundle Size Impact**
   - Current library: ~5KB minzipped
   - Query Builder would add: ~2-3KB
   - Total increase: ~40-60%
   - **Mitigation:** Tree-shakeable separate export

2. **API Surface Complexity**
   - Adds another way to do the same thing
   - Documentation burden increases
   - Maintenance overhead
   - **Mitigation:** Mark as optional enhancement

3. **Learning Curve**
   - Users need to learn both APIs
   - Not aligned with MongoDB/SQL syntax patterns
   - **Mitigation:** Clear documentation on when to use each

4. **Performance Overhead**
   - Additional object creation
   - Method call overhead
   - Build step required before filtering
   - **Mitigation:** Optimize builder implementation, add benchmarks

## Implementation Plan

### Phase 1: Core Builder (v6.0.0)
**Target:** Q2 2026

- [ ] Basic QueryBuilder class
- [ ] FieldBuilder with type-safe operators
- [ ] Simple logical operators (and, or, not)
- [ ] build() and execute() methods
- [ ] 100% test coverage
- [ ] Basic documentation
- [ ] Performance benchmarks vs object syntax

**Deliverables:**
- `src/builder/query-builder.ts`
- `src/builder/field-builder.ts`
- `src/builder/logical-builders.ts`
- `__test__/builder/query-builder.test.ts`
- `docs/guide/query-builder.md`
- Performance comparison report

### Phase 2: Advanced Features (v6.1.0)
**Target:** Q3 2026

- [ ] Nested query support
- [ ] Query templates/presets
- [ ] Custom operator registration
- [ ] Performance optimizations
- [ ] Advanced TypeScript types
- [ ] Complex logical combinations

**Deliverables:**
- Enhanced builder classes
- Template system
- Custom operator API
- Advanced examples

### Phase 3: Developer Experience (v6.2.0)
**Target:** Q4 2026

- [ ] Enhanced TypeScript types
- [ ] Better error messages
- [ ] Query visualization/debugging
- [ ] Migration helpers from object syntax
- [ ] Interactive playground integration
- [ ] Framework integration examples

**Deliverables:**
- Debug visualization
- Migration guide
- Playground examples
- Framework-specific patterns

## Alternative: Lightweight Helper Approach

Instead of a full QueryBuilder, implement a **lightweight helper** that generates expressions:

```typescript
// src/helpers/query.ts
export const q = {
  where: <T, K extends keyof T>(field: K) => ({
    equals: (value: T[K]) => ({ [field]: value }),
    gte: (value: number) => ({ [field]: { $gte: value } }),
    lte: (value: number) => ({ [field]: { $lte: value } }),
    in: (values: T[K][]) => ({ [field]: { $in: values } }),
    contains: (value: string) => ({ [field]: { $contains: value } }),
    startsWith: (value: string) => ({ [field]: { $startsWith: value } }),
    endsWith: (value: string) => ({ [field]: { $endsWith: value } }),
    matches: (pattern: RegExp | string) => ({ [field]: { $regex: pattern } }),
  }),
  
  and: <T>(...conditions: Expression<T>[]) => ({ $and: conditions }),
  or: <T>(...conditions: Expression<T>[]) => ({ $or: conditions }),
  not: <T>(condition: Expression<T>) => ({ $not: condition }),
};

// Usage (minimal overhead)
filter(users, q.and(
  q.where('age').gte(18),
  q.where('city').in(['Berlin', 'Paris']),
  q.where('email').endsWith('@company.com')
));
```

**Benefits of Helper Approach:**
- ~70% of QueryBuilder benefits
- ~10% of complexity
- Minimal bundle size impact (~500 bytes)
- No new concepts to learn
- Works with existing object syntax

**Recommendation:** Start with lightweight helper in v5.6.0, gather feedback, then decide on full QueryBuilder for v6.0.0.

## Decision Criteria

### ✅ Implement If:

1. **User Demand**
   - Create GitHub discussion
   - Gather community feedback
   - Track feature requests

2. **Acceptable Trade-offs**
   - Bundle size increase is acceptable (tree-shakeable)
   - Team can commit to maintaining two APIs
   - Documentation resources available

3. **Proven Value**
   - Lightweight helper shows high adoption
   - Users consistently request full builder
   - Performance benchmarks are acceptable

### ❌ Skip If:

1. **Current API Sufficient**
   - Object syntax satisfies most use cases
   - No consistent user demand
   - Limited use in examples/docs

2. **Resource Constraints**
   - Bundle size is critical concern
   - Limited maintenance resources
   - Documentation bandwidth unavailable

3. **User Preference**
   - Community prefers MongoDB-style syntax
   - Fluent API not aligned with target audience
   - Learning curve outweighs benefits

## Migration Path

### From Object Syntax

```typescript
// Before (object syntax)
filter(users, {
  $and: [
    { age: { $gte: 18 } },
    { city: { $in: ['Berlin', 'Paris'] } },
    { active: true }
  ]
});

// After (query builder)
new QueryBuilder<User>()
  .where('age').gte(18)
  .and()
  .where('city').in(['Berlin', 'Paris'])
  .and()
  .where('active').equals(true)
  .execute(users);

// Or build and reuse
const adultQuery = new QueryBuilder<User>()
  .where('age').gte(18)
  .build();

filter(users, adultQuery);
```

### Gradual Adoption

```typescript
// Mix and match approaches
const baseQuery = { active: true };

const complexQuery = new QueryBuilder<User>()
  .where('age').gte(18)
  .build();

// Combine both
filter(users, { 
  ...baseQuery, 
  ...complexQuery 
});
```

## Documentation Requirements

### New Documentation

1. **Guide: Query Builder API** (`docs/guide/query-builder.md`)
   - When to use Query Builder vs Object Syntax
   - Complete API reference
   - Common patterns
   - Performance comparison

2. **Examples** (`examples/query-builder/`)
   - Basic usage
   - Complex queries
   - Query templates
   - Framework integrations

3. **Migration Guide** (`docs/advanced/migration-query-builder.md`)
   - Converting object syntax to builder
   - Best practices
   - Performance tips

### Updated Documentation

1. **README.md** - Add Query Builder section
2. **API Reference** - Add builder exports
3. **TypeScript Guide** - Type-safe builder usage
4. **Performance Guide** - Builder benchmarks

## Performance Considerations

### Benchmarks Required

```typescript
// Measure overhead
const objectSyntax = filter(data, { age: { $gte: 18 } });
const builderSyntax = new QueryBuilder<User>()
  .where('age').gte(18)
  .execute(data);

// Compare:
// - Execution time
// - Memory usage
// - GC pressure
```

### Optimization Strategies

1. **Object Pooling** - Reuse builder instances
2. **Lazy Compilation** - Compile expressions on-demand
3. **Caching** - Cache built expressions
4. **Tree-shaking** - Ensure builders are tree-shakeable

## Testing Requirements

### Unit Tests

- [ ] QueryBuilder class (100% coverage)
- [ ] FieldBuilder operators
- [ ] Logical operators (and, or, not)
- [ ] Type safety tests
- [ ] Error handling

### Integration Tests

- [ ] Complex query scenarios
- [ ] Framework integrations
- [ ] Performance benchmarks
- [ ] Memory leak tests

### Type Tests

- [ ] Type-conditional methods
- [ ] Generic constraints
- [ ] Inference correctness
- [ ] Error messages

## Success Metrics

### Adoption Metrics

- [ ] 10%+ of examples use Query Builder within 3 months
- [ ] Positive GitHub discussions feedback
- [ ] Bundle size impact < 50%
- [ ] Performance overhead < 10%

### Quality Metrics

- [ ] 100% test coverage
- [ ] Zero TypeScript errors in examples
- [ ] Documentation completeness score > 90%
- [ ] User satisfaction survey > 4.0/5.0

## Next Steps

1. **Community Feedback** (November 2025)
   - Create GitHub discussion
   - Share proposal
   - Gather requirements

2. **Proof of Concept** (December 2025)
   - Implement lightweight helper approach
   - Add to v5.6.0
   - Gather usage metrics

3. **Decision Point** (March 2026)
   - Review feedback and metrics
   - Decide on full QueryBuilder implementation
   - Update roadmap

4. **Implementation** (Q2 2026+)
   - Phase 1: Core Builder
   - Phase 2: Advanced Features
   - Phase 3: Developer Experience

## Resources

- **Inspiration:**
  - TypeORM QueryBuilder
  - Knex.js query builder
  - Prisma client API
  - LINQ (C#)

- **References:**
  - [MongoDB Query API](https://www.mongodb.com/docs/manual/reference/operator/query/)
  - [TypeORM Query Builder](https://typeorm.io/select-query-builder)
  - [Knex.js](https://knexjs.org/guide/query-builder.html)

---

**Recommendation:** Start with **lightweight helper approach** in v5.6.0, gather user feedback for 6 months, then decide on full QueryBuilder for v6.0.0 if demand is strong.

**Status Update:** November 1, 2025 - Proposal documented, awaiting community feedback.
