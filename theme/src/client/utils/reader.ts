import type {
  ReaderAidMode,
  ReaderPreferences,
  ReaderProgressRecord,
  ReaderWidthPreset,
  ResolvedReaderOptions,
  ResolvedReaderPalette,
} from '../../shared/index.js'

// 所有支持的阅读辅助线形态，按固定顺序排列。
const AID_MODES: ReaderAidMode[] = ['mask', 'left', 'right']

// 一天的毫秒数
const DAY = 24 * 60 * 60 * 1000

/**
 * 能用上「桌面专属」控件的屏幕宽度。
 *
 * 低于该宽度时正文本就铺满、没有 hover 可驱动辅助线、专注模式还会藏起唯一的导航入口，
 * 因此宽度、阅读辅助线与专注模式会被隐藏并使用默认值。
 */
export const READER_DESKTOP_QUERY = '(min-width: 769px)'

/**
 * Whether the settings panel has anything to offer.
 *
 * A locale may enable only the progress bar and the resume prompt, in which case
 * the settings entry should not render at all. On small screens only the reading
 * background is left, so a locale that enabled nothing else has no panel there.
 *
 * 设置面板是否有可操作项。
 *
 * 语言配置可能只启用进度条与继续阅读，此时不应渲染设置入口。
 * 小屏幕上只剩护眼背景，因此只启用了桌面控件时也不会出现入口。
 *
 * @param options - Resolved options / 已解析的配置
 * @param mobile - Whether the viewport is a small screen / 是否小屏幕
 */
export function hasReaderControls(options: ResolvedReaderOptions | null, mobile = false): boolean {
  if (!options)
    return false

  if (mobile)
    return !!(options.theme || options.brand)

  return !!options.width || !!options.theme || !!options.brand || !!options.readAid || options.focusMode
}

/**
 * Resolve the width preset that can actually be applied.
 *
 * Small screens always use `standard`: the text already fills the viewport, so a
 * preset would either do nothing or narrow the content for no reason.
 *
 * 解析真正能生效的宽度档位。
 *
 * 小屏幕一律使用 `standard`：正文本就铺满视口，档位要么无效、要么无谓地收窄正文。
 *
 * @param preset - Selected preset / 选中的档位
 * @param options - Resolved options / 已解析的配置
 * @param mobile - Whether the viewport is a small screen / 是否小屏幕
 */
export function resolveEffectiveWidth(
  preset: ReaderPreferences['width'],
  options: ResolvedReaderOptions | null,
  mobile = false,
): ReaderWidthPreset | null {
  if (mobile || !options?.width)
    return null

  return preset && options.width.presets.includes(preset) ? preset : null
}

/**
 * Resolve whether the focus mode can actually be enabled.
 *
 * Small screens never use it: hiding the navbar there also hides the only way to
 * open the navigation drawer.
 *
 * 解析专注模式是否真正生效。
 *
 * 小屏幕永不启用：那里的导航栏同时承载打开抽屉的唯一入口。
 *
 * @param focus - Stored preference / 存储的偏好
 * @param mobile - Whether the viewport is a small screen / 是否小屏幕
 */
export function resolveEffectiveFocus(
  focus: ReaderPreferences['focus'],
  mobile = false,
): boolean {
  return !mobile && focus === true
}

/**
 * Resolve the reading aid configuration that applies to the current page.
 *
 * `readerPreferences.readAid` wins; the legacy `collection.readAid` /
 * `theme.locales[].readAid` options are still honoured as the default mode when
 * the new option does not set one, where `true` keeps its historical meaning of
 * `left`. That way enabling `readerPreferences` never silently drops a
 * previously configured guide line.
 *
 * 解析当前页真正生效的阅读辅助线配置。
 *
 * `readerPreferences.readAid` 优先；新配置未指定默认形态时，旧的
 * `collection.readAid` / `theme.locales[].readAid` 仍作为默认形态，
 * 其中 `true` 沿用历史含义 `left`。这样启用阅读偏好不会静默丢掉原本配置的辅助线。
 *
 * @param options - Resolved reader options / 已解析的阅读偏好配置
 * @param legacy - Legacy option / 旧配置
 */
export function resolveReaderAidConfig(
  options: ResolvedReaderOptions | null,
  legacy: boolean | ReaderAidMode | undefined,
): { modes: ReaderAidMode[], default: ReaderAidMode | null } | null {
  const legacyMode = !legacy
    ? null
    : legacy === true ? 'left' : legacy

  if (options) {
    if (!options.readAid)
      return null

    const { modes, default: preset } = options.readAid

    return {
      modes,
      default: preset ?? (legacyMode && modes.includes(legacyMode) ? legacyMode : null),
    }
  }

  if (!legacyMode || !AID_MODES.includes(legacyMode))
    return null

  return { modes: [...AID_MODES], default: legacyMode }
}

