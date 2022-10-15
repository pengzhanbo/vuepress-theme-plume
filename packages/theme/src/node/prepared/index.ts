import type { App } from '@vuepress/core'
import type { PlumeThemeLocaleOptions } from '../../shared/index.js'
import { preparedPostIndex, watchPostIndex } from './postIndex.js'
import { preparedSidebarIndex, watchSidebarIndex } from './sidebarIndex.js'

export const onPrepared = (
  app: App,
  localeOption: PlumeThemeLocaleOptions
): void => {
  preparedPostIndex(app, localeOption)
  preparedSidebarIndex(app, localeOption)
}

export const preparedWatch = (
  app: App,
  watchers: any[],
  localeOption: PlumeThemeLocaleOptions
): void => {
  watchPostIndex(app, watchers, localeOption)
  watchSidebarIndex(app, watchers, localeOption)
}
