import type { App, Page } from 'vuepress/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  writeTemp: vi.fn(),
  getThemeConfig: vi.fn(() => ({}) as any),
  /** 记录并发的文件系统调用（`stat`）峰值。 */
  stat: { inFlight: 0, peak: 0 },
}))

vi.mock('@pengzhanbo/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@pengzhanbo/utils')>()
  return {
    ...actual,
    // `processPostData` 通过 `attemptAsync` 调用 `fs.promises.stat`，
    // 在这里统计并发峰值，用于断言无界并发已被限制。
    attemptAsync: async (fn: () => Promise<unknown>) => {
      hoisted.stat.inFlight++
      hoisted.stat.peak = Math.max(hoisted.stat.peak, hoisted.stat.inFlight)
      try {
        return await actual.attemptAsync(fn)
      }
      finally {
        hoisted.stat.inFlight--
      }
    },
  }
})

vi.mock('../src/node/utils/index.js', () => ({
  createFsCache: vi.fn(),
  genEncrypt: vi.fn(),
  hash: vi.fn(),
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  perf: { mark: vi.fn(), log: vi.fn() },
  resolveContent: vi.fn((_app: unknown, { content }: { content: unknown }) => content),
  writeTemp: hoisted.writeTemp,
  createMatcher: () => () => true,
  withBase: (path: string, base = '/') => `${base}${path}/`,
}))

vi.mock('../src/node/loadConfig/index.js', () => ({
  getThemeConfig: hoisted.getThemeConfig,
}))

const { preparedPostsData } = await import('../src/node/prepare/preparePostsData.js')

function createApp(pages: Page[]): App {
  return {
    pages,
    env: { isBuild: true },
    dir: { source: (file: string) => `/root/${file}` },
  } as unknown as App
}

interface PostOptions {
  /** 是否省略所有日期，以触发 `stat` 兜底分支。 */
  withoutDate?: boolean
}

function createPost(index: number, { withoutDate = false }: PostOptions = {}): Page {
  return {
    path: `/blog/post-${index}/`,
    filePathRelative: `blog/post-${index}.md`,
    filePath: `/root/blog/post-${index}.md`,
    title: `post-${index}`,
    // `0000-00-00` 是 VuePress 的默认值：无 createTime/date 时主题会用文件创建时间兜底。
    date: '0000-00-00',
    lang: 'en',
    frontmatter: withoutDate
      ? { excerpt: false }
      : { createTime: new Date(Date.UTC(2024, 0, 1) + index * 1000), excerpt: false },
    data: { categoryList: [], readingTime: 1 },
    contentRendered: '',
  } as unknown as Page
}

/** 读取写入的 `postsData` 内容。 */
function readPostsData(): Record<string, Array<{ title: string }>> {
  const call = hoisted.writeTemp.mock.calls.find(([, file]) => file === 'internal/postsData.js')
  return call?.[2] as Record<string, Array<{ title: string }>>
}

describe('preparedPostsData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hoisted.stat.inFlight = 0
    hoisted.stat.peak = 0
    hoisted.getThemeConfig.mockReturnValue({
      locales: { '/': { collections: [{ type: 'post', dir: 'blog', include: [], exclude: [] }] } },
    })
  })

  it('should include every post of the collection in the generated data', async () => {
    const app = createApp([createPost(0), createPost(1), createPost(2)])

    await preparedPostsData(app)

    // 文章按创建时间倒序排列，并发处理不能打乱顺序。
    expect(readPostsData()['/blog/'].map(post => post.title)).toEqual([
      'post-2',
      'post-1',
      'post-0',
    ])
  })

  it('should bound the number of concurrent file stats', async () => {
    const app = createApp(Array.from({ length: 200 }, (_, index) => createPost(index, { withoutDate: true })))

    await preparedPostsData(app)

    // 200 篇文章都必须被处理，一个都不能因为并发限制而丢失。
    expect(readPostsData()['/blog/']).toHaveLength(200)
    // 无界并发会一次性发起全部 200 个 `stat`（EMFILE 风险），当前上限为 64。
    expect(hoisted.stat.peak).toBeLessThanOrEqual(64)
    // 确保统计本身有效：并发处理确实重叠过。
    expect(hoisted.stat.peak).toBeGreaterThan(1)
  })

  it('should not include posts outside the collection directory', async () => {
    const outside = {
      ...createPost(9),
      path: '/other/post-9/',
      filePathRelative: 'other/post-9.md',
      filePath: '/root/other/post-9.md',
    } as unknown as Page

    const app = createApp([createPost(0), outside])

    await preparedPostsData(app)

    expect(readPostsData()['/blog/'].map(post => post.title)).toEqual(['post-0'])
  })
})
