# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the **VitePress documentation site** for `@mcabreradev/filter`. All commands are run from the **parent directory** (`/Users/migue/Workspace/migue/filter`), not from within `docs/`.

## Commands

```bash
# Start dev server (http://localhost:5173/)
pnpm run docs:dev

# Build for production → docs/.vitepress/dist/
pnpm run docs:build

# Preview production build
pnpm run docs:preview

# Generate API docs from TypeScript source (typedoc)
pnpm run docs:api

# Run docs code example tests
pnpm run test:docs

# Watch mode for docs tests
pnpm run test:docs:watch
```

## Structure

```
docs/
├── .vitepress/
│   ├── config.ts       # Site config, nav, sidebar definitions
│   └── theme/          # Custom theme (index.ts, style.css, components/)
├── guide/              # Getting started, core features, configuration
├── operators/          # Operator reference pages
├── frameworks/         # React, Vue, Svelte, Angular, SolidJS, Preact, Next.js, Nuxt, etc.
├── api/                # API reference (reference.md, operators.md, types.md)
├── advanced/           # Architecture, type system, performance, migration
├── implementation/     # Deep-dive implementation details
├── examples/           # Code examples (basic, advanced, real-world, ecommerce, analytics)
├── recipes/            # Common patterns and recipes
├── project/            # Changelog, roadmap, contributing, license
├── playground/         # Interactive playground
└── public/             # Static assets (logo.svg, og-image.png)
```

## Key Configuration

**`docs/.vitepress/config.ts`** — all navigation, sidebar, and site metadata lives here. When adding a new page, register it in the appropriate `sidebar` section.

**Vite alias**: `@mcabreradev/filter` resolves to `/src/index.ts` during docs dev/build, so code examples can import the library directly and be executed by the docs test runner.

## Docs Test Runner

Code blocks in docs files are executed as tests via `vitest.docs.config.ts` in the parent directory. When adding code examples with `typescript` fences, ensure they are valid and runnable — the test runner will catch broken examples.

## Adding Content

- **New guide page**: create `docs/guide/<name>.md`, add to the `'/guide/'` sidebar in `config.ts`
- **New framework page**: create `docs/frameworks/<name>.md`, add to the `'/frameworks/'` sidebar
- **New operator docs**: add to existing `docs/guide/operators.md` or create a dedicated page under `docs/operators/`

## Markdown Conventions

- Use VitePress-specific containers: `::: tip`, `::: warning`, `::: danger`, `::: info`
- Code blocks support language + filename: ` ```typescript [example.ts] `
- Internal links use root-relative paths: `[link text](/guide/quick-start)`
- `editLink` pattern points to `https://github.com/mcabreradev/filter/edit/main/docs/:path`
