# Copilot Instructions for @mcabreradev/filter

## Project Overview
- **@mcabreradev/filter** is a TypeScript-first, highly-configurable filtering engine for objects, arrays, and nested data. It supports advanced operators, lazy evaluation, memoization, and framework integrations (React, Vue, Svelte, etc.).
- The codebase is modular: see `src/` for core logic, operators, config, validation, and integrations. Type definitions are in `src/types/`.

## Architecture & Patterns
- **Core entry point:** `src/index.ts` re-exports main APIs.
- **Operators:** Implemented in `src/operators/` and referenced in `src/core/filter.ts`.
- **Config:** All configuration logic is in `src/config/` (see `config-builder.ts`).
- **Debugging:** Debug features live in `src/debug/` and are enabled via config (`debug: true`).
- **Type tests:** TypeScript type tests are in `__test__/test-d/` and use `tsd`.
- **Examples:** Usage patterns are in `examples/` and referenced in docs.

## Developer Workflows
- **Install:** `pnpm install`
- **Build:** `pnpm build` (outputs to `build/`)
- **Test:** `pnpm test` (unit), `pnpm test:coverage` (coverage), `pnpm type-check` (types)
- **Docs:**
  - Dev: `pnpm run docs:dev` (http://localhost:5173/)
  - Build: `pnpm run docs:build`
  - API: `pnpm run docs:api`
- **Branch naming:** Use `feature/`, `fix/`, `docs/`, `refactor/`, `test/`, `chore/` prefixes.

## Project Conventions
- **TypeScript only.** No JS in `src/`.
- **Functional style:** Prefer pure functions, avoid side effects.
- **Operator extensibility:** Add new operators in `src/operators/` and register in `src/core/filter.ts`.
- **Config defaults:** All config options and defaults in `src/config/default-config.ts`.
- **Testing:** All new features require tests in `__test__/` and type tests in `__test__/test-d/`.
- **Docs:** Update `docs/` and `examples/` for new features.

## Integration & Extensibility
- **Frameworks:** See `docs/frameworks/` for integration guides.
- **Backend:** See `docs/backend/` for Express, NestJS, Deno usage.
- **Debug:** Use `debug` and `verbose` config for tree output and timings.

## References
- **Architecture:** `docs/advanced/architecture.md`
- **Type System:** `docs/advanced/type-system.md`
- **Contributing:** `CONTRIBUTING.md`, `docs/project/contributing.md`
- **Examples:** `examples/`, `docs/examples/`
- **API:** `docs/api/`, `docs/guide/`

---
For more, see the [README.md](../README.md) and [docs/](../docs/).