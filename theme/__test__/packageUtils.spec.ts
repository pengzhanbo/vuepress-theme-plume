import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * `getThemePackage` resolves the theme's `package.json` through the `resolve()` helper,
 * which resolves relative to the *built* module location (`theme/dist/node`). Under the
 * source layout the result points elsewhere, so `resolve` is stubbed here to assert the
 * requested relative path and feed a fixture file.
 *
 * `getThemePackage` 通过 `resolve()` 辅助函数定位主题的 `package.json`，而该函数是相对
 * 构建产物* 的位置（`theme/dist/node`）解析的。源码布局下结果会指向别处，
 * 因此这里以桩替换 `resolve`，断言请求的相对路径并喂入一个夹具文件。
 */
const hoisted = vi.hoisted(() => ({
  resolveArgs: [] as string[],
  resolveReturn: '',
}))

vi.mock('../src/node/utils/path.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/node/utils/path.js')>()
  return {
    ...actual,
    resolve: (...args: string[]) => {
      hoisted.resolveArgs.push(...args)
      return hoisted.resolveReturn
    },
  }
})

const { getPackage, getThemePackage, readJsonFileAsync } = await import('../src/node/utils/package.js')

// 测试在测试目录内创建临时文件。
// `.tmp` 目录已被 gitignore 忽略，并在测试结束后清理。
const TEST_TMP_DIR = fileURLToPath(new URL('.tmp', import.meta.url))
fs.mkdirSync(TEST_TMP_DIR, { recursive: true })
const tmpDir = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'package-'))

beforeAll(() => {
  fs.writeFileSync(path.join(tmpDir, 'valid.json'), JSON.stringify({ name: 'demo', version: '1.2.3' }))
  fs.writeFileSync(path.join(tmpDir, 'broken.json'), '{ invalid json')
})

beforeEach(() => {
  hoisted.resolveArgs = []
  hoisted.resolveReturn = ''
})

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe('readJsonFileAsync', () => {
  it('reads and parses a valid JSON file', () => {
    expect(readJsonFileAsync(path.join(tmpDir, 'valid.json'))).toEqual({
      name: 'demo',
      version: '1.2.3',
    })
  })

  it('returns an empty object for a missing file', () => {
    // 文件不存在时不应抛错，而是回退为空对象。
    expect(readJsonFileAsync(path.join(tmpDir, 'missing.json'))).toEqual({})
  })

  it('returns an empty object for a malformed JSON file', () => {
    expect(readJsonFileAsync(path.join(tmpDir, 'broken.json'))).toEqual({})
  })
})

describe('getPackage', () => {
  it('reads the package.json of the current working directory', () => {
    // 测试从仓库根目录运行，读取到的是 monorepo 的 package.json。
    expect(getPackage().name).toBe('vuepress-theme-plume-monorepo')
  })
})

describe('getThemePackage', () => {
  it('reads the theme package.json resolved from `../package.json`', () => {
    const filepath = path.join(tmpDir, 'theme-package.json')
    fs.writeFileSync(filepath, JSON.stringify({ name: 'vuepress-theme-plume', version: '9.9.9' }))
    hoisted.resolveReturn = filepath

    expect(getThemePackage()).toEqual({ name: 'vuepress-theme-plume', version: '9.9.9' })
    // 主题包相对于 `resolve` 的基准目录位于上一级。
    expect(hoisted.resolveArgs).toEqual(['../package.json'])
  })

  it('falls back to an empty object when the theme package is missing', () => {
    hoisted.resolveReturn = path.join(tmpDir, 'missing-theme-package.json')

    expect(getThemePackage()).toEqual({})
  })
})
