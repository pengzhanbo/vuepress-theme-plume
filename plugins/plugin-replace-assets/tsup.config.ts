import type { Options } from 'tsup'
import { defineConfig } from 'tsup'
import { argv } from '../../scripts/tsup-args.js'

export default defineConfig(() => {
  const DEFAULT_OPTIONS: Options = {
    dts: true,
    sourcemap: false,
    splitting: false,
    format: 'esm',
  }
  const options: Options[] = []

  if (argv.node) {
    options.push({
      ...DEFAULT_OPTIONS,
      entry: ['./src/index.ts'],
      outDir: './lib',
      target: 'node18',
    })
  }

  return options
})
