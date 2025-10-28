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
      { text: 'Frameworks', link: '/frameworks/overview', activeMatch: '/frameworks/' },
      { text: 'Advanced', link: '/advanced/performance-benchmarks', activeMatch: '/advanced/' },
      { text: 'API', link: '/api/reference', activeMatch: '/api/' },
      { text: 'Examples', link: '/examples/basic', activeMatch: '/examples/' },
      {
        text: 'More',
        items: [
          { text: 'Implementation', link: '/implementation/operators' },
          { text: 'Roadmap', link: '/project/roadmap' },
          { text: 'Contributing', link: '/project/contributing' },
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
            { text: 'Wildcards', link: '/guide/wildcards' },
            { text: 'Lazy Evaluation', link: '/guide/lazy-evaluation' },
            { text: 'Memoization', link: '/guide/memoization' },
            { text: 'Autocomplete', link: '/guide/autocomplete' },
            { text: 'Debug Mode', link: '/guide/debug' },
            { text: 'Configuration', link: '/guide/configuration' },
          ],
        },
      ],
      '/advanced/': [
        {
          text: 'Advanced Topics',
          collapsed: false,
          items: [
            { text: 'Performance Benchmarks', link: '/advanced/performance-benchmarks' },
            { text: 'Migration Guide', link: '/advanced/migration' },
            { text: 'Complete Documentation', link: '/advanced/complete-documentation' },
          ],
        },
      ],
      '/frameworks/': [
        {
          text: 'Framework Integrations',
          items: [
            { text: 'Overview', link: '/frameworks/overview' },
            { text: 'React', link: '/frameworks/react' },
            { text: 'Vue', link: '/frameworks/vue' },
            { text: 'Svelte', link: '/frameworks/svelte' },
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
          items: [{ text: 'Roadmap', link: '/project/roadmap' }],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Basic Usage', link: '/examples/basic' },
            { text: 'Advanced Patterns', link: '/examples/advanced' },
            { text: 'Real-World Cases', link: '/examples/real-world' },
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
