import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, describe, expect, it } from 'vitest'
import { rewriteBundle, strip, stripRegionComments } from '../strip-comments.js'

describe('strip', () => {
  it('drops regular single-line and multi-line comments', () => {
    const out = strip('// gone\nconst a = 1 /* gone */')

    expect(out).not.toContain('gone')
    expect(out).toContain('const a = 1')
  })

  it('keeps tree-shaking annotations', () => {
    expect(strip('/*#__PURE__*/createApp()')).toContain('/*#__PURE__*/')
    expect(strip('/* @__PURE__ */createApp()')).toContain('@__PURE__')
    expect(strip('/* @__NO_SIDE_EFFECTS__ */function f() {}')).toContain('@__NO_SIDE_EFFECTS__')
  })

  it('keeps dynamic-import ignore hints', () => {
    expect(strip('import(/* @vite-ignore */ url)')).toContain('@vite-ignore')
    expect(strip('import(/* webpackIgnore: true */ url)')).toContain('webpackIgnore')
    expect(strip('import(/* webpackChunkName: "chunk" */ "./a.js")')).toContain('webpackChunkName:')
  })

  it('keeps coverage ignore hints', () => {
    expect(strip('/* c8 ignore next */\nif (a) {}')).toContain('c8 ignore')
    expect(strip('/* v8 ignore next */\nif (a) {}')).toContain('v8 ignore')
  })
})

describe('stripRegionComments', () => {
  it('removes rolldown region markers but keeps the code', () => {
    const out = stripRegionComments('//#region a\nconst a = 1\n//#endregion\n')

    expect(out).toBe('const a = 1\n')
  })
})

// 测试在测试目录内创建临时文件。
// `.tmp` 目录已被 gitignore 忽略，并在测试结束后清理。
const TEST_TMP_DIR = fileURLToPath(new URL('.tmp', import.meta.url))
fs.mkdirSync(TEST_TMP_DIR, { recursive: true })
const outDir = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'strip-'))

function read(name: string): string {
  return fs.readFileSync(path.join(outDir, name), 'utf-8')
}

afterAll(() => {
  fs.rmSync(outDir, { recursive: true, force: true })
})

describe('rewriteBundle', () => {
  it('strips comments from the js bundle and region markers from the dts', async () => {
    fs.writeFileSync(
      path.join(outDir, 'index.js'),
      '// a single line comment\nconst a = 1 /* a block comment */\n/* @__PURE__ */ createApp()\n',
    )
    fs.writeFileSync(
      path.join(outDir, 'index.d.ts'),
      '//#region src/a.ts\nexport type A = 1\n//#endregion\n',
    )

    await rewriteBundle({ entry: { index: 'src/index.ts' }, outDir, watch: false } as any)

    const js = read('index.js')
    expect(js).not.toContain('a single line comment')
    expect(js).not.toContain('a block comment')
    // 带有 tree-shaking 语义的注释必须保留。
    expect(js).toContain('@__PURE__')

    const dts = read('index.d.ts')
    expect(dts).not.toContain('#region')
    expect(dts).toContain('export type A = 1')
  })

  it('does nothing in watch mode', async () => {
    const original = '// untouched\nconst a = 1\n'
    fs.writeFileSync(path.join(outDir, 'watch.js'), original)

    await rewriteBundle({ entry: { watch: 'src/index.ts' }, outDir, watch: true } as any)

    expect(fs.readFileSync(path.join(outDir, 'watch.js'), 'utf-8')).toBe(original)
  })

  it('skips entries whose output files do not exist', async () => {
    await expect(
      rewriteBundle({ entry: { missing: 'src/index.ts' }, outDir, watch: false } as any),
    ).resolves.toBeUndefined()
  })
})
