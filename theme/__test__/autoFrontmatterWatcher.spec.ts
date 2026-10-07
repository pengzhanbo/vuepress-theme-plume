import path from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * `watchAutoFrontmatter` registers a chokidar watcher and reacts to `add` events.
 * `chokidar.watch` is stubbed so the registered options and handler can be asserted,
 * and the theme config + logger are stubbed to keep the test off the real file system.
 *
 * `watchAutoFrontmatter` 会注册 chokidar watcher 并响应 `add` 事件。
 * 这里桩化 `chokidar.watch`，以便断言注册的选项与处理器，并桩化主题配置与 logger，
 * 使测试不接触真实文件系统。
 */
const hoisted = vi.hoisted(() => ({
  themeConfig: {} as any,
  onAdd: undefined as ((filepath: string) => void) | undefined,
  watchOptions: undefined as any,
  error: vi.fn(),
  warn: vi.fn(),
}))

vi.mock('chokidar', () => ({
  watch: (_dir: string, options: any) => {
    hoisted.watchOptions = options
    return {
      on: (event: string, callback: (filepath: string) => void) => {
        if (event === 'add')
          hoisted.onAdd = callback
      },
    }
  },
}))

vi.mock('../src/node/loadConfig/index.js', () => ({
  getThemeConfig: () => hoisted.themeConfig,
}))

vi.mock('../src/node/utils/index.js', () => ({
  logger: { info: vi.fn(), warn: hoisted.warn, error: hoisted.error },
  nanoid: () => 'id',
  getPinyin: async () => null,
  hasPinyin: false,
}))

const { watchAutoFrontmatter } = await import('../src/node/autoFrontmatter/generate.js')
const { genAutoFrontmatterRules } = await import('../src/node/autoFrontmatter/rules.js')

const cwd = '/root'
const app = {
  options: { pagePatterns: ['**/*.md'] },
  dir: { source: () => cwd },
} as any

beforeEach(() => {
  vi.clearAllMocks()
  hoisted.onAdd = undefined
  hoisted.themeConfig = {
    locales: { '/': { collections: [{ type: 'doc', dir: 'blog', title: 'Blog' }] } },
  }
  genAutoFrontmatterRules()
})

describe('watchAutoFrontmatter', () => {
  it('registers the watcher', () => {
    const watchers: any[] = []

    watchAutoFrontmatter(app, watchers)

    expect(watchers).toHaveLength(1)
    expect(hoisted.watchOptions.ignoreInitial).toBe(true)
  })

  it('ignores vuepress internals, non-markdown files and unmatched paths', () => {
    watchAutoFrontmatter(app, [])
    const { ignored } = hoisted.watchOptions

    expect(ignored(path.join(cwd, '.vuepress/a.md'), { isFile: () => true })).toBe(true)
    expect(ignored(path.join(cwd, 'notes.txt'), { isFile: () => true })).toBe(true)
    expect(ignored(path.join(cwd, 'blog/a.md'), { isFile: () => true })).toBe(false)
    // 目录事件不会被忽略（由后续的 glob 过滤器决定）。
    expect(ignored(path.join(cwd, 'blog'), { isFile: () => false })).toBe(false)
  })

  it('processes a newly added matching file', async () => {
    watchAutoFrontmatter(app, [])

    // 文件不存在时处理会失败，但失败会被汇总上报，而不是静默丢弃。
    hoisted.onAdd!('blog/new.md')
    await new Promise(resolve => setTimeout(resolve, 20))

    expect(hoisted.error).toHaveBeenCalled()
  })

  it('ignores added files that match no rule', async () => {
    watchAutoFrontmatter(app, [])

    // `.vuepress` 下的文件被所有规则排除。
    hoisted.onAdd!('.vuepress/a.md')
    await new Promise(resolve => setTimeout(resolve, 20))

    expect(hoisted.error).not.toHaveBeenCalled()
  })
})
