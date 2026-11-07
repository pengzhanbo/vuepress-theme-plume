import type { App } from 'vuepress'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * `findConfigPath` resolves every candidate against `process.cwd()`, so the cwd is
 * redirected to a fixture directory. The logger is stubbed to assert the warning
 * emitted when an explicit config path cannot be used.
 *
 * `findConfigPath` 的所有候选路径都相对 `process.cwd()` 解析，因此这里把工作目录
 * 指向夹具目录，并桩化 logger 以断言显式路径不可用时输出的警告。
 */
const hoisted = vi.hoisted(() => ({
  warn: vi.fn(),
}))

vi.mock('../utils/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/index.js')>()
  return {
    ...actual,
    logger: { ...actual.logger, warn: hoisted.warn },
  }
})

const { findConfigPath } = await import('../features/loadConfig/findConfigPath.js')

// 测试在测试目录内创建临时文件。
// `.tmp` 目录已被 gitignore 忽略，并在测试结束后清理。
const TEST_TMP_DIR = fileURLToPath(new URL('.tmp', import.meta.url))
fs.mkdirSync(TEST_TMP_DIR, { recursive: true })
const rootDir = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'find-config-'))
const caseDirs: string[] = []

let restoreCwd: (() => void) | undefined

beforeEach(() => {
  hoisted.warn.mockClear()
})

afterEach(() => {
  restoreCwd?.()
  restoreCwd = undefined
})

afterAll(() => {
  fs.rmSync(rootDir, { recursive: true, force: true })
  for (const dir of caseDirs)
    fs.rmSync(dir, { recursive: true, force: true })
})

/** 创建一个独立的工作目录与 VuePress 源目录，并把 cwd 指向该目录。 */
function createWorkspace() {
  const dir = fs.mkdtempSync(path.join(rootDir, 'case-'))
  caseDirs.push(dir)
  const source = path.join(dir, 'docs')
  fs.mkdirSync(source, { recursive: true })

  const app = {
    dir: { source: (sub?: string) => path.join(source, sub ?? '') },
  } as unknown as App

  restoreCwd = vi.spyOn(process, 'cwd').mockReturnValue(dir)
  return { dir, source, app }
}

function writeConfig(filepath: string, content = 'export default {}'): string {
  fs.mkdirSync(path.dirname(filepath), { recursive: true })
  fs.writeFileSync(filepath, content)
  return filepath
}

describe('findConfigPath > explicit config path', () => {
  it('resolves the explicit path against cwd and returns it', async () => {
    const { dir, app } = createWorkspace()
    const explicit = writeConfig(path.join(dir, 'config', 'theme.ts'))

    await expect(findConfigPath(app, 'config/theme.ts')).resolves.toBe(explicit)
    expect(hoisted.warn).not.toHaveBeenCalled()
  })

  it('prefers the explicit path over the discovered default config', async () => {
    const { dir, source, app } = createWorkspace()
    const explicit = writeConfig(path.join(dir, 'custom.ts'))
    writeConfig(path.join(source, '.vuepress', 'plume.config.ts'))

    await expect(findConfigPath(app, 'custom.ts')).resolves.toBe(explicit)
  })

  it('warns and falls back when the explicit path is not a file', async () => {
    const { dir, source, app } = createWorkspace()
    // 同名目录会被 `existsSync` 命中，但不是配置文件，必须回退到默认搜索。
    fs.mkdirSync(path.join(dir, 'plume.config.ts'))
    const fallback = writeConfig(path.join(source, '.vuepress', 'plume.config.ts'))

    await expect(findConfigPath(app, 'plume.config.ts')).resolves.toBe(fallback)
    expect(hoisted.warn).toHaveBeenCalledWith(
      expect.stringContaining('Can not find config file'),
    )
    expect(hoisted.warn.mock.calls[0][0]).toContain('plume.config.ts')
  })

  it('warns and falls back when the explicit path does not exist', async () => {
    const { source, app } = createWorkspace()
    const fallback = writeConfig(path.join(source, '.vuepress', 'plume.config.ts'))

    await expect(findConfigPath(app, 'missing.ts')).resolves.toBe(fallback)
    expect(hoisted.warn).toHaveBeenCalledTimes(1)
    expect(hoisted.warn.mock.calls[0][0]).toContain('missing.ts')
    expect(hoisted.warn.mock.calls[0][0]).toContain('Use config file')
  })

  it('stays silent when neither the explicit nor a default config exists', async () => {
    const { app } = createWorkspace()

    await expect(findConfigPath(app, 'missing.ts')).resolves.toBeUndefined()
    // 没有可用的回退配置时，重复提示“无法找到配置”反而会掩盖真正的问题。
    expect(hoisted.warn).not.toHaveBeenCalled()
  })

  it('does not warn when no explicit path was requested', async () => {
    const { app } = createWorkspace()

    await expect(findConfigPath(app)).resolves.toBeUndefined()
    expect(hoisted.warn).not.toHaveBeenCalled()
  })
})

describe('findConfigPath > discovery order', () => {
  it('checks each extension before moving to the next candidate', async () => {
    const { dir, source, app } = createWorkspace()
    // `.ts` 候选先于 `.js` 候选，因此源目录下的 ts 配置优先于 cwd 的 js 配置。
    const tsConfig = writeConfig(path.join(source, '.vuepress', 'plume.config.ts'))
    writeConfig(path.join(dir, 'plume.config.js'))

    await expect(findConfigPath(app)).resolves.toBe(tsConfig)
  })

  it('prefers the cwd config over the `.vuepress` directory for the same extension', async () => {
    const { dir, source, app } = createWorkspace()
    // `docs/.vuepress/plume.config.js` 不存在，随后命中 cwd 下的同名配置。
    const cwdConfig = writeConfig(path.join(dir, 'plume.config.js'))
    fs.mkdirSync(path.join(source, '.vuepress'), { recursive: true })

    await expect(findConfigPath(app)).resolves.toBe(cwdConfig)
  })

  it('falls back to the `.vuepress` directory under cwd', async () => {
    const { dir, app } = createWorkspace()
    const fallback = writeConfig(path.join(dir, '.vuepress', 'plume.config.mjs'))

    await expect(findConfigPath(app)).resolves.toBe(fallback)
  })

  it('ignores a config path that exists but is a directory', async () => {
    const { source, app } = createWorkspace()
    fs.mkdirSync(path.join(source, '.vuepress', 'plume.config.ts'), { recursive: true })

    await expect(findConfigPath(app)).resolves.toBeUndefined()
  })
})
