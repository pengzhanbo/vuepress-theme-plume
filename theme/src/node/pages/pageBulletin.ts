import type { Page } from 'vuepress/core'
import type { ThemePageData } from '../../shared/index.js'
import { isFunction, isPlainObject } from '@vuepress/helper'
import { getThemeConfig } from '../loadConfig/index.js'

/**
 * Enable bulletin for page
 *
 * 为页面启用公告栏，根据全局或语言环境配置决定是否显示公告栏
 */
export function enableBulletin(
  page: Page<ThemePageData>,
): void {
  const options = getThemeConfig()
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
