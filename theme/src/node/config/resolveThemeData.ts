import type { App } from 'vuepress'
import type { ThemeData, ThemeNavItem, ThemeOptions } from '../../shared/index.js'
import { entries, isBoolean, isPlainObject } from '@vuepress/helper'
import { withBase } from '../utils/index.js'

const EXCLUDE_LIST: (keyof ThemeOptions)[] = [
  'hostname',
  'locales',
  'sidebar',
  'navbar',
  'notes',
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
]
// 过滤不需要出现在多语言配置中的字段
const EXCLUDE_LOCALE_LIST: (keyof ThemeOptions)[] = [...EXCLUDE_LIST, 'blog', 'appearance']

export function resolveThemeData(app: App, options: ThemeOptions): ThemeData {
  const themeData: ThemeData = { locales: {} }

  entries(options).forEach(([key, value]) => {
    if (!EXCLUDE_LIST.includes(key as keyof ThemeOptions))
      themeData[key] = value
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

  if (isPlainObject(options.blog)) {
    const { categoriesTransform, include, exclude, ...blog } = options.blog
    themeData.blog = blog
  }
  else {
    themeData.blog = options.blog
  }

  entries(options.locales || {}).forEach(([locale, opt]) => {
    themeData.locales![locale] = {}
    entries(opt).forEach(([key, value]) => {
      if (!EXCLUDE_LOCALE_LIST.includes(key as keyof ThemeOptions))
        themeData.locales![locale][key] = value
    })

    if (isPlainObject(opt.bulletin)) {
      const { enablePage: _, ...rest } = opt.bulletin
      themeData.locales![locale].bulletin = rest
    }
    else if (opt.bulletin) {
      themeData.locales![locale].bulletin = opt.bulletin
    }
  })

  entries(options.locales || {}).forEach(([locale, opt]) => {
    // 注入预设 导航栏
    // home | blog | tags | archives
    if (opt.navbar !== false && (!opt.navbar || opt.navbar.length === 0)) {
      // fallback navbar option
      const navbar: ThemeNavItem[] = [{
        text: opt.homeText || options.homeText || 'Home',
        link: locale,
      }]
      if (options.blog !== false) {
        const blog = options.blog || {}
        const blogLink = blog.link || '/blog/'
        navbar.push({
          text: opt.blogText || options.blogText || 'Blog',
          link: withBase(blogLink, locale),
        })
        if (blog.tags !== false) {
          navbar.push({
            text: opt.tagText || options.tagText || 'Tags',
            link: withBase(blog.tagsLink || `${blogLink}/tags/`, locale),
          })
        }
        if (blog.archives !== false) {
          navbar.push({
            text: opt.archiveText || options.archiveText || 'Archives',
            link: withBase(blog.archivesLink || `${blogLink}/archives/`, locale),
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
