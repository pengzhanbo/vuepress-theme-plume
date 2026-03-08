import type { Ref } from 'vue'
import { onUnmounted, readonly, ref, watch } from 'vue'
import { inBrowser } from '../utils/index.js'

/**
 * Options for useFlyout composable.
 *
 * useFlyout 组合式函数的选项。
 */
interface UseFlyoutOptions {
  /** Element to track focus for / 要跟踪焦点的元素 */
  el: Ref<HTMLElement | undefined>
  /** Callback when element gains focus / 元素获得焦点时的回调 */
  onFocus?: () => void
  /** Callback when element loses focus / 元素失去焦点时的回调 */
  onBlur?: () => void
}

/**
 * Currently focused element reference.
 * Shared across all flyout instances.
 *
 * 当前聚焦元素的引用。
 * 在所有弹出框实例之间共享。
 */
export const focusedElement: Ref<HTMLElement | undefined> = ref()

let active = false
let listeners = 0

/**
 * Use flyout focus tracking.
 * Tracks focus state for dropdown menus and flyout components.
 *
 * 弹出框焦点跟踪。
 * 跟踪下拉菜单和弹出框组件的焦点状态。
 *
 * @param options - Flyout options / 弹出框选项
 * @returns Readonly reference to focus state / 焦点状态的只读引用
 */
export function useFlyout(options: UseFlyoutOptions): Readonly<Ref<boolean>> {
  const focus = ref(false)

  if (inBrowser) {
    if (!active) {
      activateFocusTracking()
    }

    listeners++

    const unwatch = watch(focusedElement, (el) => {
      if (el === options.el.value || options.el.value?.contains(el!)) {
        focus.value = true
        options.onFocus?.()
      }
      else {
        focus.value = false
        options.onBlur?.()
      }
    })

    onUnmounted(() => {
      unwatch()

      listeners--

      if (!listeners)
        deactivateFocusTracking()
    })
  }

  return readonly(focus)
}

/**
 * Activate global focus tracking.
 * Adds focusin event listener to document.
 *
 * 激活全局焦点跟踪。
 * 向文档添加 focusin 事件监听器。
 */
function activateFocusTracking() {
  document.addEventListener('focusin', handleFocusIn)
  active = true
  focusedElement.value = document.activeElement as HTMLElement
}

/**
 * Deactivate global focus tracking.
 * Removes focusin event listener from document.
 *
 * 停用全局焦点跟踪。
 * 从文档移除 focusin 事件监听器。
 */
function deactivateFocusTracking() {
  document.removeEventListener('focusin', handleFocusIn)
}

/**
 * Handle focusin event.
 * Updates the focused element reference.
 *
 * 处理 focusin 事件。
 * 更新聚焦元素引用。
 */
function handleFocusIn() {
  focusedElement.value = document.activeElement as HTMLElement
}
