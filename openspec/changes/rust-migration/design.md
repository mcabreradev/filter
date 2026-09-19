## Context

`@mcabreradev/filter` v5.10.1 is a TypeScript filtering engine with 18+ MongoDB-style operators, lazy evaluation, memoization, and framework integrations (React, Vue, Angular, Preact, SolidJS). Current architecture: pure TypeScript compiled to ESM, zero runtime deps except Zod.

The JS engine limits throughput on large datasets. V8 JIT can't match compiled Rust for tight filter loops, regex matching, or parallel iteration. This design migrates all filtering logic to a Rust core compiled to two targets — WebAssembly (browser) and a native Node.js addon via napi-rs — while preserving the full public TypeScript API.

**Constraints:**

- Must publish to npm with same package name (`@mcabreradev/filter`)
- **No breaking changes** — `filter()` return type stays `T[]`, API is identical to v5
- Existing vitest test suite is the acceptance contract — must pass 100% after migration with zero test modifications
- WASM bundle must be < 200KB gzipped (size-limit enforced)

## Goals / Non-Goals

**Goals:**

- Port all filtering logic (operators, comparison, predicate, cache, lazy, utils) to Rust `packages/core`
- Compile to WASM via `wasm-bindgen` (`packages/wasm`) for browser support
- Compile to native Node.js addon via `napi-rs` (`packages/native`) for server performance
- Thin TypeScript facade in `packages/filter` with runtime loader selecting best backend
- TDD approach: translate existing TS tests to Rust first per wave, implement until green
- After full port: migrate remaining vitest tests to Rust; only loader, hooks, and type tests stay in TS
- CI cross-compilation matrix: 10 platform/arch combinations
- Benchmark suite proving ≥5x speedup over TS baseline

**Non-Goals:**

- Rewriting framework integrations (React/Vue/Angular hooks stay in TS)
- Changing any TypeScript type definitions
- Removing the Zod validation layer (stays as boundary guard in TS facade)
- Supporting WASM threads/SharedArrayBuffer (WASM target is single-threaded)
- Backward compat with CommonJS (already ESM-only)

## Decisions

### D1: Monorepo with `pnpm workspaces` + `cargo workspaces`

**Decision:** Single repo, four packages: `core` (Rust), `wasm`, `native`, `filter` (TS facade).

**Rationale:** Atomic commits across Rust core + TS facade prevent version drift. `pnpm workspaces` already in stack. Single CI pipeline. Precedent: `rolldown`, `oxc`, `biome`.

**Alternatives considered:**

- _Two repos_: Version pinning pain, coordinated releases across repos — rejected.
- _Flat `rust/` directory_: No independent versioning for wasm/native packages — rejected.

---

### D2: JSON byte boundary (`&[u8]`) between Rust and JS

**Decision:** Rust core accepts and returns raw JSON bytes (`&[u8]`). Both WASM and native bindings serialize at their boundary layer, not inside core.

**Rationale:** Zero-copy deserialization with `sonic-rs` (native) or `serde_json` (WASM). Avoids double-parsing. Both `wasm-bindgen` and `napi-rs` handle byte slices natively.

**Alternatives considered:**

- _Typed Rust structs across FFI_: Requires complex `serde` roundtrip at boundary, limits core portability — rejected.
- _`serde_json::Value` in core_: Allocates intermediate tree on every call — rejected.

**Serialization overhead note:** The full round-trip includes `JSON.stringify` in JS before the napi/wasm call and `JSON.parse` after. The ≥5x speedup criterion (benchmark task 13.3) is measured **end-to-end** including this serialization cost, not just at the Rust computation layer.

---

### D3: `sonic-rs` for native, `serde_json` for WASM (cfg-gated)

**Decision:** Use compile-time `cfg(target_arch)` to select JSON parser.

```toml
[target.'cfg(not(target_arch = "wasm32"))'.dependencies]
sonic-rs = "0.3"   # SIMD x86/ARM, 3-5x faster than serde_json

[dependencies]
serde_json = "1"   # fallback, verified WASM support
```

**Rationale:** `sonic-rs` uses SIMD intrinsics unavailable in WASM. `serde_json` is the safe baseline for all targets. Using `cfg` means same `core` crate compiles to both targets cleanly.

---

### D4: `rayon` for native only (cfg-gated); sequential iterators for WASM

**Decision:** Data-parallel iteration with `rayon` gated behind `cfg(not(target_arch = "wasm32"))`.

**Rationale:** `rayon` requires OS threads — unavailable in WASM (single-threaded by spec). Native benefits from parallel filtering of large arrays. WASM uses standard sequential iterators.

---

### D5: Eager WASM initialization — `filter()` is and stays sync

**Decision:** WASM module initializes at module-load time via ESM top-level await. Exported `filter()` is a plain synchronous function — no `async`, no `Promise` return type.

```typescript
// loader.ts (module level — runs at import time via ESM TLA)
const backend = await (async () => {
  if (typeof process?.versions?.node !== 'undefined') {
    try {
      return await import('@mcabreradev/filter-native');
    } catch {}
  }
  const wasm = await import('@mcabreradev/filter-wasm');
  await wasm.default(); // idempotent WASM init
  return wasm;
})();

// All exported functions are plain sync after TLA completes
export function filter<T>(
  data: T[],
  expression: FilterExpression<T>,
  options?: FilterOptions,
): T[] {
  const rustOptions = stripTsOnlyOptions(options);
  const raw = backend.filter_sync(
    JSON.stringify(data),
    JSON.stringify(expression),
    JSON.stringify(rustOptions),
  );
  return parseRustResult(raw, options);
}
```

