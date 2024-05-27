import {
  ensureLeadingSlash,
  getRootLang,
  getRootLangPath,
} from '@vuepress/helper'
import type { App, Page } from 'vuepress/core'
import { createPage } from 'vuepress/core'
import type {
  PageCategoryData,
  PlumeThemeLocaleOptions,
  PlumeThemePageData,
} from '../shared/index.js'
import { withBase } from './utils.js'
import { PRESET_LOCALES } from './locales/index.js'
import { resolveNotesLinkList } from './config/index.js'

export async function setupPage(
  app: App,
  localeOption: PlumeThemeLocaleOptions,
) {
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
    pageList.push(createPage(app, {
      path: withBase(link, localePath),
      frontmatter: { lang, type: 'blog', title: getTitle(locale, 'blog') },
    }))

    // 添加 标签页
    blog.tags !== false && pageList.push(createPage(app, {
      path: withBase(blog.tagsLink || `${link}/tags/`, localePath),
      frontmatter: { lang, type: 'blog-tags', title: getTitle(locale, 'tag') },
    }))

    // 添加归档页
    blog.archives !== false && pageList.push(createPage(app, {
      path: withBase(blog.archivesLink || `${link}/archives/`, localePath),
      frontmatter: { lang, type: 'blog-archives', title: getTitle(locale, 'archive') },
    }))
  }
  app.pages.push(...await Promise.all(pageList))
}

export function extendsPageData(
  page: Page<PlumeThemePageData>,
  localeOptions: PlumeThemeLocaleOptions,
) {
  page.data.filePathRelative = page.filePathRelative
  page.routeMeta.title = page.title

  if (page.frontmatter.icon)
    page.routeMeta.icon = page.frontmatter.icon

  if (page.frontmatter.friends) {
    page.frontmatter.article = false
    page.frontmatter.type = 'friends'
    page.data.isBlogPost = false
    page.permalink = page.permalink ?? '/friends/'
  }

  if ((page.frontmatter.type as string)?.startsWith('blog')) {
    page.data.isBlogPost = false
    page.frontmatter.article = false
    page.data.type = page.frontmatter.type as any
  }

  autoCategory(page, localeOptions)
  pageContentRendered(page)
}

let uuid = 10000
const cache: Record<string, number> = {}
const RE_CATEGORY = /^(\d+)?(?:\.?)([^]+)$/

export function autoCategory(
  page: Page<PlumeThemePageData>,
  options: PlumeThemeLocaleOptions,
) {
  const pagePath = page.filePathRelative

  if (page.frontmatter.type || !pagePath)
    return
  const notesLinks = resolveNotesLinkList(options)

  if (notesLinks.some(link => page.path.startsWith(link)))
    return

  const RE_LOCALE = new RegExp(
    `^(${Object.keys(options.locales || {}).filter(l => l !== '/').join('|')})`,
  )
  const categoryList: PageCategoryData[] = ensureLeadingSlash(pagePath)
    .replace(RE_LOCALE, '')
    .replace(/^\//, '')
    .split('/')
    .slice(0, -1)
    .map((category) => {
      const match = category.match(RE_CATEGORY) || []
      !cache[match[2]] && !match[1] && (cache[match[2]] = uuid++)
      return {
        type: Number(match[1] || cache[match[2]]),
        name: match[2],
      }
    })
  page.data.categoryList = categoryList
}

export function pageContentRendered(page: Page<PlumeThemePageData>) {
  const EXCERPT_SPLIT = '<!-- more -->'
  if (page.data.isBlogPost && page.contentRendered.includes(EXCERPT_SPLIT)) {
    const [excerpt, content] = page.contentRendered.split(EXCERPT_SPLIT)
    page.contentRendered = `<div class="excerpt">${excerpt}</div>${EXCERPT_SPLIT}${content}`
  }
}
