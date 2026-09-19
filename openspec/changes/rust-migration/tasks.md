## 1. Monorepo Setup

- [ ] 1.1 Create `pnpm-workspace.yaml` with `packages/*` glob
- [ ] 1.2 Create root `Cargo.toml` as cargo workspace with `members = ["packages/core", "packages/wasm", "packages/native"]`
- [ ] 1.3 Move current `src/` → `packages/filter/src/` and update root `package.json` to workspace root
- [ ] 1.4 Create `packages/core/Cargo.toml` with `[lib]` crate-type and `serde = { version = "1", features = ["derive"] }`, `serde_json = "1"`, `lru = "0.12"`, `ahash = "0.8"` as base dependencies; add `cfg`-gated `sonic-rs = "0.3"` (native only) and `rayon = "1"` (native only)
- [ ] 1.5 Create `packages/wasm/Cargo.toml` depending on `packages/core` with `wasm-bindgen`, `js-sys`, `wasm-bindgen-futures`
- [ ] 1.6 Create `packages/native/Cargo.toml` depending on `packages/core` with `napi` (napi9) and `napi-derive`
- [ ] 1.7 Create `packages/filter/package.json` — this is the public npm package, replaces root package.json as main publish target
- [ ] 1.8 Verify `pnpm install` + `cargo build` succeed from repo root

## 2. Wave 1 — Config, Constants, Errors

- [ ] 2.1 Write Rust tests in `packages/core/tests/config_test.rs` translating `src/config/` vitest cases
- [ ] 2.2 Implement `packages/core/src/config.rs` — `FilterOptions` struct with all Rust-side fields (`case_sensitive`, `max_depth`, `enable_cache`, `max_cache_size`, `debug`, `verbose`, `show_timings`, `limit`, `order_by`, `parallel_threshold`); derive `Serialize`/`Deserialize`; use `#[serde(default)]` with correct defaults; `customComparator`, `colorize`, `enablePerformanceMonitoring` are NOT in this struct
- [ ] 2.3 Write Rust tests in `packages/core/tests/errors_test.rs` translating `src/errors/` vitest cases
- [ ] 2.4 Implement `packages/core/src/errors.rs` — `FilterError` enum with 8 variants + `FilterErrorPayload` serialization struct
- [ ] 2.5 Implement `packages/core/src/constants.rs` — operator name constants
- [ ] 2.6 Run `cargo test` — Wave 1 green

## 3. Wave 2 — Utilities

- [ ] 3.1 Write Rust tests translating `src/utils/pattern-matching/`, `memoization/`, `operator-detection/`, `string-helpers/`, `sort/` vitest cases
- [ ] 3.2 Implement `packages/core/src/utils/pattern.rs` — SQL wildcard matching (`%` = any sequence, `_` = any char)
- [ ] 3.3 Implement `packages/core/src/utils/memo.rs` — LRU-backed regex cache and predicate cache
- [ ] 3.4 Implement `packages/core/src/utils/detection.rs` — operator expression detection
- [ ] 3.5 Implement `packages/core/src/utils/strings.rs` — string helper utilities
- [ ] 3.6 Implement `packages/core/src/utils/sort.rs` — `orderBy` multi-field sort logic
- [ ] 3.7 Write Rust tests for `geo-distance/` and `date-time/` utils
- [ ] 3.8 Implement `packages/core/src/utils/geo.rs` — Haversine formula, `isValidGeoPoint`
- [ ] 3.9 Implement `packages/core/src/utils/datetime.rs` — `isValidDate`, `calculateTimeDifference`, `calculateAge`, weekday/weekend helpers
- [ ] 3.10 Implement `packages/core/src/utils/lazy_iter.rs` — `take`, `skip`, `map`, `reduce`, `chunk`, `flatten` as iterator adapters
- [ ] 3.11 Run `cargo test` — Wave 2 green

## 4. Wave 3 — Comparison

- [ ] 4.1 Write Rust tests translating `src/comparison/deep/`, `object/`, `property/` vitest cases
- [ ] 4.2 Implement `packages/core/src/comparison/deep.rs` — recursive deep equality with `maxDepth`
- [ ] 4.3 Implement `packages/core/src/comparison/object.rs` — object comparison with maxDepth support
- [ ] 4.4 Implement `packages/core/src/comparison/property.rs` — property-level comparison with SQL wildcard support (`%`, `_`); depends on `utils/pattern.rs` from Wave 2
- [ ] 4.5 Run `cargo test` — Wave 3 green

## 5. Wave 4 — Core Operators (comparison, array, string, logical)

