import type { App, Page } from 'vuepress/core'
import { createPage } from 'vuepress/core'
import { getThemeConfig } from '../loadConfig/index.js'
import { perfLog, perfMark, withBase } from '../utils/index.js'

function getRootLang(app: App): string {
  // infer from siteLocale
  const siteLocales = app.siteData.locales

  if (siteLocales['/']?.lang)
    return siteLocales['/'].lang

  return app.siteData.lang
}

export async function createPages(app: App) {
  const { localeOptions } = getThemeConfig()

  if (localeOptions.blog === false)
    return

  perfMark('create:blog-pages')
  const pageList: Promise<Page>[] = []
  const locales = localeOptions.locales || {}
  const rootLang = getRootLang(app)

  const blog = localeOptions.blog || {}
  const link = blog.link || '/blog/'

  for (const localePath of Object.keys(locales)) {
    const lang = app.siteData.locales?.[localePath]?.lang || rootLang
    const opt = locales[localePath]

    // 添加 博客页面
    if (blog.postList !== false) {
      pageList.push(createPage(app, {
        path: withBase(link, localePath),
        frontmatter: { lang, _pageLayout: 'blog', title: opt.blogText || localeOptions.blogText || 'Blog' },
      }))
    }

    // 添加 标签页
    if (blog.tags !== false) {
      pageList.push(createPage(app, {
        path: withBase(blog.tagsLink || `${link}/tags/`, localePath),
        frontmatter: { lang, _pageLayout: 'blog-tags', title: opt.tagText || localeOptions.tagText || 'Tags' },
      }))
    }

    // 添加归档页
    if (blog.archives !== false) {
      pageList.push(createPage(app, {
        path: withBase(blog.archivesLink || `${link}/archives/`, localePath),
        frontmatter: { lang, _pageLayout: 'blog-archives', title: opt.archiveText || localeOptions.archiveText || 'Archives' },
      }))
    }

    // 添加分类页
    if (blog.categories !== false) {
      pageList.push(createPage(app, {
        path: withBase(blog.categoriesLink || `${link}/categories/`, localePath),
        frontmatter: { lang, _pageLayout: 'blog-categories', title: opt.categoryText || localeOptions.categoryText || 'Categories' },
      }))
    }
  }

  app.pages.push(...await Promise.all(pageList))

  perfLog('create:blog-pages', app.env.isDebug)
}
