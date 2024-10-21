import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { defineConfig, type Options } from 'tsup'
import { argv } from '../scripts/tsup-args.js'

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

const featuresComposables = fs.readdirSync(
  path.join(process.cwd(), 'src/client/features/composables'),
  { recursive: true, encoding: 'utf-8' },
)

export default defineConfig((cli) => {
  const DEFAULT_OPTIONS: Options = {
    dts: true,
    sourcemap: false,
    splitting: false,
    watch: cli.watch,
    format: 'esm',
    silent: !!cli.watch,
  }
  const options: Options[] = []

  // shared
  options.push({
    ...DEFAULT_OPTIONS,
    entry: ['./src/shared/index.ts'],
    outDir: './lib/shared',
    dts: true,
  })

  if (argv.node) {
    options.push({
      ...DEFAULT_OPTIONS,
      entry: ['./src/node/index.ts'],
      outDir: './lib/node',
      external: sharedExternal,
      target: 'node18',
      watch: false,
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
      ...featuresComposables.map(file => ({
        ...DEFAULT_OPTIONS,
        entry: [`./src/client/features/composables/${file}`],
        outDir: `./lib/client/features/composables/`,
        external: [
          ...clientExternal,
          '../../composables/index.js',
          '../../utils/index.js',
          ...featuresComposables.map(file => `./${file.replace('.ts', '.js')}`),
        ],
      })),
    ])
  }
  return options
})
