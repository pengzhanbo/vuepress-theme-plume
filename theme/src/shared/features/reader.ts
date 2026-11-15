/**
 * Content width presets of the reader preferences.
 *
 * 阅读内容宽度的可选档位。
 *
 * 总共分为 4 个档位，默认、窄、标准、宽、铺满。
 * - 默认：使用主题的标准宽度，不修改原 CSS
 * - narrow: 1440px 最大宽度下的窄版
 * - wide: 1440px 最大宽度下的宽版（相当于 1440px 铺满）
 * - full: 铺满屏幕，在 1440px 以上宽度的设备中有用，在 1440px 及以下，等价于 宽
 */
export type ReaderWidthPreset = 'narrow' | 'wide' | 'full'

/**
 * 阅读辅助线的形态：左右辅助线，或跟随鼠标的遮罩。
 */
export type ReaderAidMode = 'mask' | 'left' | 'right'

/**
 * Reading aid options
 *
 * 阅读辅助线配置
 */
export interface ReaderAidOptions {
  /**
   * Modes offered to the reader, in canonical order, defaults to all of them
   *
   * 提供给读者的形态，按固定顺序排列，默认全部提供
   *
   * @default ['mask', 'left', 'right']
   */
  modes?: ReaderAidMode[]
  /**
   * Mode used when the reader has not chosen one, `null` means "off"
   *
   * 读者未选择时使用的形态，`null` 表示默认关闭
   *
   * @default null
   */
  default?: ReaderAidMode
}

/**
 * 护眼背景的预设档位。
 *
 * `default` 表示沿用主题默认令牌，其余档位覆盖颜色令牌。
 * `'warn' | 'sepia'` 表示主题内置的背景颜色令牌。
 */
export type ReaderThemePreset = 'default' | 'warm' | 'sepia'

/**
 * A readable color palette: a group of CSS custom properties applied together.
 *
 * `tokens` keys may omit the `--` prefix. The palette is applied through
 * `html[data-reader-theme="<name>"]` (background) or
 * `html[data-reader-brand="<name>"]` (brand colors), so the same mechanism
 * serves the built-in presets and the user defined ones.
 *
 * 一组可读性配色：一起生效的一组 CSS 自定义属性。
 *
 * `tokens` 的键可以省略 `--` 前缀。调色板通过 `html[data-reader-theme="<name>"]`
 * （背景）或 `html[data-reader-brand="<name>"]`（品牌色）生效，
 * 内置档位与自定义档位共用同一套机制。
 */
export interface ReaderPalette {
  /**
   * Unique name, used as the attribute value and the stored preference
   *
   * 唯一名称，用作属性值与存储的偏好
   */
  name: string
  /**
   * Accessible label and tooltip, falls back to `name`
   *
   * 无障碍标签与 tooltip，缺省使用 `name`
   */
  label?: string
  /**
   * Swatch color, falls back to the `--vp-c-bg` / `--vp-c-brand-1` token
   *
   * 色块颜色，缺省取 `--vp-c-bg` / `--vp-c-brand-1` 对应的令牌
   */
  color?: string
  /**
   * CSS custom properties of this palette
   *
   * 该调色板的 CSS 自定义属性
   */
  tokens?: Record<string, string>
}

/**
 * A palette resolved at build time.
 *
 * 构建期解析后的调色板。
 */
export interface ResolvedReaderPalette extends Required<Pick<ReaderPalette, 'name'>> {
  /**
   * Label, `undefined` for the built-in presets which use i18n texts
   *
   * 标签，内置档位为 `undefined`，由文案提供
   */
  label?: string
  /**
   * Swatch color, `null` means "no override" and renders a slashed swatch
   *
   * 色块颜色，`null` 表示「不覆盖」，渲染为斜线色块
   */
  color: string | null
  /**
   * CSS custom properties, empty for the built-in presets (their tokens live in CSS)
   *
   * CSS 自定义属性，内置档位为空（令牌由 CSS 提供）
   */
  tokens: Record<string, string>
}

/**
 * Reader resume options
 *
 * 继续阅读配置
 */
export interface ReaderResumeOptions {
  /**
   * `false` only records the position without prompting
   *
   * `false` 表示只记录、不提示
   *
   * @default true
   */
  prompt?: boolean
  /**
   * Record TTL in days, clamped to 1–365
   *
   * 记录有效期（天），限制在 1–365
   *
   * @default 90
   */
  ttl?: number
  /**
   * Max records kept, clamped to 10–1000
   *
   * 最多保留的记录数，限制在 10–1000
   *
   * @default 300
   */
  max?: number
  /**
   * Don't prompt below this progress, `0`–`1`
   *
   * 低于该进度不提示，取值 `0`–`1`
   *
   * @default 0.05
   */
  minPercent?: number
}

/**
 * Reader preferences options
 *
 * 阅读体验配置（阅读进度、继续阅读、内容宽度、护眼背景、专注模式）
 */
export interface ReaderPreferencesOptions {
  /**
   * Content width control, `false` disables it.
   * the rest are opt-in.
   * Actual widths are owned by CSS: override
   * `html[data-reader-width="wide"] .vp-doc-container { --vp-doc-content-width: ... }` to customize.
   *
   * 内容宽度控制，`false` 关闭。其余为可选档。
   * 档位对应的实际宽度由 CSS 决定，需自定义时覆盖 `--vp-doc-content-width`。
   *
   * @default true
   */
  width?: false | {
    /**
     * @default ['narrow', 'wide', 'full']
     */
    presets?: ReaderWidthPreset[]
  }

