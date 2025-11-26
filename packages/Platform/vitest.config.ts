// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',  // For fetch() API calls
    pool: 'threads',  // Fixes CJS warning
    globals: true,
    setupFiles: ['./tests/setup.ts']
  }
})
