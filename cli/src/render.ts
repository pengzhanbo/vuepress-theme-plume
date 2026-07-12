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
  /** Locale configuration array / 语言配置数组 */
  locales: { path: string, lang: string, isEn: boolean, prefix: string }[]
  /** Whether default language is English / 默认语言是否为英语 */
  isEN: boolean

  t: (en: string, zh: string) => string
}

export function createRender(result: ResolvedData) {
  const eta = new Eta({
    functionHeader: 'const t = it.t',
  })

  const isEN = result.defaultLanguage === 'en-US'

  const data: RenderData = {
    ...result,
    name: kebabCase(result.siteName),
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
