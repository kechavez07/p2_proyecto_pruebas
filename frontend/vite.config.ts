
/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',                // usa @vitest/coverage-v8
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      all: true,                     // mide también archivos no tocados por tests
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/__tests__/**',
        'src/**/mocks/**',
        '**/*.stories.*',
        '**/node_modules/**'
      ],
      thresholds: {                  // opcional: falla si no alcanza
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  },
}));
