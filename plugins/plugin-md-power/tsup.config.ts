import { defineConfig, type Options } from 'tsup'
import { argv } from '../../scripts/tsup-args.js'

const config = [
  { dir: 'composables', files: ['codeRepl.ts', 'pdf.ts', 'rustRepl.ts', 'size.ts', 'audio.ts'] },
  { dir: 'utils', files: ['http.ts', 'is.ts', 'link.ts', 'sleep.ts'] },
  { dir: '', files: ['index.ts', 'options.ts'] },
]

const clientExternal = [
  /composables\/.*\.js$/,
  /utils\/.*\.js$/,
  /.*\/options\.js$/,
  /shared\/index\.js$/,
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
      target: 'node18',
      external: ['markdown-it', /^@?vuepress/],
    })
  }

  if (argv.client) {
    options.push(...config.map(({ dir, files }) => ({
      ...DEFAULT_OPTIONS,
      entry: files.map(file => `./src/client/${dir}/${file}`),
      outDir: `./lib/client/${dir}`,
      external: clientExternal,
    }) as Options))
  }
  return options
})
