import { defineConfig } from 'tsdown'
import { rewriteBundle } from '../scripts/strip-comments.js'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  outDir: 'dist',
  dts: false,
  format: 'esm',
  sourcemap: false,
  fixedExtension: false,
  onSuccess: rewriteBundle,
})
