import type { ResolvedData } from './types.js'
import { kebabCase } from '@pengzhanbo/utils'
import { Eta } from 'eta'

/**
 * Extended resolved data with additional rendering information
 *
 * 扩展的解析数据，包含额外的渲染信息
 */
export interface RenderData extends ResolvedData {
  /** Project name in kebab-case / 项目名称（kebab-case 格式） */
  name: string
  /** Site name / 网站名称 */
  siteName: string
  /** Site name escaped for a single-quoted JS string literal / 转义后的站点名称，用于单引号 JS 字符串字面量 */
  escapedSiteName: string
  /** Site description escaped for a single-quoted JS string literal / 转义后的站点描述，用于单引号 JS 字符串字面量 */
  escapedSiteDescription: string
  /** Locale configuration array / 语言配置数组 */
  locales: { path: string, lang: string, isEn: boolean, prefix: string }[]
  /** Whether default language is English / 默认语言是否为英语 */
  isEN: boolean

  t: (en: string, zh: string) => string
}

/**
 * Escape a value so it can be embedded in a single-quoted JS string literal.
 *
 * User input is interpolated into generated TypeScript config files. Eta's
 * `<%= %>` HTML-escapes its value, which corrupts text (`'` becomes `&#39;`)
 * and cannot prevent a backslash or a line break from breaking the literal.
 * Escaping here and emitting the result with the raw `<%~ %>` tag keeps any
 * input syntactically valid.
 *
 * 将值转义，使其可安全嵌入单引号 JS 字符串字面量。
 *
 * 用户输入会被插入生成的 TypeScript 配置文件中。Eta 的 `<%= %>` 会做 HTML 转义，
 * 既会破坏文本（`'` 变成 `&#39;`），也无法阻止反斜杠或换行破坏字符串字面量。
 * 在此处转义并用原始标签 `<%~ %>` 输出，可保证任意输入在语法上合法。
 *
 * @param value - Raw value / 原始值
 * @returns Escaped value / 转义后的值
 */
function escapeJsString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, '\\\'')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function createRender(result: ResolvedData) {
  const eta = new Eta({
    functionHeader: 'const t = it.t',
  })

  const isEN = result.defaultLanguage === 'en-US'

  const data: RenderData = {
    ...result,
    name: kebabCase(result.siteName),
    escapedSiteName: escapeJsString(result.siteName),
    escapedSiteDescription: escapeJsString(result.siteDescription),
    isEN,
    locales: isEN
      ? [
          { path: '/', lang: 'en-US', isEn: true, prefix: 'en' },
          { path: '/zh/', lang: 'zh-CN', isEn: false, prefix: 'zh' },
        ]
      : [
          { path: '/', lang: 'zh-CN', isEn: false, prefix: 'zh' },
          { path: '/en/', lang: 'en-US', isEn: true, prefix: 'en' },
        ],
    t: (en: string, zh: string) => isEN ? en : zh,
  }
  return function render(source: string): string {
    return eta.renderString(source, data)
  }
}
