import crypto from 'node:crypto';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

if (!(crypto as { hash?: unknown }).hash) {
  (
    crypto as {
      hash: (
        algorithm: string,
        data: string | Buffer,
        outputEncoding?: crypto.BinaryToTextEncoding,
      ) => string;
    }
  ).hash = (algorithm, data, outputEncoding = 'hex') =>
    crypto.createHash(algorithm).update(data).digest(outputEncoding);
}

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
