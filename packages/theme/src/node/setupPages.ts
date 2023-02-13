import type { App, Page } from '@vuepress/core'
import { createPage } from '@vuepress/core'
import type {
  PageCategoryData,
  PlumeThemeLocaleOptions,
  PlumeThemePageData,
} from '../shared/index.js'

export async function setupPage(app: App) {
  const blogPage = await createPage(app, {
    path: '/blog/',
  })
  const productPage = await createPage(app, {
    path: '/product/',
  })

  app.pages.push(blogPage, productPage)
}

let uuid = 10000
const cache: Record<string, number> = {}

export function autoCategory(
  page: Page<PlumeThemePageData>,
  options: PlumeThemeLocaleOptions
) {
  const pagePath = page.filePathRelative
  if (page.data.type || !pagePath) return

  const { notes } = options
  if (notes && notes.link && page.path.startsWith(notes.link)) return
  const categoryList: PageCategoryData[] = pagePath
    .split('/')
    .slice(0, -1)
    .map((category) => {
      const match = category.match(/^(\d+)?(?:\.?)([^]+)$/) || []
      !cache[match[2]] && !match[1] && (cache[match[2]] = uuid++)
      return {
        type: Number(match[1] || cache[match[2]]),
        name: match[2],
      }
    })
  page.data.categoryList = categoryList
}

export function pageContentRendered(page: Page<PlumeThemePageData>) {
  const EXCERPT_SPLIT = '<!-- more -->'
  if (page.data.isBlogPost && page.contentRendered.includes(EXCERPT_SPLIT)) {
    const [excerpt, content] = page.contentRendered.split(EXCERPT_SPLIT)
    page.contentRendered = `<div class="excerpt">${excerpt}</div>${EXCERPT_SPLIT}${content}`
  }
}
