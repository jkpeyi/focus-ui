import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

/** Documentation site. `@jkpeyi/focus-ui` resolves to the local source for live editing. */
export default defineConfig({
  root: 'docs',
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@jkpeyi/focus-ui': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
    },
  },
  build: {
    outDir: '../docs-dist',
    chunkSizeWarningLimit: 1000,
    emptyOutDir: true,
  },
});
