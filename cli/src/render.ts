import type { ResolvedData } from './types.js'
import { kebabCase } from '@pengzhanbo/utils'
import handlebars from 'handlebars'

export interface RenderData extends ResolvedData {
  name: string
  siteName: string
  locales: { path: string, lang: string, isEn: boolean, prefix: string }[]
  isEN: boolean
}

handlebars.registerHelper('removeLeadingSlash', (path: string) => path.replace(/^\//, ''))
handlebars.registerHelper('equal', (a: string, b: string) => a === b)

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
