import { defineConfig, type Options } from 'tsup'

export default defineConfig(() => {
  const DEFAULT_OPTIONS: Options = {
    dts: true,
    sourcemap: false,
    splitting: false,
    format: 'esm',
  }
  return [
    // node
    {
      ...DEFAULT_OPTIONS,
      entry: ['./src/node/index.ts'],
      outDir: './lib/node',
      target: 'node18',
    },
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
  ]
})
