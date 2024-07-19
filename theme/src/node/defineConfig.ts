import type { NavItem, NoteItem, NotesOptions, ThemeConfig } from '../shared/index.js'

export function definePlumeNotesConfig(notes: NotesOptions): NotesOptions {
  return notes
}

export function definePlumeNotesItemConfig(item: NoteItem): NoteItem {
  return item
}

export function defineNavbarConfig(navbar: NavItem[]): NavItem[] {
  return navbar
}

/**
 * @deprecated move to `defineNavbarConfig`
 */
export function defineNavbar(navbar: NavItem[]): NavItem[] {
  return navbar
}

export type {
  NotesOptions,
  NoteItem,
  NoteItem as NotesItem,
}

/**
 * 主题配置，在单独的 `plume.config.ts` 中使用的类型帮助函数
 */
export function defineThemeConfig(config: ThemeConfig): ThemeConfig {
  return config
}