- [ ] 5.1 Write Rust tests translating `src/operators/comparison/comparison.operators.test.ts`
- [ ] 5.2 Implement `packages/core/src/operators/comparison.rs` — `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`
- [ ] 5.3 Write Rust tests translating `src/operators/array/array.operators.test.ts`
- [ ] 5.4 Implement `packages/core/src/operators/array.rs` — `$in`, `$nin`, `$contains`, `$size`
- [ ] 5.5 Write Rust tests translating `src/operators/string/string.operators.test.ts`
- [ ] 5.6 Implement `packages/core/src/operators/string.rs` — `$startsWith`, `$endsWith`, `$contains`, `$regex`, `$match`
- [ ] 5.7 Write Rust tests translating `src/operators/logical/logical.operators.test.ts`
- [ ] 5.8 Implement `packages/core/src/operators/logical.rs` — `$and`, `$or`, `$not`
- [ ] 5.9 Run `cargo test` — Wave 4 green

## 6. Wave 5 — Datetime and Geospatial Operators

- [ ] 6.1 Write Rust tests translating `src/operators/datetime/` test cases
- [ ] 6.2 Implement `packages/core/src/operators/datetime.rs` — `$recent`, `$upcoming`, `$dayOfWeek`, `$timeOfDay`, `$age`, `$isWeekday`, `$isWeekend`, `$isBefore`, `$isAfter` using `chrono`
- [ ] 6.3 Write Rust tests translating `src/operators/geospatial/geospatial.operators.test.ts`
- [ ] 6.4 Implement `packages/core/src/operators/geospatial.rs` — `$near` (Haversine), `$geoBox`, `$geoPolygon` (point-in-polygon)
- [ ] 6.5 Run `cargo test` — Wave 5 green

## 7. Wave 6–7 — Operator Processor and Predicate Factory

- [ ] 7.1 Write Rust tests translating `src/operators/operator-processor.ts` test cases and `src/operators/integration.test.ts`
- [ ] 7.2 Implement `packages/core/src/operators/mod.rs` — central dispatcher that routes operator expressions to specific operator implementations
- [ ] 7.3 Write Rust tests translating `src/predicate/factory/` test cases
- [ ] 7.4 Implement `packages/core/src/predicate/mod.rs` — predicate factory: detect string wildcard / negation / object / function / primitive expressions and build appropriate predicate
- [ ] 7.5 Run `cargo test` — Waves 6–7 green

## 8. Wave 8 — Core Filter Engine + LRU Cache

- [ ] 8.1 Write Rust tests translating `__test__/filter.test.ts` (main integration suite) as `packages/core/tests/filter_test.rs`
- [ ] 8.2 Implement `packages/core/src/filter.rs` — main `filter()` fn: parse JSON input, apply predicate factory + operator processor, return JSON result
- [ ] 8.3 Integrate LRU cache (`lru` crate) keyed on `(expression_hash, options_hash)`, respect `enableCache` and `maxCacheSize` options
- [ ] 8.4 Add `cfg`-gated `rayon` parallel iterator path for arrays > 1000 items on non-WASM targets
- [ ] 8.5 Write `proptest` property-based tests for core filter correctness
- [ ] 8.6 Run `cargo test` — Wave 8 green

## 9. Wave 9 — Lazy Engine

- [ ] 9.1 Write Rust tests translating lazy function tests (`filterLazy`, `filterFirst`, `filterExists`, `filterCount`, `filterChunked`)
- [ ] 9.2 Implement `packages/core/src/lazy.rs` — generator-style lazy filtering using Rust iterators; `cfg`-gated `rayon` parallel path for native
- [ ] 9.3 Implement `filterFirst`, `filterExists`, `filterCount` as early-exit iterator consumers
- [ ] 9.4 Implement `filterChunked` and `filterLazyChunked` using `chunks()` + lazy eval
- [ ] 9.5 Note: `filterLazyAsync` ships Node.js native-only in v6.0; defer WASM async generators to v6.1
- [ ] 9.6 Run `cargo test` — Wave 9 green

## 10. Wave 10 — Debug Data Serialization

- [ ] 10.1 Write Rust tests for debug mode: verify `DebugResult` JSON output structure matches TS `DebugResult` type
- [ ] 10.2 Implement debug collection in `packages/core/src/filter.rs` — when `debug: true`, wrap each predicate evaluation in a timing + result recorder
- [ ] 10.3 Implement `DebugNode`, `DebugResult`, `DebugStats` as `#[derive(Serialize)]` structs in `packages/core/src/debug.rs`
- [ ] 10.4 Return debug payload alongside filter result as `{ result: Vec<u8>, debug: Option<Vec<u8>> }`
- [ ] 10.5 Run `cargo test` — Wave 10 green

## 11. Wire Bindings + TS Facade

