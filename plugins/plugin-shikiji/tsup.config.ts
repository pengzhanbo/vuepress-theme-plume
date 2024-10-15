import { defineConfig, type Options } from 'tsup'
import { argv } from '../../scripts/tsup-args.js'

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
      // client/composables/
      {
        ...DEFAULT_OPTIONS,
        entry: [
          'copy-code.ts',
          'twoslash.ts',
          'collapsed-lines.ts',
        ].map(file => `./src/client/composables/${file}`),
        outDir: './lib/client/composables',
        external: [/.*\.css$/],
      },
    ])
  }
  return options
})
