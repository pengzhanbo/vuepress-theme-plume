import type { Ref } from 'vue'
import type {
  ThemeBaseCollection,
  ThemeCollectionItem,
  ThemeDocCollection,
  ThemePostCollection,
} from '../../shared/index.js'
import { collections as collectionsRaw } from '@internal/collectionsData'
import { ref, watchEffect } from 'vue'
import { useRouteLocale } from 'vuepress/client'
import { removeLeadingSlash } from 'vuepress/shared'
import { normalizeLink } from '../utils/index.js'
import { useData } from './data.js'

/**
 * Reference type for collections data.
 * Maps locale paths to arrays of collection items.
 *
 * 集合数据的引用类型。
 * 将语言环境路径映射到集合项数组。
 */
export type CollectionsRef = Ref<Record<string, ThemeCollectionItem[]>>

/**
 * Reference type for a single collection item.
 *
 * 单个集合项的引用类型。
 */
export type CollectionItemRef<T extends ThemeBaseCollection> = Ref<T | undefined>

/**
 * Global reference to all collections data.
 *
 * 所有集合数据的全局引用。
 */
export const collectionsRef: CollectionsRef = ref(collectionsRaw)

/**
 * Global reference to the current collection item.
 *
 * 当前集合项的全局引用。
 */
export const collectionItemRef: CollectionItemRef<ThemeBaseCollection> = ref()

const forceCollection = ref<string | true>()

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateCollections = (data: Record<string, ThemeCollectionItem[]>) => {
    collectionsRef.value = data
  }
}

/**
 * Use collections data.
 * Returns the global collections reference.
 *
 * 获取集合数据。
 * 返回全局集合引用。
 *
 * @returns Collections data reference / 集合数据引用
 */
export const useCollections = (): CollectionsRef => collectionsRef

/**
 * Use current collection item.
 * Returns the current collection based on the page context.
 *
 * 获取当前集合项。
 * 根据页面上下文返回当前集合。
 *
 * @template T - Collection type / 集合类型
 * @returns Current collection item reference / 当前集合项引用
 */
export const useCollection = <T extends ThemeBaseCollection = ThemeDocCollection>(): CollectionItemRef<T> => collectionItemRef as CollectionItemRef<T>

/**
 * Force update the current collection.
 * Used to programmatically switch the active collection.
 *
 * 强制更新当前集合。
 * 用于以编程方式切换活动集合。
 *
 * @param dir - Collection directory or true for first posts collection / 集合目录或 true 表示第一个文章集合
 */
export function forceUpdateCollection(dir?: string | true): void {
  forceCollection.value = dir
}

/**
 * Setup collection tracking.
 * Automatically determines the current collection based on route and page path.
 *
 * 设置集合跟踪。
 * 根据路由和页面路径自动确定当前集合。
 */
export function setupCollection(): void {
  const routeLocale = useRouteLocale()
  const { page } = useData()

  const startWith = (link?: string) => link ? page.value.path.startsWith(normalizeLink(routeLocale.value, removeLeadingSlash(link))) : false

  watchEffect(() => {
    const locale = collectionsRef.value[routeLocale.value]

    if (!locale?.length) {
      collectionItemRef.value = undefined
      return
    }

    // When `forceCollection` is set, match it directly without reordering:
    // `true` means "the first posts collection", a string means exact `dir` match.
    // 设置了 `forceCollection` 时，按其值直接匹配且不重新排序：
    // `true` 表示“第一个文章集合”，字符串表示 `dir` 精确匹配。
    if (forceCollection.value) {
      collectionItemRef.value = locale.find(item => forceCollection.value === true
        ? item.type === 'post'
        : item.dir === forceCollection.value)
      return
    }

    // Resolve to the collection with the longest `dir`, so that nested collections
    // (e.g. `blog` and `blog/sub`) always belong to the most specific one, instead of
    // being determined by the declaration order in the config.
    // 归属到 `dir` 最长的集合，使嵌套集合（如 `blog` 与 `blog/sub`）始终归属于最具体的那个，
    // 而不是由配置中的声明顺序决定。
    const sorted = [...locale].sort(
      (a, b) => removeLeadingSlash(b.dir).length - removeLeadingSlash(a.dir).length,
    )

    collectionItemRef.value = sorted.find((item) => {
      if (page.value.filePathRelative) {
        return page.value.filePathRelative?.startsWith(normalizeLink(routeLocale.value, item.dir).slice(1))
      }
      else {
        const { link, linkPrefix, dir, tagsLink, categoriesLink, archivesLink } = item as ThemePostCollection
        return startWith(link) || startWith(linkPrefix) || startWith(dir) || startWith(tagsLink) || startWith(categoriesLink) || startWith(archivesLink)
      }
    })
  })
}
