import type {
  ReaderAidMode,
  ReaderAidOptions,
  ReaderPalette,
  ReaderPreferencesOptions,
  ReaderResumeOptions,
  ReaderThemePreset,
  ReaderWidthPreset,
  ResolvedReaderOptions,
  ResolvedReaderPalette,
  ThemeOptions,
} from '../../../shared/index.js'
import { isPlainObject, isString } from '@pengzhanbo/utils'
import { clamp, clampInteger } from '../../utils/index.js'

/**
 * Every supported width preset, in canonical order.
 *
 * 所有支持的宽度档位，按固定顺序排列。
 */
const WIDTH_PRESETS: ReaderWidthPreset[] = ['narrow', 'wide', 'full']

/**
 * Every supported background preset, in canonical order.
 *
 * 所有支持的背景档位，按固定顺序排列。
 */
const THEME_PRESETS: ReaderThemePreset[] = ['default', 'warm', 'sepia']

/**
 * Swatch color of every built-in background preset, `null` for "no override".
 *
 * The tokens themselves live in `styles/reader.css`; this table only feeds the
 * color swatches of the settings panel.
 *
 * 内置背景档位的色块颜色，`null` 表示「不覆盖」。
 *
 * 令牌本体在 `styles/reader.css` 中，这张表只用于面板的色块。
 */
const BUILTIN_THEME_COLORS: Record<ReaderThemePreset, string | null> = {
  default: null,
  warm: '#fbf8f3',
  sepia: '#f4ecd8',
}

/**
 * Palette names must stay usable as an attribute value.
 *
 * 调色板名称必须能安全地作为属性值使用。
 */
const PALETTE_NAME_RE = /^[\w-]+$/

/**
 * Strip the characters that could break out of the generated CSS.
 *
 * 去掉可能破坏生成 CSS 的字符。
 */
