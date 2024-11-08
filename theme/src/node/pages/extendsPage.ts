import type { Page } from 'vuepress/core'
import type { PlumeThemeLocaleOptions, PlumeThemePageData } from '../../shared/index.js'
import { autoCategory } from './autoCategory.js'
import { enableBulletin } from './pageBulletin.js'

export function extendsPageData(
  page: Page<PlumeThemePageData>,
  localeOptions: PlumeThemeLocaleOptions,
) {
  cleanPageData(page)
  autoCategory(page, localeOptions)
  enableBulletin(page, localeOptions)
}

function cleanPageData(page: Page<PlumeThemePageData>) {
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

  if (page.frontmatter.pageLayout === 'blog') {
    page.frontmatter.draft = true
    page.data.type = 'blog'
  }

  if ('externalLink' in page.frontmatter) {
    page.frontmatter.externalLinkIcon = page.frontmatter.externalLink
    delete page.frontmatter.externalLink
  }
}
