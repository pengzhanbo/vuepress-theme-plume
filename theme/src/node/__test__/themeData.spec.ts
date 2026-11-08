import type { App } from 'vuepress'
import type { ThemeBuiltinPlugins, ThemeCollectionItem, ThemeData, ThemeLocaleData, ThemeOptions } from '../../shared/index.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  getImageOriginalSize: vi.fn(),
  resolveImagePath: vi.fn((_app: unknown, src: string) => src),
}))

vi.mock('vuepress-plugin-md-power', () => ({
  getImageOriginalSize: hoisted.getImageOriginalSize,
  resolveImagePath: hoisted.resolveImagePath,
}))

const { processProfileImageSize, resolveThemeData } = await import('../features/theme-data.js')

const app = {} as App

function createOptions(options: ThemeOptions = {}): ThemeOptions {
  return options
}

beforeEach(() => {
  hoisted.getImageOriginalSize.mockReset()
  hoisted.resolveImagePath.mockClear()
})

describe('resolveThemeData', () => {
  it('drops configuration-only keys from the client payload', () => {
    const themeData = resolveThemeData(app, createOptions({
      hostname: 'https://example.com',
      sidebar: { '/': 'auto' },
      navbar: [{ text: 'Home', link: '/' }],
      collections: [{ type: 'post', dir: 'blog' } as ThemeCollectionItem],
      encrypt: { rules: {} },
      // 以下字段需要在客户端可用。
      logo: '/logo.svg',
      outline: 'deep',
    }))

    expect(themeData.logo).toBe('/logo.svg')
    expect(themeData.outline).toBe('deep')
    expect(themeData).not.toHaveProperty('hostname')
    expect(themeData).not.toHaveProperty('sidebar')
    expect(themeData).not.toHaveProperty('navbar')
    expect(themeData).not.toHaveProperty('collections')
    expect(themeData).not.toHaveProperty('encrypt')
  })

  it('normalizes contributors and changelog into booleans or a mode object', () => {
    expect(resolveThemeData(app, createOptions()).contributors).toBe(true)
    expect(resolveThemeData(app, createOptions({ contributors: false })).contributors).toBe(false)
    expect(resolveThemeData(app, createOptions({ contributors: {} })).contributors).toEqual({ mode: 'inline' })
    expect(resolveThemeData(app, createOptions({ contributors: { mode: 'footer' as any } })).contributors)
      .toEqual({ mode: 'footer' })

    expect(resolveThemeData(app, createOptions({ changelog: true })).changelog).toBe(true)
    expect(resolveThemeData(app, createOptions({ changelog: false })).changelog).toBe(false)
  })

  it('removes the per-page bulletin switch from the client payload', () => {
    const themeData = resolveThemeData(app, createOptions({
      bulletin: { enablePage: () => false, title: 'Notice', content: 'Hello' },
      locales: {
        '/en/': { bulletin: { enablePage: false, title: 'Notice' } },
      },
    }))

    // `enablePage` 只能在构建期决定，客户端只需要公告内容。
    expect(themeData.bulletin).toEqual({ title: 'Notice', content: 'Hello' })
    expect(themeData.locales!['/en/'].bulletin).toEqual({ title: 'Notice' })
  })

  it('keeps the excluded keys out of the locale payload as well', () => {
    const themeData = resolveThemeData(app, createOptions({
      locales: {
        '/': {},
        '/en/': { appearance: false, blog: [], collections: [], outline: 'deep' } as ThemeLocaleData,
      },
    }))

    expect(themeData.locales!['/en/'].outline).toBe('deep')
    expect(themeData.locales!['/en/']).not.toHaveProperty('appearance')
    expect(themeData.locales!['/en/']).not.toHaveProperty('blog')
    expect(themeData.locales!['/en/']).not.toHaveProperty('collections')
  })
})

