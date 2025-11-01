import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'docs/.vitepress/theme/__tests__/**/*.test.ts'],
    environmentMatchGlobs: [['docs/.vitepress/theme/__tests__/**/*.test.ts', 'jsdom']],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'docs/.vitepress/theme/composables/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.types.ts',
        'src/**/index.ts',
        'docs/.vitepress/theme/__tests__/**/*.test.ts',
      ],
    },
  },
});
