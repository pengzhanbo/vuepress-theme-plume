import {
  ensureLeadingSlash,
  getRootLang,
  getRootLangPath,
  removeLeadingSlash,
} from '@vuepress/helper'
import type { App, Page } from 'vuepress/core'
import { createPage } from 'vuepress/core'
import { createFilter } from 'create-filter'
import type {
  PageCategoryData,
  PlumeThemeLocaleOptions,
  PlumeThemePageData,
} from '../shared/index.js'
import { normalizePath, withBase } from './utils/index.js'
import { PRESET_LOCALES } from './locales/index.js'
import { resolveNotesLinkList, resolveNotesOptions } from './config/index.js'

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
      frontmatter: { lang, _pageLayout: 'blog', title: getTitle(locale, 'blog') },
    }))

    // 添加 标签页
    blog.tags !== false && pageList.push(createPage(app, {
      path: withBase(blog.tagsLink || `${link}/tags/`, localePath),
      frontmatter: { lang, _pageLayout: 'blog-tags', title: getTitle(locale, 'tag') },
    }))

    // 添加归档页
    blog.archives !== false && pageList.push(createPage(app, {
      path: withBase(blog.archivesLink || `${link}/archives/`, localePath),
      frontmatter: { lang, _pageLayout: 'blog-archives', title: getTitle(locale, 'archive') },
    }))
  }
  app.pages.push(...await Promise.all(pageList))
}

const weakFilter = new WeakMap<PlumeThemeLocaleOptions, (id: string | undefined) => boolean>()

function createBlogFilter(localeOptions: PlumeThemeLocaleOptions) {
  if (weakFilter.has(localeOptions))
    return weakFilter.get(localeOptions)!

  const blog = localeOptions.blog || {}
  const notesList = resolveNotesOptions(localeOptions)
  const notesDirList = notesList
    .map(notes => removeLeadingSlash(normalizePath(`${notes.dir}/**`)))
    .filter(Boolean)

  const filter = createFilter(
    blog.include ?? ['**/*.md'],
    [
      '**/{README,readme,index}.md',
      '.vuepress/',
      'node_modules/',
      ...(blog.exclude ?? []),
      ...notesDirList,
    ].filter(Boolean),
    { resolve: false },
  )

  weakFilter.set(localeOptions, filter)

  return filter
}

export function extendsPageData(
  page: Page<PlumeThemePageData>,
  localeOptions: PlumeThemeLocaleOptions,
) {
  page.data.filePathRelative = page.filePathRelative
  page.routeMeta.title = page.frontmatter.title || page.title

  if (createBlogFilter(localeOptions)(page.filePathRelative || '')) {
    page.data.isBlogPost = true
  }

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

  if ('externalLink' in page.frontmatter) {
    page.frontmatter.externalLinkIcon = page.frontmatter.externalLink
    delete page.frontmatter.externalLink
  }

  autoCategory(page, localeOptions)
  pageContentRendered(page)
}

let uuid = 10000
const cache: Record<string, number> = {}
const RE_CATEGORY = /^(\d+)?(?:\.?)([^]+)$/
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
  const categoryList: PageCategoryData[] = ensureLeadingSlash(pagePath)
    .replace(LOCALE_RE, '')
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
