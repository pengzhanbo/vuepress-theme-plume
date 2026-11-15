import type { ComputedRef, Ref } from 'vue'
import type {
  ReaderAidMode,
  ReaderPreferences,
  ReaderProgressRecord,
  ReaderResumeOptions,
  ReaderWidthPreset,
  ResolvedReaderOptions,
  ThemePageData,
  ThemePageFrontmatter,
} from '../../shared/index.js'
import { useMediaQuery, useStorage, useWindowScroll, useWindowSize } from '@vueuse/core'
import { computed, nextTick, readonly, ref, watch } from 'vue'
import { useRoute } from 'vuepress/client'
import {
  computeReadingProgress,
  hasReaderControls,
  normalizeReaderPreferences,
  pruneRecords,
  READER_DESKTOP_QUERY,
  resolveEffectiveAid,
  resolveEffectiveBrand,
  resolveEffectiveFocus,
  resolveEffectiveTheme,
  resolveEffectiveWidth,
  resolveReaderAidConfig,
  setReaderAttr,
  shouldOfferResume,
} from '../utils/reader.js'
import { inBrowser } from '../utils/shared.js'
import { useData } from './data.js'
import { useEncrypt } from './encrypt.js'

// 继续阅读提示的进度上界：超过该进度视为已读完，再提示没有意义。
const MAX_RESUME_PERCENT = 0.95

// 评估继续阅读提示前的延迟，等待内容稳定。
const RESUME_DELAY = 300

// 进度写入的节流间隔。
const WRITE_THROTTLE = 500

// `popstate` 之后的时间窗口，在此期间的导航视为浏览器的前进/后退，不应提示。
const POPSTATE_WINDOW = 800

// `localStorage` 键前缀，与当前语言的配置保持同步。
const storagePrefix = ref('plume')

/**
 * Whether the viewport is too small for the desktop-only controls.
 *
 * Width, reading aid and focus mode are hidden and fall back to their defaults
 * there: the text already fills the screen, there is no hover, and the navbar is
 * the only way into the navigation drawer.
 *
 * 视口是否小到无法使用桌面专属控件。
 *
 * 小屏上宽度、阅读辅助线与专注模式会被隐藏并回落到默认值：
 * 正文本就铺满、没有 hover，且导航栏是打开导航抽屉的唯一入口。
 */
const mobileViewport = useMediaQuery(READER_DESKTOP_QUERY)
const mobile = computed(() => !mobileViewport.value)

const STORAGE_OPTIONS = { writeDefaults: false, flush: 'sync', onError: () => {} } as const

const readerPreferences = useStorage<ReaderPreferences>(
  computed(() => `${storagePrefix.value}:reader:prefs`),
  {},
  undefined,
  STORAGE_OPTIONS,
)

/**
 * Reading position records, keyed by page path.
 *
 * 以页面路径为键的阅读位置记录。
 */
const readerProgress = useStorage<Record<string, ReaderProgressRecord>>(
  computed(() => `${storagePrefix.value}:reader:progress`),
  {},
  undefined,
  STORAGE_OPTIONS,
)

/**
 * Reading progress of the current page, in `0`–`1`.
 *
 * 当前页的阅读进度，取值 `0`–`1`。
 */
const readingProgress = ref(0)

/**
 * Whether the current document is long enough to be tracked.
 *
 * 当前正文是否足够长、可被追踪。
 */
const readingTrackable = ref(false)

/**
 * Last saved progress of the current page, `null` when there is nothing to offer.
 *
 * 当前页最后保存的进度，没有可提示的内容时为 `null`。
 */
const resumeSaved = ref<number | null>(null)

/**
 * Whether the resume prompt is visible.
 *
 * 继续阅读提示是否可见。
 */
const resumeVisible = ref(false)

// 本次会话中被要求「从头开始」的页面。
const restartedPaths = new Set<string>()

/**
 * Timestamp of the last `popstate` event.
 *
 * 最近一次 `popstate` 的时间戳。
 */
let popStateAt = 0

/**
 * Whether the reader setup already ran (the client `setup` hook runs once).
 *
 * 阅读功能是否已初始化（客户端的 `setup` 钩子只运行一次）。
 */
let installed = false

/**
 * 写入一条阅读位置记录。
 *
 * 整体替换记录表，`useStorage` 只需处理一次变更，且值始终是可直接序列化的普通对象。
 *
 * @param resume - Resume options / 继续阅读配置
 * @param path - Page path / 页面路径
 * @param percent - Progress in `0`–`1` / 进度
 */
