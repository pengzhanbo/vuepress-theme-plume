import type { App, Page } from 'vuepress'
import type { ThemeOptions, ThemeSidebarItem } from '../src/shared/index.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  writeTemp: vi.fn(),
}))

// 仅替换写入临时文件的副作用，保留真实的 `normalizeLink`，
// 使测试覆盖前缀归一化与路径切片的真实组合。
// Only the temp-file write side effect is replaced; the real `normalizeLink` is
// kept so the test covers the actual prefix normalization combined with the path
// slicing.
vi.mock('../src/node/utils/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/node/utils/index.js')>()
  return {
    ...actual,
    perf: { mark: vi.fn(), log: vi.fn() },
    resolveContent: vi.fn((_app: unknown, { content }: { content: unknown }) => content),
    writeTemp: hoisted.writeTemp,
  }
})

vi.mock('../src/node/loadConfig/index.js', () => ({
  getThemeConfig: () => ({}),
}))

const { prepareSidebar } = await import('../src/node/prepare/prepareSidebar.js')

/** 构造页面，`filePathRelative` 同时作为页面数据，模拟 VuePress 的页面结构。 */
function createPage(filePathRelative: string, title: string, pathLocale = '/'): Page {
  return {
    path: `/${filePathRelative.replace(/\.md$/, '/')}`,
    filePathRelative,
    pathLocale,
    title,
    frontmatter: {},
    data: { filePathRelative },
  } as unknown as Page
}

function createApp(pages: Page[]): App {
  return { pages } as unknown as App
}

/** 读取最近一次写入的自动生成侧边栏（`sidebar.__auto__`）。 */
function readAutoSidebar(): Record<string, ThemeSidebarItem[]> {
  const call = hoisted.writeTemp.mock.calls.at(-1)
  return call?.[2]?.__auto__ as Record<string, ThemeSidebarItem[]>
}

describe('prepareSidebar > auto dir', () => {
  beforeEach(() => {
    hoisted.writeTemp.mockClear()
  })

  it('should keep the full directory name when the auto root is the site root', async () => {
    // 回归：根目录自动侧边栏（`prefix` 为 `/`）曾被多截断一个字符，
    // `blog/a.md` 会生成名为 `log` 的错误分组。
    // Regression: the root auto sidebar (`prefix` is `/`) used to strip one
    // character too many, turning `blog/a.md` into a wrong `log` group.
    const app = createApp([
      createPage('blog/a.md', 'A'),
      createPage('blog/b.md', 'B'),
      createPage('guide/c.md', 'C'),
      createPage('intro.md', 'Intro'),
    ])

    await prepareSidebar(app, {
      locales: { '/': {} },
      sidebar: { '/': 'auto' },
    } as ThemeOptions)

    expect(readAutoSidebar()['/']).toMatchObject([
      { text: 'blog', items: [{ text: 'A', link: '/blog/a/' }, { text: 'B', link: '/blog/b/' }] },
      { text: 'guide', items: [{ text: 'C', link: '/guide/c/' }] },
      // 根目录下的单篇文档直接作为顶层条目。
      { text: 'Intro', link: '/intro/' },
    ])
  })

  it('should keep the full directory name for a doc collection at the site root', async () => {
    const app = createApp([
      createPage('blog/a.md', 'A'),
      createPage('blog/b.md', 'B'),
    ])

    await prepareSidebar(app, {
      locales: { '/': {} },
      collections: [{ type: 'doc', dir: '/', title: 'root', sidebar: 'auto' }],
    } as ThemeOptions)

    expect(readAutoSidebar()['/']).toMatchObject([
      { text: 'blog', items: [{ text: 'A', link: '/blog/a/' }, { text: 'B', link: '/blog/b/' }] },
    ])
  })

  it('should strip the auto root prefix for a nested directory', async () => {
    const app = createApp([
      createPage('blog/a.md', 'A'),
      createPage('guide/c.md', 'C'),
      createPage('guide/d.md', 'D'),
    ])

    await prepareSidebar(app, {
      locales: { '/': {} },
      sidebar: { '/guide': 'auto' },
    } as ThemeOptions)

    // 仅保留根目录之下的一层相对路径，根目录本身不应出现在分组名中。
    expect(readAutoSidebar()['/guide/']).toMatchObject([
      { text: 'C', link: '/guide/c/' },
      { text: 'D', link: '/guide/d/' },
    ])
  })

  it('should strip the locale prefix for a localized auto root', async () => {
    const app = createApp([
      createPage('en/blog/a.md', 'A', '/en/'),
      createPage('zh/blog/b.md', 'B', '/'),
    ])

    await prepareSidebar(app, {
      locales: { '/': {}, '/en/': { sidebar: { '/': 'auto' } } },
    } as ThemeOptions)

    // 语言环境自身的目录前缀（`en`）不属于分组层级。
    expect(readAutoSidebar()['/en/']).toMatchObject([
      { text: 'blog', items: [{ text: 'A', link: '/en/blog/a/' }] },
    ])
  })
})
