import type { PlumeThemeLocaleOptions } from '../shared/index.js'

export const defaultLocaleOption: Partial<PlumeThemeLocaleOptions> = {
  article: '/article',
  notes: { link: '/note', dir: 'notes', notes: [] },
  footer: {
    message:
      'Power by <a target="_blank" href="https://v2.vuepress.vuejs.org/">vuepress</a> & <a target="_blank" href="https://github.com/pengzhanbo/vuepress-theme-plume">vuepress-theme-plume</a>',
  },
  appearance: true,
  // page meta
  editLink: true,
  editLinkText: 'Edit this page',
  lastUpdated: true,
  lastUpdatedText: 'Last Updated',
  contributors: true,
  contributorsText: 'Contributors',
}

export const mergeLocaleOptions = (options: PlumeThemeLocaleOptions) => {
  if (!options.locales) {
    options.locales = {}
  }
  if (options.notes) {
    options.notes = {
      ...defaultLocaleOption.notes,
      ...(options.notes ?? {}),
    }
  }

  if (options.footer) {
    options.footer = {
      ...defaultLocaleOption.footer,
      ...options.footer,
    }
  }

  const { locales, ...otherOptions } = options

  if (!locales['/']) {
    locales['/'] = {}
  }
  Object.assign(options, {
    ...defaultLocaleOption,
    ...options,
  })

  Object.assign(locales['/'], {
    ...{ selectLanguageName: 'English' },
    ...JSON.parse(JSON.stringify(otherOptions)),
    ...locales['/'],
  })

  return options
}
