import type { Options } from 'tsdown'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  dts: true,
  format: 'esm',
  sourcemap: false,
}) as Options
