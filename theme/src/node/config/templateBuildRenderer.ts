import type { PlumeThemeLocaleOptions } from '../../shared/index.js'
import { templateRenderer, type TemplateRendererContext } from 'vuepress/utils'
import { getThemePackage } from '../utils/index.js'

export function templateBuildRenderer(
  template: string,
  context: TemplateRendererContext,
  options: PlumeThemeLocaleOptions,
) {
  const pkg = getThemePackage()
  template = template
    .replace('{{ themeVersion }}', pkg.version || '')
    .replace(/^\s+|\s+$/gm, '')
    .replace(/\n/g, '')

  if (options.appearance ?? true) {
    const appearance = typeof options.appearance === 'string'
      ? options.appearance
      : 'auto'
    const script = appearance === 'force-dark'
      ? `document.documentElement.dataset.theme = 'dark'`
      : `;(function () {
    const um= localStorage.getItem('vuepress-theme-appearance') || '${appearance}';
    const sm = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = um === 'dark' || (um !== 'light' && sm);
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  })();`.replace(/^\s+|\s+$/gm, '').replace(/\n/g, '')

    template = template
      .replace('<!--vuepress-theme-plume-appearance-->', `<script id="check-dark-mode">${script}</script>`)
  }
  else {
    template = template.replace('<!--vuepress-theme-plume-appearance-->', '')
  }
  return templateRenderer(template, context)
}
