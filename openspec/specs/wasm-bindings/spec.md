# WASM Bindings Specification

## Purpose

TBD ... Update Purpose after archive

## Requirements

### Requirement: WASM package builds and publishes to npm

The `packages/wasm` crate SHALL use `wasm-pack build --target bundler --release` to produce a `.wasm` file and JS glue code published as `@mcabreradev/filter-wasm` on npm.

#### Scenario: wasm-pack build produces valid output

- **WHEN** `wasm-pack build --target bundler --release` runs in `packages/wasm`
- **THEN** a `pkg/` directory is created containing `.wasm`, `.js`, and `.d.ts` files

#### Scenario: Package publishes successfully

- **WHEN** `npm publish` runs from `packages/wasm/pkg/`
- **THEN** `@mcabreradev/filter-wasm` is available on the npm registry

### Requirement: WASM bundle size within limit

The compiled `.wasm` file after `wasm-opt` optimization SHALL be less than 200KB gzipped.

#### Scenario: Size check passes in CI

- **WHEN** the CI size-limit check runs on the WASM artifact
- **THEN** the gzipped `.wasm` file is ≤ 200KB

### Requirement: WASM bindings expose filter function

The `packages/wasm` crate SHALL expose a `filter(data: &str, expression: &str, options: JsValue) -> Result<String, JsValue>` function via `#[wasm_bindgen]` that delegates to `packages/core::filter`.

#### Scenario: filter returns correct result from browser

- **WHEN** the WASM module is loaded in a browser context and `filter('[{"a":1}]', '{"a":{"$gt":0}}', {})` is called
- **THEN** the result is `'[{"a":1}]'`

#### Scenario: filter propagates errors as JS exceptions

- **WHEN** `filter` is called with malformed JSON expression
- **THEN** a JS `Error` is thrown with the serialized `FilterErrorPayload`

### Requirement: WASM module initialization is idempotent

The default WASM init function SHALL be safe to call multiple times; subsequent calls after the first SHALL be no-ops.

#### Scenario: Double init does not throw

- **WHEN** `await wasmInit()` is called twice in sequence
- **THEN** no error is thrown on the second call
