# Project: @mcabreradev/filter

## Purpose

A powerful, SQL-like array filtering library for TypeScript and JavaScript with advanced pattern matching, MongoDB-style operators, deep object comparison, geospatial queries, and zero dependencies (`@mcabreradev/filter`, v5.10.1). It lets developers express complex filters declaratively instead of hand-writing nested loops and conditionals, across plain data and popular frameworks (React, Vue, Angular, Preact, SolidJS).

## Target Users

TypeScript/JavaScript developers building applications that filter in-memory arrays or object collections — frontend state (React/Vue/Angular/Preact/SolidJS), backend/service layers, and tooling — who want a batteries-included, typed, composable filter language without pulling a full query engine or a database.

## Main Problem

(derived from product idea) Filtering arrays in application code is repetitive and error-prone: imperative `filter()` chains with hand-rolled conditions are hard to read, hard to reuse, and easy to get wrong for nested objects, comparisons and edge cases. Developers need a declarative, composable, well-typed filtering language plus an engine that evaluates it efficiently and safely.

## MVP Goal

Already delivered and shipped: the first version with the core filtering engine (18+ operators, lazy evaluation, comparison/predicate subsystems), framework integrations, typed API, documentation site and full test suite is published as `@mcabreradev/filter` at v5.10.1. The current milestone is the in-flight `rust-migration` change (in-progress, 0/99 tasks): moving the core engine to Rust compiled to WASM + a native Node addon while preserving the exact same public TypeScript API.

## Scope

- Core filtering engine and its subsystems: `src/{core, operators, predicate, comparison, config, validation, debug, errors, constants, types, utils}`.
- Framework integrations: `src/integrations` for React, Vue, Angular, Preact and SolidJS (optional peer deps), plus `zod` interop.
- Type-safety surface: strict TypeScript, ESM, `filter()` returning `T[]`, public type declarations and `tsd` type tests.
- Documentation site (VitePress, `docs/`), examples (`examples/`) and the test suite (`__test__/` + co-located `src/**/*.test.ts` + docs theme tests).
- The active `openspec/changes/rust-migration` change (in progress, 0/99 tasks).

## Non-Goals

- Not a general-purpose query engine, database or server: filtering is in-memory, on arrays/collections.
- No breaking API changes: `filter()` keeps returning `T[]`; the rust migration preserves the public TS API (rust-migration proposal).
- No UI component library: framework packages are thin integration layers, not widgets.
- Pending: what else is explicitly out of scope for this stage?

## Preferred Stack

| Area | Choice |
|---|---|
| Language / runtime | TypeScript (strict), ESM (`"type": "module"`), target ES2022, Node.js + browsers |
| Frameworks | Vitest (tests), VitePress (docs), peer integrations: react, vue, angular, preact, solid-js, zod (all optional) |
| Data | none (zero production dependencies; `dependencies` empty) |
| Infra / deploy | npm publish (`@mcabreradev/filter`), GitHub Actions CI, husky git hooks (pre-commit: lint-staged + typecheck + test + test:docs; pre-push: check), size-limit budget |

```bash
build:      pnpm build
test:       pnpm test
lint:       pnpm lint
typecheck:  pnpm typecheck
```

## Business Rules

- Pending: what business rules must the software respect?

## Technical Constraints

- Strict TypeScript with `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns` (tsconfig.json).
- ESM only, module `ES2022`, `moduleResolution: bundler`, `"type": "module"` (tsconfig.json, package.json).
- Zero production dependencies; `peerDependencies` (react, vue, @angular/core, preact, solid-js, zod) are optional.
- Bundle size budget enforced by `size-limit` (post-build `pnpm run size`).
- Build pipeline: `tsc` + `tsx scripts/optimize-build.ts`, output to `build/`.
- Tests run under Vitest (node environment, jsdom for docs theme tests).
- Pending: what other technical limits (platform, performance, security, integrations) apply?

## Architecture Principles

The repo has no `docs/architecture/` yet; the following is summarized from the actual `src/` layout:

- Segregated subsystems: `core`, `operators`, `predicate`, `comparison`, `validation`, `config`, `debug`, `errors`, `constants`, `types`, `utils` are separate modules; `integrations/` isolates framework adapters (one per framework) from the core.
- Lazy evaluation: lazy filtering variants live in `src/core/lazy` and are part of the public API.
- Public API stability: `index.ts` is the single entry point; the rust migration must keep the same public TypeScript API and `T[]` return type.
- Engine + facade split target: the rust-migration change (in progress) will move the engine to Rust (WASM + native napi addon) behind a thin TS facade with a runtime loader.
- Architecture documentation is created at `docs/architecture/` during the openspec-to-architecture workflow — this initializes the place, not the content.

## Product Rules

- `filter()` returns `T[]` with the same signature and behavior across all environments (no breaking changes).
- Filter expressions are SQL-like/MongoDB-style: operators, deep/object comparison, pattern matching, logical composition and geospatial queries.
- Declared "zero dependencies" production contract (to be replaced by optional native peer deps once rust-migration ships).
- Framework integrations mirror the core API and never diverge in behavior (verified by docs + integration tests).
- Docs, examples and tests are maintained as part of the product (docs tests run in the pre-commit gate).

## Quality Expectations

- Gate: pre-commit (husky lint-staged) runs typecheck + `test` (Vitest suite) + `test:docs` (docs tests); pre-push runs `check` (lint-staged + `test:types` (tsd) + typecheck + lint).
- Test suite of 965+ tests (`it(`/`test(` across `src/**/*.test.ts`, `__test__/` and docs theme tests), including type-level `tsd` tests.
- Lint and typecheck must pass (`eslint src/**/*.ts`, `tsc --noEmit`).
- Bundle size budget via `size-limit`; `test:coverage` (v8 provider) is available.
- Pending: what specific coverage/performance expectations beyond the existing gate?

## Agentic Workflow Rules

- OpenSpec is the source of truth for this project.
- No feature implementation before an OpenSpec change exists.
- Every change must include proposal.md, tasks.md, and spec.md.
- Every implementation must trace back to a requirement.
- Ambiguous behavior requires human approval.
- Hermes must operate only inside this project root.
