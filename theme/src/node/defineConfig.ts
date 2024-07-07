import type {
  NotesDataOptions,
  NotesItemOptions,
} from '@vuepress-plume/plugin-notes-data'
import type { NavItem } from '../shared/index.js'
import type { ThemeConfig } from '../shared/theme-data.js'

export function definePlumeNotesConfig(notes: NotesDataOptions): NotesDataOptions {
  return notes
}

export function definePlumeNotesItemConfig(item: NotesItemOptions): NotesItemOptions {
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
  NotesDataOptions,
  NotesItemOptions,
  NotesItemOptions as NotesItem,
}

/**
 * 主题配置，在单独的 `plume.config.ts` 中使用的类型帮助函数
 */
export function defineThemeConfig(config: ThemeConfig): ThemeConfig {
  return config
}
