import { defineClientConfig } from '@vuepress/client'
import type { CanIUseMode } from '../shared/index.js'
import { resolveCanIUse } from './resolveCanIUse.js'

declare const __CAN_I_USE_INJECT_MODE__: CanIUseMode
declare const __VUEPRESS_SSR__: boolean

const mode = __CAN_I_USE_INJECT_MODE__

export default defineClientConfig({
  enhance({ router }) {
    if (__VUEPRESS_SSR__) return

    router.afterEach((to, from) => {
      if (to.path === from.path) return
      if (mode === 'embed') {
        setTimeout(() => resolveCanIUse(), 1500)
      }
    })
  },
})
