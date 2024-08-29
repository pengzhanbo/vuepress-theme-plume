import { defineConfig } from 'tsup'
import { version } from './package.json'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  dts: true,
  format: 'esm',
  sourcemap: false,
  splitting: false,
  clean: true,
  define: {
    __CLI_VERSION__: JSON.stringify(version),
  },
})
