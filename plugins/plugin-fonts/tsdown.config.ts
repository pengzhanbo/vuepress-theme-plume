import type { Options } from 'tsdown'
import { defineConfig } from 'tsdown'
import { argv } from '../../scripts/tsup-args.js'

const clientExternal: (string | RegExp)[] = [
  /.*\.vue$/,
  /.*\.css$/,
]

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
      entry: ['./src/node/index.ts'],
      outDir: './lib/node',
      target: 'node20.6.0',
    })
  }

  if (argv.client) {
    options.push(...[
      // client/config.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/config.ts'],
        outDir: './lib/client',
        dts: false,
        external: clientExternal,
      },
    ])
  }
  return options
}) as Options[]