**Rationale:** WASM functions are synchronous once the module is instantiated. ESM top-level await causes the module to be fully ready before any consumer can call `filter()`. The napi native addon exposes a synchronous `filter_sync` call. No user-facing API change required — `filter()` returns `T[]` in v5 and v6.

**Alternatives considered:**

- _`export async function filter()`_: Returns `Promise<T[]>` — breaks every existing call site, all framework hooks, all tests. Rejected.
- _Fully sync via bundler inlining_: Requires bundler config changes from users — rejected.

---

### D6: LRU cache in Rust replacing WeakMap

**Decision:** `lru` crate with configurable `maxCacheSize` (default: 500 entries).

**Rationale:** Rust `HashMap` has no GC — uncapped cache grows indefinitely on long-running Node.js servers. `lru` provides O(1) eviction. `WeakMap` semantics not reproducible in Rust without unsafe code.

---

### D7: Typed error serialization protocol

**Decision:** Rust returns error payloads as JSON with `kind`, `code`, `message` fields. TS facade reconstructs the correct error class.

```rust
// errors.rs
#[derive(Serialize)]
pub struct FilterErrorPayload {
    pub kind: &'static str,   // "InvalidExpression" | "Operator" | ...
    pub code: &'static str,   // "INVALID_OPERATOR" etc.
    pub message: String,
}
```

**Rationale:** 8 distinct TS error classes must be preserved for users doing `instanceof FilterError` checks. Without this protocol, all errors arrive as generic strings.

---

### D8: TDD wave-based port order

**Decision:** Port in 9 waves, tests written before implementation per wave. Existing vitest suite is acceptance gate (stays red until full wiring complete in Wave 11).

```
Wave 1:  config, constants, errors (+ error protocol)
Wave 2:  utils (pattern-matching, memo, geo, datetime, sort, strings, lazy-iters, op-detect)
Wave 3:  comparison (deep, object, property) — depends on utils/pattern.rs from Wave 2
Wave 4:  operators/comparison, array, string, logical
Wave 5:  operators/datetime (9 ops), geospatial (3 ops)
Wave 6:  operator-processor (dispatcher)
Wave 7:  predicate/factory
Wave 8:  core/filter + LRU cache
Wave 9:  lazy engine (filterLazy, filterLazyAsync, filterChunked, filterFirst, filterExists, filterCount)
Wave 10: debug data serialization (DebugResult → JSON)
Wave 11: Wire WASM + native bindings; TS loader; vitest all green
Wave 12: Migrate vitest tests to Rust; delete TS tests except loader/hooks/tsd
Wave 13: v6.0.0 release + CI matrix
```

### D9: `filterLazy` materializes results at the FFI boundary

**Decision:** `filterLazy()` and `filterLazyChunked()` materialize the complete filtered `Vec<T>` inside Rust before returning it as a JSON byte slice. The TS facade wraps the result in a synchronous generator for API surface compatibility.

**Rationale:** napi-rs 9 and `wasm-bindgen` do not support streaming iterators across the FFI boundary without WASM threads or SharedArrayBuffer (both unavailable in v6.0 scope). Rust still applies rayon-parallel filtering before materialization, preserving throughput gains. True lazy streaming is targeted for v6.1 (Node.js Readable stream via napi-rs / WASM async generators).

**Exception for short-circuit functions:** `filterFirst`, `filterExists`, and `filterCount` use `Iterator::find()` / `Iterator::any()` / `Iterator::count()` in Rust and return a scalar — they do NOT materialize the full array before returning.

**Alternatives considered:**

- _Node.js Readable stream via napi-rs_: Viable for v6.1 — deferred.
- _WASM async generators_: Requires repeated JS callback invocations or WASM threads — deferred.

---

## Risks / Trade-offs

| Risk                                        | Mitigation                                                                                                     |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `rayon` compile error on WASM target        | `cfg(not(target_arch = "wasm32"))` gate on all rayon imports — verified at Wave 9                              |
| `sonic-rs` future WASM support changes      | Pinned version in `Cargo.lock`; `cfg` gate is trivially removable when stable                                  |
| WASM bundle bloat from `regex` crate        | `wasm-opt` + `wasm-pack --release`; measure with `size-limit`; regex cache reduces repeated compilation cost   |
| `filter()` sync guarantee in all bundlers   | ESM TLA is supported by webpack ≥5, Vite, Rollup ≥2.77, esbuild ≥0.15; document bundler requirements in README |
| 10-platform CI matrix = slow patch releases | `sccache` + GitHub Actions cache for `~/.cargo`; matrix only runs on `release/*` branches for patch fixes      |
| Long-running server cache unbounded growth  | LRU cap at 500 entries by default; user-configurable via `maxCacheSize` option                                 |
| debug tree data crosses FFI boundary        | `DebugResult` serialized as JSON from Rust; TS formatter handles display only — tested via integration test    |
| "zero dependencies" claim breaks            | README updated before v6 launch; `optionalDependencies` pattern means install still works anywhere             |

## Open Questions

- **WASM threads future**: WASM shared memory threads are experimental. Monitor `wasm-bindgen` rayon support (`wasm-bindgen-rayon`) for potential v6.x upgrade path.
- **`filterLazyAsync`**: Generator-based async iteration in WASM is non-trivial. Ship as Node.js native-only in v6.0 and revisit for v6.1 with WASM async generators.
- **`size-limit` WASM measurement**: Determine correct `size-limit` config to measure `.wasm` file separately from JS bundle. Target: < 200KB gzipped for WASM artifact.
- **`proptest` in CI**: Property-based tests generate random cases — seed for reproducibility in CI with `PROPTEST_SEED` env var.
