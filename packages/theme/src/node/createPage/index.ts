import type { App } from '@vuepress/core'
import type { PlumeThemeLocaleOptions } from '../../shared/index.js'
import { createArchivePage } from './archive.js'
import { createCategoryPage } from './category.js'
import { createTagPage } from './tag.js'

export const createPage = async (
  app: App,
  localeOption: PlumeThemeLocaleOptions
): Promise<void> => {
  await createCategoryPage(app, localeOption)
  await createArchivePage(app, localeOption)
  await createTagPage(app, localeOption)
}
