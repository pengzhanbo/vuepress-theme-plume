import type { App } from 'vuepress'
import type { ThemeBuiltinPlugins, ThemeData, ThemeNavItem, ThemeOptions } from '../../shared/index.js'
import { deepClone, isBoolean, isPlainObject, objectEntries } from '@pengzhanbo/utils'
import { ensureEndingSlash, removeEndingSlash } from '@vuepress/helper'
import { getImageOriginalSize, resolveImagePath } from 'vuepress-plugin-md-power'
import { withBase } from '../utils/index.js'

const EXCLUDE_LIST: (keyof ThemeOptions)[] = [
  'hostname',
  'locales',
  'sidebar',
  'navbar',
  'blog', // @deprecated
  'notes', // @deprecated
  'collections',
  'components',
  'sidebar',
  'article',
  'changelog',
  'contributors',
  'bulletin',
  'cache',
  'autoFrontmatter',
  'comment',
  'codeHighlighter',
  'markdown',
  'configFile',
  'encrypt',
  'plugins',
  'search',
  'watermark',
  'readingTime',
  'copyCode',
  'llmstxt',
  'feed',
]
// 过滤不需要出现在多语言配置中的字段
const EXCLUDE_LOCALE_LIST: (keyof ThemeOptions)[] = [...EXCLUDE_LIST, 'blog', 'appearance']

export function resolveThemeData(app: App, options: ThemeOptions): ThemeData {
  const themeData: ThemeData = { locales: {} }

  objectEntries(options).forEach(([key, value]) => {
    if (!EXCLUDE_LIST.includes(key as keyof ThemeOptions))
      themeData[key] = deepClone(value)
  })

  themeData.contributors = isPlainObject(options.contributors)
    ? { mode: options.contributors.mode || 'inline' }
    : isBoolean(options.contributors) ? options.contributors : true

  themeData.changelog = !!options.changelog

  if (isPlainObject(options.bulletin)) {
    const { enablePage: _, ...opt } = options.bulletin
    themeData.bulletin = opt
  }
  else if (options.bulletin) {
    themeData.bulletin = options.bulletin
  }

  objectEntries(options.locales || {}).forEach(([locale, opt]) => {
    themeData.locales![locale] = {}

    objectEntries(opt).forEach(([key, value]) => {
      if (!EXCLUDE_LOCALE_LIST.includes(key as keyof ThemeOptions))
        themeData.locales![locale][key] = deepClone(value) as any
    })

    if (isPlainObject(opt.bulletin)) {
      const { enablePage: _, ...rest } = opt.bulletin
      themeData.locales![locale].bulletin = rest
    }
    else if (opt.bulletin) {
      themeData.locales![locale].bulletin = opt.bulletin
    }
  })

  objectEntries(options.locales || {}).forEach(([locale, opt]) => {
    // 注入预设 导航栏
    // home | blog | tags | archives
    if (!opt.navbar) {
      // fallback navbar option
      const navbar: ThemeNavItem[] = [{
        text: opt.homeText || options.homeText || 'Home',
        link: locale,
      }]
      const posts = opt.collections?.find(item => item.type === 'post')
      if (posts) {
        const postsLink = ensureEndingSlash(posts.link || posts.dir)
        navbar.push({
          text: posts.title || removeEndingSlash(posts.dir).split('/').pop() || opt.postsText || options.postsText || 'Posts',
          link: withBase(postsLink, locale),
        })
        if (posts.tags !== false) {
          navbar.push({
            text: opt.tagText || options.tagText || 'Tags',
            link: withBase(ensureEndingSlash(posts.tagsLink || `${postsLink}/tags`), locale),
          })
        }
        if (posts.archives !== false) {
          navbar.push({
            text: opt.archiveText || options.archiveText || 'Archives',
            link: withBase(ensureEndingSlash(posts.archivesLink || `${postsLink}/archives`), locale),
          })
        }
      }

      themeData.locales![locale].navbar = navbar
    }
    else {
      themeData.locales![locale].navbar = opt.navbar
    }
  })

  return themeData
}

/**
 * 为用户配置的头像图片添加宽高信息
 */
export async function processProfileImageSize(
  app: App,
  themeData: ThemeData,
  plugins: ThemeBuiltinPlugins,
  options: ThemeOptions,
) {
  const imageSize = options.markdown?.imageSize
    ?? (typeof plugins.markdownPower === 'boolean' ? false : plugins.markdownPower?.imageSize)

  if (!app.env.isBuild || !imageSize)
    return

  const remote = imageSize === 'all'
  if (themeData.profile?.avatar) {
    const size = await getImageOriginalSize(resolveImagePath(app, themeData.profile.avatar), remote)
    if (size) {
      themeData.profile = {
        ...themeData.profile,
        originalWidth: size.width,
        originalHeight: size.height,
      } as any
    }
  }
  if (themeData.locales) {
    for (const locale of Object.keys(themeData.locales)) {
      if (themeData.locales[locale].profile?.avatar) {
        const size = await getImageOriginalSize(resolveImagePath(app, themeData.locales[locale].profile.avatar), remote)
        if (size) {
          themeData.locales[locale].profile = {
            ...themeData.locales[locale].profile,
            originalWidth: size.width,
            originalHeight: size.height,
          } as any
        }
      }
    }
  }
}
