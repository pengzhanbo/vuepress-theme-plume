import type { App } from '@vuepress/core'
import { createPage } from '@vuepress/core'
import type { PlumeThemeLocaleOptions } from '../../shared'

export const createArchivePage = async (
  app: App,
  localeOption: PlumeThemeLocaleOptions
): Promise<void> => {
  const { archive } = localeOption
  if (!archive) return
  const archivePage = await createPage(app, {
    path: archive.link,
    frontmatter: {
      pageType: 'archive',
    },
  })
  app.pages.push(archivePage)
}
