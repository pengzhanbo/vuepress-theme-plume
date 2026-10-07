import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Capture the options passed to the search plugin, and the theme config returned
 * by the `getThemeConfig()` singleton, since `setupPlugins` reads both.
 *
 * 捕获传递给搜索插件的选项，以及 `getThemeConfig()` 单例返回的主题配置，
 * 因为 `setupPlugins` 会读取它们。
 */
const hoisted = vi.hoisted(() => {
  const record = <T = any>() => {
    const calls: T[] = []
    return {
      calls,
      fn: (options: T) => {
        calls.push(options)
        return {}
      },
    }
  }
  return {
    searchOptions: undefined as any,
    themeConfig: {} as any,
    plugins: {
      search: undefined as any,
      docsearch: record(),
      seo: record(),
      sitemap: record(),
      nprogress: record(),
      photoSwipe: record(),
      readingTime: record(),
      watermark: record(),
      comment: record(),
      cache: record(),
      replaceAssets: record(),
      llms: undefined as any,
    },
  }
})

// Only the search plugin options matter here, so every other builtin plugin is
// replaced by a stub to keep the test focused on the security filter.
// 这里只关心搜索插件的选项，因此其余内置插件都用桩替代，使测试聚焦于安全过滤逻辑。
vi.mock('@vuepress-plume/plugin-search', () => ({
  searchPlugin: (options: any) => {
    hoisted.searchOptions = options
    return { name: '@vuepress-plume/plugin-search' }
  },
}))
vi.mock('@vuepress-plume/plugin-fonts', () => ({ fontsPlugin: () => ({}) }))
vi.mock('@vuepress/plugin-cache', () => ({ cachePlugin: hoisted.plugins.cache.fn }))
vi.mock('@vuepress/plugin-comment', () => ({ commentPlugin: hoisted.plugins.comment.fn }))
vi.mock('@vuepress/plugin-docsearch', () => ({ docsearchPlugin: hoisted.plugins.docsearch.fn }))
vi.mock('@vuepress/plugin-nprogress', () => ({ nprogressPlugin: hoisted.plugins.nprogress.fn }))
vi.mock('@vuepress/plugin-photo-swipe', () => ({ photoSwipePlugin: hoisted.plugins.photoSwipe.fn }))
vi.mock('@vuepress/plugin-reading-time', () => ({ readingTimePlugin: hoisted.plugins.readingTime.fn }))
vi.mock('@vuepress/plugin-replace-assets', () => ({ replaceAssetsPlugin: hoisted.plugins.replaceAssets.fn }))
vi.mock('@vuepress/plugin-seo', () => ({ seoPlugin: hoisted.plugins.seo.fn }))
vi.mock('@vuepress/plugin-sitemap', () => ({ sitemapPlugin: hoisted.plugins.sitemap.fn }))
vi.mock('@vuepress/plugin-watermark', () => ({ watermarkPlugin: hoisted.plugins.watermark.fn }))
vi.mock('../src/node/loadConfig/index.js', () => ({
  getThemeConfig: () => hoisted.themeConfig,
}))
vi.mock('../src/node/plugins/code.js', () => ({ codePlugins: () => [] }))
vi.mock('../src/node/plugins/git.js', () => ({ gitPlugin: () => [] }))
vi.mock('../src/node/plugins/llms.js', () => ({ llmsPlugin: () => [] }))
vi.mock('../src/node/plugins/markdown.js', () => ({ markdownPlugins: () => [] }))

const { setupPlugins } = await import('../src/node/plugins/setupPlugins.js')

function createApp(isBuild = true) {
  return { env: { isBuild } } as any
}

function createPage(path: string, filePathRelative: string, data: Record<string, unknown> = {}) {
  return { path, data: { filePathRelative, ...data }, frontmatter: {} } as any
}

/** Run `setupPlugins` with the given theme config and return the search filter. */
function resolveIsSearchable(config: any): (page: any) => boolean {
  hoisted.themeConfig = config
  setupPlugins(createApp(), {})
  return hoisted.searchOptions.isSearchable
}

