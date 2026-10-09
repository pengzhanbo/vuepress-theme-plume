import type { Ref } from 'vue'
import { ref } from 'vue'

/**
 * Loading status of an iframe embed.
 *
 * iframe 嵌入的加载状态。
 */
export type EmbedStatus = 'loading' | 'loaded' | 'error'

/**
 * Controller returned by {@link createEmbedStatus}.
 *
 * {@link createEmbedStatus} 返回的状态控制器。
 */
export interface EmbedStatusController {
  /** Current status / 当前状态 */
  status: Ref<EmbedStatus>
  /** Start the timeout guard / 启动超时保护 */
  start: () => void
  /** Mark the embed as loaded / 标记嵌入已加载完成 */
  markLoaded: () => void
  /** Mark the embed as failed / 标记嵌入加载失败 */
  markError: () => void
  /** Cancel the pending timeout / 取消未触发的超时 */
  dispose: () => void
}

/**
 * Create a status controller for an iframe embed.
 *
 * 创建一个 iframe 嵌入的状态控制器。
 *
 * A cross-origin iframe rarely reports a useful `error` event: a removed embed,
 * a region restriction or a CSP block is usually swallowed by the browser, which
 * keeps firing `load` or nothing at all. The controller therefore relies on a
 * timeout guard so a broken embed degrades to a visible error state instead of
 * an endless blank box or spinner. A `load` that arrives after the timeout still
 * recovers the frame to `loaded`.
 *
 * 跨域 iframe 几乎不会上报有意义的 `error` 事件：被删除、区域限制或 CSP 拦截通常被
 * 浏览器静默吞掉（仍触发 `load` 或什么都不触发）。因此这里用超时保护来兜底，
 * 让损坏的嵌入退化为可见的错误状态，而不是永久空白或永久 loading；
 * 超时之后才到达的 `load` 仍会把状态恢复为 `loaded`。
 *
 * @param timeout - Timeout in milliseconds; `<= 0` disables the guard / 超时时间（毫秒），`<= 0` 表示禁用
 */
export function createEmbedStatus(timeout: number): EmbedStatusController {
  const status = ref<EmbedStatus>('loading')
  let timer: ReturnType<typeof setTimeout> | undefined

  function clearTimer(): void {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  return {
    status,
    start() {
      clearTimer()
      if (timeout > 0) {
        timer = setTimeout(() => {
          // `load` 已触发则不覆盖；否则判定为加载失败。
          // Keep the loaded state; otherwise treat it as a failure.
          if (status.value === 'loading')
            status.value = 'error'
        }, timeout)
      }
    },
    markLoaded() {
      clearTimer()
      status.value = 'loaded'
    },
    markError() {
      clearTimer()
      status.value = 'error'
    },
    dispose: clearTimer,
  }
}
