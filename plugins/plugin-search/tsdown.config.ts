import { defineConfig, type UserConfig } from 'tsdown'
import { argv } from '../../scripts/tsdown-args'

const sharedExternal = [
  /.*\/shared\/index\.js$/,
]

const clientExternal = [
  ...sharedExternal,
  /^@internal/,
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
      deps: { neverBundle: sharedExternal },
      target: 'node20.19.0',
    })
  }

  if (argv.client) {
    options.push(...[
      // client/utils/index.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/utils/index.ts'],
        outDir: './lib/client/utils',
        deps: { neverBundle: clientExternal },
      },
      // client/composables/index.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/composables/index.ts'],
        outDir: './lib/client/composables',
        deps: { neverBundle: clientExternal },
      },
      // client/config.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/config.ts'],
        outDir: './lib/client',
        deps: { neverBundle: clientExternal },
        dts: false,
      },
      // client/index.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/index.ts'],
        outDir: './lib/client',
        deps: { neverBundle: [
          ...clientExternal,
          './composables/index.js',
        ] },
      },
    ])
  }

  return options
})
