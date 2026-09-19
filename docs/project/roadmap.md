# 🗺️ Product Roadmap

> **Last Updated**: September 19, 2026 (synced to reality)
> **Current Version**: v5.10.4
> **Status**: Active Development

---

## 📊 Executive Summary

Strategic direction for `@mcabreradev/filter`. The roadmap previously froze at v5.6.0 (Nov 2025) while development kept shipping through v5.10.4 — this document reconciles the roadmap with what is actually in the repository.

**Key Goals**:

- 🚀 Improve performance and bundle efficiency
- 🎯 Expand operator capabilities (MongoDB parity)
- 🔌 Enable extensibility through plugin system
- 📚 Enhance documentation and onboarding
- 🌍 Build framework integrations and ecosystem
- 🛡️ Strengthen security and quality automation

---

## 🎯 Vision & Strategy

### Short-term

Focus on **critical infrastructure** and **developer experience** improvements that increase adoption and reduce friction.

### Mid-term

Expand **feature set** with plugin system and advanced performance work to compete with established libraries.

### Long-term

Build a **thriving ecosystem** with community contributions, extensions, and enterprise-grade tooling.

---

## 📅 Release Timeline

| Version | Theme                       | Status                        |
| ------- | --------------------------- | ----------------------------- |
| v5.4.0  | Framework Integrations      | ✅ Released (Oct 25–26, 2024) |
| v5.5.0  | Developer Experience        | ✅ Released (Oct 28, 2025)    |
| v5.5.1  | Stability & Polish          | ✅ Released (Oct 30, 2025)    |
| v5.6.0  | Geospatial & DateTime       | ✅ Released (Nov 1, 2025)     |
| v5.6.x  | Follow-up fixes             | ✅ Released                   |
| v5.8.x  | Sorting + more integrations | ✅ Released                   |
| v5.9.x  | Maintenance & fixes         | ✅ Released                   |
| v5.10.x | Current release line        | ✅ **v5.10.4 current**        |
| v6.0.0  | Major Evolution             | 🔵 Future                     |

**Gap**: version v5.7.0 was skipped on the roadmap; actual released line went 5.6 → 5.8 (sorting, Angular/SolidJS/Preact integrations, performance monitoring) → 5.9/5.10 (maintenance, fixes, docs).

---

## ✅ Released (shipped in v5.6.x and later)

The following were marked complete on the old roadmap and remain so:

- ✅ **v5.6.0 Geospatial**: `$near`, `$geoBox`, `$geoPolygon`, distance utils, coordinate validation, GeoPoint types, 26 tests
- ✅ **v5.6.0 DateTime**: `$recent`, `$upcoming`, `$dayOfWeek`, `$timeOfDay`, `$age`, `$isWeekday`, `$isWeekend`, `$isBefore`, `$isAfter`, 90+ tests
- ✅ **v5.5.0 Array OR Syntax**: array-based OR without explicit `$in`
- ✅ **v5.5.0 Visual Debugging**: debug mode, expression tree, `filterDebug`, timings
- ✅ **v5.5.0 Interactive Playground**: filter-docs.vercel.app/playground
- ✅ **v5.4.0 / v5.3.0 Framework Integrations**: React hooks + Vue composables
- ✅ **v5.2.0** (noted on roadmap as complete): memoization, logical operators, regex operators
- ✅ **v5.1.0** (per repo): lazy evaluation with generators, enhancement of caching/memoization

### ✅ v5.8.0+ additions that belong in the roadmap

Released after the roadmap froze, now tracked here — **Status: ✅ Complete**

#### Sorting (`orderBy`) ✅

**Deliverables**: `orderBy` option on the filter function, sorting utilities, integration with the filter pipeline.
**Files**: `src/utils/sort/`

- ✅ Implemented in v5.8.0 line

#### Framework Integrations: Angular, SolidJS, Preact ✅

**Epic**: Community & Ecosystem
**Status**: ✅ Complete
**Deliverables**:

- ✅ Angular: `FilterService`, `DebouncedFilterService`, `PaginatedFilterService` (`src/integrations/angular/`)
- ✅ SolidJS integration (`src/integrations/solidjs/`)
- ✅ Preact integration (`src/integrations/preact/`)
- ✅ Framework comparison guide & docs (Svelte removed in @85)
- ✅ Optional peer deps (`@angular/core`, `preact`, `solid-js`, `react`, `vue`, `zod`)

