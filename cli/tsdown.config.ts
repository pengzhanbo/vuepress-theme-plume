import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  outDir: 'dist',
  dts: true,
  format: 'esm',
  sourcemap: false,
  fixedExtension: false,
})
