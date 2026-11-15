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
 * 生成所有自定义调色板的样式表。
 *
 * 内置档位在 `styles/reader.css` 中，这里只输出用户自定义的调色板。
 * 样式被注入到 `build.html` 的阅读偏好脚本之前，首帧即使用已存储的调色板。
 *
 * @param locales - Locales that enabled the feature / 启用了该功能的语言
 * @returns The `<style>` tag, or an empty string when there is nothing to emit
 */
export function generateReaderPaletteStyle(locales: ReaderScriptLocale[]): string {
  const rules: string[] = []
  const seen = new Set<string>()

  for (const { options } of locales) {
    for (const [attribute, palettes] of [
      [READER_THEME_ATTRIBUTE, options.theme?.presets],
      [READER_BRAND_ATTRIBUTE, options.brand?.presets],
    ] as const) {
      for (const palette of palettes ?? []) {
        // 内置档位的令牌在 CSS 里，这里只处理自定义调色板
        if (!Object.keys(palette.tokens).length)
          continue

        const key = `${attribute}:${palette.name}`
        if (seen.has(key))
          continue

        seen.add(key)
        rules.push(paletteRule(attribute, palette.name, palette.tokens))
      }
    }
  }

  if (!rules.length)
    return ''

  return rules.join('\n\n')
}
