declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const comp: ComponentOptions
  export default comp
}

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare const __VUEPRESS_DEV__: string

declare module '@internal/articleTagColors' {
  const articleTagColors: Record<string, string>
  export {
    articleTagColors,
  }
}

declare module '@internal/themePlumeData' {
  import type { PlumeThemeData } from '../shared/index.js'

  const themeData: PlumeThemeData
  export {
    themeData,
  }
}

declare module '@internal/postsData' {
  import type { ThemePosts } from '../shared/index.js'

  const postsData: Record<string, ThemePosts>
  export {
    postsData,
  }
}

declare module '@internal/collectionsData' {
  import type { ThemeCollectionItem } from '../shared/index.js'
  const collections: Record<string, ThemeCollectionItem[]>
  export {
    collections,
  }
}

declare module '@internal/sidebar' {
  import type { Sidebar, SidebarItem } from '../shared/index.js'

  const sidebar: {
    __auto__: SidebarItem[] | { link: string, items: SidebarItem[] }
    __home__: Record<string, string>
    [key: string]: Sidebar
  }
  export {
    sidebar,
  }
}

declare module '@internal/encrypt' {

  const encrypt: readonly [
    boolean, // global
    string, // separator
    string, // admin
    string[], // keys
    Record<string, string>, // rules
  ]

  export {
    encrypt,
  }
}

declare module '@internal/iconify' {
  const icons: Record<string, string>
  export {
    icons,
  }
}

declare module 'swiper/css' {
  const res: any
  export default res
}

declare module 'swiper/css/*' {
  const res: any
  export default res
}
