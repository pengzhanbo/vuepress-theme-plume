import { defineConfig } from 'tsdown'
import { argv } from '../../scripts/tsdown-args.mjs'

/** @import {Options} from 'tsdown' */

const config = [
  { dir: 'composables', files: ['codeRepl.ts', 'pdf.ts', 'rustRepl.ts', 'size.ts', 'audio.ts', 'demo.ts', 'mark.ts', 'decrypt.ts'] },
  { dir: 'utils', files: ['http.ts', 'link.ts', 'sleep.ts'] },
  { dir: '', files: ['index.ts', 'options.ts'] },
]

const clientExternal = [
  /.*\.vue$/,
  /composables\/.*\.js$/,
  /utils\/.*\.js$/,
  /.*\/options\.js$/,
  /shared\/index\.js$/,
]

export default defineConfig((cli) => {
  /** @type {Options}  */
  const DEFAULT_OPTIONS = {
    dts: true,
    sourcemap: false,
    format: 'esm',
    clean: !cli.watch,
    fixedExtension: false,
  }

  /** @type {Options[]} */
  const options = []

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
      target: 'node20.6.0',
      external: ['markdown-it', /^@?vuepress/],
    })
  }

  if (argv.client) {
    options.push(...config.map(({ dir, files }) => ({
      ...DEFAULT_OPTIONS,
      entry: files.map(file => `./src/client/${dir}/${file}`),
      outDir: `./lib/client/${dir}`,
      external: clientExternal,
    })))
  }
  return options
})
