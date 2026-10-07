import { describe, expect, it, vi } from 'vitest'

/**
 * Capture the options passed to the search plugin, and the theme config returned
 * by the `getThemeConfig()` singleton, since `setupPlugins` reads both.
 *
 * 捕获传递给搜索插件的选项，以及 `getThemeConfig()` 单例返回的主题配置，
 * 因为 `setupPlugins` 会读取它们。
 */
const hoisted = vi.hoisted(() => ({
  searchOptions: undefined as any,
  themeConfig: {} as any,
}))

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
vi.mock('@vuepress/plugin-cache', () => ({ cachePlugin: () => ({}) }))
vi.mock('@vuepress/plugin-comment', () => ({ commentPlugin: () => ({}) }))
vi.mock('@vuepress/plugin-docsearch', () => ({ docsearchPlugin: () => ({}) }))
vi.mock('@vuepress/plugin-nprogress', () => ({ nprogressPlugin: () => ({}) }))
vi.mock('@vuepress/plugin-photo-swipe', () => ({ photoSwipePlugin: () => ({}) }))
vi.mock('@vuepress/plugin-reading-time', () => ({ readingTimePlugin: () => ({}) }))
vi.mock('@vuepress/plugin-replace-assets', () => ({ replaceAssetsPlugin: () => ({}) }))
vi.mock('@vuepress/plugin-seo', () => ({ seoPlugin: () => ({}) }))
vi.mock('@vuepress/plugin-sitemap', () => ({ sitemapPlugin: () => ({}) }))
vi.mock('@vuepress/plugin-watermark', () => ({ watermarkPlugin: () => ({}) }))
vi.mock('../src/node/loadConfig/index.js', () => ({
  getThemeConfig: () => hoisted.themeConfig,
}))
vi.mock('../src/node/plugins/code.js', () => ({ codePlugins: () => [] }))
vi.mock('../src/node/plugins/git.js', () => ({ gitPlugin: () => [] }))
vi.mock('../src/node/plugins/llms.js', () => ({ llmsPlugin: () => [] }))
vi.mock('../src/node/plugins/markdown.js', () => ({ markdownPlugins: () => [] }))

const { setupPlugins } = await import('../src/node/plugins/setupPlugins.js')

const app = { env: { isBuild: true } } as any

function createPage(path: string, filePathRelative: string, data: Record<string, unknown> = {}) {
  return { path, data: { filePathRelative, ...data }, frontmatter: {} } as any
}

/** Run `setupPlugins` with the given theme config and return the search filter. */
function resolveIsSearchable(config: any): (page: any) => boolean {
  hoisted.themeConfig = config
  setupPlugins(app, {})
  return hoisted.searchOptions.isSearchable
}

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
