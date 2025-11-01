import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['docs/.vitepress/theme/__tests__/**/*.test.ts'],
  },
});