- [ ] 11.1 Implement `packages/wasm/src/lib.rs` — `#[wasm_bindgen]` `filter()` function delegating to `core::filter`; serialize options from `JsValue`
- [ ] 11.2 Run `wasm-pack build --target bundler --release` — verify `.wasm` + JS glue output
- [ ] 11.3 Run `wasm-opt` and verify WASM bundle ≤ 200KB gzipped
- [ ] 11.4 Implement `packages/native/src/lib.rs` — `#[napi]` `filter()` and `filterSync()` functions delegating to `core::filter`
- [ ] 11.5 Run `napi build --platform --release` — verify `.node` output on local platform
- [ ] 11.6 Implement `packages/filter/src/loader.ts` — eager WASM init + runtime native/WASM selector
- [ ] 11.7 Update `packages/filter/src/index.ts` — all exports proxy to Rust backend via loader
- [ ] 11.8 Keep `packages/filter/src/integrations/` hooks unchanged — `filter()` stays sync so no modifications needed; verify hooks compile against v6 facade
- [ ] 11.9 Run full vitest suite: **all tests must pass without modification** — this is the acceptance gate
- [ ] 11.10 Expose `clearFilterCache()` and `getFilterCacheStats()` via both napi and wasm bindings; wire to `packages/filter/src/index.ts` exports

## 12. Migrate Tests to Rust

- [ ] 12.1 For each TS test file with logic now in Rust, translate to `packages/core/tests/` and verify `cargo test` green
- [ ] 12.2 Delete translated TS test files from `src/**/*.test.ts` and `__test__/` (except: `loader.test.ts`, hooks tests, `test-d/` type tests, `package-exports.test.ts`, `modular-imports.test.ts`)
- [ ] 12.3 Add `cargo-fuzz` target in `packages/core/fuzz/fuzz_targets/filter_expression.rs`
- [ ] 12.4 Verify `cargo test + vitest` both green after migration

## 13. CI/CD and Release Infrastructure

- [ ] 13.1 Add `napi-rs` CI matrix workflow (`.github/workflows/ci.yml`) — 10 platform build jobs triggered on `release/*` tags
- [ ] 13.2 Configure `sccache` + GitHub Actions `~/.cargo` cache for fast CI
- [ ] 13.3 Add `criterion` benchmark in `packages/core/benches/filter_bench.rs` — benchmark 10k/100k item arrays vs TS baseline
- [ ] 13.4 Update `size-limit` config to measure WASM artifact separately from JS bundle
- [ ] 13.5 Update `packages/native/package.json` with `optionalDependencies` for all 10 platform packages
- [ ] 13.6 Update README — remove "zero dependencies" claim, add benchmark numbers, note v6 has no breaking API changes
- [ ] 13.7 Add `PROPTEST_SEED` env var to CI workflow for reproducible property-based test runs
- [ ] 13.8 Bump version to `6.0.0` across all packages
- [ ] 13.9 Publish in order: `@mcabreradev/filter-native-{platform}` ×10 → `@mcabreradev/filter-wasm` → `@mcabreradev/filter`

## 14. Framework Integrations — Verification Only

- [ ] 14.1 Verify React hooks (`useFilter`, `useFilteredState`, `useDebouncedFilter`, `usePaginatedFilter`) compile and pass tests against v6 facade — no code changes expected since `filter()` stays sync
- [ ] 14.2 Verify Vue, Angular, Preact, SolidJS integrations compile and pass tests against v6 facade — no code changes expected
- [ ] 14.3 Run all integration tests for all 5 frameworks — all green with zero modifications

## 15. Unresolved Capabilities & Gaps

- [ ] 15.1 `PerformanceMonitor` stays in TS — update to measure Rust FFI call overhead (time from JS call to JS return) instead of internal JS computation time; update `PerformanceMetrics` type if needed
- [ ] 15.2 `TypedFilterBuilder` stays in TS — terminal builder methods (`execute()`, `first()`, etc.) stay synchronous since `filter()` returns `T[]`; no changes needed
- [ ] 15.3 Add `parallelThreshold` to `FilterOptions` TS type and `FilterConfig` Rust struct (default: `1000`); wire through to rayon gating condition
- [ ] 15.4 `filterLazyAsync` on WASM target: throw `ConfigurationError` with code `"ASYNC_LAZY_NOT_SUPPORTED_IN_BROWSER"` — document as v6.1 target
- [ ] 15.5 Define validation order: `validateExpression` / `validateOptions` (Zod) run BEFORE Rust call as boundary guard; Rust errors bypass Zod and go directly to error serialization protocol
- [ ] 15.6 `__test__/limit.test.ts` — port to `packages/core/tests/limit_test.rs` then delete TS file
- [ ] 15.7 `__test__/memoization-integration.test.ts` — port to `packages/core/tests/memoization_test.rs` then delete TS file
