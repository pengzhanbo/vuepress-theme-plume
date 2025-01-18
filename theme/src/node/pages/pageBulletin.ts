import type { Page } from 'vuepress/core'
import type { PlumeThemeLocaleOptions, PlumeThemePageData } from '../../shared/index.js'
import { isFunction, isPlainObject } from '@vuepress/helper'

export function enableBulletin(
  page: Page<PlumeThemePageData>,
  options: PlumeThemeLocaleOptions,
) {
  if (isPlainObject(options.bulletin)) {
    const enablePage = options.bulletin.enablePage
    page.data.bulletin = (isFunction(enablePage) ? enablePage(page) : enablePage) ?? true
  }

  if (options.locales?.[page.pathLocale]) {
    const bulletin = options.locales?.[page.pathLocale].bulletin
    if (isPlainObject(bulletin)) {
      const enablePage = bulletin.enablePage
      page.data.bulletin = (isFunction(enablePage) ? enablePage(page) : enablePage) ?? true
    }
  }
}
