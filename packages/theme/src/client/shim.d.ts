declare module '*.vue' {
  import type { ComponentOptions } from 'vue'
  const comp: ComponentOptions
  export default comp
}

declare const __VUEPRESS_DEV__: boolean

declare module '@internal/postIndex.js' {
  import type { PostIndex } from '../shared'
  const postIndex: PostIndex
  export { postIndex }
}
