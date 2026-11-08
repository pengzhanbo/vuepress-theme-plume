import type { App, Page } from 'vuepress'
import type { ThemeOptions } from '../../shared/index.js'
import { describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}))

vi.mock('../utils/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/index.js')>()
  return {
    ...actual,
    logger: hoisted.logger,
  }
})

const { resolveRelatedPosts } = await import('../features/relatedPosts/index.js')
const { prepareRelatedPosts } = await import('../prepare/related-posts.js')

interface PostOptions {
  title?: string
  tags?: string[]
  categories?: string[]
  content?: string
  createTime?: string
  locale?: string
  dir?: string
  frontmatter?: Record<string, unknown>
  data?: Record<string, unknown>
}

function createPost(name: string, options: PostOptions = {}): Page {
  const locale = options.locale ?? '/'
  const dir = options.dir ?? 'blog'
  const prefix = locale === '/' ? '' : locale.slice(1)

  return {
    path: `${locale}${dir}/${name}/`,
    filePathRelative: `${prefix}${dir}/${name}.md`,
    filePath: `/root/${prefix}${dir}/${name}.md`,
    pathLocale: locale,
    title: options.title ?? name,
    lang: locale === '/' ? 'en' : locale.slice(1, -1),
    date: '0000-00-00',
    frontmatter: {
      createTime: options.createTime ?? '2024-01-01 00:00:00',
      ...(options.tags ? { tags: options.tags } : {}),
      ...options.frontmatter,
    },
    data: {
      categoryList: (options.categories ?? []).map(name => ({ id: name, name, sort: 0 })),
      ...options.data,
    },
    content: options.content ?? '',
    contentRendered: '',
  } as unknown as Page
}

interface OptionsOverrides {
  relatedPosts?: unknown
  collections?: unknown[]
  localeCollections?: Record<string, unknown[]>
}

function createOptions(overrides: OptionsOverrides = {}): ThemeOptions {
  const collections = overrides.collections ?? [{ type: 'post', dir: 'blog', title: 'Blog' }]
  const localeCollections = overrides.localeCollections ?? {}

  return {
    relatedPosts: overrides.relatedPosts ?? { minScore: 0, limit: 3, cjk: 'bigram' },
    locales: {
      '/': { collections },
      '/en/': { collections: localeCollections.en ?? collections },
    },
  } as unknown as ThemeOptions
}

function firstPaths(items: Map<string, { path: string }[]>, path: string): string[] {
  return (items.get(path) ?? []).map(item => item.path)
}

