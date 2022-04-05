import type { PlumeThemeLocaleOptions } from '../shared'

export const defaultLocaleOption: Partial<PlumeThemeLocaleOptions> = {
  article: '/article',
  tag: { text: '标签', link: '/tag' },
  category: { text: '分类', link: '/category' },
  notes: { link: '/note', dir: 'notes', notes: [] },
}
