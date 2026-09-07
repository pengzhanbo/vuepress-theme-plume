import { defineConfig, type UserConfig } from 'tsdown'
import { rewriteBundle } from '../../scripts/strip-comments.js'
import { argv } from '../../scripts/tsdown-args.js'

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
    onSuccess: rewriteBundle,
  }
  const options: UserConfig[] = []

  if (argv.node) {
    options.push({
      ...DEFAULT_OPTIONS,
      entry: ['./src/node/index.ts'],
      outDir: './dist/node',
      target: 'node20.19.0',
    })
  }

  if (argv.client) {
    options.push(...[
      // client/config.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/config.ts'],
        outDir: './dist/client',
        dts: false,
        deps: { neverBundle: clientExternal },
      },
    ])
  }
  return options
})