  /**
   * Reading background presets, `false` disables it. Disabled in dark mode at runtime.
   *
   * 护眼背景档位，`false` 关闭。深色模式下运行时禁用。
   *
   * @default true
   */
  theme?: false | {
    /**
     * Built-in presets and user defined palettes, in display order
     *
     * 内置档位与自定义调色板，按展示顺序排列
     *
     * @default ['default', 'warm', 'sepia']
     */
    presets?: (ReaderThemePreset | ReaderPalette)[]
  }

  /**
   * Brand color palettes, applied to `--vp-c-brand-*`. `false` disables it.
   * Works in dark mode too, unlike the reading background.
   *
   * 品牌色调色板，作用于 `--vp-c-brand-*`，`false` 关闭。
   * 与护眼背景不同，深色模式下同样可用。
   *
   * @default false
   */
  brand?: false | {
    /**
     * User defined palettes, `'default'` (theme tokens) is always available
     *
     * 自定义调色板，`'default'`（沿用主题令牌）始终可用
     */
    presets?: ReaderPalette[]
  }

  /**
   * Reading aid (guide line / mask following the hovered block), `false` disables it.
   * A bare mode string enables the control with that mode as the default.
   *
   * 阅读辅助线（跟随当前段落的辅助线 / 遮罩），`false` 关闭。
   * 直接传形态字符串表示启用该控件并以该形态为默认值。
   *
   * @default true
   */
  readAid?: boolean | ReaderAidMode | ReaderAidOptions

  /**
   * Focus mode
   *
   * 专注模式
   *
   * @default true
   */
  focusMode?: boolean

  /**
   * Continue reading
   *
   * 继续阅读
   *
   * @default true
   */
  resume?: boolean | ReaderResumeOptions

  /**
   * `localStorage` key prefix, change it when several sites share one origin
   *
   * `localStorage` 键前缀，同一域名部署多个站点时必须区分
   *
   * @default 'plume'
   */
  storagePrefix?: string
}

/**
 * Reader preferences resolved at build time, with every default applied.
 *
 * A `null` sub-item means the feature is disabled.
 *
 * 构建期已应用全部默认值的阅读偏好配置。
 *
 * 子项为 `null` 表示该功能已关闭。
 */
export interface ResolvedReaderOptions {
  /**
   * Enabled width presets, `null` when disabled
   *
   * 启用的宽度档位，关闭时为 `null`
   */
  width: { presets: ReaderWidthPreset[] } | null
  /**
   * Enabled background palettes, `null` when disabled
   *
   * 启用的背景调色板，关闭时为 `null`
   */
  theme: { presets: ResolvedReaderPalette[] } | null
  /**
   * Enabled brand palettes, `null` when disabled
   *
   * 启用的品牌色调色板，关闭时为 `null`
   */
  brand: { presets: ResolvedReaderPalette[] } | null
  /**
   * Reading aid modes and the default one, `null` when disabled
   *
   * 阅读辅助线的可选形态与默认形态，关闭时为 `null`
   */
  readAid: { modes: ReaderAidMode[], default: ReaderAidMode | null } | null
  /**
   * Whether the focus mode is available
   *
   * 是否启用专注模式
   */
  focusMode: boolean
  /**
   * Resume options, `null` when disabled
   *
   * 继续阅读配置，关闭时为 `null`
   */
  resume: Required<ReaderResumeOptions> | null
  /**
   * `localStorage` key prefix
   *
   * `localStorage` 键前缀
   */
  storagePrefix: string
}

/**
 * Reader preferences stored in `localStorage`.
 *
 * Only fields explicitly changed by the user are stored, a missing field means
 * "use the default", so new fields never break old records.
 *
 * 存储于 `localStorage` 的阅读偏好。
 *
 * 只保存用户显式改过的字段，缺失即默认值，所以新增字段不会污染老数据。
 */
export interface ReaderPreferences {
  /**
   * Content width preset
   *
   * 内容宽度档位
   */
  width?: ReaderWidthPreset
  /**
   * Reading background palette name, `'default'` means "no override"
   *
   * 护眼背景调色板名称，`'default'` 表示不覆盖
   */
  theme?: string
  /**
   * Brand palette name, `'default'` means "no override"
   *
   * 品牌色调色板名称，`'default'` 表示不覆盖
   */
  brand?: string
  /**
   * Reading aid mode, `'off'` turns it off explicitly and a missing value means
   * "follow the configured default"
   *
   * 阅读辅助线形态，`'off'` 表示显式关闭，缺失表示沿用配置的默认值
   */
  aid?: ReaderAidMode | 'off'
  /**
   * Focus mode
   *
   * 专注模式
   */
  focus?: boolean
}

/**
 * A single reading position record.
 *
 * `p` is the progress in `0`–`1`, `t` is the write timestamp.
 * Only the path and the percentage are stored, never the page title.
 *
 * 单条阅读位置记录。
 *
 * `p` 为 `0`–`1` 的进度，`t` 为写入时间戳。
 * 只保存路径与百分比，不保存页面标题。
 */
export interface ReaderProgressRecord {
  /**
   * Progress in `0`–`1`
   *
   * 进度，取值 `0`–`1`
   */
  p: number
  /**
   * Write timestamp in ms
   *
   * 写入时间戳（毫秒）
   */
  t: number
}
