import type { Page, Theme } from 'vuepress/core'
import { templateRenderer } from 'vuepress/utils'
import type { PlumeThemeOptions, PlumeThemePageData } from '../shared/index.js'
import { mergeLocaleOptions } from './defaultOptions.js'
import { setupPlugins } from './plugins.js'
import { extendsPageData, setupPage } from './setupPages.js'
import { getThemePackage, resolve, templates } from './utils.js'

const THEME_NAME = 'vuepress-theme-plume'

export function plumeTheme({
  themePlugins,
  plugins,
  ...localeOptions
}: PlumeThemeOptions = {}): Theme {
  const pluginsOptions = plugins ?? themePlugins ?? {}
  const pkg = getThemePackage()

  return (app) => {
    localeOptions = mergeLocaleOptions(app, localeOptions)
    return {
      name: THEME_NAME,
      templateBuild: templates('build.html'),
      clientConfigFile: resolve('client/config.js'),
      plugins: setupPlugins(app, pluginsOptions, localeOptions),
      onInitialized: app => setupPage(app, localeOptions),
      extendsPage: (page) => {
        extendsPageData(app, page as Page<PlumeThemePageData>, localeOptions)

        page.frontmatter.head ??= []
        if (localeOptions.appearance ?? true) {
          const appearance = typeof localeOptions.appearance === 'string'
            ? localeOptions.appearance
            : 'auto'

          page.frontmatter.head.push([
            'script',
            { id: 'check-dark-mode' },
            appearance === 'force-dark'
              ? `document.documentElement.classList.add('dark')`
              : `;(function () {
        const um= localStorage.getItem('vuepress-theme-appearance') || '${appearance}';
        const sm = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (um === 'dark' || (um !== 'light' && sm)) {
          document.documentElement.classList.add('dark');
        }
      })();`,
          ])
        }

        page.frontmatter.head?.push([
          'script',
          { id: 'check-mac-os' },
          `document.documentElement.classList.toggle('mac', /Mac|iPhone|iPod|iPad/i.test(navigator.platform))`,
        ])
      },
      templateBuildRenderer(template, context) {
        template = template
          .replace('{{ themeVersion }}', pkg.version || '')
          .replace(/^\s+|\s+$/gm, '')
          .replace(/\n/g, '')
        return templateRenderer(template, context)
      },
    }
  }
}
