import type { App } from 'vuepress'
import { resolveThemeData } from '../config/resolveThemeData.js'
import { resolveContent, writeTemp } from '../utils/index.js'
import type { PlumeThemeLocaleOptions } from '../../shared/index.js'

export async function prepareThemeData(app: App, localeOptions: PlumeThemeLocaleOptions): Promise<void> {
  const resolvedThemeData = resolveThemeData(app, localeOptions)

  const content = resolveContent(app, { name: 'themeData', content: resolvedThemeData })
  await writeTemp(app, 'internal/themePlumeData.js', content)
}
