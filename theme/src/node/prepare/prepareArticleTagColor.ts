import type { App } from 'vuepress'
import type { RGBColor } from '../utils/color.js'
import { toArray } from '@pengzhanbo/utils'
import {
  compositeColor,
  contrastRatio,
  genTempCode,
  hslToRgb,
  perf,
  roundColor,
  toRgbColor,
  writeTemp,
} from '../utils/index.js'

/**
 * Tag colors of a single color mode.
 *
 * 单个颜色模式下的标签配色。
 */
export interface TagColorScheme {
  /** Text color, `rgb()` / 文本颜色，`rgb()` 格式 */
  color: string
  /** Color used as the background on hover, `rgb()` / hover 状态下作为背景的颜色，`rgb()` 格式 */
  hoverColor: string
  /** Background color, `rgba()` / 背景色，`rgba()` 格式 */
  backgroundColor: string
}

/**
 * Tag colors, resolved for both light and dark mode.
 *
 * 标签配色，同时解析浅色与深色模式。
 */
export interface TagColors {
  light: TagColorScheme
  dark: TagColorScheme
}

/**
 * Minimum contrast ratio required by WCAG 2.x for normal text (`AA`).
 *
 * WCAG 2.x 对普通文本的最低对比度要求（`AA`）。
 */
const MIN_CONTRAST_RATIO = 4.5

/**
 * Alpha of the tag background
 *
 * 标签背景的透明度
 */
const BACKGROUND_ALPHA = 0.14

/**
 * Lightness offset between the text color and the hover color, keeping the
 * hover state distinguishable from the normal state.
 *
 * 文本颜色与 hover 颜色之间的亮度差，使 hover 状态与普通状态可区分。
 */
const HOVER_LIGHTNESS_OFFSET = 0.1

/**
 * Saturation range of the generated colors.
 *
 * 生成颜色的饱和度范围。
 */
const SATURATION_RANGE: readonly [min: number, max: number] = [0.58, 0.72]

/**
 * Steps of the lightness binary search, precise enough for a `0-1` lightness.
 *
 * 亮度二分查找的迭代次数，对 `0-1` 的亮度已经足够精确。
 */
const LIGHTNESS_SEARCH_STEPS = 24

/**
 * Surfaces the tags are rendered on, taken from the theme CSS variables.
 * The darkest light surface and the lightest dark surface are used, so that
 * the contrast requirement holds on every surface of the theme.
 *
 * 标签所处的背景色，取自主题的 CSS 变量。
 * 使用浅色模式中最暗的背景与深色模式中最亮的背景，以确保在主题的任意背景上都满足对比度要求。
 */
const LIGHT_TAG_SURFACE: RGBColor = [246, 246, 247] // `--vp-c-bg-alt`
const DARK_TAG_SURFACE: RGBColor = [32, 33, 39] // `--vp-c-bg-soft`

/**
 * Page backgrounds, which become the text color when a tag is hovered.
 *
 * 页面背景色，在标签 hover 时会作为文本颜色。
 */
const LIGHT_PAGE_BG: RGBColor = [255, 255, 255] // `--vp-c-bg`
const DARK_PAGE_BG: RGBColor = [27, 27, 31] // `--vp-c-bg`

/**
 * Prepare article tag colors
 *
 * 准备文章标签颜色，收集页面中使用的标签并生成对应的 CSS 和 JS 文件
 */
export async function prepareArticleTagColors(app: App): Promise<void> {
  perf.mark('prepare:tag-colors')
  const { js, css } = genCode(app)

  await writeTemp(app, 'internal/articleTagColors.css', css)
  await writeTemp(app, 'internal/articleTagColors.js', js)

  perf.log('prepare:tag-colors')
}

/**
 * Generate tag color CSS and JS code
 *
 * 生成标签颜色的 CSS 和 JS 代码，遍历所有页面收集标签并生成对应的样式和脚本
 */
export function genCode(app: App): { js: string, css: string } {
  const articleTagColors = new Map<string, string>()
  const tagColors = new Map<string, TagColors>()

  app.pages.forEach((page) => {
    const { frontmatter: { tags } } = page
    if (!tags)
      return

    toArray(tags).forEach((tag) => {
      if (!tag)
        return

      const name = tag as string
      if (articleTagColors.has(name))
        return

      const className = getTagClassName(name)
      articleTagColors.set(name, className)
      // Colors are resolved from the tag text, tags sharing a hash share a class.
      if (!tagColors.has(className))
        tagColors.set(className, resolveTagColors(name))
    })
  })

  const js = genTempCode(app, {
    name: 'articleTagColors',
    content: Object.fromEntries(articleTagColors.entries()),
    before: `import './articleTagColors.css'`,
  })
  const css = [...tagColors]
    .map(([className, colors]) => genTagCSS(className, colors))
    .join('')

  return { js, css }
}

