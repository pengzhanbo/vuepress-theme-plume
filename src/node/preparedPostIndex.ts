import type { App, Page } from '@vuepress/core'
import * as chokidar from 'chokidar'
import * as dayjs from 'dayjs'
import type {
  PlumeThemePageData,
  PlumeThemePostPageFrontmatter,
  PostIndex,
} from '../shared'
import { pageFilter } from './utils/pageFilter'

const HMR_CODE = `
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePostIndex) {
    __VUE_HMR_RUNTIME__.updatePostIndex(postIndex)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ postIndex, ...other }) => {
    __VUE_HMR_RUNTIME__.updatePostIndex(postIndex)
    console.log('other', other)
  })
}
`

export const preparedPostIndex = async function (app: App): Promise<string> {
  const postListIndex: PostIndex = (app.pages as Page<PlumeThemePageData>[])
    .filter((page) => {
      return pageFilter(page)
    })
    .map((page) => {
      return {
        title: page.title,
        path: page.path,
        frontmatter:
          page.frontmatter as unknown as PlumeThemePostPageFrontmatter,
        excerpt: page.excerpt,
        category: page.data.category || [],
      }
    })
    .sort((left, right) => {
      const leftTime = dayjs(left.frontmatter.createTime).unix()
      const rightTime = dayjs(right.frontmatter.createTime).unix()
      return leftTime < rightTime ? 1 : -1
    })
  const topPostIndex = postListIndex.findIndex((post) => !!post.frontmatter.top)
  if (topPostIndex !== -1) {
    postListIndex.unshift(postListIndex.splice(topPostIndex, 1)[0])
  }
  let content = `
export const postIndex = ${JSON.stringify(postListIndex, null, 2)}
  `

  // inject HMR code
  if (app.env.isDev) {
    content += HMR_CODE
  }

  return app.writeTemp('internal/postIndex.js', content)
}

export const watchPostIndex = (app: App, watchers): void => {
  const watcher = chokidar.watch('pages/**/*', {
    cwd: app.dir.temp(),
    ignoreInitial: true,
  })
  watcher.on('add', () => {
    preparedPostIndex(app)
  })
  watcher.on('change', () => {
    preparedPostIndex(app)
  })
  watcher.on('unlink', () => {
    preparedPostIndex(app)
  })
  watchers.push(watcher)
}
