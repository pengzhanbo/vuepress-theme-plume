import { type Options, defineConfig } from 'tsup'

const sharedExternal: (string | RegExp)[] = [
  /.*\/shared\/index\.js$/,
]

const clientExternal: (string | RegExp)[] = [
  ...sharedExternal,
  /.*\.vue$/,
  /^@internal/,
  /^@theme/,
  /.*\.css$/,
]

export default defineConfig((cli) => {
  const DEFAULT_OPTIONS: Options = {
    dts: !cli.watch,
    sourcemap: false,
    splitting: false,
    format: 'esm',
    silent: !!cli.watch,
  }
  return [
    // shared
    {
      ...DEFAULT_OPTIONS,
      entry: ['./src/shared/index.ts'],
      outDir: './lib/shared',
      dts: true,
    },
    // node
    {
      ...DEFAULT_OPTIONS,
      entry: ['./src/node/index.ts'],
      outDir: './lib/node',
      external: sharedExternal,
      target: 'node18',
    },
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
      external: [
        ...clientExternal,
        '../utils/index.js',
      ],
    },
    // client/config.js
    {
      ...DEFAULT_OPTIONS,
      entry: ['./src/client/config.ts'],
      outDir: './lib/client',
      dts: false,
      external: [
        ...clientExternal,
        './composables/index.js',
        './utils/index.js',
      ],
    },
    // client/index.js
    {
      ...DEFAULT_OPTIONS,
      entry: ['./src/client/index.ts'],
      outDir: './lib/client',
      external: [
        ...clientExternal,
        './composables/index.js',
        './utils/index.js',
        './config.js',
      ],
    },
  ]
})
