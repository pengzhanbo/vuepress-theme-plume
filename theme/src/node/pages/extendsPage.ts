import type { Page } from 'vuepress/core'
import type { ThemePageData } from '../../shared/index.js'
import type { ExtendsPageEnv } from '../features/feed/head.js'
import { deleteKey } from '@pengzhanbo/utils'
import { findCollection } from '../features/collections/index.js'
import { injectFeedLinks } from '../features/feed/head.js'
import { normalizePath } from '../utils/index.js'
import { autoCategory } from './autoCategory.js'
import { encryptPage } from './encryptPage.js'
import { enableBulletin } from './pageBulletin.js'

export type { ExtendsPageEnv } from '../features/feed/head.js'

/**
 * Extend page data
 *
 * 扩展页面数据，清理页面数据、自动分类、启用公告栏、加密页面、注入 feed 自动发现链接
 */
export async function extendsPageData(
  page: Page<ThemePageData>,
  env: ExtendsPageEnv,
): Promise<void> {
  cleanPageData(page)
  autoCategory(page)
  enableBulletin(page)
  await encryptPage(page)
  injectFeedLinks(page, env)
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

  // headers 已由 client 端处理，vuepress markdown-it 默认注入的 headers 已无用
  // 移除数据以避免导致生成的 page 数据冗余
  if (page.headers) {
    page.data.headers = []
  }

  // 删除已弃用的 home 字段，统一由 pageLayout 管理
  if (page.frontmatter.home) {
    page.frontmatter.pageLayout = 'home'
    deleteKey(page.frontmatter, 'home')
  }

  // 删除已弃用的 friends 字段，统一由 pageLayout 管理
  if (page.frontmatter.friends) {
    page.data.type = 'friends'
    page.permalink = page.permalink ?? normalizePath(`${page.pathLocale}/friends/`)
    page.frontmatter.pageLayout = 'friends'
    deleteKey(page.frontmatter, 'friends')
  }

  // _pageLayout 是在 createPage 阶段注入的 posts 类型的虚拟页面
  // 包括 posts / post-categories / post-tags / post-archives
  // 将它们归一到 page.data.type 中
  const pageType = page.frontmatter._pageLayout as string
  if (pageType) {
    page.data.type = pageType as any
    deleteKey(page.frontmatter, '_pageLayout')
  }

  if (page.frontmatter.pageLayout === 'blog' /** @deprecated blog 已弃用 */
    || page.frontmatter.pageLayout === 'posts') {
    page.data.type = 'posts'
  }

  if ('externalLink' in page.frontmatter) {
    page.frontmatter.externalLinkIcon = page.frontmatter.externalLink
    deleteKey(page.frontmatter, 'externalLink')
  }

  // is markdown file
  if (page.data.filePathRelative?.endsWith('.md')) {
    const collection = findCollection(page)
    if (collection) {
      const title = page.frontmatter.title || page.data.title || page.title
      const newTitle = `${title} | ${collection.title}`
      page.data.title = newTitle
    }
  }
}