function sanitizeTokenValue(value: string): string {
  return value.replace(/[<>{};"']/g, '').trim()
}

/**
 * Normalize a user defined palette.
 *
 * 规范化一个用户自定义调色板。
 *
 * @param palette - Raw palette / 原始调色板
 */
function normalizePalette(palette: ReaderPalette): ResolvedReaderPalette | null {
  const name = palette.name?.trim?.() ?? ''
  if (!PALETTE_NAME_RE.test(name))
    return null

  const tokens: Record<string, string> = {}
  for (const [key, value] of Object.entries(palette.tokens ?? {})) {
    if (!isString(value))
      continue
    const property = key.startsWith('--') ? key : `--${key}`
    if (!/^--[\w-]+$/.test(property))
      continue
    const clean = sanitizeTokenValue(value)
    if (clean)
      tokens[property] = clean
  }

  const color = palette.color && isString(palette.color)
    ? sanitizeTokenValue(palette.color)
    : null

  return {
    name,
    label: palette.label?.trim?.() || undefined,
    color: color || tokens['--vp-c-bg'] || tokens['--vp-c-brand-1'] || null,
    tokens,
    custom: true,
  }
}

/**
 * Resolve a palette list: built-in presets first, custom palettes in order.
 *
 * `default` (theme tokens as-is) is always available, otherwise the reader could
 * not switch the override off again.
 *
 * 解析调色板列表：内置档位在前，自定义调色板按顺序排列。
 *
 * `default`（沿用主题令牌）始终保留，否则读者无法关闭覆盖。
 *
 * @param presets - Raw preset list / 原始档位列表
 * @param builtins - Built-in presets / 内置档位
 */
function resolvePalettes(
  presets: (ReaderThemePreset | ReaderPalette)[] | undefined,
  builtins: ReaderThemePreset[],
): ResolvedReaderPalette[] {
  const names = new Set<string>(['default'])
  const result: ResolvedReaderPalette[] = [{
    name: 'default',
    color: null,
    tokens: {},
  }]

  const list = presets ?? builtins

  for (const preset of list) {
    if (isString(preset)) {
      if (!builtins.includes(preset as ReaderThemePreset) || preset === 'default')
        continue
      if (names.has(preset))
        continue
      names.add(preset)
      result.push({
        name: preset,
        color: BUILTIN_THEME_COLORS[preset as ReaderThemePreset] ?? null,
        tokens: {},
      })
      continue
    }

    const palette = normalizePalette(preset)
    if (!palette || names.has(palette.name))
      continue

    names.add(palette.name)
    result.push(palette)
  }

  return result
}

/**
 * Every supported reading aid mode, in canonical order.
 *
 * 所有支持的阅读辅助线形态，按固定顺序排列。
 */
const AID_MODES: ReaderAidMode[] = ['mask', 'left', 'right']

/**
 * Default `localStorage` key prefix.
 *
 * 默认的 `localStorage` 键前缀。
 */
export const DEFAULT_STORAGE_PREFIX = 'plume'

/**
 * Filter a preset list: drop unknown values, dedupe and keep the canonical order.
 *
 * 过滤档位列表：丢弃未知值、去重，并保持固定顺序。
 *
 * @param presets - Raw presets / 原始档位
 * @param allowed - Supported presets / 支持的档位
 */
function normalizePresets<T extends string>(presets: T[] | undefined, allowed: T[]): T[] {
  if (!presets)
    return [...allowed]

  return allowed.filter(preset => presets.includes(preset))
}

/**
 * Normalize the resume options.
 *
 * 规范继续阅读配置。
 *
 * @param resume - Raw options / 原始配置
 */
function normalizeResume(resume: boolean | ReaderResumeOptions | undefined): Required<ReaderResumeOptions> {
  const options = isPlainObject(resume) ? resume : {}

  return {
    prompt: options.prompt ?? true,
    ttl: clampInteger(options.ttl ?? 90, 1, 365),
    max: clampInteger(options.max ?? 300, 10, 1000),
    minPercent: clamp(options.minPercent ?? 0.05, 0, 1),
  }
}

/**
 * Normalize the reading aid options.
 *
 * 规范阅读辅助线配置
 *
 * @param readAid - Raw options / 原始配置
 */
function normalizeReaderAid(
  readAid: boolean | ReaderAidMode | ReaderAidOptions | undefined,
): { modes: ReaderAidMode[], default: ReaderAidMode | null } | null {
  if (readAid === false)
    return null

  const options: ReaderAidOptions = isPlainObject(readAid)
    ? readAid
    : isString(readAid) ? { default: readAid } : {}

  const modes = normalizePresets(options.modes, AID_MODES)
  const preferred = isString(readAid) ? readAid : options.default

  return {
    modes,
    default: preferred && modes.includes(preferred) ? preferred : null,
  }
}

/**
 * Resolve the reader preferences of one locale.
 *
 * `false` / unset → `null` (the feature is off for that locale).
 *
 * 解析某个语言环境的阅读偏好配置。
 *
 * `false` / 未配置 → `null`（该语言不启用该功能）。
 *
 * @param raw - Raw options / 原始配置
 */
export function resolveReaderOptions(
  raw: boolean | ReaderPreferencesOptions | undefined,
): ResolvedReaderOptions | null {
  if (!raw)
    return null

  const options: ReaderPreferencesOptions = raw === true ? {} : raw

  return {
    width: options.width === false
      ? null
      : { presets: normalizePresets(options.width?.presets, WIDTH_PRESETS) },
    theme: options.theme === false
      ? null
      : { presets: resolvePalettes(options.theme?.presets, THEME_PRESETS) },
    brand: options.brand === false || options.brand === undefined
      ? null
      : { presets: resolvePalettes(options.brand?.presets, []) },
    readAid: normalizeReaderAid(options.readAid),
    focusMode: options.focusMode ?? true,
    resume: options.resume === false
      ? null
      : normalizeResume(options.resume),
    storagePrefix: options.storagePrefix?.trim() || DEFAULT_STORAGE_PREFIX,
  }
}

/**
 * Palette name of a raw preset entry.
 *
 * 原始档位条目的调色板名称。
 *
 * @param preset - Raw preset / 原始档位
 */
function presetName(preset: ReaderThemePreset | ReaderPalette): string {
  return isString(preset) ? preset : preset.name
}

/**
 * Merge the preset lists of one palette group.
 *
 * The theme level list defines the order and owns the `tokens`; a locale entry
 * with the same name only overrides the fields it declares (usually `label`).
 * Names that only exist in the locale list are appended.
 *
 * 合并同一分组的档位列表。
 *
 * 主题级列表决定顺序并拥有 `tokens`；语言级同名的条目只覆盖它声明的字段
 * （通常是 `label`）。仅存在于语言级的名称追加在末尾。
 *
 * @param base - Theme level presets / 主题级档位
 * @param locale - Locale level presets / 语言级档位
 */
function mergePresets(
  base: (ReaderThemePreset | ReaderPalette)[] | undefined,
  locale: (ReaderThemePreset | ReaderPalette)[],
): (ReaderThemePreset | ReaderPalette)[] {
  const baseList = base ?? []
  const baseNames = new Set(baseList.map(presetName))
  const result: (ReaderThemePreset | ReaderPalette)[] = []

  for (const preset of baseList) {
    const override = locale.find(item => presetName(item) === presetName(preset))

    if (!override || isString(preset) || isString(override)) {
      result.push(override ?? preset)
      continue
    }

    // `tokens` 缺省时沿用主题级，避免每个语言重复维护整组颜色
    result.push({ ...preset, ...override, tokens: override.tokens ?? preset.tokens })
  }

  for (const preset of locale) {
    if (!baseNames.has(presetName(preset)))
      result.push(preset)
  }

  return result
}

/**
 * Merge one palette group of the locale level options into the theme level one.
 *
 * Only the preset list needs a deep merge, it is the single property of a group.
 * A locale that does not declare `presets` keeps the theme level list.
 *
 * 合并单个调色板分组（护眼背景或品牌色）的语言级配置。
 *
 * 只有档位列表需要深层合并，它是分组唯一属性。
 * 语言级未声明 `presets` 时沿用主题级的列表。
 *
 * @param base - Theme level group / 主题级分组
 * @param locale - Locale level group / 语言级分组
 */
function mergePaletteGroup<P extends ReaderThemePreset | ReaderPalette>(
  base: false | { presets?: P[] } | undefined,
  locale: false | { presets?: P[] } | undefined,
  defaults: P[],
): { presets?: P[] } | undefined {
  if (!base || !locale)
    return undefined

  if (!locale.presets)
    return base.presets ? { presets: base.presets } : {}

  return { presets: mergePresets(base.presets ?? defaults, locale.presets) as P[] }
}

/**
 * Merge the locale level reader preferences into the theme level ones.
 *
 * Only the palette groups need a deep merge: a locale usually just relabels the
 * palettes defined once at the theme level, without repeating their `tokens`.
 *
 * 将语言级阅读偏好合并进主题级配置。
 *
 * 只有调色板分组需要深层合并：语言级通常只为主题级已定义的调色板提供 `label`，
 * 而不重复其 `tokens`。
 *
 * @param base - Theme level options / 主题级配置
 * @param locale - Locale level options / 语言级配置
 */
export function mergeReaderPreferences(
  base: boolean | ReaderPreferencesOptions | undefined,
  locale: boolean | ReaderPreferencesOptions | undefined,
): boolean | ReaderPreferencesOptions | undefined {
  if (locale === undefined)
    return base

  if (base === undefined || typeof base === 'boolean' || typeof locale === 'boolean')
    return locale

  const merged: ReaderPreferencesOptions = { ...base, ...locale }

  const theme = mergePaletteGroup(base.theme, locale.theme, THEME_PRESETS)
  if (theme)
    merged.theme = theme

  const brand = mergePaletteGroup(base.brand, locale.brand, [])
  if (brand)
    merged.brand = brand

  return merged
}

/**
 * 为单个语言的自定义调色板加上语言作用域。
 *
 * 不同语言可能用同一个名称定义不同的令牌，因此非根语言写入
 * `data-reader-theme` / `data-reader-brand` 的值会带上语言前缀；
 * 根语言沿用名称，单语言站点与历史存储值保持不变。
 *
 * @param group - Palette group / 调色板分组
 * @param prefix - Route locale prefix / 路由语言前缀
 */
function scopePalettes(
  group: { presets: ResolvedReaderPalette[] } | null,
  prefix: string,
): { presets: ResolvedReaderPalette[] } | null {
  if (!group || prefix === '/')
    return group

  return {
    // 以「是否为自定义调色板」决定作用域，令牌为空的自定义项同样需要；
    // 内置档位沿用名称，与静态样式表里的选择器保持一致。
    // Scope by whether the palette is user defined, an empty token set still
    // needs it. Built-in presets keep their bare name.
    presets: group.presets.map(palette => palette.custom
      ? { ...palette, attribute: `${palette.name}@${prefix}` }
      : palette),
  }
}

/**
 * Resolve the reader preferences that apply to one route locale.
 *
 * Locale level configuration wins over the theme level one, but palettes are
 * merged by name: a locale only relabels what the theme level defined once.
 *
 * 解析某个路由语言实际生效的阅读偏好配置。
 *
 * 语言级配置优先于主题级配置，但调色板按名称合并：语言级只为主题级已定义的调色板改文案。
 *
 * @param options - Theme options / 主题配置
 * @param locale - Route locale / 路由语言
 */
export function resolveLocaleReaderOptions(
  options: ThemeOptions,
  locale: string,
): ResolvedReaderOptions | null {
  const localeValue = options.locales?.[locale]?.readerPreferences

  const merged = localeValue === undefined
    ? options.readerPreferences
    : mergeReaderPreferences(options.readerPreferences, localeValue)

  const resolved = resolveReaderOptions(merged)

  if (!resolved)
    return null

  return {
    ...resolved,
    theme: scopePalettes(resolved.theme, locale),
    brand: scopePalettes(resolved.brand, locale),
  }
}

/**
 * A configured locale of the reader preferences.
 *
 * 阅读偏好已配置的语言环境。
 */
export interface ReaderScriptLocale {
  /**
   * Route locale prefix, e.g. `/` or `/en/`
   *
   * 路由语言前缀，如 `/` 或 `/en/`
   */
  prefix: string
  /**
   * Resolved options of that locale, `null` when it disabled the feature
   *
   * 该语言已解析的配置，显式关闭时为 `null`
   */
  options: ResolvedReaderOptions | null
}

/**
 * 收集所有已配置的语言环境，包括显式关闭的语言。
 *
 * 关闭的语言保留为标记：内联脚本命中后立即停止，而不是回退到根语言，
 * 因此 `/en/` 关闭该功能后不会继承根语言的偏好。
 *
 * 按前缀长度倒序排列，使脚本在匹配当前路径时 `/en/` 先于根路径 `/` 命中。
 *
 * @param options - Theme options / 主题配置
 */
export function collectReaderLocales(options: ThemeOptions): ReaderScriptLocale[] {
  const prefixes = Object.keys(options.locales ?? {})

  // 兜底：没有任何语言配置的站点只有主题级配置，等价于根语言。
  if (!prefixes.length) {
    const resolved = resolveReaderOptions(options.readerPreferences)

    return resolved ? [{ prefix: '/', options: resolved }] : []
  }

  const locales: ReaderScriptLocale[] = prefixes.map(prefix => ({
    prefix,
    options: resolveLocaleReaderOptions(options, prefix),
  }))

  return locales.sort((a, b) => b.prefix.length - a.prefix.length)
}
