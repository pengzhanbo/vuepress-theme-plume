import fs from 'node:fs/promises'
import path from 'node:path'
import parse from 'js-tokens'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  outDir: 'dist',
  dts: false,
  format: 'esm',
  sourcemap: false,
  fixedExtension: false,
  async onSuccess(config) {
    for (const name of Object.keys(config.entry)) {
      const file = path.join(config.outDir, `${name}.js`)
      const content = strip(await fs.readFile(file, 'utf-8'))
      await fs.writeFile(file, content)
    }
  },
})

function strip(input: string): string {
  const tokens = parse(input, { jsx: false })
  let code = ''
  for (const token of tokens) {
    if (token.type === 'MultiLineComment' || token.type === 'SingleLineComment') {
      code += ''
    }
    else {
      code += token.value
    }
  }
  return code
}
