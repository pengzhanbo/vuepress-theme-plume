import type { ResolvedData } from './types.js'
import { kebabCase } from '@pengzhanbo/utils'
import handlebars from 'handlebars'

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
}

handlebars.registerHelper('removeLeadingSlash', (path: string) => path.replace(/^\//, ''))
handlebars.registerHelper('equal', (a: string, b: string) => a === b)

/**
 * Create render function with Handlebars template engine
 *
 * 使用 Handlebars 模板引擎创建渲染函数
 *
 * @param result - Resolved configuration data / 解析后的配置数据
 * @returns Render function that processes Handlebars templates / 处理 Handlebars 模板的渲染函数
 */
export function createRender(result: ResolvedData) {
  const data: RenderData = {
    ...result,
    name: kebabCase(result.siteName),
    isEN: result.defaultLanguage === 'en-US',
    locales: result.defaultLanguage === 'en-US'
      ? [
          { path: '/', lang: 'en-US', isEn: true, prefix: 'en' },
          { path: '/zh/', lang: 'zh-CN', isEn: false, prefix: 'zh' },
        ]
      : [
          { path: '/', lang: 'zh-CN', isEn: false, prefix: 'zh' },
          { path: '/en/', lang: 'en-US', isEn: true, prefix: 'en' },
        ],
  }
  return function render(source: string): string {
    try {
      const template = handlebars.compile(source)
      return template(data)
    }
    catch (e) {
      console.error(e)
      return source
    }
  }
}
