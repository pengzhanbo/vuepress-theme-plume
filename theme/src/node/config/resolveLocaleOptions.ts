import type { App } from 'vuepress'
import type { PlumeThemeData, PlumeThemeLocaleOptions } from '../../shared/index.js'
import { hasOwn, uniq } from '@pengzhanbo/utils'
import { entries, fromEntries, getLocaleConfig, isPlainObject } from '@vuepress/helper'
import { LOCALE_OPTIONS } from '../locales/index.js'
import { THEME_NAME } from '../utils/index.js'

const FALLBACK_OPTIONS: PlumeThemeData = {
  appearance: true,

  blog: {
    pagination: 15,
    postList: true,
    tags: true,
    archives: true,
    categories: true,
    link: '/blog/',
    tagsLink: '/blog/tags/',
    archivesLink: '/blog/archives/',
    categoriesLink: '/blog/categories/',
  },
  article: '/article/',
  notes: { link: '/', dir: '/notes/', notes: [] },
  navbarSocialInclude: ['github', 'twitter', 'discord', 'facebook'],
  aside: true,
  outline: [2, 3],
  externalLinkIcon: true,

  // page meta
  editLink: true,
  contributors: true,
  changelog: false,

  prevPage: true,
  nextPage: true,

  footer: {
    message:
      'Power by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
  },
}

export function resolveLocaleOptions(app: App, { locales, ...options }: PlumeThemeLocaleOptions): PlumeThemeLocaleOptions {
  const resolvedOptions: PlumeThemeLocaleOptions = {
    ...mergeLocaleOptions(FALLBACK_OPTIONS, options),
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
          mergeLocaleOptions(options, opt),
        ]),
      ),
    }),
  }
  return resolvedOptions
}

function mergeLocaleOptions(target: PlumeThemeData, source: PlumeThemeData): PlumeThemeData {
  const res: PlumeThemeData = {}
  const keys = uniq([...Object.keys(target), ...Object.keys(source)]) as (keyof PlumeThemeData)[]
  for (const key of keys) {
    if (hasOwn(source, key)) {
      const value = source[key]
      const targetValue = target[key]
      if (isPlainObject(targetValue) && isPlainObject(value)) {
        res[key] = Object.assign({}, targetValue, value) as any
      }
      else {
        res[key] = value as any
      }
    }
    else {
      res[key] = target[key]
    }
  }
  return res
}
