import type { ThemeCollectionItem, ThemeOptions } from '../../shared/index.js'
import { normalizePath } from '../utils/index.js'

export function completeCollections(options: ThemeOptions): void {
  if (options.collections?.length) {
    for (const collection of options.collections) {
      completeCollectionItems(collection)
    }
  }

  for (const [, opt] of Object.entries(options.locales || {})) {
    if (opt.collections?.length) {
      for (const collection of opt.collections) {
        completeCollectionItems(collection)
      }
    }
  }
}

function completeCollectionItems(collection: ThemeCollectionItem): void {
  collection.title ||= collection.dir.split('/').filter(Boolean).pop()!
  if (collection.type === 'post') {
    collection.link ||= normalizePath(`/${collection.dir}/`)
    collection.linkPrefix ||= collection.link
    collection.tags ??= true
    collection.tags && (collection.tagsLink ||= `${collection.linkPrefix}tags/`)
    collection.archives ??= true
    collection.archives && (collection.archivesLink ||= `${collection.linkPrefix}archives/`)
    collection.categories ??= true
    collection.categories && (collection.categoriesLink ||= `${collection.linkPrefix}categories/`)
  }
  else {
    collection.linkPrefix ||= normalizePath(`/${collection.dir}/`)
  }
}
