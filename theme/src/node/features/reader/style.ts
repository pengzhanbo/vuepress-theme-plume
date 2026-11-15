import type { ReaderScriptLocale } from './options.js'

// 承载护眼背景调色板名称的属性
export const READER_THEME_ATTRIBUTE = 'data-reader-theme'
// 承载品牌色调色板名称的属性
export const READER_BRAND_ATTRIBUTE = 'data-reader-brand'

/**
 * Build the CSS of one palette rule.
 *
 * 生成单条调色板规则的 CSS。
 *
 * @param attribute - Attribute name / 属性名
 * @param name - Palette name / 调色板名称
 * @param tokens - CSS custom properties / CSS 自定义属性
 */
function paletteRule(
  attribute: string,
  name: string,
  tokens: Record<string, string>,
): string {
  const body = Object.entries(tokens)
    .map(([property, value]) => `  ${property}: ${value}`)
    .join(';\n')

  return `html[${attribute}="${name}"] {\n${body};\n}\n`
}

/**
 * Generate the stylesheet of every custom palette.
 *
 * The built-in presets live in `styles/reader.css`, only user defined palettes
 * are emitted here. The style is injected into `build.html` before the reader
 * script so the first paint already uses the stored palette.
 *
 * Palettes are scoped by the locale value computed at build time, so that two
 * locales may define the same palette name with different tokens.
 *
 * 生成所有自定义调色板的样式表。
 *
 * 内置档位在 `styles/reader.css` 中，这里只输出用户自定义的调色板。
 * 样式被注入到 `build.html` 的阅读偏好脚本之前，首帧即使用已存储的调色板。
 *
 * 调色板按构建期计算的语言作用域值生成选择器，因此不同语言的同名调色板
 * 可以使用各自的令牌。
 *
 * @param locales - Configured locales, disabled ones are skipped
 * 已配置的语言，关闭的语言会被跳过
 * @returns The stylesheet, or an empty string when there is nothing to emit
 */
export function generateReaderPaletteStyle(locales: ReaderScriptLocale[]): string {
  const rules: string[] = []
  const seen = new Set<string>()

  for (const { prefix, options } of locales) {
    if (!options)
      continue

    for (const [attribute, palettes] of [
      [READER_THEME_ATTRIBUTE, options.theme?.presets],
      [READER_BRAND_ATTRIBUTE, options.brand?.presets],
    ] as const) {
      for (const palette of palettes ?? []) {
        // 内置档位的令牌在 CSS 里，这里只处理自定义调色板
        if (!Object.keys(palette.tokens).length)
          continue

        // 同名调色板在不同语言中可能有不同的令牌，选择器的值带有语言身份
        const value = palette.attribute ?? palette.name
        const key = `${attribute}:${prefix}:${value}`
        if (seen.has(key))
          continue

        seen.add(key)
        rules.push(paletteRule(attribute, value, palette.tokens))
      }
    }
  }

  if (!rules.length)
    return ''

  return rules.join('\n\n')
}