function writeRecord(resume: Required<ReaderResumeOptions>, path: string, percent: number): void {
  const now = Date.now()

  readerProgress.value = pruneRecords(
    { ...readerProgress.value, [path]: { p: percent, t: now } },
    resume.max,
    resume.ttl,
    now,
  )
}

/**
 * Resolved reader options of the current locale.
 *
 * Build time already applied every default and dropped the invalid values, the
 * client only reads them.
 *
 * 当前语言已解析的阅读偏好配置。
 *
 * 构建期已应用全部默认值并剔除非法值，客户端只读。
 */
function useReaderOptions(): ComputedRef<ResolvedReaderOptions | null> {
  const { theme } = useData()
  return computed(() => theme.value.readerPreferences ?? null)
}

/**
 * 把当前偏好应用到 `<html>` 上。
 *
 * 配置本身已在构建期归一化，但存储值来自 `localStorage`，属于用户数据：
 * 每次变更都按当前配置再归一化一次，站长收紧配置后遗留的旧值不会进入 DOM。
 *
 * @param options - Resolved options / 已解析的配置
 * @param isDark - Whether the site is in dark mode / 是否深色模式
 * @param mobile - Whether the viewport is a small screen / 是否小屏幕
 * @returns 真正生效的宽度档位与专注模式 / The applied width preset and focus flag
 */
function syncPreferences(
  options: ResolvedReaderOptions | null,
  isDark: boolean,
  mobile: boolean,
): { width: ReaderWidthPreset | null, focus: boolean } {
  const normalized = normalizeReaderPreferences(readerPreferences.value, options)

  if (JSON.stringify(normalized) !== JSON.stringify(readerPreferences.value))
    readerPreferences.value = normalized

  // 小屏上宽度与专注模式一律回落到默认值，属性不写入 DOM。
  // On small screens width and focus mode always fall back to their defaults.
  const width = resolveEffectiveWidth(normalized.width, options, mobile)
  const focus = !!options && resolveEffectiveFocus(normalized.focus, mobile)

  if (inBrowser) {
    const el = document.documentElement

    setReaderAttr(el, 'width', width)
    setReaderAttr(el, 'theme', resolveEffectiveTheme(options?.theme?.presets ?? null, normalized.theme, isDark))
    setReaderAttr(el, 'brand', resolveEffectiveBrand(options?.brand?.presets ?? null, normalized.brand))
    setReaderAttr(el, 'focus', focus ? 'true' : null)
  }

  return { width, focus }
}

/**
 * 布局类偏好变更后唤醒监听 `window.resize` 的组件。
 *
 * 部分内容组件（如 `ECharts`）只监听 `window.resize`，没有 `ResizeObserver`，
 * 因此宽度变更必须显式唤醒它们。多次调用会合并到同一帧。
 */
let resizeFrame = 0
function notifyResize(): void {
  if (!inBrowser || resizeFrame)
    return

  resizeFrame = window.requestAnimationFrame(() => {
    resizeFrame = 0
    window.dispatchEvent(new Event('resize'))
  })
}

/**
 * Encryption state needed to decide whether a page can be tracked.
 *
 * 判断页面是否可被追踪所需的加密状态。
 */
interface EncryptionState {
  /**
   * Whether the current page is encrypted / 当前页是否加密
   */
  hasPageEncrypt: boolean
  /**
   * Whether the current page is decrypted / 当前页是否已解密
   */
  isPageDecrypted: boolean
}

/**
 * Whether the current page should record its reading position.
 *
 * Encrypted pages are skipped until decrypted: `localStorage` is plain text, and
 * neither the length nor the position of an encrypted page should leak.
 *
 * 当前页是否可以记录阅读位置。
 *
 * 加密页在解密前跳过：`localStorage` 是明文，加密页的长度与阅读位置都不应外泄。
 *
 * @param page - Current page / 当前页
 * @param frontmatter - Current frontmatter / 当前 frontmatter
 * @param options - Resolved options / 已解析的配置
 * @param encryption - Encryption state / 加密状态
 */
