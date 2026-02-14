import type { ThemeCollectionItem, ThemeCollections, ThemeConfig, ThemeNavItem } from '../shared/index.js'

/**
 * Theme configuration helper function, used in separate `plume.config.ts`
 *
 * 主题配置，在单独的 `plume.config.ts` 中使用的类型帮助函数
 */
export function defineThemeConfig(config: ThemeConfig): ThemeConfig {
  return config
}

/**
 * Theme navbar configuration helper function
 *
 * 主题导航栏配置帮助函数
 */
export function defineNavbarConfig(navbar: ThemeNavItem[]): ThemeNavItem[] {
  return navbar
}

/**
 * Theme notes configuration helper function
 *
 * 主题 notes 配置帮助函数
 * @deprecated 使用 `defineCollections` 代替
 */
export function defineNotesConfig(notes: unknown): unknown {
  return notes
}

/**
 * Theme note item configuration helper function
 *
 * 主题 notes item 配置帮助函数
 * @deprecated 使用 `defineCollection` 代替
 */
export function defineNoteConfig(note: unknown): unknown {
  return note
}

/**
 * Theme collections configuration helper function
 *
 * 主题 collections 配置帮助函数
 */
export function defineCollections(collections: ThemeCollections): ThemeCollections {
  return collections
}

/**
 * Theme collection item configuration helper function
 *
 * 主题 collection item 配置帮助函数
 */
export function defineCollection(collection: ThemeCollectionItem): ThemeCollectionItem {
  return collection
}
