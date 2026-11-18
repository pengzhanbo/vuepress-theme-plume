import type { App, Page } from 'vuepress'
import type { ThemeOptions, ThemePageData } from '../../shared/index.js'
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
  content?: string
  createTime?: string
  dir?: string
  frontmatter?: Record<string, unknown>
}

function createPost(name: string, options: PostOptions = {}): Page<ThemePageData> {
  const dir = options.dir ?? 'blog'

  return {
    path: `/${dir}/${name}/`,
    filePathRelative: `${dir}/${name}.md`,
    filePath: `/root/${dir}/${name}.md`,
    pathLocale: '/',
    title: options.title ?? name,
    lang: 'en',
    date: '0000-00-00',
    frontmatter: {
      createTime: options.createTime ?? '2024-01-01 00:00:00',
      ...(options.tags ? { tags: options.tags } : {}),
      ...options.frontmatter,
    },
    data: { categoryList: [] },
    content: options.content ?? '',
    contentRendered: '',
  } as unknown as Page<ThemePageData>
}

interface OptionsOverrides {
  relatedPosts?: unknown
  series?: unknown
  collections?: unknown[]
}

function createOptions(overrides: OptionsOverrides = {}): ThemeOptions {
  return {
    series: overrides.series ?? {},
    relatedPosts: overrides.relatedPosts ?? { minScore: 0, limit: 3, cjk: 'bigram' },
    locales: {
      '/': {
        collections: overrides.collections ?? [{ type: 'post', dir: 'blog', title: 'Blog' }],
      },
    },
  } as unknown as ThemeOptions
}

function firstPaths(items: Map<string, { path: string }[]>, path: string): string[] {
  return (items.get(path) ?? []).map(item => item.path)
}

/**
 * A three page series (`a` → `b` → `d`) plus one page outside of it (`c`).
 *
 * `a` and `b` are nearly identical, `d` is a weaker match and `c` is the strongest
 * candidate after the next chapter `b` is excluded.
 */
function createSeriesPages(): Page<ThemePageData>[] {
  return [
    createPost('a', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 1 } }),
    createPost('b', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 2 } }),
    createPost('d', { tags: ['vue'], content: 'gamma', frontmatter: { series: 'vue3', seriesOrder: 3 } }),
    createPost('c', { tags: ['vue'], content: 'alpha beta' }),
  ]
}