/**
 * Normalize stored preferences against the allowed presets.
 *
 * Values outside the enabled presets are dropped, unknown fields are dropped.
 * This guarantees that tightening the configuration never leaves a stale value
 * driving a UI state that no longer exists.
 *
 * 用配置约束存储值：不在启用档位内的值被丢弃，未知字段被丢弃。
 * 保证「站长收紧配置后，老用户的旧数据不会产生非法 UI」。
 *
 * @param raw - Stored value, may be a JSON string or an already parsed object
 * 原始存储值，可以是 JSON 字符串或已解析的对象
 * @param options - Resolved options, `null` when the feature is disabled
 * 已解析的配置，功能关闭时为 `null`
 */
export function normalizeReaderPreferences(
  raw: unknown,
  options: ResolvedReaderOptions | null,
): ReaderPreferences {
  if (!options)
    return {}

  let value = raw

  if (typeof raw === 'string') {
    try {
      value = JSON.parse(raw)
    }
    catch {
      return {}
    }
  }

  if (!value || typeof value !== 'object' || Array.isArray(value))
    return {}

  const source = value as Record<string, unknown>
  const prefs: ReaderPreferences = {}

  if (options.width && typeof source.width === 'string' && options.width.presets.includes(source.width as ReaderWidthPreset))
    prefs.width = source.width as ReaderWidthPreset

  if (options.theme && typeof source.theme === 'string' && options.theme.presets.some(palette => palette.name === source.theme))
    prefs.theme = source.theme

  if (options.brand && typeof source.brand === 'string' && options.brand.presets.some(palette => palette.name === source.brand))
    prefs.brand = source.brand

  if (options.readAid) {
    if (source.aid === 'off')
      prefs.aid = 'off'
    else if (typeof source.aid === 'string' && options.readAid.modes.includes(source.aid as ReaderAidMode))
      prefs.aid = source.aid as ReaderAidMode
  }

  // 专注模式关闭时丢弃该偏好，避免它继续参与 `syncPreferences()` 与 DOM 属性
  if (options.focusMode && typeof source.focus === 'boolean')
    prefs.focus = source.focus

  return prefs
}

/**
 * Resolve the reading aid mode that can actually be applied.
 *
 * A stored mode wins when the configuration still offers it, otherwise the
 * configured default is used; `null` means "off". Small screens always get
 * `null`: there is no hover to follow.
 *
 * 解析真正生效的阅读辅助线形态。
 *
 * 存储值仍在可选范围内时优先，否则回退到配置的默认值；`null` 表示关闭。
 * 小屏幕一律为 `null`：没有 hover 可供跟随。
 *
 * @param config - Reading aid configuration / 阅读辅助线配置
 * @param stored - Stored mode / 存储的形态
 * @param mobile - Whether the viewport is a small screen / 是否小屏幕
 */
export function resolveEffectiveAid(
  config: { modes: ReaderAidMode[], default: ReaderAidMode | null } | null,
  stored: ReaderPreferences['aid'],
  mobile = false,
): ReaderAidMode | null {
  // 小屏没有 hover，辅助线无从跟随，直接关闭
  // No hover on small screens, so the aid cannot follow anything.
  if (!config || mobile)
    return null

  if (stored === 'off')
    return null

  if (stored && config.modes.includes(stored))
    return stored

  return config.default
}

/**
 * Shared palette resolution.
 *
 * 调色板解析的公共实现。
 *
 * @param presets - Enabled palettes / 启用的调色板
 * @param stored - Stored name / 存储的名称
 * @param disabled - Whether the group is disabled / 该组是否被禁用
 */
function resolvePaletteName(
  presets: ResolvedReaderPalette[] | null,
  stored: string | undefined,
  disabled: boolean,
): string | null {
  if (disabled || !presets?.length)
    return null

  const name = stored && presets.some(palette => palette.name === stored)
    ? stored
    : 'default'

  if (name === 'default')
    return null

  return presets.find(palette => palette.name === name)?.attribute ?? name
}

/**
 * Resolve the background palette that can actually be applied.
 *
 * In dark mode every palette is disabled (returns `null`), so that
 * "dark + sepia" cannot physically exist. `default` means "no override" and
 * writes no attribute either.
 *
 * 解析真正能生效的背景调色板。
 *
 * 暗色模式下所有调色板一律失效（返回 `null`），让「深色 + 纸黄」在物理上不存在。
 * `default` 表示「不覆盖」，同样不写属性。
 *
 * @param presets - Enabled palettes / 启用的调色板
 * @param stored - Stored palette name / 存储的调色板名称
 * @param isDark - Whether the site is in dark mode / 是否深色模式
 */
export function resolveEffectiveTheme(
  presets: ResolvedReaderPalette[] | null,
  stored: string | undefined,
  isDark: boolean,
): string | null {
  return resolvePaletteName(presets, stored, isDark)
}

/**
 * Resolve the brand palette that can actually be applied.
 *
 * Unlike the reading background it also works in dark mode.
 *
 * 解析真正能生效的品牌色调色板。
 *
 * 与护眼背景不同，它在深色模式下同样生效。
 *
 * @param presets - Enabled palettes / 启用的调色板
 * @param stored - Stored palette name / 存储的调色板名称
 */
export function resolveEffectiveBrand(
  presets: ResolvedReaderPalette[] | null,
  stored: string | undefined,
): string | null {
  return resolvePaletteName(presets, stored, false)
}