/**
 * Resolve the class name suffix of a tag.
 * It is derived from the tag text, so a tag keeps the same class name for good.
 *
 * 解析标签的类名后缀。它由标签文本计算而来，因此标签的类名是固定的。
 *
 * @param tag - Tag text / 标签文本
 * @returns Class name suffix / 类名后缀
 */
export function getTagClassName(tag: string): string {
  return hashTag(tag).toString(36)
}

/**
 * Resolve the colors of a tag, they are only determined by the tag text.
 *
 * 解析标签的配色，仅由标签文本决定。
 *
 * @param tag - Tag text / 标签文本
 * @returns Tag colors of both color modes / 两种颜色模式下的标签配色
 */
export function resolveTagColors(tag: string): TagColors {
  const hash = hashTag(tag)
  const hue = hash % 360
  const saturation = SATURATION_RANGE[0]
    + (hash >>> 9) % 100 / 100 * (SATURATION_RANGE[1] - SATURATION_RANGE[0])

  return {
    light: resolveLightColorScheme(hue, saturation),
    dark: resolveDarkColorScheme(hue, saturation),
  }
}

/**
 * Hash the tag text with FNV-1a (32 bit), which is stable across builds and
 * independent of the collection of tags, so the tag-color mapping never drifts.
 *
 * 使用 FNV-1a（32 位）对标签文本进行哈希，结果在不同构建之间保持稳定，
 * 且与标签集合无关，因此标签与颜色的对应关系不会发生变化。
 *
 * @param tag - Tag text / 标签文本
 * @returns Unsigned 32 bit hash / 无符号 32 位哈希值
 */
function hashTag(tag: string): number {
  const text = tag.trim().toLowerCase()
  let hash = 0x811C9DC5

  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }

  // Avalanche the hash (murmur3 `fmix32`), so that similar tags do not end up
  // with similar hues, e.g. `tag-1` / `tag-2` / `tag-3`.
  hash ^= hash >>> 16
  hash = Math.imul(hash, 0x85EBCA6B)
  hash ^= hash >>> 13
  hash = Math.imul(hash, 0xC2B2AE35)
  hash ^= hash >>> 16

  return hash >>> 0
}

/**
 * Resolve the colors used in light mode.
 *
 * 解析浅色模式下使用的颜色。
 *
 * @param hue - Hue in degrees / 色相
 * @param saturation - Saturation, `0-1` / 饱和度
 */
function resolveLightColorScheme(hue: number, saturation: number): TagColorScheme {
  // The text must stay readable on its own tinted background.
  const textLightness = searchLightest((lightness) => {
    const color = resolveColor(hue, saturation, lightness)
    return isAccessible(color, resolveTintedBackground(color, LIGHT_TAG_SURFACE))
  })

  // On hover the page background becomes the text color and the hover color
  // becomes the background, so it must be readable against the page background too.
  const hoverBoundary = searchLightest(lightness =>
    isAccessible(resolveColor(hue, saturation, lightness), LIGHT_PAGE_BG),
  )

  // Darker than the text color, so the hover state is visibly different.
  const hoverLightness = Math.max(
    0,
    Math.min(textLightness - HOVER_LIGHTNESS_OFFSET, hoverBoundary),
  )

  return createColorScheme(
    resolveColor(hue, saturation, textLightness),
    resolveColor(hue, saturation, hoverLightness),
  )
}

/**
 * Resolve the colors used in dark mode.
 *
 * 解析深色模式下使用的颜色。
 *
 * @param hue - Hue in degrees / 色相
 * @param saturation - Saturation, `0-1` / 饱和度
 */
function resolveDarkColorScheme(hue: number, saturation: number): TagColorScheme {
  const textLightness = searchDarkest((lightness) => {
    const color = resolveColor(hue, saturation, lightness)
    return isAccessible(color, resolveTintedBackground(color, DARK_TAG_SURFACE))
  })

  const hoverBoundary = searchDarkest(lightness =>
    isAccessible(resolveColor(hue, saturation, lightness), DARK_PAGE_BG),
  )

  // Lighter than the text color, so the hover state is visibly different.
  const hoverLightness = Math.min(
    1,
    Math.max(textLightness + HOVER_LIGHTNESS_OFFSET, hoverBoundary),
  )

  return createColorScheme(
    resolveColor(hue, saturation, textLightness),
    resolveColor(hue, saturation, hoverLightness),
  )
}

