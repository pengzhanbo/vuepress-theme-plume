import { path } from '@vuepress/utils'
import type { App, Page } from '@vuepress/core'
import { createPage } from '@vuepress/core'
import type {
  PageCategoryData,
  PlumeThemeLocaleOptions,
  PlumeThemePageData,
} from '../shared/index.js'
import { pathJoin } from './utils.js'
import { resolveLocaleOptions, resolvedAppLocales } from './resolveLocaleOptions.js'

export async function setupPage(
  app: App,
  localeOption: PlumeThemeLocaleOptions,
) {
  const locales = resolvedAppLocales(app)
  const defaultBlog = resolveLocaleOptions(localeOption, 'blog')
  for (const [, locale] of Object.keys(locales).entries()) {
    const blog = resolveLocaleOptions(localeOption, 'blog', locale, false)
    const lang = locales[locale].lang || app.siteData.lang
    const link = blog?.link
      ? blog.link
      : pathJoin('/', locale, defaultBlog?.link || '/blog/')
    const blogPage = await createPage(app, {
      path: link,
      frontmatter: { lang, type: 'blog' },
    })
    app.pages.push(blogPage)

    if (blog?.tags !== false || defaultBlog?.tags !== false) {
      const tagsPage = await createPage(app, {
        path: pathJoin(link, 'tags/'),
        frontmatter: { lang, type: 'blog-tags' },
      })
      app.pages.push(tagsPage)
    }

    if (blog?.archives !== false || defaultBlog?.archives !== false) {
      const archivesPage = await createPage(app, {
        path: pathJoin(link, 'archives/'),
        frontmatter: { lang, type: 'blog-archives' },
      })
      app.pages.push(archivesPage)
    }
  }
}

export function extendsPageData(
  app: App,
  page: Page<PlumeThemePageData>,
  localeOptions: PlumeThemeLocaleOptions,
) {
  page.data.filePathRelative = page.filePathRelative
  page.routeMeta.title = page.title

  if (page.frontmatter.friends) {
    page.frontmatter.article = false
    page.frontmatter.type = 'friends'
    page.data.isBlogPost = false
    page.permalink = page.permalink ?? '/friends/'
  }

  if ((page.frontmatter.type as string)?.startsWith('blog')) {
    page.data.isBlogPost = false
    page.frontmatter.article = false
    page.data.type = page.frontmatter.type as any
  }

  autoCategory(app, page, localeOptions)
  pageContentRendered(page)
}

let uuid = 10000
const cache: Record<string, number> = {}
const RE_CATEGORY = /^(\d+)?(?:\.?)([^]+)$/

export function autoCategory(
  app: App,
  page: Page<PlumeThemePageData>,
  options: PlumeThemeLocaleOptions,
) {
  const pagePath = page.filePathRelative
  if (page.frontmatter.type || !pagePath)
    return
  const locales = Object.keys(resolvedAppLocales(app))
  const notesLinks: string[] = []
  for (const [, locale] of locales.entries()) {
    const notes = options.locales?.[locale]?.notes
    if (notes && notes.link)
      notesLinks.push(path.join(locale, notes.link).replace(/\\+/g, '/'))
  }
  if (notesLinks.some(link => page.path.startsWith(link)))
    return
  const RE_LOCALE = new RegExp(
    `^(${locales.filter(l => l !== '/').join('|')})`,
  )
  const categoryList: PageCategoryData[] = `/${pagePath}`
    .replace(RE_LOCALE, '')
    .replace(/^\//, '')
    .split('/')
    .slice(0, -1)
    .map((category) => {
      const match = category.match(RE_CATEGORY) || []
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
