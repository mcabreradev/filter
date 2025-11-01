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
      { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: 'Playground', link: '/playground/', activeMatch: '/playground/' },
      { text: 'Frontend', link: '/frontend/overview', activeMatch: '/frontend/' },
      { text: 'Backend', link: '/backend/express', activeMatch: '/backend/' },
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
            { text: 'Introduction', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Basic Filtering', link: '/guide/basic-filtering' },
            { text: 'Migration Guide v5.4', link: '/guide/migration-v2' },
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
            { text: 'Complete Documentation', link: '/advanced/complete-documentation' },
          ],
        },
      ],
      '/frontend/': [
        {
          text: 'Framework Integrations',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/frontend/overview' },
            { text: 'React', link: '/frontend/react' },
            { text: 'Vue', link: '/frontend/vue' },
            { text: 'Svelte', link: '/frontend/svelte' },
          ],
        },
        {
          text: 'SSR Frameworks',
          collapsed: false,
          items: [
            { text: 'Next.js', link: '/frontend/nextjs' },
            { text: 'Nuxt', link: '/frontend/nuxt' },
            { text: 'SvelteKit', link: '/frontend/sveltekit' },
          ],
        },
      ],
      '/backend/': [
        {
          text: 'Backend Integration',
          collapsed: false,
          items: [
            { text: 'Node.js', link: '/backend/nodejs' },
            { text: 'Express.js', link: '/backend/express' },
            { text: 'NestJS', link: '/backend/nestjs' },
            { text: 'Deno', link: '/backend/deno' },
          ],
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
