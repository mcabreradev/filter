## Why

`@mcabreradev/filter` is a mature TypeScript filtering engine (v5.10.1) with 18+ operators, lazy evaluation, and framework integrations. The JS runtime limits performance on large datasets and concurrent server workloads. Migrating the core engine to Rust — compiled to both WebAssembly (browser) and a native Node.js addon (napi-rs) — unlocks 5–20x throughput gains, memory safety guarantees, and a clear competitive differentiator in the npm ecosystem, while preserving the exact same public TypeScript API.

## What Changes

- **New**: `packages/core` — pure Rust filtering engine (all operators, comparison, predicate, lazy, cache)
- **New**: `packages/wasm` — `wasm-bindgen` bindings over core, published as `@mcabreradev/filter-wasm`
- **New**: `packages/native` — `napi-rs` bindings over core, published as `@mcabreradev/filter-native-{platform}` (10 platform packages)
- **Modified**: `packages/filter` — current `src/` becomes a thin TS facade with a runtime loader (`native` → `wasm` fallback); framework integrations (React/Vue/Angular/Preact/SolidJS) and type definitions stay in TS
- **Unchanged**: `filter()` return type stays `T[]` — **no breaking API changes**; WASM init is transparent via ESM top-level await at module-load time
- **Removed**: `WeakMap` cache replaced by LRU cache in Rust (`lru` crate) with configurable max size
- **Modified**: Monorepo structure via `pnpm workspaces` + `cargo workspaces` replacing flat `src/`
- **Modified**: CI matrix expands to 10 platform build jobs (napi-rs cross-compilation)
- **Modified**: "zero dependencies" claim replaced by optional native peer deps

## Capabilities

### New Capabilities

- `rust-core-engine`: Pure Rust library crate implementing all filtering logic — operators (comparison, array, string, logical, datetime, geospatial), comparison (deep/object/property), predicate factory, operator processor, pattern matching, memoization, LRU cache, sort, geo-distance, datetime utils, lazy iterators, string helpers, config, and typed error serialization protocol
- `wasm-bindings`: `wasm-bindgen` crate exposing `rust-core-engine` to browser environments; compiled to `.wasm` + JS glue; published as `@mcabreradev/filter-wasm`
- `native-bindings`: `napi-rs` crate exposing `rust-core-engine` as `.node` native addon; compiled per-platform; published as `@mcabreradev/filter-native-{platform}`
- `ts-facade-loader`: Runtime loader in `packages/filter` that detects Node.js vs browser and loads `native` or `wasm` backend; preserves full current public API with backward compatibility
- `error-serialization-protocol`: Typed JSON error payload from Rust (`kind`, `code`, `message`) that maps to existing TS error class hierarchy (`FilterError`, `InvalidExpressionError`, `OperatorError`, etc.)
- `debug-data-serialization`: Rust-side `DebugResult` serialization — structural evaluation data crosses the FFI boundary as JSON; TS debug formatter applies colors and tree rendering

### Modified Capabilities

- `filter-api`: lazy variants updated to handle cfg-gated rayon (parallel on native, sequential on WASM); `filter()` signature, return type, and behavior unchanged

## Impact

- **`src/`**: Entire directory replaced by `packages/filter/src/` (TS facade only)
- **`__test__/`**: Existing vitest suite becomes acceptance/regression guard during migration; individual test files migrated to Rust (`cargo test` + `proptest`) after all waves pass; only `loader`, hooks, and `tsd` type tests remain in TS permanently
- **`package.json`**: Becomes pnpm workspace root; `size-limit` config updated to measure WASM file separately
- **`Cargo.toml`**: New workspace root with `sonic-rs` (native only), `serde_json` (WASM), `rayon` (native only), `regex`, `chrono`, `lru`, `proptest`, `criterion`
- **CI**: GitHub Actions matrix adds 10 platform build jobs; `sccache` for cargo caching
- **Docs/README**: "zero dependencies" claim updated; benchmark section added with TS vs Rust comparison numbers
- **npm**: Three new packages published — `@mcabreradev/filter-wasm`, `@mcabreradev/filter-native` (meta), `@mcabreradev/filter-native-{platform}` ×10
