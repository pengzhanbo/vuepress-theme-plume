import type { App } from 'vuepress'
import { describe, expect, it } from 'vitest'
import {
  genCode,
  getTagClassName,
  resolveTagColors,
} from '../src/node/prepare/prepareArticleTagColor.js'
import {
  compositeColor,
  contrastRatio,
  relativeLuminance,
  roundColor,
} from '../src/node/utils/color.js'

type RGB = readonly [number, number, number]

/** WCAG 2.x AA contrast ratio for normal text. */
const MIN_CONTRAST = 4.5

/** Tag background alpha used by the generated colors. */
const BACKGROUND_ALPHA = 0.14

/** Surfaces behind the tags, taken from `theme/src/client/styles/vars.css`. */
const LIGHT_SURFACE: RGB = [246, 246, 247] // --vp-c-bg-alt
const DARK_SURFACE: RGB = [32, 33, 39] // --vp-c-bg-soft

/** Page backgrounds, which become the text color on hover. */
const LIGHT_PAGE_BG: RGB = [255, 255, 255] // --vp-c-bg
const DARK_PAGE_BG: RGB = [27, 27, 31] // --vp-c-bg

/** Parse a `rgb()` / `rgba()` color, the alpha is `1` when omitted. */
function parseColor(value: string): { color: RGB, alpha: number } {
  const match = value.match(/^rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)$/)
  if (!match)
    throw new Error(`Invalid rgb color: ${value}`)

  return {
    color: [Number(match[1]), Number(match[2]), Number(match[3])],
    alpha: match[4] === undefined ? 1 : Number(match[4]),
  }
}

/** Resolve the RGB channels of a `rgb()` / `rgba()` color. */
function rgbOf(value: string): RGB {
  return parseColor(value).color
}

/** Contrast between a tag text color and its tinted background. */
function tintedContrast(color: string, backgroundColor: string, surface: RGB): number {
  const { color: tint, alpha } = parseColor(backgroundColor)
  return contrastRatio(
    rgbOf(color),
    roundColor(compositeColor(tint, alpha, surface)),
  )
}

/** A tag list that covers the whole hue range and both latin and cjk text. */
const TAGS: string[] = [
  ...Array.from({ length: 360 }, (_, index) => `tag-${index}`),
  'Vue',
  'VuePress',
  'TypeScript',
  'Markdown',
  'CSS',
  '无障碍',
  '设计',
  '前端工程化',
  'a11y',
]

function createApp(tags: string[][]): App {
  return {
    pages: tags.map(pageTags => ({ frontmatter: { tags: pageTags } })),
    env: { isDev: false },
  } as unknown as App
}

describe('getTagClassName', () => {
  it('derives a stable class name from the tag text', () => {
    expect(getTagClassName('VuePress')).toBe(getTagClassName('VuePress'))
    expect(getTagClassName('VuePress')).toMatch(/^[0-9a-z]+$/)
  })

  it('ignores case and surrounding spaces', () => {
    expect(getTagClassName(' VuePress ')).toBe(getTagClassName('vuepress'))
  })

  it('does not collide for common tags', () => {
    const classNames = new Set(TAGS.map(tag => getTagClassName(tag)))
    expect(classNames.size).toBe(TAGS.length)
  })
})

