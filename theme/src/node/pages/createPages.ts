import type { App, Page } from 'vuepress/core'
import { objectKeys } from '@pengzhanbo/utils'
import pMap from 'p-map'
import { createPage } from 'vuepress/core'
import { getThemeConfig } from '../loadConfig/index.js'
import { perf, withBase } from '../utils/index.js'

/**
 * Bounded concurrency for page creation: `createPage` reads and renders the page
 * source, so creating every page at once is unbounded I/O.
 *
 * 页面创建的并发上限：`createPage` 会读取并渲染页面源文件，
 * 一次性创建所有页面属于无界 I/O。
 */
const CREATE_PAGE_CONCURRENCY = 64

function getRootLang(app: App): string {
  // infer from siteLocale
  const siteLocales = app.siteData.locales

  if (siteLocales['/']?.lang)
    return siteLocales['/'].lang

  return app.siteData.lang
}

/**
 * Create additional pages
 *
 * 创建额外页面，根据集合配置生成文章列表页、标签页、分类页、归档页等
 */
export async function createPages(app: App): Promise<void> {
  const options = getThemeConfig()

  perf.mark('create:post-pages')

  // 收集创建任务而不是立即创建：延迟到统一执行，才能用 `pMap` 限制并发。
  // Collect tasks instead of starting them eagerly, so `pMap` can bound the concurrency.
  const pageTasks: Array<() => Promise<Page>> = []
  const locales = options.locales || {}
  const rootLang = getRootLang(app)

  for (const localePath of objectKeys(locales)) {
    const lang = app.siteData.locales?.[localePath]?.lang || rootLang
    const opt = locales[localePath]
    const collections = opt.collections?.filter(item => item.type === 'post')

    if (!collections?.length)
      continue

    for (const post of collections) {
      const link = withBase(post.link || post.dir, localePath)
      // 添加 文章列表页面
      if (post.postList !== false) {
        pageTasks.push(() => createPage(app, {
          path: link,
          frontmatter: { lang, _pageLayout: 'posts', title: post.title || opt.postsText || options.postsText || 'Posts' },
        }))
      }

      // 添加 标签页
      if (post.tags !== false) {
        pageTasks.push(() => createPage(app, {
          path: withBase(post.tagsLink || `${link}/tags/`, localePath),
          frontmatter: { lang, _pageLayout: 'posts-tags', title: opt.tagText || options.tagText || 'Tags' },
        }))
      }

      // 添加归档页
      if (post.archives !== false) {
        pageTasks.push(() => createPage(app, {
          path: withBase(post.archivesLink || `${link}/archives/`, localePath),
          frontmatter: { lang, _pageLayout: 'posts-archives', title: opt.archiveText || options.archiveText || 'Archives' },
        }))
      }

      // 添加分类页
      if (post.categories !== false) {
        pageTasks.push(() => createPage(app, {
          path: withBase(post.categoriesLink || `${link}/categories/`, localePath),
          frontmatter: { lang, _pageLayout: 'posts-categories', title: opt.categoryText || options.categoryText || 'Categories' },
        }))
      }
    }
  }

  app.pages.push(...await pMap(pageTasks, task => task(), { concurrency: CREATE_PAGE_CONCURRENCY }))

  perf.log('create:post-pages')
}
