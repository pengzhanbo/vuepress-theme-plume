import type { App, LocaleConfig } from 'vuepress'
import type {
  CopyCodeLocaleOptions,
  CopyCodeOptions,
} from '../types.js'
import {
  getLocalePaths,
  inferRootLocalePath,
  isPlainObject,
} from '@vuepress/helper'
import { ensureLeadingSlash, resolveLocalePath } from 'vuepress/shared'
import { copyCodeButtonLocales } from './copyCodeButtonLocales.js'

export function createCopyCodeButtonRender(app: App, options?: boolean | CopyCodeOptions): ((filePathRelative: string) => string) | null {
  if (options === false)
    return null

  const { className = 'copy', locales: userLocales = {} }
    = isPlainObject(options) ? options : {}

  const root = inferRootLocalePath(app)
  const locales: LocaleConfig<CopyCodeLocaleOptions> = {
    // fallback locale
    '/': userLocales['/'] || copyCodeButtonLocales[root],
  }

  getLocalePaths(app).forEach((path) => {
    locales[path]
      = userLocales[path] || copyCodeButtonLocales[path === '/' ? root : path]
  })

  return (filePathRelative: string) => {
    const relativePath = ensureLeadingSlash(filePathRelative)
    const localePath = resolveLocalePath(locales, relativePath)
    const { title, copied } = locales[localePath] || locales['/']

    return `<button class="${className}" title="${title}" data-copied="${copied}"></button>`
  }
}
