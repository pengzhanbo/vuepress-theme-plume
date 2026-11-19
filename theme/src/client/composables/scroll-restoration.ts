import type { RouteLocationNormalized } from 'vue-router'
import type { ScrollRestorationSessionEntry } from 'vue-router/experimental'
import { nextTick, onMounted, watch } from 'vue'
import { useScrollRestoration } from 'vue-router/experimental'
import { useRoute, useRouter } from 'vuepress/client'
import { consumeSkippedScrollPosition, inBrowser, resolveAnchorScrollPosition } from '../utils/index.js'

/**
 * 还原一次导航的滚动位置
 *
 * @param entry - Saved positions of the target route / 目标路由保存的位置
 * @param to - Target route / 目标路由
 */
function restoreScroll(
  entry: ScrollRestorationSessionEntry | null | undefined,
  to: RouteLocationNormalized,
): void {
  // 内部同步 hash 引起的导航：还原导航前的位置，页面不移动。
  const skipped = consumeSkippedScrollPosition(to.fullPath)

  if (skipped) {
    window.scrollTo({ ...skipped, behavior: 'instant' })
    return
  }

  // 命中了保存的位置（浏览器前进/后退等）或没有锚点时，保持内置恢复的结果。
  if (entry?.default || !to.hash)
    return

  // 锚点导航：滚动到锚点位置，并补偿导航栏高度。
  const position = resolveAnchorScrollPosition(to.hash)

  if (position)
    window.scrollTo(position)
}

/**
 * Setup the scroll restoration of the theme.
 *
 * Must be called in a `setup()` of the root component.
 *
 * 初始化主题的滚动恢复。
 *
 * 必须在根组件的 `setup()` 中调用。
 */
export function setupScrollRestoration(): void {
  if (!inBrowser)
    return

  const router = useRouter()
  const route = useRoute()
  const { scroll } = useScrollRestoration({
    key: to => `plume:${to.path}${to.hash}`,
    manual: true,
    restore: restoreScroll,
  })

  // VuePress 自带的恢复会先执行，主题的恢复需要在其之后，才能覆盖锚点的滚动目标。
  const restoreLater = (): void => {
    void nextTick(scroll)
  }

  onMounted(restoreLater)

  watch(() => route.fullPath, restoreLater, { flush: 'post' })

  // 页面切换时先关闭平滑滚动，避免新旧页面之间出现滚动动画，导航结束后再恢复。
  router.beforeEach((to, from) => {
    if (from.path !== to.path)
      document.documentElement.classList.remove('smooth')
  })

  let smoothTimer: ReturnType<typeof setTimeout> | undefined

  router.afterEach(() => nextTick(() => {
    clearTimeout(smoothTimer)
    smoothTimer = setTimeout(() => {
      document.documentElement.classList.add('smooth')
    }, 1000)
  }))
}
