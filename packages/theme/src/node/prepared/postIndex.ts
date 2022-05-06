import type { App, Page } from '@vuepress/core'
import * as chokidar from 'chokidar'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePageData,
  PlumeThemePostFrontmatter,
  PostIndex,
  PostItem,
} from '../../shared'
import { getCreateTime } from '../utils'

const HMR_CODE = `
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePostIndex) {
    __VUE_HMR_RUNTIME__.updatePostIndex(postIndex)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ postIndex }) => {
    __VUE_HMR_RUNTIME__.updatePostIndex(postIndex)
  })
}
`

const isBoolean = (arg: unknown): boolean => {
  return typeof arg === 'boolean'
}

export const preparedPostIndex = (
  app: App,
  localeOption: PlumeThemeLocaleOptions
): void => {
  let postIndex: PostIndex = (app.pages as Page<PlumeThemePageData>[])
    .filter((page) => {
      return (
        !!page.pathInferred &&
        !!page.filePath &&
        page.path !== '/' &&
        page.path !== '/404.html'
      )
    })
    .sort((left, right) => {
      const leftMatter = left.frontmatter as PlumeThemePostFrontmatter
      const rightMatter = right.frontmatter as PlumeThemePostFrontmatter
      const leftTime = getCreateTime(leftMatter.createTime || '')
      const rightTime = getCreateTime(rightMatter.createTime || '')
      return leftTime < rightTime ? 1 : -1
    })
    .map((page: Page<PlumeThemePageData>) => {
      const frontmatter = page.frontmatter as PlumeThemePostFrontmatter
      return {
        title: page.title,
        path: page.path,
        excerpt: page.excerpt,
        tags: frontmatter.tags || [],
        createTime: page.data.createTime,
        author: frontmatter.author,
        sticky: frontmatter.sticky,
        article: frontmatter.article,
        category: page.data.category,
        isNote: page.data.isNote,
        banner: frontmatter.banner,
      } as PostItem
    })
  postIndex = [
    ...postIndex
      .filter((post) => post.sticky)
      .sort((left, right) => {
        const leftSticky = isBoolean(left.sticky) ? 1 : (left.sticky as number)
        const rightSticky = isBoolean(right.sticky)
          ? 1
          : (right.sticky as number)
        return leftSticky < rightSticky ? 1 : -1
      }),
    ...postIndex.filter((post) => !post.sticky),
  ]

  let content = `
export const postIndex = ${JSON.stringify(postIndex, null, 2)}
`
  if (app.env.isDev) {
    content += HMR_CODE
  }

  app.writeTemp('internal/postIndex.js', content)
}

export const watchPostIndex = (
  app: App,
  watchers: any[],
  localeOption: PlumeThemeLocaleOptions
): void => {
  const watcher = chokidar.watch('pages/**/*', {
    cwd: app.dir.temp(),
    ignoreInitial: true,
  })
  watcher.on('add', () => preparedPostIndex(app, localeOption))
  watcher.on('change', () => preparedPostIndex(app, localeOption))
  watcher.on('unlink', () => preparedPostIndex(app, localeOption))
  watchers.push(watcher)
}
