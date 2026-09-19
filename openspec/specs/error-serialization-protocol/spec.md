# Error Serialization Protocol Specification

## Purpose

TBD ... Update Purpose after archive

## Requirements

### Requirement: Rust errors serialize to typed JSON payload

When the Rust core returns an error, it SHALL serialize it as a JSON object with fields `kind` (string discriminant), `code` (error code string), and `message` (human-readable string). The TS facade SHALL deserialize this payload and construct the appropriate error class instance.

**Concrete FFI transmission mechanism:**

- **napi-rs**: Rust SHALL throw `napi::Error::new(Status::GenericFailure, serde_json::to_string(&payload).unwrap_or_default())`. The serialized payload is in `err.message`. The TS facade wraps every napi call in `try/catch`, detects a JSON message starting with `{"kind":`, parses it, and reconstructs the error class.
- **wasm-bindgen**: Rust SHALL return `Err(JsValue::from_str(&serde_json::to_string(&payload).unwrap_or_default()))`. The TS facade catches the thrown value, JSON-parses it, and reconstructs the error class.
- **TS reconstruction pattern**:
  ```typescript
  function reconstructError(raw: unknown): FilterError {
    let payload: FilterErrorPayload;
    try {
      payload = JSON.parse(typeof raw === 'object' ? (raw as Error).message : String(raw));
    } catch {
      throw new FilterError('UNKNOWN', String(raw));
    }
    // dispatch on payload.kind ...
  }
  ```

#### Scenario: InvalidExpressionError reconstructed in TS

- **WHEN** the Rust core returns `Err(FilterError::InvalidExpression { code: "INVALID_OPERATOR", message: "Unknown operator $foo" })`
- **THEN** the TS facade throws an `InvalidExpressionError` instance with matching `code` and `message`

#### Scenario: OperatorError reconstructed in TS

- **WHEN** the Rust core returns `Err(FilterError::Operator { code: "TYPE_MISMATCH", message: "..." })`
- **THEN** the TS facade throws an `OperatorError` instance

#### Scenario: instanceof check works after reconstruction

- **WHEN** a user catches an error from `filter()` and checks `err instanceof FilterError`
- **THEN** the check returns `true`

### Requirement: All 8 TS error classes have Rust counterparts

The Rust `FilterError` enum SHALL have variants corresponding to all 8 TS error classes: `FilterError`, `InvalidExpressionError`, `OperatorError`, `ValidationError`, `TypeMismatchError`, `GeospatialError`, `ConfigurationError`, `PerformanceLimitError`.

#### Scenario: Error kind maps 1:1 to TS class

- **WHEN** each Rust error variant is serialized
- **THEN** the `kind` field value matches the TS class name used for reconstruction

### Requirement: Error payload does not expose internal Rust details

The serialized error message SHALL be user-friendly and SHALL NOT contain Rust-specific terms (e.g., `unwrap`, `panic`, stack trace, `src/` paths).

#### Scenario: Error message is user-friendly

- **WHEN** an error occurs during filtering
- **THEN** the `message` field contains a human-readable description suitable for display to end users

### Requirement: Unknown `kind` degrades gracefully to base FilterError

If the TS facade receives a `FilterErrorPayload` with a `kind` value it does not recognize (e.g., from a newer Rust core version than the facade), it SHALL construct a base `FilterError` instance using the `code` and `message` fields, emit a `console.warn` identifying the unrecognized `kind`, and re-throw. It SHALL NOT crash or throw an unrelated error.

#### Scenario: Future Rust error kind reconstructed as base FilterError

- **WHEN** the Rust core returns `{ kind: "FutureErrorType", code: "UNKNOWN_OP", message: "..." }`
- **THEN** the TS facade throws a `FilterError` with `code: "UNKNOWN_OP"` and the original `message`; `console.warn` is called with `"[filter] unrecognized error kind: FutureErrorType"`

#### Scenario: instanceof FilterError still holds for unknown kinds

- **WHEN** a user catches an error from an unknown `kind`
- **THEN** `err instanceof FilterError` returns `true`