describe('resolveRelatedPosts: signals', () => {
  it('ranks a shared tag above a shared body keyword', () => {
    const pages = [
      createPost('a', { tags: ['vue'], content: '性能优化' }),
      createPost('b', { tags: ['vue'], content: '完全无关的文本' }),
      createPost('c', { content: '性能优化' }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions())

    expect(firstPaths(items, '/blog/a/')).toEqual(['/blog/b/', '/blog/c/'])
  })

  it('uses categories as a signal', () => {
    const pages = [
      createPost('a', { categories: ['前端', 'Vue'] }),
      createPost('b', { categories: ['前端'] }),
      createPost('c', { content: '其他内容' }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions())

    expect(firstPaths(items, '/blog/a/')[0]).toBe('/blog/b/')
  })

  it('carries tags and the formatted create time into the item', () => {
    const pages = [
      createPost('a', { tags: ['vue'], createTime: '2024-03-04 05:06:07' }),
      createPost('b', { tags: ['vue'], createTime: '2024-03-04 05:06:07' }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions())

    expect(items.get('/blog/a/')?.[0]).toEqual({
      path: '/blog/b/',
      title: 'b',
      tags: ['vue'],
      createTime: '2024/03/04 05:06:07',
    })
  })
})

describe('resolveRelatedPosts: isolation', () => {
  it('does not recommend pages of another collection', () => {
    const pages = [
      createPost('a', { content: '同样的正文内容' }),
      createPost('b', { dir: 'notes', content: '同样的正文内容' }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions({
      collections: [
        { type: 'post', dir: 'blog', title: 'Blog' },
        { type: 'doc', dir: 'notes', title: 'Notes' },
      ],
    }))

    expect(items.size).toBe(0)
  })

  it('does not recommend pages of another locale', () => {
    const pages = [
      createPost('a', { content: '同样的正文内容' }),
      createPost('a', { locale: '/en/', content: '同样的正文内容' }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions())

    expect(items.size).toBe(0)
  })

  it('assigns a nested page to its most specific collection', () => {
    const pages = [
      createPost('a', { dir: 'blog/sub', content: '子集合内容' }),
      createPost('b', { dir: 'blog/sub', content: '子集合内容' }),
      createPost('c', { content: '子集合内容' }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions({
      collections: [
        { type: 'post', dir: 'blog', title: 'Blog' },
        { type: 'post', dir: 'blog/sub', title: 'Sub' },
      ],
    }))

    expect(firstPaths(items, '/blog/sub/a/')).toEqual(['/blog/sub/b/'])
    expect(items.has('/blog/c/')).toBe(false)
  })

  it('widens the candidate pool with `scope: locale`', () => {
    const pages = [
      createPost('a', { content: '同样的正文内容' }),
      createPost('b', { dir: 'notes', content: '同样的正文内容' }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions({
      relatedPosts: { minScore: 0, limit: 3, cjk: 'bigram', scope: 'locale' },
      collections: [
        { type: 'post', dir: 'blog', title: 'Blog' },
        { type: 'post', dir: 'notes', title: 'Notes' },
      ],
    }))

    expect(firstPaths(items, '/blog/a/')).toEqual(['/notes/b/'])
  })
})

describe('resolveRelatedPosts: filtering', () => {
  it('never recommends a draft page', () => {
    const pages = [
      createPost('a', { content: '同样的正文内容' }),
      createPost('b', { content: '同样的正文内容', frontmatter: { draft: true } }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions())

    expect(items.size).toBe(0)
  })

  it('never recommends an encrypted page', () => {
    const pages = [
      createPost('a', { content: '同样的正文内容' }),
      createPost('b', { content: '同样的正文内容', data: { _e: 'hashed' } }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions())

    expect(items.size).toBe(0)
  })

  it('skips pages marked with `article: false`', () => {
    const pages = [
      createPost('a', { content: '同样的正文内容' }),
      createPost('b', { content: '同样的正文内容', frontmatter: { article: false } }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions())

    expect(items.size).toBe(0)
  })

  it('honours `exclude` and removes the excluded page entirely', () => {
    const pages = [
      createPost('a', { content: '同样的正文内容' }),
      createPost('b', { content: '同样的正文内容' }),
      createPost('c', { content: '同样的正文内容' }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions({
      relatedPosts: { minScore: 0, limit: 3, cjk: 'bigram', exclude: ['/blog/b/'] },
    }))

    expect(items.has('/blog/b/')).toBe(false)
    expect(firstPaths(items, '/blog/a/')).not.toContain('/blog/b/')
  })

  it('produces nothing when every weight is zero', () => {
    const pages = [
      createPost('a', { tags: ['vue'] }),
      createPost('b', { tags: ['vue'] }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions({
      relatedPosts: {
        minScore: 0,
        weights: { tags: 0, category: 0, title: 0, headings: 0, content: 0 },
      },
    }))

    expect(items.size).toBe(0)
  })

  it('produces nothing for a single page collection', () => {
    const { items } = resolveRelatedPosts([createPost('a')], createOptions())

    expect(items.size).toBe(0)
  })
})

describe('resolveRelatedPosts: shape', () => {
  it('respects `limit`', () => {
    const pages = [
      createPost('a', { tags: ['vue'] }),
      createPost('b', { tags: ['vue'] }),
      createPost('c', { tags: ['vue'] }),
      createPost('d', { tags: ['vue'] }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions({
      relatedPosts: { minScore: 0, limit: 2, cjk: 'bigram' },
    }))

    expect(items.get('/blog/a/')).toHaveLength(2)
  })

  it('drops candidates below `minScore`', () => {
    const pages = [
      createPost('a', { tags: ['vue'] }),
      createPost('b', { content: '毫不相干的另一个主题' }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions({
      relatedPosts: { minScore: 0.99, cjk: 'bigram' },
    }))

    expect(items.size).toBe(0)
  })

  it('prefers pages closer in time when `recency` is enabled', () => {
    const pages = [
      createPost('a', { content: '同样的正文内容', createTime: '2024-06-01 00:00:00' }),
      createPost('b', { content: '同样的正文内容', createTime: '2020-01-01 00:00:00' }),
      createPost('c', { content: '同样的正文内容', createTime: '2024-06-01 00:00:00' }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions({
      relatedPosts: { minScore: 0, limit: 2, cjk: 'bigram', recency: 5 },
    }))

    // b 与 c 的相关度相同，时间衰减让与 a 时间更接近的 c 排在前面
    expect(firstPaths(items, '/blog/a/')).toEqual(['/blog/c/', '/blog/b/'])
  })

  it('is deterministic across runs', () => {
    const create = (): Page[] => [
      createPost('a', { tags: ['vue'] }),
      createPost('b', { tags: ['vue'] }),
      createPost('c', { tags: ['vue'] }),
    ]

    const options = createOptions()
    const first = resolveRelatedPosts(create(), options)
    const second = resolveRelatedPosts(create(), options)

    expect([...first.items]).toEqual([...second.items])
  })
})

describe('resolveRelatedPosts: manual override', () => {
  it('uses the manual list instead of the computed result', () => {
    const pages = [
      createPost('a', { tags: ['vue'], frontmatter: { relatedPosts: ['/blog/c/'] } }),
      createPost('b', { tags: ['vue'] }),
      createPost('c', {}),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions())

    expect(firstPaths(items, '/blog/a/')).toEqual(['/blog/c/'])
    // 其他页面仍然可以推荐 a
    expect(firstPaths(items, '/blog/b/')).toContain('/blog/a/')
  })

  it('skips unknown manual links and warns', () => {
    const pages = [
      createPost('a', { frontmatter: { relatedPosts: ['/blog/missing/'] } }),
      createPost('b', {}),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions())

    expect(items.has('/blog/a/')).toBe(false)
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('/blog/missing/'))
  })

  it('removes the page when `relatedPosts` is false', () => {
    const pages = [
      createPost('a', { tags: ['vue'], frontmatter: { relatedPosts: false } }),
      createPost('b', { tags: ['vue'] }),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions())

    expect(items.has('/blog/a/')).toBe(false)
  })

  it('ignores the manual list when the collection has related posts disabled', () => {
    const pages = [
      createPost('a', { frontmatter: { relatedPosts: ['/blog/b/'] } }),
      createPost('b', {}),
    ]

    const { items } = resolveRelatedPosts(pages, createOptions({
      relatedPosts: false,
      collections: [{ type: 'post', dir: 'blog', title: 'Blog', relatedPosts: false }],
    }))

    expect(items.size).toBe(0)
  })
})

describe('prepareRelatedPosts', () => {
  it('writes the result into page data', async () => {
    const pages = [
      createPost('a', { tags: ['vue'] }),
      createPost('b', { tags: ['vue'] }),
    ]
    const app = { pages, env: { isBuild: true } } as unknown as App

    await prepareRelatedPosts(app, createOptions())

    expect(pages[0].data.relatedPosts).toHaveLength(1)
    expect(pages[1].data.relatedPosts).toHaveLength(1)
  })

  it('clears stale data when the feature is disabled', async () => {
    const page = createPost('a', { tags: ['vue'] })
    page.data.relatedPosts = [{ path: '/blog/x/', title: 'x' }]

    const app = { pages: [page], env: { isBuild: true } } as unknown as App

    await prepareRelatedPosts(app, createOptions({
      relatedPosts: false,
      collections: [{ type: 'post', dir: 'blog', title: 'Blog', relatedPosts: false }],
    }))

    expect(page.data.relatedPosts).toBeUndefined()
  })
})

describe('resolveRelatedPosts: diversity', () => {
  const create = (): Page[] => [
    createPost('a', { tags: ['vue'], content: 'alpha beta gamma' }),
    createPost('b', { tags: ['vue'], content: 'alpha beta gamma' }),
    createPost('c', { tags: ['vue'], content: 'alpha beta gamma' }),
    createPost('d', { tags: ['vue'], content: 'alpha beta gamma' }),
    createPost('e', { tags: ['vue'], content: 'delta epsilon zeta' }),
  ]

  it('keeps the pure relevance order when `diversity` is 0', () => {
    const { items } = resolveRelatedPosts(create(), createOptions({
      relatedPosts: { minScore: 0, limit: 2, cjk: 'bigram', diversity: 0 },
    }))

    // b、c、d 与 a 的相关度相同，按路径排序取前两个
    expect(firstPaths(items, '/blog/a/')).toEqual(['/blog/b/', '/blog/c/'])
  })

  it('replaces a near duplicate with a more diverse candidate', () => {
    const { items } = resolveRelatedPosts(create(), createOptions({
      relatedPosts: { minScore: 0, limit: 2, cjk: 'bigram', diversity: 0.8 },
    }))

    const paths = firstPaths(items, '/blog/a/')

    expect(paths).toHaveLength(2)
    expect(paths[0]).toBe('/blog/b/')
    // c 与 b 几乎完全相同，被相关性更低但更分散的 e 取代
    expect(paths).toContain('/blog/e/')
  })
})

describe('prepareRelatedPosts: cache and cleanup', () => {
  it('recomputes when the body changes although its length stays the same', async () => {
    const a = createPost('a', { content: 'alpha beta gamma' })
    const b = createPost('b', { content: 'alpha beta gamma' })
    const app = { pages: [a, b], env: { isBuild: true } } as unknown as App
    const options = createOptions()

    await prepareRelatedPosts(app, options)
    expect(a.data.relatedPosts).toHaveLength(1)

    // 内容长度相同、内容不同的新页面对象
    const next = createPost('a', { content: 'delta epsilon zeta' })
    app.pages[0] = next

    await prepareRelatedPosts(app, options)

    expect(next.data.relatedPosts).toBeUndefined()
    expect(b.data.relatedPosts).toBeUndefined()
  })

  it('reuses the cached result when nothing changed', async () => {
    const a = createPost('a', { tags: ['vue'] })
    const b = createPost('b', { tags: ['vue'] })
    const app = { pages: [a, b], env: { isBuild: true } } as unknown as App
    const options = createOptions()

    await prepareRelatedPosts(app, options)
    const first = a.data.relatedPosts

    await prepareRelatedPosts(app, options)

    expect(a.data.relatedPosts).toEqual(first)
    expect(b.data.relatedPosts).toHaveLength(1)
  })

  it('clears the result when the page is excluded afterwards', async () => {
    const a = createPost('a', { tags: ['vue'] })
    const b = createPost('b', { tags: ['vue'] })
    const app = { pages: [a, b], env: { isBuild: true } } as unknown as App

    await prepareRelatedPosts(app, createOptions())
    expect(a.data.relatedPosts).toHaveLength(1)

    await prepareRelatedPosts(app, createOptions({
      relatedPosts: { minScore: 0, limit: 3, cjk: 'bigram', exclude: ['/blog/a/'] },
    }))

    expect(a.data.relatedPosts).toBeUndefined()
  })
})

describe('resolveRelatedPosts: `relatedPosts: true`', () => {
  const pages = (): Page[] => [
    createPost('a', { tags: ['vue'] }),
    createPost('b', { tags: ['vue'] }),
  ]

  it('treats `true` as the default configuration', () => {
    const { items } = resolveRelatedPosts(pages(), createOptions({ relatedPosts: true }))

    expect(firstPaths(items, '/blog/a/')).toEqual(['/blog/b/'])
  })

  it('lets a collection enable it with `true` while the theme disables it', () => {
    const { items } = resolveRelatedPosts(pages(), createOptions({
      relatedPosts: false,
      collections: [{ type: 'post', dir: 'blog', title: 'Blog', relatedPosts: true }],
    }))

    expect(firstPaths(items, '/blog/a/')).toEqual(['/blog/b/'])
  })

  it('writes the result into page data', async () => {
    const list = pages()
    const app = { pages: list, env: { isBuild: true } } as unknown as App

    await prepareRelatedPosts(app, createOptions({ relatedPosts: true }))

    expect(list[0].data.relatedPosts).toHaveLength(1)
  })
})
