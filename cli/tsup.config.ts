import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  dts: true,
  format: 'esm',
  sourcemap: false,
  splitting: false,
})
