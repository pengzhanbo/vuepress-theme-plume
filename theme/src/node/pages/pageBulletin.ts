import type { Page } from 'vuepress/core'
import type { BulletinOptions, PlumeThemeLocaleOptions, PlumeThemePageData } from '../../shared/index.js'
import { isPlainObject } from '@vuepress/helper'

export function enableBulletin(
  page: Page<PlumeThemePageData>,
  options: PlumeThemeLocaleOptions,
) {
  let enablePage: BulletinOptions['enablePage']
  if (isPlainObject(options.bulletin) && options.bulletin.enablePage) {
    enablePage = options.bulletin.enablePage
  }
  else if (options.locales) {
    for (const locale of Object.keys(options.locales)) {
      if (isPlainObject(options.locales[locale].bulletin) && options.locales[locale].bulletin.enablePage) {
        enablePage = options.locales[locale].bulletin.enablePage
        break
      }
    }
  }

  if (typeof enablePage === 'function') {
    page.data.bulletin = enablePage(page) ?? true
  }

  else {
    page.data.bulletin = enablePage ?? !!options.bulletin
  }
}
