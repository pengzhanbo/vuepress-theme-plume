import type { App } from '@vuepress/core'
import type { PlumeThemeLocaleOptions } from '../../shared'
import { createArchivePage } from './archive'
import { createCategoryPage } from './category'
import { createTagPage } from './tag'

export const createPage = async (
  app: App,
  localeOption: PlumeThemeLocaleOptions
): Promise<void> => {
  await createCategoryPage(app, localeOption)
  await createArchivePage(app, localeOption)
  await createTagPage(app, localeOption)
}