describe('resolveTagColors', () => {
  it('only depends on the tag text', () => {
    // 与标签集合、预设顺序无关：同一标签在任何构建中都得到相同的颜色。
    expect(resolveTagColors('VuePress')).toEqual(resolveTagColors('VuePress'))
  })

  it('ignores case and surrounding spaces', () => {
    expect(resolveTagColors(' VuePress ')).toEqual(resolveTagColors('vuepress'))
  })

  it('returns rgb text colors and an rgba background', () => {
    const { light, dark } = resolveTagColors('blog')

    for (const scheme of [light, dark]) {
      expect(scheme.color).toMatch(/^rgb\(\d+, \d+, \d+\)$/)
      expect(scheme.hoverColor).toMatch(/^rgb\(\d+, \d+, \d+\)$/)
      expect(scheme.backgroundColor).toMatch(/^rgba\(\d+, \d+, \d+, 0\.14\)$/)
    }
  })

  it('meets the WCAG AA contrast ratio in light mode', () => {
    for (const tag of TAGS) {
      const { light } = resolveTagColors(tag)
      const { alpha } = parseColor(light.backgroundColor)

      expect(alpha).toBe(BACKGROUND_ALPHA)
      // 文本与其自身的浅色背景
      expect(tintedContrast(light.color, light.backgroundColor, LIGHT_SURFACE))
        .toBeGreaterThanOrEqual(MIN_CONTRAST)
      // hover 时页面背景色作为文本颜色
      expect(contrastRatio(rgbOf(light.hoverColor), LIGHT_PAGE_BG))
        .toBeGreaterThanOrEqual(MIN_CONTRAST)
      // hover 颜色必须比文本颜色更暗，才能形成 hover 反馈
      expect(relativeLuminance(rgbOf(light.hoverColor)))
        .toBeLessThan(relativeLuminance(rgbOf(light.color)))
    }
  })

  it('meets the WCAG AA contrast ratio in dark mode', () => {
    for (const tag of TAGS) {
      const { dark } = resolveTagColors(tag)

      expect(tintedContrast(dark.color, dark.backgroundColor, DARK_SURFACE))
        .toBeGreaterThanOrEqual(MIN_CONTRAST)
      // hover 时页面背景色作为文本颜色
      expect(contrastRatio(rgbOf(dark.hoverColor), DARK_PAGE_BG))
        .toBeGreaterThanOrEqual(MIN_CONTRAST)
      // 深色模式下 hover 颜色必须比文本颜色更亮
      expect(relativeLuminance(rgbOf(dark.hoverColor)))
        .toBeGreaterThan(relativeLuminance(rgbOf(dark.color)))
    }
  })

  it('keeps the saturation in a vivid range', () => {
    for (const tag of TAGS) {
      const { light } = resolveTagColors(tag)
      const [red, green, blue] = rgbOf(light.color)
      const max = Math.max(red, green, blue)
      const min = Math.min(red, green, blue)

      // 颜色不能退化为灰色，否则所有标签看起来都一样。
      expect(max - min).toBeGreaterThan(10)
    }
  })
})

describe('genCode', () => {
  const app = createApp([['Vue', 'Vite'], ['Vue', '无障碍'], []])
  const { js, css } = genCode(app)
  const classNames = ['Vue', 'Vite', '无障碍'].map(tag => getTagClassName(tag))

  it('maps every tag to its class name', () => {
    const vue = getTagClassName('Vue')
    const vite = getTagClassName('Vite')
    const cjk = getTagClassName('无障碍')

    expect(js).toContain(`import './articleTagColors.css'`)
    expect(js).toContain(`"Vue":"${vue}"`)
    expect(js).toContain(`"Vite":"${vite}"`)
    expect(js).toContain(`"无障碍":"${cjk}"`)
  })

  it('generates one light and one dark rule for each tag', () => {
    const lightRules = css.match(/^\.vp-tag-([0-9a-z]+) \{/gm) ?? []
    const darkRules = css.match(/^\[data-theme="dark"\] \.vp-tag-([0-9a-z]+) \{/gm) ?? []

    expect(lightRules).toHaveLength(classNames.length)
    expect(darkRules).toHaveLength(classNames.length)
    for (const className of classNames) {
      expect(css).toContain(`.vp-tag-${className} {`)
      expect(css).toContain(`[data-theme="dark"] .vp-tag-${className} {`)
    }
  })

  it('declares the three tag color variables', () => {
    expect(css).toContain('--vp-tag-color: rgb(')
    expect(css).toContain('--vp-tag-hover-color: rgb(')
    expect(css).toContain('--vp-tag-bg: rgba(')
    // 每个标签 3 个变量 × 2 种模式
    const declarations = css.match(/^\s+--vp-tag-(?:hover-color|color|bg):/gm) ?? []
    expect(declarations).toHaveLength(classNames.length * 3 * 2)
  })
})