/**
 * Measurements used to compute the reading progress.
 *
 * 计算阅读进度所需的测量值。
 */
export interface ReadingProgressInput {
  /**
   * Current scroll offset / 当前滚动位置
   */
  scrollY: number
  /**
   * Top offset of the content, relative to the document / 正文相对文档的顶部偏移
   */
  docTop: number
  /**
   * Height of the content / 正文高度
   */
  docHeight: number
  /**
   * Viewport height / 视口高度
   */
  viewportHeight: number
}

/**
 * Compute the reading progress from measurements.
 *
 * The progress is relative to the document body content, not to the whole page,
 * so that the footer, comments and related posts do not count as "read".
 *
 * 以正文为基准计算进度，返回 `0`–`1`。
 *
 * 进度相对正文而不是整页，因此页脚、评论与相关推荐不会被算作「已读」。
 *
 * @param input - Measurements / 测量值
 */
export function computeReadingProgress(input: ReadingProgressInput): number {
  const { scrollY, docTop, docHeight, viewportHeight } = input
  const range = docHeight - viewportHeight

  if (!Number.isFinite(range) || range <= 0)
    return 0

  const value = (scrollY - docTop) / range

  return Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : 0
}

/**
 * Inputs of the "continue reading" decision.
 *
 * 「继续阅读」判定的入参。
 */
export interface ResumeDecisionInput {
  /**
   * Stored record, if any / 已保存的记录（如果有）
   */
  stored?: ReaderProgressRecord
  /**
   * Whether the URL carries a hash / URL 是否带 hash
   */
  hasHash: boolean
  /**
   * Whether the navigation came from `popstate` / 是否来自 `popstate`
   */
  cameFromPopState: boolean
  /**
   * Lower bound of the prompt window / 提示窗口下界
   */
  minPercent: number
  /**
   * Upper bound of the prompt window / 提示窗口上界
   */
  maxPercent: number
  /**
   * Record TTL in days / 记录有效期（天）
   */
  ttlDays: number
  /**
   * Current timestamp in ms / 当前时间戳（毫秒）
   */
  now: number
}

/**
 * Decide whether to offer "continue reading".
 *
 * Shown only when a record exists, the URL has no hash, the navigation was not a
 * browser back/forward, the record is not expired, and the progress sits in the
 * `[minPercent, maxPercent]` window.
 *
 * 判断是否展示「继续阅读」。
 *
 * 仅在「有记录 / 无 hash / 非浏览器的前进后退 / 未过期 / 进度落在窗口内」时展示。
 *
 * @param input - Decision inputs / 判定入参
 */
export function shouldOfferResume(input: ResumeDecisionInput): boolean {
  const { stored, hasHash, cameFromPopState, minPercent, maxPercent, ttlDays, now } = input

  if (!stored || hasHash || cameFromPopState)
    return false

  if (!Number.isFinite(stored.p) || !Number.isFinite(stored.t))
    return false

  if (now - stored.t > ttlDays * DAY)
    return false

  return stored.p >= minPercent && stored.p <= maxPercent
}

/**
 * Prune stale records by TTL and count.
 *
 * Returns a new object, the input is never mutated.
 *
 * 按 TTL 与数量上限裁剪，返回新对象，不修改入参。
 *
 * @param record - All records / 全部记录
 * @param max - Max records kept / 最多保留条数
 * @param ttlDays - TTL in days / 有效期（天）
 * @param now - Current timestamp in ms / 当前时间戳
 */
export function pruneRecords<T extends { t: number }>(
  record: Record<string, T>,
  max: number,
  ttlDays: number,
  now: number,
): Record<string, T> {
  const ttl = ttlDays * DAY

  const entries = Object.entries(record)
    .filter(([, value]) => value && Number.isFinite(value.t) && now - value.t <= ttl)
    .sort((a, b) => b[1].t - a[1].t)
    .slice(0, Math.max(max, 0))

  return Object.fromEntries(entries)
}

/**
 * Minimal attribute target, a subset of `Element`.
 *
 * 最小属性目标，是 `Element` 的子集。
 */
export interface AttributeTarget {
  /**
   * Write an attribute / 写入属性
   */
  setAttribute: (name: string, value: string) => void
  /**
   * Remove an attribute / 移除属性
   */
  removeAttribute: (name: string) => void
}

/**
 * Set or remove an attribute.
 *
 * `null` removes the attribute, any other value writes it. `standard` /
 * `default` states therefore never appear in the DOM.
 *
 * 设置或移除属性。
 *
 * `null` 表示移除属性，其余值写入属性。因此 `standard` / `default` 状态永远不会出现在 DOM 中。
 *
 * @param target - Element to mutate / 要修改的元素
 * @param name - Attribute name / 属性名
 * @param value - Attribute value or `null` / 属性值或 `null`
 */
export function setReaderAttr(
  target: AttributeTarget,
  name: string,
  value?: string | null,
): void {
  if (value == null)
    target.removeAttribute(`data-reader-${name}`)
  else
    target.setAttribute(`data-reader-${name}`, value)
}