describe('resolveThemeData > fallback navbar', () => {
  const postCollection: ThemeOptions['collections'] = [{
    type: 'post',
    dir: 'blog',
    title: 'Blog',
  }]

  it('builds home, posts, tags and archives entries from the first post collection', () => {
    const themeData = resolveThemeData(app, createOptions({
      locales: { '/': { collections: postCollection } },
    }))

    expect(themeData.locales!['/'].navbar).toEqual([
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'Tags', link: '/blog/tags/' },
      { text: 'Archives', link: '/blog/archives/' },
    ])
  })

  it('skips tags and archives entries when the collection disables them', () => {
    const themeData = resolveThemeData(app, createOptions({
      locales: {
        '/': { collections: [{ type: 'post', dir: 'blog', title: 'Blog', tags: false, archives: false }] },
      },
    }))

    expect(themeData.locales!['/'].navbar).toEqual([
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/' },
    ])
  })

  it('honors the configured texts and locale prefix', () => {
    const themeData = resolveThemeData(app, createOptions({
      homeText: '首页',
      postsText: '文章',
      tagText: '标签',
      archiveText: '归档',
      locales: { '/en/': { collections: [{ type: 'post', dir: 'blog' } as ThemeCollectionItem] } },
    }))

    expect(themeData.locales!['/en/'].navbar).toEqual([
      { text: '首页', link: '/en/' },
      // 集合未声明标题时优先使用目录名，而不是全局的 postsText。
      { text: 'blog', link: '/en/blog/' },
      { text: '标签', link: '/en/blog/tags/' },
      { text: '归档', link: '/en/blog/archives/' },
    ])
  })

  it('falls back to a home-only navbar when the locale has no post collection', () => {
    const themeData = resolveThemeData(app, createOptions({
      locales: {
        // 纯文档站点只有 doc 集合，仍然需要 Home 入口。
        '/': { collections: [{ type: 'doc', dir: 'guide' } as ThemeCollectionItem] },
        '/en/': {},
      },
    }))

    expect(themeData.locales!['/'].navbar).toEqual([{ text: 'Home', link: '/' }])
    expect(themeData.locales!['/en/'].navbar).toEqual([{ text: 'Home', link: '/en/' }])
  })

  it('keeps the explicit navbar untouched', () => {
    const navbar = [{ text: 'Guide', link: '/guide/' }]
    const themeData = resolveThemeData(app, createOptions({
      locales: { '/': { navbar } },
    }))

    expect(themeData.locales!['/'].navbar).toEqual(navbar)
  })
})

describe('processProfileImageSize', () => {
  function createApp(isBuild = true): App {
    return { env: { isBuild } } as unknown as App
  }

  function createThemeData(): ThemeData {
    return {
      profile: { avatar: '/avatar.png' },
      locales: {
        '/en/': { profile: { avatar: '/avatar-en.png' } },
      },
    }
  }

  const size = { width: 100, height: 100 }

  it('does nothing outside a production build', async () => {
    hoisted.getImageOriginalSize.mockResolvedValue(size)
    const themeData = createThemeData()

    await processProfileImageSize(createApp(false), themeData, {}, { markdown: { imageSize: 'local' } })

    expect(hoisted.getImageOriginalSize).not.toHaveBeenCalled()
    expect(themeData.profile).toEqual({ avatar: '/avatar.png' })
  })

  it('does nothing when the image size option is disabled', async () => {
    const themeData = createThemeData()

    await processProfileImageSize(createApp(), themeData, {}, { markdown: { imageSize: false } })

    expect(hoisted.getImageOriginalSize).not.toHaveBeenCalled()
  })

  it('falls back to the markdown-power plugin option', async () => {
    hoisted.getImageOriginalSize.mockResolvedValue(size)
    const themeData = createThemeData()
    const plugins = { markdownPower: { imageSize: 'local' } } as unknown as ThemeBuiltinPlugins

    await processProfileImageSize(createApp(), themeData, plugins, {})

    expect(hoisted.getImageOriginalSize).toHaveBeenCalledTimes(2)
  })

  it('adds the original size to the profile avatar of every locale', async () => {
    hoisted.getImageOriginalSize.mockResolvedValue(size)
    const themeData = createThemeData()

    await processProfileImageSize(createApp(), themeData, {}, { markdown: { imageSize: 'all' } })

    expect(hoisted.getImageOriginalSize).toHaveBeenCalledTimes(2)
    expect(themeData.profile).toMatchObject({ originalWidth: 100, originalHeight: 100 })
    expect(themeData.locales!['/en/'].profile).toMatchObject({ originalWidth: 100, originalHeight: 100 })
  })

  it('leaves the profile untouched when the image size cannot be resolved', async () => {
    hoisted.getImageOriginalSize.mockResolvedValue(null)
    const themeData = createThemeData()

    await processProfileImageSize(createApp(), themeData, {}, { markdown: { imageSize: 'local' } })

    expect(themeData.profile).toEqual({ avatar: '/avatar.png' })
    expect(themeData.locales!['/en/'].profile).toEqual({ avatar: '/avatar-en.png' })
  })
})
