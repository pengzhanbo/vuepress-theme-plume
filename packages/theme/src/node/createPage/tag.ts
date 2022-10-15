import type { App } from '@vuepress/core'
import { createPage } from '@vuepress/core'
import type { PlumeThemeLocaleOptions } from '../../shared/index.js'

export const createTagPage = async (
  app: App,
  localeOption: PlumeThemeLocaleOptions
): Promise<void> => {
  const { tag } = localeOption
  if (!tag) return
  const tagPage = await createPage(app, {
    path: tag.link,
    frontmatter: {
      pageType: 'tag',
    },
  })
  app.pages.push(tagPage)
}
