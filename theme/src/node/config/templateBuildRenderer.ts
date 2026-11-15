import type { App } from 'vuepress'
import type { TemplateRendererContext } from 'vuepress/utils'
import { templateRenderer } from 'vuepress/utils'
import {
  collectReaderLocales,
  generateReaderScript,
  READER_SCRIPT_PLACEHOLDER,
  wrapReaderScript,
} from '../features/reader/index.js'
import { getThemeOptions } from '../options.js'
import { getThemePackage } from '../utils/index.js'

const SPACE_TRIM_REG = /^\s+|\s+$/gm
const NEWLINE_TRIM_REG = /\n/g

/**
 * Resolve the palette stylesheet and the inline script that apply the reader
 * preferences before the first paint.
 *
 * 生成首帧前应用阅读偏好的调色板样式表与内联脚本。
 *
 * @param base - Site base / 站点 `base`
 */
function resolveReaderInjection(base: string): string {
  const locales = collectReaderLocales(getThemeOptions())
  const script = generateReaderScript(locales, base)

  return `${script ? wrapReaderScript(script) : ''}`
}

export function templateBuildRenderer(
  app: App,
  template: string,
  context: TemplateRendererContext,
): Promise<string> | string {
  const options = getThemeOptions()
  const pkg = getThemePackage()
  const base = app.options.base || '/'
  template = template
    .replace('{{ themeVersion }}', pkg.version || '')
    .replace(SPACE_TRIM_REG, '')
    .replace(NEWLINE_TRIM_REG, '')

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

  // 阅读偏好脚本必须在 appearance 脚本之后执行，才能判断首帧是否为深色。
  template = template.replace(READER_SCRIPT_PLACEHOLDER, resolveReaderInjection(base))

  return templateRenderer(template, context)
}
