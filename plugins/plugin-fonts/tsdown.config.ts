import { defineConfig, type UserConfig } from 'tsdown'
import { argv } from '../../scripts/tsdown-args'

const clientExternal = [
  /.*\.vue$/,
  /.*\.css$/,
]

export default defineConfig(() => {
  const DEFAULT_OPTIONS: UserConfig = {
    dts: true,
    sourcemap: false,
    format: 'esm',
    fixedExtension: false,
  }
  const options: UserConfig[] = []

  if (argv.node) {
    options.push({
      ...DEFAULT_OPTIONS,
      entry: ['./src/node/index.ts'],
      outDir: './lib/node',
      target: 'node20.19.0',
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
        deps: { neverBundle: clientExternal },
      },
    ])
  }
  return options
})
