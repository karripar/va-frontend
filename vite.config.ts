/// <reference types="vitest/config" />
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest-setup.js',
    include: ['src/tests/**/*.test.{ts,tsx}'],
  },
});