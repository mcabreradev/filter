## UNCHANGED Requirements

### Requirement: filter() return type stays T[] — no breaking change

The main `filter<T>(data: T[], expression: FilterExpression<T>, options?: FilterOptions): T[]` function SHALL continue to return `T[]` synchronously. The v6 public API is **fully backward compatible** with v5.

The WASM module is initialized at module-load time via ESM top-level await. By the time any user code can call `filter()`, the WASM is already ready and all calls are synchronous. The napi native addon uses a synchronous napi export internally. Neither backend requires an async call from the user's perspective.

#### Scenario: filter() returns T[] synchronously

- **WHEN** `const result = filter(data, { age: { $gt: 25 } })` is called
- **THEN** `result` is `T[]` immediately — no Promise, no await required

#### Scenario: Existing v5 code runs unchanged in v6

- **WHEN** a v5 user upgrades to v6 without changing any call sites
- **THEN** all existing `filter()` calls compile and run correctly with zero modifications

#### Scenario: Vitest test suite passes without modification

- **WHEN** the existing `__test__/filter.test.ts` runs against the v6 facade
- **THEN** all tests pass — no test modifications required

## ADDED Requirements

### Requirement: filterSync() is an internal napi alias, not a public export

The napi binding layer exposes a synchronous `filter_sync` function for use by the TS facade internally. This is NOT exported from `packages/filter/src/index.ts` and is not part of the public API. Users have no new exports to learn.

---

### Requirement: Lazy variants updated for cfg-gated parallelism

`filterLazy`, `filterLazyAsync`, `filterChunked`, `filterLazyChunked`, `filterFirst`, `filterExists`, `filterCount` SHALL all proxy to the Rust lazy engine. On native targets, large inputs SHALL use `rayon` parallel iterators internally; on WASM, sequential iterators are used. The public API and return types SHALL be identical to v5.

#### Scenario: filterLazy returns matching items lazily

- **WHEN** `filterLazy(data, expression)` is called and iterated with `take(5)`
- **THEN** only the first 5 matching items are evaluated (early exit)

#### Scenario: filterFirst returns first match

- **WHEN** `filterFirst(data, expression)` is called
- **THEN** only one item is returned — the first match — without evaluating the rest of the array
