import type { ThemeConfig, ThemeNavItem, ThemeNote, ThemeNoteListOptions } from '../shared/index.js'

/**
 * 主题配置，在单独的 `plume.config.ts` 中使用的类型帮助函数
 */
export function defineThemeConfig(config: ThemeConfig): ThemeConfig {
  return config
}

/**
 * 主题导航栏配置帮助函数
 */
export function defineNavbarConfig(navbar: ThemeNavItem[]): ThemeNavItem[] {
  return navbar
}

/**
 * 主题 notes 配置帮助函数
 */
export function defineNotesConfig(notes: ThemeNoteListOptions): ThemeNoteListOptions {
  return notes
}

/**
 * 主题 notes item 配置帮助函数
 */
export function defineNoteConfig(note: ThemeNote): ThemeNote {
  return note
}
