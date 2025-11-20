import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  define: {
    'global': 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      'buffer': 'buffer',
      'process': 'process/browser',
      'util': 'util',
      'events': 'events',
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    rollupOptions: {
      plugins: []
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});
