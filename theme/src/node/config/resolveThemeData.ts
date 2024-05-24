import { ensureEndingSlash, ensureLeadingSlash, entries, getRootLangPath } from '@vuepress/helper'
import type { App } from 'vuepress'
import type { NavItem, PlumeThemeLocaleOptions } from '../../shared/index.js'
import { PRESET_LOCALES } from '../locales/index.js'
import { normalizePath } from '../utils.js'

const EXCLUDE_LIST = ['locales', 'sidebar', 'navbar', 'notes', 'article']

export function resolveThemeData(app: App, options: PlumeThemeLocaleOptions): PlumeThemeLocaleOptions {
  const themeData: PlumeThemeLocaleOptions = { locales: {} }
  const root = getRootLangPath(app)

  entries(options).forEach(([key, value]) => {
    if (!EXCLUDE_LIST.includes(key))
      themeData[key] = value
  })

  entries(options.locales || {}).forEach(([locale, opt]) => {
    themeData.locales![locale] = {}
    entries(opt).forEach(([key, value]) => {
      if (!EXCLUDE_LIST.includes(key))
        themeData.locales![locale][key] = value
    })
  })

  entries(options.locales || {}).forEach(([locale, opt]) => {
    // 注入预设 导航栏。
    // home | blog | tags | archives
    if (opt.navbar !== false && opt.navbar?.length === 0) {
      // fallback navbar option
      const localePath = locale === '/' ? root : locale
      const navbar: NavItem[] = [{
        text: PRESET_LOCALES[localePath].home,
        link: locale,
      }]
      if (opt.blog) {
        navbar.push({
          text: PRESET_LOCALES[localePath].blog,
          link: withBase(opt.blog.link ?? '/blog/', locale),
        })
        opt.blog.tags && navbar.push({
          text: PRESET_LOCALES[locale].tag,
          link: withBase('/tags/', locale),
        })
        opt.blog.archives && navbar.push({
          text: PRESET_LOCALES[locale].archive,
          link: withBase('/archives/', locale),
        })
      }
      themeData.locales![locale].navbar = navbar
    }
    else {
      themeData.locales![locale].navbar = opt.navbar
    }
  })

  return themeData
}

function withBase(path: string, base = '/'): string {
  path = ensureEndingSlash(ensureLeadingSlash(path))
  if (path.startsWith(base))
    return path
  return normalizePath(`${base}${path}`)
}
