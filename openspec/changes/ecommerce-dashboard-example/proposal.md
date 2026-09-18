## Why

The documentation covers the core API and many individual use cases, but there is no single end-to-end example that shows how the pieces fit together in a realistic application. Users building a product-style dashboard have to stitch together fragments from `docs/examples/ecommerce.md`, `docs/recipes/`, and `docs/frameworks/` to understand the full picture. An end-to-end commerce dashboard example closes that gap.

## What Changes

- Add a new documentation page `docs/examples/ecommerce-dashboard.md` that walks through a complete e-commerce catalog dashboard built with `@mcabreradev/filter`.
- The example combines the public API (`filter`, `usePaginatedFilter`) with the documented operator set (`$gte`/`$lte` price ranges, `$contains` on array tags, `$regex` text search, date filtering with `Date` values) in one coherent scenario.
- Document the caching behavior by showing `clearFilterCache` in a realistic invalidation use case.
- Link the new page from the examples sidebar in `docs/.vitepress/config.ts` and from `docs/examples/index.md`.

This change is **documentation only**: it adds, edits, or removes no source code under `src/` and changes no runtime behavior.

## Capabilities

### New Capabilities

None. This is a documentation change; no capability has behavioral requirements that change, so no specs are created or modified. The change opts out of specs via `skip_specs: true` in its `.openspec.yaml`.

### Modified Capabilities

None.

## Impact

- **Documentation:** adds `docs/examples/ecommerce-dashboard.md` and touches the examples sidebar in `docs/.vitepress/config.ts` plus `docs/examples/index.md`.
- **Library source (`src/`):** unaffected — no API, operator, or type changes.
- **Build/verification:** `pnpm run test:docs` and `pnpm run docs:build` are the verification gates; the new page must pass VitePress build without warnings.
