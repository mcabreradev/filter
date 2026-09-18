# Project initialization — @mcabreradev/filter

- **Date:** 2026-09-18
- **Project root:** /Users/migue/Workspace/migue/filter (verified with `pwd -P` + `openspec context --json`)
- **Run by:** Hermes (`workflows/initialize-project.md`)
- **Status:** completed

## Repository verification

<!-- How it was confirmed that this was the intended repo (step 2 of the workflow). -->

```bash
pwd -P
basename "$(pwd -P)"
git rev-parse --show-toplevel 2>/dev/null || echo "no-git"
git remote -v 2>/dev/null || echo "no-remote"
openspec context --json
```

- OpenSpec root: /Users/migue/Workspace/migue/filter (`source: nearest`, `role: openspec_root`)
- Nested root detected? no
- Git repo? yes — remote `origin git@github.com:mcabreradev/filter.git` matches the project name `filter` and package name `@mcabreradev/filter`.

## Inputs received

| Input | Value | Source |
|---|---|---|
| Project name | `@mcabreradev/filter` | verified against repo basename (`filter`) and remote (`mcabreradev/filter`) |
| Product idea | SQL-like array filtering library for TS/JS: pattern matching, MongoDB-style operators, deep object comparison, geospatial, zero dependencies | context brief (from README) |
| Target users | TypeScript/JavaScript developers filtering in-memory arrays/collections (plain data + React/Vue/Angular/Preact/SolidJS) | context brief |
| MVP goal | Already shipped at v5.10.1 (core engine, 18+ operators, lazy, integrations, typed API); current milestone is the in-flight rust-migration change | context brief + repo (proposal.md) |
| Preferred stack | TypeScript strict, ESM, ES2022, Vitest, VitePress, pnpm, husky | context brief + repo survey |
| Business rules | Pending: what business rules must the software respect? | not provided |
| Technical constraints | strict TS, ESM/ES2022, zero prod deps, optional peers (react/vue/angular/preact/solid-js/zod), size-limit, tsc+tsx build | repo survey |

**Pending** (unanswered inputs, written as `Pending:` in `project.md`):

- Business rules (section `## Business Rules`).
- Additional non-goals beyond the ones derived from the product.
- Additional technical constraints (performance/security/integration limits).

**Divergences detected** between what was declared and the real repo:

- None: declared stack (TypeScript, ESM, pnpm) matches the real repo (verified in `package.json`, `tsconfig.json`, `pnpm-lock.yaml`).

## OpenSpec status

- Root: /Users/migue/Workspace/migue/filter · `config.yaml` present · default schema: spec-driven
- Active changes: `rust-migration` (in-progress, 0/99 tasks)
- Existing capabilities: none yet (`openspec/specs/` empty)
- `openspec validate --all --json`: totals = 1 item, 0 passed, 1 failed — **pre-existing** ERRORs in the `rust-migration` change spec files (missing scenarios / RFC 2119 wording in `filter-api/spec.md`, `rust-core-engine/spec.md`). Reported as finding, not patched (workflow rule).

## Structure created

| Path | Status | Note |
|---|---|---|
| `openspec/` | already existed | created earlier via `openspec init` (config.yaml, specs/, changes/) |
| `openspec/project.md` | created | local product context (this is the Hermes SDD marker) |
| `docs/architecture/` | created | place for current architecture (+ `.gitkeep`) |
| `docs/decisions/` | created | project ADRs |
| `reports/` | created | run reports |
| `reports/initialize-project.md` | created | this file |

## Repository surveyed

- **Real stack:** TypeScript strict, ESM (`"type": "module"`), target/module ES2022, `moduleResolution: bundler`; build `tsc` + `tsx scripts/optimize-build.ts` → `build/`; tests Vitest (node env, jsdom for docs theme); docs VitePress (`docs/.vitepress`); package manager pnpm (lockfile v9); zero production dependencies, optional peer deps (react, vue, @angular/core, preact, solid-js, zod).
- **Commands:** build `pnpm build` · test `pnpm test` · lint `pnpm lint` · typecheck `pnpm typecheck` (full gate: `pnpm run check`).
- **Structure:** `src/{core,operators,predicate,comparison,config,validation,debug,errors,constants,types,utils,integrations}`, `__test__/`, `docs/`, `examples/`, `build/`, `scripts/`, `.husky/`, `.github/`.
- **Tests:** Vitest suite incl. co-located `src/**/*.test.ts`, `__test__/`, docs theme tests; ~965+ tests (`it(`/`test(` across those trees); `tsd` type tests (`test:types`); docs tests (`test:docs`).
- **Existing documentation:** README.md (product overview, API), `docs/` (VitePress site: guide, api, operators, frameworks, backend, recipes, playground), CLAUDE.md (project conventions), CONTRIBUTING.md, techstack.md/yml.

## What was NOT created (on purpose)

- [x] Product implementation code (it is born with a validated OpenSpec change).
- [x] Build/lint/CI scaffolding not explicitly requested by the human.
- [x] Copies of Hermes agents, workflows or global rules inside the repo.

## Closure verification

```bash
test -f openspec/project.md && test -d docs/architecture && test -d docs/decisions \
  && test -f reports/initialize-project.md && echo "initialization OK"
git status --porcelain
```

- [x] `openspec/project.md` exists.
- [x] `docs/architecture/` exists.
- [x] `docs/decisions/` exists.
- [x] `reports/initialize-project.md` exists (this file).
- [x] No feature implementation created.
- [x] Nothing written outside the project root.

## Next step

`openspec-onboard` (project already has code: survey and capture initial capabilities from `src/`, docs and the existing test suite), or continue the in-flight `rust-migration` change (validated artifacts are required before implementation: current errors are spec-level and pre-date initialization).
