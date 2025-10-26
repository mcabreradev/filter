# Documentation

This directory contains the VitePress documentation for `@mcabreradev/filter`.

## Development

Start the development server:

```bash
pnpm run docs:dev
```

The documentation will be available at `http://localhost:5173/`

## Build

Build the documentation for production:

```bash
pnpm run docs:build
```

The built files will be in `docs/.vitepress/dist/`

## Preview

Preview the production build:

```bash
pnpm run docs:preview
```

## Generate API Documentation

Generate API documentation from TypeScript source:

```bash
pnpm run docs:api
```

## Structure

- `.vitepress/` - VitePress configuration and theme
- `guide/` - Getting started and core feature guides
- `frameworks/` - Framework integration guides (React, Vue, Svelte)
- `examples/` - Code examples and use cases
- `api/` - API reference documentation
- `public/` - Static assets (images, logos, etc.)

## Deployment

The documentation is configured for deployment to Vercel or Netlify:

- **Vercel**: Uses `vercel.json` configuration

Both platforms will automatically:
1. Install dependencies with `pnpm install`
2. Build the docs with `pnpm run docs:build`
3. Deploy the `docs/.vitepress/dist/` directory

## Features

- Interactive code playground
- Full-text search
- Dark mode support
- Mobile-responsive design
- Framework-specific examples
- API documentation
- Performance benchmarks

