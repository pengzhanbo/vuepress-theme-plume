import type { App } from '@vuepress/core'
import { deepClone, deepMerge } from '@pengzhanbo/utils'
import type { PlumeThemeLocaleOptions } from '../shared/index.js'
import { pathJoin } from './utils.js'
import { resolveLocaleOptions } from './resolveLocaleOptions.js'

const defaultLocales: NonNullable<PlumeThemeLocaleOptions['locales']> = {
  'en-US': {
    selectLanguageName: 'English',
    selectLanguageText: 'Languages',
    editLinkText: 'Edit this page',
    lastUpdatedText: 'Last Updated',
    contributorsText: 'Contributors',
  },
  'zh-CN': {
    selectLanguageName: '简体中文',
    selectLanguageText: '选择语言',

    blog: { pagination: { prevPageText: '上一页', nextPageText: '下一页' } },

    outlineLabel: '此页内容',
    returnToTopLabel: '返回顶部',
    editLinkText: '编辑此页',
    contributorsText: '贡献者',
    lastUpdatedText: '上次更新',
    prevPageLabel: '上一页',
    nextPageLabel: '下一页',

    notFound: {
      code: '404',
      title: '页面未找到',
      quote: '但是，如果你不改变方向，并且一直寻找，最终可能会到达你要去的地方。',
      linkText: '返回首页',
    },
  },
}

export const fallbackLocaleOption: Partial<PlumeThemeLocaleOptions> = {
  article: '/article/',
  notes: { link: '/note', dir: 'notes', notes: [] },
  appearance: true,
  // page meta
  editLink: true,
  lastUpdated: true,
  contributors: true,
  footer: {
    message:
      'Power by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://github.com/pengzhanbo/vuepress-theme-plume">vuepress-theme-plume</a>',
  },
}

interface PresetLocale {
  home: string
  blog: string
}

const presetLocales: Record<string, PresetLocale> = {
  'zh-CN': {
    home: '首页',
    blog: '博客',
  },
  'en-US': {
    home: 'Home',
    blog: 'Blog',
  },
}

export function mergeLocaleOptions(app: App, options: PlumeThemeLocaleOptions) {
  options.locales ??= {}

  if (options.notes) {
    options.notes = {
      ...fallbackLocaleOption.notes,
      ...(options.notes ?? {}),
    }
  }

  if (options.footer) {
    options.footer = {
      ...fallbackLocaleOption.footer,
      ...options.footer,
    }
  }

  const { locales, ...otherOptions } = options
  locales['/'] ??= {}

  Object.assign(options, {
    ...fallbackLocaleOption,
    ...options,
  })

  Object.assign(locales['/'], {
    ...deepClone(otherOptions),
    ...locales['/'],
  })

  const langs: Record<string, string> = {}
  Object.keys(app.siteData.locales || {}).forEach((locale) => {
    const lang = app.siteData.locales![locale]?.lang || 'en-US'
    langs[locale] = lang
    if (defaultLocales[lang]) {
      locales[locale] = deepMerge(
        {},
        defaultLocales[lang],
        locales[locale] || {},
      )
    }
  })

  const base = app.siteData.base || '/'
  const defaultLang = app.siteData.lang || 'en-US'
  const defaultBlog = resolveLocaleOptions(options, 'blog')
  Object.keys(locales).forEach((locale) => {
    const option = locales[locale]
    const lang = langs[locale] || defaultLang

    // 当用户未配置导航栏时，生成默认导航栏
    if (!option.navbar || !option.navbar.length) {
      option.navbar = [{
        link: pathJoin(base, locale),
        text: presetLocales[lang]?.home || presetLocales[defaultLang].home,
        icon: 'material-symbols:home-outline',
      }]
      const blog = option.blog
      const link = blog?.link
        ? blog.link
        : pathJoin(base, locale, defaultBlog?.link || '/blog/')
      link && option.navbar.push({
        link,
        text: presetLocales[lang]?.blog || presetLocales[defaultLang].blog,
        icon: 'material-symbols:article-outline',
      })
    }
  })

  return options
}
