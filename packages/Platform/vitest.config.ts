import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'], // Optional: add if you need test setup
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,js}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.config.ts',
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'tests/**/*'
      ]
    }
  }
})