describe('resolveRelatedPosts: series signals', () => {
  it('skips the next chapter by default', () => {
    const { items } = resolveRelatedPosts(createSeriesPages(), createOptions())

    expect(firstPaths(items, '/blog/a/')).toEqual(['/blog/c/', '/blog/d/'])
  })

  it('keeps the previous chapter', () => {
    const { items } = resolveRelatedPosts(createSeriesPages(), createOptions())

    expect(firstPaths(items, '/blog/b/')).toContain('/blog/a/')
  })

  it('keeps the next chapter when the page hides the series links', () => {
    const pages = createSeriesPages()
    // 「下一篇」区块渲染在当前页上，因此是否排除取决于当前页的 `seriesNav`
    pages[0].frontmatter.seriesNav = false

    const { items } = resolveRelatedPosts(pages, createOptions())

    expect(firstPaths(items, '/blog/a/')).toEqual(['/blog/b/', '/blog/c/', '/blog/d/'])
  })

  it('keeps the next chapter when the series disables `nav`', () => {
    const { items } = resolveRelatedPosts(createSeriesPages(), createOptions({
      series: { nav: false },
    }))

    expect(firstPaths(items, '/blog/a/')).toContain('/blog/b/')
  })

  it('boosts the remaining chapters with `seriesBoost`', () => {
    const { items } = resolveRelatedPosts(createSeriesPages(), createOptions({
      relatedPosts: { minScore: 0, limit: 3, cjk: 'bigram', seriesBoost: 1.2 },
    }))

    // d 的原始相关度低于 c，加权后排到前面
    expect(firstPaths(items, '/blog/a/')).toEqual(['/blog/d/', '/blog/c/'])
  })

  it('removes every same series page with `seriesBoost: 0`', () => {
    const { items } = resolveRelatedPosts(createSeriesPages(), createOptions({
      relatedPosts: { minScore: 0, limit: 3, cjk: 'bigram', seriesBoost: 0 },
    }))

    expect(firstPaths(items, '/blog/a/')).toEqual(['/blog/c/'])
  })

  it('keeps the next chapter with `seriesNextBoost: 1`', () => {
    const { items } = resolveRelatedPosts(createSeriesPages(), createOptions({
      relatedPosts: { minScore: 0, limit: 3, cjk: 'bigram', seriesNextBoost: 1 },
    }))

    expect(firstPaths(items, '/blog/a/')).toEqual(['/blog/b/', '/blog/c/', '/blog/d/'])
  })

  it('applies `minScore` to the adjusted score', () => {
    const pages = createSeriesPages()

    const dropped = resolveRelatedPosts(pages, createOptions({
      relatedPosts: { minScore: 0.8, limit: 3, cjk: 'bigram' },
    }))
    const kept = resolveRelatedPosts(createSeriesPages(), createOptions({
      relatedPosts: { minScore: 0.8, limit: 3, cjk: 'bigram', seriesBoost: 1.2 },
    }))

    expect(firstPaths(dropped.items, '/blog/a/')).toEqual(['/blog/c/'])
    expect(firstPaths(kept.items, '/blog/a/')).toEqual(['/blog/d/', '/blog/c/'])
  })

  it('ignores series members of another collection', () => {
    const pages = [
      createPost('a', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 1 } }),
      createPost('b', { dir: 'notes', tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 2 } }),
    ]
    const collections = [
      { type: 'post', dir: 'blog', title: 'Blog' },
      { type: 'doc', dir: 'notes', title: 'Notes' },
    ]

    const withSeries = resolveRelatedPosts(pages, createOptions({ collections }))
    const withoutSeries = resolveRelatedPosts(pages, createOptions({ collections, series: false }))

    expect(withSeries.items.size).toBe(0)
    expect([...withSeries.items]).toEqual([...withoutSeries.items])
  })

  it('changes nothing when no page declares a series', () => {
    const pages = [
      createPost('a', { tags: ['vue'], content: 'alpha' }),
      createPost('b', { tags: ['vue'], content: 'alpha beta' }),
      createPost('c', { tags: ['vue'], content: 'gamma' }),
    ]

    const withSeries = resolveRelatedPosts(pages, createOptions())
    const withoutSeries = resolveRelatedPosts(pages, createOptions({ series: false }))

    expect([...withSeries.items]).toEqual([...withoutSeries.items])
  })

  it('stays silent when the series feature is disabled', () => {
    hoisted.logger.warn.mockClear()

    resolveRelatedPosts(createSeriesPages(), createOptions({ series: false }))

    expect(hoisted.logger.warn).not.toHaveBeenCalledWith(expect.stringContaining('[series]'))
  })

  it('marks the adjusted scores in debug output', () => {
    const { debug } = resolveRelatedPosts(createSeriesPages(), createOptions({
      series: { nav: false },
      relatedPosts: { minScore: 0, limit: 3, cjk: 'bigram', seriesBoost: 1.2, debug: true },
    }))

    const output = debug.join('\n')

    expect(output).toContain('/blog/a/')
    expect(output).toContain('×1.2')

    const excluded = resolveRelatedPosts(createSeriesPages(), createOptions({
      relatedPosts: { minScore: 0, limit: 3, cjk: 'bigram', debug: true },
    }))

    expect(excluded.debug.join('\n')).toContain('· removed ×0  /blog/b/')
  })

  it('reports the removal records when every candidate is dropped', () => {
    const pages = [
      createPost('a', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 1 } }),
      createPost('b', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 2 } }),
    ]

    const { items, debug } = resolveRelatedPosts(pages, createOptions({
      relatedPosts: { minScore: 0, limit: 3, cjk: 'bigram', debug: true },
    }))

    // a 的唯一候选就是被排除的下一篇
    expect(items.has('/blog/a/')).toBe(false)
    expect(debug.join('\n')).toContain('· removed ×0  /blog/b/')
  })

  it('summarizes a long list of removed candidates', () => {
    const pages = [
      createPost('a', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 1 } }),
      createPost('b', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 2 } }),
      createPost('c', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 3 } }),
      createPost('d', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 4 } }),
      createPost('e', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 5 } }),
      createPost('f', { tags: ['vue'], content: 'alpha' }),
    ]

    const { items, debug } = resolveRelatedPosts(pages, createOptions({
      relatedPosts: { minScore: 0, limit: 3, cjk: 'bigram', seriesBoost: 0, debug: true },
    }))

    // 同系列全部被剔除，只剩系列外的 f
    expect(firstPaths(items, '/blog/a/')).toEqual(['/blog/f/'])

    const block = debug.find(item => item.startsWith('/blog/a/'))!

    // 只保留 3 条样例路径，其余以数量概述
    expect(block).toContain('· removed ×0  /blog/b/ /blog/c/ /blog/d/ (+1 more)')
    expect(block).not.toContain('/blog/e/')
  })
})

