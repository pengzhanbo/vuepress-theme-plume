import type { Options } from 'tsdown'
import { defineConfig } from 'tsdown'
import { version } from './package.json'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  dts: true,
  format: 'esm',
  sourcemap: false,
  clean: true,
  define: {
    __CLI_VERSION__: JSON.stringify(version),
  },
}) as Options
