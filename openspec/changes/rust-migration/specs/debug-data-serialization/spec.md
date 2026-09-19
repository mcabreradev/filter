## ADDED Requirements

### Requirement: Rust engine serializes DebugResult as JSON

When `FilterOptions.debug` is `true`, the Rust core SHALL collect evaluation metadata per condition (field, operator, matched, itemCount, timingMs) and serialize it as a `DebugResult` JSON payload returned alongside the filtered array.

**Concrete FFI return envelope:**

When `debug: false` (default), the napi/wasm binding functions return the filtered array as a plain JSON string: `"[{...}, {...}]"`.

When `debug: true`, the binding functions return a JSON **envelope object** string:

```json
{"result": "[{...}, {...}]", "debug": { "nodes": [...], "stats": {...} }}
```

The `result` field is the JSON-serialized filtered array (a string). The `debug` field is the serialized `DebugResult` object.

The TS facade detects the active mode from the options it sent (`options.debug === true`) and parses accordingly:

- `debug: false` → `JSON.parse(rawString)` as `T[]`
- `debug: true` → `JSON.parse(rawString)` as `{ result: string; debug: DebugResult }`, then `JSON.parse(parsed.result)` as `T[]`

#### Scenario: Debug mode returns structured evaluation tree

- **WHEN** `filter(data, expression, { debug: true })` is called
- **THEN** the response includes a `debug` field containing a tree of `DebugNode` objects matching the existing `DebugResult` TypeScript type

#### Scenario: Non-debug mode has zero overhead

- **WHEN** `filter(data, expression, { debug: false })` is called
- **THEN** no debug metadata is collected and the `debug` field is absent from the response

---

### Requirement: TS debug formatter operates on Rust-provided data

The TS `filterDebug()` function SHALL receive the `DebugResult` JSON from the Rust backend and apply terminal color formatting, tree indentation, and timing display. It SHALL NOT compute evaluation results itself.

#### Scenario: filterDebug renders tree from Rust data

- **WHEN** `filterDebug(data, expression, options)` is called
- **THEN** it calls the Rust backend with `debug: true`, receives the `DebugResult`, and formats it using the existing TS debug formatter

---

### Requirement: DebugResult schema matches existing TypeScript types

The JSON structure emitted by Rust SHALL be deserializable into the existing `DebugResult`, `DebugNode`, `DebugOptions`, and `DebugStats` TypeScript types without type assertions.

#### Scenario: DebugResult deserializes without errors

- **WHEN** the Rust debug payload is parsed in TS as `DebugResult`
- **THEN** TypeScript type checking passes and all fields are present with correct types
