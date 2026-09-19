# Rust Core Engine Specification

## Purpose

TBD ... Update Purpose after archive

## Requirements

### Requirement: `FilterOptions` Rust struct fields

The `packages/core/src/config.rs` SHALL define a `FilterOptions` struct with the following fields, derived from the TS `FilterConfig` type. Fields marked **TS-only** are NOT present in the Rust struct; they are stripped by the TS facade before calling Rust.

| TS field                      | Rust field           | Rust type                     | TS-only? |
| ----------------------------- | -------------------- | ----------------------------- | -------- |
| `caseSensitive`               | `case_sensitive`     | `bool` (default `false`)      | No       |
| `maxDepth`                    | `max_depth`          | `usize` (default `3`)         | No       |
| `enableCache`                 | `enable_cache`       | `bool` (default `false`)      | No       |
| `maxCacheSize`                | `max_cache_size`     | `usize` (default `500`)       | No       |
| `debug`                       | `debug`              | `bool` (default `false`)      | No       |
| `verbose`                     | `verbose`            | `bool` (default `false`)      | No       |
| `showTimings`                 | `show_timings`       | `bool` (default `false`)      | No       |
| `limit`                       | `limit`              | `Option<usize>`               | No       |
| `orderBy`                     | `order_by`           | `Option<serde_json::Value>`   | No       |
| `parallelThreshold`           | `parallel_threshold` | `usize` (default `1000`)      | No       |
| `customComparator`            | —                    | (not serializable)            | **Yes**  |
| `colorize`                    | —                    | (display formatting only)     | **Yes**  |
| `enablePerformanceMonitoring` | —                    | (TS FFI overhead measurement) | **Yes**  |

The struct SHALL derive `serde::Deserialize` and `serde::Serialize`. The Cargo.toml SHALL include `lru = "0.12"` and `ahash = "0.8"` as dependencies in addition to the deps listed in D3/D4.

#### Scenario: Options deserialize from JSON correctly

- **WHEN** `serde_json::from_str::<FilterOptions>(r#"{"caseSensitive":true,"maxDepth":5}"#)` is called
- **THEN** the struct fields `case_sensitive = true` and `max_depth = 5` are populated; all other fields use defaults

#### Scenario: TS-only fields are silently ignored

- **WHEN** the JSON options string contains `"colorize": true` or `"customComparator": null`
- **THEN** `serde_json::from_str` succeeds (uses `#[serde(deny_unknown_fields)]` is NOT used — unknown fields are ignored)

### Requirement: Cache key uses canonical JSON hash with `ahash`

The LRU cache key SHALL be a `u64` hash computed with `ahash::AHasher` over the canonical representation of `(expression_bytes, serialized_options)` where `FilterOptions` is serialized to JSON with keys in sorted order using `serde_json` with a `BTreeMap` intermediary.

```rust
fn make_cache_key(expression: &[u8], options: &FilterOptions) -> u64 {
    use std::hash::{Hash, Hasher};
    let opts_canonical = serde_json::to_string(
        &serde_json::to_value(options).unwrap()
            .as_object().unwrap()
            .iter()
            .collect::<std::collections::BTreeMap<_, _>>()
    ).unwrap();
    let mut h = ahash::AHasher::default();
    expression.hash(&mut h);
    opts_canonical.hash(&mut h);
    h.finish()
}
```

#### Scenario: Cache key is order-independent

- **WHEN** `filter` is called twice with the same expression and options but with object keys in a different insertion order
- **THEN** both calls produce the same `u64` cache key and the second hits the cache

### Requirement: Core Rust crate compiles to both native and WASM targets

The `packages/core` crate SHALL compile without errors to both `x86_64-unknown-linux-gnu` (native) and `wasm32-unknown-unknown` (WASM) targets. All platform-specific dependencies SHALL be gated behind `cfg(target_arch)` attributes.

#### Scenario: Native build succeeds

- **WHEN** `cargo build --release` runs in `packages/core`
- **THEN** the crate compiles without errors and produces a library artifact

#### Scenario: WASM build succeeds

- **WHEN** `cargo build --target wasm32-unknown-unknown --release` runs in `packages/core`
- **THEN** the crate compiles without errors

#### Scenario: rayon not included in WASM build

- **WHEN** `packages/core` is compiled for `wasm32-unknown-unknown`
- **THEN** no `rayon` symbols appear in the output and no link errors occur

### Requirement: Public filter API accepts and returns JSON bytes

