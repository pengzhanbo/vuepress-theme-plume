declare module '*.vue' {
  import type { ComponentOptions } from 'vue'
  const comp: ComponentOptions
  export default comp
}

declare const __VUEPRESS_DEV__: boolean
declare const __VUEPRESS_SSR__: boolean
declare const __VUE_HMR_RUNTIME__: Record<string, unknown>

declare module '@internal/postIndex' {
  import type { PostIndex } from '../shared'
  const postIndex: PostIndex
  export { postIndex }
}

declare module '@internal/sidebarIndex' {
  import type { SidebarOptions } from '../shared'
  const sidebarIndex: Record<string, SidebarOptions>
  export { sidebarIndex }
}