function canTrack(
  page: ThemePageData,
  frontmatter: ThemePageFrontmatter,
  options: ResolvedReaderOptions | null,
  encryption: EncryptionState,
): boolean {
  if (!options?.resume)
    return false

  if (frontmatter.reader === false)
    return false

  if (!page.path)
    return false

  if (encryption.hasPageEncrypt && !encryption.isPageDecrypted)
    return false

  return readingTrackable.value
}

export function useReaderReadAid() {
  const { theme, collection } = useData<'post', 'doc'>()
  const options = useReaderOptions()

  // 阅读辅助线已并入阅读偏好：新配置优先，旧的集合/主题级 `readAid` 仅作为兜底默认值。
  const aidConfig = computed(() => resolveReaderAidConfig(
    options.value,
    collection.value?.readAid ?? theme.value.readAid,
  ))

  const aid = computed(() => resolveEffectiveAid(
    aidConfig.value,
    readerPreferences.value.aid,
    mobile.value,
  ))

  return { aidConfig, aid }
}

interface ReaderPreferencesResult {
  /** Resolved options of the current locale / 当前语言生效的配置 */
  options: ComputedRef<ResolvedReaderOptions | null>
  /** Current preferences / 当前偏好 */
  prefs: Ref<ReaderPreferences>
  /** Reading aid configuration of the current page, `null` when disabled / 阅读辅助线配置 */
  aidConfig: ComputedRef<{ modes: ReaderAidMode[], default: ReaderAidMode | null } | null>
  /** Reading aid modes offered by the configuration / 可选形态 */
  aidModes: ComputedRef<ReaderAidMode[]>
  /** Reading aid mode that actually applies, `null` means off / 真正生效的形态 */
  aid: ComputedRef<ReaderAidMode | null>
  /** Whether the viewport is too small for the desktop-only controls / 是否为小屏 */
  mobile: ComputedRef<boolean>
  /** Whether the panel has anything to offer on this viewport / 面板是否有可操作项 */
  hasControls: ComputedRef<boolean>
  /** Update one preference, `undefined` removes the key / 更新单项偏好 */
  setPreference: <K extends keyof ReaderPreferences>(key: K, value: ReaderPreferences[K] | undefined) => void
  /** Remove all keys, never write defaults / 恢复默认，直接删除键 */
  reset: () => void
}

/**
 * Use reader preferences.
 *
 * 获取阅读偏好。
 *
 * @returns Resolved options, the current preferences and their mutators
 * 当前生效的配置、当前偏好及其修改方法
 */
export function useReaderPreferences(): ReaderPreferencesResult {
  const options = useReaderOptions()
  const { aid, aidConfig } = useReaderReadAid()

  const aidModes = computed(() => aidConfig.value?.modes ?? [])

  const hasControls = computed(() => hasReaderControls(options.value, mobile.value))

  function setPreference<K extends keyof ReaderPreferences>(key: K, value: ReaderPreferences[K] | undefined): void {
    const next: Record<string, unknown> = { ...readerPreferences.value }

    if (value === undefined)
      delete next[key]
    else
      next[key] = value

    readerPreferences.value = normalizeReaderPreferences(next, options.value)
  }

  function reset(): void {
    readerPreferences.value = {}

    if (!inBrowser)
      return

    window.localStorage.removeItem(`${storagePrefix.value}:reader:prefs`)
  }

  return {
    options,
    prefs: readerPreferences,
    aidConfig,
    aidModes,
    aid,
    mobile,
    hasControls,
    setPreference,
    reset,
  }
}

/**
 * Use the "continue reading" prompt.
 *
 * 获取「继续阅读」提示。
 */
export function useResumeReading(): {
  /** Saved progress in `0`–`1`, `null` when nothing to offer / 保存的进度 */
  saved: Readonly<Ref<number | null>>
  /** Whether the prompt is visible / 提示是否可见 */
  visible: Ref<boolean>
  /** Scroll to the saved position / 滚动到记录的位置 */
  resume: () => void
  /** Dismiss and mark as "restart" for this session / 关闭并标记本次从头读 */
  restart: () => void
} {
  const { page } = useData()

  function resume(): void {
    const percent = resumeSaved.value
    resumeVisible.value = false

    if (!inBrowser || percent === null)
      return

    const el = document.querySelector<HTMLElement>('.vp-doc')
    if (!el)
      return

    const rect = el.getBoundingClientRect()
    const docTop = rect.top + window.scrollY
    const range = Math.max(rect.height - window.innerHeight, 0)

    // 补偿 `scroll-padding-top`（≥768px 为 64px），否则会停在导航栏下方
    const padding = Number.parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('scroll-padding-top'),
      10,
    )
    const offset = Number.isFinite(padding) ? padding : 64
    const target = Math.max(docTop + percent * range - offset, 0)
    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')

    window.scrollTo({ top: target, behavior: motionQuery?.matches ? 'auto' : 'smooth' })
  }

  function restart(): void {
    resumeVisible.value = false
    restartedPaths.add(page.value.path)
  }

  return {
    saved: readonly(resumeSaved),
    visible: resumeVisible,
    resume,
    restart,
  }
}

