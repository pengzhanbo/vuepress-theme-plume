import type { App, Page, Theme } from '@vuepress/core'
import { fs, getDirname, path, templateRenderer } from '@vuepress/utils'
import type { PlumeThemeOptions, PlumeThemePageData } from '../shared/index.js'
import { mergeLocaleOptions } from './defaultOptions.js'
import { setupPlugins } from './plugins.js'
import { extendsPageData, setupPage } from './setupPages.js'

const __dirname = getDirname(import.meta.url)
const name = 'vuepress-theme-plume'
const resolve = (...args: string[]) => path.resolve(__dirname, '../', ...args)
const templates = (url: string) => resolve('../templates', url)

function getThemePackage() {
  let pkg = {} as any
  try {
    const content = fs.readFileSync(resolve('../package.json'), 'utf-8')
    pkg = JSON.parse(content)
  }
  catch {}
  return pkg
}

export function plumeTheme({
  themePlugins = {},
  ...localeOptions
}: PlumeThemeOptions = {}): Theme {
  localeOptions = mergeLocaleOptions(localeOptions)
  const pkg = getThemePackage()
  return (app: App) => {
    return {
      name,
      templateBuild: templates('build.html'),
      clientConfigFile: resolve('client/config.js'),
      plugins: setupPlugins(app, themePlugins, localeOptions),
      onInitialized: app => setupPage(app, localeOptions),
      extendsPage: (page: Page<PlumeThemePageData>) =>
        extendsPageData(app, page, localeOptions),
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
