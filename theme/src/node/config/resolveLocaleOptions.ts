import { entries, fromEntries, getLocaleConfig } from '@vuepress/helper'
import type { App } from 'vuepress'
import { LOCALE_OPTIONS } from '../locales/index.js'
import type { PlumeThemeLocaleData, PlumeThemeLocaleOptions } from '../../shared/index.js'

const FALLBACK_OPTIONS: PlumeThemeLocaleData = {
  appearance: true,

  article: '/article/',
  notes: { link: '/', dir: 'notes', notes: [] },
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
      name: 'vuepress-theme-plume',
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