/**
 * Setup the reader preferences: apply them, keep them in sync, track the reading
 * position and offer the resume prompt.
 *
 * The whole thing is a no-op when the feature is disabled for the current locale.
 *
 * 初始化阅读偏好：应用、同步、记录阅读位置并提供继续阅读提示。
 *
 * 当前语言关闭该功能时，整个流程不产生任何副作用。
 */
export function setupReaderPreferences(): void {
  if (!inBrowser || installed)
    return

  installed = true

  const { page, frontmatter, isDark } = useData()
  const { hasPageEncrypt, isPageDecrypted } = useEncrypt()
  const route = useRoute()
  const options = useReaderOptions()

  /**
   * Last valid sample, used by the forced flush points.
   *
   * The resume options are captured with the sample: after a locale switch the
   * pending sample still has to be written with the configuration it was taken
   * under, not with the new locale's one.
   *
   * 最后一次有效采样，供强制落盘点使用。
   *
   * 采样时一并保存所属语言的 `resume` 配置：语言切换后，待写样本仍需按采样时的
   * 配置写入，不能被新语言的配置裁剪或阻止。
   */
  let lastSample: {
    path: string
    percent: number
    resume: Required<ReaderResumeOptions>
  } | null = null
  let lastWriteAt = 0

  /**
   * 新页面稳定前是否暂停采样。
   *
   * 路由切换会把滚动位置复位，若直接采样就会在续读判定前覆盖新页面已保存的进度。
   */
  let samplingSuspended = false

  /**
   * 落盘当前页面尚未写入的采样。
   */
  function flush(): void {
    if (!lastSample)
      return

    writeRecord(lastSample.resume, lastSample.path, lastSample.percent)
    lastSample = null
  }

  // 存储键前缀随语言变化，`useStorage` 会自动换键并重新读取。
  // The key prefix follows the locale, `useStorage` switches keys and reloads itself.
  watch(
    () => options.value?.storagePrefix ?? 'plume',
    (prefix, prev) => {
      // 语言切换：先把旧语言待写的样本落盘到旧前缀的记录表，再切换存储键。
      if (prev !== undefined)
        flush()
      storagePrefix.value = prefix
    },
    { immediate: true },
  )

  // 记住「真正生效」的宽度与专注模式：小屏上它们恒为默认值，
  // 因此跨越断点时也会各自触发一次 resize 唤醒。
  let appliedWidth: ReaderWidthPreset | null = null
  let appliedFocus = false

  watch([readerPreferences, isDark, options, mobile], () => {
    const { width, focus } = syncPreferences(options.value, isDark.value, mobile.value)

    if (width === appliedWidth && focus === appliedFocus)
      return

    appliedWidth = width
    appliedFocus = focus
    notifyResize()
  }, { deep: true, immediate: true })

  window.addEventListener('popstate', () => {
    popStateAt = Date.now()
  })

  /**
   * Reading position tracking.
   *
   * 阅读位置追踪。
   */
  const { y } = useWindowScroll()
  const { height: viewportHeight } = useWindowSize()

  const docTop = ref(0)
  const docHeight = ref(0)

  /**
   * 当前被 `ResizeObserver` 观察的正文节点。
   */
  let observedDoc: HTMLElement | null = null
  let resizeObserver: ResizeObserver | null = null

  /**
   * 正文节点被替换时重新绑定观察器。
   *
   * @param el - Current content node / 当前正文节点
   */
  function observeDoc(el: HTMLElement | null): void {
    if (!resizeObserver)
      return

    if (!el) {
      if (observedDoc)
        resizeObserver.unobserve(observedDoc)
      observedDoc = null
      return
    }

    if (el === observedDoc)
      return

    if (observedDoc)
      resizeObserver.unobserve(observedDoc)

    observedDoc = el
    resizeObserver.observe(el)
  }

  function measure(): void {
    const el = document.querySelector<HTMLElement>('.vp-doc')
    if (!el) {
      docTop.value = 0
      docHeight.value = 0
      readingTrackable.value = false
      return
    }

    // 路由切换时正文节点会被替换（`out-in` 过渡），测量时顺带重新绑定
    observeDoc(el)

    const rect = el.getBoundingClientRect()
    docTop.value = rect.top + window.scrollY
    docHeight.value = rect.height
    readingTrackable.value = rect.height - viewportHeight.value > 0
  }

  watch(
    () => computeReadingProgress({
      scrollY: y.value,
      docTop: docTop.value,
      docHeight: docHeight.value,
      viewportHeight: viewportHeight.value,
    }),
    (value) => {
      readingProgress.value = value
    },
    { immediate: true },
  )

  function onScroll(): void {
    const opt = options.value
    const resume = opt?.resume

    if (!opt || !resume)
      return

    // 路由切换触发的滚动复位不属于用户滚动，等续读判定完成后再恢复采样。
    if (samplingSuspended)
      return

    // 首次滚动时正文可能还没被测量（setup 阶段尚无 DOM），补一次测量。
    if (!readingTrackable.value)
      measure()

    if (!canTrack(page.value, frontmatter.value, opt, {
      hasPageEncrypt: hasPageEncrypt.value,
      isPageDecrypted: isPageDecrypted.value,
    })) {
      return
    }

    // 每次滚动都更新采样，但按节流间隔落盘，保证强制落盘点写入的是最新位置。
    // 采样时保存当前语言的 `resume` 配置，语言切换后仍可正确写入。
    lastSample = { path: page.value.path, percent: readingProgress.value, resume }

    const now = Date.now()
    if (now - lastWriteAt < WRITE_THROTTLE)
      return

    lastWriteAt = now
    writeRecord(resume, page.value.path, readingProgress.value)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pagehide', flush)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden)
      flush()
  })

  /** Reset the resume prompt state before evaluating a new page. */
  function resetResume(): void {
    resumeVisible.value = false
    resumeSaved.value = null
  }

  function checkResume(): void {
    resetResume()

    const opt = options.value
    if (!opt?.resume?.prompt)
      return

    if (frontmatter.value.reader === false)
      return

    const path = page.value.path
    if (restartedPaths.has(path))
      return

    const stored = readerProgress.value[path]

    const should = shouldOfferResume({
      stored,
      hasHash: !!route.hash || !!window.location.hash,
      cameFromPopState: Date.now() - popStateAt < POPSTATE_WINDOW,
      minPercent: opt.resume.minPercent,
      maxPercent: MAX_RESUME_PERCENT,
      ttlDays: opt.resume.ttl,
      now: Date.now(),
    })

    if (!should || !stored)
      return

    resumeSaved.value = stored.p
    resumeVisible.value = true
  }

  let resumeTimer: ReturnType<typeof setTimeout> | undefined

  function scheduleResume(): void {
    clearTimeout(resumeTimer)
    resumeTimer = setTimeout(() => {
      measure()
      checkResume()
      // 续读判定已经完成，恢复对用户滚动的采样
      samplingSuspended = false
    }, RESUME_DELAY)
  }

  // 字体、图片与折叠容器就绪后会改变正文高度，因此要多次测量。
  nextTick(measure)
  if (document.fonts)
    document.fonts.ready.then(measure).catch(() => {})

  if (typeof ResizeObserver === 'function') {
    resizeObserver = new ResizeObserver(() => measure())

    // `setup` 阶段 `.vp-doc` 尚未挂载，首次绑定要等客户端首次渲染完成；
    // 路由切换后由 `measure()` 重新绑定被替换的正文节点。
    watch(() => page.value.path, () => nextTick(measure), { immediate: true })
  }

  watch(() => page.value.path, (_path, prev) => {
    if (prev) {
      // 只落盘属于上一页的采样：滚动复位可能已经用新路径采样，直接丢弃
      if (lastSample && lastSample.path !== prev)
        lastSample = null

      flush()
    }

    // 在续读判定完成前忽略路由切换触发的滚动复位
    samplingSuspended = true

    nextTick(measure)
    scheduleResume()
  })

  watch(
    () => frontmatter.value.reader,
    () => scheduleResume(),
    { immediate: true },
  )
}
