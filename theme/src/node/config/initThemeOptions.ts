import type { App } from 'vuepress'
import type { ThemeOptions } from '../../shared/index.js'
import { hasOwn, uniq } from '@pengzhanbo/utils'
import { entries, fromEntries, getFullLocaleConfig, isPlainObject } from '@vuepress/helper'
import { compatBlogAndNotesToCollections, completeCollections } from '../collections/index.js'
import { LOCALE_OPTIONS } from '../locales/index.js'
import { THEME_NAME } from '../utils/index.js'

const FALLBACK_OPTIONS: ThemeOptions = {
  appearance: true,
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

/**
 * 初始化主题配置，
 * 1. 合并默认配置
 * 2. 合并多语言配置
 */
export function initThemeOptions(app: App, { locales, ...options }: ThemeOptions): ThemeOptions {
  const resolvedOptions: ThemeOptions = {
    ...mergeOptions(FALLBACK_OPTIONS, options),
    locales: getFullLocaleConfig({
      app,
      name: THEME_NAME,
      default: LOCALE_OPTIONS,
      config: fromEntries(
        entries<ThemeOptions>({
          '/': {},
          ...locales,
        }).map(([locale, opt]) => [
          locale,
          mergeOptions(options, opt),
        ]),
      ),
    }),
  }

  // 兼容旧的 blog 、 notes 配置
  compatBlogAndNotesToCollections(resolvedOptions)
  // 补全 collections 可选项
  completeCollections(resolvedOptions)

  return resolvedOptions
}

function mergeOptions(target: ThemeOptions, source: ThemeOptions): ThemeOptions {
  const res: ThemeOptions = {}
  const keys = uniq([...Object.keys(target), ...Object.keys(source)]) as (keyof ThemeOptions)[]
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
