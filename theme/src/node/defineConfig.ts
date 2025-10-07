import type { ThemeCollectionItem, ThemeCollections, ThemeConfig, ThemeNavItem } from '../shared/index.js'

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
 * @deprecated 使用 `defineCollections` 代替
 */
export function defineNotesConfig(notes: unknown): unknown {
  return notes
}

/**
 * 主题 notes item 配置帮助函数
 * @deprecated 使用 `defineCollection` 代替
 */
export function defineNoteConfig(note: unknown): unknown {
  return note
}

/**
 * 主题 collections 配置帮助函数
 */
export function defineCollections(collections: ThemeCollections): ThemeCollections {
  return collections
}

/**
 * 主题 collections item 配置帮助函数
 */
export function defineCollection(collection: ThemeCollectionItem): ThemeCollectionItem {
  return collection
}
