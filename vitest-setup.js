import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Reset jsdom after each test
afterEach(() => {
  cleanup();
});