describe('prepareRelatedPosts: series cache', () => {
  it('recomputes when the series of a page changes', async () => {
    const a = createPost('a', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 1 } })
    const b = createPost('b', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 2 } })
    const c = createPost('c', { tags: ['vue'], content: 'alpha beta' })
    const app = { pages: [a, b, c], env: { isBuild: true } } as unknown as App
    const options = createOptions()

    await prepareRelatedPosts(app, options)
    expect(a.data.relatedPosts?.map(item => item.path)).toEqual(['/blog/c/'])

    // 内容不变，仅系列归属改变：签名必须让缓存失效
    const next = createPost('a', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'other' } })
    app.pages[0] = next

    await prepareRelatedPosts(app, options)

    expect(next.data.relatedPosts?.map(item => item.path)).toEqual(['/blog/b/', '/blog/c/'])
  })

  it('recomputes when another group adds a chapter to the series', async () => {
    const a = createPost('a', {
      tags: ['vue'],
      content: 'alpha',
      createTime: '2024-01-01 00:00:00',
      frontmatter: { series: 'vue3' },
    })
    const b = createPost('b', {
      tags: ['vue'],
      content: 'alpha',
      createTime: '2024-03-01 00:00:00',
      frontmatter: { series: 'vue3' },
    })
    const c = createPost('c', { tags: ['vue'], content: 'alpha beta' })
    const app = {
      pages: [a, b, c],
      env: { isBuild: true },
    } as unknown as App
    const options = createOptions({
      collections: [
        { type: 'post', dir: 'blog', title: 'Blog' },
        { type: 'post', dir: 'notes', title: 'Notes' },
      ],
    })

    await prepareRelatedPosts(app, options)
    expect(a.data.relatedPosts?.map(item => item.path)).toEqual(['/blog/c/'])

    // 新章节落在另一个集合（不参与本分组的候选），但插在了 a 与 b 之间
    app.pages.push(createPost('mid', {
      dir: 'notes',
      tags: ['vue'],
      content: 'alpha',
      createTime: '2024-02-01 00:00:00',
      frontmatter: { series: 'vue3' },
    }))

    await prepareRelatedPosts(app, options)

    expect(a.data.relatedPosts?.map(item => item.path)).toContain('/blog/b/')
  })

  it('recomputes when the series nav state changes, and reuses the cache otherwise', async () => {
    const a = createPost('a', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 1 } })
    const b = createPost('b', { tags: ['vue'], content: 'alpha', frontmatter: { series: 'vue3', seriesOrder: 2 } })
    const c = createPost('c', { tags: ['vue'], content: 'alpha beta' })
    const app = { pages: [a, b, c], env: { isBuild: true } } as unknown as App
    const options = createOptions()

    await prepareRelatedPosts(app, options)
    expect(a.data.relatedPosts?.map(item => item.path)).toEqual(['/blog/c/'])
    const first = a.data.relatedPosts

    // 配置未变化：命中缓存，结果数组与上一次是同一个引用
    await prepareRelatedPosts(app, options)
    expect(a.data.relatedPosts).toBe(first)

    // 系列关闭 nav：文末不再显示「下一篇」，它重新成为合法的相关文章
    await prepareRelatedPosts(app, createOptions({ series: { nav: false } }))

    expect(a.data.relatedPosts?.map(item => item.path)).toEqual(['/blog/b/', '/blog/c/'])
  })
})
