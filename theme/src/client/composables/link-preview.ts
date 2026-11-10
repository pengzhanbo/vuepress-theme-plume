import type { ComputedRef, ShallowRef } from 'vue'
import type { LinkPreviewOptions, ThemeLinkPreviewItem } from '../../shared/index.js'
import type { PreviewRect, PreviewSize } from '../utils/link-preview.js'
import { computed, onMounted, onScopeDispose, shallowRef, watch } from 'vue'
import { useSiteData } from 'vuepress/client'
import { normalizePreviewPath, resolveAnchorKey, toPreviewRect } from '../utils/link-preview.js'
import { useData } from './data.js'

const DEFAULT_DELAY = 150
/** 隐藏延迟，仅用于消除相邻链接之间移动时的闪烁 */
const HIDE_DELAY = 100
/** 默认的触发链接选择器 */
const DEFAULT_SELECTOR = '.vp-doc a[href]'

/** 鼠标按下后紧接着的聚焦事件会被忽略，避免点击链接后卡片在跳转前重新出现 */
const FOCUS_SUPPRESS_MS = 300

/** 当前可见的内链预览状态 */
export interface LinkPreviewActive {
  /**
   * Normalized route path of the target page
   *
   * 目标页路由
   */
  key: string
  /**
   * Item written at build time
   *
   * 构建期写入的预览项
   */
  item: ThemeLinkPreviewItem
  /**
   * Bounding rect of the trigger
   *
   * 触发链接的包围盒
   */
  rect: PreviewRect
}

/**
 * Result of `useLinkPreview()`.
 *
 * `useLinkPreview()` 的返回值。
 */
export interface UseLinkPreviewResult {
  /**
   * Whether the feature is enabled
   *
   * 功能是否启用
   */
  enabled: ComputedRef<boolean>
  /**
   * Current active preview, `null` when hidden
   *
   * 当前预览，隐藏时为 `null`
   */
  active: ShallowRef<LinkPreviewActive | null>
  /**
   * Raw options with `true` normalized to `{}`
   *
   * 原始配置（`true` 归一为 `{}`）
   */
  options: ComputedRef<LinkPreviewOptions>
  /**
   * Current viewport size, only tracked while the feature is enabled
   *
   * 当前视口尺寸，仅在功能开启时跟踪
   */
  viewport: ShallowRef<PreviewSize>
}

const active = shallowRef<LinkPreviewActive | null>(null)

/**
 * Viewport size, updated by the controller listeners so that no listener is bound
 * while the feature is disabled.
 *
 * 视口尺寸，由控制器的监听更新，使功能关闭时不绑定任何监听。
 */
const viewport = shallowRef<PreviewSize>({ width: 0, height: 0 })

let currentAnchor: HTMLAnchorElement | null = null
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null
let frame = 0
let suppressFocusUntil = 0

interface PreviewContext {
  base: () => string
  currentKey: () => string
  previews: () => Record<string, ThemeLinkPreviewItem> | undefined
}

/**
 * Runtime context provided by the controller.
 *
 * 由控制器提供的运行时上下文。
 */
let context: PreviewContext | null = null

function clearShow(): void {
  if (showTimer !== null) {
    clearTimeout(showTimer)
    showTimer = null
  }
}

function clearHide(): void {
  if (hideTimer !== null) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

/**
 * Hide the preview immediately and reset the hover state.
 *
 * 立即隐藏预览并重置悬停状态。
 */
export function hideLinkPreview(): void {
  clearShow()
  clearHide()
  currentAnchor = null
  active.value = null
}

function resolvePreviewKey(anchor: HTMLAnchorElement): string | null {
  if (!context)
    return null

  return resolveAnchorKey(
    anchor.getAttribute('href'),
    context.base(),
    context.currentKey(),
    window.location.origin,
  )
}

function isPreviewableAnchor(anchor: HTMLAnchorElement, selector: string): boolean {
  if (!anchor.matches(selector))
    return false
  if (anchor.hasAttribute('data-no-link-preview') || anchor.classList.contains('no-link-preview'))
    return false
  if (anchor.hasAttribute('download'))
    return false

  return resolvePreviewKey(anchor) !== null
}

function syncViewport(): void {
  if (typeof window === 'undefined')
    return

  viewport.value = { width: window.innerWidth, height: window.innerHeight }
}

function showAnchor(anchor: HTMLAnchorElement): void {
  const key = resolvePreviewKey(anchor)
  if (!key)
    return hideLinkPreview()

  const item = context?.previews()?.[key]
  // 无数据：静默不显示
  if (!item)
    return hideLinkPreview()

  syncViewport()
  active.value = { key, item, rect: toPreviewRect(anchor.getBoundingClientRect()) }
}

function scheduleShow(anchor: HTMLAnchorElement, delay: number): void {
  clearShow()

  if (delay <= 0) {
    showAnchor(anchor)
    return
  }

  showTimer = setTimeout(() => {
    showTimer = null
    if (currentAnchor === anchor && anchor.isConnected)
      showAnchor(anchor)
  }, delay)
}

function scheduleHide(): void {
  clearShow()
  clearHide()

  hideTimer = setTimeout(() => {
    hideTimer = null
    hideLinkPreview()
  }, HIDE_DELAY)
}

function scheduleReposition(): void {
  if (frame || !active.value)
    return

  frame = requestAnimationFrame(() => {
    frame = 0

    const anchor = currentAnchor
    const state = active.value
    if (!anchor || !state)
      return

    if (!anchor.isConnected)
      return hideLinkPreview()

    const rect = anchor.getBoundingClientRect()

    // 触发元素滚出视口则隐藏
    if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth)
      return hideLinkPreview()

    active.value = { ...state, rect: toPreviewRect(rect) }
  })
}

