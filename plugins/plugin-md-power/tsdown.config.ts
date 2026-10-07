import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { defineConfig, type UserConfig } from 'tsdown'
import { rewriteBundle } from '../../scripts/strip-comments.js'
import { argv } from '../../scripts/tsdown-args.js'

/**
 * Enumerate the TypeScript entry files of a client directory.
 *
 * New `src/client/composables/*.ts` (and `src/client/utils/*.ts`) files are picked up
 * automatically, so they no longer need to be registered in a hardcoded list.
 *
 * 枚举客户端目录下的 TypeScript 入口文件。
 * 新增的 `src/client/composables/*.ts`（以及 `src/client/utils/*.ts`）会被自动纳入构建，
 * 不再需要维护硬编码清单。
 *
 * @param dir - Directory relative to `src/client`, or `''` for the client root
 */
function clientEntries(dir: string): string[] {
  const target = path.join(process.cwd(), 'src/client', dir)
  return fs.readdirSync(target, { withFileTypes: true })
    .filter(file => file.isFile() && file.name.endsWith('.ts') && !file.name.endsWith('.d.ts'))
    .map(file => file.name)
    .sort()
}

const config = [
  { dir: 'composables', files: clientEntries('composables') },
  { dir: 'utils', files: clientEntries('utils') },
  { dir: '', files: clientEntries('') },
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
    onSuccess: rewriteBundle,
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
