import { defineConfig, type Options } from 'tsup'
import { argv } from '../../scripts/tsup-args.js'

const clientExternal: (string | RegExp)[] = [
  /.*\.vue$/,
  /.*\.css$/,
]

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
      entry: ['./src/node/index.ts'],
      outDir: './lib/node',
      target: 'node18',
    })
  }
  if (argv.client) {
    options.push(...[
      // client/composables/index.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/composables/index.ts'],
        outDir: './lib/client/composables',
        external: clientExternal,
      },
      // client/components/index.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/components/Content.ts'],
        outDir: './lib/client/components',
        external: [...clientExternal, '../composables/index.js'],
      },
      // client/config.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/config.ts'],
        outDir: './lib/client',
        dts: false,
        external: [...clientExternal, './components/Content.js'],
      },
      // client/index.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/index.ts'],
        outDir: './lib/client',
        external: [...clientExternal, './components/Content.js', './composables/index.js'],
      },
    ])
  }
  return options
})