/**
 * Use link preview
 *
 * 读取内链预览状态。
 */
export function useLinkPreview(): UseLinkPreviewResult {
  const { theme, frontmatter } = useData()

  const value = computed(() => theme.value.linkPreview)

  const options = computed<LinkPreviewOptions>(() =>
    typeof value.value === 'object' && value.value ? value.value : {},
  )

  const enabled = computed(() =>
    !!value.value && frontmatter.value.linkPreview !== false,
  )

  return { enabled, active, options, viewport }
}

/**
 * Show the preview of a given anchor manually
 *
 * 手动展示某条链接的预览
 *
 * @param anchor - Trigger anchor / 触发链接
 */
export function showLinkPreview(anchor: HTMLAnchorElement): void {
  if (!context)
    return

  currentAnchor = anchor
  clearHide()
  showAnchor(anchor)
}

/**
 * Bind the global listeners, called once from the client config `setup()`
 *
 * 绑定全局监听，在客户端配置的 `setup()` 中调用一次。
 */
export function setupLinkPreview(): void {
  const { enabled, options } = useLinkPreview()
  const { page } = useData()
  const site = useSiteData()

  const base = computed(() => site.value.base || '/')
  const currentKey = computed(() => normalizePreviewPath(page.value.path))
  const selector = computed(() => options.value.selector || DEFAULT_SELECTOR)

  context = {
    base: () => base.value,
    currentKey: () => currentKey.value,
    previews: () => page.value.linkPreviews,
  }

  let bound = false

  function onPointerOver(event: PointerEvent): void {
    // 触摸 / 触控笔不启用
    if (event.pointerType && event.pointerType !== 'mouse')
      return

    const target = event.target as Element | null
    if (!target || typeof target.closest !== 'function')
      return

    const anchor = target.closest<HTMLAnchorElement>('a[href]')
    if (!anchor)
      return

    if (anchor === currentAnchor) {
      clearHide()
      return
    }

    if (!isPreviewableAnchor(anchor, selector.value))
      return

    currentAnchor = anchor
    clearHide()

    if (active.value) {
      clearShow()
      showAnchor(anchor)
    }
    else {
      scheduleShow(anchor, options.value.delay ?? DEFAULT_DELAY)
    }
  }

  function onPointerOut(event: PointerEvent): void {
    const anchor = currentAnchor
    if (!anchor)
      return

    const target = event.target as Node | null
    const related = event.relatedTarget as Node | null

    // 在链接内部移动：不隐藏
    if (related && anchor.contains(related))
      return
    // 不是离开当前链接：不处理
    if (target && target !== anchor && !anchor.contains(target))
      return

    scheduleHide()
  }

  function onFocusIn(event: FocusEvent): void {
    if (Date.now() < suppressFocusUntil)
      return

    const target = event.target as Element | null
    if (!target || typeof target.closest !== 'function')
      return

    const anchor = target.closest<HTMLAnchorElement>('a[href]')
    if (!anchor || anchor === currentAnchor || !isPreviewableAnchor(anchor, selector.value))
      return

    currentAnchor = anchor
    clearHide()
    scheduleShow(anchor, options.value.focusDelay ?? 0)
  }

  function onFocusOut(event: FocusEvent): void {
    if (currentAnchor && event.target === currentAnchor)
      hideLinkPreview()
  }

  function onMouseDown(): void {
    suppressFocusUntil = Date.now() + FOCUS_SUPPRESS_MS
    hideLinkPreview()
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape')
      hideLinkPreview()
  }

  function onViewportChange(): void {
    syncViewport()
    scheduleReposition()
  }

  function bind(): void {
    if (bound || typeof document === 'undefined')
      return

    bound = true
    syncViewport()

    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('pointerout', onPointerOut, { passive: true })
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    document.addEventListener('mousedown', onMouseDown, true)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onViewportChange, { passive: true, capture: true })
    window.addEventListener('resize', onViewportChange, { passive: true })
  }

  function unbind(): void {
    if (!bound || typeof document === 'undefined')
      return

    bound = false

    document.removeEventListener('pointerover', onPointerOver)
    document.removeEventListener('pointerout', onPointerOut)
    document.removeEventListener('focusin', onFocusIn)
    document.removeEventListener('focusout', onFocusOut)
    document.removeEventListener('mousedown', onMouseDown, true)
    document.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('scroll', onViewportChange, true)
    window.removeEventListener('resize', onViewportChange)
  }

  onMounted(() => {
    if (enabled.value)
      bind()
  })

  watch(enabled, (value) => {
    if (value)
      bind()
    else
      unbind()
  })

  // 路由切换 / 目标页数据变化：立即隐藏
  watch(() => page.value.path, hideLinkPreview)
  watch(() => page.value.linkPreviews, hideLinkPreview)

  onScopeDispose(() => {
    unbind()
    clearShow()
    clearHide()

    if (frame) {
      cancelAnimationFrame(frame)
      frame = 0
    }

    currentAnchor = null
    active.value = null
    context = null
  })
}
