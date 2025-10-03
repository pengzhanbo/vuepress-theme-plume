import type { App, Page } from 'vuepress/core'
import type {
  EncryptOptions,
  ThemePageData,
  ThemePostFrontmatter,
  ThemePosts,
  ThemePostsItem,
} from '../../shared/index.js'
import fs from 'node:fs'
import { removeLeadingSlash } from '@vuepress/helper'
import dayjs from 'dayjs'
import { getThemeConfig } from '../loadConfig/index.js'
import { createMatcher, logger, perf, resolveContent, withBase, writeTemp } from '../utils/index.js'
import { isEncryptPage } from './prepareEncrypt.js'

const HEADING_RE = /<h(\d)[^>]*>.*?<\/h\1>/gi
const EXCERPT_SPLIT = '<!-- more -->'

function getTimestamp(time: Date): number {
  return new Date(time).getTime()
}

function sortPage(prev: Page, next: Page): number {
  return getTimestamp((prev.frontmatter.createTime as Date) || prev.date)
    < getTimestamp(next.frontmatter.createTime as Date || next.date)
    ? 1
    : -1
}

function processPostData(
  page: Page<ThemePageData, ThemePostFrontmatter & Record<string, unknown>>,
  isBuild: boolean,
  encrypt?: EncryptOptions,
): ThemePostsItem {
  const tags = page.frontmatter.tags
  const date = page.frontmatter.createTime
    || page.frontmatter.date
    // vuepress 对初始化时间的处理，默认为 `0000-00-00` (Why ?)
    || (page.date === '0000-00-00' ? fs.statSync(page.filePath!).birthtime : page.date)
  const data: ThemePostsItem = {
    path: page.path,
    title: page.title,
    categoryList: page.data.categoryList,
    tags,
    sticky: page.frontmatter.sticky,
    createTime: dayjs(new Date(date)).format('YYYY/MM/DD HH:mm:ss'),
    lang: page.lang,
    excerpt: '',
    cover: page.frontmatter.cover,
    coverStyle: page.frontmatter.coverStyle,
  }

  if (typeof data.cover === 'object') {
    logger.warn(`cover should be a path string, please use string instead. (${page.filePathRelative})`)
  }

  if (isEncryptPage(page, encrypt)) {
    data.encrypt = true
  }

  if (page.frontmatter.draft && !isBuild) {
    data.draft = true
  }

  const fmExcerpt = page.frontmatter.excerpt
  if (fmExcerpt !== false) {
    if (typeof fmExcerpt === 'string') {
      data.excerpt = fmExcerpt
    }
    else if (page.contentRendered.includes(EXCERPT_SPLIT)) {
      const contents = page.contentRendered.split(EXCERPT_SPLIT)
      let excerpt = contents[0]
      // 删除摘要中的标题
      excerpt = excerpt.replace(HEADING_RE, '')
      data.excerpt = excerpt
    }
  }
  return data
}

export async function preparedPostsData(app: App): Promise<void> {
  const isBuild = app.env.isBuild
  const { encrypt, locales } = getThemeConfig()

  perf.mark('prepare:posts-data')

  const postsData: Record<string, ThemePosts> = {}

  const pages = app.pages.filter(page =>
    page.filePathRelative && page.filePath
    && page.frontmatter.article !== false
    && (page.frontmatter.draft === true ? !isBuild : true),
  ) as Page<ThemePageData, ThemePostFrontmatter & Record<string, unknown>>[]

  for (const [locale, { collections }] of Object.entries(locales || {})) {
    if (!collections)
      continue
    for (const { include, exclude, dir } of collections.filter(item => item.type === 'post')) {
      const source = app.dir.source(removeLeadingSlash(withBase(dir, locale)))
      const isMatched = createMatcher(include, exclude, source)

      postsData[withBase(dir, locale)] = pages
        .filter(({ filePath }) => filePath?.startsWith(source) && isMatched(filePath))
        .sort(sortPage)
        .map(page => processPostData(page, isBuild, encrypt))
    }
  }

  const content = resolveContent(app, { name: 'postsData', content: postsData })
  await writeTemp(app, 'internal/postsData.js', content)

  perf.log('prepare:posts-data')
}
