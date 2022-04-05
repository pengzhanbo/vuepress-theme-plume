import type { PlumeThemeLocaleOptions } from '../shared'

export const defaultLocaleOption: Partial<PlumeThemeLocaleOptions> = {
  home: { text: '首页', link: '/' },
  article: '/article',
  tag: { text: '标签', link: '/tag' },
  category: { text: '分类', link: '/category' },
  notes: { link: '/note', dir: 'notes', notes: [] },
  archive: { link: '/timeline', text: '归档' },
}
