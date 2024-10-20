import type { App } from 'vuepress'
import type { NavItem, PlumeThemeLocaleOptions } from '../../shared/index.js'
import { entries, getRootLangPath, isPlainObject } from '@vuepress/helper'
import { PRESET_LOCALES } from '../locales/index.js'
import { withBase } from '../utils/index.js'

const EXCLUDE_LIST = ['locales', 'sidebar', 'navbar', 'notes', 'sidebar', 'article', 'avatar']
// 过滤不需要出现在多语言配置中的字段
const EXCLUDE_LOCALE_LIST = [...EXCLUDE_LIST, 'blog', 'appearance']

export function resolveThemeData(app: App, options: PlumeThemeLocaleOptions): PlumeThemeLocaleOptions {
  const themeData: PlumeThemeLocaleOptions = { locales: {} }
  const root = getRootLangPath(app)

  entries(options).forEach(([key, value]) => {
    if (!EXCLUDE_LIST.includes(key))
      themeData[key] = value
  })

  // TODO: 正式版中需删除此代码
  if (options.avatar) {
    themeData.profile ??= options.avatar
  }

  if (isPlainObject(themeData.bulletin)) {
    const { enablePage: _, ...opt } = themeData.bulletin
    themeData.bulletin = opt
  }

  entries(options.locales || {}).forEach(([locale, opt]) => {
    themeData.locales![locale] = {}
    entries(opt).forEach(([key, value]) => {
      if (!EXCLUDE_LOCALE_LIST.includes(key))
        themeData.locales![locale][key] = value
    })

    // TODO: 正式版中需删除此代码
    if (opt.avatar) {
      themeData.locales![locale].profile ??= opt.avatar
    }

    if (isPlainObject(themeData.locales![locale].bulletin)) {
      const { enablePage: _, ...opt } = themeData.locales![locale].bulletin
      themeData.locales![locale].bulletin = opt
    }
  })

  entries(options.locales || {}).forEach(([locale, opt]) => {
    // 注入预设 导航栏
    // home | blog | tags | archives
    if (opt.navbar !== false && (!opt.navbar || opt.navbar.length === 0)) {
      // fallback navbar option
      const localePath = locale === '/' ? root : locale
      const navbar: NavItem[] = [{
        text: PRESET_LOCALES[localePath].home,
        link: locale,
      }]
      if (options.blog !== false) {
        const blog = options.blog || {}
        const blogLink = blog.link || '/blog/'
        navbar.push({
          text: PRESET_LOCALES[localePath].blog,
          link: withBase(blogLink, locale),
        })
        if (blog.tags !== false) {
          navbar.push({
            text: PRESET_LOCALES[localePath].tag,
            link: withBase(blog.tagsLink || `${blogLink}/tags/`, locale),
          })
        }
        if (blog.archives !== false) {
          navbar.push({
            text: PRESET_LOCALES[localePath].archive,
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
