import type { NavItem, NoteItem, NotesOptions } from '../shared/index.js'
import type { ThemeConfig } from './types.js'

export type {
  NoteItem,
  NoteItem as NotesItem,
  NotesOptions,
}

/**
 * 主题配置，在单独的 `plume.config.ts` 中使用的类型帮助函数
 */
export function defineThemeConfig(config: ThemeConfig): ThemeConfig {
  return config
}

/**
 * 主题导航栏配置帮助函数
 */
export function defineNavbarConfig(navbar: NavItem[]): NavItem[] {
  return navbar
}

/**
 * 主题 notes 配置帮助函数
 */
export function defineNotesConfig(notes: NotesOptions): NotesOptions {
  return notes
}

/**
 * 主题 notes item 配置帮助函数
 */
export function defineNoteConfig(note: NoteItem): NoteItem {
  return note
}

/**
 * @deprecated use `defineNotesConfig` instead
 */
export function definePlumeNotesConfig(notes: NotesOptions): NotesOptions {
  return notes
}

/**
 * @deprecated use `defineNoteConfig` instead
 */
export function definePlumeNotesItemConfig(item: NoteItem): NoteItem {
  return item
}

/**
 * @deprecated move to `defineNavbarConfig`
 */
export function defineNavbar(navbar: NavItem[]): NavItem[] {
  return navbar
}
