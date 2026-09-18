## 1. Write the example page

- [ ] 1.1 Create `docs/examples/ecommerce-dashboard.md` with VitePress frontmatter (`title: E-Commerce Dashboard`, `description`) and a typed `Product[]` seed dataset
- [ ] 1.2 Add a multi-criteria search section combining `price: { $gte, $lte }`, `tags: { $contains }`, and `$regex` text search in one `$and` expression, with commented `// ->` outputs
- [ ] 1.3 Add a date-range filtering section using `Date` bounds with `$gte`/`$lte`, noting that dates compare by time value
- [ ] 1.4 Add a `usePaginatedFilter` React section with pagination controls (page state, `goToPage`, page-size) and commented outputs
- [ ] 1.5 Add a cache note showing `clearFilterCache` invalidation in a realistic data-refresh scenario, and a Related Resources section linking `docs/examples/ecommerce.md`, `docs/recipes/`, and `docs/frameworks/react.md`
- [ ] 1.6 Verify the file renders: run `pnpm run docs:build` and confirm no errors or broken-link warnings reference the new page

## 2. Wire the page into navigation

- [ ] 2.1 Add `{ text: 'E-Commerce Dashboard', link: '/examples/ecommerce-dashboard' }` to the `'/examples/'` sidebar items in `docs/.vitepress/config.ts` (after the `E-Commerce` entry)
- [ ] 2.2 Link the page from within the examples section (there is no `docs/examples/index.md`; the page's Related Resources section in 1.5 serves as the entry from content), and verify the sidebar link from 2.1 resolves without VitePress build warnings
