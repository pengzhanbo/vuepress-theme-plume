import type { Ref } from 'vue'
import type { ThemeBaseCollection, ThemeCollectionItem, ThemeDocCollection, ThemePostCollection } from '../../shared/index.js'
import { collections as collectionsRaw } from '@internal/collectionsData'
import { ref, watchEffect } from 'vue'
import { useRouteLocale } from 'vuepress/client'
import { removeLeadingSlash } from 'vuepress/shared'
import { normalizeLink } from '../utils/index.js'
import { useData } from './data.js'

export type CollectionsRef = Ref<Record<string, ThemeCollectionItem[]>>
export type CollectionItemRef<T extends ThemeBaseCollection> = Ref<T | undefined>

export const collectionsRef: CollectionsRef = ref(collectionsRaw)
export const collectionItemRef: CollectionItemRef<ThemeBaseCollection> = ref()

const forceCollection = ref<string | true>()

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateCollections = (data: Record<string, ThemeCollectionItem[]>) => {
    collectionsRef.value = data
  }
}

export const useCollections = (): CollectionsRef => collectionsRef
export const useCollection = <T extends ThemeBaseCollection = ThemeDocCollection>(): CollectionItemRef<T> => collectionItemRef as CollectionItemRef<T>

export function forceUpdateCollection(dir?: string | true): void {
  forceCollection.value = dir
}

export function setupCollection(): void {
  const routeLocale = useRouteLocale()
  const { page } = useData()

  const startWith = (link?: string) => link ? page.value.path.startsWith(normalizeLink(routeLocale.value, removeLeadingSlash(link))) : false

  watchEffect(() => {
    const locale = collectionsRef.value[routeLocale.value]
    collectionItemRef.value = locale?.find((item) => {
      if (forceCollection.value) {
        // if `true`, return first posts
        if (forceCollection.value === true) {
          return item.type === 'post'
        }
        return item.dir === forceCollection.value
      }
      if (page.value.filePathRelative) {
        return page.value.filePathRelative?.startsWith(normalizeLink(routeLocale.value, item.dir).slice(1))
      }
      else {
        const { link, linkPrefix, tagsLink, categoriesLink, archivesLink } = item as ThemePostCollection
        return startWith(link) || startWith(linkPrefix) || startWith(tagsLink) || startWith(categoriesLink) || startWith(archivesLink)
      }
    })
  })
}
