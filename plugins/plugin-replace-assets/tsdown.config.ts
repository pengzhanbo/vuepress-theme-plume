import type { Options } from 'tsdown'
import { defineConfig } from 'tsdown'
import { argv } from '../../scripts/tsup-args.js'

export default defineConfig(() => {
  const DEFAULT_OPTIONS: Options = {
    dts: true,
    sourcemap: false,
    format: 'esm',
  }
  const options: Options[] = []

  if (argv.node) {
    options.push({
      ...DEFAULT_OPTIONS,
      entry: ['./src/index.ts'],
      outDir: './lib',
      target: 'node20.6.0',
    })
  }

  return options
}) as Options[]
