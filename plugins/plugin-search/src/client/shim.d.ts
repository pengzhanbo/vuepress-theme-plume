declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const comp: ComponentOptions
  export default comp
}

declare module '@internal/minisearchIndex' {
  import type { SearchIndexData } from './composables/searchIndex.js'

  const searchIndex: SearchIndexData
  export {
    searchIndex,
  }
}

declare module 'mark.js/src/vanilla.js' {
  import type Mark from 'mark.js'

  const mark: typeof Mark
  export default mark
}
