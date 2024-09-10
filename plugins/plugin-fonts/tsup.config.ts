import { defineConfig, type Options } from 'tsup'

const clientExternal: (string | RegExp)[] = [
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
  return [
    // node
    {
      ...DEFAULT_OPTIONS,
      entry: ['./src/node/index.ts'],
      outDir: './lib/node',
      target: 'node18',
    },
    // client/config.js
    {
      ...DEFAULT_OPTIONS,
      entry: ['./src/client/config.ts'],
      outDir: './lib/client',
      dts: false,
      external: clientExternal,
    },
  ]
})
