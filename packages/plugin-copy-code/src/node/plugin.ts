import path from 'path'
import type { App, Plugin } from '@vuepress/core'
import type { CopyCodeLocaleOption, CopyCodeOptions } from '../shared'

const defaultOptions: CopyCodeOptions = {
  selector: '.theme-default-content dev[class*="language-"] pre',
  duration: 300,
  delay: 500,
  showInMobile: false,
}

const defaultLocalesOption: CopyCodeLocaleOption = {
  '/zh/': {
    hint: '复制成功',
    copy: '复制代码',
  },
  '/en/': {
    hint: 'Copied successfully',
    copy: 'Copy code',
  },
}

export const copyCodePlugin = (options: CopyCodeOptions): Plugin => {
  const locales = options.locales || {}
  delete options.locales

  options = Object.assign({}, defaultOptions, options)
  const localesOption = Object.assign({}, defaultLocalesOption, locales)
  return (app: App) => {
    return {
      name: '@vuepress-plume/vuepress-plugin-copy-code',
      define: (): Record<string, unknown> => ({
        COPY_CODE_OPTIONS: options,
        COPY_CODE_LOCALES_OPTIONS: localesOption,
      }),
      clientAppSetupFiles: path.resolve(
        __dirname,
        '../client/clientAppSetup.js'
      ),
    }
  }
}
