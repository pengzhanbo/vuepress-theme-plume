import merge from 'lodash.merge'
import type { PlumeThemeLocaleOptions } from '../shared/index.js'

export const defaultLocaleOption: Partial<PlumeThemeLocaleOptions> = {
  article: '/article',
  notes: { link: '/note', dir: 'notes', notes: [] },
  blog: {
    include: ['**/*.md'],
    exclude: ['.vuepress/', 'node_modules/', '{README,index}.md'],
    link: '/blog/',
  },
  footer: {
    message:
      'Power by <a target="_blank" href="https://v2.vuepress.vuejs.org/">Vuepress</a> & <a target="_blank" href="https://github.com/pengzhanbo/vuepress-theme-plume">vuepress-theme-plume</a>',
  },
}

export const mergeLocaleOptions = (options: PlumeThemeLocaleOptions) => {
  return merge(defaultLocaleOption, options)
}
