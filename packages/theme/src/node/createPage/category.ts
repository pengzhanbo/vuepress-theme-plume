import type { App } from '@vuepress/core'
import { createPage } from '@vuepress/core'
import type { PlumeThemeLocaleOptions } from '../../shared/index.js'

export const createCategoryPage = async (
  app: App,
  localeOption: PlumeThemeLocaleOptions
): Promise<void> => {
  const { category } = localeOption
  if (!category) return
  const categoryPage = await createPage(app, {
    path: category.link,
    frontmatter: {
      pageType: 'category',
    },
  })
  app.pages.push(categoryPage)
}
