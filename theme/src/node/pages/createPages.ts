import type { App, Page } from 'vuepress/core'
import type { PlumeThemeLocaleOptions } from '../../shared/index.js'
import { getRootLang, getRootLangPath } from '@vuepress/helper'
import { createPage } from 'vuepress/core'
import { PRESET_LOCALES } from '../locales/index.js'
import { withBase } from '../utils/index.js'

export async function createPages(app: App, localeOption: PlumeThemeLocaleOptions) {
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
