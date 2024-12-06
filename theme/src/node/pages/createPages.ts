import type { App, Page } from 'vuepress/core'
import type { PlumeThemeLocaleOptions } from '../../shared/index.js'
import { getRootLang } from '@vuepress/helper'
import { createPage } from 'vuepress/core'
import { perfLog, perfMark, withBase } from '../utils/index.js'

export async function createPages(app: App, localeOption: PlumeThemeLocaleOptions) {
  if (localeOption.blog === false)
    return

  perfMark('create:blog-pages')
  const pageList: Promise<Page>[] = []
  const locales = localeOption.locales || {}
  const rootLang = getRootLang(app)

  const blog = localeOption.blog || {}
  const link = blog.link || '/blog/'

  for (const localePath of Object.keys(locales)) {
    const lang = app.siteData.locales?.[localePath]?.lang || rootLang
    const opt = locales[localePath]

    // 添加 博客页面
    if (blog.postList !== false) {
      pageList.push(createPage(app, {
        path: withBase(link, localePath),
        frontmatter: { lang, _pageLayout: 'blog', title: opt.blogText || localeOption.blogText || 'Blog' },
      }))
    }

    // 添加 标签页
    if (blog.tags !== false) {
      pageList.push(createPage(app, {
        path: withBase(blog.tagsLink || `${link}/tags/`, localePath),
        frontmatter: { lang, _pageLayout: 'blog-tags', title: opt.tagText || localeOption.tagText || 'Tags' },
      }))
    }

    // 添加归档页
    if (blog.archives !== false) {
      pageList.push(createPage(app, {
        path: withBase(blog.archivesLink || `${link}/archives/`, localePath),
        frontmatter: { lang, _pageLayout: 'blog-archives', title: opt.archiveText || localeOption.archiveText || 'Archives' },
      }))
    }

    // 添加分类页
    if (blog.categories !== false) {
      pageList.push(createPage(app, {
        path: withBase(blog.categoriesLink || `${link}/categories/`, localePath),
        frontmatter: { lang, _pageLayout: 'blog-categories', title: opt.categoryText || localeOption.categoryText || 'Categories' },
      }))
    }
  }

  app.pages.push(...await Promise.all(pageList))

  perfLog('create:blog-pages', app.env.isDebug)
}
