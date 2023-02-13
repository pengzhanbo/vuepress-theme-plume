import merge from 'lodash.merge'
import type { PlumeThemeLocaleOptions } from '../shared/index.js'

export const defaultLocaleOption: Partial<PlumeThemeLocaleOptions> = {
  article: '/article',
  notes: { link: '/note', dir: 'notes', notes: [] },
}

export const mergeLocaleOptions = (options: PlumeThemeLocaleOptions) => {
  return merge(defaultLocaleOption, options)
}