The core `filter` function SHALL accept `data` and `expression` as `&[u8]` (JSON-encoded) and `FilterOptions` as a typed struct, and return `Result<Vec<u8>, FilterError>` where `Vec<u8>` is a JSON-encoded array of matching items.

#### Scenario: Filter returns matching items

- **WHEN** `filter(data, expression, options)` is called with a valid JSON array and a valid expression
- **THEN** the function returns `Ok(Vec<u8>)` containing only items that match the expression

#### Scenario: Invalid JSON returns error

- **WHEN** `filter(data, expression, options)` is called with malformed JSON in `data`
- **THEN** the function returns `Err(FilterError::InvalidExpression(...))`

### Requirement: All 18+ operators implemented in Rust

The core crate SHALL implement every operator supported by the TS implementation: `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`, `$in`, `$nin`, `$contains`, `$size`, `$startsWith`, `$endsWith`, `$regex`, `$match`, `$and`, `$or`, `$not`, datetime operators (`$recent`, `$upcoming`, `$dayOfWeek`, `$timeOfDay`, `$age`, `$isWeekday`, `$isWeekend`, `$isBefore`, `$isAfter`), and geospatial operators (`$near`, `$geoBox`, `$geoPolygon`).

#### Scenario: Comparison operator filters correctly

- **WHEN** `filter` is called with expression `{"age": {"$gt": 25}}`
- **THEN** only items where `age > 25` are returned

#### Scenario: Regex operator matches pattern

- **WHEN** `filter` is called with expression `{"name": {"$regex": "^Al"}}`
- **THEN** only items where `name` starts with "Al" are returned

#### Scenario: Logical $and combines conditions

- **WHEN** `filter` is called with `{"$and": [{"age": {"$gt": 18}}, {"active": true}]}`
- **THEN** only items satisfying both conditions are returned

### Requirement: Parallel iteration with rayon on native target

On non-WASM targets, the core engine SHALL use `rayon` parallel iterators for array filtering when the input array has more than a configurable threshold of items (default: 1000).

#### Scenario: Large array filtered in parallel

- **WHEN** `filter` is called with an array of 10,000 items on a native target
- **THEN** the result is identical to sequential filtering and executes faster than sequential on multi-core hardware

#### Scenario: WASM uses sequential iteration

- **WHEN** `filter` is called on a WASM target with 10,000 items
- **THEN** the result is identical to the native result (correctness parity)

### Requirement: LRU cache for filter results

The core engine SHALL maintain an LRU cache keyed on `(expression_hash, options_hash)` with a default capacity of 500 entries, configurable via `FilterOptions.maxCacheSize`.

#### Scenario: Repeated identical query returns cached result

- **WHEN** `filter` is called twice with identical data, expression, and options
- **THEN** the second call returns the same result without re-evaluating predicates

#### Scenario: Cache respects max size

- **WHEN** more than `maxCacheSize` unique queries are executed
- **THEN** the oldest entries are evicted and the cache size never exceeds `maxCacheSize`

### Requirement: `customComparator` bypasses the LRU cache

When `FilterOptions.customComparator` is set, the core engine SHALL skip both cache lookup and cache write for that call. A function value cannot be serialized into a deterministic hash, and two calls with the same data and expression but different comparator functions must not share a cached result.

#### Scenario: customComparator does not produce a stale cache hit

- **WHEN** `filter` is called twice with identical data and expression but different `customComparator` functions
- **THEN** both calls execute the full filter pipeline independently; the second call is NOT served from cache

### Requirement: Cache key uses canonical JSON serialization with `ahash`

The LRU cache key SHALL be a `u64` hash computed with `ahash` over the canonical JSON form of `(expression, options)` where object keys are sorted before hashing. This ensures that logically equivalent expressions with different key insertion order map to the same cache entry.

#### Scenario: Expression with transposed keys hits cache

- **WHEN** `filter` is called with expression `{"a":1,"b":2}` and then `{"b":2,"a":1}`
- **THEN** the second call returns the cached result from the first call

### Requirement: Property-based and fuzz tests

The core crate SHALL include `proptest` property-based tests for all operator implementations and a `cargo-fuzz` target for the main `filter` entry point to detect panics on malformed input.

#### Scenario: Proptest finds no correctness violation

- **WHEN** `cargo test` runs the proptest suite with 1000 generated cases per operator
- **THEN** no assertion failures occur

#### Scenario: Fuzz target handles arbitrary JSON without panic

- **WHEN** `cargo fuzz run filter_expression` feeds arbitrary byte inputs
- **THEN** the function returns `Err(...)` for invalid inputs and never panics or produces undefined behavior
