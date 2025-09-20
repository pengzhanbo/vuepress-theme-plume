import type { App, Page } from 'vuepress/core'
import type {
  ThemeBlogPostItem,
  ThemeBlogPostList,
  ThemePageData,
  ThemePostFrontmatter,
} from '../../shared/index.js'
import fs from 'node:fs'
import { removeLeadingSlash } from '@vuepress/helper'
import { createFilter } from 'create-filter'
import dayjs from 'dayjs'
import { resolveNotesOptions } from '../config/index.js'
import { getThemeConfig } from '../loadConfig/index.js'
import { logger, normalizePath, perf, resolveContent, writeTemp } from '../utils/index.js'
import { isEncryptPage } from './prepareEncrypt.js'

const HEADING_RE = /<h(\d)[^>]*>.*?<\/h\1>/gi
const EXCERPT_SPLIT = '<!-- more -->'

function getTimestamp(time: Date): number {
  return new Date(time).getTime()
}

export async function preparedBlogData(app: App): Promise<void> {
  const isBuild = app.env.isBuild
  const options = getThemeConfig()
  const encrypt = options.encrypt
  if (options.blog === false) {
    const content = resolveContent(app, { name: 'blogPostData', content: [] })
    await writeTemp(app, 'internal/blogData.js', content)
    return
  }

  perf.mark('prepare:blog-data')

  const blog = options.blog || {}
  const notesList = resolveNotesOptions(options)
  const notesDirList = notesList
    .map(notes => removeLeadingSlash(normalizePath(`${notes.dir}/**`)))
    .filter(Boolean)

  const filter = createFilter(
    blog.include ?? ['**/*.md'],
    [
      '**/{README,readme,index}.md',
      '**/.vuepress/**',
      '**/node_modules/**',
      ...(blog.exclude ?? []),
      ...notesDirList,
    ].filter(Boolean),
    { resolve: false },
  )

  const pages = app.pages.filter(page =>
    page.filePathRelative
    && filter(page.filePathRelative)
    && page.frontmatter.article !== false
    && (page.frontmatter.draft === true ? !isBuild : true),
  ).sort((prev, next) =>
    getTimestamp((prev.frontmatter.createTime as Date) || prev.date)
    < getTimestamp(next.frontmatter.createTime as Date || next.date)
      ? 1
      : -1,
  ) as Page<ThemePageData, ThemePostFrontmatter & Record<string, unknown>>[]

  const blogData: ThemeBlogPostList = pages.map((page) => {
    const tags = page.frontmatter.tags
    const date = page.frontmatter.createTime || page.frontmatter.date || (page.date === '0000-00-00' ? fs.statSync(page.filePath!).birthtime : page.date)
    const data: ThemeBlogPostItem = {
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
  })

  const content = resolveContent(app, { name: 'blogPostData', content: blogData })
  await writeTemp(app, 'internal/blogData.js', content)

  perf.log('prepare:blog-data')
}
