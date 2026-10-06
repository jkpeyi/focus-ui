import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Library build: ESM + CJS bundles, React kept external. */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'clsx', 'tailwind-merge'],
      // Components use hooks — mark the bundle as client code for React Server Components (Next.js App Router).
      output: { banner: "'use client';" },
    },
  },
});
