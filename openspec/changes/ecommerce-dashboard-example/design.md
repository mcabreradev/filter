## Context

See proposal.md - Why. The docs site is VitePress under `docs/`, with existing static examples in `docs/examples/` (`basic.md`, `advanced.md`, `real-world.md`, `ecommerce.md`, `analytics.md`). Each page uses VitePress frontmatter (`title`, `description`) and `typescript` code blocks. The public API is `filter(array, expression, options)`, `filterLazy`, and `clearFilterCache`; the React bindings (`useFilter`, `useDebouncedFilter`, `useFilteredState`, `usePaginatedFilter`) live in `src/integrations/react` and are imported in docs as `@mcabreradev/filter/react`. Filtering on array members via `$contains`, comparison on `Date` by time value, and the full operator set (`$gte`, `$lte`, `$contains`, `$regex`, `$and`, `$or`, ...) are all public, verified behavior.

## Goals / Non-Goals

**Goals:**
- A single self-contained page (`docs/examples/ecommerce-dashboard.md`) demonstrating a realistic e-commerce catalog dashboard end to end.
- Show the combination of multiple operator families in one expression: price range (`$gte`/`$lte`), array tag matching (`$contains`), text search (`$regex`), and date-range filtering with `Date` values.
- Show the React integration with `usePaginatedFilter` (pagination + filtering in one API) and the cache-lifecycle story with `clearFilterCache`.
- Follow the existing static example pattern exactly (frontmatter + `typescript` blocks), so no new tooling or build changes are needed.

**Non-Goals:**
- No interactive playground or new Vue/VitePress components. The docs site already has a playground; this change deliberately patches the existing static pattern instead of extending it.
- No changes to `src/` or to runtime behavior of the library.
- No new recipes, guides, or API reference rewrites: the page links to existing docs (`docs/examples/`, `docs/recipes/`, `docs/frameworks/`) rather than duplicating them.

## Decisions

### D1. Static markdown page under `docs/examples/` (patches the existing pattern)

The new example is a plain VitePress markdown page, `docs/examples/ecommerce-dashboard.md`, following the exact convention of the sibling pages: frontmatter with `title` and `description`, H2 sections, and ```typescript blocks with commented `// ->` outputs where a result is deterministic.

- **Rationale:** Zero build footprint, consistent with the rest of the examples section, trivially reviewable in diffs, and directly indexable by VitePress.
- **Alternative considered:** A live interactive playground component (like the existing `docs/playground/`) or a Vue component embedding the dashboard. Rejected: it adds component code, test config, and maintenance surface disproportionate to the goal, which is a readable end-to-end narrative.

### D2. One scenario spanning filtering + pagination + cache

The page is structured as a single evolving scenario rather than a list of unrelated snippets:

1. **Dataset** — a typed `Product[]` catalog (id, name, category, price, rating, inStock, tags, releasedAt) shown as static seed data.
2. **Multi-criteria search expression** — one `$and` expression combining `price: { $gte, $lte }`, `tags: { $contains }`, and `name/description: { $regex }`; the expression is built with `useMemo` from filter state, mirroring `docs/examples/ecommerce.md`.
3. **Date filtering** — filtering `releasedAt` against `Date` bounds with `{ $gte: from, $lte: to }`, noting that dates compare by time value.
4. **Pagination** — a `usePaginatedFilter` example with page controls, exercising `currentPage`, `totalPages`, `goToPage`.
5. **Cache invalidation** — a small `clearFilterCache` note tied to a realistic event (product data refresh), because cached expressions would otherwise serve stale results.

- **Rationale:** every operator used is already documented and public; the scenario composes them the way a real dashboard does, which is the actual gap this change fills.
- **Alternative considered:** A "kitchen sink" page cramming every operator. Rejected: noise over signal; the existing `docs/operators/` reference already covers the full operator set exhaustively.

### D3. Sidebar + index linking

Register the page in the `'/examples/'` sidebar section of `docs/.vitepress/config.ts` (after `E-Commerce`), and add a card link in `docs/examples/index.md`.

- **Rationale:** matches how every other example page is surfaced; VitePress build fails on unregistered-but-linked paths, so registering is also the build-correctness requirement.
- **Alternative considered:** Linking only from the recipes page. Rejected: the recipes index links to Examples as a whole; the sidebar is the canonical navigation for examples.

## Risks / Trade-offs

- **Example code is not executed by tests** → the `typescript` blocks are illustrative. Mitigation: keep every snippet faithful to the documented public API and verify the page builds (`pnpm run docs:build`) and the docs test suite (`pnpm run test:docs`) stays green; deterministic snippets carry `// ->` comments.
- **Snippets rely on behavior fixed in #88** → the `$contains`-on-array and `Date`-`$eq` snippets only produce their documented `// ->` outputs after `fix/core-filter-bugs` (commit `49e5264`) merges. Before that, `filter()` routes `$contains` through the string path (short-circuits non-strings to `[]`) and `$eq` compares dates by identity. **Merge order matters:** ship #88 before this docs page so the examples behave as written on main. This is a sequencing dependency, not a bug in the diff.
- **Sidebar edits can drift from the page list** → Mitigation: the sidebar entry is added in the same change as the page, and `docs:build` breaks on broken internal links, catching omissions.
- **Overlap with `docs/examples/ecommerce.md`** → Mitigation: the new page is end-to-end (one dashboard), whereas `ecommerce.md` is per-feature snippets; the page links to it as Related Resources instead of duplicating its fragments.