beforeEach(() => {
  hoisted.themeConfig = {}
  hoisted.searchOptions = undefined
  Object.values(hoisted.plugins).forEach((plugin: any) => {
    if (plugin && Array.isArray(plugin.calls))
      plugin.calls.length = 0
  })
  vi.clearAllMocks()
})

describe('setupPlugins: local search page filter', () => {
  it('excludes pages matched by `encrypt.rules`', () => {
    const isSearchable = resolveIsSearchable({ encrypt: { rules: { '/blog/': 'password' } } })

    expect(isSearchable(createPage('/blog/a/', 'blog/a.md'))).toBe(false)
    expect(isSearchable(createPage('/docs/b/', 'docs/b.md'))).toBe(true)
  })

  it('excludes pages with their own frontmatter password', () => {
    // No `encrypt` option at all: the page is still encrypted by `frontmatter.password`.
    // 完全没有 `encrypt` 选项：页面依然因 `frontmatter.password` 而处于加密状态。
    const isSearchable = resolveIsSearchable({})

    expect(isSearchable(createPage('/blog/a/', 'blog/a.md', { _e: 'hash' }))).toBe(false)
    expect(isSearchable(createPage('/blog/a/', 'blog/a.md'))).toBe(true)
  })

  it('keeps honoring the user-provided `isSearchable`', () => {
    const isSearchable = resolveIsSearchable({
      search: {
        provider: 'local',
        isSearchable: (page: any) => !page.path.startsWith('/docs/'),
      },
    })

    expect(isSearchable(createPage('/docs/b/', 'docs/b.md'))).toBe(false)
    expect(isSearchable(createPage('/other/c/', 'other/c.md'))).toBe(true)
  })

  it('does not make searchable pages unsearchable by default', () => {
    const isSearchable = resolveIsSearchable({})

    expect(isSearchable(createPage('/docs/b/', 'docs/b.md'))).toBe(true)
  })
})

describe('setupPlugins: optional plugins', () => {
  it('enables the default plugins', () => {
    setupPlugins(createApp(), {})

    expect(hoisted.plugins.nprogress.calls).toHaveLength(1)
    expect(hoisted.plugins.photoSwipe.calls).toHaveLength(1)
    expect(hoisted.plugins.readingTime.calls).toHaveLength(1)
    expect(hoisted.plugins.cache.calls).toHaveLength(1)
    // 默认使用文件系统缓存。
    expect(hoisted.plugins.cache.calls[0]).toMatchObject({ type: 'filesystem' })
  })

  it('lets the plugin options disable the default plugins', () => {
    setupPlugins(createApp(), {
      nprogress: false,
      photoSwipe: false,
      readingTime: false,
    })

    expect(hoisted.plugins.nprogress.calls).toHaveLength(0)
    expect(hoisted.plugins.photoSwipe.calls).toHaveLength(0)
    expect(hoisted.plugins.readingTime.calls).toHaveLength(0)
  })

  it('lets the theme options override the plugin options', () => {
    hoisted.themeConfig = { readingTime: false, cache: 'memory' }

    setupPlugins(createApp(), {})

    expect(hoisted.plugins.readingTime.calls).toHaveLength(0)
    expect(hoisted.plugins.cache.calls[0]).toMatchObject({ type: 'memory' })
  })

  it('disables the cache plugin when the theme option is false', () => {
    hoisted.themeConfig = { cache: false }

    setupPlugins(createApp(), {})

    expect(hoisted.plugins.cache.calls).toHaveLength(0)
  })

  it('enables watermark, comment, replaceAssets and llmstxt when configured', () => {
    hoisted.themeConfig = {
      watermark: true,
      comment: { provider: 'giscus' },
      replaceAssets: { foo: 'bar' },
      llmstxt: { locale: 'en' },
    }

    setupPlugins(createApp(), {})

    expect(hoisted.plugins.watermark.calls).toHaveLength(1)
    expect(hoisted.plugins.watermark.calls[0]).toMatchObject({ enabled: true })
    expect(hoisted.plugins.comment.calls).toHaveLength(1)
    expect(hoisted.plugins.replaceAssets.calls).toHaveLength(1)
  })

  it('skips the search plugin when search is disabled', () => {
    hoisted.themeConfig = { search: false }

    setupPlugins(createApp(), {})

    expect(hoisted.searchOptions).toBeUndefined()
  })

  it('accepts an object-form watermark config', () => {
    hoisted.themeConfig = { watermark: { text: 'draft' } }

    setupPlugins(createApp(), {})

    expect(hoisted.plugins.watermark.calls[0]).toMatchObject({ enabled: true, text: 'draft' })
  })

  it('supports `search: true` and object-form plugin search options', () => {
    hoisted.themeConfig = { search: true }
    setupPlugins(createApp(), {})
    expect(hoisted.searchOptions.isSearchable).toBeTypeOf('function')

    hoisted.searchOptions = undefined
    hoisted.themeConfig = {}
    setupPlugins(createApp(), { search: { isSearchable: () => true } } as any)
    expect(hoisted.searchOptions.isSearchable).toBeTypeOf('function')
  })
})

