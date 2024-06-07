declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const comp: ComponentOptions
  export default comp
}

declare const __VUEPRESS_DEV__: string

declare module '@internal/articleTagColors' {
  const articleTagColors: Record<string, string>
  export {
    articleTagColors,
  }
}
