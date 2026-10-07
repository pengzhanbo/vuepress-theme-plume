import type { ThemeOptions } from '../src/shared/index.js'
import { describe, expect, it } from 'vitest'
import { compatBlogAndNotesToCollections } from '../src/node/collections/compat.js'

/**
 * Build the legacy `blog` / `notes` options shape. The legacy types are deprecated
 * but `compat` still reads them, so the fixtures are kept loose on purpose.
 *
 * 构造旧的 `blog` / `notes` 配置形态。旧类型已废弃，但 `compat` 仍会读取它们，
 * 因此这里刻意使用宽松的结构。
 */
function createOptions(extra: Record<string, unknown> = {}): ThemeOptions {
  return { locales: { '/': {} }, ...extra } as unknown as ThemeOptions
}

describe('compatBlogAndNotesToCollections', () => {
  it('should convert the legacy `blog` option into a post collection', () => {
    const options = createOptions({
      article: '/article/',
      sidebarScrollbar: true,
      blog: {
        include: ['blog/**/*.md'],
        exclude: ['blog/draft/**'],
        tags: false,
      },
      notes: {
        dir: 'notes',
        link: '/notes/',
        notes: [
          { dir: 'guide', link: 'guide', sidebar: 'auto' },
          { dir: 'faq', link: 'faq' },
        ],
      },
    })

    compatBlogAndNotesToCollections(options)

    const collections = options.collections!
    expect(collections).toHaveLength(3)

    // blog 的字段被展开到集合上，且 `dir` / `linkPrefix` 有默认值。
    expect(collections[0]).toMatchObject({
      type: 'post',
      dir: '/',
      linkPrefix: '/article/',
      include: ['blog/**/*.md'],
      tags: false,
    })
    // 每个 note 的目录都会被追加到 post 集合的 `exclude` 中，避免被博客列表收录。
    expect(collections[0].exclude).toEqual([
      'blog/draft/**',
      'notes/guide',
      'notes/faq',
    ])

    expect(collections[1]).toMatchObject({
      type: 'doc',
      dir: 'notes/guide',
      linkPrefix: '/notes/guide',
      sidebar: 'auto',
      sidebarScrollbar: true,
    })
    expect(collections[2]).toMatchObject({
      type: 'doc',
      dir: 'notes/faq',
      linkPrefix: '/notes/faq',
      sidebarScrollbar: true,
    })
  })

  it('should normalize a string `exclude` and tolerate a missing `notes` list', () => {
    const options = createOptions({
      blog: { exclude: 'blog/draft/**' },
      notes: { dir: 'notes', link: '/notes/' },
    })

    compatBlogAndNotesToCollections(options)

    expect(options.collections).toHaveLength(1)
    // `exclude` 为字符串时也要被归一化为数组，且缺少 `notes` 列表时不追加任何路径。
    expect(options.collections![0].exclude).toEqual(['blog/draft/**'])
  })

  it('should apply the legacy post options to every locale without its own collections', () => {
    const options = createOptions({
      article: '/article/',
      sidebarScrollbar: false,
      blog: { include: ['blog/**/*.md'] },
      locales: {
        '/': {},
        '/en/': {
          sidebarScrollbar: true,
          notes: {
            dir: 'en/notes',
            link: '/en/notes/',
            notes: [{ dir: 'guide', link: 'guide' }],
          },
        },
      },
    })

    compatBlogAndNotesToCollections(options)

    expect(options.locales!['/']!.collections).toHaveLength(1)
    expect(options.locales!['/']!.collections![0]).toMatchObject({
      type: 'post',
      dir: '/',
      linkPrefix: '/article/',
    })

    expect(options.locales!['/en/']!.collections).toHaveLength(2)
    expect(options.locales!['/en/']!.collections![0]).toMatchObject({
      type: 'post',
      dir: '/',
      linkPrefix: '/article/',
    })
    // 语言环境没有配置 `sidebarScrollbar` 时，回退到根级配置。
    expect(options.locales!['/en/']!.collections![1]).toMatchObject({
      type: 'doc',
      dir: 'en/notes/guide',
      linkPrefix: '/en/notes/guide',
      sidebarScrollbar: true,
    })

    // 语言环境下的 legacy `notes` 必须被删除，避免残留并再次触发兼容。
    expect('notes' in options.locales!['/en/']!).toBe(false)
  })

  it('should fall back to the root `sidebarScrollbar` for a locale', () => {
    const options = createOptions({
      sidebarScrollbar: true,
      notes: {
        dir: 'notes',
        link: '/notes/',
        notes: [{ dir: 'guide', link: 'guide' }],
      },
      locales: {
        '/en/': {
          notes: {
            dir: 'en/notes',
            link: '/en/notes/',
            notes: [{ dir: 'guide', link: 'guide' }],
          },
        },
      },
    })

    compatBlogAndNotesToCollections(options)

    // 根级 doc 集合使用根级配置。
    expect(options.collections![0].sidebarScrollbar).toBe(true)
    // 语言环境没有配置 `sidebarScrollbar` 时回退到根级配置。
    expect(options.locales!['/en/']!.collections![0].sidebarScrollbar).toBe(true)
  })

  it('should keep existing collections untouched but still strip the legacy keys', () => {
    const existing = { type: 'doc', dir: 'docs' } as any
    const options = createOptions({
      collections: [existing],
      blog: { include: ['blog/**/*.md'] },
      notes: { dir: 'notes', link: '/notes/', notes: [{ dir: 'guide', link: 'guide' }] },
      locales: {
        '/en/': {
          collections: [{ type: 'doc', dir: 'en/docs' }],
          notes: { dir: 'n', link: '/n/', notes: [] },
        },
      },
    })

    compatBlogAndNotesToCollections(options)

    // 已存在 `collections` 时不做兼容转换。
    expect(options.collections).toEqual([existing])
    expect(options.locales!['/en/']!.collections).toEqual([{ type: 'doc', dir: 'en/docs' }])

    // 无论是否转换，legacy 字段都会被清理。
    expect(options.blog).toBeUndefined()
    expect(options.notes).toBeUndefined()
    expect('notes' in options.locales!['/en/']!).toBe(false)
  })

  it('should initialize an empty collections array when there is no legacy config', () => {
    const options = createOptions()

    compatBlogAndNotesToCollections(options)

    expect(options.collections).toEqual([])
  })

  it('should tolerate a missing `locales` option', () => {
    // `locales` 未配置时不能抛错，仍然要完成根级兼容与清理。
    const options = { blog: { include: ['blog/**/*.md'] }, notes: undefined } as unknown as ThemeOptions

    compatBlogAndNotesToCollections(options)

    expect(options.collections).toHaveLength(1)
    expect(options.locales).toBeUndefined()
  })
})
