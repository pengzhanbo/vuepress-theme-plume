import { templateRenderer, type TemplateRendererContext } from 'vuepress/utils'
import { getThemePackage } from '../utils/index.js'

export function templateBuildRenderer(template: string, context: TemplateRendererContext) {
  const pkg = getThemePackage()
  template = template
    .replace('{{ themeVersion }}', pkg.version || '')
    .replace(/^\s+|\s+$/gm, '')
    .replace(/\n/g, '')
  return templateRenderer(template, context)
}
