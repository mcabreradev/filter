# TS Facade Loader Specification

## Purpose

Specifies how the TS facade strips TS-only options, selects the native or WASM backend at runtime, and preserves the exact v5 public surface, framework integrations, and bundler requirements.

## Requirements

### Requirement: TS-only options stripped before Rust call

Before passing `FilterOptions` to the Rust backend, the TS facade SHALL remove fields that are not present in the Rust `FilterOptions` struct. The following fields are **TS-only** and must be stripped:

- `customComparator` — JS function; falls back to TS implementation (see note below).
- `colorize` — controls terminal color formatting only; silently dropped before Rust call.
- `enablePerformanceMonitoring` — TS-side FFI overhead measurement; silently dropped.

**`customComparator` fallback note:** When `customComparator` is set, the TS facade SHALL execute the full filter using the v5 TS implementation path (not Rust) to preserve correct behavior. This is a defined TS-only code path. No error is thrown. Users who rely on `customComparator` get correct results at v5 performance; users without it get Rust performance. This ensures full backward compatibility without breaking changes.

#### Scenario: customComparator falls back to TS implementation

- **WHEN** `filter(data, expr, { customComparator: fn })` is called
- **THEN** the TS v5 filter implementation runs (not Rust); the result is correct; no error is thrown

#### Scenario: Options without TS-only fields go through Rust

- **WHEN** `filter(data, expr, { caseSensitive: true, maxDepth: 5 })` is called
- **THEN** `{ caseSensitive: true, maxDepth: 5 }` is JSON-serialized and the Rust backend processes it

#### Scenario: colorize and enablePerformanceMonitoring are silently stripped

- **WHEN** `filter(data, expr, { colorize: true, enablePerformanceMonitoring: true })` is called
- **THEN** those fields are dropped before the Rust call; the filter executes normally via Rust

### Requirement: filter() is a synchronous function returning T[]

The exported `filter()` function SHALL have return type `T[]` (not `Promise<T[]>`). The WASM module initialization is handled transparently at module-load time via ESM top-level await. By the time user code can call `filter()`, the backend is already ready.

#### Scenario: filter() does not return a Promise

- **WHEN** `const result = filter(data, expr)` is called
- **THEN** `result` is `T[]` immediately; `typeof result.then` is `undefined`

### Requirement: Runtime loader selects native over WASM in Node.js

`packages/filter/src/loader.ts` SHALL attempt to import `@mcabreradev/filter-native` first when `process.versions?.node` is defined, and fall back to `@mcabreradev/filter-wasm` on failure.

#### Scenario: Node.js environment loads native backend

- **WHEN** `filter` is imported in a Node.js environment with the native addon available
- **THEN** `loader.ts` uses the native addon as the active backend

#### Scenario: Browser environment loads WASM backend

- **WHEN** `filter` is imported in a browser environment
- **THEN** `loader.ts` uses `@mcabreradev/filter-wasm` as the active backend

### Requirement: WASM initialized eagerly at module import

The WASM module SHALL be initialized once during the first import of `@mcabreradev/filter` using a top-level `await` on the init promise. Subsequent calls to `filter()` SHALL NOT await initialization.

#### Scenario: First filter call does not block on WASM init

- **WHEN** `@mcabreradev/filter` is imported and `filter(data, expr)` is called after module load
- **THEN** the WASM init promise is already resolved and the call returns immediately

### Requirement: Public API surface identical to v5

`packages/filter/src/index.ts` SHALL export all the same symbols as the current v5 `src/index.ts`, including `filter`, `filterLazy`, `filterLazyAsync`, `filterChunked`, `filterLazyChunked`, `filterFirst`, `filterExists`, `filterCount`, `filterDebug`, `clearFilterCache`, `getFilterCacheStats`, all operator evaluators, all type exports, error classes, config helpers, and utility functions.

#### Scenario: Existing v5 import still resolves

- **WHEN** a user upgrades from v5 to v6 without changing their import statements
- **THEN** all named exports resolve without TypeScript errors

#### Scenario: package-exports test passes

- **WHEN** `__test__/package-exports.test.ts` runs against the v6 facade
- **THEN** all assertions pass

### Requirement: Framework integrations unchanged

All framework hooks (React, Vue, Angular, Preact, SolidJS) in `src/integrations/` SHALL remain in TypeScript and proxy calls to the Rust backend via the loader. Their public API SHALL be identical to v5.

#### Scenario: useFilterReact returns filtered data

- **WHEN** `useFilterReact(data, expression)` is called in a React component
- **THEN** it returns the same filtered array as the Rust backend would return for those inputs

### Requirement: Bundler must support top-level await

The WASM eager initialization in `loader.ts` uses a top-level `await` expression (ESM only). The consuming application SHALL use a bundler that supports TLA: webpack ≥5 (with `experiments.topLevelAwait: true`), Vite, Rollup ≥2.77, or esbuild ≥0.15. This requirement SHALL be documented in the v6.0 migration guide.

#### Scenario: TLA requirement in migration guide

- **WHEN** a user reads the v6.0 migration guide
- **THEN** the minimum bundler versions for TLA are listed explicitly

#### Scenario: webpack 4 produces a build error

- **WHEN** `@mcabreradev/filter` is imported in a webpack 4 build
- **THEN** a build-time syntax error is produced; the migration guide directs users to upgrade to webpack ≥5