/**
 * Resolve an HSL color, rounded the same way the browser renders it.
 *
 * 解析 HSL 颜色，并按浏览器的渲染方式取整。
 *
 * @param hue - Hue in degrees / 色相
 * @param saturation - Saturation, `0-1` / 饱和度
 * @param lightness - Lightness, `0-1` / 亮度
 */
function resolveColor(hue: number, saturation: number, lightness: number): RGBColor {
  return roundColor(hslToRgb(hue, saturation, lightness))
}

/**
 * Resolve the background of a tag: the color itself with a low alpha, composited
 * over the surface the tag is rendered on.
 *
 * 解析标签的背景色：颜色本身以较低的透明度叠加在标签所处的背景上。
 *
 * @param color - Tag text color / 标签文本颜色
 * @param surface - Surface behind the tag / 标签所处的背景色
 */
function resolveTintedBackground(color: RGBColor, surface: RGBColor): RGBColor {
  return roundColor(compositeColor(color, BACKGROUND_ALPHA, surface))
}

/**
 * Check whether a color is readable enough on the given background.
 *
 * 检查颜色在指定背景上是否具有足够的对比度。
 *
 * @param color - Text color / 文本颜色
 * @param background - Background color / 背景色
 */
function isAccessible(color: RGBColor, background: RGBColor): boolean {
  return contrastRatio(color, background) >= MIN_CONTRAST_RATIO
}

/**
 * Search the brightest lightness that still meets the contrast requirement,
 * `pass` must hold for every lightness darker than the boundary.
 *
 * 搜索仍满足对比度要求的最亮亮度，`pass` 必须在边界以下的所有亮度上都成立。
 *
 * @param pass - Contrast check / 对比度检查
 * @returns Lightness, `0-1` / 亮度
 */
function searchLightest(pass: (lightness: number) => boolean): number {
  let low = 0
  let high = 1

  for (let i = 0; i < LIGHTNESS_SEARCH_STEPS; i++) {
    const mid = (low + high) / 2
    if (pass(mid))
      low = mid
    else
      high = mid
  }

  return low
}

/**
 * Search the darkest lightness that still meets the contrast requirement,
 * `pass` must hold for every lightness lighter than the boundary.
 *
 * 搜索仍满足对比度要求的最暗亮度，`pass` 必须在边界以上的所有亮度上都成立。
 *
 * @param pass - Contrast check / 对比度检查
 * @returns Lightness, `0-1` / 亮度
 */
function searchDarkest(pass: (lightness: number) => boolean): number {
  let low = 0
  let high = 1

  for (let i = 0; i < LIGHTNESS_SEARCH_STEPS; i++) {
    const mid = (low + high) / 2
    if (pass(mid))
      high = mid
    else
      low = mid
  }

  return high
}

/**
 * Create a tag color scheme from the resolved colors.
 *
 * 由解析出的颜色创建标签配色。
 *
 * @param color - Text color / 文本颜色
 * @param hoverColor - Hover color / hover 颜色
 */
function createColorScheme(color: RGBColor, hoverColor: RGBColor): TagColorScheme {
  return {
    color: toRgbColor(color),
    hoverColor: toRgbColor(hoverColor),
    backgroundColor: toRgbColor(color, BACKGROUND_ALPHA),
  }
}

/**
 * Generate the CSS of a tag, including its dark mode colors.
 *
 * 生成单个标签的 CSS，包含其深色模式下的颜色。
 *
 * @param className - Class name suffix / 类名后缀
 * @param colors - Tag colors / 标签配色
 */
function genTagCSS(className: string, colors: TagColors): string {
  const { light, dark } = colors

  return `\
.vp-tag-${className} {
  --vp-tag-color: ${light.color};
  --vp-tag-hover-color: ${light.hoverColor};
  --vp-tag-bg: ${light.backgroundColor};
}

[data-theme="dark"] .vp-tag-${className} {
  --vp-tag-color: ${dark.color};
  --vp-tag-hover-color: ${dark.hoverColor};
  --vp-tag-bg: ${dark.backgroundColor};
}
`
}
