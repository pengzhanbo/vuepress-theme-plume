import { defineClientConfig } from 'vuepress/client'
import type { ClientConfig } from 'vuepress/client'
import { useBaiduTongji } from './composables/index.js'

declare const __VUEPRESS_SSR__: boolean

export default defineClientConfig({
  setup() {
    if (__VUEPRESS_SSR__)
      return

    useBaiduTongji()
  },
}) as ClientConfig
