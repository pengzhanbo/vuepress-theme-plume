import type { Router } from 'vuepress/client'
import { nextTick } from 'vue'
import { inBrowser } from '../utils/index.js'
import { useScrollPromise } from './scroll-promise.js'

export function enhanceScrollBehavior(router: Router) {
  router.options.scrollBehavior = async (to, from, savedPosition) => {
    await useScrollPromise().wait()
    if (savedPosition)
      return savedPosition
    if (to.hash)
      return { el: to.hash, top: 64 }
    return { top: 0 }
  }

  router.beforeEach(() => {
    if (inBrowser) {
      document.documentElement.classList.remove('smooth')
    }
  })

  router.afterEach(() => nextTick(() => {
    if (inBrowser) {
      document.documentElement.classList.add('smooth')
    }
  }))
}