describe('setupPlugins: algolia search', () => {
  it('mounts docsearch when credentials are provided', () => {
    hoisted.themeConfig = { search: { provider: 'algolia', appId: 'id', apiKey: 'key' } }

    setupPlugins(createApp(), {})

    expect(hoisted.plugins.docsearch.calls).toHaveLength(1)
  })

  it('reports an error when the credentials are missing', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    hoisted.themeConfig = { search: { provider: 'algolia' } }

    setupPlugins(createApp(), {})

    expect(error).toHaveBeenCalledWith(expect.stringContaining('appId'))
    expect(hoisted.plugins.docsearch.calls).toHaveLength(0)
    error.mockRestore()
  })

  it('mounts docsearch from the plugin options when the theme config omits search', () => {
    setupPlugins(createApp(), { docsearch: { appId: 'id', apiKey: 'key' } } as any)

    expect(hoisted.plugins.docsearch.calls).toHaveLength(1)
  })
})

describe('setupPlugins: sitemap and seo', () => {
  it('mounts sitemap and seo when a hostname is configured', () => {
    hoisted.themeConfig = { hostname: 'https://example.com' }

    setupPlugins(createApp(true), {})

    expect(hoisted.plugins.sitemap.calls).toHaveLength(1)
    expect(hoisted.plugins.sitemap.calls[0]).toMatchObject({ hostname: 'https://example.com' })
    expect(hoisted.plugins.seo.calls).toHaveLength(1)
    expect(hoisted.plugins.seo.calls[0]).toMatchObject({ hostname: 'https://example.com' })
  })

  it('mounts neither during dev nor without a hostname', () => {
    hoisted.themeConfig = { hostname: 'https://example.com' }
    setupPlugins(createApp(false), {})
    expect(hoisted.plugins.sitemap.calls).toHaveLength(0)
    expect(hoisted.plugins.seo.calls).toHaveLength(0)

    hoisted.themeConfig = {}
    setupPlugins(createApp(true), {})
    expect(hoisted.plugins.sitemap.calls).toHaveLength(0)
    expect(hoisted.plugins.seo.calls).toHaveLength(0)
  })

  it('lets the plugin options disable sitemap and seo', () => {
    hoisted.themeConfig = { hostname: 'https://example.com' }

    setupPlugins(createApp(true), { sitemap: false, seo: false } as any)

    expect(hoisted.plugins.sitemap.calls).toHaveLength(0)
    expect(hoisted.plugins.seo.calls).toHaveLength(0)
  })

  it('merges object-form plugin options and fills in the hostname', () => {
    hoisted.themeConfig = { hostname: 'https://example.com' }

    setupPlugins(createApp(true), {
      sitemap: { changefreq: 'daily' },
      seo: { author: 'me' },
      cache: { cacheDir: '.cache' },
    } as any)

    expect(hoisted.plugins.sitemap.calls[0]).toMatchObject({
      changefreq: 'daily',
      hostname: 'https://example.com',
    })
    expect(hoisted.plugins.seo.calls[0]).toMatchObject({
      author: 'me',
      hostname: 'https://example.com',
    })
    expect(hoisted.plugins.cache.calls[0]).toMatchObject({
      cacheDir: '.cache',
      type: 'filesystem',
    })
  })
})
