import { defineConfig, type UserConfig } from 'tsdown'
import { argv } from '../../scripts/tsdown-args'

const config = [
  { dir: 'composables', files: ['codeRepl.ts', 'pdf.ts', 'rustRepl.ts', 'size.ts', 'audio.ts', 'demo.ts', 'mark.ts', 'decrypt.ts', 'qrcode.ts'] },
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
  const DEFAULT_OPTIONS: UserConfig = {
    dts: true,
    sourcemap: false,
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
  })

  if (argv.node) {
    options.push({
      ...DEFAULT_OPTIONS,
      entry: ['./src/node/index.ts'],
      outDir: './dist/node',
      target: 'node20.19.0',
      deps: { neverBundle: ['markdown-it', /^@?vuepress/] },
    })
  }

  if (argv.client) {
    options.push(...config.map(({ dir, files }) => ({
      ...DEFAULT_OPTIONS,
      entry: files.map(file => `./src/client/${dir}/${file}`),
      outDir: `./dist/client/${dir}`,
      deps: { neverBundle: clientExternal },
    })))
  }
  return options
})
