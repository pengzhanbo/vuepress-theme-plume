import { defineConfig } from 'tsdown'
import { argv } from '../../scripts/tsdown-args.mjs'

/** @import {Options} from 'tsdown' */

const clientExternal = [
  /.*\.vue$/,
  /.*\.css$/,
]

export default defineConfig(() => {
  /** @type {Options} */
  const DEFAULT_OPTIONS = {
    dts: true,
    sourcemap: false,
    format: 'esm',
  }
  /** @type {Options[]} */
  const options = []

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
})
