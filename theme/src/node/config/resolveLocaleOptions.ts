import { entries, fromEntries, getLocaleConfig } from '@vuepress/helper'
import type { App } from 'vuepress'
import { LOCALE_OPTIONS } from '../locales/index.js'
import type { PlumeThemeLocaleData, PlumeThemeLocaleOptions } from '../../shared/index.js'
import { THEME_NAME } from '../utils.js'

const FALLBACK_OPTIONS: PlumeThemeLocaleData = {
  appearance: true,

  blog: { link: '/blog/', pagination: { perPage: 15 }, tags: true, archives: true, tagsLink: '/blog/tags/', archivesLink: '/blog/archives/' },
  article: '/article/',
  notes: { link: '/', dir: '/notes/', notes: [] },
  navbarSocialInclude: ['github', 'twitter', 'discord', 'facebook'],

  // page meta
  editLink: true,
  contributors: true,

}

export function resolveLocaleOptions(app: App, { locales, ...options }: PlumeThemeLocaleOptions): PlumeThemeLocaleOptions {
  const resolvedOptions: PlumeThemeLocaleOptions = {
    ...FALLBACK_OPTIONS,
    ...options,
    locales: getLocaleConfig({
      app,
      name: THEME_NAME,
      default: LOCALE_OPTIONS,
      config: fromEntries(
        entries<PlumeThemeLocaleOptions>({
          '/': {},
          ...locales,
        }).map(([locale, opt]) => [
          locale,
          { ...options, ...opt },
        ]),
      ),
    }),
  }
  return resolvedOptions
}
