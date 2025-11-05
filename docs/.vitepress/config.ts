import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '@mcabreradev/filter',
  description:
    'A powerful, SQL-like array filtering library for TypeScript and JavaScript with advanced pattern matching, MongoDB-style operators, and zero dependencies',
  base: '/',

  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#0869B8' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: '@mcabreradev/filter' }],
    ['meta', { name: 'og:image', content: 'https://filter-docs.vercel.app/og-image.png' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/quick-start', activeMatch: '/guide/' },
      { text: 'Operators', link: '/operators/', activeMatch: '/operators/' },
      { text: 'Recipes', link: '/recipes/', activeMatch: '/recipes/' },
      { text: 'Playground', link: '/playground/', activeMatch: '/playground/' },
      { text: 'Frameworks', link: '/frameworks/', activeMatch: '/frameworks/' },
      { text: 'API', link: '/api/reference', activeMatch: '/api/' },
      { text: 'Examples', link: '/examples/basic', activeMatch: '/examples/' },
      {
        text: 'Advanced',
        items: [
          { text: 'Architecture', link: '/advanced/architecture' },
          { text: 'Type System', link: '/advanced/type-system' },
          { text: 'Performance', link: '/advanced/performance-benchmarks' },
          { text: 'Implementation', link: '/implementation/operators' },
        ],
      },
      {
        text: 'Resources',
        items: [
          { text: 'Changelog', link: '/project/changelog' },
          { text: 'Contributing', link: '/project/contributing' },
          { text: 'Roadmap', link: '/project/roadmap' },
          { text: 'FAQ', link: '/guide/faq' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Modular Imports ⭐', link: '/guide/modular-imports' },
            { text: 'Basic Filtering', link: '/guide/basic-filtering' },
          ],
        },
        {
          text: 'Core Features',
          collapsed: false,
          items: [
            { text: 'Operators', link: '/guide/operators' },
            { text: 'Regex Operators', link: '/guide/regex-operators' },
            { text: 'Logical Operators', link: '/guide/logical-operators' },
            { text: 'Nested Objects', link: '/guide/nested-objects' },
            { text: 'Geospatial Operators ⭐', link: '/guide/geospatial-operators' },
            { text: 'Datetime Operators ⭐', link: '/guide/datetime-operators' },
            { text: 'Wildcards', link: '/guide/wildcards' },
            { text: 'Lazy Evaluation', link: '/guide/lazy-evaluation' },
            { text: 'Memoization', link: '/guide/memoization' },
            { text: 'Autocomplete', link: '/guide/autocomplete' },
            { text: 'Debug Mode', link: '/guide/debug' },
            { text: 'Configuration', link: '/guide/configuration' },
          ],
        },
        {
          text: 'Configuration & Help',
          collapsed: false,
          items: [
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Best Practices', link: '/guide/best-practices' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' },
            { text: 'FAQ', link: '/guide/faq' },
            { text: 'Library Comparison', link: '/guide/comparison' },
          ],
        },
      ],
      '/playground/': [
        {
          text: 'Playground',
          collapsed: false,
          items: [{ text: 'Interactive Playground', link: '/playground/' }],
        },
      ],
      '/advanced/': [
        {
          text: 'Advanced Topics',
          collapsed: false,
          items: [
            { text: 'Architecture', link: '/advanced/architecture' },
            { text: 'Type System', link: '/advanced/type-system' },
            { text: 'Performance Benchmarks', link: '/advanced/performance-benchmarks' },
            { text: 'Migration Guide', link: '/advanced/migration' },
          ],
        },
      ],
      '/frameworks/': [
        {
          text: 'Framework Integrations',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/frameworks/' },
            { text: 'React', link: '/frameworks/react' },
            { text: 'Vue', link: '/frameworks/vue' },
            { text: 'Svelte', link: '/frameworks/svelte' },
          ],
        },
        {
          text: 'SSR Frameworks',
          collapsed: false,
          items: [
            { text: 'Next.js', link: '/frameworks/nextjs' },
            { text: 'Nuxt', link: '/frameworks/nuxt' },
            { text: 'SvelteKit', link: '/frameworks/sveltekit' },
          ],
        },
        {
          text: 'Backend Frameworks',
          collapsed: false,
          items: [
            { text: 'Node.js', link: '/frameworks/nodejs' },
            { text: 'Express.js', link: '/frameworks/express' },
            { text: 'NestJS', link: '/frameworks/nestjs' },
            { text: 'Deno', link: '/frameworks/deno' },
          ],
        },
      ],
      '/operators/': [
        {
          text: 'Operator Reference',
          collapsed: false,
          items: [
            { text: 'All Operators', link: '/operators/' },
            { text: 'Comparison', link: '/operators/comparison' },
            { text: 'Array', link: '/operators/array' },
            { text: 'String', link: '/guide/operators#string-operators' },
            { text: 'Logical', link: '/guide/logical-operators' },
            { text: 'Geospatial', link: '/guide/geospatial-operators' },
            { text: 'DateTime', link: '/guide/datetime-operators' },
          ],
        },
      ],
      '/recipes/': [
        {
          text: 'Recipes',
          collapsed: false,
          items: [{ text: 'All Recipes', link: '/recipes/' }],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          collapsed: false,
          items: [
            { text: 'Core API', link: '/api/reference' },
            { text: 'Operators', link: '/api/operators' },
            { text: 'Types', link: '/api/types' },
          ],
        },
      ],
      '/implementation/': [
        {
          text: 'Implementation Details',
          collapsed: false,
          items: [
            { text: 'Operators Implementation', link: '/implementation/operators' },
            { text: 'Lazy Evaluation Implementation', link: '/implementation/lazy-evaluation' },
            { text: 'Type Tests Implementation', link: '/implementation/type-tests' },
          ],
        },
      ],
      '/project/': [
        {
          text: 'Project',
          collapsed: false,
          items: [
            { text: 'Roadmap', link: '/project/roadmap' },
            { text: 'Changelog', link: '/project/changelog' },
            { text: 'Contributing', link: '/project/contributing' },
            { text: 'Code of Conduct', link: '/project/code-of-conduct' },
            { text: 'License', link: '/project/license' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          collapsed: false,
          items: [
            { text: 'Basic Usage', link: '/examples/basic' },
            { text: 'Advanced Patterns', link: '/examples/advanced' },
            { text: 'Real-World Cases', link: '/examples/real-world' },
            { text: 'E-Commerce', link: '/examples/ecommerce' },
            { text: 'Analytics', link: '/examples/analytics' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mcabreradev/filter' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@mcabreradev/filter' },
    ],

    editLink: {
      pattern: 'https://github.com/mcabreradev/filter/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Miguelangel Cabrera',
    },

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
  },

  vite: {
    resolve: {
      alias: {
        '@mcabreradev/filter': '/src/index.ts',
      },
    },
  },
});
