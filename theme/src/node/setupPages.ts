import type { App, Page } from 'vuepress/core'
import type {
  PageCategoryData,
  PlumeThemeLocaleOptions,
  PlumeThemePageData,
} from '../shared/index.js'
import {
  ensureLeadingSlash,
  getRootLang,
  getRootLangPath,
} from '@vuepress/helper'
import { createPage } from 'vuepress/core'
import { resolveNotesLinkList } from './config/index.js'
import { PRESET_LOCALES } from './locales/index.js'
import { hash, withBase } from './utils/index.js'

export async function setupPage(
  app: App,
  localeOption: PlumeThemeLocaleOptions,
) {
  if (localeOption.blog === false)
    return

  const pageList: Promise<Page>[] = []
  const locales = localeOption.locales || {}
  const rootPath = getRootLangPath(app)
  const rootLang = getRootLang(app)

  const blog = localeOption.blog || {}
  const link = blog.link || '/blog/'

  const getTitle = (locale: string, key: string) => {
    const opt = PRESET_LOCALES[locale] || PRESET_LOCALES[rootPath] || {}
    return opt[key] || ''
  }

  for (const localePath of Object.keys(locales)) {
    const lang = app.siteData.locales?.[localePath]?.lang || rootLang
    const locale = localePath === '/' ? rootPath : localePath

    // 添加 博客页面
    if (blog.postList !== false) {
      pageList.push(createPage(app, {
        path: withBase(link, localePath),
        frontmatter: { lang, _pageLayout: 'blog', title: getTitle(locale, 'blog') },
      }))
    }

    // 添加 标签页
    if (blog.tags !== false) {
      pageList.push(createPage(app, {
        path: withBase(blog.tagsLink || `${link}/tags/`, localePath),
        frontmatter: { lang, _pageLayout: 'blog-tags', title: getTitle(locale, 'tag') },
      }))
    }

    // 添加归档页
    if (blog.archives !== false) {
      pageList.push(createPage(app, {
        path: withBase(blog.archivesLink || `${link}/archives/`, localePath),
        frontmatter: { lang, _pageLayout: 'blog-archives', title: getTitle(locale, 'archive') },
      }))
    }

    // 添加分类页
    if (blog.categories !== false) {
      pageList.push(createPage(app, {
        path: withBase(blog.categoriesLink || `${link}/categories/`, localePath),
        frontmatter: { lang, _pageLayout: 'blog-categories', title: getTitle(locale, 'category') },
      }))
    }
  }

  app.pages.push(...await Promise.all(pageList))
}

export function extendsPageData(
  page: Page<PlumeThemePageData>,
  localeOptions: PlumeThemeLocaleOptions,
) {
  page.data.filePathRelative = page.filePathRelative
  page.routeMeta.title = page.frontmatter.title || page.title

  if (page.frontmatter.icon) {
    page.routeMeta.icon = page.frontmatter.icon
  }

  if (page.frontmatter.home) {
    page.frontmatter.pageLayout = 'home'
    delete page.frontmatter.home
  }

  if (page.frontmatter.article === false) {
    page.frontmatter.draft = true
  }
  delete page.frontmatter.article

  if (page.frontmatter.friends) {
    page.frontmatter.draft = true
    page.data.type = 'friends'
    page.permalink = page.permalink ?? '/friends/'
    page.frontmatter.pageLayout = 'friends'
    delete page.frontmatter.friends
  }

  const pageType = page.frontmatter._pageLayout as string
  if (pageType) {
    page.frontmatter.draft = true
    page.data.type = pageType as any
    delete page.frontmatter._pageLayout
  }

  if (page.frontmatter.pageLayout === 'blog') {
    page.frontmatter.draft = true
    page.data.type = 'blog'
  }

  if ('externalLink' in page.frontmatter) {
    page.frontmatter.externalLinkIcon = page.frontmatter.externalLink
    delete page.frontmatter.externalLink
  }

  autoCategory(page, localeOptions)
}

let uuid = 10000
const cache: Record<string, number> = {}

const RE_CATEGORY = /^(?:(\d+)\.)?([\s\S]+)$/
let LOCALE_RE: RegExp

export function autoCategory(
  page: Page<PlumeThemePageData>,
  options: PlumeThemeLocaleOptions,
) {
  const pagePath = page.filePathRelative

  if (page.data.type || !pagePath)
    return
  const notesLinks = resolveNotesLinkList(options)

  if (notesLinks.some(link => page.path.startsWith(link)))
    return

  LOCALE_RE ??= new RegExp(
    `^(${Object.keys(options.locales || {}).filter(l => l !== '/').join('|')})`,
  )
  const list = ensureLeadingSlash(pagePath)
    .replace(LOCALE_RE, '')
    .replace(/^\//, '')
    .split('/')
    .slice(0, -1)

  const categoryList: PageCategoryData[] = list
    .map((category, index) => {
      const match = category.match(RE_CATEGORY) || []
      if (!cache[match[2]] && !match[1]) {
        cache[match[2]] = uuid++
      }
      return {
        id: hash(list.slice(0, index + 1).join('-')).slice(0, 6),
        sort: Number(match[1] || cache[match[2]]),
        name: match[2],
      }
    })
  page.data.categoryList = categoryList
}
