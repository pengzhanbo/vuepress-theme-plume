import type { App, Page } from 'vuepress/core'
import { createPage } from 'vuepress/core'
import { getThemeConfig } from '../loadConfig/index.js'
import { perf, withBase } from '../utils/index.js'

function getRootLang(app: App): string {
  // infer from siteLocale
  const siteLocales = app.siteData.locales

  if (siteLocales['/']?.lang)
    return siteLocales['/'].lang

  return app.siteData.lang
}

export async function createPages(app: App): Promise<void> {
  const options = getThemeConfig()

  perf.mark('create:post-pages')

  const pageList: Promise<Page>[] = []
  const locales = options.locales || {}
  const rootLang = getRootLang(app)

  for (const localePath of Object.keys(locales)) {
    const lang = app.siteData.locales?.[localePath]?.lang || rootLang
    const opt = locales[localePath]
    const collections = opt.collections?.filter(item => item.type === 'post')

    if (!collections?.length)
      continue

    for (const post of collections) {
      const link = withBase(post.link || post.dir, localePath)
      // 添加 文章列表页面
      if (post.postList !== false) {
        pageList.push(createPage(app, {
          path: link,
          frontmatter: { lang, _pageLayout: 'posts', title: post.title || opt.blogText || options.blogText || 'Posts' },
        }))
      }

      // 添加 标签页
      if (post.tags !== false) {
        pageList.push(createPage(app, {
          path: withBase(post.tagsLink || `${link}/tags/`, localePath),
          frontmatter: { lang, _pageLayout: 'posts-tags', title: opt.tagText || options.tagText || 'Tags' },
        }))
      }

      // 添加归档页
      if (post.archives !== false) {
        pageList.push(createPage(app, {
          path: withBase(post.archivesLink || `${link}/archives/`, localePath),
          frontmatter: { lang, _pageLayout: 'posts-archives', title: opt.archiveText || options.archiveText || 'Archives' },
        }))
      }

      // 添加分类页
      if (post.categories !== false) {
        pageList.push(createPage(app, {
          path: withBase(post.categoriesLink || `${link}/categories/`, localePath),
          frontmatter: { lang, _pageLayout: 'posts-categories', title: opt.categoryText || options.categoryText || 'Categories' },
        }))
      }
    }
  }

  app.pages.push(...await Promise.all(pageList))

  perf.log('create:post-pages')
}
