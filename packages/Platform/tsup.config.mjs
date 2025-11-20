// tsup.config.mjs
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  outDir: 'dist',
  entryName: 'evonext-platform', // ✅ This works!
  sourcemap: true,
  clean: true
})