#### Performance Monitoring Utility ✅

**Deliverables**: `src/utils/performance-monitor/` for timing and stats.

#### `$contains` array & edge-case fixes ✅

**Deliverables**: `$contains` on arrays, NaN range bugs, stale cache, circular reference handling (fixed in @88).

---

## 🔴 v5.1.0 — Infrastructure & DX (Mostly Complete)

**Status**: 🟡 Mostly Complete — items below reconcile what the roadmap planned vs. what the repo has.

### ✅ Already shipped (verify each)

| Planned item                   | Repo reality                                                                                                                                                                                                                                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CI/CD pipeline                 | ✅ `.github/workflows/` with `testing.yml` (typecheck + lint + test + coverage + build + check + Codecov), `size-check.yml`, `security-audit.yml` (weekly + PR, auto-issues), `github-release.yml`, `npm-publish-manual.yml`, `pr-title-lint.yml`. Multi-version Node matrix **not** present (single 20.x). |
| TypeScript type tests (tsd)    | ✅ `pnpm test:types` (`__test__/test-d/**`), wired into `pnpm run check`                                                                                                                                                                                                                                    |
| Custom error classes           | ✅ `src/errors/` (`filter-errors.ts`, `error-helpers.ts`, `errors.test.ts`)                                                                                                                                                                                                                                 |
| Bundle analysis (`size-limit`) | ✅ `.size-limit.json` + `size-check.yml`, `sideEffects: false`, modular `exports` map                                                                                                                                                                                                                       |
| Husky pre-commit + pre-push    | ✅ `.husky/` (lint-staged + type check on commit; full gate on push)                                                                                                                                                                                                                                        |
| Security automation            | ✅ `security-audit.yml` weekly + PR, `pnpm audit`, auto-open issue                                                                                                                                                                                                                                          |

### ❌ Still pending

- [ ] **Performance Benchmarking Suite** — no `benchmarks/` directory; no Vitest benchmark config; no regression detection
- [ ] **Bundle < 10 KB verified in docs** — size-limit configured but current measured size not surfaced in a roadmap/docs table; badge not confirmed in README

### Quick Wins — status

- [ ] `.npmignore` — ✅ present
- [ ] `.editorconfig` — ✅ present
- [ ] `CODEOWNERS` — ✅ present
- [ ] `SECURITY.md` — ✅ present
- [ ] **CHANGELOG.md** — ❌ absent (consider adding; see docs/)
- [ ] Dependabot config — ❌ not confirmed in `.github/`
- [ ] `engines.npm` — ❌ (engines.node exists; engines.npm not needed under pnpm)
- [ ] README badges (coverage/bundle/npm/downloads) — ⚠️ verify

---

## 🎨 v5.2.0 — Advanced Features

**Status**: 🟡 Planned
**Target**: Q2 2026 (date on old roadmap; reconfirm)

### 🔴 Critical Priority

#### 7. Plugin System

**Epic**: Extensibility & Custom Operators
**Effort**: 5-6 days
**Impact**: 🔥 High
**Status**: 🔵 Not Started — `src/plugins/` does not exist

**Deliverables**:

- [ ] Plugin architecture design
- [ ] Plugin registration API
- [ ] Custom operator support
- [ ] Plugin lifecycle hooks
- [ ] Plugin documentation
- [ ] Example plugins (regex, date utilities, fuzzy matching)

#### 8. Advanced Performance Optimizations

**Epic**: Speed & Efficiency
**Effort**: 2-3 days
**Impact**: 🔥 Medium

**Note**: lazy evaluation and memoization already shipped (v5.1/5.2 line).

**Deliverables**:

- [ ] LRU cache for predicates (enhancement)
- [ ] Enhanced memoization strategy
- [ ] Lazy evaluation improvements
- [ ] Early exit optimizations
- [ ] Memory profiling tools
- [ ] Performance docs updates

### Nice to Have

#### 9. Property-Based Testing

**Effort**: 2-3 days — `fast-check`, property tests for core + operators, CI integration

#### 10. Mutation Testing

**Effort**: 2 days — Stryker, mutation score > 80%

---

## 🌍 v5.7.0 — Extended Ecosystem

**Status**: 🔵 Future (renumber/reconfirm against current release line)
**Focus**: Additional integrations and tooling

#### TypeDoc API Documentation

- [ ] Generate API docs
- [ ] Host on GitHub Pages
- [ ] Auto-update on releases
  > Note: `typedoc.json` and `pnpm run docs:api` exist — partially set up.

