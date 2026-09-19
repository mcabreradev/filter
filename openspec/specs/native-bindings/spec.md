# Native Bindings Specification

## Purpose

TBD ... Update Purpose after archive

## Requirements

### Requirement: Native addon compiles for 10 platform targets

The `packages/native` crate SHALL compile to `.node` native addons for the following targets: `linux-x64-gnu`, `linux-arm64-gnu`, `linux-x64-musl`, `linux-arm64-musl`, `darwin-x64`, `darwin-arm64`, `win32-x64-msvc`, `win32-arm64-msvc`, `win32-ia32-msvc`, `linux-ia32-gnu`.

#### Scenario: CI matrix builds all platforms

- **WHEN** a release tag is pushed to the repository
- **THEN** the GitHub Actions matrix successfully builds and uploads `.node` artifacts for all 10 targets

#### Scenario: Platform package installs correct binary

- **WHEN** a user runs `npm install @mcabreradev/filter` on `darwin-arm64`
- **THEN** only `@mcabreradev/filter-native-darwin-arm64` is installed as an optional dependency

### Requirement: Native bindings expose synchronous filter function

The `packages/native` crate SHALL expose both `filter(data: String, expression: String, options: String) -> Result<String>` (async-compatible) and `filterSync(data: String, expression: String, options: String) -> Result<String>` (synchronous) via `#[napi]`. The `options` parameter is a JSON-serialized string matching the `FilterOptions` Rust struct (per D2: all FFI arguments are JSON strings). The return value is:

- A plain JSON array string when `debug: false` (default)
- A JSON envelope string `{"result": "[...]", "debug": {...}}` when `debug: true`

#### Scenario: filterSync returns result without Promise

- **WHEN** `filterSync('[{"a":1}]', '{"a":{"$gt":0}}', {})` is called in Node.js
- **THEN** the function returns `'[{"a":1}]'` synchronously without returning a Promise

#### Scenario: native filter outperforms WASM on large arrays

- **WHEN** `filter` is called with an array of 100,000 items in Node.js
- **THEN** the native addon returns results at least 5x faster than the equivalent WASM call

### Requirement: Native addon falls back gracefully if not available

The TS facade loader SHALL catch import errors for `@mcabreradev/filter-native` and fall back to the WASM backend without throwing.

#### Scenario: Unsupported platform uses WASM

- **WHEN** `@mcabreradev/filter-native` is not available for the current platform
- **THEN** the facade silently loads `@mcabreradev/filter-wasm` and all `filter()` calls succeed

### Requirement: Native packages published as optionalDependencies

Each platform-specific `@mcabreradev/filter-native-{platform}` package SHALL be listed as an `optionalDependency` in `@mcabreradev/filter-native/package.json` so npm/pnpm/yarn install only the matching binary.

#### Scenario: Install only downloads relevant binary

- **WHEN** `npm install @mcabreradev/filter` runs on `linux-x64-gnu`
- **THEN** only one `@mcabreradev/filter-native-linux-x64-gnu` binary package is downloaded
