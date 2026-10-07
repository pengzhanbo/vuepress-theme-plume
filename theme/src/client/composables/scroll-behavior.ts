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

  // 同一时刻只保留一个定时器：连续快速跳转时不应堆积多个 1000ms 定时器。
  // Keep a single timer, so rapid consecutive navigations do not pile up 1000ms timers.
  let smoothTimer: ReturnType<typeof setTimeout> | undefined

  router.afterEach(() => nextTick(() => {
    if (inBrowser) {
      clearTimeout(smoothTimer)
      smoothTimer = setTimeout(() => {
        document.documentElement.classList.add('smooth')
      }, 1000)
    }
  }))
}