#### Developer Tools

- [ ] VSCode extension (snippets)
- [ ] ESLint plugin (`prefer-operators`, `no-unsafe-expression`)
- [ ] Prettier plugin (optional)

#### Migration Tools

- [ ] Codemod v3 → v5
- [ ] CLI migration tool
- [ ] Migration guide improvements

#### Community Templates

- [ ] Issue/PR/discussion templates, enhanced CONTRIBUTING.md, Code of Conduct

#### Telemetry & Analytics (Optional)

- [ ] Opt-in telemetry, privacy-first

---

## 🚀 v6.0.0 — Major Evolution

**Status**: 🔵 Future
**Target**: Q4 2026
**Focus**: Enterprise features and breaking improvements

### 16. Query Builder API

**Epic**: Fluent Interface
**Effort**: 5-7 days

> There is already a spec concept in `docs/roadmap/query-builder-api.md`.

### 17. SQL-Like Query Language

**Epic**: String-Based Queries
**Effort**: 7-10 days

### 18. GraphQL Integration

**Epic**: GraphQL Filter Resolver
**Effort**: 5-6 days

### 19. Database Adapters

**Epic**: Query Translation (Mongo adapter, others)
**Effort**: 10-15 days

**OpenSpec note**: the repo has OpenSpec tooling + a `rust-migration` spec in flight (@98) — treat that as a live workstream not covered by this roadmap; sync it into the roadmap at next review.

---

## 📊 Success Metrics & KPIs

### Adoption Metrics

- **NPM Downloads**: 10K/month by Q4 2026
- **GitHub Stars**: 500+ by Q4 2026
- **Contributors**: 10+ active contributors
- **Framework Integrations**: ✅ React, Vue, Angular, SolidJS, Preact

### Quality Metrics

- **Test Coverage**: ✅ Maintain 100%
- **Type Coverage**: ✅ 100%
- **Bundle Size**: < 10 KB (full library) — verify with current `pnpm size`
- **Performance**: ✅ 530x-1520x improvement with caching

### Community Metrics

- **GitHub Issues**: < 10 open issues
- **Response Time**: < 48 hours
- **Documentation**: 95%+ satisfaction
- **Plugin Ecosystem**: 5+ community plugins (target)

---

## 🤝 Contributing to the Roadmap

We welcome community input.

### How to Contribute

1. **Vote on Features**: Use 👍 reactions on GitHub issues
2. **Propose Features**: Open a discussion in GitHub Discussions
3. **Sponsor Development**: Accelerate specific features
4. **Submit PRs**: Implement features from this roadmap

### Priority Criteria

- **Impact**: How many users benefit?
- **Effort**: How long will it take?
- **Strategic Fit**: Does it align with vision?
- **Community Demand**: How many requests?

---

## 📝 Changelog & Updates

### Roadmap Updates

- **2026-09-19**: Synced to repo reality at v5.10.4 (was frozen at v5.6.0). Marked CI/type-tests/errors/bundle/security as shipped; flagged benchmarks + bundle <10KB badge + CHANGELOG as the real pending items; added the v5.8+ sorting/Angular/SolidJS/Preact/perf-monitor work that was never tracked.
- **2025-11-04**: Previous update (stale at v5.6.0).

### Completed Items

- ✅ v5.10.x line: current (v5.10.4)
- ✅ v5.8.x: sorting (`orderBy`), Angular/SolidJS/Preact integrations, performance monitoring
- ✅ v5.6.x: geospatial + datetime, follow-up fixes
- ✅ v5.5.x: array OR, visual debugging, playground, stability
- ✅ v5.4/v5.3/v5.2/v5.1/v5.0: framework integrations, memoization, lazy eval, logical/regex ops, MongoDB-style operators

---

## 📞 Contact & Feedback

- **GitHub Issues**: https://github.com/mcabreradev/filter/issues
- **GitHub Discussions**: https://github.com/mcabreradev/filter/discussions
- **Email**: [mcabrera.dev@gmail.com]
- **Twitter**: [@mcabreradev]

---

## 📄 License

This roadmap is subject to change based on community feedback, technical constraints, and strategic priorities.

**Last Updated**: September 19, 2026
**Next Review**: Q1 2026

---

<p align="center">
  <strong>Made with ❤️ for the JavaScript/TypeScript community</strong>
</p>
