import { type TemplateRendererContext, templateRenderer } from 'vuepress/utils'
import { getThemePackage } from '../utils.js'

export function templateBuildRenderer(template: string, context: TemplateRendererContext) {
  const pkg = getThemePackage()
  template = template
    .replace('{{ themeVersion }}', pkg.version || '')
    .replace(/^\s+|\s+$/gm, '')
    .replace(/\n/g, '')
  return templateRenderer(template, context)
}
