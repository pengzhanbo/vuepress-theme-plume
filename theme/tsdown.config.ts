import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { defineConfig, type UserConfig } from 'tsdown'
import { argv } from '../scripts/tsdown-args'

/** @import {Options} from 'tsdown' */

const sharedExternal = [
  /.*\/shared\/index\.js$/,
]

const clientExternal = [
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
  const DEFAULT_OPTIONS: UserConfig = {
    dts: true,
    sourcemap: false,
    watch: cli.watch,
    format: 'esm',
    clean: !cli.watch,
    fixedExtension: false,
  }
  const options: UserConfig[] = []

  // shared
  options.push({
    ...DEFAULT_OPTIONS,
    entry: ['./src/shared/index.ts'],
    outDir: './dist/shared',
    deps: { neverBundle: ['sax'] },
  })

  if (argv.node) {
    options.push({
      ...DEFAULT_OPTIONS,
      entry: ['./src/node/index.ts'],
      outDir: './dist/node',
      deps: { neverBundle: [...sharedExternal, '@pinyin-pro/data/complete'] },
      target: 'node20.19.0',
      watch: false,
    })
  }
  if (argv.client) {
    options.push(
      // client/utils/index.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/utils/index.ts'],
        outDir: './dist/client/utils',
        platform: 'browser',
        deps: { neverBundle: clientExternal },
      },
      // client/composables/index.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/composables/index.ts'],
        outDir: './dist/client/composables',
        platform: 'browser',
        deps: { neverBundle: [
          ...clientExternal,
          '../utils/index.js',
        ] },
      },
      // client/config.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/config.ts'],
        outDir: './dist/client',
        dts: false,
        platform: 'browser',
        deps: { neverBundle: [
          ...clientExternal,
          './composables/index.js',
          './utils/index.js',
        ] },
      },
      // client/index.js
      {
        ...DEFAULT_OPTIONS,
        entry: ['./src/client/index.ts'],
        outDir: './dist/client',
        platform: 'browser',
        deps: { neverBundle: [
          ...clientExternal,
          './composables/index.js',
          './utils/index.js',
          './config.js',
        ] },
      },
      ...featuresComposables.map(file => ({
        ...DEFAULT_OPTIONS,
        entry: [`./src/client/features/composables/${file}`],
        outDir: `./dist/client/features/composables/`,
        platform: 'browser',
        deps: { neverBundle: [
          ...clientExternal,
          '../../composables/index.js',
          '../../utils/index.js',
          ...featuresComposables.map(file => `./${file.replace('.ts', '.js')}`),
        ] },
      } as UserConfig)),
    )
  }
  return options
})
