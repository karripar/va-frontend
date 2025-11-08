/// <reference types="vitest/config" />
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigpaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigpaths()],
  base: '',
  test: {
    environment: 'happy-dom',
    isolate: true,
    globals: true,
    setupFiles: './vitest-setup.js',
    include: ['src/tests/**/*.test.{ts,tsx}'],
    env: {
      NEXT_PUBLIC_CONTENT_API: 'https://example.com/api', // Mock API URL for tests
      NEXT_PUBLIC_USE_MOCK_DATA: 'true', // Use mock data during tests
    }
  },
});