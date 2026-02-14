import type { Page } from 'vuepress/core'
import type { ThemePageData } from '../../shared/index.js'
import { findCollection } from '../collections/findCollection.js'
import { autoCategory } from './autoCategory.js'
import { encryptPage } from './encryptPage.js'
import { enableBulletin } from './pageBulletin.js'

/**
 * Extend page data
 *
 * 扩展页面数据，清理页面数据、自动分类、启用公告栏、加密页面
 */
export async function extendsPageData(
  page: Page<ThemePageData>,
): Promise<void> {
  cleanPageData(page)
  autoCategory(page)
  enableBulletin(page)
  await encryptPage(page)
}

function cleanPageData(page: Page<ThemePageData>) {
  page.data.filePathRelative = page.filePathRelative
  page.routeMeta.title = page.frontmatter.title || page.title

  if (page.frontmatter.icon) {
    page.routeMeta.icon = page.frontmatter.icon
  }

  if (page.frontmatter.badge) {
    page.routeMeta.badge = page.frontmatter.badge
  }

  if (page.frontmatter.home) {
    page.frontmatter.pageLayout = 'home'
    delete page.frontmatter.home
  }

  if (page.headers) {
    page.data.headers = []
  }

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

  if (page.frontmatter.pageLayout === 'blog' || page.frontmatter.pageLayout === 'posts') {
    page.frontmatter.draft = true
    page.data.type = 'posts'
  }

  if ('externalLink' in page.frontmatter) {
    page.frontmatter.externalLinkIcon = page.frontmatter.externalLink
    delete page.frontmatter.externalLink
  }

  // is markdown file
  if (page.data.filePathRelative?.endsWith('.md')) {
    if (!(page as any)._rawTitle)
      (page as any)._rawTitle = page.frontmatter.title || page.data.title || page.title
    const title = (page as any)._rawTitle
    const collection = findCollection(page)
    if (collection) {
      const newTitle = `${title} | ${collection.title}`
      page.data.title = newTitle
    }
  }
}
