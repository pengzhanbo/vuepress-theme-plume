import { nextTick } from 'vue'
import type { Router } from 'vuepress/client'
import { inBrowser } from '../utils/index.js'
import { useScrollPromise } from './scroll-promise.js'

export function enhanceScrollBehavior(router: Router) {
  // handle scrollBehavior with transition
  const scrollBehavior = router.options.scrollBehavior!
  router.options.scrollBehavior = async (...args) => {
    await useScrollPromise().wait()
    return scrollBehavior(...args)
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
