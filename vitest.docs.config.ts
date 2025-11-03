import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      'docs/.vitepress/theme/components/playground/__tests__/**/*.test.ts',
      'docs/.vitepress/theme/components/geospatial/__tests__/**/*.test.ts',
    ],
  },
});
