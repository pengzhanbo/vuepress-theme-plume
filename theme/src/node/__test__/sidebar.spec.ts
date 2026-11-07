import type { App, Page } from 'vuepress'
import type { ThemeOptions, ThemeSidebarItem } from '../../shared/index.js'
import { describe, expect, it } from 'vitest'
import { getAllSidebar, getSidebarData } from '../features/sidebar.js'

/** 构造页面，`filePathRelative` 同时作为页面数据，模拟 VuePress 的页面结构。 */
function createPage(filePathRelative: string, title: string, path: string, pathLocale = '/'): Page {
  return {
    path,
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

/** 读取某个自动侧边栏根下的条目。 */
function autoSidebar(options: ThemeOptions, pages: Page[], prefix = '/guide/'): ThemeSidebarItem[] {
  const locales = getAllSidebar(options)
  const { auto } = getSidebarData(createApp(pages), locales, options)
  return auto[prefix] as ThemeSidebarItem[]
}

describe('sidebar > auto dir ordering', () => {
  it('orders files by their numeric prefix and puts unnumbered files last', async () => {
    const pages = [
      createPage('guide/10.more.md', 'More', '/guide/more/'),
      createPage('guide/2.setup.md', 'Setup', '/guide/setup/'),
      createPage('guide/appendix.md', 'Appendix', '/guide/appendix/'),
      createPage('guide/1.intro.md', 'Intro', '/guide/intro/'),
    ]

    expect(autoSidebar({ locales: { '/': { sidebar: { '/guide': 'auto' } } } }, pages))
      .toMatchObject([
        { text: 'Intro', link: '/guide/intro/' },
        { text: 'Setup', link: '/guide/setup/' },
        { text: 'More', link: '/guide/more/' },
        { text: 'Appendix', link: '/guide/appendix/' },
      ])
  })

  it('uses the page title for the sidebar text', async () => {
    const pages = [
      createPage('guide/1.setup.md', '安装', '/guide/setup/'),
      createPage('guide/2.advanced.md', 'Advanced', '/guide/advanced/'),
    ]

    expect(autoSidebar({ locales: { '/': { sidebar: { '/guide': 'auto' } } } }, pages))
      .toMatchObject([
        { text: '安装', link: '/guide/setup/' },
        { text: 'Advanced', link: '/guide/advanced/' },
      ])
  })
})

describe('sidebar > directory structure', () => {
  it('nests files under their directories and records the directory index as home link', () => {
    const pages = [
      createPage('guide/index.md', 'Guide', '/guide/'),
      createPage('guide/basic/a.md', 'A', '/guide/basic/a/'),
      createPage('guide/basic/b.md', 'B', '/guide/basic/b/'),
    ]
    const options: ThemeOptions = { locales: { '/': { sidebar: { '/guide': 'auto' } } } }
    const locales = getAllSidebar(options)

    const { auto, home } = getSidebarData(createApp(pages), locales, options)

    // 目录首页不作为一个条目出现，而是作为该目录的首页链接。
    expect(auto['/guide/']).toMatchObject([
      {
        text: 'basic',
        items: [
          { text: 'A', link: '/guide/basic/a/' },
          { text: 'B', link: '/guide/basic/b/' },
        ],
      },
    ])
    expect(home['/guide/']).toBe('/guide/')
  })

  it('applies `sidebarCollapsed` from the doc collection to directory groups', () => {
    const pages = [
      createPage('guide/basic/a.md', 'A', '/guide/basic/a/'),
    ]
    const options: ThemeOptions = {
      locales: {
        '/': {
          collections: [{
            type: 'doc',
            dir: 'guide',
            title: 'Guide',
            sidebar: 'auto',
            sidebarCollapsed: true,
          }],
        },
      },
    }

    expect(autoSidebar(options, pages)).toMatchObject([
      { text: 'basic', collapsed: true, items: [{ text: 'A', link: '/guide/basic/a/' }] },
    ])
  })

  it('removes empty child groups and their collapse state', () => {
    const pages = [
      createPage('guide/a.md', 'A', '/guide/a/'),
    ]

    const sidebar = autoSidebar({ locales: { '/': { sidebar: { '/guide': 'auto' } } } }, pages)

    expect(sidebar).toEqual([{ text: 'A', link: '/guide/a/' }])
    expect(sidebar[0]).not.toHaveProperty('items')
    expect(sidebar[0]).not.toHaveProperty('collapsed')
  })

  it('keeps the icon declared in the frontmatter', () => {
    const page = createPage('guide/a.md', 'A', '/guide/a/')
    page.frontmatter = { icon: 'mdi:file' }

    expect(autoSidebar({ locales: { '/': { sidebar: { '/guide': 'auto' } } } }, [page])).toMatchObject([
      { text: 'A', link: '/guide/a/', icon: 'mdi:file' },
    ])
  })
})

describe('getAllSidebar', () => {
  it('normalizes sidebar keys and prefixes for the root locale', () => {
    const collectionSidebar: ThemeSidebarItem[] = [{ text: 'A', link: '/manual/a/' }]
    const options: ThemeOptions = {
      sidebar: { blog: 'auto' },
      collections: [{
        type: 'doc',
        dir: 'guide',
        title: 'Guide',
        linkPrefix: '/manual/',
        sidebar: collectionSidebar,
      }],
      locales: { '/': {} },
    }

    const locales = getAllSidebar(options)

    expect(Object.keys(locales['/']).sort()).toEqual(['/blog', '/manual/'])
    expect(locales['/']['/blog']).toEqual({ items: 'auto', prefix: '/blog/' })
    // 集合侧边栏以 `linkPrefix` 作为路由键，但前缀仍指向集合所在的目录。
    expect(locales['/']['/manual/']).toEqual({ items: collectionSidebar, prefix: '/guide/' })
  })

  it('uses each locale own sidebar and collections instead of the root ones', () => {
    const options: ThemeOptions = {
      sidebar: { blog: 'auto' },
      locales: {
        '/': {},
        '/en/': {
          sidebar: { notes: { items: ['a'], prefix: 'custom' } },
          collections: [{ type: 'doc', dir: 'guide-en', title: 'Guide', sidebar: 'auto' }],
        },
      },
    }

    const locales = getAllSidebar(options)

    expect(Object.keys(locales['/en/']).sort()).toEqual(['/guide-en/', '/notes'])
    // 不带前导斜杠的 prefix 会按语言环境补全。
    expect(locales['/en/']['/notes']).toEqual({ items: ['a'], prefix: '/en/notes/' })
    expect(locales['/en/']['/guide-en/']).toEqual({ items: 'auto', prefix: '/en/guide-en/' })
  })
})
