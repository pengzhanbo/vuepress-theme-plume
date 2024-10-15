import { defineConfig, type Options } from 'tsup'
import { argv } from '../../scripts/tsup-args.js'

const sharedExternal: (string | RegExp)[] = [
  /.*\/shared\/index\.js$/,
]

const clientExternal: (string | RegExp)[] = [
  ...sharedExternal,
  /^@internal/,
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

  // shared
  options.push({
    ...DEFAULT_OPTIONS,
    entry: ['./src/shared/index.ts'],
    outDir: './lib/shared',
  })

  if (argv.node) {
    options.push({
      ...DEFAULT_OPTIONS,
      entry: ['./src/node/index.ts'],
      outDir: './lib/node',
      external: sharedExternal,
      target: 'node18',
    })
  }

  if (argv.client) {
    options.push(...[
      // client/utils/index.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/utils/index.ts'],
        outDir: './lib/client/utils',
        external: clientExternal,
      },
      // client/composables/index.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/composables/index.ts'],
        outDir: './lib/client/composables',
        external: clientExternal,
      },
      // client/config.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/config.ts'],
        outDir: './lib/client',
        external: clientExternal,
        dts: false,
      },
      // client/index.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/index.ts'],
        outDir: './lib/client',
        external: [
          ...clientExternal,
          './composables/index.js',
        ],
      },
    ])
  }

  return options
})
