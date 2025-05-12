import type { Router } from 'vuepress/client'
import { nextTick } from 'vue'
import { inBrowser } from '../utils/index.js'
import { useScrollPromise } from './scroll-promise.js'

export function enhanceScrollBehavior(router: Router): void {
  router.options.scrollBehavior = async (to, from, savedPosition) => {
    await useScrollPromise().wait()
    if (savedPosition)
      return savedPosition
    if (to.hash)
      return { el: to.hash, top: 64 }
    return { top: 0 }
  }

  router.beforeEach((to, from) => {
    if (inBrowser) {
      if (from.path !== to.path)
        document.documentElement.classList.remove('smooth')
    }
  })

  router.afterEach(() => nextTick(() => {
    if (inBrowser) {
      setTimeout(() => {
        document.documentElement.classList.add('smooth')
      }, 1000)
    }
  }))
}
